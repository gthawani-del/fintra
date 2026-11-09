# Spoken-word highlight revision

Supersedes the scattered kinetic-label treatment for the review clip. Complete Hindi phrases stay in one stable lower-third zone; the currently spoken word turns gold, other words remain ivory. Noto Sans Devanagari Bold (700), 132 ASS units, dark translucent backdrop. Each phrase moves up 21 px over 140 ms on entry; subsequent word changes retain the same baseline and layout.

Source narration and animation unchanged. Uses the existing machine-estimated onset mapping, not a new timing transcription: 0.20/0.94/1.10/1.54, 3.08/3.54/3.92/4.42, 5.82/6.04/6.30/6.66/6.98 seconds. Final संकल्प emphasis is intentionally held after the sentence ends.

QA: actual rendered frames at 1.3s show छलाँग highlighted; 4.1s show सागर highlighted; 7.2s show संकल्प highlighted. Full decode passed. AAC packet SHA256 remains 932369af2d4eb905b5ec0f85114ba9e07eafd0765a7a26ba4a40f3cda5e351bc. No human-certified phoneme alignment claim.

Render from the original Hanuman_Lemo_Motion_Test.mp4 using FFmpeg `-vf ass=kinetic-highlight.ass -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -c:a copy -movflags +faststart`. Keep the previous file available for comparison.
