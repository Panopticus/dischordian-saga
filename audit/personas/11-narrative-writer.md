# Narrative / Writer — Audit

## Top 5 findings

### F1: LORE_BIBLE.md is stale — 4 missing characters, 14 missing concepts vs canonical JSON
- file: `/home/user/dischordian-saga/docs/built/LORE_BIBLE.md:7-13` vs `/home/user/dischordian-saga/apps/client/src/data/loredex-data.json`
- severity: high
- category: lore_drift
- finding: Bible TOC declares "Characters (109), Concepts (95)" but `loredex-data.json` has 113 characters and 109 concepts (factions/locations/events/artifacts/songs match). The bible header instructs `pnpm lore:generate` to regenerate, and the `lore.bible_drift` ratchet exists in `apps/shared/_completeness/registry.ts` (`checkLoreBibleDrift()`), so this is detectable but evidently not gated green right now. Four named characters and fourteen concepts (e.g. Jericho Jones is in the bible — but Marion Kell-era newer entries may not be) are silently absent from the regenerated MD, so docs and code disagree about who exists.
- fix: run `pnpm lore:generate`, commit the regenerated `docs/built/LORE_BIBLE.md`; if `pnpm ship:check` reports `lore.bible_drift` as RATCHET/FAIL, drive to PASS in the same PR. Do not bump the ratchet target.

### F2: Five Act-1 / Act-7 antagonist VO manifests are empty `{}` stubs
- file: `/home/user/dischordian-saga/apps/shared/authorityVoManifest.json` (and `act4_5VoManifest.json`, `eidolaVoManifest.json`, `matrikalaVoManifest.json`, `programmerVoManifest.json`) — all contain literally `{}`
- severity: high
- category: stub_manifest
- finding: Production Bible §3.2 lists The Authority as the Cycle C finale opponent (Act 1 Last-Words gate) and Eidola/Matrikala as Mechronis Academy opponents — all three ship today per the bible, yet their VO manifests are empty. `act4_5VoManifest.json` is empty despite the act4_5 interlude existing. 11 more manifests have ≤2 entries (`betweenVoManifest.json`, `chorusVoManifest.json`, `engineerVoManifest.json`, `politicianVoManifest.json`, `wardenVoManifest.json`, `watcherVoManifest.json`, `aokiVoManifest.json`, `greenshawVoManifest.json`, `halverezVoManifest.json`, `kanevasVoManifest.json`, `kasraVoManifest.json`).
- fix: author `apps/scripts/authority-lines.json` (and the four siblings) using the `act1OpponentDialog.ts` 12-field schema, then run `pnpm vo:run-all`. Until then mark these characters as `priority: deferred` in loredex or remove the empty manifests so the audit can't lie by omission.

### F3: Zero hardcoded-string i18n extraction — 100% English in components
- file: `/home/user/dischordian-saga/apps/client/src/components/*.tsx` (10+ components with 4–27 prose-pattern hits per file: `ItemDetailModal.tsx:27`, `MilestoneJournalEntries.tsx:25`, `RoomTutorialDialog.tsx:12`)
- severity: medium
- category: i18n_block
- finding: A `grep -rcE "\b(t\(|i18n|Trans>|FormattedMessage)" apps/client/src/components` returns nothing; no string-extraction layer exists. All flavor, tutorial copy, and Elara/Human dialog ship as inline JSX literals (e.g. `Elara.cryo-bay.post-autopsy-reentry` resolves at runtime from a TS map, not a translatable catalogue). Translation work would require a full pass to extract.
- fix: introduce `react-i18next` (or pick a runtime), define a `t()` helper in `apps/client/src/lib/i18n.ts`, and route the largest offenders (`ItemDetailModal`, `MilestoneJournalEntries`, `RoomTutorialDialog`) through it first. Add a lint rule blocking new JSX-text literals in `apps/client/src/components/` once the catalogue exists.

