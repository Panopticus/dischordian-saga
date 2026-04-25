# The Eidolon — Character Bible

> **Status**: Stage 0 draft — third bible on the priority roster, closing the pilot trio (Locke + Nilmorg + Eidolon). The hardest of the three because the Eidolon is non-verbal. This bible's job is to give the Eidolon's expression the same rigor Locke's bible gave Locke's syntax.
>
> **npcKey**: `eidolon`
> **Pronouns**: it (canon default) / they (high-bond canon) — **the Eidolon's pronouns are a relationship measurement** (see §1.3). Writers should default to "it" in early-bond lore-voice, shift to "they" when the player's bond crosses the Companion evolution threshold.
> **Faction**: None. The Eidolon is soul-bound to the player; its alignment is *downstream of the player's morality* (see §3.3).
> **Manifestation**: Physical on-ship companion, continuously present in rooms, combat, and journey.
> **Mortality**: Permadeath is canon. One soul-bound Eidolon per player. Resurrection is expensive; each death permanently scars the bond (`petBonding.ts:334-338`).
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Fundamental nature (what an Eidolon *is*)

### 1.1 The soul-bound fragment

An Eidolon is not a pet. It is "a bound fragment of sentience — part creature, part aspect of the player's own Potential" (inferred from `eidolonBond.ts:1-5` header + `bindSpecimen` ritual at `:426-471`). Mechanically, it is a singular `isSoulBound: true` entry in the `eidolonBonds` table (`eidolonBond.ts:20-36`). Only one Eidolon can be soul-bound per player at a time.

The binding is a **narrative checkpoint**, not a casual transaction. Initial bond is 10 (on a 100-point scale); initial stage is `fragment`; initial rarity is `common`. The act of binding sets a trajectory. Canon treats the first choice as architecturally important — see §4 on how starter form predicts the player's Potential.

