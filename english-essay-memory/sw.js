/* 离线缓存：第一次打开存一份，之后秒开；网速优先，取不到才用缓存 */
const CACHE = 'eem-1.3.7';
const ASSETS = ["./", "index.html", "style.css", "data.txt", "extra.txt", "hide.txt", "pkg-1.txt", "pkg-2.txt", "pkg-3.txt", "pkg-4.txt", "pkg-5.txt", "case-1.json", "case-2.json", "case-3.json", "casepatch.js", "casequiz.js", "casedaily.js", "casequota.js", "ver.js", "ver2.js", "version.json", "manifest.webmanifest", "icon.svg"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(ASSETS.map(u => c.add(u).catch(() => null)))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const res = await fetch(r);
      if (res && res.ok) {
        const key = url.origin + url.pathname;
        c.put(key, res.clone()).catch(() => null);
      }
      return res;
    } catch (err) {
      const hit = await c.match(r, { ignoreSearch: true });
      if (hit) return hit;
      if (r.mode === 'navigate') {
        const idx = await c.match('index.html');
        if (idx) return idx;
      }
      return new Response('offline', { status: 503 });
    }
  })());
});
