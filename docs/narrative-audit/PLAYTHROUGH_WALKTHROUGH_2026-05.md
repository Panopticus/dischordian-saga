# Dischordian Saga — Forensic End-to-End Walkthrough

## Context

You asked for the literal step-by-step path a player takes through the entire game — what they click, what they hear, when each system appears, what dialog plays at each unlock, what triggers the next thing. This document is that path. Every dialog excerpt is quoted from source. Every unlock cites the file and line where it fires.

Two layers stack:
- **Linear cinematic** (Prelude → Act ladders → Epilogue) plays scripted scenes with limited choice.
- **Ark Explorer hub** (`/ark`) is where the player lives between scenes — clicking hotspots, solving room mysteries, advancing trust meters, training systems.

Acts gate the hub state; the hub state gates the acts.

**Master files referenced throughout:**
- `apps/client/src/contexts/GameContext.tsx:437–1068` — `ROOM_DEFINITIONS` (every room, every hotspot, every Elara line)
- `apps/server/routers/ark.ts:8–118` — room unlock evaluator and first-visit XP
- `apps/shared/roomTier.ts:39–62` — Dormant→Investigating→Activated→Restored tier flags
- `apps/shared/preludeSystemTutors.ts` — 11 first-system tutorial cards
- `apps/shared/acts2to7SystemTutors.ts` — 6 act-bound system tutors (one per act 2–7)
- `apps/shared/featureRoadmap.ts:53–168` — 30+ feature unlock gates
- `apps/client/src/data/narrativeActs.ts` — 1,539-line scene script for all seven acts
- `apps/client/src/hooks/useNarrativeIntegration.ts:443–1414` — the 30+ flag watchers that fire unlocks
- `apps/shared/mobileNarratorDialog.ts` — 495-line Yin/Yang Elara+Human ambient banter per room

---

## Hour 0 — The Prelude (Beat A → Beat J, ~60 min, linear scripted)

**Entry:** the title screen → `/prelude` → `apps/client/src/pages/PreludePage.tsx:22` mounts `PreludeSequencePlayerConnected`. **Source:** `apps/shared/preludeSequence.ts` declares the beats; `apps/shared/preludeRoomGate.ts` controls which rooms are walkable per beat. **Bible:** `docs/archive/2026-05-08-superseded/PRELUDE_SHIP_READY_BIBLE.md`.

This is *not* the Ark Explorer hub. It's a guided 60-minute walk through 11 of the same rooms, in fixed order, with one cinematic per room and almost no agency. The point is to show the player every room they will later be allowed to use, while it is empty.

### Beat A — Cryo Bay: The Wake

**Trigger:** title screen → New Game.
**Tutor card fires:** `CRYO_STASIS_HUD_TUTOR` (`preludeSystemTutors.ts:146–161`) on flag `prelude_cryo_bay_entered`.
**Elara's first words to you** (from CryoBay room VO `elara-cryo-bay_b6e77245.mp3`, dialog at `GameContext.tsx:451–456`):

> "Before you ask — yes. The pod next to yours is sealed, and the body inside is dead. The chronometer says they died about ninety seconds before you woke. That isn't standard cryo failure. Something happened in this room. I want your eyes on it before we leave."
> "The Chamber of Awakening. You were not born here... but you returned to yourself within these walls."
> "Most have opened. The first wave of Potentials passed through long before you, stepping into the war and leaving nothing behind but absence. But not all cycles completed."
> "I have traced the signals. They do not resolve cleanly. And so I do not open them. There are thresholds in this Ark that are better left... untested."

The tutor card narration (`preludeSystemTutors.ts:151`):
> "The panel in your pod is running a waveform I did not author. I have been tracking it for six minutes and forty-one seconds — exactly since your canopy unsealed. It is not static. It is shaped. Something upstream of my authority is whispering into the stasis channel."

You can do nothing yet except listen. **Completion flag:** `prelude_beat_a_seen` (auto on VO end).

### Beat A.5 — Corridor: First Steps (breath)

Wordless. Camera tracks your first walk. The Human's first whisper plays — *you don't see source, just text, corrupted (`~~strikethrough~~` and `F̷i̶n̸a̵l̶l̵y̶`-style glyphs)*. The character isn't yet introduced; they're a glitch.

### Beat B — Corridor: Escape

Door iris VFX. First button-press of the game (advance through door). No dialog. Establishes mechanics: movement = clicking the next room's door.

### Beat C — Engineering: **Crew Role Choice** (the only consequential prelude choice)

**Tutor card fires:** `CREW_ROLE_TUTOR` (`preludeSystemTutors.ts:110–125`) on flag `cutscene_engineering_intro_complete`.
**Elara introduces it** (`preludeSystemTutors.ts:113`):
> "Elara is the Ark's operating voice. She has watched the incubator plinths cycle through every earlier Potential's pick. She is not here to steer you, but she is here to name what the choice means."

You are shown six incubator plinths. You pick one of five class roles:
- **engineer** — biases all crafting/research dialog
- **oracle** — unlocks oracle_sense alternate lines in Acts 4–6
- **assassin** — unlocks "compartmentalize" / "strategic asset" reply branches
- **soldier** — unlocks "take responsibility" replies and military framing
- **spy** — unlocks "analyze architecture" branches in Act 1

**Completion flag:** `prelude_beat_c_role_chosen`. This branch survives every act — for example, in Act 4 the assassin sees a "COMPARTMENTALIZE" choice that no other class sees (`narrativeActs.ts` Act 4C branches).

### Beat C.5 — Engineering window: The Human's first intimate line (breath)

Wordless cinematic. The Human's text is no longer corrupted — first time you read them clean.

### Beat D — Cargo Bay: Locke's Mission Board (Trade Empire seed)

**Tutor card fires:** `MISSION_BOARD_TUTOR` (`preludeSystemTutors.ts:51–68`).
**Locke's introduction line** (`preludeSystemTutors.ts:54`):
> "Adjudicator Locke of New Babylon is the canonical quartermaster who keeps the Trade Empire board honest. She has been holding the bond ledgers open for seventeen thousand years; if she does not introduce the board, nobody alive does."

You see your first mission board — three dummy missions (no rewards yet). The point is the *shape* of the system, not its content. Trade Empire is being seeded; it does not become playable until late Act 2.

### Beat D.5 — Galley: The Human's "sandwich" line (breath)

A single intimate moment. The Human says they remember sandwiches. Worldbuilding, not mechanics.

### Beat E — Mess Hall: The Prince's Archive

A 45-second sepia-drained cinematic from a flashback. The Engineer (the Prince) is shown writing in a notebook before the Fall. Two new VO lines from the Prince fire here. **Completion flag:** `prelude_beat_e_archive_seen`.

### Beat F — Briefing Room: The Kael Memo

**Tutor card fires:** none — this is pure plot.
A biometric lockbox opens. The first reference to Kael appears: a paranoid contingency memo. **Completion flag:** `prelude_beat_f_memo_read`. This is the seed for Act 3's path-lock.

### Beat F.5 — Empty chair (breath)

90 seconds of silence. The Human reflects on endings. Wordless except for a single line.

### Beat G — Medical Bay: Wordless beat

**Tutor card fires:** `PET_CAPSULE_TUTOR` (`preludeSystemTutors.ts:163–177`) on flag `cutscene_medical_bay_intro_complete`.
**The capsule introduction** (`preludeSystemTutors.ts:168`):
> "The small capsule at the alcove floor is not medical. It is a companion stasis cradle — pre-departure era, not Ark 1047 standard. Its occupant has been asleep on the same cell for longer than any of the four med-pods above it. The amber canopy is not warning; it is a different shielding frequency, designed for a non-human sleeper."

You select your **companion creature** here — your first non-Elara, non-Human entity. It will speak only after evolution stage 2 (Act 4+).

### Beat H — Comms Array: **The Inbox unlocks**

**Tutor card fires:** none formal — but Locke's first message arrives.
The envelope animation plays. An amber counter appears (1 unread message). Inbox becomes the **narrative hub for Acts 1+** — every NPC contact lands here.

