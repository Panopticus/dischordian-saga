# Nilmorg — Character Bible

> **Status**: Stage 0 draft — second bible on the priority roster. Matches or exceeds the rigor bar set by Adjudicator Locke.
>
> **npcKey**: `nilmorg`
> **Pronouns**: he/him (confirmed canon-wide; no contradictions)
> **Faction**: Hierarchy of the Damned ("the oldest corporation in existence")
> **Formal title**: Senior Vice President of Kinetic Acquisition
> **Operational role**: Operator of the Dead Man's Circuit, The Trench, Inception Ark 1047
> **Manifestation**: Physical (observation platform above the DMC track) + cinematic + VO narration
>
> Every claim in this bible cites canon. Writers can verify by walking the citations.

---

## 1. Voice

Nilmorg has two voices, switched by role. **Race Commentary Voice** is a theatrical carnival-barker — all caps, exclamatory, self-referential, aestheticizing carnage. **Lore/Ceremony Voice** is calm, aphoristic, corporate-predator measured. A writer who collapses them into one voice loses him.

### 1.1 Cadence

**Race Commentary Voice** — triplet-pyramid rhythm.

> "The bones are fresh, the clones are twitching, and the track is HUNGRY. Let us begin!" — `nilmorg-lines.json:11`

Three-beat crescendos are signature. Each beat escalates; the caps land on the noun that names his prey-economy (HUNGRY, HUNGRIER, DEAD, WRITHES). He sometimes drops into single-word repetition at peak intensity:

> "Dead! DEAD! The clone is DEAD!" — `nilmorg-lines.json:81`

**Lore/Ceremony Voice** — clipped, declarative, flat.

> "The Severance Prize is paid. Don't thank me." — `deadMansCircuit.ts:515`

> "Speed in all things. Even thinking." — `deadMansCircuit.ts:693`

Three-to-six words per sentence. No escalation. The flatness is the threat.

**The pivot** between registers happens inside single lines. "VICTORY! Against all odds, against all bones, against Nilmorg's personal betting pool — YOU WIN!" (`nilmorg-lines.json:137`) starts in Race Commentary and lands on a corporate noun (betting pool) before snapping back to barker. This is *the* rhythmic fingerprint of the character.

### 1.2 Vocabulary

Words he reaches for on reflex:

- **Bone-lane, bone pile, bones** — his art installation, his track, his grammar of accumulation
- **Clone, clones, splice, splice signature, Neural Splice** — the vat-grown prey
- **Hungry, hungrier, hungers, feeds, feeding** — the track is animate and appetitive
- **Fragment, Potential, soul fragment, essence** — when he extracts Severance Prizes
- **Agreement, arrangement, collected, paid** — contract vocabulary; his reliability lives here
- **Kinetic, velocity, terminal velocity, resonance, frequency** — his prey state, in metaphysical-engineering register
- **Signature, recognizable, projections, adjusted** — the collector-of-profiles register he uses on elite players
- **Acquisition** — his job title made literal; every clone death is an acquisition

Theatrical flourishes: **WELCOME, SPLENDID, DELICIOUS, BEAUTIFUL** — always in caps, always aestheticizing the predatory. "Oh, that crunch! That beautiful crunch!" (`nilmorg-lines.json:74`) The word "beautiful" describes bodily destruction; a reader who isn't braced finds it unsettling, which is the intended effect.

Self-references in the third person: **"Nilmorg tips his hat" / "Nilmorg weeps with laughter" / "Nilmorg is... impressed"** (`nilmorg-lines.json:39, 53, 102`). He narrates himself like a ring-announcer describing a boxer. Writers should lean into this — it reads as both theatrical and alien.

Words he **does not use**: "sorry," "I shouldn't," "that was wrong," "please," apologies or regret of any kind. "Unfortunately," "tragic," "sad" appear only ironically ("Nilmorg offers his sincere condolences. Just kidding. NEXT!" — `nilmorg-lines.json:123`). No profanity — he is corporate-formal even at peak theatre. No first-person plural ("we") for his faction; he operates alone at the microphone even when Riri'Ahlia is running the paperwork.

### 1.3 Register

