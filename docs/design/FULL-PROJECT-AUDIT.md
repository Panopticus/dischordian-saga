# Dischordian Saga — Full Project Audit

> Compiled from 5 parallel deep-code audits covering every system, route,
> component, database table, and game engine in the project.

---

## EXECUTIVE SUMMARY

**The good news:** The core game engines work. Fighting, card battles, tower defense, and chess are all fully playable with server persistence. NPC dialog, awakening, quests, achievements, morality, and the narrative act system are all built out with real data.

**The bad news:** There's a systemic "last mile" problem. Systems are ~80% built but the final 20% — the wiring that connects them to each other and to the player — is missing. Game state lives in localStorage and vanishes on device switch. The Void Energy design system exists but 95% of pages ignore it. Two major game modes (Trade Empire, Governance Hub) are UI mockups with no game loop. And dozens of well-designed systems (tech tree, mastery tree, guild halls, companion banter) are defined in code but never connected to anything.

---

## TIER 1: CRITICAL (Data loss, broken core loops)

### 1A. Game Progress Only in localStorage — WILL LOSE PLAYER DATA
**Risk: CRITICAL | Effort: Large | Impact: Existential**

The following game state is stored ONLY in the browser and is lost if a player clears data, switches devices, or logs in elsewhere:

| Data | localStorage Key | Impact |
|------|-----------------|--------|
| Story/narrative flags | `narrative_flags` | **Entire story progression lost** |
| Card upgrades | `card_upgrades` | Upgrades reset |
| Battle stats (Dischordia) | `dischordia_wins/losses/elo` | Rank lost |
| Equipment state | `equipmentState` | Gear vanishes |
| Easter eggs & secrets | `loredex_discovered_secrets` | Discovery lost |
| Trade Empire state | `trade_empire_state` | Empire reset |
| Terminus stats | `terminus_highest_wave/kills` | Progress lost |
| Puzzle progress | `loredex_puzzles_solved` | Puzzles re-lock |
| Cinematics seen | `loredex_cinematic_seen` | Re-watch forced |
| Specimen tracking | `active_specimen` | Selection lost |

**Recommendation:** Migrate critical state to `userProgress.gameData` JSON column (already exists in DB). Create a sync-on-save hook that persists on every meaningful state change.

### 1B. Room Events Never Fire — Ark Exploration is Hollow
**Risk: HIGH | Effort: Medium | Impact: Core gameplay loop**

`arkEventHandler.ts` has a comprehensive event system (14 event types, drop tables, material rewards, quest signals, NPC dialog triggers) but **nothing ever calls `processArkEvent()`**. The Ark Explorer page renders rooms but no events generate. Players walk through an empty ship.

**Recommendation:** Create a `useLivingArk()` hook that generates seeded daily events per room and feeds them through `processArkEvent()`. Wire the results into the ArkExplorerPage.

### 1C. Two Disconnected Crafting Systems
**Risk: HIGH | Effort: Medium | Impact: Economy integrity**

- **Backend** (`server/routers/crafting.ts`): Simple fusion/transmute/disenchant system using `userCards` table
- **Frontend** (`client/src/data/craftingData.ts`): 80+ detailed recipes across 5 skills (weaponsmith, armorsmith, enchanting, alchemy, engineering)

These two systems don't talk to each other. The frontend recipes are never validated by the backend. Crafting skill levels are never checked server-side.

**Recommendation:** Bridge the frontend recipe system to the backend crafting router. Add skill-level validation server-side.

---

## TIER 2: MAJOR (Features promised but not connected)

### 2A. Tech Tree — Client Only, No Backend
**Status: STUB | Effort: Medium**

`techTree.ts` defines 3 branches (military, economic, diplomatic), 5 tiers each, 25+ technologies with gameplay effects. But there's no tRPC router, no database table, and no way to actually research anything.

**Recommendation:** Create `techTree` router + `techProgress` table. Wire research costs to unified economy.

### 2B. Mastery Tree — Client Only, No Persistence
**Status: STUB | Effort: Medium**

