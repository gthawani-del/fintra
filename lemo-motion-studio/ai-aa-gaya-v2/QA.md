# Motion proof QA — 2026-11-09
Completed actual Lemo render: 720 frames, 30 seconds, 1280×720, 24 fps; H.264 video/AAC audio; MP4 faststart. Three software-WebGL workers; 512 seconds rendering. Exact renderer commit 143f387ad774525dc9abc0ff05fb5f4bfbaa5f02; vendored paper source bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00.

Approved audition reused: first three speakers, 27.728 seconds of source plus a 1-second lead-in; no voice regeneration. Speech camera windows follow cue metadata. Original plucked music at 88 BPM, smoothly ducked; paper rustles at shot boundaries. Master measured -16.3 LUFS, 5.1 LU range, -1.5 dB true peak.

Inspected actual 3s, 12s and 24s browser frames, plus six frames from the encoded MP4. All characters and subtitles visible. Full decode succeeded. Blackdetect (0.2s/0.10 threshold) found no intervals. Source diff check passed.

Limits: puppet mouth uses speech amplitude, not phonemes; sentence captions use editorial timing rather than forced alignment. Full-speed perceptual playback with sound has not been verified by an independent reviewer. This is a motion/BGM proof, not the long-form final. No paid service calls.