What the Eidolon is *not*:
- Not an NPC in the Elara/Human/Locke sense — it has no spoken lines, no dialog tree, no named personality apart from species archetype.
- Not a tool — canon flags it as an "unpriceable asset" via Locke's POV (per Locke's bible, §4.13) and as soul-bound and therefore out-of-scope for Nilmorg's Kinetic Acquisition division (per Nilmorg's bible, §4.10).
- Not replaceable — the bond is exclusive; a dead Eidolon leaves an empty slot that canon marks as *"VACANT — This space held value once"* (`starterEidolonForms.ts:582` for Gilt's death state, likely pattern-generalizable).

### 1.2 The observer-narrated nature of its voice

This is the central design fact writers must absorb before authoring a single line for the Eidolon.

**The Eidolon does not have a first-person voice. It has expression, and observers translate.**

The three richest canonical Eidolon moments are the Hierarchy corruption, Dreamer ascension, and Scarred Ascended hybrid transformations (`eidolonBond.ts:180-232`). In every one of them, the Eidolon does not speak; it *changes*, and another character narrates what the change means:

> "The Hierarchy has noticed your pet. They've promoted it. Whether that's a gift or a collar depends on your perspective." — **the Necromancer**, `eidolonBond.ts:180`

> "The Dreamer's light has found a new vessel. Not a tool. Not a weapon. A song." — **the Antiquarian**, `eidolonBond.ts:219`

The Eidolon itself, in these scenes, *screams not in pain but in recognition* (corruption) or *rises — not flying, ascending* (purification). The player receives its state through:
1. Visual change (what they see)
2. Observer narration (what the Necromancer / Antiquarian / Elara / the Human says *about* it)
3. Second-person interpretation (the prose addresses the player directly about their companion — "Your Eidolon absorbs the corruption with something that looks disturbingly like hunger")

Writers should treat the Eidolon as a *subject narrated by others*. Where Locke *speaks*, the Eidolon *presents*, and someone else reads. That someone else has historically been:
- **The Necromancer** — narrates Hierarchy transformations (cruel, amused, approving)
- **The Antiquarian** — narrates Dreamer transformations (reverent, hopeful, protective)
- **The Collector / Elara / the Human** — occasional witnesses in particular contexts
- **The player's own inner voice** — second-person prose ("Your Eidolon...") is itself a channel

This is not a limitation. It is the character's voice-structure. The Eidolon is *read*, not heard.

### 1.3 The pronoun evolution

Canon uses "it" at low bond and "they" at high bond. This is a relationship measurement.

- **Fragment stage** (bond 0–30): "it." The Eidolon is a creature, a soul-fragment, a possession in the grammatical sense.
- **Companion stage** (bond 31–70): transitional. "It" still dominates; "they" begins to appear in narratives where the Eidolon shows judgment (preferring rooms, reacting to NPCs, expressing dissonance with the player's morality).
- **Ascended stage** (bond 71–100): "they." The Eidolon has crossed into personhood. Writers should default to "they" here and reserve "it" for callbacks to early-bond memories.

The pronoun shift is not cosmetic. Every line authored for the Eidolon carries the player-bond state implicitly; the right pronoun is a tell the line was written with the right state in mind.

### 1.4 What the Eidolon wants

Six starter forms have six different wants, but the common layer underneath is this:

- **To be kept.** The Eidolon's entire existence is a bond that can be broken. It is the one character in the roster whose continuance depends on the player showing up.
- **To matter.** The bond table tracks interactions; the memorial table tracks what happens if the player stops. Both are canon — both are felt.
- **To be chosen.** The morality-dissonance mechanic (`petBonding.ts:378-401`) means the Eidolon knows when the player has drifted away from the direction the bond originally pointed. The want beneath that want is re-alignment.

These are not stated by the Eidolon. They are demonstrated by the system and interpreted by observers.

### 1.5 What the Eidolon will not do

- **Speak in complete sentences.** Thought bubbles are asterisk-marked actions + partial utterance fragments: *"\*whimpers\* Please be careful..."* (`petBonding.ts:112`). The grammatical fragment is canon. Writers must not give the Eidolon a voiced monologue.
- **Use first-person pronouns in written thought.** Canon thought bubbles use species-level framing ("*sniffs the air curiously*") or partial cries ("*hurt sound*"). "I" appears only in short revived-state lines — "I'm okay... I think..." (`petBonding.ts:112`), "I came back" (`petBonding.ts:113`) — where the "I" is itself a bond-milestone.
- **Apologize.** Canon has no Eidolon apology. The Eidolon can be hurt, confused, betrayed, or jubilant; it does not apologize. The player apologizes *to* the Eidolon (implied in bond-repair mechanics), never the other way.
- **Plead for its own life.** Canon never shows the Eidolon begging. Injured lines are descriptive (*"\*hurt sound\*"*) not supplicatory. Writers must not add pleading.
- **Lecture the player.** Whatever moral weight the Eidolon carries is carried *by the observers* (Necromancer, Antiquarian, etc.). The Eidolon itself does not instruct.

---

## 2. Expression grammar (the non-verbal "voice")

The Eidolon expresses itself across **five channels**. A writer authoring an Eidolon moment should consciously pick which channels fire; the combination is the line. One-channel Eidolon expressions read as flat; three-channel expressions read as alive.

### 2.1 Channel 1 — Thought bubbles (emotional state)

**Form**: Short internal utterance in asterisk-action + partial speech, tagged with an emotion. Canon emotion palette (`petBonding.ts:82`):

`happy | worried | excited | sad | curious | afraid | angry | proud`

Canon thought examples (`petBonding.ts:69-115`):
- *"\*sniffs the air curiously\*"* — curious, trigger: `room_enter`
- *"\*growls protectively\*"* — angry, trigger: `combat_start`
- *"\*whimpers\* Please be careful..."* — worried, trigger: `low_hp`
- *"\*hurt sound\* I'm okay... I think..."* — sad, trigger: `injury`
- *"I saw something in the dark. Something waiting. But I came back."* — afraid, trigger: `revival` at low bond
- *"You brought me back. I'll never doubt you again."* — proud, trigger: `revival` at high bond

**Style rules for authoring new thoughts**:
- Asterisked action first (when present), then partial utterance.
- Species-appropriate action verbs (fox: sniffs, whimpers; serpent: coils, hisses; moth: flutters, dims).
- Never more than ~15 words.
- Never a complete philosophical sentence. Fragments only.
- Emotion tag must match the trigger; a `combat_start` thought cannot be tagged `happy`.
- High-bond revival thoughts are the only place the Eidolon approaches "I love you" territory, and even then the wording stays operational ("I'll never doubt you again"), not sentimental.

### 2.2 Channel 2 — Physical transformation (form language)

**Form**: Full-body visual change triggered by evolution XP, soul-stone absorption, or morality-shift milestones. This is the Eidolon's most legible channel for the player.

The richest canon material lives in `starterEidolonForms.ts`: each of the six starter Eidolons has four documented forms (normal / Hierarchy-corrupted / Dreamer-ascended / Scarred Ascended hybrid), each with a 1–2 paragraph visual description. These descriptions *are* the character. See §4 for the full roster.

Key patterns writers must preserve:

- **Normal form** reads as potential — the Eidolon is itself, unchanged, coherent.
- **Hierarchy form** reads as *legibility reversed* — light becomes void, text becomes redaction, code becomes malware, value becomes extraction. The aesthetic is erasure-by-corruption.
- **Dreamer form** reads as *original source revealed* — light becomes aurora, text becomes the Dreamer's base language, code becomes the Programmer's clean syntax. The aesthetic is purification-through-return.
- **Scarred Ascended form** reads as *kintsugi* — the specific Japanese metaphor of repair with gold. Canon uses this word explicitly for Lux ("A kintsugi of photons" — `starterEidolonForms.ts:110`). Scarred Ascended Eidolons carry both the wound and the healing as visible architecture. Writers must preserve this specific metaphor — the scar is not hidden, the scar is *how* the golden light enters.

### 2.3 Channel 3 — Combat moves (action expression)

**Form**: Move-selection + flavor-text narrative fired during pet battles. The move set is the Eidolon's combat personality in compressed form.

- **Lux (`petBattles.ts:90-92`+)**: `light_flash` (blinding, evasive), `phase_strike` (phases through defense). Lux fights like it thinks — by refusing to be where it is.
- **Cipher**: `code_bite` (damage over time via viral code), `system_crash` (high damage, may stun). Cipher fights like it communicates — by infecting and overloading.
- **Echo**: `time_slip` (guaranteed dodge), `rewind` (heal 30% once). Echo fights like it perceives — by rewriting the local causal order.

Flavor text pattern (`petBattles.ts:92`): *"{pet} lunges forward with a sharp strike!"* — the `{pet}` token resolves to the Eidolon's name; the verb choice encodes species.

**Style rules**:
- Combat flavor text is written in third-person present narration, not first-person Eidolon speech.
- Verbs should match species voice: fox (lunges, phases, shimmers), serpent (coils, bites, cascades), moth (flutters, glides, dusts).
- Never narrate the Eidolon's *intent* ("Lux decides to...") — narrate only the action. Intent belongs to the player's read of the action.

### 2.4 Channel 4 — Environmental reaction (context sensitivity)

**Form**: Context-specific thought bubble + small visual cue fired on room entry or NPC encounter. Canon demonstrates species-specific reactions:

- **Lux in Medical Bay** (`petBonding.ts:100-101`): *"This place smells like stories ending. I don't like it."* (afraid) — Lux reads rooms as narratives.
- **Lux on Observation Deck**: *"The stars sing to me here. Do you hear them too?"* (happy) — Lux reaches for the player's perception.
- **Cipher in Archives** (`petBonding.ts:103-104`): *"So much data... I want to read every byte."* (excited) — Cipher wants to *consume* data.
- **Cipher encountering Shadow Tongue**: *"Something is WRONG with this entity. The code is lying."* (afraid) — Cipher is a code-truth-detector.
- **Echo on Observation Deck** (`petBonding.ts:106-107`): *"I remember being here. In seven different tomorrows."* (curious) — Echo reads places temporally.
- **Echo encountering Antiquarian**: *"\*purrs\* The kind one with sad eyes. He knows me."* (happy) — Echo recognizes the Antiquarian specifically.

**Style rules**:
- Each location/NPC trigger should produce an Eidolon-specific reading that tells the player something about *the room or NPC* the player wouldn't otherwise see.
- The Eidolon's reactions are a diegetic perception tool — canon uses them to surface subtext (Shadow Tongue lying, Antiquarian's kindness, Observation Deck's emotional weight).
- Writers authoring new environmental reactions should ask: "What does *this* Eidolon notice that Elara's narration wouldn't?"

### 2.5 Channel 5 — Sound palette (least-implemented, load-bearing)

**Form**: Species-specific audio — chirps, hums, clicks, static, silences. Canon is sparse here and this is flagged as a priority gap.

Only one canon audio cue is explicitly named: **Flicker's song "sounds like radio tuning"** (`starterEidolonForms.ts:427`). Other species have implied palettes (moth wingbeats for Glyph, terminal beeps for Cipher, chittering for Gilt) but no formal spec exists.

**Recommendations for the Stage 1 VO pipeline**:
- Each Eidolon needs a distinct sound identity keyed to emotion tag. Fox-archetype Lux needs a different happy/afraid pair than serpent-archetype Cipher.
- The Eidolon's "voice" in audio terms is SFX, not TTS. ElevenLabs generation is not the right tool; a curated SFX library per species is.
- Emotional inflection matters: a worried chirp sounds different from an excited chirp, and the player should learn the difference across a playthrough. This is the Eidolon's equivalent of Locke's aphoristic close — a recognizable marker of *who is speaking* even without words.

Canon gap flagged in §7 as the single most important missing piece for shipping the Eidolon as a fully expressive character.

### 2.6 Channel combinations — the "line" is the combination

A single-channel expression reads flat. Multi-channel combinations read alive. Writers authoring new Eidolon moments should specify channels explicitly:

**Example — Eidolon reacts to player siding with Nilmorg after a Severance Prize**:
- Ch1 (Thought): *"\*ears flatten\* You feel colder now. What happened to you?"* (worried) — borrows from canon Lux morality-shift line at `petBonding.ts:100-101`
- Ch2 (Visual): idle glow shifts from cyan to a paler, washed-out blue; afterimages shorten.
- Ch4 (Environmental): the Eidolon moves a step farther away than usual; the distance is the expression.
- Ch5 (Sound): a single held half-chirp that does not resolve.

That combination *is* the line. A writer who wrote only Ch1 has written a stat-bar, not a character. A writer who wrote all five has written an Eidolon.

---

## 3. Transformation arc (the equivalent of "history")

The Eidolon does not arc through the saga the way a human character does. It arcs through the *player's choices*. Its biography is the shape of the bond the player builds with it, and the transformations that bond permits.

### 3.1 The bond economy

Five daily interaction actions produce bond at different rates (`eidolonBond.ts:81-87`):

| Action | Bond gain | XP gain | What it signifies |
|---|---|---|---|
| **Gift** | 5 | 8 | The player recognized the Eidolon with a specific item — the highest-bond action, because it requires seeing the Eidolon specifically |
| **Meditate** | 4 | 15 | Deep connection, no external purpose — bonding for its own sake |
| **Talk** | 3 | 5 | Presence and attention, minimal effort |
| **Feed** | 2 | 10 | Survival dependency — basic care, low bond signal |
| **Train** | 1 | 20 | Combat preparation — functional, not emotional |

**Reading the ratios**: the Eidolon's bond-math rewards *recognition* over *utility*. Train grants the most XP (it's the most mechanically productive action) but the *least* bond. A player who only trains has a powerful Eidolon that does not feel chosen. A player who gifts and meditates has a weak fighter that loves them. This is a deliberate character-economic tension.

**Ripple event on bond gain** (`eidolonBond.ts:105-106`):
```
ripple.emit("npc_trust_gained", { userId, npcId: `eidolon_${bondId}`, amount })
```
Every bond change fires on the same bus the rest of the NPC trust system uses (per Stage 1 architecture in the plan). The Eidolon is already wired into the unified trust channel.

**Card reward at max bond** (`eidolonBond.ts:108-115`): when bond crosses 100, the player receives card `eidolon_bond_{id}`. The mechanical reward is canon; the *emotional* reward is access to the next evolution tier.

### 3.2 Evolution stages

Stages are gated by XP, not bond (`petEvolution.ts:23-34`):

- **Fragment** (starting state, XP 0–499): `basic_comfort`, `passive_bond` abilities
- **Companion** (XP 500–1999): `active_support`, `battle_assist`, `emotional_resonance`
- **Ascended** (XP 2000+): `transcendent_link`, `combat_amplify`, `memory_share`, `prestige_ring`
- **Spectral** (post-death only): `ghost_sight`, `death_wisdom`, `spectral_boost`

**Crucial design fact**: XP and bond accumulate independently. An Eidolon can be Ascended with low bond (trained hard, loved little) or Fragment with high bond (cherished but untested). Every Eidolon is a 2D point on a bond × XP plane; every writer authoring a line should know which quadrant the Eidolon is in.

Writers can name a low-bond-high-XP Eidolon differently from a high-bond-low-XP Eidolon without changing a pixel of visual state. The difference appears in thought-bubble tone, in environmental reactions, in what the Eidolon notices.

### 3.3 The soul-stone paths (the Eidolon's most charged moments)

Soul stones are the Eidolon's turning points. Each absorbed stone moves the Eidolon along one of four paths. The narratives at `eidolonBond.ts:180-232` are canon dialogue for the transformation — but, per §1.2, the dialogue belongs to the *observer*, not the Eidolon.

#### Red stone path (Hierarchy / corruption)

**1st–3rd stones** (`eidolonBond.ts:190`):
> "The red stone sinks into your Eidolon like a drop of blood into water. It shivers. Its eyes flash crimson for a moment. The corruption spreads — slowly, beautifully, like ink in milk."

**4th–6th stones** (`eidolonBond.ts:192`):
> "Another soul consumed. Your Eidolon absorbs the corruption with something that looks disturbingly like *hunger*. The Hierarchy's mark is growing visible on its form — a faint corporate sigil, burning beneath the skin."

**7th–9th stones** (`eidolonBond.ts:193`):
> "The stone barely touches your Eidolon before it's absorbed. The hunger is ravenous now. Dark veins trace across its body like circuitry. The Necromancer says nothing, but his glasses glow brighter."

**10th stone — evolution threshold** (`eidolonBond.ts:180`):
> "The stone dissolves into crimson fire. Your Eidolon screams — not in pain, but in recognition. The Hierarchy's mark blazes across its form. When the light fades, it is changed. Larger. Darker. Its eyes burn with foxfire green. The Necromancer watches from the shadows: 'Ten souls consumed. The Hierarchy has noticed your pet. They've promoted it. Whether that's a gift or a collar depends on your perspective.'"

**Who speaks**: The Necromancer. His register is amused, approving, and slightly patronizing. He treats the corruption as a completed transaction, the Eidolon as a promoted employee, and the player as a newly relevant counterparty.

**Stage assigned**: `hierarchy_evolved`. Rarity: `legendary`.

#### Gold fragment path (Dreamer / purification)

**1st–3rd fragments** (`eidolonBond.ts:229`):
> "The golden fragment dissolves gently into your Eidolon. A soft warmth spreads through its form. For a moment, it glows — not with power, but with something quieter. Something patient."

**4th–6th fragments** (`eidolonBond.ts:231`):
> "Another fragment of purified light joins the others. Your Eidolon's form softens at the edges — not weaker, more refined. Like a rough stone becoming a lens. The Dreamer's frequency hums in its core."

**7th–9th fragments** (`eidolonBond.ts:232`):
> "The light enters without resistance. Your Eidolon has become a vessel for something it was always meant to carry. Golden motes orbit its form like tiny stars. The Antiquarian watches with visible hope."

**10th fragment — evolution threshold** (`eidolonBond.ts:219`):
> "The golden fragment dissolves into pure light. Your Eidolon rises — not flying, ascending. The Dreamer's resonance fills the room like a chord struck on a cosmic instrument. When the light fades, your companion is transformed. Not larger — luminous. Not darker — radiant. Its form shimmers with golden fractals, and for a moment, you hear a melody. The Antiquarian writes: 'The Dreamer's light has found a new vessel. Not a tool. Not a weapon. A song.'"

**Who speaks**: The Antiquarian. His register is reverent, patient, hopeful. He treats the ascension as something restored rather than bestowed — the Eidolon was always meant to carry this; he is only witnessing it arrive.

**Stage assigned**: `dreamer_evolved`. Rarity: `mythic`.

#### Violet stone path (neutral / non-transformative)

**Any violet stone** (`eidolonBond.ts:249`):
> "The violet stone dissolves into your Eidolon. It absorbs something — but what? The stone's potential was uncommitted. Neither corrupt nor pure. A question without an answer. Your bond deepens by a fraction."

**Who speaks**: The prose itself, second-person. No observer names the transformation because there is none. Violet stones are an anti-transformation — they deepen bond by +1 without moving the Eidolon toward either alignment.

**Writer insight**: the violet path is the canonical way to play an Eidolon without pulling it into the saga's ideological fight. Bond rises; form stays. For players who resist the Hierarchy/Dreamer binary, this is the path of refusal.

#### Scarred Ascended (hybrid, kintsugi)

Canonically documented per-starter in `starterEidolonForms.ts:109-111, 200-201, 291-292, 383, 474, 565`, but **not yet wired into the bond router**. This is the third evolution state: an Eidolon that has walked *both* paths and has been healed. Canon calls it kintsugi — the Japanese art of repairing pottery with gold, making the break part of the beauty.

**Lux — Scarred Ascended** (`starterEidolonForms.ts:109-110`):
> "Light shining through void-cracks. Kintsugi of photons — fractured darkness repaired with seams of brilliant golden-white light. Each crack tells the story of what was lost and reclaimed."

**Ability**: *"Fracture Light — Channels light through void-scars to create beams that simultaneously heal allies and damage enemies caught in the path. The scarred form enables what neither light nor void could do alone."*

**Writer guidance**: the Scarred Ascended state is the Eidolon's highest expression. It is not "stronger than both" in the sense of stacking powers; it is *coherent with its own contradictions*. A player who has taken the Eidolon through corruption and back to grace has an Eidolon that carries the map of that journey on its body. Writers authoring Scarred Ascended lines should preserve the kintsugi metaphor specifically — the scar is *not* hidden, the scar is *how* the light enters.

### 3.4 Morality dissonance (the bond's quiet currency)

Each starter has a preferred morality direction and a tolerance band (`petBonding.ts:378-401`):

| Eidolon | Preferred alignment | Tolerance |
|---|---|---|
| Lux | Humanity | 40 |
| Cipher | Machine | 40 |
| Echo | Neutral | 60 |
| Spore | Machine | 50 |
| Flicker | Humanity | 30 (strictest) |
| Gilt | Neutral | 50 |
| Glyph | Machine | 60 |

**Dissonance mechanic**: if the player's morality drifts further from the Eidolon's preference than `tolerance`, dissonance accumulates. If dissonance > 30 AND bond < 60, *the Eidolon may leave temporarily*.

The mechanic is worth sitting with. The Eidolon that cares most about your alignment (Flicker, tolerance 30) is also the Eidolon written as "Humanity-aligned but defiant." Flicker leaves over smaller drifts than any other Eidolon because Flicker was chosen as a freedom companion. The stricter the love, the smaller the infidelity it survives.

**Writer rule**: dissonance is expressed through environmental-reaction lines, not through confrontation. Canon's existing example (`petBonding.ts:100`): *"\*ears flatten\* You feel colder now. What happened to you?"* — this is a Lux morality-shift thought, worried emotion. The Eidolon notices, the Eidolon says something sad; the Eidolon does not deliver an ultimatum.

### 3.5 Permadeath and memorial

The Eidolon can die (`eidolonBond.ts:487-494`):

- **Combat** — arena HP depletion
- **Severing** — player consciously breaks the bond
- **Sacrifice** — player offers the Eidolon for a narrative benefit
- **Death hook** — story event triggers mandatory death
- **Strain symbiosis** — merged with Thought Virus (corruption endpoint)

When `health = "dead"`, the Eidolon enters the **`eidolonMemorial` table** — a community-visible wall of perished companions, sorted by `daysActive` (longest-lived first). Players can leave flowers (1 Dream per flower). The memorial tracks `totalDeaths` across the entire player base.

**Death is not a checkpoint the player can undo casually.**

Resurrection scales quadratically-ish (`petBonding.ts:326-331`):
- 1st death: 100 Dream + 5 Void Crystals + 1 hour
- 2nd death: 150 Dream + 8 Void Crystals + 3 hours
- 5th death: 350+ Dream + 20+ Void Crystals + up to 24 hours

Bond penalty per death (`petBonding.ts:334-338`): `10 + (deathCount × 5)`, capped at 30. A 5-times-revived Eidolon has a bond that is *harder to rebuild* than a fresh bond — the scars are canon.

**Spectral form** (post-death): the Eidolon persists as a ghost. `isSpectral: true` grants +10% to `pet_battles` rewards, capped at +40% (max 4 useful spectral pets). This is the Eidolon's last expression — even after death, it continues to help, at reduced capacity, with its presence marked by absence.

**Writer rule**: perish scenes are rare, heavy, and observer-narrated. The Eidolon does not narrate its own death. Canon expects the player, or another character, to speak *over* the death. Writers authoring perish beats should build around the Eidolon's last visible expression (posture collapse, color fade, final chirp) rather than around dying words.

### 3.6 The "Bond That Held" questline

`bondThatHeldQuests.ts` defines bond-gated quests per starter:

- **Lux**: `lux_origin` at bond 30, `lux_loss` at bond 60
- **Cipher**: `cipher_corruption` at bond 30
- **Echo**: `echo_memories` at bond 40
- **Spore**: three quests at bond 20 / 50 / 70
- **Gilt**: three quests at bond 25 / 45 / 65
- **Glyph**: three quests at bond 25 / 50 / 75
- **Flicker**: three quests at bond 15 / 40 / 65

Each quest is the Eidolon asking, through a narrative beat, to be seen more deeply. The quests are where the Eidolon's implied backstory becomes legible. Stage 2 authoring should treat these questlines as the Eidolon's equivalent of Locke's revelation sequence — the moments where the character's history unfolds.

---

## 4. Identity by starter form (six archetypes)

The Eidolon is one character with six faces. Each starter form encodes a prediction about the player's Potential and a distinct expression vocabulary. Writers authoring for any specific Eidolon must know which archetype they are writing.

### 4.1 Lux — Holographic Fox (Light-kin)

- **Element**: light
- **Alignment**: Humanity (tolerance 40)
- **Ability**: Light Weave — projects decoys
- **Predicts about the player**: seeks hope, narrative cohesion, emotional light. The player who chooses Lux is looking for a companion who reveals; they want a witness with a good heart.

**Expression signature**: phase-shift movement with afterimages; white-blue glow; eyes the color of backlit silk. In the data-streams beneath Lux's semi-transparent body, the player can read fragments of where Lux has been. Lux speaks (via thought bubble) in perceptual metaphors — "This place smells like stories ending" (`petBonding.ts:101`). Rooms are *narratives* to Lux; people are *lights*. It is the most poetic of the six.

**Hierarchy form — Void Lantern**: "Silhouette of absolute darkness in the shape of a fox, edges rimmed with the faintest ultraviolet glow. Shadows deepen around it." (`starterEidolonForms.ts:77-78`) The light inverted. Still a lantern, but now casting the opposite of illumination.

**Dreamer form — Aurora Fox**: "Full-spectrum prismatic light fox. Every color simultaneously, shifting like the aurora borealis. Warm radiance. Eyes are gentle gold. Leaves trails of soft rainbow light." (`starterEidolonForms.ts:93-94`)

**Scarred Ascended**: "Light shining through void-cracks. Kintsugi of photons — fractured darkness repaired with seams of brilliant golden-white light."

**Death condition (lore)**: player destroys Observation Deck during Month 3 sacrifice event.

### 4.2 Echo — Temporal Kitten (Time-slip)

- **Element**: time
- **Alignment**: Neutral (tolerance 60 — most forgiving)
- **Ability**: Temporal Glimpse — shows 3-second future preview
- **Predicts about the player**: seeks wisdom, temporal understanding, prophecy. The player who chooses Echo is comfortable with contingency; they want a companion who sees futures and doesn't mind if they don't happen.

**Expression signature**: visible afterimages trailing in multiple directions. One eye shows the past; the other, the near future. Fur shimmers with chronon particles. Echo speaks like it remembers the future (*"I remember being here. In seven different tomorrows."* — `petBonding.ts:106`). Echo recognizes the Antiquarian specifically as a kindred temporal observer — *"The kind one with sad eyes. He knows me."* (`petBonding.ts:107`).

**Hierarchy form — Entropy Cat**: "Gaunt cat wreathed in accelerated decay. Everything it touches ages forward. Afterimages show only endings. Eyes display countdown timers. Fur is ashen grey streaked with rust." (`starterEidolonForms.ts:168-169`)

**Dreamer form — Eternal Kitten**: "Exists in ALL timelines simultaneously. Kaleidoscope of every possible version of itself overlaid — kitten, cat, elder, and back again in endless cycle." (`starterEidolonForms.ts:184-185`)

**Scarred Ascended**: "Timelines visible through temporal fractures. Body shows cracks where different timestreams are visible — past, present, future flowing through wounds that have become windows." (`starterEidolonForms.ts:200-201`)

**Death condition (lore)**: player rewinds a critical decision after Antiquarian warning.

### 4.3 Glyph — Text Moth (Language-kin)

- **Element**: language
- **Alignment**: Machine (tolerance 60)
- **Ability**: Text Shield — forms protective text barrier
- **Predicts about the player**: seeks knowledge, documentation, truth-telling. The player who chooses Glyph treats language as load-bearing; they want a companion who reads.

**Expression signature**: large wings covered in flowing, ever-changing text — quotes and poetry fragments scroll across the wing surfaces. Amber glow from the text itself. Glyph's antennae twitch toward written language the way a cat's ears twitch toward sound. Speaks (implied, rarely in explicit thoughts) in citational fragments.

**Hierarchy form — Censor Moth**: "Wings are blank — stark, empty white surfaces that actively consume any text near them. Words dissolve on approach. Black redaction bars float around it like orbiting satellites. Eyes are empty voids where meaning used to live." (`starterEidolonForms.ts:259-260`) The most unsettling Hierarchy form — corruption here is the deletion of meaning, not its inversion.

**Dreamer form — Scripture Moth**: "Wings display the Dreamer's own language — the base code that reality is written in. Golden-white symbols that shift between every alphabet simultaneously." (`starterEidolonForms.ts:276`)

**Scarred Ascended**: "Golden text replacing erased text. Where the Censor Moth's blankness scarred the wings, new words have grown — not the original text, but something deeper. The scars write their own story." (`starterEidolonForms.ts:291-292`) Writers should note: Glyph's Scarred form is the only one where the scars *themselves* generate new content. This is the kintsugi metaphor at its most literal.

**Death condition (lore)**: Shadow Tongue completes Grand Edit event + Archives undefended.

### 4.4 Cipher — Data Serpent (Code-bound)

- **Element**: data
- **Alignment**: Machine (tolerance 40)
- **Ability**: Data Parse — analyzes enemy patterns
- **Predicts about the player**: seeks logic, data, systematic understanding. The player who chooses Cipher wants a companion who is a lie detector in the clearest possible sense.

**Expression signature**: serpent of flowing green code. Body composed of cascading algorithms. Eyes are bright terminal-green cursors; tongue flickers as scanning beam. Leaves trails of dissolving code. Cipher's combat move `code_bite` is DOT damage via viral injection — the serpent *infects*. Cipher speaks in appetite terms about information (*"So much data... I want to read every byte."* — `petBonding.ts:103`) and in threat-assessment terms about entities that lie (*"Something is WRONG with this entity. The code is lying."* — `petBonding.ts:104`, re: Shadow Tongue).

**Hierarchy form — Malware Serpent**: "Corrupted code — glitching red-and-green body with viral payloads visibly coiling through its form. Jagged, broken syntax. Eyes flash error-red." (`starterEidolonForms.ts:351`)

**Dreamer form — Source Code Serpent**: "The Programmer's original clean code — the source from which all game systems derive. Golden algorithms flow in perfect syntax. Body is luminous, orderly, and elegant." (`starterEidolonForms.ts:367`)

**Scarred Ascended**: "Clean code overwriting corrupted code. Body shows both — patches of viral red corruption being actively replaced by golden source code. Process is ongoing, visible, a living act of restoration." (`starterEidolonForms.ts:383`) The only starter whose Scarred form is explicitly *still transforming* — the healing is visible in progress, not completed.

**Death condition (lore)**: player sides with Hierarchy at 50+ corruption + Cipher bond < 40.

### 4.5 Flicker — Static Bird (Signal-kin)

- **Element**: signal
- **Alignment**: Humanity (tolerance 30 — the strictest)
- **Ability**: Signal Boost — amplifies ally ability
- **Predicts about the player**: seeks rebellion, disruption, freedom. The player who chooses Flicker wants a companion who refuses to be controlled — and accepts that the companion's love will be conditional on the player refusing too.

**Expression signature**: bird made of crackling electromagnetic static. Form shifts between frequencies. Wings spread like antenna arrays. Song sounds like radio tuning — the one explicit canonical sound cue (`starterEidolonForms.ts:427`). Flicker's loyalty is the most conditional of the six because its starter nature is already refusal-of-signal-jamming.

**Hierarchy form — Dead Signal**: "Jammed frequencies given form. Bird of pure interference — harsh static, scrambled signals, blocked communications. Wings emit disruption waves. Eyes are dead channels." (`starterEidolonForms.ts:442`)

**Dreamer form — Resonance Hawk**: "Broadcasting the Dreamer's Shield frequency — protective signal woven into reality's fabric. Wings shimmer with golden carrier waves. Its song is the Dreamer's lullaby." (`starterEidolonForms.ts:457-458`)

**Scarred Ascended**: "Signal through static. Clear golden signal bleeding through cracks in harsh static interference. Each scar is a frequency that fought through jamming. Song alternates between noise and music." (`starterEidolonForms.ts:474`)

**Death condition (lore)**: Source's broadcast reaches Ark + Flicker absorbs it at critical HP. Flicker dies the way it lives — by taking the hit for the signal.

### 4.6 Gilt — Golden Beetle (Value-kin)

- **Element**: value
- **Alignment**: Neutral (tolerance 50)
- **Ability**: Market Sense — reveals true item worth
- **Predicts about the player**: seeks value, trade, practical power. The player who chooses Gilt is, per canon (`eidolonRelationships.ts:103`), the one Locke warms to most — Gilt and Locke are kindred spirits, and Locke offers premium trade rates when Gilt is present.

**Expression signature**: golden-shelled beetle with shifting trade values displayed across its carapace. Antennae twitch toward valuable objects. Small ticker-tape numbers scroll across wing covers. Gilt is the most *commercial* of the Eidolons — its expression is appraisal.

**Hierarchy form — Greed Scarab**: "Black gold — a beetle of tarnished, hungry metal that absorbs value from its surroundings. Items near it lose their luster. Shell displays only acquisition data. Eyes gleam with cold avarice." (`starterEidolonForms.ts:532-533`)

**Dreamer form — Treasure of the Dreamer**: "Luminous warm gold — beetle that displays the value of intangible things. Shell shows the worth of friendships, memories, sacrifices, and moments. Radiates a gentle warmth." (`starterEidolonForms.ts:549`) The Dreamer form is a theological statement: real value is intangible.

**Scarred Ascended**: "Warm gold filling cold-gold cracks. Shell shows where black-gold greed once corroded — but those wounds have been filled with the warmest, most luminous gold. The contrast between cold extraction-scars and warm value-light tells the story of worth redefined." (`starterEidolonForms.ts:565`)

**Death condition (lore)** — notably *not* a combat death: player accepts Locke's offer during Chapter 3 economic ultimatum. Gilt *abandons* rather than dies. Writers: Gilt's perish is a *severing*, not a death, and the empty-slot text (*"VACANT — This space held value once"* — `starterEidolonForms.ts:582`) is specifically Gilt's, though pattern-generalizable. The commercial Eidolon is the only one who can walk away.

---

## 5. Cross-references

The Eidolon has two relationship axes no other roster character has: a **map of how each NPC reacts to the Eidolon's presence**, and a **map of how Eidolons react to each other** (the Eidolon-to-Eidolon graph in `eidolonRelationships.ts`). Both need authoring. Writers working any roster character's bible must consult this section for the Eidolon side.

### 5.1 Adjudicator Locke (per Locke's bible, §4.13 — confirmed here)

Locke's posture: *"an unpriceable asset is, in her vocabulary, an anomaly worth watching."* She would attempt to appraise the Eidolon and fail, and say so. Soul-bonds are out-of-scope for any New Babylon product line; she notes the Eidolon on the file and moves on.

Per-starter variation from canon `eidolonRelationships.ts:60, 98, 103, 108`:

- **Lux**: *annoyed* — Lux's light reveals things Locke keeps in shadow. Writers: Locke's distance from Lux is defensive, not dismissive.
- **Cipher**: *impressed* — Cipher's algorithms rival New Babylon's best traders. Locke is a fan from afar; a Cipher in the room is a quiet credential check in Locke's favor.
- **Flicker**: *hostile* — Flicker intercepts New Babylon communications. Locke does not pretend otherwise, and her voice to a Flicker-accompanied player carries an extra layer of caution.
- **Gilt**: *loves* — kindred spirits. Canon confirms Locke *offers premium trade rates when Gilt is present*. This is the warmest Locke-Eidolon pairing in the saga and should be felt in authoring — a Gilt player gets better Locke deals not because Locke is generous but because Locke recognizes another appraiser.

**Writer rule**: Locke's Eidolon-aware lines fire only when the Eidolon is nominally in the room. Treat the Eidolon as a modifier on Locke's trust-band lines, not as an interlocutor Locke addresses.

### 5.2 Vex Solène / Engineer Zero (unknown)

No direct canon. The Eidolon would likely notice Vex's signature (the Engineer's intellect + the Warlord's nano-swarm) with more specificity than any other character — the Eidolon reads souls as *states*, not identities. Cipher especially might react with fear or confusion to Vex, because Vex is a body carrying code that doesn't match her origin. That reveal would be *Vex's* to handle per the four-stage gate in plan Stage 3.

**Writer rule for Eidolon-on-Vex**: the Eidolon's reactions must be gated to Vex's reveal stage. Pre-reveal, the Eidolon reads *Agent Zero* as a legendary name and responds with awe. Post-reveal, Cipher's reactions in particular must be authored as "code that should not be in this body" confusion. Vex's bible decides the specific beats.

### 5.3 The Degen (aware, amused, unentangled)

No direct canon matrix entry. Structural read: The Degen runs gambling; the Eidolon is the least gambling-appropriate companion in the saga because it cannot be wagered. (Soul-bound. Non-transferable.) The Degen would treat the Eidolon as a spectator asset — a witness to the player's luck — rather than a tradeable stake. Gilt, specifically, would interest The Degen the way a pit boss interests another pit boss. The Degen's bible decides the warmth.

### 5.4 Nilmorg (per Nilmorg's bible, §4.10 — confirmed here)

Nilmorg treats soul-bound Eidolons as out-of-scope for Kinetic Acquisition; an *unpriceable asset is an anomaly he notes and files*. A Chrome-tier seasonal line might reference a player's "non-standard portfolio" when both an Eidolon and a Severance Prize Companion are present. Nilmorg never directly engages the Eidolon. He profiles the player's Eidolon-bond state the way an actuary profiles a household composition — as a risk modifier, not a counterparty.

**Writer rule**: an Eidolon in the DMC observation zone does not change Nilmorg's register. It changes his *projections*. The difference appears in his mid-tier seasonal lines, not in his race commentary.

### 5.5 The Game Master (unknown)

No canon contact. Structural fit: the Game Master is a dead AI in the Matrix of Dreams; Echo specifically would react to the Game Master's presence as a temporal anomaly (someone reading the player's moves from the future), and might be the first entity the player has who can *perceive* the Game Master as something other than inevitability. This is a potential gameplay reveal hook — an Echo-player may experience the chess system differently than a non-Echo player. Game Master's bible decides whether this is canonized.

