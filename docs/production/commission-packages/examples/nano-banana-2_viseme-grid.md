# Example: Nano Banana 2 — viseme grid

A 15-panel grid of mouth shapes (one per ARKit phoneme) used to drive
audio-aligned lip-sync. Generated as ONE Nano Banana sheet, then
sliced into 15 individual phoneme plates.

## When to use this recipe

- Asset rows in `p0-tranche.csv` with `_id` ending in `_viseme_grid`
  or `_visemes` and `tool = nano-banana-2`.
- Output is one 2048×2048 sheet (5 rows × 3 columns) of the
  character's face from nose-tip to chin, with a different mouth
  shape per panel.

## Inputs you need ready

1. **Character's neutral bust** at the path noted in the row's
   `dependencies` column (typically `{...}/neutral.png`). Used as
   identity-anchor reference.
2. **The grid prompt block** from the art brief at the cited
   §section. Example for Elara: `§1A.2 grid prompt`. The block
   already enumerates all 15 phoneme shapes inside one paragraph.

## Step-by-step

1. Open Nano Banana 2.
2. Set output: 2048×2048, dark neutral background.
3. Upload the character's neutral bust as identity anchor.
4. Paste the §section grid prompt verbatim. Critical: the prompt
   describes ALL 15 phonemes in one paragraph and instructs NB2 to
   render them as a 5×3 grid layout.
5. Render. Validate:
   - **15 panels visible**, in 5 rows × 3 columns
   - **Phoneme labels** (small grey text at panel bottom edge) read
     correctly: SIL, AA, AE, AH, AO, B_M_P, CH_SH, D_S_T, EE, ER,
     F_V, IH, L, OW, R, UW, W
   - **Identity consistency**: same skin tone, same eye direction
     (straight at viewer), same camera height across all 15 panels
   - **Viseme accuracy**: AA = jaw fully dropped, B_M_P = lips
     pressed, etc. Check each panel against the phoneme spec in
     §1A.2 (Apple ARKit convention).

## Per-character quirks

Different characters have different viseme constraints — the brief
documents these per-NPC. Common ones:

- **Beard-clearance** (Antiquarian, Phase 2/3 Kael): mustache
  digitally thinned to ~40% volume in reference plates so phoneme
  shapes read clearly. Runtime adds beard-part morphs.
- **Mask-routed** (Architect, Warlord): NO traditional mouth visemes.
  Instead, the 15-panel sheet shows mask-vibration emissive intensity
  patterns (Architect) or visor-shimmer intensity (Warlord). Same
  workflow, different visual meaning.
- **Hyperextend variants** (Shadow Tongue): generate TWO sheets per
  character — 15 standard + 15 hyperextended. Open vowels (AA, AO,
  OW) get jaw-beyond-anatomical-limit + second-row teeth visible.
  Per-line opt-in via VO manifest's `revealSecondTeeth` field.
- **Child-scale** (Minnie, Corey, Palimpsest, Phase 1 Kael when
  applicable): panel openness at ~60-65% of adult-scale by anatomy.
  AA viseme on Minnie/Palimpsest specifically runs ABOVE child-scale
  (110-120%) — Archon cadence in a kid's throat.

## Slicing the grid

The grid is 2048×2048 with 5 rows × 3 columns:
- Each panel is ~683 wide × ~410 tall (with label band at bottom)
- Slice each panel into its own file at the path:
  `apps/client/public/portraits2d/{npcId}/visemes/{phoneme_label}.png`

The phoneme labels in the grid are deliberately small grey text at
the panel bottom edge — they'll be cropped or masked out during
slicing. Keep them in the source grid for reference but don't
include them in the runtime per-phoneme files.

## Cost / time

- 1 NB2 render at 2048² = ~30s
- 1-3 iterations to get viseme accuracy + identity consistency on a
  new character (the open-vowel panels are the most failure-prone)
- Slicing into 15 files: ~5 minutes manual, or run a Photoshop
  action / scripted PIL crop

Total per character: ~10-15 minutes including iteration.
