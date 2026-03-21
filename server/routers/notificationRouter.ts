import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const notificationRouter = router({
  /* ─── Get all notifications for current user (paginated) ─── */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, unread: 0 };

      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const [items, countResult, unreadResult] = await Promise.all([
        db.select().from(notifications)
          .where(eq(notifications.userId, ctx.user.id))
          .orderBy(desc(notifications.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(notifications)
          .where(eq(notifications.userId, ctx.user.id)),
        db.select({ count: sql<number>`count(*)` }).from(notifications)
          .where(and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.isRead, false),
          )),
      ]);

      return {
        items,
        total: Number(countResult[0]?.count ?? 0),
        unread: Number(unreadResult[0]?.count ?? 0),
      };
    }),

  /* ─── Get unread count only (for bell badge) ─── */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };

    const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(and(
        eq(notifications.userId, ctx.user.id),
        eq(notifications.isRead, false),
      ));

    return { count: Number(result[0]?.count ?? 0) };
  }),

  /* ─── Mark a single notification as read ─── */
  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, input.id),
          eq(notifications.userId, ctx.user.id),
        ));

      return { success: true };
    }),

  /* ─── Mark all notifications as read ─── */
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false };

    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, ctx.user.id),
        eq(notifications.isRead, false),
      ));

    return { success: true };
  }),

  /* ─── Delete a single notification ─── */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.delete(notifications)
        .where(and(
          eq(notifications.id, input.id),
          eq(notifications.userId, ctx.user.id),
        ));

      return { success: true };
    }),

  /* ─── Clear all notifications ─── */
  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false };

    await db.delete(notifications)
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),
});
