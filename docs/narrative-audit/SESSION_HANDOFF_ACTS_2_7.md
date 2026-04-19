# Session handoff — Acts 2–7 authoring sprint

_Covers branch `claude/write-narrative-acts-El8yv` through commit `5daee3b`._
_Companion to `ACTS_2_7_COMPLETENESS_AUDIT.md` — read that first._

## Status vs. the audit's five recommendations

| # | Item | State |
|---|---|---|
| 1 | Per-opponent dialog tables for Acts 3, 4, 6, 7 | ✅ shipped |
| 2 | Reactive companion comments for Act 2–7 moments | ✅ shipped |
| 3 | `alternateAnswers` schema on `CompanionAskTopic` + first use | ✅ shipped |
| 4 | System tutors for Acts 2+ | ✅ shipped |
| 5 | Cross-act Ask topic lattice | ✅ shipped |

Plus the two Tier 4 items that were "first authoring pass" only at last
handoff: morality/trust/act variants are now at **289 entries** across
all 5 surfaces and all 7 acts; cross-game threads have **9 threads, 29
beats**, with all 11 Loredex-originating beats wired to canonical hook
points end-to-end (server router + client helper + hook calls).

## Status vs. the previous handoff's "what remains"

| Item | State |
|---|---|
| Editorial pass on Act 4 Path C / Act 6 Detective / Act 7 finale | Acts 4 + 6 done; Act 7 explicitly deferred to post-cinematic |
| Variant registry — more volume | 92 → **289** entries (3.1× the prior pass) |
| Cross-game beats — server endpoint | ✅ shipped, 8 router tests |
| Cross-game beats — Loredex client consumers | ✅ all 11 Loredex-side beats wired |
| UI wiring for the new overlays | ✅ Act 1 ladder switched to generalized overlay |
| Bridge nav entries for new act pages | ✅ shipped |

Nothing on the prior remainder list is open.

## Artifacts, in commit order (current branch)

### Original sprint (handoff 1, through `6255884`)
1. `23b47a1` — `alternateAnswers` schema + `resolveAskAnswer()`.
2. `ed46810` — `acts2to7Opponents.ts`: 12 opponents across Acts 3/4/6/7.
3. `d93dba9` — `act3OpponentDialog.ts`: 3 substrate-gate opponents.
4. `6b72ce4` — `act4OpponentDialog.ts`: 3 path-gated battles + `resolveAct4Dialog`.
5. `71dbe08` — `act6OpponentDialog.ts`: 2 confession-side mirrors.
6. `28647f3` — `act7OpponentDialog.ts`: 4 finale matches + `frameSpeaker` tag.
7. `faec8f2` — `companionComments.ts`: 30 entries on 20 Act 2–7 triggers.
8. `e67252a` — `companionAskTopics.ts`: 21 new topics across all 6 acts.
9. `3427f55` — `acts2to7SystemTutors.ts`: 6 tutors + `kael_log` speaker type.
10. `941c7f1` — Variant pass 1: 3 → 47.
11. `0b00e45` — Cross-game pass 1: 3 → 9 threads, 20 new beats.
12. `d62ad43` — `companionAskLattice.ts` + `CompanionAskPanel` alternateAnswers wiring.
13. `b128406` — Variant pass 2: 47 → 92.
14. `6255884` — `actOpponentTaunts.ts` adapter + `ActNOpponentTauntOverlay`.

### Sprint continuation (handoff 2, through `5daee3b`)
15. `1ff5354` — Earlier handoff doc.
16. `6952cf6` / `d6990d0` / `df18e8d` — Variant pass 3a/b/c: 92 → 127. Room gap fills, Voltari/Mechronis/Dreamer NPC lines, journals + wheel followups.
17. `82dd391` — Editorial tightening: Act 4 Path C + Act 6 Detective.
18. `cc5658c` — `crossGameThreadsRouter.ts` server tRPC endpoint (emit / status / listThreads). 8 tests.
19. `c247fec` — Act 1 ladder page switched to generalized `ActNOpponentTauntOverlay`.
20. `ba8ea99` / `7dc2af9` / `ce37125` — Variant pass 4a/b/c: 127 → 200. Machine-band rooms, more NPC lines/transmissions, journal + wheel followup completeness.
21. `15b50b4` — Variant pass 5: 200 → 229. Trust × morality cross-gated entries.
22. `ece3665` — `crossGameBeats.ts` client helper + 7 tests.
23. `2a8fa1d` — Top-level `initCrossGameBeats()` + 3 Act 1 ladder emits.
24. `7416f12` — Act 3 ladder page + store + route + Substrate Warden emit.
25. `0e31930` — Act 6 ladder page + store + route + confession comments.
26. `0263555` — Act 7 ladder page + store + route + 2 finale emits.
27. `7fbff39` — Act 4 single-match page + store + route + Path C emit.
28. `fad3e41` — Last 3 Loredex emits wired (Cycle C alignment, first recruit, gallery memorial card).
29. `09b3923` — Variant pass 6: 229 → 259. 4-gate trust × morality × flag entries.
30. `8fb6225` — Witnessing Hub bridge links to Act 3/4/6/7 routes.
31. `b9bfc3f` — Variant pass 7: 259 → 289. Balanced-morality entries.
32. `0833182` — `/dev/variants` QA harness + 7 contract tests.
33. `0c13cf6` — `CrossGameThreadsPage`: player-facing thread browser + Hub link (Act 5+).
34. `08c0716` — Act 2 interlude page (Whisper, dual-channel) + Hub link.
35. `5daee3b` — Act 5 interlude page (Map, five sectors) + Hub link.

