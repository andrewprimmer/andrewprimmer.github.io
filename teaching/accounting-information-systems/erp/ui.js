/* Ledgerline ERP simulator — shell, helpers, home, sales and receivables. */
(function () {
  "use strict";
  var V = LL.V = {}, A = LL.A = {}, D = LL.draft = {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = LL.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var M = LL.money, F = LL.fmtDate;

  /* ---------- icons ---------- */
  var IC = {
    home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H10v6H4a1 1 0 0 1-1-1z",
    sales: "M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01",
    ar: "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    truck: "M1 4h14v12H1zM15 9h4l3 3v4h-7M5.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6",
    card: "M2 5h20v14H2zM2 10h20M6 15h4",
    db: "M12 3c5 0 9 1.3 9 3s-4 3-9 3-9-1.3-9-3 4-3 9-3zM3 6v12c0 1.7 4 3 9 3s9-1.3 9-3V6M3 12c0 1.7 4 3 9 3s9-1.3 9-3",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5V21h16",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    shield: "M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z",
    flag: "M4 22V4M4 4h13l-2.5 4 2.5 4H4",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
    check: "M20 6L9 17l-5-5", x: "M18 6L6 18M6 6l12 12", alert: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
    lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4", plus: "M12 5v14M5 12h14", arrow: "M5 12h14M13 5l7 7-7 7", cal: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
    phone: "M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L9 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
    mail: "M4 4h16v16H4zM22 6l-10 7L2 6", menu: "M3 6h18M3 12h18M3 18h18", back: "M19 12H5M12 19l-7-7 7-7", refresh: "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", box: "M21 16V8l-9-5-9 5v8l9 5zM3.3 7L12 12l8.7-5M12 22V12",
    spark: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4L2 9.4h7.6z"
  };
  var icon = LL.icon = function (n, c) { return '<svg class="ic ' + (c || "") + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + IC[n] + '"/></svg>'; };

  /* ---------- small builders ---------- */
  var STATUS = {
    open: ["Open", "blue"], credit_block: ["Credit block", "red"], delivered: ["Shipped", "amber"], invoiced: ["Invoiced", "green"], rejected: ["Rejected", "grey"],
    awaiting_approval: ["Awaiting approval", "amber"], released: ["Released", "blue"], partial: ["Partly received", "amber"], received: ["Received", "green"],
    posted: ["Posted", "blue"], blocked: ["Blocked", "red"], paid: ["Paid", "green"], proposed: ["Ready to release", "blue"], deleted: ["Deleted", "grey"],
    pending: ["Pending", "amber"], approved: ["Approved", "red"]
  };
  var pill = LL.pill = function (st, label) { var s = STATUS[st] || [st, "grey"]; return '<span class="pill ' + s[1] + '">' + esc(label || s[0]) + "</span>"; };
  var avatar = LL.avatar = function (uid, big) { var u = LL.userObj(uid) || { name: "System" }; var ini = u.name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2); var hue = { dana: 199, marcus: 260, sam: 30, priya: 330, grace: 160, tom: 210, alex: 12 }[uid] || 220; return '<span class="av' + (big ? " big" : "") + '" style="--h:' + hue + '">' + esc(ini) + "</span>"; };
  var srcBadge = LL.srcBadge = function (s) { var t = { SD: "Sales", MM: "Materials", FI: "Finance", AA: "Assets" }[s] || s; return '<span class="src src-' + s + '" title="' + t + '">' + s + "</span>"; };
  var docLink = LL.docLink = function (kind, id) { var r = { so: "#/so/", po: "#/po/", iv: "#/iv/", je: "#/je/", run: "#/run/" }[kind]; return '<a class="doc" href="' + r + esc(id) + '">' + esc(id) + "</a>"; };
  LL.pageHead = function (title, sub, actions, crumbs) {
    return '<div class="page-head"><div>' + (crumbs ? '<div class="crumbs">' + crumbs + "</div>" : "") + '<h1>' + title + "</h1>" + (sub ? '<p class="sub">' + sub + "</p>" : "") + '</div><div class="head-actions">' + (actions || "") + "</div></div>";
  };
  LL.btn = function (label, act, cls, extra) { return '<button type="button" class="btn ' + (cls || "") + '" data-act="' + act + '"' + (extra || "") + ">" + label + "</button>"; };
  LL.tabs = function (items, cur, base) { return '<nav class="tabs">' + items.map(function (t) { return '<a href="' + base + t[0] + '" class="' + (t[0] === cur ? "on" : "") + '">' + esc(t[1]) + (t[2] != null ? ' <span class="count">' + t[2] + "</span>" : "") + "</a>"; }).join("") + "</nav>"; };
  LL.empty = function (t) { return '<div class="empty">' + icon("box") + "<p>" + t + "</p></div>"; };
  LL.jeTable = function (je, compact) {
    var dr = 0;
    var rows = je.lines.map(function (l) { dr += l[1]; return "<tr><td class=\"mono\">" + l[0] + "</td><td>" + esc(LL.acctName(l[0])) + '</td><td class="num">' + (l[1] ? M(l[1]) : "") + '</td><td class="num">' + (l[2] ? M(l[2]) : "") + "</td></tr>"; }).join("");
    return '<table class="t je-t' + (compact ? " compact" : "") + '"><thead><tr><th>Account</th><th></th><th class="num">Debit</th><th class="num">Credit</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td></td><td>Total</td><td class="num">' + M(dr) + '</td><td class="num">' + M(dr) + "</td></tr></tfoot></table>";
  };
  LL.docFlow = function (nodes) {
    return '<div class="flow">' + nodes.map(function (n, i) {
      return '<div class="fnode ' + n.state + '"><div class="fdot">' + (n.state === "done" ? icon("check") : n.state === "bad" ? icon("x") : n.state === "warn" ? icon("alert") : "<b>" + (i + 1) + "</b>") + '</div><div class="flabel">' + esc(n.label) + '</div><div class="fsub">' + (n.sub || "&nbsp;") + "</div></div>" + (i < nodes.length - 1 ? '<div class="fline ' + (n.state === "done" ? "done" : "") + '"></div>' : "");
    }).join("") + "</div>";
  };
  LL.opts = function (list, val, ph) { return (ph ? '<option value="">' + esc(ph) + "</option>" : "") + list.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(val) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join(""); };

  /* ---------- toasts and modals ---------- */
  LL.toast = function (res, title) {
    var box = $("#toasts"), t = document.createElement("div");
    var kind = res.ok ? (res.warn ? "warn" : "ok") : "err";
    t.className = "toast " + kind;
    var je = res.je ? '<div class="toast-je">' + srcBadge(res.je.src) + " Document " + docLink("je", res.je.id) + res.je.lines.map(function (l) { return '<div class="tj"><span>' + (l[1] ? "Dr" : "Cr") + " " + l[0] + " " + esc(LL.acctName(l[0])) + "</span><b>" + M(l[1] || l[2]) + "</b></div>"; }).join("") + "</div>" : "";
    t.innerHTML = '<div class="toast-ic">' + icon(kind === "ok" ? "check" : "alert") + '</div><div class="toast-body"><b>' + esc(title || (res.ok ? (res.warn ? "Saved with a warning" : "Done") : "Not posted")) + "</b><p>" + esc(res.msg) + "</p>" + je + '</div><button class="toast-x" aria-label="Dismiss">' + icon("x") + "</button>";
    box.appendChild(t);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    t.querySelector(".toast-x").onclick = function () { t.remove(); };
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 400); }, res.je ? 9000 : 6500);
  };
  LL.modal = function (html, cls) {
    var root = $("#modal");
    root.innerHTML = '<div class="scrim" data-act="closeModal"></div><div class="dialog ' + (cls || "") + '" role="dialog" aria-modal="true">' + html + "</div>";
    root.hidden = false; var f = root.querySelector("input,select,button:not(.x)"); if (f) setTimeout(function () { f.focus(); }, 30);
  };
  LL.closeModal = function () { var root = $("#modal"); root.hidden = true; root.innerHTML = ""; };
  A.closeModal = LL.closeModal;
  LL.result = function (res, title) {
    if (res.denied) {
      var who = res.who || [];
      LL.modal('<div class="deny"><div class="deny-ic">' + icon("lock") + '</div><h2>Authorization check failed</h2><p>' + esc(res.msg.replace(/^Authorization check failed\. /, "")) + '</p><p class="muted">This is segregation of duties at work: the ERP checks every action against the user\'s roles.</p>' +
        (who.length ? '<div class="who"><span>Users who can do this</span>' + LL.S.users.filter(function (u) { return LL.can(res.perm, u.id); }).map(function (u) { return '<button class="who-btn" data-act="switchTo" data-id="' + u.id + '">' + avatar(u.id) + "<span><b>" + esc(u.name) + "</b><small>" + esc(u.title) + "</small></span>" + icon("arrow") + "</button>"; }).join("") + "</div>" : "") +
        '<div class="dialog-foot">' + LL.btn("Close", "closeModal", "ghost") + "</div></div>", "narrow");
      render(); return res;
    }
    LL.toast(res, title); render(); return res;
  };

  /* ---------- shell ---------- */
  var NAV = [["home", "Home", "home"], ["sales", "Sales orders", "sales"], ["receivables", "Receivables", "ar"], ["purchasing", "Purchasing", "truck"], ["invoices", "Supplier invoices", "file"], ["payments", "Payments", "card"], ["masters", "Master data", "db"], ["gl", "General ledger", "book"], ["reports", "Reports", "chart"], ["security", "Security & audit", "shield"]];
  function badgeFor(k) {
    var S = LL.S;
    if (k === "sales") { var n = S.sos.filter(function (o) { return o.status === "credit_block"; }).length; return n ? '<span class="nb red">' + n + "</span>" : ""; }
    if (k === "invoices") { var m = S.inbox.filter(function (i) { return !i.done; }).length + S.vinvoices.filter(function (v) { return v.status === "blocked"; }).length; return m ? '<span class="nb">' + m + "</span>" : ""; }
    if (k === "masters") { var c = S.changes.filter(function (x) { return x.status === "pending"; }).length; return c ? '<span class="nb amber">' + c + "</span>" : ""; }
    if (k === "purchasing") { var p = S.pos.filter(function (x) { return x.status === "awaiting_approval"; }).length; return p ? '<span class="nb amber">' + p + "</span>" : ""; }
    if (k === "payments") { var r = S.payruns.filter(function (x) { return ["awaiting_approval", "proposed"].indexOf(x.status) >= 0; }).length; return r ? '<span class="nb">' + r + "</span>" : ""; }
    return "";
  }
  function shell() {
    var u = LL.userObj(), S = LL.S, route = (location.hash.split("/")[1] || "home").split("?")[0];
    var map = { so: "sales", po: "purchasing", iv: "invoices", je: "gl", run: "payments" }; route = map[route] || route;
    $("#nav").innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (route === n[0] ? "on" : "") + '">' + icon(n[2]) + "<span>" + n[1] + "</span>" + badgeFor(n[0]) + "</a>"; }).join("") +
      '<div class="nav-foot"><a href="../" class="course-link">' + icon("back") + "<span>Back to the course</span></a><p>Ledgerline is a teaching simulation, not a real ERP product. Kestrel Cycles is fictional.</p></div>";
    $("#userBtn").innerHTML = avatar(u.id) + '<span class="ub-text"><b>' + esc(u.name) + "</b><small>" + esc(u.title) + (S.superuser ? " · superuser" : "") + "</small></span>";
    $("#dateChip").innerHTML = icon("cal") + "<span>Posting date</span><b>" + F(S.date) + "</b>";
    var done = LL.missionsDone(), tot = LL.MISSIONS.length;
    $("#missionBtn").innerHTML = '<svg class="ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" class="rb"/><circle cx="18" cy="18" r="15.5" class="rf" style="stroke-dasharray:' + (97.4 * done / tot) + ' 97.4"/></svg><span>Missions <b>' + done + "/" + tot + "</b></span>";
    document.body.classList.toggle("superuser", !!S.superuser);
  }
  var lastRoute = null;
  function render() {
    shell();
    var h = location.hash || "#/home", parts = h.slice(2).split("?"), path = parts[0].split("/"), q = {};
    (parts[1] || "").split("&").forEach(function (kv) { if (kv) { var p = kv.split("="); q[p[0]] = decodeURIComponent(p[1] || ""); } });
    var view = V[path[0]] || V.home, html;
    try { html = view(path[1], path[2], q); } catch (e) { console.error(e); html = LL.pageHead("Something went wrong") + "<p>" + esc(e.message) + "</p>"; }
    var main = $("#view");
    main.innerHTML = html;
    if (lastRoute !== h) { main.classList.remove("enter"); void main.offsetWidth; main.classList.add("enter"); window.scrollTo(0, 0); lastRoute = h; }
    countUp(main);
    LL.renderMissions();
    LL.save();
  }
  LL.render = render;
  function countUp(root) {
    root.querySelectorAll("[data-count]").forEach(function (el) {
      var target = +el.getAttribute("data-count"), fmt = el.getAttribute("data-fmt"), t0 = null, from = 0;
      if (el.dataset.done) return; el.dataset.done = 1;
      function f(v) { return fmt === "money" ? M(v, 0) : Math.round(v).toLocaleString("en-US"); }
      function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 700), e = 1 - Math.pow(1 - p, 3); el.textContent = f(from + (target - from) * e); if (p < 1) requestAnimationFrame(step); }
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) el.textContent = f(target); else requestAnimationFrame(step);
    });
  }

  /* ---------- charts ---------- */
  LL.lineChart = function (pts, w, h) {
    if (pts.length < 2) pts = pts.concat(pts);
    var vals = pts.map(function (p) { return p[1]; }), mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
    var pad = (mx - mn) * 0.15 || 1000; mn -= pad; mx += pad;
    var x = function (i) { return 34 + i * (w - 44) / (pts.length - 1); }, y = function (v) { return 10 + (h - 34) * (1 - (v - mn) / (mx - mn)); };
    var d = pts.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p[1]).toFixed(1); }).join(" ");
    var area = d + " L" + x(pts.length - 1) + " " + (h - 24) + " L" + x(0) + " " + (h - 24) + " Z";
    var grid = [0, 0.5, 1].map(function (f) { var v = mn + (mx - mn) * f; return '<line x1="34" x2="' + (w - 10) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="gl"/><text x="30" y="' + (y(v) + 4) + '" class="ax" text-anchor="end">' + (v / 1000).toFixed(0) + "k</text>"; }).join("");
    var labels = pts.map(function (p, i) { return (i === 0 || i === pts.length - 1 || pts.length < 7) ? '<text x="' + x(i) + '" y="' + (h - 6) + '" class="ax" text-anchor="middle">' + F(p[0]).replace(/, \d+$/, "") + "</text>" : ""; }).join("");
    var last = pts[pts.length - 1];
    return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Cash balance trend">' + '<defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2E8B76" stop-opacity=".28"/><stop offset="1" stop-color="#2E8B76" stop-opacity="0"/></linearGradient></defs>' + grid + '<path d="' + area + '" fill="url(#lg)"/><path d="' + d + '" class="ln"/><circle cx="' + x(pts.length - 1) + '" cy="' + y(last[1]) + '" r="4.5" class="dot"/>' + labels + "</svg>";
  };
  LL.bars = function (items, fmt) {
    var mx = Math.max.apply(null, items.map(function (i) { return i[1]; }).concat([1]));
    return '<div class="hbars">' + items.map(function (i) { return '<div class="hb"><span class="hb-l">' + esc(i[0]) + '</span><span class="hb-track"><span class="hb-fill ' + (i[2] || "") + '" style="width:' + (100 * i[1] / mx).toFixed(1) + '%"></span></span><span class="hb-v">' + (fmt === "n" ? i[1] : M(i[1], 0)) + "</span></div>"; }).join("") + "</div>";
  };
  function spark(vals, cls) {
    if (vals.length < 2) vals = [vals[0] || 0, vals[0] || 0];
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = mx - mn || 1;
    var d = vals.map(function (v, i) { return (i ? "L" : "M") + (i * 100 / (vals.length - 1)).toFixed(1) + " " + (26 - 22 * (v - mn) / r).toFixed(1); }).join(" ");
    return '<svg class="spark ' + (cls || "") + '" viewBox="0 0 100 28" preserveAspectRatio="none"><path d="' + d + '"/></svg>';
  }
  function series(acct) {
    var dates = {}, S = LL.S; S.journal.forEach(function (j) { dates[j.date] = 1; }); dates[S.date] = 1;
    return Object.keys(dates).sort().filter(function (d) { return d <= S.date; }).map(function (d) { return [d, LL.balances(d)[acct] || 0]; });
  }

  /* ---------- worklist ---------- */
  function tasks() {
    var S = LL.S, t = [];
    if (LL.can("so.release")) S.sos.filter(function (o) { return o.status === "credit_block"; }).forEach(function (o) { t.push(["red", "Review credit block", "SO " + o.id + " · " + LL.cust(o.customer).name + " · " + M(LL.soTotal(o), 0), "#/so/" + o.id]); });
    if (LL.can("dl.create")) S.sos.filter(function (o) { return o.status === "open"; }).forEach(function (o) { t.push(["blue", "Ship order", "SO " + o.id + " · " + LL.cust(o.customer).name, "#/so/" + o.id]); });
    if (LL.can("gr.create")) S.pos.filter(function (p) { return ["released", "partial"].indexOf(p.status) >= 0; }).forEach(function (p) { t.push(["blue", "Expected delivery", "PO " + p.id + " · " + LL.vend(p.vendor).name, "#/po/" + p.id]); });
    if (LL.can("bill.create")) S.sos.filter(function (o) { return o.status === "delivered"; }).forEach(function (o) { t.push(["amber", "Create invoice", "SO " + o.id + " shipped · " + LL.cust(o.customer).name, "#/so/" + o.id]); });
    if (LL.can("po.approve")) S.pos.filter(function (p) { return p.status === "awaiting_approval"; }).forEach(function (p) { t.push(["amber", "Approve purchase order", "PO " + p.id + " · " + M(LL.poTotal(p), 0), "#/po/" + p.id]); });
    if (LL.can("cr.approve")) S.changes.filter(function (c) { return c.status === "pending"; }).forEach(function (c) { t.push(["amber", "Master data change to approve", c.id + " · bank details · " + LL.vend(c.vendor).name, "#/masters/changes"]); });
    if (LL.can("run.approve")) S.payruns.filter(function (r) { return r.status === "awaiting_approval"; }).forEach(function (r) { t.push(["amber", "Approve payment run", r.id + " · " + M(r.total, 0), "#/run/" + r.id]); });
    if (LL.can("iv.create")) S.inbox.filter(function (i) { return !i.done; }).forEach(function (i) { t.push(["blue", "Invoice in inbox", i.invNo + " · " + LL.vend(i.vendor).name, "#/invoices/inbox"]); });
    if (LL.can("iv.resolve")) S.vinvoices.filter(function (v) { return v.status === "blocked"; }).forEach(function (v) { t.push(["red", "Blocked invoice", v.invNo + " · " + LL.vend(v.vendor).name, "#/iv/" + v.id]); });
    if (LL.can("run.release")) S.payruns.filter(function (r) { return r.status === "proposed"; }).forEach(function (r) { t.push(["blue", "Release payment run", r.id + " · " + M(r.total, 0), "#/run/" + r.id]); });
    if (LL.can("pay.receive")) { var n = S.billings.filter(function (b) { return b.amount > b.paid && b.due < S.date; }).length; if (n) t.push(["amber", "Follow up overdue receivables", n + " invoices past due", "#/receivables"]); }
    if (LL.can("po.create")) S.materials.filter(function (m) { return LL.available(m.id) < 15 && m.cat === "Bikes"; }).forEach(function (m) { t.push(["amber", "Low stock", m.name + " · " + LL.available(m.id) + " available", "#/purchasing/new"]); });
    return t;
  }

  /* ================= HOME ================= */
  V.home = function () {
    var S = LL.S, u = LL.userObj(), b = LL.balances(), hr = 9;
    var rev = -(b["4000"] || 0), cogs = b["5000"] || 0;
    var ag = LL.aging(), ar = LL.openAR(), over = ag.d30 + ag.d60 + ag.d90;
    var perms = []; u.roles.forEach(function (r) { (LL.ROLES[r] ? LL.ROLES[r].can : []).forEach(function (p) { perms.push(LL.permLabel(p)); }); });
    var tk = tasks();
    var kpi = function (label, val, fmt, sub, route, sp, tone) { return '<a class="kpi ' + (tone || "") + '" href="' + route + '"><span class="kpi-l">' + label + '</span><span class="kpi-v" data-count="' + val + '" data-fmt="' + fmt + '">' + (fmt === "money" ? M(val, 0) : val) + '</span><span class="kpi-s">' + sub + "</span>" + (sp || "") + "</a>"; };
    var cash = series("1000");
    var revByMat = {}; S.sos.filter(function (o) { return o.status === "invoiced"; }).forEach(function (o) { o.items.forEach(function (i) { revByMat[i.mat] = (revByMat[i.mat] || 0) + i.qty * i.price; }); });
    var recent = S.journal.slice(-6).reverse();
    var cb = S.sos.filter(function (o) { return o.status === "credit_block"; }).length, bl = S.vinvoices.filter(function (v) { return v.status === "blocked"; }).length;
    var html = '<section class="hero"><div class="hero-main">' + avatar(u.id, true) + '<div><p class="eyebrow">Kestrel Cycles Inc. · Company code KC01</p><h1>Good ' + (hr < 12 ? "morning" : "afternoon") + ", " + esc(u.name.split(" ")[0]) + '</h1><p class="hero-sub">Signed in as <b>' + esc(u.title) + "</b>" + (S.superuser ? ' · <span class="su">sandbox superuser: authorization checks are off</span>' : "") + '</p><div class="perm-chips">' + (S.superuser ? '<span class="chip warn">Everything</span>' : perms.map(function (p) { return '<span class="chip">' + esc(p) + "</span>"; }).join("")) + '</div></div></div><div class="hero-side"><button class="btn light" data-act="openMissions">' + icon("flag") + " Guided missions</button>" + '<button class="btn glass" data-act="openUsers">' + icon("user") + " Switch user</button></div></section>";
    html += '<section class="kpis">' +
      kpi("Cash at bank", b["1000"], "money", "Account 1000", "#/reports/bs", spark(cash.map(function (p) { return p[1]; }))) +
      kpi("Accounts receivable", ar, "money", Math.round(100 * over / (ar || 1)) + "% overdue", "#/receivables", '<span class="meter"><span style="width:' + (100 * over / (ar || 1)) + '%"></span></span>', over > 0 ? "" : "") +
      kpi("Inventory", b["1200"], "money", S.materials.reduce(function (s, m) { return s + m.stock; }, 0).toLocaleString() + " units on hand", "#/reports/inv", spark(series("1200").map(function (p) { return p[1]; }))) +
      kpi("Accounts payable", -(b["2000"] || 0), "money", LL.dueItems(7).length + " invoices due within 7 days", "#/payments") +
      kpi("Revenue this month", rev, "money", "Gross margin " + (rev ? Math.round(100 * (rev - cogs) / rev) : 0) + "%", "#/reports/is") +
      kpi("Open sales orders", S.sos.filter(function (o) { return ["open", "credit_block", "delivered"].indexOf(o.status) >= 0; }).length, "n", "Orders not yet invoiced", "#/sales") +
      kpi("Credit blocks", cb, "n", cb ? "Waiting for Credit" : "None waiting", "#/sales?f=credit_block", "", cb ? "alert" : "") +
      kpi("Blocked invoices", bl, "n", bl ? "Failed the three-way match" : "None blocked", "#/invoices/blocked", "", bl ? "alert" : "") + "</section>";
    html += '<section class="grid3"><div class="card"><div class="card-h"><h2>My work</h2><span class="muted">' + tk.length + " item" + (tk.length === 1 ? "" : "s") + "</span></div>" +
      (tk.length ? '<ul class="tasks">' + tk.slice(0, 7).map(function (t) { return '<li><a href="' + t[3] + '"><span class="tdot ' + t[0] + '"></span><span><b>' + esc(t[1]) + "</b><small>" + esc(t[2]) + "</small></span>" + icon("arrow") + "</a></li>"; }).join("") + "</ul>" : LL.empty("Nothing waiting for " + esc(u.title.toLowerCase()) + ". Switch user to see another department's work.")) + "</div>" +
      '<div class="card"><div class="card-h"><h2>Cash position</h2><span class="muted">' + M(b["1000"], 0) + "</span></div>" + LL.lineChart(cash.slice(-12), 420, 190) + "</div>" +
      '<div class="card"><div class="card-h"><h2>Receivables by age</h2><a href="#/reports/aging" class="muted">Aging report</a></div>' + LL.bars([["Not yet due", ag.current, "g"], ["1–30 days late", ag.d30, "a"], ["31–60 days late", ag.d60, "o"], ["Over 60 days", ag.d90, "r"]]) + "</div></section>";
    html += '<section class="grid2"><div class="card"><div class="card-h"><h2>Latest postings</h2><a href="#/gl" class="muted">General ledger</a></div><table class="t"><tbody>' + recent.map(function (j) { var amt = j.lines.reduce(function (s, l) { return s + l[1]; }, 0); return "<tr><td>" + srcBadge(j.src) + "</td><td>" + docLink("je", j.id) + '<div class="muted small">' + esc(j.text) + '</div></td><td class="num">' + M(amt) + '</td><td class="muted small nowrap">' + F(j.date) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<div class="card"><div class="card-h"><h2>Revenue by product</h2><span class="muted">Invoiced this month</span></div>' + (Object.keys(revByMat).length ? LL.bars(Object.keys(revByMat).map(function (k) { return [LL.mat(k).name, revByMat[k], "t"]; })) : LL.empty("No invoices yet this month. Mission 1 takes an order all the way to cash.")) + "</div></section>";
    return html;
  };

  /* ================= SALES ================= */
  function soNext(o) {
    return { open: "Ship (Warehouse)", credit_block: "Credit decision (Credit)", delivered: "Invoice (Sales)", invoiced: (LL.find("billings", o.billing) || {}).paid ? "Complete" : "Await payment", rejected: "Closed" }[o.status];
  }
  V.sales = function (sub, x, q) {
    if (sub === "new") return V.soNew();
    var S = LL.S, f = q.f || "all";
    var list = S.sos.slice().reverse().filter(function (o) { return f === "all" || o.status === f; });
    var cnt = function (st) { return S.sos.filter(function (o) { return o.status === st; }).length; };
    return LL.pageHead("Sales orders", "Order to cash: every order, its credit check and where it is now.", LL.btn(icon("plus") + " Create sales order", "go", "primary", ' data-href="#/sales/new"')) +
      LL.tabs([["all", "All", S.sos.length], ["credit_block", "Credit block", cnt("credit_block")], ["open", "To ship", cnt("open")], ["delivered", "To invoice", cnt("delivered")], ["invoiced", "Invoiced", cnt("invoiced")]], f, "#/sales?f=") +
      '<div class="card flush">' + (list.length ? '<table class="t hover"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th class="num">Net value</th><th>Status</th><th>Next step</th></tr></thead><tbody>' +
        list.map(function (o) { return '<tr data-href="#/so/' + o.id + '"><td>' + docLink("so", o.id) + "</td><td>" + esc(LL.cust(o.customer).name) + "</td><td>" + F(o.date) + '</td><td class="num">' + M(LL.soTotal(o)) + "</td><td>" + pill(o.status) + '</td><td class="muted">' + soNext(o) + "</td></tr>"; }).join("") + "</tbody></table>"
        : LL.empty("No sales orders yet. Create one to start the order-to-cash cycle.")) + "</div>";
  };
  V.soNew = function () {
    var d = D.so = D.so || { customer: "", lines: [{ mat: "", qty: 1, price: 0 }], reason: "" };
    var S = LL.S;
    var custOpts = LL.opts(S.customers.map(function (c) { return [c.id, c.name + " · " + c.city]; }), d.customer, "Choose a customer…");
    var matOpts = function (v) { return LL.opts(S.materials.map(function (m) { return [m.id, m.id + "  " + m.name]; }), v, "Choose a product…"); };
    var lines = d.lines.map(function (l, i) {
      var m = l.mat && LL.mat(l.mat);
      return '<tr><td><select data-so="mat" data-i="' + i + '">' + matOpts(l.mat) + '</select></td><td><input type="number" min="0" step="1" value="' + l.qty + '" data-so="qty" data-i="' + i + '"></td><td><input type="number" min="0" step="0.01" value="' + (l.price || "") + '" data-so="price" data-i="' + i + '"' + (m && l.price !== m.price ? ' class="overr"' : "") + "></td>" +
        '<td class="num">' + (m ? '<span class="avail ' + (LL.available(m.id) < l.qty ? "bad" : "") + '">' + LL.available(m.id) + "</span>" : "") + '</td><td class="num"><b>' + M(l.qty * (l.price || 0)) + '</b></td><td><button class="icon-btn" data-act="soDel" data-i="' + i + '" aria-label="Remove line">' + icon("x") + "</button></td></tr>";
    }).join("");
    var over = d.lines.some(function (l) { var m = l.mat && LL.mat(l.mat); return m && l.price !== m.price; });
    return LL.pageHead("Create sales order", "Prices come from the material master. The credit check runs automatically when you save.", "", '<a href="#/sales">Sales orders</a> / New') +
      '<div class="split"><div class="card"><label class="fld"><span>Sold-to customer</span><select data-so="customer">' + custOpts + "</select></label>" +
      '<table class="t lines"><thead><tr><th style="width:42%">Material</th><th>Quantity</th><th>Unit price</th><th class="num">Available</th><th class="num">Net value</th><th></th></tr></thead><tbody>' + lines + "</tbody></table>" +
      '<button class="btn ghost small" data-act="soAdd">' + icon("plus") + " Add item</button>" +
      (over ? '<label class="fld warnfld"><span>' + icon("alert") + " Price override: reason required (it will appear in the audit log)</span><input type=\"text\" data-so=\"reason\" value=\"" + esc(d.reason) + '" placeholder="e.g. Volume deal approved by sales manager"></label>' : "") +
      '<div class="form-foot"><div class="total"><span>Order total</span><b id="soTotal">' + M(d.lines.reduce(function (s, l) { return s + l.qty * (l.price || 0); }, 0)) + "</b></div>" + LL.btn("Cancel", "soCancel", "ghost") + LL.btn("Save order", "soSave", "primary") + "</div></div>" +
      '<div id="creditPanel">' + creditPanel(d) + "</div></div>";
  };
  function creditPanel(d) {
    if (!d.customer) return '<div class="card side"><h3>Credit check</h3>' + LL.empty("Choose a customer to see their credit position.") + "</div>";
    var c = LL.cust(d.customer), ar = LL.openAR(c.id), oo = LL.openOrders(c.id), cur = d.lines.reduce(function (s, l) { return s + l.qty * (l.price || 0); }, 0);
    var exp = ar + oo + cur, ag = LL.aging(c.id), over = ag.d30 + ag.d60 + ag.d90, scale = Math.max(exp, c.limit) * 1.08;
    var seg = function (v, cls) { return '<span class="seg ' + cls + '" style="width:' + (100 * v / scale) + '%"></span>'; };
    var blocked = exp > c.limit;
    return '<div class="card side"><div class="card-h"><h3>Credit check</h3>' + (blocked ? pill("credit_block", "Will be blocked") : '<span class="pill green">Within limit</span>') + "</div>" +
      '<div class="gauge">' + seg(ar, "ar") + seg(oo, "oo") + seg(cur, "cu") + '<span class="limit" style="left:' + (100 * c.limit / scale) + '%"><i>Limit</i></span></div>' +
      '<dl class="kv"><dt><i class="sw ar"></i>Open receivables</dt><dd>' + M(ar) + '</dd><dt><i class="sw oo"></i>Open orders</dt><dd>' + M(oo) + '</dd><dt><i class="sw cu"></i>This order</dt><dd>' + M(cur) + '</dd><dt class="strong">Credit exposure</dt><dd class="strong ' + (blocked ? "neg" : "") + '">' + M(exp) + '</dd><dt>Credit limit</dt><dd>' + M(c.limit) + '</dd><dt>Available credit</dt><dd class="' + (blocked ? "neg" : "pos") + '">' + M(c.limit - exp) + "</dd></dl>" +
      (over ? '<div class="note red">' + icon("alert") + "<span><b>" + M(over) + "</b> of " + esc(c.name) + "'s receivables are overdue.</span></div>" : '<div class="note green">' + icon("check") + "<span>No overdue invoices.</span></div>") +
      '<p class="muted small">Exposure = open receivables + open orders + this order. Orders that take exposure over the limit are blocked until Credit Management releases them.</p></div>';
  }
  A.soAdd = function () { D.so.lines.push({ mat: "", qty: 1, price: 0 }); render(); };
  A.soDel = function (el) { D.so.lines.splice(+el.dataset.i, 1); if (!D.so.lines.length) D.so.lines.push({ mat: "", qty: 1, price: 0 }); render(); };
  A.soCancel = function () { D.so = null; location.hash = "#/sales"; };
  A.soSave = function () {
    var d = D.so; var res = LL.result(LL.createSO(d.customer, d.lines.map(function (l) { return { mat: l.mat, qty: +l.qty, price: +l.price }; }), d.reason));
    if (res.ok) { D.so = null; location.hash = "#/so/" + res.doc.id; }
  };
  LL.onInput = LL.onInput || {};
  LL.onInput.so = function (el) {
    var d = D.so, k = el.dataset.so, i = +el.dataset.i;
    if (k === "customer") d.customer = el.value;
    else if (k === "reason") { d.reason = el.value; return; }
    else if (k === "mat") { d.lines[i].mat = el.value; var m = LL.mat(el.value); d.lines[i].price = m ? m.price : 0; render(); return; }
    else if (k === "qty") d.lines[i].qty = Math.max(0, Math.floor(+el.value || 0));
    else if (k === "price") { d.lines[i].price = +el.value || 0; var mm = LL.mat(d.lines[i].mat); if (mm && (d.lines[i].price !== mm.price) !== el.classList.contains("overr")) { render(); return; } }
    $("#creditPanel").innerHTML = creditPanel(d);
    $("#soTotal").textContent = M(d.lines.reduce(function (s, l) { return s + l.qty * (l.price || 0); }, 0));
    var row = el.closest("tr"); if (row && d.lines[i]) row.querySelector("td.num b").textContent = M(d.lines[i].qty * (d.lines[i].price || 0));
  };

  V.so = function (id, x, q) {
    var o = LL.find("sos", id); if (!o) return LL.pageHead("Sales order not found") + LL.empty("There's no sales order " + esc(id) + ".");
    var c = LL.cust(o.customer), tab = q.tab || "items", total = LL.soTotal(o);
    var bi = o.billing && LL.find("billings", o.billing), rc = bi && bi.clearedBy;
    var credit = o.credit || {};
    var nodes = [
      { label: "Sales order", sub: o.id, state: "done" },
      { label: "Credit check", sub: o.status === "rejected" ? "Rejected" : o.status === "credit_block" ? "Blocked" : o.releasedBy ? "Released by " + LL.userObj(o.releasedBy).name.split(" ")[0] : "Passed", state: o.status === "rejected" ? "bad" : o.status === "credit_block" ? "warn" : "done" },
      { label: "Goods issue", sub: o.delivery || "", state: o.delivery ? "done" : o.status === "open" ? "now" : "" },
      { label: "Invoice", sub: o.billing || "", state: o.billing ? "done" : o.status === "delivered" ? "now" : "" },
      { label: "Payment", sub: rc || (bi ? "Due " + F(bi.due) : ""), state: rc ? "done" : bi ? "now" : "" }
    ];
    var act = "";
    if (o.status === "credit_block") act = LL.btn("Reject order", "soReject", "danger ghost", ' data-id="' + id + '"') + LL.btn(icon("check") + " Release credit block", "soRelease", "primary", ' data-id="' + id + '"');
    else if (o.status === "open") act = LL.btn("Reject order", "soReject", "ghost", ' data-id="' + id + '"') + LL.btn(icon("truck") + " Post goods issue", "soDeliver", "primary", ' data-id="' + id + '"');
    else if (o.status === "delivered") act = LL.btn(icon("file") + " Create invoice", "soBill", "primary", ' data-id="' + id + '"');
    else if (bi && !rc) act = LL.btn(icon("ar") + " Post incoming payment", "go", "primary", ' data-href="#/receivables?c=' + o.customer + '"');
    var body = "";
    if (tab === "items") body = '<table class="t"><thead><tr><th>Item</th><th>Material</th><th class="num">Quantity</th><th class="num">Unit price</th><th class="num">Net value</th></tr></thead><tbody>' + o.items.map(function (it, i) { var m = LL.mat(it.mat); return "<tr><td>" + (i + 1) * 10 + '</td><td><b>' + esc(m.name) + '</b><div class="muted small">' + it.mat + (it.price !== m.price ? ' · <span class="neg">price override</span>' : "") + '</div></td><td class="num">' + it.qty + '</td><td class="num">' + M(it.price) + '</td><td class="num">' + M(it.qty * it.price) + "</td></tr>"; }).join("") + '</tbody><tfoot><tr><td colspan="4">Total</td><td class="num">' + M(total) + "</td></tr></tfoot></table>";
    else if (tab === "credit") body = '<dl class="kv wide"><dt>Credit limit</dt><dd>' + M(credit.limit || c.limit) + "</dd><dt>Open receivables when ordered</dt><dd>" + M(credit.ar || 0) + "</dd><dt>Other open orders</dt><dd>" + M(credit.orders || 0) + "</dd><dt>This order</dt><dd>" + M(total) + '</dd><dt class="strong">Exposure when ordered</dt><dd class="strong ' + ((credit.exposure || 0) > (credit.limit || 0) ? "neg" : "") + '">' + M(credit.exposure || 0) + "</dd><dt>Receivables overdue today</dt><dd>" + M(LL.aging(c.id).d30 + LL.aging(c.id).d60 + LL.aging(c.id).d90) + "</dd></dl>" + agingMini(c.id);
    else if (tab === "acct") {
      LL.S.flags.viewedSOAcct = true;
      var jes = [o.delivery && LL.jeFor("DL " + o.delivery), o.billing && LL.jeFor("BI " + o.billing), rc && LL.jeFor(rc)].filter(Boolean).reduce(function (a, b) { return a.concat(b); }, []);
      body = jes.length ? jes.map(function (j) { return '<div class="je-card"><div class="je-h">' + srcBadge(j.src) + " " + docLink("je", j.id) + " <span class=\"muted\">" + esc(j.text) + '</span><span class="muted small right">' + F(j.date) + " · " + esc(LL.userObj(j.user) ? LL.userObj(j.user).name : j.user) + "</span></div>" + LL.jeTable(j, true) + "</div>"; }).join("") : LL.empty("No accounting documents yet. The goods issue is the first step that posts to the ledger.");
    }
    return LL.pageHead("Sales order " + esc(id) + " " + pill(o.status), esc(c.name) + " · " + esc(c.city) + " · created " + F(o.date) + " by " + esc(LL.userObj(o.user).name), act, '<a href="#/sales">Sales orders</a> / ' + esc(id)) +
      '<div class="card">' + LL.docFlow(nodes) + "</div>" + LL.tabs([["items", "Items"], ["credit", "Credit"], ["acct", "Accounting"]], tab, "#/so/" + id + "?tab=") + '<div class="card">' + body + "</div>";
  };
  function agingMini(cid) { var a = LL.aging(cid); return '<h3 class="mt">Aging today</h3>' + LL.bars([["Not yet due", a.current, "g"], ["1–30 days late", a.d30, "a"], ["31–60 days late", a.d60, "o"], ["Over 60 days", a.d90, "r"]]); }
  A.soRelease = function (el) { LL.result(LL.releaseSO(el.dataset.id), "Credit block released"); };
  A.soReject = function (el) { LL.result(LL.rejectSO(el.dataset.id), "Order rejected"); };
  A.soDeliver = function (el) { LL.result(LL.deliver(el.dataset.id), "Goods issue posted"); };
  A.soBill = function (el) { LL.result(LL.bill(el.dataset.id), "Invoice created"); };

  /* ================= RECEIVABLES ================= */
  V.receivables = function (s, x, q) {
    var S = LL.S, tot = LL.openAR(), ag = LL.aging();
    var rows = S.customers.map(function (c) { var a = LL.aging(c.id), o = LL.openAR(c.id), use = (o + LL.openOrders(c.id)) / c.limit; return '<tr><td><b>' + esc(c.name) + '</b><div class="muted small">' + c.id + " · " + esc(c.city) + '</div></td><td class="num">' + M(a.current, 0) + '</td><td class="num">' + (a.d30 ? M(a.d30, 0) : "–") + '</td><td class="num">' + (a.d60 ? '<span class="neg">' + M(a.d60, 0) + "</span>" : "–") + '</td><td class="num">' + (a.d90 ? '<span class="neg">' + M(a.d90, 0) + "</span>" : "–") + '</td><td class="num"><b>' + M(o, 0) + '</b></td><td><span class="util"><span style="width:' + Math.min(100, use * 100) + '%" class="' + (use > 1 ? "r" : use > 0.8 ? "a" : "g") + '"></span></span><span class="muted small">' + Math.round(use * 100) + "% of " + M(c.limit, 0) + '</span></td><td>' + LL.btn("Post payment", "payOpen", "small ghost", ' data-c="' + c.id + '"') + "</td></tr>"; }).join("");
    var open = S.billings.filter(function (b) { return b.amount > b.paid; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var html = LL.pageHead("Receivables", "Customer balances, aging and incoming payments.", LL.btn(icon("ar") + " Post incoming payment", "payOpen", "primary")) +
      '<section class="stat-row"><div class="stat"><span>Open receivables</span><b data-count="' + tot + '" data-fmt="money">' + M(tot, 0) + '</b></div><div class="stat"><span>Not yet due</span><b>' + M(ag.current, 0) + '</b></div><div class="stat warn"><span>Overdue</span><b>' + M(ag.d30 + ag.d60 + ag.d90, 0) + '</b></div><div class="stat bad"><span>Over 60 days late</span><b>' + M(ag.d90, 0) + "</b></div></section>" +
      '<div class="card flush"><table class="t"><thead><tr><th>Customer</th><th class="num">Not due</th><th class="num">1–30</th><th class="num">31–60</th><th class="num">60+</th><th class="num">Balance</th><th>Credit used</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<h2 class="sec">Open items</h2><div class="card flush"><table class="t"><thead><tr><th>Invoice</th><th>Customer</th><th>Invoice date</th><th>Due</th><th class="num">Days late</th><th class="num">Open amount</th></tr></thead><tbody>' +
      open.map(function (b) { var late = LL.daysBetween(b.due, S.date); return "<tr><td class=\"mono\">" + b.id + "</td><td>" + esc(LL.cust(b.customer).name) + "</td><td>" + F(b.date) + "</td><td>" + F(b.due) + '</td><td class="num">' + (late > 0 ? '<span class="' + (late > 30 ? "neg" : "warnc") + '">' + late + "</span>" : "–") + '</td><td class="num">' + M(b.amount - b.paid) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (q.c) { var cc = q.c; try { history.replaceState(null, "", "#/receivables"); } catch (e) {} setTimeout(function () { A.payOpen({ dataset: { c: cc } }); }, 50); }
    return html;
  };
  A.payOpen = function (el) {
    var S = LL.S, cid = (el && el.dataset && el.dataset.c) || "";
    var body = function (c) {
      var items = S.billings.filter(function (b) { return b.customer === c && b.amount > b.paid; });
      return c ? (items.length ? '<table class="t compact"><thead><tr><th></th><th>Invoice</th><th>Due</th><th class="num">Open</th></tr></thead><tbody>' + items.map(function (b) { return '<tr><td><input type="checkbox" class="payck" value="' + b.id + '" checked></td><td class="mono">' + b.id + "</td><td>" + F(b.due) + '</td><td class="num">' + M(b.amount - b.paid) + "</td></tr>"; }).join("") + "</tbody></table>" : LL.empty("No open invoices for this customer.")) : "";
    };
    LL.modal('<div class="dlg-h"><h2>' + icon("ar") + ' Post incoming payment</h2><button class="icon-btn x" data-act="closeModal" aria-label="Close">' + icon("x") + '</button></div><p class="muted">Select the customer and the invoices the bank statement shows they paid. The ERP debits cash and clears the receivables.</p><label class="fld"><span>Customer</span><select id="payCust">' + LL.opts(S.customers.map(function (c) { return [c.id, c.name]; }), cid, "Choose a customer…") + '</select></label><div id="payItems">' + body(cid) + '</div><div class="dialog-foot">' + LL.btn("Cancel", "closeModal", "ghost") + LL.btn("Post payment", "payPost", "primary") + "</div>");
    $("#payCust").onchange = function () { $("#payItems").innerHTML = body(this.value); };
  };
  A.payPost = function () {
    var cid = $("#payCust").value, ids = Array.prototype.map.call(document.querySelectorAll(".payck:checked"), function (c) { return c.value; });
    var res = LL.receivePayment(cid, ids);
    if (res.ok || res.denied) LL.closeModal();
    LL.result(res, "Payment posted");
  };

  /* ---------- user switcher ---------- */
  A.openUsers = function () {
    var S = LL.S;
    LL.modal('<div class="dlg-h"><h2>' + icon("user") + ' Switch user</h2><button class="icon-btn x" data-act="closeModal" aria-label="Close">' + icon("x") + '</button></div><p class="muted">Each person has different roles. Try an action as the wrong person and the ERP will stop you.</p><div class="users">' +
      S.users.map(function (u) { return '<button class="user-row ' + (u.id === S.user ? "on" : "") + '" data-act="switchTo" data-id="' + u.id + '">' + avatar(u.id) + "<span><b>" + esc(u.name) + "</b><small>" + esc(u.title) + '</small><em>' + u.roles.map(function (r) { return esc(LL.ROLES[r].name); }).join(" · ") + "</em></span>" + (u.id === S.user ? '<span class="pill green">Signed in</span>' : icon("arrow")) + "</button>"; }).join("") +
      '</div><label class="switch"><input type="checkbox" id="suToggle"' + (S.superuser ? " checked" : "") + '><span class="sw-track"></span><span><b>Sandbox superuser</b><small>Turns off every authorization check. Real companies never give anyone this, and the audit log will record it.</small></span></label>' +
      '<div class="dialog-foot"><button class="btn ghost danger" data-act="resetAsk">' + icon("refresh") + " Reset the sandbox</button>" + LL.btn("Done", "closeModal", "primary") + "</div>");
    $("#suToggle").onchange = function () { LL.setSuper(this.checked); render(); A.openUsers(); };
  };
  A.switchTo = function (el) { LL.setUser(el.dataset.id); LL.closeModal(); render(); LL.toast({ ok: true, msg: "You're now signed in as " + LL.userObj().name + ", " + LL.userObj().title + "." }, "User switched"); };
  A.resetAsk = function () {
    LL.modal('<div class="dlg-h"><h2>' + icon("refresh") + ' Reset the sandbox?</h2></div><p>This puts Kestrel Cycles back to November 3, 2026, and clears every document you\'ve created and every mission you\'ve completed.</p><div class="dialog-foot">' + LL.btn("Cancel", "closeModal", "ghost") + LL.btn("Reset everything", "resetDo", "danger") + "</div>", "narrow");
  };
  A.resetDo = function () { LL.reset(); Object.keys(D).forEach(function (k) { D[k] = null; }); LL.closeModal(); location.hash = "#/home"; render(); LL.toast({ ok: true, msg: "Kestrel Cycles is back to its starting position." }, "Sandbox reset"); };
  A.nextDay = function () { LL.result(LL.nextDay(), "New posting date"); };
  A.go = function (el) { location.hash = el.dataset.href; };

  /* ---------- search ---------- */
  function search(qs) {
    var S = LL.S, k = qs.trim().toLowerCase(); if (!k) return;
    var hit = null;
    [["sos", "#/so/"], ["pos", "#/po/"], ["vinvoices", "#/iv/"], ["journal", "#/je/"], ["payruns", "#/run/"]].some(function (p) { var f = S[p[0]].filter(function (x) { return x.id.toLowerCase() === k || (x.invNo && x.invNo.toLowerCase() === k); })[0]; if (f) { hit = p[1] + f.id; return true; } });
    if (!hit) { var b = S.billings.filter(function (x) { return x.id === k; })[0]; if (b) hit = "#/receivables"; }
    if (!hit) { var c = S.customers.filter(function (x) { return x.name.toLowerCase().indexOf(k) >= 0 || x.id.toLowerCase() === k; })[0]; if (c) hit = "#/receivables"; }
    if (!hit) { var v = S.vendors.filter(function (x) { return x.name.toLowerCase().indexOf(k) >= 0 || x.id.toLowerCase() === k; })[0]; if (v) hit = "#/masters/vendors"; }
    if (!hit) { var m = S.materials.filter(function (x) { return x.name.toLowerCase().indexOf(k) >= 0 || x.id.toLowerCase() === k; })[0]; if (m) hit = "#/masters/materials"; }
    if (hit) location.hash = hit; else LL.toast({ ok: false, msg: "No document, customer, vendor or material matches “" + qs + "”." }, "Nothing found");
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    LL.load();
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-act]");
      if (a && A[a.dataset.act]) { e.preventDefault(); A[a.dataset.act](a); return; }
      var r = e.target.closest("tr[data-href]");
      if (r && !e.target.closest("a,button,input,select")) location.hash = r.dataset.href;
    });
    document.addEventListener("input", function (e) { var el = e.target; if (el.tagName === "SELECT") return; for (var k in LL.onInput) { if (el.dataset && el.dataset[k] !== undefined) { LL.onInput[k](el); return; } } });
    document.addEventListener("change", function (e) { var el = e.target; if (el.tagName === "SELECT") for (var k in LL.onInput) { if (el.dataset && el.dataset[k] !== undefined) { LL.onInput[k](el); return; } } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#modal").hidden) LL.closeModal(); });
    $("#search").addEventListener("keydown", function (e) { if (e.key === "Enter") { search(this.value); this.blur(); } });
    $("#userBtn").onclick = A.openUsers;
    $("#nextDay").onclick = A.nextDay;
    $("#missionBtn").onclick = function () { A.openMissions(); };
    $("#menuBtn").onclick = function () { document.body.classList.toggle("nav-open"); };
    $("#nav").addEventListener("click", function (e) { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });
    window.addEventListener("hashchange", render);
    LL.on(function () { /* state changed */ });
    render();
    if (!LL.S.flags.welcomed) { LL.S.flags.welcomed = true; LL.save(); setTimeout(A.welcome, 400); }
  });
})();
