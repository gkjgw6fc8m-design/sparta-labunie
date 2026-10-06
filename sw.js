// GKS Sparta Łabunie — network-first cache fix
const CACHE_NAME='sparta-labunie-v68';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&r.ok&&u.origin===self.location.origin){
      const c=r.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c));
    }
    return r;
  }).catch(()=>caches.match(e.request)));
});
