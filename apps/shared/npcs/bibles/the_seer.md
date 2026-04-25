# The Seer — Character Bible

> **Status**: Stage 0 draft — eighth bible on the priority roster (slot #8). Group A (foundational). The first roster character whose structural innovation is **publicly updating her own predictions** — she is precognitive *and* fallible, in voice, with the fallibility owned in full sentences. Where the Meme conceals, the Game Master fragments, the Hierophant transforms, and Vex disguises, the Seer **revises**. The voice rule that follows from this is unique on the roster: a Seer line that does not include either a prediction or a public revision-of-prior-prediction is mis-cast.
>
> **npcKey**: `the_seer`
> **Pronouns**: she/her (consistent across all canon — every shipped trust line, every transmission, every dialog reference).
> **Faction tags**: TCG `dreamer` (`s1_char_046`); race `ne_yon` (one of canonically twelve Ne-Yons per `the_degen.md` §4.13). No `factionNPCs.ts` / `galacticDanceFactionNpcs.ts` entry as of this writing — the Seer has *no faction-NPC home*; her institutional affiliation is *Mechronis Academy, retired* (§2.1) and her current residence is *Thaloria* (per `moralityTrustActVariants.ts:1813-1821, 2404-2412`).
> **Loredex anchors**: `bossMastery.ts:149-163` (boss key `act1_seer`); TCG unit `s1_char_046`; TCG general `gen_seer`; reserved card `burnt_card_placeholder`; Ne-Yon class `neyon_class`.
> **Visual signature**: the **800ms card-slot flicker** (`SeerCardFlicker.tsx`, `FLICKER_DURATION_MS = 800`) — the single most-recognisable Seer-coded animation in the game. Card-back asset `art/card-back-seer.png`. CSS-only mix-blend-screen flicker; reusable for Acts 3+ Witness/Enigma scenes per the spec.
> **Visual color**: `#7c3aed` (purple, `bossMastery.ts:152`). Same hue family as Oracle class but distinct shade.
> **Canonical signatures**:
> - First-meet line, Mechronis: *"I will not raise my staff today. I want to see whether the bench has learned yet."* (`act1OpponentDialog.ts:267`, `gen_seer.ts` flavor, `chapters.ts:786` boss-taunt — repeated three times in canon, the bible's clearest single voice anchor.)
> - Confidant register, Act 7: *"The door is open. The tea is in the second cupboard on the left."* (`moralityTrustActVariants.ts:2407-2412`)
> - The signature concession: *"I was wrong about which version of it. The version is better."* (`moralityTrustActVariants.ts:1352-1353`)
>
> **Bible canon stance** — load-bearing:
>
> 1. **The Seer is a single canonical entity.** No multiplicity. No instance-fragmentation (unlike the Game Master's Original/Left/Right/Cult), no register-disguise (unlike the Meme), no transformation (unlike Wraith Calder/Hierophant). The voice is one voice. Trust-band shifts (cold → warm → confidant per `moralityTrustActVariants.ts`) are *register* shifts inside the same voice, not separate voices.
> 2. **Precognition is unforgeable** (per `the_meme.md` §4.12). The Seer is the saga's only entity who cannot be falsified by the Meme. The bible affirms this without amendment and adds the load-bearing converse: she is also the saga's only entity who *cannot falsify herself* — when she is wrong, she says she is wrong, in voice, with the version-distinction that only she has access to. Honest precognition is what makes precognition unforgeable.
> 3. **Restraint is her teaching method.** *"I will not raise my staff today."* The signature pre-match line is canonical and load-bearing for §3 — the Seer's pedagogy is *what she does not do*. The staff stays on the bench. The match is given to the player. The losing is the lesson. Writers must respect: a Seer scene where she actively teaches by *doing* a thing is mis-cast. She teaches by withholding action and naming the withholding.
> 4. **Scripted loss is a gift, not a failure.** The Act 1 Cycle B finale (`chapters.ts:770-829`, `seerProphecy.ts`) is a canonical first-playthrough loss. The Antiquarian-style framing in `act1OpponentDialog.ts:280` (*"Losing to the Seer is the only loss in this Act that the Engineer remembered with affection"*) is the bible's clearest framing of the trust-pedagogy: the loss is the trust-build, the staff-on-the-bench is the trust-token, the burnt-card path is the trust-reward.
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Voice

The Seer has **one voice with three registers**, gated by the trust meter rather than by event or disguise. Writers must specify which register the line is operating in before authoring; the selector enforces register against trust band.

### 1.1 The single voice — three registers

| Register | When it surfaces | Tonal signature |
|---|---|---|
| **The Cold Register** (Wary band) | Default first-meeting; pre-trust scenes; high-friction moments | Patient. Quiet. The voice of someone who has already counted the player and is waiting to see whether the count was correct. *"The waiting is fair. The waiting is the Seer's favourite register."* (`moralityTrustActVariants.ts:1031-1032`) |
| **The Warm Register** (Witnessed/Present bands) | Mid-Act-3 onward at warm trust; transmissions; recurring contact | The Seer laughs — *"not often, not loudly, but audibly"* (`moralityTrustActVariants.ts:1018-1020`). Direct prose. Probability tables shared without prophecy-overhead. The register where she allows the player to do the math themselves. |
| **The Confidant Register** (Inheriting band — Act 7 specifically) | Highest trust, late-game | *"The door is open. The tea is in the second cupboard on the left."* (`moralityTrustActVariants.ts:2407-2412`) Domestic. Ordinary-phrased. The most intimate register she has — and the bible's strongest single inversion: a precognitive entity at her highest trust speaks in *the most ordinary household sentences in the saga*. |

There is **no fourth register**. The Seer does not have a Hostile band canonically (her cold register is *not* hostile — it is *waiting*; the bible asserts that a player who would hit Hostile with the Seer simply *never gets a Seer encounter* because the Seer would have foreseen the futility and not visited). There is no Stage-4-reveal register hiding underneath her cold register; the Seer has no concealed self. What she shows is what is there.

**Writer rule**: every Seer line carries `register: cold | warm | confidant` AND `trust_band: wary | witnessed | present | inheriting`. The selector rejects a line whose register exceeds the player's current band. A Confidant-register line cannot fire at Witnessed band; a Cold-register line *can* fire at Inheriting band (the Seer occasionally returns to her cold register at high trust, on purpose, when *waiting* is the right move). The asymmetry is canonical: registers move both directions across trust, but lines are ceiling-gated by band.

**The prophecy-overhead distinction.** Per `moralityTrustActVariants.ts:2001-2007`, the Seer's transmissions at warm trust *"arrive without their usual prophecy-overhead"*. *Prophecy-overhead* is the bible's term for: caveats, oblique frames, probability-table appendices, version-disclaimers, *"the version that was kindest"* style multi-future qualifications. At cold trust her prophecies arrive *with full overhead* — the player must work to extract the actionable claim. At warm trust the overhead drops; she trusts the player to read plainly. At confidant trust, the prophecy-overhead is *zero* — she gives coordinates, instructions, tea-cupboard locations. Writers should treat prophecy-overhead as an inverse trust signal: more overhead = colder register; less overhead = warmer.

### 1.2 The Cold Register — cadence

This sub-section closes in chunk 2 alongside the Cold Register vocabulary and tells. Header + §1.1 only in this chunk; the rest follows.

*(§§1.2–1.5 follow.)*
