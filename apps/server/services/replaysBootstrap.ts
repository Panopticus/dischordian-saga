/* ═══════════════════════════════════════════════════════
   GAME_REPLAYS.SHARETOKEN COLUMN BOOTSTRAP

   Migration 0056 (apps/db/0056_game_replays_share_token.sql)
   adds a `shareToken VARCHAR(32) UNIQUE` column to
   `game_replays` for unguessable share-links (#6 / #46).
   Like 0055, this migration is orphaned from `_journal.json`
   under the journal-drift situation in apps/db/README.md, so
   `drizzle-kit migrate` skips it on Railway deploys.

   The bootstrap below runs the same idempotent DDL on server
   startup. Unlike a `CREATE TABLE IF NOT EXISTS`, MySQL has
   no `ADD COLUMN IF NOT EXISTS` (it's MariaDB-only), so we
   inspect `information_schema.columns` first and only ALTER
   when the column is missing.

   - A fresh DB has no `shareToken` → ALTER runs → column +
     unique index added.
   - A DB that already has the column → information_schema
     hit short-circuits → no-op.
   - DB pool not configured (tests / local without MySQL) →
     short-circuit at `getDb()`.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const COLUMN_PROBE_SQL = `
SELECT COUNT(*) AS present
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'game_replays'
  AND column_name = 'shareToken'
`;

const ADD_COLUMN_SQL = `
ALTER TABLE \`game_replays\`
  ADD COLUMN \`shareToken\` VARCHAR(32) NULL,
  ADD UNIQUE KEY \`uq_game_replays_share_token\` (\`shareToken\`)
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapReplayShareToken(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const probe = (await db.execute(sql.raw(COLUMN_PROBE_SQL))) as unknown as
      | [Array<{ present: number | bigint }>, unknown]
      | { rows: Array<{ present: number | bigint }> };
    // mysql2 returns [rows, fields]; some drivers return { rows }.
    // Either shape works — we just want the first row's `present`.
    const rows: Array<{ present: number | bigint }> = Array.isArray(probe)
      ? probe[0]
      : probe.rows;
    const present = Number(rows[0]?.present ?? 0);
    if (present > 0) {
      logger.info("[ReplaysBootstrap] shareToken column already present");
      return;
    }

    await db.execute(sql.raw(ADD_COLUMN_SQL));
    logger.info("[ReplaysBootstrap] shareToken column added");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If the bootstrap fails, share-link lookups via `getReplayByToken`
    // silently 404. The legacy `getReplay(replayId)` path keeps working,
    // so the regression surface is "share-link feature degrades to
    // by-id-only" — a warn (not an error) keeps the process up.
    logger.warn(
      "[ReplaysBootstrap] shareToken column ensure failed — share-link lookup may be unavailable: " +
        msg,
    );
  }
}
