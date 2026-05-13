/* ═══════════════════════════════════════════════════════
   APPRENTICE-ON-NEMESIS PAIR-BANK BARREL — Phase K6.2
   ═══════════════════════════════════════════════════════ */

export type {
  ApprenticeOnNemesisPairBank,
  ApprenticeOnNemesisScene,
  ApprenticeCorruptionBand,
  ApprenticeOnNemesisSceneId,
} from "./_types";
export { makeApprenticeScene } from "./_types";

import { ghostOnHereticPairBank } from "./ghost_on_heretic";

export const APPRENTICE_ON_NEMESIS_PAIR_BANKS = [
  ghostOnHereticPairBank,
] as const;
