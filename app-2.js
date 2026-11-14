  function vTest() {
    var h = hd('测试', '只测不学，暴露记忆缺口', '');
    h += '<div class="wrap">';
    h += '<div class="sec-t"><h2>范围</h2></div><div class="chips">';
    [{ v: 0, t: '全部' }, { v: 1, t: '六大方面' }, { v: 2, t: '模板句' }, { v: 3, t: '图表词汇' }, { v: 4, t: '替换升级' }, { v: 6, t: '一页纸' }].forEach(function (x) {
      h += '<button class="tag ' + (T.sec === x.v ? 'on' : '') + '" data-act="tsec" data-arg="' + x.v + '">' + x.t + '</button>';
    });
    h += '</div>';
    h += '<div class="sec-t"><h2>方式</h2></div><div class="chips">';
    [{ v: 'write', t: '默写（打字）' }, { v: 'zh2en', t: '回想（口述）' }, { v: 'mc', t: '四选一' }, { v: 'en2zh', t: '认词' }].forEach(function (x) {
      h += '<button class="tag ' + (T.mode === x.v ? 'on' : '') + '" data-act="tmode" data-arg="' + x.v + '">' + x.t + '</button>';
    });
    h += '</div>';
    h += '<div class="sec-t"><h2>张数</h2></div><div class="chips">';
    [10, 20, 30, 50].forEach(function (x) {
      h += '<button class="tag ' + (T.n === x ? 'on' : '') + '" data-act="tn" data-arg="' + x + '">' + x + ' 张</button>';
    });
    h += '</div>';
    h += '<div style="margin-top:20px"><button class="btn primary" data-act="testrun">开始测试</button></div>';
    h += '<div class="panel pad" style="margin-top:18px">' +
      '<div class="note"><b>默写</b>：给中文，你打字写英文，按词比对算覆盖率，红字是漏的词。<br>' +
      '<b>回想</b>：给中文，你口头说英文，想不起来再翻。<br>' +
      '<b>四选一</b>：认词的快测法，适合考前扫一遍。<br>' +
      '组卡（一组替换词）不进默写，改用认词或四选一。</div></div>';
    h += '</div>';
    return h;
  }

  function vMine() {
    var h = hd('我的', '数据、词条、设置', '');
    h += '<div class="wrap">';
    var total = 0, mastered = 0, learning = 0, unseen = 0, ok = 0, all = 0;
    allCards().forEach(function (c) {
      total++; var lv = lvOf(c.id), s = S.c[c.id];
      if (lv >= 5) mastered++; else if (lv > 0) learning++; else unseen++;
      if (s) { ok += s.r; all += s.seen; }
    });
    h += '<div class="stat2">' +
      '<div class="panel"><div class="lab">已掌握</div><div class="val">' + mastered + '<small>/ ' + total + '</small></div></div>' +
      '<div class="panel"><div class="lab">学习中 / 未开始</div><div class="val">' + learning + '<small>/ ' + unseen + '</small></div></div>' +
      '</div>';

    // 14 天热力
    h += '<div class="sec-t"><h2>最近 14 天</h2><span>每天作答的张数</span></div><div class="panel pad">';
    var days = [], maxv = 1;
    for (var i = 13; i >= 0; i--) {
      var d = new Date(Date.now() - i * DAY), k = todayStr(d);
      var v = S.st[k] ? (S.st[k].all || 0) : 0;
      days.push({ k: k, v: v, d: d }); if (v > maxv) maxv = v;
    }
    h += '<div class="heat">' + days.map(function (x) {
      var lv = x.v === 0 ? 0 : x.v < maxv * 0.25 ? 1 : x.v < maxv * 0.5 ? 2 : x.v < maxv * 0.8 ? 3 : 4;
      return '<div class="c ' + (lv ? 'l' + lv : '') + '" title="' + x.k + ' ' + x.v + ' 张"></div>';
    }).join('') + '</div>';
    h += '<div class="heat-x">' + days.map(function (x) { return '<span>' + x.d.getDate() + '</span>'; }).join('') + '</div>';
    h += '</div>';

    // 分方面进度
    h += '<div class="sec-t"><h2>六个方面</h2><span>掌握 = 连续答对 5 轮</span></div><div class="panel pad"><div class="bars">';
    GROUPS.filter(function (g) { return g.sec === 1; }).forEach(function (g) {
      var cards = cardsOf(g.id), m = 0;
      cards.forEach(function (c) { if (lvOf(c.id) >= 5) m++; });
      h += '<div class="b"><div class="lb">' + esc(g.title.replace('方面', '')) + '</div><div class="bb"><i style="width:' + Math.round(m / Math.max(1, cards.length) * 100) + '%"></i></div><div class="vv">' + m + '/' + cards.length + '</div></div>';
    });
    h += '</div></div>';

    // 难卡
    var hard = allCards().map(function (c) { return { c: c, w: S.c[c.id] ? S.c[c.id].w : 0, s: S.c[c.id] ? S.c[c.id].seen : 0 }; })
      .filter(function (x) { return x.w >= 2; }).sort(function (a, b) { return b.w - a.w; }).slice(0, 6);
    if (hard.length) {
      h += '<div class="sec-t"><h2>最卡手的</h2><span>错 2 次以上</span></div><div class="panel" style="padding:4px 14px"><div class="glist">';
      hard.forEach(function (x) {
        h += '<button class="grow" data-act="go" data-arg="#/c/' + x.c.id + '"><div class="gt"><b style="font-family:Georgia,serif;font-size:13px;font-weight:400">' + hls(x.c.en, 70) + '</b><small>' + esc(x.c.zh) + '</small></div><div class="gp">错 ' + x.w + '</div></button>';
      });
      h += '</div></div>';
    }

    // 我的词条
    h += '<div class="sec-t"><h2>我的词条</h2><span>' + (S.custom.length) + ' 条</span></div>';
    h += '<div class="panel pad">';
    h += '<div class="field"><label>英文（句子或短语）</label><input id="c-en" placeholder="The chart above illustrates …"></div>';
    h += '<div class="field"><label>中文</label><input id="c-zh" placeholder="中文释义 / 什么时候用"></div>';
    h += '<div class="field"><label>备注（可空）</label><input id="c-tip" placeholder="易错点、搭配、例句"></div>';
    h += '<button class="btn" data-act="addcustom">加进复习队列</button>';
    if (S.custom.length) {
      h += '<div class="glist" style="margin-top:12px">';
      S.custom.slice().reverse().forEach(function (x) {
        h += '<div class="grow" style="cursor:default"><div class="gt"><b style="font-family:Georgia,serif;font-size:13px;font-weight:400">' + hl(x.en) + '</b><small>' + esc(x.zh) + '</small></div>' +
          '<button class="btn sm danger" data-act="delcustom" data-arg="' + x.id + '">删</button></div>';
      });
      h += '</div>';
    }
    h += '</div>';

    // 设置
    h += '<div class="sec-t"><h2>设置</h2></div><div class="panel pad">';
    h += '<div class="field"><label>每日新卡上限</label>' +
      '<div class="chips">' + [10, 20, 25, 30, 40].map(function (x) {
        return '<button class="tag ' + (S.set.newPerDay === x ? 'on' : '') + '" data-act="setn" data-arg="' + x + '">' + x + '</button>';
      }).join('') + '</div></div>';
    h += '<div class="field"><label>默认背诵方向（卡面上也可随时切换）</label>' +
      '<div class="chips">' + [{ v: 'auto', t: '自动（新卡英→中，老卡中→英）' }, { v: 'en2zh', t: '只英→中' }, { v: 'zh2en', t: '只中→英' }].map(function (x) {
        return '<button class="tag ' + (S.set.mode === x.v ? 'on' : '') + '" data-act="setmode" data-arg="' + x.v + '">' + x.t + '</button>';
      }).join('') + '</div></div>';
    h += '<div class="field"><label>考试日</label><input id="exam" type="date" value="' + S.set.exam + '"></div>';
    h += '<button class="btn sm" data-act="saveexam">保存考试日</button>';
    h += '<div class="hr"></div>';
    h += '<div class="btns"><button class="btn sm" data-act="export">导出备份</button><button class="btn sm" data-act="import">导入备份</button><button class="btn sm danger" data-act="reset">清空进度</button></div>';
    h += '<div class="note" style="margin-top:12px">数据存在本机浏览器里。换手机、清缓存前先导出一份 JSON。放在 GitHub Pages 上也能用，进度不跟账号走。</div>';
    h += '</div>';

    h += '<div class="sec-t"><h2>关于</h2></div><div class="panel pad"><div class="note">' +
      '题库按《考研英语大作文 · 专属精选背诵模板》为主，逐条对照《1.27 考研英语大作文模板（英一英二通用）》补齐。' +
      '六大方面 132 条与主模板一致，星档照精选。' +
      '<button class="tag" style="margin-left:6px" data-act="go" data-arg="#/check">看核对说明</button></div></div>';
    h += '</div>';
    return h;
  }

  function vCheck() {
    var cnt = {};
    allCards().forEach(function (c) {
      var g = groupById(c.g);
      cnt[g.sec] = cnt[g.sec] || {};
      cnt[g.sec][c.sr] = (cnt[g.sec][c.sr] || 0) + 1;
    });
    var total = allCards().length;
    var mainFill = allCards().filter(function (c) { return c.sr === '主补'; }).length;
    var h = hd('核对说明', '精选 与 主模板', '');
    h += '<div class="wrap">';
    h += '<div class="panel pad"><div class="note">' +
      '<b>题库共 ' + total + ' 张。</b>其中 ' + (total - mainFill) + ' 张来自精选，' + mainFill + ' 张是精选没有、从主模板逐条补进来的（卡面右下角标「主模板补充」）。' +
      '</div></div>';

    h += '<div class="sec-t"><h2>一、六大方面</h2><span>逐条核过</span></div>';
    h += '<div class="panel pad"><div class="note">' +
      '社会 26 条、个人 39 条、自然 17 条、文化 20 条、交流 18 条、科技 12 条，合计 <b>132</b> 条，与主模板 p45–49 的六大方面表逐条比对，<b>没有缺漏</b>。' +
      '差别只有两处：<br>' +
      '① 主模板把每组拆成「核心 / 方式 / 目标」四个维度，精选改成按 ★★★、✓、★、— 分档。程序里两个都留了：卡面角标是维度（如「目标·和谐」），排序和筛选按星档。<br>' +
      '② 精选多给了一条背诵顺序（先 ✓ 和 ★★★，再 ★，— 临场挑），程序把它做成了「只看第一档 / 含第二档」的筛选。' +
      '</div></div>';

    h += '<div class="sec-t"><h2>二、精选漏掉、已补进来的</h2><span>全部来自主模板</span></div>';
    h += '<div class="panel pad"><div class="note">' +
      '这些不是精选写错，而是它压得太狠，把「主背之外还有哪些说法」整段省了。默写卡住时，翻这些比翻 PDF 快。<br><br>' +
      '<b>1. 图表词汇（主模板 p8–11）</b>：精选只留了一行，缺 increase 组里的 expand、减少组里的 diminish、持平组里的 stand at、波动组里的 vary；迅速缺 markedly / notably，缓慢缺 modestly / a modest rise；峰值缺 hit a record high，谷值缺 fall to a low，约数缺 just over / just under；整段缺「倍数与比较」、「排序」里的 the largest share、「图表呈现」两种开头、「趋势名词短语」。<br><br>' +
      '<b>2. 图表第一段总起句（p12–18）</b>：缺趋势作宾语（主题词 saw a steady rise…）、状语式（According to the data given in the chart…）、divergent + with、3D 里的 disparity、双图表的 As for 写法、万能场景六句里的四句。<br><br>' +
      '<b>3. 社会现象过渡句（p26–29）</b>：缺 Despite its apparent simplicity…、The chart clearly communicates its intended meaning…，以及方案 5 那句万能话。<br><br>' +
      '<b>4. 第二段（p33–42）</b>：缺原因过渡的逐词替换（many / reason / explain / idea 四组共 19 个词）与两句待选；连接词只留一组，主模板另有四组；例证短语只留 6 个，主模板是 15 个（be interested in、place a high priority on、place a high value on、value…highly、dedicate oneself to、be occupied with、be tired of、be bored with 等都缺）；从句开头只留 2 句，主模板是 13 句（主语从句 4、宾语从句 5、同位语从句 4）；常用短语缺 pivotal / fundamental / central role、lay the foundation of、is a driving force behind、is the cornerstone of、act as a catalyst for、bring advantages、constitute a significant menace to、is inextricably linked to。<br><br>' +
      '<b>5. 第三段（p61–70）</b>：缺总结段开头五个替换（To sum up / In general / Generally speaking / On the whole）；措施缺媒体呼吁、家庭教育两句与 «It is our duty to / We are obliged to» 一组；缺措施方案 2 的第二种写法（On the surface…）；畅想缺两句（If these proposed measures are implemented… / There is no better time than now…）；趋势预测缺三句。<br><br>' +
      '<b>6. 图画第一段（p71–83）</b>：缺图画引入里的 portrayed / depicted 等 9 个 shown 同族、5 个副词、picture 的 4 个同族，以及两句待选引入；缺 as well as 形容词 13 组里的 active、aspiring、passionate、ugly、terrible 五组；主题阐述缺 is to / purpose / remind / us 四组替换表；中心思想缺 important 的 5 个同族与 problem 的 7 个同族。<br><br>' +
      '<b>7. 争议话题（p58–59）</b>：缺 In fact, this issue remains controversial 与 When it comes to…, opinions vary widely 两句过渡。' +
      '</div></div>';

    h += '<div class="sec-t"><h2>三、没有放进来的</h2><span>怕占你时间</span></div>';
    h += '<div class="panel pad"><div class="note">' +
      '① 精选第八部分的 9 篇真题范文：那是用来对照的成品，不是背诵单位，塞进复习队列会稀释主背句。<br>' +
      '② 主模板的历年真题「社会现象汇总」「图画中心思想汇总」：写在卡片提示里了，没单独做卡。<br>' +
      '③ 小作文：不在这次范围。<br>' +
      '④ 精选第七部分的练习顺序与交卷自查：放在下面的「用法」里，当作流程说明。' +
      '</div></div>';

    h += '<div class="sec-t"><h2>四、怎么用这套程序</h2></div>';
    h += '<div class="panel pad"><div class="note">' +
      '<b>顺序</b>：六大方面第一档（社会 + 个人）→ 通用第二段 → 通用第三段 → 图表第一段 → 一页纸速查 → 图画 / 文字第一段 → 六大方面第二档 → 图表词汇与替换词。<br>' +
      '<b>每天</b>：先把「今日任务」清空（到期复习 + 25 张新卡），再补 10 分钟默写测试。<br>' +
      '<b>判分</b>：想不起来就点「不认识」，别手软；犹豫 3 秒以上算「模糊」。系统按 1 / 2 / 4 / 7 / 15 / 30 天往后排，忘了的卡当天插回队尾。<br>' +
      '<b>自检</b>：考前两周每天用「一页纸速查」整段默写一遍，覆盖率低于 80% 的那段，回去重背对应段落。<br>' +
      '<b>自己加</b>：练习时碰到的生词、换过的主题词，都加到「我的词条」，它会进同一个复习队列。' +
      '</div></div>';
    h += '</div>';
    return h;
  }

  function secName(s) {
    return { 1: '六大方面', 2: '模板句', 3: '图表词汇', 4: '替换升级', 5: '一页纸' }[s] || '全部';
  }

  /* ---------------- 路由 ---------------- */
  function render() {
    var hash = location.hash || '#/';
    var parts = hash.split('/');
    if (parts[1] !== 's' && SES) SES = null;
    var body = '';
    var nav = '';
    if (hash === '#/' || hash === '') body = vHome();
    else if (hash === '#/lib') body = vLib();
    else if (parts[1] === 'g' && parts[2]) body = vGroup(parts[2]);
    else if (parts[1] === 'c' && parts[2]) body = vCard(parts[2]);
    else if (parts[1] === 's') body = vSession();
    else if (hash === '#/test') body = vTest();
    else if (hash === '#/mine') body = vMine();
    else if (hash === '#/check') body = vCheck();
    else body = vHome();

    var inSession = (parts[1] === 's' && SES && SES.i < SES.q.length);
    if (!inSession) {
      nav = '<div class="nav">' +
        '<a href="#/" class="' + (hash === '#/' ? 'on' : '') + '"><b>今日</b></a>' +
        '<a href="#/lib" class="' + (hash === '#/lib' || parts[1] === 'g' || parts[1] === 'c' ? 'on' : '') + '"><b>词库</b></a>' +
        '<a href="#/test" class="' + (hash === '#/test' ? 'on' : '') + '"><b>测试</b></a>' +
        '<a href="#/mine" class="' + (hash === '#/mine' || hash === '#/check' ? 'on' : '') + '"><b>我的</b></a>' +
        '</div>';
    }
    app.innerHTML = body + nav;
    window.scrollTo(0, 0);
    if (inSession) {
      var ta = document.getElementById('inp');
      if (ta && SES.inp) ta.value = SES.inp;
    }
  }

  /* ---------------- 动作 ---------------- */
  var ACTS = {
    go: function (a) { location.hash = a; },
    daily: function () { startDaily(); },
    open: function (a) {
      var v = parseInt(a, 10);
      UI.open = (UI.open === v) ? 0 : v;
      render();
    },
    tier: function (a) {
      var p = a.split(':'); UI['t_' + p[0]] = parseInt(p[1], 10); render();
    },
    study: function (a) {
      var p = a.split(':');
      startGroup(p[0], parseInt(p[1], 10) || 0);
    },
    testg: function (a) {
      var p = a.split(':');
      startTest({ g: p[0], mode: 'write', n: 20, tier: parseInt(p[1], 10) || 0 });
    },
    studycard: function (a) {
      var c = byId(a); if (!c) return;
      beginSession([c], { label: '单张', force: null });
    },
    reveal: function () { SES.rev = true; render(); },
    dir: function (a) {
      if (!SES || (a !== 'zh2en' && a !== 'en2zh')) return;
      if (SES.dir === a) return;
      SES.dir = a;
      resetCardUI();
      render();
    },
    hint: function () {
      var c = SES.q[SES.i];
      var first = c.en.split(' ').slice(0, 2).join(' ');
      toast('开头是 “' + first + '…”　共 ' + wordCount(c.en) + ' 词');
    },
    submit: function () {
      var c = SES.q[SES.i];
      var ta = document.getElementById('inp');
      SES.inp = ta ? ta.value : '';
      if (!SES.inp.trim()) { toast('先写点东西'); return; }
      var best = 0, bm = null, bv = '';
      var variants = [c.en].concat(c.alts && c.alts.length ? c.alts : []);
      variants.forEach(function (v) {
        var r = diff(SES.inp, v);
        if (r.ratio > best) { best = r.ratio; bm = r.mark; bv = v; }
      });
      SES.res = { best: best, mark: bm, ref: bv };
      render();
    },
    pick: function (a) {
      SES.sel = parseInt(a, 10);
      render();
    },
    grade: function (a) { applyGrade(parseInt(a, 10)); },
    quit: function () {
      if (SES && SES.i > 0 && SES.i < SES.q.length) {
        if (!confirm('退出本轮？已作答的会保留。')) return;
      }
      SES = null; location.hash = '#/';
    },
    again: function () {
      var ids = {};
      SES.q.forEach(function (c) { if (lvOf(c.id) <= 2) ids[c.id] = 1; });
      var wrong = allCards().filter(function (c) { return ids[c.id]; });
      if (!wrong.length) { toast('本轮没有需要重来的'); SES = null; location.hash = '#/'; return; }
      beginSession(wrong.slice(0, 40), { label: '重来', dir: SES.dir });
    },
    tsec: function (a) { T.sec = parseInt(a, 10); render(); },
    tmode: function (a) { T.mode = a; render(); },
    tn: function (a) { T.n = parseInt(a, 10); render(); },
    testrun: function () {
      startTest({ sec: T.sec === 6 ? 0 : T.sec, g: T.sec === 6 ? 'p6_page' : null, mode: T.mode, n: T.n });
    },
    setn: function (a) { S.set.newPerDay = parseInt(a, 10); save(); render(); },
    setmode: function (a) { S.set.mode = a; save(); render(); },
    saveexam: function () {
      var v = document.getElementById('exam').value;
      if (!v) return;
      S.set.exam = v; save(); toast('已保存：' + v); render();
    },
    addcustom: function () {
      var en = document.getElementById('c-en').value.trim();
      var zh = document.getElementById('c-zh').value.trim();
      var tip = document.getElementById('c-tip').value.trim();
      if (!en || !zh) { toast('英文和中文都要填'); return; }
      S.custom.push({ id: 'u' + Date.now(), en: en, zh: zh, tip: tip });
      save(); toast('已加入，下次进队列'); render();
    },
    delcustom: function (a) {
      S.custom = S.custom.filter(function (x) { return x.id !== a; });
      if (S.c[a]) delete S.c[a];
      save(); render();
    },
    export: function () {
      var blob = new Blob([JSON.stringify(S)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '大作文背诵进度-' + todayStr() + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
    },
    import: function () {
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = function () {
        var f = inp.files[0]; if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          try {
            var o = JSON.parse(fr.result);
            if (!o || o.v !== 1) throw 0;
            S = o; save(); toast('导入成功'); location.hash = '#/'; render();
          } catch (e) { toast('文件读不懂'); }
        };
        fr.readAsText(f);
      };
      inp.click();
    },
    reset: function () {
      if (!confirm('清空全部进度？备份过再点。')) return;
      S = defaults(); save(); toast('已清空'); location.hash = '#/'; render();
    }
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var fn = ACTS[el.getAttribute('data-act')];
    if (fn) { e.preventDefault(); fn(el.getAttribute('data-arg') || '', el, e); }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'inp' && SES) SES.inp = e.target.value;
  });

  document.addEventListener('keydown', function (e) {
    if (!SES || location.hash !== '#/s') return;
    if (e.key === 'Escape') { ACTS.quit(); return; }
    if (SES.i >= SES.q.length) return;
    var m = modeOf(SES.q[SES.i]);
    if (e.code === 'Space') {
      e.preventDefault();
      if ((m === 'en2zh' || m === 'zh2en') && !SES.rev) ACTS.reveal();
      return;
    }
    if (SES.rev || SES.res || (m === 'mc' && SES.sel >= 0)) {
      if (e.key === '1') applyGrade(0);
      else if (e.key === '2') applyGrade(1);
      else if (e.key === '3') applyGrade(2);
    }
  });

  /* mc 模式需要为当前卡生成干扰项 */
  var _render = render;
  render = function () {
    if (SES && SES.i < SES.q.length) {
      var c = SES.q[SES.i];
      if (modeOf(c) === 'mc' && !SES.opts) {
        var g = groupById(c.g);
        var pool = cardsOf(c.g).filter(function (x) { return x.id !== c.id; });
        if (pool.length < 3) pool = allCards().filter(function (x) { return x.id !== c.id && groupById(x.g).sec === g.sec; });
        var opts = [c.zh];
        var guard = 0;
        while (opts.length < 4 && guard++ < 60) {
          var cand = pool[Math.floor(Math.random() * pool.length)];
          if (cand && opts.indexOf(cand.zh) < 0) opts.push(cand.zh);
        }
        while (opts.length < 4) opts.push('（其他选项不足，跳过即可）');
        // 打乱
        for (var i = opts.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = opts[i]; opts[i] = opts[j]; opts[j] = t;
        }
        SES.opts = opts;
        SES.correct = opts.indexOf(c.zh);
      }
    }
    _render();
  };

  window.addEventListener('hashchange', render);

  /* 首次进入：给个指引 */
  if (!location.hash) location.hash = '#/';
  render();
})();
