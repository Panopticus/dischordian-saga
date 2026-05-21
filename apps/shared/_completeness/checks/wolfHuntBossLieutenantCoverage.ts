/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Boss lieutenant coverage parity check

   Hard parity: every core Hierarchy lord must have
   exactly one boss lieutenant in the registry. The 10
   lord-lieutenant card-game boss fights are the
   arc's climactic structure — if any lord is missing
   their lieutenant, the arc has a missing finale beat.

   Implementation count = lords with exactly one
   isBossLieutenant: true hero. Declared = 10
   (CORE_HIERARCHY_LORD_IDS.length). Gap > 0 = FAIL.
   ═══════════════════════════════════════════════════════ */

import {
  ALL_HERO_TARGETS,
  CORE_HIERARCHY_LORD_IDS,
} from "../../wolfHunt";
import type { RawParityCount } from "../types";

export function checkWolfHuntBossLieutenantCoverage(): RawParityCount {
  const declared = CORE_HIERARCHY_LORD_IDS.length;
  const missing: string[] = [];
  let implemented = 0;
  for (const lordId of CORE_HIERARCHY_LORD_IDS) {
    const lieutenants = ALL_HERO_TARGETS.filter(
      (h) => h.isBossLieutenant && h.corruptorLord === lordId,
    );
    if (lieutenants.length === 1) {
      implemented += 1;
    } else if (lieutenants.length === 0) {
      missing.push(`${lordId}: no lieutenant registered`);
    } else {
      missing.push(
        `${lordId}: ${lieutenants.length} lieutenants registered — canon requires exactly 1`,
      );
    }
  }
  return {
    declared,
    implemented,
    missing,
  };
}
