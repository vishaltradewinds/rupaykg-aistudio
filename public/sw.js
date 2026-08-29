// RupayKg Enterprise 3.0 Service Worker - Critical UI Asset Caching & Offline Sync
const CACHE_NAME_STATIC = 'rupaykg-static-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/logo.png',
  '/robots.txt',
  '/sitemap.xml'
];

// Install Event - Pre-cache critical UI shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      console.log('[ServiceWorker] Pre-caching critical UI assets shell...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up outdated cache stores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME_STATIC)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache API responses. Authenticated API data is tenant/session scoped
  // and must not be persisted in a shared browser cache.
  if (url.pathname.startsWith('/api/')) {
    if (req.method !== 'GET') return;

    event.respondWith(
      fetch(req).catch(() => new Response(
        JSON.stringify({
          offline: true,
          message: 'Device is offline. Live API data is unavailable.'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      ))
    );
    return;
  }

  // Navigation / HTML document requests - network-first with cached fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(req, resClone));
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Static assets - cache-first with background revalidation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && req.url.startsWith(self.location.origin)) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(req, resClone));
        }
        return networkResponse;
      });
    })
  );

  // Offline mutation replay is coordinated by the application offline-sync manager.
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-mutations') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' });
        });
      })
    );
  }
});
