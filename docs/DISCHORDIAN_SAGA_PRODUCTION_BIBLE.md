# Dischordian Saga — Production Bible

**Single source of truth.** Every other doc in this tree either feeds this bible
or is referenced from it. If you find a contradiction between this file and any
other, this file wins. If you find a contradiction between this file and the
shipping code, the code wins — and this file needs updating.

**Last sync:** April 2026 (covers main through `9cacd44` Void Energy organic-
migration transition).

---

## 0. How this doc is organised

1. **Executive summary** — what's shipping today.
2. **Game scope** — modes, surfaces, transmedia perimeter.
3. **Narrative status** — Prelude + Acts 1–7 production state per cycle.
4. **Systems index** — the gameplay systems that exist, with code pointers.
5. **Design system** — Void Energy adoption status + ratchet rules.
6. **Production pipelines** — art, voice, music, asset workflows.
7. **Canon rules** — non-negotiable lore + visual + writing constraints.
8. **Active TODO list** — tracked, prioritised, open work items.
9. **Reference appendix** — links to canonical companion docs that stay
   separate (too large or specialised to fold here).

Companion docs that stay separate are flagged at the section that uses them.
Anything else under `docs/` is either an archive or fair game to delete.

---

## 1. Executive summary

**What ships today** (verified against `main` HEAD as of April 2026):

- **Loredex OS** — the React/TypeScript narrative + tactical-card client. ~228K
  lines across ~600 files. Ark room exploration, branching dialog, 12-act
  ladder structure, Witnessing system, deck-building, pack-opening, ranked
  ladder, faction war, casino expansion, holiday events, crew breeding,
  morality-driven theming.
- **The Prelude** — 15 cinematic beats playable end-to-end with the new beat
  interactions (Beat C crew role choice, Beat D mission board, Beat E
  flashback hotspots, Beat F biometric lockbox, Beat H NPC inbox, Last
  Words tease at Beat J). All 11 ship-blockers from the audit closed in
  PR #89.
