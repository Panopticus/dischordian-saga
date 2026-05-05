-- ─────────────────────────────────────────────────────────────────
-- User agreements: GDPR Art. 7 demonstrable-consent record.
--
-- One row per (user, agreement type, version). Re-acceptance of the
-- same version is a no-op (UNIQUE constraint).
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user_agreements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `agreementType` VARCHAR(64) NOT NULL,
  `version` VARCHAR(32) NOT NULL,
  `agreedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipHash` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_agreement_version` (`userId`, `agreementType`, `version`),
  KEY `idx_user_agreements_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
