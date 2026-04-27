/* ═══════════════════════════════════════════════════════
   PVP RANKING ROUTER (#7)

   Read access to the persistent MMR + seasonal rank table.
   Write access (applyMatchResult) is server-internal and called
   from duelystWs.endMatch in a follow-up PR — not exposed via
   tRPC because client-side rating writes are inherently
   forgeable and the producer needs both player ids in scope
   anyway.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getRating, getLeaderboard } from "../services/pvpRatingsService";

export const pvpRankingRouter = router({
  /** The caller's own rating for the given game type. Lazily
   *  upserts at the starting defaults if the player has never
   *  played this game type — a fresh account viewing their own
   *  page sees Bronze / 1200 MMR rather than a 404. */
  myRank: protectedProcedure
    .input(
      z.object({
        gameType: z.enum(["duelyst", "chess", "pvp"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getRating(ctx.user.id, input.gameType);
    }),

  /** Top N by MMR within a game type. Public so a non-logged-in
   *  visitor can see the ladder before signing up — the page is
   *  the marketing surface, not a private dashboard. */
  leaderboard: publicProcedure
    .input(
      z.object({
        gameType: z.enum(["duelyst", "chess", "pvp"]),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ input }) => {
      return getLeaderboard(input.gameType, input.limit);
    }),
});
