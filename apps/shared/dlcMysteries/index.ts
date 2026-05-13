/**
 * DLC mystery arcs — barrel.
 *
 * Nine full 5-episode arcs. Eight original mini-DLC arcs (one per
 * mini-DLC manifest under `apps/shared/dlc/chapters/dlc_y*`) plus
 * the Wolf · Anara Hunt arc that diegetically onboards the
 * Hunt-the-Hero minigame.
 *
 * Each arc carries 5 episodes, ≥4 suspects, ≥2 lenses,
 * episode-chained `unlocksEpisode` links where applicable, and
 * clues placed in universal rooms (parity check enforced by
 * mysteryAccessibilityParity.test.ts).
 *
 * `DLC_MYSTERIES` is spread into `MYSTERY_DEFINITIONS` in
 * `apps/shared/episodeMysteries.ts` so the runtime picks them up
 * alongside the existing spine NPC arcs.
 */
import type { MysteryDefinition } from "../mysteryTypes";
import { CHARTER_MISSING_SIGNATORY_MYSTERY }   from "./charterMissingSignatory";
import { SEVERANCE_BOUND_CHAMPION_MYSTERY }    from "./severanceBoundChampion";
import { MECHRONIS_MISSING_PROFESSOR_MYSTERY } from "./mechronisMissingProfessor";
import { MEMORIAL_FORGOTTEN_NAMES_MYSTERY }    from "./memorialForgottenNames";
import { CHARTER_SECOND_SIGNATORY_MYSTERY }    from "./charterSecondSignatory";
import { SEVERANCE_INFERNAL_CLAUSE_MYSTERY }   from "./severanceInfernalClause";
import { MECHRONIS_CHAINED_LESSON_MYSTERY }    from "./mechronisChainedLesson";
import { MEMORIAL_SEVEN_WATCHERS_MYSTERY }     from "./memorialSevenWatchers";
import { WOLF_ANARA_HUNT_MYSTERY }             from "./wolfAnaraHunt";
import { AKAI_SHI_RED_DEATH_MYSTERY }          from "./akaiShiRedDeath";
import { RESURRECTIONIST_CYCLE_WALKER_MYSTERY } from "./resurrectionistCycleWalker";

export const DLC_MYSTERIES: ReadonlyArray<MysteryDefinition> = [
  CHARTER_MISSING_SIGNATORY_MYSTERY,
  SEVERANCE_BOUND_CHAMPION_MYSTERY,
  MECHRONIS_MISSING_PROFESSOR_MYSTERY,
  MEMORIAL_FORGOTTEN_NAMES_MYSTERY,
  CHARTER_SECOND_SIGNATORY_MYSTERY,
  SEVERANCE_INFERNAL_CLAUSE_MYSTERY,
  MECHRONIS_CHAINED_LESSON_MYSTERY,
  MEMORIAL_SEVEN_WATCHERS_MYSTERY,
  WOLF_ANARA_HUNT_MYSTERY,
  AKAI_SHI_RED_DEATH_MYSTERY,
  RESURRECTIONIST_CYCLE_WALKER_MYSTERY,
];

export {
  CHARTER_MISSING_SIGNATORY_MYSTERY,
  SEVERANCE_BOUND_CHAMPION_MYSTERY,
  MECHRONIS_MISSING_PROFESSOR_MYSTERY,
  MEMORIAL_FORGOTTEN_NAMES_MYSTERY,
  CHARTER_SECOND_SIGNATORY_MYSTERY,
  SEVERANCE_INFERNAL_CLAUSE_MYSTERY,
  MECHRONIS_CHAINED_LESSON_MYSTERY,
  MEMORIAL_SEVEN_WATCHERS_MYSTERY,
  WOLF_ANARA_HUNT_MYSTERY,
  AKAI_SHI_RED_DEATH_MYSTERY,
  RESURRECTIONIST_CYCLE_WALKER_MYSTERY,
};
