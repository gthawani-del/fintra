# Lemo Motion Studio — Woh Lamhe

Work remains on `feature/lemo-motion-studio`. Fintra main, application routes, dependencies and deployment settings are untouched.

## Current edit

The user's latest instruction is to create the complete video without requesting any more clips. The current production is `final-cut/`: the full original song, the supplied 5-second shore clip, three supplied couple images, and selective kinetic lyric typography.

The film uses official Lemo-Opuscar browser rendering. Revision 2 uses full-frame photographic memories, clean cuts, brief optical dissolves and prominent kinetic phrase typography. The user rejected the earlier decorative wipes and small lyric treatment. Human movement comes from the existing clip. No new videos or unrelated stock people are introduced.

- [Creative direction and limitations](final-cut/TREATMENT.md)
- [Measured final QA](final-cut/QA.json)
- [Pinned renderer and font versions](final-cut/renderer-source.json)
- [Selected lyric highlights](final-cut/lyric-highlights.json)
- [Source-media hashes](plan/supplied-media-2026-11-02.json)

## Reproduce

Install Python 3.11+, Node, FFmpeg and a working Chromium. Check out upstream Lemo commit `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00` and install its Node dependencies. If needed, set `PLAYWRIGHT_CHROME` to the browser executable.

Install the pinned OFL fonts in an ignored local directory:

```sh
cd lemo-motion-studio
npm install --prefix .local-deps @fontsource/dm-sans@5.3.0 @fontsource/cormorant-garamond@5.3.0 @fontsource/bebas-neue@5.3.0
LEMO_ROOT=/path/to/lemo-opuscar bash scripts/build_final.sh /path/to/original-attachments .local-deps/node_modules/@fontsource
```

The build verifies original media hashes and exact upstream renderer blobs, prepares frames and fonts, renders 1080×1920 at 24 fps, and muxes the original recording into `final-cut/out/Woh_Lamhe_LEMO_Motion_Film.mp4`. The song content and timing are preserved; audio is encoded to AAC for MP4 playback.

The output contains selected lyric highlights, not complete subtitles. Actual local speech-recognition passes informed the new timing. Uncertain intro/Hindi-verse text is omitted. Word-level timing has not received human approval.

## Privacy and earlier work

User media and rendered files remain outside public Git history. `final-cut/assets/` and `final-cut/out/` are ignored. The legacy `film/` and `proof/` scenes used rejected stock sources and are not the current edit. Their old GitHub workflows remain parked; use the reproducible build above with private local inputs.

The earlier intake report and its missing-footage requirement are historical and superseded by the user's explicit existing-media instruction. No new footage is required for this edit.
