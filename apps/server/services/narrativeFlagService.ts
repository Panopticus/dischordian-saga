/* ═══════════════════════════════════════════════════════
   NARRATIVE FLAG SERVICE — shared sticky-flag writer

   Extracted from romanceLadderService.ts so that other writers
   (apprenticeTrial, essenceHarvest, future quest mutations)
   can drop public narrative flags without re-implementing the
   upsert pattern. The npc_public_flags table is the canonical
   sticky-flag store; reads happen via crossCharacterReactions
   and the variant resolver picks them up automatically once a
   downstream VARIANT_REGISTRY entry references the flag.

   Idempotent: the unique index
   uniq_npc_public_flags_user_flag absorbs duplicate writes
   (the upsert touches the row but does not change the flag
   string).
   ═══════════════════════════════════════════════════════ */

import { sql } from "drizzle-orm";
import { npcPublicFlags } from "../../db/schema";
import { getDb } from "../db";
import { logger } from "../logger";

/**
 * Write a sticky narrative flag for the user. Returns true on
 * a successful upsert, false on DB unavailable or write
 * failure (logged at warn level; no throw).
 */
export async function writeNarrativeFlag(
  userId: number,
  flag: string,
  source: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag, setBy: source })
      .onDuplicateKeyUpdate({
        // Idempotent re-write — touch the row without changing
        // the flag string. The unique index protects against
        // double-writes; this is just a no-op upsert.
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
    return true;
  } catch (err) {
    logger.warn(`[narrativeFlag] writeNarrativeFlag(${flag}) failed:`, err);
    return false;
  }
}
