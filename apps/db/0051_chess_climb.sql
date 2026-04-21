-- Chess Climb — escalating stakes ladder persistence.
--
-- Two tables:
--   `chess_climb_runs` — one row per best-of-3 series. Stores the
--     tier, the three game results (null if unplayed), the final
--     outcome, and which stakes were applied. Historical record of
--     every climb attempt. Lets the corrupted GM cite specifics
--     ("you have refused 31 of 40 draws offered to you in this
--     universe") at later tiers.
--
--   `chess_climb_unlocks` — one row per user, recording the
--     highest tier rank they have cleared. Tier 0 does not
--     require a row (everyone is unlocked at rank -1 by default).
--     Rows are inserted/updated when a user clears a tier.
--
-- Migration numbering: 0051 because 0044-0047 each have two files
-- (parallel branches) and 0050 was just used for player_profile.
-- This migration follows the same orphan convention as
-- 0043_chess_persistence.sql.

CREATE TABLE `chess_climb_runs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `tierRank` INT NOT NULL,
  `tierId` VARCHAR(64) NOT NULL,
  `game1Result` ENUM('win', 'loss', 'draw') DEFAULT NULL,
  `game2Result` ENUM('win', 'loss', 'draw') DEFAULT NULL,
  `game3Result` ENUM('win', 'loss', 'draw') DEFAULT NULL,
  `outcome` ENUM('ongoing', 'won', 'lost', 'abandoned') NOT NULL DEFAULT 'ongoing',
  `stakesApplied` JSON NULL,
  `startedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finishedAt` TIMESTAMP NULL DEFAULT NULL
);

CREATE INDEX `idx_chess_climb_runs_user`
  ON `chess_climb_runs` (`userId`);
CREATE INDEX `idx_chess_climb_runs_user_tier`
  ON `chess_climb_runs` (`userId`, `tierRank`);
CREATE INDEX `idx_chess_climb_runs_user_outcome`
  ON `chess_climb_runs` (`userId`, `outcome`);

CREATE TABLE `chess_climb_unlocks` (
  `userId` INT NOT NULL PRIMARY KEY,
  `highestClearedRank` INT NOT NULL DEFAULT -1,
  `tier2LockoutUntil` TIMESTAMP NULL DEFAULT NULL,
  `lastUpdatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
