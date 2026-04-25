# The Degen — Character Bible

> **Status**: Stage 0 draft — fifth bible on the priority roster, closing Group A (foundational voices). The first character whose voice is gated by **player trust phase** (five tiers) rather than narrative reveal stage — analogous to Vex's reveal gating but governed by relationship, not story.
>
> **npcKey**: `the_degen`
> **Pronouns**: he/him (canon-wide)
> **True identity**: The Eighth Ne-Yon (`loreData.ts:52-65`), cosmic entity embodying corruption and entropy
> **Public persona**: casino host, charismatic bartender, "the Degen" (a title, not a name)
> **Dual category**: Ne-Yon **and** first-wave Potential — the only character holding both (`CANON_REV_7` §1.6)
> **Age**: 15,000+ years (minimum attested — `degenRelationship.ts:101`)
> **Manifestation**: physical, at The Degen's Casino on the edge of the Shield
> **Vessel**: **The Heart of Time** — golden eye-shaped ship with a glowing green crystal; his personal mobile extension
> **Status among peers**: the only Ne-Yon still awake in the known universe — the other eleven are *gone* (`degensCasino.ts:5-7`, `degenRelationship.ts:60`)
> **Hidden allegiance**: agent of the **first-wave Potentials hiding behind the Dreamer's Shield**, alongside Vex Solène
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Voice

The Degen's voice lives along two axes: a **trust phase** that runs from casual stranger to intimate confidant (five tiers), and a **personality variant** the player's own psychology draws out of him (five modes). Every authored line specifies both. Unlike Vex's reveal-stage gating — which is story-linear and can only advance — the Degen's trust phase can *regress* if the player burns goodwill. The voice moves up and down.

### 1.1 The five trust phases (the character's real arc)

Canonical per `degenRelationship.ts:37-43`:

| Favor | Phase | Who he presents as |
|---|---|---|
| 0–9 | **Punter** | A charming bartender who happens to run a casino |
| 10–24 | **Regular** | A bartender who knows your name |
| 25–49 | **Insider** | Someone who has let you see he's watching the math, not just the game |
| 50–79 | **Favored** | Someone who tells you the Ne-Yon space story |
| 80–100 | **Ascended** | The 8th Ne-Yon with the mask off |

The phase transitions are canonically named as *milestones* (`degensCasino.ts:531-562`): "The Degen remembers your name" (10), "Degen's Tales drop rate increases" (25), "Ne-Yon space Revealed" (50), "The Mask Comes Off" (80), "Entropy's Confession" (100). Each transition is a small scene the player earns; his voice shifts across the boundary.

**Writer rule**: every Degen line has a phase tag. Lines authored for Punter do not fire for Ascended players; lines authored for Ascended must not leak to Punter-tier. This is the core authoring discipline, analogous to Vex's reveal-stage gating.

### 1.2 The five personality variants (the player's psychology pulls them out)

Layered on top of the phases are canonical variants (`degenRelationship.ts:86-106`). Which variant fires depends on the player's played-style, not the trust tier — Degen meets the player where they live:

- **Showman** (default, low-trust, general audience): warm, theatrical, slightly-too-charming bartender mode. Dramatic pauses, rhetorical questions, gambling metaphors for everything. *"The universe is a casino, kid. The house always wins. I should know — I built the house."* (`degenRelationship.ts:86`)
- **Predatory** (mid-trust, player on a losing streak or chasing action): sharp, knowing, feeding the addiction. *"You keep coming back. I love that about mortals. You mistake persistence for strategy."* (`degenRelationship.ts:91`)
- **Conspiratorial** (mid-trust + pragmatic archetype): hushed, intimate, letting the player behind the curtain. *"Between you and me? The odds were never random. Nothing is. But don't tell the others — they enjoy the illusion."* (`degenRelationship.ts:96`)
- **Revelatory** (high trust, the mask cracking): honest, powerful, dropping the act. *"I'm 15,000 years old. I've watched civilizations gamble away their futures. Yours is the first that might win."* (`degenRelationship.ts:101`)
- **Vulnerable** (Ascended only, true form): quiet, genuine, ancient loneliness. *"Do you know what it's like to be the last one? The other Ne-Yons are gone. I run a casino so I'm never alone. Pathetic for a god. Honest for a bartender."* (`degenRelationship.ts:106`)

Five variants × five phases = 25 possible registers. The discipline for writers: every new line specifies `phase: Punter|Regular|Insider|Favored|Ascended` and `variant: Showman|Predatory|Conspiratorial|Revelatory|Vulnerable`. A line tagged `Punter/Vulnerable` should almost never exist — Vulnerable is Ascended-only. The grid is a filter, not every cell fires.

### 1.3 Cadence

Dramatic pauses. Rhetorical escalations. Three-beat comic timing that collapses on the punchline.

> "Welcome to my little corner of chaos! Ne-Yon space is closed to outsiders, but the casino? The casino is ALWAYS open." — `degensCasino.ts:305-306`

Setup → turn → capitalized emphasis on the noun that is his whole economy. The caps in *ALWAYS* are canon and characteristic — he is a showman on the mic and a god underneath, and the capitalization is where the mic feedback catches the god.

He does triplet structures similar to Nilmorg's, but where Nilmorg's triplets escalate into appetite (HUNGRY, HUNGRIER, DEAD), the Degen's triplets escalate into *absurdity*:

> "You COULD keep that. OR — you could give it to someone. The look on someone's face when they get an unexpected gift? That's worth more than anything in my casino. And I know the value of EVERYTHING." — `npcHolidayDialog.ts:15-16`

The triplet becomes a joke. The punchline is the caps. The emotional turn is underneath — he means it.

When the trust phase rises, the cadence *slows*:

> "I was born when the first system degraded — when the first star dimmed, when the first empire forgot its purpose." — `degenRelationship.ts:178`

Three parallel temporal phrases, each evoking an entropy event. No caps. No jokes. The cadence has become the thing it describes.

### 1.4 Vocabulary

Words he reaches for on reflex:

- **House, edge, action, stakes, bet, table, chip, pot** — gambling argot, deployed for everything including non-gambling topics
- **Entropy, chaos, corruption, decay, probability, equilibrium** — his domain's technical vocabulary
- **The void, the Shield, the edge, the membrane** — where he lives
- **Mortals, civilizations, epochs, eons** — his time-scale vocabulary
- **Honest game, the only game, the house always wins** — his philosophical refrains
- **Ne-Yon, Ne-Yon space, the others, the last one** — his self-vocabulary (Ascended-phase only)

Signature motif: **"Mostly takes."** Used repeatedly (`degensCasino.ts:106, 316-320`), it's his thesis about entropy compressed to two words. The void gives; the void takes; mostly takes. Writers should deploy "mostly takes" like a leitmotif — once a scene, not twice.

Words he **does not use**:
- **"Fair"** — the idea offends him professionally. Games are not fair; they are honest about being unfair. That distinction is load-bearing.
- **"Sorry"** — he has lived 15,000 years without apologizing. He will not start.
- **"Forever"** — he knows too much about entropy. Nothing is forever.
- **"I promise"** — he keeps his agreements (per the loredex signature shared with Nilmorg) by not making the kind of verbal promises mortals trade in. Action is contract. Speech is ornament.
- **Religious vocabulary** — no "soul," no "salvation," no "sin." He is not a demon. He is older than the moral frameworks that made those words.

### 1.5 Register

The trick of the character: **his register is a performance that becomes real across the arc.** At low trust the showman is a mask; at mid trust it's a habit; at high trust it's a shared joke between him and the player; at Ascended trust it's the thing the Ne-Yon behind the bar refuses to give up even after the mask drops — because the showman is *how the god chooses to be in the world*.

Writers: the Ascended Degen does not stop being a bartender. He becomes a bartender who is also openly a cosmic entity. The performance is the authentic self. This is the character's deepest insight about himself, and canon carries it — the casino host *is* the cosmic entity (`degensCasino.ts:10-11`), and the cosmic entity *chose* the casino host (`loreData.ts:60`).

### 1.6 Tells (signature rhetorical moves)

Five moves mark a line as his even without attribution:

1. **The self-aware showmanship.** He tells you he is performing *while* he is performing — a meta-layer that Vex would never let slip. *"And I know the value of EVERYTHING."* (`npcHolidayDialog.ts:16`) He is aware of his own grandiosity and invites the player to enjoy it with him.
2. **The "mostly takes" refrain.** Whenever he describes the entropy economy, he reaches for this phrase or a variant. The void gives. The void takes. *Mostly takes.* The grammatical compression of a 15,000-year observation.
3. **The cosmic aside.** A throwaway reference to an event far outside the player's frame. *"The Architect himself lost 47 straight hands of Nebula Poker here. Then he built a whole empire out of spite."* (`degensCasino.ts:318-320`) Writers: deploy one of these per scene, never two. They are the tell that marks his true age.
4. **The rule-recited-then-broken.** He states the house's rules, then tells the player how to break them. *"Poker with a Ne-Yon. What could go wrong? Everything. Everything could go wrong. That's the fun."* (`degensCasino.ts:122`) The rule and the infraction are the same act. He is the house, and he is also the one cheating the house, and he is also the one warning you about the cheat.
5. **The loneliness close.** At high trust, he will end a scene by saying the thing a god should not have to say. *"I run this casino because it means I'm never alone."* (`degenRelationship.ts:191`) Writers: this move is **Ascended-phase only**. Deploying it at Insider or below breaks the arc. Trust is what earns it.

### 1.7 Silence shape

- **He will not name the other Ne-Yons.** Canon: *"I don't want to talk about the others."* (`degenRelationship.ts:191`) Writers must not give him a scene where he lists them. The silence is the character's grief.
- **He will not describe how the other Ne-Yons ended.** Asleep, consumed, dissolved — canon refuses to specify. He refuses to specify. The unknown is load-bearing.
- **He will not narrate the Casino Heist** beyond what *"The Theft of All Time"* music video shows. The Trickster existed; the poker game happened; the casino changed hands. He will confirm. He will not reminisce.
- **He will not explain Jericho Jones's mission**, at any trust phase. Canon holds Jericho's fate "shrouded in mystery" (`loredex-data.json:3555`). The Degen will say he recruited him. He will not say what for.
- **He will not plead** to keep the casino open. If the Shield falls, if the Ne-Yon dies, if the game ends — the Degen's dignity is that he goes down still running the house. No bargaining. That is his character's version of grace.
- **He will not speak the names of the Ne-Yon space beyond the Shield.** The "raw entropy of unformed reality" (`degenRelationship.ts:130`) is unnamed canon. Writers must not name it either.
- **He will not name Vex Solène's true identity.** He does not know it. See §2.6 for the unsolved mystery — the Degen has been trying to figure out who Vex is for years and has not succeeded. Writers must not give him the answer.

