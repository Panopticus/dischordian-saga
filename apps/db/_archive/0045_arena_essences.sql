-- Arena Essences — The Collector's Ledger
--
-- Adds the `arena_essences` table backing the Collectors Arena
-- essence harvest trophy system. One row per (userId, fighterId).
--
--   count            — total times this fighter has been defeated
--   bestRarity       — highest rarity seen across all harvests
--                      (never downgraded; maxRarity() in the router
--                      ensures one-directional movement)
--   firstHarvestedAt — first time the player ever harvested this
--                      fighter's essence
--   lastHarvestedAt  — most recent harvest — powers the "recent
--                      drops" UI in the Collector's Ledger page
--
-- Rarity derivation (see apps/client/src/game/essenceHarvest.ts):
--   easy      → common
--   normal    → rare
--   hard      → epic
--   nightmare → legendary
--   perfect   → +1 rank (capped at mythic)
--
-- The unique index on (userId, fighterId) lets the server use an
-- UPSERT-style pattern (insert, catch duplicate, update count +
-- bestRarity) without racing against concurrent harvests.

CREATE TABLE `arena_essences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `fighterId` VARCHAR(128) NOT NULL,
  `count` INT NOT NULL DEFAULT 0,
  `bestRarity` ENUM('common','rare','epic','legendary','mythic') NOT NULL DEFAULT 'common',
  `firstHarvestedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastHarvestedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_arena_essences_user_fighter` (`userId`, `fighterId`),
  KEY `idx_arena_essences_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
