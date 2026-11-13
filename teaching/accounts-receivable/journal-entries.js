/* Year-end journal entry practice for the accounts receivable page.
   Every exercise comes from Redwood River Supply's aged debtor report at
   December 31, 2026 (see the report at the top of the page). The student
   builds each entry from a chart of accounts and the script checks
   accounts, sides and amounts. */
(function () {
  "use strict";

  var CHART = [
    ["Assets", ["Cash", "Accounts Receivable", "Allowance for Doubtful Accounts", "Notes Receivable", "Inventory"]],
    ["Liabilities", ["Accounts Payable"]],
    ["Revenue", ["Sales Revenue", "Interest Revenue"]],
    ["Expenses", ["Bad Debt Expense", "Cost of Goods Sold"]]
  ];

  // d = debit, c = credit. Each line: [side, account, amount].
  var EXERCISES = [
    { id: "aging-adjust", title: "The year-end aging adjustment", video: 4,
      text: "The aged debtor report at December 31, 2026 shows receivables of $240,000. Applying the loss rates (1%, 5%, 12% and 40%) gives a required allowance of $13,000. Before adjusting, the Allowance for Doubtful Accounts has a $2,200 credit balance.",
      ask: "Record the year-end adjusting entry.",
      hint: "The aging gives the balance the allowance must end with. Some of it is already there.",
      lines: [["d", "Bad Debt Expense", 10800], ["c", "Allowance for Doubtful Accounts", 10800]],
      why: "$13,000 required − $2,200 already in the allowance = $10,800. After the entry the allowance holds exactly $13,000, and receivables are reported at $227,000." },

    { id: "debit-balance", title: "A debit balance before adjusting", video: 4,
      text: "Same report: the aging requires an allowance of $13,000. This time, write-offs during the year were larger than expected, and the allowance has a $1,000 debit balance before adjusting.",
      ask: "Record the year-end adjusting entry.",
      hint: "A debit balance in the allowance means it is below zero. You have to fill the hole first.",
      lines: [["d", "Bad Debt Expense", 14000], ["c", "Allowance for Doubtful Accounts", 14000]],
      why: "$13,000 required + $1,000 debit balance = $14,000. The first $1,000 brings the allowance back to zero; the next $13,000 builds it to the required credit balance." },

    { id: "pct-sales", title: "Percentage of sales instead", video: 4,
      text: "Suppose Redwood River estimated bad debts as 0.5% of credit sales instead of aging its receivables. Credit sales for 2026 were $1,800,000. The allowance has a $2,200 credit balance before adjusting.",
      ask: "Record the year-end adjusting entry.",
      hint: "Percentage of sales gives you the expense, not the ending balance.",
      lines: [["d", "Bad Debt Expense", 9000], ["c", "Allowance for Doubtful Accounts", 9000]],
      why: "$1,800,000 × 0.5% = $9,000, and that is the expense. The existing $2,200 is ignored, so the allowance ends at $11,200. Compare the aging method, which gave an expense of $10,800 and an ending balance of $13,000." },

    { id: "rate-change", title: "A revised loss rate", video: 3,
      text: "Back to the original report. Redwood River's credit manager thinks the over-90-day band looks worse than usual this year and raises its loss rate from 40% to 50%. The other rates stay at 1%, 5% and 12%. The over-90 band totals $15,000, and the allowance has a $2,200 credit balance before adjusting.",
      ask: "Record the year-end adjusting entry.",
      hint: "Only one band's estimate changes. Work out the new required allowance first.",
      lines: [["d", "Bad Debt Expense", 12300], ["c", "Allowance for Doubtful Accounts", 12300]],
      why: "Over 90 days: $15,000 × 50% = $7,500 instead of $6,000. The required allowance rises to $14,500, and $14,500 − $2,200 = $12,300." },

    { id: "dwo-yearend", title: "Direct write-off at year end", video: 2,
      text: "Suppose Redwood River used the direct write-off method. On December 31, 2026 it decides that Northern Lights Café's $5,000 balance, all over 90 days old, will never be collected.",
      ask: "Record the write-off.",
      hint: "Under direct write-off there is no allowance. The expense is recorded when an account is given up on.",
      lines: [["d", "Bad Debt Expense", 5000], ["c", "Accounts Receivable", 5000]],
      why: "With no allowance, the only way to record the loss is straight to expense, at the moment a specific account is written off. No other year-end entry is made under this method." },

    { id: "allow-writeoff-ye", title: "Writing off before the adjustment", video: 5,
      text: "Now back to the allowance method. Before making the adjusting entry on December 31, 2026, Redwood River writes off Northern Lights Café's $5,000 balance. The allowance has a $2,200 credit balance at that point.",
      ask: "Record the write-off.",
      hint: "Under the allowance method, a write-off uses up the allowance. Is there any expense?",
      lines: [["d", "Allowance for Doubtful Accounts", 5000], ["c", "Accounts Receivable", 5000]],
      why: "The loss is charged against the allowance, not to expense. The allowance now has a $2,800 debit balance ($2,200 credit − $5,000), which the adjusting entry will have to put right. Try the next exercise." },

    { id: "adjust-after-writeoff", title: "Then the adjustment", video: 4,
      text: "Following on from the last exercise: Northern Lights Café's $5,000 is gone, so the over-90 band now totals $10,000. Re-age the receivables at the usual rates (1%, 5%, 12%, 40%). The allowance has a $2,800 debit balance.",
      ask: "Record the year-end adjusting entry.",
      hint: "Required allowance: $1,500 + $2,500 + $3,000 + (40% of $10,000). Then deal with the debit balance.",
      lines: [["d", "Bad Debt Expense", 13800], ["c", "Allowance for Doubtful Accounts", 13800]],
      why: "Required allowance: $1,500 + $2,500 + $3,000 + $4,000 = $11,000. Add the $2,800 debit balance: $13,800. Total 2026 expense is the same as if the café had stayed on the books, because the write-off itself cost nothing." },

    { id: "dales-writeoff", title: "Dale's Diner goes bankrupt", video: 5,
      text: "February 2027. Dale's Diner, which owed $8,000 on the December report ($3,000 at 61–90 days and $5,000 over 90), files for bankruptcy. Redwood River uses the allowance method.",
      ask: "Record the write-off.",
      hint: "The expense for this loss was estimated at the end of 2026.",
      lines: [["d", "Allowance for Doubtful Accounts", 8000], ["c", "Accounts Receivable", 8000]],
      why: "The account is removed against the allowance. Net receivables and net income are unchanged: the loss was already provided for in 2026." },

    { id: "recovery-1", title: "The trustee pays something", video: 5,
      text: "September 2027. Dale's Diner's bankruptcy trustee tells Redwood River it will pay $1,500 of the $8,000 that was written off.",
      ask: "Record the first of the two entries: reinstate the amount that will be paid.",
      hint: "Reverse the write-off, but only for the amount being recovered.",
      lines: [["d", "Accounts Receivable", 1500], ["c", "Allowance for Doubtful Accounts", 1500]],
      why: "Reinstating the $1,500 puts the receivable back on the customer's record, so the account history shows it was eventually partly paid." },

    { id: "recovery-2", title: "…and the cash arrives", video: 5,
      text: "The trustee's cheque for $1,500 arrives.",
      ask: "Record the collection.",
      hint: "This is an ordinary collection of a receivable.",
      lines: [["d", "Cash", 1500], ["c", "Accounts Receivable", 1500]],
      why: "An ordinary receipt. Taken together, the two entries leave the allowance $1,500 higher, which is why a recovery reduces the next year-end adjustment." },

    { id: "yearend-2027", title: "Year end 2027", video: 4,
      text: "December 31, 2027. The allowance started 2027 with a $13,000 credit balance. During the year: Dale's Diner was written off ($8,000), $1,500 was recovered, and other accounts totalling $3,000 were written off. The new aged debtor report requires an allowance of $12,500.",
      ask: "Record the year-end adjusting entry.",
      hint: "Work out the allowance balance before adjusting: start, less write-offs, plus recoveries.",
      lines: [["d", "Bad Debt Expense", 9000], ["c", "Allowance for Doubtful Accounts", 9000]],
      why: "Before adjusting: $13,000 − $8,000 + $1,500 − $3,000 = $3,500 credit. $12,500 required − $3,500 = $9,000." },

    { id: "over-provided", title: "Too much in the allowance", video: 4,
      text: "Suppose instead that write-offs in 2027 were very light, and the allowance has a $14,000 credit balance before adjusting. The aged debtor report requires only $12,500.",
      ask: "Record the year-end adjusting entry.",
      hint: "The allowance is already above the target. Which way does the entry go?",
      lines: [["d", "Allowance for Doubtful Accounts", 1500], ["c", "Bad Debt Expense", 1500]],
      why: "The allowance must come down by $1,500 to $12,500. Crediting Bad Debt Expense reduces this year's expense: it is a change in an estimate, corrected in the current period." }
  ];


  var root = document.getElementById("je-practice");
  if (!root) return;

  var KEY = "ar-je-done-v1";
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
