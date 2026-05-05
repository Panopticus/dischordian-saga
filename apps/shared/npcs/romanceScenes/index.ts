// apps/shared/npcs/romanceScenes/index.ts
//
// Aggregate barrel for the per-stage romance scene scripts. The
// scaffolding lives in apps/shared/romanceLadders.ts (5-stage
// ladder shape, exclusivity, gates); the per-character scene
// content lives in this directory and is exported here for
// engine consumption.

import type { RomanceNpcId } from "../../romanceLadders";
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

export {
  LOCKE_ROMANCE_BANK,
  VEX_ROMANCE_BANK,
  ELARA_ROMANCE_BANK,
  DMC_ROMANCE_BANK,
  JERICHO_ROMANCE_BANK,
};
