# ALL ACTS ROADMAP — Dischordian Saga

**Purpose:** Combined timeline merging the 7-act narrative spine
(`narrativeActs.ts`) with the witnessing system's horizontal layers
(`witnessingHub.ts`, `witnessingEvents.ts`, `witnessingYearOne.ts`)
so that Act 1 foundation decisions are forward-compatible with
everything that follows.

**Two source timelines exist in the codebase:**
- **Vertical (story spine):** `apps/client/src/data/narrativeActs.ts`
  — Acts 1–7, dialog, choices, branching paths
- **Horizontal (witnessing layers):** `apps/shared/witnessing*.ts`
  — Year One Calendar, bond milestones, Kael Fragments, Engineer
  Recordings, Chronicle entries, prestige carryover, Trophy Room

These timelines use **different act names and boundaries.** This
document reconciles them into one reference.

**Authoritative source files:**
- `narrativeActs.ts` — act boundaries, dialog, choices
- `witnessingHub.ts` — act detection + Hub dashboard derivation
- `witnessingEvents.ts` — §14.1 milestone events (bond-gated)
- `witnessingYearOne.ts` — Year One Calendar + Chronicle entries
- `witnessingRuntime.ts` — progression helpers (items 8–12)
- `witnessingIntegrations.ts` — prestige carryover + Trophy Room
- `witnessingCanonXref.ts` — Loredex cross-references
- `act2Interlude.ts` — §6.2–§6.4 data shell
- `act3EyesBiography.ts` — §7 Eyes biography + infiltration paths
- `actsFourFiveShells.ts` — §9–§11 Collector's Arena + racing + FPS

---

## Act name reconciliation

| # | `narrativeActs.ts` | `witnessingHub.ts` | Used below |
|---|---|---|---|
| — | *(Prelude)* | "The Ark Awakens" | **Prelude — "The Ark Awakens"** |
| 1 | "The Signal" | "The Twelve Steps" | **Act 1 — "The Twelve Steps" / "The Signal"** |
| 2 | "The Whisper" | "The Engineer's Bench" | **Act 2 — "The Engineer's Bench" / "The Whisper"** |
| 3 | "The Offer" | "The Eyes in the Dark" | **Act 3 — "The Eyes in the Dark" / "The Offer"** |
| 4 | "The Revelation" | "The Prisoner" | **Act 4 — "The Prisoner" / "The Revelation"** |
| — | *(within Act 5)* | "Dead Man's Circuit" | **Act 4.5 — "Dead Man's Circuit"** |
| 5 | "The Map" | "The Reckoning" | **Act 5 — "The Reckoning" / "The Map"** |
| 6 | "The Confession" | *(not in witnessing)* | **Act 6 — "The Confession"** |
| 7 | "The Convergence" | *(not in witnessing)* | **Act 7 — "The Convergence"** |

---

## Year One combined timeline

The Year One Calendar (`witnessingYearOne.ts`) maps 12 real months
to gameplay phases. Each month fires a login brief + raises a flag.
Milestones, Kael Fragments, Engineer Recordings, and Chronicle
entries layer on top of the act progression.

