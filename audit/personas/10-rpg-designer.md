# RPG / Systems Designer — Audit

Lane: progression integrity, companion arcs, flag bridges, unlock gating, system cohesion. Off-limits: voice/tone, card balance, economy. Ship-check note: `tcg.narrative_flag_bridge_coverage` is at ratchet target 0 (PASS) — all 14 `act_N_complete`/`secret_act_N_revealed` writers exist in `useNarrativeIntegration.ts`. The "0" in the brief refers to the ratchet ceiling, not implementation; the bridge itself is shipped.

## Top 6 findings

### F1: 3,464 LOC of authored morality/trust/act variants have no shipping consumer
- file: /home/user/dischordian-saga/apps/shared/moralityTrustActVariants.ts:154
- severity: high
- category: dangling_state
- finding: `VARIANT_REGISTRY` (~hundreds of entries, every one carrying morality/trust/act gates and `requiredFlags`) is imported only by DevVariantsPage.tsx and the contract tests. No Act1..Act7 page calls `resolveVariant(VARIANT_REGISTRY, ...)`. The `MechanicTutorialOverlay`'s `resolveVariant` is a same-named export from `apprenticeChanneledLines.ts`, unrelated. The `actBranchingContract.test.ts` enforces that authors *write* a downstream variant per fork flag, but nothing renders them. Player-visible morality/trust branching is therefore the empty set.
- fix: wire `resolveVariant(VARIANT_REGISTRY, ...)` into the room overlay / transmission / journal surfaces named in the registry's `surface` union, or move the file to `_unused/` and delete the contract test until a renderer ships.

### F2: Trust band gating is unreachable — no Act page reads `companionStats[].trust`
- file: /home/user/dischordian-saga/apps/shared/moralityTrustActVariants.ts:107 (gate logic) vs apps/client/src/pages/Act*.tsx (zero consumers)
- severity: high
- category: choice_illusion
- finding: `bandForTrust(trust)` and the `trustCompanionId` gating exist on every variant, but no Act page (nor any consumer) passes `trustByCompanion` into a resolver. Trust deltas are written by `companion.ts` and `romanceLadderService` yet never *read* by the act surfaces that promise reactive scenes. Companions sprawl across 52 VO manifests with arc-cohesive lines, but the runtime never asks "is this companion warm/cold right now?" before picking a line.
- fix: thread `state.companionStats` into the variant resolver call site once F1 lands; add a contract test that at least one `trust !== "any"` variant fires per act in integration.

### F3: Act3 path flags branch only Act6/Act7 cosmetic suffix, not gameplay
- file: /home/user/dischordian-saga/apps/client/src/pages/Act6CardLadderPage.tsx, Act7CardLadderPage.tsx
- severity: medium
- category: choice_illusion
- finding: Act6/Act7 read `act1_path_A`, `act3_full_secret`, `act3_partial_share` only to pick a `pathSuffix` string for VO line ids. No deck composition, no opponent change, no reward delta. `act4OpponentDialog.ts` is the lone gameplay branch. Players who walked transparent vs full-secret get different *flavor lines*, not different runs.
- fix: route at least one mechanical consequence per fork — opponent deck, reward pool, or unlock — through `act3_path_*_chosen`. Add a parity check next to `actBranchingContract.test.ts` for "≥1 mechanical consumer per fork flag."

### F4: Mystery arc registry (3,763 LOC) is producer-heavy, consumer-thin
- file: /home/user/dischordian-saga/apps/shared/episodeMysteries.ts:3731
- severity: medium
- category: system_sprawl
- finding: 6 arcs × ~5 episodes each; every episode declares `contentBundle` (songId, slideshowId, loredexUnlocks, conspiracyDiscoveries) and `unlocksEpisode` chains. `mysteryService.ts` exists, but `cross_arc_*` choices (e.g. `degen.e5.c.bring_brel_to_the_table`) reference state from other arc episodes — there's no test that the cross-arc state is actually persisted/readable. Risk: cross-arc choices silently no-op when the dependency arc is uncompleted.
- fix: add a `crossArcReachability.test.ts` enumerating every `cross_arc_*` choice weight and asserting the upstream episode's flag has a writer.

