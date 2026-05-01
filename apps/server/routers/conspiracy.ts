/* ═══════════════════════════════════════════════════════
   CONSPIRACY ROUTER — Witnessing Discovery Race
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  userClueProgress,
  guildClueProgress,
  discoveryEvents,
  guildMembers,
  guilds,
  users,
} from "../../db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { CONSPIRACY_BOARDS, getConspiracyBoard } from "@shared/conspiracyBoards/definitions";
import { attemptSolveForUser } from "../services/conspiracyService";

export const conspiracyRouter = router({
  /** Public catalog of every conspiracy board (definitions only). */
  getCatalog: publicProcedure.query(() => {
    return CONSPIRACY_BOARDS.map((b) => ({
      boardKey: b.boardKey,
      name: b.name,
      description: b.description,
      flavorText: b.flavorText,
      factionAlignment: b.factionAlignment,
      cluesRequired: b.cluesRequired,
      acceptedClues: b.acceptedClues,
    }));
  }),

  /** Per-user progress on every board the user has touched. */
  getMyBoards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(userClueProgress)
      .where(eq(userClueProgress.userId, ctx.user.id));
    return rows.map((row) => {
      const def = getConspiracyBoard(row.boardKey);
      const gathered = row.cluesGathered ?? [];
      return {
        boardKey: row.boardKey,
        name: def?.name ?? row.boardKey,
        cluesGathered: gathered,
        cluesRequired: def?.cluesRequired ?? gathered.length,
        progress: def ? Math.min(1, gathered.length / def.cluesRequired) : 1,
        solvedAt: row.solvedAt,
        isFirstDiscoverer: row.isFirstDiscoverer === 1,
      };
    });
  }),

  /** Per-guild aggregated progress (members can see their guild's race). */
  getGuildBoards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const memberRows = await db
      .select({ guildId: guildMembers.guildId })
      .from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id))
      .limit(1);
    const guildId = memberRows[0]?.guildId;
    if (!guildId) return [];
    const rows = await db
      .select()
      .from(guildClueProgress)
      .where(eq(guildClueProgress.guildId, guildId));
    return rows.map((row) => {
      const def = getConspiracyBoard(row.boardKey);
      const gathered = row.cluesGathered ?? [];
      return {
        boardKey: row.boardKey,
        name: def?.name ?? row.boardKey,
        cluesGathered: gathered,
        cluesRequired: def?.cluesRequired ?? gathered.length,
        progress: def ? Math.min(1, gathered.length / def.cluesRequired) : 1,
        contributors: row.contributors ?? {},
        solvedAt: row.solvedAt,
        isFirstDiscoverer: row.isFirstDiscoverer === 1,
      };
    });
  }),

  /**
   * Manual solve attempt. Boards auto-attempt on every clue drop,
   * but the UI also exposes a "Solve" button so players can confirm.
   */
  attemptSolve: protectedProcedure
    .input(z.object({ boardKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      return attemptSolveForUser(ctx.user.id, input.boardKey);
    }),

  /**
   * Public log of every server-wide reveal event — who first-discovered
   * what, when. The historical record is part of the lore appeal.
   */
  getServerWideRevealHistory: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(discoveryEvents)
        .orderBy(desc(discoveryEvents.discoveredAt))
        .limit(input?.limit ?? 25);
      if (rows.length === 0) return [];
      const userIds = [...new Set(rows.map((r) => r.firstDiscovererUserId))];
      const guildIds = [
        ...new Set(rows.map((r) => r.firstDiscovererGuildId).filter((g): g is number => g != null)),
      ];
      const userRows = userIds.length
        ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds))
        : [];
      const guildRows = guildIds.length
        ? await db.select({ id: guilds.id, name: guilds.name, tag: guilds.tag }).from(guilds).where(inArray(guilds.id, guildIds))
        : [];
      const userById = new Map(userRows.map((u) => [u.id, u.name ?? "Unknown"]));
      const guildById = new Map(guildRows.map((g) => [g.id, { name: g.name, tag: g.tag }]));
      return rows.map((row) => ({
        eventKey: row.eventKey,
        firstDiscovererUserId: row.firstDiscovererUserId,
        firstDiscovererName: userById.get(row.firstDiscovererUserId) ?? "Unknown",
        firstDiscovererGuildId: row.firstDiscovererGuildId,
        firstDiscovererGuild: row.firstDiscovererGuildId
          ? guildById.get(row.firstDiscovererGuildId) ?? null
          : null,
        discoveredAt: row.discoveredAt,
        serverWideRevealedAt: row.serverWideRevealedAt,
        factionAlignment: row.factionAlignment,
      }));
    }),
});
