const cacheName = 'protask-v2'; // E ndryshuam në v2 që të detyrojmë përditësimin
const assets = [
  '/',
  '/index.html',
  '/todo.html',
  '/todo.css',
  '/todo.js',
  '/manifest.json',
  'https://cdn-icons-png.flaticon.com/512/5610/5610944.png' // Cache edhe ikonën
];

// 1. Instalo Service Worker dhe ruaj skedarët në cache
self.addEventListener('install', e => {
  self.skipWaiting(); // Detyron SW të ri të aktivizohet menjëherë
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. Aktivizo dhe fshi cache-et e vjetra (Kjo rregullon ikonën)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
});

// 3. Strategjia: Provo Cache, nëse s'ka, merr nga Interneti
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
