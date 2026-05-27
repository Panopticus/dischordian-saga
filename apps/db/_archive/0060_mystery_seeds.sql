-- Migration 0060 — mystery_seeds table
--
-- Adds the persistent record of every MysterySeed the engine
-- has produced. The cron writes a row on every successful close;
-- the server-startup bootstrap reads them back and re-compiles
-- each seed via mysteryTemplates.compileMysterySeed so the in-
-- memory dynamic registry survives deploys.
--
-- Compilation is deterministic by template contract, so
-- re-hydration is idempotent. The unique index on seedId makes
-- the cron's insert safe to retry.
--
-- Schema source of truth: apps/db/schema.ts. See the
-- "Mystery seeds" doc-block.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS so re-runs are no-ops.
-- ORPHAN STATUS: per apps/db/README.md §"Known journal drift",
-- this migration is added to disk but not wired into _journal.json
-- yet — a later devops cleanup commit reconciles the journal.

CREATE TABLE IF NOT EXISTS `mystery_seeds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `seedId` VARCHAR(200) NOT NULL,
  `source` VARCHAR(40) NOT NULL,
  `templateId` VARCHAR(100) NOT NULL,
  `payload` JSON NOT NULL,
  `compiledMysteryId` VARCHAR(100) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_mystery_seeds_seedId` (`seedId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
