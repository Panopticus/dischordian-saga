/**
 * User blocking — directed (blocker → blocked) edges.
 *
 *   - block(targetUserId, reason?) — idempotent.
 *   - unblock(targetUserId).
 *   - listMine() — caller's blocked-list (for the settings UI).
 *   - amBlockedBy(targetUserId) — does the target block me?
 *
 * Other surfaces (chat, friends, DMs, matchmaking) call
 * `isBlocked(a, b)` from services/blockService.ts to decide whether
 * to filter / reject.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userBlocks } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const blocksRouter = router({
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(userBlocks)
      .where(eq(userBlocks.blockerUserId, ctx.user.id));
    return rows.map((r) => ({
      blockedUserId: r.blockedUserId,
      reason: r.reason,
      createdAt: r.createdAt,
    }));
  }),

  block: protectedProcedure
    .input(z.object({
      targetUserId: z.number().int().positive(),
      reason: z.string().max(256).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot block yourself" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { sql } = await import("drizzle-orm");
      await db
        .insert(userBlocks)
        .values({
          blockerUserId: ctx.user.id,
          blockedUserId: input.targetUserId,
          reason: input.reason ?? null,
        })
        .onDuplicateKeyUpdate({
          set: {
            // Idempotent — re-block updates reason but keeps original
            // createdAt via the ON DUPLICATE form.
            reason: input.reason ?? null,
          },
        });
      return { ok: true };
    }),

  unblock: protectedProcedure
    .input(z.object({ targetUserId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .delete(userBlocks)
        .where(and(
          eq(userBlocks.blockerUserId, ctx.user.id),
          eq(userBlocks.blockedUserId, input.targetUserId),
        ));
      return { ok: true };
    }),

  amBlockedBy: protectedProcedure
    .input(z.object({ targetUserId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return false;
      const rows = await db
        .select()
        .from(userBlocks)
        .where(and(
          eq(userBlocks.blockerUserId, input.targetUserId),
          eq(userBlocks.blockedUserId, ctx.user.id),
        ));
      return rows.length > 0;
    }),
});
