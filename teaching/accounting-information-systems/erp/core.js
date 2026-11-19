/* Ledgerline ERP simulator — state, ledger, authorization and business transactions. */
(function () {
  "use strict";
  var KEY = "ledgerline-kc01-v3";
  var listeners = [];
  var clock = 0;

  LL.load = function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
    LL.S = (s && s.version === 3) ? s : LL.SEED();
    LL.S.flags = LL.S.flags || {};
  };
  LL.save = function () { try { localStorage.setItem(KEY, JSON.stringify(LL.S)); } catch (e) { /* storage unavailable */ } };
  LL.reset = function () { LL.S = LL.SEED(); LL.S.flags = {}; LL.save(); };
  LL.on = function (fn) { listeners.push(fn); };
  function emit(evt, data) { listeners.forEach(function (fn) { try { fn(evt, data); } catch (e) { console.error(e); } }); }
  LL.emit = emit;

  /* ---------- helpers ---------- */
  LL.money = function (n, dec) {
    var neg = n < 0; n = Math.abs(Math.round((n || 0) * 100) / 100);
    var s = n.toLocaleString("en-US", { minimumFractionDigits: dec === 0 ? 0 : 2, maximumFractionDigits: dec === 0 ? 0 : 2 });
    return (neg ? "−$" : "$") + s;
  };
  LL.r2 = function (n) { return Math.round(n * 100) / 100; };
  LL.fmtDate = function (d) {
    if (!d) return "";
    var p = d.split("-"), m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  };
  LL.addDays = function (d, n) { var t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
  LL.daysBetween = function (a, b) { return Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 864e5); };
  LL.stamp = function () { clock = (clock + 7) % 480; var mins = 8 * 60 + 30 + clock; return LL.S.date + " " + String(Math.floor(mins / 60)).padStart(2, "0") + ":" + String(mins % 60).padStart(2, "0"); };
  LL.find = function (list, id) { return (LL.S[list] || []).filter(function (x) { return x.id === id; })[0]; };
  LL.mat = function (id) { return LL.find("materials", id); };
  LL.cust = function (id) { return LL.find("customers", id); };
  LL.vend = function (id) { return LL.find("vendors", id); };
  LL.userObj = function (id) { return LL.find("users", id || LL.S.user); };
  LL.acctName = function (id) { var a = LL.S.accounts.filter(function (x) { return x[0] === id; })[0]; return a ? a[1] : id; };
  LL.acctType = function (id) { var a = LL.S.accounts.filter(function (x) { return x[0] === id; })[0]; return a ? a[2] : ""; };
  function next(k) { var n = LL.S.seq[k]; LL.S.seq[k] = n + 1; return String(n); }
  function ok(msg, extra) { return Object.assign({ ok: true, msg: msg }, extra || {}); }
  function fail(msg, extra) { return Object.assign({ ok: false, msg: msg }, extra || {}); }

  /* ---------- audit and authorization ---------- */
  LL.log = function (type, action, detail) {
    LL.S.audit.unshift({ t: LL.stamp(), user: LL.S.user, type: type, action: action, detail: detail });
    if (LL.S.audit.length > 400) LL.S.audit.length = 400;
  };
  LL.rolesOf = function (uid) { var u = LL.userObj(uid); return u ? u.roles : []; };
  LL.can = function (perm, uid) {
    if (LL.S.superuser && !uid) return true;
    return LL.rolesOf(uid).some(function (r) { return LL.ROLES[r] && LL.ROLES[r].can.indexOf(perm) >= 0; });
  };
  LL.whoCan = function (perm) {
    return LL.S.users.filter(function (u) { return LL.can(perm, u.id); }).map(function (u) { return u.name + " (" + u.title + ")"; });
  };
  var PERM_LABEL = { "so.create": "create sales orders", "so.release": "release credit blocks", "so.reject": "reject sales orders", "bill.create": "create billing documents",
    "dl.create": "post goods issues", "gr.create": "post goods receipts", "po.create": "create purchase orders", "po.approve": "approve purchase orders",
    "iv.create": "post supplier invoices", "iv.resolve": "resolve blocked invoices", "pay.receive": "post incoming payments", "run.create": "create payment runs",
    "run.release": "release payment runs", "run.approve": "approve payment runs", "je.create": "post manual journal entries", "cr.approve": "approve master data changes",
    "cust.edit": "change customer master data", "vend.edit": "change vendor master data", "close.run": "run period-end jobs", "roles.edit": "change user roles", "cr.create": "create change requests" };
  LL.permLabel = function (p) { return PERM_LABEL[p] || p; };
  function guard(perm) {
    if (LL.can(perm)) return null;
    var u = LL.userObj();
    LL.log("denied", "Authorization check failed", u.name + " tried to " + LL.permLabel(perm));
    emit("denied", { perm: perm });
    return fail("Authorization check failed. " + u.name + " (" + u.title + ") is not allowed to " + LL.permLabel(perm) + ".", { denied: true, perm: perm, who: LL.whoCan(perm) });
  }

  /* ---------- ledger ---------- */
  LL.post = function (src, ref, text, lines) {
    var dr = 0, cr = 0;
    lines = lines.filter(function (l) { return LL.r2(l[1]) || LL.r2(l[2]); }).map(function (l) { return [l[0], LL.r2(l[1]), LL.r2(l[2])]; });
    lines.forEach(function (l) { dr += l[1]; cr += l[2]; });
    if (Math.abs(dr - cr) > 0.005) throw new Error("Unbalanced document");
    var je = { id: next("je"), date: LL.S.date, src: src, ref: ref, text: text, user: LL.S.user, lines: lines };
    LL.S.journal.push(je);
    return je;
  };
  LL.balances = function (upTo) {
    var b = {};
    LL.S.accounts.forEach(function (a) { b[a[0]] = 0; });
    LL.S.journal.forEach(function (je) { if (upTo && je.date > upTo) return; je.lines.forEach(function (l) { b[l[0]] = LL.r2((b[l[0]] || 0) + l[1] - l[2]); }); });
    return b;
  };
  LL.jeFor = function (ref) { return LL.S.journal.filter(function (j) { return j.ref === ref; }); };

  /* ---------- derived figures ---------- */
  LL.soTotal = function (so) { return LL.r2(so.items.reduce(function (s, i) { return s + i.qty * i.price; }, 0)); };
  LL.poTotal = function (po) { return LL.r2(po.items.reduce(function (s, i) { return s + i.qty * i.price; }, 0)); };
  LL.openAR = function (cid) { return LL.r2(LL.S.billings.filter(function (b) { return !cid || b.customer === cid; }).reduce(function (s, b) { return s + b.amount - b.paid; }, 0)); };
  LL.openOrders = function (cid, except) {
    return LL.r2(LL.S.sos.filter(function (o) { return o.customer === cid && o.id !== except && ["open", "credit_block", "delivered"].indexOf(o.status) >= 0; })
      .reduce(function (s, o) { return s + LL.soTotal(o); }, 0));
  };
  LL.exposure = function (cid, except) { return LL.r2(LL.openAR(cid) + LL.openOrders(cid, except)); };
  LL.reserved = function (mat) {
    return LL.S.sos.filter(function (o) { return ["open", "credit_block"].indexOf(o.status) >= 0; })
      .reduce(function (s, o) { return s + o.items.filter(function (i) { return i.mat === mat; }).reduce(function (a, i) { return a + i.qty; }, 0); }, 0);
  };
  LL.available = function (mat) { var m = LL.mat(mat); return m.stock - LL.reserved(mat); };
  LL.openAP = function () { return LL.r2(LL.S.vinvoices.filter(function (v) { return v.status === "posted"; }).reduce(function (s, v) { return s + v.amount; }, 0)); };
  LL.aging = function (cid) {
    var b = { current: 0, d30: 0, d60: 0, d90: 0 };
    LL.S.billings.forEach(function (x) {
      if (cid && x.customer !== cid) return;
      var open = x.amount - x.paid; if (open <= 0) return;
      var late = LL.daysBetween(x.due, LL.S.date);
      if (late <= 0) b.current += open; else if (late <= 30) b.d30 += open; else if (late <= 60) b.d60 += open; else b.d90 += open;
    });
    return b;
  };
  LL.sodConflicts = function () {
    var out = [];
    LL.S.users.forEach(function (u) {
      LL.SOD.forEach(function (rule) { if (u.roles.indexOf(rule[0]) >= 0 && u.roles.indexOf(rule[1]) >= 0) out.push({ user: u, rule: rule }); });
    });
    return out;
  };

  /* ---------- system date ---------- */
  LL.nextDay = function () {
    var d = LL.addDays(LL.S.date, 1);
    var wd = new Date(d + "T12:00:00Z").getUTCDay();
    if (wd === 6) d = LL.addDays(d, 2); else if (wd === 0) d = LL.addDays(d, 1);
    LL.S.date = d; LL.log("info", "System date advanced", "Posting date is now " + LL.fmtDate(d));
    LL.save(); emit("date", {}); return ok("Posting date moved to " + LL.fmtDate(d) + ".");
  };
  LL.setUser = function (uid) { LL.S.user = uid; LL.save(); emit("user", {}); };
  LL.setSuper = function (on) {
    LL.S.superuser = !!on;
    LL.log(on ? "change" : "info", on ? "Sandbox superuser switched on" : "Sandbox superuser switched off", "All authorization checks " + (on ? "bypassed" : "restored"));
    LL.save(); emit("super", {});
  };

  /* ================= ORDER TO CASH ================= */
  LL.createSO = function (cid, items, reason) {
    var g = guard("so.create"); if (g) return g;
    var c = LL.cust(cid); if (!c) return fail("Choose a customer.");
    items = items.filter(function (i) { return i.mat && i.qty > 0; });
    if (!items.length) return fail("Add at least one item with a quantity.");
    for (var k = 0; k < items.length; k++) {
      var it = items[k], m = LL.mat(it.mat);
      if (it.qty > LL.available(it.mat)) return fail("Only " + LL.available(it.mat) + " × " + m.name + " available to promise.");
      if (it.price !== m.price && !reason) return fail("The price for " + m.name + " differs from the price list. Enter a reason for the override.");
    }
    var so = { id: next("so"), customer: cid, date: LL.S.date, user: LL.S.user, items: items.map(function (i) { return { mat: i.mat, qty: i.qty, price: i.price }; }), status: "open", history: [] };
    var total = LL.soTotal(so), exp = LL.exposure(cid) + total;
    so.credit = { limit: c.limit, exposure: LL.r2(exp), ar: LL.openAR(cid), orders: LL.openOrders(cid) };
    if (exp > c.limit) so.status = "credit_block";
    LL.S.sos.push(so);
    var over = items.filter(function (i) { return i.price !== LL.mat(i.mat).price; });
    if (over.length) LL.log("change", "Price override", "SO " + so.id + ": " + over.map(function (i) { return LL.mat(i.mat).name + " at " + LL.money(i.price); }).join(", ") + ". Reason: " + reason);
    LL.log("post", "Sales order created", "SO " + so.id + " for " + c.name + ", " + LL.money(total) + (so.status === "credit_block" ? " (blocked: credit limit)" : ""));
    LL.save(); emit("so.created", so);
    if (so.status === "credit_block")
      return ok("Sales order " + so.id + " saved, but blocked by the automatic credit check. Credit exposure would be " + LL.money(exp, 0) + " against a limit of " + LL.money(c.limit, 0) + ".", { doc: so, warn: true });
    return ok("Sales order " + so.id + " saved. Credit check passed.", { doc: so });
  };
  LL.releaseSO = function (id) {
    var g = guard("so.release"); if (g) return g;
    var so = LL.find("sos", id); if (!so || so.status !== "credit_block") return fail("This order is not on credit block.");
    so.status = "open"; so.releasedBy = LL.S.user;
    LL.log("change", "Credit block released", "SO " + id + " released by " + LL.userObj().name);
    LL.save(); emit("so.released", so); return ok("Credit block on " + id + " released. The warehouse can now ship it.");
  };
  LL.rejectSO = function (id) {
    var g = guard("so.reject"); if (g) return g;
    var so = LL.find("sos", id); if (!so || ["open", "credit_block"].indexOf(so.status) < 0) return fail("This order can no longer be rejected.");
    so.status = "rejected"; so.rejectedBy = LL.S.user;
    LL.log("change", "Sales order rejected", "SO " + id + " rejected by " + LL.userObj().name);
    LL.save(); emit("so.rejected", so); return ok("Sales order " + id + " rejected. The customer should be asked to pay overdue balances first.");
  };
  LL.deliver = function (id) {
    var g = guard("dl.create"); if (g) return g;
    var so = LL.find("sos", id); if (!so) return fail("Order not found.");
    if (so.status === "credit_block") return fail("This order is on credit block. It can't be shipped until Credit releases it.");
    if (so.status !== "open") return fail("This order has already been shipped or closed.");
    for (var k = 0; k < so.items.length; k++) { var m0 = LL.mat(so.items[k].mat); if (m0.stock < so.items[k].qty) return fail("Not enough " + m0.name + " in stock."); }
    var cost = 0, dl = { id: next("dl"), so: id, date: LL.S.date, user: LL.S.user, items: [] };
    so.items.forEach(function (i) { var m = LL.mat(i.mat); var c = LL.r2(i.qty * m.cost); cost += c; m.stock -= i.qty; dl.items.push({ mat: i.mat, qty: i.qty, cost: c }); });
    dl.cost = LL.r2(cost);
    LL.S.deliveries.push(dl);
    var je = LL.post("SD", "DL " + dl.id, "Goods issue for SO " + id + ", " + LL.cust(so.customer).name, [["5000", cost, 0], ["1200", 0, cost]]);
    so.status = "delivered"; so.delivery = dl.id; dl.je = je.id;
    LL.log("post", "Goods issue posted", "Delivery " + dl.id + " for SO " + id + ": cost " + LL.money(cost));
    LL.save(); emit("so.delivered", so);
    return ok("Goods issue posted. Delivery " + dl.id + " shipped, and the cost of goods sold was recorded automatically.", { je: je });
  };
  LL.bill = function (id) {
    var g = guard("bill.create"); if (g) return g;
    var so = LL.find("sos", id); if (!so) return fail("Order not found.");
    if (so.status !== "delivered") return fail(so.status === "invoiced" ? "This order has already been billed." : "Only shipped orders can be billed.");
    var c = LL.cust(so.customer), amt = LL.soTotal(so);
    var bi = { id: next("bi"), so: id, customer: so.customer, date: LL.S.date, due: LL.addDays(LL.S.date, c.terms), amount: amt, paid: 0 };
    LL.S.billings.push(bi);
    var je = LL.post("SD", "BI " + bi.id, "Invoice " + bi.id + " to " + c.name, [["1100", amt, 0], ["4000", 0, amt]]);
    so.status = "invoiced"; so.billing = bi.id; bi.je = je.id;
    LL.log("post", "Billing document created", "Invoice " + bi.id + " to " + c.name + ", " + LL.money(amt));
    LL.save(); emit("so.billed", so);
    return ok("Invoice " + bi.id + " created for " + LL.money(amt) + ", due " + LL.fmtDate(bi.due) + ".", { je: je });
  };
  LL.receivePayment = function (cid, ids) {
    var g = guard("pay.receive"); if (g) return g;
    var items = LL.S.billings.filter(function (b) { return ids.indexOf(b.id) >= 0 && b.customer === cid && b.amount > b.paid; });
    if (!items.length) return fail("Select at least one open invoice.");
    var amt = LL.r2(items.reduce(function (s, b) { return s + b.amount - b.paid; }, 0));
    var rc = { id: "DZ" + next("pay"), customer: cid, date: LL.S.date, amount: amt, invoices: items.map(function (b) { return b.id; }) };
    var je = LL.post("FI", rc.id, "Incoming payment from " + LL.cust(cid).name, [["1000", amt, 0], ["1100", 0, amt]]);
    items.forEach(function (b) { b.paid = b.amount; b.clearedBy = rc.id; });
    rc.je = je.id; LL.S.receipts.push(rc);
    LL.log("post", "Incoming payment", rc.id + ": " + LL.money(amt) + " from " + LL.cust(cid).name + " cleared " + rc.invoices.join(", "));
    LL.save(); emit("payment.received", rc);
    return ok("Payment of " + LL.money(amt) + " posted and " + items.length + " invoice" + (items.length > 1 ? "s" : "") + " cleared.", { je: je });
  };

  /* ================= PROCURE TO PAY ================= */
  LL.PO_LIMIT = 10000; LL.RUN_LIMIT = 20000; LL.TOL = 0.02;
  LL.createPO = function (vid, items) {
    var g = guard("po.create"); if (g) return g;
    var v = LL.vend(vid); if (!v) return fail("Choose a vendor.");
    items = items.filter(function (i) { return i.mat && i.qty > 0 && i.price > 0; });
    if (!items.length) return fail("Add at least one item with a quantity and price.");
    var po = { id: next("po"), vendor: vid, date: LL.S.date, buyer: LL.S.user, items: items.map(function (i) { return { mat: i.mat, qty: i.qty, price: i.price, rec: 0, inv: 0 }; }) };
    var total = LL.poTotal(po);
    po.status = total > LL.PO_LIMIT ? "awaiting_approval" : "released";
    LL.S.pos.push(po);
    LL.log("post", "Purchase order created", "PO " + po.id + " to " + v.name + ", " + LL.money(total) + (po.status === "awaiting_approval" ? " (needs Controller approval)" : ""));
    LL.save(); emit("po.created", po);
    if (po.status === "awaiting_approval") return ok("Purchase order " + po.id + " saved. It's over " + LL.money(LL.PO_LIMIT, 0) + ", so it needs the Controller's approval before it can be sent.", { doc: po, warn: true });
    return ok("Purchase order " + po.id + " released and sent to " + v.name + ".", { doc: po });
  };
  LL.approvePO = function (id) {
    var g = guard("po.approve"); if (g) return g;
    var po = LL.find("pos", id); if (!po || po.status !== "awaiting_approval") return fail("This PO is not awaiting approval.");
    if (po.buyer === LL.S.user) { LL.log("denied", "Self-approval blocked", "PO " + id); return fail("You created this purchase order, so you can't approve it. Someone else must."); }
    po.status = "released"; po.approvedBy = LL.S.user;
    LL.log("change", "Purchase order approved", "PO " + id + " approved by " + LL.userObj().name);
    LL.save(); emit("po.approved", po); return ok("PO " + id + " approved and sent to " + LL.vend(po.vendor).name + ".");
  };
  LL.goodsReceipt = function (id, counts) {
    var g = guard("gr.create"); if (g) return g;
    var po = LL.find("pos", id); if (!po) return fail("PO not found.");
    if (po.status === "awaiting_approval") return fail("This PO hasn't been approved. Don't accept deliveries against unapproved orders.");
    if (["released", "partial"].indexOf(po.status) < 0) return fail("Everything on this PO has already been received.");
    var lines = [], value = 0;
    for (var k = 0; k < po.items.length; k++) {
      var it = po.items[k], q = Math.floor(counts[it.mat] || 0), open = it.qty - it.rec;
      if (q < 0) return fail("Counts can't be negative.");
      if (q > open) return fail("You counted " + q + " × " + LL.mat(it.mat).name + ", but only " + open + " are still open on the PO. Refuse the excess and note it on the delivery note.");
      if (q > 0) lines.push({ it: it, q: q });
    }
    if (!lines.length) return fail("Enter the quantity you counted.");
    var gr = { id: next("gr"), po: id, date: LL.S.date, user: LL.S.user, items: [] };
    lines.forEach(function (l) {
      var m = LL.mat(l.it.mat), v = LL.r2(l.q * l.it.price);
      m.cost = LL.r2((m.stock * m.cost + v) / (m.stock + l.q)); m.stock += l.q;
      l.it.rec += l.q; value += v; gr.items.push({ mat: l.it.mat, qty: l.q });
    });
    gr.value = LL.r2(value); LL.S.grs.push(gr);
    var je = LL.post("MM", "GR " + gr.id, "Goods receipt for PO " + id + ", " + LL.vend(po.vendor).name, [["1200", value, 0], ["2100", 0, value]]);
    gr.je = je.id;
    po.status = po.items.every(function (i) { return i.rec >= i.qty; }) ? "received" : "partial";
    var short = po.items.filter(function (i) { return i.rec < i.qty; });
    LL.log("post", "Goods receipt", "GR " + gr.id + " on PO " + id + ": " + gr.items.map(function (i) { return i.qty + " × " + LL.mat(i.mat).name; }).join(", "));
    LL.save(); emit("po.received", po);
    return ok("Goods receipt " + gr.id + " posted. Inventory went up by " + LL.money(value) + (short.length ? ". The PO is still partly open." : ", and the PO is fully received."), { je: je });
  };
  LL.matchPreview = function (d) {
    // returns rows for the three-way match and the reasons it would block
    var rows = [], reasons = [], po = d.po ? LL.find("pos", d.po) : null;
    var dup = LL.S.vinvoices.filter(function (v) { return v.vendor === d.vendor && v.invNo.trim().toUpperCase() === String(d.invNo || "").trim().toUpperCase() && v.status !== "rejected"; })[0];
    if (dup) reasons.push("Duplicate: invoice " + dup.invNo + " from this vendor was already entered as " + dup.id + ".");
    if (!po) { if (!dup) reasons.push("No purchase order: the invoice can't be matched, so it is blocked for review."); return { rows: rows, reasons: reasons, po: null }; }
    if (po.vendor !== d.vendor) reasons.push("The PO belongs to a different vendor.");
    (d.lines || []).forEach(function (l) {
      var it = po.items.filter(function (i) { return i.mat === l.mat; })[0];
      if (!it) { reasons.push(l.mat + " is not on the PO."); return; }
      var openInv = it.rec - it.inv, pdiff = (l.price - it.price) / it.price;
      var qOk = l.qty <= openInv, pOk = Math.abs(pdiff) <= LL.TOL;
      rows.push({ mat: l.mat, poQty: it.qty, poPrice: it.price, grQty: it.rec, prevInv: it.inv, invQty: l.qty, invPrice: l.price, qOk: qOk, pOk: pOk, pdiff: pdiff });
      if (!qOk) reasons.push("Quantity: invoiced " + l.qty + " but only " + openInv + " received and not yet invoiced (" + LL.mat(l.mat).name + ").");
      if (!pOk) reasons.push("Price: " + LL.money(l.price) + " vs PO price " + LL.money(it.price) + " (" + (pdiff * 100).toFixed(1) + "%, tolerance ±" + (LL.TOL * 100) + "%).");
    });
    return { rows: rows, reasons: reasons, po: po };
  };
  LL.enterInvoice = function (d) {
    var g = guard("iv.create"); if (g) return g;
    if (!d.vendor) return fail("Choose the vendor."); if (!d.invNo) return fail("Enter the vendor's invoice number.");
    var mp = LL.matchPreview(d);
    var amount = d.po ? LL.r2(d.lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0)) : LL.r2(d.amount || 0);
    if (!(amount > 0)) return fail("Enter the invoice amount.");
    var iv = { id: next("iv"), vendor: d.vendor, po: d.po || null, invNo: d.invNo.trim(), date: LL.S.date, invDate: d.date || LL.S.date, due: LL.addDays(LL.S.date, LL.vend(d.vendor).terms), amount: amount, lines: d.lines || [], text: d.text || "", user: LL.S.user };
    if (d.inbox) { var ib = LL.find("inbox", d.inbox); if (ib) ib.done = iv.id; iv.inbox = d.inbox; }
    if (mp.reasons.length) {
      iv.status = "blocked"; iv.reasons = mp.reasons; iv.duplicate = mp.reasons.some(function (r) { return r.indexOf("Duplicate") === 0; });
      LL.S.vinvoices.push(iv);
      LL.log("change", "Invoice blocked", iv.id + " (" + iv.invNo + "): " + mp.reasons.join(" "));
      LL.save(); emit("iv.blocked", iv);
      return ok("Invoice " + iv.invNo + " parked as " + iv.id + " and blocked for payment. " + mp.reasons.join(" "), { warn: true, doc: iv });
    }
    var grir = 0, ppv = 0;
    mp.rows.forEach(function (r) { var it = mp.po.items.filter(function (i) { return i.mat === r.mat; })[0]; it.inv += r.invQty; grir += r.invQty * r.poPrice; ppv += r.invQty * (r.invPrice - r.poPrice); });
    var je = LL.post("MM", "IV " + iv.id, "Invoice " + iv.invNo + " from " + LL.vend(d.vendor).name + ", PO " + d.po,
      [["2100", grir, 0], ppv >= 0 ? ["5100", ppv, 0] : ["5100", 0, -ppv], ["2000", 0, amount]]);
    iv.status = "posted"; iv.reasons = []; iv.je = je.id; LL.S.vinvoices.push(iv);
    LL.log("post", "Supplier invoice posted", iv.id + " (" + iv.invNo + ") " + LL.money(amount) + ": three-way match passed");
    LL.save(); emit("iv.posted", iv);
    return ok("Three-way match passed. Invoice " + iv.invNo + " posted as " + iv.id + " and scheduled for payment on " + LL.fmtDate(iv.due) + ".", { je: je, doc: iv });
  };
  LL.resolveInvoice = function (id, mode) {
    var g = guard("iv.resolve"); if (g) return g;
    var iv = LL.find("vinvoices", id); if (!iv || iv.status !== "blocked") return fail("This invoice is not blocked.");
    if (mode === "reject") {
      iv.status = "rejected"; iv.resolution = iv.duplicate ? "Rejected as a duplicate" : "Rejected and returned to the vendor";
      LL.log("change", "Invoice rejected", iv.id + " (" + iv.invNo + "): " + iv.resolution);
      LL.save(); emit("iv.rejected", iv); return ok("Invoice " + iv.invNo + " rejected. " + (iv.duplicate ? "A duplicate payment of " + LL.money(iv.amount) + " was avoided." : "The vendor has been notified."));
    }
    if (iv.duplicate || !iv.po) return fail("A duplicate or non-PO invoice can't be posted from here. Reject it.");
    var po = LL.find("pos", iv.po), grir = 0;
    var lines = [];
    iv.lines.forEach(function (l) { var it = po.items.filter(function (i) { return i.mat === l.mat; })[0]; var q = Math.min(l.qty, it.rec - it.inv); if (q > 0) { lines.push({ mat: l.mat, qty: q, price: it.price }); it.inv += q; grir += q * it.price; } });
    if (!grir) return fail("Nothing has been received that hasn't already been invoiced.");
    var orig = iv.amount; iv.amount = LL.r2(grir); iv.lines = lines;
    var je = LL.post("MM", "IV " + iv.id, "Invoice " + iv.invNo + " posted at PO price for received quantity", [["2100", grir, 0], ["2000", 0, grir]]);
    iv.status = "posted"; iv.je = je.id; iv.resolution = "Posted for the received quantity at the PO price (" + LL.money(grir) + "). Credit memo for " + LL.money(orig - grir) + " requested from the vendor.";
    LL.log("change", "Blocked invoice resolved", iv.id + ": " + iv.resolution);
    LL.save(); emit("iv.resolved", iv);
    return ok("Invoice posted at " + LL.money(grir) + ". A credit memo for the " + LL.money(orig - grir) + " difference has been requested.", { je: je });
  };
  LL.dueItems = function (horizon) {
    var limit = LL.addDays(LL.S.date, horizon || 14);
    return LL.S.vinvoices.filter(function (v) { return v.status === "posted" && !v.run && v.due <= limit; });
  };
  LL.createRun = function (ids) {
    var g = guard("run.create"); if (g) return g;
    var items = LL.S.vinvoices.filter(function (v) { return ids.indexOf(v.id) >= 0 && v.status === "posted" && !v.run; });
    if (!items.length) return fail("Select at least one invoice to pay.");
    var total = LL.r2(items.reduce(function (s, v) { return s + v.amount; }, 0));
    var run = { id: "F110-" + next("pay"), date: LL.S.date, by: LL.S.user, items: items.map(function (v) { return v.id; }), total: total, status: total > LL.RUN_LIMIT ? "awaiting_approval" : "proposed" };
    items.forEach(function (v) { v.run = run.id; });
    LL.S.payruns.push(run);
    LL.log("post", "Payment proposal created", run.id + ": " + items.length + " invoices, " + LL.money(total));
    LL.save(); emit("run.created", run);
    if (run.status === "awaiting_approval") return ok("Payment proposal " + run.id + " created for " + LL.money(total) + ". Runs over " + LL.money(LL.RUN_LIMIT, 0) + " need a second approval from the Controller.", { warn: true });
    return ok("Payment proposal " + run.id + " created for " + LL.money(total) + ". Review it, then release it.");
  };
  LL.approveRun = function (id) {
    var g = guard("run.approve"); if (g) return g;
    var run = LL.find("payruns", id); if (!run || run.status !== "awaiting_approval") return fail("This run is not awaiting approval.");
    if (run.by === LL.S.user) return fail("You created this payment run, so you can't approve it.");
    run.status = "proposed"; run.approvedBy = LL.S.user;
    LL.log("change", "Payment run approved", run.id + " approved by " + LL.userObj().name);
    LL.save(); emit("run.approved", run); return ok("Payment run " + id + " approved. Treasury can now release it.");
  };
  LL.cancelRun = function (id) {
    var g = guard("run.create"); if (g) return g;
    var run = LL.find("payruns", id); if (!run || ["proposed", "awaiting_approval"].indexOf(run.status) < 0) return fail("Only open proposals can be deleted.");
    run.status = "deleted"; run.items.forEach(function (i) { var v = LL.find("vinvoices", i); if (v) delete v.run; });
    LL.log("change", "Payment proposal deleted", run.id); LL.save(); emit("run.deleted", run); return ok("Payment proposal " + id + " deleted.");
  };
  LL.releaseRun = function (id) {
    var g = guard("run.release"); if (g) return g;
    var run = LL.find("payruns", id); if (!run) return fail("Run not found.");
    if (run.status === "awaiting_approval") return fail("This run is over " + LL.money(LL.RUN_LIMIT, 0) + " and still needs the Controller's approval.");
    if (run.status !== "proposed") return fail("This run has already been released.");
    var lines = [], file = [], fraud = false;
    run.items.forEach(function (vid) {
      var v = LL.find("vinvoices", vid), vend = LL.vend(v.vendor);
      v.status = "paid"; v.paidBy = run.id; lines.push(v.amount);
      file.push({ vendor: vend.name, invoice: v.invNo, amount: v.amount, bank: vend.bank.name, routing: vend.bank.routing, acct: vend.bank.acct, fraud: !!vend.fraudBank });
      if (vend.fraudBank) fraud = true;
    });
    var total = run.total;
    var je = LL.post("FI", run.id, "Payment run " + run.id + " (" + run.items.length + " payments)", [["2000", total, 0], ["1000", 0, total]]);
    run.status = "released"; run.je = je.id; run.file = file; run.releasedBy = LL.S.user;
    if (fraud) { run.fraud = true; LL.log("denied", "Payment sent to an unverified account", run.id + " paid Velo Components at a bank account changed from an email request."); }
    LL.log("post", "Payment run released", run.id + ": " + LL.money(total) + " sent to the bank with a positive pay file");
    LL.save(); emit("run.released", run);
    return ok("Payment run released. " + LL.money(total) + " paid by ACH, and the positive pay file was sent to the bank.", { je: je, fraud: fraud });
  };

  /* ================= MASTER DATA ================= */
  LL.callVendor = function (id) {
    var cr = LL.find("changes", id); if (!cr) return fail("Not found.");
    cr.called = true; LL.log("info", "Call-back verification", "Called " + LL.vend(cr.vendor).name + " on " + LL.vend(cr.vendor).phone + " (number already on file)");
    LL.save(); emit("cr.called", cr);
    return ok("You called " + LL.vend(cr.vendor).name + " on the number already on file. Their accounts manager says they have NOT changed banks and did not send the email. The sender's domain is not theirs.", { warn: true });
  };
  LL.decideChange = function (id, approve) {
    var g = guard("cr.approve"); if (g) return g;
    var cr = LL.find("changes", id); if (!cr || cr.status !== "pending") return fail("This request has already been decided.");
    if (cr.by === LL.S.user) return fail("You raised this change request, so you can't approve it.");
    cr.status = approve ? "approved" : "rejected"; cr.decidedBy = LL.S.user; cr.decided = LL.S.date;
    var v = LL.vend(cr.vendor);
    if (approve) { cr.oldBank = v.bank; v.bank = cr.newBank; v.fraudBank = true; }
    LL.log("change", approve ? "Vendor bank details changed" : "Vendor change request rejected", id + " for " + v.name + (approve ? ": new account at " + cr.newBank.name : ""));
    LL.save(); emit(approve ? "cr.approved" : "cr.rejected", cr);
    return approve ? ok("Bank details for " + v.name + " updated. The next payment will go to " + cr.newBank.name + " " + cr.newBank.acct + ".", { warn: true })
                   : ok("Change request " + id + " rejected. " + v.name + "'s bank details are unchanged.");
  };
  LL.setLimit = function (cid, limit) {
    var g = guard("cust.edit"); if (g) return g;
    var c = LL.cust(cid); var old = c.limit; c.limit = Math.max(0, Math.round(limit));
    LL.log("change", "Credit limit changed", c.name + ": " + LL.money(old, 0) + " → " + LL.money(c.limit, 0));
    LL.save(); emit("cust.changed", c); return ok("Credit limit for " + c.name + " changed to " + LL.money(c.limit, 0) + ".");
  };
  LL.setRoles = function (uid, roles) {
    var g = guard("roles.edit"); if (g) return g;
    var u = LL.userObj(uid); var old = u.roles.slice(); u.roles = roles.slice();
    LL.log("change", "User roles changed", u.name + ": " + (old.join(", ") || "none") + " → " + (roles.join(", ") || "none"));
    LL.save(); emit("roles.changed", u); return ok("Roles for " + u.name + " updated.");
  };

  /* ================= GENERAL LEDGER ================= */
  LL.manualJE = function (text, lines) {
    var g = guard("je.create"); if (g) return g;
    if (!text) return fail("Enter a header text that explains the entry.");
    lines = lines.filter(function (l) { return l[0] && (l[1] > 0 || l[2] > 0); });
    if (lines.length < 2) return fail("A journal entry needs at least two lines.");
    var dr = LL.r2(lines.reduce(function (s, l) { return s + l[1]; }, 0)), cr = LL.r2(lines.reduce(function (s, l) { return s + l[2]; }, 0));
    if (dr !== cr) return fail("Debits (" + LL.money(dr) + ") don't equal credits (" + LL.money(cr) + ").");
    if (lines.some(function (l) { return ["1100", "1200", "2000", "2100"].indexOf(l[0]) >= 0; })) return fail("Accounts 1100, 1200, 2000 and 2100 are reconciliation accounts. They can only be posted from the subledgers, not by manual entry.");
    var je = LL.post("FI", "Manual", text, lines);
    var weekend = [0, 6].indexOf(new Date(LL.S.date + "T12:00:00Z").getUTCDay()) >= 0;
    if (dr >= 10000 && dr % 1000 === 0) LL.log("change", "Manual entry flagged", "JE " + je.id + " is a large round amount (" + LL.money(dr, 0) + ")");
    LL.log("post", "Manual journal entry", "JE " + je.id + ": " + text + " (" + LL.money(dr) + ")" + (weekend ? " [weekend]" : ""));
    LL.save(); emit("je.posted", je); return ok("Journal entry " + je.id + " posted.", { je: je });
  };
  LL.runDepreciation = function () {
    var g = guard("close.run"); if (g) return g;
    var mon = LL.S.date.slice(0, 7);
    if (LL.S.journal.some(function (j) { return j.ref === "DEP " + mon; })) return fail("Depreciation for " + mon + " has already been posted.");
    var je = LL.post("AA", "DEP " + mon, "Monthly straight-line depreciation", [["6300", 1000, 0], ["1510", 0, 1000]]);
    LL.log("post", "Depreciation run", "JE " + je.id + ": " + LL.money(1000)); LL.save(); emit("dep.posted", je);
    return ok("Depreciation run posted: " + LL.money(1000) + ".", { je: je });
  };
})();
