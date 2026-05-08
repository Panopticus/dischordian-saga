/* ═══════════════════════════════════════════════════════
   WORLD WEAVE TABLE BOOTSTRAP

   The yearly_events / yearly_event_participation / ripple_events
   / memorial_inscriptions tables are added in apps/db/schema.ts
   but no drizzle migration ships with them yet (the journal
   has drifted from on-disk migrations — see apps/db/README.md).

   Until the next journal reconciliation, we run the same
   idempotent DDL on server startup. Same pattern as
   announcementsBootstrap / chatReportsBootstrap.

   If the DB pool isn't configured the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const YEARLY_EVENTS_SQL = `
CREATE TABLE IF NOT EXISTS \`yearly_events\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`eventKey\` VARCHAR(64) NOT NULL,
  \`anchorMonth\` INT NOT NULL,
  \`anchorDay\` INT NOT NULL,
  \`durationDays\` INT NOT NULL DEFAULT 7,
  \`closingMotionKey\` VARCHAR(96),
  \`activeYear\` INT NOT NULL,
  \`activatedAt\` TIMESTAMP NULL,
  \`resolvedAt\` TIMESTAMP NULL,
  \`triggeredBySeal\` INT,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_event_year\` (\`eventKey\`, \`activeYear\`),
  KEY \`idx_yearly_events_activated_at\` (\`activatedAt\`)
);
`;

const YEARLY_EVENT_PARTICIPATION_SQL = `
CREATE TABLE IF NOT EXISTS \`yearly_event_participation\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`eventId\` INT NOT NULL,
  \`userId\` INT NOT NULL,
  \`contribution\` INT NOT NULL DEFAULT 0,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_event_user\` (\`eventId\`, \`userId\`),
  KEY \`idx_yep_user\` (\`userId\`)
);
`;

const RIPPLE_EVENTS_SQL = `
CREATE TABLE IF NOT EXISTS \`ripple_events\` (
  \`id\` BIGINT NOT NULL AUTO_INCREMENT,
  \`eventType\` VARCHAR(96) NOT NULL,
  \`userId\` INT,
  \`fromSystem\` VARCHAR(48),
  \`toSystems\` JSON,
  \`payload\` JSON,
  \`emittedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_ripple_events_emitted_at\` (\`emittedAt\`),
  KEY \`idx_ripple_events_user_emitted_at\` (\`userId\`, \`emittedAt\`),
  KEY \`idx_ripple_events_event_type\` (\`eventType\`)
);
`;

const MEMORIAL_INSCRIPTIONS_SQL = `
CREATE TABLE IF NOT EXISTS \`memorial_inscriptions\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`inscribedName\` VARCHAR(120) NOT NULL,
  \`memorialYear\` INT NOT NULL,
  \`scope\` ENUM('personal','global') NOT NULL DEFAULT 'personal',
  \`inscribedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_memorial_user_year\` (\`userId\`, \`memorialYear\`, \`inscribedName\`),
  KEY \`idx_memorial_year_scope\` (\`memorialYear\`, \`scope\`)
);
`;

/**
 * Idempotent: add a column only if it doesn't already exist. MySQL's
 * ALTER TABLE … ADD COLUMN doesn't carry an IF NOT EXISTS clause that
 * is portable across versions, so we look up information_schema first.
 */
async function ensureColumn(
  db: Awaited<ReturnType<typeof getDb>>,
  table: string,
  column: string,
  ddl: string,
): Promise<void> {
  if (!db) return;
  try {
    const rows = (await db.execute(
      sql.raw(
        `SELECT COUNT(*) AS c FROM information_schema.columns ` +
          `WHERE table_schema = DATABASE() AND table_name = '${table}' AND column_name = '${column}'`,
      ),
    )) as unknown as Array<Array<{ c: number }>> | { rows: Array<{ c: number }> };
    // mysql2 returns [rows[], fields[]]; drizzle wraps it. Handle both shapes.
    let count = 0;
    if (Array.isArray(rows) && Array.isArray(rows[0])) {
      count = Number(rows[0][0]?.c ?? 0);
    } else if (
      typeof rows === "object" &&
      rows !== null &&
      Array.isArray((rows as { rows?: unknown }).rows)
    ) {
      count = Number(
        ((rows as { rows: Array<{ c: number }> }).rows[0]?.c ?? 0),
      );
    }
    if (count > 0) return;
    await db.execute(sql.raw(ddl));
  } catch (err) {
    logger.error(
      `[WorldWeaveBootstrap] ensureColumn ${table}.${column} failed:`,
      err,
    );
  }
}

export async function bootstrapWorldWeaveTables(): Promise<void> {
  const db = await getDb();
  if (!db) {
    logger.info("[WorldWeaveBootstrap] DB unavailable; skipping.");
    return;
  }
  for (const ddl of [
    YEARLY_EVENTS_SQL,
    YEARLY_EVENT_PARTICIPATION_SQL,
    RIPPLE_EVENTS_SQL,
    MEMORIAL_INSCRIPTIONS_SQL,
  ]) {
    try {
      await db.execute(sql.raw(ddl));
    } catch (err) {
      logger.error("[WorldWeaveBootstrap] DDL failed:", err);
    }
  }

  // Add cosmetic provenance column on existing rows (forward-only;
  // existing rows stay null until they're re-stamped).
  await ensureColumn(
    db,
    "cosmetic_catalog_ownership",
    "provenance",
    "ALTER TABLE `cosmetic_catalog_ownership` ADD COLUMN `provenance` JSON NULL",
  );
}