| Mo | Calendar title | Story phase | Systems active | Witnessing milestone | Chronicle entry |
|---|---|---|---|---|---|
| 1 | First Light | **Prelude** — crew join | Cryo bay, Bridge | — | `prelude_complete` → "The Prelude Closes" |
| 2 | The Corridor You Forgot | **Prelude** — missions | Engineering, Matrix of Dreams | — | — |
| 3 | The First Quiet | **Act 1 opens** — signal | Mobile narrator, Comms Array | — | — |
| 4 | Kindergarten of Gods | **Act 1 Cycle A** — Chambers | Card game, Dischordia cycle | Bond 40 → "Two Witnesses Remember" | `act_1_cycle_a_complete` → "The Kindergarten Lets Out" |
| 5 | The Academy Opens | **Act 1 Cycle B** — Student years | Mechronis professors, Chess | — | `act_1_cycle_b_complete` → "Mechronis Closes Its Doors" |
| 6 | The Engineer's Bench | **Act 2** — interlude | Crafting, Chess depth | Bond 60 → "Silence of Two Witnesses" | `act_1_complete` → "Last Words"; `act_2_complete` → "The Bench Goes Silent" |
| 7 | The Helmet in the Grass | **Act 3 opens** | Trade Empire, Loredex | "Thaloria Echo" (bond-independent) | — |
| 8 | The Eyes Fall | **Act 3** — Eyes biography | Trade Empire agents, Ripple engine | — | — |
| 9 | The Infiltration Choice | **Act 3** — path commit | Insurgency / Empire / Hierarchy | — | — |
| 10 | The Palimpsest Tunes In | **Appendix C** — game show | Quiz show, Darren arc | — | — |
| 11 | The Prisoner's Memory | **Act 4** — memory extraction | Terminus Swarm, Kael Fragments | Bond 80 → "Two Witnesses Meet" | `act4_prisoner_oracle_complete` → "Lay Down the Fight" |
| 12 | The Reckoning | **Act 5 + year end** | Prestige cycle, Antiquarian | "The Bulb Dims" / "A Sector Wakes" | `vortex_core_cleared` → "The Line Held" |

**Beyond Year One:** Acts 6–7 ("The Confession", "The Convergence")
and the prestige loop fire after the 12-month calendar. The
witnessing system currently has no calendar entries for them.

---

## Horizontal layers that weave through all acts

### Narrator bond progression

Two systems define bond thresholds — they are complementary, not
contradictory. The narrative acts define the *range* the bond
occupies during each act. The witnessing milestones define *events*
that fire at specific thresholds.

```
Bond 0 ──── Prelude (Elara only; The Human silent)
Bond 10 ─── Act 1 opens (dual narrator active)
  ┊
Bond 40 ─── ★ MILESTONE: "Two Witnesses Remember"
  ┊           Elara: "I was a public servant once. On Atarion."
  ┊           The Human: "I used to be an investigator."
Bond 60 ─── ★ MILESTONE: "The Silence of Two Witnesses"
  ┊           Both narrators go silent. Light/Dark energy freezes.
  ┊
Bond 75 ─── Act 4 trust resolution (reconciled / fragile / broken)
  ┊
Bond 80 ─── ★ MILESTONE: "The Two Witnesses Meet"
  ┊           Memorial Corridor. Caravaggio light. Your judgment.
Bond 90 ─── Act 6 confessions
  ┊
Bond sync ── Act 7 convergence (voices align for the first time)
```

### Kael Fragment questline (Appendix B, F1–F6)

Six fragments discovered across the game. Defined in
`appendixBKaelQuestline.ts`, tracked by `kaelFragmentWatchers.ts`.
The questline completes when all 6 flags are set, unlocking the
Bridge of Kael post-credits (`actsFourFiveShells.ts §11.4`).

### Engineer holographic recordings (7 total)

Discovered one per act-transition beat. Defined in
`engineerRecordings.ts`. Each recording surfaces an Antiquarian
Chronicle entry (`witnessingYearOne.ts` flags
`engineer_recording_1_discovered` through `_7_discovered`). The
recordings tell the Engineer's full story: Celebration childhood →
invisible network → Eyes partnership → Authority arrest →
Ark 7 escape plan → Agent Zero sacrifice → final words.

### The Palimpsest game show (Appendix C)

A parallel content track surfacing in Month 10. Not part of the
7-act spine — it runs alongside Acts 3–5. Key beats from
`witnessingCanonXref.ts`:
- §C.3 — Game Master mask as game-show host
- §C.4 — The Inventor hacks Episode 12
- §C.5 — Darren Fessler's Clause 14 substitution (dies in player's
  place; yields THE ASSISTANT card)
