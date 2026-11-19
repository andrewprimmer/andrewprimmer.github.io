#!/usr/bin/env python3
"""Generate the ACCT 211 Principles of Accounting I course pages (scaffold).

Page numbers are the printed page numbers of OpenStax, Principles of Accounting,
Volume 1: Financial Accounting (2019 PDF/print edition).
"""
import html, os, sys

OUT = sys.argv[1]
import json, glob
SCRIPTS = {}
for f in glob.glob("/home/claude/vid/scripts/L*.json"):
    for v in json.load(open(f))["videos"]: SCRIPTS[v["id"]] = v
DUR = json.load(open("/home/claude/vid/out/durations.json")) if os.path.exists("/home/claude/vid/out/durations.json") else {}
def has_video(vid): return os.path.exists(os.path.join(OUT, "videos", vid.replace(".", "-") + ".mp4"))
def mmss(vid):
    t = DUR.get(vid); 
    return f"{int(t//60)}:{int(round(t%60)):02d}" if t else ""
def script_html(vid):
    v = SCRIPTS.get(vid)
    if not v: return "<p>The script will appear here when the video is published.</p>"
    out = []
    for sc in v["scenes"]:
        out.append("<p>" + e(sc["say"]) + "</p>")
        if sc.get("reveal"): out.append("<p>" + e(sc["reveal"]) + "</p>")
    return "".join(out)
BOOK_URL = "https://openstax.org/details/books/principles-financial-accounting"
WEB_URL = "https://openstax.org/books/principles-financial-accounting/pages/1-why-it-matters"

