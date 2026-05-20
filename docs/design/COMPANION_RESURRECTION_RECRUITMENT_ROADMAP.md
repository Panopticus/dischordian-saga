# Companion Resurrection-Recruitment Roadmap

**Status:** Roadmap. None of the work below is implemented; the asset wiring (videos + cinematic ids + ship-check parity + Path A flag setter) shipped on `claude/audit-missing-cutscenes-M5jN1` (commit 78a0890 + follow-up).

## The intent

The three "dead Potentials" (Wraith Calder, Akai Shi, Lycos / The Wolf) are canon per `apps/shared/dlcMysteries/resurrectionistCycleWalker.ts:46-48`:

> "He activated resurrection protocols so that all three dead Potentials (Wraith, Akai, Lycos) were resurrected back on the Inception Arks on Terminus."

The narrative arc the team wants players to experience:

1. **Discovery.** Player encounters each character mid-mystery — Wraith Calder dead in his own sanctuary; Akai Shi transformed into the Red Death at the Necromancer's Lair; Lycos hunting the Antiquarian's heroes from inside Anara.
2. **Investigation.** The mystery arc (`apps/shared/dlcMysteries/wraith*.ts`, `akaiShiRedDeath.ts`, `wolfAnaraHunt.ts`) reveals each is a victim of the Resurrectionist Ne-Yon's protocols — not enemies, but instruments.
3. **Resurrection / rescue cinematic.** The three death-and-rebirth cinematics fire — the *first* time the player sees them as themselves, not as antagonists.
4. **Recruitment.** Each joins the crew as a full companion with a bond track, dialog, room presence, loyalty mission.
5. **Bond accumulation.** The player builds the relationship across multiple acts. The cinematic-grade emotional weight comes from the player having shared a long arc with them.
6. **Second death (earned).** Each character has a story-mandated second death — heartbreaking precisely because the player chose to build them up.

## What's shipped today

| Layer | Status |
|---|---|
| 3 cinematics on CDN | ✅ `cdn/client-public/videos/cinematics/{syndicate_of_death,necromancers_lair,planet_of_the_wolf}/` |
| 3 CinematicDef entries | ✅ `apps/shared/expansionArt/cinematicsManifest.ts` |
| Cinematic-id bindings | ✅ `RESURRECTION_CINEMATIC_BY_NPC` (Wraith, Akai); `WOLF_CRUCIBLE_RESCUE_CINEMATIC` (Lycos); `cinematicAssetId` on Wolf E1 |
| Player overlay | ✅ `ResurrectionCinematicRouter` mounted in `App.tsx` |
| Path A server flag | ✅ `apps/server/routers/resurrection.ts:completePathA` writes `pending_resurrection_cinematic_<npcKey>` |
| Path B outcome contract | ✅ `PathBOutcome.pendingCinematicFlag` (`apps/shared/resurrectionPathB.ts`) — the necromancer-cycle wiring callsite reads this when it lands |
| Ship-check parity | ✅ `narrative.resurrection_cinematic_coverage` 3/3 PASS |
| Wolf release cinematic | ✅ Wolf E5 choice-commit fires the cinematic via `mystery_episode_complete:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5` flag — same beat the Mystery Engine uses to close investigation and open Hunt-the-Hero |

## What's outstanding — by piece

### 1. Path B persistence call site

`resurrectionPathB.ts` is a pure-function library — `batchResolvePathB` returns `PathBOutcome[]` but nothing calls it. The Necromancer cycle (`apps/shared/necromancerCycle.ts`) needs to:

- Detect phase transitions to `manifesting | returned | banishment_arc` (use `shouldFirePathBForPhase`).
- Load each user's open resurrection quests + world deaths.
- Call `batchResolvePathB`.
- Persist each outcome: `upsertQuest`, `upsertWorldDeath`, write the transmission to inbox, apply `trustDelta` via the NPC's relationship adapter, **and write `pendingCinematicFlag` to `userProgress.gameData.narrativeFlags`**.

The outcome shape now exposes `pendingCinematicFlag` as a contractual field; the persistence shim is the missing glue.

### 2. Wolf containment reframe (Hellbox / snow-globe / Crucible)

**User canon-correction (2026-05-20):** Lycos is *contained* — in a Hellbox-style snow-globe or the Crucible pocket dimension (where the League lives). The player's choice to **release** him is what opens the Hunt-the-Hero minigame. The Wolf cinematic plays at that release moment.

**What shipped:** the cinematic fires on Wolf E5 choice-commit (canonical Mystery-Engine handoff to Hunt-the-Hero). That's the right *trigger*; the surrounding fiction in the existing arc reads as "the Wolf is already loose inside Anara" rather than "the player releases him from containment." Reconciling the two:

- Wolf E5 clues currently frame Lycos as already present in the Hall of Disappearances (E5 clue `wolf.e5.the_wolf_present`). Reframing as a containment-release reads requires rewriting that clue + E5 narration to make the player's commit-choice the act of releasing the snow-globe.
- The Hellbox subsystem (`apps/shared/hellboxClone.ts`) currently handles apprentice clone-restoration. Recasting it as "the vessel Lycos is contained in" needs either (a) a new module that overloads the visual metaphor or (b) a dedicated `crucibleContainment.ts` module for the Wolf's specific vessel.
- The Crucible IS already canonical: per `wolfAnaraHunt.ts:284` *"Anara's predecessor pocket — the Crucible — kept resurrection records for the first-wave era."* The reframe makes Lycos one of those preserved-and-contained subjects, awaiting release.

Open writer asks:
- Visual: is the containment vessel a Hellbox-shaped snow-globe (one of several in the Crucible) or the Crucible-as-snow-globe itself?
- Does the existing Wolf E5 `wolf.e5.the_wolf_present` clue change, or do we add a new "Wolf in vessel" clue alongside?
- Does the release happen because the player chooses it, or because completing E5 forces it (no opt-out)?

### 3. Companion recruitment surfaces

Adding the three as full companions touches several registries:

| Surface | File | Change |
|---|---|---|
| Companion roster | `apps/shared/companionRoomRegistry.ts` | Add `wraith_calder`, `akai_shi`, `lycos` to `CompanionRosterId` |
| Bond storage | `apps/server/routers/loyaltyMission.ts:loadContext` | Companion bonds already stored under `companionRelationships`; new entries flow through the existing keys |
| Loyalty missions | `apps/shared/loyaltyMissions.ts` | Author one mission per companion (stages, completionFlags, intro lines) |
| Crew member shape | `apps/shared/crewPersistence.ts` | `addCrewMember` flow for resurrected NPCs already exists (`completePathA` handles it); Lycos needs a parallel rescue-recruitment flow |
| Companion room | `apps/client/src/...` | Each gets a room presence (existing pattern from Elara, Locke) |
| Dialog | per-character dialog modules + voManifests | Author + record |
| Card-game representation | `apps/shared/tcg-core/cards/definitions/...` | Optional — companion-flavored TCG cards |
| Codex / Loredex roster | `apps/shared/_completeness/checks/codexRosterCoverage.ts` | Extend declared list |
| Mystery hand-off | `wolfAnaraHunt.ts` E5 (or Akai/Wraith equivalents) | New post-resolution beat: "join the crew" choice |

### 4. Second-death beats

The emotional payoff requires each companion to die again, *not* by the standard crew-tick combat system (which would just open another Resurrection Protocols quest). The deaths need:

- To be **story-mandated** — fired by an act-progression beat, not random.
- To **disable** the Resurrection Protocols quest opener for that npcKey (a new field on `RESURRECTABLE_NPC_KEYS` entries: `finalDeathFlag` — when set, the death is permanent; see `apps/shared/crewTick.ts:enqueuePostDeathSideEffects`).
- To carry their own cinematic + mourning beats (separate from the rebirth cinematics).

Sketched beats per character:
- **Wraith Calder**: dies sealing the sixth sanctuary (canon-aligned with "six sanctuary resurrections" — the sixth IS his final).
- **Akai Shi**: dies destroying the Red Death pattern (becoming the cure to her own infection).
- **Lycos**: dies in the Multiverse final crisis the Antiquarian designed Anara to shelter heroes against — the role he was reanimated for.

These are writer-spec, not implementation, and should land in the lore bible before code follows.

### 5. Ratchet implications

Each new companion adds work to several existing ship-check rows:

- `narrative.act_close_cutscene_coverage` — currently 7/7; second-death beats may need new act-close entries.
- `codex.roster_coverage` — new declared roster members.
- `loyalty.mission_coverage` (if not already declared, declare it) — three new missions.
- `companion.dialog_coverage` (ditto).

Land the parity checks alongside the new content, not after.

## Sequencing recommendation

1. **Land the Path B persistence shim** (smallest follow-up; turns `pendingCinematicFlag` from contract to runtime).
2. **Author the lore-bible entries** for each character's second-death beat. Locked canon = fewer course-corrections downstream.
3. **Lycos rescue beat in `wolfAnaraHunt.ts` E5** + flag setter.
4. **Companion roster additions + bond storage** — touches several registries but each is small.
5. **Loyalty missions** — one per character, authored as a unit so the three relationships develop in parallel.
6. **Second-death beats** — last, because they depend on (4) and (5) being live for the player to have something to lose.

## Pointers

- The `RESURRECTION_CINEMATIC_BY_NPC` map (`apps/shared/resurrectionProtocols.ts`) is the canonical "this NPC has a rebirth cinematic" registry. Add `lycos` here when the rescue trigger lands.
- `WOLF_CRUCIBLE_RESCUE_CINEMATIC` exists as the future single-source for the Lycos rescue cinematic id — the comment in `wolfAnaraHunt.ts` documents the dual fire path.
- The companion-recruitment loop is **not** in scope for the audit-missing-cutscenes branch; that branch is asset wiring only.
