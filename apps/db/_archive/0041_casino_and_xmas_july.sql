-- Phase: Degen's Casino + Christmas in July
--
-- Adds server-authoritative tables so casino gameplay and the
-- Christmas in July event can persist to the database instead of
-- localStorage. Pairs with the schema additions in schema.ts and
-- the new casino/christmasInJuly tRPC routers.

-- ──────────────────────────────────────────────────────────
-- Degen's Casino
-- ──────────────────────────────────────────────────────────

CREATE TABLE `casino_state` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL UNIQUE,
  `totalWagered` INT NOT NULL DEFAULT 0,
  `totalWon` INT NOT NULL DEFAULT 0,
  `sessionWins` INT NOT NULL DEFAULT 0,
  `sessionLosses` INT NOT NULL DEFAULT 0,
  `vipLevel` INT NOT NULL DEFAULT 0,
  `freeSpinsLeft` INT NOT NULL DEFAULT 3,
  `jackpotContribution` INT NOT NULL DEFAULT 0,
  `scratchCards` INT NOT NULL DEFAULT 0,
  `currentStreak` INT NOT NULL DEFAULT 0,
  `bestStreak` INT NOT NULL DEFAULT 0,
  `degenFavor` INT NOT NULL DEFAULT 0,
  `totalBetsPlaced` INT NOT NULL DEFAULT 0,
  `collectedTales` JSON DEFAULT NULL,
  `gamesPlayed` JSON DEFAULT NULL,
  `casesSinceRarePlus` INT NOT NULL DEFAULT 0,
  `dailyWagered` INT NOT NULL DEFAULT 0,
  `dailyCounterDate` VARCHAR(10) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_casino_state_user` ON `casino_state` (`userId`);
--> statement-breakpoint

CREATE TABLE `casino_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `game` VARCHAR(64) NOT NULL,
  `bet` INT NOT NULL,
  `won` BOOLEAN NOT NULL DEFAULT FALSE,
  `payout` INT NOT NULL DEFAULT 0,
  `jackpot` BOOLEAN NOT NULL DEFAULT FALSE,
  `detail` JSON DEFAULT NULL,
  `seed` VARCHAR(64) DEFAULT NULL,
  `playedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_casino_results_user` ON `casino_results` (`userId`);
--> statement-breakpoint
CREATE INDEX `idx_casino_results_game` ON `casino_results` (`game`);
--> statement-breakpoint
CREATE INDEX `idx_casino_results_played_at` ON `casino_results` (`playedAt`);
--> statement-breakpoint

-- ──────────────────────────────────────────────────────────
-- Christmas in July — event progress, gifts, charity
-- ──────────────────────────────────────────────────────────

CREATE TABLE `xmas_july_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL UNIQUE,
  `festiveTokens` INT NOT NULL DEFAULT 0,
  `giftsSent` INT NOT NULL DEFAULT 0,
  `giftsReceived` INT NOT NULL DEFAULT 0,
  `completedDays` JSON DEFAULT NULL,
  `streak` INT NOT NULL DEFAULT 0,
  `lastDayClaimed` INT DEFAULT NULL,
  `stonesWagered` INT NOT NULL DEFAULT 0,
  `stonesWon` INT NOT NULL DEFAULT 0,
  `blessedPurifications` INT NOT NULL DEFAULT 0,
  `snowflakeStones` INT NOT NULL DEFAULT 0,
  `giftBoxesOwned` INT NOT NULL DEFAULT 0,
  `lastDailyTokenClaim` VARCHAR(10) DEFAULT NULL,
  `charityMultiplierRemaining` INT NOT NULL DEFAULT 0,
  `unlockedRewards` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_xmas_july_progress_user` ON `xmas_july_progress` (`userId`);
--> statement-breakpoint

CREATE TABLE `xmas_july_gifts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `senderId` INT NOT NULL,
  `recipientId` INT NOT NULL,
  `giftType` VARCHAR(64) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `claimed` BOOLEAN NOT NULL DEFAULT FALSE,
  `sentAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `claimedAt` TIMESTAMP NULL DEFAULT NULL
);
--> statement-breakpoint

CREATE INDEX `idx_xmas_july_gifts_sender` ON `xmas_july_gifts` (`senderId`);
--> statement-breakpoint
CREATE INDEX `idx_xmas_july_gifts_recipient` ON `xmas_july_gifts` (`recipientId`);
--> statement-breakpoint

CREATE TABLE `xmas_july_charity_pool` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `eventKey` VARCHAR(64) NOT NULL UNIQUE,
  `totalGifts` INT NOT NULL DEFAULT 0,
  `totalTokensDonated` INT NOT NULL DEFAULT 0,
  `communityPool` INT NOT NULL DEFAULT 0,
  `milestonesReached` JSON DEFAULT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE TABLE `xmas_july_craps_rolls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `total` INT NOT NULL,
  `die1` INT NOT NULL,
  `die2` INT NOT NULL,
  `outcome` VARCHAR(32) NOT NULL,
  `stoneId` VARCHAR(64) DEFAULT NULL,
  `rolledAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_xmas_july_craps_user` ON `xmas_july_craps_rolls` (`userId`);
--> statement-breakpoint

CREATE TABLE `xmas_july_wheel_spins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `prizeId` VARCHAR(64) NOT NULL,
  `prizeType` VARCHAR(32) NOT NULL,
  `amount` INT NOT NULL DEFAULT 0,
  `rarity` VARCHAR(16) NOT NULL DEFAULT 'common',
  `spunAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_xmas_july_wheel_user` ON `xmas_july_wheel_spins` (`userId`);
--> statement-breakpoint

-- Seed the charity pool row for the 2026 event so the backend can
-- rely on a single row existing.
INSERT INTO `xmas_july_charity_pool` (`eventKey`, `totalGifts`, `totalTokensDonated`, `communityPool`, `milestonesReached`)
VALUES ('christmas_in_july_2026', 0, 0, 0, JSON_ARRAY());
--> statement-breakpoint

-- Register feature flags so the casino and event routers can be
-- toggled via admin console without redeploy.
INSERT INTO `feature_flags` (`featureName`, `enabled`) VALUES
  ('casino', 1),
  ('christmas_in_july', 1)
ON DUPLICATE KEY UPDATE `enabled` = VALUES(`enabled`);
