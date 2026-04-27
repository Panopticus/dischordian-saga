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

const ADD_COLUMN_SQL = `
ALTER TABLE \`game_replays\`
  ADD COLUMN \`shareToken\` VARCHAR(32) NULL,
  ADD UNIQUE KEY \`uq_game_replays_share_token\` (\`shareToken\`)
`;

/** Generic column-existence probe + ALTER pair. Used by both
 *  bootstraps below since the only difference between them is the
 *  column name + ALTER body. */
async function ensureColumn(opts: {
  column: string;
  addColumnSql: string;
  successMessage: string;
  alreadyMessage: string;
  failureMessage: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const probeSql = `
SELECT COUNT(*) AS present
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'game_replays'
  AND column_name = '${opts.column}'
`;

  try {
    const probe = (await db.execute(sql.raw(probeSql))) as unknown as
      | [Array<{ present: number | bigint }>, unknown]
      | { rows: Array<{ present: number | bigint }> };
    const rows: Array<{ present: number | bigint }> = Array.isArray(probe)
      ? probe[0]
      : probe.rows;
    const present = Number(rows[0]?.present ?? 0);
    if (present > 0) {
      logger.info(opts.alreadyMessage);
      return;
    }

    await db.execute(sql.raw(opts.addColumnSql));
    logger.info(opts.successMessage);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`${opts.failureMessage}: ${msg}`);
  }
}

let shareTokenBootstrapPromise: Promise<void> | null = null;

export function bootstrapReplayShareToken(): Promise<void> {
  if (!shareTokenBootstrapPromise) {
    shareTokenBootstrapPromise = ensureColumn({
      column: "shareToken",
      addColumnSql: ADD_COLUMN_SQL,
      successMessage: "[ReplaysBootstrap] shareToken column added",
      alreadyMessage: "[ReplaysBootstrap] shareToken column already present",
      // Failure surface: share-link lookups via `getReplayByToken`
      // silently 404. The legacy `getReplay(replayId)` path keeps
      // working, so the regression downgrades to by-id-only.
      failureMessage:
        "[ReplaysBootstrap] shareToken column ensure failed — share-link lookup may be unavailable",
    });
  }
  return shareTokenBootstrapPromise;
}

const ADD_MATCH_ID_SQL = `
ALTER TABLE \`game_replays\`
  ADD COLUMN \`matchId\` VARCHAR(64) NULL,
  ADD INDEX \`idx_game_replays_match_id\` (\`matchId\`)
`;

let matchIdBootstrapPromise: Promise<void> | null = null;

/** Migration 0057 — adds `matchId VARCHAR(64) NULL` to `game_replays`.
 *  Required by the verification job (#92) so it can deterministically
 *  reconstruct the initial GameState; the engine mints card-instance
 *  ids via `makeCardInstance(matchId, counter, …)`, so hashState over
 *  a GameState rebuilt from a different matchId will diverge from the
 *  stored finalStateHash even when every action replays identically. */
export function bootstrapReplayMatchId(): Promise<void> {
  if (!matchIdBootstrapPromise) {
    matchIdBootstrapPromise = ensureColumn({
      column: "matchId",
      addColumnSql: ADD_MATCH_ID_SQL,
      successMessage: "[ReplaysBootstrap] matchId column added",
      alreadyMessage: "[ReplaysBootstrap] matchId column already present",
      // Failure surface: rows persisted before this column lands have
      // matchId=null, and `verifyReplay` returns
      // {ok:false, reason:"matchId not stored"} for those. Legacy
      // saveReplay / getReplay paths are unaffected.
      failureMessage:
        "[ReplaysBootstrap] matchId column ensure failed — replay verification may be unavailable",
    });
  }
  return matchIdBootstrapPromise;
}