# section -> (title, first page, last page or None)
SEC = {
 "1.1": ("Explain the Importance of Accounting and Distinguish between Financial and Managerial Accounting", 12, 13),
 "1.2": ("Identify Users of Accounting Information and How They Apply Information", 14, 17),
 "1.3": ("Describe Typical Accounting Activities and the Role Accountants Play", 18, 23),
 "1.4": ("Explain Why Accounting Is Important to Business Stakeholders", 24, 31),
 "1.5": ("Describe the Varied Career Paths Open to Individuals with an Accounting Education", 32, None),
 "2.1": ("Describe the Income Statement, Statement of Owner's Equity, Balance Sheet, and Statement of Cash Flows, and How They Interrelate", 62, 76),
 "2.2": ("Define, Explain, and Provide Examples of Current and Noncurrent Assets, Current and Noncurrent Liabilities, Equity, Revenues, and Expenses", 77, 80),
 "2.3": ("Prepare an Income Statement, Statement of Owner's Equity, and Balance Sheet", 81, None),
 "3.1": ("Describe Principles, Assumptions, and Concepts of Accounting and Their Relationship to Financial Statements", 116, 123),
 "3.2": ("Define and Describe the Expanded Accounting Equation and Its Relationship to Analyzing Transactions", 124, 129),
 "3.3": ("Define and Describe the Initial Steps in the Accounting Cycle", 130, 134),
 "3.4": ("Analyze Business Transactions Using the Accounting Equation and Show the Impact of Business Transactions on Financial Statements", 135, 139),
 "3.5": ("Use Journal Entries to Record Transactions and Post to T-Accounts", 140, 164),
 "3.6": ("Prepare a Trial Balance", 165, None),
 "4.1": ("Explain the Concepts and Guidelines Affecting Adjusting Entries", 212, 214),
 "4.2": ("Discuss the Adjustment Process and Illustrate Common Types of Adjusting Entries", 215, 226),
 "4.3": ("Record and Post the Common Types of Adjusting Entries", 227, 235),
 "4.4": ("Use the Ledger Balances to Prepare an Adjusted Trial Balance", 236, 238),
 "4.5": ("Prepare Financial Statements Using the Adjusted Trial Balance", 239, None),
 "5.1": ("Describe and Prepare Closing Entries for a Business", 286, 297),
 "5.2": ("Prepare a Post-Closing Trial Balance", 298, 299),
 "5.3": ("Apply the Results from the Adjusted Trial Balance to Compute Current Ratio and Working Capital Balance", 300, 312),
 "5.4": ("Appendix: Complete a Comprehensive Accounting Cycle for a Business", 313, None),
 "6.1": ("Compare and Contrast Merchandising versus Service Activities and Transactions", 366, 377),
 "6.2": ("Compare and Contrast Perpetual versus Periodic Inventory Systems", 378, 385),
 "6.3": ("Analyze and Record Transactions for Merchandise Purchases Using the Perpetual Inventory System", 386, 391),
 "6.4": ("Analyze and Record Transactions for the Sale of Merchandise Using the Perpetual Inventory System", 392, 399),
 "6.5": ("Discuss and Record Transactions Applying the Two Commonly Used Freight-In Methods", 400, 403),
 "6.6": ("Describe and Prepare Multi-Step and Simple Income Statements for Merchandising Companies", 404, 407),
 "8.1": ("Analyze Fraud in the Accounting Workplace", 532, 534),
 "8.2": ("Define and Explain Internal Controls and Their Purpose within an Organization", 535, 541),
 "8.3": ("Describe Internal Controls within an Organization", 542, 546),
 "8.4": ("Define the Purpose and Use of a Petty Cash Fund, and Prepare Petty Cash Journal Entries", 547, 550),
 "8.6": ("Define the Purpose of a Bank Reconciliation, and Prepare a Bank Reconciliation and Its Associated Journal Entries", 552, 554),
 "8.7": ("Describe Fraud in Financial Statements and Sarbanes-Oxley Act Requirements", 555, None),
 "9.1": ("Explain the Revenue Recognition Principle and How It Relates to Current and Future Sales and Purchase Transactions", 578, 583),
 "9.2": ("Account for Uncollectible Accounts Using the Balance Sheet and Income Statement Approaches", 584, 593),
 "9.6": ("Explain How Notes Receivable and Accounts Receivable Differ", 606, 611),
 "9.7": ("Appendix: Comprehensive Example of Bad Debt Estimation", 612, None),
 "10.1": ("Describe and Demonstrate the Basic Inventory Valuation Methods and Their Cost Flow Assumptions", 648, 656),
 "10.2": ("Calculate the Cost of Goods Sold and Ending Inventory Using the Periodic Method", 657, 662),
 "10.3": ("Calculate the Cost of Goods Sold and Ending Inventory Using the Perpetual Method", 663, 671),
 "10.4": ("Explain and Demonstrate the Impact of Inventory Valuation Errors on the Income Statement and Balance Sheet", 672, 673),
 "10.5": ("Examine the Efficiency of Inventory Management Using Financial Ratios", 674, None),
 "11.1": ("Distinguish between Tangible and Intangible Assets", 700, 703),
 "11.2": ("Analyze and Classify Capitalized Costs versus Expenses", 704, 708),
 "11.3": ("Explain and Apply Depreciation Methods to Allocate Capitalized Costs", 709, 720),
 "11.4": ("Describe Accounting for Intangible Assets and Record Related Transactions", 721, 722),
 "11.5": ("Describe Some Special Issues in Accounting for Long-Term Assets", 723, None),
 "12.1": ("Identify and Describe Current Liabilities", 746, 754),
 "12.2": ("Analyze, Journalize, and Report Current Liabilities", 755, 763),
 "12.3": ("Define and Apply Accounting Treatment for Contingent Liabilities", 764, 772),
 "12.4": ("Prepare Journal Entries to Record Short-Term Notes Payable", 773, 776),
 "12.5": ("Record Transactions Incurred in Preparing Payroll", 777, None),
 "14.1": ("Explain the Process of Securing Equity Financing through the Issuance of Stock", 860, 870),
 "14.4": ("Compare and Contrast Owners' Equity versus Retained Earnings", 890, 896),
 "15.1": ("Describe the Advantages and Disadvantages of Organizing as a Partnership", 926, 931),
 "15.3": ("Compute and Allocate Partners' Share of Income and Loss", 935, 937),
}

def pages(s):
    _, a, b = SEC[s]
    if b is None: return f"p.&nbsp;{a} onward"
    if a == b: return f"p.&nbsp;{a}"
    return f"pp.&nbsp;{a}&ndash;{b}"

def ref(s):
    return f"&sect;{s}, {pages(s)}"

