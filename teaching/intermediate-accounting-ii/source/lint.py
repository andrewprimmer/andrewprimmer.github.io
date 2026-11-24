import json, glob, sys
sys.path.insert(0, "/home/claude/i312/src")
from render import F, money, W
from PIL import Image, ImageDraw
d = ImageDraw.Draw(Image.new("RGB", (10, 10)))
bad = 0
for f in sorted(glob.glob("/home/claude/i312/scripts/L*.json")):
    for v in json.load(open(f))["videos"]:
        for sc in v["scenes"]:
            t = sc["type"]
            if t == "table":
                for r in sc["rows"]:
                    st = r[2] if len(r) > 2 else ""
                    lw = d.textlength(r[0], font=F(42, "Bold" if st in ("total", "head") else "Medium"))
                    vw = d.textlength(money(r[1] if len(r) > 1 else ""), font=F(42, "Bold"))
                    x = 140 if st == "indent" else 90
                    if x + lw + vw + 30 > W - 90: print(v["id"], "TABLE", r, int(x + lw + vw + 30 - (W - 90))); bad += 1
                if len(sc["rows"]) > 7: print(v["id"], "TABLE ROWS", len(sc["rows"])); bad += 1
            if t == "flow":
                fs = 44 if len(sc["items"]) <= 6 else 40
                for it in sc["items"]:
                    if d.textlength(it, font=F(fs, "SemiBold")) > W - 160: print(v["id"], "FLOW", it); bad += 1
                if len(sc["items"]) > 6: print(v["id"], "FLOW N", len(sc["items"])); bad += 1
            if t == "list" and len(sc["items"]) > 6: print(v["id"], "LIST N"); bad += 1
            if t == "compare":
                for r in sc["rows"]:
                    for c in r[1:]:
                        if len(c) > 34: print(v["id"], "COMPARE long", c); bad += 1
                if len(sc["rows"]) > 5: print(v["id"], "COMPARE rows"); bad += 1
print("issues", bad)
# journal width check
bad2 = 0
for f in sorted(glob.glob(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/i312/scripts/L*.json")):
    for v in json.load(open(f))["videos"]:
        for sc in v["scenes"]:
            if sc["type"] != "journal": continue
            for r in sc["rows"]:
                acct, dr, cr = r[0], r[1], r[2]
                fa = F(42 if len(acct) < 26 else 36, "SemiBold")
                indent = 60 if (cr not in ("", None) and dr in ("", None)) else 0
                end = 100 + indent + d.textlength(acct, font=fa)
                if dr not in ("", None):
                    lim = 760 - d.textlength(money(dr), font=F(42, "Bold")) - 20
                else:
                    lim = 980 - d.textlength(money(cr), font=F(42, "Bold")) - 20
                if end > lim: print(v["id"], "JOURNAL", acct, int(end - lim)); bad2 += 1
print("journal issues", bad2)
