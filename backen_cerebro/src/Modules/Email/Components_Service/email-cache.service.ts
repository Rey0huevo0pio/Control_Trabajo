import { Injectable } from '@nestjs/common';

export interface CachedEmail {
  uid: number;
  folder: string;
  timestamp: number;
  data: any;
}

export interface CachedUIDList {
  folder: string;
  uids: number[];
  timestamp: number;
}

@Injectable()
export class EmailCacheService {
  // Cache de UIDs por carpeta
  private uidCache: Map<string, CachedUIDList> = new Map();

  // Cache de mensajes por UID
  private messageCache: Map<string, CachedEmail> = new Map();

  // Tiempo de vida del caché (5 minutos)
  private readonly CACHE_TTL = 5 * 60 * 1000;

  // Máximo de mensajes en caché
  private readonly MAX_CACHE_SIZE = 1000;

  // ==========================================
  // OBTENER CLAVE DE CACHÉ PARA UID LIST
  // ==========================================
  private getUidCacheKey(usuarioId: string, folder: string): string {
    return `${usuarioId}:${folder}:uids`;
  }

  // ==========================================
  // OBTENER CLAVE DE CACHÉ PARA MENSAJE
  // ==========================================
  private getMessageCacheKey(
    usuarioId: string,
    folder: string,
    uid: number,
  ): string {
    return `${usuarioId}:${folder}:${uid}`;
  }

  // ==========================================
  // OBTENER UIDs EN CACHÉ
  // ==========================================
  getCachedUIDs(usuarioId: string, folder: string): number[] | null {
    const cacheKey = this.getUidCacheKey(usuarioId, folder);
    const cached = this.uidCache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Verificar si el caché está expirado
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.uidCache.delete(cacheKey);
      return null;
    }

    console.log(
      `💾 [EmailCache] UID cache HIT for ${folder}: ${cached.uids.length} UIDs`,
    );
    return cached.uids;
  }

  // ==========================================
  // GUARDAR UIDs EN CACHÉ
  // ==========================================
  cacheUIDs(usuarioId: string, folder: string, uids: number[]): void {
    const cacheKey = this.getUidCacheKey(usuarioId, folder);

    this.uidCache.set(cacheKey, {
      folder,
      uids,
      timestamp: Date.now(),
    });

    console.log(
      `💾 [EmailCache] UID cache SET for ${folder}: ${uids.length} UIDs`,
    );
  }

  // ==========================================
  // OBTENER MENSAJE EN CACHÉ
  // ==========================================
  getCachedMessage(usuarioId: string, folder: string, uid: number): any {
    const cacheKey = this.getMessageCacheKey(usuarioId, folder, uid);
    const cached = this.messageCache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Verificar si el caché está expirado
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.messageCache.delete(cacheKey);
      return null;
    }

    console.log(`💾 [EmailCache] Message cache HIT for UID:${uid}`);
    return cached.data;
  }

  // ==========================================
  // GUARDAR MENSAJE EN CACHÉ
  // ==========================================
  cacheMessage(
    usuarioId: string,
    folder: string,
    uid: number,
    data: any,
  ): void {
    // Verificar límite de caché
    if (this.messageCache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestCache();
    }

    const cacheKey = this.getMessageCacheKey(usuarioId, folder, uid);

    this.messageCache.set(cacheKey, {
      uid,
      folder,
      timestamp: Date.now(),
      data,
    });

    console.log(`💾 [EmailCache] Message cache SET for UID:${uid}`);
  }

  // ==========================================
  // GUARDAR MÚLTIPLES MENSAJES EN CACHÉ
  // ==========================================
  cacheMessages(usuarioId: string, folder: string, messages: any[]): void {
    for (const message of messages) {
      if (message.uid) {
        this.cacheMessage(usuarioId, folder, message.uid, message);
      }
    }
    console.log(
      `💾 [EmailCache] Cached ${messages.length} messages for ${folder}`,
    );
  }

  // ==========================================
  // OBTENER MENSAJES NUEVOS (NO EN CACHÉ)
  // ==========================================
  getNewUIDs(usuarioId: string, folder: string, allUIDs: number[]): number[] {
    const cachedUIDs = this.getCachedUIDs(usuarioId, folder);

    if (!cachedUIDs) {
      // No hay caché, todos son nuevos
      return allUIDs;
    }

    // Filtrar UIDs que no están en caché
    const newUIDs = allUIDs.filter((uid) => !cachedUIDs.includes(uid));

    console.log(
      `💾 [EmailCache] ${newUIDs.length} new UIDs out of ${allUIDs.length} total`,
    );
    return newUIDs;
  }

  // ==========================================
  // COMBINAR CACHÉ CON NUEVOS MENSAJES
  // ==========================================
  getCompleteMessages(
    usuarioId: string,
    folder: string,
    newMessages: any[],
  ): any[] {
    const cachedUIDs = this.getCachedUIDs(usuarioId, folder);

    if (!cachedUIDs) {
      // No hay caché, retornar solo nuevos
      return newMessages;
    }

    // Obtener mensajes en caché que no están en los nuevos
    const cachedMessages: any[] = [];
    for (const uid of cachedUIDs) {
      const cached = this.getCachedMessage(usuarioId, folder, uid);
      if (cached) {
        cachedMessages.push(cached);
      }
    }

    // Combinar y ordenar por fecha
    const allMessages = [...cachedMessages, ...newMessages];
    allMessages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    console.log(
      `💾 [EmailCache] Combined: ${cachedMessages.length} cached + ${newMessages.length} new = ${allMessages.length} total`,
    );
    return allMessages;
  }

  // ==========================================
  // LIMPIAR CACHÉ EXPİRADA
  // ==========================================
  clearExpiredCache(): void {
    const now = Date.now();

    // Limpiar UIDs expirados
    for (const [key, cached] of this.uidCache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.uidCache.delete(key);
      }
    }

    // Limpiar mensajes expirados
    for (const [key, cached] of this.messageCache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.messageCache.delete(key);
      }
    }

    console.log(
      `💾 [EmailCache] Cleared expired cache. Remaining: ${this.uidCache.size} UID lists, ${this.messageCache.size} messages`,
    );
  }

  // ==========================================
  // LIMPIAR CACHÉ COMPLETA
  // ==========================================
  clearCache(): void {
    this.uidCache.clear();
    this.messageCache.clear();
    console.log('💾 [EmailCache] Cache cleared');
  }

  // ==========================================
  // OBTENER ESTADÍSTICAS DE CACHÉ
  // ==========================================
  getCacheStats(): { uidCacheSize: number; messageCacheSize: number } {
    return {
      uidCacheSize: this.uidCache.size,
      messageCacheSize: this.messageCache.size,
    };
  }

  // ==========================================
  // EVICT CACHÉ MÁS ANTIGUA (LRU simple)
  // ==========================================
  private evictOldestCache(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, cached] of this.messageCache.entries()) {
      if (cached.timestamp < oldestTimestamp) {
        oldestTimestamp = cached.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.messageCache.delete(oldestKey);
      console.log(`💾 [EmailCache] Evicted oldest cache entry: ${oldestKey}`);
    }
  }
}
