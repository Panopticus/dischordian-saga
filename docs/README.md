# Documentation Structure

This `docs/` folder is organized into three categories. **Every doc belongs to exactly one.**

## `built/` — Reflects shipping code
Documents in this folder describe systems, lore, and content that is **actually implemented and running** in the live app. These files are the source of truth for what the game currently IS.

- `LORE_BIBLE.md` — canonical worldbuilding, characters, timeline

**Rule:** If something is in `built/`, you should be able to point to the TypeScript/React code that implements it.

## `design/` — Aspirational, roadmap, analysis
Documents here describe what we **plan** or **considered** building. Not yet true of the shipping app.

- `NARRATIVE_ARCHITECTURE.md` — story structure blueprint
- `rpg-analysis-recommendations.md` — RPG design notes

**Rule:** When a system in `design/` ships, move its section into `built/` or delete it from `design/`.

## `production/` — Asset generation specs
Documents here tell the human production team how to generate assets (voice, visuals, music).

- `VOICE_OVER_BIBLE.md` — ElevenLabs voice specs + scripts
- `VISUAL_PRODUCTION_BIBLE.md` — Kling/image prompts + reference sheets

**Rule:** These are instructions for humans + AI tools. They describe inputs, not shipping state.

---

## Adding a new doc

1. Ask: does this describe **what the code does today**, **what we want it to do**, or **how to make an asset**?
2. Drop it in the matching folder.
3. When you finish a system, migrate its docs from `design/` → `built/`.

## Verification discipline

Every `built/` doc should have a "Last verified against code" date at the top. If > 30 days old, flag it for re-verification before trusting it.
