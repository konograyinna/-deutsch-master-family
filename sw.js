const CACHE = 'mein-deutsch-stable-2.4.0-alpha.1';
const CORE = [
  './', './index.html', './styles.css?v=2.4.0-alpha.1', './app.js?v=2.4.0-alpha.1',
  './manifest.webmanifest', './content/catalog.json',
  './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    try {
      const catalog = await fetch('./content/catalog.json', { cache: 'no-store' }).then(r => r.json());
      await cache.addAll(catalog.packages.map(p => './' + p.path));
    } catch (error) {
      console.warn('Content pre-cache postponed', error);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isFreshAsset = url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/app.js') ||
    url.pathname.endsWith('/styles.css') ||
    url.pathname.endsWith('/content/catalog.json');

  event.respondWith((async () => {
    if (isFreshAsset) {
      try {
        const fresh = await fetch(event.request, { cache: 'no-store' });
        if (fresh.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, fresh.clone());
        }
        return fresh;
      } catch (error) {
        return (await caches.match(event.request)) || (await caches.match('./index.html'));
      }
    }

    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const fresh = await fetch(event.request);
      if (fresh.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(event.request, fresh.clone());
      }
      return fresh;
    } catch (error) {
      return caches.match('./index.html');
    }
  })());
});
