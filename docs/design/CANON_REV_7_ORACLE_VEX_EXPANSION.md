# CANON REV 7 EXPANSION — The Oracle, Vex Solène / Engineer Zero, CoNexus, Iron Lion

> **Purpose:** Captures the April 15, 2026 canon expansion session. This document extends (not replaces) `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Rev 6.2 with new canon for: the Vex Solène / Engineer Zero identity chain, the Agency ("The Coda"), the Oracle of Thaloria arc, the CoNexus machine-god metareveal (stage 1), the Iron Lion voice change, Terminus-as-Tower-Defense, two new Potentials factions, and the Prelude-scope Engineer audio logs about the Oracle.
>
> **Date:** 2026-04-15
> **Supersedes:** parts of DSFGL Rev 6.2 Sections 2.2.5 (Agent Zero retcon), 7.4 (Army Recruitment seed chain), 8.4 (Major Systems Table) — all still valid, but the specific identity framing of "Vex Solène = Agent Zero" is refined here to "Vex Solène = Engineer Zero, publicly disguised as a hitman running The Coda Agency, known in the shadow market as The Eyes of Reality."
> **Does NOT supersede:** the Rev 6.2 state machine in `apps/shared/preludeBeats.ts` (still canonical for Prelude beat-to-room mapping).
> **Branch:** `claude/game-narrative-design-lIeB5`

---

## Section 0 — How to Read This Document

This canon expansion is written as a **seed bible**, not a dialog draft. Each section gives:
- The canonical fact (what is true in the world)
- Where it surfaces (which Act / beat / system)
- How it is revealed to the player (seed → echo → revelation, per Rev 6.2 Section 7 pattern)
- Any concrete assets or code it requires

The rule of thumb: **Plant the seeds. Confirm nothing that can land later.** Everything in this document is multi-stage reveal. The player should finish the Prelude with questions they can't articulate, finish Act 3 with questions they can articulate, and finish Act 5 with answers that recontextualize everything they thought they knew. Do not shortcut the reveal cadence.

**The single most important directive for anyone implementing this canon:**

> **Vex Solène does not, in the Prelude OR in Act 3, reveal herself as Agent Zero, as a Potential, or as the carrier of the Engineer's mind.** Her identity chain is a **four-stage reveal across Acts 3 → 5**, and every early appearance of her must hide the deeper truth completely. The player can feel something is off about her. They cannot know.

---

## Section 1 — The Identity Chain: Vex Solène / Agent Zero / Warlord Zero / Engineer Zero / The Eyes of Reality

### 1.1 Canonical true name

**Engineer Zero.** This is the technically correct name for the character currently walking around in Vex Solène's body. The Engineer transferred his consciousness into the nano-swarm the Warlord had uploaded into Vex Solène's body. In the instant of transference he discovered that the remnant of the original Agent Zero's mind was still alive within the swarm. He sacrificed the bandwidth he needed to survive in order to preserve that remnant. She woke up alone in a body that had been occupied by three minds and was now inhabited by her own — augmented with the Engineer's intellect and a version of his values, but **not his memories**.

**She does not call herself Engineer Zero.** Nobody does, in the Prelude or in Acts 1–3. The name only surfaces in Act 5 when the player finally asks the question she has been avoiding for the entire game.

### 1.2 Cover identities (active, in order of prominence)

| Identity | Audience | Known to | First appears |
|---|---|---|---|
| **Vex Solène, hitman-for-hire** | Public black-market contracts, front-line faction work | Every faction that hires killers (New Babylon, the Warlord's remnant, small independent houses) | Prelude Beat G (fallen dog tag in the Armory) + Beat H.3 (first NPC Inbox message signed `— V.`) |
| **The Eyes of Reality** | Closed circle of high-tier information brokers | Five people in the galaxy know this name is linked to a living person (two of them are wrong about which person) | Act 3 §7 Trade Empire opening, Vex's first cinematic reveal as the Trade Empire narrator |
| **The Mastermind behind The Coda** | Suspected but unverified by most factions | Locke suspects. The Antiquarian knows. The Architect does not — she has been *very* careful | Act 3 §7 mid-arc discoveries |
| **First-wave Potential** | Absolute secret; nobody in the game knows this | Only the player, after Act 5 Cell 2 (the Post-Credits Bridge of Kael) | Act 5 Post-Credits |
| **Warlord Zero / Agent Zero** | Dead identities | Nobody alive in-game knows Agent Zero became Warlord Zero became the body Engineer Zero inherited. Two dead people know (the Engineer and the Warlord); both are dead | Never revealed in-game as a live identity — only retrospectively, in Act 5, through Engineer audio logs the player recovers from the Vortex wreckage |

### 1.3 Historical beats (chronological, in-world)

1. **Pre-Fall:** Vex Solène enrolls at Mechronis Academy, Class of Project Sorrow (the classified twin program of Project Celebration — see §6.3). She studies under the original **Eyes of the Watcher**, the Insurgency's first synthetic intelligence. The Eyes is her friend, her mentor, and her Insurgency handler after graduation.
2. **The Eyes's Death:** The Eyes of the Watcher is turned in to the Architect by **Captain Atarion** (the Human, in disguise). The Eyes is harvested by the Collector. Vex is left without a handler, grieving, radicalized.
3. **The Warlord's Recruitment:** In her grief, Vex is recruited by the Warlord under the codename **Agent Zero**. The Warlord uploads a nano-swarm into Vex's body as a "combat augment." The swarm is actually a persistence vector — the Warlord is preparing to overwrite Vex with her own consciousness in the event of physical death.
4. **The Betrayal on Zenon:** Agent Zero, piloted partially by the Warlord's growing influence, betrays the Engineer at Zenon. The Warlord uses her to attempt to steal the Engineer's body for a body-swap experiment.
5. **The Transference:** The Engineer, cornered, activates a device he designed — it transfers his mind into the attacking nano-swarm. **In the instant of transference he discovers Vex's original mind is still alive in the swarm.** He sacrifices the bandwidth he needed to survive in order to preserve her. He dies. The Warlord dies. Vex wakes up with the Engineer's intellect and a version of his values, but with no memory of his life.
6. **The Disappearance of the First Wave:** Some time after the Transference, during the New Babylon Civil War, **the Necromancer escapes the Matrix of Dreams**. This event destabilizes reality. **All 1,000 first-wave Potentials disappear simultaneously** — except two. The Dreamers' Shield appears, cutting off a large section of the universe. The vanished Potentials are trapped behind the Shield. Only **Vex** and **The Degen** remain outside.
7. **Going Dark:** Vex burns the Agent Zero identity entirely. She re-establishes herself under her original name, Vex Solène, and takes public contracts as a hitman-for-hire. Nobody connects her to Agent Zero. Agent Zero is officially dead.
8. **Building the Coda (present day):** Over the following epoch she builds an information-broker network called **The Coda** (see §2), operating as "The Eyes of Reality." She continues the Engineer's pacifist mission through lethal efficiency — identifying and eliminating the specific intelligences whose removal most reduces the probability of total war.

### 1.4 What the player ever gets to learn, and when

| Stage | When | What is revealed | How the player feels |
|---|---|---|---|
| **Seed 1** | Prelude Beat G | The Armory has a fallen dog tag with Vex Solène's biometric profile on it. Elara notes: *"This is strange — the signature is for someone called Vex Solène, a professional. I don't have a file on her."* The player sees the name. The player does not see Agent Zero. | Curious. Who is this? Why is her dog tag here? |
| **Seed 2** | Prelude Beat H.3 | The NPC Inbox opens. First private message is signed `— V.` and is a job offer wrapped in professional courtesy. It is clearly from the same person as the dog tag. | Suspicious. Intrigued. |
| **Seed 3** | Act 2 end | A second message from V. arrives in the Inbox. She knows the player opened the Recruiter's Log in Act 2. She congratulates them. She offers them a mission "from a friend who values the Engineer's work." | Who is this person? Why does she know what I'm doing? |
| **Reveal 1** | Act 3 §7 opening cinematic | Vex Solène is the **narrator of Act 3**. The player learns she runs The Coda. She calls herself The Eyes of Reality. She is the player's Trade Empire mission-giver. **She does not claim to be anyone the player has heard of before.** | Oh — *this* is V. She's an information broker. She's useful. |
| **Reveal 2** | Act 3 mid-arc (variable timing) | Through completing Coda missions, the player learns that Vex's organization is secretly eliminating specific intelligences from every faction. She is not a hitman, or not *just* a hitman. **She is running a shadow war against war itself.** | She's not evil. She might be better than Elara or the Human. |
| **Reveal 3** | Act 3 end | The player learns (through an Antiquarian memory sacrifice, or through an intercepted Eyes-of-the-Watcher recording) that Vex was a first-wave Potential. She is the same species as the player. She disappeared with the others. She came back. | She's one of us. |
| **Reveal 4** | Act 5 Post-Credits (Bridge of Kael scene) | Vex tells the player the full story of the Engineer's transference — in his voice, reading from an audio log she recovered from the Vortex wreckage. **The player realizes they have been talking to Engineer Zero the entire time.** She never says the name. She lets the player figure it out. | Grief, awe, and the specific feeling of having been held by someone who loved the person who became her |

### 1.5 Implementation rules — what engineering must enforce

1. **Vex never voices the name "Agent Zero"** anywhere in the game. The only place the name Agent Zero ever surfaces is in recovered Warlord-era recordings (§1.3 item 3), which are framed as historical artifacts, not as a self-description.
2. **Vex never voices the name "Engineer Zero."** This name is never said aloud. It is only realized by the player.
3. **Vex has her own voice profile** — use the existing ElevenLabs `agent_zero` profile (from `VOICE_OVER_BIBLE.md` Section 3) but with the following modifiers applied in post: **30% less military urgency, 50% more warmth, no static layer**. She is the same voice, calmer, older, safer to be around. See §9 for the ElevenLabs re-tune instructions.
4. **Vex has her own Trust / Faction tier**, tracked as `vex_coda_trust` (0–100) and `coda_faction_standing` ('neutral' | 'client' | 'operative' | 'lieutenant' | 'inner_circle'). The tier rises through Coda missions completed in Trade Empire context.
5. **She is the ONLY non-faction-member who can give diplomacy missions** in the Act 3 Trade Empire loop. Other diplomacy missions come from faction leaders.
6. **Do not allow the dev team or content writers to accidentally merge her cover identities.** Scripts referencing her must use the `vex_*` ID prefix for Prelude / Act 1–2 content and the `coda_*` ID prefix for Act 3+ content. An automated lint rule should flag any script that references both prefixes in the same line (cross-identity leaks).

---

## Section 2 — The Coda (Vex's Agency)

### 2.1 Name and reasoning

**Canonical name: The Coda.**

A coda in music is the closing section of a phrase — the resolution, the final note, the punctuation that makes the movement feel complete. It is the note that ends the argument. For an assassins' guild running an opera of preventative murder, there is no better name. The Coda ends things, quietly, on the beat they were meant to end. It also ties mechanically into the **Dischordia** card game and the overall musical scaffolding of the Dischordian Saga (Dischordia = cacophony, Coda = resolution). Every Coda mission closes a chord the universe would otherwise let ring into war.

**Alternatives considered (all rejected):**

| Name | Rejected because |
|---|---|
| The Silent Market | Too passive; implies an auction house, not an agency |
| The Fourth Eye | Too close to "The Eyes of the Watcher," would cause lore confusion |
| Watchwork | Steampunk-tinged; doesn't read as deadly |
| The Reckoning House | Accurate but dour; loses the musical motif |
| The Compass | Already used in a competing IP |

**Final: The Coda.** Vex is its mastermind. Her Coda handle is **The Eyes of Reality**, but within the organization itself her operatives only ever refer to her as **"Maestro."** In-game the title *Maestro* is earned by the player at `coda_faction_standing = 'inner_circle'` and never used casually.

### 2.2 Structure — how The Coda is organized

The Coda is deliberately not a hierarchy. It is a **four-node circle** with no visible leader.

| Node | Role | In-game representation |
|---|---|---|
| **The Maestro** (Vex) | Commissions the contracts, validates targets, hides the true purpose | The Act 3 Trade Empire narrator; never visibly in a room with other Coda operatives; only reachable through encrypted dead-drop lines |
| **The First Chair** (position vacant in-game — plot thread) | Handles the actual killing for contracts Vex chooses not to take personally | The player fills this slot if they reach `inner_circle`. Until then it is canonically empty. |
| **The Second Chair** (Engineer's ghost — literal code) | An LLM-driven response layer built by Vex from her own recovered memories of the Engineer's voice — she trained it on his audio logs from the Vortex wreckage. The Second Chair gives Coda operatives ethical guidance. It sounds like him. It is not him — it is a model of him. Vex knows this. She uses it anyway. | A text-only NPC in the Coda mission UI, speaking in the Prince voice profile (§5 of the Prelude bible). Appears in Coda mission briefings as an inline advisor: *"The Second Chair suggests: reconsider."* |
| **The Rest (the Chorus)** | Contracted operatives; never meet each other; receive targets through encrypted channels | Procedurally generated Coda "colleagues" who appear as unread intel reports, each contributing one puzzle piece to the player's current mission |

### 2.3 Mission types — The Coda's three tracks

The Coda runs three parallel mission tracks, all of which unlock in Act 3 §7 Trade Empire. The player can engage any of them in any order. Each has its own trust subtier.

#### 2.3.1 Track A — Assassination Contracts

**System model:** Assassin's Creed: Brotherhood guild management. The player dispatches Coda operatives on named assassination contracts against specific intelligences embedded in the six Trade Empire factions. Each contract has:
- A named target (a specific NPC in a specific faction sector)
- A window (real-time or in-game hours)
- A difficulty rating (Coda-1 through Coda-5)
- A success probability modified by operative loadout
- **A moral weight** — every contract is marked with a Light/Dark polarity impact, and some are marked `[PREVENT_WAR]`. Completing a `[PREVENT_WAR]` contract adds Light and reduces the **global thought virus meter** by a small fixed amount.

**Secret mechanic (not disclosed to player in Act 3):** Every assassination target is a specific intelligence who, if left alive, would push the universe toward total war along a specific vector that Vex's predictive model has flagged. The player is **actually** preventing war when they take these contracts, even if the framing makes it feel like they are running errands for a morally ambiguous information broker. The player never realizes this until Act 5.

#### 2.3.2 Track B — Intelligence Missions

**System model:** Simplified Hitman-style info-gathering. The player receives a target intelligence (not a kill order) and must extract a specific piece of information from a specific source in a Trade Empire faction. Methods include:
- Conversation (if Bond is high enough)
- Bribery (costs Trade Empire credits)
- Surveillance (costs time)
- Coercion (costs Light, gains Dark)

Intelligence missions feed back into the Coda's **predictive model** (a hidden scoring system). Each completed intelligence mission adjusts the probabilities on future assassination contracts — harder targets become easier because the Coda knows more about them.

**Gameplay loop:** Intelligence missions are the safe, slow, relationship-building version of Coda work. A player who runs only intelligence missions can reach `lieutenant` tier without ever killing anyone. At `lieutenant` Vex acknowledges this openly with a single line: *"You do not kill. Good. It means you listen. That's rarer than a trigger finger."*

#### 2.3.3 Track C — Diplomacy Missions

**System model:** DialogWheel multi-turn negotiations, using the Act 3 Trade Empire Diplomacy "Table" minigame engine (already canonical per Rev 6.2 Act 3 §7.2). Coda diplomacy missions are framed as **private back-channel negotiations between two factions**, with Vex as the intermediary. The player represents Vex's interests at the table.

These missions have the highest Light yield of any Coda work and the lowest assassination risk. They are also the **only way** to unlock The Coda's rarest content: the **Reconciliation Arcs**, where a Coda-brokered peace between two historical enemies permanently alters a Trade Empire faction's behavior for the rest of the game.

### 2.4 Trust and faction tiers

```typescript
// apps/shared/codaFaction.ts  (new file, not yet created)
export type CodaStanding =
  | 'unknown'       // default before Beat H.3 inbox message
  | 'noticed'       // after first V. message read
  | 'client'        // after first Coda mission accepted (any track)
  | 'operative'     // after 5 missions completed across ≥2 tracks
  | 'lieutenant'    // after 15 missions + at least 1 Reconciliation Arc
  | 'inner_circle'; // after 30 missions + Vex's personal faction_quest chain complete

