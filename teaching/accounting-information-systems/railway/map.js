/* Rails & Ledgers — map generation (no DOM). Fixed seed so every student shares one map. */
(function (root) {
  'use strict';
  var W = 60, H = 48;
  var T = { SEA: 0, PLAINS: 1, FOREST: 2, HILLS: 3, MOUNT: 4, SWAMP: 5, RIVER: 6, LAKE: 7 };
  var TNAME = ['Sea', 'Open veld', 'Woodland', 'Hills', 'Mountains', 'Swamp', 'River', 'Lake'];
  var COST = [Infinity, 22000, 28000, 45000, 95000, 36000, 62000, Infinity]; // river = open veld + £40k bridge

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function makeNoise(seed) {
    var rnd = mulberry32(seed), N = 64, g = new Float32Array(N * N);
    for (var i = 0; i < N * N; i++) g[i] = rnd();
    function at(x, y) { return g[((y % N + N) % N) * N + ((x % N + N) % N)]; }
    return function (x, y) {
      var x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
      var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      var a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
  }
  function fbm(n, x, y) {
    var s = 0, a = 0.5, f = 1;
    for (var o = 0; o < 4; o++) { s += a * n(x * f, y * f); a *= 0.5; f *= 2; }
    return s / 0.9375;
  }

  var SOURCES = [
    { id: 'port', name: 'Port Lindsay', kind: 'port', c: 50, r: 28, units: 0, note: 'The company’s harbour and headquarters. All traffic is carried to or from the port.' },
    { id: 'fort', name: 'Fort Carrow', kind: 'town', c: 40, r: 30, units: 18000, note: 'Administrative town of the lowveld. Passengers and general goods.' },
    { id: 'elm', name: 'Elm Drift', kind: 'town', c: 33, r: 36, units: 12000, note: 'Market town on the southern road.' },
    { id: 'high', name: 'Highveld', kind: 'town', c: 26, r: 24, units: 15000, note: 'Settler town on top of the escarpment. Reaching it means climbing the ridge.' },
    { id: 'king', name: 'Kingsford', kind: 'town', c: 18, r: 38, units: 10000, note: 'Western plateau town.' },
    { id: 'lake', name: 'Lake Station', kind: 'town', c: 30, r: 12, units: 9000, note: 'Lakeside settlement in the Northern Protectorate.' },
    { id: 'north', name: 'Northgate', kind: 'town', c: 22, r: 8, units: 11000, note: 'Protectorate capital.' },
    { id: 'gold', name: 'Mount Hollis Goldfield', kind: 'gold', c: 24, r: 32, units: 45000, note: 'Gold reefs: heavy machinery in, stores and bullion out. Booms in 1906, declines after 1920.' },
    { id: 'coal', name: 'Blackrock Colliery', kind: 'coal', c: 36, r: 41, units: 55000, from: 1900, note: 'Opens 1900. Connecting it also cuts locomotive fuel costs by 15%.' },
    { id: 'farm', name: 'Greenvale Farms', kind: 'farm', c: 42, r: 20, units: 16000, note: 'Maize and tobacco. Vulnerable to drought.' },
    { id: 'copper', name: 'Northern Copperfield', kind: 'copper', c: 12, r: 6, units: 60000, from: 1925, note: 'Copper deposits proved in 1925. Enormous traffic, growing fast — but deep in the Protectorate.' },
    { id: 'west', name: 'To the Southern Lines', kind: 'junction', c: 3, r: 30, units: 18000, from: 1902, note: 'Interchange with the southern railway system, opens 1902. Through traffic to the port.' }
  ];

  function generate(seed) {
    seed = seed || 1896;
    var n1 = makeNoise(seed), n2 = makeNoise(seed + 11), n3 = makeNoise(seed + 23), n4 = makeNoise(seed + 37), n5 = makeNoise(seed + 51);
    var tiles = new Array(W * H);
    var coast = [];
    for (var r = 0; r < H; r++) {
      var cx = 51.2 + (fbm(n1, r * 0.13, 3.3) - 0.5) * 7;
      if (r >= 25 && r <= 31) cx = 50.6;
      if (r >= 32 && r <= 34) cx = Math.min(cx, 52);
      coast.push(cx);
    }
    for (r = 0; r < H; r++) for (var c = 0; c < W; c++) {
      var t = { c: c, r: r, t: T.PLAINS, e: 0, lv: 0, v: n5(c * 0.9, r * 0.9) };
      tiles[r * W + c] = t;
      var cx2 = coast[r];
      if (c > cx2) { t.t = T.SEA; t.e = -1; continue; }
      var e;
      if (c >= 32) e = 0.32 * (cx2 - c) / (cx2 - 32);
      else e = 0.5 + 0.12 * (32 - c) / 32;
      // escarpment ridge centred on c=30, rows 13..29
      var rowT = r < 13 || r > 29 ? 0 : Math.min(1, (r - 12) / 3, (30 - r) / 3);
      var d = Math.abs(c - 30 + (fbm(n4, r * 0.2, 1) - 0.5) * 2);
      var ridge = Math.max(0, 1 - d / 3.4) * rowT;
      e += ridge * 0.62;
      // scattered kopjes and ranges on the plateau
      if (c < 30) e += Math.max(0, fbm(n5, c * 0.21 + 7, r * 0.21) - 0.6) * 1.6;
      e += (fbm(n2, c * 0.13, r * 0.13) - 0.5) * 0.34;
      t.e = e;
    }
    function T_(c, r) { return c >= 0 && r >= 0 && c < W && r < H ? tiles[r * W + c] : null; }
    // classify
    tiles.forEach(function (t) {
      if (t.t === T.SEA) return;
      var e = t.e;
      if (e > 0.88) t.t = T.MOUNT;
      else if (e > 0.66) t.t = T.HILLS;
      else t.t = T.PLAINS;
      if (t.t !== T.MOUNT && fbm(n3, t.c * 0.16, t.r * 0.16) > 0.6) t.t = T.FOREST;
      if (t.c > 40 && e < 0.1 && fbm(n4, t.c * 0.22, t.r * 0.22) > 0.6) t.t = T.SWAMP;
    });
    // river from (16,20) to the coast, gentle meander, 4-connected
    var river = [], pr = 20;
    for (var rc = 16; rc < W; rc++) {
      var tr = Math.round(20 + 2.2 * Math.sin(rc * 0.33) + (rc - 16) * 0.03 + (fbm(n1, rc * 0.2, 9) - 0.5) * 2);
      while (pr !== tr) { pr += tr > pr ? 1 : -1; var tt = T_(rc, pr); if (tt && tt.t !== T.SEA) river.push(tt); }
      var t2 = T_(rc, pr);
      if (!t2 || t2.t === T.SEA) break;
      river.push(t2);
    }
    river.forEach(function (t) {
      t.t = T.RIVER; t.e = Math.min(t.e, 0.5);
      for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
        var nb = T_(t.c + dc, t.r + dr);
        if (nb && nb.t === T.MOUNT) nb.t = T.HILLS; // river gorge through the ridge
      }
    });
    // lake
    tiles.forEach(function (t) {
      var dx = (t.c - 34) / 3.3, dy = (t.r - 8.5) / 2.3;
      if (dx * dx + dy * dy < 1) { t.t = T.LAKE; }
    });
    // sources on buildable ground
    SOURCES.forEach(function (s) {
      var t = T_(s.c, s.r);
      if (t.t !== T.HILLS) t.t = T.PLAINS;
      t.src = s.id;
    });
    // heights for rendering
    tiles.forEach(function (t) {
      if (t.t === T.SEA) t.lv = -1;
      else if (t.t === T.LAKE) t.lv = 1;
      else {
        var lv = t.e < 0.12 ? 0 : t.e < 0.3 ? 1 : t.e < 0.52 ? 2 : t.e < 0.7 ? 3 : t.e < 0.86 ? 4 : 5;
        if (t.t === T.RIVER) lv = Math.max(0, lv - 1);
        if (t.t === T.MOUNT) lv = Math.max(lv, 5);
        t.lv = lv;
      }
    });
    // smooth: no land cliff greater than 2 levels except mountains
    for (var pass = 0; pass < 2; pass++) tiles.forEach(function (t) {
      if (t.lv < 0 || t.t === T.MOUNT) return;
      var mx = -9;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nb = T_(t.c + d[0], t.r + d[1]); if (nb && nb.t !== T.MOUNT) mx = Math.max(mx, nb.lv); });
      if (mx - t.lv > 2) t.lv = mx - 2;
    });
    T_(50, 28).lv = 0;
    return {
      W: W, H: H, T: T, tiles: tiles, sources: SOURCES, seed: seed, river: river,
      tile: T_,
      territory: function (c, r) { return r >= 18 ? 'colony' : 'protectorate'; },
      cost: function (c, r) { var t = T_(c, r); return t ? COST[t.t] : Infinity; },
      tname: function (t) { return TNAME[t.t]; },
      source: function (id) { for (var i = 0; i < SOURCES.length; i++) if (SOURCES[i].id === id) return SOURCES[i]; return null; },
      rng: mulberry32
    };
  }

  var api = { generate: generate, W: W, H: H, T: T, TNAME: TNAME, COST: COST, mulberry32: mulberry32 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RLMap = api;
})(this);
