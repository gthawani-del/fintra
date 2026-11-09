# Hanuman — illustrated Lemo motion proof

10-second 1920×1080, 30 fps airborne crossing rendered through official Lemo `core/render/video.mjs`, upstream `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`, in the user-authorized Higgsfield sandbox. No generative-video model calls.

Native ChatGPT generated the transparent character and scenery plate. Canvas rotates five rigid cutout parts; waves move in separate layers and the shot pulls wide. This is a 2.5D adaptation with baked paper lighting, not the full upstream WebGL lightbox. The limited airborne rig does not include takeoff or landing.

Private inputs: `assets/hanuman.webp`, `assets/background.webp`, `assets/mix.mp3`. The mix is the unchanged 42–52s passage of the approved proof, re-encoded from the retained MP4. Assets stay outside public Git.

To reproduce, supply those assets, install the pinned Lemo runtime and Chromium, set `LEMO_ROOT`, then run `bash build.sh`. The script renders six stills and 300 frames, then muxes the approved sound with FFmpeg. See QA.json and render-log.txt for verification. User aesthetic approval remains pending.
