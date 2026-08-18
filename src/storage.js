/**
 * storage.js
 *
 * Génère un identifiant unique pour chaque fichier importé, afin de ne
 * jamais dépendre du nom du fichier original (voir pilier 4 : un nom de
 * fichier peut changer ou se dupliquer, un identifiant généré non).
 */

export function generateFileId() {
    return crypto.randomUUID();
}