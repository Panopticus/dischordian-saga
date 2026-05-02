/* ═══════════════════════════════════════════════════════
   PARTY ROUTER — Backs 2v2 ranked + card co-op queues.
   A user can be in at most one active party (uniqUserSingleParty).
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  parties,
  partyMembers,
  partyInvites,
  users,
} from "../../db/schema";
import { eq, and, or, desc, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { logger } from "../logger";

const PartyMode = z.enum(["card_2v2", "card_coop", "card_ffa", "open"]);
const INVITE_TTL_MS = 5 * 60 * 1000;

function maxMembersForMode(mode: z.infer<typeof PartyMode>): number {
  switch (mode) {
    case "card_2v2":
    case "card_coop":
      return 2;
    case "card_ffa":
      return 4;
    case "open":
      return 4;
  }
}

async function getMyParty(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const memberRows = await db
    .select()
    .from(partyMembers)
    .where(eq(partyMembers.userId, userId))
    .limit(1);
  if (!memberRows[0]) return null;
  const partyRows = await db
    .select()
    .from(parties)
    .where(eq(parties.partyId, memberRows[0].partyId))
    .limit(1);
  return partyRows[0]
    ? { party: partyRows[0], myMembership: memberRows[0] }
    : null;
}

export const partyRouter = router({
  /** Create a new party with the caller as leader. Aborts if the
   *  caller is already in a party. */
  createParty: protectedProcedure
    .input(z.object({ mode: PartyMode.optional(), openToJoin: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await getMyParty(ctx.user.id);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Already in a party" });
      }
      const mode = input.mode ?? "open";
      const partyId = `party_${randomUUID().slice(0, 12)}`;
      await db.insert(parties).values({
        partyId,
        leaderUserId: ctx.user.id,
        mode,
        openToJoin: input.openToJoin ? 1 : 0,
      });
      await db.insert(partyMembers).values({
        partyId,
        userId: ctx.user.id,
        role: "leader",
        slot: 0,
      });
      logger.info("party_created", "party", { partyId, leaderUserId: ctx.user.id, mode });
      return { partyId };
    }),

  /** Send an invite. Leader-only by default; co-leader support is
   *  out-of-scope. */
  invite: protectedProcedure
    .input(z.object({ targetUserId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const ctxg = await getMyParty(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a party" });
      if (ctxg.myMembership.role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Leader only" });
      }
      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot invite yourself" });
      }
      // Check the target exists.
      const targetRows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, input.targetUserId))
        .limit(1);
      if (!targetRows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown user" });
      // Check capacity.
      const memberCount = await db
        .select({ id: partyMembers.id })
        .from(partyMembers)
        .where(eq(partyMembers.partyId, ctxg.party.partyId));
      if (memberCount.length >= maxMembersForMode(ctxg.party.mode)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Party full" });
      }
      const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
      try {
        await db.insert(partyInvites).values({
          partyId: ctxg.party.partyId,
          invitedUserId: input.targetUserId,
          invitedByUserId: ctx.user.id,
          expiresAt,
        });
      } catch (err) {
        // Race-safe: pending invite for (party, user) already exists.
        throw new TRPCError({ code: "CONFLICT", message: "Already invited" });
      }
      return { ok: true, expiresAt };
    }),

  /** List my pending invites (auto-expires the stale ones). */
  myInvites: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    // Auto-expire pending invites past their TTL on read.
    await db
      .update(partyInvites)
      .set({ status: "expired" })
      .where(
        and(
          eq(partyInvites.invitedUserId, ctx.user.id),
          eq(partyInvites.status, "pending"),
          sql`expires_at < NOW()`,
        ),
      )
      .catch(() => {/* ignore */});
    const rows = await db
      .select()
      .from(partyInvites)
      .where(
        and(
          eq(partyInvites.invitedUserId, ctx.user.id),
          eq(partyInvites.status, "pending"),
        ),
      )
      .orderBy(desc(partyInvites.createdAt))
      .limit(20);
    if (rows.length === 0) return [];
    const partyIds = [...new Set(rows.map((r) => r.partyId))];
    const partyRows = partyIds.length
      ? await db.select().from(parties).where(inArray(parties.partyId, partyIds))
      : [];
    const partyById = new Map(partyRows.map((p) => [p.partyId, p]));
    return rows.map((row) => ({
      inviteId: row.id,
      partyId: row.partyId,
      invitedByUserId: row.invitedByUserId,
      expiresAt: row.expiresAt,
      party: partyById.get(row.partyId) ?? null,
    }));
  }),

  /** Accept an invite. Caller must not already be in a party. */
  acceptInvite: protectedProcedure
    .input(z.object({ inviteId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const inviteRows = await db
        .select()
        .from(partyInvites)
        .where(eq(partyInvites.id, input.inviteId))
        .limit(1);
      const invite = inviteRows[0];
      if (!invite) throw new TRPCError({ code: "NOT_FOUND" });
      if (invite.invitedUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (invite.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite no longer pending" });
      }
      const existing = await getMyParty(ctx.user.id);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Already in a party" });
      }
      const partyRows = await db
        .select()
        .from(parties)
        .where(eq(parties.partyId, invite.partyId))
        .limit(1);
      const party = partyRows[0];
      if (!party) throw new TRPCError({ code: "NOT_FOUND", message: "Party gone" });
      const memberRows = await db
        .select({ slot: partyMembers.slot })
        .from(partyMembers)
        .where(eq(partyMembers.partyId, party.partyId));
      if (memberRows.length >= maxMembersForMode(party.mode)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Party full" });
      }
      const usedSlots = new Set(memberRows.map((r) => r.slot));
      let nextSlot = 0;
      while (usedSlots.has(nextSlot)) nextSlot++;
      try {
        await db.insert(partyMembers).values({
          partyId: party.partyId,
          userId: ctx.user.id,
          role: "member",
          slot: nextSlot,
        });
      } catch (err) {
        throw new TRPCError({ code: "CONFLICT", message: "Already a member" });
      }
      await db
        .update(partyInvites)
        .set({ status: "accepted", respondedAt: new Date() })
        .where(eq(partyInvites.id, invite.id));
      return { ok: true, partyId: party.partyId };
    }),

  declineInvite: protectedProcedure
    .input(z.object({ inviteId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(partyInvites)
        .set({ status: "declined", respondedAt: new Date() })
        .where(
          and(
            eq(partyInvites.id, input.inviteId),
            eq(partyInvites.invitedUserId, ctx.user.id),
            eq(partyInvites.status, "pending"),
          ),
        );
      return { ok: true };
    }),

  /** Get my current party + member roster. */
  getMyParty: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const ctxg = await getMyParty(ctx.user.id);
    if (!ctxg) return null;
    const memberRows = await db
      .select()
      .from(partyMembers)
      .where(eq(partyMembers.partyId, ctxg.party.partyId))
      .orderBy(partyMembers.slot);
    const userIds = memberRows.map((m) => m.userId);
    const userRows = userIds.length
      ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds))
      : [];
    const nameById = new Map(userRows.map((u) => [u.id, u.name ?? "Unknown"]));
    return {
      ...ctxg.party,
      members: memberRows.map((m) => ({
        userId: m.userId,
        name: nameById.get(m.userId) ?? "Unknown",
        role: m.role,
        slot: m.slot,
        selectedDeckId: m.selectedDeckId,
        ready: m.ready === 1,
        joinedAt: m.joinedAt,
      })),
    };
  }),

  /** Leave the current party. Disbands if leader leaves with no members. */
  leaveParty: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const ctxg = await getMyParty(ctx.user.id);
    if (!ctxg) throw new TRPCError({ code: "BAD_REQUEST", message: "Not in a party" });
    await db.delete(partyMembers).where(eq(partyMembers.id, ctxg.myMembership.id));
    const remaining = await db
      .select({ id: partyMembers.id, userId: partyMembers.userId })
      .from(partyMembers)
      .where(eq(partyMembers.partyId, ctxg.party.partyId));
    if (remaining.length === 0) {
      // Empty party — disband.
      await db
        .update(parties)
        .set({ status: "disbanded" })
        .where(eq(parties.partyId, ctxg.party.partyId));
      return { ok: true, disbanded: true };
    }
    if (ctxg.myMembership.role === "leader") {
      // Promote the lowest-slot remaining member to leader.
      const newLeader = remaining[0];
      await db
        .update(partyMembers)
        .set({ role: "leader" })
        .where(eq(partyMembers.id, newLeader.id));
      await db
        .update(parties)
        .set({ leaderUserId: newLeader.userId })
        .where(eq(parties.partyId, ctxg.party.partyId));
    }
    return { ok: true, disbanded: false };
  }),

  /** T13: set the calling member's selected deck + ready flag.
   *  Available while party.status === "forming". */
  setMyDeck: protectedProcedure
    .input(z.object({ deckId: z.number().int().nullable(), ready: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const ctxg = await getMyParty(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a party" });
      if (ctxg.party.status !== "forming") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Party not in forming state" });
      }
      // Marking ready without a deck is invalid for non-open modes.
      if (input.ready && ctxg.party.mode !== "open" && input.deckId == null) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Pick a deck before marking ready" });
      }
      await db
        .update(partyMembers)
        .set({ selectedDeckId: input.deckId, ready: input.ready ? 1 : 0 })
        .where(eq(partyMembers.id, ctxg.myMembership.id));
      return { ok: true };
    }),

  /** Mark party as queued for matchmaking. The PvP WS picks it up.
   *  T13: now requires every member to be ready with a deck (for
   *  non-open modes). Solo card_2v2 / card_coop / card_ffa parties
   *  with a single member also still require their leader to be
   *  ready (so duo-queue + solo-queue share the same gate). */
  queueParty: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const ctxg = await getMyParty(ctx.user.id);
    if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a party" });
    if (ctxg.myMembership.role !== "leader") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Leader only" });
    }
    if (ctxg.party.status !== "forming") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Party not in forming state" });
    }
    if (ctxg.party.mode === "open") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Set party mode before queueing" });
    }
    // Verify capacity matches mode.
    const memberRows = await db
      .select()
      .from(partyMembers)
      .where(eq(partyMembers.partyId, ctxg.party.partyId));
    if (memberRows.length !== maxMembersForMode(ctxg.party.mode)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Party needs ${maxMembersForMode(ctxg.party.mode)} members for ${ctxg.party.mode}`,
      });
    }
    // T13: every non-leader member must be ready with a deck.
    const notReady = memberRows.filter((m) => m.ready !== 1 || m.selectedDeckId == null);
    if (notReady.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Waiting on ${notReady.length} member(s) to confirm their deck`,
      });
    }
    await db
      .update(parties)
      .set({ status: "queued" })
      .where(eq(parties.partyId, ctxg.party.partyId));
    return { ok: true };
  }),

  /** Set party mode (leader only, only while forming). */
  setMode: protectedProcedure
    .input(z.object({ mode: PartyMode }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const ctxg = await getMyParty(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN" });
      if (ctxg.myMembership.role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Leader only" });
      }
      if (ctxg.party.status !== "forming") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Party not in forming state" });
      }
      const memberCount = await db
        .select({ id: partyMembers.id })
        .from(partyMembers)
        .where(eq(partyMembers.partyId, ctxg.party.partyId));
      if (memberCount.length > maxMembersForMode(input.mode)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Mode capacity smaller than current member count" });
      }
      await db
        .update(parties)
        .set({ mode: input.mode })
        .where(eq(parties.partyId, ctxg.party.partyId));
      return { ok: true };
    }),
});

export { maxMembersForMode };