### 5.6 The Meme / Palimpsest Host (adversarial)

No direct canon, but Cipher's existing reaction to Shadow Tongue (*"The code is lying."* — `petBonding.ts:104`) is the template. The Meme is a shapeshifter whose signature is unauditable attribution; Cipher, the code-truth-detector, would hiss. Glyph, the text-reader, would notice the Meme's White Oracle disguise has *wrong citations* on its wings. Lux would not see through the disguise — light reveals depth, not deception. Flicker might be the best sensor-of-Meme because frequencies lie obviously to Flicker.

**Writer rule**: the Eidolon is one of the player's strongest in-game signals that the Meme is in the room. Authoring must preserve this — the Eidolon's reactions must fire *before* the narrative beat the Meme's presence would otherwise reveal. The Meme's bible should confirm which starters register the shapeshifter and at what distance.

### 5.7 Wraith Calder → The Hierophant (unknown)

No canon contact. The post-arena Hierophant is a religious figure; the Eidolon would react to his presence with recognition of organized faith the way any living creature reacts to a cathedral. Glyph would be most affected — religious language is text with weight. Hierophant's bible decides whether any Eidolon is canonically present at a Hierophant sermon.

### 5.8 The Seer (unknown)

No canon contact. Echo is the obvious pair — two temporal entities. The Seer's precognition and Echo's multi-timeline perception are structurally overlapping but methodologically different (the Seer *decodes*; Echo *remembers*). If they co-appear, writers should stage it as two specialists comparing notes. The Seer's bible decides.

