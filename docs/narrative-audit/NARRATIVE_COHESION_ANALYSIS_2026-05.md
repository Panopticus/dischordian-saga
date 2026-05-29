# Narrative Cohesion Analysis — Dischordian Saga / Loredex OS

_Date: 2026-05-29 · Scope: actually-shipped, runtime-reachable narrative content ·
Method: deep read with `file:line` quotes, cross-checked against `pnpm ship:check`._

> **Central question:** does the shipped game feel like **one massive world and one
> story**, and **do the player's choices matter?**
>
> **Verdict: YES on world cohesion (structurally enforced, gate-proven); QUALIFIED
> on choices-matter.** The connective tissue is real and mechanically defended —
> every game mode is bound to one story spine, canon is single-sourced or
> bridged, and 137/142 completeness gates PASS with 0 FAIL. Where the seams show
> is not *missing wiring* but *consequence depth*: many branches set a flag and a
> later line reads it, but the formal "this choice changed the world" ledger is
> still a 5-entry seed, and two late acts read fewer of their own early choices
> than the early acts do.

---

## Methodology & honesty notes

This analysis supersedes the step-count figures in
`ACTS_2_7_COMPLETENESS_AUDIT.md` (whose structural "Gaps" sections are stale —
the recommendations it lists shipped; see its own 2026-04 header). Every claim
below was read from source, not inferred from file structure. Three prior-pass
inaccuracies were caught and corrected here:

- The drift gate is `loreBibleDrift.ts`, **not** `loredexDriftTest.ts` (latter
  does not exist).
- The reactive identifier is `reactsToPublicFlag` + `{if <flag>}` dialog
  templating; `reactsToNarrativeFlag` **does not exist** in `apps/`.
- `act7Epilogues.ts` branches on stance + path A/B/C; the light/dark axis lives
  in `choiceOutcomeRegistry` flags + the §5.8 trial spec, **not** inside that file.

### ship:check baseline (run 2026-05-29)

```
ship:check OK  137 PASS, 5 RATCHET, 0 FAIL
```

All 5 RATCHET rows are **art-asset production** (composite sprite / room-art
coverage across Axes 9/11/12), not narrative wiring. Every narrative subsystem
is at hard parity:

| Narrative gate | Declared | Implemented | Status |
|---|---:|---:|---|
| Choice outcome consumers | 5 | 5 | PASS |
| Narrative→TCG flag bridge | 14 | 14 | PASS |
| Narrative spine coverage | 14 | 14 | PASS |
| Spine doorway coverage | 12 | 12 | PASS |
| Questline registry coverage | 24 | 24 | PASS |
| Game-mode narrative-premise coverage | 14 | 14 | PASS |
| trial_categories coverage | 1314 | 1314 | PASS |
| Surface discoverability | 204 | 204 | PASS |
| Companion roster / NPC dialogue / banter | — | — | PASS |
| Mystery roster / clue binding / foundIn parity | 10 / 233 / 596 | =  | PASS |

---

## Scoreboard — 12 lenses

| # | Lens | Score | One-line verdict |
|---|---|---|---|
| 1 | World Cohesion & Canon Consistency | **PASS** | Federated 3-registry canon bridged by one typed crosswalk + drift gate. |
| 2 | Narrative Throughline / The Spine | **PASS** | All 14 modes bound to one spine; orphans are a hard-parity failure. |
| 3 | Player Agency & Meaningful Choice | **PARTIAL** | Choices fire flags + branch rosters; formal outcome ledger is a 5-entry seed. |
| 4 | Branching Depth & Deferred Consequence | **PARTIAL** | Real early-write→late-read chains; thinner in Acts 6–7 opponent dialog. |
| 5 | Character Voice & Companion Arcs | **PASS** | Dual-narration + banded room narration; 143 act-reactive companion lines. |
| 6 | Ludonarrative Harmony | **PASS** | §5.8 trial: courtroom fiction *is* the card-play restriction. Engine matches doc. |
| 7 | Pacing, Structure & Gating | **PASS** | Real act-gates (rooms/level/missions); interludes are deliberate. |
| 8 | Conversation / Dialogue Design Craft | **PASS** | 19 NPC trees, trust/faction/flag/non-verbal channels, act-progressed answers. |
| 9 | Onboarding & Narrative Legibility | **PASS** | Every system has a diegetic tutor; "unlock toasts are never a carrier." |
| 10 | Environmental / Spatial Storytelling | **PASS** | 26 SCUMM-verb rooms; combine→flag→clue→unlock chains; banded narration. |
| 11 | Theme, Motif & Symbolic Coherence | **PASS** | The Witnessing thesis recurs in shipped data, not just the design doc. |
| 12 | Cross-Surface / Transmedia Continuity | **PARTIAL** | Receivers wired in-repo; emit sides (Cades/DMC) canonical but out-of-repo. |

