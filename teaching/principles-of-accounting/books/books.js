/* Redwood River Books: a bookkeeping simulator for ACCT 211.
   Students record source documents as journal entries; each correct entry posts to
   the ledger, and the trial balance, T-accounts and financial statements update live.
   Progress is kept in this browser's localStorage. */
(function () {
  "use strict";
  var R = window.RRB, COA = R.COA, MISSIONS = R.MISSIONS;
  var TYPE = {}, CUR = {}, ORDER = {};
  COA.forEach(function (a, i) { TYPE[a[0]] = a[1]; CUR[a[0]] = !!a[2]; ORDER[a[0]] = i; });
  var DEBIT_NORMAL = { A: 1, W: 1, XR: 1, X: 1, OX: 1 };
  var KEY = "rrb-acct211-v1";

  /* ---------- state ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  var S = load() || { m: 1, posted: {}, cur: {} };
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function mission() { return MISSIONS[S.m - 1]; }

  /* ---------- helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmt(v) {
    if (v == null || v === "") return "";
    var neg = v < 0, a = Math.abs(Math.round(v * 100) / 100);
    var s = a.toLocaleString("en-US", { minimumFractionDigits: a % 1 ? 2 : 0, maximumFractionDigits: 2 });
    return neg ? "(" + s + ")" : s;
  }
  function parse(v) { v = String(v).replace(/[$,\s]/g, ""); if (v === "") return null; var n = parseFloat(v); return isNaN(n) ? NaN : n; }
  function add(bal, lines) { lines.forEach(function (l) { bal[l[0]] = (bal[l[0]] || 0) + l[1] - l[2]; }); }

  /* opening balances: every earlier mission treated as complete, plus this mission's bridge */
  function opening(mi) {
    var bal = {};
    for (var i = 0; i < mi - 1; i++) {
      var m = MISSIONS[i];
      if (m.bridge) add(bal, m.bridge.lines);
      m.docs.forEach(function (d) { add(bal, d.lines); });
    }
    return bal;
  }
  function postedDocs() { var m = mission(); return m.docs.filter(function (d) { return S.posted[d.id]; }); }
  function ledger() {
    var m = mission(), bal = opening(m.n);
    var open = JSON.parse(JSON.stringify(bal));
    if (m.bridge) add(bal, m.bridge.lines);
    postedDocs().forEach(function (d) { add(bal, d.lines); });
    return { bal: bal, open: open };
  }
  function sortAccts(names) { return names.sort(function (a, b) { return ORDER[a] - ORDER[b]; }); }
  function sum(bal, types) { var t = 0; Object.keys(bal).forEach(function (a) { if (types.indexOf(TYPE[a]) >= 0) t += bal[a]; }); return t; }

  /* ---------- DOM refs ---------- */
  var root = document.getElementById("rrb");
  if (!root) return;
  var lastPosted = null;

  function render() {
    root.innerHTML = "";
    root.appendChild(missionBar());
    var m = mission();
    var brief = el("div", "rrb-brief");
    brief.appendChild(el("p", "rrb-kicker", "Mission " + m.n + " · " + m.when + " · " + m.lectures));
    brief.appendChild(el("h2", "rrb-title", m.title));
    brief.appendChild(el("p", null, m.brief));
    brief.appendChild(el("p", "rrb-goal", m.goal));
    root.appendChild(brief);

    var grid = el("div", "rrb-grid");
    var left = el("div", "rrb-col"), right = el("div", "rrb-col");
    grid.appendChild(left); grid.appendChild(right); root.appendChild(grid);

    var docs = m.docs, curId = S.cur[m.n];
    var next = docs.filter(function (d) { return !S.posted[d.id]; })[0];
    if (!curId || !docs.some(function (d) { return d.id === curId; })) curId = (next || docs[0]).id;
    var doc = docs.filter(function (d) { return d.id === curId; })[0];

    left.appendChild(tray(docs, doc));
    left.appendChild(paper(doc));
    if (m.card) left.appendChild(card(m.card));
    right.appendChild(entryForm(doc, next));

    var done = docs.every(function (d) { return S.posted[d.id]; });
    if (done) root.appendChild(complete());
    root.appendChild(books());
  }

  function missionBar() {
    var bar = el("nav", "rrb-missions"); bar.setAttribute("aria-label", "Missions");
    MISSIONS.forEach(function (m) {
      var n = m.docs.filter(function (d) { return S.posted[d.id]; }).length;
      var b = el("button", "rrb-mbtn" + (m.n === S.m ? " on" : "") + (n === m.docs.length ? " done" : ""));
      b.type = "button";
      b.appendChild(el("span", "rrb-mnum", String(m.n)));
      b.appendChild(el("span", "rrb-mname", m.title));
      b.appendChild(el("span", "rrb-mprog", n + "/" + m.docs.length));
      if (m.n === S.m) b.setAttribute("aria-current", "true");
      b.onclick = function () { S.m = m.n; save(); lastPosted = null; render(); root.scrollIntoView({ block: "start" }); };
      bar.appendChild(b);
    });
    return bar;
  }

  function tray(docs, doc) {
    var box = el("div", "rrb-tray");
    box.appendChild(el("h3", "rrb-h", "In-tray"));
    var ul = el("ul", "rrb-traylist");
    docs.forEach(function (d, i) {
      var li = el("li"), b = el("button", "rrb-chip" + (S.posted[d.id] ? " posted" : "") + (d.id === doc.id ? " on" : ""));
      b.type = "button"; b.title = d.kind;
      b.textContent = (S.posted[d.id] ? "✓ " : "") + (i + 1) + ". " + d.kind;
      b.onclick = function () { S.cur[mission().n] = d.id; save(); render(); };
      li.appendChild(b); ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
  }

  function paper(d) {
    var p = el("article", "rrb-paper");
    var top = el("div", "rrb-paper-top");
    top.appendChild(el("span", "rrb-paper-kind", d.kind));
    top.appendChild(el("span", "rrb-paper-date", d.date));
    p.appendChild(top);
    p.appendChild(el("p", "rrb-paper-from", d.from));
    var t = el("table", "rrb-paper-rows");
    d.rows.forEach(function (r) {
      var tr = el("tr"); tr.appendChild(el("th", null, r[0])); tr.appendChild(el("td", null, r[1])); t.appendChild(tr);
    });
    p.appendChild(t);
    if (d.note) p.appendChild(el("p", "rrb-paper-note", d.note));
    if (S.posted[d.id]) p.appendChild(el("p", "rrb-stamp", "POSTED"));
    return p;
  }

  function card(c) {
    var b = el("div", "rrb-card");
    b.appendChild(el("h3", "rrb-h", c.title));
    var t = el("table", "rrb-cardtab");
    c.rows.forEach(function (r) { var tr = el("tr"); r.forEach(function (x) { tr.appendChild(el("td", null, x)); }); t.appendChild(tr); });
    b.appendChild(t);
    return b;
  }

  /* ---------- the journal-entry form ---------- */
  function accountSelect(value) {
    var s = el("select");
    var o0 = el("option", null, "Choose an account…"); o0.value = ""; s.appendChild(o0);
    var groups = [["Assets", ["A", "XA"]], ["Liabilities", ["L"]], ["Owner's equity", ["E", "W", "IS"]], ["Revenue", ["R", "XR", "OR"]], ["Expenses and losses", ["X", "OX"]]];
    groups.forEach(function (g) {
      var og = document.createElement("optgroup"); og.label = g[0];
      COA.forEach(function (a) { if (g[1].indexOf(a[1]) >= 0) { var o = el("option", null, a[0]); o.value = a[0]; og.appendChild(o); } });
      s.appendChild(og);
    });
    if (value) s.value = value;
    return s;
  }

  function entryForm(doc, next) {
    var box = el("div", "rrb-entry");
    box.appendChild(el("h3", "rrb-h", "Journal entry · " + doc.date));
    if (S.posted[doc.id]) {
      box.appendChild(entryTable(doc.lines));
      var ok = el("div", "rrb-fb ok");
      ok.appendChild(el("p", "rrb-fb-msg", "Posted."));
      ok.appendChild(el("p", null, doc.why));
      box.appendChild(ok);
      if (next) {
        var nb = el("button", "rrb-btn", "Next document →"); nb.type = "button";
        nb.onclick = function () { S.cur[mission().n] = next.id; save(); render(); };
        box.appendChild(nb);
      }
      return box;
    }
    var rows = el("div", "rrb-lines"), lines = [];
    var head = el("div", "rrb-line rrb-line-head");
    ["Account", "Debit", "Credit", ""].forEach(function (h) { head.appendChild(el("span", null, h)); });
    rows.appendChild(head);
    function addLine(acct, dr, cr) {
      var r = el("div", "rrb-line"), s = accountSelect(acct);
      var d = el("input"), c = el("input"), x = el("button", "rrb-x", "×");
      s.setAttribute("aria-label", "Account");
      [d, c].forEach(function (inp, k) { inp.type = "text"; inp.inputMode = "decimal"; inp.setAttribute("aria-label", k ? "Credit" : "Debit"); });
      d.value = dr ? fmt(dr) : ""; c.value = cr ? fmt(cr) : "";
      d.addEventListener("input", function () { if (d.value) c.value = ""; });
      c.addEventListener("input", function () { if (c.value) d.value = ""; });
      x.type = "button"; x.setAttribute("aria-label", "Remove line");
      x.onclick = function () { if (lines.length > 2) { rows.removeChild(r); lines.splice(lines.indexOf(L), 1); } };
      r.appendChild(s); r.appendChild(d); r.appendChild(c); r.appendChild(x);
      var L = { s: s, d: d, c: c, r: r }; lines.push(L); rows.appendChild(r);
    }
    addLine(); addLine();
    box.appendChild(rows);
    var totals = el("p", "rrb-totals");
    box.appendChild(totals);
    function updateTotals() {
      var td = 0, tc = 0;
      lines.forEach(function (L) { td += parse(L.d.value) || 0; tc += parse(L.c.value) || 0; });
      totals.textContent = "Debits " + fmt(td) + " · Credits " + fmt(tc) + (Math.abs(td - tc) < 0.005 && td ? "  ✓ balanced" : "");
    }
    rows.addEventListener("input", updateTotals); updateTotals();

    var acts = el("div", "rrb-acts");
    var more = el("button", "rrb-btn ghost", "+ Add a line"); more.type = "button";
    more.onclick = function () { addLine(); };
    var post = el("button", "rrb-btn", "Post entry"); post.type = "button";
    var show = el("button", "rrb-btn ghost", "Show me the answer"); show.type = "button"; show.hidden = true;
    acts.appendChild(more); acts.appendChild(post); acts.appendChild(show);
    box.appendChild(acts);
    var fb = el("div", "rrb-fb"); fb.setAttribute("aria-live", "polite"); box.appendChild(fb);
    var tries = 0;

    post.onclick = function () {
      var res = check(doc, lines);
      fb.innerHTML = "";
      lines.forEach(function (L) { L.r.classList.remove("wrong"); });
      if (res.ok) {
        S.posted[doc.id] = true; lastPosted = doc.id;
        var nx = mission().docs.filter(function (d) { return !S.posted[d.id]; })[0];
        S.cur[mission().n] = doc.id; save(); render();
        return;
      }
      tries++;
      fb.className = "rrb-fb";
      fb.appendChild(el("p", "rrb-fb-msg", res.msg));
      (res.bad || []).forEach(function (L) { L.r.classList.add("wrong"); });
      if (tries >= 2) show.hidden = false;
    };
    show.onclick = function () {
      while (lines.length) { var L = lines.pop(); rows.removeChild(L.r); }
      doc.lines.forEach(function (l) { addLine(l[0], l[1], l[2]); });
      updateTotals();
      fb.className = "rrb-fb"; fb.innerHTML = "";
      fb.appendChild(el("p", "rrb-fb-msg", "Here's the entry. Read the explanation, then press Post entry."));
      fb.appendChild(el("p", null, doc.why));
      show.hidden = true;
    };
    return box;
  }

  function check(doc, lines) {
    var got = {}, td = 0, tc = 0, used = [];
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i], a = L.s.value, d = parse(L.d.value), c = parse(L.c.value);
      if (!a && d === null && c === null) continue;
      if (!a) return { ok: false, msg: "Choose an account for every line that has an amount.", bad: [L] };
      if (d === null && c === null) return { ok: false, msg: "Enter an amount for " + a + ", in the debit or the credit column.", bad: [L] };
      if ((d !== null && isNaN(d)) || (c !== null && isNaN(c))) return { ok: false, msg: "Amounts must be numbers.", bad: [L] };
      got[a] = (got[a] || 0) + (d || 0) - (c || 0); td += d || 0; tc += c || 0; used.push(L);
    }
    if (used.length < 2) return { ok: false, msg: "A journal entry needs at least two lines: something debited and something credited." };
    if (Math.abs(td - tc) > 0.005) return { ok: false, msg: "Debits (" + fmt(td) + ") don't equal credits (" + fmt(tc) + "). Every entry must balance." };
    var want = {}; doc.lines.forEach(function (l) { want[l[0]] = (want[l[0]] || 0) + l[1] - l[2]; });
    function rowsFor(a) { return used.filter(function (L) { return L.s.value === a; }); }
    var extra = Object.keys(got).filter(function (a) { return !(a in want) && Math.abs(got[a]) > 0.005; });
    if (extra.length) return { ok: false, msg: extra[0] + " isn't affected by this document. Which accounts does it really change?", bad: rowsFor(extra[0]) };
    var missing = Object.keys(want).filter(function (a) { return !(a in got); });
    if (missing.length) return { ok: false, msg: "Something's missing: this document affects " + (missing.length === 1 ? "an account" : missing.length + " accounts") + " you haven't used yet." };
    var keys = Object.keys(want);
    for (var k = 0; k < keys.length; k++) {
      var a2 = keys[k];
      if (Math.sign(got[a2]) !== Math.sign(want[a2])) return { ok: false, msg: a2 + " is on the wrong side. Does this document increase or decrease it, and which side does that mean?", bad: rowsFor(a2) };
    }
    for (k = 0; k < keys.length; k++) {
      a2 = keys[k];
      if (Math.abs(got[a2] - want[a2]) > 0.005) return { ok: false, msg: "The account and side for " + a2 + " are right, but the amount isn't. Check the document's figures.", bad: rowsFor(a2) };
    }
    return { ok: true };
  }

  function entryTable(ls) {
    var t = el("table", "rrb-je");
    var h = el("tr"); ["Account", "Debit", "Credit"].forEach(function (x) { h.appendChild(el("th", null, x)); }); t.appendChild(h);
    ls.forEach(function (l) {
      var tr = el("tr"), a = el("td", l[2] && !l[1] ? "cr" : null, l[0]);
      tr.appendChild(a); tr.appendChild(el("td", "num", l[1] ? fmt(l[1]) : "")); tr.appendChild(el("td", "num", l[2] ? fmt(l[2]) : "")); t.appendChild(tr);
    });
    return t;
  }

  function complete() {
    var m = mission(), L = ledger(), bal = L.bal;
    var b = el("div", "rrb-complete");
    b.appendChild(el("h3", null, "Mission " + m.n + " complete"));
    var dr = 0, cr = 0; Object.keys(bal).forEach(function (a) { if (bal[a] > 0) dr += bal[a]; else cr -= bal[a]; });
    var ni = netIncome(bal);
    b.appendChild(el("p", null, "Every document is posted. The trial balance totals " + fmt(dr) + " = " + fmt(cr) + ". Net income since the last closing is " + fmt(ni.ni) + "."));
    if (m.n < MISSIONS.length) {
      var nb = el("button", "rrb-btn", "Start mission " + (m.n + 1) + ": " + MISSIONS[m.n].title + " →"); nb.type = "button";
      nb.onclick = function () { S.m = m.n + 1; save(); lastPosted = null; render(); root.scrollIntoView({ block: "start" }); };
      b.appendChild(nb);
    } else b.appendChild(el("p", null, "That's the whole year. Look through the statements below: this is Redwood River Supply's first year in numbers."));
    return b;
  }

  /* ---------- the books: tabs ---------- */
  var TAB = "tb";
  function books() {
    var wrap = el("section", "rrb-books");
    var tabs = el("div", "rrb-tabs"); tabs.setAttribute("role", "tablist");
    var panel = el("div", "rrb-panel");
    [["tb", "Trial balance"], ["t", "T-accounts"], ["fs", "Financial statements"], ["j", "Journal"]].forEach(function (t) {
      var b = el("button", "rrb-tab" + (TAB === t[0] ? " on" : ""), t[1]); b.type = "button";
      b.setAttribute("role", "tab"); b.setAttribute("aria-selected", TAB === t[0] ? "true" : "false");
      b.onclick = function () { TAB = t[0]; var nb = books(); wrap.parentNode.replaceChild(nb, wrap); };
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs); wrap.appendChild(panel);
    var L = ledger();
    if (TAB === "tb") panel.appendChild(trial(L.bal));
    if (TAB === "t") panel.appendChild(taccts(L));
    if (TAB === "fs") panel.appendChild(statements(L.bal));
    if (TAB === "j") panel.appendChild(journal());
    return wrap;
  }
  function changed() {
    if (!lastPosted) return {};
    var d = mission().docs.filter(function (x) { return x.id === lastPosted; })[0], o = {};
    if (d) d.lines.forEach(function (l) { o[l[0]] = 1; });
    return o;
  }

  function trial(bal) {
    var hot = changed(), t = el("table", "rrb-tb"), dr = 0, cr = 0;
    var h = el("tr"); ["Account", "Debit", "Credit"].forEach(function (x) { h.appendChild(el("th", null, x)); }); t.appendChild(h);
    sortAccts(Object.keys(bal)).forEach(function (a) {
      var v = Math.round(bal[a] * 100) / 100; if (!v) return;
      var tr = el("tr", hot[a] ? "hot" : null);
      tr.appendChild(el("td", null, a)); tr.appendChild(el("td", "num", v > 0 ? fmt(v) : "")); tr.appendChild(el("td", "num", v < 0 ? fmt(-v) : ""));
      if (v > 0) dr += v; else cr -= v;
      if ((v > 0) !== !!DEBIT_NORMAL[TYPE[a]]) tr.appendChild(el("td", "flag", "abnormal balance"));
      t.appendChild(tr);
    });
    var f = el("tr", "total"); f.appendChild(el("td", null, "Totals")); f.appendChild(el("td", "num", fmt(dr))); f.appendChild(el("td", "num", fmt(cr))); t.appendChild(f);
    var box = el("div");
    box.appendChild(el("p", "rrb-sub", "Redwood River Supply · Trial balance after your entries"));
    box.appendChild(t);
    box.appendChild(el("p", Math.abs(dr - cr) < 0.005 ? "rrb-ok" : "rrb-bad", Math.abs(dr - cr) < 0.005 ? "✓ Debits equal credits." : "✗ Out of balance."));
    return box;
  }

  function taccts(L) {
    var m = mission(), hot = changed(), grid = el("div", "rrb-tgrid");
    var touched = {};
    if (m.bridge) m.bridge.lines.forEach(function (l) { touched[l[0]] = 1; });
    postedDocs().forEach(function (d) { d.lines.forEach(function (l) { touched[l[0]] = 1; }); });
    var names = sortAccts(Object.keys(touched));
    if (!names.length) { var p = el("p", "rrb-sub", "Post an entry and its T-accounts appear here."); return p; }
    names.forEach(function (a) {
      var box = el("div", "rrb-t" + (hot[a] ? " hot" : ""));
      box.appendChild(el("h4", null, a));
      var cols = el("div", "rrb-tcols"), dl = el("ul"), cl = el("ul");
      var ob = L.open[a] || 0;
      if (Math.abs(ob) > 0.005) (ob > 0 ? dl : cl).appendChild(el("li", "ob", "Bal " + fmt(Math.abs(ob))));
      var entries = [];
      if (m.bridge) m.bridge.lines.forEach(function (l) { if (l[0] === a) entries.push(l); });
      postedDocs().forEach(function (d) { d.lines.forEach(function (l) { if (l[0] === a) entries.push(l); }); });
      entries.forEach(function (l) { if (l[1]) dl.appendChild(el("li", null, fmt(l[1]))); else cl.appendChild(el("li", null, fmt(l[2]))); });
      cols.appendChild(dl); cols.appendChild(el("span", "spine")); cols.appendChild(cl);
      box.appendChild(cols);
      var v = L.bal[a] || 0;
      box.appendChild(el("p", "rrb-tbal", Math.abs(v) < 0.005 ? "Balance: zero" : "Balance: " + fmt(Math.abs(v)) + (v > 0 ? " Dr" : " Cr")));
      grid.appendChild(box);
    });
    var w = el("div"); w.appendChild(el("p", "rrb-sub", "Accounts used in this mission. \"Bal\" is the balance brought forward.")); w.appendChild(grid);
    return w;
  }

  function netIncome(bal) {
    function g(t) { return -sum(bal, [t]); }
    var rev = g("R"), contra = sum(bal, ["XR"]), oth = g("OR");
    var cogs = bal["Cost of goods sold"] || 0, exp = sum(bal, ["X"]) - cogs, othx = sum(bal, ["OX"]);
    return { rev: rev, contra: contra, cogs: cogs, exp: exp, oth: oth, othx: othx, ni: rev - contra - cogs - exp + oth - othx };
  }

  function stmt(title, sub, rows) {
    var box = el("div", "rrb-stmt");
    box.appendChild(el("h4", null, title)); box.appendChild(el("p", "rrb-sub", sub));
    var t = el("table");
    rows.forEach(function (r) {
      var tr = el("tr", r[2] || null); tr.appendChild(el("td", null, r[0])); tr.appendChild(el("td", "num", r[1] === "" ? "" : fmt(r[1]))); t.appendChild(tr);
    });
    box.appendChild(t); return box;
  }

  function statements(bal) {
    var wrap = el("div", "rrb-fs"), N = netIncome(bal), rows = [];
    var period = mission().n <= 2 ? "June (since the business opened)" : "Since the June 30 closing";
    function lines(types, sign, only) {
      sortAccts(Object.keys(bal)).forEach(function (a) {
        if (types.indexOf(TYPE[a]) >= 0 && Math.abs(bal[a]) > 0.005 && (!only || only(a))) rows.push([a, sign * bal[a], "ind"]);
      });
    }
    lines(["R"], -1); lines(["XR"], -1);
    if (N.contra) rows.push(["Net revenue", N.rev - N.contra, "sub"]);
    if (N.cogs) { rows.push(["Cost of goods sold", -N.cogs, "ind"]); rows.push(["Gross profit", N.rev - N.contra - N.cogs, "sub"]); }
    lines(["X"], -1, function (a) { return a !== "Cost of goods sold"; });
    rows.push(["Income from operations", N.rev - N.contra - N.cogs - N.exp, "sub"]);
    if (N.oth || N.othx) { lines(["OR"], -1); lines(["OX"], -1); }
    rows.push(["Net income", N.ni, "total"]);
    wrap.appendChild(stmt("Income statement", period, rows));

    var cap = -(bal["Larson, Capital"] || 0), wd = bal["Larson, Withdrawals"] || 0, isum = -(bal["Income summary"] || 0);
    var oe = [["Larson, Capital per ledger", cap, "ind"]];
    if (isum) oe.push(["Income summary (closing in progress)", isum, "ind"]);
    oe.push(["Add: net income", N.ni, "ind"]);
    if (wd) oe.push(["Less: withdrawals", -wd, "ind"]);
    var eq = cap + isum + N.ni - wd;
    oe.push(["Larson, Capital, ending", eq, "total"]);
    wrap.appendChild(stmt("Statement of owner's equity", period, oe));

    var bs = [], ca = 0, na = 0, cl = 0, nl = 0;
    bs.push(["Current assets", "", "head"]);
    sortAccts(Object.keys(bal)).forEach(function (a) { if ((TYPE[a] === "A" || TYPE[a] === "XA") && CUR[a] && Math.abs(bal[a]) > 0.005) { bs.push([a, bal[a], "ind"]); ca += bal[a]; } });
    bs.push(["Total current assets", ca, "sub"]);
    bs.push(["Long-term assets", "", "head"]);
    sortAccts(Object.keys(bal)).forEach(function (a) { if ((TYPE[a] === "A" || TYPE[a] === "XA") && !CUR[a] && Math.abs(bal[a]) > 0.005) { bs.push([a, bal[a], "ind"]); na += bal[a]; } });
    bs.push(["Total assets", ca + na, "total"]);
    bs.push(["Current liabilities", "", "head"]);
    sortAccts(Object.keys(bal)).forEach(function (a) { if (TYPE[a] === "L" && CUR[a] && Math.abs(bal[a]) > 0.005) { bs.push([a, -bal[a], "ind"]); cl -= bal[a]; } });
    bs.push(["Total current liabilities", cl, "sub"]);
    sortAccts(Object.keys(bal)).forEach(function (a) { if (TYPE[a] === "L" && !CUR[a] && Math.abs(bal[a]) > 0.005) { bs.push([a + " (long-term)", -bal[a], "ind"]); nl -= bal[a]; } });
    bs.push(["Owner's equity", "", "head"]);
    bs.push(["Larson, Capital", eq, "ind"]);
    bs.push(["Total liabilities and equity", cl + nl + eq, "total"]);
    wrap.appendChild(stmt("Balance sheet", "As of the last document posted", bs));

    var r = el("div", "rrb-ratios");
    var ok = Math.abs(ca + na - (cl + nl + eq)) < 0.01;
    r.appendChild(el("p", ok ? "rrb-ok" : "rrb-bad", ok ? "✓ Assets = liabilities + equity" : "✗ The balance sheet doesn't balance"));
    if (cl > 0) r.appendChild(el("p", null, "Working capital " + fmt(ca - cl) + " · Current ratio " + (ca / cl).toFixed(2)));
    var ns = -(bal["Sales"] || 0) - N.contra;
    if (N.cogs && ns > 0) r.appendChild(el("p", null, "Gross margin on merchandise sales " + ((ns - N.cogs) / ns * 100).toFixed(1) + "%"));
    wrap.appendChild(r);
    return wrap;
  }

  function journal() {
    var m = mission(), box = el("div");
    box.appendChild(el("p", "rrb-sub", "General journal · Mission " + m.n + ". Earlier missions are brought forward as opening balances."));
    if (m.bridge) {
      var b = el("div", "rrb-jentry bridge"); b.appendChild(el("p", "rrb-jhead", "Posted for you · " + m.bridge.label)); b.appendChild(entryTable(m.bridge.lines)); box.appendChild(b);
    }
    var any = false;
    m.docs.forEach(function (d) {
      if (!S.posted[d.id]) return; any = true;
      var e = el("div", "rrb-jentry"); e.appendChild(el("p", "rrb-jhead", d.date + " · " + d.kind)); e.appendChild(entryTable(d.lines)); box.appendChild(e);
    });
    if (!any) box.appendChild(el("p", "rrb-sub", "No entries posted yet in this mission."));
    return box;
  }

  /* reset controls */
  var resetM = document.getElementById("rrb-reset-mission"), resetAll = document.getElementById("rrb-reset-all");
  if (resetM) resetM.onclick = function () { mission().docs.forEach(function (d) { delete S.posted[d.id]; }); delete S.cur[S.m]; save(); lastPosted = null; render(); };
  if (resetAll) resetAll.onclick = function () { S = { m: 1, posted: {}, cur: {} }; save(); lastPosted = null; render(); };

  render();
})();
