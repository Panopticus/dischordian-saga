# Act 6 Confession-Close Portrait Cinematics

**Status:** design doc. Ships alongside the schema/registry in audit/16 PR 32.
Closes audit/15 finding **C4** ("confession-close stances have no cinematic
punctuation").

## Why these exist

Pre-audit, the seven confession-close stances at the end of Act 6 (`empathy`,
`challenge`, `refusal`, `reluctant_ally`, `partial`, `oracle_sense`,
`practical`) shipped as text-only choices. The player picked one of seven
buttons; the chosen stance flag fired; the room moved on.

The Cinematic-Director audit voice flagged this as the saga's most
visually-undershot beat: Act 6 is the act where the relationships
**change shape**, and the confession close is the moment that change
becomes legible. Text-only landing means a beat with two-and-a-half-acts of
relational accumulation behind it resolves with a button press. The audit'd
fix: insert a brief portrait reaction from each of the two listeners
(Elara and The Human) before the flag-set, so the choice carries weight
the relationship has earned.

## Scope

**14 cinematics.** 7 stances × 2 characters. Each cinematic is short
(3–5 seconds), one portrait crossfade with one VO line over an optional
ambient audio shift. The cinematics fire in sequence (Elara first, then The
Human) before the existing flag-set.

This is not a major cutscene set. Each cinematic is the equivalent
production-cost of a single "wheel-followup" reaction beat (the cluster
audited in C1 and backfilled in #537). The 14 are scheduled as a single
production block because they share a setup (the confession room, the
default lighting, the listener's chair from earlier in the act) and so
cost-share the asset framing.

## Naming convention

```
cinematic_act6_confess_<character>_<stance>
```

Where:
- `<character>` ∈ `elara` | `the_human`
- `<stance>` ∈ `empathy` | `challenge` | `refusal` | `reluctant_ally` |
              `partial` | `oracle_sense` | `practical`

This convention mirrors the wheel-followup ids (`cinematic_wheel_followup_…`)
and the human-reveal-stage ids (`cinematic_human_reveal_…`) — so the
cinematic-registry consumer (queued for a follow-up runtime PR) can
look up by id without per-surface special-casing.

## Per-cinematic specs

Each row authored to the same shape: trigger flag, listener, target
expression, VO direction, visual treatment, runtime length.

### Elara's reactions

#### `cinematic_act6_confess_elara_empathy`
- **Trigger flag:** `act6_confession_close_empathy`
- **Listener:** Elara (her confession was just heard with empathy)
- **Crossfade-to expression:** `vulnerable` (her `namedExpressions.vulnerable` URL)
- **VO direction:** "She had not braced for that. The held-breath is real, brief, and entirely hers." Existing voId `elara.act6.confession_close.empathy.t1` (to author).
- **Visual treatment:** 200ms crossfade FROM `neutral` TO `vulnerable`. No additional camera move; the picture goes still on her face. Subtle warm-amber bloom tints the portrait edge for the held beat.
- **Length:** 3.5s total (200ms crossfade + 2s hold + 1.3s release).

#### `cinematic_act6_confess_elara_challenge`
- **Trigger flag:** `act6_confession_close_challenge`
- **Listener:** Elara
- **Crossfade-to expression:** `concerned`
- **VO direction:** "She pushes back. Not defensively — she's been through enough that defensive isn't the read. She challenges back because the player has just given her the dignity of a real answer to challenge." voId `elara.act6.confession_close.challenge.t1`.
- **Visual treatment:** 150ms harder cut FROM `neutral` TO `concerned`. A faint cyan ridge pulses once on the portrait frame (machine-route legibility cue without forcing the route on the player).
- **Length:** 4s.

#### `cinematic_act6_confess_elara_refusal`
- **Trigger flag:** `act6_confession_close_refusal`
- **Listener:** Elara
- **Crossfade-to expression:** `concerned`
- **VO direction:** "Not anger; not surprise. The slow read of someone who has been refused before and is taking inventory of where this refusal sits in the cumulative ledger." voId `elara.act6.confession_close.refusal.t1`.
- **Visual treatment:** 250ms slow crossfade. Portrait edge dims by 8% — the door closing on warmth without slamming.
- **Length:** 4.5s.

#### `cinematic_act6_confess_elara_reluctant_ally`
- **Trigger flag:** `act6_confession_close_reluctant_ally`
- **Listener:** Elara
- **Crossfade-to expression:** `speaking`
- **VO direction:** "She accepts. The acceptance is plain: no warmth offered, no distance imposed, just the agreement to keep walking together. The portrait should read as a person ready to be useful." voId `elara.act6.confession_close.reluctant_ally.t1`.
- **Visual treatment:** 200ms crossfade. Tiny forward-lean micro-animation (3px vertical) so the portrait reads as engaged rather than passive.
- **Length:** 3.5s.

#### `cinematic_act6_confess_elara_partial`
- **Trigger flag:** `act6_confession_close_partial`
- **Listener:** Elara
- **Crossfade-to expression:** `vulnerable`
- **VO direction:** "Partial is honest. The face that hears partial isn't disappointed — partial is what the truth actually is." voId `elara.act6.confession_close.partial.t1`.
- **Visual treatment:** 200ms crossfade. The portrait holds. No bloom, no edge effect. The cleanness IS the treatment — partial doesn't decorate.
- **Length:** 4s.

#### `cinematic_act6_confess_elara_oracle_sense`
- **Trigger flag:** `act6_confession_close_oracle_sense`
- **Listener:** Elara
- **Crossfade-to expression:** `vulnerable`
- **VO direction:** "The Oracle-cluster gets read aloud. She catches it. The catch happens in her face before the words: a pattern-recognition flash, an exhale, a re-settle." voId `elara.act6.confession_close.oracle_sense.t1`.
- **Visual treatment:** 250ms crossfade. A faint violet shimmer crosses the portrait frame once — the Oracle aesthetic. The shimmer is subtle (20% opacity peak) so it reads as atmosphere, not effect.
- **Length:** 4.5s.

#### `cinematic_act6_confess_elara_practical`
- **Trigger flag:** `act6_confession_close_practical`
- **Listener:** Elara
- **Crossfade-to expression:** `neutral`
- **VO direction:** "The transaction gets named. She approves of the naming because it doesn't pretend to be more than it is. Her face goes lighter — not warmer, just lighter, like a weight has been spoken aloud and put down." voId `elara.act6.confession_close.practical.t1`.
- **Visual treatment:** 200ms crossfade. Portrait brightness lifts 6% over the hold. No colour shift. The lift IS the language.
- **Length:** 3.5s.

### The Human's reactions

#### `cinematic_act6_confess_the_human_empathy`
- **Trigger flag:** `act6_confession_close_empathy`
- **Listener:** The Human (his confession was just heard with empathy)
- **Crossfade-to expression:** `amused`
- **VO direction:** "He has been heard with care before. He knows what the cost of that care is. The amusement is the small reflexive smile someone gives when they've been seen accurately." voId `the_human.act6.confession_close.empathy.t1`.
- **Visual treatment:** 200ms crossfade. The static-shimmer effect on his portrait dampens by 30% for the duration — the audit'd visual language for "the lover-route reduces the noise in the signal."
- **Length:** 3.5s.

#### `cinematic_act6_confess_the_human_challenge`
- **Trigger flag:** `act6_confession_close_challenge`
- **Listener:** The Human
- **Crossfade-to expression:** `speaking`
- **VO direction:** "He likes being challenged. Not in a fight-back way — in a 'finally someone is bringing the actual question to the table' way. The face gets sharper, more present." voId `the_human.act6.confession_close.challenge.t1`.
- **Visual treatment:** 150ms cut. Static-shimmer bumps UP 15% (he's animated by the challenge — more signal, not less). Faint red rim-light.
- **Length:** 4s.

#### `cinematic_act6_confess_the_human_refusal`
- **Trigger flag:** `act6_confession_close_refusal`
- **Listener:** The Human
- **Crossfade-to expression:** `neutral`
- **VO direction:** "The door's been refused before. He acknowledges the refusal in the way you'd acknowledge a thermostat reading: precise, neither offended nor surprised, just noted." voId `the_human.act6.confession_close.refusal.t1`.
- **Visual treatment:** 200ms crossfade. Static-shimmer holds steady. Portrait edge cools 8% — the same dimming Elara's portrait does, mirroring the room temperature.
- **Length:** 4.5s.

#### `cinematic_act6_confess_the_human_reluctant_ally`
- **Trigger flag:** `act6_confession_close_reluctant_ally`
- **Listener:** The Human
- **Crossfade-to expression:** `speaking`
- **VO direction:** "He extends the practical handshake. The face reads as a man who has had this exact conversation with a hundred former colleagues at this exact moment in their respective collapses, and is fluent." voId `the_human.act6.confession_close.reluctant_ally.t1`.
- **Visual treatment:** 200ms crossfade. Subtle nod animation (4px vertical, eased). Static-shimmer holds.
- **Length:** 3.5s.

#### `cinematic_act6_confess_the_human_partial`
- **Trigger flag:** `act6_confession_close_partial`
- **Listener:** The Human
- **Crossfade-to expression:** `vulnerable`
- **VO direction:** "Partial is the only honest answer to most questions. He has been told this many times by people he loved. He hears partial as care, not failure." voId `the_human.act6.confession_close.partial.t1`.
- **Visual treatment:** 250ms slow crossfade. Static-shimmer dampens 40% — the strongest dampen in the set. Partial is the closest he gets to a clean signal in this conversation; the visual language carries that.
- **Length:** 4.5s.

#### `cinematic_act6_confess_the_human_oracle_sense`
- **Trigger flag:** `act6_confession_close_oracle_sense`
- **Listener:** The Human
- **Crossfade-to expression:** `amused`
- **VO direction:** "Oracle is his favourite tongue. The amusement is genuine: he likes when someone reads the saga the way he does — pattern-aware, retroactively-organised, comfortable with not naming the pattern out loud." voId `the_human.act6.confession_close.oracle_sense.t1`.
- **Visual treatment:** 200ms crossfade. Violet shimmer crosses the portrait frame (mirrors Elara's Oracle treatment but at 35% opacity — more saturated; he leans further into the aesthetic).
- **Length:** 4s.

#### `cinematic_act6_confess_the_human_practical`
- **Trigger flag:** `act6_confession_close_practical`
- **Listener:** The Human
- **Crossfade-to expression:** `neutral`
- **VO direction:** "The cleanest close. Practical is the language he prefers between people who have done the work and don't need to dress the result up. Brief acknowledgement, faint forward-lean, signal-out." voId `the_human.act6.confession_close.practical.t1`.
- **Visual treatment:** 150ms hard cut. Static-shimmer dampens 25% (less than partial; more than challenge). Brightness lifts 4%.
- **Length:** 3s — the shortest in the set; practical doesn't linger.

## Sequencing during the confession close

The two cinematics fire in sequence after the player picks a stance:

1. **Elara reacts first** — she was the first listener in the act-6 frame.
2. **0.5s pause** — gives the player a beat to register her reaction.
3. **The Human reacts second** — closing the listener pair.
4. **Existing flag-set fires** — `act6_confession_close_<stance>` lands as it did pre-audit.

Total inserted runtime: ~7–10 seconds depending on stance. Skippable per the
existing player-skip convention (single click dismisses to next beat).

## What this PR ships

- **This document** — the authoring source-of-truth.
- **`apps/shared/act6ConfessionCinematics.ts`** — typed registry mirroring
  every cinematic spec above so the runtime consumer (queued) can look up
  by `(stance, listener)` without re-parsing the doc.
- **`apps/shared/act6ConfessionCinematics.test.ts`** — invariants: every
  (stance × listener) combo has an entry, ids match the convention, no
  duplicates, every entry has a non-empty VO direction.

## What this PR does NOT ship

- **Cinematic asset files (audio, visual transitions).** The 14 MP3 lines +
  the per-cinematic shader/visual configs are produced by the audio + art
  pipelines respectively. The schema reserves the slot; the assets land
  separately.
- **Runtime consumer.** The Act 6 confession-close handler in
  `Act6CardLadderPage.tsx` (or wherever the stance buttons live) needs to
  read the registry, dispatch the two cinematics in sequence, then fire the
  flag. That's the consumer follow-up PR.
- **Integration into existing post-stance flow.** Some stances may already
  trigger non-portrait cinematic moments (slideshow / song-cinematic
  drops); reconciling the new portrait reactions against the existing
  cinematic flow is part of the consumer follow-up.

## Production checklist (for the asset team)

- [ ] 14 VO lines authored + recorded (per the per-cinematic VO direction
      above).
- [ ] 14 portrait-crossfade configs (target expression, duration, optional
      bloom/shimmer effects) implemented in `AnimatedPortrait` or its
      successor.
- [ ] 1 per-character "static-shimmer dampen" parameter wired (currently a
      visual constant on The Human's render path; needs to accept a
      per-cinematic override).
- [ ] 1 violet shimmer overlay shader (Oracle aesthetic) — can be reused
      across both Elara's and The Human's `oracle_sense` reactions.
- [ ] Skip-handling — confirm the existing single-click skip dismisses
      both cinematics in sequence.
- [ ] Accessibility: each cinematic's VO line has a transcript surface in
      the existing voManifest convention.
