# Dischordian Saga — Forensic Click-by-Click Walkthrough

## Context

You wanted the literal mechanical chain from the title screen to Act 7's Convergence Seat: every puzzle solve, every item pickup, every flag transition that unlocks the next room or advances the next act. This document traces exactly that. Every assertion cites a file path; every quoted dialog comes from source.

Three layers stack and you have to unlock all three to progress:

1. **Beat sequence** (`preludeSequence.ts`) — 15-beat linear cinematic; you click through it.
2. **Room cascade** (`GameContext.tsx ROOM_DEFINITIONS`) — 14 rooms unlock in a strict order; each room's `unlockRequirement` is satisfied by either visiting the previous room (auto-flags) or solving a puzzle / picking up a key.
3. **Act gate evaluators** (`act{N}CompletionGate.ts`) — pure-function AND-gates that read sub-flags from `narrativeFlags` and the player's `armyRecruitmentMissionsCompleted` array. Each gate fires atomically when all sub-conditions are true, advancing `narrativeAct`.

The cycle is: **click through Prelude beats → run 3 crew missions to set `prelude_complete` → land in Ark Explorer hub → solve room puzzles in cascade → fight act ladders → satisfy each act gate's sub-flags → reach Convergence Seat → prestige rollover.**

---

## Pre-Game

**Title screen** → click "New Game" → mounts `apps/client/src/pages/PreludePage.tsx:22` → `PreludeSequencePlayerConnected` starts the 15-beat sequencer (`apps/shared/preludeSequence.ts`).

---

## Prelude (15 beats, ~60 min, mostly cinematic)

Beats are stored in the `PRELUDE_BEATS` array. Each beat has a `completionFlag` written by `preludeSequenceReducer.ts:129` when the cutscene finishes. **Six beats are interactive** (C, D, E, F, H, J); nine auto-advance.

### Beat A — Cryo Wake (35s, **auto**)
Plays `prelude-beat-a-cryo-wake.mp4`. Elara delivers the "five pods" line. **Player input: none.** Sets `cutscene_awakening_complete` on cutscene end.

### Beat A.5 — Corridor breath (15s, **auto**)
Wordless. Sets `breath_beat_a5_complete`.

### Beat B — Escape (20s, **auto**)
Iris hatch opens. Sets `cutscene_door_iris_complete`. Bridge becomes the next walkable room per `preludeRoomGate.ts:45`.

### Beat C — Engineering / Crew Role Choice (35s + interaction) ⚡

Cutscene plays. Tutor card `CREW_ROLE_TUTOR` (`preludeSystemTutors.ts:110–125`) auto-displays.

**Player action:**
1. Three role chips render at `(22%,55%)`, `(50%,55%)`, `(78%,55%)` per `BeatCCrewRoleChoice.tsx:38–66`.
2. Hover any chip → button glows.
3. **Click one chip** to commit: **Engineer** / **Assassin** / **Oracle**.
4. 900ms confirmation glow. Sets:
   - `prelude_beat_c_role_<chosen>` (e.g., `prelude_beat_c_role_engineer`)
   - `prelude_beat_c_role_chosen`
   - `cutscene_engineering_intro_complete`
   - Companion comment fires (`prelude_beat_c_<role>_picked`)

The role unlocks dialog branches and (eventually) class-locked rooms like Engineering Core (Engineer chain) or Oracle Sanctum (Oracle chain).

### Beat C.5 — Window breath (20s, **auto**)
The Human's first intimate line. Sets `breath_beat_c5_complete`.

### Beat D — Cargo Bay Mission Board (30s + interaction) ⚡

Cutscene highlights three mission slates. Tutor card `MISSION_BOARD_TUTOR` (Locke teaching) appears after the first read.

**Player action — read all three slates** (any order):
1. **Click slate at (22%,38%)** — *Kelvara Salvage* (Kelvara Merchant Concord, posted 17,003 years). Sets `mission_board_read_kelvara`.
2. **Click slate at (50%,50%)** — *The Last Courier Run* (Nightlane Freight Guild, 16,988 years). Sets `mission_board_read_cargo_run`.
3. **Click slate at (76%,66%)** — *Expedition — Outer Dusk* (Outer Reach Cartographic Society, 17,112 years). Sets `mission_board_read_expedition`.

After **all three** are read, beat auto-completes (600ms delay). Sets `prelude_beat_d_all_slates_read` + `cutscene_cargo_intro_complete`. Postings sourced from `beatDMissionPostings.ts:58–103`.

These three missions are **referenced again in Beat H** when Locke says "I have three jobs that need a hand."

### Beat D.5 — Galley breath (25s, **auto**)
Human's "sandwich" line. Sets `breath_beat_d5_complete`.

### Beat E — Mess Hall Flashback (45s + interaction) ⚡

The Prince appears as a sepia-drained hologram.

**Player action — examine hologram hotspots:**
1. Click toy soldier OR diploma OR other hotspot.
2. Sepia-drain animation enters (3s, `SEPIA_ENTER_MS = 3000`).
3. Prince's VO line for that object plays.
4. Optional VFX (e.g., diploma-ink-bloom).
5. Sepia-drain exits (2s, `SEPIA_EXIT_MS = 2000`).
6. Click "Continue" after at least one hotspot, or auto-advance once all examined.

Sets `cutscene_mess_hall_intro_complete`.

### Beat F — Briefing Room Biometric Lockbox (30s + interaction) ⚡

Cutscene shows captain's chair + lockbox.

**Player action:**
1. **Click the lockbox** → recognize VFX (~900ms) → memo hologram rises.
2. **Read page 1**: *"If you are reading this, I am not at the table. There are 213 entries in the ledger and one chair that will not fill."*
3. **Click to advance to page 2**: *"The Ark will wake without me. Trust the Engineer — or trust the pattern he left behind."*
4. **Click to advance to page 3**: *"Leave it empty. Do not sit in it. Do not move it. It is the only promise I can still keep."*
5. **Click "Hold the letter"** button.

Sets `prelude_beat_f_memo_read` + `cutscene_briefing_room_intro_complete`. Tutor card `PreludeTutorCard systemId="beat_f_lockbox"` runs alongside.

### Beat F.5 — Empty chair breath (90s, **auto**)
Longest breath beat. Human meditates on Kael's absence.

### Beat G — Medical Bay (25s, **auto**, wordless)
You see the pet capsule (amber canopy) in the alcove. Tutor card `PET_CAPSULE_TUTOR` (`preludeSystemTutors.ts:163–177`) is queued. Sets `cutscene_medical_bay_intro_complete`.

### Beat H — Comms Array Inbox + Locke's First Message (25s + interaction) ⚡

**Player action:**
1. **Click the envelope glyph.**
2. Envelope unfolds → message panel opens → Locke's VO begins (~25s).
3. The 8-sentence message scrolls (`beatHInboxMessage.ts:58–67`):
   - "Ark 1047 — this is Adjudicator Locke of New Babylon."
   - "Your Trade Empire listing on Channel 6 has pinged our long-range posts twice in the last standard week..."
   - "I have three jobs that need a hand and I would like to offer you the first one on a standard intake contract..."
   - "The job is salvage retrieval from a wreck near the old Kelvara lane..."
   - **Sentence 6** (cyan-blooms at ~80% VO progress): *"I am watching to see which kind of person you are."*
   - "End transmission."
4. **Click to close.**

Sets `beat_h_inbox_read_locke_first` + `cutscene_comms_array_intro_complete`. Tutor card `INBOX_TUTOR` (Human teaching) auto-displays. **30 seconds after the cyan bloom**, the Watcher subsystem fires a one-shot toast (`BeatHInbox.tsx:99–100`).

### Beat H.5 — Memo pile breath (20s, **auto**, wordless)
Elara fades from scene.

### Beat I — Bridge / Witnessing Hub Activation (40s, **auto**, wordless)
Lights cascade. Witnessing Hub hemisphere blooms. Sets `cutscene_bridge_intro_complete`.

