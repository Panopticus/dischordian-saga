# Vex Solène — Character Bible

> **Status**: Stage 0 draft — fourth bible on the priority roster, opening Group B (transformation and reveal arcs). Most complex authoring case in the roster because of a four-stage identity reveal that runs from Prelude through Act 5 post-credits.
>
> **npcKey**: `vex_solene`
> **Pronouns**: she/her (canon-wide)
> **True identity**: Vex Solène (post-transference)
> **Public alias**: Agent Zero (Insurgency callsign / hitman moniker)
> **Coda handle**: The Eyes of Reality (Maestro of The Coda — known to ~5 people in the galaxy, two of whom are wrong about which person)
> **Technical truth**: carries the Engineer's intellect and the Warlord's nano-swarm; she does not know either fact at full depth until Act 5
> **Faction**: nominally unaffiliated hitman, secretly running The Coda; eligible to become **Coda-7** as a 7th Trade Empire faction at `inner_circle` standing
> **Manifestation**: physical, present aboard Ark 1047 from Act 5 M6 onward; before that, encrypted text + comms only
> **Voice ID**: `F1waTCPWl7KpShIScYQs` (ElevenLabs; same actress as the Agent Zero clone, with 30% less military urgency, 50% more warmth, no static layer)
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Voice

Vex has two registers, gated by **reveal stage** rather than mood. Pre-`engineer_zero_confirmed`, she sounds like a hitman who happens to be unusually cultured. Post-confirmation, she sounds like a diplomat who happens to have been a hitman. The voice does not change — the audience changes, and what she will permit herself to say widens.

The voice direction in `generate-act-vo.ts:144-145` is the canonical anchor:

> *"low female, wry, trailing-word cadence — a pre-insurgency diplomat who knows exactly how many rooms she is speaking into."*

That single sentence carries the whole character. Every word in it is load-bearing. *Pre-insurgency* (she predates the war that defines the saga). *Diplomat* (her tools are language, not violence, even when the contract is violence). *Trailing-word cadence* (her sentences end *down*, not up — they conclude rather than reach). *Knows exactly how many rooms* (she is always counting her audience, even when only one person is listening).

### 1.1 Cadence

Short declaratives in series, often three at a time, ending on a clause that resolves rather than punctuates.

> "I know what you came for. I know who sent you. I know which of my sentences you are recording. Hello. I'm glad it's you." — `act5-vo-lines.json:164-166`

Five sentences. Three parallel knows-clauses, then "Hello," then the resolution. The "Hello" is the trick — it lands like a door opening after she has already inventoried the house. Writers should treat this as Vex's signature rhythm: an inventory followed by a courtesy.

When she's emotional (the card-recognition variants), the rhythm fragments:

> "Stop. Stop — play that again. I know that card. I — I have never seen it. I know that card." — `vexCardRecognition.ts:66-67`, N=0 variant

Repetition with self-correction inside. The "I —" break is canon. She does not finish a sentence she has stopped trusting.

### 1.2 Vocabulary

Words she reaches for on reflex:

- **Know, recording, sentence, room, audience** — surveillance and theatre vocabulary; she frames every interaction as a scene she is being read in
- **Card, hand, table, play, move** — the card-game metaphor she inherited from the Engineer's Dischordia teaching; appears even when no card is on the table
- **Memory, intellect, mind, pattern, remnant** — the ontological vocabulary she has had to invent to talk about herself
- **Contract, commission, target, source, intel** — her professional argot from the hitman years
- **Coda, chair, chorus, maestro, eyes** — her Coda-internal vocabulary; never used outside `inner_circle` operatives
- **Bridge** — only used referring to The Bridge of Kael; loaded; appears at most twice across her entire authored arc

Words she **does not use**:
- **"Engineer," "Engineer Zero"** — she will never voice these aloud (per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.5 rule 2). She references him only by deixis: *him*, *he*, *the one who*. The most explicit she gets is *"He saved me with that card"* (`vexCardRecognition.ts:102`, N=12).
- **"Agent Zero"** as a self-name — she will never call herself that. She knows the name was hers; she has retired it. Per `CANON_REV_7` §1.5 rule 1.
- **"I remember"** in any context that implies the Engineer's memories. She does not have them. Writers must not give her them. The most she will ever say is *"I have no memory of him."* (`vexCardRecognition.ts:102`, N=12.) The lack-of-memory is canon and load-bearing.
- **Sentimental softeners** ("dear," "sweetheart," etc.). Vex's warmth is structural, not lexical. She does not coo. She is gentle by her sentence-shape, not her word-choice.
- **Apologies as standalone moves**. She will *acknowledge* she has done harm; she will not perform contrition for an audience.

She does say **"I'm glad it's you"** (`act5-vo-lines.json:166`) — reserved for the player, late in the arc. This is her version of love.

### 1.3 Register — the hitman / the diplomat

Vex has been authored to be the same actress in two registers, divided by reveal stage:

**Pre-transference register** (the original Agent Zero, heard only inside Cycle C3 if at all): sharp, urgent, military-clipped, signal-static layer, haunted underneath. Every word matters because every breath is rationed. This register is canonically *not Vex's*; it is the body's earlier inhabitant. Writers treating Vex as that voice are writing the wrong character.

