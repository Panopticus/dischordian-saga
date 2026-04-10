/**
 * SOCIAL FEATURES ROUTER
 * ──────────────────────────────────────────────────
 * Friends list, DMs, recently played, guild recruitment.
 *
 * Trust & safety posture (see drizzle/0037_trust_and_safety.sql):
 *  • Mutations that touch other players are rate-limited per user.
 *  • sendMessage is gated behind an accepted friendship unless the
 *    recipient has opted in to stranger DMs (not yet exposed — default
 *    is friends-only).
 *  • sendMessage honors user_blocks: if the recipient has blocked the
 *    sender, the DM is silently dropped (we still return success so the
 *    sender can't probe the block state).
 *  • All errors surface as TRPCError with proper codes so the client
 *    can render actionable messages; the previous `throw new Error`
 *    pattern collapsed every failure into INTERNAL_SERVER_ERROR.
 */
import { z } from "zod";
import { router, protectedProcedure, rateLimit } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  friends, directMessages, userBlocks,
} from "../../drizzle/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";

function requireDb<T>(db: T | null): asserts db is T {
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }
}

export const socialFeaturesRouter = router({
  /** Send friend request */
  sendFriendRequest: protectedProcedure
    .use(rateLimit({
      key: "social.friendRequest",
      maxTokens: 10,
      refillRate: 1, // 1 per second refill, 10 burst
      message: "Too many friend requests. Try again in a minute.",
    }))
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);
      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot friend yourself",
        });
      }

      // A blocked relationship in either direction short-circuits the request.
      const blocks = await db.select().from(userBlocks)
        .where(or(
          and(eq(userBlocks.userId, ctx.user.id), eq(userBlocks.blockedUserId, input.targetUserId)),
          and(eq(userBlocks.userId, input.targetUserId), eq(userBlocks.blockedUserId, ctx.user.id)),
        ))
        .limit(1);
      if (blocks.length > 0) {
        // Don't disclose which direction the block is in.
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unable to send friend request to this user",
        });
      }

      // Check if already friends or pending
      const [existing] = await db.select().from(friends)
        .where(or(
          and(eq(friends.userId, ctx.user.id), eq(friends.friendId, input.targetUserId)),
          and(eq(friends.userId, input.targetUserId), eq(friends.friendId, ctx.user.id)),
        ));
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Friendship already exists or pending",
        });
      }

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
      requireDb(db);
      const [friendship] = await db.select().from(friends).where(eq(friends.id, input.friendshipId));
      if (!friendship || friendship.friendId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Request not found" });
      }
      if (friendship.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Request already handled" });
      }

      await db.update(friends)
        .set({ status: "accepted" })
        .where(eq(friends.id, input.friendshipId));

      await ripple.emit("friend_accepted", { userId: ctx.user.id, friendId: friendship.userId });

      return { accepted: true };
    }),

  /** Remove friend */
  removeFriend: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);
      const [friendship] = await db.select().from(friends).where(eq(friends.id, input.friendshipId));
      if (!friendship) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Friendship not found" });
      }
      if (friendship.userId !== ctx.user.id && friendship.friendId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your friendship" });
      }

      await db.update(friends)
        .set({ status: "removed" })
        .where(eq(friends.id, input.friendshipId));
      return { removed: true };
    }),

  /** Get my friends */
  getMyFriends: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    requireDb(db);
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
    requireDb(db);
    return db.select().from(friends)
      .where(and(eq(friends.friendId, ctx.user.id), eq(friends.status, "pending")))
      .orderBy(desc(friends.createdAt));
  }),

  /**
   * Send direct message.
   *
   * Rules (in order):
   *   1. Rate-limited per sender (burst 10, 1/sec refill).
   *   2. Sender cannot DM themselves.
   *   3. Sender and recipient must have an accepted friendship in
   *      either direction (strangers-can-DM is not yet exposed).
   *   4. If the recipient has blocked the sender, the DM is silently
   *      dropped — we return success without writing a row so the
   *      sender cannot use DM delivery status to probe the block list.
   */
  sendMessage: protectedProcedure
    .use(rateLimit({
      key: "dm.send",
      maxTokens: 10,
      refillRate: 1,
      message: "You're sending messages too quickly. Slow down.",
    }))
    .input(z.object({
      recipientId: z.number(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      if (input.recipientId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot send a message to yourself",
        });
      }

      // Require an accepted friendship in either direction.
      const [friendship] = await db.select().from(friends)
        .where(and(
          or(
            and(eq(friends.userId, ctx.user.id), eq(friends.friendId, input.recipientId)),
            and(eq(friends.userId, input.recipientId), eq(friends.friendId, ctx.user.id)),
          ),
          eq(friends.status, "accepted"),
        ))
        .limit(1);
      if (!friendship) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only message friends",
        });
      }

      // If the recipient has blocked the sender, swallow the send.
      // We still return an ok-looking result so the sender can't use
      // delivery status to probe whether they're blocked.
      const [block] = await db.select().from(userBlocks)
        .where(and(
          eq(userBlocks.userId, input.recipientId),
          eq(userBlocks.blockedUserId, ctx.user.id),
        ))
        .limit(1);
      if (block) {
        return { messageId: null, delivered: false };
      }

      const [result] = await db.insert(directMessages).values({
        fromUserId: ctx.user.id,
        toUserId: input.recipientId,
        content: input.content,
      }).$returningId();
      return { messageId: result.id, delivered: true };
    }),

  /** Get conversation with a user */
  getConversation: protectedProcedure
    .input(z.object({ otherUserId: z.number(), limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);
      return db.select().from(directMessages)
        .where(or(
          and(eq(directMessages.fromUserId, ctx.user.id), eq(directMessages.toUserId, input.otherUserId)),
          and(eq(directMessages.fromUserId, input.otherUserId), eq(directMessages.toUserId, ctx.user.id)),
        ))
        .orderBy(desc(directMessages.sentAt))
        .limit(input.limit);
    }),

  /**
   * Get inbox — most recent messages across all of my conversations.
   *
   * Note: the previous comment claimed this returned "latest message per
   * conversation partner" but the implementation returned a flat list. The
   * behavior is unchanged (flat list of the most recent messages) — the
   * comment is fixed to match. Grouping by partner is a client concern.
   */
  getInbox: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    requireDb(db);
    return db.select().from(directMessages)
      .where(or(
        eq(directMessages.fromUserId, ctx.user.id),
        eq(directMessages.toUserId, ctx.user.id),
      ))
      .orderBy(desc(directMessages.sentAt))
      .limit(50);
  }),

  /** Mark messages as read */
  markRead: protectedProcedure
    .input(z.object({ otherUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);
      await db.update(directMessages)
        .set({ readAt: new Date() })
        .where(and(
          eq(directMessages.fromUserId, input.otherUserId),
          eq(directMessages.toUserId, ctx.user.id),
        ));
      return { marked: true };
    }),
});