### Beat J — Archives + Last Words tease (~8m10s, **auto**)
- 0:00–6:40 — **Engineer's Log 5** (Prince's hologram, 6m40s reused recording, sepia-drained).
- 6:40–6:41 — 1 second canonical silence.
- 6:41–7:15 — **Last Words song tease** (~35s, Verse 1, Malkia Ukweli singing).

**Per the October 2026 restructure, the Light/Dark vote was MOVED out of the Prelude into Act 1 Cycle C. Beat J in the Prelude is purely cinematic.** Sets `cutscene_archives_two_witnesses_part1_complete`.

---

## Post-Prelude — The 3 Crew Missions (THIS is what gates Act 1)

The 15 prelude beats end. Player is dropped into the Bridge. **None of the beat completion flags raise `prelude_complete`** — that comes from running three crew missions from the Bridge mission board.

Source: `apps/shared/preludeCrewMissions.ts`. Trigger predicate: `shouldAdvanceToAct1OnPreludeComplete()` at `preludeHandoff.ts:42–50`.

### Crew Mission 1 — "The Wreck Next Door" (Patch, DeMagi engineer, ~3-5 min)
- Click mission board → accept Mission 1.
- Board a mirror-image Ark in the debris field; find it full of dead crew.
- **Reveals: the Potentials are plural** (foreshadowing).
- Sets: `prelude_mission_wreck_complete`, `potentials_are_plural`.
- Rewards: salvage plating, dream crystal shard, 25 memory energy, +5 bond.

### Crew Mission 2 — "The Signal from Nowhere" (Zephyr-9, Quarchon fragment, ~4 min)
- Accept Mission 2.
- Investigate a ping from an empty sector. Discover **Elara's pre-recorded voice from 1,048 years ago.**
- **Challenges Elara's claimed timeline.**
- Sets: `prelude_mission_signal_complete`, `elara_pre_recording_exists`.
- Rewards: signal fragment, quarchon prism, 40 memory energy, +5 bond.

### Crew Mission 3 — "The Burnt Card" (Little One, Ne-Yon child, ~5 min) **[GATE TO ACT 1]**
- Accept Mission 3.
- Retrieve the Seer's burnt tarot card from ash.
- Little One walks it herself to the Archives, unlocking the §2.7 Two Voices, One Deck cutscene.
- **Sets: `prelude_mission_burnt_card_complete`, `prelude_burnt_card_found`, `prelude_complete`.**
- Rewards: burnt tarot fragment, 100 memory energy, +10 bond.

When `prelude_complete` flips, `useNarrativeIntegration.ts` calls `advanceNarrativeAct(1)`. `narrativeAct` becomes 1. Act 1 is now armed.

---

## Hour 1 — `/ark` Hub Opens; Cryo Mystery is the First Real Puzzle

The Ark Explorer (`apps/client/src/pages/ArkExplorerPage.tsx`) renders. You start in the Cryo Bay. The room cascade rules in `apps/server/routers/ark.ts:8–118`:

- `start` → always unlocked
- `room_visited` → previous room visit
- `narrative_event` → flag set
- `specific_item` → item in inventory
- `items_collected` → count threshold
- `chain_complete` → quest chain finished

### Cryo Bay (always unlocked) — solve the cryo mystery

Source: `apps/shared/cryoBayMystery.ts`. LucasArts-style verb-coin: each hotspot supports LOOK / USE / TALK.

**Six clue hotspots:**

| # | Hotspot | Action | Result |
|---|---|---|---|
| 1 | **Dead Pod** | LOOK | Sets `cryo_mystery_first_clue_found` (Tier 0→1). Logs clue: occupant exists with no manifest record. |
| 2 | **Frosted Glass** | LOOK | Wipes frost. Grants inventory: `silver-locket` (face inside scratched illegible). |
| 3 | **Medical Chart** | LOOK | Reveals victim vitals. |
| 4 | **Cracked Panel** | LOOK | **Sabotage discovered** — deliberate cut on the pod release mechanism. Logs `clue-cryo-pod-sabotage`. |
| 5 | **Data Slate** | USE | Grants inventory: `data-slate-fragment` (cracked but live device, half-decoded crew manifest). |
| 6 | **Personal Effect** | USE | Grants inventory: `torn-id-tag` (brass-edged ID, name-line torn deliberately, serial intact). |

**The puzzle solve** (`cryoBayMystery.ts:770–788`):

```
COMBINE: torn-id-tag + data-slate-fragment
RESULT: Slate flickers through half-decoded manifest, settles on a single entry.
SETS: cryo_mystery_victim_identified (Tier 1→2)
EFFECT: Medical Bay bulkhead unlocks.
```

Reward dialog: Elara's voice shifts from fragmented through balanced to luminous as tiers advance. Detective names Pod Zero. Tier 2→3 (`cryo_case_marked_open`) is left for a later runtime hook.

**Doors from Cryo Bay:**
- → Medical Bay (gated by `cryo_mystery_victim_identified`)
- → Bridge (always available, x=22 y=42)

### Bridge — the **nav-calibration glyph puzzle**

Unlock: visit Cryo Bay first (`room_visited: cryo-bay`).

Long Elara monologue plays from `elara-bridge_49bd8959.mp3` (`GameContext.tsx:638`). The conspiracy board is shown to have three red threads ending at one blank pin (the previous crew refused to commit a name) plus one violet thread tagged ELARA-SYS.

**The nav-calibration puzzle** (`bridge.ts:326–364`):
- **Click "use" on the nav-console hotspot.**
- Modal opens: 4 glyph slots. The previous crew solved 3 correctly; slot 4 is empty.
- The missing glyph is **a third-class Mechronis character** — a curriculum item that was edited out of Elara's training data.
- Mechanics: drag/select glyph from a button grid. Visual feedback: green = correct, red = incorrect. Unlimited retries.
- If the Detective is known, hint surfaces.
- **On correct sequence:** sets `fast_travel_unlocked` (Tier 1→2). Plays `bridge_fast_travel_unlocked.mp4` (`roomMediaPrompts.ts:801–802`). Fast-travel system becomes available across the whole hub.

**Other Bridge interactions to do while you're here:**
- **Click captains-chair** → text dialog → reveals two items in the armrest:
  - **Pickup `captains-master-key`** → unlocks Captain's Quarters later.
  - **Pickup `captains-final-log`** (encrypted data chip): *"The Engineer lives. Find the yellow coats."*
- Click Tactical Display → opens `/board` (Conspiracy Board lore graph).
- Click Quest Board → opens `/quests` (Daily Quests now live).
- Click Guild Console → opens `/guild` (Syndicates now live).

**`bridge_systems_restored` auto-flag:** First visit to Bridge automatically sets this flag (`GameContext.tsx:2350`). Nothing the player has to do — visiting is the trigger. **This unlocks the Comms Array.**

### Medical Bay — the **safe puzzle** for the Observation Keycard

Unlock: `cryo_mystery_victim_identified` (the Cryo combine).

Long Elara monologue from `elara-medical-bay_8456228a.mp3` plays (`GameContext.tsx:558`).

