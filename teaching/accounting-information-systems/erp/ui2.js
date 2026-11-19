/* Ledgerline ERP simulator — purchasing, supplier invoices, payments, master data, ledger, reports, security, missions. */
(function () {
  "use strict";
  var V = LL.V, A = LL.A, D = LL.draft, esc = LL.esc, M = LL.money, F = LL.fmtDate, icon = LL.icon, pill = LL.pill, render = function () { LL.render(); };
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ================= PURCHASING ================= */
  V.purchasing = function (sub, x, q) {
    if (sub === "new") return V.poNew();
    var S = LL.S, f = q.f || "all";
    var list = S.pos.slice().reverse().filter(function (p) { return f === "all" || p.status === f; });
    var cnt = function (s) { return S.pos.filter(function (p) { return p.status === s; }).length; };
    var low = S.materials.filter(function (m) { return LL.available(m.id) < 15 && m.cat === "Bikes"; });
    return LL.pageHead("Purchasing", "Procure to pay: purchase orders, approvals and receipts. POs over " + M(LL.PO_LIMIT, 0) + " need the Controller's approval.", LL.btn(icon("plus") + " Create purchase order", "go", "primary", ' data-href="#/purchasing/new"')) +
      (low.length ? '<div class="note amber big">' + icon("alert") + "<span><b>Low stock:</b> " + low.map(function (m) { return esc(m.name) + " (" + LL.available(m.id) + " available)"; }).join(", ") + ".</span></div>" : "") +
      LL.tabs([["all", "All", S.pos.length], ["awaiting_approval", "Awaiting approval", cnt("awaiting_approval")], ["released", "Open", cnt("released")], ["partial", "Partly received", cnt("partial")], ["received", "Received", cnt("received")]], f, "#/purchasing?f=") +
      '<div class="card flush"><table class="t hover"><thead><tr><th>Purchase order</th><th>Vendor</th><th>Date</th><th>Buyer</th><th class="num">Net value</th><th>Received</th><th>Status</th></tr></thead><tbody>' +
      list.map(function (p) { var o = p.items.reduce(function (s, i) { return s + i.qty; }, 0), r = p.items.reduce(function (s, i) { return s + i.rec; }, 0); return '<tr data-href="#/po/' + p.id + '"><td>' + LL.docLink("po", p.id) + "</td><td>" + esc(LL.vend(p.vendor).name) + "</td><td>" + F(p.date) + "</td><td>" + LL.avatar(p.buyer) + '</td><td class="num">' + M(LL.poTotal(p)) + '</td><td><span class="util"><span class="g" style="width:' + (100 * r / o) + '%"></span></span><span class="muted small">' + r + " / " + o + "</span></td><td>" + pill(p.status) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  };
  V.poNew = function () {
    var S = LL.S, d = D.po = D.po || { vendor: "", lines: [{ mat: "", qty: 1, price: 0 }] };
    var v = d.vendor && LL.vend(d.vendor);
    var mats = S.materials.filter(function (m) { return !v || v.supplies.indexOf(m.id) >= 0; });
    var total = d.lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0);
    return LL.pageHead("Create purchase order", "Choose an approved vendor. Prices default to the current purchase price.", "", '<a href="#/purchasing">Purchasing</a> / New') +
      '<div class="split"><div class="card"><label class="fld"><span>Vendor</span><select data-po="vendor">' + LL.opts(S.vendors.filter(function (x) { return x.supplies.length; }).map(function (x) { return [x.id, x.name + " · " + x.city]; }), d.vendor, "Choose a vendor…") + "</select></label>" +
      '<table class="t lines"><thead><tr><th style="width:44%">Material</th><th>Quantity</th><th>Unit price</th><th class="num">On hand</th><th class="num">Net value</th><th></th></tr></thead><tbody>' +
      d.lines.map(function (l, i) { var m = l.mat && LL.mat(l.mat); return '<tr><td><select data-po="mat" data-i="' + i + '">' + LL.opts(mats.map(function (m2) { return [m2.id, m2.id + "  " + m2.name]; }), l.mat, v ? "Choose a material…" : "Choose a vendor first") + '</select></td><td><input type="number" min="0" step="1" value="' + l.qty + '" data-po="qty" data-i="' + i + '"></td><td><input type="number" min="0" step="0.01" value="' + (l.price || "") + '" data-po="price" data-i="' + i + '"></td><td class="num">' + (m ? m.stock : "") + '</td><td class="num"><b>' + M(l.qty * l.price) + '</b></td><td><button class="icon-btn" data-act="poDel" data-i="' + i + '" aria-label="Remove line">' + icon("x") + "</button></td></tr>"; }).join("") +
      '</tbody></table><button class="btn ghost small" data-act="poAdd">' + icon("plus") + " Add item</button>" +
      '<div class="form-foot"><div class="total"><span>PO total</span><b id="poTotal">' + M(total) + "</b></div>" + LL.btn("Cancel", "poCancel", "ghost") + LL.btn("Save purchase order", "poSave", "primary") + "</div></div>" +
      '<div class="card side" id="poSide">' + poSide(total) + "</div></div>";
  };
  function poSide(total) {
    var need = total > LL.PO_LIMIT;
    return '<h3>Release strategy</h3><div class="gauge thin"><span class="seg cu" style="width:' + Math.min(100, 100 * total / (LL.PO_LIMIT * 2)) + '%"></span><span class="limit" style="left:50%"><i>' + M(LL.PO_LIMIT, 0) + "</i></span></div>" +
      (need ? '<div class="note amber">' + icon("lock") + "<span>Over " + M(LL.PO_LIMIT, 0) + ": the Controller must approve this PO before it is sent. You can't approve your own PO.</span></div>" : '<div class="note green">' + icon("check") + "<span>Within the buyer's limit: released immediately.</span></div>") +
      '<p class="muted small">Approval limits are an authorization control. They make sure large commitments get a second look before the company is bound by a contract.</p>';
  }
  A.poAdd = function () { D.po.lines.push({ mat: "", qty: 1, price: 0 }); render(); };
  A.poDel = function (el) { D.po.lines.splice(+el.dataset.i, 1); if (!D.po.lines.length) D.po.lines.push({ mat: "", qty: 1, price: 0 }); render(); };
  A.poCancel = function () { D.po = null; location.hash = "#/purchasing"; };
  A.poSave = function () { var d = D.po; var res = LL.result(LL.createPO(d.vendor, d.lines.map(function (l) { return { mat: l.mat, qty: +l.qty, price: +l.price }; }))); if (res.ok) { D.po = null; location.hash = "#/po/" + res.doc.id; } };
  LL.onInput.po = function (el) {
    var d = D.po, k = el.dataset.po, i = +el.dataset.i;
    if (k === "vendor") { d.vendor = el.value; d.lines = [{ mat: "", qty: 1, price: 0 }]; render(); return; }
    if (k === "mat") { d.lines[i].mat = el.value; var m = LL.mat(el.value); d.lines[i].price = m ? m.cost : 0; render(); return; }
    if (k === "qty") d.lines[i].qty = Math.max(0, Math.floor(+el.value || 0));
    if (k === "price") d.lines[i].price = +el.value || 0;
    var total = d.lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0);
    $("#poTotal").textContent = M(total); $("#poSide").innerHTML = poSide(total);
    var row = el.closest("tr"); if (row) row.querySelector("td.num b").textContent = M(d.lines[i].qty * d.lines[i].price);
  };
  V.po = function (id, x, q) {
    var p = LL.find("pos", id); if (!p) return LL.pageHead("Purchase order not found") + LL.empty("There's no purchase order " + esc(id) + ".");
    var v = LL.vend(p.vendor), tab = q.tab || "items", total = LL.poTotal(p);
    var grs = LL.S.grs.filter(function (g) { return g.po === id; }), ivs = LL.S.vinvoices.filter(function (iv) { return iv.po === id; });
    var paid = ivs.some(function (iv) { return iv.status === "paid"; }), posted = ivs.some(function (iv) { return ["posted", "paid"].indexOf(iv.status) >= 0; }), blocked = ivs.some(function (iv) { return iv.status === "blocked"; });
    var nodes = [
      { label: "Purchase order", sub: p.id, state: "done" },
      { label: "Approval", sub: p.status === "awaiting_approval" ? "Waiting for Controller" : p.approvedBy ? "By " + LL.userObj(p.approvedBy).name.split(" ")[0] : "Not needed", state: p.status === "awaiting_approval" ? "warn" : "done" },
      { label: "Goods receipt", sub: grs.length ? grs.map(function (g) { return g.id; }).join(", ") : "", state: p.status === "received" ? "done" : p.status === "partial" ? "warn" : p.status === "released" ? "now" : "" },
      { label: "Invoice", sub: ivs.length ? ivs[ivs.length - 1].invNo : "", state: blocked ? "bad" : posted ? "done" : grs.length ? "now" : "" },
      { label: "Payment", sub: paid ? "Paid" : "", state: paid ? "done" : posted ? "now" : "" }
    ];
    var act = "";
    if (p.status === "awaiting_approval") act = LL.btn(icon("check") + " Approve", "poApprove", "primary", ' data-id="' + id + '"');
    if (["released", "partial"].indexOf(p.status) >= 0) act = LL.btn(icon("box") + " Post goods receipt", "grOpen", "primary", ' data-id="' + id + '"');
    if (grs.length && p.items.some(function (i) { return i.rec > i.inv; })) act += LL.btn(icon("file") + " Enter supplier invoice", "go", "ghost", ' data-href="#/invoices/new?po=' + id + '"');
    var body = "";
    if (tab === "items") body = '<table class="t"><thead><tr><th>Material</th><th class="num">Ordered</th><th class="num">Received</th><th class="num">Invoiced</th><th class="num">Unit price</th><th class="num">Net value</th></tr></thead><tbody>' + p.items.map(function (it) { var m = LL.mat(it.mat); return "<tr><td><b>" + esc(m.name) + '</b><div class="muted small">' + it.mat + '</div></td><td class="num">' + it.qty + '</td><td class="num ' + (it.rec < it.qty ? "warnc" : "") + '">' + it.rec + '</td><td class="num">' + it.inv + '</td><td class="num">' + M(it.price) + '</td><td class="num">' + M(it.qty * it.price) + "</td></tr>"; }).join("") + '</tbody><tfoot><tr><td colspan="5">Total</td><td class="num">' + M(total) + "</td></tr></tfoot></table>";
    else if (tab === "history") body = '<table class="t"><thead><tr><th>Document</th><th>Date</th><th>By</th><th>Detail</th></tr></thead><tbody>' + grs.map(function (g) { return '<tr><td><span class="mono">GR ' + g.id + "</span></td><td>" + F(g.date) + "</td><td>" + LL.avatar(g.user) + "</td><td>" + g.items.map(function (i) { return i.qty + " × " + esc(LL.mat(i.mat).name); }).join(", ") + " · " + M(g.value) + "</td></tr>"; }).join("") + ivs.map(function (iv) { return "<tr><td>" + LL.docLink("iv", iv.id) + "</td><td>" + F(iv.date) + "</td><td>" + LL.avatar(iv.user || "grace") + "</td><td>Invoice " + esc(iv.invNo) + " · " + M(iv.amount) + " " + pill(iv.status) + "</td></tr>"; }).join("") + "</tbody></table>" + (grs.length + ivs.length ? "" : LL.empty("Nothing received or invoiced yet."));
    else if (tab === "acct") { var jes = []; grs.forEach(function (g) { jes = jes.concat(LL.jeFor("GR " + g.id)); }); ivs.forEach(function (iv) { jes = jes.concat(LL.jeFor("IV " + iv.id)); }); body = jes.length ? jes.map(function (j) { return '<div class="je-card"><div class="je-h">' + LL.srcBadge(j.src) + " " + LL.docLink("je", j.id) + ' <span class="muted">' + esc(j.text) + "</span></div>" + LL.jeTable(j, true) + "</div>"; }).join("") : LL.empty("The goods receipt is the first step that posts to the ledger."); }
    return LL.pageHead("Purchase order " + esc(id) + " " + pill(p.status), esc(v.name) + " · " + esc(v.city) + " · buyer " + esc(LL.userObj(p.buyer).name), act, '<a href="#/purchasing">Purchasing</a> / ' + esc(id)) +
      '<div class="card">' + LL.docFlow(nodes) + "</div>" + LL.tabs([["items", "Items"], ["history", "Receipts and invoices"], ["acct", "Accounting"]], tab, "#/po/" + id + "?tab=") + '<div class="card">' + body + "</div>";
  };
  A.poApprove = function (el) { LL.result(LL.approvePO(el.dataset.id), "Purchase order approved"); };
  A.grOpen = function (el) {
    var p = LL.find("pos", el.dataset.id);
    LL.modal('<div class="dlg-h"><h2>' + icon("box") + " Goods receipt for PO " + p.id + '</h2><button class="icon-btn x" data-act="closeModal" aria-label="Close">' + icon("x") + '</button></div><div class="delivery-note"><div><span class="muted small">Delivery from</span><b>' + esc(LL.vend(p.vendor).name) + '</b></div><div><span class="muted small">Carrier says</span><b>“Full order on the truck”</b></div></div>' +
      '<div class="note blue">' + icon("lock") + "<span><b>Blind count.</b> The ordered quantity is hidden. Count what is actually on the pallet and enter it.</span></div>" +
      '<table class="t"><thead><tr><th>Material</th><th class="num">Ordered</th><th>Counted</th></tr></thead><tbody>' + p.items.filter(function (i) { return i.rec < i.qty; }).map(function (i) { return "<tr><td><b>" + esc(LL.mat(i.mat).name) + '</b><div class="muted small">' + i.mat + '</div></td><td class="num"><span class="hidden-qty" title="Hidden for a blind count">•••</span></td><td><input type="number" min="0" step="1" class="grq" data-mat="' + i.mat + '" placeholder="Count"></td></tr>'; }).join("") +
      '</tbody></table><p class="muted small">Tip: in the missions, the full quantity arrives. Try entering more than was ordered to see the over-delivery check.</p><div class="dialog-foot">' + LL.btn("Cancel", "closeModal", "ghost") + LL.btn("Post goods receipt", "grPost", "primary", ' data-id="' + p.id + '"') + "</div>");
  };
  A.grPost = function (el) {
    var counts = {}; document.querySelectorAll(".grq").forEach(function (i) { counts[i.dataset.mat] = +i.value || 0; });
    var res = LL.goodsReceipt(el.dataset.id, counts); if (res.ok || res.denied) LL.closeModal(); LL.result(res, "Goods receipt posted");
  };

  /* ================= SUPPLIER INVOICES ================= */
  V.invoices = function (sub, x, q) {
    if (sub === "new") return V.ivNew(q);
    var S = LL.S, tab = sub || "inbox";
    var inbox = S.inbox.filter(function (i) { return !i.done; }), blocked = S.vinvoices.filter(function (v) { return v.status === "blocked"; });
    var html = LL.pageHead("Supplier invoices", "Every PO invoice goes through the three-way match: purchase order, goods receipt and invoice must agree within ±" + LL.TOL * 100 + "% on price.", LL.btn(icon("plus") + " Enter invoice", "go", "primary", ' data-href="#/invoices/new"')) +
      LL.tabs([["inbox", "Inbox", inbox.length], ["blocked", "Blocked", blocked.length], ["all", "All invoices", S.vinvoices.length]], tab, "#/invoices/");
    if (tab === "inbox") html += inbox.length ? '<div class="paper-grid">' + inbox.map(paper).join("") + "</div>" : LL.empty("The inbox is empty. Every scanned invoice has been processed.");
    else {
      var list = (tab === "blocked" ? blocked : S.vinvoices).slice().reverse();
      html += '<div class="card flush">' + (list.length ? '<table class="t hover"><thead><tr><th>Document</th><th>Vendor</th><th>Vendor invoice</th><th>PO</th><th>Due</th><th class="num">Amount</th><th>Status</th></tr></thead><tbody>' + list.map(function (v) { return '<tr data-href="#/iv/' + v.id + '"><td>' + LL.docLink("iv", v.id) + "</td><td>" + esc(LL.vend(v.vendor).name) + '</td><td class="mono">' + esc(v.invNo) + "</td><td>" + (v.po ? LL.docLink("po", v.po) : '<span class="muted">none</span>') + "</td><td>" + F(v.due) + '</td><td class="num">' + M(v.amount) + "</td><td>" + pill(v.status) + "</td></tr>"; }).join("") + "</tbody></table>" : LL.empty("No blocked invoices.")) + "</div>";
    }
    return html;
  };
  function paper(i) {
    var v = LL.vend(i.vendor), tot = i.lines.reduce(function (s, l) { return s + (l.amount || l.qty * l.price); }, 0);
    return '<article class="paper"><div class="paper-doc"><div class="pd-h"><div><b class="pd-logo">' + esc(v.name) + '</b><small>' + esc(v.city) + '</small></div><div class="pd-title">INVOICE</div></div><div class="pd-meta"><span>Invoice no.</span><b>' + esc(i.invNo) + '</b><span>Date</span><b>' + F(i.date) + '</b><span>Your PO</span><b>' + (i.po || "—") + '</b><span>Bill to</span><b>Kestrel Cycles Inc.</b></div><table class="pd-t"><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>' +
      i.lines.map(function (l) { return l.desc ? "<tr><td>" + esc(l.desc) + '</td><td></td><td></td><td>' + M(l.amount) + "</td></tr>" : "<tr><td>" + esc(LL.mat(l.mat).name) + "</td><td>" + l.qty + "</td><td>" + M(l.price) + "</td><td>" + M(l.qty * l.price) + "</td></tr>"; }).join("") +
      '</tbody></table><div class="pd-total"><span>Amount due</span><b>' + M(tot) + '</b></div><div class="pd-foot">Payment terms: net ' + v.terms + " days · Remit to " + esc(v.bank.name) + '</div></div><div class="paper-act"><span class="muted small">' + icon("mail") + " " + esc(i.note) + "</span>" + LL.btn("Enter this invoice " + icon("arrow"), "go", "primary small", ' data-href="#/invoices/new?inbox=' + i.id + '"') + "</div></article>";
  }
  V.ivNew = function (q) {
    var S = LL.S, ib = q.inbox && LL.find("inbox", q.inbox);
    var key = (q.inbox || "") + "|" + (q.po || "");
    if (!D.iv || D.iv.key !== key) {
      var d0 = { key: key, vendor: "", po: "", invNo: "", lines: [], amount: 0, inbox: q.inbox || null, text: "" };
      if (ib) { d0.vendor = ib.vendor; d0.po = ib.po || ""; d0.invNo = ib.invNo; if (ib.po) d0.lines = ib.lines.map(function (l) { return { mat: l.mat, qty: l.qty, price: l.price }; }); else { d0.amount = ib.lines[0].amount; d0.text = ib.lines[0].desc; } }
      else if (q.po) { var p0 = LL.find("pos", q.po); d0.vendor = p0.vendor; d0.po = q.po; fillFromPO(d0); }
      D.iv = d0;
    }
    var d = D.iv;
    var pos = S.pos.filter(function (p) { return p.vendor === d.vendor && p.items.some(function (i) { return i.rec > i.inv || (ib && ib.po === p.id); }); });
    var html = LL.pageHead("Enter supplier invoice", ib ? "From the inbox (" + esc(ib.note) + "). Check every field against the paper invoice." : "Enter the vendor's invoice and match it against the PO and goods receipt.", "", '<a href="#/invoices">Supplier invoices</a> / New') +
      '<div class="split wide-left"><div class="card"><div class="fgrid"><label class="fld"><span>Vendor</span><select data-iv="vendor">' + LL.opts(S.vendors.map(function (v) { return [v.id, v.name]; }), d.vendor, "Choose the vendor…") + '</select></label><label class="fld"><span>Vendor invoice number</span><input type="text" data-iv="invNo" value="' + esc(d.invNo) + '" placeholder="e.g. AFW-6120"></label>' +
      '<label class="fld"><span>Purchase order</span><select data-iv="po">' + LL.opts(pos.map(function (p) { return [p.id, p.id + " · " + M(LL.poTotal(p), 0)]; }), d.po, d.vendor ? "No purchase order" : "Choose a vendor first") + "</select></label></div>" +
      (d.po ? '<table class="t lines"><thead><tr><th>Material</th><th>Invoiced quantity</th><th>Invoiced unit price</th><th class="num">Amount</th></tr></thead><tbody>' + d.lines.map(function (l, i) { return "<tr><td><b>" + esc(LL.mat(l.mat).name) + '</b></td><td><input type="number" min="0" step="1" value="' + l.qty + '" data-iv="qty" data-i="' + i + '"></td><td><input type="number" min="0" step="0.01" value="' + l.price + '" data-iv="price" data-i="' + i + '"></td><td class="num"><b>' + M(l.qty * l.price) + "</b></td></tr>"; }).join("") + "</tbody></table>"
        : '<div class="fgrid"><label class="fld"><span>Description</span><input type="text" data-iv="text" value="' + esc(d.text) + '"></label><label class="fld"><span>Invoice amount</span><input type="number" step="0.01" data-iv="amount" value="' + (d.amount || "") + '"></label></div>') +
      '<div class="form-foot"><div class="total"><span>Invoice total</span><b id="ivTotal">' + M(ivTotal(d)) + "</b></div>" + LL.btn("Cancel", "ivCancel", "ghost") + LL.btn("Post invoice", "ivPost", "primary") + '</div></div><div id="matchPanel">' + matchPanel(d) + "</div></div>";
    return html;
  };
  function fillFromPO(d) { var p = LL.find("pos", d.po); d.lines = p ? p.items.filter(function (i) { return i.rec > i.inv; }).map(function (i) { return { mat: i.mat, qty: i.rec - i.inv, price: i.price }; }) : []; }
  function ivTotal(d) { return d.po ? d.lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0) : (+d.amount || 0); }
  function matchPanel(d) {
    if (!d.vendor) return '<div class="card side"><h3>Three-way match</h3>' + LL.empty("Choose a vendor and PO to see the match.") + "</div>";
    var mp = LL.matchPreview({ vendor: d.vendor, po: d.po, invNo: d.invNo, lines: d.lines });
    var ok = !mp.reasons.length;
    var rows = mp.rows.map(function (r) { return '<div class="m3"><div class="m3-h">' + esc(LL.mat(r.mat).name) + '</div><div class="m3-g"><div class="m3-c"><span>Purchase order</span><b>' + r.poQty + " × " + M(r.poPrice) + '</b></div><div class="m3-c"><span>Goods receipt</span><b>' + r.grQty + " received</b>" + (r.prevInv ? '<small>' + r.prevInv + " already invoiced</small>" : "") + '</div><div class="m3-c ' + (r.qOk && r.pOk ? "good" : "bad") + '"><span>Invoice</span><b>' + r.invQty + " × " + M(r.invPrice) + '</b></div></div><div class="m3-checks"><span class="ck ' + (r.qOk ? "y" : "n") + '">' + icon(r.qOk ? "check" : "x") + "Quantity</span><span class=\"ck " + (r.pOk ? "y" : "n") + '">' + icon(r.pOk ? "check" : "x") + "Price " + (r.pdiff ? (r.pdiff > 0 ? "+" : "") + (r.pdiff * 100).toFixed(1) + "%" : "") + "</span></div></div>"; }).join("");
    return '<div class="card side"><div class="card-h"><h3>Three-way match</h3>' + (ok ? '<span class="pill green">Match passed</span>' : '<span class="pill red">Will be blocked</span>') + "</div>" + rows +
      (mp.reasons.length ? '<ul class="reasons">' + mp.reasons.map(function (r) { return "<li>" + icon("alert") + "<span>" + esc(r) + "</span></li>"; }).join("") + "</ul>" : '<div class="note green">' + icon("check") + "<span>Quantity and price agree with the PO and goods receipt. The invoice will post and be scheduled for payment.</span></div>") + "</div>";
  }
  LL.onInput.iv = function (el) {
    var d = D.iv, k = el.dataset.iv, i = +el.dataset.i;
    if (k === "vendor") { d.vendor = el.value; d.po = ""; d.lines = []; render(); return; }
    if (k === "po") { d.po = el.value; fillFromPO(d); render(); return; }
    if (k === "invNo") d.invNo = el.value; else if (k === "text") d.text = el.value; else if (k === "amount") d.amount = +el.value || 0;
    else if (k === "qty") d.lines[i].qty = Math.max(0, Math.floor(+el.value || 0)); else if (k === "price") d.lines[i].price = +el.value || 0;
    $("#matchPanel").innerHTML = matchPanel(d); $("#ivTotal").textContent = M(ivTotal(d));
    var row = el.closest("tr"); if (row && d.lines[i]) row.querySelector("td.num b").textContent = M(d.lines[i].qty * d.lines[i].price);
  };
  A.ivCancel = function () { D.iv = null; location.hash = "#/invoices"; };
  A.ivPost = function () {
    var d = D.iv;
    var res = LL.result(LL.enterInvoice({ vendor: d.vendor, po: d.po || null, invNo: d.invNo, lines: d.lines.map(function (l) { return { mat: l.mat, qty: +l.qty, price: +l.price }; }), amount: d.amount, text: d.text, inbox: d.inbox }), "Supplier invoice");
    if (res.ok) { D.iv = null; location.hash = "#/iv/" + res.doc.id; }
  };
  V.iv = function (id) {
    var v = LL.find("vinvoices", id); if (!v) return LL.pageHead("Invoice not found") + LL.empty("There's no invoice " + esc(id) + ".");
    var vend = LL.vend(v.vendor), jes = LL.jeFor("IV " + id), act = "";
    if (v.status === "blocked") act = LL.btn(icon("x") + " Reject invoice", "ivResolve", "danger ghost", ' data-id="' + id + '" data-mode="reject"') + (v.duplicate || !v.po ? "" : LL.btn(icon("check") + " Post for received quantity at PO price", "ivResolve", "primary", ' data-id="' + id + '" data-mode="received"'));
    var mp = v.po ? LL.matchPreview({ vendor: v.vendor, po: v.po, invNo: "", lines: v.lines }) : null;
    return LL.pageHead("Supplier invoice " + esc(v.invNo) + " " + pill(v.status), esc(vend.name) + " · document " + esc(id) + " · " + M(v.amount) + " · due " + F(v.due), act, '<a href="#/invoices/all">Supplier invoices</a> / ' + esc(id)) +
      (v.status === "blocked" ? '<div class="card alertcard"><h3>' + icon("alert") + " Blocked for payment</h3><ul class=\"reasons\">" + v.reasons.map(function (r) { return "<li>" + icon("x") + "<span>" + esc(r) + "</span></li>"; }).join("") + '</ul><p class="muted">' + (v.duplicate ? "Never pay a duplicate. Reject it, and the vendor's original invoice stays in place." : "Pay only for what was received, at the price agreed on the PO, and ask the vendor for a credit memo for the difference. Or reject the invoice and ask for a corrected one.") + "</p></div>" : "") +
      (v.resolution ? '<div class="note green big">' + icon("check") + "<span>" + esc(v.resolution) + "</span></div>" : "") +
      '<div class="grid2"><div class="card"><h3>Invoice details</h3><dl class="kv wide"><dt>Vendor</dt><dd>' + esc(vend.name) + "</dd><dt>Vendor invoice number</dt><dd class=\"mono\">" + esc(v.invNo) + "</dd><dt>Purchase order</dt><dd>" + (v.po ? LL.docLink("po", v.po) : "None") + "</dd><dt>Entered</dt><dd>" + F(v.date) + "</dd><dt>Due</dt><dd>" + F(v.due) + "</dd><dt>Amount</dt><dd><b>" + M(v.amount) + "</b></dd>" + (v.run ? "<dt>Payment run</dt><dd>" + LL.docLink("run", v.run) + "</dd>" : "") + "</dl>" + (v.lines && v.lines.length && v.lines[0].mat ? '<table class="t compact"><thead><tr><th>Material</th><th class="num">Qty</th><th class="num">Price</th></tr></thead><tbody>' + v.lines.map(function (l) { return "<tr><td>" + esc(LL.mat(l.mat).name) + '</td><td class="num">' + l.qty + '</td><td class="num">' + M(l.price) + "</td></tr>"; }).join("") + "</tbody></table>" : "") + "</div>" +
      '<div class="card"><h3>Accounting</h3>' + (jes.length ? jes.map(function (j) { return '<div class="je-h">' + LL.srcBadge(j.src) + " " + LL.docLink("je", j.id) + "</div>" + LL.jeTable(j, true); }).join("") : LL.empty(v.status === "blocked" ? "Nothing is posted while the invoice is blocked." : "No accounting document.")) + "</div></div>";
  };
  A.ivResolve = function (el) { LL.result(LL.resolveInvoice(el.dataset.id, el.dataset.mode), el.dataset.mode === "reject" ? "Invoice rejected" : "Invoice posted"); };

  /* ================= PAYMENTS ================= */
  V.payments = function (sub) {
    var S = LL.S, tab = sub || "open";
    var open = S.vinvoices.filter(function (v) { return v.status === "posted"; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var runs = S.payruns.slice().reverse();
    var html = LL.pageHead("Payments", "Select invoices for a payment run. Runs over " + M(LL.RUN_LIMIT, 0) + " need a second approval before Treasury can release them.", "") +
      LL.tabs([["open", "Open items", open.filter(function (v) { return !v.run; }).length], ["runs", "Payment runs", runs.length]], tab, "#/payments/");
    if (tab === "open") {
      html += '<div class="card flush"><table class="t"><thead><tr><th></th><th>Document</th><th>Vendor</th><th>Vendor invoice</th><th>Due</th><th class="num">Days to due</th><th class="num">Amount</th></tr></thead><tbody>' +
        open.map(function (v) { var dd = LL.daysBetween(S.date, v.due); return "<tr><td>" + (v.run ? '<span class="muted small">' + v.run + "</span>" : '<input type="checkbox" class="runck" value="' + v.id + '"' + (dd <= 14 ? " checked" : "") + ">") + "</td><td>" + LL.docLink("iv", v.id) + "</td><td>" + esc(LL.vend(v.vendor).name) + '</td><td class="mono">' + esc(v.invNo) + "</td><td>" + F(v.due) + '</td><td class="num ' + (dd < 0 ? "neg" : dd <= 7 ? "warnc" : "") + '">' + dd + '</td><td class="num">' + M(v.amount) + "</td></tr>"; }).join("") +
        "</tbody></table>" + (open.length ? "" : LL.empty("No open supplier invoices.")) + '<div class="card-foot"><span class="muted small">Invoices due within 14 days are pre-selected.</span>' + LL.btn(icon("card") + " Create payment proposal", "runCreate", "primary") + "</div></div>";
    } else {
      html += runs.length ? runs.map(function (r) { return '<a class="run-card" href="#/run/' + r.id + '"><div><b class="mono">' + r.id + '</b><span class="muted small">' + F(r.date) + " · " + r.items.length + " payments · created by " + esc(LL.userObj(r.by).name) + "</span></div><b>" + M(r.total) + "</b>" + pill(r.status) + icon("arrow") + "</a>"; }).join("") : LL.empty("No payment runs yet.");
    }
    return html;
  };
  A.runCreate = function () { var ids = Array.prototype.map.call(document.querySelectorAll(".runck:checked"), function (c) { return c.value; }); var res = LL.result(LL.createRun(ids), "Payment proposal"); if (res.ok) location.hash = "#/payments/runs"; };
  V.run = function (id) {
    var r = LL.find("payruns", id); if (!r) return LL.pageHead("Payment run not found");
    var act = r.status === "awaiting_approval" ? LL.btn("Delete proposal", "runCancel", "ghost", ' data-id="' + id + '"') + LL.btn(icon("check") + " Approve run", "runApprove", "primary", ' data-id="' + id + '"') : r.status === "proposed" ? LL.btn("Delete proposal", "runCancel", "ghost", ' data-id="' + id + '"') + LL.btn(icon("card") + " Release payments", "runRelease", "primary", ' data-id="' + id + '"') : "";
    var items = r.items.map(function (i) { return LL.find("vinvoices", i); });
    var nodes = [{ label: "Proposal", sub: "By " + LL.userObj(r.by).name.split(" ")[0], state: "done" }, { label: "Second approval", sub: r.total > LL.RUN_LIMIT ? (r.approvedBy ? "By " + LL.userObj(r.approvedBy).name.split(" ")[0] : "Controller") : "Not needed", state: r.status === "awaiting_approval" ? "warn" : "done" }, { label: "Release", sub: r.releasedBy ? "By " + LL.userObj(r.releasedBy).name.split(" ")[0] : "", state: r.status === "released" ? "done" : r.status === "proposed" ? "now" : "" }, { label: "Positive pay file", sub: r.file ? "Sent to bank" : "", state: r.file ? "done" : "" }];
    return LL.pageHead("Payment run " + esc(id) + " " + pill(r.status), r.items.length + " payments · " + M(r.total), act, '<a href="#/payments/runs">Payments</a> / ' + esc(id)) +
      (r.fraud ? '<div class="card alertcard"><h3>' + icon("alert") + " Payment sent to an unverified bank account</h3><p>Velo Components was paid at the account from the email request. The real Velo Components has not been paid, and the money is with a fraudster. Mission 5 shows how to stop this.</p></div>" : "") +
      '<div class="card">' + LL.docFlow(nodes) + '</div><div class="card flush"><table class="t"><thead><tr><th>Vendor</th><th>Invoice</th><th>Pay to</th><th class="num">Amount</th></tr></thead><tbody>' + items.map(function (v) { var vend = LL.vend(v.vendor); return "<tr><td>" + esc(vend.name) + '</td><td class="mono">' + esc(v.invNo) + "</td><td>" + esc(vend.bank.name) + ' <span class="mono muted">' + vend.bank.acct + "</span>" + (vend.fraudBank ? ' <span class="pill red">changed by email</span>' : "") + '</td><td class="num">' + M(v.amount) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      (r.file ? '<h2 class="sec">Positive pay file sent to the bank</h2><pre class="file">ACCOUNT=KC01-OPERATING  DATE=' + r.date + "  ITEMS=" + r.file.length + "\n" + r.file.map(function (f, i) { return String(i + 1).padStart(3, "0") + "  " + f.routing + "  " + f.acct.replace(/[^0-9]/g, "").padStart(8, "*") + "  " + String(f.amount.toFixed(2)).padStart(12) + "  " + f.vendor; }).join("\n") + "\nTOTAL " + r.total.toFixed(2) + "</pre><p class=\"muted small\">The bank will only honor payments that match this file exactly. That's positive pay.</p>" : "");
  };
  A.runApprove = function (el) { LL.result(LL.approveRun(el.dataset.id), "Payment run approved"); };
  A.runRelease = function (el) { var res = LL.result(LL.releaseRun(el.dataset.id), "Payments released"); if (res.fraud) LL.toast({ ok: false, msg: "One payment went to a bank account changed by an email request. See the warning on the run." }, "Fraud alert"); };
  A.runCancel = function (el) { LL.result(LL.cancelRun(el.dataset.id), "Proposal deleted"); location.hash = "#/payments"; };

  /* ================= MASTER DATA ================= */
  V.masters = function (sub) {
    var S = LL.S, tab = sub || "materials", html = LL.pageHead("Master data", "The stable records every transaction reuses. Changes are restricted, approved and logged.", "") +
      LL.tabs([["materials", "Materials", S.materials.length], ["customers", "Customers", S.customers.length], ["vendors", "Vendors", S.vendors.length], ["changes", "Change requests", S.changes.filter(function (c) { return c.status === "pending"; }).length]], tab, "#/masters/");
    if (tab === "materials") html += '<div class="card flush"><table class="t"><thead><tr><th>Material</th><th>Category</th><th class="num">On hand</th><th class="num">Reserved</th><th class="num">Moving avg cost</th><th class="num">List price</th><th class="num">Margin</th><th class="num">Stock value</th></tr></thead><tbody>' + S.materials.map(function (m) { return "<tr><td><b>" + esc(m.name) + '</b><div class="muted small mono">' + m.id + "</div></td><td>" + m.cat + '</td><td class="num">' + m.stock + '</td><td class="num">' + LL.reserved(m.id) + '</td><td class="num">' + M(m.cost) + '</td><td class="num">' + M(m.price) + '</td><td class="num">' + Math.round(100 * (m.price - m.cost) / m.price) + '%</td><td class="num">' + M(m.stock * m.cost) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (tab === "customers") html += '<div class="card flush"><table class="t"><thead><tr><th>Customer</th><th>Contact</th><th>Terms</th><th class="num">Open AR</th><th>Credit limit</th><th></th></tr></thead><tbody>' + S.customers.map(function (c) { return "<tr><td><b>" + esc(c.name) + '</b><div class="muted small">' + c.id + " · " + esc(c.city) + "</div></td><td>" + esc(c.contact) + "</td><td>Net " + c.terms + '</td><td class="num">' + M(LL.openAR(c.id), 0) + '</td><td><input type="number" step="1000" class="limit-in" id="lim-' + c.id + '" value="' + c.limit + '"></td><td>' + LL.btn("Save", "limitSave", "small ghost", ' data-c="' + c.id + '"') + "</td></tr>"; }).join("") + '</tbody></table><div class="card-foot"><span class="muted small">Only Credit Management (Marcus Lee) can change credit limits. Every change is written to the audit log.</span></div></div>';
    if (tab === "vendors") html += '<div class="card flush"><table class="t"><thead><tr><th>Vendor</th><th>Phone on file</th><th>Terms</th><th>Bank</th><th>Routing</th><th>Account</th></tr></thead><tbody>' + S.vendors.map(function (v) { return "<tr><td><b>" + esc(v.name) + '</b><div class="muted small">' + v.id + " · " + esc(v.city) + "</div></td><td>" + v.phone + "</td><td>Net " + v.terms + "</td><td>" + esc(v.bank.name) + (v.fraudBank ? ' <span class="pill red">changed</span>' : "") + '</td><td class="mono">' + v.bank.routing + '</td><td class="mono">' + v.bank.acct + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (tab === "changes") { S.flags.viewedCR = true; html += S.changes.map(changeCard).join(""); }
    return html;
  };
  function changeCard(c) {
    var v = LL.vend(c.vendor), cur = c.oldBank || v.bank;
    return '<div class="card cr"><div class="card-h"><h3>' + esc(c.id) + ": bank details for " + esc(v.name) + "</h3>" + pill(c.status, c.status === "approved" ? "Approved" : c.status === "rejected" ? "Rejected" : "Pending approval") + "</div>" +
      '<div class="email"><div class="em-h"><span class="muted small">From</span><b>' + esc(c.from) + '</b><span class="muted small">To</span><b>ap@kestrelcycles.com</b><span class="muted small">Subject</span><b>URGENT: updated remittance details</b><span class="muted small">Received</span><b>' + F(c.requested) + '</b></div><p>' + esc(c.email) + "</p></div>" +
      '<div class="bank-cmp"><div><span class="muted small">Current (verified)</span><b>' + esc(cur.name) + '</b><span class="mono">' + cur.routing + " · " + cur.acct + '</span></div><div class="arrow">' + icon("arrow") + '</div><div class="new"><span class="muted small">Requested</span><b>' + esc(c.newBank.name) + '</b><span class="mono">' + c.newBank.routing + " · " + c.newBank.acct + "</span></div></div>" +
      '<p class="muted small">Raised by ' + esc(LL.userObj(c.by).name) + " from the email above. Vendor phone number already on file: <b>" + v.phone + "</b>.</p>" +
      (c.called ? '<div class="note red">' + icon("phone") + "<span><b>Call-back result:</b> Velo Components' accounts manager says they have not changed banks and never sent this email. The domain velo-components-billing.com is not theirs.</span></div>" : "") +
      (c.status === "pending" ? '<div class="card-foot">' + LL.btn(icon("phone") + " Call vendor on number on file", "crCall", "ghost", ' data-id="' + c.id + '"') + LL.btn(icon("x") + " Reject", "crDecide", "danger ghost", ' data-id="' + c.id + '" data-ok="0"') + LL.btn(icon("check") + " Approve change", "crDecide", "primary", ' data-id="' + c.id + '" data-ok="1"') + "</div>" : '<p class="muted small">Decided by ' + esc(LL.userObj(c.decidedBy).name) + " on " + F(c.decided) + ".</p>") + "</div>";
  }
  A.crCall = function (el) { LL.result(LL.callVendor(el.dataset.id), "Call-back verification"); };
  A.crDecide = function (el) { LL.result(LL.decideChange(el.dataset.id, el.dataset.ok === "1"), el.dataset.ok === "1" ? "Change approved" : "Change rejected"); };
  A.limitSave = function (el) { LL.result(LL.setLimit(el.dataset.c, +$("#lim-" + el.dataset.c).value), "Credit limit"); };

  /* ================= GENERAL LEDGER ================= */
  V.gl = function (sub, x, q) {
    if (sub === "new") return V.jeNew();
    var S = LL.S, src = q.src || "", ac = q.acct || "";
    var list = S.journal.slice().reverse().filter(function (j) { return (!src || j.src === src) && (!ac || j.lines.some(function (l) { return l[0] === ac; })); });
    var mon = S.date.slice(0, 7), dep = S.journal.some(function (j) { return j.ref === "DEP " + mon; });
    return LL.pageHead("General ledger", "Every posting from every module lands here. Most were created automatically by the subledgers.", LL.btn(icon("plus") + " New journal entry", "go", "primary", ' data-href="#/gl/new"')) +
      '<div class="grid-side"><div><div class="filters"><select id="glSrc">' + LL.opts([["SD", "Sales (SD)"], ["MM", "Materials (MM)"], ["FI", "Finance (FI)"], ["AA", "Assets (AA)"]], src, "All sources") + '</select><select id="glAcct">' + LL.opts(S.accounts.map(function (a) { return [a[0], a[0] + " " + a[1]]; }), ac, "All accounts") + '</select><span class="muted small">' + list.length + ' documents</span></div><div class="card flush"><table class="t hover"><thead><tr><th>Document</th><th>Source</th><th>Date</th><th>Reference</th><th>Text</th><th>User</th><th class="num">Amount</th></tr></thead><tbody>' +
      list.map(function (j) { return '<tr data-href="#/je/' + j.id + '"><td>' + LL.docLink("je", j.id) + "</td><td>" + LL.srcBadge(j.src) + "</td><td>" + F(j.date) + '</td><td class="mono small">' + esc(j.ref) + "</td><td>" + esc(j.text) + "</td><td>" + (j.user === "system" ? '<span class="muted">system</span>' : LL.avatar(j.user)) + '</td><td class="num">' + M(j.lines.reduce(function (s, l) { return s + l[1]; }, 0)) + "</td></tr>"; }).join("") + "</tbody></table></div></div>" +
      '<div class="card side"><h3>Period-end jobs</h3><p class="muted small">November 2026</p><div class="job"><span>' + icon(dep ? "check" : "cal") + "<b>Depreciation run</b><small>Straight-line, " + M(1000, 0) + " a month</small></span>" + (dep ? '<span class="pill green">Posted</span>' : LL.btn("Run", "depRun", "small primary")) + '</div><div class="job"><span>' + icon("book") + '<b>Accruals</b><small>Post with a manual journal entry</small></span><a class="btn small ghost" href="#/gl/new">New entry</a></div><div class="job"><span>' + icon("chart") + '<b>Trial balance</b><small>Check debits equal credits</small></span><a class="btn small ghost" href="#/reports/tb">Open</a></div></div></div>';
  };
  document.addEventListener("change", function (e) { if (e.target.id === "glSrc" || e.target.id === "glAcct") { var s = $("#glSrc").value, a = $("#glAcct").value; location.hash = "#/gl?src=" + s + "&acct=" + a; } });
  A.depRun = function () { LL.result(LL.runDepreciation(), "Depreciation posted"); };
  V.je = function (id) {
    var j = LL.find("journal", id); if (!j) return LL.pageHead("Document not found");
    return LL.pageHead("Journal entry " + esc(id), LL.srcBadge(j.src) + " " + esc(j.text), "", '<a href="#/gl">General ledger</a> / ' + esc(id)) +
      '<div class="grid2"><div class="card"><h3>Header</h3><dl class="kv wide"><dt>Document</dt><dd class="mono">' + j.id + "</dd><dt>Posting date</dt><dd>" + F(j.date) + "</dd><dt>Source</dt><dd>" + { SD: "Sales and distribution (automatic)", MM: "Materials management (automatic)", FI: "Financial accounting", AA: "Asset accounting (automatic)" }[j.src] + "</dd><dt>Reference</dt><dd class=\"mono\">" + esc(j.ref) + "</dd><dt>Entered by</dt><dd>" + esc(LL.userObj(j.user) ? LL.userObj(j.user).name : j.user) + "</dd></dl></div>" +
      '<div class="card"><h3>Line items</h3>' + LL.jeTable(j) + '<div class="taccts">' + j.lines.map(function (l) { return '<div class="tacct"><div class="ta-h">' + l[0] + " " + esc(LL.acctName(l[0])) + '</div><div class="ta-b"><span>' + (l[1] ? M(l[1]) : "") + "</span><span>" + (l[2] ? M(l[2]) : "") + "</span></div></div>"; }).join("") + "</div></div></div>";
  };
  V.jeNew = function () {
    var S = LL.S, d = D.je = D.je || { text: "", lines: [["", 0, 0], ["", 0, 0]] };
    var dr = d.lines.reduce(function (s, l) { return s + (+l[1] || 0); }, 0), cr = d.lines.reduce(function (s, l) { return s + (+l[2] || 0); }, 0);
    var acctOpts = function (v) { return LL.opts(S.accounts.map(function (a) { return [a[0], a[0] + " " + a[1]]; }), v, "Account…"); };
    return LL.pageHead("New journal entry", "Manual entries carry more risk than automatic postings, so they are restricted to the Controller and logged.", "", '<a href="#/gl">General ledger</a> / New') +
      '<div class="card"><label class="fld"><span>Header text</span><input type="text" data-je="text" value="' + esc(d.text) + '" placeholder="e.g. Accrue November utilities"></label><table class="t lines"><thead><tr><th style="width:50%">Account</th><th>Debit</th><th>Credit</th><th></th></tr></thead><tbody>' +
      d.lines.map(function (l, i) { return '<tr><td><select data-je="acct" data-i="' + i + '">' + acctOpts(l[0]) + '</select></td><td><input type="number" min="0" step="0.01" value="' + (l[1] || "") + '" data-je="dr" data-i="' + i + '"></td><td><input type="number" min="0" step="0.01" value="' + (l[2] || "") + '" data-je="cr" data-i="' + i + '"></td><td><button class="icon-btn" data-act="jeDel" data-i="' + i + '" aria-label="Remove line">' + icon("x") + "</button></td></tr>"; }).join("") +
      '</tbody></table><button class="btn ghost small" data-act="jeAdd">' + icon("plus") + ' Add line</button><div class="form-foot"><div class="total" id="jeBal">' + jeBal(dr, cr) + "</div>" + LL.btn("Cancel", "jeCancel", "ghost") + LL.btn("Post entry", "jePost", "primary") + "</div></div>" +
      '<div class="note blue big">' + icon("lock") + "<span>Accounts 1100, 1200, 2000 and 2100 are reconciliation accounts. They can only be posted by the subledgers, so receivables, inventory and payables always agree with their detail.</span></div>";
  };
  function jeBal(dr, cr) { var ok = Math.abs(dr - cr) < 0.005 && dr > 0; return '<span>Debits ' + M(dr) + " · Credits " + M(cr) + "</span><b class=\"" + (ok ? "pos" : "neg") + '">' + (ok ? "Balanced" : "Difference " + M(dr - cr)) + "</b>"; }
  LL.onInput.je = function (el) {
    var d = D.je, k = el.dataset.je, i = +el.dataset.i;
    if (k === "text") { d.text = el.value; return; }
    if (k === "acct") d.lines[i][0] = el.value; if (k === "dr") d.lines[i][1] = +el.value || 0; if (k === "cr") d.lines[i][2] = +el.value || 0;
    $("#jeBal").innerHTML = jeBal(d.lines.reduce(function (s, l) { return s + (+l[1] || 0); }, 0), d.lines.reduce(function (s, l) { return s + (+l[2] || 0); }, 0));
  };
  A.jeAdd = function () { D.je.lines.push(["", 0, 0]); render(); };
  A.jeDel = function (el) { D.je.lines.splice(+el.dataset.i, 1); while (D.je.lines.length < 2) D.je.lines.push(["", 0, 0]); render(); };
  A.jeCancel = function () { D.je = null; location.hash = "#/gl"; };
  A.jePost = function () { var d = D.je; var res = LL.result(LL.manualJE(d.text.trim(), d.lines.map(function (l) { return [l[0], +l[1] || 0, +l[2] || 0]; })), "Journal entry posted"); if (res.ok) { D.je = null; location.hash = "#/je/" + res.je.id; } };

  /* ================= REPORTS ================= */
  V.reports = function (sub) {
    var S = LL.S, tab = sub || "tb", b = LL.balances(), html = LL.pageHead("Reports", "Live from the ledger: every figure changes the moment a document posts.", "") +
      LL.tabs([["tb", "Trial balance"], ["is", "Income statement"], ["bs", "Balance sheet"], ["aging", "AR aging"], ["inv", "Inventory"], ["grir", "GR/IR"]], tab, "#/reports/");
    var row = function (l, v, cls) { return '<tr class="' + (cls || "") + '"><td>' + l + '</td><td class="num">' + M(v) + "</td></tr>"; };
    if (tab === "tb") {
      S.flags.viewedTB = true; var td = 0, tc = 0;
      var rows = S.accounts.map(function (a) { var v = b[a[0]] || 0; if (v > 0) td += v; else tc -= v; return '<tr><td class="mono">' + a[0] + "</td><td>" + esc(a[1]) + '</td><td class="num">' + (v > 0 ? M(v) : "") + '</td><td class="num">' + (v < 0 ? M(-v) : "") + "</td></tr>"; }).join("");
      var bal = Math.abs(td - tc) < 0.01;
      html += '<div class="card flush"><div class="card-h pad"><h3>Trial balance at ' + F(S.date) + "</h3>" + (bal ? '<span class="pill green">' + icon("check") + " Balanced</span>" : '<span class="pill red">Out of balance</span>') + '</div><table class="t"><thead><tr><th>Account</th><th></th><th class="num">Debit</th><th class="num">Credit</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td></td><td>Total</td><td class="num">' + M(td) + '</td><td class="num">' + M(tc) + "</td></tr></tfoot></table></div>";
    }
    if (tab === "is") {
      S.flags.viewedIS = true;
      var rev = -b["4000"], cogs = b["5000"], ppv = b["5100"], gp = rev - cogs - ppv, opex = b["6000"] + b["6100"] + b["6200"] + b["6300"], ni = gp - opex;
      html += '<div class="grid2"><div class="card"><h3>Income statement, November 2026</h3><table class="t fin"><tbody>' + row("Sales revenue", rev, "strong") + row("Cost of goods sold", -cogs) + row("Purchase price variance", -ppv) + row("Gross profit", gp, "sub") + row("Wages", -b["6000"]) + row("Rent", -b["6100"]) + row("Utilities", -b["6200"]) + row("Depreciation", -b["6300"]) + row("Net income", ni, "total") + "</tbody></table></div>" +
        '<div class="card"><h3>Where the profit comes from</h3>' + LL.bars([["Revenue", Math.max(0, rev), "t"], ["Cost of goods sold", Math.max(0, cogs), "o"], ["Operating expenses", Math.max(0, opex + ppv), "a"], ["Net income", Math.max(0, ni), "g"]]) + '<p class="muted small">Revenue and cost of goods sold were posted automatically by the billing and goods issue steps. Operating expenses come from manual entries and the depreciation run.</p></div></div>';
    }
    if (tab === "bs") {
      var ni2 = -(b["4000"] + b["5000"] + b["5100"] + b["6000"] + b["6100"] + b["6200"] + b["6300"]);
      var ta = b["1000"] + b["1100"] + b["1200"] + b["1500"] + b["1510"], tl = -(b["2000"] + b["2100"] + b["2300"]), te = -(b["3000"] + b["3100"]) + ni2;
      html += '<div class="grid2"><div class="card"><h3>Assets</h3><table class="t fin"><tbody>' + row("Cash", b["1000"]) + row("Accounts receivable", b["1100"]) + row("Inventory", b["1200"]) + row("Equipment", b["1500"]) + row("Accumulated depreciation", b["1510"]) + row("Total assets", ta, "total") + '</tbody></table></div><div class="card"><h3>Liabilities and equity</h3><table class="t fin"><tbody>' + row("Accounts payable", -b["2000"]) + row("GR/IR clearing", -b["2100"]) + row("Accrued liabilities", -b["2300"]) + row("Total liabilities", tl, "sub") + row("Common stock", -b["3000"]) + row("Retained earnings", -b["3100"]) + row("Net income this period", ni2) + row("Total liabilities and equity", tl + te, "total") + "</tbody></table></div></div>";
    }
    if (tab === "aging") {
      html += '<div class="card flush"><table class="t"><thead><tr><th>Customer</th><th class="num">Not yet due</th><th class="num">1–30 days</th><th class="num">31–60 days</th><th class="num">Over 60 days</th><th class="num">Total</th></tr></thead><tbody>' + S.customers.map(function (c) { var a = LL.aging(c.id); return "<tr><td>" + esc(c.name) + '</td><td class="num">' + M(a.current, 0) + '</td><td class="num">' + M(a.d30, 0) + '</td><td class="num">' + M(a.d60, 0) + '</td><td class="num ' + (a.d90 ? "neg" : "") + '">' + M(a.d90, 0) + '</td><td class="num"><b>' + M(LL.openAR(c.id), 0) + "</b></td></tr>"; }).join("") + '</tbody><tfoot><tr><td>Total</td><td class="num">' + M(LL.aging().current, 0) + '</td><td class="num">' + M(LL.aging().d30, 0) + '</td><td class="num">' + M(LL.aging().d60, 0) + '</td><td class="num">' + M(LL.aging().d90, 0) + '</td><td class="num">' + M(LL.openAR(), 0) + '</td></tr></tfoot></table><div class="card-foot"><span class="muted small">Subledger total ' + M(LL.openAR()) + " · GL account 1100 " + M(b["1100"]) + (Math.abs(LL.openAR() - b["1100"]) < 0.01 ? ' <span class="pill green">Reconciled</span>' : ' <span class="pill red">Difference</span>') + "</span></div></div>";
    }
    if (tab === "inv") {
      var tot = S.materials.reduce(function (s, m) { return s + m.stock * m.cost; }, 0);
      html += '<div class="card flush"><table class="t"><thead><tr><th>Material</th><th class="num">Quantity</th><th class="num">Moving average cost</th><th class="num">Value</th></tr></thead><tbody>' + S.materials.map(function (m) { return "<tr><td>" + esc(m.name) + '</td><td class="num">' + m.stock + '</td><td class="num">' + M(m.cost) + '</td><td class="num">' + M(m.stock * m.cost) + "</td></tr>"; }).join("") + '</tbody><tfoot><tr><td colspan="3">Total</td><td class="num">' + M(tot) + '</td></tr></tfoot></table><div class="card-foot"><span class="muted small">Stock ledger ' + M(tot) + " · GL account 1200 " + M(b["1200"]) + (Math.abs(tot - b["1200"]) < 1 ? ' <span class="pill green">Reconciled</span>' : ' <span class="pill amber">Rounding difference</span>') + "</span></div></div>";
    }
    if (tab === "grir") {
      var open = []; S.pos.forEach(function (p) { p.items.forEach(function (i) { if (i.rec !== i.inv) open.push([p, i]); }); });
      html += '<div class="card flush"><table class="t"><thead><tr><th>PO</th><th>Vendor</th><th>Material</th><th class="num">Received</th><th class="num">Invoiced</th><th class="num">Open GR/IR</th></tr></thead><tbody>' + open.map(function (x) { return "<tr><td>" + LL.docLink("po", x[0].id) + "</td><td>" + esc(LL.vend(x[0].vendor).name) + "</td><td>" + esc(LL.mat(x[1].mat).name) + '</td><td class="num">' + x[1].rec + '</td><td class="num">' + x[1].inv + '</td><td class="num">' + M((x[1].rec - x[1].inv) * x[1].price) + "</td></tr>"; }).join("") + '</tbody></table>' + (open.length ? "" : LL.empty("GR/IR is clear: everything received has been invoiced.")) + '<div class="card-foot"><span class="muted small">GR/IR holds the liability for goods received but not yet invoiced. GL account 2100: ' + M(-b["2100"]) + ".</span></div></div>";
    }
    return html;
  };

  /* ================= SECURITY ================= */
  V.security = function (sub) {
    var S = LL.S, tab = sub || "roles", conf = LL.sodConflicts();
    var html = LL.pageHead("Security & audit", "Who can do what, which combinations are dangerous, and a record of everything that happened.", "") +
      LL.tabs([["roles", "Users and roles"], ["sod", "SoD analysis", conf.length], ["audit", "Audit log"], ["denied", "Authorization failures", S.audit.filter(function (a) { return a.type === "denied"; }).length]], tab, "#/security/");
    if (tab === "roles") {
      var roles = Object.keys(LL.ROLES), editable = LL.can("roles.edit");
      html += '<div class="card flush"><div class="matrix-wrap"><table class="t matrix"><thead><tr><th>User</th>' + roles.map(function (r) { return '<th><span class="vert">' + esc(LL.ROLES[r].name) + "</span></th>"; }).join("") + "</tr></thead><tbody>" +
        S.users.map(function (u) { var uc = conf.filter(function (c) { return c.user.id === u.id; }); return "<tr" + (uc.length ? ' class="conflict"' : "") + "><td>" + LL.avatar(u.id) + " <b>" + esc(u.name) + '</b><div class="muted small">' + esc(u.title) + "</div></td>" + roles.map(function (r) { var on = u.roles.indexOf(r) >= 0, bad = uc.some(function (c) { return c.rule[0] === r || c.rule[1] === r; }) && on; return '<td class="cell"><input type="checkbox" class="rolebox' + (bad ? " bad" : "") + '" data-u="' + u.id + '" data-r="' + r + '"' + (on ? " checked" : "") + (editable ? "" : " disabled") + ' aria-label="' + esc(u.name + ": " + LL.ROLES[r].name) + '"></td>'; }).join("") + "</tr>"; }).join("") +
        '</tbody></table></div><div class="card-foot"><span class="muted small">' + (editable ? "You're the Controller, so you can change role assignments. Every change is logged." : "Only the Controller can change role assignments. Switch to Alex Morgan to edit.") + "</span></div></div>";
    }
    if (tab === "sod") {
      html += (conf.length ? conf.map(function (c) { return '<div class="card sod"><div class="sod-ic">' + icon("alert") + "</div><div><h3>" + esc(c.user.name) + ": " + esc(c.rule[2]) + '</h3><p>' + esc(c.rule[3]) + '</p><p class="muted small">Roles: ' + esc(LL.ROLES[c.rule[0]].name) + " + " + esc(LL.ROLES[c.rule[1]].name) + '. Fix: remove one role in Users and roles, or add a compensating control such as a monthly review of vendor changes.</p></div><a class="btn small ghost" href="#/security/roles">Fix it</a></div>'; }).join("") : '<div class="note green big">' + icon("check") + "<span><b>No segregation of duties conflicts.</b> No user holds a forbidden combination of roles.</span></div>") +
        '<h2 class="sec">Rules checked</h2><div class="card flush"><table class="t"><thead><tr><th>Conflict</th><th>Risk</th></tr></thead><tbody>' + LL.SOD.map(function (r) { return "<tr><td><b>" + esc(r[2]) + "</b></td><td>" + esc(r[3]) + "</td></tr>"; }).join("") + "</tbody></table></div>" + (S.superuser ? '<div class="note red big">' + icon("alert") + "<span>The sandbox superuser is switched on. In a real company this would be the biggest SoD risk of all.</span></div>" : "");
    }
    if (tab === "audit" || tab === "denied") {
      var list = S.audit.filter(function (a) { return tab === "audit" || a.type === "denied"; });
      html += '<div class="card flush"><table class="t"><thead><tr><th>Time</th><th>User</th><th>Event</th><th>Detail</th></tr></thead><tbody>' + list.map(function (a) { return '<tr class="ev-' + a.type + '"><td class="mono small nowrap">' + a.t + "</td><td>" + (LL.userObj(a.user) ? LL.avatar(a.user) + " " + esc(LL.userObj(a.user).name) : esc(a.user)) + '</td><td><span class="evt ' + a.type + '">' + esc(a.action) + "</span></td><td>" + esc(a.detail) + "</td></tr>"; }).join("") + "</tbody></table>" + (list.length ? "" : LL.empty("No authorization failures yet. Try an action as the wrong user.")) + "</div>";
    }
    return html;
  };
  document.addEventListener("change", function (e) {
    if (!e.target.classList.contains("rolebox")) return;
    var uid = e.target.dataset.u, roles = Array.prototype.filter.call(document.querySelectorAll('.rolebox[data-u="' + uid + '"]'), function (x) { return x.checked; }).map(function (x) { return x.dataset.r; });
    LL.result(LL.setRoles(uid, roles), "Roles updated");
  });

  /* ================= MISSIONS ================= */
  var openM = null;
  A.openMissions = function () { document.body.classList.add("drawer-open"); LL.renderMissions(); };
  A.closeMissions = function () { document.body.classList.remove("drawer-open"); };
  A.mOpen = function (el) { openM = el.dataset.id; LL.S.missions.active = openM; LL.save(); LL.renderMissions(); };
  A.mBack = function () { openM = null; LL.S.missions.active = null; LL.save(); LL.renderMissions(); };
  A.mGo = function (el) { if (el.dataset.user && el.dataset.user !== LL.S.user) LL.setUser(el.dataset.user); if (el.dataset.route) location.hash = el.dataset.route; LL.render(); };
  var prevDone = {};
  LL.renderMissions = function () {
    var box = $("#drawer"); if (!box) return;
    openM = openM || LL.S.missions.active;
    var html = '<div class="dr-h"><div><span class="eyebrow">Guided missions</span><h2>' + (openM ? "" : "Learn the ERP by doing") + '</h2></div><button class="icon-btn" data-act="closeMissions" aria-label="Close missions">' + icon("x") + "</button></div>";
    LL.MISSIONS.forEach(function (m) {
      var st = LL.missionStatus(m);
      if (st.done && !prevDone[m.id] && prevDone.__init) { celebrate(m); }
      prevDone[m.id] = st.done;
    });
    prevDone.__init = true;
    if (!openM) {
      html += '<p class="dr-intro">Six scenarios that take you through Kestrel Cycles\' order-to-cash and procure-to-pay cycles, its controls and its month-end close. Steps tick off automatically as you work.</p><div class="mlist">' + LL.MISSIONS.map(function (m) { var st = LL.missionStatus(m); return '<button class="mcard ' + (st.done ? "done" : st.failed ? "failed" : st.count ? "going" : "") + '" data-act="mOpen" data-id="' + m.id + '"><span class="mnum">' + (st.done ? icon("check") : m.num) + '</span><span class="mtext"><b>' + esc(m.title) + "</b><small>" + esc(m.lecture) + " · " + esc(m.time) + " · " + st.count + "/" + m.steps.length + ' steps</small></span><span class="mbar"><span style="width:' + (100 * st.count / m.steps.length) + '%"></span></span></button>'; }).join("") + "</div>";
    } else {
      var m = LL.MISSIONS.filter(function (x) { return x.id === openM; })[0], st = LL.missionStatus(m);
      html += '<button class="link-back" data-act="mBack">' + icon("back") + ' All missions</button><div class="mhead"><span class="mnum big">' + m.num + "</span><div><h3>" + esc(m.title) + '</h3><small class="muted">' + esc(m.lecture) + " · about " + esc(m.time) + '</small></div></div><p class="mbrief">' + esc(m.brief) + '</p><ol class="steps">' +
        m.steps.map(function (s, i) { var done = st.steps[i], cur = i === st.current && !st.failed; var u = s.user && LL.userObj(s.user); return '<li class="' + (done ? "done" : cur ? "cur" : "") + '"><span class="sdot">' + (done ? icon("check") : i + 1) + '</span><div><p>' + esc(s.text) + "</p>" + (cur ? '<p class="hint">' + icon("spark") + esc(s.hint) + "</p>" + (u || s.route ? '<button class="btn small primary" data-act="mGo" data-user="' + (s.user || "") + '" data-route="' + (s.route || "") + '">' + (u && u.id !== LL.S.user ? "Sign in as " + esc(u.name.split(" ")[0]) : "Go") + (s.route ? " and open it" : "") + " " + icon("arrow") + "</button>" : "") : "") + "</div></li>"; }).join("") + "</ol>" +
        (st.failed ? '<div class="debrief bad"><h4>' + icon("alert") + " Mission failed</h4><p>You approved the bank change, so the next payment to Velo Components will go to the fraudster's account. Reset the sandbox (Switch user → Reset) to try again, and this time verify the request by calling the number on file.</p></div>" : "") +
        (st.done ? '<div class="debrief"><h4>' + icon("check") + " Mission complete</h4><p>" + esc(m.debrief) + "</p></div>" : "");
    }
    box.innerHTML = html;
  };
  function celebrate(m) {
    LL.toast({ ok: true, msg: "Mission " + m.num + ", " + m.title + ", is complete. Open Missions to read the debrief." }, "Mission complete");
    var c = document.createElement("div"); c.className = "confetti";
    for (var i = 0; i < 36; i++) { var p = document.createElement("i"); p.style.left = Math.random() * 100 + "%"; p.style.animationDelay = Math.random() * 0.4 + "s"; p.style.background = ["#63BFA8", "#F5B841", "#2E8B76", "#9FB4C4", "#E8735A"][i % 5]; c.appendChild(p); }
    document.body.appendChild(c); setTimeout(function () { c.remove(); }, 2600);
  }
  A.welcome = function () {
    LL.modal('<div class="welcome"><div class="wl-art"><div class="logo-mark big">L</div></div><h2>Welcome to Ledgerline</h2><p class="lead">You\'re joining <b>Kestrel Cycles Inc.</b>, a bike distributor in Minneapolis, on Tuesday, November 3, 2026. Everything here runs like a real ERP: one database, automatic postings, approvals and authorization checks.</p>' +
      '<div class="wl-grid"><div>' + icon("user") + "<b>Switch users</b><span>Seven employees, each with different roles. Use the button at the top right.</span></div><div>" + icon("flag") + "<b>Guided missions</b><span>Six scenarios with steps that tick off as you work.</span></div><div>" + icon("book") + "<b>Watch the ledger</b><span>Every document posts its own journal entry. Open any document's Accounting tab.</span></div></div>" +
      '<p class="muted small">Your work is saved in this browser. Kestrel Cycles and all its data are fictional.</p><div class="dialog-foot">' + LL.btn("Explore on my own", "closeModal", "ghost") + LL.btn(icon("flag") + " Start Mission 1", "welcomeGo", "primary") + "</div></div>", "wide");
  };
  A.welcomeGo = function () { LL.closeModal(); openM = "m1"; LL.S.missions.active = "m1"; A.openMissions(); };
})();
