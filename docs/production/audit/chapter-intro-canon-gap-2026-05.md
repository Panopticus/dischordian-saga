# Chapter-Intro Canon Gap — 2026-05 Producer Drop

**Status:** OPEN — needs writer/producer canon decision before
engineering can wire the remaining 12 intros.

## Context

The 2026-05-10 producer drop (`FIGHT_INTROS_COMPLETE.zip`) shipped
21 chapter-intro MP4s for saga chapters 5–21 (17 base + ch11
gamemaster_robot variant + 3 BONUS variants — nilmorg, conexus,
shadow_tongue). Each intro is documented in
`docs/production/NANO_BANANA_VEO_FULL_PROMPT_BOOK.md §3.1–3.17`
with character description, shot pattern, voice direction, and
asset path.

Cross-referenced against the engine's two existing chapter/opponent
loaders:

- **`apps/shared/tcg-core/story/chapters.ts`** — Act 1
  `StoryEncounter` records loaded by `StoryModePage`. Uses
  alphanumeric chapterIds (`ch1`, `ch3a`, `ch_game_master`).
- **`apps/shared/act1Opponents.ts`** — Act 1 cycle opponents
  loaded by `Act1CardLadderPage`. Uses snake-case `id` slugs
  (`minnie_meme`, `young_kael`).
- **`apps/shared/acts2to7Opponents.ts`** — Acts 3, 4, 6, 7
  opponent definitions (Acts 2 & 5 are interludes with no
  scripted opponents). Total: 10 opponents across all four acts.

**9 of 21 producer intros confidently mapped** to canonical Act 1
chapter/opponent records and are now wired through
`apps/shared/storyEncounterChapterIntros.ts` →
`StoryModePage` + `Act1CardLadderPage`. See that file for the
mapping table and the in-line cross-references to the bible
`§3.x` sections.

## The 12 unmapped producer intros

The remaining 12 producer chapter intros have **NO canonical
opponent counterpart** in `chapters.ts`, `act1Opponents.ts`, or
`acts2to7Opponents.ts`. The producer's saga-wide chapter
numbering does not align with the per-act opponent canon.

| Producer slug | Bible §3.x | Character | Why unmapped |
|---|---|---|---|
| `ch06_necromancer` | §3.2 | The Necromancer | No "necromancer" opponent in any Act 1–7 file. Necromancer is a saga-wide entity (livingUniverseEvents.ts: NECROMANCER_RETURN_EVENT) but no scripted matchup exists. |
| `ch12_collector_rematch` | §3.8 | The Collector (rematch) | Corey the Collector is fought once in Act 1 Cycle A; no rematch encounter declared in Acts 2–7. |
| `ch14_source` | §3.10 | The Source / Kael | Plausible match with `act7_the_patient_zero_reborn` (Source = Patient Zero per lore), but the bible's Source is "Kael, eternal-corrupted form" — different visual canon. Needs producer call. |
| `ch15_jailer` | §3.11 | The Jailer | Zero "jailer" hits across all opponent files. Wayne Warden (Act 1 Cycle C) is "Warden", visually distinct per bible §3.11. |
| `ch16_ironlion_rematch` | §3.12 | Iron Lion (rematch) | Young Iron Lion is fought once in Act 1 Cycle B; no rematch encounter declared in Acts 2–7. |
| `ch17_elara_glitched` | §3.13 | Elara antagonist (glitched) | Plausible match with `act6_the_woman_she_was` (Elara confession encounter), but bible §3.13 specifies "antagonist phase, glitched hologram" — confession encounter isn't antagonistic. |
| `ch20_dreamer` | §3.16 | The Dreamer | Two Act 1 chapters (`ch6` False Prophet, `ch9a` Unknown Variable) carry `boss_faction: dreamer` — collision; no Act 2–7 dedicated Dreamer encounter. |
| `ch21_oracle_meme` | §3.17 | Oracle / Meme (ambiguous final form) | Bible specifies "ambiguous final form" suggesting Act 7 ending. No `oracle_meme` opponent id in any file. |
| `ch19_nilmorg_BONUS` | (not in §3) | Nilmorg | Bonus content; no canonical opponent. |
| `ch20_conexus_BONUS` | (not in §3) | Conexus Authority | Bonus content; no canonical opponent. |
| `ch21_shadow_tongue_BONUS` | (not in §3) | Shadow Tongue | Bonus content; Shadow Tongue is a saga-wide entity (livingUniverseEvents: SHADOW_TONGUE_EDIT_EVENT) with no scripted matchup. |
| `ch11_gamemaster_robot` | §3.7 | Game Master (robot variant) | Already mapped via `ch11_gamemaster_human` in `storyEncounterChapterIntros.ts:51`; the robot variant is the producer's "render BOTH variants" alternate (different visual + voice direction). The current mapping plays the human variant by default — the robot variant is reachable but unwired. |

## Three resolution paths per entry

For each unmapped intro, writer/producer needs to pick:

**(a) Extend Acts 2–7 opponent canon** — author a new opponent in
`acts2to7Opponents.ts` (and a corresponding dialog table in
`actNOpponentDialog.ts`) that matches the bible's character
description. Chapter intro auto-fires once mapped.

**(b) Reclassify as DLC** — move the intro into a DLC chapter
(`apps/shared/dlc/chapters/<id>/`) and play it via `cinematic_ref`
step (the Phase 5 Y1Q pattern is the template). This is the
right path for "rematch" content and bonus variants that don't fit
the spine.

**(c) Reclassify as alternate-timeline / save-state variant** —
gate on a narrative-flag combination instead of a chapter-load
event. The variant fires when the player reaches a particular
state regardless of which encounter they're in. This is the right
path for "glitched" or alternate-form variants that are reactions
to player choices.

## What engineering needs back

Per-row decision in this format (one line per unmapped intro):

```
ch06_necromancer: (a) extend Acts 2-7 — author opponent "act6_thazulok_returns" in acts2to7Opponents.ts, dialog in act6OpponentDialog.ts
```

Once landed, engineering adds the corresponding row to
`STORY_CHAPTER_INTRO_MAPPINGS` in
`apps/shared/storyEncounterChapterIntros.ts` (chapter-id branch
or opponent-id branch as appropriate) and a one-line consumer-site
trigger in the relevant Act page (Act3CardLadderPage,
Act4MatchPage, Act6CardLadderPage, Act7CardLadderPage). The
existing Act 1 wiring at `StoryModePage.handlePick` and
`Act1CardLadderPage.handleEngage` shows the pattern.

## What's verifiable right now

- All 21 producer MP4s are live on CDN (verified 200 OK during
  Phase 0 of this initiative).
- 9 of 21 are wired to consumer surfaces (Act 1 chapters + cycle
  opponents); covered by
  `apps/shared/__tests__/storyEncounterChapterIntros.test.ts`.
- 12 of 21 are sitting on CDN waiting for the canon decisions
  above.
- The audit is the verifiable artifact — re-run
  `pnpm exec vitest run apps/shared/__tests__/storyEncounterChapterIntros`
  to confirm only the 9 confident mappings exist; any expansion
  must update both this doc and the resolver test.
