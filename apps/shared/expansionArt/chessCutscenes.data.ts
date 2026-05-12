/**
 * Chess cutscenes — 25 producer-art deliverables that wire every
 * chess opponent + tutorial gate + Climb tier into the cutscene
 * dispatcher.
 *
 * Composition:
 *   - 9 tutorial-gate intros (chess_tutorial)
 *     Celebration Game Master welcoming the student into each gate.
 *     Source: apps/shared/tcg-core/story/chessTutorial*.ts
 *   - 12 ladder first-encounter beats (chess_ladder)
 *     11 canonical storyOrder opponents + 1 hidden (the_architect).
 *     Source: CHESS_CHARACTERS in apps/server/routers/chess.ts
 *   - 4 chess Climb tier entries (chess_climb)
 *     Corrupted-GM wager beats per chessClimbTiers.ts.
 *
 * Each entry is addressable via expansionCutsceneVideoUrl(id). Posters
 * are optional and not yet shipped (producer prompts in
 * docs/production/_CHESS_CUTSCENE_PROMPTS.md generate them).
 *
 * Re-generate via inspection of CHESS_CHARACTERS + CHESS_TUTORIAL_GATES
 * + CHESS_CLIMB_TIER_IDS if new opponents / gates / tiers are added.
 */

import type { ExpansionCutsceneDef } from "./cinematicsManifest";

export const CHESS_CUTSCENES_DATA: readonly ExpansionCutsceneDef[] = [
  /* ─── Tutorial gates — Celebration Game Master, 9 cutscenes ─── */
  {
    id: "cs_chess_tut_g1_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g1_intro.mp4",
  },
  {
    id: "cs_chess_tut_g2_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g2_intro.mp4",
  },
  {
    id: "cs_chess_tut_g3_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g3_intro.mp4",
  },
  {
    id: "cs_chess_tut_g4_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g4_intro.mp4",
  },
  {
    id: "cs_chess_tut_g4_5_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g4_5_intro.mp4",
  },
  {
    id: "cs_chess_tut_g5_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g5_intro.mp4",
  },
  {
    id: "cs_chess_tut_g5_5_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g5_5_intro.mp4",
  },
  {
    id: "cs_chess_tut_g6_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g6_intro.mp4",
  },
  {
    id: "cs_chess_tut_g7_intro",
    category: "chess_tutorial",
    videoRelPath: "art/cutscenes/chess_tutorial/cs_chess_tut_g7_intro.mp4",
  },

  /* ─── Ladder first-encounters — 11 canonical storyOrder + 1 hidden ─── */
  {
    id: "cs_chess_ladder_the_human_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_human_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_collector_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_collector_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_iron_lion_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_iron_lion_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_enigma_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_enigma_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_warlord_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_warlord_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_oracle_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_oracle_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_necromancer_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_necromancer_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_programmer_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_programmer_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_agent_zero_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_agent_zero_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_source_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_source_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_game_master_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_game_master_first_seated.mp4",
  },
  {
    id: "cs_chess_ladder_the_architect_first_seated",
    category: "chess_ladder",
    videoRelPath: "art/cutscenes/chess_ladder/cs_chess_ladder_the_architect_first_seated.mp4",
  },

  /* ─── Chess Climb — 4 wager-tier entries (corrupted GM) ─── */
  {
    id: "cs_chess_climb_tier_0_exhibition",
    category: "chess_climb",
    videoRelPath: "art/cutscenes/chess_climb/cs_chess_climb_tier_0_exhibition.mp4",
  },
  {
    id: "cs_chess_climb_tier_1_wagered",
    category: "chess_climb",
    videoRelPath: "art/cutscenes/chess_climb/cs_chess_climb_tier_1_wagered.mp4",
  },
  {
    id: "cs_chess_climb_tier_2_hierarchy_table",
    category: "chess_climb",
    videoRelPath: "art/cutscenes/chess_climb/cs_chess_climb_tier_2_hierarchy_table.mp4",
  },
  {
    id: "cs_chess_climb_tier_3_labyrinth_wager",
    category: "chess_climb",
    videoRelPath: "art/cutscenes/chess_climb/cs_chess_climb_tier_3_labyrinth_wager.mp4",
  },
];
