# V2 QA — frame/voice gate
Actual Lemo official still renderer succeeded at 1920×1080. Three.js runs in software WebGL; frames approximately 1.7 seconds each. Two lighting/geometry corrections made after inspected frames. Textures are original code-drawn canvases, no image generators. Base/custom comparison uses identical scene/camera and shared Hindi-capable font; palette is the visible difference.

Voice: generated four Hindi samples, male/female neural voices. Software phrase simplified after initial ASR mismatch. Faster Whisper small provides a rough transcript only; its Hindi spellings contain errors, so no perceptual approval inferred. User listening remains pending. Music intentionally absent in audition.

Not tested or claimed: complete 5–6-minute film, final dialogue timeline, full-speed motion, lip-sync, physical prop interactions, finished title/brand card. Current main.js has provisional 28s camera/gesture choreography only; no finished demo MP4 yet. This is the custom frame review required by MY-STYLES.md, not the final video.
