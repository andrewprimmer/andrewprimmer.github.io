/* End-of-lecture exercises for ACCT 341 Cost Accounting II.
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
   "q": "Variable, fixed or mixed for Tallgrass?",
   "cats": [
    "Variable",
    "Fixed",
    "Mixed"
   ],
   "items": [
    [
     "Battery packs",
     0
    ],
    [
     "Factory lease",
     1
    ],
    [
     "Electricity with a base charge",
     2
    ],
    [
     "Tires",
     0
    ],
    [
     "Insurance",
     1
    ]
   ],
   "why": "Variable costs move with output, fixed don't, mixed have both parts.",
   "video": "1.1"
  },
  {
   "type": "num",
   "q": "Cost = $5,000 + $6 per hour. What is total cost at 2,500 hours?",
   "a": 20000,
   "unit": "$",
   "why": "5,000 + 15,000 = 20,000.",
   "video": "1.1"
  },
  {
   "type": "match",
   "q": "Match each estimation method.",
   "pairs": [
    [
     "Time-and-motion study",
     "Industrial engineering"
    ],
    [
     "Pooling expert opinions",
     "Conference"
    ],
    [
     "Classifying ledger accounts",
     "Account analysis"
    ],
    [
     "Fitting past data",
     "Quantitative analysis"
    ]
   ],
   "why": "These are the four methods.",
   "video": "1.2"
  },
  {
   "type": "num",
   "q": "High: 8,000 hours, $52,000. Low: 3,000 hours, $27,000. What is the variable cost per hour?",
   "a": 5,
   "tol": 0.01,
   "unit": "$",
   "why": "25,000 ÷ 5,000 = 5.",
   "video": "1.3"
  },
  {
   "type": "num",
   "q": "Same data: what is the fixed cost?",
   "a": 12000,
   "unit": "$",
   "why": "52,000 − 5 × 8,000 = 12,000.",
   "video": "1.3"
  },
  {
   "type": "mcq",
   "q": "A regression has r-squared 0.92. What does that mean?",
   "opts": [
    "The slope is 0.92",
    "92% of the variation in cost is explained by the driver",
    "Cost rises 92% with the driver",
    "The prediction is 92% accurate"
   ],
   "a": 1,
   "why": "R-squared is the share of variation explained.",
   "video": "1.4"
  },
  {
   "type": "sort",
   "q": "Place each cost in the cost hierarchy.",
   "cats": [
    "Unit",
    "Batch",
    "Product-sustaining",
    "Facility-sustaining"
   ],
   "items": [
    [
     "Motor for each bike",
     0
    ],
    [
     "Machine setup per run",
     1
    ],
    [
     "Design of the cargo model",
     2
    ],
    [
     "Plant security",
     3
    ]
   ],
   "why": "The hierarchy groups costs by what drives them.",
   "video": "1.5"
  },
  {
   "type": "num",
   "q": "80% cumulative average-time curve, first unit 200 hours. What is the total time for 4 units?",
   "a": 512,
   "unit": "hrs",
   "why": "Average for 4 = 200 × 0.8 × 0.8 = 128; × 4 = 512.",
   "video": "1.6"
  }
 ],
 "2": [
  {
   "type": "order",
   "q": "Put the analytics steps in order.",
   "items": [
    "Understand the business problem",
    "Understand the data",
    "Prepare the data",
    "Build the model",
    "Evaluate the model",
    "Deploy and monitor"
   ],
   "why": "Start with the business question; end by monitoring.",
   "video": "2.1"
  },
  {
   "type": "match",
   "q": "Match each question to its type of analytics.",
   "pairs": [
    [
     "What were last year's late accounts?",
     "Descriptive"
    ],
    [
     "Which dealers will pay late?",
     "Predictive"
    ],
    [
     "Should we require prepayment?",
     "Prescriptive"
    ]
   ],
   "why": "What happened, what will happen, what to do.",
   "video": "2.1"
  },
  {
   "type": "mcq",
   "q": "In a decision tree, what is a feature?",
   "opts": [
    "The predicted class",
    "A variable the tree splits on",
    "The test set",
    "The final leaf"
   ],
   "a": 1,
   "why": "Features are input variables used for splits.",
   "video": "2.2"
  },
  {
   "type": "num",
   "q": "A group of 50 dealers has 10 late payers. What is its Gini impurity (to 2 decimals)?",
   "a": 0.32,
   "tol": 0.005,
   "unit": "",
   "why": "1 − (0.2² + 0.8²) = 0.32.",
   "video": "2.3"
  },
  {
   "type": "mcq",
   "q": "A tree scores 99% on training data and 68% on test data. What is the likely problem?",
   "opts": [
    "Underfitting",
    "Overfitting",
    "Too little training data used",
    "Wrong business question"
   ],
   "a": 1,
   "why": "A large gap between training and test accuracy signals overfitting.",
   "video": "2.4"
  },
  {
   "type": "num",
   "q": "TP 30, FP 10, FN 20, TN 140. What is precision, in percent?",
   "a": 75,
   "tol": 0.1,
   "unit": "%",
   "why": "30 ÷ 40 = 75%.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "Same matrix: what is recall, in percent?",
   "a": 60,
   "tol": 0.1,
   "unit": "%",
   "why": "30 ÷ 50 = 60%.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "Each true positive saves $2,500 and each false positive costs $600. TP 20, FP 15. What is the net benefit?",
   "a": 41000,
   "unit": "$",
   "why": "50,000 − 9,000 = 41,000.",
   "video": "2.6"
  }
 ],
 "3": [
  {
   "type": "num",
   "q": "Price $1,800, variable cost $1,080. What is the contribution margin ratio, in percent?",
   "a": 40,
   "tol": 0.1,
   "unit": "%",
   "why": "720 ÷ 1,800 = 40%.",
   "video": "3.1"
  },
  {
   "type": "num",
   "q": "Fixed costs $360,000, CM per unit $720. Breakeven units?",
   "a": 500,
   "unit": "units",
   "why": "360,000 ÷ 720 = 500.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "Fixed costs $360,000, CM ratio 40%. Breakeven revenue?",
   "a": 900000,
   "unit": "$",
   "why": "360,000 ÷ 0.40 = 900,000.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "Fixed costs $360,000, CM $720, target net income $108,000, tax rate 25%. Units needed?",
   "a": 700,
   "unit": "units",
   "why": "OI 144,000; 504,000 ÷ 720 = 700.",
   "video": "3.3"
  },
  {
   "type": "num",
   "q": "Budgeted revenue $1,200,000; breakeven revenue $900,000. Margin of safety as a percentage of budget?",
   "a": 25,
   "tol": 0.1,
   "unit": "%",
   "why": "300,000 ÷ 1,200,000 = 25%.",
   "video": "3.4"
  },
  {
   "type": "mcq",
   "q": "A $20,000 promotion is expected to add 25 sales at a CM of $700. Should Tallgrass run it?",
   "opts": [
    "No: income falls $2,500",
    "Yes: income rises $2,500",
    "Yes: income rises $17,500",
    "No: CM falls"
   ],
   "a": 0,
   "why": "25 × 700 = 17,500 of extra contribution, less 20,000 of cost: income falls $2,500.",
   "video": "3.4"
  },
  {
   "type": "num",
   "q": "CM $600,000 and operating income $150,000. What is the degree of operating leverage?",
   "a": 4,
   "tol": 0.01,
   "unit": "",
   "why": "600,000 ÷ 150,000 = 4.",
   "video": "3.5"
  },
  {
   "type": "num",
   "q": "Mix 2 A : 1 B; CM A $100, B $250; fixed costs $90,000. How many bundles to break even?",
   "a": 200,
   "unit": "bundles",
   "why": "Bundle CM 450; 90,000 ÷ 450 = 200.",
   "video": "3.6"
  }
 ],
 "4": [
  {
   "type": "match",
   "q": "Match the budget type.",
   "pairs": [
    [
     "Adds a month as one ends",
     "Rolling"
    ],
    [
     "Builds in continuous cost cuts",
     "Kaizen"
    ],
    [
     "Pulls all budgets together",
     "Master budget"
    ]
   ],
   "why": "These are common budget forms.",
   "video": "4.1"
  },
  {
   "type": "order",
   "q": "Put the operating budgets in order.",
   "items": [
    "Revenue budget",
    "Production budget",
    "Direct materials budget",
    "Cost of goods sold budget",
    "Budgeted income statement"
   ],
   "why": "Sales drive production, which drives costs.",
   "video": "4.2"
  },
  {
   "type": "num",
   "q": "Budgeted sales 1,500; target ending FG 120; beginning FG 90. Units to produce?",
   "a": 1530,
   "unit": "units",
   "why": "1,500 + 120 − 90 = 1,530.",
   "video": "4.3"
  },
  {
   "type": "num",
   "q": "Production 1,530 bikes, 2 tires each. Beginning tires 400; target ending 500. Tires to purchase?",
   "a": 3160,
   "unit": "tires",
   "why": "Usage 3,060 + 500 − 400 = 3,160.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "Production 1,530 bikes × 5 hours × $30. Direct labor budget?",
   "a": 229500,
   "unit": "$",
   "why": "7,650 hours × 30 = 229,500.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "Beginning cash $50,000; collections $400,000; disbursements $445,000; minimum balance $35,000. How much must be borrowed?",
   "a": 30000,
   "unit": "$",
   "why": "Cash before financing 5,000; need 30,000 to reach 35,000.",
   "video": "4.5"
  },
  {
   "type": "num",
   "q": "Sales: May $300,000, June $350,000. 60% collected in month of sale, 40% next month. June collections?",
   "a": 330000,
   "unit": "$",
   "why": "60% × 350,000 + 40% × 300,000 = 210,000 + 120,000.",
   "video": "4.5"
  },
  {
   "type": "mcq",
   "q": "Which practice most reduces budgetary slack?",
   "opts": [
    "Paying bonuses only for beating the budget",
    "Rewarding accurate forecasts and using benchmarks",
    "Letting each manager set targets alone",
    "Cutting next year's budget by any unspent amount"
   ],
   "a": 1,
   "why": "Rewarding accuracy and comparing with benchmarks removes the incentive to pad.",
   "video": "4.6"
  }
 ],
 "5": [
  {
   "type": "match",
   "q": "Match each unit to its type of responsibility center.",
   "pairs": [
    [
     "Assembly plant",
     "Cost center"
    ],
    [
     "Dealer sales team",
     "Revenue center"
    ],
    [
     "Parts and accessories business",
     "Profit center"
    ],
    [
     "Whole division with its assets",
     "Investment center"
    ]
   ],
   "why": "Each center is accountable for what it controls.",
   "video": "5.1"
  },
  {
   "type": "mcq",
   "q": "Which question best guides who should explain a variance?",
   "opts": [
    "Who caused it?",
    "Who has the most information about it?",
    "Who has the biggest budget?",
    "Who is most senior?"
   ],
   "a": 1,
   "why": "Responsibility accounting holds the best-informed manager accountable for explaining an item.",
   "video": "5.2"
  },
  {
   "type": "num",
   "q": "Budget 700 units, actual 650, budgeted CM $120. Sales-volume variance (enter as a negative number if unfavorable)?",
   "a": -6000,
   "unit": "$",
   "why": "(650 − 700) × 120 = −6,000, unfavorable.",
   "video": "5.3"
  },
  {
   "type": "num",
   "q": "Total actual units 2,000; a product's mix rose from 30% to 35%; its budgeted CM is $40. Its sales-mix variance?",
   "a": 4000,
   "unit": "$",
   "why": "2,000 × 5% × 40 = 4,000 favorable.",
   "video": "5.4"
  },
  {
   "type": "num",
   "q": "Budgeted total units 1,000; actual 1,080; budgeted average CM $60. Sales-quantity variance?",
   "a": 4800,
   "unit": "$",
   "why": "80 × 60 = 4,800 favorable.",
   "video": "5.4"
  },
  {
   "type": "num",
   "q": "Actual market 50,000; actual share 9%, budgeted share 10%; budgeted average CM $30. Market-share variance (negative if unfavorable)?",
   "a": -15000,
   "unit": "$",
   "why": "50,000 × (−1%) × 30 = −15,000.",
   "video": "5.5"
  },
  {
   "type": "order",
   "q": "Order the variances from broadest to narrowest.",
   "items": [
    "Sales-volume variance",
    "Sales-quantity variance",
    "Market-share variance"
   ],
   "why": "Volume splits into mix and quantity; quantity into share and size.",
   "video": "5.6"
  },
  {
   "type": "mcq",
   "q": "The market grew but Tallgrass's units fell. Which variance must be unfavorable?",
   "opts": [
    "Market-size",
    "Market-share",
    "Sales-mix",
    "None"
   ],
   "a": 1,
   "why": "A growing market gives a favorable size variance, so falling units mean share was lost.",
   "video": "5.6"
  }
 ],
 "6": [
  {
   "type": "mcq",
   "q": "Which cost is inventoried under absorption costing but not variable costing?",
   "opts": [
    "Direct materials",
    "Variable overhead",
    "Fixed manufacturing overhead",
    "Sales commissions"
   ],
   "a": 2,
   "why": "Only fixed manufacturing overhead differs.",
   "video": "6.1"
  },
  {
   "type": "num",
   "q": "Variable manufacturing cost $40; fixed MOH $200,000; production 10,000 units. Absorption inventory cost per unit?",
   "a": 60,
   "unit": "$",
   "why": "40 + 200,000 ÷ 10,000 = 60.",
   "video": "6.1"
  },
  {
   "type": "num",
   "q": "Fixed MOH per unit $20; beginning inventory 1,000 units; ending 1,500. How much higher is absorption income?",
   "a": 10000,
   "unit": "$",
   "why": "(1,500 − 1,000) × 20 = 10,000.",
   "video": "6.2"
  },
  {
   "type": "mcq",
   "q": "Sales exceed production. Which is true?",
   "opts": [
    "Absorption income is higher",
    "Variable income is higher",
    "They're equal",
    "Neither can be computed"
   ],
   "a": 1,
   "why": "Inventory falls, releasing fixed overhead under absorption costing.",
   "video": "6.2"
  },
  {
   "type": "mcq",
   "q": "Which measure best discourages overproduction?",
   "opts": [
    "Absorption operating income",
    "Inventory turnover target",
    "Units produced",
    "Gross margin"
   ],
   "a": 1,
   "why": "Targets on inventory, or variable-costing income, remove the incentive.",
   "video": "6.3"
  },
  {
   "type": "num",
   "q": "DM $30, DL $15, variable MOH $5, fixed MOH per unit $10. Throughput costing inventory cost per unit?",
   "a": 30,
   "unit": "$",
   "why": "Only direct materials are inventoried.",
   "video": "6.4"
  },
  {
   "type": "match",
   "q": "Match each capacity level.",
   "pairs": [
    [
     "No downtime at all",
     "Theoretical"
    ],
    [
     "Allows for unavoidable downtime",
     "Practical"
    ],
    [
     "Average demand over several years",
     "Normal utilization"
    ],
    [
     "This year's planned output",
     "Master-budget utilization"
    ]
   ],
   "why": "These are the four denominator choices.",
   "video": "6.5"
  },
  {
   "type": "num",
   "q": "Fixed MOH $360,000; practical capacity 1,800 units; actual 1,500. Cost of unused capacity?",
   "a": 60000,
   "unit": "$",
   "why": "Rate 200; 300 unused × 200 = 60,000.",
   "video": "6.6"
  }
 ],
 "7": [
  {
   "type": "sort",
   "q": "Relevant or irrelevant to a decision about accepting an extra order (idle capacity)?",
   "cats": [
    "Relevant",
    "Irrelevant"
   ],
   "items": [
    [
     "Direct materials for the order",
     0
    ],
    [
     "Factory lease",
     1
    ],
    [
     "Shipping for the order",
     0
    ],
    [
     "Last year's R&D",
     1
    ],
    [
     "Allocated head-office costs",
     1
    ]
   ],
   "why": "Relevant costs are future and differ between alternatives.",
   "video": "7.1"
  },
  {
   "type": "num",
   "q": "Special order: 200 units at $70; variable cost $52 a unit; idle capacity. Change in operating income?",
   "a": 3600,
   "unit": "$",
   "why": "200 × (70 − 52) = 3,600.",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "Make: variable $30 a unit for 4,000 units, plus $20,000 of avoidable fixed cost. Buy: $34 a unit. How much does buying save compared with making?",
   "a": 4000,
   "unit": "$",
   "why": "Make: 4,000 × 30 + 20,000 = 140,000. Buy: 4,000 × 34 = 136,000. Buying saves 4,000.",
   "video": "7.3"
  },
  {
   "type": "mcq",
   "q": "In that make-or-buy, what should the company do?",
   "opts": [
    "Make",
    "Buy",
    "Indifferent",
    "Need allocated costs"
   ],
   "a": 1,
   "why": "Relevant cost to make 120,000 + 20,000 = 140,000; buying costs 136,000.",
   "video": "7.3"
  },
  {
   "type": "num",
   "q": "Product A: CM $40, 2 machine hours. Product B: CM $75, 5 machine hours. CM per machine hour for the better product?",
   "a": 20,
   "unit": "$",
   "why": "A: 20; B: 15. A is better.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "A line has CM $80,000, avoidable fixed $55,000, allocated fixed $40,000. Change in operating income if dropped (negative if it falls)?",
   "a": -25000,
   "unit": "$",
   "why": "Lose 80,000, save 55,000: −25,000.",
   "video": "7.5"
  },
  {
   "type": "mcq",
   "q": "Which is irrelevant to replacing a machine?",
   "opts": [
    "New machine cost",
    "Old machine disposal value",
    "Old machine book value",
    "Future operating costs"
   ],
   "a": 2,
   "why": "Book value is sunk.",
   "video": "7.6"
  },
  {
   "type": "num",
   "q": "Keep old machine: operating costs $90,000 over its life. Replace: new cost $60,000, disposal of old $8,000, operating $35,000. Saving from replacing?",
   "a": 3000,
   "unit": "$",
   "why": "Replace 60,000 − 8,000 + 35,000 = 87,000 vs 90,000.",
   "video": "7.6"
  }
 ],
 "8": [
  {
   "type": "match",
   "q": "Match the influence to its role.",
   "pairs": [
    [
     "Customers",
     "Set the ceiling: what they'll pay"
    ],
    [
     "Competitors",
     "Limit what's possible"
    ],
    [
     "Costs",
     "Set the long-run floor"
    ]
   ],
   "why": "All three shape prices.",
   "video": "8.1"
  },
  {
   "type": "num",
   "q": "Target price $1,500; target operating income 20% of price. Target cost?",
   "a": 1200,
   "unit": "$",
   "why": "1,500 − 300 = 1,200.",
   "video": "8.2"
  },
  {
   "type": "num",
   "q": "Current full cost $1,320; target cost $1,200. Cost gap?",
   "a": 120,
   "unit": "$",
   "why": "1,320 − 1,200 = 120.",
   "video": "8.2"
  },
  {
   "type": "mcq",
   "q": "Value engineering aims to:",
   "opts": [
    "Cut every feature",
    "Cut costs while keeping what customers value",
    "Raise prices",
    "Reduce only manufacturing costs"
   ],
   "a": 1,
   "why": "It reviews the whole value chain and keeps valued features.",
   "video": "8.3"
  },
  {
   "type": "num",
   "q": "Full cost $480; markup 25%. Cost-plus price?",
   "a": 600,
   "unit": "$",
   "why": "480 × 1.25 = 600.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "Invested capital $2,000,000; target ROI 15%; 5,000 units; full cost $400. Required markup percentage?",
   "a": 15,
   "tol": 0.1,
   "unit": "%",
   "why": "300,000 ÷ 5,000 = 60 per unit; 60 ÷ 400 = 15%.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "Life-cycle costs: R&D $300,000, manufacturing $1,200,000, marketing $250,000, service $50,000; 6,000 units. Cost per unit?",
   "a": 300,
   "unit": "$",
   "why": "1,800,000 ÷ 6,000 = 300.",
   "video": "8.5"
  },
  {
   "type": "sort",
   "q": "Legal or illegal?",
   "cats": [
    "Generally legal",
    "Illegal"
   ],
   "items": [
    [
     "Student discount",
     0
    ],
    [
     "Agreeing prices with a rival",
     1
    ],
    [
     "Pricing below cost to bankrupt a competitor",
     1
    ],
    [
     "Higher prices in peak season",
     0
    ],
    [
     "Volume discount justified by lower cost to serve",
     0
    ]
   ],
   "why": "Price differences must be justified; collusion and predation are illegal.",
   "video": "8.6"
  }
 ],
 "9": [
  {
   "type": "match",
   "q": "Match each base to its criterion.",
   "pairs": [
    [
     "HR cost by headcount",
     "Cause and effect"
    ],
    [
     "Website cost by revenue",
     "Benefits received"
    ],
    [
     "Charging the most profitable unit more",
     "Ability to bear"
    ]
   ],
   "why": "Cause and effect and benefits received are the preferred criteria.",
   "video": "9.1"
  },
  {
   "type": "num",
   "q": "IT costs $150,000; tickets: Bikes 1,200, Parts 800. Parts' share?",
   "a": 60000,
   "unit": "$",
   "why": "800 ÷ 2,000 × 150,000 = 60,000.",
   "video": "9.2"
  },
  {
   "type": "num",
   "q": "List price $2,400; discount 12%. Net price?",
   "a": 2112,
   "unit": "$",
   "why": "2,400 × 0.88 = 2,112.",
   "video": "9.3"
  },
  {
   "type": "sort",
   "q": "Place each cost in the customer cost hierarchy.",
   "cats": [
    "Unit",
    "Batch",
    "Customer-sustaining",
    "Corporate-sustaining"
   ],
   "items": [
    [
     "Warranty per bike",
     0
    ],
    [
     "Delivery truck",
     1
    ],
    [
     "Sales visit",
     2
    ],
    [
     "CEO's salary",
     3
    ],
    [
     "Order processing",
     1
    ]
   ],
   "why": "Each level has a different driver.",
   "video": "9.4"
  },
  {
   "type": "num",
   "q": "Rates: order $40, delivery $300, visit $250. A dealer: 15 orders, 15 deliveries, 4 visits. Customer-level cost?",
   "a": 6100,
   "unit": "$",
   "why": "600 + 4,500 + 1,000 = 6,100.",
   "video": "9.4"
  },
  {
   "type": "num",
   "q": "Gross margin $18,000; customer-level costs $6,100. Customer-level income?",
   "a": 11900,
   "unit": "$",
   "why": "18,000 − 6,100 = 11,900.",
   "video": "9.5"
  },
  {
   "type": "mcq",
   "q": "In a whale curve, the most profitable customers often generate:",
   "opts": [
    "Exactly 100% of profit",
    "More than 100% of profit",
    "Less than 50% of profit",
    "No profit"
   ],
   "a": 1,
   "why": "Loss-making customers pull cumulative profit back down.",
   "video": "9.5"
  },
  {
   "type": "mcq",
   "q": "Which is NOT a sensible response to a loss-making dealer?",
   "opts": [
    "Minimum order sizes",
    "Fees for rush deliveries",
    "Bigger discounts with more visits",
    "Combined shipments"
   ],
   "a": 2,
   "why": "More discounts and visits raise the cost to serve.",
   "video": "9.6"
  }
 ],
 "10": [
  {
   "type": "match",
   "q": "Match the strategy to its feature.",
   "pairs": [
    [
     "Differentiation",
     "Premium price for unique value"
    ],
    [
     "Cost leadership",
     "Lowest cost, low price"
    ]
   ],
   "why": "Two broad strategies.",
   "video": "10.1"
  },
  {
   "type": "sort",
   "q": "Which perspective does each measure belong to?",
   "cats": [
    "Financial",
    "Customer",
    "Internal process",
    "Learning and growth"
   ],
   "items": [
    [
     "Operating income growth",
     0
    ],
    [
     "Market share",
     1
    ],
    [
     "Warranty claims per 100 bikes",
     2
    ],
    [
     "Training hours per employee",
     3
    ],
    [
     "Dealer satisfaction",
     1
    ],
    [
     "Assembly time per bike",
     2
    ]
   ],
   "why": "Each perspective captures a different link in the strategy.",
   "video": "10.2"
  },
  {
   "type": "mcq",
   "q": "Which is a lagging indicator?",
   "opts": [
    "Employee certification rate",
    "Return on investment",
    "Defect rate",
    "Customer satisfaction"
   ],
   "a": 1,
   "why": "Financial results report what has already happened.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "100 more bikes sold; 2026 margin per bike before fixed costs $1,104. Growth component?",
   "a": 110400,
   "unit": "$",
   "why": "100 × 1,104 = 110,400.",
   "video": "10.4"
  },
  {
   "type": "num",
   "q": "Assembly hours actually used 6,600; hours that 2026 productivity would need 7,700; 2027 rate $30. Productivity component?",
   "a": 33000,
   "unit": "$",
   "why": "1,100 hours saved × 30 = 33,000 favorable.",
   "video": "10.4"
  },
  {
   "type": "sort",
   "q": "Engineered or discretionary?",
   "cats": [
    "Engineered",
    "Discretionary"
   ],
   "items": [
    [
     "Battery packs",
     0
    ],
    [
     "Advertising",
     1
    ],
    [
     "Assembly labor",
     0
    ],
    [
     "R&D",
     1
    ],
    [
     "Employee training",
     1
    ]
   ],
   "why": "Engineered costs have a clear link to output.",
   "video": "10.5"
  },
  {
   "type": "num",
   "q": "Capacity 21,600 hours; 3,200 bikes × 6 hours needed; $30 an hour. Cost of unused capacity?",
   "a": 72000,
   "unit": "$",
   "why": "Unused 2,400 hours × 30 = 72,000.",
   "video": "10.5"
  },
  {
   "type": "mcq",
   "q": "Which is a scorecard pitfall?",
   "opts": [
    "Linking measures to rewards",
    "Using 60 unrelated measures",
    "Including nonfinancial measures",
    "Reviewing the scorecard yearly"
   ],
   "a": 1,
   "why": "Too many unlinked measures destroy focus.",
   "video": "10.6"
  }
 ],
 "11": [
  {
   "type": "match",
   "q": "Match the problem to the type of quality.",
   "pairs": [
    [
     "Range too short for commuters",
     "Quality of design"
    ],
    [
     "Welds below specification",
     "Conformance quality"
    ]
   ],
   "why": "Design fits needs; conformance meets specs.",
   "video": "11.1"
  },
  {
   "type": "sort",
   "q": "Which cost-of-quality category?",
   "cats": [
    "Prevention",
    "Appraisal",
    "Internal failure",
    "External failure"
   ],
   "items": [
    [
     "Assembler training",
     0
    ],
    [
     "Final road test",
     1
    ],
    [
     "Rework of loose spokes",
     2
    ],
    [
     "Warranty repairs",
     3
    ],
    [
     "Supplier audits",
     0
    ],
    [
     "Product recall",
     3
    ]
   ],
   "why": "Four categories by when the cost arises.",
   "video": "11.2"
  },
  {
   "type": "num",
   "q": "Prevention $40,000, appraisal $55,000, internal failure $35,000, external failure $120,000; revenue $2,500,000. Cost of quality as % of revenue?",
   "a": 10,
   "tol": 0.1,
   "unit": "%",
   "why": "250,000 ÷ 2,500,000 = 10%.",
   "video": "11.2"
  },
  {
   "type": "match",
   "q": "Match the tool to its use.",
   "pairs": [
    [
     "Control chart",
     "Spot a process out of control"
    ],
    [
     "Pareto diagram",
     "Rank problems by frequency"
    ],
    [
     "Fishbone diagram",
     "Trace possible causes"
    ]
   ],
   "why": "Spot, rank, trace.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Program cost $35,000; warranty savings $20,000; rework savings $6,000; 15 recovered sales at $900 CM. Net benefit?",
   "a": 4500,
   "unit": "$",
   "why": "20,000 + 6,000 + 13,500 − 35,000 = 4,500.",
   "video": "11.4"
  },
  {
   "type": "num",
   "q": "Orders 60 × 50 hours; capacity 4,000 hours. Average waiting time (hours)?",
   "a": 75,
   "unit": "hrs",
   "why": "60 × 2,500 = 150,000 ÷ (2 × 1,000) = 75.",
   "video": "11.5"
  },
  {
   "type": "mcq",
   "q": "Under the theory of constraints, throughput margin is:",
   "opts": [
    "Revenue − all variable costs",
    "Revenue − direct materials",
    "Revenue − full cost",
    "Contribution margin per bike"
   ],
   "a": 1,
   "why": "Only direct materials are treated as variable in the short run.",
   "video": "11.6"
  },
  {
   "type": "order",
   "q": "Put the theory-of-constraints steps in order.",
   "items": [
    "Identify the bottleneck",
    "Maximize throughput through it",
    "Subordinate other resources to it",
    "Relieve the bottleneck"
   ],
   "why": "Then repeat with the next constraint.",
   "video": "11.6"
  }
 ],
 "12": [
  {
   "type": "sort",
   "q": "Which kind of inventory cost?",
   "cats": [
    "Ordering",
    "Carrying",
    "Stockout"
   ],
   "items": [
    [
     "Freight on each shipment",
     0
    ],
    [
     "Warehouse insurance",
     1
    ],
    [
     "Return forgone on cash in stock",
     1
    ],
    [
     "Lost sale when out of batteries",
     2
    ],
    [
     "Receiving and inspection per order",
     0
    ]
   ],
   "why": "Ordering costs per order; carrying costs per unit held; stockout costs when you run out.",
   "video": "12.1"
  },
  {
   "type": "num",
   "q": "D = 3,200, P = $50, C = $8. EOQ?",
   "a": 200,
   "unit": "units",
   "why": "√(2 × 3,200 × 50 ÷ 8) = √40,000 = 200.",
   "video": "12.2"
  },
  {
   "type": "num",
   "q": "At an EOQ of 200 with D = 3,200 and P = $50, what is annual ordering cost?",
   "a": 800,
   "unit": "$",
   "why": "16 orders × 50 = 800.",
   "video": "12.2"
  },
  {
   "type": "num",
   "q": "Weekly usage 40; lead time 5 weeks; safety stock 60. Reorder point?",
   "a": 260,
   "unit": "units",
   "why": "200 + 60 = 260.",
   "video": "12.3"
  },
  {
   "type": "mcq",
   "q": "Why is the EOQ model described as robust?",
   "opts": [
    "It never needs inputs",
    "Total cost is flat near the optimum, so input errors cost little",
    "It includes all qualitative factors",
    "It eliminates safety stock"
   ],
   "a": 1,
   "why": "Moderate errors in P or C change total cost very little.",
   "video": "12.4"
  },
  {
   "type": "mcq",
   "q": "Which feature belongs to JIT production?",
   "opts": [
    "Large batches pushed by forecasts",
    "Production pulled by demand",
    "Big safety stocks",
    "Specialized single-skill workers"
   ],
   "a": 1,
   "why": "JIT is a pull system.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "JIT saves $6,000 of carrying cost, adds $3,500 of delivery cost and $1,000 of expected stockout cost. Net benefit?",
   "a": 1500,
   "unit": "$",
   "why": "6,000 − 3,500 − 1,000 = 1,500.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "Backflush at completion: 50 bikes; standard materials $1,100 and conversion $200 per bike. Debit to finished goods?",
   "a": 65000,
   "unit": "$",
   "why": "50 × 1,300 = 65,000.",
   "video": "12.6"
  }
 ],
 "13": [
  {
   "type": "order",
   "q": "Put the capital budgeting stages in order.",
   "items": [
    "Identify projects",
    "Search for alternatives",
    "Gather information",
    "Select",
    "Arrange financing",
    "Implement and audit"
   ],
   "why": "Six stages.",
   "video": "13.1"
  },
  {
   "type": "num",
   "q": "Annual inflow $50,000 for 5 years; annuity factor 3.791; investment $170,000. NPV?",
   "a": 19550,
   "unit": "$",
   "why": "189,550 − 170,000 = 19,550.",
   "video": "13.2"
  },
  {
   "type": "mcq",
   "q": "A project's IRR is 8% and the required rate is 10%. Its NPV at 10% is:",
   "opts": [
    "Positive",
    "Negative",
    "Zero",
    "Can't tell"
   ],
   "a": 1,
   "why": "Discounting at more than the IRR gives a negative NPV.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "Investment $250,000; annual cash inflow $62,500. Payback in years?",
   "a": 4,
   "tol": 0.01,
   "unit": "years",
   "why": "250,000 ÷ 62,500 = 4.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Annual cash savings $62,500; depreciation $50,000; investment $250,000. AARR in percent?",
   "a": 5,
   "tol": 0.1,
   "unit": "%",
   "why": "12,500 ÷ 250,000 = 5%.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Pre-tax savings $80,000; tax rate 25%; tax depreciation $40,000. Annual after-tax cash flow?",
   "a": 70000,
   "unit": "$",
   "why": "60,000 + 10,000 shield = 70,000.",
   "video": "13.5"
  },
  {
   "type": "mcq",
   "q": "Which is NOT a relevant cash flow?",
   "opts": [
    "Working capital needed",
    "Depreciation tax shield",
    "Last year's feasibility study",
    "After-tax disposal value"
   ],
   "a": 2,
   "why": "It's sunk.",
   "video": "13.5"
  },
  {
   "type": "mcq",
   "q": "A post-investment audit compares:",
   "opts": [
    "Two competing projects",
    "Actual results with the predictions used to approve the project",
    "NPV and IRR",
    "Book and tax depreciation"
   ],
   "a": 1,
   "why": "It checks predictions and improves future forecasts.",
   "video": "13.6"
  }
 ],
 "14": [
  {
   "type": "match",
   "q": "Match each transfer pricing method to when it fits best.",
   "pairs": [
    [
     "Market-based",
     "A competitive outside market exists"
    ],
    [
     "Cost-based",
     "No market price is available"
    ],
    [
     "Negotiated",
     "Divisions have autonomy to bargain"
    ]
   ],
   "why": "Three methods.",
   "video": "14.1"
  },
  {
   "type": "num",
   "q": "Variable cost $90; seller has idle capacity. Minimum transfer price?",
   "a": 90,
   "unit": "$",
   "why": "No opportunity cost.",
   "video": "14.2"
  },
  {
   "type": "num",
   "q": "Seller at full capacity: market price $150, variable cost $90, $5 selling cost saved internally. Minimum transfer price?",
   "a": 145,
   "unit": "$",
   "why": "85 incremental + 60 lost margin = 145.",
   "video": "14.2"
  },
  {
   "type": "mcq",
   "q": "The arm's-length standard requires related parties to:",
   "opts": [
    "Use full cost",
    "Price as unrelated parties would",
    "Use the lowest tax rate",
    "Negotiate freely"
   ],
   "a": 1,
   "why": "IRC Section 482 and OECD guidelines.",
   "video": "14.3"
  },
  {
   "type": "num",
   "q": "Operating income $360,000; investment $2,400,000. ROI in percent?",
   "a": 15,
   "tol": 0.1,
   "unit": "%",
   "why": "360 ÷ 2,400 = 15%.",
   "video": "14.4"
  },
  {
   "type": "num",
   "q": "Same division; required return 12%. Residual income?",
   "a": 72000,
   "unit": "$",
   "why": "360,000 − 288,000.",
   "video": "14.4"
  },
  {
   "type": "mcq",
   "q": "Division ROI 20%; required 10%; project return 14%. A manager judged on ROI will most likely:",
   "opts": [
    "Accept: it beats 10%",
    "Reject: it lowers ROI",
    "Be indifferent",
    "Accept: RI rises"
   ],
   "a": 1,
   "why": "The ROI trap.",
   "video": "14.5"
  },
  {
   "type": "sort",
   "q": "Sort each topic into the part of the course where it belongs.",
   "cats": [
    "Planning",
    "Decisions",
    "Performance and control"
   ],
   "items": [
    [
     "Master budget",
     0
    ],
    [
     "CVP analysis",
     0
    ],
    [
     "Make or buy",
     1
    ],
    [
     "NPV",
     1
    ],
    [
     "Balanced scorecard",
     2
    ],
    [
     "Transfer pricing",
     2
    ]
   ],
   "why": "The course's three themes.",
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
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct341-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct341-" + n, state = store(key) || { done: [] }, cur = 0;
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
