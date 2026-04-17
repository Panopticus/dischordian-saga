# ALL ACTS ROADMAP — Dischordian Saga

**Purpose:** One-page outline per act (7 total) so Act 1 foundation
decisions (schema, save-state, component patterns) are forward-
compatible with Acts 2–7 before engineering commits to the Wave 1
plumbing pass.

**Authoritative sources per act:**
- `apps/client/src/data/narrativeActs.ts` — canonical act boundaries, dialog, choices
- `apps/shared/act2Interlude.ts` — §6.2–§6.4 data shell
- `apps/shared/act3EyesBiography.ts` — §7 Eyes biography + infiltration paths
- `apps/shared/actsFourFiveShells.ts` — §9–§11 Collector's Arena + racing + FPS
- `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` — master design doc

**Cross-act state contract:** Narrator bond starts at 0 (Prelude),
rises 0→10 (Act 1), 10→60 (Acts 2–3), 60→75 (Act 4), 75→90
(Acts 5–6), and syncs at Act 7. `lightDarkAlignment` set in Act 1
§5.8.1; read by every subsequent act's narrator framing.

---

## Act 1 — "The Signal"

**Trigger:** Communications Array room on the Ark.

**Premise:** First contact with The Human — a signal hidden in the
substrate layer below Elara's operating system, awakening the
angel/demon dual-narrator dynamic. Three memoir cycles (Chambers,
Student years, Nexon/Trial) ending in the §5.8 Authority trial.

**Data shells:**
- `narrativeActs.ts:78–372` — ACT_1_THE_SIGNAL with 3 scenes
  (substrate signal discovery, The Human's intro, Elara's reaction).
  Full VO placeholders. Three branching paths: Willing Disclosure,
  Discovery, Betrayal.
- `apps/shared/act1Opponents.ts` — 14 opponent data shells
- `apps/shared/tcg-core/story/chapters.ts` — 17 StoryEncounter
  entries (ch1–ch12 + ch3a/3b + ch9a/9b + chWarlordZeroFirst +
  chAuthorityTrial)

**Systems introduced:**
- Dual signal protocol (Elara + The Human commentary active)
- Three-cycle card-battle memoir (12 matches + 2 special matches)
- §5.5 Warlord three-move lockout (engine + UI shipped)
- §5.7 Public-witness verdict stream (20% built — `<TranscriptColumn>` missing)
- §5.8 Authority trial-phase machine (engine + UI shipped)
- §5.8.1 Light/Dark alignment choice (shipped)

**Cross-act dependencies:**
- **Writes:** `act1_path_A/secret` flags (gate Act 4 emotional arc),
  `architect_reality_edit_witnessed` (Acts 3+ dialog),
  `act1_authority_outcome` (Acts 2+ narrator framing),
  `lightDarkAlignment` (crafting branches + narrator voice)
- **Reads:** Prelude handoff flags (`prelude_burnt_card_found`,
  `humanContactMade`, etc.)

**Completeness:** **M** — narrative fully authored; engine mechanics
shipped; 64% ship-ready per audit (4 critical blockers: boss decks,
`<TranscriptColumn>`, VO direction for 8 speakers, campaign-state
persistence).

---

## Act 2 — "The Whisper"

**Trigger:** Complete first game-mode tutorial.

**Premise:** The Human begins offering commentary during gameplay;
the substrate layer becomes active during matches. Three new game
systems unlock: Crafting, Chess progression, and the Two Game
Masters.

**Data shells:**
- `narrativeActs.ts:381–498` — ACT_2_THE_WHISPER dialog + choices
- `act2Interlude.ts:20–186` — three subsections:
  - §6.2 `ENGINEERS_BENCH_FRAMING` — 6 authored framing lines
    (firstPowerOn, elaraAmbient, humanAmbient, firstLightCraft,
    firstDarkCraft, outOfMemoryEnergy)
  - §6.3 `ZEPHYR_9_CLASSROOM` — 4 chess-depth tiers (1, 3, 5, 8)
    with teaching lines + reward unlocks (basic_chess_access,
    dischordia_preview_cards, dischordia_undo_once, engineers_opening)
  - §6.4 `THE_LEFT_GAME_MASTER` + `THE_RIGHT_GAME_MASTER` — full
    profiles with temperament, first-contact/defeat/victory lines,
    Acts 3–4 culling-boss roles

