// Service worker minimal : met en cache l'app shell (HTML/CSS/JS) pour le
// fonctionnement hors-ligne. Les fichiers audio importés par l'utilisateur
// NE PASSENT PAS par ici — ils vivent dans IndexedDB (voir pilier 1 du plan).
// Mélanger les deux mécanismes de cache complexifierait inutilement.

const CACHE_NAME = "organum-shell-v1";
const APP_SHELL = [
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

// Stratégie "Cache First" pour l'app shell : on contrôle nous-mêmes les mises
// à jour (changement de CACHE_NAME), donc pas besoin d'aller sur le réseau
// à chaque chargement.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