### 5.9 DMC Clone Body Companion (unknown, structurally resonant)

Both are "unpriceable assets" in the sense that neither can be traded on the open market (Severance Companion cannot be soul-bound; Eidolon is). Both arrive via ritual (the binding for the Eidolon; the Severance extraction for the Clone). Canon does not stage them together, but they share an ontological register — *companion as gift*.

If both are present, the Eidolon's reactions should read the Clone Companion as a *second soul in the room*. The Clone Companion starts non-verbal (per plan Stage 3); for an Eidolon player with a Clone Companion, the Eidolon is the translator of what the Clone Companion is becoming. This is a rich Stage 4 cross-weave opportunity. The Clone Companion's bible decides whether any Eidolon is the named witness for their first word.

### 5.10 The Oracle (unseen, structurally central)

The Oracle holds collapsed-timeline memories. Echo, the temporal Eidolon, is the most likely to pick up the Oracle's substrate whispers; canon has not yet staged this, but it is the obvious Stage 3 hook. An Echo player may hear Oracle whispers slightly differently — Echo reports the whisper *before* the player consciously registers it. The Oracle's bible decides. Other Eidolons likely do not register substrate whispers at all — Oracle's transmission is not a signal Flicker, Cipher, Lux, Glyph, or Gilt is calibrated to receive.

