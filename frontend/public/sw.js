// Service Worker básico para cache de recursos
const CACHE_NAME = 'barbearia-hoshirara-v1';
const urlsToCache = [
  '/Barbearia/',
  '/Barbearia/index.html',
  '/Barbearia/assets/',
  '/Barbearia/src/'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache).catch(function() {
          // Falha no cache não deve impedir a instalação
        });
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Apenas cache para requests GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Fetch from network
        return fetch(event.request).catch(function() {
          // Network failed, try to serve from cache
          return caches.match('/Barbearia/index.html');
        });
      }
    )
  );
});