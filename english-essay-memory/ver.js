/* ---------- 版本与更新（由 build/mk_ver.py 生成） ---------- */
(function () {
  'use strict';
  var VER = '1.3.10', VDATE = '2026-11-23', VLOGS = [{"v":"1.3.10","d":"2026-11-23","t":"背卡三件：读音、自动读、勾骨架","items":["背卡会话和单卡页的英文句子旁边多一颗「读音」：点一下用手机自带的英文朗读念出来，不联网、不占流量，离线单文件也能用","句子里的占位词（主题词 / 年份）不念中文，统一读成 X，听着不串味（题目里那种中英混读最毁耳朵）","「我的 → 设置」新增「背卡读音与骨架」：自动读一遍 / 要读了才读，语速 0.60–1.20 可调，默认 0.92","自动读只在换卡时念一次，翻面后再念一次答案句；同一句不重复念，翻来翻去翻不出噪音","「勾出骨架」默认开：把 however / therefore / in contrast 这类连接词和 rose / fell / accounts for 这类升降词勾成暗红，长句先看框架再背细节","只动显示层，卡面文字、读音、阴影都不进存档；关掉开关立刻回到原样，不影响排期和作答"]},{"v":"1.3.9","d":"2026-11-23","t":"每天背多久：时长也有目标了","items":["「我的 → 设置」多一项「每天背多久」：20 / 30 / 45 / 60 四档，也能自己填，只收 5–240 的整数，越界就退回原值","默认 30 分钟；改了目标不动每日张数，两个数是两套目标，互不算数","学习报告「学习时长」块里加一条本周横杠：本周已停多少分钟 ÷ 目标（每天目标 × 7），周一起算","文案跟张数那套一致：还剩 N 天（含今天）就写「每天再 X 分钟就够」，周日写「就剩今天了，还差 X 分钟」，超了写「已经达成，超出 X」","首页「今日」面板底部挂一行「今天在卡面上 X 分钟 · 还差 Y 分钟到 30 分钟」，不点进报告也知道今天够没够","报告开着的时候时长还在走：这块每 30 秒自己重算一次，不用关掉再开；数字只在本机算"]},{"v":"1.3.8","d":"2026-11-22","t":"学习时长：卡面上停了多久","items":["程序原来不记时长，现在单开一个计时：只在背卡（#/s）和单卡页（#/c/…）上走，停在词库、首页、报告这些页面不算","2 分钟没有操作就暂停，切到后台也停；回到前台继续，不会把挂机的一小时算成学习时间","计数写在自己的存档键（ky_zw_clock），不碰程序那份进度存档，导入导出备份也不受影响","学习报告最下面多一块「学习时长」：今天多久、最近 7 天日均、7 天累计与有记录的天数、最久的一天","不足 1 分钟就按秒写（40 秒就写 40 秒），不四舍五入成 0，也不写「不到 1 分钟」这种看不出多少的话；数字都是本机算的，换手机从零开始"]},{"v":"1.3.7","d":"2026-11-22","t":"每日张数：五个预设之外自己填","items":["「我的 → 设置」每日新卡上限原来只有 10 / 20 / 25 / 30 / 40 五个固定档，下面多一行：输入框 + 「−5」「+5」+「设为每日」","只收 1–200 的整数；越界就提示并退回原值，不写进存档","走程序自己的 setn：同一份存档、同一套重绘，不另存第二份设置，免得两个每日上限打架","改完「今天背什么」「本周目标」「考前够不够」三块立刻跟着变：配额 35 时周目标 245，今天新卡剩 35−已上新","数值不在五个预设里时五个档都不高亮，下面那行写「自定义档，不在上面五个里」，不至于看着像没选"]},{"v":"1.3.6","d":"2026-11-22","t":"报告里那句会打自己脸的提示","items":["未来七天一块，没有到期卡时原来写「还没开始背」，可上面明明已经写着背了几天、共多少张","改成「这几天没有到期的卡，可以安心上新卡」：只说不排队，不再替用户判断有没有开始背","同样的判断逻辑没动，只在文字这一层改口"]},{"v":"1.3.5","d":"2026-11-22","t":"本周目标：这周背多少、已经背到哪","items":["学习报告新增「本周目标」块：按每日配额 × 7 天算出这周要上新多少张，一条横杠直接给完成比例","进度只算新学张数，和配额同一个口径；另外单列本周作答张数（含复习），两个数不混着说","没达标就写「还剩 N 天（含今天），每天再上 X 张就够」；到了周日改口「就剩今天了，还差 X 张，补上才达标」；超了就直接说超出多少张","周一起算，不按自然周那一套，和日常说的「本周」对得上"]},{"v":"1.3.4","d":"2026-11-22","t":"认得率：记得 / 模糊 / 忘了","items":["学习报告新增一块「认得率」，取最近 14 天的作答重新分档：记得多少、模糊多少、忘了多少，三条横杠一眼看清","口径和首页面板一致（记得 = 按记得键那一下，忘了 = 按忘键那一下，剩下都算模糊），所以报告和首页不会给出两个不一样的正确率","底下写一句判断：忘了占到 15% 以上就提示「配额先降一点回炉」，记得稳定在 70% 以上就说可以维持或往上加，中间那档建议把模糊的挑出来再背一轮","没作答过就只写「近两周还没有作答记录」，不画空杠"]},{"v":"1.3.3","d":"2026-11-22","t":"考前够不够：按最近速度估还要几天","items":["学习报告第二块新增「考前够不够」：距考试几天、还剩多少张没上过、每天要背几张才够考前过一遍、最近 7 天实际每天上几张","结论写成一句人话：按这个速度能把没上过的都过一遍（附上「27 天 × 25 张 ≈ 675 张」这种容量对比），或者直说「每天得再多上 N 张」","全部用本机进度算：考试日读「我的」里设的日期，速度取最近 7 天新学张数的平均；改了考试日期或每日配额，这一块立刻跟着变"]},{"v":"1.3.2","d":"2026-11-22","t":"今天背什么：到期 + 新卡，一键开队列","items":["学习报告最上面新增一块「今天背什么」：张到期、张新卡、张合计，三个数一眼看清今天要做多少","下面一颗红按钮「开始今天的 N 张」，点下去直接进程序原有的今日队列（到期先做、再按配额上新课），不用退回去找首页那颗","新卡配额读的是「我的」里设的每日张数；今天已经上满就显示 0，合计只剩到期，按钮自动换成「今天这一轮已经背完」","首页学习报告那一行也改成「连续 N 天 · 待复习 M 张」，不点进去也知道手上有多少要还"]},{"v":"1.3.1","d":"2026-11-22","t":"学习报告的空状态","items":["还没开始背的时候，「近两周作答」和「未来七天复习」不再画一片空柱子，只写一句「还没有记录」，看着不像坏了","有记录之后照常出柱状图；今天、明天、后天的到期张数仍放在图下面一行"]},{"v":"1.3.0","d":"2026-11-22","t":"学习报告：打卡、趋势、记忆持久度","items":["首页「今日」面板下面新增「学习报告」入口，一行字给出连续打卡天数、累计天数、今天背了几张","打卡日历：最近 28 天四排格子，哪天背了、那天背得多不多一眼看出；今天那格带红框","近两周作答柱状 + 记忆持久度八档（未学 / lv1–lv7，从间隔 1 天到 60 天）+ 记牢张数统计","未来七天复习预测：今天含已过期，明天后天各多少张；到期多就只做复习、不追新卡","全部从本机进度现算，不联网、不动数据包；没背过时入口如实写「还没有记录」"]},{"v":"1.2.8","d":"2026-11-22","t":"自测选项：年份和卷别都得分开记","items":["三个干扰项刻意错开：同年另一卷、邻年同卷、换年换卷，不再出现四个选项卷别全一样、等于只考年份的情况","老年份只出过一卷（如 2004 只有英一）时也硬配一个另一卷选项，卷别那半题不白送","100 道题实测：每题选项都含两种以上卷别、两个以上年份"]},{"v":"1.2.7","d":"2026-11-22","t":"真题自测：给一句，认出哪年哪卷","items":["测试页顶部新增「真题自测」：从 85 处真题里随机抽 10 句，只给原句和中文，问这句出自哪一年哪一卷","四个选项都是真题里真出现过的「年份 + 卷别」，干扰项混着年份与卷别，蒙不出来","答完当场揭底：完整出处（含题型后缀，如「2026 英一 · 双图表拉长版」）+ 所属组，另给「看这张卡」直接跳到那句","结果页给分数、本机最好成绩和本轮错题清单，错题的出处和原句一并列出，方便对着讲义补"]},{"v":"1.2.6","d":"2026-11-22","t":"索引标出出处所在组，词库页也能进","items":["索引每条多一行灰色小字「大作文 / 小作文 · 组名」，比如「大作文 · 图表第一段 · 总体描述」，搜到一句就知道它在全文哪个位置","词库页顶部新增「真题索引」入口，翻题时不用切回「我的」页","两处入口共用同一个弹层：筛选、搜索状态一致，关掉再开还是从全部开始"]},{"v":"1.2.5","d":"2026-11-22","t":"真题索引能搜了","items":["索引顶部加搜索框：英文、中文、年份都能搜——记得半句就搜得到，输入 2023 直接收窄到那一年","85 条全部补上中文译文，一眼判断意思对不对，不用点进去才看","搜索和「英一 / 英二 / 通用」四档筛选可以叠加：先切档再输词，范围更小","搜不到时给一句提示，不会白屏；搜索只在本机算，不联网、不改数据"]},{"v":"1.2.4","d":"2026-11-22","t":"真题索引：从年份反查句子","items":["「我的 → 真题」新增真题索引：85 处出处按年份倒序排开，不再只能从句子看真题","每条给出处 + 讲义原句，点一条直接跳到那张卡，整句、释义、真题块一块看到","四档筛选：全部 85 / 英一 23 / 英二 30 / 通用 32——示范型、不绑年份的句子单列一档，不硬塞年份","索引是打开时从真题补丁包现算的，数据包不动、也不占体积；卡面与组头照旧"]},{"v":"1.2.3","d":"2026-11-22","t":"小作文也挂上真题出处","items":["小作文 13 张卡挂真题实例：讲义「真题带练」15 篇原例里确实用过的句子，原句逐字照抄 + 中文，逐条人工核对","覆盖 2010 英二感谢、2022 英一邀请、2022 英二美食节、2023 英一招募、2023 英二看展、2024 英二调研、2025 英一答复说出来","小作文 17 个组都加了「考场怎么用」：称呼怎么定、意图一句怎么改、哪组带奖、通知别写盼复","小作文没有真题对应的组（纪要）如实写「讲义没有历年真题可对照」，不编年份"]},{"v":"1.2.2","d":"2026-11-22","t":"真题做成卡面独立块","items":["模板句卡上的真题从灰色提示框里拎出来，单独一块：左边一道红杠，红字写「真题 · 什么时候用」，下面出处 / 原句 / 中文三行","图表词汇 19 张卡面原来只有句型，现在也挂同款真题块，不用点进「逐个背这张」才看得到","有真题的 8 个组（图表第一段、细节、现象、第二段、第三段、图画、文字、一页纸）组头多一行「考场怎么用」，先判题型再取句","背卡流里没改：进背这一组时真题仍跟在提示框内，不多占一屏"]},{"v":"1.2.1","d":"2026-11-22","t":"每张模板句挂上真题例句","items":["72 张模板句 / 图表词汇卡新增「真题 · 什么时候用」：一句题型 + 真题出处（如 2024 英二静态图 / 2026 英一双图表）+ 讲义原句 + 中文","图表第一段 8 句按题型对号：一条线一直升、有升有降、一升一降、只有占比、差距悬殊、双图表、兜底，卡上直接给对应真题","第二、三段与图画 / 文字段同样配真题：2019 英二升学就业、2020 英一习惯与拖延、2022 英一讲座、2024 英一图加表、2004 英一跑步","图表词汇 19 组逐个给「哪个题里这么用」；标「示范」的是讲义公式填例，未冒充真题","组页保留「先判题型，再取句」的组头提示；真题落在卡上，看到题就知道这句是写给哪一年、哪一类题"]},{"v":"1.2.0","d":"2026-11-22","t":"小作文（A 节应用文）整块上线","items":["新增「小作文」板块 17 组 / 138 张卡：★主背 45 句、○备用 38 句、同义变体 55 句（45+38+55 正好 138）","第一段拆成四块：称呼表、背景提要（积极 / 消极 / 寒暄 / 拉长）、来信意图主干 + 29 条功能短语、主动写信的自我介绍","第二段 50 个分点句独立成 9 组（主背 20 / 备用 15 / 同义变体 17）：基本信息 / 主题目的 / 参与范围 / 流程环节 / 奖品收获 / 推荐 / 能力与要求 / 感谢道歉 / 通用型（41–50 全背）","第三段补情感 + 盼复 + 落款；另加通知（Notice）与纪要（Minutes）两套格式与正文六句","大作文同步对照第 4 版讲义：★主背句 81 条全部在库，未新增；模板句 / 替换词维持原样"]},{"v":"1.1.0","d":"2026-11-14","t":"版本入口搬进「我的」页","items":["「我的」页单独开一块「版本」：一行「版本记录 N 条 · 当前 v1.1.0」，一行「检查新版本」手动查一次","更新过的第二天再打开，顶部会提示「已更新至 v1.1.0」，点一下直接看这次改了什么","网页版加了缓存 worker：第二次打开先读本机缓存、后台静默拉新版；离线单文件也带同一套版本信息"]},{"v":"1.0.0","d":"2026-11-14","t":"模板句收口 + 更新系统","items":["第二、第一段模板句从 114 句收到 54 句：主背全留，每组只再留 2~3 句备用，全站 326 → 266 张卡 / 50 组","一页纸速查 5 张、六大方面 132 条、图表词汇 19 条、替换词 61 组不动","新增更新系统：打开自动比对线上版本，有新版本时底部弹「立即更新」，点一下换到新版","首次打开后缓存一份到本机，之后离线也能开；「我的 → 关于」里有版本号、检查更新、更新记录"]},{"v":"0.9.0","d":"2026-11-14","t":"图标与启动图换成红底米白 E 字","items":["主屏图标由三根圆角条换成红底米白 E 字（180 / 192 / 512 三档）","iOS 系统启动图 6 个尺寸按同一枚徽标重做，打开不再先闪旧三条杠","PWA 启动画面里的标志同步换成 E 字方块"]},{"v":"0.8.0","d":"2026-11-14","t":"按主模板补齐内容","items":["逐页比对两份 PDF：六大方面 132 条齐全，模板句、图表词汇、替换词补了 27 张主模板独有的卡","替换词不再整排铺一屏：一组只出一个说法，给句型、挖空自己填，整组按最差的那个排期","中→英 / 英→中 双向可切，逐词背带中文提示"]}];
  var KVER = 'eem:ver';
  window.VER = VER; window.VERDATE = VDATE; window.__VERLOG = VLOGS;

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

  function cmpVer(a, b) {
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
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (j && j.version && cmpVer(j.version, VER) > 0) {
          bar('有新版本 v' + j.version, '立即更新', function () {
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

  function mountVerPanel() {
    if (location.hash !== '#/mine') return;
    if (document.querySelector('[data-act="checkver"]')) return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#verpanel')) return;
    var secs = wrap.querySelectorAll('.sec-t'), anchor = null, i;
    for (i = 0; i < secs.length; i++) {
      if (secs[i].textContent.indexOf('关于') >= 0) { anchor = secs[i]; break; }
    }
    var box = document.createElement('div');
    box.id = 'verpanel';
    box.innerHTML =
      '<div class="sec-t"><h2>版本</h2><span>当前 v' + VER + ' · ' + VDATE + '</span></div>' +
      '<div class="panel" style="padding:4px 14px"><div class="glist">' +
        '<button class="grow" data-ver="log"><div class="gt"><b>版本记录</b><small>' +
          VLOGS.length + ' 条 · 最新 v' + (VLOGS[0] ? VLOGS[0].v : VER) + '</small></div><div class="gp">看</div></button>' +
        '<button class="grow" data-ver="chk"><div class="gt"><b>检查新版本</b><small>手动比对一次线上版本</small></div><div class="gp">查</div></button>' +
      '</div></div>';
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor);
    else wrap.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ver]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      if (b.getAttribute('data-ver') === 'log') window.showVerLog(); else check(true);
    });
  }
  document.addEventListener('hashchange', function () { setTimeout(mountVerPanel, 120); });
  setTimeout(mountVerPanel, 700);

  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' })
        .catch(function () { });
    }
  } catch (e) { }

  setTimeout(boot, 900);
})();
