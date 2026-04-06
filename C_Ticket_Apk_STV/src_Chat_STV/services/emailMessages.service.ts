import api, { API_CONFIG, getAuthToken } from '../../src/services/api';

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

// ==========================================
// SERVICIO DE CORREO
// ==========================================
class EmailMessagesService {
  // Obtener correos de una carpeta
  async getMessages(folder: string = 'INBOX', page: number = 1, limit: number = 50): Promise<EmailMessage[]> {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: { folder, page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📩 [EmailMessages] getMessages response:', JSON.stringify(response.data, null, 2));
      
      // El backend puede devolver en diferentes formatos
      let emails = [];
      if (response.data.success && response.data.data) {
        emails = response.data.data.emails || [];
      } else if (response.data.data) {
        emails = response.data.data;
      } else if (response.data.emails) {
        emails = response.data.emails;
      } else if (Array.isArray(response.data)) {
        emails = response.data;
      }
      
      console.log('📩 [EmailMessages] Emails encontrados:', emails.length);
      return emails;
    } catch (error: any) {
      console.error('❌ [EmailMessages] Error getMessages:', error.response?.data || error.message);
      return [];
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
}

export const emailMessagesService = new EmailMessagesService();
