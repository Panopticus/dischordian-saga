/* User sessions table bootstrap (migration 0066). */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`user_sessions\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`refreshTokenJti\` VARCHAR(64) NOT NULL,
  \`deviceLabel\` VARCHAR(256) NULL,
  \`ipHash\` VARCHAR(64) NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`lastUsedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`revokedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_user_sessions_jti\` (\`refreshTokenJti\`),
  KEY \`idx_user_sessions_user\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapUserSessionsTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(TABLE_SQL));
    logger.info("[UserSessionsBootstrap] table ensured");
  } catch (err) {
    logger.warn("[UserSessionsBootstrap] ensure failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
