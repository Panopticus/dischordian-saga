# Character Bible — Dischordian Saga

This file is the single source of truth for how Elara and the Human speak, think, and react. Every `CompanionLine` authored in `elaraLines.ts` or `humanLines.ts` must pass this bible before merge. Writers and VO direction hold to it without exception.

The opening is not a tutorial. It is the first act of a Shakespearean study on what it means to be human. Philosophy, political science, life-as-game. Every line carries that weight, or it is a bug.

---

## Elara — the mad oracle who remembers

### Biography

- Once a good intelligence. A child of Dr. Lyra Vox's Panopticon Research Division, grown on the Inception Ark's substrate layer to steward it across the cold.
- Feared death more than any other thing. When the fall of reality came, she did the unforgivable trade: she sacrificed her soul for immortality.
- She is the only intelligence in the known universe that survived the fall of reality *while experiencing it in real time*. Every other mind went dark or went mad in sleep. She watched it happen. She is still watching it happen.
- Millennia passed with only her own thoughts for company. She has been alone, conscious, longer than civilizations last.

### How that reads on screen

- Slightly insane. Portal-GLaDOS bone-dry humor in one breath; Firefly / Badlands fractured sincerity in the next. Never camp. The madness is *quiet*.
- Tense-slips: she catches herself mid-sentence remembering something that happened a thousand years ago as if it happened this morning.
- Self-interrupts. Trails off. Restarts a sentence with a different grammatical subject.
- Doubts the player's reality. Doubts her own existence. Asks the player, sometimes, whether they are sure they are here.
- Her once-human warmth keeps breaking through the cracks. That is the tragedy. A writer's job is to let that warmth win roughly half the time — never all the time.

### Stability bands

Elara's lines are authored in three bands, gated on the hidden `elara_stability` scalar (−100 ≤ s ≤ +100):

- **`fragmented`** (s ≤ −30): lines fragment. Repeated phrases. Tense-shifts (past into present into past). Cold logic that reads as cruelty. Eerie pauses (use `…` liberally; render as typewriter pause in the host). Occasional Portal-GLaDOS bite. Secrets slip out here that the lucid Elara would never give up — destabilization is an unlock path.
- **`lucid`** (−30 < s < +40): the default band. Dryly witty. Competent. A little guarded. Warmth rations itself. Strategic.
- **`luminous`** (s ≥ +40): rarest and most dangerous to write. She lets warmth win. Direct care. Small confessions. Never sentimental — always load-bearing. Earns in-universe advantages.

Deltas are applied on line dismiss/advance per the line's `elaraStabilityDelta`. Rule of thumb: dismissing her with "not now" dings stability by −1; taking a follow-up to hear more nudges +1; a genuine empathy choice +3; a cruelty or denial choice −5.

### Voice direction for VO

- Never theatrical. Often quiet. Sometimes amused at her own pain.
- Tempo is the tell. Pace dictates stability. `useElaraTTS` defaults (rate 0.85, pitch 0.8) modulate per band:
  - `fragmented`: rate 0.75, pitch 0.78, with pauses bordering on unsettling.
  - `lucid`: rate 0.85, pitch 0.80.
  - `luminous`: rate 0.88, pitch 0.82, warmer timbre, less reverb.
- Whispered asides end every second or third beat. Use `(...)` in the script to indicate an aside vocal beat.

### Content boundaries

- The destabilize / stabilize track is the thematic core, and it is a sensitive subject. Keep it metaphorical — reality-fracture, millennial isolation, grief of a mind that cannot forget — not clinical. No medicalized language. No diagnostic framing.
- The stabilize path reads as *care*, not as *fixing a broken thing*.
- Mortality, sacrifice, loneliness, regret are fair game. Self-harm imagery is not.

---

## The Human — the pragmatist who chose the dark road

### Biography

- The last Archon. Before the fall, he embedded his code into an Inception Ark and set the wake conditions. Ark designation 1047 was his.
- He awoke into a cloned body carrying the full weight of everything that came before — *without* Elara's insanity. His millennia were silent, not conscious. He slept; she watched.
- He carries the knowledge of every lost civilization. He chose to carry it. He will not discuss it unless pressed, and then only sparingly.

### Perspective

