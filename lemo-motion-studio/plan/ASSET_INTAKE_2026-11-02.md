# Woh Lamhe — supplied-media intake, 2 November 2026

**Historical intake snapshot. Superseded by the user's subsequent instruction to complete the film with the existing media. See `../final-cut/TREATMENT.md` and `../final-cut/QA.json`.**

Inspected feature commit: `f9eb77861a5c542d71a2ec0a1dd3b5f8b86fbbf0`.
Upstream Lemo inspected: `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00`.
Work remains on `feature/lemo-motion-studio`, in the project folder and its dedicated workflows.

## Actual inputs

| Asset | Measured properties | Use |
|---|---|---|
| Original song | 133.272 s; MP3; 48 kHz stereo | Preserve original audio |
| Shore motion clip | 5.041667 s; H.264; 512×910; nominal 30 fps; no audio | Rear/three-quarter couple establishing shot |
| Walking image, A74386FC… | 864×1536 JPEG | Walking, faces and wardrobe reference |
| Seated image, 0ACE0475… | 864×1536 JPEG | Intimate seated two-shot reference |
| Shore image, A000E350… | 864×1536 JPEG | Rear-view hand-holding reference matching the clip |

Exact filenames and hashes are in `supplied-media-2026-11-02.json`. Media bytes are not committed; public redistribution has not been authorized.

## Findings and changes

- Sampled video frames show steps, turns, dress/hair and surf movement. Faces are small or turned away; use the clip as establishing coverage. Sampled inspection does not establish full-speed hand/face QA. A 1080×1920 export would upscale this clip, not recover detail.
- The old full-film workflow downloaded Unsplash photos. The old proof workflow downloaded a different Mixkit couple. Both are parked to prevent further renders with rejected sources; their previous implementations remain in Git history.
- `film/lyrics.json` has draft phrase cues; both its words and timing are unverified. It remains unchanged. No approved canonical transcript or word alignment is present.
- The three stills are references, not three additional moving scenes. Do not loop/stretch five seconds to simulate the required 15-second proof.

## Smallest next proof

Opening shot plan, with cut points to be adjusted after checking the audio:

1. About 0–5 s: supplied rear-view shore clip, without looping.
2. About 5–10 s: a moving shot based on the walking image; slow forward walk and one exchanged glance, stable faces and wardrobe.
3. About 10–15 s: a moving shot based on the seated image; gentle head lean/eye contact, surf and fabric movement.

**Missing:** two distinct usable clips of at least five seconds each, plus the final lyric transcript for alignment. Full-song coverage also needs separation/solo shots and beach inserts. These three opening shots alone do not support a complete 133-second film.

After word timing is checked, author masked reveals, spatial word separation and chorus emphasis in Lemo. Deliver the 15-second official browser-rendered proof with original audio and a contact sheet before full export, as required by the existing project instructions.

## Reproducible media preparation

Requires Python 3.11+, FFmpeg and ffprobe. Makes no network or model/API calls.

```sh
python lemo-motion-studio/scripts/prepare_media.py --source-dir /path/to/attachments --seconds 5
```

Verifies all source hashes, retains unchanged originals under ignored `.local-media/originals/`, and extracts 120 frames at 24 fps. Diagnostic frames are 540×960; the original 512×910 resolution is recorded. An existing output directory is refused. The default 15-second request must fail for the current clip. This script does not render a movie, align lyrics or certify creative quality.

## Runtime and QA boundary

FFmpeg and Node are available. Playwright is installed but its Chromium executable is absent; no speech alignment model is installed. No paid generation or large model download was started. GitHub Actions can provide the documented renderer, but the private inputs still need a permitted transfer path to that runner. Never commit media or signed download URLs to bypass that gap.

The five files were measured with ffprobe. All three images and six video samples were inspected. Preparation, original-hash preservation and rejection of an unsupported 15-second duration were exercised against the actual files. No new video render, approved lyric synchronization or final-quality result is claimed.