**Hotspots:**
- **Bio-Bed** (LOOK) → flatline timestamp matches Cryo pod sabotage hour. Sets `clue-medbay-cryo-synchrony`. USE → fresh scan reveals iron-bond marker (same as dead pod).
- **Medical Log** → pickup `medical-log-001`. *"Patients with nightmares. Voices. Something about 'the signal.'"*
- **Egg-Vox-Neural-Bridge** (hidden behind bio-bed maintenance panel) → "dna-device-offer" interaction → DNA donation flow → sets `medbay_device_awakened` (Tier 1→2).
- **Emergency Safe** → biometric reader sabotaged; numeric keypad still works. **Solve the keypad puzzle** (action: `room-mystery:medical-bay:emergency-safe`). Code is hinted in lore (likely Vox's service date / crew numbers).

**On safe solve:** pickup `observation-keycard`. **This unlocks the Observation Deck.**

Other items here: `void-essence-sample` (egg, lore item).

### Archives

Unlock: visit Bridge first (`room_visited: bridge`).

VO `elara-archives_13b76780.mp3`. **Loredex Database** + **Dischordia card battles** both unlock here per `featureRoadmap.ts:75–85` (gates: `room_discovered: archives`).

Hotspots:
- Search Terminal → `/search`.
- Codex Shelf → `/codex`.
- Archive Crystal → pickup `archive-crystal-beta`.
- Egg-Archive-Tome → an unmarked organic-skin book that repeats one word: "Dischord."
- Shadow Tongue hotspots (corrupted scroll rack, rewritten ledger, indigo-glow lectern, unnameable-hue cabinet) — only visible after `shadow_tongue_evidence` is set.

### Comms Array — Act 1 entry point

Unlock: `bridge_systems_restored` (set automatically when you first visit Bridge — see above).

VO `elara-comms-array_8f0396f6.mp3`.

Hotspots:
- **Radio Console** (radio-console): LOOK once → sets `clue-comms-array-singer-named` (Terminus Singer identified). LOOK again (Tier 1→2) → reveals **Elara's own voice singing in harmony, timestamped 11 years before her documented activation** → sets `clue-comms-array-elara-pre-existed` and `elara_pre_existed`. (This corroborates Crew Mission 2's discovery.)
- **Voice in the Static** (voice-in-the-static): Direct conversation with the Terminus Singer. Sets `terminus_singer_named`. Pickup: `static-fragment-recording`.
- **Communication Relay** → fleet scanning → triggers Act 1 entry.
- **Watch The Saga** → `/watch`.

**`power_grid_restored` auto-flag:** First visit to Comms Array automatically sets this (`GameContext.tsx:2354`). **This unlocks Engineering.**

### Observation Deck

Unlock: have `observation-keycard` (from Medical Bay safe).

VO `elara-observation-deck_69c97750.mp3`. **Music Library** unlocks (`featureRoadmap.ts:112–114`).

Hotspots:
- **Panoramic Viewport** → "Look at the stars... they're wrong. The constellations don't match any known configuration." Tier 1→2: identify the **Watcher constellation** (all-seeing eye of the Panopticon).
- **Music Terminal** → `/discography` (4 albums).
- **Crystal Cradle**, **Bond-Resonance Altar**, **Crew Memorial** (1,047 names — Elara remembers each).

### Engineering — the crafting bench (5 combine recipes)

Unlock: `power_grid_restored` (auto from first Comms Array visit).

VO `elara-engineering_2363948d.mp3`. **Card Crafting / Research Lab** unlocks (`featureRoadmap.ts:106–108`). Reactor at 34% capacity.

**The crafting bench has 5 disciplines** (`engineering.ts:61–152`). Each is a 2-input combine:

| # | Discipline | Combine | Output | Flag |
|---|---|---|---|---|
| 1 | **Cipher** | `decoder_ring` + `cipher_key` | `master_decoder` | `engineering_master_decoder_built` |
| 2 | **Schematic** | `original-schematic-rubbing` + `corrupted-fragment` (from Archives) | `restored-schematic` | `engineering_schematic_restored` |
| 3 | **Power** | `drained_power_cell` + `energy_shard` | `charged_power_cell` | `engineering_power_cell_charged` |
| 4 | **Medical** | `basic_medkit` + `neural_stim` | `enhanced_medkit` | `engineering_enhanced_medkit_built` |
| 5 | **Signal** | `antenna_fragment` + `amplifier_circuit` | `signal_booster` | `engineering_signal_booster_built` (Tier 1→2) |

**The crafting milestone:** Crafting **3 cards** sets `crafting_mastered` — **Act 2 sub-flag #1** (watcher at `useNarrativeIntegration.ts:1159–1166`). The bench tracks `state.craftedItems?.length`.

Other Engineering hotspots:
- **Reactor Core** (reactor-core, LOOK) → sets `engineering_first_clue_found` (Tier 0→1). Reveals Vex Solène's equipment fingerprint.
- **Research Station** (research-station) → opens `/research-minigame` puzzle. First completion sets `engineering_research_bench_online` (Tier 2→3).

**`combat_systems_online` auto-flag:** First visit to Engineering automatically sets this (`GameContext.tsx:2358`). **This unlocks the Armory.**

### Forge Workshop

Unlock: visit Engineering (`room_visited: engineering`).

3 hotspots:
- **Anvil** — LOOK sets `forge_introduced`. USE: strike the anvil. Low brass note rings 4 seconds. Sets `forge_anvil_struck`.
- **Schema Rack** — diagrams in two hands: Lyra's, and the Editor's. The Editor's schema (substitution-press, never built) was kept visible as a daily refusal.
- **Kiln** — bay-leaf-fired tradition Lyra established. Future closure: "We will use bay leaf when we do."

### Armory

Unlock: `combat_systems_online` (auto from first Engineering visit).

VO `elara-armory_e02fd3aa.mp3`. **Terminus Swarm tower defense** unlocks (`featureRoadmap.ts:128–131`).

