import json, glob, os
for f in sorted(glob.glob("/home/claude/c341/lectures/L*.json")):
    d = json.load(open(f)); n = d["meta"]["n"]
    assert len(d["videos"]) == 6, f
    for v in d["videos"]:
        assert v["scenes"][0]["type"] == "title" and v["scenes"][-1]["type"] == "quiz", v["id"]
        for sc in v["scenes"]:
            if sc["type"] == "quiz": assert 0 <= sc["answer"] < len(sc["opts"]) and sc.get("reveal")
    json.dump({"videos": d["videos"]}, open(f"/home/claude/c341/scripts/L{n:02d}.json", "w"), indent=1)
    words = [sum(len((s["say"] + " " + s.get("reveal", "")).split()) for s in v["scenes"]) for v in d["videos"]]
    print(os.path.basename(f), words)
