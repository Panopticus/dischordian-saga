-- Memory Energy — Act 2 / Act 3 Trade Empire currency.
--
-- Memory Energy fuels the Engineer's Bench. Starting cap is 50;
-- clearing Act 2 lifts the cap to 200 via the `trade_empire_unlocked`
-- narrative flag, which is also the canonical gate for Act 3 Trade
-- Empire content. This table is the server-authoritative balance
-- so client-side manipulation can't float ahead of what the player
-- has actually earned.
--
-- Earn sources (see apps/shared/memoryEnergy.ts MEMORY_ENERGY_EARN_RATES):
--   - cardBattleWin      +2
--   - chessWin           +1
--   - arenaWin           +3
--   - recordingDiscovery +10
--   - dailyBriefClaim    +1
--
-- Spend sources: crafting recipes (costs by rarity, see memoryEnergy.ts
-- MEMORY_ENERGY_COSTS).
--
-- Migration numbering: 0053, following 0052 (chess_game_reviews).

CREATE TABLE `memory_energy_balance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  /** Current Memory Energy reserve (clamped 0..cap, cap derived from flags). */
  `memoryEnergy` INT NOT NULL DEFAULT 15,
  /** Lifetime Memory Energy earned (for milestones). */
  `totalEarned` INT NOT NULL DEFAULT 0,
  /** Lifetime Memory Energy spent on crafts (for milestones). */
  `totalSpent` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX `idx_memory_energy_balance_user_id`
  ON `memory_energy_balance` (`userId`);
