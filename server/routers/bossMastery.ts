/**
 * BOSS MASTERY ROUTER
 * ──────────────────────────────────────────────────
 * Track kills per boss, mastery levels, exclusive cosmetics, leaderboard.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { bossMastery } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  BOSS_MASTERY_DEFS, getBossMasteryLevel, getNextMasteryReward,
  type BossMasteryDef, type BossMasteryLevel,
} from "../../shared/bossMastery";

export const bossMasteryRouter = router({
  /** Get my mastery for all bosses */
  getMyMastery: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const rows = await db.select().from(bossMastery).where(eq(bossMastery.userId, ctx.user.id));
    return rows.map(row => {
      const def = BOSS_MASTERY_DEFS.find((d: BossMasteryDef) => d.bossKey === row.bossKey);
      return { ...row, bossDef: def || null };
    });
  }),

  /** Get mastery for a specific boss */
  getBossMastery: protectedProcedure
    .input(z.object({ bossKey: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [mastery] = await db.select().from(bossMastery)
        .where(and(eq(bossMastery.userId, ctx.user.id), eq(bossMastery.bossKey, input.bossKey)));

      const def = BOSS_MASTERY_DEFS.find((d: BossMasteryDef) => d.bossKey === input.bossKey);
      const currentLevel = def?.levels.find((l: BossMasteryLevel) => l.level === (mastery?.masteryLevel || 0));
      const nextLevel = def?.levels.find((l: BossMasteryLevel) => l.level === (mastery?.masteryLevel || 0) + 1);

      return {
        mastery: mastery || null,
        bossDef: def || null,
        currentLevel: currentLevel || null,
        nextLevel: nextLevel || null,
        unlockedCosmetics: mastery?.cosmeticsUnlocked || [],
      };
    }),

  /** Record a boss kill */
  recordKill: protectedProcedure
    .input(z.object({
      bossKey: z.string(),
      difficulty: z.string(),
      timeSeconds: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [existing] = await db.select().from(bossMastery)
        .where(and(eq(bossMastery.userId, ctx.user.id), eq(bossMastery.bossKey, input.bossKey)));

      const def = BOSS_MASTERY_DEFS.find((d: BossMasteryDef) => d.bossKey === input.bossKey);

      if (existing) {
        const newKills = existing.kills + 1;
        const newMasteryLevel = getBossMasteryLevel(newKills, input.bossKey);
        const leveledUp = newMasteryLevel > existing.masteryLevel;

        // Check for new cosmetic rewards
        const newCosmetics = [...(existing.cosmeticsUnlocked || [])];
        if (leveledUp && def) {
          const levelDef = def.levels.find((l: BossMasteryLevel) => l.level === newMasteryLevel);
          if (levelDef && levelDef.reward.type === "cosmetic" && !newCosmetics.includes(levelDef.reward.key)) {
            newCosmetics.push(levelDef.reward.key);
          }
        }

        await db.update(bossMastery)
          .set({
            kills: newKills,
            masteryLevel: newMasteryLevel,
            bestTime: input.timeSeconds && (!existing.bestTime || input.timeSeconds < existing.bestTime) ? input.timeSeconds : existing.bestTime,
            highestDifficulty: input.difficulty,
            cosmeticsUnlocked: newCosmetics.length > 0 ? newCosmetics : null,
          })
          .where(eq(bossMastery.id, existing.id));

        return {
          kills: newKills,
          leveledUp,
          newMasteryLevel,
          reward: leveledUp ? def?.levels.find((l: BossMasteryLevel) => l.level === newMasteryLevel)?.reward : null,
        };
      } else {
        await db.insert(bossMastery).values({
          userId: ctx.user.id,
          bossKey: input.bossKey,
          kills: 1,
          masteryLevel: 0,
          bestTime: input.timeSeconds ?? null,
          highestDifficulty: input.difficulty,
        });
        return { kills: 1, leveledUp: false, newMasteryLevel: 0, reward: null };
      }
    }),

  /** Leaderboard for a boss */
  getLeaderboard: publicProcedure
    .input(z.object({ bossKey: z.string(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(bossMastery)
        .where(eq(bossMastery.bossKey, input.bossKey))
        .orderBy(desc(bossMastery.masteryLevel), desc(bossMastery.kills))
        .limit(input.limit);
    }),

  /** Get all boss mastery definitions */
  getMasteryDefs: publicProcedure.query(async () => {
    return BOSS_MASTERY_DEFS;
  }),
});
