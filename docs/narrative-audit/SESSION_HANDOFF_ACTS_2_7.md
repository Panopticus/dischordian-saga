# Session handoff — Acts 2–7 authoring sprint

_Covers branch `claude/write-narrative-acts-El8yv` through commit `6255884`._
_Companion to `ACTS_2_7_COMPLETENESS_AUDIT.md` — read that first._

## Status vs. the audit's five recommendations

| # | Item | State |
|---|---|---|
| 1 | Per-opponent dialog tables for Acts 3, 4, 6, 7 | ✅ shipped |
| 2 | Reactive companion comments for Act 2–7 moments | ✅ shipped |
| 3 | `alternateAnswers` schema on `CompanionAskTopic` + first use | ✅ shipped |
| 4 | System tutors for Acts 2+ | ✅ shipped |
| 5 | Cross-act Ask topic lattice | ✅ shipped |

All five recommendations ship in this branch. The two Tier 4 items (morality/trust/act variants and cross-game thread beats) have first authoring passes in but are still well short of their long-term targets — see _What remains_ below.

## Artifacts, in commit order

1. `23b47a1` — `alternateAnswers` schema on `CompanionAskTopic` + `resolveAskAnswer()`; `ask_human_who` gets Act 6 + Act 7 alternates. Test: `companionAskTopics.test.ts` (+5).
2. `ed46810` — `apps/shared/acts2to7Opponents.ts`: 12 opponents (3 + 3 + 2 + 4) across Acts 3/4/6/7, mutually-exclusive path flags. Test: `acts2to7Opponents.test.ts` (9).
3. `d93dba9` — `apps/shared/act3OpponentDialog.ts`: 3 substrate-gate opponents, 12-field-parity dialog. Human frames the descent.
4. `6b72ce4` — `apps/shared/act4OpponentDialog.ts`: 3 path-gated reveal battles. `resolveAct4Dialog(flags)` picks Path A/B/C.
5. `71dbe08` — `apps/shared/act6OpponentDialog.ts`: 2 confession-side mirror matches (Woman She Was + Detective in the Wall).
6. `28647f3` — `apps/shared/act7OpponentDialog.ts`: 4 finale matches. Introduces `frameSpeaker` tag (elara / human / system / dual).
7. `faec8f2` — `companionComments.ts`: 30 entries on 20 new Act 2–7 triggers.
8. `e67252a` — `companionAskTopics.ts`: 21 new topics; every act from 2–7 has ≥1 topic.
9. `3427f55` — `apps/shared/acts2to7SystemTutors.ts`: 6 tutors (dual_channel, substrate_panel, war_room, star_map, confession_journal, convergence_bridge). New `kael_log` speaker type.
10. `941c7f1` — `moralityTrustActVariants.ts`: seeds expanded from 3 → 47 entries across rooms, transmissions, npc_lines, journals, wheel followups.
11. `0b00e45` — `crossGameNarrativeThreads.ts`: seeds expanded from 3 → 9 threads, 20 new beats, 2 three-game threads.
12. `d62ad43` — `apps/shared/companionAskLattice.ts` + `CompanionAskPanel.tsx` wiring: `buildAskLattice()` aggregate view; panel now resolves `alternateAnswers` correctly.
13. `b128406` — variants pass 2: 47 → 92 entries (more rooms/transmissions/npc lines/journals/wheel followups).
14. `6255884` — `actOpponentTaunts.ts` + `ActNOpponentTauntOverlay.tsx`: cross-act taunt adapter + generalized overlay. The Act 1 overlay stays for legacy callers.

## Test suite

- `pnpm test apps/shared` — 146 files, **2548 tests passing** on last full run (commit `6255884`).
- `pnpm check` — clean.

## What remains (future sessions)

**Editorial pass.** The Act 2–7 authoring was done in one sitting. The voice held, but an editorial read by the owner is warranted — specifically on:
- Act 4 Path C (Elara Betrayed) — the tone has to stay hurt-quiet, not bitter. Worth re-reading.
- Act 6 Detective match — "the laugh I haven't used in seventeen thousand years" is load-bearing; if it reads sentimental rather than earned, trim.
- Act 7 Convergence Seat close — final lines of the arc. These almost certainly want a second pass once the finale cinematic is locked.

**Variant registry — more volume.** 92 entries is one-third of the way toward the "hundreds of entries" target. Remaining gaps, in priority order:
1. Room × morality × act matrix is still sparse for Acts 2 / 4 / 6 — the same rooms got acts 1, 3, 5, 7 first.
2. `npc_line` variants for Voltari, Mechronis characters, and the Dreamer have no entries yet.
3. `journal` only has 5 pages; the full arc wants 1 page per major beat.
4. `wheel_followup` has 8 entries; every major wheel choice in Acts 2–7 wants its own.

**Cross-game beats — wire the contract.** The registry is shaped and seeded (9 threads, 29 beats across the 3 games). Still missing:
1. The server-side `/api/cross-game-thread/emit` endpoint. `docs/design/AUTHORING_CROSS_GAME_THREADS.md` documents the contract but does not implement it.
2. Consumer hooks in each game. Loredex has none; Cades FPS and DMC live in sibling repos and will need their own PRs.

**UI wiring for the new overlays.** `ActNOpponentTauntOverlay` exists and compiles; no caller is wired to it yet. The Act 1 ladder page is the reference — Acts 3, 4, 6, 7 each want their own ladder surface that mounts the overlay with the correct `sourceAct` and per-phase trigger.

**Schema additions the audit flagged but didn't prescribe:**
- A `CompanionAskTopic.requiredMorality` gate (the lattice would then surface morality-appropriate topic sets).
- A `systemTutor.revisitText` field so tutors can re-teach after a long absence (the prelude tutors were single-fire).
- `OpponentTauntHooks.emotionalTone` so the overlay can colour-shift within an act (Act 4 Path C needs colder mids than Path A's).

These are out of scope for this sprint but worth opening as follow-up issues.

## How to extend from here

- **Adding a new Ask topic:** append to `COMPANION_ASK_TOPICS` in `companionAskTopics.ts`. Test will enforce per-act coverage and speaker balance automatically.
- **Adding a new opponent for an existing Act (3/4/6/7):** add to the act's list in `acts2to7Opponents.ts`, then add the dialog table in the act's dialog file. Tests will fail if you forget the dialog.
- **Adding a new Act 2–7 system:** add the tutor definition to `acts2to7SystemTutors.ts`. Test will check per-act coverage and flag uniqueness.
- **Adding a variant:** append to `VARIANT_REGISTRY` in `moralityTrustActVariants.ts`. Ids must be globally unique; trust-gated entries must specify `trustCompanionId`.
- **Adding a cross-game beat:** append to the relevant thread's `beats` array (or add a new thread). The `emittedBy` must appear in the thread's `participatingGames`.

## One thing worth knowing

The `alternateAnswers` pattern on `CompanionAskTopic` is the primitive for "this topic's answer evolves with the story." If you find yourself wanting to write `ask_elara_vox_act3_variant` as a separate topic, you almost certainly want an alternate on the existing `ask_elara_vox` instead — the panel and lattice both resolve alternates automatically. Check for the primitive before spinning up a new topic id.
