// Fichier : src/utils/sessionStore.ts

const DB_NAME = 'TeeziDB';
const DB_VERSION = 1;
const STORE_NAME = 'session_videos';

export interface SessionVideo {
  id?: number;
  blob: Blob;
  date: string;
  club: string;
  duration: string;
  note?: string;
}

// 1. Initialisation de la base de données
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    // Création de la table si elle n'existe pas
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// 2. Sauvegarder une vidéo
export const saveVideoToSession = async (video: Omit<SessionVideo, 'id'>): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(video);
    
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

// 3. Récupérer toutes les vidéos
export const getSessionVideos = async (): Promise<SessionVideo[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// 4. Vider tout le panier
export const clearSession = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// 5. Compter le nombre de vidéos
export const getVideoCount = async (): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count(); // Utilise la méthode native count() très rapide
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// 6. Supprimer une seule vidéo
export const deleteVideoFromSession = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};