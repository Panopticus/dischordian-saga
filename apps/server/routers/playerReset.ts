/* ═══════════════════════════════════════════════════════
   PLAYER RESET ROUTER — "Establish a New Connection"

   Backs the Reset Wall on the title screen. Wipes the
   caller's persisted progress so the next session starts
   from the Awakening sequence.

   Scope: the tables that carry story progression, owned
   items, and unlocked areas. Leaderboards, chat history,
   moderation records, and commerce/currency ledger rows
   are deliberately *not* touched — resetting a character
   is an in-fiction event, not an account deletion. If a
   player wants a full account wipe they use the existing
   admin delete flow.

   Idempotent: calling twice is safe. No-ops when no rows
   exist for the user. Every delete is scoped to
   `userId = ctx.user.id` — there is no server-trusted
   parameter that can widen the scope.
   ═══════════════════════════════════════════════════════ */
import { eq } from "drizzle-orm";

import {
  arkThemes,
  characterSheets,
  decks,
  userAchievements,
  userArkProgress,
  userCards,
  userProgress,
} from "../../db/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { logger } from "../logger";

export const playerResetRouter = router({
  /**
   * Dissolves the caller's character. Fires from the Title
   * page's Reset Wall after the three-step gauntlet
   * (warn / type-to-confirm / hold-to-confirm).
   */
  resetPlayer: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, reason: "db-unavailable" } as const;
    const userId = ctx.user.id;

    // No transaction here: MySQL's ROW-level DELETE is already
    // per-statement atomic, and the individual deletes are
    // independent — partial failure of a downstream table
    // still leaves the user in a cleaner state than before.
    // We log each step so ops can tell which table failed.
    const deletions: Array<[string, () => Promise<unknown>]> = [
      ["user_progress",      () => db.delete(userProgress).where(eq(userProgress.userId, userId))],
      ["character_sheets",   () => db.delete(characterSheets).where(eq(characterSheets.userId, userId))],
      ["user_ark_progress",  () => db.delete(userArkProgress).where(eq(userArkProgress.userId, userId))],
      ["user_cards",         () => db.delete(userCards).where(eq(userCards.userId, userId))],
      ["user_achievements",  () => db.delete(userAchievements).where(eq(userAchievements.userId, userId))],
      ["ark_themes",         () => db.delete(arkThemes).where(eq(arkThemes.userId, userId))],
      ["decks",              () => db.delete(decks).where(eq(decks.userId, userId))],
    ];

    const failed: string[] = [];
    for (const [table, fn] of deletions) {
      try {
        await fn();
      } catch (e) {
        failed.push(table);
        logger.error("playerReset: delete failed", { table, userId }, e as Error);
      }
    }

    if (failed.length > 0) {
      return { success: false, reason: "partial", failed } as const;
    }
    return { success: true } as const;
  }),
});
