-- ─────────────────────────────────────────────────────────────────
-- Cohort columns on users (G27).
-- - signupWeek: ISO-week identifier ("2026-W18") for cohort filters.
-- - installSource: organic / paid / referral / partner.
-- - abVariant: A/B variant assignment at signup time.
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE `users`
  ADD COLUMN `signupWeek` VARCHAR(8) NULL,
  ADD COLUMN `installSource` VARCHAR(32) NULL,
  ADD COLUMN `abVariant` VARCHAR(64) NULL,
  ADD INDEX `idx_users_signup_week` (`signupWeek`);

-- Backfill signupWeek for existing rows from createdAt.
UPDATE `users`
SET `signupWeek` = DATE_FORMAT(`createdAt`, '%x-W%v')
WHERE `signupWeek` IS NULL;