**9 PASS · 3 PARTIAL · 0 GAP.** The world holds together; the partials are all
"deepen what exists," not "build what's missing."

---

## Per-lens findings

### 1 — World Cohesion & Canon Consistency — PASS

Canon is **deliberately federated, then bridged**, not naively single-sourced.
Three faction registries disagree by design and are reconciled by one typed
crosswalk:

> "The saga has three faction registries … Standing (5) · Card engine (9) ·
> Trade Empire (10) … None of the three agree on names or count."
> — `apps/shared/factionCrosswalk.ts:4-10`

The crosswalk's 11-member `CanonicalFactionId` is the cohesion mechanism, and
"every member of every registry must have a row here, even if mapping to null"
(`factionCrosswalk.ts:30-31`) — a ship-check parity contract.

The lore corpus *is* single-sourced: `docs/built/LORE_BIBLE.md` is generated from
`loredex-data.json` and a commit that diverges fails `lore.bible_drift`
(`loreBibleDrift.ts:25-40`; bible TOC: 136 characters / 211 concepts / 118 songs).
Identity naming is consistent across surfaces — "Prisoner 74" is canonized once
("Not Subject Zero. Prisoner 74. The number matters." — `broadcastLibrary.ts:40`)
and reused identically in story dialog and VO captions (53 matches).

### 2 — Narrative Throughline / The Spine — PASS

`gameModeNarrativePremises.ts` declares 14 premises; `narrativeSpine.ts` binds
each to **exactly one** beat, and orphaning is a hard failure:

> "every GAME_MODE_PREMISES id MUST be revealed by exactly one spine beat. A
> system not on the spine is orphaned from the story." — `narrativeSpine.ts:28-30`

`getNarrativeSpineDefects()` flags both 0-beat and >1-beat premises
(`:298-309`); the gate reads 14/14. Phase 14 ("Servant Hero Academy Era") is a
**deliberate** deferral, carries no spine beat, and `getNextPhase` returns null
there (`sagaPhases.ts:285-287, :368`) — consistent, not a dangling thread.

### 3 — Player Agency & Meaningful Choice — PARTIAL

Choices do real work, but the agency lives in **two different systems** and only
one is formally tracked. The `choiceOutcomeRegistry.ts` — the discoverable
"moments that matter" ledger the Campaign Ledger UI reads — is still its 5-entry
seed (forgiveness, lyra_vox, act1 closing, act7 light, act7 dark;
`choiceOutcomeRegistry.ts:96-142`). Its gate is honest about scale: it confirms
each entry's flag has a **producer** and is registered, not that anything reads
it (`choiceOutcomeConsumerParity.ts:36-42, 142-156`).

Meanwhile the *de facto* agency is much wider but lives in flag-gated rosters and
`{if}` templating outside the registry — e.g. whole Act-4/Act-6 battles gated on
Act-1/Act-3 decisions (`acts2to7Opponents.ts:124,140,157,179`). So choices
matter more than the ledger advertises; the seam is that the **player-facing
record** of consequence under-counts the real branching.

The strongest single proof choices matter: `act7Epilogues.ts:77` reads an Act-1
bridge lie three acts later — "You lied to her at the bridge … the lie does not
unwrite itself."

### 4 — Branching Depth & Deferred Consequence — PARTIAL

Genuine early-write → late-read chains exist. `forgiveness_choice_made` is set in
Act 1 (`ForgivenessChoicePanel.tsx:95`) and read in Act 3 opponent dialog
("You took the forgiveness across the doorway." — `act3OpponentDialog.ts:66`).
`lyra_vox_unlocked` (the forgive-neither path) selects a third narrator far later
(`mobileNarrator.ts:660`).