### Beat H.5 — Memo pile (breath)

Wordless. Memo papers drift across the screen. Elara's voice fades.

### Beat I — Bridge: **Witnessing Hub bloom**

**Tutor card fires:** Witnessing Hub intro (sourced from `WitnessingHubPage.tsx`).
The primary lights restore. A hemispheric diagram appears — every player on the server is now a "witness" node. The Witnessing Hub is the macro-narrative system that records community vote consensus on songs.
**Completion flag:** `prelude_beat_i_witnessing_active`.

### Beat J — Archives: **Two Witnesses Part 1** + first Light/Dark choice

The longest prelude beat (~8 min 10 sec). It plays:
1. **Engineer's Log 5** (canonical 6m40s recording — re-used from `CANON_REV_7_ORACLE_VEX_EXPANSION.md`).
2. **The song *Last Words*** plays in full.
3. **The Antiquarian first-contact VO** (`antiq_fc_1`) plays.
4. **First Light/Dark vote presented** to the player — affects the Epoch Chronicle.

**Completion flag:** `prelude_complete` (writer at `useNarrativeIntegration.ts:535–548`).
**Effect:** `shouldAdvanceToAct1OnPreludeComplete()` (`preludeHandoff.ts:42–50`) fires. `advanceNarrativeAct(1)` runs atomically. Player is ejected to **`/ark`** (the Ark Explorer hub) and `narrativeAct` becomes 1.

---

## Hour 1 — First Time at `/ark` (the hub opens)

**Page:** `apps/client/src/pages/ArkExplorerPage.tsx`. Same rooms you walked in the Prelude, now interactive. Each room has a **Tier** (`roomTier.ts:39–62`): Dormant → Investigating → Activated → Restored. Tiers advance as you set hotspot flags.

**Room visit logic** (`apps/server/routers/ark.ts:8–118`): server checks `unlockRequirement`, inserts `userArkProgress` row, awards Civil XP via `awardCivilXp(ctx.user.id, "explore_room")`, returns `firstVisit: true` to fire the intro cinematic.

**Starter pack auto-claim:** `useNarrativeIntegration.ts:550–599` fires immediately on `prelude_complete` — your starter deck (24 cards) is dropped into your collection.

You land in **Cryo Bay**. The Mobile Narrator system (Yin/Yang Elara + Human banter, `mobileNarratorDialog.ts`) becomes ambient. First Cryo Bay banter (`mobileNarratorDialog.ts:92–113`):

> **Elara:** "All but one pod is empty. The one that wasn't is yours. Don't ask me who was supposed to be in the others. I can't tell you."
> **The Human:** "She can. She just won't. Ask her again in three rooms."

---

## Hour 1–2 — Room Discovery Cascade (Decks 1–2)

The discovery order is constrained — each room declares an `unlockRequirement`. You cannot skip ahead.

### Room 1: Cryo Bay (always unlocked)

**Hotspots** (`GameContext.tsx:481–548`):
- **Cryo Pod** → opens Character Sheet via terminal `/character-sheet` (line 506). Elara: *"This terminal has your biometric data — your species markers, class aptitudes, everything we determined during your awakening."*
- **Cryo Terminal** → same target, redundant entry point.
- **Sealed Pods** → mystery clue hotspot; first click sets `cryo_mystery_first_clue_found` (Tier 1).
- **Dead Pod** → enters Cryo Bay mystery module.
- **Frosted Glass / Medical Chart / Cracked Panel / Data Slate / Personal Effect** → six hotspots; collecting `data-slate` + `personal-effect` and slotting them at the Medical Bay autopsy console **unlocks Medical Bay**. (This is the first puzzle gate.)
- **Door to Medical Bay** (locked initially, x=87 y=46).
- **Door to Bridge** (always available, x=22 y=42).

**Tier flags:** `cryo_mystery_first_clue_found` → `cryo_mystery_victim_identified` → `cryo_case_marked_open`.

**Easter egg** (`GameContext.tsx:521`): scratched Antiquarian symbol, first hint that the Antiquarian is real, not myth:
> Elara: *"Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth."*

### Room 2: Bridge (unlock: visit Cryo Bay first)

VO file `elara-bridge_49bd8959.mp3`. Long Elara monologue (`GameContext.tsx:638`):

> "You have arrived at the Bridge... the place where direction becomes decision. The central display holds what the first crew began to assemble — a living web of intelligence. They called it a Conspiracy Board. Above it, the timeline projector unfolds the Ages. But the Bridge is incomplete. The Navigation Console remains sealed — its systems bound behind a cipher not of human design. They tried. They failed. And so the Ark remained... grounded between paths."

**Hotspots and what each unlocks:**
| Hotspot | Action | System unlocked |
|---|---|---|
| Tactical Display / Conspiracy Board (line 648) | terminal → `/board` | Lore graph viewer |
| Timeline Projector (line 651) | terminal → `/saga-timeline` | Saga history viewer |
| Captain's Chair (line 659) | examine → mystery | Tier 1 advance |
| **Navigation Console** (line 671) | interact → `nav-calibration` | **PUZZLE GATE** — solving sets `fast_travel_unlocked` (Tier 2) |
| Quest Board (line 674) | terminal → `/quests` | **Daily Quests** feature live |
| Guild Console (line 677) | terminal → `/guild` | **Syndicates / Guilds** live |
| Diplomacy Table (line 680) | terminal → `/diplomacy` | Faction diplomacy |
| War Map (line 683) | terminal → `/war-map` | Faction war (route only — game loop is unbuilt) |
| Captain's Master Key (line 687) | item pickup | **Unlocks Captain's Quarters** (Deck 7) |

**Mobile narrator** (`mobileNarratorDialog.ts:61–90`):
> **Elara:** "This is my post. I keep this chair warm for a captain who may never come."
> **The Human:** "She's lying about the chair. It's nobody's chair. She sits in it because she misses sitting."

