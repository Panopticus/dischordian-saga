/* ═══════════════════════════════════════════════════════
   NPC MEMORY TABLE BOOTSTRAP

   The `npc_memory` table is declared in apps/db/schema.ts (NPC
   depth #6). Same pattern as worldWeaveBootstrap /
   casinoHarmReductionColumnsBootstrap — until the migration
   journal is reconciled, we run idempotent CREATE TABLE IF
   NOT EXISTS on server startup.

   See apps/shared/npcs/memoryEvents.ts for the event-key
   registry and per-NPC interest vectors; see
   apps/server/services/npcMemoryService.ts for the writer +
   reader API.
   ═══════════════════════════════════════════════════════ */

import { sql } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";

const NPC_MEMORY_SQL = `
CREATE TABLE IF NOT EXISTS \`npc_memory\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`npcKey\` VARCHAR(64) NOT NULL,
  \`eventKey\` VARCHAR(96) NOT NULL,
  \`polarity\` INT NOT NULL DEFAULT 0,
  \`payload\` JSON,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`expiresAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_npc_memory_user_id\` (\`userId\`),
  KEY \`idx_npc_memory_user_npc_event\` (\`userId\`, \`npcKey\`, \`eventKey\`),
  CONSTRAINT \`fk_npc_memory_user\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
);
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapNpcMemoryTable(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(NPC_MEMORY_SQL));
  } catch (err) {
    logger.warn("[NpcMemoryBootstrap] CREATE TABLE failed", err);
  }
}
