/* ═══════════════════════════════════════════════════════
   APPRENTICE-ON-NEMESIS PAIR-BANK TYPES — Phase K6.2

   The parallel system to npcs/banks/nemesis/. The player's
   apprentice has dialog about the Nemesis at:

     - cohort_morning_briefing — daily check-in lines
     - breaking_point_whisper — extra branch in
       apprenticeBetrayal stage 3 when a Nemesis whisper
       plan is active
     - post_cohort_retrospective — after cohort ends
     - memory_card_inheritance — surfaced via
       apprenticeMemoryInheritance.ts when the dead
       apprentice carried a Nemesis-aware Memory Card
     - daily_observation — mid-cohort apprentice notices
       Nemesis faction activity
     - corruption_advance — when apprentice's corruption
       crosses a stage threshold mid-Nemesis-encounter
     - apprentice_warning — apprentice cautions player
       about an active Nemesis plan they've sensed
     - apprentice_pride — apprentice acknowledges player's
       handling of the Nemesis (positive bond moment)

   8 scenes × 132 pairings × 3 corruption bands = same
   ~3,000-node deliverable as the K5 nemesis side.

   The apprentice ARCHETYPE in the pairId is the PLAYER'S
   apprentice (the one they trained). The nemesis ARCHETYPE
   is the rival's archetype.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "../../../apprentices";
import type { DialogTree } from "../../../dialogTree";

export type ApprenticeOnNemesisSceneId =
  | "cohort_morning_briefing"
  | "breaking_point_whisper"
  | "post_cohort_retrospective"
  | "memory_card_inheritance"
  | "daily_observation"
  | "corruption_advance"
  | "apprentice_warning"
  | "apprentice_pride";

/** Three corruption bands per scene. Aligns with the
 *  apprenticeBetrayal.ts thresholds (low: 0-59, mid:
 *  60-89, high: 90+). */
export type ApprenticeCorruptionBand = "low" | "mid" | "high";

export interface ApprenticeOnNemesisScene {
  variants: Record<ApprenticeCorruptionBand, DialogTree>;
}

export interface ApprenticeOnNemesisPairBank {
  pairId: string;
  apprenticeArchetype: ApprenticeArchetype;
  nemesisArchetype: ApprenticeArchetype;
  scenes: Partial<Record<ApprenticeOnNemesisSceneId, ApprenticeOnNemesisScene>>;
}

export function makeApprenticeScene(args: {
  low: DialogTree;
  mid: DialogTree;
  high: DialogTree;
}): ApprenticeOnNemesisScene {
  return {
    variants: { low: args.low, mid: args.mid, high: args.high },
  };
}
