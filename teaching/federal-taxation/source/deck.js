// Build the ACCT 414 lecture decks (one .pptx per lecture) in the ACCT 360 house style.
// Usage: node deck.js OUTDIR [lectureNumbers...]
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const SK = "/root/.claude/skills/synced/50788f16-74a9-4921-8099-806387fc5580_a4680f07-b999-4643-8cff-27ba98b5a0bb/pptx";
const { applyTheme } = require(SK + "/scripts/apply_theme.js");

const OUT = process.argv[2];
const ONLY = process.argv.slice(3).map(Number);
const SCRIPTS = {};
for (const f of fs.readdirSync("/home/claude/tax/scripts")) for (const v of JSON.parse(fs.readFileSync("/home/claude/tax/scripts/" + f)).videos) SCRIPTS[v.id] = v;
const DUR = JSON.parse(fs.readFileSync("/home/claude/tax/out/durations.json"));
const CONTENT = {}; for (const f of fs.readdirSync("/home/claude/tax/lectures")) { const L = JSON.parse(fs.readFileSync("/home/claude/tax/lectures/" + f)); CONTENT[String(L.meta.n)] = L.content; CONTENT[String(L.meta.n)].meta = L.meta; }
const SITE = "andrewprimmer.com/teaching/federal-taxation/";
const LECT = [""]; for (let i = 1; i <= 14; i++) LECT.push(CONTENT[String(i)].meta.title);
const READ = [""]; for (let i = 1; i <= 14; i++) READ.push(CONTENT[String(i)].meta.ch);
const MISSION = {};

const THEME = { name: "ACCT 414", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "14304C", lt1: "FFFFFF", dk2: "5B7083", lt2: "EEF5F3", accent1: "2E8B76", accent2: "F5B841", accent3: "E3EEF2", accent4: "63BFA8", accent5: "C9D8D4", accent6: "FCEFCF", hlink: "2E8B76", folHlink: "5B7083" } };
const HEX = { navy: "14304C", gold: "F5B841", teal: "2E8B76", mint: "EEF5F3", ice: "E3EEF2", line: "C9D8D4", slate: "5B7083", soft: "9FB4C4", pale: "FCEFCF", white: "FFFFFF" };

function mmss(t) { return Math.floor(t / 60) + ":" + String(Math.round(t % 60)).padStart(2, "0"); }
function money(v) { if (v === "" || v == null) return ""; if (typeof v === "string") return v; const n = Math.abs(v); const s = n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); return v < 0 ? "(" + s + ")" : s; }
function qr(url, file) { execFileSync("python3", ["-c", `import qrcode,sys;q=qrcode.QRCode(border=1,box_size=12);q.add_data(sys.argv[1]);q.make(fit=True);q.make_image(fill_color='#14304C',back_color='white').save(sys.argv[2])`, url, file]); return file; }

