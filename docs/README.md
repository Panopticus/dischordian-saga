# Documentation Structure

**Start here:** [`DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md`](./DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md) is the single consolidated source of truth. It covers game scope, narrative status, systems index, design system, production pipelines, canon rules, the active TODO list, and a reference appendix pointing to the docs below.

Everything else in this folder is a deeper reference for a specific area, reached from the bible's appendix.

## Top-level
- `DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` — the consolidated bible (start here)
- `README.md` — this file

## `built/` — canonical lore
Source of truth for worldbuilding. Does not change with code.

- `LORE_BIBLE.md` — canon characters, timeline, locations (Rev 7)

## `design/` — active design specs
Docs describing current design intent for systems still in flight. Each is still live; the bible's §4/§5/§7 appendices link here.

- `ARCHITECTURE_PROPOSAL.md` — ship-as-app architecture
- `AUTHORING_CROSS_GAME_THREADS.md` — cross-game narrative thread authoring guide
- `AUTHORING_MORALITY_VARIANTS.md` — morality/trust/act variant authoring guide
- `ANIMATED_CUTSCENES.md` — cutscene design
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` — Rev 7 canon expansion
- `DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` — full-game layout reference
- `EXPANSION_BIBLE.md` — Dialog Wheel + Breaking Point + corruption visuals
- `FULL-PROJECT-AUDIT.md` — project-wide audit
- `NARRATIVE_ARCHITECTURE.md` — story structure blueprint
- `SOUL_STONES_SYSTEM.md` — soul stones mechanic design
- `VOICE_ACTING_PIPELINE.md` — voice acting pipeline design
- `VOID_ENERGY_ADOPTION_ROADMAP.md` — 5 Laws + organic-migration workflow
- `WITNESSING_NARRATIVE_PROPOSAL.md` — Witnessing system proposal
- `YEAR_ONE_EVENTS_CALENDAR_V2.md` — live events calendar

## `production/` — asset generation specs
Docs that tell the production team how to generate assets.

**Master bibles**
- `PRODUCTION_BIBLE.md` — master production doc
- `SHIP_READY_ASSET_BIBLE.md` — post-Prelude asset prompts (Nano Banana 2 + Seedance + ElevenLabs), 46 game modes
- `PRELUDE_SHIP_READY_BIBLE.md` — Prelude production bible (15 beats)
- `ACT1_NARRATIVE_STRUCTURE.md` — Act 1 production bible (status: skeleton)
- `ALL_ACTS_ROADMAP.md` — Acts 1–7 production roadmap
- `UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` — unified prompting doc
- `ART_PRODUCTION_BIBLE.md` — art-specific
- `VISUAL_PRODUCTION_BIBLE.md` — image/video prompts + reference sheets
- `VOICE_OVER_BIBLE.md` — ElevenLabs specs + script roster
- `COMPLETE_ART_PROMPT_BIBLE.md` — Soul Stones, Eidolons, Spectral, VFX (~112 assets)

**Per-environment & per-category**
- Per-environment bibles: `CASINO_EXPANSION_ART_BIBLE.md`, `CHRISTMAS_IN_JULY_ART_BIBLE.md`, `LORE_GALLERY_ART_BIBLE.md`, `PARALLAX_ROOMS_ART_BIBLE.md`, `PLAYER_CABIN_ART_BIBLE.md`, `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`, `OPTIONAL_COMPONENTS_ART_BIBLE.md`, `STORY_MODE_ART_BIBLE.md`
- Card-art prompts: `BREEDING_SYSTEM_ART_PROMPTS.md`, `CELEBRATION_ART_PROMPTS.md`, `CELEBRATION_MECHRONIS_ART_PROMPTS.md`, `MECHRONIS_ART_PROMPTS.md`, `PAGE_BACKGROUND_ART_PROMPTS.md`

**Open backlogs**
- `MISSING_CUTSCENES.md` — 46-cinematic backlog
- `MISSING_ART_PROMPTS.md` — remaining batch of art stills
- `WRITING_AUDIT_AND_REVISIONS.md` — writing audit & fix instructions

**Asset registries & audit**
- `ASSET_URLS.md` — generated CDN URLs
- `FIGHT_CDN_URLS.md` — fighting-game CDN assets
- `ART_SOUND_MUSIC_RESOURCES.md` — external asset resource spec
- `CONSISTENCY_GATE.md` — approval checklist
- `DEAD_MANS_CIRCUIT_PRODUCTION.md` — Dead Man's Circuit asset plan
- `FIGHTER_LORE_CROSSREF.md` — fighter ↔ Loredex cross-reference
- `CADES_SFX_PROMPTS.md` — SFX prompts for Cade

**Asset-build workspaces**
- `prelude-asset-build/` — Prelude workspace (manifest + CSVs + conversion follow-up)
- `act1-asset-build/`, `act1/` — Act 1 workspaces
- `prompts/` — raw generation prompts
- `elara-vo-script.md` — Elara voice script

## `narrative-audit/`
Audit output that still drives remediation work.
- `ACTS_2_7_COMPLETENESS_AUDIT.md` — per-act content audit

## Card-art spec roots
- `TCG_ART_SPEC.md` / `TCG_ART_SPEC_ADDENDUM.md` — TCG card-art brief
- `NANO_BANANA_*.md` — per-deck nano-banana prompt sheets
- `FNORD23_MUSIC_PROMPTS.md` — music prompts
- `silence-in-heaven/` — single-track workspace
- `art-originals/` — source material

## `archive/`
Read-only historical reference. Don't update.
- `legacy-reference/LOREDEX_OS_DEVELOPER_HANDOFF.md` — early dev onboarding

---

## Rules

1. **New work goes in the bible.** Add the TODO to §8 and the design detail to §4/§5 of the bible or a new section — don't spin up another top-level doc.
2. **Reference docs stay flat.** If you need a per-environment art bible, a voice-script dump, or an asset-build workspace, put it under `production/` and link it from the bible's appendix.
3. **Kill stale docs.** When a design ships, either fold the summary into the bible and delete the design doc, or mark it explicitly superseded in its first line.