- **Act 1** — twelve-match Dischordia memoir playable through three cycles
  (Kindergarten of Gods, Mechronis Academy, Nexon/Zenon/Last Words). Each
  opponent has authored pre-/mid-/post-match dialog (PR #75). Cycle C
  Authority finale runs the full Last Words Light/Dark alignment gate
  (PR #89).
- **Card game (Dischordia)** — Duelyst-style 9×5 board, six-faction
  starter decks, 6-gate tutorial (Deploy/Keywords/Spells/Deckbuild/
  Draw-Mulligan/Deck-Out, last two added in PR #75), pack opening,
  collection, deck builder with server-side validation (PR #88), match
  history on Bridge Console (PR #86), boss mastery + cosmetic unlocks for
  Act 1 named encounters (PR #85).
- **Companion stack** — Elara (cyan/humanity axis), The Human (rose/machine
  axis) react to scripted events (`companionComments.ts`) and answer
  flag-gated questions (`companionAskTopics.ts`). Per-NPC trust system,
  companion battle reactions, Disco-Elysium-style inner voices.
- **Witnessing system** — 17,000-year transmission framing, song triggers,
  Light/Dark choice mechanic, 20-vote epoch chronicle.
- **Void Energy design system** — semantic CSS-token adoption ratchet
  (`scripts/void-energy-lint.mjs`) guards 113 files; pre-commit hook
  (`pnpm install-hook:void-energy`) and `/migrate-void-energy` skill
  drive organic migration of the rest.

**Stack:**
React 19 + TypeScript + Tailwind v4 + framer-motion + wouter + Vite (client),
Express + tRPC + Drizzle + MySQL (server), Zustand + React Context (state),
Pixi.js card-game board, Stockfish WASM chess, Web Audio API + ElevenLabs VO.

**Test surface:** ~5,800 vitest passes today; `pnpm check` clean; `pnpm lint`
0 errors (1700+ legacy warnings).

---

## 2. Game scope

### 2.1 Surfaces (what the player sees)

| Surface | Status | Code root |
|---|---|---|
| Title + login | shipping | `apps/client/src/pages/TitlePage.tsx` |
| Awakening flow | shipping | GameContext awakening reducer |
| Ark room exploration | shipping | `pages/ArkExplorerPage.tsx` |
| Bridge Console (hub) | shipping (+ match history PR #86) | `pages/BridgeConsole.tsx` |
| Witnessing Hub | shipping | `pages/WitnessingHubPage.tsx` |
| Act 1 ladder | shipping | `pages/Act1CardLadderPage.tsx` |
| Dischordia (card game) | shipping | `game/duelyst/*` |
| Loredex / Codex | shipping | `pages/LoredexPage.tsx`, `CodexPage.tsx` |
| Trade Empire | shipping | `game/TradeEmpirePage.tsx` |
| Marketplace, trades | shipping | `pages/Marketplace*`, `CardTradingPage.tsx` |
| Crew (breeding + roster) | shipping | `pages/CrewRosterPage.tsx`, `components/crew/*` |
| Fight Page | shipping | `pages/FightPage.tsx` |
| Chess Tutorial | shipping | `pages/ChessTutorialPage.tsx` |
| Casino expansion | shipping (event-gated) | `features/events/christmasInJuly/CasinoFloor.tsx` |
| Holiday events (Christmas in July, etc.) | shipping | `data/events/*` |
| Vortex Incursion | shipping | `pages/VortexIncursionPage.tsx` |

### 2.2 Transmedia perimeter (separate games, shared canon)

- **Cades FPS** — `games/cades-fps/` (separate Godot project)
- **Dead Man's Circuit** — `games/dead-mans-circuit/` (separate puzzle game)
- **Silence in Heaven** — narrative expansion in `docs/silence-in-heaven/`

These three share canon with Loredex OS via the `crossGameNarrativeThreads.ts`
registry (PR #75). When any beat in one game emits, the others can react.

### 2.3 Out of scope for current production push

- Multiplayer fighting game engine (designed in archive, not built)
- Mobile native shells
- VR / AR surfaces

---

## 3. Narrative status

### 3.1 Prelude — 15 beats, end-to-end playable

| Beat | Title | Interaction | Status |
|---|---|---|---|
| A | Cryo Wake | cinematic + Elara VO | ✅ shipping |
| A.5 | Corridor First Steps | breath beat | ✅ shipping |
| B | Corridor / Escape | cinematic | ✅ shipping |
| C | Engineering / Crew Role | role choice (Engineer/Assassin/Oracle) | ✅ shipping (PR #89 Beat C component) |
| C.5 | Window (palm frost) | Human signature reveal | ✅ shipping |
| D | Cargo Bay / Mission Board | three-posting reader, Locke tutor | ✅ shipping |
| D.5 | Galley | breath beat | ✅ shipping |
| E | Flashback | hotspot click → memory sync | ✅ shipping (PR #89 BeatE flashback) |
| F | Briefing Room / Lockbox | biometric attempt | ✅ shipping (PR #89 BeatF lockbox) |
| F.5 | Mess Hall (cleaning bridge) | Prelude-only beat room | ✅ shipping (PR #89 promotion) |
| G | Bridge first view | Elara seat hand-off | ✅ shipping |
| H | Comms / Inbox | Locke first message, Human tutor | ✅ shipping |
| H.5 | Window | breath beat | ✅ shipping |
| I | Preparation | Elara + Human bookend | ✅ shipping |
| J | Last Words tease | 5-slide Malkia teaser | ✅ shipping |

**Companion presence:** every beat has at least one Elara or Human reactive
line via `companionComments.ts` (21 prelude entries added in PR #75).

**System tutors:** Locke (mission_board), Human (inbox), Seer (witnessing),
Elara (crew_role + beat_f_lockbox). See `apps/shared/preludeSystemTutors.ts`.

**Canon authority:** `docs/production/PRELUDE_SHIP_READY_BIBLE.md` (kept
separate; cross-audited by `apps/server/preludeBibleAudit.test.ts`).

### 3.2 Act 1 — twelve-match memoir, three cycles

| Cycle | Opponent (`act1Step`) | Status |
|---|---|---|
| A · Kindergarten of Gods | 1 Little Meme · 2 Little Collector · 3 Little Watcher | ✅ dialog tables authored (PR #75) |
| B · Mechronis Academy | 4 The Detective (student) · 5 Iron Lion · 6 Eidola · 7 Matrikala · 8 The Seer (visit) | ✅ |
| C · Nexon / Zenon / Last Words | 9 Warlord Zero · 10 The Programmer · 11 The Game Master (original) · 12 The Authority | ✅ |

**Per-opponent dialog**: `apps/shared/act1OpponentDialog.ts` — 12 fields per
opponent (engineer-memoir intro, Elara/Human pre-match, three opponent taunts,
per-outcome reflections, engineer-memoir close). Surfaced in:
- `Act1CardLadderPage.tsx` matchup + post-match views
- `Act1OpponentTauntOverlay.tsx` (phase-driven via `DuelystGameUI` callbacks
  since PR #89 — early/mid/late fire on opponent turns 1/3/5 plus HP <60% / <30%)

**Cycle C finale**: `Act1CycleCAuthorityWitnessing.tsx` (PR #89) runs the full
Last Words verse + Light/Dark alignment gate after the Authority match win.
This is where the Witnessing tutor (Seer) intro card appears for the first
time.

**Canon authority:** `docs/production/ACT1_NARRATIVE_STRUCTURE.md` (kept
separate). The Warlord-as-swarm rule (Canon Rev 7), Vex Solène's Act 1
non-appearance, and Malkia's civilian-name privacy live there.

### 3.3 Acts 2–7 — line text complete, structural gaps documented

Audit doc: `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md`.

Summary verdict per act:

| Act | Title | Dialog | Per-opponent tables | Reactive companions | Ask topics |
|---|---|---|---|---|---|
| 2 | THE WHISPER | ✅ | N/A (interlude) | ⚠️ partial | ⚠️ partial |
| 3 | THE OFFER | ✅ | ❌ missing | ❌ missing | ⚠️ partial |
| 4 | THE REVELATION | ✅ | ❌ missing | ❌ missing | ❌ missing |
| 5 | THE MAP | ✅ | N/A (interlude) | ❌ missing | ❌ missing |
| 6 | THE CONFESSION | ✅ | ❌ missing | ❌ missing | ❌ missing |
| 7 | THE CONVERGENCE | ✅ | ❌ missing | ❌ missing | ❌ missing |

The Act 1 templates (`act1OpponentDialog.ts` and friends) are the canvas for
filling these in. See § 8 TODO for prioritised work items.

### 3.4 Witnessing system

- 17,000-year framing established in Prelude
- Light/Dark alignment chosen at Cycle C finale; persists across save
- Bond progression 0→10 per companion (Elara, The Human, Antiquarian-as-
  narrator, Locke, Seer, plus Act 2+ adds)
- Epoch chronicles: 5 epochs × ~8 votes each in `apps/shared/epochVotes.ts`
- See `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md` for the full design.

---

## 4. Systems index

Every gameplay/narrative system that exists today, with the file you'd open
first.

### 4.1 Narrative engine

| System | Entry | Notes |
|---|---|---|
| Branching dialog tree | `apps/client/src/data/narrativeActs.ts` | Acts 1–7 with `wheel_choice` branching |
| Per-opponent dialog | `apps/shared/act1OpponentDialog.ts` | Act 1 only today; template for Acts 2+ |
| Companion reactive lines | `apps/shared/companionComments.ts` | One-shot toasts on triggered events |
| Ask-topic Q&A surface | `apps/shared/companionAskTopics.ts` | Re-enterable, flag-gated |
| Morality/trust/act variants | `apps/shared/moralityTrustActVariants.ts` | Schema + 3 seeds; needs writer fill |
| Cross-game thread registry | `apps/shared/crossGameNarrativeThreads.ts` | 3 seed threads (Cades Fall, Programmer's Gift, Last Words Echo) |
| System tutors (in-lore) | `apps/shared/preludeSystemTutors.ts` | 5 tutors (Locke, Human, Seer, Elara × 2) |
| Inner voices (Disco-Elysium-style) | `apps/shared/innerVoices.ts` | Tactics, Empathy, Paranoia, etc. |
| Antiquarian's journal | `apps/shared/antiquariansJournal.ts` | Long-form narrator commentary |

### 4.2 Card game (Dischordia)

| System | Entry | Notes |
|---|---|---|
| Engine | `apps/shared/tcg-core/index.ts` | Pure reducer; deterministic seed |
| Story encounters | `apps/shared/tcg-core/story/encounter.ts` | NarrativeHook framework |
| 6-gate tutorial | `apps/shared/tcg-core/story/tutorial.ts` | Deploy/Keywords/Spells/Deckbuild + Draw-Mulligan + Deck-Out |
| Card definitions | `apps/shared/tcg-core/cards/definitions/**` | Per-faction + neutral |
| Starter decks | `apps/shared/tcg-core/decks/starterDecks.ts` | Six factions |
| Deck validation (server) | `apps/shared/validateDbDeckComposition.ts` | PR #88 |
| Match runner UI | `apps/client/src/game/duelyst/DuelystGameUI.tsx` | onTurnChange / onBossHpChange callbacks (PR #89) |
| Pack opening | `apps/client/src/game/duelyst/PackOpening.tsx` | Pokemon-pocket reveal ceremony |
| Match history | `apps/client/src/components/match/RecentMatchesCard.tsx` | Bridge Console card (PR #86) |
| Boss mastery + cosmetics | `apps/shared/bossMastery.ts` | Per-Act-1-named-encounter (PR #85) |

### 4.3 Companion + relationship layer

- Companion data — `apps/client/src/data/companionData.ts`
- Battle reactions — `apps/shared/companionBattleReactions.ts`
- Synergies — `apps/shared/companionSynergies.ts`
- Trait thresholds — `apps/shared/companionTraitThresholds.ts`
- Epoch dialogs — `apps/shared/companionEpochDialogs.ts`
- Virus reactions — `apps/shared/virusCompanionReactions.ts`
- Trust system: lives in `GameContext.state.companionTrust` (0–100 per
  companion) — banded into cold/neutral/warm/confidant by
  `bandForTrust()` in `moralityTrustActVariants.ts`

### 4.4 Crew / breeding (live since pre-#75)

- Awakening — `apps/client/src/game/crewAwakening.ts`
- Birth — `apps/client/src/game/crewBirth.ts`
- Roster UI — `apps/client/src/components/crew/*`
- Holiday bonuses — `apps/shared/christmasCrewBonuses.ts`,
  `christmasCrewDangers.ts`

### 4.5 Trade Empire + Faction War

- Trade Empire — `apps/client/src/game/TradeEmpirePage.tsx` + tRPC `trade*`
  routers
- Faction War — `apps/client/src/data/factionWarData.ts`,
  `factionWarEvents.ts`
- Marketplace — `apps/client/src/pages/MarketplacePage.tsx`

### 4.6 Holiday + event system

- Christmas in July — `apps/client/src/data/events/christmasInJuly/*`,
  `apps/client/src/features/events/christmasInJuly/CasinoFloor.tsx`
- Year-One calendar — `apps/client/src/data/eventsCalendar.ts`
- Engagement tracker — `apps/client/src/services/engagementTracker.ts`

### 4.7 Persistence + auth

- Drizzle schema — `apps/db/schema.ts`
- Relations — `apps/db/relations.ts`
- tRPC routers — `apps/server/routers/*` (52 routers)
- Auth — `apps/client/src/_core/hooks/useAuth.ts` + server `_core/`

---

## 5. Design system — Void Energy

**Status:** ratchet adoption phase. 113 files clean. Organic migration enabled
via pre-commit hook + Claude skill.

### 5.1 The 5 Laws (adapted from `dimonb19/void-energy-ui`)

1. **Hybrid Protocol** — Tailwind = layout/composition. CSS custom properties
   = visual physics/materials.
2. **Token Law** — no raw values (`px`, `#hex`, `rgb`, `hsl`). Only semantic
   tokens. Allowlist: `0-3px` for minimal sub-pixel adjustments.
3. **Runes Doctrine** — N/A in this React codebase (Svelte-only rule).
4. **State Protocol** — state visible to CSS via `data-state="active"` /
   `aria-pressed`, never `.is-active` utility classes.
5. **Spacing Gravity** — default generous; floating surfaces floor at
   `p-lg`/`gap-lg`, sunk at `p-md`/`gap-md`. `gap-xs/sm` only for
   semantically-linked units.

### 5.2 Tokens

Defined in `apps/client/src/engine/void-materials.css` and
`apps/client/src/index.css` (Tailwind v4 `@theme inline` block). Library-
parity scale: `--space-xs..5xl` (8/16/24/32/48/64/96/128/160 px),
`--energy-{primary,success,error,system,premium,accent}`,
`--text-{main,dim,muted}`, `--bg-{void,surface,sunk,spotlight,elevated}`,
`--physics-{blur,border-width}`, `--ve-radius-{sm,md,lg,xl}`.

### 5.3 Ratchet

`scripts/void-energy-lint.mjs` checks every path in `.void-energy-adopted`
against:
- Hex / `rgb()` / `hsl()` literals
- Tailwind color-ramp utilities (`text-amber-400`, `bg-cyan-500/30`, etc.)
- Raw px (outside 0–3 allowlist)
- State-via-class (`is-active`, `is-open`, etc.)

Exempt via `// void-ignore` (line-prefix or inline; also `/* */` and
`{/* */}` JSX form). Whole-file exemptions for narrative-signal colors go in
`.void-energy-intentional`.

### 5.4 Organic migration workflow

1. `pnpm install-hook:void-energy` — installs `.git/hooks/pre-commit` once
   per clone. Auto-migrates staged `.tsx`/`.ts` files with color hits.
2. `pnpm migrate:void-energy <file>` — preview migration on a file.
3. Or invoke the `/migrate-void-energy` Claude skill.
4. After clean migration, append the path to `.void-energy-adopted`
   (sorted alphabetical; no section headers).
5. `pnpm lint:void-energy` confirms.

**Don't touch with the migrator** (data-file denylist):
`MoralityThemeContext.tsx`, `arenaAssets.ts`, `moralityUnlockables.ts`,
`arenaHazards.ts`, `gameData.ts`, `storyModeChapters.ts` — their hex
literals feed `lerpColor()` at runtime.

Roadmap detail: `docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md` (kept
separate; sprint history + workflow detail).

---

## 6. Production pipelines

### 6.1 Art

- **Universal prompting doc** for any missing Prelude/Act 1 asset:
  `docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` — paste-ready
  prompts for Nano Banana 2 + Seedance 2.0.
- **Art production bible** (general direction, not Prelude/Act 1 specific):
  `docs/production/ART_PRODUCTION_BIBLE.md`.
- **Visual production bible** (UI, cinematics, effects):
  `docs/production/VISUAL_PRODUCTION_BIBLE.md`.
- **Per-environment bibles** in `docs/production/`:
  `MECHRONIS_ART_PROMPTS`, `PARALLAX_ROOMS_ART_BIBLE`,
  `PLAYER_CABIN_ART_BIBLE`, `LORE_GALLERY_ART_BIBLE`, `STORY_MODE_ART_BIBLE`,
  `GAME_MODE_ENVIRONMENTS_ART_BIBLE`, `OPTIONAL_COMPONENTS_ART_BIBLE`.
- **Asset-build workspaces** (manifests + prompt batches):
  `docs/production/prelude-asset-build/` and
  `docs/production/act1-asset-build/`.
- **Card art specs**: `docs/TCG_ART_SPEC.md` + `TCG_ART_SPEC_ADDENDUM.md`,
  plus the `NANO_BANANA_*.md` files at `docs/` root for allegiance, class,
  element/dimension/race, NPC imprints (1/2/3), and Oracle deck.
- **Consistency gate** (quality checklist): `docs/production/CONSISTENCY_GATE.md`.

**Targets:** Nano Banana 2 at 1920×1080. Deep-space-black `#010020` base
with cyan `#22d3ee` accent. Volumetric fog at ankle height. Film grain.
Anamorphic lens flare on brightest element. No rendered text in stills.

### 6.2 Voice

- **Bible:** `docs/production/VOICE_OVER_BIBLE.md` — voice profiles, line-id
  conventions, Studio Projects vs CSV-import rules.
- **Pipeline:** ElevenLabs (`elevenlabs-multilingual-v2`). Lines ≤30s use
  CSV import; longer continuous takes use Studio Projects.
- **Manifests:** `apps/shared/{speaker}VoManifest.json` per speaker (Elara,
  Human, Locke, Antiquarian, Architect, Cades, Collector, Degen, Engineer
  Memoir, Game Master, Matrikala, Meme, Necromancer, Nilmorg, Palimpsest
  Host, Prince, Programmer, Seer, Shadow Tongue, Source, Warlord, Watcher,
  Authority, Eidola, Agent Zero — 24 manifests).
- **Pending VO registry:** `apps/shared/pendingVoLines.json` (PR #89
  replaced the ad-hoc stale allowlist).
- **Engineer recordings registry:** `apps/shared/engineerRecordings.ts`
  (typed; covers Engineer + Prince audit gap).
- **Existing scripts:** `docs/production/elara-vo-script.md` (Prelude),
  prompts under `docs/production/prelude-asset-build/prompts/voice/log5/`
  (Last Words tease).

### 6.3 Audio (music + SFX)

- **Music prompts:** `docs/FNORD23_MUSIC_PROMPTS.md` and
  `docs/production/prompts/suno-game-music-prompts.md`.
- **SFX prompts:** `docs/production/CADES_SFX_PROMPTS.md` (Cades FPS only).
- **Slideshow content:** `docs/production/prompts/slide_content.md`.
- **Discovery video prompts:** `docs/production/prompts/kling-discovery-video-prompts.md`.

### 6.4 Cutscenes / cinematics

- **Direction:** `docs/design/ANIMATED_CUTSCENES.md` and
  `docs/production/STORY_MODE_ART_BIBLE.md` and
  `docs/production/PRODUCTION_BIBLE.md` (Collector's Arena cinematics).
- **Engine:** Seedance 2.0 at 24fps; one continuous camera move + one
  dominant visual idea per shot.

---

## 7. Canon rules (non-negotiable)

These supersede any other doc. Violating them is canon drift; flag for
review.

### 7.1 Lore canon (Rev 7, April 2026)

Authoritative: `docs/built/LORE_BIBLE.md` (10K+ lines) and
`docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md`.

- **Vex Solène does not appear in Act 1.** She's in the swarm the Warlord
  wears at Nexon; the player may *feel* her at the edges; no face, no
  voice, no name. Full reveal is Act 3+.
- **Malkia Ukweli's civilian name is privately addressed only.** Public
  framing stays "the Enigma" through Act 2.
- **The Oracle is referenced, never shown.** Every reference treats him
  as diagnosis, not prophecy.
- **The Warlord is canonically a weaponized nanobot swarm, not a person.**
  Any Act 1 dialog framing her as "corrupted innocent" is canon drift
  (Canon Rev 7 §1.6).
- **The Architect's voice is calibration, not threat.** No "I've already
  won" villain clichés; no omniscience boasts. Architect lines that fall
  into those patterns are flagged in
  `docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md` Issue A.

### 7.2 Writing voice constraints

From `docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md`:

- Fight-context lines stay ≤ 25 words.
- The Antiquarian's Journal sets the prose-quality floor (DOC3 [51]–[150]).
- Inner Voices system (DOC2 [170]–[236]) sets the specificity floor.
- The Meme's Transmission Commentary (DOC3 [1]–[50]) sets the meta-voice
  floor.

### 7.3 Visual canon

- **Atmosphere triad** lives in Void Energy: 12 atmospheres × 3 physics ×
  2 modes. `<html data-atmosphere="..." data-physics="..." data-mode="...">`
  controls runtime.
- **Glass and retro physics require dark mode.** `voidEngine.ts` auto-
  corrects illegal combinations.
- **Faction colors** (`apps/client/src/game/duelyst/types.ts FACTION_COLORS`)
  and **rank tier colors** (`DuelystPage.tsx RANKED_TIERS`) are game-rule
  identity signals. Never re-themed.
- **Speaker accent colors** (cyan = Elara, rose = The Human, amber = Locke,
  violet = The Seer) live in `.void-energy-intentional`. Speaker identity
  is narrative signal, not chrome.

### 7.4 Mechanics canon (Last Words landing)

- The Last Words song's full performance + 20-slide Witnessing + Light/Dark
  alignment lives at the Act 1 Cycle C Authority finale. The Prelude's
  Beat J only tees up a 35-second 5-slide tease (October 2026 restructure).
- Light/Dark alignment is binary at the choice point and persistent in
  save state. Carries forward into Act 2+ atmospheres.

---

## 8. Active TODO list

Tracked, prioritised, open work. Edit this list when items move from open
→ in-progress → shipped. When you ship something, delete the line and add
a one-liner under § 9 if the change is canonically significant.

**Format:** `[ ] PRIORITY · scope · description` (PRIORITY = `P0`/`P1`/`P2`).

### 8.1 Narrative content (writers + agents)

- [ ] **P0 · Acts 2–7** · Per-opponent dialog tables for every scripted
  Act 2+ encounter. Mirror `apps/shared/act1OpponentDialog.ts`. Highest
  leverage: Act 4's betrayal encounter and Act 7's convergence boss.
  Audit: `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md`.
- [ ] **P1 · Acts 2–7** · Reactive companion comments for Act 2–7 moments.
  Extend `companionComments.ts` with `cc_act{N}_*` triggers (first
  substrate ping, path fork A/B/C, map first-open, army first-recruit,
  confession aftermath, convergence landing). ~15 entries.
- [ ] **P1 · Ask topics** · Add act-gated alternate answer support to
  `companionAskTopics.ts` (e.g. Act 6+ version of `ask_human_who`).
  Schema change: optional `alternateAnswers?: { unlockedFromAct: number;
  answer: string }[]`.
- [ ] **P2 · Tier 4 morality variants** · Fill `VARIANT_REGISTRY` in
  `moralityTrustActVariants.ts`. Three seed entries today; needs
  authoring sprint per surface (room / transmission / npc_line / journal /
  wheel_followup).
- [ ] **P2 · Tier 4D cross-game thread beats** · Extend
  `crossGameNarrativeThreads.ts` with the per-thread beats not yet
  authored. Three seed threads today.
- [ ] **P2 · System tutors for Acts 2+** · Mirror
  `preludeSystemTutors.ts` — army recruitment (Act 5+), star map
  (Act 5), confession journal (Act 6).

### 8.2 Voice production

- [ ] **P0 · ElevenLabs render queue** · The `pendingVoLines.json`
  registry lists every line awaiting render. Pipeline runs through
  Studio Projects (long takes) + CSV import (≤30s). When a line's audio
  uploads to S3, it moves out of `pendingVoLines.json`.
- [ ] **P1 · CSV-import generator** · Script that reads dialog files
  (`act1OpponentDialog.ts`, `companionAskTopics.ts`, etc.) and emits
  ElevenLabs-formatted batches. Lives at
  `apps/scripts/generate-vo-csv.ts` (not yet built).
- [ ] **P2 · Per-opponent VO** · Render the 144 Act 1 opponent lines
  shipped in PR #75 (mid-match taunts, post-match reflections, engineer
  memoir).

### 8.3 Cross-game integration

- [ ] **P1 · Server-side cross-game emit endpoint** · Contract documented
  in `docs/design/AUTHORING_CROSS_GAME_THREADS.md`. Route accepts
  `{ beatId }`, sets `xgame_*` flag on player state.
- [ ] **P2 · Cades FPS event hooks** · When Cades emits `cades_fall_fall`,
  Loredex Act 5 star map adds the pilgrimage pin. Wiring TBD.
- [ ] **P2 · Dead Man's Circuit gift decoder** · DMC accepts the
  `programmers_gift_loredex_award` flag and unlocks the puzzle. Wiring
  TBD.

### 8.4 Void Energy (passive — organic migration)

- [x] Ratchet, hook, skill, sorted append-log, 113 adopted (PRs #76–#91).
- [ ] **P3 · Per-file migration** · 286 files still dirty. No active
  push; they migrate when feature work touches them. Track via
  `pnpm lint:void-energy` count over time.

### 8.5 Card game polish

- [ ] **P2 · Tutorial Gate 5 + 6 visual pass** · Draw/Mulligan + Deck-Out
  gates (PR #75) need playtest under all three physics presets. Confirm
  the deck-out fatigue clock animation reads correctly.
- [ ] **P2 · Match history filters** · Bridge Console match history
  (PR #86) currently shows all matches; add filter by faction / outcome /
  ranked-vs-casual.

### 8.6 Documentation hygiene

- [x] Consolidated production bible (this doc).
- [x] 25 stale docs deleted (this PR).
- [ ] **P3 · NANO_BANANA_*.md cleanup** · The 8 card-spec files at
  `docs/` root are current but unstructured. Consider folding into one
  `docs/CARD_ART_SPECS.md` with table-of-contents per allegiance/class/
  element/NPC.

### 8.7 Known issues from FULL-PROJECT-AUDIT

Unresolved items from `docs/design/FULL-PROJECT-AUDIT.md` that haven't
been closed by recent PRs:

- [ ] **Disenchant log** — schema exists, never written to.
- [ ] **Defense waves** — schema exists, tower defense doesn't use it.
- [ ] **Writing streaks** — lore journal streak tracking never persisted.
- [ ] **Ark themes** — accessed inline in routers.ts, not via proper
  router.
- [ ] **ElevenLabs TTS** — referenced in code comments but no API calls
  exist outside the manifest pipeline. Decide: wire it up or remove the
  comment-only references.

### 8.8 Recently shipped (24h log — for context)

- ✅ PR #91 — Void Energy organic-migration transition (hook + skill +
  sorted append-log).
- ✅ PR #90 — Void Energy Slice 6 (93 long-tail components).
- ✅ PR #89 — Prelude + Act 1 audit ship-blockers (items 1–11):
  PreludeMissionRunner, BeatCCrewRoleChoice, BeatFBiometricLockbox,
  Act1CycleCAuthorityWitnessing, DuelystGameUI turn callbacks, taunt
  overlay refactor, mess-hall promotion, 52 new tests.
- ✅ PR #88 — Mulligan tutorial polish + server deck validation +
  DeckBuilder guard + move tweening.
- ✅ PR #87 — feat(lore): April 2026 canonical lore update.
- ✅ PR #86 — Match history panel on Bridge Console.
- ✅ PR #85 — Boss mastery + cosmetic unlocks for Act 1 named encounters.
- ✅ PR #84 — Quest-complete toasts + faction preference persistence.
- ✅ PR #82 — Void Energy Slice 5 (duelyst stack).
- ✅ PR #81 — Void Energy Slice 4 (prelude beat handlers).
- ✅ PR #80 — Void Energy Slice 3 (dialog stack).
- ✅ PR #79 — Card game playability: match summary + onboarding + deck
  picker + AI concede.
- ✅ PR #78 — Void Energy Slice 2 (page-level shells).
- ✅ PR #77 — Act 1 audit fix list: Prelude playable + §5.7→§5.8 handoff
  + story launcher + trial_categories backfill.
- ✅ PR #76 — Void Energy first slice (ratchet + spacing scale).
- ✅ PR #75 — Dialogue completeness: prelude/Act 1 audit + Tier 3A/4/4D
  staging.

---

## 9. Reference appendix — companion docs that stay separate

These are too large or specialised to fold into this bible. Each is the
canonical authority for its scope. Update them in place; reflect any
high-level state change here.

### 9.1 Lore + canon
- `docs/built/LORE_BIBLE.md` — 10K+ lines. Master lore encyclopedia.
- `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` — Rev 7 canon.
- `docs/design/EXPANSION_BIBLE.md` — expansion roadmap (Ark history,
  discoverable lore layers, future expansions).
- `docs/design/NARRATIVE_ARCHITECTURE.md` — narrative thesis ("The
  Witnessing") + identity chains.
- `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md` — 4K+ lines on the
  Witnessing system (bond progression, milestones, chronicles).

### 9.2 Production bibles (kept separate; ratchet-tested)
- `docs/production/PRELUDE_SHIP_READY_BIBLE.md` — Prelude canonical bible.
  Cross-audited by `apps/server/preludeBibleAudit.test.ts`.
- `docs/production/ACT1_NARRATIVE_STRUCTURE.md` — Act 1 canonical bible.
- `docs/production/SHIP_READY_ASSET_BIBLE.md` — post-Prelude asset
  production prompts (Nano Banana 2 + Seedance + ElevenLabs) covering
  all 46 game modes. Mutually exclusive with the Prelude bible.
- `docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` — paste-ready
  prompts for missing Prelude/Act 1 assets.
- `docs/production/ALL_ACTS_ROADMAP.md` — act-name reconciliation +
  timeline.
- `docs/production/ART_PRODUCTION_BIBLE.md` — general art direction.
- `docs/production/VISUAL_PRODUCTION_BIBLE.md` — UI / cinematics / effects
  visual direction.
- `docs/production/PRODUCTION_BIBLE.md` — Collector's Arena cinematics +
  music direction.
- `docs/production/STORY_MODE_ART_BIBLE.md` — story mode cinematic art.
- `docs/production/VOICE_OVER_BIBLE.md` — VO production guide.
- `docs/production/COMPLETE_ART_PROMPT_BIBLE.md` — Soul Stones, Eidolons,
  Spectral, Companions, Rooms, VFX (~112 assets).

### 9.3 Per-environment / per-system art bibles
- `docs/production/MECHRONIS_ART_PROMPTS.md`
- `docs/production/PARALLAX_ROOMS_ART_BIBLE.md`
- `docs/production/PLAYER_CABIN_ART_BIBLE.md`
- `docs/production/LORE_GALLERY_ART_BIBLE.md`
- `docs/production/GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`
- `docs/production/OPTIONAL_COMPONENTS_ART_BIBLE.md`
- `docs/production/PARALLAX_ROOMS_ART_BIBLE.md`
- `docs/production/PAGE_BACKGROUND_ART_PROMPTS.md`
- `docs/production/CASINO_EXPANSION_ART_BIBLE.md` — future expansion.
- `docs/production/CHRISTMAS_IN_JULY_ART_BIBLE.md` — holiday event.
- `docs/production/BREEDING_SYSTEM_ART_PROMPTS.md` — crew breeding.
- `docs/production/FIGHTER_LORE_CROSSREF.md` — fighter character index.
- `docs/production/CELEBRATION_ART_PROMPTS.md` + `CELEBRATION_MECHRONIS_*`.
- `docs/production/CONSISTENCY_GATE.md` — asset consistency checklist.

### 9.4 Card-art catalog (top-level)
- `docs/NANO_BANANA_ALLEGIANCE_CARDS.md`
- `docs/NANO_BANANA_CLASS_CARDS.md`
- `docs/NANO_BANANA_ELEMENT_DIMENSION_RACE.md`
- `docs/NANO_BANANA_NPC_IMPRINTS_{1,2,3}.md`
- `docs/NANO_BANANA_ORACLE_DECK.md`
- `docs/TCG_ART_SPEC.md` + `TCG_ART_SPEC_ADDENDUM.md`

### 9.5 Audit + writing reference
- `docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md` — 67 entries flagged
  for revision; craft notes; Antiquarian-quality benchmark.
- `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md` — structural gaps.
- `docs/narrative-audit/DOC{1,2,3,4}_*` — original writing audit corpus
  (kept as reference).
- `docs/design/FULL-PROJECT-AUDIT.md` — tier-categorised systems audit
  (storeItems orphan claim corrected in PR #75).

### 9.6 Authoring guides
- `docs/design/AUTHORING_MORALITY_VARIANTS.md` — Tier 4 variant resolver.
- `docs/design/AUTHORING_CROSS_GAME_THREADS.md` — Tier 4D thread registry.
- `docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md` — Tier 3A design system.

### 9.7 Asset-build workspaces
- `docs/production/prelude-asset-build/` — prompts + manifests for
  Prelude.
- `docs/production/act1-asset-build/` — prompts + manifests for Act 1.

### 9.8 Transmedia (kept separate)
- `docs/production/CADES_SFX_PROMPTS.md`
- `docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md`
- `docs/silence-in-heaven/ART-PRODUCTION-GUIDE.md`
- `docs/production/prompts/cades-fps-production-prompts.md`
- `docs/production/prompts/puzzle-answer-book.md` — DMC puzzle solutions.

### 9.9 Asset originals
- `docs/art-originals/` — reference image sources for celebration +
  Mechronis environments + mascoteers + slideshow + professors. Read-only
  reference for downstream art generation.

### 9.10 Misc design + system
- `docs/design/SOUL_STONES_SYSTEM.md` — live (verified shipped in code).
- `docs/design/ANIMATED_CUTSCENES.md` — cinematic direction.
- `docs/design/ARCHITECTURE_PROPOSAL.md` — system architecture.
- `docs/design/VOICE_ACTING_PIPELINE.md` — VO production pipeline.
- `docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md` — Year One calendar.

### 9.11 Archive (do not delete; historical reference)
- `docs/archive/legacy-reference/LOREDEX_OS_DEVELOPER_HANDOFF.md` —
  pre-PR-#75 architecture handoff. Useful when onboarding new
  contributors who need the long-form tour.

---

**End of bible.** When you ship something, update the relevant section.
When this doc disagrees with shipping code, fix this doc. When it disagrees
with another doc, this wins.

