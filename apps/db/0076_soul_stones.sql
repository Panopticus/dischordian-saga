-- ─────────────────────────────────────────────────────────────────
-- Soul Stones (docs/design/SOUL_STONES_SYSTEM.md).
-- Per-player counts of soul-stone fragments by state (violet/red/gold)
-- with a weekly soft-cap accumulator for combat sources.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `soul_stones` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `violetCount` INT NOT NULL DEFAULT 0,
  `redCount` INT NOT NULL DEFAULT 0,
  `goldCount` INT NOT NULL DEFAULT 0,
  `lifetimeCollected` INT NOT NULL DEFAULT 0,
  `weeklyCollected` INT NOT NULL DEFAULT 0,
  `weekResetAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `soul_stones_id` PRIMARY KEY(`id`),
  CONSTRAINT `soul_stones_userId_unique` UNIQUE(`userId`),
  CONSTRAINT `soul_stones_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
