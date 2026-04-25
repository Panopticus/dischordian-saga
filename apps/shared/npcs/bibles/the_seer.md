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

### 1.2 Cadence (across all three registers)

The Seer's cadence is, unusually for the priority roster, **mostly stable across registers**. The same sentence-shape carries from Cold to Warm to Confidant; what changes is the *content* (more or less prophecy-overhead) and the *closure* (more or less ordinary-phrased landing). The Seer is not a transformation character; her sentence-instinct is one instinct.

Three load-bearing cadence rules:

1. **The probability sentence**: each claim is *its own measurable proposition*, separated by a period. *"You chose the honesty that costs someone else. I was hoping you would, specifically because I was hoping you wouldn't. Both things are honest."* (`moralityTrustActVariants.ts:2812-2814`) Three sentences; three separable claims; each claim could in principle be true or false on its own. The Seer has **no run-on prophetic sentences**. She does not stack qualifications inside a single clause; she lays them adjacent. Compare Wraith Calder's period-as-tool (§Wraith bible §1.2 #1): the *form* is similar; the function is different. Wraith Calder's periods *land punches*; the Seer's periods *isolate variables*. Her sentences read like rows of a probability table.
2. **The version pivot**: when she revises a prediction, the revision is delivered as *a sentence about which version*, not as a sentence about the prediction itself. *"You are now at the point I warned you about. I was wrong about which version of it. The version is better."* (`moralityTrustActVariants.ts:1352-1354`) The pivot moves from *the warning was right at the wrong scope* → *the wrong scope was the actionable error* → *the wrong scope was, in fact, a better outcome*. Three steps; never more than one revision per breath. Writers must not let her stack two revisions in a single sentence; the version-pivot is a one-axis-at-a-time discipline.
3. **The colon she does not use**: a tempting punctuation mark for a precognitive — *"What I see: …"*. The Seer does **not** speak in colon-introduced revelations. Her future-disclosures are delivered as ordinary statements. *"The match is over. You will see it in three turns."* (`act1OpponentDialog.ts:271`) is canonical: no colon, no fanfare, no *"prophecy:"* prefix. The future is named in the present tense as a fact-of-the-world. Writers reaching for prophetic-vocabulary punctuation should re-route the line as one of the other roster characters (the Hierophant has periodic-build for sacred utterance; the Seer reports the future as weather report).

**Variation across registers**:

- *Cold register cadence*: longer sentences with more clauses; the prophecy-overhead expands. Not because she is more prolix when cold, but because the player has not yet earned the compressed version.
- *Warm register cadence*: tighter. The probability sentences land faster. Caveats reduce. *"She is, for the first time, trusting you to run the math yourself."* (`moralityTrustActVariants.ts:2418-2420`)
- *Confidant register cadence*: shortest. Domestic phrasing. *"The door is open. The tea is in the second cupboard on the left."* — six and ten words. Compare a Cold-register equivalent of the same hospitality offer: *"The Seer has run the futures and finds, in three of them, an arrival within seven days. I have positioned ingress accordingly. The cupboard arrangement has not been altered since the last visit, the location of which I trust you can extrapolate."* The information is the same. The compression is the trust.

