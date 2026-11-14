/* 「我的」页挂一块「版本」入口（网页版程序包里没有这一块，这里补上）。
   单文件用不到它：自带版本入口，file: 协议下直接跳过。 */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;
  window.__v2 = 1;

  function has() { return document.getElementById('verpanel'); }

  function body() {
    var VER = window.VER || '', VDATE = window.VERDATE || '';
    var VLOGS = window.__VERLOG || [];
    var n = VLOGS.length, top = (VLOGS[0] && VLOGS[0].v) ? VLOGS[0].v : VER;
    return '<div class="sec-t"><h2>版本</h2><span>' +
        (VER ? '当前 v' + VER + (VDATE ? ' · ' + VDATE : '') : '网页版') + '</span></div>' +
      '<div class="panel" style="padding:4px 14px"><div class="glist">' +
        '<button class="grow" data-ver="log"><div class="gt"><b>版本记录</b><small>' +
          (n ? n + ' 条 · 最新 v' + top : '看每次改了什么') +
          '</small></div><div class="gp">看</div></button>' +
        '<button class="grow" data-ver="chk"><div class="gt"><b>检查新版本</b><small>手动比对一次线上版本</small></div>' +
          '<div class="gp">查</div></button>' +
      '</div></div>';
  }

  function mount() {
    if (location.hash !== '#/mine') return false;
    if (has()) return true;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || !wrap.children.length) return false;
    var box = document.createElement('div');
    box.id = 'verpanel';
    box.innerHTML = body();
    var secs = wrap.querySelectorAll('.sec-t'), anchor = null, i;
    for (i = 0; i < secs.length; i++) {
      if (secs[i].textContent.indexOf('关于') >= 0) { anchor = secs[i]; break; }
    }
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor);
    else wrap.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-ver]') : null;
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      if (b.getAttribute('data-ver') === 'log') {
        if (window.showVerLog) window.showVerLog();
      } else if (window.checkNow) {
        window.checkNow();
      }
    });
    return true;
  }

  /* 程序是异步渲染的、还会整块重画，所以：渲染一动就看一眼，另另外再轮询 20 秒兜底 */
  function watch() {
    var app = document.getElementById('app');
    if (!app) {
      return setTimeout(watch, 120);
    }
    mount();
    if (window.MutationObserver) {
      var ob = new MutationObserver(function () { mount(); });
      ob.observe(app, { childList: true, subtree: true });
    }
    var stop = Date.now() + 20000;
    (function tick() {
      mount();
      if (Date.now() < stop) setTimeout(tick, 400);
      else setTimeout(function () { mount(); }, 400);
    })();
  }

  document.addEventListener('hashchange', function () {
    setTimeout(function () { mount(); }, 120);
    setTimeout(function () { mount(); }, 400);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
