/* ---------- 版本与更新（由 build/mk_ver.py 生成） ---------- */
(function () {
  'use strict';
  var VER = '1.0.0', VDATE = '2026-11-14', VLOGS = [{"v":"1.0.0","d":"2026-11-14","t":"模板句收口 + 更新系统","items":["第二、第一段模板句从 114 句收到 54 句：主背全留，每组只再留 2~3 句备用，全站 326 → 266 张卡 / 50 组","一页纸速查 5 张、六大方面 132 条、图表词汇 19 条、替换词 61 组不动","新增更新系统：打开自动比对线上版本，有新版本时底部弹「立即更新」，点一下换到新版","首次打开后缓存一份到本机，之后离线也能开；「我的 → 关于」里有版本号、检查更新、更新记录"]},{"v":"0.9.0","d":"2026-11-14","t":"图标与启动图换成粟线 E","items":["主屏图标由三根圆角条换成红底米白衬线 E（180 / 192 / 512 三档）","iOS 系统启动图 6 个尺寸按同一枚徽标重做，打开不再先闪旧三条杠","PWA 启动画面里的标志同步换成 E 字方块"]},{"v":"0.8.0","d":"2026-11-14","t":"按主模板补齐内容","items":["逐页比对两份 PDF：六大方面 132 条齐全，模板句、图表词汇、替换词补了 27 张主模板独有的卡","替换词不再整排铺一屏：一组只出一个说法，给骨架句、挖空自己填，整组按最差的那个排期","中→英 / 英→中 双向可切，逐词背带中文骨架"]}];
  var KVER = 'eem:ver';
  window.VER = VER; window.VERDATE = VDATE;

  /* ---- 底部更新条 ---- */
  var CSS = '' +
    '.verbar{position:fixed;left:0;right:0;bottom:calc(64px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:10px;' +
      'margin:0 12px;padding:11px 12px;border-radius:12px;background:#fffdf8;border:1px solid #e2dcd2;' +
      'box-shadow:0 8px 22px rgba(60,40,20,.14);font-size:13px;color:#2b2320;' +
      'transform:translateY(140%);opacity:0;transition:transform .22s ease,opacity .22s ease;pointer-events:none}' +
    '.verbar.show{transform:none;opacity:1;pointer-events:auto}' +
    '.verbar .vb-txt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.verbar .vb-act{flex:none;border:0;border-radius:9px;padding:7px 12px;background:#a2352a;color:#fdf8f0;font-size:13px}' +
    '.verbar .vb-x{flex:none;border:0;background:transparent;color:#8d8272;font-size:16px;padding:0 2px}' +
    '.vlog{margin-top:8px}' +
    '.vlog .vi{border-left:2px solid #e2dcd2;padding:2px 0 10px 12px;margin-left:2px}' +
    '.vlog .vi.now{border-left-color:#a2352a}' +
    '.vlog .vh{font-size:12px;color:#8d8272;margin-bottom:3px}' +
    '.vlog .vt{font-weight:600;font-size:14px;margin-bottom:4px}' +
    '.vlog .vi ul{margin:0;padding-left:17px}' +
    '.vlog .vi li{font-size:13px;line-height:1.72;color:#4a423b}' +
    '@media (max-width:360px){.verbar .vb-txt{font-size:12px}}';
  var st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);

  function bar(msg, btnTxt, onAct, sticky) {
    var el = document.getElementById('verbar');
    if (!el) {
      el = document.createElement('div');
      el.id = 'verbar'; el.className = 'verbar';
      document.body.appendChild(el);
    }
    el.innerHTML = '<span class="vb-txt"></span><button class="vb-act"></button><button class="vb-x">×</button>';
    el.querySelector('.vb-txt').textContent = msg;
    var b = el.querySelector('.vb-act');
    b.textContent = btnTxt; b.onclick = onAct;
    el.querySelector('.vb-x').onclick = function () { el.classList.remove('show'); clearTimeout(el._t); };
    el.classList.add('show');
    clearTimeout(el._t);
    if (!sticky) el._t = setTimeout(function () { el.classList.remove('show'); }, 8000);
  }

  function toast(t) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t; el.classList.add('show');
    clearTimeout(el._tt);
    el._tt = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function cmp(a, b) {
    var x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
    for (var i = 0; i < 3; i++) {
      var A = x[i] || 0, B = y[i] || 0;
      if (A !== B) return A > B ? 1 : -1;
    }
    return 0;
  }

  function reload() {
    try { location.replace(location.pathname + '?v=' + Date.now()); }
    catch (e) { location.reload(); }
  }

  function check(manual) {
    if (!manual) { /* 静默检查，失败不提示 */ }
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (j && j.version && cmp(j.version, VER) > 0) {
          bar('有新版本 v' + j.version, '立即更新', function () {
            /* 先让 worker 换新版，再整页重载 */
            try {
              navigator.serviceWorker.getRegistrations().then(function (rs) {
                rs.forEach(function (r) { r.update(); });
              });
            } catch (e) { }
            setTimeout(reload, 260);
          }, true);
        } else if (manual) {
          toast('已是最新版本 v' + VER);
        }
      })
      .catch(function () { if (manual) toast('检查不到更新信息（离线时正常）'); });
  }

  window.checkNow = function () { check(true); };

  /* 更新记录弹层：沿用「我的」页的 panel 观感 */
  window.showVerLog = function () {
    var old = document.getElementById('vlogbox');
    if (old) { old.parentNode.removeChild(old); return; }
    var box = document.createElement('div');
    box.id = 'vlogbox';
    box.className = 'wrap';
    var h = '<div class="sec-t"><h2>更新记录</h2><span>点一下收起</span></div><div class="panel pad"><div class="note"><b>当前版本 v' + VER + '</b> · ' + VDATE + ' · 单文件与网页同源，进度数据只在本机。</div><div class="vlog">';
    VLOGS.forEach(function (x) {
      h += '<div class="vi' + (x.v === VER ? ' now' : '') + '">' +
        '<div class="vh">v' + x.v + ' · ' + x.d + (x.v === VER ? ' · 当前' : '') + '</div>' +
        '<div class="vt">' + x.t + '</div><ul>' + x.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
    });
    h += '</div></div>';
    box.innerHTML = h;
    var app = document.getElementById('app');
    if (app && app.parentNode) app.parentNode.insertBefore(box, app.nextSibling);
    box.scrollIntoView({ block: 'start', behavior: 'smooth' });
    box.onclick = function () { if (box.parentNode) box.parentNode.removeChild(box); };
  };

  /* 刚打开：上次记的版本和这次不一样 → 说明刚更新过 */
  function boot() {
    var last = null;
    try {
      last = localStorage.getItem(KVER);
      localStorage.setItem(KVER, VER);
    } catch (e) { }
    if (last && last !== VER) {
      bar('已更新至 v' + VER, '更新记录', function () { window.showVerLog(); }, false);
    }
    setTimeout(function () { check(false); }, 1800);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && Date.now() - bootAt > 600000) check(false);
    });
    var bootAt = Date.now();
    window.__verBootAt = bootAt;
  }

  /* 离线缓存：注册失败不影响使用 */
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' })
        .catch(function () { });
    }
  } catch (e) { }

  setTimeout(boot, 900);
})();
