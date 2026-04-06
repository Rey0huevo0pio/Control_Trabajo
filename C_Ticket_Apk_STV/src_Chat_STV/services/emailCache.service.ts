import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// INTERFACES
// ==========================================
export interface CachedEmail {
  id: string;
  uid: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;       // Preview corto (primeros 200 chars)
  html: string;       // Vacío en caché, se descarga al abrir
  attachments: any[];
  seen: boolean;
  flagged: boolean;
  folder: string;
  cachedAt?: string;
}

export interface FolderSyncState {
  lastSync: string | null;
  lastUID: number;
  totalEmails: number;
  syncedAt: string | null;
}

export interface EmailCacheState {
  emails: CachedEmail[];
  folderStates: Record<string, FolderSyncState>;
  lastFullSync: string | null;
}

// ==========================================
// CLAVE DE ALMACENAMIENTO
// ==========================================
const CACHE_KEY = '@email_cache_v2'; // Incrementar versión para limpiar caché vieja
const FOLDER_STATE_KEY = '@email_folder_state_v2';
const MAX_CACHED_EMAILS = 50; // Reducido de 200 a 50
const PREVIEW_LENGTH = 200; // Solo primeros 200 chars del texto

// ==========================================
// SERVICIO DE CACHÉ DE CORREOS
// ==========================================
class EmailCacheService {
  // Obtener todos los correos cacheados de una carpeta
  async getCachedEmails(folder: string = 'INBOX'): Promise<CachedEmail[]> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      if (!cacheJson) return [];

      const cache: EmailCacheState = JSON.parse(cacheJson);
      return cache.emails.filter(e => e.folder === folder) || [];
    } catch (error) {
      console.error('❌ [EmailCache] Error obteniendo caché:', error);
      return [];
    }
  }

  // Guardar correos en caché (solo metadata + preview corto)
  async saveEmails(emails: CachedEmail[], folder: string = 'INBOX'): Promise<void> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      const cache: EmailCacheState = cacheJson ? JSON.parse(cacheJson) : {
        emails: [],
        folderStates: {},
        lastFullSync: null,
      };

      // Eliminar correos antiguos de la misma carpeta y agregar los nuevos
      const otherEmails = cache.emails.filter(e => e.folder !== folder);

      // Recortar contenido para ahorrar espacio: solo preview del texto
      const newEmails = emails.map(e => ({
        ...e,
        folder,
        text: e.text ? e.text.substring(0, PREVIEW_LENGTH) : '',
        html: '', // NO guardar HTML en caché
        cachedAt: new Date().toISOString(),
      }));

      cache.emails = [...newEmails, ...otherEmails];

      // Limitar caché para no llenar AsyncStorage
      if (cache.emails.length > MAX_CACHED_EMAILS) {
        cache.emails = cache.emails.slice(0, MAX_CACHED_EMAILS);
      }

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log('✅ [EmailCache] Correos guardados en caché:', emails.length);
    } catch (error: any) {
      if (error.message?.includes('SQLITE_FULL')) {
        console.warn('⚠️ [EmailCache] Almacenamiento lleno, limpiando caché automáticamente...');
        await this.clearCache();
      } else {
        console.error('❌ [EmailCache] Error guardando caché:', error);
      }
    }
  }

  // Obtener estado de sincronización de una carpeta
  async getFolderState(folder: string = 'INBOX'): Promise<FolderSyncState | null> {
    try {
      const stateJson = await AsyncStorage.getItem(FOLDER_STATE_KEY);
      if (!stateJson) return null;

      const states: Record<string, FolderSyncState> = JSON.parse(stateJson);
      return states[folder] || null;
    } catch (error) {
      console.error('❌ [EmailCache] Error obteniendo estado de carpeta:', error);
      return null;
    }
  }

  // Guardar estado de sincronización
  async saveFolderState(folder: string, state: FolderSyncState): Promise<void> {
    try {
      const stateJson = await AsyncStorage.getItem(FOLDER_STATE_KEY);
      const states: Record<string, FolderSyncState> = stateJson ? JSON.parse(stateJson) : {};

      states[folder] = {
        ...state,
        syncedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(FOLDER_STATE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('❌ [EmailCache] Error guardando estado de carpeta:', error);
    }
  }

  // Verificar si se necesita sincronización completa
  async needsFullSync(folder: string = 'INBOX'): Promise<boolean> {
    const folderState = await this.getFolderState(folder);

    if (!folderState || !folderState.syncedAt) return true;

    const lastSync = new Date(folderState.syncedAt);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    return hoursSinceSync > 24;
  }

  // Limpiar caché
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(FOLDER_STATE_KEY);
      console.log('✅ [EmailCache] Caché limpiada');
    } catch (error) {
      console.error('❌ [EmailCache] Error limpiando caché:', error);
    }
  }

  // Obtener estadísticas de caché
  async getCacheStats(): Promise<{ totalEmails: number; folders: string[]; lastSync: string | null }> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      if (!cacheJson) return { totalEmails: 0, folders: [], lastSync: null };

      const cache: EmailCacheState = JSON.parse(cacheJson);
      const folders = [...new Set(cache.emails.map(e => e.folder))];

      return {
        totalEmails: cache.emails.length,
        folders,
        lastSync: cache.lastFullSync,
      };
    } catch (error) {
      return { totalEmails: 0, folders: [], lastSync: null };
    }
  }
}

export const emailCacheService = new EmailCacheService();