# lecture: num, short, title, week, chapter label, chapter pages, part, summary, micros
# micro: (title, takeaway, [sections], note)
L = [
 (1, "Accounting in society", "The role of accounting in society", 1, "Chapter 1", "pp. 11–60", "Foundations",
  "What accounting is, who uses it, where double entry came from, who sets the rules, and careers in accounting.", [
  ("What is accounting?", "Accounting records, summarizes and reports financial information so people can make decisions", ["1.1"], ""),
  ("Financial versus managerial accounting", "Outsiders get standardized GAAP statements; managers get reports built for their decisions", ["1.1"], ""),
  ("Who uses accounting information?", "Investors, lenders, managers, governments and nonprofits each ask different questions", ["1.2"], ""),
  ("Where double entry came from", "Luca Pacioli set out the debit-and-credit system in 1494, and it is still the one we use", ["1.3"], "Instructor's own material; the book's context is in"),
  ("Who sets the rules?", "FASB writes US GAAP, the SEC enforces it for public companies, and the IASB writes IFRS", ["3.1"], ""),
  ("Careers in accounting", "Public, corporate, government and nonprofit paths, and the CPA and CMA credentials", ["1.5"], "")]),
 (2, "Financial statements", "Introduction to financial statements", 2, "Chapter 2", "pp. 61–114", "Foundations",
  "The four statements, the elements they report, how they link, accrual accounting and the classified balance sheet.", [
  ("The four financial statements", "Income statement, statement of owner's equity, balance sheet and statement of cash flows", ["2.1"], ""),
  ("Assets, liabilities and equity", "What the business owns, what it owes, and what is left for the owner", ["2.2"], ""),
  ("Revenues, expenses, gains and losses", "Revenues and expenses come from main operations; gains and losses from side events", ["2.2"], ""),
  ("How the statements link", "Net income flows into equity, and equity flows into the balance sheet", ["2.1", "2.3"], ""),
  ("Cash basis versus accrual basis", "Accrual accounting records revenue when earned and expenses when incurred, not when cash moves", ["4.1"], "Looks ahead to"),
  ("Reading a classified balance sheet", "Current and long-term items, working capital and the current ratio", ["2.2", "5.3"], "")]),
 (3, "Recording transactions", "Analyzing and recording transactions", 3, "Chapter 3", "pp. 115–210", "Foundations",
  "The accounting equation, debits and credits, journalizing, posting to T-accounts and the trial balance.", [
  ("The accounting equation", "Assets = liabilities + equity, and every transaction keeps it in balance", ["3.2"], ""),
  ("Analyzing transactions", "Every transaction changes at least two accounts", ["3.4"], ""),
  ("Debits and credits", "Debit is left, credit is right, and each account type has a normal balance", ["3.3"], ""),
  ("Journalizing", "Date, accounts, amounts and a short explanation in the general journal", ["3.5"], ""),
  ("Posting to the ledger", "Journal entries move into T-accounts, which show each account's running balance", ["3.5"], ""),
  ("The trial balance", "It proves debits equal credits, but not that every entry is right", ["3.6"], "")]),
 (4, "Adjusting entries", "The adjustment process", 4, "Chapter 4", "pp. 211–284", "The accounting cycle",
  "Why we adjust, deferrals, accruals, depreciation and the adjusted trial balance.", [
  ("Why we adjust", "Revenue and expense recognition need entries at period end, even with no new transaction", ["4.1"], ""),
  ("Prepaid expenses", "Supplies and insurance turn into expense as they are used up", ["4.2"], ""),
  ("Unearned revenue", "Cash received in advance is a liability until the work is done", ["4.2"], ""),
  ("Accrued revenues and expenses", "Record what was earned or incurred but not yet billed or paid, such as wages and interest", ["4.2", "4.3"], ""),
  ("Depreciation as an adjustment", "Accumulated depreciation is a contra asset, and cost less it gives book value", ["4.3"], ""),
  ("The adjusted trial balance", "The checked list of balances the statements are built from", ["4.4"], "")]),
 (5, "Completing the cycle", "Completing the accounting cycle", 5, "Chapter 5", "pp. 285–364", "The accounting cycle",
  "Statements from the adjusted trial balance, closing entries, the post-closing trial balance and the full cycle.", [
  ("From adjusted trial balance to statements", "Prepare the income statement first, then owner's equity, then the balance sheet", ["4.5"], ""),
  ("Closing entries", "Revenue, expense and drawing accounts go to zero through Income Summary into capital", ["5.1"], ""),
  ("The post-closing trial balance", "Only permanent (balance sheet) accounts carry into the new period", ["5.2"], ""),
  ("The accounting cycle in ten steps", "From analyzing transactions to the post-closing trial balance", ["3.3", "5.4"], ""),
  ("The 10-column worksheet", "A spreadsheet that takes the trial balance through adjustments to the statements", ["5.4"], ""),
  ("Correcting errors", "Fix a wrong entry with a correcting entry, never by erasing or overwriting it", ["3.6"], "")]),
 (6, "Merchandising", "Merchandising transactions", 6, "Chapter 6", "pp. 365–450", "The accounting cycle",
  "Merchandisers, perpetual and periodic systems, purchases, sales, discounts and the multi-step income statement.", [
  ("Service versus merchandising businesses", "A merchandiser has cost of goods sold, and sales less COGS is gross profit", ["6.1"], ""),
  ("Perpetual versus periodic systems", "Perpetual updates inventory with every sale; periodic counts it at period end", ["6.2"], ""),
  ("Recording purchases", "Purchase discounts, returns and freight terms (FOB shipping point or destination)", ["6.3", "6.5"], ""),
  ("Recording sales", "Under perpetual, each sale takes two entries: one for revenue, one for COGS", ["6.4"], ""),
  ("Sales discounts and returns", "Contra-revenue accounts, and what terms such as 2/10, n/30 mean", ["6.4"], ""),
  ("The multi-step income statement", "Gross profit, operating income and the gross margin ratio", ["6.6"], "")]),
 (7, "Inventory", "Inventory", 7, "Chapter 10", "pp. 647–698", "The accounting cycle",
  "Cost flow methods, perpetual and periodic costing, lower of cost and NRV, inventory errors and turnover.", [
  ("Why cost flow matters", "The same goods can give different COGS and profit depending on the method", ["10.1"], ""),
  ("Specific identification and FIFO", "First in, first out sends the oldest costs to COGS", ["10.1"], ""),
  ("LIFO and weighted average", "LIFO is allowed under US GAAP but not IFRS, and the LIFO conformity rule ties it to tax", ["10.1"], ""),
  ("Perpetual versus periodic costing", "The same method can give different answers under each system", ["10.2", "10.3"], ""),
  ("Lower of cost and net realizable value", "Write inventory down when it is worth less than it cost", ["10.1"], ""),
  ("Inventory errors and turnover", "An ending-inventory error misstates two years' income, in opposite directions", ["10.4", "10.5"], "")]),
 (8, "Internal control and cash", "Fraud, internal controls and cash", 9, "Chapter 8", "pp. 531–576", "Assets",
  "The fraud triangle, SOX, COSO, controls over cash, petty cash and the bank reconciliation.", [
  ("The fraud triangle", "Pressure, opportunity and rationalization; controls attack opportunity", ["8.1"], ""),
  ("SOX in brief", "Section 404 makes public-company managers and auditors report on internal control", ["8.7"], ""),
  ("COSO's five components", "Control environment, risk assessment, control activities, information and communication, monitoring", ["8.2"], ""),
  ("Controlling cash receipts and payments", "Separate who handles cash from who records it, deposit daily and approve every payment", ["8.3"], ""),
  ("Petty cash", "A fixed imprest fund, replenished with one entry that records the expenses", ["8.4"], ""),
  ("The bank reconciliation", "Deposits in transit and outstanding checks fix the bank side; only book-side items get journal entries", ["8.6"], "")]),
 (9, "Receivables", "Accounting for receivables", 10, "Chapter 9", "pp. 577–646", "Assets",
  "Credit sales, the direct write-off and allowance methods, the aging schedule and notes receivable.", [
  ("Accounts receivable and credit sales", "Selling on credit wins sales but brings the risk of customers who never pay", ["9.1"], ""),
  ("The direct write-off method", "Simple and used for tax, but it breaks expense recognition, so GAAP allows it only when bad debts are immaterial", ["9.2"], ""),
  ("The allowance method", "Estimate bad debts in the period of the sale, using Allowance for Doubtful Accounts", ["9.2"], ""),
  ("Income statement versus balance sheet approach", "Percentage of credit sales, or percentage of receivables", ["9.2"], ""),
  ("The aging schedule", "Older balances get higher loss rates, and the total sets the year-end adjusting entry", ["9.2", "9.7"], ""),
  ("Notes receivable and interest", "Interest = principal × rate × time, and the entries at issue and at maturity", ["9.6"], "")]),
 (10, "Depreciation", "Long-term assets: acquisition and depreciation", 11, "Chapter 11", "pp. 699–744", "Assets",
  "Tangible and intangible assets, what goes into cost, three depreciation methods, partial years and revised estimates.", [
  ("Tangible and intangible long-term assets", "Property, plant and equipment versus patents, copyrights and goodwill", ["11.1"], ""),
  ("What goes into cost", "The price plus every cost to get the asset ready for use, such as freight and installation", ["11.2"], ""),
  ("Straight-line depreciation", "(Cost − salvage value) ÷ useful life, the same every year", ["11.3"], ""),
  ("Units-of-production depreciation", "Depreciation follows how much the asset is actually used", ["11.3"], ""),
  ("Double-declining-balance depreciation", "Twice the straight-line rate on book value, front-loading the expense", ["11.3"], ""),
  ("Partial years and revised estimates", "A change in useful life or salvage value applies from now on, not to past years", ["11.3", "11.5"], "")]),
 (11, "Disposals and intangibles", "Long-term assets: disposals, natural resources and intangibles", 12, "Chapter 11", "pp. 699–744", "Assets",
  "Capital versus revenue spending, disposals, impairment, depletion, amortization and reporting.", [
  ("Capital versus revenue expenditures", "Improvements that extend life are capitalized; routine repairs are expensed", ["11.2"], ""),
  ("Selling or scrapping an asset", "Update depreciation, remove cost and accumulated depreciation, then record the gain or loss", ["11.5"], ""),
  ("Impairment", "Write the asset down when its carrying value cannot be recovered", ["11.5"], ""),
  ("Natural resources and depletion", "Timber, minerals and oil are expensed as they are extracted", ["11.3"], ""),
  ("Intangibles and amortization", "Patents and copyrights are amortized; goodwill is tested for impairment instead", ["11.4"], ""),
  ("Reporting long-term assets", "Balance sheet presentation and the asset turnover ratio", ["11.5"], "")]),
 (12, "Current liabilities", "Current liabilities", 13, "Chapter 12", "pp. 745–808", "Liabilities",
  "What makes a liability current, notes payable, sales tax, unearned revenue, current debt and contingencies.", [
  ("What makes a liability current?", "It is due within a year or the operating cycle, and paid from current assets", ["12.1"], ""),
  ("Accounts and short-term notes payable", "Accrue interest on notes at period end", ["12.1", "12.4"], ""),
  ("Sales tax payable", "Sales tax collected belongs to the state, so it is a liability, not revenue", ["12.2"], ""),
  ("Unearned revenue revisited", "Gift cards and customer deposits stay liabilities until delivered", ["12.1"], ""),
  ("Current portion of long-term debt", "Next year's principal moves into current liabilities", ["12.1"], ""),
  ("Contingent liabilities and warranties", "Probable and estimable: record it; reasonably possible: disclose it", ["12.3"], "")]),
 (13, "Payroll", "Payroll liabilities", 14, "Chapter 12", "pp. 745–808", "Liabilities",
  "Gross to net pay, withholdings, employer payroll taxes, payroll entries, benefits and payroll forms.", [
  ("Gross pay to net pay", "What the employee earns versus what lands in their bank account", ["12.5"], ""),
  ("Employee withholdings", "Federal and Minnesota income tax, Social Security and Medicare (FICA)", ["12.5"], ""),
  ("Employer payroll taxes", "Matching FICA plus federal (FUTA) and state (SUTA) unemployment tax", ["12.5"], ""),
  ("Recording a payroll", "Two entries: one for wages and withholdings, one for employer taxes", ["12.5"], ""),
  ("Benefits and compensated absences", "Accrue vacation pay and benefits as employees earn them", ["12.5"], ""),
  ("Payroll forms", "W-4, Form 941, Form 940 and the W-2", ["12.5"], "")]),
 (14, "Business forms and review", "Forms of business organization and course review", 15, "Chapters 14–15 (selected sections)", "pp. 860–937", "Business forms",
  "Proprietorships, partnerships and corporations, equity under each, a historical annual report, and a course recap.", [
  ("Sole proprietorships, partnerships and corporations", "Each form differs in owner liability, taxation and how long it lasts", ["15.1"], ""),
  ("Equity under each form", "Owner's capital, partners' capital accounts, or stockholders' equity", ["14.4"], ""),
  ("Dividing partnership income", "By an agreed ratio, or with salary and interest allowances first", ["15.3"], ""),
  ("Corporate equity in brief", "Common stock and retained earnings, as a preview of ACCT 212", ["14.1", "14.4"], ""),
  ("Then and now: a historical annual report", "A 1920s–30s annual report set beside a modern 10-K, from the instructor's archival research", [], "Instructor's own material; no textbook reading."),
  ("Course recap: the accounting cycle in 2 minutes", "Transactions, adjustments, statements and closing, tied together for the final", ["3.3", "5.4"], "")]),
]

