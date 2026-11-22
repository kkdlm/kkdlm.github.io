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
  /* 取一个 gz+base64 的小包并执行其中的脚本；取不到就跳过 */
  function loadPack(name, then) {
    var y = new XMLHttpRequest();
    y.open('GET', name + '?v=' + Date.now(), true);
    y.onload = function () {
      try {
        if (y.status < 400 && y.responseText) {
          var st = new Blob([b64ToBytes(y.responseText)]).stream().pipeThrough(new DecompressionStream('gzip'));
          new Response(st).text().then(function (t) {
            try { new Function(t)(); } catch (e) { console.warn(name + ' 解析失败：' + (e && e.message ? e.message : e)); }
            then();
          }, then);
          return;
        }
      } catch (e) { }
      then();
    };
    y.onerror = then;
    y.send();
  }
  /* 先加载补充库（extra.txt）与隐藏清单（hide.txt）：取不到也不影响主程序使用 */
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
      loadPack('hide.txt', trim);
    }
    function trim() {
      /* 模板句裁剪：把清单里多余的那几张从数据里摘掉，再交给程序 */
      var h = window.__HIDE__ || [], d = window.__DATA__ || {};
      if (h.length && d.cards) {
        var m = {};
        h.forEach(function (i) { m[i] = 1; });
        d.cards = d.cards.filter(function (c) { return !m[c.id]; });
      }
      var n = (d.cards || []).length, el = document.querySelector('.sp-s');
      if (n && el) el.textContent = '背诵程序 · ' + n + ' 张卡 · 大作文 + 小作文';
      applyCase(cb);
    }
  }
  /* 真题补丁：case-1/2.json 里是每张卡的「真题 · 什么时候用」，贴到卡面 tip 上 */
  function applyCase(next) {
    var parts = ['case-1.json', 'case-2.json'], got = 0, all = [];
    parts.forEach(function (p, i) {
      var y = new XMLHttpRequest();
      y.open('GET', p + '?v=' + Date.now(), true);
      y.onload = function () {
        try { if (y.status < 400 && y.responseText) all[i] = JSON.parse(y.responseText); } catch (e) { }
        if (++got === parts.length) run();
      };
      y.onerror = function () { if (++got === parts.length) run(); };
      y.send();
    });
    function run() {
      var m = {}, d = window.__DATA__ || {}, n = 0, k;
      all.forEach(function (o) { if (o) for (k in o) if (o.hasOwnProperty(k)) m[k] = o[k]; });
      (d.cards || []).forEach(function (c) {
        var u = m[c.id];
        if (!u) return;
        var add = '▍真题 · 什么时候用\n' + (u.q ? u.q + '\n' : '') + (u.eg ? u.eg + '\n' : '') + (u.egzh ? '译：' + u.egzh : '');
        add = add.replace(/\s+$/, '');
        if (!c.tip) c.tip = add;
        else if (c.tip.indexOf('真题 · 什么时候用') < 0) c.tip = c.tip + '\n' + add;
        n++;
      });
      window.__CASE__ = m;
      try {
        var st = document.createElement('style');
        st.textContent = '.tip{white-space:pre-line}';
        document.head.appendChild(st);
      } catch (e) { }
      /* 真题块 / 组页提示的挂载逻辑在 casepatch.js：取不到就直接进主程序 */
      try {
        var z = new XMLHttpRequest();
        z.open('GET', 'casepatch.js?v=' + Date.now(), true);
        z.onload = function () {
          try { if (z.status < 400 && z.responseText) new Function(z.responseText)(); } catch (e) { }
          next();
        };
        z.onerror = function () { next(); };
        z.send();
      } catch (e) { next(); }
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
