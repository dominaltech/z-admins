// =============================================
// ADMIN PANEL - SERVICE WORKER
// Version 1.0.0
// =============================================

const CACHE_NAME = 'zaid-admin-v1';
const STATIC_CACHE = 'zaid-admin-static-v1';

const STATIC_ASSETS = [
    '/admin.html',
    '/admin-manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('[Admin SW] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[Admin SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== STATIC_CACHE) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
