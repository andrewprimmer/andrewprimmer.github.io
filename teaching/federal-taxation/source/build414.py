#!/usr/bin/env python3
"""Build the ACCT 414 Federal Tax I course pages, exercise set and content.json.

Usage: build414.py OUTDIR   (OUTDIR = teaching/federal-taxation in the site repo)
Reads lectures/L*.json (scripts, lecture content, exercises) and out/durations.json.
"""
import html, json, glob, os, re, sys

ROOT = "/home/claude/tax"
OUT = sys.argv[1]
e = html.escape
LECT = [json.load(open(f)) for f in sorted(glob.glob(f"{ROOT}/lectures/L*.json"))]
DUR = json.load(open(f"{ROOT}/out/durations.json")) if os.path.exists(f"{ROOT}/out/durations.json") else {}
COURSE = "ACCT 414 Federal Tax I"
BOOK = "McGraw Hill's Taxation of Individuals, 2027 release"
BOOK_URL = "https://www.mheducation.com/highered/product/McGraw-Hills-Taxation-of-Individuals-Spilker.html"
PUB17 = "https://www.irs.gov/publications/p17"

def kb(n):
    f = os.path.join(OUT, "slides", f"ACCT414-Lecture-{n:02d}.pptx")
    return round(os.path.getsize(f) / 1024) if os.path.exists(f) else 0
def has_video(vid): return os.path.exists(os.path.join(OUT, "videos", vid.replace(".", "-") + ".mp4"))
def mmss(vid):
    t = DUR.get(vid)
    return f"{int(t // 60)}:{int(round(t % 60)):02d}" if t else ""
def cap(s): return s[0].upper() + s[1:]
def script_html(v):
    out = []
    for sc in v["scenes"]:
        out.append("<p>" + e(sc["say"]) + "</p>")
        if sc.get("reveal"): out.append("<p>" + e(sc["reveal"]) + "</p>")
    return "".join(out)
def reading(m, v):
    s = f"{BOOK.split(',')[0]}, {m['ch']}"
    if v.get("read"): s += f". Free reading: {v['read']}"
    return e(s) + "."

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
<link rel="stylesheet" href="acct414.css">
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
      <a href="{up}teaching/accounting-information-systems/railway/">Rails &amp; Ledgers</a>
      <a href="{up}contact.html">Contact</a>
    </nav>
  </div>
</header>

<main class="site-main">
  <div class="site-narrow">
"""

FOOT = """
    <section class="page-section">
      <p style="color:var(--muted);font-size:.95rem">ACCT 414 Federal Tax I is a distance-learning course. All figures are for tax year 2026 (returns filed in 2027) under the law as amended by the One Big Beautiful Bill Act of 2025. Tax law changes often: check current IRS guidance before relying on any figure. This is teaching material, not tax advice. Corrections welcome at <a href="mailto:a.primmer@aston.ac.uk">a.primmer@aston.ac.uk</a>.</p>
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
        <p class="tb-title"><a href="{BOOK_URL}"><cite>{BOOK}</cite></a></p>
        <p class="tb-meta">Brian C. Spilker, Benjamin C. Ayers, John A. Barrick, Troy Lewis, John Robinson, Connie Weaver and Ronald G. Worsham. McGraw Hill, Evergreen release for 2027 (covers 2026 tax law).</p>
        <p>The most widely adopted individual tax text in the US. Its fourteen chapters match this course's fourteen lectures one for one, so each lecture's reading is simply its chapter. The book is updated every year: use the 2027 release, which reflects the One Big Beautiful Bill Act. Connect access is optional unless your instructor assigns homework through it.</p>
        <p class="tb-note">Free companion: <a href="{PUB17}">IRS Publication 17, <cite>Your Federal Income Tax</cite></a>, and the IRS publications listed under each video. Every dollar figure on this site is for tax year 2026.</p>
      </div>
"""

def lecture_page(L):
    m = L["meta"]; n = m["n"]; vids = L["videos"]
    out = header(2, f"ACCT 414 Lecture {n}: {e(m['short'])}", f"ACCT 414 Federal Tax I, Lecture {n}: {m['title']}. Six two-minute videos with readings and exercises.")
    out += f"""
    <header class="page-header">
      <div class="page-eyebrow"><a href="../">Teaching</a> &middot; <a href="./">{COURSE}</a> &middot; Lecture {n}</div>
      <h1 class="page-title">{e(cap(m['title']))}</h1>
      <p class="page-lede">{e(m['summary'])}</p>
    </header>

    <section class="page-section">
      <div class="reading">
        <span class="tb-badge">Read</span>
        <p><cite>{BOOK.split(',')[0]}</cite>, {m['ch']}. Week {m['week']}. Each video below also lists a free IRS publication.</p>
      </div>
      <p>Watch the six microteaches in order, then try the <a href="#practice">exercises</a> at the end. Each video ends with a quick-check question: pause it and answer before the reveal.</p>
      <p class="download"><a href="slides/ACCT414-Lecture-{n:02d}.pptx" download>Download the lecture slides</a> <span>(PowerPoint, {kb(n)} KB)</span>. The slides have a QR code for each video, so you can follow along on your phone.</p>

      <h2 class="section-heading">Contents</h2>
      <ol class="lesson-index">
