/* ═══════════════════════════════════════════════════════
   BATTLE PASS XP SERVICE — Award pass XP from any game system

   Usage from any router:
     import { battlePassXp } from "../services/battlePassXp";
     await battlePassXp.award(userId, "combat_win");
     await battlePassXp.awardRaw(userId, 50);

   Handles:
   - Looking up active season
   - Creating progress record if needed
   - Applying prestige multiplier
   - Variable XP curve tier calculation
   - Tier-up notifications
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { battlePassSeasons, battlePassProgress, notifications } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger";
import { getTierFromXp, getXpSource, MAX_TIER, getTierProgress } from "@shared/battlePassConfig";
import { getPrestigeMultiplier } from "./prestigeMultiplier";

export const battlePassXp = {
  /**
   * Award battle pass XP for a named action (uses XP_SOURCES config).
   * Call from any game router after relevant actions.
   */
  async award(userId: number, actionId: string): Promise<{ xpAdded: number; newTier: number } | null> {
    const source = getXpSource(actionId);
    if (!source) return null;
    return this.awardRaw(userId, source.xp);
  },

  /**
   * Award raw XP amount to battle pass (after applying prestige multiplier).
   */
  async awardRaw(userId: number, baseXp: number): Promise<{ xpAdded: number; newTier: number } | null> {
    const db = await getDb();
    if (!db) return null;

    const season = await db.select().from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .limit(1);
    if (!season[0]) return null;

    let [progress] = await db.select().from(battlePassProgress)
      .where(and(
        eq(battlePassProgress.userId, userId),
        eq(battlePassProgress.seasonId, season[0].id),
      ))
      .limit(1);

    if (!progress) {
      await db.insert(battlePassProgress).values({
        userId,
        seasonId: season[0].id,
        currentXp: 0,
        currentTier: 0,
        isPremium: false,
        claimedFreeTiers: [],
        claimedPremiumTiers: [],
      });
      [progress] = await db.select().from(battlePassProgress)
        .where(and(
          eq(battlePassProgress.userId, userId),
          eq(battlePassProgress.seasonId, season[0].id),
        ))
        .limit(1);
    }

    if (!progress || progress.currentTier >= MAX_TIER) return { xpAdded: 0, newTier: MAX_TIER };

    const prestigeMult = await getPrestigeMultiplier(userId);
    const finalXp = Math.round(baseXp * prestigeMult);
    const newXp = progress.currentXp + finalXp;
    const newTier = Math.min(getTierFromXp(newXp), season[0].totalTiers);

    await db.update(battlePassProgress)
      .set({ currentXp: newXp, currentTier: newTier })
      .where(eq(battlePassProgress.id, progress.id));

    // Notify on tier-up
    if (newTier > progress.currentTier) {
      await db.insert(notifications).values({
        userId,
        type: "battle_pass_tier_up",
        title: `Battle Pass Tier ${newTier}!`,
        message: `You've reached tier ${newTier}${newTier >= MAX_TIER ? " — maximum tier!" : ""}.`,
      }).catch(e => logger.error("[BattlePassXp] Notification failed:", e));
    }

    return { xpAdded: finalXp, newTier };
  },
};