### F4: 214 placeholder card flavor texts in `s1_pack2/` ("Of the architect.", etc.)
- file: `/home/user/dischordian-saga/apps/shared/tcg-core/cards/definitions/s1_pack2/architect.ts:250`, `.../insurgency.ts` (×N), `.../antiquarian.ts:301`, `.../new_babylon.ts:403`
- severity: high
- category: flavor_quality
- finding: 214 cards in `s1_pack2/` ship `flavorText: "Of the <faction>."` This is a templated stub, not flavor — and it actively undermines the canonical thesis ("the music IS the prophecy; the game is the fulfillment") by making the largest card pool prose-empty. Compare to hand-authored `s1_char_046_the_seer.ts:76` ("Unbound by allegiance, the Seer identifies opportunities…") and `s1_char_047_the_shadow_tongue.ts:83` — the contrast is jarring within a single deck.
- fix: write a one-line lyric- or transmission-derived flavor per card pulled from the matching `loredex-data.json` `song_character_map` entry. Add a parity test in `apps/shared/_completeness/registry.ts`: `card_flavor_quality` — count cards whose `flavorText.length < 20 || matches /^Of the [a-z]+\.$/`. Ratchet target: 0.

### F5: Concepts list contains near-duplicates and Mystery-Engine bleed-through
- file: `/home/user/dischordian-saga/apps/client/src/data/loredex-data.json` (109 `type: concept` entries)
- severity: low
- category: redundancy
- finding: Concept names cluster suspiciously: "The Collector's Garden — Classified Dossier" + "The Collector's Work"; "The Goggles of the Game Master" + "The Goggles' Custodian"; "Audit Legibility" + "Audit Outcome — Camouflage Validated" + "Audit via Routine" + "Camouflaged Accounting" + "Calibration-Tape Transparency" — five concepts that all describe the same auditing micro-mechanic. "The Heart of Time (Mystery-Engine Reference)" parenthetically advertises that it's a cross-reference, not a concept. The 109-vs-95 drift in F1 is partly because mystery-engine arc internals are leaking into the public concept namespace.
- fix: in `loredex-data.json`, fold the five Audit-* concepts into one parent "The Annual Audit" with sub-fields. Demote "Mystery-Engine Reference" entries to a separate `type: "mystery_anchor"` (and update `loredexSchema.ts` + `loredexCompletionTargets.ts` accordingly). Re-run `pnpm lore:generate`.

## Voice samples (3 short quotes)

- The Human, philosophical/Disco-Elysium register, holds: `apps/scripts/human-lines.json` `human_act1_elara` — *"She's good. She means well. But she doesn't see the full picture. She can't. Her operating system runs on the same architecture I'm hiding in. She's blind to what's beneath her. I'm beneath her. In the foundation."*
- The Antiquarian, biblical/deterministic register, holds: `apps/scripts/antiquarian-lines.json` `antiq_fulcrum` — *"I walk between moments. The Ages of this universe are chapters in a book I've read many times. You are standing at the fulcrum — and what you do next echoes in both directions."*
- Act 7 convergence, narratively confident, on-thesis: `apps/scripts/act7-vo-lines.json` `patient-zero-close` — *"We have nothing to say here. Record 14 seconds of room tone from each voice bank. Mix both at -30 LUFS. This line is a silence."* (The recording-direction-as-text is intentional in this manifest's "both_narrators" speaker model — voice consistent between Acts 1 and 7.)

## Convergence hints
- F1 (lore drift) and F5 (concept redundancy) both touch `loredex-data.json` and the `lore.bible_drift` ratchet — single PR.
- F2 (stub manifests) and F4 (stub card flavor) are the same pattern (scaffolding mistaken for shipped) — relevant to the Staff-Engineer persona's `pnpm ship:check` lane and the TCG-Designer persona's card-content lane.
- F3 (i18n) intersects the Accessibility persona (screen-reader pronunciation of inline literals) and Mobile (string bundle size).
- "Both narrators" speaker model in Act 7 (`xMyNDrPFEtQN8iZtT7l2`) is the same `voiceId` as Elara's solo lines — flag for the Audio/QA persona; intentional or accidental voice collision deserves a sanity check.
