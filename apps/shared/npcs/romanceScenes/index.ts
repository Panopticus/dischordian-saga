// apps/shared/npcs/romanceScenes/index.ts
//
// Aggregate barrel for the per-stage romance scene scripts. Each
// candidate exports a stage-keyed bank; the engine reads these
// banks alongside the canonical NpcLine selector.
//
// The romanceLadders scaffolding (5-stage gates, exclusivity,
// trust thresholds) lives in apps/shared/romanceLadders.ts when
// present; this module is intentionally usable without that
// scaffolding so the content can ship before or after the
// gating infrastructure.

import type { NpcLine } from "../types";

import { LOCKE_ROMANCE_BANK } from "./locke";
import { VEX_ROMANCE_BANK } from "./vex";
import { ELARA_ROMANCE_BANK } from "./elara";
import { DMC_ROMANCE_BANK } from "./dmc_companion";
import { JERICHO_ROMANCE_BANK } from "./jericho_jones";

/** Canonical romance candidate id. Mirrors the RomanceNpcId in
 *  romanceLadders.ts when that module is present. */
export type RomanceNpcId =
  | "locke"
  | "vex"
  | "elara"
  | "dmc_companion"
  | "jericho_jones";

export const ROMANCE_NPC_IDS: readonly RomanceNpcId[] = [
  "locke",
  "vex",
  "elara",
  "dmc_companion",
  "jericho_jones",
];

export const ROMANCE_SCENE_BANKS: Readonly<Record<RomanceNpcId, ReadonlyArray<NpcLine>>> = {
  locke: LOCKE_ROMANCE_BANK,
  vex: VEX_ROMANCE_BANK,
  elara: ELARA_ROMANCE_BANK,
  dmc_companion: DMC_ROMANCE_BANK,
  jericho_jones: JERICHO_ROMANCE_BANK,
};

/** Per-candidate committed-flag string. Sticky; written to
 *  npc_public_flags when the player commits at stage 3. */
export const ROMANCE_COMMITTED_FLAGS: Readonly<Record<RomanceNpcId, string>> = {
  locke: "romance:committed:locke",
  vex: "romance:committed:vex",
  elara: "romance:committed:elara",
  dmc_companion: "romance:committed:dmc_companion",
  jericho_jones: "romance:committed:jericho_jones",
};

export {
  LOCKE_ROMANCE_BANK,
  VEX_ROMANCE_BANK,
  ELARA_ROMANCE_BANK,
  DMC_ROMANCE_BANK,
  JERICHO_ROMANCE_BANK,
};
