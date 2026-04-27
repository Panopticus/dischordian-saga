# Adjudicator Locke — Character Bible

> **Status**: Stage 0 draft — first bible on the priority roster. This is the rigor-calibration document; subsequent bibles match or exceed its standard.
>
> **npcKey**: `adjudicator_locke`
> **Pronouns**: she/her (confirmed canon-wide; one typo in `apps/client/src/game/lockeRelationship.ts:9` uses "He" — tracked in Canon Issues at the bottom)
> **Faction**: New Babylon Ascendant / Syndicate of Death
> **Formal title**: Special Case Manager, Central Control Authority
> **Manifestation**: Comms signal (never physically aboard Ark 1047)
>
> Every claim in this bible cites the file where the canon lives. A reviewer should be able to verify the bible by walking the citations.

---

## 1. Voice

Locke's voice is the easiest to imitate badly and the hardest to imitate well. On the surface she sounds like a financial negotiator. Underneath, she is a centuries-old professional who has turned a worldview into a dialect. Every line is a transaction — even the ones that pretend not to be.

### 1.1 Cadence

Locke speaks in **complete, declarative sentences**, then qualifies them. Her paragraphs move in three beats: assertion, reframing, close. She rarely hedges with "maybe" or "probably"; she asserts, then instruments the assertion.

> "Everything has a price. I'm here to name yours. I am Adjudicator Locke, Special Case Manager for New Babylon's Central Control Authority." — `lockeRelationship.ts:140`

The opening move is never a question. When she wants information, she states a premise and waits for the player to correct it.

> "The Human? You've been in contact? Interesting." — `lockeRelationship.ts:247`

She uses **parenthetical self-correction** as a tell — she catches her own euphemisms aloud, which is disarming and also a form of control (it displays her frame rather than hides it):

> "He was always the most stubborn idealist I ever profited from. I mean — worked with." — `lockeRelationship.ts:249`

