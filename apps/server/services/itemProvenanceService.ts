/* ═══════════════════════════════════════════════════════
   ITEM PROVENANCE SERVICE — stamps cosmetics at craft/grant

   Reads:
     - latest broken seal (sealStateService)
     - active yearly event (if any)
     - dominant horseman from worldMoodService.global()

   Writes:
     - the `provenance` JSON column on cosmetic_catalog_ownership
       at the moment of grant.
     - emits `item_provenance_stamped` ripple (consumed by social /
       guild handlers per the WovenSystem registry).

   Forward-only: never backfills existing rows. Failures are
   swallowed; provenance is metadata, not a gate.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { cosmeticCatalogOwnership, yearlyEvents } from "../../db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { worldMoodService } from "./worldMoodService";
import { sealStateService } from "./sealStateService";
import { ripple } from "./rippleEngine";
import { rippleLedgerService } from "./rippleLedgerService";
import { logger } from "../logger";

export interface ItemProvenance {
  latestSeal?: number;
  activeYearly?: string;
  dominantHorseman?: "conquest" | "war" | "famine" | "death";
  stampedAt?: string;
}

/** Compose a provenance stamp for the given player at "now". */
export async function composeProvenance(
  userId: number,
): Promise<ItemProvenance> {
  const out: ItemProvenance = { stampedAt: new Date().toISOString() };
  try {
    const seal = await sealStateService.latestBrokenSealForPlayer(userId);
    if (seal !== null) out.latestSeal = seal;
  } catch {
    // ignore
  }
  try {
    const mood = await worldMoodService.global();
    out.dominantHorseman = mood.dominantAxis;
  } catch {
    // ignore
  }
  try {
    const db = await getDb();
    if (db) {
      const year = new Date().getUTCFullYear();
      const rows = await db
        .select({ key: yearlyEvents.eventKey })
        .from(yearlyEvents)
        .where(
          and(eq(yearlyEvents.activeYear, year), isNull(yearlyEvents.resolvedAt)),
        )
        .limit(1);
      if (rows.length > 0 && rows[0].key) out.activeYearly = rows[0].key;
    }
  } catch {
    // ignore
  }
  return out;
}

/**
 * Stamp the most recent ungranted-provenance ownership row for a
 * player + cosmeticId. Called immediately after a cosmetic grant.
 */
export async function stampCosmeticProvenance(
  userId: number,
  cosmeticId: string,
): Promise<ItemProvenance | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const provenance = await composeProvenance(userId);
    await db
      .update(cosmeticCatalogOwnership)
      .set({ provenance })
      .where(
        and(
          eq(cosmeticCatalogOwnership.userId, userId),
          eq(cosmeticCatalogOwnership.cosmeticId, cosmeticId),
        ),
      );
    try {
      await ripple.emit("item_provenance_stamped", {
        userId,
        cosmeticId,
        provenance,
      });
      await rippleLedgerService.record({
        eventType: "item_provenance_stamped",
        userId,
        fromSystem: "custom_items",
        toSystems: ["social", "guild"],
        payload: { cosmeticId, provenance },
      });
    } catch (err) {
      logger.error("[itemProvenance] emit failed:", err);
    }
    return provenance;
  } catch (err) {
    logger.error("[itemProvenance] stampCosmeticProvenance failed:", err);
    return null;
  }
}