"""
    for v in vids:
        vid = v["id"]; slug = vid.replace(".", "-")
        out += f'        <li><a href="#video-{slug}"><span class="li-num">{vid}</span><span><span class="li-title">{e(v["title"])}</span><span class="li-case">{e(v["take"])}</span></span><span class="li-done">{mmss(vid) if has_video(vid) else "Coming soon"}</span></a></li>\n'
    out += f'        <li><a href="#practice"><span class="li-num">Practice</span><span><span class="li-title">Lecture {n} exercises</span><span class="li-case">Interactive questions on everything in this lecture, checked as you go.</span></span><span class="li-done"></span></a></li>\n      </ol>\n    </section>\n'
    for v in vids:
        vid = v["id"]; slug = vid.replace(".", "-")
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
    <section class="page-section micro" id="video-{slug}">
      <h2 class="section-heading"><span class="lesson-num">Microteach {vid}{dur}</span>{e(v['title'])}</h2>
      <p class="lesson-case">{e(v['take'])}.</p>
      <p class="micro-reading"><b>Reading:</b> {reading(m, v)}</p>
      {player}
      <details class="script">
        <summary>Read the script</summary>
        {script_html(v)}
      </details>
      <p class="back"><a href="#top">Back to the top</a></p>
    </section>
"""
    out += f"""
    <section class="page-section micro" id="practice">
      <h2 class="section-heading"><span class="lesson-num">Practice</span>Lecture {n} exercises</h2>
      <p class="lesson-case">Calculations, matching, sorting, ordering and multiple-choice questions on this lecture, all using 2026 figures.</p>
      <p>Answer each question and press <em>Check answer</em>. A wrong answer tells you which video to rewatch, and you can show the answer if you're stuck. Completed exercises turn green. Your progress is kept on this device. For more practice, work the end-of-chapter problems in {m['ch']} of the textbook.</p>
      <div class="ex" id="acct-ex" data-lecture="{n}"><noscript>These exercises need JavaScript switched on.</noscript></div>
    </section>

    <nav class="page-section lecture-nav" aria-label="Lecture navigation">
"""
    out += f'      <a href="lecture-{n-1:02d}.html">&larr; Lecture {n-1}</a>\n' if n > 1 else '      <a href="./">&larr; Course home</a>\n'
    out += f'      <a href="lecture-{n+1:02d}.html">Lecture {n+1} &rarr;</a>\n' if n < len(LECT) else '      <a href="./">Course home &rarr;</a>\n'
    out += "    </nav>\n"
    return out + FOOT.replace("</body>", '<script src="exercises.js"></script>\n</body>')

PARTS = ["The tax system", "The individual tax formula", "Business and property", "Compensation, retirement and the home"]
PART_LABEL = ["Part one", "Part two", "Part three", "Part four"]

