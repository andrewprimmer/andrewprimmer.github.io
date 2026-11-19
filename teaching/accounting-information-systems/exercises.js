/* End-of-lecture exercises for ACCT 360 Accounting Information Systems.
   Each lecture page has <div id="ais-ex" data-lecture="N">. Five question types:
   mcq (choose one), match (pair each item), order (put steps in sequence),
   sort (put each item in a category) and num (enter a number).
   Progress is kept in this browser's localStorage. */
(function () {
  "use strict";

  var DATA = {
    1: [
      { type: "sort", q: "Data or information? Sort each item.", cats: ["Data", "Information"],
        items: [["A list of 10,000 card transactions", 0], ["Monday sales down 12% at the downtown store", 1], ["A single receipt for $4.50", 0], ["Top five products by margin this quarter", 1], ["A timesheet entry of 7.5 hours", 0], ["Overtime cost by store against budget", 1]],
        why: "Data is raw facts. Information is data that has been processed into something a decision-maker can act on.", video: "1.1" },
      { type: "match", q: "Match each item to the AIS component it belongs to.",
        pairs: [["The store manager", "People"], ["Written steps for processing a refund", "Procedures and instructions"], ["Customer and sales records", "Data"], ["QuickBooks", "Software"], ["The card reader and the store network", "IT infrastructure"], ["A password policy", "Internal controls"]],
        why: "Every AIS has the same six components. If one fails, the whole system produces poor information.", video: "1.2" },
      { type: "mcq", q: "A sales report arrives two weeks after the pricing decision it was meant to support. Which quality of good information does it fail?",
        opts: ["Relevant", "Reliable", "Timely", "Verifiable"], a: 2,
        why: "Information that arrives after the decision is made has no value, however accurate it is.", video: "1.1" },
      { type: "mcq", q: "In Porter's value chain, where does accounting sit?",
        opts: ["Primary activity: operations", "Primary activity: service", "Support activity: firm infrastructure", "Support activity: technology"], a: 2,
        why: "Accounting, and the AIS itself, sit in firm infrastructure, a support activity that makes the primary activities possible.", video: "1.3" },
      { type: "sort", q: "Which transaction cycle does each activity belong to?", cats: ["Revenue", "Expenditure", "Production", "HR / Payroll", "General ledger"],
        items: [["Pay a supplier's invoice", 1], ["Ship goods to a customer", 0], ["Issue materials to the factory floor", 2], ["Process overtime pay", 3], ["Post month-end accruals", 4], ["Collect cash from a customer", 0], ["Order raw materials", 1], ["Withhold income tax from wages", 3]],
        why: "Each cycle is a give-and-get exchange, and every cycle feeds the general ledger.", video: "1.4" },
      { type: "match", q: "Match each user to the output they rely on most.",
        pairs: [["A bank lender", "Debt covenants and cash flow"], ["The IRS", "Tax returns"], ["An investor", "Financial statements"], ["A warehouse supervisor", "Real-time stock levels"], ["An internal auditor", "Evidence that controls work"]],
        why: "One database serves many users, each needing a different view of the same transactions.", video: "1.5" },
      { type: "mcq", q: "Which CPA exam discipline section focuses on information systems?",
        opts: ["BAR", "ISC", "TCP", "REG"], a: 1,
        why: "ISC, Information Systems and Controls, has been a CPA discipline section since 2024.", video: "1.6" }
    ],
    2: [
      { type: "match", q: "Match each DFD symbol to what it represents.",
        pairs: [["Square", "Data source or destination"], ["Arrow", "Data flow"], ["Circle", "Process"], ["Open-ended rectangle", "Data store"]],
        why: "A DFD uses only four symbols, because it shows what happens to data, not who does the work.", video: "2.1" },
      { type: "match", q: "Match each flowchart symbol to its meaning.",
        pairs: [["Rectangle with a wavy bottom", "Document"], ["Trapezoid", "Manual operation"], ["Diamond", "Decision"], ["Cylinder", "Database"], ["Oval", "Start or end"], ["Small circle", "On-page connector"]],
        why: "Flowcharts show physical documents, people and devices, so they need more symbols than a DFD.", video: "2.2" },
      { type: "order", q: "Put the steps of the sales order flowchart in order.",
        items: ["Customer order arrives", "Sales enters the order", "Credit approves the order", "Warehouse picks and ships", "Billing sends the invoice"],
        why: "Credit approval must come before shipping. That is the key control in this process.", video: "2.3" },
      { type: "sort", q: "Which technique does each feature describe?", cats: ["DFD", "Flowchart", "BPMN"],
        items: [["Shows how data moves, not who does the work", 0], ["Shows physical documents and devices", 1], ["Uses pools and lanes", 2], ["Uses gateways for decisions", 2], ["Has a context diagram and level 0", 0], ["Uses a wavy-bottom document symbol", 1]],
        why: "DFDs show what happens to data, flowcharts show how it happens, and BPMN shows who does each activity.", video: "2.4" },
      { type: "mcq", q: "A process in a DFD has data flowing in but nothing flowing out. What is this error called?",
        opts: ["A miracle", "A black hole", "Unbalanced levels", "A connector"], a: 1,
        why: "Inputs with no outputs is a black hole. Outputs with no inputs is a miracle.", video: "2.6" },
      { type: "mcq", q: "Which of these is a turnaround document?",
        opts: ["A sales order", "A time card", "The remittance slip returned with a utility payment", "A purchase requisition"], a: 2,
        why: "A turnaround document is system output that comes back as input, already coded with the account number.", video: "2.5" },
      { type: "mcq", q: "In BPMN, what does a lane represent?",
        opts: ["A decision point", "A role or department", "A data store", "The end of the process"], a: 1,
        why: "Pools are organizations, and lanes inside them are the roles or departments doing the work.", video: "2.4" },
      { type: "mcq", q: "What does a context diagram show?",
        opts: ["Every keystroke in a process", "The whole system as a single process with its outside entities", "The physical documents in each department", "The program logic of one application"], a: 1,
        why: "The context diagram is the top level. Level 0 then breaks the system into its main processes.", video: "2.1" }
    ],
    3: [
      { type: "mcq", q: "Which attribute is the best primary key for a customers table?",
        opts: ["Customer name", "Customer number", "City", "Credit limit"], a: 1,
        why: "A primary key must uniquely identify each row. Names are not unique.", video: "3.2" },
      { type: "sort", q: "Which anomaly does each problem describe?", cats: ["Update", "Insert", "Delete"],
        items: [["Changing one address means editing 40 rows", 0], ["A new customer can't be added until their first sale", 1], ["Deleting a customer's only sale removes the customer", 2]],
        why: "All three anomalies come from cramming too much into one table. Normalization fixes them.", video: "3.4" },
      { type: "mcq", q: "A clerk records a sale for customer number 10457, but no such customer exists. Which rule should stop this?",
        opts: ["Entity integrity", "Referential integrity", "First normal form", "The give-to-get duality"], a: 1,
        why: "Referential integrity requires every foreign key to match an existing primary key.", video: "3.2" },
      { type: "sort", q: "Classify each item using the REA model.", cats: ["Resource", "Event", "Agent"],
        items: [["Cash", 0], ["Inventory", 0], ["A sale", 1], ["Receiving a customer payment", 1], ["A purchase", 1], ["Customer", 2], ["Salesperson", 2], ["Supplier", 2]],
        why: "Resources have economic value, events are activities to track, and agents are the people and organizations involved.", video: "3.3" },
      { type: "order", q: "Put the SQL clauses in the order they are written.",
        items: ["SELECT", "FROM", "WHERE", "GROUP BY"],
        why: "SELECT the columns, FROM the tables, WHERE to filter rows, GROUP BY to total by category.", video: "3.5" },
      { type: "mcq", q: "Which query gives total 2026 sales for each customer?",
        opts: ["SELECT customer FROM sales", "SELECT customer, SUM(amount) FROM sales WHERE year = 2026 GROUP BY customer", "SELECT SUM(amount) FROM customers", "SELECT * FROM sales WHERE customer = 2026"], a: 1,
        why: "SUM totals the amounts, WHERE keeps only 2026, and GROUP BY gives one total per customer.", video: "3.5" },
      { type: "match", q: "Match each term to its description.",
        pairs: [["OLTP", "Runs day-to-day transactions"], ["OLAP", "Analyzes history across many records"], ["Data mart", "One department's slice of the warehouse"], ["Data lake", "Raw data in any format"], ["ETL", "Extract, transform, load"]],
        why: "Record in the ERP, analyze in the warehouse.", video: "3.6" }
    ],
    4: [
      { type: "match", q: "Match each ERP module to the cycle it supports.",
        pairs: [["Sales and distribution", "Revenue"], ["Materials management", "Expenditure"], ["Production planning", "Production"], ["Human capital management", "HR and payroll"], ["Financial accounting", "General ledger"]],
        why: "ERP modules mirror the transaction cycles, and every module posts to the ledger.", video: "4.3" },
      { type: "order", q: "Put the stages in the evolution of ERP in order.",
        items: ["MRP: material requirements planning", "MRP II: capacity, labor and finance", "ERP: the whole enterprise", "ERP goes online to customers and suppliers", "Cloud ERP"],
        why: "From factory planning in the 1960s, to enterprise-wide integration, to the cloud.", video: "4.2" },
      { type: "sort", q: "Master data or transaction data?", cats: ["Master data", "Transaction data"],
        items: [["Customer shipping address", 0], ["Vendor bank details", 0], ["A sales order", 1], ["A goods receipt", 1], ["Material price list", 0], ["A vendor invoice", 1], ["Employee pay rate", 0], ["A payment", 1]],
        why: "Master data is stable and reused. Transaction data records individual events.", video: "4.4" },
      { type: "mcq", q: "A vendor emails asking you to change their bank account details. What's the best control?",
        opts: ["Update the record straight away", "Reply to the email to confirm", "Call the vendor on a number already on file", "Wait until their next invoice"], a: 2,
        why: "Replying to the email may reach the fraudster. Verify through a known, independent contact.", video: "4.4" },
      { type: "sort", q: "On-premise or SaaS?", cats: ["On-premise", "SaaS"],
        items: [["Big upfront license cost", 0], ["Vendor runs the upgrades", 1], ["Full control over customization", 0], ["Subscription pricing", 1], ["You manage your own backups", 0], ["Auditors ask for a SOC 1 report on the provider", 1]],
        why: "The choice is a trade-off between control and convenience.", video: "4.5" },
      { type: "mcq", q: "What is the main lesson of Hershey's 1999 ERP go-live?",
        opts: ["Never use SAP", "Don't go live in your busiest season", "Always customize heavily", "Skip testing to save time"], a: 1,
        why: "Going live just before peak season left no room to fix problems before orders piled up.", video: "4.6" },
      { type: "mcq", q: "Which go-live approach is usually lower risk?",
        opts: ["Big bang", "Phased", "Peak-season launch", "Parallel go-live with no testing"], a: 1,
        why: "A phased rollout limits the damage if one module or site has problems.", video: "4.6" }
    ],
    5: [
      { type: "match", q: "Match each system to the organization most likely to choose it.",
        pairs: [["SAP S/4HANA", "A large global manufacturer"], ["Oracle NetSuite", "A fast-growing startup leaving QuickBooks"], ["Dynamics 365 Business Central", "A small firm built around Microsoft 365"], ["Workday", "A university with a large workforce"], ["QuickBooks Online", "A three-person local business"]],
        why: "Right-size the system to the business.", video: "5.6" },
      { type: "match", q: "Match each classic SAP module code to its name.",
        pairs: [["FI", "Financial Accounting"], ["CO", "Controlling"], ["SD", "Sales and Distribution"], ["MM", "Materials Management"], ["PP", "Production Planning"]],
        why: "These two-letter codes still appear in job ads for SAP roles.", video: "5.1" },
      { type: "mcq", q: "In S/4HANA, what is HANA?",
        opts: ["A reporting tool", "SAP's in-memory database", "A payroll module", "A cloud hosting company"], a: 1,
        why: "HANA keeps data in memory, so reports can run in real time.", video: "5.1" },
      { type: "sort", q: "Which tier is each system usually placed in?", cats: ["Tier 1", "Tier 2", "Tier 3"],
        items: [["SAP S/4HANA", 0], ["Oracle Fusion Cloud ERP", 0], ["Workday", 0], ["Dynamics 365 Business Central", 1], ["Oracle NetSuite", 1], ["Infor", 1], ["QuickBooks Online", 2], ["Xero", 2]],
        why: "The tiers blur at the edges, but they're a useful way to map the market.", video: "5.6" },
      { type: "order", q: "Put the ERP selection steps in order.",
        items: ["Define requirements", "Issue an RFP", "Watch scripted vendor demos", "Run a fit-gap analysis", "Calculate total cost of ownership", "Negotiate and select"],
        why: "Requirements come first, so the vendors are judged against your needs, not their pitch.", video: "5.6" },
      { type: "mcq", q: "Which is NOT part of an ERP's total cost of ownership?",
        opts: ["The implementation partner", "Data migration", "Staff training", "The vendor's marketing budget"], a: 3,
        why: "TCO covers everything you pay over the system's life, not the vendor's own costs.", video: "5.6" },
      { type: "mcq", q: "A fit-gap analysis finds a gap. Which way of closing it is often cheapest?",
        opts: ["Heavy customization", "Changing your own process", "Building a new module", "Buying a second ERP"], a: 1,
        why: "Customizations cost money to build and to maintain through every upgrade.", video: "5.6" }
    ],
    6: [
      { type: "order", q: "Put the order-to-cash steps in order.",
        items: ["Enter the sales order", "Check the customer's credit", "Pick the goods", "Ship with a bill of lading", "Send the invoice", "Collect and apply the cash"],
        why: "Order, ship, bill, collect, with credit checked before anything leaves the building.", video: "6.1" },
      { type: "num", q: "A customer has a $20,000 credit limit and already owes $15,000. What is the largest new order the ERP will accept without a credit hold?",
        a: 5000, unit: "$", why: "$20,000 limit − $15,000 balance = $5,000 of headroom.", video: "6.2" },
      { type: "match", q: "Match each document to its purpose.",
        pairs: [["Picking list", "Tells the warehouse what to pull"], ["Packing slip", "Lists what's in the box"], ["Bill of lading", "Contract with the carrier"], ["Sales invoice", "Bills the customer"], ["Remittance advice", "Says which invoice is being paid"]],
        why: "Each document controls one step of the cycle.", video: "6.3" },
      { type: "match", q: "Match each threat to the control that addresses it.",
        pairs: [["Sales to customers who won't pay", "Credit limits and approval"], ["Fictitious sales", "Validate orders against real customers"], ["Wrong items shipped", "Barcode checks at packing"], ["Wrong prices billed", "Prices from approved master data"], ["Theft of customer payments", "Segregation of duties and lockboxes"]],
        why: "For every step, ask what could go wrong and which control prevents or detects it.", video: "6.6" },
      { type: "mcq", q: "A clerk steals Customer A's payment, then credits A's account with Customer B's payment a week later. What is this?",
        opts: ["Kiting", "Lapping", "Skimming sales", "Positive pay"], a: 1,
        why: "Lapping hides a theft by applying later customers' payments to earlier accounts.", video: "6.5" },
      { type: "mcq", q: "Under ASC 606, what comes straight after identifying the performance obligations?",
        opts: ["Recognize revenue", "Determine the transaction price", "Identify the contract", "Send the invoice"], a: 1,
        why: "The five steps: contract, obligations, price, allocate, recognize.", video: "6.4" },
      { type: "mcq", q: "The person who opens the mail and handles customer checks should NOT also…",
        opts: ["Deposit the checks", "Post payments to customer accounts", "Prepare a list of checks received", "Endorse the checks for deposit"], a: 1,
        why: "Handling cash and recording it are incompatible duties.", video: "6.5" },
      { type: "mcq", q: "Monthly customer statements mainly help detect…",
        opts: ["Lapping and billing errors", "Inventory theft", "Payroll fraud", "Server outages"], a: 0,
        why: "Customers spot payments that were never credited, so they act as your auditors.", video: "6.6" }
    ],
    7: [
      { type: "order", q: "Put the procure-to-pay steps in order.",
        items: ["Employee raises a requisition", "Manager approves it", "Purchasing issues a PO", "Receiving counts the delivery", "Three-way match approves the invoice", "Treasurer releases the payment"],
        why: "Order, receive, approve, pay, with each step done by a different person.", video: "7.1" },
      { type: "num", q: "The PO was for 100 units at $5. Ninety units arrived. The vendor's invoice bills 100 units at $5. How much should be approved for payment now?",
        a: 450, unit: "$", why: "Pay only for what was received: 90 × $5 = $450. Hold the rest until the shortfall is resolved.", video: "7.4" },
      { type: "num", q: "A $20,000 invoice has terms of 2/10, net 30. It is paid on day 8. How much cash is paid?",
        a: 19600, unit: "$", why: "Paid within 10 days, so a 2% discount: $20,000 × 98% = $19,600.", video: "7.5" },
      { type: "mcq", q: "Why use a blind count at receiving?",
        opts: ["It's faster", "It forces the clerk to actually count", "It hides the vendor's name", "It replaces the invoice"], a: 1,
        why: "If the clerk can't see the ordered quantity, they can't just tick a box.", video: "7.3" },
      { type: "match", q: "Match each fraud to the control that catches it.",
        pairs: [["Shell vendor", "Match vendor and employee addresses"], ["Duplicate payment", "Flag repeated invoice numbers and amounts"], ["Kickbacks", "Competitive bidding and buyer rotation"], ["Altered check", "Positive pay"], ["Fake bank details by email", "Call the vendor on a known number"]],
        why: "Most expenditure frauds leave patterns that ERP controls and analytics can find.", video: "7.6" },
      { type: "mcq", q: "Which pair of duties must be kept apart?",
        opts: ["Purchasing and receiving", "Receiving and storing", "Sales and marketing", "Payroll and benefits"], a: 0,
        why: "Otherwise one person could order fake goods and confirm they arrived.", video: "7.3" },
      { type: "mcq", q: "Under evaluated receipt settlement, what does the company pay from?",
        opts: ["The vendor's invoice only", "The PO and the receiving report", "The sales order", "A purchasing card statement"], a: 1,
        why: "There is no invoice: trusted vendors are paid automatically from the PO and the receipt.", video: "7.4" }
    ],
    8: [
      { type: "order", q: "Put the production cycle activities in order.",
        items: ["Product design", "Planning and scheduling", "Production operations", "Cost accounting"],
        why: "Design, plan, make, cost.", video: "8.1" },
      { type: "num", q: "A bicycle needs 2 wheels, and each wheel needs 36 spokes. How many spokes are needed for an order of 50 bicycles?",
        a: 3600, unit: "", why: "50 bicycles × 2 wheels × 36 spokes = 3,600. That's how a multi-level BOM explodes requirements.", video: "8.2" },
      { type: "sort", q: "Push (MRP II) or pull (lean and JIT)?", cats: ["Push", "Pull"],
        items: [["Produce to a sales forecast", 0], ["A kanban signal to make more", 1], ["Long production runs", 0], ["Small batches", 1], ["Materials arrive just as they're needed", 1], ["Higher inventory levels", 0]],
        why: "Push carries forecast risk. Pull carries supplier risk.", video: "8.3" },
      { type: "sort", q: "Job-order or process costing?", cats: ["Job-order", "Process"],
        items: [["A print shop's wedding invitations", 0], ["A construction project", 0], ["A soft-drink bottler", 1], ["A chemical plant", 1], ["A custom machine", 0], ["A breakfast cereal producer", 1]],
        why: "Custom work is tracked by job. Continuous production of identical units is averaged by process.", video: "8.4" },
      { type: "mcq", q: "Comparing the shelf count to the inventory records is which type of control?",
        opts: ["Preventive", "Detective", "Corrective", "Compensating"], a: 1,
        why: "A count finds differences after they have happened.", video: "8.5" },
      { type: "mcq", q: "Counting a few high-value items every day is called…",
        opts: ["A wall-to-wall count", "Cycle counting", "Backflushing", "Kanban"], a: 1,
        why: "Cycle counting spreads the work through the year and finds errors sooner.", video: "8.5" },
      { type: "mcq", q: "What is a key accounting benefit of IoT sensor data?",
        opts: ["Real-time costing", "No need for controls", "Paper time cards", "Fewer reports"], a: 0,
        why: "Actual costs are available as production happens, not at month end.", video: "8.6" }
    ],
    9: [
      { type: "order", q: "Put the seven payroll steps in order.",
        items: ["Update payroll master data", "Validate time and attendance data", "Prepare the payroll", "Disburse pay", "Calculate employer-paid benefits and taxes", "Pay taxes and deductions", "Post to the general ledger"],
        why: "Validate first, pay second, and post to the ledger last.", video: "9.3" },
      { type: "num", q: "An employee works 40 hours at $25 an hour. Federal income tax withheld is $100. Social Security is 6.2% and Medicare 1.45%. There are no other deductions. What is net pay?",
        a: 823.5, unit: "$", tol: 0.01, why: "Gross $1,000 − $100 income tax − $62.00 Social Security − $14.50 Medicare = $823.50.", video: "9.4" },
      { type: "num", q: "For the same $1,000 of gross pay, how much FICA does the employer pay as its match?",
        a: 76.5, unit: "$", tol: 0.01, why: "The employer matches 6.2% + 1.45% = 7.65% of $1,000 = $76.50.", video: "9.4" },
      { type: "match", q: "Match each payroll form to its purpose.",
        pairs: [["W-4", "Employee's withholding choices"], ["W-2", "Annual wage statement"], ["Form 941", "Quarterly federal payroll return"], ["Form 940", "Annual FUTA return"]],
        why: "Withhold, match, file and pay, all on time.", video: "9.4" },
      { type: "sort", q: "Withheld from the employee, or paid by the employer?", cats: ["Withheld from employee", "Paid by employer"],
        items: [["Federal income tax", 0], ["Employee share of Social Security", 0], ["Employee share of Medicare", 0], ["FUTA", 1], ["Employer FICA match", 1], ["State unemployment tax (in most states)", 1]],
        why: "Withheld amounts are trust fund taxes: the money belongs to the government.", video: "9.4" },
      { type: "match", q: "Match each payroll fraud to the control that stops it.",
        pairs: [["Ghost employee", "Compare payroll to HR headcount"], ["Buddy punching", "Biometric time clocks"], ["Unauthorized pay rise", "Only HR can change pay rates"], ["Paid after leaving", "Review terminations each pay period"]],
        why: "Every paycheck should go to a real person, for real work.", video: "9.5" },
      { type: "mcq", q: "Your payroll is outsourced. Which report gives your auditor assurance over the provider's controls?",
        opts: ["A W-2", "A SOC 1 report", "Form 941", "The payroll register"], a: 1,
        why: "A SOC 1 report covers a service provider's controls relevant to financial reporting.", video: "9.6" }
    ],
    10: [
      { type: "order", q: "Put the record-to-report steps in order.",
        items: ["Update the GL from the subledgers", "Post adjusting entries", "Prepare the financial statements", "Produce management reports"],
        why: "Everything flows into the ledger before anything is reported out of it.", video: "10.1" },
      { type: "sort", q: "Where does each account sit in a typical chart of accounts?", cats: ["1000s", "2000s", "3000s", "4000s", "5000s+"],
        items: [["Cash", 0], ["Inventory", 0], ["Accounts payable", 1], ["Common stock", 2], ["Retained earnings", 2], ["Sales revenue", 3], ["Rent expense", 4], ["Wages expense", 4]],
        why: "Assets, liabilities, equity, revenue, then expenses.", video: "10.2" },
      { type: "sort", q: "Routine, or a red flag worth testing?", cats: ["Routine", "Red flag"],
        items: [["A round $50,000 entry posted at 11 pm on a Sunday", 1], ["Automated sales posting from the subledger", 0], ["A CFO's manual entry to revenue on December 31", 1], ["The monthly depreciation run", 0], ["The payroll journal from the HCM system", 0], ["Debit revenue, credit a rarely used reserve account", 1]],
        why: "Auditors focus on manual entries with unusual timing, authors, amounts or account pairs.", video: "10.3" },
      { type: "num", q: "The ledger shows cash of $48,200. Checks of $3,500 are outstanding and a $2,000 deposit is in transit. There are no other reconciling items. What should the bank statement show?",
        a: 49700, unit: "$", why: "Bank = ledger + outstanding checks − deposits in transit: $48,200 + $3,500 − $2,000 = $49,700.", video: "10.4" },
      { type: "match", q: "Match each measure to its balanced scorecard perspective.",
        pairs: [["Return on capital", "Financial"], ["Customer satisfaction score", "Customer"], ["Defect rate", "Internal process"], ["Training hours per employee", "Learning and growth"]],
        why: "The scorecard balances four perspectives, all linked to strategy.", video: "10.6" },
      { type: "sort", q: "Leading or lagging indicator?", cats: ["Leading", "Lagging"],
        items: [["Last quarter's profit", 1], ["Customer satisfaction", 0], ["Employee training completed", 0], ["Audited net income", 1], ["Order backlog", 0], ["Prior-year revenue", 1]],
        why: "Lagging indicators report the past. Leading indicators predict the future.", video: "10.6" },
      { type: "mcq", q: "What does XBRL do?",
        opts: ["Encrypts SEC filings", "Tags financial data so software can read it", "Replaces the external auditor", "Calculates income tax"], a: 1,
        why: "Each number is tagged, so investors, regulators and researchers can read filings automatically.", video: "10.5" }
    ],
    11: [
      { type: "sort", q: "Which side of the fraud triangle does each item show?", cats: ["Pressure", "Opportunity", "Rationalization"],
        items: [["Gambling debts", 0], ["No one reviews changes to the vendor master", 1], ["“They underpay me anyway”", 2], ["A bonus tied to hitting revenue targets", 0], ["“I'll pay it back next month”", 2], ["One clerk handles cash and records it", 1]],
        why: "Controls can't remove pressure or rationalization, but they can remove opportunity.", video: "11.1" },
      { type: "match", q: "Match each part of SOX to what it requires.",
        pairs: [["Section 302", "CEO and CFO certify each report"], ["Section 404", "Management assesses internal control, auditor attests"], ["PCAOB", "Oversees auditors of public companies"]],
        why: "302 certifies, 404 assesses and audits.", video: "11.2" },
      { type: "match", q: "Match each example to its COSO component.",
        pairs: [["A code of conduct and tone at the top", "Control environment"], ["Identifying what could go wrong", "Risk assessment"], ["Approvals and reconciliations", "Control activities"], ["Reporting control problems to managers", "Information and communication"], ["Internal audit reviewing controls", "Monitoring activities"]],
        why: "Five components and seventeen principles, with the control environment as the foundation.", video: "11.3" },
      { type: "match", q: "Match each action to the ERM risk response.",
        pairs: [["Buy insurance", "Share"], ["Stop selling in a high-risk market", "Avoid"], ["Add a second approval", "Reduce"], ["Live with a small risk that costs more to control than it's worth", "Accept"]],
        why: "Internal controls are the reduce response, and only worth it when benefit exceeds cost.", video: "11.4" },
      { type: "sort", q: "Preventive, detective or corrective?", cats: ["Preventive", "Detective", "Corrective"],
        items: [["Passwords", 0], ["Bank reconciliation", 1], ["Restoring data from backup", 2], ["Edit check on data entry", 0], ["Exception report", 1], ["Segregation of duties", 0], ["Correcting and resubmitting rejected transactions", 2], ["Reviewing the audit log", 1]],
        why: "Stop it, find it, fix it. Good systems layer all three.", video: "11.5" },
      { type: "sort", q: "Authorization, recording or custody?", cats: ["Authorization", "Recording", "Custody"],
        items: [["Approve vendor invoices", 0], ["Enter invoices in accounts payable", 1], ["Release payments", 2], ["Approve customer credit", 0], ["Post cash receipts", 1], ["Open the mail and deposit checks", 2]],
        why: "Each of the three should be in different hands.", video: "11.6" },
      { type: "mcq", q: "A user can both create new vendors and release payments. What is this?",
        opts: ["A segregation of duties conflict", "Least privilege", "A compensating control", "Positive pay"], a: 0,
        why: "Those permissions together would let one person create a fake vendor and pay it.", video: "11.6" }
    ],
    12: [
      { type: "sort", q: "IT general control or application control?", cats: ["IT general control", "Application control"],
        items: [["Quarterly user access reviews", 0], ["Approval of program changes", 0], ["Nightly backups", 0], ["Three-way match", 1], ["Credit limit check", 1], ["Edit check on invoice entry", 1]],
        why: "General controls cover the whole environment. Application controls check individual transactions.", video: "12.1" },
      { type: "match", q: "Match each authentication method to its factor type.",
        pairs: [["Password", "Something you know"], ["Code sent to your phone", "Something you have"], ["Fingerprint", "Something you are"]],
        why: "MFA needs two or more different factor types.", video: "12.3" },
      { type: "mcq", q: "A new AP clerk is given full administrator access “to save time”. Which principle does this break?",
        opts: ["Least privilege", "Referential integrity", "Give-to-get duality", "Materiality"], a: 0,
        why: "Users should get only the access their job needs.", video: "12.3" },
      { type: "match", q: "Match each input control to what it does.",
        pairs: [["Field check", "Numbers only in a numeric field"], ["Limit check", "Rejects over 60 hours in a week"], ["Validity check", "Confirms the customer number exists"], ["Completeness check", "Required fields must be filled"], ["Hash total", "A meaningless sum to spot lost records"]],
        why: "Control the data going in, during processing, and coming out.", video: "12.5" },
      { type: "mcq", q: "You send a confidential file to a supplier using asymmetric encryption. Which key do you encrypt it with?",
        opts: ["Your private key", "The supplier's public key", "The supplier's private key", "No key is needed"], a: 1,
        why: "Anyone can encrypt with the public key, but only the supplier's private key can decrypt.", video: "12.4" },
      { type: "mcq", q: "The ERP must be running again within four hours of a failure. Which measure is that?",
        opts: ["RPO", "RTO", "MFA", "ITGC"], a: 1,
        why: "The recovery time objective is how fast you must recover. RPO is how much data you can lose.", video: "12.6" },
      { type: "mcq", q: "Why keep some backups offline?",
        opts: ["They're cheaper", "Ransomware can't reach them", "They restore faster", "Auditors require paper"], a: 1,
        why: "Ransomware encrypts everything it can reach on the network, including connected backups.", video: "12.6" }
    ],
    13: [
      { type: "match", q: "Match each question to the type of audit that answers it.",
        pairs: [["Are the financial statements fairly presented?", "Financial audit"], ["Do the AIS controls work?", "Information systems audit"], ["Is the warehouse run efficiently?", "Operational audit"], ["Are payroll tax rules being followed?", "Compliance audit"]],
        why: "Four kinds of audit, all depending on the auditor's independence.", video: "13.1" },
      { type: "order", q: "Put the risk-based audit steps in order.",
        items: ["Identify the threats", "Identify the controls", "Evaluate the controls", "Consider compensating controls"],
        why: "Start with what could go wrong, then test what should stop it.", video: "13.2" },
      { type: "sort", q: "What kind of evidence is each test?", cats: ["Inquiry", "Observation", "Inspection", "Reperformance"],
        items: [["Ask the AP clerk how invoices are approved", 0], ["Watch the receiving clerk count a delivery", 1], ["Examine signed purchase orders", 2], ["Redo the bank reconciliation yourself", 3]],
        why: "Reperformance is the strongest evidence, and inquiry alone is the weakest.", video: "13.2" },
      { type: "match", q: "Match each technique to its description.",
        pairs: [["Test data", "Fake transactions fed through the system"], ["Integrated test facility", "A dummy entity inside the live system"], ["Parallel simulation", "Real data rerun through the auditor's program"], ["Auditing around the computer", "Comparing inputs to outputs only"], ["Embedded audit module", "Audit code inside the ERP"]],
        why: "Around, through and with the computer.", video: "13.3" },
      { type: "mcq", q: "In a vendor payments file, only 11% of amounts start with the digit 1. What should the auditor do?",
        opts: ["Nothing, the data is normal", "Investigate further", "Sign off the audit", "Delete the outliers"], a: 1,
        why: "Benford's law expects about 30%, so a big shortfall suggests the numbers may not be natural.", video: "13.4" },
      { type: "match", q: "Match each SOC report to what it covers.",
        pairs: [["SOC 1", "Controls over financial reporting"], ["SOC 2", "Security, availability and confidentiality"], ["SOC 3", "A short public summary of SOC 2"], ["Type 1", "Design at a point in time"], ["Type 2", "Operating effectiveness over a period"]],
        why: "Auditors prefer Type 2 reports, because they test controls over time.", video: "13.6" },
      { type: "mcq", q: "Which section of a SOC report lists what YOUR company must do?",
        opts: ["The opinion", "Complementary user entity controls", "The system description", "Management's assertion"], a: 1,
        why: "The provider's controls only work if you perform those user controls too.", video: "13.6" }
    ],
    14: [
      { type: "sort", q: "Good task for a bot, or one that needs human judgment?", cats: ["Good for RPA", "Needs judgment"],
        items: [["Keying invoice data into the ERP", 0], ["Matching bank transactions", 0], ["Estimating a provision for complex litigation", 1], ["Downloading and emailing standard reports", 0], ["Deciding whether to write off a key customer", 1], ["Uploading journal entries from a template", 0]],
        why: "Bots follow rules. People handle judgment.", video: "14.1" },
      { type: "match", q: "Match each technology to what it does.",
        pairs: [["RPA", "Bots follow rules on screens"], ["Machine learning", "Learns patterns from data"], ["Generative AI", "Creates new text and code"], ["Blockchain", "A shared, tamper-evident ledger"], ["Process mining", "Rebuilds processes from event logs"]],
        why: "The tools keep changing, but the control principles stay the same.", video: "14.6" },
      { type: "mcq", q: "A staff accountant pastes a client's payroll file into a free public chatbot. Which control was missing?",
        opts: ["Positive pay", "No sensitive data in public AI tools", "A blind count", "The three-way match"], a: 1,
        why: "Use approved tools only, and keep confidential data out of public AI services.", video: "14.3" },
      { type: "mcq", q: "Generative AI gives a confident but invented revenue figure. What is this called?",
        opts: ["A hash total", "A hallucination", "An anomaly", "A smart contract"], a: 1,
        why: "Draft with AI, but verify like an accountant.", video: "14.3" },
      { type: "mcq", q: "A sale is recorded on a blockchain. What can the auditor conclude?",
        opts: ["The sale is genuine and correctly valued", "The record is hard to change, but the sale could still be wrong", "No further audit work is needed", "The customer has paid"], a: 1,
        why: "Tamper-evident does not mean error-free.", video: "14.4" },
      { type: "mcq", q: "Process mining shows many invoices arriving before any purchase order exists. What does that suggest?",
        opts: ["A strong purchasing control", "Purchasing controls are being bypassed", "A data warehouse error", "Good cash management"], a: 1,
        why: "Purchases made without a PO skip the approval step, so the real process differs from the documented one.", video: "14.5" },
      { type: "mcq", q: "Which framework do US companies use for SOX internal control assessments?",
        opts: ["COBIT", "COSO", "XBRL", "REA"], a: 1,
        why: "COSO's Internal Control Integrated Framework.", video: "14.6" }
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
  var LABEL = { mcq: "Choose one", match: "Match", order: "Put in order", sort: "Sort", num: "Calculate" };

  /* ---------- the hub page: show completion per lecture ---------- */
  window.AISProgress = function () {
    var links = document.querySelectorAll("[data-ais-lecture]");
    for (var i = 0; i < links.length; i++) {
      var n = links[i].getAttribute("data-ais-lecture"), done = (store("ais360-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "ais360-" + n, state = store(key) || { done: [] }, cur = 0;
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
    var root = document.getElementById("ais-ex");
    if (root) mount(root);
    if (document.querySelector("[data-ais-lecture]")) window.AISProgress();
  });
})();
