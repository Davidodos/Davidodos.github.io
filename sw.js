// PlanMess service worker — offline cache for app shell + PDF.js CDN
const CACHE = 'planmess-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      SHELL.map(u => c.add(u).catch(()=>null))
    )).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(res => {
      if (res) return res;
      return fetch(req).then(net => {
        // Cache successful responses for shell + CDN scripts
        if (net && net.status === 200 && (req.url.startsWith(self.location.origin) || req.url.includes('cdnjs.cloudflare.com'))) {
          const copy = net.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        }
        return net;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
