/**
 * DLC mystery arcs — barrel.
 *
 * Eight full 5-episode arcs, one per mini-DLC manifest under
 * `apps/shared/dlc/chapters/dlc_y*`. Each arc carries 5 episodes,
 * ≥4 suspects, ≥2 lenses, episode-chained `unlocksEpisode` links,
 * and clues placed only in universal rooms (the parity check
 * enforced by mysteryAccessibilityParity.test.ts).
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

export const DLC_MYSTERIES: ReadonlyArray<MysteryDefinition> = [
  CHARTER_MISSING_SIGNATORY_MYSTERY,
  SEVERANCE_BOUND_CHAMPION_MYSTERY,
  MECHRONIS_MISSING_PROFESSOR_MYSTERY,
  MEMORIAL_FORGOTTEN_NAMES_MYSTERY,
  CHARTER_SECOND_SIGNATORY_MYSTERY,
  SEVERANCE_INFERNAL_CLAUSE_MYSTERY,
  MECHRONIS_CHAINED_LESSON_MYSTERY,
  MEMORIAL_SEVEN_WATCHERS_MYSTERY,
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
};
