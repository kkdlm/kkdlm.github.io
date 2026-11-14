(function () {
  'use strict';
  var box = document.getElementById('app');
  function fail(msg) {
    if (box) box.innerHTML = '<div class="wrap"><div class="empty">' + msg + '</div></div>';
    try { console.error(msg); } catch (e) { }
  }
  function b64ToBytes(b64) {
    var s = String(b64).replace(/[^A-Za-z0-9+/=]/g, '');
    while (s.length % 4) s += '=';                 /* 补齐 base64 填充，传丢了也能解 */
    var bin = atob(s);
    var n = bin.length, u = new Uint8Array(n), i;
    for (i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  /* 补充库的逐词中文表：程序包里只有主库的 GT，这里把增量补进去（取不到就跳过） */
  function patchGT(t) {
    var x = window.__GTX__;
    if (!x) return t;
    var add = 'Object.keys(window.__GTX__||{}).forEach(function(k){GT[k]=window.__GTX__[k];});';
    var re = /(var GT = \{[\s\S]*?\};\n)/;
    return re.test(t) ? t.replace(re, function (m) { return m + '  ' + add + '\n'; }) : t + '\n' + add + ';\n';
  }
  function run(text) {
    try { new Function(patchGT(text))(); }
    catch (e) { fail('程序执行失败：' + (e && e.message ? e.message : e)); }
  }
  /* 先加载补充库（extra.txt）：取不到也不影响主程序使用 */
  function loadExtra(cb) {
    var y = new XMLHttpRequest();
    y.open('GET', 'extra.txt?v=' + Date.now(), true);
    y.onload = function () {
      var ok = y.status < 400 && y.responseText;
      try {
        if (ok) {
          var s = new Blob([b64ToBytes(y.responseText)]).stream().pipeThrough(new DecompressionStream('gzip'));
          new Response(s).text().then(function (t) {
            try { new Function(t)(); } catch (e) { console.warn('补充库解析失败：' + (e && e.message ? e.message : e)); }
            after();
          }, after);
        } else { after(); }
      } catch (e) { after(); }
    };
    y.onerror = function () { after(); };
    y.send();
    function after() {
      var d = window.__DATA__ || {};
      var n = (d.cards || []).length, el = document.querySelector('.sp-s');
      if (n && el) el.textContent = '背诵程序 · ' + n + ' 张卡 · 六大方面';
      cb();
    }
  }
  var MAXP = 8, idx = 1, acc = [], v = Date.now();
  function finish() {
    if (!acc.length) { fail('取不到程序包，请连网后刷新'); return; }
    if (typeof DecompressionStream !== 'function') { fail('当前浏览器不支持解压，请更新系统或换 Chrome 打开'); return; }
    try {
      var bytes = b64ToBytes(acc.join(''));
      var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      new Response(stream).text().then(run, function (e) { fail('程序包解压失败：' + (e && e.message ? e.message : e)); });
    } catch (e) { fail('程序包解析失败：' + (e && e.message ? e.message : e)); }
  }
  function step() {
    if (idx > MAXP) { finish(); return; }
    var x = new XMLHttpRequest();
    x.open('GET', 'pkg-' + idx + '.txt?v=' + v, true);
    x.onerror = function () { finish(); };
    x.onload = function () {
      if (x.status >= 400) { finish(); return; }
      acc.push(x.responseText); idx++; step();
    };
    x.send();
  }
  loadExtra(step);
})();