The gap is **distribution, not absence**: flag-reactive `{if}` templating appears
in Act-1 and Act-3 opponent dialog but **zero** times in Act-6/Act-7 opponent
dialog. The convergence's opponents don't yet read the choices that led the
player there — the late game is where deferred payoff matters most.

### 5 — Character Voice & Companion Arcs — PASS

Dual narration is structural: Elara (`elaraAct1.ts:25`) and The Human — "the
voice later revealed as Kael's contaminated whisper" (`humanAct1.ts:7`) — carry
parallel, distinct registers. Room narration is **banded** by hidden state
(`ElaraBandedText{fragmented,lucid,luminous}` / `HumanBandedText{shadow,balanced,
warm}` — `roomMysteries/_template.ts:62-79`). Reactive companion comments exist
for **every act 1–7** (counts read directly: 10/16/19/18/26/29/25), refuting the
stale audit's "missing" claims.

### 6 — Ludonarrative Harmony — PASS

The §5.8 Authority Trial is the standout: the courtroom fiction **is** the rule
set. `TrialCategory` maps to phases — evidence cards (turns 3–5) "write to a
persistent game-state flag that Acts 2+ can read"; confession cards (turn 7)
"damage the player's private scoring state in exchange for verdict-stream
benefit" and are drawn from the insurgency lean
(`authority-trial-phase-mechanic.md:42,46`). The engine's `PHASE_RULES`
(`trialPhase.ts:93-155`) matches that doc table exactly and rejects inadmissible
cards per phase. Mechanics express ideology rather than decorating it.

### 7 — Pacing, Structure & Gating — PASS

Act titles verified (THE WHISPER / OFFER / REVELATION / MAP / CONFESSION /
CONVERGENCE). Gates are real progression checks, not timers: Act 3 needs ≥5 rooms
unlocked (`narrativeActs.ts:52`), Act 4 needs level ≥5 or ≥3 modes
(`:57`), Act 6 gates on army-recruitment count (`:66-69`). Acts 2 and 5 are
**intentional interludes** with no scripted opponents (`acts2to7Opponents.ts:5-7`)
— a deliberate ebb in the ramp, not a hole.
_(Correction: literal `steps[]` lengths run ~2× the old audit's per-act numbers;
the audit appears to have counted only `wheel_choice` decision points.)_

### 8 — Conversation / Dialogue Design Craft — PASS

19 registered NPC trees across 13 NPCs; `NpcDialogChoice` carries `requires` /
`sets` / `trustDelta` / `factionRepDelta` / `unlockCard` / `publicFlag` and a
non-verbal `expressionChannel` (glyph/posture/sound/first_word) actually used
(`dmc_clone_companion/first_meeting.ts:39`). The act-progressed-answer mechanism
is real: `CompanionAskTopicAlternateAnswer{unlockedFromAct,...}` with
"highest unlockedFromAct ≤ current act wins." The classic "dead-end" is paid off:
`ask_human_who` defers "Ask me again after Act 6" then confesses via Act-3/6/7
alternates (`companionAskTopics.ts:189-221`).

### 9 — Onboarding & Narrative Legibility — PASS

Every system has a diegetic teacher. `preludeSystemTutors.ts` covers 11 systems
with a `narrativeJustification` naming the in-fiction tutor (Locke = mission
board); `acts2to7SystemTutors.ts` covers six post-Act-1 systems (dual_channel,
star_map, confession_journal, …) each `unlockedFromAct`-gated. The spine
guarantees the on-ramp can never be a bare UI toast: "Mechanical unlock toasts
are NEVER a carrier — the player experiences progression as story."
(`narrativeSpine.ts:45`).

### 10 — Environmental / Spatial Storytelling — PASS

26 room modules with a SCUMM verb-coin (look/use/talk + hidden `interrogate`).
Spatial actions carry narrative state: combining `corrupted-fragment` +
`original-ledger-fragment` → produces `restored-ledger`, sets
`shadow_tongue_first_uncorruption`, clears an active Shadow-Tongue edit, and logs
a clue (`archives.ts:64-83`). Hotspots bind to mystery episodes
(`archives.ts:91-95`). Room reachability/unlock manifest is gate-proven
(131/131 PASS).

