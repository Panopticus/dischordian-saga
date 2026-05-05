// apps/shared/npcs/romanceScenes/index.ts
//
// Aggregate barrel for the per-stage romance scene scripts. Each
// candidate exports a stage-keyed bank; the engine reads these
// banks alongside the canonical NpcLine selector.
//
// The romanceLadders scaffolding (5-stage gates, exclusivity,
// trust thresholds) lives in apps/shared/romanceLadders.ts; this
// module is the matching content layer.

import {
  ROMANCE_LADDERS,
  ROMANCE_NPC_IDS,
  type RomanceNpcId,
} from "../../romanceLadders";
import type { NpcLine } from "../types";

import { LOCKE_ROMANCE_BANK } from "./locke";
import { VEX_ROMANCE_BANK } from "./vex";
import { ELARA_ROMANCE_BANK } from "./elara";
import { DMC_ROMANCE_BANK } from "./dmc_companion";
import { JERICHO_ROMANCE_BANK } from "./jericho_jones";

export const ROMANCE_SCENE_BANKS: Readonly<Record<RomanceNpcId, ReadonlyArray<NpcLine>>> = {
  locke: LOCKE_ROMANCE_BANK,
  vex: VEX_ROMANCE_BANK,
  elara: ELARA_ROMANCE_BANK,
  dmc_companion: DMC_ROMANCE_BANK,
  jericho_jones: JERICHO_ROMANCE_BANK,
};

/** Per-candidate committed-flag string. Sourced from the
 *  canonical romanceLadders registry to avoid drift. */
export const ROMANCE_COMMITTED_FLAGS: Readonly<Record<RomanceNpcId, string>> = {
  locke: ROMANCE_LADDERS.locke.committedFlag,
  vex: ROMANCE_LADDERS.vex.committedFlag,
  elara: ROMANCE_LADDERS.elara.committedFlag,
  dmc_companion: ROMANCE_LADDERS.dmc_companion.committedFlag,
  jericho_jones: ROMANCE_LADDERS.jericho_jones.committedFlag,
};

export { ROMANCE_NPC_IDS };
export type { RomanceNpcId };

export {
  LOCKE_ROMANCE_BANK,
  VEX_ROMANCE_BANK,
  ELARA_ROMANCE_BANK,
  DMC_ROMANCE_BANK,
  JERICHO_ROMANCE_BANK,
};
