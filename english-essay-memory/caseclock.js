/* 学习时长：只算在卡面上的时间（背卡 #/s、单卡 #/c/*）
   自己的存档键 ky_zw_clock，不碰程序那份 ky_zw_v1；超过 2 分钟不动就暂停计数 */
(function () {
  'use strict';
  var CK = 'ky_zw_clock', TICK = 10, IDLE = 120;

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

  /* ---- 学习报告里插一块「学习时长」 ---- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(sec) {
    sec = Math.round(sec);
    if (sec < 60) return (sec || 0) + ' 秒';
    var m = Math.round(sec / 60);
    if (m < 60) return m + ' 分钟';
    return Math.floor(m / 60) + ' 小时 ' + (m % 60 ? (m % 60) + ' 分钟' : '整');
  }
  function block() {
    var o = load(), d = o.d || {}, today = d[dayStr(0)] || 0, sum = 0, maxK = '', maxV = 0, days = 0, i, k;
    for (i = 6; i >= 0; i--) {
      k = dayStr(-i);
      var v = d[k] || 0;
      if (v > 0) days++;
      sum += v;
      if (v > maxV) { maxV = v; maxK = k; }
    }
    var h = '<div class="blk" id="clockblk"><div class="bt">学习时长<span>只算卡面停留，2 分钟不动就暂停</span></div>';
    if (!sum) {
      h += '<div class="note">还没开始计时。在背卡或单卡页停一会儿，这里就会记下来。</div></div>';
      return h;
    }
    h += '<div class="streak">' +
      '<div><div class="numbig">' + fmt(today) + '</div><div class="sub">今天</div></div>' +
      '<div><div class="numbig">' + fmt(Math.round(sum / 7)) + '</div><div class="sub">最近 7 天日均</div></div>' +
      '</div>';
    h += '<div class="note">最近 7 天累计 ' + fmt(sum) + '，其中 ' + days + ' 天有记录' +
      (maxV ? '；最久的一天是 ' + Number(maxK.slice(5, 7)) + '/' + Number(maxK.slice(8, 10)) + '（' + fmt(maxV) + '）' : '') +
      '。计时只在本机算，换手机会从零开始。</div></div>';
    return h;
  }
  function mountClock() {
    var box = document.getElementById('cdaily');
    if (!box) return;
    var bd = box.querySelector('.bd');
    if (!bd || bd.querySelector('#clockblk')) return;
    bd.insertAdjacentHTML('beforeend', block());
  }
  function watch() {
    try {
      new MutationObserver(function () { mountClock(); }).observe(document.body, { childList: true, subtree: true });
    } catch (e) { }
    mountClock();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