**Systems introduced:**
- Crafting Bench (Engineer's legacy) — recipes exist at
  `apps/server/routers/crafting.ts`; NO UI yet; needs Memory Energy
  currency
- Chess depth progression — standalone at `ChessPage.tsx`; NOT wired
  to §6.3 unlock tiers
- Game Masters (Left: tactical; Right: improvisational) as
  Collector's Arena first-class NPCs
- Companion trust-ladder first unlocks (Elara reveals she was a
  senator on Atarion; The Human reveals he was an investigator)

**Cross-act dependencies:**
- **Reads:** `lightDarkAlignment` from Act 1 (crafting Light/Dark
  branches); `act1_authority_outcome` (narrator framing)
- **Writes:** `chess_depth` (gates Act 3+ content); Game Master
  profiles (reused as culling bosses Acts 3–4); bench hints
  reference Engineer recordings (triggered by Act 5 flags)

**Completeness:** **M** — data shell complete; chess + crafting
systems exist standalone but NOT wired to narrative. No Memory
Energy currency. No Bench UI.

---

## Act 3 — "The Offer"

**Trigger:** Unlock 5 rooms on the Ark.

**Premise:** The Human offers Kael's pre-Fall navigation logs
(universe map). Player chooses how much to tell Elara about
substrate data access. Trade Empire faction arcs unlock.

**Data shells:**
- `narrativeActs.ts:506–619` — ACT_3_THE_OFFER dialog + choices
- `act3EyesBiography.ts` (394 lines) — two major subsections:
  - §7 `EYES_BIOGRAPHY` — 7 life stages from recruitment through
    death in grass; the Eyes character's full timeline surfaced
    across Trade Empire hubs (Insurgency Safehouse, Panopticon
    Cell, Atarion Senate, Grasslands Sector)
  - §7.3 `INFILTRATION_PATHS` — 3 endings: Insurgency, Empire,
    Hierarchy
  - §8 `TRADE_EMPIRE_IMPROVEMENTS` — 10-item concrete feature list
    for the Trade Empire system

**Systems introduced:**
- Trade Empire Act 3 (Infiltration Runner system, faction arcs)
- Eyes biography timeline across Trade Empire hubs
- Kael's logs unlock army-recruitment prep
- Three infiltration paths with distinct narrative outcomes

**Cross-act dependencies:**
- **Reads:** `act1_path_A/secret` (transparent vs. secret
  disposition); `chess_depth` from Act 2 (gates Game Master
  encounters)
- **Writes:** Infiltration completion flags; Eyes final
  transmission (9-agent roster unlock); seeds Act 5 Bridge of Kael
  + post-credits

**Completeness:** **M** — data shells fully authored; Trade Empire
system exists; Eyes voice layer §10 not yet implemented.

---

## Act 4 — "The Revelation"

**Trigger:** Level 5 or 3 completed game modes.

**Premise:** The truth about The Human emerges — one of three paths
depending on the Act 1 choice (Willing Disclosure / Discovery /
Betrayal). Army recruitment unlocks. Collector's Arena reframed as
memory extraction.

**Data shells:**
- `narrativeActs.ts:637–884` — ACT_4_THE_REVELATION with 3 paths
  (A = Willing Disclosure, B = Discovery, C = Betrayal). Full VO +
  dialog wheels + choice consequences.
- `actsFourFiveShells.ts:20–110` — §9 `ACT_4_PRISONER_CHAPTERS`:
  4 chapter encounters mapping Collector's Arena fights to Kael
  memory extraction (The Cell, The Extraction, Warlord Rematch,
  White Oracle Meets).

**Systems introduced:**
- Collector's Arena story-mode reframe (fighting game = memory
  extraction). Four boss fights = four core Kael memories.
- Emotional branches with lasting trust consequences (reconciled
  vs. fragile vs. broken trust)
- War Room access for army recruitment begins

**Cross-act dependencies:**
- **Reads:** `act1_path_A/secret/partial_share` from Acts 1–3;
  infiltration flags from Act 3
