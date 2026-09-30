const C='his-serums-v5';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Red primero para recibir actualizaciones; solo se guardan respuestas correctas.
  // Si GitHub no responde o devuelve error (404, 500...), se usa la copia guardada.
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r && r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }
      return caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html')).then(m=>m||r);
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html')))
  );
});
