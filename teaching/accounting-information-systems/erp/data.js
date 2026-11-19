/* Ledgerline ERP simulator — seed data for Kestrel Cycles Inc. (fictional). */
window.LL = window.LL || {};
LL.SEED = function () {
  return {
    version: 3,
    date: "2026-11-03",
    user: "dana",
    seq: { so: 1000042, dl: 80000121, bi: 90000311, po: 4500000221, gr: 5000000410, iv: 5105600121, je: 100000502, pay: 2000000151, cr: 702 },
    company: { name: "Kestrel Cycles Inc.", city: "Minneapolis, MN", code: "KC01", currency: "USD" },

    accounts: [
      ["1000", "Cash", "asset"], ["1100", "Accounts receivable", "asset"], ["1200", "Inventory", "asset"],
      ["1500", "Equipment", "asset"], ["1510", "Accumulated depreciation", "contra"],
      ["2000", "Accounts payable", "liability"], ["2100", "GR/IR clearing", "liability"], ["2300", "Accrued liabilities", "liability"],
      ["3000", "Common stock", "equity"], ["3100", "Retained earnings", "equity"],
      ["4000", "Sales revenue", "revenue"],
      ["5000", "Cost of goods sold", "expense"], ["5100", "Purchase price variance", "expense"],
      ["6000", "Wages expense", "expense"], ["6100", "Rent expense", "expense"], ["6200", "Utilities expense", "expense"], ["6300", "Depreciation expense", "expense"]
    ],

    materials: [
      { id: "BK-100", name: "Ridgeline Trail Bike", cat: "Bikes", price: 799, cost: 420, stock: 40 },
      { id: "BK-200", name: "Aero Road Bike", cat: "Bikes", price: 1149, cost: 610, stock: 25 },
      { id: "BK-300", name: "Volt E-Bike", cat: "Bikes", price: 2399, cost: 1250, stock: 12 },
      { id: "HL-10", name: "Summit Helmet", cat: "Accessories", price: 59, cost: 28, stock: 480 },
      { id: "LK-20", name: "Fortress U-Lock", cat: "Accessories", price: 39, cost: 18, stock: 250 },
      { id: "TB-30", name: "Inner Tube 4-Pack", cat: "Parts", price: 14, cost: 6, stock: 800 }
    ],

    customers: [
      { id: "C-1001", name: "Summit Cycles", city: "Duluth, MN", limit: 40000, terms: 30, contact: "Erin Walsh" },
      { id: "C-1002", name: "River City Bikes", city: "St. Paul, MN", limit: 25000, terms: 30, contact: "Luis Romero" },
      { id: "C-1003", name: "Lakeside Sports", city: "Madison, WI", limit: 60000, terms: 30, contact: "Hannah Berg" },
      { id: "C-1004", name: "Prairie Pedal Co.", city: "Sioux Falls, SD", limit: 15000, terms: 30, contact: "Jamal Price" },
      { id: "C-1005", name: "Northfield Outdoors", city: "Northfield, MN", limit: 30000, terms: 30, contact: "Kate Lindqvist" }
    ],

    vendors: [
      { id: "V-2001", name: "Apex Frame Works", city: "Milwaukee, WI", phone: "(414) 555-0144", terms: 30, bank: { name: "Lakeshore Bank", routing: "075000022", acct: "•••• 4471" }, supplies: ["BK-100", "BK-200", "BK-300"] },
      { id: "V-2002", name: "Velo Components", city: "Chicago, IL", phone: "(312) 555-0187", terms: 30, bank: { name: "First Prairie Bank", routing: "071000013", acct: "•••• 9032" }, supplies: ["LK-20", "TB-30"] },
      { id: "V-2003", name: "Shield Safety Gear", city: "Des Moines, IA", phone: "(515) 555-0112", terms: 30, bank: { name: "Heartland Trust", routing: "073000228", acct: "•••• 1186" }, supplies: ["HL-10"] },
      { id: "V-2004", name: "Midwest Freight Lines", city: "Fargo, ND", phone: "(701) 555-0163", terms: 15, bank: { name: "Dakota Savings", routing: "091300010", acct: "•••• 5520" }, supplies: [] }
    ],

    users: [
      { id: "dana", name: "Dana Ortiz", title: "Sales clerk", roles: ["SALES"] },
      { id: "marcus", name: "Marcus Lee", title: "Credit manager", roles: ["CREDIT", "CUST_MASTER"] },
      { id: "sam", name: "Sam Becker", title: "Warehouse lead", roles: ["WAREHOUSE"] },
      { id: "priya", name: "Priya Shah", title: "Buyer", roles: ["PURCHASING"] },
      { id: "grace", name: "Grace Kim", title: "Accounts payable clerk", roles: ["AP", "VEND_MASTER"] },
      { id: "tom", name: "Tom Walsh", title: "Treasurer", roles: ["TREASURY"] },
      { id: "alex", name: "Alex Morgan", title: "Controller", roles: ["CONTROLLER"] }
    ],

    sos: [], deliveries: [], billings: [
      { id: "90000301", so: "1000031", customer: "C-1001", date: "2026-10-10", due: "2026-11-09", amount: 12500, paid: 0 },
      { id: "90000294", so: "1000027", customer: "C-1002", date: "2026-09-22", due: "2026-10-22", amount: 11400, paid: 0 },
      { id: "90000306", so: "1000036", customer: "C-1002", date: "2026-10-21", due: "2026-11-20", amount: 12400, paid: 0 },
      { id: "90000309", so: "1000039", customer: "C-1003", date: "2026-10-30", due: "2026-11-29", amount: 8200, paid: 0 },
      { id: "90000281", so: "1000019", customer: "C-1005", date: "2026-08-25", due: "2026-09-24", amount: 6400, paid: 0 },
      { id: "90000298", so: "1000030", customer: "C-1005", date: "2026-10-05", due: "2026-11-04", amount: 12000, paid: 0 }
    ],
    receipts: [],

    pos: [
      { id: "4500000218", vendor: "V-2003", date: "2026-10-27", buyer: "priya", items: [{ mat: "HL-10", qty: 200, price: 28, rec: 180, inv: 0 }], status: "partial", approvedBy: null }
    ],
    grs: [{ id: "5000000409", po: "4500000218", date: "2026-11-02", user: "sam", items: [{ mat: "HL-10", qty: 180 }], value: 5040 }],
    vinvoices: [
      { id: "5105600114", vendor: "V-2001", po: null, invNo: "AFW-5531", date: "2026-10-15", due: "2026-11-14", amount: 21000, status: "posted", reasons: [], text: "Frames and bikes, October" },
      { id: "5105600119", vendor: "V-2004", po: null, invNo: "MFL-30984", date: "2026-10-28", due: "2026-11-12", amount: 2350, status: "posted", reasons: [], text: "Freight, October" },
      { id: "5105600120", vendor: "V-2002", po: null, invNo: "VC-44120", date: "2026-10-12", due: "2026-11-11", amount: 3480, status: "posted", reasons: [], text: "Locks and tubes, October" }
    ],
    inbox: [
      { id: "IN-1", kind: "invoice", vendor: "V-2003", invNo: "SSG-88213", date: "2026-11-02", po: "4500000218", lines: [{ mat: "HL-10", qty: 200, price: 29.5 }], note: "Scanned PDF received by email" },
      { id: "IN-2", kind: "invoice", vendor: "V-2001", invNo: "AFW-5531", date: "2026-11-02", po: null, lines: [{ desc: "Frames and bikes, October", amount: 21000 }], note: "Paper copy received in the mail" }
    ],
    changes: [
      { id: "CR-701", vendor: "V-2002", field: "bank", status: "pending", requested: "2026-11-02", by: "grace",
        source: "Email to accounts payable", from: "accounts@velo-components-billing.com",
        newBank: { name: "Coastal Digital Bank", routing: "026014593", acct: "•••• 6619" },
        email: "Hi team, we have moved banks. Please update our remittance details before your next payment run so this week's payment is not delayed. New account details are below. Thanks, Velo Components Accounts", called: false }
    ],
    payruns: [],
    journal: [
      { id: "100000000", date: "2026-10-31", src: "FI", ref: "Opening", text: "Opening balances", user: "system",
        lines: [["1000", 185000, 0], ["1100", 62900, 0], ["1200", 64750, 0], ["1500", 120000, 0], ["1510", 0, 48000], ["2000", 0, 26830], ["3000", 0, 150000], ["3100", 0, 207820]] },
      { id: "100000501", date: "2026-11-02", src: "MM", ref: "GR 5000000409", text: "Goods receipt: 180 Summit Helmets, PO 4500000218", user: "sam",
        lines: [["1200", 5040, 0], ["2100", 0, 5040]] }
    ],
    audit: [
      { t: "2026-11-02 09:14", user: "sam", type: "post", action: "Goods receipt", detail: "GR 5000000409: 180 of 200 helmets received on PO 4500000218" },
      { t: "2026-11-02 16:40", user: "grace", type: "change", action: "Change request created", detail: "CR-701: bank details for Velo Components (from email)" }
    ],
    missions: { done: {}, failed: {}, active: null }
  };
};

