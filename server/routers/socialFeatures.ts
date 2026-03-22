/**
 * SOCIAL FEATURES ROUTER
 * ──────────────────────────────────────────────────
 * Friends list, DMs, recently played, guild recruitment.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  friends, directMessages, users,
} from "../../drizzle/schema";
import { eq, and, desc, or, sql } from "drizzle-orm";

export const socialFeaturesRouter = router({
  /** Send friend request */
  sendFriendRequest: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      if (input.targetUserId === ctx.user.id) throw new Error("Cannot friend yourself");

      // Check if already friends or pending
      const [existing] = await db.select().from(friends)
        .where(or(
          and(eq(friends.userId, ctx.user.id), eq(friends.friendId, input.targetUserId)),
          and(eq(friends.userId, input.targetUserId), eq(friends.friendId, ctx.user.id)),
        ));
      if (existing) throw new Error("Friendship already exists or pending");

      await db.insert(friends).values({
        userId: ctx.user.id,
        friendId: input.targetUserId,
        status: "pending",
      });
      return { sent: true };
    }),

  /** Accept friend request */
  acceptFriendRequest: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [friendship] = await db.select().from(friends).where(eq(friends.id, input.friendshipId));
      if (!friendship || friendship.friendId !== ctx.user.id) throw new Error("Not your request");
      if (friendship.status !== "pending") throw new Error("Already handled");

      await db.update(friends)
        .set({ status: "accepted" })
        .where(eq(friends.id, input.friendshipId));
      return { accepted: true };
    }),

  /** Remove friend */
  removeFriend: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [friendship] = await db.select().from(friends).where(eq(friends.id, input.friendshipId));
      if (!friendship) throw new Error("Not found");
      if (friendship.userId !== ctx.user.id && friendship.friendId !== ctx.user.id) throw new Error("Not your friendship");

      await db.update(friends)
        .set({ status: "removed" })
        .where(eq(friends.id, input.friendshipId));
      return { removed: true };
    }),

  /** Get my friends */
  getMyFriends: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(friends)
      .where(and(
        or(eq(friends.userId, ctx.user.id), eq(friends.friendId, ctx.user.id)),
        eq(friends.status, "accepted"),
      ))
      .orderBy(desc(friends.createdAt));
  }),

  /** Get pending requests */
  getPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(friends)
      .where(and(eq(friends.friendId, ctx.user.id), eq(friends.status, "pending")))
      .orderBy(desc(friends.createdAt));
  }),

  /** Send direct message */
  sendMessage: protectedProcedure
    .input(z.object({
      recipientId: z.number(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [result] = await db.insert(directMessages).values({
      fromUserId: ctx.user.id,
      toUserId: input.recipientId,
        content: input.content,
      }).$returningId();
      return { messageId: result.id };
    }),

  /** Get conversation with a user */
  getConversation: protectedProcedure
    .input(z.object({ otherUserId: z.number(), limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(directMessages)
        .where(or(
          and(eq(directMessages.fromUserId, ctx.user.id), eq(directMessages.toUserId, input.otherUserId)),
          and(eq(directMessages.fromUserId, input.otherUserId), eq(directMessages.toUserId, ctx.user.id)),
        ))
        .orderBy(desc(directMessages.sentAt))
        .limit(input.limit);
    }),

  /** Get recent conversations (inbox) */
  getInbox: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    // Get latest message per conversation partner
    return db.select().from(directMessages)
      .where(or(eq(directMessages.fromUserId, ctx.user.id), eq(directMessages.toUserId, ctx.user.id)))
      .orderBy(desc(directMessages.sentAt))
      .limit(50);
  }),

  /** Mark messages as read */
  markRead: protectedProcedure
    .input(z.object({ otherUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(directMessages)
        .set({ readAt: new Date() })
        .where(and(
          eq(directMessages.fromUserId, input.otherUserId),
          eq(directMessages.toUserId, ctx.user.id),
        ));
      return { marked: true };
    }),
});
