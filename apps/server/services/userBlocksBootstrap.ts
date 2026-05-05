/* user_blocks bootstrap (migration 0068). */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`user_blocks\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`blockerUserId\` INT NOT NULL,
  \`blockedUserId\` INT NOT NULL,
  \`reason\` VARCHAR(256) NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_user_block_pair\` (\`blockerUserId\`, \`blockedUserId\`),
  KEY \`idx_user_blocks_blocker\` (\`blockerUserId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapUserBlocksTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(TABLE_SQL));
    logger.info("[UserBlocksBootstrap] table ensured");
  } catch (err) {
    logger.warn("[UserBlocksBootstrap] ensure failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
