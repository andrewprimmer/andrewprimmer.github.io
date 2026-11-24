#!/usr/bin/env python3
"""Render ACCT 416 microteach videos in the ACCT 360 house style.

Voice: Kokoro v1.0 (kokoro-onnx), blend 0.6 am_fenrir + 0.4 am_michael, speed 0.95.
Usage: render.py scripts.json OUTDIR [ids...]
"""
import json, os, re, subprocess, sys, tempfile, math
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, SR = 1080, 1920, 30, 24000
BG = (12, 25, 44); GOLD = (242, 183, 66); TEAL = (63, 201, 172); CARD = (25, 41, 66)
WHITE = (244, 246, 250); SOFT = (150, 166, 190); CAPBG = (5, 10, 20); DIM = (70, 84, 108); NAVY = (12, 25, 44)
FD = "/usr/share/fonts/truetype/google-fonts/ofl/firasans/FiraSans-"
_fc = {}
def F(size, w="Bold"):
    k = (size, w)
    if k not in _fc: _fc[k] = ImageFont.truetype(FD + w + ".ttf", size)
    return _fc[k]

COURSE = "ACCT 416"
SPEED = 0.95
VOICE = [("am_fenrir", 0.6), ("am_michael", 0.4)]
_k = None; _style = None
def tts(text):
    global _k, _style
    if _k is None:
        from kokoro_onnx import Kokoro
        _k = Kokoro("/home/claude/tts/kokoro-v1.0.onnx", "/home/claude/tts/voices-v1.0.bin")
        _style = sum(w * _k.get_voice_style(v) for v, w in VOICE)
    y, sr = _k.create(text, voice=_style, speed=SPEED, lang="en-us")
    assert sr == SR
    # trim leading/trailing near-silence
    a = np.abs(y); idx = np.where(a > 0.01)[0]
    if len(idx): y = y[max(0, idx[0] - 600): idx[-1] + 1200]
    return y.astype(np.float32)

YEARS = {}
def _yr(m):
    y = int(m.group(0)); a, b = divmod(y, 100)
    ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    def two(n):
        if n < 10: return ones[n]
        if n < 20: return teens[n - 10]
        return tens[n // 10] + ("-" + ones[n % 10] if n % 10 else "")
    if b == 0: return two(a) + " hundred"
    if b < 10: return two(a) + " oh " + ones[b]
    return two(a) + " " + two(b)

SPELL = ["FASB", "IASB", "IFRS", "SEC", "PCAOB", "EPS", "NRV", "LCNRV", "CECL", "PV", "FV", "ASC", "ASU", "AOCI", "OCI", "HTM", "AFS", "FVNI", "ROU", "ARO", "IPO", "CEO", "EBITDA", "LCM", "SOX", "XBRL", "ABC", "ABM", "COGM", "COGS", "WIP", "CVP", "ROI", "RI", "EVA", "JIT", "NPV", "IRR", "ARR", "MRP", "ERP", "KPI", "KPIs", "CEO", "CFO", "GAAP", "IMA", "CMA", "AI", "ESG", "RFID", "MBA", "DM", "DL", "MOH", "BEP", "AGI", "AMT", "AICPA", "EITC", "IRA", "IRAs", "ISO", "ISOs", "NQO", "NQOs", "NIIT", "CPA", "CPAs", "AOTC", "LLC", "RMD", "RMDs", "SSTS", "QSBS", "FSA", "HSA", "QBI", "IRC", "SSN", "ITIN", "MFJ", "MFS", "HoH", "DIF", "EA", "TCJA", "OBBBA", "OBBB", "FMV", "FUTA", "CTC", "ODC", "ACTC", "NOL", "PTIN"]
def say_text(s):
    """Text for the voice: spell out symbols and acronyms the model may misread."""
    s = re.sub(r"\$([\d,]+(?:\.\d+)?)( million| billion)?", lambda m: m.group(1) + (m.group(2) or "") + " dollars", s)
    s = s.replace("%", " percent").replace("§", "section ")
    for a, b in [("401(k)", "four-oh-one-K"), ("403(b)", "four-oh-three-B"), ("83(b)", "eighty-three-B"), ("199A", "one ninety-nine A"),
                 ("Form 1040", "Form ten-forty"), ("1040", "ten-forty"), ("1099-NEC", "ten ninety-nine N E C"), ("1099", "ten ninety-nine"),
                 ("1031", "ten thirty-one"), ("1231", "twelve thirty-one"), ("1245", "twelve forty-five"), ("1250", "twelve fifty"),
                 ("W-4", "W four"), ("W-2", "W two"), ("Schedule 1-A", "Schedule one A"), ("Circular 230", "Circular two thirty"),
                 ("ACCT 416", "Accounting four sixteen"), ("ACCT 312", "Accounting three twelve"), ("ACCT 311", "Accounting three eleven"), ("FIFO", "fie-foe"), ("LIFO", "lie-foe"), ("GAAP", "gap"), ("PP&E", "P-P-and-E"), ("R&D", "R-and-D"), ("FASB", "fazz-bee"), ("ACCT 212", "Accounting two twelve"), ("59½", "fifty-nine and a half"), ("½", " and a half"),
                 ("Pub. ", "Publication "), ("e.g.", "for example"), ("vs.", "versus")]:
        s = s.replace(a, b)
    for w in SPELL:
        s = re.sub(r"\b" + w + r"\b", "-".join(list(w[:-1])) + "s" if w.endswith("s") and w[:-1].isupper() else "-".join(list(w)), s)
    s = re.sub(r"\b(1[6-9]\d\d|20\d\d)\b(?!,\d)", _yr, s)
    return s

def split_sentences(t):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“$])', t.strip())
    return [p for p in parts if p]