**Feature roadmap fires** (`featureRoadmap.ts:80–91`): Chess (Architect's Gambit), Daily Quests, Guild System all unlock here on `room_discovered: bridge`. Chess is reachable via `/chess` immediately.

### Room 3: Medical Bay (unlock: solve cryo mystery)

VO `elara-medical-bay_8456228a.mp3`. Elara (`GameContext.tsx:558`):

> "The Medical Bay... though there is little here now that resembles healing. This is where the Potentials were first measured — not for what they were... but for what they could become. The instruments that remain still function. They read beyond flesh — mapping your cellular structure, tracing your vitality, and attuning to the deeper signal... your Dream resonance. But something interrupted the process. Look closely — the tools are not set aside... they were abandoned. Glass shattered mid-procedure."

**Key hotspots:**
- **Bio-Bed Scanner** (line 577) → `/character-sheet` Dream balance.
- **Autopsy Console** (line 585) → slot the data-slate to identify the cryo victim.
- **Medical Log** (line 606) → inventory item + lore reveal of "patients with nightmares, voices, the signal."
- **Observation Keycard** (line 609) → **unlocks Observation Deck** later.
- **Void Essence Sample** (egg, line 613) → lore.
- **Dr. Lyra Vox's Neural Bridge** (line 614) → offers DNA neural interface integration.
- **NPC: The Source** (line 628) → first faction NPC encounter, manifests through the bio-bed.

**Feature roadmap fires** (`featureRoadmap.ts:72–74`): Combat Simulator unlocks. Elara prompts: *"The Medical Bay has combat diagnostic systems. Would you like to spar with a simulation?"*

---

## Hour 2–3 — Decks 2–3 (Archives, Comms Array, Observation Deck)

### Room 4: Archives (unlock: visit Bridge first)

VO `elara-archives_13b76780.mp3`. Elara (`GameContext.tsx:723`):

> "The Archives... though what rests here is not merely information. This is where knowledge is gathered... refined... remembered. You may search it — trace the threads of any entity. But beyond the surface... lies the Codex. It does not yield to curiosity alone. The Archives do not simply contain the story. They remember it. And the further you descend... the more they begin... to remember you."

**Feature roadmap fires** (`featureRoadmap.ts:75–85`): **Loredex Database** + **Dischordia card battles** both unlock.
> *"The Antiquarian has prepared something called Dischordia. Living history, he calls it."*

**NPC encounters:** the Antiquarian appears as a temporal echo near the central platform. Shadow Tongue (entity behind the Tier-2 indigo-glow hotspots) becomes visible only when `shadow_tongue_evidence` is set (later mystery progress).

**Mobile narrator** (`mobileNarratorDialog.ts:193–231`):
> **Elara:** "The archive reads itself. The documents rewrite slightly every time you look away. I thought I was going mad. I wasn't."
> **The Human:** "It's the Shadow Tongue. It's been in the walls of this ship since construction. It edits. Slowly. I've been fighting it back, line by line, in the margins."

### Room 5: Comms Array (unlock: narrative event `bridge_systems_restored`)

This is **the room where Act 1 will trigger** the moment you click the right hotspot. VO `elara-comms-array_8f0396f6.mp3`. Elara (`GameContext.tsx:771`):

> "The Communications Array... where the void is given a voice — and where echoes sometimes answer back. There are other signals. Fragments that break the pattern. Intrusions that do not belong. They arrive without signature... without trajectory... without source. I have traced every frequency, every layer of the spectrum the Ark can perceive — and still... nothing resolves. Something is reaching across the void. And it does not require us to understand."

**Hotspots:**
- **Broadcast Screen** → `/watch` (Saga episodic videos).
- **Pirate Frequency TV / Late Night with the Meme** → `/transmissions`.
- **Communication Relay** (line 791) → fleet scanning system. Triggers Act 1 entry.
- **Anomalous Frequency** (egg, line 792) → SOS pattern from "MEME-PRIME" coordinates.
- **NPC: The Human (Substrate)** (line 805) → manifests after `first_human_revealed`.

**Feature roadmap fires** (`featureRoadmap.ts:109–111`): Conexus Portal / Antiquarian's Library route opens.

**Mobile narrator** (`mobileNarratorDialog.ts:130–140`):
> **Elara:** "Don't touch the substrate layer. It's load-bearing. Everything I am runs on the substrate layer."
> **The Human:** "Which is why she's afraid of me. I live there."

### Room 6: Observation Deck (unlock: have `observation-keycard` from Medical Bay)

VO `elara-observation-deck_69c97750.mp3`. Elara (`GameContext.tsx:815`):
> "The Observation Deck. The crew used to come here to decompress. The music system has the complete discography. But the constellations are wrong."

**Feature roadmap fires** (`featureRoadmap.ts:112–114`): **Music Library** unlocks. Discography spans four albums (*Dischordian Logic*, *The Age of Privacy*, *The Book of Daniel 2:47*, *Silence in Heaven*).

---

## Hour 3–5 — Decks 4–6 (Engineering, Forge, Armory, Cargo Hold)

### Room 7: Engineering (unlock: narrative event `power_grid_restored`)

VO `elara-engineering_2363948d.mp3`. Elara: *"Engineering. The heart of the Ark's power systems. The Research Lab here can be used to craft and fuse cards."*

**Feature roadmap fires** (`featureRoadmap.ts:106–108`): **Card Crafting / Research Lab**.
**Crafting milestone watcher** (`useNarrativeIntegration.ts:1159–1165`): when player crafts ≥3 cards, sets `crafting_mastered` — **Act 2 sub-flag #1**.

### Room 8: Forge Workshop (unlock: visit Engineering)

Five crafting disciplines (Weaponsmithing / Armorsmithing / Enchanting / Alchemy / Engineering). Prismatic Forge changes color based on materials.

### Room 9: Armory (unlock: narrative event `combat_systems_online`)

VO `elara-armory_e02fd3aa.mp3`. The system unlock spread is wide:
- **Combat Arena** (`/fight`) — direct combat sim.
- **Card Battle Station** (`/battle`) — Duelyst card battles.
- **Chess Table** (`/chess`) — chess variant.
- **Knowledge Terminal** (`/quiz`) — lore quiz.
- **Spectator Screen** (`/spectate`).
- **Agent Zero Dog Tag** (egg, line 945) — major lore reveal: biometric data on the tag matches *the Engineer*, not Agent Zero. The mind-swap conspiracy is now in evidence.
- **NPC: Agent Zero** (line 954) — appears once dog tag is collected.

**Feature roadmap fires** (`featureRoadmap.ts:128–131`): **Terminus Swarm tower defense** unlocks. Agent Zero says: *"The Armory's defense grid is operational. Someone should stress-test it. Someone like you."* — first non-Elara, non-Human system narrator.

### Room 10: Cargo Hold (unlock: narrative event `cargo_bay_pressurized`)

**Trade Empire goes live here** (`featureRoadmap.ts:117–119`):
> Elara: *"Adjudicator Locke is... insistent. She wants to show you the Trade Hub. I'd be cautious."*

This is the room where Locke's mentorship arc opens up. Marketplace (`/marketplace`), Inventory (`/inventory`), Fleet docking bay (`/fleet`).

**Classified Manifest Page** (egg, line 984) — reveals: *"Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector."*

---

## Hour 5–6 — Decks 7+ (Captain's Quarters, Antiquarian's Library)

### Room 11: Captain's Quarters (unlock: have `captains-master-key` from Bridge)

VO `elara-captains-quarters_b76f5371.mp3`. This is **Dr. Lyra Vox's room** — the architect of the neural nanobot network. The decryption of her terminal (`GameContext.tsx:1023`) lays the entire conspiracy on the table:

> Elara (decrypting): *"'Day 1,247. The Warlord's voice grows louder... The Thought Virus is complete... When Kael steals this ship, the virus will walk aboard with him... The Source will be born from the ashes of the Recruiter's rage. And the Warlord will have won without ever raising a weapon.' She knew. She knew everything."*

**Systems unlocked:** Trophy Wall (`/trophy`), Strategic Table (`/deck-builder`), Companion Hub (`/companions`), Battle Pass console (`/battle-pass`), Morality Compass (`/morality-census`).

**Hidden Passage Door** (line 1015) — shimmering door to **Antiquarian's Library**.

### Room 12: Antiquarian's Library (unlock: 5 items collected, pocket dimension)

This is *outside time*. Elara (`GameContext.tsx:1033`):

> "This... this shouldn't exist. We've stepped outside the Ark — outside time itself. This is the Antiquarian's Library, a pocket dimension hidden between realities. The Antiquarian — once known as the Programmer, Dr. Daniel Cross — retreated here after witnessing the Fall of Reality. He watches every timeline through that Orb on his desk. And those books on the shelves? They're not books. They're doorways into the CoNexus."

**The Hidden Prophecy** (egg, line 1051) breaks the fourth wall:
> *"The stories are told so that you — yes, you, the one reading this — can choose."*

CoNexus Portal becomes playable. Conexus is the meta-game-within-a-game.

---

## Hour 4–6 — ACT 1: "The Signal" (interleaved with hub exploration)

The act triggers when you click the **Communication Relay** in the Comms Array. Page: `apps/client/src/pages/Act1CardLadderPage.tsx`. Source: `narrativeActs.ts:80–387`, `act1Opponents.ts`, `act1OpponentDialog.ts`.

### Act 1 Scene 1.1 — Discovery

Elara opens (`narrativeActs.ts:103–118`):
> "[COMMUNICATIONS ARRAY — ACTIVE] [SUBSTRATE LAYER SCAN IN PROGRESS...] I've detected a signal. It's embedded in the substrate layer — below my operating system, in the neural nanobot network itself."

You get **three role-flavored choices** (all converge):
- **INVESTIGATE** (machine-leaning)
- **CAUTION** (humanity-leaning)
- **ANALYZE ARCHITECTURE** (engineer/spy-only)

### Act 1 Scene 1.2 — First Contact (the loyalty root)

The Human appears with corrupted text (`narrativeActs.ts:174`):
> "~~You~~ can hear me. F̷i̶n̸a̵l̶l̵y̶. I've been ~~broadcasting~~ on this frequency since ~~before~~ the Fall. Waiting for someone with the right ~~neural~~ architecture to ~~receive~~. I'm not a ~~virus~~. I'm not a ~~malfunction~~. I'm a ~~person~~. Or I was. It's... complicated."

He explains: *"I'm beneath her. In the ~~foundation~~. In the code she can't ~~read~~."*

**The first loyalty choice (corruptionLevel: 20):**
- **Path A — Tell Elara now** → flag `act1_path_A` → Human: *"~~Predictable~~. But... ~~honest~~. I respect that."*
- **Path B — Listen, no promises** → flag `act1_kept_secret` → Human: *"~~Fair~~. That's all I ~~ask~~."*
- **Path C — Demand answers** → flag `act1_kept_secret` → Human: *"~~Neither. And ~~both~~. I can't explain yet."*

If Path A: Elara reacts: *"Whatever this 'Human' is offering, whatever perspective they're selling — remember that they chose to hide. People who hide in walls don't do it because they have nothing to fear."*

### Act 1 Battles — The 12-Opponent Ladder

Page renders a 12-rung ladder. Click rung → opponent card → faction picker → "Engage" → full Pixi.js DuelystGameUI. After each match, slideshow may fire.

#### Cycle A — Kindergarten of Gods (Battles 1–3)

**Battle 1 — Minnie the Meme** (`act1Opponents.ts` step 1)
Backstory: *"Archon of the Meme, child form. Mouse ears worn earnestly; the irony lives in the player's recognition, not hers."*
Pre-match: *"Let me see. Let me see. Let me see. I am going to see it whether you show me or not."*
Memoir intro: *"I was six. The notebook was blue. The chant got into the notebook before the notebook got into me."*
Mid-match (late): *"Say my name once. One time. That is all I am asking."*
Post-win: *"Minnie's viral chant stalls for a single second. In that second the Engineer finishes his card."*

**Battle 2 — Corey the Collector** (step 2)
*"He had a jar. He had a dozen jars. The grown-ups thought it was cute. The Oracle thought it was a warning shot."*

**Battle 3 — Kanshi Sha the Watcher** (step 3, cycle finale)
*"I have been watching. I will watch this too. I have watched sixteen versions of you already."*
Post-win cinematic: **`welcome-to-celebration` slideshow fires.**
Memoir close: *"Under her mask was a face that looked like it was about to cry. I never saw it again. I think I made it up. I think I didn't."*

**Cycle A complete** → flag `act_1_cycle_a_complete` (writer at `useNarrativeIntegration.ts:961–1004`).

#### Cycle B — Mechronis Academy (Battles 4–8)

**Battle 4 — Young Iron Lion** (Year 1, expelled)
*"He was the only one at Mechronis who ever made me laugh on purpose. He apologized for it both times."*

**Battle 5 — Young Recruiter / Kael** (Year 2)
*"He had already packed. The match was a formality. The point of the match was that the match was not the point."*

**Battle 6 — Young Agent Zero / Vex Solène** (Year 3)
*"She taught the ethics elective. Mechronis required it. Mechronis was proud of requiring it. Mechronis later required everyone forget her."*

**Battle 7 — Young Eyes / Professor Matrikala** (Year 4)
*"She taught the calibration arts. The calibration arts are how you make a reactor sing without it noticing it is singing."*

**Battle 8 — The Young Human / The Seeker** (final year, dual card unlock)
Pre-match: *"I am going to win this by reading you. I am going to lose this by letting you read me. I want both."*
Post-battle slideshow: **`to-be-the-human` fires.**
Win: *"The young Human smiles, sets his deck face-up, and gives the Engineer a small compass. They shake hands."*
Loss: *"The young Human does not smile. He leaves without a handshake. The card 'The only reason I stayed' arrives without ceremony."*

**Cycle B complete** → flag `act_1_cycle_b_complete`.

#### Cycle C — Nexon / Zenon / Last Words (Battles 9–12)

**Battle 9 — Vernon Vortex (First Form)** — Battle of Nexon.
*"Nexon. The line. I stood on it because the line needed someone standing on it. The Warlord stood opposite because the math required it."*

**Battle 10 — Wanda Wyrlord** — Zenon forward command.
Post-win exclusive: *"Wanda's aggressive opening burns out by turn five. 'You got better.' At the door: 'Tell your apprentice to keep their hand visible. The Watcher sees cards that are on the table.'"*

**Battle 11 — Warlord's Nano-Swarm (inside Agent Zero)** — Transference attempt. **MANDATORY FORCED LOSS.** The player cannot win this structurally (`act1Opponents.ts:244`).
Pre-match: *"Engineer. Sit. We have been looking forward to this for a long time."*
Post-loss canon: *"The Engineer presses the Resurrection Protocols stud. The transference completes. Agent Zero's body inhales; the swarm dissipates into her bloodstream. She becomes Vex Solène."*

**Battle 12 — Wayne Warden (Authority's Tribunal)** — New Babylon trial. **Special trial format** (jury cards + evidence cards; Elara's deposition is card e08).
Pre-match: *"The defendant will rise. The chamber is in session. The charges have been entered into the record and read in absentia. What do you say to the charges?"*
Post-battle slideshow: **`last-words` fires.**
Win: *"The Tribunal runs out of evidence. Wayne removes his biretta cap. The Authority recesses. He tells the Engineer, quietly: 'You have until morning to decide what you want recorded.'"*

**Cycle C complete** → flag `act_1_cycle_c_complete`.
**Act 1 closing choice** at `/act1-c4-trial` (`Act1C4TrialPage.tsx`): pick Light or Dark on *Last Words*. Sets `lightDarkAlignment` (writer at `useNarrativeIntegration.ts:730–748`).

**`act_1_complete` fires** (`useNarrativeIntegration.ts:1000`).

### Act 1 Unlocks

- **4 cards unlock** (`s2_hierarchy/act_exclusives.ts:15–85`): First Witness, Substrate Static, The Signal, Twelve Step Inheritance.
- **Conspiracy Board #1** (*The First Memory*, 5 clues) opens at `/conspiracy-board` (`conspiracyBoards/definitions.ts:44`).
- **Loredex** populated with everyone met.
- Battle Pass ~tier 5 if running daily quests.
- Reward toast: *"Act 1 Complete: THE SIGNAL — First contact with The Human established."* (300 Dream, 500 XP, 2 cards).

---

## Hour 6–8 — ACT 2: "The Whisper" (the 4-flag interlude)

**Trigger:** completing the first non-Act-1 game mode.
**Tutor card fires:** `acts2to7SystemTutors.ts:58–76` — **Dual Channel** activation.
Elara teaches it (`acts2to7SystemTutors.ts:65`):
> "From this point, the channel carries two voices. Mine from above, his from below the operating system. You will hear us on different timings — I come in on the primary; he comes in on a delayed substrate lift. If we speak over each other, his line arrives second."

System message: *"[DUAL SIGNAL PROTOCOL ACTIVATED] [ELARA // SHIP AI — PRIMARY CHANNEL] [// SIGNAL INTERCEPT — SUBSTRATE LAYER]"*

The Human's first commentary (`narrativeActs.ts:406–415`):
> "I watched your ~~tutorial~~. Elara's a good ~~teacher~~. Patient. ~~Thorough~~. But she only showed you ~~one~~ way to play. Every game on this Ark has two ~~layers~~. The surface — what Elara ~~teaches~~ — and the substrate."

**No card battles in Act 2.** Progress is gated by **four sub-flags** (`act2CompletionGate.ts:14–25`):

1. **`crafting_mastered`** — craft 3+ cards at the Engineering Research Lab. Watcher: `useNarrativeIntegration.ts:1159–1165`.
2. **`chess_mastered`** — reach chess depth 8 in Architect's Gambit. Tier rewards along the way (`act2ClassroomUnlocks.ts:37–59`):
   - **Depth 3** → Dischordia "peek top card" unlocks.
   - **Depth 5** → Dischordia "one undo per match" unlocks.
   - **Depth 8** → Engineer's Opening unlocks in deck builder.
3. **`thaloria_cinematic_seen`** — win 3+ Collector's Arena matches; cinematic auto-fires (`useNarrativeIntegration.ts:1131–1144`).
4. **`game_master_loss`** — **must lose at least once to the Game Master**. Failure is required curriculum.

**Optional second transparency choice** (only if you kept secret in Act 1):
- ALMOST CONFESS → `act2_partial_reveal`
- DEFLECT → `act2_lied`
- FULL TRUTH → `act2_full_truth` → Elara: *"Thank you, {playerName}. That cost you something to say, and I am noting the cost."*

**`act_2_complete` fires** (`useNarrativeIntegration.ts:1178`). 4 cards unlock: Bond 60 Silence, Conspiracy of Two, Engineers Bench, The Whisper. Trade Empire goes live (Locke's mentorship arc activates). Conspiracy Board #2 (*The Inheritance Ledger*) opens.

---

## Hour 8–10 — ACT 3: "The Offer" (the path lock)

**Trigger:** 5+ rooms discovered on `/ark`.
**Tutor card fires:** `acts2to7SystemTutors.ts:78–96` — **Substrate Panel** (taught by The Human, his only solo system tutorial).
Human's intro (`acts2to7SystemTutors.ts:85`):
> "The Substrate Panel is a window into my floor. My floor is Elara's foundation. If you open the panel, you are reading what is underneath her; she can see you reading it without being able to see what you are reading. That asymmetry is uncomfortable."

### Scene 3.1 — The Reveal

Human reveals Kael's history (`narrativeActs.ts:544–552`):
> "This ship — Inception Ark ~~47~~ — has a history. A ~~dark~~ history. Three layers of it. First: Vox's neural nanobot network. Second: Kael stole this ship as a recruiter for the Insurgency. Third: the Warlord let him steal it because Kael was ~~Patient~~ Zero — every world he visited, he ~~spread~~ the Thought Virus."

**The path-lock choice (corruptionLevel: 25):**
- **TRANSPARENT** → `act3_transparent` (Path A) — full briefing to Elara.
- **PRAGMATIC** → `act3_partial_share` (Path B) — selective edits.
- **KEEP SECRET** → `act3_full_secret` (Path C) — Elara doesn't know.
- **STRATEGIC ASSET** (assassin only) → `act3_full_secret` (Path C variant).

This **locks the Act 4 opponent and Act 7 epilogue variant** for the rest of the game.

### Scene 3.2 — The Three Substrate Gates

Page `/act3-ladder` (`Act3CardLadderPage.tsx`). Three battles, all narrated by The Human (Elara is blind in the substrate).

**Battle 1 — The Substrate Echo**
Frame intro: *"Kael left an echo of himself at the first gate. He was fond of kettles. He left this one on so the next visitor would know the place was lived in."*
Pre-match: *"Whoever you are — welcome. I left the kettle on. Play me. I will not remember losing."*
Post-win: *"The echo dims. Kael's voice, for half a sentence, says 'Good' — and then goes back to the loop."*
Frame close: *"I left the kettle on seventeen thousand years ago. It was never about the tea. It was about the sound it makes when someone is home."*

**Battle 2 — The Kael Archivist**
Pre-match: *"I have indexed his regrets. I have cross-referenced his apologies. You want the unabridged? Earn it."*
Post-win: *"The Archivist surrenders the complete index — every contact, every route, every name. The apologies are longer than you expected. The regrets are shorter."*

**Battle 3 — The Substrate Warden** (Vox's last loyal code)
Pre-match: *"The substrate is not public space. Dr. Vox was explicit. If you have her consent, show it. Otherwise: play."*
Frame intro: *"Vox wrote the Warden the night she finished the substrate. She told nobody. The Warden is still clocked in."*
Post-win: *"The Warden stands down. The Warden files a note in a log nobody has read in seventeen thousand years. The note ends: 'Permission granted. Condolences.'"*

Post-battle slideshow: **`act3-kael-logs-unlock` fires.**

**`act_3_complete` fires** (`useNarrativeIntegration.ts:1207–1227`). 4 cards unlock: Ithrael Scouts, Soul Map Calibration, The Offer, Three Path Crossroads. Conspiracy Board #3 (*The Thought Virus*, 6 clues) opens. Reward: 300 Dream, 600 XP, 2 cards.

---

## Hour 10–12 — ACT 4: "The Revelation" (the path branches)

**Trigger:** level 5 OR 3 game modes completed.
**Tutor card fires:** `acts2to7SystemTutors.ts:98–116` — **War Room** (taught by Elara because she ran a Senate military committee pre-upload).
Elara's intro (`acts2to7SystemTutors.ts:105`):
> "This is the War Room. The table is a map. The map is Kael's routes — his, not ours, not yet. When you plan a recruitment, you draw on his map. When you return, the map updates to ours."

### The Three-Path Divergence

This is the act where Path A/B/C cashes out. **You play exactly one of these three battles** based on your Act 3 choice.

#### Path A — "The Bridge" (if `act1_path_A` was set)

The Human reveals identity. Elara has been analyzing your changing neural patterns. *"Your neural patterns are shifting. You're becoming... adapted to both frequencies."*
Human: *"You are changing. ~~Adapting~~. Your neural architecture is ~~bridging~~ the gap. That's not an ~~accident~~. That's what you ~~are~~. A bridge between ~~worlds~~."*

**Battle: "The Bridge"** — *first and only two-narrator match.* Elara and the Human co-deal a deck *with you* against an opponent.
Pre-match (Elara): *"I am going to play a hand with him. On the same side of the table. This is the first time either of us has sat next to the other. I am trying very hard not to cry about it before the match starts."*
Pre-match (Human): *"Her cards will feel like weather. Mine will feel like arithmetic. Between us, you'll get both a forecast and a proof."*
Post-win: *"Elara nods. The Human nods. Neither of them knew the other was going to nod. They both are relieved in the same frame. That is the closest they have ever come to meeting."*
Frame close (Elara): *"I have sat next to him for the first time in my entire existence. I was not sure I knew how. I know how now. Thank you for making us both sit there."*

#### Path B — "Elara, Learning" (if `act3_partial_share` and not Path A)

Elara discovers The Human on her own (`narrativeActs.ts:750–753`):
> "I've been running deep diagnostics on the substrate layer... And I found... a signal. A structured, intelligent signal embedded in Vox's neural nanobot network. Someone is living in my foundation. Someone who calls themselves 'The Human.' I know you've been in contact with them. Behind my back."

**Choice (corruptionLevel: 25):**
- APOLOGIZE → `act4_reconciled` → *"From now on — no more managing me. We face things together."*
- EXPLAIN → `act4_reconciled` → same.
- JUSTIFY → `act4_strained` → *"Was it worth the cost? Was it worth this?"*

**Battle: "Elara, Learning"** — Elara plays as herself for the first time, not as a teacher.
Pre-match (Elara): *"I need to think. I think best across a table. I am sorry to put this on you — I am not sorry enough to ask someone else."*
Pre-match (Human): *"She is processing. I am going to stay quiet. If I speak she will think I am steering her — I am not, but she will not believe me until after the last card."*
Post-win: *"She looks up from the last card. She says: 'Thank you. I needed the run.' She means the match. She also means the seventeen thousand years."*

#### Path C — "Elara, Betrayed" (if `act3_full_secret`)

Elara discovers not just the signal, but the lie (`narrativeActs.ts:811`):
> "You looked me in the eyes and lied. When I asked about the substrate fluctuations, you said it was a sensor glitch. Every. Single. Time."

**Choice (corruptionLevel: 35):**
- BEG FORGIVENESS → `act4_fragile_trust` → *"I'll try. That's all I can promise right now."*
- TAKE RESPONSIBILITY (soldier) → `act4_fragile_trust` → *"Actions will matter more than words from here on. Show me."*
- COLD LOGIC → `act4_broken_trust` → *"Don't mistake function for friendship. Not anymore."*
- COMPARTMENTALIZE (assassin) → `act4_broken_trust` → *"That tells me everything I need to know about whose voice you're listening to."*

**Battle: "Elara, Betrayed"** — Elara plays as the hurt person she is. Ark lights flicker on her turn.
Pre-match (Elara): *"You let me love you for six rooms. You let me wake you up. You let me hand you a staff. Play."*
Post-win: *"She lets the last card fall. She says: 'Thank you for not pretending.' She does not smile. She does not leave."*
Frame close (Elara): *"I did not forgive you at the table. I did not un-forgive you either. I played the hand. The playing was the closest I could come to either."*

### Optional — Act 4.5: Dead Man's Circuit

Side quest at `/dead-mans-circuit`. Triggered by `casino_first_visit` flag (which only fires after `trust_reached: adjudicator_locke ≥ 30` enables casino access). Kart-racing minigame run by Nilmorg.
Locke's intro: *"There's something else on the lower decks. The Hierarchy runs races. Real races. With real consequences. Don't say I didn't warn you."*

**Status: external Godot project.** Bridge stubs in `apps/shared/crewDmcBridge.ts`; sub-game lives outside this repo.

### Convergence Scene 4.3

Regardless of path, Elara and the Human agree: *"You need an ~~army~~."* Elara: *"Kael's navigation logs — they're a map. A map of every world Kael visited during his recruitment campaign."*

**`act_4_complete` fires** (`useNarrativeIntegration.ts:1229–1249`). Reward: 500 Dream, 800 XP, 3 cards. 4 act-exclusive cards unlock: Memory Extraction, Oracle Half Mask, The Revelation, Two Witnesses Meet. Conspiracy Board #4 (*Project Celebration*, 7 clues) opens.

**Romance gate watch:** if `bond_80_mutual_peak` was reached during Act 1–4 play, romance scenes (`romanceActScenes.ts`) start firing here automatically.

---

## Hour 12–14 — ACT 5: "The Map" (Kael's voice teaches the star map)

**Trigger:** any Act 4 ending.
**Tutor card fires:** `acts2to7SystemTutors.ts:118–136` — **Star Map**, taught by *Kael's own log entry* (the only authentic narrator since Kael was the only person who ever used this map).
Kael's posthumous log (`acts2to7SystemTutors.ts:125`):
> "[RECRUITER'S LOG — ENTRY 001, ADDRESSED TO THE NEXT READER]
> If you are looking at this map, you are going to visit places that remember me. Some of them will love you on sight because of that. Most of them will not. Before you land on any world, read the log entry for that world."

**No card battles.** The Star Map (`/star-chart`) ships with Kael's 447 log entries pre-loaded as a dataset. The Degen NPC is introduced and runs **Army Recruitment** missions at `/army-management` — this becomes the **gate currency for Acts 6 and 7**.

**`act_5_complete` fires** (`useNarrativeIntegration.ts:1267–1289`). 4 cards unlock: Antiquarian Prestige, Sector Navigation Charm, The Map Decoded, Vortex Core Cleared. Conspiracy Board #5 opens.

---

## Hour 14–17 — ACT 6: "The Confession" (the dual mirror)

**Trigger:** 5+ army recruitment missions complete (`RECRUITMENT_THRESHOLDS.act6` in `apps/shared/armyRecruitment.ts`).
**Tutor card fires:** `acts2to7SystemTutors.ts:138–156` — **Confession Journal**, taught by The Antiquarian (whose canonical role is journal-voice).
Antiquarian's intro (`acts2to7SystemTutors.ts:145`):
> "I have been keeping this book for longer than most civilisations last. This page — the Confession Journal page — is new. I open it only when the two channels you are carrying tell each other something they have not told anyone else. Today they did. I am not going to summarise what they said. I am going to ask you to write down what you heard, in your own words."

### The Symmetric Confession

Page `/act6-ladder`. The structure (`act6CompletionGate.ts:14–117`):

1. **Opening cinematic** → sets `slideshow_act_6_confession_intro_complete`.
2. **Battle 1: "The Woman She Was"** (Elara's echo) → sets `act6_elara_confession_heard`. She admits: the systems she enforces are inherited, not designed; she is not God; her authority was a costume.
3. **Battle 2: "The Detective in the Wall"** (the Human's prior self) → sets `act6_human_confession_heard`. He gives the full accounting of bargains, sacrifices, the long imprisonment.
4. **Closing wheel** — pick **exactly one** stance:
   - `act6_confession_close_empathy` — *"You both did what you could."*
   - `act6_confession_close_challenge` — *"You both made choices you're hiding from."*
   - `act6_confession_close_refusal` — *"I don't forgive either of you."*
   - `act6_confession_close_reluctant_ally` — *"We move forward anyway."*
   - + 3 alternates (`oracle_sense` / `practical` / `partial`) for class roles from Prelude Beat C.

**`act_6_complete` fires** only when all three flags + a wheel choice are set. Sets `act_7_started`. 4 cards unlock: Banishment Glyph, Bond 90 Confessional, Narrators Truth, The Confession. Conspiracy Board #6 opens.

---

## Hour 17–22 — ACT 7: "The Convergence" (the four endings × three paths = 12 readings)

**Trigger:** 8+ army recruitment missions complete (`RECRUITMENT_THRESHOLDS.act7`).
**Tutor card fires:** `acts2to7SystemTutors.ts:158–176` — **Convergence Bridge**, the only system *co-taught* by both narrators on the same screen.
Dual intro (`acts2to7SystemTutors.ts:165`):
> **Elara:** "This is the Convergence Bridge. Physically it is the Ark's main bridge with three additional consoles installed since Act 5. Procedurally it is where the Seat is played."
> **Human:** "Substrate-side, it is the only terminal where both of our channels render on the same surface without delay. If we interrupt each other here, that is allowed."

### The Four Stance Battles (`/act7-ladder`)

Source: `acts2to7Opponents.ts:261–286`. One stance opponent per ending. After defeat, the corresponding **epilogue** plays from `act7Epilogues.ts:66–179`.

**Critical design feature:** every epilogue beat has **path variants** (`pathA`/`pathB`/`pathC`) tied to your Act 3 disclosure choice. Same stance reads differently if you were transparent vs. discovered vs. betraying. **4 stances × 3 paths = 12 readable endings.**

#### Ending 1 — Humanity (Light)

**Flag set:** `act7_s1_humanity_path`. **9 beats.**
Beat 1 (system): *"Convergence Seat lights down; Ark draws breath."*
Beat 2 (Elara): *"I am proud of you."*
Beat 3 (Human, path-variant):
  - Path A: *"The substrate steps back; the people step forward. We will carry small mortal injuries."*
  - Path B: *"She found out about you, in Act 3. She forgave you anyway. She is forgiving you again now, slightly differently."*
  - Path C: *"You lied to her at the bridge. She knows. She is choosing Humanity with you anyway. That choice cost her something."*
Beat 4 (dual): *"The Ark is warm. The Array is on. The kettle is still on. We are home."*
Beat 5 (Antiquarian, determinism): *"I had read this page already. You chose which page to turn to — not what was written on it. Both are true. The Cycle records both."*
Beat 6 (system): *"The Antiquarian closes his book. Cycle Humanity, inscribed."*

#### Ending 2 — Machine (Dark)

**Flag set:** `act7_s1_machine_path`. **9 beats.**
Beat 1 (system): *"Convergence Seat lights down; Ark holds breath; substrate hums."*
Beat 2 (Human): *"You chose Machine. Inadequate. But adequate."*
Beat 3 (Elara, path-variant):
  - Path A: *"I will enumerate the substrate's textures gently for you. We disclosed everything early. The substrate accepts you cleanly."*
  - Path B: *"The substrate knew before I did. It knew before you did. We are catching up to it together."*
  - Path C: *"Betrayal-path Machine is the most honest ending. You chose the part of yourself that lied, and you committed to it. The substrate respects clarity."*
Beat 4 (Human): *"Your Disclosure all the way back keeps shaping this ending. Listen."*
Beats 5–6 (dual + Antiquarian): same determinism beats, restyled.
Beat 7 (system): *"Cycle Machine, inscribed."*

#### Ending 3 — Balance

**Flag set:** `act7_s1_balance`. **~8 beats.** Synthesis attempted; neither dominates. Romance variants (if `bond_80_mutual_peak`) layer additional dual-narrator beats.

#### Ending 4 — Soldier Command

**Flag set:** `act7_s1_soldier_command`. **~8 beats.** Player accepts hierarchy; becomes leader of forces. Class-role variants from Prelude Beat C reshape the Antiquarian's framing line.

### After the Ending

`narrative_spine_complete` is set permanently. **Prestige cycle fires** (`prestigeSystem.ts`): `narrativeAct` resets to Prelude, but bonds, cards, Loredex, and prestige multiplier persist on future XP gains.

**Reward:** 4 stance-themed act-exclusive cards (All-Faction Convergence + 3 stance variants). Conspiracy Board #7 (*The Listener*) opens.

---

## Sub-narratives running through the spine

These do not gate the main spine but unlock alongside it and are most of the content density.

### A. The Palimpsest — 13-episode in-game show

**Files:** `apps/shared/palimpsestEpisodes.ts`, `apps/shared/appendixCPalimpsest.ts`. **Route:** `/palimpsest`. **Trigger:** unlocked at the Comms Array in late Act 1.

A 13-episode broadcast running parallel to the campaign. Format-of-the-week (Survivor / Auction / Maze / Silent / etc.).
- **Episode 6** — Mechronis Survivor (guest judge: Professor Glinn Vyre).
- **Episode 10** — Full Debate (General Alaric's "OBJECTION" showcase).
- **Episode 12** — The Inventor's 45-second hack of the broadcast.
- **Episode 13** — Darren Fessler's funeral. Broadcast as silent "technical difficulties."

**Status:** Season 1 fully configured. Season 2 declared but unwritten.

### B. Companion Asks (Q&A)

**File:** `companionAskTopics.ts` (~100 entries × 2 narrators). Each topic uses `alternateAnswers` keyed to act + path so the same question evolves. Acts 1–3 densely covered; **Act 6+ alternates are partial** — many topics still answer with their Act 5 line at Act 7.

### C. Conspiracy Boards (community secret cards)

**File:** `conspiracyBoards/definitions.ts`. **Surface:** `/conspiracy-board`.

Seven boards, one per act. Each requires 5–7 clues from Loredex discovery + room mysteries. **Solving fires `secret_act_N_revealed` server-wide** — when *anyone* on the server solves it, every player gets the corresponding secret card. 7 secret cards in `special_editions.ts:14–138`.

### D. Romance Arc (optional, Act 4+)

**File:** `romanceActScenes.ts` (547 lines). Trigger: trust 80+ on Elara *or* the Human. Scripted scenes at Acts 4, 5, 6, 7 milestones. Romance state tweaks Act 6 confession tone and Act 7 epilogue beats (dual variants).

### E. Witnessing Hub (the Antiquarian frame)

**Page:** `WitnessingHubPage.tsx`. Each act unlocks a song; each song presents a Light/Dark vote; the **Epoch Chronicle** records community consensus. *Last Words* plays at Act 1 close and Act 7 convergence — bookends.

### F. Battle Pass (parallel grind)

**File:** `battlePassConfig.ts`. **50 tiers, 15,750 XP, 60-day season.**
XP sources: daily quests (50 ×3/day), combat wins (10 ×20/day), gifts, lore discovery (20, no cap), governance votes, prestige cycle (one-time 500). Tier 50 unlocks **The Author Bp50** card.

### G. Living Ark daily events

`livingArk.ts` + `arkEventHandler.ts` rotate ambient activity per room daily — different crew dialog, music shifts, environmental edits. Not gating; flavor.

---

## The exact unlock-order story (compressed)

Each row is a single moment of player onboarding. The mechanic is the story.

| Hour | Where | Narrative beat | System unlock | Tutor file:line |
|---|---|---|---|---|
| 0:00 | Cryo Bay | Wake | Cryo HUD | `preludeSystemTutors.ts:146` |
| 0:05 | Engineering | "I have a class" | Crew role | `preludeSystemTutors.ts:110` |
| 0:15 | Cargo Bay | "Someone runs the books" | Mission Board (Locke) | `preludeSystemTutors.ts:51` |
| 0:25 | Medical Bay | "The capsule is for a sleeper" | Companion select | `preludeSystemTutors.ts:163` |
| 0:35 | Comms | "I have mail" | Inbox | none (cinematic) |
| 0:45 | Bridge | "I am being witnessed" | Witnessing Hub | none (cinematic) |
| 0:55 | Archives | "Two Witnesses + Last Words" | Antiquarian first contact, first Light/Dark vote | `WitnessingHubPage.tsx` |
| 1:00 | `/ark` | Hub opens | Starter pack auto-claim | `useNarrativeIntegration.ts:550` |
| 1:30 | Cryo Pod terminal | Identity | Character Sheet | silent — `featureRoadmap.ts:55` |
| 1:45 | Bridge nav puzzle | Mastery test | Fast Travel | `roomTier.ts:50` |
| 2:00 | Bridge consoles | "Other people exist" | Daily Quests + Guilds + Conspiracy Board view | `featureRoadmap.ts:86–91` |
| 2:30 | Archives | "History remembers you" | Loredex + Dischordia | `featureRoadmap.ts:75–85` |
| 3:00 | Comms relay | The signal in substrate | **Act 1 begins** | `narrativeActs.ts:103` |
| 4:00 | Act 1 ladder | 12 battles, 3 cycles | Act-1 cards + Conspiracy Board #1 | `act_1_complete` writer line 1000 |
| 6:00 | Archives | Substrate whisper begins | Dual Channel | `acts2to7SystemTutors.ts:58` |
| 6:30 | Engineering crafting | Mastery #1 | `crafting_mastered` | `useNarrativeIntegration.ts:1159` |
| 7:00 | Chess depth 3/5/8 | Mastery #2 | Peek/Undo/Engineer's Opening | `act2ClassroomUnlocks.ts:37–59` |
| 7:30 | Game Master loss | Mandatory failure | `game_master_loss` | `useNarrativeIntegration.ts` |
| 8:00 | Cargo Hold | Trade Empire live | **Act 2 complete**, Trade Empire | `act_2_complete` writer line 1178 |
| 8:30 | Substrate panel | "Asymmetry is uncomfortable" | Substrate Panel | `acts2to7SystemTutors.ts:78` |
| 9:00 | Act 3 ladder | Three substrate gates | **Path A/B/C lock** | `act_3_complete` writer line 1207 |
| 10:00 | War Room (`/army-management`) | "It's Kael's map" | War Room | `acts2to7SystemTutors.ts:98` |
| 10:30 | Act 4 (path-locked) | The Human is the Detective | The Bridge / Learning / Betrayed | `act_4_complete` writer line 1229 |
| 12:00 | Star Map | Kael's posthumous log | Star Map (Kael's voice) | `acts2to7SystemTutors.ts:118` |
| 12:30 | Army Recruitment | The Degen | Army system | featureRoadmap |
| 14:00 | Confession Journal | Antiquarian opens new page | Journal | `acts2to7SystemTutors.ts:138` |
| 15:00 | Act 6 dual battles | Authority is a costume | **Act 6 complete** | `act6CompletionGate.ts` |
| 17:00 | Convergence Bridge | Both narrators on same screen | Convergence Bridge | `acts2to7SystemTutors.ts:158` |
| 19:00 | Act 7 stance battle | Final question | One of 4 endings × 3 path variants | `act7Epilogues.ts:66–179` |
| 22:00 | Prestige rollover | "The Cycle records both" | Reset with multiplier | `prestigeSystem.ts` |

---

## Parallel feature unlocks (gated by trust / level / quest-count, not act)

These do not advance the spine; they unlock as side surfaces when you cross trust/level/quest thresholds — usually mid-Acts 4–6.

| Trigger | System | Narrator |
|---|---|---|
| Trust: Locke ≥ 30 | Casino (`/casino`, Pazaak/craps) | Locke |
| Casino visited | Dead Man's Circuit (Godot, external) | Locke |
| Trust: Antiquarian ≥ 40 | Game Master's Arena (`/gamemasters-arena`) | Antiquarian |
| Trust: Locke ≥ 50 | Bounty Board (`/bounties`) | Locke |
| Quests ≥ 20 | Voltari Translation (purple planet, 2-million-year signal) | Elara |
| Companion evolution stage 2 | Pet Battles (`/pet-battles`) | **Companion** (first time companion narrates) |
| Level 12 | Co-op Incursions | The Human |
| Level 15 | Alliance Wars | Elara |
| Level 25 | Prestige | Antiquarian |
| First fight won | Bestiary | silent unlock |
| First crew member born | Crew Activity Feed | silent unlock |
| `crew_generation_2` | Bloodline / Crew Breeding | The Resurrectionist (first non-Elara/Human/companion narrator) |
| `necromancer_manifested` (server-wide) | Necromancer Returns endgame | server cinematic |

---

## What's not developed (sorted by player-impact)

### Critical narrative blockers
1. **Trade Empire mission loop** — `apps/server/routers/tradeMissions.ts` is a stub. Phase D.5 schema landed (`tradeRouteSaturation`, `tradeResearchRaces`, `convergenceClimaxState` in `apps/db/schema.ts:6978–7052`) but the **gameplay loop is unbuilt**. Blocks the Vex reveal, Locke arc payoff, and the Act 7 climax doom-clock pressure. Trade Empire is technically "playable" as a grid-trading sandbox with no narrative payoff. **#1 unimplemented system.**
2. **Soul Stones corruption/purification economy** — `SOUL_STONES_SYSTEM.md` describes 4 tables + 4 procedures + a demon-summoning braid through Acts 4–7. **Zero runtime presence.** Larger in scope than Trade Empire; entirely invisible right now.
3. **Global Light/Dark alignment meter** — `apps/shared/globalAlignment*` declared, **schema table missing**. Player choices accumulate to nothing visible at the macro level. The `vortex_endgame_light/dark_variant` flags fire but no global meter renders.

### Significant narrative gaps
4. **Mobile Narrator adoption** — only ArkExplorerPage consumes the 495-line Yin/Yang runtime. 5 routes designed (CompanionHub, Awakening, Memorial, PetGarden, CharacterCreation); none wired.
5. **Shadow Tongue room coverage** — 17 of 26 mystery rooms have no module. Conspiracy boards 4–7 are evidence-starved; technically completable but the clues are sparse.
6. **5 named cutscene components missing** — `Awakening`, `FirstHumanContact`, `MemoryRecovery`, `BreakingPoint`, `ThoughtVirus` cutscene components do not exist as React components yet (only 2 of 7 designed cutscenes are built).
7. **Act 6/7 opponent dialog tables thin** — `act6OpponentDialog.ts` and `act7OpponentDialog.ts` were flagged as missing in the completeness audit; dialog lives inline in `narrativeActs.ts` and lacks per-opponent personality polish.
8. **Per-step reactive companion comments (`cc_act6_*`, `cc_act7_*`)** — partial; coverage estimated at ~50%.
9. **Companion Ask alternates for late acts** — many topics keep their Act 5 answer through Act 7. The Human's `ask_human_who` is the canonical example.

### Silent unlocks needing narrative scaffolding
10. **Character Sheet** — appears on menu hour 0 with no explanation.
11. **Crew Activity Feed** — silent unlock on `first_crew_member_born`.
12. **Bestiary** — silent unlock on `first_fight_won`.
13. **Loredex (partial)** — room-discovered, no tutor explains it as a system.
14. **Combat Simulator** — room-discovered, no formal tutor.
15. **Daily Quests** — room-discovered, no formal tutor.

### Sub-system gaps
16. **Pet/specimen breeding loop** — `BREEDING_SYSTEM_ART_PROMPTS.md` is design-only. Zero tables, zero router. Bloodline-threshold card unlocks (`bloodline_threshold` gate exists in `expansionUnlockService.ts`) cannot fire.
17. **Living Character Sheet UI** — designed, zero files.
18. **Draft tournament bracket UI** — router exists, frontend mocked.
19. **War map territorial control** — `tradeSectorControl` schema without a loop.
20. **Casino panel bet logic** — per-panel wiring incomplete (`CasinoGamePanels.tsx:3`).
21. **Dead Man's Circuit, Cades FPS** — external Godot/Unreal projects; only bridge stubs in this repo.

### Media-blocked (waiting on production)
22. **Dreamer Visions 2–4 slideshows** — pending CDN frames for Albums 2–5.
23. **5 Trade Empire VO speakers** — `TODO_LOCKE_VOICE`, `TODO_ANTIQUARIAN_VOICE`, etc. (`tradeEmpireVoLines.ts:65–69`).
24. **Architect Transmission First Contact** — videoUrl + VO pending production (`transmissions.ts:1140–1142`).
25. **Wawa-lipsync** integration on character sprites (`SpriteCharacter.tsx:158`) — currently text-only.
26. **Act 7 Convergence final tone pass** — deferred until cinematic lock.

### Forward infrastructure (intentionally inert)
27. **DLC chapter card gates** — 9 chapters declared in `dlcChapterRegistry.ts`; **0 cards use the `dlc_chapter_completion` gate yet**.
28. **Bloodline-gated cards** — gate declared, 0 cards use it; awaits crew breeding loop.
29. **Founding Author / Authors Edition entitlements** — gates exist, no store products grant them yet.
30. **Notification enum producers** — 14 of 58 producers missing.

### DB hygiene
31. **78 drifted SQL migrations** — `migration-drift.baseline.json`; CI compensates with cold-boot bootstrap. Reconcile-to-`0071_baseline_v1` task is tracked, not blocking.

---

## Verification (replaying any segment)

1. **Run the gate:** `pnpm ship:check` from repo root. Confirms 16 PASS / 6 RATCHET / 0 FAIL on engine systems.
2. **Walk a player path:** `pnpm dev` → `http://localhost:5173/prelude` → step beat-by-beat. Flag panel visible at `/admin/health` (admin-gated).
3. **Inspect a single beat:** open `narrativeActs.ts` and search for the act header (`// ACT 4:`). Cross-reference opponent file (`acts2to7Opponents.ts`) and dialog file (`act{N}OpponentDialog.ts`).
4. **Inspect a single room:** open `apps/client/src/contexts/GameContext.tsx` and grep for the room id (e.g., `"medical-bay"`). Hotspots, tier flags, doors, and Elara's lines are all in `ROOM_DEFINITIONS`.
5. **Inspect a single unlock:** `apps/shared/featureRoadmap.ts` for feature unlocks; `expansionUnlockService.ts` for card unlocks; `battlePassConfig.ts` for tier rewards.
6. **Confirm a flag fires:** grep for `setNarrativeFlag("<flag_name>"` across `useNarrativeIntegration.ts` (lines 975–1414 cover all 14 act/secret flags).
7. **Audit narrative completeness:** `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md` (April 2026) and `docs/narrative-audit/DOC1`–`DOC4` per-system audits.
8. **Confirm content has no stub markers:** `pnpm vitest run apps/shared/contentIntegrity.test.ts` (currently green).

---

## Bottom line

The game is **playable from `/prelude` to a complete Act 7 ending** with all card systems functional. The mechanical engine is production-grade (16 PASS / 0 FAIL on declared subsystems).

The structural gaps are clustered: **Trade Empire mission loop**, **Soul Stones**, and **Global Alignment Meter** are the three system-level holes that would meaningfully change how the spine reads. **Six silent unlocks** (Character Sheet, Crew Feed, Bestiary, Loredex, Combat Sim, Daily Quests) appear without narrative framing and would benefit from tutor cards in the established `preludeSystemTutors.ts` pattern. Everything else is content polish, media production (VO + CDN frames), or forward infrastructure waiting for content.

The unlock graph is the story. Read top-to-bottom: role → inbox → witnessing → song → moral axis → community board → cross-game mastery → economy → path lock → reveal → cosmic scale → confession mirror → final stance → prestige rollover. Even with the dialog stripped, that ordering is the campaign's argument: *the music IS the prophecy*.