## Test suite

- **2610 tests passing** (handoff 1: 2548 → handoff 2: 2610, +62).
- `pnpm check` — clean.

## Coverage milestones

| Surface | Count | Notes |
|---|---|---|
| Variants | **289** | 96× the seed count; all 5 surfaces, all 7 acts; balanced + machine + humanity bands all populated |
| Cross-game threads | 9 threads, 29 beats | 11 Loredex-originating beats wired to canonical hooks |
| Per-act ladder/match pages | 7 (Acts 1, 2, 3, 4, 5, 6, 7) | Full set: ladders for combat acts, interludes for narrative acts |
| Bridge nav entries | 6 | Act 1 always; Acts 2/3/4/5/6/7 gated by narrativeAct; cross-game thread browser at Act 5+ |
| Server tRPC routers | +1 (crossGameThreads) | 8 router tests |
| Client helpers | +1 (crossGameBeats) | 7 helper tests |
| Dev tools | `/dev/variants` | 7 contract tests |

## Routes added this branch

| Route | Purpose | Gate |
|---|---|---|
| `/act2-interlude` | Whisper interlude (dual-channel tutor) | narrativeAct ≥ 2 |
| `/act3-ladder` | Substrate gates (3 opponents) | narrativeAct ≥ 3 |
| `/act4-match` | Single path-resolved match (A/B/C) | narrativeAct ≥ 4 |
| `/act5-interlude` | Map + five-sector reveal (Kael's voice) | narrativeAct ≥ 5 |
| `/act6-ladder` | Confession mirrors (2 opponents) | narrativeAct ≥ 6 |
| `/act7-ladder` | Convergence finale (4 opponents) | narrativeAct ≥ 7 |
| `/cross-game-threads` | Transmedia thread browser | narrativeAct ≥ 5 |
| `/dev/variants` | Variant resolver QA harness | URL-only, not linked |

## What remains (genuinely external now)

The Loredex-side scaffolding is structurally complete. Remaining work
sits outside this repo or requires assets that aren't ready:

1. **Cades FPS implementation** of its emit side (Iron Lion greeting,
   memorial reading, Watcher weather suppression, Kael-descendant NPC,
   substrate whisper, Last Words radio fragment). The server contract
   accepts `emittedBy: "cades_fps"`; the receiving wires in Loredex
   are already listening.
2. **Dead Man's Circuit implementation** of its emit side
   (Programmer's Math puzzle solutions, Vox letter decoding, hidden
   substrate signature, telemetry suppression, closing motif). Same
   contract; same receiving-side readiness.
3. **Act 7 Convergence Seat close-line editorial pass** — explicitly
   deferred until the finale cinematic locks. Lines authored; tone
   intentionally untouched in `82dd391`.
4. **Real-player QA** feeding back into variant tuning. The 289
   entries are first-pass authored; some will read better than others
   in actual play. The `/dev/variants` harness is the surface for
   triage.

If you want to keep pressing internally, options that still have
volume left:
- More variant entries (no specific gap; just more density)
- Storybook-style "variant in actual room chrome" preview pages
- Server-side load testing on `crossGameThreads.emit` under high
  concurrency
- Migration helper for old saves that pre-date the new flag set

## How to extend from here

- **Adding a new variant:** append to `VARIANT_REGISTRY` in
  `moralityTrustActVariants.ts`. Ids must be globally unique; trust-
  gated entries must specify `trustCompanionId`. Use `/dev/variants`
  to verify which player states it lands for.
- **Adding a new cross-game beat:** append to the relevant thread's
  `beats` array in `crossGameNarrativeThreads.ts` (or add a new
  thread). `emittedBy` must appear in `participatingGames`. Add the
  emit call at the canonical hook point in the relevant page/store.
- **Adding a new act page:** copy `Act3CardLadderPage.tsx` (linear
  ladder), `Act6CardLadderPage.tsx` (2-step), `Act7CardLadderPage.tsx`
  (4-step), or `Act4MatchPage.tsx` (flag-resolved single match) as
  a starting point. Each is ~500 lines of focused TSX.
- **Adding a new system tutor:** append to `acts2to7SystemTutors.ts`.
  The Act 2 + Act 5 interlude pages mount tutors via
  `getActsSystemTutor(systemId)` — the same pattern works for any
  future surface.

## One thing worth knowing

The cross-game emit contract is fully end-to-end: every Loredex-
originating beat fires automatically when the player hits the canonical
moment. Cades FPS and DMC can integrate by calling
`POST /trpc/crossGameThreads.emit` with their own `beatId` +
`emittedBy`. The server validates the beat against the canonical
registry and writes `xgame_<beatId>` onto the player's flag set; from
that point, every Loredex consumer that reads narrativeFlags sees the
cross-game state alongside its own. No special integration layer
needed — the flags ARE the integration.
