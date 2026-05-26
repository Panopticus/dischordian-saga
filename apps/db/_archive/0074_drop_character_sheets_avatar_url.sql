-- ─────────────────────────────────────────────────────────────────
-- Drop `avatarUrl` from `characterSheets`.
-- Orphan column flagged by the schema.no_orphan_columns gate; never
-- read by any router or UI.
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE `characterSheets` DROP COLUMN `avatarUrl`;
