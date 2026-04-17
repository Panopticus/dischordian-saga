# Warlord Three-Move Lockout Mechanic — §5.5

**Status:** design stub (April 2026). Blocker for §5.5
runtime implementation. Standalone (does not coordinate
with other Act 1 mechanic specs; the verdict stream is
not active in §5.5).

## 1. Purpose

Warlord Zero's §5.5 match canonically demonstrates that
**the Architect faction can force the rules themselves to
change.** The Warlord's pre-match line — *"I am going to
win this war in three moves. This is not bragging. This
is arithmetic."* — is literal. Her deck deploys a three-
turn lockout that reduces the player's option set for
turns 4, 5, and 6.

The lockout is the canonical origin of the **forced-option
keyword** (`architect` / `new_babylon` shared) the player
will re-encounter in Acts 3+ every time an Architect-
aligned opponent plays a "reality edit" card. The §5.5
match is the **first** appearance and must be legible —
the player needs to read the mechanic clearly so the
Acts 3+ re-encounters land with recognition rather than
confusion.

## 2. What the player sees

### 2.1 Turn-1 and -2: normal Dischordia

Standard match field. No mechanic foreshadowing; the
Warlord plays ordinary `architect` / `new_babylon` cards.
The countdown indicator (§2.3 below) is **not yet
visible** — it appears at the start of turn 3.

### 2.2 Turn 3: the Warlord's thesis

On the Warlord's third turn, her deck plays a special
card — **Three Moves** (Mythic, Architect + New Babylon).
The card has no private-scoring effect; its entire
function is to activate the lockout state. When played,
the card:

1. Displays a brief (1.5s) large-text card-reveal
   animation in the match-field center, rendered in the
   §5.4.1 Nexon palette (dust-brown + brass + ember-
   orange; **not** black-marble — the lockout is pre-
   §5.8 Reality-edit; the card-level effect is Warlord-
   scale, not Authority-scale).
2. Spawns the **three-move countdown indicator** (§2.3)
   in the upper-right of the match field.
3. Triggers the player hand-narrowing (§2.4).
4. Plays a single VO line from the Warlord: *"Three
   moves. Count them."*

### 2.3 The countdown indicator

Upper-right of the match field. Three small brass
rectangular tiles arranged horizontally, each containing
a numeral: **3**, **2**, **1**. At turn 3 play, all three
tiles are lit and the numeral **3** is highlighted (the
current lockout turn).

As the player completes each of turns 4, 5, 6, the
corresponding tile dims to a spent state — the numeral
remains visible but the tile loses its brass glow. At
turn 7 start, all three tiles are spent; the indicator
then fades out over 2 seconds.

Visually the indicator reads as a **counting down** —
the player's eye sees it ticking even though the ticking
is happening on their own turns, not the Warlord's.

### 2.4 Hand narrowing during lockout

During turns 4, 5, and 6, the player's visible hand is
narrowed to **two playable cards per turn** (down from
the standard 4–6 cards depending on deck composition).

Narrowing rules:

1. The player's full hand still exists in the game state.
   The other cards are **temporarily locked** — they
   appear in the hand visually but dimmed (30% opacity)
   with a small brass-outlined lock icon overlaid. They
   cannot be played; attempting to play a locked card
   produces the same rust-orange outline rejection as
   §5.8's phase violations, with the message *"locked —
   next turn"* appearing briefly beneath the card.
2. Which two cards are playable is **Warlord-chosen**,
   not random. The rule: the Warlord's deck selects the
   two cards from the player's hand that are **least
   favorable to the player's current board position**.
   The player-facing framing is that Warlord can *see*
   the hand and is selecting the narrow options
   deliberately; the game-state framing is that the
   `architect` reality-edit is pruning the future
   branches the Warlord judges are weakest for her.
3. On each of turns 4, 5, and 6, the Warlord re-selects
   the two playable cards from whatever hand the player
   has at that moment (cards drawn or added during the
   lockout are eligible). The narrowing is therefore
   *re-evaluated per turn*, not locked at the start of
   the lockout.

**Exceptions (escape hatches):**

- Cards marked `insurgency` in their `deckLeaning` are
  **immune** to the narrowing — they always appear
  unlocked regardless of the Warlord's selection. This
  is canon-consistent: the Insurgency faction's
  mechanical identity is *breaking rules*, and the
  lockout is a rule. The player who has built an
  insurgency-adjacent deck arrives at §5.5 with natural
  counter-play available.
- Cards with the `forced-option override` metadata (a
  rare 1–2 cards in the live pool as of Act 1 authoring)
  are also immune. These are explicitly the cards
  designed to counter this Warlord mechanic when the
  player re-encounters it in Acts 3+.

### 2.5 Turn 7 and beyond

On turn 7, the three-move countdown tiles all read spent.
The player's hand returns to full visibility and full
playability. The Warlord plays out the rest of the match
without further lockouts. The remainder of the match
resolves as standard Dischordia.

## 3. The "right play" during lockout

The player is **not supposed to fight the lockout**. The
mechanic is unfightable by design; attempting to "break
out" by contesting every locked card wastes the three
turns on rejection animations and leads to near-certain
defeat.

The **correct play** is to read the two options the
Warlord leaves each turn and choose the one that serves
the **long game** (turn 7+), not the short game (the
immediate board state). The memoir's thesis is that the
Warlord has won the *current exchange*, and the player
wins or loses the match in the recovery phase after the
lockout ends.

