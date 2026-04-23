# Example: Veo 3.1 — one-shot cinematic (start ≠ end)

A non-looping motion clip with distinct START and END frames. Used
for reveal cinematics (Human particle assembly, Architect mask
ignition), transformations (Kael 3-phase, Programmer aging), and
trigger beats (Shadow Tongue second-teeth reveal).

## When to use this recipe

- Asset rows in `p0-tranche.csv` with `tool = veo-3.1` and `_id`
  ending in `_motion` (paired with separate `_start_frame` and
  `_end_frame` rows in `dependencies`).
- Output is an `.mp4` at the row's `output_path`. Plays once on a
  triggered narrative beat, then the runtime falls back to the
  ongoing rig render.

## Inputs you need ready

1. **The START FRAME .png** at the path from the `cin_*_start_frame`
   dependency row's `output_path` (typically `_intermediate/...`).
2. **The END FRAME .png** at the path from the `cin_*_end_frame`
   dependency row's `output_path`.
3. **The motion prompt block** from the art brief at the cited
   §section. Example: §9 CIN-HUMAN-REVEAL MOTION PROMPT — typically
   a multi-paragraph block with explicit beat timestamps spanning
   the full duration.

## Step-by-step

1. Verify both frames are already generated (they're separate
   p0-tranche.csv rows; their status should be `completed` before
   this row can start). If a frame is `pending`, generate it first
   per the `nano-banana-2_turnaround.md` recipe.
2. Open Veo 3.1.
3. Mode: "Image-to-video with start + end keyframe."
4. Upload the START FRAME at the start-keyframe slot and the END
   FRAME at the end-keyframe slot. (Distinct images — Veo
   interpolates motion between them per the prompt.)
5. Paste the §section motion prompt verbatim.
6. Set Veo config:
   - Duration: per the asset's spec (e.g. 15s for CIN-HUMAN-REVEAL,
     14s for CIN-KAEL-01)
   - Aspect: per the row (1:1 for character-sheet cinematics, 16:9
     for environmental/transformation cinematics)
   - Camera: per the prompt — usually locked or with explicit
     dolly/pan instructions
   - Frame rate: 24fps
7. Render. Validate against the prompt's BEAT LIST — every
   timestamped beat in the motion prompt should be visible at the
   right moment:
   - For CIN-HUMAN-REVEAL: gathering particles at 2.0s, body resolves
     to 0.85 at 8.0s with eyes still dark, eye-kindling 11.0-12.8s,
     IGNITION SNAP at 12.9s, etc.
   - For CIN-KAEL-01: Phase 1 idle 0-3s, Phase 1→2 transition
     3-5s, Phase 2 held beat 5-7s, Phase 2→3 fracture sequence
     7-12s, Phase 3 reveal hold 12-14s.
8. Save to the `output_path` listed in the CSV row.

## Common iteration triggers

These cinematics are the highest-stakes assets in the brief — each
embeds a specific narrative beat. Failure modes to watch for:

- **Beat misses in the timeline.** Veo doesn't always honor exact
  timestamps. Try:
  - Re-prompting with simpler beat language
  - Splitting the cinematic into 2 shorter clips and concatenating
    in post (e.g. CIN-KAEL-01 as two 7s clips: phase-1-to-2 and
    phase-2-to-3)
  - Generating intermediate keyframes at the major beat moments,
    then using them as additional Veo inputs
- **Subject identity drift between start and end.** Particularly bad
  for character-transformation cinematics (CIN-KAEL-01, CIN-PROG-01,
  CIN-PRINCE-01). Mitigation: render both START and END frames with
  the same identity-anchor reference image, and lock seeds where
  Veo allows.
- **Particle effects feel rendered, not native.** Veo's particle
  interpolation can read as compositing artifacts rather than
  in-world VFX. For these, generate the cinematic WITHOUT explicit
  particle prompting, then composite the particle pass in After
  Effects using the VFX atlas (§7) as the source.
- **End frame doesn't fully resolve.** The final ~10 frames might
  drift away from the END FRAME pose. Solution: extend the duration
  by 0.5s and trim post-render with ffmpeg.

## Audio synchronization

Most P0 cinematics have specific audio sync points cited in the
prompt's "Audio hand-off note":
- CIN-HUMAN-REVEAL: Suno low-string stinger at 12.9s ignition; first
  VO line at 14.5s
- CIN-KAEL-01: three-movement score (warm strings → cold bass drones
  → unresolved sustained chord) — coordinate with composer for cue
  placement
- CIN-ARCH-01: bell-tone ring building 0-3s, sharp crystal-crack at
  3.0s, sustain through end
- CIN-WARLORD-REVEAL-01: deliberately near-silent — servo whirs
  during retraction, soft intake of breath at 3.5s, chromatic-shimmer
  pulse at 5.5s synced to the asterisk-tattoo glow

Audio production happens AFTER Veo render is approved. The .mp4
ships silent; runtime composites the Suno + VO layers.

## Cost / time

- Veo 3.1 render at 14s @ 1080p: ~8-12 minutes per attempt (longer
  durations are slower)
- 3-5 iterations average for the more complex cinematics (KAEL-01
  scrubs three phases — first attempts often bury the Phase 2 beat)
- ffmpeg post-trim if needed: 1 minute

Per cinematic: ~1-2 hours including iteration. The 5 P0 cinematics
estimate ~2-3 days total per the §10.1 roadmap.

## Why distinct start/end keyframes matter

Veo's motion interpolation works MUCH better when given both
endpoints than when asked to invent the endpoint from a motion prompt
alone. The START FRAME is the visual identity anchor; the END FRAME
is the destination state; the motion prompt is the route between
them. Without an END FRAME, Veo has to guess the destination — that's
where most reveal cinematics fail to land their final beat (e.g. The
Human's red-eye ignition wouldn't reliably ignite without the END
FRAME explicitly showing both eyes blazing).

For seamless idle loops where start = end, see the
`veo-3.1_idle-loop.md` recipe instead.
