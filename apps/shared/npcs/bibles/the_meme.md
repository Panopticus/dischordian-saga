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
