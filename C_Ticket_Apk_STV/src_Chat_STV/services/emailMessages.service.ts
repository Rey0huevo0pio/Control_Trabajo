import api, { API_CONFIG, getAuthToken } from '../../src/services/api';
import { emailCacheService, CachedEmail, FolderSyncState } from './emailCache.service';

// ==========================================
// INTERFACES
// ==========================================
export interface EmailMessage {
  id: string;
  uid: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  attachments: any[];
  seen: boolean;
  flagged: boolean;
  folder: string;
}

export interface EmailFolder {
  name: string;
  path: string;
  unread: number;
  total: number;
}

export interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string;
  bcc?: string;
  attachments?: string[];
}

export interface EmailConfig {
  id: string;
  email: string;
  displayName: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  lastSync: string | null;
  verified: boolean;
}

export interface SyncResult {
  success: boolean;
  newEmails: number;
  totalEmails: number;
  message: string;
  fromCache: boolean;
}

// ==========================================
// SERVICIO DE CORREO CON CACHÉ INTELIGENTE
// ==========================================
class EmailMessagesService {
  // Obtener correos con caché inteligente
  async getMessages(folder: string = 'INBOX', page: number = 1, limit: number = 50): Promise<{
    emails: EmailMessage[];
    total: number;
    fromCache: boolean;
    message: string;
  }> {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('⚠️ [EmailMessages] Sin token, usando caché local');
        const cached = await emailCacheService.getCachedEmails(folder);
        return {
          emails: cached,
          total: cached.length,
          fromCache: true,
          message: 'Usando caché local (sin sesión)',
        };
      }

      // Verificar si hay caché y si necesita sincronización
      const cachedEmails = await emailCacheService.getCachedEmails(folder);
      const needsFullSync = await emailCacheService.needsFullSync(folder);

      // Si hay caché reciente y no necesita sync completo, devolver caché inmediatamente
      if (cachedEmails.length > 0 && !needsFullSync) {
        console.log('📦 [EmailMessages] Usando caché local:', cachedEmails.length, 'correos');
        
        // Sincronizar en segundo plano solo si hay correos nuevos
        this.syncInBackground(folder, token);
        
        return {
          emails: cachedEmails.slice(0, limit),
          total: cachedEmails.length,
          fromCache: true,
          message: 'Cargado desde caché local',
        };
      }