Hotspots:
- **Combat Arena** → `/fight`.
- **Card Battle Station** → `/battle`.
- **Chess Table** → `/chess`.
- **Knowledge Terminal** → `/quiz`.
- **Spectator Screen** → `/spectate`.
- **Motivational Poster** (Iron Lion's HANG IN THERE poster) — 3,000 prints, 72 hours, 3 days before the academy fell. Tier 2 reveal: the cat in the corner is Mr. Whiskers.
- **Agent Zero Dog Tag** (egg) → biometric data matches **the Engineer**, not Agent Zero. Mind-swap conspiracy now in evidence. Triggers Agent Zero NPC appearance.

**`cargo_bay_pressurized` auto-flag:** First visit to Armory automatically sets this (`GameContext.tsx:2362`). **This unlocks Cargo Hold.**

### Cargo Hold

Unlock: `cargo_bay_pressurized` (auto from first Armory visit).

**Trade Empire goes live** (`featureRoadmap.ts:117–119`). Locke's mentorship arc opens.

Hotspots:
- **Trade Empire Terminal** → `/trade-empire`.
- **Marketplace** → `/marketplace`.
- **Inventory Locker** → `/inventory`.
- **Fleet Docking Bay** → `/fleet`.
- **Rubber Chicken with Pulley** (LucasArts/Sierra red herring): Tier 1 LOOK. Tier 2 reveal — the pulley is structural and load-bearing; the chicken is deniable cover for a tool the Engineer brought as an escape-plan precaution. Tier 3: "The most-revisited objects on this ship in two and a half centuries are: Lyra's mug, the dead pod, and the rubber chicken."
- **Classified Manifest Page** (egg): *"Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector."*

### Captain's Quarters

Unlock: have `captains-master-key` (from Bridge armrest).

VO `elara-captains-quarters_b76f5371.mp3`. Dr. Lyra Vox's room.

Hotspots:
- **Trophy Wall** → `/trophy`.
- **Strategic Table** → `/deck-builder`.
- **Companion Quarters** → `/companions`.
- **Battle Pass Console** → `/battle-pass`.
- **Morality Compass** → `/morality-census`.
- **Cat Photo (Mr. Whiskers in tiny brass goggles)** → Tier 1 LOOK; Tier 2 reveals Iron Lion saw this and drew the cat for his 3,000 posters; Tier 3 reveals **someone has been cleaning the photograph recently** (cleaning-streak angle, two feet left of frame). Sets `third_party_in_quarters` — first evidence of a hidden caretaker on the Ark.
- **Vex Workshop Diary** — undelivered letter from Vex Solène: *"I have not named the workshop because I have not been ready to be named through it."*
- **Dr. Vox's Personal Terminal** (egg) — decryption reveals the entire conspiracy: *"Day 1,247. The Warlord's voice grows louder... The Thought Virus is complete... When Kael steals this ship, the virus will walk aboard with him..."*
- **Hidden Passage Door** (shimmering) → leads to Antiquarian's Library.

### Antiquarian's Library

Unlock: **5 items collected.** Item count tracked at `GameContext.tsx:2307–2316`. Items that count include:
1. `data-crystal-alpha` (Cryo Bay)
2. `medical-log-001` (Medical Bay)
3. `observation-keycard` (Medical Bay safe)
4. `captains-master-key` (Bridge armrest)
5. `void-essence-sample` (Medical Bay egg)

(Or any 5 from the broader pool: `archive-crystal-beta`, `captains-final-log`, `agent-zero-dogtag`, `silver-locket`, `data-slate-fragment`, `torn-id-tag`, `medical-log-001`, etc.)

**This is a pocket dimension outside time.** Hotspots:
- **Orb of Worlds** → `/conexus` (CoNexus interactive story games).
- **Ancient Tomes** → also `/conexus`. Each tome is a gateway story: "The Necromancer's Lair," "Awaken the Clone," "Sundown Bazaar," etc.
- **Hidden Prophecy** (egg, fourth-wall break): *"The stories are told so that you — yes, you, the one reading this — can choose."*

### Engineering Core (hidden, **Engineer class only**)

Unlock: `chain_complete: engineer_chain`. Engineer-class players who:
1. Visit Engineering (sets `power_grid_restored`).
2. Solve the Reactor calibration puzzle (research minigame).
3. Build the signal-booster (combine #5).
4. Restore the reactor schematic (combine #2).
5. (Further runtime quest steps.)
6. Complete `engineer_chain` → sets `chain_engineer_chain_complete` → Engineering Core unlocks.

True heart of the Ark. Reactor is "not energy as you understand it — it is continuity." Egg Resonance Frequency: *"The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design."*

### Oracle Sanctum (hidden, **Oracle class only**)

Unlock: `chain_complete: oracle_chain`. Oracle-class players progress through observation-deck interactions, probability-sphere navigation, precognitive vision unlocks, then complete `oracle_chain`.

Probability sphere boosts precognition 1000x. Egg Sealed Vision shows "the end. The final moment of the Saga." Only an Oracle can unseal it.

---

## Cross-room unlock flags — full chain summary

| Flag | Set by | Unlocks |
|---|---|---|
| `cryo_mystery_victim_identified` | Combine torn-id-tag + data-slate-fragment in Cryo Bay | Medical Bay |
| (room_visited: cryo-bay) | First entry to Cryo Bay | Bridge |
| `fast_travel_unlocked` | Solve nav-calibration glyph puzzle at Bridge | Fast travel system |
| `bridge_systems_restored` | **AUTO** on first Bridge visit | Comms Array |
| `power_grid_restored` | **AUTO** on first Comms Array visit | Engineering |
| `combat_systems_online` | **AUTO** on first Engineering visit | Armory |
| `cargo_bay_pressurized` | **AUTO** on first Armory visit | Cargo Hold |
| (item: observation-keycard) | Solve Medical Bay safe puzzle | Observation Deck |
| (item: captains-master-key) | Pickup from Bridge armrest | Captain's Quarters |
| (items_collected ≥ 5) | Collect 5 tagged items across rooms | Antiquarian's Library |
| `chain_engineer_chain_complete` | Engineer-class quest chain | Engineering Core |
| `chain_oracle_chain_complete` | Oracle-class quest chain | Oracle Sanctum |

The cascade pattern is critical: **the four "auto-flag" rooms gate each other in strict sequence**. Bridge → Comms Array → Engineering → Armory → Cargo Hold. The mystery puzzles are side-cascades for Medical Bay (cryo combine), Observation Deck (safe), Captain's Quarters (Bridge armrest), Antiquarian's Library (5 items), and the two class rooms (chain completion).

---

## Act 1 — "The Signal" (12-battle ladder + §5.8 Authority Trial + Light/Dark vote)

**Trigger:** Act 1 is armed when `narrativeAct = 1` (set on `prelude_complete`). It activates when you click the Communication Relay in the Comms Array.
**Page:** `/act1-ladder` → `Act1CardLadderPage.tsx`.
**Source:** `narrativeActs.ts:80–387`, `act1Opponents.ts`, `act1OpponentDialog.ts`.

### Cycle gates (`useNarrativeIntegration.ts:973–1004`)

| Cycle | Sub-flag | Required | Battle range | Story label |
|---|---|---|---|---|
| **A — Kindergarten of Gods** | `act_1_cycle_a_complete` | ≥3 wins | Battles 1–3 | "The Engineer's childhood ends." |
| **B — Mechronis Academy** | `act_1_cycle_b_complete` | ≥8 wins | Battles 4–8 | "The graduation photo. One student is missing." |
| **C — The Deck Reforged** | `act_1_cycle_c_complete` | ≥12 wins | Battles 9–12 | "New Babylon. A tall figure in a worn engineer's coat." |

### The 12 battles in order

| # | Opponent | Special |
|---|---|---|
| 1 | Minnie the Meme (Cycle A) | First card battle |
| 2 | Corey the Collector | |
| 3 | Kanshi Sha the Watcher (Cycle A finale) | Slideshow `welcome-to-celebration` fires |
| 4 | Young Iron Lion (Year 1) | |
| 5 | Young Recruiter / Kael (Year 2) | |
| 6 | Young Agent Zero / Vex Solène (Year 3) | |
| 7 | Young Eyes / Professor Matrikala (Year 4) | |
| 8 | The Young Human / The Seeker (Cycle B finale) | Slideshow `to-be-the-human` fires |
| 9 | Vernon Vortex (First Form) — Battle of Nexon | |
| 10 | Wanda Wyrlord (fragmented) — Zenon | |
| 11 | **Warlord's Nano-Swarm** (inside Agent Zero) | **MANDATORY LOSS.** Opponent is unkillable; must lose. Feeds verdict-stream balance for §5.8. |
| 12 | **Wayne Warden (Authority's Tribunal)** | **§5.8 Phase-Restricted Trial Format** (see below). Slideshow `last-words` fires. |

### §5.8 — Authority Trial 10-phase mechanic (the Act 1 climax fight)

Source: `docs/production/act1/authority-trial-phase-mechanic.md` §§2–6.

The trial is a card duel where each turn restricts which **card categories** can be played. Categories: defensive / narrative / evidence / reactive / confession.

| Turn | Phase | Allowed cards |
|---|---|---|
| 1 | **Charge** | Defensive only |
| 2 | **Opening argument** | 1 narrative card; phase ends after 1 play |
| 3 | **Evidence (present)** | Evidence only |
| 4 | **Evidence (cross-support)** | Evidence only, building on turn 3 flags |
| 5 | **Evidence (closing)** | Evidence; single "no further evidence" pass allowed |
| 6 | **Cross-examination (first)** | Reactive only (target verdict stream) |
| 7 | **Cross-examination (second)** | Reactive + confession |
| 8 | **Cross-examination (closing)** | Reactive + confession; single "no further questions" pass |
| 9 | **Closing argument** | 1 narrative card; phase ends after 1 play |
| 10 | **Verdict** | No card play; resolution only |

**Verdict threshold formula:**
```
base_threshold     = -2
warm_offset        = (gameMasterVerdictStreamBalance ≥ +3) ? +3 : 0
cool_offset        = (gameMasterVerdictStreamBalance ≤ -3) ? -3 : 0
trial_threshold    = base_threshold + warm_offset + cool_offset
trial_balance      = sum of verdict-stream deltas during §5.8

if trial_balance ≥ trial_threshold:
  outcome = "overturn"     → sets act1_authority_defeated
else:
  outcome = "sentence_passed" → sets act1_authority_sentence_passed
```

Either way, the meta-flag `act1_authority_outcome` is set. **Pre-match advisory** warns if your deck lacks: 2× defensive, 2× narrative, 4× evidence, 4× reactive (confession optional).

### Light/Dark alignment vote (§5.8.1)

UI component: `apps/client/src/components/match/ChoicePillarLightDark.tsx` (consumer in `DuelystGameUI.tsx:1000`).

**Trigger:** during the Last Words full-song cutscene at ~66s (the chorus-1 line). The pillar splits into a Light side and a Dark side.

**Player action:** click Light or Dark. `setLightDarkAlignment("light" | "dark")` writes to campaignState; flag set.

**Four canon endings cascade out:**
- **Overturn + Light** — Authority grants delay; player carries the Engineer's thought forward.
- **Overturn + Dark** — Authority grants delay; Engineer survives but legacy dies with him.
- **Sentence + Light** — Engineer executed; player carries the legacy.
- **Sentence + Dark** — Engineer executed; legacy dies (Empire wins quietly).

### Act 1 completion — atomic AND-gate

`useNarrativeIntegration.ts:986–1004` evaluates on every tick. Fires `act_1_complete` when **all three** are true on the same tick:
1. `cardWins ≥ 12` (Cycle C crossed)
2. `lightDarkAlignment !== null` (Light or Dark picked)
3. `act1_authority_outcome` is set (trial resolved either way)

Then: advances `narrativeAct` to 2; sets `act_2_started`. **4 cards unlock** (`s2_hierarchy/act_exclusives.ts:15–85`). Conspiracy Board #1 (*The First Memory*, 5 clues) opens.

---

## Act 2 — "The Forged Hand" (4 sub-flag interlude, AND-gate)

**Trigger:** Act 1 → Act 2 advancement bumps `narrativeAct` to 2.
**Source of truth:** `apps/shared/act2CompletionGate.ts:48–76` `deriveAct2CompletionStatus()`.

### The 4 sub-flags (any order)

| # | Flag | Action | Watcher |
|---|---|---|---|
| 1 | **`crafting_mastered`** | Craft **3+ cards** at Engineering bench (state.craftedItems.length ≥ 3) | useNarrativeIntegration.ts:1159–1166 |
| 2 | **`chess_mastered`** | Win **5+ chess matches** (localStorage `chess_wins` ≥ 5; can accumulate any time) | useNarrativeIntegration.ts:1167–1172 |
| 3 | **`thaloria_cinematic_seen`** | Win **3+ Collector's Arena matches** (story-mode) → triggers "The Helmet in the Grass" cinematic; flag set on slideshow completion | useNarrativeIntegration.ts:1131–1144 |
| 4 | **`game_master_loss`** | Lose ≥1 match to the Game Master (Chess Climb opponent, best-of-3 series). Failure is required curriculum. | Set by gameplay directly |

### Parallel chess depth → Dischordia mechanic unlocks

While progressing chess, depth tiers cross and grant cross-game advantages (`act2ClassroomUnlocks.ts:37–59`, watcher `useNarrativeIntegration.ts:1069–1089`):

| Depth | Tier flag | Mechanic unlock |
|---|---|---|
| 1 | `zephyr_classroom_tier_1_crossed` | Zephyr-9 introduction |
| 3 | `zephyr_classroom_tier_3_crossed` | **Peek top card** in Dischordia |
| 5 | `zephyr_classroom_tier_5_crossed` | **One undo per match** in Dischordia |
| 8 | `zephyr_classroom_tier_8_crossed` | **Engineer's Opening** deck card unlocked |

### Chess Climb tier-won companion reactions
Each best-of-3 Climb tier won fires `chess_climb_tier_N_won` (N=0..3). Elara and Human alternate VO reactions (`useNarrativeIntegration.ts:1099–1114`).

### Act 2 completion

When all 4 sub-flags AND `narrativeAct ≥ 2`: gate fires (`useNarrativeIntegration.ts:1173–1192`).
- Sets `act_2_complete` + `trade_empire_unlocked`.
- Advances `narrativeAct` to 3.
- 4 cards unlock. Conspiracy Board #2 opens.

---

## Act 3 — "The Offer" (cinematic + ladder + path lock)

**Trigger:** `narrativeAct = 2` AND `totalRoomsUnlocked ≥ 5` (`narrativeActs.ts:50–52`). Cryo Bay is always unlocked, so 4 more rooms needed (typically Bridge + Medical Bay + Comms + Archives suffice).
**Source:** `apps/shared/act3CompletionGate.ts:80–118`.

### The 3 sub-conditions (AND-gate)

1. **`slideshow_i_am_the_eyes_that_watch_complete`** — Watch Act 3 opening cinematic (queued by SLIDESHOW_TRIGGERS when `act_3_starting` raised). Sets via slideshow `flagsSetOnComplete`.
2. **`act3_kael_logs_unlocked`** — Defeat all 3 Act 3 card-ladder opponents on `/act3-ladder` (Substrate Echo → Kael Archivist → Substrate Warden). Final Warden victory writes the flag.
3. **One of three infiltration-path endings** (the path lock):

#### The infiltration-path mechanic (`tradeEmpire/infiltrationPaths.ts:38–176`)

Player navigates a **Trade Empire spy chain**, building "cover" by selecting faction identities across linked sectors. 8 covers across factions: New Babylon, Hierarchy, Antiquarian, Thaloria, Freeport, Insurgency, Substrate, Sovereigns. Covers chain by faction adjacency; detection difficulty scales with chain length and faction diversity.

Three chain endings, **pick one** (`act3PathDividend.ts:15–89`):

| Ending flag | Path | Trust dividend (cashes out at Act 6) |
|---|---|---|
| `act3_insurgency_ending` (Transparent) | Full disclosure to Elara | +10 Elara, +0 Human, +0 morality → `act6_path_dividend_transparent` |
| `act3_empire_ending` (Pragmatic) | Selective edits | +5 Elara, +5 Human, +0 morality → `act6_path_dividend_pragmatic` |
| `act3_hierarchy_ending` (Full Secret) | Tell Elara nothing | +0 Elara, +10 Human, **−3 morality** → `act6_path_dividend_full_secret` |

### Act 3 completion
Gate fires (`useNarrativeIntegration.ts:1207–1227`): sets `act_3_complete` + `act_4_started`; advances `narrativeAct` to 4. 4 cards unlock. Conspiracy Board #3 opens.

---

## Act 4 — "The Revelation" (cinematic + path flag + 1 Prisoner chapter)

**Trigger:** `narrativeAct = 3 → 4` from Act 3 completion.
**Source:** `apps/shared/act4CompletionGate.ts:86–128`.

### The 3 sub-conditions (AND-gate)

1. **`slideshow_act_4_revelation_intro_complete`** — Watch the Act 4 opening cinematic.
2. **One of three Act-1-path flags** (canonical priority order: A > partial_share > full_secret):
   - `act1_path_A` (Willing Disclosure)
   - `act3_partial_share` (Discovery)
   - `act3_full_secret` (Betrayal)
3. **At least one Prisoner chapter cleared** (any one of four):
   - `act4_prisoner_cell_complete` — *The Cell*
   - `act4_prisoner_extraction_complete` — *The Extraction*
   - `act4_prisoner_warlord_complete` — *Warlord Rematch*
   - `act4_prisoner_oracle_complete` — *White Oracle*

Each chapter is a Collectors Arena story-mode card battle. Win one, the flag fires (gameplay responsibility). Canon expects you to try all four, but only one is required for the gate.

### Act 4.5 — Dead Man's Circuit (sibling track, **optional**, does not block Act 5)

`act_4_5_started` raised when Act 4 completes. Source: `apps/shared/act4_5CompletionGate.ts:60–92`.

Two sub-conditions:
1. `slideshow_act_4_5_intro_complete` — opening cinematic.
2. At least one of:
   - `act_4_5_circuit_complete` — Dead Man's Circuit racing mode (external Godot project; bridge stubs only).
   - `act_4_5_casino_complete` — The Degen Casino mode.

On completion: sets `act_4_5_complete`. **Does NOT advance narrativeAct.** Toast: "Act 4.5 — Dead Man's Circuit: You named the wager. You paid the wager. The chain keeps the identity you lost."

### Act 4 completion
Gate fires (`useNarrativeIntegration.ts:1229–1249`): sets `act_4_complete` + `act_5_started` + `act_4_5_started` (sibling track armed). Advances `narrativeAct` to 5. 4 cards unlock. Conspiracy Board #4 opens.

---

## Act 5 — "The Reckoning / The Map" (4 sub-flags including 5 recruitment missions)

**Trigger:** `narrativeAct = 4 → 5`.
**Source:** `apps/shared/act5CompletionGate.ts:74–112`.

### The 4 sub-conditions (AND-gate)

1. **`slideshow_act_5_map_intro_complete`** — Watch Act 5 opening cinematic.
2. **`act_5_map_revealed`** — Open the Act5InterludePage and view Kael's 5-sector star map. First view automatically writes the flag.
3. **`cades_m7_complete`** — Complete **Cades campaign mission 7** (Iron Lion's last stand on Veridian VI). Cades is a cooperative mission system; M7 is the canonical end-of-Act-5 beat.
4. **Army Recruitment ≥ 5 missions completed** — `state.armyRecruitmentMissionsCompleted.length ≥ 5`. Threshold: `RECRUITMENT_THRESHOLDS.act6 = 5` (`armyRecruitment.ts:28`). `addCompletedRecruitmentMission()` is idempotent (`armyRecruitment.ts:41–48`); only successful completions count.

### Bridge of Kael post-credits scene (separate optional track)

If `kael_questline_complete` AND player returns to Bridge (`returned_to_bridge_post_kael`), `BRIDGE_OF_KAEL_POST_CREDITS` fires (`witnessingIntegrations.ts:26–32`). Doesn't block anything.

### Act 5 completion
Gate fires (`useNarrativeIntegration.ts:1267–1289`): sets `act_5_complete` + `act_6_started`. Advances `narrativeAct` to 6. 4 cards unlock. Conspiracy Board #5 opens.

**Parallel Act 6 trigger** (`useNarrativeIntegration.ts:1291–1306`): When recruitment ≥ 5 AND `narrativeAct ≥ 5`, `act_6_started` fires *independently*. So Act 6 can begin mid-Act-5 if you blow through recruitment fast.

---

## Act 6 — "The Confession" (cinematic + 2 confessions + 1 of 7 stances)

**Trigger:** Recruitment ≥ 5 AND `act_6_started` set.
**Page:** `/act6-ladder` → `Act6CardLadderPage.tsx`.
**Source:** `apps/shared/act6CompletionGate.ts:73–111`.

### The 4 sub-conditions (AND-gate)

1. **`slideshow_act_6_confession_intro_complete`** — Opening cinematic.
2. **`act6_elara_confession_heard`** — Win the card-ladder battle vs. **"The Woman She Was"** (Elara's memory/shadow). Writer: `Act6CardLadderPage` on victory.
3. **`act6_human_confession_heard`** — Win the card-ladder battle vs. **"The Detective in the Wall"** (the Human's manifestation). Writer: `Act6CardLadderPage` on victory.
4. **One stance flag** picked from a closing wheel UI (any one of seven, OR-gate):
   - `act6_confession_close_empathy` — "You both did what you could."
   - `act6_confession_close_challenge` — "You both made choices you're hiding from."
   - `act6_confession_close_refusal` — "I don't forgive either of you."
   - `act6_confession_close_reluctant_ally` — "We move forward anyway."
   - `act6_confession_close_partial` — hedge.
   - `act6_confession_close_oracle_sense` — mystical (Oracle-class flavor).
   - `act6_confession_close_practical` — tactical (Soldier/Engineer flavor).

### Act 6 completion
Gate fires (`useNarrativeIntegration.ts:1308–1325`): sets `act_6_complete` + `act_7_started`. Advances `narrativeAct` to 7. 4 cards unlock. Conspiracy Board #6 opens.

---

## Act 7 — "The Convergence" (15-recruitment trigger; 2 sub-flags; 12-reading endings)

**Trigger:** Army Recruitment **≥ 15 missions** AND `act_6_complete`. Watcher: `useNarrativeIntegration.ts:1327–1337`. Threshold: `hasReachedAct7Threshold(15)` (`armyRecruitment.ts`).
**Page:** `/act7-ladder` → `Act7CardLadderPage.tsx`.
**Source:** `apps/shared/act7CompletionGate.ts:69–106`.

### The 2 sub-conditions (AND-gate)

1. **`slideshow_act_7_convergence_intro_complete`** — Opening cinematic.
2. **`act7_arc_closes`** — Defeat the **Convergence Seat opponent** (the final card battle of the entire narrative spine). Also sets `act7_convergence_landing` for downstream systems.

### Optional final stance flags (NOT required for completion)

You can close Act 7 without picking a stance — silence is itself a canon stance. But if you do pick:
- `act7_s1_humanity_path` — Humanity (Light) ending
- `act7_s1_machine_path` — Machine (Dark) ending
- `act7_s1_balance` — Balance ending
- `act7_s1_soldier_command` — Soldier Command ending

Each ending plays its epilogue from `act7Epilogues.ts:66–179`. Beats have **path variants** (pathA/pathB/pathC) keyed to the Act 3 disclosure ending → 4 stances × 3 paths = **12 distinct readings**. The Antiquarian's framing line: *"I had read this page already. You chose which page to turn to — not what was written on it. Both are true. The Cycle records both."*

### Act 7 completion + Prestige rollover
Gate fires (`useNarrativeIntegration.ts:1339–1354`): sets `act_7_complete` + `narrative_spine_complete`. Conspiracy Board #7 opens.

**Prestige carryover rules** (`PRESTIGE_CARRYOVER_RULES` in `actsFourFiveShells.ts`, applied via `applyPrestigeCarryover()` in `witnessingIntegrations.ts:59–82`):
- Loredex entries: **100%** carry
- Bond peak memories: **50%** carry
- Narrator dominance: **0%** (always reset)
- Dischordia cards: **25%** (slideshow cards only)
- Witnessing milestones: **100%** carry
- Memorable moments: **10%** (Antiquarian's curation)

Then `narrativeAct` resets to Prelude state. You play again with multiplied XP and persistent bonds.

---

## Conspiracy Boards — the parallel mystery race (cross-act, server-wide)

Source: `apps/shared/conspiracyBoards/definitions.ts:29–151`, `clueDrops.ts:35–127`, `apps/server/routers/conspiracy.ts`. Surface: `/conspiracy-board`.

### 7 boards (one per act)

| Board | Act | Clues req'd | Reveal flag |
|---|---|---|---|
| `first_memory` | 1 | 5 | `secret_act_1_revealed` |
| `inheritance_ledger` | 2 | 5 | `secret_act_2_revealed` |
| `thought_virus` | 3 | 6 | `secret_act_3_revealed` |
| `project_celebration` | 4 | 7 | `secret_act_4_revealed` |
| `kaels_revenge` | 5 | 5 | `secret_act_5_revealed` |
| `watcher_infiltration` | 6 | 6 | `secret_act_6_revealed` |
| `recruiter_defection` | 7 | 5 | `secret_act_7_revealed` |

### Clue drop sources (8)

| Event | Drop rate | Pool size |
|---|---|---|
| `pvp_card_win` | 15% | 7 clues |
| `pvp_card_loss` | 5% | 2 clues |
| `pvp_chess_win` | 15% | 5 clues |
| `pvp_chess_loss` | 5% | 2 clues |
| `coop_raid_clear` | 35% | 8 clues |
| `act_completed` | 100% | 10 clues |
| `kael_fragment_unlocked` | 100% | 2 clues |
| `narrative_milestone` | 50% | 6 clues |

### Mechanism

1. Game event fires (e.g., PvP card win). Server rolls drop chance.
2. On hit, picks a random clue from the source pool. Adds to player's `userClueProgress` for any board that accepts it.
3. Auto-attempts solve via `attemptSolveForUser()` in `conspiracyService.ts`. If clues ≥ board's `cluesRequired`, fires solve.
4. **First server-wide solve** sets the act's `secret_act_N_revealed` flag, granting the corresponding **secret card** to **everyone on the server** (`special_editions.ts:14–138`). First-discoverer guild members get the Tier 3 "Queen of Truth" title.

### Oracle Pool peek
Pay 50 Dream tokens to view rival guilds' progress on a board (`conspiracy.ts:107–185`). Tier 4 guild feature.

---

## Witnessing system (Epoch Chronicle + Light/Dark votes + song unlocks)

Source: `apps/shared/witnessingYearOne.ts`, `loredexSongMap.ts`, `WitnessingHubPage.tsx`.

### Epoch Chronicle
Server-side historical record of major narrative events + player-community votes. Each entry maps to a flag (`prelude_complete`, `act_1_complete`, `act_1_cycle_a_complete`, `thaloria_cinematic_seen`, etc.). Records timestamp + community consensus + Loredex unlock.

### Light/Dark vote
The **only mandatory player vote** in the spine, fired during the Last Words full-song cutscene at ~66s (chorus-1 line). UI: `ChoicePillarLightDark.tsx`. Writes `lightDarkAlignment` ∈ {light, dark}. All four authority/light combos (Overturn/Sentence × Light/Dark) are fully authored through the rest of the game.

### Song unlocks
Conspiracy board solves and major narrative milestones unlock canonical songs in your Loredex. Mapping in `loredexSongMap.ts`. Example: `thaloria_cinematic_seen` → "planet-of-the-wolf" from `location_thaloria` Loredex entry.

---

## Player objective checklist (executable, top-to-bottom)

### Pre-game
- [ ] Title screen → New Game.

### Prelude (15 beats)
- [ ] **Beat A** (auto, 35s) — wake.
- [ ] **Beat A.5** (auto, 15s) — corridor.
- [ ] **Beat B** (auto, 20s) — escape.
- [ ] **Beat C** ⚡ — pick one of 3 role chips: Engineer / Assassin / Oracle.
- [ ] **Beat C.5** (auto, 20s) — window.
- [ ] **Beat D** ⚡ — read **all 3** mission slates: Kelvara / Last Courier / Outer Dusk.
- [ ] **Beat D.5** (auto, 25s) — galley.
- [ ] **Beat E** ⚡ — examine ≥1 Mess Hall hotspot (toy soldier or diploma).
- [ ] **Beat F** ⚡ — tap lockbox; advance 3 memo pages; click "Hold the letter."
- [ ] **Beat F.5** (auto, 90s) — empty chair.
- [ ] **Beat G** (auto, 25s) — Medical Bay.
- [ ] **Beat H** ⚡ — click envelope; let Locke's VO play; close after sentence-6 cyan bloom.
- [ ] **Beat H.5** (auto, 20s) — memo pile.
- [ ] **Beat I** (auto, 40s) — Bridge / Witnessing Hub bloom.
- [ ] **Beat J** (auto, ~8m10s) — Engineer's Log 5 + Last Words tease. **No vote here.**

### Post-Prelude (3 crew missions; mission 3 is the Act 1 gate)
- [ ] Crew Mission 1 — *The Wreck Next Door* (Patch).
- [ ] Crew Mission 2 — *The Signal from Nowhere* (Zephyr-9).
- [ ] **Crew Mission 3** — *The Burnt Card* (Little One). Sets `prelude_complete` → Act 1 armed.

### Hour 1 — Cryo Bay mystery (cascade kickoff)
- [ ] LOOK at any 1 Cryo hotspot (sets `cryo_mystery_first_clue_found`).
- [ ] USE Data Slate → pickup `data-slate-fragment`.
- [ ] USE Personal Effect → pickup `torn-id-tag`.
- [ ] **Combine** them at autopsy console → sets `cryo_mystery_victim_identified` → Medical Bay unlocks.

### Hour 1 — Bridge cascade
- [ ] Visit Bridge (auto-flag `bridge_systems_restored` fires).
- [ ] Click captains-chair → pickup `captains-master-key` AND `captains-final-log`.
- [ ] Click nav-console → solve 4-glyph puzzle (missing glyph = third-class Mechronis character) → `fast_travel_unlocked`.

### Hour 1–2 — Medical Bay puzzle + spread
- [ ] Solve Medical Bay safe (numeric keypad puzzle) → pickup `observation-keycard` → Observation Deck unlocks.
- [ ] Visit Archives (gated only on Bridge visit) → Loredex + Dischordia unlock.
- [ ] Visit Comms Array (gated on `bridge_systems_restored`, set automatically) → auto-flag `power_grid_restored` fires → Engineering unlocks.
- [ ] Visit Observation Deck (have `observation-keycard`).

### Hour 2–4 — Engineering cascade
- [ ] Visit Engineering (auto-flag `combat_systems_online` fires) → Armory unlocks.
- [ ] Visit Forge Workshop (gated only on Engineering visit).
- [ ] Visit Armory (auto-flag `cargo_bay_pressurized` fires) → Cargo Hold unlocks.
- [ ] Visit Cargo Hold → Trade Empire goes live.
- [ ] Visit Captain's Quarters (have `captains-master-key`).
- [ ] After 5 items collected → Antiquarian's Library unlocks.

### Hours 4–6 — Act 1 (12 battles, trial, vote)
- [ ] Win 3 Dischordia matches → `act_1_cycle_a_complete`.
- [ ] Win 5 more (8 total) → `act_1_cycle_b_complete`.
- [ ] Continue to battle 11; **lose to Warlord's Nano-Swarm** (unkillable opponent).
- [ ] Battle 12 — **Authority Trial**, 10 phases. Need deck: 2× defensive, 2× narrative, 4× evidence, 4× reactive.
- [ ] Win 12 total → `act_1_cycle_c_complete`.
- [ ] During Last Words cutscene at ~66s, **click Light or Dark** at the choice pillar.
- [ ] Trial resolves → `act1_authority_outcome` set.
- [ ] **Gate fires:** `act_1_complete`. Advances to Act 2.

### Hours 6–8 — Act 2 (4 sub-flags, AND)
- [ ] Craft **3+ cards** at Engineering bench → `crafting_mastered`.
- [ ] Win **5+ chess matches** → `chess_mastered`.
- [ ] Win **3+ Collector's Arena matches** → triggers Thaloria cinematic → `thaloria_cinematic_seen`.
- [ ] **Lose ≥1 match to the Game Master** (Chess Climb) → `game_master_loss`.
- [ ] **Gate fires:** `act_2_complete` + `trade_empire_unlocked`. Advances to Act 3.

### Hours 8–10 — Act 3 (cinematic + ladder + path lock)
- [ ] Have ≥5 rooms unlocked total.
- [ ] Watch Act 3 opening cinematic ("I Am the Eyes That Watch").
- [ ] Defeat all 3 Act 3 ladder opponents (Substrate Echo → Kael Archivist → Substrate Warden) → `act3_kael_logs_unlocked`.
- [ ] Run a Trade Empire infiltration chain. **Pick one ending**: Insurgency / Empire / Hierarchy.
- [ ] **Gate fires:** `act_3_complete`. Advances to Act 4.

### Hours 10–12 — Act 4 (cinematic + path flag + 1 prisoner)
- [ ] Watch Act 4 opening cinematic ("The Revelation").
- [ ] Have one of `act1_path_A` / `act3_partial_share` / `act3_full_secret` set (was set during Act 1+3 dialog choices).
- [ ] Win **at least one** Prisoner chapter in Collectors Arena: Cell / Extraction / Warlord Rematch / White Oracle.
- [ ] (Optional sibling) Act 4.5: Dead Man's Circuit racing OR Degen Casino.
- [ ] **Gate fires:** `act_4_complete`. Advances to Act 5.

### Hours 12–15 — Act 5 (4 sub-flags including 5 recruitment)
- [ ] Watch Act 5 opening cinematic ("The Reckoning").
- [ ] Open Act5InterludePage → view Kael's 5-sector star map → `act_5_map_revealed`.
- [ ] Complete Cades campaign mission 7 (Iron Lion's last stand on Veridian VI) → `cades_m7_complete`.
- [ ] Complete **5+ Army Recruitment missions**.
- [ ] **Gate fires:** `act_5_complete`. Advances to Act 6.

### Hours 15–17 — Act 6 (cinematic + 2 confessions + 1 stance)
- [ ] Watch Act 6 opening cinematic ("The Confession").
- [ ] Win Act 6 ladder battle 1 vs. "The Woman She Was" → `act6_elara_confession_heard`.
- [ ] Win Act 6 ladder battle 2 vs. "The Detective in the Wall" → `act6_human_confession_heard`.
- [ ] At closing wheel, click **one of 7** stances: empathy / challenge / refusal / reluctant_ally / partial / oracle_sense / practical.
- [ ] **Gate fires:** `act_6_complete`. Advances to Act 7.

### Hours 17–22 — Act 7 (15 recruitment + cinematic + arc closes)
- [ ] Complete **15+ Army Recruitment missions** (10 more after Act 5's 5).
- [ ] Watch Act 7 opening cinematic ("The Convergence").
- [ ] Defeat the Convergence Seat opponent → `act7_arc_closes`.
- [ ] (Optional) Pick a stance: Humanity / Machine / Balance / Soldier Command.
- [ ] **Gate fires:** `act_7_complete` + `narrative_spine_complete`. Prestige carryover applies. `narrativeAct` resets to Prelude.

---

## What's not developed (gaps)

Sorted by impact. Same as before but tightened for the puzzle/objective focus:

### Critical narrative blockers
1. **Trade Empire mission loop** — the Act 3 path-lock infiltration mechanic ships at the schema level (8 cover graph, faction adjacency, detection difficulty) but the mission-loop runtime that drives the chain is unbuilt. Phase D.5 schema landed (`tradeRouteSaturation`, `tradeResearchRaces`, `convergenceClimaxState` in `apps/db/schema.ts:6978–7052`) without consumers. **Currently the Act 3 path-lock's three endings cannot fire via gameplay.** Pivotal blocker.
2. **Soul Stones corruption/purification economy** — fully designed in `SOUL_STONES_SYSTEM.md` (4 tables + 4 procedures, demon-summoning braid through Acts 4–7). **Zero runtime presence.** Cannot fire.
3. **Global Light/Dark alignment meter** — `apps/shared/globalAlignment*` declared, schema table missing. The Act 1 Light/Dark vote writes a flag but no global meter visualizes the cumulative axis.

### Significant content gaps
4. **Cades campaign mission 7** — declared as the Act 5 sub-flag `cades_m7_complete`. Cades is an external Unreal project (`apps/shared/crewDmcBridge.ts` only has stubs). Without the external project running, Act 5 cannot complete.
5. **Dead Man's Circuit** — Act 4.5 sibling track. External Godot project; bridge stubs only. Cannot fire.
6. **Mobile Narrator adoption** — only ArkExplorerPage consumes the 495-line Yin/Yang runtime. 5 routes designed; none wired.
7. **Shadow Tongue room coverage** — 17 of 26 mystery rooms have no module; Conspiracy boards 4–7 evidence-starved.
8. **5 named cutscene components missing** — Awakening, FirstHumanContact, MemoryRecovery, BreakingPoint, ThoughtVirus.
9. **Act 6/7 opponent dialog tables** — thin per `narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md`; dialog lives inline in `narrativeActs.ts`.
10. **Per-step reactive companion comments** (`cc_act6_*`, `cc_act7_*`) — ~50% coverage.

### Silent unlocks needing tutor cards
11. **Character Sheet** — appears on menu hour 0 with no in-fiction explanation.
12. **Crew Activity Feed** — silent unlock on `first_crew_member_born`.
13. **Bestiary** — silent unlock on `first_fight_won`.
14. **Loredex (partial)** — room-discovered but no system tutor introduces it.
15. **Combat Simulator** — room-discovered, no tutor.
16. **Daily Quests** — room-discovered, no tutor.

### Sub-system gaps
17. **Pet/specimen breeding loop** — design only; bloodline-threshold card unlocks (gate exists in `expansionUnlockService.ts`) cannot fire.
18. **Living Character Sheet UI** — designed, zero files.
19. **Draft tournament bracket UI** — router exists, frontend mocked.
20. **War map territorial control** — `tradeSectorControl` schema without a loop.
21. **Casino panel bet logic** — per-panel wiring incomplete (`CasinoGamePanels.tsx:3`).

### Media-blocked
22. **Dreamer Visions 2–4 slideshows** — pending CDN frames.
23. **5 Trade Empire VO speakers** — `TODO_LOCKE_VOICE`, `TODO_ANTIQUARIAN_VOICE`, etc.
24. **Architect Transmission First Contact** — videoUrl + VO pending production.
25. **Wawa-lipsync** integration on character sprites — text-only.
26. **Act 7 Convergence final tone pass** — deferred until cinematic lock.

### Forward infrastructure (intentionally inert)
27. **DLC chapter card gates** — 9 chapters declared in `dlcChapterRegistry.ts`; **0 cards use the `dlc_chapter_completion` gate yet**.
28. **Bloodline-gated cards** — gate declared, 0 cards use it.
29. **Founding Author / Authors Edition entitlements** — gates exist, no store products grant them yet.

### DB hygiene
30. **78 drifted SQL migrations** — `migration-drift.baseline.json`; CI compensates with cold-boot bootstrap.

---

## Verification

1. `pnpm ship:check` — confirms 16 PASS / 6 RATCHET / 0 FAIL.
2. `pnpm dev` → `http://localhost:5173/prelude` → walk the checklist top-to-bottom. Flag panel at `/admin/health`.
3. Inspect a beat: `apps/shared/preludeSequence.ts` → `PRELUDE_BEATS`.
4. Inspect a room's unlock chain: `apps/client/src/contexts/GameContext.tsx` → grep room id (e.g. `"medical-bay"`) in ROOM_DEFINITIONS.
5. Inspect a puzzle: `apps/shared/cryoBayMystery.ts:770–788` (combine), `apps/shared/bridge.ts:326–364` (nav-calibration).
6. Inspect a crafting recipe: `apps/shared/engineering.ts:61–152`.
7. Inspect an act gate: `apps/shared/act{N}CompletionGate.ts` → `deriveAct{N}CompletionStatus()`.
8. Confirm the Authority Trial mechanic: `docs/production/act1/authority-trial-phase-mechanic.md` §§2–6.
9. Inspect conspiracy board clue drops: `apps/shared/conspiracyBoards/clueDrops.ts:35–127`.
10. Confirm flag firings: `apps/client/src/hooks/useNarrativeIntegration.ts:443–1414`.

---

## Bottom line

A complete playthrough is: 15 prelude beats (6 require clicks) → 3 crew missions (mission 3 = Burnt Card unlocks Act 1) → solve cryo combine → visit rooms in cascade order with the four auto-flags doing the heavy lifting (Bridge → Comms Array → Engineering → Armory → Cargo Hold) → solve nav glyph + medical safe + collect 5 items along the way → win 12 Act 1 battles + lose battle 11 + survive 10-phase trial + pick Light/Dark → fill 4 Act 2 sub-flags → finish 3-battle Act 3 ladder + pick infiltration ending → 1 Act 4 prisoner chapter → 5 recruitment missions + Cades M7 + map view for Act 5 → 2 confession battles + 1 stance for Act 6 → 15 total recruitment + Convergence Seat for Act 7 → prestige rollover.

The cascade is the point: the auto-flag chain (visit X → unlock Y) is what makes the Ark feel like a living system. The four mandatory puzzles (cryo combine, nav glyph, medical safe, conspiracy board clue collection) are the four moments where you actually solve something. Everything else is fight, click, choose.