async function build(n) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.author = "Andrew Primmer"; pres.title = `ACCT 414 Lecture ${n}: ${LECT[n]}`; pres.subject = "ACCT 414 Federal Tax I";
  const C = pres.SchemeColor;
  const foot = `ACCT 414 Federal Tax I · Lecture ${n} · Tax year 2026`;
  const footObj = (dark) => ({ text: { text: foot, options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: dark ? C.accent5 : C.text2, margin: 0 } } });
  const sn = (dark) => ({ x: 12.2, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: dark ? C.accent5 : C.text2, align: "right" });
  pres.defineSlideMaster({ title: "DARK", background: { color: HEX.navy }, objects: [footObj(true)], slideNumber: sn(true),
    placeholders: [] });
  pres.defineSlideMaster({ title: "CONTENT", background: { color: HEX.white }, objects: [footObj(false)], slideNumber: sn(false) });
  // title placeholder for the content layout
  pres.defineSlideMaster({ title: "TITLED", background: { color: HEX.white }, slideNumber: sn(false),
    objects: [footObj(false), { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.8, fontFace: "Cambria", fontSize: 30, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } }] });

  const vids = [1, 2, 3, 4, 5, 6].map((j) => SCRIPTS[`${n}.${j}`]);
  const K = CONTENT[String(n)];
  const qdir = fs.mkdtempSync("/tmp/qr");
  const page = `https://${SITE}lecture-${String(n).padStart(2, "0")}.html`;

  // helpers
  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, fontFace: "Calibri", fontSize: 16, color: C.text1, margin: 0, valign: "top" }, o));
  const titled = (sec, title) => { const s = pres.addSlide({ masterName: "TITLED", sectionTitle: sec }); s.addText(title, { placeholder: "title" }); return s; };
  const circle = (s, x, y, d, num, fill, fg) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "num-" + num });
    T(s, String(num), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize: d > 0.5 ? 16 : 13, color: fg });
  };
  const card = (s, x, y, w, h, fill, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill }, objectName: name || "card" });

  // ---------- 1. title ----------
  pres.addSection({ title: "Introduction" });
  let s = pres.addSlide({ masterName: "DARK", sectionTitle: "Introduction" });
  T(s, `Lecture ${n}`, { x: 0.8, y: 1.6, w: 8, h: 0.4, fontSize: 18, bold: true, color: C.accent2 });
  T(s, LECT[n], { x: 0.8, y: 2.1, w: 11.5, h: 1.6, fontFace: "Cambria", fontSize: 40, bold: true, color: C.background1, valign: "middle" });
  T(s, `Read: Spilker et al., Taxation of Individuals (2027 release), ${READ[n]}`, { x: 0.8, y: 4.1, w: 7.5, h: 0.9, fontSize: 18, color: C.accent5 });
  card(s, 8.8, 4.0, 3.7, 1.2, "0E1A2C", "phone-card");
  T(s, [{ text: "Bring your phone", options: { bold: true, color: HEX.gold, breakLine: true } }, { text: "Six two-minute videos, one QR code each", options: { color: HEX.white } }], { x: 9.0, y: 4.15, w: 3.4, h: 0.95, fontSize: 15, valign: "middle" });
  s.addNotes(`Welcome. Timing: about 2 minutes. Introduce Lecture ${n} and remind students to have their phones ready: each topic starts with a two-minute microteach they watch on their own phone. Reading: Taxation of Individuals, ${READ[n]}. All figures are for tax year 2026.`);

  // ---------- 2. outcomes ----------
  s = titled("Introduction", "By the end of this lecture you can");
  K.outcomes.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 0.6 + col * 6.15, y = 1.55 + row * 1.7;
    card(s, x, y, 5.95, 1.45, HEX.mint, "outcome-" + (i + 1));
    circle(s, x + 0.3, y + 0.42, 0.6, i + 1, HEX.gold, HEX.navy);
    T(s, o, { x: x + 1.15, y: y + 0.2, w: 4.6, h: 1.05, fontSize: 18, valign: "middle" });
  });
  s.addNotes("Timing: about 3 minutes. Read the outcomes aloud. Each one matches one microteach and one topic block.");

  // ---------- 3. session plan ----------
  s = titled("Introduction", "Session plan: two hours");
  const plan = [["Welcome, outcomes and warm-up", 0, 8]];
  let t0 = 8;
  vids.forEach((v, i) => { if (i === 3) { plan.push(["Break", t0, 10]); t0 += 10; } plan.push([`${v.id} ${v.title}`, t0, 15]); t0 += 15; });
  plan.push(["Case study", t0, 10]); t0 += 10; plan.push(["Exam practice and summary", t0, 7]);
  const hdr = (t) => ({ text: t, options: { bold: true, color: HEX.white, fill: { color: HEX.navy } } });
  const rows = [[hdr("Segment"), hdr("Starts at (min)"), hdr("Minutes")]].concat(plan.map((r) => r.map((c, k) => ({ text: String(c), options: { fill: { color: r[0] === "Break" ? HEX.pale : HEX.white }, align: k ? "center" : "left" } }))));
  s.addTable(rows, { x: 0.6, y: 1.5, w: 8.6, colW: [5.6, 1.6, 1.4], fontFace: "Calibri", fontSize: 14, color: HEX.navy, border: { type: "solid", pt: 0.75, color: HEX.line }, rowH: 0.4 });
  card(s, 9.6, 1.5, 3.1, 2.7, HEX.navy, "block-card");
  T(s, [{ text: "Each topic block", options: { bold: true, color: HEX.gold, breakLine: true } }, { text: "Watch the video on your phone", options: { bullet: true, breakLine: true } }, { text: "Expanded teaching and worked examples", options: { bullet: true, breakLine: true } }, { text: "Activity in pairs", options: { bullet: true } }], { x: 9.85, y: 1.7, w: 2.7, h: 2.3, fontSize: 15, color: C.background1, paraSpaceAfter: 6 });
  s.addNotes(`Timing: about 1 minute. The session runs about ${t0 + 7} minutes. Each topic block is: watch the microteach (3 min), teach the expanded content (8 min), then a short activity (4 min).`);

  // ---------- 4. warm-up ----------
  s = titled("Introduction", "Warm-up");
  card(s, 0.6, 1.5, 5.6, 4.9, HEX.navy, "warmup-q");
  T(s, K.warmup[0], { x: 0.95, y: 1.8, w: 4.9, h: 4.3, fontFace: "Cambria", fontSize: 24, bold: true, color: C.background1, valign: "middle" });
  T(s, [{ text: "Talk with the person next to you for two minutes.", options: { bullet: true, breakLine: true } }, { text: "Be ready to share one answer with the room.", options: { bullet: true, breakLine: true } }, { text: "We'll come back to your answers during the lecture.", options: { bullet: true } }], { x: 6.7, y: 1.8, w: 5.9, h: 2.4, fontSize: 18, paraSpaceAfter: 10 });
  s.addNotes("Timing: about 4 minutes. Give students two minutes to talk in pairs, then take three or four answers. " + K.warmup[1]);

  // ---------- topic blocks ----------
  for (let j = 0; j < 6; j++) {
    const v = vids[j], sec = `${v.id} ${v.title}`;
    pres.addSection({ title: sec });
    // QR slide
    s = pres.addSlide({ masterName: "DARK", sectionTitle: sec });
    const d = mmss(DUR[v.id]);
    T(s, `Microteach ${v.id}  ·  ${d}`, { x: 0.8, y: 0.8, w: 7, h: 0.4, fontSize: 18, bold: true, color: C.accent2 });
    T(s, v.title, { x: 0.8, y: 1.3, w: 7.6, h: 1.6, fontFace: "Cambria", fontSize: 36, bold: true, color: C.background1, valign: "top" });
    T(s, [{ text: "Watch it on your phone", options: { bold: true, color: HEX.gold, breakLine: true } },
      { text: "Scan the code with your phone camera.", options: { bullet: { type: "number" }, breakLine: true } },
      { text: "Watch the video. Use headphones or keep the sound low.", options: { bullet: { type: "number" }, breakLine: true } },
      { text: "Pause at the quick check and answer it before the reveal.", options: { bullet: { type: "number" } } }],
      { x: 0.8, y: 3.4, w: 7.4, h: 2.0, fontSize: 18, color: C.background1, paraSpaceAfter: 6 });
    T(s, page.replace("https://", "") + "#video-" + v.id.replace(".", "-"), { x: 0.8, y: 6.2, w: 8, h: 0.35, fontSize: 12, color: C.accent5 });
    card(s, 9.1, 1.0, 3.6, 4.9, HEX.white, "qr-card");
    s.addImage({ path: qr(page + "#video-" + v.id.replace(".", "-"), `${qdir}/v${j}.png`), x: 9.4, y: 1.3, w: 3.0, h: 3.0, altText: `QR code linking to microteach ${v.id}: ${v.title}` });
    T(s, [{ text: "Scan to watch", options: { bold: true, breakLine: true } }, { text: d, options: { color: HEX.slate } }], { x: 9.1, y: 4.55, w: 3.6, h: 0.9, align: "center", fontSize: 16, color: C.text1 });
    s.addNotes(`Timing: about 3 minutes. Students scan the code and watch microteach ${v.id} (${d}) on their phones. Ask them to answer the video's quick-check question before the reveal. Link: ${page}#video-${v.id.replace(".", "-")}`);

    // teaching slides from the video's scenes
    const sc = v.scenes.map((x, i) => Object.assign({ _i: i }, x)).filter((x) => x.type !== "title" && x.type !== "quiz");
    const rank = (x) => ({ journal: 0, table: 0, compare: 0, taccount: 0, flow: 1, list: 1 }[x.type] ?? 2);
    const pick = sc.slice().sort((a, b) => rank(a) - rank(b) || a._i - b._i).slice(0, 2).sort((a, b) => a._i - b._i);
    for (const x of pick) teach(x, v, sec);
    // activity
    const act = K.acts[j];
    s = titled(sec, "Activity: " + v.title);
    card(s, 0.6, 1.5, 2.4, 2.4, HEX.navy, "minutes");
    T(s, "4", { x: 0.6, y: 1.65, w: 2.4, h: 1.3, align: "center", valign: "middle", fontFace: "Cambria", fontSize: 60, bold: true, color: C.accent2 });
    T(s, "minutes", { x: 0.6, y: 3.0, w: 2.4, h: 0.5, align: "center", fontSize: 16, color: C.background1 });
    T(s, "In pairs", { x: 0.6, y: 4.1, w: 2.4, h: 0.4, align: "center", fontSize: 15, bold: true, color: C.accent1 });
    card(s, 3.4, 1.5, 9.3, 2.9, HEX.mint, "prompt");
    T(s, act[0], { x: 3.7, y: 1.7, w: 8.7, h: 2.5, fontSize: 20, valign: "middle" });
    card(s, 3.4, 4.65, 9.3, 1.6, HEX.ice, "share");
    T(s, [{ text: "Be ready to share", options: { bold: true, color: HEX.teal, breakLine: true } }, { text: "Write down your answer, compare it with your partner's, and agree on one to share with the room." }], { x: 3.7, y: 4.85, w: 8.7, h: 1.2, fontSize: 16 });
    s.addNotes("Timing: about 4 minutes. Suggested answer: " + act[1]);
  }

  // ---------- case, exam, takeaways, next ----------
  pres.addSection({ title: "Wrap-up" });
  const [cname, situation, qs, cnotes] = K.case;
  s = titled("Wrap-up", "Case study: " + cname);
  card(s, 0.6, 1.5, 6.6, 4.9, HEX.mint, "situation");
  T(s, [{ text: "The situation", options: { bold: true, color: HEX.teal, breakLine: true } }, { text: situation }], { x: 0.9, y: 1.7, w: 6.0, h: 4.5, fontSize: 16, paraSpaceAfter: 6 });
  T(s, "In your group", { x: 7.6, y: 1.55, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.accent1 });
  qs.forEach((q, i) => {
    const y = 2.1 + i * 1.08;
    card(s, 7.6, y, 5.1, 0.9, HEX.ice, "q-" + (i + 1));
    circle(s, 7.8, y + 0.2, 0.5, i + 1, HEX.gold, HEX.navy);
    T(s, q, { x: 8.45, y: y + 0.08, w: 4.1, h: 0.74, fontSize: 14, valign: "middle" });
  });
  s.addNotes("Timing: about 10 minutes. Groups of three or four. Give six minutes for discussion, then take one answer per question. " + cnotes);

  s = titled("Wrap-up", "Exam practice");
  K.exam.forEach((e, i) => {
    const y = 1.5 + i * 2.5;
    card(s, 0.6, y, 12.1, 2.2, HEX.mint, "exam-" + (i + 1));
    T(s, "Q" + (i + 1), { x: 0.9, y: y + 0.25, w: 1, h: 0.6, fontFace: "Cambria", fontSize: 28, bold: true, color: C.accent1 });
    T(s, e[0], { x: 2.0, y: y + 0.25, w: 8.9, h: 1.7, fontSize: 17, valign: "middle" });
    T(s, e[1] + " marks", { x: 11.0, y: y + 0.25, w: 1.5, h: 0.5, fontSize: 15, bold: true, color: C.text2, align: "right" });
  });
  s.addNotes("Timing: about 4 minutes. Model answers:\nQuestion 1: " + K.exam[0][2] + "\nQuestion 2: " + K.exam[1][2]);

  s = titled("Wrap-up", "Key takeaways");
  K.take.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 0.6 + col * 6.15, y = 1.55 + row * 1.7;
    card(s, x, y, 5.95, 1.45, HEX.ice, "take-" + (i + 1));
    circle(s, x + 0.3, y + 0.42, 0.6, i + 1, HEX.teal, HEX.white);
    T(s, o, { x: x + 1.15, y: y + 0.2, w: 4.6, h: 1.05, fontSize: 18, valign: "middle" });
  });
  s.addNotes("Timing: about 2 minutes. Recap the six ideas, one per microteach.");

  s = pres.addSlide({ masterName: "DARK", sectionTitle: "Wrap-up" });
  T(s, "Before next time", { x: 0.8, y: 0.8, w: 7.6, h: 0.9, fontFace: "Cambria", fontSize: 36, bold: true, color: C.background1 });
  const items = [{ text: `Lecture ${n} exercises`, options: { bold: true, color: HEX.gold, breakLine: true } },
    { text: "Scan the code to open the exercise set on the course website.", options: { bullet: true, breakLine: true } },
    { text: "Rewatch any microteach the exercises send you back to.", options: { bullet: true, breakLine: true } },
    { text: `Read Taxation of Individuals, ${READ[n]}.`, options: { bullet: true, breakLine: !!MISSION[n] } }];
  
  T(s, items, { x: 0.8, y: 2.0, w: 7.6, h: 3.0, fontSize: 18, color: C.background1, paraSpaceAfter: 8 });
  if (n < 14) T(s, [{ text: "Next lecture: ", options: { color: HEX.soft } }, { text: LECT[n + 1], options: { bold: true, color: HEX.white } }], { x: 0.8, y: 5.4, w: 7.8, h: 0.5, fontSize: 18 });
  card(s, 9.1, 1.0, 3.6, 4.9, HEX.white, "qr-card");
  s.addImage({ path: qr(page + "#practice", `${qdir}/ex.png`), x: 9.4, y: 1.3, w: 3.0, h: 3.0, altText: `QR code linking to the Lecture ${n} exercises` });
  T(s, "Scan for the exercises", { x: 9.1, y: 4.55, w: 3.6, h: 0.5, align: "center", fontSize: 16, bold: true });
  T(s, page.replace("https://", "") + "#practice", { x: 0.8, y: 6.2, w: 8, h: 0.35, fontSize: 12, color: C.accent5 });
  s.addNotes(`Timing: about 1 minute. Students complete the lecture's exercise set on the course website before next session. Link: ${page}#practice`);

  // ---------- teaching slide renderer ----------
  function teach(x, v, sec) {
    const say = "Timing: about 4 minutes. Expanded teaching, following the video: " + x.say + (x.reveal ? " " + x.reveal : "");
    if (x.type === "flow" || (x.type === "list" && x.items.length <= 4 && x.items.every((it) => it.length <= 34))) {
      const s = titled(sec, x.heading), k = x.items.length, gap = 0.35, w = (12.1 - gap * (k - 1)) / k;
      x.items.forEach((it, i) => {
        const cx = 0.6 + i * (w + gap);
        card(s, cx, 1.8, w, 2.6, i % 2 ? HEX.ice : HEX.mint, "step-" + (i + 1));
        circle(s, cx + 0.25, 2.05, 0.5, i + 1, HEX.teal, HEX.white);
        T(s, it, { x: cx + 0.25, y: 2.75, w: w - 0.5, h: 1.45, fontSize: 18, bold: true, valign: "top" });
        if (x.type === "flow" && i < k - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: cx + w + 0.05, y: 2.95, w: 0.25, h: 0.3, fill: { color: HEX.gold }, line: { color: HEX.gold }, flipH: false, objectName: "arrow-" + (i + 1) });
      });
      s.addNotes(say); return;
    }
    if (x.type === "list") {
      const s = titled(sec, x.heading), k = x.items.length, two = k > 4, cols = two ? 2 : 1;
      const perCol = Math.ceil(k / cols), h = Math.min(1.0, (4.9 - 0.2 * (perCol - 1)) / perCol);
      x.items.forEach((it, i) => {
        const c = two ? Math.floor(i / perCol) : 0, r = two ? i % perCol : i, cx = 0.6 + c * 6.15, y = 1.5 + r * (h + 0.2), w = two ? 5.95 : 12.1;
        card(s, cx, y, w, h, HEX.mint, "item-" + (i + 1));
        if (x.labels !== "none") circle(s, cx + 0.25, y + (h - 0.5) / 2, 0.5, i + 1, HEX.gold, HEX.navy);
        T(s, it, { x: cx + (x.labels !== "none" ? 0.95 : 0.3), y, w: w - 1.1, h, fontSize: 18, valign: "middle" });
      });
      s.addNotes(say); return;
    }
    if (x.type === "compare") {
      const s = titled(sec, x.heading);
      const head = [{ text: "", options: { fill: { color: HEX.navy } } }].concat(x.cols.map((c) => hdr(c)));
      const body = x.rows.map((r, i) => r.map((c, k) => ({ text: String(c), options: { bold: k === 0, color: k === 0 ? HEX.slate : HEX.navy, fill: { color: i % 2 ? HEX.white : HEX.mint } } })));
      s.addTable([head].concat(body), { x: 0.6, y: 1.6, w: 12.1, colW: [3.1, 4.5, 4.5], fontFace: "Calibri", fontSize: 18, color: HEX.navy, border: { type: "solid", pt: 0.75, color: HEX.line }, rowH: 0.62, valign: "middle" });
      s.addNotes(say); return;
    }
    if (x.type === "journal") {
      const s = titled(sec, x.heading);
      const head = [hdr("Account"), Object.assign(hdr("Debit"), { options: { bold: true, color: HEX.white, fill: { color: HEX.navy }, align: "right" } }), Object.assign(hdr("Credit"), { options: { bold: true, color: HEX.white, fill: { color: HEX.navy }, align: "right" } })];
      const body = x.rows.map((r, i) => {
        const cr = (r[2] !== "" && r[2] != null) && (r[1] === "" || r[1] == null);
        const f = { fill: { color: i % 2 ? HEX.white : HEX.mint } };
        return [{ text: r[0], options: Object.assign({ indentLevel: cr ? 2 : 0, margin: [0.05, 0.1, 0.05, cr ? 0.6 : 0.1] }, f) },
          { text: money(r[1]), options: Object.assign({ align: "right", bold: true, color: "9A6A00" }, f) },
          { text: money(r[2]), options: Object.assign({ align: "right", bold: true, color: HEX.teal }, f) }];
      });
      s.addTable([head].concat(body), { x: 0.6, y: 1.6, w: 9.0, colW: [5.4, 1.8, 1.8], fontFace: "Calibri", fontSize: 18, color: HEX.navy, border: { type: "solid", pt: 0.75, color: HEX.line }, rowH: 0.55, valign: "middle" });
      card(s, 9.9, 1.6, 2.8, 2.6, HEX.navy, "rule-card");
      T(s, [{ text: "Check", options: { bold: true, color: HEX.gold, breakLine: true } }, { text: "Debits = credits", options: { bullet: true, breakLine: true } }, { text: "Debits first; credits indented", options: { bullet: true, breakLine: true } }, { text: "Each account on the right side", options: { bullet: true } }], { x: 10.1, y: 1.8, w: 2.45, h: 2.25, fontSize: 14, color: C.background1, paraSpaceAfter: 4 });
      if (x.note) T(s, x.note, { x: 0.6, y: 1.8 + 0.55 * (x.rows.length + 1), w: 9.0, h: 0.6, fontSize: 16, italic: true, color: C.text2 });
      s.addNotes(say); return;
    }
    if (x.type === "table") {
      const s = titled(sec, x.heading);
      const body = x.rows.map((r, i) => {
        const st = r[2] || "", tot = st === "total", head = st === "head";
        const f = { fill: { color: tot ? HEX.pale : (i % 2 ? HEX.white : HEX.mint) }, bold: tot || head, color: head ? HEX.slate : HEX.navy };
        return [{ text: r[0], options: Object.assign({ margin: [0.05, 0.1, 0.05, st === "indent" ? 0.5 : 0.1] }, f) }, { text: money(r[1] ?? ""), options: Object.assign({ align: "right" }, f) }];
      });
      s.addTable(body, { x: 0.6, y: 1.6, w: 9.0, colW: [6.4, 2.6], fontFace: "Calibri", fontSize: 18, color: HEX.navy, border: { type: "solid", pt: 0.75, color: HEX.line }, rowH: 0.52, valign: "middle" });
      if (x.note) T(s, x.note, { x: 0.6, y: 1.8 + 0.52 * x.rows.length, w: 9.0, h: 0.6, fontSize: 16, italic: true, color: C.text2 });
      card(s, 9.9, 1.6, 2.8, 2.0, HEX.navy, "work-card");
      T(s, [{ text: "Work it through", options: { bold: true, color: HEX.gold, breakLine: true } }, { text: "Cover the right-hand column and calculate each line before revealing it.", options: {} }], { x: 10.1, y: 1.8, w: 2.45, h: 1.65, fontSize: 14, color: C.background1 });
      s.addNotes(say); return;
    }
    if (x.type === "taccount") {
      const s = titled(sec, x.heading);
      x.accounts.forEach((a, k) => {
        const w = 3.8, n2 = x.accounts.length, cx = (13.33 - (n2 * w + (n2 - 1) * 0.4)) / 2 + k * (w + 0.4);
        T(s, a.name, { x: cx, y: 1.6, w, h: 0.45, align: "center", fontSize: 20, bold: true });
        s.addShape(pres.shapes.LINE, { x: cx, y: 2.1, w, h: 0, line: { color: HEX.navy, width: 2.5 } });
        s.addShape(pres.shapes.LINE, { x: cx + w / 2, y: 2.1, w: 0, h: 3.4, line: { color: HEX.navy, width: 2.5 } });
        const dr = a.entries.filter((e) => e[0] === "dr").map((e) => money(e[1])), cr = a.entries.filter((e) => e[0] === "cr").map((e) => money(e[1]));
        T(s, dr.join("\n"), { x: cx, y: 2.25, w: w / 2 - 0.2, h: 2.5, align: "right", fontSize: 18, bold: true, color: "9A6A00" });
        T(s, cr.join("\n"), { x: cx + w / 2 + 0.2, y: 2.25, w: w / 2 - 0.2, h: 2.5, fontSize: 18, bold: true, color: HEX.teal });
        if (a.balance) T(s, "Balance " + money(a.balance[1]) + (a.balance[0] === "dr" ? " Dr" : " Cr"), { x: cx, y: 5.6, w, h: 0.4, align: "center", fontSize: 16, bold: true, color: C.text1 });
      });
      s.addNotes(say); return;
    }
    // key / define / recap
    const s = titled(sec, v.title);
    card(s, 0.6, 1.5, 7.4, 4.9, HEX.navy, "key-card");
    T(s, (x.tag || { key: "KEY IDEA", define: "DEFINITION", recap: "RECAP" }[x.type]).toUpperCase(), { x: 0.95, y: 1.8, w: 6.7, h: 0.4, fontSize: 14, bold: true, color: C.accent4 });
    T(s, x.big, { x: 0.95, y: 2.3, w: 6.7, h: 3.8, fontFace: "Cambria", fontSize: 34, bold: true, color: C.background1, valign: "middle" });
    if (x.sub && x.sub.length) {
      card(s, 8.4, 1.5, 4.3, 4.9, HEX.mint, "sub-card");
      T(s, x.sub.join(" "), { x: 8.7, y: 1.8, w: 3.7, h: 4.3, fontSize: 18, valign: "middle" });
    }
    s.addNotes(say);
  }

  const file = path.join(OUT, `ACCT414-Lecture-${String(n).padStart(2, "0")}.pptx`);
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const list = ONLY.length ? ONLY : Array.from({ length: 14 }, (_, i) => i + 1);
  for (const n of list) console.log(await build(n));
})();
