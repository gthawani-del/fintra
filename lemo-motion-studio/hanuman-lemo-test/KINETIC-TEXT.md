# Kinetic Hindi text pass

Input: accepted 10-second Hanuman Lemo motion proof. Output: 1920×1080, 30 fps H.264 with original AAC stream copied unchanged.

Typeface: Noto Serif Devanagari Bold. Registry: हनुमान ने / छलाँग / लगाई। / सामने / अथाह / सागर / था। / मन में केवल / एक / संकल्प. No additional copy.

Motion: upward move and scale settle for छलाँग; separate horizontal masked reveals for अथाह and सागर; staggered move/scale settle for एक संकल्प. Positions use open sky and ocean, leaving the character clear. First block uses dark indigo against warm sky; following blocks use ivory against teal.

Timing anchors were estimated with faster-whisper small against the actual final mix: छलाँग 1.10s, अथाह 3.54s, सागर 3.92s, एक 6.66s, संकल्प 6.98s. ASR spelling errors were corrected against the approved script, not copied into the text. These are machine-estimated spoken onsets, not human-certified phoneme alignment.

Run FFmpeg with `-vf ass=kinetic-text.ass -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -c:a copy -movflags +faststart` using the original proof as input. Noto Serif Devanagari must be installed. Text rendering uses libass shaping and deterministic ASS transforms; no image/video generation calls.

QA: sampled actual final frames at 1.9, 4.7 and 7.8 seconds; Hindi forms checked visually, no character overlap. 300 frames, duration 10.000s. Original/output audio packet SHA256 both 932369af2d4eb905b5ec0f85114ba9e07eafd0765a7a26ba4a40f3cda5e351bc.
