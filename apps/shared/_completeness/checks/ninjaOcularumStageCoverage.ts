/**
 * Ninja Ocularum stage coverage parity check.
 *
 * The ninja_ocularum apprentice discipline has 5 canonical
 * stages (apps/shared/ninjaOcularumApprentice.ts:NinjaOcularumStage).
 * Each stage MUST have a registered narration entry in
 * NINJA_OCULARUM_STAGE_NARRATION — otherwise the runtime
 * surface (which reads the narration to surface stage
 * transitions diegetically) breaks silently.
 *
 * Hard parity. New stages added to the union must come with
 * narration in the same change.
 */
import {
  NINJA_OCULARUM_APPRENTICE,
  NINJA_OCULARUM_STAGE_NARRATION,
} from "../../ninjaOcularumApprentice";
import type { RawParityCount } from "../types";

export function checkNinjaOcularumStageCoverage(): RawParityCount {
  const declared = NINJA_OCULARUM_APPRENTICE.stages.length;
  const stagesWithNarration = NINJA_OCULARUM_APPRENTICE.stages.filter(
    (stage) => {
      const text = NINJA_OCULARUM_STAGE_NARRATION[stage];
      return typeof text === "string" && text.trim().length > 0;
    },
  );
  const implemented = stagesWithNarration.length;
  const missing = NINJA_OCULARUM_APPRENTICE.stages
    .filter((stage) => !stagesWithNarration.includes(stage))
    .map((stage) => `ninja_ocularum stage '${stage}' missing narration`);
  return { declared, implemented, missing };
}
