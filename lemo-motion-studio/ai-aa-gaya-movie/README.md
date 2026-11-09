# ए आई आ गया। अब हमारा क्या?

A 333.356-second illustrated Hindi film for eliv8lyf. Canvas drawings and timed acting are rendered through Lemo Opuscar's official Chromium/FFmpeg renderer at 1920×1080, 24 fps. No generated image assets, stock film, paid media APIs, or music samples.

## Reproduce

Dependencies: Node + Playwright supported by Lemo, FFmpeg, Python with `edge-tts==7.3.1`, numpy and soundfile. Supply Noto Sans Devanagari Regular/Bold in `fonts/`, the authorized brand image as `assets/logo.jpeg`, and the approved audition MP3. These binaries are deliberately excluded from Git.

1. Create `voices/` and `out/`.
2. `python make_voice.py /absolute/path/AI_Aa_Gaya_Hindi_Voice_V2.mp3` (requires network for free Edge voice service; first four cues reuse approved audio).
3. `python mix_audio.py` generates original score, ducked stereo mix and Hindi SRT.
4. `ffmpeg -y -i out/mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 48000 out/master.wav`
5. Set `PLAYWRIGHT_CHROME` to a working Chromium executable. From the Lemo checkout run `node core/render/video.mjs /absolute/path/to/ai-aa-gaya-movie --fps 24 --workers 3 --out /absolute/path/to/out/picture.mp4`.
6. `ffmpeg -y -i out/picture.mp4 -i out/master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest out/AI_Aa_Gaya_Full_Movie.mp4`

The treatment was adapted from sibling `ai-aa-gaya-v2/SCREENPLAY.md`; `script.json` is the authoritative production dialogue used by the voice builder. `timeline.json` is measured from the audio, not estimated reading speed. `mouth.json` contains speech amplitude, not phonemes. Animation includes blinks, small head/arm gestures, steam, document state changes and camera reframing. This is a code-illustrated motion film; character animation is intentionally limited.

## Audio

Hindi Madhur and Swara voices; Meera at -5% rate. The approved opening is reused. These voices come from the free online Edge service via an open-source client, not an offline OSS speech model. Availability may change. Score is deterministically synthesized from sine harmonics, with scene-dependent density, smooth dialogue ducking, deliberate pauses and a final fade.

## Rights and credits

Original drawing/code and synthesized score. Noto Sans Devanagari uses the SIL Open Font License (retain license with redistributed font binaries). Brand artwork supplied by the user. Lemo rendering workflow: `lemomo-ai/lemo-opuscar`, production checkout `143f387ad774525dc9abc0ff05fb5f4bfbaa5f02`. No celebrity voice imitation. No paid generation credits used.
