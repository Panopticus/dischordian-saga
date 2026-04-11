/* ═══════════════════════════════════════════════════════
   CRAFTING MATERIALS GRANTER — Tiny helper that lets any
   server router credit crafting materials onto a player's
   userProgress.gameData.materials inventory.

   Used by:
   - fightLeaderboard.recordMatch  (combat drops on win)
   - ark.visitRoom                  (exploration drops on first visit)
   - tradeEmpire.completeMission    (bonus drops on top of fixed reward)

   All grants are "fire and forget" from the caller's perspective —
   errors are logged but don't fail the parent mutation.
   ═══════════════════════════════════════════════════════ */

import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";

/**
 * Add (or subtract, with negative quantities) the given materials to
 * a user's gameData.materials inventory. Bootstraps the userProgress
 * row for "dischordian-saga" if it doesn't exist yet.
 *
 * Returns the new materials map, or `null` on error.
 */
export async function grantMaterials(
  userId: number,
  materials: Record<string, number>,
): Promise<Record<string, number> | null> {
  if (!materials || Object.keys(materials).length === 0) return {};
  try {
    const db = await getDb();
    if (!db) return null;

    const rows = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);

    const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
    const inv = { ...((gameData.materials ?? {}) as Record<string, number>) };

    for (const [matId, qty] of Object.entries(materials)) {
      if (qty === 0) continue;
      inv[matId] = (inv[matId] ?? 0) + qty;
      if (inv[matId] <= 0) delete inv[matId];
    }

    if (rows[0]) {
      await db.update(userProgress)
        .set({ gameData: { ...gameData, materials: inv } })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")));
    } else {
      await db.insert(userProgress).values({
        userId,
        franchiseId: "dischordian-saga",
        gameData: { materials: inv },
      });
    }

    return inv;
  } catch (e) {
    logger.error("[CraftingMaterials] grantMaterials failed:", e);
    return null;
  }
}
