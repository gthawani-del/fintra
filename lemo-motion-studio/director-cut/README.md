# Woh Lamhe — director cut

Full-song edit with the supplied couple, generated coastal B-roll and complete phrase typography. The user explicitly requested the full music video with text effects after approving and receiving the four B-roll sources.

## Current implementation

- 29 contiguous shots, 133.24-second master, 1080x1920 at 24fps.
- All 34 nonempty lines of the existing repository lyric draft are retained. They are not a verified canonical transcript. ASR-informed phrase boundaries replace the old drifting timings. Uncertain wording remains explicitly flagged in `lyrics-full-draft.json` and `lyric-review.json`; this is a review cut pending lyric correction.
- Complete sentence-case serif lines stay at readable size. Verses use line masks with slight stagger; chorus phrases settle their tracking and scale; exits are short. The original condensed display font is removed.
- Warm surf, floral-fabric details and empty shore alternate with the recurring couple. The weak footprints source appears only briefly under water. Four short dissolves mark memory changes; other edits are direct cuts.
- Native official Lemo browser rendering. A bounded frame cache decodes only the current moving frame, avoiding loading all generated footage into each browser worker.
- Original song is preserved in timing and content, encoded to AAC at zero offset. No generated audio, additional paid attempts, new faces or new imagery.

## Reproduce

First prepare original media/fonts using `scripts/prepare_final_cut.py` as described in the project README. Extract the delivered B-roll source ZIP to a private folder with B01.mp4 through B04.mp4. Then:

`LEMO_ROOT=/path/to/lemo-opuscar bash scripts/build_director.sh /path/to/broll`

Use the pinned upstream commit in `../final-cut/renderer-source.json`. Set `PLAYWRIGHT_CHROME` when needed. User media and extracted frames must not enter Git history.

## QA limits

Successful decode and sampled frame inspection do not prove full-speed human review or exact lyric transcription. See `QA.json` for measured export results. No claim of canonical lyrics, perfect vocal alignment, exact wardrobe fidelity in generated fabric, or universally professional quality is made.
