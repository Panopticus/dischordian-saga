-- Support impersonation grants (migration 0069).
-- Short-lived, audited grants that let an admin act as a user to
-- reproduce bugs / handle complex tickets. Burn-after-redeem.

CREATE TABLE IF NOT EXISTS `support_impersonation_grants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `issuedToAdminId` INT NOT NULL,
  `targetUserId` INT NOT NULL,
  `reason` VARCHAR(512) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` TIMESTAMP NOT NULL,
  `usedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `idx_support_grants_admin` (`issuedToAdminId`),
  KEY `idx_support_grants_target` (`targetUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
