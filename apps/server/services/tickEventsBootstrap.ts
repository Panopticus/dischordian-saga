/* ═══════════════════════════════════════════════════════
   TICK EVENTS TABLE BOOTSTRAP

   The `tick_events` table (NPC depth #12) is declared in
   apps/db/schema.ts. Same idempotent CREATE TABLE IF NOT
   EXISTS pattern as npcMemoryBootstrap and
   shadowTongueRedactionsBootstrap. The migration journal is
   drifted; production schema enforced at startup.
   ═══════════════════════════════════════════════════════ */

import { sql } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";

const TICK_EVENTS_SQL = `
CREATE TABLE IF NOT EXISTS \`tick_events\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`kind\` VARCHAR(64) NOT NULL,
  \`summary\` VARCHAR(512) NOT NULL,
  \`voId\` VARCHAR(96) NULL,
  \`payload\` JSON,
  \`occurredAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`acknowledgedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tick_events_user_id\` (\`userId\`),
  KEY \`idx_tick_events_user_unack\` (\`userId\`, \`acknowledgedAt\`),
  CONSTRAINT \`fk_tick_events_user\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
);
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapTickEventsTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(TICK_EVENTS_SQL));
  } catch (err) {
    logger.warn("[TickEventsBootstrap] CREATE TABLE failed", err);
  }
}
