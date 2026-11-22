/* 真题块 / 组页「考场怎么用」：渲染后挂到卡面和组头上（不动程序包，不改数据） */
(function () {
  'use strict';
  var CM = {};
  var GU = {
    p1_overall: '先判断题：一条线一直升 / 有升有降 / 只有占比 / 两张图 / 看不懂就兜底',
    p1_detail: '只写首尾数据或前两项排名，别把图里每个数都抄上去',
    p1_phen: '数据说完要落到「这说明什么」，态度型题优先方案 4',
    p2: '英一三点、英二 2~3 点；顺序固定：举例 → 说理 → 群众',
    p3: '总结 → 政府一句 + 主体一句 → 畅想；图表题也可改趋势预测',
    p4_pic: '一幅图 / 两幅图 / 对话 / 一图一表，先看张数和有没有对话',
    p5_txt: '题干要求说明作者观点时，改写 + 表态两句都不能省',
    p6_page: '考场上直接默整段，只把括号里的主题词换掉',
    x2_call: '先定收信人：只知姓 → Mr./Ms.+姓；只知名 → 直呼其名；只知职位 → Prof./Dr.；都不知道 → Dear Sir or Madam；题干给了 Li Ming 就署 Li Ming',
    x3_bg: '来信要回 → 用被动开头 Thanks for your email；主动去信 → I hope this email finds you well；对方遇上坏事 → I\'m sorry to hear that',
    x4_intent: '一句 I am writing to + 题干动词（invite / recommend / suggest / inquire / thank / apologize），后面接不超 12 词的目的；别写两句',
    x5_self: '对方不认识你才写这句 I am a student from … department；认识就省，字数留给第二段',
    x6_trans: '分点前先递一句 The primary reasons for my 建议 / 邀请 are as follows；通知换 The relevant matters are hereby notified as follows',
    x6_1: '时间、地点、事件三项缺一不可；整场没有活动，就改推荐句 26 或要求句 33，别硬塞时间地点',
    x6_2: '目的句和主题句二选一，不要都写；写目的更稳，考场一眼能改',
    x6_3: '参与范围只抓一句：all grades / international students；第二句留给环节，别两句都堆在范围上',
    x6_4: '开场 + 环节写两句就够，讲义里四个环节不用全抄',
    x6_5: '奖励句用来收尾：前三名 trophy / certificate、入围者加分；没奖就换 memorable experience 那句',
    x6_6: '推荐的是地 / 书 / 影 / 人：一句 What makes X highly recommendable…，再从 25–27 挑一句理由',
    x6_7: '自荐看岗位、招募看要求：28–30 讲能力，31–33 讲条件，按题干挑一边写',
    x6_8: '34–38 感谢句都能拍；39–40 只在道歉信里用——历年没有严肃道歉信，最多是忘还 CD、借的书没还',
    x6_9: '41–50 是兜底句库：缺什么补什么，其中 41 badly in need、43 I wonder if you can 是建议 / 投诉的主力',
    x7_close: '一句表态 + 一句盼复；通知和纪要不写盼复，通知末尾换成报名句',
    x8_notice: 'Notice 居中、正文三段、右下署名加日期；不写称呼，也不写盼复',
    x9_minutes: '抬头六行 + 正文六句，第六句只周期会议用；讲义明说没有历年真题可对照，格式照抄别改序'
  };
  var CSS = '' +
    '.cas{margin-top:14px;padding:10px 12px 11px;border-left:3px solid #a2352a;background:#fdfaf5;border-radius:0 10px 10px 0}' +
    '.cas .ch{font-size:12px;color:#a2352a;letter-spacing:.5px;margin-bottom:6px}' +
    '.cas .cq{font-size:12.5px;color:#7a6f61;line-height:1.6;margin-bottom:6px}' +
    '.cas .ce{font-family:Georgia,"Times New Roman",serif;font-size:14.5px;line-height:1.58;color:#2b2320;word-break:break-word}' +
    '.cas .cz{font-size:12.5px;color:#7a6f61;line-height:1.7;margin-top:7px}' +
    '.gu{margin-top:10px;padding:8px 11px;border-left:3px solid #d8cfc0;background:#fdfbf6;border-radius:0 9px 9px 0;font-size:12.5px;line-height:1.7;color:#5f574c}' +
    '.gu b{color:#a2352a;font-weight:600}' +
    '.cidx{position:fixed;inset:0;z-index:80;background:rgba(43,35,32,.3);display:flex;align-items:flex-end}' +
    '.cidx .box{width:100%;max-height:86vh;background:#fbf8f2;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden}' +
    '.cidx .hd{display:flex;align-items:center;gap:10px;padding:14px 16px 8px}' +
    '.cidx .hd h3{margin:0;font-size:15px;font-weight:600;flex:1;color:#2b2320}' +
    '.cidx .hd .n{font-size:12px;color:#8d8272}' +
    '.cidx .hd .x{border:0;background:transparent;font-size:17px;color:#8d8272;padding:0 2px}' +
    '.cidx .fl{display:flex;gap:8px;padding:0 16px 10px;border-bottom:1px solid #eee6da}' +
    '.cidx .fl button{border:1px solid #e2dcd2;background:#fffdf8;color:#6c6357;font-size:12px;padding:4px 11px;border-radius:9px}' +
    '.cidx .fl button.on{background:#a2352a;border-color:#a2352a;color:#fdf8f0}' +
    '.cidx .bd{overflow:auto;-webkit-overflow-scrolling:touch;padding:2px 16px calc(18px + env(safe-area-inset-bottom))}' +
    '.cidx .yr{font-size:12px;color:#a2352a;letter-spacing:.5px;margin:12px 0 2px}' +
    '.cidx .it{padding:9px 0 11px;border-bottom:1px dashed #eee6da}' +
    '.cidx .it .q{font-size:12px;color:#7a6f61;line-height:1.58}' +
    '.cidx .it .e{font-family:Georgia,"Times New Roman",serif;font-size:13.5px;line-height:1.52;color:#2b2320;margin-top:4px;word-break:break-word}' +
    '.cidx .sr{padding:0 16px 10px}' +
    '.cidx .sr input{width:100%;box-sizing:border-box;border:1px solid #e2dcd2;background:#fffdf8;border-radius:10px;padding:8px 11px;font-size:13px;color:#2b2320;outline:none;-webkit-appearance:none}' +
    '.cidx .it .z{font-size:12.5px;color:#7a6f61;line-height:1.7;margin-top:5px}' +
    '.cidx .it .gr{font-size:11.5px;color:#a89c8b;line-height:1.6;margin-top:3px}' +
    '.cidx .emp{padding:26px 0 30px;text-align:center;font-size:13px;color:#8d8272}' +
    '.cidx .it .go{font-size:12px;color:#a2352a;margin-top:5px}' +
    '@media (max-width:360px){.cas .ce{font-size:13.5px}}';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function caseBox(u) {
    var d = document.createElement('div');
    d.className = 'cas';
    var h = '<div class="ch">真题 · 什么时候用</div>';
    if (u.q) h += '<div class="cq">' + esc(u.q) + '</div>';
    if (u.eg) h += '<div class="ce">' + esc(u.eg) + '</div>';
    if (u.egzh) h += '<div class="cz">译：' + esc(u.egzh) + '</div>';
    d.innerHTML = h;
    return d;
  }
  function hashId(re) {
    var m = re.exec(location.hash || '');
    return m ? decodeURIComponent(m[1]) : '';
  }
  /* 卡面：把 tip 里的真题摘出来单独成块；词汇卡（骨架句）本来不显示 tip，这里补一块 */
  function patchCard() {
    var cid = hashId(/^#\/c\/([^\/?#]+)/), u = CM[cid];
    if (!u) return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || !wrap.querySelector('[data-act="studycard"]')) return;   /* 只在卡面，不动背卡流 */
    if (wrap.querySelector('.cas')) return;
    var tip = wrap.querySelector('.tip'), keep = null, cut = -1, node = caseBox(u);
    if (tip) {
      cut = tip.textContent.indexOf('▍真题');
      keep = cut >= 0 ? tip.textContent.slice(0, cut).replace(/\s+$/, '') : tip.textContent;
      if (keep) {
        tip.textContent = keep;
        tip.parentNode.insertBefore(node, tip.nextSibling);
        return;
      }
      tip.parentNode.removeChild(tip);
      tip = null;
    }
    var panel = wrap.querySelector('.panel.pad');
    if (!panel) return;
    var notes = panel.querySelectorAll('.note'), last = notes[notes.length - 1];
    if (last) panel.insertBefore(node, last); else panel.appendChild(node);
  }
  /* 组头：一行「考场怎么用」，先判题型再取句 */
  function patchGroup() {
    var gid = hashId(/^#\/g\/([^\/?#]+)/), t = GU[gid];
    if (!t) return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('.gu')) return;
    var el = document.createElement('div');
    el.className = 'gu';
    el.innerHTML = '<b>考场怎么用</b>　' + esc(t);
    var chips = wrap.querySelector('.chips'), btns = wrap.querySelectorAll('.btns'), b0 = btns[0];
    if (chips && chips.parentNode) chips.parentNode.insertBefore(el, chips);
    else if (b0) b0.parentNode.insertBefore(el, b0);
    else wrap.appendChild(el);
  }
  /* 真题索引：把散在卡上的出处按年份排开，从真题反查句子 */
  var IDX = null;
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
  function idxItems() {
    if (IDX) return IDX;
    var a = [], k;
    for (k in CM) if (CM.hasOwnProperty(k)) {
      var u = CM[k], q = u.q || '', ym = /^(\d{4})/.exec(q);
      a.push({
        id: k, q: q, eg: u.eg || '', zh: u.egzh || '',
        sec: k.indexOf('e_') === 0 ? '小作文' : '大作文',
        gr: groupTitle((function (c) { return c && c.g; })(cardOf(k))),
        y: ym ? ym[1] : '通用句式（不绑年份）',
        tp: q.indexOf('英二') >= 0 ? '二' : (q.indexOf('英一') >= 0 ? '一' : '其他')
      });
    }
    function rk(v) { return /^\d/.test(v) ? Number(v) : -1; }   /* 通用句式放最后 */
    a.sort(function (x, y) {
      var rx = rk(x.y), ry = rk(y.y);
      if (rx !== ry) return ry - rx;
      return x.q < y.q ? -1 : 1;
    });
    IDX = a; return a;
  }
  function openIndex() {
    var old = document.getElementById('cidx');
    if (old) { old.parentNode.removeChild(old); return; }
    var items = idxItems(), n1 = 0, n2 = 0, n3 = 0, i;
    for (i = 0; i < items.length; i++) {
      if (items[i].tp === '二') n2++; else if (items[i].tp === '一') n1++; else n3++;
    }
    var box = document.createElement('div');
    box.id = 'cidx'; box.className = 'cidx';
    box.innerHTML = '<div class="box"><div class="hd"><h3>真题索引</h3><span class="n">' + items.length + ' 处</span><button class="x">×</button></div>' +
      '<div class="fl"><button data-f="all" class="on">全部 ' + items.length + '</button>' +
      '<button data-f="一">英一 ' + n1 + '</button><button data-f="二">英二 ' + n2 + '</button>' +
      '<button data-f="其他">通用 ' + n3 + '</button></div>' +
      '<div class="sr"><input type="text" inputmode="search" placeholder="搜英文 / 中文 / 年份，如 2023、邀请、art"></div>' +
      '<div class="bd"></div></div>';
    document.body.appendChild(box);
    var bd = box.querySelector('.bd');
    var kw = '';
    function draw(f) {
      var cur = null, h = '', k = kw ? kw.toLowerCase() : '';
      items.forEach(function (t) {
        if (f !== 'all' && t.tp !== f) return;
        if (k && (t.q + ' ' + t.eg + ' ' + t.zh).toLowerCase().indexOf(k) < 0) return;
        if (t.y !== cur) { cur = t.y; h += '<div class="yr">' + esc(/^\d/.test(cur) ? cur + ' 年' : cur) + '</div>'; }
        h += '<div class="it" data-id="' + esc(t.id) + '"><div class="q">' + esc(t.q) + '</div>' +
          '<div class="gr">' + esc(t.sec + (t.gr ? ' · ' + t.gr : '')) + '</div>' +
          '<div class="e">' + esc(t.eg) + '</div>' +
          (t.zh ? '<div class="z">' + esc(t.zh) + '</div>' : '') +
          '<div class="go">跳到这张卡 ›</div></div>';
      });
      bd.innerHTML = h || '<div class="emp">没找到——换个词试试，或把筛选切回「全部」。</div>';
    }
    draw('all');
    var sr = box.querySelector('.sr input');
    sr.oninput = function () { kw = this.value.replace(/^\s+|\s+$/g, ''); draw(box.querySelector('.fl .on').getAttribute('data-f')); bd.scrollTop = 0; };
    box.querySelector('.fl').onclick = function (e) {
      var b = e.target.closest('[data-f]');
      if (!b) return;
      Array.prototype.forEach.call(box.querySelectorAll('[data-f]'), function (x) { x.className = ''; });
      b.className = 'on'; draw(b.getAttribute('data-f')); bd.scrollTop = 0;
    };
    function close() { if (box.parentNode) box.parentNode.removeChild(box); }
    box.querySelector('.x').onclick = close;
    box.onclick = function (e) { if (e.target === box) close(); };
    bd.onclick = function (e) {
      var it = e.target.closest('.it'), id = it && it.getAttribute('data-id');
      if (!id) return;
      close(); location.hash = '#/c/' + encodeURIComponent(id);
    };
  }
  function mountIndex() {
    if (location.hash !== '#/mine') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#caseidxbtn')) return;
    var n = idxItems().length;
    if (!n) return;
    var box = document.createElement('div');
    box.id = 'caseidxbtn';
    box.innerHTML = '<div class="sec-t"><h2>真题</h2><span>从年份反查句子</span></div>' +
      '<div class="panel" style="padding:4px 14px"><div class="glist">' +
      '<button class="grow" data-cidx="1"><div class="gt"><b>真题索引</b><small>' + n +
      ' 处出处 · 按年份倒序，点一条跳到那张卡</small></div><div class="gp">看</div></button></div></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cidx]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation(); openIndex();
    });
    /* 位置：放到「我的词条」之上，别沉到底部 */
    var secs = wrap.querySelectorAll('.sec-t'), anchor = null;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].textContent.indexOf('我的词条') >= 0) { anchor = secs[i]; break; }
    }
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor);
    else {
      var vp = wrap.querySelector('#verpanel');
      if (vp && vp.parentNode) vp.parentNode.insertBefore(box, vp);
      else wrap.appendChild(box);
    }
  }
  /* 词库页顶部也放一个入口：翻题时随手就能查真题 */
  function mountLib() {
    if (location.hash !== '#/lib') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#libidxbtn')) return;
    var n = idxItems().length;
    if (!n) return;
    var box = document.createElement('div');
    box.id = 'libidxbtn';
    box.innerHTML = '<div class="panel" style="padding:4px 14px;margin:0 0 10px"><div class="glist">' +
      '<button class="grow" data-cidx="1"><div class="gt"><b>真题索引</b><small>' + n +
      ' 处出处 · 按年份排开，点一条跳到那张卡</small></div><div class="gp">看</div></button></div></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cidx]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation(); openIndex();
    });
    wrap.insertBefore(box, wrap.firstChild);
  }
  function tick() {
    CM = window.__CASE__ || CM;
    try { patchCard(); patchGroup(); mountIndex(); mountLib(); } catch (e) { }
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
  window.__casePatch = tick;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
