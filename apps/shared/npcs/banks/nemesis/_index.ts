/* ═══════════════════════════════════════════════════════
   NEMESIS PAIR-BANK BARREL — Phase K5 authoring waterfall

   Each pair-bank file in this directory is named
   `{playerArchetype}_vs_{nemesisArchetype}.ts` and
   exports a NemesisPairBank.

   The runtime collects pair-banks at module-import time;
   adding a new pair-bank requires re-exporting it here so
   the encounter-render path can find it. The K10.1 parity
   check counts pair-bank files via filesystem readdir
   directly — adding a new file is sufficient to climb the
   ratchet without manual registry maintenance.
   ═══════════════════════════════════════════════════════ */

export type { NemesisPairBank, NemesisScene, NemesisGrudgeBand, NemesisEncounterSceneId } from "./_types";
export { makeScene } from "./_types";

import { ghostVsHereticPairBank } from "./ghost_vs_heretic";

/** All authored pair-banks. Add new entries as authoring
 *  ships through the K5.2 waterfall (target: 132 entries). */
export const NEMESIS_PAIR_BANKS = [
  ghostVsHereticPairBank,
] as const;