      // Si no hay caché o necesita sync completo, cargar desde servidor
      console.log('🌐 [EmailMessages] Cargando desde servidor...');
      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: { folder, page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📩 [EmailMessages] Respuesta del servidor:', JSON.stringify(response.data, null, 2));
      
      // El backend puede devolver los datos en diferentes formatos
      let emailsList: EmailMessage[] = [];
      if (response.data.success && response.data.data?.emails) {
        emailsList = response.data.data.emails;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        emailsList = response.data.data;
      } else if (response.data.emails && Array.isArray(response.data.emails)) {
        emailsList = response.data.emails;
      } else if (Array.isArray(response.data)) {
        emailsList = response.data;
      }
      
      // Agregar folder a cada email
      emailsList = emailsList.map(e => ({ ...e, folder }));
      
      console.log('📩 [EmailMessages] Correos encontrados:', emailsList.length);
      
      // Guardar en caché
      if (emailsList.length > 0) {
        await emailCacheService.saveEmails(emailsList, folder);
        await emailCacheService.saveFolderState(folder, {
          lastSync: new Date().toISOString(),
          lastUID: emailsList.length > 0 ? emailsList[0].uid : 0,
          totalEmails: emailsList.length,
          syncedAt: new Date().toISOString(),
        });
      }
      
      return {
        emails: emailsList,
        total: emailsList.length,
        fromCache: false,
        message: response.data.message || 'Correos cargados desde servidor',
      };
    } catch (error: any) {
      console.error('❌ [EmailMessages] Error getMessages:', error.response?.data || error.message);
      
      // Si falla el servidor, intentar usar caché
      const cached = await emailCacheService.getCachedEmails(folder);
      if (cached.length > 0) {
        console.log('⚠️ [EmailMessages] Error de servidor, usando caché:', cached.length);
        return {
          emails: cached,
          total: cached.length,
          fromCache: true,
          message: 'Error de conexión, mostrando caché local',
        };
      }
      
      return {
        emails: [],
        total: 0,
        fromCache: false,
        message: error.response?.data?.message || 'Error al cargar correos',
      };
    }
  }

  // Sincronización en segundo plano (solo correos nuevos)
  private async syncInBackground(folder: string, token: string): Promise<void> {
    try {
      const folderState = await emailCacheService.getFolderState(folder);
      const lastUID = folderState?.lastUID || 0;

      console.log('🔄 [EmailMessages] Sync en segundo plano, último UID:', lastUID);

      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: { folder, page: 1, limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
      });

      let emailsList: EmailMessage[] = [];
      if (response.data.success && response.data.data?.emails) {
        emailsList = response.data.data.emails;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        emailsList = response.data.data;
      } else if (response.data.emails && Array.isArray(response.data.emails)) {
        emailsList = response.data.emails;
      }

      // Agregar folder
      emailsList = emailsList.map(e => ({ ...e, folder }));

      // Verificar si hay correos nuevos (UID mayor al último sincronizado)
      const newEmails = emailsList.filter(e => e.uid > lastUID);
      
      if (newEmails.length > 0) {
        console.log('📬 [EmailMessages] Correos nuevos encontrados:', newEmails.length);
        await emailCacheService.saveEmails(newEmails, folder);
        await emailCacheService.saveFolderState(folder, {
          lastSync: new Date().toISOString(),
          lastUID: emailsList.length > 0 ? emailsList[0].uid : lastUID,
          totalEmails: emailsList.length,
          syncedAt: new Date().toISOString(),
        });
      } else {
        console.log('✅ [EmailMessages] No hay correos nuevos');
      }
    } catch (error) {
      console.log('⚠️ [EmailMessages] Error en sync de fondo:', error);
      // No lanzar error, es solo sync en segundo plano
    }
  }

  // Forzar sincronización completa
  async forceSync(folder: string = 'INBOX'): Promise<SyncResult> {
    try {
      console.log('🔄 [EmailMessages] Forzando sincronización completa...');
      const result = await this.getMessages(folder, 1, 100);
      
      return {
        success: true,
        newEmails: result.emails.length,
        totalEmails: result.total,
        message: result.message,
        fromCache: result.fromCache,
      };
    } catch (error: any) {
      console.error('❌ [EmailMessages] Error en forceSync:', error);
      return {
        success: false,
        newEmails: 0,
        totalEmails: 0,
        message: error.message || 'Error al sincronizar',
        fromCache: false,
      };
    }
  }

  // Obtener un correo específico
  async getMessage(messageId: string, folder: string = 'INBOX'): Promise<EmailMessage | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(`${API_CONFIG.endpoints.EMAIL_MESSAGES}/${messageId}`, {
        params: { folder },
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ [EmailMessages] Error getMessage:', error);
      return null;
    }
  }

  // Marcar correo como leído
  async markAsRead(messageId: string, folder: string = 'INBOX'): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) return false;

      await api.post(
        `${API_CONFIG.endpoints.EMAIL_MESSAGES}/${messageId}/read`,
        { folder },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar caché local
      const cached = await emailCacheService.getCachedEmails(folder);
      const updated = cached.map(e => 
        e.id === messageId ? { ...e, seen: true } : e
      );
      await emailCacheService.saveEmails(updated, folder);

      return true;
    } catch (error) {
      console.error('❌ [EmailMessages] Error markAsRead:', error);
      return false;
    }
  }

  // Eliminar correo
  async deleteMessage(messageId: string, folder: string = 'INBOX'): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) return false;

      await api.delete(`${API_CONFIG.endpoints.EMAIL_MESSAGES}/${messageId}`, {
        data: { folder },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Eliminar de caché local
      const cached = await emailCacheService.getCachedEmails(folder);
      const filtered = cached.filter(e => e.id !== messageId);
      await emailCacheService.saveEmails(filtered, folder);

      return true;
    } catch (error) {
      console.error('❌ [EmailMessages] Error deleteMessage:', error);
      return false;
    }
  }

  // Enviar correo
  async sendEmail(data: SendEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const token = getAuthToken();
      if (!token) return { success: false, error: 'No hay sesión' };

      const response = await api.post(API_CONFIG.endpoints.EMAIL_SEND, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📤 [EmailMessages] sendEmail response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [EmailMessages] Error sendEmail:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al enviar correo' 
      };
    }
  }

  // Obtener carpetas disponibles
  async getFolders(): Promise<EmailFolder[]> {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get(`${API_CONFIG.endpoints.EMAIL_MESSAGES}/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data || [];
    } catch (error) {
      console.error('❌ [EmailMessages] Error getFolders:', error);
      return [];
    }
  }

  // Buscar correos
  async searchMessages(query: string, folder: string = 'INBOX'): Promise<EmailMessage[]> {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: { folder, search: query },
        headers: { Authorization: `Bearer ${token}` },
      });

      let emails = [];
      if (response.data.success && response.data.data) {
        emails = response.data.data.emails || [];
      } else if (response.data.emails) {
        emails = response.data.emails;
      }

      return emails;
    } catch (error) {
      console.error('❌ [EmailMessages] Error searchMessages:', error);
      return [];
    }
  }

  // Limpiar caché
  async clearCache(): Promise<void> {
    await emailCacheService.clearCache();
  }

  // Obtener estadísticas de caché
  async getCacheStats(): Promise<{ totalEmails: number; folders: string[]; lastSync: string | null }> {
    return await emailCacheService.getCacheStats();
  }
}

export const emailMessagesService = new EmailMessagesService();
