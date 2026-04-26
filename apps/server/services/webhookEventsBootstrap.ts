/* ═══════════════════════════════════════════════════════
   PROCESSED_WEBHOOK_EVENTS TABLE BOOTSTRAP

   Migration 0055 (apps/db/0055_processed_webhook_events.sql)
   defines the `processed_webhook_events` table but is orphaned
   from `_journal.json` — see apps/db/README.md §"Known journal
   drift". `drizzle-kit migrate` therefore skips it on Railway
   deploys, and the Stripe webhook handler's event-level
   idempotency check would fail on every event ("table doesn't
   exist") if this bootstrap weren't run.

   Until the full journal reconciliation lands, we run the same
   idempotent DDL on server startup. Every statement uses
   `CREATE TABLE IF NOT EXISTS`, so:
     - A fresh DB gets the table.
     - A DB that already has it is a no-op.
     - A DB where it was applied manually stays consistent.

   If the DB pool isn't configured (tests / local without MySQL)
   the bootstrap short-circuits.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const PROCESSED_WEBHOOK_EVENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`processed_webhook_events\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`eventId\` VARCHAR(256) NOT NULL,
  \`eventType\` VARCHAR(128) NOT NULL,
  \`source\` VARCHAR(32) NOT NULL DEFAULT 'stripe',
  \`processedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_processed_webhook_events_event_id\` (\`eventId\`),
  INDEX \`idx_processed_webhook_events_type\` (\`eventType\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapWebhookEventsTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql.raw(PROCESSED_WEBHOOK_EVENTS_TABLE_SQL));
    logger.info("[WebhookEventsBootstrap] table ensured");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // The Stripe handler's exactly-once check sits ABOVE this — if the
    // table truly missing, replay protection for credit/dream purchases
    // silently downgrades to the old payment-intent-only guard. We log
    // a warn (not an error) so the process stays up; ops can ack from
    // the alarm and retry the deploy.
    logger.warn("[WebhookEventsBootstrap] ensure failed — Stripe replay protection may be partial:", msg);
  }
}
