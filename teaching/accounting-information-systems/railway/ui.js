/* Rails & Ledgers — game interface */
(function () {
  'use strict';
  var E = window.RLEcon, map = window.RLMap.generate(1896);
  var SAVE = 'rails-ledgers-save-v1';
  var MONTH = 2.0; // seconds per month at 1x
  var $ = function (s) { return document.querySelector(s); };
  var cv = $('#map'), mini = $('#mini'), panel = $('#panel'), modal = $('#modal'), sheet = $('#sheet');
  var R = new window.RLRender(cv, map, E);
  var S = E.newGame(map), tf = E.traffic(S, map);
  var tool = 'inspect', speed = 1, acc = 0, last = performance.now(), modalOpen = false;
  var selected = null, pinned = null, hoverKey = '', agm = null, objHidden = false, panelDirty = true, seenBuildTip = false;

  function L(n) { return (n < -0.5 ? '\u2212£' : '£') + E.fmt(Math.abs(n)); }
  function pct(x, d) { return (x * 100).toFixed(d == null ? 0 : d) + '%'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function miles(t) { return Math.round(t * 10); }
  var KIND = { town: 'Town', gold: 'Goldfield', coal: 'Colliery', farm: 'Farming district', copper: 'Copper mines', junction: 'Railway interchange', port: 'Port' };

  /* ---------------- loop ---------------- */
  function resize() { R.resize(); }
  window.addEventListener('resize', resize);
  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    var running = speed > 0 && !modalOpen && !S.gameOver;
    if (running) { acc += dt * speed; if (acc >= MONTH) { acc -= MONTH; tick(); } }
    R.step(dt, speed || 0, running);
    var lab = null;
    if (R.ghost) lab = L(R.ghost.cost) + ' · ' + miles(R.ghost.tiles) + ' miles · ' + R.ghost.months + ' mo';
    R.draw(S, { building: tool === 'build', ghostLabel: lab });
    R.drawMini(mini, S);
    hud();
    if (panelDirty && !panel.contains(document.activeElement)) { renderPanel(); panelDirty = false; }
    requestAnimationFrame(frame);
  }
  function tick() {
    var opened = S.news.length ? S.news[0] : null;
    E.monthTick(S, map);
    tf = E.traffic(S, map); R.syncTrains(S, tf);
    // toasts for openings
    for (var i = 0; i < Math.min(4, S.news.length); i++) { var n = S.news[i]; if (n === opened) break; if (/^Line opened/.test(n.t)) toast(n.t); if (n.k === 'bad') toast(n.t, true); }
    ticker(); panelDirty = true; objectives();
    if (S.gameOver && S.gameOver.reason === 'receivership') { showEnd(); return; }
    if (S.pending && S.pending.length) { showEvent(S.pending.shift()); return; }
    if (agmDue()) startAGM();
  }
  function agmDue() { return S.m % 12 === 0 && S.m > 0 && S.lastAGM !== E.year(S) - 1 && !S.gameOver; }

  /* ---------------- HUD ---------------- */
  var spark = $('#spark').getContext('2d');
  function meter(el, v) { el.style.width = Math.max(0, Math.min(100, v)) + '%'; el.className = v < 45 ? 'bad' : v < 65 ? 'warn' : ''; }
  function hud() {
    $('#hDate').textContent = S.gameOver ? S.gameOver.d : E.dateStr(S);
    var c = $('#hCash'); c.textContent = (S.cash < 0 ? 'Overdrawn ' : '') + L(Math.abs(S.cash)); c.style.color = S.cash < 0 ? '#ff9a7a' : '';
    $('#hPrice').textContent = E.priceStr(S.price);
    meter($('#hTrust'), S.trust); meter($('#hTrack'), S.trackCond); meter($('#hStock'), S.stockCond);
    var h = S.priceHist.concat([S.price]), mx = Math.max.apply(null, h.concat([1.2])), mn = Math.min.apply(null, h.concat([0.8]));
    spark.clearRect(0, 0, 90, 26);
    var y1 = 24 - (1 - mn) / (mx - mn) * 22; spark.strokeStyle = 'rgba(255,255,255,.25)'; spark.setLineDash([2, 2]); spark.beginPath(); spark.moveTo(0, y1); spark.lineTo(90, y1); spark.stroke(); spark.setLineDash([]);
    spark.strokeStyle = '#e6c878'; spark.lineWidth = 1.5; spark.beginPath();
    h.forEach(function (v, i) { var x = i / Math.max(1, h.length - 1) * 88 + 1, y = 24 - (v - mn) / (mx - mn) * 22; if (i) spark.lineTo(x, y); else spark.moveTo(x, y); });
    spark.stroke();
  }
  function ticker() {
    var items = S.news.slice(0, 8).map(function (n) { return '<span><i>' + esc(n.d) + '</i> &mdash; ' + esc(n.t) + '</span>'; }).join('');
    var t = $('#ticker'); if (t.dataset.k !== S.news.length + '' + (S.news[0] && S.news[0].t)) { t.innerHTML = items; t.dataset.k = S.news.length + '' + (S.news[0] && S.news[0].t); }
  }
  var toastT;
  function toast(msg, bad) { var t = $('#toast'); t.textContent = msg; t.className = 'toast' + (bad ? ' bad' : ''); t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, bad ? 6000 : 3800); }

  document.querySelectorAll('.speed button').forEach(function (b) { b.onclick = function () { setSpeed(+b.dataset.speed); }; });
  function setSpeed(s) { speed = s; document.querySelectorAll('.speed button').forEach(function (b) { b.classList.toggle('on', +b.dataset.speed === s); }); }

  /* ---------------- objectives ---------------- */
  function objectives() {
    var el = $('#obj'); if (objHidden) { el.hidden = true; return; } el.hidden = false;
    var o = S.objectives, y = E.year(S), list;
    if (!(o.gold && o.loco2 && o.agm)) {
      list = [['Build a line from Port Lindsay to the Mount Hollis Goldfield', o.gold], ['Buy at least two locomotives', S.trains >= 2], ['Reach the first general meeting in December 1896', o.agm]];
    } else {
      list = [['Connect Blackrock Colliery (opens 1900)', !!S.stations.coal], ['Reach the Southern Lines interchange (opens 1902)', !!S.stations.west], ['Keep the permanent way above 70%', S.trackCond >= 70], ['Pay a dividend every year from 1900', S.divPaidYears >= Math.max(0, y - 1900)], ['Reach the Northern Copperfield (opens 1925)', !!S.stations.copper]];
    }
    el.innerHTML = '<button class="x" title="Hide" data-a="hideobj">&times;</button><h4>' + (o.gold && o.loco2 && o.agm ? 'The Board’s objectives' : 'First steps') + '</h4><ol>' + list.map(function (x) { return '<li class="' + (x[1] ? 'done' : '') + '">' + x[0] + '</li>'; }).join('') + '</ol>';
  }

  /* ---------------- map input ---------------- */
  var drag = null;
  cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, cx: R.camX, cy: R.camY, moved: false, btn: e.button }; });
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(), sx = e.clientX - r.left, sy = e.clientY - r.top;
    if (drag) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
      if (drag.moved) { cv.classList.add('drag'); R.camX = drag.cx - dx / R.zoom; R.camY = drag.cy - dy / R.zoom; R.clampCam(); return; }
    }
    var t = R.pick(sx, sy); R.hover = t;
    if (tool === 'build' && !pinned) {
      var k = t ? t.c + ',' + t.r : '';
      if (k !== hoverKey) { hoverKey = k; R.ghost = t ? E.planRoute(S, map, t.c, t.r) : null; }
    }
  });
  cv.addEventListener('pointerup', function (e) {
    cv.classList.remove('drag');
    var d = drag; drag = null;
    if (!d || d.moved || d.btn !== 0) return;
    var r = cv.getBoundingClientRect(), t = R.pick(e.clientX - r.left, e.clientY - r.top);
    clickTile(t);
  });
  cv.addEventListener('pointerleave', function () { R.hover = null; if (tool === 'build' && !pinned) { R.ghost = null; hoverKey = ''; } });
  cv.addEventListener('wheel', function (e) { e.preventDefault(); var r = cv.getBoundingClientRect(); R.zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  $('#zIn').onclick = function () { R.zoomAt(1.2, cv.clientWidth / 2, cv.clientHeight / 2); };
  $('#zOut').onclick = function () { R.zoomAt(1 / 1.2, cv.clientWidth / 2, cv.clientHeight / 2); };
  mini.addEventListener('pointerdown', function (e) {
    var r = mini.getBoundingClientRect(), k = mini.width / r.width;
    var w = R.miniToWorld(mini, (e.clientX - r.left) * k, (e.clientY - r.top) * k);
    R.camX = w.x - cv.clientWidth / R.zoom / 2; R.camY = w.y - cv.clientHeight / R.zoom / 2; R.clampCam();
  });
  window.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (modalOpen) return;
    var step = 60 / R.zoom;
    if (e.key === 'ArrowLeft') R.camX -= step; else if (e.key === 'ArrowRight') R.camX += step; else if (e.key === 'ArrowUp') R.camY -= step; else if (e.key === 'ArrowDown') R.camY += step;
    else if (e.key === ' ') { e.preventDefault(); setSpeed(speed ? 0 : 1); }
    else if (e.key === 'Escape') { cancelPlan(); setTool('inspect'); }
    else if (/^[biflaBIFLA]$/.test(e.key)) setTool({ b: 'build', i: 'inspect', f: 'finance', l: 'loco', a: 'accounts' }[e.key.toLowerCase()]);
    else if (e.key === '+' || e.key === '=') R.zoomAt(1.15, cv.clientWidth / 2, cv.clientHeight / 2);
    else if (e.key === '-') R.zoomAt(1 / 1.15, cv.clientWidth / 2, cv.clientHeight / 2);
    R.clampCam();
  });

  function clickTile(t) {
    if (!t) return;
    if (tool === 'build') {
      var plan = E.planRoute(S, map, t.c, t.r);
      if (!plan) { toast(isFinite(map.cost(t.c, t.r)) ? 'That tile is already on your network.' : 'You cannot build on water.'); return; }
      pinned = plan; R.ghost = plan; panelDirty = true; return;
    }
    selected = t; if (tool !== 'inspect') setTool('inspect'); panelDirty = true;
  }
  function cancelPlan() { pinned = null; R.ghost = null; hoverKey = ''; panelDirty = true; }

  document.querySelectorAll('.tools button').forEach(function (b) { b.onclick = function () { setTool(b.dataset.tool); }; });
  function setTool(t) {
    if (t === 'help') { showHelp(); return; }
    tool = t; if (t !== 'build') cancelPlan();
    document.querySelectorAll('.tools button').forEach(function (b) { b.classList.toggle('on', b.dataset.tool === t); });
    cv.classList.toggle('building', t === 'build');
    if (t === 'build' && !seenBuildTip) { seenBuildTip = true; toast('Hover over the map to see the cheapest route from your network. Click to fix it, then confirm in the panel.'); }
    panelDirty = true;
  }

  /* ---------------- panel ---------------- */
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; act(b.dataset.a, b.dataset.v);
  });
  $('#obj').addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (b) act(b.dataset.a); });
  function act(a, v) {
    if (a === 'hideobj') { objHidden = true; objectives(); return; }
    if (a === 'confirm' && pinned) {
      E.commitRoute(S, map, pinned); toast('Construction gangs are at work. ' + miles(pinned.tiles) + ' miles to lay.'); cancelPlan(); return;
    }
    if (a === 'cancel') { cancelPlan(); return; }
    if (a === 'buildto') { var s = map.source(v); setTool('build'); pinned = E.planRoute(S, map, s.c, s.r); R.ghost = pinned; if (!pinned) toast('Already connected.'); panelDirty = true; return; }
    if (a === 'loco') { E.buyLoco(S); tf = E.traffic(S, map); R.syncTrains(S, tf); panelDirty = true; objectives(); return; }
    if (a === 'shares') { var r = E.issueShares(S, +v); if (!r.ok) toast(r.msg, true); else toast('Shares issued at ' + E.priceStr(r.price) + '.'); panelDirty = true; return; }
    if (a === 'debs') { var r2 = E.issueDebentures(S, +v); if (!r2.ok) toast(r2.msg, true); else toast('Debentures issued.'); panelDirty = true; return; }
    if (a === 'report') { showReport(S.reports[+v], true); return; }
    if (a === 'goto') { var s2 = map.source(v); R.centerOn(s2.c, s2.r); selected = map.tile(s2.c, s2.r); setTool('inspect'); return; }
    if (a === 'deselect') { selected = null; panelDirty = true; return; }
  }
  function renderPanel() {
    var f = { inspect: pInspect, build: pBuild, loco: pLoco, finance: pFinance, accounts: pAccounts, brief: pBrief }[tool] || pInspect;
    panel.innerHTML = f();
  }
  function utilisation() { return tf.capacity > 0 ? tf.demand / tf.capacity : (tf.demand > 0 ? Infinity : 0); }
  function pCompany() {
    var ra = E.revenueAccount(S), st = Object.keys(S.stations).length - 1;
    var h = '<h2>The Company</h2><p class="sub">Status at ' + E.dateStr(S) + '</p>';
    h += '<table class="kv"><tr><td>Route open</td><td>' + miles(E.trackLength(S)) + ' miles</td></tr><tr><td>Stations served</td><td>' + st + '</td></tr><tr><td>Locomotives</td><td>' + S.trains + '</td></tr><tr><td>Traffic carried</td><td>' + (tf.demand ? pct(tf.carried) : '—') + '</td></tr><tr><td>Receipts this year</td><td>' + L(ra.receipts) + '</td></tr><tr><td>Working expenses</td><td>' + L(ra.totalExp) + '</td></tr><tr><td>Operating ratio</td><td>' + (ra.receipts ? pct(ra.opRatio) : '—') + '</td></tr></table>';
    if (S.projects.length) h += projectsHtml();
    if (tf.demand > tf.capacity * 1.02 && S.trains > 0) h += '<div class="warnbox">Traffic is being turned away: demand exceeds the capacity of your rolling stock. Buy more locomotives.</div>';
    if (S.trains === 0 && E.trackLength(S) > 0) h += '<div class="warnbox">You have track but no locomotives. Nothing moves and nothing is earned. Open <b>Rolling stock</b>.</div>';
    h += '<h3>Traffic sources</h3>';
    map.sources.forEach(function (s) {
      if (s.id === 'port') return;
      var on = S.stations[s.id];
      h += '<div class="srcrow"><a href="#" data-a="goto" data-v="' + s.id + '">' + esc(s.name) + '</a><span>' + (on ? '<span class="pill on">connected</span>' : s.from && E.year(S) < s.from ? '<span class="pill">from ' + s.from + '</span>' : '<span class="pill">not served</span>') + '</span>' + (on ? '<small>Receipts this year ' + L(S.yr.bySrc[s.id] || 0) + '</small>' : '') + '</div>';
    });
    h += '<p class="sub" style="margin-top:12px">Click any tile on the map to inspect it.</p>';
    return h;
  }
  function projectsHtml() {
    var h = '<h3>Under construction</h3>';
    S.projects.forEach(function (p) { var f = p.done / p.edges.length; h += '<p style="margin:2px 0">' + p.edges.length + ' sections' + (p.stations.length ? ' to ' + p.stations.map(function (s) { return map.source(s).name; }).join(', ') : '') + '</p><div class="bar"><i style="width:' + Math.round(f * 100) + '%"></i></div>'; });
    return h;
  }
  function pInspect() {
    if (!selected) return pCompany();
    var t = selected, src = t.src && map.source(t.src), terr = map.territory(t.c, t.r);
    var h = '<button class="btn ghost" data-a="deselect" style="float:right;padding:3px 9px">&times;</button>';
    if (src) {
      var u = E.unitsFor(S, src, E.year(S)), on = S.stations[src.id];
      h += '<h2>' + esc(src.name) + '</h2><p class="sub">' + KIND[src.kind] + ' &middot; ' + (terr === 'colony' ? 'The Colony' : 'Northern Protectorate') + '</p><p>' + esc(src.note) + '</p>';
      if (src.id !== 'port') {
        var x = tf.list.filter(function (q) { return q.s.id === src.id; })[0];
        h += '<table class="kv"><tr><td>Traffic potential (units/yr)</td><td>' + E.fmt(u) + '</td></tr><tr><td>Rate per unit per 10 miles</td><td>' + (src.kind === 'town' ? E.P.townRate : E.P.freightRate).toFixed(3).replace(/^0/, '£0') + '</td></tr>';
        if (x) h += '<tr><td>Distance to port by rail</td><td>' + miles(x.td) + ' miles</td></tr><tr><td>Chargeable distance</td><td>' + miles(x.rd) + ' miles</td></tr><tr><td>Potential receipts / yr</td><td>' + L(x.rev) + '</td></tr>';
        h += '<tr><td>Receipts this year</td><td>' + L(S.yr.bySrc[src.id] || 0) + '</td></tr></table>';
        if (!on) h += '<p><button class="btn brass" data-a="buildto" data-v="' + src.id + '">Plan a line to here</button></p>';
        h += '<div class="note"><b>Chargeable distance.</b> Rates are charged on the shortest practicable distance, so a winding line costs you more to work without earning any more.</div>';
      }
    } else {
      h += '<h2>' + map.tname(t) + '</h2><p class="sub">' + (terr === 'colony' ? 'The Colony' : 'Northern Protectorate') + ' &middot; tile ' + t.c + ',' + t.r + '</p>';
      var c = map.cost(t.c, t.r);
      h += '<table class="kv"><tr><td>Construction cost per 10-mile section</td><td>' + (isFinite(c) ? L(c * E.costMult(S)) : 'Impassable') + '</td></tr><tr><td>Elevation</td><td>' + Math.max(0, t.lv) * 500 + ' ft</td></tr></table>';
      if (t.t === map.T.RIVER) h += '<div class="note">River crossings need a bridge, adding about £40,000 per section.</div>';
      if (t.t === map.T.MOUNT) h += '<div class="note">Mountain sections are the dearest to build and the slowest to complete. The escarpment can be avoided by going round the southern end of the ridge.</div>';
    }
    return h;
  }
  function pBuild() {
    var h = '<h2>Build line</h2><p class="sub">Construction is capital expenditure</p>';
    if (!pinned) {
      h += '<p>Hover over the map: the dotted line shows the cheapest route from your existing network (or from Port Lindsay). Click a tile to fix the route.</p><div class="note"><b>Costs per 10-mile section:</b> open veld £22,000; woodland £28,000; swamp £36,000; hills £45,000; mountains £95,000; bridges +£40,000; each station £8,000.</div>';
    } else {
      var p = pinned, after = S.cash - p.cost, lim = -(E.P.odLimit + 0.1 * S.cap.shares);
      h += '<table class="kv"><tr><td>Length</td><td>' + miles(p.tiles) + ' miles</td></tr><tr><td>Bridges</td><td>' + p.bridges + '</td></tr><tr><td>New stations</td><td>' + (p.stations.length ? p.stations.map(function (s) { return map.source(s).name; }).join(', ') : 'none') + '</td></tr><tr><td>Time to build</td><td>about ' + p.months + ' months</td></tr><tr><td><b>Estimated cost</b></td><td>' + L(p.cost) + '</td></tr><tr><td>Cash after completion</td><td style="color:' + (after < 0 ? 'var(--red)' : '') + '">' + L(after) + '</td></tr></table>';
      if (!p.stations.length) h += '<div class="note">This line reaches no traffic source. It earns nothing until extended to a town, mine or interchange.</div>';
      if (after < lim) h += '<div class="warnbox">The company cannot fund this. Raise capital first (Finance) or choose a shorter line.</div>';
      else if (after < 0) h += '<div class="warnbox">This would put the company into overdraft at 7%. If the overdraft passes ' + L(-lim) + ' the bank will call in a receiver.</div>';
      h += '<p><button class="btn brass" data-a="confirm"' + (after < lim ? ' disabled' : '') + '>Confirm construction</button><button class="btn ghost" data-a="cancel">Cancel</button></p>';
      h += '<div class="note"><b>Accounting.</b> As each section is completed its cost is debited to <i>Lines open for traffic</i> in the Capital Account. Under the double-account system it stays there at cost, with no depreciation. Upkeep falls on the Revenue Account through renewals.</div>';
    }
    if (S.projects.length) h += projectsHtml();
    return h;
  }
  function pLoco() {
    var u = utilisation(), c = E.P.locoCost * E.costMult(S);
    var h = '<h2>Rolling stock</h2><p class="sub">Locomotives, carriages and wagons</p>';
    h += '<table class="kv"><tr><td>Train sets in service</td><td>' + S.trains + '</td></tr><tr><td>Traffic offered (unit-miles)</td><td>' + E.fmt(tf.demand * 10) + '</td></tr><tr><td>Capacity (unit-miles)</td><td>' + E.fmt(tf.capacity * 10) + '</td></tr><tr><td>Utilisation</td><td>' + (isFinite(u) ? pct(u) : 'no stock') + '</td></tr><tr><td>Condition</td><td>' + Math.round(S.stockCond) + '%</td></tr></table>';
    h += '<div class="bar"><i style="width:' + Math.min(100, isFinite(u) ? u * 100 : 100) + '%;background:' + (u > 1 ? 'var(--red)' : 'var(--green)') + '"></i></div>';
    if (u > 1.02) h += '<div class="warnbox">Demand exceeds capacity: ' + pct(1 - tf.carried) + ' of traffic is being turned away.</div>';
    h += '<p><button class="btn brass" data-a="loco">Buy locomotive and wagons — ' + L(c) + '</button></p>';
    h += '<div class="note"><b>Capital or revenue?</b> A new train set is an addition to stock and is charged to the Capital Account. Replacing a worn one like-for-like is a renewal, charged to revenue (or to a depreciation fund). Each set adds about ' + L(c * 0.05) + ' a year to the renewals the line needs.</div>';
    h += '<div class="note"><b>Worn stock</b> carries less. Capacity falls as condition falls, and so does track condition once it drops below 60%, because of speed restrictions.</div>';
    return h;
  }
  function pFinance() {
    var c = S.cap, lim = E.debLimit(S), g = E.gearing(S);
    var h = '<h2>Finance</h2><p class="sub">Capital structure and the market</p>';
    h += '<table class="kv"><tr><td>Ordinary shares (£1, fully paid)</td><td>' + L(c.shares) + '</td></tr>' + (c.premium ? '<tr><td>Share premium</td><td>' + L(c.premium) + '</td></tr>' : '') + '<tr><td>Debentures (avg ' + pct(S.debAvgRate || 0.05, 1) + ')</td><td>' + L(c.debs) + '</td></tr>' + (c.gdebs ? '<tr><td>Guaranteed 3½% debentures</td><td>' + L(c.gdebs) + '</td></tr>' : '') + '<tr><td>Gearing (debt / capital)</td><td>' + pct(g) + '</td></tr><tr><td>Share price</td><td>' + E.priceStr(S.price) + '</td></tr><tr><td>Yield investors require</td><td>' + pct(E.requiredYield(S), 1) + '</td></tr><tr><td>Last dividend</td><td>' + pct(S.lastDiv, 1) + '</td></tr></table>';
    h += '<h3>Issue ordinary shares</h3>';
    if (S.price < 1) h += '<div class="warnbox">Shares stand below par at ' + E.priceStr(S.price) + '. A company may not issue shares at a discount (<i>Ooregum Gold Mining Co of India v Roper</i>, 1892). Restore confidence first.</div>';
    else h += '<p>New shares are offered at about 5% below market, ' + E.priceStr(Math.max(1, S.price * 0.95)) + '. Anything above £1 goes to share premium. Issue expenses of 2% are charged to capital.</p><p>' + [100000, 250000, 500000].map(function (n) { return '<button class="btn" data-a="shares" data-v="' + n + '">' + E.fmt(n) + ' shares</button>'; }).join('') + '</p>';
    h += '<h3>Issue debentures at ' + pct(E.debRateNow(S), 1) + '</h3><p>Borrowing powers: debentures may not exceed paid-up share capital. Remaining: <b>' + L(lim) + '</b>.</p>';
    h += '<p>' + [50000, 100000, 250000].map(function (n) { return '<button class="btn" data-a="debs" data-v="' + n + '"' + (lim < 1 ? ' disabled' : '') + '>' + L(Math.min(n, lim || n)) + '</button>'; }).join('') + '</p>';
    h += '<div class="note"><b>Trade-off.</b> Debenture interest must be paid whatever the year brings. Failure means receivership. Shares cost nothing in a bad year, but they dilute holders and need a price above par. Higher gearing raises the yield investors demand.</div>';
    return h;
  }
  function pAccounts() {
    var ra = E.revenueAccount(S), need = E.renewalsNeeded(S) * E.costMult(S);
    var h = '<h2>Accounts</h2><p class="sub">Year to date, ' + E.dateStr(S) + '</p>';
    h += '<table class="kv"><tr><td>Goods and minerals</td><td>' + L(ra.goods) + '</td></tr><tr><td>Passengers and parcels</td><td>' + L(ra.pass) + '</td></tr><tr><td><b>Gross receipts</b></td><td>' + L(ra.receipts) + '</td></tr><tr><td>Maintenance of way (incl. renewals)</td><td>' + L(ra.exp.way) + '</td></tr><tr><td>Locomotive power</td><td>' + L(ra.exp.loco) + '</td></tr><tr><td>Carriage and wagon renewals</td><td>' + L(ra.exp.carriage) + '</td></tr><tr><td>Traffic expenses</td><td>' + L(ra.exp.traffic) + '</td></tr><tr><td>General charges</td><td>' + L(ra.exp.general) + '</td></tr>' + (ra.exp.comp ? '<tr><td>Compensation (accidents)</td><td>' + L(ra.exp.comp) + '</td></tr>' : '') + (ra.exp.dep ? '<tr><td>Depreciation provision</td><td>' + L(ra.exp.dep) + '</td></tr>' : '') + '<tr><td><b>Net receipts</b></td><td>' + L(ra.net) + '</td></tr><tr><td>Debenture and other interest</td><td>' + L(S.yr.interest) + '</td></tr></table>';
    h += '<h3>Renewals</h3><table class="kv"><tr><td>Programme</td><td>' + pct(S.renewPct) + ' of requirement</td></tr><tr><td>Requirement (annual)</td><td>' + L(need) + '</td></tr><tr><td>Accounting method</td><td>' + (S.method === 'depreciation' ? 'Depreciation fund' : 'Renewals charged to revenue') + '</td></tr><tr><td>Depreciation fund balance</td><td>' + L(S.fund) + '</td></tr></table>';
    if (S.reports.length) {
      h += '<h3>Published reports</h3><p>' + S.reports.slice().reverse().map(function (r, i) { return '<button class="btn ghost" style="padding:3px 9px" data-a="report" data-v="' + (S.reports.length - 1 - i) + '">' + r.year + '</button>'; }).join('') + '</p>';
    } else h += '<div class="note">The first accounts will be presented at the general meeting in December 1896.</div>';
    return h;
  }
  function pBrief() {
    var h = '<h2>Objectives</h2><p class="sub">The Board’s instructions</p>';
    h += '<p>Build a profitable railway, pay steady dividends, keep the line safe and the accounts honest, and stay solvent until the final general meeting in December 1930.</p>';
    h += '<h3>How you are judged</h3><table class="kv"><tr><td>Return to an 1896 shareholder</td><td>40 pts</td></tr><tr><td>Clean audit record</td><td>20 pts</td></tr><tr><td>Condition of the property</td><td>20 pts</td></tr><tr><td>Solvency</td><td>10 pts</td></tr><tr><td>Safety record</td><td>10 pts</td></tr></table>';
    h += '<h3>Intelligence</h3><p>Prospectors and the Colonial Office report:</p><ul style="padding-left:18px;font-size:14.5px">';
    h += '<li>Colliery at Blackrock expected to open <b>1900</b>.</li><li>Southern railway system expected at the western border by <b>1902</b>.</li><li>Rumours of copper far to the north-west.</li><li>The Colony is considering an income tax.</li></ul>';
    h += '<div class="note"><b>Tip.</b> The goldfield gives early traffic. Go round the southern end of the escarpment rather than over it, and buy enough locomotives to carry what you reach.</div>';
    return h;
  }

  /* ---------------- modals ---------------- */
  function open(html, cls) { sheet.className = 'sheet' + (cls ? ' ' + cls : ''); sheet.innerHTML = html; modal.hidden = false; modalOpen = true; sheet.scrollTop = 0; }
  function close() { modal.hidden = true; modalOpen = false; panelDirty = true; }
  sheet.addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) modalAct(b.dataset.m, b.dataset.v, b); });
  sheet.addEventListener('input', function (e) { if (e.target.dataset.in) modalInput(e.target); });
  sheet.addEventListener('change', function (e) { if (e.target.dataset.in) modalInput(e.target); });

  function showIntro() {
    var has = false; try { has = !!localStorage.getItem(SAVE); } catch (e) {}
    open('<div class="orn">&#10070; &#10070; &#10070;</div><h1>Rails &amp; Ledgers</h1><p class="lede">A railway accounting game, 1896–1930</p>' +
      '<p>London, January 1896. <b>The Port Lindsay and Interior Railway Company, Limited</b> has raised £600,000 in £1 ordinary shares and £400,000 in 5% debentures. You are its Secretary and General Manager. Your task is to build a railway from the coast into the interior of a British colony and run it for thirty-five years.</p>' +
      '<div class="cols"><div><h3>On the map</h3><ul><li><b>Build line</b>: survey routes across veld, swamp, hills and an escarpment.</li><li><b>Rolling stock</b>: buy locomotives to carry the traffic you reach.</li><li><b>Finance</b>: issue shares or debentures, or take a Government guarantee.</li></ul></div>' +
      '<div><h3>In the boardroom</h3><ul><li>Every December you prepare the accounts in <b>double-account form</b>.</li><li>Classify spending as <b>capital or revenue</b>, set the <b>renewals</b> programme, choose a <b>dividend</b> and how much to <b>disclose</b>.</li><li>From 1919 two governments will tax one <b>indivisible railway</b>.</li></ul></div></div>' +
      '<p class="center" style="margin-top:14px">A full game takes about 30–45 minutes. One month passes every two seconds at normal speed. Press <span class="kbd">space</span> to pause.</p>' +
      '<div class="foot">' + (has ? '<button class="btn ghost" data-m="continue">Continue saved game</button>' : '') + '<button class="btn brass" data-m="newgame">Take up your appointment</button></div>' +
      '<p class="sober">The colony, the company and the places are fictional, modelled on British railway enterprise in southern and central Africa. Real colonial railways were built by African labour, often recruited under coercion, and served economies run for the benefit of settlers and investors. The game puts you in a company boardroom to teach the accounting choices made there. It does not endorse the order those companies served.</p>', 'narrow');
  }
  function newGame() {
    S = E.newGame(map); tf = E.traffic(S, map); R.trains = []; R.trackKey = ''; selected = null; cancelPlan();
    var p = map.source('port'); R.zoom = 1; R.centerOn(p.c - 10, p.r - 2);
    ticker(); objectives(); close(); setSpeed(1); setTool('inspect');
    showEventCard(E.eventById('start'));
  }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) {} }
  function load() {
    try { var d = JSON.parse(localStorage.getItem(SAVE)); if (d && d.v === 2) { S = d; tf = E.traffic(S, map); R.trackKey = ''; R.syncTrains(S, tf); var p = map.source('port'); R.centerOn(p.c - 10, p.r - 2); ticker(); objectives(); close(); toast('Welcome back. ' + E.dateStr(S) + '.'); return; } } catch (e) {}
    newGame();
  }

  function showEventCard(ev) {
    open('<div class="orn">&#10070;</div><h2 class="center">' + esc(ev.head) + '</h2><p class="center sub" style="color:var(--muted);font-style:italic">' + E.MONTHS[ev.m] + ' ' + ev.y + '</p><p>' + esc(ev.body) + '</p><div class="foot"><button class="btn brass" data-m="close">Continue</button></div>', 'narrow');
  }
  function showEvent(id) {
    var ev = E.eventById(id);
    if (id === 'guarantee') {
      open('<div class="orn">&#10070;</div><h2 class="center">' + esc(ev.head) + '</h2><p class="center" style="color:var(--muted);font-style:italic">June 1901</p><p>' + esc(ev.body) + '</p>' +
        '<div class="cols"><div class="note"><b>For.</b> £500,000 of cash at 3½%, well below market rates. Because the Treasury guarantees the interest, the bonds do not count against your borrowing powers, and the risk of receivership falls.</div><div class="note"><b>Against.</b> Every rate you charge falls by 10%, permanently, and the Government will scrutinise your accounts. Guaranteed lines often found their freedom over pricing and dividends curtailed.</div></div>' +
        '<div class="foot"><button class="btn ghost" data-m="guar" data-v="0">Decline</button><button class="btn brass" data-m="guar" data-v="1">Accept the guarantee</button></div>', 'narrow');
      return;
    }
    if (id === 'coal' || id === 'west' || id === 'copper') { var s = map.source(id); R.centerOn(s.c, s.r); }
    showEventCard(ev);
  }
  function afterModal() {
    close();
    if (S.pending && S.pending.length) { showEvent(S.pending.shift()); return; }
    if (agmDue() && !agm) startAGM();
  }

  /* ---------------- AGM wizard ---------------- */
  function startAGM() {
    S.m--; // the meeting reviews the year just ended
    var d = E.agmDraft(S, map);
    agm = { d: d, step: 0, ch: { classes: d.items.map(function () { return null; }), renewPct: S.renewPct, method: S.method, taxBasis: S.taxBasis || null, divPct: 0, disclosure: S.disclosure } };
    var steps = ['review'];
    if (d.items.length) steps.push('classify');
    steps.push('renewals');
    if (d.year >= 1919) steps.push('tax');
    steps.push('dividend');
    agm.steps = steps;
    var res = E.settle(S, map, d, fillCh());
    agm.ch.divPct = Math.max(0, Math.min(maxDiv(res), Math.round(S.lastDiv * 200) / 2));
    renderAGM();
  }
  function fillCh() { var c = JSON.parse(JSON.stringify(agm.ch)); c.classes = c.classes.map(function (x, i) { return x || agm.d.items[i].cls; }); if (!c.taxBasis) c.taxBasis = 'mileage'; return c; }
  function maxDiv(res) { return Math.max(0, Math.floor(Math.max(0, res.available) / S.cap.shares * 200) / 2); }
  var STEPNAME = { review: 'The year', classify: 'Capital or revenue', renewals: 'Renewals', tax: 'Taxation', dividend: 'Dividend & disclosure' };
  function renderAGM() {
    var a = agm, d = a.d, st = a.steps[a.step];
    var h = '<div class="steps">' + a.steps.map(function (s, i) { return '<span class="' + (i === a.step ? 'on' : i < a.step ? 'done' : '') + '">' + (i + 1) + '. ' + STEPNAME[s] + '</span>'; }).join('') + '<span>' + (a.steps.length + 1) + '. Publish</span></div>';
    h += '<h2>Annual General Meeting — year ended 31 December ' + d.year + '</h2>';
    h += ({ review: aReview, classify: aClassify, renewals: aRenewals, tax: aTax, dividend: aDividend })[st]();
    var ok = st !== 'classify' || a.ch.classes.every(function (c) { return c; });
    h += '<div class="foot"><span class="grow">' + (st === 'classify' && !ok ? 'Classify every item to continue.' : '') + '</span>' + (a.step > 0 ? '<button class="btn ghost" data-m="back">Back</button>' : '') + (a.step < a.steps.length - 1 ? '<button class="btn brass" data-m="next"' + (ok ? '' : ' disabled') + '>Next</button>' : '<button class="btn brass" data-m="publish">Publish the report</button>') + '</div>';
    open(h);
  }
  function aReview() {
    var d = agm.d, ra = d.ra;
    var h = '<p class="sub" style="font-style:italic;color:var(--muted)">The Board meets to approve the accounts before they go to shareholders. Review the year first.</p><div class="cols"><div><h3>Revenue account (draft)</h3><table class="kv"><tr><td>Gross receipts</td><td>' + L(ra.receipts) + '</td></tr><tr><td>Working expenses</td><td>' + L(ra.totalExp) + '</td></tr><tr><td>Net receipts</td><td>' + L(ra.net) + '</td></tr><tr><td>Debenture interest</td><td>' + L(d.interest) + '</td></tr><tr><td>Operating ratio</td><td>' + (ra.receipts ? pct(ra.opRatio) : '—') + '</td></tr><tr><td>Balance brought forward</td><td>' + L(d.nraBF) + '</td></tr></table></div>';
    h += '<div><h3>Traffic by source</h3>';
    var by = S.yr.bySrc, ids = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }), mx = ids.length ? by[ids[0]] : 1;
    if (!ids.length) h += '<p>No traffic was carried this year.</p>';
    ids.forEach(function (id) { h += '<div style="font-size:14.5px;display:flex;justify-content:space-between"><span>' + esc(map.source(id).name) + '</span><b>' + L(by[id]) + '</b></div><div class="bar"><i style="width:' + (by[id] / mx * 100) + '%"></i></div>'; });
    h += '</div></div><div class="cols"><div><h3>The property</h3><table class="kv"><tr><td>Permanent way</td><td>' + Math.round(d.trackCond) + '%</td></tr><tr><td>Rolling stock</td><td>' + Math.round(d.stockCond) + '%</td></tr><tr><td>Accidents this year</td><td>' + d.accidents.length + '</td></tr></table></div><div><h3>The market</h3><table class="kv"><tr><td>Share price</td><td>' + E.priceStr(S.price) + '</td></tr><tr><td>Investor trust</td><td>' + Math.round(S.trust) + '/100</td></tr><tr><td>Last dividend</td><td>' + pct(S.lastDiv, 1) + '</td></tr></table></div></div>';
    h += '<div class="note"><b>The double-account system.</b> The Regulation of Railways Act 1868 required British railway companies to publish their accounts in this form, and many overseas railway companies copied it. The accounts were a <i>Capital Account</i> (money raised and spent on the line), a <i>Revenue Account</i> (the year’s receipts and working expenses), a <i>Net Revenue Account</i> (interest, then dividends) and a <i>General Balance Sheet</i>. Fixed assets stayed at cost. Upkeep was charged to revenue as renewals.</div>';
    return h;
  }
  function aClassify() {
    var d = agm.d, h = '<p>During the year the Engineer paid for the following items. Each must be charged either to the <b>Capital Account</b> (added to the cost of the line) or to the <b>Revenue Account</b> (a working expense of the year).</p>';
    d.items.forEach(function (it, i) {
      var c = agm.ch.classes[i];
      h += '<div class="item"><span>' + esc(it.name) + '</span><span class="amt">' + L(it.amt) + '</span><span class="seg"><button data-m="cls" data-v="' + i + ':capital" class="' + (c === 'capital' ? 'on' : '') + '">Capital</button><button data-m="cls" data-v="' + i + ':revenue" class="' + (c === 'revenue' ? 'on' : '') + '">Revenue</button></span></div>';
    });
    var capSum = 0; d.items.forEach(function (it, i) { if (agm.ch.classes[i] === 'capital') capSum += it.amt; });
    h += '<p style="margin-top:10px">Charged to capital so far: <b>' + L(capSum) + '</b>. Every pound charged to capital adds a pound to this year’s profit available for dividend.</p>';
    h += '<div class="note"><b>The rule of thumb.</b> Spending that creates a new asset, or improves an existing one beyond its original standard, is capital. Spending that keeps the line as it was, or restores it, is revenue. The auditors review the classification. If they find upkeep charged to capital they will qualify their report.</div>';
    return h;
  }
  function aRenewals() {
    var d = agm.d, ch = agm.ch, need = d.need * E.costMult(S);
    var dep = E.P.depTrackPct * (S.cap.lines + S.cap.stations + S.cap.capitalised) + E.P.depStockPct * S.cap.stock;
    var h = '<p>Every railway wears out. Each year rails, sleepers, bridges and boilers need replacing. The Engineer puts next year’s renewals requirement at <b>' + L(need) + '</b>.</p>';
    h += '<h3>Renewals programme for ' + (d.year + 1) + ': <span id="rpv">' + pct(ch.renewPct) + '</span> of requirement (' + '<span id="rpa">' + L(need * ch.renewPct) + '</span>)</h3>';
    h += '<input type="range" min="0" max="150" step="5" value="' + Math.round(ch.renewPct * 100) + '" data-in="renew">';
    h += '<p id="rpe" class="explain">' + renewExplain(ch.renewPct) + '</p>';
    h += '<h3>How should renewals be accounted for?</h3>';
    h += '<label class="choice"><input type="radio" name="meth" value="renewals" data-in="method"' + (ch.method === 'renewals' ? ' checked' : '') + '><span><b>Renewals accounting</b><small>Usual British practice. Renewal spending is charged to the Revenue Account in the year it is spent, with no depreciation. Profit rises if you spend less on renewals, but the line deteriorates out of sight of shareholders.</small></span></label>';
    h += '<label class="choice"><input type="radio" name="meth" value="depreciation" data-in="method"' + (ch.method === 'depreciation' ? ' checked' : '') + '><span><b>Depreciation fund</b><small>Charge a fixed provision of 2% on lines and works and 5% on stock each year, about <b>' + L(dep) + '</b>. It is credited to a Depreciation and Renewals Fund, and renewals are drawn from the fund. Profit is steadier, and cutting renewals no longer flatters it. The market rewards the prudence.</small></span></label>';
    if (ch.method !== S.method) h += '<div class="warnbox">Changing an accounting policy needs explaining to shareholders. Without full disclosure, investors treat it with suspicion.</div>';
    return h;
  }
  function renewExplain(p) {
    if (p < 0.7) return 'A deep cut. Profit rises now, but the permanent way will decay, capacity will fall under speed restrictions, and below 60% condition derailments become likely.';
    if (p < 1) return 'A modest saving. The property will slowly deteriorate.';
    if (p === 1) return 'Full maintenance: condition holds steady.';
    return 'Catching up. Spending above requirement restores worn track and stock, which helps if condition has fallen.' + (E.year(S) >= 1914 && E.year(S) <= 1918 ? ' In wartime materials cost double, so each pound restores half as much.' : '');
  }
  function aTax() {
    var d = agm.d, ch = fillCh(), res = E.settle(S, map, d, ch), pbt = res.pbt;
    var m = E.taxFor(S, map, 'mileage', pbt), r = E.taxFor(S, map, 'receipts', pbt);
    var h = '<p>The railway is one undertaking, run as a single system, yet ' + (d.year >= 1926 ? 'two governments now tax it: the Colony at 7½% and the Northern Protectorate at 10%.' : 'the Colony taxes only the profit <i>attributable</i> to the Colony, at 7½%.') + ' The profit has to be allocated on some basis. Profit before tax this year: <b>' + L(pbt) + '</b>.</p>';
    h += '<label class="choice"><input type="radio" name="tb" value="mileage" data-in="basis"' + (ch.taxBasis === 'mileage' && agm.ch.taxBasis ? ' checked' : '') + '><span><b>Route mileage</b><small>Profit is divided in proportion to the miles of line in each territory. Colony share ' + pct(m.share) + '. Tax <b>' + L(m.total) + '</b>' + (d.year >= 1926 ? ' (Colony ' + L(m.colony) + ', Protectorate ' + L(m.prot) + ')' : '') + '.</small></span></label>';
    h += '<label class="choice"><input type="radio" name="tb" value="receipts" data-in="basis"' + (ch.taxBasis === 'receipts' && agm.ch.taxBasis ? ' checked' : '') + '><span><b>Traffic receipts</b><small>Profit follows where the traffic originates. Colony share ' + pct(r.share) + '. Tax <b>' + L(r.total) + '</b>' + (d.year >= 1926 ? ' (Colony ' + L(r.colony) + ', Protectorate ' + L(r.prot) + ')' : '') + '.</small></span></label>';
    if (S.taxBasis) h += '<div class="warnbox">Last year you used <b>' + S.taxBasis + '</b>. Changing basis to cut your tax will provoke the authority that loses by it: expect a back-assessment and a costly dispute.</div>';
    else h += '<div class="note"><b>Choose with care.</b> Whichever basis you adopt now, the revenue authorities will expect you to keep it. A basis that suits you today may not suit you once copper traffic comes from the Protectorate.</div>';
    h += '<div class="note"><b>History.</b> Rhodesia Railways faced exactly this problem from 1926, when several jurisdictions taxed one integrated system. How an economically indivisible enterprise was made fiscally divisible is the subject of the research paper <i>Taxing an Indivisible Railway</i>.</div>';
    return h;
  }
  function aDividend() {
    var d = agm.d, ch = fillCh(), res = E.settle(S, map, d, ch), mx = maxDiv(res);
    if (agm.ch.divPct > mx) agm.ch.divPct = mx;
    var div = agm.ch.divPct / 100 * S.cap.shares;
    var h = '<div class="cols"><div><h3>Net Revenue Account</h3><table class="kv"><tr><td>Balance brought forward</td><td>' + L(d.nraBF) + '</td></tr><tr><td>Net receipts (after classified items)</td><td>' + L(res.net) + '</td></tr><tr><td>Less debenture interest</td><td>(' + L(d.interest) + ')</td></tr>' + (res.tax.total ? '<tr><td>Less taxation</td><td>(' + L(res.tax.total) + ')</td></tr>' : '') + (res.penalty ? '<tr><td>Less back-assessment</td><td>(' + L(res.penalty) + ')</td></tr>' : '') + '<tr><td><b>Available for dividend</b></td><td><b>' + L(res.available) + '</b></td></tr></table>';
    if (res.available <= 0) h += '<div class="warnbox">No profits are available. Dividends may be paid only out of profits, never out of capital. The debit balance must be made good from future earnings first.</div>';
    h += '</div><div><h3>Dividend on ordinary shares: <span id="dvv">' + agm.ch.divPct.toFixed(1) + '%</span></h3><input type="range" min="0" max="' + mx + '" step="0.5" value="' + agm.ch.divPct + '" data-in="div"' + (mx <= 0 ? ' disabled' : '') + '><p>Costs <b id="dva">' + L(div) + '</b>. Leaves <span id="dvc">' + L(res.available - div) + '</span> to carry forward. Cash after payment and tax: <span id="dvk">' + L(S.cash - res.tax.total - res.penalty - div - res.capItems - res.revItems) + '</span>.</p><p class="explain">Last year: ' + pct(S.lastDiv, 1) + '. Investors prize a <b>steady</b> dividend. Cuts are punished, and a passed dividend most of all.</p></div></div>';
    h += '<h3>How much will the report disclose?</h3>';
    [['full', 'Full disclosure', 'A detailed Revenue Account, traffic statistics and the Engineer’s report on the condition of the line. Builds trust, but bad news is plain to see.'], ['standard', 'Standard', 'The statutory accounts in the usual form, with a brief directors’ report.'], ['minimal', 'Minimal', 'Totals only. Bad news is hidden, but investors grow suspicious, and when accidents become known the damage is greater.']].forEach(function (o) {
      h += '<label class="choice"><input type="radio" name="disc" value="' + o[0] + '" data-in="disc"' + (agm.ch.disclosure === o[0] ? ' checked' : '') + '><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></label>';
    });
    return h;
  }
  function modalInput(el) {
    var k = el.dataset.in;
    if (k === 'renew') { agm.ch.renewPct = +el.value / 100; $('#rpv').textContent = pct(agm.ch.renewPct); $('#rpa').textContent = L(agm.d.need * E.costMult(S) * agm.ch.renewPct); $('#rpe').textContent = renewExplain(agm.ch.renewPct); }
    if (k === 'method') { agm.ch.method = el.value; renderAGMKeep(); }
    if (k === 'basis') { agm.ch.taxBasis = el.value; }
    if (k === 'disc') agm.ch.disclosure = el.value;
    if (k === 'div') {
      agm.ch.divPct = +el.value;
      var res = E.settle(S, map, agm.d, fillCh()), div = agm.ch.divPct / 100 * S.cap.shares;
      $('#dvv').textContent = agm.ch.divPct.toFixed(1) + '%'; $('#dva').textContent = L(div); $('#dvc').textContent = L(res.available - div);
      $('#dvk').textContent = L(S.cash - res.tax.total - res.penalty - div - res.capItems - res.revItems);
    }
  }
  function renderAGMKeep() { var y = sheet.scrollTop; renderAGM(); sheet.scrollTop = y; }
  function modalAct(m, v) {
    if (m === 'newgame') { newGame(); return; }
    if (m === 'continue') { load(); return; }
    if (m === 'close') { afterModal(); return; }
    if (m === 'guar') { E.acceptGuarantee(S, v === '1'); panelDirty = true; afterModal(); return; }
    if (m === 'cls') { var p = v.split(':'); agm.ch.classes[+p[0]] = p[1]; renderAGMKeep(); return; }
    if (m === 'next') {
      if (agm.steps[agm.step] === 'tax' && !agm.ch.taxBasis) { toast('Choose a basis of allocation.'); return; }
      agm.step++; renderAGM(); return;
    }
    if (m === 'back') { agm.step--; renderAGM(); return; }
    if (m === 'publish') {
      var ch = fillCh();
      if (agm.d.year < 1919) ch.taxBasis = S.taxBasis;
      var out = E.finalizeAGM(S, map, agm.d, ch);
      if (!out.ok) { toast(out.msg, true); return; }
      S.m++; agm = null; save(); objectives(); panelDirty = true;
      showReport(out.report, false);
      return;
    }
    if (m === 'endgame') { showEnd(); return; }
    if (m === 'restart') { try { localStorage.removeItem(SAVE); } catch (e) {} showIntro(); return; }
    if (m === 'closereport') { close(); if (S.gameOver) { showEnd(); return; } afterModal(); return; }
  }

  /* ---------------- printed report ---------------- */
  function row(label, n, cls) { return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + label + '</td><td class="n">' + (n === '' ? '' : n < -0.5 ? '(£' + E.fmt(-n) + ')' : L(n)) + '</td></tr>'; }
  function showReport(r, archive) {
    var c = r.cap, ra = r.ra, full = r.disclosure === 'full', min = r.disclosure === 'minimal';
    var h = '<div class="report"><div class="rh">The Port Lindsay and Interior Railway Company, Limited</div><div class="rs">Report of the Directors and Statement of Accounts for the year ended 31st December ' + r.year + '</div>';
    // directors' report
    var dr = 'The Directors submit the accounts for the year. The line open for traffic extends to ' + miles(r.miles) + ' miles, served by ' + r.trains + ' locomotives. Gross receipts amounted to ' + L(ra.receipts) + (min ? '.' : ' and working expenses to ' + L(ra.totalExp) + ', a ratio of ' + (ra.receipts ? pct(ra.opRatio) : 'nil') + '.');
    dr += r.divRate > 0 ? ' The Directors recommend a dividend of ' + pct(r.divRate, 1) + ' on the ordinary shares, absorbing ' + L(r.divAmt) + '.' : ' The Directors regret that no dividend can be recommended.';
    if (full) dr += ' The Engineer reports the permanent way at ' + Math.round(r.trackCond) + '% and rolling stock at ' + Math.round(r.stockCond) + '% of standard condition. Renewals for the coming year are budgeted at ' + pct(r.renewPct) + ' of requirement.' + (r.accidents.length ? ' The Directors deeply regret ' + r.accidents.length + ' accident' + (r.accidents.length > 1 ? 's' : '') + ' during the year.' : '');
    h += '<p style="font-size:15.5px">' + dr + '</p>';
    // capital account
    h += '<table class="acct"><caption>Capital Account</caption><tr><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Receipts</th></tr>' + row('Ordinary share capital', c.shares) + (c.premium ? row('Premiums on shares issued', c.premium) : '') + row('Debenture stock', c.debs) + (c.gdebs ? row('Guaranteed debentures', c.gdebs) : '') + row('Total receipts', r.capReceipts, 'tot') + '</table></td><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Expenditure</th></tr>';
    if (min) h += row('Lines, works and rolling stock', r.capExp - c.issueExp) + (c.issueExp ? row('Issue expenses', c.issueExp) : '');
    else h += row('Lines open for traffic', c.lines) + row('Stations and buildings', c.stations) + row('Rolling stock', c.stock) + (c.capitalised ? row('Additional works', c.capitalised) : '') + (c.issueExp ? row('Issue expenses', c.issueExp) : '');
    h += row('Total expenditure', r.capExp, 'tot') + '</table></td></tr><tr><td colspan="2" style="text-align:center;font-style:italic">Balance of Capital Account ' + (r.capBal >= 0 ? 'unexpended' : 'overexpended') + ': ' + L(Math.abs(r.capBal)) + '</td></tr></table>';
    // revenue account
    h += '<table class="acct"><caption>Revenue Account</caption><tr><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Expenditure</th></tr>';
    if (min) h += row('Working expenses', ra.totalExp);
    else h += row('Maintenance of way and works', ra.exp.way) + row('Locomotive power', ra.exp.loco) + row('Carriage and wagon', ra.exp.carriage) + row('Traffic expenses', ra.exp.traffic) + row('General charges', ra.exp.general) + (ra.exp.comp ? row('Compensation', ra.exp.comp) : '') + (ra.exp.revItems ? row('Sundry works charged to revenue', ra.exp.revItems) : '') + (ra.exp.dep ? row('Depreciation and renewals fund', ra.exp.dep) : '');
    h += row('Balance to Net Revenue Account', ra.net, 'sub') + row('', ra.receipts, 'tot') + '</table></td><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Receipts</th></tr>';
    if (min) h += row('Traffic receipts', ra.receipts);
    else h += row('Goods and minerals', ra.goods) + row('Passengers and parcels', ra.pass);
    h += row('', ra.receipts, 'tot') + '</table></td></tr></table>';
    // net revenue account
    h += '<table class="acct"><caption>Net Revenue Account</caption>' + row('Balance brought forward from ' + (r.year - 1), r.nraBF) + row('Net receipts from Revenue Account', ra.net) + row('Less: debenture and other interest', -r.interest) + (r.tax.total ? row('Less: colonial taxation' + (r.tax.prot ? ' (Colony and Protectorate)' : ''), -r.tax.total) : '') + (r.penalty ? row('Less: tax back-assessment', -r.penalty) : '') + row('Available for distribution', r.available, 'sub') + row('Dividend on ordinary shares' + (r.divRate ? ' at ' + pct(r.divRate, 1) : ''), -r.divAmt) + row('Balance carried forward', r.nraCF, 'tot') + '</table>';
    // balance sheet
    var bs = r.bs, liab = '', ass = '', lt = 0, at = 0;
    if (bs.capBal >= 0) { liab += row('Capital Account: balance unexpended', bs.capBal); lt += bs.capBal; } else { ass += row('Capital Account: balance overexpended', -bs.capBal); at -= bs.capBal; }
    if (bs.fund > 0.5) { liab += row('Depreciation and renewals fund', bs.fund); lt += bs.fund; }
    if (bs.nra >= 0) { liab += row('Net Revenue Account', bs.nra); lt += bs.nra; } else { ass += row('Net Revenue Account: debit balance', -bs.nra); at -= bs.nra; }
    if (bs.cash >= 0) { ass += row('Cash at bankers and on deposit', bs.cash); at += bs.cash; } else { liab += row('Bankers: overdraft', -bs.cash); lt -= bs.cash; }
    h += '<table class="acct"><caption>General Balance Sheet, 31st December ' + r.year + '</caption><tr><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Liabilities</th></tr>' + liab + row('', lt, 'tot') + '</table></td><td class="split"><table class="acct" style="margin:0"><tr><th colspan="2">Assets</th></tr>' + ass + row('', at, 'tot') + '</table></td></tr></table>';
    if (full) {
      h += '<table class="acct"><caption>Statistical Statements</caption><tr><th>Engineer’s statement</th><th></th></tr>' + '<tr><td>Renewals requirement / programme</td><td class="n">' + L(r.need) + ' / ' + pct(r.renewPct) + '</td></tr><tr><td>Permanent way condition</td><td class="n">' + Math.round(r.trackCond) + '%</td></tr><tr><td>Rolling stock condition</td><td class="n">' + Math.round(r.stockCond) + '%</td></tr><tr><td>Accidents</td><td class="n">' + r.accidents.length + '</td></tr></table>';
    }
    // auditor
    var q = r.detected.length;
    h += '<div class="auditor' + (q ? ' q' : '') + '"><b>Report of the Auditors.</b> ' + (q ? 'We have examined the books of the Company. In our opinion expenditure of ' + L(r.items.filter(function (it) { return r.detected.indexOf(it.i) >= 0; }).reduce(function (s, it) { return s + it.amt; }, 0)) + ' on ' + r.items.filter(function (it) { return r.detected.indexOf(it.i) >= 0; }).map(function (it) { return it.name.toLowerCase(); }).join('; ') + ' is of a revenue nature and has been so charged in these accounts, contrary to the Directors’ proposal. Subject to this, the Balance Sheet is properly drawn up.' : 'We have examined the books and vouchers of the Company and certify that the above accounts are correctly drawn up and exhibit a true and correct view of the state of the Company’s affairs, as shown by the books.') + '<br><i style="color:var(--muted)">Price, Holloway &amp; Co., Chartered Accountants, London</i></div>';
    h += '</div>';
    if (!archive) {
      h += '<h3>The market’s verdict</h3><div class="reaction"><div><small>Share price</small><b class="' + (r.priceAfter >= r.priceBefore ? 'up' : 'down') + '">' + E.priceStr(r.priceAfter) + '</b><br><small>was ' + E.priceStr(r.priceBefore) + '</small></div><div><small>Investor trust</small><b class="' + (r.trustDelta >= 0 ? 'up' : 'down') + '">' + (r.trustDelta >= 0 ? '+' : '') + Math.round(r.trustDelta) + '</b><br><small>now ' + Math.round(S.trust) + '/100</small></div><div><small>Dividend</small><b>' + pct(r.divRate, 1) + '</b><br><small>' + L(r.divAmt) + '</small></div></div>';
      r.press.forEach(function (p) { h += '<p class="press">' + p + ' <span style="font-style:normal;color:var(--muted);font-size:14px">— The City Gazette</span></p>'; });
      if (r.rateCut > 0) h += '<div class="warnbox"><b>Railway Rates Commission.</b> Net receipts were ' + pct(r.roc, 1) + ' of capital expenditure. Above 7% the Commission orders rates down, this year by ' + pct(r.rateCut, 1) + '. A larger capital account raises the return you are allowed. That is one reason regulated companies were tempted to capitalise freely.</div>';
      if (r.rateCut < 0) h += '<div class="note"><b>Railway Rates Commission.</b> Returns below 4½% on capital: an increase in rates is allowed.</div>';
      if (r.items.length) {
        h += '<h3>Ledger notes: capital or revenue?</h3>';
        r.items.forEach(function (it, i) {
          var chosen = r.classes[i], right = chosen === it.cls, det = r.detected.indexOf(it.i) >= 0;
          h += '<div class="item" style="grid-template-columns:1fr auto"><span><b>' + esc(it.name) + '</b> — you chose <b>' + chosen + '</b>. ' + (right ? '<span class="up">Correct.</span>' : det ? '<span class="down">The auditors objected.</span>' : chosen === 'capital' ? '<span class="down">Wrong, and the auditors missed it: profit is overstated.</span>' : '<span class="down">Over-cautious: a hidden (secret) reserve.</span>') + '<div class="explain">' + esc(it.why) + '</div></span><span class="amt">' + L(it.amt) + '</span></div>';
        });
      }
      if (r.notes.length) h += '<p style="color:var(--muted);font-style:italic">' + r.notes.join(' ') + '</p>';
      h += '<div class="foot"><button class="btn brass" data-m="closereport">' + (S.gameOver ? 'To the final reckoning' : 'Continue to ' + (r.year + 1)) + '</button></div>';
    } else h += '<div class="foot"><button class="btn brass" data-m="close">Close</button></div>';
    open(h);
  }

  /* ---------------- end ---------------- */
  function showEnd() {
    var sc = E.finalScore(S), v = sc.val, rec = S.gameOver && S.gameOver.reason === 'receivership';
    var h = '<div class="orn">&#10070; &#10070; &#10070;</div><h1>' + (rec ? 'In the hands of the Receiver' : 'The Final Reckoning') + '</h1><p class="lede">' + (rec ? S.gameOver.d + ': the company could not meet its obligations.' : 'December 1930: the Colonial Government acquires the undertaking.') + '</p>';
    h += '<div class="cols"><div><div class="grade">' + (rec ? 'E' : sc.grade) + '</div><p class="center">' + sc.pts + ' points out of 100</p></div><div><table class="kv"><tr><td>Dividends paid per £1 share, 1896–1930</td><td>' + E.priceStr(S.cumDiv) + '</td></tr><tr><td>Market price</td><td>' + E.priceStr(S.price) + '</td></tr><tr><td>Valuation of the property per share</td><td>' + E.priceStr(v.perShare) + '</td></tr><tr><td>Purchase terms per share</td><td>' + E.priceStr(v.terms) + '</td></tr><tr><td><b>Total return per £1 subscribed</b></td><td><b>' + E.priceStr(sc.tsr) + '</b></td></tr><tr><td>Equivalent annual return</td><td>' + pct(sc.annual, 1) + '</td></tr><tr><td>Qualified audit reports</td><td>' + S.qualified + '</td></tr><tr><td>Accidents</td><td>' + S.accidents + '</td></tr><tr><td>Arrears of maintenance</td><td>' + L(v.arrears) + '</td></tr></table></div></div>';
    h += '<h3>What the accounts did not show</h3><ul>';
    h += '<li>Upkeep wrongly charged to capital that the auditors never caught: <b>' + L(S.misclassHidden) + '</b>. ' + (S.misclassHidden ? 'Those profits were never earned. The dividends they funded came, in effect, out of capital.' : 'None. Your capital account is clean.') + '</li>';
    h += '<li>Capital items you charged to revenue: <b>' + S.conservative + '</b>. ' + (S.conservative ? 'These built secret reserves. Prudence was praised until <i>R v Kylsant</i> (the Royal Mail case, 1931) showed how hidden reserves could mislead investors.' : '') + '</li>';
    h += '<li>Arrears of maintenance at the end: <b>' + L(v.arrears) + '</b>, deducted by the Government valuers. ' + (v.arrears > 300000 ? 'Years of cut renewals flattered the Revenue Account and the dividend, and shareholders paid for them at the end.' : 'You kept the property in good order.') + '</li>';
    if (S.taxBasisChanges) h += '<li>You changed the basis of tax allocation ' + S.taxBasisChanges + ' time(s) and paid back-assessments for it.</li>';
    h += '</ul><h3>The history behind the game</h3><p>The double-account system, borrowing powers tied to share capital, the ban on issuing shares at a discount, the ban on dividends out of capital, rate regulation and the taxation of railway profits across borders were all real constraints on British overseas railways. The game’s questions come from research by Andrew Primmer: on dividend restriction and value relevance in colonial railway accounts, on the Beira Railway (<i>The Balance Sheet as Barrier</i>), and on the allocation of Rhodesia Railways’ profits between jurisdictions (<i>Taxing an Indivisible Railway</i>).</p>';
    h += '<div class="foot"><a class="btn ghost" href="../../../research.html">Read about the research</a><a class="btn ghost" href="../">Back to ACCT 360</a><button class="btn brass" data-m="restart">Play again</button></div>';
    try { localStorage.removeItem(SAVE); } catch (e) {}
    open(h);
  }

  function showHelp() {
    open('<h2>Guide</h2><div class="cols"><div><h3>Controls</h3><ul><li>Drag the map to pan. Use the mouse wheel or <b>+ / &minus;</b> to zoom. Click the minimap to jump.</li><li><span class="kbd">B</span> build, <span class="kbd">I</span> inspect, <span class="kbd">L</span> rolling stock, <span class="kbd">F</span> finance, <span class="kbd">A</span> accounts.</li><li><span class="kbd">Space</span> pauses. <span class="kbd">Esc</span> cancels a route.</li><li>The game saves after each general meeting.</li></ul><h3>Earning money</h3><p>Traffic flows between each connected source and the port. Receipts = traffic × chargeable distance × rate. You need enough locomotives to carry the traffic you reach.</p></div><div><h3>Key ideas</h3><ul><li><b>Capital vs revenue</b>: new and improved assets are capital; upkeep is revenue.</li><li><b>Renewals vs depreciation</b>: charge replacements when spent, or provide steadily through a fund.</li><li><b>Dividends</b>: only out of profits; steadiness is rewarded.</li><li><b>Disclosure</b>: candour builds trust; concealment magnifies shocks.</li><li><b>Financing</b>: debentures ≤ share capital; no shares below par.</li><li><b>Tax</b>: one railway, two taxing authorities, one basis of allocation.</li></ul></div></div><div class="foot"><button class="btn ghost" data-m="restart">Restart game</button><button class="btn brass" data-m="close">Back to the map</button></div>');
  }

  /* ---------------- boot ---------------- */
  resize();
  var p0 = map.source('port'); R.centerOn(p0.c - 10, p0.r - 2);
  ticker(); objectives();
  showIntro();
  requestAnimationFrame(frame);
  window.__rl = { get S() { return S; }, E: E, map: map, R: R, tick: tick };
})();
