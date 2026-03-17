/* SCA Survey — Service Worker v3 (Safari safe) */
const CACHE_NAME = "sca-survey-v3";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Safari safe — only cache on explicit fetch, never block */
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const network = fetch(event.request).then(response => {
          if(response && response.status === 200){
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
