export interface ChatMessage {
  id?: number;
  type: 'bot' | 'user';
  text: string;
  timestamp: number;
}

export class ChatDB {
  private dbName = 'GlofiHubChat';
  private version = 1;

  async openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMessage(message: ChatMessage) {
    const db = await this.openDB();
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    return new Promise((resolve) => {
      const request = store.add(message);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getMessages(): Promise<ChatMessage[]> {
    const db = await this.openDB();
    const tx = db.transaction('messages', 'readonly');
    const store = tx.objectStore('messages');
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearHistory() {
    const db = await this.openDB();
    const tx = db.transaction(['messages', 'userData'], 'readwrite');
    tx.objectStore('messages').clear();
    tx.objectStore('userData').clear();
  }

  async saveUserData(key: string, value: any) {
    const db = await this.openDB();
    const tx = db.transaction('userData', 'readwrite');
    const store = tx.objectStore('userData');
    store.put({ key, value });
  }

  async getUserData(key: string): Promise<any> {
    const db = await this.openDB();
    const tx = db.transaction('userData', 'readonly');
    const store = tx.objectStore('userData');
    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
    });
  }
}

export const chatDB = new ChatDB();
