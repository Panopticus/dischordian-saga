# Psychological Profile System

A game-wide, append-event-log based profile of the player's
choices, reading style NOT morality. Lives alongside the existing
moral-meter system; the two are orthogonal.

## The seven axes

Each axis is an INT in `[-100, 100]` stored on `player_profile`.

| Axis | -100 pole | +100 pole |
|---|---|---|
| **aggression** | pacifist — avoids confrontation, draws when winning | predator — pushes, sacrifices, never offers draw |
| **mercy** | ruthless — converts every advantage, never spares | merciful — accepts draws, lets opponents save face |
| **curiosity** | dismissive — skips dialog | inquisitive — asks every NPC every question |
| **conformity** | iconoclast — ignores hints, plays counter | conformist — follows tutorials, recommended path |
| **vigilance** | trusting — accepts framing at face value | suspicious — questions, double-checks |
| **vulnerability** | guarded — silence, deflection, never reveals | open — shares, confides, emotional risk |
| **wit** | stoic — terse, factual | playful — banter, jokes, mocks |

## Source IDs

Every choice/action that writes to the profile passes through a
`source` id that looks up its standard delta in
`apps/shared/playerProfileSources.ts`. A caller can override
with `overrideDeltas` for one-off choices that don't match the
standard weight.

Current sources:

- `chess_mind_game_choice:<archetype>` — mid-match dialog
  (defiant, curious, philosophical, mocking, vulnerable, silent)
- `chess_resign:<winning|losing>` — resigning a winning or
  lost position
- `chess_draw_offer_made|accepted|declined`
- `chess_hint_used` — calling for a hint mid-game
- `chess_puzzle_retried`
- `chess_climb_offer_accepted|declined`
- `chess_silence_streak` — three consecutive silent defaults
- `card_dialog_choice` — retroactive annotation target
- `card_match_resigned`
- `card_match_concede_accepted`
- `room_dialog_choice` — retroactive annotation target
- `mission_outcome`
- `narrative_choice`

Weights are intentionally small (±2..±6 for most events, ±8+
for defining choices like resigning a winning game). Profiles
cap at ±100; saturation takes ~20 strongly-aligned events on a
single axis, roughly one act of play.

## Consumers

### Tier 1 — Mind-game replies (chess)

The Game Master's mid-match replies in
`apps/shared/tcg-core/story/chessMindGameCues.ts` branch on
archetype + profile magnitude. A high-Wit player picking
"mocking" gets a different reply than a low-Vulnerability
player picking the same archetype.

### Tier 2 — Tutorial pacing (chess)

High-Conformity players get standard 7-gate pacing;
high-Iconoclast players unlock Gate 4.5 (The Prince's Game)
earlier and get commentary acknowledging their preference to
break the curriculum.

### Tier 3 — Non-chess NPCs (Phase F+)

`getProfileBlurb(axis, profile)` returns a one-line narrative
descriptor ("fiercely predator", "clearly merciful", etc.) that
any dialog writer can drop into any existing NPC line. Phase F
seeds 5-10 of these across the game so the sense that "the
world is watching" spreads beyond the chess subsystem.

## The three reveals

Three explicit "I see you" beats, each one farther outside the
player's expectation:

1. **Reveal 1 — Chess climb Tier 1, post-win.** The GM reads
   back two specific numeric facts about the player's chess
   history. In-domain, surprising.
   - Source: `chessClimbDialog.ts` `CLIMB_T1_POST_WIN` cue 1.
   - Line: "I notice you have refused thirty-one of forty draws
     offered to you in this universe. That is not a chess
     style. That is a personality."

2. **Reveal 2 — Chess climb Tier 2, post-win.** The GM reads
   back facts from OUTSIDE chess — a card-battle decision, a
   dialog choice in a different act.
   - Source: `chessClimbDialog.ts` `CLIMB_T2_POST_WIN` cue 2.
   - Line: "You spared the Programmer in Act 1. You did not
     spare me in Game 2. I am not insulted. I am noting the
     consistency of your INCONSISTENCY."

3. **Reveal 3 — Chess climb Tier 3, post-win.** The GM reads
   the player's seven-sentence portrait aloud.
   - Source: `chessClimbDialog.ts` `CLIMB_T3_POST_WIN` cue 2.
   - The portrait is assembled dynamically by
     `buildPortraitSentences(profile)` — one sentence per axis
     using the player's current values.

A pre-reveal at the G7 outro closer plants the "I have been
watching you" beat to set up the eventual trilogy.

## Storage + privacy

- `player_profile` — one row per user. Hot path: single-PK
  lookup by `userId`. Columns: 7 int axes + eventCount +
  lastUpdatedAt + createdAt.
- `player_profile_events` — append-only audit log. Columns:
  id, userId, source, payload (JSON), deltas (JSON), createdAt.
  Indexed on (userId, createdAt DESC) and (userId, source).
- The Self-Portrait page at `/self-portrait` surfaces the
  user's own profile to them. Transparency is a trust gesture.
- No PII. No external sharing. The profile lives only in the
  game's DB.

## Adding new sources

1. Add the source id to `PROFILE_EVENT_SOURCES` in
   `apps/shared/playerProfile.ts`.
2. Define a standard delta in `apps/shared/playerProfileSources.ts`.
3. Call `trpc.playerProfile.recordEvent({ source, payload })`
   from the server-side handler for the action.

The event log is tolerant of sparse data — unannotated choice
tables are fine, they just don't contribute axis weight. You
can annotate existing dialog branches incrementally; the
system never breaks on a missing delta.

## Adding new consumers

For narrative consumers, prefer `getProfileBlurb(axis,
profile)` — a single line, drops cleanly into any dialog. For
numeric consumers (tutorial pacing, unlock gates), branch
directly on the axis value or on `magnitudeOf(value)` buckets.

For the dramatic "I see you" moments, use
`buildPortraitSentences(profile)` and let the GM speak the
sentences verbatim. The Tier 3 reveal is the canonical
example.
