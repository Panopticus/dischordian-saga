# Public-Witness UI Spec — §5.7 Game Master double-resolution

**Status:** design stub (April 2026). Blocker for §5.7
runtime implementation. Coordinates with the §5.8 Authority
trial-phase mechanic (see sibling doc
`authority-trial-phase-mechanic.md`) — they share the
verdict stream as a data primitive.

## 1. Purpose

The §5.7 Game Master match introduces a mechanic Cycles A
and B never prepared the player for: **every card the
opponent plays resolves twice.** Once privately (affecting
the match's internal scoring state, the normal Dischordia
resolution) and once publicly (displayed in a dedicated
verdict-stream UI column that records the public record of
each play).

The player's cards resolve **once**, normally. The
asymmetry is the point: the Game Master is a *prosecutor*,
not a duelist. He is playing for the record, not for the
win.

This spec defines the UI primitive that makes that
asymmetry **legible** to the player — the verdict stream
column, its rendering rules, and its hand-off to the §5.8
Authority match as that match's opening state.

## 2. What the player sees

### 2.1 Match-field layout (pre-§5.7)

Standard Dischordia fields are two-column: player hand on
the left, opponent hand on the right, shared board center.
Scoring indicators sit above each hand.

### 2.2 Match-field layout (§5.7 addition)

One new UI column is appended to the **right edge of the
match field**, outside the existing opponent-hand column.
The column is visually distinct — framed in thin polished
brass on a clinical-white background, explicitly styled to
match the §5.4.2 Zenon cell palette (it reads as a *piece
of the room*, not as a Dischordia-native UI element).

Column dimensions:
- Width: 20% of match-field horizontal extent (narrow
  enough to not dominate; wide enough to be unmissable)
- Height: full match-field vertical extent
- Header: the word **"VERDICT"** in Empire-formal serif,
  small, brass on white

Column contents:
- A vertical stack of **verdict cards**, one per Game
  Master turn, stacked oldest-at-top so the match's
  progression reads downward like a transcript
- Each verdict card is a simplified rendering of the
  original card the Game Master played, labelled with
  that turn's public resolution effect
- A persistent **balance indicator** at the column's
  bottom — a signed integer from −10 to +10 displayed
  numerically and as a horizontal gauge, with neutral
  zero dead-center

### 2.3 What each card renders shows

When the Game Master plays a card privately (normal
Dischordia resolution), the card also appears in the
verdict column with:

- The card's **public resolution effect** — what the
  card does to the verdict-stream balance (a signed
  integer delta; shown numerically, e.g. `−2`)
- A **short public-record label** — one or two words
  explaining how the court reads this play
  (*"admission"*, *"deflection"*, *"procedural"*,
  *"confession"*, etc.)
- A **tooltip on hover** explaining the divergence
  between private and public effect in plain language
  (required for accessibility; the player must be able
  to read why the public resolution differs from the
  private one without inspecting card data directly)

## 3. The divergence rule

The spec's core UX challenge: making *"this card is
tactically good but publicly damning"* legible.

**Resolution strategy — color-coded directionality.**
Every verdict card has two visible deltas:

1. A **private delta** (not shown in the verdict column;
   shown in the existing scoring indicator as usual).
2. A **public delta** (shown in the verdict column as the
   `±N` number beside the public-record label).

When the two deltas **agree in sign** (both positive for
the player, or both negative), the verdict card renders in
neutral clinical white — the play reads consistently.

When the two deltas **diverge in sign** (private good,
public bad — or vice versa), the verdict card renders with
a **thin red-orange border** (`#c66b3d` — the Cycle C
rust-orange palette color). This is the *divergence warning
color*. The player is meant to see the border and
understand that their match-state read of "I am winning"
(or "I am losing") does not match what the court is
hearing.

**Tooltip wording convention:**

- Aligned cards: tooltip reads *"private and public
  resolutions agree; this play reads the same to both the
  engine and the court."*
- Diverged cards: tooltip reads *"private gain, public
  damage: this play advantaged your match position but the
  verdict stream recorded it as an admission against the
  Engineer."* (or the symmetric inverse)

No red-orange flash animation, no popup, no modal. The
border and the tooltip are the entire alert. The player is
expected to **read the verdict column voluntarily**.

## 4. Balance indicator

The column's bottom shows the running sum of all public
deltas across the match. Range −10 to +10, clipped (a
single turn cannot push the balance past the clip, but the
clip is shown in the gauge so the player knows when they
are at the threshold).

