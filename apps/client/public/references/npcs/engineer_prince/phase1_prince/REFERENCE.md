# Prince Phase 1 — provisionally canon-locked (2026-04-23)

**Status:** Provisional canon. Phase 1 references the in-repo image
`docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png`
as the canonical Prince look until/unless overridden.

**Canon anchor:** `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`
§2V/W.3 — refined to candidate-locked status on 2026-04-23 per §10.4
question-1 resolution.

## How to override

If you want to lock a different image as Phase 1 canon:

1. Drop the new image at `./front.png` in this directory.
2. Update §2V/W.3 in the art brief to point at the new reference.
3. Bump §10.3 change log with a new entry noting the override.
4. Re-trigger CIN-PRINCE-01 START FRAME generation against the new
   reference.

Until that happens, asset commission proceeds against the candidate
image cited in §2V/W.3.

## Downstream impact (now unblocked)

- ✅ CIN-PRINCE-01 START FRAME can be commissioned (was blocked).
- ✅ Part 2V/W Phase 1 bundle (8 breathing frames + blink triptych
  + viseme grid + 5 expressions) can be commissioned (was blocked).
- ✅ The transformation rig's `princeToEngineerProgress` blend target
  at progress=0.0 is now resolvable.

Phase 2 Engineer work (the canonical default) was never blocked by
this — it has its own locked canon.
