# ACCT 414 video, slide and page source

Source files for the ACCT 414 Federal Tax I course (84 microteach videos, 14 decks, 14 lecture pages).

- `scripts/L01.json` … `L14.json`: one file per lecture, holding everything: `meta` (title, week, chapter), `videos` (scenes with a visual and the narration in `say`; quick-check scenes also have a `reveal`), `content` (warm-up, activities, case, exam practice, outcomes and takeaways for the slides) and `ex` (the exercise set).
- `split.py`: writes the per-lecture video scripts the renderer reads.
- `render.py`: turns a script file into 1080×1920 MP4s and poster images in the ACCT 360 house style. It spells out dollar amounts, years and acronyms for the voice.
- `deck.js`: builds the two-hour PowerPoint for each lecture.
- `build414.py` (+ `ex_engine.js`): rebuilds the course pages and `exercises.js`.
- `content.json`: the slide content, for reference.

All figures are tax year 2026 (Rev. Proc. 2025-32 and the One Big Beautiful Bill Act). Update the scripts each year.

## Voice

Kokoro v1.0 (open source, via `kokoro-onnx`): a blend of **60% `am_fenrir` and 40% `am_michael`** at **speed 0.95**, US English, the same voice as ACCT 211 and ACCT 360.

## Re-render a video after editing its script

```
pip install kokoro-onnx soundfile numpy pillow qrcode
# model files kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
python3 split.py
python3 render.py scripts/L04.json out 4.2
node deck.js ../slides 4
python3 build414.py ..
```

Paths near the top of each script point at `/home/claude/tax/`; change them if needed.
