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
  function tick() {
    CM = window.__CASE__ || CM;
    try { patchCard(); patchGroup(); } catch (e) { }
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
