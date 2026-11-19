/* End-of-lecture exercises for ACCT 211 Principles of Accounting I.
   Each lecture page has <div id="acct-ex" data-lecture="N">. Six question types:
   mcq (choose one), match (pair each item), order (put steps in sequence),
   sort (put each item in a category), num (enter a number) and journal
   (record a journal entry: accounts, debits and credits, in any line order).
   Progress is kept in this browser's localStorage. */
(function () {
  "use strict";

  /* Account lists offered in the journal-entry questions, by lecture. */
  var POOL = {
    3: ["Cash", "Accounts receivable", "Supplies", "Equipment", "Accounts payable", "Notes payable", "Larson, Capital", "Larson, Withdrawals", "Service revenue", "Wages expense", "Rent expense", "Advertising expense", "Utilities expense"],
    4: ["Cash", "Accounts receivable", "Supplies", "Prepaid insurance", "Prepaid rent", "Equipment", "Accumulated depreciation", "Accounts payable", "Wages payable", "Interest payable", "Unearned revenue", "Service revenue", "Wages expense", "Supplies expense", "Insurance expense", "Rent expense", "Depreciation expense", "Interest expense"],
    5: ["Cash", "Supplies", "Accounts receivable", "Larson, Capital", "Larson, Withdrawals", "Income summary", "Service revenue", "Wages expense", "Rent expense", "Supplies expense", "Repairs expense", "Accounts payable"],
    6: ["Cash", "Accounts receivable", "Merchandise inventory", "Accounts payable", "Sales", "Sales returns and allowances", "Sales discounts", "Cost of goods sold", "Delivery expense"],
    7: ["Merchandise inventory", "Cost of goods sold", "Cash", "Accounts payable", "Sales", "Loss on inventory write-down"],
    8: ["Cash", "Petty cash", "Accounts receivable", "Notes receivable", "Interest revenue", "Bank service charges", "Postage expense", "Supplies expense", "Delivery expense", "Cash over and short", "Utilities expense", "Accounts payable"],
    9: ["Cash", "Accounts receivable", "Allowance for doubtful accounts", "Bad debt expense", "Notes receivable", "Interest receivable", "Interest revenue", "Sales"],
    10: ["Cash", "Land", "Land improvements", "Buildings", "Equipment", "Vehicles", "Accumulated depreciation", "Depreciation expense", "Notes payable", "Prepaid insurance", "Repairs expense"],
    11: ["Cash", "Equipment", "Vehicles", "Accumulated depreciation", "Gain on sale of equipment", "Loss on sale of equipment", "Repairs expense", "Patent", "Amortization expense", "Impairment loss", "Accumulated depletion", "Gravel inventory", "Depletion expense"],
    12: ["Cash", "Accounts receivable", "Sales", "Sales tax payable", "Notes payable", "Interest payable", "Interest expense", "Unearned revenue", "Warranty expense", "Warranty liability", "Repair parts inventory", "Accounts payable"],
    13: ["Cash", "Wages expense", "Payroll tax expense", "Federal income tax payable", "State income tax payable", "Social Security tax payable", "Medicare tax payable", "FUTA tax payable", "SUTA tax payable", "Health insurance payable", "Vacation benefits expense", "Vacation benefits payable", "Wages payable"],
    14: ["Cash", "Income summary", "Larson, Capital", "Nguyen, Capital", "Larson, Withdrawals", "Common stock", "Paid-in capital in excess of par", "Retained earnings", "Dividends"]
  };

  var DATA = {
    1: [
      { type: "mcq", q: "What is the main purpose of accounting?", opts: ["To calculate the tax a business owes", "To provide financial information for decision-making", "To keep track of the cash in the till", "To satisfy the bank"], a: 1,
        why: "Accounting organizes, analyzes and communicates financial information so people can make decisions. Tax, cash and lending are uses of that information.", video: "1.1" },
      { type: "order", q: "Put what accountants do in order.", items: ["Identify economic events", "Record them", "Summarize them", "Report them to users"],
        why: "Accountants identify the events that matter, record them, summarize them into meaningful totals, and report them.", video: "1.1" },
      { type: "sort", q: "Financial or managerial accounting?", cats: ["Financial", "Managerial"],
        items: [["Annual report to shareholders", 0], ["Profit by product line, weekly", 1], ["Must follow GAAP", 0], ["Next year's budget for the warehouse", 1], ["Quarterly 10-Q filed with the SEC", 0], ["Cost of running one delivery route", 1]],
        why: "Financial accounting serves outsiders and follows GAAP. Managerial accounting serves insiders, in whatever format helps them decide.", video: "1.2" },
      { type: "match", q: "Match each user to the question they mainly ask.",
        pairs: [["Investor", "Will this earn me a return?"], ["Lender", "Will I be repaid?"], ["Supplier", "Will they pay my invoice on time?"], ["Government", "Is the right tax being paid?"], ["Manager", "Which products should we cut?"]],
        why: "Many users read the same statements, each with their own question.", video: "1.3" },
      { type: "mcq", q: "Who published the first printed description of double-entry bookkeeping, in 1494?", opts: ["Adam Smith", "Luca Pacioli", "Leonardo da Vinci", "Josiah Wedgwood"], a: 1,
        why: "Luca Pacioli's Summa de Arithmetica, printed in Venice in 1494, described the system Venetian merchants used.", video: "1.4" },
      { type: "match", q: "Match each body to its role.",
        pairs: [["FASB", "Writes US GAAP"], ["SEC", "Enforces reporting rules for public companies"], ["IASB", "Writes IFRS"], ["PCAOB", "Oversees the auditors of public companies"]],
        why: "The FASB writes US GAAP, the SEC has the legal power to enforce it, and the IASB writes the international standards.", video: "1.5" },
      { type: "match", q: "Match each credential to its focus.",
        pairs: [["CPA", "Licensed to sign audit opinions"], ["CMA", "Management accounting"], ["CIA", "Internal audit"], ["EA", "Representing taxpayers before the IRS"]],
        why: "The CPA is the licensed public-accounting credential; the others specialize.", video: "1.6" }
    ],
    2: [
      { type: "match", q: "Match each statement to the question it answers.",
        pairs: [["Income statement", "Did the business make a profit this period?"], ["Statement of owner's equity", "How did the owner's stake change?"], ["Balance sheet", "What does it own and owe on one date?"], ["Statement of cash flows", "Where did cash come from and go?"]],
        why: "Each of the four statements answers one question.", video: "2.1" },
      { type: "sort", q: "Asset, liability or owner's equity?", cats: ["Asset", "Liability", "Owner's equity"],
        items: [["Cash", 0], ["Accounts payable", 1], ["Larson, Capital", 2], ["Equipment", 0], ["Wages payable", 1], ["Accounts receivable", 0], ["Notes payable", 1], ["Supplies", 0]],
        why: "Assets are resources owned, liabilities are amounts owed, and equity is the owner's claim on what's left.", video: "2.2" },
      { type: "sort", q: "Revenue, expense, gain or loss?", cats: ["Revenue", "Expense", "Gain", "Loss"],
        items: [["Fees for repairing a tractor", 0], ["Rent for the workshop", 1], ["Sold an old truck for more than its book value", 2], ["Inventory destroyed in a flood", 3], ["Wages paid to staff", 1], ["Delivery fees charged to customers", 0]],
        why: "Revenues and expenses come from the main business; gains and losses from side events.", video: "2.3" },
      { type: "num", q: "Beginning capital $0. Owner invests $20,000, net income is $2,500 and the owner withdraws $1,000. What is ending capital?", a: 21500, unit: "$",
        why: "0 + 20,000 + 2,500 − 1,000 = 21,500. That figure goes to the balance sheet.", video: "2.4" },
      { type: "order", q: "Put the financial statements in the order they are prepared.", items: ["Income statement", "Statement of owner's equity", "Balance sheet", "Statement of cash flows"],
        why: "Net income feeds the statement of owner's equity, ending capital feeds the balance sheet, and balance sheet cash agrees to the cash flow statement.", video: "2.4" },
      { type: "mcq", q: "Redwood River repairs a tractor in June and is paid in July. Under the accrual basis, when is the revenue recorded?", opts: ["June", "July", "Half in each month", "At year-end"], a: 0,
        why: "Accrual accounting records revenue when it is earned, regardless of when the cash arrives.", video: "2.5" },
      { type: "num", q: "Current assets are $18,000 and current liabilities are $12,000. What is the current ratio?", a: 1.5, tol: 0.01,
        why: "18,000 ÷ 12,000 = 1.5. Working capital would be 6,000.", video: "2.6" }
    ],
    3: [
      { type: "num", q: "Assets are $45,000 and liabilities are $17,000. What is owner's equity?", a: 28000, unit: "$",
        why: "Equity = assets − liabilities = 45,000 − 17,000 = 28,000.", video: "3.1" },
      { type: "mcq", q: "Redwood River pays $2,000 it owes a supplier. What happens to the accounting equation?", opts: ["Assets and liabilities both fall", "Assets fall and equity falls", "Assets rise and liabilities rise", "Nothing changes"], a: 0,
        why: "Cash (an asset) and accounts payable (a liability) both fall by 2,000, so the equation stays in balance.", video: "3.2" },
      { type: "sort", q: "Which side increases each account?", cats: ["Debit", "Credit"],
        items: [["Cash", 0], ["Service revenue", 1], ["Accounts payable", 1], ["Wages expense", 0], ["Larson, Capital", 1], ["Larson, Withdrawals", 0], ["Equipment", 0], ["Notes payable", 1]],
        why: "Assets, withdrawals and expenses increase with debits. Liabilities, capital and revenues increase with credits.", video: "3.3" },
      { type: "journal", q: "June 1: Dana Larson invests $20,000 cash in Redwood River Supply. Record the entry.",
        lines: [["Cash", 20000, 0], ["Larson, Capital", 0, 20000]],
        why: "An asset (cash) increases with a debit; owner's capital increases with a credit.", video: "3.4" },
      { type: "journal", q: "June 5: Redwood River repairs equipment for a customer and bills $1,500 on account.",
        lines: [["Accounts receivable", 1500, 0], ["Service revenue", 0, 1500]],
        why: "The customer owes money (asset up, debit) and revenue has been earned (credit).", video: "3.4" },
      { type: "journal", q: "June 8: Redwood River buys equipment for $8,000, paying $3,000 cash and signing a note for the rest.",
        lines: [["Equipment", 8000, 0], ["Cash", 0, 3000], ["Notes payable", 0, 5000]],
        why: "A compound entry: one debit and two credits, with debits equal to credits.", video: "3.4" },
      { type: "num", q: "The Cash T-account has debits of $20,000 and $1,500 and credits of $3,000 and $900. What is the balance?", a: 17600, unit: "$",
        why: "21,500 of debits − 3,900 of credits = 17,600 debit balance.", video: "3.5" },
      { type: "sort", q: "Would each error stop the trial balance from balancing?", cats: ["Trial balance won't balance", "Still balances"],
        items: [["A $500 debit posted as $50", 0], ["An entry forgotten completely", 1], ["Debit posted to the wrong expense account", 1], ["An entry recorded twice", 1], ["Only the debit half of an entry posted", 0]],
        why: "A trial balance only proves debits equal credits. Errors that keep both sides equal slip through.", video: "3.6" }
    ],
    4: [
      { type: "sort", q: "Which type of adjustment is each?", cats: ["Prepaid expense", "Unearned revenue", "Accrued revenue", "Accrued expense"],
        items: [["Insurance paid in advance, partly used", 0], ["Customer paid for six months of service up front", 1], ["Work done but not yet billed", 2], ["Wages earned but not yet paid", 3], ["Supplies bought earlier, some used", 0], ["Interest owed on a note but not yet paid", 3]],
        why: "Deferrals (prepaid expenses and unearned revenues) follow cash already moved; accruals record what has not been paid or billed yet.", video: "4.1" },
      { type: "journal", q: "On June 1 Redwood River paid $2,400 for 12 months of insurance. Record the June 30 adjustment.",
        lines: [["Insurance expense", 200, 0], ["Prepaid insurance", 0, 200]],
        why: "One month of the 2,400 has been used: 2,400 ÷ 12 = 200.", video: "4.2" },
      { type: "journal", q: "Supplies of $600 were bought in June. A count on June 30 finds $150 left. Record the adjustment.",
        lines: [["Supplies expense", 450, 0], ["Supplies", 0, 450]],
        why: "600 − 150 = 450 of supplies were used up.", video: "4.2" },
      { type: "journal", q: "On June 10 a customer prepaid $3,000 for six months of servicing (recorded as unearned revenue). One month has been earned by June 30. Adjust.",
        lines: [["Unearned revenue", 500, 0], ["Service revenue", 0, 500]],
        why: "3,000 ÷ 6 = 500 earned. The liability falls and revenue rises.", video: "4.3" },
      { type: "journal", q: "Employees earned $600 of wages on June 27–30 that will be paid on July 3. Record the June 30 adjustment.",
        lines: [["Wages expense", 600, 0], ["Wages payable", 0, 600]],
        why: "The expense was incurred in June, so it is recorded in June with a liability.", video: "4.4" },
      { type: "num", q: "A $5,000 note carries 6% annual interest. How much interest accrues in one month?", a: 25, unit: "$",
        why: "5,000 × 6% × 1/12 = 25.", video: "4.4" },
      { type: "journal", q: "Equipment costing $8,000 has a 5-year life and no salvage value. Record one year of straight-line depreciation.",
        lines: [["Depreciation expense", 1600, 0], ["Accumulated depreciation", 0, 1600]],
        why: "8,000 ÷ 5 = 1,600 a year, credited to the contra asset.", video: "4.5" },
      { type: "mcq", q: "Which account will never appear in an adjusting entry?", opts: ["Supplies", "Cash", "Wages payable", "Service revenue"], a: 1,
        why: "Adjusting entries update income statement and balance sheet accounts for things already happening; cash was recorded when it moved.", video: "4.6" }
    ],
    5: [
      { type: "num", q: "Revenue is $5,100 and expenses total $2,308. What is net income?", a: 2792, unit: "$",
        why: "5,100 − 2,308 = 2,792.", video: "5.1" },
      { type: "sort", q: "Temporary or permanent account?", cats: ["Temporary (closed)", "Permanent (carried forward)"],
        items: [["Service revenue", 0], ["Accounts receivable", 1], ["Rent expense", 0], ["Larson, Withdrawals", 0], ["Larson, Capital", 1], ["Wages payable", 1], ["Income summary", 0], ["Equipment", 1]],
        why: "Revenues, expenses, withdrawals and income summary are reset to zero. Balance sheet accounts carry forward.", video: "5.2" },
      { type: "journal", q: "Close service revenue of $5,100 to income summary.",
        lines: [["Service revenue", 5100, 0], ["Income summary", 0, 5100]],
        why: "Revenue has a credit balance, so it is debited to bring it to zero.", video: "5.2" },
      { type: "journal", q: "Income summary has a credit balance of $2,792 (net income). Close it to capital.",
        lines: [["Income summary", 2792, 0], ["Larson, Capital", 0, 2792]],
        why: "Net income increases the owner's capital.", video: "5.2" },
      { type: "journal", q: "Close Larson, Withdrawals of $1,000.",
        lines: [["Larson, Capital", 1000, 0], ["Larson, Withdrawals", 0, 1000]],
        why: "Withdrawals go straight to capital, not through income summary.", video: "5.2" },
      { type: "order", q: "Put the accounting cycle in order.", items: ["Analyze transactions", "Journalize", "Post to the ledger", "Prepare the unadjusted trial balance", "Record adjusting entries", "Prepare the adjusted trial balance", "Prepare financial statements", "Record closing entries", "Prepare the post-closing trial balance"],
        why: "The cycle runs from transactions to statements, then closes the temporary accounts.", video: "5.4" },
      { type: "mcq", q: "Which account appears on a post-closing trial balance?", opts: ["Service revenue", "Wages payable", "Supplies expense", "Income summary"], a: 1,
        why: "Only permanent accounts remain after closing; wages payable is a liability.", video: "5.3" },
      { type: "journal", q: "A $350 truck repair was wrongly recorded as Dr Supplies, Cr Cash. Record the correcting entry.",
        lines: [["Repairs expense", 350, 0], ["Supplies", 0, 350]],
        why: "Move the amount out of supplies and into repairs expense. Cash was right first time.", video: "5.6" }
    ],
    6: [
      { type: "num", q: "Beginning inventory $5,000, purchases $20,000, ending inventory $4,000 (periodic). What is cost of goods sold?", a: 21000, unit: "$",
        why: "5,000 + 20,000 − 4,000 = 21,000.", video: "6.2" },
      { type: "journal", q: "Perpetual system. Redwood River buys $10,000 of merchandise on account, terms 2/10, n/30.",
        lines: [["Merchandise inventory", 10000, 0], ["Accounts payable", 0, 10000]],
        why: "Under perpetual, purchases go straight into merchandise inventory.", video: "6.3" },
      { type: "journal", q: "Redwood River now owes $9,000 to that supplier and pays within the 2% discount period.",
        lines: [["Accounts payable", 9000, 0], ["Merchandise inventory", 0, 180], ["Cash", 0, 8820]],
        why: "9,000 × 2% = 180 discount, which reduces the cost of the inventory.", video: "6.3" },
      { type: "journal", q: "Redwood River sells goods for $4,000 on account. They cost $2,500. Record BOTH entries.",
        lines: [["Accounts receivable", 4000, 0], ["Sales", 0, 4000], ["Cost of goods sold", 2500, 0], ["Merchandise inventory", 0, 2500]],
        why: "A perpetual sale records the revenue and, separately, moves the cost out of inventory.", video: "6.4" },
      { type: "journal", q: "A customer who owes $3,500 pays within the 2/10 discount period.",
        lines: [["Cash", 3430, 0], ["Sales discounts", 70, 0], ["Accounts receivable", 0, 3500]],
        why: "3,500 × 2% = 70 discount, a contra-revenue account.", video: "6.5" },
      { type: "mcq", q: "Goods are bought FOB shipping point. Who pays the freight, and how does the buyer record it under perpetual?", opts: ["Seller; buyer records nothing", "Buyer; debit Merchandise inventory", "Buyer; debit Delivery expense", "Seller; buyer debits Sales"], a: 1,
        why: "Ownership passes at shipment, so the buyer pays and freight-in becomes part of inventory cost.", video: "6.3" },
      { type: "num", q: "Net sales $80,000 and cost of goods sold $50,000. What is the gross margin ratio, as a percentage?", a: 37.5, tol: 0.1, unit: "%",
        why: "Gross profit 30,000 ÷ 80,000 = 37.5%.", video: "6.6" }
    ],
    7: [
      { type: "num", q: "Beginning: 100 units @ $10. Purchases: 200 @ $11, then 100 @ $13. 250 units are sold (periodic). What is cost of goods sold under FIFO?", a: 2650, unit: "$",
        why: "100 × 10 + 150 × 11 = 2,650.", video: "7.2" },
      { type: "num", q: "Same data. What is cost of goods sold under LIFO (periodic)?", a: 2950, unit: "$",
        why: "100 × 13 + 150 × 11 = 2,950.", video: "7.3" },
      { type: "num", q: "Same data. What is ending inventory under weighted average (periodic)?", a: 1687.5, tol: 0.01, unit: "$",
        why: "4,500 ÷ 400 = 11.25 per unit; 150 units × 11.25 = 1,687.50.", video: "7.3" },
      { type: "match", q: "Prices are rising. Match each result to the method that produces it.",
        pairs: [["Highest net income", "FIFO"], ["Lowest taxable income", "LIFO"], ["Results between the other two", "Weighted average"], ["Best for unique, high-value items", "Specific identification"]],
        why: "With rising prices, FIFO sends old, cheap costs to COGS; LIFO sends new, expensive ones.", video: "7.3" },
      { type: "mcq", q: "Which method always gives the same cost of goods sold under perpetual and periodic systems?", opts: ["LIFO", "Weighted average", "FIFO", "None"], a: 2,
        why: "The oldest costs are the oldest whenever you look, so FIFO is unaffected by timing.", video: "7.4" },
      { type: "journal", q: "Inventory cost $1,850 but its net realizable value is $1,600. Record the write-down.",
        lines: [["Cost of goods sold", 250, 0], ["Merchandise inventory", 0, 250]],
        why: "Inventory is reported at the lower of cost and net realizable value; the 250 loss hits this year.", video: "7.5" },
      { type: "sort", q: "Year 1 ending inventory is OVERSTATED by $1,000. What happens?", cats: ["Overstated", "Understated", "Correct"],
        items: [["Year 1 cost of goods sold", 1], ["Year 1 net income", 0], ["Year 2 cost of goods sold", 0], ["Year 2 net income", 1], ["Combined two-year net income", 2]],
        why: "The error reverses in year 2, so the two-year total is right but each year is wrong.", video: "7.6" },
      { type: "num", q: "Cost of goods sold $35,000; average inventory $5,000. What is inventory turnover?", a: 7, tol: 0.01,
        why: "35,000 ÷ 5,000 = 7 times, about 52 days' sales in inventory.", video: "7.6" }
    ],
    8: [
      { type: "sort", q: "Which side of the fraud triangle does each show?", cats: ["Pressure", "Opportunity", "Rationalization"],
        items: [["Large gambling debts", 0], ["One clerk handles and records cash", 1], ["\"I'll pay it back next month\"", 2], ["Impossible sales target", 0], ["No one reviews the bank statement", 1], ["\"The company owes me\"", 2]],
        why: "Controls can't remove pressure or excuses, but they can remove opportunity.", video: "8.1" },
      { type: "match", q: "Match each COSO component to an example.",
        pairs: [["Control environment", "Leaders model ethical behavior"], ["Risk assessment", "Identifying where theft could occur"], ["Control activities", "Two signatures on large checks"], ["Information and communication", "A written policy every employee receives"], ["Monitoring", "Internal audit tests whether controls work"]],
        why: "COSO's five components work together; control activities are only one of them.", video: "8.3" },
      { type: "mcq", q: "Which is a WEAK control over cash?", opts: ["Depositing receipts intact each day", "Paying small bills from the day's takings", "Using prenumbered checks", "Having two people open the mail"], a: 1,
        why: "Paying bills from receipts means deposits no longer match sales, so gaps can hide theft.", video: "8.4" },
      { type: "journal", q: "Redwood River sets up a $200 petty cash fund.",
        lines: [["Petty cash", 200, 0], ["Cash", 0, 200]],
        why: "The petty cash account is debited only when the fund is created or its size changes.", video: "8.5" },
      { type: "journal", q: "Replenish the fund. Receipts: postage $45, supplies $60, delivery $70. Cash in the box: $22 (fund is $200).",
        lines: [["Postage expense", 45, 0], ["Supplies expense", 60, 0], ["Delivery expense", 70, 0], ["Cash over and short", 3, 0], ["Cash", 0, 178]],
        why: "200 − 22 = 178 to replenish; 178 − 175 of receipts = 3 short.", video: "8.5" },
      { type: "sort", q: "Bank reconciliation: which side does each item adjust?", cats: ["Bank side", "Book side"],
        items: [["Deposit in transit", 0], ["Outstanding checks", 0], ["NSF customer check", 1], ["Bank service charge", 1], ["Note collected by the bank", 1], ["Interest earned", 1]],
        why: "Bank-side items are things the bank hasn't recorded yet. Book-side items are things the books haven't recorded, and only those need journal entries.", video: "8.6" },
      { type: "num", q: "Bank balance $15,200; deposit in transit $1,800; outstanding checks $2,100. What is the adjusted bank balance?", a: 14900, unit: "$",
        why: "15,200 + 1,800 − 2,100 = 14,900.", video: "8.6" },
      { type: "journal", q: "The reconciliation shows a customer's $420 check was returned NSF. Record it.",
        lines: [["Accounts receivable", 420, 0], ["Cash", 0, 420]],
        why: "The customer still owes the money, so the receivable is reinstated.", video: "8.6" }
    ],
    9: [
      { type: "journal", q: "Direct write-off method. Lakeview Farms' $600 account is judged uncollectible.",
        lines: [["Bad debt expense", 600, 0], ["Accounts receivable", 0, 600]],
        why: "The direct write-off method records the expense only when a specific account fails.", video: "9.2" },
      { type: "journal", q: "Allowance method. Redwood River estimates $2,000 of bad debts at year-end.",
        lines: [["Bad debt expense", 2000, 0], ["Allowance for doubtful accounts", 0, 2000]],
        why: "The expense is matched to the year of the sales; the allowance is a contra asset.", video: "9.3" },
      { type: "journal", q: "Allowance method. Next year, Lakeview Farms' $600 account is written off.",
        lines: [["Allowance for doubtful accounts", 600, 0], ["Accounts receivable", 0, 600]],
        why: "No expense now: it was estimated last year. Net realizable value doesn't change.", video: "9.3" },
      { type: "num", q: "Accounts receivable $50,000; allowance $2,000. What is net realizable value?", a: 48000, unit: "$",
        why: "50,000 − 2,000 = 48,000, the amount expected to be collected.", video: "9.3" },
      { type: "num", q: "Balance sheet approach: the allowance should be $2,500 and it already has a $400 credit balance. What is bad debt expense?", a: 2100, unit: "$",
        why: "Only enough to bring the allowance from 400 up to 2,500.", video: "9.4" },
      { type: "num", q: "Aging: current $30,000 at 1%, 1–30 days $10,000 at 4%, 31–60 days $6,000 at 10%, over 60 days $4,000 at 30%. What should the allowance be?", a: 2500, unit: "$",
        why: "300 + 400 + 600 + 1,200 = 2,500.", video: "9.5" },
      { type: "num", q: "The aging says the allowance should be $2,550, but it has a $200 DEBIT balance. What is the adjusting entry amount?", a: 2750, unit: "$",
        why: "2,550 + 200 = 2,750 to turn a 200 debit into a 2,550 credit.", video: "9.5" },
      { type: "journal", q: "A $6,000, 90-day, 8% note receivable is collected at maturity (360-day year).",
        lines: [["Cash", 6120, 0], ["Notes receivable", 0, 6000], ["Interest revenue", 0, 120]],
        why: "6,000 × 8% × 90/360 = 120 interest.", video: "9.6" }
    ],
    10: [
      { type: "sort", q: "Include in the truck's cost, or not?", cats: ["Part of cost", "Expense / not cost"],
        items: [["Purchase price", 0], ["Sales tax", 0], ["Painting the company logo", 0], ["First year's insurance", 1], ["Oil change after 3 months", 1], ["Delivery to Redwood River", 0]],
        why: "Cost includes everything needed to get the asset ready for use; running costs are expensed.", video: "10.2" },
      { type: "match", q: "Match each asset to how its cost is spread.",
        pairs: [["Delivery truck", "Depreciation"], ["Gravel pit", "Depletion"], ["Patent", "Amortization"], ["Land", "Not spread at all"]],
        why: "The names differ, but each spreads cost over the periods that benefit, except land.", video: "10.1" },
      { type: "num", q: "Cost $43,000, salvage $3,000, life 5 years. Annual straight-line depreciation?", a: 8000, unit: "$",
        why: "(43,000 − 3,000) ÷ 5 = 8,000.", video: "10.3" },
      { type: "num", q: "Depreciable base $40,000 over 100,000 miles. The truck is driven 22,000 miles this year. Units-of-production depreciation?", a: 8800, unit: "$",
        why: "40,000 ÷ 100,000 = $0.40 a mile; × 22,000 = 8,800.", video: "10.4" },
      { type: "num", q: "Cost $43,000, life 5 years. Double-declining-balance depreciation in year 2?", a: 10320, unit: "$",
        why: "Rate 40%. Year 1: 17,200. Year 2: (43,000 − 17,200) × 40% = 10,320.", video: "10.5" },
      { type: "num", q: "Annual straight-line depreciation is $8,000. The truck was bought on April 1 and the year ends December 31. First-year depreciation?", a: 6000, unit: "$",
        why: "8,000 × 9/12 = 6,000.", video: "10.6" },
      { type: "num", q: "After 2 years, book value is $27,000 and salvage is still $3,000. The remaining life is revised to 4 years. New annual depreciation?", a: 6000, unit: "$",
        why: "(27,000 − 3,000) ÷ 4 = 6,000, from now on only.", video: "10.6" },
      { type: "journal", q: "Record one year's straight-line depreciation of $8,000 on the truck.",
        lines: [["Depreciation expense", 8000, 0], ["Accumulated depreciation", 0, 8000]],
        why: "Accumulated depreciation is a contra asset; the vehicle's cost is untouched.", video: "10.3" }
    ],
    11: [
      { type: "sort", q: "Capital or revenue expenditure?", cats: ["Capital (capitalize)", "Revenue (expense)"],
        items: [["New engine adding 3 years of life", 0], ["Oil change", 1], ["Replacing worn tires", 1], ["Adding a refrigerated unit to the truck", 0], ["Annual tune-up", 1], ["New roof extending the warehouse's life", 0]],
        why: "Spending that extends life or adds capacity is capitalized; ordinary maintenance is expensed.", video: "11.1" },
      { type: "num", q: "Equipment cost $10,000 with accumulated depreciation of $7,000 is sold for $4,000. Gain (+) or loss (−)?", a: 1000,
        why: "Book value 3,000; sold for 4,000: a gain of 1,000.", video: "11.2" },
      { type: "journal", q: "Equipment cost $8,000, accumulated depreciation $4,000 (up to date). It is sold for $3,500 cash.",
        lines: [["Cash", 3500, 0], ["Accumulated depreciation", 4000, 0], ["Loss on sale of equipment", 500, 0], ["Equipment", 0, 8000]],
        why: "Remove cost and accumulated depreciation; book value 4,000 less 3,500 received = 500 loss.", video: "11.2" },
      { type: "journal", q: "A flood-damaged dryer has a carrying value of $20,000 and a fair value of $12,000. Record the impairment.",
        lines: [["Impairment loss", 8000, 0], ["Accumulated depreciation", 0, 8000]],
        why: "Write the asset down to fair value; future depreciation uses the new value.", video: "11.3" },
      { type: "num", q: "A gravel pit cost $500,000 with $50,000 salvage and 900,000 tons. 120,000 tons are extracted. Depletion?", a: 60000, unit: "$",
        why: "450,000 ÷ 900,000 = $0.50 a ton × 120,000 = 60,000.", video: "11.4" },
      { type: "journal", q: "A $30,000 patent has a 10-year useful life. Record one year's amortization.",
        lines: [["Amortization expense", 3000, 0], ["Patent", 0, 3000]],
        why: "Straight-line over the useful life, usually credited straight to the patent.", video: "11.5" },
      { type: "mcq", q: "When may a company record goodwill?", opts: ["When customers are loyal", "When it buys another business for more than the fair value of its net assets", "At every year-end", "When it registers a trademark"], a: 1,
        why: "Goodwill is recorded only when purchased; public companies test it for impairment rather than amortize it.", video: "11.5" },
      { type: "num", q: "Net sales $90,000; average total assets $60,000. Asset turnover?", a: 1.5, tol: 0.01,
        why: "90,000 ÷ 60,000 = 1.5.", video: "11.6" }
    ],
    12: [
      { type: "sort", q: "Current or long-term liability?", cats: ["Current", "Long-term"],
        items: [["Wages payable", 0], ["Sales tax payable", 0], ["Principal on a mortgage due in 8 years", 1], ["Next year's installment on a 5-year loan", 0], ["Unearned revenue for next month's service", 0], ["Bonds due in 2035", 1]],
        why: "Current liabilities are due within a year (or the operating cycle) and paid from current assets.", video: "12.1" },
      { type: "num", q: "A $12,000, 5% note is signed on October 1. How much interest is accrued at December 31?", a: 150, unit: "$",
        why: "12,000 × 5% × 3/12 = 150.", video: "12.2" },
      { type: "journal", q: "A $10,000, 6%, six-month note signed Nov 1 is repaid on May 1. $100 of interest was accrued at Dec 31.",
        lines: [["Notes payable", 10000, 0], ["Interest payable", 100, 0], ["Interest expense", 200, 0], ["Cash", 0, 10300]],
        why: "Total interest 300: 100 accrued last year, 200 this year.", video: "12.2" },
      { type: "journal", q: "A cash sale of $1,000 plus Minnesota sales tax at 6.875%.",
        lines: [["Cash", 1068.75, 0], ["Sales", 0, 1000], ["Sales tax payable", 0, 68.75]],
        why: "The tax belongs to the state, so it is a liability, not revenue.", video: "12.3" },
      { type: "journal", q: "Customers redeem $500 of gift cards (previously recorded as unearned revenue). Ignore cost of goods sold.",
        lines: [["Unearned revenue", 500, 0], ["Sales", 0, 500]],
        why: "The liability is settled by delivering goods, so it becomes revenue.", video: "12.4" },
      { type: "num", q: "A $60,000 loan is repaid at $12,000 a year. What is the current portion at year-end?", a: 12000, unit: "$",
        why: "Next year's 12,000 is current; 48,000 stays long-term.", video: "12.5" },
      { type: "match", q: "Match each contingency to its treatment.",
        pairs: [["Probable and can be estimated", "Record a liability"], ["Probable but can't be estimated", "Disclose in the notes"], ["Reasonably possible", "Disclose in the notes"], ["Remote", "Do nothing"]],
        why: "Only probable, estimable losses are recorded. Warranties are the classic example.", video: "12.6" },
      { type: "journal", q: "Sales of $50,000 carry a warranty; repairs are expected to cost 2% of sales. Record the estimate.",
        lines: [["Warranty expense", 1000, 0], ["Warranty liability", 0, 1000]],
        why: "The expense is matched to the year of the sales, before any repairs happen.", video: "12.6" }
    ],
    13: [
      { type: "num", q: "Gross pay $1,000. Deductions: federal income tax $90, Minnesota tax $45, Social Security $62, Medicare $14.50, health insurance $30. Net pay?", a: 758.5, tol: 0.01, unit: "$",
        why: "1,000 − 241.50 = 758.50.", video: "13.1" },
      { type: "num", q: "An employee earns $2,000. What is the employee's total FICA (no limits reached)?", a: 153, tol: 0.01, unit: "$",
        why: "2,000 × 7.65% = 153 (124 Social Security + 29 Medicare).", video: "13.2" },
      { type: "sort", q: "Withheld from the employee, paid by the employer, or both?", cats: ["Employee only", "Employer only", "Both"],
        items: [["Federal income tax", 0], ["Social Security", 2], ["Medicare", 2], ["FUTA", 1], ["SUTA (Minnesota)", 1], ["Minnesota income tax", 0]],
        why: "FICA is shared; unemployment taxes fall on the employer; income tax is the employee's.", video: "13.3" },
      { type: "num", q: "FUTA is 6.0% less a credit of up to 5.4%, on the first $7,000 of wages. What is the usual maximum FUTA per employee per year?", a: 42, unit: "$",
        why: "0.6% × 7,000 = 42.", video: "13.3" },
      { type: "journal", q: "Record the payroll: gross $1,000; federal income tax $90; state income tax $45; Social Security $62; Medicare $14.50; health insurance $30; net pay paid in cash.",
        lines: [["Wages expense", 1000, 0], ["Federal income tax payable", 0, 90], ["State income tax payable", 0, 45], ["Social Security tax payable", 0, 62], ["Medicare tax payable", 0, 14.5], ["Health insurance payable", 0, 30], ["Cash", 0, 758.5]],
        why: "Debit the full gross pay; each withholding is a liability; cash is the net pay.", video: "13.4" },
      { type: "journal", q: "Record the employer's payroll taxes on that $1,000: Social Security $62, Medicare $14.50, FUTA $6, SUTA $10.",
        lines: [["Payroll tax expense", 92.5, 0], ["Social Security tax payable", 0, 62], ["Medicare tax payable", 0, 14.5], ["FUTA tax payable", 0, 6], ["SUTA tax payable", 0, 10]],
        why: "The employer's taxes are an extra expense on top of gross wages.", video: "13.4" },
      { type: "journal", q: "An employee earns one vacation day a month, worth $200. Record the monthly accrual.",
        lines: [["Vacation benefits expense", 200, 0], ["Vacation benefits payable", 0, 200]],
        why: "Compensated absences are expensed as earned, not when taken.", video: "13.5" },
      { type: "match", q: "Match each payroll form to its purpose.",
        pairs: [["W-4", "Employee's federal withholding elections"], ["Form 941", "Quarterly federal payroll tax return"], ["Form 940", "Annual FUTA return"], ["W-2", "Annual wage and tax statement for each employee"]],
        why: "The W-2 must reach employees by January 31.", video: "13.6" }
    ],
    14: [
      { type: "sort", q: "Which business form does each describe?", cats: ["Sole proprietorship", "Partnership", "Corporation"],
        items: [["Separate legal entity owned by stockholders", 2], ["One owner with unlimited liability", 0], ["Mutual agency between owners", 1], ["Profit taxed, then dividends taxed again", 2], ["Ends when the single owner retires", 0], ["Two or more owners sharing profit by agreement", 1]],
        why: "Liability, taxation and life differ across the three forms.", video: "14.1" },
      { type: "match", q: "Match each equity account to its business form.",
        pairs: [["Larson, Capital (only owner)", "Sole proprietorship"], ["Larson, Capital and Nguyen, Capital", "Partnership"], ["Retained earnings", "Corporation"], ["Dividends", "Corporation"]],
        why: "The accounting equation is the same; only the equity labels change.", video: "14.2" },
      { type: "num", q: "Net income $60,000. Salary allowances: Dana $20,000, Sam $15,000. Interest 10% on capital of $40,000 and $20,000. Remainder split equally. Dana's share?", a: 33500, unit: "$",
        why: "Dana: 20,000 + 4,000 + half of 19,000 (9,500) = 33,500.", video: "14.3" },
      { type: "journal", q: "Close income summary of $60,000 to the partners: Dana $33,500, Sam $26,500.",
        lines: [["Income summary", 60000, 0], ["Larson, Capital", 0, 33500], ["Nguyen, Capital", 0, 26500]],
        why: "Each partner's capital rises by their share of income.", video: "14.3" },
      { type: "journal", q: "A corporation issues 10,000 shares of $1 par common stock at $5 a share.",
        lines: [["Cash", 50000, 0], ["Common stock", 0, 10000], ["Paid-in capital in excess of par", 0, 40000]],
        why: "Par goes to common stock; the rest to paid-in capital in excess of par.", video: "14.4" },
      { type: "num", q: "Beginning retained earnings $15,000, net income $8,000, dividends $3,000. Ending retained earnings?", a: 20000, unit: "$",
        why: "15,000 + 8,000 − 3,000 = 20,000.", video: "14.4" },
      { type: "mcq", q: "What did the Royal Mail case of 1931 expose?", opts: ["Payroll fraud", "Secret reserves used to hide losses", "Inventory counting errors", "A failed bank reconciliation"], a: 1,
        why: "Reserves built in good years were quietly used to report steady profits while the company was losing money.", video: "14.5" },
      { type: "order", q: "Put the end-of-period steps in order.", items: ["Prepare the unadjusted trial balance", "Record adjusting entries", "Prepare the adjusted trial balance", "Prepare the financial statements", "Record closing entries", "Prepare the post-closing trial balance"],
        why: "Adjust, report, then close, and the cycle starts again.", video: "14.6" }
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
      var n = links[i].getAttribute("data-acct-lecture"), done = (store("acct211-" + n) || {}).done || [];
      var total = (DATA[n] || []).length, out = links[i].querySelector(".li-done");
      if (out && done.length) out.textContent = done.length + " of " + total + " exercises";
    }
  };

  /* ---------- a lecture's exercise set ---------- */
  function mount(root) {
    var n = root.getAttribute("data-lecture"), items = DATA[n];
    if (!items) return;
    var key = "acct211-" + n, state = store(key) || { done: [] }, cur = 0;
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
