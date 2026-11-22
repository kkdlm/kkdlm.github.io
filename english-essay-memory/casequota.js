/* 「我的 → 设置」每日新卡上限：五个预设档之外再给一个自定义入口
   改的是程序自己那份存档（ky_zw_v1），走程序自己的 setn，不另存第二份设置 */
(function () {
  'use strict';
  var QCSS = '' +
    '.qrow{display:flex;align-items:center;gap:6px;margin-top:9px;flex-wrap:nowrap}' +
    '.qrow input{width:64px;flex:none;border:1px solid #e2dcd2;border-radius:9px;padding:7px 8px;font-size:13px;' +
      'background:#fffdf8;color:#2b2320;font-family:Georgia,serif;-webkit-appearance:none;margin:0}' +
    '.qrow .qstep{flex:none;width:34px;border:1px solid #e2dcd2;border-radius:9px;background:#fffdf8;color:#5f574c;' +
      'font-size:13px;padding:7px 0;line-height:1}' +
    '.qrow .qbtn{flex:none;border:1px solid #a2352a;border-radius:9px;background:#a2352a;color:#fdf8f0;font-size:13px;padding:7px 12px}' +
    '.qhint{font-size:11.5px;color:#a89c8b;line-height:1.65;margin-top:6px}' +
    '.qhint b{color:#a2352a;font-weight:600}' +
    '@media (max-width:360px){.qrow input{width:56px}.qrow .qbtn{padding:7px 9px;font-size:12.5px}}';
  var QPRESET = [10, 20, 25, 30, 40], qSty = false;

  function qToast(t) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('show');
    clearTimeout(el._qt);
    el._qt = setTimeout(function () { el.classList.remove('show'); }, 2000);
  }
  function qCur() {
    try {
      var S = JSON.parse(localStorage.getItem('ky_zw_v1') || '{}') || {};
      return (S.set && S.set.newPerDay) || 25;
    } catch (e) { return 25; }
  }
  /* 借用程序自己的 setn：同一份存档、同一套重绘 */
  function qApply(v) {
    var app = document.getElementById('app');
    if (!app) { location.reload(); return; }
    var b = document.createElement('button');
    b.type = 'button'; b.style.display = 'none';
    b.setAttribute('data-act', 'setn'); b.setAttribute('data-arg', String(v));
    app.appendChild(b); b.click();
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 0);
  }

  function mountQuota() {
    if (location.hash !== '#/mine') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#qCustomRow')) return;
    var f = null, fs = wrap.querySelectorAll('.field'), i;
    for (i = 0; i < fs.length; i++) {
      var lb = fs[i].querySelector('label');
      if (lb && lb.textContent.indexOf('每日新卡上限') >= 0) { f = fs[i]; break; }
    }
    if (!f) return;
    if (!qSty) {
      var st = document.createElement('style');
      st.textContent = QCSS; document.head.appendChild(st); qSty = true;
    }
    var cur = qCur(), row = document.createElement('div');
    row.id = 'qCustomRow'; row.className = 'qrow';
    row.innerHTML = '<input id="qCustomIn" type="number" min="1" max="200" step="1" inputmode="numeric" value="' + cur + '">' +
      '<button class="qstep" type="button" data-q="-5">−5</button>' +
      '<button class="qstep" type="button" data-q="5">+5</button>' +
      '<button class="qbtn" type="button" data-q="set">设为每日</button>';
    var chips = f.querySelector('.chips');
    if (chips && chips.parentNode) chips.parentNode.insertBefore(row, chips.nextSibling);
    else f.appendChild(row);

    var hint = document.createElement('div');
    hint.className = 'qhint';
    hint.innerHTML = '现在每天上 <b>' + cur + ' 张</b>' +
      (QPRESET.indexOf(cur) < 0 ? '（自定义档，不在上面五个里）' : '') +
      '；填 1–200 之间的整数，改完「今天背什么」「本周目标」「考前够不够」三块一起跟着变。';
    if (row.parentNode) row.parentNode.insertBefore(hint, row.nextSibling);

    row.addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var inp = document.getElementById('qCustomIn');
      var v = parseInt(inp.value, 10);
      var k = b.getAttribute('data-q');
      if (k !== 'set') v = (isNaN(v) ? qCur() : v) + parseInt(k, 10);
      if (!(v >= 1 && v <= 200)) { qToast('填 1–200 之间的整数'); inp.value = qCur(); return; }
      inp.value = v; qApply(v); qToast('已改为每天 ' + v + ' 张');
    });
  }

  function tick() { try { mountQuota(); } catch (e) { } }
  function init() {
    var app = document.getElementById('app');
    if (!app) return;
    try {
      var t = null;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 40); })
        .observe(app, { childList: true, subtree: true });
    } catch (e) { }
    document.addEventListener('hashchange', function () { setTimeout(tick, 90); });
    tick();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
