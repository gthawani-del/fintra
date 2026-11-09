# State of AI in 2027 — Lemo low-poly revision

40-second, 9:16 film with original three-dimensional miniature geometry, procedural growth and moving work objects. Based on Lemo's Low-poly Isometric Island style. Ivory/apricot background, muted teal/lilac modules, amber signals and plum text replace v1's dark metallic palette.

## Brand ending
The final four seconds show the supplied original eliv8lyf logo and www.eliv8lyf.com. Background #fdfdfd was sampled as the most frequent near-white colour in the supplied JPEG. The JPEG is used unchanged; its subtle background variation/compression is retained. Logo asset is excluded from public git.

## Build
Use the same Lemo commit as v1: bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00. Install its Node dependencies. Set LEMO_ROOT and PLAYWRIGHT_CHROME; use LEMO_ANGLE=swiftshader for software rendering. Python requires numpy, scipy and edge-tts; FFmpeg and Open Sans system fonts are required.

Place the supplied logo at assets/eliv8lyf-original.jpeg, then run bash build.sh. Narration is cached per line in assets; the same six verified voice clips as v1 were reused for the delivered version. Voice regeneration requires network access and provider terms apply. Generated media stays outside git.

The 3D render is native 1080x1920 with half-resolution GTAO, 8 samples, a restrained tilt-shift pass, pastel grade and neutral tone mapping. The original style's 2x supersampling is omitted to keep the CPU render practical. Actual official renderer logs and QA metadata accompany the source.

Content remains an outlook, not a report of events already known to have occurred in 2027. See FACTS.md for evidence and inference boundaries.

Final compositing: a CSS mask feathers only the logo image’s outer blank margins, removing the supplied bottom border line. The original asset bytes and logo artwork remain unchanged.
