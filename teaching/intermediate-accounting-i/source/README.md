# ACCT 416 video, slide and page source

Source files for the ACCT 416 Intermediate Accounting I course (84 microteach videos, 14 decks, 14 lecture pages). Textbook: Kieso, Weygandt, Warfield and Wiley, *Intermediate Accounting*, 19th edition (Wiley, 2025), shared with the other intermediate accounting course with no chapter overlap.

- `lectures/L01.json` … `L14.json`: one file per lecture, holding everything: `meta` (title, week, chapter, part), `videos` (scenes with a visual and the narration in `say`; quick-check scenes also have a `reveal`), `content` (warm-up, activities, case, exam practice, outcomes and takeaways for the slides) and `ex` (the exercise set).
- `split.py`: writes the per-lecture video scripts in `scripts/` that the renderer reads. `lint.py` checks that tables, flows and journal rows fit the frame.
- `render.py`: turns a script file into 1080×1920 MP4s and poster images in the ACCT 360 house style. It spells out dollar amounts, years and acronyms for the voice.
- `deck.js`: builds the two-hour PowerPoint for each lecture.
- `buildcost.py` (+ `course.json`, `ex_engine.js`): rebuilds the course pages and `exercises.js`. The same script builds both cost accounting courses from their `course.json`.
- `durations.json`: video lengths in seconds.

## Voice

Kokoro v1.0 (open source, via `kokoro-onnx`): a blend of **60% `am_fenrir` and 40% `am_michael`** at **speed 0.95**, US English, the same voice as ACCT 211, 360, 413, 341 and 414.

## Re-render a video after editing its lecture file

```
pip install kokoro-onnx soundfile numpy pillow qrcode
python3 split.py && python3 lint.py
python3 render.py scripts/L04.json out 4.2
node deck.js ../slides
python3 buildcost.py .. .
```

Paths near the top of each script point at `/home/claude/i416/`; change them if needed.
