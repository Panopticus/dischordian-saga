/* ═══════════════════════════════════════════════════════
   CITIZEN CHARACTERS SCHEMA BOOTSTRAP

   Migration 0054_citizen_foundation.sql adds the `foundation`
   enum column that schema.ts has declared since the "Suits of
   the Inventor" commit — but it is orphaned from _journal.json
   (see apps/db/README.md §"Known journal drift"), so
   `drizzle-kit migrate` skips it on Railway deploys.

   Without that column, every SELECT against citizen_characters
   fails with "Unknown column 'foundation'" because Drizzle
   emits the full column list from schema.ts. That breaks
   citizen.getCharacter and, by extension, the entire Awakening
   handoff — the player sees "Character creation failed: Failed
   query: select `id`, `userId`, …, `foundation`, … from
   `citizen_characters` …" and can't get past the cryo bay.

   Until the full journal reconciliation lands we run the same
   ALTER TABLE on server startup, guarded by an
   INFORMATION_SCHEMA check so it is a no-op on databases that
   already have the column.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapCitizenSchema(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const result = (await db.execute(
      sql.raw(
        "SELECT COUNT(*) AS c FROM information_schema.columns " +
          "WHERE table_schema = DATABASE() " +
          "AND table_name = 'citizen_characters' " +
          "AND column_name = 'foundation'",
      ),
    )) as unknown as [Array<{ c: number | string }>, unknown];
    const rows = Array.isArray(result) ? result[0] : (result as unknown as Array<{ c: number | string }>);
    const count = Number(rows?.[0]?.c ?? 0);

    if (count === 0) {
      await db.execute(
        sql.raw(
          "ALTER TABLE `citizen_characters` " +
            "ADD COLUMN `foundation` ENUM('humanity','machine') " +
            "NOT NULL DEFAULT 'humanity' AFTER `element`",
        ),
      );
      logger.info("[CitizenSchemaBootstrap] added citizen_characters.foundation");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Don't throw — surface the failure in logs and let the server keep
    // serving other routes. citizen.getCharacter will still error, but
    // we won't take down the whole process on boot.
    logger.warn("[CitizenSchemaBootstrap] ensure failed:", msg);
  }
}
