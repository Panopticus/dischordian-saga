# Audit 2026-05-16 — Integration & Playability Tracker

Aggregated findings from the four perspective audits in this directory,
severity-sorted, with cross-perspective clusters called out. Future sprints
pick gaps off this list one at a time; mark `[x]` and strike through when a
follow-up PR closes one — do not delete history.

## At a glance

- **Total actionable findings:** 22 (+3 informational)
- **By severity:** P0 ×4 · P1 ×9 · P2 ×6 · P3 ×3
- **Doc-only sprint:** zero source files touched. The four P0s are all
  ship-check-shaped (declared contract, no honoring runtime, no parity row).

## P0 — blocks ship / unrecoverable

- [ ] **10/16 mystery arcs uncompletable from episode 1** — QA F1 — `apps/shared/episodeMysteries.ts` (watcher/ith_rael/necromancer/syl_vex/collector/politician/zyr_koth/riri_ahlia/varkul/fenra) vs `apps/shared/roomMysteries/*.ts` — arcs enrolled in `MYSTERY_DEFINITIONS` and openable via `mysteries.openCase`, but **zero** of their authored clues are surfaced by any room `mysteryBinding`; `DeductionPanel.tsx:87-88` restricts the picker to found clues, so the case opens onto a permanently empty deduction panel. Confirmed (source + 2 audit scripts + repo-wide grep; validated against the 6 working arcs). **Fix:** bind every progression-critical e1 clue to a room hotspot; add a parity check (arc clue ids ⊆ bound clue ids) to `_completeness/registry.ts`.
- [ ] **`saveProgress` clobbers the whole gameData blob, racing server writes** — Persist F3 — `apps/server/routers.ts:368-412` — client autosave blindly overwrites the typeless `userProgress.gameData` while `entitlementService.setEntitlement` / `mysteryService` do server-side read-modify-write on the same blob. An autosave landing after a Stripe entitlement grant permanently erases paid Founding-Author / Authors-Edition entitlements; `setEntitlement`'s no-op short-circuit means webhook retries don't repair it. Unrecoverable, undetectable, reachable in normal play. **Fix:** field-scoped JSON_SET writes (not whole-blob replace) + version the blob + make `setEntitlement` repair-on-retry.
- [ ] **Warm/confidant Elara variants fire after the Act 4 Path C betrayal** — Continuity F1 — `apps/shared/companionComments.ts:319` ("That is not forgiveness. It is training.") vs `apps/shared/moralityTrustActVariants.ts:509-518` & `:434-442` — `gatesMatch` (`:264-285`) supports only positive `requiredFlags`; no module decrements `elaraTrustLevel` on `act4_pathC_complete`/`act4_broken_trust`, so a player who was warm with Elara then betrays her is told in Act 5/6 that she's leaving them poetry and marked books. Structurally guaranteed for the headline betrayal route. **Fix:** add `forbiddenFlags` to the variant type + enforce in `gatesMatch` (or decrement trust on the Path C flag) + a branching-contract test.
- [ ] **`dailyQuests.updateProgress` is client-trusted, uncapped, no event proof** — Balance F1 — `apps/server/routers/dailyQuests.ts:405-475` (`increment: z.number().min(1)`, no `.max()`) — only caller is the procedure itself; a scripted client posts a large increment then `claimReward` to mint ~1,000+ Dream + ~85,000 Credits per reset with zero gameplay, into the entire reward economy. **Fix:** server-side event attribution for quest progress (no client-asserted increments) + hard `.max()` + rate limit + ship-check row for client-trusted economic procedures.

## P1 — degrades the core loop / will bite on next change

