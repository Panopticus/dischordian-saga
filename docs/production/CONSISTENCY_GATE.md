# Asset Consistency Gate — Production Checklist

No asset ships without passing this checklist. This is the hand-off between AI generation and human approval.

## Before generating

- [ ] Which **asset category** is this? (character_portrait, scene_cutscene, room_vista, fighter_sprite, card_art, music_track, voice_line)
- [ ] Which **character** is involved? (look up their DNA in `shared/characterVisualDNA.ts`)
- [ ] Pull the **template** for this category from `shared/assetPromptTemplates.ts`
- [ ] Build the prompt using `buildPrompt(templateId, sceneInputs)` — do NOT free-form
- [ ] Confirm the **locked seed + LoRA** from the template are used

## During generation

- [ ] Generate 3–5 candidates, not 1
- [ ] Use the locked negative prompt in full
- [ ] Do NOT remove any `requiredTokens` from the prompt

## Review before approval

Open all 3 candidates + the **3 most recent approved anchors** in the same category for this character (use `findAnchors()` in `shared/assetRegistry.ts`). Place them side-by-side.

Check each:
- [ ] **Face consistency** — same person recognizable across anchors + new asset
- [ ] **Palette consistency** — character's 3-color palette visible (check `characterVisualDNA.ts`)
- [ ] **Outfit consistency** — canonical outfit, no drift
- [ ] **Style tokens present** — all required aesthetic tokens visible
- [ ] **"Never depict" rules respected** — none violated
- [ ] **Pose/composition** varies from anchors (avoid identical shots)

## Approval sign-off

- [ ] Art director name stamped
- [ ] Date recorded
- [ ] Anchor comparison IDs logged (3 required after category has 3+ prior approvals)
- [ ] Entry added to `ASSET_REGISTRY` in `shared/assetRegistry.ts`

## If REJECTED

- [ ] Note which check failed in `notes` field
- [ ] Log as `status: "rejected"` — do NOT delete (rejection history is valuable)
- [ ] Re-prompt with adjustments; new attempt gets new `id`

## Weekly drift audit (art director)

Run `summarizeForReview()` each week. Investigate any `drifts` reported:
- Character using multiple seeds → pick one, flag others for regeneration
- Character using multiple LoRAs → pick one, flag others for regeneration
- Palette shifting over time → pull anchors, realign

## The discipline, in one line

**Prompt is a contract. DNA is law. Anchors are the truth.**
