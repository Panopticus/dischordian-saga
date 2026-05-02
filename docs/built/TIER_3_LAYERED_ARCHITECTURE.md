# Tier 3 — Layered Multiplayer Architecture

Status: surface layer shipping; reducer N-player widening deferred
Last updated: 2026-05-02

This document explains the deliberate two-layer architecture that
makes 2v2 ranked + card co-op available *today* without taking the
full RULES_VERSION bump that the original Tier 3 plan called for.

## TL;DR

```
┌─ N-PLAYER SURFACE LAYER (this PR — T12) ───────────────────────┐
│  • PartyRouter           invite/accept/leave/queue              │
│  • CoopCardRouter        encounter session lifecycle            │
│  • CoopEncountersPage    /coop UI                               │
│  • PartyPanel            inline party widget                    │
│  • coopBossAI            phase-trigger heuristic on top of      │
│                          the existing campaignAI                │
│  • COOP_ENCOUNTERS       3 lore-rooted encounters with phases   │
│                                                                  │
│  Routes party / co-op inputs, manages match lifecycle, awards   │
│  rewards. Talks ABOUT a 2v2 / co-op match.                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼ (the "shared-side" routing)
┌─ ENGINE LAYER (1v1 reducer, unchanged) ────────────────────────┐
│  • GameState.players: [PlayerState, PlayerState]                │
│  • Side = 0 | 1                                                 │
│  • currentPlayer: Side                                          │
│  • Native deterministic 1v1 reducer with 184 Side refs          │
│                                                                  │
│  No knowledge of parties, teams, or N-player matches. Every     │
│  match is structurally 1v1 from the engine's perspective.       │
└─────────────────────────────────────────────────────────────────┘
```

## Why the layering?

The full Tier 3 plan required:
1. Widening `Side = 0 | 1` to `MatchPlayerSlot = number` across 184 sites
2. Adding `teams: readonly Team[]` to `GameState`
3. Generalizing `currentPlayer`, `winner`, `Action.actor`, every targeting selector
4. Bumping `RULES_VERSION` (e.g. 2.0.0)
5. Pinning every recorded match to the legacy reducer for replay
6. Validating byte-identical replay output across the production replay archive
7. Live-draining PvP queues at deploy

**Step 6 is the gating constraint.** Replay determinism testing
needs access to the production replay archive, which I don't have
from this environment. Shipping the engine widening without that
validation risks breaking replays for every existing match.

The layered approach lets us ship usable 2v2 / co-op gameplay today
while leaving the engine widening as a focused follow-up that a
human can drive with proper replay validation.

## How 2v2 routes onto a 1v1 engine

```
Party of 4 (alice, bob | carol, dave) queues card_2v2
   │
   ▼
PvP WS pairs the two parties.
Underlying match is engine-1v1:
   Side 0 = "Team Alice/Bob" (one shared general)
   Side 1 = "Team Carol/Dave"
   │
   ▼
WS layer routes input:
   alice + bob both send actions → server queues + alternates
   per-turn priority. Actions from the off-turn member are
   suggestions; on-turn member confirms / cancels.
   │
   ▼
Engine sees a normal 1v1 match. No engine changes needed.
```

This is the "Two-Headed General" model from the original strategic
plan. It's a deliberate compromise: each team gets one shared
board state instead of two parallel sides, but the gameplay still
feels collaborative (both members coordinate on plays) and the
engine stays clean.

The full N-player engine refactor would give each player their own
side; that's the long-term path but not required to ship this.

## How co-op routes onto a 1v1 engine

```
Party of 1-2 (humans) starts coop session for "The Warden Descends"
   │
   ▼
CoopCardRouter.startSession creates coop_card_sessions row + flips
party.status to "in_match".
   │
   ▼
WS layer (deferred to follow-up) creates a 1v1 engine match:
   Side 0 = humans (shared general / shared deck — Two-Headed)
   Side 1 = AI boss (using the encounter's bossDeck)
   │
   ▼
Boss AI uses chooseCoopBossAction(state, registry, difficulty,
encounter, firedPhases) — wraps chooseCampaignAction with phase-
trigger detection.
   │
   ▼
On boss general HP fraction crossing a phase threshold, the
nextPendingPhase trigger's castCardIds get enqueued via the
existing scriptedActions machinery for the boss's next turn.
   │
   ▼
On match end: CoopCardRouter.submitResult writes outcome,
fires titleGrants for every party member, mirrors competitive
ratings (gameType=card_coop), drops conspiracy clues, awards
Dream tokens.
```

