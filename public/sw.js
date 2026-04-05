const CACHE_NAME = 'szabo-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 1. Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // 2. Bypass Service Worker for localhost (Development/Vite Client)
  const url = new URL(event.request.url);
  if (url.hostname === 'localhost' || url.port === '5173' || url.pathname.includes('@vite')) {
    return;
  }

  // 3. Stale-While-Revalidate Strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Only cache 200/basic responses
        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(err => {
        console.log('Fetch failed, fallback to cache:', err);
        // Do NOT return undefined, throw or allow browser fallback
        throw err; 
      });

      // If we have a cached response, return it immediately; otherwise, wait for fetch
      return cachedResponse || fetchPromise;
    })
  );
});
