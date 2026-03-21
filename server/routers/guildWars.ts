/* ═══════════════════════════════════════════════════════
   GUILD WARS — Faction vs Faction Territory Control Events
   Members contribute fight wins, PvP wins, trade volume,
   quest completions, and chess wins toward their faction's score.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  guildWars, guildWarContributions, guilds, guildMembers,
  notifications, dreamBalance, marketTaxPool,
} from "../../drizzle/schema";

/** Territory names tied to Dischordian Saga lore */
const TERRITORIES = [
  { name: "The Panopticon Core", bonus: "dream_boost", bonusValue: 10, description: "Central surveillance hub — controlling faction earns +10% Dream from all sources" },
  { name: "Inception Ark Docks", bonus: "trade_boost", bonusValue: 15, description: "Primary trade nexus — controlling faction earns +15% credits from Trade Wars" },
  { name: "The Oracle's Sanctum", bonus: "card_boost", bonusValue: 5, description: "Prophetic chamber — controlling faction draws +1 extra card per card battle" },
  { name: "Necromancer's Crypt", bonus: "fight_boost", bonusValue: 10, description: "Dark arena — controlling faction fighters gain +10% damage in Fight Game" },
  { name: "The Source Nexus", bonus: "xp_boost", bonusValue: 20, description: "Reality wellspring — controlling faction earns +20% XP from all activities" },
  { name: "Architect's Workshop", bonus: "craft_boost", bonusValue: 15, description: "Master forge — controlling faction gets +15% chance of bonus materials from crafting" },
  { name: "The Enigma Vault", bonus: "loot_boost", bonusValue: 10, description: "Hidden treasury — controlling faction gets +10% rare drop rate" },
  { name: "Iron Lion Citadel", bonus: "defense_boost", bonusValue: 10, description: "Fortified stronghold — controlling faction guild members take -10% damage in PvP" },
];

/** Point values for different contribution sources */
const POINT_VALUES: Record<string, number> = {
  fight_win: 10,
  pvp_win: 25,
  trade_volume: 1,   // per 100 credits traded
  quest_complete: 15,
  card_battle_win: 15,
  chess_win: 20,
};