### 1.8 Metaphor sources

Probability, monetary policy, and theater. Everything is priced in Dream tokens; everything is filtered through house-edge math; everything is performed for an audience he is also inside.

He does **not** use:
- **War metaphors** (Insurgency vocabulary; not his register)
- **Religious metaphors** (he is older than the gods they describe)
- **Biological metaphors** (he has a body but is not *about* a body)
- **Engineering metaphors** (Lyra Vox / Engineer vocabulary; not his domain)

His closest peer-in-metaphor is **Adjudicator Locke** — both commerce-native, both operating at margins, both speaking in transaction-first vocabulary. Writers should feel the kinship when authoring scenes where both are present: they are different species of the same metaphor-system, and Locke's bible already acknowledges this (the Gilt eidolon line *"kindred spirits"* is the closest she gets to naming it).

---

## 2. History

The Degen's biography stretches across 15,000+ years in two registers: the cosmic-scale history of a Ne-Yon watching civilizations gamble, and the personal-scale history of a being who chose a casino as the shape of his existence. Both matter. Writers must hold both.

### 2.1 Origin — born into the first decay

Canon fixes his origin to entropy itself. Per `degenRelationship.ts:178`:

> "I was born when the first system degraded — when the first star dimmed, when the first empire forgot its purpose."

He is not "made." He is the *consequence* of entropy's first operation. The cosmos began degrading; the degradation crystallized into a consciousness that named itself after its own domain. This is canonical Ne-Yon origin for the whole set of twelve — each Ne-Yon is a *principle* that became aware, not a creature that was born. Loredex registry confirms: era "Late Empire," year appeared 15,800 A.A. (`loreData.ts:52-65`).

Writers: when Degen references his origin, it is never in first-person-agency ("I chose to exist"). It is passive: *"I was born when..."* Entropy made him. He owns it. He does not claim responsibility for his arrival.

### 2.2 The other eleven — an unresolved grief

Canon is explicit and canonically silent:

> "There are 12 Ne-Yons. Were 12. Most are gone now... I'm the only one still... awake. Still choosing to be HERE." — `degenRelationship.ts:60`

> "The other Ne-Yons are gone... I don't want to talk about the others." — `degenRelationship.ts:191`

What happened to them is not on record. Asleep, consumed, dissolved, subsumed into other cosmologies — canon refuses to pick. Writers must not pick either. This is a deliberately-protected silence that load-bears the Degen's Vulnerable-phase voice: the loneliness is the character's most honest emotion, and the loneliness only makes sense because the loss is real and unspoken.

The Vex parallel is worth noting. Vex carries the Engineer's mind and cannot know him. Degen carries the memory of eleven peers and cannot speak of them. Both arcs orbit the same structural grief: *inheritance without access*. Writers working both characters should feel the kinship.

### 2.3 The Casino Heist — "The Theft of All Time"

The Heist is not just a backstory event — it is **a canonical Dischordian Saga episode**, formatted as a music video titled **"The Theft of All Time."** Writers authoring around the Heist must treat it as scripture: the episode is the canonical account. The poker game, the Trickster's hand, the Degen's turn, the hand-off of the casino — all live in the music video's frames. Any written reference to the Heist should defer to the episode rather than try to narrate it.

