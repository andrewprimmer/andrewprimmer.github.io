/* End-of-lecture exercises for ACCT 416 Intermediate Accounting I.
   Each lecture page has <div id="acct-ex" data-lecture="N">. Question types:
   mcq (choose one), match (pair each item), order (put steps in sequence),
   sort (put each item in a category) and num (enter a number).
   Progress is kept in this browser's localStorage. */
(function () {
  "use strict";

  var POOL = {};

  var DATA = {
 "1": [
  {
   "type": "match",
   "q": "Match each body to its role.",
   "pairs": [
    [
     "SEC",
     "Legal authority over public company reporting"
    ],
    [
     "FASB",
     "Writes US GAAP"
    ],
    [
     "PCAOB",
     "Oversees audits of public companies"
    ],
    [
     "IASB",
     "Writes IFRS"
    ]
   ],
   "why": "Four standard-setting bodies.",
   "video": "1.2"
  },
  {
   "type": "mcq",
   "q": "The primary users of general-purpose financial reports are:",
   "opts": [
    "Managers",
    "Existing and potential investors and creditors",
    "Tax authorities",
    "Customers"
   ],
   "a": 1,
   "why": "Reports are built for capital providers.",
   "video": "1.1"
  },
  {
   "type": "order",
   "q": "Put the FASB's due process in order.",
   "items": [
    "Topic added to agenda",
    "Research and analysis",
    "Discussion paper",
    "Exposure draft",
    "Comments and roundtables",
    "Accounting Standards Update"
   ],
   "why": "Six steps.",
   "video": "1.3"
  },
  {
   "type": "mcq",
   "q": "The single source of authoritative US GAAP is the:",
   "opts": [
    "Exposure draft",
    "Accounting Standards Codification",
    "Conceptual framework",
    "SEC Form 10-K"
   ],
   "a": 1,
   "why": "Everything authoritative is in the Codification.",
   "video": "1.3"
  },
  {
   "type": "sort",
   "q": "Sort each treatment: allowed under US GAAP only, or under IFRS only?",
   "cats": [
    "US GAAP only",
    "IFRS only"
   ],
   "items": [
    [
     "LIFO inventory",
     0
    ],
    [
     "Upward revaluation of property",
     1
    ],
    [
     "Reversal of impairment losses",
     1
    ],
    [
     "Expensing all development costs",
     0
    ]
   ],
   "why": "Key differences.",
   "video": "1.5"
  },
  {
   "type": "mcq",
   "q": "A public company presenting a non-GAAP measure must:",
   "opts": [
    "Have it audited separately",
    "Reconcile it to the closest GAAP measure",
    "Show it before GAAP net income",
    "Get FASB approval"
   ],
   "a": 1,
   "why": "SEC rules require reconciliation.",
   "video": "1.4"
  },
  {
   "type": "mcq",
   "q": "The Sarbanes-Oxley Act of 2002 created the:",
   "opts": [
    "FASB",
    "SEC",
    "PCAOB",
    "IASB"
   ],
   "a": 2,
   "why": "SOX created the PCAOB.",
   "video": "1.2"
  },
  {
   "type": "order",
   "q": "Put the steps for resolving an ethical dilemma in order.",
   "items": [
    "Recognize the ethical issue",
    "Identify the stakeholders",
    "List the alternatives",
    "Weigh the consequences",
    "Decide and act"
   ],
   "why": "Five steps.",
   "video": "1.6"
  }
 ],
 "2": [
  {
   "type": "sort",
   "q": "Sort each ingredient under its fundamental characteristic.",
   "cats": [
    "Relevance",
    "Faithful representation"
   ],
   "items": [
    [
     "Predictive value",
     0
    ],
    [
     "Confirmatory value",
     0
    ],
    [
     "Materiality",
     0
    ],
    [
     "Completeness",
     1
    ],
    [
     "Neutrality",
     1
    ],
    [
     "Free from error",
     1
    ]
   ],
   "why": "Three ingredients each.",
   "video": "2.2"
  },
  {
   "type": "mcq",
   "q": "Which is an enhancing qualitative characteristic?",
   "opts": [
    "Relevance",
    "Neutrality",
    "Verifiability",
    "Materiality"
   ],
   "a": 2,
   "why": "Comparability, verifiability, timeliness, understandability.",
   "video": "2.2"
  },
  {
   "type": "match",
   "q": "Match each item to its element.",
   "pairs": [
    [
     "Kayak sales to dealers",
     "Revenue"
    ],
    [
     "Loss on sale of old forklift",
     "Loss"
    ],
    [
     "Dividends paid",
     "Distribution to owners"
    ],
    [
     "Wages owed to employees",
     "Liability"
    ]
   ],
   "why": "Element definitions.",
   "video": "2.3"
  },
  {
   "type": "match",
   "q": "Match each situation to the assumption it reflects.",
   "pairs": [
    [
     "Owner's personal car kept off the books",
     "Economic entity"
    ],
    [
     "Equipment depreciated over 10 years",
     "Going concern"
    ],
    [
     "No adjustment for inflation",
     "Monetary unit"
    ],
    [
     "Quarterly reports",
     "Periodicity"
    ]
   ],
   "why": "Four assumptions.",
   "video": "2.4"
  },
  {
   "type": "mcq",
   "q": "Quoted prices for identical assets in active markets are:",
   "opts": [
    "Level 1",
    "Level 2",
    "Level 3",
    "Historical cost"
   ],
   "a": 0,
   "why": "Most reliable inputs.",
   "video": "2.5"
  },
  {
   "type": "mcq",
   "q": "Recording December sales commissions in December reflects the:",
   "opts": [
    "Full disclosure principle",
    "Expense recognition principle",
    "Monetary unit assumption",
    "Cost constraint"
   ],
   "a": 1,
   "why": "Match expenses with the revenues they help create.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "An unrecorded expense of $8,000 compared with net income of $500,000 is what percent of income?",
   "a": 1.6,
   "tol": 0.05,
   "unit": "%",
   "why": "8,000 ÷ 500,000.",
   "video": "2.6"
  },
  {
   "type": "mcq",
   "q": "A small item becomes material mainly because:",
   "opts": [
    "It's over $1,000",
    "It could change a user's decision, e.g. breaching a covenant",
    "It's verifiable",
    "It's recurring"
   ],
   "a": 1,
   "why": "Materiality depends on nature and context, not just size.",
   "video": "2.6"
  }
 ],
 "3": [
  {
   "type": "order",
   "q": "Put the accounting cycle in order.",
   "items": [
    "Journalize and post transactions",
    "Unadjusted trial balance",
    "Adjusting entries",
    "Adjusted trial balance",
    "Financial statements",
    "Closing entries"
   ],
   "why": "The cycle.",
   "video": "3.1"
  },
  {
   "type": "num",
   "q": "Insurance of $18,000 for 12 months was prepaid on September 1. Expense for the year ended December 31?",
   "a": 6000,
   "unit": "$",
   "why": "4 months × 1,500.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "A customer prepaid $50,000 on December 1; 30% of the goods were delivered by December 31. Unearned revenue remaining?",
   "a": 35000,
   "unit": "$",
   "why": "70% of 50,000.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "A $40,000, 9% note receivable was accepted on November 1. Accrued interest at December 31?",
   "a": 600,
   "unit": "$",
   "why": "40,000 × 9% × 2/12.",
   "video": "3.3"
  },
  {
   "type": "sort",
   "q": "Sort each adjustment by type.",
   "cats": [
    "Prepayment",
    "Accrual"
   ],
   "items": [
    [
     "Insurance expiring",
     0
    ],
    [
     "Wages earned not paid",
     1
    ],
    [
     "Deposit partly earned",
     0
    ],
    [
     "Interest earned not received",
     1
    ]
   ],
   "why": "Cash first vs event first.",
   "video": "3.3"
  },
  {
   "type": "num",
   "q": "Equipment cost $75,000, salvage $5,000, 7-year life. Annual straight-line depreciation?",
   "a": 10000,
   "unit": "$",
   "why": "70,000 ÷ 7.",
   "video": "3.4"
  },
  {
   "type": "mcq",
   "q": "Which account is closed at year-end?",
   "opts": [
    "Accounts receivable",
    "Dividends",
    "Common stock",
    "Accumulated depreciation"
   ],
   "a": 1,
   "why": "Dividends is temporary.",
   "video": "3.5"
  },
  {
   "type": "num",
   "q": "Cash collected from customers $700,000; accounts receivable increased $25,000; unearned revenue increased $10,000. Accrual revenue?",
   "a": 715000,
   "unit": "$",
   "why": "700,000 + 25,000 − 10,000.",
   "video": "3.6"
  }
 ],
 "4": [
  {
   "type": "num",
   "q": "Net sales $900,000; COGS $540,000. Gross profit percentage?",
   "a": 40,
   "tol": 0.1,
   "unit": "%",
   "why": "360,000 ÷ 900,000.",
   "video": "4.2"
  },
  {
   "type": "num",
   "q": "Income from operations $500,000; interest expense $40,000; gain on sale $15,000; tax 25%. Income from continuing operations?",
   "a": 356250,
   "unit": "$",
   "why": "Pretax 475,000 × 75%.",
   "video": "4.2"
  },
  {
   "type": "num",
   "q": "A discontinued division had an operating loss of $70,000 and a $30,000 loss on sale; tax 25%. Loss from discontinued operations, net of tax?",
   "a": 75000,
   "unit": "$",
   "why": "100,000 × 75%.",
   "video": "4.3"
  },
  {
   "type": "mcq",
   "q": "Under current US GAAP, a rare and unusual earthquake loss is reported:",
   "opts": [
    "As an extraordinary item",
    "In continuing operations, before tax",
    "In OCI",
    "As a prior period adjustment"
   ],
   "a": 1,
   "why": "Extraordinary items were eliminated in 2015.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "Net income $450,000; preferred dividends $30,000; weighted-average shares 200,000. Basic EPS?",
   "a": 2.1,
   "tol": 0.005,
   "unit": "$",
   "why": "420,000 ÷ 200,000.",
   "video": "4.5"
  },
  {
   "type": "match",
   "q": "Match each item to where it is reported.",
   "pairs": [
    [
     "Storm damage loss",
     "Continuing operations, pretax"
    ],
    [
     "Loss on sale of a discontinued division",
     "Discontinued operations, net of tax"
    ],
    [
     "Unrealized gain on AFS debt securities",
     "Other comprehensive income"
    ],
    [
     "Correction of a prior-year error",
     "Beginning retained earnings"
    ]
   ],
   "why": "Each item has its place.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "Net income $250,000; OCI gain $15,000 net of tax. Comprehensive income?",
   "a": 265000,
   "unit": "$",
   "why": "Net income + OCI.",
   "video": "4.6"
  },
  {
   "type": "num",
   "q": "Beginning retained earnings $1,200,000; net income $300,000; dividends $100,000. Ending retained earnings?",
   "a": 1400000,
   "unit": "$",
   "why": "1,200,000 + 300,000 − 100,000.",
   "video": "4.6"
  }
 ],
 "5": [
  {
   "type": "sort",
   "q": "Sort each item: current or noncurrent asset?",
   "cats": [
    "Current",
    "Noncurrent"
   ],
   "items": [
    [
     "Prepaid rent for 6 months",
     0
    ],
    [
     "Land held for a future plant",
     1
    ],
    [
     "Patent",
     1
    ],
    [
     "Inventory",
     0
    ],
    [
     "Bond sinking fund",
     1
    ],
    [
     "Accounts receivable",
     0
    ]
   ],
   "why": "Expected use within a year or operating cycle.",
   "video": "5.2"
  },
  {
   "type": "mcq",
   "q": "Accumulated other comprehensive income is reported in:",
   "opts": [
    "Current liabilities",
    "Stockholders' equity",
    "The income statement",
    "Long-term investments"
   ],
   "a": 1,
   "why": "AOCI is an equity component.",
   "video": "5.3"
  },
  {
   "type": "num",
   "q": "Current assets $1,050,000; current liabilities $700,000. Current ratio?",
   "a": 1.5,
   "tol": 0.01,
   "unit": "",
   "why": "1,050 ÷ 700.",
   "video": "5.4"
  },
  {
   "type": "num",
   "q": "Total liabilities $1,200,000; total assets $3,000,000. Debt to assets, in percent?",
   "a": 40,
   "tol": 0.1,
   "unit": "%",
   "why": "1.2 ÷ 3.0.",
   "video": "5.4"
  },
  {
   "type": "sort",
   "q": "Classify each cash flow.",
   "cats": [
    "Operating",
    "Investing",
    "Financing"
   ],
   "items": [
    [
     "Collections from customers",
     0
    ],
    [
     "Purchase of equipment",
     1
    ],
    [
     "Payment of dividends",
     2
    ],
    [
     "Wages paid",
     0
    ],
    [
     "Sale of land",
     1
    ],
    [
     "Issuing bonds",
     2
    ]
   ],
   "why": "Three activities.",
   "video": "5.5"
  },
  {
   "type": "num",
   "q": "Cash from operations $800,000; capital expenditures $500,000; dividends $100,000. Free cash flow?",
   "a": 200000,
   "unit": "$",
   "why": "800 − 500 − 100.",
   "video": "5.5"
  },
  {
   "type": "mcq",
   "q": "A customer's January bankruptcy reveals that a December 31 receivable was uncollectible. The company should:",
   "opts": [
    "Only disclose it",
    "Adjust the December statements",
    "Ignore it",
    "Record it in January"
   ],
   "a": 1,
   "why": "Evidence about conditions existing at year-end.",
   "video": "5.6"
  },
  {
   "type": "match",
   "q": "Match each disclosure technique to an example.",
   "pairs": [
    [
     "Parenthetical explanation",
     "Inventory (FIFO) on the face"
    ],
    [
     "Note",
     "Summary of significant accounting policies"
    ],
    [
     "Contra account",
     "Allowance for doubtful accounts"
    ],
    [
     "Supporting schedule",
     "Detail of property by class"
    ]
   ],
   "why": "Four techniques.",
   "video": "5.6"
  }
 ],
 "6": [
  {
   "type": "num",
   "q": "$80,000 is invested at 6% compounded annually for 5 years (factor 1.33823). Future value?",
   "a": 107058,
   "tol": 2,
   "unit": "$",
   "why": "80,000 × 1.33823.",
   "video": "6.2"
  },
  {
   "type": "num",
   "q": "PV of $250,000 due in 4 years at 5% (factor 0.82270)?",
   "a": 205675,
   "tol": 2,
   "unit": "$",
   "why": "250,000 × 0.82270.",
   "video": "6.3"
  },
  {
   "type": "mcq",
   "q": "10% annual interest compounded semiannually for 3 years uses:",
   "opts": [
    "10% for 3 periods",
    "5% for 6 periods",
    "5% for 3 periods",
    "20% for 6 periods"
   ],
   "a": 1,
   "why": "Halve the rate, double the periods.",
   "video": "6.1"
  },
  {
   "type": "num",
   "q": "Using the rule of 72, years to double at 9%?",
   "a": 8,
   "tol": 0.01,
   "unit": "years",
   "why": "72 ÷ 9.",
   "video": "6.4"
  },
  {
   "type": "num",
   "q": "Deposits of $30,000 at the end of each year for 5 years at 6% (FVA factor 5.63709). Future value?",
   "a": 169113,
   "tol": 2,
   "unit": "$",
   "why": "30,000 × 5.63709.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "Same deposits made at the start of each year. Future value?",
   "a": 179259,
   "tol": 3,
   "unit": "$",
   "why": "169,113 × 1.06.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "Five annual payments of $40,000 at year-end, discounted at 8% (factor 3.99271). Present value?",
   "a": 159708,
   "tol": 2,
   "unit": "$",
   "why": "40,000 × 3.99271.",
   "video": "6.6"
  },
  {
   "type": "match",
   "q": "Match each situation to the right table.",
   "pairs": [
    [
     "Amount needed in 5 years: deposit today?",
     "PV of 1"
    ],
    [
     "Equal yearly deposits: fund balance later?",
     "FV of an annuity"
    ],
    [
     "Value today of equal loan payments",
     "PV of an annuity"
    ],
    [
     "Value later of one deposit today",
     "FV of 1"
    ]
   ],
   "why": "Four basic tables.",
   "video": "6.6"
  }
 ],
 "7": [
  {
   "type": "num",
   "q": "Four payments of $10,000, first at the end of year 3, at 8% (PVA 4 = 3.31213; PV of 1, 2 periods = 0.85734). Present value?",
   "a": 28396,
   "tol": 3,
   "unit": "$",
   "why": "33,121 × 0.85734.",
   "video": "7.1"
  },
  {
   "type": "num",
   "q": "A $50,000 bond pays 4% semiannually (2% per period) for 3 years; market rate 3% per period (PV of 1, 6 periods = 0.83748; PVA = 5.41719). Price?",
   "a": 47292,
   "tol": 3,
   "unit": "$",
   "why": "41,874 + 1,000 × 5.41719 = 47,291.",
   "video": "7.2"
  },
  {
   "type": "mcq",
   "q": "When the market rate exceeds the stated rate, a bond sells at:",
   "opts": [
    "Premium",
    "Par",
    "Discount",
    "Face plus interest"
   ],
   "a": 2,
   "why": "Buyers pay less to earn the higher market yield.",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "Carrying amount $91,889; market rate 4% per period; cash interest $3,000. Discount amortized this period?",
   "a": 676,
   "tol": 1,
   "unit": "$",
   "why": "3,676 − 3,000.",
   "video": "7.3"
  },
  {
   "type": "num",
   "q": "Loan $300,000 for 5 years at 7% (PVA factor 4.10020). Annual payment?",
   "a": 73167,
   "tol": 2,
   "unit": "$",
   "why": "300,000 ÷ 4.10020.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "That loan's year-1 principal reduction?",
   "a": 52167,
   "tol": 2,
   "unit": "$",
   "why": "73,167 − 21,000.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "Outcomes: 25% $20,000; 50% $30,000; 25% $50,000, payable in one year. PV at 5% risk-free?",
   "a": 30952,
   "tol": 2,
   "unit": "$",
   "why": "Expected 32,500 ÷ 1.05.",
   "video": "7.5"
  },
  {
   "type": "mcq",
   "q": "Under the expected cash flow approach, the discount rate is:",
   "opts": [
    "The company's borrowing rate",
    "A risk-free rate",
    "The stated rate",
    "Zero"
   ],
   "a": 1,
   "why": "Risk is captured in the probabilities.",
   "video": "7.5"
  }
 ],
 "8": [
  {
   "type": "sort",
   "q": "Sort each item: cash and cash equivalents, or not?",
   "cats": [
    "Cash and equivalents",
    "Not cash"
   ],
   "items": [
    [
     "Money market fund",
     0
    ],
    [
     "Postdated check from a customer",
     1
    ],
    [
     "2-month Treasury bill",
     0
    ],
    [
     "Postage stamps",
     1
    ],
    [
     "Checking account",
     0
    ],
    [
     "9-month certificate of deposit",
     1
    ]
   ],
   "why": "Three-month rule.",
   "video": "8.1"
  },
  {
   "type": "num",
   "q": "A $30,000 sale on 2/10, n/30; the customer is expected to pay early. Revenue recorded?",
   "a": 29400,
   "unit": "$",
   "why": "98% of 30,000.",
   "video": "8.2"
  },
  {
   "type": "num",
   "q": "Required allowance $18,000; the allowance has a $5,000 credit balance. Credit loss expense?",
   "a": 13000,
   "unit": "$",
   "why": "18,000 − 5,000.",
   "video": "8.3"
  },
  {
   "type": "num",
   "q": "Required allowance $18,000; the allowance has a $2,000 debit balance. Credit loss expense?",
   "a": 20000,
   "unit": "$",
   "why": "18,000 + 2,000.",
   "video": "8.3"
  },
  {
   "type": "mcq",
   "q": "Writing off an uncollectible account under the allowance method:",
   "opts": [
    "Increases expense",
    "Reduces net receivables",
    "Leaves net receivables unchanged",
    "Increases the allowance"
   ],
   "a": 2,
   "why": "Both AR and the allowance fall.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "A $200,000 zero-interest note due in 3 years; market rate 6% (factor 0.83962). Amount recorded?",
   "a": 167924,
   "tol": 1,
   "unit": "$",
   "why": "200,000 × 0.83962.",
   "video": "8.5"
  },
  {
   "type": "num",
   "q": "Receivables of $100,000 are factored without recourse; fee 3%, holdback 5%. Cash received?",
   "a": 92000,
   "unit": "$",
   "why": "100,000 − 3,000 − 5,000.",
   "video": "8.6"
  },
  {
   "type": "num",
   "q": "Net sales $3,650,000; average receivables $365,000. Days to collect (365-day year)?",
   "a": 36.5,
   "tol": 0.1,
   "unit": "days",
   "why": "Turnover 10; 365 ÷ 10.",
   "video": "8.6"
  }
 ],
 "9": [
  {
   "type": "match",
   "q": "Match each item to its inventory classification.",
   "pairs": [
    [
     "Aluminum sheets",
     "Raw materials"
    ],
    [
     "Kayaks being painted",
     "Work in process"
    ],
    [
     "Boxed kayaks in the warehouse",
     "Finished goods"
    ]
   ],
   "why": "Three manufacturing inventories.",
   "video": "9.1"
  },
  {
   "type": "num",
   "q": "Beginning inventory $120,000; purchases $480,000; ending inventory $150,000. COGS?",
   "a": 450000,
   "unit": "$",
   "why": "120 + 480 − 150.",
   "video": "9.2"
  },
  {
   "type": "mcq",
   "q": "Goods shipped by Bluestem FOB shipping point, in transit at year-end, belong to:",
   "opts": [
    "Bluestem",
    "The buyer",
    "The carrier",
    "Neither"
   ],
   "a": 1,
   "why": "Control passes at shipment.",
   "video": "9.3"
  },
  {
   "type": "num",
   "q": "Count $500,000; Bluestem goods at a consignee $30,000; goods held for others on consignment (included in count) $12,000. Correct inventory?",
   "a": 518000,
   "unit": "$",
   "why": "500 + 30 − 12.",
   "video": "9.3"
  },
  {
   "type": "sort",
   "q": "Sort each cost: inventory or expense?",
   "cats": [
    "Inventory cost",
    "Period expense"
   ],
   "items": [
    [
     "Freight-in",
     0
    ],
    [
     "Freight-out",
     1
    ],
    [
     "Factory labor",
     0
    ],
    [
     "Sales commissions",
     1
    ],
    [
     "Abnormal spoilage",
     1
    ],
    [
     "Factory overhead",
     0
    ]
   ],
   "why": "Product vs period costs.",
   "video": "9.4"
  },
  {
   "type": "num",
   "q": "Invoice $40,000; freight-in $1,200; 2% discount taken. Inventory cost?",
   "a": 40400,
   "unit": "$",
   "why": "40,000 − 800 + 1,200.",
   "video": "9.4"
  },
  {
   "type": "mcq",
   "q": "2027 ending inventory understated by $8,000. 2028 net income (before tax) is:",
   "opts": [
    "Understated $8,000",
    "Overstated $8,000",
    "Correct",
    "Understated $16,000"
   ],
   "a": 1,
   "why": "Beginning inventory understated, COGS understated.",
   "video": "9.5"
  },
  {
   "type": "mcq",
   "q": "Which is a red flag for inventory manipulation?",
   "opts": [
    "Inventory and sales grow together",
    "Inventory grows much faster than sales",
    "Turnover rises",
    "Margins fall slightly"
   ],
   "a": 1,
   "why": "Possible overstatement or obsolescence.",
   "video": "9.6"
  }
 ],
 "10": [
  {
   "type": "num",
   "q": "Goods available: 1,000 units costing $428,000; 300 on hand. Weighted-average ending inventory?",
   "a": 128400,
   "unit": "$",
   "why": "300 × $428.",
   "video": "10.2"
  },
  {
   "type": "num",
   "q": "Beginning 100 at $10; purchases 200 at $11 and 100 at $13; 250 units sold. FIFO ending inventory?",
   "a": 1850,
   "unit": "$",
   "why": "100 at $13 + 50 at $11.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "Same data: periodic LIFO ending inventory?",
   "a": 1550,
   "unit": "$",
   "why": "100 at $10 + 50 at $11.",
   "video": "10.4"
  },
  {
   "type": "mcq",
   "q": "In a period of rising prices, which method reports the highest ending inventory?",
   "opts": [
    "LIFO",
    "Average cost",
    "FIFO",
    "All equal"
   ],
   "a": 2,
   "why": "Newest costs stay in inventory.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "LIFO COGS exceeds FIFO COGS by $40,000; tax rate 25%. Tax saved by LIFO?",
   "a": 10000,
   "unit": "$",
   "why": "40,000 × 25%.",
   "video": "10.4"
  },
  {
   "type": "num",
   "q": "FIFO inventory $750,000; LIFO inventory $610,000. LIFO reserve?",
   "a": 140000,
   "unit": "$",
   "why": "750 − 610.",
   "video": "10.5"
  },
  {
   "type": "mcq",
   "q": "A LIFO liquidation usually causes:",
   "opts": [
    "Lower income",
    "Higher income from old, low costs in COGS",
    "No change",
    "A loss"
   ],
   "a": 1,
   "why": "Old cheap layers flow to COGS.",
   "video": "10.5"
  },
  {
   "type": "match",
   "q": "Match each method to its feature.",
   "pairs": [
    [
     "FIFO",
     "Same result periodic or perpetual"
    ],
    [
     "LIFO",
     "Banned under IFRS"
    ],
    [
     "Specific identification",
     "Unique, high-value items"
    ],
    [
     "Average cost",
     "Smooths price changes"
    ]
   ],
   "why": "Key features.",
   "video": "10.6"
  }
 ],
 "11": [
  {
   "type": "num",
   "q": "Cost $250; selling price $280; costs to sell $45. Value per unit under LCNRV?",
   "a": 235,
   "unit": "$",
   "why": "NRV 235 < cost.",
   "video": "11.1"
  },
  {
   "type": "num",
   "q": "Cost $80; replacement $65; NRV $75; normal profit $15. LCM value?",
   "a": 65,
   "unit": "$",
   "why": "Floor 60, ceiling 75; replacement 65 is the middle.",
   "video": "11.2"
  },
  {
   "type": "num",
   "q": "Cost $80; replacement $55; NRV $75; normal profit $15. LCM value?",
   "a": 60,
   "unit": "$",
   "why": "Replacement below the floor of 60.",
   "video": "11.2"
  },
  {
   "type": "mcq",
   "q": "Under US GAAP, after inventory is written down and prices recover:",
   "opts": [
    "Write it back up to cost",
    "Write it up to market",
    "No write-up",
    "Reverse through OCI"
   ],
   "a": 2,
   "why": "IFRS allows reversal; GAAP doesn't.",
   "video": "11.1"
  },
  {
   "type": "num",
   "q": "Noncancelable commitment to buy materials for $200,000; market price at year-end $170,000. Loss to recognize?",
   "a": 30000,
   "unit": "$",
   "why": "Decline in value.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Goods available $1,000,000; sales $1,200,000; gross profit rate 30%. Estimated ending inventory?",
   "a": 160000,
   "unit": "$",
   "why": "COGS 840,000.",
   "video": "11.4"
  },
  {
   "type": "num",
   "q": "Goods available at cost $360,000 and retail $600,000 (after markups, before markdowns); ending inventory at retail $90,000. Ending inventory at cost (conventional)?",
   "a": 54000,
   "unit": "$",
   "why": "Ratio 60%.",
   "video": "11.5"
  },
  {
   "type": "num",
   "q": "COGS $2,520,000; average inventory $720,000. Inventory turnover?",
   "a": 3.5,
   "tol": 0.01,
   "unit": "times",
   "why": "2,520 ÷ 720.",
   "video": "11.6"
  }
 ],
 "12": [
  {
   "type": "num",
   "q": "Price $120,000; freight $3,000; installation $7,000; training $2,000. Capitalized cost?",
   "a": 130000,
   "unit": "$",
   "why": "Training expensed.",
   "video": "12.1"
  },
  {
   "type": "num",
   "q": "Land price $300,000; legal fees $6,000; demolition $20,000; salvage $4,000; parking lot $50,000. Cost of land?",
   "a": 322000,
   "unit": "$",
   "why": "Parking lot is a land improvement.",
   "video": "12.2"
  },
  {
   "type": "num",
   "q": "Expenditures: Jan 1 $400,000; Jul 1 $200,000. Weighted-average accumulated expenditures for the year?",
   "a": 500000,
   "unit": "$",
   "why": "400,000 + 100,000.",
   "video": "12.3"
  },
  {
   "type": "mcq",
   "q": "Capitalized interest is limited to:",
   "opts": [
    "Avoidable interest only",
    "The lower of avoidable and actual interest",
    "Actual interest only",
    "The construction loan's interest"
   ],
   "a": 1,
   "why": "Never more than actual interest.",
   "video": "12.3"
  },
  {
   "type": "num",
   "q": "A $1,000,000 lump-sum purchase: land FV $500,000, building FV $750,000. Cost of land?",
   "a": 400000,
   "unit": "$",
   "why": "40% of 1,000,000.",
   "video": "12.4"
  },
  {
   "type": "num",
   "q": "Old asset book value $8,000, fair value $11,000, plus $25,000 cash; commercial substance. Gain recognized?",
   "a": 3000,
   "unit": "$",
   "why": "11,000 − 8,000.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "Same exchange without commercial substance. Cost of the new asset?",
   "a": 33000,
   "unit": "$",
   "why": "Book value 8,000 + cash 25,000.",
   "video": "12.5"
  },
  {
   "type": "sort",
   "q": "Sort each cost: capitalize or expense?",
   "cats": [
    "Capitalize",
    "Expense"
   ],
   "items": [
    [
     "New warehouse wing",
     0
    ],
    [
     "Routine oil changes",
     1
    ],
    [
     "Roof replacement extending life",
     0
    ],
    [
     "Repainting offices",
     1
    ]
   ],
   "why": "Future benefit test.",
   "video": "12.6"
  }
 ],
 "13": [
  {
   "type": "num",
   "q": "Cost $150,000; salvage $10,000; 70,000 hours estimated; 12,000 hours used. Activity depreciation?",
   "a": 24000,
   "unit": "$",
   "why": "$2 × 12,000.",
   "video": "13.2"
  },
  {
   "type": "num",
   "q": "Cost $150,000; salvage $10,000; 7-year life. Straight-line depreciation?",
   "a": 20000,
   "unit": "$",
   "why": "140,000 ÷ 7.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "Cost $150,000; salvage $10,000; 4-year life. SYD depreciation in year 2?",
   "a": 42000,
   "unit": "$",
   "why": "3/10 × 140,000.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "Cost $150,000; 5-year life; DDB. Year 2 depreciation?",
   "a": 36000,
   "unit": "$",
   "why": "40% × 90,000.",
   "video": "13.4"
  },
  {
   "type": "mcq",
   "q": "Under declining-balance methods, salvage value:",
   "opts": [
    "Is subtracted before applying the rate",
    "Is ignored entirely",
    "Isn't subtracted, but book value can't fall below it",
    "Is depreciated first"
   ],
   "a": 2,
   "why": "Salvage is a floor.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Annual SL depreciation $36,000; asset bought March 1 (calendar year). First-year depreciation?",
   "a": 30000,
   "unit": "$",
   "why": "10 months.",
   "video": "13.5"
  },
  {
   "type": "num",
   "q": "Book value $175,000; new salvage $15,000; 5 years remaining. New annual depreciation?",
   "a": 32000,
   "unit": "$",
   "why": "160,000 ÷ 5.",
   "video": "13.6"
  },
  {
   "type": "mcq",
   "q": "A change in an asset's useful life is accounted for:",
   "opts": [
    "Retrospectively",
    "Prospectively",
    "As a prior period adjustment",
    "In OCI"
   ],
   "a": 1,
   "why": "Change in estimate.",
   "video": "13.6"
  }
 ],
 "14": [
  {
   "type": "num",
   "q": "Carrying amount $400,000; undiscounted cash flows $350,000; fair value $310,000. Impairment loss?",
   "a": 90000,
   "unit": "$",
   "why": "Fails recoverability; 400 − 310.",
   "video": "14.1"
  },
  {
   "type": "mcq",
   "q": "Under US GAAP, an impairment loss on an asset held for use:",
   "opts": [
    "Can be reversed if value recovers",
    "Cannot be reversed",
    "Goes to OCI",
    "Is amortized"
   ],
   "a": 1,
   "why": "New cost basis.",
   "video": "14.1"
  },
  {
   "type": "num",
   "q": "Held for sale: carrying amount $60,000; fair value $58,000; costs to sell $5,000. Reported amount?",
   "a": 53000,
   "unit": "$",
   "why": "Lower of 60,000 and 53,000.",
   "video": "14.2"
  },
  {
   "type": "num",
   "q": "Depletion base $800,000; 400,000 board feet estimated; 50,000 harvested. Depletion?",
   "a": 100000,
   "unit": "$",
   "why": "$2 × 50,000.",
   "video": "14.3"
  },
  {
   "type": "num",
   "q": "Cost $40,000; AD at Jan 1 $25,000; annual depreciation $6,000; sold April 1 for $15,000. Gain on disposal?",
   "a": 1500,
   "unit": "$",
   "why": "BV 13,500.",
   "video": "14.4"
  },
  {
   "type": "mcq",
   "q": "A gain on an involuntary conversion is reported:",
   "opts": [
    "As an extraordinary item",
    "In continuing operations",
    "In OCI",
    "As a prior period adjustment"
   ],
   "a": 1,
   "why": "No extraordinary items.",
   "video": "14.4"
  },
  {
   "type": "num",
   "q": "Net income $300,000; average total assets $2,500,000. Return on assets in percent?",
   "a": 12,
   "tol": 0.05,
   "unit": "%",
   "why": "300 ÷ 2,500.",
   "video": "14.5"
  },
  {
   "type": "sort",
   "q": "Sort each topic into the part of the course where it belongs.",
   "cats": [
    "Foundations",
    "Time value of money",
    "Assets"
   ],
   "items": [
    [
     "Conceptual framework",
     0
    ],
    [
     "Annuity due",
     1
    ],
    [
     "CECL",
     2
    ],
    [
     "Discontinued operations",
     0
    ],
    [
     "Bond pricing",
     1
    ],
    [
     "LIFO reserve",
     2
    ]
   ],
   "why": "The course's structure.",
   "video": "14.6"
  }
 ]
};

  /* ---------- helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function shuffle(a, seed) {
    var r = a.slice(), s = seed || 7;
    for (var i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function store(key, val) {
    try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; }
  }
  var LABEL = { mcq: "Choose one", match: "Match", order: "Put in order", sort: "Sort", num: "Calculate", journal: "Journal entry" };

  /* ---------- the hub page: show completion per lecture ---------- */
  window.ACCTProgress = function () {
    var links = document.querySelectorAll("[data-acct-lecture]");
    for (var i = 0; i < links.length; i++) {
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct416-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct416-" + n, state = store(key) || { done: [] }, cur = 0;
    root.innerHTML = "";
    var nav = el("div", "ex-nav"); nav.setAttribute("role", "tablist"); nav.setAttribute("aria-label", "Exercises");
    var progress = el("p", "ex-progress");
    var body = el("div", "ex-body");
    root.appendChild(nav); root.appendChild(progress); root.appendChild(body);

    function save() { store(key, state); }
    function isDone(i) { return state.done.indexOf(i) >= 0; }
    function markDone(i) { if (!isDone(i)) { state.done.push(i); save(); } drawNav(); }

    function drawNav() {
      nav.innerHTML = "";
      items.forEach(function (_, i) {
        var b = el("button", "ex-chip" + (isDone(i) ? " done" : ""), String(i + 1));
        b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i === cur ? "true" : "false");
        b.setAttribute("aria-label", "Exercise " + (i + 1) + (isDone(i) ? ", completed" : ""));
        b.onclick = function () { cur = i; draw(); };
        nav.appendChild(b);
      });
      progress.textContent = state.done.length === items.length
        ? "All " + items.length + " exercises complete. Well done."
        : state.done.length + " of " + items.length + " complete.";
    }

    function draw() {
      drawNav();
      var it = items[cur]; body.innerHTML = "";
      body.appendChild(el("p", "ex-kind", LABEL[it.type] + " · Exercise " + (cur + 1) + " of " + items.length));
      body.appendChild(el("p", "ex-q", it.q));
      var area = el("div", "ex-area"), fb = el("div", "ex-feedback");
      fb.setAttribute("aria-live", "polite");
      var getAnswer = build(it, area);
      body.appendChild(area);
      var actions = el("div", "ex-actions");
      var check = el("button", "ex-btn", "Check answer"); check.type = "button";
      var reveal = el("button", "ex-btn ghost", "Show answer"); reveal.type = "button"; reveal.hidden = true;
      var next = el("button", "ex-btn ghost", cur < items.length - 1 ? "Next exercise" : "Back to the first"); next.type = "button";
      actions.appendChild(check); actions.appendChild(reveal); actions.appendChild(next);
      body.appendChild(actions); body.appendChild(fb);

      check.onclick = function () {
        var res = getAnswer.check();
        fb.innerHTML = "";
        if (res.ok) {
          fb.className = "ex-feedback ok";
          fb.appendChild(el("p", "ex-msg", "Correct."));
          fb.appendChild(el("p", "ex-why", it.why));
          markDone(cur);
        } else {
          fb.className = "ex-feedback";
          fb.appendChild(el("p", "ex-msg", res.msg || "Not quite. Have another look."));
          if (it.video) {
            var v = el("p", "ex-video"); v.appendChild(document.createTextNode("Hint: rewatch "));
            var a = el("a", null, "video " + it.video); a.href = "#video-" + it.video.replace(".", "-"); v.appendChild(a); v.appendChild(document.createTextNode("."));
            fb.appendChild(v);
          }
          reveal.hidden = false;
        }
      };
      reveal.onclick = function () {
        getAnswer.show();
        fb.className = "ex-feedback";
        fb.innerHTML = "";
        fb.appendChild(el("p", "ex-msg", "Here is the answer. Try the next one, then come back to this one later."));
        fb.appendChild(el("p", "ex-why", it.why));
        reveal.hidden = true;
      };
      next.onclick = function () { cur = (cur + 1) % items.length; draw(); body.scrollIntoView({ block: "nearest" }); };
    }

    function build(it, area) {
      var seed = Number(n) * 31 + cur;
      if (it.type === "mcq") {
        var name = "ex-" + n + "-" + cur, list = el("div", "ex-options");
        it.opts.forEach(function (o, i) {
          var lab = el("label", "ex-opt"), r = document.createElement("input");
          r.type = "radio"; r.name = name; r.value = i;
          lab.appendChild(r); lab.appendChild(el("span", null, o)); list.appendChild(lab);
        });
        area.appendChild(list);
        return {
          check: function () {
            var sel = list.querySelector("input:checked");
            if (!sel) return { ok: false, msg: "Choose an answer first." };
            return { ok: Number(sel.value) === it.a };
          },
          show: function () { list.querySelectorAll("input")[it.a].checked = true; }
        };
      }
      if (it.type === "match" || it.type === "sort") {
        var rows = it.type === "match" ? it.pairs.map(function (p) { return [p[0], p[1]]; })
                                       : it.items.map(function (p) { return [p[0], it.cats[p[1]]]; });
        var choices = it.type === "match" ? shuffle(it.pairs.map(function (p) { return p[1]; }), seed) : it.cats;
        var order = shuffle(rows.map(function (_, i) { return i; }), seed + 3);
        var table = el("div", "ex-pairs"), selects = [];
        order.forEach(function (ri) {
          var row = el("div", "ex-pair"), lab = el("span", "ex-left", rows[ri][0]);
          var s = document.createElement("select"); s.setAttribute("aria-label", rows[ri][0]);
          var blank = el("option", null, it.type === "match" ? "Choose…" : "Choose a category…"); blank.value = ""; s.appendChild(blank);
          choices.forEach(function (c) { var o = el("option", null, c); o.value = c; s.appendChild(o); });
          row.appendChild(lab); row.appendChild(s); table.appendChild(row); selects.push([s, rows[ri][1], row]);
        });
        area.appendChild(table);
        return {
          check: function () {
            var right = 0, blank = 0;
            selects.forEach(function (x) { x[2].classList.remove("wrong"); if (!x[0].value) blank++; else if (x[0].value === x[1]) right++; else x[2].classList.add("wrong"); });
            if (blank) return { ok: false, msg: "Answer every row first (" + blank + " left)." };
            return right === selects.length ? { ok: true } : { ok: false, msg: right + " of " + selects.length + " right. The rows marked need another look." };
          },
          show: function () { selects.forEach(function (x) { x[0].value = x[1]; x[2].classList.remove("wrong"); }); }
        };
      }
      if (it.type === "order") {
        var cur2 = shuffle(it.items.map(function (_, i) { return i; }), seed);
        if (cur2.every(function (v, i) { return v === i; })) cur2.reverse();
        var ol = el("ol", "ex-order");
        function drawOrder() {
          ol.innerHTML = "";
          cur2.forEach(function (ix, pos) {
            var li = el("li", "ex-step"); li.appendChild(el("span", "ex-step-text", it.items[ix]));
            var up = el("button", "ex-move", "↑"); up.type = "button"; up.setAttribute("aria-label", "Move up: " + it.items[ix]); up.disabled = pos === 0;
            var dn = el("button", "ex-move", "↓"); dn.type = "button"; dn.setAttribute("aria-label", "Move down: " + it.items[ix]); dn.disabled = pos === cur2.length - 1;
            up.onclick = function () { var t = cur2[pos - 1]; cur2[pos - 1] = cur2[pos]; cur2[pos] = t; drawOrder(); ol.querySelectorAll(".ex-move")[(pos - 1) * 2].focus(); };
            dn.onclick = function () { var t = cur2[pos + 1]; cur2[pos + 1] = cur2[pos]; cur2[pos] = t; drawOrder(); ol.querySelectorAll(".ex-move")[(pos + 1) * 2 + 1].focus(); };
            var btns = el("span", "ex-moves"); btns.appendChild(up); btns.appendChild(dn); li.appendChild(btns); ol.appendChild(li);
          });
        }
        drawOrder(); area.appendChild(ol);
        area.appendChild(el("p", "ex-tip", "Use the arrows to move each step up or down."));
        return {
          check: function () {
            var right = cur2.filter(function (v, i) { return v === i; }).length;
            return right === cur2.length ? { ok: true } : { ok: false, msg: right + " of " + cur2.length + " steps are in the right place." };
          },
          show: function () { cur2 = it.items.map(function (_, i) { return i; }); drawOrder(); }
        };
      }
      if (it.type === "journal") {
        var pool = (POOL[n] || []).slice();
        it.lines.forEach(function (l) { if (pool.indexOf(l[0]) < 0) pool.push(l[0]); });
        pool.sort();
        var je = el("div", "ex-je"), rowsJ = [];
        var head = el("div", "ex-je-row ex-je-head");
        head.appendChild(el("span", null, "Account")); head.appendChild(el("span", null, "Debit")); head.appendChild(el("span", null, "Credit"));
        je.appendChild(head);
        it.lines.forEach(function (_, i) {
          var row = el("div", "ex-je-row");
          var s = document.createElement("select"); s.setAttribute("aria-label", "Account, line " + (i + 1));
          var b0 = el("option", null, "Choose an account…"); b0.value = ""; s.appendChild(b0);
          pool.forEach(function (a) { var o = el("option", null, a); o.value = a; s.appendChild(o); });
          var dr = document.createElement("input"), cr = document.createElement("input");
          [dr, cr].forEach(function (x, k) { x.type = "text"; x.inputMode = "decimal"; x.setAttribute("aria-label", (k ? "Credit" : "Debit") + ", line " + (i + 1)); });
          row.appendChild(s); row.appendChild(dr); row.appendChild(cr); je.appendChild(row); rowsJ.push([s, dr, cr, row]);
        });
        area.appendChild(je);
        area.appendChild(el("p", "ex-tip", "Choose an account for each line and enter its amount in the debit or credit column. Lines can be in any order."));
        function num(v) { v = String(v).replace(/[$,\s]/g, ""); return v === "" ? null : parseFloat(v); }
        return {
          check: function () {
            var got = [], td = 0, tc = 0, bad = false;
            rowsJ.forEach(function (r) {
              r[3].classList.remove("wrong");
              var d = num(r[1].value), c = num(r[2].value);
              if (!r[0].value || (d === null && c === null) || (d !== null && c !== null) || (d !== null && isNaN(d)) || (c !== null && isNaN(c))) bad = true;
              got.push({ a: r[0].value, side: d !== null ? 0 : 1, v: d !== null ? d : c, row: r[3] });
              td += d || 0; tc += c || 0;
            });
            if (bad) return { ok: false, msg: "Fill every line: an account and one amount, in either the debit or the credit column." };
            if (Math.abs(td - tc) > 0.005) return { ok: false, msg: "Debits (" + td.toLocaleString("en-US") + ") don't equal credits (" + tc.toLocaleString("en-US") + ")." };
            var used = [], right = 0;
            it.lines.forEach(function (l) {
              var side = l[1] ? 0 : 1, amt = l[1] || l[2];
              for (var i = 0; i < got.length; i++) {
                if (used.indexOf(i) < 0 && got[i].a === l[0] && got[i].side === side && Math.abs(got[i].v - amt) < 0.005) { used.push(i); right++; break; }
              }
            });
            got.forEach(function (g, i) { if (used.indexOf(i) < 0) g.row.classList.add("wrong"); });
            return right === it.lines.length ? { ok: true } : { ok: false, msg: right + " of " + it.lines.length + " lines are right. The lines marked need another look: check the account, the side and the amount." };
          },
          show: function () {
            it.lines.forEach(function (l, i) {
              var r = rowsJ[i]; r[3].classList.remove("wrong"); r[0].value = l[0];
              var fmt = function (v) { return v ? v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0 }) : ""; };
              r[1].value = fmt(l[1]); r[2].value = fmt(l[2]);
            });
          }
        };
      }
      if (it.type === "num") {
        var wrap = el("div", "ex-num"), unit = el("span", "ex-unit", it.unit || "");
        var inp = document.createElement("input"); inp.type = "text"; inp.inputMode = "decimal"; inp.setAttribute("aria-label", "Your answer");
        if (it.unit) wrap.appendChild(unit); wrap.appendChild(inp); area.appendChild(wrap);
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { var b = area.parentNode.querySelector(".ex-btn"); if (b) b.click(); } });
        return {
          check: function () {
            var v = parseFloat(String(inp.value).replace(/[$,\s]/g, ""));
            if (isNaN(v)) return { ok: false, msg: "Enter a number first." };
            return { ok: Math.abs(v - it.a) <= (it.tol || 0.5) };
          },
          show: function () { inp.value = it.a.toLocaleString("en-US", { minimumFractionDigits: it.a % 1 ? 2 : 0 }); }
        };
      }
    }

    var reset = el("button", "ex-link", "Reset my progress"); reset.type = "button";
    reset.onclick = function () { state = { done: [] }; save(); cur = 0; draw(); };
    root.appendChild(reset);
    draw();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("acct-ex");
    if (root) mount(root);
    if (document.querySelector("[data-acct-lecture]")) window.ACCTProgress();
  });
})();
