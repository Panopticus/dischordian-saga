# Adversarial QA / Soft-Lock — Audit

## Persona briefing

A completionist player opens every available investigation on the Cases page,
plays acts in order, reloads/closes the tab mid-cutscene, and queues for PvP at
off-peak hours. They expect every case the game offers them to be finishable and
every interrupted beat to resume. This audit ignores flavor and ship:check
parity (covered elsewhere) and hunts only for state-machine dead-ends: gates
whose unlock can never be satisfied, flags consumed but never produced, and
content the UI offers but the data cannot complete.

Note: `node_modules` is absent in this environment, so `pnpm ship:check`,
`pnpm test`, and the dev server could not be executed. All verdicts below are
from source reading plus the three repo audit scripts (`_audit-room-mystery-
reachability.mjs`, `_audit-mystery-binding-integrity.mjs`,
`_audit-room-verb-coverage.mjs`), which run on stock Node and were executed.

## Files audited

- `apps/shared/tcg-core/rewards/expansionUnlockService.ts` (1-252) — unlock-condition evaluator
- `apps/shared/episodeMysteries.ts` (686-8123) — all 16 mystery arcs, deduction graphs, `MYSTERY_DEFINITIONS`
- `apps/server/services/mysteryService.ts` (1-573) — `recordEvidence`, `gradeDeduction`, `submitDeduction`, episode advance, `submitChoice` flag write
- `apps/server/services/mysteryRegistry.ts` (1-91) — static/dynamic lookup
- `apps/server/routers/mysteries.ts` (40-218) — `listAvailable`, `openCase`, `recordEvidence`, `submitDeduction`
- `apps/client/src/components/DeductionPanel.tsx` (1-237) — clue picker restricted to found evidence
- `apps/shared/roomMysteries/*.ts` (28 modules) — `mysteryBinding` clue surfaces
- `apps/client/src/lib/tutorialOrchestrator.ts` (1-276) + `apps/client/src/hooks/useTutorialOrchestrator.ts` (1-251) — FTUE one-shot guards + persistence
- `apps/shared/act2CompletionGate.ts` (1-84) — Act 2 four-flag gate
- `apps/client/src/pages/GameMastersArenaAct2Page.tsx` (80-269) — `game_master_loss` producer
- `apps/shared/songSlideshows.ts` (268-289) + `apps/client/src/hooks/useNarrativeIntegration.ts` (196-280, 915-933) — slideshow trigger/interrupt logic
- `apps/server/pvpWs.ts` (44-94, 173, 700-789) + `apps/client/src/pages/PvpArenaPage.tsx` (1169-1192) — matchmaking bot fallback

## Findings

### 1. [P0] Ten of sixteen mystery arcs are uncompletable from episode 1 — zero clues bound to any room

- **File:** `apps/shared/episodeMysteries.ts` (arcs at L4361 watcher, L5034 ith_rael, L5411 necromancer, L5763 syl_vex, L6150 collector, L6551 politician, L6930 zyr_koth, L7306 riri_ahlia, L7683 varkul, L8062 fenra; all enrolled in `MYSTERY_DEFINITIONS` L8081-8080+) vs `apps/shared/roomMysteries/*.ts` (no `mysteryBinding.cluesFound` entry for any of these arcs); gated by `apps/client/src/components/DeductionPanel.tsx:87-88,127,136`.
- **Defect class:** Consumed-but-never-produced — every progression-critical deduction (`unlocksEpisode`) for these arcs requires authored clue ids that NO room hotspot's `mysteryBinding` surfaces. Clues only enter `mysteryEvidence` via room `mysteryBinding` → `mysteries.recordEvidence` (mysteryService.ts:183-204). `DeductionPanel` only lets the player select from `foundClueIds` (clues actually recorded). `gradeDeduction` (mysteryService.ts:74-89) only advances the episode when the edge's clues match — clues the player can never collect. So the case opens onto episode 1 and the panel permanently renders "Find at least two clues to start pairing" (DeductionPanel.tsx:98-110). `_audit-mystery-binding-integrity.mjs` confirms 0 watcher/necromancer/etc. clues bound; grep across the entire repo for `watcher.e1.antiquarian_record`, `necromancer.e1.castle_log` etc. returns only `episodeMysteries.ts` (the author side) — zero binding side anywhere.
- **Repro:** Open Cases page → it lists all 16 arcs (`mysteries.listAvailable` returns `MYSTERY_DEFINITIONS` verbatim, mysteries.ts:50-61) → click "The Watcher" (or Necromancer / Syl Vex / Collector / Politician / Zyr Koth / Riri Ahlia / Varkul / Fenra / Ith-Rael) → `openCase` succeeds, player placed on `<arc>.e1` → explore every room: no hotspot ever fires a binding for this arc → DeductionPanel shows the empty-state message forever → case can never advance past episode 1. Ten advertised multi-episode arcs are dead on arrival.
- **real?** Confirmed (read source + two cross-check audit scripts + repo-wide grep). Sanity-checked against the 6 working arcs (wraith/jericho have all 4 e1 clues bound in `roomMysteries/`), so the methodology is sound and the gap is real, not a parser artifact.

