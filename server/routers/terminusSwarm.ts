/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Server router for base persistence,
   wave tracking, PvP matchmaking prep, and guild integration.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, desc } from "drizzle-orm";

// We'll use a JSON column in userProgress or a new table
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
      // Store as JSON in a user-specific key
      // In production, this would use a dedicated terminusBases table
      try {
        const db = await getDb();
        if (!db) return { success: false };

        // Use userProgress table with a special key
        const { userProgress } = await import("../../drizzle/schema");
        const key = "terminus_base";
        const existing = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)))
          .limit(1);

        const value = JSON.stringify(input);

        if (existing[0]) {
          await db.update(userProgress)
            .set({ value, updatedAt: new Date() })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            key,
            value,
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
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, "terminus_base")))
        .limit(1);

      if (!result[0]) return null;
      return JSON.parse(result[0].value);
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

        // Calculate points
        let points = 15; // base wave completion
        if (input.bossKilled) points += 50;
        if (input.sourceAvatarKilled) points += 200;
        points += Math.floor(input.kills / 100) * 10;

        // Record contribution
        await db.insert(guildWarContributions).values({
          warId: activeWar[0].id,
          guildId: membership[0].guildId,
          userId: ctx.user.id,
          points,
          source: input.bossKilled ? "terminus_boss_kill" : "terminus_wave",
        });

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
      const stats = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, "terminus_stats")))
        .limit(1);

      if (!stats[0]) return { highestWave: 0, totalKills: 0, trophies: 0, gamesPlayed: 0 };
      return JSON.parse(stats[0].value);
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
        const key = "terminus_stats";
        const value = JSON.stringify(input);

        const existing = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)))
          .limit(1);

        if (existing[0]) {
          await db.update(userProgress).set({ value, updatedAt: new Date() })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, key, value });
        }

        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});
