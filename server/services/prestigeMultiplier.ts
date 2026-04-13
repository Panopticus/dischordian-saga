/* ═══════════════════════════════════════════════════════
   PRESTIGE MULTIPLIER — Shared utility for XP/resource scaling

   Any server code that awards XP or resources should call:
     const mult = await getPrestigeMultiplier(userId);
     const adjusted = Math.round(baseAmount * mult);

   Returns 1.0 for non-prestiged players (no overhead).
   Reads from characterSheets.prestigeTier, cached per request.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { characterSheets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getPrestigeMultipliers } from "@shared/prestigeSystem";

/**
 * Get the XP multiplier for a user based on their prestige tier.
 * Returns 1.0 if no prestige or no character sheet.
 */
export async function getPrestigeMultiplier(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 1.0;

  const [sheet] = await db.select({ prestigeTier: characterSheets.prestigeTier })
    .from(characterSheets)
    .where(eq(characterSheets.userId, userId))
    .limit(1);

  if (!sheet || sheet.prestigeTier === 0) return 1.0;

  return getPrestigeMultipliers(sheet.prestigeTier).xp;
}

/**
 * Get all prestige multipliers (xp, resource, trust) for a user.
 */
export async function getAllPrestigeMultipliers(userId: number): Promise<{
  xp: number; resource: number; trust: number;
}> {
  const db = await getDb();
  if (!db) return { xp: 1, resource: 1, trust: 1 };

  const [sheet] = await db.select({ prestigeTier: characterSheets.prestigeTier })
    .from(characterSheets)
    .where(eq(characterSheets.userId, userId))
    .limit(1);

  if (!sheet || sheet.prestigeTier === 0) return { xp: 1, resource: 1, trust: 1 };

  return getPrestigeMultipliers(sheet.prestigeTier);
}
