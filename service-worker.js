var cacheName = 'classstore-v1';
var cacheFiles = [
    'index.html',
    'lessons.json',
    'manifest.json',
    'logo.82b9c7a5.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
            
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            return r || fetch(e.request).then(function (response) {
                return caches.open(cachename).then(function (cache) {
                    cache.put(e.request, response.clone());
                return response;
            });
        });
    })
    );
});