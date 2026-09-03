/* Debits and credits — interactive teaching resource
   andrewprimmer.com/teaching/  ·  no dependencies */
(function () {
  "use strict";

  /* ---------------------------------------------------------- data ---- */

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

  /* debit-normal categories */
  var DEBIT_NORMAL = { "Asset": 1, "Expense": 1 };

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
      why: "Revenue is recognised when earned rather than when paid, so freight revenue is credited. Because no cash has arrived, the debit goes to trade receivables: a promise of cash rather than cash itself." },
    { date: "31 December", amt: 900,
      narr: "Depreciation is charged on the rolling stock for the year.",
      dr: "depn", cr: "accdep",
      why: "Depreciation expense is debited, reducing profit. The credit goes to accumulated depreciation rather than to the asset directly, so the ledger preserves both the original cost and the wear charged against it." },
    { date: "31 December", amt: 1500,
      narr: "The directors resolve to transfer part of the year's profit to a renewals reserve.",
      dr: "retain", cr: "reserve",
      why: "Retained earnings falls, and equity falls by debit. The renewals reserve rises, and equity rises by credit. Total equity is unchanged and no asset has moved, yet the profit is now labelled as unavailable for dividend. This entry is the subject of section four." }
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

  var QUIZ = [
    { q: "The company pays £1,000 to a supplier it already owed. Which entry is correct?",
      o: ["Debit trade payables, credit cash", "Debit cash, credit trade payables",
          "Debit an expense, credit cash", "Debit trade payables, credit an expense"],
      a: 0,
      e: "The obligation is reduced, and liabilities fall by debit. Cash leaves, so cash is credited. No expense arises: that was recorded when the goods were received." },
    { q: "Why do expenses increase on the debit side?",
      o: ["Because expenses reduce profit and profit is a credit balance",
          "Because they are a use of resources, in the same way an asset is",
          "Because they are always paid in cash",
          "Because the equation would otherwise fail"],
      a: 1,
      e: "Debits record uses of value and credits record sources of it. An expense is value consumed; an asset is value still held. Both are uses, so both increase by debit." },
    { q: "A transfer from retained earnings to a renewals reserve has what effect on total equity?",
      o: ["It increases total equity", "It decreases total equity",
          "It leaves total equity unchanged", "It depends on the size of the transfer"],
      a: 2,
      e: "Both accounts sit within equity, so the debit and the credit cancel. What changes is the label: profit carried to a named reserve is ordinarily no longer distributable." },
    { q: "Freight is carried on account and invoiced but not yet paid. What is debited?",
      o: ["Cash at bank", "Freight revenue", "Trade receivables", "Trade payables"],
      a: 2,
      e: "Revenue is recognised when earned, so freight revenue is credited. Because no cash has arrived, the debit is to trade receivables, which is a claim on cash rather than cash itself." },
    { q: "A new locomotive is charged to repairs expense. What kind of error is this?",
      o: ["Error of omission", "Error of principle", "Error of original entry", "Compensating error"],
      a: 1,
      e: "The amount and the side are both right, but the account is of entirely the wrong type: an expense instead of an asset. The trial balance agrees while profit and total assets are both understated." },
    { q: "Depreciation is credited to accumulated depreciation rather than to the asset itself. Why?",
      o: ["Because the asset account cannot be credited",
          "So the ledger preserves both original cost and the wear charged to date",
          "Because depreciation is a liability",
          "To keep the trial balance in agreement"],
      a: 1,
      e: "Using a separate contra-asset account keeps the historical cost visible alongside the cumulative charge. Crediting the asset directly would balance perfectly well, but would destroy that information." },
    { q: "Which of these will a balanced trial balance reliably detect?",
      o: ["A transaction omitted entirely", "A payment posted to the wrong supplier",
          "A one-sided entry", "Two errors of equal size on opposite sides"],
      a: 2,
      e: "A one-sided entry breaks the equality of debits and credits, so the totals disagree. The other three all preserve equality, which is why agreement is a weak form of assurance." },
    { q: "Shares are issued for cash, and separately debentures are issued for cash. What differs?",
      o: ["The debit differs; the credit is the same",
          "The credit differs; the debit is the same",
          "Both entries are identical",
          "Neither transaction is recorded until settlement"],
      a: 1,
      e: "Cash is debited in both cases. The credit distinguishes them: share capital is a claim by owners, debentures a claim by lenders. The company received the same asset from two different sources." }
  ];

  /* ------------------------------------------------------- helpers ---- */

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function money(n) {
    return n.toLocaleString("en-GB", { minimumFractionDigits: 0 });
  }

  /* -------------------------------------------------- 1. the matrix ---- */

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

  /* --------------------------------------------- 2. the ledger state ---- */

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
      again.addEventListener("click", function () {
        ledger = {}; step = 0; renderTxn(); renderLedger(); renderTB();
      });
      var acts = el("div", "actions"); acts.appendChild(again);
      box.appendChild(acts);
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
    var post = el("button", "btn", "Post entry");
    var hint = el("button", "btn ghost", "Show me");
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

    post.addEventListener("click", function () {
      var d = $("drSel").value, c = $("crSel").value;
      if (!d || !c) {
        verdict.className = "verdict no";
        verdict.textContent = "Choose both an account to debit and an account to credit.";
        return;
      }
      if (d === c) {
        verdict.className = "verdict no";
        verdict.textContent = "The same account cannot be both debited and credited by one entry.";
        return;
      }
      if (d === t.dr && c === t.cr) {
        verdict.className = "verdict ok";
        verdict.innerHTML = "Correct. Debit " + ACCOUNTS[t.dr].label + ", credit " + ACCOUNTS[t.cr].label +
          ".<span class='why'>" + t.why + "</span>";
        post.disabled = true; hint.disabled = true;
        advance();
      } else if (d === t.cr && c === t.dr) {
        verdict.className = "verdict no";
        verdict.innerHTML = "The two accounts are right but the sides are reversed. Ask what the company received: that is the debit.";
      } else {
        verdict.className = "verdict no";
        verdict.innerHTML = "Not quite. Identify the two things this transaction changed, then decide which is the use of value and which is the source.";
      }
    });

    hint.addEventListener("click", function () {
      verdict.className = "verdict ok";
      verdict.innerHTML = "Debit " + ACCOUNTS[t.dr].label + ", credit " + ACCOUNTS[t.cr].label +
        ".<span class='why'>" + t.why + "</span>";
      post.disabled = true; hint.disabled = true;
      advance();
    });
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
        entries.forEach(function (e) {
          ul.appendChild(el("li", null, "(" + e.ref + ")  " + money(e.amt)));
        });
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
      var v = el("b");
      v.textContent = (b.net >= 0 ? money(b.net) + " Dr" : money(-b.net) + " Cr");
      bal.appendChild(v);
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
      state.textContent = "The trial balance agrees at £" + money(totDr) +
        ". Remember what that does and does not prove.";
    } else {
      state.className = "tb-state";
      state.textContent = "Debits and credits differ by £" + money(Math.abs(totDr - totCr)) + ".";
    }
  }

  /* --------------------------------------------------- 3. the errors ---- */

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
        var open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", open ? "false" : "true");
      });
      wrap.appendChild(b);
    });
  }

  /* ----------------------------------------------------- 5. the quiz ---- */

  function buildQuiz() {
    var wrap = $("quiz"), answered = 0, correct = 0;
    QUIZ.forEach(function (item, qi) {
      var box = el("div", "q");
      box.appendChild(el("p", null, (qi + 1) + ". " + item.q));
      var opts = el("div", "opts");
      var buttons = [];
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
          if (answered === QUIZ.length) {
            var s = $("score");
            s.hidden = false;
            s.innerHTML = "You answered <span>" + correct + " of " + QUIZ.length + "</span> correctly.";
          }
        });
        buttons.push(b);
        opts.appendChild(b);
      });
      box.appendChild(opts);
      box.appendChild(el("p", "expl", item.e));
      wrap.appendChild(box);
    });
  }

  /* ------------------------------------------------------------ init ---- */

  document.addEventListener("DOMContentLoaded", function () {
    buildMatrix();
    renderTxn();
    renderLedger();
    renderTB();
    buildErrors();
    buildQuiz();
  });
})();
