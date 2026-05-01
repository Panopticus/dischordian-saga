/**
 * Legacy title backfill: userProgress.title (free-text) →
 * userCosmeticLoadout.equippedTitleKey (typed key).
 *
 * Migrates the four legacy title strings ("The Legend",
 * "The Phantom", "Master Architect", "Void Walker") and the
 * default "Recruit" placeholder. Anything else stays as-is in
 * userProgress.title for display fallback; the loadout row is
 * still created so future equips work.
 *
 * Idempotent — uses (userId) unique key on userCosmeticLoadout.
 */
import { eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  userProgress,
  userCosmeticLoadout,
  competitiveRatingsBackfill,
} from "../../db/schema";
import { logger } from "../logger";

const LEGACY_TITLE_TO_KEY: Record<string, string> = {
  "The Legend": "title_legend",
  "The Phantom": "title_phantom",
  "Master Architect": "title_architect",
  "Void Walker": "title_void_walker",
};

const BACKFILL_VERSION = "legacy-titles-v1";

/**
 * Run the legacy title backfill exactly once. Marker stored in the
 * existing competitive_ratings_backfill table (re-used as a generic
 * one-shot migration ledger). Skipped on every subsequent boot.
 */
export async function runLegacyTitleBackfillOnce(): Promise<{
  ran: boolean;
  migrated: number;
  loadoutsCreated: number;
}> {
  const db = await getDb();
  if (!db) return { ran: false, migrated: 0, loadoutsCreated: 0 };

  const existing = await db
    .select()
    .from(competitiveRatingsBackfill)
    .where(eq(competitiveRatingsBackfill.version, BACKFILL_VERSION))
    .limit(1);
  if (existing[0]) {
    return { ran: false, migrated: 0, loadoutsCreated: 0 };
  }

  let migrated = 0;
  let loadoutsCreated = 0;

  // Pull every userProgress row with a non-null, non-default title.
  const rows = await db
    .select({ userId: userProgress.userId, title: userProgress.title })
    .from(userProgress);

  for (const row of rows) {
    if (!row.title || row.title === "Recruit") {
      // Still ensure a loadout row exists so equip flows work.
      try {
        await db
          .insert(userCosmeticLoadout)
          .values({ userId: row.userId })
          .onDuplicateKeyUpdate({ set: { userId: row.userId } });
        loadoutsCreated++;
      } catch {
        // Duplicate is fine.
      }
      continue;
    }
    const titleKey = LEGACY_TITLE_TO_KEY[row.title];
    try {
      await db
        .insert(userCosmeticLoadout)
        .values({
          userId: row.userId,
          equippedTitleKey: titleKey ?? null,
        })
        .onDuplicateKeyUpdate({
          // Don't overwrite an explicit equip choice the user made
          // in the new system; only fill the slot if it's empty.
          set: {
            equippedTitleKey: sql`COALESCE(equipped_title_key, ${titleKey ?? null})`,
          },
        });
      if (titleKey) migrated++;
      loadoutsCreated++;
    } catch (err) {
      logger.warn(
        "legacy_title_backfill_row_failed",
        "legacyTitleBackfill",
        { userId: row.userId, title: row.title, error: String(err) },
      );
    }
  }

  try {
    await db.insert(competitiveRatingsBackfill).values({
      version: BACKFILL_VERSION,
      cardMirrored: migrated,
      chessMirrored: loadoutsCreated,
    });
  } catch {
    /* race-safe */
  }

  logger.info(
    "legacy_title_backfill_complete",
    "legacyTitleBackfill",
    { migrated, loadoutsCreated },
  );
  return { ran: true, migrated, loadoutsCreated };
}
