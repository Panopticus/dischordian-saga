/* ═══════════════════════════════════════════════════════
   SHADOW TONGUE REDACTIONS TABLE BOOTSTRAP

   The `shadow_tongue_redactions` table (NPC depth #13) is
   declared in apps/db/schema.ts. Same idempotent CREATE TABLE
   IF NOT EXISTS pattern as npcMemoryBootstrap. The migration
   journal is drifted; production schema enforced at startup.

   See apps/shared/universe/shadowTongue.ts for the redaction
   policy module and apps/server/services/shadowTongueRedactionService.ts
   for the writer + reader API.
   ═══════════════════════════════════════════════════════ */

import { sql } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";

const SHADOW_TONGUE_REDACTIONS_SQL = `
CREATE TABLE IF NOT EXISTS \`shadow_tongue_redactions\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`entryId\` VARCHAR(96) NOT NULL,
  \`triggerKey\` VARCHAR(128) NULL,
  \`redactionState\` VARCHAR(32) NULL,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_shadow_tongue_redactions_user_id\` (\`userId\`),
  KEY \`idx_shadow_tongue_redactions_user_entry\` (\`userId\`, \`entryId\`),
  UNIQUE KEY \`uniq_shadow_tongue_redactions_user_entry_trigger\`
    (\`userId\`, \`entryId\`, \`triggerKey\`),
  CONSTRAINT \`fk_shadow_tongue_redactions_user\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
);
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapShadowTongueRedactionsTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(SHADOW_TONGUE_REDACTIONS_SQL));
  } catch (err) {
    logger.warn("[ShadowTongueRedactionsBootstrap] CREATE TABLE failed", err);
  }
}
