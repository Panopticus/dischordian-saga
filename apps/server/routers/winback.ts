import { protectedProcedure, router } from "../_core/trpc";
import {
  getWinbackOffer,
  claimWinbackOffer,
} from "../services/winbackOfferService";

/**
 * Lapsed-player comeback offer. `offer` is read-only (null when not
 * lapsed); `claim` grants the reward once per lapse episode and is
 * safe to retry.
 */
export const winbackRouter = router({
  offer: protectedProcedure.query(async ({ ctx }) => {
    return getWinbackOffer(ctx.user.id);
  }),
  claim: protectedProcedure.mutation(async ({ ctx }) => {
    return claimWinbackOffer(ctx.user.id);
  }),
});
