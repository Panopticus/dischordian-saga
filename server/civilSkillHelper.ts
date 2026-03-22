/**
 * CIVIL SKILL XP HELPER
 * ─────────────────────
 * Server-side helper to award civil skill XP from any game router.
 * Import and call awardCivilXp(userId, action) after game actions complete.
 */
import { getDb } from "./db";
import { civilSkillProgress } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { calculateCivilSkillXp, getCivilSkillLevel } from "../shared/civilSkills";

/**
 * Award civil skill XP for a game action.
 * Call this from any game router after a relevant action completes.
 * 
 * @param userId - The user's ID
 * @param action - The action key (must match a SkillAction.action in civilSkills.ts)
 * @returns Map of skill key → { awarded, newLevel, levelUp } or empty if no skills match
 */
export async function awardCivilXp(
  userId: number,
  action: string
): Promise<Record<string, { awarded: number; newLevel: number; levelUp: boolean }>> {
  const xpGains = calculateCivilSkillXp(action);
  if (Object.keys(xpGains).length === 0) return {};

  const db = await getDb();
  if (!db) return {};

  const results: Record<string, { awarded: number; newLevel: number; levelUp: boolean }> = {};

  for (const [skillKey, xpGain] of Object.entries(xpGains)) {
    try {
      const existing = await db
        .select()
        .from(civilSkillProgress)
        .where(and(
          eq(civilSkillProgress.userId, userId),
          eq(civilSkillProgress.skillKey, skillKey),
        ))
        .limit(1);

      const currentXp = existing[0]?.xp ?? 0;
      const currentLevel = existing[0]?.level ?? 1;
      const newXp = currentXp + xpGain;
      const newLevel = getCivilSkillLevel(newXp);
      const levelUp = newLevel > currentLevel;

      if (existing[0]) {
        await db
          .update(civilSkillProgress)
          .set({
            xp: newXp,
            level: newLevel,
            actionsPerformed: (existing[0].actionsPerformed ?? 0) + 1,
          })
          .where(eq(civilSkillProgress.id, existing[0].id));
      } else {
        await db.insert(civilSkillProgress).values({
          userId,
          skillKey,
          xp: xpGain,
          level: getCivilSkillLevel(xpGain),
          actionsPerformed: 1,
        });
      }

      results[skillKey] = { awarded: xpGain, newLevel, levelUp };
    } catch (err) {
      console.error(`[CivilSkill] Error awarding XP for ${skillKey}:`, err);
    }
  }

  return results;
}

/**
 * Award XP for multiple actions at once (batch).
 */
export async function awardCivilXpBatch(
  userId: number,
  actions: string[]
): Promise<Record<string, { awarded: number; newLevel: number; levelUp: boolean }>> {
  const combined: Record<string, { awarded: number; newLevel: number; levelUp: boolean }> = {};

  for (const action of actions) {
    const result = await awardCivilXp(userId, action);
    for (const [key, val] of Object.entries(result)) {
      if (combined[key]) {
        combined[key].awarded += val.awarded;
        combined[key].newLevel = val.newLevel;
        combined[key].levelUp = combined[key].levelUp || val.levelUp;
      } else {
        combined[key] = { ...val };
      }
    }
  }

  return combined;
}