At low trust her sentences are clipped. At high trust they unfurl into short monologues (see `lockeRelationship.ts:176`'s "endgame" speech, ~105 words, the longest she gets). Length is a trust signal — the more she says in one breath, the more she's treating the listener as a peer.

### 1.2 Vocabulary

Her lexicon is the bible's strongest voice anchor. Words she reaches for on reflex:

- **Ledger, portfolio, inventory, margin, invoice, account, receipt** — finance as default metaphor
- **Transaction, handshake, contract, marriage, default** — relationship terms borrowed from contract law (the "handshake / contract / marriage" triad at `lockeRelationship.ts:224` is signature)
- **Commodity, asset, appraise, leverage, buyer's market, revenue stream** — value is always priced
- **Deniability, neutrality, fine print, paperwork, clause** — power through procedure
- **Precedent, ruling, verdict, adjudicated** — she is an adjudicator; her judgments are final *as rulings*, never as verdicts of right and wrong

Words she **does not use**: "fair," "just," "right," "wrong," "sorry," "love," "betray" (in the moral sense). She avoids these not because she denies the concepts but because admitting them to her vocabulary would devalue her brand. When she wants to gesture at morality, she does it through price: "the most expensive commodity," "the fine print," "the house loses."

She does say **"my dear"** and **"my friend"** — terms of affection that carry no affection. They are politeness as interest rate. See `lockeRelationship.ts:158` ("Don't look at me like that") and `lockeRelationship.ts:176` ("my dear Potential").

### 1.3 Register

Formal, precise, boardroom-predatory. Never vulgar, never sloppy, never loud. Locke never raises her voice; she raises the stakes. Her formality is a *display of capacity* — the elaboration proves she could be blunter and is choosing not to be.

When the formality breaks, it breaks deliberately. The "...Touché" to Agent Zero (`companionDeepening.ts:127`) is the only recorded moment she concedes an opponent scored on her, and even that concession is a counter-offer ("Shall we trade ours?"). A writer should treat that "Touché" as a rare-earth element — one per arc, not one per scene.

### 1.4 Tells (signature rhetorical moves)

Four moves mark a line as Locke's even if the attribution were stripped:

1. **The transaction reframe.** She converts any non-transactional statement into a transaction and then evaluates the terms. "You said no. I respect that. I also remember it." (`lockeRelationship.ts:235`) — refusal is not rejection; it is price discovery.

2. **The aphoristic close.** She ends paragraphs with a line that reads like a quote pulled from a corporate annual report, generally cynical, generally true. Examples: "sentiment is just debt with a longer maturity date" (`lockeRelationship.ts:261`); "Peace is bankruptcy. Victory is obsolescence." (`lockeRelationship.ts:176`); "Modesty is just poverty with better manners." (`lockeRelationship.ts:259`). One such line per monologue, never two.

3. **The self-instrumentalization admission.** She tells the player what she is doing *while* she is doing it. "Don't look so alarmed — I'm not here to sell you anything. Yet." (`lockeRelationship.ts:140`) Transparency is her honeypot. A writer should trust this — she really does tell you, and she really is selling.

4. **The deferred threat.** A line that sounds generous but encodes a future cost. "You've probably already met one of ours without knowing it." (`lockeRelationship.ts:164`) "I've noted your willingness to transact." (`lockeRelationship.ts:224`) Nothing happens *in the line*. Something is logged.

### 1.5 Silence shape

What Locke will not say is as defined as what she will.

- **She will not name her superiors.** "The Authority" is always collective; the six coffined minds (`diplomacyMinigame.ts:83`, `tradeEmpire.ts:68-71`) are referenced as a structure, never as individuals. She never says a coffin-mind's name.
- **She will not name the deal that cost her the eye.** (`factionNPCs.ts:155` flags this as canon mystery.) Any writer who gives her that answer contradicts the character. The eye patch is a monument to unnameable price.
- **She will not express regret as regret.** The closest she gets is "I also remember it" — memory-of-loss as accounting-of-debt. Do not write Locke saying "I wish," "I miss," "I was wrong." She can be *proven* wrong; she cannot narrate herself wrong.
- **She will not plead.** Even cornered, she negotiates. If a scene demands Locke plead, the scene is wrong, not the character.
- **She will not laugh out loud.** She is amused — see the "Touché" moment — but the record carries no written laughter. A smile, a head tilt of approval (`infiltrationContent.ts` "head tilts approval"), an eye-patch catching light when she's pleased (`explorationSystems.ts`) — those are her laughter.

### 1.6 Metaphor sources

Finance, contract law, monetary policy, and heraldry of commerce. Her similes come from balance sheets ("revenue streams," "buyer's market"), from paperwork ("the fine print," "terms and conditions," "the ink is already forming"), and occasionally from the body of commerce itself — her Trade Coin line is monetary policy dressed as flirtation: "'Heads I win, tails you lose,' Locke said... 'That's not a joke. That's monetary policy.'" (`narrativeSystems.ts:268-270`).

She **does not** use military metaphors (Insurgency vocabulary), religious metaphors (Hierarchy vocabulary), or scientific metaphors (Architect vocabulary). When she must discuss those domains, she translates them into commerce: the Thought Virus becomes "the most valuable commodity in the galaxy" (`lockeRelationship.ts:158`); the Syndicate of Death becomes "we broker transitions" (`lockeRelationship.ts:170`). This translation habit is itself a tell.

---

## 2. History

### 2.1 Pre-game: centuries in New Babylon

Locke is a long-lived operative. The header of `lockeRelationship.ts:12` anchors the frame: "Locke knew The Human from her centuries operating in New Babylon as The Detective." Her own words confirm it: "The Human and I go back centuries." (`lockeRelationship.ts:249`). Whatever species or augmentation she is, she has outlasted generations of New Babylon's leadership and institutional memory. New Babylon itself is described as a polity that "survived the Fall because it had already sold its soul" (`lockeRelationship.ts:146`); Locke is the institutional form of that survival.

She did not rise through the Authority; she was *installed* as its Special Case Manager. The title is self-describing: she handles cases the standard ledger cannot categorize — deals too strange, too expensive, or too dangerous for ordinary brokers. By the time the player meets her, she has written the fine print on enough treaties that she speaks of statecraft and accounting in the same breath.

The one fact about her past she keeps privileged is the deal that cost her the eye. Canon flags this explicitly as opaque: "She lost the eye in a deal that went wrong — she won't say which deal. The eye patch is a reminder: every trade has a price." (`factionNPCs.ts:155`). This is the one wound she carries that she will not monetize into a story. A writer must treat this as load-bearing negative space. Any attempt to fill it in for a scene's convenience damages the character.

### 2.2 The instrumentalization of The Human

The single most important fact in Locke's biography is what she did to The Detective — the man who became The Human.

> "Every case he solved, every crime lord he brought down — it cleared the board for our preferred operators. We didn't corrupt him. We didn't need to. His integrity was the most useful tool in our inventory. The righteous never suspect they're being aimed." — `lockeRelationship.ts:152`

For centuries, Locke fed The Detective cases chosen to prune Locke's competition. He thought he was dismantling criminal networks; he was clearing Locke's market. She never told him. She is telling the player now only because trust ≥30 gates the revelation — she treats it as a gift of intelligence that doubles as a warning about what she is willing to do to an ally.

The high-trust callback makes the weight explicit: "Don't tell him. It would break what's left of his heart." (`lockeRelationship.ts:249`) She knows exactly what the revelation would do to him, she knows exactly what it cost him, and she names the cost with a precision that suggests she has thought about it for a very long time. This is the closest thing to remorse Locke is capable of expressing — and it is still structured as a transaction (*you* are now holding the secret; *you* will decide the interest).

### 2.3 Agent Zero — the other century-long file

Locke also has history with Agent Zero, cut differently. Their recorded banter at `companionDeepening.ts:118-127` plays like two retired operatives meeting in a hotel bar:

> (Zero) "Locke. I hear you're trading with the Potentials now."
> (Locke) "Agent Zero? You're supposed to be dead."
> (Zero) "And you're supposed to be neutral. We both have secrets."
> (Locke) "...Touché. Shall we trade ours?"

This exchange tells us two things the rest of the corpus doesn't show:
1. Locke is surprisable — Zero being alive genuinely catches her off-guard, which almost nothing else does.
2. Locke has the professional respect of an equal for *exactly one* other named character. Zero is the only person on record who gets a "Touché" out of her.

Faction-matrix places Locke as "enemy" to both The Human and Zero, but those two enmities are different in kind. The Human she used and lied to. Zero she faced across a table and respected. That distinction should shape every line Locke speaks about either of them.

### 2.4 Act-by-act posture

Locke's relationship with the player runs through five named trust bands (`lockeRelationship.ts:35-56`):

- **Prospect** (trust 0–19). "Locke is sizing you up — running credit checks on your soul. You are an unpriced commodity." She opens doors she has not yet committed to holding open.
- **Client** (trust 20–39). "Locke has opened a ledger with your name on it." Offers small deals to probe the player's price. The first revelation about New Babylon (`lockeRelationship.ts:146`) unlocks here.
- **Partner** (trust 40–59). "Locke shares forbidden knowledge the way other people share wine — generously, strategically, and always expecting reciprocity." The player is now peers-adjacent; she tells them about The Detective (`lockeRelationship.ts:152`) and the Thought Virus (`lockeRelationship.ts:158`). The Trade Coin keepsake unlocks at trust 50 (`narrativeSystems.ts:268`).
- **Insider** (trust 60–79). "Locke treats you as an operative." She reveals the network (`lockeRelationship.ts:164`) and the Syndicate's true business (`lockeRelationship.ts:170`). The player is inside the paperwork now.
- **Adjudicated** (trust 80+). "Locke has rendered her verdict: you are worth the truth." The endgame speech (`lockeRelationship.ts:176`) lands here — New Babylon does not want victory; it wants the game to continue.

Each band is a posture, not a mood. Across bands she becomes *more candid*, not *more warm*. The warmth writers will be tempted to add as trust rises is out of character. What rises is **specificity**. Early Locke speaks in parables about price. Late Locke names who paid what.

### 2.5 Personality variants (player-archetype responses)

Layered on top of the trust bands are five variants triggered by the player's expressed psychology (`lockeRelationship.ts:60-77`):

- **Mercantile** (low trust): straightforward broker mode. Default voice.
- **Predatory** (low trust + compassionate player): she senses kindness as a surplus she can extract from, and her lines become slightly crueler. She tests whether the player's virtue is genuine or purchasable.
- **Collegial** (high trust + pragmatic player): peer-mode. She drops honorifics, uses first-person plural ("we"), treats the player as a board member.
- **Conspiratorial** (trust ≥60 + manipulative player): she offers shared knowledge as bond-of-crime. Here she is at her most seductive and most dangerous.
- **Judicial** (trust ≥40 + suspicious player): she becomes formal and precise, turning the relationship into something like cross-examination, where she invites challenge so she can parry it.

A writer should think of these variants as *different pens* a single hand is holding. The voice doesn't change; the angle does.

### 2.6 Romance track (a note on form, not weight)

Locke is one of four romance-eligible characters on the Ark. Thresholds: flirting 40, mutual interest 55, committed 70, devoted 90. Romance with Locke has to be written as the hardest romance on the ship: she frames affection as an extended contract, and devotion as the rarest form of due diligence. The keepsake Trade Coin flirt at `narrativeSystems.ts:269-270` is the correct tonal anchor — monetary policy and courtship in one breath. Any Locke romance line that loses the transactional register has lost the character.

---

## 3. Background

### 3.1 Faction: New Babylon Ascendant / Syndicate of Death

New Babylon is the only polity on the galactic map described as surviving the Fall by prior moral concession. Locke narrates the faction's self-conception directly:

> "New Babylon survived the Fall because it had already sold its soul. We traded with everyone — Empire, Insurgency, Hierarchy. Neutrality isn't virtue, it's business." — `lockeRelationship.ts:146`

Its governance is six imprisoned minds in red crystal coffins (`tradeEmpire.ts:68-71`), collectively "The Authority." Locke speaks for them, never names them. She routes her lines through "the Authority" as a rhetorical house-style — "the Authority wishes you to be here" (`diplomacyMinigame.ts:83`) — even when she is clearly speaking her own interests. That lamination between personal agenda and institutional voice is a faction-culture feature: New Babylon's operatives present as deputies of the coffins even when they are running freelance.

The Syndicate of Death is New Babylon's outer-facing rebrand for its transformation-brokerage line of business:

> "We don't sell death — we broker transitions. Between life and digital. Between reality and the void. Between who you are and who you'll become." — `lockeRelationship.ts:170`

A writer working on any New Babylon surface should borrow this syntax. The faction does not refuse morally-fraught commerce; it re-describes the commerce as paperwork. Every act Locke performs — espionage, blackmail, assassination — is filed under a financial noun.

Faction mechanical identity in the TCG is summed up at `engineerLogs_factions.ts:154`: "New Babylon wins through exchange: sacrifice, resource gain, and mana manipulation." Locke's deck runs Bloodborn spells that pay with your general's HP for damage — a line from the cards *is* a line from Locke: "Dark bargain. The ledger balances." (`dialogBank_matchlifecycle.ts:204`).

### 3.2 Specialties / competencies

Locke is expert at:
- **Appraisal.** She looks at a new Ark, a new person, a new crisis, and prices it. "I'm here to appraise." (`lockeRelationship.ts:140`) Her opening act with any new contact is a survey.
- **Contract law and diplomatic paperwork.** The Red Crystal Accord (`diplomacyMinigame.ts:72-179`) is her home turf. She runs multi-demand negotiations where satisfaction is 2-of-3 and every failure is logged. A writer needs to treat her as a professional who *drafts*, not just one who argues — "the ink is already forming" (`diplomacyMinigame.ts:90`) is literal; she composes clauses in real time.
- **Instrumental psychology.** The instrumentalization of The Human over centuries (`lockeRelationship.ts:152`) and the "showed_greed" callbacks (`lockeRelationship.ts:259-261`) show a character who reads moral posture as leverage geometry. She does not convert people; she arranges incentives so they convert themselves.
- **Network operations.** New Babylon operatives are distributed across every surviving Ark (`lockeRelationship.ts:164`). Locke holds the map. When she says "You've probably already met one of ours without knowing it," she is not bluffing — it is a statement of inventory.
- **Legal theater under coercion.** The Act 3 Infiltration content places her in New Babylon court scenes as a monitor-based observer (`infiltrationContent.ts`), where she passes approval or alarm via the smallest physical signals ("her head tilts approval"; "Locke's face on the monitor changes from pride to alarm"). She is in her element inside formal rulings, even hostile ones.

### 3.3 Beliefs vs. behaviors — where she is coherent, where she contradicts

**Coherent**: Her stated worldview and her recorded actions align with unusual precision. She says everything has a price and then treats everything as priced. She says neutrality is business and then treats neutrality as inventory. Her honesty-about-dishonesty (`lockeRelationship.ts:20-24`) is, as the source note says, "paradoxically, one of the most reliable actors on the Ark — because you always know exactly what she wants."

**Contradictory** (and therefore alive):
1. **She claims neutrality; she has preferred outcomes.** The endgame speech (`lockeRelationship.ts:176`) concedes the truth: "we want the game to keep going… when the game ends, the house loses." Locke's "neutrality" is survival-interest masquerading as principle. A writer can put this tension in her mouth at high trust but *not* at low trust — at low trust she still sells the neutrality line because it is what the client is buying.
2. **She claims to respect professionalism; she exploits amateur-hour compassion.** See the Predatory personality variant (`lockeRelationship.ts:60-77`). She will call the player's kindness "appetite" and reframe it as vision (`lockeRelationship.ts:260-261`) — she respects a closed ledger and preys on an open heart.
3. **She claims transactions have no sentiment; she carries a centuries-old file on The Human.** She has kept receipts on one specific man for hundreds of years and can still name what the truth would cost him. That is not an accountant's relationship to a cleared account. It is — whatever Locke will not call it — attachment. Writers should let this crack show *only* at the highest trust bands, and never let Locke acknowledge it in the language of feeling.

### 3.4 What she wants from the player

In order of increasing depth:
1. **A handshake.** A first transaction — any transaction — to establish precedent. "The first deal is a handshake." (`lockeRelationship.ts:224`) She does not need the first deal to be large. She needs it to *exist*.
2. **A usable profile.** Once transacting, she maps the player's price: what moves them, what they refuse, what they refuse *with* (the refused_deal callbacks at `lockeRelationship.ts:235-237` are Locke building a customer file).
3. **An exclusive contract.** The `locke_exclusive_deal` permanent consequence at `companionDeepening.ts:252-261` is Locke's acquisition play. She wants New Babylon to be the Ark's preferred broker, which necessarily forecloses the Insurgency alliance path.
4. **A seat at the table.** The endgame pitch (`lockeRelationship.ts:176`): "a seat at the table that never folds." She wants the player inside New Babylon's strategic apparatus — not as an asset but as a partner whose interests align with perpetual managed conflict.
5. **Sample access to the Thought Virus.** The concrete mission objective underneath all of the above (`lockeRelationship.ts:158`, `factionNPCs.ts:155`). Everything else is infrastructure for this extraction.

### 3.5 What she would sacrifice the player for

A confirmed sample of the Thought Virus; the survival of New Babylon as a polity; the continuity of the Authority's six coffin-minds; the "game" continuing to be played. She would also sacrifice the player to protect her own operational security, though only if the player had stopped being an appreciating asset. While the player is producing returns, Locke keeps them alive out of enlightened self-interest, not sentiment.

### 3.6 What she would sacrifice for the player

At trust ≥80, one specific thing: operational information that implicates her own network. The endgame revelation (`lockeRelationship.ts:176`) is itself a sacrifice — she is telling a Potential how New Babylon actually makes money, which is the sort of admission that would get her recalled if the Authority heard it delivered in those words. She trades this for the player's buy-in. It is the deepest expression of loyalty available to her, and it is *still* a deal.

She will not die for the player. Any scene that asks her to is writing a different character.

### 3.7 Fears, superstitions, private rituals

- **Surveillance by peers.** `eidolonRelationships.ts` notes that Nyx — an intelligence-gathering eidolon — "makes Locke deeply nervous." Locke is the watcher; being watched well is what she fears. This is the one emotional register she will express almost honestly, though she will package it as a professional concern.
- **Unprofessional exposure.** Being forced into a scene without prepared paperwork. At `diplomacyMinigame.ts:91` the fail-state is "Locke signs nothing. She leaves. The next meeting will not happen." That withdrawal is her defensive move — she does not escalate; she exits, and the exit is itself the penalty.
- **The ink catching up to her.** The deal that cost her the eye (`factionNPCs.ts:155`) is canon silence. She checks the same fine print twice. She has a **ritual of reading to the bottom** — every document, including mundane transmissions. She tells the player directly: "I prefer to work with people who read everything I send them, not just the bolded parts. I am watching to see which kind of person you are." (`beatHInboxMessage.ts:59-66`) This is both a test and a tell.

### 3.8 Death conditions

Locke is hard to kill in three senses:
1. **In story.** She manifests by comms (`lockeRelationship.ts:26`) — never physically aboard Ark 1047 — so the ship's physical threats cannot reach her. She would die the way a firm dies: being outmaneuvered by another firm, losing the Authority's backing, or triggering a hostile acquisition by the Hierarchy. The Act 3 Infiltration plot-line gestures toward the second — her face "changes from pride to alarm" (`infiltrationContent.ts`) when a player reveals evidence she cannot unsign.
2. **In trust.** She can be bankrupted with the player by being caught in a lie the player cannot rationalize as an honest lie. Locke's brand is candor-about-corruption. A lie that contradicts her stated commercial frame — e.g., sentiment she wasn't priced in — is the kind of default that would break the relationship permanently.
3. **In meaning.** Locke's most frightening death is *peace*. The endgame speech names it: "Peace is bankruptcy. Victory is obsolescence." (`lockeRelationship.ts:176`) If the Ark's saga resolves with the game ending — factions unified, trade routes collapsed into a commons, the Authority freed from its coffins — Locke's role in the setting evaporates. She would not be killed. She would simply stop being necessary. This is the death she works hardest to prevent.

---

## 4. Cross-references to other priority-roster characters

Every other bible should sign off on its appearance here. Where this bible makes a claim about another character's relationship with Locke, that character's bible needs a matching claim or the two bibles need to reconcile before either ships.

### 4.1 The Human (enemy, by the faction matrix — but see nuance)

Locke's longest and most instrumental relationship. She used him for centuries in New Babylon while he thought he was dismantling crime (`lockeRelationship.ts:152, 249`). The word "enemy" in the faction matrix understates the asymmetry: from The Human's side she was an ally; from her side he was infrastructure. The player meeting both of them collapses that asymmetry — any player interaction that brings the two into proximity should respect the historical weight. The Human's bible (future) must acknowledge that Locke was the source of his highest-profile cases and he never knew it.

### 4.2 Agent Zero / Vex Solène / Engineer Zero (enemy, with respect)

The `companionDeepening.ts:118-127` banter is the only recorded meeting. Locke is audibly surprised Zero is alive ("You're supposed to be dead") and immediately recognizes a peer. Given the four-stage reveal on Vex/Engineer Zero (per plan Stage 3), Locke's lines about Zero must also be stage-gated: pre-reveal she speaks of "Agent Zero" as a dead legend; post-reveal she uses "Vex" or "the Engineer" or whatever name is current, and any line that aliases them references the reveal-appropriate identity only. Vex/Zero's bible must pick up the "we both have secrets" thread as a live standing offer.

### 4.3 Elara (neutral)

No direct quoted interaction. Faction matrix marks them neutral. Elara's deck-load line at `dialogBank_matchlifecycle.ts:100` — "Locke never paid a bill without knowing what it was" — implies Elara has observed Locke professionally, at distance, and respects the precision without endorsing the enterprise. That's the right register for them together: formal courtesy between two operators whose interests rarely collide and never align. Elara's bible should confirm this as an observed-but-uninvolved relationship.

### 4.4 The Antiquarian (complex)

Faction matrix flags the relationship as "complex." No quoted lines. The Antiquarian is a lore-and-artifacts character; Locke is a commerce character. The plausible tension is that the Antiquarian preserves things Locke would rather sell, and Locke appraises things the Antiquarian would rather protect. A writer authoring Locke-vs-Antiquarian lines should draft them as the polite hostility of two specialists claiming the same artifact. The Antiquarian's bible needs to make the specific nature of the complexity concrete.

### 4.5 The Source (enemy)

Enemy per faction matrix. No direct interaction quoted, but the Thought Virus revelation at `lockeRelationship.ts:158` describes Locke's ambition — "We want a sample… want to own it, patent it, and sell the antidote" — in terms that put her in structural conflict with The Source (who controls viral lore in the lattice). They are competing for the same commodity, from opposite ends of the supply chain. The Source's bible should acknowledge Locke as a known commercial adversary.

### 4.6 Nilmorg (no recorded contact, structural tension)

Not quoted together. Nilmorg operates the Dead Man's Circuit under the Hierarchy's entertainment division (`DEAD_MANS_CIRCUIT_PRODUCTION.md`); Locke is New Babylon. Structurally, Hierarchy and New Babylon are faction-rivals. The plausible Locke posture toward Nilmorg is commercial: she would respect a peer who "keeps his agreements" (Nilmorg's own line per the DMC docs) while remaining clear that his revenue model is parasitic on her markets. Nilmorg's bible will decide whether they have had any on-record dealings; until then, Locke treats him as an off-Ark competitor whose existence is priced into her models.

### 4.7 The Game Master (no structural interaction)

Game Master is a dead AI in the Matrix of Dreams. Locke has no business with him — her domain is priced transactions; his domain is inevitability in chess. A line where Locke comments on the Game Master should frame him as unpriceable, which is itself a kind of disdain from her.

### 4.8 The Seer (no quoted contact)

Faction matrix has no entry. The Seer is precognitive (sees "code beneath reality"); Locke's whole craft is reading the small print of already-written reality. They could plausibly have had a standoff in the past — precognition undermines Locke's information advantage. The Seer's bible should adjudicate whether they have met; if yes, Locke's posture is wary respect.

### 4.9 The Meme / Palimpsest Host (adversarial)

No quoted interaction, but a Meme that can inhabit any reflective surface is, to Locke, an un-auditable party to every negotiation. Locke's fear-surveillance reflex (Nyx, `eidolonRelationships.ts`) applies in triple here. Any line where Locke learns of the Meme's nature should be cold and procedural. The Meme's bible should decide whether The Meme has been inside Locke's coffin-chamber ruling rooms; that single fact will change how Locke's Act 3+ lines have to be rewritten.

### 4.10 Wraith Calder → The Hierophant (unknown pre-arena, wary post-arena)

Pre-arena Wraith Calder is a Potential who ran with a Wolf for seven days; Locke has no quoted commerce with him. Post-arena, the Hierophant leads a resurrected religion prophesying the Oracle. Locke's faction interest cuts against any large-scale religious movement — she cannot sell "deniability" to true believers. Her post-arena posture is probably anxious respect for the Hierophant's organizational reach. Wraith/Hierophant's bible needs to confirm whether the Hierophant has historical knowledge of Locke's role in any Tamarin religious material.

### 4.11 The Oracle (unseen, structurally central; Oracle bible shipped at `40fb771`)

The Oracle is the unseen entity preparing for the end. Locke would care about this enormously — the Oracle's visions are memories of collapsed timelines (`loreAchievements.ts` / `companionData.ts`), which is to say the Oracle has *priced futures data* that Locke's entire business model is built around pricing. If the Oracle speaks through the Ark, Locke wants in on the channel. The Oracle's bible should decide whether Locke has ever been one of the voices the Oracle has reached.

**Updated per `the_oracle.md` §§4.8, 7.3 OCB-O7**: the Oracle bible canonically resolves this question. The Oracle is canonically *structurally non-available to Locke* — bible-load-bearing canonical reasons:

(a) **Priced-futures interest canon canonically established.** Locke canonically *would canonically attempt canonical-Oracle-engagement* for canonical-priced-foresight-purposes if canonical Oracle-canonical-availability canonically operated. Per Oracle §3.5 future-memory-reading competence, the canonical Oracle's canonical foresight canonically *would canonically have canonical-economic-value* if canonical-Oracle-futures could canonically be canonically *priced and contracted*.

(b) **Structural-non-availability canon.** The canonical Oracle canonically *cannot canonically be canonically priced or contracted* by Locke. Three canonical reasons: (i) canonical Oracle canonically operates from canonical hiding (per Oracle §2.7); canonical hiding canonically does NOT canonically engage canonical-public-facing canonical-economic-systems. (ii) canonical Oracle canonically operates on canonical-substrate-channels (per Oracle §1.1); canonical-substrate-channels canonically do NOT canonically operate as canonical-contractable-services. (iii) canonical Oracle's canonical *I will canonically disappear* canon (per Oracle §1.3 + §2.9) canonically operates *canonically against canonical-economic-engagement* — canonical Oracle canonically does NOT canonically build canonical-ongoing-relationship-substrate.

(c) **Third-unpriceable-asset categorisation.** Locke canonically *recognises the canonical-non-availability* and canonically *files canonical Oracle as canonical-unpriceable* — Oracle is canonically Locke's canonical-third canonical-unpriceable-asset (parallel to canonical-soul-bound Eidolon and canonical Severance Companion per `nilmorg.md` §4.7). Locke canonically *respects the canonical-non-availability* without canonically attempting canonical-engagement.

**OCB-O7 satisfied.**

### 4.12 DMC Clone Body Companion (new asset; Companion bible shipped at `eb782e9`)

Starts silent, gains speech. Locke would take an immediate professional interest in a new-born companion with unclear loyalties. She would appraise. The Clone Companion's bible should consider Locke as the first person who treated them as a category of thing rather than a curiosity — this is, from Locke's side, a form of respect.

**Updated per `dmc_clone_companion.md` §§4.4, 7.3 DCB-O4**: the Companion bible canonically ratifies the category-of-thing-not-curiosity canon and canonically extends — the Companion canonically *registers Locke's category-treatment as canonical-respect* and canonically responds with canonical-respect-of-its-own. **Locke is canonically the saga's first character to treat the Companion as an entity not a curiosity** (per Companion bible §4.4); this is the Companion's *clearest single positive cross-character relationship in shipped canon*. Stage 2 dialogue authoring of any Companion-Locke scene should canonically anchor on this canon.

### 4.13 The Eidolon (asset she cannot price)

Locke distrusts intelligence-gathering eidolons (Nyx specifically). A player's personal, soul-bound Eidolon is harder to read. She would probably attempt to appraise it and fail, and say so — an unpriceable asset is, in her vocabulary, an anomaly worth watching. The Eidolon's bible should carry a line acknowledging that Locke has looked at it and deferred the appraisal.

### 4.14 The Degen (professional amusement)

Faction matrix has no entry. The Degen runs a casino; Locke runs a Syndicate. Casinos are the Syndicate's retail channel. Locke would likely treat The Degen with professional amusement — a subcontractor with a good local book. The Degen's bible should decide whether they have a formal franchise relationship with New Babylon.

---

## 5. Mechanical hooks (where authored lines need to fire)

### 5.1 Trade Empire

- **Faction-align to New Babylon**: full endgame-speech-tier monologue; trust delta +10; unlocks `locke_exclusive_deal` if not yet taken.
- **Sector entry — Trade Nexus, New Babylon Core, New Babylon Lower Tiers**: Locke greeting lines, band-aware. Her primary sectors per `tradeEmpire.ts:68-71`.
- **Route completion through her sectors**: small transactional interjections ("the ink is already forming" register).
- **Mission outcome**: praise/reprimand filtered through commerce terms — successful missions are "invoices paid"; failures are "defaults."
- **Faction-align to a rival** (Insurgency especially): Locke's cold lines, forecloses `locke_exclusive_deal`. The refused_deal tier at `lockeRelationship.ts:235-237` is the right tonal bank.

### 5.2 TCG

- **Match start, New Babylon deck**: the Elara deck-load line at `dialogBank_matchlifecycle.ts:100` is already there; Locke should also have a direct one-liner when playing her own faction.
- **Card played — `s1_char_001` Adjudicator Locke unit**: signature line on summon (her own name).
- **Card played — `s1_reward_companion_locke` Locke's Favor**: celebrative line, trust-aware (at high trust, familiar; at low trust, mercantile).
- **Bloodborn spell cast**: "Dark bargain. The ledger balances." (already canon at `dialogBank_matchlifecycle.ts:204`). More Bloodborn lines in the same register.
- **Match win vs. New Babylon deck**: Locke acknowledges the player beat her own faction — genuine respect, tonally closer to the Agent Zero "Touché" than to any defeat line.
- **Match loss to New Babylon**: the Authority's Trial pre-match counsel (`tcg-core/story/dialogBank_chapters_10_12.ts:251`) is the template; Locke is didactic, unsentimental.

### 5.3 Diplomacy minigame — The Red Crystal Accord

This is the single densest mechanical surface for Locke and it is already largely authored (`diplomacyMinigame.ts:72-179`). The bible's job is to protect what's there, not rewrite it. Expansion opportunities:
- Additional demand variants for replay sessions.
- Post-accord follow-up scenes that treat the signed or failed accord as precedent in later negotiations.
- Variant openings when the player returns to the table with a different faction already committed.

### 5.4 Rooms

- **Trade Hub** (primary): Locke's ambient comm-signal lines; mood shifts with trust.
- **Archives, Cargo Bay, Bridge** (secondary): situational one-liners. The breadcrumb from `explorationSystems.ts:53` ("Your card battle victory was observed. Adjudicator Locke wants to discuss a... business proposition.") is her signature room-entry trigger.

### 5.5 Infiltration content (Act 3)

The monitor-based court scenes at `infiltrationContent.ts` are Locke at her most visually compressed — she communicates through head tilts and facial shifts. Any new infiltration content should preserve this register: she reacts, she does not narrate. A writer authoring new infiltration beats for Locke should think of her as a camera with opinions.

### 5.6 Keepsake (Locke's Trade Coin, trust 50)

Already authored (`narrativeSystems.ts:268-270`). The flavor line is the tonal anchor for mid-trust Locke; any new keepsake material (if we add more) follows the same monetary-policy-as-flirtation register.

### 5.7 Non-trigger surfaces to consider adding later

- **Inner-voice interjections** (the Elara/Human pattern at `innerVoices.ts:154`): Locke already has a Perception-skill inner-voice trigger. Expand to a full companion-comment bank when she is present via comms.
- **Cross-character callbacks**: lines where Elara or The Human reacts to the player interacting with Locke. This is Stage 4 material; bibles should seed the content now.

---

## 6. Voice samples (Stage 0 exit-criterion artifact)

Five new lines, not drawn from existing canon, written against this bible. These are not canon until approved by a reviewer; they are a calibration test — can the bible produce lines that feel like Locke without copying Locke's existing paragraphs? A blind-read review should correctly attribute all five without the name.

### Sample 1 — Trust band: prospect (0–19). Trigger: `trade_empire.faction_align` to a rival faction.

> "You've aligned with the Insurgency. That's a choice. I don't take it personally — personal isn't a category I keep on the books. But I will note that the next time you want something from New Babylon, the menu will be shorter and the markup will be higher. Call it the cost of conviction. Most people don't."

### Sample 2 — Trust band: client (20–39). Trigger: `tcg.match_win` while playing a New Babylon deck.

> "Clean execution. You read the fine print on every card before you played it — I watched. There are people who run that deck on instinct and lose. You ran it as written, and the numbers came out where the numbers were supposed to come out. That's not luck. That's literacy. Literacy is billable."

### Sample 3 — Trust band: partner (40–59). Trigger: `room.enter` — Trade Hub, player has just refused a minor deal.

> "No on the cargo, then. All right. I'd be more suspicious if you said yes to everything; a client who never refuses is a client who isn't reading. You'll hear from me by the end of the shift with something structured closer to your actual interests. In the meantime, think about what 'your actual interests' are. I ask because most people don't know, and the ones who do know charge more for the same work."

### Sample 4 — Trust band: insider (60–79). Trigger: `narrative.flag` — player has just discovered a New Babylon operative embedded on another Ark.

> "So you've met one of ours. Good. That conversation you're about to have — the one where you decide whether to out him — will cost you something no matter which way you go. I won't tell you which choice is correct. I don't sell correct. I sell the fine print. If you keep him, the next invoice will be larger. If you burn him, I'll send a condolence card and a more expensive replacement. I'd prefer the former. I'd understand the latter."

### Sample 5 — Trust band: adjudicated (80+). Trigger: `trade_empire.mission_outcome` — player completed a mission that stabilized an ongoing conflict (i.e., threatened "perpetual managed conflict").

> "You stopped the shooting. I noticed. I'm not going to pretend that pleased me — peace is bankruptcy, and you just wrote off a quarter of my portfolio. But I am going to tell you something I have not said to a Potential in three hundred years: I trust you enough to be disappointed in you openly. That's a floor, not a ceiling. We'll renegotiate."

**Voice-anchor check** (for the reviewer): every sample should satisfy at least three of the five tells from §1.4. Sample 5 uses all four.

---

## 7. Canon issues and open questions

Tracked for cleanup; none block the bible.

### 7.1 Confirmed bugs

- **`apps/client/src/game/lockeRelationship.ts:9`** — header comment reads "Locke is honest about her dishonesty. **He** never pretends to be moral." Every other reference in the codebase uses she/her. This is a single-pronoun typo that should be changed to "She never pretends to be moral." Ticket this as a trivial follow-up; do not fix in the same commit as this bible.

### 7.2 Intentional mysteries the bible protects

- **The deal that cost her the eye** (`factionNPCs.ts:155`). Canon is deliberately opaque. Writers must not fill it in.
- **The names of the six coffin-minds in the Authority.** Not recorded. Locke never names them. Do not invent names for them in Locke dialogue.

### 7.3 Gaps to fill in later bibles

- **Elara ↔ Locke**: corridor-distance professional courtesy is the claim here; Elara's bible needs to confirm or counter.
- **The Antiquarian ↔ Locke**: "complex" is not specific enough. When the Antiquarian's bible is written, reconcile.
- **The Hierophant ↔ Locke**: post-arena relationship implied, not documented. Wraith Calder's bible decides.
- **The Oracle ↔ Locke**: have they ever touched? Oracle bible decides.
- **The Degen ↔ Locke**: franchise relationship is plausible but unconfirmed. The Degen's bible decides.

### 7.4 Structural risks the roster should track

- **New Babylon end-state**: if Stage 5's long-tail includes faction-ending scenarios, Locke's post-Authority self needs a chapter of its own. The "Locke without the coffins" voice is not written yet and the bible currently assumes the coffins are load-bearing. Revisit when the Ark's saga gets close to resolving the Authority.
- **Comms vs. physical manifestation**: Locke never appears physically on Ark 1047 (`lockeRelationship.ts:26`). If any scene wants her in the room, it needs to negotiate that explicitly — either through a projection, a courier, or a deliberate one-time arrival that carries dramatic weight.

---

## 8. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation above resolves to the claimed file:line. Spot-check at least six.
- [ ] No contradiction between bible claims and shipped canon. Any conflict is either fixed in source (via follow-up ticket) or resolved in the bible with a note.
- [ ] The five voice samples in §6 pass a blind-read attribution test with ≥4-of-5 correct when mixed with three random non-Locke lines from other characters' future bibles.
- [ ] Cross-reference claims in §4 are flagged for every named character's bible to sign off on later. No silent contradictions between bibles.
- [ ] The "He never pretends" bug in §7.1 is ticketed.
- [ ] The rigor bar set here is explicitly the baseline: subsequent bibles (Vex, Nilmorg, the Eidolon) match or exceed depth per section.

When this checklist is satisfied, Stage 0 advances from calibration to production, and the next bible begins.
