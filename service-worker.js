
// service-worker.js
const CACHE_NAME = 'luca-ai-cache-v1';
const urlsToCache = [
  '/', // Alias for index.html
  '/index.html',
  '/manifest.json',
  // Add paths to your icons here - THE USER MUST CREATE THESE
  // These paths should match what's in manifest.json
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
  // Note: Caching TSX/JS modules directly here for an importmap setup is complex.
  // The browser handles fetching these based on the importmap.
  // For true offline for these, a build step + more advanced SW is needed.
  // This basic SW enables "Add to Home Screen" and basic app shell caching.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' }))); // Ensure fresh fetch during install
      })
      .catch(err => {
        console.error('Service Worker: Caching failed during install', err);
      })
  );
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    // For non-GET requests, use the network.
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached response, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the request is not in the cache, fetch it from the network.
        return fetch(event.request).then((networkResponse) => {
          // Optionally, cache new assets dynamically if they are from your origin
          // Be careful with caching everything, especially third-party assets or large files.
          // For this basic example, we're not dynamically caching new fetches
          // beyond what's in urlsToCache during install.
          return networkResponse;
        }).catch(error => {
          console.warn('Service Worker: Network fetch failed for:', event.request.url, error);
          // If it's a navigation request and network fails, you could serve an offline.html page.
          // For now, let the browser handle the failure.
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Ensure clients are controlled by this SW immediately.
  );
});
