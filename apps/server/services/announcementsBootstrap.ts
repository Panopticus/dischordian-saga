/* ═══════════════════════════════════════════════════════
   ANNOUNCEMENTS TABLE BOOTSTRAP

   Migration 0049 (apps/db/0049_title_screen_announcements.sql)
   defines the `announcements` and `announcement_views` tables
   but is orphaned from `_journal.json` — see apps/db/README.md
   §"Known journal drift". `drizzle-kit migrate` therefore skips
   it on Railway deploys, and the Architect's Console has no way
   to author announcements until the tables exist.

   Until the full journal reconciliation lands, we run the same
   idempotent DDL on server startup. Every statement uses
   `CREATE TABLE IF NOT EXISTS`, so:
     - A fresh DB gets the tables.
     - A DB that already has them is a no-op.
     - A DB where they were applied manually stays consistent.

   If the DB pool isn't configured (tests / local without MySQL)
   the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const ANNOUNCEMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`announcements\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`slug\` VARCHAR(128) NOT NULL,
  \`category\` ENUM('ark_alert','transmission_incoming','archival_footage','overlay')
    NOT NULL DEFAULT 'transmission_incoming',
  \`priority\` ENUM('normal','high') NOT NULL DEFAULT 'normal',
  \`title\` VARCHAR(256) NOT NULL,
  \`body\` TEXT,
  \`artUrl\` VARCHAR(512),
  \`linkUrl\` VARCHAR(512),
  \`videoUrl\` VARCHAR(512),
  \`videoPosterUrl\` VARCHAR(512),
  \`videoDurationSec\` INT,
  \`triggerOnTitle\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`triggerProbability\` INT NOT NULL DEFAULT 100,
  \`audience\` ENUM('all','unauth','authed','act_ge_3','light_aligned','dark_aligned')
    NOT NULL DEFAULT 'all',
  \`publishedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`expiresAt\` TIMESTAMP NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_announcements_slug\` (\`slug\`),
  INDEX \`idx_announcements_published\` (\`publishedAt\`),
  INDEX \`idx_announcements_audience\` (\`audience\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const ANNOUNCEMENT_VIEWS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`announcement_views\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`announcementId\` INT NOT NULL,
  \`firstSeenAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`dismissedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_announcement_views_user_ann\` (\`userId\`, \`announcementId\`),
  INDEX \`idx_announcement_views_user\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAnnouncementsTables(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(ANNOUNCEMENTS_TABLE_SQL));
    await db.execute(sql.raw(ANNOUNCEMENT_VIEWS_TABLE_SQL));
    logger.info("[AnnouncementsBootstrap] tables ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[AnnouncementsBootstrap] ensure failed — admin console may be read-only:", msg);
  }
}
