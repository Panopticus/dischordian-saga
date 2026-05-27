-- Migration 0058 — pvp_ratings
--
-- Persistent MMR + seasonal rank for the PvP card ladder (#7 from
-- the AAA review roadmap). Pure season-reset destroys long-term
-- aspiration; Hearthstone / MTG Arena keep a hidden MMR alongside
-- the visible seasonal rank for a reason. This table mirrors that:
--
--   - `mmr` — hidden, persistent ELO score. Drives matchmaking
--     across seasons. Seeds new seasons (so a strong player from
--     season 1 doesn't restart at gold-3 in season 2).
--   - `seasonRank` — visible cosmetic rank. Resets every season so
--     each season has its own ladder narrative.
--   - `peakMmr` — the highest MMR the player has ever achieved.
--     Persistent badge; informs reward tiers.
--
-- This migration is hand-written. It is orphaned from `_journal.json`
-- following the existing pattern for new migrations under the journal-
-- drift situation (see apps/db/README.md §"Known journal drift"); the
-- matching startup bootstrap is `bootstrapPvpRatingsTable()` in
-- apps/server/services/pvpRatingsBootstrap.ts.
--
-- Idempotent: every statement uses `IF NOT EXISTS`, so re-running on
-- a database that already has the table is a no-op.

CREATE TABLE IF NOT EXISTS `pvp_ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `gameType` VARCHAR(50) NOT NULL,
  `mmr` INT NOT NULL DEFAULT 1200,
  `seasonId` INT NOT NULL DEFAULT 1,
  `seasonRank` INT NOT NULL DEFAULT 0,
  `seasonWins` INT NOT NULL DEFAULT 0,
  `seasonLosses` INT NOT NULL DEFAULT 0,
  `peakMmr` INT NOT NULL DEFAULT 1200,
  `lastMatchAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pvp_ratings_user_game` (`userId`, `gameType`),
  INDEX `idx_pvp_ratings_leaderboard` (`gameType`, `mmr` DESC),
  INDEX `idx_pvp_ratings_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