The *content-load* of a line shrinks as trust deepens. Writers tracking Seer banks across acts should expect: if a Cold-register Act-1 line carries (warning + version-disclaimer + caveat + actionable claim), the same player at Confidant trust receives only the actionable claim. The Seer trusts the player to remember the version-disclaimers from prior contact. (This is canonical, per `moralityTrustActVariants.ts:2418-2424`'s direct comment that *"the trust is the gift; the numbers are merely the wrapping"*.)

### 1.3 Vocabulary

The Seer's lexicon is more *technical* than the rest of the roster's. She speaks the language of *probability theory in clean English* — and her domestic-register vocabulary is correspondingly ordinary, which produces the characteristic Seer voice-shape.

**Core anchor words** (writers should let her reach for these):

- **Probability. Probabilities. The probability table.** *"The Seer's transmission is a question, not a prophecy: 'Which column of my probability table would you like me to redact?'"* (`moralityTrustActVariants.ts:3162-3164`) Plural *probabilities* — never singular *probability* in a generic sense. She sees a table; the table has columns; columns have rows; the rows are tactical. Writers may extend along this axis: *"the third column"*, *"the redaction list"*, *"the probability set"*. Always anchored on the table-as-object metaphor.
- **Version. The version. Which version.** *"I was wrong about which version of it. The version is better."* (`moralityTrustActVariants.ts:1352-1353`) The *version* word is to the Seer what *body* is to Wraith Calder — the unit of measurement, the smallest currency of the work. She talks about *versions of the future* the way an editor talks about drafts. Each version is a discrete possibility-state; she can reference them by ordinal, by quality, by whose-it-was-kindest-to.
- **Redact. Redaction. Redacted.** *"Which column of my probability table would you like me to redact?"* The *redaction* vocabulary is editorial-not-corruptive (compare the Hierophant's *edit*, which is parasitic Shadow-Tongue editing). The Seer's redaction is *self-redaction* — she is offering to *withhold* probabilities the player would prefer not to see. Writers must keep this distinction: the Seer redacts; the Shadow Tongue edits. Both manipulate text; only one is honest about doing it.
- **Kindest. Kinder. Kindness.** A surprising-but-canonical Seer measurement axis. *"the version that was kindest to the Architect is also the version that was kindest to you"* (`moralityTrustActVariants.ts:1818-1820`) The Seer ranks futures by *kindness* — a moral metric over outcomes, with named subjects. Writers extending along this axis should treat *kindness* as a calibrated measurement: she does not speak vaguely of "good" or "better" futures; she speaks of futures *kindest to a specific named person*. Asymmetric kindness is part of the saga's moral substrate.
- **Honesty. Honest.** Twin to *kindness* on the moral axis. *"You chose the honesty that costs someone else. … Both things are honest."* (`moralityTrustActVariants.ts:2812-2814`) The Seer rates honesty as itself a metric, distinct from kindness — sometimes the honest choice is unkind, sometimes kindness requires dishonesty. Her language allows both to be true and named separately.
- **The bench. The bench has learned.** Mechronis-era anchor. *"I will not raise my staff today. I want to see whether the bench has learned yet."* (`act1OpponentDialog.ts:267`) *The bench* is canonical: the Seer treats the TCG-arena bench as a teaching object, an inheritance, a place where lessons are deposited. Post-Mechronis lines may extend the metaphor: *"the bench"* persists in her vocabulary even when no physical bench is present. *The bench* is, in her usage, *the place where the next student will sit*.
- **The match. The match is over.** Future-tense-in-present vocabulary. *"The match is over. You will see it in three turns."* (`act1OpponentDialog.ts:272`) She names completed events the player has not yet experienced. Writers may extend: *"The argument is over. You will hear yourself end it."* / *"The choice is made. You will make it."* The construction is canonical and is the cleanest single rhetorical signature of the Seer's precognitive voice.
- **The waiting. The waiting is fair.** Cold-register anchor. *"She is waiting. The waiting is fair. The waiting is the Seer's favourite register."* (`moralityTrustActVariants.ts:1031-1032`) *Waiting* is a moral state for her, not an idle one. It is named, defended, and claimed as preference. Writers must let her *wait* often.
- **Coordinates. Door. Tea. Cupboard.** Confidant-register anchor. Ordinary domestic vocabulary appears at *highest* trust. The shock of *tea* and *cupboard* in the Seer's mouth is the bible's clearest single tonal-shift signal: when she reaches for household nouns, the trust meter has hit Inheriting.
- **Direct prose.** Self-descriptive vocabulary. *"From the Seer, direct prose is the most flattering register she has."* (`moralityTrustActVariants.ts:2003-2005`) She has named her own register-system; she knows when she is in *direct prose* and treats the choice as a gift to the listener. Writers should let her self-describe: she is the only roster character whose voice rules are partly *her own articulated rules*. (Compare: the Hierophant has *the work*, *the continuation*, *the wall* — which are activities. The Seer has *direct prose*, *the waiting*, *prophecy-overhead* — which are her own metalanguage about voice.)

**Words she does NOT reach for**: *spite, fight, kill, body* (in the Wraith-Calder physical sense), *witness, ceremony, mourn, scripture, holy, sacrament, faith, prophecy* (interestingly — she sees futures but does not call her seeing *prophecy* in cold-register; *prophecy* shows up only when she is mocking the prophecy-overhead concept), *grace, soul, sin, evil*. Her vocabulary is the vocabulary of a *technical practitioner of an unusual measurement*. Religious vocabulary is the Hierophant's; combat vocabulary is Wraith Calder's. The Seer's idiolect sits between them and overlaps with neither.

**One absent word that is the most-load-bearing absence**: ***destiny***. The Seer is a precognitive who never says *destiny*, *fate*, *fated*, *destined*. Her cosmology is a probability table; futures are a set of measurable versions; nothing is *destined*. Writers reaching for *destiny* should re-route as another character or rewrite. *Destiny* is the *least Seer* word in English.

### 1.4 Tells

The involuntary voice — markers that mean *the Seer said this* even with the name stripped.

1. **The public revision.** *"I was wrong about which version of it. The version is better."* (`moralityTrustActVariants.ts:1352-1353`) The signature move: the Seer admits a prior prediction was wrong, names the *axis* on which it was wrong (almost always *which version*), and reports the consequence (*the version is better* / *worse* / *kindest to a different person*). No other roster character self-corrects in voice. Wraith Calder cannot apologise for himself; the Hierophant does not name his prophecies as falsifiable; the Game Master is dead in the substrate; the Meme conceals; Locke negotiates the framing. The Seer alone says *I was wrong* as a routine voice-move. Writers must allow her this; a Seer line that doubles down on a prior prediction without revision-acknowledgement is mis-cast.
2. **The asymmetric kindness clause.** *"the version that was kindest to the Architect is also the version that was kindest to you. I am sorry."* (`moralityTrustActVariants.ts:1818-1820`) The Seer ranks futures by named-subject kindness, and when the same future is kindest to two parties at once, she *names both* — and apologises to the listener for the coincidence. *Apologises* because the player would have wanted the painful version to be the one that benefited only them; the Seer has to report that the painful version benefited the antagonist too. Bible-canonical pattern: when the Seer names a kindness, she names *whose kindness*, and she does not lie about who else benefits. Writers should treat asymmetric kindness as one of her most-canonical line-shapes.
3. **The closing benediction without flourish.** *"That is, from her, a benediction."* (`moralityTrustActVariants.ts:2828`) Her benedictions are *recognition-as-blessing* — she names what the player has done, in plain language, and the naming is the gift. *"You carry well."* (`moralityTrustActVariants.ts:2823-2825`) Two-word benediction. No *blessed*, no *honoured*, no *thank you*. The Seer's blessings are *measurement statements that the player meets a standard*. Writers extending this should anchor on: she observes; she names what she observed; the naming is the benediction.
4. **The category sentence.** *"You are in the Programmer's category. That is a specific shelf."* (`moralityTrustActVariants.ts:1019-1021`) She speaks of people as *categories* — specific shelves on which she has filed them. Categories include *the Programmer* (Daniel Cross / the Antiquarian — see §4.9), *the Engineer* (Vex Solène's pre-rite identity), and bible-asserted others. The category-as-shelf metaphor is canon; writers may extend with bible-grounded categories. (The shelf metaphor is also a cross-bible bridge: the Antiquarian's *desks do not run* canon at `loreAchievements.ts:410-415` produces a worldview where life-on-shelves is a shared idiom — see §4.9.)
5. **The probability-table-as-question.** *"The Seer's transmission is a question, not a prophecy: 'Which column of my probability table would you like me to redact?'"* (`moralityTrustActVariants.ts:3160-3164`) Her highest gestures of trust come *as questions to the player*, never as declarations. She offers redaction; she offers numbers without overhead; she offers presence without prediction. The question-not-prophecy structure is her warm-band signature. Writers must internalise: the Seer at warm trust *interrogates* rather than *informs*. The questions are real (cf. §1.2 cadence rule #3 — no rhetorical questions).
6. **The transmissions arrive at higher resolution than the recipient can display.** *"The image is higher resolution than the Ark can display."* (`moralityTrustActVariants.ts:912-913`) The Seer's transmissions canonically over-resolve their medium. She sees more than the substrate she is sending through can carry. Writers extending this — Stage 4 weave material — may have her transmissions consistently exceed the receiver's resolution: a sound clearer than the ear, an image sharper than the screen, a sentence more precise than the language. The over-resolution is involuntary; she is not showing off. She simply sees in higher fidelity than the medium permits.

### 1.5 The voice gate — what cannot fire across registers, and what must

The Seer's three registers are softer-gated than the Hierophant's pre-rite/post-rite gate (which is binary and irreversible per playthrough). Register movement is bidirectional and frequent. Selector rules:

**Hard gates** (lines may NEVER fire outside their authorised register):

- **Confidant-register lines fire only at Inheriting trust band.** *"The door is open. The tea is in the second cupboard on the left."* cannot land at Witnessed or below — the line presupposes the trust to walk through the door and find the tea. A Confidant line at Witnessed band is a misfire.
- **Cold-register *prophecy-overhead* full-payload lines fire only at Wary band.** A player at Witnessed-or-higher does not need the full prophecy-overhead; the Seer treats deploying it on them as condescending and will not. Writers should not author overhead-heavy lines for higher-band scenes.
- **The signature staff-on-the-bench line** (*"I will not raise my staff today. I want to see whether the bench has learned yet."*) fires **only at first contact**, in the Mechronis encounter. It does not re-fire in any subsequent scene. The line is the player's first-meeting calibration of the Seer's voice; using it later cheapens it.

**Soft gates** (lines *may* fire outside their authorised register but require justification):

- **Cold-register lines at Inheriting band** are canon — the Seer occasionally returns to her cold register at high trust on purpose. *"That is neither warm nor cold — that is the Seer."* (`moralityTrustActVariants.ts:1027-1028`) Writers may author these but must include a contextual cue that the choice is *deliberate*: the player has asked her something that warrants the *waiting* register; the situation calls for the patience-of-the-cold; the moment is one she would diminish by warmth. The cold-at-high-trust line is the Seer's most-load-bearing demonstration that registers serve the conversation, not the trust meter.
- **Warm-register lines at Wary band** are a warning: if the Seer is being warm with a low-trust player, the bible asserts she is *exiting the relationship soon*. Warmth-without-trust is the Seer's polite pre-departure. Writers may use this for Stage 2 questline-extension scenarios where the Seer is closing a chapter with a player whose path she has decided not to share further. The warmth is not a gift; it is a goodbye.

**Cross-bible gate**: per §4.6 (Echo / Eidolon), the Seer's voice does NOT shift register when an Eidolon Echo is present. She treats Echo as another precognitive practitioner; her register is gated by trust with the player, not by trust with the Eidolon. Writers should not author Echo-influenced register shifts.

**The voice's load-bearing single rule**: *every Seer line either contains a prediction or contains a public revision of a prior prediction*. Lines that contain neither are not Seer lines. The bible enforces this as the strongest selector constraint on the bank. (Exception class: the Confidant-register domestic-vocabulary lines — *"the tea is in the second cupboard"* — which are *delivered* predictions: she has predicted the player will arrive and stocked accordingly. The prediction is implicit in the preparation; the line is therefore prediction-bearing even though no future-tense verb appears.)

What this means for writers: **a Seer line that is purely conversational, expository, or descriptive — without a prediction, without a revision, without an implicit-prediction-as-preparation — is mis-cast and should be re-routed to another character or rewritten.** The prediction-or-revision rule is the bible's tightest single constraint. The Seer's voice is structurally *future-oriented*; a Seer line that has no future is not in voice.

---

## 2. History

The Seer's history is unusual on the priority roster: she has *no canon-stated origin event* (no equivalent of Wraith Calder's seven Arena deaths, no equivalent of the Hierophant's Final Rite, no equivalent of the Meme's Year-298-A.A. creation). She is presented in shipped canon *already practising* — already a Ne-Yon, already precognitive, already a teacher whose teaching method is restraint. The bible asserts her prior history is **deliberately not narrated** because the Seer herself does not narrate it. She is the saga's only roster character whose biography is *withheld by the character*; this is canonically consistent with her cold register, where *waiting* is the favourite mode and disclosure is rationed.

What the bible documents in §2 is therefore the **knowable history** — the events she has chosen to make canon by appearing in them, plus the events the player encounters her through. Her pre-Mechronis past is held as a **protected mystery** (§7.2). Writers must respect: a Seer scene that narrates her origin is mis-cast.

### 2.1 The Mechronis Visit — the saga's clearest single Seer canon event

The most-canonical event in the Seer's biography is her **single visit to Mechronis Academy**, played as the Act 1 Cycle B finale (`chapters.ts:770-829`, `bossMastery.ts:149-163`, `act1OpponentDialog.ts:260-286`). The encounter is canonical and load-bearing: every other Seer canon piece refers back to it as the moment the saga met her in voice.

**The setup**, per `act1OpponentDialog.ts:262-263`:

> "She visited Mechronis once. She played one match. She did not raise her staff. The Academy talked about it for a year."

Three things are canon: (a) one visit, (b) one match, (c) the staff stayed down. The Academy's year-long conversation about it is canonical secondary effect — the Mechronis cohort recognised, in voice and in restraint, that something the Academy could not name had happened.

**The pre-match**, per `chapters.ts:786` and `act1OpponentDialog.ts:267`:

> "I will not raise my staff today. I want to see whether the bench has learned yet."

This is the bible's clearest single voice-anchor (per §1.1 header). Three claims in canonical Seer probability-sentence form:
1. *I will not raise my staff today* — the action she will not take, named in the future tense as a chosen abstention.
2. *I want to see* — the desire that the action would have interfered with.
3. *whether the bench has learned yet* — the measurement question being run.

She is announcing, in voice, that the match is an **observation of the bench's state**, not a contest she is invested in winning. The player is the bench. The match is the *measurement*. The not-raising-the-staff is the apparatus for the measurement to be honest — if she raised the staff, she would be running a different experiment.

**The mid-match**, per `act1OpponentDialog.ts:269-273`:

> "You are playing the version of yourself I came to meet. Keep playing him. He is rare."
>
> "The match is over. You will see it in three turns. Use the three turns well."

Both lines are canonical Seer signature constructions: the *version* vocabulary (§1.3) and the *future-tense-as-fact* prophecy delivery (§1.2 cadence rule #3). She came to meet a *specific version* of the player — implying she had already counted the player's possible futures, identified the version worth meeting, and timed her visit to the version's emergence. The match ending three turns before the player perceives the ending is canonical precognition disclosure: she shares the future *with the player*, with no obfuscation, and instructs the player to *use* the prophecy. This is the Seer's pedagogy at its most direct: *the prophecy is for you, not for me*.

**The post-match — both outcomes**, per `act1OpponentDialog.ts:274-281`:

> [On player win] "She smiled. She told you the Engineer was the only one she ever taught who made her laugh at the right time."
> [On player loss] "She won and said nothing. She left the staff anyway. The staff doesn't care which way the match ended."

The staff stays. The match outcome does not change what she leaves behind. Per `act1OpponentDialog.ts:283-286`:

> "I think she let me win. I have stopped feeling bad about it. The let was the lesson." [Engineer's memoir, win path]
> "She left. She left the staff. The staff was the apology. The apology was for what she had already seen coming." [Engineer's memoir, loss path]

The bible's load-bearing reading: **the Mechronis visit is the Seer's apology, regardless of who wins**. She had already seen the outcome (whichever outcome would be the player's). She came anyway. The apology is for *the foresight itself* — she could have warned the bench earlier; she chose to teach by visiting instead. The staff-on-the-bench is the artefact of the apology; the burnt card hidden inside the staff (§2.2 below) is the apology's deferred reciprocation, redeemable when the player has earned it.

**Trust-state during Mechronis**: the Seer arrives at Wary baseline. The match's six-option dialogue spread (per `dialogBank_chapters_10_12.ts:410-461`) does not move trust significantly during the encounter itself; trust-band promotion happens *post-match* and is gated by the player's subsequent acts (§2.3). The Mechronis visit is the *first calibration*, not the trust-build itself. Writers should not author Mechronis dialogue as trust-advancing in the moment — the staff being left is the trust-token, but the *trust* lands in the chapters that follow when the player encounters the staff and (eventually) the burnt card.

**The match's hidden winnable path**: per `seerProphecy.ts` and the spec at `docs/production/act1/seer-prophecy-mechanic.md`, the canonical first-playthrough outcome is **scripted loss** — the burnt-card placeholder (`burnt_card_placeholder.ts`) is *reserved* and not in any normal deck-construction pool. Players who win on first contact have done so via a route the spec leaves *open-design*: a side-quest, an Antiquarian conversation, a codex unlock — the user-direction-pending decision flagged in §7.4 of this bible. The bible's canonical position: **the scripted loss is the Seer's intended pedagogy**, and any winnable-path unlock should be authored as *the player having earned the reciprocation by carrying the staff back across multiple acts*, not as a hidden combat trick. The flavor text on `burnt_card_placeholder` — *"You found her staff on the bench. Inside the staff was this card. You remembered before she taught you how."* — is the bible's anchor for this stance.