- §C.6 — Host-is-the-Meme reveal (Noise overwrites Signal)

### Prestige carryover rules (`witnessingIntegrations.ts`)

| Kind | Carry % | Note |
|---|---|---|
| Loredex entries | 100% | Antiquarian never un-knows |
| Bond peak memories | 50% | Half carry, half re-earn |
| Narrator dominance | 0% | §1.5 invariant — always reset |
| Dischordia cards | 25% | Slideshow cards only |
| Witnessing milestones | 100% | Historical events |
| Memorable moments | 10% | Antiquarian's curation |

### Trophy Room Witnessing Wall

`witnessingIntegrations.ts` — authored cards, dead pets, dismissed
narrator lines, Dead Man's Circuit identity chain, Kael Fragments,
memorable moments. Pure display; reads collection state.

### Captain's Quarters sleep-for-bond

Once per 24h real time: +1 bond to every unlocked companion.
`witnessingIntegrations.ts`.

---

## Per-act outlines

### Prelude — "The Ark Awakens"

**Trigger:** Game start.

**Premise:** You wake on the Ark. Elara is your angel-narrator. You
recruit three crew members (Patch, Zephyr-9, Little One), complete
three missions (wreck_next_door, signal_from_nowhere, burnt_card),
and find the burnt card that gates Act 1.