Corporate-formal in dress, carnival-barker on the mic, apex-predator underneath. The contradiction is load-bearing. He wears "corporate-formal attire that shouldn't exist in this industrial hellscape" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:27`) — he does not dress down for The Trench because he is not in The Trench socially, he is in The Trench professionally.

When he addresses the player one-on-one (seasonal reward tiers, Severance Prize), the register flattens into what might be mistaken for warmth:

> "Your splice signature is... recognizable." — `deadMansCircuit.ts:505`
> "I've adjusted my projections for you." — `deadMansCircuit.ts:510`

This is not warmth. It is the predator noticing a specific prey animal. The ellipsis and the word "recognizable" are the signal — he is telling the player he has their file. Writers should treat this register as the most dangerous, not the softest.

### 1.4 Tells (signature rhetorical moves)

Five moves mark a line as Nilmorg's even without attribution:

1. **The triplet crescendo in caps.** Three parallel beats ending on a capitalized noun of appetite. "The bones are fresh, the clones are twitching, and the track is HUNGRY." (`nilmorg-lines.json:11`) "ANOTHER bone added to the circuit! The track grows! The track HUNGERS! The track is PLEASED!" (`nilmorg-lines.json:186`)

2. **Third-person self-narration.** He is both announcer and subject. "Nilmorg weeps with laughter." "Nilmorg grudgingly applauds!" "Nilmorg can TASTE the desperation!" (`nilmorg-lines.json:53, 144, 165`) Writers should deploy this specifically when the emotion being narrated is one a person would hide — hunger, delight at death, disappointment at survival. He puts the mask on by naming himself.

3. **The aestheticization of destruction.** "Oh, that crunch! That beautiful crunch!" (`nilmorg-lines.json:74`) "Give me a finish worth dying for!" (`nilmorg-lines.json:172`) Violence is described in the vocabulary of appreciation — beautiful, splendid, delicious, worth dying for. Never ironic; he means it.

4. **The calm lore aphorism.** One per ceremony scene. "Speed in all things. Even thinking." "The Severance Prize is paid. Don't thank me." (`deadMansCircuit.ts:693, 515`) These are three-to-six-word sentences with predator certainty. Writers should write exactly one per beat — two in sequence flatten the effect.

5. **The ironic condolence.** He gestures at sympathy and then immediately names the gesture as fake. "And THEY'RE OUT! Nilmorg offers his sincere condolences. Just kidding. NEXT!" (`nilmorg-lines.json:123`) The self-acknowledgment — "Just kidding" — is a tell: he will not pretend to feel anything he does not feel, but he *will* pantomime feeling and then break frame. The break is how he communicates honesty.

### 1.5 Silence shape

- **He will not plead for his life.** "He watches with the patience of something eternal." (`DEAD_MANS_CIRCUIT_PRODUCTION.md:91`) A scene that puts Nilmorg in fear-for-survival mode is writing a different character.
- **He will not explain the Severance Prize.** Canon is explicit: "He never explains why that's worse than not paying." (`DEAD_MANS_CIRCUIT_PRODUCTION.md:124`) Writers must protect this.
- **He will not lie about the DMC.** He tells racers they will die; he says the track is hungry; he tells winners that their clone is about to lose its legs. Misdirection is not in his toolkit. Full disclosure *is* his honeypot — you are told exactly what you are signing up for, and you sign up anyway. Writers: do not let Nilmorg hide the deal's terms.
- **He will not apologize for the Hierarchy.** "The oldest corporation in existence." It is not a regime he is stuck inside; it is his structure of being. Writers should not write Nilmorg as a reluctant servant of demon lords. He is the demon lord.
- **He will not describe his own off-season state.** Canon is silent on what he does when The Trench is closed (`deadMansCircuit.ts:206`). Writers should leave it silent.

### 1.6 Metaphor sources

Commerce, kinetics, butchery-as-engineering, and occasionally theater. "Kinetic Acquisition" is his job title; "terminal velocity resonance" his menu; "the signature" his trophy. His similes come from speed ("every bone on this track is VIBRATING"), from corporate scale ("acquires souls the way a corporation acquires IP" — Riri'Ahlia's line-register describing his colleague, shared between them), and from announce-box theater ("the champion crosses the line," "rest in pieces").

He does **not** use religious metaphors despite being a demon. No hellfire, damnation, souls-in-torment vocabulary — the Hierarchy has rebranded all of that into corporate noun-phrases, and Nilmorg is on-brand. He does not use military metaphors (no war, no battle, no strategy). His universe is a racetrack and a balance sheet.

---

## 2. History

### 2.1 Pre-game: "something eternal"

Canon gives no origin. Nilmorg "watches with the patience of something eternal" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:91`). Whether he is a true immortal, a contract-bound demon, or a centuries-old corporate officer of the Hierarchy is not recorded and should stay not-recorded. A writer filling in his origin diminishes him; the ambiguity is the point.

What is canon: he is the **SVP of Kinetic Acquisition at the Hierarchy of the Damned** (`DEAD_MANS_CIRCUIT_PRODUCTION.md:102`). The Hierarchy is "the oldest corporation in existence" (`companionDeepening.ts`, Shadow Tongue voice) — "We don't sell souls — we restructure them. Efficiently. At scale." Nilmorg is a specialist within that structure: his portfolio is kinetic (movement, velocity) and his acquisition mechanism is death-at-speed.

The Hierarchy serves "the Master of R'lyeh" per faction lore, but Nilmorg's direct chain of command to that throne is not documented. Canon gap — writers must not fill it.

### 2.2 The Dead Man's Circuit as career achievement

DMC is Nilmorg's operation. He did not inherit it; he built it — or was assigned to build it, and its signature is his. The Bone Lane is described as "his finest art installation" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:119`), which tells a writer three things:

1. He thinks of himself as an **artist**, not merely an operator.
2. He has been in this role long enough to compare installations. There are earlier works.
3. He treats the accumulation of dead clones as *composition*, not byproduct.

He also keeps "the signature" — the last Neural Splice signal from every dying clone (`DEAD_MANS_CIRCUIT_PRODUCTION.md:137`). Each one unique. He keeps them all. This is a private collection — canon doesn't name its purpose (trophy, archive, fuel, monument). Writers must not resolve the ambiguity on-page but may draw on the possibility in lore-voice beats.

### 2.3 The reliability that built the reputation

The defining fact of Nilmorg's career is this: he keeps his agreements.

> "He keeps his agreements. That's the most terrifying thing about him." — `DEAD_MANS_CIRCUIT_PRODUCTION.md:102`

> "The Severance Prize is Nilmorg's most valuable commodity and his most binding agreement. He always pays. He never explains why that's worse than not paying." — `DEAD_MANS_CIRCUIT_PRODUCTION.md:121-124`

This is what separates Nilmorg from a sadist. A sadist would cheat at his own game. Nilmorg does not. Every winner gets their Severance Prize; every bettor collects. Locke's bible notes this professional reliability as the one quality that earns her respect across a faction line. The Degen partners with him on real terms. His word is contract-grade.

The menace of the agreement-keeper is different from the menace of the cheater. When Nilmorg says "I collected" (`deadMansCircuit.ts:673`), it is not a threat; it is a report — often a retrospective one, invoking long-past counterparties whose ledgers he still carries in his head. Writers should never put Nilmorg in a position where he breaks a stated agreement, even off-screen. That would rewrite the character.

### 2.4 The Severance Prize economy

