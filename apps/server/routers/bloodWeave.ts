// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   BLOOD WEAVE ROUTER — Stage 3 attunement read endpoint.

   Surfaces the player's hierarchyAlignment value, the next
   pending reveal, and the discrete band ("braiding" /
   "woven" / etc.) for the Resurrection panel's Stage 3 tab.

   No mutations live here — alignment changes are pushed by
   the Hellbox / Resurrection / soul-stones routers via
   apps/server/services/bloodWeaveService.ts.
   ═══════════════════════════════════════════════════════ */

import { router, protectedProcedure } from "../_core/trpc";
import { getBloodWeaveState } from "../services/bloodWeaveService";
import {
  bandFor,
  nextReveal,
  BLOOD_WEAVE_REVEAL_POOL,
} from "../../shared/bloodWeave";

export const bloodWeaveRouter = router({
  /** Read alignment + next-reveal preview for the UI. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const state = await getBloodWeaveState(ctx.user.id);
    const band = bandFor(state.alignmentValue);
    const next = nextReveal(state);
    return {
      alignmentValue: state.alignmentValue,
      band,
      nextReveal: next,
      revealedEntryIds: state.revealedEntryIds,
      revealsTotal: BLOOD_WEAVE_REVEAL_POOL.length,
    };
  }),
});
