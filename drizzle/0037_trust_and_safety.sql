-- Trust & Safety scaffolding — player blocks, reports, moderator audit log
--
-- Prior to this migration the social features layer had no moderation
-- surface at all:
--   • a player could DM any other player with no consent gate
--   • friend requests could be spammed without limit
--   • there was no way for a player to block a harasser
--   • there was no way for a player to report abusive content
--   • there was no audit trail for moderator actions
--
-- These tables plus server/routers/moderation.ts + the mutation rate
-- limiter in server/mutationRateLimit.ts give us the minimum T&S floor
-- needed to open DMs / friend requests / guild chat to real players
-- without taking on unbounded liability.

CREATE TABLE `user_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `blockedUserId` INT NOT NULL,
  `reason` VARCHAR(255),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_blocks_user_blocked` (`userId`, `blockedUserId`),
  KEY `idx_user_blocks_user` (`userId`),
  KEY `idx_user_blocks_blocked` (`blockedUserId`)
);

CREATE TABLE `user_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reporterUserId` INT NOT NULL,
  `reportedUserId` INT NOT NULL,
  -- Free-form category so product can iterate on the enum without a migration
  `category` VARCHAR(64) NOT NULL,
  `details` TEXT,
  -- Optional reference to the offending content (message id, post id, etc.)
  `contextType` VARCHAR(64),
  `contextId` VARCHAR(128),
  -- pending → triaged → resolved | dismissed
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `resolvedByUserId` INT,
  `resolvedAt` TIMESTAMP NULL,
  `resolutionNotes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_reports_reporter` (`reporterUserId`),
  KEY `idx_user_reports_reported` (`reportedUserId`),
  KEY `idx_user_reports_status` (`status`, `createdAt`)
);

CREATE TABLE `moderator_audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `moderatorUserId` INT NOT NULL,
  -- e.g. 'report_resolve', 'user_mute', 'user_ban', 'dm_purge'
  `action` VARCHAR(64) NOT NULL,
  `targetUserId` INT,
  `targetType` VARCHAR(64),
  `targetId` VARCHAR(128),
  `payload` JSON,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_moderator_audit_moderator` (`moderatorUserId`),
  KEY `idx_moderator_audit_target` (`targetUserId`),
  KEY `idx_moderator_audit_created` (`createdAt`)
);
