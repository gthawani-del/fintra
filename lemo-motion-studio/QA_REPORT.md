# Rejected Woh Lamhe beach render: source audit

Input: `Woh_Lamhe_Beach_Story_LEMO(1).mp4` supplied by the user. Approx. 133.22s; H.264 512×910, AAC audio.

## Findings
1. Background photographs are technically present but largely obscured by dark grade, blur/scale and framing. The claimed *recurring couple* is not visually established.
2. The GitHub workflow downloaded six Unsplash stock photographs, **not the three beach-couple images generated in the chat**. No character consistency was implemented.
3. Scene source repeats six images across 27 shot slots and simulates movement using digital pan/zoom and crossfades. It does not animate the people.
4. Lyric animation is simple opacity + vertical offset, centred in similar positions, with no genuine masked kinetics or impactful chorus choreography.
5. `lyrics.json` is marked `draft-not-vocal-verified`. The project did not implement a verified multilingual alignment pass.
6. CI passing checks only Chromium capture, FFmpeg output and basic download-size heuristics. It does **not** verify subject visibility, story, word sync or motion complexity.

## Decision
Reject this render as a final creative deliverable. Changing model prompts alone will not fix the output. The upstream browser renderer is model-independent, but the upstream Claude-oriented agent instructions need a project-specific OpenAI/Codex directing adapter (`AGENTS.md`). Correct asset handling, actual moving shots, typography choreography, and visual/audio QA are mandatory before another 133s export.
