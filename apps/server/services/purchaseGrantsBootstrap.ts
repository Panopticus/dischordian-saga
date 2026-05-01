/* ═══════════════════════════════════════════════════════
   PURCHASE GRANTS LEDGER BOOTSTRAP

   The purchase_grants table is new on this branch; no drizzle
   migration ships with it yet, so a fresh-DB deploy would lose
   the atomicity guarantee that the table provides until the
   next journal reconciliation. This bootstrap runs the same
   idempotent DDL on server startup as the safety net (matching
   announcementsBootstrap, citizenSchemaBootstrap, etc):

     - Fresh DB → table is created.
     - DB that already has the table → no-op.
     - DB where it was applied manually → no-op (matching schema).

   If the DB pool isn't configured (tests / local without MySQL)
   the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const PURCHASE_GRANTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`purchase_grants\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`fulfillmentId\` VARCHAR(256) NOT NULL,
  \`userId\` INT NOT NULL,
  \`productKey\` VARCHAR(128) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`rewardSummary\` JSON,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_purchase_grants_fulfillment\` (\`fulfillmentId\`),
  INDEX \`idx_purchase_grants_user\` (\`userId\`),
  INDEX \`idx_purchase_grants_product\` (\`productKey\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapPurchaseGrantsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(PURCHASE_GRANTS_TABLE_SQL));
    logger.info("[PurchaseGrantsBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      "[PurchaseGrantsBootstrap] ensure failed — fulfilment idempotency may degrade:",
      msg,
    );
  }
}
