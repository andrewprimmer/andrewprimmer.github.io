/* End-of-lecture exercises for ACCT 414 Federal Tax I (tax year 2026).
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
   "type": "sort",
   "q": "Tax, fee or fine?",
   "cats": [
    "Tax",
    "Fee",
    "Fine"
   ],
   "items": [
    [
     "Federal gas tax",
     0
    ],
    [
     "State park pass",
     1
    ],
    [
     "Speeding ticket",
     2
    ],
    [
     "Minnesota sales tax",
     0
    ],
    [
     "Passport application charge",
     1
    ],
    [
     "Late-filing penalty",
     2
    ]
   ],
   "why": "A tax is required and unrequited; a fee buys a specific service; a fine punishes behavior.",
   "video": "1.1"
  },
  {
   "type": "num",
   "q": "A single filer has 2026 taxable income of $60,000. What is her federal income tax?",
   "a": 7912,
   "unit": "$",
   "why": "1,240 + 4,560 + 22% × 9,600 = 7,912.",
   "video": "1.2"
  },
  {
   "type": "num",
   "q": "Same filer: what is her average tax rate, in percent, to one decimal place?",
   "a": 13.2,
   "tol": 0.1,
   "unit": "%",
   "why": "7,912 ÷ 60,000 = 13.2%.",
   "video": "1.2"
  },
  {
   "type": "match",
   "q": "Match each tax to its structure.",
   "pairs": [
    [
     "Federal income tax",
     "Progressive"
    ],
    [
     "Medicare tax on wages",
     "Proportional"
    ],
    [
     "Sales tax, measured against income",
     "Regressive"
    ]
   ],
   "why": "Rising brackets make the income tax progressive; Medicare is flat; sales tax takes a larger share of a smaller income.",
   "video": "1.3"
  },
  {
   "type": "num",
   "q": "A taxable bond yields 6% and an equivalent municipal bond yields 4.5%. What is the implicit tax rate, in percent?",
   "a": 25,
   "tol": 0.1,
   "unit": "%",
   "why": "(6 − 4.5) ÷ 6 = 25%.",
   "video": "1.4"
  },
  {
   "type": "order",
   "q": "Put these events in order.",
   "items": [
    "Civil War income tax",
    "Pollock v. Farmers' Loan and Trust",
    "Sixteenth Amendment",
    "Payroll withholding begins",
    "Internal Revenue Code of 1986"
   ],
   "why": "1861, 1895, 1913, 1943, 1986.",
   "video": "1.5"
  },
  {
   "type": "match",
   "q": "Match each test of a good tax to its meaning.",
   "pairs": [
    [
     "Sufficiency",
     "Raises enough revenue"
    ],
    [
     "Certainty",
     "Taxpayers know what they owe"
    ],
    [
     "Convenience",
     "Easy to pay and collect"
    ],
    [
     "Economy",
     "Low cost to run and comply with"
    ]
   ],
   "why": "These, with equity, are the standard tests.",
   "video": "1.6"
  },
  {
   "type": "mcq",
   "q": "A rate cut leads Nora to work fewer hours because she can now hit her income goal sooner. Which effect is this?",
   "opts": [
    "Substitution effect",
    "Income effect",
    "Implicit tax",
    "Horizontal equity"
   ],
   "a": 1,
   "why": "Under the income effect, people adjust work to reach a target after-tax income; with a lower rate she needs fewer hours.",
   "video": "1.6"
  }
 ],
 "2": [
  {
   "type": "sort",
   "q": "Must each person file a 2026 return?",
   "cats": [
    "Must file",
    "Not required"
   ],
   "items": [
    [
     "Single, 25, wages $18,000",
     0
    ],
    [
     "Single, 25, wages $14,000",
     1
    ],
    [
     "MFJ, both 40, wages $30,000",
     1
    ],
    [
     "MFJ, both 40, wages $45,000",
     0
    ],
    [
     "Single, 19, net self-employment $500, nothing else",
     0
    ]
   ],
   "why": "Compare gross income with the 2026 standard deduction ($16,100 single, $32,200 MFJ); $400 of self-employment earnings always requires a return.",
   "video": "2.1"
  },
  {
   "type": "mcq",
   "q": "A 2026 return is filed on February 20, 2027. When does the normal assessment period end?",
   "opts": [
    "February 20, 2030",
    "April 15, 2030",
    "December 31, 2029",
    "April 15, 2033"
   ],
   "a": 1,
   "why": "An early return is treated as filed on the due date, April 15, 2027; three years later is April 15, 2030.",
   "video": "2.2"
  },
  {
   "type": "match",
   "q": "Match each situation to the assessment period.",
   "pairs": [
    [
     "Honest mistake on a deduction",
     "3 years"
    ],
    [
     "Omitted 30% of gross income",
     "6 years"
    ],
    [
     "Deliberately hid income",
     "No limit"
    ]
   ],
   "why": "Three years is normal, six for omissions over 25% of gross income, and no limit for fraud.",
   "video": "2.2"
  },
  {
   "type": "match",
   "q": "Match each audit type to its description.",
   "pairs": [
    [
     "Correspondence",
     "Handled by mail"
    ],
    [
     "Office",
     "At an IRS office"
    ],
    [
     "Field",
     "At the taxpayer's home or business"
    ]
   ],
   "why": "Most audits are by mail; field audits are for complex returns.",
   "video": "2.3"
  },
  {
   "type": "order",
   "q": "Put the dispute process in order.",
   "items": [
    "Audit",
    "30-day letter",
    "Appeals conference",
    "90-day letter",
    "Tax Court petition"
   ],
   "why": "The 90-day letter (notice of deficiency) is the ticket to the Tax Court.",
   "video": "2.4"
  },
  {
   "type": "mcq",
   "q": "Which trial court does not require the taxpayer to pay the tax first?",
   "opts": [
    "US District Court",
    "Court of Federal Claims",
    "US Tax Court",
    "None of them"
   ],
   "a": 2,
   "why": "Only the Tax Court hears deficiency cases before payment.",
   "video": "2.4"
  },
  {
   "type": "order",
   "q": "Rank from most to least authoritative.",
   "items": [
    "Internal Revenue Code",
    "Final regulation",
    "Revenue ruling",
    "Tax textbook"
   ],
   "why": "Statute, then regulations, then rulings; textbooks are secondary authority.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "A taxpayer owes $4,000 and files 4 months late. What is the failure-to-file penalty before any offset?",
   "a": 800,
   "unit": "$",
   "why": "5% × 4 months = 20% of $4,000 = $800 (below the 25% cap).",
   "video": "2.6"
  }
 ],
 "3": [
  {
   "type": "sort",
   "q": "Timing, shifting or conversion?",
   "cats": [
    "Timing",
    "Shifting",
    "Conversion"
   ],
   "items": [
    [
     "Prepay property tax in December",
     0
    ],
    [
     "Pay a child a wage for real work",
     1
    ],
    [
     "Buy municipal bonds",
     2
    ],
    [
     "Delay a client invoice to January",
     0
    ],
    [
     "Hold shares longer than a year",
     2
    ],
    [
     "Give shares to a grandparent in a low bracket",
     1
    ]
   ],
   "why": "Timing is when, shifting is who, conversion is what kind of income.",
   "video": "3.1"
  },
  {
   "type": "num",
   "q": "A 24% taxpayer's $10,000 deduction is delayed one year. At a 6% discount rate, what is the present value of the tax saved next year?",
   "a": 2264,
   "tol": 2,
   "unit": "$",
   "why": "2,400 ÷ 1.06 = 2,264.",
   "video": "3.2"
  },
  {
   "type": "mcq",
   "q": "Rates are rising from 24% to 35% next year. What should a taxpayer generally do?",
   "opts": [
    "Accelerate deductions, defer income",
    "Defer deductions, accelerate income",
    "Accelerate both",
    "Defer both"
   ],
   "a": 1,
   "why": "A deduction is worth more and income costs more in the high-rate year.",
   "video": "3.3"
  },
  {
   "type": "num",
   "q": "A 12-year-old has $4,000 of interest income in 2026. How much is taxed at the parents' rate?",
   "a": 1300,
   "unit": "$",
   "why": "Unearned income over $2,700 is taxed at the parents' rate: 4,000 − 2,700 = 1,300.",
   "video": "3.4"
  },
  {
   "type": "num",
   "q": "A 24% taxpayer has an $8,000 gain. How much tax does holding for more than a year save if the long-term rate is 15%?",
   "a": 720,
   "unit": "$",
   "why": "8,000 × (24% − 15%) = 720.",
   "video": "3.5"
  },
  {
   "type": "match",
   "q": "Match each doctrine to its idea.",
   "pairs": [
    [
     "Business purpose",
     "A deal needs a non-tax reason"
    ],
    [
     "Step transaction",
     "Linked steps are taxed as one"
    ],
    [
     "Substance over form",
     "Economic reality decides"
    ],
    [
     "Constructive receipt",
     "Available income is taxed now"
    ]
   ],
   "why": "These doctrines stop form-only planning.",
   "video": "3.6"
  },
  {
   "type": "sort",
   "q": "Avoidance or evasion?",
   "cats": [
    "Avoidance (legal)",
    "Evasion (illegal)"
   ],
   "items": [
    [
     "Contributing to a 401(k)",
     0
    ],
    [
     "Leaving cash tips off the return",
     1
    ],
    [
     "Claiming a dependent who doesn't exist",
     1
    ],
    [
     "Buying municipal bonds",
     0
    ],
    [
     "Timing a sale for long-term treatment",
     0
    ]
   ],
   "why": "Avoidance uses the rules; evasion breaks them.",
   "video": "3.6"
  },
  {
   "type": "mcq",
   "q": "Under the assignment-of-income doctrine, who is taxed on Jake's salary if he directs his employer to pay it to Leo?",
   "opts": [
    "Leo",
    "Jake",
    "Split equally",
    "Neither, it's a gift"
   ],
   "a": 1,
   "why": "Income from services is taxed to the person who earns it.",
   "video": "3.4"
  }
 ],
 "4": [
  {
   "type": "order",
   "q": "Put the tax formula in order.",
   "items": [
    "Gross income",
    "Adjusted gross income",
    "Taxable income",
    "Tax before credits",
    "Tax after credits",
    "Amount due or refund"
   ],
   "why": "Deductions for AGI give AGI; the standard or itemized deduction and QBI give taxable income; credits and payments come last.",
   "video": "4.1"
  },
  {
   "type": "num",
   "q": "MFJ, AGI $80,000, standard deduction. What is 2026 taxable income?",
   "a": 47800,
   "unit": "$",
   "why": "80,000 − 32,200 = 47,800.",
   "video": "4.2"
  },
  {
   "type": "sort",
   "q": "Deduction for AGI or from AGI?",
   "cats": [
    "For AGI (above the line)",
    "From AGI (below the line)"
   ],
   "items": [
    [
     "Half of self-employment tax",
     0
    ],
    [
     "Mortgage interest",
     1
    ],
    [
     "Traditional IRA contribution",
     0
    ],
    [
     "Charitable gifts by an itemizer",
     1
    ],
    [
     "HSA contribution",
     0
    ],
    [
     "Standard deduction",
     1
    ]
   ],
   "why": "Above-the-line deductions reduce AGI; the standard or itemized deductions come after.",
   "video": "4.2"
  },
  {
   "type": "num",
   "q": "A married couple, both 67, file jointly. What is their 2026 standard deduction (before the senior deduction)?",
   "a": 35500,
   "unit": "$",
   "why": "32,200 + 2 × 1,650 = 35,500.",
   "video": "4.2"
  },
  {
   "type": "mcq",
   "q": "Which person can be a qualifying child of the taxpayer?",
   "opts": [
    "Her 25-year-old full-time student son",
    "Her 17-year-old nephew who lives with her all year",
    "Her mother who lives with her",
    "Her 22-year-old daughter who works full time and lives at home"
   ],
   "a": 1,
   "why": "A nephew is a descendant of a sibling, under 19 and lived with her. The 25-year-old is too old, a mother is a relative not a child, and the 22-year-old non-student fails the age test.",
   "video": "4.3"
  },
  {
   "type": "mcq",
   "q": "Jake's father has $6,200 of taxable pension income. Jake provides 70% of his support. Can Jake claim him?",
   "opts": [
    "Yes, as a qualifying relative",
    "No, his gross income is $5,300 or more",
    "Yes, as a qualifying child",
    "Only with a multiple support agreement"
   ],
   "a": 1,
   "why": "A qualifying relative's gross income must be under $5,300 in 2026.",
   "video": "4.4"
  },
  {
   "type": "match",
   "q": "Match each person to the best filing status.",
   "pairs": [
    [
     "Married couple, December 31",
     "Married filing jointly"
    ],
    [
     "Widower, wife died last year, dependent child",
     "Qualifying surviving spouse"
    ],
    [
     "Divorced, keeps a home for her son",
     "Head of household"
    ],
    [
     "Unmarried, no dependents",
     "Single"
    ]
   ],
   "why": "Status follows marital status on December 31 and who lives in the home.",
   "video": "4.5"
  },
  {
   "type": "num",
   "q": "A head of household has taxable income of $40,000 in 2026. What is her tax? (10% to $17,700; 12% to $67,450)",
   "a": 4446,
   "unit": "$",
   "why": "1,770 + 12% × 22,300 = 2,676 → 4,446.",
   "video": "4.6"
  }
 ],
 "5": [
  {
   "type": "sort",
   "q": "Included in gross income or excluded?",
   "cats": [
    "Included",
    "Excluded"
   ],
   "items": [
    [
     "Tips",
     0
    ],
    [
     "Inheritance",
     1
    ],
    [
     "Unemployment compensation",
     0
    ],
    [
     "Municipal bond interest",
     1
    ],
    [
     "Lottery winnings",
     0
    ],
    [
     "Life insurance received on a death",
     1
    ],
    [
     "Forgiven credit card debt",
     0
    ]
   ],
   "why": "Section 61 includes everything unless a specific exclusion applies.",
   "video": "5.5"
  },
  {
   "type": "mcq",
   "q": "Which concept means shares that rise in value are not taxed until sold?",
   "opts": [
    "Return of capital",
    "Realization",
    "Constructive receipt",
    "Claim of right"
   ],
   "a": 1,
   "why": "Income is recognized only when realized in a transaction.",
   "video": "5.1"
  },
  {
   "type": "mcq",
   "q": "A cash-method dentist receives $3,000 in December 2026 for work in January 2027. When is it income?",
   "opts": [
    "2026",
    "2027",
    "Half in each year",
    "When the work is finished"
   ],
   "a": 0,
   "why": "Prepaid income is generally taxed when received by a cash-method taxpayer.",
   "video": "5.2"
  },
  {
   "type": "match",
   "q": "Match each divorce payment to its tax treatment.",
   "pairs": [
    [
     "Alimony, divorce in 2017",
     "Deducted by payer, income to recipient"
    ],
    [
     "Alimony, divorce in 2022",
     "Not deducted, not income"
    ],
    [
     "Child support",
     "Never deducted or income"
    ]
   ],
   "why": "The TCJA changed alimony for divorces executed after 2018.",
   "video": "5.3"
  },
  {
   "type": "num",
   "q": "A single retiree has a pension of $22,000 and Social Security of $16,000 (no tax-exempt interest). How much of the benefits is taxable?",
   "a": 2500,
   "unit": "$",
   "why": "Provisional income 22,000 + 8,000 = 30,000; lesser of 8,000 or 50% × 5,000 = 2,500.",
   "video": "5.4"
  },
  {
   "type": "num",
   "q": "A student's $8,000 scholarship pays $6,500 tuition, $400 books and $1,100 housing. How much is taxable?",
   "a": 1100,
   "unit": "$",
   "why": "Only tuition, fees, books and supplies are excluded; housing is taxable.",
   "video": "5.5"
  },
  {
   "type": "sort",
   "q": "Taxable or tax-free fringe benefit?",
   "cats": [
    "Tax-free",
    "Taxable"
   ],
   "items": [
    [
     "Employer health insurance",
     0
    ],
    [
     "A $100 gift card",
     1
    ],
    [
     "Group-term life up to $50,000",
     0
    ],
    [
     "Employer pays an employee's personal car loan",
     1
    ],
    [
     "Transit pass of $200 a month",
     0
    ]
   ],
   "why": "Cash equivalents and personal expenses paid by an employer are wages.",
   "video": "5.6"
  },
  {
   "type": "num",
   "q": "Jake gets $2,000 more salary instead of $2,000 of dependent care assistance. At 12% income tax and 7.65% payroll tax, how much less is the salary worth after tax?",
   "a": 393,
   "tol": 1,
   "unit": "$",
   "why": "2,000 × 19.65% = 393.",
   "video": "5.6"
  }
 ],
 "6": [
  {
   "type": "sort",
   "q": "For AGI or itemized?",
   "cats": [
    "For AGI",
    "Itemized"
   ],
   "items": [
    [
     "HSA contribution",
     0
    ],
    [
     "Property tax",
     1
    ],
    [
     "Half of SE tax",
     0
    ],
    [
     "Mortgage interest",
     1
    ],
    [
     "Student loan interest",
     0
    ],
    [
     "Medical costs over 7.5% of AGI",
     1
    ]
   ],
   "why": "Above-the-line deductions reduce AGI; itemized deductions compete with the standard deduction.",
   "video": "6.1"
  },
  {
   "type": "num",
   "q": "A single filer, 70, has MAGI of $85,000. What is her senior deduction for 2026?",
   "a": 5400,
   "unit": "$",
   "why": "6,000 − 6% × (85,000 − 75,000) = 6,000 − 600 = 5,400.",
   "video": "6.2"
  },
  {
   "type": "num",
   "q": "AGI is $70,000 and unreimbursed medical costs are $9,000. What is the medical deduction?",
   "a": 3750,
   "unit": "$",
   "why": "9,000 − 7.5% × 70,000 (5,250) = 3,750.",
   "video": "6.3"
  },
  {
   "type": "num",
   "q": "A couple with MAGI of $305,000 paid $48,000 of state and local taxes in 2026. How much can they deduct?",
   "a": 40400,
   "unit": "$",
   "why": "MAGI is under $505,000, so the full $40,400 cap applies.",
   "video": "6.4"
  },
  {
   "type": "mcq",
   "q": "From 2026, how much can a married couple who take the standard deduction deduct for $3,000 of cash gifts to charity?",
   "opts": [
    "$0",
    "$1,000",
    "$2,000",
    "$3,000"
   ],
   "a": 2,
   "why": "Non-itemizers can deduct cash gifts up to $2,000 on a joint return.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "An itemizer with AGI of $120,000 gives $5,000 cash to charity in 2026. How much is deductible?",
   "a": 4400,
   "unit": "$",
   "why": "Only gifts above 0.5% of AGI (600) count: 5,000 − 600 = 4,400.",
   "video": "6.5"
  },
  {
   "type": "mcq",
   "q": "Which mortgage interest is deductible as qualified residence interest?",
   "opts": [
    "Interest on a home equity loan used to buy a boat",
    "Interest on a $600,000 loan to buy a main home",
    "Interest on a loan for a rental property",
    "Interest on a credit card used for furniture"
   ],
   "a": 1,
   "why": "Acquisition debt up to $750,000 on a main or second home qualifies; equity debt must be used to buy, build or improve the home.",
   "video": "6.5"
  },
  {
   "type": "mcq",
   "q": "A married couple's itemized deductions total $29,000. What deduction do they take?",
   "opts": [
    "$29,000 itemized",
    "$32,200 standard",
    "$61,200, both",
    "It depends on their bracket"
   ],
   "a": 1,
   "why": "Take the larger: the $32,200 standard deduction.",
   "video": "6.6"
  }
 ],
 "7": [
  {
   "type": "sort",
   "q": "Taxed at ordinary rates or capital gains rates?",
   "cats": [
    "Ordinary rates",
    "Capital gains rates"
   ],
   "items": [
    [
     "Bank interest",
     0
    ],
    [
     "Qualified dividends",
     1
    ],
    [
     "Short-term gain",
     0
    ],
    [
     "Long-term gain on shares",
     1
    ],
    [
     "Corporate bond interest",
     0
    ]
   ],
   "why": "Only qualified dividends and long-term gains get the 0/15/20% rates.",
   "video": "7.1"
  },
  {
   "type": "match",
   "q": "Match how the property was acquired to its basis.",
   "pairs": [
    [
     "Purchased",
     "Cost plus fees"
    ],
    [
     "Inherited",
     "Value at date of death"
    ],
    [
     "Gift (value above basis)",
     "Donor's basis"
    ]
   ],
   "why": "Inheritance steps basis up; a gift carries it over.",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "A married couple has $85,000 of ordinary taxable income and a $20,000 long-term gain. How much of the gain is taxed at 0%?",
   "a": 13900,
   "unit": "$",
   "why": "The 0% band runs to $98,900: 98,900 − 85,000 = 13,900.",
   "video": "7.3"
  },
  {
   "type": "num",
   "q": "Net short-term gain $2,000 and net long-term loss $8,000. How much carries forward after the 2026 deduction?",
   "a": 3000,
   "unit": "$",
   "why": "Net loss 6,000; deduct 3,000; carry forward 3,000.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "Shares costing $9,000 are sold for $6,000; identical shares are bought 10 days later for $6,500. What is the basis of the new shares?",
   "a": 9500,
   "unit": "$",
   "why": "The $3,000 disallowed loss is added: 6,500 + 3,000 = 9,500.",
   "video": "7.5"
  },
  {
   "type": "mcq",
   "q": "Which sale's loss is disallowed under the related-party rules?",
   "opts": [
    "Sale to a cousin",
    "Sale to a brother",
    "Sale to a friend",
    "Sale to a brother-in-law"
   ],
   "a": 1,
   "why": "Related parties include siblings, spouses, ancestors and descendants, but not cousins or in-laws.",
   "video": "7.5"
  },
  {
   "type": "num",
   "q": "A married couple has MAGI of $290,000 including $25,000 of dividends. What is the NIIT?",
   "a": 950,
   "unit": "$",
   "why": "3.8% × lesser of 25,000 or 40,000 = 950.",
   "video": "7.6"
  },
  {
   "type": "num",
   "q": "A landlord with AGI of $120,000 who actively participates has a $20,000 rental loss. How much can she deduct this year?",
   "a": 15000,
   "unit": "$",
   "why": "The $25,000 allowance falls by 50% of AGI over 100,000: 25,000 − 10,000 = 15,000, so she can deduct $15,000.",
   "video": "7.6"
  }
 ],
 "8": [
  {
   "type": "num",
   "q": "Single filer, 2026 taxable income $45,000. What is the regular tax? (10% to $12,400; 12% to $50,400)",
   "a": 5152,
   "unit": "$",
   "why": "1,240 + 12% × 32,600 = 3,912 → 5,152.",
   "video": "8.1"
  },
  {
   "type": "num",
   "q": "A 10-year-old has $4,500 of dividends. How much is taxed at the parents' rate?",
   "a": 1800,
   "unit": "$",
   "why": "4,500 − 2,700 = 1,800.",
   "video": "8.2"
  },
  {
   "type": "num",
   "q": "Net self-employment profit is $40,000. What is the SE tax, to the nearest dollar?",
   "a": 5652,
   "tol": 2,
   "unit": "$",
   "why": "40,000 × 92.35% × 15.3% = 5,652.",
   "video": "8.3"
  },
  {
   "type": "num",
   "q": "An employee earns $190,000 in 2026. How much Social Security tax does she pay (6.2% to the wage base)?",
   "a": 11439,
   "unit": "$",
   "why": "6.2% × 184,500 = 11,439; wages above the base aren't taxed for Social Security.",
   "video": "8.3"
  },
  {
   "type": "sort",
   "q": "Refundable or nonrefundable?",
   "cats": [
    "Refundable (at least in part)",
    "Nonrefundable"
   ],
   "items": [
    [
     "Earned income tax credit",
     0
    ],
    [
     "Child and dependent care credit",
     1
    ],
    [
     "Child tax credit",
     0
    ],
    [
     "Lifetime learning credit",
     1
    ],
    [
     "American opportunity credit",
     0
    ],
    [
     "Credit for other dependents",
     1
    ]
   ],
   "why": "The EITC, up to $1,700 of the CTC and 40% of the AOTC are refundable.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "A married couple (AGI $90,000) pays $7,000 of day care for two children under 13. What is the 2026 credit?",
   "a": 2100,
   "unit": "$",
   "why": "Expenses are capped at $6,000; at this AGI the rate is 35%: 2,100.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "A single parent (MAGI $60,000) pays $3,000 of a freshman's tuition. What is the American opportunity credit?",
   "a": 2250,
   "unit": "$",
   "why": "100% of 2,000 + 25% of 1,000 = 2,250; no phase-out below $80,000.",
   "video": "8.5"
  },
  {
   "type": "mcq",
   "q": "Last year's tax was $12,000 (AGI $95,000). This year's tax will be $20,000. Which payments avoid an underpayment penalty?",
   "opts": [
    "$10,800",
    "$12,000",
    "$18,000 only",
    "$20,000 only"
   ],
   "a": 1,
   "why": "100% of last year's tax ($12,000) is a safe harbor when prior AGI was $150,000 or less.",
   "video": "8.6"
  }
 ],
 "9": [
  {
   "type": "sort",
   "q": "Deductible business expense or not?",
   "cats": [
    "Deductible",
    "Not deductible"
   ],
   "items": [
    [
     "Advertising on Facebook",
     0
    ],
    [
     "A parking ticket at a shoot",
     1
    ],
    [
     "Photo-editing software",
     0
    ],
    [
     "Donation to a mayoral campaign",
     1
    ],
    [
     "Liability insurance",
     0
    ],
    [
     "Family vacation",
     1
    ]
   ],
   "why": "Ordinary and necessary costs are deductible; fines, political spending and personal costs are not.",
   "video": "9.1"
  },
  {
   "type": "num",
   "q": "A client dinner costs $240 and tickets to a basketball game for the client cost $300. What is deductible?",
   "a": 120,
   "unit": "$",
   "why": "Meals are 50% (120); entertainment is not deductible.",
   "video": "9.2"
  },
  {
   "type": "num",
   "q": "A 250 sq ft home office qualifies. What is the deduction under the simplified method?",
   "a": 1250,
   "unit": "$",
   "why": "$5 × 250 = 1,250.",
   "video": "9.3"
  },
  {
   "type": "mcq",
   "q": "Which trip is deductible?",
   "opts": [
    "Home to a regular office",
    "A home office (principal place of business) to a client",
    "Home to the gym",
    "Office to lunch with friends"
   ],
   "a": 1,
   "why": "Trips from a qualifying home office to business locations are business travel.",
   "video": "9.3"
  },
  {
   "type": "match",
   "q": "Match the activity to its tax treatment.",
   "pairs": [
    [
     "Business with a loss",
     "Loss offsets other income"
    ],
    [
     "Hobby with costs above income",
     "Income taxed, costs not deductible"
    ],
    [
     "Profit in 3 of 5 years",
     "Presumed to be a business"
    ]
   ],
   "why": "Profit motive decides; hobby expenses are not deductible since 2018.",
   "video": "9.4"
  },
  {
   "type": "mcq",
   "q": "A cash-method sole proprietor pays a $2,400 bill for 24 months of insurance on January 1, 2026. What is deductible in 2026?",
   "opts": [
    "$2,400",
    "$1,200",
    "$0",
    "$200"
   ],
   "a": 1,
   "why": "The 12-month rule doesn't apply to a 24-month benefit, so the cost is spread: $1,200 in 2026.",
   "video": "9.5"
  },
  {
   "type": "num",
   "q": "Single, QBI $30,000, taxable income before QBI $100,000. What is the QBI deduction?",
   "a": 6000,
   "unit": "$",
   "why": "Lesser of 20% × 30,000 = 6,000 or 20% × 100,000 = 20,000.",
   "video": "9.6"
  },
  {
   "type": "num",
   "q": "Married, QBI $70,000, taxable income before QBI $60,000. What is the QBI deduction?",
   "a": 12000,
   "unit": "$",
   "why": "Lesser of 14,000 or 20% × 60,000 = 12,000.",
   "video": "9.6"
  }
 ],
 "10": [
  {
   "type": "num",
   "q": "Equipment costs $12,000 plus $800 sales tax and $1,200 installation. What is its basis?",
   "a": 14000,
   "unit": "$",
   "why": "12,000 + 800 + 1,200 = 14,000.",
   "video": "10.1"
  },
  {
   "type": "match",
   "q": "Match each asset to its MACRS recovery period.",
   "pairs": [
    [
     "Computer",
     "5 years"
    ],
    [
     "Office desk",
     "7 years"
    ],
    [
     "Apartment building",
     "27.5 years"
    ],
    [
     "Warehouse",
     "39 years"
    ]
   ],
   "why": "These are the standard MACRS classes.",
   "video": "10.2"
  },
  {
   "type": "num",
   "q": "A $15,000 five-year asset is placed in service in 2026 (half-year, no bonus or 179). What is 2027 depreciation?",
   "a": 4800,
   "unit": "$",
   "why": "Year 2 rate 32% × 15,000 = 4,800.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "A seven-year asset costing $10,000 (half-year) is sold in its third year. What is depreciation in the year of sale? (Year 3 rate 17.49%)",
   "a": 875,
   "tol": 1,
   "unit": "$",
   "why": "Half of 17.49% × 10,000 = 874.50, about $875.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "A business with $25,000 of taxable income elects $35,000 of Section 179. How much carries forward?",
   "a": 10000,
   "unit": "$",
   "why": "The deduction is limited to taxable business income; 10,000 carries forward.",
   "video": "10.4"
  },
  {
   "type": "order",
   "q": "Put the cost recovery deductions in the order they are applied.",
   "items": [
    "Section 179",
    "Bonus depreciation",
    "Regular MACRS"
   ],
   "why": "179 first, bonus on the remaining basis, then MACRS.",
   "video": "10.5"
  },
  {
   "type": "num",
   "q": "A residential rental building (not land) cost $220,000. What is a full year's depreciation?",
   "a": 8000,
   "unit": "$",
   "why": "220,000 ÷ 27.5 = 8,000.",
   "video": "10.6"
  },
  {
   "type": "num",
   "q": "Goodwill is purchased for $90,000. What is the annual amortization?",
   "a": 6000,
   "unit": "$",
   "why": "Section 197: 15 years. 90,000 ÷ 15 = 6,000.",
   "video": "10.6"
  }
 ],
 "11": [
  {
   "type": "num",
   "q": "A building is sold for $300,000 cash and the buyer assumes a $100,000 mortgage; commission is $20,000. What is the amount realized?",
   "a": 380000,
   "unit": "$",
   "why": "300,000 + 100,000 − 20,000 = 380,000.",
   "video": "11.1"
  },
  {
   "type": "sort",
   "q": "Ordinary, capital or Section 1231 asset?",
   "cats": [
    "Ordinary",
    "Capital",
    "Section 1231"
   ],
   "items": [
    [
     "Inventory",
     0
    ],
    [
     "Shares held as an investment",
     1
    ],
    [
     "Business truck held 2 years",
     2
    ],
    [
     "Your personal car",
     1
    ],
    [
     "Accounts receivable",
     0
    ],
    [
     "Business land held 5 years",
     2
    ]
   ],
   "why": "Business property held over a year is 1231; investments and personal-use property are capital; inventory and receivables are ordinary.",
   "video": "11.2"
  },
  {
   "type": "num",
   "q": "Equipment cost $40,000, depreciation taken $25,000, sold for $30,000. How much is Section 1245 ordinary income?",
   "a": 15000,
   "unit": "$",
   "why": "Gain 30,000 − 15,000 = 15,000, less than depreciation, so all ordinary.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Same equipment sold for $46,000. How much is Section 1231 gain?",
   "a": 6000,
   "unit": "$",
   "why": "Gain 31,000: 25,000 is recapture, 6,000 is 1231.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Net 1231 gain this year is $12,000; net 1231 losses in the prior five years were $5,000 (not yet recaptured). How much is long-term capital gain?",
   "a": 7000,
   "unit": "$",
   "why": "5,000 is ordinary under the lookback; 7,000 is LTCG.",
   "video": "11.4"
  },
  {
   "type": "num",
   "q": "Land (basis $80,000) is exchanged for land worth $110,000 plus $15,000 cash. How much gain is recognized?",
   "a": 15000,
   "unit": "$",
   "why": "Realized 45,000; recognized is the lesser of boot (15,000) or realized gain.",
   "video": "11.5"
  },
  {
   "type": "num",
   "q": "In that exchange, what is the basis of the new land?",
   "a": 80000,
   "unit": "$",
   "why": "80,000 + 15,000 recognized − 15,000 boot = 80,000.",
   "video": "11.5"
  },
  {
   "type": "num",
   "q": "Land with a $30,000 basis is sold for $120,000, payable $40,000 a year for 3 years. What gain is recognized in each year?",
   "a": 30000,
   "unit": "$",
   "why": "Gross profit % = 90,000 ÷ 120,000 = 75%; 75% × 40,000 = 30,000.",
   "video": "11.6"
  }
 ],
 "12": [
  {
   "type": "mcq",
   "q": "An accrual-method employer declares a bonus on December 28, 2026 and pays it on April 2, 2027. When does it deduct the bonus?",
   "opts": [
    "2026",
    "2027",
    "Half in each year",
    "Never"
   ],
   "a": 1,
   "why": "Payment after March 15 misses the 2½-month window, so the deduction waits until 2027.",
   "video": "12.1"
  },
  {
   "type": "num",
   "q": "A single server has $30,000 of qualified tips and MAGI of $160,000. What is the tips deduction?",
   "a": 24000,
   "unit": "$",
   "why": "Cap 25,000, reduced by $100 per $1,000 over 150,000: 25,000 − 1,000 = 24,000.",
   "video": "12.2"
  },
  {
   "type": "num",
   "q": "A worker paid $24 an hour works 200 FLSA overtime hours at $36. What is the qualified overtime deduction?",
   "a": 2400,
   "unit": "$",
   "why": "Only the $12 premium counts: 12 × 200 = 2,400.",
   "video": "12.2"
  },
  {
   "type": "sort",
   "q": "Points toward employee or contractor?",
   "cats": [
    "Employee",
    "Contractor"
   ],
   "items": [
    [
     "Business sets hours",
     0
    ],
    [
     "Worker uses own equipment",
     1
    ],
    [
     "Worker gets health benefits",
     0
    ],
    [
     "Worker serves many clients",
     1
    ],
    [
     "Business trains the worker",
     0
    ],
    [
     "Worker can make or lose money",
     1
    ]
   ],
   "why": "Control over the work, finances and relationship decide status.",
   "video": "12.3"
  },
  {
   "type": "num",
   "q": "NQOs: 2,000 shares, exercise price $15, value at exercise $40. Ordinary income at exercise?",
   "a": 50000,
   "unit": "$",
   "why": "(40 − 15) × 2,000 = 50,000.",
   "video": "12.4"
  },
  {
   "type": "mcq",
   "q": "ISOs are exercised in March 2026 (granted 2023) and the shares are sold in December 2026 at a gain. What is the result?",
   "opts": [
    "All long-term capital gain",
    "Disqualifying disposition: bargain element is ordinary income",
    "No tax until 2027",
    "All short-term capital gain"
   ],
   "a": 1,
   "why": "The shares weren't held one year from exercise.",
   "video": "12.4"
  },
  {
   "type": "num",
   "q": "Restricted shares worth $5,000 at grant and $45,000 at vesting. With an 83(b) election, how much ordinary income is there in total?",
   "a": 5000,
   "unit": "$",
   "why": "With the election, only the value at grant is ordinary income; growth is capital gain on sale.",
   "video": "12.5"
  },
  {
   "type": "mcq",
   "q": "An employer pays employees a flat $200 a month 'car allowance' with no mileage records. How is it treated?",
   "opts": [
    "Tax-free reimbursement",
    "Taxable wages",
    "Deductible by the employee",
    "A de minimis fringe"
   ],
   "a": 1,
   "why": "Without substantiation it's a nonaccountable plan, so the allowance is wages.",
   "video": "12.6"
  }
 ],
 "13": [
  {
   "type": "match",
   "q": "Match each feature to the plan type.",
   "pairs": [
    [
     "Promises a pension formula",
     "Defined benefit"
    ],
    [
     "Employee bears investment risk",
     "Defined contribution"
    ],
    [
     "No contribution limit, unsecured",
     "Nonqualified deferred compensation"
    ]
   ],
   "why": "DB promises a benefit, DC a contribution; NQDC is an unsecured promise outside the qualified plan rules.",
   "video": "13.1"
  },
  {
   "type": "num",
   "q": "A 55-year-old's maximum 2026 401(k) employee deferral, including catch-up?",
   "a": 32500,
   "unit": "$",
   "why": "24,500 + 8,000 = 32,500.",
   "video": "13.2"
  },
  {
   "type": "mcq",
   "q": "A worker expects her tax rate to be much higher in retirement. Which is better?",
   "opts": [
    "Traditional 401(k)",
    "Roth 401(k)",
    "No difference",
    "A taxable account"
   ],
   "a": 1,
   "why": "Paying tax at today's lower rate and withdrawing tax-free wins when rates rise.",
   "video": "13.2"
  },
  {
   "type": "num",
   "q": "A 40-year-old in the 22% bracket withdraws $8,000 from a traditional IRA with no exception. Federal tax plus penalty?",
   "a": 2560,
   "unit": "$",
   "why": "22% × 8,000 = 1,760 + 10% penalty 800 = 2,560.",
   "video": "13.3"
  },
  {
   "type": "mcq",
   "q": "Which withdrawal escapes the 10% penalty?",
   "opts": [
    "A 50-year-old's IRA withdrawal for a boat",
    "A 58-year-old who left her employer at 56, from that employer's 401(k)",
    "A 45-year-old's 401(k) loan default",
    "A 30-year-old's IRA withdrawal for a car"
   ],
   "a": 1,
   "why": "Separation from service in or after the year you turn 55 exempts distributions from that employer's plan.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "A 52-year-old with $60,000 of wages: maximum total IRA contribution for 2026?",
   "a": 8600,
   "unit": "$",
   "why": "7,500 + 1,100 catch-up = 8,600.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "A sole proprietor has net profit of $50,000 and SE tax of $7,065. What is the maximum SEP contribution?",
   "a": 9294,
   "tol": 2,
   "unit": "$",
   "why": "(50,000 − 3,532.50) × 20% = 9,293.50.",
   "video": "13.5"
  },
  {
   "type": "mcq",
   "q": "Under Section 409A, what happens if a deferred compensation plan breaks the rules?",
   "opts": [
    "Nothing until payment",
    "Deferred amounts are taxed now, plus a 20% penalty",
    "The employer loses its deduction forever",
    "The plan becomes qualified"
   ],
   "a": 1,
   "why": "409A failures accelerate income and add a 20% additional tax.",
   "video": "13.6"
  }
 ],
 "14": [
  {
   "type": "num",
   "q": "A married couple sells their main home of 12 years at a $560,000 gain. How much is taxable?",
   "a": 60000,
   "unit": "$",
   "why": "560,000 − 500,000 exclusion = 60,000.",
   "video": "14.1"
  },
  {
   "type": "mcq",
   "q": "Which owner qualifies for the full exclusion?",
   "opts": [
    "Owned 5 years, lived in it 1 year",
    "Owned and lived in it 3 of the last 5 years",
    "Lived in it 4 years as a renter, owned 1 year",
    "Owned and lived in it 18 months, sold to buy a bigger home"
   ],
   "a": 1,
   "why": "Both the ownership and use tests need 2 of the last 5 years; wanting a bigger home is not an unforeseen circumstance.",
   "video": "14.1"
  },
  {
   "type": "num",
   "q": "A single owner sells after 9 months because of a job transfer. What is the maximum exclusion?",
   "a": 93750,
   "unit": "$",
   "why": "9/24 × 250,000 = 93,750.",
   "video": "14.2"
  },
  {
   "type": "sort",
   "q": "Is the interest deductible as qualified residence interest?",
   "cats": [
    "Yes",
    "No"
   ],
   "items": [
    [
     "$500,000 mortgage to buy a main home",
     0
    ],
    [
     "Home equity loan used to buy a car",
     1
    ],
    [
     "Loan to build a second home",
     0
    ],
    [
     "Home equity loan used to add a garage",
     0
    ],
    [
     "Home equity loan used for tuition",
     1
    ]
   ],
   "why": "Only debt used to buy, build or substantially improve a qualified residence counts.",
   "video": "14.3"
  },
  {
   "type": "num",
   "q": "Points of $3,600 are paid on a 30-year refinance in January. How much is deductible in the first year?",
   "a": 120,
   "unit": "$",
   "why": "3,600 ÷ 30 = 120 a year.",
   "video": "14.3"
  },
  {
   "type": "num",
   "q": "A home sells on day 146 of a 365-day year (the seller owned it 146 days). Annual property tax is $5,475. What is the seller's share?",
   "a": 2190,
   "unit": "$",
   "why": "146/365 × 5,475 = 2,190.",
   "video": "14.4"
  },
  {
   "type": "mcq",
   "q": "A family rents its home for 12 days for $3,600. How is the rent taxed?",
   "opts": [
    "Fully taxable",
    "Taxable less expenses",
    "Tax-free, no rental deductions",
    "Half taxable"
   ],
   "a": 2,
   "why": "Rentals of fewer than 15 days are excluded.",
   "video": "14.5"
  },
  {
   "type": "order",
   "q": "Put the formula in order.",
   "items": [
    "Gross income",
    "Deductions for AGI",
    "Standard or itemized deduction",
    "Taxable income",
    "Credits",
    "Payments"
   ],
   "why": "This is the structure behind every lecture.",
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
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct414-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct414-" + n, state = store(key) || { done: [] }, cur = 0;
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
