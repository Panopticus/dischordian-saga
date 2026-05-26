-- ─────────────────────────────────────────────────────────────────
-- User 2FA — TOTP secret + hashed backup codes (one row per user).
-- Required for admin role; optional for regular users.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user_two_factor` (
  `userId` INT NOT NULL,
  `secret` VARCHAR(64) NOT NULL,
  `backupCodeHashes` JSON NOT NULL,
  `confirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  `enrolledAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmedAt` TIMESTAMP NULL,
  `lastUsedAt` TIMESTAMP NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