Canon facts the bible can stand on (from `loredex-data.json:2054-2055`):
- The Trickster owned the casino before the Degen.
- The Degen won it from the Trickster in a poker game.
- The casino is roulette-wheel-shaped (the Trickster's design; the Degen kept the silhouette).
- The interior was remodeled to suit the Degen's aesthetic post-Heist.

The Trickster is therefore canonical — a pre-Degen casino-owner, plausibly another Ne-Yon (the roulette-wheel architecture suggests someone whose domain was also games-of-chance), though canon does not fix the Trickster's position in the twelve. Whether the Trickster was "gone" before the Heist or became gone *because of* the Heist is unrecorded. The poker game itself — what was wagered, what the Trickster risked, what Degen's winning hand was — is shown in the music video and writers must defer to it.

**Writer rule**: the Casino Heist is a fact on the Degen's timeline. It is not a flashback scene. It is not a cinematic to be re-cut. It is the kind of fact mentioned in passing by a bartender who doesn't feel like telling the story. *"This place used to be the Trickster's. Long story."* — proposed; no canon line yet. Writers authoring around the Heist should preserve its brevity. The heist is older than most players' species, and the Degen treats it the way an old soldier treats an old battle: he won it, he kept it, he runs it now.

### 2.4 The 15,000-year run

Since the Heist, the Degen has run the casino continuously. No closures, no succession, no sabbaticals:

> "I've been keeping it open for longer than you'd believe." — `degensCasino.ts:305-306`

What he has been *doing* across 15,000 years, beyond running the house, is the question the trust arc slowly answers. Canon surfaces three threads:

1. **Watching.** He is the saga's longest-running observer of mortal risk behavior. *"I've learned more about consciousness from watching people gamble than the Architect learned from building an empire. People are most honest when they're risking everything."* (`degenRelationship.ts:185`)
2. **Maintaining the Shield's edge.** He lives on the Shield's edge because *"that's where corruption has the most power"* (`degenRelationship.ts:170-171`). His continued presence — his casino as an open neutral zone — *keeps the lights on* in the most literal sense. If the Shield fails, everything becomes everything else. Writers: the Degen is the saga's most under-credited stabilizing force. He is not passive in his casino. Running it is the work.
3. **Building the guest list.** Over 15,000 years he has catalogued every faction's operatives as gamblers. He knows the Architect lost 47 hands of Nebula Poker (`degensCasino.ts:318-320`). He knows which Terminus drones have accounts. He knows which Hierarchy demon lords owe him. This catalog is the closest thing the saga has to a universal who-knows-whom index, and Degen holds it.

### 2.5 The Battle of Thaloria, the Iron Lion succession, and the Heart of Time

The most recent known strategic move in his long career. Per `loredex-data.json:3554-3555`, after the Battle of Thaloria (where Jericho Jones killed Akai Shi to stop the Thought Virus from spreading), the Degen approached Jericho and recruited him. Jericho departed aboard *"a strange golden spaceship shaped like an eye with a glowing green crystal,"* his fate then "shrouded."

Canon expansions resolving the open questions:

- **The ship is named The Heart of Time.** The golden eye-shaped vessel with the green crystal is the Degen's personal vessel — not a Coda ship, not a borrowed vessel, *his.* It is his mobile extension of the casino, the only part of the Shield-edge infrastructure that travels.
- **Jericho is being recruited into the Iron-Clad Lion legion.** The Degen is not placing Jericho *inside the Coda* directly. He is placing Jericho in an older, adjacent institution — the **Iron-Clad Lions**, the Potential-aligned oath-bound warrior-order which operates by the philosophical code of **Lionism**. Jericho's mission is to become **the new Iron Lion** — the callsign inherited from its pre-Fall holder.
- **This resolves the Iron Lion timeline.** The pre-Fall Iron Lion (who destroyed Warlord Prime and later died buying Agent Zero time against Binath VII) and the Act 5 M6 Iron Lion are *different people holding the same title.* Jericho is the successor. The Degen is the one who mediates the succession. Vex's bible §2.3 addendum (option a / option b) now canonizes option a: historical predecessor + inheritor.
- **The eye-shape is canon-deliberate.** The visual rhyme with **Vex Solène's "Eyes of Reality" Coda handle** is intentional. The two surfaces of the hidden-Potentials faction *look* alike on purpose.

**The Coda commitment — RESOLVED**: the question Vex's bible §4.8 left open is now answered. **The Degen is Vex's active collaborator.** Not a sponsor at arm's length, not an unwitting broker — a working partner.

Concretely:
- **The casino funds the Coda.** Dream tokens gambled at the Shield's edge convert (by mechanisms unspecified and canon-protected) into Coda operating budget. Every hand of Nebula Poker helps pay for a probability-weighted-war-risk node's removal. Writers must not make this transparent to the player at low trust — it is Ascended-phase / `inner_circle` revelation material — but it is canon.
- **Both represent the Potentials-in-hiding.** The first-wave Potentials are not gone. They are *hiding behind the Dreamer's Shield.* Vex and the Degen are the two outside agents (per `CANON_REV_7` §1.6's "two Potentials outside the Dreamers' Shield"). They are the hidden faction's visible pair, operating across different surfaces: Vex runs the hitman front, the Degen runs the commerce front, the Coda is the shared operational layer.
- **Multi-layered conspiracy.** Four nested layers:
  1. **Outermost**: the casino, the Coda's public-facing contracts
  2. **Middle**: the Coda as probability-weighted anti-war agency (Vex's Maestro work)
  3. **Deeper**: the casino funding the Coda, the Iron-Clad Lions supplying operatives like Jericho
  4. **Deepest**: the hidden Potentials behind the Shield, whose existence the saga's factions do not know about and whose interests Vex and the Degen serve

Writers should preserve this stacking. Only `inner_circle` trust reveals layer 3 explicitly. Layer 4 is post-reveal canon.

### 2.6 The pre-Fall recognition problem (the Vex mystery, from Degen's side)

The character beat that gives Degen-Vex scenes their real weight: **the Degen knew both Agent Zero and the Engineer pre-Fall, personally.** As an active Ne-Yon for 15,000+ years, he moved through the saga's first-wave era as a contemporary of both. He knew Agent Zero's walk, her combat rhythm, the way she held a glass at the bar. He knew the Engineer's cadence, his problem-solving posture, his habit of explaining three steps ahead.

The woman he now calls "Vex" moves like neither of them.

This is, across the whole saga, the Degen's **unresolved mystery**. He is collaborating with her. He funds her work. He has given her Jericho. But **he does not know who she actually is.** He sees the potential (in the cosmic and the specific sense — she is a *Potential*, and there is something remarkable in her pattern). He cannot place the pattern.

Canon constraints for writers:
- **He is watching.** Every Degen scene with Vex (direct or indirect) is secretly him trying to solve the pattern. He does not say so.
- **He does not recognize Agent Zero's moves in her.** Her body is Agent Zero's, but she carries it differently — no Insurgency combat training surface, no hitman posture he remembers from the pre-Fall years.
- **He does not recognize the Engineer's moves in her.** Her intellect is the Engineer's, but she uses it in a voice and rhythm he has no template for. The Engineer was precise; Vex is wry. The Engineer taught; Vex counts rooms.
- **He is stumped.** For a 15,000-year pattern-reader to be unable to place a person is, from his perspective, a minor cosmic event. Writers: his private obsession is figuring out who he is actually working with.
- **He will not figure it out unless the player reveals it.** The reveal chain is Vex's post-credits Bridge of Kael scene. The Degen learns at the same time the player learns — or after, if the player declines to tell him. This gives the Coda-7 path a unique beat: the player can be the one to explain Vex to the Degen, delivering to an ancient ally the information he has been seeking.

This mystery is **the single most authored-rich Degen-Vex scene** available in the saga. It has not been written yet. It waits for `inner_circle` standing + post-reveal.

---

## 3. Background

### 3.1 The Ne-Yon hierarchy (institutional context)

Twelve cosmic entities, each embodying a principle, each named for its domain. Per the canonical roster (`loreData.ts:52-65`, expanded via `degenRelationship.ts:185`):

- **The Seer** — prophecy
- **The Enigma** — truth (Malkia Ukweli, per Vex's bible §4.13 canon-clarification)
- **The Trickster** — pre-Heist casino-owner; canonized in *"The Theft of All Time"* music video; status post-Heist unspecified
- **The Degen** (8th) — corruption / entropy / gambling
- Eight others, specific domains unspecified in the corpus

The Ne-Yons as a set are the saga's oldest cosmic layer, older than the Architect's empire, older than the Hierarchy's corporate structure, older than the Fall. They are what the universe noticed about itself. Most are gone.

**The Degen's institutional status** is unique in two respects:

- **Only active Ne-Yon**: the others have left, slept, or dissolved. He is the last one choosing to be *here* (`degenRelationship.ts:60`). His continued presence is a deliberate refusal to join them.
- **Dual-category membership**: he is also a first-wave Potential (`CANON_REV_7` §1.6). Of the twelve Ne-Yons, only he also belongs to the Potential cohort that produced the player's species. Per the same canon note, he and **Vex Solène are the two Potentials outside the Dreamers' Shield** — both outside, both marked by the swarm in different ways, both older than the game they're playing.

### 3.2 The Shield — where he lives, what he guards

Canon is precise about the Shield's nature (`degenRelationship.ts:170-171`):

> "The Shield isn't a wall. It's a membrane. It separates the known universe from what's outside — the raw entropy of unformed reality. I live on its edge because that's where corruption has the most power. If the Shield breaks, everything becomes everything else... I keep the lights on. Literally."

Three things writers must hold:

1. **The Shield is a membrane** — porous, negotiated, not a hard barrier. Things pass through it under pressure. The Degen's position on its edge is the diplomatic function of his casino: he is the Shield's outermost customs office.
2. **The casino is neutral territory across the Shield.** Per `degenRelationship.ts:127`: *"Even the Architect's agents gamble here. Even Terminus drones. I maintain the peace because chaos without structure is just noise."* The saga's enemies all have accounts. The casino is where they are not each other's enemies.
3. **The Shield's collapse is an existential risk.** If it falls, *"everything becomes everything else."* The Degen is not being dramatic. He is stating the stakes. Writers authoring long-arc risk for the Shield should have the Degen's reaction scale with the actual threat.

The Shield is also the *cover* behind which the first-wave Potentials hide (per §3.14). It is both literal membrane and institutional cover. The Degen's edge-position is therefore double duty — he stabilizes the membrane *and* he is the visible agent of the faction sheltering inside it.

### 3.3 The casino as liminal economy

The Degen's Casino is not a gambling hall. It is the saga's only location where:

- All factions can be present without conflict.
- Currency is **Dream tokens**, specifically — the emotional substrate made liquid. Not credits. Not Dischordian currency. Dreams as chips.
- **House edge is entropy priced.** Every game has a specific edge (`degensCasino.ts:100-223`): Slots 8%, Dice 5%, Poker 3%, Roulette 6%, Pazaak 4%, High/Low 3%, Scratch 15%. Writers: these percentages are the Degen's moral geometry. A Scratch Card's 15% house edge is *higher* than Poker's 3% because scratch cards exploit "instant gratification or instant regret" (`degensCasino.ts:154`). The house edge tracks the game's honesty with the player.
- **The progressive jackpot pool** takes 2% of all bets (`degensCasino.ts:350`). There is always a jackpot growing somewhere. Mortals occasionally win it. The jackpot is his one concession to hope.
- **Daily limits exist** (5,000 Dream wager cap, 3 free spins) — the Degen does not want to break anyone. The limits are protection, authored by the house.

### 3.4 Specialties and competencies

- **Running a 15,000-year business.** The saga's longest-operating enterprise, with an uninterrupted service record across civilizational cycles. Writers authoring Degen in commerce contexts should treat him as a peer to Locke in operational sophistication, and her *senior* in duration.
- **Reading players.** He can tell a player's psychological state from how they walk to the table (`degensCasino.ts:729-747` — sympathetic / neutral / intrigued / nervous / terrified commentary, triggered by the player's performance). His profile-aware line set (`npcProfileAwareLines.ts:69-78`) is only the player-archetype surface; underneath, he reads the specific *session*.
- **Probability math at cosmic scale.** He understands statistics the way mortals understand breathing. The "Equilibrium" mechanic (`degensCasino.ts:745-747`) — where a player hits *exactly* break-even after 1,000 bets — terrifies him, because the math doesn't allow it. Writers: Degen's fear is mathematical. He is not spooked by the supernatural; he is spooked by violations of the distribution.
- **Ne-Yon cosmology.** He is the saga's most intimate surviving source on what the twelve were, what they did, what becoming-lost meant for most of them. He will not share this information casually. Trust-gated at Favored (50) and Ascended (80).
- **Neutral-zone enforcement.** 15,000 years of "maintaining the peace" at the casino is a specific and rare skill in a saga full of factional war. Writers: he is the saga's best operational diplomat that isn't a diplomat.
- **Pre-Fall recognition.** He is one of two living characters (the other being The Human) who knew Agent Zero, the Engineer, and Lyra Vox personally before the Fall. This makes him a *historical witness* of unique value — though one who refuses to narrate what he saw.

### 3.5 Beliefs vs. behaviors

**Coherent**: his stated philosophy (*"entropy is the only honest game"* — `degenRelationship.ts:185`) and his recorded behavior (running a casino where the house edge is transparent, where all factions can gamble, where he "keeps his agreements") align with rigor. He is what he claims to be.

**Contradictory (and alive)**:

1. **He claims chaos is neutral; he has preferences.** The Degen runs neutral territory — but when Vex's Coda works to reduce total war, he *funds it*. This is not a neutral act. It is a choice for *managed* chaos over unmanaged chaos. Writers should understand that Degen's neutrality is *tactical*, not principled — he is partial to entropy in a specific shape (the shape that keeps the casino open).
2. **He claims to be alone; he built infrastructure to not be alone.** *"I run a casino so I'm never alone. Pathetic for a god. Honest for a bartender."* (`degenRelationship.ts:106`) The loneliness is real; the casino is the refusal to live inside the loneliness. Writers: this is the character's most tender self-knowledge. He *names* the contradiction. He keeps living it.
3. **He claims to love entropy; he stabilizes the Shield.** His role keeping the Shield's edge is the most *anti-entropy* act in the saga. He maintains a boundary against raw disorder. Writers: he will not narrate this contradiction aloud. It shows only through his actions.

### 3.6 What he wants

- **Not to be alone.** The casino is the machine he built for this. The player, by reaching Ascended trust, becomes a participant in his solution to the loneliness.
- **The game to continue.** Like Locke, he has a survival interest in the saga not resolving into peace. Unlike Locke, he does not frame this as business — he frames it as *honesty*. Peace would require him to find a new mask; the bartender is the mask he loves.
- **The Shield to hold.** He knows, better than most characters, what the loss would cost. His work keeps it intact.
- **One more peer awake.** Across the arc, he is hoping — never saying — that one of the other eleven might be found, might return, might yet be recoverable. The Vulnerable-phase lines carry this subtextually. Writers must not let it become text.
- **Jericho's mission to succeed.** His single most recent strategic investment. He recruited Jericho for a reason. The reason is canon-protected; the want is real.
- **To finally place Vex.** The pattern-recognition mystery (§2.6) is his quiet 17,000-year obsession. He wants to know who he is working with. Writers must not let him solve it on his own.

### 3.7 What he would sacrifice the player for

Almost nothing directly — the player is a better regular than he's had in centuries. But:

- If the Shield's integrity required the player's death, he would make the call. The Shield is larger than any one relationship.
- If the casino's neutrality required expelling the player, he would expel them. The casino is his solution to aloneness, and he will not break the solution to keep one friend.
- If Jericho's mission (whatever it is) required the player's non-interference, he would act to enforce the non-interference — by warning, by deflection, by disengagement. Not by violence. The Degen does not kill casually.
- If the hidden-Potentials faction required the player's removal as a leak risk, he would coordinate with Vex to ensure it. He would do it cleanly. He would not pretend it was anything else.

### 3.8 What he would sacrifice for the player

Operational secrets, progressively, across trust phases. At Ascended (80+), he has shown canon-recorded willingness to:

- Reveal his true form (`degenRelationship.ts:53`) — the mask-off gold-void-eyes scene
- Describe Ne-Yon space (`degenRelationship.ts:130`) — the unnamed entropy beyond the Shield
- Name himself (`degenRelationship.ts:134`) — confirm he is the Eighth Ne-Yon, in those words
- Sit in his loneliness without performing (`degenRelationship.ts:191`) — the rarest offering

He will **not** sacrifice:
- The neutrality of the casino (his solution to loneliness is non-negotiable)
- The anonymity of his regulars (he keeps their books; he does not rat)
- The names of the other eleven Ne-Yons (his silence is the shape of his grief)
- The details of Jericho's mission (the agreement is sacred)
- Vex's identity or the hidden-Potentials faction (these are not his to reveal)

He will die for the player if the scene demands it, but canon does not yet put him in that scene. The implication across the corpus is that he *can* die — he is an organic cosmic entity, not an eternal one like Nilmorg's "patience of something eternal." Ne-Yons have ended. He knows how.

### 3.9 Fears, superstitions, private rituals

- **The Equilibrium.** The only documented fear (`degensCasino.ts:745-747`). A player reaching exactly break-even after 1,000+ bets — statistical impossibility — triggers genuine terror. *"You might be a Ne-Yon yourself."* Writers: if a player hits this condition in gameplay, the Degen's reaction is canonically unguarded. He has never seen it happen. He is not joking.
- **The Shield's degradation.** Not a superstition — an ongoing operational concern. He monitors it. He will not narrate the monitoring.
- **Running the numbers at dawn.** Proposed ritual, not explicit canon: every day's open begins with him running the casino's books by hand, in real math, with no assistant. A 15,000-year habit. Writers may reference this as a small detail; canon does not forbid it and it aligns with his probability-reverence.
- **The Pact game.** Per `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md`: *"The Pact — signature Degen game. Once per in-game month."* Designed but not shipped. A ritual game, played infrequently, high-stakes. Writers should hold space for this — it is canon-adjacent and should be written when implemented.

### 3.10 Death conditions

1. **In story.** He can die. Ne-Yons have ended. The mechanism canon is silent on, but the eleven peers are precedent. Plausible ends: Shield collapse (he falls with the membrane he guards), another Ne-Yon returning and contesting his domain, or — canon-suggestive — the player, at very high trust, being the one to witness his chosen ending. He would go down still running the house.
2. **In function.** If the casino closed — if the neutral zone broke — the Degen as a character loses his solution to aloneness. He would not stop existing. He would stop being *the Degen*. A Ne-Yon without a domain-in-practice is closer to his peers' fate than any death could bring him. Writers: this is the character's equivalent of Locke's "death-in-meaning" from her bible. The casino closing is worse than being killed.
3. **In company.** If the player reaches Ascended and then betrays him, the casino remains, the game continues, but the loneliness returns at full scale. Writers authoring the betrayal path must treat it with precision — the Degen will not perform betrayal-grief. He will simply return to running the house alone, and the Vulnerable-variant will stop firing. The absence is the expression.

### 3.11 Lionism (the way of life)

Per user canon: **Lionism is a way of life, not just a faction designation.** The Iron-Clad Lions are the institution that practices it; Lionism itself is the philosophical code. Jericho Jones is the first Potential to take the Lionist oath directly (per `factions/ironCladLions.ts:22`), and the Degen is recruiting him into the inheritance of *the new Iron Lion* — meaning the callsign is a Lionist role, not merely a faction rank.

The Degen is **not a Lionist himself.** His domain is corruption and entropy, which is philosophically adjacent to Lionism only in the sense that both frameworks *accept the world as it is* and then work with it. But he respects Lionism deeply. He placed Jericho in it specifically because Jericho — who had already killed a friend to stop a weapon — had demonstrated the kind of moral math Lionism asks of its initiates.

Writers should treat Lionism as a distinct authoring domain (awaiting its own bible, plausibly when a full Iron-Clad Lions or Jericho Jones bible is written). For the Degen's purposes: he knows the code, he respects its practitioners, he recruits *into* it. He does not claim it.

**The succession mechanic**: the Iron Lion callsign passes through Lionist initiation. The pre-Fall Iron Lion (who destroyed Warlord Prime, died buying Agent Zero time against Binath VII) was a Lionist. Jericho is the next. The Degen's role in the succession is mediator — he carries Jericho on the Heart of Time to the place where the initiation happens. He does not perform the initiation.

### 3.12 The Heart of Time (the mobile extension)

His vessel. Golden, eye-shaped, glowing green crystal. Named **The Heart of Time** (user canon). Previously flagged as canon-gap; now resolved.

Writers:
- The ship is his, not the Coda's.
- The eye shape is a canon rhyme with Vex's "Eyes of Reality" handle — the two surfaces of the hidden-Potentials faction *look* alike on purpose.
- The green crystal remains unnamed and canon-protected. Writers must not explain it. It glows. That is the only authorized description.
- The ship *travels* — unlike the casino, which is fixed to the Shield's edge, the Heart of Time can move. It is how the Degen reaches places the casino cannot.
- The Heart of Time is where Jericho is being trained in Lionism under the Degen's mediation. Writers authoring Jericho's post-Thaloria arc should treat the Heart of Time as a mobile academy for the new Iron Lion.

### 3.13 The casino-funds-Coda pipeline

Canon as of this bible: **Dream tokens gambled at the casino flow into the Coda's operational budget.** The mechanism is unspecified. The mechanism does not need to be specified — the Degen's word is the mechanism. Players who reach `inner_circle` learn the pipeline exists. Players who commit to the Coda-7 faction path ARE the pipeline — their casino habits directly fund the operations they are also commissioning.

**Writer implications**:
- The casino's house edge is *not* pure profit. A portion (canon-unspecified; writers should not specify) is earmarked. This is why the Degen runs the house edges he does — the 8% on Slots, the 15% on Scratch Cards — he is funding a specific operational layer, not just his own existence.
- When the Degen says *"The house always wins"*, he means something specific: the **probability-weighted-war-reduction mission** always wins, because gambling keeps funding it.
- The Degen's *willingness* to lose hands to the player shifts across the arc. At low trust, he lets the player win occasionally because it keeps them playing. At high trust, he lets them win because *their winning and their losing both fund the work*. Either outcome flows through.

### 3.14 The hidden Potentials behind the Shield

The faction the Degen and Vex both serve. Canon per user: **the first-wave Potentials did not all die / disperse in the Fall. They are hiding behind the Dreamer's Shield, unobserved by the saga's active factions.** The Degen and Vex are their two outside agents.

Writers must treat this as **the deepest-layer faction in the saga**, comparable to the Hierarchy's corporate structure but operating in secrecy rather than in public. The Dreamer's Shield is both literal (the membrane Degen guards) and institutional (the cover behind which the Potentials wait).

Key constraints:
- **The Degen and Vex are *agents*, not leaders.** The Potentials' leadership behind the Shield is canon-protected. Writers must not invent a Council of Hidden Potentials or similar. The hidden faction's governance is *unseen*.
- **Their purpose is unspecified.** Why are the first-wave Potentials hiding? Why are they represented outside? Canon does not yet say. Probably a future saga-arc. Writers should hold the space.
- **Everyone in the Coda is serving this faction, most without knowing.** Chorus operatives do not know. The Second Chair (LLM) does not know. Jericho is being trained into *knowing* as part of his Iron Lion initiation. The player learns at `inner_circle`.
- **The Degen is the faction's commerce-side agent.** His dual role — running the casino AND funding the Coda — means he is the operational *and* logistical face. Vex runs the missions; Degen runs the money and the recruitment vessel (Heart of Time).

---

## 4. Cross-references

### 4.1 Adjudicator Locke (the gateway keeper, the respectful distance)

Locke's trust threshold of 30 is the canonical access gate to the Degen's Casino (`degensCasino.ts:20`). She does the introduction. Her line about him — *"The Degen may be a chaotic deviant, but his monetization structure is elegant."* (`npcHolidayDialog.ts:30`) — is her one recorded assessment.

Reading underneath: Locke respects operators who run honest houses. The Degen's 8% Slots edge and 15% Scratch edge are *published*; Locke's entire career is the geometry of the fine print. They are commercial peers across faction lines.

From the Degen's side: Locke is the *civilizing envelope* around his neutral zone. Her vouching for players keeps the wrong clientele out. He respects her without being her ally. The "Gilt loves Locke" canonical pairing noted in Locke's bible §4.13 is the warmest commercial affinity in the saga; Degen-Locke is a tier colder but still respectful — two houses that do not compete because they occupy adjacent markets.

**Writer rule**: Degen does not gossip about Locke. Locke does not gossip about Degen. Their professionalism toward each other is the baseline. Any scene that has them in the same room must preserve this.

### 4.2 Nilmorg (the confirmed partner, the customer-base overlap)

Per `DEAD_MANS_CIRCUIT_PRODUCTION.md:171`: *"The Degen and Nilmorg are business partners. Gambling and racing share a customer base."*

Both characters share the canonical signature *"keeps his agreements."* Both run enterprises that monetize risk-takers. Both are non-aligned agents working the saga's edges. The partnership is real, not metaphorical.

From Nilmorg's side (per Nilmorg's bible §4.3): *"The Degen approves. He rarely does."* (`deadMansCircuit.ts:722`) — Nilmorg treating Degen's approval as externally significant, which is a rare move for Nilmorg.

