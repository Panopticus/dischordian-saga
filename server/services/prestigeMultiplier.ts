/* ═══════════════════════════════════════════════════════
   PRESTIGE MULTIPLIER — Shared utility for XP/resource scaling

   Any server code that awards XP or resources should call:
     const mult = await getPrestigeMultiplier(userId);
     const adjusted = Math.round(baseAmount * mult);

   Or — more commonly — apply the whole reward payload at once:
     const applied = await applyPrestigeBonuses(userId, { xp, resource, trust });

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

/**
 * Apply prestige bonuses to an entire reward payload in one call.
 *
 * This is the preferred helper for quest / battle / event rewards:
 * pass in the base amounts and receive back the prestige-scaled
 * amounts plus the raw multipliers (so routers can show "+15% XP
 * from prestige" toasts on the client).
 *
 * Non-prestiged players get the input values back unchanged and
 * `tier: 0`, so call sites can unconditionally use the return value.
 */
export async function applyPrestigeBonuses(
  userId: number,
  rewards: { xp?: number; resource?: number; trust?: number },
): Promise<{
  xp: number;
  resource: number;
  trust: number;
  multipliers: { xp: number; resource: number; trust: number };
  tier: number;
}> {
  const db = await getDb();
  if (!db) {
    return {
      xp: rewards.xp ?? 0,
      resource: rewards.resource ?? 0,
      trust: rewards.trust ?? 0,
      multipliers: { xp: 1, resource: 1, trust: 1 },
      tier: 0,
    };
  }

  const [sheet] = await db.select({ prestigeTier: characterSheets.prestigeTier })
    .from(characterSheets)
    .where(eq(characterSheets.userId, userId))
    .limit(1);

  const tier = sheet?.prestigeTier ?? 0;
  const multipliers = tier === 0
    ? { xp: 1, resource: 1, trust: 1 }
    : getPrestigeMultipliers(tier);

  return {
    xp: Math.round((rewards.xp ?? 0) * multipliers.xp),
    resource: Math.round((rewards.resource ?? 0) * multipliers.resource),
    trust: Math.round((rewards.trust ?? 0) * multipliers.trust),
    multipliers,
    tier,
  };
}
