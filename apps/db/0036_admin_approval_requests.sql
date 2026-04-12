-- Task #7 — Architect console: moderator tier + two-admin approval flow
--
-- Adds a `moderator` tier to the users.role enum and creates the
-- admin_approval_requests table that backs the two-admin approval
-- workflow for economy-affecting actions (setFeatureFlag etc.).
--
-- A moderator can submit a request to change a flag or economy knob
-- via architectConsole.requestFeatureFlag. The request sits in
-- `pending` status until two DISTINCT admins approve it, at which
-- point the dispatcher applies the change and the row flips to
-- `executed`. Any admin can reject at any time.
--
-- Existing rows with role='user' or role='admin' are untouched by
-- the enum widening; MySQL preserves their values.

ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user';

CREATE TABLE `admin_approval_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `requestedBy` INT NOT NULL,
  `action` VARCHAR(64) NOT NULL,
  `targetKey` VARCHAR(128) NOT NULL,
  `newValue` JSON DEFAULT NULL,
  `reason` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'executed', 'rejected') NOT NULL DEFAULT 'pending',
  `approvals` JSON NOT NULL,
  `rejectedBy` INT DEFAULT NULL,
  `rejectionReason` TEXT DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `executedAt` TIMESTAMP NULL DEFAULT NULL,
  `rejectedAt` TIMESTAMP NULL DEFAULT NULL
);

CREATE INDEX `idx_admin_approval_status`
  ON `admin_approval_requests` (`status`);

CREATE INDEX `idx_admin_approval_requested_by`
  ON `admin_approval_requests` (`requestedBy`);

CREATE INDEX `idx_admin_approval_created_at`
  ON `admin_approval_requests` (`createdAt`);
