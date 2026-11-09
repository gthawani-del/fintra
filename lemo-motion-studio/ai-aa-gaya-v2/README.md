# AI Aa Gaya V2 — motion proof
30-second Hindi paper-theatre clip with original background music, paper foley, speaker camera cuts, speech-amplitude puppet mouths and burned-in Hindi captions. This is the approved frame's motion proof, not the full 5–6-minute film.

Run `PYTHON=/path/to/python bash build_clip.sh /path/to/lemo-opuscar /path/to/approved-audition.mp3`. Set PLAYWRIGHT_CHROME to a working Chrome headless shell. Python dependencies: numpy, soundfile; Node dependencies installed in upstream; FFmpeg required. Original user-approved voice is supplied separately and not in Git.

Style remains project-local pending motion review. Full story: SCREENPLAY.md and TREATMENT.md. Demo: style/DEMO.md. Renderer pinned at 143f387ad774525dc9abc0ff05fb5f4bfbaa5f02; vendored helpers retain bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00. Known limits: amplitude mouth motion is not phoneme lip-sync; captions are phrase-timed. No paid generation calls.