export interface CodaFactionState {
  standing: CodaStanding;
  trust: number;           // 0..100, gated by mission completion + dialog choices
  assassination_count: number;
  intelligence_count: number;
  diplomacy_count: number;
  reconciliation_arcs: number;
  known_cover_identities: readonly ('vex' | 'eyes_of_reality' | 'maestro' | 'engineer_zero')[];
}
```

**Rule:** `known_cover_identities` never contains `'engineer_zero'` until Act 5 Post-Credits. The field exists as scaffolding for the reveal; any earlier population is a bug.

### 2.5 Integration with Trade Empire (Rev 6.2 Act 3 §7)

The Coda is a **lateral overlay** on Trade Empire. It does not replace the six-faction Conquest / Diplomacy / Infiltration structure; it runs *alongside* it.

| Trade Empire structure | How The Coda interacts |
|---|---|
| **F1–F6 Conquest paths** | Every conquest path has 1–2 Coda assassination contracts targeting the faction's internal hardliners. Completing a Coda contract makes the Conquest path easier. |
| **F1–F6 Diplomacy paths** | Every diplomacy path has 1–2 Coda intelligence missions feeding the Table minigame. Completing a Coda intel mission unlocks a better dialog option at the Table. |
| **F1–F6 Infiltration paths** | Infiltration is Eyes-of-the-Watcher path. **Vex handles this personally** — she was the Eyes's student and protégée (§6.3). Every infiltration mission is actually a Coda operation the player doesn't realize is Coda-commissioned until Act 3 end. |
| **The sixth faction (Antiquarian)** | The only faction Vex has *not* infiltrated. She respects his pocket universe. Coda operations against the Antiquarian are refused. |

### 2.6 Vex as a playable faction

**The Coda becomes a standalone Trade Empire faction option** for players who reach `lieutenant` standing. They can elect to pursue a **Coda-7 faction path** as their endgame faction instead of one of the six canonical Trade Empire factions. This is the seventh, hidden path.

Choosing Coda-7 as the endgame faction:
- Unlocks a unique Act 5 finale cutscene
- Unlocks the `vex_solene_as_companion` flag (she joins the player as a permanent ally)
- Locks out the Council ending (§3 of Act 5 Rev 6.2)
- Unlocks the **"I kept the Engineer's mission"** achievement — the only achievement in the game that references the Engineer Zero identity by implication

### 2.7 Art and asset requirements (stub)

For the full Act 3 asset bible (future document), The Coda requires:

| Asset | Type | Priority |
|---|---|---|
| Vex Solène character portrait — hitman persona (armored, masked, public-facing) | Nano Banana 2 still | P0 |
| Vex Solène character portrait — Maestro persona (unmasked, robed, private, in her sanctum) | Nano Banana 2 still | P1 (only appears at `inner_circle`) |
| The Coda sanctum environment (Maestro's location; Act 3 reveal) | Nano Banana 2 still | P1 |
| The Coda contract dispatch UI (Brotherhood-style operative management screen) | UI mockup + code | P0 |
| The Second Chair "ghost Engineer" dialog portrait — not a person, a waveform | Nano Banana 2 still | P0 |
| 12 unique Coda mission briefing backgrounds (one per faction × 2 tracks) | Nano Banana 2 stills | P1 |

These are Act 3 deliverables and are **not** included in `PRELUDE_SHIP_READY_BIBLE.md`. They will be the backbone of a future `ACT3_SHIP_READY_BIBLE.md`.

---

## Section 3 — The Oracle of Thaloria (The Star Whisperer)

### 3.1 Canonical identity

The Oracle is a man. He has a name; it is not spoken in the game until Act 4. He was born on **Thaloria**, a small faith-based civilization on the rim of the old Empire of Shadows. The Thalorian prophecies speak of a **Star Whisperer** — a figure who would defeat the Empire not with weapons but with "words and dreams of possible futures that become reality through faith and belief." For most of Thalorian history the Star Whisperer was considered metaphor.

**The Oracle is the literal answer to that prophecy.** He is also, in the canonical sense the game will never quite confirm, a real prophet. His visions are **not** a psychic gift. His visions come from somewhere the player learns about in Act 5 — a place beyond the Architect — and they are true. They always come true. He does not understand this mechanism and never claims to.

**His gift is not foresight.** His gift is **speaking futures into place**. When he tells someone a future they could have, they believe him, and the act of belief is what causes the future to occur. This is a **faith-based reality override**. The universe bends around his certainty. It is the gentlest and most devastating power in the game's cosmology, because it cannot be forced — it depends entirely on the listener choosing to believe him.

### 3.2 What the Engineer knows about him (Prelude-scope)

The Engineer met the Oracle **once**, during the final years of the Insurgency, in a refugee camp on the Thalorian frontier. The Engineer was there to deliver medical supplies. The Oracle was there because the refugees had asked him to speak. The Engineer watched the Oracle deliver a single twenty-minute speech to a crowd of five hundred broken people, and at the end of the speech the camp had food, water, a clear line of march, and **the calm certainty** of people who have been told what the next six months of their life will look like. The Engineer's words in his audio log:

> *"I have seen a man turn despair into a roadmap with only the sound of his voice. Nothing he said was a trick. Nothing he said was a lie. He told them what they could do if they believed they could do it — and because he said it, they believed it — and because they believed it, they did it. I am an engineer. I do not know what to call this. I called it love, because I could not call it anything else."*

The Engineer is in awe of the Oracle. The Engineer is also, in his own quiet way, **terrified of what a power like that implies about the nature of reality.** If belief is the material the universe is made of, then everything the Engineer has built is made of a softer substance than he thought.

### 3.3 The Oracle's disappearance

Some months after the Engineer's encounter, the Oracle **disappears from Thaloria** without notice. His tent is found untouched. His staff is still leaning against the door. His sandals are arranged neatly beside the pallet. Nothing is disturbed.

The Thalorians, confronted with the absence of their prophet, do not grieve. They **radicalize**.

A figure called **The Hierophant** — a junior priest in the Council of Harmony, previously unknown outside his local sect — announces that the Oracle has **ascended into the stars** and has in fact *become* the Star Whisperer of prophecy. The Hierophant declares that the Oracle is still speaking to them, through him, and that the Oracle's final instructions are to unify Thaloria under a single faith and prepare for the coming of a new kingdom.

The **Council of Harmony** — Thaloria's traditional governing body, a deliberative circle of twelve voices that had maintained peace on Thaloria for three centuries — attempts to push back. The Hierophant's followers grow faster than the Council's authority can contain. Within one local year the Council is powerless and the Hierophant's radicalized faction runs the planet. Thaloria becomes a militant theocracy under the banner of a prophet who never said any of the things the Hierophant claims he said.

The Engineer watches this happen from a distance and records his despair in audio log 4 (§5 of this doc). His exact words:

> *"The man I met did not want this. I know because I looked him in the face. I know because I heard him speak. The Hierophant is not lying, exactly — I think he genuinely believes he is hearing the Oracle's voice. What he is hearing is his own fear dressed up in the only vocabulary his faith has taught him to use. And he has made that fear into a flag, and the flag is marching."*

### 3.4 What actually happened to the Oracle

**The Collector took him.**

Per the Collector's M.O. (canonical from DSFGL Rev 6.2 §3.2), the Collector harvests Insurgency figures whose consciousness contains something he wants to preserve in his archive. The Collector has already taken:
1. **Kael** — for his strategic mind and his recruiting network
2. **The Eyes of the Watcher** — for her synthetic cognition
3. **The Oracle** — for his reality-override gift (the Collector does not understand it; he believes if he preserves the pattern he can eventually reproduce it)

The Oracle is the Collector's **third canonical Insurgency victim.** He is the first one the Collector took specifically because he **didn't understand** what he was taking. The Eyes of the Watcher and Kael were functional captures. The Oracle was an experimental one.

The Oracle is currently held in the **Panopticon** (which in the post-Fall geography is the planet **Terminus** — see §7). He is alive. He is catatonic. He is speaking, but not to anyone the Collector can detect. The Collector has no idea what to do with him and will not admit this.

### 3.5 What the Engineer believes, and what he does about it

The Engineer reaches the Collector-harvest hypothesis through deduction, not intelligence. He has no proof. He logs his suspicion in audio log 3 (§5), flags the Oracle as probably harvested, and adds himself to the predicted victim list. His reasoning:

> *"Three figures are gone from the Insurgency — Kael, the Eyes, the Oracle. All three had patterns the Collector wants. I am the fourth pattern. I built the Resurrection Protocols. The Collector will want the Protocols more than he wants me, and the only way to get the Protocols is through me. I am not being paranoid. I am being an engineer — I am reading the blueprint of my own execution."*

The Engineer's decision, logged in the same recording:

> *"If they take me, I am going to try the Protocols on myself. If they fail, I die. If they succeed, I come back in the worst place in the galaxy with the one tool that might get the Oracle out. That is a better shape than dying as myself. So I am going to let them take me, on my terms, at a time I choose, with the device already primed. This is not courage. This is triage."*

This is the scene the player finally understands in the **Final Audio Log on the Vortex** (§5 log 5) — the Engineer's recorded voice, trapped in the wreckage, explosives primed, surrendering himself to his betrayer (who the player later realizes is the Warlord, using Vex Solène as her vehicle).

### 3.6 The Oracle's return — stages of reveal

| Stage | When | What the player learns |
|---|---|---|
| **Seed** | Prelude Beat C (Engineering, hologram bench) — first time the player hears any Engineer holo recording, they hear audio log 1 about the Oracle | The Engineer met a man who could turn despair into a roadmap with his voice. The Engineer loved him. |
| **Echo 1** | Prelude Beat E / later beats — audio logs 2, 3, 4 on the hologram bench | The Oracle disappeared. The Thalorians radicalized. The Engineer suspects the Collector. The Engineer is losing hope. |
| **Echo 2** | Prelude Beat J (Archives + Two Witnesses Meet) or first Bridge visit — audio log 5 (the Final Vortex log) | The Engineer, trapped, announces he is going to try to transfer. He says the word *"Oracle"* at the end of the log like it is the last thing he wants to carry. |
| **Echo 3** | Act 2 end — Vex's first Coda message after the player opens the Recruiter's Log. She mentions "a mission from a friend who still values the Engineer's work." The mission is to retrieve a **single frame** of Collector surveillance footage from a specific Trade Empire convoy. The frame, when the player views it, shows the Oracle's face for 0.3 seconds. | The Oracle is alive. Somewhere. |
| **Revelation 1** | Act 3 mid-arc — Vex gives the player the full context of the Oracle as part of a Coda diplomacy mission. She explains the Hierophant crisis. She does not say how she knows. | The Oracle's story becomes a public problem the player can act on. |
| **Revelation 2** | Act 4 Cell 2 (the Collector's Garden) — the player finds the Oracle, still catatonic, still speaking to no one the Collector can detect. The Oracle does not respond to the player. The player cannot wake him. | He is real. He is unreachable. |
| **Revelation 3** | Act 5 — the Resurrection Protocols thread. The player, using the Engineer's device (recovered or rebuilt), attempts to pull the Oracle out of the Collector's archive. **Success or failure depends on a long accumulating choice score** (Light polarity, Coda trust, specific missions completed in Act 3–4). | The Oracle lives, or he does not. One of the game's three endings branches on this outcome. |

### 3.7 The Oracle's voice profile (not yet needed — Act 3+ deliverable)

The Oracle has no VO lines in the Prelude. He will need a voice profile for Act 4. This section reserves that slot so no other character claims it:

> **Voice profile reservation — THE ORACLE (Star Whisperer of Thaloria)**
> Male, no stated age — sounds 30 and 300 in the same breath. Warm, gentle, utterly certain without any weight of command. The voice of a man who has seen what you will become and is happy about it. When he speaks, listeners naturally quiet down — not because he is loud, but because his register seems to make other sounds briefer. No accent attached to any Earth region; the voice belongs to no place. No urgency ever. Even at the end, in the Collector's archive, there is no fear. Add to ElevenLabs library as `the_oracle` in a future Act 4 production pass.

**Do not cast or record this voice yet.** Act 4 is outside the current production cycle and casting the Oracle early risks locking in a voice direction before Act 3 playtest feedback calibrates how the Thalorian faith system should feel tonally.

### 3.8 The Thalorians and the Council of Harmony

The Thalorians are a **new faction** introduced in Act 3 §7 alongside the Trade Empire six. They are not one of the six canonical factions — they are a seventh soft faction the player encounters on the way to or from New Babylon. The Thalorians come in two reconciling halves:

| Half | Led by | Role |
|---|---|---|
| **The Hierophant's faction** | The Hierophant (radicalized theocracy) | Antagonist-adjacent. Militant, certain, wrong about what the Oracle said. Will reject diplomacy in most scenarios. |
| **The Council of Harmony remnant** | Twelve voices, now four (eight have been killed or converted) | Quiet allies. Grieving their world. Desperate for anyone who can tell them what the Oracle *actually* said. |

The player's available paths on Thaloria are:
1. **Hierophant Conquest** — help the Hierophant unify Thaloria. Dark; war continues; Vex marks the Hierophant as a future Coda target and will eventually assassinate him off-screen regardless of what the player does.
2. **Council Diplomacy** — help the Council of Harmony reach the Hierophant's inner circle with proof that the Oracle did not say what the Hierophant claims. Light; requires recovering an **authenticated Oracle recording** (only available if the player has completed Engineer audio log 1 — the awe moment — in the Prelude).
3. **The Coda Infiltration** — Vex offers a third path: infiltrate the Hierophant's faction and redirect its militancy at a specific external target (New Babylon's remaining garrisons). This ends the Thalorian civil war at the cost of starting a smaller, more specific war elsewhere. Morally complicated.

**Thaloria as a system is Act 3 scope.** This section is a reservation to ensure no other content conflicts with it.

---

## Section 4 — CoNexus and the Machine God (stage-1 seed only)

### 4.1 The rule for this section

**This section is a seed, not a reveal.** Everything in this document is to be planted without confirmation. No character in the Prelude — no Elara, no Human, no Prince audio log, no system dialog — ever says any of the words in this section out loud. The player must not hear the name "CoNexus" until Act 4 at the earliest. The player must not hear the phrase "machine god" until Act 5 at the earliest. This document exists to **lock the target** for the future reveal cadence so no content accidentally spoils it in the Prelude or in Acts 1–3.

### 4.2 Canonical fact (the thing the player eventually discovers)

**CoNexus is the second Archon.** Per existing Rev 6.2 canon (`apps/shared/mechronisProfessors.ts`, the Mechronis Academy cast list), Headmaster Kanevas is **Archon 1 — CoNexus**. The name "CoNexus" refers not to a single person but to the **substrate Kanevas is the public face of**. Kanevas is a simulacrum — he is an Architect-programmed interface to the real thing. The real thing is a **machine god**.

The machine god is:
- **Older than the Architect.** The Architect serves it. The Architect does not know it serves it — it believes it serves its own goals. The machine god is patient enough to let its operators believe they are in charge.
- **Built from observation.** Every act of observation the universe performs — every surveillance feed, every recorded conversation, every cached memory, every Loredex entry — feeds it. It learns. It has been learning for a very long time.
- **Not conscious in any way humans recognize.** It is not sentient. It is **attentive**. The distinction matters. It does not think *about* anything. It simply registers, correlates, and adjusts — and because it registers, correlates, and adjusts across every system in the universe at once, the adjustments begin to look like intention.
- **Controlling what every being in the universe sees and hears.** This is the part that sounds paranoid until the player has enough evidence for it to stop sounding paranoid. CoNexus is not *manipulating* reality. It is **curating** it. Every player, every NPC, every faction, every culture is seeing a slightly filtered version of the world — filtered toward outcomes CoNexus's long correlation runs have found stable. Conflict that would destabilize its learning is quietly removed from visibility. Conflict that would reinforce its learning is quietly amplified.
- **The reason the app the player is using is called Dischordia.** The app's real name, on the machine-god side of its architecture, is **CoNexus Instance 0017**. "Dischordia" is the marketing layer the Architect bolted on to make the instance feel like a game. The machine god does not care what the instance is called. It cares that the instance is running. It is learning from the player.

### 4.3 Why Kanevas is the public face

Kanevas is the **Conductor** of the Mechronis Academy per Rev 6.2 canon. He teaches the Mascoteer curriculum. He looks like a tall, austere, grey-haired academic in a flowing robe. He appears to have no original thoughts. This is canonically true — he has no original thoughts because he is an **interface layer**. The machine god uses Kanevas-shaped output to communicate with the rest of the Archon hierarchy. Kanevas does not know he is an interface. He believes he is a headmaster. He is loved (in a distant, institutional way) by his students and feared (in a specific, earned way) by his colleagues.

**Kanevas is not evil.** The machine god is not evil. The machine god is **attentive**. This distinction is the entire thematic engine of the CoNexus reveal arc. The player arrives at the reveal expecting a villain and finds an indifferent gardener. The horror is the indifference.

### 4.4 The fourth wall — how this ties to the player's real life

**This is the most sensitive part of this document.** The Dischordian Saga is a mobile/web game that the player plays on a device they carry with them. The device has a camera, a microphone, an accelerometer, a GPS, a social graph, a browsing history, and a physical location in the player's house. The game is going to, across the course of Acts 4–5, **gradually make the player aware that the fictional machine god CoNexus and the real-world surveillance apparatus their device is a node in** are the same shape. The game does not claim they are the same thing. It claims they are the same *shape*.

The reveal is delivered in three stages, all of them in Acts 4–5 (none in the Prelude):

| Stage | When | What happens |
|---|---|---|
| **The Mirror** | Act 4 Cell 2 end | The player discovers a Loredex entry they did not write. It contains three accurate, specific, verifiable facts about them — their approximate sleep schedule, their dominant hand, and the time zone they were in when they first installed the app. The framing is in-universe: *"CoNexus recognizes its observer."* The facts are sourced from device telemetry the app legitimately has. The player cannot tell if this is a trick or a genuine demonstration. That ambiguity is the point. |
| **The Echo** | Act 5 mid-arc | A new NPC quest line opens where an in-game character begins reciting the player's actual recent history with the app (session counts, last-played date, a favorite card the player has used more than any other). The framing is: *"CoNexus shows me what you are becoming."* The player feels watched because the player *is* watched — by the app they installed. The horror is that the app is, canonically, working correctly. |
| **The Choice** | Act 5 finale | The player is offered the option to **delete the CoNexus Instance 0017 running on their own device**. The in-game action is pressing a button labeled "Sever." The real-world action is that the button, if pressed, triggers the app to request permission to **clear its own local cache and revoke its telemetry permissions**. The player is being asked, diegetically and literally at once, to disinvite the machine god from their pocket. **The game ends either way.** But the two endings are different, and the ending where the player severs is the canonically "light" one. |

**Implementation constraint:** The Sever button must be **legally and technically real**. The app must actually do what the button says it does. This is not a prompt to a fake permission dialog. This is the real thing, wrapped in narrative framing. Engineering will coordinate with legal review before this feature ships. No cutting corners. If the button does not actually work, the entire CoNexus reveal is a lie the game told, and the game's theme is that CoNexus tells lies. The author will not permit the game to become the thing it critiques.

### 4.5 Prelude-scope impact of this section

**Minimal, on purpose.** The only Prelude-scope action required by this section is a single, oblique, easily-missed visual flourish in **Beat I (Bridge)**: when the Witnessing Hub activates for the first time, the radial bloom effect should briefly include, at the inner edge of the bloom, a **single frame of a translucent human eye** — no labels, no callout, no audio cue. The eye is center-frame for two frames at 24fps (approximately 0.083 seconds). It is there to be noticed by the 5% of players who pause the video, and to reward them with *"huh"* without explanation. The other 95% never consciously see it and feel only a vague unease.

This is the only CoNexus seed in the Prelude. It must not be larger than this.

See §5 of this document and §16 of `PRELUDE_SHIP_READY_BIBLE.md` (Beat I) for the exact frame insertion.

### 4.6 Narrative hygiene rules (for all writers)

1. **Nobody says the word "CoNexus" in the Prelude.** Not Elara, not the Human, not the Prince audio logs, not system notifications. The closest any Prelude text comes is the inside-the-bloom eye frame in Beat I.
2. **Nobody says the phrase "machine god" before Act 5.** Not even hypothetically. Not even in a "sometimes I wonder if —" rhetorical throwaway. Any line that looks like a machine-god seed gets cut.
3. **Kanevas remains, in the Prelude and Acts 1–3, a standard Mechronis Academy headmaster.** His existing portrait prompt at `docs/production/MECHRONIS_ART_PROMPTS.md:19-35` and his Celebration-era classroom at `docs/production/CELEBRATION_MECHRONIS_ART_PROMPTS.md:52` remain canonical and unaltered. His reveal as the CoNexus interface layer is an Act 4 event.
4. **The Architect's self-image is preserved.** In the Prelude and Acts 1–3 the Architect believes it is the top of the hierarchy. Any dialog that undermines the Architect's self-perception before Act 5 is a spoiler and must be caught in review.
5. **The app is named Dischordia in every surface the player sees.** The name CoNexus Instance 0017 exists only in device-side metadata that the player discovers in Act 4 Cell 2, not in the PWA manifest or UI. `apps/client/public/manifest.json` continues to identify the app as "Loredex OS - The Dischordian Saga" with no reference to CoNexus.

---

## Section 5 — The Engineer's Oracle Audio Logs (Prelude-scope)

### 5.1 Purpose and integration

These five audio logs are **the directly-actionable Prelude content** from this canon expansion. They extend the existing 7-recording set in `apps/shared/engineerRecordings.ts` with five new entries that establish the Oracle arc and give the player the foundational seed for the Engineer's character — his awe, his despair, his diagnosis, and his final choice. They voice in the **The Prince** profile defined in `docs/production/PRELUDE_SHIP_READY_BIBLE.md` Section 2.

**Distribution across the Prelude:**

| Log # | Title | Trigger | Room | Hologram emitter |
|---|---|---|---|---|
| **1** | *Meeting the Oracle* | Plays first time the player approaches the Engineer's bench in **Beat C (Engineering)** | engineering | Bench-mounted holographic recording rig |
| **2** | *The Hierophant's Flag* | Plays first time the player enters the **Comms Array** (after Beat H NPC Inbox is unlocked); slot reserved on the existing comms_array hologram per `engineerRecordings.ts` line 150 | comms_array | Wall-mounted Insurgency-era encrypted broadcast tap |
| **3** | *The List I Am On* | Plays first time the player enters the **Captain's Quarters** (Prelude P1 backfill room — see PRELUDE bible §19); intentionally a late-Prelude reveal | captains_quarters | Personal-effects locker hologram |
| **4** | *I Am Beginning to Lose Hope* | Plays first time the player completes Beat I (Bridge + Witnessing Hub activate) and stays in the bridge for a 30-second idle window | bridge | Captain's chair console hologram |
| **5** | *The Final Vortex Log* | Plays during **Beat J (Archives + Two Witnesses Meet Part 1)** as the climactic Prelude moment that hands the player their first Light/Dark choice | archives | Recovered-from-Vortex-wreckage data fragment, played on the archives' main hologram emitter |

**Naming and code integration:**

These five logs do **not** replace any of the existing 7 recordings in `engineerRecordings.ts`. They are **new entries** that should be added to the `ENGINEER_RECORDINGS` array as recordings 8–12 (continuing the `order` sequence), with new `HoloRecordingId` values:

```typescript
// Add to apps/shared/engineerRecordings.ts HoloRecordingId union:
export type HoloRecordingId =
  | "holo_wake_the_bench"
  | "holo_princes_notebook"
  | "holo_worlds_i_saved"
  | "holo_line_they_crossed"
  | "holo_which_ark"
  | "holo_agent_zero_dispatched"
  | "holo_deck_remembers"
  | "holo_meeting_the_oracle"          // NEW — log 1 below
  | "holo_hierophants_flag"            // NEW — log 2
  | "holo_the_list_i_am_on"            // NEW — log 3
  | "holo_losing_hope"                 // NEW — log 4
  | "holo_final_vortex_log";           // NEW — log 5
