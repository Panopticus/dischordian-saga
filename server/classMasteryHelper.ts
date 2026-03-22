/**
 * CLASS MASTERY XP HELPER
 * ───────────────────────
 * Lightweight function that any game router can call to award class XP.
 * Handles fetching the citizen, calculating XP, and updating the record.
 * Returns the XP awarded and rank-up info (if any) for toast display.
 */

import { getDb } from "./db";
import { classMastery, citizenCharacters } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
  getMasteryRank,
  calculateClassXp,
  getUnlockedPerks,
  CLASS_PERKS,
  MASTERY_RANKS,
  CLASS_XP_ACTIONS,
  type CharacterClass,
  type MasteryRank,
} from "../shared/classMastery";

export interface ClassXpResult {
  awarded: number;
  totalXp: number;
  rankUp: boolean;
  isAligned: boolean;
  rankUpInfo?: {
    newRank: number;
    rankTitle: string;
    rankColor: string;
    perkName: string;
    perkDescription: string;
  } | null;
}

/**
 * Award class XP for a game action. Safe to call from any router.
 * Returns null if the user has no citizen or class.
 */
export async function awardClassXp(userId: number, action: string): Promise<ClassXpResult | null> {
  const db = await getDb();
  if (!db) return null;

  // Get citizen's class
  const chars = await db
    .select()
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);

  if (!chars[0]) return null;
  const characterClass = chars[0].characterClass as CharacterClass;
  if (!characterClass) return null;

  // Calculate XP
  const xpEarned = calculateClassXp(action, characterClass);
  if (xpEarned === 0) return null;

  // Get or create mastery record
  let records = await db
    .select()
    .from(classMastery)
    .where(and(eq(classMastery.userId, userId), eq(classMastery.characterClass, characterClass)))
    .limit(1);

  if (!records[0]) {
    await db.insert(classMastery).values({
      userId,
      characterClass,
      classXp: 0,
      masteryRank: 0,
      unlockedPerks: [],
      actionsPerformed: 0,
    });
    records = await db
      .select()
      .from(classMastery)
      .where(and(eq(classMastery.userId, userId), eq(classMastery.characterClass, characterClass)))
      .limit(1);
  }

  const mastery = records[0];
  if (!mastery) return null;

  const oldRank = getMasteryRank(mastery.classXp);
  const newXp = mastery.classXp + xpEarned;
  const newRank = getMasteryRank(newXp);
  const rankUp = newRank > oldRank;

  let newPerks = (mastery.unlockedPerks as string[]) || [];
  if (rankUp) {
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

  const isAligned = CLASS_XP_ACTIONS.find(a => a.action === action)?.alignedClasses.includes(characterClass) ?? false;

  let rankUpInfo = null;
  if (rankUp) {
    const newPerk = CLASS_PERKS[characterClass].find(p => p.rank === newRank);
    rankUpInfo = {
      newRank,
      rankTitle: MASTERY_RANKS[newRank].title,
      rankColor: MASTERY_RANKS[newRank].color,
      perkName: newPerk?.name ?? "",
      perkDescription: newPerk?.description ?? "",
    };
  }

  return {
    awarded: xpEarned,
    totalXp: newXp,
    rankUp,
    isAligned,
    rankUpInfo,
  };
}
