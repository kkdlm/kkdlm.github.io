/* 学习时长：只算在卡面上的时间（背卡 #/s、单卡 #/c/*）
   自己的存档键 ky_zw_clock，不碰程序那份 ky_zw_v1；超过 2 分钟不动就暂停计数
   1.3.9：加「每天背多久」目标 + 报告里的本周时长目标 + 首页今日面板一行时长 */
(function () {
  'use strict';
  var CK = 'ky_zw_clock', TICK = 10, IDLE = 120, GOAL_DEF = 30, GOAL_MIN = 5, GOAL_MAX = 240;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dayStr(off) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    d = new Date(d.getTime() + (off || 0) * 86400000);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(CK) || '{}');
      if (!o || !o.d) return { v: 1, d: {} };
      return o;
    } catch (e) { return { v: 1, d: {} }; }
  }
  function save(o) {
    try { localStorage.setItem(CK, JSON.stringify(o)); } catch (e) { }
  }
  function goal() {
    var g = parseInt(load().g, 10);
    return g >= GOAL_MIN && g <= GOAL_MAX ? g : GOAL_DEF;
  }
  function setGoal(n) {
    var o = load();
    o.g = n; o.t = Date.now();
    save(o);
  }
  function addSec(n) {
    if (n <= 0) return;
    var o = load(), k = dayStr(0);
    o.d[k] = (o.d[k] || 0) + n;
    o.t = Date.now();
    save(o);
  }
  function onCard() {
    var h = location.hash || '';
    return h === '#/s' || h.indexOf('#/c/') === 0;
  }
  function active() {
    if (document.visibilityState && document.visibilityState !== 'visible') return false;
    if (!onCard()) return false;
    return Date.now() - lastAct < IDLE * 1000;
  }

  var lastAct = Date.now(), lastTick = Date.now(), timer = null, pending = 0;

  function flush() {
    if (pending > 0) { addSec(pending); pending = 0; }
  }
  function beat() {
    var now = Date.now(), dt = Math.round((now - lastTick) / 1000);
    lastTick = now;
    /* 心跳按秒累计，最长一次补 12 秒，防止后台挂起时一次补一大段 */
    if (active()) pending += Math.min(dt, TICK + 2);
    if (pending >= TICK) flush();
  }
  function start() {
    if (timer) return;
    lastTick = Date.now();
    timer = setInterval(beat, TICK * 1000);
  }
  function stop() {
    beat();
    flush();
    if (timer) { clearInterval(timer); timer = null; }
  }
  ['pointerdown', 'touchstart', 'keydown', 'click', 'scroll'].forEach(function (t) {
    document.addEventListener(t, function () { lastAct = Date.now(); if (onCard()) start(); }, true);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { lastAct = Date.now(); lastTick = Date.now(); if (onCard()) start(); }
    else stop();
  });
  window.addEventListener('hashchange', function () {
    if (onCard()) { lastAct = Date.now(); lastTick = Date.now(); start(); }
    else stop();
  });
  window.addEventListener('pagehide', function () { beat(); flush(); });
  if (onCard()) start();

  /* ---- 数字与文案 ---- */
  function fmt(sec) {
    sec = Math.round(sec);
    if (sec < 60) return (sec || 0) + ' 秒';
    var m = Math.round(sec / 60);
    if (m < 60) return m + ' 分钟';
    return Math.floor(m / 60) + ' 小时 ' + (m % 60 ? (m % 60) + ' 分钟' : '整');
  }
  function mins(sec) { return Math.round(sec / 60); }
  function weekKeys() {
    var idx = (new Date().getDay() + 6) % 7, i, keys = [];
    for (i = 0; i <= idx; i++) keys.push(dayStr(-(idx - i)));
    return keys;
  }
  function stats() {
    var d = load().d || {}, g = goal(), i, k, v, today = d[dayStr(0)] || 0;
    var sum = 0, days = 0, maxK = '', maxV = 0;
    for (i = 6; i >= 0; i--) {
      k = dayStr(-i); v = d[k] || 0;
      if (v > 0) days++;
      sum += v;
      if (v > maxV) { maxV = v; maxK = k; }
    }
    var wk = weekKeys(), week = 0;
    for (i = 0; i < wk.length; i++) week += (d[wk[i]] || 0);
    return { today: today, sum: sum, days: days, maxK: maxK, maxV: maxV, g: g, week: week, left: 7 - wk.length, wdays: wk.length };
  }

  /* ---- 学习报告里插一块「学习时长」 ---- */
  function block() {
    var s = stats(), weekTarget = s.g * 7, weekMin = mins(s.week);
    var pct = Math.min(100, Math.round(s.week / (weekTarget * 60) * 100));
    var h = '<div class="blk" id="clockblk"><div class="bt">学习时长<span>只算卡面停留，2 分钟不动就暂停</span></div>';
    if (!s.sum) {
      h += '<div class="note">还没开始计时（今天目标 ' + s.g + ' 分钟）。在背卡或单卡页停一会儿，这里就会记下来。</div></div>';
      return h;
    }
    var td = s.today >= s.g * 60
      ? '今天已到 ' + s.g + ' 分钟，超出 ' + Math.max(0, mins(s.today - s.g * 60)) + ' 分钟'
      : '今天目标 ' + s.g + ' 分钟，还差 ' + Math.max(1, mins(s.g * 60 - s.today)) + ' 分钟';
    h += '<div class="streak">' +
      '<div><div class="numbig">' + fmt(s.today) + '</div><div class="sub">今天</div></div>' +
      '<div><div class="numbig">' + fmt(Math.round(s.sum / 7)) + '</div><div class="sub">最近 7 天日均</div></div>' +
      '</div>';
    h += '<div class="goal"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="top"><b>' + weekMin + '<i> 分钟</i></b><u>本周目标 ' + weekTarget + ' 分钟 · 已完成 ' + pct + '%</u></div>' +
      '<div class="note">' + (weekMin
        ? (s.week >= weekTarget * 60
            ? '本周时长已经达成，超出 ' + (weekMin - weekTarget) + ' 分钟。'
            : (s.left > 1
                ? '周一起算，本周已停 ' + weekMin + ' 分钟；还剩 ' + s.left + ' 天（含今天），每天再 <b>' + Math.max(1, Math.ceil((weekTarget - weekMin) / s.left)) + '</b> 分钟就够。'
                : '这周就剩今天了，还差 <b>' + (weekTarget - weekMin) + '</b> 分钟，补上才达标。'))
        : '周一起算，本周还没在卡面上停过。') + '</div></div>';
    h += '<div class="note">' + td + '；最近 7 天累计 ' + fmt(s.sum) + '，其中 ' + s.days + ' 天有记录' +
      (s.maxV ? '；最久的一天是 ' + Number(s.maxK.slice(5, 7)) + '/' + Number(s.maxK.slice(8, 10)) + '（' + fmt(s.maxV) + '）' : '') +
      '。计时只在本机算，换手机会从零开始。</div></div>';
    return h;
  }
  function slot() { return String(Math.floor(Date.now() / 30000)); }
  function mountClock() {
    var box = document.getElementById('cdaily');
    if (!box) return;
    var bd = box.querySelector('.bd');
    if (!bd) return;
    var old = bd.querySelector('#clockblk');
    if (old) {
      /* 报告开着的时候时长还在走，30 秒换一次数字 */
      if (old.getAttribute('data-t') === slot()) return;
      old.outerHTML = block();
      var nw = bd.querySelector('#clockblk');
      if (nw) nw.setAttribute('data-t', slot());
      return;
    }
    bd.insertAdjacentHTML('beforeend', block());
    var n2 = bd.querySelector('#clockblk');
    if (n2) n2.setAttribute('data-t', slot());
  }

  /* ---- 首页今日面板：一行时长 ---- */
  function line() {
    var s = stats();
    if (!s.today) return '今天还没在卡面上停过 · 目标 ' + s.g + ' 分钟';
    return '今天在卡面上 ' + fmt(s.today) + (s.today >= s.g * 60
      ? ' · 已到 ' + s.g + ' 分钟'
      : ' · 还差 ' + Math.max(1, mins(s.g * 60 - s.today)) + ' 分钟到 ' + s.g + ' 分钟');
  }
  function mountHome() {
    var p = document.querySelector('#app .panel.today');
    if (!p) return;
    var old = p.querySelector('#clockhome'), t = line();
    if (old) {
      if (old.innerHTML !== t) old.innerHTML = t;
      return;
    }
    var note = p.querySelector('.note');
    var el = document.createElement('div');
    el.id = 'clockhome';
    el.className = 'note';
    el.style.marginTop = '9px';
    el.innerHTML = t;
    if (note && note.parentNode) note.parentNode.insertBefore(el, note);
    else p.appendChild(el);
  }

  /* ---- 设置：每天背多久 ---- */
  var CSS = '.cgrow{display:flex;gap:8px;align-items:center;margin-top:8px}' +
    '.cgrow input{flex:1;min-width:0;height:34px;border:1px solid #e2dcd2;border-radius:9px;background:#fffdf8;' +
    'padding:0 10px;font-size:16px;color:#2b2320;font-family:Georgia,"Times New Roman",serif;text-align:center}' +
    '.cgrow button{flex:none;height:34px;padding:0 12px;border:1px solid #e2dcd2;border-radius:9px;background:#fffdf8;color:#4a423b;font-size:13px}' +
    '.cgrow button.on{border-color:#2b2320;color:#faf7ef;background:#2b2320}' +
    '.cgrow .cgset{background:#2b2320;color:#faf7ef;border-color:#2b2320}' +
    '.cgr{font-size:12px;color:#8d8272;margin-top:6px;line-height:1.6}';
  function styleOnce() {
    if (document.getElementById('cgstyle')) return;
    var st = document.createElement('style');
    st.id = 'cgstyle'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function chipsHtml() {
    var g = goal(), arr = [20, 30, 45, 60];
    if (arr.indexOf(g) < 0) arr.push(g);
    arr.sort(function (a, b) { return a - b; });
    return '<div class="chips">' + arr.map(function (x) {
      return '<button class="tag ' + (g === x ? 'on' : '') + '" data-cg="' + x + '">' + x + ' 分钟</button>';
    }).join('') + '</div>';
  }
  function refreshField(f) {
    var g = goal(), c = f.querySelector('.chips');
    if (c) c.outerHTML = chipsHtml();
    var inp = f.querySelector('#cgIn');
    if (inp) inp.value = g;
    var r = f.querySelector('.cgr');
    if (r) r.innerHTML = '现在每天记 <b>' + g + ' 分钟</b>，本周目标 ' + (g * 7) + ' 分钟（周一起算）。只影响学习报告里的时长目标，不改每日张数。';
  }
  function applyGoal(n, f) {
    if (!(n >= GOAL_MIN && n <= GOAL_MAX)) {
      var r = f.querySelector('.cgr');
      if (r) r.innerHTML = '填 ' + GOAL_MIN + '–' + GOAL_MAX + ' 之间的整数分钟；已退回 ' + goal() + ' 分钟。';
      var inp = f.querySelector('#cgIn');
      if (inp) inp.value = goal();
      return;
    }
    setGoal(n);
    refreshField(f);
    var ob = document.querySelector('#clockblk');
    if (ob) ob.removeAttribute('data-t');
    mountClock(); mountHome();
  }
  function mountField() {
    if (location.hash !== '#/mine') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#clockgoal')) return;
    var fields = wrap.querySelectorAll('.field'), anchor = null, i;
    for (i = 0; i < fields.length; i++) {
      var lab = fields[i].querySelector('label');
      if (lab && lab.textContent.indexOf('每日新卡上限') >= 0) { anchor = fields[i]; break; }
    }
    if (!anchor) return;
    styleOnce();
    var f = document.createElement('div');
    f.className = 'field'; f.id = 'clockgoal';
    f.innerHTML = '<label>每天背多久（分钟）</label>' + chipsHtml() +
      '<div class="cgrow"><button type="button" data-cg="-5">−5</button>' +
      '<input id="cgIn" type="number" inputmode="numeric" min="' + GOAL_MIN + '" max="' + GOAL_MAX + '" step="1" value="' + goal() + '">' +
      '<button type="button" data-cg="5">+5</button><button type="button" class="cgset">存下</button></div>' +
      '<div class="cgr"></div>';
    anchor.parentNode.insertBefore(f, anchor.nextSibling);
    refreshField(f);
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cg]');
      if (b) {
        e.preventDefault(); e.stopPropagation();
        var v = b.getAttribute('data-cg');
        if (v === '-5' || v === '5') {
          var cur = parseInt(f.querySelector('#cgIn').value, 10);
          if (!(cur >= GOAL_MIN && cur <= GOAL_MAX)) cur = goal();
          applyGoal(cur + parseInt(v, 10), f);
        } else {
          applyGoal(parseInt(v, 10), f);
        }
        return;
      }
      if (e.target.closest('.cgset')) {
        e.preventDefault(); e.stopPropagation();
        applyGoal(parseInt(f.querySelector('#cgIn').value, 10), f);
      }
    });
  }

  /* ---- 统一挂载 ---- */
  function watch() {
    try {
      new MutationObserver(function () { mountClock(); mountHome(); mountField(); }).observe(document.body, { childList: true, subtree: true });
    } catch (e) { }
    mountClock(); mountHome(); mountField();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
  setInterval(function () { mountClock(); mountHome(); }, 30000);
})();
