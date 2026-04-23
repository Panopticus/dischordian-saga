# Example: Veo 3.1 — seamless idle loop

A short looping motion clip where start frame and end frame are
visually identical, and motion happens entirely between them. Used
for character-sheet idle states (Elara hologram), casino cosmetic
ambient (chip stack rotating), and the Lions Club gear materialize
template.

## When to use this recipe

- Asset rows in `p0-tranche.csv` with `tool = veo-3.1` and `_id`
  ending in `_idle` or `_loop` (not `_motion` for one-shot
  cinematics — see the `veo-3.1_one-shot-cinematic.md` recipe for
  those).
- Output is an `.mp4` at the row's `output_path`, designed to loop
  seamlessly when the player encounters the asset in-game.

## Inputs you need ready

1. **The START FRAME**, generated as a separate Nano Banana 2 still
   asset (its own row in p0-tranche.csv, listed in `dependencies`).
   For seamless loops, the END FRAME is identical to the START FRAME
   — no separate render.
2. **The motion prompt block** from the art brief at the cited
   §section. Example: §9 CIN-ELARA-IDLE MOTION PROMPT — a multi-
   paragraph paragraph with explicit frame timings.

## Step-by-step

1. Generate the START FRAME first via Nano Banana 2 (see the
   `nano-banana-2_turnaround.md` recipe for general workflow).
   Save to the intermediate path (e.g. `_intermediate/elara_idle_start.png`).
2. Open Veo 3.1 (web UI or API).
3. Mode: "Image-to-video with start + end keyframe."
4. Upload the START FRAME at BOTH the start-keyframe slot AND the
   end-keyframe slot. (Veo treats them as identical → enforces a
   true loop without drift at the loop point.)
5. Paste the §section motion prompt verbatim. The prompt enumerates
   exact beats with timestamps (e.g. "blink at 2.1s, scanline
   sweep at 4.5s, eye saccade at 6.0s").
6. Set Veo config:
   - Duration: per the asset's spec (e.g. 8s for CIN-ELARA-IDLE)
   - Aspect: per the row (1:1 square for character-sheet, 16:9 for
     environmental)
   - Camera mode: LOCKED (no dolly/pan unless the prompt explicitly
     calls for one)
   - Frame rate: 24fps (default; loop-point math depends on this)
7. Render. Validate:
   - **Loop seamlessness:** play the .mp4 in a loop player; the
     stitch between final-frame and first-frame should be invisible
   - **Beat timing:** the timestamps in the motion prompt should be
     hit (e.g. blink visibly happens around the 2.1s mark)
   - **No camera drift:** the framing must not slowly zoom or pan
     across the loop (a common Veo artifact on motion-heavy prompts)
   - **Particle continuity:** if the prompt has continuous particle
     motion (Elara's rain motes, Degen's tattoo pulse), particles
     should not "jump" at the loop point
8. Save to the `output_path` listed in the CSV row.

## Common iteration triggers

- **Camera drift:** add "camera locked, NO DOLLY, NO PAN" to the
  motion prompt
- **Loop-point seam visible:** the START FRAME drift slightly on its
  own re-render; lock the seed value or duplicate the file as both
  start and end keyframe
- **Beat misses (e.g., blink doesn't happen at 2.1s):** Veo doesn't
  always honor exact timestamps — re-prompt with simpler beat
  language ("around the 2-second mark, brief eye blink") or accept
  the variance
- **Subject identity drift:** the END FRAME might show a slightly
  different face than START — this breaks the loop. Use Veo's
  "preserve subject identity from start frame" toggle if available

## Loop-point math (for the .mp4 spec)

24fps × 8 seconds = 192 frames. The art brief's motion prompts cite
loop-points in frames (e.g. CIN-ELARA-IDLE: "Loop-point match at
frame 192"). Verify post-render with:

```bash
ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames \
  apps/client/public/videos/character-sheet/protagonist_elara_idle_loop.mp4
```

Frame count should equal `duration × fps` exactly. If off by 1-2
frames (common Veo encoder behavior), trim with ffmpeg:

```bash
ffmpeg -i input.mp4 -vf "trim=end_frame=192" -c:a copy output.mp4
```

## Cost / time

- Veo 3.1 render at 8s @ 1:1 2048²: ~3-5 minutes per attempt
- 1-3 iterations to nail loop seamlessness on a new character
- Optional ffprobe + ffmpeg trim: 30s

Total per idle loop: ~15-20 minutes including iteration.

## Audio sync (deferred)

The art brief's motion prompts include "Audio hand-off note" sections
specifying Suno-generated stingers / ambient layers. Audio is OUT OF
SCOPE for the Veo render — that's a separate Suno v4 commission +
post-production audio mix. Veo .mp4 should ship with NO baked-in
audio track; runtime composites Suno layer over the silent video.
