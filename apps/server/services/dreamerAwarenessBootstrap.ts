/* ═══════════════════════════════════════════════════════
   DREAMER AWARENESS TABLE BOOTSTRAP

   The dreamer_awareness table is new on this branch; no drizzle
   migration ships with it yet, so a fresh-DB deploy would lose
   the silent-counter substrate that powers the dual-faction
   recruitment system. This bootstrap runs the same idempotent
   DDL on server startup as the safety net (matching the
   announcementsBootstrap, citizenSchemaBootstrap, pvp_ratings,
   chat_reports, and purchase_grants patterns).

     - Fresh DB → table is created.
     - DB that already has the table → no-op.
     - DB where it was applied manually → no-op (matching schema).

   If the DB pool isn't configured (tests / local without MySQL)
   the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const DREAMER_AWARENESS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`dreamer_awareness\` (
  \`userId\` INT NOT NULL,
  \`awarenessCount\` INT NOT NULL DEFAULT 0,
  \`tagsFired\` VARCHAR(1024) NOT NULL DEFAULT '',
  \`visionsReceived\` JSON,
  \`lastTagAt\` TIMESTAMP NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapDreamerAwarenessTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(DREAMER_AWARENESS_TABLE_SQL));
    logger.info("[DreamerAwarenessBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      "[DreamerAwarenessBootstrap] ensure failed — silent counter may be unavailable:",
      msg,
    );
  }
}