def course_index():
    nv = sum(len(L["videos"]) for L in LECT); nex = sum(len(L["ex"]) for L in LECT)
    out = header(2, COURSE, f"A distance-learning course in individual federal income taxation: {len(LECT)} lectures and {nv} two-minute videos on 2026 tax law, structured around McGraw Hill's Taxation of Individuals.")
    out += f"""
    <header class="page-header">
      <div class="page-eyebrow"><a href="../">Teaching</a> &middot; Distance learning</div>
      <h1 class="page-title">{COURSE}</h1>
      <p class="page-lede">Theory and principles of the federal income tax for individuals, in {len(LECT)} lectures and {nv} two-minute videos, with a slide deck and an interactive exercise set for every lecture. Every figure is for tax year 2026, including the changes made by the One Big Beautiful Bill Act.</p>
    </header>

    <section class="page-section">
{TEXTBOOK_BOX}
      <p>This course covers the theory and principles involved in computing federal income tax for individuals: the tax system and the IRS, tax planning, the individual tax formula, gross income and exclusions, deductions, investments, the tax computation and credits, business income and property, compensation, retirement savings and home ownership. Prerequisite: ACCT 212. One Marshall, Minnesota family runs through the course: Jake and Nora Lindqvist, their children Ava and Leo, Jake's mother Ruth, and Nora's photography business. Their 2026 return is built up lecture by lecture and completed in the last video.</p>
      <h2 class="section-heading">How to study it</h2>
      <ol class="steps">
        <li>Work through the lectures in order. Read the textbook chapter for each lecture.</li>
        <li>Watch the six microteaches. Each is under two minutes, made to be watched on a phone, and lists a free IRS publication to go with it.</li>
        <li>When a video asks a quick-check question, pause it and answer before the reveal.</li>
        <li>Finish each lecture with its exercise set ({nex} questions in all), then the textbook's end-of-chapter problems.</li>
      </ol>
      <div class="callout">Every lecture has a textbook chapter, six videos, a two-hour slide deck and an interactive exercise set. The videos are narrated with a synthetic voice.</div>

      <h2 class="section-heading">Lectures</h2>
"""
    for i, p in enumerate(PARTS):
        out += f'      <h3 class="part-heading">{PART_LABEL[i]} &middot; {e(p)}</h3>\n      <ol class="lesson-index">\n'
        for L in LECT:
            m = L["meta"]
            if m["part"] != p: continue
            out += f'<li><a href="lecture-{m["n"]:02d}.html" data-acct-lecture="{m["n"]}"><span class="li-num">L{m["n"]}</span><span><span class="li-title">{e(cap(m["title"]))}</span><span class="li-case">{e(m["summary"])} <span class="li-read">Read: {m["ch"]}.</span></span></span><span class="li-done">Week {m["week"]}</span></a></li>\n'
        out += "      </ol>\n"
    out += """
      <h2 class="section-heading">Reading list</h2>
      <p>The whole semester's reading in one table. The fourteen chapters of <cite>Taxation of Individuals</cite> follow the lectures in order.</p>
      <table class="reading-table">
        <thead><tr><th>Week</th><th>Lecture</th><th>Textbook reading</th></tr></thead>
        <tbody>
"""
    for L in LECT:
        m = L["meta"]
        if m["week"] == 9:
            out += '          <tr class="exam"><td>8</td><td>Midterm (Lectures 1&ndash;7)</td><td>Review Chapters 1&ndash;7</td></tr>\n'
        out += f'          <tr><td>{m["week"]}</td><td><a href="lecture-{m["n"]:02d}.html">L{m["n"]} {e(m["short"])}</a></td><td>{m["ch"]}</td></tr>\n'
    out += '          <tr class="exam"><td>Finals</td><td>Final exam (cumulative)</td><td>All of the above</td></tr>\n'
    out += """        </tbody>
      </table>

      <h2 class="section-heading">Lecture slides</h2>
      <p>Each lecture has a PowerPoint deck for a two-hour session. Every topic has a QR code that opens its video on your phone, followed by worked examples and a paired activity, then a case study and exam practice. Model answers and timings are in the speaker notes.</p>
      <ol class="lesson-index">
"""
    for L in LECT:
        m = L["meta"]
        out += f'        <li><a href="slides/ACCT414-Lecture-{m["n"]:02d}.pptx" download><span class="li-num">L{m["n"]}</span><span><span class="li-title">{e(cap(m["title"]))}</span><span class="li-case">PowerPoint, {kb(m["n"])} KB</span></span><span class="li-done">Download</span></a></li>\n'
    out += """      </ol>
    </section>
"""
    return out + FOOT.replace("</body>", '<script src="exercises.js"></script>\n</body>')

def exercises_js():
    eng = open(f"{ROOT}/src/ex_engine.js").read()
    data = {str(L["meta"]["n"]): L["ex"] for L in LECT}
    head = """/* End-of-lecture exercises for ACCT 414 Federal Tax I (tax year 2026).
   Each lecture page has <div id="acct-ex" data-lecture="N">. Question types:
   mcq (choose one), match (pair each item), order (put steps in sequence),
   sort (put each item in a category) and num (enter a number).
   Progress is kept in this browser's localStorage. */
(function () {
  "use strict";

  var POOL = {};

  var DATA = """ + json.dumps(data, ensure_ascii=False, indent=1) + ";\n\n"
    return head + eng

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, "index.html"), "w").write(course_index())
for L in LECT:
    open(os.path.join(OUT, f"lecture-{L['meta']['n']:02d}.html"), "w").write(lecture_page(L))
open(os.path.join(OUT, "exercises.js"), "w").write(exercises_js())
os.makedirs(os.path.join(OUT, "source"), exist_ok=True)
json.dump({str(L["meta"]["n"]): L["content"] for L in LECT}, open(os.path.join(OUT, "source", "content.json"), "w"), indent=1, ensure_ascii=False)
print("ok", len(LECT), "lectures")
