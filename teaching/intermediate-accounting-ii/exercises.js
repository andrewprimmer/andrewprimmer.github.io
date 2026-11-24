/* End-of-lecture exercises for ACCT 312 Intermediate Accounting II.
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
   "type": "mcq",
   "q": "An internally developed brand's advertising costs are:",
   "opts": [
    "Capitalized as a trademark",
    "Expensed as incurred",
    "Recorded as goodwill",
    "Amortized over 15 years"
   ],
   "a": 1,
   "why": "Internally created intangibles are mostly expensed.",
   "video": "1.1"
  },
  {
   "type": "num",
   "q": "Patent cost $120,000; legal life 15 years; useful life 8 years. Annual amortization?",
   "a": 15000,
   "unit": "$",
   "why": "120,000 ÷ 8.",
   "video": "1.2"
  },
  {
   "type": "match",
   "q": "Match each intangible to its type.",
   "pairs": [
    [
     "Trademark",
     "Marketing-related"
    ],
    [
     "Customer list",
     "Customer-related"
    ],
    [
     "Copyright",
     "Artistic-related"
    ],
    [
     "Franchise",
     "Contract-related"
    ]
   ],
   "why": "Categories.",
   "video": "1.2"
  },
  {
   "type": "num",
   "q": "R&D: salaries $150,000; materials $40,000; depreciation on lab equipment with other uses $10,000 (equipment cost $50,000). R&D expense?",
   "a": 200000,
   "unit": "$",
   "why": "Only depreciation on the equipment.",
   "video": "1.3"
  },
  {
   "type": "num",
   "q": "Price $3,000,000; identifiable assets at fair value $2,800,000; liabilities $500,000. Goodwill?",
   "a": 700000,
   "unit": "$",
   "why": "3,000 − 2,300.",
   "video": "1.4"
  },
  {
   "type": "num",
   "q": "Reporting unit carrying amount $5,000,000 including goodwill $400,000; fair value $4,800,000. Goodwill impairment?",
   "a": 200000,
   "unit": "$",
   "why": "Excess up to goodwill.",
   "video": "1.5"
  },
  {
   "type": "mcq",
   "q": "An indefinite-life trademark is:",
   "opts": [
    "Amortized over 40 years",
    "Not amortized; tested for impairment at least annually",
    "Expensed immediately",
    "Amortized over 10 years"
   ],
   "a": 1,
   "why": "No amortization.",
   "video": "1.1"
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
     "Purchased patent",
     0
    ],
    [
     "Pre-opening costs",
     1
    ],
    [
     "Purchased customer list",
     0
    ],
    [
     "Organization costs",
     1
    ],
    [
     "Successful patent defense",
     0
    ],
    [
     "Advertising",
     1
    ]
   ],
   "why": "Bought rights vs start-up costs.",
   "video": "1.6"
  }
 ],
 "2": [
  {
   "type": "num",
   "q": "A $60,000, 9%, 6-month note was signed September 1. Accrued interest at December 31?",
   "a": 1800,
   "unit": "$",
   "why": "60,000 × 9% × 4/12.",
   "video": "2.1"
  },
  {
   "type": "num",
   "q": "Gift cards sold $80,000; redeemed $55,000. Unearned revenue (ignoring breakage)?",
   "a": 25000,
   "unit": "$",
   "why": "80 − 55.",
   "video": "2.2"
  },
  {
   "type": "num",
   "q": "Total receipts of $31,800 include 6% sales tax. Sales revenue?",
   "a": 30000,
   "unit": "$",
   "why": "31,800 ÷ 1.06.",
   "video": "2.3"
  },
  {
   "type": "num",
   "q": "Gross pay $40,000; FICA 7.65%; income tax withheld $6,000. Net pay?",
   "a": 30940,
   "unit": "$",
   "why": "40,000 − 3,060 − 6,000.",
   "video": "2.3"
  },
  {
   "type": "sort",
   "q": "Sort each loss contingency by treatment.",
   "cats": [
    "Accrue",
    "Disclose only",
    "No action"
   ],
   "items": [
    [
     "Probable and estimable",
     0
    ],
    [
     "Reasonably possible",
     1
    ],
    [
     "Remote",
     2
    ],
    [
     "Probable, not estimable",
     1
    ]
   ],
   "why": "Probability and estimability.",
   "video": "2.4"
  },
  {
   "type": "num",
   "q": "Probable loss with a range of $100,000 to $250,000 and no best estimate. Amount accrued?",
   "a": 100000,
   "unit": "$",
   "why": "Accrue the minimum.",
   "video": "2.4"
  },
  {
   "type": "num",
   "q": "Units sold 5,000; warranty cost $15 per unit; repairs $28,000; beginning liability $0. Ending warranty liability?",
   "a": 47000,
   "unit": "$",
   "why": "75,000 − 28,000.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "ARO of $60,000 in 10 years at 6% (factor 0.55839). Initial liability?",
   "a": 33503,
   "tol": 2,
   "unit": "$",
   "why": "60,000 × 0.55839.",
   "video": "2.6"
  }
 ],
 "3": [
  {
   "type": "mcq",
   "q": "Bonds that mature in installments are:",
   "opts": [
    "Term bonds",
    "Serial bonds",
    "Debentures",
    "Callable bonds"
   ],
   "a": 1,
   "why": "Serial maturities.",
   "video": "3.1"
  },
  {
   "type": "num",
   "q": "$1,000,000 of 10-year, 5% bonds paying semiannually; market 6% (20 periods at 3%: PV of 1 0.55368; PVA 14.87747). Price?",
   "a": 925617,
   "tol": 3,
   "unit": "$",
   "why": "553,680 + 25,000 × 14.87747.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "$600,000 of 8% bonds (interest Jan 1, Jul 1) sold at par on March 1. Accrued interest collected?",
   "a": 8000,
   "unit": "$",
   "why": "600,000 × 8% × 2/12.",
   "video": "3.3"
  },
  {
   "type": "num",
   "q": "Carrying amount $1,837,774; market rate 4% per period; cash $60,000. Discount amortized?",
   "a": 13511,
   "tol": 1,
   "unit": "$",
   "why": "73,511 − 60,000.",
   "video": "3.4"
  },
  {
   "type": "num",
   "q": "Carrying amount $2,087,524; market rate 2.5% per period; cash $60,000. Interest expense?",
   "a": 52188,
   "tol": 1,
   "unit": "$",
   "why": "2,087,524 × 2.5%.",
   "video": "3.5"
  },
  {
   "type": "mcq",
   "q": "Over the life of a bond issued at a discount, total interest expense equals:",
   "opts": [
    "Cash interest",
    "Cash interest plus the discount",
    "Cash interest minus the discount",
    "Face value"
   ],
   "a": 1,
   "why": "The discount is extra interest.",
   "video": "3.4"
  },
  {
   "type": "num",
   "q": "Bonds with face $500,000 issued at 97 with $6,000 of issuance costs. Initial carrying amount?",
   "a": 479000,
   "unit": "$",
   "why": "485,000 − 6,000.",
   "video": "3.6"
  },
  {
   "type": "order",
   "q": "Put the steps for recording a bond interest payment in order.",
   "items": [
    "Multiply carrying amount by market rate",
    "Compute cash: face × stated rate",
    "Take the difference as amortization",
    "Adjust the carrying amount"
   ],
   "why": "Effective-interest method.",
   "video": "3.4"
  }
 ],
 "4": [
  {
   "type": "num",
   "q": "Land bought for a $200,000 zero-interest note due in 3 years; imputed rate 8% (factor 0.79383). Land cost?",
   "a": 158766,
   "tol": 1,
   "unit": "$",
   "why": "200,000 × 0.79383.",
   "video": "4.1"
  },
  {
   "type": "num",
   "q": "That note's year-1 interest expense?",
   "a": 12701,
   "tol": 2,
   "unit": "$",
   "why": "158,766 × 8%.",
   "video": "4.1"
  },
  {
   "type": "num",
   "q": "Bonds: carrying amount $1,940,000; called at 101 on face $2,000,000. Loss on extinguishment?",
   "a": 80000,
   "unit": "$",
   "why": "2,020,000 − 1,940,000.",
   "video": "4.2"
  },
  {
   "type": "mcq",
   "q": "A loss on early extinguishment of debt is reported:",
   "opts": [
    "As an extraordinary item",
    "In income from continuing operations",
    "In OCI",
    "In retained earnings"
   ],
   "a": 1,
   "why": "No extraordinary items.",
   "video": "4.2"
  },
  {
   "type": "mcq",
   "q": "The fair value option for a liability is:",
   "opts": [
    "Required for all bonds",
    "An irrevocable election instrument by instrument",
    "Changeable each year",
    "Only for private companies"
   ],
   "a": 1,
   "why": "Elected at inception.",
   "video": "4.3"
  },
  {
   "type": "num",
   "q": "Debt $300,000 settled with land worth $240,000 (book value $180,000). Total gains recognized by the debtor?",
   "a": 120000,
   "unit": "$",
   "why": "60,000 settlement + 60,000 disposal.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "Income before tax $1,000,000; interest expense $250,000. Times interest earned?",
   "a": 5,
   "tol": 0.01,
   "unit": "times",
   "why": "1,250,000 ÷ 250,000.",
   "video": "4.6"
  },
  {
   "type": "mcq",
   "q": "Which is NOT a required long-term debt disclosure?",
   "opts": [
    "Maturities for the next 5 years",
    "Assets pledged as collateral",
    "Fair value of the debt",
    "Names of all bondholders"
   ],
   "a": 3,
   "why": "Bondholders aren't listed.",
   "video": "4.6"
  }
 ],
 "5": [
  {
   "type": "num",
   "q": "Issued 700,000; treasury 25,000. Outstanding?",
   "a": 675000,
   "unit": "shares",
   "why": "Issued − treasury.",
   "video": "5.1"
  },
  {
   "type": "num",
   "q": "50,000 shares, $2 par, issued at $18, with $40,000 of issuance costs. Paid-in capital in excess of par?",
   "a": 760000,
   "unit": "$",
   "why": "50,000 × 16 − 40,000.",
   "video": "5.2"
  },
  {
   "type": "num",
   "q": "Lump sum $90,000 for common (FV $60,000) and preferred (FV $40,000). Amount allocated to preferred?",
   "a": 36000,
   "unit": "$",
   "why": "90,000 × 40%.",
   "video": "5.3"
  },
  {
   "type": "num",
   "q": "Treasury shares bought at $25; 2,000 reissued at $29. Credit to paid-in capital from treasury stock?",
   "a": 8000,
   "unit": "$",
   "why": "2,000 × $4.",
   "video": "5.4"
  },
  {
   "type": "mcq",
   "q": "Treasury stock is reported as:",
   "opts": [
    "A current asset",
    "A long-term investment",
    "A deduction from stockholders' equity",
    "A liability"
   ],
   "a": 2,
   "why": "Contra equity.",
   "video": "5.4"
  },
  {
   "type": "num",
   "q": "Retire 1,000 treasury shares costing $30 each, originally issued at $22 ($1 par). Debit to retained earnings?",
   "a": 8000,
   "unit": "$",
   "why": "(30 − 22) × 1,000.",
   "video": "5.5"
  },
  {
   "type": "num",
   "q": "Net income $720,000; average common equity $6,000,000. ROE in percent?",
   "a": 12,
   "tol": 0.05,
   "unit": "%",
   "why": "720 ÷ 6,000.",
   "video": "5.6"
  },
  {
   "type": "sort",
   "q": "Sort each account: contributed capital or earned capital?",
   "cats": [
    "Contributed capital",
    "Earned capital"
   ],
   "items": [
    [
     "Common stock",
     0
    ],
    [
     "Paid-in capital in excess of par",
     0
    ],
    [
     "Retained earnings",
     1
    ],
    [
     "Paid-in capital from treasury stock",
     0
    ]
   ],
   "why": "Sources of equity.",
   "video": "5.1"
  }
 ],
 "6": [
  {
   "type": "mcq",
   "q": "Missed dividends on cumulative preferred are:",
   "opts": [
    "A liability",
    "Disclosed in the notes",
    "Lost",
    "Expensed"
   ],
   "a": 1,
   "why": "Not a liability until declared.",
   "video": "6.3"
  },
  {
   "type": "num",
   "q": "Dividend of $0.30 per share declared on 400,000 shares. Dividends payable?",
   "a": 120000,
   "unit": "$",
   "why": "400,000 × 0.30.",
   "video": "6.2"
  },
  {
   "type": "num",
   "q": "7% cumulative preferred, $300,000 par, one year in arrears. Total dividends $80,000. Amount to common?",
   "a": 38000,
   "unit": "$",
   "why": "Preferred 42,000.",
   "video": "6.3"
  },
  {
   "type": "num",
   "q": "Investment carried at $40,000 with fair value $52,000 is distributed as a dividend. Gain recognized?",
   "a": 12000,
   "unit": "$",
   "why": "Remeasure to fair value.",
   "video": "6.4"
  },
  {
   "type": "num",
   "q": "10% stock dividend on 200,000 shares ($1 par, market $25). Amount transferred from retained earnings?",
   "a": 500000,
   "unit": "$",
   "why": "20,000 × $25.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "40% stock dividend on 200,000 shares ($1 par, market $25). Amount transferred from retained earnings?",
   "a": 80000,
   "unit": "$",
   "why": "Large: par value only.",
   "video": "6.5"
  },
  {
   "type": "sort",
   "q": "Does each transaction change total stockholders' equity?",
   "cats": [
    "Changes total equity",
    "No change"
   ],
   "items": [
    [
     "Cash dividend declared",
     0
    ],
    [
     "Stock split",
     1
    ],
    [
     "Small stock dividend",
     1
    ],
    [
     "Property dividend declared",
     0
    ]
   ],
   "why": "Stock dividends and splits rearrange equity.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "Net income $800,000; preferred dividends $40,000; common dividends $190,000. Payout ratio in percent?",
   "a": 25,
   "tol": 0.1,
   "unit": "%",
   "why": "190 ÷ 760.",
   "video": "6.6"
  }
 ],
 "7": [
  {
   "type": "num",
   "q": "Convertible bonds carried at $600,000 convert into 25,000 shares of $2 par. Credit to paid-in capital in excess of par?",
   "a": 550000,
   "unit": "$",
   "why": "600,000 − 50,000.",
   "video": "7.1"
  },
  {
   "type": "num",
   "q": "Bonds with detachable warrants issued for $1,000,000; FV of bonds alone $940,000; FV of warrants $60,000. Amount allocated to warrants?",
   "a": 60000,
   "unit": "$",
   "why": "Relative fair value (totals equal).",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "Bonds with warrants issued for $990,000; FV bonds $900,000; FV warrants $200,000. Amount allocated to warrants?",
   "a": 180000,
   "unit": "$",
   "why": "990,000 × 200/1,100.",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "40,000 options with fair value $6 each, 4-year service. Annual compensation expense?",
   "a": 60000,
   "unit": "$",
   "why": "240,000 ÷ 4.",
   "video": "7.3"
  },
  {
   "type": "mcq",
   "q": "Employee stock options are measured at:",
   "opts": [
    "Intrinsic value at exercise",
    "Fair value at grant date",
    "Fair value each year-end",
    "Zero if at the money"
   ],
   "a": 1,
   "why": "Grant-date fair value.",
   "video": "7.3"
  },
  {
   "type": "num",
   "q": "Exercise of 10,000 options at $20 (par $1); PIC-stock options balance $50,000. Credit to paid-in capital in excess of par?",
   "a": 240000,
   "unit": "$",
   "why": "200,000 + 50,000 − 10,000.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "5,000 restricted stock units at $30, vesting over 5 years. Annual expense?",
   "a": 30000,
   "unit": "$",
   "why": "150,000 ÷ 5.",
   "video": "7.5"
  },
  {
   "type": "mcq",
   "q": "Cash-settled stock appreciation rights are reported as:",
   "opts": [
    "Equity, not remeasured",
    "A liability remeasured each period",
    "Treasury stock",
    "Not recorded"
   ],
   "a": 1,
   "why": "Cash settlement creates a liability.",
   "video": "7.5"
  }
 ],
 "8": [
  {
   "type": "num",
   "q": "Jan 1: 200,000 shares; May 1: issued 30,000; Nov 1: bought back 12,000. Weighted average shares?",
   "a": 218000,
   "unit": "shares",
   "why": "200,000 + 20,000 − 2,000.",
   "video": "8.2"
  },
  {
   "type": "num",
   "q": "Jan 1: 100,000 shares; Jul 1: issued 20,000; Oct 1: 3-for-1 split. Weighted average?",
   "a": 330000,
   "unit": "shares",
   "why": "(100,000 + 10,000) × 3.",
   "video": "8.2"
  },
  {
   "type": "num",
   "q": "Net income $500,000; 6% cumulative preferred $200,000 par (not declared); 160,000 weighted shares. Basic EPS?",
   "a": 3.05,
   "tol": 0.005,
   "unit": "$",
   "why": "488,000 ÷ 160,000.",
   "video": "8.3"
  },
  {
   "type": "num",
   "q": "5% convertible bonds of $800,000 convert into 40,000 shares; tax 25%. After-tax interest added back?",
   "a": 30000,
   "unit": "$",
   "why": "40,000 × 75%.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "20,000 options at $15; average market price $25. Incremental shares?",
   "a": 8000,
   "unit": "shares",
   "why": "300,000 ÷ 25 = 12,000 repurchased.",
   "video": "8.5"
  },
  {
   "type": "mcq",
   "q": "Options with an exercise price above the average market price are:",
   "opts": [
    "Dilutive",
    "Antidilutive and excluded",
    "Included at full shares",
    "Subtracted from basic EPS"
   ],
   "a": 1,
   "why": "Out of the money.",
   "video": "8.5"
  },
  {
   "type": "num",
   "q": "Income available to common $1,000,000; weighted shares 400,000; options add 10,000 shares; bonds add $50,000 of after-tax income and 40,000 shares. Diluted EPS?",
   "a": 2.33,
   "tol": 0.005,
   "unit": "$",
   "why": "1,050,000 ÷ 450,000.",
   "video": "8.5"
  },
  {
   "type": "mcq",
   "q": "With a loss from continuing operations, diluted EPS:",
   "opts": [
    "Includes all potential shares",
    "Equals basic EPS",
    "Is always higher",
    "Isn't reported"
   ],
   "a": 1,
   "why": "All potential shares are antidilutive.",
   "video": "8.6"
  }
 ],
 "9": [
  {
   "type": "match",
   "q": "Match each category to where unrealized holding gains are reported.",
   "pairs": [
    [
     "Held-to-maturity",
     "Not recognized"
    ],
    [
     "Available-for-sale",
     "Other comprehensive income"
    ],
    [
     "Trading",
     "Net income"
    ]
   ],
   "why": "Three categories.",
   "video": "9.1"
  },
  {
   "type": "num",
   "q": "HTM bond carrying amount $459,444; market rate 4% per period; cash $15,000. Discount amortized?",
   "a": 3378,
   "tol": 1,
   "unit": "$",
   "why": "18,378 − 15,000.",
   "video": "9.2"
  },
  {
   "type": "num",
   "q": "AFS: amortized cost $320,000; fair value $331,000. Unrealized gain in OCI (no prior adjustment)?",
   "a": 11000,
   "unit": "$",
   "why": "331 − 320.",
   "video": "9.3"
  },
  {
   "type": "num",
   "q": "Trading: cost $150,000; fair value $141,000. Unrealized loss in net income?",
   "a": 9000,
   "unit": "$",
   "why": "150 − 141.",
   "video": "9.4"
  },
  {
   "type": "num",
   "q": "AFS bonds with amortized cost $250,000 (AOCI gain $6,000) sold for $258,000. Realized gain in net income?",
   "a": 8000,
   "unit": "$",
   "why": "258 − 250.",
   "video": "9.5"
  },
  {
   "type": "mcq",
   "q": "A decline in an AFS bond's fair value caused by expected issuer default is reported:",
   "opts": [
    "In OCI",
    "In net income through an allowance",
    "Not reported",
    "In retained earnings"
   ],
   "a": 1,
   "why": "Credit losses go to income.",
   "video": "9.5"
  },
  {
   "type": "mcq",
   "q": "Selling HTM securities regularly before maturity:",
   "opts": [
    "Has no consequence",
    "Calls the HTM intent into question",
    "Creates OCI",
    "Requires a prior period adjustment"
   ],
   "a": 1,
   "why": "Intent and ability must be supported.",
   "video": "9.4"
  },
  {
   "type": "mcq",
   "q": "Transferring an AFS security to trading causes its accumulated OCI to be:",
   "opts": [
    "Kept in AOCI",
    "Recognized in net income immediately",
    "Amortized",
    "Reversed"
   ],
   "a": 1,
   "why": "Trading gains are in income.",
   "video": "9.6"
  }
 ],
 "10": [
  {
   "type": "sort",
   "q": "Sort each investment by method.",
   "cats": [
    "Fair value through net income",
    "Equity method",
    "Consolidation"
   ],
   "items": [
    [
     "5% of a listed company",
     0
    ],
    [
     "30% with board seats",
     1
    ],
    [
     "100% of a subsidiary",
     2
    ],
    [
     "12% held for trading",
     0
    ],
    [
     "45% joint venture with influence",
     1
    ],
    [
     "65% of a dealer network",
     2
    ]
   ],
   "why": "Influence levels.",
   "video": "10.1"
  },
  {
   "type": "num",
   "q": "Equity securities bought for $120,000; dividends $4,000; fair value at year-end $131,000. Total effect on net income?",
   "a": 15000,
   "unit": "$",
   "why": "4,000 + 11,000.",
   "video": "10.2"
  },
  {
   "type": "num",
   "q": "Equity method, 30%: cost $450,000; investee income $200,000; dividends $50,000. Ending investment?",
   "a": 495000,
   "unit": "$",
   "why": "450 + 60 − 15.",
   "video": "10.3"
  },
  {
   "type": "mcq",
   "q": "Under the equity method, the investor's share of investee income is:",
   "opts": [
    "Ignored until received",
    "Recorded as investment income and increases the investment",
    "Recorded in OCI",
    "Recorded only if dividends are paid"
   ],
   "a": 1,
   "why": "Accrual of share of income.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "Paid $500,000 for 25% of net assets with book value $1,600,000. Excess of cost over book value?",
   "a": 100000,
   "unit": "$",
   "why": "500 − 400.",
   "video": "10.4"
  },
  {
   "type": "num",
   "q": "Share of investee income $60,000; excess assigned to equipment $40,000 over 8 years. Investment income?",
   "a": 55000,
   "unit": "$",
   "why": "60,000 − 5,000.",
   "video": "10.4"
  },
  {
   "type": "mcq",
   "q": "A noncontrolling interest is reported:",
   "opts": [
    "As a liability",
    "Within equity",
    "As an investment",
    "In OCI"
   ],
   "a": 1,
   "why": "It's ownership by others.",
   "video": "10.5"
  },
  {
   "type": "mcq",
   "q": "Since 2018, changes in fair value of equity securities without significant influence are reported in:",
   "opts": [
    "OCI",
    "Net income",
    "Retained earnings",
    "Not reported"
   ],
   "a": 1,
   "why": "No AFS category for equity.",
   "video": "10.2"
  }
 ],
 "11": [
  {
   "type": "order",
   "q": "Put the five steps in order.",
   "items": [
    "Identify the contract",
    "Identify the performance obligations",
    "Determine the transaction price",
    "Allocate the transaction price",
    "Recognize revenue when obligations are satisfied"
   ],
   "why": "Topic 606.",
   "video": "11.1"
  },
  {
   "type": "mcq",
   "q": "A good or service is a separate performance obligation if it is:",
   "opts": [
    "Expensive",
    "Distinct",
    "Delivered first",
    "Listed on the invoice"
   ],
   "a": 1,
   "why": "Distinct promises.",
   "video": "11.2"
  },
  {
   "type": "num",
   "q": "300 units at $500 list; most likely price after volume rebate $450. Revenue recognized?",
   "a": 135000,
   "unit": "$",
   "why": "300 × 450.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Bonus outcomes: 25% $0, 50% $8,000, 25% $16,000. Expected value?",
   "a": 8000,
   "unit": "$",
   "why": "0 + 4,000 + 4,000.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Bundle $2,400; SSPs: product $2,000, installation $500, support $500. Allocated to installation?",
   "a": 400,
   "unit": "$",
   "why": "2,400 × 500/3,000.",
   "video": "11.4"
  },
  {
   "type": "sort",
   "q": "Point in time or over time?",
   "cats": [
    "Point in time",
    "Over time"
   ],
   "items": [
    [
     "Delivery of a kayak",
     0
    ],
    [
     "One-year storage service",
     1
    ],
    [
     "Monthly software subscription",
     1
    ],
    [
     "Sale of a gift card redeemed later",
     0
    ]
   ],
   "why": "Control transfer pattern.",
   "video": "11.5"
  },
  {
   "type": "num",
   "q": "Storage allocated $180 for 12 months, starting November 1. Revenue in the calendar year of sale?",
   "a": 30,
   "unit": "$",
   "why": "2 months × $15.",
   "video": "11.5"
  },
  {
   "type": "match",
   "q": "Match each balance to its meaning.",
   "pairs": [
    [
     "Contract liability",
     "Customer paid before performance"
    ],
    [
     "Contract asset",
     "Performed; right to payment conditional"
    ],
    [
     "Receivable",
     "Unconditional right to payment"
    ]
   ],
   "why": "Contract balances.",
   "video": "11.6"
  }
 ],
 "12": [
  {
   "type": "num",
   "q": "Sales $400,000 (cost $240,000); expected returns 5%. Return asset?",
   "a": 12000,
   "unit": "$",
   "why": "5% of cost.",
   "video": "12.1"
  },
  {
   "type": "num",
   "q": "Extended warranties sold for $120,000 covering 4 years. Revenue per year of coverage?",
   "a": 30000,
   "unit": "$",
   "why": "120,000 ÷ 4.",
   "video": "12.2"
  },
  {
   "type": "mcq",
   "q": "An agent reports revenue:",
   "opts": [
    "Gross",
    "Net, as its commission",
    "Only at year-end",
    "In OCI"
   ],
   "a": 1,
   "why": "Agents don't control the goods.",
   "video": "12.3"
  },
  {
   "type": "sort",
   "q": "Principal or agent?",
   "cats": [
    "Principal",
    "Agent"
   ],
   "items": [
    [
     "Holds inventory and sets prices",
     0
    ],
    [
     "Only arranges the sale for a fee",
     1
    ],
    [
     "Primarily responsible for fulfillment",
     0
    ],
    [
     "Never controls the goods",
     1
    ]
   ],
   "why": "Control indicators.",
   "video": "12.3"
  },
  {
   "type": "num",
   "q": "Consignee sells 25 of 60 consigned kayaks at $480. Revenue recognized by the consignor?",
   "a": 12000,
   "unit": "$",
   "why": "25 × 480.",
   "video": "12.4"
  },
  {
   "type": "num",
   "q": "Contract price $3,000,000; estimated costs $2,400,000; costs to date $960,000. Revenue to date?",
   "a": 1200000,
   "unit": "$",
   "why": "40% × 3,000,000.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "Revenue recognized to date $1,200,000; billings to date $1,000,000. Contract asset?",
   "a": 200000,
   "unit": "$",
   "why": "Revenue exceeds billings.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "Prior gross profit recognized $90,000; contract now expected to lose $30,000 overall. Loss recognized this period?",
   "a": 120000,
   "unit": "$",
   "why": "30,000 + 90,000.",
   "video": "12.6"
  }
 ],
 "13": [
  {
   "type": "sort",
   "q": "Classify each change.",
   "cats": [
    "Change in principle",
    "Change in estimate",
    "Error"
   ],
   "items": [
    [
     "LIFO to FIFO",
     0
    ],
    [
     "New useful life",
     1
    ],
    [
     "Expense recorded twice last year",
     2
    ],
    [
     "New bad debt rate",
     1
    ],
    [
     "Average cost to FIFO",
     0
    ],
    [
     "Math mistake in prior depreciation",
     2
    ]
   ],
   "why": "Three types.",
   "video": "13.1"
  },
  {
   "type": "num",
   "q": "Cumulative pretax effect of a change in principle on prior years $80,000; tax 25%. Adjustment to beginning retained earnings?",
   "a": 60000,
   "unit": "$",
   "why": "80,000 × 75%.",
   "video": "13.2"
  },
  {
   "type": "mcq",
   "q": "When retrospective application is impracticable, the new principle is applied:",
   "opts": [
    "Not at all",
    "From the earliest practicable date",
    "Only to future years' notes",
    "Through OCI"
   ],
   "a": 1,
   "why": "Earliest practicable date.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "Book value $144,000; 3 years remain; no salvage; switch from DDB to straight-line. Annual depreciation?",
   "a": 48000,
   "unit": "$",
   "why": "144,000 ÷ 3.",
   "video": "13.4"
  },
  {
   "type": "mcq",
   "q": "A change in depreciation method is accounted for:",
   "opts": [
    "Retrospectively",
    "Prospectively",
    "As a prior period adjustment",
    "In OCI"
   ],
   "a": 1,
   "why": "Change in estimate effected by a change in principle.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Prior-year revenue of $40,000 was omitted; tax 25%. Prior period adjustment (credit) to retained earnings?",
   "a": 30000,
   "unit": "$",
   "why": "40,000 × 75%.",
   "video": "13.5"
  },
  {
   "type": "mcq",
   "q": "Which error is noncounterbalancing?",
   "opts": [
    "Understated ending inventory",
    "Missed accrued wages",
    "Failure to record depreciation",
    "Missed prepaid insurance adjustment"
   ],
   "a": 2,
   "why": "Depreciation errors persist.",
   "video": "13.6"
  },
  {
   "type": "mcq",
   "q": "A 2030 counterbalancing error discovered after 2031's books are closed requires:",
   "opts": [
    "A correcting journal entry",
    "No entry, but restated comparatives",
    "A 2031 income adjustment",
    "Nothing at all"
   ],
   "a": 1,
   "why": "It has reversed, but 2030 comparatives are wrong.",
   "video": "13.6"
  }
 ],
 "14": [
  {
   "type": "sort",
   "q": "Classify each cash flow (US GAAP).",
   "cats": [
    "Operating",
    "Investing",
    "Financing"
   ],
   "items": [
    [
     "Interest paid",
     0
    ],
    [
     "Purchase of equipment",
     1
    ],
    [
     "Dividends paid",
     2
    ],
    [
     "Dividends received",
     0
    ],
    [
     "Loan made to a dealer",
     1
    ],
    [
     "Repayment of bond principal",
     2
    ]
   ],
   "why": "GAAP classifications.",
   "video": "14.1"
  },
  {
   "type": "num",
   "q": "Sales $1,500,000; accounts receivable increased $60,000. Cash collected from customers?",
   "a": 1440000,
   "unit": "$",
   "why": "1,500 − 60.",
   "video": "14.2"
  },
  {
   "type": "num",
   "q": "Net income $400,000; depreciation $70,000; gain on sale of equipment $20,000. Subtotal before working capital?",
   "a": 450000,
   "unit": "$",
   "why": "400 + 70 − 20.",
   "video": "14.3"
  },
  {
   "type": "mcq",
   "q": "Under the indirect method, an increase in accounts payable is:",
   "opts": [
    "Subtracted",
    "Added",
    "Ignored",
    "Investing"
   ],
   "a": 1,
   "why": "Costs not yet paid.",
   "video": "14.4"
  },
  {
   "type": "num",
   "q": "Subtotal $450,000; AR increased $35,000; inventory decreased $15,000; accrued liabilities decreased $10,000. Net cash from operating activities?",
   "a": 420000,
   "unit": "$",
   "why": "450 − 35 + 15 − 10.",
   "video": "14.4"
  },
  {
   "type": "num",
   "q": "Equipment with book value $70,000 sold at a $9,000 gain. Investing cash inflow?",
   "a": 79000,
   "unit": "$",
   "why": "Proceeds.",
   "video": "14.5"
  },
  {
   "type": "mcq",
   "q": "Conversion of bonds into common stock is reported:",
   "opts": [
    "As financing inflow and outflow",
    "As a noncash disclosure",
    "In operating activities",
    "Not at all"
   ],
   "a": 1,
   "why": "No cash moved.",
   "video": "14.5"
  },
  {
   "type": "num",
   "q": "Operating $900,000; investing −$1,100,000; financing $350,000. Net change in cash?",
   "a": 150000,
   "unit": "$",
   "why": "900 − 1,100 + 350.",
   "video": "14.5"
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
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct312-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct312-" + n, state = store(key) || { done: [] }, cur = 0;
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