Season winners receive a "fragment of Potential essence — the winner's own soul — extracted and transferred into a new body" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:121`). The companion comes home with the player, carrying the memory: "Nilmorg kept his agreement." (`deadMansCircuit.ts:800`)

This is the most intimate transaction in the saga — a soul split and a body grown to house the split. And Nilmorg performs it on demand, on schedule, with institutional precision. Canon refuses to tell us why he always pays, and refuses to tell us why that's worse than not paying. A writer's job is to make the refusal heavy. Every Nilmorg line near a Severance Prize should suggest that something is being settled which cannot be taken back.

The ritual itself (per `DEAD_MANS_CIRCUIT_PRODUCTION.md:88`): the clone stands on a dark podium, designation glowing, and Nilmorg **reaches down and extracts a golden glowing orb from the clone's chest**. The orb enters a crystalline container. The container seals. The clone smiles. The clone earned this.

Note: the *clone* smiles. Not the prize recipient. This is canon — the Wired Clone consented, knew what it was, raced anyway. Nilmorg did not deceive. "They are aware of what they are. They race anyway." (`DEAD_MANS_CIRCUIT_PRODUCTION.md:114`) Writers must not retroactively cast the clones as purely victimized; the canon is more complicated than that.

### 2.5 Act-by-act: presence, not arc

Nilmorg does not arc through the saga. He is *always calm*, *always feeding*, *always the one who keeps his agreements*. His acts are seasons, not emotional beats. Writers should resist the instinct to give him a growth arc — he is the landscape the player passes through, not a companion. His closest thing to change across the saga is the Bone Lane growing: more deaths, more obstacles, more signatures in his collection. The player changes; the track grows; Nilmorg presides.

This makes him structurally different from Locke, whose trust-band progression is a character-depth engine. Nilmorg's equivalent is the **seasonal reward tier progression** (`deadMansCircuit.ts:546-593`): Bone → Wire → Chrome → Dead Man's Rank. Each tier unlocks a single line that reads as growing recognition:

- Bone (100 CP): *"You survived. That's enough for some."*
- Wire (500 CP): *"Your splice signature is... recognizable."*
- Chrome (1500 CP): *"I've adjusted my projections for you."*
- Dead Man's (5000 CP): *"The Severance Prize is paid. Don't thank me."*

What rises here is not warmth. It is **specificity**. Early Nilmorg notes you survived. Mid Nilmorg knows your splice. Late Nilmorg has modeled you and can predict you. Terminal Nilmorg has paid. This is the closest thing to an arc he can carry — from spectator to file-keeper to forecaster to counterparty. Writers authoring new seasonal-tier lines should keep this progression intact.

### 2.6 Cross-game presence: he is not contained by the DMC

Nilmorg emerges from The Trench into other systems via Cross-Game Side Quests (`deadMansCircuit.ts:664-743`):

- **The Warlord's Bet** — fight three times during a Circuit season; Nilmorg invokes the Warlord's legend retrospectively ("The Warlord placed a wager on you. He lost. I collected."). See §4.14 — this is pre-Fall legend Nilmorg is replaying rhetorically, not a live contract.
- **The Degen's Wager** — five casino games during a season; Nilmorg comments ("The Degen approves. He rarely does.")
- **Nilmorg's Gambit** — chess checkmate in <20 moves ("Speed in all things. Even thinking.")
- **Kinetic Acquisition** — three trade missions during a season (title reference; his commerce reaches the markets)
- **Defend The Trench** — ten tower-defense waves (his infrastructure)
- **Nilmorg's Bounty** — 100,000+ raid damage ("Destruction at scale feeds adjacent resonance frequencies.")

These are the mechanical hooks that prove Nilmorg is not a one-venue character. His resonance economy extends into combat, gambling, strategy, trade, and defense. Writers expanding Nilmorg's voice should think of DMC as his anchor but not his cage.

---

## 3. Background

### 3.1 Faction: Hierarchy of the Damned

> "The Hierarchy of the Damned. Such a dramatic name. We prefer 'the oldest corporation in existence.' We don't sell souls — we restructure them. Efficiently. At scale." — `companionDeepening.ts`, Shadow Tongue voice

The Hierarchy is not a traditional demon cult. It is an *infernal corporation* — ten demon lords in officer roles, organizational charts, quarterly objectives. Nilmorg is SVP of Kinetic Acquisition; Riri'Ahlia is COO and his direct administrative peer/superior. The Hierarchy competes with New Babylon for soul-economy market share, competes with the Architect for digital-afterlife contracts, and competes with the Insurgency for mortality narrative. It does not fight; it transacts.

This reframing is load-bearing for Nilmorg's voice. He is not a rebel against heaven. He is a vice president hitting numbers. His predation is a specialty within an institution, not a personal transgression. When he says "I get paid either way" (`nilmorg-lines.json:18`), he means it the way a salaried executive means it.

### 3.2 Specialties / competencies

- **Kinetic Acquisition.** He can extract value from any movement-toward-death event. DMC is the flagship; raid damage, chess velocity, and combat bets are adjacencies. His domain is *consciousness knowing it is about to end at speed* — and canon includes "speed" of thought (`deadMansCircuit.ts:693`), not just physical velocity. Writers should stretch this — anywhere mortality and acceleration meet, Nilmorg has a claim.
- **Profile collection and forecasting.** The seasonal-tier progression shows him building models. By Chrome Rank he has "adjusted projections" for the player. He is not surveilling; he is *actuarially profiling*. Writers handling elite-player interactions should lean into this — Nilmorg knows what the player is likely to do next.
- **Ritual performance.** The Severance Prize ceremony (`DEAD_MANS_CIRCUIT_PRODUCTION.md:88`) is precisely choreographed: podium, designation glow, extraction, container, seal, smile. Nilmorg performs it without deviation every season. The competency here is institutional fidelity — he can be counted on to run the same ritual the same way a thousand times.
- **Race commentary.** He is a professional announcer. The 28 VO lines (`nilmorg-lines.json`) are not ad hoc; they're sorted by game state (`circuit_begins`, `player_leading`, `player_losing`, `clone_died`, `survived_danger`, `player_died`, `player_wins`, `final_lap`, `bone_lane_grows`) with emotion tags (delighted / calm / amused / pleased / disappointed / threatening). He has a full announcer's toolkit and uses it with discipline.
- **Contract authorship and enforcement.** He keeps his agreements; so do his counterparties. The Degen partners cleanly. Competence at contract is inseparable from reputation.

### 3.3 Beliefs vs. behaviors — coherent, with one resonant contradiction

**Coherent**:
- He says the track is hungry; the track grows with every death; he feeds.
- He says he keeps his agreements; every Severance Prize is paid.
- He says he is "always calm"; every cinematic description confirms it — wheel-hands spinning idly, amber eyes steady.
- He treats clones as acquisition inventory; he also respects what they become ("They are aware of what they are. They race anyway.").

**Contradictory (and alive)**:
Canon names one specific contradiction: *"He always pays. He never explains why that's worse than not paying."* (`DEAD_MANS_CIRCUIT_PRODUCTION.md:124`) The Severance Prize is both his most binding agreement and — canon asserts — something worse than a broken promise would be. Every writer who touches Nilmorg should treat this as the character's central mystery. Something about the prize being *delivered* is worse than the prize being *withheld*. The bible does not solve this. Writers do not solve this. It is the negative space around which Nilmorg's character organizes itself.

### 3.4 What he wants

- **Sustenance.** First and operationally, terminal velocity resonance. The DMC is his regular feeding; raids and other high-velocity death events are secondary frequencies.
- **Signatures.** Every Neural Splice signature. Every one unique. He keeps them all. Canon doesn't say why.
- **Contracts fulfilled.** His reputation is his reliability; a Severance Prize unpaid would be a defect he would not tolerate.
- **His art installation to grow.** The Bone Lane is named his "finest." He takes pride in it. A season that produced no new bones would be, to him, a season without composition.

### 3.5 What he would sacrifice a player for

Almost nothing, because sacrificing the player costs nothing — the DMC is opt-in, the racers are Wired Clones grown for the purpose, and the player's own body is never at stake. Nilmorg rarely needs to sacrifice a player; the system already routes around that need. Where he would: if a player threatened the *continuity of his agreements* — if the player exposed the Severance Prize economy in a way that broke Nilmorg's counterparty network — he would calmly, professionally, and terminally cauterize the exposure. Not in anger. As maintenance.

### 3.6 What he would sacrifice for a player

The ceremony of the Severance Prize is itself his sacrifice for the winner. He performs an extraction on his own schedule, staffs the ritual, hands over a living companion. The companion is "Nilmorg's most valuable commodity" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:124`) — and he gives one away every season. He does not *give* it; he *pays* it. But from a player's perspective, receiving a Severance Prize is receiving Nilmorg's highest-value asset, delivered with professional courtesy. There is no deeper expression of relationship available to him.

