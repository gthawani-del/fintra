# AI Aa Gaya. Ab Hamara Kya?

A 50.5-second opening proof for a planned 5:30 Hindi family film. This is a creative review cut, not an approved full film.

- SCREENPLAY.md: complete Hindi screenplay, provisional timing, fictional quotation arithmetic.
- TREATMENT.md: story, palette, style adaptation, scene/tool rationale and sound plan.
- index.html / film.js: original deterministic Canvas character rig, room, paper tableaux, menu scene, subtitles.
- timeline.json / envelopes.json: actual local TTS segment timings and audio-driven mouth-open envelopes. This is amplitude-driven limited animation, not phoneme-accurate lip sync.
- voice.py / audio.py: local OSS speech and original synthesized sound.
- qa/: render log, machine transcript and explicit QA limitations.

## Rebuild
Install Python dependencies from requirements.txt into a private virtual environment. Install Lemo runtime dependencies for the pinned upstream commit bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00. Set PLAYWRIGHT_CHROME if needed. Download Kokoro model-files-v1.0 (kokoro-v1.0.onnx and voices-v1.0.bin), naming them kokoro.onnx and voices.bin in MODEL_DIR. Linux Noto Devanagari and DejaVu font paths are in build.sh.

```
LEMO_ROOT=/path/to/lemo-opuscar MODEL_DIR=/path/to/models PYTHON_BIN=/path/to/venv/bin/python bash build.sh
```

Rendering uses the upstream core/render/video.mjs without modification. No paid API keys or calls. Media and fonts remain ignored rather than committed to the repository.

## Review before full production
Hindi diction is not certified: ASR is approximate and several consonants/English loanwords are imperfect. The voices are an audition. Hand/eye/head gestures are real rigs but remain intentionally limited; this is not full character animation. The paper sequences are 2.5D-style layer transforms, not full 3D pop-up engineering. Full-speed human listening/viewing remains necessary. Do not expand to the full film before the opening's style and voices are accepted.
