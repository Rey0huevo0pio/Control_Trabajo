/**
 * ============================================================================
 * 📧 EMAIL MESSAGES SERVICE - Servicio de correos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/services/emailMessages.service.ts
 *
 * MEJORAS:
 * - IndexedDB para almacenamiento eficiente (como WhatsApp/Telegram)
 * - Solo descarga correos nuevos (sync incremental)
 * - Almacena contenido completo incluyendo imágenes y adjuntos
 * - Cache en memoria para acceso rápido
 *
 * ============================================================================
 */
import api, { getAuthToken } from './api';

const EMAIL_MESSAGES_ENDPOINT = '/email/messages';

const DB_NAME = 'EmailMessagesDB';
const DB_VERSION = 1;
const STORE_EMAILS = 'emails';
const STORE_METADATA = 'metadata';
const STORE_ATTACHMENTS = 'attachments';

let db = null;

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    console.log('[EmailMessages] Abriendo IndexedDB...');
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[EmailMessages] Error abriendo IndexedDB:', request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      db = request.result;
      console.log('[EmailMessages] IndexedDB abierta correctamente');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      console.log('[EmailMessages] Creando/migrando IndexedDB...');
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_EMAILS)) {
        const emailStore = database.createObjectStore(STORE_EMAILS, { keyPath: 'uid' });
        emailStore.createIndex('folder', 'folder', { unique: false });
        emailStore.createIndex('date', 'date', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORE_METADATA)) {
        database.createObjectStore(STORE_METADATA, { keyPath: 'folder' });
      }

      if (!database.objectStoreNames.contains(STORE_ATTACHMENTS)) {
        const attStore = database.createObjectStore(STORE_ATTACHMENTS, { keyPath: 'id' });
        attStore.createIndex('emailUid', 'emailUid', { unique: false });
      }
    };
  });
};

const getAllEmailsFromDB = async (folder) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_EMAILS], 'readonly');
    const store = transaction.objectStore(STORE_EMAILS);
    const index = store.index('folder');
    const request = index.getAll(IDBKeyRange.only(folder));

    request.onsuccess = () => {
      const emails = request.result || [];
      resolve(emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    request.onerror = () => reject(request.error);
  });
};

const saveEmailsToDB = async (emails, folder) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_EMAILS], 'readwrite');
    const store = transaction.objectStore(STORE_EMAILS);

    emails.forEach(email => {
      store.put({ ...email, folder, cachedAt: new Date().toISOString() });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const getMetadata = async (folder) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_METADATA], 'readonly');
    const store = transaction.objectStore(STORE_METADATA);
    const request = store.get(folder);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

const saveMetadata = async (folder, metadata) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_METADATA], 'readwrite');
    const store = transaction.objectStore(STORE_METADATA);
    store.put({ folder, ...metadata, syncedAt: new Date().toISOString() });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const clearAllData = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_EMAILS, STORE_METADATA, STORE_ATTACHMENTS], 'readwrite');
    transaction.objectStore(STORE_EMAILS).clear();
    transaction.objectStore(STORE_METADATA).clear();
    transaction.objectStore(STORE_ATTACHMENTS).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

class EmailMessagesService {
  async getMessages(folder = 'INBOX', page = 1) {
    const token = getAuthToken();

    const cachedEmails = await getAllEmailsFromDB(folder);

    if (cachedEmails.length > 0) {
      console.log('[EmailMessages] Usando caché IndexedDB:', cachedEmails.length, 'correos');
      if (token) {
        this.syncIncremental(folder, token, cachedEmails);
      }
      return {
        emails: cachedEmails.slice(0, 50),
        total: cachedEmails.length,
        fromCache: true,
        message: 'Cargado desde caché local',
      };
    }

    if (!token) {
      return {
        emails: [],
        total: 0,
        fromCache: true,
        message: 'Sin sesión y sin caché local',
      };
    }

    return this.fullDownload(folder, token, page);
  }

