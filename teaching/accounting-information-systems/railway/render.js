/* Rails & Ledgers — isometric renderer */
(function (root) {
  'use strict';
  var TW = 64, TH = 32, HW = 32, HH = 16, LH = 7;

  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    if (f >= 1) { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); }
    else { r *= f; g *= f; b *= f; }
    return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
  }
  function hash(c, r, k) { var h = (c * 374761393 + r * 668265263 + (k || 0) * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16); return (h >>> 0) / 4294967296; }

  var TOP = { 1: '#a8b062', 2: '#6f8f45', 3: '#a89a62', 4: '#8f8370', 5: '#7d8a55', 6: '#a8b062' };
  var SIDE = '#8a6a44', SIDE2 = '#6e5236';

  function Renderer(canvas, map, E) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.map = map; this.E = E;
    this.OX = map.H * HW + 60; this.OY = 90;
    this.WW = (map.W + map.H) * HW + 120; this.WH = (map.W + map.H) * HH + 180;
    this.zoom = 1; this.camX = 0; this.camY = 0;
    this.hover = null; this.ghost = null; this.trains = []; this.smoke = []; this.clouds = [];
    this.trackKey = ''; this.t = 0; this.selected = null;
    for (var i = 0; i < 9; i++) this.clouds.push({ x: Math.random() * this.WW, y: Math.random() * this.WH, s: 0.6 + Math.random() * 0.9, v: 6 + Math.random() * 8 });
    this.ship = { p: 0, dir: 1, wait: 0 };
    this.buildTerrain();
    this.buildMini();
  }
  var R = Renderer.prototype;
  R.iso = function (c, r, lv) { return { x: this.OX + (c - r) * HW, y: this.OY + (c + r) * HH - (lv || 0) * LH }; };
  R.tileLv = function (t) { return t.t === this.map.T.SEA ? -1 : t.lv; };
  R.center = function (c, r) { var t = this.map.tile(c, r); return this.iso(c, r, t ? Math.max(0, this.tileLv(t)) : 0); };

  R.buildTerrain = function () {
    var m = this.map, T = m.T, cv = document.createElement('canvas');
    cv.width = this.WW; cv.height = this.WH;
    var g = cv.getContext('2d'), self = this;
    // ocean backdrop
    var grad = g.createLinearGradient(0, 0, this.WW, this.WH);
    grad.addColorStop(0, '#2d5a78'); grad.addColorStop(1, '#1f4762');
    g.fillStyle = grad; g.fillRect(0, 0, this.WW, this.WH);
    var order = m.tiles.slice().sort(function (a, b) { return (a.c + a.r) - (b.c + b.r) || a.c - b.c; });
    var riverSet = {}; m.river.forEach(function (t) { riverSet[t.c + ',' + t.r] = 1; });
    order.forEach(function (t) {
      var lv = self.tileLv(t), p = self.iso(t.c, t.r, lv), x = p.x, y = p.y;
      var drop = (lv + 1) * LH + 2;
      if (t.t === T.SEA) {
        var coast = 0;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nb = m.tile(t.c + d[0], t.r + d[1]); if (nb && nb.t !== T.SEA) coast++; });
        var deep = Math.min(1, (t.c - 50) / 9);
        diamond(g, x, y, mix('#4f8fb0', '#2b5e80', deep < 0 ? 0 : deep) );
        if (coast) {
          g.strokeStyle = 'rgba(235,245,240,.6)'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath();
          var E4 = [[[-1, 0], [x - HW, y], [x, y - HH]], [[0, -1], [x, y - HH], [x + HW, y]], [[1, 0], [x + HW, y], [x, y + HH]], [[0, 1], [x, y + HH], [x - HW, y]]];
          E4.forEach(function (q) { var nb = m.tile(t.c + q[0][0], t.r + q[0][1]); if (nb && nb.t !== T.SEA) { g.moveTo(q[1][0] * 0.9 + x * 0.1, q[1][1] * 0.9 + y * 0.1 + 3); g.lineTo(q[2][0] * 0.9 + x * 0.1, q[2][1] * 0.9 + y * 0.1 + 3); } });
          g.stroke();
        }
        if (hash(t.c, t.r, 3) < 0.25) { g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.beginPath(); var wx = x - 12 + hash(t.c, t.r, 4) * 14, wy = y - 3 + hash(t.c, t.r, 5) * 6; g.moveTo(wx, wy); g.quadraticCurveTo(wx + 5, wy - 3, wx + 10, wy); g.stroke(); }
        return;
      }
      // side faces
      g.fillStyle = SIDE; g.beginPath(); g.moveTo(x - HW, y); g.lineTo(x, y + HH); g.lineTo(x, y + HH + drop); g.lineTo(x - HW, y + drop); g.closePath(); g.fill();
      g.fillStyle = SIDE2; g.beginPath(); g.moveTo(x, y + HH); g.lineTo(x + HW, y); g.lineTo(x + HW, y + drop); g.lineTo(x, y + HH + drop); g.closePath(); g.fill();
      // grass lip
      g.fillStyle = 'rgba(80,110,40,.55)'; g.beginPath(); g.moveTo(x - HW, y); g.lineTo(x, y + HH); g.lineTo(x + HW, y); g.lineTo(x + HW, y + 2); g.lineTo(x, y + HH + 2); g.lineTo(x - HW, y + 2); g.closePath(); g.fill();
      // top
      var base;
      if (t.t === T.LAKE) base = '#4b8bb0';
      else {
        base = TOP[t.t] || '#a8b062';
        // plateau dries out westwards; lowveld greener
        if (t.t === T.PLAINS || t.t === T.RIVER) base = mix('#b3ad66', '#94a85a', Math.min(1, Math.max(0, (t.c - 18) / 30)));
        if (t.lv >= 4 && t.t !== T.MOUNT) base = mix(base, '#a08c64', 0.35);
      }
      var nw = m.tile(t.c - 1, t.r), ne = m.tile(t.c, t.r - 1);
      var slope = ((nw ? self.tileLv(nw) : lv) - lv) + ((ne ? self.tileLv(ne) : lv) - lv);
      var f = 1 + (t.v - 0.5) * 0.12 - slope * 0.05;
      diamond(g, x, y, shade(base, f));
      if (t.t === T.LAKE) { g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 10, y); g.quadraticCurveTo(x - 4, y - 3, x + 2, y); g.stroke(); return; }
      // texture flecks
      for (var k = 0; k < 5; k++) {
        var fx = x + (hash(t.c, t.r, k) - 0.5) * 40, fy = y + (hash(t.c, t.r, k + 9) - 0.5) * 16;
        if (Math.abs(fx - x) / HW + Math.abs(fy - y) / HH > 0.9) continue;
        g.fillStyle = 'rgba(60,70,30,.18)'; g.fillRect(fx, fy, 2, 1);
      }
      if (t.t === T.SWAMP) {
        for (k = 0; k < 3; k++) { var sx = x + (hash(t.c, t.r, k + 20) - 0.5) * 30, sy = y + (hash(t.c, t.r, k + 30) - 0.5) * 10; g.fillStyle = 'rgba(70,120,130,.75)'; ell(g, sx, sy, 6, 2.5); g.fill(); }
        g.strokeStyle = '#4f5f2a'; g.lineWidth = 1;
        for (k = 0; k < 6; k++) { var rx = x + (hash(t.c, t.r, k + 40) - 0.5) * 40, ry = y + (hash(t.c, t.r, k + 50) - 0.5) * 14; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 1, ry - 5); g.moveTo(rx + 2, ry); g.lineTo(rx + 3, ry - 4); g.stroke(); }
      }
      if (t.t === T.HILLS) {
        g.fillStyle = shade('#9c8c5a', 0.92); ell(g, x - 6, y - 2, 13, 6); g.fill();
        g.fillStyle = shade('#b4a26a', 1.05); ell(g, x - 9, y - 4, 7, 3); g.fill();
        g.fillStyle = shade('#8c7d50', 0.95); ell(g, x + 9, y + 3, 9, 4); g.fill();
      }
      if (t.t === T.MOUNT) {
        var ph = 26 + hash(t.c, t.r, 7) * 16;
        g.fillStyle = '#7a6d5c'; g.beginPath(); g.moveTo(x - 26, y + 6); g.lineTo(x - 2, y - ph); g.lineTo(x + 24, y + 6); g.closePath(); g.fill();
        g.fillStyle = '#5c5246'; g.beginPath(); g.moveTo(x - 2, y - ph); g.lineTo(x + 24, y + 6); g.lineTo(x + 4, y + 8); g.closePath(); g.fill();
        g.fillStyle = '#efeae0'; g.beginPath(); g.moveTo(x - 2, y - ph); g.lineTo(x - 8, y - ph + 10); g.lineTo(x - 3, y - ph + 8); g.lineTo(x + 1, y - ph + 12); g.lineTo(x + 5, y - ph + 9); g.closePath(); g.fill();
        if (hash(t.c, t.r, 8) < 0.6) { g.fillStyle = '#6e6252'; g.beginPath(); g.moveTo(x + 4, y + 8); g.lineTo(x + 16, y - ph * 0.5); g.lineTo(x + 30, y + 4); g.closePath(); g.fill(); }
      }
      if (riverSet[t.c + ',' + t.r]) self.drawRiver(g, t, x, y, riverSet);
      if (t.t === T.FOREST) {
        var n = 4 + Math.floor(hash(t.c, t.r, 11) * 3), pts = [];
        for (k = 0; k < n; k++) pts.push([x + (hash(t.c, t.r, k + 60) - 0.5) * 38, y + (hash(t.c, t.r, k + 70) - 0.5) * 14]);
        pts.sort(function (a, b) { return a[1] - b[1]; });
        pts.forEach(function (q, i) { tree(g, q[0], q[1], 0.8 + hash(t.c, t.r, i + 80) * 0.5, t.c < 30); });
      } else if (t.t === T.PLAINS && hash(t.c, t.r, 12) < 0.12) {
        tree(g, x + (hash(t.c, t.r, 13) - 0.5) * 30, y + (hash(t.c, t.r, 14) - 0.5) * 10, 0.8, true);
      }
    });
    // territory border (between rows 17 and 18)
    g.save(); g.setLineDash([7, 5]); g.strokeStyle = 'rgba(120,30,30,.75)'; g.lineWidth = 2.2;
    g.beginPath();
    for (var c = 0; c < m.W; c++) {
      var t = m.tile(c, 18); if (!t || t.t === T.SEA) continue;
      var p = this.iso(c, 18, Math.max(0, t.lv));
      g.moveTo(p.x, p.y - HH); g.lineTo(p.x + HW, p.y);
    }
    g.stroke(); g.restore();
    // territory captions
    g.font = 'italic 600 22px Georgia, serif'; g.fillStyle = 'rgba(90,40,30,.5)'; g.textAlign = 'center';
    var pc = this.iso(10, 3, 3); g.fillText('NORTHERN PROTECTORATE', pc.x, pc.y);
    pc = this.iso(12, 44, 3); g.fillText('THE COLONY', pc.x, pc.y);
    pc = this.iso(56, 14, -1); g.fillStyle = 'rgba(230,240,245,.45)'; g.font = 'italic 24px Georgia, serif'; g.fillText('The Indian Ocean', pc.x + 60, pc.y);
    this.terrain = cv;
    this.drawSources(g);
  };
  R.drawRiver = function (g, t, x, y, set) {
    var m = this.map, self = this, links = [];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
      var nb = m.tile(t.c + d[0], t.r + d[1]);
      if (!nb) return;
      if (set[nb.c + ',' + nb.r] || (nb.t === m.T.SEA && t.c > 45)) links.push(d);
    });
    if (t.c === 16 && t.r === 20) links.push([-1, 0]);
    g.lineCap = 'round';
    [['#5a7f8f', 11], ['#3f7fae', 8], ['#6aa6c9', 3]].forEach(function (st) {
      g.strokeStyle = st[0]; g.lineWidth = st[1]; g.beginPath();
      links.forEach(function (d) { g.moveTo(x, y); g.lineTo(x + (d[0] - d[1]) * HW * 0.55, y + (d[0] + d[1]) * HH * 0.55); });
      g.stroke();
    });
  };
  function mix(a, b, f) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    var r = (x >> 16) * (1 - f) + (y >> 16) * f, gg = (x >> 8 & 255) * (1 - f) + (y >> 8 & 255) * f, bb = (x & 255) * (1 - f) + (y & 255) * f;
    return '#' + ((1 << 24) + ((r | 0) << 16) + ((gg | 0) << 8) + (bb | 0)).toString(16).slice(1);
  }
  function diamondPath(g, x, y, s) { s = s || 1; g.beginPath(); g.moveTo(x, y - HH * s); g.lineTo(x + HW * s, y); g.lineTo(x, y + HH * s); g.lineTo(x - HW * s, y); g.closePath(); }
  function diamond(g, x, y, col) { diamondPath(g, x, y, 1.02); g.fillStyle = col; g.fill(); }
  function ell(g, x, y, rx, ry) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); }
  function tree(g, x, y, s, dry) {
    g.fillStyle = 'rgba(30,40,10,.25)'; ell(g, x + 3 * s, y + 1, 6 * s, 2.4 * s); g.fill();
    g.fillStyle = '#5b4126'; g.fillRect(x - 0.8 * s, y - 6 * s, 1.8 * s, 6 * s);
    if (dry) { // acacia: flat-topped
      g.fillStyle = '#4d6b2c'; ell(g, x, y - 8 * s, 8 * s, 3.6 * s); g.fill();
      g.fillStyle = '#668a3a'; ell(g, x - 1.5 * s, y - 9.2 * s, 5 * s, 2.2 * s); g.fill();
    } else {
      g.fillStyle = '#3e5f26'; ell(g, x, y - 9 * s, 5.5 * s, 6 * s); g.fill();
      g.fillStyle = '#557c32'; ell(g, x - 1.5 * s, y - 10.5 * s, 3 * s, 3.4 * s); g.fill();
    }
  }
  function house(g, x, y, s, roof) {
    g.fillStyle = '#efe6d2'; g.fillRect(x - 5 * s, y - 6 * s, 10 * s, 6 * s);
    g.fillStyle = '#d4c7ab'; g.fillRect(x + 1 * s, y - 6 * s, 4 * s, 6 * s);
    g.fillStyle = roof; g.beginPath(); g.moveTo(x - 6.5 * s, y - 6 * s); g.lineTo(x, y - 11 * s); g.lineTo(x + 6.5 * s, y - 6 * s); g.closePath(); g.fill();
    g.fillStyle = '#4a3a2a'; g.fillRect(x - 3 * s, y - 3.5 * s, 2 * s, 3.5 * s);
  }
  R.drawSources = function (g) {
    var self = this, m = this.map;
    m.sources.forEach(function (s) {
      var p = self.center(s.c, s.r), x = p.x, y = p.y;
      if (s.kind === 'town' || s.kind === 'port') {
        var n = s.kind === 'port' ? 9 : Math.round(4 + s.units / 4000);
        var pts = [];
        for (var k = 0; k < n; k++) { var a = hash(s.c, s.r, k + 100) * Math.PI * 2, d = 6 + hash(s.c, s.r, k + 110) * 22; pts.push([x + Math.cos(a) * d * 1.3, y + Math.sin(a) * d * 0.55]); }
        pts.sort(function (a, b) { return a[1] - b[1]; });
        var roofs = ['#9b4a32', '#7d3b2b', '#8a6a4a', '#a35b3a', '#6b6b6b'];
        pts.forEach(function (q, i) { house(g, q[0], q[1], 0.85 + hash(s.c, s.r, i) * 0.4, roofs[i % roofs.length]); });
        if (s.kind === 'port') {
          // wharf and cranes
          var w = self.iso(s.c + 1, s.r, -1);
          g.fillStyle = '#6b4f33'; g.beginPath(); g.moveTo(w.x - 18, w.y - 6); g.lineTo(w.x + 22, w.y + 14); g.lineTo(w.x + 30, w.y + 10); g.lineTo(w.x - 10, w.y - 10); g.closePath(); g.fill();
          g.strokeStyle = '#3b3b3b'; g.lineWidth = 2;
          [[-4, -2], [14, 8]].forEach(function (o) { g.beginPath(); g.moveTo(w.x + o[0], w.y + o[1] - 6); g.lineTo(w.x + o[0], w.y + o[1] - 30); g.lineTo(w.x + o[0] + 14, w.y + o[1] - 24); g.stroke(); });
          // lighthouse
          var lh = self.iso(s.c + 1, s.r - 3, 0);
          g.fillStyle = '#f2efe8'; g.fillRect(lh.x - 3, lh.y - 26, 6, 24); g.fillStyle = '#b33'; g.fillRect(lh.x - 3, lh.y - 18, 6, 4); g.fillRect(lh.x - 4, lh.y - 30, 8, 5);
        }
      } else if (s.kind === 'gold' || s.kind === 'coal' || s.kind === 'copper') {
        var heap = s.kind === 'gold' ? '#c9b27a' : s.kind === 'coal' ? '#2e2a28' : '#6f8f7a';
        g.fillStyle = heap; g.beginPath(); g.moveTo(x - 4, y + 8); g.quadraticCurveTo(x + 12, y - 20, x + 26, y + 6); g.closePath(); g.fill();
        g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.moveTo(x + 11, y - 6); g.quadraticCurveTo(x + 20, y - 4, x + 26, y + 6); g.lineTo(x + 12, y + 8); g.closePath(); g.fill();
        // headframe
        g.strokeStyle = '#3a2b1c'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x - 18, y + 4); g.lineTo(x - 12, y - 30); g.lineTo(x - 6, y + 4); g.moveTo(x - 12, y - 30); g.lineTo(x - 22, y - 2); g.moveTo(x - 16, y - 12); g.lineTo(x - 8, y - 12); g.stroke();
        g.fillStyle = '#3a2b1c'; ell(g, x - 12, y - 31, 3.5, 3.5); g.fill();
        house(g, x - 26, y + 10, 1, '#55606a'); house(g, x - 2, y + 14, 0.9, '#55606a');
        if (s.kind === 'copper') { g.fillStyle = '#5a4a3a'; g.fillRect(x + 14, y - 34, 4, 30); }
      } else if (s.kind === 'farm') {
        for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
          var t = m.tile(s.c + dc, s.r + dr); if (!t || t.t === m.T.SEA || t.t === m.T.RIVER) continue;
          var q = self.center(s.c + dc, s.r + dr);
          g.save(); diamondPath(g, q.x, q.y, 0.86); g.clip();
          g.fillStyle = (dc + dr) % 2 ? '#c8b25a' : '#8fa24a'; g.fillRect(q.x - HW, q.y - HH, TW, TH);
          g.strokeStyle = 'rgba(80,70,30,.35)'; g.lineWidth = 1;
          for (var l = -40; l < 40; l += 5) { g.beginPath(); g.moveTo(q.x + l, q.y - 20); g.lineTo(q.x + l + 30, q.y + 20); g.stroke(); }
          g.restore();
        }
        house(g, x, y, 1.1, '#7d3b2b'); g.fillStyle = '#b9b2a2'; g.fillRect(x + 8, y - 14, 5, 14);
      } else if (s.kind === 'junction') {
        g.strokeStyle = '#4a3a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x, y - 30); g.stroke();
        g.fillStyle = '#efe6d2'; g.fillRect(x - 16, y - 30, 22, 7); g.fillRect(x - 2, y - 21, 20, 7);
        house(g, x + 14, y + 8, 1, '#55606a');
      }
    });
  };

  R.buildMini = function () {
    var m = this.map, cv = document.createElement('canvas'), sc = 2;
    cv.width = (m.W + m.H) * sc; cv.height = (m.W + m.H) * sc / 2;
    var g = cv.getContext('2d');
    g.fillStyle = '#244e6b'; g.fillRect(0, 0, cv.width, cv.height);
    var col = ['#2d5a78', '#a8ad62', '#5f8040', '#a3945e', '#7a6d5c', '#788a55', '#3f7fae', '#4b8bb0'];
    m.tiles.forEach(function (t) {
      var x = (t.c - t.r + m.H) * sc, y = (t.c + t.r) * sc / 2;
      g.fillStyle = col[t.t]; g.fillRect(x - sc, y, sc * 2, sc);
    });
    this.mini = cv; this.miniScale = sc;
  };

  R.buildTrack = function (S) {
    var k = Object.keys(S.edges).length + ':' + Object.keys(S.stations).length;
    if (k === this.trackKey) return;
    this.trackKey = k;
    var cv = this.trackCv || document.createElement('canvas');
    cv.width = this.WW; cv.height = this.WH;
    var g = cv.getContext('2d'), self = this, m = this.map;
    g.clearRect(0, 0, cv.width, cv.height);
    var edges = Object.keys(S.edges).map(function (e) { var p = e.split('|'); return [self.E.unkey(p[0]), self.E.unkey(p[1])]; });
    edges.sort(function (a, b) { return (a[0][0] + a[0][1] + a[1][0] + a[1][1]) - (b[0][0] + b[0][1] + b[1][0] + b[1][1]); });
    edges.forEach(function (e) { self.drawRail(g, e[0], e[1], false); });
    m.sources.forEach(function (s) {
      if (!S.stations[s.id] || s.id === 'port') return;
      var p = self.center(s.c, s.r);
      g.fillStyle = '#d8c8a4'; g.beginPath(); g.moveTo(p.x - 14, p.y + 6); g.lineTo(p.x + 2, p.y + 14); g.lineTo(p.x + 14, p.y + 8); g.lineTo(p.x - 2, p.y); g.closePath(); g.fill();
      g.fillStyle = '#b8402e'; g.fillRect(p.x - 8, p.y - 6, 12, 8); g.fillStyle = '#5a2a1e'; g.beginPath(); g.moveTo(p.x - 10, p.y - 6); g.lineTo(p.x - 2, p.y - 12); g.lineTo(p.x + 6, p.y - 6); g.closePath(); g.fill();
    });
    var pp = this.center(m.source('port').c, m.source('port').r);
    g.fillStyle = '#8b3a2a'; g.fillRect(pp.x - 10, pp.y - 12, 20, 10); g.fillStyle = '#3a2a22'; g.beginPath(); g.moveTo(pp.x - 12, pp.y - 12); g.lineTo(pp.x, pp.y - 19); g.lineTo(pp.x + 12, pp.y - 12); g.closePath(); g.fill();
    this.trackCv = cv;
  };
  R.drawRail = function (g, a, b, ghost, alpha) {
    var pa = this.center(a[0], a[1]), pb = this.center(b[0], b[1]);
    var dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    var m = this.map, bridge = m.tile(a[0], a[1]).t === m.T.RIVER || m.tile(b[0], b[1]).t === m.T.RIVER;
    g.lineCap = 'round';
    if (ghost) {
      g.strokeStyle = 'rgba(255,240,200,' + (alpha || 0.9) + ')'; g.lineWidth = 5; g.setLineDash([6, 5]);
      g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(pb.x, pb.y); g.stroke(); g.setLineDash([]);
      return;
    }
    if (bridge) {
      g.strokeStyle = '#4a3020'; g.lineWidth = 2;
      for (var t = 0.15; t < 1; t += 0.3) { var bx = pa.x + dx * t, by = pa.y + dy * t; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + 9); g.stroke(); }
      g.strokeStyle = '#5c3d26'; g.lineWidth = 7; g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(pb.x, pb.y); g.stroke();
    } else {
      g.strokeStyle = 'rgba(120,100,70,.85)'; g.lineWidth = 8; g.beginPath(); g.moveTo(pa.x, pa.y); g.lineTo(pb.x, pb.y); g.stroke();
    }
    g.strokeStyle = '#4b3423'; g.lineWidth = 1.6;
    var steps = Math.floor(len / 4.5);
    g.beginPath();
    for (var i = 0; i <= steps; i++) { var f = i / steps, sx = pa.x + dx * f, sy = pa.y + dy * f; g.moveTo(sx + nx * 3.6, sy + ny * 3.6); g.lineTo(sx - nx * 3.6, sy - ny * 3.6); }
    g.stroke();
    g.strokeStyle = '#3c3f44'; g.lineWidth = 1.2; g.beginPath();
    g.moveTo(pa.x + nx * 2, pa.y + ny * 2); g.lineTo(pb.x + nx * 2, pb.y + ny * 2);
    g.moveTo(pa.x - nx * 2, pa.y - ny * 2); g.lineTo(pb.x - nx * 2, pb.y - ny * 2); g.stroke();
    g.strokeStyle = 'rgba(220,225,230,.5)'; g.lineWidth = 0.6; g.beginPath();
    g.moveTo(pa.x + nx * 2, pa.y + ny * 2 - 0.5); g.lineTo(pb.x + nx * 2, pb.y + ny * 2 - 0.5); g.stroke();
  };

  /* ---------- trains ---------- */
  R.syncTrains = function (S, tf) {
    var self = this, E = this.E, map = this.map;
    var routes = tf.list.filter(function (x) { return x.load > 0; }).sort(function (a, b) { return b.load - a.load; });
    if (!routes.length) { this.trains = []; return; }
    var total = 0; routes.forEach(function (x) { total += x.load; });
    // allocate trains to routes proportional to load
    var want = [];
    for (var i = 0; i < S.trains; i++) {
      var best = routes[0], bs = -1;
      routes.forEach(function (x) { var have = want.filter(function (w) { return w === x.s.id; }).length; var sc = x.load / total * S.trains - have; if (sc > bs) { bs = sc; best = x; } });
      want.push(best.s.id);
    }
    var keep = [];
    want.forEach(function (id, i) {
      var tr = self.trains[i];
      if (!tr || tr.src !== id || tr.ver !== self.trackKey) {
        var s = map.source(id);
        var path = E.pathToPort(S, map, tf.dp, E.key(s.c, s.r)).reverse(); // port -> source
        var pts = path.map(function (p) { return self.center(p[0], p[1]); });
        var L = [0]; for (var j = 1; j < pts.length; j++) L.push(L[j - 1] + Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y));
        tr = { src: id, pts: pts, L: L, len: L[L.length - 1], d: tr && tr.src === id ? Math.min(tr.d, L[L.length - 1]) : (i * 97) % Math.max(1, L[L.length - 1]), dir: i % 2 ? -1 : 1, wait: 0, ver: self.trackKey, kind: s.kind, smokeT: 0 };
      }
      keep.push(tr);
    });
    this.trains = keep;
  };
  function along(tr, d) {
    d = Math.max(0, Math.min(tr.len, d));
    var i = 1; while (i < tr.L.length - 1 && tr.L[i] < d) i++;
    var a = tr.pts[i - 1], b = tr.pts[i], seg = tr.L[i] - tr.L[i - 1] || 1, f = (d - tr.L[i - 1]) / seg;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  R.stepTrains = function (dt, speed) {
    var self = this;
    this.trains.forEach(function (tr) {
      if (tr.wait > 0) { tr.wait -= dt * speed; return; }
      tr.d += tr.dir * dt * 70 * speed;
      if (tr.d >= tr.len) { tr.d = tr.len; tr.dir = -1; tr.wait = 1.2; }
      if (tr.d <= 0) { tr.d = 0; tr.dir = 1; tr.wait = 1.2; }
      tr.smokeT -= dt * speed;
      if (tr.smokeT <= 0) { tr.smokeT = 0.12; var p = along(tr, tr.d); self.smoke.push({ x: p.x, y: p.y - 10, a: 0.55, r: 2.5 }); }
    });
    this.smoke.forEach(function (s) { s.y -= dt * 14; s.x += dt * 6; s.r += dt * 5; s.a -= dt * 0.45; });
    this.smoke = this.smoke.filter(function (s) { return s.a > 0; });
    if (this.smoke.length > 400) this.smoke.splice(0, this.smoke.length - 400);
    this.clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > self.WW + 200) { c.x = -200; c.y = Math.random() * self.WH; } });
  };
  function drawCar(g, p, col, w, h) {
    g.save(); g.translate(p.x, p.y); g.rotate(p.ang);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-w / 2 + 1, -h / 2 + 2, w, h);
    g.fillStyle = col; g.fillRect(-w / 2, -h / 2 - 2, w, h);
    g.restore();
  }
  R.drawTrains = function (g) {
    var self = this;
    this.trains.forEach(function (tr) {
      var back = -tr.dir; // wagons trail behind the direction of travel
      var wagonCol = tr.kind === 'town' ? '#7a2e24' : tr.kind === 'coal' ? '#2a2a2a' : tr.kind === 'gold' ? '#7d6b4a' : tr.kind === 'copper' ? '#4f6f62' : '#6b5a3a';
      for (var k = 3; k >= 1; k--) drawCar(g, along(tr, tr.d + back * k * 11), wagonCol, 9, 5);
      var p = along(tr, tr.d);
      drawCar(g, p, '#1d2a22', 11, 6);
      g.fillStyle = '#c8a24a'; g.beginPath(); g.arc(p.x, p.y - 5, 1.6, 0, 7); g.fill();
    });
    this.smoke.forEach(function (s) { g.fillStyle = 'rgba(235,235,230,' + s.a + ')'; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); });
  };

  /* ---------- frame ---------- */
  R.resize = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.cv.width = this.cv.clientWidth * dpr; this.cv.height = this.cv.clientHeight * dpr;
  };
  R.clampCam = function () {
    var vw = this.cv.clientWidth / this.zoom, vh = this.cv.clientHeight / this.zoom;
    this.camX = Math.max(-vw * 0.3, Math.min(this.WW - vw * 0.7, this.camX));
    this.camY = Math.max(-vh * 0.3, Math.min(this.WH - vh * 0.7, this.camY));
  };
  R.centerOn = function (c, r) {
    var p = this.center(c, r);
    this.camX = p.x - this.cv.clientWidth / this.zoom / 2; this.camY = p.y - this.cv.clientHeight / this.zoom / 2; this.clampCam();
  };
  R.zoomAt = function (f, sx, sy) {
    var wx = this.camX + sx / this.zoom, wy = this.camY + sy / this.zoom;
    this.zoom = Math.max(0.35, Math.min(2.4, this.zoom * f));
    this.camX = wx - sx / this.zoom; this.camY = wy - sy / this.zoom; this.clampCam();
  };
  R.pick = function (sx, sy) {
    var wx = this.camX + sx / this.zoom, wy = this.camY + sy / this.zoom, m = this.map;
    for (var lv = 5; lv >= -1; lv--) {
      var a = (wx - this.OX) / HW, b = (wy - this.OY + lv * LH) / HH;
      var c = Math.round((a + b) / 2), r = Math.round((b - a) / 2);
      // refine by checking diamond containment around candidate
      for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
        var t = m.tile(c + dc, r + dr); if (!t) continue;
        var tl = Math.max(-1, this.tileLv(t)); if (tl !== lv && !(lv === -1 && tl === -1)) continue;
        var p = this.iso(t.c, t.r, tl);
        if (Math.abs(wx - p.x) / HW + Math.abs(wy - p.y) / HH <= 1) return t;
      }
    }
    return null;
  };
  R.draw = function (S, opts) {
    var g = this.ctx, dpr = this.dpr || 1, z = this.zoom, self = this, m = this.map;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#1f4762'; g.fillRect(0, 0, this.cv.width, this.cv.height);
    g.setTransform(dpr * z, 0, 0, dpr * z, -this.camX * dpr * z, -this.camY * dpr * z);
    g.imageSmoothingEnabled = true;
    g.drawImage(this.terrain, 0, 0);
    this.buildTrack(S);
    if (this.trackCv) g.drawImage(this.trackCv, 0, 0);
    // construction
    S.projects.forEach(function (p) {
      for (var i = p.done; i < p.edges.length; i++) self.drawRail(g, p.edges[i].a, p.edges[i].b, true, 0.55);
      if (p.done < p.edges.length) {
        var e = p.edges[p.done], q = self.center(e.a[0], e.a[1]);
        g.fillStyle = '#f1e3b5'; g.beginPath(); g.moveTo(q.x - 8, q.y); g.lineTo(q.x - 3, q.y - 10); g.lineTo(q.x + 2, q.y); g.closePath(); g.fill();
        g.fillStyle = '#e8d49a'; g.beginPath(); g.moveTo(q.x + 2, q.y + 3); g.lineTo(q.x + 7, q.y - 7); g.lineTo(q.x + 12, q.y + 3); g.closePath(); g.fill();
        var bob = Math.sin(self.t * 8) * 2;
        g.fillStyle = '#3a2a1a'; g.fillRect(q.x + 12, q.y - 6 + bob, 2, 6); g.fillRect(q.x - 12, q.y - 5 - bob, 2, 5);
      }
    });
    // ship
    var port = m.source('port'), s0 = this.iso(port.c + 2, port.r, -1), s1 = this.iso(port.c + 9, port.r - 4, -1);
    var sp = this.ship, sx = s0.x + (s1.x - s0.x) * sp.p, sy = s0.y + (s1.y - s0.y) * sp.p;
    g.fillStyle = 'rgba(255,255,255,.35)'; ell(g, sx + 14, sy + 4, 16, 3); g.fill();
    g.fillStyle = '#2b2b2b'; g.beginPath(); g.moveTo(sx - 16, sy - 2); g.lineTo(sx + 16, sy - 2); g.lineTo(sx + 12, sy + 5); g.lineTo(sx - 13, sy + 5); g.closePath(); g.fill();
    g.fillStyle = '#e8e2d4'; g.fillRect(sx - 6, sy - 8, 12, 6); g.fillStyle = '#b8402e'; g.fillRect(sx - 1, sy - 15, 4, 7);
    // trains
    this.drawTrains(g);
    // ghost route
    if (this.ghost) {
      var gp = this.ghost.path;
      for (var i = 1; i < gp.length; i++) this.drawRail(g, gp[i - 1], gp[i], true, 0.95);
    }
    // hover
    if (this.hover) {
      var h = this.hover, hp = this.iso(h.c, h.r, Math.max(-1, this.tileLv(h)));
      diamondPath(g, hp.x, hp.y, 1); g.strokeStyle = opts && opts.building ? '#ffe9a8' : 'rgba(255,255,255,.8)'; g.lineWidth = 2 / z; g.stroke();
      g.fillStyle = 'rgba(255,240,200,.15)'; g.fill();
    }
    // clouds
    this.clouds.forEach(function (c) {
      g.fillStyle = 'rgba(20,30,20,.07)'; ell(g, c.x + 60, c.y + 90, 70 * c.s, 22 * c.s); g.fill();
      g.fillStyle = 'rgba(255,255,255,.22)';
      ell(g, c.x, c.y, 60 * c.s, 20 * c.s); g.fill(); ell(g, c.x + 30 * c.s, c.y - 10 * c.s, 40 * c.s, 18 * c.s); g.fill(); ell(g, c.x - 34 * c.s, c.y + 4 * c.s, 34 * c.s, 13 * c.s); g.fill();
    });
    // labels in screen space
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var y = this.E.year(S);
    m.sources.forEach(function (s) {
      var p = self.center(s.c, s.r), x = (p.x - self.camX) * z, yy = (p.y - self.camY) * z - 36 * z - 6;
      if (x < -100 || yy < -40 || x > self.cv.clientWidth + 100 || yy > self.cv.clientHeight + 40) return;
      var on = S.stations[s.id], notYet = s.from && y < s.from;
      var label = s.name + (notYet ? ' (' + s.from + ')' : '');
      g.font = '600 ' + (z < 0.6 ? 10 : 12) + 'px Georgia, "Times New Roman", serif';
      var w = g.measureText(label).width + 20;
      g.fillStyle = on ? 'rgba(33,43,33,.88)' : notYet ? 'rgba(80,70,60,.6)' : 'rgba(250,244,228,.9)';
      roundRect(g, x - w / 2, yy - 10, w, 20, 10); g.fill();
      g.fillStyle = on ? '#7fdc8a' : notYet ? '#999' : '#b8402e'; g.beginPath(); g.arc(x - w / 2 + 9, yy, 3.5, 0, 7); g.fill();
      g.fillStyle = on ? '#f4ecd8' : notYet ? '#e8e0d0' : '#2b2118'; g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText(label, x - w / 2 + 16, yy + 0.5);
    });
    if (opts && opts.ghostLabel && this.ghost) {
      var last = this.ghost.path[this.ghost.path.length - 1], lp = this.center(last[0], last[1]);
      var lx = (lp.x - this.camX) * z + 16, ly = (lp.y - this.camY) * z + 18;
      g.font = '700 13px Georgia, serif'; var lw = g.measureText(opts.ghostLabel).width + 18;
      g.fillStyle = 'rgba(40,28,16,.92)'; roundRect(g, lx, ly, lw, 24, 5); g.fill();
      g.fillStyle = '#ffe9a8'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(opts.ghostLabel, lx + 9, ly + 12.5);
    }
  };
  R.step = function (dt, speed, running) {
    this.t += dt;
    if (running) this.stepTrains(dt, speed); else this.stepTrains(dt, 0.0001);
    var sp = this.ship;
    if (sp.wait > 0) sp.wait -= dt; else { sp.p += sp.dir * dt * 0.04; if (sp.p > 1) { sp.p = 1; sp.dir = -1; sp.wait = 4; } if (sp.p < 0) { sp.p = 0; sp.dir = 1; sp.wait = 6; } }
  };
  R.drawMini = function (cv, S) {
    var g = cv.getContext('2d'), m = this.map, sc = this.miniScale, k = cv.width / this.mini.width;
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(this.mini, 0, 0, cv.width, cv.height);
    g.strokeStyle = '#2a1a10'; g.lineWidth = 2; g.beginPath();
    Object.keys(S.edges).forEach(function (e) {
      var p = e.split('|').map(function (q) { return q.split(',').map(Number); });
      g.moveTo((p[0][0] - p[0][1] + m.H) * sc * k, (p[0][0] + p[0][1]) * sc / 2 * k + 1);
      g.lineTo((p[1][0] - p[1][1] + m.H) * sc * k, (p[1][0] + p[1][1]) * sc / 2 * k + 1);
    });
    g.stroke();
    m.sources.forEach(function (s) { g.fillStyle = S.stations[s.id] ? '#7fdc8a' : '#fff4d8'; g.fillRect((s.c - s.r + m.H) * sc * k - 2, (s.c + s.r) * sc / 2 * k - 1, 4, 4); });
    // viewport
    var self = this, f = sc * k / HW;
    var vx = (this.camX - this.OX) * f + m.H * sc * k, vy = (this.camY - this.OY) * f;
    g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.strokeRect(vx, vy, this.cv.clientWidth / this.zoom * f, this.cv.clientHeight / this.zoom * f);
    this.miniF = f;
  };
  R.miniToWorld = function (cv, mx, my) {
    var f = this.miniF, m = this.map, k = cv.width / this.mini.width;
    return { x: (mx - m.H * this.miniScale * k) / f + this.OX, y: my / f + this.OY };
  };
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  root.RLRender = Renderer;
})(this);
