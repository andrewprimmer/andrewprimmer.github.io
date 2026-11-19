# ACCT 211 video source

Source files for the 84 ACCT 211 microteach videos.

- `scripts/L01.json` … `L14.json`: one file per lecture. Each video is a list of scenes. A scene has a visual (`type` plus its fields) and the narration (`say`). Quick-check scenes also have a `reveal`.
- `render.py`: turns a script file into 1080×1920 MP4s and poster images in the ACCT 360 house style.
- `build211.py`: rebuilds the course pages from the scripts, readings and video durations.
- `durations.json`: video lengths in seconds, used on the pages.

## Voice

Kokoro v1.0 (open source, via `kokoro-onnx`): a blend of **60% `am_fenrir` and 40% `am_michael`** at **speed 0.95**, US English. Each scene's narration is voiced as one passage, which sounds more natural than voicing it sentence by sentence.

## Re-render a video after editing its script

```
pip install kokoro-onnx soundfile numpy pillow
# model files: kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
python3 render.py scripts/L04.json out 4.2
python3 build211.py ..
```

`render.py` expects the model files in `/home/claude/tts/`; change the path near the top if needed.
