/* Service Worker for therun.app */
const CACHE = 'therun-app-v1';
const ASSETS = [
'/',
'/index.html',
'/manifest.webmanifest',
'/assets/styles.css',
'/assets/app.js',
'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];
self.addEventListener('install', (e)=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
e.waitUntil(
caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
);
self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
const { request } = e;
if(request.method !== 'GET') return;
e.respondWith(
caches.match(request).then(cached=> cached || fetch(request).then(res=>{
const copy = res.clone();
caches.open(CACHE).then(c=>c.put(request, copy));
return res;
}).catch(()=> caches.match('/index.html')))
);
});
