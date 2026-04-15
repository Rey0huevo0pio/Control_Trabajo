/**
 * ============================================================================
 * 📧 EMAIL MESSAGES SERVICE - Servicio de correos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/services/emailMessages.service.ts
 *
 * QUÉ HACE:
 * - Obtiene correos del servidor API
 * - Cache local (localStorage)
 * - Sync incremental por UID
 *
 * ============================================================================
 */
import api, { getAuthToken } from './api';

const EMAIL_MESSAGES_ENDPOINT = '/email/messages';

// Cache local (localStorage para web)
const CACHE_KEY = '@email_cache_web_v1';
const FOLDER_STATE_KEY = '@email_folder_state_web_v1';

const getCache = () => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : { emails: [] };
  } catch { return { emails: [] }; }
};

const saveCache = (cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
};

const getFolderState = (folder) => {
  try {
    const data = localStorage.getItem(FOLDER_STATE_KEY);
    const states = data ? JSON.parse(data) : {};
    return states[folder] || null;
  } catch { return null; }
};

const saveFolderState = (folder, state) => {
  try {
    const data = localStorage.getItem(FOLDER_STATE_KEY);
    const states = data ? JSON.parse(data) : {};
    states[folder] = { ...state, syncedAt: new Date().toISOString() };
    localStorage.setItem(FOLDER_STATE_KEY, JSON.stringify(states));
  } catch {}
};

class EmailMessagesService {
  async getMessages(folder = 'INBOX', page = 1, limit = 50) {
    const token = getAuthToken();
    
    if (!token) {
      const cached = this.getCachedEmails(folder);
      return {
        emails: cached,
        total: cached.length,
        fromCache: true,
        message: 'Usando caché local (sin sesión)',
      };
    }

    const cachedEmails = this.getCachedEmails(folder);
    
    if (cachedEmails.length > 0) {
      console.log('[EmailMessages] Usando caché local:', cachedEmails.length, 'correos');
      this.syncIncremental(folder, token, cachedEmails);
      return {
        emails: cachedEmails.slice(0, limit),
        total: cachedEmails.length,
        fromCache: true,
        message: 'Cargado desde caché local',
      };
    }

    return this.fullDownload(folder, token, page, limit);
  }

