-- Phase: Degen's Casino + Christmas in July — refinements
--
-- Follow-up to 0037: adds the progressive jackpot pool, the
-- giftsSentToday/tokensSpent counters for accurate daily challenge
-- resolution, and the gift-send rate-limit state.

-- ──────────────────────────────────────────────────────────
-- Casino progressive jackpot pool
-- ──────────────────────────────────────────────────────────

CREATE TABLE `casino_jackpot_pool` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `poolKey` VARCHAR(32) NOT NULL UNIQUE,
  `balance` INT NOT NULL DEFAULT 0,
  `totalPaidOut` INT NOT NULL DEFAULT 0,
  `lastWinnerId` INT DEFAULT NULL,
  `lastWinAt` TIMESTAMP NULL DEFAULT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

INSERT INTO `casino_jackpot_pool` (`poolKey`, `balance`, `totalPaidOut`) VALUES ('main', 0, 0);
--> statement-breakpoint

-- ──────────────────────────────────────────────────────────
-- Christmas in July — additional counters
-- ──────────────────────────────────────────────────────────

ALTER TABLE `xmas_july_progress`
  ADD COLUMN `giftsSentToday` INT NOT NULL DEFAULT 0,
  ADD COLUMN `giftCounterDate` VARCHAR(10) DEFAULT NULL,
  ADD COLUMN `tokensSpent` INT NOT NULL DEFAULT 0,
  ADD COLUMN `tokensSpentToday` INT NOT NULL DEFAULT 0;
