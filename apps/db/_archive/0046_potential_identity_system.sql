-- ═══════════════════════════════════════════════════════
-- POTENTIAL IDENTITY SYSTEM — Batch C
--
-- Adds the Unity Meter singleton + append-only contribution log,
-- plus per-user membership and per-faction aggregate state tables
-- for the eight DeMagi/Quarchon Potential factions.
--
-- Migration 0046. Additive only — no drops, no renames.
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `unity_meter_state` (
  `id` INT NOT NULL DEFAULT 1,
  `phase` VARCHAR(32) NOT NULL DEFAULT 'contested',
  `percent` INT NOT NULL DEFAULT 50,
  `lastTick` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `unity_meter_state_singleton` CHECK (`id` = 1)
);
--> statement-breakpoint

-- Seed the singleton row if it is not yet present.
INSERT INTO `unity_meter_state` (`id`, `phase`, `percent`)
SELECT 1, 'contested', 50
WHERE NOT EXISTS (SELECT 1 FROM `unity_meter_state` WHERE `id` = 1);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `unity_contributions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `source` VARCHAR(64) NOT NULL,
  `delta` INT NOT NULL,
  `factionId` VARCHAR(64) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_unity_contrib_user` (`userId`),
  INDEX `idx_unity_contrib_created` (`createdAt`),
  INDEX `idx_unity_contrib_faction` (`factionId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `potential_faction_membership` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `factionId` VARCHAR(64) NOT NULL,
  `rank` VARCHAR(32) NOT NULL DEFAULT 'recruit',
  `joinedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `recruitedBy` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_potfac_mem_user_faction` (`userId`, `factionId`),
  INDEX `idx_potfac_mem_user` (`userId`),
  INDEX `idx_potfac_mem_faction` (`factionId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `potential_faction_state` (
  `factionId` VARCHAR(64) NOT NULL,
  `dominance` INT NOT NULL DEFAULT 0,
  `memberCount` INT NOT NULL DEFAULT 0,
  `sectorHolds` JSON NULL,
  `threat` INT NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`factionId`)
);
--> statement-breakpoint

-- Seed the 8 faction rows if not yet present so joinFaction() never has
-- to handle a missing parent.
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'demagi_assembly', 0, 0, 0 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'demagi_assembly');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'demagi_wardens', 0, 0, 10 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'demagi_wardens');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'demagi_resonance', 0, 0, 0 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'demagi_resonance');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'demagi_pureflame', 0, 0, 40 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'demagi_pureflame');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'quarchon_accord', 0, 0, 0 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'quarchon_accord');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'quarchon_dimguard', 0, 0, 10 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'quarchon_dimguard');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'quarchon_realinst', 0, 0, 5 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'quarchon_realinst');
--> statement-breakpoint
INSERT INTO `potential_faction_state` (`factionId`, `dominance`, `memberCount`, `threat`)
SELECT 'quarchon_firstpattern', 0, 0, 40 WHERE NOT EXISTS (SELECT 1 FROM `potential_faction_state` WHERE `factionId` = 'quarchon_firstpattern');
