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
const MAX_CACHED_EMAILS = 30;  // Reducido de 50 a 30 para evitar overflow
const PREVIEW_LENGTH = 80;  // Reducido de 100 a 80
const MAX_HTML_IN_LIST = 0;  // ✅ NUNCA guardar HTML en la lista (solo en full email)

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
      let emails = cache.emails.filter((e) => e.folder === folder) || [];

      // LIMPIEZA AUTOMÁTICA: Eliminar emails con UID:0 (datos viejos corruptos)
      const validEmails = emails.filter(e => e.uid > 0);
      if (validEmails.length !== emails.length) {
        const removedCount = emails.length - validEmails.length;
        console.log(`🗑️ [EmailCache] Eliminando ${removedCount} emails corruptos (UID:0)`);

        // Guardar solo emails válidos
        cache.emails = [...validEmails, ...cache.emails.filter(e => e.folder !== folder)];
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      }

      // ✅ ORDENAR POR FECHA DESCENDENTE (más reciente primero)
      validEmails.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descendente: más reciente primero
      });

      console.log(`📋 [EmailCache] ${validEmails.length} emails ordenados por fecha (más reciente primero)`);

      return validEmails;
    } catch (error) {
      console.error("❌ [EmailCache] Error obteniendo caché:", error);
      return [];
    }
  }

  // Guardar correos en caché (incluyendo contenido HTML completo)
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

      const otherEmails = cache.emails.filter((e) => e.folder !== folder);

      // ✅ LIMITAR tamaño de datos para evitar overflow
      const newEmails = emails.map((e) => ({
        ...e,
        folder,
        // Preview corto
        text: e.text ? e.text.substring(0, PREVIEW_LENGTH) : "",
        // ✅ NUNCA guardar HTML en la lista (solo metadata)
        html: "",
        // ✅ Limitar adjuntos a solo metadata básica
        attachments: (e.attachments || []).slice(0, 5).map(att => ({
          fileName: att.fileName || att.filename || "archivo",
          contentType: att.contentType || att.mimeType || "",
          size: att.size || 0,
          // ✅ NO guardar contenido base64
          content: undefined,
          thumbnail: undefined,
        })),
        cachedAt: new Date().toISOString(),
      }));

      cache.emails = [...newEmails, ...otherEmails];

      // ✅ ORDENAR todos los emails por fecha (más reciente primero)
      cache.emails.sort((a, b) => {
        const dateA = new Date(a.date || a.cachedAt || 0).getTime();
        const dateB = new Date(b.date || b.cachedAt || 0).getTime();
        return dateB - dateA; // Descendente: más reciente primero
      });

      // ✅ LIMITAR a MAX_CACHED_EMAILS (30) y limpiar full emails removidos
      if (cache.emails.length > MAX_CACHED_EMAILS) {
        const removedEmails = cache.emails.slice(MAX_CACHED_EMAILS);
        for (const email of removedEmails) {
          await AsyncStorage.removeItem(fullEmailKey(email.uid, email.folder));
        }
        cache.emails = cache.emails.slice(0, MAX_CACHED_EMAILS);
      }

      // ✅ VERIFICAR tamaño antes de guardar (evitar Row too big)
      const cacheSize = JSON.stringify(cache).length;
      const MAX_CACHE_SIZE = 2 * 1024 * 1024;  // 2MB máximo
      
      if (cacheSize > MAX_CACHE_SIZE) {
        console.warn(`⚠️ [EmailCache] Caché demasiado grande (${cacheSize} bytes), limpiando...`);
        // Remover emails más viejos hasta estar bajo el límite
        while (cache.emails.length > 10 && JSON.stringify(cache).length > MAX_CACHE_SIZE) {
          const removed = cache.emails.pop();
          if (removed) {
            await AsyncStorage.removeItem(fullEmailKey(removed.uid, removed.folder));
          }
        }
      }

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));

      for (const email of emails) {
        if (email.html && email.html.length > 0) {
          await this.saveFullEmail(email, folder);
        }
      }

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
      
      // ✅ LIMITAR HTML a 100KB para email completo (evitar overflow)
      const MAX_FULL_HTML = 100 * 1024;  // 100KB
      const limitedEmail = {
        ...email,
        folder,
        html: email.html && email.html.length > MAX_FULL_HTML 
          ? email.html.substring(0, MAX_FULL_HTML) + '...[truncado]' 
          : email.html,
        // ✅ Limitar adjuntos a metadata solamente
        attachments: (email.attachments || []).slice(0, 10).map(att => ({
          fileName: att.fileName || att.filename || "archivo",
          contentType: att.contentType || att.mimeType || "",
          size: att.size || 0,
          isImage: att.isImage || false,
          isPDF: att.isPDF || false,
          thumbnail: att.thumbnail ? att.thumbnail.substring(0, 500) : undefined,
          // ✅ NO guardar contenido base64 completo
          content: undefined,
        })),
        cachedAt: new Date().toISOString(),
      };
      
      // ✅ Verificar tamaño antes de guardar
      const emailSize = JSON.stringify(limitedEmail).length;
      const MAX_EMAIL_SIZE = 500 * 1024;  // 500KB máximo por email
      
      if (emailSize > MAX_EMAIL_SIZE) {
        console.warn(`⚠️ [EmailCache] Email demasiado grande (${emailSize} bytes), guardando solo metadata`);
        // Guardar solo metadata sin HTML
        limitedEmail.html = "";
        limitedEmail.text = limitedEmail.text.substring(0, 200);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(limitedEmail));

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