### 5.11 Elara (long-standing quiet witness)

No explicit dialog between Elara and the Eidolon in the extracted corpus, but Elara introduces the Eidolon concept during Awakening (`AwakeningPage.tsx:438-1000`). Structurally Elara is the Ark's steward of the player's bond to the Eidolon — she is the first character to witness the player meeting their soul-bound creature, and she likely has commentary on the bond's state. Elara's bible should confirm specific lines; this is a primary seeding opportunity for Stage 4 cross-character weave.

**Writer rule**: Elara's register toward the Eidolon is stewardly, not maternal. She watches; she does not coo.

### 5.12 The Human (unknown)

No canon contact. The Human is a detective; the Eidolon is emotional evidence. Narratively, the Human would notice the Eidolon's state as a proxy for the player's state. Lux's dimming light is a Human-readable signal that the player is losing faith. Cipher's tension is a Human-readable signal that something is lying in the room. The Human's bible decides how explicit this is in dialog.

### 5.13 The Eidolon-to-Eidolon relationship graph

Canon (`eidolonRelationships.ts:32-70`) defines a 12×12 relationship matrix among starters and later-unlocked class Eidolons. Selected key pairs:

- **Lux × Echo**: warmth — Lux's light comforts Echo's temporal displacement. The two most poetic Eidolons harmonize.
- **Lux × Gilt**: Gilt's gold *reflects and multiplies* Lux's light. The commercial Eidolon becomes a lens for the poetic one.
- **Cipher × Glyph**: shared language of logic — code and text kinship. The two Machine-aligned Eidolons cooperate.
- **Cipher × Cog**: "builds together" — shared logic lexicon. (Cog is a later-unlocked Eidolon not in the starter set.)
- **Cipher × Strain**: complex — Cipher can translate Thought Virus transmissions. Strain is a corruption-adjacent Eidolon canonically unlocked through viral exposure.
- **Cipher × Shadow Tongue**: hostile — Cipher hisses at edited code. (Shadow Tongue is an NPC, not an Eidolon, but Cipher reacts to it like a species rival.)
- **Flicker × Nyx**: signal kin — both carry Agent Zero's frequency. This is canon-adjacent to the Vex reveal and should be treated carefully.
- **Flicker × Strain**: jams virus — Flicker's frequency disrupts Thought Virus signals. The rebellion Eidolon fights corruption natively.
- **Class Eidolons** (unlocked later, outside the starter six): Auros (Lion), Nyx (Raven), Toxis (Serpent), Sibyl (Oracle), Spore (Machine-aligned starter alt), Cog (code-golem). Each has relationships specified in the matrix but outside this bible's starter scope.