`masteryTree.ts` defines 3 branches (combat, survival, utility), 5 nodes each, with `canUnlockNode()` and `unlockNode()` functions. No database table, no tRPC route.

**Recommendation:** Add `masteryProgress` table, create router, persist unlocks.

### 2C. Guild Halls — Defined but Not Implemented
**Status: STUB | Effort: Medium**

`guildHall.ts` defines 5 tier halls, 12 rooms, 30+ decorations. Guild membership and chat work, but hall upgrades, room unlocks, and decoration placement have no routes.

**Recommendation:** Add guild hall routes for upgrade/decorate/unlock. Wire treasury spending.

### 2D. Trade Empire — UI Mockup, No Game Loop
**Status: 40% | Effort: Large**

Beautiful UI with sectors, factions, fleet management, and tech tree. But:
- Missions dispatch but never complete
- Rewards defined but never granted
- AI factions exist but don't interact
- All state is localStorage-only

**Recommendation:** Implement mission completion timer + reward granting. Wire to unified economy. Add server persistence.

### 2E. Governance Hub — Mock Data Only
**Status: 10% | Effort: Medium**

Vote UI renders with mock data (`MOCK_ACTIVE_VOTE`). No server queries, no actual voting, no consequence application. Comments say "MOCK DATA (until server wired)".

**Recommendation:** Create `governance` router. Wire voting to DB. Apply vote consequences to game state.

### 2F. Prestige System — Quest Chains Work, Multipliers Don't Apply
**Status: PARTIAL | Effort: Small**

`prestigeQuests` router tracks quest progress, but there's no endpoint to actually claim prestige levels or apply the XP/resource multipliers.

**Recommendation:** Add `claimPrestige` mutation that applies multipliers to the economy system.

### 2G. Companion Banter Never Fires
**Status: DEFINED, NOT WIRED | Effort: Small**

`companionDeepening.ts` has written banter conversations for NPC pairs (Elara+Human, Zero+Locke, Source+Antiquarian), dialog interrupts with timed choices, and one-shot conversation flags. None of this triggers during gameplay.

**Recommendation:** Create `useCompanionBanter()` hook that checks room occupancy and triggers banter when two qualified NPCs are present.

### 2H. Inner Voice Display — Utterances Exist but Don't Show
**Status: DEFINED, PARTIALLY WIRED | Effort: Small**

150+ voice utterances exist for 12 skill types. The `getActiveVoices()` function works. But utterances only display in NPCDialog's archon whisper component — not during combat, room exploration, puzzle attempts, or trade offers (all of which have triggers defined).

**Recommendation:** Create a `VoiceWhisper` toast component that shows inner voice commentary in response to game contexts beyond NPC dialog.

---

## TIER 3: IMPORTANT (Quality, immersion, polish)

### 3A. Void Energy Adoption — 5% of Pages
**Impact: Massive visual inconsistency**

| Issue | Count | Severity |
|-------|-------|----------|
| Pages using hardcoded colors instead of `--void-*` | 20+ | High |
| Pages with zero `data-physics` awareness | ~175 components | High |
| Pages without any loading state | 96 pages | High |
| Pages without accessibility attributes | 96 pages | Medium |
| Hardcoded framer-motion animations (not using VOID presets) | 150+ instances | Medium |
| Desktop-only pages (no mobile consideration) | 5 pages | Medium |

**Top 10 Worst Offenders (hardcoded colors):**
1. SearchPage.tsx — 5 hardcoded color sets
2. DiscographyPage.tsx — 14 hardcoded instances
3. ArkExplorerPage.tsx — 11 instances
4. AlbumPage.tsx — 4 hardcoded color values
5. ConsolePage.tsx — inline rgba values
6. BossBattlePage.tsx — 6+ hardcoded colors
7. GalaxyMap.tsx — 16+ FACTION_COLORS/SECTOR_COLORS hardcoded
8. ChessPage.tsx — 6+ instances
9. ArchitectConsolePage.tsx — local CSS class redefinitions
10. FleetViewerPage.tsx — inline color styles