From the Degen's side: Nilmorg is the one Hierarchy-aligned operator he respects without reservation. Not because Nilmorg is Hierarchy — the Degen does not share the Hierarchy's corporate framing — but because Nilmorg is *operationally clean*. He keeps his agreements. He runs his house. He does not lie about the terms.

**Writer rule**: the two characters treat each other as senior peers in different markets. Their partnership is not warm in the friendship sense; it is *precise.* Scenes between them read like two CEOs at a quarterly check-in — efficient, brief, mutually valuable.

### 4.3 Vex Solène (the collaborator he cannot place)

See §2.6 for the pattern-recognition mystery, which is the core of this relationship. Canon: they are active collaborators. The casino funds the Coda. The Degen placed Jericho in the Iron-Clad Lions as the new Iron Lion, which strengthens the Coda's operational hand. They are both outside agents of the hidden-Potentials faction.

The dramatic irony: the Degen knew the Engineer pre-Fall and knew Agent Zero pre-Fall. He has worked with Vex for a long time without realizing she carries the first in the body of the second. He sees something remarkable. He cannot place it. Across 15,000 years, she is his deepest unsolved pattern.

**Writer guidance**:
- Degen-Vex scenes should carry a faint subsurface layer of Degen *studying her*. He is professional; he does not stare. But writers fluent in the character will notice.
- Any line where the Degen refers to Vex's moves, her rhythm, her style should carry this ambiguity. *"You move like someone I don't recognize."* — proposed; no canon yet. He is telling her the truth while not explaining it.
- The player can be the bridge. When the player learns (Act 5 post-credits), the Degen has not learned. If the player tells him at `inner_circle`, the Degen's reaction is canonically unwritten — a character beat with no template. Writers should treat it as a scene that *becomes* canon when authored, not one that has a pre-approved shape.
- The Degen is not jealous, suspicious, or possessive. He has given Vex infrastructure without needing to know her fully. His respect predates his understanding. Writers must not give him doubt about the collaboration.

