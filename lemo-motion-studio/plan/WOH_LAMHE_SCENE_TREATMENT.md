# Woh Lamhe: beach film treatment and motion-asset plan

**Status:** six generated images reviewed as identity / staging reference. This is a shot plan, not a rendered movie. Keep human movement separate from Lemo compositing.

## Nonnegotiable creative
One recurring fictional adult couple; consistent appearance and wardrobe as closely as the supplied six reference images permit. Beach geography, sunset lighting, skin tones and continuity must be checked. This is a **moving film**: do not stretch six static keyframes into 133 seconds using pan/zoom. Lemo = composition, kinetic typography, transition effects, frame rendering; image-to-video clips / licensed original footage = lifelike body movement; bilingual vocal alignment = lyric timing.

## Story map

| Song time | Story | Reference still(s) | Motion action | Typography |
|---|---|---|---|---|
| 00:00–00:16 | Introduce beach and couple. They are together | golden_hour_by_the_sea; sunset_stroll_by_the_sea | Shore-level tracking; walking; warm eye contact | Brief intro; **TIME MOVES ON** masked word reveal; **MEMORIES STAY** held typography |
| 00:16–00:27 | Guitar melody introduces memories | romantic_sunset_beach_embrace | Tilt from hands to faces; waves; subtle orbit | Minimal, instrument-reactive lines, no invented lyrics |
| 00:27–00:41 | Recall moments together | golden_sunset_hand_in_hand; cinematic_beach_sunset_embrace | Couple close-ups; laughter; tracking past their footprints | 2–4 words at a time, appeared on actual vocal onsets |
| 00:41–00:51 | First emotional fracture | wistful_sunset_on_the_shoreline | One partner walks ahead; over-shoulder distance; no abrupt face morph | Type splits and moves apart |
| 00:51–01:11 | First chorus, memory overwhelms | romantic_sunset_beach_embrace; sunset_stroll_by_the_sea | Slow-motion close-ups; rotating memory insert; tide match cuts | Oversized **WOH LAMHE**, chorus-driven mask reveals |
| 01:11–01:38 | Present-day solitude | wistful_sunset_on_the_shoreline; golden_hour_by_the_sea | Solo walking, empty shore, reflections, camera recedes | Sparse warm-to-cool lyric transitions; legible phrases |
| 01:38–02:00 | Electric guitar solo | cinematic_beach_sunset_embrace; golden_sunset_hand_in_hand | Dynamic memory flashes, waves, push-pull shots | No vocal text, reactive graphics on instrument hits |
| 02:00–02:13 | Final refrain and separation | romantic_sunset_beach_embrace; wistful_sunset_on_the_shoreline | Couple appears as memory; camera reveals one person alone, dissolving tide | Final **WOH LAMHE**, trailing **FADING INTO THE RAIN** |

## Source-reference mapping

File names in current ChatGPT work folder (not committed, media private):
- golden_hour_by_the_sea.png
- sunset_stroll_by_the_sea.png
- romantic_sunset_beach_embrace.png
- wistful_sunset_on_the_shoreline.png
- golden_sunset_hand_in_hand.png
- cinematic_beach_sunset_embrace.png

### Motion requirements
- Generate at least 3 distinct 5- to 8-second moving scenes **before** rendering long-form. Minimum: couple walk, emotional close-up, separation.
- Repeat shots only with motivated reversal / alternate framing; do not stretch clips or invent human motion with camera zoom.
- Use locked subject/identity references in any image-to-video stage. Verify physical gestures, faces and clothing over frames and reject morphing.
- Need multiple individual shots for the complete 133-second sequence. Six stills are not sufficient source footage for a high-quality full-length video.
- Confirm source video rights before reuse and avoid unauthorized third-party audio.
- Use original MP3, not an AI-recreated track.

### Vocal timing
Current `film/lyrics.json` is **draft**. Do not use it as a verified transcript. Obtain multilingual vocal word/phrase timestamps and spot-check intro, switch to Hindi, each chorus and ending.

### Lemo quality gate
- Actual images visible in proof at target 9:16 resolution.
- 0.2-second frame strips show genuine character movement, not just photo translation.
- At least three distinct text motion treatments.
- Lemo `core/render/video.mjs` logs successful; audio mux verified.
- Inspect a 15-second rendered excerpt with original audio before 133-second export.