PARTS = [("Part one · Foundations", "Foundations"), ("Part two · The accounting cycle", "The accounting cycle"),
         ("Part three · Assets", "Assets"), ("Part four · Liabilities and business forms", ("Liabilities", "Business forms"))]

e = html.escape

def header(depth, title, desc):
    up = "../" * depth
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} &middot; Andrew Primmer</title>
<meta name="description" content="{e(desc)}">
<link rel="stylesheet" href="{up}assets/style.css">
<link rel="stylesheet" href="acct211.css">
</head>
<body id="top">

<header class="site-header">
  <div class="site-header-inner">
    <a href="{up}index.html" class="site-wordmark">
      Andrew Primmer
      <span class="site-wordmark-sub">Accounting Historian</span>
    </a>
    <nav class="site-nav" aria-label="Main">
      <a href="{up}index.html">Home</a>
      <a href="{up}research.html">Research</a>
      <a href="{up}publications.html">Publications</a>
      <a href="{up}cv.html">CV</a>
      <a href="{up}sources/">Primary Sources</a>
      <a href="{up}teaching/" aria-current="page">Teaching</a>
      <a href="{up}folioscribe/">FolioScribe</a>
      <a href="{up}contact.html">Contact</a>
    </nav>
  </div>
</header>

<main class="site-main">
  <div class="site-narrow">
