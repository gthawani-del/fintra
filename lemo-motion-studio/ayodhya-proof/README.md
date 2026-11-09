# Ayodhya — illustrated Lemo segment

17-second, 1920×1080, 30 fps oil-painted scene. Official Lemo renderer at `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`, executed in the user-authorized Higgsfield sandbox. No generative-video model calls.

The approved painting was separated using native ChatGPT image generation into a transparent Rama cutout and clean city plate. Canvas animates river ripples, flags, loose cloth and a restrained head inclination. The camera eases continuously from the city view toward Rama over 6.6–8.6 seconds; there is no hard framing change at 7.6 seconds. This is a 2.5D illustrated adaptation, with stable painting textures, not full character acting or 3D.

Private inputs: `assets/rama.webp`, `assets/background.webp`, `assets/audio.m4a`. Audio is the first 17 seconds of the original approved Ramayana proof, with the voice and score retained. Media assets stay out of Git.

Set `LEMO_ROOT` to the pinned Lemo checkout, ensure Chromium and runtime dependencies are installed, then run `bash build.sh`. Install Noto Sans Devanagari Bold and run `bash render-text.sh` to add captions. The latter uses FFmpeg/libass with complex-script shaping; AAC audio is stream-copied.

Typography matches the accepted Hanuman revision: complete phrases, weight 700, gold active word, ivory remaining text, dark translucent lower-third. Word boundaries are estimated by faster-whisper small, with original narration starts used to correct boundary overlap. The opening word begins at 1.18 seconds, based on spectral inspection of the first clear speech onset; ASR opening estimates were inconsistent. No claim of human-certified phoneme alignment. The captions preserve the approved script verbatim; source is in narration.json and caption-timing.json.

This is the Ayodhya segment for the planned three-style proof. Shadow theatre and final assembly remain separate work. See QA.json and render-log.txt for completed checks.
