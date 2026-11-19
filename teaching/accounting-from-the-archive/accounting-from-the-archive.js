/* Accounting from the Archive — interactive teaching resource
   andrewprimmer.com/teaching/  ·  no dependencies
   Lesson two (debits and credits) incorporates the original debits-and-credits.js */
(function () {
  "use strict";

  /* ------------------------------------------------------- helpers ---- */

  function $(id) { return document.getElementById(id); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function money(n) { return Math.round(n).toLocaleString("en-GB"); }
  function gbp(n) { return (n < 0 ? "−" : "") + "£" + money(Math.abs(n)); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("afa-" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("afa-" + k, JSON.stringify(v)); } catch (e) {} }
  };
  /* segmented button groups: data-<key> attribute, calls fn(value) */
  function segment(key, fn) {
    var btns = $$("[data-" + key + "]");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        fn(b.getAttribute("data-" + key));
      });
    });
  }

  /* ------------------------------------------------ course structure ---- */

  var LESSONS = [
    { id: "equation",            t: "The accounting equation" },
    { id: "debits-and-credits",  t: "Debits and credits" },
    { id: "accruals",            t: "Profit and accruals" },
    { id: "capital-and-revenue", t: "Capital, revenue and depreciation" },
    { id: "ratios",              t: "Reading the accounts: ratios" },
    { id: "disclosure",          t: "Disclosure" },
    { id: "tax",                 t: "Tax across borders" }
  ];
  var done = store.get("done", {});

  function lessonIndex(id) {
    for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === id) return i;
    return -1;
  }

  function renderDone() {
    var n = 0;
    $$(".lesson-index a").forEach(function (a) {
      var id = a.getAttribute("data-lesson");
      var mark = a.querySelector(".li-done");
      if (done[id]) { n++; mark.textContent = "Completed ✓"; } else mark.textContent = "";
    });
    var p = $("courseProgress");
    if (p) p.textContent = n ? n + " of " + LESSONS.length + " lessons completed." : "";
  }

  function buildPagers() {
    $$(".pager").forEach(function (nav) {
      var i = lessonIndex(nav.getAttribute("data-for"));
      var prev = i > 0 ? LESSONS[i - 1] : null, next = i < LESSONS.length - 1 ? LESSONS[i + 1] : null;
      var a1 = el("a", null, prev ? "Previous: " + prev.t : "All lessons");
      a1.href = prev ? "#" + prev.id : "#contents";
      var a2 = el("a", null, "All lessons"); a2.href = "#contents";
      nav.appendChild(a1);
      if (prev) nav.appendChild(a2);
      if (next) { var a3 = el("a", null, "Next: " + next.t); a3.href = "#" + next.id; nav.appendChild(a3); }
    });
  }

  function route() {
    var id = location.hash.slice(1), i = lessonIndex(id);
    $$(".lesson").forEach(function (s) { s.classList.toggle("is-open", s.id === id); });
    $("contents").classList.toggle("is-hidden", i >= 0);
    var target = i >= 0 ? $(id) : null;
    if (target) target.scrollIntoView();
    else if (id === "contents") window.scrollTo(0, 0);
  }

  /* --------------------------------------------------- quiz engine ---- */

  function buildQuiz(wrapId, items, lessonId) {
    var wrap = $(wrapId);
    if (!wrap) return;
    var answered = 0, correct = 0;
    items.forEach(function (item, qi) {
      var box = el("div", "q");
      box.appendChild(el("p", null, (lessonId ? (qi + 1) + ". " : "") + item.q));
      var opts = el("div", "opts"), buttons = [];
      item.o.forEach(function (text, oi) {
        var b = el("button", "opt", text);
        b.type = "button";
        b.addEventListener("click", function () {
          if (box.classList.contains("answered")) return;
          box.classList.add("answered");
          buttons.forEach(function (x) { x.disabled = true; });
          buttons[item.a].classList.add("right");
          if (oi !== item.a) b.classList.add("wrong"); else correct++;
          answered++;
          if (lessonId && answered === items.length) {
            score.hidden = false;
            score.innerHTML = "You answered <span>" + correct + " of " + items.length + "</span> correctly.";
            done[lessonId] = true; store.set("done", done); renderDone();
          }
        });
        buttons.push(b); opts.appendChild(b);
      });
      box.appendChild(opts);
      box.appendChild(el("p", "expl", item.e));
      wrap.appendChild(box);
    });
    var score = el("p", "score"); score.hidden = true;
    if (lessonId) wrap.appendChild(score);
  }

  /* ================================================================ */
  /* LESSON ONE — the accounting equation (Beira Railway)              */
  /* ================================================================ */

  var BS_ACC = {
    line: "Railway line and rolling stock", stores: "Stores (coal)", cash: "Cash at bank",
    pay: "Trade payables", deb: "5% debentures", capital: "Share capital", retain: "Retained profit"
  };
  var BS_TX = [
    { d: "Issue 400,000 ordinary shares of £1 each for cash.", m: { cash: 400000, capital: 400000 } },
    { d: "Issue £600,000 of 5% debentures to London investors for cash.", m: { cash: 600000, deb: 600000 } },
    { d: "Build the line and buy rolling stock for £900,000, paid in cash. One asset is exchanged for another.", m: { line: 900000, cash: -900000 } },
    { d: "Buy coal for £20,000 on credit from a supplier.", m: { stores: 20000, pay: 20000 } },
    { d: "Collect £150,000 of traffic receipts in cash. Revenue increases profit, so equity rises.", m: { cash: 150000, retain: 150000 } },
    { d: "Pay £110,000 of working expenses: wages, maintenance, and so on. Expenses reduce profit and so reduce equity.", m: { cash: -110000, retain: -110000 } },
    { d: "Pay a year's debenture interest: 5% × £600,000 = £30,000.", m: { cash: -30000, retain: -30000 } },
    { d: "Pay the coal supplier £20,000. An asset and a liability fall together.", m: { cash: -20000, pay: -20000 } }
  ];
  var bsI = 0, bs = {};

  function bsReset() {
    bsI = 0;
    Object.keys(BS_ACC).forEach(function (k) { bs[k] = 0; });
    $("bsLog").innerHTML = '<span style="color:var(--soft);font-style:italic">No transactions recorded yet.</span>';
    $("bsDone").hidden = true;
    $("bsNext").disabled = false;
    bsRender([]);
  }

  function bsRender(changed) {
    function row(k) {
      return '<tr' + (changed.indexOf(k) > -1 ? ' class="flash"' : '') + '><td>' + BS_ACC[k] + '</td><td>' + gbp(bs[k]) + '</td></tr>';
    }
    var A = bs.line + bs.stores + bs.cash, L = bs.pay + bs.deb, E = bs.capital + bs.retain;
    $("bsA").innerHTML = ["line", "stores", "cash"].map(row).join("") +
      '<tr class="total"><td>Total assets</td><td>' + gbp(A) + '</td></tr>';
    $("bsLE").innerHTML = ["pay", "deb"].map(row).join("") +
      '<tr class="sub"><td>Liabilities</td><td>' + gbp(L) + '</td></tr>' +
      ["capital", "retain"].map(row).join("") +
      '<tr class="sub"><td>Equity</td><td>' + gbp(E) + '</td></tr>' +
      '<tr class="total"><td>Total</td><td>' + gbp(L + E) + '</td></tr>';
    $("bsEq").innerHTML = gbp(A) + " <span>=</span> " + gbp(L) + " <span>+</span> " + gbp(E) +
      (bsI ? " &nbsp;✓" : "");
  }

  function bsNext() {
    if (bsI >= BS_TX.length) return;
    var t = BS_TX[bsI++];
    Object.keys(t.m).forEach(function (k) { bs[k] += t.m[k]; });
    var moves = Object.keys(t.m).map(function (k) {
      return BS_ACC[k] + " " + (t.m[k] > 0 ? "+" : "−") + gbp(Math.abs(t.m[k]));
    }).join(";  ");
    $("bsLog").innerHTML = "<b>" + bsI + " of " + BS_TX.length + ".</b> " + t.d + '<span class="moves">' + moves + "</span>";
    bsRender(Object.keys(t.m));
    if (bsI === BS_TX.length) {
      $("bsNext").disabled = true;
      var s = $("bsDone"); s.hidden = false; s.className = "tb-state ok";
      s.textContent = "Year complete. The company made a profit of £10,000 after paying £30,000 of debenture interest. It owes lenders £600,000 against £410,000 of equity. If you were offered new shares in this company, what would you want to know first?";
    }
  }

  var QUIZ_EQUATION = [
    { q: "A company buys a delivery van for £20,000 in cash. What happens to total assets?",
      o: ["They rise by £20,000", "They fall by £20,000", "They are unchanged"], a: 2,
      e: "One asset (the van) rises and another (cash) falls by the same amount." },
    { q: "A company has assets of £900,000 and liabilities of £650,000. What is its equity?",
      o: ["£1,550,000", "£250,000", "£650,000"], a: 1,
      e: "Equity = assets − liabilities = £900,000 − £650,000." },
    { q: "Which of these is a liability?",
      o: ["Debentures issued to investors", "Share capital", "Stocks of coal"], a: 0,
      e: "Debentures are borrowings that must be repaid with interest. Share capital is equity; coal is an asset." }
  ];

  /* ================================================================ */
  /* LESSON TWO — debits and credits (Barranquilla Railway and Pier)    */
  /* ================================================================ */

  var CATEGORIES = [
    { name: "Assets", inc: "Debit", dec: "Credit", norm: "Debit",
      note: "An asset is a resource the company controls. Acquiring one is a use of value, so it is recorded on the debit side. Cash at bank, receivables, and rolling stock all behave this way: they rise with debits and fall with credits." },
    { name: "Expenses", inc: "Debit", dec: "Credit", norm: "Debit",
      note: "An expense is value consumed in earning revenue. Like an asset it is a use of resources, so it increases by debit. The difference is timing: an asset still has future benefit, an expense has already been used up." },
    { name: "Liabilities", inc: "Credit", dec: "Debit", norm: "Credit",
      note: "A liability is a claim an outsider has on the company. It is a source of the resources the company holds, so it increases by credit. Paying a supplier reduces the claim, which is why settlement is a debit." },
    { name: "Equity", inc: "Credit", dec: "Debit", norm: "Credit",
      note: "Equity is the owners' claim: capital they put in, plus profits left in the business. It is a source of funding, so it increases by credit. Reserves sit here too, which is why a transfer to a reserve never changes total equity." },
    { name: "Income", inc: "Credit", dec: "Debit", norm: "Credit",
      note: "Income increases the owners' claim, so it follows equity and increases by credit. Earning freight revenue credits income and debits whatever the company received in exchange, whether cash or a receivable." }
  ];

  var ACCOUNTS = {
    cash:    { label: "Cash at bank",             type: "Asset" },
    recv:    { label: "Trade receivables",        type: "Asset" },
    coal:    { label: "Coal inventory",           type: "Asset" },
    plant:   { label: "Plant and rolling stock",  type: "Asset" },
    accdep:  { label: "Accumulated depreciation", type: "Contra-asset" },
    pay:     { label: "Trade payables",           type: "Liability" },
    deb:     { label: "Debentures",               type: "Liability" },
    capital: { label: "Share capital",            type: "Equity" },
    reserve: { label: "Renewals reserve",         type: "Equity" },
    retain:  { label: "Retained earnings",        type: "Equity" },
    freight: { label: "Freight revenue",          type: "Income" },
    wages:   { label: "Wages expense",            type: "Expense" },
    depn:    { label: "Depreciation expense",     type: "Expense" },
    interest:{ label: "Debenture interest",       type: "Expense" }
  };

  var TRANSACTIONS = [
    { date: "2 January",   amt: 50000,
      narr: "Shareholders subscribe for ordinary shares and pay the full amount into the company's bank account.",
      dr: "cash", cr: "capital",
      why: "The company received cash, so cash is debited. The funds came from the owners, so share capital is credited. Nothing has been earned yet: this is a source of finance, not income." },
    { date: "14 January",  amt: 20000,
      narr: "The company issues debentures at par, the proceeds being received in cash.",
      dr: "cash", cr: "deb",
      why: "Cash rises again, so it is debited. This time the source is a lender rather than an owner, so the credit goes to debentures, a liability. Compare this with the share issue: identical debit, different credit." },
    { date: "3 February",  amt: 18000,
      narr: "Two locomotives and a quantity of rolling stock are purchased outright for cash.",
      dr: "plant", cr: "cash",
      why: "One asset has been exchanged for another. Plant and rolling stock is debited because it has increased; cash is credited because it has fallen. Total assets are unchanged." },
    { date: "27 February", amt: 2400,
      narr: "Coal for the locomotives is bought on thirty days' credit from a merchant house.",
      dr: "coal", cr: "pay",
      why: "The company has the coal, so the inventory asset is debited. It has not paid, so it now owes the merchant: trade payables, a liability, is credited." },
    { date: "31 March",    amt: 6500,
      narr: "Freight charges for the quarter are collected in cash at the pier.",
      dr: "cash", cr: "freight",
      why: "Cash received is a debit. The company has earned this, so the credit goes to freight revenue. Income increases by credit because it increases the owners' claim." },
    { date: "30 April",    amt: 1900,
      narr: "Wages are paid to platelayers and engine crew.",
      dr: "wages", cr: "cash",
      why: "The wages expense is debited: value has been consumed in earning revenue. Cash has left the company, so it is credited." },
    { date: "15 May",      amt: 1000,
      narr: "A payment on account is made to the coal merchant.",
      dr: "pay", cr: "cash",
      why: "The debt has been reduced, and liabilities fall by debit, so trade payables is debited. Cash is credited. Note that no expense arises here: the expense was recorded when the coal was received." },
    { date: "30 June",     amt: 3200,
      narr: "Freight is carried for a coffee exporter, invoiced on account and not yet settled.",
      dr: "recv", cr: "freight",
      why: "Revenue is recognised when earned rather than when paid, so freight revenue is credited. Because no cash has arrived, the debit goes to trade receivables: a promise of cash rather than cash itself. Lesson three returns to this." },
    { date: "31 December", amt: 900,
      narr: "Depreciation is charged on the rolling stock for the year.",
      dr: "depn", cr: "accdep",
      why: "Depreciation expense is debited, reducing profit. The credit goes to accumulated depreciation rather than to the asset directly, so the ledger preserves both the original cost and the wear charged against it. Lesson four returns to this." },
    { date: "31 December", amt: 1500,
      narr: "The directors resolve to transfer part of the year's profit to a renewals reserve.",
      dr: "retain", cr: "reserve",
      why: "Retained earnings falls, and equity falls by debit. The renewals reserve rises, and equity rises by credit. Total equity is unchanged and no asset has moved, yet the profit is now labelled as unavailable for dividend. This entry is the subject of the last part of this lesson." }
  ];

  var ERRORS = [
    { t: "Error of omission",
      s: "The transaction was never recorded at all.",
      r: "Both halves are missing, so the debit and credit totals fall by the same amount and still agree. A sale on credit that is simply never entered leaves the books balanced and the revenue understated." },
    { t: "Error of commission",
      s: "The right amount, on the right side, in the wrong account of the right type.",
      r: "Posting a payment to the wrong supplier's account debits a liability either way. The trial balance is unaffected, but each individual supplier balance is now wrong." },
    { t: "Error of principle",
      s: "The right amount, on the right side, in an account of entirely the wrong type.",
      r: "Charging a new locomotive to repairs expense rather than to plant is a debit in both cases. Totals agree, but profit is understated and the balance sheet omits a substantial asset. This is the error most likely to be deliberate." },
    { t: "Error of original entry",
      s: "The wrong figure, entered consistently on both sides.",
      r: "If £540 is read as £450 and both the debit and the credit use £450, the entry is internally consistent and the totals agree. Only the source document reveals it." },
    { t: "Reversal of entries",
      s: "The two halves are correct but the wrong way round.",
      r: "Crediting cash and debiting the supplier when the company has received money reverses the effect, but a debit and a credit of equal size have still been made. The error is twice the transaction and invisible to the totals." },
    { t: "Compensating errors",
      s: "Two unrelated mistakes that happen to cancel.",
      r: "An overcast of £100 in the sales ledger and an equal overcast in the purchases ledger offset one another exactly. The rarest of the six, and the reason a balanced trial balance is evidence rather than proof." }
  ];

  var QUIZ_DEBITS = [
    { q: "The company pays £1,000 to a supplier it already owed. Which entry is correct?",
      o: ["Debit trade payables, credit cash", "Debit cash, credit trade payables",
          "Debit an expense, credit cash", "Debit trade payables, credit an expense"], a: 0,
      e: "The obligation is reduced, and liabilities fall by debit. Cash leaves, so cash is credited. No expense arises: that was recorded when the goods were received." },
    { q: "Why do expenses increase on the debit side?",
      o: ["Because expenses reduce profit and profit is a credit balance",
          "Because they are a use of resources, in the same way an asset is",
          "Because they are always paid in cash",
          "Because the equation would otherwise fail"], a: 1,
      e: "Debits record uses of value and credits record sources of it. An expense is value consumed; an asset is value still held. Both are uses, so both increase by debit." },
    { q: "A transfer from retained earnings to a renewals reserve has what effect on total equity?",
      o: ["It increases total equity", "It decreases total equity",
          "It leaves total equity unchanged", "It depends on the size of the transfer"], a: 2,
      e: "Both accounts sit within equity, so the debit and the credit cancel. What changes is the label: profit carried to a named reserve is ordinarily no longer distributable." },
    { q: "Freight is carried on account and invoiced but not yet paid. What is debited?",
      o: ["Cash at bank", "Freight revenue", "Trade receivables", "Trade payables"], a: 2,
      e: "Revenue is recognised when earned, so freight revenue is credited. Because no cash has arrived, the debit is to trade receivables, which is a claim on cash rather than cash itself." },
    { q: "A new locomotive is charged to repairs expense. What kind of error is this?",
      o: ["Error of omission", "Error of principle", "Error of original entry", "Compensating error"], a: 1,
      e: "The amount and the side are both right, but the account is of entirely the wrong type: an expense instead of an asset. The trial balance agrees while profit and total assets are both understated." },
    { q: "Depreciation is credited to accumulated depreciation rather than to the asset itself. Why?",
      o: ["Because the asset account cannot be credited",
          "So the ledger preserves both original cost and the wear charged to date",
          "Because depreciation is a liability",
          "To keep the trial balance in agreement"], a: 1,
      e: "Using a separate contra-asset account keeps the historical cost visible alongside the cumulative charge. Crediting the asset directly would balance perfectly well, but would destroy that information." },
    { q: "Which of these will a balanced trial balance reliably detect?",
      o: ["A transaction omitted entirely", "A payment posted to the wrong supplier",
          "A one-sided entry", "Two errors of equal size on opposite sides"], a: 2,
      e: "A one-sided entry breaks the equality of debits and credits, so the totals disagree. The other three all preserve equality, which is why agreement is a weak form of assurance." },
    { q: "Shares are issued for cash, and separately debentures are issued for cash. What differs?",
      o: ["The debit differs; the credit is the same",
          "The credit differs; the debit is the same",
          "Both entries are identical",
          "Neither transaction is recorded until settlement"], a: 1,
      e: "Cash is debited in both cases. The credit distinguishes them: share capital is a claim by owners, debentures a claim by lenders. The company received the same asset from two different sources." }
  ];

  function buildMatrix() {
    var body = $("matrixBody"), note = $("matrixNote");
    if (!body) return;
    CATEGORIES.forEach(function (c) {
      var tr = el("tr");
      tr.setAttribute("tabindex", "0");
      tr.setAttribute("role", "button");
      tr.appendChild(el("td", null, c.name));
      var i = el("td"); i.innerHTML = '<span class="' + (c.inc === "Debit" ? "dr" : "cr") + '">' + c.inc + "</span>";
      var d = el("td"); d.innerHTML = '<span class="' + (c.dec === "Debit" ? "dr" : "cr") + '">' + c.dec + "</span>";
      tr.appendChild(i); tr.appendChild(d);
      tr.appendChild(el("td", null, c.norm));
      function pick() {
        Array.prototype.forEach.call(body.children, function (r) { r.setAttribute("aria-selected", "false"); });
        tr.setAttribute("aria-selected", "true");
        note.textContent = c.note;
      }
      tr.addEventListener("click", pick);
      tr.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
      });
      body.appendChild(tr);
    });
  }

  var ledger = {};   // code -> { dr: [], cr: [] }
  var step = 0;

  function ensure(code) {
    if (!ledger[code]) ledger[code] = { dr: [], cr: [] };
    return ledger[code];
  }
  function balanceOf(code) {
    var a = ledger[code];
    var d = a.dr.reduce(function (s, e) { return s + e.amt; }, 0);
    var c = a.cr.reduce(function (s, e) { return s + e.amt; }, 0);
    return { dr: d, cr: c, net: d - c };
  }

  function renderProgress() {
    var p = $("progress");
    p.innerHTML = "";
    TRANSACTIONS.forEach(function (_, i) {
      var b = el("i");
      if (i < step) b.className = "done";
      else if (i === step) b.className = "now";
      p.appendChild(b);
    });
  }

  function renderTxn() {
    var box = $("txnBox");
    box.innerHTML = "";
    renderProgress();

    if (step >= TRANSACTIONS.length) {
      box.appendChild(el("p", "narr", "All ten transactions posted. The trial balance below should agree."));
      var again = el("button", "btn ghost", "Start again");
      again.type = "button";
      again.addEventListener("click", function () {
        ledger = {}; step = 0; renderTxn(); renderLedger(); renderTB();
      });
      var acts0 = el("div", "actions"); acts0.appendChild(again);
      box.appendChild(acts0);
      return;
    }

    var t = TRANSACTIONS[step];
    box.appendChild(el("p", "date", t.date + " 1888  ·  transaction " + (step + 1) + " of " + TRANSACTIONS.length));
    box.appendChild(el("p", "narr", t.narr));
    box.appendChild(el("p", "amt", "Amount: £" + money(t.amt)));

    var picks = el("div", "picks");
    var codes = Object.keys(ACCOUNTS);
    function selectBox(which, labelText) {
      var w = el("div", "pick");
      var lab = el("label", null, labelText);
      lab.setAttribute("for", which + "Sel");
      var s = el("select"); s.id = which + "Sel";
      s.appendChild(new Option("Choose an account…", ""));
      codes.forEach(function (c) {
        s.appendChild(new Option(ACCOUNTS[c].label + "  (" + ACCOUNTS[c].type + ")", c));
      });
      w.appendChild(lab); w.appendChild(s);
      return w;
    }
    picks.appendChild(selectBox("dr", "Account to debit"));
    picks.appendChild(selectBox("cr", "Account to credit"));
    box.appendChild(picks);

    var acts = el("div", "actions");
    var post = el("button", "btn", "Post entry"); post.type = "button";
    var hint = el("button", "btn ghost", "Show me"); hint.type = "button";
    acts.appendChild(post); acts.appendChild(hint);
    box.appendChild(acts);

    var verdict = el("p", "verdict");
    verdict.setAttribute("role", "status");
    box.appendChild(verdict);

    function advance() {
      ensure(t.dr).dr.push({ amt: t.amt, ref: step + 1 });
      ensure(t.cr).cr.push({ amt: t.amt, ref: step + 1 });
      step++;
      renderLedger(); renderTB();
      setTimeout(renderTxn, 1400);
    }
    function reveal(prefix) {
      verdict.className = "verdict ok";
      verdict.innerHTML = prefix + "Debit " + ACCOUNTS[t.dr].label + ", credit " + ACCOUNTS[t.cr].label +
        ".<span class='why'>" + t.why + "</span>";
      post.disabled = true; hint.disabled = true;
      advance();
    }

    post.addEventListener("click", function () {
      var d = $("drSel").value, c = $("crSel").value;
      if (!d || !c) {
        verdict.className = "verdict no";
        verdict.textContent = "Choose both an account to debit and an account to credit.";
      } else if (d === c) {
        verdict.className = "verdict no";
        verdict.textContent = "The same account cannot be both debited and credited by one entry.";
      } else if (d === t.dr && c === t.cr) {
        reveal("Correct. ");
      } else if (d === t.cr && c === t.dr) {
        verdict.className = "verdict no";
        verdict.textContent = "The two accounts are right but the sides are reversed. Ask what the company received: that is the debit.";
      } else {
        verdict.className = "verdict no";
        verdict.textContent = "Not quite. Identify the two things this transaction changed, then decide which is the use of value and which is the source.";
      }
    });
    hint.addEventListener("click", function () { reveal(""); });
  }

  function renderLedger() {
    var g = $("tGrid");
    g.innerHTML = "";
    var codes = Object.keys(ledger);
    if (!codes.length) {
      var p = el("p", null, "No entries posted yet.");
      p.style.cssText = "color:var(--soft);font-style:italic;grid-column:1/-1;margin:0";
      g.appendChild(p);
      return;
    }
    codes.forEach(function (code) {
      var a = ledger[code], b = balanceOf(code);
      var box = el("div", "t-acct");
      var h = el("h4"); h.textContent = ACCOUNTS[code].label;
      h.appendChild(el("small", null, ACCOUNTS[code].type));
      box.appendChild(h);
      var cols = el("div", "t-cols");
      function side(entries, label) {
        var s = el("div", "t-side");
        s.appendChild(el("div", "hd", label));
        var ul = el("ul");
        entries.forEach(function (e) { ul.appendChild(el("li", null, "(" + e.ref + ")  " + money(e.amt))); });
        if (!entries.length) ul.appendChild(el("li", null, "—"));
        s.appendChild(ul);
        return s;
      }
      cols.appendChild(side(a.dr, "Debit"));
      cols.appendChild(el("div", "spine"));
      cols.appendChild(side(a.cr, "Credit"));
      box.appendChild(cols);
      var bal = el("div", "t-bal");
      bal.appendChild(el("span", null, "Balance"));
      bal.appendChild(el("b", null, b.net >= 0 ? money(b.net) + " Dr" : money(-b.net) + " Cr"));
      box.appendChild(bal);
      g.appendChild(box);
    });
  }

  function renderTB() {
    var body = $("tbBody"), state = $("tbState");
    body.innerHTML = "";
    var codes = Object.keys(ledger);
    if (!codes.length) {
      state.className = "tb-state";
      state.textContent = "Nothing posted yet.";
      $("tbDr").textContent = "—"; $("tbCr").textContent = "—";
      return;
    }
    var totDr = 0, totCr = 0;
    codes.forEach(function (code) {
      var b = balanceOf(code);
      if (b.net === 0) return;
      var tr = el("tr");
      tr.appendChild(el("td", null, ACCOUNTS[code].label));
      var d = el("td"), c = el("td");
      if (b.net > 0) { d.textContent = money(b.net); c.textContent = "—"; totDr += b.net; }
      else { c.textContent = money(-b.net); d.textContent = "—"; totCr += -b.net; }
      tr.appendChild(d); tr.appendChild(c);
      body.appendChild(tr);
    });
    $("tbDr").textContent = money(totDr);
    $("tbCr").textContent = money(totCr);
    if (totDr === totCr) {
      state.className = "tb-state ok";
      state.textContent = "The trial balance agrees at £" + money(totDr) + ". Remember what that does and does not prove.";
    } else {
      state.className = "tb-state";
      state.textContent = "Debits and credits differ by £" + money(Math.abs(totDr - totCr)) + ".";
    }
  }

  function buildErrors() {
    var wrap = $("errs");
    ERRORS.forEach(function (e) {
      var b = el("button", "err");
      b.type = "button";
      b.setAttribute("aria-expanded", "false");
      b.appendChild(el("b", null, e.t));
      b.appendChild(el("span", null, e.s));
      b.appendChild(el("span", "rev", e.r));
      b.addEventListener("click", function () {
        b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") === "true" ? "false" : "true");
      });
      wrap.appendChild(b);
    });
  }

  /* ================================================================ */
  /* LESSON THREE — accruals and revenue recognition                   */
  /* ================================================================ */

  var TIMING = [
    { q: "A shipping line carries a cargo to Southampton in December, Year 1. The customer pays in February, Year 2.",
      o: ["Year 1", "Year 2"], a: 0,
      e: "The service was performed in Year 1, so the revenue was earned then. At the year end the company records a trade receivable, exactly as the Barranquilla company did in lesson two." },
    { q: "A customer pays in December, Year 1, for twelve months of freight services to be provided during Year 2.",
      o: ["Year 1", "Year 2"], a: 1,
      e: "Cash arrived in Year 1 but nothing has been earned yet. The company records a liability, deferred income, and recognises revenue in Year 2 as it provides the service." },
    { q: "Staff earn £4,000 of wages in the last week of December, Year 1. They are paid on 5 January, Year 2.",
      o: ["Year 1", "Year 2"], a: 0,
      e: "The expense was incurred in Year 1 when the work was done. The company records an accrual: a liability for wages owed." },
    { q: "A claims firm signs up a client in Year 1. The claim might settle in Year 2 or Year 3, for an amount nobody yet knows, or might fail entirely.",
      o: ["Year 1, at the expected settlement value", "Later, once the outcome is highly probable"], a: 1,
      e: "Revenue can only be recognised to the extent it is highly probable it will not later be reversed. Booking an uncertain outcome up front is precisely the kind of judgement that went wrong at Quindell." }
  ];

  var QUIZ_ACCRUALS = [
    { q: "A consultant finishes a job in March but invoices and is paid in May. When is the revenue recognised?",
      o: ["March", "May"], a: 0,
      e: "Revenue is recognised when the work is performed and the promise to the customer is satisfied." },
    { q: "Under the accruals basis, profit equals…",
      o: ["Cash received minus cash paid", "Revenue earned minus expenses incurred in the period"], a: 1,
      e: "Accruals accounting separates profit from cash flow; the statement of cash flows reports cash separately." },
    { q: "Why is revenue recognition a matter of judgement?",
      o: ["Because tax rules require it",
          "Because deciding when something has truly been earned, and how certain it is, often requires estimates"], a: 1,
      e: "Where outcomes are uncertain, management must judge whether revenue is highly probable not to reverse. That is where Quindell went wrong." }
  ];

  /* ================================================================ */
  /* LESSON FOUR — capital, revenue and depreciation                   */
  /* ================================================================ */

  var SORT_ITEMS = [
    { t: "Building a new branch line to a coal pit", a: "C", why: "Creates a new, long-lived asset that will earn revenue for decades." },
    { t: "Buying ten new locomotives to expand the fleet", a: "C", why: "Adds to the railway's productive capacity for many years." },
    { t: "Replacing worn sleepers like-for-like on an existing line", a: "R", why: "Restores the line to its previous condition rather than improving it. Under the double-account system, renewals were charged to revenue." },
    { t: "Wages of drivers, firemen and guards", a: "R", why: "A cost of running the railway this year, used up as it is incurred." },
    { t: "Coal burned by the engines", a: "R", why: "Consumed in earning this year's receipts." },
    { t: "Doubling a single-track line to double track", a: "C", why: "An improvement that increases capacity, so capital, even though it involves laying track on an existing route." },
    { t: "Repainting the stations", a: "R", why: "Routine maintenance that keeps assets in their current condition." },
    { t: "Legal and parliamentary costs of obtaining the Act to build the line", a: "C", why: "Railways capitalised these as part of the cost of construction. Today IAS 16 likewise allows costs directly attributable to bringing an asset into use." }
  ];

  function buildSorter() {
    var wrap = $("sorter"), res = {};
    SORT_ITEMS.forEach(function (s, i) {
      var card = el("div", "sort-item");
      card.appendChild(el("p", null, s.t));
      var acts = el("div", "actions"); acts.style.marginTop = "0";
      var why = el("p", "why");
      [["C", "Capital"], ["R", "Revenue"]].forEach(function (pair) {
        var b = el("button", "btn ghost small", pair[1]); b.type = "button";
        b.addEventListener("click", function () {
          var ok = pair[0] === s.a;
          res[i] = ok;
          card.className = "sort-item " + (ok ? "right" : "wrong");
          why.innerHTML = "<b>" + (s.a === "C" ? "Capital." : "Revenue.") + "</b> " + s.why;
          var n = Object.keys(res).length, c = 0;
          Object.keys(res).forEach(function (k) { if (res[k]) c++; });
          $("sortScore").textContent = c + " of " + n + " correct so far.";
        });
        acts.appendChild(b);
      });
      card.appendChild(acts);
      card.appendChild(why);
      wrap.appendChild(card);
    });
  }

  var dpMethod = "sl";
  function dpRender() {
    var cost = Math.max(0, +$("dpCost").value || 0);
    var res = Math.min(cost, Math.max(0, +$("dpRes").value || 0));
    var life = Math.min(30, Math.max(1, Math.round(+$("dpLife").value || 1)));
    var rows = [], cv = cost, rate = 0, y;
    if (dpMethod === "rb") {
      rate = cost > 0 && res > 0 ? 1 - Math.pow(res / cost, 1 / life) : 0.5;
      $("dpRate").textContent = "Rate " + (rate * 100).toFixed(1) + "% a year on the opening carrying amount. Larger charges early, smaller later.";
    } else {
      $("dpRate").textContent = gbp((cost - res) / life) + " a year: (cost − residual value) ÷ useful life.";
    }
    for (y = 1; y <= life; y++) {
      var charge = dpMethod === "sl" ? (cost - res) / life : cv * rate;
      rows.push({ y: y, open: cv, charge: charge, close: cv - charge });
      cv -= charge;
    }
    $("dpTable").innerHTML = "<thead><tr><th>Year</th><th>Opening</th><th>Depreciation</th><th>Closing</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return "<tr><td>" + r.y + "</td><td>" + gbp(r.open) + "</td><td>" + gbp(r.charge) + "</td><td>" + gbp(r.close) + "</td></tr>";
      }).join("") + "</tbody>";

    var W = 640, H = 220, pad = 8, base = H - 26, top = 26, bw = (W - pad * 2) / life, max = cost || 1;
    var svg = '<line x1="' + pad + '" y1="' + base + '" x2="' + (W - pad) + '" y2="' + base + '" style="stroke:var(--rule)"/>';
    rows.forEach(function (r, i) {
      var h = (r.close / max) * (base - top), dh = (r.charge / max) * (base - top);
      var x = pad + i * bw + bw * 0.18, w = bw * 0.64;
      svg += '<rect x="' + x + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" style="fill:var(--accent)"/>' +
        '<rect x="' + x + '" y="' + (base - h - dh) + '" width="' + w + '" height="' + dh + '" style="fill:none;stroke:var(--accent);stroke-dasharray:3 2"/>';
      if (life <= 15 || r.y % 2 === 1)
        svg += '<text x="' + (x + w / 2) + '" y="' + (H - 8) + '" text-anchor="middle" style="fill:var(--soft);font-size:12px">' + r.y + '</text>';
    });
    svg += '<text x="' + pad + '" y="14" style="fill:var(--soft);font-size:12px;font-style:italic">Solid: carrying amount at year end. Dashed: depreciation charged that year.</text>';
    $("dpChart").innerHTML = svg;
  }

  var QUIZ_CAPITAL = [
    { q: "A machine costs £10,000, will last 4 years and have a residual value of £2,000. Straight-line depreciation per year is:",
      o: ["£2,500", "£2,000", "£3,000"], a: 1,
      e: "(£10,000 − £2,000) ÷ 4 = £2,000." },
    { q: "If a company wrongly treats a £50,000 repair as capital expenditure, this year's profit will be…",
      o: ["Overstated", "Understated", "Unaffected"], a: 0,
      e: "The £50,000 goes onto the balance sheet instead of being charged as an expense, so profit is too high, offset only by a small depreciation charge." },
    { q: "What did the double-account system keep separate?",
      o: ["Domestic and overseas profits",
          "The capital account (money raised and spent on the line) and the revenue account (yearly receipts and expenses)"], a: 1,
      e: "It was required of railways by the Regulation of Railways Act 1868." }
  ];

  /* ================================================================ */
  /* LESSON FIVE — ratios                                              */
  /* ================================================================ */

  var OR_PRESETS = { coal: [500000, 260000, 90000], rural: [140000, 118000, 30000] };
  function orSet(p) {
    var v = OR_PRESETS[p];
    $("orG").value = v[0]; $("orW").value = v[1]; $("orI").value = v[2];
    orCalc();
  }
  function orCalc() {
    var g = +$("orG").value || 0, w = +$("orW").value || 0, i = +$("orI").value || 0;
    if (g <= 0) {
      $("orR").textContent = "–"; $("orN").textContent = "–"; $("orC").textContent = "–";
      $("orNote").textContent = "Enter gross receipts above zero.";
      return;
    }
    var r = w / g * 100, n = g - w, c = i > 0 ? n / i : Infinity, left = n - i;
    $("orR").textContent = r.toFixed(1) + "%";
    $("orN").textContent = gbp(n);
    $("orC").textContent = i > 0 ? c.toFixed(2) + "×" : "n/a";
    var msg = "Of every £1 of receipts, " + Math.round(r) + "p went on running the line. ";
    msg += left >= 0 ? "After paying debenture holders, " + gbp(left) + " is left for shareholders. "
                     : "Net receipts do not cover the interest: " + gbp(-left) + " short, before any dividend. ";
    msg += c < 1.5 ? "With cover this thin, a lender would demand a higher rate of interest, if they would lend at all."
                   : "Lenders can see their interest is comfortably covered.";
    $("orNote").textContent = msg;
  }

  var QUIZ_RATIOS = [
    { q: "Receipts are £200,000 and working expenses £150,000. The operating ratio is:",
      o: ["25%", "75%", "133%"], a: 1, e: "£150,000 ÷ £200,000 = 75%." },
    { q: "A falling operating ratio usually means…",
      o: ["The business is becoming more efficient at turning receipts into net income",
          "Costs are rising faster than receipts"], a: 0,
      e: "A lower ratio leaves more of each £1 of receipts for lenders and shareholders." },
    { q: "Net receipts are £60,000 and interest payable is £40,000. Interest cover is:",
      o: ["0.67 times", "1.5 times", "£20,000"], a: 1,
      e: "£60,000 ÷ £40,000 = 1.5 times. Thin cover means lenders face more risk." }
  ];

  /* ================================================================ */
  /* LESSON SIX — disclosure                                           */
  /* ================================================================ */

  function dvRender(v) {
    var real = v === "real";
    var rows = real
      ? [["Trading result from voyages", "−£300,000"], ["Transfer from undisclosed reserves", "£750,000"],
         ["Profit reported", "£450,000", 1], ["Dividend paid to shareholders", "£400,000"], ["Retained", "£50,000", 1]]
      : [["Balance for the year, after adjustment of taxation reserves and including recoveries", "£450,000", 1],
         ["Dividend paid to shareholders", "£400,000"], ["Retained", "£50,000", 1]];
    $("dvT").innerHTML = rows.map(function (r) {
      return "<tr" + (r[2] ? ' class="total"' : "") + "><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>";
    }).join("");
    $("dvNote").textContent = real
      ? "The business lost money on its trade. The reported profit, and the dividend, came from reserves built up in earlier years. Nothing in the published line is strictly false, yet a reader would draw the opposite conclusion about the company's health."
      : "A healthy-looking profit and a generous dividend. The wording of the line is technically accurate. Would you have realised what it concealed?";
  }

  var QUIZ_DISCLOSURE = [
    { q: "What is information asymmetry?",
      o: ["When managers know more about the business than its owners and lenders", "When two sets of accounts disagree"], a: 0,
      e: "Financial reporting and disclosure exist largely to reduce this gap." },
    { q: "Why were secret reserves dangerous in the Royal Mail case?",
      o: ["They were illegal to create",
          "They allowed losses to be hidden by releasing old reserves into reported profit without telling shareholders"], a: 1,
      e: "Creating hidden reserves was common and not in itself unlawful at the time. Using them silently to disguise trading losses misled readers." },
    { q: "Why might a company choose to disclose less, as Coca-Cola did with its sales figures in 1932?",
      o: ["To protect commercially sensitive information from competitors", "Because accounting standards forbade it"], a: 0,
      e: "Disclosure has costs as well as benefits. Regulation exists partly because companies left to themselves may disclose less than investors need." }
  ];

  /* ================================================================ */
  /* LESSON SEVEN — tax across borders                                 */
  /* ================================================================ */

  var TERRITORIES = [{ n: "Territory A", rate: 0.15 }, { n: "Territory B", rate: 0.10 }, { n: "Territory C", rate: 0.25 }];
  var KEYS = {
    miles:    { s: [0.55, 0.30, 0.15], d: "Route mileage: A has 1,100 miles of track, B 600, C 300. Long, lightly used track in A attracts most of the profit." },
    receipts: { s: [0.35, 0.15, 0.50], d: "Receipts collected: most fares are paid at C's coastal terminal and mines, so C, with the highest rate, takes the largest share." },
    assets:   { s: [0.45, 0.35, 0.20], d: "Capital invested: the workshops and main bridges are in A and B." },
    tonmiles: { s: [0.40, 0.20, 0.40], d: "Ton-miles: each territory's share of the actual work of carrying freight. Arguably the most economic measure, but it requires detailed traffic statistics." }
  };
  function alRender(k) {
    var P = 1000000, s = KEYS[k].s, tax = 0;
    $("alRows").innerHTML = TERRITORIES.map(function (t, i) {
      var p = P * s[i], tx = p * t.rate; tax += tx;
      return '<div class="alloc-row"><div>' + t.n + "<small>taxes at " + Math.round(t.rate * 100) + "%</small></div>" +
        '<div class="track"><div class="fill" style="width:' + (s[i] * 100) + '%"></div></div>' +
        '<div class="num">' + gbp(p) + "<small>tax " + gbp(tx) + "</small></div></div>";
    }).join("");
    $("alTax").textContent = gbp(tax);
    $("alRate").textContent = (tax / P * 100).toFixed(1) + "%";
    $("alBasis").textContent = KEYS[k].d;
  }

  var QUIZ_TAX = [
    { q: "A company's accounts show depreciation of £40,000; the tax rules give capital allowances of £60,000 instead. Compared with accounting profit, taxable profit will be…",
      o: ["£20,000 higher", "£20,000 lower", "The same"], a: 1,
      e: "Add back £40,000 depreciation, deduct £60,000 allowances: a net £20,000 reduction." },
    { q: "In the allocation exercise, why did the total tax change when the railway's profit did not?",
      o: ["Because each allocation key shifts profit between territories with different tax rates",
          "Because some keys reduce total profit"], a: 0,
      e: "Total profit was always £1,000,000. Only its location, and therefore the rate it bore, changed." },
    { q: "Why was taxing Rhodesia Railways especially difficult?",
      o: ["It made no profit",
          "It was a single, indivisible network across several jurisdictions with no statutory rule for dividing its profit"], a: 1,
      e: "The tax base had to be constructed through accounting and argued out in the courts." }
  ];

  /* ------------------------------------------------------------ init ---- */

  document.addEventListener("DOMContentLoaded", function () {
    /* course */
    buildPagers();
    renderDone();
    window.addEventListener("hashchange", route);
    route();

    /* lesson one */
    $("bsNext").addEventListener("click", bsNext);
    $("bsReset").addEventListener("click", bsReset);
    bsReset();
    buildQuiz("quiz-equation", QUIZ_EQUATION, "equation");

    /* lesson two */
    buildMatrix();
    renderTxn();
    renderLedger();
    renderTB();
    buildErrors();
    buildQuiz("quiz-debits-and-credits", QUIZ_DEBITS, "debits-and-credits");

    /* lesson three */
    buildQuiz("rr", TIMING, null);
    buildQuiz("quiz-accruals", QUIZ_ACCRUALS, "accruals");

    /* lesson four */
    buildSorter();
    ["dpCost", "dpRes", "dpLife"].forEach(function (id) { $(id).addEventListener("input", dpRender); });
    segment("dp", function (v) { dpMethod = v; dpRender(); });
    dpRender();
    buildQuiz("quiz-capital-and-revenue", QUIZ_CAPITAL, "capital-and-revenue");

    /* lesson five */
    ["orG", "orW", "orI"].forEach(function (id) { $(id).addEventListener("input", orCalc); });
    segment("or", orSet);
    orSet("coal");
    buildQuiz("quiz-ratios", QUIZ_RATIOS, "ratios");

    /* lesson six */
    segment("dv", dvRender);
    dvRender("pub");
    buildQuiz("quiz-disclosure", QUIZ_DISCLOSURE, "disclosure");

    /* lesson seven */
    segment("al", alRender);
    alRender("miles");
    buildQuiz("quiz-tax", QUIZ_TAX, "tax");
  });
})();