"""

FOOT = """
    <section class="page-section">
      <p style="color:var(--muted);font-size:.95rem">ACCT 211 Principles of Accounting I is being built as a distance-learning course. Videos, slides and exercises are added as they are made. Readings and page numbers refer to the free OpenStax textbook. Corrections welcome at <a href="mailto:a.primmer@aston.ac.uk">a.primmer@aston.ac.uk</a>.</p>
    </section>

  </div>
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <span>&copy; Andrew Primmer. All rights reserved.</span>
    <span>Aston Business School &middot; Aston University</span>
  </div>
</footer>
</body>
</html>
"""

TEXTBOOK_BOX = f"""      <div class="textbook">
        <span class="tb-badge">Required textbook</span>
        <p class="tb-title"><a href="{BOOK_URL}"><cite>Principles of Accounting, Volume 1: Financial Accounting</cite></a></p>
        <p class="tb-meta">Mitchell Franklin, Patty Graybeal and Dixon Cooper. OpenStax, Rice University, 2019. ISBN 978-1-947172-68-5 (print), 978-1-947172-67-8 (digital).</p>
        <p>Free to read online or download as a PDF from <a href="{BOOK_URL}">openstax.org</a>, with a low-cost printed copy if you prefer paper. You do not need any other book. Every video on this site gives the textbook section and page numbers to read alongside it.</p>
        <p class="tb-note">Page numbers are the printed page numbers in the PDF and print editions. In the web view, use the section number instead (for example, &sect;4.2).</p>
      </div>
