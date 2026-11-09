# State of AI in 2027

40-second vertical 3D outlook, original WebGL geometry rendered with official Lemo, English narration and an original procedural electronic score. Editorial forecasts are identified as an outlook based on evidence available 9 November 2026. See FACTS.md for sources and inference boundaries.

## Reproduce

Requirements: Python 3 with numpy, scipy and edge-tts; Node 20+; FFmpeg; a working Chromium/headless-shell; Open Sans system fonts. Clone lemomo-ai/lemo-opuscar at `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00` and run `npm install` there. Set `LEMO_ROOT` to that checkout, and `PLAYWRIGHT_CHROME` to your browser binary. For software WebGL, set `LEMO_ANGLE=swiftshader`.

Run `bash build.sh`. Output: `out/State_of_AI_2027_Lemo_3D.mp4`. Voice synthesis requires network access to Microsoft's voice service; generated voice clips are cached locally. Review current provider terms for your intended use.

Assets and rendered files are excluded from git. Source footage and photographs are not used. Fintra application code is untouched. Font packages and audio dependencies are separate from Fintra's application dependencies.

## Design

Six scenes: a physical intelligence core, a layered agent workflow, multimodal sensor rings, a miniature simulated environment, an oversight shield, and the assembled core. Camera orbit, perspective, mesh motion, material highlights and text reveal are rendered frame by frame. No stock footage or generated video.

See TREATMENT.md, CREDITS, narration.json, and State_of_AI_2027.srt. The optional SRT is a narration transcript; on-screen headings summarize rather than duplicate speech.