**Recommendation:** Batch migration — replace hardcoded colors with `--void-*` tokens, add `VOID.fadeUp()` presets to animation-heavy components, add `void-skeleton` loading states.

### 3B. Quest Integration — Events Don't Increment Quests
**Status: PARTIAL**

40+ quests defined. Server persistence works. But game events (fight wins, card matches, wave completions) don't call `trpc.dailyQuests.recordProgress()` consistently.

**Recommendation:** Add quest increment calls to each game mode's result handler (FightPage `handleMatchEnd`, DuelystGameUI `onGameEnd`, TerminusSwarm wave complete).

### 3C. Battle Pass Premium — TODO in Code
**Status: PARTIAL**

Battle pass tier rewards work, XP tracking works, but premium upgrade has a literal `// TODO` comment — no Dream deduction when purchasing premium.

**Recommendation:** Wire premium purchase to `dreamBalance` deduction.

### 3D. Lore Discovery Mechanism Unclear
**Status: PARTIAL**

All lore data exists (12 Archons, 12 Ne-Yons, full identity chains). Lore journal writing system works with streaks. But how players actually discover new lore entries during gameplay isn't clear.

**Recommendation:** Wire lore discovery to room exploration, NPC trust milestones, and achievement unlocks.

### 3E. Daily Rewards — Exploitable
**Status: FUNCTIONAL but INSECURE**

Daily rewards stored in localStorage can be reset by clearing browser data, allowing unlimited re-claims.

**Recommendation:** Move claim tracking server-side (loginCalendar table already exists for this).

---

## TIER 4: NARRATIVE & IMMERSION IMPROVEMENTS

### 4A. Morality Should Visibly Change the World
Currently morality score changes the Void Energy atmosphere (theme colors shift). But it should also:
- Gate NPC dialog branches (some exist in code but unclear if enforced)
- Change room descriptions and event text
- Unlock morality-specific transmissions
- Alter ending paths

### 4B. Room Atmospheres Should Tell Stories
Room transitions already push VoidEngine atmospheres. But room descriptions, NPC placements, and daily events should shift based on:
- Player's narrative act
- Morality alignment
- NPC trust levels
- Time of day / day count

### 4C. NPC Trust Should Have Visible Consequences
Trust levels are tracked for all 7 NPCs. But the player rarely sees the effect. At trust thresholds, NPCs should:
- Reveal new dialog options (some exist)
- Grant summon abilities in combat (defined but not wired)
- Change their room behavior
- Offer exclusive quests

### 4D. Cross-Game Narrative Threads
Game modes are mechanically linked via the economy but not narratively. Consider:
- Card game wins/losses affecting NPC dialog ("I heard you lost to the Architect's forces...")
- Fight results changing room atmospheres
- Terminus Swarm progress unlocking new Ark rooms
- Chess victories with the Architect having story consequences

### 4E. Void Energy as Narrative Material
The design system should reinforce story beats:
- Glass physics during moments of clarity/revelation
- Retro physics during corruption/virus encounters
- Atmosphere shifts during emotional peaks in dialog
- Narrative effects (shake, surge, freeze) at critical story moments — **now wired via useNarrativeEvents but only combat events dispatch**

---

## TIER 5: BACKEND CLEANUP

### 5A. Orphaned Database Tables — RESOLVED
| Table | Original issue | Status |
|-------|----------------|--------|
| `disenchantLog` | Schema exists, never written to | ✅ `apps/server/routers/crafting.ts` writes on every disenchant (denormalized alongside `craftingLog`). |
| `defenseWaves` | Schema exists, tower defense doesn't use it | ✅ `apps/server/routers/towerDefense.ts` reads + writes on every incoming wave. |
| `writingStreaks` | Lore journal streak tracking never persisted | ✅ `apps/server/routers/loreJournal.ts` upserts on every journal entry. |
| `arkThemes` | Accessed inline in routers.ts, not via proper router | ✅ Extracted into `apps/server/routers/arkThemes.ts` (April 2026). Top-level namespace: `arkThemes.get` / `arkThemes.set`. The inline `gamification.getTheme` / `setTheme` pair had zero callers and was removed. |

