const CACHE_NAME = 'loredex-os-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Install: cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and API/tRPC calls
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip cross-origin requests. CDN assets (S3 audio/video, CloudFront
  // images) carry their own long-lived cache-control headers and the
  // browser HTTP cache handles them. Intercepting them here breaks
  // media playback: HTML5 Audio issues range requests that return
  // 206 Partial Content, which cache.put() rejects with TypeError —
  // taking the audio element down with it. Keeping the SW scope to
  // same-origin shell + assets avoids the whole class of issue.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip range requests even on same-origin. The Cache API can't store
  // 206 Partial Content, and any future same-origin media file would
  // hit the same failure mode.
  if (event.request.headers.has('range')) {
    return;
  }

  // For navigation requests, try network first then cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // For static assets: cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2?|ttf|eot|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
