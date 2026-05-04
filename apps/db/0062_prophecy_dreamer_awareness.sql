-- ════════════════════════════════════════════════════════════════
-- 0062_prophecy_dreamer_awareness.sql
--
-- Pairs the prophecy schema additions in apps/db/schema.ts that
-- shipped in PR #375. The dreamer_awareness table grows nine new
-- columns that back the prophecy queue, the Antiquarian's Index,
-- and the Witness ladder.
--
-- Hand-written following the convention established by
-- 0061_pvp_overhaul.sql:
--   - Idempotent (each ADD COLUMN guarded by an INFORMATION_SCHEMA
--     existence check) so re-running on partially-applied DBs is
--     safe.
--   - MySQL 8.x compatible (no IF NOT EXISTS on ALTER TABLE ADD
--     COLUMN; prepared-statement pattern works around it).
--
-- Columns added:
--   prophecyVisionsReceived      json  — marquees delivered ≥ 1×
--   pendingMarqueeIds            json  — queued, not yet drained
--   prophecyVisionsCompleted     json  — marquees watched in full
--   unlockedWhisperIds           json  — whispers in the Index
--   viewedWhisperIds             json  — Index full-watches
--   albumFilmsCompleted          json  — album-as-film end-to-end
--   albumFilmBookmarks           json  — { albumSlug: trackId }
--   prophecyAchievementsGranted  json  — Witness ladder grants
--   lastMarqueePlayedAt          timestamp — ≤ 1/session pacing
--
-- The runtime null-coalesces every column to [] / {} / null, so
-- a partially-applied DB never crashes — it just skips features
-- whose backing columns aren't there yet.
-- ════════════════════════════════════════════════════════════════

-- prophecyVisionsReceived
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'prophecyVisionsReceived'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `prophecyVisionsReceived` json AFTER `visionsReceived`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- pendingMarqueeIds
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'pendingMarqueeIds'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `pendingMarqueeIds` json AFTER `prophecyVisionsReceived`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- prophecyVisionsCompleted
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'prophecyVisionsCompleted'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `prophecyVisionsCompleted` json AFTER `pendingMarqueeIds`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- unlockedWhisperIds
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'unlockedWhisperIds'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `unlockedWhisperIds` json AFTER `prophecyVisionsCompleted`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- viewedWhisperIds
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'viewedWhisperIds'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `viewedWhisperIds` json AFTER `unlockedWhisperIds`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- albumFilmsCompleted
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'albumFilmsCompleted'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `albumFilmsCompleted` json AFTER `viewedWhisperIds`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- albumFilmBookmarks
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'albumFilmBookmarks'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `albumFilmBookmarks` json AFTER `albumFilmsCompleted`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- prophecyAchievementsGranted
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'prophecyAchievementsGranted'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `prophecyAchievementsGranted` json AFTER `albumFilmBookmarks`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- lastMarqueePlayedAt
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dreamer_awareness'
    AND COLUMN_NAME = 'lastMarqueePlayedAt'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `dreamer_awareness` ADD COLUMN `lastMarqueePlayedAt` timestamp NULL AFTER `prophecyAchievementsGranted`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