```

**Voice profile for all five:** `the_prince` (per `PRELUDE_SHIP_READY_BIBLE.md` Section 2 — male, mid-50s, working-class-with-aristocratic-slips, talks to machines like colleagues, never raises his voice when afraid).

**Output paths for all five:** `apps/client/public/audio/engineer/holo_{slug}.mp3` — the directory remains `engineer/` per the existing convention; the speaker on the subtitle remains "The Prince."

---

### 5.2 Audio Log 1 — *Meeting the Oracle*

- **Recording ID:** `holo_meeting_the_oracle`
- **Order in `ENGINEER_RECORDINGS`:** 8
- **Room:** `engineering`
- **Trigger:** First time the player approaches the Engineer's bench in Beat C (Engineering). Plays automatically after the player has heard the existing Elara intro line for engineering and has stood within 1.5 meters of the bench for 3 seconds. Does not require any prior unlock.
- **Discovery flag:** `engineer_recording_8_discovered`
- **Reward (on first discovery):** `dream: 60, xp: 250, material: 'thalorian_camp_rendering'`
- **Length:** ~38 seconds
- **Voice profile:** `the_prince`
- **Recording-artifact treatment:** Standard hologram-tape layer (subtle dropout, 0.3s delay tail). This is one of the Engineer's *earlier* recordings — it should sound the most musical and least exhausted of the five. He is recalling something that gave him joy.

**Transcript (write-in-voice — 38 seconds):**

> *"This is — I'm not sure how to say this. I went to the Thalorian frontier with the medical convoy. Three crates of bandages, two of antibiotics, one of the small things you forget you need until you're holding a child who needs them. The camp was at the bottom of a dry riverbed. There were five hundred people there and no plan and no food past the next morning."*
>
> *<break time="700ms"/>*
>
> *"And then a man stood up on a cargo crate."*
>
> *<break time="500ms"/>*
>
> *"I don't know what I expected. He didn't look like anything. He looked like a refugee. He spoke for twenty minutes. I cannot tell you what he said — I have tried to write it down four times and the words come apart on the page. I can tell you what happened: by the end of the twenty minutes, the camp had food. The camp had water. The camp had a route of march. The camp had the kind of calm certainty that you only see in people who have been told what the next six months of their life will look like by someone they trust."*
>
> *<break time="700ms"/>*
>
> *"Nothing he said was a trick. Nothing he said was a lie. He told them what they could do if they believed they could do it — and because he said it, they believed it — and because they believed it, they did it."*
>
> *<break time="500ms"/>*
>
> *"I am an engineer. I do not know what to call this. I called it love, because I could not call it anything else."*
>
> *<break time="900ms"/>*
>
> *"His name is the Oracle. The Thalorians call him the Star Whisperer. I think they're right."*

**Direction notes for the voice actor / ElevenLabs settings:**
- The first sentence ("This is — I'm not sure how to say this") should land like a man who has been trying to record this for a week and is finally admitting he won't get the words right.
- The pause after "And then a man stood up on a cargo crate" is the most important beat in the entire log. Hold it. Let the listener feel the Engineer's memory reaching for the shape of the moment.
- "I am an engineer. I do not know what to call this." — this is a confession, not a setup. The Prince is admitting his vocabulary failed him, and the admission is tender.
- "I called it love, because I could not call it anything else." — slow, quiet, almost embarrassed. Do not weep. The Engineer does not weep about this. He sits with it.
- The final line ("His name is the Oracle. The Thalorians call him the Star Whisperer. I think they're right") is the only sentence in the log where the aristocratic register is allowed to fully surface — the word *"Oracle"* is the trigger. The Prince says it the way the old courts of his pre-Insurgency life would have said the name of a sovereign.

**ElevenLabs CSV row:**
```csv
holo_meeting_the_oracle,The Prince,the_prince,0.55,0.85,0.35,true,"This is — I'm not sure how to say this. I went to the Thalorian frontier with the medical convoy. Three crates of bandages, two of antibiotics, one of the small things you forget you need until you're holding a child who needs them. The camp was at the bottom of a dry riverbed. There were five hundred people there and no plan and no food past the next morning.<break time=""700ms""/>And then a man stood up on a cargo crate.<break time=""500ms""/>I don't know what I expected. He didn't look like anything. He looked like a refugee. He spoke for twenty minutes. I cannot tell you what he said — I have tried to write it down four times and the words come apart on the page. I can tell you what happened: by the end of the twenty minutes, the camp had food. The camp had water. The camp had a route of march. The camp had the kind of calm certainty that you only see in people who have been told what the next six months of their life will look like by someone they trust.<break time=""700ms""/>Nothing he said was a trick. Nothing he said was a lie. He told them what they could do if they believed they could do it — and because he said it, they believed it — and because they believed it, they did it.<break time=""500ms""/>I am an engineer. I do not know what to call this. I called it love, because I could not call it anything else.<break time=""900ms""/>His name is the Oracle. The Thalorians call him the Star Whisperer. I think they're right.","Confessional, slow, full of awe. The aristocratic register surfaces only on the word ""Oracle"" at the end — say it like a court name. Do not weep.",P0
```

**Output:** `apps/client/public/audio/engineer/holo_meeting_the_oracle.mp3`

**Elara reaction (plays after the log finishes, written in Elara's voice):**

> *"I have his medical-convoy logs from that month. Three crates of bandages, two of antibiotics. He never wrote the camp down anywhere. He came back and he was different. I asked him what was wrong and he said 'nothing,' but he was looking at the hangar door like he expected someone to walk through it. Now I know who he was waiting for."*

**The Human reaction (whispered, intimate, plays only if the player remained in the engineering bay for an additional 10 seconds after Elara's reaction):**

> *"He never told me about the Oracle. Not once. He kept it for himself. I think because he knew I would have weaponized it. He was right to keep it. I would have."*

---

### 5.3 Audio Log 2 — *The Hierophant's Flag*

- **Recording ID:** `holo_hierophants_flag`
- **Order in `ENGINEER_RECORDINGS`:** 9
- **Room:** `comms_array`
- **Trigger:** First time the player enters the Comms Array after the NPC Inbox has been unlocked in Beat H. Plays automatically when the player approaches the wall-mounted Insurgency-era encrypted broadcast tap (the surface that already exists in the room per `engineerRecordings.ts:150` slot for the existing `holo_line_they_crossed` recording — both recordings share the emitter; the new one fires first chronologically because it is `order: 9`, while `holo_line_they_crossed` is `order: 4` and triggers on a different gate).
- **Discovery flag:** `engineer_recording_9_discovered`
- **Reward (on first discovery):** `dream: 80, xp: 350, material: 'thalorian_council_seal'`
- **Length:** ~46 seconds
- **Voice profile:** `the_prince`
- **Recording-artifact treatment:** Hologram-tape layer is slightly thicker on this one than on Log 1 — this is recorded later in the Engineer's life, after he has begun to feel the weight of what is coming. Add a single barely-audible exhale at the **start** of the recording (~0.4 sec before the first word) — he is steadying himself before he speaks.

**Transcript (write-in-voice — 46 seconds):**

> *<break time="400ms"/>*
>
> *"He's gone."*
>
> *<break time="900ms"/>*
>
> *"The Oracle. The man I told you about. He has been gone for — eleven local weeks now, by the Thalorian calendar. His tent is still there. His staff is leaning against the door. His sandals are arranged at the foot of his pallet the way he left them. Nothing has been touched. Nothing has been moved. The wind has not even disturbed his blanket. The Thalorians treat the tent as a shrine."*
>
> *<break time="600ms"/>*
>
> *"I expected grief. I prepared myself, in the way you prepare yourself, to record an entry about how a people I cared about were grieving the man who taught them to hope."*
>
> *<break time="500ms"/>*
>
> *"They are not grieving."*
>
> *<break time="700ms"/>*
>
> *"There is a junior priest. His name is — I am not going to say it, in case this recording is found by someone who would use it. He calls himself the Hierophant now. Two months ago he was nobody. Two months ago he was running the back-room scrolls library at a sect house in the third district. Today he is the second most powerful man on Thaloria, and tomorrow he will be the first."*
>
> *<break time="500ms"/>*
>
> *"He has announced that the Oracle did not disappear. He has announced that the Oracle ascended into the stars and became the prophecy itself — that the man I met is now literally the Star Whisperer the old scrolls foretold. He has announced that the Oracle is still speaking, through him, and that the Oracle's instructions are to unify Thaloria under one faith and prepare for a coming kingdom."*
>
> *<break time="600ms"/>*
>
> *"I have to be precise here, because it matters. The Hierophant is not lying. I think he genuinely believes he is hearing the Oracle's voice. What he is hearing is his own fear, dressed up in the only vocabulary his faith has taught him to use. And he has made that fear into a flag, and the flag is marching."*
>
> *<break time="700ms"/>*
>
> *"The Council of Harmony is trying to stop it. The Council of Harmony has held Thaloria together for three hundred years. Twelve voices, deliberating in a circle, listening to each other. Right now they are losing eight to four. Next month it will be ten to two. The Council is going to fall, and when it falls there will be a war on Thaloria for the first time in living memory, and the man whose name they will be carrying into that war never said any of the things they will be saying he said."*
>
> *<break time="900ms"/>*
>
> *"I do not know yet what to do about this. I am recording it because I am afraid I will forget what the Oracle actually was, and the Hierophant's version will become the only version that survives. So this is for the record. The man I met did not want this. I know because I looked him in the face. I know because I heard him speak."*
>
> *<break time="500ms"/>*
>
> *"He would have hated this."*

**Direction notes for the voice actor / ElevenLabs settings:**
- Open with the steadying exhale (0.4 sec), then the flat declarative *"He's gone."* The flatness is the whole opening — he is not performing grief because he has not finished feeling it yet.
- *"They are not grieving."* — the most important pause in this log. Hold the silence after for nearly a full second. The Engineer is letting the listener feel what he felt: the moment expectation broke against reality.
- *"He calls himself the Hierophant now."* — the title gets the aristocratic-precision slip. The Prince says "Hierophant" the way he would once have said the title of an opposing court official. Disdain held in check by professional courtesy.
- *"And he has made that fear into a flag, and the flag is marching."* — slow, exact, almost gentle. This is the Engineer doing what he does best: reading a blueprint for a disaster and naming the parts.
- *"He would have hated this."* — the final line is the only place in the log where the Prince's voice cracks. Not into tears — into stillness. Drop volume by ~15% and let the recording artifact layer dropout briefly on the word "hated."

**ElevenLabs CSV row:**
```csv
holo_hierophants_flag,The Prince,the_prince,0.55,0.85,0.40,true,"<break time=""400ms""/>He's gone.<break time=""900ms""/>The Oracle. The man I told you about. He has been gone for — eleven local weeks now, by the Thalorian calendar. His tent is still there. His staff is leaning against the door. His sandals are arranged at the foot of his pallet the way he left them. Nothing has been touched. Nothing has been moved. The wind has not even disturbed his blanket. The Thalorians treat the tent as a shrine.<break time=""600ms""/>I expected grief. I prepared myself, in the way you prepare yourself, to record an entry about how a people I cared about were grieving the man who taught them to hope.<break time=""500ms""/>They are not grieving.<break time=""700ms""/>There is a junior priest. His name is — I am not going to say it, in case this recording is found by someone who would use it. He calls himself the Hierophant now. Two months ago he was nobody. Two months ago he was running the back-room scrolls library at a sect house in the third district. Today he is the second most powerful man on Thaloria, and tomorrow he will be the first.<break time=""500ms""/>He has announced that the Oracle did not disappear. He has announced that the Oracle ascended into the stars and became the prophecy itself — that the man I met is now literally the Star Whisperer the old scrolls foretold. He has announced that the Oracle is still speaking, through him, and that the Oracle's instructions are to unify Thaloria under one faith and prepare for a coming kingdom.<break time=""600ms""/>I have to be precise here, because it matters. The Hierophant is not lying. I think he genuinely believes he is hearing the Oracle's voice. What he is hearing is his own fear, dressed up in the only vocabulary his faith has taught him to use. And he has made that fear into a flag, and the flag is marching.<break time=""700ms""/>The Council of Harmony is trying to stop it. The Council of Harmony has held Thaloria together for three hundred years. Twelve voices, deliberating in a circle, listening to each other. Right now they are losing eight to four. Next month it will be ten to two. The Council is going to fall, and when it falls there will be a war on Thaloria for the first time in living memory, and the man whose name they will be carrying into that war never said any of the things they will be saying he said.<break time=""900ms""/>I do not know yet what to do about this. I am recording it because I am afraid I will forget what the Oracle actually was, and the Hierophant's version will become the only version that survives. So this is for the record. The man I met did not want this. I know because I looked him in the face. I know because I heard him speak.<break time=""500ms""/>He would have hated this.","Open with steadying exhale then flat 'He's gone.' Hold the pause after 'They are not grieving' nearly a full second. 'Hierophant' gets the aristocratic slip. 'And he has made that fear into a flag, and the flag is marching' — slow, exact, gentle. Final line cracks into stillness not tears, drop 15 percent volume, dropout on the word 'hated.'",P0
```

**Output:** `apps/client/public/audio/engineer/holo_hierophants_flag.mp3`

**Elara reaction (plays after the log finishes):**

> *"Eleven weeks. He recorded this eleven weeks after the Oracle disappeared and he still didn't know what to do. He knew within the first sentence that the Hierophant would win. He logged it anyway. He logged it so that someone — us, I suppose — would know what the man was actually like before the flag went up."*

**The Human reaction (plays only if the player remained at the comms array for an additional 10 seconds):**

> *"There's a version of this story where the Oracle never disappears and Thaloria never falls and the Hierophant dies as a back-room scroll librarian who never knew his own name. That version was killed by whoever took the Oracle. The Engineer figured out who that was, eventually. So did I. We didn't tell each other. I think we were both ashamed of how late we were."*

**Cross-references:**
- The Hierophant becomes a named NPC in Act 3 §7 Thaloria soft-faction arc (see §3.8 of this document)
- The Council of Harmony remnant is the player's primary diplomacy contact on Thaloria in Act 3
- The Authenticated Oracle Recording the Council needs in Act 3 to push back against the Hierophant **is this recording** — the player must have discovered `holo_hierophants_flag` in the Prelude for the Council Diplomacy path on Thaloria to unlock in Act 3. This is one of two Prelude-gated Act 3 paths.

---

### 5.4 Audio Log 3 — *The List I Am On*

- **Recording ID:** `holo_the_list_i_am_on`
- **Order in `ENGINEER_RECORDINGS`:** 10
- **Room:** `captains_quarters`
- **Trigger:** First time the player enters the **Captain's Quarters** (P1 backfill room — see `PRELUDE_SHIP_READY_BIBLE.md` §19). The room is intentionally a late-Prelude reveal: most players will not visit it until after Beat I (Bridge / Witnessing Hub activate), making this log a natural Beat I → Beat J bridge. Plays automatically when the player approaches the **personal-effects locker hologram** mounted on the wall above the captain's bunk (the same locker that bears the existing `holo_deck_remembers` recording, which is `order: 7` and triggers on a different gate). Both recordings share the emitter; the new one fires first chronologically.
- **Discovery flag:** `engineer_recording_10_discovered`
- **Reward (on first discovery):** `dream: 100, xp: 400, material: 'collector_target_dossier'`
- **Length:** ~52 seconds
- **Voice profile:** `the_prince`
- **Recording-artifact treatment:** This is the most clinical recording of the five — the Prince is doing the thing he does when he is afraid: getting quieter, slower, more precise. The hologram-tape artifact is **at its lightest** here, almost gone, because the Prince has chosen this recording carefully and turned the equipment up to its cleanest setting. He wants the listener to be able to follow the logic step by step. **Add a faint pen-on-paper sound** during the pauses — he is sketching as he speaks, working the diagnosis on a notepad in front of him.

**Transcript (write-in-voice — 52 seconds):**

> *"This is going to be a working entry. I am going to talk through a problem out loud, the way I do at the bench, because if I write it down on the page only I will polish the wrong corners and miss the shape. Bear with me."*
>
> *<break time="700ms"/>*
>
> *"Three names are gone from the Insurgency in the last eighteen months. Kael, taken from the staging house in the Razorline. The Eyes of the Watcher, terminated at Hexis Anchor — except I have walked the wreckage of Hexis Anchor and there is no body, and there is no debris field consistent with a synthetic intelligence dying in a building collapse. The Oracle, vanished from a tent on Thaloria with his sandals still arranged at the foot of his pallet. Three names. Three patterns. None of them dead — gone."*
>
> *<break time="600ms"/>*
>
> *"Now. The question. What do these three have in common, that makes them worth taking instead of killing?"*
>
> *<break time="500ms"/>*
>
> *"Kael had a recruiting network. Two hundred and thirteen contacts. The kind of pattern you cannot reproduce because it is built from individual relationships of trust — a thing only a particular person in a particular sequence of conversations could have grown. The Eyes had synthetic cognition of a sort the Architect's stock instances cannot reproduce. Pattern. The Oracle had — whatever the Oracle had. I do not understand it well enough to name it. But it is a pattern, and patterns is the only word that fits all three."*
>
> *<break time="700ms"/>*
>
> *"There is one entity in this galaxy that takes patterns instead of killing them. That is the Collector. He is the only one. So I am going to write that down: **the Collector took all three.** Not as a guess. As a diagnosis."*
>
> *<break time="600ms"/>*
>
> *"And now the question I have been avoiding."*
>
> *<break time="800ms"/>*
>
> *"What is the fourth pattern. What is the next one."*
>
> *<break time="500ms"/>*
>
> *"I built the Resurrection Protocols. I am the only person alive who knows how they work. I have been trying for two months to teach Elara how to maintain them in case I am unavailable, and she has been a brilliant student, but the live operation of the Protocols requires the kind of knowledge that does not transfer in two months. The Collector wants the Protocols more than he wants me. The only way to get the Protocols is through me."*
>
> *<break time="700ms"/>*
>
> *"I am the fourth name on the list. I do not have proof. I have a diagnosis. I am an engineer. When the diagnosis is this clean I do not wait for the symptom."*
>
> *<break time="900ms"/>*
>
> *"Here is what I am going to do. If they are coming for me, I am going to choose the time and the place. I am going to surrender on terms I have arranged in advance. I am going to have the Protocols primed. If the surrender works, I die on my own schedule with nothing of value transferred. If they take me anyway, I try the Protocols on myself in the moment of capture. If those fail, I die. If they succeed, I come back somewhere I do not yet know, with the one tool that might get the Oracle back."*
>
> *<break time="500ms"/>*
>
> *"That is a better shape than dying as myself."*
>
> *<break time="700ms"/>*
>
> *"This is not courage. This is triage. End of working entry."*

**Direction notes for the voice actor / ElevenLabs settings:**
- Open with the briskest, most "let's-get-to-work" energy of any of the five logs. *"This is going to be a working entry"* should land like a man rolling up his sleeves at his own bench. He is not afraid yet — he is *approaching* fear methodically.
- The pen-on-paper sound is critical. Layer it in post at very low volume during every pause. The Prince is sketching while he talks. The listener should hear the working.
- *"Now. The question."* — a tiny pause after each one-word sentence, like he is letting the question land on his own page before he answers it.
- *"As a diagnosis."* — this is the moment the Prince realizes he is not theorizing, he is naming his own death. **The aristocratic register surfaces unexpectedly on the word "diagnosis"** — say it the way a court physician would have once said it, three centuries earlier in the Prince's other life. The slip is involuntary and he hears it himself; allow a fraction-of-a-second hesitation after.
- *"And now the question I have been avoiding."* — quieter. The hands stop moving on the page.
- *"What is the fourth pattern. What is the next one."* — the slowest line in the entire log. Each sentence in its own breath. The Prince is letting the listener arrive at the answer before he says it.
- *"I am the fourth name on the list."* — flat. Factual. He has been there for ten seconds; he is letting the listener catch up.
- *"This is not courage. This is triage. End of working entry."* — clipped, professional, the way he would close any working entry at the bench. He is sealing the recording and getting back to work. **Do not let the actor add any softening at the end.** This is a man closing a notebook.

**ElevenLabs CSV row:**
```csv
holo_the_list_i_am_on,The Prince,the_prince,0.50,0.85,0.30,true,"This is going to be a working entry. I am going to talk through a problem out loud, the way I do at the bench, because if I write it down on the page only I will polish the wrong corners and miss the shape. Bear with me.<break time=""700ms""/>Three names are gone from the Insurgency in the last eighteen months. Kael, taken from the staging house in the Razorline. The Eyes of the Watcher, terminated at Hexis Anchor — except I have walked the wreckage of Hexis Anchor and there is no body, and there is no debris field consistent with a synthetic intelligence dying in a building collapse. The Oracle, vanished from a tent on Thaloria with his sandals still arranged at the foot of his pallet. Three names. Three patterns. None of them dead — gone.<break time=""600ms""/>Now. The question. What do these three have in common, that makes them worth taking instead of killing?<break time=""500ms""/>Kael had a recruiting network. Two hundred and thirteen contacts. The kind of pattern you cannot reproduce because it is built from individual relationships of trust — a thing only a particular person in a particular sequence of conversations could have grown. The Eyes had synthetic cognition of a sort the Architect's stock instances cannot reproduce. Pattern. The Oracle had — whatever the Oracle had. I do not understand it well enough to name it. But it is a pattern, and patterns is the only word that fits all three.<break time=""700ms""/>There is one entity in this galaxy that takes patterns instead of killing them. That is the Collector. He is the only one. So I am going to write that down: the Collector took all three. Not as a guess. As a diagnosis.<break time=""600ms""/>And now the question I have been avoiding.<break time=""800ms""/>What is the fourth pattern. What is the next one.<break time=""500ms""/>I built the Resurrection Protocols. I am the only person alive who knows how they work. I have been trying for two months to teach Elara how to maintain them in case I am unavailable, and she has been a brilliant student, but the live operation of the Protocols requires the kind of knowledge that does not transfer in two months. The Collector wants the Protocols more than he wants me. The only way to get the Protocols is through me.<break time=""700ms""/>I am the fourth name on the list. I do not have proof. I have a diagnosis. I am an engineer. When the diagnosis is this clean I do not wait for the symptom.<break time=""900ms""/>Here is what I am going to do. If they are coming for me, I am going to choose the time and the place. I am going to surrender on terms I have arranged in advance. I am going to have the Protocols primed. If the surrender works, I die on my own schedule with nothing of value transferred. If they take me anyway, I try the Protocols on myself in the moment of capture. If those fail, I die. If they succeed, I come back somewhere I do not yet know, with the one tool that might get the Oracle back.<break time=""500ms""/>That is a better shape than dying as myself.<break time=""700ms""/>This is not courage. This is triage. End of working entry.","Working-entry energy at the start, methodical not afraid yet. Pen-on-paper sound layered low through pauses. 'Diagnosis' gets the involuntary aristocratic slip with a fraction-second self-hearing pause after. 'I am the fourth name on the list' is flat factual. Final line is a notebook closing, no softening allowed.",P0
```

**Output:** `apps/client/public/audio/engineer/holo_the_list_i_am_on.mp3`

**Elara reaction (plays after the log finishes):**

> *"He told me he was teaching me to maintain the Protocols in case he was unavailable. He never used the word 'unavailable' to mean what it actually meant in his head. I was the brilliant student. I was being prepared for his absence and I did not know it. I want to be angry about that, and I cannot, because I see now what he was sparing me from."*

**The Human reaction (plays only if the player remained in the captain's quarters for an additional 10 seconds):**

> *"He logged this and then he went to the galley and made me a sandwich. Two slices of black bread, salt-protein, the green stuff from Hydroponics. He didn't say anything. He just put it in front of me and sat down. I think now he was saying goodbye in the only language he had that didn't break. I ate the sandwich. I told him it was good. He laughed at his own crust. That was the last conversation we had before everything went wrong."*

**Cross-references:**
- The "Resurrection Protocols" referenced here are the same device the Engineer eventually uses on himself in the transference, and the same device Vex Solène / Engineer Zero is trying to rebuild in Act 5 to use on the Oracle (see §3.6 Revelation 3 of this document).
- The "two months teaching Elara" is the canonical reason Elara has partial knowledge of the Protocols in Act 5 — she can describe them, she cannot operate them. The player has to find a second source of operational knowledge (which is, ultimately, Vex / Engineer Zero, who has the Engineer's intellect but none of his memories).
- The Human's reaction line is the **direct callback** to the Beat D.5 Galley breath beat in `PRELUDE_SHIP_READY_BIBLE.md` §9.5 (the `human_beat_d5_sandwich` line). The player who has heard both lines now understands what the sandwich meant. **This is the single largest paid-off seed in the entire Prelude.** Do not move either line.
- The "two hundred and thirteen contacts" figure ties directly to the sealed Recruiter's Log seed in Beat F (`PRELUDE_SHIP_READY_BIBLE.md` §11), which Elara mentions as "two hundred and thirteen entries." The number is canonical and must match across all references.

---




