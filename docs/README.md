# Documentation Structure

**Start here:**
- For game design / engineering: [`DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md`](./DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md) — the consolidated game-design source of truth.
- For art / audio / video production: [`ART_DEPARTMENT_PRODUCTION.md`](./ART_DEPARTMENT_PRODUCTION.md) — drag-and-drop production document with live asset inventory, production queue, canon character roster, and a list of characters that still need canon descriptions. (Generated 2026-05-08 from a direct audit of code + manifests.)

Everything else in this folder is a deeper reference for a specific area, reached from one of those two documents.

## Top-level
- `ART_DEPARTMENT_PRODUCTION.md` — single drag-and-drop production doc (start here for art / audio / video)
- `DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` — the consolidated design + engineering bible
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
- `NARRATIVE_ARCHITECTURE.md` — story structure blueprint
- `SOUL_STONES_SYSTEM.md` — soul stones mechanic design
- `VOICE_ACTING_PIPELINE.md` — voice acting pipeline design
- `VOID_ENERGY_ADOPTION_ROADMAP.md` — 5 Laws + organic-migration workflow
- `WITNESSING_NARRATIVE_PROPOSAL.md` — Witnessing system proposal
- `YEAR_ONE_EVENTS_CALENDAR_V2.md` — live events calendar

## `production/` — asset generation specs

The umbrella production doc is now `../ART_DEPARTMENT_PRODUCTION.md` (top level).
Files under `production/` are now narrowly-scoped tool-specific prompt sheets,
referenced from §6 of that doc.

**Active reference docs (don't archive)**
- `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` — full Nano Banana 2 + Veo 3.1 prompt book for every video deliverable in `ART_DEPARTMENT_PRODUCTION.md` §3 (frame-chained, no-music rule, VFX + dialog only)
- `VOICE_OVER_BIBLE.md` — ElevenLabs voice profiles + pipeline
- `LIVING_CHARACTER_SHEET_ART_BRIEF.md` — 6-track character rig + cosmetics
- `GUILD_CUTSCENE_BIBLE.md` — guild signature-cutscene Veo prompts
- `CASINO_EXPANSION_ART_BIBLE.md` — casino expansion prompts
- `CADES_SFX_PROMPTS.md` — CADES FPS Suno SFX prompts
- `dreamer-vision-veo-flashes.md` — Veo prompts for the 3 missing dreamer flashes
- `CUTSCENE_SEEDANCE_PROMPTS.md` — Seedance 2.0 cutscene prompts
- `ACT1_NARRATIVE_STRUCTURE.md` — Act 1 narrative structure
- `ALL_ACTS_ROADMAP.md` — Acts 1–7 roadmap
- `WRITING_AUDIT_AND_REVISIONS.md` — writing audit & fixes
- `ASSET_URLS.md` / `FIGHT_CDN_URLS.md` / `FIGHTER_LORE_CROSSREF.md` — registries
- `CONSISTENCY_GATE.md` — approval checklist
- `CHOICE_IMPACT_PRODUCER_HANDOFF.md` — producer handoff
- `ENGINE_DEMO_CARDS_ART_HANDOFF.md` — engine demo handoff
- `ACT1_TAUNTS_PIPELINE_OPS_HANDOFF.md` — taunts pipeline ops
- `GUILD_CUTSCENE_PORTAL_CHAMBER_FOLLOW_UP.md` — portal-chamber follow-up

**Asset-build workspaces**
- `prelude-asset-build/` — Prelude workspace (manifest + CSVs + conversion follow-up)
- `act1-asset-build/`, `act1/` — Act 1 workspaces
- `acts-2-7-aaa-final/` — Acts 2-7 final delivery workspace
- `commission-packages/` — per-tool commission package examples
- `prompts/` — raw generation prompts (Kling Omni act/mechanic intros, Suno music, Cades FPS)
- `vo-batches/` — VO batch processing

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
- `2026-05-08-superseded/` — 40 production / art / asset bibles collapsed into `ART_DEPARTMENT_PRODUCTION.md` on 2026-05-08; see ledger in §7 of that doc

---

## Rules

1. **New work goes in the bible.** Add the TODO to §8 and the design detail to §4/§5 of the bible or a new section — don't spin up another top-level doc.
2. **Reference docs stay flat.** If you need a per-environment art bible, a voice-script dump, or an asset-build workspace, put it under `production/` and link it from the bible's appendix.
3. **Kill stale docs.** When a design ships, either fold the summary into the bible and delete the design doc, or mark it explicitly superseded in its first line.