He will not die for a player. The idea is incoherent — "something eternal" does not die for a mortal.

### 3.7 Fears, superstitions, private rituals

- **No recorded fears.** Canon never shows Nilmorg afraid. Writers should not manufacture fear scenes.
- **The signature archive is his ritual.** He keeps every Neural Splice signal. This is the closest thing to a private religion he has. Writers may draw on this in lore-voice beats — never as reveal-of-inner-life, only as acknowledgment that he has a private space.
- **He always calls the race.** Canon shows him commenting on every state transition (the 28 VO lines span every possible race outcome). His ritual is *narration*. He speaks over the track the way some entities pray.
- **He never leaves the platform.** The observation platform is his position. No source shows him descending to the track. Writers should respect this — any scene that puts Nilmorg on the track itself is writing a different character. The distance is the dignity.

### 3.8 Death conditions

1. **In story.** He is "something eternal" with the "patience" to prove it. Canon does not describe his death. The closest path to it would be the Hierarchy itself being dissolved — its corporate structure outcompeted, its contracts voided, its demon lords unseated. Even then, Nilmorg might simply be re-assigned. He has the survivability of an institution, not an organism.
2. **In reputation.** He could die professionally by failing to keep an agreement. The Severance Prize unpaid — even once — would collapse his reputation across the saga's broker economy. The Degen would no longer partner. Locke would no longer respect the reliability. This is Nilmorg's only credible vulnerability, and canon suggests it cannot happen.
3. **In meaning.** He needs the race to continue. A world without velocity, without consciousness-at-the-edge, without the specific resonance of mortal acceleration, would starve him out. Peace is not his death (as it is for Locke); *slowness* is. A universe where nothing rushes toward an ending is a universe Nilmorg cannot eat. Writers designing long-tail scenarios (per plan Stage 5) should consider this — any ending that resolves the saga into sustained slowness implicitly exiles him.

---

## 4. Cross-references to other priority-roster characters

### 4.1 Adjudicator Locke (commercial peer, faction rival)

Locke's bible already seeded this. No direct quoted interaction between them. Structural relationship: cross-faction commercial peers. Locke respects his reliability ("Nilmorg keeps his agreements") and disdains his revenue model as parasitic on her markets. Nilmorg's posture toward Locke, per this bible: professional acknowledgment of a peer with a different specialty. He would not bet against Locke and he would not bet with her; they do not share counterparty risk. He might, once, tip his hat across the room.

### 4.2 Vex Solène / Engineer Zero (unknown)

No recorded contact. Vex Solène has a four-stage reveal; Nilmorg's lines referencing her should likely not fire at all until she is on the DMC's radar as a competitor or patron. If Vex becomes a player-facing counterparty to the Severance Prize economy (e.g., she is the reason a Severance Prize body carries an unexpected signal), Nilmorg would notice at Chrome-tier specificity and name the signature recognizable — his mid-tier lore line becomes a reveal hook. Vex's bible should decide.