## What ships now (T12)

- **Schema**: `parties`, `party_members`, `party_invites`,
  `coop_card_sessions`
- **PartyRouter** (`apps/server/routers/party.ts`):
  `createParty`, `invite`, `myInvites`, `acceptInvite`,
  `declineInvite`, `getMyParty`, `leaveParty`, `queueParty`,
  `setMode`. Single-party-per-user via uniqUserSingleParty.
- **CoopCardRouter** (`apps/server/routers/coopCard.ts`):
  `getCatalog`, `startSession`, `submitResult`, `getMySessions`.
- **3 lore-rooted encounters**:
  - The Warden Descends (entity_38) — 3 phases, normal/heroic/mythic
  - The Shadow Tongue's Address (entity_7) — 3 phases
  - The Warlord's Three Moves (Replay) (entity_10) — 3 phases
- **coopBossAI** (`apps/shared/tcg-core/ai/coopBossAI.ts`):
  wraps `chooseCampaignAction` with phase-trigger detection.
- **CoopEncountersPage** at `/coop` — encounter picker, party
  widget, difficulty selector, recent sessions log.
- **18 new unit tests** (encounter registry, boss AI phase logic,
  party math).

## What's NOT shipping (deferred follow-up)

- **The actual WS routing**. `pvpWs.ts` doesn't yet read the
  `coop_card_sessions` table to spawn a boss-AI-driven match. The
  surface (party + encounter selection + result submission) works,
  but the underlying match instance isn't yet auto-spawned by the
  WS layer. Today the system works as: select encounter → record
  session → submit results manually. Auto-spawn is a focused
  follow-up.
- **2v2 deck-select UI**. PvpArenaPage's deck picker is single-
  player; 2v2 needs both members to confirm decks before queue.
- **Reducer N-player widening** (the actual engine refactor). See
  the explanation above for why this is deferred.

## Migration path to native N-player

When the engine widening lands:

1. The CoopCardRouter session schema doesn't change.
2. `chooseCoopBossAction` continues to work — `BOSS_SIDE = 1`
   becomes `BOSS_SLOT = 2` (or whatever the encounter assigns).
3. The party invite/accept/queue surface stays identical.
4. The "Two-Headed General" routing in the WS layer goes away —
   each member gets their own side, with proper team checking.
5. The encounter registry's `bossDeck` interpretation doesn't
   change; the boss just controls a real player slot instead of a
   shared one.

In other words: this layered architecture is forward-compatible
with the native widening. Nothing here will need to be torn down.

## Lore notes

- The Two Witnesses framing comes from the Hierophant arc
  (entity_58 → "Voice of Thaloria" tier-3 title). Co-op clears
  fire `awardEligibleTitles({ kind: "coop_card_cleared" })` which
  feeds the Hierophant progression.
- "The Warden Descends" maps to entity_38, the Architect's
  prison-keeper — the lock-step / prison aesthetic drives the boss
  deck and the "Court of One" phase 3 cast.
- "The Shadow Tongue's Address" is entity_7's diegetic press
  conference — every phase fires a different rhetorical attack
  (Idiom Shift, Press Conference, Apostle of Meaning).
- "The Warlord's Three Moves (Replay)" is the §5.5 lockout
  encounter promoted to a co-op rematch — survive turns 1-6 with
  the boss's rage phase escalating each scripted-action turn.

## Verification

- `pnpm check` clean
- `pnpm vitest run apps/shared/tcg-core/coop apps/server/routers/party.test.ts`
  → 18 passed (encounter registry, boss AI phase logic, party math)
- Manual: navigate to `/coop`, create a party, start a session,
  verify the WS layer logs the session id but doesn't yet auto-
  spawn a match. (Auto-spawn is the deferred follow-up.)
