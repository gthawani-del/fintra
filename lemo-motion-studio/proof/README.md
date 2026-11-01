# Woh Lamhe: 15-second proof (Lemo)

Purpose: prove moving people + readable kinetic typography + original audio before a new full render.

The proof uses one real moving beach-couple shot, **not** a static photograph drifting across a background. Stock footage source (Mixkit, free commercial/personal stock-video license): https://mixkit.co/free-stock-video/couple-walking-along-a-beach-at-sunset-44474/

The source video is downloaded at CI render time and transformed into discrete 15-fps JPEG motion frames. The official Lemo `core/render/video.mjs` runs the deterministic Canvas `render(t)` scene. FFmpeg only extracts the actual footage frames and muxes original user MP3 after export. No Claude Code.

Proof timing 0–15s: intro until 6.4s; 'mmm' 6.4–9.2; 'Time moves on' 9.2–12.2; 'Memories stay' 12.2–15s. Vocal intervals remain preliminary until verified by a word-level aligner. This is a *visual motion proof*, not the final synced master.

Pass criteria: visibly moving couple, 15s of footage (no repeated zoom-only still), lyric geometry changes and masked reveals, visible couple on vertical 9:16 render, clean FFmpeg audio mix, 6 key frames inspected by human.
