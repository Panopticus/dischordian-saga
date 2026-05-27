-- Migration 0059 — mystery_engine tables
--
-- Adds the six durable-state tables for the Streamed Prism Mystery
-- Engine (per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10) plus
-- the `expiresAt` column on `epoch_vote_tallies` that the cron uses
-- to auto-close votes and trigger mystery seed compilation.
--
-- Tables:
--   * player_mystery_progress      — per-player active case + current episode
--   * mystery_evidence             — per-player clues found
--   * mystery_deductions           — append-only deduction submission log
--   * player_mystery_choices       — episode-close choices (carry-forward)
--   * mystery_interrogation_log    — every (npc, question, tone) press
--   * npc_trust_scalars            — per-player NPC trust (0-100), arc-finalized
--
-- Schema source of truth: apps/db/schema.ts. Authored side lives in
-- apps/shared/episodeMysteries.ts; orchestration in
-- apps/server/services/mysteryService.ts (lands in a follow-up PR).
--
-- Idempotent: CREATE TABLE IF NOT EXISTS so re-runs are no-ops. The
-- ALTER TABLE for `epoch_vote_tallies.expiresAt` uses an information_schema
-- guard pattern when applied via the bootstrap path.
--
-- ORPHAN STATUS: per apps/db/README.md §"Known journal drift", this
-- migration is added to disk but not wired into _journal.json yet — a
-- later devops cleanup commit reconciles the journal.

ALTER TABLE `epoch_vote_tallies`
  ADD COLUMN `expiresAt` TIMESTAMP NULL DEFAULT NULL AFTER `winningOption`;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `player_mystery_progress` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `mysteryId` VARCHAR(100) NOT NULL,
  `currentEpisodeId` VARCHAR(100) NOT NULL,
  `openedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastActedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lensId` VARCHAR(50) NOT NULL,
  `recapNeeded` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_pmp_user_mystery` (`userId`, `mysteryId`),
  INDEX `idx_pmp_last_acted` (`lastActedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `mystery_evidence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `mysteryId` VARCHAR(100) NOT NULL,
  `clueId` VARCHAR(100) NOT NULL,
  `foundAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `foundInRoom` VARCHAR(64) NOT NULL,
  `foundViaVerb` VARCHAR(24) NOT NULL,
  `presentedToNpcs` JSON NOT NULL,
  `notes` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_evidence_user_mystery_clue` (`userId`, `mysteryId`, `clueId`),
  INDEX `idx_evidence_user_mystery` (`userId`, `mysteryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `mystery_deductions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `mysteryId` VARCHAR(100) NOT NULL,
  `episodeId` VARCHAR(100) NOT NULL,
  `clueAId` VARCHAR(100) NOT NULL,
  `clueBId` VARCHAR(100) NOT NULL,
  `clueCId` VARCHAR(100) DEFAULT NULL,
  `result` VARCHAR(24) NOT NULL,
  `narrationId` VARCHAR(200) NOT NULL,
  `submittedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_deductions_user_mystery_episode` (`userId`, `mysteryId`, `episodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `player_mystery_choices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `mysteryId` VARCHAR(100) NOT NULL,
  `episodeId` VARCHAR(100) NOT NULL,
  `choiceId` VARCHAR(100) NOT NULL,
  `weight` VARCHAR(50) NOT NULL,
  `willRememberFlag` VARCHAR(100) NOT NULL DEFAULT '',
  `recordedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_choice_user_mystery_episode` (`userId`, `mysteryId`, `episodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `mystery_interrogation_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `mysteryId` VARCHAR(100) NOT NULL,
  `episodeId` VARCHAR(100) NOT NULL,
  `npcId` VARCHAR(100) NOT NULL,
  `questionId` VARCHAR(200) NOT NULL,
  `toneId` VARCHAR(24) NOT NULL,
  `trustDeltaApplied` INT NOT NULL DEFAULT 0,
  `askedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_interrogation_user_npc` (`userId`, `npcId`),
  INDEX `idx_interrogation_user_mystery_episode` (`userId`, `mysteryId`, `episodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `npc_trust_scalars` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `npcId` VARCHAR(100) NOT NULL,
  `scalar` INT NOT NULL DEFAULT 50,
  `lastUpdatedFromMysteryId` VARCHAR(100) DEFAULT NULL,
  `finalizedFromArc` VARCHAR(100) DEFAULT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_trust_user_npc` (`userId`, `npcId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
