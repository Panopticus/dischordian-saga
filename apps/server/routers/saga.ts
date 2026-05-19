import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getSagaLedger } from "../services/sagaLedgerService";

/**
 * "Your Saga" — the player's own consequence ledger.
 *
 * Surfaces the durable ripple_events trail (humanized) plus the
 * npc_public_flags that describe how the world now regards the
 * player. Read-only; the data is written elsewhere (rippleLedger /
 * npc reaction services).
 */
export const sagaRouter = router({
  ledger: protectedProcedure
    .input(
      z
        .object({ limit: z.number().int().min(1).max(200).default(60) })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return getSagaLedger(ctx.user.id, input?.limit ?? 60);
    }),
});