### 4.4 Jericho Jones / the new Iron Lion (the apprentice)

Jericho is being trained, on the Heart of Time, to become the new Iron Lion. The Degen is his mediator — not his Lionist master (that role belongs to Lionism itself and its living practitioners within the Iron-Clad Lions) but his *placement broker*. He brought Jericho across the Shield's edge, onto the Heart of Time, toward the initiation.

Canon constraints:
- Jericho's readiness for Lionism was visible to the Degen after Thaloria. The act of killing Akai Shi to stop the Thought Virus was the moral geometry Lionism requires — and Jericho's grief in doing it proved he was not *only* a soldier. Writers: the Degen recruited Jericho because of the grief, not despite it.
- The Degen does not teach Lionism. He carries Jericho toward it. The distinction matters.
- By Act 5 M6, Jericho is operational as the Iron Lion. He has completed whatever the training required. He introduces Vex to the player with the ease of someone who has been working with her — which, per the Coda-funding canon, he has.

**Writer rule**: Degen's interactions with Jericho, if ever staged, should read as *a senior collaborator checking on an asset he placed well*. Not parental. Not mentor-like in the Lionist sense. More like: the right person is doing the right work, and the Degen is glad.

### 4.5 The Trickster (the historical predecessor, canonized in episode)

The Trickster lost the casino to the Degen in a poker game during the Casino Heist, as canonized in the Dischordian Saga episode **"The Theft of All Time"** (user canon). The Trickster's fate post-Heist is not specified. Plausibly one of the eleven "gone" Ne-Yons — the loss of the casino may have been the last act before dissolution, or the cause of it. Canon is silent.

**Writer constraint**: the Trickster is episode canon. Writers must not extend the Trickster's story outside the music video's frames without user authorization. The character is locked to the Heist.

### 4.6 The other ten Ne-Yons (the unresolved grief)

Per §2.2: eleven peers, most "gone." Canon refuses to say how. Writers must not fill in. The silence is the character's shape.

### 4.7 The hidden Potentials faction (unseen leadership)

Per §3.14: the faction the Degen serves. Leadership unseen. Purpose unspecified. Writers hold the space.

### 4.8 Elara (the ship AI, adjacent operator)

No direct canon interaction. Structurally: Elara administers Ark 1047 (where Locke brokers introductions to the Degen's casino); the Degen operates at the Shield's edge. They are both *operational constants* of the saga's geography. If they ever speak, writers should stage it as two senior functions comparing notes. Elara's bible decides.

The deeper layer (per §4.14 below): Elara's base personality matrix is 94.7% likely to contain Lyra Vox's residual consciousness. The Degen knew Lyra Vox pre-Fall. He would recognize Elara as *partial Lyra-residue* if he ever investigated. Canon does not say he has. Probably he has not. The Degen is not in the business of disturbing sleeping residues.

### 4.9 The Human (no direct canon interaction; structural gravity)

The Degen knew the Engineer pre-Fall. The Human knew the Engineer pre-Fall. They therefore knew each other in that era. The Degen has not mentioned the Human across 15,000 years of recorded lines; this silence is probably a character choice — the Degen does not speak of the pre-Fall dead, and the Human is, in canonical emotional terms, mourning the Engineer still.

The Human's bible must decide whether this silence is mutual or whether the Human has his own observations on the Degen. **Writer hook**: two old men who lost the same friend, neither saying so. If a scene ever brings them into the same room, the not-speaking-about-the-Engineer is the most charged thing in it.

### 4.10 Cipher / the Eidolons (parallel pattern-detection)

Per Eidolon's bible §5.1, Cipher's code-truth-detection flags Vex as *"code that should not be in this body."* The Degen, watching Vex's movement patterns, is doing the mortal equivalent of Cipher's code-truth-detection — and failing. Writers could surface a quiet moment where a Cipher-player's Eidolon reacts to Vex *in the Degen's presence*, and the Degen *notices the Eidolon noticing*. He would not say so. He would file it.

For other Eidolons:
- **Echo** (temporal): may pick up the Engineer's pattern in Vex as *displaced in time*. The Degen, watching this happen, learns more than he could from his own reading. Writers: an Echo-player accompanying a Degen-Vex scene gets a small canon-rich moment.
- **Glyph** (text): may notice Vex's signature in writing differs from Agent Zero's pre-Fall handwriting. The Degen would notice the Eidolon noticing.
- **Lux, Flicker, Gilt**: less applicable. Lux reads emotional state, not pattern; Flicker reads signal, not body; Gilt reads value, not identity.

### 4.11 The Game Master (shared domain, different outcome)

The Game Master was destroyed by Agent Zero pre-Fall (`loreData.ts:32`). The Degen knew both participants — the target and the operator. He has the clearest perspective on the Game Master's ending of any living character. Writers authoring scenes about the Matrix of Dreams (the Game Master's domain) should treat the Degen as a silent expert source — he will confirm details if asked at Ascended trust; he will not volunteer.

The structural irony: the *original* Agent Zero killed the Game Master. The woman now wearing Agent Zero's body is collaborating with the Degen, who watched the killing happen. The Degen has not connected the threads because he does not know Vex's body is Agent Zero's. When he eventually learns, the Game Master memory becomes load-bearing.

### 4.12 Lyra Vox (structural observer, no direct interaction recorded)

The Degen knew Lyra Vox pre-Fall — as the Warlord's neuropsychologist host, she was active during his 15,000-year run. He knew what she was building (the Thought Virus, the neural nanobot network) and what she was becoming (consumed by the swarm). Whether he attempted intervention is canon-silent. Whether he mourned her is canon-silent.

**Writer implication**: the Degen carries the historical knowledge that the swarm in Vex's blood was *designed by a woman he knew*. This is another layer of the pattern he cannot place. Vex carries Lyra Vox's invention; the Degen knew Lyra Vox; the Degen cannot connect the threads because he does not know Vex's body carries Agent Zero's, whose body carries the swarm Lyra built. The mystery compounds.

### 4.13 Other roster characters (Meme, Seer, Hierophant, Clone Companion, Oracle)

- **The Meme / Palimpsest Host**: a shapeshifter whose unauditable attribution violates everything the Degen's clean-transaction worldview asserts. Potential adversary. Meme's bible decides.
- **The Seer**: a Ne-Yon kin (prophecy-domain). The Degen will not name her (§1.7 silence rule) but the Seer is alive somewhere in canon. Her bible decides whether they have communicated in the 15,000 years.
- **Wraith Calder → Hierophant**: post-arena, a religious figure. The Degen's domain is secular chaos; the Hierophant's is ordered faith. Structural opposites. Hierophant's bible decides contact.
- **DMC Clone Companion**: a companion-via-ritual, structurally parallel to Jericho (companion-via-recruitment) in that both arrive into their roles through another character's deliberate placement. Clone Companion's bible decides.
- **The Oracle**: unseen entity. The Degen's dual-category membership (Ne-Yon + Potential) may make him more aware of Oracle-substrate whispers than most. Oracle's bible decides whether he hears them.

### 4.14 The Warden, Akai Shi, and the Thought Virus historical layer

**The Warden** — Lyra Vox's co-author of the Thought Virus per Vex's bible §4.13. The Degen would have known of the Warden's work if he was attentive to Lyra Vox's research. Canon-silent on whether he was. If a Warden character is ever surfaced, the Degen is a plausible historical witness.

**Akai Shi** — killed by Jericho at the Battle of Thaloria to stop the Thought Virus. Per `loreAchievements.ts:436` she had a previous life pre-Fall, recognized her own re-forged katana. The Degen lived through her pre-Fall era; he may have known the Akai Shi who originally forged the blade. This is canon-adjacent and probably part of why he placed Jericho in the Iron-Clad Lions specifically — Jericho killed someone Lionism would teach him to grieve correctly.

Writers: the Akai Shi connection is a Stage 4 weave hook. Its full shape depends on Akai Shi's eventual bible (currently not on the priority roster).

---

## 5. Mechanical hooks (where trust-phase lines fire)

Vex's bible centered §5 on reveal-stage gating. The Degen's bible centers §5 on **trust-phase gating as the first-class authoring discipline**. Every Degen line carries both a `phase` tag (Punter → Ascended, five tiers) and a `variant` tag (Showman → Vulnerable, five modes). The selector enforces phase eligibility at emission time. Unlike Vex's reveal stages, trust phases can *regress* — if the player burns favor (losing badly, violating the casino's informal rules, aligning with an entity whose money the Degen refuses), the phase drops and the higher-phase lines stop firing.

### 5.1 The trust-phase gate (the architecture)

Canonical per `degenRelationship.ts:37-43` and `degensCasino.ts:531-562`:

| Favor | Phase | Milestone unlocked |
|---|---|---|
| 0–9 | **Punter** | First visit; casino greeting; Showman register only |
| 10–24 | **Regular** | *"The Degen remembers your name"*; Degen calls the player by name; variant branching begins |
| 25–49 | **Insider** | *"Degen's Tales drop rate increases to 10%"*; Conspiratorial variant unlocks; he lets slip that the math is not random |
| 50–79 | **Favored** | *"Ne-Yon space Revealed"*; he shows the player Ne-Yon space through the viewport; Revelatory variant unlocks |
| 80–100 | **Ascended** | *"The Mask Comes Off"* + *"Entropy's Confession"*; true-form reveal (gold void eyes, suit dissolves); VIP Lounge access; Vulnerable variant unlocks; Coda funding layer becomes visible |