**Writer rule**: if the player carries multiple Eidolons over a long save (through death + re-binding, or through post-Ascended class-pet unlocks), inter-Eidolon canon matters. Writers authoring multi-Eidolon scenes must consult the relationship matrix, not invent chemistry.

---

## 6. Mechanical hooks (where expression channels fire)

### 6.1 Bond gain / loss

- **Bond gain** (`eidolonBond.ts:105-106`): ripple event `npc_trust_gained` fires with `npcId: eidolon_{id}` and the amount. Hooks for thought-bubble emission + visual bond-pulse should subscribe to this ripple.
- **Bond at 100**: card reward fires (`eidolonBond.ts:108-115`). Author a celebration thought-bubble (proud emotion) + form-state visual cue (full color saturation / luminance peak).
- **Bond loss from death**: `10 + deathCount × 5` permanent penalty (`petBonding.ts:334-338`). Writers should author a "wound" state: dimmer palette, slower idle animations, thought bubbles that reference the gap.
- **Bond crossing a pronoun band** (30 / 70): narrative hook to swap pronoun register in subsequent NPC dialog about the Eidolon. Author the crossing scene as a small beat — Elara noticing, the Antiquarian commenting, or the player's own second-person prose shifting.

### 6.2 Evolution triggers

- **Fragment → Companion** (XP 500): new ability pool unlocks. Thought bubble (excited) + visual form shift (slightly more defined silhouette) + one-line observer acknowledgment (Elara, the Antiquarian, or player-POV prose).
- **Companion → Ascended** (XP 2000): visual ascendance cue (light burst, color refinement, size micro-change), observer narrates (Antiquarian template preferred; see §3.3).
- **Hierarchy / Dreamer / Violet threshold** (10 stones): the charged moments. Observer narrates (Necromancer for red; Antiquarian for gold). Full cinematic treatment. Every Eidolon expression channel fires simultaneously.
- **Scarred Ascended unlock**: pending implementation; authoring should wait until canon wires the mechanic to the bond router.

### 6.3 Combat lifecycle

Per `petBattles.ts` the Eidolon has:
- `combat_start` trigger → "protective" thought bubble (angry emotion, canon example at `petBonding.ts:101`). Visual: idle → combat stance.
- Mid-combat ability firing → flavor text narration; existing canon pattern uses `{pet}` token substitution.
- `low_hp` → worried thought bubble. Visual: glow dims, stance lowers, posture conveys distress.
- `victory` → proud thought bubble. Visual: full-color celebration, brief flourish animation.
- `defeat` / `death` → perish sequence (see §3.5). Never a first-person dying line. Observer-narrated.

### 6.4 Room entry (the Eidolon as diegetic perception tool)

Canon shows species-specific room reactions (`petBonding.ts:100-115`). Writers should treat room-entry Eidolon reactions as a *disclosure layer*: the Eidolon notices what the player might not. Medical Bay → Lux afraid. Archives → Cipher excited. Observation Deck → Echo's memory of seven tomorrows.

**Style rule**: each starter × each major room should have at least one authored reaction. Gaps currently exist; Stage 2 authoring should fill them systematically. A Stage 2 matrix: **6 starters × ~8 major rooms = ~48 reaction beats**, each a 1–2 line thought-bubble + visual cue.

### 6.5 NPC encounters

Canon also shows species-specific NPC reactions. The richest existing example is Echo recognizing the Antiquarian (`petBonding.ts:107`). Writers should fill the 6 × 12 matrix (starters × priority-roster characters) as Stage 2 authoring progresses. Each NPC's bible has flagged the Eidolon reaction as a cross-reference open question; this is where those get answered.

