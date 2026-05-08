-- ─────────────────────────────────────────────────────────────────
-- Trade Empire / Coda Agency mission loop — vertical slice.
--
-- Per CANON_REV_7_ORACLE_VEX_EXPANSION.md §2 (The Coda) and the
-- INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md §6 item 1: the Coda Agency
-- mission system is the lateral overlay on Trade Empire that delivers
-- the Vex Solène / Engineer Zero reveal cadence. This migration
-- introduces the data substrate for browse → accept → complete →
-- reward; the catalog of mission definitions lives in TS at
-- apps/shared/tradeMissionCatalog.ts.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE `trade_missions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `missionDefId` VARCHAR(64) NOT NULL,
  `status` ENUM('available','active','completed','failed','expired') NOT NULL DEFAULT 'available',
  `agencyId` VARCHAR(64),
  `offeredAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `acceptedAt` TIMESTAMP NULL,
  `completedAt` TIMESTAMP NULL,
  `rewardPayload` JSON NULL,
  PRIMARY KEY (`id`),
  INDEX `byUser` (`userId`, `status`),
  CONSTRAINT `trade_missions_userId_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint

CREATE TABLE `trade_agency_standing` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `agencyId` VARCHAR(64) NOT NULL,
  `standing` INT NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `byUserAgency` (`userId`, `agencyId`),
  CONSTRAINT `trade_agency_standing_userId_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
