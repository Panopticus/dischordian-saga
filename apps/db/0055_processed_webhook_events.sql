-- Migration 0055 — processed_webhook_events
--
-- Event-level idempotency log for Stripe (and future-source) webhooks.
-- The unique index on `store_purchases.stripePaymentIntentId` only
-- protects intent-bearing purchases. Credit / Dream purchases produce
-- no payment intent, so MySQL's "NULLs are non-conflicting" rule lets
-- replays double-fulfill. This table closes that hole by keying
-- idempotency on `event.id` itself.
--
-- This migration is hand-written. It is orphaned from `_journal.json`
-- following the existing pattern for new migrations under the journal-
-- drift situation (see apps/db/README.md §"Known journal drift");
--> statement-breakpoint the
-- matching startup bootstrap is `bootstrapWebhookEventsTable()` in
-- apps/server/services/webhookEventsBootstrap.ts.
--
-- Idempotent: every statement uses `IF NOT EXISTS`, so re-running on
-- a database that already has the table is a no-op.

CREATE TABLE IF NOT EXISTS `processed_webhook_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `eventId` VARCHAR(256) NOT NULL,
  `eventType` VARCHAR(128) NOT NULL,
  `source` VARCHAR(32) NOT NULL DEFAULT 'stripe',
  `processedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_processed_webhook_events_event_id` (`eventId`),
  INDEX `idx_processed_webhook_events_type` (`eventType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
