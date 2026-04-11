/* ═══════════════════════════════════════════════════════
   PRESTIGE ROUTER — The Cycle Turns

   Prestige = NG+. Reset level, rooms, quests. Keep trust,
   cards, achievements, morality, companions, loredex.
   Gain permanent XP/resource/trust multipliers (1.10x–2.50x).

   Integrates with:
   - pressureService (prestige = timeline convergence)
   - prestigeNarrative (NPC acknowledgment sequences)
   - shared/prestigeSystem.ts (canPrestige, multipliers, levels)
   - shared/prestigeDialogs.ts (all NPC dialog text)
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { logger } from "../logger";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  characterSheets, citizenCharacters, userProgress, userArkProgress,
  dailyQuests, dreamBalance, notifications, battlePassProgress,
  featureUnlocks,
} from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  canPrestige, getPrestigeLevel, getPrestigeMultipliers,
  getPrestigeTitle, PRESTIGE_LEVELS, type PrestigeState,
} from "@shared/prestigeSystem";
import { ripple } from "../services/rippleEngine";
import { onPrestigeComplete } from "../services/prestigeNarrative";

export const prestigeRouter = router({
  /** Get current prestige state for the player */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const [sheet] = await db.select().from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id)).limit(1);
    if (!sheet) return null;

    const [citizen] = await db.select().from(citizenCharacters)
      .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
      .limit(1);

    const tier = sheet.prestigeTier;
    const playerLevel = citizen?.level ?? 1;
    const eligible = canPrestige(playerLevel, tier);
    const multipliers = getPrestigeMultipliers(tier);
    const nextLevel = getPrestigeLevel(tier + 1);
    const state = sheet.prestigeState as PrestigeState | null;

    return {
      currentTier: tier,
      playerLevel,
      eligible,
      multipliers,
      nextLevel,
      title: sheet.prestigeTier > 0
        ? getPrestigeTitle(tier, citizen?.name ?? "Operative")
        : null,
      allLevels: PRESTIGE_LEVELS,
      state: state ?? {
        currentPrestige: tier,
        totalPrestiges: 0,
        lifetimeXp: 0,
        lifetimeResources: { dream: 0, salvage: 0, voidCrystals: 0 },
        prestigeHistory: [],
      },
    };
  }),

  /** Execute prestige reset — the big one */
  execute: protectedProcedure
    .input(z.object({
      /** Active companion ID for comfort gesture */
      companionId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // 1. Verify eligibility
      const [sheet] = await db.select().from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id)).limit(1);
      if (!sheet) throw new Error("No character sheet found");

      const [citizen] = await db.select().from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!citizen) throw new Error("No citizen character found");

      const currentTier = sheet.prestigeTier;
      if (!canPrestige(citizen.level, currentTier)) {
        throw new Error(`Cannot prestige: level ${citizen.level}, tier ${currentTier}. Need level 25+.`);
      }

      const newTier = currentTier + 1;
      const newLevel = getPrestigeLevel(newTier);
      if (!newLevel) throw new Error("Max prestige tier reached");

      // 2. Build prestige state
      const oldState = (sheet.prestigeState as PrestigeState | null) ?? {
        currentPrestige: currentTier,
        totalPrestiges: currentTier,
        lifetimeXp: 0,
        lifetimeResources: { dream: 0, salvage: 0, voidCrystals: 0 },
        prestigeHistory: [],
      };

      // Capture current resources before reset
      const [dreamBal] = await db.select().from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      const currentDream = dreamBal?.dreamTokens ?? 0;

      const newState: PrestigeState = {
        currentPrestige: newTier,
        totalPrestiges: oldState.totalPrestiges + 1,
        lifetimeXp: oldState.lifetimeXp + (citizen.xp ?? 0),
        lifetimeResources: {
          dream: oldState.lifetimeResources.dream + currentDream,
          salvage: oldState.lifetimeResources.salvage,
          voidCrystals: oldState.lifetimeResources.voidCrystals,
        },
        prestigeHistory: [
          ...oldState.prestigeHistory,
          { level: newTier, date: new Date().toISOString().split("T")[0], playerLevel: citizen.level },
        ],
      };

      // 3. PRESERVE: trust, achievements, cards, morality, cosmetics, companions, loredex
      //    (These tables are NOT touched — they survive automatically)

      // 4. RESET operations
      // Reset citizen level → 1, XP → 0
      await db.update(citizenCharacters)
        .set({ level: 1, xp: 0, classLevel: 1 })
        .where(eq(citizenCharacters.id, citizen.id));

      // Reset room unlocks → only cryo_bay stays unlocked
      await db.update(userArkProgress)
        .set({ isUnlocked: 0 })
        .where(and(
          eq(userArkProgress.userId, ctx.user.id),
          sql`${userArkProgress.roomId} != 'cryo_bay'`,
        ));

      // Reset quest progress
      await db.delete(dailyQuests)
        .where(eq(dailyQuests.userId, ctx.user.id));

      // Currencies: keep 10%
      if (dreamBal) {
        const kept = Math.floor(currentDream * 0.10);
        await db.update(dreamBalance)
          .set({ dreamTokens: kept })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      // Reset userProgress level (but keep progressData/gameData for achievements)
      const [progress] = await db.select().from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id)).limit(1);
      if (progress) {
        await db.update(userProgress)
          .set({ level: 1, xp: 0, points: 0 })
          .where(eq(userProgress.userId, ctx.user.id));
      }

      // Reset battle pass tier
      await db.delete(battlePassProgress)
        .where(eq(battlePassProgress.userId, ctx.user.id));

      // Reset feature unlocks (re-explore to re-unlock)
      // Keep default features, reset room-discovered ones
      await db.delete(featureUnlocks)
        .where(and(
          eq(featureUnlocks.userId, ctx.user.id),
          eq(featureUnlocks.unlockedVia, "ark_room"),
        ));

      // 5. Apply new prestige tier + state to character sheet
      await db.update(characterSheets)
        .set({
          prestigeTier: newTier,
          prestigeState: newState,
        })
        .where(eq(characterSheets.id, sheet.id));

      // 6. Set narrative flags
      // (Stored in userProgress.progressData or gameData)
      if (progress) {
        const gd = (progress.gameData as Record<string, unknown>) ?? {};
        const flags = (gd.narrativeFlags as Record<string, boolean>) ?? {};
        flags[`prestige_${newTier}`] = true;
        flags[`prestige_active`] = true;
        for (let i = 1; i <= newTier; i++) flags[`prestige_${i}`] = true;
        await db.update(userProgress)
          .set({ gameData: { ...gd, narrativeFlags: flags } })
          .where(eq(userProgress.userId, ctx.user.id));
      }

      // 7. Emit to ripple engine: prestige IS a timeline convergence
      await ripple.emit("prestige_reset", { userId: ctx.user.id, newTier });

      // 8. Trigger NPC acknowledgment narrative sequences
      const narrative = await onPrestigeComplete(ctx.user.id, newTier, input.companionId);

      // 9. Send prestige notification
      await db.insert(notifications).values({
        userId: ctx.user.id,
        type: "prestige_complete",
        title: `Prestige ${newTier}: ${newLevel.titlePrefix}`,
        message: newLevel.loreText,
      });

      logger.info(`[Prestige] User ${ctx.user.id} prestiged to tier ${newTier}`);

      // 10. Return new state
      const multipliers = getPrestigeMultipliers(newTier);
      return {
        success: true,
        newTier,
        titlePrefix: newLevel.titlePrefix,
        stars: newLevel.stars,
        multipliers,
        reward: newLevel.reward,
        loreText: newLevel.loreText,
        narrative: {
          elaraDialog: narrative.immediateDialogs[0]?.text ?? null,
          deferredNpcCount: narrative.deferredCount,
          chronicleCreated: narrative.chronicleCreated,
          companionReaction: narrative.companionReaction,
        },
        prestigeState: newState,
      };
    }),

  /** Check if current player can prestige (lightweight check for UI) */
  canPrestige: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { eligible: false, reason: "Database unavailable" };

    const [sheet] = await db.select().from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id)).limit(1);
    if (!sheet) return { eligible: false, reason: "No character sheet" };

    const [citizen] = await db.select().from(citizenCharacters)
      .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
      .limit(1);
    if (!citizen) return { eligible: false, reason: "No citizen character" };

    const tier = sheet.prestigeTier;
    if (tier >= PRESTIGE_LEVELS.length) {
      return { eligible: false, reason: "Maximum prestige tier reached (7)" };
    }
    if (citizen.level < 25) {
      return { eligible: false, reason: `Level ${citizen.level}/25 required`, currentLevel: citizen.level };
    }

    return { eligible: true, currentTier: tier, nextTier: tier + 1 };
  }),
});