"""

def secline(m):
    title, take, secs, note = m
    if not secs:
        return note
    refs = "; ".join(ref(s) for s in secs)
    return (note + " " if note else "") + refs

def lecture_page(i):
    n, short, title, week, ch, chp, part, summary, micros = L[i]
    out = header(2, f"ACCT 211 Lecture {n}: {e(short)}", f"ACCT 211 Principles of Accounting I, Lecture {n}: {title}. Six two-minute videos with textbook readings.")
    out += f"""
    <header class="page-header">
      <div class="page-eyebrow"><a href="../">Teaching</a> &middot; <a href="./">ACCT 211 Principles of Accounting I</a> &middot; Lecture {n}</div>
      <h1 class="page-title">{e(title[0].upper() + title[1:])}</h1>
      <p class="page-lede">{e(summary)}</p>
    </header>

    <section class="page-section">
      <div class="reading">
        <span class="tb-badge">Read</span>
        <p><cite>Principles of Accounting, Volume 1</cite> (OpenStax), {ch}, {chp.replace('–','&ndash;')}. Week {week}. Each video below lists the exact section and pages.</p>
      </div>
      <p>Watch the six microteaches in order, then try the <a href="#practice">exercises</a> at the end. Each video ends with a quick-check question: pause it and answer before the reveal.</p>
      <p class="download pending">Lecture slides <span>(PowerPoint, coming soon)</span></p>

      <h2 class="section-heading">Contents</h2>
      <ol class="lesson-index">