def chunks(sentence, maxc=34):
    words = sentence.split(); out = []; cur = ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > maxc:
            out.append(cur); cur = w
        else: cur = (cur + " " + w).strip()
    if cur: out.append(cur)
    # avoid tiny last chunk
    if len(out) > 1 and len(out[-1]) < 10:
        last = out.pop(); out[-1] += " " + last
    return out

# ---------------- drawing helpers ----------------
def wrap(d, text, font, maxw):
    lines = []
    for para in text.split("\n"):
        cur = ""
        for w in para.split():
            t = (cur + " " + w).strip()
            if d.textlength(t, font=font) <= maxw: cur = t
            else:
                if cur: lines.append(cur)
                cur = w
        lines.append(cur)
    return lines

def rr(d, box, fill, r=16, outline=None, width=3):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def pill(d, x, y, text, fill, fg=NAVY, size=34, center=False):
    f = F(size, "SemiBold"); tw = d.textlength(text, font=f); h = size + 22
    if center: x = x - (tw + 40) / 2
    rr(d, (x, y, x + tw + 40, y + h), fill, r=h // 2)
    d.text((x + 20, y + h / 2), text, font=f, fill=fg, anchor="lm")
    return h

def ctext(d, y, text, font, fill, maxw=900, gap=1.18):
    for ln in wrap(d, text, font, maxw):
        d.text((W / 2, y), ln, font=font, fill=fill, anchor="ma"); y += font.size * gap
    return y

def ltext(d, x, y, text, font, fill, maxw=948, gap=1.18):
    for ln in wrap(d, text, font, maxw):
        d.text((x, y), ln, font=font, fill=fill); y += font.size * gap
    return y

def base(vid, progress):
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, int(W * progress), 12), fill=GOLD)
    pill(d, 66, 150, f"{COURSE} · {vid['id']}", GOLD, size=34)
    d.text((70, 232), vid["title"], font=F(36, "Medium"), fill=SOFT)
    return im, d

def heading(d, text, y=360):
    f = F(70, "Bold"); y2 = ltext(d, 66, y, text, f, WHITE)
    d.rectangle((66, y2 + 6, 186, y2 + 14), fill=GOLD)
    return y2 + 56

def caption(d, text):
    if not text: return
    f = F(50, "SemiBold"); lines = wrap(d, text, f, 860)
    h = len(lines) * 62 + 44; y0 = 1400
    rr(d, (66, y0, W - 66, y0 + h), CAPBG, r=18)
    y = y0 + 24
    for ln in lines:
        d.text((W / 2, y), ln, font=f, fill=WHITE, anchor="ma"); y += 62

def money(v):
    if v in ("", None): return ""
    if isinstance(v, str): return v
    if v < 0: return "(" + money(-v) + ")"
    return f"{v:,.0f}" if float(v).is_integer() else f"{v:,.2f}"

