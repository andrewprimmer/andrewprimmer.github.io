/* End-of-lecture exercises for ACCT 413 Cost Accounting I.
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
   "q": "Financial or management accounting?",
   "cats": [
    "Financial",
    "Management"
   ],
   "items": [
    [
     "Audited income statement",
     0
    ],
    [
     "Cost per trailer model",
     1
    ],
    [
     "Weekly scrap report",
     1
    ],
    [
     "Form 10-K",
     0
    ],
    [
     "Budget for next quarter",
     1
    ]
   ],
   "why": "Management accounting serves internal decisions; financial accounting serves outsiders under GAAP.",
   "video": "1.1"
  },
  {
   "type": "order",
   "q": "Put the value chain in order.",
   "items": [
    "Research and development",
    "Design",
    "Production",
    "Marketing",
    "Distribution",
    "Customer service"
   ],
   "why": "The value chain runs from R&D to after-sale service.",
   "video": "1.2"
  },
  {
   "type": "match",
   "q": "Match each cost to its value chain function.",
   "pairs": [
    [
     "Prototype testing",
     "Research and development"
    ],
    [
     "Welding labor",
     "Production"
    ],
    [
     "Dealer advertising",
     "Marketing"
    ],
    [
     "Warranty repairs",
     "Customer service"
    ]
   ],
   "why": "Every function creates costs.",
   "video": "1.2"
  },
  {
   "type": "order",
   "q": "Put the decision steps in order.",
   "items": [
    "Identify the problem",
    "Obtain information",
    "Make predictions",
    "Choose among alternatives",
    "Implement, evaluate and learn"
   ],
   "why": "Steps 1–4 are planning; step 5 is control.",
   "video": "1.3"
  },
  {
   "type": "num",
   "q": "A new line sells 80 trailers a year at $9,000; predicted cost is $7,500 each. What is the predicted annual margin before new fixed costs?",
   "a": 120000,
   "unit": "$",
   "why": "80 × (9,000 − 7,500) = 120,000.",
   "video": "1.3"
  },
  {
   "type": "mcq",
   "q": "Who is usually the chief management accountant?",
   "opts": [
    "Treasurer",
    "Controller",
    "Plant manager",
    "Internal auditor"
   ],
   "a": 1,
   "why": "The controller runs costing, budgeting and reporting.",
   "video": "1.4"
  },
  {
   "type": "order",
   "q": "Put these milestones in order.",
   "items": [
    "Wedgwood's costing",
    "Railroad cost per ton-mile",
    "Standard costs",
    "DuPont ROI formula",
    "Relevance Lost"
   ],
   "why": "1770s, 1850s, 1900s–1910s, 1914, 1987.",
   "video": "1.5"
  },
  {
   "type": "match",
   "q": "Match the action to the IMA standard it violates.",
   "pairs": [
    [
     "Keeping a supplier's gift",
     "Integrity"
    ],
    [
     "Leaking bid prices",
     "Confidentiality"
    ],
    [
     "Hiding a cost overrun",
     "Credibility"
    ],
    [
     "Ignoring new costing rules",
     "Competence"
    ]
   ],
   "why": "These are the IMA's four standards.",
   "video": "1.6"
  }
 ],
 "2": [
  {
   "type": "sort",
   "q": "Cost object: one trailer. Direct or indirect?",
   "cats": [
    "Direct",
    "Indirect"
   ],
   "items": [
    [
     "Axles",
     0
    ],
    [
     "Factory rent",
     1
    ],
    [
     "Welder's hours on it",
     0
    ],
    [
     "Supervisor's salary",
     1
    ],
    [
     "Custom paint",
     0
    ]
   ],
   "why": "Direct costs can be traced economically to the trailer.",
   "video": "2.1"
  },
  {
   "type": "num",
   "q": "Fixed lease $15,000 a month; 75 trailers built. What is lease cost per trailer?",
   "a": 200,
   "unit": "$",
   "why": "15,000 ÷ 75 = 200.",
   "video": "2.2"
  },
  {
   "type": "mcq",
   "q": "When output rises, what happens to variable cost per unit?",
   "opts": [
    "Rises",
    "Falls",
    "Stays constant",
    "Becomes fixed"
   ],
   "a": 2,
   "why": "Variable costs are constant per unit and change in total.",
   "video": "2.2"
  },
  {
   "type": "match",
   "q": "Match each item to its inventory.",
   "pairs": [
    [
     "Coil of steel",
     "Direct materials"
    ],
    [
     "Trailer frame being welded",
     "Work in process"
    ],
    [
     "Completed trailer awaiting pickup",
     "Finished goods"
    ]
   ],
   "why": "Manufacturers have three inventories.",
   "video": "2.3"
  },
  {
   "type": "sort",
   "q": "Inventoriable or period cost?",
   "cats": [
    "Inventoriable",
    "Period"
   ],
   "items": [
    [
     "Factory utilities",
     0
    ],
    [
     "Sales commissions",
     1
    ],
    [
     "Paint booth depreciation",
     0
    ],
    [
     "Advertising",
     1
    ],
    [
     "Direct labor",
     0
    ],
    [
     "Head office rent",
     1
    ]
   ],
   "why": "Only manufacturing costs are inventoriable.",
   "video": "2.4"
  },
  {
   "type": "num",
   "q": "DM $7,000, DL $2,600, overhead $3,100. What is prime cost?",
   "a": 9600,
   "unit": "$",
   "why": "7,000 + 2,600 = 9,600.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "Same job: what is conversion cost?",
   "a": 5700,
   "unit": "$",
   "why": "2,600 + 3,100 = 5,700.",
   "video": "2.5"
  },
  {
   "type": "num",
   "q": "A worker at $24 an hour works 46 hours (6 overtime at time-and-a-half), 2 of them idle. How much is direct labor?",
   "a": 1056,
   "unit": "$",
   "why": "44 productive hours × $24 = 1,056; the premium (72) and idle time (48) are overhead.",
   "video": "2.6"
  }
 ],
 "3": [
  {
   "type": "order",
   "q": "Put the cost flow in order.",
   "items": [
    "Materials inventory",
    "Work in process",
    "Finished goods",
    "Cost of goods sold"
   ],
   "why": "Costs follow the product through the factory.",
   "video": "3.1"
  },
  {
   "type": "num",
   "q": "Beginning DM $45,000, purchases $160,000, ending DM $38,000. What were direct materials used?",
   "a": 167000,
   "unit": "$",
   "why": "45,000 + 160,000 − 38,000 = 167,000.",
   "video": "3.2"
  },
  {
   "type": "num",
   "q": "DM used $167,000, DL $75,000, MOH $90,000, beginning WIP $50,000, ending WIP $62,000. What is COGM?",
   "a": 320000,
   "unit": "$",
   "why": "Incurred 332,000 + 50,000 − 62,000 = 320,000.",
   "video": "3.3"
  },
  {
   "type": "num",
   "q": "Beginning FG $28,000, COGM $320,000, ending FG $33,000. What is COGS?",
   "a": 315000,
   "unit": "$",
   "why": "28,000 + 320,000 − 33,000 = 315,000.",
   "video": "3.4"
  },
  {
   "type": "num",
   "q": "Revenue $450,000, COGS $315,000, period costs $85,000. What is operating income?",
   "a": 50000,
   "unit": "$",
   "why": "Gross margin 135,000 − 85,000 = 50,000.",
   "video": "3.4"
  },
  {
   "type": "match",
   "q": "Match the event to its debit.",
   "pairs": [
    [
     "Materials issued to production",
     "Work-in-process control"
    ],
    [
     "Trailers completed",
     "Finished goods control"
    ],
    [
     "Trailers sold",
     "Cost of goods sold"
    ],
    [
     "Factory utilities incurred",
     "Manufacturing overhead control"
    ]
   ],
   "why": "Each step moves cost to the next account.",
   "video": "3.5"
  },
  {
   "type": "mcq",
   "q": "Which statement is true?",
   "opts": [
    "COGM always equals manufacturing costs incurred",
    "COGM differs from costs incurred when WIP changes",
    "COGS always equals COGM",
    "Period costs pass through finished goods"
   ],
   "a": 1,
   "why": "Changes in WIP make COGM differ from costs incurred.",
   "video": "3.3"
  },
  {
   "type": "match",
   "q": "Match the purpose to the product cost.",
   "pairs": [
    [
     "Long-run pricing",
     "Full value-chain cost"
    ],
    [
     "Balance sheet inventory",
     "Manufacturing costs only"
    ],
    [
     "Cost-plus government contract",
     "Costs the contract allows"
    ]
   ],
   "why": "Different costs for different purposes.",
   "video": "3.6"
  }
 ],
 "4": [
  {
   "type": "sort",
   "q": "Job costing or process costing?",
   "cats": [
    "Job costing",
    "Process costing"
   ],
   "items": [
    [
     "Custom trailers",
     0
    ],
    [
     "Bottled milk",
     1
    ],
    [
     "Audit engagements",
     0
    ],
    [
     "Gasoline refining",
     1
    ],
    [
     "Wedding cakes",
     0
    ]
   ],
   "why": "Distinct units use job costing; identical units use process costing.",
   "video": "4.1"
  },
  {
   "type": "order",
   "q": "Put the job costing steps in order.",
   "items": [
    "Identify the job",
    "Trace direct costs",
    "Choose the cost-allocation base",
    "Identify the indirect cost pool",
    "Compute the indirect cost rate",
    "Allocate indirect costs",
    "Total the job cost"
   ],
   "why": "These are the seven steps.",
   "video": "4.2"
  },
  {
   "type": "num",
   "q": "Budgeted MOH $1,440,000; budgeted DLH 40,000. What is the budgeted rate per hour?",
   "a": 36,
   "unit": "$",
   "why": "1,440,000 ÷ 40,000 = 36.",
   "video": "4.3"
  },
  {
   "type": "mcq",
   "q": "Under normal costing, overhead applied to a job equals:",
   "opts": [
    "Actual rate × actual hours",
    "Budgeted rate × actual hours",
    "Budgeted rate × budgeted hours",
    "Actual overhead ÷ jobs"
   ],
   "a": 1,
   "why": "Normal costing uses the budgeted rate on the actual quantity of the base.",
   "video": "4.3"
  },
  {
   "type": "match",
   "q": "Match the document to what it records.",
   "pairs": [
    [
     "Materials requisition",
     "Materials issued to a job"
    ],
    [
     "Labor time record",
     "Hours worked on each job"
    ],
    [
     "Job cost record",
     "All costs of one job"
    ]
   ],
   "why": "Source documents feed the job cost record.",
   "video": "4.4"
  },
  {
   "type": "num",
   "q": "DM $5,500; DL 70 hours × $30; overhead $36 per DLH. Total job cost?",
   "a": 10120,
   "unit": "$",
   "why": "5,500 + 2,100 + 2,520 = 10,120.",
   "video": "4.5"
  },
  {
   "type": "num",
   "q": "A job costing $10,120 sells for $12,650. Gross margin percentage (one decimal)?",
   "a": 20,
   "tol": 0.1,
   "unit": "%",
   "why": "2,530 ÷ 12,650 = 20.0%.",
   "video": "4.5"
  },
  {
   "type": "num",
   "q": "An engagement: 300 professional hours at $55, support at 120% of labor. Total cost?",
   "a": 36300,
   "unit": "$",
   "why": "16,500 + 19,800 = 36,300.",
   "video": "4.6"
  }
 ],
 "5": [
  {
   "type": "match",
   "q": "Match the entry to the event.",
   "pairs": [
    [
     "Dr MOH control / Cr Utilities payable",
     "Actual overhead incurred"
    ],
    [
     "Dr WIP / Cr MOH allocated",
     "Overhead applied to jobs"
    ],
    [
     "Dr MOH allocated, Dr COGS / Cr MOH control",
     "Year-end write-off of underallocation"
    ]
   ],
   "why": "Actual and applied overhead travel separately until year-end.",
   "video": "5.1"
  },
  {
   "type": "num",
   "q": "Budgeted rate $32/DLH; actual DLH 25,000; actual overhead $812,000. Under- or overallocated by how much? (enter the amount)",
   "a": 12000,
   "unit": "$",
   "why": "Allocated 800,000; actual 812,000: underallocated 12,000.",
   "video": "5.2"
  },
  {
   "type": "mcq",
   "q": "Overhead is overallocated. What does that mean for job costs?",
   "opts": [
    "They were too low",
    "They were too high",
    "They were exactly right",
    "Only WIP is affected"
   ],
   "a": 1,
   "why": "More overhead was applied than was spent.",
   "video": "5.2"
  },
  {
   "type": "num",
   "q": "Actual overhead $812,000; actual DLH 25,000. What is the actual rate per DLH (two decimals)?",
   "a": 32.48,
   "tol": 0.01,
   "unit": "$",
   "why": "812,000 ÷ 25,000 = 32.48.",
   "video": "5.3"
  },
  {
   "type": "num",
   "q": "Underallocated $12,000; COGS holds 70% of allocated overhead. How much is added to COGS under proration?",
   "a": 8400,
   "unit": "$",
   "why": "70% × 12,000 = 8,400.",
   "video": "5.4"
  },
  {
   "type": "mcq",
   "q": "When is writing the whole difference off to COGS most appropriate?",
   "opts": [
    "When it is large",
    "When it is immaterial",
    "When inventories are large",
    "Never"
   ],
   "a": 1,
   "why": "Write-off is a practical choice for immaterial amounts.",
   "video": "5.5"
  },
  {
   "type": "num",
   "q": "Welding $60/MH, finishing $27/DLH. A job uses 15 MH and 40 DLH. Overhead?",
   "a": 1980,
   "unit": "$",
   "why": "900 + 1,080 = 1,980.",
   "video": "5.6"
  },
  {
   "type": "order",
   "q": "Rank the approaches from most to least accurate.",
   "items": [
    "Adjusted allocation rate",
    "Proration on allocated overhead",
    "Write-off to COGS"
   ],
   "why": "Recosting every job is the most accurate.",
   "video": "5.5"
  }
 ],
 "6": [
  {
   "type": "mcq",
   "q": "Under broad averaging, a low-volume, complex product is usually:",
   "opts": [
    "Overcosted",
    "Undercosted",
    "Correctly costed",
    "Not costed"
   ],
   "a": 1,
   "why": "It uses more batch and product-level resources than volume-based rates assign to it.",
   "video": "6.1"
  },
  {
   "type": "sort",
   "q": "Is each a refinement of a costing system?",
   "cats": [
    "Refinement",
    "Not a refinement"
   ],
   "items": [
    [
     "More direct tracing",
     0
    ],
    [
     "More activity cost pools",
     0
    ],
    [
     "One plant-wide rate",
     1
    ],
    [
     "Causal cost drivers",
     0
    ],
    [
     "Allocating everything by units produced",
     1
    ]
   ],
   "why": "Refinements trace more and match drivers to costs.",
   "video": "6.2"
  },
  {
   "type": "sort",
   "q": "Place each activity in the cost hierarchy.",
   "cats": [
    "Unit",
    "Batch",
    "Product-sustaining",
    "Facility-sustaining"
   ],
   "items": [
    [
     "Welding each trailer",
     0
    ],
    [
     "Setting up a run",
     1
    ],
    [
     "Designing a new model",
     2
    ],
    [
     "Plant insurance",
     3
    ]
   ],
   "why": "Each level has a different driver.",
   "video": "6.3"
  },
  {
   "type": "num",
   "q": "Setup pool $150,000; 250 setups. What is the rate per setup?",
   "a": 600,
   "unit": "$",
   "why": "150,000 ÷ 250 = 600.",
   "video": "6.4"
  },
  {
   "type": "num",
   "q": "Rates: design $120/hr, setups $1,200, welding $60/MH, finishing $10/DLH. A job uses 10 design hours, 1 setup, 25 MH and 90 DLH. ABC overhead?",
   "a": 4800,
   "unit": "$",
   "why": "1,200 + 1,200 + 1,500 + 900 = 4,800.",
   "video": "6.4"
  },
  {
   "type": "num",
   "q": "Plant-wide overhead per unit $2,520; ABC $1,900. By how much was the product overcosted per unit?",
   "a": 620,
   "unit": "$",
   "why": "2,520 − 1,900 = 620.",
   "video": "6.5"
  },
  {
   "type": "mcq",
   "q": "ABC changes which of these?",
   "opts": [
    "Total overhead",
    "How overhead is split among products",
    "Direct materials cost",
    "Cash spent on overhead"
   ],
   "a": 1,
   "why": "ABC reassigns the same total overhead.",
   "video": "6.5"
  },
  {
   "type": "mcq",
   "q": "Which condition makes ABC most worthwhile?",
   "opts": [
    "One product, little overhead",
    "Many diverse products, large overhead",
    "All costs are direct",
    "Products are identical"
   ],
   "a": 1,
   "why": "Diversity and large overhead create the distortions ABC fixes.",
   "video": "6.6"
  }
 ],
 "7": [
  {
   "type": "num",
   "q": "A livestock trailer sells for $16,400; DM + DL $8,600; ABC overhead $9,680. Margin per trailer (negative if a loss)?",
   "a": -1880,
   "unit": "$",
   "why": "16,400 − 18,280 = −1,880.",
   "video": "7.1"
  },
  {
   "type": "sort",
   "q": "Value-added or non-value-added?",
   "cats": [
    "Value-added",
    "Non-value-added"
   ],
   "items": [
    [
     "Welding the frame",
     0
    ],
    [
     "Reworking a bad weld",
     1
    ],
    [
     "Waiting for a machine setup",
     1
    ],
    [
     "Custom paint",
     0
    ],
    [
     "Moving parts between buildings",
     1
    ]
   ],
   "why": "Customers pay for transformation, not for waiting, moving or fixing mistakes.",
   "video": "7.2"
  },
  {
   "type": "mcq",
   "q": "When does cutting setup time actually save money?",
   "opts": [
    "Always",
    "Only if resources are reduced or the freed capacity is used",
    "Never",
    "Only under absorption costing"
   ],
   "a": 1,
   "why": "Freed time is just unused capacity unless spending falls or output rises.",
   "video": "7.2"
  },
  {
   "type": "num",
   "q": "Design hours fall from 24 to 8 per trailer at $120 an hour. Saving per trailer?",
   "a": 1920,
   "unit": "$",
   "why": "16 × 120 = 1,920.",
   "video": "7.3"
  },
  {
   "type": "num",
   "q": "Rates: $40 per order, $90 per delivery, $150 per rush. A customer: 20 orders, 20 deliveries, 4 rushes. Activity cost?",
   "a": 3200,
   "unit": "$",
   "why": "800 + 1,800 + 600 = 3,200.",
   "video": "7.4"
  },
  {
   "type": "num",
   "q": "A department costs $360,000 a year with 600,000 minutes of practical capacity. What is the cost per minute?",
   "a": 0.6,
   "tol": 0.001,
   "unit": "$",
   "why": "360,000 ÷ 600,000 = 0.60.",
   "video": "7.5"
  },
  {
   "type": "num",
   "q": "At $0.60 a minute, what does a 50-minute activity cost?",
   "a": 30,
   "unit": "$",
   "why": "50 × 0.60 = 30.",
   "video": "7.5"
  },
  {
   "type": "order",
   "q": "Put the activity-based budgeting steps in order.",
   "items": [
    "Forecast output",
    "Estimate activities needed",
    "Estimate resources required",
    "Budget the cost"
   ],
   "why": "Budgeting runs from output to activities to resources.",
   "video": "7.6"
  }
 ],
 "8": [
  {
   "type": "num",
   "q": "Costs $480,000; 16,000 units started and finished; no beginning or ending WIP. Cost per unit?",
   "a": 30,
   "unit": "$",
   "why": "480,000 ÷ 16,000 = 30.",
   "video": "8.1"
  },
  {
   "type": "num",
   "q": "5,000 units in ending WIP, 30% converted. Conversion equivalent units?",
   "a": 1500,
   "unit": "EU",
   "why": "5,000 × 30% = 1,500.",
   "video": "8.2"
  },
  {
   "type": "order",
   "q": "Put the five steps in order.",
   "items": [
    "Summarize physical units",
    "Compute equivalent units",
    "Summarize total costs",
    "Compute cost per equivalent unit",
    "Assign costs"
   ],
   "why": "This order works for both WA and FIFO.",
   "video": "8.3"
  },
  {
   "type": "num",
   "q": "Beginning WIP 3,000, started 25,000, ending WIP 4,000. Units completed?",
   "a": 24000,
   "unit": "units",
   "why": "3,000 + 25,000 − 4,000 = 24,000.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "Completed 24,000; ending WIP 4,000 at 75% converted. WA conversion EU?",
   "a": 27000,
   "unit": "EU",
   "why": "24,000 + 3,000 = 27,000.",
   "video": "8.4"
  },
  {
   "type": "num",
   "q": "Beginning conversion cost $18,000; current $252,000; WA conversion EU 27,000. Cost per EU?",
   "a": 10,
   "unit": "$",
   "why": "270,000 ÷ 27,000 = 10.",
   "video": "8.5"
  },
  {
   "type": "num",
   "q": "Cost per EU: DM $12, conversion $10. Ending WIP 4,000 units (DM 100%, CC 75%). Cost of ending WIP?",
   "a": 78000,
   "unit": "$",
   "why": "4,000 × 12 + 3,000 × 10 = 48,000 + 30,000.",
   "video": "8.5"
  },
  {
   "type": "match",
   "q": "Match the event to its debit.",
   "pairs": [
    [
     "Milk added in Mixing",
     "WIP: Mixing"
    ],
    [
     "Blocks moved to Aging",
     "WIP: Aging"
    ],
    [
     "Aged blocks ready to sell",
     "Finished goods"
    ]
   ],
   "why": "Costs follow the product from department to department.",
   "video": "8.6"
  }
 ],
 "9": [
  {
   "type": "num",
   "q": "Beginning WIP 2,500 units; completed 30,000. Units started and completed?",
   "a": 27500,
   "unit": "units",
   "why": "30,000 − 2,500 = 27,500.",
   "video": "9.1"
  },
  {
   "type": "num",
   "q": "Beginning WIP 2,500 (40% converted); started and completed 27,500; ending 5,000 (20% converted). FIFO conversion EU?",
   "a": 30000,
   "unit": "EU",
   "why": "1,500 + 27,500 + 1,000 = 30,000.",
   "video": "9.2"
  },
  {
   "type": "num",
   "q": "Current conversion costs $240,000; FIFO conversion EU 30,000. Cost per EU?",
   "a": 8,
   "unit": "$",
   "why": "240,000 ÷ 30,000 = 8.",
   "video": "9.3"
  },
  {
   "type": "num",
   "q": "WA conversion EU 31,000; beginning WIP 2,500 units 40% converted. FIFO conversion EU?",
   "a": 30000,
   "unit": "EU",
   "why": "31,000 − 1,000 = 30,000.",
   "video": "9.2"
  },
  {
   "type": "mcq",
   "q": "When do WA and FIFO give the same costs?",
   "opts": [
    "Always",
    "When there is no beginning WIP",
    "When there is no ending WIP",
    "Never"
   ],
   "a": 1,
   "why": "With no beginning inventory, there's nothing to blend.",
   "video": "9.4"
  },
  {
   "type": "mcq",
   "q": "Transferred-in costs in the second department are:",
   "opts": [
    "0% complete",
    "Complete to the same degree as conversion",
    "Always 100% complete",
    "Ignored"
   ],
   "a": 2,
   "why": "They arrive with the units, like materials added at the start.",
   "video": "9.5"
  },
  {
   "type": "num",
   "q": "Second department (WA): beginning TI $60,000; TI received $540,000; TI EU 12,000. TI cost per EU?",
   "a": 50,
   "unit": "$",
   "why": "600,000 ÷ 12,000 = 50.",
   "video": "9.5"
  },
  {
   "type": "num",
   "q": "Operation costing: 300 units, materials $12 each, two operations at $3 and $5 per unit. Batch cost?",
   "a": 6000,
   "unit": "$",
   "why": "300 × (12 + 3 + 5) = 6,000.",
   "video": "9.6"
  }
 ],
 "10": [
  {
   "type": "match",
   "q": "Match each item to its category.",
   "pairs": [
    [
     "Blocks with bad texture, discarded",
     "Spoilage"
    ],
    [
     "Weld redone, trailer sold as good",
     "Rework"
    ],
    [
     "Steel offcuts sold",
     "Scrap"
    ]
   ],
   "why": "Spoiled units fail; reworked units are fixed; scrap is leftover material.",
   "video": "10.1"
  },
  {
   "type": "num",
   "q": "Good units 15,000; total spoiled 400; normal spoilage 2% of good units. Abnormal spoiled units?",
   "a": 100,
   "unit": "units",
   "why": "Normal 300; abnormal 400 − 300 = 100.",
   "video": "10.2"
  },
  {
   "type": "mcq",
   "q": "Where does the cost of normal spoilage go in process costing?",
   "opts": [
    "A loss account",
    "The cost of good units",
    "Ending WIP always",
    "Selling expense"
   ],
   "a": 1,
   "why": "Normal spoilage is part of the cost of making good units.",
   "video": "10.2"
  },
  {
   "type": "num",
   "q": "Cost per spoiled unit $45; normal spoiled units 200; good units 10,000 at $45 each. Cost per good unit including normal spoilage?",
   "a": 45.9,
   "tol": 0.01,
   "unit": "$",
   "why": "(450,000 + 9,000) ÷ 10,000 = 45.90.",
   "video": "10.3"
  },
  {
   "type": "num",
   "q": "Ending WIP 600 units: DM 100% at $30, CC 50% at $20. Inspection at the end. Ending WIP cost?",
   "a": 24000,
   "unit": "$",
   "why": "600 × 30 + 300 × 20 = 18,000 + 6,000.",
   "video": "10.3"
  },
  {
   "type": "sort",
   "q": "Where does the spoilage or rework cost go?",
   "cats": [
    "The specific job",
    "Manufacturing overhead",
    "Loss account"
   ],
   "items": [
    [
     "Rework caused by a customer's special specs",
     0
    ],
    [
     "Routine spoilage common to all jobs",
     1
    ],
    [
     "Spoilage from ordering the wrong steel",
     2
    ],
    [
     "Normal rework across all jobs",
     1
    ]
   ],
   "why": "Job-specific, all-jobs normal, or abnormal.",
   "video": "10.4"
  },
  {
   "type": "num",
   "q": "Rework: DM $80, 6 labor hours at $30, overhead $36 an hour. Rework cost?",
   "a": 476,
   "unit": "$",
   "why": "80 + 180 + 216 = 476.",
   "video": "10.5"
  },
  {
   "type": "mcq",
   "q": "Scrap common to all jobs is sold for cash. Which account is credited?",
   "opts": [
    "Revenue",
    "Manufacturing overhead control",
    "Work in process for one job",
    "Finished goods"
   ],
   "a": 1,
   "why": "Scrap common to all jobs reduces overhead.",
   "video": "10.6"
  }
 ],
 "11": [
  {
   "type": "num",
   "q": "Fixed $90,000 split by budgeted share (Dept A 70%); variable $30 per hour; A used 1,500 hours. Dual-rate charge to A?",
   "a": 108000,
   "unit": "$",
   "why": "63,000 + 45,000 = 108,000.",
   "video": "11.1"
  },
  {
   "type": "mcq",
   "q": "Why use budgeted rather than actual rates?",
   "opts": [
    "They're more accurate",
    "User departments aren't charged for the support department's inefficiency",
    "They're required by GAAP",
    "They lower total costs"
   ],
   "a": 1,
   "why": "Budgeted rates leave variances with the department that controls them.",
   "video": "11.2"
  },
  {
   "type": "num",
   "q": "Direct method: support cost $240,000 serves P1 40%, P2 40%, other support 20%. Allocation to P1?",
   "a": 120000,
   "unit": "$",
   "why": "40 ÷ 80 = 50% × 240,000 = 120,000.",
   "video": "11.3"
  },
  {
   "type": "num",
   "q": "Step-down: first department $300,000 gives 20% to the second support department. How much does the second receive?",
   "a": 60000,
   "unit": "$",
   "why": "20% × 300,000 = 60,000.",
   "video": "11.4"
  },
  {
   "type": "num",
   "q": "Reciprocal: A = 100,000 + 0.1B; B = 50,000 + 0.2A. Solve for A (nearest dollar).",
   "a": 107143,
   "tol": 2,
   "unit": "$",
   "why": "A = 105,000 + 0.02A → A = 107,143.",
   "video": "11.5"
  },
  {
   "type": "order",
   "q": "Rank the methods from least to most complete recognition of support-to-support services.",
   "items": [
    "Direct",
    "Step-down",
    "Reciprocal"
   ],
   "why": "Direct ignores them, step-down recognizes some, reciprocal all.",
   "video": "11.5"
  },
  {
   "type": "num",
   "q": "Common cost $50,000; stand-alone costs A $40,000, B $10,000. Stand-alone allocation to B?",
   "a": 10000,
   "unit": "$",
   "why": "10 ÷ 50 = 20% × 50,000 = 10,000.",
   "video": "11.6"
  },
  {
   "type": "num",
   "q": "Same data, incremental method with A as primary user. Allocation to B?",
   "a": 10000,
   "unit": "$",
   "why": "A bears 40,000; B pays the remaining 10,000.",
   "video": "11.6"
  }
 ],
 "12": [
  {
   "type": "sort",
   "q": "Joint product, byproduct or scrap?",
   "cats": [
    "Joint product",
    "Byproduct",
    "Scrap"
   ],
   "items": [
    [
     "Cream",
     0
    ],
    [
     "Skim milk",
     0
    ],
    [
     "Whey sold to a hog farmer",
     1
    ],
    [
     "Separator residue",
     2
    ]
   ],
   "why": "Classify by relative sales value.",
   "video": "12.1"
  },
  {
   "type": "num",
   "q": "Joint cost $400,000; sales values at splitoff: cream $200,000, skim $150,000. Allocation to skim?",
   "a": 171429,
   "tol": 2,
   "unit": "$",
   "why": "150 ÷ 350 × 400,000 = 171,429.",
   "video": "12.2"
  },
  {
   "type": "num",
   "q": "Joint cost $80,000; output A 3,000 gallons, B 5,000 gallons. Physical-measure allocation to B?",
   "a": 50000,
   "unit": "$",
   "why": "5 ÷ 8 × 80,000 = 50,000.",
   "video": "12.3"
  },
  {
   "type": "num",
   "q": "Final value $150,000; separable costs $45,000. NRV?",
   "a": 105000,
   "unit": "$",
   "why": "150,000 − 45,000 = 105,000.",
   "video": "12.4"
  },
  {
   "type": "num",
   "q": "Total revenue $500,000; total costs $450,000. Constant gross-margin percentage?",
   "a": 10,
   "tol": 0.1,
   "unit": "%",
   "why": "50,000 ÷ 500,000 = 10%.",
   "video": "12.4"
  },
  {
   "type": "num",
   "q": "Splitoff value $60,000; after processing $95,000; processing cost $28,000. Gain from processing further?",
   "a": 7000,
   "unit": "$",
   "why": "35,000 − 28,000 = 7,000.",
   "video": "12.5"
  },
  {
   "type": "mcq",
   "q": "In a sell-or-process-further decision, joint costs are:",
   "opts": [
    "Relevant",
    "Irrelevant",
    "Relevant only under NRV",
    "Added to separable costs"
   ],
   "a": 1,
   "why": "They're incurred whatever is decided after splitoff.",
   "video": "12.5"
  },
  {
   "type": "num",
   "q": "Production method: joint cost $120,000; byproduct value $5,000. Joint cost assigned to the main product?",
   "a": 115000,
   "unit": "$",
   "why": "120,000 − 5,000 = 115,000.",
   "video": "12.6"
  }
 ],
 "13": [
  {
   "type": "mcq",
   "q": "A variance that increases operating income is:",
   "opts": [
    "Unfavorable",
    "Favorable",
    "Static",
    "Flexible"
   ],
   "a": 1,
   "why": "Favorable variances raise income.",
   "video": "13.1"
  },
  {
   "type": "num",
   "q": "Budgeted CM $1,540 a trailer; 43 sold vs 40 planned. Sales-volume variance (positive if favorable)?",
   "a": 4620,
   "unit": "$",
   "why": "3 × 1,540 = 4,620 F.",
   "video": "13.2"
  },
  {
   "type": "num",
   "q": "Actual OI $18,000; flexible-budget OI $20,500. Flexible-budget variance (negative if unfavorable)?",
   "a": -2500,
   "unit": "$",
   "why": "18,000 − 20,500 = −2,500, unfavorable.",
   "video": "13.2"
  },
  {
   "type": "match",
   "q": "Match the type of standard.",
   "pairs": [
    [
     "Perfect conditions, never met",
     "Ideal"
    ],
    [
     "Efficient but realistic",
     "Attainable"
    ]
   ],
   "why": "Most firms use attainable standards.",
   "video": "13.3"
  },
  {
   "type": "num",
   "q": "Steel: 19,500 lb bought and used at $3.10; standard $3.00. Price variance (negative if unfavorable)?",
   "a": -1950,
   "unit": "$",
   "why": "(3.10 − 3.00) × 19,500 = 1,950 U.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Steel used 19,500 lb; standard for actual output 19,000 lb at $3. Efficiency variance (negative if unfavorable)?",
   "a": -1500,
   "unit": "$",
   "why": "500 × 3 = 1,500 U.",
   "video": "13.4"
  },
  {
   "type": "num",
   "q": "Labor: 780 actual hours; standard for actual output 800 hours at $30. Efficiency variance (positive if favorable)?",
   "a": 600,
   "unit": "$",
   "why": "20 hours saved × 30 = 600 F.",
   "video": "13.5"
  },
  {
   "type": "mcq",
   "q": "Which variance is most worth investigating?",
   "opts": [
    "$50 U once",
    "A $2,000 U variance recurring every month",
    "A $10 F variance",
    "Any variance, always"
   ],
   "a": 1,
   "why": "Size and trend matter; recurring variances signal a real problem.",
   "video": "13.6"
  }
 ],
 "14": [
  {
   "type": "num",
   "q": "Fixed MOH budget $48,000; denominator 60 units. Fixed rate per unit?",
   "a": 800,
   "unit": "$",
   "why": "48,000 ÷ 60.",
   "video": "14.1"
  },
  {
   "type": "num",
   "q": "Actual VMOH $15,600; actual hours 1,500; rate $10. VMOH spending variance (enter unfavorable as positive)?",
   "a": 600,
   "unit": "$",
   "why": "15,600 − 15,000 = 600 U.",
   "video": "14.2"
  },
  {
   "type": "num",
   "q": "Actual hours 1,500; standard hours allowed 1,440; rate $10. VMOH efficiency variance (unfavorable as positive)?",
   "a": 600,
   "unit": "$",
   "why": "60 × 10 = 600 U.",
   "video": "14.2"
  },
  {
   "type": "mcq",
   "q": "Which variance does NOT exist for fixed overhead?",
   "opts": [
    "Spending",
    "Production-volume",
    "Efficiency",
    "Flexible-budget"
   ],
   "a": 2,
   "why": "Fixed costs don't change with hours used.",
   "video": "14.3"
  },
  {
   "type": "num",
   "q": "Fixed budget $48,000 at $800 per unit; 55 units built. Production-volume variance (unfavorable as positive)?",
   "a": 4000,
   "unit": "$",
   "why": "48,000 − 44,000 = 4,000 U.",
   "video": "14.3"
  },
  {
   "type": "sort",
   "q": "Sort each variance: favorable or unfavorable?",
   "cats": [
    "Favorable",
    "Unfavorable"
   ],
   "items": [
    [
     "Actual hours below standard hours allowed",
     0
    ],
    [
     "Actual fixed MOH above budget",
     1
    ],
    [
     "Output above the denominator level",
     0
    ],
    [
     "Actual VMOH above actual hours × rate",
     1
    ]
   ],
   "why": "Favorable variances raise operating income.",
   "video": "14.4"
  },
  {
   "type": "mcq",
   "q": "The production-volume variance is best described as:",
   "opts": [
    "Lost contribution margin",
    "Overspending on fixed costs",
    "An effect of allocating fixed cost per unit",
    "A labor inefficiency"
   ],
   "a": 2,
   "why": "It's not an economic loss.",
   "video": "14.5"
  },
  {
   "type": "match",
   "q": "Match each topic with its running case.",
   "pairs": [
    [
     "Job costing",
     "Prairie Gate Trailers"
    ],
    [
     "Process costing",
     "Redwood Valley Creamery"
    ],
    [
     "Joint products",
     "Cream and skim at Redwood Valley"
    ]
   ],
   "why": "The course's two companies.",
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
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct413-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct413-" + n, state = store(key) || { done: [] }, cur = 0;
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
