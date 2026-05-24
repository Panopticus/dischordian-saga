/* ═══════════════════════════════════════════════════════
   GLOBAL ALIGNMENT TABLE BOOTSTRAP

   Migration 0075 (apps/db/0075_global_alignment_meter.sql)
   creates the singleton `global_alignment` row that
   globalAlignmentService recomputes hourly. The migration
   is journaled but the journal has drifted (see
   apps/db/migrations/migration-drift.baseline.json), so
   `drizzle-kit migrate` can skip it on existing DBs and the
   hourly recompute then dies with ER_NO_SUCH_TABLE.

   Same idempotent-DDL pattern as announcementsBootstrap:
   CREATE TABLE IF NOT EXISTS + INSERT IGNORE to seed id=1.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const GLOBAL_ALIGNMENT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`global_alignment\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`lightTotal\` INT NOT NULL DEFAULT 0,
  \`darkTotal\` INT NOT NULL DEFAULT 0,
  \`playerCount\` INT NOT NULL DEFAULT 0,
  \`computedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`phase\` ENUM('light_dominant','balanced','dark_dominant')
    NOT NULL DEFAULT 'balanced',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const GLOBAL_ALIGNMENT_SEED_SQL = `
INSERT IGNORE INTO \`global_alignment\`
  (\`id\`, \`lightTotal\`, \`darkTotal\`, \`playerCount\`, \`phase\`)
VALUES (1, 0, 0, 0, 'balanced')
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapGlobalAlignmentTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(GLOBAL_ALIGNMENT_TABLE_SQL));
    await db.execute(sql.raw(GLOBAL_ALIGNMENT_SEED_SQL));
    logger.info("[GlobalAlignmentBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[GlobalAlignmentBootstrap] ensure failed — hourly recompute will keep erroring:", msg);
  }
}
