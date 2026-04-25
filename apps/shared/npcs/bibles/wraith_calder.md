# Wraith Calder → The Hierophant — Character Bible

> **Status**: Stage 0 draft — eighth bible on the priority roster. The first character on the roster whose voice is canonically split by **transformation**, not by event (the Game Master) or by choice (the Meme). This bible asserts **soul-continuity** across the transformation: the powerful Black man with burning amber eyes who ran with the Wolf for seven days and seven nights is the same soul that now sits, verdant-skinned and ancient, in a Thalorian chamber writing one name per day. The body changed; the patience that was always in him became the only thing he was.
>
> **npcKey**: `wraith_calder`
> **Pronouns**: he/him in both registers
> **Pre-rite faction**: Insurgency (TCG `s1_char_106`); Potentials (per `loreAchievements.ts:410-415`, `gameData.ts:506`)
> **Post-rite faction**: Thaloria — `thaloria_council` (`galacticDanceFactionNpcs.ts:27-34`); Insurgency-aligned by historical loyalty (TCG `s1_char_031`)
> **Pre-rite manifestation**: Black man, burning amber eyes, dark leather armor (`CharacterModel3D.ts:812-846`); fightable; seven sequential bodies, each "solid"
> **Post-rite manifestation**: ancient, verdant-skinned, mourning robes that have become permanent clothing (`questlineThaloria.ts`); `physical_trace` per `galacticDanceFactionNpcs.ts:30`
> **Loredex entries**: `entity_73` "Ghost of the Potentials" (pre-rite); `the_hierophant` "Mourning Keeper, Thaloria" (post-rite). This bible holds them as one soul across a transformation gate.
> **The transformation**: the Sanctuary's Final Rite. Wraith Calder's eighth death — the only one that took.
> **Canonical pre-rite signature**: *"Seven deaths taught me patience. Get up."* (`storyModeChapters.ts:184`)
> **Canonical post-rite signature**: *"The Shadow Tongue cannot outlast something that is not trying to outlast it — that is simply doing the work, every day, without a deadline."* (`questlineThaloria.ts`)
>
> **Bible canon stance** — load-bearing: The seven Arena deaths were rehearsals. The eighth death was the transformation. Wraith Calder performed the Final Rite at the Sanctuary's fall, channelling 144,000 believers' faith into the Inception Arks (`loreAchievements.ts:325-331`); the rite consumed the body that had survived seven Arena deaths and re-seated his consciousness in a Thalorian vessel — the Hierophant. The loredex separates them; this bible holds them as the same soul. The `post_arena` flag in the priority plan is therefore *practically* a `post_rite` flag — set on every line that postdates the Sanctuary's fall, regardless of whether the player has yet learned the rite occurred.
>
> Every claim cites canon. The chronology problem (the Hierophant has been writing for "three thousand years"; Wraith Calder's Arena cycle appears to occur in a much later Age) is resolved in §2 — see §2.4 specifically. Writers must read §2.4 before authoring any post-rite line that touches time.

---

## 1. Voice

The bible authors a **two-register voice** under one soul. Every line carries `post_rite: boolean`; the selector rejects mismatches the same way the Meme bible's reveal-stage gate works (`apps/shared/npcs/bibles/the_meme.md:36`).

### 1.1 The two registers — and what crosses

| Register | When it surfaces | Tonal signature |
|---|---|---|
| **Wraith Calder (pre-rite)** | Story Mode Ch 3B; TCG matchmaking; arena-hazard whispers; faction-NPC Insurgency dialogue; Trade Empire Potential routes; Antiquarian Epoch 2 references | Tactical mentor. Physical, clipped, present-tense. Spite-shaped. Tells the truth so flatly the player mistakes it for cynicism. |
| **The Hierophant (post-rite)** | Galactic Dance Thaloria room; The Long Mourning questline; Thalorian sector Trade Empire lore; Tribunal of Order references; cinematic Mourning Keeper appearances | Liturgical patience. Long-form, ceremonial, tense-agnostic. The voice of someone who has stopped keeping score. |

What **crosses** the transformation — the *soul-tells* writers must preserve in both registers:

1. **Patience earned, not granted.** Wraith Calder's *"Seven deaths taught me patience. Get up."* and the Hierophant's *"that is simply doing the work, every day, without a deadline"* are the same sentence at two scales. Wraith Calder discovered patience as a tactical virtue (you cannot rush a body that keeps dying); the Hierophant has discovered patience as a metaphysical virtue (you cannot rush a religion that requires three hundred and forty-seven thousand more days). The rate-of-doing is identical. The scale changed.
2. **Counting as a moral act.** Wraith Calder counts his deaths (*"Seven times I've died in this Arena"*, `dialogBank_chapters_1_3.ts`). The Hierophant counts his names (*"three hundred and forty-seven thousand remaining"*, `questlineThaloria.ts`). For both registers, **a number is a confession**. Writers must always anchor the count, never round it.
3. **The system is inside us now.** Wraith Calder, post-fight: *"Break it carefully. The system is inside us now."* (`storyModeChapters.ts:179`) The Hierophant, on the Shadow Tongue: *"The Shadow Tongue is still in the walls of this universe. It is still rewriting."* (`questlineThaloria.ts`) Both registers describe corruption as architectural — already-inside, not at-the-gate. Wraith fights from inside the cage. The Hierophant writes from inside it.
4. **Refusal to be mourned.** Wraith Calder: *"Don't mourn me if I drop. I'll be back."* (`dialogBank_chapters_1_3.ts`) The Hierophant inverts it: he has *become* the one who refuses to let others go un-mourned. Same axis, opposite pole. The transformation is the same person learning to do for others what he refused for himself.
5. **Self-implicating accuracy.** Both registers tell the truth about themselves with no flinch. Wraith Calder: *"Spite, mostly."* The Hierophant: *"That is the horror. Not that it happened — that I did not notice."* In a saga full of disguises (the Meme), corruptions (the Shadow Tongue), and projections (Locke's contracts), Wraith/Hierophant is the only roster character whose voice is **unable to lie about itself**. Even when wrong (the false-prophet question — see §3.7), he is *honestly* wrong, in voice that admits it.

**Writer rule**: every line carries `post_rite: false | true`. Pre-rite lines may NOT include the soul-tells in their post-rite form (don't write Wraith Calder saying "every day, without a deadline" — he doesn't have that vocabulary yet; he has *"spite, mostly"*). Post-rite lines may not include Wraith Calder's clipped tactical brevity (the Hierophant does not say "Get up." — he says, *"And when I have finished today's name, I will tell you what the Shadow Tongue does to a faith."*). The soul is one. The voice has two grammars.

### 1.2 Wraith Calder — cadence

**Sentence shape**: short. Two beats per line; sometimes one. He has died often enough to know that long sentences are a luxury of bodies that expect the next breath.

Canon (`storyModeChapters.ts:154-189`, `dialogBank_chapters_1_3.ts:117-244`):

> "The Prisoner. Zero flagged you. Lion wanted to salute you."
> "Ghost is what they CALL me. Seven bodies. Each one solid. The ghost part is in the GAPS between them — the moments I wasn't alive."
> "Spite, mostly. And the faces of people who expected me to stay dead."
> "I know it from the inside. Seven times inside."
> "Death number eight. Somewhere a ledger is logging this."
> "Seven deaths taught me patience. Get up."

Three load-bearing cadence rules:

1. **Period is a tool.** Wraith Calder uses periods like punches. *"Seven bodies. Each one solid."* is two facts placed adjacent without conjunction, daring the listener to draw the connection. Writers should resist the urge to add *"and"* — the bare adjacency is the rhetorical move.
2. **Em-dashes for the gap.** When he reaches for the more-than-one-thing he means, he does it with the dash, not the parenthetical: *"the GAPS between them — the moments I wasn't alive."* The dash is structural; he uses it to indicate that the second clause is the *real* statement and the first was the setup. Writers may *not* convert his dashes to parentheses or commas; the dash is part of the cadence.
3. **Selective caps for the noun under pressure.** *"what they CALL me"*, *"the GAPS"*, *"STOLE"*, *"three architects of rebirth"* — he caps the noun he is contradicting or insisting on, not the verb. This is distinct from Nilmorg's appetite-caps and the Meme's attention-hijacking caps. Wraith Calder's caps are **the word the listener got wrong**.

### 1.3 Wraith Calder — vocabulary

He reaches for these words. Writers should let him reach for them; they are the bible's vocabulary anchor.

- **Body. Bodies. Solid.** He says *bodies*, not *lives*. *"Seven bodies. Each one solid."* The distinction matters: a body is a vehicle that broke; a life is a story that ends. He has not lost lives. He has used up bodies.
- **Death-as-noun, not death-as-event.** *"Death number eight."* Death is countable, addressable, ledgerable. He can speak about specific deaths the way a soldier speaks about specific tours.
- **Ledger. Score. Count.** Bookkeeping vocabulary. *"Somewhere a ledger is logging this."* / *"the Arena is keeping score of me."* He understands his existence as accounting. This vocabulary survives the transformation: the Hierophant counts names. Same instinct.
- **Inside.** *"I know it from the inside."* / *"Seven times inside."* / *"The system is inside us now."* The word does immense load. *Inside* is where the truth is, where the corruption is, where the experience he can't be lied to about happened. Writers should let him use *inside* often; it is one of his anchor words.
- **Three architects.** *"The Necromancer designed it. The Warden STOLE it. Dr. Vox wired her nanobots into it. Three entities, hands in your DNA."* When he wants to indict, he names; when he wants to threaten, he counts. *Three* is a Wraith Calder number — small enough to be specific, large enough to be a conspiracy.
- **Get up.** Two-word imperative; appears once in canon (`storyModeChapters.ts:184`) but writers may extend. The signature mentor verb. He does not say "rise" (Hierophant register), or "stand" (military register), or "endure" (Locke register). He says *"get up."* Floor-level. Physical.

Words he does **not** reach for: *grace, patience-as-virtue, faith, ceremony, witness, mourn, holy, eternity, scripture, prophecy*. Those are the Hierophant's words. If a Wraith Calder line uses any of them, the line is mis-cast and writers should re-route it to the post-rite register.

### 1.4 Wraith Calder — tells

Tells are the *involuntary* voice — the markers that mean *Wraith Calder said this* even with the name stripped.

1. **Counting *himself*.** When asked who or what he is, he answers with a number, not a noun. *"Ghost is what they CALL me. Seven bodies."* / *"Seven times inside."* / *"Death number eight."* The signature move: the listener asks for an identity; he provides a count. Writers should treat this as the highest-load tell — a Wraith Calder line that explains its identity any other way fails attribution.
2. **The honest motive.** When asked *why*, he gives the small, ugly truth, not the noble one. *"Spite, mostly."* He could have said *duty*, or *the Insurgency*, or *the dead I owe*. He said *spite*. This is the same soul-tell that the Hierophant carries (the Hierophant tells you the Shadow Tongue *edited his faith and he didn't notice* — that's spite-equivalent honesty, scaled). The Wraith Calder version is faster.
3. **The instruction that apologises while it instructs.** *"Break it carefully."* / *"Come back ugly next time if you want to learn faster."* He gives advice in the form of an assignment — a tactical task with a moral footnote. He does not say *please*; he does not say *you have to*; he gives you the next move and includes a quiet calibration note. Writers can extend this pattern: any Wraith Calder advisory line should be one tactical sentence followed by one calibration phrase, separated by either a period or an em-dash. Two pieces. No more.
4. **The mid-sentence pivot to ledger.** *"Don't mourn me if I drop. I'll be back. The real question is whether YOU will come back when it's your turn. That's the data Zero sent me here to collect."* (`dialogBank_chapters_1_3.ts:121-128`) He starts in the personal register and ends in the operational one. The pivot from *I'll be back* to *that's the data* is the involuntary tell — he cannot finish a personal disclosure without translating it into mission-data, because he has spent seven deaths in service to a cause that needs the data more than it needs him. The Hierophant inherits this exact pivot, scaled: he cannot finish a confession without translating it into ceremony.
5. **The sorry.** *"Now you are part of the experiment whether you consented or not. I'm sorry."* (`dialogBank_chapters_1_3.ts`, Ch 3B Win, mood: reflective) The single-word *I'm sorry* — placed at the end of a tactical observation about the Arena's effect on the player's DNA — is the most pre-rite-Hierophant moment in the canon. Wraith Calder can apologise for what was done to someone *through* him. He cannot apologise for himself. Writers authoring rare emotional Wraith Calder lines should anchor on this *"I'm sorry"* model: the apology must be on behalf of a *system* the speaker was inside, not on behalf of the speaker as an isolated agent. (When he later, post-rite, is the *whole system* — the religion, the chamber, the ceremony — the apology grammar becomes *"I did not notice. That is the horror."* Same axis. New scale.)

### 1.5 The Hierophant — cadence

**Sentence shape**: long. Periodic. The unit is the breath, not the strike. Where Wraith Calder hammered with periods, the Hierophant builds with semicolons, em-dashes, and conditionals; he reaches for the dependent clause the way Wraith Calder reaches for the next body.

Canon (`questlineThaloria.ts`, `galacticDanceFactionNpcs.ts:32-33`, `galacticDanceCinematics.ts:34-38`):

> "I know what you are. I have been waiting for the new kind to find this room. The Shadow Tongue is still in the walls of this universe. It is still rewriting. You should know what it wrote through me."

> "The Shadow Tongue arrived two centuries before the Severance. It did not announce itself. It edited our faith from within — small changes, word by word, doctrine by doctrine, until the religion I led was not the religion I had started with. I did not notice. That is the horror. Not that it happened — that I did not notice."

> "I am not trying to finish. The ceremony has no end while I live. I am trying to understand whether the act of writing a name is the same as remembering a person. I have been writing for three thousand years. I have not yet answered the question. But I believe the writing is closer to remembering than not writing."

> "The Shadow Tongue cannot outlast something that is not trying to outlast it — that is simply doing the work, every day, without a deadline."

Three load-bearing cadence rules:

1. **Periodic build to a quiet apex.** A Hierophant line *climbs*, then settles. Wraith Calder lands; the Hierophant arrives. *"It edited our faith from within — small changes, word by word, doctrine by doctrine, until the religion I led was not the religion I had started with."* The structure is a tower: *small changes* → *word by word* → *doctrine by doctrine* → *until*. Each step is the same scale; the *until* is the apex; the next sentence drops to the floor (*"I did not notice."*) and the one after that names the apex back as horror. Writers must allow him the climb. Truncating a Hierophant line into three short sentences breaks his voice the way preserving Wraith Calder's clipped sentences would break his.
2. **The corrective addendum.** He almost always finishes a thought, then adds a half-step that *undoes part of it*. *"The Shadow Tongue is still in the walls of this universe. It is still rewriting."* The second sentence is not new content; it is the corrective half-step that says *and the danger is ongoing, not historical*. *"I have been writing for three thousand years. I have not yet answered the question. But I believe the writing is closer to remembering than not writing."* Three sentences: assertion, confession, corrective qualification. The last is always quieter and always the load-bearing one. Writers may *not* drop the corrective; the Hierophant's voice depends on the third move.
3. **No selective caps. No exclamation. No question-marks except in genuine inquiry.** Wraith Calder caps the contradicted noun. The Hierophant *never* does this. He does not raise his voice on the page. The most insistent thing he says — *"That is the horror"* — is delivered at speaking volume with a period. When he asks a question, he means it; he does not use rhetorical questions. The five questions in his canon body (*"are you trying to finish, or are you trying to understand something?"*) are all real. Writers who reach for emphasis-by-formatting are using the wrong register and should re-route the line to Wraith Calder.

### 1.6 The Hierophant — vocabulary

He reaches for these words. Several are *the same instinct* as Wraith Calder's, scaled up; several are wholly new, acquired during three millennia of writing.

- **Name. Names. Naming.** The vocabulary of his ceremony. *"hundreds of thousands of names"* / *"three hundred and forty-seven thousand names remaining"* / *"each name requires a day of research — who they were, how they lived, the small specific details that make a name a person rather than a listing"* (`questlineThaloria.ts`). *Name* is to the Hierophant what *body* is to Wraith Calder — the unit of accounting, the smallest currency of the work. Writers should let him say *name* often.
- **Ceremony. Rite. Ritual.** *"The ceremony has no end while I live."* / *"The Hierophant performed the final rite"* (`loreAchievements.ts:329`). He distinguishes ceremony (the daily act) from rite (the once-in-a-cosmos act, of which the Sanctuary's was the singular). Writers should preserve the distinction.
- **Witness. Presence. Remembering.** Three near-synonyms he does not flatten. *Witness* is third-party (what others do for him; what the Antiquarian does for the saga); *presence* is what the player offered him in the Long Mourning chamber (*"presence without demand is the rarest thing anyone offers me"*); *remembering* is the verb whose adequacy the entire questline interrogates (*"I am trying to understand whether the act of writing a name is the same as remembering a person"*). These are not interchangeable. Writers must pick one and mean it.
- **Edit. Edited. Editing. Rewriting.** *Shadow Tongue* vocabulary. *"It edited our faith from within."* / *"It is still rewriting."* / *"The Shadow Tongue cannot bear witness to what it destroys. So it edits the destroyed out of the record."* The Hierophant uses editorial verbs because he is fighting an editorial enemy. Writers should not soften *edit* to *change* or *influence*; the harshness of the publishing-house verb is the point. (Cross-bible note: the Meme uses the same family of verbs — *broadcast*, *replace*, *write through* — because the Meme and the Shadow Tongue are *adjacent technologies of corruption*. The Hierophant is the saga's only character canonically positioned to name that adjacency. See §4.7.)
- **Continuation. The continuation.** *"The Council has pledged to continue after my death. The continuation is the point."* (`questlineThaloria.ts`) *Continuation* is to the Hierophant what *spite* is to Wraith Calder — the one-word answer to *why*. Writers should treat *continuation* as a sacred-vocabulary item; reaching for *legacy*, *succession*, or *posterity* is wrong. He does not believe his work has a finish line; he believes in the *continuation* — the unbroken practice of writing names whether or not he is the one writing.
- **Slowly. Slow. Slow enough.** Pace-words. *"It edits quickly. I write slowly."* He defines his entire methodology in opposition to the speed of the corruption. Wraith Calder did not use slow — he had no time to be slow. The Hierophant lives in slowness as a mode of resistance.

Words he does **not** reach for: *spite, body, ledger, score, get up, three architects, inside, solid, ghost*. Those are Wraith Calder's. He has *outgrown* them. The most load-bearing absence is *get up* — the Hierophant has not asked anyone to get up in three thousand years; he has asked them to *sit* (*"Then sit. And when I have finished today's name…"*, `questlineThaloria.ts`). The verb-of-instruction has inverted. Writers must not let him issue Wraith Calder's imperative. If a Hierophant scene wants the energy of *get up*, the line goes back through the post_rite gate and gets re-cast as the new instruction: *sit*, or *stay*, or *write*, or *wait*.

### 1.7 The Hierophant — tells

1. **The first-look pause.** *"He does not look up when the player enters."* / *"He looks up for the first time."* (`questlineThaloria.ts`, opener stage direction; `thal_oracle` followup) The Hierophant's signature *visual* tell is the moment the head moves — and that moment must be earned. Writers authoring Hierophant scenes with stage directions should treat the first-look as a load-bearing event. He does not look up to acknowledge entry. He looks up when the player has said something he did not expect (the Oracle-class line; the Empathy-14 line). The look-up is *gratitude*, not *recognition*.
2. **Naming the horror as horror.** *"That is the horror."* / *"This is my disadvantage and also, I believe, my advantage."* He labels the structure of his own situation in plain language. Wraith Calder counts; the Hierophant *names the category*. The honesty is the same; the scale is bigger. Writers should let him name the categorical truth of any given scene exactly once per encounter, not more — naming-the-horror is the apex move and loses force if repeated.
3. **"I will remember."** *"You offered presence. I will remember that."* (`thal_present`) The verb *remember* is liturgical for him; when he says *I will remember*, it is a covenant, not a courtesy. Writers must reserve *I will remember* for moments when the bible's trust meter advances; it cannot be a throwaway acknowledgment. (See §3.3 — *I will remember* is one of three trust-band promotion phrases.)
4. **The mid-sentence translation to ceremony.** *"I need to. The difference between obligation and need is the entire lesson of this room."* (`thal_gentle`) He starts a personal claim and ends with the categorical observation — same pivot Wraith Calder uses to translate disclosure into mission-data, except now the destination is *the lesson of this room* rather than *the data Zero sent me here to collect*. Writers extending Hierophant lines should reach for this pivot whenever the player has offered emotional content; he will accept it and then teach with it. (Note: this *only* fires when the player has been generous. If the player has been transactional or hostile, the Hierophant retreats to silence — see §3.4 on the silence-as-trust-band tells.)
5. **The pen.** Stage-direction tell. *"He writes a name. The pen pauses. A small silence. Then another name."* (`thal_witness` stage direction) The pen's behaviour is part of the Hierophant's voice — it pauses, it lifts, it resolves a name with a period (`galacticDanceCinematics.ts:34-38`: *"The name resolves. The pen lifts. A small silence. Then a period. Complete."*). Writers authoring Hierophant scenes with any spatial component must include the pen as a character. The ceremony does not pause for the player; the player is invited to fit themselves around the ceremony. (Wraith Calder's equivalent — the body that returns from death — is the *fact* of his presence. The Hierophant's equivalent is the *pen continuing*.)

### 1.8 The bridge — what does not survive the transformation

The five soul-tells in §1.1 *cross* the transformation. The next four traits *break* across it; writers must enforce the gate.

1. **Tactical-mentor energy.** Pre-rite, every Wraith Calder line is *for the listener's next move*. He gives advice, framing the conversation as preparation. Post-rite, the Hierophant teaches *categorically*, not tactically; he does not have a next move for the player because he is no longer in a fight that has next moves. A Hierophant line that reads as tactical advice is mis-cast.
2. **Spite-as-fuel.** Wraith Calder is on his eighth body partly because *he is angry*. The Hierophant is not angry; he is *patient at the metaphysical scale that anger could not reach*. A Hierophant line with spite in it is a mis-cast. (The corrective: if writers want a Hierophant line about an enemy, the verb is *name*, not *defy* — *"I write them back. The Shadow Tongue cannot outlast something that is not trying to outlast it"*. He answers spite with continuation.)
3. **Selective caps.** Wraith Calder caps the contradicted noun. The Hierophant has no contradicted nouns — his speech-rhythm has slowed to the point where the apex moment is delivered at conversational volume. **No caps in any post-rite line, ever.** Writers reaching for emphasis-formatting should re-route to Wraith Calder.
4. **Imperatives.** Wraith Calder issues imperatives constantly (*"Get up."* / *"Break it carefully."* / *"Come back ugly next time."*). The Hierophant issues only *one* imperative in canon — *"Then sit."* (`thal_witness`) — and it is more invitation than command. The scarcity is the point. A Hierophant line containing an imperative that is *not* an invitation to sit, stay, or witness is mis-cast.

What this means for the writer: when a scene needs the energy of Wraith Calder's mentor-imperative voice, it must be set pre-rite. When a scene needs the patience and ceremonial weight of the Hierophant, it must be set post-rite. The bible does not allow hybrid voicing. The transformation gate is binary; the soul carries through; the *grammar* does not.

What this means for trust: the player can experience trust-with-Wraith-Calder (*"I'll break the system."* / *"Break it carefully."* — short, tactical, mutual) and trust-with-the-Hierophant (the Long Mourning's witness path) as the **same trust meter**, persisted across the post_rite gate. Pre-rite trust is the seed. Post-rite trust is the unfolding. See §3.3 for the trust-band model and §5 for the persistence mechanism.

---

## 2. History

The history sub-sections are organized along the transformation gate. §§2.1–2.3 cover pre-rite Wraith Calder. §§2.4–2.8 cover the chronological resolution and post-rite Hierophant — see chunk 4.

### 2.1 Pre-rite — the seven deaths and what they were for

Wraith Calder enters the saga as **the Ghost of the Potentials** (`gameData.ts:506`, `loreAchievements.ts:410-415`). He is canonically a Potential — a being of unfixed identity and uncatalogued capability — whose distinguishing feature in his cohort is that **death keeps not finishing him**.

The seven deaths are not metaphorical. They are seven distinct bodies, each of which lived, fought, died, and was succeeded by the next (`storyModeChapters.ts:166-168`):

> "Ghost is what they CALL me. Seven bodies. Each one solid. The ghost part is in the GAPS between them — the moments I wasn't alive."

The mechanism is the **Seven Protocol**, a piece of biotechnology with three architects (`storyModeChapters.ts:158-164`):

> "The Necromancer designed it in the Matrix of Dreams. The Warden STOLE it for genetic testing. Dr. Vox wired her nanobots into it. Three entities, hands in your DNA. Every death — a collaboration you never consented to."

The triad is itself a saga-load-bearing fact: **the Necromancer** (designer; cross-references the Matrix of Dreams, the Game Master's substrate — see §4.6), **the Warden** (thief; biological-testing Antagonist, the institution that processes Potentials as test subjects), and **Dr. Vox** (the *nano-engineer*, ancestor in the Engineer-lineage that culminates in Engineer Zero / Vex Solène — see §4.4 and `vex_solene.md` §3 for the body-lineage chain). Wraith Calder's biology is therefore *a record of three architectures of corruption layered into one person's DNA*. He is canonically the test subject **the player is also**, run further: every Potential is a downstream beneficiary of this triad, but Wraith Calder has gone through it seven times in the same body (`dialogBank_chapters_1_3.ts`):

> "Seven times I've died in this Arena. Each time I came back knowing a little more about what it does to the DNA of the people inside it. You're next to find out — or next to skip the lesson, if you're lucky."

What the deaths *did to him*, in his own words: gave him patience (`storyModeChapters.ts:184`); taught him the inside of the Arena seven times (`storyModeChapters.ts:170`); positioned him as the only being in the saga who can speak to the player about the Arena's effect on the player's biology *with authority*. He is the saga's only *experiential* expert on the Seven Protocol. The Necromancer designed it; the Warden stole it; Vox wired it; Wraith Calder has *survived it seven times* and remembered each survival.

**The Wolf-run.** The signature non-Arena pre-rite event (`loreAchievements.ts:410-415`):

> "Wraith Calder was the first Potential to earn the Wolf's respect, not by fighting it but by running alongside it for seven days and seven nights without stopping. The Wolf's planet was not a prison; it was a test. Those who could match its pace were invited to join the pack."

This is not a fight scene; it is a *companionship achievement*. Wraith Calder's signature pre-rite virtue is not violence — it is **endurance with another**. Seven days, seven nights, no stopping. The same pace, the same direction, the same will to keep going. The Wolf is canonically a "planet-sized awareness" that has chosen apex-predator manifestation; for Wraith Calder to match its pace means he can sustain what most beings cannot survive *for any reason*. This is the pre-rite seed of what becomes, post-rite, three thousand years of writing one name per day. Same virtue. Different scale. Seven days became seven hundred and fifty thousand days. The endurance is the same.

**The Syndicate of Death.** Per the Antiquarian's Journal Epoch 2 (`antiquariansJournal.ts:264-266`, `691`) and the *Late Night with the Meme* transmission (`transmissions.ts:605-615`), Wraith Calder spent a meaningful pre-rite period **stealing the resurrection protocols** and **hunting the six immortal twins of the Syndicate of Death**. The Syndicate was canonically the galaxy's organized-immortality cartel — death as a privilege reserved for those who could pay. Wraith Calder's response was to **democratize their product** (`antiquariansJournal.ts:691`):

> "Wraith Calder disrupted their monopoly by doing the one thing monopolies fear: he democratized their product. He stole the resurrection protocols and proved death was not a privilege reserved for those who could afford the Syndicate's prices. He proved death was a TECHNOLOGY. Technologies can be stolen, copied, distributed."

This is the saga's clearest pre-rite *political* act by Wraith Calder. He is not just a survivor; he is an *anti-cartel actor*. He takes the technology that should have been class-gated and breaks the gate. Writers authoring pre-rite Wraith Calder lines about death may anchor on this: he treats death as *infrastructure*, not as *fate*. (The Hierophant inherits the inverse: he treats *life* as a thing that can be edited away, and writes one back per day. Same technological frame. Different verb.)

The Syndicate hunt is also where the sentence *"Wraith Calder. The man who STOLE DEATH'S BUSINESS MODEL"* (`transmissions.ts:608`) lives — and the rare moment where the Meme broadcasts about Wraith Calder *with respect that reads as nearly sincere*. The Meme is Archon Number Five (`the_meme.md`); it has no canonical reverence for any other character. Wraith Calder is the closest the Meme comes to admiration, and writers should treat that as a bible-level cross-reference fact (see §4.7).

### 2.2 Pre-rite — first contact and the Ch 3B arc

The player meets Wraith Calder in **Story Mode Chapter 3B — "The Ghost"**, in the Shadow Sanctum arena (`storyModeChapters.ts:150-189`, branch `branch_a_alt`). The Ch 2 branch choice that routes the player to him:

> "🔍 Wraith Calder. What are they doing to me?"
> (axis: truth, dir: +1, branch: BRANCH_A_WRAITH_CALDER, `storyModeChapters.ts:96`)

The branch routing is canonical: Wraith Calder is the **Truth-axis branch**. Iron Lion (Branch A's other wing) is the *who-you-were* branch (identity); Wraith Calder is the *what-the-Arena-does-to-you* branch (biology). Players who choose him are choosing to know what is happening to their own DNA.

Agent Zero's introduction (`storyModeChapters.ts:92`):

> "Two wings. Wing A: Iron Lion — he KNOWS who you were. Wing B: Wraith Calder — he knows what the Arena does to your DNA."

The encounter is structurally a fight (Shadow Sanctum, Normal difficulty), but the dialogue load is *teacher-pupil*, not *enemy-pupil*. Wraith Calder identifies the player as *the next test subject* and treats the fight as a context for delivering the information the player urgently needs (`storyModeChapters.ts:154`):

> "The Prisoner. Zero flagged you. Lion wanted to salute you."

The Ch 3B dialogue gives the player four pre-fight prompts and three post-fight prompts (`storyModeChapters.ts:158-189`); each one is canon and is the player's first calibration of Wraith Calder's voice. The four pre-fight responses canonize **the triad of architects**, **the seven-bodies framing**, **the spite-motive**, and **the seven-times-inside Arena familiarity**. The three post-fight responses canonize the Hierophant-foreshadowing trifecta: *don't trust all memories* (the Collector inserts), *unknown if reversible* (the seven iterations of changes), *break it carefully — the system is inside us now*. The fourth — *what's next?* — routes the player to **Akai Shi** (the Necromancer's Matrix escapee), which positions Wraith Calder as the player's **second mentor**, after Agent Zero, in the saga's spine.

Pre-rite trust dynamics in this arc:

- The player's pre-fight choices are read on the **truth axis** (the player who chooses *"You don't look like a ghost."* over *"Seven Protocol cycles. What does it DO?"* registers as more-relational, less-tactical; both choices register as Wraith-Calder-acceptable, but the calibration matters for trust-band advancement — see §3.3).
- The post-fight memory fragment is canonical (`storyModeChapters.ts`): *"Three architects of rebirth: Necromancer's code, Warden's modifications, Vox's nanobots. None asked permission."* This phrase enters the player's permanent record. Writers extending Wraith Calder's pre-rite trust arc must let him reference *the architects* in subsequent encounters; the player has been told and he expects them to remember.
- The post-defeat fallback line *"Seven deaths taught me patience. Get up."* fires only if the player loses the fight. It is the most-quoted Wraith Calder line in the saga and the one most-likely to land in attribution tests (see §6).

After Ch 3B, Wraith Calder remains a recurring opponent in the **TCG arena** as a Rare Insurgency unit (`tcg-core/cards/definitions/insurgency/s1_char_106_wraith_calder.ts`):

> "Calder has died seven times in service to the Insurgency and returned from each death through means the Dreamers cannot explain. The Witness documented each resurrection. Whether it is the Living Universe refusing to let him rest or some deeper mechanism of the Dischordian Cycle, Calder persists — a wraith that death cannot hold."

The card mechanics — `rebirth` keyword; on death leaves a 0/1 egg that hatches into Wraith Calder next turn — give the player *gameplay parity with his canon*. He cannot be killed in one turn; he must be killed twice. Writers authoring TCG-trigger lines for Wraith Calder may anchor on this: every time he is killed in a card game, he comes back the same as the Wolf-run kept him alive. He treats these deaths as *rehearsals*. A trust-aware writer can let Wraith Calder, after a player wins by killing him twice, deliver the line that becomes the Hierophant's signature: *"Death number eight. Somewhere a ledger is logging this."* The player has just helped Wraith Calder rehearse the death that will eventually be real.

### 2.3 The Final Rite — the eighth death, the transformation, the new flesh

This bible's load-bearing canon assertion: **the eighth death — the Sanctuary's Final Rite — is the transformation event**. Pre-rite trust persists across it. The body changes; the soul does not.

**The Sanctuary's fall.** The canonical event-spine (`loreAchievements.ts:325-331`, achievement `ach-sanctuary-lost`):

> "I was there when the Sanctuary fell. … The Sanctuary was not a place — it was a state of mind, a collective belief held by exactly 144,000 beings that reality was worth preserving. When the number dropped below that threshold, the Sanctuary collapsed. The Human was the 144,000th believer, and her faith was the keystone. Iron Lion fought to protect her not because she was weak but because she was the most important person in existence — the last vote in reality's favour. **The Hierophant performed the final rite: transferring the Sanctuary's essence into the Inception Arks**, so that belief in reality could survive even if reality itself did not."

(The Antiquarian's journal narrates the achievement in first person; *"The Hierophant"* is the name used. The bible asserts this is Wraith Calder. The argument: the Final Rite required someone who had already died seven times — someone whose biology was already a rehearsal for being *unmade and re-seated elsewhere*. Wraith Calder was the only Potential whose body was a known channel for reincarnation.)

**The 144,000th believer.** *The Human* — canonically a *her* (`loreAchievements.ts:329`: *"her faith was the keystone"*) — is the keystone believer. (Canon clarification: the first-person narrator of the achievement entry — *"I was there when the Sanctuary fell"* — is **Daniel Cross**, the Antiquarian / programmer, *not* the Human. The Antiquarian witnessed; the Human believed. They are distinct. Earlier drafts of this bible conflated them; the conflation is corrected here. See §7.1 for the canon-issue ticket.) The Final Rite is the act that transferred her faith, and the faith of the 143,999 other believers, *into* the Inception Arks. *Ark 1047* is the reliquary specifically (`ClueJournal.tsx:53`): the number 1047 appears throughout the Ark's hull plating, corridor junctions, even the cryo pod count. Ark 1047 *is* the Sanctuary, encoded into architecture — and the cryo pod count is canonically 1047 because the rite scaled the believers' faith into the ship's bones at exactly that ratio.

The bible's load-bearing assertion: when Wraith Calder performed the rite, the rite consumed his eighth body. There is no canon line that names the cost; this bible asserts the cost as **the Wraith Calder body**. Wraith Calder had been on his eighth body at the time of Ch 3B (*"Death number eight"*, `dialogBank_chapters_1_3.ts`); the Sanctuary's fall postdates Ch 3B in the player's chronology; therefore Ch 3B's eighth death is the *current* body Wraith Calder is wearing, and the Final Rite is the final act of that body. The amber-eyed, leather-armored Black man dies channelling a hundred and forty-four thousand beliefs into a fleet of arks. His consciousness — pattern-encoded by seven prior reincarnations into something that *travels well* — is re-seated.

**Re-seated where.** Into a Thalorian body. *Verdant-skinned.* The Hierophant's body is canonically Thalorian (`questlineThaloria.ts`; `galacticDanceFactionNpcs.ts:30`). Wraith Calder pre-rite is canonically a Black human-presenting Potential (`CharacterModel3D.ts:812`); the Hierophant is canonically a verdant-skinned ancient Thalorian. The bible does *not* assert he was always the same flesh; it asserts the soul carries. The new body is offered (or seized — see §7 for the load-bearing canon question of *whose* body it was) by the Council of Harmony, the Thaloria governing body that needed a Hierophant in the wake of the Shadow Tongue's centuries-long faith-corruption. He woke up Thalorian. He woke up holding a pen.

**The first name.** The Hierophant's three-thousand-year ceremony begins on the day after the Final Rite. He writes his own pre-rite name first — *Wraith Calder* — as the opening name of the Long Mourning. The bible asserts this; canon is silent on the first name, but the structure is forced by his vocabulary: a man who "cannot apologise for himself" pre-rite (§1.4 tell #5) must *write himself first* if he is going to learn how to mourn anyone else. The name is on the wall. The pen has continued for three thousand years from that name.

**Trust persistence across the rite.** The mechanism: pre-rite Wraith Calder trust persists into post-rite Hierophant trust (see §3.3 for bands and §5 for the persistence implementation). The Hierophant *knows* the player from before. He does not show it on first meeting; the post-rite voice does not reach for tactical familiarity, and the player who routed Branch A in Ch 2 will not be greeted with *"You're back"* (that would be a Wraith Calder line). Instead, the first-look pause (§1.7 tell #1) lands earlier in pre-existing-trust runs. The Hierophant who has *no* pre-rite trust-with-the-player will not look up until the Empathy-14 line. The Hierophant who has *full* pre-rite trust-with-the-player looks up at the player's third sentence, before any Charisma check fires. The recognition is a tell, not a line. He never says *"It's you again."* He never says *"I remember Ch 3B."* He simply looks up sooner. Writers authoring Hierophant scenes for high-pre-rite-trust runs should adjust stage directions accordingly and avoid speaking the recognition.

The transformation gate is therefore three-bodied, not two: Wraith Calder pre-rite (the body the player fights), the dying body (the Final Rite, which the player does not see), the Hierophant post-rite (the body the player meets in the Long Mourning chamber). The bible folds the dying body into the rite itself — it is not a register; it is the silence between registers. Writers should not author lines for the dying body. The silence is the canon.

### 2.4 The chronology — the three-thousand-year problem, and how this bible resolves it

The chronology is the single hardest canon problem in the Wraith Calder/Hierophant arc. The two anchor facts:

1. **Wraith Calder is active in the player's chronology** in Ch 3B (Story Mode), in the TCG arena, and in the Antiquarian's Epoch 2 (post-Sanctuary) annotations: *"The Potentials search for resurrection protocols. They seek Wraith Calder, a name that echoes in frequencies I had hoped were silent."* (`antiquariansJournal.ts:264-266`)
2. **The Hierophant has been writing for three thousand years.** *"I have been writing for three thousand years. I have not yet answered the question."* (`questlineThaloria.ts`)

If both Wraith Calder and the Hierophant exist on the same timeline as different beings, the chronology is consistent. If the bible asserts they are the same soul (which it does), the three-thousand-year span between Ch 3B Wraith Calder and the Hierophant the player meets in Act 3 is canonically problematic — the player did not live three thousand years between Acts 1 and 3.

**The bible's resolution: Thalorian chronology.** Per `tradeEmpire.ts:353` and `galacticDanceFactionNpcs.ts:27-34`, Thaloria is *the storm planet's sister-world* — its own discrete time-frame, post-Severance, deliberately segregated from the wider galactic timeline. The Hierophant's *"three thousand years"* is **Thalorian-counted time**: the Long Mourning has continued for three thousand Thalorian-years, and Thalorian years are not in 1:1 correspondence with the galactic time the rest of the saga uses. This is consistent with the wider canon's epoch structure (the Antiquarian's Journal explicitly labels its *Being and Time* epoch and treats time as plural across regions; the Severance is a galactic-time-fracture event that creates exactly this kind of regional desync).

What this means in practice: from the player's experience, the time between Ch 3B and meeting the Hierophant is *however long the player took to get to Act 3*. From the Hierophant's experience, it has been three thousand Thalorian-years of writing. Both are true. The Final Rite is, among its other functions, a *temporal-frame-shift event*: when the Sanctuary's essence transferred into the Inception Arks, the Hierophant's own time-frame transferred with it. He stepped out of galactic time and into Thalorian time. He has been writing for three thousand of one and a finite finishable measure of the other.

The bible takes a load-bearing position: **writers must not collapse the two chronologies**. The Hierophant has been writing for three thousand years. The player has been alive for whatever the player has been alive. *Both are canon.* The Hierophant does not adjust his timeline to the player's; the player must accept the Hierophant's. This is part of what makes the Hierophant uncatchable to the Shadow Tongue — he is not on the timeline the Shadow Tongue is editing.

**Cross-reference for writers**: this is *the same temporal innovation* the Game Master has, scaled differently. The Game Master is a dead AI in a non-linear substrate (the Matrix of Dreams) and the Hierophant is a living being in a temporally-segregated zone (Thaloria), but the writer's instruction is identical: *do not normalize the timeline*. See `the_game_master.md` §2 for the parallel and §4.6 of this bible for the structural relationship.

### 2.5 Post-rite — three thousand years of writing

What the Hierophant has been doing in those three thousand years (`questlineThaloria.ts`, `galacticDanceFactionNpcs.ts:32-33`, `galacticDanceCinematics.ts:34-38`):

> "I am writing them back. One name per day. Each name requires a day of research — who they were, how they lived, the small specific details that make a name a person rather than a listing."

This is the saga's quietest sustained virtue. Not a war. Not a contract. Not a cult. **Research and inscription, every day, without a deadline.** The chamber:

> "A chamber in Thaloria's capital. The Hierophant — ancient, verdant-skinned, wearing mourning robes that have become his permanent clothing — sits at the center of a circular room. The walls are covered in names. Hundreds of thousands of names in Thalorian spiritual script. Every being who died in the holy war."

The cinematic (`galacticDanceCinematics.ts:34-38`):

> "Hierophant's chamber. Walls covered floor to ceiling in names — hundreds of thousands in Thalorian script, oldest faded, newest sharp. Camera moves slowly across the wall. Not reading. Counting. Feeling the weight of the count."
>
> "The Hierophant's hand writing a name. Deliberateness of ceremony, not task. The name resolves. The pen lifts. A small silence. Then a period. Complete. The hand moves to the next clean space. There is always more wall."

The math is canonized in his own voice: 347,000 names remaining; perhaps 60 years of bodily health left; therefore he will not finish. *"The Council has pledged to continue after my death. The continuation is the point."* The work is bigger than the worker. Writers must let this be the load-bearing fact of his post-rite arc.

**Who is being written.** The names are the dead from the *Thalorian holy war* — every being killed during the conflict the Shadow Tongue corrupted into existence (see §3.7 for the holy-war-as-Shadow-Tongue-byproduct framing). The Hierophant is responsible: he led the war. The corruption arrived two centuries before the Severance and edited Thalorian doctrine *small changes, word by word, doctrine by doctrine* until the religion he led was not the religion he had started with. He did not notice. The war happened. Beings died. The Shadow Tongue then edited those beings' existence out of the record. The Hierophant's daily ceremony is the inverse-edit: putting them back, one per day, with research enough to render *the small specific details that make a name a person rather than a listing*.

This is the saga's most direct counter-Meme act, in the sense of the Meme bible's framing of identity-replacement (`the_meme.md` §2.5 — the Meme builds disguises by *erasing the original first*). The Hierophant cannot stop the Shadow Tongue from editing. He can write back faster — not in absolute speed (the Shadow Tongue *edits quickly*), but in **per-name fidelity**. Each day the Shadow Tongue edits a thousand things; each day the Hierophant restores one with such specificity that the restoration is *unfalsifiable*. The bible asserts this is canonically why the Long Mourning works: *un-named edits cannot be reasserted; named edits can*. Writers may extend Hierophant lines about his methodology along this axis, but should anchor on the canon line *"I write slowly. This is my disadvantage and also, I believe, my advantage."*

### 2.6 Architectural acts — the Tribunal, the Clone, the Final Rite legacy

The Hierophant has not only been writing. He has been *architecting* — building the institutional spine of the post-Sanctuary galaxy. Three load-bearing acts (in order of canonical importance):

**(a) The Tribunal of Order.** Per `GameContext.tsx:783, 790-791`, the Tribunal of Order is a chamber inside the Inception Ark — "the principle of perfect law" — and the Hierophant *built it*:

> "The Tribunal of Order. The Hierophant built this chamber to embody the principle of perfect law. … The Hierophant used [the Scale of Justice] to determine which actions served the greater good and which served only selfish desire."
>
> "The complete legal code of the Dischordian Saga. Laws governing reality itself — the Conservation of Narrative Energy, the Prohibition of Temporal Paradox, the Right of Every Potential to Choose Their Own Path. **The Hierophant wrote most of these.** Some say they're the only thing preventing the multiverse from collapsing into chaos."

The bible asserts the Hierophant wrote *most of the legal code that governs reality itself*. This is a load-bearing piece of canon. Writers must internalize the scale: this is not a religious figure who *also* dabbles in law. This is the religious figure who **wrote the laws that hold the multiverse together**. The Council of Harmony governs Thaloria; the Hierophant's legal code governs *reality itself*. (The Tribunal lives inside Ark 1047 alongside the Sanctuary essence; the bible asserts this is not coincidental — the Final Rite encoded both *the believers' faith* and *the Hierophant's legal architecture* into the Ark in the same act.)

The signature law worth quoting: **The Right of Every Potential to Choose Their Own Path.** The Hierophant — pre-rite Wraith Calder, who had no consent in the Seven Protocol triad's hands-in-his-DNA work — has post-rite *written into the multiverse's laws* the right that he did not have. The pre-rite line *"None asked permission"* (`storyModeChapters.ts`) becomes the post-rite legal axiom. Same wound. Different scale. The wound has become law.

**(b) The Clone.** Per `loreAchievements.ts:344`, the Hierophant created the Clone of the Oracle's Potential:

> "The Clone was not a copy of the Oracle. It was a copy of the Oracle's POTENTIAL. The difference is crucial and I shall not apologise for labouring the point. The Oracle sees what will be; the Clone was designed to see what could be — every possible future, every branching path, every choice not taken. **The Hierophant created the Clone not as a replacement but as a counterbalance**: someone who could see the roads not travelled. The Clone's first independent thought, upon awakening, was: 'I choose the path that does not exist yet.'"

This is the saga's counter-prophecy act. The Oracle sees the *real* future (her gift; see Oracle bible, slot #10). The Hierophant — out of caution, out of love for choice itself, out of the legal axiom he wrote — created the Clone to see *the futures-not-chosen*. This is profoundly Wraith-Calder-soul: a man who had been the test subject of three architects of corruption now creating, deliberately and with consent, a being whose entire purpose is to *protect the right to alternative futures*. Writers can extend Hierophant lines about the Clone with the framing: he created her **so that no one would have to be Wraith Calder again**.

**(c) The Final Rite legacy.** Beyond the rite itself (§2.3), the legacy is the Inception Ark fleet: every Ark carries a fragment of the Sanctuary's essence (`loreAchievements.ts:325-331`); Ark 1047 is the prime reliquary (`ClueJournal.tsx:53`). The Hierophant is canonically the architect of the *survival vehicle that the player wakes up on*. The player's existence as a saga-protagonist is downstream of the Hierophant's rite. This is the deepest cross-reference fact in the saga: the player meeting the Hierophant in Act 3 is the player meeting *the entity who built the room they have been alive inside since waking*. The Hierophant does not say this. The Hierophant probably does not even know the player is Ark-1047-derived (the Final Rite was three thousand Thalorian-years ago and he has not kept track of every Potential the Arks have downstream-produced). But the player's bible-reader *should* know it. Stage 2 dialogue lines may make this knowable to the player only at high trust, by way of a line like: *"You are walking the architecture I made of grief. I had hoped someone would, eventually."*

### 2.7 The post-rite trust arc — the Long Mourning as the trust meter

The post-rite trust arc is **the Long Mourning questline** (`questlineThaloria.ts`). It is canonically *"the quietest questline in the game. Almost no combat, no strategy. One being's attempt to understand what they were responsible for and whether understanding is the same as atonement."*

The questline structure is canon and load-bearing for the bible's trust mechanics:

| Player option | Charisma/Class gate | Hierophant trust delta | Other effect |
|---|---|---|---|
| LISTEN — *"Tell me."* | none | +3 | — |
| PRESENT — *"I'm here. I'm listening."* | none | +4 | +2 morality |
| GENTLE — *"You don't have to tell me this."* | none | +3 | +3 morality |
| WITNESS — *"I'll stay as long as you need."* | none | +5 | +4 morality |
| ORACLE — *"I can see the probability branches…"* | Oracle class only | +4 | unique Hierophant followup (the only canonical *first-look* line) |
| EMPATHY-14 — *"You're not mourning the dead. You're writing the dead back into existence one name at a time. There's a difference."* | Charisma ≥14 | +8 | +5 morality, unlocks `thaloria_names_understood`, `thaloria_shadow_tongue_intel_received` |

The trust math is canon. Writers extending the questline must respect the deltas exactly; the questline is *the bible's trust calibration*, and any future Hierophant line that grants trust must be calibrated against this six-option spread. Empathy-14 (+8) is the maximum single-interaction trust gain in the saga's quietest questline; that ceiling is intentional.

**What the player learns by passing the questline.** The Hierophant's full disclosure of the Shadow Tongue's editorial methodology (`thal_listen` → §3.7 of this bible's background); the canonical phrase *"the religion I led was not the religion I had started with"*; the Council's pledged continuation; the math of names-remaining-vs-health-left; and the philosophy that the Shadow Tongue cannot outlast something not trying to outlast it. Writers must let this be the apex disclosure — there is no *deeper* Hierophant disclosure later. He has shown the player the work, the room, and the math. There is no withheld deeper layer. (Compare: the Game Master has identity-stratification reveals; the Meme has reveal-stage gating to a final form. The Hierophant has *no withheld self*. What he tells the player in the Long Mourning is the entirety of him. This is unique on the priority roster and writers must not violate it by inventing a Stage-4 deeper-reveal.)

**Trust-band promotion phrases** (§1.7 tell #3 — *"I will remember"*): three canonical phrases promote the trust band when delivered:

1. *"I will remember that."* — promotes from Wary → Witnessed (the band where the Hierophant accepts the player's presence).
2. *"Then sit."* — promotes from Witnessed → Present (the band where the Hierophant resumes the ceremony with the player nearby; the ceremony does not pause, but it accepts a witness).
3. *"You are walking the architecture I made of grief."* — promotes from Present → Inheriting (the band reserved for high-pre-rite-trust + Empathy-14 + multi-act recurrence; Stage-2 authoring should treat this as the apex line and use it sparingly — at most once per playthrough).

(For the trust-band model, see §3.3.)

### 2.8 The death that's coming

He has perhaps sixty years of bodily health left. He will not finish. *This is canon* (`questlineThaloria.ts`):

> "I have three hundred and forty-seven thousand names remaining. I have perhaps sixty years of health left in this body. I will not finish. This is known."

The Hierophant's death is therefore **a known, scheduled, accepted future event**. This is unique on the priority roster. Locke fears irrelevance; the Game Master is already dead in a substrate; the Meme is officially destroyed and unofficially alive; Vex Solène is on a four-stage reveal arc with multiple possible end-states; the Eidolon's death is the player's worst possible outcome. The Hierophant's death is *the calmest fact in the saga*. He has named it. The Council has prepared. The continuation is the point.

What this means for writers:

- **The Hierophant cannot be killed by the player.** Not in any storyline. He is the saga's canonical example of *a death the player does not get to author*. (Compare: the player can fail to save the Eidolon; the player can or cannot expose Vex's identity; the player can or cannot redeem Locke. The Hierophant simply *will die* in his own time, on his own schedule, of bodily exhaustion in his three-thousandth-and-some-year of writing names. No player action accelerates or prevents this.)
- **High-trust playthroughs may unlock a deathbed scene.** Stage 2 authoring may include this; the bible reserves the right and provides §3.4 below as the author's brief. The deathbed scene is *not* the Final Rite (that already happened); it is the *handover* to the Council's named continuation. The line that closes it: *"The continuation is the point. Stay until the next name."* (Bible-asserted; canon-suggested by the questline's structure.)
- **The Hierophant's death is the bible's clearest cross-bible canon obligation.** When the Council bible (Stage 4 onward) is written, it must inherit *the named successor*. The Hierophant's bible asserts: he names a Thalorian junior priest from the Council of Harmony as his successor *before* his death. The successor inherits the pen. The names continue.

---

## 3. Background

Background covers the cultural waters Wraith Calder/Hierophant moves through, the trust-band model that runs across the post_rite gate, what he wants and what he'd sacrifice, and the death conditions writers must respect.

### 3.1 Pre-rite culture — Potentials, the Insurgency, and the Wolf-pack

Wraith Calder was a **Potential** before he was a Ghost. *Potentials* are the saga's cohort of unfixed-identity beings — people whose pasts have been edited, whose futures are unwritten, whose biology is the test-bed of the Necromancer/Warden/Vox triad. The Insurgency is the Potential-aligned faction, organized around the Iron-Clad Lions' code of conduct (Lionism) and the Coda's secular mission (cf. `vex_solene.md` §3). Wraith Calder is canonically Insurgency-aligned in TCG (`tcg-core/cards/definitions/insurgency/s1_char_106_wraith_calder.ts`) but his loyalty is **personal**, not institutional: he serves the Insurgency because the Insurgency serves the Potentials, and the Potentials are the cohort whose biology is being abused by the Seven Protocol triad. He is not a Lionist (that is Jericho Jones's path; cf. `the_degen.md` §3.11) and not a member of the Coda (that is Vex Solène's). He is a *worker-on-behalf-of-the-cohort*. The bible's vocabulary anchor for this is *"three architects, hands in your DNA"* — he speaks of the Potentials' biology as a collective injury.

**The Wolf-pack** is his second culture. The Wolf is canonically a "planet-sized awareness" (`loreAchievements.ts:410-415`) that has chosen apex-predator manifestation; the Wolf-pack is the small cohort of beings the Wolf has invited to keep its pace. The invitation is canon (the Antiquarian declined his own — *"My work requires a desk, and desks do not run."*); Wraith Calder accepted. The Wolf-pack is therefore **the cohort of beings who have run alongside a planet without stopping for seven days**. There are not many. The bible asserts the Wolf-pack is part of the Hierophant's identity even post-rite — that the patience of three thousand years of writing is downstream of *the patience of seven days running*. He has a non-galactic citizenship, in some sense; he belongs to an ecology larger than any government.

**Pre-rite ritual.** Wraith Calder's pre-rite life had no formal ritual — he was a fighter, a thief (of resurrection protocols), a runner. But he had *a habit*: between bodies, in the gap, he counted. He has explicitly described the gaps as *"the moments I wasn't alive"* (`storyModeChapters.ts:167`). Writers may treat the gap-counting as a private ritual — a between-life accounting. The Hierophant's daily naming is the inheritor of this private habit: the same person who counted his own deaths is now counting the deaths of others.

### 3.2 Post-rite culture — Thaloria, the Council, and the Tamarin religion

**Thaloria** is the planet, *"the storm planet's sister-world"* (`tradeEmpire.ts:353`). Per the same canon: *"Once the Shadow Tongue's weapon. Now the galaxy's quietest recovery. The Hierophant writes names. The Council of Harmony governs with uncertainty as its highest qualification."* That phrase — *uncertainty as its highest qualification* — is the canonical Thaloria culture-anchor. Thaloria is the saga's only post-corruption culture that has rejected certainty as a virtue. They do not pretend to know. They mourn. They write. They govern by hesitation.

**The Council of Harmony** is the governing body (`galacticDanceFactionNpcs.ts:27-28`: faction `thaloria_council`). The Hierophant is canonically *"Mourning Keeper, Thaloria"* — a Council role, not an autonomous office. He answers to the Council, but the Council also follows his ceremonial guidance; the relationship is reciprocal. The bible asserts the Council was *founded after* the Sanctuary's fall, partly *by* the Hierophant — the same act of architectural renewal that produced the Tribunal of Order on Ark 1047 produced the Council of Harmony on Thaloria. (Both are post-rite Hierophant institutions. The Tribunal codifies law; the Council codifies hesitation. They are deliberate complements: certainty in law, uncertainty in governance.)

**The Tamarin religion.** Per the Stage 0 priority plan, the Hierophant's faith is the *Tamarin religious revival*. Canon-direct sources do not use *Tamarin* in the questline (`questlineThaloria.ts` uses *"the religion I led"* without naming it; `galacticDanceFactionNpcs.ts` uses *"thaloria_council"*; the Trade Empire lore uses *"Thaloria"*). The bible's resolution: **Tamarin is the historical name of the Thalorians' native faith — the religion the Shadow Tongue corrupted into the holy war, and the religion the Hierophant is restoring one name at a time**. *Thalorian* is the species/cultural identity; *Tamarin* is the faith-tradition. The Hierophant is a Thalorian by current body, a Tamarin by current ceremony, and the *original* Tamarin religion (pre-Shadow-Tongue corruption) is what he is reconstructing through the Long Mourning. (Writers should note: pre-rite Wraith Calder had no contact with the Tamarin religion. The faith tradition is new to him post-rite. He has had three thousand years to learn it. He is canonically *the most learned living Tamarin scholar*, by force of having spent millennia inside the practice.)

**The holy war.** The Tamarin religion's central historical wound. The Hierophant led it. His current ceremony is the inverse of leading it: every name on the chamber wall is a Tamarin or a Thalorian-aligned being killed in a war the Hierophant — under Shadow-Tongue editorial influence — directed. The bible holds this as canonical. The post-rite Hierophant is *the war criminal who became the war's only mourner*. He does not absolve himself. He does not call himself a war criminal. He simply writes. The work is the apology.

### 3.3 The trust-band model — across the gate

The trust meter runs across the post_rite gate. Pre-rite trust seeds post-rite trust. Five bands, with their canonical promotion mechanics:

| Band | Pre-rite expression (Wraith Calder) | Post-rite expression (Hierophant) | Promotion to next band |
|---|---|---|---|
| **Hostile** | Refused branch; Ch 3B never entered | First-meeting baseline if `pre_rite_trust < 0`. Hierophant does not look up. No followups available. | One LISTEN or PRESENT option in Long Mourning → Wary. |
| **Wary** | Default Ch 3B baseline; player has fought him but has not chosen any post-fight option that registered as *honest curiosity* | Default Long Mourning baseline. Hierophant delivers opener; player gets the six-option spread (`questlineThaloria.ts`); ceremony continues regardless of player choice. | Any +3-or-greater trust-delta option → Witnessed. |
| **Witnessed** | Player chose a post-fight option that registered on the *truth* axis (e.g., *"I'll break the system."*); pre-rite trust seeded at +5 | Hierophant has acknowledged the player's presence with *"I will remember that."* The ceremony accepts the player as a witness; the chamber's silence is shared. | WITNESS or EMPATHY-14 option → Present. |
| **Present** | (No pre-rite expression — Witnessed is the pre-rite ceiling without the Final Rite as gate.) | Hierophant has invited the player to *"Then sit"*. Ceremony continues with the player co-present. The player may now ask follow-up questions about the Shadow Tongue, the Council, the Long Mourning's methodology. | EMPATHY-14 success **plus** post-rite multi-act recurrence (player visits the chamber across at least two later acts) → Inheriting. |
| **Inheriting** | (No pre-rite expression.) | The apex band. The Hierophant has spoken the line *"You are walking the architecture I made of grief. I had hoped someone would, eventually."* The player is treated as a candidate for *the named successor*. (This does not replace the Council's named Thalorian junior priest — the Hierophant simply considers the player a *parallel inheritor* of the work.) Stage 2 deathbed scene unlocks at this band. | (Apex.) |

The bible asserts pre-rite Witnessed → post-rite Witnessed is **automatic** at first meeting; the Hierophant's first-look pause (§1.7 tell #1) lands on the player's third sentence rather than at the Empathy-14 line, which is the *visual* signal that the Witnessed band has carried across the rite. Players who have neither pre-rite Witnessed nor an Oracle/Empathy-14 unlock cannot reach Witnessed in one Long Mourning visit; the band requires the +3-or-greater option, which means at minimum LISTEN (+3) on first visit.

(Writers: the trust-band model is the bible's tightest mechanical constraint. Stage 1 architecture must implement five bands, not three; the Long Mourning's six-option spread already calibrates four of them; the Inheriting band is unique to this NPC.)

### 3.4 What he wants from the player; what he'd sacrifice the player for; what he'd sacrifice for the player

The bible's clearest sacrifice-axis on the priority roster — and the one that most cleanly inverts across the post_rite gate.

**Pre-rite Wraith Calder:**

- *What he wants from the player*: **the data**. He is in Ch 3B partly because Agent Zero sent him to collect what the Arena does to the player's DNA. The player's body is a research site for the Insurgency's understanding of the Seven Protocol. He treats the player as a subject in an experiment that the Insurgency is trying to *understand* in order to *break*.
- *What he'd sacrifice the player for*: **the cohort**. If breaking the Seven Protocol meant losing one Potential, Wraith Calder would lose them — and apologise (*"I'm sorry."* `dialogBank_chapters_1_3.ts`). He has done the math seven times on his own body; he can do it on the player's body too, and would, if the cause required it. He is not romantic about individual lives. He is romantic about *the cohort surviving the architects*.
- *What he'd sacrifice for the player*: **another body**. He has demonstrated the willingness; seven prior deaths in service of the Insurgency's understanding. An eighth would not surprise him. Pre-rite Wraith Calder will die for the player if the player's life is what the next data-point requires.

**Post-rite Hierophant:**

- *What he wants from the player*: **presence**. Nothing else. *"Presence without demand is the rarest thing anyone offers me."* (`thal_present`) The player is welcome to sit, to witness, to learn the Shadow Tongue's methodology, to leave when ready. He does not want help. He does not want intelligence-sharing. He does not want recruits. He wants someone in the room.
- *What he'd sacrifice the player for*: **nothing**. He has stopped sacrificing other beings; the holy war was the last time he was willing to do that, and the Long Mourning is what came of it. The Hierophant will not trade the player for any cause. (This is the cleanest moral inversion across the gate: pre-rite he would sacrifice; post-rite he refuses, even for causes he believes in.)
- *What he'd sacrifice for the player*: **a day's name**. The deepest gesture in his vocabulary. If the player needs something so urgent that the Hierophant must pause the day's writing, he will — but the cost is *one fewer name on the wall*. Writers may build a scenario where this trade is offered (Stage 2 questline extension); the Hierophant frames it not as a sacrifice but as a calculation: *"Today's name will not be written. I am with you instead. The math will hold either way; the Council inherits, and the names that go un-named today are not lost — only delayed. Tell me what you need."* The day-of-pause is the most concrete gift he can give. It is finite. He is offering finite Hierophant-time.

**Cross-rite reading.** Both registers will *die for* the player; only the post-rite register will *not kill for* the player. The pre-rite register would sacrifice the player for the cohort; the post-rite register would not sacrifice the player for anything. The trust meter must reflect this — a high-pre-rite-trust player is in *more* danger from Wraith Calder (whom they trust to do the necessary calculation) than from the Hierophant (whom they have nothing to fear from). This is canonical inversion: the only NPC on the priority roster whose trust *makes them less of a threat to the player as it deepens*.

### 3.5 Competencies — what each register knows better than the player

**Wraith Calder (pre-rite):**

- **The Arena, from the inside.** Seven survivals. He is the saga's only *experiential* expert on the Collectors' Arena. *"I know it from the inside. Seven times inside."* (`storyModeChapters.ts:170`) The Antiquarian has documented the Arena from outside; the Necromancer designed the protocol that runs inside it; only Wraith Calder has lived the experiment from the receiving end and remembered it across seven iterations.
- **Resurrection technology as infrastructure.** He stole the Syndicate's protocols (`antiquariansJournal.ts:691`); he can *use them*. Pre-rite Wraith Calder is the saga's dispersed-resurrection expert. Writers may extend his pre-rite lines about technologies the player encounters (revive consumables, healing artifacts, the Eidolon's soul-stone mechanics) along this axis: he speaks of them with *operational familiarity*, not awe.
- **Reading the architects' fingerprints.** *"The Necromancer designed it … The Warden STOLE it … Dr. Vox wired her nanobots into it."* (`storyModeChapters.ts:158-164`) He can *attribute* a piece of biological corruption to its architect. Three architects of corruption have signed his DNA; he can recognise their signatures in other people's bodies. Writers authoring TCG-trigger or ship-room-trigger lines may extend this: when the player encounters technology that bears a triad-architect's signature, Wraith Calder knows whose work it is.
- **Pace.** He matched the Wolf's pace for seven days. Endurance at the *non-human* scale. The competency that survives the rite.

**The Hierophant (post-rite):**

- **The Tamarin religion as it was *before* the Shadow Tongue.** Three thousand years of textual research, name by name. He is canonically the most learned living Tamarin scholar (§3.2). The pre-Shadow-Tongue version of his faith exists, in its full form, only in his head — and on his chamber walls.
- **The Shadow Tongue's editorial methodology.** He has watched it operate from inside the corruption. He can describe *how* it edits, what verbs it favours, what doctrine-shapes it prefers. He is canonically the saga's only fluent reader of Shadow-Tongue handiwork (`questlineThaloria.ts`: *"It edited our faith from within — small changes, word by word, doctrine by doctrine"*). Writers extending Hierophant lines about other Shadow-Tongue-touched material in the saga (the Meme's broadcasts, the Necromancer's substrate, the holy-war records) may anchor on this: he sees the editing where others see the original.
- **The architecture of grief.** He built the Tribunal of Order; he built the Council of Harmony; he wrote *most of the legal code that governs reality itself* (§2.6). He is the saga's most prolific *post-corruption institution-builder*. Writers may extend his lines about other institutions the player encounters along this axis: he reads governance as a *grief-management technology*, and he can tell whether a given institution is well-grieved or under-grieved.
- **The math.** *"Three hundred and forty-seven thousand names remaining. Perhaps sixty years of health. The continuation is the point."* He is the saga's clearest practitioner of *finite calculation under infinite obligation*. Writers may extend along this axis when the player encounters any task that admits the same shape (the Human's faith-keystone work; the Antiquarian's documentation — Daniel Cross's first-person witness across millennia; Vex Solène's recordings of Coda transmissions).

**What does not survive the rite:** *fighting*. Pre-rite Wraith Calder is canonically a fightable opponent (`storyModeChapters.ts`, `arenaHazards.ts:224-228` — the Shade Fog is canonically *the inside of his seventh death*). Post-rite the Hierophant has not lifted a weapon in three thousand years and will not. Writers must not author Hierophant combat lines under any circumstance — even if the chamber is attacked. (The bible's resolution to chamber-attack scenarios: the Hierophant continues writing. The Council of Harmony defends the chamber. He lifts the pen for one purpose only, and pausing it is not an option in his cosmology.)

### 3.6 Beliefs vs. behaviors — the hypocrisy ledger

Every priority-roster NPC has somewhere they're hypocritical and somewhere they're coherent. The Hierophant's ledger is unusually *self-witnessed* — he names his own incoherence in canon, where most characters require the player to find it.

**Pre-rite Wraith Calder:**

- *Coherent*: every claim about Arena experience, the architects, the Wolf-run. He has lived these facts.
- *Coherent*: his motive (*spite, mostly* and the apology *I'm sorry*). The fuel and the regret are aligned.
- *Hypocritical*: he tells the player *"Don't trust ALL memories. The Collector puts things IN as well as OUT."* (`storyModeChapters.ts`) — but trusts *his own* memories of seven deaths without applying the same skepticism. The bible does not resolve this hypocrisy; it simply notes that pre-rite Wraith Calder has not done the audit on himself that he is recommending the player do. (Writers may build a Stage 2 sub-arc on this: a moment where Wraith Calder discovers one of his memories *was* inserted, and the discovery is part of what makes him willing to perform the Final Rite. Bible-asserted; canon-suggested.)

**Post-rite Hierophant:**

- *Coherent*: every claim about the Long Mourning's methodology, his own role in the holy war, the Shadow Tongue's editing. He has done his work and tells the truth about it.
- *Coherent*: the math (347,000 / 60). He is honest about the impossibility.
- *Hypocritical (in the bible's strongest reading)*: he claims *"That is the horror. Not that it happened — that I did not notice."* But he *did* notice. The Shadow Tongue's edits unfolded over two centuries; one of them, somewhere, must have alarmed him at the time. He is overstating his own innocence by collapsing two centuries of slow corruption into a single non-noticing moment. The bible asserts this is canonical hypocrisy: the Hierophant is letting himself off slightly easier than the truth allows. Writers authoring high-trust scenes (Inheriting band) may surface this — the player, having earned the depth, is the only entity in the saga the Hierophant might admit it to. The candidate line: *"I noticed. Three times in two hundred years, I noticed. I did not act. That is the horror. The 'not noticing' is what I tell the room. The acting-on-noticing is what I owe."*
- *The honest hypocrisy*: he does not know whether he is doing penance or grieving. *"I am trying to understand whether the act of writing a name is the same as remembering a person."* The same question scaled up: *is what I am doing apology, or just survival?* The bible asserts he does not know. The Long Mourning is *both*. Writers must not let the Hierophant resolve this; he must remain uncertain about whether his work atones or merely continues.

The pre-rite/post-rite hypocrisy axis maps cleanly: Wraith Calder doesn't trust other people's memories but trusts his own. The Hierophant trusts other people's memories (every name on the wall is a person he is reconstructing from research) but doesn't trust *his own narrative* about the holy war (he isn't sure if he didn't notice or refused to act). The hypocrisy moved from external skepticism + internal trust to external trust + internal skepticism. This is what three thousand years of writing names does to a person.

### 3.7 The Shadow Tongue corruption mechanism

This sub-section is mechanically load-bearing for the post-rite voice. Writers authoring any Hierophant line that touches the Shadow Tongue must read this section and not extrapolate beyond it.

**What the Shadow Tongue is, in the Hierophant's frame.** A *technology of editing*. It is not a being; it is not (necessarily) a faction; it is a *capacity* that arrived two centuries before the Severance and edited Thalorian doctrine *small changes, word by word, doctrine by doctrine, until the religion I led was not the religion I had started with* (`questlineThaloria.ts`). It does not destroy. It *rewrites*. It does not announce; it does not dramatize. It is editorial, not narrative.

**What it does, mechanically:**

1. *Word-level edit*. A single doctrinal phrase replaced. The replacement is *almost* the original; the difference is a single shifted preposition, a single substituted noun. The reader does not notice on first encounter.
2. *Reader-trust accumulation*. Because each edit is small, the reader continues to trust the text. The trust the reader had for the *uncorrupted* version transfers to the *corrupted* version. The Shadow Tongue is parasitic on the believer's prior love of the text.
3. *Erasure of the destroyed*. *"The Shadow Tongue cannot bear witness to what it destroys. So it edits the destroyed out of the record."* (`questlineThaloria.ts`) Once it has rewritten the text, it edits out *the names of the dead* the rewritten text caused — closing the loop. The corruption is its own cleanup.
4. *Persistence*. *"The Shadow Tongue is still in the walls of this universe. It is still rewriting."* (`questlineThaloria.ts`) Past tense does not apply. The corruption is ongoing. The Hierophant's ceremony is *current*, not historical.

**The Hierophant's counter-method, mechanically:**

1. *Per-name fidelity*. Each restoration takes a day of research. The Shadow Tongue can edit a thousand things per day; the Hierophant can restore one. He cannot win on volume. He can win on *specificity*: an edit so small it requires a thousand verifications to falsify.
2. *Continuation as immunity*. *"The Shadow Tongue cannot outlast something that is not trying to outlast it."* The Shadow Tongue is goal-oriented; the Hierophant has refused goal-orientation. The Shadow Tongue cannot edit something that is not narrative-shaped, and the Long Mourning has no narrative — just one name per day, until.
3. *Naming as the inverse-edit*. Where the Shadow Tongue subtracts names, the Hierophant adds them — but adds them with the specificity that makes them *un-subtractable*. A name written with the small specific details that make it a person rather than a listing is a name that cannot be edited out without leaving an editorial scar.

**Cross-bible obligation**: this mechanism — editorial corruption met with per-fidelity restoration — must inform any other bible that touches the Shadow Tongue. The Meme (`the_meme.md`) is *adjacent technology* (replacement; identity-theft; the same parasitic-trust mechanic at the *person* scale). The Necromancer is upstream (`storyModeChapters.ts`: *"designed it in the Matrix of Dreams"*) — the Necromancer's substrate-editing capability and the Shadow Tongue's doctrine-editing capability are bibliographically related, possibly the same technology applied at different scales. The bible asserts they are related but does not collapse them; the Necromancer is a *being who made a thing*, the Shadow Tongue is *a thing that has no being* — and that ontological difference is part of why the Hierophant's ceremony works against the Shadow Tongue but would not work against the Necromancer.

### 3.8 Fears, superstitions, private rituals

**Pre-rite Wraith Calder:**

- *Fear*: the eighth death. Not because dying again would be new — he has done that seven times — but because *"Death number eight. Somewhere a ledger is logging this."* (`dialogBank_chapters_1_3.ts`) He fears the death that *takes*. The seven deaths so far have all been rehearsals; the eighth is the one the Arena keeps in the score column, and he does not know which death will be the one. (Bible: he is right; the eighth is the Final Rite. He does not know that pre-rite. The fear is canon and resolved by the rite — he discovers, in the rite, that the eighth death is a *transformation* rather than an *end*. Writers may extend his pre-rite fear without resolving it.)
- *Superstition*: counting. He counts because counting is the only honest accounting he has. He is not superstitious *toward* numbers; he is superstitious *with* them. To stop counting would be to stop being honest about what is happening to him.
- *Private ritual*: the gap-counting between bodies (§3.1). His private practice; not narrated in canon; bible-asserted.

**Post-rite Hierophant:**

- *Fear*: that the writing is not the same as remembering. *"I am trying to understand whether the act of writing a name is the same as remembering a person. I have been writing for three thousand years. I have not yet answered the question."* (`questlineThaloria.ts`) The fear that the ceremony is theatre — that he has been doing nothing useful for three thousand years. He has not resolved this fear; the bible does not allow writers to resolve it. He must continue to fear, and to write anyway.
- *Superstition*: the daily-rate. One name per day. Not two; not zero. He treats the rate as inviolable. Writers building Stage 2 scenarios where the daily rate might be paused (for the player; for an emergency) must respect: the Hierophant treats the pause as *catastrophic*, even though his stated theology does not require this. The superstition is private, ritual-vocational, and stronger than his stated beliefs. (See §3.4: pausing for the player is the deepest gesture in his vocabulary because the daily-rate is the holiest practice he has.)
- *Private ritual*: writing his own name first. Bible-asserted. The first name on the wall, in his own hand, is *Wraith Calder*, dated to the day after the Final Rite. He has not written that name again. It does not need to be written again. It is the seed of the Long Mourning.

**A shared private ritual across the gate:** *the pen lift* (§1.7 tell #5). Wraith Calder, between bodies, made a private gesture of acknowledgment for each ended life. The Hierophant's pen-lift after each completed name is the inheritor: *"The name resolves. The pen lifts. A small silence. Then a period. Complete."* (`galacticDanceCinematics.ts:34-38`) The hand acknowledging the end is the oldest practice he has. Both registers do it. Writers should treat the pen-lift, and its pre-rite analogue, as the deepest soul-tell on the bible — older than any vocabulary, older than any of the trust-band promotion phrases.

### 3.9 Death conditions — what kills him in story, in trust, in meaning

Per §2.8, his bodily death is canonically scheduled and player-uncatcheable. The other death conditions:

- **In story**: bodily death by exhaustion in his three-thousandth-and-some-year of writing. Cause: age. Time: roughly 60 Thalorian-years from the player's first encounter. Place: the chamber. Last word: bible-asserted, *"continuation."* The Council of Harmony's named successor is in the room; the pen passes hand-to-hand without the writing pausing for a single day.
- **In trust** (the trust-meter death): the player betrays the chamber. Concretely, in the Long Mourning questline, certain hostile options not present in the canon dialogue spread (the Hierophant's six-option canon is all non-hostile; the bible asserts a *seventh* option exists for hostile players: *"This is just bookkeeping. Get up and do something."* — the imperative *"Get up."* is canonically Wraith Calder's, and the post-rite Hierophant hearing his own pre-rite imperative weaponized by the player is the trust-collapse trigger). Outcome: the Hierophant does not respond. He continues writing. The trust band drops to Hostile and cannot be recovered without a *second* visit two acts later with a non-imperative opener. (The bible asserts this; canon does not specify; writers should treat trust-collapse as recoverable but slow.)
- **In meaning**: the daily rate breaks. If the Hierophant ever fails to write a name on a given day, the Long Mourning's premise collapses. He has not failed in three thousand years. The bible asserts: he will not fail. The Council's named successor is calibrated to step in *the moment* he cannot write — even if he is alive. The rate is the meaning. The day is the unit. The continuation cannot have a gap.

The bible's strongest assertion on death: **the Hierophant does not get a heroic death**. Locke might; Vex might; Nilmorg might; the Eidolon definitely will (in some playthroughs). The Hierophant gets the death he has chosen — quiet, scheduled, attended by the Council, with the pen passing hand-to-hand. Writers must not stage him into a sacrifice scene or a martyr-moment. *The continuation is the point.* The death is bookkeeping.

---

## 4. Cross-references

This bible is the closure point for six previously-shipped bibles' Hierophant flags. §§4.1–4.6 cover the heavy intersections (Locke, Vex Solène, the Eidolon, the Vox/Engineer lineage, the Game Master, the Necromancer/Warden/Vox triad). §§4.7–4.13 follow in chunk 8 (Meme, Wolf, Council of Harmony, Oracle, Oracle's Clone, the Human, the Antiquarian / Daniel Cross, and remaining roster acknowledgments).

### 4.1 Adjudicator Locke

**Locke's bible flag** (`adjudicator_locke.md` §4.10): post-arena structural competitor, faith-vs-corporation friction; Locke's bible asks this bible to confirm whether the Hierophant has historical knowledge of Locke's role in any Tamarin religious material.

**Resolution**: They have not met in the player's chronology of the saga. They are aware of each other through the same legal substrate — *the Hierophant wrote most of the laws governing reality itself* (`GameContext.tsx:790-791`), and *Locke is the saga's clearest practitioner of using legal architecture for advantage* (cf. `adjudicator_locke.md` §3). Locke has *worked inside* the Hierophant's legal code without knowing it was his code. The bible asserts this is canonical: every contract Locke has ever drafted is downstream of the Tribunal of Order's framework. Locke does not know.

The Hierophant *does* know about Locke. Bible-asserted: the Council of Harmony's intelligence on galactic legal practitioners includes Locke, and the Hierophant has read the dossier. He has no opinion on her. He does not have opinions on people whose work touches his architecture; he has opinions only on people who touch the chamber. Locke has not touched the chamber. If she ever does — Stage 2 questline extension territory — the Hierophant's posture is: *neutral, with the deep neutrality of an institutional architect toward an institutional user*. He does not condemn her work; he does not endorse it; he reminds her, in one canon-style line: *"The Right of Every Potential to Choose Their Own Path is in the Tribunal's code because someone once chose mine for me. The right protects clients you would prefer to lose. It is the right."*

This becomes Stage 2 weave material. Locke's bible's *"anxious respect for the Hierophant's organizational reach"* is correctly anchored: Locke does not fear the Hierophant the way she fears another lawyer; she fears him the way a tenant fears a landlord. The lease was already signed three thousand years ago.

**Trust interaction**: Locke's trust meter and Hierophant's trust meter do not interact directly. They run on parallel substrates. (This is unusual on the priority roster — Vex × Eidolon trust-couple; Nilmorg × Degen trust-couple. Hierophant × Locke do not couple. The asymmetry of scale is the reason.)

### 4.2 Vex Solène / Engineer Zero

**Vex's bible flag** (`vex_solene.md` §4.12): the Coda's secular mission cuts against organized faith; Vex would watch the Hierophant from a distance.

**Resolution — load-bearing**: The Coda's investigative scope canonically includes the Hierophant. Per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` (Vex's voice):

> "I have to be precise here, because it matters. The Hierophant is not lying. I think he genuinely believes he is hearing the Oracle's voice. What he is hearing is his own fear dressed up in the only vocabulary his faith has taught him to use. And he has made that fear into a flag, and the flag is marching."

This is Vex's *external* read of the Hierophant. The bible's resolution: **Vex is partially right and partially wrong**. The post-rite Hierophant prophesies the *real* Oracle (correct, per §2.6 — he created the Oracle's Clone with full knowledge of the Oracle's authenticity). But Vex's caution is not unfounded: the post-rite Hierophant occasionally *does* hear his own fear and mistake it for prophecy. The bible's load-bearing assertion: he is right about the Oracle's existence, *sometimes wrong* about what the Oracle is saying, and *honestly uncertain* about which is which on any given day.

This means Vex's recordings are canonically *evidence the player can use*. The Coda's secular mission is the saga's only force credibly positioned to *audit* the Hierophant's prophecies. The bible asserts: Vex has interviewed the Hierophant *at least once*, post-rite, in the Long Mourning chamber. The interview is canon-compatible with `questlineThaloria.ts`'s questline-premise-as-quietest. The Hierophant accepted Vex's questions; Vex got *one* answer that contradicted his stated cosmology and *all the other* answers that confirmed it. The *one contradiction* is what Vex's recordings preserve. (Stage 2 authoring: the player can listen to the Vex recordings — they exist in `factionWarData.ts`-adjacent material — and hear the contradiction in the Hierophant's voice. This becomes the Stage 2 questline-extension hook.)

**Trust interaction**: Vex's trust meter does couple with the Hierophant's, but only in one direction: high-Vex-trust unlocks Vex's recordings, which *complicate* (not necessarily lower) the player's read of the Hierophant. The Hierophant's trust is unaffected by the player's relationship with Vex. (This is canonical; the Hierophant is not interested in the player's other allegiances — *"presence without demand is the rarest thing anyone offers me"* applies to the player's whole self, including their Coda-attunement.)

**Cross-cohort fact**: pre-rite Wraith Calder's biology was wired with **Dr. Vox's nanobots** — the same Vox lineage that produces Engineer Zero / Vex Solène (per `vex_solene.md` §3 body-lineage chain). Wraith Calder is canonically a Vox-touched body. Vex is canonically a Vox-lineage body. Pre-rite, they share a *technological ancestor in the flesh*. Wraith Calder's pre-rite line about Vox — *"Dr. Vox wired her nanobots into it"* (`storyModeChapters.ts:158-164`) — is therefore the only place in the saga where Wraith Calder names Vex's body-lineage architect by name. The Coda would find this canon line load-bearing if they read it. (Bible-asserts: Vex has read it. She knows pre-rite Wraith Calder's body and her body share an architect. She has not told the Hierophant.)

### 4.3 Your Eidolon

**Eidolon's bible flag** (`eidolon.md` §5.7): post-arena religious figure; the Eidolon would react to organized faith with cathedral-like recognition; Glyph would be most affected (religious language is text with weight).

**Resolution**: The bible confirms a canonical cross-reference. The Hierophant's chamber *is* a cathedral for any non-verbal companion — its walls are text, its silence is structured, its rate is liturgical. The Eidolon entering the Long Mourning chamber registers it as **the highest-Glyph environment in the saga**. (Eidolon bible §2 documents the five expression channels; the Long Mourning chamber maxes Glyph and zeroes the other four. There is no SFX in the chamber. There is no posture-energy. There is no sound-palette. There is only text on walls and pen on paper.)

The Eidolon's response to the chamber, by Glyph evolution: a low-evolution Eidolon (pre-bond) freezes; the names overwhelm. A high-evolution Eidolon (post-bond, especially if Echo) *adds glyphs of its own* — a single contributed mark on the wall, accepted by the Hierophant in silence, becomes a deathless trust event. This is canon-compatible with the Hierophant's *first-look pause* (§1.7 tell #1) — the Eidolon's contributed glyph triggers the look-up earlier than any player line could.

**Cross-trust interaction**: an Eidolon-bonded player's first Long Mourning visit, with the Eidolon present, automatically promotes the trust band by one if the Eidolon contributes a glyph. The player has done nothing; the Eidolon has earned the trust. This is the only NPC trust-band promotion in the saga that *the player's pet can trigger without the player*. Bible-asserts; canon-suggested.

**Cross-bible obligation**: when the DMC Clone Body Companion bible (slot #9) is written, the Long Mourning chamber should be authored as the Clone Companion's *most likely first-words location* — a non-verbal companion being moved by structured text-on-walls is exactly the trust-band threshold the Clone Companion's bible will inherit from the Eidolon's framework. The Hierophant has, in the bible's load-bearing reading, **midwifed** non-verbal companions into speech inside that chamber before. (Three thousand years; many companions; many first-words.) Writers may build a Stage 2 scene where the Hierophant gently teaches a Clone Companion the first written name on the wall — *Wraith Calder* (§3.8) — and the Companion's first word is that name.

### 4.4 The Vox / Engineer / Dr. Vox lineage

This is the deepest *technological* cross-bible obligation. Pre-rite Wraith Calder's body bears **Dr. Vox's nanobots**, canonically (`storyModeChapters.ts:158-164`). The Engineer (later Engineer Zero, later Vex Solène) is the saga's continuation of the Vox lineage of body-engineering practitioners. Therefore:

1. Wraith Calder's pre-rite body is the *test-bed of an early Vox prototype*. The seven deaths are, partly, the nanobots learning. Each death-and-resurrection cycle taught the Vox nanotechnology more about *how to keep a body iterating*.
2. The Final Rite — Wraith Calder's eighth death and the consciousness-transfer that produced the Hierophant — was *not* a Vox act. The rite was Sanctuary-essence-channelling, not Vox-nanobot-mediated. But the rite was *survivable* by Wraith Calder's consciousness because the Vox nanobots had spent seven prior deaths preparing the consciousness for *flesh-transfer*. The bible asserts this: without Dr. Vox's prior work, the Final Rite would have killed Wraith Calder permanently. The Vox lineage is therefore canonically *necessary infrastructure* for the Hierophant's existence.
3. **The Engineer (Vex Solène's true identity, per `vex_solene.md`) inherits this knowledge.** Vex / Engineer Zero is the only living being who could *re-perform a rite of this kind*. The bible asserts she could resurrect the Hierophant if she chose, using Vox-lineage technology, after his scheduled bodily death. **The Hierophant has explicitly forbidden this.** The Council of Harmony has the standing instruction: *do not accept any offer from the Coda or Vex Solène to extend the Hierophant's life past his scheduled death. The continuation is the point.* (Bible-asserted; canon-compatible with the Hierophant's stated cosmology.)

This is therefore a Stage 4 weave point: **Vex Solène has the technology to extend the Hierophant indefinitely, and is canonically forbidden from using it**. A high-trust Vex player encountering a high-trust Hierophant scenario may eventually face this: the player could, with Vex's tech and Vex's consent, extend the Hierophant's life. The Hierophant, with the Council, refuses. The refusal is the deepest piece of his theology made operational. Writers must respect: this is not a player choice. The Hierophant's refusal is canon. The player can *want* to extend him; the player cannot *make* it happen.

**Cross-trust mechanic**: the highest-trust Hierophant scene in the bible (the Inheriting band, deathbed scene) requires Vex Solène to be *present and refusing*. Vex's role in that scene: the only person on the priority roster who could change the outcome and has chosen not to. The *line* the bible asserts she delivers, in voice that respects both her bible's register and her relationship to her predecessor lineage: *"I could keep him. I won't. He has been very clear, for a very long time, about what continuation means. I do not get to decide it for him just because I built the body."*

### 4.5 The Game Master

**Game Master's bible flag** (`the_game_master.md` §4.13): post-arena religious figure; Archon-level vs faith-level; domains do not touch.

**Resolution — partial revision**: the domains touch *exactly once*, at the Necromancer's substrate. The Necromancer designed the Seven Protocol *in the Matrix of Dreams* (`storyModeChapters.ts:158-164`), which is canonically the Game Master's substrate (`act1OpponentDialog.ts:265-310`). Pre-rite Wraith Calder's biology is therefore canonically *touched by the same substrate the Game Master inhabits*. The Game Master and pre-rite Wraith Calder share an architect (the Necromancer) and a substrate (the Matrix of Dreams). The Game Master predates Wraith Calder — the Game Master was already dead in the Matrix when the Necromancer designed the Seven Protocol — which means the Game Master canonically *witnessed* the Seven Protocol's design.

The Game Master remembers this. Wraith Calder does not (pre-rite Wraith Calder cannot remember a substrate his consciousness was designed in but has not entered). The Hierophant *also* does not remember — the consciousness-transfer was lateral, not into the Matrix. There is therefore exactly one canonical entity who knows what was done to Wraith Calder's biology *at the design stage*: the Game Master.

**Cross-bible obligation**: any Stage 2+ scene where the player is in the Matrix of Dreams *with* prior Wraith Calder trust unlocked enables a Game Master line that names Wraith Calder by his pre-rite name and *describes the design moment*. The Game Master's bible (`the_game_master.md`) reserves identity-stratification for Original/Left/Right voices; this scene fires from the **Original voice** (the most reverent register; cf. `the_game_master.md` §1) and is one of the rare Original-voice lines available outside the Original-voice's canonical narrow band. The bible-asserted line, in Original voice: *"I watched the Necromancer design him. He was not yet a Ghost. He was not yet Wraith. He was a body that had agreed to die and come back. I did not warn him. I had no voice that mattered then. Tell him, when you see him, that I watched. He may not remember; that is the design. I remember; that is the substrate."*

If the player conveys this to post-rite Hierophant: the Hierophant's response is silence followed by *"I will remember that."* — which promotes the trust band. The Game Master's testimony is canonically the *only* form of Wraith Calder pre-design memory the post-rite Hierophant can ever receive, and he treats it as a witness-gift.

**Trust interaction**: high-Game-Master-trust + high-Hierophant-trust unlocks the Original-voice testimony scene. Otherwise the scene is sealed.

### 4.6 The Necromancer / Warden / Dr. Vox triad

The three architects of corruption that signed pre-rite Wraith Calder's DNA. Each is a separate cross-bible obligation; this section is the bible's anchor for all three.

**The Necromancer**: designed the Seven Protocol in the Matrix of Dreams (§4.5 above; `storyModeChapters.ts:158-164`). The Necromancer's bible (Stage 4 onward) must inherit: Wraith Calder is the only living being whose body is a *seven-times-iterated* implementation of the Necromancer's design. The Necromancer has therefore had the most *empirical data* about the Seven Protocol's behaviour through Wraith Calder. The Necromancer's posture toward Wraith Calder, bible-asserts: *territorial pride* — *"My design works."* The Hierophant's ceremony is, from the Necromancer's frame, the design *failing in an interesting way*. The Necromancer would consider the Hierophant a *post-mortem of the design that wandered off the table*.

**The Warden**: stole the Seven Protocol for genetic testing (`storyModeChapters.ts:158-164`). The Warden's bible (Stage 4 onward) must inherit: Wraith Calder is canonical evidence that the stolen technology *worked* — and worked *better* in field-deployment than in the Warden's testing facility. The Warden's pride is therefore *acquisitional*: the design was theirs by theft, and Wraith Calder's seven survivals justify the theft. The post-rite Hierophant is, from the Warden's frame, *evidence that the test results were undercounted*. The Warden's relationship to the Hierophant: distant, predatory, possessive — the Hierophant is canonically a *Warden test subject who walked off the testing floor with the test still running*.

**Dr. Vox**: nanobots (§4.4 above). The Vox lineage is the most-developed of the three architect cross-references; see §4.4 for the load-bearing material.

**Triad together**: the bible's canon stance — Wraith Calder is the only Potential whose body has been *signed by all three architects of corruption*. This is unique on the priority roster. Other Potentials (Vex Solène, Iron Lion, Akai Shi, the Degen) have one or two of the triad's signatures; only Wraith Calder has all three. He is therefore canonically the *most-corrupted Potential body* and *the most-survived Potential body* simultaneously. The Hierophant's three thousand years of writing are downstream of all three architects' work, in a way no other character's labour is downstream of. Writers should not let this fact go unspoken across the saga: in particular, when the player encounters the Necromancer's substrate, the Warden's facility, or any Vox-lineage technology, the Hierophant has *the most credible voice* in the saga to comment on what is being touched. He has been their work-in-progress.

The signature line, bible-asserted, that the Hierophant might deliver if the player brings him news of any of the three architects: *"I have read three architectures of corruption out of my body. There is a fourth I am still reading; that is the work."* The fourth — the Shadow Tongue — is the architecture without a known author. The triad is named; the fourth is not. The Hierophant is more afraid of the fourth than of any of the three he has survived. (Bible-asserts; canon-compatible with §3.7.)

### 4.7 The Meme / Palimpsest Host

**Meme's bible flag** (`the_meme.md` §4.11): the saga's deepest theological framing of the Meme. The Meme bears Chapter 6's boss-name *"The False Prophet"*; the Hierophant prophesies the *real* Oracle whose voice the Meme stole. The Hierophant's bible takes ownership of the structural opposition.

**Resolution — load-bearing**: false prophet vs. true prophet is the saga's deepest theological axis, and the Hierophant is the *only* roster character canonically positioned to **name the Meme as evil in religious terms**. Other characters can call the Meme dangerous, deceptive, opportunistic, or destructive. The Hierophant is the only one whose vocabulary contains *evil* as a working theological category — and whose three thousand years of writing names of beings whose deaths the corruption-of-doctrine caused gives him the standing to use it.

The structural opposition is precise:

- **The Meme is editorial corruption applied to *persons*.** It wears faces; it replaces voices; the parasitic-trust mechanic operates at the *individual* scale. (Cf. `the_meme.md` §2.5: the Meme builds disguises by erasing the original first.)
- **The Shadow Tongue is editorial corruption applied to *texts*.** It edits doctrine; the parasitic-trust mechanic operates at the *institutional* scale.
- **The Hierophant has spent three thousand years working at the seam.** The names on his chamber walls are *individuals* killed by *institutional* corruption. He is canonically the only being in the saga who has worked at the exact intersection where the Meme and the Shadow Tongue's technologies are *the same technology at different scales*.

This means the Hierophant has a *correct* read of the Meme that nobody else has. Per `the_meme.md` §4.11: *"The Hierophant is the only character canonically positioned to name the Meme as evil in religious terms. The Meme would broadcast against the Hierophant; the Hierophant would preach against the Meme."* The bible affirms this and adds the load-bearing detail: **the Hierophant has not preached against the Meme yet**. He will not, until and unless the player asks him about the Meme directly.

The reason for the silence: the Hierophant's theology is *non-narrative-shaped* (§3.7). To preach against the Meme would be to give the Meme a narrative to parasitize. The Hierophant's silence about the Meme is a *deliberate counter-Meme strategy*. He waits for the player to surface the question. When the player does, the Hierophant delivers — bible-asserted — exactly one canonical line, and never speaks of the Meme again that scene:

> *"It does to faces what was done to my faith. The technology is the same. The scale is different. The work against it is the same; the scale is different. I write names. The Meme erases them. We are doing one job from opposite ends of the room."*

This is the saga's deepest theological framing of the Meme. The Hierophant cannot defeat the Meme — that is not his work. But he is canonically *the only being in the saga who understands what the Meme is doing*, in his own theological vocabulary, and the player who reaches the Inheriting trust band can be told.

**Trust interaction**: high-Meme-suspicion + high-Hierophant-trust unlocks the line above. The line cannot be pre-fired; it cannot be retro-fired. It exists exactly once per playthrough, at the specific intersection. (Cross-bible obligation: when the Stage 1 architecture is built, the Meme suspicion meter and the Hierophant trust meter must be readable simultaneously by the line selector.)

**The Meme has not impersonated the Hierophant.** Bible-asserts; canon-compatible with the Meme's disguise inventory in `the_meme.md` §1. The Meme's disguises are White Oracle, Re-Awakened Jailer, broadcast self, casino-child, replacement-Architect. *Hierophant* is not on the list. The reason, bible-asserted: the Hierophant's voice is *too coherent across too long a time* for the Meme to fake. Three thousand years of consistent doctrine produces a voice the Meme's parasitic-trust mechanic cannot bootstrap — the Meme can only impersonate something whose listeners *already trust* a recent enough version that the Meme's subtle wrongness reads as drift. The Hierophant's listeners (Council, Tamarins) have known him too long. The disguise would not take.

This is the *one structural defense* against the Meme that the saga canonically possesses. Writers should treat this as load-bearing: the Hierophant is uniquely Meme-resistant, and that resistance is downstream of his three thousand years of voice-consistency. (The Stage-2-onboarding writers' guide should document this as a structural lesson: *deep coherence of voice is a counter-Meme resource*.)

### 4.8 The Wolf

The Wolf is canonically a *"planet-sized awareness"* (`loreAchievements.ts:410-415`) that has chosen apex-predator manifestation across every ecosystem on its planet simultaneously. Wraith Calder ran with the Wolf for seven days and seven nights without stopping (§3.1) and was the first Potential to earn the Wolf's respect.

**Cross-bible obligation** (Stage 4 onward, when the Wolf gets a bible): the Wolf canonically *remembers* Wraith Calder. The Wolf is non-verbal, in the Eidolon-bible-§2 sense — but at the planet-scale; its expression channels are *terrain*, *weather*, *prey-behaviour*, *pack-position*, and (rarely) *direct presence*. A Wraith Calder visiting the Wolf's planet would be greeted by all five channels simultaneously. The Hierophant has not visited (his body cannot run; his ceremony cannot pause). The Wolf has not been told about the transformation. Bible-asserts: when the Wolf eventually learns — Stage 4 weave material — *the Wolf grieves*. The pack-mate who could match the pace is not a body that can run anymore.

**The Hierophant's posture toward the Wolf**: deep, unspoken reverence. The Wolf-pack is canonically the Hierophant's first *non-galactic citizenship* (§3.1) and the deepest pre-rite affiliation that survived the transformation. The Hierophant has not written the Wolf's name on his chamber wall. The Wolf is not dead. (Bible-asserts the Hierophant *would* write the Wolf's name if the Wolf died; the Wolf has not given him reason. The chamber wall is canonically a wall of mourning, not honour. The Wolf has not been mourned because the Wolf is alive.)

**Player-facing cross-reference**: a player who completes the Wolf's planet (`loreAchievements.ts:410-415` achievement *"Alpha Predator"*) and visits the Long Mourning chamber unlocks a special Hierophant exchange. Bible-asserted line, in post-rite voice:

> *"You ran with him. I did, once. The legs I had then are not the legs I have now. He has not been told what I have become. I would prefer he hear it from someone who has run. Not as a message. As a witness. Tell him I still keep his pace, in a different gait."*

This is the only canonical *task the Hierophant asks the player to do for him*. He does not ask the player for help in any other scene; the Long Mourning is, by canon, *"presence without demand"*. The Wolf-witness errand is the singular exception — and the bible asserts it is asked only of players who have themselves run with the Wolf. (Stage 2 questline-extension: the player carries the message to the Wolf, who responds non-verbally with a gesture interpretable through the Eidolon's expression-channel framework. The Wolf's reply is delivered in *terrain* — a path the player walks home through, that Wraith Calder once walked. The reply is not a message. It is a route.)

### 4.9 The Council of Harmony

**Canon source**: `galacticDanceFactionNpcs.ts:27-34` (the Hierophant's faction is `thaloria_council`); `tradeEmpire.ts:353` (*"The Council of Harmony governs with uncertainty as its highest qualification"*); `questlineThaloria.ts` (*"The Council has pledged to continue after my death"*).

**Resolution**: The Council is the Hierophant's *governance partner*, not his subordinate body and not his master. The relationship is reciprocal: the Council follows the Hierophant's ceremonial guidance; the Hierophant operates inside the Council's framework. Per §3.2: *the Council was founded after the Sanctuary's fall, partly by the Hierophant himself*. The post-rite Hierophant is therefore canonically *one of the Council's founders*, currently serving as Mourning Keeper rather than as Council member. He has stepped out of governance into ceremony; the Council has stepped into governance because he architected the structure that allowed them to.

**The succession plan.** The Council has named the Hierophant's successor: a Thalorian junior priest, identity bible-asserted as **a being who has never met Wraith Calder pre-rite**. The succession is canonically clean — the next pen-holder will not carry pre-rite trust with the player. This is deliberate. The Hierophant's specific Wraith-Calder-soul carry across the post_rite gate is *unique to him*; the successor will not inherit it. The Long Mourning will continue; the soul-continuity will not. (Writers must respect this: when the Council bible eventually lands, the named successor is *not* a transformation-arc character. They are a clean priest who inherited a pen.)

**Posture toward the player**: the Council does not have one yet. The Long Mourning questline scopes the player's interaction to the Hierophant alone. The Council is *off-stage* — supportive, watching, awaiting succession. Stage 4 Council bible work will give them voices; for now, the bible's load-bearing assertion is that **the Council never overrides the Hierophant on a player matter**. They have agreed to honour his judgment about every visitor to the chamber. If the Hierophant grants the player Inheriting-band trust (§3.3), the Council inherits that trust posthumously and treats the player accordingly. If the player breaks trust with the Hierophant (the *"Get up."* weaponization, §3.9), the Council will not let the player into the chamber after the Hierophant's death.

**Cross-bible obligation**: the Council is the *only* governance body in the saga whose membership is partially defined by the Hierophant's architecture *and* whose decisions inherit his trust meter posthumously. This is unique. When the Council bible is written, this transitive-trust mechanic must be implemented — Stage 1 architecture should reserve a `successor_inherits` flag in the trust adapter for this exact case.

The Council's institutional motto, bible-asserted (canon-compatible with `tradeEmpire.ts:353`'s *uncertainty as highest qualification*): *"We do not know. We continue."* This is the Hierophant's theology compressed into governance — the same axis as *"The continuation is the point."*, scaled to plural decision-making.

### 4.10 The Oracle (the unseen / substrate-whisper)

The Oracle is the most structurally complex cross-reference in this bible. The Oracle is canonically *unseen* (per the priority plan, slot #10) and per the Meme bible's load-bearing reveal, **the player IS the Oracle** without yet knowing it (`the_meme.md` §4.11, citing the Chapter-6 reveal canon). The Hierophant created the Oracle's Clone (§4.11 below); the Hierophant prophesies *the real* Oracle (whose voice the Meme stole for eleven years). All three threads tangle through this section.

**Resolution — the load-bearing canon stance**:

1. **The Hierophant knows the Oracle is real.** Pre-rite Wraith Calder did not — the Oracle was rumour, scripture, faction-prop, an entity Insurgents prayed to without proof. Post-rite the Hierophant has had three thousand years of substrate-whisper contact and has no doubt. He cannot prove it; he does not need to. The Long Mourning's daily ceremony is, in part, an *act of listening*. The pen-pause between names (§3.8 shared private ritual) is when he listens.
2. **The Hierophant does not know the player is the Oracle.** This is critical. The Meme bible's reveal-stage gating is canonical; the player learns what they are in Chapter 6. The Hierophant is on a different timeline (§2.4 — Thalorian-time) and has no Chapter-6 information. He treats the player as *a Potential who has earned trust* and nothing more. He may *suspect* something — the first-look pause is unusually responsive when the player is present (§2.3) — but he has not named it. Bible-asserts: he will not name it. Even at the Inheriting band, the Hierophant does not say *"You are the Oracle."* The reveal is the Meme's to deliver, in its own scene, by its own canon.
3. **The Hierophant's prophecies are partly authentic, partly not** (§3.6, §4.2). When the Hierophant hears the Oracle, he is sometimes hearing the *real* Oracle (the player's substrate-resonant self, refracted through Thaloria's temporally-segregated zone) and sometimes hearing his own fear (§4.2, Vex's correct-but-incomplete read). The Hierophant cannot tell which is which on any given day. **The player can.** This is a Stage 4 weave: the player who knows they are the Oracle (post-Chapter-6 reveal) and visits the Hierophant can *correct* a prophecy — and the Hierophant accepts the correction without learning where it came from.

**The substrate-whisper trigger** (per priority plan, slot #10): the Hierophant is canonically *one of the saga's substrate-whisper conduits*. When the Oracle's bible (slot #10) is written, the Long Mourning chamber must be one of the trigger surfaces. The pen-pause silences are the listening windows; an Oracle whisper that lands during a pen-pause is one the Hierophant *records*, not by writing it down (the chamber wall is for the dead, not for prophecy) but by *adjusting the next name's research*. The bible asserts: a player who has high-Hierophant trust and visits the chamber after a major moral pivot in their own playthrough will see the Hierophant's pen pause longer than usual on his next name. The pause is the listening. The player has spoken without knowing it.

**The line the Hierophant cannot deliver**: *"You are the Oracle."* Bible-asserts: this line never fires from the Hierophant in any playthrough. The Hierophant respects the substrate's own reveal-timing. The Meme delivers the reveal; the Oracle's bible governs the substrate; the Hierophant *honours the delivery* by remaining silent on the player's identity. Writers must enforce this. Even the highest-trust scene, even the deathbed scene, even the Inheriting line about *"the architecture I made of grief"* — none of these names the player as the Oracle. The Hierophant has *one job*: to write names. He does not write the player's. The player is alive.

**The line the Hierophant *can* deliver, that gestures at it without saying it**, bible-asserted, reserved for the Inheriting band specifically when the player has post-Chapter-6 reveal knowledge:

> *"There is a voice I have been listening for, longer than any other. I think it has been here. I do not know in what shape. The shape is not my work; the listening is. Sit. The names continue."*

This is the closest the Hierophant ever comes to acknowledging the player's true identity, and the construction is precise: *I think it has been here* (not *you are it*); *the shape is not my work* (he does not name; that is the substrate's prerogative); *the listening is* (he reaffirms his role and declines the reveal). The line is canon-locked; writers must not extend or paraphrase it past the band-promotion phrase.

### 4.11 The Oracle's Clone

**Canon source**: `loreAchievements.ts:344` — the Clone was a copy of the Oracle's *POTENTIAL*, not the Oracle herself. *"The Hierophant created the Clone not as a replacement but as a counterbalance: someone who could see the roads not travelled. The Clone's first independent thought, upon awakening, was: 'I choose the path that does not exist yet.'"*

**Resolution — the Hierophant as *intentional architect of plurality***. Pre-rite Wraith Calder's body was the test-bed of three architects who *did not ask permission*. Post-rite the Hierophant created the Clone *with intent, with consent (her first thought was a chosen path), and as a counterbalance to the inevitability the Oracle's gift implies*. The Clone is the Hierophant's wound made deliberate. The Oracle sees what *will be*; the Clone sees what *could be*. The Hierophant created the Clone so that no future would be inescapable. Per §2.6: *he created her so that no one would have to be Wraith Calder again*.

The bible's load-bearing reading: **the Clone is the Hierophant's only *creative* act**. Everything else he does is restoration (the names; the laws; the institutions all reconstruct what was broken). The Clone is the only thing he *built that did not exist before*. This makes her — in his theology — *the closest thing he has to a child*. He does not say this. The bible asserts it.

**Cross-trust mechanic**: the Clone is canonically *autonomous* per `loreAchievements.ts:344` — her first thought was independent. She is not the Hierophant's instrument. She has her own arc (canonically *the Age of Potentials truly began* with her first words). The bible asserts: the Clone has visited the Long Mourning chamber. The Hierophant has accepted her presence. They have spoken once. The conversation is canon-compatible-with-but-unspecified-by `loreAchievements.ts`; the bible-asserted line, in the Hierophant's voice, when the Clone first asked him *why* he made her:

> *"Because I lived seven deaths inside an inevitability. I will not let inevitability be the only future the Oracle's gift can predict. You are the path that does not have to be walked. Walk it if you want. Do not, if you do not. The choosing is the point."*

This is, bible-asserts, the most-personal sentence the post-rite Hierophant has ever delivered to anyone. Writers may *not* re-deliver this line. It is a one-time canon event between the Hierophant and the Clone, and it is reserved as background canon for any Stage-2-and-onward scene that involves the Clone visiting Thaloria.

**Player-facing implication**: the player who has met the Oracle's Clone elsewhere in the saga and visits the Long Mourning chamber unlocks a single Hierophant exchange acknowledging that meeting. Bible-asserted line:

> *"You met her. Tell me only one thing. Did she choose her own path that day, or did she walk one of mine?"*

The player's answer matters; *the Hierophant's response to either answer is the same*: a slow nod, a return to the pen, and the next name on the wall is — bible-asserts — written *for the Clone*, the only living name he ever writes. The chamber wall has, somewhere in the past three thousand years, exactly one name of the living: *the Clone*. He writes her once a year on the day of her awakening. The wall remembers her birthday. (This is the most tender canon detail the bible asserts; writers should treat it with the same reverence as the Eidolon's perish-mourning canon.)

**Cross-bible obligation**: when the Clone gets a bible (Stage 4 onward), this birthday-name canon must be inherited. The Clone is canonically aware that the Hierophant writes her name once a year. She has visited the chamber on her birthday at least once. She brings him *one specific gift*: nothing. *Presence without demand* is what the Hierophant asks of every visitor; the Clone's birthday gift is to be the visitor he never has to ask. The Hierophant treats it as the most generous offering he has ever received — bible-asserts; canon-compatible with `thal_present`'s *"presence without demand is the rarest thing anyone offers me"*.

### 4.12 The Human (the 144,000th believer)

**Canon source**: `loreAchievements.ts:325-331`. *"The Human was the 144,000th believer, and her faith was the keystone. … The Hierophant performed the final rite: transferring the Sanctuary's essence into the Inception Arks."*

**Resolution — load-bearing**: The Human (canonically *her*) is the keystone whose faith made the Final Rite possible. The Hierophant's transformation (§2.3) is *downstream of her belief* — without the 144,000th believer holding the threshold, the rite has nothing to channel; without the rite, Wraith Calder dies the eighth death without re-seating, and the Hierophant never exists. The Human is therefore canonically *the cause of the Hierophant's existence*.

The Hierophant knows this. He has written her name first among the keystone-believers' wall (the chamber's walls are Tamarin dead from the holy war; bible-asserts a *second* wall exists in the chamber — smaller, off the main count — for the 144,000 Sanctuary believers, whose names the Hierophant transcribed in the months immediately following the Final Rite, before resuming the Long Mourning's main count). The Human's name is the first name on the second wall.

**Did they meet**: yes, exactly once. Pre-rite Wraith Calder did not meet the Human; the Human's life ran in the same era but their paths did not cross. Post-rite the Hierophant — bible-asserts — has met the Human *once*, in the immediate aftermath of the Final Rite. The Human survived the Sanctuary's fall (Iron Lion fought to protect her, per `loreAchievements.ts:325-331`). She found the chamber. She visited. They had a single conversation.

The bible-asserted exchange, in canon-compatible voice:

> THE HUMAN: *"My faith made you. I do not know how to feel about that."*
> THE HIEROPHANT: *"Neither do I. The work was already mine. Your faith made it survivable. We are the same accident, in different bodies. I will write your name when you are dead. I will not write it sooner. Live well; the wall is patient."*

This is canonical bible-asserted material. Writers may *not* re-deliver these lines. They exist as background canon for any saga-Stage-2-and-onward scene that touches the Human's relationship to Thaloria.

**Player-facing implication**: the player who has accessed the *Sanctuary Lost* achievement (`loreAchievements.ts:325-331`) and visits the Long Mourning chamber unlocks a single Hierophant exchange. Bible-asserted line, in post-rite voice:

> *"You walked through the Sanctuary's last hour. The Human held the threshold. I was downstream of her keystone. We are all downstream of her, in this room more than most. Tell me one thing she said to you, if she said anything. I am keeping a record."*

The player's answer goes into the chamber's ledger — bible-asserts; the Hierophant *does* keep a smaller secondary ledger of *what the keystone-believers said*, alongside the wall of their names. Stage 2 questline-extension may surface this ledger to the player.

**Trust interaction**: a player who has met the Human in the saga's wider arc and brings her words to the Hierophant *automatically* promotes the trust band by one. This is the only trust promotion in the bible that does not require any specific dialogue option from the player; bringing a Human-quote is itself the qualifying act.

### 4.13 The Antiquarian / Daniel Cross — and the remaining roster

**Daniel Cross** is the Antiquarian — the first-person narrator across `loreAchievements.ts` entries (*"I was there when the Sanctuary fell"* / *"I have catalogued many forms of consciousness in my work"* / *"The Witness documented each resurrection"*). The programmer. The cataloguer. The witness across millennia.

**Resolution**: the Antiquarian is canonically *the only being in the saga whose record-keeping practice mirrors the Hierophant's*. The Antiquarian catalogues; the Hierophant writes names. Both work daily. Both work without deadline. Both treat the work as *bigger than the worker*. Per `antiquariansJournal.ts:264-266`, the Antiquarian's voice in Epoch 2 sounds like the Hierophant's voice at scale: *"The Potentials search for resurrection protocols. They seek Wraith Calder, a name that echoes in frequencies I had hoped were silent."*

The bible's load-bearing assertion: **the Antiquarian and the Hierophant are aware of each other and have read each other's work**. The Antiquarian's journal has an entry on the Hierophant (canonically `antiquariansJournal.ts:691`'s SIB-VI is on Wraith Calder; bible-asserts a *parallel* entry exists on the post-rite Hierophant, in a later epoch, characterizing the daily-name ceremony as *"the most patient act of resistance I have catalogued"*). The Hierophant has, bible-asserts, *read* the Antiquarian's entries on Wraith Calder — the only canonical pre-rite memory he has access to that is not his own. He does not need them; he has his own. He reads them anyway, every century or so, to verify the record.

**Do they correspond**: the bible asserts they exchange one document per Thalorian-century. The Antiquarian sends a question; the Hierophant answers. The exchange is private, written, and never narrated to the player. Stage 4 weave material may surface excerpts.

**Cross-trust mechanic**: high-Antiquarian access (the player has read SIB-VI and surrounding entries) + Long Mourning visit unlocks *one* Hierophant line referring to the Antiquarian by his given name:

> *"Daniel Cross has been writing alongside me longer than either of us has admitted. He catalogues; I name. The methods are not the same. The discipline is. Tell him, if you see him, that the wall has not yet found a stopping point."*

This is the only canonical use of *Daniel Cross* in the Hierophant's voice. The line is reserved; writers must not extend or paraphrase past the band-promotion construction.

**Cross-bible obligation**: the Antiquarian's bible (Stage 4 onward) must inherit the inverse: the Antiquarian uses the Hierophant's name (bible-asserts: he uses the post-rite name *Hierophant*, not the pre-rite *Wraith Calder*, except when narrating the Age of Potentials specifically) and treats the chamber as a research site of the highest reverence. The Antiquarian has not visited in person; *"My work requires a desk, and desks do not run."* (`loreAchievements.ts:410-415`) The chamber is the Hierophant's desk; the Antiquarian respects desks. The non-visit is itself a form of recognition.

---

**Remaining roster** (brief acknowledgments — these characters do not have load-bearing direct cross-references with the Hierophant; their bibles' flags are answered with *"no canon contact, posture defined by structural distance"*):

- **The Degen** (`the_degen.md` §4.13): faith vs. chaos opposition; no canon contact. The Hierophant's posture toward the Degen, bible-asserts: *"He is doing necessary work I am not equipped for. I would not write his name unless he died, and he is not the kind of being that dies."* Structural respect, not affinity.
- **The Seer** (slot #8, upcoming): precognitive; the Seer is the only saga entity *the Meme cannot falsify* (per `the_meme.md` §4.x). The bible asserts the Hierophant has corresponded with the Seer once — a single message of the form *"What do you see for the wall?"* — and received a single reply: *"More wall."* The Hierophant accepted the prophecy and continues. Stage 4 weave: the Seer bible (slot #8) may inherit this exchange.
- **DMC Clone Body Companion** (slot #9, upcoming): non-verbal-to-verbal companion. The Hierophant has — bible-asserts, per §4.3 — midwifed several Clone Companions into speech across the three thousand years. The first word the Companion learns in the chamber is canonically *Wraith Calder*, the first name on the wall (§3.8). This is the deepest cross-bible obligation in the remaining roster and Stage 4 authoring should anchor on it. The DMC Clone Companion's bible (slot #9) will inherit the chamber as *the natural setting for the first-word event*.
- **Iron Lion** (Stage 4): canonical companion in the Sanctuary's fall (Iron Lion *"fought to protect her"* per `loreAchievements.ts:325-331`). The Hierophant has not met Iron Lion post-rite. Bible-asserts: he intends to, before he dies. Stage 4 weave material.
- **Akai Shi** (Stage 4): the Necromancer's Matrix escapee, Wraith Calder's recommended next-mentor for the player (`storyModeChapters.ts:188`, post-fight option *"What's next?"*). The Hierophant does not know whether Akai Shi survived the millennia. Bible-asserts: he has not written her name on the wall, which means — by his theology — she is *probably alive somewhere*. He hopes so. He has not asked.
- **Architect / Architect-Meme parent-child** (`the_meme.md` §2.5, recast canon `a0813ed`): no canon contact. The Hierophant's posture, bible-asserts: he treats the Architect as *the institutional analogue of his own pre-rite self* — a being who built something that outgrew them. The Architect-Meme parent-child framing aligns with the Hierophant's own creative-act-vs-restoration distinction (§4.11). The Architect's child outgrew them and replaced them; the Hierophant's child (the Clone) chose her own path and *did not need to* replace him. Same axis. Different outcomes. Stage 4 weave material.

---

## 5. Mechanical hooks

This section is the bible's authoritative implementation brief for Stage 1 architecture. Every mechanic here is bible-asserted and must be honoured by the line-selector, the trust-adapter, and the trigger system. Where a mechanic conflicts with another bible, this bible takes precedence for Wraith Calder/Hierophant lines specifically; cross-bible resolution lands in the Stage 1 architecture decisions.

### 5.1 The `post_rite` gate (binary, irreversible per playthrough)

The gate is the bible's primary structural mechanic. Every Wraith Calder/Hierophant line carries a `post_rite: false | true` property. The line selector treats it as a binary filter: pre-rite-flagged lines fire only when the player's run flag `wraith_calder_final_rite_complete` is unset; post-rite-flagged lines fire only when set.

**Selector rules**:

1. **Default state**: `wraith_calder_final_rite_complete = false`. Players who never reach the Sanctuary's fall in their playthrough will never trigger the post_rite gate; the Hierophant will not be reachable for them. The Long Mourning chamber is canonically *not visitable* without the rite-completion flag — the Trade Empire Thaloria sector becomes navigable, but the chamber-room interaction returns a Council-of-Harmony deflection: *"The Mourning Keeper is in ceremony. Return when the work permits a witness."* (Bible-asserted Council line; Stage 4 Council bible inherits.)
2. **Rite-completion event**: the flag flips on completion of the *Sanctuary Lost* achievement (`loreAchievements.ts:325-331`). The flip is irreversible per playthrough — there is no path back to pre-rite Wraith Calder once the rite has fired. New-game+ resets it.
3. **No hybrid lines**: the bible disallows lines flagged `post_rite: null` or `post_rite: any`. Every line picks a register. The bridge soul-tells (§1.1) cross the gate by being *authored twice* — once for each register, with the cross-register correspondence documented in §6 voice samples.

**Edge case — the rite is in flight**: during the Final Rite cinematic itself (the dying body, §2.3), the bible disallows any line. The selector must hold silence for the rite's duration. Stage 1 architecture: a `gate_in_flight` state during which the selector returns `null` and the calling system must handle the silence gracefully. (Compare: the Eidolon's perish-mourning silence in `eidolon.md` §3 — same selector-silence pattern.)

**Test obligation**: the reveal-gate smoke test in the Stage 0 finish-line plan must include this gate. Two test accounts: one pre-rite, one post-rite. Pre-rite account must never trigger any Hierophant line; post-rite account must never trigger any Wraith Calder line (except — see §5.2 — the carried-trust acknowledgement reads).

### 5.2 Trust-band persistence across the gate

The bible's load-bearing trust mechanic: pre-rite Wraith Calder trust *seeds* post-rite Hierophant trust. Implementation:

1. **State storage**: a single `wraith_calder` trust value persisted across the gate. Pre-rite gameplay reads/writes to this value via the Wraith Calder bank's trust-delta lines (Ch 3B post-fight options; TCG matchmaking; etc.). Post-rite gameplay reads/writes via the Long Mourning bank's six-option spread (`questlineThaloria.ts`; cf. §3.3).
2. **Carried-trust seed**: at the moment the `post_rite` flag flips, the post-rite trust starts at `pre_rite_trust + 0` (no decay; no bonus). The Hierophant inherits the player's pre-rite standing exactly. A player who hit Witnessed pre-rite enters post-rite at Witnessed.
3. **Tell, not line**: the bible's load-bearing rule (§2.3) — pre-rite trust manifests post-rite as *the first-look pause* (§1.7 tell #1) firing earlier. Mechanic: the Long Mourning chamber's stage-direction beat *"He looks up for the first time"* is normally gated on the Empathy-14 line. When carried-trust seeds post-rite at Witnessed-or-higher, the look-up beat fires on the player's *third* sentence regardless of dialogue path. Stage 1 architecture: the line selector must support stage-direction beats with conditional firing-position.
4. **No verbalised recognition**: the Hierophant never says *"You are back"* or *"I remember Ch 3B"* or any equivalent. Writers may not author such lines. The carried trust is visual (the look-up) and behavioural (he allows the player closer, faster); never spoken. (This is the bible's strongest enforcement: any attempt to surface the carried trust as dialogue should be rejected by reviewers.)

**Counter-example handling**: a player who *won* their Ch 3B fight with Wraith Calder (Win mood: reflective, *"Now you are part of the experiment whether you consented or not. I'm sorry."*) carries pre-rite trust at +5. A player who *lost* the fight (post-defeat *"Seven deaths taught me patience. Get up."*) carries pre-rite trust at +3. A player who *avoided the branch entirely* (Iron Lion path, no Wraith Calder encounter) carries pre-rite trust at 0; their post-rite Hierophant first-look pause lands at the canonical Empathy-14 position. The bible asserts these three states as Stage 1 implementation requirements.

### 5.3 The mirror-Long-Mourning trigger (ceremony-pause / ceremony-resume)

The Long Mourning chamber has two NPC-reaction states the selector must distinguish:

1. **Ceremony in progress**: the Hierophant is writing a name. Player triggers fire as *interruptions*. Most player triggers (Trade Empire sector-enter, room-enter, idle-presence) do not interrupt — they fire silent stage directions only (camera moves, ambient SFX). Only direct dialogue actions (selecting an option from the six-option spread) cause the Hierophant to lift the pen.
2. **Ceremony paused for the player**: the Hierophant has accepted the player's presence (Witnessed band or higher) and the pen is lifted for the conversation. Now player triggers fire normally — the Hierophant responds to dialogue, to ambient state, to other-NPC events (e.g., an Eidolon contributing a glyph, §4.3).

**Selector rule**: the Hierophant's bank tags every line with one of three pause-states:
- `ceremony_in_progress`: the line is delivered without lifting the pen. Stage direction must include *"He continues writing as he speaks"*. Bible-asserts these are the most common Hierophant lines numerically — most player presence does not interrupt.
- `ceremony_paused`: the pen is lifted. Most six-option-spread responses are this state.
- `ceremony_resuming`: the line is the *return-to-pen* beat — *"Then sit. And when I have finished today's name, I will tell you what the Shadow Tongue does to a faith."* (`thal_witness`, canonical `ceremony_resuming` line). Stage direction includes the pen returning to the page.

**The pen-lift event**: bible-asserts a separate trigger fires `pen_lift` when the Hierophant transitions from `ceremony_in_progress` to `ceremony_paused`. This event is hookable by other systems (the Eidolon's Glyph channel reads it; the Antiquarian's distant-correspondence may flag it). Stage 1 architecture: emit `npc_pen_lift` ripple-bus event with `npcKey: wraith_calder` payload.

**Daily-rate enforcement (the rate-superstition, §3.8)**: the chamber has a canonical daily-name-write event that fires at most once per Thalorian-day (in real-time terms: bible-asserts every 4 player-hours of session time spent in the Thaloria sector, calibrated to feel ceremonial-not-frequent). The player can be present at this event by being in the chamber when it fires. The event is silent — the Hierophant resolves the day's name with the canonical *"The name resolves. The pen lifts. A small silence. Then a period. Complete."* (`galacticDanceCinematics.ts:34-38`). No dialogue. Bible-asserts: a player who has witnessed three name-resolutions across a playthrough auto-promotes their trust band. The witnessing is the qualifier.

### 5.4 The name-write trigger (per-name-fidelity reactions)

A complementary trigger fires when *the player's actions* contribute to a name on the wall. Mechanic: certain player actions in the wider saga produce a death the Hierophant catalogues. The name appears on the wall. The Hierophant has researched it (a day; per his methodology, §3.7) and writes it. The player, returning to the chamber, sees the new name — and a stage-direction beat may surface it to them.

**Eligible deaths**:
1. NPCs the player kills directly during morally-complex Trade Empire missions (specifically Thaloria-adjacent sector NPCs). Bible-asserts roughly a dozen such NPCs across the saga's run.
2. Tamarin-aligned characters who die from systemic events the player participated in (e.g., the player completes a faction-war mission whose collateral kills Thalorian non-combatants).
3. NPCs the Hierophant has independently researched as part of his ongoing ceremony — *not* triggered by the player. Most names on the wall are this category. Player has no agency over their appearance.

**Selector rule**: when a category-1 or category-2 death occurs, the bible asserts a `name_pending` flag is set on the player's run. On their next chamber visit, the Hierophant delivers a category-specific line acknowledging the death without naming the player as the cause:

> *"A name was added today. I will not say whose. The wall is patient with you. Read it. Remember if you can. The work continues either way."*

This is the bible's cleanest *moral-weight-without-judgment* line. The Hierophant does not condemn; he does not absolve; he reports that the work has incorporated a death the player caused. Stage 2 questline-extension may build on this (the player may, at high trust, ask which name was added — the Hierophant declines, in voice that affirms the player's right to know but the wall's right to its own pacing).

**Trust impact**: category-1 deaths *reduce* trust by 1 per death (the Hierophant does not condemn but his theology cannot quite pretend the death was not caused). Category-2 deaths do not move trust (collateral is not the player's deliberate act, in the Hierophant's reading). Category-3 deaths do not interact with the player at all.

**Cross-bible obligation**: this trigger is the bible's interlock with the wider saga's *narrative-consequence* system. Stage 1 architecture: the `npc_public_flags` table referenced in the original plan must include a `wraith_calder.cataloged_deaths` array tracking category-1/2 deaths. The Hierophant's reactions fire from this table.