- [ ] **Replay "version pinning" is documentation-only** — Persist F1 — `engine/version.ts:9-21` documents the contract; `replay/replay.ts:86-137` computes `versionCompatible` then unconditionally replays through the live `reduce`; `replayVerification.ts:79-198` never reads `rulesVersion` at all. No pinned historical engine exists; **no `replay determinism` row in the ship-check registry** despite CLAUDE.md listing it. A MINOR RULES_VERSION bump silently desyncs every prior replay. **Fix:** add the parity row first (makes the gap mechanical), then either pin engines or gate execution on `versionCompatible`.
- [ ] **`battlePass.addXpFromAction` declared caps never enforced** — Balance F2 — same client-trust class as F1; declared `dailyCap`s are not enforced and there's no rate limit → unbounded pass XP.
- [ ] **Dream↔Credits exchange hard-codes 1:1 with a [0.5,2.0] band** — Balance F4 — `marketplace.ts:852-853` — treats cash-equivalent Dream ($5.99 = 500 Dream) and bulk-grind Credits (login alone 500–5,000/day) as peers; routine Credit farming arbitrages into hard-currency-equivalent Dream at up to 2:1, dissolving the hard/soft split the store rests on.
- [ ] **`battlePass.generateSeason` has no admin guard** — Balance F? — any player can reset the live season.
- [ ] **Casino currency deduction is TOCTOU** — Persist F4 — read-check-then-unconditional-write (vs `store.ts`'s correct conditional UPDATE), backstopped only by a CHECK constraint that silently no-ops on MySQL <8.0.16.
- [ ] **Schema-compensating bootstraps are fire-and-forget, post-`listen()`** — Persist F5 — ~30 bootstrap IIFEs run after `server.listen()`; requests can hit pre-bootstrap schema.
- [ ] **Bootstrap failures swallowed to log-only** — Persist F6 — a failed schema compensation does not fail the boot; the server serves a broken schema silently.
- [ ] **`gameData` has zero versioning anywhere** — Persist F7 — no schema version on the save blob; any shape change is an undetected silent migration. (Root enabler of F3.)
- [ ] **`act4_broken_trust` honored once then dropped** — Continuity F2 — `moralityTrustActVariants.ts:423-432` is the only flag-gated variant; all Act 5+ relationship variants omit it, so Path A and Path C reconverge to one warm continuity. Choice promised to matter, doesn't.

## P2 — fragile / tuning / polish

- [ ] **FTUE progress is localStorage-only, not account-bound** — QA F2 — `useTutorialOrchestrator.ts:22-60` — re-fires mandatory welcome tutorial across devices / cache clears. Recoverable, no stuck state.
- [ ] **"Economic surfaces transactional" ship-check is file-level not procedure-level** — Persist F8 — false PASS 13/13; the gate cannot see an untransacted economic procedure inside a "covered" file.
- [ ] **Pack opening uses unseeded `Math.random()`** — Persist F9 — not reproducible/auditable.
- [ ] **Pack pity distribution undisclosed** — Balance — pity exists but its curve is not surfaced to players.
- [ ] **`KEYWORD_TAX = 0` + wide tolerances make the stat-budget ratchet blind** — Balance — the budget check cannot catch a dominant card via ability power or keyword stacking; structurally blind, not just untuned.
- [ ] **Store-SKU parity claimed in CLAUDE.md but absent from the registry** — Balance F7 — the gate does not actually cover web/iOS/Android SKU parity.

## P3 — theoretical / doc-only

- [ ] **PvP "Practice vs AI" navigates away without leaving the queue** — QA F3 — `PvpArenaPage.tsx:1179-1184` — orphaned queue entry unless socket-disconnect cleanup saves it (likely does). Suspected, needs runtime check.
- [ ] **Akai Shi "killed at Thaloria" vs alive as Red Death** — Continuity F3 — reconciled by `LORE_BIBLE.md:747` (resurrection is canon); the Necromancer suspect graph just lacks an inline breadcrumb. Doc-clarity only, not player-facing.
- [ ] **(QA cleared items)** — Act-completion gate chain, cutscene-interrupt resume, room reachability (89/89), verb coverage (262/267) all checked clean — see 01_adversarial_qa.md §Cleared.

## Informational (healthy systems / context, no action)

- Drift *tracking* is internally consistent (Persist F10) — the risk is the runtime compensation, not untracked drift.
- PvE spine has no unbeatable wall — every gate resolves both ways or is a scripted loss (Balance).
- Casino is a closed net-Dream **sink**, not a faucet into the wider economy (Balance).

## Cross-perspective clusters

1. **"Declared but not wired" (all four P0s + Persist F1, Balance F7).** The
   single highest-value theme. Mystery arcs, the betrayal flag, replay pinning,
   and store-SKU parity are each a contract with no honoring runtime *and no
   ship-check row*. The cheapest systemic fix is a parity row per contract —
   that converts every one of these from "Claude inferred it from structure"
   into a mechanical check, exactly as CLAUDE.md's ship-check rationale intends.
2. **Client-trusted economic writes (Balance F1, F2; Persist F3, F4).** Quest
   progress, battle-pass XP, the save blob, and casino deduction all trust the
   client or race themselves. One hardening pass (server-side event
   attribution + conditional/atomic writes + a "no client-asserted economic
   delta" parity check) closes the cluster.
3. **Save-blob fragility (Persist F3, F7; QA F2).** No versioning, whole-blob
   overwrite, and localStorage-only FTUE are the same root: persistence has no
   schema discipline. Fix F7 (versioning) first; it de-risks F3.

## Suggested sequencing toward "wired, playable, fun, cohesive"

1. **Mystery clue bindings (QA F1)** — biggest playable-content unlock; 10
   advertised arcs go from dead to completable.
2. **Save-blob versioning + scoped writes (Persist F7 → F3)** — stops silent
   loss of paid entitlements and progression.
3. **`forbiddenFlags` + trust decrement (Continuity F1/F2)** — makes the
   headline branch narratively coherent.
4. **Client-trust hardening pass (Balance F1/F2, Persist F4)** — closes the
   economy exploits before any wider release.
5. **Add the missing parity rows (Persist F1, Balance F7)** — so these classes
   cannot silently regress again.