  async fullDownload(folder, token, page = 1) {
    try {
      console.log('[EmailMessages] Descargando correos...');

      const response = await api.get(EMAIL_MESSAGES_ENDPOINT, {
        params: { folder, page, limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000,
      });

      console.log('[EmailMessages] Response:', response.status, response.data);

      let emails = [];
      if (response.data) {
        if (response.data.success && response.data.data) {
          emails = response.data.data.emails || response.data.data;
        } else if (response.data.emails) {
          emails = response.data.emails;
        } else if (Array.isArray(response.data.data)) {
          emails = response.data.data;
        } else if (Array.isArray(response.data)) {
          emails = response.data;
        }
      }

      if (!Array.isArray(emails)) {
        emails = [];
      }

      emails = emails.map(e => ({ ...e, folder }));
      console.log('[EmailMessages] Correos descargados:', emails.length);

      if (emails.length > 0) {
        await saveEmailsToDB(emails, folder);
        await saveMetadata(folder, {
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
      const cached = await getAllEmailsFromDB(folder);
      if (cached.length > 0) {
        return { emails: cached, total: cached.length, fromCache: true, message: 'Error de conexión, mostrando caché local' };
      }
      let errorMsg = 'Error al cargar correos';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = 'El servidor está tardando demasiado. Intenta más tarde.';
      } else if (error.response?.status === 404) {
        errorMsg = 'IMAP no configurado';
      } else if (error.response?.status === 401) {
        errorMsg = 'Sesión expirada';
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
        await saveEmailsToDB(newEmails, folder);
        await saveMetadata(folder, {
          lastSync: new Date().toISOString(),
          lastUID: newUIDs.length > 0 ? Math.max(...newUIDs) : 0,
          totalEmails: cachedEmails.length + newEmails.length,
        });
      }
    } catch (error) {
      console.log('[EmailMessages] Error en sync incremental:', error);
    }
  }

  async getFullMessage(uid, folder = 'INBOX') {
    try {
      // Primero revisar si hay en caché
      const cached = await this.getFullEmailFromDB(uid, folder);
      if (cached && cached.html && cached.html.length > 100) {
        console.log('[EmailMessages] Usando email completo de caché - UID:', uid, 'HTML:', cached.html.length, 'chars');
        return cached;
      }

      const token = getAuthToken();
      if (!token) return cached || null;

      console.log('[EmailMessages] Descargando email completo desde servidor - UID:', uid);
      const response = await api.post(`${EMAIL_MESSAGES_ENDPOINT}/by-uids`,
        { folder, uids: [uid] },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 }
      );

      console.log('[EmailMessages] Respuesta del servidor - status:', response.status);
      console.log('[EmailMessages] Respuesta data:', JSON.stringify(response.data).substring(0, 500));
      
      const emails = response.data.data?.emails || [];
      if (emails.length > 0) {
        const fullEmail = emails[0];
        fullEmail.folder = folder;
        
        // Guardar en IndexedDB
        await this.saveFullEmail(fullEmail, folder);
        console.log('[EmailMessages] Email completo guardado - HTML:', fullEmail.html?.length || 0, 'Text:', fullEmail.text?.length || 0);
        
        return fullEmail;
      }
      return cached || null;
    } catch (error) {
      console.error('[EmailMessages] Error getFullMessage:', error.message);
      // Intentar devolver lo que hay en caché
      const cached = await this.getFullEmailFromDB(uid, folder);
      return cached || null;
    }
  }

  async getFullEmailFromDB(uid, folder) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_EMAILS], 'readonly');
      const store = transaction.objectStore(STORE_EMAILS);
      const request = store.get(uid);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFullEmail(email, folder) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_EMAILS], 'readwrite');
      const store = transaction.objectStore(STORE_EMAILS);
      store.put({ ...email, folder, cachedAt: new Date().toISOString() });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
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
    await clearAllData();
    return this.getMessages(folder, 1);
  }

  clearCache() {
    return clearAllData();
  }
}

export const emailMessagesService = new EmailMessagesService();
export default emailMessagesService;