  async fullDownload(folder, token, page, limit) {
    try {
      console.log('[EmailMessages] Descargando correos...');
      
      const response = await api.get(EMAIL_MESSAGES_ENDPOINT, {
        params: { folder, page, limit: 20 }, // Reducir a 20 para evitar timeout
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000, // 30 segundos
      });

      console.log('[EmailMessages] Response:', response.status, response.data);

      let emails = [];
      // Manejar diferentes formatos de respuesta
      if (response.data) {
        // Si tiene estructura success
        if (response.data.success && response.data.data) {
          emails = response.data.data.emails || response.data.data;
        } 
        // Si tiene propiedad emails directamente
        else if (response.data.emails) {
          emails = response.data.emails;
        }
        // Si data es array directo
        else if (Array.isArray(response.data.data)) {
          emails = response.data.data;
        }
        // Si response.data es array directo
        else if (Array.isArray(response.data)) {
          emails = response.data;
        }
      }

      // Asegurar que sea array
      if (!Array.isArray(emails)) {
        emails = [];
        console.log('[EmailMessages] Emails no es array, ajustado:', typeof emails);
      }

      emails = emails.map(e => ({ ...e, folder }));
      console.log('[EmailMessages] Correos descargados:', emails.length);

      if (emails.length > 0) {
        this.saveEmails(emails, folder);
        saveFolderState(folder, {
          lastSync: new Date().toISOString(),
          lastUID: emails.length > 0 ? Math.max(...emails.map(e => e.uid)) : 0,
          totalEmails: emails.length,
        });
      }

      return {
        emails,
        total: emails.length,
        message: response.data.message || 'Correos cargados desde servidor',
      };
    } catch (error) {
      console.error('[EmailMessages] Error en fullDownload:', error.message || error.code);
      const cached = this.getCachedEmails(folder);
      if (cached.length > 0) {
        return { emails: cached, total: cached.length, fromCache: true, message: 'Error de conexión, mostrando caché local' };
      }
      let errorMsg = 'Error al cargar correos';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = 'Timeout - el servidor tarda demasiado en responder';
      } else if (error.response?.status === 404) {
        errorMsg = 'IMAP no configurado';
      }
      return { emails: [], total: 0, fromCache: false, message: errorMsg };
    }
  }

  async syncIncremental(folder, token, cachedEmails) {
    try {
      const uidsResponse = await api.get(`${EMAIL_MESSAGES_ENDPOINT}/uids`, {
        params: { folder },
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverUIDs = uidsResponse.data.data?.uids || [];
      if (serverUIDs.length === 0) return;

      const cachedUIDs = new Set(cachedEmails.map(e => e.uid));
      const newUIDs = serverUIDs.filter(uid => !cachedUIDs.has(uid));

      if (newUIDs.length === 0) return;

      console.log('[EmailMessages] Correos nuevos:', newUIDs.length);

      const downloadResponse = await api.post(`${EMAIL_MESSAGES_ENDPOINT}/by-uids`,
        { folder, uids: newUIDs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newEmails = downloadResponse.data.data?.emails || [];
      if (newEmails.length > 0) {
        this.saveEmails(newEmails, folder);
      }
    } catch (error) {
      console.log('[EmailMessages] Error en sync incremental:', error);
    }
  }

  getCachedEmails(folder) {
    const cache = getCache();
    let emails = cache.emails.filter(e => e.folder === folder) || [];
    emails = emails.filter(e => e.uid > 0);
    emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return emails;
  }

  saveEmails(emails, folder) {
    const cache = getCache();
    const otherEmails = cache.emails.filter(e => e.folder !== folder);
    
    const newEmails = emails.map(e => ({
      ...e,
      folder,
      text: e.text ? e.text.substring(0, 80) : '',
      html: '',
      cachedAt: new Date().toISOString(),
    }));

    cache.emails = [...newEmails, ...otherEmails];
    cache.emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (cache.emails.length > 30) {
      cache.emails = cache.emails.slice(0, 30);
    }

    saveCache(cache);
  }

  async getFullMessage(uid, folder = 'INBOX') {
    try {
      const cached = this.getFullEmailFromCache(uid, folder);
      if (cached) return cached;

      const token = getAuthToken();
      if (!token) return null;

      const response = await api.post(`${EMAIL_MESSAGES_ENDPOINT}/by-uids`,
        { folder, uids: [uid] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const emails = response.data.data?.emails || [];
      if (emails.length > 0) {
        const fullEmail = emails[0];
        fullEmail.folder = folder;
        this.saveFullEmail(fullEmail, folder);
        return fullEmail;
      }
      return null;
    } catch (error) {
      console.error('[EmailMessages] Error getFullMessage:', error);
      return null;
    }
  }

  getFullEmailFromCache(uid, folder) {
    try {
      const key = `email_full_${folder}_${uid}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  saveFullEmail(email, folder) {
    try {
      const key = `email_full_${folder}_${email.uid}`;
      localStorage.setItem(key, JSON.stringify(email));
    } catch (error) {
      console.warn('[EmailMessages] No se pudo guardar email completo:', error);
    }
  }

  async sendEmail(data) {
    try {
      const token = getAuthToken();
      if (!token) return { success: false, error: 'No hay sesión' };

      const response = await api.post('/email/send', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error('[EmailMessages] Error sendEmail:', error);
      return { success: false, error: error.response?.data?.message || 'Error al enviar correo' };
    }
  }

  async getFolders() {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get(`${EMAIL_MESSAGES_ENDPOINT}/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data || [];
    } catch (error) {
      console.error('[EmailMessages] Error getFolders:', error);
      return [];
    }
  }

  async forceSync(folder = 'INBOX') {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(FOLDER_STATE_KEY);
    return this.getMessages(folder, 1, 100);
  }

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(FOLDER_STATE_KEY);
  }
}

export const emailMessagesService = new EmailMessagesService();
export default emailMessagesService;