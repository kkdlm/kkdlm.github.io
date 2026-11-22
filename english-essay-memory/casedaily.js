/* 学习报告：打卡日历 / 近两周作答 / 记忆持久度 / 未来七天复习预测
   数据全部从本机进度（ky_zw_v1）现算，不动程序包、不联网 */
(function () {
  'use strict';
  var SK = 'ky_zw_v1', DAY = 86400000;

  var CSS = '' +
    '.cst{position:fixed;inset:0;z-index:86;background:rgba(43,35,32,.32);display:flex;align-items:flex-end}' +
    '.cst .box{width:100%;max-height:90vh;background:#fbf8f2;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden}' +
    '.cst .hd{display:flex;align-items:center;gap:10px;padding:14px 16px 8px;border-bottom:1px solid #efe7dc}' +
    '.cst .hd h3{margin:0;font-size:15px;font-weight:600;flex:1;color:#2b2320}' +
    '.cst .hd .x{border:0;background:transparent;font-size:17px;color:#8d8272;padding:0 2px}' +
    '.cst .bd{overflow:auto;-webkit-overflow-scrolling:touch;padding:4px 16px calc(22px + env(safe-area-inset-bottom))}' +
    '.cst .blk{margin-top:16px}' +
    '.cst .bt{font-size:12px;color:#a2352a;letter-spacing:.5px;margin-bottom:8px}' +
    '.cst .bt span{color:#a89c8b;letter-spacing:0;margin-left:6px}' +
    '.cst .numbig{font-family:Georgia,"Times New Roman",serif;font-size:26px;color:#a2352a;line-height:1.1}' +
    '.cst .numbig i{font-style:normal;font-size:12px;color:#8d8272;font-family:inherit;margin-left:3px}' +
    '.cst .sub{font-size:12px;color:#8d8272;margin-top:2px}' +
    '.cst .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px}' +
    '.cst .cell{height:22px;border-radius:4px;background:#efe9df}' +
    '.cst .cell.on{background:#d9a39b}' +
    '.cst .cell.on2{background:#a2352a}' +
    '.cst .cell.today{outline:1px solid #a2352a;outline-offset:1px}' +
    '.cst .week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;font-size:10.5px;color:#a89c8b;text-align:center}' +
    '.cst .chart{display:flex;align-items:flex-end;gap:4px;height:96px;margin-top:6px}' +
    '.cst .chart .col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%}' +
    '.cst .chart .col i{display:block;width:100%;background:#a2352a;border-radius:3px 3px 0 0;min-height:1px}' +
    '.cst .chart.seven .col i{max-width:36px;margin:0 auto}' +
    '.cst .chart .col b{font-size:9.5px;color:#a89c8b;font-weight:400;height:13px;margin-top:3px;white-space:nowrap}' +
    '.cst .rows .r{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12px;color:#5f574c}' +
    '.cst .rows .r em{font-style:normal;width:46px;color:#8d8272;flex:none}' +
    '.cst .rows .r .b{flex:1;height:7px;background:#efe9df;border-radius:4px;overflow:hidden}' +
    '.cst .rows .r .b i{display:block;height:100%;background:#a2352a}' +
    '.cst .rows .r .b i.zero{background:#cfc6b8}' +
    '.cst .rows .r u{text-decoration:none;width:38px;text-align:right;color:#2b2320;flex:none}' +
    '.cst .note{font-size:11.5px;color:#a89c8b;line-height:1.7;margin-top:10px}' +
    '.cst .streak{display:flex;gap:18px;align-items:flex-end}' +
    '@media (max-width:360px){.cst .chart .col b{font-size:9px}}';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function store() {
    try { return JSON.parse(localStorage.getItem(SK) || '{}') || {}; } catch (e) { return {}; }
  }
  function cards() { return (window.__DATA__ && window.__DATA__.cards) || []; }
  function dayStr(off) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    d = new Date(d.getTime() + (off || 0) * DAY);
    var m = d.getMonth() + 1, dd = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd);
  }
  function learned(rec) { return !!(rec && ((rec.all || 0) > 0 || (rec.n || 0) > 0)); }

  function stats() {
    var S = store(), c = S.c || {}, hist = S.st || {}, o = {};
    var cs = cards(), total = cs.length, lv = [0, 0, 0, 0, 0, 0, 0, 0], seen = 0, dueToday = 0;
    var now = Date.now(), endToday = new Date(); endToday.setHours(23, 59, 59, 999); var tEnd = endToday.getTime();
    var due7 = [0, 0, 0, 0, 0, 0, 0];
    cs.forEach(function (x) {
      var r = c[x.id], l = r && r.lv ? r.lv : 0;
      if (l < 0) l = 0; if (l > 7) l = 7;
      lv[l]++;
      if (l > 0) seen++;
      if (r && r.seen && r.due) {
        var diff = 0;
        if (r.due <= tEnd) diff = 0;
        else diff = Math.ceil((r.due - now) / DAY);
        if (diff >= 0 && diff <= 6) due7[diff]++;
        if (r.due <= now) dueToday++;
      }
    });
    o.total = total; o.lv = lv; o.seen = seen; o.dueToday = dueToday; o.due7 = due7;
    /* 近 14 天 */
    var d14 = [];
    for (var i = 13; i >= 0; i--) {
      var k = dayStr(-i), rec = hist[k] || {};
      d14.push({ k: k, off: -i, all: rec.all || 0, n: rec.n || 0, ok: rec.ok || 0 });
    }
    o.d14 = d14;
    /* 累计 / 连续 */
    var totalDays = 0, j;
    for (j in hist) if (hist.hasOwnProperty(j) && learned(hist[j])) totalDays++;
    var streak = 0, started = false;
    if (learned(hist[dayStr(0)])) { started = true; streak = 0; }
    for (var q = started ? 0 : 1; q <= 400; q++) {
      if (learned(hist[dayStr(-q)])) streak++; else break;
    }
    o.streak = streak; o.startToday = started; o.totalDays = totalDays;
    /* 28 天格子（4 行 7 列，从 27 天前到今天） */
    var g = [], maxAll = 1;
    d14.forEach(function (x) { if (x.all > maxAll) maxAll = x.all; });
    for (var w = 27; w >= 0; w--) {
      var rr = hist[dayStr(-w)] || {}, a = rr.all || 0;
      if (a > maxAll) maxAll = a;
      g.push({ off: -w, k: dayStr(-w), all: a, on: learned(rr) });
    }
    o.grid = g; o.maxAll = maxAll;
    o.mastered = lv[5] + lv[6] + lv[7];
    return o;
  }

  function entryText(o) {
    if (!o.startToday && !o.streak) return '还没有记录 · 背几张就会开始打卡';
    var t = '连续 ' + o.streak + ' 天';
    if (!o.startToday) t += '（今天还没打卡）';
    t += ' · 累计 ' + o.totalDays + ' 天 · 今日 ' + o.d14[13].all + ' 张';
    return t;
  }

  function openReport() {
    var old = document.getElementById('cdaily');
    if (old) { old.parentNode.removeChild(old); return; }
    var o = stats();
    if (!o.total) return;
    var box = document.createElement('div');
    box.id = 'cdaily'; box.className = 'cst';
    box.innerHTML = '<div class="box"><div class="hd"><h3>学习报告</h3><button class="x">×</button></div><div class="bd"></div></div>';
    document.body.appendChild(box);
    var bd = box.querySelector('.bd');
    function close() { if (box.parentNode) box.parentNode.removeChild(box); }
    box.querySelector('.x').onclick = close;
    box.onclick = function (e) { if (e.target === box) close(); };

    var WD = ['日', '一', '二', '三', '四', '五', '六'], h = '';

    /* 1. 打卡 */
    h += '<div class="blk"><div class="bt">打卡<span>今天有作答就算打卡</span></div>' +
      '<div class="streak"><div><div class="numbig">' + o.streak + '<i>天</i></div>' +
      '<div class="sub">连续' + (o.startToday ? '（今天已打卡）' : '（今天还没打卡）') + '</div></div>' +
      '<div><div class="numbig">' + o.totalDays + '<i>天</i></div><div class="sub">累计学习</div></div></div>';
    h += '<div class="week" style="margin-top:12px">' + WD.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>';
    h += '<div class="grid">';
    o.grid.forEach(function (g) {
      var cls = 'cell';
      if (g.all > 0) cls += g.all >= Math.max(10, o.maxAll * 0.6) ? ' on2' : ' on';
      if (g.off === 0) cls += ' today';
      h += '<div class="' + cls + '" title="' + g.k + ' · ' + g.all + ' 张"></div>';
    });
    h += '</div><div class="note">最近 28 天，深色＝那天答得多；今天那一格带红框。</div></div>';

    /* 2. 近两周作答 */
    var mx = 0;
    o.d14.forEach(function (x) { if (x.all > mx) mx = x.all; });
    h += '<div class="blk"><div class="bt">近两周作答<span>' + (mx ? '柱高＝当天作答张数，最多 ' + mx : '还没有记录') + '</span></div>';
    if (mx) {
      h += '<div class="chart">';
      o.d14.forEach(function (x, i) {
        var pct = Math.round(x.all / mx * 100);
        /* 14 根柱子，标签隔一天给一个，末端给「今天」，避免挤成一团 */
        var lbl = i === 13 ? '今天' : (i % 2 === 0 ? Number(x.k.slice(5, 7)) + '/' + Number(x.k.slice(8, 10)) : '');
        h += '<div class="col"><i style="height:' + Math.max(1, pct) + '%' + (x.all ? '' : ';background:#ded5c8') + '"></i><b>' + lbl + '</b></div>';
      });
      h += '</div><div class="note">今天 ' + o.d14[13].all + ' 张，其中新学 ' + o.d14[13].n + ' 张；没作答的日子柱子只剩一道浅线。</div>';
    } else {
      h += '<div class="note">今天 ' + o.d14[13].all + ' 张。开始背之后，这里会按天统计作答量。</div>';
    }
    h += '</div>';

    /* 3. 记忆持久度 */
    h += '<div class="blk"><div class="bt">记忆持久度<span>背到 5 档以上算记牢，掉档就是忘了</span></div>';
    h += '<div class="rows">';
    var names = ['没背过', '刚背过', '2 天', '4 天', '7 天', '15 天', '30 天', '60 天'];
    for (var l = 0; l <= 7; l++) {
      var n = o.lv[l], w = o.total ? Math.round(n / o.total * 100) : 0;
      /* 未学那一档用灰色，别拿红条占满屏，显得像已经背了很多 */
      h += '<div class="r"><em>' + (l === 0 ? '未学' : 'lv' + l) + '</em>' +
        '<div class="b"><i class="' + (l === 0 || !n ? 'zero' : '') + '" style="width:' + Math.max(l === 0 ? w : (n ? 3 : 0), w) + '%"></i></div>' +
        '<u>' + n + '</u></div>';
      h += '<div class="note" style="margin:2px 0 0 54px;font-size:10.5px">' + names[l] + (l === 0 ? '' : ' · 间隔 ' + [0, 1, 2, 4, 7, 15, 30, 60][l] + ' 天') + '</div>';
    }
    h += '</div><div class="note">记牢（lv5 以上）' + o.mastered + ' 张 / 全部 ' + o.total + ' 张，已开始背 ' + o.seen + ' 张。</div></div>';

    /* 4. 未来七天 */
    var mx7 = 0;
    o.due7.forEach(function (x) { if (x > mx7) mx7 = x; });
    h += '<div class="blk"><div class="bt">未来七天复习<span>按到期日排，今天含已过期的</span></div>';
    if (mx7 > 0) {
      h += '<div class="chart seven">';
      var now = new Date();
      for (var d = 0; d <= 6; d++) {
        var dt = new Date(now.getTime() + d * DAY);
        var lbl = d === 0 ? '今天' : (dt.getMonth() + 1) + '/' + dt.getDate();
        h += '<div class="col"><i style="height:' + Math.max(1, Math.round(o.due7[d] / mx7 * 100)) + '%' +
          (o.due7[d] ? '' : ';background:#ded5c8') + '"></i><b>' + lbl + '</b></div>';
      }
      h += '</div>';
    }
    h += '<div class="note">今天到期 ' + o.dueToday + ' 张；明天 ' + o.due7[1] + ' 张、后天 ' + o.due7[2] + ' 张。' +
      (o.dueToday + o.due7[1] + o.due7[2] ? '到期多就先只做复习，不追新卡。' : '还没开始背，所以没有排期。') + '</div></div>';

    bd.innerHTML = h;
  }

  /* 首页「今日」面板下面挂入口 */
  function mount() {
    if (location.hash !== '#/' && location.hash !== '' && location.hash !== '#') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#dailybtn')) return;
    var o = stats();
    if (!o.total) return;
    var box = document.createElement('div');
    box.id = 'dailybtn';
    box.innerHTML = '<div class="panel" style="padding:4px 14px;margin:10px 0 0"><div class="glist">' +
      '<button class="grow" data-cdaily="1"><div class="gt"><b>学习报告</b><small>' + esc(entryText(o)) +
      '</small></div><div class="gp">看</div></button></div></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cdaily]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation(); openReport();
    });
    var today = wrap.querySelector('.panel.today');
    if (today && today.parentNode) today.parentNode.insertBefore(box, today.nextSibling);
    else wrap.insertBefore(box, wrap.firstChild);
  }
  function tick() {
    try { mount(); } catch (e) { }
  }
  function init() {
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
  window.__dreport = openReport;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
