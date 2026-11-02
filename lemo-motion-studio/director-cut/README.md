# Woh Lamhe — director recut, revision 4

A complete 133.24-second visual review cut using the original song. This revision answers the request for B-roll to carry the film instead of appearing as occasional inserts.

## Edit

- 48 contiguous shots; 106.81 seconds (80.16%) of moving-source timeline coverage, including 95.4 seconds of B-roll trims. These totals include reuse, not unique generated footage.
- Three selected B-roll sources (surf, fabric, empty shore), one supplied couple video and three still photographs. The generated footprint clip is excluded because its impressions looked artificial.
- Couple stills last 1.24–2.9 seconds. Wide and tighter framings distinguish memories without claiming animated human performance.
- Shared memories lead into absence; the second verse is less saturated; the couple returns briefly at the ending before the empty shore.
- Cuts follow existing phrase boundaries where available. Two brief dissolves mark larger changes. Instrumental editing becomes faster before the last refrain.
- All 34 nonempty repository draft lyric lines remain. Word masks cascade over the first 0.41 seconds or less; chorus words also settle in scale. This entrance choreography is not word-level vocal alignment.
- Cormorant Garamond, sentence case, cream, maximum two lines, upper image negative space. No generated text baked into footage.

## Reproduce

Prepare private media/fonts with `scripts/prepare_final_cut.py`, then run:

`LEMO_ROOT=/path/to/lemo-opuscar bash scripts/build_director.sh /path/to/broll`

Pinned official Lemo commit: `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`. Output: `director-cut/out/Woh_Lamhe_Director_Cut.mp4`. Keep all media outside Git history. No additional paid operations.

## Review limits

This is an editorial improvement using limited existing coverage, not newly filmed character performances. Source shots recur. Lyrics and ASR-informed phrase times still require confirmation. Sampled rendered frames and technical checks cannot establish full-speed audio/visual review or canonical lyric accuracy. See `QA.json` for actual evidence.
