/* 背卡辅助：读音 / 自动朗读 / 勾出句子骨架
   只动显示层（背卡会话 #/s、单卡页 #/c/…），不改程序的数据与排期
   设置存自己的存档键 ky_zw_read = {v:1, auto:0, skel:1} */
(function () {
  'use strict';
  var RK = 'ky_zw_read', lastQ = '', lastA = '';

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(RK) || '{}');
      if (!o || o.v !== 1) return { v: 1, auto: 0, skel: 1, rate: 0.92 };
      if (typeof o.auto !== 'number') o.auto = 0;
      if (typeof o.skel !== 'number') o.skel = 1;
      if (typeof o.rate !== 'number') o.rate = 0.92;
      return o;
    } catch (e) { return { v: 1, auto: 0, skel: 1, rate: 0.92 }; }
  }
  function save(o) {
    o.v = 1;
    try { localStorage.setItem(RK, JSON.stringify(o)); } catch (e) { }
  }

  /* ---- 读音 ---- */
  function speechText(s) {
    /* 占位词（主题词 / 年份）不念中文，统一读成 X，句子听着才顺 */
    return String(s || '').replace(/[\u4e00-\u9fff][\u4e00-\u9fff·、，]*/g, ' X ').replace(/[\u00b7]/g, ' ')
      .replace(/\s+/g, ' ').replace(/\s*X\s*(X\s*)+/g, ' X ').trim();
  }
  function canSpeak() { return !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function'; }
  function speak(txt, rate) {
    if (!canSpeak() || !txt) return false;
    var s = speechText(txt);
    if (!/[A-Za-z]/.test(s)) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(s);
      u.lang = 'en-US';
      u.rate = rate || 0.92;
      u.pitch = 1;
      var vs = window.speechSynthesis.getVoices() || [], v = null, i;
      for (i = 0; i < vs.length; i++) {
        if (/^en(-|_)?(US|GB|AU)?/i.test(vs[i].lang || vs[i].language || '')) { v = vs[i]; break; }
      }
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  /* ---- 骨架词 ---- */
  var WORDS = ['as a result', 'in addition', 'on the contrary', 'in contrast', 'for example', 'for instance',
    'in conclusion', 'to sum up', 'in short', 'in particular', 'compared with', 'rather than', 'instead of',
    'due to', 'thanks to', 'in terms of', 'not only', 'but also', 'the more', 'the less', 'at the same time',
    'however', 'therefore', 'thus', 'hence', 'moreover', 'furthermore', 'besides', 'consequently', 'meanwhile',
    'nevertheless', 'whereas', 'although', 'overall', 'illustrates', 'illustrate', 'shows', 'show', 'demonstrates',
    'demonstrate', 'indicates', 'indicate', 'reveals', 'reveal', 'suggests', 'suggest', 'reflects', 'reflect',
    'accounts for', 'constitutes', 'constitute', 'witnessed', 'experienced', 'saw', 'rose', 'rise', 'fell', 'fall',
    'increased', 'increase', 'decreased', 'decrease', 'remained', 'remain', 'fluctuated', 'fluctuate', 'grew', 'grow',
    'dropped', 'drop', 'climbed', 'climb', 'surged', 'surge', 'declined', 'decline', 'doubled', 'tripled'];
  var RE = new RegExp('(' + WORDS.map(function (w) {
    return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
  }).join('|') + ')', 'gi');

  function isLetter(c) { return c ? /[A-Za-z]/.test(c) : false; }
  function highlight(el) {
    var nodes = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false), n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (n.parentNode && n.parentNode.closest && n.parentNode.closest('.zd-cl,.ph')) continue;
      nodes.push(n);
    }
    nodes.forEach(function (node) {
      var s = node.nodeValue, out = '', i = 0, m;
      RE.lastIndex = 0;
      while ((m = RE.exec(s))) {
        var st = m.index, ed = st + m[0].length;
        var pre = st > 0 ? s.charAt(st - 1) : '', post = ed < s.length ? s.charAt(ed) : '';
        var multi = /\s/.test(m[0]);
        if (!multi && (isLetter(pre) || isLetter(post))) continue;
        out += s.slice(i, st) + '[[[' + s.slice(st, ed) + ']]]';
        i = ed;
        if (i >= s.length) break;
      }
      if (!out) return;
      out += s.slice(i);
      var frag = document.createDocumentFragment(), parts = out.split(/\[\[\[|\]\]\]/), k;
      for (k = 0; k < parts.length; k++) {
        if (!parts[k]) continue;
        if (k % 2 === 1) {
          var sp = document.createElement('span');
          sp.className = 'zd-cl';
          sp.textContent = parts[k];
          frag.appendChild(sp);
        } else {
          frag.appendChild(document.createTextNode(parts[k]));
        }
      }
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---- 读音按钮 ---- */
  function addBtn(el) {
    var nx = el.nextElementSibling;
    if (nx && nx.getAttribute('data-zspk') === '1') { nx.setAttribute('data-src', el.textContent); return nx; }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'zspk';
    b.setAttribute('data-zspk', '1');
    b.textContent = '读音';
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      if (!canSpeak()) { b.textContent = '这台手机不支持读音'; return; }
      var host = b.previousElementSibling;
      var ok = speak(host ? host.textContent : '', load().rate);
      b.textContent = ok ? '再读一遍' : '读不了';
      setTimeout(function () { b.textContent = '读音'; }, 1800);
    });
    if (el.parentNode) el.parentNode.insertBefore(b, el.nextSibling);
    return b;
  }

  /* ---- 设置 ---- */
  var CSS = '.zspk{display:inline-block;margin-top:7px;margin-bottom:2px;padding:0 9px;height:23px;line-height:21px;' +
    'border:1px solid #e2dcd2;border-radius:5px;background:#fbf8f1;color:#857a6c;font-size:11.5px;font-family:inherit;letter-spacing:.01em}' +
    '.zspk:active{background:#f1eae0}' +
    '.zd-cl{color:#8c2f24}' +
    '.zsr{display:flex;gap:8px;align-items:center;margin-top:9px;flex-wrap:wrap}' +
    '.zsr>span{font-size:12.5px;color:#6f655b}' +
    '.zsr input[type=range]{accent-color:#2b2320;background:none;border:none;padding:0;height:20px}' +
    '.zsr input[type=range]{flex:1;min-width:90px}' +
    '.zsr .zsrate{font-size:12px;color:#8d8272;min-width:46px;text-align:right}' +
    '.zsnote{font-size:12px;color:#8d8272;margin-top:6px;line-height:1.6}';
  function styleOnce() {
    if (document.getElementById('zsstyle')) return;
    var st = document.createElement('style');
    st.id = 'zsstyle'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function fieldHtml() {
    var o = load();
    return '<div class="chips">' +
      '<button class="tag ' + (o.auto ? '' : 'on') + '" data-zr="auto0">要读了才读</button>' +
      '<button class="tag ' + (o.auto ? 'on' : '') + '" data-zr="auto1">自动读一遍</button>' +
      '</div>' +
      '<div class="chips" style="margin-top:8px">' +
      '<button class="tag ' + (o.skel ? 'on' : '') + '" data-zr="skel1">勾出骨架</button>' +
      '<button class="tag ' + (o.skel ? '' : 'on') + '" data-zr="skel0">不勾</button>' +
      '</div>' +
      '<div class="zsr"><span>语速</span><input id="zsRate" type="range" min="60" max="120" step="1" value="' + Math.round((o.rate || 0.92) * 100) + '"><span class="zsrate">' + (o.rate || 0.92).toFixed(2) + '</span></div>' +
      '<div class="zsnote">读音用手机自带的英文朗读，不联网、不占流量；离线单文件也能用。骨架把连接词、表示升降的词勾成暗红，长句先看框架再背细节。</div>';
  }
  function refreshField(f) {
    f.innerHTML = '';
    var lab = document.createElement('label');
    lab.textContent = '背卡读音与骨架';
    f.appendChild(lab);
    var tmp = document.createElement('div');
    tmp.innerHTML = fieldHtml();
    while (tmp.firstChild) f.appendChild(tmp.firstChild);
    bindField(f);
  }
  function bindField(f) {
    f.onclick = function (e) {
      var b = e.target.closest('[data-zr]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var v = b.getAttribute('data-zr'), o = load();
      if (v === 'auto0') o.auto = 0;
      else if (v === 'auto1') o.auto = 1;
      else if (v === 'skel1') o.skel = 1;
      else if (v === 'skel0') o.skel = 0;
      save(o);
      refreshField(f);
      run(true);
    };
    f.oninput = function (e) {
      if (!e.target || e.target.id !== 'zsRate') return;
      var o = load();
      o.rate = parseInt(e.target.value, 10) / 100;
      save(o);
      var lab = f.querySelector('.zsrate');
      if (lab) lab.textContent = o.rate.toFixed(2);
    };
  }
  function mountField() {
    if (location.hash !== '#/mine') return;
    var wrap = document.querySelector('#app .wrap');
    if (!wrap || wrap.querySelector('#zsread')) return;
    styleOnce();
    var f = document.createElement('div');
    f.className = 'field'; f.id = 'zsread';
    refreshField(f);
    var anchor = wrap.querySelector('#clockgoal');
    if (!anchor) {
      var fields = wrap.querySelectorAll('.field');
      for (var i = 0; i < fields.length; i++) {
        var lab = fields[i].querySelector('label');
        if (lab && lab.textContent.indexOf('每日新卡上限') >= 0) { anchor = fields[i]; break; }
      }
    }
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(f, anchor.nextSibling);
    else wrap.appendChild(f);
  }

  /* ---- 主流程 ---- */
  function onPage() {
    var h = location.hash || '';
    return h === '#/s' || h.indexOf('#/c/') === 0;
  }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function run(force) {
    if (!onPage()) return;
    var o = load(), els = document.querySelectorAll('#app .q-en, #app .ce'), i, el;
    var ptxt = txt(document.querySelector('#app .ses-inner > .q-en'));
    for (i = 0; i < els.length; i++) {
      el = els[i];
      if (el.getAttribute('data-zs') === txt(el)) continue;
      el.setAttribute('data-zs', txt(el));
      /* 答案区那一行英文跟题面一模一样时不再挂按钮，一颗就够 */
      if (ptxt && txt(el) === ptxt && el.parentNode && el.parentNode.className === 'ans') {
        var nb = el.nextElementSibling;
        if (nb && nb.getAttribute('data-zspk') === '1') nb.parentNode.removeChild(nb);
        continue;
      }
      if (o.skel && !/^[\u4e00-\u9fff]/.test(txt(el))) highlight(el);
      if (/[A-Za-z]/.test(txt(el))) addBtn(el);
    }
    if (!o.auto) return;
    var q = document.querySelector('#app .ses-inner > .q-en') ||
      (location.hash.indexOf('#/c/') === 0 ? document.querySelector('#app .q-en') : null);
    var a = document.querySelector('#app .ans .q-en');
    var qt = txt(q), at = txt(a);
    if (qt && qt !== lastQ) { lastQ = qt; if (/[A-Za-z]/.test(qt)) setTimeout(function () { speak(qt, o.rate); }, 240); }
    if (at && at !== lastA && at !== qt) { lastA = at; if (/[A-Za-z]/.test(at)) setTimeout(function () { speak(at, o.rate); }, 320); }
  }
  var pending = false;
  function kick() {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; run(); }, 180);
  }
  function watch() {
    try {
      new MutationObserver(function () { kick(); mountField(); }).observe(document.body, { childList: true, subtree: true });
    } catch (e) { }
    styleOnce(); run(); mountField();
    window.addEventListener('hashchange', function () { lastQ = ''; lastA = ''; setTimeout(function () { run(); mountField(); }, 260); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
