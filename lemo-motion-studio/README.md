# Lemo Motion Studio — Woh Lamhe

The current full-song revision is `director-cut/`: original song, recurring supplied couple, three selected generated B-roll sources, and complete draft lyric text with word entrance effects. Work stays on `feature/lemo-motion-studio`; Fintra application code and main are untouched.

- [Director cut and reproduction](director-cut/README.md)
- [Export QA](director-cut/QA.json)
- [Shot timeline](director-cut/timeline.json)
- [Complete draft lyrics and confidence](director-cut/lyrics-full-draft.json)
- [B-roll generation records and sampled review](director-cut/broll-jobs.json)
- [Original media hashes](plan/supplied-media-2026-11-02.json)
- [Pinned official Lemo renderer](final-cut/renderer-source.json)

The current video retains all 34 nonempty lines from the existing repository draft. It is a complete visual review cut, **not a verified canonical lyric transcription**. Uncertain wording and ASR-informed timing are explicitly retained as review limitations.

## Reproduce

Use Python 3, Node, FFmpeg and Chromium with the official Lemo-Opuscar commit `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`. Set `PLAYWRIGHT_CHROME` if needed. Install the pinned local Fontsource packages:

```sh
npm install --prefix .local-deps @fontsource/dm-sans@5.3.0 @fontsource/cormorant-garamond@5.3.0 @fontsource/bebas-neue@5.3.0
python3 scripts/prepare_final_cut.py /path/to/original-attachments .local-deps/node_modules/@fontsource
LEMO_ROOT=/path/to/lemo-opuscar bash scripts/build_director.sh /path/to/extracted-broll
```

The private B-roll folder must contain B01.mp4, B02.mp4, B03.mp4 and B04.mp4 from the delivered source ZIP. Source and renderer hashes are checked. Output: `director-cut/out/Woh_Lamhe_Director_Cut.mp4`.

## Privacy and earlier versions

Do not commit original audio, user images, generated source videos, extracted frames or rendered outputs. `film/`, `proof/` and `final-cut/` are historical versions; `final-cut/assets/` remains an ignored shared preparation folder. The old Actions workflows are parked and do not render the current cut. No additional paid generation is part of the build.
