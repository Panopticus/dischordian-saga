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
import { getDreamerAwareness } from "../services/dreamerAwareness";

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

  /**
   * Read-only status surface for the Dreamer-aware gating layer (D3).
   *
   * Returns a small, opaque-by-default snapshot the client uses to
   * pick alternate dialog-tree entries when the player has crossed
   * the Dreamer-recognition bar. The flag the client actually reads
   * is `isDreamerAware` — true iff the silent counter has reached
   * the first vision threshold AND at least one vision has been
   * delivered. The raw `count` is exposed for moderator surfaces
   * but the client UI does not display it.
   *
   * No row → returns the inert zero state. Visions / counts cannot
   * regress, so this is safe to cache aggressively client-side.
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await getDreamerAwareness(ctx.user.id);
    if (!snapshot) {
      return {
        count: 0,
        visionsReceivedCount: 0,
        isDreamerAware: false as const,
      };
    }
    const visionsReceivedCount = snapshot.visionsReceived.length;
    return {
      count: snapshot.count,
      visionsReceivedCount,
      // The Dreamer-aware gate per the recruitment plan:
      //   awareness ≥ 3  AND  ≥ 1 vision has been delivered.
      // Both must be true — a player who's accumulated tags but
      // hasn't yet been delivered a vision is still pre-recognition.
      isDreamerAware: snapshot.count >= 3 && visionsReceivedCount >= 1,
    };
  }),
});