"""
    for j, m in enumerate(micros, 1):
        out += f'        <li><a href="#video-{n}-{j}"><span class="li-num">{n}.{j}</span><span><span class="li-title">{e(m[0])}</span><span class="li-case">{secline(m)}</span></span><span class="li-done">{mmss(f"{n}.{j}") if has_video(f"{n}.{j}") else "Coming soon"}</span></a></li>\n'
    out += f'        <li><a href="#practice"><span class="li-num">Practice</span><span><span class="li-title">Lecture {n} exercises</span><span class="li-case">Interactive questions on everything in this lecture.</span></span><span class="li-done">Coming soon</span></a></li>\n      </ol>\n    </section>\n'
    for j, m in enumerate(micros, 1):
        vid = f"{n}.{j}"; slug = f"{n}-{j}"
        if has_video(vid):
            player = f"""<div class="player">
        <video controls playsinline preload="none" poster="posters/{slug}.jpg" width="540" height="960">
          <source src="videos/{slug}.mp4" type="video/mp4">
          Your browser cannot play this video. <a href="videos/{slug}.mp4">Download it instead</a>.
        </video>
      </div>"""
            dur = f" &middot; {mmss(vid)}"
        else:
            player = f'<div class="player placeholder" aria-label="Video coming soon"><span>Video {vid}<br>coming soon</span></div>'
            dur = ""
        out += f"""
    <section class="page-section micro" id="video-{n}-{j}">
      <h2 class="section-heading"><span class="lesson-num">Microteach {n}.{j}{dur}</span>{e(m[0])}</h2>
      <p class="lesson-case">{e(m[1])}.</p>
      <p class="micro-reading"><b>Textbook:</b> {secline(m)}</p>
      {player}
      <details class="script">
        <summary>Read the script</summary>
        {script_html(vid)}
      </details>
      <p class="back"><a href="#top">Back to the top</a></p>
    </section>
"""
    out += f"""
    <section class="page-section micro" id="practice">
      <h2 class="section-heading"><span class="lesson-num">Practice</span>Lecture {n} exercises</h2>
      <p class="placeholder-box">Interactive exercises for this lecture are coming soon. Until then, work the Exercise Set A questions at the end of {ch} of the textbook.</p>
    </section>

    <nav class="page-section lecture-nav" aria-label="Lecture navigation">
