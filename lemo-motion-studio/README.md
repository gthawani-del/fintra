# Lemo Motion Studio (OpenAI-agent compatible experiment)

Location: `gthawani-del/fintra`, separate branch `feature/lemo-motion-studio`. This project is isolated from the Fintra application.

## Status

**Official Lemo renderer:** verified in GitHub Actions on earlier test and full picture runs. **Beach music video:** latest uploaded V4 was rejected by the user; do not reuse its stock-photo treatment or claim it has passed creative QA. **Audio word alignment:** unverified. **OpenAI adaptation:** project-level instructions now in `AGENTS.md` plus `.agents/skills/beach-motion-film/SKILL.md`; the upstream browser renderer needs no code conversion.

## Core tools

- Upstream [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar): headless Chromium, Canvas/WebGL, Node.js, official `core/render/video.mjs`
- FFmpeg: mux original audio, encode H.264/AAC, export ZIP
- An external real-video or image-to-video stage is necessary for credible human movement; Lemo itself animates image layers and typography, not lifelike people from still photos.

## Next stage and gate

1. Obtain a consistent couple and a set of short **moving** clips with explicit rights; images can be identity references or memory inserts.
2. Extract and validate bilingual lyric word timings; do not reuse `film/lyrics.json` as approved timings.
3. Implement the `styles/beach-memory/STYLE.md` composition system and real kinetic typography.
4. Prove first 15 seconds on the **official** Lemo renderer, with a contact sheet and picture/audio QA.
5. Only after tests pass, render 133 seconds and mux the attached MP3.

## Privacy and licensing

User MP3 is not committed to the public repository. Do not silently publish generated characters, licensed footage or user uploads. Store assets in an approved private bucket and fetch for build with scoped credentials. The prior film used licensed stock Unsplash images but did not preserve the recurring characters, so the creative has to be replaced.

## Supplied media — 2 November 2026

The latest intake contains the original 133.272-second MP3, three consistent couple stills and one 5.041667-second moving clip. See [the intake report](plan/ASSET_INTAKE_2026-11-02.md) and [source manifest](plan/supplied-media-2026-11-02.json). `scripts/prepare_media.py` verifies source hashes and prepares frames without publishing media or pretending to render a movie.

The two old render workflows are now manual readiness gates: they no longer download unrelated stock people or launch full renders on push. The existing `film/` and `proof/` scenes are legacy rejected sources, not the new production. Two further moving shots and confirmed lyrics are needed for the planned opening proof. **No new Lemo video was rendered during this intake.**

