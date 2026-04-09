/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Server router for base persistence,
   wave tracking, PvP matchmaking prep, and guild integration.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { getConsequences } from "../services/universeConsequences";

// We'll use the progressData JSON column in userProgress
// For now, use localStorage on client + optional server sync

export const terminusSwarmRouter = router({
  /** Save base layout to server */
  saveBase: protectedProcedure
    .input(z.object({
      mapIndex: z.number(),
      turrets: z.array(z.object({
        type: z.string(),
        row: z.number(),
        col: z.number(),
        level: z.number(),
      })),
      barricades: z.array(z.object({ row: z.number(), col: z.number() })),
      traps: z.array(z.object({ type: z.string(), row: z.number(), col: z.number() })),
      commanderLevel: z.number(),
      trophies: z.number(),
      resources: z.object({
        salvage: z.number(),
        viralIchor: z.number(),
        neuralCores: z.number(),
        voidCrystals: z.number(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };

        const { userProgress } = await import("../../drizzle/schema");
        const existing = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        const progressData = (existing[0]?.progressData as Record<string, unknown> | null) ?? {};
        const newProgressData = { ...progressData, terminus_base: input };

        if (existing[0]) {
          await db.update(userProgress)
            .set({ progressData: newProgressData, updatedAt: new Date() })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            progressData: newProgressData,
          });
        }

        return { success: true };
      } catch (e) {
        console.error("[TerminusSwarm] Failed to save base:", e);
        return { success: false };
      }
    }),

  /** Load saved base layout */
  loadBase: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return null;

      const { userProgress } = await import("../../drizzle/schema");
      const result = await db.select().from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);

      if (!result[0]) return null;
      const data = result[0].progressData as Record<string, unknown> | null;
      return (data?.terminus_base as Record<string, unknown>) ?? null;
    } catch (e) {
      console.error("[TerminusSwarm] Failed to load base:", e);
      return null;
    }
  }),

  /** Report wave completion — awards guild war points and tracks progress */
  reportWaveComplete: protectedProcedure
    .input(z.object({
      wave: z.number(),
      kills: z.number(),
      bossKilled: z.boolean(),
      sourceAvatarKilled: z.boolean(),
      resourcesEarned: z.object({
        salvage: z.number(),
        viralIchor: z.number(),
        neuralCores: z.number(),
        voidCrystals: z.number(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // Award guild war points if player is in a guild and a war is active
      try {
        const db = await getDb();
        if (!db) return { success: true, guildPoints: 0 };

        const { guildMembers, guildWars, guildWarContributions } = await import("../../drizzle/schema");

        // Find player's guild
        const membership = await db.select().from(guildMembers)
          .where(eq(guildMembers.userId, ctx.user.id)).limit(1);

        if (!membership[0]) return { success: true, guildPoints: 0 };

        // Find active war
        const activeWar = await db.select().from(guildWars)
          .where(eq(guildWars.status, "active"))
          .limit(1);

        if (!activeWar[0]) return { success: true, guildPoints: 0 };

        // Apply Living Universe XP multipliers to wave rewards
        const fx = await getConsequences();
        const swarmXpMult = fx.xpMultipliers["fight"] ?? 1;

        // Calculate points
        let points = Math.round(15 * swarmXpMult); // base wave completion
        if (input.bossKilled) points += Math.round(50 * swarmXpMult);
        if (input.sourceAvatarKilled) points += Math.round(200 * swarmXpMult);
        points += Math.floor(input.kills / 100) * 10;

        // Record contribution
        await db.insert(guildWarContributions).values({
          warId: activeWar[0].id,
          guildId: membership[0].guildId,
          userId: ctx.user.id,
          points,
          source: input.bossKilled ? "terminus_boss_kill" : "terminus_wave",
        });

        await ripple.emit("terminus_wave_survived", { userId: ctx.user.id, wave: input.wave });

        // Award class mastery XP
        try {
          const { awardClassXp } = await import("../classMasteryHelper");
          await awardClassXp(ctx.user.id, "terminus_wave");
          if (input.bossKilled) await awardClassXp(ctx.user.id, "terminus_boss");
        } catch { /* class mastery optional */ }

        return { success: true, guildPoints: points };
      } catch (e) {
        console.error("[TerminusSwarm] Failed to report wave:", e);
        return { success: true, guildPoints: 0 };
      }
    }),

  /** Get player's Terminus Swarm stats */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return { highestWave: 0, totalKills: 0, trophies: 0, gamesPlayed: 0 };

      const { userProgress } = await import("../../drizzle/schema");
      const result = await db.select().from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);

      if (!result[0]) return { highestWave: 0, totalKills: 0, trophies: 0, gamesPlayed: 0 };
      const data = result[0].progressData as Record<string, unknown> | null;
      const stats = data?.terminus_stats;
      if (!stats || typeof stats !== "object") return { highestWave: 0, totalKills: 0, trophies: 0, gamesPlayed: 0 };
      return stats as { highestWave: number; totalKills: number; trophies: number; gamesPlayed: number };
    } catch {
      return { highestWave: 0, totalKills: 0, trophies: 0, gamesPlayed: 0 };
    }
  }),

  /** Update player's Terminus Swarm stats */
  updateStats: protectedProcedure
    .input(z.object({
      highestWave: z.number(),
      totalKills: z.number(),
      trophies: z.number(),
      gamesPlayed: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };

        const { userProgress } = await import("../../drizzle/schema");

        const existing = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        const progressData = (existing[0]?.progressData as Record<string, unknown> | null) ?? {};
        const newProgressData = { ...progressData, terminus_stats: input };

        if (existing[0]) {
          await db.update(userProgress).set({ progressData: newProgressData, updatedAt: new Date() })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, progressData: newProgressData });
        }

        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});
