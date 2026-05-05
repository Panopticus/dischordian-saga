/* ═══════════════════════════════════════════════════════
   USER_AGREEMENTS TABLE BOOTSTRAP

   Migration 0063 (apps/db/0063_user_agreements.sql) defines the
   `user_agreements` table; until it lands in `_journal.json`,
   `drizzle-kit migrate` skips it on Railway deploys. The account
   router's GDPR Art. 7 acceptance recording would fail without
   this bootstrap.

   Idempotent: CREATE TABLE IF NOT EXISTS — fresh DB gets it,
   existing DBs are a no-op, manually-applied DBs stay consistent.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const USER_AGREEMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`user_agreements\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`agreementType\` VARCHAR(64) NOT NULL,
  \`version\` VARCHAR(32) NOT NULL,
  \`agreedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`ipHash\` VARCHAR(64) NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_user_agreement_version\` (\`userId\`, \`agreementType\`, \`version\`),
  KEY \`idx_user_agreements_user\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapUserAgreementsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(USER_AGREEMENTS_TABLE_SQL));
    logger.info("[UserAgreementsBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[UserAgreementsBootstrap] ensure failed — ToS/Privacy acceptance recording may fail:", msg);
  }
}