Thresholds (used by the §5.8 Authority match as opening
state):
- **Balance ≥ +3:** warm balance. §5.8's verdict-phase
  threshold is easier to cross. Memoir narrator's framing
  on the §5.8 Authority outcome reads warmer.
- **Balance −2 to +2:** neutral. §5.8 operates on default
  difficulty.
- **Balance ≤ −3:** cool balance. §5.8's verdict-phase
  threshold is harder to cross. Memoir narrator's framing
  reads colder.

The ±3 thresholds are chosen because a typical Game Master
match has 6–8 opponent turns, each swinging the balance
by ±1 to ±3. A player who ends at ±3 or beyond has either
consistently chosen private-or-public favorable plays, or
has been consistently handed unfavorable ones. The
thresholds should be crossable without requiring any
mechanical gaming of the divergence rule.

## 5. Player-side plays — no witness column

The player's cards do not render into the verdict stream.
This is deliberate and canon-load-bearing:

- The memoir's narrator is the Engineer, and the Engineer
  is **not on trial-by-jury** in the Cycle C trial
  structure — he is being examined by a prosecutor before
  an Authority. His plays are private by the proceeding's
  architecture.
- The public-record asymmetry is the emotional weight of
  the match. Adding a symmetric player-witness column
  would dilute the weight by implying the player *also*
  had a public story.
- Accessibility note: the asymmetry must be announced in
  the match intro cutscene so a screen-reader user
  understands the column exists for the opponent only.
  See §5.7's intro VO block (the Game Master's opening
  line) for the canonical framing.

## 6. Runtime state contract

New GameState field (already spec'd in §5.7):

```ts
interface GameState {
  // ... existing fields ...
  /** Running verdict-stream balance from §5.7 match.
   *  Handed off to §5.8 Authority match as opening state.
   *  Null until §5.7 begins; clipped to [-10, +10] during
   *  play; persisted at match end. */
  gameMasterVerdictStreamBalance: number | null;
}
```

Updates:
- On §5.7 match start: `gameMasterVerdictStreamBalance = 0`
- On every Game Master card play: `+= publicDelta` (clip
  to ±10)
- On §5.7 match end: persist as-is (do not reset on
  player victory or loss; both outcomes carry forward)

Consumed by:
- §5.8 Authority match opening state (see
  `authority-trial-phase-mechanic.md` §4 "Opening state
  from §5.7 handoff")
- Act 2 codex entries referencing the trial transcript
  (readonly)

## 7. Open design items

1. **Typography licensing.** The Empire-formal serif used
   in the verdict column header must not collide with any
   actual in-game-fiction licensed typeface. If the Empire
   font family is not yet authored, fall back to a
   neutral serif with no ornament (e.g., Charter,
   Libertine, or a generic high-x-height Didone) and flag
   for later typography pass.
2. **Mobile layout.** On narrow mobile viewports the 20%
   verdict column may compress the match field below
   playability. Open question: does the column collapse
   into a slide-out drawer, or does the §5.7 match fall
   back to a narrower deck (fewer simultaneous
   opponent-hand cards visible)? Author before mobile
   runtime.
3. **Divergence-warning color contrast.** The rust-orange
   `#c66b3d` border against the clinical-white column
   background passes WCAG AA on border contrast but the
   tooltip text on hover must also pass. Verify during
   implementation.
4. **Post-match review.** After the §5.7 match ends, can
   the player scroll the verdict stream history (e.g.,
   via a Zenon-cell-styled transcript view)? Memoir-
   consistent and would make §5.8's opening-state carry
   feel earned; but it is additional scope. Author
   decision needed.

## 8. Forward-compatibility notes

The verdict stream is the first appearance of a **public
record** UI primitive in the game. Acts 3+ reuse variations
of this primitive for:

- **The Authority's Act 4 appearance.** The same column
  shape, but the verdict cards are now *memoirs* being
  played by the player — the symmetry inverts.
- **Vex Solène's Act 3 conspiracy board.** Same vertical
  transcript framing but horizontal data; shares the
  brass-on-clinical-white styling.

When §5.7's UI is implemented, the component should be
**factored to allow reuse** — extract the verdict-stream
column into a reusable React component
(`<TranscriptColumn>` or similar) that takes the column
contents as a prop rather than hard-coding the Game
Master's resolution logic. The Cycle C hygiene note
applies: **do not name the component in a way that ties
it to the Game Master**, because Acts 3+ reuse the
primitive for opposite-valenced purposes.