### 11 — Theme, Motif & Symbolic Coherence — PASS

The thesis is explicit and recurs in **shipped data**, not just the design doc:
"It is The Witnessing — the lived experience of Revelation 21-22 … The music IS
the prophecy. The game is the fulfillment." (`NARRATIVE_ARCHITECTURE.md:5-14`).
Identity chains (Elara / The Human / Source-Kael / Oracle) are corroborated in
`loredex-data.json` ("IDENTITY CHAIN: The Recruiter is the earliest known
identity of … Kael … The Source" — `:1531`). The Meme's meta-narration frames
transmissions with `memeIntro`/`memeOutro` and `relatedLoredexEntries` back-links
(`transmissions.ts:86-96`), threading songs into the codex.

### 12 — Cross-Surface / Transmedia Continuity — PARTIAL

In-repo continuity is strong: 14 spine beats bind every mode to a phase + carrier
(loredex→antiquarian, trade_empire→locke, dead_mans_circuit→cutscene). The
transmedia seam is honest and by design — `crossGameNarrativeThreads.ts` declares
Cades-FPS / Dead Man's Circuit as a shared universe whose **emit** beats live in
out-of-repo titles, while Loredex ships the **receiver** side: a Cades-fall
recognition line and an `xgame_<beatId>` flag set by the emit endpoint
(`crossGameRecognition.ts:69-79,116`). This is a real dangling thread for the
*player* (the emit games aren't here), correctly scoped out of this repo's wiring.
Song back-links are partial: character/entity records carry `song_appearances`
(638 occurrences) but many song-type records have empty arrays.

---

## Fix backlog (prioritized)

All items are **depth/polish on a cohesive base** — none are blocking, and none
are "missing wiring" (the gates already prove the wiring). Each respects
CLAUDE.md rule 2: new declared items ship with their parity entry/test.

### P1 — consequence the player can see late-game

- **Add `{if}` reactivity to Act-6/Act-7 opponent dialog.** Mirror the Act-1/Act-3
  pattern in `act6OpponentDialog.ts` / `act7OpponentDialog.ts` so convergence
  opponents read the choices that led the player there (forgiveness path, Act-4
  path A/B/C, confession-heard). Highest narrative leverage for "choices matter."
- **Grow `choiceOutcomeRegistry` past the 5-entry seed** to cover the branch
  points already enforced by flag-gated rosters (Act-3 transparent/pragmatic/
  full-secret, Act-4 A/B/C, Act-6 confession). Each new entry lands with its
  producer + registry registration so `choiceOutcomeConsumerParity` stays PASS.
  This closes the gap between *actual* branching and the *player-facing* ledger.

### P2 — finish partially-deferred mechanisms

- **Land `StoryEncounter.stakesMode`** so `stakes_axis` choice outcomes stop being
  a counted no-op (`choiceOutcomeConsumerParity.ts:187-191`) and start mutating
  in-encounter axes.
- **Backfill `song_appearances`** on song-type loredex records that currently hold
  empty arrays, completing the song↔codex bidirectional web (Lens 11/12).

### P3 — tracked, not urgent

- **Room-art RATCHET rows** (composite-sprite 617, Axis 9/11/12) — art-production
  backlog, already ratcheted and non-regressing; out of narrative scope.
- **Transmedia emit sides** (Cades-FPS / Dead Man's Circuit) — out-of-repo;
  receivers are wired. Track as a cross-project dependency, not a repo task.
- **Per-character voice-consistency pass** (the old audit's "Writing V3") against
  the now-shipped Acts 2–7 dialog tables.

---

## Verification

- `pnpm ship:check` → **137 PASS, 5 RATCHET, 0 FAIL** (2026-05-29). All narrative
  gates at hard parity; 5 RATCHET rows are art-asset production only.
- Every quoted `file:line` in this report was read from source this pass.
- This document is analysis-only; no runtime code was changed. The backlog above
  is the change set, sequenced — each item is gated by `ship:check` on landing.
