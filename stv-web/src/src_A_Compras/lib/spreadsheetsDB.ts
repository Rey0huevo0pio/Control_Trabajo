const DB_NAME = 'GoogleSheetsDB';
const DB_VERSION = 1;
const STORE_NAME = 'spreadsheets';

let db: IDBDatabase | null = null;

interface SpreadsheetRecord {
  id: string;
  name?: string;
  mimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  cachedAt?: string;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database?.objectStoreNames.contains(STORE_NAME)) {
        const store = database?.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store?.createIndex('modifiedTime', 'modifiedTime', { unique: false });
      }
    };
  });
};

export const spreadsheetsDB = {
  async saveSpreadsheets(spreadsheets: SpreadsheetRecord[]): Promise<boolean> {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.clear();

    for (const sheet of spreadsheets) {
      store.put({
        ...sheet,
        cachedAt: new Date().toISOString(),
      });
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async getSpreadsheets(): Promise<SpreadsheetRecord[]> {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async getSpreadsheet(id: string): Promise<SpreadsheetRecord | undefined> {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async clearSpreadsheets(): Promise<boolean> {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async getCacheTimestamp(): Promise<string | null> {
    const sheets = await this.getSpreadsheets();
    if (sheets.length > 0) {
      return sheets[0].cachedAt || null;
    }
    return null;
  },
};

export default spreadsheetsDB;