# Example: Nano Banana 2 — character turnaround sheet

A turnaround is the foundation asset for everything else (3D rig
import, viseme grid identity-anchor, Veo cinematic frames). Generate
it first for any new character.

## When to use this recipe

- Asset rows in `p0-tranche.csv` with `tool = nano-banana-2` and an
  `_id ending in `_turnaround_*` or `_turnaround`.
- Output is a 4-frame sheet (front / 3-quarter left / side left /
  back) at 2048×2048 each, transparent background.

## Inputs you need ready

1. **Canon reference image** at the path noted in the row's
   `prompt_ref` source paragraph (typically
   `apps/client/public/references/{protagonists,npcs}/{id}/front.png`).
2. **The four prompt blocks** from the art brief at the cited
   §section. Example for Elara: `§1A.1 FRONT`, `§1A.1 3/4 LEFT`,
   `§1A.1 SIDE LEFT`, `§1A.1 BACK`. Each is a self-contained
   paragraph in the brief that includes the global style anchor
   (hyper-realistic cinematic, photorealistic materials, film grain,
   4K, no rendered text, etc.) — copy-paste directly into NB2.

## Step-by-step

For each of the four frames:

1. Open Nano Banana 2 (web UI or API).
2. Set output: 2048×2048, transparent background.
3. Upload the canon reference image as the identity anchor.
4. Paste the §section prompt block verbatim.
5. Render. Check the result against:
   - **Identity match:** does the face look like the canon reference?
     If no → iterate or adjust prompt language.
   - **Composition match:** is the rotation angle correct (front =
     directly facing camera, 3/4 = 45° turn, etc.)?
   - **No rendered text** anywhere unless the row's notes say
     otherwise (Architect's mask glyphs, Shadow Tongue's lanyard).
6. Save to the `output_path` listed in the CSV row.
7. Update `p0-tranche.csv` row status to `completed`.

## Per-frame consistency requirements

All four frames MUST share:
- **Identical lighting rig** (3-point soft, neutral grey #808080
  background)
- **Identical pose** (T-pose / hands at sides per the brief)
- **Same skin/material/color shaders** (no chromatic drift between
  angles)
- **Same camera distance** (head-to-toe-height ratio matches across
  frames)

If any frame drifts from the others, regenerate that single frame
with the others as additional reference inputs.

## Common iteration triggers

- **Eye-color drift between angles** → re-prompt with explicit hex
  code from the brief
- **Hair length mismatch** → upload the FRONT frame as additional
  reference for the side/back passes
- **Background bleed-through where there should be transparency** →
  re-render with a stronger transparent-background directive
- **Shoulders narrower in the 3/4 view than in front** (common NB2
  artifact) → add "preserve shoulder width from reference identity"
  to the prompt

## Slicing into individual files

Most of the per-NPC bundles deliver "_grid" or "_sheet" files that
need slicing:

- Viseme grid (5×3 = 15 panels): slice at 2048÷3 × 2048÷5 = each
  panel ~683×410. Save each as `{phoneme}.png` per the brief's
  phoneme set (sil, AA, AE, AH, AO, B_M_P, CH_SH, D_S_T, EE, ER,
  F_V, IH, L, OW, R, UW, W).
- Expression sheet (5 panels in a horizontal strip): slice at
  2048÷5 ≈ 410px wide each. Save as
  `{neutral,speaking,concerned,emotional1,emotional2,revealing}.png`.
- Breathing strip (8 frames, horizontal): slice at 2048÷8 = 256px
  wide each (or use a vertical strip at 256px tall for non-square
  outputs). Save as `frame_01..08.png`.

## Estimated cost / time per turnaround

- 4 NB2 renders (one per angle), ~30s each at 2048² = ~2 minutes
  active time per character
- 1-2 iterations average for identity match on the first character
  in a new style; usually just 1 once the reference is good
- Slicing the viseme grid + expression sheet: ~5 minutes manual or
  one Photoshop action

A new character bundle (turnaround + breathing + blink + visemes +
expressions = ~32 final images) takes ~30 minutes of NB2 work +
~15 minutes of slicing/saving for an experienced artist.