- **Writes:** Act 4 trust states affecting narrator bond (rises to
  70–75); unlocks Act 5 recruitment system; mandatory
  Architect/Dreamer/Watcher conversation

**Completeness:** **M** — narrative fully authored; Collector's Arena
system exists standalone; Act 4 story framing not yet integrated.

---

## Act 5 — "The Map"

**Trigger:** After Act 4 resolution.

**Premise:** Kael's five-sector map revealed; army recruitment
becomes the primary gameplay loop. Dead Man's Circuit and Cades FPS
introduced. The endgame begins.

**Data shells:**
- `narrativeActs.ts:893–980` — ACT_5_THE_MAP dialog + choices
- `actsFourFiveShells.ts:114–228` — three subsections:
  - §10 `DEAD_MANS_CIRCUIT_TRACKS` — identity-as-wager racing
    system + casino (Degen's Pact)
  - §11.3 `CADES_FPS_MISSIONS` — M1–M7 Iron Lion gambit/Veridian
    VI missions; 2 mandatory narrative beats
  - §11.4 `Bridge of Kael` post-credits (Engineer's memorial card,
    Vex Solène recruitment reveal)

**Systems introduced:**
- Racing (Dead Man's Circuit — identity-chain authoring)
- Casino (entropy as game, Degen's Pact)
- Cades FPS (7 missions, Veridian VI last stand, mandatory death)
- Army recruitment across 5 sectors / 20 worlds
- Prestige carryover (§15 P3: loredex 100%, bond 50%, cards 25%,
  milestones 100%)

**Cross-act dependencies:**
- **Reads:** All prior infiltration flags; Trade Empire state
- **Writes:** Milestone events to Living Universe (galaxy-wide
  narrative effects); M6 reveals real Agent Zero (Vex Solène) is
  alive; M7 mandatory loss of Iron Lion → bridge memorial card in
  post-credits

**Completeness:** **S** — narrative fully authored; racing/casino/FPS
systems exist standalone. Integration not wired.

---

## Act 6 — "The Confession"

**Trigger:** 5+ army recruitment missions completed.

**Premise:** Both narrators confess. Elara reveals her human origin
and the sacrifice she made for immortality. The Human reveals his
role as deliberate villain — playing demon to protect something
unseen. The "watcher" concept is introduced: something beyond
Architect/Dreamer orchestrating the cycle.

**Data shells:**
- `narrativeActs.ts:988–1144` — ACT_6_THE_CONFESSION. Two
  confession sequences: Elara's humanity/grief, The Human's
  sacrifice to play the villain as cover. Four choice branches
  (empathy, challenge, refusal, reluctant ally). Full VO.

**Systems introduced:**
- Narrator bond reaches 75–90
- "The Watcher" concept introduced — something beyond the known
  factions orchestrating the cycle
- Prestige-era dialog unlocked (§15 prestige-era narrator lines)

**Cross-act dependencies:**
- **Reads:** Trust state from Act 4 (determines how vulnerable the
  confessions feel); infiltration outcomes from Act 3 (which facts
  are available for the player to confront them with)
- **Writes:** Foundation for Act 7 final choice; player can refuse
  secrecy and reveal to Elara (breaking The Human's cover) or
  accept reluctant alliance

**Completeness:** **S** — fully authored with VO, dialog wheels,
choice consequences. No standalone system dependencies — runs
entirely on the narrator dialog engine.

---

## Act 7 — "The Convergence"

**Trigger:** 15+ army recruitment missions completed.

**Premise:** Army assembled. Two wars revealed: the visible war
(order vs. chaos) and the invisible war (against the watcher). The
player becomes the bridge between Elara and The Human. Narrator
bond syncs for the first and only time — Elara and The Human's
voices align fully.

**Data shells:**
- `narrativeActs.ts:1152–1254` — ACT_7_THE_CONVERGENCE. Army
  status display. Four final paths: FOR HUMANITY, SEE THE PATTERN,
  THE BRIDGE, TAKE COMMAND. Final VO from The Human: *"I've been
  waiting a very long time to say that to someone."*

**Systems introduced:**
- Final narrative stance choice (4 paths; all canon-safe)
- Army composition affects dialog tone but NOT outcome
- Prestige rollover becomes canonical (next cycle remembers
  everything — loredex 100%, bond 50%, cards 25%, milestones 100%)

**Cross-act dependencies:**
- **Reads:** Acts 1–6 complete choice history; army composition
- **Writes:** Convergence choice gates endgame direction (but
  doesn't prevent completion); narrator bond synced permanently

**Completeness:** **S** — fully authored with VO. No standalone
system dependencies.

---

## Cross-act dependency graph (summary)

```
Prelude
  └→ Act 1 (reads: prelude flags; writes: lightDarkAlignment, act1_path_*, authority_outcome)
       ├→ Act 2 (reads: lightDarkAlignment, authority_outcome; writes: chess_depth, Game Master profiles)
       │    └→ Act 3 (reads: chess_depth, act1_path; writes: infiltration flags, Eyes roster)
       │         └→ Act 4 (reads: act1_path, infiltration; writes: trust state, recruitment unlock)
       │              └→ Act 5 (reads: all prior; writes: milestones, Agent Zero reveal, Iron Lion memorial)
       │                   └→ Act 6 (reads: trust, infiltration; writes: watcher reveal, final-choice seed)
       │                        └→ Act 7 (reads: all; writes: convergence choice → prestige rollover)
       └→ §5.8.1 lightDarkAlignment → branches EVERY subsequent act's narrator framing
```

## Cross-act system matrix

| System | Introduced | Wired to narrative? | Status |
|---|---|---|---|
| Card battle (Dischordia) | Act 1 | ✅ Yes (chapters.ts) | Engine shipped |
| Crafting (Engineer's Bench) | Act 2 | ❌ Not yet | Server recipes exist; no UI |
| Chess depth (Zephyr-9) | Act 2 | ❌ Not yet | Standalone playable |
| Game Masters (Left/Right) | Act 2 | ❌ Not yet | Data shell only |
| Trade Empire / Infiltration | Act 3 | ❌ Not yet | Partial system exists |
| Collector's Arena (story) | Act 4 | ❌ Not yet | Arena exists standalone |
| Racing (Dead Man's Circuit) | Act 5 | ❌ Not yet | Standalone exists |
| Casino (Degen's Pact) | Act 5 | ❌ Not yet | Named; minimal impl |
| Cades FPS | Act 5 | ❌ Not yet | Standalone exists |
| Army recruitment | Act 4–7 | ❌ Not yet | Named; no system |
| Prestige cycle | Act 7+ | ❌ Not yet | §15 spec'd; not built |

## Implications for Act 1 foundation decisions

1. **Campaign-state schema MUST be JSON-flexible** — Acts 2–7 write
   dozens of flags (chess_depth, infiltration_*, trust_state,
   convergence_choice, etc.). A single `narrativeFlags: JSON`
   column in campaign_state is the right call; per-flag columns
   won't scale.

2. **Component patterns should be reusable** — `PlayRejectionToast`
   (already reused §5.5→§5.8), `<TranscriptColumn>` (§5.7→§5.8),
   `ChoicePillarLightDark` pattern (Act 1 §5.8.1; Act 7 final
   stance choice uses the same 2-or-4-option pillar UX). Keep
   these generic.

3. **Save-state must support prestige** — Act 7's rollover carries
   loredex 100%, bond 50%, cards 25%, milestones 100%. The save
   schema needs to distinguish "base" vs "prestige" copies of each
   field from the start.

4. **Narrator bond needs a numeric field** — currently no explicit
   bond number in campaign_state. Acts 2–7 read/write it
   continuously. Add `narratorBond: number` to the schema alongside
   narrativeFlags.

5. **Army recruitment needs its own subsystem** — Acts 4–7 gate on
   recruitment mission count (5+ for Act 6, 15+ for Act 7). This
   is a first-class progression axis, not just a flag. Add
   `recruitmentMissions: number` or equivalent.

---

**Authored content stops at Act 7.** Endgame systems (Vortex
Advance, Reclamation loop, prestige cycle) are named in §15 of the
master design doc but have no data shell. The 7-act narrative arc
is complete and can ship as a finite story; the prestige loop is a
post-ship retention layer.
