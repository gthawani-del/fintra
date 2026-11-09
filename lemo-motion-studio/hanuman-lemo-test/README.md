# Hanuman illustrated motion test — awaiting browser render

10-second illustrated paper crossing using the official Lemo browser renderer. Generated art supplies the texture; deterministic Canvas cutout pieces supply motion. This is a 2.5D adaptation, not the upstream physically lit WebGL box.

## Status
Source and art prepared. JavaScript syntax checked. No rendered preview or creative QA approval yet. Local Chromium failed with `socket() failed: Operation not permitted`. External render asset transfer was rejected by automatic approval review pending explicit user authorization. Do not call this a completed video.

## Inputs (private, not committed)
- `assets/hanuman.webp`: transparent character derived with native ChatGPT image generation from the approved paper frame.
- `assets/background.webp`: clean scenery plate derived with native ChatGPT image generation from the same frame.
- `assets/mix.mp3`: unchanged 42–52 second excerpt from the approved Ramayana proof mix, encoded for transport. Contains the approved narrator, original synthesized score and effects.

Original PNGs remain in the workspace. Assets and rendered media are excluded from Git.

## Render
Use upstream Lemo at `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`. Install its declared dependencies and Chromium. Put the private assets in `assets/`, set `LEMO_ROOT`, then run `bash build.sh`. The build calls official `core/render/still.mjs` and `core/render/video.mjs`, then FFmpeg muxes sound. A hosted render environment still executes Lemo; no generative-video model is involved.

## Required review
Inspect all six actual stills and the first 2 seconds in 0.2-second steps. Check hand/forearm, rear-leg and sash joints for holes or duplicate texture; verify wave mask boundaries do not slide as visible straight cuts. Adjust masks before accepting. Watch the complete 10 seconds with sound; confirm clear narration, intended scale reveal, no clipped figure, 300 video frames at 30 fps and an AAC audio stream. This single-pose rig proves airborne movement only, not takeoff or landing.
