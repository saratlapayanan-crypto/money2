const CACHE_NAME = 'money2-thai-tarot-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './daily.html',
  './reading.html',
  './result.html',
  './cards-preview.html',
  './css/style.css',
  './manifest.json',
  './assets/icons/app-icon.svg',
  './data/cards.json',
  './data/interpretations.json',
  './data/questions.json',
  './data/remedies.json',
  './data/colors.json',
  './data/wallpapers.json',
  './data/decks.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first for Masterpiece card artwork images
  if (url.pathname.includes('/assets/cards/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for HTML, JS, CSS, JSON
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
