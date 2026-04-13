import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { classMastery, citizenCharacters } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import {
  getMasteryRank,
  getXpToNextRank,
  getUnlockedPerks,
  getNextPerk,
  calculateClassXp,
  CLASS_PERKS,
  MASTERY_RANKS,
  CLASS_XP_ACTIONS,
  type CharacterClass,
  type MasteryRank,
} from "../../shared/classMastery";

/* ═══════════════════════════════════════════════════════
   HELPER — Get or create mastery record for a user
   ═══════════════════════════════════════════════════════ */

async function getOrCreateMastery(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get the user's primary citizen to determine class
  const chars = await db
    .select()
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);

  if (!chars[0]) return null;
  const characterClass = chars[0].characterClass as CharacterClass;
  if (!characterClass) return null;

  // Check for existing mastery record
  const existing = await db
    .select()
    .from(classMastery)
    .where(and(eq(classMastery.userId, userId), eq(classMastery.characterClass, characterClass)))
    .limit(1);

  if (existing[0]) {
    return { mastery: existing[0], characterClass, citizen: chars[0] };
  }

  // Create new mastery record
  const [inserted] = await db.insert(classMastery).values({
    userId,
    characterClass,
    classXp: 0,
    masteryRank: 0,
    unlockedPerks: [],
    actionsPerformed: 0,
  });

  const newRecord = await db
    .select()
    .from(classMastery)
    .where(eq(classMastery.id, inserted.insertId))
    .limit(1);

  return { mastery: newRecord[0], characterClass, citizen: chars[0] };
}

/* ═══════════════════════════════════════════════════════
   CLASS MASTERY ROUTER
   ═══════════════════════════════════════════════════════ */

export const classMasteryRouter = router({
  /** Get current mastery status — rank, XP, unlocked perks, next perk */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const result = await getOrCreateMastery(ctx.user.id);
    if (!result) return null;

    const { mastery, characterClass } = result;
    const rank = getMasteryRank(mastery.classXp) as MasteryRank;
    const xpProgress = getXpToNextRank(mastery.classXp);
    const unlockedPerks = getUnlockedPerks(characterClass, rank);
    const nextPerk = getNextPerk(characterClass, rank);
    const rankInfo = MASTERY_RANKS[rank];

    return {
      characterClass,
      classXp: mastery.classXp,
      masteryRank: rank,
      rankTitle: rankInfo.title,
      rankColor: rankInfo.color,
      xpProgress,
      unlockedPerks,
      nextPerk,
      actionsPerformed: mastery.actionsPerformed,
      allPerks: CLASS_PERKS[characterClass],
    };
  }),

  /** Award class XP for performing an action.
      Called by other game systems when class-aligned actions occur. */
  awardXp: protectedProcedure
    .input(z.object({ action: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await getOrCreateMastery(ctx.user.id);
      if (!result) return { awarded: 0, rankUp: false };

      const { mastery, characterClass } = result;
      const xpEarned = calculateClassXp(input.action, characterClass);
      if (xpEarned === 0) return { awarded: 0, rankUp: false };

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const oldRank = getMasteryRank(mastery.classXp);
      const newXp = mastery.classXp + xpEarned;
      const newRank = getMasteryRank(newXp);

      // Check for rank up
      const rankUp = newRank > oldRank;
      let newPerks = (mastery.unlockedPerks as string[]) || [];

      if (rankUp) {
        // Unlock all perks up to the new rank
        const allUnlocked = getUnlockedPerks(characterClass, newRank as MasteryRank);
        newPerks = allUnlocked.map(p => p.key);
      }

      await db
        .update(classMastery)
        .set({
          classXp: newXp,
          masteryRank: newRank,
          unlockedPerks: newPerks,
          actionsPerformed: mastery.actionsPerformed + 1,
        })
        .where(eq(classMastery.id, mastery.id));

      if (rankUp) {
        await ripple.emit("class_rank_up", { userId: ctx.user.id, className: characterClass, newRank });

        // Grant card reward for class mastery rank up
        try {
          await grantCardReward(ctx.user.id, "class_mastery_" + characterClass);
        } catch (e) {
          logger.warn("Failed to grant class mastery card reward", e);
        }
      }

      const rankUpInfo = rankUp
        ? {
            newRank,
            rankTitle: MASTERY_RANKS[newRank].title,
            rankColor: MASTERY_RANKS[newRank].color,
            newPerk: CLASS_PERKS[characterClass].find(p => p.rank === newRank) || null,
          }
        : null;

      return {
        awarded: xpEarned,
        totalXp: newXp,
        rankUp,
        rankUpInfo,
        isAligned: CLASS_XP_ACTIONS.find(a => a.action === input.action)?.alignedClasses.includes(characterClass) ?? false,
      };
    }),

  /** Get all available XP actions and which are aligned with the player's class */
  getXpActions: protectedProcedure.query(async ({ ctx }) => {
    const result = await getOrCreateMastery(ctx.user.id);
    if (!result) return [];

    const { characterClass } = result;
    return CLASS_XP_ACTIONS.map(action => ({
      ...action,
      isAligned: action.alignedClasses.includes(characterClass),
      effectiveXp: calculateClassXp(action.action, characterClass),
    }));
  }),

  /** Get mastery leaderboard — top players by class XP */
  getLeaderboard: protectedProcedure
    .input(z.object({
      characterClass: z.enum(["spy", "oracle", "assassin", "engineer", "soldier"]).optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { sql } = await import("drizzle-orm");

      let query;
      if (input.characterClass) {
        query = await db
          .select()
          .from(classMastery)
          .where(eq(classMastery.characterClass, input.characterClass))
          .orderBy(sql`${classMastery.classXp} DESC`)
          .limit(input.limit);
      } else {
        query = await db
          .select()
          .from(classMastery)
          .orderBy(sql`${classMastery.classXp} DESC`)
          .limit(input.limit);
      }

      return query.map(row => ({
        userId: row.userId,
        characterClass: row.characterClass,
        classXp: row.classXp,
        masteryRank: row.masteryRank,
        rankTitle: MASTERY_RANKS[row.masteryRank as number]?.title ?? "Unranked",
      }));
    }),

  /** Get active perk effects for combat/gameplay consumption */
  getActivePerkEffects: protectedProcedure.query(async ({ ctx }) => {
    const result = await getOrCreateMastery(ctx.user.id);
    if (!result) return { perks: [], effects: {} };

    const { mastery, characterClass } = result;
    const rank = getMasteryRank(mastery.classXp);
    const unlockedPerks = getUnlockedPerks(characterClass, rank as MasteryRank);

    // Build a flat effect map for easy consumption by game systems
    const effects: Record<string, number> = {};
    for (const perk of unlockedPerks) {
      if (perk.effect) {
        const key = `${perk.effect.type}_${perk.effect.target || "self"}`;
        effects[key] = (effects[key] || 0) + (perk.effect.value || 0);
      }
    }

    return {
      perks: unlockedPerks.map(p => ({ key: p.key, name: p.name, effect: p.effect })),
      effects,
      characterClass,
      rank,
    };
  }),

  /** Respec mastery — reset XP and perks (costs dream tokens) */
  respec: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await getOrCreateMastery(ctx.user.id);
      if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "No mastery found" });

      // Reset mastery to rank 0 — keep the class, lose the XP and perks
      await db.update(classMastery)
        .set({
          classXp: 0,
          masteryRank: 0,
          unlockedPerks: [],
        })
        .where(eq(classMastery.userId, ctx.user.id));

      return { success: true, message: "Mastery reset. Your class remains, but XP and perks have been cleared." };
    }),
});
