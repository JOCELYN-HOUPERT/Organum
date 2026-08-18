/**
 * storage.js
 *
 * Stockage des fichiers audio importés par l'utilisateur, dans IndexedDB
 * (le "coffre-fort" du navigateur). Chaque fichier est associé à un
 * identifiant unique généré à l'import (voir pilier 4 : jamais de nom de
 * fichier brut comme référence).
 */

const DB_NAME = "organum-db";
const STORE_NAME = "audio-files";

export function generateFileId() {
    return crypto.randomUUID();
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveFile(blob) {
    const fileId = generateFileId();
    const db = await openDatabase();

    await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(blob, fileId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });

    return fileId;
}

export async function getFile(fileId) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(fileId);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
    });
}
