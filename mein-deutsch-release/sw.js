const CACHE='mein-deutsch-stable-1.0.0';
const CORE=['./','./index.html','./app.js','./styles.css','./manifest.webmanifest','./content/catalog.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(CORE);
  try{
    const catalog=await fetch('./content/catalog.json',{cache:'no-store'}).then(r=>r.json());
    await cache.addAll(catalog.packages.map(p=>'./'+p.path));
  }catch(e){console.warn('Content pre-cache postponed',e)}
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if(response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}
      return response;
    }catch(e){return caches.match('./index.html')}
  })());
});
