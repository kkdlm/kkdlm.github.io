/* 「我的」页挂一块「版本」入口（网页版程序包里没有这一块，这里补上）。
   同一份 ver.js 在单文件里用不到它：单文件自带版本入口，file: 协议下直接跳过。 */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;

  function mounts() { return document.getElementById('verpanel'); }

  function body() {
    var VER = window.VER || '', VDATE = window.VERDATE || '';
    var VLOGS = window.__VERLOG || [];
    return '<div class="sec-t"><h2>版本</h2><span>' + (VER ? '当前 v' + VER + (VDATE ? ' · ' + VDATE : '') : '网页版') + '</span></div>' +
      '<div class="panel" style="padding:4px 14px"><div class="glist">' +
        '<button class="grow" data-ver="log"><div class="gt"><b>版本记录</b><small>' +
          (VLOGS.length ? VLOGS.length + ' 条 · 最新 v' + (VLOGS[0] && VLOGS[0].v ? VLOGS[0].v : VER) : '看每次改了什么') +
          '</small></div><div class="gp">看</div></button>' +
        '<button class="grow" data-ver="chk"><div class="gt"><b>检查新版本</b><small>手动比对一次线上版本</small></div><div class="gp">查</div></button>' +
      '</div></div>';
  }

  function mount() {
    if (location.hash !== '#/mine') return;
    if (mounts()) return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap) return;
    var secs = wrap.querySelectorAll('.sec-t'), anchor = null, i;
    for (i = 0; i < secs.length; i++) {
      if (secs[i].textContent.indexOf('关于') >= 0) { anchor = secs[i]; break; }
    }
    var box = document.createElement('div');
    box.id = 'verpanel';
    box.innerHTML = body();
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor);
    else wrap.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ver]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      if (b.getAttribute('data-ver') === 'log') {
        if (window.showVerLog) window.showVerLog();
      } else {
        if (window.checkNow) window.checkNow();
      }
    });
  }

  /* 程序是异步渲染的，页面刚开、切页刚点到都可能还没画完，所以连续重试几次 */
  function retry(n) {
    mount();
    if (n > 0 && location.hash === '#/mine' && !mounts()) {
      setTimeout(function () { retry(n - 1); }, 260);
    }
  }
  document.addEventListener('hashchange', function () { setTimeout(function () { retry(6); }, 100); });
  window.addEventListener('load', function () { setTimeout(function () { retry(8); }, 200); });
  setTimeout(function () { retry(8); }, 400);
})();
