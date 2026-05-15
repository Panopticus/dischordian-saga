/**
 * Phase C — Servant Hero Academy future-season deferral.
 *
 * Build-plan §VIII Phase C (C6/C7 Servant-Hero portion):
 * the Servant Hero Academy is a deferred future season / DLC
 * (≥1 year out). C6 + C7-Servant-Hero are registered in
 * apps/shared/servantHeroFutureSeasonCanon.ts as typed
 * `deferred_future_season` hooks with `seamIsIntentional`.
 *
 * Hard parity: every deferred item must carry a valid
 * FutureSeasonItemStatus + seamIsIntentional === true + a
 * non-empty seamModule. `deferred_future_season` is a VALID
 * classification (gate-then-stub, like imprint `pending`):
 * the gate accounts for the deferral so the Phase-C surface
 * is not "unaccounted for", and PASSES without blocking on
 * a season that is a year out.
 *
 * No ratchet — deferral is binary. When the season ships,
 * items flip to `current_loop_shipped` in a future PR
 * without changing this gate's contract.
 */
import {
  DEFERRED_ENDGAME_ITEMS,
  getServantHeroDeferralCoverage,
} from "../../servantHeroFutureSeasonCanon";
import type { RawParityCount } from "../types";

export function checkServantHeroDeferralCoverage(): RawParityCount {
  const { declared, classified } = getServantHeroDeferralCoverage();
  const valid = new Set(["deferred_future_season", "current_loop_shipped"]);
  const missing = DEFERRED_ENDGAME_ITEMS
    .filter(
      (i) =>
        !valid.has(i.status) ||
        i.seamIsIntentional !== true ||
        i.seamModule.trim().length === 0,
    )
    .map(
      (i) =>
        `deferred item '${i.id}' (${i.buildPlanRef}) is not a valid typed ` +
          `future-season hook — Phase C requires status + ` +
          `seamIsIntentional + seamModule`,
    );
  return { declared, implemented: classified, missing };
}
