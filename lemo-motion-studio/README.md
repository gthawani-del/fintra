# Lemo Motion Studio (isolated experiment)

This folder is independent of Fintra. No Fintra runtime dependencies or routes are modified.

## Pipeline
- Official [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) renderer captures the HTML Canvas `render(t)` scene.
- Audio remains the user's original recording; final MP4 is muxed after the visual render.
- `lyrics.json` is currently *not* verified to word-level vocal timing. Do not describe the film as synchronised until alignment QA passes.

## Render on GitHub Actions
1. Configure a GitHub Actions repository secret `WOH_LAMHE_AUDIO_URL` pointing to a short-lived, authenticated downloadable MP3 URL. Avoid committing copyrighted/private audio to this public repository.
2. Run **Actions → Render Woh Lamhe (Lemo) → Run workflow**, on `feature/lemo-motion-studio`.
3. Download the MP4 artifact after successful completion.

Requirements: network access for Lemo source and dependencies, browser rendering and FFmpeg. A run must succeed before the MP4 can be considered generated.

## Files
- `film/index.html`: deterministic Canvas movie with `window.render(t)` and `window.READY`.
- `film/lyrics.json`: approximate cue placeholders. Replace with verified word/phrase timestamps before final output.
- `.github/workflows/lemo-woh-lamhe.yml`: browser cloud renderer.