export const guildWarsRouter = router({
  /* ──────────────────────────────────────────────
     GET ACTIVE WARS
     ────────────────────────────────────────────── */
  getActiveWars: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const now = new Date();
    const wars = await db.select().from(guildWars)
      .where(eq(guildWars.status, "active"))
      .orderBy(desc(guildWars.startsAt));
    return wars;
  }),

  /** Get all wars (active + upcoming + recent ended) */
  getAllWars: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const wars = await db.select().from(guildWars)
      .orderBy(desc(guildWars.startsAt))
      .limit(20);
    return wars;
  }),

  /** Get war details with contribution leaderboard */
  getWarDetails: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const war = await db.select().from(guildWars)
        .where(eq(guildWars.id, input.warId)).limit(1);
      if (!war[0]) throw new Error("War not found");

      // Get top contributors
      const contributions = await db.select({
        guildId: guildWarContributions.guildId,
        userId: guildWarContributions.userId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
        source: guildWarContributions.source,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.userId, guildWarContributions.guildId, guildWarContributions.source)
        .orderBy(desc(sql`SUM(${guildWarContributions.points})`))
        .limit(50);

      // Get guild scores
      const guildScores = await db.select({
        guildId: guildWarContributions.guildId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.guildId)
        .orderBy(desc(sql`SUM(${guildWarContributions.points})`));

      return { war: war[0], contributions, guildScores };
    }),

  /** Contribute points to the active war for your faction */
  contribute: protectedProcedure
    .input(z.object({
      warId: z.number(),
      source: z.enum(["fight_win", "pvp_win", "trade_volume", "quest_complete", "card_battle_win", "chess_win"]),
      rawValue: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;

      // Verify war is active
      const war = await db.select().from(guildWars)
        .where(and(eq(guildWars.id, input.warId), eq(guildWars.status, "active")))
        .limit(1);
      if (!war[0]) throw new Error("No active war found");

      // Get player's guild
      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) throw new Error("You must be in a guild to contribute to wars");

      // Get guild faction
      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, membership[0].guildId)).limit(1);
      if (!guild[0]) throw new Error("Guild not found");

      // Verify guild faction matches one of the war factions
      const guildFaction = guild[0].faction;
      if (guildFaction !== war[0].factionA && guildFaction !== war[0].factionB) {
        throw new Error("Your guild's faction is not participating in this war");
      }

      // Calculate points
      const basePoints = POINT_VALUES[input.source] || 10;
      const points = input.source === "trade_volume"
        ? Math.floor((input.rawValue || 0) / 100) * basePoints
        : basePoints;

      if (points <= 0) return { success: false, message: "No points earned" };

      // Record contribution
      await db.insert(guildWarContributions).values({
        warId: input.warId,
        guildId: membership[0].guildId,
        userId: ctx.user.id,
        points,
        source: input.source,
      });

      // Update war score
      const scoreField = guildFaction === war[0].factionA ? "scoreA" : "scoreB";
      await db.update(guildWars)
        .set({ [scoreField]: sql`${guildWars[scoreField]} + ${points}` })
        .where(eq(guildWars.id, input.warId));

      return { success: true, points, faction: guildFaction };
    }),

  /** Get player's contribution summary for a war */
  myContributions: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const contributions = await db.select({
        source: guildWarContributions.source,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
        count: sql<number>`COUNT(*)`,
      }).from(guildWarContributions)
        .where(and(
          eq(guildWarContributions.warId, input.warId),
          eq(guildWarContributions.userId, ctx.user.id),
        ))
        .groupBy(guildWarContributions.source);
      return contributions;
    }),

  /** Get available territories and their current control status */
  getTerritories: protectedProcedure.query(async () => {
    return TERRITORIES;
  }),

  /** Admin: Create a new guild war event */
  createWar: protectedProcedure
    .input(z.object({
      name: z.string().min(3).max(128),
      factionA: z.enum(["empire", "insurgency", "neutral"]),
      factionB: z.enum(["empire", "insurgency", "neutral"]),
      territory: z.string(),
      durationHours: z.number().min(1).max(168).default(48),
      prizePoolDream: z.number().min(0).default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + input.durationHours * 60 * 60 * 1000);

      // Optionally fund from tax pool
      if (input.prizePoolDream > 0) {
        const pool = await db.select().from(marketTaxPool).limit(1);
        if (pool[0] && pool[0].poolDream >= input.prizePoolDream) {
          await db.update(marketTaxPool)
            .set({ poolDream: sql`${marketTaxPool.poolDream} - ${input.prizePoolDream}` })
            .where(eq(marketTaxPool.id, pool[0].id));
        }
      }

      const result = await db.insert(guildWars).values({
        name: input.name,
        factionA: input.factionA,
        factionB: input.factionB,
        territory: input.territory,
        prizePoolDream: input.prizePoolDream,
        startsAt,
        endsAt,
        status: "active",
      });

      return { success: true, warId: result[0].insertId };
    }),

  /** Resolve an ended war — distribute prizes to winning faction's guilds */
  resolveWar: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const war = await db.select().from(guildWars)
        .where(eq(guildWars.id, input.warId)).limit(1);
      if (!war[0]) throw new Error("War not found");
      if (war[0].status === "ended") throw new Error("War already resolved");

      // Determine winner
      const winnerFaction = war[0].scoreA > war[0].scoreB ? war[0].factionA
        : war[0].scoreB > war[0].scoreA ? war[0].factionB
        : null; // draw

      // Mark as ended
      await db.update(guildWars)
        .set({ status: "ended" })
        .where(eq(guildWars.id, input.warId));

      if (!winnerFaction || war[0].prizePoolDream <= 0) {
        return { success: true, winner: winnerFaction || "draw", distributed: 0 };
      }

      // Get winning faction guilds that contributed
      const winningGuilds = await db.select({
        guildId: guildWarContributions.guildId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.guildId);

      // Filter to only winning faction guilds
      const winnerGuildIds = new Set<number>();
      for (const gc of winningGuilds) {
        const g = await db.select().from(guilds).where(eq(guilds.id, gc.guildId)).limit(1);
        if (g[0] && g[0].faction === winnerFaction) {
          winnerGuildIds.add(gc.guildId);
        }
      }

      // Distribute prize proportionally to contribution
      const totalWinnerPoints = winningGuilds
        .filter((g: any) => winnerGuildIds.has(g.guildId))
        .reduce((sum: number, g: any) => sum + g.totalPoints, 0);

      if (totalWinnerPoints > 0) {
        for (const gc of winningGuilds) {
          if (!winnerGuildIds.has(gc.guildId)) continue;
          const share = Math.floor((gc.totalPoints / totalWinnerPoints) * war[0].prizePoolDream);
          if (share > 0) {
            await db.update(guilds)
              .set({ treasuryDream: sql`${guilds.treasuryDream} + ${share}` })
              .where(eq(guilds.id, gc.guildId));
          }
        }
      }

      return { success: true, winner: winnerFaction, distributed: war[0].prizePoolDream };
    }),

  /** Get the war leaderboard — top contributing guilds across all wars */
  warLeaderboard: protectedProcedure.query(async () => {
    const db = (await getDb())!;
    const leaderboard = await db.select({
      guildId: guildWarContributions.guildId,
      totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      warCount: sql<number>`COUNT(DISTINCT ${guildWarContributions.warId})`,
    }).from(guildWarContributions)
      .groupBy(guildWarContributions.guildId)
      .orderBy(desc(sql`SUM(${guildWarContributions.points})`))
      .limit(20);
    return leaderboard;
  }),
});