LL.ROLES = {
  SALES: { name: "Sales order processing", can: ["so.create", "bill.create"] },
  CREDIT: { name: "Credit management", can: ["so.release", "so.reject"] },
  CUST_MASTER: { name: "Customer master maintenance", can: ["cust.edit"] },
  WAREHOUSE: { name: "Warehouse: deliveries and receipts", can: ["dl.create", "gr.create"] },
  PURCHASING: { name: "Purchasing", can: ["po.create"] },
  AP: { name: "Accounts payable invoices", can: ["iv.create", "iv.resolve"] },
  VEND_MASTER: { name: "Vendor master maintenance", can: ["vend.edit", "cr.create"] },
  TREASURY: { name: "Treasury: receipts and payments", can: ["pay.receive", "run.create", "run.release"] },
  CONTROLLER: { name: "Controller", can: ["po.approve", "je.create", "cr.approve", "run.approve", "close.run", "roles.edit"] }
};
LL.SOD = [
  ["VEND_MASTER", "AP", "Maintain vendors + post vendor invoices", "An employee could create a fake vendor and invoice the company from it."],
  ["VEND_MASTER", "TREASURY", "Maintain vendors + release payments", "An employee could redirect a vendor's bank account and then pay it."],
  ["SALES", "CREDIT", "Enter sales orders + release credit blocks", "Sales staff could override credit limits on their own orders."],
  ["PURCHASING", "WAREHOUSE", "Create POs + receive goods", "An employee could order goods and confirm receipt of goods that never came."],
  ["AP", "TREASURY", "Post invoices + release payments", "An employee could post a fake invoice and pay it."],
  ["PURCHASING", "AP", "Create POs + post vendor invoices", "An employee could create both sides of the three-way match."]
];
