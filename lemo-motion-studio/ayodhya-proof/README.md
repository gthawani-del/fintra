# Ayodhya illustrated Lemo segment

Status: artwork and scene code prepared; browser render and visual QA pending. No completed Ayodhya video yet. The user approved generating this segment. Automatic approval review separately blocked its new asset transfer to the external render host. Do not report a finished render.

17 seconds, 1920×1080, 30 fps. Two compositions, localized river ripples, small flag movement, independent loose fabric and restrained head inclination. This is an illustrated 2.5D adaptation with stable native-generated oil textures, not a simulation of freshly painted strokes or full character performance.

Inputs are private and excluded from Git: `assets/rama.webp`, `assets/background.webp`, `assets/audio.m4a`. The native ChatGPT image tool extracted the character and clean plate from the approved Rama/Ayodhya painting. The audio is the first 17 seconds of the approved Ramayana proof, stream-copied without voice regeneration.

Set `LEMO_ROOT` to upstream Lemo at `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`, install its dependencies and Chromium, and run `bash build.sh`. The script uses official `core/render/still.mjs` and `video.mjs`, then muxes the original audio.

Before delivery: inspect actual character cutout alignment, neck seam, cloth edges, water mask boundaries, flags and headroom. Then align narration words and apply the approved Hanuman `kinetic-highlight.ass` visual treatment: Noto Sans Devanagari Bold 700, complete phrases, gold active word, ivory others, a dark translucent lower-third panel. Word timing for this segment is not yet verified; do not reuse Hanuman timings. Export and verify the final text-bearing video only after those checks.

JavaScript syntax check passed. The two original narration lines and their phrase-level timing are in narration.json; only the entries before 17 seconds belong in this segment.