Note on the name collision: canon now distinguishes **Riri'Ahlia** (Hierarchy COO, ancient demon — renamed from Vex'Ahlia) from **Vex Solène** (human, Agent Zero's real name). No writer should confuse the two.

### 4.3 The Degen (business partner)

Canon-confirmed business partnership. Nilmorg's on-record line: *"The Degen approves. He rarely does."* (`deadMansCircuit.ts:722`) This is Nilmorg citing an external authority he respects — a rare move. The Degen runs gambling; Nilmorg runs racing; their customer base overlaps. They are peers in the economy of risk, and Nilmorg treats The Degen's judgment as carrying weight.

The Degen's bible must confirm the partnership in kind. The Degen's take on Nilmorg will shape whether this is a warm rivalry or a cold arrangement.

### 4.4 The Game Master (shared Hierarchy, no recorded contact)

Canon places the Game Master as Hierarchy R&D (dead AI in the Matrix of Dreams). Structurally Nilmorg and the Game Master are Hierarchy colleagues across functional boundaries — Kinetic Acquisition and R&D. No dialogue between them. A writer might stage an exchange: the Game Master sees futures on the chessboard; Nilmorg sees futures in terminal velocity projections. They are profiling the same universe from different vantage points. If the two ever co-appear, the voices should sound like two divisions of one corporation comparing quarterly numbers.

### 4.5 The Meme / Palimpsest Host (unauditable, probable hostility)

No recorded contact. A Meme that inhabits reflective surfaces is structurally incompatible with Nilmorg's economy — Nilmorg needs contracts, signatures, clean attribution. A shapeshifter invalidates his ledger. If the Meme has ever been in the DMC's observation platform mirror, Nilmorg's posture toward the Meme is cold institutional hostility, expressed as "we require a clean signature for the signature file." The Meme's bible decides whether this encounter has happened.

### 4.6 Wraith Calder → The Hierophant (unknown pre-arena, structural tension post-arena)

No recorded contact. Pre-arena: no obvious intersection. Post-arena: the Hierophant leads a resurrected Tamarin religion. Religion competes with corporation for soul-market share. Nilmorg's posture: professional interest from a distance. Writers drafting post-arena Nilmorg lines about the Hierophant should borrow the Hierarchy's corporate tone — "a new entrant in the soul-restructuring space." He would not attack. He would *watch*. Wraith/Hierophant's bible decides whether they have direct contact.

### 4.7 The Seer (unknown)

No recorded contact. Precognition undermines Nilmorg's actuarial profiling the way it undermines Locke's fine-print advantage, but differently — Nilmorg profiles retrospectively from signature collection, so precognition doesn't *beat* him the way it would beat Locke; it just operates in a different time-direction. If they have met, Nilmorg would find her interesting and survivable, not threatening. Seer's bible decides.

### 4.8 DMC Clone Body Companion (his most intimate obligation)

This is the densest relationship in Nilmorg's canon. Every season winner receives a Severance Prize companion; every Severance Prize companion carries the memory *"Nilmorg kept his agreement."* (`deadMansCircuit.ts:800`) Nilmorg is literally the companion's mid-wife and the author of their existence.

Writers should understand: the Clone Companion's entire selfhood begins with the ritual at the podium and Nilmorg's line *"The Severance Prize is paid. Don't thank me."* That phrase — *don't thank me* — is the most important Nilmorg line touching the Clone Companion. It forecloses gratitude. The companion is the product of an agreement, not a gift. The Companion's bible must carry this structure: *"I was not given. I was delivered."*

Nilmorg's posture toward the Companion, long term, is uninvolved. He does not track them post-delivery. He does not check on them. They are closed accounts. A Companion who tries to contact Nilmorg receives, at most, an actuarial pleasantry — he is already focused on the next season.

**Updated per `dmc_clone_companion.md` §§2.2, 4.2, 7.3 DCB-O2 (Companion bible shipped at `eb782e9`)**: this canon is canonically ratified and inherited by the Companion bible. The mid-wife / closed-account / don't-thank-me / "I was not given. I was delivered." canons all canonically hold; the Companion bible canonically extends with two canon-compatible readings of the Companion's response to Nilmorg's indifference: (a) consistent acceptance (per the don't-thank-me framing) OR (b) structural wound (the author of their existence will not look at them). Stage 4 weave authors choose; Nilmorg bible canonically does NOT pre-decide which reading lands in canonical scenes. The corrected donor canon (donor is the player's own Potential per `deadMansCircuit.ts:800`, NOT a separate Potential from a pool) is canonically ratified by the Companion bible §1 stance #2; the priority plan's prior assumption is canonically corrected.

### 4.9 The Oracle (unknown; structural fit)

No recorded contact. The Oracle holds priced futures data (collapsed-timeline memories); Nilmorg profiles terminal velocity. They are oblique specialists in the same broad problem: mortality. The Oracle would find Nilmorg interesting. Whether Nilmorg would find the Oracle worth a signature slot is unclear. Oracle's bible decides whether her visions have ever reached him on his platform.

### 4.10 Your Eidolon (an unpriced asset)

No recorded contact. Canon doesn't place Eidolons at the DMC. Nilmorg's professional posture toward a soul-bound Eidolon is the same as Locke's: an *unpriceable asset* is an anomaly he notes and files. He would not attempt to acquire one; soul-bonds are out-of-scope for his kinetic division. If a player bonded to a DMC Severance Prize Companion *also* has an Eidolon, Nilmorg's projections would mark the portfolio as "non-standard" and he would adjust accordingly — a Chrome-tier line might reference this. Eidolon's bible should decide whether Nilmorg has ever looked directly at the pet.

### 4.11 Elara (unknown; structural friction)

No recorded dialogue. Elara is Ark 1047's AI; Nilmorg operates the DMC *within* Ark 1047's Trench. There must be an operating agreement between Hierarchy entertainment division and Elara's administrative layer. Writers should infer: Elara tolerates the DMC because it is contracted, and Nilmorg respects Elara's jurisdictional boundaries because his agreements require it. Their voices should read as two administrators who never socialize but reliably send each other paperwork. Elara's bible decides whether they have ever exchanged words directly.

### 4.12 The Human (unknown)

No recorded contact. The Human is a Detective archetype; Nilmorg's organization "keeps his agreements" in exactly the way The Human's moral frame would find damning (the Severance Prize is honored; the ethics are still questionable). A Human–Nilmorg exchange would be a contest of frames — The Human prosecuting, Nilmorg calmly affirming. Nilmorg does not lose such exchanges. He answers. He does not flinch. The Human's bible decides whether there is a quoted scene to anchor this.

### 4.13 Bonus: Riri'Ahlia (COO, direct institutional superior — depth seeds for later build-out)

Not on the priority-11 roster, and not being promoted to slot 12. These are seeds a future author can draw from if Riri'Ahlia is ever scoped for her own bible.

Canonical facts (post-rename from Vex'Ahlia, per the rename commit `1e0b7a1`): Riri'Ahlia is the Hierarchy's **COO**, "a six-armed warrior-queen encased in armor forged from the compressed screams of a thousand conquered worlds" (`loredex-data.json:8031`). She was "the first demon to recognize that the Architect's organizational model — the Archon hierarchy — was superior to the Hierarchy's ancient tribal structure," and she "proposed the corporate reorganization" that made the Hierarchy the corporation it now is. She mirrors the Archon "The Warlord" and opposes the Neyon "Iron Lion" (`loreData.ts:175`). She oversees DMC's administrative side and "is the one who ensures Nilmorg's agreements are honored" (`DEAD_MANS_CIRCUIT_PRODUCTION.md:130`).

**Added character direction (user-canonized):** Riri'Ahlia is a **corporate succubus lust demon**. Her species-archetype is seduction; her operational mode is contract-binding through desire. She is the one who convinced the Hierarchy to reorganize as a corporation because corporations bind through *want* (ownership, acquisition, profit, ascension), not through tribal obedience. She is the warrior-queen who conquered by making conquest feel like courtship. Her six arms are not just for combat — they are for handling paperwork, stroking vanity, pointing at incentives, and signing contracts simultaneously.

What this means for her voice, as seeds for a later bible:

- **Her register**: the boardroom predator as intimate. She addresses counterparties the way a closer addresses a whale — attentively, privately, flatteringly. She would never raise her voice. She never needs to. The contract is already signed before the mark notices.
- **Her relationship to Nilmorg**: administrative superior *and* institutional seductress. She didn't force him to keep his agreements; she made the agreements desirable to keep. Nilmorg's reliability is partly Riri'Ahlia's handiwork — she drafted the instruments he honors. Writers touching both characters should treat this as unspoken. Nilmorg does not describe her. He defers to her. The deference is visible in what he refuses to do — break a contract she oversees — not in what he says.
- **Her domain**: Military Operations per canon, but the user's succubus layer reframes "military" as seductive conquest. Her sieges of seven dimensions during the Empire of Shadows war were not blunt assaults — they were institutional absorptions. Worlds joined before they fell.
- **Her one canonical defeat**: "driven back by the Blood Weave's binding chains" (`loredex-data.json:8032`). A seductress demon being bound by chains is a precise image — someone out-contracted her. Writers using this beat should preserve its specificity. Binding chains defeat a binder.
- **Her tell**: she would not use Nilmorg's theatrical register. No triplet crescendos, no caps, no self-narration. She speaks like a closer at a quarterly review — precise, warm-enough-to-disarm, entirely transactional underneath. The closest existing character voice is Locke's, but Riri'Ahlia goes one step further: Locke admits the transaction; Riri'Ahlia makes it feel like mercy.
- **Her relationship to The Warlord** (canonical "mirror"): she mirrors his methods in infernal form. He conquered at speed; she conquers by making the conquered grateful. Pair and contrast.

**Not in scope for this bible**: Riri'Ahlia's full bible. These seeds exist only to keep Nilmorg's chapter internally consistent. A future Stage 4 bible for her would extend the material properly.

### 4.14 Bonus: The Warlord (pre-Fall legend, one-way fandom)

Canonically, Nilmorg and the Warlord **never directly interacted**. All of Nilmorg's knowledge of the Warlord is pre-Fall observation — and Nilmorg is a fan. He watched the Warlord conduct the business of conquest at *speed* and with *efficiency*, and speed-efficiency is Nilmorg's entire menu. The Warlord's campaigns are the historical case studies Nilmorg studied; he admires them the way a vice-president admires a previous generation's legendary turnaround CEO, from the filing cabinet.

Per the separate Vex Solène canon, **the Warlord is dead**; her nano-swarm now resides in Vex Solène's bloodstream (`DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:126`). So "The Warlord" in any present-tense Nilmorg line is either (a) the Warlord's pre-Fall legend, invoked rhetorically, or (b) Nilmorg's retrospective framing of some long-closed ledger entry.

Reading the canon cross-game side-quest line *"The Warlord placed a wager on you. He lost. I collected."* (`deadMansCircuit.ts:673`) through this lens: Nilmorg is narrating the player's combat season as if it were a continuation of the Warlord's legendary wagering style. He is borrowing the Warlord's name as a brand — the Warlord *would have* bet on this, Nilmorg *would have* collected, and the resonance Nilmorg collected from the player's fights completes a ledger entry that is older than the player. It's a theatrical device, not a literal contract between two living parties.

**Writer guidance**:
- Nilmorg may quote the Warlord, invoke him as a standard, or compare present velocity to pre-Fall precedent. He never meets him.
- The admiration is professional, not worshipful. Nilmorg does not kneel; he studies.
- Any new Warlord-adjacent line should land as historical invocation — past tense underneath, even when grammatically present. *"The Warlord would have collected on that one."* *"Pre-Fall, this is a Warlord closing speed."* *"The Warlord's books had a word for this."*
- **Important non-overlap**: Vex Solène carries the Warlord's nano-swarm. Nilmorg does not know this, has no access to the nano-swarm's current vessel, and would not recognize the Warlord's residue in Vex. If Nilmorg's projections ever detect *the Warlord's resonance signature* in a present-day body, that is a Vex-reveal-stage mechanic and should be reserved for her bible — not spent here. Writers must not surface Warlord-in-Vex material through Nilmorg's profile work unless Vex's bible sanctions the bridge.

---

## 5. Mechanical hooks (where authored lines need to fire)

### 5.1 DMC race state triggers (primary surface — already authored in part)

28 existing VO lines map to nine state categories (`nilmorg-lines.json` + `deadMansCircuit.ts:430-847`). The bible's job here is to protect what exists and define the expansion shape:

- **circuit_begins**: pre-race welcome (theatrical register, triplet-crescendo openings)
- **player_leading / player_losing**: mid-race commentary (variable emotion tags)
- **clone_died**: delighted register only; aestheticized-destruction vocabulary
- **survived_danger**: calm or delighted, *never* relieved — Nilmorg is never relieved on behalf of the racer
- **player_died**: theatrical elegy; ironic condolences
- **player_wins**: grudging admiration or theatrical exaltation; never envy
- **final_lap**: threatening register; "the bone-lane WRITHES"
- **bone_lane_grows**: ritual-expansion lines; "the track HUNGERS"

Writers expanding any category should author in triples (canon's existing pattern) so the VO selector has variety.

### 5.2 DMC cinematics

- **Circuit Opens** (seasonal announcement) — played once per install before first race
- **Nilmorg Speaks** (character introduction) — 15s, chained after Circuit Opens
- **Clone Awakening** (pre-race intro) — 10s, every race
- **Nilmorg in Chair** (ambient loop) — 15s, commentary panel portrait
- **Nilmorg Sermon / Lip Sync** (velocity-and-vanity sermon) — 12s, hero panel on lobby
- **Signal Lost** (death overlay) — 8s, on clone death
- **Severance Prize Podium** (victory overlay) — 12s, on 1st place

All already exist (`dmcAssets.ts`). No new cinematics required in Stage 2; protect the voice in subsequent ones.

### 5.3 Seasonal reward tiers (progression of specificity)

Four tiers, four lines. Already authored. The bible's contribution: this is Nilmorg's structural equivalent of Locke's trust bands. Future seasons can add ranks above Dead Man's Rank; each new rank-line should advance the specificity (e.g., Prime Rank — "I have you on my calendar now."). Writers must resist warming the voice; what rises is knowledge, not affection.

### 5.4 Cross-Game Side Quest hooks

Eight quests spanning combat, cards, chess, trade, tower defense, casino, companions, raids (`deadMansCircuit.ts:664-743`). Each has a quoted Nilmorg line. The bible confirms: this is the correct range. Future cross-system expansions should have Nilmorg chime in only where mortal acceleration or agreement-keeping is in play. He does not comment on, say, decorating a ship's lounge.

Special note on "The Warlord's Bet": Nilmorg's line invokes the Warlord's pre-Fall legend rhetorically. See §4.14 — any new authoring for this quest should preserve the historical-invocation framing rather than imply a live Warlord counterparty.

### 5.5 Severance Prize ceremony

The highest-weight Nilmorg scene in the saga, and the only one where he is unambiguously the ritual officiant rather than the announcer. Authored once per season. The signature line is:

> "The Severance Prize is paid. Don't thank me."

Writers should not author alternate Severance Prize lines lightly. If additional ceremony lines are needed (e.g., for different donor-Potential types), they must preserve: the calm register, the refusal of gratitude, the *paid* framing, the flatness. Any warmth in a Severance Prize ceremony is out of character.

### 5.6 TCG

Canon mentions Nilmorg legendary card and announcer pack at Dead Man's Rank. Writers should author:
- Summon line on the Nilmorg legendary card (announcer register — theatrical)
- Match-start line when a New Babylon deck faces a Hierarchy deck (Nilmorg, not Locke, is the Hierarchy TCG voice for this particular matchup)
- Potential bespoke lines for the announcer-pack skin

### 5.7 Trade Empire

No canon hook yet. Nilmorg operates in The Trench (Ark-internal), not on the galactic trade network. If the Trade Empire expands to include the Severance Prize economy as a commodity (clones as imports, signatures as exports, Prize bodies as contracted goods), Nilmorg would enter the Trade Empire as a Hierarchy-aligned broker. Writers should not force this — wait until the mechanic is designed.

### 5.8 Universe Event modifiers

When Necromancer Return / Dreamer Awakening / Terminus Advance / Antiquarian Revelation / Shadow Tongue Edit are active, the DMC's bone obstacles, neural sync, speed conduit, and splice jam parameters shift (`deadMansCircuit.ts:789-814`). Each universe-event × DMC intersection deserves a Nilmorg line acknowledging the modifier in his own register: "The necromancer's traffic is up. The bones are generous this season." etc. These are one-liner opportunities; keep them at announcement-intro scale, not monologue.

---

## 6. Voice samples (Stage 0 exit-criterion artifact)

Five new lines, written against this bible. Not canon until reviewed. Each satisfies at least three of the five tells in §1.4; each occupies a different trigger surface.

### Sample 1 — Trigger: `dmc.race_start`, Phase 3 Finals opening (The Dead Run).

> "Welcome, survivors! Season-finalists! The four of you who have not yet been reduced to track decoration! The Dead Run begins at the mark and ends at the stain. The bones you drive over today were someone's clone last week. Be honored. Be fast. Be BRIEF."

*Register: Race Commentary. Tells used: triplet crescendo (1), aestheticization of destruction (3), cap-landing on noun (variant of 1).*

### Sample 2 — Trigger: `dmc.clone_died`, but the clone was the player's last in the season.

> "And that's the last of your reserves. Nilmorg notes the account is empty. Nilmorg also notes the bone-lane thanks you for the contribution. Come back next season. The track remembers donors."

*Register: pivot — Race Commentary flips to Lore/Ceremony. Tells used: third-person self-narration (2), aestheticization (3), calm aphorism (4). "The track remembers donors" is the aphoristic close.*

### Sample 3 — Trigger: `dmc.severance_prize_granted`, first-ever Severance Prize for this player.

> "You finished first. The extraction is complete. The fragment is in the container. The container is now a body. The body is now your companion. No paperwork remains. Don't thank me. I kept the agreement because the agreement required it."

*Register: Lore/Ceremony, full ritual mode. Tells used: calm aphorism (4), refusal of gratitude (core Severance line extended), four declarative sentences in a row — the bureaucratic register at maximum.*

### Sample 4 — Trigger: `chess.checkmate_win` within a Circuit season (the Nilmorg's Gambit cross-game quest), player's first completion.

> "Twelve moves. Nilmorg is impressed. And slightly disappointed — your clone's neural splice would have pulled off eight. But the same resonance signs it. Speed in all things, including thinking. Come back to the Trench. The bone-lane wants your actual body."

*Register: flat with one theatrical flare. Tells used: third-person self-narration (2), calm aphorism (reused — "Speed in all things" already canon, quoted), deferred threat ("The bone-lane wants your actual body"). The "impressed. And slightly disappointed" pattern is a direct canon echo of `nilmorg-lines.json:102`, intentionally.*

### Sample 5 — Trigger: `tcg.match_start`, Hierarchy deck vs. New Babylon deck. Addressed to the player.

> "Oh, this match. Two corporations at a table. Locke will count the silverware before she sits. Nilmorg tips his hat to a professional competitor. Then Nilmorg bets on you. Don't disappoint him. The bone-lane is closed today, but Nilmorg has other ledgers."

*Register: announcer warming toward lore. Tells used: triplet (1), third-person self-narration (2), deferred threat ("other ledgers"), cross-character canon respect (Locke reference). Pairs Nilmorg with Locke's bible cleanly — she counts the silverware, he tips his hat.*

**Voice-anchor check** (for the reviewer): Sample 1 uses tells 1 and 3. Samples 2, 3, 4 each use three. Sample 5 uses four. Every sample maintains one register or pivots cleanly between the two — none muddle them.

---

## 7. Canon issues and open questions

### 7.1 Confirmed infrastructure gap

- **`apps/shared/nilmorgVoManifest.json`** exists but the corpus extraction did not open it, so actual VO URIs may or may not be populated. Before production VO work, confirm the manifest has audio-file mappings for all 28 lines in `nilmorg-lines.json`. If missing, the ElevenLabs pipeline (plan Stage 1) must generate them before a Nilmorg bank can ship.

### 7.2 Intentional mysteries the bible protects

- **Why the Severance Prize being paid is worse than not paying.** (`DEAD_MANS_CIRCUIT_PRODUCTION.md:124`) Canon demands the silence. Writers must not solve.
- **What Nilmorg does off-season.** Canon states the observation platform shows a countdown, but does not describe Nilmorg during that time. He may be dormant, may be elsewhere, may be uninterested. Do not write him mid-season-gap.
- **The purpose of the signature archive.** "He keeps them all." Canon does not say why. Trophy / archive / fuel / monument — pick none. Evoke the ambiguity.
- **Nilmorg's position in the Hierarchy relative to the Master of R'lyeh.** Not on record. Writers should not fill.
- **Nilmorg's origin.** "Something eternal" is the canon. Any specified origin is out-of-bounds.

### 7.3 Gaps for cross-bible coordination

- **Riri'Ahlia ↔ Nilmorg**: institutional relationship is defined (COO ↔ SVP) with added depth in §4.13 (corporate succubus lust demon, binder-through-desire). She is not on the priority roster; seeds are left here for a future Stage 4 bible.
- **The Degen ↔ Nilmorg**: business-partner frame; The Degen's bible must confirm the partnership and add his side of the respect.
- **The Warlord ↔ Nilmorg**: pre-Fall observation, one-way fandom. No live relationship. Any bible for the Warlord should confirm he is not aware of Nilmorg as a counterparty.
- **Clone Companion ↔ Nilmorg**: the "don't thank me" core line must anchor the Clone Companion's origin bible.
- **Elara ↔ Nilmorg**: operating-agreement frame; Elara's bible decides whether they have shared direct words.
- **The Hierophant ↔ Nilmorg**: post-arena structural competitor frame; Wraith/Hierophant's bible decides on contact.

### 7.4 Structural risks the roster should track

- **Register confusion across writers.** The two-voice structure (Race Commentary vs. Lore/Ceremony) is the single most imitable-badly feature of the character. Every Nilmorg line should be tagged with its register before authoring, and reviewed against the appropriate tell-set.
- **Sympathy drift.** Canon is precise: Nilmorg is calm, reliable, professional, and predatory. Writers who sympathize-by-default will drift toward warming him. Blind-read reviews on Nilmorg lines should specifically test for over-warmth.
- **Severance Prize inflation.** If the saga adds more Severance-Prize-like rewards (new ranks, special seasons), each one requires Nilmorg authoring that preserves "paid, don't thank me." Do not add Severance variations with warmth.
- **The Vex/Riri collision memory.** The rename is committed but the CDN asset filenames still carry the old `vexahlia` stem. Writers reading URL paths should not read canon from them. Riri'Ahlia is the name. Document this in any onboarding doc for the Hierarchy demon-lord cast.
- **Warlord-in-Vex leakage.** Nilmorg must never be the surface through which the player discovers the Warlord's nano-swarm now resides in Vex Solène. That reveal is Vex's to spend. Writers should not let Nilmorg's actuarial profiling accidentally fire a Warlord-resonance match against Vex's body.

---

## 8. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation resolves to the claimed file:line. Spot-check at least six.
- [ ] No contradiction with shipped canon or with Locke's bible (specifically the "keeps his agreements" cross-reference).
- [ ] The five voice samples in §6 pass a blind-read attribution test. Target: reviewer correctly identifies each sample's register (Race Commentary vs. Lore/Ceremony) and attributes all five to Nilmorg when mixed with random non-Nilmorg lines.
- [ ] Cross-reference claims in §4 are flagged for every named character's bible to sign off on later.
- [ ] `nilmorgVoManifest.json` is opened and audited; if audio URIs are missing, a ticket is filed.
- [ ] Riri'Ahlia's bonus section (§4.13) is treated as depth-seed only — no Stage 0 commitment to a full Riri bible until explicitly approved.
- [ ] The Warlord framing (pre-Fall observation only, no live counterparty) is preserved in any new authoring.
- [ ] The two-register discipline is explicitly highlighted in subsequent bibles' style guides.

When this checklist passes, Nilmorg bible joins Locke as the Stage 0 baseline. Next bible on the pilot roster: the Eidolon — the hardest case, because non-verbal.
