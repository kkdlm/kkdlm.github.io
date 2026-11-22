/* 真题自测：从 85 处真题里抽 10 句，问「这句出自哪一年哪一卷」；不动数据包，只在测试页挂一个入口 */
(function () {
  'use strict';
  var CM = {}, BEST = 'eem:qz';
  var CSS = '' +
    '.cquiz{position:fixed;inset:0;z-index:85;background:rgba(43,35,32,.32);display:flex;align-items:flex-end}' +
    '.cquiz .box{width:100%;max-height:88vh;background:#fbf8f2;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden}' +
    '.cquiz .hd{display:flex;align-items:center;gap:10px;padding:14px 16px 6px}' +
    '.cquiz .hd h3{margin:0;font-size:15px;font-weight:600;flex:1;color:#2b2320}' +
    '.cquiz .hd .n{font-size:12px;color:#8d8272}' +
    '.cquiz .hd .x{border:0;background:transparent;font-size:17px;color:#8d8272;padding:0 2px}' +
    '.cquiz .bd{overflow:auto;-webkit-overflow-scrolling:touch;padding:4px 16px calc(20px + env(safe-area-inset-bottom))}' +
    '.cquiz .qk{font-size:12px;color:#a2352a;letter-spacing:.5px;margin:6px 0 8px}' +
    '.cquiz .qe{font-family:Georgia,"Times New Roman",serif;font-size:16px;line-height:1.6;color:#2b2320;word-break:break-word}' +
    '.cquiz .qz{font-size:12.5px;color:#7a6f61;line-height:1.72;margin-top:8px}' +
    '.cquiz .opt{display:block;width:100%;box-sizing:border-box;text-align:left;margin-top:9px;padding:10px 12px;border:1px solid #e2dcd2;background:#fffdf8;border-radius:10px;font-size:14px;color:#2b2320}' +
    '.cquiz .opt.on{border-color:#a2352a;background:#fbf1ef}' +
    '.cquiz .opt.ok{border-color:#3f7a58;background:#f1f7f2;color:#2f5c43}' +
    '.cquiz .opt.bad{border-color:#a2352a;background:#fbf1ef;color:#8e2b22}' +
    '.cquiz .fb{margin-top:14px;padding:10px 12px 12px;border-left:3px solid #a2352a;background:#fdfaf5;border-radius:0 10px 10px 0}' +
    '.cquiz .fb .fq{font-size:12.5px;color:#7a6f61;line-height:1.62}' +
    '.cquiz .fb .fg{font-size:11.5px;color:#a89c8b;margin-top:3px}' +
    '.cquiz .fb .go{font-size:12px;color:#a2352a;margin-top:6px}' +
    '.cquiz .nx{display:block;width:100%;box-sizing:border-box;margin-top:14px;padding:11px 0;border:0;border-radius:10px;background:#a2352a;color:#fdf8f0;font-size:14px}' +
    '.cquiz .score{font-size:13px;color:#5f574c;line-height:1.8;margin:8px 0 4px}' +
    '.cquiz .score b{font-size:22px;color:#a2352a}' +
    '.cquiz .wi{margin-top:12px;padding:9px 0 10px;border-bottom:1px dashed #eee6da}' +
    '.cquiz .wi .wq{font-size:12.5px;color:#7a6f61;line-height:1.6}' +
    '.cquiz .wi .we{font-family:Georgia,"Times New Roman",serif;font-size:13px;line-height:1.5;color:#2b2320;margin-top:4px}' +
    '.cquiz .sub2{display:block;width:100%;box-sizing:border-box;margin-top:12px;padding:10px 0;border:1px solid #d8cfc0;background:#fffdf8;border-radius:10px;font-size:13.5px;color:#6c6357}' +
    '@media (max-width:360px){.cquiz .qe{font-size:15px}}';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function cardOf(cid) {
    var cs = (window.__DATA__ && window.__DATA__.cards) || [], i;
    for (i = 0; i < cs.length; i++) if (cs[i].id === cid) return cs[i];
    return null;
  }
  function groupTitle(gid) {
    var gs = (window.__DATA__ && window.__DATA__.groups) || [], i;
    for (i = 0; i < gs.length; i++) if (gs[i].id === gid) return gs[i].title;
    return '';
  }
  /* 只取能落成「年份 + 卷别」的条目；通用句式（不绑年份）不进自测，避免判无解 */
  function pool() {
    var a = [], k, u, m;
    for (k in CM) if (CM.hasOwnProperty(k)) {
      u = CM[k]; m = /^(\d{4})\s*(英[一二])/.exec(u.q || '');
      if (!m) continue;
      a.push({
        id: k, q: u.q || '', eg: u.eg || '', zh: u.egzh || '',
        y: m[1], lab: m[1] + ' ' + m[2],
        sec: k.indexOf('e_') === 0 ? '小作文' : '大作文',
        gr: groupTitle((function (c) { return c && c.g; })(cardOf(k)))
      });
    }
    return a;
  }
  function shuffle(a) {
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function openQuiz() {
    var old = document.getElementById('cquiz');
    if (old) { old.parentNode.removeChild(old); return; }
    var all = pool();
    if (all.length < 10) return;
    var labs = [], i;
    for (i = 0; i < all.length; i++) if (labs.indexOf(all[i].lab) < 0) labs.push(all[i].lab);
    var qs = shuffle(all.slice()).slice(0, 10);
    var st = { i: 0, ok: 0, wrong: [], done: false };
    var box = document.createElement('div');
    box.id = 'cquiz'; box.className = 'cquiz';
    box.innerHTML = '<div class="box"><div class="hd"><h3>真题自测</h3><span class="n"></span><button class="x">×</button></div>' +
      '<div class="bd"></div></div>';
    document.body.appendChild(box);
    var bd = box.querySelector('.bd'), hd = box.querySelector('.hd .n');
    function close() { if (box.parentNode) box.parentNode.removeChild(box); }
    box.querySelector('.x').onclick = close;
    box.onclick = function (e) { if (e.target === box) close(); };

    function opts4(t) {
      var others = shuffle(labs.filter(function (l) { return l !== t.lab; }).slice());
      /* 干扰项优先取同年前后三年的卷别，像一点，别一眼就能排除 */
      var near = others.filter(function (l) { return Math.abs(Number(l.slice(0, 4)) - Number(t.y)) <= 3; });
      var far = others.filter(function (l) { return Math.abs(Number(l.slice(0, 4)) - Number(t.y)) > 3; });
      var sel = near.slice(0, 3);
      if (sel.length < 3) sel = sel.concat(far.slice(0, 3 - sel.length));
      return shuffle(sel.concat([t.lab]));
    }

    function question() {
      var t = qs[st.i], op = opts4(t), h = '';
      hd.textContent = (st.i + 1) + ' / 10';
      h = '<div class="qk">这句出自哪一年哪一卷？</div>' +
        '<div class="qe">' + esc(t.eg || t.q) + '</div>' +
        (t.zh ? '<div class="qz">' + esc(t.zh) + '</div>' : '');
      op.forEach(function (l) {
        h += '<button class="opt" data-lab="' + esc(l) + '">' + esc(l) + '</button>';
      });
      bd.innerHTML = h;
      Array.prototype.forEach.call(bd.querySelectorAll('.opt'), function (b) {
        b.onclick = function () { if (!st.answered) answer(t, this); };
      });
    }

    function answer(t, btn) {
      st.answered = true;
      var right = btn.getAttribute('data-lab') === t.lab;
      if (right) st.ok++; else st.wrong.push(t);
      Array.prototype.forEach.call(bd.querySelectorAll('.opt'), function (b) {
        if (b.getAttribute('data-lab') === t.lab) b.className = 'opt ok';
        else if (b === btn) b.className = 'opt bad';
      });
      var fb = document.createElement('div');
      fb.className = 'fb';
      fb.innerHTML = '<div class="fq">' + (right ? '对了 · ' : '记错 · ') + esc(t.q) + '</div>' +
        '<div class="fg">' + esc(t.sec + (t.gr ? ' · ' + t.gr : '')) + '</div>' +
        '<div class="go" data-jump="' + esc(t.id) + '">看这张卡 ›</div>';
      bd.appendChild(fb);
      var nx = document.createElement('button');
      nx.className = 'nx';
      nx.textContent = st.i === 9 ? '看结果' : '下一题';
      nx.onclick = function () {
        st.i++; st.answered = false;
        if (st.i >= 10) summary(); else question();
      };
      bd.appendChild(nx);
      fb.querySelector('.go').onclick = function () {
        close(); location.hash = '#/c/' + encodeURIComponent(t.id);
      };
    }

    function summary() {
      var best = 0;
      try { best = Number(localStorage.getItem(BEST) || 0); } catch (e) { }
      if (st.ok > best) { best = st.ok; try { localStorage.setItem(BEST, String(best)); } catch (e) { } }
      hd.textContent = '10 题';
      var h = '<div class="score">这轮答对 <b>' + st.ok + '</b> / 10' +
        (best > st.ok ? '　（本机最好 ' + best + ' / 10）' : (st.ok > 0 ? '　（刷新了本机最好成绩）' : '')) + '</div>';
      if (st.wrong.length) {
        h += '<div class="qk">错的这几句 · 出处都要记到今天为止</div>';
        st.wrong.forEach(function (t) {
          h += '<div class="wi"><div class="wq">' + esc(t.q) + '</div>' +
            '<div class="we">' + esc(t.eg) + '</div></div>';
        });
      }
      h += '<button class="nx" id="cq-again">再来一轮</button>' +
        '<button class="sub2" id="cq-close">先这样</button>';
      bd.innerHTML = h;
      bd.querySelector('#cq-again').onclick = function () { close(); openQuiz(); };
      bd.querySelector('#cq-close').onclick = close;
    }

    question();
  }
  /* 测试页顶部挂入口 */
  function mountTest() {
    if (location.hash !== '#/test') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#quizbtn')) return;
    if (pool().length < 10) return;
    var box = document.createElement('div');
    box.id = 'quizbtn';
    box.innerHTML = '<div class="panel" style="padding:4px 14px;margin:0 0 10px"><div class="glist">' +
      '<button class="grow" data-cquiz="1"><div class="gt"><b>真题自测</b><small>' +
      '抽 10 句，问这句出自哪一年哪一卷 · 答错当场给完整出处</small></div><div class="gp">测</div></button></div></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cquiz]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation(); openQuiz();
    });
    wrap.insertBefore(box, wrap.firstChild);
  }
  function tick() {
    CM = window.__CASE__ || CM;
    try { mountTest(); } catch (e) { }
  }
  function init() {
    CM = window.__CASE__ || CM;
    try {
      var st = document.createElement('style');
      st.textContent = CSS;
      document.head.appendChild(st);
    } catch (e) { }
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
  window.__quiz = openQuiz;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
