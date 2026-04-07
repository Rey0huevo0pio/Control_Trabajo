import AsyncStorage from "@react-native-async-storage/async-storage";

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
  text: string; // Preview corto (primeros 100 chars)
  html: string; // Vacío en metadata
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
// CLAVES DE ALMACENAMIENTO
// ==========================================
const CACHE_KEY = "@email_cache_v3";
const FOLDER_STATE_KEY = "@email_folder_state_v3";
const MAX_CACHED_EMAILS = 50;
const PREVIEW_LENGTH = 100; // Muy corto para la lista

// Clave para contenido completo de un email individual
const fullEmailKey = (uid: number, folder: string) =>
  `@email_full_${folder}_${uid}`;

// ==========================================
// SERVICIO DE CACHÉ DE CORREOS
// ==========================================
class EmailCacheService {
  // Obtener todos los correos cacheados de una carpeta (solo metadata)
  async getCachedEmails(folder: string = "INBOX"): Promise<CachedEmail[]> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      if (!cacheJson) return [];

      const cache: EmailCacheState = JSON.parse(cacheJson);
      return cache.emails.filter((e) => e.folder === folder) || [];
    } catch (error) {
      console.error("❌ [EmailCache] Error obteniendo caché:", error);
      return [];
    }
  }

  // Guardar correos en caché (solo metadata + preview corto)
  async saveEmails(
    emails: CachedEmail[],
    folder: string = "INBOX",
  ): Promise<void> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      const cache: EmailCacheState = cacheJson
        ? JSON.parse(cacheJson)
        : {
            emails: [],
            folderStates: {},
            lastFullSync: null,
          };

      // Eliminar correos antiguos de la misma carpeta y agregar los nuevos
      const otherEmails = cache.emails.filter((e) => e.folder !== folder);

      // Solo guardar preview muy corto
      const newEmails = emails.map((e) => ({
        ...e,
        folder,
        text: e.text ? e.text.substring(0, PREVIEW_LENGTH) : "",
        html: "",
        cachedAt: new Date().toISOString(),
      }));

      cache.emails = [...newEmails, ...otherEmails];

      if (cache.emails.length > MAX_CACHED_EMAILS) {
        // Limpiar también los contenidos completos de los eliminados
        const removedEmails = cache.emails.slice(MAX_CACHED_EMAILS);
        for (const email of removedEmails) {
          await AsyncStorage.removeItem(fullEmailKey(email.uid, email.folder));
        }
        cache.emails = cache.emails.slice(0, MAX_CACHED_EMAILS);
      }

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log("✅ [EmailCache] Correos guardados en caché:", emails.length);
    } catch (error: any) {
      if (
        error.message?.includes("SQLITE_FULL") ||
        error.message?.includes("Row too big")
      ) {
        console.warn("⚠️ [EmailCache] Almacenamiento lleno, limpiando...");
        await this.clearCache();
      } else {
        console.error("❌ [EmailCache] Error guardando caché:", error);
      }
    }
  }

  // Obtener contenido completo de un email (almacenado por separado)
  async getFullEmail(
    uid: number,
    folder: string = "INBOX",
  ): Promise<CachedEmail | null> {
    try {
      const key = fullEmailKey(uid, folder);
      const json = await AsyncStorage.getItem(key);
      if (!json) return null;
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // Guardar contenido completo de un email (en clave separada para evitar Row too big)
  async saveFullEmail(
    email: CachedEmail,
    folder: string = "INBOX",
  ): Promise<void> {
    try {
      // Guardar metadata en el índice
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      const cache: EmailCacheState = cacheJson
        ? JSON.parse(cacheJson)
        : {
            emails: [],
            folderStates: {},
            lastFullSync: null,
          };

      const idx = cache.emails.findIndex(
        (e) => e.uid === email.uid && e.folder === folder,
      );
      const metaEmail = {
        ...email,
        folder,
        text: email.text ? email.text.substring(0, PREVIEW_LENGTH) : "",
        html: "", // No guardar HTML en el índice
        cachedAt: new Date().toISOString(),
      };

      if (idx >= 0) {
        cache.emails[idx] = metaEmail;
      } else {
        cache.emails.unshift(metaEmail);
        if (cache.emails.length > MAX_CACHED_EMAILS) {
          const removed = cache.emails.pop();
          if (removed)
            await AsyncStorage.removeItem(
              fullEmailKey(removed.uid, removed.folder),
            );
        }
      }

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));

      // Guardar contenido completo en clave separada (evita Row too big)
      const key = fullEmailKey(email.uid, folder);
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          ...email,
          folder,
          cachedAt: new Date().toISOString(),
        }),
      );

      console.log(
        "✅ [EmailCache] Correo completo guardado (UID:",
        email.uid,
        ")",
      );
    } catch (error: any) {
      if (
        error.message?.includes("SQLITE_FULL") ||
        error.message?.includes("Row too big")
      ) {
        console.warn("⚠️ [EmailCache] No se pudo guardar contenido completo");
      } else {
        console.error(
          "❌ [EmailCache] Error guardando correo completo:",
          error,
        );
      }
    }
  }

  // Verificar si ya tenemos contenido completo de un email
  async hasFullContent(
    uid: number,
    folder: string = "INBOX",
  ): Promise<boolean> {
    try {
      const key = fullEmailKey(uid, folder);
      const json = await AsyncStorage.getItem(key);
      return !!json;
    } catch {
      return false;
    }
  }

  // Obtener estado de sincronización de una carpeta
  async getFolderState(
    folder: string = "INBOX",
  ): Promise<FolderSyncState | null> {
    try {
      const stateJson = await AsyncStorage.getItem(FOLDER_STATE_KEY);
      if (!stateJson) return null;

      const states: Record<string, FolderSyncState> = JSON.parse(stateJson);
      return states[folder] || null;
    } catch (error) {
      console.error(
        "❌ [EmailCache] Error obteniendo estado de carpeta:",
        error,
      );
      return null;
    }
  }

  // Guardar estado de sincronización
  async saveFolderState(folder: string, state: FolderSyncState): Promise<void> {
    try {
      const stateJson = await AsyncStorage.getItem(FOLDER_STATE_KEY);
      const states: Record<string, FolderSyncState> = stateJson
        ? JSON.parse(stateJson)
        : {};

      states[folder] = {
        ...state,
        syncedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(FOLDER_STATE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error(
        "❌ [EmailCache] Error guardando estado de carpeta:",
        error,
      );
    }
  }

  // Verificar si se necesita sincronización completa
  async needsFullSync(folder: string = "INBOX"): Promise<boolean> {
    const folderState = await this.getFolderState(folder);
    if (!folderState || !folderState.syncedAt) return true;

    const lastSync = new Date(folderState.syncedAt);
    const now = new Date();
    const hoursSinceSync =
      (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    return hoursSinceSync > 24;
  }

  // Limpiar caché completa
  async clearCache(): Promise<void> {
    try {
      // Limpiar índice
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(FOLDER_STATE_KEY);

      // Limpiar todos los contenidos completos
      const allKeys = await AsyncStorage.getAllKeys();
      const fullEmailKeys = allKeys.filter((k) => k.startsWith("@email_full_"));
      if (fullEmailKeys.length > 0) {
        await AsyncStorage.multiRemove(fullEmailKeys);
      }

      console.log("✅ [EmailCache] Caché limpiada completamente");
    } catch (error) {
      console.error("❌ [EmailCache] Error limpiando caché:", error);
    }
  }

  // Obtener estadísticas de caché
  async getCacheStats(): Promise<{
    totalEmails: number;
    folders: string[];
    lastSync: string | null;
  }> {
    try {
      const cacheJson = await AsyncStorage.getItem(CACHE_KEY);
      if (!cacheJson) return { totalEmails: 0, folders: [], lastSync: null };

      const cache: EmailCacheState = JSON.parse(cacheJson);
      const folders = [...new Set(cache.emails.map((e) => e.folder))];

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
