/* ═══════════════════════════════════════════════════════
   DREAMER VISIONS ROUTER (D2 in
   /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Two procedures:

     getNextPendingVision (query): look up the player's current
       awareness state and return the next vision they should
       receive (if any). The client polls this at login; if a
       vision is pending, the orchestrator queues it via
       playSlideshow(...) before the title screen renders.

     markVisionReceived (mutation): bookkeeping. Called when the
       slideshow completes or is skipped past 15% (the same
       threshold the existing flag-set-on-complete logic uses).
       Idempotent — re-firing for the same vision id is a no-op.

   No new mutation creates rows in dreamer_awareness; those are
   created by tagDreamerAwareness(...) when a gameplay site
   triggers a tag. This router is purely the visible-recruitment
   side: it reads the silent counter and surfaces the next visual
   payload.
   ═══════════════════════════════════════════════════════ */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getDreamerAwareness,
  markVisionReceived as markVisionReceivedSvc,
} from "../services/dreamerAwareness";
import {
  nextPendingVision,
  getVisionById,
} from "../../shared/dreamerVisions";

export const dreamerVisionsRouter = router({
  /**
   * Resolve the next vision pending for the caller, or null if
   * none. The shape returned mirrors `DreamerVision` from
   * dreamerVisions.ts; the client passes the embedded slideshow
   * directly to playSlideshow(...).
   */
  getNextPendingVision: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await getDreamerAwareness(ctx.user.id);
    if (!snapshot) {
      // Either the DB pool is unavailable or no tag has fired yet —
      // either way there's nothing to deliver.
      return { vision: null as null };
    }
    const next = nextPendingVision(snapshot.count, snapshot.visionsReceived);
    if (!next) return { vision: null as null };
    return {
      vision: {
        id: next.id,
        threshold: next.threshold,
        title: next.title,
        slideshow: next.slideshow,
      },
    };
  }),

  /**
   * Mark a vision as delivered. Validates that the visionId is one
   * authored in the catalog so a hand-crafted client can't pollute
   * the visionsReceived set with arbitrary strings.
   */
  markVisionReceived: protectedProcedure
    .input(
      z.object({
        visionId: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const vision = getVisionById(input.visionId);
      if (!vision) {
        return { success: false as const, reason: "unknown_vision_id" };
      }
      await markVisionReceivedSvc(ctx.user.id, vision.id);
      return { success: true as const };
    }),
});