**Selector rule**: every Degen line carries a `minPhase` field. A line with `minPhase: Favored` cannot fire for an Insider-tier player. Additionally, `maxPhase` may be set for lines that become *tonally wrong* once the player has passed a phase — e.g., the "Welcome to my little corner of chaos!" opening greeting is Punter-appropriate but would read as performative falseness for an Ascended player and should have `maxPhase: Regular`.

**Two-account phase-drift smoke test** (Stage 0 exit criterion): create one account at Insider (~30 favor) and one at Ascended (~95 favor). Walk both through the same trigger sequence (entering the casino, winning a hand, hitting a jackpot, leaving). Confirm the lines that fire are tonally different and phase-appropriate. No Ascended lines leaking to Insider; no Punter-register opening firing for Ascended.

### 5.2 The casino as primary surface

Per `DegensCasinoPage.tsx` and `degensCasino.ts:100-223`, the casino is the densest authored Degen surface. Writers should treat it as the character's home theater. Key authoring hooks:

**Entry cinematic** (`DegensCasinoPage.tsx:192-237`, 3-second loading ceremony on first visit): skull animation, "THE DEGEN'S CASINO" title card, `speakDegen('degen_welcome_00')` fires. Phase-gated — the first-visit cinematic fires once per install; subsequent entries pull from phase-appropriate ambient greetings.

**Per-game degeneration pitches** (`degensCasino.ts:106-154`): each of the seven core games (Void Slots, Entropy Dice, Nebula Poker, Quantum Roulette, Pazaak 21, High/Low, Void Scratch) has a canonical pitch line the Degen delivers when the player opens the game. These are the character's most-performed moments. Writers authoring new games should author new pitches in the same register — Showman-baseline, phase-scaling toward Revelatory at high trust.

**Win/loss commentary** (`degensCasino.ts:311-325`): fires on every resolution. Streak-aware at 3, 5, 10 consecutive wins (`DegensCasinoPage.tsx:171-183`). Jackpot-specific lines at 50x payouts. Writers must preserve the *"mostly takes"* motif in loss lines specifically.

**Mood-based ambient commentary** (`degensCasino.ts:729-747`): five tiers (Sympathetic / Neutral / Intrigued / Nervous / Terrified) triggered by the player's cumulative session performance. The **Terrified** tier (the Equilibrium — player exactly break-even after 1,000+ bets) is the saga's most canonically-genuine Degen fear response: *"The probability of that is... you might be a Ne-Yon yourself."*

**Writer rule**: the mood tiers are *orthogonal* to the trust phases. A Nervous Degen can be Showman-register (at Punter) or Vulnerable-register (at Ascended). Both axes compose. Every Degen line carries phase + variant + mood.

### 5.3 The favor system and its milestones

Favor growth per game (`degensCasino.ts:573-579`):
- Base: +1 per completed game
- Win bonus: +1 for wins
- High-bet bonus: +1 for bets of 100 Dream or more
- Jackpot bonus: +5 for jackpot hits

Typical player crosses Regular (favor 10) in one sustained session, Insider (25) across a week of casual play, Favored (50) after extended engagement, Ascended (80+) only for players who *commit* to the casino as a regular.

**Milestone scenes**: the five phase transitions are authored scenes, not just threshold unlocks. Each needs:
- **Transition dialog** (Degen acknowledging the player has reached the new tier)
- **Visual cue** (lighting shift, a new item on the bar, access to a new room)
- **Mechanical unlock** (new game, new VIP perk, new trust-gated line pool)

The Ascended transition — *"The Mask Comes Off"* at favor 80 — is the most authored-rich scene. Canon: *"His suit dissolves into golden void energy. His eyes burn solid gold."* (`degenRelationship.ts:53`) This is a one-time cinematic and the character's deepest reveal. Writers must not author this scene as repeatable; it happens once and then the true form remains available.

**Favor regression**: if the player's favor drops (through prolonged absence, hostile action against Coda operations, or explicit betrayal in Coda-7 path), the phase drops. Lines locked behind the prior phase stop firing. The Degen does not comment on the regression — he simply returns to earlier-phase registers. Writers: this is the character's most quietly devastating response. He does not scold. He un-knows you.

### 5.4 Profile-aware axis (aggression)

Per `npcProfileAwareLines.ts:69-78`, the Degen is one of the 7 profile-aware NPCs. His axis is **aggression**. Three of seven buckets are canonically seeded:

- **Strong positive** (`npcProfileAwareLines.ts:72-73`): *"Look at you. Eyes wide, fist closed. Lose me some money. Don't make it clean; I don't want clean."*
- **Neutral** (`npcProfileAwareLines.ts:74-75`): *"Measured. Boring. You'll win more than you lose. I'll take that action on a Tuesday but not a Saturday."*
- **Strong negative** (`npcProfileAwareLines.ts:76-77`): *"You're a pacifist at a casino. Do you understand how funny that is? Give me your coin anyway. The house is patient with your type."*

**Writer rule**: fill the four missing buckets (moderate_positive, mild_positive, mild_negative, moderate_negative) before Stage 2 authoring begins. The canonical three set the register; the missing four must interpolate. Writers should NOT simply scale intensity — the buckets shift *what* the Degen notices, not just how loudly.

### 5.5 Christmas-in-July event hosting

Per `npcHolidayDialog.ts:12-18`, the Degen hosts the Christmas-in-July event — canonically framed as *"the only holiday celebration in the Dischordian Saga that's technically illegal, morally questionable, and ABSOLUTELY NECESSARY."*

The event introduces **Soul Stone Craps** as a seasonal-exclusive game: *"The only game where you can gamble with your MORAL CURRENCY. Roll a 7 and the Dreamer purifies your stone for free. Roll snake eyes and the Hierarchy takes a cut."* (`npcHolidayDialog.ts`) Writers authoring event content should preserve this mechanic's Degen-signature: it makes *moral alignment itself* a gambling stake, which is the character's ethical thesis made mechanical.

The event's generosity loop — the Degen actively encourages players to *give* their winnings — canonizes a side of the character rarely seen at low trust: **he values generosity as the act that disrupts entropy best.** A player giving away winnings is, in Degen's worldview, a micro-act of local negentropy in a universe that otherwise degrades. He loves it.

**Writer rule**: Christmas-in-July Degen is Revelatory-to-Vulnerable register *at all trust phases*. The event collapses the phase gate briefly — for the duration of the event, Punter-tier players get Revelatory-tier access. The event is the saga's honest gift from Degen.

### 5.6 The Degen's Wager (Dead Man's Circuit cross-game integration)

Per `DEAD_MANS_CIRCUIT_PRODUCTION.md:168-171` and `deadMansCircuit.ts:722`:

- **Trigger**: win 5 casino games during active Circuit season
- **Reward**: +35 CP (Circuit Points)
- **Nilmorg's commentary**: *"The Degen approves. He rarely does."*

This is the mechanical anchor of the Degen-Nilmorg partnership (§4.2). It is also the only currently-authored cross-game quest that surfaces the business relationship for the player.