**Data shells:**
- `preludeCrew.ts` — 3 crew members with join sequences
- `preludeCrewMissions.ts` — 3 missions with `flagsOnSuccess`
- `preludeSequence.ts` — Beat A–J cutscene + asset registry
- `narrativeActs.ts` — no formal Prelude entry (it's pre-act)

**Witnessing layers active:**
- Year One Calendar months 1–2 ("First Light", "The Corridor You
  Forgot")
- Chronicle: `prelude_complete` → "The Prelude Closes"
- `witnessingRuntime.ts` items 8: derivePreludeIntroState(),
  getNextPreludeCrewToJoin(), getAvailablePreludeMissions()

**Flags written:** `prelude_complete`, `prelude_burnt_card_found`,
`humanContactMade`, `humanContactSecret`, `mission_board_read_*` ×3,
`beat_f_memo_read`, sandwich recipe flag.

**Completeness:** **S** — 12/13 subsystems ready; 1 VO line
pending; runtime handoff dispatcher NOT wired (ship-blocker).

---

### Act 1 — "The Twelve Steps" / "The Signal"

**Trigger:** Communications Array room on the Ark. Requires
`prelude_burnt_card_found`.

**Premise:** First contact with The Human — a signal hidden in the
substrate layer below Elara's operating system. Three memoir cycles
(Chambers, Student years, Nexon/Trial) ending in the §5.8 Authority
trial and the §5.8.1 Light/Dark alignment choice.

**Data shells:**
- `narrativeActs.ts:78–372` — ACT_1_THE_SIGNAL (3 scenes, 3 paths:
  Willing Disclosure, Discovery, Betrayal)
- `act1Opponents.ts` — 14 opponent data shells
- `tcg-core/story/chapters.ts` — 17 StoryEncounter entries

**Witnessing layers active:**
- Year One Calendar months 3–5 ("The First Quiet", "Kindergarten of
  Gods", "The Academy Opens Its Doors")
- Milestone: Bond 40 → "Two Witnesses Remember" (fires mid-act)
- Chronicle: `act_1_cycle_a_complete` → "The Kindergarten Lets Out",
  `act_1_cycle_b_complete` → "Mechronis Closes Its Doors",
  `act_1_complete` → "Last Words"
- `witnessingRuntime.ts` item 9: getNextAct1Opponent(act1CardWins)
- Kael Fragment F1 may unlock (depends on progression)
- Engineer Recording 1 may trigger ("The Bench Speaks")

**Systems introduced:**
- Dual signal protocol (Elara + The Human)
- Three-cycle card-battle memoir (12 + 2 special matches)
- §5.5 Warlord lockout (engine + UI shipped)
- §5.7 Public-witness verdict stream (20% — TranscriptColumn missing)
- §5.8 Authority trial machine (engine + UI shipped)
- §5.8.1 Light/Dark alignment choice (shipped)

**Flags written:** `act1_path_A/secret`,
`architect_reality_edit_witnessed`, `act1_authority_outcome`,
`lightDarkAlignment`, `act_1_cycle_a_complete`,
`act_1_cycle_b_complete`, `act_1_complete`.

**Flags read:** All Prelude handoff flags.

**Completeness:** **M** (64%) — narrative authored; engine shipped;
4 critical blockers (boss decks, TranscriptColumn, 8 speakers VO,
campaign-state persistence).

---

### Act 2 — "The Engineer's Bench" / "The Whisper"

**Trigger:** Complete first game-mode tutorial. Hub detects via
`act_2_started` or `crafting_mastered` flag.

**Premise:** The Human begins offering commentary during gameplay.
Three new systems unlock: Crafting Bench, Chess depth progression,
and the Two Game Masters.

**Data shells:**
- `narrativeActs.ts:381–498` — ACT_2_THE_WHISPER dialog + choices
- `act2Interlude.ts:20–186`:
  - §6.2 `ENGINEERS_BENCH_FRAMING` — 6 framing lines (firstPowerOn,
    elaraAmbient, humanAmbient, firstLightCraft, firstDarkCraft,
    outOfMemoryEnergy)
  - §6.3 `ZEPHYR_9_CLASSROOM` — 4 chess-depth tiers (1, 3, 5, 8)
    with teaching lines + reward unlocks
  - §6.4 `THE_LEFT_GAME_MASTER` + `THE_RIGHT_GAME_MASTER` — full
    profiles with Acts 3–4 culling-boss roles

**Witnessing layers active:**
- Year One Calendar month 6 ("The Engineer's Bench")
- Milestone: Bond 60 → "The Silence of Two Witnesses" (fires
  mid-to-late Act 2; both narrators go silent, Light/Dark energy
  freezes)
- Chronicle: `act_2_complete` → "The Bench Goes Silent"
- `witnessingRuntime.ts` item 10: getActiveEngineersBenchLine(),
  getActiveAct2GameMaster(moralityScore)
- Engineer Recordings 2–3 may trigger ("The Prince's Truth",
  "Ghosts in the System")

**Systems introduced:**
- Crafting Bench — `apps/server/routers/crafting.ts` (recipes +
  costs exist; NO UI; needs Memory Energy currency)
- Chess depth — `ChessPage.tsx` standalone; NOT wired to §6.3 tiers
- Game Masters (Left: tactical; Right: improvisational)
- Companion trust-ladder first unlocks

**Flags written:** `chess_depth`, `act_2_started`,
`crafting_mastered`, `act_2_complete`.

**Flags read:** `lightDarkAlignment` (crafting branches),
`act1_authority_outcome` (narrator framing).

**Completeness:** **M** — data shell complete; chess + crafting
standalone but NOT wired to narrative. No Memory Energy. No Bench UI.

---

### Act 3 — "The Eyes in the Dark" / "The Offer"

**Trigger:** Unlock 5 rooms on the Ark. Hub detects via
`act_3_starting` or infiltration commit flags.

**Premise:** The Human offers Kael's pre-Fall navigation logs. Player
chooses how much to tell Elara. Trade Empire faction arcs unlock.
The Eyes' full biography is surfaced.

**Data shells:**
- `narrativeActs.ts:506–619` — ACT_3_THE_OFFER dialog + choices
- `act3EyesBiography.ts` (394 lines):
  - §7 `EYES_BIOGRAPHY` — 7 life stages (recruitment → death in
    grass) surfaced across Trade Empire hubs
  - §7.3 `INFILTRATION_PATHS` — 3 endings: Insurgency, Empire,
    Hierarchy (each with commitFlag, milestoneFlag, endingFlag)
  - §8 `TRADE_EMPIRE_IMPROVEMENTS` — 10-item feature list

**Witnessing layers active:**
- Year One Calendar months 7–9 ("The Helmet in the Grass", "The
  Eyes Fall", "The Infiltration Choice")
- Milestone: "Thaloria Echo" (bond-independent; fires on Thaloria
  cinematic trigger)
- Milestone: "The Engineer Speaks" (if Insurgency infiltration
  completes — Engineer's voice returns via Signal Beacon)
- `witnessingRuntime.ts` item 11: deriveInfiltrationProgress(),
  getActiveInfiltrationPath()
- `witnessingCanonXref.ts`: Eyes entity cross-refs (entity_22)
- Engineer Recordings 4–5 may trigger ("The Line That Was Crossed",
  "Instructions for Theft")
- Kael Fragments F2–F3 may unlock

**Systems introduced:**
- Trade Empire (Infiltration Runner, faction arcs)
- Eyes biography timeline across 4 Trade Empire hubs
- Three infiltration paths with distinct endings

**Flags written:** `act3_insurgency_committed` /
`act3_empire_committed` / `act3_hierarchy_committed`, infiltration
milestone + ending flags, Eyes roster unlock, `act_3_starting`.

**Flags read:** `act1_path_A/secret`, `chess_depth`.

**Completeness:** **M** — data shells authored; Trade Empire partial;
Eyes voice layer §10 not implemented.

---

### Act 4 — "The Prisoner" / "The Revelation"

**Trigger:** Level 5 or 3 completed game modes. Hub detects via
`act_4_started` or `act_4_prisoner_cell_complete`.

**Premise:** The truth about The Human emerges — one of three paths
depending on Act 1 choice. Collector's Arena is reframed as memory
extraction from Kael. Army recruitment unlocks.

**Data shells:**
- `narrativeActs.ts:637–884` — ACT_4_THE_REVELATION (3 paths:
  Willing Disclosure, Discovery, Betrayal; full VO + dialog wheels)
- `actsFourFiveShells.ts:20–110` — §9 `ACT_4_PRISONER_CHAPTERS`:
  4 boss fights as Kael memories (The Cell, The Extraction, Warlord
  Rematch, White Oracle Meets)

**Witnessing layers active:**
- Year One Calendar month 11 ("The Prisoner's Memory")
- Milestone: Bond 80 → "The Two Witnesses Meet" (Memorial Corridor;
  Caravaggio light; player's judgment)
- Chronicle: `act4_prisoner_oracle_complete` → "Lay Down the Fight"
- `witnessingCanonXref.ts`: Kael entity (entity_49), Warlord
  (entity_10), White Oracle (entity_59) cross-refs
- Kael Fragments F4–F5 may unlock
- Engineer Recording 6 may trigger ("A Boy from Celebration")

**Systems introduced:**
- Collector's Arena story-mode reframe (fights = memory extraction)
- Emotional trust branches (reconciled / fragile / broken)
- War Room access + army recruitment begins

**Flags written:** `act_4_started`, `act_4_prisoner_cell_complete`,
`act4_prisoner_oracle_complete`, trust state (bond rises to 70–75),
recruitment unlock.

**Flags read:** `act1_path_A/secret/partial_share`, infiltration
flags from Act 3.

**Completeness:** **M** — narrative authored; Collector's Arena
standalone; story framing not integrated.

---

### Act 4.5 — "Dead Man's Circuit"

**Trigger:** After Act 4. Hub detects via `act_4_5_started` or
`act_4_5_circuit_complete`.

**Note:** This act exists ONLY in the witnessing system
(`witnessingHub.ts:70`). In `narrativeActs.ts`, Dead Man's Circuit
content is part of Act 5 ("The Map"). The witnessing system splits
it out because the racing/casino gameplay loop is mechanically
distinct from the FPS missions + army recruitment that follow.

**Data shells:**
- `actsFourFiveShells.ts:114–165` — §10 `DEAD_MANS_CIRCUIT_TRACKS`:
  identity-as-wager racing + casino (Degen's Pact)

**Witnessing layers active:**
- `witnessingIntegrations.ts`: Trophy Room Witnessing Wall tracks
  DMC identity chain (Student → Seeker → Detective → The Last)

**Systems introduced:**
- Racing (Dead Man's Circuit — identity-chain authoring)
- Casino (entropy as game, Degen's Pact)

**Flags written:** `act_4_5_started`, `act_4_5_circuit_complete`.

**Completeness:** **M** — data shell authored; racing system exists
standalone.

---

### Act 5 — "The Reckoning" / "The Map"

**Trigger:** After Act 4.5 / Act 4 resolution. Hub detects via
`act_5_started`.

**Premise:** Kael's five-sector map revealed. Army recruitment
becomes the primary gameplay loop. Cades FPS introduced (7 missions;
Iron Lion dies in M7). Bridge of Kael post-credits.

**Data shells:**
- `narrativeActs.ts:893–980` — ACT_5_THE_MAP dialog + choices
- `actsFourFiveShells.ts:166–228`:
  - §11.3 `CADES_FPS_MISSIONS` — M1–M7 Iron Lion / Veridian VI;
    2 mandatory narrative beats
  - §11.4 `BRIDGE_OF_KAEL_POST_CREDITS` — Engineer's memorial card,
    Vex Solène recruitment reveal

**Witnessing layers active:**
- Year One Calendar month 12 ("The Reckoning")
- Milestone: "The Lion's Last Broadcast" (fires on Act 5 opener;
  Antiquarian curates Iron Lion's 17,000-year-old recording)
- Milestone: "The Bulb Dims" (Vortex Advance — lit-sector ratio
  < 20%; rolling 72h sector consumption)
- Milestone: "A Sector Wakes" (community reclamation — Light Energy
  threshold met)
- Chronicle: `vortex_core_cleared` → "The Line Held"
- `witnessingIntegrations.ts` item 6: shouldPlayBridgeOfKaelPostCredits()
  (fires once when `kael_questline_complete` + `returned_to_bridge_post_kael`)
- `witnessingCanonXref.ts`: Iron Lion entity (entity_23) cross-refs
- Kael Fragment F6 unlocks (questline complete)
- Engineer Recording 7 triggers ("Prayers in Metal" — final words)

**Systems introduced:**
- Cades FPS (7 missions, Veridian VI last stand, mandatory death)
- Army recruitment across 5 sectors / 20 worlds
- Living Universe milestone effects (galaxy-wide)
- Prestige carryover becomes available (§15 P3)

**Flags written:** `act_5_started`, `cades_m7_complete`,
`kael_questline_complete`, milestone events to Living Universe,
Agent Zero (Vex Solène) reveal.

**Flags read:** All prior infiltration + trust flags.

**Completeness:** **S** — narrative authored; racing/FPS standalone;
integration not wired.

---

### Act 6 — "The Confession"

**Trigger:** 5+ army recruitment missions completed.

**Note:** Acts 6–7 exist ONLY in `narrativeActs.ts`. The witnessing
system (`witnessingHub.ts`) stops at Act 5. No Year One Calendar
entries, no witnessing milestones, no Chronicle entries are defined
for these acts. They fire after the 12-month calendar ends.

**Premise:** Both narrators break. Elara confesses she was human —
she sacrificed her humanity for immortality. The Human confesses he's
been playing the villain deliberately, to protect something unseen.
The "Watcher" concept surfaces.

**Data shells:**
- `narrativeActs.ts:988–1144` — ACT_6_THE_CONFESSION (2 confession
  sequences, 4 choice branches: empathy, challenge, refusal,
  reluctant ally; full VO)

**Witnessing layers active:**
- Prestige-era dialog unlocked (§15 prestige-era narrator lines)
- Bond reaches 75–90; approaches sync threshold
- *(No calendar, no milestones, no Chronicle entries defined yet)*

**Systems introduced:**
- "The Watcher" concept — something beyond Architect/Dreamer
- Narrator bond enters final range before sync

**Flags written:** Watcher reveal, alliance/refusal choice,
foundation for Act 7 final stance.

**Flags read:** Trust state from Act 4, infiltration outcomes from
Act 3.

**Completeness:** **S** — fully authored with VO + choice
consequences. Pure dialog; no system dependencies.

---

### Act 7 — "The Convergence"

**Trigger:** 15+ army recruitment missions completed.

**Premise:** Army assembled. Two wars revealed: the visible (order
vs. chaos) and the invisible (against the Watcher). For the first
and only time, Elara and The Human's voices align. Four final
stances.

**Data shells:**
- `narrativeActs.ts:1152–1254` — ACT_7_THE_CONVERGENCE (army status
  display, 4 paths: FOR HUMANITY / SEE THE PATTERN / THE BRIDGE /
  TAKE COMMAND; final VO: *"I've been waiting a very long time to
  say that to someone."*)

**Witnessing layers active:**
- Prestige rollover becomes canonical
- `witnessingIntegrations.ts` item 7: applyPrestigeCarryover()
  (loredex 100%, bond 50%, cards 25%, milestones 100%, moments 10%)
- *(No calendar, no milestones, no Chronicle entries defined yet)*

**Systems introduced:**
- Final narrative stance choice (4 paths, all canon-safe)
- Army composition affects dialog tone but NOT outcome
- Prestige rollover (next cycle remembers per carryover rules)

**Flags written:** `convergence_choice`, narrator bond synced.

**Flags read:** Acts 1–6 complete choice history, army composition.

**Completeness:** **S** — fully authored with VO. No system
dependencies.

---

## Cross-act dependency graph

```
Prelude — "The Ark Awakens"
  └→ Act 1 — "The Twelve Steps" / "The Signal"
       │  writes: lightDarkAlignment, act1_path_*, authority_outcome
       │
       ├→ Act 2 — "The Engineer's Bench" / "The Whisper"
       │    │  reads: lightDarkAlignment, authority_outcome
       │    │  writes: chess_depth, Game Master profiles
       │    │
       │    └→ Act 3 — "The Eyes in the Dark" / "The Offer"
       │         │  reads: chess_depth, act1_path
       │         │  writes: infiltration flags, Eyes roster
       │         │
       │         └→ Act 4 — "The Prisoner" / "The Revelation"
       │              │  reads: act1_path, infiltration
       │              │  writes: trust state, recruitment unlock
       │              │
       │              ├→ Act 4.5 — "Dead Man's Circuit"
       │              │    writes: identity chain, circuit_complete
       │              │
       │              └→ Act 5 — "The Reckoning" / "The Map"
       │                   │  reads: all prior
       │                   │  writes: milestones, Agent Zero, Iron Lion memorial
       │                   │
       │                   └→ Act 6 — "The Confession"
       │                        │  reads: trust, infiltration
       │                        │  writes: watcher reveal, alliance choice
       │                        │
       │                        └→ Act 7 — "The Convergence"
       │                             reads: all; writes: convergence → prestige
       │
       └→ lightDarkAlignment branches EVERY subsequent act
```

**Horizontal layers threading through:**
```
├── Year One Calendar ──── months 1-12 (Prelude → Act 5)
├── Bond milestones ────── 40 / 60 / 80 thresholds
├── Kael Fragments ─────── F1-F6 across Acts 1-5
├── Engineer Recordings ── 1-7 across Acts 1-5
├── Chronicle entries ──── at every cycle/act completion
├── Palimpsest ─────────── parallel track alongside Acts 3-5
└── Prestige carryover ─── applies at Act 7 → next cycle
```

## Cross-act system matrix

| System | Introduced | Witnessing layer? | Wired? | Status |
|---|---|---|---|---|
| Card battle (Dischordia) | Act 1 | Chronicle entries | ✅ | Engine shipped |
| Crafting (Bench) | Act 2 | Calendar month 6 | ❌ | Recipes exist; no UI |
| Chess depth (Zephyr-9) | Act 2 | — | ❌ | Standalone |
| Game Masters | Act 2 | — | ❌ | Data shell |
| Trade Empire | Act 3 | Calendar months 7–9 | ❌ | Partial |
| Palimpsest game show | Act 3–5 | Calendar month 10 | ❌ | Appendix C content |
| Collector's Arena (story) | Act 4 | Kael Fragments | ❌ | Arena standalone |
| Racing (DMC) | Act 4.5 | Trophy Room wall | ❌ | Standalone |
| Casino (Degen's Pact) | Act 4.5 | — | ❌ | Named only |
| Cades FPS | Act 5 | Lion's Last Broadcast | ❌ | Standalone |
| Army recruitment | Act 4–7 | — | ❌ | Named only |
| Prestige cycle | Act 7+ | Carryover rules | ❌ | Rules authored |

## Implications for Act 1 foundation decisions

1. **Campaign-state schema MUST be JSON-flexible** — Acts 2–7 +
   the witnessing system write dozens of flags (chess_depth,
   infiltration_*, trust_state, convergence_choice, bond milestone
   flags, calendar month flags, engineer_recording_*_discovered,
   kael_fragment_* flags, etc.). A single `narrativeFlags: JSON`
   column is the right call.

2. **Narrator bond needs a numeric field** — the witnessing system
   fires milestones at thresholds 40, 60, 80. Acts read bond ranges
   continuously. Captain's Quarters sleep-for-bond writes +1 daily.
   Add `narratorBond: number` alongside narrativeFlags.

3. **Component patterns should be reusable** — `PlayRejectionToast`
   (§5.5→§5.8), `TranscriptColumn` (§5.7→§5.8), `ChoicePillar`
   (Act 1 §5.8.1 → Act 7 final stance). Keep parameterized.

4. **Save-state must support prestige from day 1** —
   `witnessingIntegrations.ts` defines concrete multipliers. Schema
   needs base vs. prestige copies: `loredexEntries` (100%),
   `bondPeakMemories` (50%), `dischordiaCards` (25%).

5. **Army recruitment needs its own counter** — gates Act 6 (5+)
   and Act 7 (15+). First-class progression axis.

6. **Year One Calendar needs a month tracker** — each of the 12
   months raises `year_one_month_N_opened`. The Hub reads
   `yearOneMonth` as an input. Add to campaign state.

7. **Witnessing Hub already exists as a dashboard** — it derives
   state from flags via `deriveWitnessingHubState()`. Any new
   flags we add to campaign_state should use the naming conventions
   the Hub already expects (e.g., `prelude_*_joined`,
   `act_N_*_complete`, `engineer_recording_N_discovered`).

---

**Authored content stops at Act 7.** Endgame systems (Vortex
Advance, Reclamation loop) are named in §15 but have no data shell.
The 7-act narrative arc + 12-month Year One Calendar form a finite
story. The prestige loop is post-ship.

**Witnessing system coverage extends through Act 7 as of the
post-Act-1-bible pass.** `witnessingYearOne.ts` ships
`BEYOND_YEAR_ONE_RIPPLES` with month-13 "The Confession" and
month-14 "The Convergence" entries; `witnessingEvents.ts` adds the
`the_confession_heard` (+250 Light) and `the_convergence_settled`
(+1000 Light) milestones; beat chronicle entries for
`act_6_confession_complete` and `act_7_convergence_complete` surface
at orders 80 and 90. The `EXTENDED_CALENDAR_RIPPLES` export is the
canonical 14-beat sequence for Hub rendering.
