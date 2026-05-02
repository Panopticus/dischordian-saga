/* ═══════════════════════════════════════════════════════
   DREAMER FRAGMENTS ROUTER

   One read query: getMyFragments. Reads dreamer_awareness for the
   caller, computes which Dreamer Fragments are visible, returns
   them. The catalog (apps/shared/dreamerFragments.ts) is the
   source of truth for IDs / titles / bodies; the gating logic is
   the pure helper `visibleDreamerFragments()`.

   No-DB-safe: when the dreamer_awareness row is missing or the DB
   is unavailable, `visionsReceived` is empty and the section is
   hidden. The router never throws.
   ═══════════════════════════════════════════════════════ */
import { protectedProcedure, router } from "../_core/trpc";
import { getDreamerAwareness } from "../services/dreamerAwareness";
import {
  DREAMER_FRAGMENTS,
  dreamerFragmentsSectionVisible,
  visibleDreamerFragments,
} from "../../shared/dreamerFragments";

export const dreamerFragmentsRouter = router({
  /**
   * Read the fragments visible to the caller. Returns the section
   * visibility flag (so the client can choose to render the tab /
   * nav entry) plus the array of unlocked fragments.
   *
   * The catalog total is also returned so the client can show
   * progress like "3 of 4 fragments unlocked."
   */
  getMyFragments: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await getDreamerAwareness(ctx.user.id);
    const visionsReceived = snapshot?.visionsReceived ?? [];
    return {
      sectionVisible: dreamerFragmentsSectionVisible(visionsReceived),
      fragments: visibleDreamerFragments(visionsReceived),
      catalogTotal: DREAMER_FRAGMENTS.length,
      visionsReceivedCount: visionsReceived.length,
    };
  }),
});
