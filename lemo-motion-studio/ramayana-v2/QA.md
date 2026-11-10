# QA — rebuilt Ramayana

## Scope
12 chapters, 74 shots, 623.064 seconds. Hindi narration and original instrumental
score/Foley retained. No newly generated singing, no generative video calls.

## Pre-render fixes and inspection
- Inspected chapter and action samples in the real browser renderer.
- Replaced presentation-like frames with paint, glass and layered paper scenes.
- Corrected Vishwamitra/Maricha casting in training and plotting passages.
- Lowered boat passengers onto the deck, grounded bridge workers and Hanuman.
- Embraces now make contact; duel includes bow draw, string and arrow release.
- Lakshmana rests horizontally; Pushpaka has a canopy and vessel.
- All 189 caption phrase intervals checked: zero overlaps after correction.

## Limitations
Stylised puppet acting and some simplified creature/prop shapes remain.
Material appearance varies deliberately between original painted portraits,
cutouts and procedural scenery. This is an illustrated abridgement, not a
complete adaptation of every Ramayana episode. Music interludes are instrumental.
Frame inspection and technical checks do not constitute a full listening review.

## Final encode
All three picture batches rendered successfully at 1280×720, 24 fps:
- Chapters 1–4: 4,731 frames; all 22 shot samples inspected; full decode passed.
- Chapters 5–8: 5,518 frames.
- Chapters 9–12: 4,704 frames.
Combined picture: 14,953 frames, approximately 623.042 seconds. The picture
was assembled and encoded, but its provider upload was subsequently flagged
NSFW; download returned HTTP 403. No reason was provided beyond that status.
No attempt was made to bypass the moderation block.

Consequently, full-file visual QA, full-file decode/black-frame checks and final
approved-audio mux were NOT completed. Do not present this as a delivered final
movie or a fully QA-passed film. Original audio remains unchanged locally;
its AAC packet SHA-256 is
30d48988512f4fa8f1e4aa05b7593c4324fee1c2d8e991c74186fa0e2f4b2b61.
The build script allows reproduction once delivery access is resolved.
