-- ─────────────────────────────────────────────────────────────────
-- Pet Breeding (docs/production/BREEDING_SYSTEM_ART_PROMPTS.md).
-- Pair-based breeding queue; offspring traits resolved at completion.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `pet_breeding_pairs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `parentAId` INT NOT NULL,
  `parentBId` INT NOT NULL,
  `status` ENUM('queued','incubating','ready','claimed','cancelled') NOT NULL DEFAULT 'queued',
  `queuedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startedAt` TIMESTAMP NULL,
  `readyAt` TIMESTAMP NULL,
  `offspringPayload` JSON,
  CONSTRAINT `pet_breeding_pairs_id` PRIMARY KEY(`id`),
  CONSTRAINT `pet_breeding_pairs_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `byUserStatus` (`userId`, `status`)
);