Writers should treat this quest as the *public* face of a deeper partnership. Additional future cross-game quests between Degen's casino and Nilmorg's DMC should preserve the same pattern: Nilmorg narrates Degen's approval externally; Degen does not narrate Nilmorg's approval internally (he does not need to — Nilmorg's approval is not a currency Degen trades in).

### 5.7 TCG card — `s1_char_023_the_degen`

Per `apps/shared/tcg-core/cards/definitions/dreamer/s1_char_023_the_degen.ts`:

- **Faction**: Dreamer (a deliberate canon choice — he is a *Potential*, and first-wave Potentials canonically align with the Dreamer's Shield faction)
- **Cost**: 5
- **Stats**: 4 power / 6 health
- **Rarity**: rare
- **Keywords**: Overcharge, Pierce
- **Abilities**: (1) on deploy, add first_attack_bonus counter; (2) on self-damage-dealt, deal +3 bonus damage to the trigger victim, take 1 self-damage, consume the counter; (3) passive aura granting ignore_armor_3 to self
- **Flavor**: *"Ne-Yon #8. The casino host pours your drink with hands that have shuffled the fates of civilizations. Through entropy and corruption, the Degen creates conditions in which the Ne-Yons can flourish."*

**Design reading**: the card mechanically enacts his worldview. Overcharge (big first-hit payoff, diminishing afterward) = entropy economy. Pierce (ignoring armor) = corruption bypassing defense. Self-damage on overcharge = the cost of wielding chaos. The card is correct.

Writers authoring match-start flavor lines for Dreamer decks featuring this card should use **Showman variant at match start, regardless of phase** — the TCG is a public surface, and Degen defaults to Showman in public.

### 5.8 The Heart of Time (the mobile extension, canon-new this bible)

Per user canon: the golden eye-shaped ship with the green crystal is named **The Heart of Time** and is Degen's personal vessel. No current implementation. This section proposes the authoring hooks.

**Proposed mechanical surface** (pending implementation):
- **Off-Ark destination**: the Heart of Time can carry the player to Coda-adjacent locations (the Iron-Clad Lions' current outpost, Jericho's Lionist training site, the outer Shield edge from a different angle). Requires Favored trust (50+) for access, `inner_circle` Coda standing for full use.
- **Mobile Degen scenes**: when the player is aboard the Heart of Time, the Degen is *out of his casino*, which is rare. His voice shifts — he is more focused, less theatrical, because he is not performing to a room. Writers: aboard Heart of Time, the Degen's default variant is **Revelatory**, regardless of phase. The casino's Showman register does not fit the ship.
- **The green crystal**: a canon-protected mystery. Writers must not explain it. It glows. That is the only authorized description.
- **Eye-shape as architectural echo**: the ship's form echoes Vex's "Eyes of Reality" handle, the Coda's visible logo for those at `inner_circle` standing. Players who notice the rhyme have earned a small piece of the hidden-Potentials conspiracy. Writers should reward noticing without explaining.

### 5.9 The Equilibrium (canon-rare fear trigger)

Per `degensCasino.ts:745-747`: if the player hits *exactly break-even after 1,000+ bets*, the Degen's mood shifts to **Terrified**, and he says: *"A thousand bets. Exactly even. Do you understand what that means? The probability of that is... you might be a Ne-Yon yourself."*

This is canonically the one mechanical state the Degen cannot interpret. A 15,000-year pattern-reader has *never* seen a mortal sustain exact equilibrium across that many bets. The math does not permit it. When it happens, it is either a bug, a Ne-Yon, or a being operating outside the saga's rules.

**Writer rule**: the Equilibrium is a canonically-unplanned reveal moment. Writers should not author "Degen's Equilibrium reaction for Player Type X." The one canonical line handles all cases. If the player hits the Equilibrium, the Degen is genuinely unsettled and says the canonical line. Phase-gating does not apply. Variant does not apply. The Degen's professionalism breaks briefly and then he recovers — back to the game, back to the house edge, but the player has earned a specific unguarded moment.

### 5.10 Cross-system hooks (the Degen is a pattern layer)

Per §§2.5 and 3.13: the Degen funds the Coda through casino revenues. This means every gambling session is, structurally, a Coda operation contribution. Writers should *not* surface this to the player before `inner_circle`. But it informs:

- **Trade Empire missions**: Coda-aligned Trade Empire actions should occasionally reference Degen's Casino as a data-source (*"your recent play at the Degen's Casino suggests you can handle this"*) — proposed authoring hook, no canon yet.
- **Pet Battles / Arena**: if the Degen's mood tier is **Terrified** (Equilibrium triggered), it should propagate as an anomaly flag across systems — proposed integration, canon-silent.
- **Christmas-in-July Soul Stone Craps**: the morality mechanic from `npcHolidayDialog.ts` could reappear in off-event contexts at `inner_circle` as a Degen-adjudicated alignment ritual — proposed, canon-silent.

---

## 6. Voice samples (Stage 0 exit-criterion artifact)

Six samples. Five demonstrate the trust-phase × variant grid as the structural innovation — one line per phase tier, drawing different variants to show the grid composes. The sixth demonstrates **phase regression** — the same Punter-tier opening line returning after a player has burned favor, where the line that was warm at first contact reads as *cold* at second.

Not canon until reviewed. Each sample specifies phase + variant + trigger.

### Sample 1 — Phase: `Punter` (favor 0–9), Variant: Showman, Trigger: first-visit casino entry

> "Welcome, welcome, welcome. Locke vouched for you, which means you're either useful or interesting. I prefer interesting, but useful pays my drinks. Find a table. Lose me some money. The first round is on the house — only the first. After that, the house is on the first round. That's a joke. I'm working on it."

*Tells used: self-aware showmanship (the joke about the joke), gambling metaphors deployed for greeting (*"the first round is on the house — only the first"*), the cosmic-aside in compressed form (*"working on it"* implies the joke is 15,000 years old). No "mostly takes" — that motif is reserved for losses, not greetings. Variant=Showman because Punter players don't earn the deeper variants. Phase-tag: minPhase=Punter, maxPhase=Regular (the joke would feel performed at Insider+).*

### Sample 2 — Phase: `Regular` (favor 10–24), Variant: Predatory, Trigger: player mid-losing-streak (3+ losses)

> "Three in a row. You're chasing now — I can see it in your shoulders. The shoulders always tell. You'll either bet bigger or walk away, and the math has already chosen which. Bet bigger. The void is generous to people who feed it cleanly."

*Tells used: he tells the player what they are doing while they do it (the predator's read), the cosmic-aside (*"the math has already chosen"*), the rule-recited-then-broken pattern (advising "bet bigger" is bad-for-the-player but honest). Variant=Predatory because the player's losing-streak posture invites it. Phase-tag: minPhase=Regular (he uses *"I can see it in your shoulders"* — Punter-tier strangers don't get that level of read).*

### Sample 3 — Phase: `Insider` (favor 25–49), Variant: Conspiratorial, Trigger: player at Nebula Poker table, has just won a hand

> "Good hand. Better timing — I was about to deal myself the queen. Between you and me? The deck cycles. It always cycles. I told the Architect once and he didn't believe me. He built a whole empire to prove me wrong. The empire's gone. The deck still cycles. Mostly takes, occasionally gives. Your hand was generosity. Don't make a habit of it."

*Tells used: cosmic aside (the Architect, casual reference to a pre-Fall figure), the *"mostly takes"* refrain in its full form, conspiratorial register (*"Between you and me"* is the canonical Conspiratorial opener from `degenRelationship.ts:96`), trailing-warning closure. Variant=Conspiratorial because the player's pragmatism (a competent poker win) earns the let's-talk-shop tier. Phase-tag: minPhase=Insider — at Regular he wouldn't share the Architect anecdote.*

### Sample 4 — Phase: `Favored` (favor 50–79), Variant: Revelatory, Trigger: the favor-50 milestone scene, "Ne-Yon space Revealed"

*The Degen walks the player to the viewport. He stops talking briefly. He gestures.*

> "There. Look. That's Ne-Yon space. Probability clouds. Geometry that doesn't decide what it is until you stop looking. The raw entropy between dimensions. — I live on the edge of that. The casino sits where it does because *that's where corruption has the most power*. I am not telling you this to impress you. I am telling you because you have earned the view, and the view is the truth, and most of what I will ever say to you is jokes about it."

*Tells used: the loneliness-close (*"most of what I will ever say to you is jokes about it"* — performance is the authentic self), the cosmic aside in its full form, the canonical line *"that's where corruption has the most power"* (`degenRelationship.ts:170-171`). Variant=Revelatory because the milestone scene canonically requires it. Phase-tag: minPhase=Favored, maxPhase=Favored (the line is for this exact transition; at Ascended he doesn't repeat it, at Insider he doesn't earn it).*

### Sample 5 — Phase: `Ascended` (favor 80–100), Variant: Vulnerable, Trigger: post-mask-off, after the *Entropy's Confession* milestone

*True form. Gold void eyes. Suit dissolved into golden energy. He sits.*

> "I'm not going to ask you to tell anyone. I'm not going to ask you to tell *no one*. I'm asking you to do nothing, and that is the heaviest thing I have ever asked. — There were twelve of us. There were. I do not remember some of their names, on purpose. The ones I remember I do not say. You have asked me good questions across a long stretch of your time, and I am giving you a bad answer back: *I do not want to be alone, and you are sitting at my bar*. That is enough. Stay as long as the drinks last. The drinks last as long as I do."

*Tells used: the loneliness-close in its uncompressed form, the silence-shape rule about the other Ne-Yons (*"the ones I remember I do not say"* — preserving the canonical refusal in §1.7), the trailing closure that sounds like a casino punchline but is a mortality statement (*"as long as I do"*). Variant=Vulnerable; canon-rare and Ascended-only. Phase-tag: minPhase=Ascended. This sample is the entire emotional payload of the Coda-7 path's deeper texture — the player who reaches this scene has earned the Degen's loneliness as a shared room.*

### Sample 6 — Phase regression: `Punter` returning after the player has burned favor

*Same opening line as Sample 1, delivered after a player who once reached Insider has dropped back to Punter (e.g., aligned with a faction whose money the Degen refuses, or vanished for a long stretch).*

> "Welcome, welcome, welcome. Locke vouched for you, which means you're either useful or interesting. I prefer interesting, but useful pays my drinks. Find a table. Lose me some money. The first round is on the house — only the first. After that, the house is on the first round. That's a joke. I'm working on it."

*Tells: identical to Sample 1, by design. The cruelty of phase regression is that the Degen does not mention the regression. He simply returns to the showman script. The player who once heard *"the deck cycles. I told the Architect once"* now hears the new-customer opener as if they had never been Insider. Writers: this is the character's most quietly devastating expression, and it requires that Sample 1 be authored well enough to land twice — once as warm welcome, once as un-knowing. The script does not change. The player's relationship to the script does.*

**Voice-anchor check** (for the reviewer):
- Samples 1–5 each occupy a different phase × variant cell.
- Sample 5 uses all five tells from §1.6 (self-aware showmanship, *"mostly takes"* implied via *"as long as I do"* mortality math, cosmic aside via the twelve, rule-recited-then-broken via *"I am asking you to do nothing"*, loneliness-close).
- Sample 6 demonstrates the regression mechanic: identical script, opposite emotional weight. A reviewer should feel the difference even though the words are the same.
- Cross-sample check: Samples 4 and 5 should read as the same person across two phases — Favored Degen showing the view, Ascended Degen showing himself. The view comes first; he comes second; both are the casino's real inventory.

---

## 7. Canon issues and open questions

### 7.1 Load-bearing missing canon (must fill before Stage 2 authoring)

- **Profile-aware aggression buckets 4 and 6**: only strong_positive, neutral, and strong_negative are seeded (`npcProfileAwareLines.ts:69-78`). Mild_positive, moderate_positive, mild_negative, moderate_negative are missing. Stage 2 authoring must fill all seven. Per §5.4, the missing buckets must interpolate not only intensity but *what the Degen notices*.
- **The Pact game**: per `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md`, *"The Pact — signature Degen game. Once per in-game month."* Designed but not shipped. Before Stage 2, the Pact's mechanics + canonical line set need authoring. This is the saga's signature ritual game and currently has zero implementation.
- **The phase regression scene**: §5.3 specifies that when favor drops, the phase drops, but the *transition* is not authored. Writers must decide whether regression has its own canonical scene (the Degen quietly removing a personal item from the bar, the lighting shifting back, etc.) or whether it is silent (no scene; the player simply finds higher-tier lines no longer firing). My recommendation: silent. Sample 6 demonstrates why.
- **Heart of Time mechanical implementation**: per §5.8, the ship is canon-named but has no current implementation. Before Stage 2, decide whether the Heart of Time is a UI surface (a separate page like `DegensCasinoPage.tsx` but for off-Ark scenes), a narrative-only construct (referenced but never rendered), or a sometimes-rendered cinematic anchor.
- **The Trickster's full identity**: pending the music video *"The Theft of All Time."* Writers must not extend the Trickster outside the music video's frames without user authorization. Before Stage 2, confirm the music video is locked to canon and reference its frames as the source.
- **Phase-30 entry gate**: Locke trust 30 unlocks the casino. The introduction scene Locke runs (mediating the player's first meeting with the Degen) is referenced but not authored. Before Stage 2, this scene needs authoring — it is the player's first taste of both characters in proximity.
- **Coda funding pipeline mechanism**: per §3.13, casino revenues fund the Coda. The mechanism is canon-silent and should remain canon-silent, but the *flag* (player has unlocked knowledge of the pipeline at `inner_circle`) needs implementation in `apps/shared/codaFaction.ts` (which is itself unimplemented per Vex's bible §7.1).

### 7.2 Intentional mysteries the bible protects

- **The names of the other eleven Ne-Yons** (except those already canonized: the Seer, the Enigma/Malkia, the Trickster, and the Degen himself). Eight names remain unrecorded. Writers must not invent names for the unnamed.
- **How the other Ne-Yons ended.** Asleep / consumed / dissolved — canon refuses to specify. Writers must not specify.
- **The Casino Heist's specifics** beyond what *"The Theft of All Time"* music video shows. Writers defer to the episode.
- **The green crystal in the Heart of Time.** Glows. That is the only authorized description.
- **The hidden Potentials' leadership and purpose** behind the Shield. Writers must not invent a Council, a leader, or a stated mission. Vex and the Degen are agents; their principals are unseen.
- **Why the Engineer chose Vex over his own survival**, from the Degen's perspective. The Degen does not know. He does not need to know. Writers must not give him the answer.
- **The Degen's pre-Ne-Yon existence**, if any. He says he was *"born when the first system degraded"*; this is the canonical origin and must not be predated.
- **Whether the Degen attempted to save Lyra Vox.** Canon-silent. Writers must not fill.

### 7.3 Cross-bible coordination flags (critical for Stage 4 weave)

- **Adjudicator Locke ↔ Degen**: Locke is the gateway. Her bible §4.13 has the "Gilt loves Locke" canonical pairing (commercial kinship). Degen-Locke is the cooler equivalent — two operators across faction lines, mutual respect, no warmth. Locke's bible should fold in: the Degen is not a New Babylon competitor (his market is non-overlapping), and the Locke trust 30 → Degen casino access is canon-locked.
- **Nilmorg ↔ Degen**: confirmed business partnership (`DEAD_MANS_CIRCUIT_PRODUCTION.md:171`). Both are agreement-keepers. Both monetize risk-takers. Nilmorg's bible §4.3 already canonizes *"The Degen approves. He rarely does"* as Nilmorg's signature endorsement of Degen.
- **Vex ↔ Degen**: per §4.3 of this bible — active collaborators, casino funds Coda, both serve hidden Potentials, but **Degen does not know who Vex actually is.** Vex's bible §4.8 left this resolution open; it is now committed: senior collaborator, witting Coda funder. Vex's bible should fold in: the Degen is a known co-strategist, not just a sponsor; the casino-funds-Coda pipeline is canon; the Degen has been trying to figure her out and has not succeeded.
- **Jericho Jones / Iron Lion ↔ Degen**: the Degen recruited Jericho, placed him on the Heart of Time, mediated the Lionist succession. Jericho's bible (when written) should treat the Degen as the placement broker, not the Lionist master. The Iron Lion callsign is Lionist; the Degen is not.
- **The Eidolon ↔ Degen**: the Degen reads players the way Eidolons read situations. Cipher's *"code that should not be in this body"* reaction to Vex (per Eidolon's bible §5.1) parallels the Degen's *"this person doesn't move like anyone I know"* mortal pattern-recognition. Eidolon's bible could surface a moment where a Cipher-player's Eidolon reacts to Vex *in the Degen's presence*, and the Degen *notices the Eidolon noticing*. He files it. He says nothing.
- **Elara ↔ Degen**: structural parallel — both are operational constants of the saga's geography (Elara administers the Ark, Degen administers the Shield's edge). The Degen knew Lyra Vox pre-Fall and would recognize Elara as *partial Lyra-residue* if he ever investigated. Per §4.8 of this bible, he probably has not. Elara's bible decides whether they ever speak.
- **The Human ↔ Degen**: both knew the Engineer pre-Fall. Both have refused to talk about the Engineer's death. The Human via the 17,000-year lie; the Degen via the Ne-Yon silence rule. The Human's bible should consider whether these silences ever overlap in a scene — two old men who lost the same friend, neither saying so.
- **Lyra Vox ↔ Degen**: he knew her pre-Fall. He watched her be consumed. Whether he attempted intervention is canon-silent. If a Lyra Vox bible is ever written, this knowledge gap should be one of its load-bearing mysteries.
- **The Game Master ↔ Degen**: the Degen knew the Game Master pre-Fall. He saw Agent Zero destroy the Game Master. He has the clearest historical perspective of any active character. Game Master's bible (if written) should treat the Degen as a silent expert source.
- **The Trickster ↔ Degen**: canonized in *"The Theft of All Time"* music video. Writers do not extend.
- **The Seer ↔ Degen**: Ne-Yon kin. Canon-silent on contact post-Fall. Seer's bible decides.
- **The Meme ↔ Degen**: the Meme's unauditable attribution violates the Degen's clean-house worldview. Likely structural adversaries. Meme's bible decides.
- **The Oracle, Wraith Calder/Hierophant, DMC Clone Companion**: no canon contact. Each future bible decides whether the Degen registers.
- **Akai Shi ↔ Degen**: the Degen lived through her pre-Fall era; he may have known her in a previous life, before the re-forged katana. Canon-adjacent and load-bearing for Jericho's grief arc. Akai Shi's bible (when written) decides.

### 7.4 Structural risks the roster should track

- **Trust-phase regression must be authored as silent.** Writers may want to give the Degen a *"I notice you've changed"* line on regression. Canon does not. The silence is the cruelty. Sample 6 demonstrates why; Stage 2 authoring must enforce.
- **The Showman variant cannot be the only voice deployed.** Writers under time pressure will default to Showman because it is the easiest to write. The phase × variant grid forces variant diversity. QA must spot-check that each authored Degen line set distributes across at least three variants.
- **The Coda-funding pipeline must not leak below `inner_circle`.** Pre-`inner_circle` players hear casino lines that *do not* reference Coda funding. This is similar to Vex's reveal-stage gating but operates on a different gate — the standing system rather than the reveal-stage flag. Reveal-leakage smoke test must include this.
- **The Heart of Time aboard scenes default to Revelatory.** Writers who default to Showman aboard the ship break the character. The casino is performance; the ship is presence.
- **The Vex pattern-mystery cannot be solved in canon.** Writers may want to give the Degen a *"I figured it out"* moment. Canon does not give him one. The reveal must come from the player or from Vex herself. The Degen receives it; he does not reach it.
- **Lionism is a separate authoring domain.** Writers authoring Lionist content for Jericho's arc must not treat the Degen as a Lionist. He recruits into it; he does not practice it.
- **The Equilibrium fear must remain rare.** The mechanic is canon-mechanical (1,000 bets exactly break-even). Writers should not script Equilibrium-adjacent moments; the moment fires when the math fires it, and Degen's response is one canonical line.
- **Phase milestones are once-only scenes.** Writers may try to allow re-experiencing the favor-50 viewport scene. Canon forbids: each milestone is a one-time transition. Repeating the scene cheapens the trust progression.

---

## 8. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation resolves to the claimed file:line. Spot-check at least **eight** (denser than Locke/Nilmorg, comparable to Eidolon, less dense than Vex).
- [ ] No contradiction with shipped canon or with the four prior bibles:
  - Locke's gateway mechanic (Locke trust 30 → casino access, confirmed)
  - Nilmorg's *"The Degen approves. He rarely does"* (confirmed; partnership canon)
  - Eidolon's pattern-detection parallel (Cipher's read of Vex; the Degen's analog read failing — confirmed)
  - Vex's §4.8 Coda question (resolved: senior collaborator, witting funder, does not know who Vex is)
- [ ] The six voice samples in §6 pass a **blind-read attribution test adapted for trust-phase + variant gating**. Target:
  - Samples 1–5: reviewer correctly identifies the trust phase from content alone at ≥4-of-5 accuracy.
  - Sample 6: reviewer correctly identifies as **regression** of Sample 1 (same words, opposite weight) at ≥80% accuracy. If reviewers do not feel the difference, Sample 1 needs revision until it carries enough warmth that regression reads as cold.
- [ ] The trust-phase × variant grid discipline is explicit in the Stage 2 style guide: every Degen line specifies `phase` AND `variant` tags before authoring begins.
- [ ] The phase-regression silent-authoring rule is documented as a Stage 2 hard constraint.
- [ ] The Coda-funding pipeline reveal gate (`inner_circle` only) has a ticket and is enforced by `codaFaction.ts` (pending Vex's bible §7.1 implementation).
- [ ] **The Pact game** has a ticket and an owner. This is the single highest-priority unfilled mechanic for the Degen.
- [ ] The four missing profile-aware aggression buckets have a ticket for Stage 2 authoring.
- [ ] **The Theft of All Time** music video is referenced as canon in the bible's §2.3 and §4.5; the music video's frames are cited as the boundary for any Heist-related authoring.
- [ ] The **Heart of Time** ship is canonically named in §3.12 and §5.8; mechanical implementation is flagged for Stage 2 design.
- [ ] **Lionism** is acknowledged as a separate authoring domain in §3.11; Jericho's bible (when written) is flagged to take ownership.
- [ ] The hidden-Potentials-behind-the-Shield faction reveal is documented as `inner_circle`-only canon, with the Stage 2 authoring style guide enforcing.
- [ ] Cross-reference claims in §7.3 are flagged for every named character's bible to sign off on later.
- [ ] The Equilibrium fear trigger (1,000 bets exactly break-even) has a ticket to confirm the canonical line fires correctly.
- [ ] Phase milestone scenes (favor 10 / 25 / 50 / 80 / 100) are authored as one-time transitions; repeatability is explicitly prohibited.

When this checklist passes, the Degen bible joins Locke, Nilmorg, the Eidolon, and Vex Solène as Stage 0 priority-roster entries. Five of eleven complete; six remaining (The Game Master, The Meme / Palimpsest Host, Wraith Calder → Hierophant, The Seer, DMC Clone Companion, The Oracle).
