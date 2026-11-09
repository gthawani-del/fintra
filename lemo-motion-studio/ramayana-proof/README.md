# Ramayana — three-style narrated proof

54-second Hindi proof, 1280×720, 24 fps. Three selected moments, not a continuous or complete Ramayana retelling.

- 0–17s: Ayodhya — Lemo palette-knife impasto engine, custom painted architecture and separately articulated Rama/cloth.
- 17–35s: Kaikeyi and Dasharatha — original Indian adaptation of transmitted-light shadow theatre, jointed gestures and reaction framing.
- 35–54s: Hanuman crossing — custom 2.5D layered paper, cast shadows, crouch/leap/follow-through and parallax waves. This is Canvas layer staging, not a full volumetric Three.js scene.

## Build

Use the official Lemo-Opuscar checkout at `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`, Node 22+, Chromium and FFmpeg, Python with numpy, scipy and edge-tts, and system fonts-noto-core.

```bash
LEMO_ROOT=/path/to/lemo-opuscar bash lemo-motion-studio/ramayana-proof/build.sh
```

The isolated workflow `.github/workflows/ramayana-proof.yml` installs these dependencies and renders only this project. It does not deploy or alter the Fintra application.

Narration uses hi-IN-MadhurNeural and is generated if missing; the original paraphrased script is in `voice.py`. `audio.py` places the generated clips, writes cues/subtitles and synthesizes an original score and sound effects. Generated media is ignored by Git.

Source assets and their provenance are in CREDITS. No paid image/video-generation API calls were made for this proof. No assertion of human voice review or historical costume reconstruction is implied.

## Limitations

This is deliberately stylised illustration and puppet performance. The long-form film still needs review of character design, emotional performance and Hindi pronunciation. Automated transcription is an approximate content check and contains spelling errors; it is not a pronunciation certificate. The narration is original paraphrase, not a Sanskrit quotation.
