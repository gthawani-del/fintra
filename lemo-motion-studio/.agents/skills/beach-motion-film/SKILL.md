---
name: beach-motion-film
description: Direct and render cinematic music videos with a recurring couple, image/video assets and kinetic multilingual lyrics using the official Lemo-Opuscar browser renderer. OpenAI/Codex compatible project workflow.
---

# OpenAI / Codex skill for the Lemo Motion Studio experiment

Read `../../AGENTS.md` and `../../styles/beach-memory/STYLE.md` relative to the `lemo-motion-studio/` directory. Read the upstream Lemo `AGENTS.md`, `DIRECTOR.md` and `TECHNIQUE.md` as references. Do not rely on the Claude plugin installer or Claude-specific user-question interfaces.

**Do not regenerate the full song from the rejected static photo montage.** Begin with an asset manifest of the same fictional couple, describe a shot treatment, and output a browser-rendered 15-second proof that visibly has people, motion, kinetic type, and verified audio alignment. Only then render the full film.

Requirements:
- Official Lemo `core/render/video.mjs`, deterministic `window.render(t)`.
- Human motion must come from suitable video or actual animation, never pretend an image pan is someone walking.
- Use the uploaded original song unmodified during final muxing.
- Check every external image or clip's provenance and presence; block rendering on missing/wrong assets.
- Voice-aligned bilingual words and chorus hits are mandatory. Draft timecodes fail the quality gate.
- Create a contact sheet and inspect text legibility plus couple continuity.
- Keep source, renders and third-party assets out of Fintra production runtime; leave GitHub `main` untouched.
- Never claim success from GitHub Actions alone; visual QA and full-speed audio viewing required.

Status: skill scaffold for OpenAI-style agents, NOT proof of a completed new video.
