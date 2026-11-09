# AI Is Here. What About Us? — English edition

The same ten-chapter illustrated family film, adapted into English. All 34 spoken cues, visible labels and captions are English. The Indian setting, characters, rupee calculations, story and musical palette are retained. Timing is regenerated from the English recordings; it is not a dub stretched onto the Hindi timeline.

The end card composites the exact user-supplied logo onto white. A render-time luminance matte suppresses the pale JPEG rectangle; the supplied file is not modified or committed.

## Build

Dependencies: Node + Lemo's Playwright renderer, FFmpeg, Python (`edge-tts`, numpy, soundfile). For optional speech checking install faster-whisper and socksio. Set `LEMO_ROOT` to the upstream checkout, `PLAYWRIGHT_CHROME` to a working Chrome executable, and `PYTHON` to your virtualenv interpreter; run `bash build.sh`.

Place the user-authorized logo at `assets/logo.jpeg`, and DejaVuSans.ttf / DejaVuSans-Bold.ttf in `fonts/`. Binaries, voice caches and renders are intentionally ignored by Git. The runtime uses only the two DejaVu files; no font download occurs during rendering.

Source of truth: script.json → English speech + timeline.json → Canvas/Lemo animation + word captions + synthesized score → FFmpeg master. Voice models: en-IN-NeerjaNeural and en-IN-PrabhatNeural. Meera and Rajiv speak at -5%; Tara and narrator at normal speed. These are free online service voices accessed through the open-source edge-tts client, not an offline speech model.

Animation is the same limited illustrated style as the Hindi edition, with blinks, small gestures and amplitude-driven mouths. No phoneme lip-sync claim. CREDITS lists asset provenance. QA.json records actual checks and limitations.
