/* Journal entry practice for the revenue recognition page (ASC 606).
   Each exercise gives a situation; the student builds the entry from a chart
   of accounts and the script checks accounts, sides and amounts. */
(function () {
  "use strict";

  var CHART = [
    ["Assets", ["Cash", "Accounts Receivable", "Inventory", "Inventory on Consignment", "Estimated Inventory Returns", "Construction in Process"]],
    ["Liabilities", ["Accounts Payable", "Sales Taxes Payable", "Unearned Sales Revenue", "Unearned Service Revenue", "Unearned Warranty Revenue", "Refund Liability", "Warranty Liability"]],
    ["Revenue", ["Sales Revenue", "Service Revenue", "Warranty Revenue", "Commission Revenue", "Revenue from Long-Term Contracts"]],
    ["Expenses", ["Cost of Goods Sold", "Commission Expense", "Warranty Expense", "Construction Expenses"]]
  ];

  // d = debit, c = credit. Each line: [side, account, amount].
  var EXERCISES = [
    { id: "bundle", title: "A bundle with two obligations", video: 1,
      text: "TechCo sells a laptop with two years of support for $3,000 cash. Sold separately, the laptop is $2,700 and the support is $900. The laptop is delivered today.",
      ask: "Record the sale on the day of delivery.",
      hint: "Allocate the $3,000 on relative standalone prices: $2,700 and $900 out of $3,600. Only the laptop has been delivered.",
      lines: [["d", "Cash", 3000], ["c", "Sales Revenue", 2250], ["c", "Unearned Service Revenue", 750]],
      why: "The laptop gets 75% of the price ($2,250) and is earned on delivery. The support gets 25% ($750) and is a contract liability until TechCo provides it." },

    { id: "support-month", title: "Earning the support, month by month", video: 1,
      text: "One month after the sale above, TechCo has provided the first of 24 months of support. $750 was deferred on day one.",
      ask: "Record the revenue earned in the first month.",
      hint: "$750 spread evenly over 24 months. Which account was holding it?",
      lines: [["d", "Unearned Service Revenue", 31.25], ["c", "Service Revenue", 31.25]],
      why: "$750 ÷ 24 = $31.25 a month. The liability falls as the service is performed and revenue is recognised over time." },

    { id: "deposit", title: "Cash before performance", video: 2,
      text: "A furniture maker takes an $800 cash deposit for a custom sofa. The sofa will be built and delivered next month.",
      ask: "Record the receipt of the deposit.",
      hint: "Has control of anything passed to the customer yet?",
      lines: [["d", "Cash", 800], ["c", "Unearned Sales Revenue", 800]],
      why: "Nothing has been transferred, so there is no revenue yet. Cash received before performance is a contract liability. Control, not cash." },

    { id: "sales-tax", title: "Amounts collected for someone else", video: 3,
      text: "A store sells goods for $2,000 cash and collects 6% sales tax on top, which it must pass on to the state.",
      ask: "Record the sale.",
      hint: "The transaction price excludes amounts collected for third parties.",
      lines: [["d", "Cash", 2120], ["c", "Sales Revenue", 2000], ["c", "Sales Taxes Payable", 120]],
      why: "The store receives $2,120, but $120 belongs to the state. Sales tax is a liability, not revenue." },

    { id: "three-way", title: "Allocating one price to three promises", video: 4,
      text: "A $10,000 contract covers equipment, installation and training, paid in cash today. Standalone prices are $9,000, $1,500 and $1,500. The equipment is delivered and installed today. The training takes place next month.",
      ask: "Record today's entry.",
      hint: "Each promise gets its share of $12,000 of standalone prices. Two of the three have been performed. Installation and training are services.",
      lines: [["d", "Cash", 10000], ["c", "Sales Revenue", 7500], ["c", "Service Revenue", 1250], ["c", "Unearned Service Revenue", 1250]],
      why: "Equipment: 9/12 × $10,000 = $7,500. Installation and training: $1,250 each. Equipment and installation are earned today; training is deferred until it is delivered." },

    { id: "agent", title: "Principal or agent?", video: 6,
      text: "A travel website sells a $500 flight to a customer for cash. It keeps $50 and owes the rest to the airline, which provides the flight.",
      ask: "Record the sale in the website's books.",
      hint: "The website never controls the flight. What is its revenue?",
      lines: [["d", "Cash", 500], ["c", "Commission Revenue", 50], ["c", "Accounts Payable", 450]],
      why: "The website is an agent, so it reports only its $50 commission. The other $450 is owed to the airline." },

    { id: "assurance", title: "An assurance-type warranty", video: 6,
      text: "A manufacturer sells machines that come with a standard one-year warranty that they will work as specified. It estimates that warranty repairs on this year's sales will cost $1,200.",
      ask: "Record the estimated warranty cost at year end.",
      hint: "An assurance-type warranty is not a separate performance obligation.",
      lines: [["d", "Warranty Expense", 1200], ["c", "Warranty Liability", 1200]],
      why: "The warranty only promises that the product works, so no revenue is deferred. The expected cost is accrued as an expense and a liability." },

    { id: "service-warranty", title: "A service-type warranty", video: 6,
      text: "A retailer sells a television for $1,000 cash. The customer also buys a two-year extended warranty for $200 cash. The warranty is sold separately and the television is taken home today.",
      ask: "Record the sale.",
      hint: "The extended warranty is a separate performance obligation that has not been performed yet.",
      lines: [["d", "Cash", 1200], ["c", "Sales Revenue", 1000], ["c", "Unearned Warranty Revenue", 200]],
      why: "The television is earned today. The extended cover is a service-type warranty, so its $200 is deferred and recognised over the two years." },

    { id: "returns-sale", title: "A right of return: the sale", video: 6,
      text: "A company sells 1,000 units on account at $100 each. Customers may return them, and the company expects 5% to come back.",
      ask: "Record the sale.",
      hint: "Recognise revenue only for the units you expect to keep sold. What is the rest?",
      lines: [["d", "Accounts Receivable", 100000], ["c", "Sales Revenue", 95000], ["c", "Refund Liability", 5000]],
      why: "Revenue is $95,000, for the 950 units expected to stay sold. The $5,000 expected to be refunded is a refund liability." },

    { id: "returns-cost", title: "A right of return: the cost", video: 6,
      text: "The same 1,000 units cost $60 each. The company still expects 5% to be returned, in a condition to be resold.",
      ask: "Record the cost of the sale.",
      hint: "All 1,000 units have left the warehouse, but 50 of them are expected back.",
      lines: [["d", "Cost of Goods Sold", 57000], ["d", "Estimated Inventory Returns", 3000], ["c", "Inventory", 60000]],
      why: "Inventory falls by the full $60,000. The 50 units expected back ($3,000) are an asset, so cost of goods sold is $57,000." },

    { id: "consign-ship", title: "Consignment: shipping the goods", video: 6,
      text: "A maker ships goods costing $6,000 to a dealer on consignment. The dealer will try to sell them and can send back anything unsold.",
      ask: "Record the shipment in the maker's books.",
      hint: "The maker keeps control until the dealer sells to a customer.",
      lines: [["d", "Inventory on Consignment", 6000], ["c", "Inventory", 6000]],
      why: "No revenue yet: control has not passed. The goods are still the maker's inventory, held at another location." },

    { id: "consign-sale", title: "Consignment: the dealer sells", video: 6,
      text: "The dealer sells all of the consigned goods to customers for $10,000. It keeps a 10% commission and sends the maker $9,000 in cash.",
      ask: "Record the revenue in the maker's books.",
      hint: "The maker is the principal, so its revenue is the full selling price. The commission is a cost of selling.",
      lines: [["d", "Cash", 9000], ["d", "Commission Expense", 1000], ["c", "Sales Revenue", 10000]],
      why: "The maker reports revenue gross at $10,000 and the dealer's $1,000 as an expense. It would also move the $6,000 from Inventory on Consignment to Cost of Goods Sold." },

    { id: "long-term", title: "A long-term contract, year one", video: 5,
      text: "A $5,000,000 construction contract qualifies for revenue over time. Estimated total costs are $4,000,000. Costs incurred in year one are $1,000,000 and have already been recorded in Construction in Process.",
      ask: "Record year one's revenue, costs and gross profit using the cost-to-cost method.",
      hint: "$1,000,000 of $4,000,000 is 25% complete. Revenue is 25% of the price. The gross profit is added to Construction in Process.",
      lines: [["d", "Construction Expenses", 1000000], ["d", "Construction in Process", 250000], ["c", "Revenue from Long-Term Contracts", 1250000]],
      why: "25% × $5,000,000 = $1,250,000 of revenue, less $1,000,000 of cost, gives $250,000 of gross profit. Account names for this entry vary between textbooks; use the ones from your course." }
  ];

  var root = document.getElementById("je-practice");
  if (!root) return;

  var KEY = "rr-je-done-v1";
  var done = {};
  try { done = JSON.parse(window.localStorage.getItem(KEY) || "{}") || {}; } catch (e) { done = {}; }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) { /* storage unavailable */ } }

  var current = 0;
  var state = {};   // per exercise: array of {acct, dr, cr}

  function el(tag, attrs, kids) {
    var n = document.createElement(tag), k;
    for (k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function money(x) {
    var dp = Math.abs(x - Math.round(x)) > 0.004 ? 2 : 0;
    return "$" + x.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }
  function parse(v) {
    var t = String(v || "").replace(/[$,\s]/g, "");
    if (t === "") return 0;
    var n = Number(t);
    return isFinite(n) ? n : NaN;
  }
  function blankRows(n) { var a = []; while (n--) a.push({ acct: "", dr: "", cr: "" }); return a; }

  function entryTable(lines) {
    var t = el("table", { "class": "je-solution" });
    t.appendChild(el("tr", {}, [el("th", { text: "Account" }), el("th", { text: "Debit" }), el("th", { text: "Credit" })]));
    lines.forEach(function (l) {
      t.appendChild(el("tr", {}, [
        el("td", { text: l[1], "class": l[0] === "c" ? "cr" : "" }),
        el("td", { text: l[0] === "d" ? money(l[2]) : "" }),
        el("td", { text: l[0] === "c" ? money(l[2]) : "" })
      ]));
    });
    return t;
  }

  function check(ex, rows) {
    var used = [], i, r, d, c;
    for (i = 0; i < rows.length; i++) {
      r = rows[i]; d = parse(r.dr); c = parse(r.cr);
      if (!r.acct && !d && !c) continue;
      if (isNaN(d) || isNaN(c)) return { ok: false, msg: "Line " + (i + 1) + " has an amount that is not a number." };
      if (!r.acct) return { ok: false, msg: "Line " + (i + 1) + " has an amount but no account." };
      if (d < 0 || c < 0) return { ok: false, msg: "Enter amounts as positive numbers. The column says whether it is a debit or a credit." };
      if (d && c) return { ok: false, msg: "Line " + (i + 1) + " has both a debit and a credit. Use one line for each." };
      if (!d && !c) return { ok: false, msg: "Line " + (i + 1) + " has an account but no amount." };
      used.push([d ? "d" : "c", r.acct, d || c]);
    }
    if (!used.length) return { ok: false, msg: "Choose an account and enter an amount to begin." };
    var td = 0, tc = 0;
    used.forEach(function (u) { if (u[0] === "d") td += u[2]; else tc += u[2]; });
    if (Math.abs(td - tc) > 0.005) return { ok: false, msg: "The entry does not balance: debits are " + money(td) + " and credits are " + money(tc) + "." };

    // Merge duplicate lines on the same account and side before comparing.
    var mine = {}, want = {};
    used.forEach(function (u) { var k = u[0] + "|" + u[1]; mine[k] = (mine[k] || 0) + u[2]; });
    ex.lines.forEach(function (l) { want[l[0] + "|" + l[1]] = l[2]; });
    var k, wrongSide = [], extra = [], missing = 0, wrongAmt = [];
    for (k in mine) {
      if (!(k in want)) {
        var acct = k.split("|")[1], other = (k.charAt(0) === "d" ? "c" : "d") + "|" + acct;
        if (other in want) wrongSide.push(acct); else extra.push(acct);
      } else if (Math.abs(mine[k] - want[k]) > 0.005) wrongAmt.push(k.split("|")[1]);
    }
    for (k in want) if (!(k in mine)) missing++;
    if (wrongSide.length) return { ok: false, msg: wrongSide.join(" and ") + (wrongSide.length > 1 ? " are" : " is") + " on the wrong side." };
    if (extra.length) return { ok: false, msg: "It balances, but " + extra.join(" and ") + (extra.length > 1 ? " do" : " does") + " not belong in this entry." };
    if (missing) return { ok: false, msg: "It balances, but " + (missing > 1 ? missing + " accounts are" : "an account is") + " missing. Read the situation again." };
    if (wrongAmt.length) return { ok: false, msg: "Right accounts. Check the amount for " + wrongAmt.join(" and ") + "." };
    return { ok: true };
  }

  function render() {
    var ex = EXERCISES[current];
    if (!state[ex.id]) state[ex.id] = blankRows(4);
    var rows = state[ex.id];
    root.innerHTML = "";

    // picker
    var nav = el("div", { "class": "je-nav", role: "tablist", "aria-label": "Exercises" });
    EXERCISES.forEach(function (e, i) {
      var b = el("button", { type: "button", "class": "je-chip" + (done[e.id] ? " done" : ""), role: "tab",
        "aria-selected": i === current ? "true" : "false", "aria-label": "Exercise " + (i + 1) + ": " + e.title + (done[e.id] ? " (done)" : ""), text: String(i + 1) });
      b.addEventListener("click", function () { current = i; render(); });
      nav.appendChild(b);
    });
    root.appendChild(nav);
    var nDone = EXERCISES.filter(function (e) { return done[e.id]; }).length;
    root.appendChild(el("p", { "class": "je-progress", text: nDone + " of " + EXERCISES.length + " done" }));

    root.appendChild(el("h3", { "class": "je-title", text: (current + 1) + ". " + ex.title }));
    root.appendChild(el("p", { "class": "je-text", text: ex.text }));
    root.appendChild(el("p", { "class": "je-ask", text: ex.ask }));

    // entry grid
    var table = el("table", { "class": "je-grid" });
    table.appendChild(el("tr", {}, [el("th", { text: "Account" }), el("th", { text: "Debit ($)" }), el("th", { text: "Credit ($)" }), el("th", { "aria-label": "Remove" })]));
    var totals;
    function updateTotals() {
      var td = 0, tc = 0;
      rows.forEach(function (r) { td += parse(r.dr) || 0; tc += parse(r.cr) || 0; });
      totals.children[1].textContent = money(td);
      totals.children[2].textContent = money(tc);
      totals.className = "je-totals" + (td > 0 && Math.abs(td - tc) < 0.005 ? " bal" : "");
    }
    rows.forEach(function (r, i) {
      var sel = el("select", { "aria-label": "Account, line " + (i + 1) });
      sel.appendChild(el("option", { value: "", text: "Choose an account" }));
      CHART.forEach(function (g) {
        var og = el("optgroup", { label: g[0] });
        g[1].forEach(function (a) { og.appendChild(el("option", { value: a, text: a })); });
        sel.appendChild(og);
      });
      sel.value = r.acct;
      sel.addEventListener("change", function () { r.acct = sel.value; });
      var dr = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Debit, line " + (i + 1), value: r.dr });
      var cr = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Credit, line " + (i + 1), value: r.cr });
      dr.addEventListener("input", function () { r.dr = dr.value; updateTotals(); });
      cr.addEventListener("input", function () { r.cr = cr.value; updateTotals(); });
      var rm = el("button", { type: "button", "class": "je-rm", "aria-label": "Remove line " + (i + 1), text: "×" });
      rm.addEventListener("click", function () { rows.splice(i, 1); if (!rows.length) rows.push({ acct: "", dr: "", cr: "" }); render(); });
      table.appendChild(el("tr", {}, [el("td", {}, [sel]), el("td", {}, [dr]), el("td", {}, [cr]), el("td", {}, [rm])]));
    });
    totals = el("tr", { "class": "je-totals" }, [el("td", { text: "Totals" }), el("td"), el("td"), el("td")]);
    table.appendChild(totals);
    root.appendChild(table);
    updateTotals();

    var fb = el("div", { "class": "je-feedback", role: "status", "aria-live": "polite" });
    function show(kind, msg, withAnswer) {
      fb.className = "je-feedback " + kind;
      fb.innerHTML = "";
      fb.appendChild(el("p", { "class": "je-msg", text: msg }));
      if (withAnswer) {
        fb.appendChild(entryTable(ex.lines));
        fb.appendChild(el("p", { "class": "je-why", text: ex.why }));
        fb.appendChild(el("p", { "class": "je-video", html: 'Covered in <a href="#video-' + ex.video + '">video ' + ex.video + "</a>." }));
      }
    }

    var bar = el("div", { "class": "je-actions" });
    function btn(label, cls, fn) { var b = el("button", { type: "button", "class": cls, text: label }); b.addEventListener("click", fn); bar.appendChild(b); return b; }
    btn("Check entry", "je-btn", function () {
      var res = check(ex, rows);
      if (res.ok) { done[ex.id] = true; save(); show("ok", "Correct.", true); markDone(); }
      else show("no", res.msg, false);
    });
    btn("Hint", "je-btn ghost", function () { show("hint", ex.hint, false); });
    btn("Show answer", "je-btn ghost", function () { show("hint", "Here is the entry.", true); });
    btn("Clear", "je-btn ghost", function () { state[ex.id] = blankRows(4); render(); });
    btn("Add a line", "je-btn ghost", function () { rows.push({ acct: "", dr: "", cr: "" }); render(); });
    root.appendChild(bar);
    root.appendChild(fb);

    function markDone() {
      nav.children[current].className = "je-chip done";
      var n = EXERCISES.filter(function (e) { return done[e.id]; }).length;
      root.querySelector(".je-progress").textContent = n + " of " + EXERCISES.length + " done";
    }

    var foot = el("div", { "class": "je-foot" });
    var prev = el("button", { type: "button", "class": "je-btn ghost", text: "Previous" });
    var next = el("button", { type: "button", "class": "je-btn ghost", text: "Next" });
    if (current === 0) prev.setAttribute("disabled", "");
    if (current === EXERCISES.length - 1) next.setAttribute("disabled", "");
    prev.addEventListener("click", function () { current--; render(); });
    next.addEventListener("click", function () { current++; render(); });
    foot.appendChild(prev); foot.appendChild(next);
    var reset = el("button", { type: "button", "class": "je-link", text: "Reset my progress" });
    reset.addEventListener("click", function () { done = {}; state = {}; save(); current = 0; render(); });
    foot.appendChild(reset);
    root.appendChild(foot);
  }

  window.__jeExercises = EXERCISES;   // used by the page's self-test only
  render();
})();
