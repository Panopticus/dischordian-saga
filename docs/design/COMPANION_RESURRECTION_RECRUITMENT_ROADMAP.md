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

### 2. Wolf containment reframe — RESOLVED (writer answers 2026-05-20)

**Writer canon:** Lycos is contained in a **Hellbox-shaped snow-globe** seated on a thirteenth pedestal at the centre of the Hall of Disappearances. The snow-globe is a Matrix-of-Dreams pocket realm with unknown time-dilation — Lycos could have been inside for decades or millennia, an unmeasured duration during which he had time to refine his hunting ethic. Both Elara and the Human warn on the open channel against release: *"You are looking at a serial-killer AI in a Matrix-of-Dreams pocket. Lycos has had an unmeasured duration to think... Whatever you choose, choose it knowing both warnings are on the record."*

**What shipped:** Wolf E5 rewritten end-to-end to land the reframe:

- New clue `wolf.e5.snow_globe_diagnostic` — Hellbox-shaped containment, four-part Resurrectionist cipher, time-dilation diagnostic, single-action irreversible release lever.
- New clue `wolf.e5.companion_warnings` — verbatim Elara + Human warning lines.
- Modified `wolf.e5.the_wolf_contained` (was `the_wolf_present`) — Lycos visible *through* the snow-globe glass, cloak etched on the containment from the inside, hasn't moved or aged in observable time.
- Modified `wolf.e5.hall_threshold` — adds the thirteenth (unlisted) pedestal at the chamber's centre.
- Modified `wolf.e5.minigame_entry_state` — Hunt-the-Hero opens *only on release*; the case file closes either way.
- New deduction `wolf.e5.d.companions_warn_against_release` — codifies the warning beat.
- Modified `wolf.e5.antiquarians_concession` — the Antiquarian explains why he contained Lycos in a child's-toy Hellbox: "I could not destroy him; the Judge already had. I could not free him; the chronicle had not yet been written."
- Replaced E5 choices with `wolf.e5.c.release_the_wolf` (pulls the lever, fires the cinematic, opens Hunt-the-Hero) and `wolf.e5.c.leave_him_contained` (re-shelves the snow-globe, case closes, minigame does NOT open). `wolf.e5.c.recall_the_judge` retained as a third path.
- New `loredex.wolf_snow_globe_containment` unlock on episode close.

**Server-side trigger plumbing:** extended `mysteryService.submitChoice` to also write a per-choice flag (`mystery_choice:<arcId>:<episodeId>:<choiceId>`) alongside the existing `mystery_episode_complete` flag. The Wolf cinematic trigger is now keyed to the specific `release_the_wolf` choice — `leave_him_contained` writes a different flag and the cinematic stays silent.

**Parity strengthened:** `narrative.resurrection_cinematic_coverage` is now 5/5: cinematic-id existence (×3) + trigger-flag canon match (per-choice form) + release-choice-id existence on the arc's final episode.

**Lingering work:** the Hellbox subsystem (`apps/shared/hellboxClone.ts`) currently handles apprentice clone-restoration. The snow-globe IS narratively a Hellbox but doesn't share runtime mechanics; if a future feature wants to surface the snow-globe as a tracked Hellbox instance (e.g. for the Loredex, or as an interactable object in the Hall), a `crucibleContainment.ts` module or extension to `hellboxClone.ts` would be the place.

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
