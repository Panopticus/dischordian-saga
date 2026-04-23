# ⚠ PRINCE PHASE 1 — PENDING USER CANON UPLOAD

**Status:** Placeholder. This directory is empty and awaiting user's
canonical Prince (Celebration-era) image.

**Canon anchor:** `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`
§2V/W.3 — the Engineer & Prince are confirmed as the same person at
different life phases. Phase 2 (Engineer, red goggles + red coat
+ burning cityscape) is locked. Phase 1 (Prince of Celebration) is the
one outstanding placeholder from §10.4.

## Candidate source

`docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png`
exists in the repo and may be usable. Requires user confirmation before
we treat it as canon.

## Working placeholder prompt (remove when real canon lands)

> Three-quarter bust portrait of the SAME man as the Phase 2 Engineer
> (Black, short dreadlocks, trimmed beard), but ~5-10 years younger.
> Wearing CELEBRATION royal ceremonial attire in pastel warm-cream and
> honey-gold — structured ceremonial vest or short robe with small
> warm accents, no steampunk elements, no goggles, no red military
> coat. Clean ornament work at collar and cuffs. Youthful regal
> bearing, innocent of what's coming. Backdrop: warm honey-gold
> Celebration parade light, defocused crowd bokeh. Same face-mesh as
> Phase 2. USER CONFIRMATION REQUIRED before finalizing.

## When user uploads canon

1. Save the canonical image as `./front.png` in this directory.
2. Replace this README's content with the standard REFERENCE.md
   format (see `apps/client/public/references/README.md` for the
   template).
3. Trigger regeneration of CIN-PRINCE-01's START FRAME (the Celebration
   royal hall shot) so it uses the locked Phase 1 canon.
4. Update the art brief §2V/W.3 status from "⚠ NOT YET LOCKED" to
   "VALIDATED" and bump §10.3 change log with a new entry.
5. Mark §10.4 question 1 as resolved.

## Downstream impact

Until the Phase 1 canon lands:
- CIN-PRINCE-01 START FRAME is a text-only placeholder (END FRAME is
  already locked to Phase 2 canon).
- Part 2V/W Phase 1 bundle (8 breathing frames + blink triptych +
  viseme grid + 5 expressions) cannot be commissioned.
- The transformation rig's `princeToEngineerProgress` uniform has a
  blend target of "unknown" at progress=0.0.

None of this blocks the Phase 2 Engineer work (which is Phase 2V/W's
canonical default anyway). The Phase 1 gap is strictly for flashback
moments and the transformation cinematic.