### 2. [P2] FTUE progress is localStorage-only — not account-bound; resets per device/browser

- **File:** `apps/client/src/hooks/useTutorialOrchestrator.ts:22-60,116-121` (`FTUE_FLAGS_STORAGE_KEY`, `FTUE_SKIPPED_KEY` written/read only via `localStorage`); `apps/client/src/lib/tutorialOrchestrator.ts:148-157` (orchestrator state in-memory).
- **Defect class:** Persistence-layer drift — FTUE completion/skip never round-trips to the server (`userProgress.gameData`). `welcome` is `skippable:false` + `trigger:"auto"` (tutorialOrchestrator.ts:36-43), so `skipAll()` (L198-206) does NOT mark `tutorial_welcome` complete.
- **Repro:** Player completes/skips FTUE on desktop → logs in on phone or clears site data → `loadPersistedFlags()` returns empty, `loadSkippedState()` false → mandatory `awakening_intro` "welcome" tutorial re-fires. The `dismissActive()` snooze (useTutorialOrchestrator.ts:227-229) clears `activeStep` without completing, so an auto/non-skippable step re-prompts on the next `checkTutorial`.
- **real?** Confirmed (read source). Recoverable annoyance, not a soft-lock: tutorials are replayable and `skippedAll` gates `getNextTutorial`/`isInFTUE`. Severity P2 — repeated forced replay across devices, no stuck state.

### 3. [P3] PvP "Practice vs AI" fallback navigates away without leaving the matchmaking queue

- **File:** `apps/client/src/pages/PvpArenaPage.tsx:1179-1184` (`onClick={() => navigate("/act1-ladder")}`, no `handleLeaveQueue()` call) vs `apps/server/pvpWs.ts:711-712` (queue splice only on socket disconnect cleanup).
- **Defect class:** Orphaned queue entry. The bot fallback is purely a client route change to the single-player ladder; there is no `ACCEPT_BOT`/`START_BOT` message type in `ClientMessageSchema` (pvpWs.ts:45-62), so no double-match race exists. But clicking "PRACTICE VS AI" does not send `LEAVE_QUEUE`; the player stays in `matchmakingQueue` until the WS closes.
- **Repro:** Queue solo → wait 45s → `BOT_FALLBACK_OFFER` → click "PRACTICE VS AI" → routed to `/act1-ladder`. If the PvP WebSocket survives the route change (SPA, shared socket), the player can be matched into a real PvP game they will instantly forfeit while playing the AI ladder; if the socket closes on unmount the disconnect-cleanup splice (pvpWs.ts:711-712) handles it cleanly.
- **real?** Suspected (needs runtime check) — outcome depends on whether the PvP WS unmounts with the page; the disconnect path likely saves it. Theoretical, P3.

### Cleared (investigated, NOT defects)

- **Act completion gate chain** (`act2CompletionGate.ts`): all four sub-flags (`crafting_mastered`, `chess_mastered`, `thaloria_cinematic_seen`, `game_master_loss`) have producers; `game_master_loss` has an explicit "Record loss (for story)" button (`GameMastersArenaAct2Page.tsx:240-247`) plus a WitnessingHub fallback panel — no lose-required dead-end.
- **Last Words / cutscene interrupt** (`useNarrativeIntegration.ts:921-933`): `slideshowFiredRef` is a per-session `useRef`; on reload with `act_1_complete` set but `slideshow_last_words_complete` unset, the slideshow correctly **re-fires**. Interrupt-safe by design.
- **Room-mystery reachability / verb coverage:** `_audit-room-mystery-reachability.mjs` = 89/89 (100%); `_audit-room-verb-coverage.mjs` = 262/267 (98%, the 5 gaps are missing USE verbs on 3 rooms — degraded interaction, not a blocked path). Orphan bindings reported by `_audit-mystery-binding-integrity.mjs` (e.g. `jericho.e3.lionism_imprint_protocol` bound in jericho.e1) are benign cross-episode *pre-seeding* — `recordEvidence` is episode-agnostic and `gradeDeduction` keys on clue id, so early-surfaced clues help rather than strand.

## Top concern

Finding 1: ten of sixteen mystery arcs are advertised on the Cases page and openable, but have zero clues bound to any room — the case dead-ends on episode 1 with a permanently empty deduction panel (confirmed P0).