### F5: apprenticeTrial / essenceHarvest are isolated mini-systems
- file: /home/user/dischordian-saga/apps/server/routers/apprenticeTrial.ts:15, /home/user/dischordian-saga/apps/server/routers/essenceHarvest.ts
- severity: low
- category: system_sprawl
- finding: apprenticeTrial only writes a completion row + grants titles via `awardEligibleTitles`. essenceHarvest is called from `fightLeaderboard.recordMatch` and otherwise stands alone — no narrative flag, no Act gate, no morality delta. Both work, but neither feeds the 7-act spine. classMastery + battlePass *do* integrate via `getPrestigeMultiplier` (battlePass.ts, civilSkillHelper.ts, classMasteryHelper.ts) — that triple is healthy.
- fix: either grant a `narrativeFlag` on apprentice graduation that variants can read (closes F1 simultaneously), or accept these as side-content and document as such.

### F6: Romance exclusivity uses sticky flags but lives outside the variant registry
- file: /home/user/dischordian-saga/apps/server/routers/romance.ts:75 (commitExclusivity)
- severity: low
- category: flag_orphan
- finding: `commitExclusivity` writes a sticky committed flag and `ended` flags for broken-off partners — exactly the kind of state `VARIANT_REGISTRY` was designed to consume. Yet no `requiredFlags: ["romance_committed_<npc>"]` entries exist (grep on registry: zero romance flags). Five-ladder romance system is gameplay-real but invisible to the act-level dialog layer.
- fix: author one variant per (committed-NPC × act ≥ stage-3) pair; the schema already supports `requiredFlags`.

## Flag producer/consumer table (top 5 worst gaps)
| Flag | Producers | Consumers | Status |
|---|---|---|---|
| All `requiredFlags:` in VARIANT_REGISTRY (~50 unique act flags) | useNarrativeIntegration.ts, Act*CardLadderPage.tsx, act6StanceBridge | DevVariantsPage only (no production page) | orphan_consumer_side |
| `act3_path_*_chosen` | Act3 page setters | Act6/Act7 cosmetic suffix only; act4OpponentDialog opponent pick | partial — flavor-only |
| `companionStats[*].trust` band | companion.ts, romance services | zero Act-page consumers | orphan |
| `romance_committed_*`, romance ended flags | romance.ts:commitExclusivity | none in VARIANT_REGISTRY | orphan |
| `cross_arc_*` mystery weights | episodeMysteries choice authoring | mysteryService — unverified persistence | unverified |

## System inventory triage
- morality: **partial** — score persists, UI meter reads it, marketplace + companion + classMastery read it, but Act-page narrative branching does not.
- mystery: **partial** — `mysteryService.ts` + `mysteries` router shipped; cross-arc choice consumption unverified.
- prestige: **integrated** — measure helper, narrative service, multiplier wired into battlePass + classMastery + civilSkill XP.
- classMastery: **integrated** — XP grants apply prestige multiplier; perks unlock per rank.
- battlePass: **integrated** — XP path applies prestige multiplier; feature-flag gated.
- romance: **partial** — five ladders work end-to-end on the server; act-layer consumers absent.
- apprenticeTrial: **orphan** — completion row + titles, no narrative tie-in.

## Convergence hints
The largest cohesive failure is the gap between authoring (3,464 + 3,763 LOC of variant/mystery content + the contract test enforcing authors write reactive trios) and rendering (no Act page calls the variant resolver, no trust-band feed, no romance-flag entries). The ratchet system caught the *bridge* (act_N_complete writers) but not the *consumer* side: there is no parity check that "every fork flag has ≥1 page that reads it for non-cosmetic effect." Adding that single check would expose F1–F3 mechanically. Recommend: a `narrativeFlagConsumerCoverage` ship-check entry, classification "RATCHET" at landing.
