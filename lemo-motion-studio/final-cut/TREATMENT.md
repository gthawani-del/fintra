# Woh Lamhe — existing-media motion film

## Current direction

The user explicitly instructed: "Create this without any more videos. Our objective is for you to create the video."

This supersedes the earlier requirement to obtain two additional clips and to stop before full production. Use the supplied original song, one existing moving clip and three still images only. Complete a full-length stylized motion film with internal proof/QA. No further generation or extra user approval is required for this scope.

## Chosen form

Three approaches considered: repeat the moving shot continuously; make a photographic slideshow; create an editorial memory film with moving footage, photographic tableaux, split compositions and kinetic lyric highlights. The third is selected to give the available material deliberate variation without pretending still photographs are live human performances.

The couple remains the same throughout. Warm togetherness becomes fractured memory, then briefly returns during the final refrain. A repeated shore clip is a deliberate visual memory refrain, used in three separate sections at normal speed. Still scenes use crops, camera movement, framed memories, reflection distortion and changing compositions. No new faces, backgrounds, footage or voice are generated.

## Design and timing

- 9:16, 1080×1920, 24 fps; full original song.
- The full timestamped shot list is `shots` in `index.html`.
- Original video excerpts: 0–5, 52.6–57.6 and 107.3–112.3 seconds on the song clock.
- Warm cream, amber and slate; grades preserve visible faces and clothing.
- Wave masks, staggered vertical reveals, iris transitions and split compositions vary the cuts.
- Cormorant Garamond for the title and lyrical phrases, DM Sans for longer phrases, Bebas Neue for chorus emphasis. All are actual local font files loaded before rendering.
- Type remains in upper negative space; subjects occupy the middle/lower frame.
- Word masks, tracking contraction and vertical reveal are computed from absolute song time.
- `audio-motion.json` holds a measured 50 ms RMS envelope and positive envelope changes. These modulate restrained optical accents; they are not a beat grid or lyric timing source.

## Text policy and limits

The only visible copy is the song title plus the strings in `lyric-highlights.json`. These are selected highlights, not a complete subtitle transcript. Local faster-whisper base/small passes were run against the actual recording; matching English phrases and clear Hindi chorus words were selected. The old draft cues were not treated as verified.

Several ASR passages, especially the intro and Hindi verses, were unreliable. Those passages intentionally remain visual-only. Raw hallucinated ASR output is never displayed. Word timings are machine-derived, not human-approved; a perfect word-level sync claim would be inaccurate. The output is a complete motion film with selective lyric typography.

## Rendering

Official upstream `core/render/video.mjs`, `page.mjs`, `serve.mjs`, `browser.mjs` and `still.mjs` from Lemo commit `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00` were retrieved and verified against their Git blob hashes. No rendering logic was substituted. `PLAYWRIGHT_CHROME` selects a working Chromium executable. FFmpeg prepares source frames, encodes and muxes the original recording.

The proof covers song time 52.4–67.4 s. Internal visual checks include actual rendered frames, a 0.2-second motion strip, subject visibility, type placement and source continuity. See `QA.json` for measured final results and limitations.

## Assets and credits

- Song, moving clip and three images: supplied by the user in this conversation, with hashes in `../plan/supplied-media-2026-11-02.json`.
- Source video: 512×910; stills: 864×1536. The 1080×1920 export upscales those sources; it does not add native source detail.
- Fonts: @fontsource packages for DM Sans, Cormorant Garamond and Bebas Neue; SIL Open Font License. License files are retained alongside locally prepared font assets.
- Lemo-Opuscar: https://github.com/lemomo-ai/lemo-opuscar — MIT.
- No stock media, new generated videos, or paid generation/API calls.
- Original user media and output MP4 files remain outside public Git history.
