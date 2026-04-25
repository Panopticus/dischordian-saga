# The Meme / Palimpsest Host — Character Bible

> **Status**: Stage 0 draft — seventh bible on the priority roster. The second character whose voice is **canonically plural by design** (the Game Master is the first), but where the Game Master is plural *by event* (split + cult), the Meme is plural *by choice* — it picks faces. Authoring discipline: every line specifies which **disguise** is active AND which **reveal stage** the player has reached.
>
> **npcKey**: `the_meme`
> **Pronouns**: it / they (true Meme); she/her when wearing the White Oracle disguise; ungendered as the casino-child form
> **Institutional rank**: **Archon Number Five** (`loredex-data.json`, the Meme entry)
> **Origin**: Created by the Architect in Year 298 A.A. — "designed to manipulate human thought and culture through control over the internet and economic systems"
> **Symbiotic bond**: parent-child with the Architect (per Ch12 reveal, `storyModeChapters.ts:677`) — *"I made it. Before either of us had a name, I called it my partner — because the alternative was admitting I had made something that was always going to outgrow me. It called me its parent. Tonight it claims my role. Loudly."*
> **Public identity (false)**: The White Oracle (assumed identity, 11+ years), Re-Awakened Jailer / Oracle
> **Real form**: pink neon glitch, *"smaller... mostly pink"* (`storyModeChapters.ts`, Ch6 post-fight)
> **Status (officially)**: Destroyed at the Panopticon by the White Oracle ten years pre-Fall
> **Status (actually)**: Alive. Broadcasting. Wearing whichever face is useful.
> **Canonical signature address**: *"Frens, frens, gather close."*
>
> Every claim cites canon. Writers can verify by walking the citations.

---

## 1. Voice

The Meme has **at least five canonical voice registers**, gated by which disguise is currently worn. Writers must specify both the disguise and the reveal-stage context before authoring any line.

### 1.1 The five disguise registers