This reading is reinforced by the match outcome being
narratively equivalent: both win and loss fire the
same `hacking-reality` cutscene (§5.5 Bible). The
memoir's point is *the war was the loss*, so the match
being unfightable in its middle section reinforces that
point mechanically.

## 4. Difficulty posture

**Hard** — the first genuinely unfair-feeling match in
Act 1. The ~50% win-rate target accounts for:

- Players who have built `insurgency`-adjacent decks
  (immune to narrowing, win above target)
- Players who have built `architect`-counter-leaning
  decks (some natural resistance via forced-option
  override cards, around target)
- Players who have built mainstream decks (take the
  lockout on the chin, recover in turn 7+, near target
  with good long-game reads)
- Players who try to fight the lockout (well below
  target — this is the *teaching loss*, and the memoir
  absorbs the loss canonically because Warlord's
  arithmetic wins whether or not the match does)

Tuning knob: adjust the two-playable-cards narrowing up
to three-playable-cards if playtest shows sub-target win
rates across all deck compositions. Do not narrow below
two — a single-card lockout removes meaningful choice and
makes the mechanic feel like a cutscene rather than a
match.

## 5. Runtime state contract

New GameState field:

```ts
interface GameState {
  // ... existing fields ...

  /** Whether the player saw the Warlord's three-move
   *  lockout play out. Set on turn 3 when Three Moves
   *  card lands. Read by Act 3+ dialogue branches that
   *  reference the match as backstory. */
  architect_reality_edit_witnessed: true;
}
```

This flag is **separate** from the match outcome flags
(`act1_warlord_zero_first_defeated` /
`act1_warlord_zero_first_lost`), which continue to
write as specified in §5.5's Bible entry. The
`architect_reality_edit_witnessed` flag is set
**unconditionally** on turn 3, regardless of final
match outcome — the player saw the mechanic, so the
flag reflects that.

The unconditional set is important: Acts 3+ references
to "the reality-edit at Nexon" are canonically
universal (every §5.5 survivor remembers the Three
Moves card), and the flag's logic should match.

## 6. Open design items

1. **Card-pool authoring.** Three cards need to be
   authored / verified in the live pool before §5.5
   runtime:
   - ~~**Three Moves** (Mythic, Architect + New Babylon)~~
     **AUTHORED** as `s1_warlord_three_moves` —
     `apps/shared/tcg-core/cards/definitions/architect/`.
     Card uses the `legendary` Rarity tier (the schema's
     top tier) and the new `warlord_only: true` flag for
     deck-builder filtering, in lieu of a one-card
     `mythic` rarity. Filed under `architect` faction
     (single-faction schema); the New Babylon eligibility
     is narrative — when §5.5 runtime needs to surface a
     secondary faction, add a `secondary_faction` field
     to the schema.
   - At least one **Insurgency-immune marker** card for
     playtesting the immunity behavior. The `insurgency`
     lean is already well-populated; verify the match
     is survivable with standard insurgency cards.
   - **Forced-option override** cards (1–2) for the Acts 3+
     counter-play path. **Deferred per scope** — §5.5 ships
     before the Acts 3+ re-encounters, so authoring waits
     until the Acts 3+ Architect-match work-stream picks
     up the spec's forward-compat hook (§7 "forced-option
     keyword graduates to engine-level primitive"). When
     authored, the card-schema field will likely be
     `forced_option_override?: true`, parallel to the
     `warlord_only` flag added in this commit.
2. **Lockout VO coverage.** The Warlord has the pre-match
   line and the turn-3 thesis line (*"Three moves. Count
   them."*). Additional VO on turns 4, 5, 6 is open
   scope — should she narrate the lockout, or does the
   countdown indicator do that work silently? User
   decision needed; silent is the current default
   (cleaner, lets the mechanic speak for itself).
3. **Indicator copy.** The three brass tiles display
   **3 / 2 / 1**. Alternative: **3 / 2 / 1** plus a
   small word label on each (*"move"*). The bare numerals
   are cleaner but require the player to read the
   mechanic from context. Author call during UI pass.
4. **Accessibility.** Screen-reader announcement at
   turn 3: *"Warlord Zero has forced a three-turn
   lockout. Your hand is narrowed to two playable cards
   per turn for the next three turns. Countdown active."*
   Announcement at turn 7 start: *"Lockout ended. Full
   hand restored."* Required for AA compliance.

## 7. Forward-compatibility notes

- The **hand-narrowing UX component** (dim-to-30%-opacity
  with lock icon overlay, rust-orange rejection on
  attempted plays) reuses §5.8's phase-violation
  rejection component. The two behaviors share a
  visual vocabulary deliberately — the player who has
  seen §5.5 will recognize §5.8's restriction UI as a
  sibling, and vice versa.
- The **forced-option keyword** graduates to an engine-
  level primitive for Acts 3+. When §5.5 implements,
  extract the narrowing logic into a reusable
  `applyForcedOptionLockout(state, turnsRemaining,
  narrowToCount)` helper that Acts 3+ Architect matches
  can import.
- The **countdown indicator** does not graduate; it is
  specific to the Warlord's arithmetic framing. Acts
  3+ reuse of the narrowing primitive should present a
  different visual indicator per opponent.