"""
    out += f'      <a href="lecture-{n-1:02d}.html">&larr; Lecture {n-1}</a>\n' if n > 1 else '      <a href="./">&larr; Course home</a>\n'
    out += f'      <a href="lecture-{n+1:02d}.html">Lecture {n+1} &rarr;</a>\n' if n < len(L) else '      <a href="./">Course home &rarr;</a>\n'
    out += "    </nav>\n"
    return out + FOOT

def course_index():
    out = header(2, "ACCT 211 Principles of Accounting I", "A distance-learning course in introductory financial accounting: 14 lectures and 84 two-minute videos, each tied to sections and pages of the free OpenStax textbook.")
    out += f"""
    <header class="page-header">
      <div class="page-eyebrow"><a href="../">Teaching</a> &middot; Distance learning</div>
      <h1 class="page-title">ACCT 211 Principles of Accounting I</h1>
      <p class="page-lede">An introduction to financial accounting for distance learning: 14 lectures, each taught in six two-minute videos with a textbook reading and an interactive exercise set. It covers the accounting cycle, merchandising, internal control and cash, receivables, inventory, long-term assets and current liabilities.</p>
    </header>

    <section class="page-section">
{TEXTBOOK_BOX}
      <p>This course introduces how businesses report their operating, investing and financing activities to investors, creditors and others. It covers the basic financial statements, business transactions, the accounting cycle, forms of business organization, internal control, cash, receivables, inventories, long-term assets, depreciation and current liabilities. One small Marshall, Minnesota business runs through the whole course, so each new topic lands on accounts you already know.</p>
      <h2 class="section-heading">How to study it</h2>
      <ol class="steps">
        <li>Work through the lectures in order. Read the textbook pages listed for each lecture.</li>
        <li>Watch the six microteaches. Each is under two minutes, made to be watched on a phone, and lists the section and pages it covers.</li>
        <li>When a video asks a quick-check question, pause it and answer before the reveal.</li>
        <li>Finish each lecture with its exercise set, then the textbook's Exercise Set A for that chapter.</li>
      </ol>
      <div class="callout">This course is being built. The readings and all 84 videos are in place; lecture slides and interactive exercises are added lecture by lecture. The videos are narrated with a synthetic voice.</div>

      <h2 class="section-heading">Lectures</h2>
"""
    for label, key in PARTS:
        keys = key if isinstance(key, tuple) else (key,)
        out += f'      <h3 class="part-heading">{label}</h3>\n      <ol class="lesson-index">\n'
        for lec in L:
            n, short, title, week, ch, chp, part, summary, micros = lec
            if part not in keys: continue
            out += f'<li><a href="lecture-{n:02d}.html"><span class="li-num">L{n}</span><span><span class="li-title">{e(title[0].upper()+title[1:])}</span><span class="li-case">{e(summary)} <span class="li-read">Read: {ch}, {chp.replace("–","&ndash;")}.</span></span></span><span class="li-done">Week {week}</span></a></li>\n'
        out += "      </ol>\n"
    out += """
      <h2 class="section-heading">Reading list</h2>
      <p>The whole semester's reading in one table. Chapter 7 is not set because ACCT 360 covers it; Chapters 13 and 16, and most of 14, are taught in ACCT 212.</p>
      <table class="reading-table">
        <thead><tr><th>Week</th><th>Lecture</th><th>Textbook reading</th></tr></thead>
        <tbody>
"""
    rows = [(lec[3], lec) for lec in L]
    for week, lec in rows:
        if week == 9:
            out += '          <tr class="exam"><td>8</td><td>Midterm (Lectures 1&ndash;7)</td><td>Review Chapters 1&ndash;6 and 10</td></tr>\n'
        out += f'          <tr><td>{week}</td><td><a href="lecture-{lec[0]:02d}.html">L{lec[0]} {e(lec[1])}</a></td><td>{lec[4]}, {lec[5].replace("–","&ndash;")}</td></tr>\n'
    out += '          <tr class="exam"><td>Finals</td><td>Final exam (cumulative)</td><td>All of the above</td></tr>\n'
    out += """        </tbody>
      </table>

      <h2 class="section-heading">Lecture slides</h2>
      <p>Each lecture will have a PowerPoint deck with a QR code for every video, worked examples and in-class exercises. Slides are added here as each lecture is finished.</p>
    </section>
"""
    return out + FOOT

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, "index.html"), "w").write(course_index())
for i in range(len(L)):
    open(os.path.join(OUT, f"lecture-{i+1:02d}.html"), "w").write(lecture_page(i))
assert sum(len(l[8]) for l in L) == 84
for l in L:
    for m in l[8]:
        for s in m[2]: assert s in SEC, s
print("ok")
