# Ramayana — rebuilt full cut

623.064-second abridged Hindi retelling through coronation, 12 chapters and 74 shots.
The approved narration, instrumental score and Foley remain unchanged. The two
music interludes are instrumental, not sung songs.

## Rendering

Use the official Lemo renderer (tested at bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00).
Supply the private assets and fonts from the original Ramayana project in
`assets/` and `fonts/`; these are intentionally excluded from Git. Supply its
approved `master.m4a` separately. Engine files retain their upstream MIT license.

Set `LEMO_RUNTIME` to the runtime checkout and `APPROVED_AUDIO` to master.m4a,
then run `bash build.sh`. Output is 1280×720 at 24 fps. Query parameters
`?chapter=1..12` and `?batch=1..3` support isolated inspection/rendering.

## Implementation

Native Impasto and stained-glass engines create cached material plates. Custom
Canvas paper layers supply forest and ocean depth. Articulated ornate puppets
supply gestures; painterly portraits and cutouts remain in selected scenes.
This is a mixed-material illustrated film, not fully articulated feature animation.
See TREATMENT.md and QA.md for scope and verification limits.
