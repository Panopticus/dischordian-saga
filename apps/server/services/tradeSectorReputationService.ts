/* ═══════════════════════════════════════════════════════
   SECTOR REPUTATION SERVICE — shared helper for the
   tradeSectorReputation table. Extracted from the trade-
   empire router so the items-matter cross-feed paths
   (payDemand bumps the demanding sub-house's anchor sector)
   can reuse the same rollover semantics without duplicating
   logic.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeSectorReputation } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export async function bumpSectorReputation(
  userId: number,
  sectorId: string,
  delta: number,
): Promise<{ controlLevel: number; reputation: number } | null> {
  const db = await getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(tradeSectorReputation)
    .where(
      and(
        eq(tradeSectorReputation.userId, userId),
        eq(tradeSectorReputation.sectorId, sectorId),
      ),
    )
    .limit(1);

  let controlLevel = existing?.controlLevel ?? 0;
  let reputation = (existing?.reputation ?? 0) + delta;
  if (reputation >= 100) {
    controlLevel = Math.min(5, controlLevel + 1);
    reputation -= 100;
  }
  if (reputation < 0) reputation = 0;

  if (existing) {
    await db
      .update(tradeSectorReputation)
      .set({ controlLevel, reputation })
      .where(eq(tradeSectorReputation.id, existing.id));
  } else {
    await db.insert(tradeSectorReputation).values({
      userId,
      sectorId,
      controlLevel,
      reputation,
    });
  }
  return { controlLevel, reputation };
}