# ---------------- scene renderers ----------------
def draw_scene(vid, sc, reveal, state, d, im):
    t = sc["type"]
    if t == "title":
        f = F(300 if len(vid["id"]) <= 3 else 250, "Black"); d.text((W / 2, 520), vid["id"], font=f, fill=GOLD, anchor="ma")
        ts = 92
        while max(d.textlength(w, font=F(ts, "Bold")) for w in vid["title"].split()) > 940: ts -= 6
        y = ctext(d, 880, vid["title"], F(ts, "Bold"), WHITE, 940)
        ctext(d, y + 30, vid["lecture"], F(40, "Medium"), SOFT)
    elif t in ("list", "flow"):
        y = heading(d, sc["heading"])
        items = sc["items"]; n = len(items)
        hgt = 108 if n <= 5 else (92 if n <= 7 else 80)
        gap = 24 if t == "list" else 54
        fs = 44 if n <= 6 else 40
        for i, it in enumerate(items):
            if i >= reveal: break
            box = (66, y, W - 66, y + hgt)
            if t == "flow":
                rr(d, box, CARD, outline=TEAL, width=4)
                d.text((W / 2, y + hgt / 2), it, font=F(fs, "SemiBold"), fill=WHITE, anchor="mm")
                if i < n - 1:
                    cx = W / 2; d.polygon([(cx - 18, y + hgt + 14), (cx + 18, y + hgt + 14), (cx, y + hgt + 40)], fill=GOLD)
            else:
                rr(d, box, CARD)
                lab = sc.get("labels", "num")
                if lab != "none":
                    ch = str(i + 1) if lab == "num" else "ABCDEFGH"[i]
                    d.ellipse((96, y + hgt / 2 - 26, 148, y + hgt / 2 + 26), fill=GOLD)
                    d.text((122, y + hgt / 2), ch, font=F(32, "Bold"), fill=NAVY, anchor="mm")
                    x0 = 176
                else: x0 = 100
                lines = wrap(d, it, F(fs, "SemiBold"), W - 66 - x0 - 30)
                if len(lines) == 1:
                    d.text((x0, y + hgt / 2), it, font=F(fs, "SemiBold"), fill=WHITE, anchor="lm")
                else:
                    f2 = F(fs - 8, "SemiBold"); lines = wrap(d, it, f2, W - 66 - x0 - 30)
                    yy = y + hgt / 2 - len(lines) * f2.size * 0.6
                    for ln in lines: d.text((x0, yy), ln, font=f2, fill=WHITE); yy += f2.size * 1.15
            y += hgt + gap
    elif t in ("key", "define", "recap"):
        tag = {"key": "KEY IDEA", "define": "DEFINITION", "recap": "RECAP"}[t]
        tag = sc.get("tag", tag)
        y = 430; pill(d, W / 2, y, tag, TEAL, size=32, center=True)
        y += 110
        big = sc["big"]; size = sc.get("size", 120 if len(big) < 14 else (96 if len(big) < 26 else 76))
        y = ctext(d, y, big, F(size, "Black"), WHITE, 950, 1.1)
        y += 40
        for s in sc.get("sub", []):
            y = ctext(d, y, s, F(44, "Medium"), SOFT, 920) + 8
    elif t == "journal":
        y = heading(d, sc["heading"])
        cols = (100, 700, 880)  # account x, debit right edge, credit right edge
        f = F(30, "SemiBold"); d.text((cols[0], y), "Account", font=f, fill=SOFT)
        d.text((cols[1] + 60, y), "Debit", font=f, fill=SOFT, anchor="ra"); d.text((cols[2] + 100, y), "Credit", font=f, fill=SOFT, anchor="ra")
        y += 52
        for i, r in enumerate(sc["rows"]):
            if i >= reveal: break
            acct, dr, cr = r[0], r[1] if len(r) > 1 else "", r[2] if len(r) > 2 else ""
            rh, step = (92, 110) if len(sc["rows"]) <= 6 else (80, 94)
            rr(d, (66, y, W - 66, y + rh), CARD)
            indent = 60 if (cr not in ("", None) and dr in ("", None)) else 0
            fa = F(42 if len(acct) < 26 else 36, "SemiBold")
            d.text((cols[0] + indent, y + rh / 2), acct, font=fa, fill=WHITE, anchor="lm")
            d.text((cols[1] + 60, y + rh / 2), money(dr), font=F(42, "Bold"), fill=GOLD, anchor="rm")
            d.text((cols[2] + 100, y + rh / 2), money(cr), font=F(42, "Bold"), fill=TEAL, anchor="rm")
            y += step
        if sc.get("note") and reveal >= len(sc["rows"]):
            ltext(d, 70, y + 10, sc["note"], F(38, "Medium"), SOFT, 940)
    elif t == "table":
        y = heading(d, sc["heading"])
        for i, r in enumerate(sc["rows"]):
            if i >= reveal: break
            lab, val = r[0], (r[1] if len(r) > 1 else "")
            style = r[2] if len(r) > 2 else ""
            if style == "total":
                d.line((600, y + 4, W - 80, y + 4), fill=WHITE, width=3)
            fl = F(42, "Bold" if style in ("total", "head") else "Medium")
            col = GOLD if style == "total" else (SOFT if style == "head" else WHITE)
            x = 90 if style != "indent" else 140
            d.text((x, y + 20), lab, font=fl, fill=col)
            d.text((W - 90, y + 20), money(val), font=F(42, "Bold" if style == "total" else "SemiBold"), fill=col, anchor="ra")
            y += 82
        if sc.get("note") and reveal >= len(sc["rows"]):
            ltext(d, 70, y + 20, sc["note"], F(38, "Medium"), SOFT, 940)
    elif t == "compare":
        y = heading(d, sc["heading"])
        c1, c2 = sc["cols"]; xa, xb = 380, 715
        d.text((xa, y), c1, font=F(38, "Bold"), fill=GOLD); d.text((xb, y), c2, font=F(38, "Bold"), fill=TEAL)
        y += 70
        for i, r in enumerate(sc["rows"]):
            if i >= reveal: break
            rr(d, (66, y, W - 66, y + 104), CARD)
            lf = F(36, "Medium") if d.textlength(r[0], font=F(36, "Medium")) <= 265 else F(31, "Medium")
            ll = wrap(d, r[0], lf, 265); yy = y + 52 - len(ll) * lf.size * 0.6
            for ln in ll: d.text((96, yy), ln, font=lf, fill=SOFT); yy += lf.size * 1.15
            for x, txt in ((xa, r[1]), (xb, r[2])):
                ls = wrap(d, txt, F(36, "SemiBold"), 290); yy = y + 52 - len(ls) * 22
                for ln in ls: d.text((x, yy), ln, font=F(36, "SemiBold"), fill=WHITE); yy += 44
            y += 120
    elif t == "taccount":
        y = heading(d, sc["heading"])
        accts = sc["accounts"]; n = len(accts); colw = (W - 132 - (n - 1) * 40) / n
        for j, a in enumerate(accts):
            x0 = 66 + j * (colw + 40); x1 = x0 + colw; mid = (x0 + x1) / 2
            d.text((mid, y), a["name"], font=F(40, "Bold"), fill=WHITE, anchor="ma")
            d.line((x0, y + 62, x1, y + 62), fill=WHITE, width=4); d.line((mid, y + 62, mid, y + 520), fill=WHITE, width=4)
            d.text((x0 + 6, y + 72), "Dr", font=F(28, "Medium"), fill=SOFT); d.text((x1 - 6, y + 72), "Cr", font=F(28, "Medium"), fill=SOFT, anchor="ra")
            yy = y + 120
            for side, v in a.get("entries", [])[:reveal]:
                if side == "dr": d.text((mid - 20, yy), money(v), font=F(42, "Bold"), fill=GOLD, anchor="ra")
                else: d.text((mid + 20, yy), money(v), font=F(42, "Bold"), fill=TEAL, anchor="la")
                yy += 64
            if a.get("balance") and reveal >= len(a.get("entries", [])):
                side, v = a["balance"]
                d.line((x0 + 10, y + 450, x1 - 10, y + 450), fill=SOFT, width=2)
                txt = "Bal " + money(v)
                if side == "dr": d.text((mid - 20, y + 466), txt, font=F(38, "Bold"), fill=GOLD, anchor="ra")
                else: d.text((mid + 20, y + 466), txt, font=F(38, "Bold"), fill=TEAL, anchor="la")
    elif t == "quiz":
        y = 330; pill(d, 66, y, "QUICK CHECK", TEAL, size=30); y += 100
        y = ltext(d, 66, y, sc["q"], F(64, "Bold"), WHITE, 948, 1.15) + 34
        for i, o in enumerate(sc["opts"]):
            ans = state == "reveal" and i == sc["answer"]
            dim = state == "reveal" and not ans
            f = F(40, "SemiBold"); lines = wrap(d, o, f, 760)
            h = max(110, 40 + 50 * len(lines))
            rr(d, (66, y, W - 66, y + h), TEAL if ans else CARD)
            d.ellipse((96, y + h / 2 - 28, 152, y + h / 2 + 28), fill=NAVY if ans else (DIM if dim else GOLD))
            d.text((124, y + h / 2), "ABCD"[i], font=F(32, "Bold"), fill=WHITE if ans or dim else NAVY, anchor="mm")
            yy = y + h / 2 - len(lines) * 25
            for ln in lines:
                d.text((184, yy), ln, font=f, fill=NAVY if ans else (DIM if dim else WHITE)); yy += 50
            y += h + 22
        if state and state.startswith("count"):
            d.text((W / 2, y + 30), f"Pause & pick … {state[-1]}", font=F(50, "SemiBold"), fill=GOLD, anchor="ma")