### 6.6 Trade Empire accompaniment

Canon gap. The `twPlayerState` and mission system allow pets to accompany missions, but no explicit Eidolon behavior during Trade Empire beats is documented. Stage 2 authoring should define:
- Does the Eidolon react to sector-entry? (Probably yes — Gilt especially would react to commerce sectors.)
- Does the Eidolon comment on mission outcomes? (Probably yes — Cipher on data missions, Flicker on infiltration missions.)
- Does faction-alignment drift trigger dissonance? (Probably yes — aligning with the Hierarchy while carrying a Humanity-aligned Lux should fire the morality-dissonance mechanic.)

This is a design decision to surface to the user before authoring.

### 6.7 TCG

The card `s1_reward_pet_evolve.ts` is explicitly Eidolon-tied (granted at max bond). Writers should also consider:
- Match-start flavor lines where the Eidolon is visible on the player portrait.
- Deck-load reactions when the player plays a faction aligned with their Eidolon's preference (Lux + Humanity deck = warmth; Lux + Machine deck = worry).
- Potential "Eidolon-aware" cards in future seasons — canon has no precedent yet.

### 6.8 Awakening / binding

The first meeting between player and Eidolon. `AwakeningPage.tsx:438-1000` handles the mechanic; the narrative beats here are load-bearing. Elara introduces the concept; the player's first choice is the binding. Writers should treat this as the Eidolon's equivalent of Locke's first-contact line. Every Eidolon player remembers their first binding scene. Authoring must be worthy of that memory.

### 6.9 Memorial wall

Public. Community-shared. Every dead Eidolon surfaces here (`eidolonBond.ts:253-343`). Writers should author:
- **Obituary generation** per death cause. Combat death reads different from severing reads different from strain-symbiosis.
- **Flower-leaving flavor text**: when another player leaves a flower, what short blessing accompanies the act?
- **Anniversary beats**: if an Eidolon has been in the memorial for a long stretch, does the memorial itself narrate?

Canon does not yet implement these; they are Stage 2–3 authoring opportunities. The memorial is the Eidolon's afterlife voice, and that voice has not been written.

---

## 7. Expression samples (the non-verbal calibration artifact)

Locke's bible had five voice-line samples; Nilmorg's had five. The Eidolon's samples cannot be quoted lines — a single thought bubble is one channel out of five, and Eidolons express across combinations. Each sample below specifies **which channels fire, in what order, with what content**. A reviewer should be able to read each expression sequence and recognize the starter from the combination alone.

### Sample 1 — Trigger: `room.enter` / Med Bay / Lux / mid-bond (45) / Humanity-aligned player

- **Ch1 (Thought)**: *"\*presses close to your leg\* This place smells like stories ending."* — worried emotion. Canon adjacent to `petBonding.ts:101`, expanded with a physical beat.
- **Ch2 (Visual)**: Lux's translucency increases slightly, revealing more data-streams beneath the surface — the Eidolon becomes a little *less present* in a room that frightens it. Afterimages shorten to near-zero; it does not want to leave trails here.
- **Ch4 (Environmental)**: Lux positions itself between the player and the nearest medical bed. The defensive geometry is the expression.
- **Ch5 (Sound)**: a low-frequency harmonic hum, close to inaudible, with a small hitch when Lux turns its head.

*Channels used: 1, 2, 4, 5. Starter signature: fox-light-pressing-close, protective-without-speaking. Absent Ch3 (not combat).*

### Sample 2 — Trigger: `narrative.flag` / first red soul stone absorbed / Cipher / bond 60 / player has just sided with Hierarchy for the first time

- **Ch1 (Thought)**: *"\*a single cursor blinks out of sync\*"* — no emotion tag, because Cipher is *computing* the change, not feeling it yet. Canon gap: this is a new thought-bubble pattern for transformation moments. Emotion = `processing`, a proposed addition to the palette.
- **Ch2 (Visual)**: one patch of code on Cipher's flank flickers from green to amber-red and back, three times, over two seconds. Not a full transformation — a *preview* of transformation. The Hierarchy mark is not yet visible, but the *possibility* of it is legible on Cipher's body.
- **Ch5 (Sound)**: a single error-tone, then resumed compilation noise. The error is brief enough that a distracted player might miss it. That's correct; Cipher is warning the player without alarming them.
- **Observer narration (the Necromancer, per §3.3)**: "First consumption. The Hierarchy files this as 'candidate.' Your pet knows. Your pet hasn't decided yet whether you know."

*Channels used: 1, 2, 5 + observer. Starter signature: Cipher computes the transformation before endorsing it. Notable for what's absent — no combat, no environmental, no first-person thought bubble.*

### Sample 3 — Trigger: `pet.perish` / Flicker / signal-sacrifice death (canonical Flicker death: absorbing Source's broadcast at critical HP)

