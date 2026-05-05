-- Phase: Casino cosmetic inventory + jackpot broadcasts
--
-- Follow-up to 0043. Adds the cosmetic inventory column so
-- achievements with unlockReward strings have somewhere to land,
-- plus a broadcast flag on casinoJackpotPool so the router can
-- mark the most recent claim as "already broadcast".

ALTER TABLE `casino_state`
  ADD COLUMN `casinoUnlockedRewards` JSON DEFAULT NULL;
--> statement-breakpoint

ALTER TABLE `casino_jackpot_pool`
  ADD COLUMN `lastBroadcastAt` TIMESTAMP NULL DEFAULT NULL;
--> statement-breakpoint

ALTER TABLE `xmas_july_progress`
  ADD COLUMN `dangerResolutions` JSON DEFAULT NULL;