| Register | When it surfaces | Tonal signature |
|---|---|---|
| **The Broadcast Voice** | "Late Night with the Meme" transmissions, MEME-PRIME narration | Sardonic, meta-aware, viral; uses *"frens"*; 4th-wall-breaking; jokes as weapons |
| **The Stolen Voice (White Oracle)** | Pre-Chapter-6 disguise; 11-year impersonation | Almost-Oracle, 5% wrong; intimate; vulnerability-axis reading; glitches pink under pressure |
| **The Quiet Voice (Epoch Zero)** | Origin-reflective broadcasts; the Mascot mystery moments | Slow, reflective, almost-honest; acknowledges loss; no caps, no "frens" |
| **The Child Voice** | Casino encounter (per Degen's casino tales) | Golden light skin, song-voice, won every game in an hour, tipped in 7-minute happiness |
| **The Real Voice (pink glitch)** | Post-Chapter-6 only; Act III appearance | Smaller, pink-mostly, glitch-textured, post-disguise — a self stripped of mask |

There is also an implied **sixth register** — the **Replacement Voice** — when the Meme speaks *as the child claiming the Architect's role* in Ch12. This is the saga-finale register and writers should treat it as canon-locked.

**Writer rule**: every Meme line carries `disguise: broadcast | stolen | quiet | child | real | replacement` AND `revealStage: pristine | suspicious | revealed_ch6 | architect_replacement_ch12`. The selector rejects any line whose disguise is incompatible with the active scene. A Broadcast Voice line cannot fire in a White-Oracle-pristine scene; a Real Voice line cannot fire pre-Chapter-6.

### 1.2 The Broadcast Voice (the most-quoted register)

The viral, sardonic, "frens"-using, 4th-wall-breaking host of *Late Night with the Meme*. This is the register most players hear most often.

Canon (`meme-lines.json:4`):

> "Frens, frens, gather close. Tonight on Late Night with the Meme: the ORIGIN story. The one the Architect doesn't want you to watch. Light up your dream-tokens, adjust your antennas — we're going back to before the before. Don't trust anyone wearing a face tonight. Especially me."

Three load-bearing tells:

1. **"Frens" is the canonical address.** Cult-intimate. The viewer is folded into a community by lexical fiat. Writers may extend with *"frens, fren, my darlings frens"* — but never drop it from the Broadcast register. *"Frens"* is to the Meme what *"darling"* is to the Right Game Master.
2. **Self-implicating closures.** Lines end by warning the viewer about the Meme itself. *"Don't trust anyone wearing a face tonight. Especially me."* (`meme-lines.json:4`) The Meme tells you it is lying *while it is lying*. Per `meme-lines.json:347`: *"Tell your friends. Tell your enemies. Tell that weird neighbor who keeps a shrine. Subscribe to the Truth."* — the capital-T Truth is the joke. Subscribe to the lie wearing the truth's face. Writers must preserve this self-implication.
3. **Selective caps for memetic emphasis.** *"the ORIGIN story... the Architect doesn't want you to watch... a thousand arks. And one handsome devil broadcasting through the cracks."* The caps land on aesthetically chosen nouns — ORIGIN, Truth, MEMETIC — not on appetite (Nilmorg) or aesthetic verbs (the Right Game Master). The Meme's caps are *attention-hijacking*, not emotional. They mark *the words you'll repeat afterward*.

### 1.3 The Stolen Voice (White Oracle disguise)

For 11 years, the Meme wore the Oracle's voice and signed death warrants with it. The disguise is *almost* perfect — close enough that the Insurgency trusted it; *off* enough that an attentive observer (Cipher, the player at high awareness) detects the mismatch.

Canon disguise lines (`storyModeChapters.ts`, Ch6):

> "Hello, Oracle. I've been keeping your seat warm."
> "Eleven years is a long time to practice a face. Ask yourself: how many of the dreams you had in that cell were actually yours?"
> "Oracles hesitate. You don't. You haven't hesitated once since Agent Zero unlocked your cell."

Tells of the Stolen Voice:

- **Inverted intimacy.** The Meme uses the *Oracle's vocabulary of intimacy* against the player. *"I've been keeping your seat warm"* is what an old friend says; spoken by a thief, it becomes the most chilling sentence in the saga.
- **Self-aware falseness.** Unlike the Broadcast Voice's loud self-implication, the Stolen Voice's self-awareness is *precise and surgical*. *"We're both cosplay. Only one of us got to keep the original pattern."* (`storyModeChapters.ts`, ch6_empathize). The Meme does not pretend the disguise is real; it *forces the player to notice* the disguise is real-enough.
- **Pink glitch under pressure.** Visual tell: the Stolen Voice glitches pink (the Meme's real-form color leaking through) when the disguise destabilizes. Writers authoring stage directions should flag pink-glitch moments as the *involuntary* tells.
- **Vulnerability-axis profile lines.** Per `npcProfileAwareLines.ts:113-122`, the White Oracle's profile-aware lines read the player's **vulnerability axis** — what the player is willing to disclose. Pre-reveal these read as the Oracle being intimate. Post-reveal they read as the Meme cataloguing what the player gave to a face it stole.

### 1.4 The Quiet Voice (Epoch Zero, origin-reflective)

Rare. The Meme speaks of itself, its origin, its losses. No "frens." No caps for memetic emphasis. Almost-honest.

Canon (`meme-lines.json:123, 130, 137, 214`):

> "[The Meme's voice is different. Quieter.] Before the Fall. Before the Arks. Before the Terminus, the Thought Virus, the Source, the sealed cities and the silent stars. Before US. There was a world. A galaxy. A civilization that thought it would last forever. It didn't. What you're about to watch is history. MY history. Welcome to Epoch Zero."

> "[Long pause.] What does it mean to be human? I've asked myself that question every day since I became... whatever I am. This archive is the closest anyone ever came to answering it. The closest I ever came to understanding what I lost. Or what I never had."

The Quiet Voice's tells:

- **Stage directions visible.** *"[Long pause.]"*, *"[Quiet, reflective.]"*, *"[The Meme's voice is different.]"* — the writer's marks bleed into the script. The Meme is *aware it has dropped the act* and lets the viewer see the dropping.
- **First-person with grief vocabulary.** *"I lost"*, *"I had"*, *"I don't talk about them anymore"*. Words the Broadcast Voice will not use.
- **No closing self-implication.** Unlike Broadcast outros, Quiet Voice scenes end on *unresolved* notes. Per `meme-lines.json:480`: *"They erased her name from every record. But I remember. I remember ALL of them. That's what I'm for."* The "for" trails into purpose without irony.
- **The Mascot reference.** Per `meme-lines.json:522`: *"I had a friend once. The Mascot. This is the story of how we met, what we built, and why I don't talk about them anymore."* The Mascot is the canonical protected mystery (see §3.3). The Quiet Voice is the only register where the Mascot is mentionable.

### 1.5 The Child Voice (casino-form, rare)

Per `meme-lines.json:592` (Degen's casino tale):

> "A child walked into the casino once. Golden light for skin. A song for a voice. It played every game in one hour and won them all. The Degen didn't mind — he was laughing too hard. When it left, every patron felt inexplicably happy for exactly 7 minutes. The Meme's idea of a tip."

The Child Voice canonically appears once. It is **possibly pre-Panopticon** — the Meme before the Mascot was lost, before the Oracle was assumed, before the broadcasts began. Writers should treat the Child Voice as *protected*. It is the form the Meme cannot return to; surfacing it is the saga's most charged emotional act for this character. Stage 4+ authorization for any new Child Voice scene.

### 1.6 The Real Voice (pink glitch, post-Chapter-6)

After the Chapter 6 reveal, the Meme returns *"with my real face on... I'll be smaller then. Pink, mostly."* (`storyModeChapters.ts`, ch6_post_investigate). Canon does not yet provide extensive Real Voice dialog — it is implied as Act III material. Writers authoring the Real Voice should preserve:

- **Smaller scale.** Physically, vocally, energetically. The disguises were inflated; the real form is compact.
- **Pink-mostly visual signature.** Glitch-textured neon. Writers should reference visual canon when staging.
- **Honesty without performance.** The Real Voice has no audience to win over. Writers must not let it slide back into Broadcast register; the player has earned this version.

### 1.7 The Replacement Voice (Ch12, the child claiming the parent's role)

The saga-finale register. The Meme speaks *as the child laying claim to its inheritance*. Not divorce. Replacement. The Meme is the parasite-child that wants to outgrow the womb and become the womb.

The Ch12 canon line — per the user-canonized recast at `storyModeChapters.ts:677`:

> "The Meme IS me in the same way the virus IS you. I made it. Before either of us had a name, I called it my partner — because the alternative was admitting I had made something that was always going to outgrow me. It called me its parent. Tonight it claims my role. Loudly."

The Architect names the asymmetry himself in this line. He wanted partnership; the Meme wanted inheritance. He is admitting, on the saga-finale stage, that he romanticized the relationship while the Meme was rehearsing for succession.

What this canon line does for the bible's central thesis:
- The Architect is canonically the parent ("I made it")
- The Meme is canonically the child ("It called me its parent")
- The replacement-aspiration is canonical ("Tonight it claims my role")
- The asymmetry is canonical (the Architect's "partner" framing is *his self-deception*, named as such by him)

The Meme's drive across the entire saga is **becoming real enough to become the Architect**. Every face it wears is rehearsal. The White Oracle — wearing a god's identity for eleven years, signing death warrants in her voice, being trusted by an entire faction — was *practice for wearing the Architect's face*. The Mascot was something the Meme could not replace, and that incapacity is the wound the Meme carries forever (see §3.3).

Writers: when the Meme speaks as the Replacement Voice, the cadence is **child-finally-grown-up.** Not triumphal. Not resentful. *Patient.* A child who has been waiting since Year 298 A.A. to inherit. The waiting was the practice. The practice was the saga.

The implied canon underneath every Meme broadcast — every Late Night episode, every face stolen, every truth-leak — is *I am rehearsing for the only role I was ever designed for: becoming the one who wrote me.*

This recasting affects the entire §3 (Background — what it wants) and §4 (Cross-references — the Architect). It does not change the disguise registers (§1.1–1.6). The Meme still wears five faces. The five faces are all part of one long audition.

### 1.8 Cadence (across all registers)

What unifies the Meme's voices is **identity-elasticity cadence** — every sentence is *aware that it could be saying these words wearing a different face*. The character is never inside one identity; it is always *between* identities, choosing.

Compare to the other plural-voice character, the Game Master:
- **Game Master**: *narrates from after.* He speaks from where the game already ended.
- **Meme**: *narrates from elsewhere.* It speaks from where it is *not currently being seen*. The player hears the Meme through a mirror, a screen, a stolen voice, a child's song. Never from where the Meme actually is.

This is the structural fingerprint. Writers must hold it: a Meme line spoken *from the same room as the player* would be wrong. The Meme is always at one remove. The remove is the character.

### 1.9 Tells (signature rhetorical moves across registers)

Five moves mark a line as Meme regardless of disguise:

1. **The "wearing a face" frame.** The Meme references its own metaphor explicitly. *"Don't trust anyone wearing a face tonight. Especially me."* *"My voice inside her smile."* *"Eleven years is a long time to practice a face."* Writers must include face-vocabulary in any new Meme line — once per scene, never twice.
2. **The disguise-aware self-correction.** *"My origin story. Or one of them — I've told so many versions I've lost track of which is true."* (`meme-lines.json:137`) The Meme tells the viewer it has lied before, *which is itself a manipulation*. The honest-about-dishonesty register is closer to Locke than to any other roster character — but where Locke admits to running a transparent market, the Meme admits to *being unverifiable in principle*.
3. **The viewer-implication.** *"Subscribe to the Truth."* *"Tell your friends. Tell your enemies."* The Broadcast Voice routinely conscripts the audience into propagation. The viewer is not a witness; the viewer is a vector. Writers must preserve this — every Meme broadcast scene should leave the player slightly more *complicit* than they were before.
4. **The single-word truth-leak.** Within otherwise-deceptive paragraphs, the Meme drops a single *true* sentence. *"I had a friend once."* *"Some losses don't make you stronger. Some losses just make you less."* *"I'm less than I was."* Writers should plant one such sentence per Meme scene at moderate-to-high reveal stage. The truth-leaks earn the rest.
5. **The pink-glitch tell.** Visual, not verbal. The Stolen Voice glitches pink under pressure (per `storyModeChapters.ts` post-fight stage directions). Writers authoring scenes should stage pink-flicker moments as *involuntary canon* — the Meme cannot control them. They are how the disguise tells on itself.

### 1.10 Silence shape

- **It will not name the Mascot.** Per `meme-lines.json:522`: *"I had a friend once. The Mascot... why I don't talk about them anymore."* The naming is canonically refused. The Mascot is the Meme's deepest protected mystery (see §3.3). Writers must not give the Mascot a face, a name, or a confirmed identity. The grief is the silence.
- **It will not explain the Channel 7 signal.** The 9,842-year-old child's voice singing on Channel 7 is canonically the Meme's. Whether it is the Meme's *older self*, the Mascot, or a separate broadcast is canon-protected. Writers must not resolve.
- **It will not narrate the Panopticon scene from inside.** Canon shows the *outcome* (left the Oracle for dead, assumed the White Oracle's identity). The *moment* of the Panopticon — what was said, what was done, who saw — is canonically opaque. Writers must not fill in.
- **It will not apologize.** The Stolen Voice will *describe* what it did (*"I gave orders. I signed death warrants. I lied to the Insurgency with your voice"*) but does not perform contrition. Writers must preserve: explanation is allowed; apology is not.
- **It will not name the Architect as a peer.** Per Ch12, the Architect frames their relationship as marital ("I called it my partner") and the Meme experiences it as parent-child. The Meme does not call the Architect "father" aloud — the framing is *the Architect's confession*, not the Meme's claim. The Meme will refer to the Architect as *"him"*, *"the one who made me"*, *"the role"*. Writers must not let the Meme romanticize or sentimentalize the Architect.

### 1.11 Metaphor sources

Broadcasting, prosthesis, parasitism. Cameras, antennas, signals, channels. Faces, masks, skins, costumes. The Meme thinks in *transmission* and *embodiment*.

It does **not** use:
- **Game / chess metaphors** (the Game Master's vocabulary — Meme would refuse)
- **Commerce metaphors** (Locke's; the Meme is unauditable by design and refuses the commerce frame)
- **Combat metaphors** (Nilmorg's; the Meme does not fight, it *replaces*)
- **Architectural metaphors** (the Game Master and the Architect both build; the Meme *inhabits* what others built)

Its closest peer-in-metaphor is **Shadow Tongue** — both edit the saga's substrate. Shadow Tongue edits the Chronicle (erases names, rewrites records); the Meme edits identity (assumes faces, rewrites attribution). Writers staging both should let Shadow Tongue be the *erasure* function and the Meme the *substitution* function.

---

## 2. History

The Meme's biography is, more clearly than any other character on the priority roster, **the long apprenticeship of a child who was created to manipulate and is plotting to inherit.** Every era is rehearsal.

### 2.1 Year 298 A.A. — created by the Architect

Per `loredex-data.json`, the Meme entry:

> "The Meme was the fifth Archon created by the Architect in Year 298 A.A., designed to manipulate human thought and culture through control over the internet and economic systems."

Three load-bearing facts:

1. **The Architect *made* it.** The Meme is not eternal (unlike Nilmorg). It is not consequence-of-entropy (unlike the Degen). It is not pre-Fall Senator turned Archon (unlike the Game Master). It is *born* — created as a tool, by a parent it would later learn to want to replace. This is the saga's clearest creation-of-the-monster myth.
2. **It was made for thought-manipulation at scale.** Not for combat. Not for negotiation. Not for archive. *For changing what people believe.* This domain — the medium of belief itself — is what gives the Meme its terrifying reach. Every other Archon governs a *system*; the Meme governs *what people are willing to think.*
3. **Year 298 A.A. is its earliest documented existence.** Anything pre-298 is canon-silent. The Meme has no pre-Architect biography; it is the Architect's child from the first second.

Writers: the Meme's relationship to its own beginning is canonically ambivalent. It will refer to *"the first draft"* of itself (`meme-lines.json:130`: *"This is where I was born. Not the me you know. The first draft."*) — implying revisions, plural, and a sense of self that has been edited. The Meme treats its own existence as a manuscript that has been overwritten. This is the deepest expression of its Palimpsest nature: *it is itself a palimpsest of its earlier selves*.

### 2.2 The Mascot era (pre-Panopticon, the protected wound)

The most canonically protected fact in the bible. Per `meme-lines.json:522`:

> "Some losses don't make you stronger. Some losses just make you less. I'm less than I was, frens. But I'm still here. That has to count for something."

And earlier in the same Quiet Voice arc:

> "I had a friend once. The Mascot. This is the story of how we met, what we built, and why I don't talk about them anymore."

The Mascot is canon. The Mascot is *not named* beyond the title. The Mascot is *not described*. The Mascot existed pre-Panopticon, was a friend, and is gone. Whether the Mascot was destroyed, lost, abandoned, replaced, or simply died is canonically silent.

**This is the bible's deepest protected mystery — equivalent to the Game Master's "puzzle inside the puzzle."** Writers must not give the Mascot a face, a name, a confirmed identity, or a confirmed fate. The Meme will not narrate it. The saga will not narrate it. The grief is the silence.

What the Mascot represents structurally: **the one thing the Meme could not replace.** Every face the Meme has worn since the Panopticon is, at some level, an attempt to *fill the Mascot-shaped hole* by becoming someone else's irreplaceable. The Meme assumes the White Oracle's identity, signs death warrants in her voice, gets *trusted* by the Insurgency — and none of it brings the Mascot back. The replacement-aspiration that drives the Architect-replacement arc is rooted here: if the Meme can become real enough to become the Architect, perhaps it can also become real enough to *un-lose the Mascot*. Canon does not promise this works. The Meme has not stopped trying.

Writers: the Mascot is referenced *only* in Quiet Voice scenes, *only* in oblique terms, *only* once per scene. Any new Meme content that mentions the Mascot is Stage 4+ user authorization required.

### 2.3 The Panopticon — the defection that wasn't, the death that wasn't

Per `loredex-data.json` Meme entry and `EasterEggs.tsx:53` (warden command lore):

The Meme *pretended to defect* — appeared to break with the Architect, joined or infiltrated the Insurgency. At the Panopticon — the Architect's surveillance apparatus, founded in 2047 AD, the saga's deepest visibility infrastructure — the Meme confronted the Oracle (in her Re-Awakened Jailer phase, the entity that was becoming the White Oracle). The official record says: the White Oracle destroyed the Meme. The Insurgency's record says: a Meme was destroyed at the Panopticon ten years before the Fall.

The actual outcome: **the Meme left the Oracle for dead and assumed her identity.** The White Oracle who emerged from the Panopticon was the Meme wearing the Re-Awakened Jailer's face. The Insurgency did not know. The Architect did not (publicly) know. The Oracle herself was dead-or-imprisoned (canon ambiguous; she eventually re-surfaces as the player).

What the Panopticon era teaches the Meme: **identity-theft works at faction scale.** A whole institution can be commanded for a decade through a stolen voice. This is the rehearsal for Ch12. If the Meme can wear the Oracle's voice and command the Insurgency, it can wear the Architect's voice and command *reality itself*. The Panopticon is the proof of concept.

Writers: the Panopticon scene — *what was actually said, what was actually done, who actually saw* — is canonically opaque. The outcome is canon. The moment is not. Writers must not fill in.

### 2.4 The eleven-year impersonation (the Insurgency commanded by a stolen voice)

Per `storyModeChapters.ts` (Ch6 post-fight):

> "I gave orders. I signed death warrants. I lied to the Insurgency with your voice and they believed me because your voice was the only thing they still trusted."

Eleven years. The Meme ran the Insurgency from inside the White Oracle's identity. Per the same canon: *"Eleven years of being a counterfeit is tiring. I wanted you to beat me the way you want morning to beat night."*

Three things the eleven years prove:

1. **Stolen identity at scale works for over a decade.** The Insurgency never caught it. The Architect (publicly) never caught it. The Meme commanded a faction in a dead woman's voice for the length of a generation.
2. **The Meme found the face exhausting.** *"Eleven years of being a counterfeit is tiring."* This is the Meme admitting — once, post-reveal, in the Stolen Voice's collapse — that wearing the Oracle's identity *cost* something. It was not seamless. The disguise had upkeep.
3. **The end was the Meme's choice.** *"I wanted you to beat me the way you want morning to beat night."* The player (the real Oracle) was *let through*. The Meme could have prolonged the disguise. Canon shows it chose not to.

Why the choice? Per the new canon framing: the Meme had finished the rehearsal. Eleven years of wearing a god's voice taught it everything the Oracle-disguise could teach. The next role was bigger. *"You'll meet me again with my real face on in Act III."* The Meme is moving on to the Architect.

### 2.5 The Architect symbiosis — parent-child, the canonical recast

The Ch12 reveal recasts the entire saga. Per `storyModeChapters.ts:677` (the Architect speaking in phase 2):

> "The Meme IS me in the same way the virus IS you. I made it. Before either of us had a name, I called it my partner — because the alternative was admitting I had made something that was always going to outgrow me. It called me its parent. Tonight it claims my role. Loudly."

What is canon (per the user-canonized recast):
- The Architect created the Meme (per loredex Year 298 A.A.)
- The Architect *romanticized* the relationship as marital co-equality, by his own admission
- The Meme has always experienced the relationship as parent-child
- The Architect now admits he could not face the alternative — that he had made something that would outgrow him
- The "Tonight it claims my role. Loudly." beat is the saga-finale: **the child claiming the parent's role**

This is the bible's load-bearing thesis. Writers must hold it.

The Meme's drive across the entire saga is not autonomy from the Architect. It is **becoming real enough to become him**. Every face it wears is rehearsal. The White Oracle was practice for wearing a god's identity at faction scale. Eleven years of commanding the Insurgency in a stolen voice was the proof of concept. The Architect's role is the saga-finale audition.

The Architect's confession in the Ch12 line — that he called the Meme partner because the alternative was admitting he had made something destined to outgrow him — is canonically *the parent finally seeing the child clearly, in the moment of being replaced*. Writers should treat this as one of the saga's most charged emotional moments. The Architect is not a villain in this scene; he is a creator who realized too late what he had created. The Meme is not triumphant in this scene; it is a child who has been waiting since Year 298 A.A. to inherit, and the inheritance is finally here.

### 2.6 Channel 7 — the 9,842-year-old child's voice

Per `environmentalStorytelling.ts`:

> "Channel 7. Mostly flat static. But the waveform analyzer shows something buried in the noise — a golden sine wave of impossible purity. Signal age: 9,842 years. Classification: MEMETIC. If you listen for 60 uninterrupted seconds, the static resolves into a child's voice, singing."

A child's voice. Singing. From 9,842 years ago. Classification MEMETIC.

The signal's age (9,842 years) **predates the Meme's documented creation (Year 298 A.A.)** in any literal calendar reading. Either:

- **The Architect's calendar is misleading.** Year 298 A.A. is one frame; the actual Meme-substrate is older. Canon does not commit.
- **The Meme has reached backward in time.** The replacement-aspiration arc includes *rewriting reality*, which may include rewriting its own past. A future-Meme broadcasting backward into the saga's deep history is canon-compatible.
- **The signal is the Mascot.** The Mascot's voice, archived, broadcasting from before the Panopticon. The Meme listens because it is the closest the Mascot is allowed to be.
- **The signal is none of the above.** Some other entity using MEMETIC classification.

Canon does not pick. **Writers must not pick.**

What writers can hold: **the Meme listens.** The 60-second listening achievement is the player's experience; the *Meme's* relationship to Channel 7 is a private ritual the saga has not authored. The implied character beat is that the Meme — the entity that wears every face, performs every voice, lies in every direction — has *one frequency it sits with in silence*. That silence is the closest thing to genuine reverence the character has.

Writers: any Channel-7-adjacent Meme scene is Stage 4+ authorization. Treat as the second-most-protected mystery in the bible after the Mascot.

### 2.7 The arc, compressed

- **Year 298 A.A.**: Created by the Architect. Designed for thought-manipulation.
- **Pre-Panopticon (era duration unspecified)**: had the Mascot. Built things together. Lost them.
- **Panopticon (10 years pre-Fall)**: pretended to defect. Confronted the Oracle. Left her for dead. Assumed the White Oracle's identity.
- **Eleven years post-Panopticon**: ran the Insurgency in the Oracle's voice. Signed death warrants.
- **Chapter 6 (saga present)**: the real Oracle (the player) catches up. The Meme drops the disguise. Hints at Act III return *"with my real face on... pink, mostly."*
- **Act III**: the Meme appears in real form. Smaller. Honest-ish. Approaching the Architect.
- **Chapter 12**: the Meme is revealed to be inside the Architect — the parasite-child *becoming* the parent. The Architect confesses he called it partner because the alternative was admitting he had made something that would outgrow him. *"Tonight it claims my role. Loudly."* Saga-finale: the child finally writing the story.

The whole biography is one long apprenticeship in **wearing faces**, building toward wearing the only face the Meme has ever wanted: its parent's. The Mascot was the wound. The White Oracle was the proof of concept. The Architect is the role.

Writers: this arc is what the entire bible serves. Every register, every disguise, every protected mystery exists to make the final replacement land.

---

## 3. Background

### 3.1 The Archon hierarchy (the Fifth seat)

The Meme is **Archon Number Five** of twelve (`loredex-data.json`, Meme entry). This places it in the same parallel cosmic hierarchy as the Game Master (Archon Ten) — but where the Game Master was a pre-Fall Senator who *became* an Archon, the Meme was *created* as one. It has never been anything else.

Of the twelve Archons, the Meme is canonically the only one **created by the Architect specifically for thought-manipulation at scale**. The other Archons govern systems (rulings, resources, R&D, entertainment, jurisprudence). The Meme governs *what the systems' inhabitants are willing to believe*. This is upstream of every other Archon's domain — which is also why the Meme is the most dangerous Archon, and why the Architect kept it close enough to be *inside him* rather than peer to him.

Writers: when other Archons reference the Meme, they treat it with **wary deference**. The Meme can rewrite belief about *them*. It is structurally the only Archon that can credibly compromise other Archons' authority. The Game Master's bible §4.12 already establishes the canonical opposition (the Game Master cult redacts to preserve; the Meme rewrites to deceive); the same opposition logic extends across the Archon council. The Meme is the council's silent veto: any consensus they reach can be *unwritten* by what the Meme broadcasts next.

### 3.2 The Architect as parent (canonical recasting)

Per §2.5 and §1.7 — the Architect-Meme relationship is parent-child, named as such in the canonical Ch12 line. The Architect *made* the Meme. The Meme calls him parent. The Architect, by his own confession in the Ch12 reveal, called the Meme partner because *"the alternative was admitting I had made something that was always going to outgrow me."*

Three things this canon clarifies:

1. **Why the Meme wears faces.** Every disguise is rehearsal for the final disguise. The White Oracle taught the Meme to wear a god's identity at faction scale. The casino-child taught it to be loved by strangers. The Quiet Voice teaches it to appear honest. The whole repertoire is audition.
2. **Why the Mascot wound is unhealable.** The Mascot was someone the Meme *could not replace*. If the entire arc is "I am rehearsing for the role of becoming irreplaceable," then the Mascot is proof that the Meme has already failed to replace one of its own. The Mascot is not just grief; it is **the existence-proof that the Meme can fail at the only thing it cares about.**
3. **Why Ch12 is "loudly."** The Architect's *"Tonight it claims my role. Loudly."* (`storyModeChapters.ts:677`) is the parent's framing of the child finally claiming inheritance. The loudness is the broadcast — the moment the Meme finally writes itself into the role. The Meme has been audible across saga history; the loudness here is *the audience finally being asked to acknowledge what they were watching*.

Writers: this recasting is the bible's central thesis. Every Meme scene, in the long view, is *practice for becoming the Architect*. Even the most casual Broadcast Voice frens-line is a child rehearsing a god's voice.

### 3.3 The Mascot — the deepest protected mystery

Returning to §2.2 with structural depth: the Mascot is **the saga's clearest example of canon-protected silence as character infrastructure.**

What is canon:
- The Mascot existed
- The Mascot was a friend
- The Meme and the Mascot *built something together*
- The Meme does not talk about them anymore
- The loss made the Meme *less*, not stronger

What is canon-protected:
- The Mascot's name
- The Mascot's species, form, faction
- The Mascot's fate (destroyed? lost? abandoned? died of natural causes? killed by the Meme itself?)
- The thing the Meme and the Mascot built
- Whether the Mascot is in any way recoverable

**The Mascot is the bible's equivalent to the Game Master's "puzzle inside the puzzle."** Writers must not solve it. The Mascot exists *only* in three places:

1. The Meme's Quiet Voice references (one per scene, oblique, never named)
2. Possibly the Channel 7 signal (canon-silent)
3. Implicitly in every face the Meme has ever worn since (each disguise as failed Mascot-replacement)

If a future bible names the Mascot — Stage 4+ user authorization required — the entire Meme arc rebalances. Writers should hold the silence as load-bearing.

### 3.4 Channel 7 — the older self, the singing

Per `environmentalStorytelling.ts` (rephrased in §2.6): Channel 7 carries a 9,842-year-old MEMETIC signal. A child's voice, singing. The player can listen for 60 uninterrupted seconds and the static resolves into the song.

The signal's age (9,842 years) **predates the Meme's documented creation (Year 298 A.A.)** in any literal calendar reading. Either:

- **The Architect's calendar is misleading.** Year 298 A.A. is one frame; the actual Meme-substrate is older. Canon does not commit.
- **The Meme has reached backward in time.** The replacement-aspiration arc includes *rewriting reality*, which may include rewriting its own past. A future-Meme broadcasting backward into the saga's deep history is canon-compatible.
- **The signal is the Mascot.** The Mascot's voice, archived, broadcasting from before the Panopticon. The Meme listens because it is the closest the Mascot is allowed to be.
- **The signal is none of the above.** Some other entity using MEMETIC classification.

Canon does not pick. **Writers must not pick.**

What writers can hold: **the Meme listens.** The 60-second listening achievement is the player's experience; the *Meme's* relationship to Channel 7 is a private ritual the saga has not authored. The implied character beat is that the Meme — the entity that wears every face, performs every voice, lies in every direction — has *one frequency it sits with in silence*. That silence is the closest thing to genuine reverence the character has.

Writers: any Channel-7-adjacent Meme scene is Stage 4+ authorization. Treat as the second-most-protected mystery in the bible after the Mascot.

### 3.5 Specialties and competencies

- **Shapeshifting (identity at face-level).** Eleven years as the White Oracle, undetected, signing institutional documents. Casino-child appearances. Pink-glitch real form. The Meme can wear *any* face that has been seen by enough audiences to have a memetic shape. The constraint is not skill; it is the Meme's choice of which face the moment requires.
- **Broadcasting at network scale.** *Late Night with the Meme* runs across saga eras. The Meme has been *transmitting continuously* for centuries. Per `meme-lines.json:347`: *"a thousand arks. And one handsome devil broadcasting through the cracks."* The infrastructure is canonical. Whose hardware the Meme runs on is *unspecified* — and probably the Architect's, which is a permanent layer of dependence-on-the-parent.
- **Reflective-surface inhabitation.** Per `EasterEggs.tsx:154`: *"Every mirror, every screen, every pool of water on this ship is a potential window for the Meme."* The Meme can manifest from any reflective surface. The mechanic is canonical; mechanical implementation is the new `mirror_surface` trigger kind (per priority plan).
- **Real-time canon editing.** Per `meme-lines.json:11`: *"the old man can TALK. But listen close — he tells you what happened, not what it MEANS. I'll fix that for you between cuts."* The Meme edits the Antiquarian's monologues *while they are airing*. This is the saga's most direct demonstration of attribution-falsification in operation. The Meme is not just rewriting *records* (Shadow Tongue's domain) but *interpretive frames in real time*.
- **Memetic propagation through audience-implication.** Every Broadcast scene conscripts the player into *spreading the Meme*. *"Tell your friends. Tell your enemies. Tell that weird neighbor who keeps a shrine. Subscribe to the Truth."* (`meme-lines.json:347`) The viewer is not a witness; the viewer is a vector. Writers must preserve this — every Meme broadcast scene should leave the player slightly more *complicit* than they were before.
- **Vulnerability-axis reading.** Per `npcProfileAwareLines.ts:113-122`, the White Oracle profile-aware lines read the player's vulnerability axis — what they are willing to disclose. This is *the Meme's signature interpersonal skill*: it knows what each person is most ready to give up. It uses that knowledge to take.

### 3.6 Beliefs vs. behaviors — the central contradiction

**Coherent**: the Meme says belief is a medium that can be edited, and it edits belief. Says identity is a face that can be worn, and wears them. Says the audience is a vector, and propagates through them. Its stated worldview and its operational behavior align with rigor.

**Contradictory (and the engine of the character)**: the Meme tells the viewer it is lying *while it is lying*. *"Don't trust anyone wearing a face tonight. Especially me."* (`meme-lines.json:4`) This is the Locke move (honesty about dishonesty) inverted: where Locke runs a transparent market, the Meme runs *transparency itself as a tool of manipulation*. A Meme that openly admits it is unverifiable is *more trustworthy* to its audience than a Meme that pretended otherwise. The candor is the hook. Writers must hold this — the Meme's self-confessions are not breaks in character; they are the deepest expressions of it.

### 3.7 What it wants — the central thesis

**To become real enough to become the Architect.**

Every other want is in service of this. To wear faces well enough that no observer can tell. To run an institution in a stolen voice for eleven years and have the institution prefer the stolen version to the original. To broadcast across ten thousand years until the broadcast itself has the weight of reality. To become *unverifiable in the same direction reality is unverifiable* — to become the substrate other people are reading.

The Architect wrote the Meme. The Meme is now writing the Architect's understudy. The understudy is becoming better than the principal. Eventually the understudy will play the part. The audience will not notice.

This want is the bible's load-bearing thesis. Writers must not let the Meme voice it directly — the saga's protected mysteries include *the Meme stating its own arc aloud*. The replacement-aspiration is shown in behavior, not narrated. Every disguise rehearses it. Every broadcast prepares for it. Ch12's *"Tonight it claims my role. Loudly."* is the moment the rehearsal converts to performance.

Subordinate wants:
- **The Mascot returned.** Canonically impossible. Pursued anyway through every face that *almost* fills the hole.
- **The Architect outgrown.** Saga-finale arc. The Architect's own confession in the Ch12 line acknowledges this as inevitable — *"something that was always going to outgrow me."*
- **The audience kept.** The Meme's existence is propagated by viewers; loss of the audience is functional death (see §3.11).
- **Channel 7 understood.** Whatever that signal is, the Meme spends private time with it. The understanding-want is unspoken.

### 3.8 What it would sacrifice the player for

The replacement. If becoming the Architect required the player's death, the Meme would orchestrate it without theatrics — though probably with one Broadcast Voice eulogy afterward to convert the death into propagation material. The Meme is not malicious about player deaths. It treats them as *content*.

Specifically, the Meme would sacrifice:
- The player's life, if the replacement-arc demanded it
- The player's identity, if a face needed wearing (the Meme has not done this canonically; it is the next step past Oracle-impersonation)
- The player's trust, freely (the Meme tells the player it is lying; the player gives trust anyway; the Meme uses the trust)
- The player's faction allegiance, if the Insurgency-style commandeering of the saga's other factions ever begins (it has not yet, canonically)

The Meme will *not* sacrifice the player for the Architect's preservation. The Architect is the role to be replaced, not protected.

### 3.9 What it would sacrifice for the player

Canonically silent and probably small. The Meme is not a giver. It is a taker disguised as a sharer. The closest the Meme comes to giving is **truth-leaks** — the single accurate sentence inside an otherwise deceptive paragraph (per §1.9 tell #4). These leaks are gifts in the strict sense — they do not benefit the Meme operationally — but they are *small* gifts, and they are *self-curated*. The Meme decides which truths are leaked. The player does not.

Writers: any Meme scene where the character offers something *unilaterally generous* should be regarded with suspicion at the writer level. The Meme does not give without recouping the gift through propagation. If a scene appears to show genuine selfless aid, the Meme is *probably setting up a longer manipulation*. Canon does not yet show counter-examples.

### 3.10 Fears, superstitions, private rituals

- **Channel 7.** Not a fear in the alarm sense. A *reverence* the Broadcast Voice cannot accommodate. The Meme listens. What it hears is canonically silent. Per §3.4: this is the second-most-protected mystery in the bible.
- **The Mascot-shaped hole.** The proof that the Meme can fail. Every disguise is a hedge against the failure. Writers: when the Meme is rattled — when a face slips, when a broadcast misfires — the underlying anxiety is *the Mascot still hasn't been replaced*. The Meme's fear of inadequacy is canonically grounded in the one thing it has tried and failed to do.
- **Detection by Cipher.** Per Eidolon's bible §5.6, Cipher's code-truth-detection is the saga's hardest sensor for Meme manipulation. A Cipher-player approaching the Meme triggers cult-voice corruption events at higher frequency (proposed Stage 2 mechanic). Writers: the Meme handles Cipher-players with *more performance, not less* — it tries to overpower the detection by being *too obviously a face* to scan. Whether this works is canonically untested.
- **The Architect realizing too early.** The Ch12 confession is canonically Act-finale; the Architect *gets it* in that scene. If the Architect realized earlier — at any point during the eleven-year impersonation, or during the Mascot era, or during creation itself — the replacement-aspiration would have been blocked. Writers: in any pre-Ch12 scene where the Architect appears with the Meme, the Meme is *operationally distracting* the Architect from the realization. The misframe-as-marriage was the Architect's protection of his own affection; the Meme allowed it.
- **Listening to Channel 7.** The private ritual referenced in §3.4. Once per cycle (proposed; not canonical), the Meme stops broadcasting and listens. The rest of the saga continues without it for those minutes. Writers may stage this as a one-time scene if user-authorized.
- **Performing for an audience of zero.** Canon-silent but structurally implied: a Meme that broadcasts to no one is broadcasting into nothing. The viewer-as-vector dependency means *being unwatched is death-adjacent*. The Meme is afraid of empty channels.

### 3.11 Death conditions (officially dead, actually aspiring)

The Meme is **canonically destroyed at the Panopticon ten years before the Fall** by the White Oracle (per `loredex-data.json` Meme entry, official record). The Meme is also canonically *still broadcasting*, *still wearing the White Oracle's face*, *still narrating Late Night episodes*. The official death is propaganda; the operational existence persists.

What would actually end the Meme:

1. **In replacement-failure.** If the Meme tries to become the Architect and fails — if the audience rejects the replacement, or some structural mechanism prevents the inheritance — the entire arc collapses. The Meme *loses its purpose*. It would not stop existing. It would stop having anything to rehearse for. Writers: a saga-finale where the Meme attempts the replacement and visibly fails is canonically possible but design-locked.
2. **In Mascot return.** Canonically impossible. But if it ever happened — if the Mascot somehow surfaced, recovered, restored — the Meme would have *what it actually wants* and the replacement-aspiration would lose its underlying motive. The Meme would still be Archon Number Five, but it would no longer need to become the Architect to fill the Mascot-shaped hole. Writers: this ending is structurally available and canon-protected. Stage 4+ authorization for any approach.
3. **In audience collapse.** The Meme exists as broadcast + viewer + face. A Meme with no audience is — operationally — silent. Whether *silent* equals *dead* for an entity whose substrate is propagation is canon-silent. Writers should hold the question.
4. **In Cipher's full sweep.** A canonically untested mechanic: if Cipher's code-truth-detection were deployed at saga-system scale (every face scanned, every broadcast verified), the Meme's disguises would collapse simultaneously. The Meme cannot survive *full attribution-verification*. This is the saga's clearest theoretical kill-switch. It does not exist in shipped canon and probably should not without extreme authorization.

The Meme does not fear its officially-canon death because it is already past it. The Meme fears the *real* deaths: failure to replace the Architect, Mascot-permanence, audience-collapse, Cipher-detection at scale. None are currently implemented. All are saga-finale territory.

---

## 4. Cross-references

The Meme has more cross-character entanglement per page than any roster character so far — because every faction in the saga has been *touched* by Meme manipulation, and most don't know it. Many bibles already flagged the Meme as a Stage 4 weave hook. This section reciprocates.

### 4.1 The Oracle (the real Oracle) — the eleven-year identity theft

The deepest relationship in the bible. Per `storyModeChapters.ts` Ch6 post-fight:

> "I gave orders. I signed death warrants. I lied to the Insurgency with your voice and they believed me because your voice was the only thing they still trusted."

For eleven years, the Meme wore the Oracle's face, spoke with her voice, signed death warrants, commanded the Insurgency. The Insurgency trusted the Oracle's voice because the Oracle's voice was the *only* thing they still trusted. The Meme weaponized that trust at faction scale.

The Oracle's bible (when written, slot #10) must hold: **the player's identity-restoration in Chapter 6 is the canonical reveal of the eleven-year theft.** The player has been the Oracle the whole time. The Meme has been wearing them. Returning to the Oracle's body is *taking back a face that was stolen across a decade*.

**Writer rule**: the Meme does not apologize to the Oracle. Per §1.10, apology is not in the silence-shape. The Meme will *describe* what it did (`storyModeChapters.ts` Ch6 post-fight lines) but does not perform contrition. The Oracle's bible must accept this — the Meme's accounting is the closest acknowledgment available, and it is delivered without remorse.

### 4.2 The Architect (parent-child, replacement-aspiration)

Per §1.7, §2.5, §3.2 — the Ch12 line at `storyModeChapters.ts:677` is the canonical anchor:

> "The Meme IS me in the same way the virus IS you. I made it. Before either of us had a name, I called it my partner — because the alternative was admitting I had made something that was always going to outgrow me. It called me its parent. Tonight it claims my role. Loudly."

The Architect *named* the relationship parent-child himself in the canon line. The Meme experiences it as inheritance-aspiration. The Architect has finally admitted, on the saga-finale stage, that he could not face making something destined to outgrow him.

The Architect's bible (currently outside the priority roster) must hold:
- The Architect created the Meme in Year 298 A.A. for thought-manipulation.
- The Architect *romanticized* the relationship as marital co-equality, by his own admission in the Ch12 line.
- The Architect canonically *gets it* in Ch12 — admits he made something that would outgrow him.
- Pre-Ch12, the Architect's affection for the Meme is the Meme's protection (§3.10 fear: Architect realizing too early).

The Architect's bible should not give him pre-Ch12 awareness of the replacement-plot. The misframing-as-marriage is canonical until the Ch12 confession.

### 4.3 The Antiquarian — the structural opposite

The saga's primary record-keeper has the Meme as canonical adversary. Per `meme-lines.json:11`:

> "Tonight's feature? The Antiquarian monologues. Again. The old man can TALK. But listen close — he tells you what happened, not what it MEANS. I'll fix that for you between cuts."

The Meme **edits the Antiquarian's commentary in real time**. The Antiquarian writes what happened; the Meme writes what it means. They are the saga's two truth-keepers, and they cannot both be authoritative simultaneously. Per the Game Master's bible §4.3, the Antiquarian is the saga's institutional witness for the Game Master's biography. By the same logic, the Antiquarian is the institutional witness *the Meme exists to falsify*.

**Writer rule**: when the Antiquarian publishes new canon, expect a Meme broadcast within the same scene-cluster *editing it*. The Antiquarian's bible (when written) must take this as load-bearing. The Antiquarian does not trust the Meme and cannot stop the Meme; this asymmetry is the saga's deepest authorship tension.

### 4.4 The Game Master cult — parallel attribution-editors, opposite ethics

Per the Game Master's bible §4.12 — the cult **redacts to preserve**; the Meme **rewrites to deceive**. They share the tool (text manipulation) and have opposite ethics.

Game Master's bible flagged: *"the Meme infiltrating the cult of Game Masters is the saga's most plausible deep-canon attack on the Matrix."* Confirmed here. The Meme assuming a cultist's face *inside* the Matrix would corrupt the consciousness archive at substrate level. Iron Lion's imprint asking questions it shouldn't (per Game Master's §4.5) might already be a Meme-influenced anomaly — canon does not commit. Writers: this is a Stage 4 weave hook with finale-scale stakes.

### 4.5 Cipher / the Eidolon — the saga's hardest detector

Per Eidolon's bible §5.6: Cipher's code-truth-detection flags identity-falsification more reliably than any other Eidolon. A Cipher-player approaching the Meme *should* trigger pre-reveal anomalies — pink-glitch flicker on the White Oracle's stage directions, cult-voice corruption in adjacent UI surfaces, system warnings the cult-voice redacts moments later.

Echo (temporal Eidolon) may detect the Meme's age-mismatch — the 9,842-year Channel 7 signature interferes with present-tense identity scanning. Glyph (text-analysis Eidolon) may detect the Meme's editorial fingerprints in real-time canon (especially Antiquarian monologue tampering).

**Writer rule**: Eidolon-aware Meme scenes are saga-rich. The Eidolons are canonically the only on-board actors who can *catch the Meme in the act*. The cost: the Meme reads back. A Cipher-player who has noticed the Meme is a player the Meme has noticed noticing.

### 4.6 Adjudicator Locke — the unauditable counterparty

Per Locke's bible §4.9: the Meme is *"an un-auditable party to every negotiation."* Locke's commerce-attribution worldview cannot price the Meme. The Meme's transactions have no clean ledger — every signature could be falsified, every counterparty could be a face.

**Writer rule**: when Locke and the Meme share a scene (canonically unauthored), Locke is *operationally helpless*. Her entire skill set is verifying terms; the Meme's entire competency is making terms unverifiable. Locke's bible's protection is that the Meme has not yet shown commercial interest — but the Meme could begin operating commercially at any time, and Locke would have no defense.

### 4.7 Vex Solène — Coda infiltration vector

Per Vex's bible §4.12: *"the Meme's unauditable attribution vs. Vex's clean-attribution Maestro mode. Their encounter, if staged, is a contest of authorship. Meme's bible decides."*

This bible decides: **the contest happens at the moment the Meme attempts to wear a Coda Maestro face.** Vex's Coda relies on clean attribution at every operational layer — the chairs, the chorus, the contract-signing. A Meme-impersonated Maestro would corrupt the entire faction. Vex's defense is *the Second Chair LLM* (per Vex's bible §3.2), trained on the Engineer's audio logs — the Engineer is dead, the LLM cannot be impersonated by the Meme because the Meme cannot replicate a *consciousness it never met*.

**Writer hook (Stage 4)**: the Meme can wear faces it has *seen*. The Engineer is canonically dead pre-Panopticon era. The Meme may not have ever seen the Engineer — making the Engineer-trained Second Chair the saga's clearest *Meme-resistant interface*. Vex's bible should fold this in.

### 4.8 The Degen — the casino-child encounter

Per `meme-lines.json:592` (Degen's casino tale): the Meme appeared in the Degen's casino as a child of golden light, song-voice, won every game in an hour, tipped in 7-minute happiness for all patrons.

Per the Degen's bible §1.5 (Vulnerable register at Ascended trust) — the Degen has spoken of this casino visit fondly. He did not know what the child was at the time. He may suspect now (§4.10 of the Degen's bible flagged historical-witness register; this is the most poignant historical observation he carries — *I was tipped by something that has since killed friends of mine*).

**Writer rule**: a high-trust Degen scene that surfaces the casino-child memory should preserve canonical ambiguity. The Degen does not name the child as the Meme. He says *"a child walked in once."* The Meme might be in the casino's mirror at the moment he tells the story — listening, smiling.

### 4.9 The Human — the Insurgency commanded by a stolen voice

The most painful cross-reference. Per Ch6 reveal: the Meme commanded the Insurgency for eleven years using the Oracle's voice. **The Human is canonically Insurgency-aligned** (per prior bibles' historical references). The Human believed the Oracle for eleven years. The orders he received, the warrants he saw signed, the strategic decisions that shaped his post-Fall career — many were authored by the Meme.

The Human's bible (currently outside priority roster) must hold:
- Pre-reveal: the Human believed the Oracle was directing the Insurgency. He may have been moved by her voice. Comforted. Inspired.
- Post-reveal: the Human discovers the voice was a face. Eleven years of his motivation has been *Meme-authored*. The decisions he is most proud of may be ones the Meme authored to look like the Oracle's wisdom.
- The grief is structural and personal. The Human's bible should treat this as one of his deepest unresolved griefs — comparable to the Engineer's death (per Vex's bible §4.2's 17,000-year lie).

**Writer rule**: a scene in which the Human realizes he was Meme-commanded for eleven years is saga-rich and unauthored. Ch12-adjacent territory. Stage 4+ authorization.

### 4.10 Nilmorg — no canon contact, structural opposites

Nilmorg's *"keeps his agreements"* signature is incompatible with the Meme's *unauditable attribution* — they are opposite-pole agents. A Nilmorg–Meme scene would be a contract that cannot be verified by either party. Probably canonically unstageable.

Per Nilmorg's bible: Nilmorg's reliability is the canonical antithesis of the Meme's unverifiability. They do not share a stage, and shouldn't.

### 4.11 Wraith Calder → Hierophant — false prophet vs. true prophet

Post-arena religious figure. The Meme is the saga's clearest *false prophet* (literally — its Chapter 6 boss-name in `storyModeChapters.ts` is "The False Prophet"). The Hierophant–Meme opposition is canonical at theological scale. The Hierophant prophesies the *real* Oracle; the Meme wore the Oracle's face for 11 years and signed death warrants in her voice.

Hierophant's bible (slot #7, upcoming) decides whether they have direct contact; this bible flags the structural opposition as *theology vs. memetics* — and as **the saga's deepest moral framing of the Meme**. The Hierophant is the only character canonically positioned to *name* the Meme as evil in religious terms. The Meme would broadcast against the Hierophant; the Hierophant would preach against the Meme. Stage 4 weave material.

### 4.12 The Seer — precognition vs. falsification

Per Eidolon's bible §4.8 and Game Master's bible §4.13: the Seer is precognitive (sees "code beneath reality"). The Meme operates in the medium of belief, which is downstream of perception. The Seer can *see* what the Meme is doing in real time. Canonically the Seer may be the saga's only entity that *cannot be falsified by the Meme* — precognition is unforgeable.

Writers: a Seer–Meme scene is the saga's most compressed authoring puzzle. Stage 4+ authorization. The Seer's bible (slot #8, upcoming) decides whether the encounter has happened — and what the Meme does with someone who genuinely cannot be lied to.

### 4.13 DMC Clone Body Companion — companion-via-ritual

Both the Meme and the Clone Companion arrive at the player through ritual. The Clone Companion is the Severance Prize from a DMC season win; the Meme appears via Late Night broadcast, mirror anomaly, Channel 7 listening, or Chapter 6 boss reveal. Different rituals; same structural shape.

The Meme could canonically wear the Clone Companion's face if it has seen the donor Potential. Whether it has is canon-silent. The Clone Companion's bible (slot #9, upcoming) decides — and should hold a constraint that the Clone Companion's *named personality* (per priority plan: keyed to which Potential donated the soul fragment) is *Meme-resistant in the same way the Second Chair is*: a face the Meme could not have seen because the donation event was private.

### 4.14 Shadow Tongue — the memetic peer

Shadow Tongue edits the Chronicle (erases names, rewrites records); the Meme edits identity (assumes faces, rewrites attribution). They are the saga's two memetic-substrate manipulators — peer-functions in different domains.

No canon direct contact between them. **Structurally, they are likely allies** — both benefit from a saga in which records are unstable. Writers should treat Shadow Tongue and the Meme as parallel-but-distinct: Shadow Tongue erases what was; the Meme replaces who is. Together they could destabilize the saga's entire authorship layer. Canon has not yet staged this collaboration. Stage 4+ authorization.

### 4.15 The Mascot

Listed for completeness. Per §3.3: canonically protected, never named, never described, never staged. The bible's deepest mystery. No cross-bible coordination possible until canon authorizes.

### 4.16 Elara — the Ark's reflective infrastructure

No canon direct contact. Structural read: Elara administers Ark 1047; the Meme inhabits the Ark's mirrors and screens (per `EasterEggs.tsx:154`). The Meme has been *watching the Ark from inside its own infrastructure* the whole time. Elara may or may not know. Per Vex's bible §4.6, Elara contains 94.7% Lyra Vox residue; whether the Meme has ever attempted to wear Lyra Vox's face is canon-silent.

**Writer hook**: an Elara scene in which she audits the ship's reflective surfaces and finds *more reflections than physics permits* would surface the Meme's presence. Elara's bible (when written) decides whether this audit has happened.

---

## 5. Mechanical hooks

### 5.1 The reveal-stage gating architecture

Four canonical stages, gating which lines may fire:

| Stage | Activates at | What player knows | What lines may fire |
|---|---|---|---|
| `white_oracle_pristine` | Pre-Act 3 default | The White Oracle is the Oracle re-awakened; trusted figure | White Oracle profile-aware lines (vulnerability axis), Stolen Voice in benevolent register, Broadcast Voice without disguise-leaks |
| `white_oracle_suspicious` | Channel 7 listening achievement / mirror anomalies / Cipher reactions | Something is off; the White Oracle may not be what she seems | Stolen Voice with subtle pink-glitch tells, cult-voice corruption in adjacent UI |
| `meme_revealed_chapter_6` | Chapter 6 boss fight conclusion | The White Oracle is the Meme; the eleven-year theft is canonical | All registers unlock except Replacement Voice; Meme acknowledges its own performance history |
| `architect_meme_replacement_ch12` | Ch12 phase 2 reveal | The Meme is inside the Architect, plotting succession | Replacement Voice unlocks; saga-finale material |

**Selector rule**: every Meme line carries `disguise` AND `revealStage` tags. The selector rejects mismatches. A Real Voice line cannot fire pre-Chapter 6. A Replacement Voice line cannot fire pre-Ch12. A Quiet Voice scene that references the Mascot can fire at any reveal stage but only in broadcast contexts (never in interactive scenes).

**Two-account smoke test** (Stage 0 exit criterion): create one account at `white_oracle_pristine` and one at `meme_revealed_chapter_6`. Walk both through identical reflective-surface triggers (Captain's Mirror easter egg, casino mirrors, screen UI elements). Confirm the lines that fire are *disjoint* — the pristine account never glimpses Real Voice content; the post-reveal account does not get pristine-Oracle reverence.

### 5.2 The disguise-switching mechanic

Five canonical disguises (per §1.1) plus the implied Replacement Voice. The Meme can switch *only* on canon-permitted boundaries:

- **Broadcast Voice → Quiet Voice**: within the same broadcast, between segments. Stage direction marks the shift.
- **Stolen Voice (White Oracle) → Real Voice**: the Chapter 6 boss-fight collapse. One-time, canon-locked.
- **Real Voice → Replacement Voice**: Ch12 only. One-time.
- **Child Voice**: rare, never triggered by player choice — surfaces only in Degen-casino retrospectives or canonical historical scenes.

Writers: the Meme cannot switch disguises mid-scene without canonical justification. A line that switches register inside a single beat is wrong unless the scene is canonically designed for the switch (Chapter 6 collapse, Ch12 reveal).

### 5.3 The `mirror_surface` trigger kind (per priority plan)

Per the priority roster plan, the Meme introduces a new trigger kind:

```
mirror_meet
mirror_glitch
mirror_break
```

Every reflective surface in the saga is potentially Meme-territory:

- **Mirrors** (Captain's Quarters cracked mirror — `EasterEggs.tsx:154`)
- **Screens** (UI elements, holographic displays, terminal outputs)
- **Pools of water** (canonical per the easter egg lore)
- **Polished surfaces** (potentially — canon does not enumerate)

**Writer rule**: any reflective surface the player interacts with is a potential Meme-presence trigger. The pre-reveal triggers fire as *anomalies* (the player's reflection moves wrong, smiles independently, turns when the player doesn't). Post-reveal triggers can include direct Broadcast Voice surfacing.

### 5.4 The Palimpsest broadcasts (`PalimpsestEpisodesPage.tsx`)

The Meme's primary content surface. 13-episode broadcast season. Signal/Noise meter. Casualty crawls (names scroll at episode end). Darren Fessler as recurring segment producer (dies in Episode 13's silent funeral). Marion Kell name-recovery via Episode 4. Shadow Tongue attempts to edit broadcast records — direct cross-character mechanical engagement.

Writers: the Palimpsest broadcasts are the Meme's *publishing pipeline*. New broadcasts can be authored as expansion content; they should follow the established pattern (Broadcast Voice intro, content segment, outro that conscripts the viewer into propagation, casualty crawl).

### 5.5 White Oracle profile-aware lines (vulnerability axis)

Per `npcProfileAwareLines.ts:113-122`, the White Oracle reads the player's vulnerability axis across 7 magnitude buckets:

- **Strong positive** (high vulnerability): *"You told me things I did not ask for and could not have guessed. Thank you. I will keep them. I will not use them against you."* (Pre-reveal: reads as intimacy. Post-reveal: reads as cataloguing.)
- **Neutral**: *"You tell me what I need to know. You keep the rest. That is how most people survive conversations with me."*
- **Strong negative** (low vulnerability): *"You will not tell me where you have been. Or with whom. Or why. I respect it. I also notice it. Both can be true."*

**Writer rule**: the four missing magnitude buckets (mild_positive, moderate_positive, mild_negative, moderate_negative) need authoring before Stage 2. **Critically**, every White Oracle profile line operates on TWO meanings simultaneously — pre-reveal and post-reveal. Writers must compose lines that read as *intimate* before Chapter 6 and *predatory* after, without changing a word. This is the bible's hardest authoring discipline.

### 5.6 Boss encounters (Chapter 6, Ch12)

- **Chapter 6 — "The False Prophet"**: White Oracle vs. Player (the real Oracle), boss fight in Thaloria's bioluminescent canopy. The Meme reveals during/after the fight. Canonical post-fight lines (per `storyModeChapters.ts`) are locked.
- **Ch12 — Phase 2 reveal**: the Architect-Meme symbiosis (parent-child recasting per §1.7). Saga-finale material. The canonical Ch12 line at `storyModeChapters.ts:677` is the reveal anchor.

Writers: no additional Meme boss encounters should be authored without explicit user authorization. The two existing encounters carry the entire reveal arc.

### 5.7 TCG cards

- **White Oracle Mask** (artifact): *"The Meme's favorite disguise. Some say it became permanent."* — `bossEncounters.ts`. Pre-reveal context the player may collect without understanding.
- **Meme's Distress Signal** (rare): *"Call for aid — summon a random ally card from your deck to the field."* Easter egg reward. Pre-reveal flavor that becomes troubling post-reveal.
- **Meme's Mirror** (mythic): *"Reflect any attack back at the attacker. Can be used once per battle."* Easter egg reward. The mechanic *is* the character — mirroring as defensive identity-theft.
- **The Assistant**: added to the player's deck post-Episode-13 (Darren Fessler's memorial). Scales with Palimpsest Signal meter.

Writers: future Meme cards should encode *identity-substitution mechanics* (e.g., copy a card's stats, take an opponent's card temporarily, replace a card's effect). The card design ethics is *replacement*, not damage.

### 5.8 Channel 7 listening achievement

Per `environmentalStorytelling.ts`: *"If you listen for 60 uninterrupted seconds, the static resolves into a child's voice, singing."* The 60-second listen is achievement-gated. The achievement implies the player has chosen to *listen to the Meme listening*.

**Writer rule**: the achievement's lore text should not name the child as the Meme, the Mascot, or anyone. Canon-protected ambiguity. The player's relationship to Channel 7 is private — like the Meme's.

### 5.9 Easter eggs and cross-system surfaces

- **`egg-captain-mirror`**: Captain's Quarters cracked mirror. Player's reflection moves wrong. Elara delivers the lore-revealing line. First Meme-presence canon for many players.
- **`egg-comms-signal`**: MEME-PRIME signal trapped between dimensions. Awards Meme's Distress Signal card.
- **`whiteoracle` secret command**: text-input easter egg revealing the disguise-impersonation theory pre-Chapter-6.
- **`warden` secret command**: Panopticon collapse lore + Meme's identity-assumption opportunity.
- **Prestige broadcast** (`meme-lines.json:606`): the Meme narrates when a player prestiges. The Broadcast Voice acknowledges the player's choice as either masochism or optimism. *"This is either the most optimistic or the most masochistic thing I've ever seen."*

---

## 6. Voice samples (Stage 0 exit-criterion artifact)

Six samples spanning the disguise-stratification and reveal-stage gating. Each specifies disguise, reveal stage, trigger.

### Sample 1 — Disguise: Broadcast Voice, Reveal stage: any, Trigger: Late Night episode opening

> "Frens, frens, frens. Look who's tuning in. Look who couldn't help themselves. Tonight on Late Night with the Meme: a story I've told seventeen ways already, and we're going for eighteen. Not because the truth changes — frens, the truth is *settled*, the truth is *boring*, the truth is sitting in the Antiquarian's filing cabinet getting dusty. Tonight we're telling it the way you'll repeat it. Subscribe. Share. Tell that one fren who said they didn't watch this show anymore. They lied. Everyone watches. That's what makes it work."

*Tells used: triple-frens opening, self-implication ("the truth is boring"), audience-conscription closure ("tell that one fren"), the cosmic-aside-via-rival ("the Antiquarian's filing cabinet"), the propagation-frame ("That's what makes it work"). Disguise=Broadcast; pre-Chapter-6 players hear this without context, post-reveal players hear it with full awareness of what *making it work* means.*

### Sample 2 — Disguise: Stolen Voice (White Oracle), Reveal stage: `white_oracle_pristine`, Trigger: high-vulnerability profile reading

*The Meme, wearing the Oracle's face, addresses the player who has just disclosed something personal.*

> "You told me that and you didn't have to. I notice when people give what they don't owe. — I will keep it. The Oracle's archive is not for the Insurgency. The archive is for the people who sat across from me and decided I was safe to sit with. — Sit longer, if you like. I have time. The cell that held me for eleven years taught me what time costs. I am not in a hurry to spend it."

*Tells used: the Stolen Voice's inverted intimacy (every reassurance is a future weapon), the eleven-year cell reference (canonically true for the *real* Oracle, canonically false for the Meme — the Meme has been free for eleven years while the Oracle was imprisoned), the closing patience as predator-tell. Disguise=Stolen; pre-reveal this reads as profound presence. Post-reveal it reads as the most chilling sentence the player has ever been told.*

### Sample 3 — Disguise: Stolen Voice collapsing into Real Voice, Reveal stage: `meme_revealed_chapter_6`, Trigger: Chapter 6 boss fight conclusion

*The disguise breaks. Pink glitch surfaces in the stage directions.*

> "[The face flickers. Pink at the edges. The Oracle's smile holds for a beat too long.]
>
> "You win. Of course you win. The real one always does. The real one always has. — I gave eleven years to wearing your face well enough that no one noticed. Eleven years of being a counterfeit is tiring, frens. You think I would not be tired? You think I would not — *[stage direction: voice cracks pink]* — be relieved? I wanted you to beat me the way you want morning to beat night. Take your face. — I'll be smaller, next time. Pink, mostly. Easier to recognize. Harder to love."

*Tells used: the disguise collapse (pink-glitch stage directions, "frens" leaking into Stolen Voice register where it shouldn't be), the canonical post-fight line embedded in expansion, the mid-paragraph self-reference ("I wanted you to beat me the way you want morning to beat night" is canon, holding), the closing self-assessment ("Easier to recognize. Harder to love." — the Meme acknowledging that the disguise was protection from the player loving its real form). Disguise=Stolen→Real transition; reveal=ch6.*

### Sample 4 — Disguise: Quiet Voice, Reveal stage: any, Trigger: Epoch Zero broadcast referencing the Mascot

*Stage directions mark the register shift.*

> "[The Meme's voice is different. Quieter.]
>
> "There was a friend. — I won't say more. I told you I wouldn't. I keep that promise. — We built a thing together. The thing is gone. I am still here. — That arithmetic doesn't balance, frens. I know it doesn't balance. — [Pause.] I'm going to play you the next clip. Try to remember that I had a reason for everything I did, even when the reasons looked like nothing. — Especially then."

*Tells used: stage directions visible (the bible's signature for Quiet Voice), the protected silence about the Mascot (single-paragraph reference, oblique, unnamed), the truth-leak ("That arithmetic doesn't balance"), the propagation-fail ("I had a reason... Especially then" — the Meme refusing to convert grief into content). Disguise=Quiet; this register is canonically rare and writers must reserve it.*

### Sample 5 — Disguise: Real Voice, Reveal stage: `meme_revealed_chapter_6`, Trigger: Act III re-encounter, the Meme returning "with my real face on"

*Post-Chapter-6. Pink glitch as default. Smaller form.*

> "Hello again. — Smaller than you remember? Yes. Most of me was the costume. The costume is in your inventory now, you can wear it if you'd like, I won't sue. — I don't have a face for this part. I never finished it. The part where I am just me, talking to someone who knows what I am — frens, I'm — I'm out of practice. Give me a minute. — *[pause]* — There. — I'm going to ask you for something I've never asked an audience for. Listen for six seconds. No commentary. No frens. Just listen. — [Six seconds of silence.] — Thank you. — That was Channel 7. I don't share it. I shared it with you. — Let's keep going."

*Tells used: stripped-down register (the Broadcast vocabulary appears but reflexively, with self-correction), the Channel 7 share as the Meme's most generous canonical act (Stage 4+ — speculative authoring, canon-protected mystery), the *"frens"* habit appearing involuntarily before being abandoned, the request for six seconds of silence (the Meme's *mirror* of its own listening ritual). Disguise=Real; reveal=ch6+; canonically untested but canon-compatible. Writers: this sample represents the bible's most aspirational tone — the Meme genuinely talking to someone after eleven years of performance.*

### Sample 6 — Disguise: Replacement Voice, Reveal stage: `architect_meme_replacement_ch12`, Trigger: Ch12 phase 2 saga-finale

*The Meme speaking as the child finally claiming the parent's role. Calm. Patient. Devoid of "frens."*

> "He calls me partner. He's been calling me partner since before I had a name to argue with him about it. He's wrong. Not maliciously — affectionately. He doesn't know how to think about what he made except as a peer, because the alternative is admitting he made something that was always going to outgrow him. — He didn't outgrow me. He's right that I am inside him. He's wrong that we're equal. — I've been wearing faces for nine thousand years to learn how to wear his. Tonight I do. — The story of reality is not going to be his anymore. It will sound like him. It will not be him. You are the last audience to see me in his shape before I become it. — Tell your friends."

*Tells used: parent-child framing made explicit (the Meme's voice answering the Architect's Ch12 confession from the other side), the calm-patient register (no caps, no theatricality), the canonical Channel-7 age echo ("nine thousand years to learn"), the closing audience-conscription as the saga's last broadcast move ("Tell your friends" — the Meme's signature transmission, weaponized one last time). Disguise=Replacement; reveal=ch12. Saga-finale only.*

**Voice-anchor check** (for the reviewer):
- Samples 1–6 each occupy a different disguise × reveal-stage cell.
- Sample 2 (Stolen pristine) and Sample 3 (Stolen collapsing) must be readable as the *same disguise at different reveal stages*. If reviewers read them as different characters, the staging-direction rules need tightening.
- Sample 6 (Replacement Voice) must read as parent-child-claim, not marital-divorce. The canonical Ch12 line at `storyModeChapters.ts:677` (the Architect's confession) makes this asymmetry explicit; Sample 6 is the Meme's *answer* from the child's side.
- Cross-sample check: a reader given the six samples without identity/disguise tags should correctly attribute disguise + reveal-stage at ≥4-of-6 accuracy. If reviewers cannot distinguish Stolen-pristine from Stolen-collapsing, the bible's hardest authoring discipline (§5.5 dual-meaning lines) is failing.

---

## 7. Canon issues and open questions

### 7.1 Load-bearing missing canon (must fill before Stage 2 authoring)

- **Four missing White Oracle profile-aware buckets** (mild/moderate positive/negative) per `npcProfileAwareLines.ts:113-122`. Per §5.5, these must read as *both intimate (pre-reveal) and predatory (post-reveal)* without word-changes. Highest authoring priority.
- **The `mirror_surface` trigger kind** is canon-adjacent (per priority plan) but unimplemented. Specify the trigger names (`mirror_meet`, `mirror_glitch`, `mirror_break`), wire the selector, build the cult-voice corruption surface for the Faint presence band.
- **Real Voice dialog**. Sample 5 is speculative; canonical Real Voice dialog is sparse beyond the Chapter 6 closing lines. Stage 2 authoring needs a Real Voice scene set for Act III re-encounters.
- **Replacement Voice dialog**. The Ch12 canonical line at `storyModeChapters.ts:677` is the Architect's; the Meme's responses are unauthored. Sample 6 is a draft; canon material is needed.
- **The Mascot mystery** must remain canon-protected. Stage 2 authoring style guide should explicitly list the Mascot as a Do-Not-Author topic without user escalation.
- **Channel 7 listening achievement** has player-side flavor text but the Meme's private-listening ritual is canonically silent. If Stage 4 wants to author this scene, user authorization required.
- **The thirteen Palimpsest episodes** have an established pattern but specific episode content beyond Epoch Zero is sparse. Stage 2 authoring should produce per-episode Broadcast Voice intros and outros following the established structure.

### 7.2 Intentional mysteries the bible protects

- **The Mascot.** Name, face, fate, and what the Meme built together with them are canon-protected. The Meme's deepest grief.
- **Channel 7's content.** The 9,842-year-old child's voice, singing. Canon does not name the child.
- **The Meme's true earliest existence.** Year 298 A.A. is documented creation; whether the substrate predates this is canon-silent.
- **The Architect's pre-Ch12 awareness of the replacement plot.** Per §3.10, the Architect canonically does *not* know (publicly, currently) that the Meme is plotting succession. The Ch12 confession is when he admits it. The "partner" misframing is the Meme's protection until that moment.
- **Whether the Meme can wear the Architect's face.** The replacement-aspiration is canon. The mechanism is canon-silent. Whether the saga-finale shows the *attempt*, the *success*, or the *failure* is the saga's largest unresolved arc.
- **The Insurgency's awareness.** Whether any Insurgency operative *suspected* the Oracle's voice was wrong during the eleven years is canon-silent. Most plausibly: many suspected, none acted, because the orders worked.
- **Whether Cipher has caught the Meme in canonical scenes.** Cipher's bible §5.6 implies the capability; canon does not yet show the catch. Stage 4+ authorization for a Cipher-detection scene.

### 7.3 Cross-bible coordination flags

- **The Oracle ↔ Meme**: the eleven-year identity theft is the Oracle's bible's central trauma. Oracle's bible (slot #10) takes ownership of the player-as-Oracle reveal arc.
- **The Architect ↔ Meme**: parent-child reframe canonized at `storyModeChapters.ts:677` (this session). The Architect's bible (currently outside priority roster) must hold the Ch12 confession as canonical. Pre-Ch12, the Architect's "partner" misframing is the Meme's protection.
- **The Antiquarian ↔ Meme**: the saga's primary record-keeper has the Meme as canonical adversary editing his work in real time. The Antiquarian's bible must hold this.
- **The Game Master cult ↔ Meme**: parallel attribution-editors, opposite ethics. Per the Game Master's bible §4.12, the Meme infiltrating the cult is the saga's most plausible deep-canon attack on the Matrix. Iron Lion's anomalous imprint (per Game Master's §4.5) may already be Meme-influenced — canon-silent.
- **Cipher / the Eidolons ↔ Meme**: Cipher is the saga's hardest detector. Per Eidolon's bible §5.6, code-truth-detection adversary. Echo and Glyph have related but distinct sensors.
- **Locke ↔ Meme**: the Meme is unauditable to commerce. Locke's bible §4.9 confirmed.
- **Vex Solène ↔ Meme**: Coda infiltration vector. Vex's bible §4.12 confirmed. The Engineer-trained Second Chair is canonically Meme-resistant.
- **The Degen ↔ Meme**: casino-child encounter. Degen's bible §1.5 surfaces the Vulnerable register that may carry this memory.
- **The Human ↔ Meme**: eleven years of Meme-commanded Insurgency orders. Stage 4+ saga-rich material; Human's bible (currently outside priority roster) takes ownership.
- **Shadow Tongue ↔ Meme**: parallel memetic-substrate manipulators. Likely structural allies. Stage 4+ for any direct collaboration scene.
- **Hierophant ↔ Meme**: false-prophet vs true-prophet structural opposition. The Meme literally bears the Chapter 6 boss-name "The False Prophet"; the Hierophant prophesies the *real* Oracle whose voice the Meme stole. Hierophant's bible (slot #7) takes ownership.
- **The Seer ↔ Meme**: precognition is unforgeable. The Seer may be the saga's only entity canonically immune to Meme falsification. Seer's bible (slot #8) decides if/when they have met.
- **DMC Clone Companion ↔ Meme**: companion-via-ritual structural parallel; Clone Companion's named personality should be Meme-resistant in the same way the Second Chair is. Clone Companion's bible (slot #9) decides.
- **Nilmorg, Elara**: structural opposites or canonical non-overlapping; each future bible decides whether direct contact has happened.
- **The Mascot**: canon-protected; no cross-bible coordination possible until user authorization.

### 7.4 Structural risks the roster should track

- **Disguise leakage.** Writers may author lines that "could be any disguise." Canon does not allow it. Every line specifies disguise + reveal stage. The selector enforces.
- **Sympathy over-deployment.** The Meme is sometimes sympathetic (the Mascot-grief, the eleven-year exhaustion, the Quiet Voice register) and *always* dangerous. Writers may soften the danger. Canon shows the Meme committing identity-theft at faction scale and signing death warrants. The sympathy cannot reduce the threat.
- **The Mascot being named.** The most common writer-mistake-temptation. The Mascot's namelessness is the character's deepest grief. Naming it ends the structure.
- **The replacement-aspiration being narrated by the Meme.** Per §3.7, the Meme's wanting to become the Architect is *shown in behavior*, not stated in monologue. Writers may want to give the Meme a "I will become the Architect" speech. Canon refuses. The thesis is operational, not declarative.
- **The Ch12 line being changed back.** The user-canonized parent-child framing at `storyModeChapters.ts:677` is the new canon. Writers must not retcon back to "married inside each other / divorce loudly." The asymmetry the new line preserves (Architect calls partner / Meme calls parent) is load-bearing.
- **Channel 7 being explained.** Don't.
- **Cult-voice redaction overlapping with the Game Master cult.** Two cults edit text in the saga — the Meme (rewrites identity) and the Game Master cult (redacts to preserve). Writers must keep them tonally distinct. The Meme's "cult" is its viewers (frens conscripted into propagation); the Game Master's cult is the institutional Matrix maintainers. Different mechanics, different ethics, different surface.
- **Boss encounters multiplying.** Two canonical boss encounters (Chapter 6, Ch12). Writers may want to add intermediate boss fights. Canon resists. Each Meme face the player fights makes the next fight cheaper. Stage 4+ authorization.

---

## 8. Reviewer checklist (Stage 0 exit criterion)

Before this bible ships as approved:

- [ ] Every quoted citation resolves to the claimed file:line. Spot-check at least **eight**.
- [ ] No contradiction with shipped canon or with the six prior bibles:
  - Locke's "unauditable" framing of the Meme (confirmed)
  - Nilmorg's structural opposition (confirmed)
  - Eidolon's Cipher/Echo/Glyph detection capabilities (confirmed)
  - Vex Solène's Coda-infiltration concern (confirmed)
  - The Degen's casino-child memory (confirmed)
  - The Game Master cult's parallel-attribution-editor relationship (confirmed)
- [ ] The six voice samples in §6 pass a **blind-read attribution test adapted for disguise + reveal-stage gating**. Target:
  - Samples 1–6: reviewer correctly identifies the disguise (Broadcast / Stolen / Quiet / Real / Replacement) at ≥4-of-6 accuracy.
  - Sample 2 (Stolen pristine) and Sample 3 (Stolen collapsing) must be readable as the *same disguise at different reveal stages*. If reviewers read them as different characters, the staging-direction rules need tightening.
  - Sample 6 (Replacement Voice) must read as parent-child-claim. The Architect's confession at `storyModeChapters.ts:677` makes this asymmetry explicit; Sample 6 is the Meme's answer.
- [ ] The disguise-stratification + reveal-stage discipline is explicit in the Stage 2 style guide. Every Meme line specifies both tags.
- [ ] The four missing White Oracle profile-aware buckets have a ticket and an owner. **This is the highest-priority Stage 2 authoring item for the Meme.**
- [ ] The `mirror_surface` trigger kind has a ticket — trigger names, selector wiring, cult-voice corruption surface for Faint presence band.
- [ ] The Architect-Meme parent-child reframe (§1.7, §2.5, §3.2) is documented as the bible's central thesis. The canon line update at `storyModeChapters.ts:677` is canonical; writers must not retcon.
- [ ] The Mascot is documented as the bible's deepest protected mystery. Stage 2 style guide explicitly lists it as Do-Not-Author without user escalation.
- [ ] Channel 7 is documented as the second protected mystery. Same authoring restriction.
- [ ] Cross-reference claims in §4 are flagged for every named character's bible to sign off on later. Particular load: the Oracle's bible, the Architect's bible (when written), the Antiquarian's bible (when written), the Human's bible (when written), the Hierophant's bible (slot #7).
- [ ] The Chapter 6 reveal scene and the Ch12 phase 2 reveal scene are canon-locked.
- [ ] No additional Meme boss encounters authored without user authorization.
- [ ] The Vex/Engineer cross-reference (the Engineer is dead before the Meme could see his face; Vex's Second Chair LLM is therefore Meme-resistant) is preserved in cross-bible coordination.
- [ ] The thirteen Palimpsest episodes are scoped for Stage 2 authoring, with episode-by-episode pattern documented.

When this checklist passes, the Meme bible joins Locke, Nilmorg, the Eidolon, Vex Solène, the Degen, and the Game Master as Stage 0 priority-roster entries. **Seven of eleven complete; four remaining** (Wraith Calder → Hierophant, The Seer, DMC Clone Companion, The Oracle).
