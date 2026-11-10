# Ramayana — full narrative workprint

Status: full-length animatic/workprint, not final animation. 12 chapters, 74 staged shots, 623.064-second editorial timeline, Hindi narration, two original instrumental interludes, speech-boundary-driven highlighted text. Render target: 1280×720, 30fps. The film is an abridged main-arc retelling ending at the coronation.

## Rebuild

Use the official `lemomo-ai/lemo-opuscar` runtime at commit `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`, Node/Playwright/Chromium, FFmpeg, Python with edge-tts/numpy/scipy. Set `LIB` to that checkout and, if needed, `PLAYWRIGHT_CHROME` to the installed browser. Run `bash build.sh` from this folder. Upstream core and styles are unmodified.

Restore the private media asset package into `assets/` and the OFL Noto Sans Devanagari font into `fonts/`. Do not add media to public Git. Required assets: city.webp, rama.webp, sea.webp, hanuman.webp, forest.webp, grove.webp, sita.webp, hanuman-kneel.webp, coronation.webp. `voice.py` records chapter MP3 files and word boundaries. The recovered proof configuration is `hi-IN-MadhurNeural`, rate `+0%`; pitch remains the provider default. Voice caching verifies a SHA-256 fingerprint of text, voice and rate before reusing a chapter.

`prepare.py` creates chapter duration targets and caption groups. `align_shots.py` ties picture changes to actual spoken phrases. `score.py` writes narration, instrumental score, effects and mix WAVs; musical slots begin after their chapter narration. `master.py` uses two-pass loudness measurement/normalization to -16 LUFS for this review version. Browser rendering burns text directly into the image with Noto Bold, ivory inactive words, gold active words, a dark backing and upward entrance. SRT remains editable.

## Review limits

The painted and paper sequences use native-generated raster assets with deterministic compositing; they are not full procedural impasto or full 3D paper-book simulations. Some tableaux have environmental movement and camera movement rather than articulated character performances. Shadow rigs use simplified faces, shared construction and limited gesture vocabulary. Bridges, battle action, token transfer and embraces need a richer final animation pass. The workprint resolves narrative coverage and timing; it does not demonstrate all final performances.

The two musical passages are synthesized original instrumentals, not sung songs. The exact Hindi script was compared with returned TTS word-boundary text; this is not an independent speech-recognition or listening audit. Sampled rendered frames and action strips are reviewed separately from technical decode/loudness checks. Do not describe this workprint as a final audiovisual QA pass.

Rendering used the existing remote Lemo setup after local Chromium failed on the environment's Unix socket restriction. No Higgsfield or fal generative image/video/audio jobs were submitted. Native image generation created the new raster assets; fal storage transferred reduced-size preview copies. Hosted rendering/storage billing is not established by these scripts.
