/* ═══════════════════════════════════════════════════════
   SUIT MATERIALS GRANT SERVICE

   Single write path for adding to the citizen's
   `suitMaterials` JSON pouch. Loot drops, quest rewards,
   crafting bench events, and any other emitter that should
   put materials in the player's hand all route through here.

   Reads + writes the same JSON column the suit-craft
   mutation reads (apps/server/routers/crafting.ts), so the
   sentinel + count semantics stay consistent.

   Audit follow-up: closes the "loot/quest emitters that
   refill suitMaterials" item.
   ═══════════════════════════════════════════════════════ */
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { citizenCharacters } from "../../db/schema";
import {
  STARTER_GRANTED_SENTINEL,
  type MaterialId,
} from "../../shared/suitRecipes";
import { logger } from "../logger";

/** A grant — one material kind + count to add. */
export interface SuitMaterialGrant {
  materialId: MaterialId;
  count: number;
}

/**
 * Add the supplied grants to the primary citizen's pouch. No-ops
 * (returns 0) when the player has no primary citizen, the DB is
 * unavailable, or `grants` is empty.
 *
 * Idempotency: each call ADDS — re-running the same grant doubles
 * the materials. Callers that need idempotency (e.g. a ledger-row-
 * unique grant) must gate the call themselves.
 *
 * Returns the total count of materials added on success.
 */
export async function grantSuitMaterials(
  userId: number,
  grants: readonly SuitMaterialGrant[],
): Promise<number> {
  if (grants.length === 0) return 0;
  const db = await getDb();
  if (!db) return 0;

  // Find the player's primary citizen — only the active citizen has
  // a pouch we can credit. Players without a citizen yet (haven't
  // hit the creation flow) silently no-op; the grant lands the next
  // time they fire something after creation.
  const [character] = await db
    .select()
    .from(citizenCharacters)
    .where(
      and(
        eq(citizenCharacters.userId, userId),
        eq(citizenCharacters.isPrimary, 1),
      ),
    )
    .limit(1);
  if (!character) return 0;

  const pouch: Record<string, number> =
    (character.suitMaterials as Record<string, number> | null) ?? {};

  const next: Record<string, number> = { ...pouch };
  let added = 0;
  for (const g of grants) {
    if (g.count <= 0) continue;
    next[g.materialId] = (next[g.materialId] ?? 0) + g.count;
    added += g.count;
  }
  if (added === 0) return 0;

  // Preserve the starter-pouch sentinel if it was set; we only ever
  // ADD here, never overwrite. If the citizen never crafted, the
  // sentinel doesn't exist yet — that's fine; their first
  // attemptSuitCraft will deposit the starter pouch on top of these
  // grants, and the sentinel will be set then.
  void STARTER_GRANTED_SENTINEL;

  await db
    .update(citizenCharacters)
    .set({ suitMaterials: next })
    .where(eq(citizenCharacters.id, character.id));

  logger.info(
    `[suit-materials] +${added} granted to citizen=${character.id} user=${userId}`,
  );
  return added;
}

/**
 * Grant a fixed amount of brass-plate. Convenience for the most
 * common drop pattern (every recipe needs brass-plate).
 */
export function grantBrassPlate(
  userId: number,
  count: number,
): Promise<number> {
  return grantSuitMaterials(userId, [{ materialId: "brass-plate", count }]);
}
