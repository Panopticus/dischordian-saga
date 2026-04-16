# Seer Prophecy Mechanic — §4.9 Cycle B finale

**Status:** design stub (April 2026). Blocker for §4.9
runtime implementation. Most mechanically exotic of the
four Act 1 design docs; needs the tightest consistency
invariant.

## 1. Purpose

The Seer's §4.9 match is a **scripted narrative loss** for
the player's first playthrough, canonically — *"you are
not losing because you played poorly; you are losing
because the match was decided before it began."*

The mechanic that makes this legible: the Seer plays cards
that **aren't in her hand yet**. Her play sequence is
drawn from a future turn and **retroactively applied** to
the current turn. The game state then recalculates to
accommodate a play it hadn't permitted a moment earlier.

This spec defines the retroactive-resolution algorithm
that keeps the game state internally consistent while
letting the mechanic *feel* as impossible as the memoir
says it is.

## 2. What the player sees

### 2.1 Play animation

When the Seer plays a card, the match field shows an
intentional **800ms delay + flicker** between the card
leaving her hand position and settling into the board:

- The card's visual flickers through 3–5 different card
  faces during the delay (sampled from future-draw
  possibilities in the Seer's deck)
- On settle, the card lands on the board with a single
  additional visual beat: the Seer's card-slot position
  momentarily shows **two cards superimposed** (the card
  that was drawn and the card that was played) before
  resolving to just the played card
- Her hand-count indicator does not decrement during the
  play — it stays full because the card came from a
  future draw, not from her current hand

### 2.2 Board inconsistency is never visible

The game state never **visibly** contradicts itself. At no
point does the player see two incompatible board states
on screen. The algorithm in §3 ensures that by the time
the flicker resolves, the board is consistent with the
Seer's play.

If the player refreshes or re-saves during a Seer turn,
the loaded state is always the post-resolution state —
never the mid-flicker intermediate. This is enforced by
the reducer: the intermediate is a UI-only rendering
state, not a GameState write.

## 3. Retroactive-resolution algorithm

### 3.1 The invariant

**The game engine's internal game state is never
retroactively edited.** What appears retroactive is
actually a **pre-commit reorder** — the engine decides
the Seer's play *before* the prior player turns are
resolved to the board, and then plays those turns forward
into a state that has the Seer's play already accounted
for.

Concretely: when the player starts their turn N, the
engine has already sampled which future-turn card the
Seer will play at turn N+1, and has baked that play into
the game state as a *pending future* — a game-state field
that card effects can read but not write.

Player cards played at turn N resolve against:
- The board state (normal)
- The pending Seer future (novel to §4.9)

Card effects that would contradict the pending future
(e.g., a player card that would remove the card the Seer
is about to play) are **silently re-routed**: the card
still resolves, but its effect applies to a different
target the engine selects, with no UI indication of the
re-route. The player's view of their card's effect
remains coherent; what they can't see is that the effect
would have been different if the Seer's future weren't
pending.

### 3.2 No feedback loop

The pending future is **read-only from card effects**.
No card can write to the pending future, no card can
cancel it, no card can inspect it directly (there is no
card-level API to query "what is the Seer about to
play"). The player's only signal is the flicker
animation; the only way to counterplay is to have
pre-built a deck that the Seer's sampling is unlikely to
favor.

This avoids the feedback loop that retroactive
mechanics classically trigger in card games: the pending
future is *one-directional*, from engine to board, with
no back-channel.

### 3.3 One winnable path (canon-hidden)

The canonical first-playthrough outcome is defeat, but
the Seer's match is **not literally unwinnable**. Exactly
one deck-composition pattern can beat her:

- A deck containing the `burnt_card_placeholder` card
  (an unreleased, unnamed card slot — reserved by the
  Act 1 schema but never populated in a normal live
  card pool)
- The card exists in the schema so that in Act 3+
  playthroughs, after the player has seen the Seer's
  staff in the Prelude's Archives and understood the
  continuity, an Acts 2+ unlock route delivers the card
  retroactively to the player's Act 1 deck
- Replaying §4.9 with that card in hand wins the match
  — the Seer pauses, smiles, and says *"Oh. You
  remembered."* (line TBD; user-approval-pending)

This path is **not discoverable** on first playthrough.
The Act 1 opponents file's line 169 (*"She leaves her
staff on the bench for the Engineer to find later"*) is
the only in-canon hint. The mechanic must support the
winnable path without advertising it.

## 4. Scripted-loss outcome

On first playthrough (the overwhelming majority of Seer
matches), the player loses. Canonical handling:

- The Seer plays through her retroactive sequence across
  6–8 turns, with the flicker animation on each play
- The player's plays resolve normally but against an
  increasingly impossible board state
- On the Seer's final play, the match ends with a
  `scripted_loss` outcome
- The `to-be-the-human` slideshow fires regardless of
  outcome (per §4.9 Bible entry)
- `act1_seer_visit_scripted_loss` is set; the memoir's
  narration carries the loss forward as a narrative
  fact, not a failure

## 5. Runtime state contract

```ts
interface GameState {
  // ... existing fields ...

  /** §4.9 outcome. Exactly one of these three is set
   *  after the match ends; the others remain undefined. */
  act1_seer_visit_defeated?: true;              // the one winnable path
  act1_seer_visit_scripted_loss?: true;         // canonical first-playthrough
  act1_seer_visit_fled?: true;                  // player conceded mid-match

  /** Always set on match end regardless of outcome.
   *  Seeds the Prelude's burnt_card fragment continuity. */
  act1_seer_staff_witnessed: true;

  /** Cycle B completion — unconditional. */
  act1_cycle_b_complete: true;
}
```

Match-internal state (not persisted to save; lives only
inside the reducer during §4.9):

```ts
interface SeerMatchState {
  /** Pending future-draw play. Baked at the start of
   *  each player turn; read-only from card effects. */
  seerPendingFuture: {
    cardId: string;
    targetSlot: BoardSlot;
    turnIndex: number;
  } | null;
}
```

## 6. Open design items

1. **Card-slot "superimposition" animation.** The 800ms
   flicker + 2-card-superimposition settle is the
   mechanic's visual signature. Needs a dedicated art
   pass — Canon Rev 7 §5.6.9 *Last Words* slideshow is
   the game's only other "future bleeds into present"
   visual moment and may inform the treatment. Author
   before runtime.
2. **Burnt-card winnable-path content.** The one
   winnable-path unlock route in Acts 2+ is fully open
   — does the card come from a codex entry, a side-
   quest, a specific conversation with the Antiquarian?
   User decision needed before Act 2's Antiquarian
   companion arc locks. The mechanic is built to
   support the winnable path regardless of which route
   delivers the card.
3. **Accessibility.** Screen-reader announcement on each
   Seer play: *"The Seer plays a card from a future
   turn. Her hand count does not decrease."* Required
   for AA. Verify the announcement does not leak the
   winnable-path secret by naming it.
4. **Silent re-route audibility.** §3.1's "silently
   re-routed" card-effect handling means that a player
   whose card would have hit a different target
   doesn't see it. This is canon-consistent (the Seer's
   reality-edit is stronger than the Warlord's, so
   the player's counter-effects never land the way they
   read). But: if playtest reveals the silent re-route
   feels *buggy* rather than *magical*, add a single
   subtle VO whisper on re-route events (a wordless
   breath, the Seer's voice, barely audible) to mark
   the moment without naming it.

## 7. Forward-compatibility notes

- The **pending-future engine primitive** is §4.9-
  specific. No Act 2+ match reuses the retroactive-
  resolution pattern, by design — the Seer is
  canonically the only entity in the game with
  prophecy-level reality-edit capability.
- The **flicker animation component**, however, is
  reusable: Acts 3+ Witness scenes (the Enigma in
  particular) can use the flicker as a visual grammar
  for *"this is a prophesied moment landing"* outside
  of matches. Factor the animation into a standalone
  component when implementing §4.9.
- **Do not graduate the "one winnable path" pattern.**
  Secret-winnable-path mechanics are powerful and
  tempting; they also fracture first-playthrough
  analytics, speed-run balance, and difficulty tuning.
  The Seer's winnable path is canon-load-bearing and
  therefore justified; no subsequent match should
  reuse it without the equivalent narrative weight.
