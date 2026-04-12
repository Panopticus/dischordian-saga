-- TCG #15 — Premium currency ("gems")
--
-- Dream was the only player-side currency so far. Gems are the hard
-- premium currency used for time-saver purchases and exclusive cosmetics.
-- Stored on dream_balance because that table already scopes per-user
-- resource columns and participates in the same rollup triggers.

ALTER TABLE `dream_balance`
  ADD COLUMN `gems` INT NOT NULL DEFAULT 0 AFTER `dnaCode`,
  ADD COLUMN `totalGemsPurchased` INT NOT NULL DEFAULT 0 AFTER `gems`;
