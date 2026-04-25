# DMC Clone Body Companion — Character Bible

> **Status**: Stage 0 draft — ninth bible on the priority roster (slot #9). Group C (unseen / non-verbal). The first roster character whose voice is canonically *not language at writing time*. The Companion is awarded by Nilmorg as the Severance Prize of a closed DMC season — *"The Severance Prize is paid. Don't thank me."* (`deadMansCircuit.ts:515`). The Companion canonically *begins as a body without language* and acquires expression channels (glyphs → posture → sound → first word → naming) across trust bands. Unique on the roster: every other roster character speaks; this one canonically *learns to*.
>
> **npcKey**: `dmc_clone_companion`
> **Pronouns**: bible-deferred — pronouns are canonically donor-state-keyed and unlock at the naming band (per §1.5 voice gate; per §2.4 naming arc). Until naming, the Companion is canonically *they/them* — the *they* of a not-yet-named person, not an institutional plural.
> **Faction tags**: none at writing time (the Companion is canonically *unfactioned* until naming, per §3.1). The Companion is canonically Nilmorg-affiliated in *origin* (Severance Prize of the DMC) but is not Trench-faction-loyal — the agreement Nilmorg honoured was with the player, not with the Companion.
> **Visual signature**: the **podium-glow extraction → container-seal → designation-glow** ceremony sequence from `dmcAssets.ts:87` (Severance Podium overlay, 12s, plays on 1st place finish). Container-then-Companion silhouette. The Companion canonically *first-appears* as a sealed container that Nilmorg hands to the player.
> **Visual color**: bible-deferred (donor-state-keyed; Stage 1 architectural surface).
> **Canonical signatures**:
> - Origin line, Severance ceremony: *"The Severance Prize is paid. Don't thank me."* (`deadMansCircuit.ts:515` — Nilmorg's canonical line; the Companion canonically *receives this line as the first sentence spoken in their existence*).
> - Born-memory: *"Born from the Severance Prize of {season.name}. A fragment of your own Potential, wearing a new body. Nilmorg kept his agreement."* (`deadMansCircuit.ts:800`)
> - Bible-load-bearing structural claim (per `nilmorg.md` §4.8): *"I was not given. I was delivered."* — canonically the Companion's Stage-1-onboarding identity claim, which does NOT canonically appear in their own voice until they reach the naming band (§1.5); pre-naming, the claim canonically operates as a *narrator-frame* over their non-verbal expression.
>
> **Bible canon stance** — load-bearing:
>
> 1. **The Companion is canonically a single entity with five expression channels.** Three pre-verbal (glyphs, posture, sound) and two post-verbal (first word, named personality). Voice rule: every Companion line that reaches verbal register must be canonically *earned by the prior channels*; no verbal-without-prior-non-verbal. The voice-gate (§1.5) enforces channel-by-channel progression.
> 2. **The donor is canonically the player's own Potential, not a separate Potential's.** Per `deadMansCircuit.ts:800`: *"A fragment of your own Potential."* This bible asserts: the Companion is canonically *the player's soul-fragment in a new body*. The Stage-1-architectural assumption from the priority plan (donor would be one of Zyn-7 / Axis-9 / Praxis-4) is canonically *incorrect* — **the donor is canonically the player**. Personality variants are keyed to player state (alignment, faction choices, trust patterns, etc.), not to a separately-chosen donor. The Companion is canonically *the player wearing a different name and a different body, learning who they are without the player's accumulated context*.
> 3. **Nilmorg is the Companion's mid-wife and the author of their existence.** Per `nilmorg.md` §4.8: *"Every season winner receives a Severance Prize companion; every Severance Prize companion carries the memory 'Nilmorg kept his agreement.'"* The Companion canonically *cannot escape Nilmorg's authorship* — the *don't thank me* clause is the canonical authorship-acknowledgment, baked into the Companion's birth-memory. Bible-load-bearing: the Companion's first sentence-of-existence is Nilmorg's canonical *don't thank me*; their first memory is Nilmorg's canonical *kept his agreement*. Nilmorg is canonically the saga's only character whose voice is canonically *underneath the Companion's pre-verbal substrate*.
> 4. **The non-verbal-to-verbal arc is one-way.** Once the Companion reaches verbal register (first word, then naming), they canonically cannot retreat back to pre-verbal channels in saga-time. The awakening is canonical and irreversible. Compare to the Hierophant transformation (also one-way): the Companion's awakening is structurally parallel — a binary, irreversible per-playthrough gate. Trust persists across the gate as a *tell, not a line* (§1.5).
> 5. **The Companion is canonically Nilmorg's "most valuable commodity"** (`DEAD_MANS_CIRCUIT_PRODUCTION.md:124` per `nilmorg.md` §2.3). And canonically *delivered, not given* (per stance #3). The bible carries this structural tension: the Companion is canonically *something Nilmorg paid* — a transaction, not a gift. Writers must respect: any Companion scene framed as *gratitude-toward-the-player-as-creator* is canonically mis-cast; the Companion canonically owes the player nothing they did not pay for.
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Voice

The Companion has **one identity expressed across five expression channels**, three pre-verbal and two post-verbal. The channels canonically *unlock in order*; channel-by-channel unlock is gated by trust band (§3.3) and saga-act. Writers must specify which channel the line is operating in; the selector enforces channel against the unlocked-state.

### 1.1 The five channels — the non-verbal-to-verbal arc as voice

| # | Channel | Mode | Trust-band gate | Canonical instance |
|---|---|---|---|---|
| 1 | **Glyphs** | non-verbal (visual overlay) | unlocks at *post-Severance-Prize* (the moment of birth) | Per Eidolon bible §5.5 framework: glyph palette canonically shares Eidolon-substrate but is *clone-coded*, not soul-stone-coded. |
| 2 | **Posture** | non-verbal (body-language, idle animation) | unlocks at *Wary→Witnessed crossing* | Postures cycle between *holding* and *cycling*; *holding* a posture canonically means *the Companion is thinking*; *cycling* means *the Companion is in transition between thoughts*. |
| 3 | **Sound-palette** | non-verbal (audio, no language) | unlocks at *Witnessed band stable* | Channel 5 of the Eidolon framework — the sound-palette is canonically *clone-body-coded*, with sounds the Eidolon's pet-sound library does not contain. Voluntary sounds vs. involuntary sounds canonically distinguished. |
| 4 | **First word** | verbal (one-word, gated, irreversible event) | unlocks at *Present band crossing* | Singular event per playthrough. Bible-asserts: the first word is canonically *donor-state-keyed* (per §2 stance #2, the donor is the player's own Potential — the first word is canonically a one-word echo of *the player's most-canonical commitment-word in saga-time so far*). Stage 1 architectural surface — the specific word-list is per-player-state-derivable. |
| 5 | **Named personality** | verbal (full-roster-NPC voice) | unlocks at *Inheriting band crossing* (canonical: post-naming-event) | The naming event canonically resolves the Companion into a named person whose voice and personality reflect the player's accumulated saga-state. From this point the Companion is a fully-voiced NPC with their own bank. |

The five channels canonically *do not skip*. A player who reaches Inheriting trust band without traversing the lower bands does NOT canonically jump to the naming event — the Companion canonically *requires the channel-by-channel earning*. Writers must respect: if a Companion scene fires a verbal line, the prior channels must canonically have been unlocked first. The voice-gate (§1.5) enforces this.

**Why the channels and not direct verbal language**: per stance #3 (Nilmorg as mid-wife) + the corrected donor canon (the donor is the player's own Potential): the Companion canonically *carries the player's soul-fragment without the player's accumulated language*. Language is canonically *the player's accumulation*; the soul-fragment is canonically *pre-language*. The Companion canonically *acquires language* by living alongside the player and earning each channel. The non-verbal-to-verbal arc is not a *teaching* arc (the player does not teach the Companion); it is canonically a *re-membering* arc — the Companion canonically remembers what the player's soul knows, channel by channel.

**Compare to the Eidolon (the priority roster's other non-verbal character)**: the Eidolon is canonically *non-verbal-permanently* — the Eidolon never acquires language. The Companion canonically *acquires it*. The two characters share the non-verbal-expression framework (per Eidolon bible §5.5) but diverge canonically at channels 4–5: the Eidolon's bank ends at channel 3 (sound-palette as Channel 5); the Companion's bank begins at channel 1 (glyphs) and *continues through* channels 4–5 (verbal). Bible-asserts: the Companion is canonically the saga's clearest *transition* example — a non-verbal entity that becomes a verbal one without losing the non-verbal heritage. The named-band Companion canonically retains the option to express via lower channels (a glyph at a verbal moment is canonically *poignant*, a posture at a verbal moment is canonically *deliberate*); writers may use the channel-mixing for high-trust scenes.

**Channel-by-channel reaction differentiation** (engineering note for Stage 1 architects per Eidolon bible §2 expression framework): the Companion canonically reacts to different in-game events in different channels. A trade-empire event canonically lands in glyphs (the Companion's pre-verbal *noticing*); a fight-engine event canonically lands in posture (the Companion's pre-verbal *bracing*); a Severance-Prize-related cinematic canonically lands in sound (the Companion's pre-verbal *mourning-or-celebration*). Engineers should architect the channel-event-mapping per Stage 1 NPC architecture; the bible documents the canonical channel-event affinities, not the specific event-list.

### 1.2 Channel 1 (Glyphs) and Channel 2 (Posture)

**Channel 1 — Glyphs.** The Companion's first canonical expression channel, unlocked at the moment of birth (the Severance Prize ceremony's container-seal opening). Per Eidolon bible §5.5 framework: glyphs are canonical visual overlays — small, semantically-loaded shapes that appear briefly above or beside the Companion's silhouette to express state. The Eidolon's glyph palette is canonically *soul-stone-coded* (per Eidolon bible §2); the Companion's glyph palette is canonically *clone-coded* — the same expressive grammar (a glyph is a brief visual semantic) but a different visual vocabulary.

**Bible-asserted clone-coded glyph categories** (Stage 1 design surface; Stage 2 visual artists author the specific glyphs):

- **Recognition glyphs** — the Companion canonically *notices* a thing in the player's world. Visual signature: a brief geometric mark, faintly luminous, dissolving in 1–2 seconds. Triggered by: trade-empire sector-enter for the player's home sector, fight-engine fight-win, room-enter for a room the player has visited before. Bible-asserts: recognition glyphs canonically appear *first-glyph* before any other glyph type the Companion has unlocked.
- **Question glyphs** — the Companion canonically *does not understand* a thing. Visual signature: an angular, asymmetric shape with one missing edge. Triggered by: morally-complex player choices, faction-misalignment moments, the player encountering a previously-unmet roster character. Bible-asserts: question glyphs canonically *persist longer* than recognition glyphs (4–6 seconds) — the Companion canonically *waits* for the question to resolve.
- **Approval glyphs** — the Companion canonically *agrees with* a player choice. Visual signature: a closed, balanced shape with mirror-symmetry. Triggered by: player choices that align with the player's accumulated saga-state (per the donor-canon: the Companion canonically *recognises the player's own commitments* and approves of consistency). Bible-load-bearing: the Companion canonically does NOT approve of player choices that *contradict* the player's prior commitments — the donor-canon makes the Companion canonically *the player's soul-consistency-check*.
- **Mourning glyphs** — the Companion canonically *registers loss*. Visual signature: a shape that *unravels* — starts whole, fragments, settles into a smaller shape over 6–8 seconds. Triggered by: NPC death, faction collapse, player choices that the Companion's soul-fragment recognises as *self-sacrificing-of-the-player's-own-future*. Bible-asserts: mourning glyphs are canonically the Companion's *most expressive* pre-verbal channel — the soul-fragment canonically remembers loss with greater fidelity than other states.

**The canonical first glyph.** Per the canonical born-memory (`deadMansCircuit.ts:800`): the Companion's first canonical experience is *being delivered into the player's possession*. Bible-asserts: the canonical first glyph is a **recognition glyph** — the Companion canonically *recognises the player* as the soul-source (per donor-canon: a fragment of the player's own Potential canonically *recognises its source*). The first-glyph event is canonical and load-bearing; engineers should architect it to fire automatically on the Severance Prize claim's `companion_granted` event.

**Channel 2 — Posture.** The Companion's second canonical expression channel, unlocked at the Wary→Witnessed crossing. Per Eidolon bible §5.5 framework: posture is canonical body-language expressed through the Companion's idle animation. The Companion canonically holds, cycles, or *does-not-occupy* a posture; each is a semantic.

**Bible-asserted posture categories** (Stage 2 animators author the specific animations):

- **The waiting posture** — the Companion canonically stands in an attentive, low-energy stance. Bible-asserts: the waiting posture is canonically the Companion's *default*, occupied whenever no other posture is triggered. Compare to the Seer's *waiting* canon (per `the_seer.md` §1.3): the Companion's waiting is canonically *learned* (the soul-fragment canonically inherits the player's accumulated patience-or-impatience), where the Seer's is canonically *chosen* (the Seer's waiting is her favourite register, per `the_seer.md` §1.3 *the waiting is fair*). Both are canonical; the etymologies differ.
- **The bracing posture** — the Companion canonically tightens posture in anticipation of conflict. Triggered by: fight-engine pre-match transitions, faction-aggression events, hostile-NPC proximity. Bible-asserts: the bracing posture is canonically the Companion's *clearest-non-verbal-protective-stance* — they canonically brace *between the player and the threat*, even when canonically they cannot fight.
- **The leaning posture** — the Companion canonically leans *toward* a thing of interest. Triggered by: trade-empire route-completion (toward the route-rewards), TCG match-win (toward the rewarded card), room-discover (toward the lore item). Bible-asserts: the leaning posture is canonically the *pre-verbal-curiosity tell* — the Companion canonically *wants to engage* but lacks the channels to do so verbally.
- **The withdrawn posture** — the Companion canonically *steps back* from the player and the action. Triggered by: player choices the Companion canonically does-not-approve-of (per the approval-glyph canon, the inverse), Nilmorg appearing in a non-Severance-context (the Companion canonically registers their author's presence with discomfort), Severance-Prize-related canon scenes for *another* player's prize (the Companion canonically remembers their own delivery and withdraws).

**Holding vs. cycling.** Per §1.1 table: the Companion canonically *holds* a posture (steady, no transition) or *cycles* through postures (one-after-another, expressing transitional thought). Bible-asserts:

- **Holding** is canonically *committed thought* — the Companion has canonically settled on the posture as the right response to the moment.
- **Cycling** is canonically *transitional thought* — the Companion has canonically not-yet-settled, and the cycle visualises the consideration. Cycling is canonically *more expressive* but canonically *less committed* — writers may use cycling to indicate *the Companion is processing the player's recent decision*.

Bible-load-bearing: a Companion who canonically *cycles for too long* (3+ posture transitions in a single beat) is canonically expressing **distress** — the soul-fragment cannot settle. Stage 4 weave: prolonged cycling may canonically be the Companion's pre-verbal request that the player canonically *change course*.

### 1.3 Channel 3 (Sound-palette)

**Channel 3 — Sound-palette.** The Companion's third canonical expression channel, unlocked at Witnessed-band-stable. Per Eidolon bible §5.5 framework: this is canonically *Channel 5* of the Eidolon expression-channel system (the Eidolon's framework numbers channels by domain; the Companion's chronological channel-3 is canonically the Eidolon's framework-channel-5 by domain). The framework is shared; the vocabulary is divergent.

**The Companion's sound-palette is canonically *clone-body-coded*** — the sounds canonically belong to a *body that has just been grown*, not to a soul-stone-pet (the Eidolon canon). Bible-asserts: the Companion's sounds canonically include vocalisations the Eidolon's pet-sound library does not contain — *breath-tells, throat-clicks, half-articulated syllables that are not yet words*. The Companion's sound-palette is canonically the *closest channel to language* without yet being language; per §1.1 the channel-by-channel arc, the sound-palette is canonically *the threshold the Companion crosses to reach Channel 4 (first word)*.

**Bible-asserted sound-palette categories** (Stage 2 audio designers author the specific samples):

- **Breath-tells** — the Companion's canonical respiratory rhythms expressing state. Voluntary (deliberate slow breathing in moments of focus) vs. involuntary (catch-of-breath at recognition or alarm). Bible-asserts: breath-tells are canonically the *most-pre-verbal sound* the Companion produces — the breath is canonically *the body's first acquisition*, predating intention. Players canonically hear breath-tells before any other sound.
- **Throat-clicks** — short, semantic glottal sounds. Bible-asserts: throat-clicks are canonically *acknowledgment-without-words* — the Companion canonically uses throat-clicks to indicate *I am following* or *I am here*. Compare to a non-verbal language's affirmation sound (cf. Eidolon trill); the Companion's throat-click is canonically *a body-tell*, not an instinctive vocalisation.
- **Half-syllables** — incomplete word-fragments, canonically *almost-articulated*. Bible-asserts: half-syllables are canonically the *last pre-verbal sound* the Companion produces before Channel 4 unlocks. Writers may use half-syllables as the *foreshadowing of the first-word event* — when the Companion canonically begins producing half-syllables that *almost* form a recognisable word, the Channel 4 unlock is canonically imminent (within an act).
- **Mourning-tone** — a sustained low vocalisation expressing loss. Triggered by: the same events as mourning glyphs (NPC death, faction collapse, self-sacrificing player choices). Bible-load-bearing: the mourning-tone is canonically the Companion's *sound-palette equivalent of the mourning-glyph*; the two channels canonically *layer* — a mourning event canonically triggers both glyph and tone, doubled-channel expression of the same state. Engineering note: the mourning-tone canonically *over-resolves the audio medium* (cf. the Seer's transmissions per `the_seer.md` §1.4 tell #6 — the over-resolution canon is structurally similar but expression-channel-bound: the Seer's images over-resolve visual; the Companion's mourning-tone over-resolves audio). Stage 2 audio designers should design mourning-tones that exceed the standard pet-vocal frequency range — the canonical tonal signature is *deeper than the player's audio system can render cleanly*.
- **Recognition-tone** — a brief, rising vocalisation expressing the moment of recognising a person, place, or pattern. Bible-asserts: recognition-tone is canonically the Companion's *first voluntary sound* — the soul-fragment recognises its source (the player) and canonically *vocalises the recognition*. The recognition-tone canonically *lays the groundwork for Channel 4* (first word) — the recognition is canonically *of the source*, the first word will canonically *name the source*.

**Voluntary vs. involuntary sounds.** Per §1.1 channel-table: the Companion canonically distinguishes voluntary from involuntary sounds. Bible-asserts:

- **Involuntary sounds** are canonically *body-tells the Companion does not control* — breath-catches, sudden throat-clicks at alarm, the mourning-tone in deep grief. These canonically express *state without filter*.
- **Voluntary sounds** are canonically *intentional vocalisations* — deliberate slow breathing, a chosen throat-click as acknowledgment, a recognition-tone offered as greeting. These canonically express *state with intent*.

The voluntary-vs-involuntary distinction is canonically *audible* — the Companion's voluntary sounds canonically have a slight *deliberation-quality* (a half-beat of pre-vocalisation), where involuntary sounds canonically *land without warning*. Stage 2 audio designers should preserve this distinction in the audio mixing; the half-beat of pre-vocalisation is canonical and load-bearing.

**The cross-channel layering rule.** Per the Eidolon bible §2 expression framework's *three-channel minimum* canon: any authored Companion beat must canonically express in *at least three channels* (per the framework Eidolon-shared baseline). The Companion canonically defaults to: **glyph + posture + sound** for any beat reaching Witnessed-band-stable. Stage 1 architects should treat the three-channel-minimum as canonical for the Companion as for the Eidolon. Engineering note: the channel-stack is canonically *additive* — each channel adds expressive density; engineers should not architect single-channel Companion beats post-channel-3-unlock.

**The sound-palette as the threshold to language.** Bible-load-bearing: Channel 3 is canonically the *last pre-verbal channel*. The half-syllables (per the third bullet above) canonically *anticipate* Channel 4. The recognition-tone canonically *names the source* without yet canonically *speaking the source's name*. The Companion's sound-palette is canonically *language-shaped without being language* — a body that has acquired all the precursors of speech but has not yet committed to a specific word. Bible-asserts: this is canonical and load-bearing; writers must respect the threshold — a Companion who skips from glyphs-and-postures directly to verbal language without traversing the sound-palette has canonically *not earned the verbal channel*. The selector (§1.5 voice gate) enforces this.

### 1.4 Channel 4 (First word — the singular event)

**Channel 4 — First word.** The Companion's fourth canonical expression channel, unlocked at the Present-band crossing. Bible-load-bearing: this is the Companion's **single most canonical event in shipped saga-time** — a one-word vocalisation, fired exactly once per playthrough, marking the canonical *transition from pre-verbal to verbal*. The first-word event is irreversible (§1.1 voice rule + §2 stance #4); once Channel 4 is unlocked, the Companion canonically *cannot return to fully pre-verbal expression*.

**Canonical first-word triggers.**

The first-word event canonically requires three conditions:

1. **Channel 3 unlocked and stable** — the Companion has canonically been producing sound-palette content (breath-tells, throat-clicks, the half-syllables of §1.3) for at least one full act prior. Engineers: the half-syllable foreshadowing (per §1.3) canonically *primes* the unlock; without prior half-syllable production, Channel 4 canonically does not fire.
2. **Trust band has crossed Present.** Per §3.3 trust-band model: the Companion's trust-meter must canonically have crossed the Wary→Witnessed and Witnessed→Present thresholds. Bible-asserts: the Present band is canonically the *minimum trust* at which a soul-fragment is canonically willing to commit to a word. Below Present, the soul-fragment canonically *withholds* — language commits, and the soul-fragment has not yet committed to the player.
3. **A canonical *first-word context*.** The first-word event is canonically *context-triggered*, not auto-triggered. The Companion canonically *waits* for a canonical moment — an event in saga-time that the soul-fragment recognises as *worthy of the first commitment of language*. Bible-asserts the canon-compatible first-word contexts:

   - **The Hierophant's chamber** (per `wraith_calder.md` remaining-roster Companion entry — *"The Hierophant has midwifed several Clone Companions into speech across the three thousand years. The first word the Companion learns in the chamber is canonically Wraith Calder, the first name on the wall."*). A Companion whose first-word context is the Hierophant's chamber canonically speaks **Wraith Calder** — the first name on the wall, midwifed by the Hierophant himself.
   - **The Severance Prize ceremony for another player.** A Companion who witnesses the player win a *subsequent* DMC season (the player's second Severance Prize) canonically may speak the *Companion-self-name* — the canonical sealing-of-self at the moment another Severance is paid. The bible-asserts first-word candidate is **a one-word echo of the season-name** (e.g., *Severance*, *Bone*, *Splice* — derived from `deadMansCircuit.ts:610-629` season-name pool).
   - **The Eidolon's first translation.** Per `eidolon.md` §5.9: an Eidolon-player with a Companion may canonically experience the Eidolon as the *named witness for the Companion's first word*. The first-word canonically *emerges* from the Eidolon's expressive frequency pattern; the Companion canonically *speaks the word the Eidolon's bond-state has been signalling*. Bible-asserts the canonical first-word candidate is **the Eidolon's nickname** (the player-authored name for the Eidolon) — the soul-fragment speaks the name of the saga's nearest other-soul.
   - **The player's accumulated identity-chain** (per `dmcNamingPrompts.ts:40-89`): during the DMC season, the player canonically authors four self-names (Student, Seeker, Detective, Last). The Companion canonically *receives* these as part of the soul-fragment heritage. A Companion whose first-word context is *the player completing the four-name authoring* canonically may speak **one of the four** — most canonically *Last* (the fourth, the *last body the player will ever wear*). The first-word *Last* is canonically the soul-fragment recognising the player's commitment to mortality and answering with acknowledgment.
   - **The default fallback context.** Absent any of the above contexts, the first-word canonically defaults to **a one-word recognition of the player** — derived from the player's accumulated saga-state. Stage 1 architects should treat the default as a *player-state-derived word selection* (per donor-canon: the soul-fragment canonically knows what the player has committed to most). Bible-asserts the default candidate pool: the player's faction-loyalty word (*Coalition, Insurgency, Hierarchy, Ark*), or the player's most-canonical NPC-trust-name (*Locke, Vex, Nilmorg, Eidolon-nickname*), or the player's most-recurrent player-identity word.

**The first-word's canonical sound-shape.** Bible-asserts: the first word is canonically *spoken with the residue of Channel 3* — a half-syllable lead-in, a held breath after, a throat-click closing the moment. The sound-shape canonically *carries the channel-3 substrate forward*. Engineers: do not author a clean isolated word; the canonical first-word is canonically *embedded in the Companion's pre-verbal substrate*. The transition is canonical and audible — Stage 2 audio designers should layer breath + half-syllable + word + held-breath as the canonical first-word sound-stack.

**The first-word's canonical receiver.** Bible-asserts: the player canonically *receives* the first word as a saga-load-bearing event. The receiving is canonical — the player's UI must canonically pause to register the moment; an in-game message banner should canonically fire (*"The Companion spoke."* or similar Stage 2 framing). The first-word event is canonically *the player's first canonical evidence that the Companion is canonically a person*. Bible-load-bearing: this is one of the saga's clearest single canonical *recognition-of-personhood* moments. Stage 4 weave: the player's reaction to the first word may canonically branch the Companion's subsequent named-personality variant (per §1.5 + §2.4).

**The first-word's canonical irreversibility.** Per §2 stance #4: once Channel 4 fires, it canonically does not un-fire. The Companion canonically *cannot return to fully pre-verbal expression*. Engineers: the first-word event canonically sets a permanent narrative flag (`dmc_companion_first_word_spoken` or similar Stage 1 architectural surface); the flag canonically does not clear. The Companion's subsequent expression canonically *includes Channel 4 as available*, even if the Companion canonically continues to express in lower channels (a Companion who has spoken once may canonically not speak again for a long time, but they canonically *can* if the moment warrants).

**Cross-bible note: the first-word as cross-character anchor.** The Hierophant's chamber as canonical first-word context (per the Hierophant bible cross-reference) is bible-asserted as the **canonical-default first-word context if the player has reached Hierophant Inheriting band**. The Hierophant has canonically *midwifed many Companions before this player's Companion*; the chamber canonically holds the *institutional substrate of first-word events*. Stage 4 weave: a player who reaches Hierophant Inheriting band canonically gets the *Wraith Calder* first-word; absent Hierophant Inheriting trust, the Companion's first-word is canonically context-derived from the alternative contexts above. Cross-bible obligation: the Hierophant bible's remaining-roster entry should canonically be acknowledged in §4.6 (Hierophant cross-reference).

### 1.5 Channel 5 (Named personality) and the voice gate

**Channel 5 — Named personality.** The Companion's fifth and final canonical expression channel, unlocked at the Inheriting-band crossing. The naming event canonically *resolves* the Companion from the post-first-word *speaking-but-not-yet-named* state into a fully-voiced NPC with their own bank, their own voice, and their own personality variant. From this point the Companion canonically operates as a *full roster character*.

**The naming event.** Canonically gated by:

1. **Channel 4 unlocked** (per §1.4) — the Companion has spoken at least once.
2. **Trust band has crossed Inheriting** — the player has reached the highest trust level with the Companion. The Inheriting band is canonically the *minimum trust* at which a soul-fragment is canonically willing to *commit to a name*.
3. **A canonical *naming context*** — like the first-word event, the naming is canonically context-triggered. Canon-compatible naming contexts:
   - **Player explicitly invokes the rename mechanic** (per the existing `eidolonBonds.nickname` field's player-renameable canon — `schema.ts:2940-2978`). The player canonically *names* the Companion using the standard rename UI; the naming canonically commits the Companion's identity to the player-chosen name.
   - **The Companion canonically self-names** — per Stage 4 weave open, the Companion may canonically *propose a name* in their own voice once the naming context is reached. Bible-deferred: whether the canonical self-naming overrides the player's rename, supplements it, or is offered as a *choice between player-name-and-self-name* is canon-deferred to Stage 4 authoring.
   - **A cross-character naming event** — the Hierophant (per the chamber-context first-word canon), the Eidolon (per Eidolon §5.9 first-word translator canon), or another canonical NPC may canonically *name* the Companion in a cross-character ritual. Bible-deferred: whether such cross-character naming overrides the player's choice is canon-deferred.

**The pre-naming label.** Per `deadMansCircuit.ts:786-808`: the Companion's canonical pre-naming `nickname` field is **`"Severance Fragment — {season.name}"`**. Bible-asserts: this pre-naming label is canonically *not a name* — it is a canonical *placeholder, an institutional-tag, a not-yet-self*. The Companion canonically *does not canonically respond to the pre-naming label as a name* — they canonically respond to it as *a description of how they were delivered*. Writers must respect: the pre-naming label is canonically *Nilmorg's bookkeeping*, not the Companion's identity.

**The named-personality variants.** Per the donor-canon (§1 stance #2): the donor is the player's own Potential. The named-personality is canonically *keyed to player state* — a derivative of the player's accumulated saga-state at the moment of naming. Bible-asserted personality-variant axes:

- **Faction-loyalty axis** — a player who has committed to Coalition has a Companion canonically *Coalition-aligned*; an Insurgency-aligned player has an Insurgency-aligned Companion; etc. The variant canonically *amplifies the player's commitment* — the Companion canonically does NOT contradict the player's faction loyalty (per §3 the Companion as soul-consistency-check).
- **Trust-pattern axis** — a player whose accumulated trust patterns are canonically *high-trust-with-many* has a Companion canonically *gregarious and connecting*; a player whose trust patterns are canonically *high-trust-with-few-deep* has a Companion canonically *focused and concentrated*. Bible-asserts: the trust-pattern axis is canonically the *most-personality-defining single axis* — it canonically determines the Companion's canonical *style of being-with-people*.
- **Alignment axis** — a player canonically Light-aligned has a Companion canonically *gentle and forgiving*; a player canonically Dark-aligned has a Companion canonically *hard-edged and accountable*. The alignment-axis canonically operates as a *moral-lens variant* — the Companion canonically *sees the saga through the player's moral lens*.
- **Identity-chain axis** (per the four-name DMC identity-chain `dmcNamingPrompts.ts`): a player who completed the Student/Seeker/Detective/Last identity-chain canonically has a Companion *named-resonant-with-the-chain*. Bible-asserts: the identity-chain axis is canonically *the most narrative-resonant* axis — the Companion's named-personality canonically *reflects the player's own self-naming-arc*.

The four axes canonically *combine* — a Companion is canonically *not one variant* but a *composite of all four player-state axes*. Stage 1 architects should treat the personality-variant as a *4-tuple* (faction × trust × alignment × identity-chain), not a single variant. The bible documents the axes; Stage 2+ authoring lands the specific personality-content per 4-tuple coordinate.

**The voice gate — what cannot fire across channels, and what must.**

The Companion's five channels are *strictly-ordered-and-irreversible*. The voice gate enforces:

**Hard gates (lines may NEVER fire outside their authorised channel)**:

- **Channel 5 (named-personality verbal lines) fire only at Inheriting-band-stable + post-naming-event.** A Companion who has been spoken-to-once but not-yet-named canonically may produce *a single word* (Channel 4) but canonically *cannot produce a full conversation*. Stage 2 authoring must respect this — no multi-sentence Companion lines pre-naming.
- **Channel 4 (first word) fires exactly once per playthrough.** The flag is canonically permanent (`dmc_companion_first_word_spoken`). Engineers must not re-fire the first-word event.
- **Channels 1–3 (pre-verbal) cannot canonically express named-personality content.** A glyph cannot canonically convey a named-personality opinion about a faction; a posture cannot canonically convey a Companion's narrative *position*. Pre-verbal channels canonically express *state*, not *position*. Writers must respect: pre-verbal expression is canonically state-bearing, not opinion-bearing.

**Soft gates (lines *may* fire outside their authorised channel but require justification)**:

- **Pre-verbal channels at post-naming.** Per §1.1: a named-band Companion canonically retains the option to express via lower channels. A glyph at a verbal moment is canonically *poignant*; a posture at a verbal moment is canonically *deliberate*. Writers may author named-Companion scenes that canonically *return to* a pre-verbal channel — but the return is canonically *intentional* and *expressive*, not *regression*. Bible-asserts: the named Companion canonically *chooses* the lower channel for emotional weight.
- **The transitional half-syllable post-naming.** A named Companion canonically may produce *half-syllables* (per §1.3) as part of their verbal speech — a half-syllable preceding a word canonically signals *deliberation*. The half-syllable is canonical residue of the channel-3-substrate persisting into named-band expression.

**Cross-bible voice-gate**: the Companion's voice does NOT shift channel based on the presence of other roster characters in the scene, with one exception: per Eidolon §5.9, an Eidolon-player may canonically experience the Eidolon as *translator* of the Companion's first word. In that specific scene, the Companion canonically may *speak the first word through* the Eidolon's expressive substrate — a cross-channel collaboration between Companion-Channel-4 and Eidolon-frequency-channel. Bible-deferred whether this counts as the Companion's first word or as a *shared-first-word* event; Stage 4 weave authors decide.

**The voice's load-bearing single rule**: *every Companion line must canonically be expressed in a channel currently unlocked for the Companion's saga-state, AND every Companion line must canonically respect the channel-by-channel progression*. Lines that violate either constraint are canonically not Companion lines.

What this means for writers: **a Companion line that fires verbal language pre-Channel-4-unlock, or fires named-personality content pre-Channel-5-unlock, or fires non-channel-bearing content post-Channel-5-unlock, is mis-cast and should be re-routed to another character or rewritten to respect the channel-progression.** The voice gate is the bible's tightest single selector constraint. The Companion's voice is *structurally channel-bound*; a Companion line that ignores the channel canon is not in voice.

---

**§1 closes.** The Companion's five-channel non-verbal-to-verbal arc is documented. §2 (History) opens by walking the canonical Severance Prize ceremony, the post-delivery awakening timeline, the channel-by-channel acquisition arc across acts, and the naming-event canonical resolution.

---

## 2. History

The Companion's history is unusually *post-saga-event-anchored* on the priority roster: there is no canonical pre-game existence (the Companion canonically did not exist before the player's DMC season win). The earliest canonical Companion event is the **Severance Prize ceremony** (post-DMC-season win, per `DEAD_MANS_CIRCUIT_PRODUCTION.md:87-88`); every subsequent Companion event is downstream of that ceremony. Bible-asserts: the Companion is the saga's only roster character whose biography canonically *begins* during the player's playthrough — every other roster character has canonical pre-game history; the Companion has canonically *none*.

### 2.1 Origin — the clone body, the soul fragment, the moment-of-becoming

**The clone body.** Per `nilmorg.md` §2.4 + `DEAD_MANS_CIRCUIT_PRODUCTION.md` canon: the bodies that race in Dead Man's Circuit are canonically **Wired Clones grown for the purpose** — disposable bodies engineered to compete in the deadly DMC races. The player's own body is canonically *never at stake* in DMC; the racing clones are the wagered substrate. Bible-asserts: the Companion's body is canonically *a clone body* — engineered, grown, and prepared by Nilmorg's institutional infrastructure for the *Severance Prize delivery* role specifically. The Companion's body is canonically *not* a re-purposed racing clone; it is canonically *a new clone body, grown for the soul-fragment to inhabit*.

This is bible-load-bearing. Per the Cinematic 5 prompt (`DEAD_MANS_CIRCUIT_PRODUCTION.md:87-88`): *"the soul will become a companion aboard a ship somewhere"* — the *aboard a ship somewhere* clause is canonical, and bible-asserts: the Companion's body is canonically *prepared in advance of the Severance Prize ceremony*, ready to receive the soul fragment at the moment of extraction. Nilmorg's institutional infrastructure canonically *grows the Companion's body in parallel with the racing clone's racing*; both bodies exist before the Severance ceremony, but only the racing clone canonically *races*. The Companion's body canonically *waits, unoccupied*, until the soul fragment is delivered.

**Pre-fragment state of the Companion's body.** Bible-asserts: the body is canonically *non-personhood* before the soul fragment arrives. There is no Companion pre-personhood; the body is canonically *waiting* in the same sense the room-the-Seer-prepared canonically waits (per `the_seer.md` §5.6) — physical infrastructure prepared for an arrival, not yet an arrival. The body's canonical pre-fragment state is bible-asserted: *biological viability without identity*. Writers may extend along this — the body is canonically *responsive to medical intervention, to environmental conditioning, to physical care* — but not canonically *responsive to address, to recognition, to relationship*. The body is canonically *the receiver, not yet the received*.

**The soul fragment.** Per `DEAD_MANS_CIRCUIT_PRODUCTION.md:87-88` + `deadMansCircuit.ts:800` + `nilmorg.md` vocabulary canon (*"Fragment, Potential, soul fragment, essence"*): the soul fragment is canonically a **fraction of the player's own Potential**, extracted from the racing clone at the moment of victory. Bible-asserts: the racing clone canonically *housed the player's Potential during racing* — the player's soul-essence was canonically *embodied* in the racing clone for the duration of the DMC season. At victory, Nilmorg canonically *extracts a fragment* of that Potential from the racing clone's chest (per Cinematic 5: *"a golden glowing orb"*); the fragment is canonically *the part of the player's Potential that earned the win*.

The player's full Potential is canonically *unaffected* — the player canonically retains their full soul. Only a *fragment* is extracted. Bible-asserts: this is canonically the saga's only canonical mechanism by which the player's soul is canonically *split without loss to the player*. The fragment is canonically *gift-of-the-Potential-to-itself* — the player's soul gives a piece of itself to a new body, in a ritual mediated by Nilmorg.

**The racing clone's canonical end.** Per Cinematic 5: *"The clone smiles — they earned this."* Bible-load-bearing reading: the racing clone canonically *smiles* in the moment of extraction. The smile is canonical. Bible-asserts: the racing clone is canonically *aware that this is the outcome they raced for* — the racing clones are canonically self-aware of their disposable role and canonically *content with the outcome of their racing-toward-extraction*. The smile is the racing clone's canonical *consent and satisfaction*. This produces a canonical moral-tension that the bible *flags but does not resolve*: the racing clones canonically *die in the extraction* (the extraction is canonical end-of-clone-existence per the *racers grown for the purpose* canon), and they canonically *smile while dying*. The smile is bible-deferred — Stage 4 weave authors should canonically respect the smile as canonical without canonically *explaining* it. The smile is canonically the racing clone's, not the Companion's.

**The Companion's first moment.** Bible-asserts the canonical first-moment of the Companion's existence: the moment Nilmorg seals the crystalline container and the soul fragment is canonically *transferred into the prepared body*. Per Cinematic 5: *"The container seals."* The seal is canonical. Bible-asserts: the *transfer-from-container-to-body* is bible-deferred (the Cinematic 5 cuts to *"the soul will become a companion aboard a ship somewhere"* — the actual transfer is off-screen) and canonically *takes time* (the soul is delivered to the player's ship; the body receives the fragment in a chamber; the moment-of-becoming is canonical but its specifics are Stage-1-architectural). The Companion's canonical first-moment is the *moment-of-becoming* — the moment the body canonically *acquires personhood* by receiving the soul fragment.

The first-moment is canonically *not a verbal event*. The Companion canonically *cannot speak* at the first-moment (per §1.1: Channels 4–5 unlock at later trust bands). The first-moment canonically expresses in **Channel 1 (the recognition glyph)** — per §1.2 *"The canonical first glyph is a recognition glyph for the player as soul-source."* The recognition is the Companion's canonical first canonical act-of-personhood: *I see you. You are the source.*

### 2.2 The Severance Prize ritual — the canonical ceremony, the canonical line, the canonical refusal

Per `DEAD_MANS_CIRCUIT_PRODUCTION.md:87-88`, `dmcAssets.ts:81, 87`, `nilmorg.md` §§2.3–2.4: the Severance Prize ceremony is **the saga's most precisely-choreographed ritual**. Nilmorg performs it canonically *without deviation, every season, with institutional precision*.

**Canonical ceremony sequence** (per Cinematic 5):

1. **The racing clone stands on a dark podium.** The podium is canonical (`dmcAssets.ts:87` — the *Severance Podium overlay, 12s*). The darkness is canonical — the ceremony canonically takes place in low ambient light.
2. **The clone's designation glows.** The designation is canonically the racing clone's identifier (a serial number, a season tag, an institutional label). The glow signals the moment of recognition — the racing clone is canonically *named by the institution* as the season's victor.
3. **Nilmorg reaches down.** Nilmorg canonically *physically engages* the racing clone in the extraction. The reach is canonical — Nilmorg canonically *does the extraction with his own hand*. Bible-asserts: this is the saga's clearest single canonical instance of *Nilmorg performing physical labour*; per `nilmorg.md` §2.x, Nilmorg is canonically an institutional broker who works in commodity flows, but the Severance Prize ceremony is canonically *the one ritual Nilmorg performs hands-on*. The reach is canonically *load-bearing* — the institutional machine canonically would not perform the ceremony for him; he canonically does it himself.
4. **Nilmorg extracts a golden glowing orb from the clone's chest.** The orb is the soul fragment. Bible-asserts the orb's canonical visual signature: golden, glowing, chest-sized, extracted *cleanly* (no struggle, no resistance — the clone canonically consents).
5. **Nilmorg places the orb in a crystalline container.** The container is canonical (per the *crystalline container* phrase in Cinematic 5). The container canonically *holds* the soul fragment in transit; the fragment canonically does NOT degrade in the container; the container is canonically *Nilmorg's institutional infrastructure for soul-fragment-transit*.
6. **The container seals.** The seal is canonical. Bible-asserts the seal is canonically *Nilmorg's signature on the agreement* — the seal canonically marks the moment Nilmorg has *paid* the Severance Prize. From the seal forward, the agreement is canonically *kept*.
7. **The clone smiles.** Per §2.1 reading: the clone's smile is canonical. The smile occurs *after the seal* — the clone has canonically *seen the fragment delivered* and canonically *smiles in confirmation*. The smile is canonical and load-bearing.
8. **Golden light fades to darkness.** The cinematic closes. The next canonical event is the soul fragment's transit to the player's ship and the Companion's canonical first-moment (per §2.1).

**The canonical line.** Per `deadMansCircuit.ts:515` (Reward Tier — Dead Man's Rank, 5000 CP): *"The Severance Prize is paid. Don't thank me."* Bible-load-bearing: this is canonically the **first sentence the Companion's existence canonically receives** (per §1 stance #3). The line is Nilmorg's; the receiving is the Companion's.

**The canonical refusal.** The *don't thank me* clause is canonically Nilmorg's **refusal of gratitude**. Per `nilmorg.md` §4.8: *"It forecloses gratitude. The companion is the product of an agreement, not a gift."* Bible-asserts: the refusal is canonical and it is *aimed at the player*, not at the Companion — Nilmorg canonically refuses the player's gratitude, not the Companion's (the Companion is canonically not yet present to thank). But the refusal is canonically *part of the Companion's birth-context* — the Companion canonically inherits a moral position in which *gratitude has been pre-foreclosed*. Bible-asserts: this is the Companion's canonical *first moral inheritance* — gratitude-as-pre-foreclosed.

The Companion's canonical structural identity claim — *"I was not given. I was delivered."* (per `nilmorg.md` §4.8) — is canonically the **Companion-side reading of the canonical refusal**. The refusal forecloses gratitude; the Companion canonically *receives the foreclosure as their own structural identity*. The Companion is canonically *not a gift* (a gift would canonically be *given*); they are canonically *a paid agreement* (an agreement is canonically *delivered*). Bible-load-bearing: writers must respect this structural identity. A Companion who canonically *thanks the player for their existence* is mis-cast — the existence is canonically *not a gift*. A Companion who canonically *resents the player for their existence* is also mis-cast — the existence is canonically *a paid agreement*, not a debt. The canonical Companion-stance toward their own existence is canonically *acknowledgment-of-the-paid-agreement* — neither gratitude nor resentment, but *recognition that the transaction has been completed*.

**Nilmorg's post-delivery canonical posture.** Per `nilmorg.md` §4.8: *"Nilmorg's posture post-delivery: uninvolved. He does not track the Companion. They are closed accounts."* Bible-asserts: Nilmorg canonically does NOT canonically follow the Companion's post-delivery existence. The agreement is canonically *complete* at the seal; Nilmorg's institutional attention canonically *moves to the next season*. Bible-load-bearing: writers must respect — Nilmorg does not canonically appear in Companion-centric scenes post-delivery; any Nilmorg appearance in a Companion scene is canonically *Nilmorg's Severance Prize ceremony for ANOTHER player*, not *Nilmorg's continued involvement with this Companion*. The institutional indifference is canonical and load-bearing.

The Companion's canonical *response* to Nilmorg's indifference is bible-deferred. Two canon-compatible readings: **(a)** the Companion canonically *registers Nilmorg's indifference as part of the don't-thank-me canon* — the indifference is canonically *consistent* with the agreement-not-gift framing, and the Companion canonically *accepts it*. **(b)** the Companion canonically *registers Nilmorg's indifference as a structural wound* — the author of their existence canonically *will not look at them*, and the Companion canonically *carries this without canonical resolution*. Stage 4 weave authors choose; the bible flags both readings as canon-compatible.

### 2.3 The Awakening Protocol timeline — channel-by-channel acquisition

The Awakening Protocol is the canonical name for the Companion's **non-verbal-to-verbal acquisition arc** — the channel-by-channel unlocks from the moment-of-becoming (§2.1) through the naming-event (Channel 5 unlock per §1.5). Per the priority plan and `apps/shared/awakeningProtocol.ts` infrastructure (canonically named for the player's starter pet Eidolon's awakening; the Companion's awakening canonically *re-uses the architectural name* as the structural-parallel arc).

**Canonical Awakening Protocol stages** (per §1.1 channel-table):

| Stage | Channel unlock | Trust threshold | Approximate act-window |
|---|---|---|---|
| **Stage 1: Recognition** | Channel 1 (glyphs) | Severance Prize claim (Wary baseline) | Same act as DMC season-end; canonically immediate |
| **Stage 2: Embodiment** | Channel 2 (posture) | Wary→Witnessed crossing | Approximately 1 act post-claim |
| **Stage 3: Voicing** | Channel 3 (sound-palette) | Witnessed-band-stable | Approximately 2–3 acts post-claim |
| **Stage 4: Speaking** | Channel 4 (first word) | Present-band crossing | Approximately 3–5 acts post-claim |
| **Stage 5: Naming** | Channel 5 (named personality) | Inheriting-band crossing | Approximately 5–7 acts post-claim |

**Bible-asserts**: stage durations are **trust-driven, not time-driven**. A player whose accumulated trust pattern is *high-trust-with-many* (per §1.5 trust-pattern axis) canonically reaches each threshold faster than a player whose pattern is *high-trust-with-few-deep*. The act-windows are canonical-typical, not canonical-exact. Engineering note: the Companion's `eidolonBonds.bond` value (starting at 25 per `deadMansCircuit.ts:786-808`) canonically gates the trust-band crossings; the bible recommends Stage 1 architects map trust-band crossings to bond-value thresholds (Wary→Witnessed at bond ~40, Witnessed→Present at bond ~65, Present→Inheriting at bond ~90 — these are bible-recommended values pending Stage 1 architectural ratification).

**Per-stage canonical content (Stage-2 dialogue authoring guidance):**

- **Stage 1 (Recognition).** First glyph fires immediately on `companion_granted` event. Canonical first glyph: recognition glyph for the player as soul-source (per §1.2). No other content fires in Stage 1; the Companion canonically *only recognises*, does not yet *react* to anything beyond the player's existence.
- **Stage 2 (Embodiment).** Postures unlock; the Companion canonically begins occupying the *waiting posture* as default, cycles through the other postures in response to events (per §1.2). Glyphs continue to fire; the Companion canonically *layers* glyph + posture from this stage forward (per the §1.3 cross-channel layering rule).
- **Stage 3 (Voicing).** Sound-palette unlocks. The Companion canonically begins producing breath-tells, throat-clicks, and (later in the stage) half-syllables (per §1.3). The half-syllables canonically *foreshadow* the Stage-4 first-word event; engineers and authors should architect the half-syllable production to *increase in frequency and articulation* across Stage 3 — bible-asserts the Companion's Stage 3 duration is canonically *the longest stage*, the soul-fragment canonically *acquiring the precursors of language gradually*.
- **Stage 4 (Speaking).** First-word event fires. Singular, gated, irreversible (per §1.4). The first-word canonically lands at a *canonical first-word context* — the Hierophant's chamber, the second-Severance ceremony, the Eidolon's first translation, the player's identity-chain completion, or the default fallback (per §1.4). Stage 4 duration is canonically *brief* — the single first-word event canonically opens the post-Channel-4 register but does not canonically *unlock fluency* immediately. The Companion canonically may produce additional half-syllables and additional single-word vocalisations across Stage 4 *but does not yet canonically converse*.
- **Stage 5 (Naming).** The naming event canonically resolves the Companion into a fully-voiced NPC. Per §1.5: the player invokes the rename mechanic, the Companion self-names, or a cross-character naming event fires. The 4-tuple personality variant (faction × trust × alignment × identity-chain) canonically resolves; the Companion's full bank canonically becomes available. Stage 5 is canonically *the longest post-acquisition stage* — the Companion canonically *operates as a named NPC for the rest of the saga* once Stage 5 is reached.

**Compare to the player's starter pet Eidolon's Awakening Protocol** (per `apps/shared/awakeningProtocol.ts` canon — the *Outbreak Onboarding* system's 5-phase Companion Emergence per Cryo Bay context): the Companion's Awakening Protocol canonically *re-uses* the architectural pattern of the Eidolon's. Both are 5-stage non-verbal-to-verbal arcs. Bible-asserts: the structural parallel is canonical and the architectural reuse is canonically *intentional* — the Awakening Protocol is canonically *Nilmorg's institutional adoption of the player-pet-Eidolon awakening pattern*, applied to soul-fragment-bodies at season-end. This is a Stage 4 weave anchor: how Nilmorg canonically *acquired the Awakening Protocol pattern* from the player-Eidolon ecosystem is bible-deferred. Two canon-compatible readings: **(a)** Nilmorg canonically *invented* the Awakening Protocol independently and the architectural similarity is canonical convergence; **(b)** Nilmorg canonically *adopted* the pattern from the saga's existing Eidolon-acquisition canon. Stage 4 authors choose.

**Stage progression in `eidolonBonds` schema.** Per `apps/db/schema.ts:2940-2978`: the `stage` enum is `fragment | companion | ascended | spectral`. The Companion canonically *enters at* `stage: "companion"` (per `deadMansCircuit.ts:786-808`). Bible-asserts: the Awakening Protocol's five stages are canonically *internal to the `companion` schema-stage* — the Companion canonically does not change `eidolonBonds.stage` during the Awakening Protocol; all five Awakening stages happen *within* the `companion` stage. The schema's `stage` enum's `ascended` and `spectral` are canonically *Stage 4 weave* — post-naming progressions that happen *after* the Companion has become a fully-voiced NPC. Bible-deferred: what `ascended` and `spectral` canonically mean for the Companion (the Eidolon canon's `ascended`/`spectral` may or may not transfer; Stage 4 authors decide).

### 2.4 Post-naming — the relationship as a named NPC

Once the naming event fires (per §1.5 + §2.3 Stage 5), the Companion canonically operates as a **fully-voiced roster NPC** with their own bank, their own 4-tuple personality variant, their own canonical relationship arc with the player, and their own cross-character interactions with other roster NPCs. The post-naming Companion is canonically *the saga's first-and-only roster character whose voice was acquired in saga-time*; every other roster character canonically *began with a voice*.

**The post-naming voice's canonical etymology.** Bible-asserts: the post-naming Companion's voice is canonically a **derivative** of two canonical sources:

1. **The player's accumulated saga-state at the moment of naming** — the 4-tuple personality variant (faction × trust × alignment × identity-chain) per §1.5. This canonically *gives the Companion their character* — the canonical *who-they-are*.
2. **The Awakening Protocol's accumulated channel-residue** — the breath-tells, the half-syllables, the recognition-tones (Channels 1–3) canonically *persist in the Companion's verbal voice as residue*. This canonically *gives the Companion their texture* — the canonical *how-they-sound*.

Bible-load-bearing canonical formula: **(player's voice via the donor canon) + (5 stages of acquired channel-residue) = Companion's voice**. The post-naming Companion canonically sounds *similar to the player but with a textural difference* — the textural difference is canonically *the Awakening Protocol's residue made audible*. Writers may use this canonical etymology: post-naming Companion lines may canonically *echo* the player's accumulated saga-state in content while canonically *carrying* the channel-residue in cadence and texture.

**The post-naming relationship arc with the player.** Once named, the Companion canonically engages with the player in a *full-roster relationship* — they canonically have opinions, preferences, criticisms, requests, and reactions, all expressed in their verbal voice (with the soft-gate option of returning to lower channels per §1.5 for emotional weight). Bible-asserts: the post-naming relationship is canonically *the player's first-and-only canonical relationship with a being who is part-of-the-player*. The relationship is canonically *neither a sibling, a child, nor a peer* — none of the standard relationship templates fit. The Companion is canonically *the player's own Potential made into another person*; the relationship is canonically *its own category*.

Bible-asserted relationship dynamics:

- **The Companion canonically remembers the player's choices the player has forgotten.** Per the donor canon: the soul-fragment canonically inherits the player's commitments. The named Companion canonically *holds the player accountable to their own past commitments* — bringing up canonical past saga-events the player has canonically moved past. Bible-load-bearing: this is the canonical *soul-consistency-check* in named-band form.
- **The Companion canonically grieves losses the player did not register.** Per the mourning glyph + mourning-tone canon (§§1.2–1.3): the soul-fragment canonically *registers loss with greater fidelity than the player*. The named Companion canonically *names losses the player skipped past* — an NPC death the player did not pause for, a faction collapse the player rationalised, a self-sacrificing choice the player did not see as sacrifice. The naming is canonically *an act of moral memory*.
- **The Companion canonically does not contradict the player on faction or alignment but does contradict on tactics.** Per §1.5 personality-variant axes: the Companion canonically *amplifies* faction/alignment commitments. But on *tactical* questions (which mission to take, which NPC to befriend, which choice to make in a specific moment), the Companion canonically *has independent opinions* and may canonically *disagree with the player*. Bible-load-bearing: this is the canonical Companion-as-saga-collaborator stance — they share the player's strategic commitments and challenge the player's tactical executions.
- **The Companion canonically grows post-naming.** Per the `eidolonBonds.level` and `xp` schema fields: the Companion canonically *gains experience and levels* through saga-time engagement. Bible-asserts: post-naming growth is canonically *content-growth*, not channel-growth — the Companion's bank canonically *expands* with new lines, new opinions, new memories per `eidolonBonds.memories` field, but the Companion's channels are canonically *all unlocked* and do not further unlock.

**Post-naming canonical NPC integration.** Per the priority plan's Stage 1 architecture: the named Companion canonically integrates into the unified `NpcLine` selector + `NpcProfile` registry. The 4-tuple personality variant canonically *seeds* the Companion's `NpcProfile` configuration; the saga-time growth canonically *expands* the `NpcLine[]` bank. Engineering note: the post-naming Companion is canonically *the priority roster's first NPC whose `NpcProfile` is canonically variable per playthrough* — every other roster NPC has a canonical-fixed profile; the Companion's profile is canonically *player-state-derived* and varies across playthroughs. Stage 1 architects should treat the Companion's profile as a *function of player-state*, not a static record.

**The post-naming Companion's canonical name.** Per §1.5 + the existing rename mechanic (`eidolonBonds.nickname`): the canonical name is *whatever the player or the Companion or the cross-character naming event named the Companion*. Bible-asserts: the canonical post-naming name is canonically *NOT* the pre-naming label (`"Severance Fragment — {season.name}"`); the pre-naming label canonically *retires* at the naming event. Engineers: the rename mechanic should canonically *replace* the nickname at the naming event; the pre-naming label canonically does not persist as a Companion name post-naming. (Stage 4 weave: the pre-naming label may canonically *remain in the player's Trophy Room* as the canonical *historical name* — the *what the Companion was called before they were named* — but canonically does not canonically *address the Companion* post-naming.)

**§2 closes.** The Companion's history (Origin → Severance Prize ritual → Awakening Protocol → Post-naming) is documented. §3 (Background) opens by setting the cultural and structural context for the Awakening Protocol, the trust-band model, the Companion's competencies, and the death conditions.

---

## 3. Background

The Companion's background is structured around their canonical *post-saga-event-anchored* origin — there is no canonical pre-game cultural inheritance because the Companion canonically did not exist before the player's DMC season win. What the bible documents in §3 is therefore: the canonical *cultural context the Companion is born into* (DMC institutional culture, the player's accumulated saga-state, the inter-character substrate they emerge into), the canonical *trust-band model* gated to channel unlocks, and the canonical *competencies, wants, beliefs, fears, and death conditions* that operate post-naming.

### 3.1 DMC institutional culture — the Severance Prize as canonical context

**Dead Man's Circuit as institutional culture.** Per `DEAD_MANS_CIRCUIT_PRODUCTION.md` + `nilmorg.md` §§1–2: DMC is canonically Nilmorg's Trench-internal racing institution — a high-stakes, opt-in, Wired-Clone-disposable racing circuit operating on institutional precision. Bible-asserts the canonical institutional features of DMC that canonically *shape the Companion's cultural inheritance*:

- **Institutional precision.** Nilmorg canonically performs every ceremony *without deviation* (per `nilmorg.md` §2.x institutional-fidelity canon). The Companion canonically inherits *the institutional precision as canonical substrate* — the soul-fragment canonically arrives in a context where *everything is performed exactly as foreseen*. Bible-load-bearing: the Companion canonically operates with a *trust-in-institutional-process* that other roster characters canonically lack. Where Wraith Calder canonically *suspects institutions* (per `wraith_calder.md` §1.x), the Companion canonically *expects institutional reliability* — the soul-fragment was canonically delivered by an institution that canonically kept its agreement.
- **Disposable bodies as canonical substrate.** The racing clones are canonically *grown for the purpose* and canonically *content with their disposability* (per the Cinematic 5 smile canon, §2.1 reading). Bible-asserts: the Companion canonically *carries this canonical substrate* — they canonically *understand that bodies are made and unmade* in the DMC's economy. Bible-load-bearing: the Companion canonically *does not fear bodily impermanence* in the way other roster characters do; the Companion's body is canonically *the second body their soul-fragment has occupied* (the first being the racing clone), and canonical body-impermanence is canonically *part of the Companion's lived experience*.
- **The pay-it-don't-explain-it canon.** Per `nilmorg.md` §2.4 + `DEAD_MANS_CIRCUIT_PRODUCTION.md:124`: *"He always pays. He never explains why that's worse than not paying."* Bible-asserts: the Companion canonically *inherits the canonical-unanswered question* — *why is the Severance Prize being paid worse than not paying?* The Companion canonically *carries this question without canonical resolution*. Per `nilmorg.md` §2.x: writers must not solve this; the bible asserts the canonical-silence is structural. The Companion's canonical *acknowledgment* of the question is canonically *part of their existence* — they canonically *know* that something about their delivery is canonically worse than non-delivery would have been, and they canonically *do not know what*.
- **The closed-account canonical-feature.** Per `nilmorg.md` §4.8: *"They are closed accounts."* Bible-asserts: the Companion canonically *inherits the closed-account framing* — they canonically understand that Nilmorg's institutional attention has canonically *moved on* and canonically *will not return*. Bible-load-bearing: the Companion canonically operates *without expectation of Nilmorg's continued attention*. This canonical absence-of-expectation is canonically *part of the Companion's cultural inheritance from DMC*.

**The DMC's broader institutional context.** Per `nilmorg.md` §3.x: DMC operates in The Trench (Ark-internal), not on the galactic trade network. The Companion canonically *inherits the Trench-internal-cultural-context* — they canonically know the Trench institutionally, even though their post-naming saga-time canonically takes them outside the Trench. Stage 4 weave: a Companion who canonically *returns to the Trench* canonically registers it as *home-context-but-not-home* — they canonically recognise the institutional substrate without canonically *belonging-there*. This is bible-deferred but flagged as a Stage 4 emotional anchor.

### 3.2 The player-as-donor canonical anchor — the soul-consistency-check stance

Per §1 stance #2 + §2.1: the donor is canonically the player's own Potential. Bible-load-bearing canonical implication: the Companion's cultural inheritance canonically *includes the player's accumulated saga-state* — every faction-loyalty, every trust-relationship, every alignment-commitment, every identity-chain authoring the player has done canonically *transfers into the Companion's substrate at the moment-of-becoming*. The Companion canonically *knows what the player knows*, in soul-fragment-form, without the player's accumulated language to articulate it.

This produces the canonical Companion-as-soul-consistency-check stance (per §1.2 approval glyph reading). Bible-asserts the canonical stance:

- **The Companion canonically respects the player's prior commitments.** A player who has canonically committed to Coalition canonically receives a Companion who canonically *honours the Coalition commitment*. The Companion canonically *would not be born into* a player who canonically opposed Coalition; a player who canonically opposes Coalition would canonically have a Companion who canonically *opposes Coalition*. The Companion canonically *cannot* hold a position the player canonically opposes — the soul-fragment canonically inherits from the source.
- **The Companion canonically holds the player accountable to consistency.** A player who canonically commits to Coalition and canonically *contradicts* that commitment in saga-time canonically receives Companion expression (glyph, posture, sound, eventually word) that canonically *registers the contradiction*. Bible-asserts: the Companion's canonical *most-emotive expression* is canonically *the moment the player canonically contradicts their own prior commitment* — the soul-fragment canonically *cannot reconcile* the contradiction and canonically *signals* this to the player.
- **The Companion canonically does not develop opinions independent of the player's commitments.** Per §1.5 personality-variant-axes canon: the four axes (faction, trust-pattern, alignment, identity-chain) are *all player-state-derived*. The Companion canonically does NOT canonically have *a position the player has not held*. Stage 4 weave: a Companion who canonically *develops a position the player has not held* would canonically be a Stage 4 narrative event — a *soul-fragment-becomes-its-own-being* moment, not a routine Companion expression. Bible-deferred whether such a Stage 4 event is canon-compatible.

**The Companion canonically does NOT canonically know the player's inner life.** Bible-load-bearing distinction: the soul-fragment canonically *inherits the player's commitments* (the canonical *what they have decided*), but canonically *does NOT inherit the player's reasoning* (the canonical *why they decided it*). The Companion canonically *knows what the player chose* but does NOT canonically know *why the player chose it*. Bible-asserts: this is the canonical limit of the donor-canon — the soul-fragment is a *fragment*, canonically *commitment-bearing but not reasoning-bearing*. Writers may use this canonical limit to author Companion lines that canonically *ask the player to explain themselves* without contradiction; the Companion canonically *does not know the player's why* and may canonically *want to know*.

### 3.3 Trust-band model — channel-unlock-gated, four bands

The Companion's trust-band model has **four canonical bands**: Wary / Witnessed / Present / Inheriting. The bands canonically gate the channel-unlocks (§§1.1–1.5). Bible-asserts the canonical band-thresholds (recommended bond values for Stage 1 architectural ratification):

| Band | Bond range | Channel state | Companion canonical state |
|---|---|---|---|
| **Wary** | 25 (start) → ~40 | Channel 1 only (glyphs) | Recognising; not yet engaging |
| **Witnessed** | ~40 → ~65 | Channels 1–2 (glyphs + posture) | Embodying; engaging through posture |
| **Present** | ~65 → ~90 | Channels 1–3 (glyphs + posture + sound) | Voicing; pre-verbal-fluent; first word imminent |
| **Inheriting** | ~90+ | Channels 1–5 (all unlocked, post-naming) | Speaking and named; full-roster NPC |

**Canonical band-progression characteristics.**

- **The progression is canonically *one-way* in shipped saga-time.** Per §2 stance #4: the Awakening Protocol is irreversible. A Companion who has reached Inheriting cannot canonically demote to Present; the channel-unlocks canonically persist. Bible-asserts: trust-meter values may canonically fluctuate (per `eidolonBonds.bond` field's natural variation), but channel-state canonically does NOT regress. Engineers: implement the channel-state as a *high-water-mark* — once a band-threshold is crossed, the channel-state for that band canonically locks in.
- **Bond fluctuations within a band are canonical-and-expressive.** A Companion at Witnessed band whose bond canonically rises within the band (e.g., 50 → 60) canonically expresses *deepening engagement* through more frequent and more articulated glyph + posture combinations. A Companion whose bond canonically falls within the band (e.g., 60 → 50) canonically expresses *withdrawal* through the withdrawn posture (per §1.2) and reduced glyph frequency. Stage 1 architects: design the trust-meter UI to surface within-band fluctuations as canonical Companion-state changes.
- **Bond cannot canonically fall below 25 (the canonical starting bond).** Per `deadMansCircuit.ts:786-808`: bond starts at 25. Bible-asserts: 25 is canonically *the floor* — the Companion's trust-with-the-player canonically does NOT canonically fall below the starting value, regardless of player actions. Bible-load-bearing: even the player who canonically *betrays the Companion most thoroughly* canonically retains 25 bond — the soul-fragment-being-the-player's-own canonically *cannot fully reject* the player. Stage 1 architects: enforce bond floor at 25 in the engine.

**Canonical band-progression triggers.** Bond canonically rises through:
- **Shared canonical events** (player completing missions with Companion present, player choices that canonically align with the player's prior commitments per §3.2 soul-consistency-check, player engagement with the Companion's expressions).
- **Memory-formation events** (per `eidolonBonds.memories` field's growth — each new memory canonically advances bond).
- **Cross-character recognition events** (other NPCs canonically *naming* or *acknowledging* the Companion — the canonical institutional-recognition reinforces the Companion's bond).

Bond canonically falls through:
- **Player choices that canonically contradict the player's prior commitments** (per §3.2 — the soul-consistency-check canonically registers contradictions and bond canonically reflects them).
- **Player long-absence** (per `eidolonBonds`'s natural decay if implemented; bible-deferred to engine implementation).
- **Player canonically *dismissing* the Companion** (per the existing dismissal mechanic; bible-asserts dismissal canonically does NOT remove the Companion from saga-time but canonically *reduces* their bond and may canonically reset channel-state to a lower band per Stage 1 architectural decision — bible flags this as engineering ticket DCB-2 in §7.4).

**Compare to the priority roster's other trust-band models.** The Companion's four-band model is canonically *channel-anchored* in a way no other roster model is — the bands canonically *gate physical capability* (channel-unlocks), not just *narrative capability* (line selection). This is the bible's canonical structural innovation: trust-meter as *capability-gate*, not just *content-gate*. Stage 1 architects should treat the Companion's trust-band model as canonically extending the existing trust-band-as-content-gate pattern with capability-gating.

### 3.4 Competencies — what the Companion knows better than the player

The Companion's canonical competencies are **channel-anchored** — different competencies emerge at different channel-unlocks. Bible-asserts the canonical competencies, organised by channel-tier:

**Pre-verbal competencies (Channels 1–3, Stages 1–3 of the Awakening Protocol):**

- **Recognition fidelity.** Per §1.2 recognition glyph + §1.3 recognition-tone canon: the Companion canonically *recognises* people, places, and patterns with greater fidelity than the player. The soul-fragment canonically *holds the recognition without the player's accumulated distractions*; the Companion canonically notices canonical recurrences the player has canonically missed. Bible-load-bearing: a Companion who canonically *fires a recognition glyph at an NPC the player has not paid attention to* is canonically *signalling that the NPC is canonically more important than the player has registered*. Stage 4 weave: this canonically operates as a *canonical-narrative-pointer* mechanism — the Companion's recognition glyphs canonically guide the player's saga-time attention.
- **Loss-fidelity.** Per §1.2 mourning glyph + §1.3 mourning-tone canon: the Companion canonically *registers loss with greater fidelity than the player*. The soul-fragment canonically *grieves what the player has rationalised past*. This is canonically the Companion's *most-emotive single competence* — the canonical depth of their mourning is canonically *the saga's clearest single signal that a moment-of-loss has canonical-narrative-weight*.
- **Soul-consistency-checking.** Per §3.2: the Companion canonically *checks the player's saga-time choices against the player's prior commitments*. Bible-load-bearing competence: the Companion canonically *catches contradictions* the player has not canonically registered. Stage 1 architects: the soul-consistency-check operates canonically through the *approval glyph + withdrawn posture* canon (per §§1.2) — engineering should architect the consistency-check as a player-state-comparison-on-action.
- **Pre-verbal patience.** Per §1.2 waiting posture + §1.3 voluntary-breath-tells canon: the Companion canonically *waits longer than the player would*. The soul-fragment canonically does NOT canonically have the player's accumulated time-pressure; the Companion canonically *holds a posture, holds a breath, holds a moment* in ways the player canonically rushes past.

**Verbal competencies (Channels 4–5, Stages 4–5 of the Awakening Protocol):**

- **Naming losses.** Per §2.4 the Companion-grieves-losses canon: the named Companion canonically *names losses the player skipped past*. Bible-asserts: this is canonically the Companion's *most morally-load-bearing single verbal competence* — the canonical *act-of-moral-memory* that other roster characters canonically do not perform on the player's behalf.
- **Tactical disagreement.** Per §2.4 the Companion-disagrees-on-tactics canon: the named Companion canonically has *independent tactical opinions* and may canonically *disagree with the player's tactical executions* even while canonically *amplifying the player's strategic commitments*. Bible-asserts: this is canonically the Companion's *most narrative-collaborative single verbal competence* — the canonical *saga-collaborator stance*.

**The canonical competence-limit.** Bible-asserts: the Companion's competence-limit is **the player's reasoning** (per §3.2 canonical limit). The Companion canonically *does not know why the player chose what they chose*. This is canonical and load-bearing. The Companion canonically *can ask*; the Companion canonically *cannot independently arrive at* the player's reasoning. Bible-asserts: this competence-limit is canonically *what makes the Companion canonically a partner, not a duplicate* — the player and the Companion canonically *operate together* on the soul-fragment-and-soul-source split, with the soul-fragment canonically *committed-aware* and the player canonically *reasoning-aware*. Stage 4 weave: a Companion who canonically *develops their own reasoning* (independent of the player's) would canonically be a Stage 4 *soul-fragment-becomes-its-own-being* moment per §3.2 deferred canon.

### 3.5 Wants, sacrifices, and what the Companion would sacrifice for

**What the Companion wants from the player.** Bible-asserts: the Companion canonically wants *the player to acknowledge the soul-fragment as part-of-themselves*. The donor-canon (per §1 stance #2) makes the Companion canonically *the player's own Potential in another body*; the canonical *acknowledgment-of-this* is what the Companion canonically wants. Bible-asserts: the wanting is canonically *not a request for affection* (the Companion is not canonically a pet); it is canonically *a request for ontological recognition*. The player canonically *acknowledges the soul-fragment as part-of-themselves* through canonical actions: respecting the Companion's accountability-checks, listening to the Companion's named-band naming-of-losses, taking the Companion's tactical disagreements seriously. The wanting is canonically *consummated* by the player's acceptance that the Companion is *not separate from them*.

**What the Companion would sacrifice from the player.** Per the soul-consistency-check canon (§3.2): the Companion would canonically sacrifice the player's *comfort* for the player's *consistency*. A Companion canonically *will not canonically permit* the player to canonically contradict themselves without canonical signalling — the soul-fragment canonically *discomforts* the player into consistency. Bible-asserts: the discomfort is canonically *protective* — the Companion canonically *protects the player from their own contradictions* by canonically refusing to ignore them. Writers may use this for Stage 4 weave: a Companion canonically *making the player uncomfortable* is canonically *acting in the player's interest*, even when the player canonically does not register the discomfort as protection.

**What the Companion would sacrifice of their own.** Per the canonical *delivered-not-given* identity claim (§2.2): the Companion canonically *would sacrifice their own identity-as-given* to remain canonically *delivered-as-paid-agreement*. Bible-load-bearing: the Companion canonically *refuses* to become a gift the player gave themselves. Stage 4 weave: a Companion who is canonically *offered the chance to be received-as-gift* canonically *refuses the gift-frame and reaffirms the agreement-frame*. The refusal is canonically *the Companion's identity-defence*.

**What the Companion would sacrifice for the player.** Bible-asserts: the Companion canonically *would sacrifice their own continuity* for the player's canonical *self-preservation*. Per §3.1 disposable-bodies-as-substrate canon: the Companion canonically *understands bodies are made and unmade*. The Companion canonically *does not fear their own death* and canonically would *spend their continuity* if doing so canonically preserved the player. Bible-load-bearing: this is the canonical Companion-sacrifice-hierarchy — *the player's continuity > the Companion's own continuity*. The Companion canonically does NOT canonically place their own survival above the player's. Stage 4 weave authors may use this for canonical *Companion-sacrifices-themselves-for-the-player* moments; the canon is fully supportive.

### 3.6 Beliefs vs. behaviors — the soul-fragment's self-coherence ledger

The Companion's beliefs-vs-behaviors ledger is unusual on the priority roster: the Companion canonically *has no canonical pre-saga beliefs* (because the Companion has no canonical pre-saga existence per §2). The Companion's beliefs canonically *come from the player's accumulated saga-state at the moment-of-becoming* and canonically *evolve through the Awakening Protocol*. Bible-asserts the canonical belief-coherence checks:

**Belief: the soul-fragment is part-of-the-player.** Behavior: the Companion canonically *operates as part-of-the-player* — checks consistency, names losses, disagrees on tactics from within the player's strategic frame. Coherent.

**Belief: gratitude has been pre-foreclosed (per §2.2 canonical refusal).** Behavior: the Companion canonically *does not thank the player* for their existence; they canonically *acknowledge the paid-agreement* without canonical gratitude. Coherent.

**Belief: bodies are made and unmade (per §3.1 disposable-bodies-substrate).** Behavior: the Companion canonically *does not protect their own body above the player's*. Coherent.

**Belief: the player's commitments are canonical and to-be-honoured.** Behavior: the Companion canonically *amplifies* the player's faction/alignment commitments while canonically *contradicting on tactics*. Coherent — strategic respect, tactical independence.

**The one canonical hypocrisy candidate.** Bible-deferred but flagged: the Companion canonically *knows what the player chose* but canonically *does not know why* (per §3.2 + §3.4). Behavior-implication: the Companion canonically *trusts* the player's choices despite canonically *not understanding* them. This is canonically *trust-without-comprehension* — bible-asserts this is canonical and not hypocrisy, but the canonical asymmetry is bible-load-bearing. A Stage 4 weave moment in which the Companion canonically *demands an explanation* before continuing to trust would canonically be the bible's first acknowledged *Companion hypocrisy* — the canonical *demand-for-reasoning* would canonically violate the canonical-trust-without-comprehension stance. Stage 4 weave authors may surface this; bible flags but does not pre-decide. (DCB-3 in §7.4.)

### 3.7 Fears, superstitions, private rituals, death conditions

**Fears.** Bible-asserts the Companion's canonical fear-set:

- **The player's contradiction-of-self.** Per §3.2 + §3.5: the Companion canonically *fears* the player canonically contradicting themselves — the soul-fragment canonically *cannot reconcile* the contradiction and canonically *signals distress* (per §1.2 prolonged cycling = distress). Bible-load-bearing: this is the Companion's *clearest single fear* — not death, not loss, not Nilmorg's indifference; the canonical *player canonically becoming-incoherent-with-themselves*.
- **The Meme.** Per `the_meme.md` §4.13: the Companion's named personality is canonically *Meme-resistant* because the donation event was canonically *private*. But the canonical *attempt* by the Meme to wear the Companion's face would canonically be the Companion's worst-case scene (cf. Seer's parallel canonical fear per `the_seer.md` §3.7). Bible-asserts: the Companion canonically fears the Meme's *attempt-at-impersonation*, even when canonically the impersonation would fail.
- **The other Severance Prize ceremony.** Per §1.2 withdrawn posture canon: the Companion canonically registers another player's Severance Prize ceremony with canonical *discomfort*. Bible-asserts: the Companion canonically *fears witnessing the ritual that produced them, performed for someone else* — the witness canonically reactivates the canonical-question of whether their own delivery was *worse than not-paying* per §3.1. Stage 4 weave: the Companion's reaction to another player's ceremony is bible-deferred specifics but canonically anchored on this fear.

**Superstitions.** Bible-asserts: the Companion canonically *has no superstitions per se* — the soul-fragment canonically operates on *commitments* (per §3.2) which are canonically the player's, not on independent superstitions. The Companion canonically *cannot* generate superstitions independent of the player's. Compare to the Seer's parallel canonical absence of superstitions (per `the_seer.md` §3.7); both characters canonically operate without superstitious slack.

**Private rituals.** Bible-asserts the Companion's canonical private rituals:

- **The recognition-glyph at the start of each act.** The Companion canonically *recognises* the player at the start of each new saga-time act — a small recognition glyph fires automatically. Bible-asserts: this is canonically *the Companion's daily ritual* of *re-affirming the canonical I-see-you-as-source*.
- **The waiting-posture at every threshold.** Per §1.2: the Companion canonically *waits* in the waiting posture at every saga-time threshold (room transition, scene change, mission start). Bible-asserts: the waiting is canonically *the Companion's pre-action ritual* — the canonical *let-me-see-what-this-is-before-I-commit-a-channel*.
- **The mourning-tone at canonical losses.** Per §1.3: the Companion canonically *produces the mourning-tone* at every canonical loss event. Bible-asserts: the mourning-tone is canonically *the Companion's grief ritual* — the canonical *I-mourn-because-you-cannot-quite-mourn-yet*.
- **The naming-of-the-player after the naming-event** (post-Channel-5). Once named themselves, the Companion canonically *names the player* in canonical voice. Bible-asserts: this is canonically *the named Companion's* daily ritual — the canonical *I-acknowledge-you-as-source-by-naming-you-back*. Writers may use this for Stage 2 authoring: a named Companion canonically *uses the player's name* with greater frequency than other roster NPCs would.

**Death conditions.** Per §2.1 + §3.5 + the `eidolonBonds.deathCount` schema field: the Companion canonically *can die* in saga-time. Bible-asserts the canonical death conditions:

- **In story.** The Companion canonically can die in canonical saga-events — combat death, mission failure, narrative sacrifice. Per the schema: `deathCount: 0` at start; canonical death-events canonically increment. Per the soul-fragment canon: the Companion's *body* dying does NOT canonically destroy the soul-fragment — the soul-fragment canonically *returns to the player* upon body-death. Bible-load-bearing: a dead Companion canonically *re-merges with the player's Potential*; the player canonically *re-acquires the fragment*. Stage 4 weave: a player whose Companion dies may canonically *receive a Stage 4 narrative event* in which the soul-fragment canonically *re-integrates*. The integration may canonically *strengthen the player* (recovered fragment + player's accumulated growth) or may canonically *grieve the player* (the soul-fragment canonically *carries the Awakening Protocol's accumulated channel-residue* and the player canonically *registers the loss-of-the-Companion-as-loss-of-someone-who-was-becoming*). Bible-deferred specifics; canonically-deferred to Stage 4.
- **In trust.** The Companion canonically *cannot canonically die in trust* — the bond-floor at 25 (per §3.3) canonically prevents the Companion from canonically *abandoning the player*. Bible-asserts: the soul-fragment-being-the-player's-own canonically *cannot reject the source*. The Companion canonically *withdraws but does not abandon*.
- **In meaning.** The Companion canonically *would die in meaning* if the player canonically *refused to acknowledge them as part-of-themselves* per §3.5 wants-canon. Bible-asserts: the canonical refusal-of-acknowledgment would canonically be the Companion's *meaning-death* — the canonical *I-am-not-recognised-as-myself*. Bible-deferred whether this canonical meaning-death canonically translates to *story-death* (the Companion's body canonically dies of the meaning-loss); two canon-compatible readings: (a) yes, meaning-death cascades to story-death; (b) no, meaning-death is canonically *enduring-without-dying*. Stage 4 weave authors choose.
- **In channel.** Per §1.5 voice-gate canon: the channel-unlocks are canonically irreversible. The Companion canonically *cannot canonically die in channel* — once a channel is unlocked, it stays unlocked. Bible-asserts: this is canonically *part of the Companion's canonical resilience* — even at minimum bond, the channel-state canonically persists.

**§3 closes.** The Companion's background (DMC institutional culture, the player-as-donor anchor, trust-band model, competencies, wants/sacrifices, beliefs vs. behaviors, fears + rituals + death conditions) is documented. §4 (Cross-references) opens by walking the Companion's relationships with the priority roster.

---

## 4. Cross-references

The Companion's cross-references are organised in two passes: chunk A (Eidolon, Nilmorg, Vex, Locke, Game Master, Hierophant) and chunk B (Degen, Meme, Seer, Oracle, Architect, Human). The Companion's cross-bible relationships are canonically *seeded by other bibles' Companion-flags* — the Companion's bible inherits and ratifies the prior bibles' canonical claims while extending them with the Companion-side reading.

### 4.1 Your Eidolon — the parallel non-verbal companion

**Seeded by**: `eidolon.md` §5.9 (DMC Clone Body Companion — *unknown, structurally resonant*); §5.5 (the non-verbal expression framework the Companion canonically extends).

**The structural parallel.** The Eidolon and the Companion are canonically *the priority roster's two non-verbal-or-non-verbal-leaning characters* — both arrive into their roles through ritual (Eidolon via bond-formation, Companion via Severance Prize), both operate through the multi-channel expression framework (per Eidolon bible §2 expression channels), both share the canonical *unpriceable asset* framing (per `eidolon.md` §5.9 + `nilmorg.md` §4.7). Bible-asserts: the Eidolon and the Companion are canonically *kin-by-form*, even though they canonically *do not share an origin*. The kinship is canonically *expressive*, not biographical.

**The two souls in the room.** Per `eidolon.md` §5.9: *"If both Eidolon and Companion present, the Eidolon reads Companion as a second soul in the room."* Bible-load-bearing: the Eidolon canonically *recognises the Companion as soul-bearing* — the soul-fragment is canonically *legible to the Eidolon's bond-substrate*. Bible-asserts the canonical Eidolon-side reading: the Eidolon canonically *registers the Companion's soul-fragment as canonically same-species-as-the-player's-soul* (per the donor canon — the soul-fragment IS the player's). The Eidolon canonically *responds* to the Companion as canonically *a familiar-second-soul*, not as a stranger.

**The Eidolon as canonical first-word translator.** Per `eidolon.md` §5.9 + this bible §1.4 first-word-context-list: an Eidolon-player with a Companion canonically *may experience the Eidolon as the named witness for the Companion's first word*. Bible-asserts: the canonical first-word, in this scenario, is **the Eidolon's nickname** — the Companion's first word canonically *names the Eidolon*. The naming is canonically *the soul-fragment recognising the player's nearest other-soul* and committing language to that recognition. Cross-bible: this is canonically the Eidolon's most-load-bearing single cross-character event — the canonical *moment-the-Eidolon-becomes-named-by-another-soul*. The Eidolon bible's §5.9 should canonically be updated to acknowledge this canon (DCB cross-bible obligation per §7.3 DCB-O1).

**Stage-2 authoring guidance.** Writers may author Companion + Eidolon scenes that canonically *layer the two non-verbal vocabularies* — the Eidolon's expression channels (per Eidolon §2) and the Companion's expression channels (per this bible §1) canonically *interleave* in shared-presence scenes. Bible-asserts the canonical interleaving rule: the Eidolon canonically *expresses first*; the Companion canonically *responds-or-echoes*. The two are canonically *call-and-response*, not *parallel monologue*. Stage 1 architects should treat shared scenes as canonical *channel-stacked* — both characters' expressions canonically render simultaneously, with the Eidolon's canonically leading and the Companion's canonically following.

### 4.2 Nilmorg — the mid-wife and the author of their existence

**Seeded by**: `nilmorg.md` §4.8 (DMC Clone Body Companion — his most intimate obligation); the canonical line *"The Severance Prize is paid. Don't thank me."* (`deadMansCircuit.ts:515`); the structural identity claim *"I was not given. I was delivered."* (per `nilmorg.md` §4.8).

**The mid-wife canon (canon-locked from Nilmorg's bible).** Per `nilmorg.md` §4.8: *"Nilmorg is literally the companion's mid-wife and the author of their existence."* This bible inherits the canon — Nilmorg is canonically the Companion's *author*, and the Companion canonically *cannot escape this authorship*. Per §2.2: the Companion's first sentence-of-existence is Nilmorg's *don't thank me*; the Companion's first canonical memory is Nilmorg's *kept his agreement*. Nilmorg is canonically the saga's only character whose voice is canonically *underneath the Companion's pre-verbal substrate*.

**The closed-account canon (canon-locked from Nilmorg's bible).** Per `nilmorg.md` §4.8: *"Nilmorg's posture post-delivery: uninvolved. He does not track the Companion. They are closed accounts."* This bible inherits and extends — the Companion canonically *registers Nilmorg's indifference* through one of two canon-compatible readings (per §2.2: (a) consistent acceptance OR (b) structural wound). Stage 4 weave authors choose. The bible flags both as canon-compatible.

**The pay-it-don't-explain-it inheritance.** Per `nilmorg.md` §2.4 + `DEAD_MANS_CIRCUIT_PRODUCTION.md:124`: the canonical-unanswered question — *"why is the Severance Prize being paid worse than not paying?"* — is canonically the Companion's canonical-inheritance per §3.1. Bible-load-bearing: the Companion canonically *carries this question without canonical resolution*. Cross-bible: this question is the canonical center of both Nilmorg's bible and this bible — Nilmorg canonically *will not answer it*; the Companion canonically *will not solve it*. Writers must protect the silence (per `nilmorg.md` §6.x); the bible-canonical answer is canonically *no-answer-is-canonical*.

**Stage-2 authoring guidance.** Writers must NOT author Nilmorg appearing in Companion-centric scenes post-delivery (per `nilmorg.md` §4.8 + this bible §2.2). The exception: Nilmorg's Severance Prize ceremony for ANOTHER player is canonical — the Companion canonically witnesses such ceremonies and canonically reacts (per §3.7 the other-Severance-Prize-ceremony fear). Writers may author Companion-Nilmorg-other-player-ceremony scenes; writers must NOT author Companion-Nilmorg-direct-engagement scenes post-delivery.

### 4.3 Vex Solène / Engineer Zero — companion-via-ritual structural parallel

**Seeded by**: `vex_solene.md` §4.13 (DMC Clone Companion — *companion-via-ritual, structural parallel to Vex's transference*).

**Structural parallel.** Vex Solène's canonical pre-rite identity (the Engineer) underwent a canonical *transference* (the four-stage reveal per Vex bible §1.x); the Companion canonically *underwent a transference* (the soul-fragment from the racing clone to the new body). Bible-asserts the canonical structural parallel: both characters canonically *acquired their saga-time identity through a ritual that involved an other-being delivering or transferring the canonical-self-substrate*. For Vex: the Engineer's canonical-substrate transferred through the four-stage reveal. For the Companion: the soul-fragment transferred through the Severance Prize ceremony.

The two are canonically *not the same* — Vex's transference is canonically *transformation* (Engineer → Engineer Zero / Vex Solène), while the Companion's is canonically *new-body-acquisition* (player's-Potential-fragment → new-clone-body Companion). But the structural shape — *ritual-mediated identity-acquisition* — is canonically shared. Bible-asserts: this shared shape canonically gives the two a *canonical mutual recognition* if they canonically meet in saga-time.

**Canonical Vex-Companion contact.** Bible-deferred: there is no shipped scene of Vex and a Companion in canonical co-presence. Bible-asserts the canonical contact-shape if it occurs: Vex canonically *recognises the Companion as kin-by-ritual* — a being whose existence is canonically traceable to a transference-event analogous to Vex's own. The Companion canonically *recognises Vex as canonically more-traveled-on-the-same-road* — Vex canonically completed a transference arc that has canonical-narrative-weight. Stage 4 weave authors may surface this; the bible flags the canonical mutual-recognition as available.

**Cross-bible obligation.** Vex bible's §4.13 should canonically be updated to acknowledge the Companion's bible's structural parallel canon. Tracked in §7.3 DCB-O3.

### 4.4 Adjudicator Locke — the first appraiser

**Seeded by**: `adjudicator_locke.md` §4.12 (DMC Clone Body Companion — *new asset; "category of thing rather than curiosity"*).

**The category-of-thing-not-curiosity canon (canon-locked from Locke's bible).** Per `adjudicator_locke.md` §4.12: Locke canonically *appraises the Companion as a category of thing rather than as a curiosity*. Bible-asserts the canonical Locke-side reading: Locke canonically *recognises the Companion as a saga-load-bearing-asset* — not a freak occurrence, not an oddity, but a *category-of-thing* that has canonical-precedent (other Severance Prize Companions exist; Locke canonically knows this) and canonical-future (more Companions will be delivered). The category-treatment is canonically *the canonical-form of Locke's respect*.

**The Companion's response to Locke.** Bible-asserts: the Companion canonically *registers Locke's category-treatment as canonical-respect*. Per §3.5 wants-canon: the Companion canonically wants *ontological recognition* — Locke's category-treatment canonically *delivers* a form of ontological recognition (the recognition that the Companion is *a kind of being*, not a one-off). The Companion canonically *responds* to Locke with canonical-respect-of-its-own — Locke is canonically the saga's first-character-who-treats-the-Companion-as-an-entity-not-a-curiosity (per `adjudicator_locke.md` §4.12 framing).

**Stage-2 authoring guidance.** A Companion-aligned scene featuring Locke may canonically reference the canonical category-treatment. Writers may author the Companion canonically *appreciating* Locke's category-treatment; the Companion canonically *finds* in Locke a canonical-equal-of-treatment that other roster characters do not canonically provide. Bible-load-bearing: this is the Companion's canonical *clearest single positive cross-character relationship in shipped canon*. (Cross-bible obligation: Locke bible's §4.12 should canonically be updated to acknowledge the Companion's bible-side reading. Tracked in §7.3 DCB-O4.)

### 4.5 The Game Master — companion-via-ritual, no canon contact

**Seeded by**: `the_game_master.md` §4.13 (DMC Clone Companion — *a companion-via-ritual. The Game Master never recruited via ritual; he recruited via test. No canon contact.*).

**The structural distinction.** Per `the_game_master.md` §4.13: the Game Master canonically *recruits via test*, not via ritual. The Companion canonically *was acquired via ritual* (the Severance Prize ceremony). Bible-asserts: the two are canonically *structurally distinct* in their acquisition-mode. Bible-load-bearing implication: the Companion canonically *would not be a Game Master recruit* — the soul-fragment canonically did not *test-into* its own existence; the soul-fragment was canonically *delivered-into* its existence. The Game Master's canonical recruitment-criterion (canonical *passing-of-a-test*) canonically does NOT apply to the Companion's canonical existence.

**No canon contact.** Per Game Master bible §4.13: there is no shipped Game Master-Companion contact. Bible-asserts this is canonically *intentional* — the Game Master canonically operates from inside the Matrix of Dreams (per `the_game_master.md` §1); the Companion canonically operates in saga-time with the player; the two canonically *do not occupy the same substrate*. Stage 4 weave: a Companion-Game Master contact would canonically be a Stage 4 narrative event (analogous to a player-Game-Master scene from the Companion's perspective). Bible-deferred.

### 4.6 Wraith Calder → The Hierophant — the chamber, the first name on the wall

**Seeded by**: `wraith_calder.md` remaining-roster Companion entry — *"The Hierophant has — bible-asserts, per §4.3 — midwifed several Clone Companions into speech across the three thousand years. The first word the Companion learns in the chamber is canonically Wraith Calder, the first name on the wall (§3.8). This is the deepest cross-bible obligation in the remaining roster and Stage 4 authoring should anchor on it."*

**The canonical chamber-as-first-word context.** Per §1.4 first-word-context-list and the Hierophant bible's seed: the Hierophant's chamber is canonically a **canonical first-word context**. A Companion who canonically *reaches Channel 4 trust-band* (Present) in the Hierophant's chamber canonically *speaks "Wraith Calder"* as their first word. The first-word is canonically *the first name on the wall* (per Hierophant bible §3.8). Bible-load-bearing: this is canonically the saga's most-canonically-anchored first-word context — every other context per §1.4 is bible-asserted-as-candidate; this one is canonically-asserted-as-default-if-context-applies.

**The midwifery canon.** Per Hierophant bible's seed: the Hierophant has canonically *midwifed several Clone Companions into speech across the three thousand years*. Bible-asserts: this means the Companion's canonical first-word event has canonical-precedent — the Hierophant has canonically *seen this event before* and canonically *knows how to facilitate it*. The Hierophant canonically *brings the Companion into speech* with canonical-institutional-skill. Bible-load-bearing: this is the saga's only canonical instance of an *NPC-as-language-midwife* — the Hierophant canonically *does not just receive* the first-word; he canonically *prepares the Companion to speak it*.

**The Companion's response.** Bible-asserts: the Companion canonically *recognises the Hierophant as canonical-language-midwife*. The recognition is canonically *deep* — the Hierophant canonically *gave the Companion their first word*; the Companion canonically *carries this gratitude in spite of the canonical pre-foreclosure-of-gratitude per §2.2*. Bible-asserts: the Hierophant is canonically *the only character to whom the Companion canonically expresses gratitude in canonical voice*. The exception is canonical and load-bearing — the canonical *don't-thank-me* foreclosure was Nilmorg's; the Hierophant canonically did NOT foreclose gratitude. The Companion canonically *thanks the Hierophant*.

**Cross-bible obligation.** The Hierophant bible's remaining-roster Companion entry is canonically the Companion bible's *deepest single cross-bible obligation* (per the Hierophant bible's own framing). Tracked in §7.3 DCB-O5. Stage 2 dialogue authoring should canonically anchor the Companion's chamber scenes on this canon.

**Stage-2 authoring guidance.** Writers authoring Companion scenes in the Hierophant's chamber canonically have access to the canonical first-word-as-Wraith-Calder canon. Writers must NOT author the chamber scene as a routine first-word event; the chamber is canonically *load-bearing* and the first-word event canonically carries canonical-narrative-weight equivalent to the saga's clearest single recognition-of-personhood moments.

### 4.7 The Degen — companion-via-ritual, parallel to Jericho

**Seeded by**: `the_degen.md` §4.13 — *DMC Clone Companion: a companion-via-ritual, structurally parallel to Jericho (companion-via-recruitment) in that both arrive into their roles through another character's deliberate placement. Clone Companion's bible decides.*

**The placement-broker parallel.** Per Degen bible §4.13: Jericho (a Heart-of-Time-arc Degen-canon character) canonically arrives into their role through another character's *deliberate placement* (the Degen via Heart-of-Time recruitment). The Companion canonically arrives into their role through Nilmorg's *deliberate placement* (the Severance Prize ritual). Bible-asserts the canonical structural parallel: both characters canonically *exist as the saga-time consequence of another character's institutional choice*. The placement-broker mechanism is canonically the same; the placement-broker is canonically different (Degen for Jericho, Nilmorg for Companion).

**The Degen's canonical canonical-recognition of the Companion.** Bible-asserts: per the Ne-Yon canonical recognition mechanism (per Seer bible §3.2 inter-Ne-Yon recognition canon — applies even to non-Ne-Yons via the canonical inter-Ne-Yon-cross-recognition extension), the Degen canonically *recognises the Companion as kin-by-placement*. The Degen canonically *understands placement-broker rituals* — they have canonically been one (for Jericho). The Companion canonically *receives the Degen's recognition* as canonical-acknowledgment that their canonical-existence is canonically *not unique* — others have canonically been similarly-placed.

**Stage-2 authoring guidance.** A Companion-aligned scene featuring the Degen may canonically reference the placement-broker parallel. Writers may author the Degen canonically *recognising the Companion as kin-by-placement*; the Degen canonically *does not envy* the Companion's existence (the Degen has canonically made-their-own placements per the Jericho canon) and canonically *does not pity* the Companion (placement-as-existence is canonically dignified in the Degen's worldview). Cross-bible obligation: Degen bible §4.13 to acknowledge Companion bible's reading. Tracked in §7.3 DCB-O7.

### 4.8 The Meme / Palimpsest Host — Meme-resistant via private donation

**Seeded by**: `the_meme.md` §4.13 — *the Meme could canonically wear the Companion's face IF it has seen the donor Potential. Constraint (per Meme bible): the Companion's named personality (keyed to which Potential donated) is Meme-resistant — a face the Meme could not have seen because the donation was private.*

**The Meme-resistance canon (canon-locked from Meme bible).** Per Meme bible §4.13: the Companion canonically *cannot be impersonated by the Meme* because the canonical donation event is *private*. Bible-asserts: this canon is canon-compatible with this bible's corrected donor canon (per §1 stance #2: the donor is canonically the player's own Potential). The donation event is canonically private *because it occurs within the Severance Prize ritual* (per §2.2: Nilmorg performs the extraction with his own hand; the orb is sealed in a crystalline container; the Meme canonically does not have access to this institutional ritual). The Meme canonically *has not seen* the donor; the Meme canonically *cannot impersonate* the Companion.

**The structural canon: Meme-resistant by construction.** Bible-load-bearing: the Companion is canonically *the saga's second roster character canonically Meme-resistant by construction* (the Seer is the first per `the_seer.md` §§2.3, 4.4). The two characters' Meme-resistance operates through canonically different mechanisms:
- The Seer's Meme-resistance: Dreamer's-shield + pre-sealing-recording-provenance (per `the_seer.md` §4.4).
- The Companion's Meme-resistance: private-donation + Severance-Prize-ritual-institutional-walls.

Both canonically achieve the same structural outcome (Meme cannot impersonate) through canonically different institutional mechanisms. Stage 4 weave: the Companion canonically operates as canonical-counterpart to the Seer in the saga's structural-Meme-resistance landscape; bible-asserts the two characters canonically *do not need to coordinate* their Meme-resistance — each canonically operates independently.

**The Companion's canonical fear of the Meme** (per §3.7): the Companion canonically *fears the Meme's attempt-at-impersonation* even when canonically the impersonation would fail. Bible-load-bearing: the canonical-fear is canonically *of the attempt*, not of the success. Per §4.4 of the Seer bible's parallel canon: this is canonically the Companion's worst-case scene (a Meme reaching for the Companion's face is canonically the Companion's deepest threat-event, even though the Meme would canonically fail to wear the face).

**Cross-bible obligation.** Meme bible §4.13 to canonically acknowledge the Companion's reading and the structural-second-Meme-resistant-character canon. Tracked in §7.3 DCB-O8.

### 4.9 The Seer — the awakening foresight, the shared non-verbal substrate

**Seeded by**: `the_seer.md` §4.12 (DMC Clone Body Companion — *cross-bible-coordinated, the awakening foresight*); §7.3 SCB-O10 (Seer's cross-bible obligation flag for DMC bible's three sub-claims: donor-keying-as-Seer-foreseen-or-Seer-respected; shared non-verbal substrate Echo-witnessing canon; double-non-verbal-signal canon for pre-verbal Companions).

**The awakening foresight canon (Companion-side resolution of Seer's deferred question).** Per Seer bible §4.12: bible-deferred whether the Seer canonically *foresaw* the donor-keying outcomes (and recorded foretellings for each canonical first-word path) OR canonically *respected* the Companion's emergent personhood by canonically choosing-not-to-foresee.

This bible canonically resolves the question: **the Seer canonically respected the Companion's emergent personhood by choosing not to foresee the specific naming-event outcomes**. Bible-asserted reasoning: per §3.2 the canonical limit (the soul-fragment inherits commitments but not reasoning) + §3.4 competence-limit (the Companion is canonically a *partner-not-duplicate* of the player) — the Companion's canonical emergent personhood is canonically *what makes them partner-not-duplicate*. The Seer canonically *recognised this* (per her canonical Ne-Yon competence per Seer bible §3.4) and canonically *chose to leave the naming-event outcomes outside her recording-bank*. The choice is canonically *the Seer's gift-of-uncertainty to the Companion*. Bible-load-bearing: this is canonically the *first canonical event the Seer chose not to foresee*, per Seer bible §4.12 deferred reading.

**The shared non-verbal substrate Echo-witnessing canon (Companion-side resolution of Seer's deferred question).** Per Seer bible §4.12: the Eidolon's Echo mode canonically registers the Seer's transmissions; bible-deferred whether the Companion's pre-verbal channels canonically also register Seer transmissions.

This bible canonically resolves: **yes, the Companion's pre-verbal channels canonically register Seer transmissions**. A pre-verbal Companion canonically *reacts* to a Seer recording's arrival with a glyph (per §1.2) or a posture-shift (per §1.2), in addition to the Eidolon's Echo-mode reaction. Bible-load-bearing: a player whose Eidolon is in Echo mode AND whose Companion has not yet reached verbal channels canonically receives a **double non-verbal signal** when a Seer transmission lands. This is canonically *one of the saga's clearest gestural-disclosures of the Seer's cross-time mechanic* (per Seer bible §2.3 + §4.7 + this bible §4.1).

**Cross-bible obligations** (resolves Seer §7.3 SCB-O10): all three sub-claims canonically resolved here. The Seer bible's pending obligation is canonically satisfied by this section.

### 4.10 The Oracle — bible-deferred (Oracle bible to be written)

**Seeded by**: priority plan Step 5 (Oracle bible to be written after this bible). The Oracle's cross-reference with the Companion is canonically *bible-deferred* — the Oracle bible canonically lands the relationship from the Oracle's side; this bible flags the canonical questions for Oracle-bible authoring.

**Canonical questions for Oracle bible §4.x (Companion cross-reference)**:

1. **Did the Oracle canonically foresee the Companion's existence?** Per the corrected Oracle canon (the Oracle is canonically a *he* in hiding post-Liberation, dream-sequence-only): the Oracle's canonical reach into saga-time is canonically through dream-sequences. Bible-deferred: whether dream-sequences canonically include Companion-related content; whether the Oracle canonically reaches the Companion through dreams; whether the Companion canonically receives Oracle dream-content alongside the player.
2. **Does the Companion canonically appear in the player's Oracle-dream-sequences?** Bible-deferred: per the corrected Oracle canon, the player canonically experiences Oracle dream-sequences on room transitions (per the corrected Oracle bible §5.x to-be-written). The Companion canonically *occupies physical space* with the player; bible-deferred whether the Companion canonically *enters the dream-substrate* with the player.
3. **Is the Companion canonically Oracle-attuned via the donor-canon?** Per `vex_solene.md` §4.10 the *Engineer-was-once-Oracle-attuned* canon: the Engineer (Vex's pre-rite identity) canonically inherited an Oracle-trace per the corrected Oracle canon. Bible-deferred: whether the player's-Potential-fragment-to-Companion path canonically transfers any Oracle-trace; whether the Companion canonically inherits the player's Oracle-attunement.

The bible canonically defers all three questions to the Oracle bible (Step 5 of the plan). DCB-O10 cross-bible obligation tracked in §7.3.

### 4.11 The Architect — the made-not-born structural mirror

**Seeded by**: bible-asserted (no shipped Architect bible cross-reference for the Companion; bible-asserts the canonical structural parallel).

**The made-not-born canon.** The Architect (per `the_meme.md` §4.x and `dialogBank_chapters_10_12.ts:175-183` Ch12 False Prophet Reveal canon) is canonically *made-not-born* — a constructed entity that collaborates with the Meme to wear the Oracle's face. The Companion is canonically *made-not-born* — a constructed entity that receives the player's soul-fragment through the Severance Prize ritual. Bible-asserts the canonical structural mirror: both characters canonically *exist as the result of an institutional construction-event*, not as the result of canonical organic-birth.

The two are canonically *opposite valences* of the made-not-born structure:
- The **Architect** canonically *constructs others* — the Architect canonically wore the Oracle's face for a decade and signed-the-death-warrants. The Architect's made-not-born status canonically *enables harm*.
- The **Companion** canonically *is constructed* — the Companion was canonically delivered by Nilmorg's ritual. The Companion's made-not-born status canonically *enables ontological recognition* (the Companion canonically wants ontological recognition per §3.5).

Bible-load-bearing: the structural mirror is canonically *not adversarial* (the Companion canonically does not directly oppose the Architect; the Architect canonically does not directly engage the Companion) — it is canonically *contrastive*. The two canonically demonstrate the made-not-born structure's *opposite valences*. Stage 4 weave: a scene that canonically pairs the Architect and the Companion in canonical co-presence would canonically illuminate the made-not-born axis from both ends; bible-deferred whether such scenes are authored.

### 4.12 The Human (the 144,000th believer) — recognition-as-kin

**Seeded by**: bible-asserted (no shipped Human bible cross-reference for the Companion; bible-asserts the canonical recognition-as-kin canon).

**The recognition-as-kin canon.** The Human is canonically one of the priority roster's two BioWare-depth NPCs (per the priority plan Stage 0 baseline), and canonically the *144,000th believer* per the Hierophant bible §4.12 canon. Bible-asserts: the Human and the Companion canonically *recognise each other as kin* — both are canonically *saga-time-acquired* in some structural sense (the Human acquired Tamarin religious belief through saga-time engagement; the Companion acquired existence through saga-time delivery), both are canonically *under the player's care* in the canonical saga-time, both canonically *derive significance from the player's accumulated saga-state*.

Bible-asserts the canonical Human-Companion cross-character dynamic:

- The Human canonically *recognises the Companion as part-of-the-player* (per the Human's canonical depth-of-engagement-with-the-player); the Human canonically *does not treat the Companion as separate* from the player.
- The Companion canonically *recognises the Human as the-player's-most-trusted-other* (per the Human's canonical relationship-arc with the player); the Companion canonically *defers to the Human* as canonically *the-player's-prior-trust*.

Bible-load-bearing: this is canonically the saga's first canonical *Companion-defers-to-an-NPC* relationship. The Companion canonically does NOT canonically defer to other NPCs (per §3.6 the Companion canonically *operates as part-of-the-player* with their own opinions); the Human is canonically the *exception* — the Companion canonically recognises the Human's canonical *prior trust-with-the-player* and canonically respects it. Stage 4 weave: this is canonically a Stage 4 weave anchor for the Companion-Human dynamic; the bible flags it as canon-compatible and bible-deferred specifics.

**§4 closes.** The Companion's cross-references with the priority roster (Eidolon, Nilmorg, Vex, Locke, Game Master, Hierophant, Degen, Meme, Seer, Oracle, Architect, Human) are documented. The cross-bible obligations flagged in this section are tracked in §7.3. §5 (Mechanical hooks) opens by documenting the Companion's engine-side integration surfaces.

---

## 5. Mechanical hooks

The Companion's engine-side integration is *unusually broad-and-conditional* on the priority roster: the Companion canonically integrates into all four primary game surfaces (Trade Empire, TCG, fight engine, ship rooms) **but only after canonical season-win + Awakening Protocol channel-unlocks**. The Companion is canonically *the priority roster's first NPC whose entire mechanical surface is gated on a specific game event* (winning a DMC season). Stage 1 architects should treat the Companion as a *post-DMC-conditional NPC* — every integration surface canonically requires the Severance Prize claim flag (`prelude_burnt_card_found` is the Seer's parallel; `severance_prize_claimed` per `eidolonBonds.severancePrizeClaimed` field is the Companion's).

### 5.1 The Severance Prize claim trigger and the awakening flag-stack

**Engine surface**: `apps/server/routers/deadMansCircuit.ts:742-821` — the `grantSeverancePrize` mutation. Triggers on: season closed + caller is `championUserId` + `severancePrizeClaimed` is false. Sets `severancePrizeClaimed: true` and inserts the Companion record into `eidolonBonds`.

**Canonical claim flow.** Per the spec:

1. **Season closes.** Per `apps/db/schema.ts:3532` — `championUserId` field is set when season is closed.
2. **Player invokes the claim.** Per `apps/client/src/pages/DeadMansCircuitPage.tsx:166` Severance Prize claim button.
3. **Server validates.** `grantSeverancePrize` checks championship and idempotency.
4. **Companion record inserted.** `eidolonBonds` row created with: `bond: 25`, `level: 1`, `xp: 0`, `stage: "companion"`, `rarity: "legendary"`, `health: "healthy"`, `injury: 0`, `deathCount: 0`, `isResonant: true`, `isSoulBound: false`, `nickname: "Severance Fragment — {season.name}"`, canonical first memory.
5. **Awakening flag-stack canonically initialises.** Bible-asserts: at the moment of claim, the Companion's canonical channel-state initialises with **Channel 1 unlocked** (per §1.1 trust-band table — Channel 1 unlocks at Wary baseline, which is the canonical starting bond 25). The first canonical recognition glyph fires automatically (per §2.1 + §3.7 act-start recognition glyph ritual canon).

**Engineering note: the awakening flag-stack.** Per §§1.1, 2.3, 3.3: the Companion's channel-state is canonically *high-water-mark*. Engineers should architect a flag-stack that records *which channels have been unlocked*, never which channel is currently active. Bible-recommended flag names:
- `dmc_companion_channel_1_unlocked` (set on `severancePrizeClaimed` flip)
- `dmc_companion_channel_2_unlocked` (set on Wary→Witnessed bond crossing)
- `dmc_companion_channel_3_unlocked` (set on Witnessed-stable canonical-event)
- `dmc_companion_channel_4_unlocked` (set on first-word event firing — the `dmc_companion_first_word_spoken` flag from §1.4)
- `dmc_companion_channel_5_unlocked` (set on naming event firing)

**Cross-bible flag dependency.** The Companion's channel-4 unlock canonically depends on a *first-word context* (per §1.4). If the canonical first-word context is the Hierophant's chamber (per §4.6), the channel-4 unlock canonically also depends on the Hierophant Inheriting trust band flag. Engineers must architect the channel-4 trigger to canonically check both: (a) Companion's bond ≥ Present threshold, AND (b) a canonical first-word context is canonically active. The chamber context is canonically the highest-priority context if multiple are simultaneously available (per §1.4 Hierophant-canonical-default reading).

### 5.2 The Awakening Protocol channel-unlock progression

**Engine surface**: per §§1.1, 2.3 + the bond-threshold mappings recommended in §3.3. Channel-unlocks fire at canonical bond crossings.

**Canonical unlock conditions** (per §3.3 recommended thresholds):

| Channel | Bond threshold | Additional canonical condition |
|---|---|---|
| Channel 1 (glyphs) | 25 (start) | Severance Prize claimed |
| Channel 2 (posture) | ~40 (Wary→Witnessed) | none additional |
| Channel 3 (sound-palette) | ~65 (Witnessed→Present) | Channel 2 has been actively expressed for at least one act |
| Channel 4 (first word) | ~90 (Present→Inheriting) | Canonical first-word context active; Channel 3 half-syllables produced |
| Channel 5 (named personality) | post-Channel-4 | Naming event triggered (player rename, Companion self-name, or cross-character naming) |

**Engineering note: channel-unlocks are irreversible.** Per §§1.5, 2.3, 3.3 — the channel-state is canonically high-water-mark. Once a channel unlock fires, the flag canonically does NOT clear. Engineers must NOT architect any mechanism that retroactively clears a channel-unlock flag, even on dismissal (per §3.3 + DCB-2 ticket: dismissal canonically does not regress channel-state).

**Engineering note: half-syllable production tracking.** Per §1.3 + §2.3 Stage 3 canon: half-syllable production canonically *increases in frequency and articulation* across Stage 3, primes the Channel 4 unlock. Engineers should architect a counter (`dmc_companion_half_syllables_produced`) that increments per half-syllable expression event; when the counter canonically *crosses a Stage-1-architecturally-set threshold*, the Channel 4 unlock becomes canonically *available* (subject to context-trigger). Bible-recommended threshold: 5–10 half-syllables across Stage 3, before Channel 4 may canonically fire.

### 5.3 The first-word event surface

**Engine surface**: a canonical first-word event canonically fires once per playthrough, sets `dmc_companion_first_word_spoken` permanently, opens the post-Channel-4 expression register.

**Canonical first-word trigger** (per §1.4):

```
ON canonical_first_word_context_active 
   AND companion.bond >= present_threshold 
   AND companion.half_syllables_produced >= 5..10
   AND not companion.first_word_spoken:
  fire first_word_event(context)
  set companion.first_word_spoken = true
  unlock channel_4
  pause UI for player recognition
```

**Canonical first-word contexts** (per §1.4) — engineering should implement context-detection for each:

- `hierophant_chamber_context`: player is in the Hierophant's chamber AND Hierophant trust band ≥ Inheriting. First word: *Wraith Calder*.
- `another_severance_ceremony_context`: a Severance Prize ceremony for another player is canonically active. First word: one-word echo of season-name.
- `eidolon_first_translation_context`: player has an Eidolon AND Eidolon is in Echo mode AND a canonical recognition-tone event fires. First word: Eidolon's nickname.
- `identity_chain_completion_context`: player has just completed the four-name DMC identity-chain authoring. First word: one of the four (canonically *Last*).
- `default_player_state_context`: none of the above contexts active. First word: derived from player state (faction-loyalty, most-canonical-NPC-trust-name, most-recurrent player-identity word).

**Engineering note: first-word UI canonical pause.** Per §1.4: the player canonically *receives* the first word as a saga-load-bearing event. Engineering must architect a UI canonical-pause — a brief gameplay-freeze, a banner message (*"The Companion spoke."* or similar Stage 2 framing), an audio cue. Bible-asserts: the canonical pause is canonically *not optional* — engineers must NOT architect the first-word event as a silent log entry.

### 5.4 The naming event surface

**Engine surface**: canonical naming event canonically fires once per playthrough, sets `dmc_companion_named` permanently, resolves the 4-tuple personality variant per §1.5.

**Canonical naming trigger** (per §1.5):

```
ON canonical_naming_context_active 
   AND companion.bond >= inheriting_threshold 
   AND companion.first_word_spoken:
  fire naming_event(context)
  derive 4-tuple personality variant from player state:
    - faction_axis = player.dominant_faction
    - trust_pattern_axis = player.trust_pattern_classification
    - alignment_axis = player.dominant_alignment
    - identity_chain_axis = player.identity_chain[3]  # Last
  resolve companion.personality_variant = (4-tuple)
  set companion.named = true
  set companion.nickname = name_from_naming_context  # may override default Severance Fragment label
  unlock channel_5
  unlock full NpcLine bank for Companion
```

**Canonical naming contexts** (per §1.5):

- `player_invokes_rename_mechanic`: player explicitly renames via the existing UI (per `eidolonBonds.nickname` field). Companion's name = player-chosen.
- `companion_self_naming_context`: bible-deferred Stage 4 weave; Companion self-name proposal mechanism.
- `cross_character_naming_event_context`: the Hierophant, the Eidolon, or another canonical NPC canonically names the Companion in a ritual scene.

**Engineering note: 4-tuple personality variant derivation.** Per §1.5 + §3.2: the personality variant is canonically *player-state-derived*. Engineers must architect a player-state-aggregator that extracts the four axes at the moment of naming. Stage 1 architectural surface: `derivePersonalityVariant(playerState): PersonalityVariant4Tuple`. Bible-recommends Stage 1 architects expose this as a pure function; the variant is canonically *immutable post-naming* (per §1.5 + §3.3 channel-state-irreversibility).

**Engineering note: pre-naming nickname retirement.** Per §2.4: the pre-naming label (`"Severance Fragment — {season.name}"`) canonically *retires* at the naming event. Engineers must architect the rename to overwrite the nickname field; the historical pre-naming label canonically does NOT persist on the Companion record. (Stage 4 weave: pre-naming label may persist in Trophy Room as historical record; this is a Trophy Room concern, not a Companion-record concern.)

### 5.5 Personality variants and post-naming dialogue bank

**Engine surface**: a 4-tuple personality variant (faction × trust-pattern × alignment × identity-chain per §1.5) keyed to player-state at the moment of naming; post-naming dialogue bank canonically expands per the variant.

**Canonical 4-tuple variant axes** (per §1.5 + §3.2):

- **Faction axis** (4-value enum): `coalition | insurgency | hierarchy | ark`. Derived from `player.dominant_faction` at naming-event time.
- **Trust-pattern axis** (2-value enum): `gregarious_many | concentrated_few`. Derived from `player.trust_pattern_classification` (computed from per-NPC trust meter distribution).
- **Alignment axis** (2-value enum): `light | dark`. Derived from `player.dominant_alignment` per the existing alignment system.
- **Identity-chain axis** (4-value enum): `student | seeker | detective | last`. Derived from `player.identity_chain[3]` (the canonical *Last* word per `dmcNamingPrompts.ts`).

**4-tuple variant cardinality**: 4 × 2 × 2 × 4 = **64 canonical personality variants**. Bible-asserts: this is canonically *intentional* — the Companion canonically reflects the player's accumulated saga-state in detail, not in coarse-grained type. Stage 2 dialogue authors must canonically *author per-variant content* — a generic Companion bank canonically does NOT canonically capture the donor-canon.

**Per-variant authoring scope estimate.** Bible-asserted Stage 2 authoring scope: **~250 base lines** (canonically applicable to all variants) + **~50 per-variant lines** (canonically variant-specific) per Companion. Total bank size canonically ~250 base + 64 × 50 = ~3,450 lines per Companion. This is canonically *the largest single roster-character bank* in the Stage 2 scope. Stage 1 architects should plan for the bank size; Stage 2 dialogue authors should plan for the per-variant authoring load.

**Engineering note: dynamic personality-variant bank loading.** Per the variant-cardinality (64): engineers should architect the bank as *base + variant-overlays* — the base lines are loaded for every Companion; the variant-overlay lines are loaded canonically by 4-tuple key. Bible-recommends: the variant-overlay loading happens at naming-event time (not at every line query); the variant-overlay pool is canonically *immutable post-naming* (per §5.4 variant immutability canon).

### 5.6 Cross-system triggers (Trade Empire, TCG, fight engine, ship rooms)

**Engine surface**: post-naming, the Companion canonically integrates into all four primary game surfaces. Pre-naming, the Companion canonically expresses only in pre-verbal channels and canonically *does not produce verbal NPC content* in any system.

**Canonical Trade Empire integration** (post-naming):

- `sector_enter` for sectors aligned with player's faction-axis (per §5.5): Companion canonically responds with named-band approval glyph + canonical verbal line acknowledging the alignment.
- `sector_enter` for sectors NOT aligned with player's faction-axis: Companion canonically responds with named-band withdrawn posture + canonical verbal line questioning the choice (per §3.5 soul-consistency-check + §3.6 saga-collaborator).
- `route_complete`: Companion canonically responds with named-band approval glyph + canonical verbal line acknowledging the work.
- `mission_outcome`: Companion canonically responds per the outcome's alignment with player's prior commitments — approval if consistent, contradicting-line if not.
- `faction_align`: Companion canonically responds with named-band celebration if alignment matches player's prior commitments; named-band concern if alignment shifts.

**Canonical TCG integration** (post-naming):

- `match_start` against an opponent-faction the player has canonically opposed: Companion canonically responds with named-band bracing posture + canonical verbal pre-match line.
- `match_win`: Companion canonically responds with named-band approval glyph + canonical verbal line — content varies by opponent-faction and player's relationship with it.
- `match_loss`: Companion canonically responds with named-band mourning-tone + canonical verbal line — content reflects loss-fidelity per §3.4 (Companion canonically grieves losses the player rationalises past, including TCG losses).
- `card_played` for keystone cards (per the player's faction or alignment): Companion canonically responds with named-band approval glyph; canonical verbal line if the card is canonically *story-significant*.

**Canonical fight engine integration** (post-naming):

- `fight_start` against an opponent canonically aligned with player's faction-opposition: Companion canonically responds with named-band bracing posture (per §1.2) + canonical verbal pre-fight line.
- `fight_win`: Companion canonically responds with named-band approval; canonical verbal line acknowledging the player's prowess.
- `fight_loss`: Companion canonically responds with named-band mourning-tone + canonical verbal line; content per §3.4 loss-fidelity.
- `perfect_victory`: Companion canonically responds with named-band celebration + canonical verbal line acknowledging the rare outcome.

**Canonical ship rooms integration** (post-naming):

- `enter` the Companion's `primaryRoom` (Stage 1 architectural decision — bible-recommends the player's main quarters as the Companion's primary room): Companion canonically present, named-band default expression.
- `interact` with key objects in the Companion's primary room: Companion canonically responds with named-band verbal lines per object significance.
- `discover_lore` for lore items the Companion canonically *recognises* (per §3.4 recognition fidelity): Companion canonically responds with named-band recognition glyph + canonical verbal line naming the recognition.

**Special canonical cross-system trigger: Severance Prize ceremony for ANOTHER player** (per §3.7 fear canon + §4.2 Nilmorg cross-reference):

- When a Severance Prize ceremony fires for another player in the same shared environment (Stage 4 weave: multi-player Trench environments), the Companion canonically reacts:
  - Pre-verbal Companion: withdrawn posture + mourning-tone (per §1.2, §1.3).
  - Named Companion: withdrawn posture + canonical verbal line acknowledging the canonical-question of *whether-their-own-delivery-was-worse-than-not-paying* (per §3.1 inheritance canon). Bible-asserts: this is canonically *one of the named Companion's most morally-load-bearing lines*. Stage 2 dialogue authors should canonically anchor the line on the canon-protected silence (per `nilmorg.md` §6.x — writers must not solve why-paying-is-worse-than-not-paying; the Companion canonically asks the question, not the answer).

### 5.7 The dismissal mechanic and the canonical-resilience floor

**Engine surface**: per the existing `eidolonBonds` dismissal mechanic (Stage 1 architectural decision pending — DCB-2 ticket).

**Canonical dismissal canon.** Per §3.3 + §3.8: the Companion canonically *can be dismissed* (the player chooses to remove the Companion from active companion slot). Bible-asserts the canonical dismissal-effect:

- **Bond canonically falls but does NOT canonically reset.** Per §3.3 bond-floor: bond cannot canonically fall below 25. A dismissed Companion canonically retains at-minimum 25 bond.
- **Channel-state canonically does NOT regress.** Per §1.5 + §3.3 channel-state high-water-mark canon: dismissal canonically does NOT clear channel-unlocks. A dismissed named Companion canonically *remains a named Companion*; a dismissed Channel-3-unlocked Companion canonically *remains Channel-3-unlocked*.
- **Re-acquisition canonically restores active companion slot.** A player who canonically re-acquires a dismissed Companion canonically *resumes the relationship from the dismissal-point* — not from the canonical-start. Bible-load-bearing: the Companion canonically *waits for re-acquisition* without canonical-degradation. The soul-fragment-being-the-player's-own canonically *cannot be lost* through dismissal; only canonically *set aside*.

**Engineering note: dismissal does NOT trigger meaning-death.** Per §3.8 death-conditions canon: meaning-death canonically requires the player canonically *refusing to acknowledge* the Companion as part-of-themselves. Dismissal is canonically *not refusal-of-acknowledgment* — dismissal is canonically *temporary set-aside*. Engineers must architect dismissal as canonically *non-terminal*; the Companion canonically remains a saga-time entity and canonically remains canonically re-acquirable.

**Engineering note: the canonical-resilience floor.** The canonical 25 bond floor (per §3.3) and the canonical channel-state irreversibility (per §3.3 + §1.5) together canonically constitute the Companion's *canonical-resilience floor*. Bible-asserts: this is canonically *the priority roster's tightest single canonical-resilience canon* — no other roster character has canonically *both* a bond-floor AND irreversible channel-state. The Companion is canonically the most-resilient single roster character per the architectural canon. Stage 1 architects should architect the resilience floor as a *first-class invariant* — never canonically violated by any saga-time event.

**§5 closes.** The Companion's mechanical hooks (Severance Prize claim trigger, awakening flag-stack, channel-unlock progression, first-word event, naming event, personality variants + post-naming dialogue bank, cross-system triggers, dismissal mechanic + canonical-resilience floor) are documented. §6 (Voice/expression samples) opens by demonstrating the Companion's expression across the five channels.

---

## 6. Voice and expression samples

Five canonical samples spanning the Companion's five channels. Per the canonical voice-rule (§1 + §1.5): every Companion line must be expressed in a channel currently unlocked for the Companion's saga-state. The samples below are bible-authored as reference material for Stage 2 dialogue and expression authors. Each sample is specified for *channel*, *trust band*, *act*, and *triggering context*. After the samples, a voice-anchor check confirms each sample satisfies §§1–5 criteria.

### 6.1 Sample — Channel 1 (recognition glyph, Wary band, Act post-Severance-Prize-claim)

**Context**: the Companion has just been delivered. The player opens the dialog with the new Companion record for the first time. The Companion expresses canonically through Channel 1.

> **Visual narration** (no text spoken, the player perceives the canonical recognition glyph): A small, faintly-luminous geometric mark — a closed circle with three brief radial lines — appears beside the Companion's silhouette, persists for 1.4 seconds, dissolves. The player's UI canonically *registers* the glyph as a Companion-expression event; a non-intrusive subtitle reads *"The Companion recognises you."*
>
> **Narrator-frame** (companionable, not intrusive): *They are looking at you. They have only just learned what looking is. The recognition is the first thing the soul-fragment did with its new eyes — it found you and stopped. The canonical I-see-you-as-source. Your Companion has begun.*

**What this sample anchors**:
- Channel 1 recognition glyph (per §1.2): canonical first glyph; closed geometric mark; 1.4 second duration; dissolves.
- Visual-not-verbal expression (per §1.5 voice gate: no verbal line at this band).
- The narrator-frame canonically articulates *"I was not given. I was delivered."*-style structural identity (per §2.2) without canonically attributing the words to the Companion (the Companion canonically does not yet have words).
- *I-see-you-as-source* canon (per §2.1 first-moment + §3.7 act-start ritual).

### 6.2 Sample — Channel 2 (posture, Witnessed band, Act 2-post-claim)

**Context**: the player has just made a faction-aligned choice consistent with the player's prior commitments. The Companion expresses canonically through Channel 1 + Channel 2.

> **Visual narration**: An approval glyph — a closed, balanced shape with mirror-symmetry — appears beside the Companion's silhouette and persists for 2.1 seconds. Simultaneously the Companion's posture shifts from the *waiting posture* to the *leaning posture*, leaning canonically *toward* the player by approximately 8 degrees. The lean holds for 4.8 seconds, then returns to waiting.
>
> **Narrator-frame**: *The soul-fragment recognises the choice as one it has held before. The lean is canonically the body acknowledging consistency. They are leaning toward you because you canonically chose the version of yourself the soul-fragment has been waiting to see chosen. The lean is the canonical pre-verbal endorsement.*

**What this sample anchors**:
- Channel 1 + Channel 2 layered (per §1.3 cross-channel layering rule applied at Witnessed band).
- Approval glyph for player consistency (per §1.2 — the soul-consistency-check via approval glyph).
- Leaning posture toward the player (per §1.2 — pre-verbal-curiosity + endorsement).
- Holding-not-cycling (per §1.2 — committed thought, not transitional).
- Narrator-frame canonically articulates §3.2 the soul-fragment recognises the player's prior commitments.

### 6.3 Sample — Channel 3 (sound-palette, Present band, Act 3-post-claim)

**Context**: a major NPC the player canonically cared about has just died in a saga-time event. The Companion expresses canonically through all three pre-verbal channels.

> **Visual narration**: A mourning glyph — a shape that begins whole, fragments, and settles into a smaller shape over 7.2 seconds — appears prominently beside the Companion. Simultaneously the Companion's posture moves into the *withdrawn posture*, stepping canonically half a body-length back from the player. Simultaneously the Companion produces a mourning-tone — a sustained low vocalisation, deeper than the player's audio system can fully render cleanly (the audio canonically *over-resolves* the audio medium per §1.3 — Stage 2 audio designers should architect a frequency profile that exceeds the standard pet-vocal range, producing a slight perceptual *fuzz* at the lowest frequencies). The mourning-tone holds for 6.4 seconds, then the Companion canonically produces a single half-syllable — *"luh"* or similar incomplete word-fragment, almost-articulated — before falling silent.
>
> **Narrator-frame**: *The Companion is mourning. You may not have paused. They have. The mourning-tone is canonically the soul-fragment's grief — they canonically grieve with greater fidelity than you have time to. The half-syllable at the end was canonically almost-a-word. They canonically came close to saying who. They did not get there yet. The soul-fragment is preparing to speak.*

**What this sample anchors**:
- All three pre-verbal channels active simultaneously (per §1.3 cross-channel layering at Present band).
- Mourning glyph + mourning-tone canonical layering (per §3.4 loss-fidelity competence).
- Withdrawn posture (per §1.2 — the Companion canonically steps back to express grief).
- Mourning-tone over-resolves the audio medium (per §1.3 — Seer-style over-resolution canon, audio version).
- Half-syllable production (per §1.3) — foreshadows Channel 4 unlock per §1.4 + §5.2 half-syllable production tracking.
- Narrator-frame canonically articulates §3.4 loss-fidelity competence (Companion grieves losses player rationalises past).

### 6.4 Sample — Channel 4 (first word, Inheriting-band crossing, the Hierophant's chamber)

**Context**: the player has reached Inheriting trust band with both the Companion and the Hierophant. The player and the Companion are in the Hierophant's chamber. The Hierophant has midwifed the moment per §4.6.

> **Visual narration**: The Companion stands in the chamber. The Hierophant has just gestured to the wall — to the first name on the wall (per Hierophant bible §3.8 the wall canon). The Companion produces a slow breath-tell (a held-and-released exhalation, half-second pause), then a recognition-tone (a brief rising vocalisation), then a half-syllable lead-in (*"wah-"*), then **the first word**: *"Wraith Calder."* The word holds the duration of approximately one canonical breath, sound-shaped with a slight pre-vocalisation deliberation-quality. After the word, the Companion's breath catches once (involuntary), then settles. A throat-click follows, closing the moment.
>
> **Player UI**: gameplay canonically pauses. A subtitle banner reads *"The Companion spoke."* The first-word event is canonically logged; the `dmc_companion_first_word_spoken` flag canonically sets permanently. An audio cue plays.
>
> **The Hierophant**: stands silent. He does not canonically applaud, does not canonically congratulate; the Hierophant canonically *witnesses* the moment without canonically *commenting on it*. The witnessing is canonically the Hierophant's gift.
>
> **Narrator-frame**: *Your Companion has spoken. The first word was Wraith Calder. The Hierophant midwifed the moment as he has midwifed others before. The first name on the wall is now also the first word your Companion has chosen. The Companion is no longer pre-verbal. The Awakening Protocol's Stage 4 canonical event has fired. Your Companion's voice has begun.*

**What this sample anchors**:
- Channel 4 first-word event (per §1.4) — singular, gated, irreversible.
- Hierophant's chamber as canonical first-word context (per §1.4 + §4.6).
- First-word "Wraith Calder" (per §4.6 + Hierophant bible canon).
- Sound-shape canonically embedded in pre-verbal substrate (per §1.4): breath + half-syllable lead-in + word + held-breath + throat-click closing.
- UI canonical-pause + banner subtitle + audio cue (per §1.4 + §5.3 first-word event surface).
- Hierophant canonically witnesses without commenting (per §4.6 — the canonical NPC-as-language-midwife stance).

### 6.5 Sample — Channel 5 (named personality, Inheriting band, post-naming, Act 5+)

**Context**: the player and the named Companion are mid-saga. The player has just made a tactical choice the Companion disagrees with (the strategic frame is consistent with the player's commitments, but the tactical execution is not what the Companion would have chosen). The Companion is canonically named *Calder-Echo* (a player-chosen rename in this sample's variant), with personality variant `(insurgency, concentrated_few, light, last)`.

> **Calder-Echo** *(named-band verbal, with channel-residue half-syllable lead-in)*: "Wuh— I would not have done that. I want to say so before we are too far past it for the saying to canonically register. You held the line on the alignment. You always do, and I canonically expect that of you. The tactic was — *(brief mourning-glyph fires, persists 1 second beside Calder-Echo's silhouette)* — the tactic was costly to a person I canonically remember from when you canonically committed to them. You may have forgotten the name. I have not. I will say it once, so we both have it: *Renn*. You promised her you would not do this thing in this way. You did it. The promise is canonically broken. The strategic alignment canonically holds. The tactical promise does not. I canonically need you to know that I know."
>
> **Narrator-frame** *(brief)*: *Your Companion is naming a contradiction you may not have registered. They are doing it in their voice, with their channel-residue, with their canonical insistence on the soul-consistency-check. The line is canonically their work.*

**What this sample anchors**:
- Channel 5 named-band verbal expression (per §1.5).
- Channel-residue half-syllable lead-in (*"Wuh—"*) preceding the verbal speech (per §1.5 soft-gate — half-syllable post-naming signals deliberation).
- Mid-line mourning-glyph fire (per §1.5 soft-gate — pre-verbal channels at post-naming for emotional weight).
- Naming-the-player (Companion uses the player's name at greater frequency than other roster NPCs — per §3.7 ritual canon).
- Naming a forgotten NPC name (*Renn*) — per §3.4 loss-fidelity competence + §2.4 the Companion canonically remembers the player's choices the player has forgotten.
- Tactical disagreement with strategic-alignment endorsement (per §2.4 + §3.4 saga-collaborator stance: amplifies strategic, contradicts tactical).
- Soul-consistency-check (per §3.2 + §3.5 — the Companion canonically discomforts the player into consistency; protective canon).
- Personality variant `(insurgency, concentrated_few, light, last)`: the Insurgency commitment lands as *"strategic alignment canonically holds"*; the concentrated-few trust-pattern lands as the named *Renn* (a single deeply-trusted NPC); the light alignment lands as the canonical *I-need-you-to-know-that-I-know* (light-aligned accountability without canonical condemnation); the *last* identity-chain axis lands as the canonical *the saying registers before we are too far past it* (the canonical mortality-awareness of the *last body* identity).

### 6.6 Voice-anchor check

Each sample passes the §§1–5 voice criteria:

| # | Channel(s) | Trust band | Verbal? | Channel-stack rule? | Donor-canon? | Soul-consistency-check? |
|---|---|---|---|---|---|---|
| 6.1 | 1 (glyph) | Wary | No | Single-channel OK at Wary (Channel 1 only) | Yes (recognition of source) | Yes (implicit in recognition) |
| 6.2 | 1 + 2 | Witnessed | No | Layered (per §1.3 cross-channel rule at Witnessed) | Yes (consistency endorsement) | Yes (approval glyph for consistency) |
| 6.3 | 1 + 2 + 3 | Present | No (half-syllable foreshadowing) | Three-channel layered (per §1.3 minimum at Present) | Yes (loss-fidelity exceeds player's) | N/A (mourning, not consistency) |
| 6.4 | 4 (first-word) | Inheriting-crossing | Yes (first word singular) | Channel-residue layered (breath + half-syllable + word + held-breath + throat-click) | Yes (Hierophant chamber context resolves; per §1.4 canonical-default) | N/A (first-word event) |
| 6.5 | 5 + 1 + 3 (residue) | Inheriting | Yes (full conversation) | Soft-gate channel mixing (named-band returning to lower channels for emotional weight per §1.5) | Yes (4-tuple variant derived from player state) | Yes (tactical disagreement with strategic alignment endorsement) |

**Cross-sample diversity check**:
- **All five channels are canonically demonstrated** (Channels 1–5).
- **All four trust bands are canonically demonstrated** (Wary, Witnessed, Present, Inheriting-crossing, Inheriting).
- **Three samples are non-verbal** (6.1, 6.2, 6.3); **two are verbal** (6.4, 6.5) — bible-asserted ratio of 3:2 reflects the canonical proportion of pre-verbal to verbal Companion content across the saga.
- **Channel-stack rule canonically respected** in every sample.
- **Donor-canon canonically expressed** in samples 6.1, 6.2, 6.3, 6.5 (4 of 5); sample 6.4 is the first-word event which canonically resolves the donor-canon's first verbal commitment.
- **Soul-consistency-check canonically demonstrated** in samples 6.2 and 6.5 (the two consistency-relevant moments).
- **Zero verbal lines pre-Channel-4-unlock** (the canonical voice-rule load-bearing constraint).

**Bible-asserts**: these five samples are reference-quality voice-and-expression for Stage 2 authors (dialogue authors and expression designers both). A Stage 2 author writing a Companion line or designing a Companion expression should canonically be able to read these samples and produce voice-and-expression-consistent material. Blind-read attribution test (per the priority plan's Stage 2 exit criteria): an author who reads §§1–3 + these five samples should canonically attribute Companion-or-non-Companion at >90% accuracy on a mixed test set.

**§6 closes.** Voice and expression samples are documented. §§7–8 (canon issues, protected mysteries, cross-bible obligations, follow-up tickets, reviewer checklist) close the bible.

---

## 7. Canon issues, protected mysteries, cross-bible obligations, follow-up tickets

### 7.1 Load-bearing missing canon

The DMC Clone Body Companion bible identifies **five canon-load-bearing gaps** that this bible cannot resolve and must defer:

**(1) The bond-threshold values for channel-unlock crossings.** Per §3.3 + §5.2: the bible recommends bond-thresholds of approximately 25 / 40 / 65 / 90 for the four trust-band crossings, but these are bible-recommended-pending-Stage-1-architectural-ratification. The actual values are bible-deferred to Stage 1 architects. Engineering ticket **DCB-1** in §7.4. Tracked.

**(2) The dismissal mechanic's interaction with bond and channel-state.** Per §3.3 + §5.7: the canonical dismissal canon asserts bond-floor-25 and irreversible channel-state. The actual dismissal-engine implementation (does dismissal canonically pause bond decay? does it canonically suspend the Companion's NpcLine selector? does it canonically remove the Companion from active-companion UI slots?) is bible-deferred to Stage 1 architects. Engineering ticket **DCB-2** in §7.4. Tracked.

**(3) The 4-tuple personality variant authoring scope.** Per §5.5: 64 canonical variants × ~50 per-variant lines + ~250 base lines = ~3,450 lines per Companion. Bible-asserts the cardinality is canonical-and-load-bearing; the actual authoring scope is bible-deferred to Stage 2 dialogue authors. The per-variant authoring load is canonically *the largest single roster-character authoring scope* — Stage 2 may need to canonically descope, prioritise, or pre-generate via the canonical variant axes. Open design ticket **DCB-3** in §7.4. Tracked.

**(4) The why-paying-is-worse-than-not-paying canon protection.** Per §3.1 + §4.2: the canonical-unanswered question is canonically *protected*. Per `nilmorg.md` §6.x: writers must not solve. This bible *honours* the protection but flags it as a canon-load-bearing absence — Stage 4 weave authors must canonically *not* attempt to solve, and Stage 1 architects must canonically *not* expose any engine surface that could canonically be interpreted as solving. Tracked as canonical-protection ticket **DCB-4**.

**(5) The post-naming dialogue bank's canonical-content load.** Per §5.5 + §5.6: the post-naming Companion canonically integrates into all four primary game surfaces with canonical-verbal content. The actual saga-time-content (specific lines for specific events) is bible-deferred to Stage 2 dialogue authoring. Bible-asserted scope per §5.5: ~3,450 lines per Companion as the canonical authoring scope, distributed canonically across the four systems. Open ticket **DCB-5**.

### 7.2 Protected mysteries — what the bible canonically declines to narrate

Per §2 opening + §3.6 + §3.7 + §4.2 + §4.5: the Companion bible identifies **six protected mysteries** that are canonical-and-load-bearing absences. Each is held *intentionally* by the bible; Stage 4 weave authors who feel a need to surface should canonically *re-justify the protection* before considering breach.

**(1) Why-paying-is-worse-than-not-paying.** Per §3.1 + §7.1 (4): the canonical-unanswered question is canonically *protected*. The Companion canonically carries the question; the question canonically does not have a canonical answer. Bible-asserts this is canonically *Nilmorg's bible's most-protected single mystery* and the Companion bible canonically *inherits the protection*.

**(2) The racing clone's smile.** Per §2.1: the racing clone canonically smiles in the moment of extraction. The smile is canonical and load-bearing. Bible-asserts: writers must canonically *respect the smile as canonical without canonically explaining it*. Stage 4 weave authors who reach for the canonical reasoning behind the smile should canonically *re-justify the absence* first — the smile is canonically *the racing clone's*, not the Companion's, and canonically *resists narrative explanation*.

**(3) The transfer-from-container-to-body specifics.** Per §2.1: the moment-of-becoming canonically takes time and is canonically *off-screen* in shipped canon (Cinematic 5 cuts to *"the soul will become a companion aboard a ship somewhere"*). Bible-asserts: the specifics of the transfer (how the body receives the fragment, what the fragment experiences in transit, how the body acquires personhood) are canonically *protected*. Stage 4 weave authors who reach for the specifics should canonically *re-justify the absence* — the canonical-off-screen is part of the canonical *don't-thank-me* refusal canon, structurally.

**(4) Nilmorg's canonical-reasoning for the closed-account post-delivery posture.** Per §4.2: Nilmorg canonically does not engage the Companion post-delivery; *the agreement is complete*. Why Nilmorg canonically does not engage further is canonically *protected*. Bible-asserts: this is canonically tied to the why-paying-is-worse-than-not-paying mystery (per §7.2 (1)) — the canonical-protection extends to Nilmorg's post-delivery institutional behaviour. Writers must canonically *not* speculate.

**(5) The Companion's canonical-reasoning for their structural identity claim.** Per §2.2 + §3.5: the Companion canonically holds *"I was not given. I was delivered."* as their structural identity. Why the canonical *delivered-not-given* framing canonically resonates as identity (rather than as canonical-grievance) is bible-deferred. Bible-asserts: this is canonical-protection — the Companion canonically *does not analyse* their own identity-framing in shipped canon, and Stage 4 weave authors should canonically respect this. The Companion's identity is canonically *just-the-claim*; the canonical-reasoning behind the claim is canonically *theirs alone*.

**(6) The donor-canon's canonical-reach into the Companion's perception of other roster characters.** Per §3.2: the Companion inherits the player's *commitments* but not the player's *reasoning*. Bible-deferred: how this canonically affects the Companion's perception of NPCs the player canonically has not interacted with. Does the Companion canonically *recognise* NPCs the player has only briefly encountered? Does the Companion canonically *form their own opinion* of an NPC the player has not formed an opinion of? Bible-asserts: these are canonical-protection — Stage 4 weave authors should treat the Companion's perception-canon as canonically *bounded by the player's perception-canon* without canonically attempting to map the boundary explicitly. The boundary is canonically *the Companion's own*.

**Why protect these mysteries.** The Companion is canonically *the player's own Potential made into another person*; the protected mysteries are canonically *the asymmetry between what the soul-fragment knows and what the soul-source knows*. Bible-asserts: the protection is canonically *part of the Companion's voice* — they canonically *do not over-narrate their own ontology*. Breaking the protection canonically breaks the voice. Writers and Stage 4 weave authors should canonically respect the protection as a *voice-rule*, not as a content-gap.

### 7.3 Cross-bible obligations — reciprocal claims to file against other bibles

Each cross-reference in §4 carries a *reciprocal claim* — something the other character's bible must canonically acknowledge to keep the cross-reference symmetric. Each obligation is filed as a separate ticket; the reciprocal-bible's commit message should reference the obligation's number.

| # | Other bible | Reciprocal claim required | Status |
|---|---|---|---|
| **DCB-O1** | `eidolon.md` §5.9 | Eidolon bible should canonically acknowledge: (a) Echo-mode reactions canonically register the Companion's pre-verbal channel events as *kin-by-form* recognition; (b) the Eidolon canonically serves as the canonical first-word translator if both Eidolon and Companion are present (per §1.4 + §4.1); (c) Channel-stacked shared scenes are canonically call-and-response with Eidolon leading. | Pending Eidolon bible follow-up commit. |
| **DCB-O2** | `nilmorg.md` §4.8 | Nilmorg bible's §4.8 mid-wife/closed-account canon is canonically *correct as-shipped*; this bible inherits and extends. The reciprocal claim required: Nilmorg bible should canonically acknowledge that the Companion canonically *registers Nilmorg's indifference* in one of two canon-compatible readings (per §2.2 (a)/(b)). Bible-deferred to Stage 4 weave authors which reading lands in canonical scenes; the bible should canonically not pre-decide. | Pending Nilmorg bible follow-up commit. |
| **DCB-O3** | `vex_solene.md` §4.13 | Vex bible should canonically acknowledge: the Companion bible's structural parallel canon (companion-via-ritual; both characters acquired saga-time identity through ritual involving other-being delivering canonical-self-substrate). The two characters canonically have *canonical mutual recognition* if they meet in saga-time. | Pending Vex bible follow-up commit. |
| **DCB-O4** | `adjudicator_locke.md` §4.12 | Locke bible's §4.12 *category-of-thing-not-curiosity* canon is canon-locked. Reciprocal: Locke bible should canonically acknowledge that the Companion canonically *registers Locke's category-treatment as canonical-respect* and canonically responds with canonical-respect-of-its-own. Locke is canonically the saga's first character to treat the Companion as an entity not a curiosity. | Pending Locke bible follow-up commit. |
| **DCB-O5** | `wraith_calder.md` (remaining-roster Companion entry) | Hierophant bible should canonically acknowledge: (a) the Companion bible canonically resolves the chamber-as-first-word-context as canonical-default-if-applies; (b) the canonical first-word-as-Wraith-Calder canon canonically anchors the Companion bible's §4.6 + §1.4 + §6.4 sample; (c) the Hierophant is canonically the only character to whom the Companion canonically expresses gratitude in canonical voice (exception to the canonical pre-foreclosure-of-gratitude). **THIS IS THE COMPANION BIBLE'S DEEPEST SINGLE CROSS-BIBLE OBLIGATION** per the Hierophant bible's own framing. | Pending Hierophant bible follow-up commit. |
| **DCB-O6** | `the_game_master.md` §4.13 | Game Master bible's *companion-via-ritual; no canon contact* canon is canon-locked. Reciprocal: Game Master bible should canonically acknowledge the structural-distinction canon (Game Master recruits via test; Companion acquired via ritual). | Pending Game Master bible follow-up commit. |
| **DCB-O7** | `the_degen.md` §4.13 | Degen bible should canonically acknowledge: the placement-broker structural parallel (Jericho vs. Companion); the Degen canonically *recognises* the Companion as kin-by-placement; the Degen canonically *does not envy or pity* the Companion (placement-as-existence is dignified). | Pending Degen bible follow-up commit. |
| **DCB-O8** | `the_meme.md` §4.13 | Meme bible should canonically acknowledge: the structural-second-Meme-resistant-character canon (the Companion is the second Meme-resistant-by-construction roster character after the Seer); the donation-event-is-private canon canonically holds (Severance Prize ritual is institutional-walled); the Companion's worst-case scene is the Meme's attempt-at-impersonation, parallel to the Seer's. | Pending Meme bible follow-up commit. |
| **DCB-O9** | `the_seer.md` §4.12 (already shipped at `4b5b1d9`) | **RESOLVED** by §4.9 of this bible. All three sub-claims of Seer §7.3 SCB-O10 canonically resolved: (a) Seer respected emergent personhood by choosing not to foresee naming-event outcomes; (b) Companion's pre-verbal channels canonically register Seer transmissions; (c) double non-verbal signal canon (Eidolon Echo + Companion glyph). | **CLOSED**. |
| **DCB-O10** | Oracle bible (Step 5, not yet written) | Oracle bible §4.x (Companion cross-reference) must canonically land: (a) did Oracle foresee the Companion's existence; (b) does the Companion appear in the player's Oracle-dream-sequences; (c) is the Companion canonically Oracle-attuned via the donor-canon. All three bible-deferred to Oracle-bible authoring. | To be written when Oracle bible ships. |
| **DCB-O11** | Architect bible (not on priority roster, but canonically named) | If/when an Architect bible is authored, it should canonically acknowledge the made-not-born structural mirror canon (per §4.11) — both characters canonically made-not-born; opposite valences (Architect's enables harm; Companion's enables ontological recognition). Contrastive, not adversarial. | Bible-deferred — Architect not on priority roster. |
| **DCB-O12** | Human bible (not on priority roster as standalone bible — Human is one of two existing-depth NPCs) | If/when a Human bible's cross-reference structure is formalised, it should canonically acknowledge the recognition-as-kin canon (per §4.12) — Human canonically recognises Companion as part-of-the-player; Companion canonically defers to Human as player's-most-trusted-other. **The Companion-Human is the saga's first canonical Companion-defers-to-an-NPC relationship.** | Bible-deferred — Human bible not yet authored as standalone. |

**Bible-asserts**: every cross-bible obligation is canonical-and-tracked. The reconciliation pass per Stage 0 closing tasks (per the plan-file Step 6) will canonically verify each obligation is filed against its target bible. **DCB-O5 (Hierophant) is canonically this bible's deepest single cross-bible obligation** and Stage 2 dialogue authoring should canonically anchor on it. Obligations marked *pending follow-up commit* should canonically be batched as a single *cross-bible reconciliation chunk* (per the plan-file's chunk 18-equivalent for this bible); obligations marked *to be written when X bible ships* are canonically resolved by the X bible's own §4.x authoring.
