# Authority Trial-Phase Mechanic — §5.8 Act 1 finale

**Status:** design stub (April 2026). Blocker for §5.8
runtime implementation. Consumes
`gameMasterVerdictStreamBalance` from §5.7 as opening state
(see sibling `public-witness-ui-spec.md`).

## 1. Purpose

The §5.8 Authority match is Act 1's final card battle. It
is the only Act 1 match where **the opponent does not have
a hand** — the Authority is a verdict, not a duelist. The
ten match turns correspond canonically to the phases of an
Empire judicial proceeding, and each phase constrains
which cards the player may play.

The match is **not about defeating an opponent**. It is
about surviving all ten phases without breaking a phase-
restriction and without the verdict stream landing below
the execution threshold.

This spec defines:

1. The ten trial phases and their card-play restrictions
   (§2).
2. The verdict threshold calculation at match end (§3).
3. The opening-state contract consumed from §5.7 (§4).
4. The Light/Dark `ChoicePillarLightDark` interaction with
   match outcome (§5) — this is the canonical alignment
   moment of the entire game.
5. Runtime state writes (§6).

## 2. The ten trial phases

Each match turn is one phase. No turn-skip, no turn-double,
no turn-reorder — the proceeding is linear.

| Turn | Phase | Card-play restriction |
|---|---|---|
| 1 | **Charge** | Defensive cards only (cards whose primary effect is to *prevent* damage, reveal, or state change). No offensive plays. No mixed-valence cards (if a card has both offensive and defensive effects, it is unplayable in this phase). |
| 2 | **Opening argument** | One single card only. The card must be marked `narrative` in its card-data schema (flavor-first, mechanics-second). The phase forcibly ends after one play regardless of remaining action budget. |
| 3 | **Evidence (presentation)** | Evidence-category cards only. An evidence card is any card whose effect writes to a persistent game-state flag that Acts 2+ can read. Non-evidence cards are unplayable. |
| 4 | **Evidence (cross-support)** | Same as turn 3 — evidence cards only — but with the added restriction that every card played must build on a flag set in turn 3. Cards that set unrelated flags are unplayable. |
| 5 | **Evidence (closing)** | Same as turn 3 + turn 4 restrictions. If the player has exhausted their evidence-category cards, the phase allows a single *"no further evidence"* pass — the player concedes the phase without playing a card. |
| 6 | **Cross-examination (first)** | Reactive cards only. A reactive card is any card whose effect triggers on the opponent's state rather than the player's. Since the Authority has no hand, reactive cards here target the verdict stream directly — the player is cross-examining the public record. |
| 7 | **Cross-examination (second)** | Same as turn 6, but with one additional allowed category: **confession** cards (any card that explicitly damages the player's private scoring state in exchange for verdict-stream benefit). Confession cards are rare and drawn from the `insurgency` lean. |
| 8 | **Cross-examination (closing)** | Same as turns 6 + 7. Same "no further questions" single-pass option as turn 5. |
| 9 | **Closing argument** | One single card only. Must be marked `narrative`. Same forcible-phase-end as turn 2. The narrative-lean card played here is the match's **last spoken word**; its flavor text reads aloud in the match summary. |
| 10 | **Verdict** | **No card play.** The phase is pure resolution: the verdict stream balance is computed against the verdict threshold (§3), the Authority's verdict lands, and the match ends. The player can *watch* the verdict resolve but cannot influence it mechanically during turn 10. |

### 2.1 Restriction-violation handling

If the player attempts to play a card not allowed by the
current phase, the UI responds with:

- The card's outline renders in the rust-orange divergence
  warning color (`#c66b3d`, same hue as §5.7's divergence
  border for consistency) when dragged toward the board
- Drop is rejected; card snaps back to hand
- A small transcript-style message appears below the
  verdict column: *"Counsel — this is not the phase for
  that."* — addressed to the player in the Authority's
  sparse voice
- No turn is consumed by the attempted violation

The player cannot *accidentally* break a phase restriction.
The system enforces the rule at the UX layer.

### 2.2 Exhaustion handling

If the player runs out of playable cards for a phase:

- The UI offers a *"no further [phase-specific-wording]"*
  pass button (wording matches turn 5's "no further
  evidence" and turn 8's "no further questions"
  precedents).
- Passing is always canon-safe. It does not penalize the
  player mechanically or narratively; the Authority
  simply advances the proceeding.
- If a phase allows no plays at all (e.g., the player has
  zero defensive cards entering turn 1), the pass button
  is pre-highlighted and the player has no meaningful
  choice — this is a **pre-match deck-composition issue**,
  not a §5.8 bug. See §6.1 "Pre-match advisory" for the
  player-facing warning.

## 3. The verdict threshold

At turn 10's resolution, the following formula computes
the match outcome:

```
let base_threshold = -2   // Default: slight Empire lean
let warm_offset = gameMasterVerdictStreamBalance >= +3 ? +3 : 0
let cool_offset = gameMasterVerdictStreamBalance <= -3 ? -3 : 0
let trial_threshold = base_threshold + warm_offset + cool_offset

let trial_balance = sum_of_verdict_stream_deltas_during_§5.8
// (each player card played during §5.8 added ±N to the
//  verdict stream per its public delta, per §5.7's rule)

if trial_balance >= trial_threshold:
    outcome = "overturn"   // Authority overturns execution
else:
    outcome = "sentence_passed"   // Authority passes sentence
```

Both outcomes flow into the same §5.8.1 *Last Words* full-
song cutscene. The only narrative difference is the
memoir narrator's framing line (per §5.8 Bible entry).

### 3.1 Threshold tuning

The `base_threshold = -2` default is chosen so that a
player who enters §5.8 with a neutral §5.7 balance (`0`)
and plays coherently through all ten phases lands near
neutral — slightly below threshold on default play, above
on skilled play. This maps to a target 50/50 first-
playthrough outcome distribution.

Tuning knob if the 50/50 distribution is off in playtest:
adjust `base_threshold` only (not the `±3` offsets). The
`±3` offsets are narrative-load-bearing (the §5.7
hand-off must matter mechanically) and should not be
retuned without user sign-off.

## 4. Opening state from §5.7 handoff

On §5.8 match start:

```ts
const preMatchBalance = state.gameMasterVerdictStreamBalance ?? 0;
// Note: `?? 0` is a safety net; any player who reached
// §5.8 must have completed §5.7 per the act1Step
// progression, so this field is always a number by this
// point. The null fallback guards against save-state
// corruption only.

// The verdict stream is displayed in §5.8's match field
// using the same <TranscriptColumn> component spec'd in
// public-witness-ui-spec.md §8. The column initializes
// pre-loaded with §5.7's transcript cards (readonly) and
// the running balance continues from preMatchBalance.
```

The §5.7 transcript is **visible but not editable** during
§5.8. Every §5.7 card the Game Master played remains in
the column with its original public-record label and
tooltip. The player can read it to orient themselves but
cannot alter it.

New §5.8 card plays append to the column below the §5.7
entries, with a subtle horizontal rule separating the
§5.7 transcript block from the §5.8 live block. The rule
is a single thin line in the brass color, labelled
**"— trial convened —"** in small serif type.

## 5. §5.8.1 Light/Dark choice interaction

§5.8's verdict resolution does **not** determine the
Light/Dark alignment. Both are separate state writes.

Per the Bible's §5.8.1 (authored prior to this doc) the
alignment choice is a player pick via
`ChoicePillarLightDark` UI, firing synced to the *Last
Words* chorus-1 line at 66s from song start. That is the
**canonical alignment moment of the whole game**, and it
is independent of whether the trial verdict was overturn
or sentence-passed.

Interaction between the two:
- **Overturn + Light:** the Authority's delay is granted
  and the player commits to carrying forward what the
  Engineer died for.
- **Overturn + Dark:** the Authority's delay is granted
  but the player chooses to let the Engineer's thought
  die uncarried. The Engineer survives the match, the
  legacy does not.
- **Sentence passed + Light:** the Engineer is executed,
  the player carries the legacy forward. Canonical Act 2
  opener: *the Engineer is dead, the Potential lives.*
- **Sentence passed + Dark:** the Engineer is executed
  and the player lets the thought die with him. Canonical
  Act 2 opener: *the Engineer is dead, the Empire wins
  quietly.*

All four combinations are canon-safe and fully authored
through Acts 2+.

## 6. Runtime state writes

At match end §5.8 writes:

```ts
interface GameState {
  // ... existing fields ...

  /** §5.8 trial outcome. Written once at match end. */
  act1_authority_outcome: "overturn" | "sentence_passed";

  /** Back-compat completion flags (existing). */
  act1_authority_defeated?: true;       // if outcome === "overturn"
  act1_authority_sentence_passed?: true; // if outcome === "sentence_passed"

  /** Cycle + Act completion (existing). */
  act1_cycle_c_complete: true;
  act1_complete: true;

  /** §5.8.1 alignment — written by ChoicePillarLightDark,
   *  not by the match itself. Present here for
   *  completeness only. */
  lightDarkAlignment: "light" | "dark";
}
```

Exactly one of `act1_authority_defeated` /
`act1_authority_sentence_passed` is set; the
`act1_authority_outcome` string is the canonical read
(the two boolean flags are kept for back-compat with
existing Acts 2+ code that references them by name).

### 6.1 Pre-match advisory

Because §5.8's phase restrictions are aggressive, the
player's deck composition at §5.8 entry determines
whether the match is playable. To prevent a soft-lock, the
pre-match screen checks deck balance:

```
required_per_phase = {
  defensive: 2,          // for phase 1
  narrative: 2,          // for phases 2 + 9
  evidence: 4,           // for phases 3 + 4 + 5
  reactive: 4,           // for phases 6 + 7 + 8
  confession (optional): 0  // turn 7 allows but does not require
}
```

If the player's deck has fewer than the `required_per_
phase` counts for any category, a pre-match advisory
appears with a **Zenon-cell-styled transcript card** noting
which category is under-provisioned and suggesting a deck
edit. The advisory can be **dismissed** (the player can
enter §5.8 under-provisioned if they want) — it is
informational, not blocking.

Dismissed advisories do not persist; the player sees the
advisory every time they enter §5.8 with an under-
provisioned deck, until they either adjust the deck or
accept the match with a deliberate *"I understand this
match will be harder"* confirmation step.

## 7. Open design items

1. **Card-category metadata.** The schema currently only
   tags cards with `deckLeaning` and damage values. The
   §5.8 restrictions require a new per-card metadata set:
   `trial_categories: ("defensive" | "offensive" |
   "narrative" | "evidence" | "reactive" |
   "confession")[]`. Author this schema extension in a
   separate PR before §5.8 runtime implementation, and
   backfill categories for every existing Dischordia
   card in the live pool.
2. **Flavor for the "Counsel —" violation messages.** The
   Bible's §5.8 canon has the Authority speaking only
   once (*"What do you say to the charges?"*). The
   violation-message voice — is it the Authority, or a
   third-party court-clerk voice? User decision needed;
   the spec above uses *"Counsel —"* as a placeholder
   that reads as court-clerk.
3. **Phase-end animation.** Each phase transition could
   be a beat in the match — a brass court-bell chime, a
   brief transcript-column separator rendered with the
   phase name. Worth spec'ing visually before
   implementation; worth confirming it doesn't break
   pace. Author before art pass.
4. **Turn 10 verdict animation.** The resolution itself
   is silent in the current spec (no card played; the
   verdict stream balance simply reads out against the
   threshold). A visual beat — the balance gauge
   animating up/down to its final value, the threshold
   line lighting, the verdict word ("OVERTURN" or
   "SENTENCE") rendering briefly in Empire serif before
   the §5.8.1 Last Words full-song cutscene fires —
   would give the turn dramatic weight. Author decision
   on scope.

## 8. Forward-compatibility notes

§5.8's trial-phase mechanic is **one-shot**. No Act 2+
match reuses the 10-phase structure directly. However:

- **The <TranscriptColumn> component is reused**, per
  `public-witness-ui-spec.md` §8's forward-compat notes.
  §5.8 is the second consumer after §5.7.
- **The phase-restriction UX pattern** (category-gated
  card plays with rust-orange outline rejection)
  graduates to an Acts 3+ engine primitive usable for
  any scripted-choreography card match. Name the
  enforcement component generically
  (`<PhaseRestrictedMatchField>` or similar).
- **The verdict-threshold arithmetic** is §5.8-specific
  and does not need to graduate.