def n_reveal(sc):
    t = sc["type"]
    if t in ("list", "flow"): return len(sc["items"])
    if t in ("journal", "table", "compare"): return len(sc["rows"])
    if t == "taccount": return max(len(a.get("entries", [])) for a in sc["accounts"])
    return 0

# ---------------- build timeline ----------------
GAP_SENT, GAP_SCENE, COUNT = 0.32, 0.55, 3.0

def render(vid, outdir, work):
    audio = []; t = 0.0
    segs = []  # (start, end, scene_index, caption, reveal, state)
    scenes = vid["scenes"]
    # expand quiz into question + countdown + reveal
    for si, sc in enumerate(scenes):
        texts = [("say", sc["say"])]
        if sc["type"] == "quiz": texts.append(("reveal", sc["reveal"]))
        scene_start = t; nrev = n_reveal(sc); sent_spans = []
        for kind, txt in texts:
            if kind == "reveal":
                for c in (3, 2, 1):
                    segs.append([t, t + 1.0, si, "", 0, f"count{c}"])
                    audio.append(np.zeros(int(SR * 1.0), np.float32)); t += 1.0
            # voice the whole passage in one go for natural prosody
            y = tts(say_text(txt)); dur = len(y) / SR
            audio.append(y)
            sents = split_sentences(txt)
            pieces = []  # (chunk, weight)
            for k, sn in enumerate(sents):
                cs = chunks(sn)
                for c in cs: pieces.append([c, len(c)])
                if k < len(sents) - 1: pieces[-1][1] += 9  # pause after a sentence
            tot = sum(w for _, w in pieces); ct = t
            for c, w in pieces:
                cd = dur * w / tot
                segs.append([ct, ct + cd, si, c, None, "reveal" if kind == "reveal" else ""]); ct += cd
            t += dur
            audio.append(np.zeros(int(SR * GAP_SENT), np.float32)); t += GAP_SENT
            segs[-1][1] = t
        audio.append(np.zeros(int(SR * (GAP_SCENE - GAP_SENT)), np.float32)); t += GAP_SCENE - GAP_SENT
        segs[-1][1] = t
        # reveal schedule: items appear spread over first 75% of scene speech
        sdur = t - scene_start
        for sg in segs:
            if sg[2] == si and sg[4] is None:
                if nrev:
                    frac = (sg[0] - scene_start) / max(sdur * 0.6, 0.01)
                    sg[4] = min(nrev, 1 + int(frac * nrev))
                else: sg[4] = 0
    # tail hold
    audio.append(np.zeros(int(SR * 0.6), np.float32)); t += 0.6; segs[-1][1] = t
    total = t
    wav = os.path.join(work, "a.wav"); sf.write(wav, np.concatenate(audio), SR)
    # render images, merging identical consecutive states
    lst = []; last_key = None
    for i, (a, b, si, cap, rev, state) in enumerate(segs):
        key = (si, cap, rev, state, round(a / total * 40))
        im, d = base(vid, b / total)
        draw_scene(vid, scenes[si], rev, state, d, im)
        caption(d, cap)
        p = os.path.join(work, f"f{i:04d}.png"); im.save(p)
        lst.append((p, b - a))
        if i == 0:
            im.resize((540, 960), Image.LANCZOS).save(os.path.join(outdir, "posters", vid["id"].replace(".", "-") + ".jpg"), quality=86)
    with open(os.path.join(work, "list.txt"), "w") as fh:
        for p, dur in lst: fh.write(f"file '{p}'\nduration {dur:.3f}\n")
        fh.write(f"file '{lst[-1][0]}'\n")
    out = os.path.join(outdir, "videos", vid["id"].replace(".", "-") + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(work, "list.txt"), "-i", wav,
                    "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "30", "-tune", "stillimage",
                    "-c:a", "aac", "-b:a", "96k", "-ar", str(SR), "-ac", "1", "-shortest", "-movflags", "+faststart", out], check=True)
    return total

if __name__ == "__main__":
    data = json.load(open(sys.argv[1])); outdir = sys.argv[2]; want = set(sys.argv[3:])
    os.makedirs(os.path.join(outdir, "videos"), exist_ok=True); os.makedirs(os.path.join(outdir, "posters"), exist_ok=True)
    meta_p = os.path.join(outdir, "durations.json")
    meta = json.load(open(meta_p)) if os.path.exists(meta_p) else {}
    for vid in data["videos"]:
        if want and vid["id"] not in want: continue
        with tempfile.TemporaryDirectory() as work:
            dur = render(vid, outdir, work)
        meta[vid["id"]] = round(dur, 1); json.dump(meta, open(meta_p, "w"), indent=1)
        print(vid["id"], f"{dur:.1f}s", flush=True)
