/* 学习报告：今天背什么 / 考前够不够 / 本周目标 / 打卡日历 / 认得率 / 近两周作答 / 记忆持久度 / 未来七天复习预测
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
    '.cst .plan{display:flex;gap:0;border:1px solid #e6ded2;border-radius:12px;background:#fffdf7;padding:12px 14px;margin-top:4px}' +
    '.cst .plan div{flex:1;text-align:center}' +
    '.cst .plan div+div{border-left:1px solid #efe7dc}' +
    '.cst .plan b{display:block;font-family:Georgia,"Times New Roman",serif;font-size:24px;color:#a2352a;line-height:1.15}' +
    '.cst .plan i{display:block;font-style:normal;font-size:11px;color:#8d8272;margin-top:2px}' +
    '.cst .gobtn{display:block;width:100%;margin-top:10px;border:0;border-radius:11px;padding:12px 0;background:#a2352a;color:#fdf8f0;font-size:14px}' +
    '.cst .gobtn[disabled]{background:#e6ded2;color:#8d8272}' +
    '.cst .eta .er{display:flex;align-items:baseline;gap:8px;margin-top:9px}' +
    '.cst .eta .er em{font-style:normal;width:64px;flex:none;color:#8d8272;font-size:12px}' +
    '.cst .eta .er b{font-family:Georgia,"Times New Roman",serif;font-size:19px;color:#a2352a;line-height:1.1}' +
    '.cst .eta .er i{font-style:normal;font-size:11.5px;color:#a89c8b}' +
    '.cst .verdict{margin-top:12px;padding:10px 12px;border-radius:10px;background:#fffdf7;border:1px solid #e6ded2;font-size:12.5px;line-height:1.7;color:#4a423b}' +
    '.cst .verdict b{color:#a2352a}' +
    '.cst .rows .r .b i.mid{background:#d9a39b}' +
    '.cst .rows .r .b i.forget{background:#8d8272}' +
    '.cst .goal{margin-top:6px}' +
    '.cst .goal .bar{height:10px;border-radius:6px;background:#efe9df;overflow:hidden}' +
    '.cst .goal .bar i{display:block;height:100%;background:#a2352a;border-radius:6px}' +
    '.cst .goal .top{display:flex;align-items:baseline;justify-content:space-between;margin-top:8px}' +
    '.cst .goal .top b{font-family:Georgia,"Times New Roman",serif;font-size:20px;color:#a2352a;line-height:1.2}' +
    '.cst .goal .top b i{font-style:normal;font-size:12px;color:#8d8272;font-family:inherit;margin-left:2px}' +
    '.cst .goal .top u{text-decoration:none;font-size:11.5px;color:#a89c8b}' +
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
    /* 今日计划：到期（含过期）+ 新卡剩余配额 */
    var tk = hist[dayStr(0)] || {};
    o.quota = (S.set && S.set.newPerDay) || 25;
    o.newToday = tk.n || 0;
    o.newLeft = Math.max(0, o.quota - o.newToday);
    o.todayAll = tk.all || 0;
    o.todayOk = tk.ok || 0;
    o.todayBad = tk.bad || 0;
    /* 考前够不够：距考试天数 + 未上过张数 + 最近 7 天新学速度 */
    o.unlearned = lv[0];
    o.exam = (S.set && S.set.exam) || '';
    o.daysLeft = -1;
    if (o.exam) {
      var ex = new Date(o.exam + 'T00:00:00'), td = new Date(); td.setHours(0, 0, 0, 0);
      if (!isNaN(ex.getTime())) o.daysLeft = Math.round((ex.getTime() - td.getTime()) / DAY);
    }
    var n7 = 0;
    for (var z = 7; z <= 13; z++) n7 += d14[z].n;
    o.avg7 = n7 / 7;
    o.needPerDay = o.daysLeft > 0 ? Math.ceil(o.unlearned / o.daysLeft) : 0;
    o.etaDays = o.avg7 > 0 ? Math.ceil(o.unlearned / o.avg7) : 0;
    /* 近 14 天认得率：记得 / 模糊 / 忘了，口径与首页一致（ok 计记得，bad 计忘了） */
    var kAll = 0, kOk = 0, kBad = 0;
    d14.forEach(function (x) {
      var r2 = hist[x.k] || {};
      kAll += r2.all || 0; kOk += r2.ok || 0; kBad += r2.bad || 0;
    });
    o.kAll = kAll; o.kOk = kOk; o.kBad = kBad;
    o.kFuzzy = Math.max(0, kAll - kOk - kBad);
    o.kRate = kAll ? Math.round(kOk / kAll * 100) : -1;
    /* 本周（周一起算）：按配额算周目标，进度用新学张数 */
    var td0 = new Date(); td0.setHours(0, 0, 0, 0);
    var wd = (td0.getDay() + 6) % 7;            /* 0=周一 … 6=周日 */
    var wStart = new Date(td0.getTime() - wd * DAY);
    o.weekWd = wd; o.weekLeft = 7 - wd;          /* 含今天还剩几天 */
    o.weekDays = wd + 1;
    var wN = 0, wAll = 0, wOk = 0;
    for (var wi = wd; wi >= 0; wi--) {
      var wk = dayStr(-wi), wr = hist[wk] || {};
      wN += wr.n || 0; wAll += wr.all || 0; wOk += wr.ok || 0;
    }
    o.weekN = wN; o.weekAll = wAll; o.weekOk = wOk;
    o.weekTarget = o.quota * 7;
    o.weekPct = o.weekTarget ? Math.min(100, Math.round(wN / o.weekTarget * 100)) : 0;
    o.weekRest = Math.max(0, o.weekTarget - wN);
    o.weekNeed = o.weekRest > 0 ? Math.ceil(o.weekRest / o.weekLeft) : 0;
    return o;
  }

  function entryText(o) {
    if (!o.startToday && !o.streak) return '还没有记录 · 背几张就会开始打卡';
    var t = '连续 ' + o.streak + ' 天';
    if (!o.startToday) t += '（今天还没打卡）';
    t += ' · 待复习 ' + o.dueToday + ' 张';
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

    /* 0. 今天背什么：到期 + 新卡，一键开队列 */
    var planN = o.dueToday + o.newLeft;
    h += '<div class="blk"><div class="bt">今天背什么<span>到期先复习，再按配额上新课</span></div>' +
      '<div class="plan">' +
      '<div><b>' + o.dueToday + '</b><i>张到期</i></div>' +
      '<div><b>' + o.newLeft + '</b><i>张新卡</i></div>' +
      '<div><b>' + planN + '</b><i>张合计</i></div>' +
      '</div>';
    if (planN > 0) {
      h += '<button class="gobtn" data-plan="go">开始今天的 ' + planN + ' 张</button>';
    } else {
      h += '<button class="gobtn" disabled>今天这一轮已经背完</button>';
    }
    h += '<div class="note">新卡配额 ' + o.quota + ' 张，今天已上新 ' + o.newToday + ' 张；到期数含过期没做的。' +
      (o.todayAll ? '今天已作答 ' + o.todayAll + ' 张。' : '') +
      '</div></div>';

    /* 1.5 考前够不够 */
    if (o.daysLeft >= 0 && o.unlearned > 0) {
      var etaStr = '';
      if (o.etaDays > 0) {
        var ed = new Date(); ed.setHours(0, 0, 0, 0); ed = new Date(ed.getTime() + o.etaDays * DAY);
        etaStr = '按这个速度 ' + (ed.getMonth() + 1) + '/' + ed.getDate() + ' 过完' + (o.etaDays > o.daysLeft ? '，晚于考试' : '');
      }
      h += '<div class="blk"><div class="bt">考前够不够<span>按最近 7 天的速度估</span></div><div class="eta">' +
        '<div class="er"><em>距考试</em><b>' + o.daysLeft + ' 天</b><i>' + o.exam + '</i></div>' +
        '<div class="er"><em>还没上过</em><b>' + o.unlearned + ' 张</b><i>共 ' + o.total + ' 张</i></div>' +
        '<div class="er"><em>每天要背</em><b>' + o.needPerDay + ' 张</b><i>才够考前过一遍</i></div>' +
        '<div class="er"><em>最近 7 天</em><b>' + (o.avg7 ? Math.round(o.avg7 * 10) / 10 + ' 张/天' : '没上新课') + '</b><i>' +
          (etaStr || '') + '</i></div>' +
        '</div>';
      if (o.avg7 >= o.needPerDay) {
        var spare = Math.floor(o.avg7 * o.daysLeft) - o.unlearned;
        h += '<div class="verdict">按现在的速度，考前能把没上过的都过一遍；' +
          '<b>' + o.daysLeft + '</b> 天 × ' + (Math.round(o.avg7 * 10) / 10) + ' 张 ≈ <b>' +
          Math.floor(o.avg7 * o.daysLeft) + '</b> 张的容量，比要背的 ' + o.unlearned + ' 张' +
          (spare > 0 ? '多出 <b>' + spare + '</b> 张。' : '正好够。') + '</div>';
      } else if (o.avg7 > 0) {
        h += '<div class="verdict">照现在的速度赶不上：每天得再多上 <b>' + (o.needPerDay - Math.round(o.avg7)) +
          '</b> 张，或者把配额从 ' + o.quota + ' 调上去。</div>';
      } else {
        h += '<div class="verdict">最近七天还没上新课。要考前过一遍，每天得开 <b>' + o.needPerDay + '</b> 张新卡。</div>';
      }
      h += '</div>';
    }

    /* 0.5 本周目标 */
    h += '<div class="blk"><div class="bt">本周目标<span>周一起算，按每日配额 × 7 天</span></div><div class="goal">' +
      '<div class="bar"><i style="width:' + o.weekPct + '%"></i></div>' +
      '<div class="top"><b>' + o.weekN + '<i> 张</i></b><u>目标 ' + o.weekTarget + ' 张 · 已完成 ' + o.weekPct + '%</u></div>' +
      '<div class="note">本周已作答 ' + o.weekAll + ' 张（含复习），新学 ' + o.weekN + ' 张；本周一到现在共 ' + o.weekDays + ' 天。' +
      (o.weekRest > 0
        ? (o.weekLeft > 1
            ? '还剩 ' + o.weekLeft + ' 天（含今天），每天再上 <b>' + o.weekNeed + '</b> 张就够。'
            : '这周就剩今天了，还差 <b>' + o.weekRest + '</b> 张，补上才达标。')
        : '本周已经达成，超出 ' + (o.weekN - o.weekTarget) + ' 张。') +
      '</div></div></div>';

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

    /* 2.5 认得率 */
    h += '<div class="blk"><div class="bt">认得率<span>近 14 天，记得 / 模糊 / 忘了</span></div>';
    if (o.kAll) {
      var pOk = Math.round(o.kOk / o.kAll * 100), pBad = Math.round(o.kBad / o.kAll * 100),
          pFz = Math.max(0, 100 - pOk - pBad), a = o.d14.filter(function (x) { return x.all > 0; }).length;
      h += '<div class="rows">' +
        '<div class="r"><em>记得</em><div class="b"><i style="width:' + Math.max(pOk ? 3 : 0, pOk) + '%"></i></div><u>' + pOk + '%</u></div>' +
        '<div class="r"><em>模糊</em><div class="b"><i class="mid" style="width:' + Math.max(pFz ? 3 : 0, pFz) + '%"></i></div><u>' + pFz + '%</u></div>' +
        '<div class="r"><em>忘了</em><div class="b"><i class="forget" style="width:' + Math.max(pBad ? 3 : 0, pBad) + '%"></i></div><u>' + pBad + '%</u></div>' +
        '</div><div class="note">' + a + ' 天有作答，共 ' + o.kAll + ' 张：记得 ' + o.kOk + ' 张、模糊 ' + o.kFuzzy +
        ' 张、忘了 ' + o.kBad + ' 张。' +
        (pBad >= 15 ? '忘的比例偏高，先把配额降一点回炉，别硬上新卡。' :
          (pOk >= 70 ? '记得住，配额可以维持甚至往上加。' : '凑合，模糊的那批挑出来再背一轮更稳。')) +
        '</div>';
    } else {
      h += '<div class="note">近两周还没有作答记录。</div>';
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
    var go = bd.querySelector('[data-plan="go"]');
    if (go) go.onclick = function () {
      close();
      var btn = document.querySelector('#app [data-act="daily"]');
      if (btn) { btn.click(); return; }
      location.hash = '#/';
    };
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
