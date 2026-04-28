/* ═══════════════════════════════════════════════════════
   PVP_RATINGS TABLE BOOTSTRAP

   Migration 0058 (apps/db/0058_pvp_ratings.sql) defines the
   `pvp_ratings` table for the persistent MMR + seasonal rank
   feature (#7). Like the other 005x migrations this is orphaned
   from `_journal.json` under the journal-drift situation
   (apps/db/README.md). drizzle-kit migrate skips it on Railway,
   so the server runs the same idempotent DDL on startup.

   Failure surface: a missing pvp_ratings table means rank
   read/write tRPC procedures throw rather than silently degrade —
   admin pages will show errors but the rest of the game is
   unaffected (the producer wiring at duelystWs.endMatch will be
   in a separate PR and is also non-fatal). Logging at warn so
   process stays up.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const PVP_RATINGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`pvp_ratings\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`gameType\` VARCHAR(50) NOT NULL,
  \`mmr\` INT NOT NULL DEFAULT 1200,
  \`seasonId\` INT NOT NULL DEFAULT 1,
  \`seasonRank\` INT NOT NULL DEFAULT 0,
  \`seasonWins\` INT NOT NULL DEFAULT 0,
  \`seasonLosses\` INT NOT NULL DEFAULT 0,
  \`peakMmr\` INT NOT NULL DEFAULT 1200,
  \`lastMatchAt\` TIMESTAMP NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_pvp_ratings_user_game\` (\`userId\`, \`gameType\`),
  INDEX \`idx_pvp_ratings_leaderboard\` (\`gameType\`, \`mmr\` DESC),
  INDEX \`idx_pvp_ratings_user\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapPvpRatingsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(PVP_RATINGS_TABLE_SQL));
    logger.info("[PvpRatingsBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      "[PvpRatingsBootstrap] ensure failed — MMR + rank read/write may be unavailable: " +
        msg,
    );
  }
}
