# Chapter-Intro Canon Gap — 2026-05 Producer Drop

**Status:** RESOLVED 2026-05-10 (PR #565 follow-up branch
`claude/add-missing-cutscenes-7fnSa`). 11 of 12 originally-unmapped
chapter intros + the gamemaster_robot variant + 2 of 3 BONUS
variants are now wired. 4 of the 11 chapter-intro decisions used
SCAFFOLD opponents that need writer review before final ship; the
rest are direct resolver additions, wire to existing opponents, or
rename existing opponents in place. The 12th producer file
(`ch20_conexus_BONUS`) is **explicitly deferred** — Authority
alignment is unspecified in saga canon, so the BONUS sits inert
on CDN with no engine setter (see DEFERRED_BONUS_INTRO_IDS).

## Per-row resolution table

| Producer slug | Resolution | Phase | Writer review needed? |
|---|---|---|---|
| `ch06_necromancer` | NEW Act 6 step 3 opponent `act6_thazulok_returns` (event-gated) | 5 | YES — pacing + dialog voicing |
| `ch12_collector_rematch` | NEW Act 6 step 4 opponent `act6_corey_resurfaces` | 6 | YES — Act placement + pacing |
| `ch14_source` | EXISTING `act7_the_patient_zero_reborn` (writer call: punt visual canon) | 3 | OPEN — visual canon discrepancy ("construct" vs "Kael eternal-corrupted") |
| `ch15_jailer` | NEW Act 6 step 5 opponent `act6_the_jailer` | 7 | YES — pacing + `oracle_pen_liberated` flag setter |
| `ch16_ironlion_rematch` | NEW prestige-rematch resolver (opponent `young_iron_lion` at `prestigeLevel >= 1`) | 3 | NO — direct resolver, lore-aligned |
| `ch17_elara_glitched` | EXISTING `act4_the_betrayal` (Path C exclusive) | 3 | NO — direct resolver, bible-aligned |
| `ch20_dreamer` | NEW Act 7 step 5 opponent `act7_the_dreamer` (event-gated) | 8 | YES — pacing |
| `ch21_oracle_meme` | RENAME of existing `act7_the_convergence_seat` → `act7_oracle_meme_final` (same step 4, alignment-skinned dialog) | 9 | YES — alignment-conditional dialog branching follow-up |
| `ch11_gamemaster_robot` | Existing `resolveChapterIntro(11, "gamemaster_robot")` exposed via `gameMasterForm` flag; setter wired at the Path-C resolution site (`act6_path_full_secret_chosen` → robot) | 2 | NO — Path-C decision locked |
| `ch19_nilmorg_BONUS` | New `BonusChapterIntroRouter` watches `trade_empire_arc_completed` flag + act ≥ 5 | 4 | YES — gating flag name |
| `ch20_conexus_BONUS` | **DEFERRED** — listed in `DEFERRED_BONUS_INTRO_IDS`. No setter authored; producer MP4 inert on CDN. Three rejected gate options recorded in plan: Hierarchy DLC completion / Architect-leaning Act 6 close / Visible War cover held. | n/a | YES — Authority alignment unspecified in saga canon today; revisit when formally specced |
| `ch21_shadow_tongue_BONUS` | New `BonusChapterIntroRouter` watches canonical `living_universe_event_shadow_tongue_edit_active` + act ≥ 7 | 4 | NO — canonical event flag |

## What's verifiable

- All 21 producer MP4s are live on CDN (verified during PR #565).
- 20 of 21 are wired to consumer surfaces; `ch20_conexus_BONUS` is
  intentionally inert (deferred — see DEFERRED_BONUS_INTRO_IDS).
- `STORY_CHAPTER_INTRO_MAPPINGS` in
  `apps/shared/storyEncounterChapterIntros.ts` has 4 chapterId +
  12 opponentId + 1 prestige-rematch entries.
- `BONUS_CHAPTER_INTRO_GATES` in
  `apps/shared/bonusChapterIntroTriggers.ts` has 2 active gates;
  `DEFERRED_BONUS_INTRO_IDS` documents the 1 deferred BONUS.
- vitest assertions in
  `apps/shared/__tests__/storyEncounterChapterIntros.test.ts` +
  `apps/shared/__tests__/bonusChapterIntroRouter.test.ts` cover
  every active gate plus a negative assertion that CoNexus
  never fires.

## What's still pending writer review

Four SCAFFOLD opponents (Phases 5, 6, 7, 8) ship with the
producer cinematics fully wired but their dialog + pacing +
encounter placement need writer ratification before final ship.
They are clearly marked `/* SCAFFOLD ... writer review */` in
both `acts2to7Opponents.ts` and the per-act dialog files. Phase 9
(Oracle/Meme) is a rename of the existing Convergence Seat rather
than a new opponent — it ships using the saga-finale slot already
in player flow.

Three flag-setter sites are unauthored (engineering's best-guess
flag names are documented in code comments):
- `trade_empire_arc_completed` — never set (Phase 4 / Nilmorg)
- `oracle_pen_liberated` — never set (Phase 7 / Jailer)
- `oracle_alignment` / `meme_alignment` — never set (Phase 9 /
  Oracle-Meme alignment-conditional dialog branching follow-up)

These 3 setter sites can be authored independently in any
future PR; the dependent surfaces remain at default behavior
until they are.

The CoNexus BONUS is **explicitly deferred** rather than left as
an unauthored setter — Authority alignment has no canonical
narrative anchor in saga canon today, so engineering chose not
to ship a writer-review-needed gate. Three plausible gate options
were considered and rejected pending writer spec: (a) Hierarchy
DLC completion, (b) Architect-leaning Act 6 close, (c) Visible
War cover held. Revisit when Authority alignment is formally
defined.

---

## Original audit (preserved for reference)

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