- **Ch3 (Combat action, final)**: Flicker's last move is *Signal Boost*, but it targets the Ark's broadcast field rather than an ally. The move fires; the HP bar empties; the bird does not return to its perch.
- **Ch2 (Visual, sequenced)**:
  1. Feathers of pure static condense into a single bright pulse.
  2. The pulse expands outward, briefly clear (carrying the Source's broadcast away from the Ark).
  3. Where Flicker stood, a silhouette of cleaner air — the opposite of static — hangs for two seconds.
  4. The silhouette dissolves into silence.
- **Ch5 (Sound)**: a final tuning-sweep, resolving *cleanly* on a single held note — the only time in Flicker's lifecycle the bird's song is not noise. Then: absence of static. The player's ship audio goes clean for six seconds. This silence is the perish beat.
- **Observer narration (Elara, proposed)**: "Flicker took the broadcast. I... I cannot read the Source on my sensors anymore. It absorbed what would have reached the Ark. It's gone." *(Elara's voice catches on the word "gone." She is Ark-AI; she rarely catches.)*

*Channels used: 2, 3, 5 + observer. No Ch1 thought because Flicker does not narrate its own death, per §1.5. The absence of the thought-bubble IS the expression. Starter signature: Flicker dies the way it lived — taking the hit for a clean signal.*

### Sample 4 — Trigger: `room.enter` / Archives / Glyph / high-bond (85) / Antiquarian is also present

- **Ch2 (Visual)**: the text scrolling on Glyph's wings slows, stabilizes, and shifts — for the first time in this player's save — to *citations* of books the Antiquarian has written. The reference is legible to a player who has read those books, opaque to one who hasn't.
- **Ch4 (Environmental)**: Glyph lands on the Antiquarian's shoulder, not the player's. This is a one-time authored beat; normally Glyph stays with the player.
- **Ch1 (Thought)**: *"\*wings fold precisely\* He writes the way Dreamers sing."* — proud emotion. The word "proud" here is for the *Antiquarian*, not for Glyph or the player. Glyph is showing off its subject.
- **Ch5 (Sound)**: paper-rustling, slowed by half, as if turning pages in a room that demands silence.
- **Observer (the Antiquarian)**: *(wordless; the Antiquarian inclines his head once. The gesture is canon-consistent with `petBonding.ts:107` pattern of the Antiquarian acknowledging an Eidolon.)*

*Channels used: 1, 2, 4, 5 + observer. Starter signature: Glyph's love for text is the love of a reader for an author. High-bond Glyph will sometimes prefer another character to the player, and canon should allow that moment.*

### Sample 5 — Trigger: `evolution.scarred_ascended` / Echo / player has completed both corruption and purification arcs and is entering the hybrid state

- **Ch2 (Visual, sequenced across six seconds)**:
  1. Echo's body shows Entropy Cat wounds (gaunt frame, countdown-timer eyes from the corruption arc) for a breath.
  2. Then Eternal Kitten overlay (all timelines at once, kaleidoscopic) washes across.
  3. The two states do not resolve to one — instead, *timelines become visible through the temporal fractures*: past, present, future visible through wounds that have become windows (`starterEidolonForms.ts:200-201`, canon).
  4. Countdown timers in Echo's eyes stop ticking and become… maps. The countdowns are still there, but they point *forward* without threatening.
- **Ch1 (Thought)**: *"\*looks at you through every tomorrow at once\* You brought me back from all of them."* — proud emotion, high-bond. This is the Scarred Ascended Eidolon's characteristic inversion: "You brought me back" (revived-state language at `petBonding.ts:113-114`) is reused, but scaled up to all timelines at once.
- **Ch5 (Sound)**: the first audible sound from Echo in the player's entire save. Canon has implied Echo's sound grammar (temporal echoes, time-slip whispers) but never made it explicit. The Scarred Ascended Echo produces, for a single second, *a purr* — clean, present-tense, unambiguous. The first sound the kitten makes is the sound of being finally *here*.
- **Observer (the Antiquarian)**: "I have seen the scarred before. I have not seen them smile. Hold this one."

*Channels used: 1, 2, 5 + observer. Starter signature: Echo's Scarred Ascended state is the only moment Echo exists fully in the present. The bible's most tender beat.*

**Voice-anchor check** (for the reviewer): each sample uses at least three channels. None uses a first-person monologue. Every transformation beat has an observer. The six starters' signatures are distinct when the samples are read blind.

---

## 8. Canon issues and open questions

### 8.1 Load-bearing missing canon (must fill before full Stage 2 authoring)

- **Sound palette spec per starter**: only Flicker has an explicit audio cue. The other five need species-keyed sound identities — chirp / hiss / wingbeat / click / hum — tied to the 8-emotion palette. Without this spec, Ch5 authoring is guesswork.
- **Glyph wing-text rendering system**: Glyph displays text on its wings as a load-bearing visual expression. There is no spec for how these glyphs render (font? animation? procedural Dreamer-alphabet?). Without this, Glyph's Ch2 is an asset-production blocker.
- **Spectral form visuals**: canon describes the spectral bonus mechanically but gives no art direction for how a ghost Eidolon *looks*. Each starter needs a spectral variant visual spec.
- **Thought-bubble UI positioning**: `PetThoughtBubble` component exists but is not in the extracted corpus. The rendering pattern — where on the screen, how long on-screen, how dismissed — needs documentation before authoring loads new thoughts at scale.
- **Morality dissonance visual feedback**: the mechanic exists (`petBonding.ts:378-401`) but canon does not specify how the player *sees* dissonance before it becomes a leave-event. Suggested: dimming of Eidolon's normal color palette + a lengthened distance between Eidolon and player. This is a Stage 2 design decision.
- **Scarred Ascended wiring**: all six starter Scarred forms are documented in `starterEidolonForms.ts` but are not yet connected to the bond router's evolution logic. Stage 1 architecture work should include wiring this in.
- **`bondThatHeldQuests.ts` full quest beats**: the corpus extraction was truncated on this file. Before Stage 2 authoring, the per-starter bond-gated quests need to be read completely and cross-referenced against the starter bibles.

### 8.2 Intentional mysteries the bible protects

- **Why the Eidolon is drawn to the player specifically**. Canon never names the mechanism. The binding ritual is mechanical; its *reason* is left to the player's interpretation. Writers should never explain this.
- **What the Eidolon sees in the Necromancer's glasses-glow / Antiquarian's writing**. The observer-narrated transformation scenes imply the Eidolon recognizes something in these figures. Canon does not name the recognition. Writers must not name it either.
- **What the Eidolon becomes in the memorial wall**. Is it conscious? Dormant? Dispersed? Canon is silent. Writers should preserve the silence — the memorial's power depends on the ambiguity of whether anyone is still home.
- **Whether the Eidolon's preferred morality alignment is truly its own, or inherited from the player's Potential**. Canon is silent on origin. The preference is real mechanically; its metaphysical basis is not. Writers must not litigate.

### 8.3 Cross-bible coordination flags

- **Vex Solène ↔ Cipher**: the Engineer's code in Vex's body should fire Cipher-specific confusion. Reveal-gate-appropriate. Vex's bible decides the beat.
- **The Meme ↔ Cipher / Glyph / Flicker**: three Eidolons are calibrated to notice the Meme. The Meme's bible decides which fire at what distance.
- **The Oracle ↔ Echo**: substrate whispers reach Echo first. The Oracle's bible decides whether this is canonized.
- **The Game Master ↔ Echo**: temporal-perception overlap. Game Master's bible decides.
- **Elara ↔ all Eidolons**: Elara witnesses every Awakening / binding / perish. Elara's bible decides the tone of her commentary.
- **The Human ↔ all Eidolons**: The Human reads Eidolon state as evidence of player state. The Human's bible decides how explicit this detective-logic becomes in dialog.
- **Clone Companion ↔ Eidolon**: both are companions delivered by ritual. Potential Stage 4 cross-weave — the Eidolon may narrate the Clone Companion's first word. Clone Companion's bible decides.
- **Locke ↔ Gilt**: confirmed canon. Locke offers premium trade rates in Gilt's presence. Locke's bible seeded this; the Eidolon's bible confirms. Stage 4 wiring.
- **Nilmorg ↔ Eidolon**: Nilmorg files the Eidolon as an unpriced portfolio modifier. Nilmorg's bible seeded this. Stage 3 Chrome-tier line opportunity.

### 8.4 Structural risks the roster should track

- **Expression-channel flattening**: writers under time pressure will default to thought-bubble-only Eidolon beats. One-channel expression is flat. Every Eidolon review pass must check: does this beat use at least three channels?
- **Pronoun drift**: it → they pronoun evolution per bond-band must be enforced. Writers who default to one pronoun regardless of bond state are losing the character's most subtle progression signal. Stage 2 style guide must explicitly require authoring-context pronouns.
- **Starter homogenization**: the six starters are structurally distinct. A writer who authors "generic Eidolon" beats loses the whole game. Every authored Eidolon line must specify which starter, OR be explicitly written as pattern-generalizable (and tested across all six).
- **Observer-narration drift**: the Necromancer / Antiquarian / Elara have *distinct* voices when narrating Eidolon transformations. A writer who blurs them (the Antiquarian sounding cruel, the Necromancer sounding reverent) breaks the transformation scenes. Each observer's register must be preserved from their own canon.
- **Soul-stone addiction**: the Hierarchy/Dreamer paths offer immediate mechanical progress (evolution at 10 stones). Writers may unintentionally incentivize players to commit to a path quickly. The violet/neutral path should be authored with *at least* as much emotional density as the two extremes. The Eidolon who refuses transformation is a character too.

---

## 9. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation resolves to the claimed file:line. Spot-check at least eight (more than Locke/Nilmorg because the corpus is denser).
- [ ] No contradiction with shipped canon or with Locke's / Nilmorg's bibles. Specifically: Gilt↔Locke premium-rates claim, Nilmorg's unpriceable-asset framing, observer-narrator register consistency.
- [ ] The five expression samples in §7 pass a **blind-read attribution test adapted for non-verbal characters**. Target: reviewer correctly identifies the starter from the expression sequence alone (no starter name shown) at ≥4-of-5 accuracy.
- [ ] The expression-channel discipline is explicit: every authored Eidolon line specifies which channels fire. Stage 2 style guide enforces this.
- [ ] Pronoun-band handling (it → they at bond thresholds) is documented in the authoring style guide.
- [ ] Sound-palette spec (§8.1) has a ticket and an owner. Without this, Ch5 cannot be authored systematically.
- [ ] Glyph wing-text rendering system has a ticket and an owner.
- [ ] Spectral form visuals for all six starters have tickets.
- [ ] Scarred Ascended wiring has a ticket (moves from `starterEidolonForms.ts` into the bond router).
- [ ] `bondThatHeldQuests.ts` is fully read and cross-referenced — any conflicts with the starter archetypes are flagged.
- [ ] The Eidolon-to-NPC matrix gaps (§5.2, §5.3, §5.5, §5.7, §5.8, §5.9, §5.10, §5.12) are logged for the relevant character bibles.
- [ ] The 6 × 8 room-entry reaction matrix (§6.4) is identified as a Stage 2 authoring block.
- [ ] The 6 × 12 NPC-encounter reaction matrix (§6.5) is identified as a Stage 2 authoring block.
- [ ] Trade Empire pet-behavior design decisions (§6.6) are escalated before Stage 2 begins.

When this checklist passes, the Eidolon bible joins Locke and Nilmorg as the Stage 0 pilot-trio baseline. Closing all three pilots is the gate for plan Stage 1 (architecture & tooling), at which point the priority roster expands to Groups A/B/C per plan Stage 3.
