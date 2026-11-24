# andrewprimmer.com

Personal academic website of Dr Andrew Primmer, Teaching Fellow in Accounting at Aston Business School, Aston University, and Honorary Research Associate in Accounting History at the University of Bristol.

## Structure

- `index.html` — Homepage
- `research.html` — Research programme
- `publications.html` — Publications and work in progress
- `cv.html` — Full web CV with PDF download
- `contact.html` — Contact details and academic profiles
- `sources/` — Primary source transcriptions
  - `index.html` — Sources landing page
  - `umhk_1933.html` — Union Minière du Haut-Katanga, 1933 bilingual transcription
- `debits-and-credits.html` — Interactive teaching resource on double entry
- `debits-and-credits.js` — Ledger simulation, trial balance, and quiz logic
- `teaching/` — Teaching resources
  - `index.html` — Accounting from the Archive course and teaching index
  - `federal-taxation/` — ACCT 414 Federal Tax I: 14 lectures, 84 microteach videos, slide decks, exercises (`source/` holds the build pipeline)
  - `cost-accounting-i/` — ACCT 413 Cost Accounting I: 14 lectures, 84 microteach videos, slide decks, exercises (Horngren 18e, Ch 1, 2, 4, 5, 7, 8, 16–19)
  - `cost-accounting-ii/` — ACCT 341 Cost Accounting II: 14 lectures, 84 microteach videos, slide decks, exercises (Horngren 18e, the other 14 chapters)
  - `intermediate-accounting-i/` — ACCT 416 Intermediate Accounting I: 14 lectures, 84 microteach videos, slide decks, exercises (Kieso 19e, Ch 1–11)
  - `intermediate-accounting-ii/` — ACCT 312 Intermediate Accounting II: 14 lectures, 84 microteach videos, slide decks, exercises (Kieso 19e, Ch 12–18, 22, 23)
  - `revenue-recognition/` — Revenue Recognition in Six Videos, with journal entry practice (`journal-entries.js`)
  - `halden-motors/` — Management Accounting with Claude for Excel: Halden Motors dataset (with mock year-end financial statements), 7 exercise prompts and worked solutions (`files/`)
- `folioscribe/` — FolioScribe digital humanities project landing page
- `assets/`
  - `style.css` — Shared site stylesheet
  - `cv.pdf` — CV PDF download

## Deployment

Static site served via GitHub Pages with custom domain (`andrewprimmer.com`).

The `CNAME` file contains the custom domain. The `.nojekyll` file disables GitHub's default Jekyll processing.
