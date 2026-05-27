-- Dead Man's Circuit — full lifecycle expansion
--
-- Adds:
--   1. Season closure tracking (champion + closed timestamp + universe event snapshot)
--   2. Per-leaderboard reward claim tracking + Severance Prize claim flag
--   3. circuit_clones — persistent clone roster across races within a season
--   4. circuit_identity_chains — player-authored 4-name identity (Student/Seeker/Detective/Last)
--   5. circuit_side_quest_progress — per-season cross-game side quest tracker

ALTER TABLE `circuit_seasons`
  ADD COLUMN `activeUniverseEvents` json AFTER `totalDeaths`,
  ADD COLUMN `championUserId` int AFTER `activeUniverseEvents`,
  ADD COLUMN `closedAt` timestamp NULL AFTER `championUserId`;
--> statement-breakpoint

ALTER TABLE `circuit_leaderboard`
  ADD COLUMN `claimedTiers` json AFTER `clonesLost`,
  ADD COLUMN `severancePrizeClaimed` int NOT NULL DEFAULT 0 AFTER `claimedTiers`;
--> statement-breakpoint

CREATE TABLE `circuit_clones` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `seasonId` int NOT NULL,
  `designation` varchar(64) NOT NULL,
  `neuralSync` int NOT NULL DEFAULT 80,
  `velocityCeilingPct` int NOT NULL DEFAULT 100,
  `surfaceGripPct` int NOT NULL DEFAULT 60,
  `survivalInstinct` int NOT NULL DEFAULT 25,
  `chassisColor` varchar(16) NOT NULL DEFAULT '#f5f0e8',
  `racesRun` int NOT NULL DEFAULT 0,
  `killsScored` int NOT NULL DEFAULT 0,
  `status` enum('active','dead','severed') NOT NULL DEFAULT 'active',
  `veteranNoted` int NOT NULL DEFAULT 0,
  `bornAt` timestamp NOT NULL DEFAULT (now()),
  `diedAt` timestamp NULL,
  CONSTRAINT `circuit_clones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint

CREATE INDEX `idx_circuit_clones_user_season` ON `circuit_clones` (`userId`, `seasonId`);
--> statement-breakpoint
CREATE INDEX `idx_circuit_clones_status` ON `circuit_clones` (`status`);
--> statement-breakpoint

CREATE TABLE `circuit_identity_chains` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `studentName` varchar(64),
  `seekerName` varchar(64),
  `detectiveName` varchar(64),
  `lastName` varchar(64),
  `slotsCompleted` int NOT NULL DEFAULT 0,
  `loredexEntryId` int,
  `completedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `circuit_identity_chains_id` PRIMARY KEY(`id`),
  CONSTRAINT `circuit_identity_chains_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint

CREATE TABLE `circuit_side_quest_progress` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `seasonId` int NOT NULL,
  `questKey` varchar(64) NOT NULL,
  `progress` int NOT NULL DEFAULT 0,
  `target` int NOT NULL,
  `completed` int NOT NULL DEFAULT 0,
  `claimed` int NOT NULL DEFAULT 0,
  `cpAwarded` int NOT NULL DEFAULT 0,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `circuit_side_quest_progress_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_circuit_sq_user_season_quest` UNIQUE(`userId`, `seasonId`, `questKey`)
);
