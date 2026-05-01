/* ═══════════════════════════════════════════════════════
   DREAMER AWARENESS ROUTER

   Player-reportable triggers for the silent-counter system. Most
   awareness tags fire from server-side gameplay paths — the
   chess-decline hook, the ask-topic counter — where the trust
   boundary is the server itself. This router covers the narrow
   set of tags the SERVER cannot detect on its own and that the
   client must report.

   Today: just the Burnt-Card witness. The Seer-Prophecy "defeated"
   outcome is purely engine-side state on the client; the server has
   no canonical hook. The client emits the report when the player
   sees the outcome land; the server validates and tags.

   Future client-reportable tags (e.g. spare-lethal-opponent in the
   card game, trade-wonder-off-meta) plug in here with the same
   shape.
   ═══════════════════════════════════════════════════════ */
import { protectedProcedure, router } from "../_core/trpc";
import { tagBurntCardWitnessed } from "../services/dreamerAwarenessTriggers";

export const dreamerAwarenessRouter = router({
  /**
   * Client report: the player just witnessed the Burnt Card via the
   * Seer-Prophecy `defeated` outcome. Idempotent at the service
   * layer (the BURNT_CARD_WITNESSED tag fires AT MOST ONCE per
   * user). No payload validation required — repeat-fires are
   * inert, and the Dreamer doesn't penalise the gullible.
   */
  reportBurntCardWitnessed: protectedProcedure.mutation(async ({ ctx }) => {
    await tagBurntCardWitnessed(ctx.user.id);
    return { success: true as const };
  }),
});
