-- Task — Personal Quarters polish:
--   1. Companion-visit history (new quarter_companion_visits table).
--   2. Featured-gallery support (screenshotUrl + isFeatured columns
--      on player_quarters + index).
--
-- Both additions are purely additive — no backfill required.

CREATE TABLE `quarter_companion_visits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ownerId` INT NOT NULL,
  `companionId` VARCHAR(64) NOT NULL,
  `dialogIndex` INT NOT NULL DEFAULT 0,
  `visitedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `idx_quarter_companion_visits_owner_id`   ON `quarter_companion_visits` (`ownerId`);
CREATE INDEX `idx_quarter_companion_visits_visited_at` ON `quarter_companion_visits` (`visitedAt`);

ALTER TABLE `player_quarters`
  ADD COLUMN `screenshotUrl` VARCHAR(512) DEFAULT NULL,
  ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX `idx_player_quarters_featured` ON `player_quarters` (`isFeatured`);
