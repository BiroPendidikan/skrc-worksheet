const CACHE_NAME = 'skrc-worksheet-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json',
  // Tambah aset statik utama jika perlu
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Hanya cache GET
  if (event.request.method !== 'GET') return;

  // Untuk navigasi halaman, guna strategi network-first, fallback ke cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((resp) => resp || caches.match('/')))
    );
  } else {
    // Untuk aset lain, network-first, fallback cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Hanya cache response yang berjaya dan aset statik
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});