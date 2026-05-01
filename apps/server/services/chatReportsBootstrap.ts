/* ═══════════════════════════════════════════════════════
   CHAT REPORTS TABLE BOOTSTRAP

   The chat_reports table is new in this branch; no drizzle
   migration ships with it yet, so a fresh-DB deploy would 404
   the moderator queue endpoints until the next journal
   reconciliation. This bootstrap runs the same idempotent DDL
   on server startup so the queue surface is always functional:

     - Fresh DB → table is created.
     - DB that already has the table → no-op.
     - DB where it was applied manually → no-op (matching schema).

   When the next drizzle journal reconciliation lands, the
   migration becomes the source of truth and this bootstrap can
   be removed. Until then it's the safety net (matching the
   pattern set by announcementsBootstrap, citizenSchemaBootstrap,
   and the migration 0058 pvp_ratings bootstrap).

   If the DB pool isn't configured (tests / local without MySQL)
   the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const CHAT_REPORTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`chat_reports\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`reporterUserId\` INT NOT NULL,
  \`reportedUserId\` INT NOT NULL,
  \`sourceType\` ENUM('guild_chat') NOT NULL DEFAULT 'guild_chat',
  \`sourceMessageId\` INT NOT NULL,
  \`messageSnapshot\` TEXT NOT NULL,
  \`reason\` ENUM('harassment','hate_speech','spam','doxxing','other') NOT NULL,
  \`notes\` VARCHAR(500),
  \`status\` ENUM('open','reviewed','dismissed','actioned') NOT NULL DEFAULT 'open',
  \`filterFlagsAtReport\` VARCHAR(128) NOT NULL DEFAULT '',
  \`reviewedBy\` INT,
  \`reviewedAt\` TIMESTAMP NULL,
  \`reviewerNotes\` VARCHAR(500),
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_chat_reports_reporter_msg\` (\`reporterUserId\`, \`sourceType\`, \`sourceMessageId\`),
  INDEX \`idx_chat_reports_status\` (\`status\`),
  INDEX \`idx_chat_reports_reported_user\` (\`reportedUserId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapChatReportsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(CHAT_REPORTS_TABLE_SQL));
    logger.info("[ChatReportsBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[ChatReportsBootstrap] ensure failed — moderator queue may be unavailable:", msg);
  }
}
