#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assembly-proof/out
ffmpeg -y -v error -i deliverables/Ayodhya_Lemo_Highlight_v2.mp4 -vf 'fps=30,tpad=stop_mode=clone:stop=6' -t 17.2 -an -c:v libx264 -preset ultrafast -crf 18 assembly-proof/out/a.mp4
ffmpeg -y -v error -i deliverables/Ramayana_Shadow_Theatre.mp4 -vf 'fps=30,tpad=start_mode=clone:start=6:stop_mode=clone:stop=6' -t 18.4 -an -c:v libx264 -preset ultrafast -crf 18 assembly-proof/out/b.mp4
ffmpeg -y -v error -i deliverables/Hanuman_Kinetic_Highlight_v2.mp4 -vf 'fps=30,tpad=start_mode=clone:start=6' -t 10.2 -an -c:v libx264 -preset ultrafast -crf 18 assembly-proof/out/c.mp4
ffmpeg -y -v warning -filter_complex_threads 2 -i assembly-proof/out/a.mp4 -i assembly-proof/out/b.mp4 -i assembly-proof/out/c.mp4 -filter_complex '[0:v]settb=AVTB[a];[1:v]settb=AVTB[b];[2:v]settb=AVTB[c];[a][b]xfade=transition=fade:duration=0.4:offset=16.8[ab];[ab][c]xfade=transition=fade:duration=0.4:offset=34.8,format=yuv420p[v]' -map '[v]' -an -t 45 -c:v libx264 -preset fast -crf 21 assembly-proof/out/picture.mp4
ffmpeg -y -v error -i deliverables/Ayodhya_Lemo_Highlight_v2.mp4 -i deliverables/Ramayana_Shadow_Theatre.mp4 -i deliverables/Hanuman_Kinetic_Highlight_v2.mp4 -filter_complex "[0:a]atrim=duration=17,asetpts=PTS-STARTPTS,aresample=48000,afade=t=out:st=16.85:d=0.15[a0];[1:a]atrim=duration=18,asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.15,afade=t=out:st=17.85:d=0.15[a1];[2:a]atrim=duration=10,asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.12,afade=t=out:st=9.25:d=0.75[a2];[a0][a1][a2]concat=n=3:v=0:a=1[aud]" -map '[aud]' -vn -c:a aac -b:a 192k assembly-proof/out/audio.m4a
ffmpeg -y -v error -i assembly-proof/out/picture.mp4 -i assembly-proof/out/audio.m4a -map 0:v -map 1:a -c copy -t 45 -movflags +faststart deliverables/Ramayana_Three_Styles_45s.mp4
