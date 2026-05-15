/**
 * Phase J / I13 — imprint first-summon cutscene coverage.
 *
 * Build-plan §VIII Phase I13: every imprint card has a
 * registered first-summon cutscene OR is explicitly flagged
 * production-pending / retired. The contract is that NO
 * imprint NPC may be UNACCOUNTED FOR — "pending" is a valid
 * classification (the gate-then-stub hook pattern used for
 * wbg-01 / the Ocularum video), "retired" is the J9 Foucault
 * decision. An imprint with no classification at all is the
 * failure.
 *
 * Hard parity: declared = registered imprint NPCs;
 * implemented = those with a valid introStatus
 * (produced | pending | retired). Any imprint that somehow
 * carries an invalid/empty status fails the gate.
 */
import {
  IMPRINT_INTRO_REGISTRY,
  getImprintIntroCoverage,
} from "../../imprintSummoningCanon";
import type { RawParityCount } from "../types";

export function checkImprintFirstSummonCutsceneCoverage(): RawParityCount {
  const { declared, classified } = getImprintIntroCoverage();
  const valid = new Set(["produced", "pending", "retired"]);
  const missing = IMPRINT_INTRO_REGISTRY
    .filter((e) => !valid.has(e.introStatus))
    .map(
      (e) =>
        `imprint '${e.slug}' (${e.displayName}) has no valid introStatus — ` +
        `Phase J I13 requires produced | pending | retired classification`,
    );
  return { declared, implemented: classified, missing };
}
