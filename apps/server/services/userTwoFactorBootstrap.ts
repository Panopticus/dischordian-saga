/* ═══════════════════════════════════════════════════════
   USER_TWO_FACTOR TABLE BOOTSTRAP

   Migration 0065. Required by the new 2FA enrollment / verify
   endpoints. Idempotent CREATE TABLE IF NOT EXISTS.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`user_two_factor\` (
  \`userId\` INT NOT NULL,
  \`secret\` VARCHAR(64) NOT NULL,
  \`backupCodeHashes\` JSON NOT NULL,
  \`confirmed\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`enrolledAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`confirmedAt\` TIMESTAMP NULL,
  \`lastUsedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapUserTwoFactorTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(TABLE_SQL));
    logger.info("[UserTwoFactorBootstrap] table ensured");
  } catch (err) {
    logger.warn("[UserTwoFactorBootstrap] ensure failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
