-- ─────────────────────────────────────────────────────────────────
-- Player-to-player blocks. (blocker → blocked) directed edges.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user_blocks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `blockerUserId` INT NOT NULL,
  `blockedUserId` INT NOT NULL,
  `reason` VARCHAR(256) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_block_pair` (`blockerUserId`, `blockedUserId`),
  KEY `idx_user_blocks_blocker` (`blockerUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
