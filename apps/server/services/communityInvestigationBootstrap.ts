/* ═══════════════════════════════════════════════════════
   COMMUNITY DISCOVERY EVENTS — TABLE BOOTSTRAP

   audit/16 PR 35 (AR7 server consumer of PR 29's substrate).

   The runtime needs a single events table to persist
   per-discovery rows. PR 29 shipped the pure aggregator
   (`buildCommunitySnapshot` in
   apps/shared/communityInvestigation.ts); this PR ships
   the server-side persistence that produces the rows that
   aggregator consumes.

   Migration journal is currently drifted (see
   apps/db/migrations/migration-drift.baseline.json), so
   new tables get the same idempotent CREATE-IF-NOT-EXISTS
   bootstrap pattern that announcements / chatReports use.
   Every statement is a no-op when the table already
   exists; safe to run on every cold-boot.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const COMMUNITY_DISCOVERY_EVENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`community_discovery_events\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`kind\` ENUM(
    'clue_collected',
    'mystery_solved',
    'puzzle_solved',
    'manuscript_entry_unlocked',
    'unreachable_registered'
  ) NOT NULL,
  \`targetId\` VARCHAR(128) NOT NULL,
  \`optIn\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`seasonKey\` VARCHAR(32),
  \`occurredAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_cde_user_kind_target\` (\`userId\`, \`kind\`, \`targetId\`),
  INDEX \`idx_cde_kind\` (\`kind\`),
  INDEX \`idx_cde_season\` (\`seasonKey\`),
  INDEX \`idx_cde_user\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapCommunityDiscoveryEventsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(COMMUNITY_DISCOVERY_EVENTS_TABLE_SQL));
    logger.info("[CommunityInvestigationBootstrap] community_discovery_events ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[CommunityInvestigationBootstrap] ensure failed — community surface may be read-only:", msg);
  }
}
