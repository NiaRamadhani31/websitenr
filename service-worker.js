const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  'index.html',
  'about.html',
  'contact.html',
  'style.css',
  'nia.jpg',
  'icon-192x192.png',
  'icon-512x512.png',
  'offline.html'  // Tambahkan halaman offline ke cache
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch files from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match('offline.html');  // Tampilkan halaman offline jika jaringan tidak tersedia
      });
    })
  );
});

// Update cache when a new version of the service worker is installed
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
