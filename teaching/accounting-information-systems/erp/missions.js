/* Ledgerline ERP simulator — guided missions. Each step is a check on the live state. */
(function () {
  "use strict";
  function S() { return LL.S; }
  function sosFor(cid, mat, minQty) { return S().sos.filter(function (o) { return o.customer === cid && o.items.some(function (i) { return i.mat === mat && i.qty >= minQty; }); }); }
  function denied(perm) { return S().audit.some(function (a) { return a.type === "denied" && a.detail.indexOf(LL.permLabel(perm)) >= 0; }); }
  function posFor(vid, mat, minQty) { return S().pos.filter(function (p) { return p.vendor === vid && p.items.some(function (i) { return i.mat === mat && i.qty >= minQty; }); }); }

  LL.MISSIONS = [
    { id: "m1", num: 1, title: "Order to cash", lecture: "Lecture 6", time: "10 min",
      brief: "Summit Cycles in Duluth wants 10 Ridgeline Trail Bikes. Take the order all the way from sales order to cash in the bank, switching users as each department does its part.",
      steps: [
        { text: "As Dana Ortiz (Sales), create a sales order for Summit Cycles: 10 × Ridgeline Trail Bike.", hint: "Sales → Create sales order.", route: "#/sales/new", user: "dana",
          check: function () { return sosFor("C-1001", "BK-100", 10).length > 0; } },
        { text: "As Sam Becker (Warehouse), post the goods issue to ship it.", hint: "Open the order and choose Post goods issue. Watch the cost of goods sold post itself.", user: "sam",
          check: function () { return sosFor("C-1001", "BK-100", 10).some(function (o) { return ["delivered", "invoiced"].indexOf(o.status) >= 0; }); } },
        { text: "As Dana Ortiz, create the billing document (invoice).", hint: "Open the order and choose Create invoice.", user: "dana",
          check: function () { return sosFor("C-1001", "BK-100", 10).some(function (o) { return o.status === "invoiced"; }); } },
        { text: "As Tom Walsh (Treasury), post Summit's payment for that invoice.", hint: "Receivables → Post incoming payment.", route: "#/receivables", user: "tom",
          check: function () { return sosFor("C-1001", "BK-100", 10).some(function (o) { var b = o.billing && LL.find("billings", o.billing); return b && b.paid >= b.amount; }); } },
        { text: "Open the order's document flow and its journal entries.", hint: "Open the sales order and look at the Accounting tab.",
          check: function () { return !!S().flags.viewedSOAcct; } }
      ],
      debrief: "Four people, four documents, four journal entries, and nobody typed a debit or a credit. The goods issue posted cost of goods sold and reduced inventory; the invoice posted the receivable and revenue; the payment cleared it. That's the integration an ERP gives you (microteaches 4.1 and 6.1)." },

    { id: "m2", num: 2, title: "The credit block", lecture: "Lecture 6", time: "8 min",
      brief: "River City Bikes already owes $23,800, and $11,400 of it is overdue. Now they want 10 Aero Road Bikes. See how the automatic credit check and segregation of duties protect the company.",
      steps: [
        { text: "As Dana Ortiz, create a sales order for River City Bikes: 10 × Aero Road Bike.", hint: "Sales → Create sales order. Watch the credit panel as you add the bikes.", route: "#/sales/new", user: "dana",
          check: function () { return sosFor("C-1002", "BK-200", 10).length > 0; } },
        { text: "Still as Dana, try to release the credit block yourself.", hint: "Open the blocked order and choose Release credit block.", user: "dana",
          check: function () { return denied("so.release"); } },
        { text: "As Marcus Lee (Credit), review the exposure and decide: release or reject the order.", hint: "Open the order. Look at the overdue balance on the Credit tab before you decide.", user: "marcus",
          check: function () { return sosFor("C-1002", "BK-200", 10).some(function (o) { return o.releasedBy || o.status === "rejected"; }); } }
      ],
      debrief: "The ERP compared credit exposure (open receivables plus open orders plus this order) with the limit and blocked the order. Dana couldn't release it: approving credit and selling are separate duties. With $11,400 more than 30 days overdue, most credit managers would reject or hold the order until River City pays (microteach 6.2)." },

    { id: "m3", num: 3, title: "Procure to pay", lecture: "Lecture 7", time: "12 min",
      brief: "Stock of the Volt E-Bike is low. Buy 20 from Apex Frame Works and pay for them, passing every approval along the way.",
      steps: [
        { text: "As Priya Shah (Purchasing), create a purchase order to Apex Frame Works: 20 × Volt E-Bike at $1,250.", hint: "Purchasing → Create purchase order.", route: "#/purchasing/new", user: "priya",
          check: function () { return posFor("V-2001", "BK-300", 20).length > 0; } },
        { text: "As Alex Morgan (Controller), approve the PO. It's over $10,000.", hint: "Open the PO and choose Approve.", user: "alex",
          check: function () { return posFor("V-2001", "BK-300", 20).some(function (p) { return p.approvedBy; }); } },
        { text: "As Sam Becker (Warehouse), receive the delivery using a blind count of 20.", hint: "Open the PO and choose Post goods receipt.", user: "sam",
          check: function () { return posFor("V-2001", "BK-300", 20).some(function (p) { return p.items[0].rec >= 20; }); } },
        { text: "As Grace Kim (AP), enter Apex's invoice AFW-6120 for 20 × $1,250 against the PO.", hint: "Supplier invoices → Enter invoice. Watch the three-way match.", route: "#/invoices/new", user: "grace",
          check: function () { return S().vinvoices.some(function (v) { return v.status !== "rejected" && v.status !== "blocked" && v.po && posFor("V-2001", "BK-300", 20).some(function (p) { return p.id === v.po; }); }); } },
        { text: "As Tom Walsh (Treasury), create a payment run that includes the invoice. Then have Alex approve it and Tom release it.", hint: "Payments. Runs over $20,000 need two people.", route: "#/payments", user: "tom",
          check: function () { return S().vinvoices.some(function (v) { return v.status === "paid" && v.po && posFor("V-2001", "BK-300", 20).some(function (p) { return p.id === v.po; }); }); } }
      ],
      debrief: "Five steps, four people and two approvals: the PO approval and the dual approval of a large payment run. The goods receipt debited inventory and credited GR/IR; the matched invoice cleared GR/IR into accounts payable; the payment cleared payables against cash (microteaches 7.1 to 7.5)." },

    { id: "m4", num: 4, title: "Three-way match exceptions", lecture: "Lecture 7", time: "10 min",
      brief: "Two supplier invoices are waiting in Grace Kim's inbox. One doesn't agree with the PO and the goods receipt. The other looks familiar. Process both.",
      steps: [
        { text: "As Grace Kim, enter Shield Safety Gear's invoice SSG-88213 from the inbox.", hint: "Supplier invoices → Inbox. Compare the invoice with what was ordered and received.", route: "#/invoices", user: "grace",
          check: function () { return S().vinvoices.some(function (v) { return v.invNo === "SSG-88213"; }); } },
        { text: "Resolve it: post it for the quantity received at the PO price.", hint: "Open the blocked invoice. Which is right: 200 or 180 helmets? $29.50 or $28?", user: "grace",
          check: function () { return S().vinvoices.some(function (v) { return v.invNo === "SSG-88213" && v.status === "posted"; }); } },
        { text: "Enter Apex Frame Works' invoice AFW-5531 from the inbox.", hint: "Supplier invoices → Inbox.", user: "grace",
          check: function () { return S().vinvoices.filter(function (v) { return v.invNo === "AFW-5531"; }).length > 1; } },
        { text: "Deal with it correctly.", hint: "Why was it blocked? Should it ever be paid?", user: "grace",
          check: function () { return S().vinvoices.some(function (v) { return v.invNo === "AFW-5531" && v.duplicate && v.status === "rejected"; }); } }
      ],
      debrief: "Shield billed 200 helmets at $29.50, but only 180 arrived and the PO price was $28: both checks failed. Paying for what you received at the agreed price saved $860. The Apex invoice was a duplicate of one already posted, and the ERP's duplicate check stopped a $21,000 double payment (microteaches 7.4 and 7.6)." },

    { id: "m5", num: 5, title: "The bank details email", lecture: "Lecture 7", time: "6 min",
      brief: "An email asks Kestrel to change Velo Components' bank account before this week's payment run. Grace has raised a change request. You're the Controller: decide what happens.",
      steps: [
        { text: "As Alex Morgan, open change request CR-701 and read the email.", hint: "Master data → Change requests.", route: "#/masters/changes", user: "alex",
          check: function () { return !!S().flags.viewedCR; } },
        { text: "Verify it the right way.", hint: "Never use contact details from the email itself.", user: "alex",
          check: function () { var c = LL.find("changes", "CR-701"); return c && c.called; } },
        { text: "Make your decision.", hint: "What did the vendor tell you?", user: "alex",
          check: function () { var c = LL.find("changes", "CR-701"); return c && c.status === "rejected"; },
          fail: function () { var c = LL.find("changes", "CR-701"); return c && c.status === "approved"; } }
      ],
      debrief: "This is business email compromise. The sender's domain (velo-components-billing.com) wasn't Velo's, the email pushed urgency, and Velo confirmed by phone that nothing had changed. Calling a number already on file, and separating who requests a change from who approves it, stops payments being redirected (microteaches 4.4 and 7.5)." },

    { id: "m6", num: 6, title: "Month-end close", lecture: "Lecture 10–11", time: "10 min",
      brief: "It's the end of November. As Controller, post the closing entries, fix a segregation of duties problem, and check that the books balance.",
      steps: [
        { text: "Post an accrual for November utilities: $1,850 (debit Utilities expense, credit Accrued liabilities).", hint: "General ledger → New journal entry.", route: "#/gl/new", user: "alex",
          check: function () { return S().journal.some(function (j) { return j.src === "FI" && j.ref === "Manual" && j.lines.some(function (l) { return l[0] === "6200" && l[1] === 1850; }) && j.lines.some(function (l) { return l[0] === "2300" && l[2] === 1850; }); }); } },
        { text: "Run monthly depreciation.", hint: "General ledger → Period-end jobs.", route: "#/gl", user: "alex",
          check: function () { return S().journal.some(function (j) { return j.ref.indexOf("DEP ") === 0; }); } },
        { text: "Find the segregation of duties conflict and fix it.", hint: "Security → SoD analysis. Who can both maintain vendors and post their invoices?", route: "#/security", user: "alex",
          check: function () { return LL.sodConflicts().length === 0; } },
        { text: "Review the trial balance and the income statement.", hint: "Reports.", route: "#/reports", user: "alex",
          check: function () { return S().flags.viewedTB && S().flags.viewedIS; } }
      ],
      debrief: "Accruals and depreciation put November's expenses in November. Removing vendor master maintenance from the AP clerk closed the shell-vendor risk. And because every subledger posts to the ledger automatically, the trial balance balances: total debits equal total credits (microteaches 10.4 and 11.6)." }
  ];

  LL.missionStatus = function (m) {
    var steps = m.steps.map(function (st) { return !!st.check(); });
    var failed = m.steps.some(function (st) { return st.fail && st.fail(); });
    var first = steps.indexOf(false);
    return { steps: steps, done: first < 0 && !failed, failed: failed, current: first < 0 ? steps.length : first, count: steps.filter(Boolean).length };
  };
  LL.missionsDone = function () { return LL.MISSIONS.filter(function (m) { return LL.missionStatus(m).done; }).length; };
})();
