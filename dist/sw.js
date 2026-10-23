const CACHE='learnings-web-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./content.js','./engine.js','./install.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('learnings-web-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 // Cache only the explicit static app files, never arbitrary same-origin requests.
 const assetURL=new URL(request.mode==='navigate'?'./index.html':request.url,self.registration.scope);
 const known=ASSETS.some(path=>new URL(path,self.registration.scope).href===assetURL.href);
 if(!known)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok&&!response.redirected){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(assetURL.href,copy)));}
  return response;
 }).catch(async()=>{const cached=await caches.match(assetURL.href);return cached||Response.error();}));
});
