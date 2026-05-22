/* ═══════════════════════════════════════════════════════
   THREE CLOCKS ROUTER — docs/design/NEXUS_TRIAL_PLAN.md

   Reader endpoint for the unified Three Clocks panel. The
   panel reads one composed snapshot from three independent
   state machines:

     Vortex        ← dischordiaCycleService.getState()
     Necromancer   ← (Sprint-2 stub: DEFAULT_CYCLE_STATE)
     Politician    ← (Sprint-2 stub: empty roster)

   Sprint 2 ships the composer + a polling endpoint. The
   subscription transport (WebSocket push of phase
   transitions) lands in Sprint 4 alongside the Three
   Clocks UI work — the data layer is already correct, the
   delivery channel just changes.

   Public surface — the panel is a community read-model.
   Per-IP rate limit is provided by the Express gateway
   (apps/server/_core/index.ts: publicIpRateLimit).
   ═══════════════════════════════════════════════════════ */

import { publicProcedure, router } from "../_core/trpc";
import { dischordiaCycleService } from "../services/dischordiaCycleService";
import {
  composeThreeClocksState,
  type ThreeClocksState,
} from "@shared/threeClocks/state";
import { DEFAULT_CYCLE_STATE } from "@shared/necromancerCycle";

/** How often the aggregation tick is expected to fire during the
 *  Nexus Trial window (Sprint 9 builds the actual tick service). Until
 *  then, the value here is informational — clients use it to schedule
 *  their fallback poll. */
const NEXT_TICK_INTERVAL_MS = 60_000;

export const threeClocksRouter = router({
  /**
   * Returns the current Three Clocks snapshot. Polled by the panel
   * at the fallback cadence (default 30s); replaced by WebSocket
   * push on Sprint 4.
   */
  get: publicProcedure.query(async (): Promise<ThreeClocksState> => {
    const dischordia = dischordiaCycleService.getState();

    // Sprint 2 stubs — the Necromancer cycle service and the
    // playerbase-wide Nemesis aggregator land in Sprints 5–6 as
    // part of the Mission framework. Using defaults here keeps
    // the composer correct and the contract honest: the snapshot
    // is the panel's source of truth even while the underlying
    // services warm up.
    const necromancer = DEFAULT_CYCLE_STATE;
    const nemeses: never[] = [];

    return composeThreeClocksState({
      necromancer,
      dischordia,
      nemeses,
      nextTickAt: new Date(Date.now() + NEXT_TICK_INTERVAL_MS),
      seatResolved: false,
    });
  }),
});
