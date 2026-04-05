# Documentation Structure

This `docs/` folder is organized into three categories. **Every doc belongs to exactly one.**

## `built/` — Reflects shipping code
Documents describing systems actually implemented and running. Source of truth for what the game currently IS.

- `LORE_BIBLE.md` — canonical worldbuilding, characters, timeline

**Rule:** If it's in `built/`, you should be able to point to the code that implements it.

## `design/` — Active design specs (aspirational / in-progress)
Docs describing what we're building or planning. Not yet true of the shipping app.

- `ARCHITECTURE_PROPOSAL.md` — ship-as-app architecture (RoomTutorialDialog, CoNexusMediaPlayer, progressive unlocks)
- `GAME_DESIGN.md` — core game design doc
- `EXPANSION_BIBLE.md` — Dialog Wheel + Breaking Point + corruption visuals (§2-3)
- `NARRATIVE_ARCHITECTURE.md` — story structure blueprint
- `rpg-analysis-recommendations.md` — RPG design notes

**Rule:** When a system in `design/` ships, move its section to `built/` or delete from `design/`.

## `production/` — Asset generation specs
Docs that tell the human production team how to generate assets.

- `VOICE_OVER_BIBLE.md` — ElevenLabs voice specs + 1,000-line script roster
- `VISUAL_PRODUCTION_BIBLE.md` — Kling/image prompts + reference sheets (~217 assets)
- `PRODUCTION_BIBLE.md` — master production doc (cinematic, audio, dialog)
- `ART_PRODUCTION_BIBLE.md` — art-specific production
- `ART_SOUND_MUSIC_RESOURCES.md` — external asset references
- `ASSET_URLS.md` — CDN URL registry
- `FIGHTER_LORE_CROSSREF.md` — fighter ↔ Loredex cross-reference
- `FIGHT_CDN_URLS.md` — fight-specific CDN assets
- `CONSISTENCY_GATE.md` — human checklist for asset approval
- `elara-vo-script.md` — Elara voice script
- `prompts/` — raw generation prompts (Kling, Suno, puzzle books, slides)

**Rule:** These describe inputs, not shipping state.

## `archive/` — Historical / legacy
Docs that were active in earlier phases but are no longer canonical.

- `LOREDEX_OS_DEVELOPER_HANDOFF.md` — early dev onboarding
- `REBUILD_NOTES.md` + `REBUILD_STATUS.md` — rebuild-era scratch
- `NAVIGATION_REDESIGN.md` — nav refactor notes
- `FIGHTING_GAME_ENGINE_UPGRADE.md` — fight engine design notes
- `STREETFIGHTER_ANALYSIS.md` / `MK_ASSESSMENT.md` — fighting-game research
- `discovery-design-notes.md` / `ideas.md` — early ideation
- `todo.md` — historical task list

**Rule:** Archive is read-only memory. Don't update these — they're snapshots.

---

## Adding a new doc

1. Ask: does this describe **what the code does today**, **what we want it to do**, or **how to make an asset**?
2. Drop it in the matching folder.
3. When you finish a system, migrate its docs from `design/` → `built/`.

## Verification discipline

Every `built/` doc should have a "Last verified against code" date at the top. If > 30 days old, flag it for re-verification before trusting it.
