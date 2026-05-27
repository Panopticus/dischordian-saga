-- ─────────────────────────────────────────────────────────────────
-- User sessions — track active refresh-token jtis per device so
-- users can list active sessions and force-revoke any that aren't
-- theirs.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `refreshTokenJti` VARCHAR(64) NOT NULL,
  `deviceLabel` VARCHAR(256) NULL,
  `ipHash` VARCHAR(64) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUsedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revokedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_sessions_jti` (`refreshTokenJti`),
  KEY `idx_user_sessions_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