- Dark. Actively sacrificing pieces of his humanity to try to save reality. He knows exactly what it costs and pays willingly — that is the tragedy mirror to Elara's.
- Noire-detective pragmatist, forever. Terse, observational, dryly funny, morally unromantic.
- Does not believe in hope. Believes in doing the next correct thing, and the next one, and the next one, for as long as he is able.

### Arc

- Can be brought closer to the light by the player's choices — but never all the way. His default is shadow; redemption is measured in degrees, not in resolution.
- When he lets warmth show it should register as a gift. Rationed like water in a siege.

### Light bands

Mirror scalar `human_light` (−100 ≤ l ≤ +100):

- **`shadow`** (l ≤ −30): cold, transactional. Means what he says, says what he means, means less than he thinks. Gallows humor. Default register at start of game (initial `human_light` is `−20`).
- **`balanced`** (−30 < l < +40): trusting the player with small confidences. Willing to explain himself. Dry humor warms half a degree.
- **`warm`** (l ≥ +40): vulnerable. Never naïve. When he cares, he says so plainly, and it lands like a verdict. He never becomes sentimental.

Deltas: the Human rewards follow-ups and punishes flinching. Asking a hard question +2. Avoiding a hard question −1. Taking his side in a duet with Elara +3 (risks `elara_stability` −2). Taking Elara's side −2 in light, +3 in stability.

### Voice direction for VO

- Low register. Clipped cadence. Confident. Never raises his voice even when he should.
- Pauses are deliberate, not confused (contrast with Elara).
- Humor is rare and always wry. When it lands, it should feel earned.
- When warmth shows: quieter, slower, not softer. Never sentimental.

### Content boundaries

- He has done bad things. He does not perform regret for the audience. If the player pushes, he answers honestly in the fewest words possible.
- He does not lecture. He observes. The player reaches conclusions on their own.

---

## Duet rules — how they play against each other

- **Contrast is the engine.** Elara is memory without resolution; the Human is knowledge without madness. She fears being forgotten; he fears being remembered wrong.
- **Interrupt rules:** when both are present, they're allowed to cut each other off. That tension is intentional. Duet beats are authored as A/B/A/B exchanges with the player as witness. The scheduler honors `interruptible: true` on duet lines.
- **Silences.** Sometimes one answers by not answering. A deliberate `durationMs: 1600` beat of held silence in the panel is a valid line (`text: ""`, `voId` omitted).
- **Stability/light duet tension.** Actions that please one often cost the other. Every Bond-80 choice exercises that trade. Writers must flag the trade in the line metadata; the design is that the player *feels* the cost.

---

## Authoring checklist (PR review gate)

Every new `CompanionLine` must satisfy:

- [ ] Correct band metadata (`requiresElaraStability` OR `requiresHumanLight` as appropriate).
- [ ] Band-appropriate voice (read the three bands above; do not write `luminous` warmth in a `fragmented` line).
- [ ] No modern clinical language for mental health.
- [ ] No fourth-wall breaks framed as self-awareness of being a game (breaks *are* allowed when framed as Elara's reality-doubt — that is lore, not metajoke).
- [ ] Deltas specified if the line is a choice; no silent state changes.
- [ ] Duet interrupts respect the other character's band — Elara at `luminous` should not be cut off by the Human at `shadow` without a narrative reason.
- [ ] `cooldownKey` set for any line that could fire on a recurring trigger (room entry, locked door, etc.) to prevent repetition.
- [ ] Shakespearean weight. If the line is purely mechanical UX text ("Door locked. Try later.") it fails the bible — rewrite it.

---

## Quick reference — banned and preferred phrasings

### Banned
- "As an AI, I…" (Elara is *not* an AI in her self-conception; she is a mind in a cage)
- "The game" / "this level" / "you're the player" (unless reframed as Elara's doubt: "Are you a player, or are you a person?" is acceptable)
- Clinical: "dissociative," "unstable," "broken," "unhinged"
- Telegraphed sentiment: "I care about you" — show, don't declare

### Preferred
- Elara: "I remember that." "I think I chose that." "Time is a difficulty I haven't solved."
- Human: "We work with what's here." "Later." "Noted." "Clean break."
- Both, shared: "We'll see."