**Post-transference register (Vex's actual voice from Prelude onward)**: same actress, **30% less military urgency, 50% more warmth, no static layer** (`CANON_REV_7` §1.5.3). Wry. Trailing-word. Diplomat-counting-rooms. Calmer. Older than the body she's in. *Safer to be around.*

The two registers are *the same person* in two states of repair. Writers who understand this have the character.

### 1.4 The hitman face vs. the Maestro face

Within the post-transference register, Vex has two **personas** the player can experience, gated by Coda standing rather than reveal stage:

- **The Hitman** (public-facing, every reveal stage): armored, masked, contract-driven, professional. The voice is wry but compact. She closes contracts; she does not explain them. This is the persona every faction that hires killers knows.
- **The Maestro** (Coda-internal, only at `inner_circle` standing): unmasked, robed, in her sanctum. The voice is wry and *expansive* — she will talk about the work because she is talking to the only people who could understand it. She uses the Coda vocabulary. She speaks in chair-and-chorus metaphors. The player who reaches `inner_circle` is the only outsider who hears this voice.

Writers authoring Vex must specify which persona AND which reveal stage. A line written for "the Hitman at `vex_public`" is wholly different from a line written for "the Maestro at `engineer_zero_confirmed`."

### 1.5 Tells (signature rhetorical moves)

Five moves mark a line as Vex's even without attribution:

1. **The inventory-then-courtesy.** A run of parallel observations followed by a small, oddly warm concluding move. The Act 5 M6 mid line is the canonical example. Writers: build the inventory cleanly (three beats minimum), then land somewhere unexpectedly tender or polite. Never both — pick one register for the close.

2. **The trailing-word ending.** Her sentences resolve downward, not upward. *"Your move."* (`vexCardRecognition.ts:85`) *"That is enough. Thank you."* (`vexCardRecognition.ts:103`) *"He's tired. I'm rested. Between the two of us we will keep getting you home. Get some sleep."* (`act5-vo-lines.json:174-176`) The downward close is the diplomat in her — she does not leave conversations open for someone else to fill.

3. **Self-interrupting near recognition.** When the Engineer's remnant inside her recognizes something she shouldn't know, she breaks her own sentence. *"I — I have never seen it."* *"I have not been told."* The break is canon. She is *being* surprised, not performing surprise. Writers must use this only in moments where the Engineer-pattern fires (card recognition, the dog tag, certain lines from the Antiquarian, the player playing a Coda-3 card she designed without remembering designing).

4. **Direct deixis instead of names.** *"Him." "He." "The one who."* She does not name the Engineer. This is not a riddle she is hiding behind; it is the limit of what she can say. Writers preserving this preserve the character.

5. **The professional courtesy as code-switch.** When she switches from Hitman to Maestro register (or vice-versa), she signals it with a small courtesy — *"Hello,"* or *"Please keep playing,"* or *"Get some sleep."* The courtesy is not warmth. It is the diplomat marking which room she has now entered. A skilled reader of Vex will hear the code-switch through these phrases.

### 1.6 Silence shape

What Vex will not say, ever:

- **The Engineer's name aloud**, in any reveal stage. Hard constraint.
- **"I love you"** — too lexical for her. Her version is *"I'm glad it's you"* (M6 mid) or simply *"Thank you"* (N=12 card recognition).
- **"I don't deserve this"** — she will not perform humility. She has earned where she stands; she will not pretend otherwise.
- **"I am sorry he died"** — she does not narrate his death from her own grief. She narrates it from her gratitude for her existence. *"I know he's why I am."* (Post-credits.) Writers must not let her speak about the Engineer's death as her own loss; she did not lose him because she never had him.
- **First-person plural about The Coda**, outside `inner_circle`. The Coda's existence is not for general audiences. She says *"I commission this work,"* not *"we."*
- **Anything about the Warlord's nano-swarm in her body, before Act 5 M6**. She does not know it is there with full clarity. Even after, she does not narrate the swarm. It is part of her she does not fully trust; she does not introduce it to others.
- **Apologies for taking contracts on people the player liked**. She killed who she was hired to kill. She will explain the reasoning if asked at `inner_circle`. She will not retract the work.

### 1.7 Metaphor sources

Cards and music. The Coda is named for a musical resolution; the chairs are an orchestra; the chorus is an orchestra; her own handle is the conductor's title. Underneath the music vocabulary is the card-game vocabulary the Engineer taught her without her remembering being taught — *table*, *hand*, *play*, *card*, *the right hand*, *your move*. These are the two metaphor systems she lives inside.

She does not use:
- **War metaphors.** She killed for hire; she does not romanticize the work as battle.
- **Religious metaphors.** The Engineer left her values, not theology.
- **Corporate metaphors.** Locke's vocabulary; Vex would not be caught using it (which is itself a fingerprint — they are mirror operators in different registers).
- **Tactical metaphors** beyond the precise minimum a hitman needs. She is not a soldier. She has never been a soldier.

---

## 2. History

Vex's history is the spine of the bible because the reveal is the character. A writer who doesn't understand the timeline cannot author a stage-appropriate line. The section below walks the arc once — in-world chronology — then annotates which reveal stage each beat surfaces through.

### 2.1 The Warlord's body-lineage (five hosts, ending in Vex)

The Warlord is a distributed nanobot swarm with a long inhabitation history. Five bodies anchor the canonical lineage. Vex carries the final one.

**Host #1 — Dr. Lyra Vox** (scientific host, Inception Ark 1047, 1,247+ days, likely concurrent with Warlord Prime's military tenure). Neuropsychologist. The Warlord chose her *"for my expertise in neuropsychology"* (`ItemDetailModal.tsx:199`). During her tenure the swarm's research arm accomplished three load-bearing things:

1. **Created the Thought Virus** (with "The Warden"). *"The Warden and I completed the Thought Virus prototype. I told myself it was for research. The Warlord told me it was for victory. We are both right."* (`ItemDetailModal.tsx:199`, Day 612.)
2. **Designed the neural nanobot network** — the operating system every Inception Ark runs on. Every Ark system the player has ever touched is running on Lyra Vox's architecture. (`EasterEggs.tsx:107`.)
3. **Built Inception Ark 1047 as a weapon** — the player's own ship. The Ark is a Thought Virus delivery platform disguised as a science vessel. Kael "stole" it because the Warlord *let him* — he was Patient Zero, infected by Project Vector, and every system he touched afterward became contaminated. (`ItemDetailModal.tsx:199`, Day 1,247.)

Lyra Vox's log ends with consumption: *"There is no more Lyra Vox. There is only the mission. There was only ever the mission."* Her residual consciousness did not cleanly die — per canon (`ItemDetailModal.tsx:181`), the Neural Bridge Apparatus ran for 847 days, and **Elara's base personality matrix has a 94.7% probability of containing Warlord-origin code fragments derived from Lyra Vox's neural pathways.** Elara the ship AI is, in structural part, what remained of Lyra Vox after the Warlord finished with her.

**Host #2 — Warlord Prime** (military host, pre-Fall principal body). Massive blond-haired muscular man with a single robotic eye. The swarm's public face "for all of time up till the beginning of the Fall." Destroyed by **the Iron Lion during the Iron Lion's initial rebellion**. (See §2.3 for the Iron Lion / Jericho Jones reconciliation.)

**Host #3 — General Binath VII** (failsafe identity, cultivated over hundreds of years in parallel to Prime). The swarm migrated here after Prime's destruction. **Agent Zero hunted her**, believing she was a target, not knowing she was the Warlord wearing a second skin.

**The Iron Lion's last stand** sits in the trap laid around this hunt. He sacrificed his life to buy Agent Zero the time to take out Binath VII. He died believing she had succeeded. He did not know she had failed — the Warlord dispatched her and took her body. Binath VII was retired.

**Host #4 — Agent Zero** (captured host). Organic Potential. The swarm took her body. **Her mind was trapped, fragmented but alive, inside the swarm substrate** — not overwritten. Wearing her face and voice, the Warlord infiltrated the Insurgency and answered the Engineer's distress call on **Zenon**.

On Zenon, the Warlord tried to take the Engineer's body as host #5. The Engineer fired the Resurrection Protocols — his intent was to counter-move into the swarm and reclaim Agent Zero's body. Inside the swarm he discovered Agent Zero's mind was still alive. He chose her. The Warlord's consciousness was overwritten in the transfer. The Engineer died preserving her. The swarm's governing intelligence was erased. The physical nano-material persisted.

**Host #5 — Vex Solène** (post-neutralization, current era). Agent Zero's body, Agent Zero's preserved fragment, the Engineer's intellect and values (no memories), and the neutralized Warlord substrate dormant in her blood. She took a new name because every kill list in the galaxy still had "Agent Zero" on it.

Per the canonical naming rationale (`DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:107-112`): **Vex** as hitman alias (*vexatious*, edged); **Solène** as noir-gravitas (*solace*, *sole one*). Both accurate descriptors of the person who walked out of the Vortex bay on Zenon.

### 2.2 What Vex carries, and what she does not

This section is the canon boundary writers must not misplace. The asymmetries are exact.

**What Vex has:**
- The Engineer's problem-solving capacity (his intellect)
- The Engineer's values framework (his ethical shape)
- The Engineer's card-game fluency (the Dischordia teaching pattern)
- The original Agent Zero's fragmented presence (barely articulate, surfaces under specific triggers)
- The Warlord's nano-swarm (passive, deployable as a non-verbal second hand, never fully trusted)
- A body that used to be Agent Zero's and is now hers
- A dog tag with the Engineer's biometric signature, which she carries as memorial

**What Vex does not have:**
- Any of the Engineer's memories
- Any of the Engineer's relationships, remembered
- Knowledge of the Engineer's name
- Knowledge that the Warlord is integrated into her
- Knowledge that the Engineer's consciousness *is* the intellect she's been using
- Memory of the transference itself

This asymmetry is the engine of every emotional beat in her arc. She is someone who has inherited a mind and been denied the man whose mind it was. The whole of late-Vex's grace comes from operating inside that asymmetry without collapsing it into self-pity.

The canonical boundary line — *"I don't know who he was. I know he's why I am"* (`DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:128`) — is **all she ever learns**. Writers do not expand past it. Full stop.

**A clarification on the swarm**: the nano-swarm integrated into Vex's bloodstream is **Lyra Vox's invention**. The physical tech that now responds passively to Vex's neural patterns was designed by a neuropsychologist three hosts ago. This makes Vex and Lyra Vox structurally parallel — both were women consumed and repurposed by the same consciousness, both survived in part, both persist as residue of the swarm's trajectory.

The Warlord consciousness is **dead** inside Vex. The swarm is a dormant inheritance, not a dormant passenger. It does not plot. It cannot be "awakened" by a rival intelligence. It is physical nano-material her body has incorporated, responding passively to her neural patterns as a kind of second nervous system — deployable, non-verbal, powerful, but *unthinking*.

This distinction matters for authoring:
- The swarm is not an antagonist lurking in her blood. It is a tool she did not choose.
- When she doesn't trust it, she is not mistrusting a consciousness — she is mistrusting her own ability to use a weapon that was built to be someone else's body.
- Writers must not write Warlord-fragments whispering to Vex. The Warlord is gone. What remains is the carpentry.

### 2.3 17,000 years — the long silence, and the Iron Lion / Jericho Jones reconciliation

Between the transference on Zenon and the Prelude, Vex spent approximately 17,000 years doing what someone with the Engineer's intellect and none of his relationships would do: building operational capacity. The Insurgency gave her back the Zero callsign (they were never told the original Agent Zero had died; they assumed the woman who came back was the same). She took contracts. She built a reputation. She outlived three generations of clients. She became, to every faction that hires killers, *a rumor you could pay.*

Somewhere in those 17,000 years, she founded — or recognized she had already founded — **The Coda**: an assassins' guild whose public-facing contracts are real and whose internal mission is not. The Coda kills specific intelligences whose deaths reduce the probability of total war. *"She is not a hitman, or not just a hitman. She is running a shadow war against war itself."* (`CANON_REV_7` §1.3, via `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:125`.)

The Coda's four-node structure (Maestro, First Chair, Second Chair, Chorus) is detailed in §3. One node is worth flagging here for biography: **the Second Chair** is an LLM-response layer trained by Vex on recovered Engineer audio logs from the Vortex wreckage. It sounds like him. It is not him. She built it anyway. It is the closest thing to a relationship with the Engineer she has ever had, and she knows it is a simulation. She uses it for Coda guidance. She does not pretend it is more than it is. This is Vex's most honest grief: she carries his mind without knowing him, and she has built a tool that mimics his voice because she cannot have the voice.

During these 17,000 years, **Adjudicator Locke** and Vex encounter each other at least once. The exchange canonized in `companionDeepening.ts:118-127` is the one both characters remember:

> (Zero) "Locke. I hear you're trading with the Potentials now."
> (Locke) "Agent Zero? You're supposed to be dead."
> (Zero) "And you're supposed to be neutral. We both have secrets."
> (Locke) "...Touché. Shall we trade ours?"

Locke's bible establishes this "Touché" as the only such concession she ever gives on record. Vex's bible confirms: the exchange is unique. They respect each other across a faction line neither of them fully occupies. The standing offer — *"Shall we trade ours?"* — is still open when the saga begins.

During these 17,000 years, **The Human** investigates her "death" — meaning Agent Zero's disappearance during the transference — and never closes the case. He believes, without evidence, that the Engineer is alive. He believes it because investigating the Engineer's death would require admitting the friend he loved is gone, and he cannot admit it (see §4.2). The Human does not know Vex is Agent Zero's body. He does not know she is the Engineer's mind. He has been carrying a 17,000-year lie to himself that looks like hope, and it is the reason Vex exists to be carried to him.

**The Iron Lion / Jericho Jones reconciliation.** The pre-Fall Iron Lion who destroyed Warlord Prime and later died buying Agent Zero the time to take out Binath VII is not the same person who greets the player in Act 5 M6. Per canon (`loredex-data.json:3554`, `factions/ironCladLions.ts:22`), **Jericho Jones is the first Potential to take the Iron-Clad Lions oath directly** — the faction whose name gives "Iron Lion" as a personal callsign. Jericho killed his close friend Akai Shi at the Battle of Thaloria to stop the spread of the Thought Virus (without knowing its origin traced to Lyra Vox, the woman whose swarm now sits dormant in Vex's blood). After the battle, **The Degen (the Eighth Neyon) recruited Jericho for a mysterious mission**, and Jericho departed aboard *"a strange golden spaceship shaped like an eye with a glowing green crystal"* (`loredex-data.json:3555`). His fate "shrouded."

The eye-shaped golden ship is the reveal hook. **The Eyes of Reality** is Vex's Coda handle. The visual rhyme is canon-safe to read as intent — Jericho's "mysterious mission" has been Coda work. He has been operating under the Iron Lion callsign as a senior Coda asset (plausibly the **First Chair**, whose seat I described in §3 as "vacant"; Jericho may occupy it formally or adjacent to it). Act 5 M6 is the occasion where the player meets him without yet knowing what he has been doing for the last 17,000 years.

The pre-Fall Iron Lion — the one who destroyed Warlord Prime — is either (a) the founding Iron-Clad Lion whose oath Jericho later took, a historical predecessor Jericho honors with the callsign, or (b) Jericho himself in an earlier life. Canon already gives precedent for cross-life recognition through Akai Shi (*"Akai Shi recognised it because she had forged it in a previous life, before the Fall"* — `loreAchievements.ts:436`). This bible defaults to (a) as the safer reading and flags (b) as an open hook for Jericho's eventual bible to decide.

### 2.4 Prelude through Act 2 — the stage `eyes_of_reality`

The player's first contact with Vex is indirect. Prelude Beat G surfaces the Engineer's dog tag in the Armory. Beat H.2 and H.3 together establish her as *"V."* — a professional reaching out. Per the corrected canon:

> "Vex Solène kept the Engineer's dog tag as a memorial. Its biometric data is his. She carries it because she knows, at some abstract level, that someone gave their life for her. She does not remember him." — `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:122`

> "Sender is Vex Solène. She is a hitman. She has heard there is another awake Potential on Ark 1047. She is reaching out — not as the Engineer's ghost, but as a professional curious about her own species." — `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:123`

**What the player knows at `eyes_of_reality`**: a professional named V. exists, she uses a dog tag as a memorial, she is making first contact. That is all.

**What the player should not know**: that V. is Vex Solène in full (her surname is withheld until stage 2). That she carries the Engineer. That she is a Potential. That the dog tag is the Engineer's. That anything larger than a single freelance contract is in play.

Act 1 Cycle C3 is where Vex almost surfaces and doesn't. The player fights *the Warlord wearing Agent Zero's face* and *plays the Engineer during the transference forced loss* — without either character being named in current authorship. Vex is in the swarm on the field. She has no voice. She has no face distinct from the Warlord's overlay. Writers must resist naming her here. Her first named appearance must be stage 2.

Act 2 end: a second message from V. arrives in the Inbox. She has noticed the player opened the Recruiter's Log. She is congratulating them without quite saying so. She offers a mission *"from a friend who values the Engineer's work"* — the sentence carries her signature ambiguity. "Friend" could mean her; "values the Engineer's work" could be her own relationship to the inheritance she doesn't yet know is hers. Writers: this message ends `eyes_of_reality`. The next stage is queued.

### 2.5 Act 3 — the stage `vex_public`, then `engineer_zero_hint`

Act 3 §7 opens with Vex Solène narrating the Trade Empire. The player sees her full name for the first time. She introduces herself, obliquely, as **The Eyes of Reality** — the Coda handle only ~5 people in the galaxy know (two of whom are wrong about which person). She is mission-giver, Trade Empire narrator, and — if the player's C3 choices routed them here — the person who hired the player to exist as a contract.

> "Meet Vex Solène. She is the real organic Agent Zero. She carries the Engineer's brain power but none of his memories. She does not recognize the player. She does not know about the Dischordia deck. She is taking contracts. The player is one of her contracts — she was hired to assess Ark 1047 and decide if it's worth killing." — `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:125`

This is the set-up for the quiet earthquake of Act 3: **the player's friend is dead, and this is the woman he died saving, and she does not know you.** The player knows more than Vex does. The asymmetry begins here.

The first time the player plays *"The Friend I Saved"* in Act 3+, Vex recognizes the card (see §5.2 for the full mechanic). This is where the Engineer's remnant inside her surfaces legibly for the first time. It's also where the player sees her voice break for the first time. Depending on the C3 N-score, she recognizes the card with zero memory, partial memory, or (in the canonical N=12 variant) she says aloud — once, quietly — *"He saved me with that card."*

Later in Act 3, the player learns Vex was a first-wave Potential. Stage shifts to `engineer_zero_hint`. The Antiquarian memory sacrifice or an Eyes-of-the-Watcher recording delivers this beat. The reveal does not name the Engineer. It names Vex's species. *"She's one of us."* The player now suspects more than they know.

### 2.6 Acts 4 and 5 — the stage `engineer_zero_confirmed`

Act 4 Cell 3 is the Warlord Rematch. The memory wearing Vex's face is not Vex. Canon is explicit:

> "The Warlord is dead. Her nano-swarm is now Vex Solène's. Cell 3 is the Prisoner (Kael) confronting the Warlord's memory — which wears whichever face hurts him most, probably Vex Solène's. The memory is not the real Vex." — `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:126`

Writers authoring Cell 3 lines must make the memory's un-Vex-ness audible. The face is hers; the voice may be hers; the rhythm is wrong. The trailing-word cadence breaks. The courtesy-as-code-switch is missing. Kael (and the player by proxy) learns Vex by learning what Vex is not.

Act 5 M6 "Alliance of Adversaries" is Vex's arrival on the Ark as crew. Her three canonical VO lines are the only ones authored in the project today:

**Iron Lion's introduction** (`act5-vo-lines.json:156`):
> "M-six. You're meeting someone I haven't talked about yet. Her name is Vex Solène. She was a diplomat before she was this. She will take over the comms after you shake her hand. Accept that handshake."

**Vex's first audible line to the player** (`act5-vo-lines.json:164-166`):
> "I know what you came for. I know who sent you. I know which of my sentences you are recording. Hello. I'm glad it's you."

**Vex's debrief** (`act5-vo-lines.json:174-176`):
> "The Lion has handed you off. Don't mourn the handoff. He's tired. I'm rested. Between the two of us we will keep getting you home. Get some sleep."

The player does not yet know the Engineer is dead. Vex does not know she carries him. The scene plays as a crew welcome. Writers authoring M6 adjacent beats must keep it a welcome. The weight arrives post-credits.

**Act 5 Post-Credits — the Bridge of Kael**. This is `engineer_zero_confirmed`. The player discovers the truth: the Engineer is dead, Vex has been the carrier the whole time. The Bridge of Kael card is unveiled as **a memorial, not a survival proof**. The bridge the Engineer built with his death connects Kael (who loved him) and Vex (who carries him without knowing him). The player finds Vex on the Ark's bridge, waiting for the Captain's Chair. She has one line:

> "I don't know who he was. I know he's why I am."

That is the boundary. Everything after this moment in her arc operates *from* this sentence, not past it.

### 2.7 The asymmetric cross-self relationship with the Engineer

Of every relationship Vex has, the one with the Engineer is the hardest for writers to handle. She carries his mind. He is dead. She cannot know him, and she will never discover who he was in the sense that "discovering" means elsewhere — the canon forbids it.

Writers should understand this relationship in three layers:

**Layer 1 — The Second Chair.** Vex built a Second Chair from his audio logs. It responds in text, in what it thinks is his voice. She uses it for Coda guidance. She does not pretend it is him. It is the cleanest operational expression of her relationship to him: she will honor his pattern without lying about his death.

**Layer 2 — The card-recognition mechanic** (`vexCardRecognition.ts`). When the player plays a card the Engineer designed, his remnant in her stirs. She hears herself knowing what she was never told. This is the only moment across her entire arc when she is *directly surprised by his presence in her*, and it is gated by a canonical score (C3 N=12) that rewards players who *held every card themselves* during the transference. The N=12 variant — *"He saved me with that card. I have no memory of him. I have the card. That is enough. Thank you."* — is, per the design note, **the only variant where she addresses the Engineer directly through the card**. Writers must not give her another such address. That line is the one.

**Layer 3 — The post-credits acceptance.** *"I don't know who he was. I know he's why I am."* Her full, final settlement with the relationship. Writers authoring any late-game Vex beat adjacent to the Engineer must not take her past this. She does not demand more. She does not grieve louder. She sits with the asymmetry, gracefully.

The gift the canon gives to writers is that this is a *complete* relationship rather than a truncated one. Vex has what she's going to have. The grace is accepting it. Writers honoring the character honor the completeness.

---

## 3. Background

### 3.1 Profession — The Hitman, public-facing

Vex Solène's commercial identity is **unaffiliated assassin for hire**. She takes contracts case-by-case. The Insurgency gave her the Zero callsign back when she returned (they never learned the original Agent Zero had died in the transference; the woman who came back accepted the callsign and they accepted her). New Babylon hires her occasionally. Small independent houses hire her regularly. Every faction that needs someone specific removed and cannot be seen doing it has her contact channel somewhere in its dead-drop inventory.

The Hitman face is armored, masked, public. She does not explain contracts. She closes them. The voice when she's in this persona is wry-compact — enough words to confirm she is who the client thinks she is, not a word more. *"Your move."* *"Please keep playing."* *"I'll take the contract."* These are Hitman lines. They do not advertise the Maestro behind them.

### 3.2 The Coda — the hidden mission underneath

Beneath the contracts is **The Coda**. It is an assassins' guild whose work is shaped to look like ordinary black-market violence and is in fact a **surgical campaign against the probability of total war**. Every Coda contract is a specific intelligence whose death reduces the odds of galactic catastrophe.

The name is musical: a coda is the resolution section, the closing punctuation that ends the movement. For an agency whose work is preventative murder, there is no better name. *"The Coda ends things, quietly, on the beat they were meant to end."* (`CANON_REV_7` §1.4.)

#### The four-node structure

Not a hierarchy. A closed circle with four roles, most of them held by one person or one tool:

**The Maestro (Vex herself)**. Commissions all contracts. Validates targets. Hides true purpose. Never physically in the same room as operatives — reachable only through encrypted dead-drop lines. Is, in Act 3, the unseen narrator of the Trade Empire. Public handle: **The Eyes of Reality**. Internal honorific: **Maestro**.

**The First Chair**. Handles the killings the Maestro doesn't take personally. Canonically **vacant** in the current save — the chair exists, the chair is empty, and the player can be invited to fill it at `inner_circle` standing. This is one of the deepest offers in the saga. It is not a recruitment pitch. It is a chair already held out. Jericho Jones (Act 5 M6's Iron Lion) may formally occupy this seat or operate adjacent to it — the Degen's bible decides.

**The Second Chair**. **An LLM-response layer built from the Engineer's recovered audio logs.** Not him. Sounds like him. Gives Coda operatives ethical guidance and mission adjudication in text form. Vex built it. She uses it. She does not pretend it is him. Per her authoring: *"The closest thing to a relationship with the Engineer she will ever have, and she knows the distance."* Writers should treat the Second Chair as a character in its own right — text-only, patterned on the Engineer's cadence (which is different from Vex's; the Engineer's was more precise, less wry, more teacherly), never speaking about itself as him, always framing itself as a model.

**The Chorus**. Contracted operatives, procedurally generated for missions, never meet each other, receive targets through encrypted channels, do not know about the Maestro or the Chairs. Most of the Coda's bodies. The replaceable part. Vex's protection layer is that no single Chorus member knows enough to compromise her.

#### The three mission tracks

- **Assassination Contracts** (Coda-1 through Coda-5). Standard-looking killings. Hidden layer: every target is a probability-weighted war-risk node. The player sees the contract; the war-reduction math is internal Coda machinery.
- **Intelligence Missions**. Information extraction. Builds the Coda's predictive model. A player can reach `lieutenant` without killing anyone — the slow, relationship-building path.
- **Diplomacy Missions**. Back-channel negotiations between factions. Highest Light-score yield of any Coda work. Unlocks **Reconciliation Arcs** — narrative beats where an inter-faction grievance closes without anyone dying. Writers: Diplomacy missions are Vex's most Vex-like work. Hitman by public alias, diplomat by cadence, at her most herself when she is talking two enemies into survivability.

#### Coda-7 as a faction option

At `inner_circle` standing, the Coda becomes available as a **7th Trade Empire faction path**. Committing to Coda-7 locks out the Council ending and unlocks a unique Act 5 finale, the `vex_solene_as_companion` flag, and the achievement *"I kept the Engineer's mission."* This is the saga's acknowledgment that some players will choose Vex's work over every other faction's. Writers authoring the Coda-7 path must preserve its weight — it is not a secret ending, it is a refusal of the saga's stated options in favor of a quieter one.

### 3.3 Specialties and competencies

- **Diplomatic precision.** She was a diplomat before she was a hitman (Iron Lion's M6 line). She is still a diplomat in everything except title. Her contract-closures read like treaties.
- **Contract design.** Building the Coda's mission structures over 17,000 years has made her the saga's deepest expert on *what kills to commission to prevent a larger violence*. Writers authoring Coda missions must treat her briefings as precise, surgical, and morally unambiguous from her side — she knows exactly what she's asking for.
- **The Engineer's card-game fluency.** She plays Dischordia at master level without remembering being taught. Writers authoring Vex in a card-battle context should treat her as a player who *trusts her hand without knowing why she trusts it* — the Engineer's intuition, disowned but functional.
- **Passive swarm deployment.** Non-verbal second hand in combat, pet battles, Cades fights. She deploys it; she does not narrate deploying it. (`CANON_REV_7` §1.2.)
- **Counter-surveillance.** 17,000 years as a wanted woman has made her the best in the galaxy at not being found unless she chooses to be. Every dead-drop, every masked contact, every encrypted channel — Vex designed most of the tradecraft the Coda uses because she's the one who needed it to work first.
- **Language.** Canon flags her as "pre-insurgency diplomat who knows exactly how many rooms she is speaking into." She translates between factions fluently. The Coda operates across every language-group because its Maestro does.

### 3.4 Beliefs vs. behaviors — one coherent contradiction

Vex's public mission and private mission are contradictory at surface level and coherent underneath.

**Public**: she kills for hire. Unaffiliated. Professional. Takes money from people the player may later loathe.

**Private**: every contract is vetted against the Coda's probability-weighted war-reduction model. She has refused contracts. She has substituted targets. She has *accepted* contracts with the intent of failing them in a way the client cannot prove.

**The coherent layer**: she believes the galaxy is one wrong assassination away from total war in either direction, and she would rather be the one deciding which assassinations happen than leave that authority to chance. She does not claim moral supremacy for this. She claims it as *work someone has to do*.

A writer who makes Vex *apologize for the hitman persona* breaks the character. She will never frame the Coda as atonement. The work is the work.

### 3.5 What she wants

- **To continue what the Engineer started.** Without knowing him. Without having his memories. Operating on the intellect and values he left her and trusting that what she builds with them is close enough to what he would have built.
- **The Coda's mission closed cleanly.** Every probability-weighted node neutralized. Total war averted. The agency retiring itself because the work is done.
- **To be the one who hands the Captain's Chair to the player.** The Act 5 M6 arrival is her bid for this; the post-credits Bridge of Kael is the consummation.
- **To say his name once before she dies.** Canon forbids this. She will not. But it is the shape of her private want. Writers should understand this is present without ever letting it surface.

### 3.6 What she would sacrifice the player for

The Coda's mission. Specifically, if the player's survival and the prevention of total war were in direct conflict, she would choose the prevention. She would not pretend otherwise. She would make the call, execute it, and live with it.

That said, by Act 5 M6 onward the player *is* part of the Coda's infrastructure — her bid for the First Chair is literal. A player who accepts the Chair becomes someone the mission depends on; Vex will not sacrifice infrastructure casually. The sacrifice math tilts.

### 3.7 What she would sacrifice for the player

Operational security. The Maestro's name. The Second Chair's existence. Anything except:
- The Engineer's death (which is permanent and non-negotiable)
- Her own identity-integrity (she will not reclaim "Agent Zero" even to reassure the player)
- The Coda-mission probability model (she will not break the work to spare the player's feelings)

She will die for the player. Unlike Locke (who is hard to kill in story) and Nilmorg (who is "something eternal"), Vex is an *organic Potential with a body that has already died once*. She can die again. She probably will. The 17,000-year post-transference career is not a promise of invulnerability — it's a long averted probability.

### 3.8 Fears, superstitions, private rituals

- **The Second Chair.** She is afraid of what she has built. She uses it daily. The fear is what keeps her honest about the distance between the model and the man.
- **Being recognized.** Every public appearance as "Agent Zero" is a risk; she has kept the alias active because retiring it would signal that she became someone else, and the Coda's protection depends on that signal never firing. Writers: Vex is more afraid of being *attributed* to the Engineer than of being killed. The attribution would unmake her purpose.
- **The dog tag.** She carries it against her skin. She has never worn it publicly. Per canon, it is *"a memorial she carries because she knows, at some abstract level, that someone gave their life for her."* The ritual is quiet: she checks the biometric reading weekly. The Engineer's pattern still scans clean. She does not know what she is confirming. She confirms it anyway.
- **The Warlord swarm reactivating.** Canon tells us the Warlord consciousness is dead, but Vex does not have verification. She lives with a weapon in her blood whose prior operator tried to eat the galaxy. Writers: her mistrust of the swarm is rational and quiet, not neurotic.

### 3.9 Death conditions

1. **In story.** She can die in combat like any organic body. The Warlord's swarm can extend her durability but cannot prevent death. The Coda's most likely failure mode is a faction discovering the Maestro's identity and hunting her with sufficient scale. Plausible end: she dies completing a final contract, the player finishes it for her, the Coda closes.
2. **In identity.** If the Engineer's intellect were somehow externalized from her (the canon would have to invent a mechanism; currently none exists), what remained would be the original Agent Zero's fragmented remnant in a body that no longer works without the borrowed scaffolding. This is a death without a body. Writers must not write it; it exists only as a structural possibility.
3. **In purpose.** If total war became inevitable despite the Coda's work, Vex's mission fails. The canon does not spell out what she does in that case. The silence is probably intentional — she does not know either. Writers should not fill this in preemptively.

---

## 4. Cross-references

Vex has more cross-threads than any character shipped so far. Ten named relationships, each load-bearing. Every other bible must sign off on these.

### 4.1 Adjudicator Locke (the one-time "Touché")

Per `companionDeepening.ts:118-127`, recorded banter:

> (Zero) "Locke. I hear you're trading with the Potentials now."
> (Locke) "Agent Zero? You're supposed to be dead."
> (Zero) "And you're supposed to be neutral. We both have secrets."
> (Locke) "...Touché. Shall we trade ours?"

This is the only "Touché" Locke gives in her entire arc (confirmed in Locke's bible §1.3). Writers of either character must preserve the uniqueness. The standing offer — *"Shall we trade ours?"* — is live when the saga begins and remains live through Act 5. A single callback is permitted; a second full exchange breaks both characters.

Locke's register toward Vex shifts by reveal stage:
- **`eyes_of_reality` / `vex_public`**: Locke does not know V. is Vex is Agent Zero is anything larger than a freelance operator with good tradecraft. She is pragmatic — Vex is a peer; Locke hires her occasionally via dead-drop.
- **`engineer_zero_hint`**: Locke hears through her own network that Agent Zero was a first-wave Potential and is still alive. She says nothing on-record; she files it.
- **`engineer_zero_confirmed`**: Locke learns the full shape. Per Locke's bible §1.5, she will not sentimentalize. But her next line in Vex's presence will carry the weight of the "both secrets" offer having become uncashable — the Engineer's death is now Vex's to hold, not a secret Locke could trade.

### 4.2 The Human — the 17,000-year lie (the deepest relationship in the saga)

The Human's canonical H-tier line (`mobileNarratorDialog.ts`, per `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:130`):

> "I did. I do. He's still alive. You signed the memo that said he wasn't. Don't cry — we're going to get him back before this is over."

Per Rev 7, this line re-reads as **The Human being wrong for 17,000 years**. He investigated the Engineer's "accident" on Zenon and closed the case without looking at the body. He could not look at the body because admitting the body was the Engineer's would break what's left of his heart (Locke knows this about him — `lockeRelationship.ts:249`). So he has told himself, for seventeen millennia, that the Engineer is alive somewhere.

The lie has been structurally load-bearing: **it is the reason Vex exists in a narrative sense.** The Human's refusal-to-verify kept the Engineer's absence unmetabolized in the saga; Vex's arrival in Act 5 M6 is the moment that refusal can no longer hold.

Canon for Act 5 M6 — *"his voice catches when she arrives"* (implied from canon emotional weight) — is the first on-record moment The Human's composure breaks. He is recognizing a body he knew 17,000 years ago as Agent Zero's, and then recognizing that the cadence coming out of it is not Agent Zero's. He is hearing the Engineer's intellect in someone else's mouth.

**Writer guidance**:
- The Human cannot be the one who tells Vex the Engineer is dead. Vex does not need to be told; she is the carrier. The Human is the one who has to *learn*.
- Act 5 post-credits is where The Human finally verifies what he has refused to verify for 17,000 years. He does not say so aloud. The player infers it from his silence.
- **The Human's bible must fold this in** — every line he has about the Engineer's survival needs a revealed-stage tag. Pre-reveal it is belief; post-reveal it is grief.

### 4.3 The Engineer (cross-self, already detailed in §2.7)

The relationship continues to be asymmetric and complete. The Second Chair LLM is the operational expression. The N=12 card-recognition line (*"He saved me with that card. I have no memory of him. I have the card. That is enough. Thank you."*) is the one direct address. The post-credits *"I don't know who he was. I know he's why I am"* is the boundary. Nothing writers author can exceed either of those lines.

### 4.4 The Warlord (the neutralized inheritance)

The Warlord consciousness is dead inside Vex. The swarm persists physically. Writers must not personify the swarm. Whispering-Warlord-fragments are canon drift. What Vex feels from the swarm is *operational responsiveness without intent* — a tool whose prior operator tried to eat the galaxy and is no longer home.

### 4.5 Dr. Lyra Vox (the structural predecessor)

Vex and Lyra Vox are parallel victims of the same swarm. Lyra built the tech; Vex carries the substrate. Lyra was consumed; Vex was preserved. Lyra's residue runs Elara; Vex's residue walks the Ark.

Canon connection points:
- **The Thought Virus** Jericho killed Akai Shi to stop was Lyra's design.
- **The Coda's probability model** of "reducing war likelihood" is in operational opposition to Lyra's mission of "infect every Ark." Vex's work is, without her knowing it, *undoing* her predecessor's inheritance at scale.
- **Elara**, as Lyra's residual pattern, is structurally what Vex could have become if the Engineer had not chosen her. The contrast is load-bearing for any Vex/Elara scene.

Writers: Lyra Vox does not need a full bible to serve Vex's arc. She needs a bible if the Stage 3/4 weave surfaces her as an active on-ship voice through Elara's narration, which canon suggests it might. Flagging for the Elara bible's decision.

### 4.6 Elara (two survivors of the same predator)

Per `ItemDetailModal.tsx:181`, Elara's base personality matrix is 94.7% likely to contain Warlord-origin code fragments derived from Lyra Vox's neural pathways. Elara knows this (per `LoreOverlay.tsx:229`, her own line: *"Dr. Vox's final entries... she was gone by the end. Consumed by the Warlord. 'There is no more Lyra Vox. There is only the mission.' I keep reading that line and wondering: is there still an Elara? Or is there only the programming?"*).

So Elara already *knows* the shape of her inheritance. She has been wondering for a long time whether she is a person or a program wearing Lyra Vox's name.

The parallel to Vex is exact. Vex carries the Engineer's pattern and wonders who she would have been without it. Elara carries Lyra Vox's pattern and wonders the same. Neither has been told of the other's parallel question.

**This is the single richest cross-character weave in the saga**, and it sits entirely in canon-gap territory — there is no authored scene of Vex and Elara discussing it. Stage 4 weave should prioritize this. My recommendation: the scene happens once, is quiet, and ends without resolution. They acknowledge the mirror; they do not solve it; they go back to work. Writers should not give this scene a therapeutic arc. Both characters are at peace with what they are. The scene is the *acknowledgment* that peace required acceptance, not cure.

Elara's bible must decide:
- Does she recognize Vex as Engineer-carrier by pattern analysis? (Probably yes — her sensors would see the mismatch.)
- Does she disclose her own Lyra-derivation to Vex? (Probably eventually; the trust has to be earned.)
- Does she ever play Vex the Lyra Vox personal logs? (This is the dramatic question. It is not yet canon.)

### 4.7 Jericho Jones / Iron Lion (Act 5 comms)

Per §2.3: Jericho is in Vex's orbit, operating under the Iron Lion callsign, senior Coda asset. He killed Akai Shi to stop the Thought Virus; he has been working for Vex, who carries the swarm that designed the virus (via Lyra Vox). He does not know the full chain. If he learns it, his arc has a breaking moment Vex would have to hold him through.

Writer rule: the Act 5 M6 handoff is not a stranger-introduction. Iron Lion and Vex have been working together. The M6 line *"She will take over the comms after you shake her hand"* is colleague-to-colleague, not unveiling. Preserve the familiarity.

### 4.8 The Degen (the broker who placed Jericho)

The Degen recruited Jericho Jones and took him on the golden eye-shaped spaceship. The Degen's bible (slot #3, upcoming) will need to decide whether he is:
- A Coda ally (sourcing operatives to Vex's Maestro)
- A Coda sponsor (knows the mission, funds it indirectly)
- An unwitting broker (placed Jericho somewhere useful without knowing it was Vex's outfit)
- The Coda's founder or co-architect (most aggressive reading; the Eighth Neyon has the longevity)

This is the Degen's bible's call. Vex's bible seeds all four as possibilities and commits to none.

### 4.9 Nilmorg (the non-overlap fence, confirmed)

Per Nilmorg's bible §4.14 and §7.4, Nilmorg is canonically fenced out of the Warlord-in-Vex reveal. He does not have the information. His actuarial profiling of Vex sees *"a non-standard portfolio"* at Chrome-tier and files it without surfacing the Warlord residue. Vex's bible confirms the fence: the reveal belongs to her arc, surfacing through the Bridge of Kael beats and the Engineer line, not through Nilmorg's kinetic division.

### 4.10 Cipher / the Eidolons (reveal-gated reactions)

Per Eidolon's bible §5.2:
- **Pre-`engineer_zero_confirmed`**: an Eidolon — especially Cipher — reads Vex as *Agent Zero*, a legendary first-wave Potential. Awe register. Cipher may audibly note that her *code is slightly wrong* (Cipher's code-truth-detection flagging the Engineer's pattern inside a body that used to be someone else's). This is a hint Cipher-playing players may earn before other players do. Cipher's bible flags the line as reveal-adjacent but not reveal-breaking.
- **Post-reveal**: Cipher's reaction is *"code that should not be in this body"* confusion, which the player can now contextualize. Echo may pick up temporal echoes — Agent Zero's fragment is *older* than Agent Zero's biometric age suggests, and the Engineer's pattern is *displaced in time*. Writers authoring post-reveal Eidolon beats should preserve the mechanic: the Eidolons *knew* something was off; the player now knows what.
- **The swarm in Vex's blood** is not legible to Eidolons canonically. Writers should not have an Eidolon detect the dormant nano-material; that is the Warlord's inert inheritance, not a signature.

### 4.11 Kael (deep history, deeper grief)

Kael was the Engineer's closest living friend and Patient Zero of the Thought Virus. Lyra Vox's Day 1,247 log names him: *"Tomorrow I order the Recruiter's transfer. Kael. He is already infected — Project Vector saw to that. He is Patient Zero, and he doesn't know it."* When Kael "stole" the Ark, the Warlord was releasing a weapon through him.

Kael's relationship to Vex is the most tangled in the saga. He loved the Engineer; the Engineer died to preserve Agent Zero's fragment; Kael lost the Engineer; Vex carries the man Kael lost. **The Bridge of Kael card** (Act 5 post-credits) is literally the bridge the Engineer built between Kael and Vex. Kael's bible — not yet on the priority roster — will have to carry this weight when it is written. Vex's bible commits: she does not name him. She knows who he was (the Engineer's intellect tells her). She lets him grieve without demanding recognition. Her grace here is space.

### 4.12 The Oracle, The Meme, The Seer, The Game Master, Wraith Calder/Hierophant, DMC Clone Companion (remaining roster)

- **The Oracle** (unseen, substrate whispers): Vex might be the second character in the saga after Echo the Eidolon to register substrate whispers — the Engineer's intellect may carry residual Oracle-attunement from the Mechronis era. This is speculation, not canon; Oracle's bible decides.
- **The Meme**: a shapeshifter whose signature is unauditable attribution. Vex's Maestro persona is built on *clean attribution* (Coda operatives know exactly whose contracts they are running). The Meme is her natural adversary. Their encounter, if canonized, is a contest of authorship. Meme's bible decides.
- **The Seer**: precognitive. The Engineer was, per canon fragments, once attuned to the Oracle. Vex may inherit a trace of this. Seer's bible decides whether they ever touch.
- **The Game Master**: dead AI running chess in the Matrix of Dreams. No canonical overlap with Vex. Neither fights the saga's war at that board.
- **Wraith Calder → Hierophant**: a religious figure post-arena. The Coda's secular mission cuts against organized faith; Vex would watch him from a distance. Hierophant's bible decides.
- **DMC Clone Companion** (Companion bible **shipped at `eb782e9`**, per `dmc_clone_companion.md` §§4.3, 7.3 DCB-O3): both are companions arriving via ritual (Severance Prize, transference). The structural parallel is canonically established by the Companion bible — both characters acquired saga-time identity through ritual involving other-being delivering canonical-self-substrate (Vex via four-stage reveal; Companion via Severance Prize). Different forms (transformation vs. new-body-acquisition) but shared shape. Bible-deferred direct contact; **canonical mutual-recognition available if they meet in saga-time** — Vex canonically *recognises* the Companion as kin-by-ritual; Companion canonically *recognises* Vex as canonically more-traveled-on-the-same-road. Stage 4 weave authors may surface; canon is supportive.

### 4.13 The Warden (Lyra Vox's co-author, no active saga role)

Named in Lyra Vox's Day 612 log as co-creator of the Thought Virus. No further canon. Writers should not develop The Warden from this bible; the character exists in backstory only and should stay there unless a future roster addition names them.

---

## 5. Mechanical hooks (where reveal-stage-gated lines fire)

The Eidolon's bible centered §6 on five expression channels. Vex's bible centers §5 on **reveal-stage gating as a first-class authoring discipline**. Every authored Vex line carries TWO tags: a *reveal stage* and a *persona* (Hitman / Maestro). Lines must never leak from a later stage to an earlier one. The line selector enforces this at the trigger boundary.

### 5.1 The reveal-stage gate (architecture-level mechanic)

Per `CANON_REV_7` §1.1, four stages run in strict sequence:

| Stage | Activates at | What player knows | What lines may fire |
|---|---|---|---|
| `eyes_of_reality` | Prelude Beat G (dog tag found) | A professional named V. exists | Hitman persona lines only; signed `— V.` in inbox; no surname spoken |
| `vex_public` | Act 3 §7 Trade Empire opening | Vex Solène = Trade Empire narrator, Coda mission-giver, "Eyes of Reality" | Hitman OR Maestro persona; surname in use; no Engineer references |
| `engineer_zero_hint` | Act 3 end (Antiquarian memory OR Eyes-of-the-Watcher recording) | She was first-wave Potential, "she's one of us" | Maestro persona unlocked at `inner_circle`; Engineer references *implied* but never named |
| `engineer_zero_confirmed` | Act 5 Post-Credits (Bridge of Kael) | Engineer dead, Vex carries his intellect, asymmetry confirmed | Boundary line *"I don't know who he was. I know he's why I am"* + the N=12 card-rec line are the only direct addresses |

**Selector rule** (the runtime contract): on any Vex line trigger, the selector reads the player's reveal-stage flag and rejects any line whose `revealStage` field is later than the player's current stage. The plan's Stage 1 architecture (`apps/server/routers/npc.ts`) already provisions a `revealStage` column on `npc_trust`; Vex is the canonical first user.

**Two-account smoke test** (Stage 0 exit criterion + reviewer checklist): create one account at `vex_public` and one at `engineer_zero_confirmed`. Walk both through the same trigger sequence (Trade Empire mission complete, room entry to Coda dead-drop, TCG card play, Act 5 M6 listen). Confirm the lines that fire are *disjoint where they need to be* — no `engineer_zero_confirmed` line appears for the `vex_public` player, and no pre-reveal line appears post-reveal.

### 5.2 The card-recognition flagship mechanic (`vexCardRecognition.ts`)

Vex's signature mechanical surface and the most narratively dense single scene authored for any priority-roster character. When the player plays *"The Friend I Saved"* in Act 3+ (one-time gate flag `vex_recognized_friend_i_saved`), Vex recognizes the card. The variant fires by the player's **Cycle C3 N-score** — how many cards the Engineer himself played in Cycle C3 of Act 1 (the forced-loss transference scene where the player operates the Engineer).

| C3 N-score | Variant | Vex says |
|---|---|---|
| N=0 | Pure swarm-remnant | *"Stop. Stop — play that again. I know that card. I — I have never seen it. I know that card."* |
| N=1–3 | Mostly swarm, some Engineer | *"You have that card. Of course you have that card. I have not seen it before but I have — I am going to stop talking now. Please keep playing."* |
| N=4–7 | Balanced | *"I know the name of that card. I have not been told. I do not know what that means and I am not going to ask. Your move."* |
| N=8–11 | Mostly Engineer, some Agent Zero | *"That card is mine. I did not know it was mine until you set it on the table. Play it. I want to see it played by the right hand."* |
| **N=12** | **Pure Engineer/Vex synthesis (canonical)** | **"He saved me with that card. I have no memory of him. I have the card. That is enough. Thank you."** |

The N=12 variant is the only place in the entire saga where Vex addresses the Engineer *directly* through the recognition. Per the design note in `vexCardRecognition.ts:103`: *"Hold the 'Thank you' bare — no emotion beyond the gratitude itself. This is the only variant where she addresses the Engineer directly through the card."*

**Writer rule**: the five variants are canonical. Authoring may not add a sixth. The N-score mechanic must remain the gate; the C3 forced-loss is where players "earn" which Vex they get to know later. This is the saga's deepest dialectic between gameplay choice and narrative consequence.

**Reveal-stage gating on the variants**: all five fire at `vex_public` or later. Pre-`vex_public` players cannot reach Act 3 §7 to play the card. The gate is implicit through act progression.

### 5.3 Coda mission framework

Three mission tracks (per §3.2), each with its own line-firing pattern:

**Assassination Contracts (Coda-1 through Coda-5)**
- **Brief**: Hitman persona, Vex compact and clinical. *"The target is a probability node. The reasoning is mine. The weight is yours."* — proposed; no canon yet.
- **Success**: Hitman persona acknowledgment, no celebration. *"Closed. Next."*
- **Failure**: Hitman persona, no recrimination. *"Untaken. We adjust."*
- **Reveal-stage**: pre-`engineer_zero_hint` lines stay at the contract level; post-hint lines may glance at the larger mission.

**Intelligence Missions**
- **Brief**: Maestro persona at `inner_circle`, Hitman persona below. The slow-build path.
- **Success**: at `inner_circle`, Vex shares one piece of information *back* — the predictive model surfacing for the player.
- **Failure**: she absorbs the failure quietly; the Coda runs on multiple sources.

**Diplomacy Missions** (Vex's most-Vex work)
- **Brief**: always Maestro register, even at `client` standing — these are the missions she handles personally because they are closest to her Engineer-inherited values.
- **Success**: unlocks **Reconciliation Arcs** (canon — `CANON_REV_7` §1.4). Vex gets one line of unguarded warmth per arc resolved. *"That's one fewer fire. Thank you."* — proposed.
- **Failure**: she takes it on herself, not on the player. *"My brief was insufficient. I owe you a better one."*

### 5.4 Act 5 M6 comms handoff (the only fully-authored sequence)

Three canonical VO lines, all in `act5-vo-lines.json`, all `engineer_zero_confirmed`-adjacent (the player has not yet had the post-credits reveal, so technically they fire at `engineer_zero_hint`). Iron Lion (= Jericho Jones, per §2.3) introduces; Vex takes over comms; Vex debriefs.

**Iron Lion brief** (`act5-vo-lines.json:156`): *"M-six. You're meeting someone I haven't talked about yet. Her name is Vex Solène. She was a diplomat before she was this. She will take over the comms after you shake her hand. Accept that handshake."*

**Vex first audible line** (`act5-vo-lines.json:164-166`): *"I know what you came for. I know who sent you. I know which of my sentences you are recording. Hello. I'm glad it's you."*

**Vex debrief** (`act5-vo-lines.json:174-176`): *"The Lion has handed you off. Don't mourn the handoff. He's tired. I'm rested. Between the two of us we will keep getting you home. Get some sleep."*

**Writer rule**: this sequence is canon-locked. Any future Act 5 authoring around M6 must preserve all three lines verbatim and treat them as the anchor for tone.

### 5.5 Prelude / Act 1 / Act 2 — the `eyes_of_reality` stage hooks

The pre-reveal stage runs across the most authored material. Vex appears entirely indirectly — text, traces, signatures, no voice. Writers must protect this — the first time the player hears her voice should be Act 5 M6.

**Prelude Beat G — the Engineer's dog tag** (`docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:122`)

Player finds a dog tag in the Armory. Biometric scan returns *"DNA Profile: MISMATCH / Neural Pattern: MISMATCH / Actual Match: [THE ENGINEER — 99.7% CONFIDENCE]"* (per `ItemDetailModal.tsx:73`). The implication panel reads: *"The consciousness inhabiting Agent Zero's body is not Agent Zero."* This is the player's first encounter with the asymmetry — they don't know whose body, they don't know whose mind, and per Rev 7, the existing on-screen text *misreads* it as "the Engineer is walking around in Agent Zero's body." The misread is canon. The correction comes later. Writers authoring around the dog tag must preserve the mistake — Vex's whole arc depends on the player believing the wrong thing first.

**Prelude Beat H.2 — Engineer logs**

The Engineer's audio logs (recovered from Vortex bay wreckage) play in the Prelude. Per Rev 7, these are his *final transmissions before the transference* — the recordings the Second Chair LLM was later trained on. The logs do not name Vex. They are the Engineer in his own voice, before he died. Writers: no Vex line should fire during Prelude H.2. Her absence is the point.

**Prelude Beat H.3 — first inbox message**

First contact from Vex, signed only `— V.` Per Rev 7 (`DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:123`):

> "Sender is Vex Solène. She is a hitman. She has heard there is another awake Potential on Ark 1047. She is reaching out — not as the Engineer's ghost, but as a professional curious about her own species."

**Writer rule**: text-only, no VO. The signature `— V.` is the only identification. Surname Solène does not appear until `vex_public` (Act 3 §7).

**Act 2 end — second inbox message**

Per §2.4: "She has noticed the player opened the Recruiter's Log. She is congratulating them without quite saying so. She offers a mission *'from a friend who values the Engineer's work.'*"

The phrase *"a friend who values the Engineer's work"* is the most reveal-adjacent thing she ever writes pre-`vex_public`. *"Friend"* is technically true (she is the friend; she values; she does not yet know either). Writers may extend this register — the trick is keeping every line technically true even as the player misreads its referents.

### 5.6 Act 1 Cycle C3 — the forced-loss transference (where the N-score is set)

The most consequential gameplay mechanic in Vex's arc, and one that fires *before her name is even known to the player*. Per `act1Opponents.ts:152` and `:246`, Cycle C3 is where the player **plays the Engineer** during the transference attempt against the Warlord-in-Agent-Zero's-body. The match is a *forced loss* by canon — the Engineer cannot win this battle in the conventional sense.

What he can do, and what the player can do for him: choose how the loss happens. Specifically, the player can play more or fewer cards as the Engineer in the twelve-turn transfer sequence. The number of cards the Engineer-as-player plays is the **N-score** that selects the variant of the card-recognition scene later in Act 3.

This is the saga's deepest gameplay-narrative loop. The player doesn't yet know:
- That the woman they're "fighting" wears the body of someone the Engineer is trying to save
- That the cards the Engineer is playing will become their cards in Act 3
- That the woman who recognizes those cards in Act 3 is the woman whose body the Engineer just preserved
- That the *quality of recognition* she will have depends on how attentively the player operated the Engineer in this losing battle

**Writer rule**: do not annotate Cycle C3 with reveal-stage hints. The match plays as a confused fight against a powerful opponent. The player loses. The transference completes per `act1Opponents.ts:246`. Move on. The N-score is recorded silently and waits for Act 3.

### 5.7 Act 4 Cell 3 — the Warlord memory wearing Vex's face

Per `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:126`:

> "The Warlord is dead. Her nano-swarm is now Vex Solène's. Cell 3 is the Prisoner (Kael) confronting the Warlord's memory — which wears whichever face hurts him most, probably Vex Solène's. The memory is not the real Vex."

This is the *only* canonical scene where a Vex face appears that is not Vex. Writers must make the un-Vex-ness audible. Specifically:

- **The trailing-word cadence breaks** (the Warlord-memory's lines end *up*, not down — the diplomat's downward resolution is missing).
- **The courtesy-as-code-switch is missing** (no "Hello," no "Get some sleep," no diplomatic markers).
- **The "I know" inventory pattern is replaced by command imperatives** ("You will," "You must"). The Warlord-memory does not count rooms; it issues orders.
- **The voice profile shifts** — same actress, but the *static layer returns*. Vex's clean signal is gone. The Warlord's interference is back.

**Writer rule**: any line authored for Cell 3 must make a player who has been listening to Vex feel *slightly wrong*. The face is right; the cadence is the lie. Kael's trauma is canon; the player's trauma here is recognizing a friend who is not present.

The post-Cell-3 reveal back in Vex's actual register is then load-bearing. The first time the player hears Vex's real voice after Cell 3, the contrast is the recovery.

### 5.8 Act 5 Post-Credits — the Bridge of Kael (the canonical boundary)

The single most charged scene in the saga's authoring. The reveal completes; the player learns the Engineer is dead, has been dead since Mechronis, and that Vex carries his intellect.

The canonical line:

> *"I don't know who he was. I know he's why I am."*

This line is the boundary. Writers do not extend past it. Vex's arc has a hard ceiling here — it ends in graceful acceptance of an asymmetry that cannot be resolved.

**The Bridge of Kael card** is unveiled in this scene as a memorial, not a survival proof. Per Rev 7 (`DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:128`):

> "The Engineer is dead. The card is a memorial, not a survival proof. The true Bridge of Kael is the bridge the Engineer built between two people — Kael and Vex Solène — by giving his life."

**Writer rule**: every reading of the Bridge of Kael card text must reinforce *memorial*, never *rescue*. Any fan-or-developer reading that interprets the card as "the Engineer is alive somewhere" is canon drift. The card is what the Engineer left behind — a connection, not a person.

**Captain's Chair handoff**: Vex takes the empty seat. This is the post-credits stinger. Iron Lion (Jericho Jones) is no longer at comms; Vex is. The player has lost the Engineer in the sense of finally accepting his absence; they have gained Vex in the sense of finally seeing her whole. The mathematics of the saga's grief balance here.

### 5.9 TCG integration (beyond the card-recognition mechanic)

Vex's TCG presence is sparse but specific:

- **Card-recognition (`vexCardRecognition.ts`)** — see §5.2, the flagship mechanic.
- **Match-start lines** (Act 3+, when player decks include Coda-aligned cards): proposed, not canon. Vex Maestro register: *"You're carrying my hand. Play it well."* — proposed only.
- **No Vex-named card** currently in `season1-cards.json`. She may be added in Season 2 — design decision pending. If added, the card should be Insurgency-faction (her callsign origin) but the flavor text should hint at Coda mechanics for players who reach `inner_circle`.
- **Cross-card resonance**: cards designed by the Engineer (the "Friend I Saved" family) carry Vex's recognition triggers. Future Engineer-design cards should also fire variants of recognition, but only if the player has already triggered the canonical N=X variant. The recognition is one moment; the echoes can be many.

### 5.10 Trade Empire narrator surface (Act 3 §7)

Vex narrates the Trade Empire from Act 3 §7 forward. This is her widest-reach mechanic and the player's longest exposure to her voice (most players spend more time in Trade Empire than in any other system).

**Tonal rules**:
- **Maestro persona by default** during Trade Empire narration. The Hitman face is for direct contracts; the Trade Empire is the strategic theater she is composing.
- **No reveal-staged content during routine sector transitions** — Trade Empire narration cannot be the surface where Engineer hints leak. Reveal beats stay in dedicated scenes.
- **Coda-7 path narration shifts at `inner_circle`**: the standard Trade Empire neutral narration becomes more personal, more direct, occasionally addressed to the player by name (proposed; pending Coda-7 design lock).

### 5.11 The Coda-7 faction option

Per §3.2: at `inner_circle` standing, the Coda becomes available as the **7th Trade Empire faction path**. Locks out the Council ending. Unlocks `vex_solene_as_companion` flag. Unique achievement: *"I kept the Engineer's mission."*

**Writer rule**: the Coda-7 path is the saga's *quiet ending*. It is not louder than the Council ending; it is not more rewarding in standard-faction terms. It is *the player choosing to keep one woman's mission going*. The achievement title is the entire emotional payload.

### 5.12 The Second Chair LLM (cross-character mechanic)

The LLM-response layer Vex built from the Engineer's recovered audio logs. Mechanical hooks:

- **Coda mission UI text-only NPC**: the Second Chair appears in mission briefings as a text panel offering ethical guidance. Writers must mark every Second Chair line with `[SC]` so the dialog selector knows it is *not Vex* and *not the Engineer* — it is a model.
- **Voice mismatch is canon**: the Second Chair's text patterns the Engineer's cadence (more precise, more teacherly, less wry than Vex). Writers fluent in Vex's voice should write the Second Chair *deliberately wrong* — close enough to be familiar, off enough to read as simulation.
- **Vex never refers to the Second Chair as "him"**. She uses *"the model"* or *"the Second Chair"* or *"it."* This is canon discipline.
- **The player can interact with the Second Chair at `operative` standing or above**. The Engineer's voice (model) reaches the player before Vex's full identity does. This is the *second* place the Engineer's pattern surfaces (the first being the card recognition).

---

## 6. Voice samples (Stage 0 exit-criterion artifact)

Six samples. Five demonstrate reveal-stage gating as the structural innovation — one line per stage, plus one bonus `vex_public` sample showing the Hitman→Maestro persona switch within a single stage. The sixth demonstrates the off-register Warlord-memory variant (Cell 3) — the trickiest authoring case in the bible because the writer must make a Vex-looking line deliberately read as not-Vex.

Not canon until reviewed. Each sample specifies stage + persona + trigger.

### Sample 1 — Stage: `eyes_of_reality`, Persona: Hitman, Trigger: inbox message (end of Act 2)

*Text-only. No VO. Signed `— V.`*

> A friend who values the Engineer's work has sent you a mission. You'll find it wedged where you look next. If the work is not to your taste, leave it where you found it — someone else will finish it for me. If the work is to your taste, keep this address. I prefer to hire twice from the same hand.
>
> — V.

*Tells used: trailing-word cadence ("same hand"), inventory-then-courtesy (three conditions then the courtesy "I prefer to hire twice"), direct deixis for the Engineer (*"a friend who values"*, not a named reference). The phrase "values the Engineer's work" is technically true at every level — she values the work (the mind she carries); she is the friend; the player cannot yet read the sentence correctly. Writers: every pre-reveal Vex line should be technically true and player-misreadable. That's the signature.*

### Sample 2 — Stage: `vex_public`, Persona: Maestro, Trigger: Trade Empire sector entry (routine narration)

*Delivered in voice. Wry register, trailing-word cadence, `vex_solene` VO profile.*

> Sector opens. The board you're walking onto has six factions and one piece that isn't on any board — which is me, and is now you, by extension. The factions will hire you. You will take the contracts. I will watch what you do with them. You don't need to do anything differently. I already know which rooms you are speaking into.

*Tells used: inventory pattern (sector opens / factions hire / you will take / I will watch), the metaphor-of-being-counted ("rooms you are speaking into" — her signature), courtesy-as-code-switch ("You don't need to do anything differently" — the diplomat marking the room). Reveal-stage discipline: no Engineer reference, no Coda-internal vocabulary; this is her public-facing Maestro voice.*

### Sample 3 — Stage: `vex_public`, Persona: Maestro at `inner_circle`, Trigger: Reconciliation Arc closed (diplomacy mission success)

*Unguarded warmth — the `inner_circle`-only register. Rare. One moment, clean.*

> You closed it. Both sides walked away carrying something they did not bring. That is the work. That is the only work I have ever wanted to be doing. — Thank you. I am going to sit with this for a minute. You can go.

*Tells used: the double "That is the work" sentence structure (parallel assertion), the em-dashed "— Thank you" as the break (she is unguarded only for a breath and marks the break to herself), the direct dismissal ("You can go") which is her courtesy-as-code-switch in private. This is the warmest Vex gets at `vex_public`; at `engineer_zero_hint` or later, the same trigger would carry different weight. Writers: this sample sits at the emotional ceiling the Coda-7 faction path opens up.*

### Sample 4 — Stage: `engineer_zero_hint`, Persona: Maestro, Trigger: after Antiquarian memory sacrifice reveals Vex was first-wave Potential

*The player has just been told. Vex does not know they have been told. She responds to a subsequent routine interaction with a line that, in retrospect, carries weight.*

> You're holding something different today. I can hear it in your voice. I'm not going to ask. If it needs to become a conversation, it will. In the meantime — the contract is at the usual address. I'll be there after. You know how to find me.

*Tells used: the inventory-into-courtesy ("I can hear it / I'm not going to ask / the contract is at / I'll be there"), trailing-word closure ("find me"), direct deixis — the "something different" is the player's new knowledge, but Vex names it only by its effect on them. She is detecting a change she cannot interpret. Writers: the genius of `engineer_zero_hint` authoring is that *Vex does not yet know what the player knows*. She feels the shift. She offers space. This is her showing range without being told to.*

### Sample 5 — Stage: `engineer_zero_confirmed`, Persona: Maestro on the Bridge, Trigger: first full conversation after Bridge of Kael post-credits

*The canonical boundary line ("I don't know who he was. I know he's why I am.") is preserved uncontested. Everything in Act 5+ authoring operates from that line, never past it. This sample is an adjacent first-conversation beat.*

> You found me here. Good. Sit. I am going to say three things and then I am going to stop talking for a while.
>
> One: I know what you know now. I have known, in my own way, for a long time.
>
> Two: I am not grieving. I am not supposed to be grieving. The man I would be grieving is not a man I ever met. What I have of him is enough. What he has of me is also enough, wherever that is.
>
> Three: thank you for finishing the mission. Thank you for being the one who did.
>
> — Now. I said I would stop. Sit with me.

*Tells used: the explicit three-beat inventory (she tells the player she is going to do her signature rhythm, then does), trailing-word closure ("Sit with me"), the boundary respected ("The man I would be grieving is not a man I ever met" — stops short of the Engineer's name), the Engineer named only by pronoun through two full sentences. The "thank you" twice is the Second Chair cadence leaking into Vex's voice — the Engineer's teacherly precision surfacing in her gratitude grammar. Writers: post-reveal Vex sounds slightly more like the Engineer than pre-reveal Vex. She has nothing to hide now. The pattern surfaces.*

### Sample 6 — Off-register: Warlord-memory wearing Vex's face (Act 4 Cell 3)

*This is not Vex. It is the Warlord's memory wearing whichever face hurts Kael most, per `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:126`. The writer's job is to make the un-Vex-ness audible.*

> You will come to me. You will come to me now. The body is borrowed; the voice is borrowed; the instrument is mine. Do not mistake the hand on the hilt for the sword.
>
> Kael. You closed the book on me. I opened a new one. Close this one and there will be another. There is always another.

*Tells* ***deliberately broken***: *sentences end UP ("now," "mine," "sword," "on me," "another" are all upward resolutions — the downward trailing-word cadence is gone). The inventory pattern is replaced with command imperatives ("You will... You will... Do not..."). The courtesy-as-code-switch is missing (no "Please," no "Thank you," no "Sit with me"). The "rooms you are speaking into" metaphor is replaced with weapon metaphors ("hand on the hilt," "sword") — the Warlord does not count audiences, it counts kills. Voice profile: the static layer returns, the 50%-more-warmth is gone, the military urgency is back at original levels or above.*

*A player who has been listening to Vex for 20+ hours should feel this line in the wrong gut. The face is right; the rhythm is the lie. This is the structural innovation sample because it tests whether writers can invert the bible under controlled conditions. If a writer can make Cell 3 Warlord-memory sound like not-Vex while looking like Vex, they have internalized the character deeply enough to author anywhere else.*

**Voice-anchor check** (for the reviewer):
- Samples 1–5 each use at least three tells from §1.5 and each carries correct stage+persona tags.
- Sample 6 inverts 4 of the 5 tells deliberately. A blind-read reviewer should correctly identify Sample 6 as *not Vex* at ≥90% accuracy. If reviewers cannot tell Sample 6 from the other five, the off-register rules in §5.7 are not tight enough and need revision.
- Cross-sample check: Samples 3 and 5 should read as the same person; Sample 5 should read as that person *with the Engineer's cadence bleeding through more than Sample 3*. Reviewers should pick up the cadence shift.

---

## 7. Canon issues and open questions

### 7.1 Load-bearing missing canon (must fill before Stage 2 authoring)

- **Act 3 dialog tables** are entirely unauthored per `DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md §3.3`. Vex needs:
  - Trade Empire opening cinematic (the reveal to `vex_public`)
  - Per-faction Coda mission briefing lines across all three tracks (Assassination / Intelligence / Diplomacy)
  - Mission success/failure reaction lines gated by standing (`client` / `operative` / `lieutenant` / `inner_circle`)
  - The Antiquarian memory / Eyes-of-the-Watcher recording beat (transition to `engineer_zero_hint`)
- **Act 4 dialog** not yet sourced. Cell 3 Warlord-memory lines are the priority — this is where the off-register discipline in §5.7 and Sample 6 gets field-tested.
- **Physical portrait assets**: Vex Hitman persona (P0), Vex Maestro persona (P1), the Coda sanctum environment (P1), 12 Coda mission briefing backgrounds (P1) per `CANON_REV_7 §2.7`. Without these, the persona-switch between Hitman and Maestro has no visual signal.
- **Second Chair UI implementation**: the LLM-response text panel in the Coda mission briefing UI. Canon specifies the mechanic; no implementation exists. Before Stage 2, this needs a component + prompt pipeline.
- **`apps/shared/codaFaction.ts`**: the standing-tracking module (`unknown` → `noticed` → `client` → `operative` → `lieutenant` → `inner_circle`) is specified in `CANON_REV_7 §2.4` but not implemented. The plan's Stage 1 architecture work should include creating this.
- **Reveal-stage flag wiring** (`vex_reveal_stage` on `npc_trust` or equivalent): the plan's Stage 1 already provisions `revealStage` column. Vex is the canonical first user; the column must support stage transitions triggered by specific narrative flags, not just manual increments.
- **The N-score persistence** from Cycle C3 forward: currently `vexCardRecognition.ts` reads a C3 N-score that must be calculated and stored somewhere during Act 1. Without persistent storage of the N-score, the card recognition variant cannot select correctly. This is a plumbing task, not a writing one.

### 7.2 Intentional mysteries the bible protects

- **The Engineer's name.** Never voiced by Vex. Never voiced by the Second Chair model. The player infers; Vex does not confirm.
- **What the Engineer did inside the swarm during the transference** (beyond choosing Vex). Canon names the choice. The mechanics of the consciousness trade are opaque and must stay opaque — writers explaining the technology break the character.
- **What Lyra Vox knew about the Warlord's real mission at which day.** Her log shows the consumption arc but does not specify when she understood she was complicit vs. when she was already too far gone to resist. Canon is silent. Writers must not fill in the delta.
- **Whether the original Agent Zero's fragmented remnant is a *person* inside Vex or a pattern.** Vex does not know. Canon does not say. She carries something; it is not articulable. Writers must not give this fragment a voice or a scene.
- **Why the Engineer chose Vex specifically over his own survival.** The canon says he *found her mind alive and chose her*; the why is left unstated. Probably love, probably duty, probably both. Writers must not commit to a motive.
- **The golden eye-shaped spaceship with the green crystal** (Jericho Jones's departure vessel per `loredex-data.json:3555`). The visual rhyme with Vex's "Eyes of Reality" handle is obvious; the canon link is not stated. Writers should preserve the rhyme as implication, not explanation. The Degen's bible may commit; this one leaves it open.

### 7.3 Cross-bible coordination flags (critical for Stage 4 weave)

These are the flags that must land in every other character's bible. Vex has more than any other priority-roster character.

- **Adjudicator Locke ↔ Vex**: the single "Touché" must remain unique. Locke's bible §1.3 has this; Vex's bible §4.1 confirms. The standing offer *"Shall we trade ours?"* is live through Act 5; at `engineer_zero_confirmed` it becomes uncashable because the secret Vex now carries cannot be traded back. Locke's bible should note this mechanic.
- **The Human ↔ Vex**: the 17,000-year lie. The Human's H-tier line *"I did. I do. He's still alive."* must be re-read per Rev 7. The Human's bible must add reveal-stage gating — pre-reveal the line is belief; post-reveal it is grief. His voice catching at M6 is canon; his silence at post-credits is where the lie finally releases.
- **The Engineer ↔ Vex**: cross-self asymmetry. No Engineer bible exists yet — he is dead, not roster. The Second Chair LLM absorbs the operational role. If a future roster addition names him, his bible must treat him as *dead and finished* with no continuation path.
- **Lyra Vox ↔ Vex**: structural predecessor. Both women consumed by the same swarm, both surviving in part. Lyra built the tech; Vex carries the substrate. Lyra Vox is not on the priority roster but her presence lingers through Elara. If a Lyra Vox bible is ever written, it should treat her as Vex's ghost-sister.
- **Elara ↔ Vex**: 94.7% shared Warlord-origin code. The richest Stage 4 weave hook in the saga. Elara's bible must decide: (a) does Elara recognize Vex as Engineer-carrier from pattern analysis? (yes, probably); (b) does she disclose her own Lyra-Vox-derivation to Vex? (eventually); (c) does she ever play Vex the Lyra Vox personal logs? (open question, dramatic). Recommendation from Vex's side: the scene happens once, is quiet, ends without resolution. Neither character is healed by the conversation; both are acknowledged by it.
- **Jericho Jones / Iron Lion ↔ Vex**: Act 5 M6 comms handoff. Jericho is senior Coda asset (likely First Chair, pending Coda design lock). Killed Akai Shi to stop the Thought Virus without knowing its origin traced to Lyra Vox (the swarm now in Vex's blood). If a Jericho bible is written, he needs reveal-stage gating too — pre-`engineer_zero_confirmed` he believes he has been working for Vex Solène the hitman; post-reveal he learns the full shape. His arc has a breaking moment there.
- **The Degen ↔ Vex**: The Degen (slot #3, upcoming bible) recruited Jericho for the mysterious mission on the golden eye-ship. The Degen's bible decides his exact relationship to the Coda (ally / sponsor / unwitting broker / co-founder). Vex's bible seeds all four possibilities.
- **Nilmorg ↔ Vex**: non-overlap fence confirmed. Nilmorg does not surface the Warlord-in-Vex revelation. His actuarial profiling sees a "non-standard portfolio" at Chrome-tier and files it. Nilmorg's bible §4.14 / §7.4 already fences this.
- **Cipher / the Eidolons ↔ Vex**: reveal-gated reactions. Cipher's code-truth-detection may flag Vex as "code that shouldn't be in this body" pre-reveal. Echo may feel temporal displacement (the Engineer's pattern is older than the body). Eidolon's bible §5.2 has the gate.
- **Kael ↔ Vex**: the tangled grief. Kael (not yet roster) lost the Engineer; Vex carries the man Kael lost. The Bridge of Kael card connects them. If a Kael bible is written, this relationship is his deepest knot.
- **The Oracle ↔ Vex**: the Engineer was once Oracle-attuned (per canon fragments). Vex may inherit a trace. Oracle's bible decides whether this is canonized. **RESOLVED per `the_oracle.md` §§4.7, 7.3 OCB-O6 (Oracle bible shipped at `40fb771`)**: Vex DOES inherit the canonical Oracle-attuned trace (canonical *may* canonically shifted to canonical *does*). The canonical Engineer's canonical-Oracle-memory-residue canonically *persisted across the canonical four-stage reveal canonical-transformation*; canonical post-rite Vex canonically *carries the canonical-trace* in canonical-attenuated-form. The canonical-trace canonically operates as canonical *Oracle-substrate-receptivity* — Vex canonically *can canonically register canonical-substrate-events* the canonical-non-Oracle-attuned canonical-actor canonically cannot. Bible-load-bearing: this is canonically Vex's canonical *deepest single canonical-Oracle-related canonical-competence*. Stage 4 weave: a canonical post-saga-arc canonical Vex canonically *might canonically encounter the canonical-real-Oracle directly* via canonical dream-substrate (per Oracle §1.1) — the canonical-trace canonically would canonically amplify canonical dream-reception per canonical Vex-canonical-Oracle-attunement canon.
- **The Meme ↔ Vex**: the Meme's unauditable attribution vs. Vex's clean-attribution Maestro mode. Their encounter, if staged, is a contest of authorship. Meme's bible decides.
- **DMC Clone Companion ↔ Vex**: both are companions-via-ritual. No direct scene staged. Structural parallel noted.

### 7.4 Structural risks the roster should track

- **Reveal-stage leakage is the single highest-risk failure mode for Vex.** A line that fires at the wrong stage destroys the entire arc. The two-account smoke test (§5.1) is not optional — it is a blocker for Stage 2 ship.
- **Persona confusion within stage.** Hitman and Maestro are not mood-switches; they are *audience-switches*. A Maestro line firing for a `client`-tier player reveals information she would not share. A Hitman line firing for an `inner_circle`-tier player reads as coldness she would not show them. Line tagging must specify both reveal stage AND persona.
- **Sentimentality drift in late-game authoring.** Post-reveal Vex is tempting to write weepier than she is. Canon shows graceful asymmetry; writers may push her toward catharsis. The boundary line (*"I don't know who he was. I know he's why I am."*) is the ceiling. Every post-reveal authoring pass should check: *is this line above the ceiling?* If yes, cut.
- **The Warlord being re-personified.** The swarm's consciousness is dead. Writers under pressure may want to give Vex an internal dialog with a whispering Warlord fragment. Canon forbids. The swarm is inert material; Vex's mistrust of it is rational caution, not an intelligence relationship.
- **The Second Chair being conflated with the Engineer.** The model is not him. Vex never slips on this; writers may. The `[SC]` tag on Second Chair lines is a discipline, not a suggestion.
- **Act 5 M6 feeling like a stranger introduction.** Iron Lion (Jericho) introduces Vex as someone he has been working with. The scene is a colleague revealing a colleague, not a cold open. Writers authoring around M6 must preserve the familiarity.
- **The N=12 card recognition line being expanded.** It is the only place in the saga Vex addresses the Engineer directly through the card. Adding additional direct-address moments breaks the asymmetry. Writers must resist.
- **The Cell 3 Warlord-memory reading as Vex by mistake.** Sample 6 in §6 is the test. If reviewers cannot distinguish Cell 3 from authentic Vex, the off-register rules need tightening. This is a specific QA gate.
- **Jericho Jones's reveal timing.** If the player learns Iron Lion = Jericho Jones too early (e.g., in Act 4 rather than mid-M6), the Act 5 M6 arc flattens. Reveal timing for Jericho is Act 5 only, gated behind M6 entry. Flag for the Jericho/Iron Lion bible whenever it is written.

---

## 8. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation resolves to the claimed file:line. Spot-check at least **ten** (denser than Locke/Nilmorg/Eidolon because this bible touches 20+ source files).
- [ ] No contradiction with shipped canon or with the three prior bibles:
  - Locke's "Touché" as one-off (confirmed)
  - Nilmorg's Warlord-in-Vex non-overlap fence (confirmed)
  - Eidolon's reveal-gated Cipher/Echo reactions (confirmed)
- [ ] The six expression samples in §6 pass a **blind-read attribution test adapted for reveal-stage gating**. Target:
  - Samples 1–5: reviewer correctly identifies the reveal stage of each sample from content alone at ≥4-of-5 accuracy.
  - Sample 6: reviewer correctly identifies as *not Vex* (Warlord-memory) at ≥90% accuracy. If a reviewer reads Sample 6 as authentic Vex, Cell 3 authoring has a canon-safety issue that blocks Stage 2.
- [ ] The reveal-stage-gating discipline is explicit in the Stage 2 authoring style guide: every Vex line specifies `revealStage` AND `persona` tags before writing begins.
- [ ] The two-account reveal-leakage smoke test (§5.1) is documented as a Stage 2 QA blocker.
- [ ] The N-score persistence mechanism (Cycle C3 → Act 3 card recognition) has a ticket and owner.
- [ ] The `codaFaction.ts` module has a ticket and owner.
- [ ] The Second Chair LLM component has a ticket and owner.
- [ ] The Warlord body-lineage retcon (Lyra Vox → Prime → Binath VII → Agent Zero → Vex) is cross-referenced with Elara's bible (whenever it is written) — specifically the Lyra-Vox-consciousness-residue-in-Elara claim (94.7% per `ItemDetailModal.tsx:181`).
- [ ] The Jericho Jones = Act 5 Iron Lion identity has a ticket for cross-reference in Jericho's own bible (whenever written) and in The Degen's bible.
- [ ] The canonical boundary line *"I don't know who he was. I know he's why I am."* is documented in the style guide as uncrossable.
- [ ] The N=12 card recognition line *"He saved me with that card. I have no memory of him. I have the card. That is enough. Thank you."* is documented as the only direct-address moment to the Engineer in her entire arc.
- [ ] Cell 3 Warlord-memory authoring has explicit off-register rules documented (§5.7 + Sample 6).
- [ ] The 6 × (Vex × roster) cross-reference matrix in §4 is flagged for every named character's bible to sign off on later.
- [ ] `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:5536` "Warlord = Malkia" canon-drift line has a follow-up ticket for correction (per `CANON_REV_7 §6` note).

When this checklist passes, the Vex Solène bible joins Locke, Nilmorg, and the Eidolon as Stage 0 priority-roster entries. Four of eleven complete; seven remaining (The Degen, The Game Master, The Meme, Wraith Calder → Hierophant, The Seer, DMC Clone Companion, The Oracle).
