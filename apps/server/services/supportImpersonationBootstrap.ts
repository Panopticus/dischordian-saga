/* support_impersonation_grants bootstrap (migration 0069). */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`support_impersonation_grants\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`issuedToAdminId\` INT NOT NULL,
  \`targetUserId\` INT NOT NULL,
  \`reason\` VARCHAR(512) NOT NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`expiresAt\` TIMESTAMP NOT NULL,
  \`usedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_support_grants_admin\` (\`issuedToAdminId\`),
  KEY \`idx_support_grants_target\` (\`targetUserId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapSupportImpersonationTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(TABLE_SQL));
    logger.info("[SupportImpersonationBootstrap] table ensured");
  } catch (err) {
    logger.warn("[SupportImpersonationBootstrap] ensure failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
