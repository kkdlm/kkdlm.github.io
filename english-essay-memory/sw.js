/* 缓存 worker：第一次打开先把整套文件存到本机，之后打开先走本机、后台静默换新 */
const CACHE = "eem-1.2.7";
const ASSETS = ["./", "index.html", "style.css", "data.txt", "extra.txt", "hide.txt", "pkg-1.txt", "pkg-2.txt", "pkg-3.txt", "pkg-4.txt", "pkg-5.txt", "case-1.json", "case-2.json", "case-3.json", "casepatch.js", "casequiz.js", "ver.js", "ver2.js", "version.json", "manifest.webmanifest", "icon.svg"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(ASSETS).catch(function () { });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.indexOf("version.json") >= 0) { e.respondWith(fetch(e.request, { cache: "no-store" }).catch(function () { return caches.match(e.request); })); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    if (r) return r;
    return fetch(e.request).then(function (res) {
      if (res && res.status === 200) caches.open(CACHE).then(function (c) { c.put(e.request, res.clone()); });
      return res;
    }).catch(function () { return caches.match("index.html"); });
  }));
});
