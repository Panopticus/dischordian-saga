-- Phase: Casino per-game wins counter + ticker suppression flag
--
-- Follow-up to 0038. Adds a gamesWon JSON column on casino_state so
-- achievements like liars_champion / faction_prophet / gauntlet_master
-- can count wins (not attempts), and enough bookkeeping columns to
-- handle the new "tale collector" server-authoritative tale drops.

ALTER TABLE `casino_state`
  ADD COLUMN `gamesWon` JSON DEFAULT NULL,
  ADD COLUMN `consecutiveFactionWins` INT NOT NULL DEFAULT 0,
  ADD COLUMN `consecutiveGauntletWins` INT NOT NULL DEFAULT 0;

-- Seed the new feature flag so admins can suppress the holiday ticker
-- without disabling the whole event.
INSERT INTO `feature_flags` (`featureName`, `enabled`) VALUES
  ('xmas_july_ticker', 1)
ON DUPLICATE KEY UPDATE `enabled` = VALUES(`enabled`);
