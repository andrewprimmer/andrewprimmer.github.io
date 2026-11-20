/* Rails & Ledgers — economy, accounting and market engine (no DOM). */
(function (root) {
  'use strict';
  var START_YEAR = 1896, END_YEAR = 1930;
  var SQ2 = Math.SQRT2;
  var NB8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  var P = {
    freightRate: 0.10, townRate: 0.075,
    trainCapacity: 900000, locoCost: 15000, stationCost: 8000,
    maintPerTile: 500, locoPerTrain: 3500, locoPctRev: 0.22, trafficPctRev: 0.12, trafficPerStation: 1500, general: 12000,
    trackWear: 3.5, stockWear: 5, renewTrackPct: 0.016, renewStockPct: 0.05,
    depTrackPct: 0.02, depStockPct: 0.05,
    debRate: 0.05, gdebRate: 0.035, odRate: 0.07, odLimit: 150000,
    buildPerMonth: 3
  };

  /* ---------- events ---------- */
  var EVENTS = [
    { y: 1896, m: 0, id: 'start', head: 'The Port Lindsay and Interior Railway Company, Limited, is registered in London', body: '£600,000 in £1 ordinary shares and £400,000 of 5% debentures have been subscribed. The Board instructs you, as Secretary and General Manager, to build into the interior.' },
    { y: 1899, m: 9, id: 'war', head: 'War in the south: military traffic surges', body: 'Hostilities in the neighbouring territories bring troops and stores through Port Lindsay. Traffic is up 30% until 1902.' },
    { y: 1900, m: 0, id: 'coal', head: 'Blackrock Colliery opens', body: 'Coal is being raised at Blackrock. Connect it to carry coal to the port and to cut your locomotive fuel bill by 15%.' },
    { y: 1901, m: 5, id: 'guarantee', head: 'The Colonial Office offers a guarantee', body: 'The Government will guarantee up to £500,000 of 3½% debentures — if the company accepts a permanent 10% reduction in its rates.', choice: true },
    { y: 1902, m: 5, id: 'peace', head: 'Peace signed; military traffic ends', body: 'Traffic returns to normal levels.' },
    { y: 1902, m: 6, id: 'west', head: 'Southern lines reach the western border', body: 'The southern railway system now reaches the western frontier. Through traffic awaits any company that can link it to the sea.' },
    { y: 1903, m: 2, id: 'slump', head: 'Post-war slump', body: 'Trade is depressed across the region. Traffic is 15% below normal for 1903–04.' },
    { y: 1906, m: 3, id: 'boom', head: 'Deep-level gold boom at Mount Hollis', body: 'New deep-level mines raise Mount Hollis traffic by 40%.' },
    { y: 1910, m: 1, id: 'drought', head: 'Drought on the lowveld', body: 'The rains have failed. Greenvale farm traffic falls by 60% this year.' },
    { y: 1914, m: 7, id: 'ww1', head: 'Great War declared', body: 'Costs are rising 35% and renewal materials — rails, sleepers, boiler plate — now cost double. Debenture money costs 6%.' },
    { y: 1918, m: 10, id: 'armistice', head: 'Armistice', body: 'The war is over, but prices will not return to 1913 levels. Costs settle 20% above pre-war.' },
    { y: 1919, m: 0, id: 'tax1', head: 'The Colony introduces an income tax', body: 'Colonial income tax of 7½% is charged on the share of the company’s profit attributable to the Colony. You must choose a basis of allocation at the next AGM.' },
    { y: 1920, m: 6, id: 'golddecl', head: 'Mount Hollis reefs begin to fail', body: 'The upper reefs are worked out. Goldfield traffic will now decline year by year.' },
    { y: 1921, m: 1, id: 'slump2', head: 'Post-war depression', body: 'Commodity prices collapse. Traffic is 20% below normal for 1921–22.' },
    { y: 1925, m: 3, id: 'copper', head: 'Copper proved at the Northern Copperfield', body: 'Geologists confirm vast copper deposits deep in the Northern Protectorate. Mining companies will ship everything through Port Lindsay — if there is a railway.' },
    { y: 1926, m: 0, id: 'tax2', head: 'The Protectorate imposes its own tax', body: 'The Northern Protectorate levies 10% on profits attributable to it. Two governments now tax one indivisible railway — and each will watch the basis you use.' },
    { y: 1927, m: 4, id: 'road', head: 'Motor lorries compete on the roads', body: 'Road motor services are taking short-distance passengers and parcels. Town traffic falls by 20%.' },
    { y: 1929, m: 9, id: 'crash', head: 'Crash on Wall Street', body: 'Markets collapse and copper prices fall. Traffic is down 25% and investors demand higher yields.' },
    { y: 1930, m: 11, id: 'end', head: 'December 1930: the final general meeting', body: 'Your stewardship is complete. Prepare the last accounts.' }
  ];

  var ITEMS = [
    { name: 'Relaying 6 miles with heavier 60 lb rails (replacing 45 lb)', cls: 'capital', amt: [9000, 16000], why: 'The upgrade to heavier rails improves the asset beyond its original standard, so the excess over like-for-like replacement is capital. (A strict view capitalises only the betterment.)' },
    { name: 'Repairing culverts washed out by the rains', cls: 'revenue', amt: [3000, 7000], why: 'Restoring the line to its previous condition is maintenance: revenue.' },
    { name: 'New goods shed at Fort Carrow', cls: 'capital', amt: [5000, 9000], why: 'A new structure that adds to earning capacity: capital.' },
    { name: 'Repainting and re-upholstering carriages', cls: 'revenue', amt: [2000, 5000], why: 'Routine upkeep of rolling stock: revenue.' },
    { name: 'Replacing a timber trestle with a steel girder bridge', cls: 'capital', amt: [12000, 22000], why: 'The new bridge is a substantial improvement in durability and load: capital (at least the betterment).' },
    { name: 'Clearing bush from the line side', cls: 'revenue', amt: [1500, 4000], why: 'Recurring upkeep: revenue.' },
    { name: 'Legal costs of a dispute with a contractor', cls: 'revenue', amt: [2000, 6000], why: 'Legal costs of operations create no asset: revenue.' },
    { name: 'Telegraph line along the railway', cls: 'capital', amt: [6000, 11000], why: 'A new installation used for many years: capital.' },
    { name: 'Boiler overhaul on three locomotives', cls: 'revenue', amt: [3000, 8000], why: 'An overhaul restores the locomotives to working order without improving them: revenue (or chargeable to a renewals fund).' },
    { name: 'Additional sidings at the port', cls: 'capital', amt: [4000, 9000], why: 'Extra track adds capacity: capital.' },
    { name: 'Re-sleepering worn sections with like-for-like timber', cls: 'revenue', amt: [4000, 9000], why: 'Like-for-like replacement is renewal, charged to revenue under the double-account system.' },
    { name: 'Surveying a possible future branch line', cls: 'capital', amt: [2000, 5000], why: 'Preliminary expenses of new works were normally charged to capital — although if the branch is never built they should be written off.' }
  ];

  function rng(state) { // deterministic per game
    state.rs = (Math.imul(state.rs, 1664525) + 1013904223) >>> 0;
    return state.rs / 4294967296;
  }
  function key(c, r) { return c + ',' + r; }
  function unkey(k) { var a = k.split(','); return [+a[0], +a[1]]; }
  function ekey(a, b) { return a < b ? a + '|' + b : b + '|' + a; }

  function newGame(map) {
    var S = {
      v: 2, m: 0, rs: 1896 * 7919,
      cash: 1000000,
      cap: { shares: 600000, premium: 0, debs: 400000, gdebs: 0, lines: 0, stations: 0, stock: 0, capitalised: 0, issueExp: 0 },
      fund: 0, nraBF: 0,
      edges: {}, stations: { port: true }, trains: 0, projects: [],
      trackCond: 100, stockCond: 100, renewPct: 1, method: 'renewals', disclosure: 'standard',
      trust: 60, price: 1.0, lastDiv: 0, cumDiv: 0, divPaidYears: 0,
      priceHist: [1.0], tmarket: 1,
      guarantee: null, rateFactor: 1, rateCap: 1, taxBasis: null, taxBasisChanges: 0,
      qualified: 0, misclassHidden: 0, misclassTotal: 0, conservative: 0, accidents: 0, accidentsHidden: 0,
      news: [], firedEvents: {}, pending: null, gameOver: null, reports: [],
      objectives: { gold: false, loco2: false, agm: false },
      yr: null, carried: 1, demand: 0, capacity: 0
    };
    S.yr = blankYear();
    return S;
  }
  function blankYear() {
    return { goods: 0, pass: 0, way: 0, loco: 0, carriage: 0, traffic: 0, general: 0, comp: 0, dep: 0, renewWayRev: 0, renewStockRev: 0, renewFund: 0, interest: 0, revItems: 0, constr: 0, stockBuy: 0, accidents: [], bySrc: {}, colonyRev: 0, protRev: 0, extraRev: 0 };
  }
  function year(S) { return START_YEAR + Math.floor(S.m / 12); }
  function month(S) { return S.m % 12; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function dateStr(S) { return MONTHS[month(S)] + ' ' + year(S); }

  /* ---------- network ---------- */
  function networkTiles(S) {
    var set = {};
    Object.keys(S.edges).forEach(function (e) { var p = e.split('|'); set[p[0]] = 1; set[p[1]] = 1; });
    return set;
  }
  function adjacency(S) {
    var adj = {};
    Object.keys(S.edges).forEach(function (e) {
      var p = e.split('|'), a = unkey(p[0]), b = unkey(p[1]);
      var len = (a[0] !== b[0] && a[1] !== b[1]) ? SQ2 : 1;
      (adj[p[0]] = adj[p[0]] || []).push([p[1], len]);
      (adj[p[1]] = adj[p[1]] || []).push([p[0], len]);
    });
    return adj;
  }
  function distancesFromPort(S, map) {
    var adj = adjacency(S), port = map.source('port'), start = key(port.c, port.r);
    var dist = {}, prev = {}; dist[start] = 0;
    var open = [start];
    while (open.length) {
      var bi = 0;
      for (var i = 1; i < open.length; i++) if (dist[open[i]] < dist[open[bi]]) bi = i;
      var u = open.splice(bi, 1)[0];
      (adj[u] || []).forEach(function (nb) {
        var nd = dist[u] + nb[1];
        if (dist[nb[0]] === undefined || nd < dist[nb[0]] - 1e-9) { if (dist[nb[0]] === undefined) open.push(nb[0]); dist[nb[0]] = nd; prev[nb[0]] = u; }
      });
    }
    return { dist: dist, prev: prev };
  }
  function pathToPort(S, map, dp, k) {
    var out = [k];
    while (dp.prev[k]) { k = dp.prev[k]; out.push(k); }
    return out.map(unkey);
  }
  function octile(a, b) { var dx = Math.abs(a.c - b.c), dy = Math.abs(a.r - b.r); return Math.max(dx, dy) + (SQ2 - 1) * Math.min(dx, dy); }

  function edgeCost(map, a, b, mult) {
    var ca = map.cost(a[0], a[1]), cb = map.cost(b[0], b[1]);
    if (!isFinite(ca) || !isFinite(cb)) return Infinity;
    var diag = a[0] !== b[0] && a[1] !== b[1];
    if (diag) { // no corner-cutting across water
      if (!isFinite(map.cost(a[0], b[1])) && !isFinite(map.cost(b[0], a[1]))) return Infinity;
    }
    return (ca + cb) / 2 * (diag ? SQ2 : 1) * (mult || 1);
  }
  // cheapest route from the existing network (or the port) to a target tile
  function planRoute(S, map, tc, tr) {
    if (!isFinite(map.cost(tc, tr))) return null;
    var net = networkTiles(S), starts = Object.keys(net);
    S.projects.forEach(function (p) { p.path.forEach(function (t) { starts.push(key(t[0], t[1])); }); });
    var port = map.source('port');
    if (!starts.length) starts = [key(port.c, port.r)];
    var tk = key(tc, tr);
    if (starts.indexOf(tk) >= 0) return null;
    var g = {}, prev = {}, closed = {}, heap = [];
    function h(k) { var p = unkey(k), dx = Math.abs(p[0] - tc), dy = Math.abs(p[1] - tr); return (Math.max(dx, dy) + (SQ2 - 1) * Math.min(dx, dy)) * 22000; }
    function push(k, f) { heap.push([f, k]); var i = heap.length - 1; while (i > 0) { var pi = (i - 1) >> 1; if (heap[pi][0] <= heap[i][0]) break; var t = heap[pi]; heap[pi] = heap[i]; heap[i] = t; i = pi; } }
    function pop() { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var i = 0; for (;;) { var l = 2 * i + 1, r = l + 1, m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; var t = heap[m]; heap[m] = heap[i]; heap[i] = t; i = m; } } return top; }
    starts.forEach(function (k) { g[k] = 0; push(k, h(k)); });
    var mult = costMult(S);
    while (heap.length) {
      var u = pop()[1];
      if (closed[u]) continue; closed[u] = 1;
      if (u === tk) break;
      var up = unkey(u);
      for (var i = 0; i < 8; i++) {
        var v = [up[0] + NB8[i][0], up[1] + NB8[i][1]];
        if (v[0] < 0 || v[1] < 0 || v[0] >= map.W || v[1] >= map.H) continue;
        var vk = key(v[0], v[1]);
        if (closed[vk]) continue;
        var ec = S.edges[ekey(u, vk)] ? 0 : edgeCost(map, up, v, mult);
        if (!isFinite(ec)) continue;
        // building into another source tile adds a station
        var nt = map.tile(v[0], v[1]);
        if (nt.src && !S.stations[nt.src] && vk !== tk) ec += P.stationCost * mult;
        var ng = g[u] + ec;
        if (g[vk] === undefined || ng < g[vk]) { g[vk] = ng; prev[vk] = u; push(vk, ng + h(vk)); }
      }
    }
    if (g[tk] === undefined) return null;
    var path = [], k = tk;
    while (k !== undefined) { path.unshift(unkey(k)); k = prev[k]; }
    // costing
    var cost = 0, bridges = 0, newStations = [];
    for (var j = 1; j < path.length; j++) {
      var a = path[j - 1], b = path[j];
      if (S.edges[ekey(key(a[0], a[1]), key(b[0], b[1]))]) continue;
      cost += edgeCost(map, a, b, mult);
      if (map.tile(b[0], b[1]).t === map.T.RIVER) bridges++;
    }
    path.forEach(function (t) { var s = map.tile(t[0], t[1]).src; if (s && !S.stations[s] && newStations.indexOf(s) < 0) newStations.push(s); });
    cost += newStations.length * P.stationCost * mult;
    return { path: path, cost: Math.round(cost), tiles: path.length - 1, bridges: bridges, stations: newStations, months: Math.ceil((path.length - 1) / P.buildPerMonth) };
  }
  function commitRoute(S, map, plan) {
    var edges = [];
    for (var j = 1; j < plan.path.length; j++) {
      var a = plan.path[j - 1], b = plan.path[j];
      var ek = ekey(key(a[0], a[1]), key(b[0], b[1]));
      if (S.edges[ek]) continue;
      edges.push({ a: a, b: b, cost: edgeCost(map, a, b, costMult(S)) });
    }
    S.projects.push({ path: plan.path, edges: edges, done: 0, stations: plan.stations.slice(), id: Date.now() % 1e7 + S.projects.length });
    news(S, 'Construction begins: ' + edges.length + ' sections, estimated £' + fmt(plan.cost) + '.', 'build');
  }

  /* ---------- traffic ---------- */
  function costMult(S) {
    var y = year(S);
    if (y >= 1915 && y <= 1918 || (y === 1914 && month(S) >= 7)) return 1.35;
    if (y >= 1919) return 1.2;
    return 1;
  }
  function materialMult(S) { var y = year(S); return (y >= 1915 && y <= 1918) || (y === 1914 && month(S) >= 7) ? 2 : 1; }
  function unitsFor(S, s, y) {
    if (s.from && y < s.from) return 0;
    if (s.id === 'copper' && year(S) === 1925 && month(S) < 3) return 0;
    var u = s.units;
    if (s.kind === 'town') { u *= Math.pow(1.025, y - START_YEAR); if (y >= 1927 && !(y === 1927 && month(S) < 4)) u *= 0.8; }
    if (s.id === 'gold') { if (y > 1906 || (y === 1906 && month(S) >= 3)) u *= 1.4; if (y > 1920) u *= Math.pow(0.9, y - 1920); }
    if (s.id === 'coal') u *= Math.pow(1.02, Math.max(0, y - 1900));
    if (s.id === 'farm') { u *= Math.pow(1.025, y - START_YEAR); if (y === 1910) u *= 0.4; }
    if (s.id === 'copper') u *= Math.pow(1.12, y - 1925);
    if (s.id === 'west') u *= Math.pow(1.04, Math.max(0, y - 1902));
    return u;
  }
  function tradeFactor(S) {
    var y = year(S), m = month(S), f = 1;
    if ((y === 1899 && m >= 9) || y === 1900 || y === 1901 || (y === 1902 && m < 5)) f *= 1.3;
    if (y === 1903 || y === 1904) f *= 0.85;
    if (y === 1921 || y === 1922) f *= 0.8;
    if ((y === 1929 && m >= 9) || y === 1930) f *= 0.75;
    return f;
  }
  function traffic(S, map) {
    var dp = distancesFromPort(S, map), y = year(S), port = map.source('port');
    var list = [], demand = 0;
    map.sources.forEach(function (s) {
      if (s.id === 'port' || !S.stations[s.id]) return;
      var k = key(s.c, s.r);
      if (dp.dist[k] === undefined) return;
      var u = unitsFor(S, s, y) * tradeFactor(S);
      if (u <= 0) { list.push({ s: s, units: 0, td: dp.dist[k], rd: octile(s, port), rev: 0, load: 0 }); return; }
      var td = dp.dist[k], rd = Math.max(1, Math.min(td, octile(s, port) * 1.1));
      var rate = (s.kind === 'town' ? P.townRate : P.freightRate) * S.rateFactor;
      var load = u * td;
      demand += load;
      list.push({ s: s, units: u, td: td, rd: rd, rev: u * rd * rate, load: load });
    });
    var trackF = 0.7 + 0.3 * Math.min(1, S.trackCond / 60);
    var capacity = S.trains * P.trainCapacity * (0.6 + 0.4 * S.stockCond / 100) * trackF;
    var carried = demand > 0 ? Math.min(1, capacity / demand) : 1;
    return { list: list, demand: demand, capacity: capacity, carried: carried, dp: dp };
  }

  /* ---------- monthly simulation ---------- */
  function news(S, text, kind) { S.news.unshift({ d: dateStr(S), t: text, k: kind || 'info' }); if (S.news.length > 60) S.news.length = 60; }
  function fmt(n) { n = Math.round(n); return (n < 0 ? '-' : '') + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function renewalsNeeded(S) { return P.renewTrackPct * (S.cap.lines + S.cap.stations + S.cap.capitalised) + P.renewStockPct * S.cap.stock; }
  function trackLength(S) { var n = 0; Object.keys(S.edges).forEach(function (e) { n += S.edges[e]; }); return n; }

  function fireEvents(S) {
    var y = year(S), m = month(S);
    EVENTS.forEach(function (ev) {
      if (ev.y === y && ev.m === m && !S.firedEvents[ev.id]) {
        S.firedEvents[ev.id] = 1;
        if (ev.id !== 'start') news(S, ev.head, 'event');
        if (ev.choice || ev.id !== 'start') S.pending = S.pending || [];
        if (ev.id !== 'start' && ev.id !== 'end') S.pending.push(ev.id);
        if (ev.id === 'crash') S.tmarket = 0.75;
        if (ev.id === 'ww1') S.tmarket = 0.9;
        if (ev.id === 'armistice') S.tmarket = 1;
      }
    });
  }

  function acceptGuarantee(S, yes) {
    S.guarantee = yes ? 'accepted' : 'declined';
    if (yes) {
      S.cap.gdebs += 500000; S.cash += 500000; S.rateFactor *= 0.9; S.rateCap = 0.9;
      news(S, 'Guarantee accepted: £500,000 of 3½% guaranteed debentures issued; rates reduced by 10%.', 'finance');
    } else news(S, 'The Board declines the Government guarantee and keeps its rates.', 'finance');
  }

  function monthTick(S, map) {
    if (S.gameOver) return;
    fireEvents(S);
    var yr = S.yr, mult = costMult(S);
    // construction
    S.projects.forEach(function (p) {
      var n = 0;
      while (p.done < p.edges.length && n < P.buildPerMonth) {
        var e = p.edges[p.done];
        var t = map.tile(e.b[0], e.b[1]);
        var slow = t.t === map.T.MOUNT ? 2 : t.t === map.T.HILLS || t.t === map.T.RIVER ? 1.5 : 1;
        n += slow;
        var c = e.cost; // cost locked when committed
        S.cash -= c; S.cap.lines += c; yr.constr += c;
        var ka = key(e.a[0], e.a[1]), kb = key(e.b[0], e.b[1]);
        S.edges[ekey(ka, kb)] = (e.a[0] !== e.b[0] && e.a[1] !== e.b[1]) ? SQ2 : 1;
        [e.a, e.b].forEach(function (tt) {
          var src = map.tile(tt[0], tt[1]).src;
          if (src && !S.stations[src]) {
            var sc = P.stationCost * mult;
            S.stations[src] = true; S.cash -= sc; S.cap.stations += sc; yr.constr += sc;
            news(S, 'Line opened to ' + map.source(src).name + '.', 'build');
            if (src === 'gold') S.objectives.gold = true;
          }
        });
        p.done++;
      }
    });
    S.projects = S.projects.filter(function (p) { return p.done < p.edges.length; });

    // traffic and receipts
    var tf = traffic(S, map), mrev = 0;
    S.demand = tf.demand; S.capacity = tf.capacity; S.carried = tf.carried;
    tf.list.forEach(function (x) {
      var rv = x.rev * tf.carried / 12;
      mrev += rv;
      if (x.s.kind === 'town') yr.pass += rv; else yr.goods += rv;
      yr.bySrc[x.s.id] = (yr.bySrc[x.s.id] || 0) + rv;
      if (map.territory(x.s.c, x.s.r) === 'colony') yr.colonyRev += rv; else yr.protRev += rv;
    });
    S.cash += mrev;
    // working expenses
    var tiles = trackLength(S), nst = Object.keys(S.stations).length;
    var coal = S.stations.coal && year(S) >= 1900 ? 0.85 : 1;
    var way = tiles * P.maintPerTile * mult / 12;
    var loco = (S.trains * P.locoPerTrain * mult / 12 + mrev * P.locoPctRev * coal);
    var trafficX = mrev * P.trafficPctRev + nst * P.trafficPerStation * mult / 12;
    var gen = (P.general + 400 * Math.max(0, S.trains - 4)) * mult / 12;
    yr.way += way; yr.loco += loco; yr.traffic += trafficX; yr.general += gen;
    S.cash -= way + loco + trafficX + gen;
    // renewals programme
    var need = renewalsNeeded(S) / 12;
    var spend = need * S.renewPct * mult;
    var trackShare = need > 0 ? P.renewTrackPct * (S.cap.lines + S.cap.stations + S.cap.capitalised) / 12 / need : 0.5;
    S.cash -= spend;
    var fromFund = Math.min(Math.max(0, S.fund), spend);
    S.fund -= fromFund; yr.renewFund += fromFund;
    var toRev = spend - fromFund;
    yr.renewWayRev += toRev * trackShare; yr.renewStockRev += toRev * (1 - trackShare);
    var eff = S.renewPct / materialMult(S);
    if (tiles > 0) S.trackCond = Math.max(0, Math.min(100, S.trackCond - P.trackWear / 12 + eff * P.trackWear / 12 * (S.renewPct > 1 ? 1.6 : 1)));
    if (S.trains > 0) S.stockCond = Math.max(0, Math.min(100, S.stockCond - P.stockWear / 12 + eff * P.stockWear / 12 * (S.renewPct > 1 ? 1.6 : 1)));
    // depreciation provision
    if (S.method === 'depreciation') {
      var dep = (P.depTrackPct * (S.cap.lines + S.cap.stations + S.cap.capitalised) + P.depStockPct * S.cap.stock) / 12;
      yr.dep += dep; S.fund += dep;
    }
    // interest
        var intr = (S.cap.debs * (S.debAvgRate || P.debRate) + S.cap.gdebs * P.gdebRate) / 12;
    if (S.cash < 0) intr += -S.cash * P.odRate / 12;
    S.cash -= intr; yr.interest += intr;
    // accidents
    if (tiles > 0 && S.trackCond < 60 && rng(S) < (60 - S.trackCond) / 60 * 0.14) {
      var comp = Math.round((15000 + rng(S) * 40000) * mult / 1000) * 1000;
      S.cash -= comp; yr.comp += comp; S.accidents++;
      yr.accidents.push({ d: dateStr(S), comp: comp });
      S.trust = Math.max(0, S.trust - (S.disclosure === 'minimal' ? 4 : 7));
      news(S, 'Derailment! A goods train leaves worn track near ' + randomPlace(S, map) + '. Compensation and repairs: £' + fmt(comp) + '. The Inspector blames deferred renewals.', 'bad');
    }
    // market drift
    var tgt = targetPrice(S);
    S.price = Math.max(0.05, S.price + (tgt - S.price) * 0.08 + (rng(S) - 0.5) * 0.012);
    if (month(S) === 11 || S.m % 3 === 2) { S.priceHist.push(+S.price.toFixed(3)); if (S.priceHist.length > 160) S.priceHist.shift(); }
    // receivership
    if (S.cash < -P.odLimit - 0.1 * S.cap.shares) {
      S.gameOver = { reason: 'receivership', d: dateStr(S) };
      news(S, 'The bank refuses further credit. Debenture interest cannot be met and the trustees appoint a receiver.', 'bad');
    }
    if (S.trains >= 2) S.objectives.loco2 = true;
    S.m++;
  }
  function randomPlace(S, map) {
    var on = map.sources.filter(function (s) { return S.stations[s.id] && s.id !== 'port'; });
    if (!on.length) return 'the port';
    return on[Math.floor(rng(S) * on.length)].name;
  }

  /* ---------- market ---------- */
  function gearing(S) { var d = S.cap.debs + S.cap.gdebs; return d / (d + S.cap.shares + S.cap.premium); }
  function requiredYield(S) { return 0.042 + 0.03 * (1 - S.trust / 100) + 0.02 * gearing(S) + (S.tmarket < 1 ? 0.012 : 0); }
  function expectedDividend(S) {
    var y = year(S);
    var prospect = Math.max(0, 0.068 - 0.006 * (y - START_YEAR));
    var eps = S.lastEps || 0;
    return Math.max(prospect, 0.6 * S.lastDiv + 0.4 * Math.max(0, eps));
  }
  function targetPrice(S) { return Math.max(0.05, expectedDividend(S) / requiredYield(S) * S.tmarket); }

  /* ---------- finance ---------- */
  function debLimit(S) { return Math.max(0, S.cap.shares - S.cap.debs); }
  function debRateNow(S) { var y = year(S); return y >= 1914 && y <= 1922 ? 0.06 : y > 1922 ? 0.055 : 0.05; }
  function issueDebentures(S, amt) {
    amt = Math.min(amt, debLimit(S));
    if (amt <= 0) return { ok: false, msg: 'Borrowing powers exhausted: debentures may not exceed paid-up share capital.' };
    var rate = debRateNow(S);
    var oldInt = S.cap.debs * (S.debAvgRate || P.debRate);
    S.cap.debs += amt; S.cash += amt;
    S.debAvgRate = (oldInt + amt * rate) / S.cap.debs;
    news(S, 'Issued £' + fmt(amt) + ' of ' + (rate * 100).toFixed(1) + '% debentures.', 'finance');
    return { ok: true };
  }
  function issueShares(S, n) {
    if (S.price < 1) return { ok: false, msg: 'The shares stand below par (' + priceStr(S.price) + '). Shares may not be issued at a discount: Ooregum Gold Mining Co of India v Roper [1892] AC 125.' };
    var issuePrice = Math.max(1, S.price * 0.95);
    var gross = n * issuePrice, exp = gross * 0.02;
    S.cap.shares += n; S.cap.premium += gross - n; S.cap.issueExp += exp; S.cash += gross - exp;
    S.trust = Math.max(0, S.trust - 2);
    news(S, 'Issued ' + fmt(n) + ' new £1 shares at ' + priceStr(issuePrice) + ', raising £' + fmt(gross) + ' (expenses £' + fmt(exp) + ').', 'finance');
    return { ok: true, price: issuePrice };
  }
  function buyLoco(S) {
    var c = P.locoCost * costMult(S);
    S.cash -= c; S.cap.stock += c; S.yr.stockBuy += c;
    S.stockCond = (S.stockCond * S.trains + 100) / (S.trains + 1);
    S.trains++;
    news(S, 'New locomotive and wagons delivered (No. ' + S.trains + '): £' + fmt(c) + '.', 'build');
  }
  function priceStr(p) { var s = Math.floor(p), d = Math.round((p - s) * 20); if (d === 20) { s++; d = 0; } return '£' + s + ' ' + d + 's'; }

  /* ---------- AGM ---------- */
  function agmItems(S) {
    if (!trackLength(S)) return [];
    var n = 2 + (rng(S) < 0.4 ? 1 : 0), out = [], used = {};
    var scale = Math.min(2.5, 0.3 + trackLength(S) / 80) * costMult(S);
    while (out.length < n) {
      var i = Math.floor(rng(S) * ITEMS.length);
      if (used[i]) continue; used[i] = 1;
      var it = ITEMS[i];
      out.push({ i: i, name: it.name, cls: it.cls, why: it.why, amt: Math.round((it.amt[0] + rng(S) * (it.amt[1] - it.amt[0])) * scale / 100) * 100 });
    }
    return out;
  }
  function revenueAccount(S) {
    var y = S.yr;
    var receipts = y.goods + y.pass + y.extraRev;
    var exp = {
      way: y.way + y.renewWayRev, loco: y.loco, carriage: y.renewStockRev, traffic: y.traffic, general: y.general,
      comp: y.comp, dep: y.dep, revItems: y.revItems
    };
    var totalExp = 0; Object.keys(exp).forEach(function (k) { totalExp += exp[k]; });
    return { receipts: receipts, goods: y.goods, pass: y.pass, exp: exp, totalExp: totalExp, net: receipts - totalExp, opRatio: receipts > 0 ? totalExp / receipts : 0 };
  }
  function colonyShare(S, map, basis) {
    if (basis === 'mileage') {
      var col = 0, tot = 0;
      Object.keys(S.edges).forEach(function (e) {
        var p = e.split('|'), a = unkey(p[0]), b = unkey(p[1]), len = S.edges[e];
        tot += len;
        col += len * ((map.territory(a[0], a[1]) === 'colony' ? 0.5 : 0) + (map.territory(b[0], b[1]) === 'colony' ? 0.5 : 0));
      });
      return tot ? col / tot : 1;
    }
    var t = S.yr.colonyRev + S.yr.protRev;
    return t ? S.yr.colonyRev / t : 1;
  }
  function taxFor(S, map, basis, profit) {
    var y = year(S);
    if (y < 1919 || profit <= 0) return { colony: 0, prot: 0, total: 0, share: colonyShare(S, map, basis) };
    var sh = colonyShare(S, map, basis);
    var col = profit * sh * 0.075, prot = y >= 1926 ? profit * (1 - sh) * 0.10 : 0;
    return { colony: col, prot: prot, total: col + prot, share: sh };
  }
  // Draft the year's figures for the AGM (before appropriation)
  function agmDraft(S, map) {
    var ra = revenueAccount(S);
    return { year: year(S), ra: ra, interest: S.yr.interest, items: agmItems(S), nraBF: S.nraBF, accidents: S.yr.accidents.slice(), trackCond: S.trackCond, stockCond: S.stockCond, need: renewalsNeeded(S) };
  }
  // choices: {classes:[...], renewPct, method, taxBasis, divPct, disclosure}
  function maxDividend(S, map, draft, choices) {
    var res = settle(S, map, draft, choices, true);
    return res.available;
  }
  function settle(S, map, draft, ch, dry) {
    // classification
    var capd = 0, revd = 0, wrong = [], conservative = [];
    draft.items.forEach(function (it, i) {
      var c = ch.classes[i] || 'revenue';
      if (c === 'capital') capd += it.amt; else revd += it.amt;
      if (c === 'capital' && it.cls === 'revenue') wrong.push(it);
      if (c === 'revenue' && it.cls === 'capital') conservative.push(it);
    });
    // auditor: deterministic per year so preview and outcome agree
    var detected = [];
    wrong.forEach(function (it, j) {
      var h = ((draft.year * 131 + it.i * 17 + j * 7) % 100) / 100;
      if (h < 0.45) detected.push(it);
    });
    var detAmt = 0; detected.forEach(function (it) { detAmt += it.amt; });
    var revItems = revd + detAmt, capItems = capd - detAmt;
    var net = draft.ra.net - revItems; // revItems not yet in ra
    var pbt = net - draft.interest;
    var basis = ch.taxBasis || S.taxBasis || 'mileage';
    var tax = taxFor(S, map, basis, pbt);
    var penalty = 0;
    if (draft.year >= 1919 && S.taxBasis && ch.taxBasis && ch.taxBasis !== S.taxBasis) {
      var other = taxFor(S, map, S.taxBasis, pbt);
      penalty = Math.max(0, other.total - tax.total) * 2 + 3000;
    }
    var profitAfterTax = pbt - tax.total - penalty;
    var available = draft.nraBF + profitAfterTax;
    var divAmt = Math.max(0, (ch.divPct || 0) / 100 * S.cap.shares);
    var res = { capItems: capItems, revItems: revItems, wrong: wrong, detected: detected, conservative: conservative, net: net, pbt: pbt, tax: tax, penalty: penalty, profitAfterTax: profitAfterTax, available: available, divAmt: divAmt, basis: basis };
    if (dry) return res;
    return res;
  }
  function finalizeAGM(S, map, draft, ch) {
    var res = settle(S, map, draft, ch, false);
    if (res.divAmt > Math.max(0, res.available) + 1) return { ok: false, msg: 'Dividends may only be paid out of profits. The proposed dividend exceeds the balance available.' };
    var y = draft.year, prevTrust = S.trust, prevPrice = S.price;
    // post classified items
    var itemsTotal = res.capItems + res.revItems;
    S.cash -= itemsTotal; S.cap.capitalised += res.capItems; S.yr.revItems += res.revItems;
    var ra = revenueAccount(S);
    S.cash -= res.tax.total + res.penalty;
    S.cash -= res.divAmt;
    var divRate = res.divAmt / S.cap.shares;
    var nraCF = res.available - res.divAmt;
    // trust & market
    var notes = [];
    var t = 0;
    if (res.detected.length) { t -= 15; S.qualified++; notes.push('The auditors qualify their report.'); }
    var undetected = res.wrong.filter(function (w) { return res.detected.indexOf(w) < 0; });
    undetected.forEach(function (w) { S.misclassHidden += w.amt; });
    S.misclassTotal += res.wrong.length; S.conservative += res.conservative.length;
    if (res.penalty > 0) { t -= 5; S.taxBasisChanges++; notes.push('Dispute with the revenue authorities over the change of basis.'); }
    if (draft.year >= 1919 && ch.taxBasis) S.taxBasis = ch.taxBasis;
    if (ch.method && ch.method !== S.method) {
      if (ch.disclosure !== 'full') t -= 3;
      notes.push('Change of accounting policy: ' + (ch.method === 'depreciation' ? 'a depreciation fund is established.' : 'the depreciation fund is discontinued.'));
      S.method = ch.method;
    }
    if (S.method === 'depreciation' && ch.renewPct >= 1) t += 2;
    if (S.divPaidYears > 0 || S.lastDiv > 0) {
      if (divRate >= S.lastDiv - 1e-6 && divRate > 0) t += 3;
      else if (divRate > 0) t -= Math.min(6, (S.lastDiv - divRate) * 100) * (ch.disclosure === 'full' ? 0.5 : 1);
      else t -= ch.disclosure === 'full' ? 5 : 8;
    } else if (divRate > 0) t += 4;
    if (res.profitAfterTax < res.divAmt && res.divAmt > 0) t -= 3;
    var acc = draft.accidents.length;
    if (ch.disclosure === 'full') { t += 3; if (S.trackCond < 60) t -= 4; }
    if (ch.disclosure === 'minimal') { t -= 2; if (acc) t -= 4 * acc; }
    if (ra.receipts > 0 && ra.opRatio < 0.55) t += 1;
    t += (60 - S.trust) * 0.12; // memories fade: trust drifts back toward the market norm
    S.trust = Math.max(0, Math.min(100, S.trust + t));
    S.lastEps = res.profitAfterTax / S.cap.shares;
    S.lastDiv = divRate; S.cumDiv += divRate; if (divRate > 0) S.divPaidYears++;
    S.renewPct = ch.renewPct; S.disclosure = ch.disclosure;
    S.price = Math.max(0.05, S.price + (targetPrice(S) - S.price) * 0.5);
    var report = buildReport(S, map, draft, ch, res, ra, nraCF, divRate);
    report.trustDelta = S.trust - prevTrust; report.priceBefore = prevPrice; report.priceAfter = S.price; report.notes = notes;
    report.press = press(S, report);
    S.reports.push(report);
    if (S.reports.length > 40) S.reports.shift();
    // Railway Rates Commission (from 1905): net receipts above 7% of capital expenditure trigger rate cuts
    var roc = report.capExp > 0 ? ra.net / report.capExp : 0;
    report.roc = roc; report.rateCut = 0;
    if (y >= 1905 && roc > 0.07) {
      var cut = Math.min(0.15, (roc - 0.07) / roc * 0.7);
      S.rateFactor *= 1 - cut; report.rateCut = cut;
      news(S, 'The Railway Rates Commission finds net receipts of ' + (roc * 100).toFixed(1) + '% on capital and orders rates reduced by ' + (cut * 100).toFixed(1) + '%.', 'event');
    } else if (y >= 1905 && roc < 0.045 && S.rateFactor < S.rateCap) {
      var inc = Math.min(0.06, S.rateCap - S.rateFactor);
      S.rateFactor += inc; report.rateCut = -inc;
      news(S, 'The Railway Rates Commission accepts the company\u2019s case and allows a ' + Math.round(inc / S.rateFactor * 100) + '% increase in rates.', 'event');
    }
    S.nraBF = nraCF;
    S.yr = blankYear();
    S.objectives.agm = true; S.lastAGM = y;
    news(S, 'Annual General Meeting: dividend ' + (divRate * 100).toFixed(1) + '%. Shares ' + priceStr(S.price) + '.', 'agm');
    if (y >= END_YEAR) S.gameOver = { reason: 'complete', d: 'December 1930' };
    return { ok: true, report: report };
  }
  function buildReport(S, map, draft, ch, res, ra, nraCF, divRate) {
    var c = S.cap;
    var capReceipts = c.shares + c.premium + c.debs + c.gdebs;
    var capExp = c.lines + c.stations + c.stock + c.capitalised + c.issueExp;
    var capBal = capReceipts - capExp;
    var bs = { capBal: capBal, fund: S.fund, nra: nraCF, cash: S.cash };
    var check = capBal + S.fund + nraCF - S.cash;
    return {
      year: draft.year, disclosure: ch.disclosure, method: S.method,
      cap: JSON.parse(JSON.stringify(c)), capReceipts: capReceipts, capExp: capExp, capBal: capBal,
      ra: ra, interest: draft.interest, tax: res.tax, penalty: res.penalty, nraBF: draft.nraBF, profitAfterTax: res.profitAfterTax,
      available: res.available, divAmt: res.divAmt, divRate: divRate, nraCF: nraCF,
      bs: bs, check: check, items: draft.items, classes: ch.classes, detected: res.detected.map(function (d) { return d.i; }), wrong: res.wrong.map(function (d) { return d.i; }), conservative: res.conservative.map(function (d) { return d.i; }),
      trackCond: S.trackCond, stockCond: S.stockCond, accidents: draft.accidents, renewPct: ch.renewPct, need: draft.need,
      miles: trackLength(S), trains: S.trains, stations: Object.keys(S.stations).length, basis: res.basis
    };
  }
  function press(S, r) {
    var q = [];
    if (r.detected.length) q.push('“The auditors’ note on the capital account will not reassure holders. Expenditure the Board called capital was, in the auditors’ view, ordinary upkeep.”');
    if (r.accidents.length && r.disclosure !== 'full') q.push('“Shareholders will look in vain in the report for any account of the year’s derailments.”');
    if (r.accidents.length && r.disclosure === 'full') q.push('“The Board is candid about the condition of the permanent way. Candour is welcome; the expenditure it implies is less so.”');
    if (r.divRate > 0 && r.divAmt > r.profitAfterTax + 1) q.push('“The dividend has been maintained by drawing on the balance brought forward — a practice that cannot long continue.”');
    if (r.method === 'depreciation' && r.renewPct >= 1) q.push('“The provision for depreciation marks this Board out as unusually prudent among colonial lines.”');
    if (r.renewPct < 0.7 && r.disclosure === 'full') q.push('“The report admits that renewals have been cut. Profits flatter the true position.”');
    if (r.penalty) q.push('“The company’s change of basis has provoked the Treasury. The tax dispute is costly and avoidable.”');
    if (r.divRate === 0 && r.year > 1897) q.push('“No dividend again. Holders who subscribed in 1896 are losing patience.”');
    if (r.divRate >= 0.06) q.push('“A ' + (r.divRate * 100).toFixed(1) + '% distribution places the company among the more remunerative colonial railways.”');
    if (r.ra.opRatio > 0 && r.ra.opRatio < 0.5) q.push('“Working expenses are well controlled at ' + Math.round(r.ra.opRatio * 100) + '% of receipts.”');
    if (r.disclosure === 'minimal') q.push('“The accounts are as brief as the law allows. The market draws its own conclusions.”');
    if (!q.length) q.push('“A steady report from the Port Lindsay and Interior company.”');
    return q.slice(0, 2);
  }

  /* ---------- scoring ---------- */
  function valuation(S) {
    var c = S.cap, trackCost = c.lines + c.stations + c.capitalised;
    var arrears = (100 - S.trackCond) / 100 * trackCost * 0.6 + (100 - S.stockCond) / 100 * c.stock * 0.8;
    var assets = c.lines + c.stations + c.stock + c.capitalised - arrears + Math.max(0, S.cash);
    var claims = c.debs + c.gdebs + Math.max(0, -S.cash);
    var perShare = Math.max(0, (assets - claims) / c.shares);
    return { arrears: arrears, assets: assets, claims: claims, perShare: perShare, terms: 0.5 * S.price + 0.5 * perShare };
  }
  function finalScore(S) {
    var val = valuation(S);
    var tsr = val.terms + S.cumDiv; // per £1 share subscribed in 1896
    var years = Math.max(1, year(S) - START_YEAR + (S.gameOver && S.gameOver.reason === 'complete' ? 0 : 0));
    var annual = tsr > 0 ? Math.pow(tsr, 1 / 35) - 1 : -1;
    var pts = 0;
    pts += Math.max(0, Math.min(40, annual * 100 * 6 + 10));
    pts += Math.max(0, 20 - S.qualified * 6);
    pts += Math.round(Math.min(100, (S.trackCond + S.stockCond) / 2) / 100 * 20);
    pts += S.gameOver && S.gameOver.reason === 'receivership' ? 0 : 10;
    pts += Math.max(0, 10 - S.accidents * 2);
    var grade = pts >= 85 ? 'A' : pts >= 70 ? 'B' : pts >= 55 ? 'C' : pts >= 40 ? 'D' : 'E';
    return { tsr: tsr, annual: annual, pts: Math.round(pts), grade: grade, val: val };
  }

  var api = {
    P: P, EVENTS: EVENTS, ITEMS: ITEMS, START_YEAR: START_YEAR, END_YEAR: END_YEAR, MONTHS: MONTHS,
    newGame: newGame, monthTick: monthTick, planRoute: planRoute, commitRoute: commitRoute, traffic: traffic,
    year: year, month: month, dateStr: dateStr, fmt: fmt, priceStr: priceStr,
    agmDraft: agmDraft, settle: settle, finalizeAGM: finalizeAGM, maxDividend: maxDividend, revenueAccount: revenueAccount,
    issueDebentures: issueDebentures, issueShares: issueShares, buyLoco: buyLoco, debLimit: debLimit, debRateNow: debRateNow, acceptGuarantee: acceptGuarantee,
    renewalsNeeded: renewalsNeeded, trackLength: trackLength, targetPrice: targetPrice, requiredYield: requiredYield, gearing: gearing,
    costMult: costMult, colonyShare: colonyShare, taxFor: taxFor, finalScore: finalScore, valuation: valuation, distancesFromPort: distancesFromPort, pathToPort: pathToPort,
    key: key, unkey: unkey, ekey: ekey, unitsFor: unitsFor, eventById: function (id) { for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i]; }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RLEcon = api;
})(this);
