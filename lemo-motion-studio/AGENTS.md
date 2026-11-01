# Lemo Motion Studio: OpenAI / Codex directing contract

## Architecture

The upstream [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) library is an agent-authored film toolkit, **not a Claude-only renderer**. Its official runtime is Node.js, HTML Canvas / WebGL, headless Chromium and FFmpeg. Run the official `core/render/video.mjs`; do not substitute a Python/Pillow text-slideshow pipeline. Do not claim a video was rendered if a browser render didn't succeed.

This file adapts the **directing workflow**, not the rendering engine, for OpenAI assistants and Codex. No Claude plugin, Claude API, or local computer is required.

## Read in order
1. This document and the request / uploaded assets.
2. Upstream `AGENTS.md`, `DIRECTOR.md`, `TECHNIQUE.md`, `core/README.md`.
3. Project-specific `styles/beach-memory/STYLE.md`.
4. Project `film/TREATMENT.md`; only then look at upstream demos, for techniques and not for copying.

## Mandatory production phases
1. **Audit source**: duration, correct original audio, complete lyric transcript, actual timecodes. Preserve original recording; separate assets from the public Git repo.
2. **Storyboard**: recurring identifiable fictional couple with consistent clothes, setting, sunlight, and camera continuity; plan distinct emotional beats.
3. **Asset manifest and proof**: verify each background/character is a valid image/video, that it has the intended people visible and licenses/permissions, and render a contact sheet **from the actual browser scene**. Download size is not proof of image visibility.
4. **Motion tests**: test at least three different scenes (first verse, chorus, break) at 24 fps with real footage/animation. For expressive character actions use video or an actual character rig; do not present static photographs with Ken Burns pan/zoom as a walking couple.
5. **Typography tests**: varied, readable word-level reveal, masked wipes, tracking changes, scale transitions, lyrics following paths when appropriate. These must be visually demonstrable in frames; simple fades do not qualify.
6. **Lyric alignment**: verify Hindi + English vocal onset / offsets against the original MP3. A file with `timingStatus: draft-not-vocal-verified` must never be approved as synced.
7. **User review gate**: deliver a 15-second **real rendered** section and a 6-frame contact sheet showing the couple and kinetic type. Do not export 133s until visual/lyric tests pass.
8. **Full render**: official `node core/render/video.mjs` in GitHub Actions. FFmpeg only to mux the unchanged song, make an iPhone-compatible MP4 and package a ZIP.
9. **Final quality gate**: check faces present, images visible, typography motion, camera variety, cuts, sync, no blank frames, original audio presence and duration. Record verification and known limitations explicitly.

## Failure learnings (Woh Lamhe V1-V4)
- Repeated dark stock scenes with different people are not a continuous love story.
- Six stock photographs stretched across 133 seconds create a static slideshow, not a cinematic video.
- Heavy navy overlays hid subjects, leaving only faint shoreline detail.
- Showing whole phrases with alpha fades is not kinetic typography.
- Approximated subtitle cues drift, especially code-switched Hindi/English.
- Successful codec/frame rendering is necessary but **not** creative QA.

## Stop conditions (do not label final)
- Actual images/people aren't visible on the target-size frame.
- Assets represent inconsistent couples when the story calls for one couple.
- Only scale/pan/photo movement is present but scenes call for human gestures.
- Lyrics do not demonstrably align with the singer.
- The proposed 15-second proof isn't materially better than the rejected version.
- A tool isn't available to create the specified visual behaviour. State the limitation rather than faking a substitute.

## Git & privacy
- Work only on `feature/lemo-motion-studio` unless the user approves another branch.
- Keep original song MP3 outside public Git history.
- Do not publish the user's uploaded photos or third-party image files into a public repository without explicit permission; secure asset distribution is required.
- Keep `main`, Fintra routes, dependencies, deployment settings and business logic untouched.

## Output contract
Report: exact upstream Lemo commit; exact repo branch + commit; real rendering logs; actual asset provenance; creative QA findings; subtitle timing confidence; and an independently verifiable MP4/ZIP. Never claim a file is downloadable without verifying the file itself. 
