(function () {
  'use strict';

  var DATA = window.__DATA__;
  var GROUPS = DATA.groups.slice();
  GROUPS.push({ id: 'g_mine', sec: 5, title: '我的词条', sub: '自己加的句子和词，进同一个复习循环' });
  var CARDS = DATA.cards.slice();
  var LSKEY = 'ky_zw_v1';
  var DAY = 86400000;
  var IV = [1, 2, 4, 7, 15, 30, 60]; // lv 1..7 对应的间隔天数

  /* ---------------- 存储 ---------------- */
  function defaults() {
    return {
      v: 1, c: {}, st: {}, custom: [], first: Date.now(),
      set: { newPerDay: 25, exam: '2026-12-19', mode: 'auto', tier: 0 }
    };
  }
  var S;
  try {
    var raw = localStorage.getItem(LSKEY);
    S = raw ? JSON.parse(raw) : defaults();
    if (!S || S.v !== 1) S = defaults();
    if (!S.set) S.set = defaults().set;
    if (!S.custom) S.custom = [];
  } catch (e) { S = defaults(); }

  function save() {
    try { localStorage.setItem(LSKEY, JSON.stringify(S)); }
    catch (e) { toast('保存失败：可能是浏览器隐私模式或空间不足'); }
  }

  /* ---------------- 时间 ---------------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function todayStat() {
    var k = todayStr();
    if (!S.st[k]) S.st[k] = { n: 0, r: 0, ok: 0, bad: 0, all: 0 };
    return S.st[k];
  }
  function daysTo(dateStr) {
    var t = new Date(dateStr + 'T00:00:00');
    if (isNaN(t.getTime())) return null;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((t - now) / DAY);
  }

  /* ---------------- 卡片索引 ---------------- */
  function groupById(id) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i];
    return { id: id, sec: 5, title: '未分组', sub: '' };
  }
  function customCards() {
    return (S.custom || []).map(function (x) {
      return { id: x.id, g: 'g_mine', p: 1, en: x.en, zh: x.zh, tip: x.tip || '', sr: '自定', alts: null };
    });
  }
  var CMAP = {};
  function allCards() {
    var list = CARDS.concat(customCards());
    CMAP = {};
    list.forEach(function (c) { CMAP[c.id] = c; });
    return list;
  }
  function cardsOf(gid) { return allCards().filter(function (c) { return c.g === gid; }); }
  function byId(id) { allCards(); return CMAP[id]; }

  function cs(id) {
    if (!S.c[id]) S.c[id] = { lv: 0, due: 0, seen: 0, r: 0, m: 0, w: 0, t: 0 };
    return S.c[id];
  }
  function lvOf(id) { var s = S.c[id]; return s ? s.lv : 0; }
  function seenOf(id) { var s = S.c[id]; return s ? s.seen : 0; }

  /* ---------------- 文本工具 ---------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var PH = ['主题词1', '主题词2', '主题词3', '主题词', '某方面', '年份1', '年份2', '年份', '单项',
    '另一单项', '左图主题', '右图主题', '总主题', '图1内容', '图2内容', '占比最高项', '占比次多项',
    '做某事', '某事', '某人', '保障主题词', '解决问题/保障主题词', '改写作者核心观点', '主体A', '主体B',
    '主体', '主要动作', '表情细节', '观点A', '观点B', '动作A', '动作B', '左图主体', '右图主体',
    '并列元素', '元素A', '元素B', '简单图画描述', '图表总体描述', '图画描述', '正面好处', '负面坏处',
    '实施方A', '实施方C', '主题方面', '小方面', '大方面', '最低值', '最高值', '文字', '结果', 'XX%'];
  var PHRE = new RegExp('(' + PH.slice().sort(function (a, b) { return b.length - a.length; })
    .map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'g');

  function hl(t) {
    return esc(t).replace(PHRE, '<span class="ph">$1</span>');
  }
  function hls(t, n) {
    t = String(t);
    if (t.length <= n) return hl(t);
    var cut = t.slice(0, n);
    var sp = cut.lastIndexOf(' ');
    if (sp > n * 0.55) cut = cut.slice(0, sp);
    return hl(cut.replace(/[\s,;:.]+$/, '') + '…');
  }
  function tokens(s) {
    return String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”]/g, '"')
      .replace(/[.,;:!?"()\[\]{}—–\-\/]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function diff(input, ref) {
    var a = tokens(input), b = tokens(ref);
    var used = new Array(a.length).fill(false);
    var mark = b.map(function (w) {
      for (var i = 0; i < a.length; i++) {
        if (!used[i] && a[i] === w) { used[i] = true; return { w: w, ok: true }; }
      }
      return { w: w, ok: false };
    });
    var hit = mark.filter(function (m) { return m.ok; }).length;
    return { ratio: b.length ? hit / b.length : 0, mark: mark };
  }
  var STOP = { a: 1, an: 1, the: 1, of: 1, to: 1, in: 1, on: 1, at: 1, and: 1, or: 1, is: 1, are: 1, be: 1, it: 1, as: 1, by: 1, for: 1, that: 1, this: 1 };
  function missText(mark) {
    var miss = mark.filter(function (m) { return !m.ok && !STOP[m.w.toLowerCase()]; }).map(function (m) { return m.w; });
    return miss.length ? miss.slice(0, 14).join(' · ') + (miss.length > 14 ? ' …' : '') : '';
  }
  function wordCount(s) { return tokens(s).length; }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.className = 'toast on';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 1900);
  }

  /* ---------------- 队列 ---------------- */
  function dueList(filterFn) {
    var now = Date.now();
    return allCards().filter(function (c) {
      var s = S.c[c.id];
      if (!s || s.lv <= 0) return false;
      if (s.due > now) return false;
      return filterFn ? filterFn(c) : true;
    }).sort(function (a, b) { return S.c[a.id].due - S.c[b.id].due; });
  }
  function newLeftToday() {
    var st = todayStat();
    return Math.max(0, (S.set.newPerDay || 25) - (st.n || 0));
  }

  var SES = null;

  function makePool(o) {
    o = o || {};
    return allCards().filter(function (c) {
      var g = groupById(c.g);
      if (o.g && c.g !== o.g) return false;
      if (o.sec && g.sec !== o.sec) return false;
      if (o.tier && c.p > o.tier) return false;
      if (o.ids && o.ids.indexOf(c.id) < 0) return false;
      return true;
    });
  }

  function startDaily() {
    allCards();
    var pool = makePool({});
    var due = dueList();
    var rest = pool.filter(function (c) { return !S.c[c.id] || S.c[c.id].seen === 0; });
    rest.sort(function (a, b) { return (a.p - b.p) || 0; });
    var nl = newLeftToday();
    var q = due.concat(rest.slice(0, nl));
    if (!q.length) {
      var more = pool.filter(function (c) { var s = S.c[c.id]; return !s || s.lv <= 0; }).slice(0, 10);
      if (!more.length) { toast('全部背完了，去「测试」默写一遍'); return; }
      q = more;
    }
    beginSession(q, { label: '今日任务' });
  }

  function startGroup(gid, tier) {
    var pool = cardsOf(gid).filter(function (c) { return tier ? c.p <= tier : true; });
    var due = pool.filter(function (c) { var s = S.c[c.id]; return s && s.lv > 0 && s.due <= Date.now(); });
    var nw = pool.filter(function (c) { return !S.c[c.id] || S.c[c.id].seen === 0; });
    var q = due.concat(nw);
    if (!q.length) { toast('这一组已全部背过，进入复习'); q = pool.slice(0, 20); }
    beginSession(q, { label: groupById(gid).title, g: gid });
  }

  function startTest(o) {
    var pool = makePool({ sec: o.sec || 0, g: o.g || null });
    if (o.tier) pool = pool.filter(function (c) { return c.p <= o.tier; });
    if (o.mode === 'write') pool = pool.filter(function (c) { return !(c.alts && c.alts.length > 1); });
    // 已背过的优先
    pool.sort(function (a, b) {
      var sa = S.c[a.id] ? S.c[a.id].lv : 0, sb = S.c[b.id] ? S.c[b.id].lv : 0;
      return (sb - sa) || (a.p - b.p);
    });
    pool = pool.slice(0, o.n || 20);
    if (!pool.length) { toast('这一范围还没有可测的卡'); return; }
    beginSession(pool, { label: '测试 · ' + (o.g === 'p6_page' ? '一页纸' : (o.sec ? secName(o.sec) : '全部')), force: o.mode });
  }

  function beginSession(q, meta) {
    SES = { q: q.slice(), i: 0, right: 0, mid: 0, wrong: 0, req: {}, force: meta.force || null, label: meta.label || '', g: meta.g || null, rev: false, inp: '', res: null, sel: -1, opts: null, start: Date.now() };
    location.hash = '#/s';
    render();
  }

  function modeOf(c) {
    if (SES && SES.force) return SES.force;
    var lv = lvOf(c.id);
    if (c.alts && c.alts.length > 1) return lv >= 2 ? 'zh2en' : 'en2zh';
    if (S.set.mode === 'auto') return lv >= 2 ? 'zh2en' : 'en2zh';
    return S.set.mode;
  }

  var MODENAME = { en2zh: '认词 · 英→中', zh2en: '回想 · 中→英', write: '默写 · 打字', mc: '选择 · 四选一' };

  function resetCardUI() {
    if (!SES) return;
    SES.rev = false; SES.inp = ''; SES.res = null; SES.sel = -1; SES.opts = null;
  }

  /* ---------------- 判分 ---------------- */
  function applyGrade(g) {
    var c = SES.q[SES.i];
    if (!c) return;
    var s = cs(c.id);
    var first = s.seen === 0;
    s.seen++; s.t = Date.now();
    if (g === 2) {
      s.r++; s.lv = Math.min(s.lv + 1, 7);
      s.due = Date.now() + IV[Math.max(0, s.lv - 1)] * DAY;
    } else if (g === 1) {
      s.m = (s.m || 0) + 1; s.lv = Math.max(1, s.lv);
      s.due = Date.now() + (s.lv <= 2 ? 6 * 3600000 : DAY);
    } else {
      s.w++; s.lv = Math.max(1, s.lv - 1);
      s.due = Date.now() + 3600000;
      requeue(c);
    }
    var st = todayStat();
    st.all++; if (g === 2) st.ok++; if (g === 0) st.bad++;
    if (first) st.n = (st.n || 0) + 1; else st.r = (st.r || 0) + 1;
    if (g === 2) SES.right++; else if (g === 1) SES.mid++; else SES.wrong++;
    save();
    SES.i++;
    resetCardUI();
    render();
  }

  function requeue(c) {
    if (SES.req[c.id]) return;
    SES.req[c.id] = 1;
    var at = Math.min(SES.i + 4, SES.q.length);
    SES.q.splice(at, 0, c);
  }

  /* ---------------- 视图 ---------------- */
  var app = document.getElementById('app');
  var UI = { open: 1 };
  var T = { sec: 0, mode: 'write', n: 20 };

  function hd(title, sub, right, backHash) {
    return '<div class="hd">' +
      (backHash ? '<button class="back" data-act="go" data-arg="' + backHash + '">' + esc(backHash === '#/lib' ? '词库' : '返回') + '</button>'
        : '<div class="hd-t">' + esc(title) + (sub ? '<span class="hd-s">' + esc(sub) + '</span>' : '') + '</div>') +
      (right ? '<div class="hd-r">' + right + '</div>' : '') + '</div>';
  }

  function pdot(p) { return '<span class="dotp p' + p + '"></span>'; }

  function vHome() {
    var st = todayStat();
    var due = dueList().length;
    var nl = newLeftToday();
    var plan = due + nl;
    var exam = daysTo(S.set.exam);
    var total = allCards().filter(function (c) { return c.g !== 'g_mine'; }).length;
    var mastered = 0, learning = 0;
    allCards().forEach(function (c) {
      var lv = lvOf(c.id);
      if (lv >= 5) mastered++; else if (lv > 0) learning++;
    });
    var h = hd('大作文背诵', allCards().length + ' 张', exam !== null && exam >= 0 ? ('距考试 ' + exam + ' 天') : '');
    h += '<div class="wrap">';

    h += '<div class="panel today"><div class="row"><span class="k">今日</span><span class="v">' + todayStr() + '</span></div>' +
      '<div class="big"><b>' + due + '</b><i>张待复习</i></div>' +
      '<div class="tl">' +
      '<div>新学 <b>' + (st.n || 0) + '/' + (S.set.newPerDay || 25) + '</b></div>' +
      '<div>今日作答 <b>' + (st.all || 0) + '</b></div>' +
      '<div>正确率 <b>' + (st.all ? Math.round((st.ok || 0) / st.all * 100) + '%' : '—') + '</b></div>' +
      '</div>' +
      '<div class="bar"><i style="width:' + Math.min(100, Math.round((st.n || 0) / Math.max(1, S.set.newPerDay) * 100)) + '%"></i></div>' +
      '<div style="margin-top:14px;display:flex;gap:10px">' +
      '<button class="btn primary" data-act="daily">' + (plan ? '开始背诵 · ' + plan + ' 张' : '补背 10 张') + '</button>' +
      '</div>' +
      '<div class="note" style="margin-top:9px">队列 = 到期复习（先）+ 新卡（' + nl + ' 张配额）</div>' +
      '</div>';

    h += '<div class="sec-t"><h2>六大方面</h2><span>第一档先背完，再动第二档</span></div>';
    h += '<div class="panel pad" style="padding:4px 14px 6px">';
    var six = GROUPS.filter(function (g) { return g.sec === 1; });
    h += '<div class="glist">';
    six.forEach(function (g) {
      var cards = cardsOf(g.id);
      var m = 0, se = 0, p1 = cards.filter(function (c) { return c.p === 1; });
      var has1 = p1.length > 0;
      if (!has1) p1 = cards.filter(function (c) { return c.p <= 2; });
      var p1m = 0;
      cards.forEach(function (c) {
        var lv = lvOf(c.id);
        if (lv >= 5) m++; else if (lv > 0) se++;
      });
      p1.forEach(function (c) { if (lvOf(c.id) >= 5) p1m++; });
      h += '<button class="grow" data-act="go" data-arg="#/g/' + g.id + '">' +
        '<div class="gt"><b>' + esc(g.title) + ' <span style="font-weight:400;color:#8b8375;font-size:12px">' + cards.length + ' 条</span></b>' +
        '<small>' + esc(g.sub) + '</small>' +
        '<div class="mini"><i style="width:' + (cards.length ? Math.round((m + se * 0.4) / cards.length * 100) : 0) + '%"></i></div>' +
        '</div>' +
        '<div class="gp"><b>' + p1m + '/' + p1.length + '</b>' + (has1 ? '第一档' : '第二档') + '</div>' +
        '<div class="chev"></div></button>';
    });
    h += '</div></div>';

    h += '<div class="sec-t"><h2>继续</h2><span>常错的地方单独练</span></div>' +
      '<div class="panel pad" style="padding:4px 14px">' +
      '<div class="glist">' +
      '<button class="grow" data-act="go" data-arg="#/g/p6_page"><div class="gt"><b>一页纸速查</b><small>三段骨架连起来默写，考场就是这个模样</small></div><div class="chev"></div></button>' +
      '<button class="grow" data-act="go" data-arg="#/g/p2"><div class="gt"><b>通用第二段</b><small>举例 → 说理 → 群众，顺序固定</small></div><div class="chev"></div></button>' +
      '<button class="grow" data-act="go" data-arg="#/g/v_fast"><div class="gt"><b>升降快慢的词</b><small>三个数据配三种动词副词</small></div><div class="chev"></div></button>' +
      '</div></div>';

    h += '<div class="sec-t"><h2>总体</h2><span>共 ' + total + ' 张</span></div>' +
      '<div class="stat2">' +
      '<div class="panel"><div class="lab">已掌握</div><div class="val">' + mastered + '<small>/ ' + total + '</small></div></div>' +
      '<div class="panel"><div class="lab">学习中</div><div class="val">' + learning + '<small>张</small></div></div>' +
      '</div>';
    h += '</div>';
    return h;
  }

  function libRows(g) {
    var cards = cardsOf(g.id);
    if (!cards.length) return '';
    var m = 0, se = 0;
    cards.forEach(function (c) { var lv = lvOf(c.id); if (lv >= 5) m++; else if (lv > 0) se++; });
    var right;
    if (cards.length > 1) {
      right = '<b class="num">' + m + '/' + cards.length + '</b>掌握';
    } else {
      var lv = lvOf(cards[0].id);
      right = lv >= 5 ? '<span style="color:#2f5a4d">熟</span>' : lv > 0 ? '<span style="color:#a3772a">学' + lv + '</span>' : '<span style="color:#b0a794">新</span>';
    }
    return '<button class="grow" data-act="go" data-arg="#/g/' + g.id + '">' +
      '<div class="gt"><b>' + esc(g.title) + '</b><small>' + esc(g.sub) + '</small>' +
      '<div class="mini"><i style="width:' + Math.round((m + se * 0.35) / cards.length * 100) + '%"></i></div></div>' +
      '<div class="gp">' + right + '</div>' +
      '<div class="chev"></div></button>';
  }

  function vLib() {
    var h = hd('词库', '按考场段落排的', '');
    h += '<div class="wrap">';
    var SECS = [
      { s: 1, t: '六大方面', d: '132 条短语，某方面填什么全看这里' },
      { s: 2, t: '主背骨架', d: '第一段 + 通用二三段，逐句背' },
      { s: 3, t: '图表词汇', d: '升降、快慢、倍数、排序' },
      { s: 4, t: '替换与升级', d: '主背之外的第二选择，先放着也行' }
    ];
    var open = UI.open || 1;
    h += '<div class="panel" style="padding:2px 14px">';
    SECS.forEach(function (sec) {
      var gs = GROUPS.filter(function (g) { return g.sec === sec.s; });
      var n = 0, m = 0;
      gs.forEach(function (g) {
        var cs = cardsOf(g.id); n += cs.length;
        cs.forEach(function (c) { if (lvOf(c.id) >= 5) m++; });
      });
      h += '<button class="secbtn" data-act="open" data-arg="' + sec.s + '">' +
        '<div class="t"><b>' + sec.t + '</b><small>' + sec.d + '</small></div>' +
        '<div class="c">' + m + '/' + n + '</div><div class="chev"></div></button>';
      if (open === sec.s) {
        h += '<div class="glist sub" style="margin-bottom:10px">';
        gs.forEach(function (g) { h += libRows(g); });
        h += '</div>';
      }
    });
    h += '</div>';
    h += '<div class="sec-t"><h2>我的</h2><span>自己加的词条</span></div>' +
      '<div class="panel pad" style="padding:4px 14px"><div class="glist">' +
      '<button class="grow" data-act="go" data-arg="#/mine"><div class="gt"><b>我的词条</b><small>自己抄的句子、词，进同一个复习循环</small></div><div class="chev"></div></button>' +
      '<button class="grow" data-act="go" data-arg="#/check"><div class="gt"><b>与主模板的核对说明</b><small>精选哪里漏了、补了哪些</small></div><div class="chev"></div></button>' +
      '</div></div>';
    h += '</div>';
    return h;
  }

  function vGroup(gid) {
    var g = groupById(gid);
    var cards = cardsOf(gid);
    var tier = (UI['t_' + gid] || 0);
    var show = cards.filter(function (c) { return tier ? c.p <= tier : true; });
    var h = hd('', '', '', '#/lib');
    h += '<div class="wrap">';
    h += '<div style="margin-bottom:6px"><div class="hd-t" style="font-size:20px;letter-spacing:.3px">' + esc(g.title) + '</div>' +
      '<div class="note" style="margin-top:4px">' + esc(g.sub) + ' · 共 ' + cards.length + ' 张</div></div>';
    h += '<div class="chips" style="margin-top:12px">';
    h += '<button class="tag ' + (tier === 0 ? 'on' : '') + '" data-act="tier" data-arg="' + gid + ':0">全部</button>';
    h += '<button class="tag ' + (tier === 1 ? 'on' : '') + '" data-act="tier" data-arg="' + gid + ':1">只看第一档</button>';
    h += '<button class="tag ' + (tier === 2 ? 'on' : '') + '" data-act="tier" data-arg="' + gid + ':2">含第二档</button>';
    h += '</div>';
    h += '<div class="btns" style="margin:12px 0 4px">' +
      '<button class="btn primary" data-act="study" data-arg="' + gid + ':' + tier + '">背这一组</button>' +
      '<button class="btn" data-act="testg" data-arg="' + gid + ':' + tier + '">默写测试</button>' +
      '</div>';
    h += '<div class="panel" style="margin-top:16px"><div style="padding:4px 14px"><div class="glist">';
    show.forEach(function (c) {
      var lv = lvOf(c.id);
      var mark = lv >= 5 ? '<span style="color:#2f5a4d">熟</span>' : lv > 0 ? '<span style="color:#a3772a">学' + lv + '</span>' : '<span style="color:#b0a794">新</span>';
      h += '<button class="grow" data-act="go" data-arg="#/c/' + c.id + '" style="align-items:flex-start">' +
        '<div class="gt"><b style="font-family:Georgia,serif;font-size:14px;font-weight:400;line-height:1.5">' + pdot(c.p) + hls(c.en, 90) + '</b>' +
        '<small>' + esc(c.zh) + '</small></div>' +
        '<div class="gp">' + mark + '</div></button>';
    });
    h += '</div></div></div>';
    h += '</div>';
    return h;
  }

  function vCard(cid) {
    var c = byId(cid);
    if (!c) return hd('', '', '', '#/lib') + '<div class="wrap"><div class="empty">卡片不存在</div></div>';
    var g = groupById(c.g);
    var lv = lvOf(cid);
    var h = hd('', '', '', '#/g/' + c.g);
    h += '<div class="wrap">';
    h += '<div class="qtag">' + esc(g.title) + ' · ' + (c.p === 1 ? '主背' : c.p === 2 ? '备用' : '应急') + ' · ' + esc(c.sr) + '</div>';
    h += '<div class="panel pad"><div class="q-en' + (c.en.length > 110 ? ' long' : '') + '">' + hl(c.en) + '</div>';
    h += '<div class="ans"><div class="lbl">释义</div><div class="q-zh" style="font-size:15px">' + esc(c.zh) + '</div></div>';
    if (c.tip) h += '<div class="tip">' + esc(c.tip) + '</div>';
    h += '<div class="note" style="margin-top:12px">记忆等级 ' + lv + ' / 各轮作答 ' + (S.c[cid] ? S.c[cid].seen : 0) + ' 次</div>';
    h += '</div>';
    h += '<div class="btns" style="margin-top:16px"><button class="btn" data-act="studycard" data-arg="' + cid + '">单独背这张</button></div>';
    h += '</div>';
    return h;
  }

  function vSession() {
    if (!SES) { location.hash = '#/'; return ''; }
    var q = SES.q, n = q.length;
    if (!n || SES.i >= n) return vSum();
    var c = q[SES.i];
    var m = modeOf(c);
    var g = groupById(c.g);
    var pct = Math.round(SES.i / n * 100);
    var h = '<div class="ses">';
    h += '<div class="ses-hd"><div class="r1">' +
      '<button class="xbtn" data-act="quit">×</button>' +
      '<span class="num">' + (SES.i + 1) + ' / ' + n + '</span>' +
      '<span>' + esc(MODENAME[m]) + '</span></div>' +
      '<div class="ses-bar"><i style="width:' + pct + '%"></i></div></div>';

    h += '<div class="ses-body"><div class="ses-inner">';
    h += '<div class="qtag">' + esc(g.title) + ' · <b>' + (c.p === 1 ? '主背' : c.p === 2 ? '备用' : '应急') + '</b>' + (c.sr === '主补' ? ' · 主模板补' : '') + '</div>';

    if (m === 'en2zh' || (m === 'mc')) {
      h += '<div class="q-en' + (c.en.length > 110 ? ' long' : '') + '">' + hl(c.en) + '</div>';
      if (m === 'mc') {
        h += '<div class="note" style="margin-top:14px">选出与上面英文对应的中文：</div>';
        h += '<div style="margin-top:10px">';
        SES.opts.forEach(function (op, idx) {
          var cls = 'opt';
          if (SES.sel >= 0) {
            if (idx === SES.correct) cls += ' right';
            else if (idx === SES.sel) cls += ' wrong';
          }
          h += '<button class="' + cls + '" data-act="pick" data-arg="' + idx + '">' + esc(op) + '</button>';
        });
        h += '</div>';
      }
    } else if (m === 'zh2en') {
      h += '<div class="q-zh">' + esc(c.zh) + '</div>';
      if (!SES.rev) {
        h += '<div class="idle" style="margin-top:18px">在心里把英文说出来，再点「显示英文」</div>';
      }
    } else if (m === 'write') {
      h += '<div class="q-zh">' + esc(c.zh) + '</div>';
      if (!SES.res) {
        h += '<div class="wr"><textarea id="inp" placeholder="默写英文，占位符写「主题词 / 某方面 / 年份」即可">' + esc(SES.inp) + '</textarea>' +
          '<div class="hintrow"><span>参考 ' + wordCount(c.en) + ' 词</span><span>标点、大小写不计</span></div></div>';
      }
    }

    // 答案区
    if (SES.rev || SES.res || (m === 'mc' && SES.sel >= 0)) {
      if (m === 'en2zh' || (m === 'mc' && SES.sel >= 0 && SES.sel !== SES.correct)) {
        h += '<div class="ans"><div class="lbl">中文</div><div class="q-zh" style="font-size:15px">' + esc(c.zh) + '</div></div>';
      }
      if (m === 'zh2en') {
        h += '<div class="ans"><div class="lbl">英文</div><div class="q-en' + (c.en.length > 110 ? ' long' : '') + '">' + hl(c.en) + '</div></div>';
      }
      if (m === 'write' && SES.res) {
        var r = SES.res;
        var cls = r.best >= 0.88 ? 'ok' : r.best >= 0.65 ? 'mid' : 'no';
        var guide = r.best >= 0.88 ? '基本写出来了' : r.best >= 0.65 ? '骨架有了，词不准' : '这段还没背下来';
        h += '<div class="score">覆盖率 <b class="' + cls + '">' + Math.round(r.best * 100) + '%</b>' +
          '　<span class="k">' + guide + '</span></div>';
        var ms = missText(r.mark);
        if (ms) h += '<div class="note" style="margin-bottom:10px">漏 / 错：<b>' + esc(ms) + '</b></div>';
        h += '<div class="ans"><div class="lbl">参考</div><div class="q-en' + (c.en.length > 110 ? ' long' : '') + '">' + hl(c.en) + '</div></div>';
      }
      if (c.tip) h += '<div class="tip">' + esc(c.tip) + '</div>';
      h += '<div class="src">' + (c.sr === '主补' ? '主模板补充' : c.sr === '自定' ? '我的词条' : '精选模板') + '</div>';
    }
    h += '</div></div>';

    // 操作条
    h += '<div class="act">';
    if (m === 'en2zh' && !SES.rev) {
      h += '<button class="btn primary" data-act="reveal">显示中文</button>';
    } else if (m === 'zh2en' && !SES.rev) {
      h += '<div class="row2" style="margin-bottom:8px"><button class="btn" data-act="hint">给提示</button><button class="btn primary" data-act="reveal">显示英文</button></div>';
    } else if (m === 'write' && !SES.res) {
      h += '<button class="btn primary" data-act="submit">提交比对</button>';
    } else if (m === 'mc' && SES.sel < 0) {
      h += '<div class="note" style="text-align:center;padding:12px 0">点一下你认为对的那条中文</div>';
    }
    if ((m === 'en2zh' || m === 'zh2en') && SES.rev || (m === 'write' && SES.res) || (m === 'mc' && SES.sel >= 0)) {
      h += '<div class="grade">' +
        '<button class="g0" data-act="grade" data-arg="0">不认识</button>' +
        '<button class="g1" data-act="grade" data-arg="1">模糊</button>' +
        '<button class="g2" data-act="grade" data-arg="2">认识</button>' +
        '</div>';
    }
    h += '</div></div>';
    return h;
  }

  function vSum() {
    var total = SES.right + SES.mid + SES.wrong;
    var acc = total ? Math.round(SES.right / total * 100) : 0;
    var min = Math.max(1, Math.round((Date.now() - SES.start) / 60000));
    var h = '<div class="sum">' +
      '<div class="sub">' + esc(SES.label || '本次') + ' · ' + min + ' 分钟</div>' +
      '<div class="ring">' + acc + '%</div>' +
      '<div class="sub">一次过</div>' +
      '<div class="st3">' +
      '<div><b>' + SES.right + '</b>认识</div>' +
      '<div><b>' + SES.mid + '</b>模糊</div>' +
      '<div><b>' + SES.wrong + '</b>不认识</div>' +
      '</div>' +
      '<div class="note" style="text-align:left;padding:0 4px">' +
      '不认识的卡已插回本轮队尾，明天还会再来；模糊的卡 6 小时后到期。<br>' +
      '认识的卡按 1 / 2 / 4 / 7 / 15 天的间隔往后排。' +
      '</div>' +
      '<div class="btns" style="margin-top:24px;flex-direction:column">' +
      '<button class="btn primary" data-act="again">再来一轮（只出错过的）</button>' +
      '<button class="btn" data-act="go" data-arg="#/">回今日</button>' +
      '</div></div>';
    return h;
  }