**Audit correction (2026-04):** `storeItems` was previously listed here. It
is **not** orphaned — `apps/db/relations.ts:170` declares a two-way FK chain
with `storePurchases.itemId`, and `storeItemsRelations` exposes `purchases:
many(storePurchases)`. The original claim was "never queried from a router";
that is correct but narrower than "orphaned." The table is part of the
schema graph and would break referential integrity if removed. The router-
layer gap (store still uses hardcoded `products.ts`) is a real follow-up
but does not justify the orphan label.

### 5B. ElevenLabs TTS — Referenced but Never Connected
Code comments mention ElevenLabs integration for companion voices. No API calls exist. Config references `elevenlabs-multilingual-v2` model in asset templates but it's never used.

---

## SYSTEM STATUS DASHBOARD

### Game Engines
| Engine | Status | Persistence | Rewards | Completion |
|--------|--------|------------|---------|------------|
| FightEngine2D | WORKING | DB + local | Yes | 95% |
| DISCHORDIA Cards | WORKING | DB | Yes | 90% |
| Terminus Swarm | WORKING | DB | Yes | 85% |
| Chess (Stockfish) | WORKING | DB | Yes | 80% |
| Trade Empire | UI ONLY | Local only | No | 40% |
| Governance Hub | MOCK | Local only | No | 10% |
| Meme Broadcast | WORKING | Local | Yes | 75% |
| Hacking Puzzle | WORKING | Callback | Implicit | 80% |
| Signal Decryption | WORKING | Local | Implicit | 75% |

### Economy & Progression
| System | Status | Backend | DB | Completion |
|--------|--------|---------|-----|------------|
| Unified Economy | FUNCTIONAL | Yes | Yes | 80% |
| Crafting | SPLIT | Yes (partial) | Yes | 60% |
| Tech Tree | STUB | No | No | 10% |
| Mastery Tree | STUB | No | No | 10% |
| Marketplace | FUNCTIONAL | Yes | Yes | 85% |
| Card Packs | FUNCTIONAL | Yes | Yes | 80% |
| Prestige | PARTIAL | Yes (partial) | Yes | 60% |
| Daily Rewards | FUNCTIONAL | Yes | Yes | 90% |
| Guild System | PARTIAL | Yes (core) | Yes | 60% |
| Battle Pass | PARTIAL | Yes | Yes | 75% |

### Narrative & NPC
| System | Status | Data | Integration | Completion |
|--------|--------|------|-------------|------------|
| NPC Dialog | FUNCTIONAL | Complete | Wired | 90% |
| Awakening | FUNCTIONAL | Complete | Wired | 85% |
| Quest System | FUNCTIONAL | Complete | Partially wired | 70% |
| Achievements | FUNCTIONAL | Complete | Partially wired | 75% |
| Lore/Loredex | FUNCTIONAL | Complete | Discovery unclear | 70% |
| Inner Voices | DEFINED | Complete | Partially wired | 50% |
| Narrative Triggers | FUNCTIONAL | Complete | Wired | 80% |
| Room Events | DEFINED | Complete | NOT WIRED | 30% |
| Companion System | DEFINED | Written | NOT WIRED | 30% |
| Morality | FUNCTIONAL | Complete | Partially wired | 75% |

### Infrastructure
| System | Status |
|--------|--------|
| Authentication (OAuth) | WORKING |
| Database (106 tables) | WORKING (5 orphaned) |
| WebSocket Multiplayer | WORKING |
| Stripe Payments | WORKING |
| tRPC Routes (51 routers) | WORKING |
| ElevenLabs TTS | NOT CONNECTED |
| Void Energy CSS | 5% adopted |
| localStorage → DB sync | NOT IMPLEMENTED |
