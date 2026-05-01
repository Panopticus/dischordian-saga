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
  dreamBalance,
} from "../../db/schema";
import { eq, and, desc, inArray, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { CONSPIRACY_BOARDS, getConspiracyBoard } from "@shared/conspiracyBoards/definitions";
import { attemptSolveForUser } from "../services/conspiracyService";

/** Cost in Dream tokens to peek at a rival guild's progress on a board. */
const ORACLE_POOL_PEEK_COST = 50;

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
   * Oracle Pool peek — pay Dream tokens to see rival guilds' progress
   * on a Conspiracy Board. Tier 4 hall feature; lore-flavored as the
   * Oracle's water-scrying. One peek per call, charged each time.
   */
  oraclePoolPeek: protectedProcedure
    .input(z.object({ boardKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const def = getConspiracyBoard(input.boardKey);
      if (!def) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown board" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Find the caller's guild + verify hall tier (Oracle Pool unlocks at hall T4).
      const memberRows = await db
        .select({ guildId: guildMembers.guildId })
        .from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id))
        .limit(1);
      const callerGuildId = memberRows[0]?.guildId;
      if (!callerGuildId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      }
      const callerGuild = await db
        .select()
        .from(guilds)
        .where(eq(guilds.id, callerGuildId))
        .limit(1);
      if ((callerGuild[0]?.level ?? 0) < 4) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Hall tier 4+ required for Oracle Pool" });
      }

      // Charge Dream tokens.
      const balRow = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!balRow[0] || (balRow[0].dreamTokens ?? 0) < ORACLE_POOL_PEEK_COST) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient Dream tokens" });
      }
      await db
        .update(dreamBalance)
        .set({ dreamTokens: sql`dream_tokens - ${ORACLE_POOL_PEEK_COST}` })
        .where(eq(dreamBalance.userId, ctx.user.id));

      // Read every other guild's progress on this board.
      const rivalRows = await db
        .select()
        .from(guildClueProgress)
        .where(
          and(
            eq(guildClueProgress.boardKey, input.boardKey),
            ne(guildClueProgress.guildId, callerGuildId),
          ),
        );
      if (rivalRows.length === 0) {
        return { cost: ORACLE_POOL_PEEK_COST, rivals: [] };
      }
      const rivalGuildIds = rivalRows.map((r) => r.guildId);
      const rivalGuildRows = await db
        .select({ id: guilds.id, name: guilds.name, tag: guilds.tag, level: guilds.level })
        .from(guilds)
        .where(inArray(guilds.id, rivalGuildIds));
      const guildById = new Map(rivalGuildRows.map((g) => [g.id, g]));

      const rivals = rivalRows
        .map((r) => {
          const gathered = r.cluesGathered ?? [];
          return {
            guildId: r.guildId,
            guildName: guildById.get(r.guildId)?.name ?? "Unknown",
            guildTag: guildById.get(r.guildId)?.tag ?? "???",
            cluesGathered: gathered.length,
            cluesRequired: def.cluesRequired,
            progress: Math.min(1, gathered.length / def.cluesRequired),
            solvedAt: r.solvedAt,
          };
        })
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 10);

      return { cost: ORACLE_POOL_PEEK_COST, rivals };
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
