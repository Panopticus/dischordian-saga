-- Title-screen broadcasts — "Intercepted Transmissions"
--
-- Adds the two tables that back the Broadcast Ticker, Broadcast Panel,
-- and pop-out Video Transmission player on the reworked Title page:
--
--   announcements       — authored content (cards + video metadata)
--   announcement_views  — per-user first-seen / dismissed tracking
--
-- Written hand-idempotent: every CREATE uses IF NOT EXISTS so the file
-- is safe to re-run against DBs where a partial deploy applied it, and
-- against fresh DBs that will pick it up via drizzle-kit generate drift
-- detection. No existing columns or tables are altered.
--
-- Orphaned from _journal.json on purpose — follows the same convention
-- as 0036..0048 (see apps/db/README.md §"Known journal drift").

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(128) NOT NULL,
  `category` ENUM('ark_alert','transmission_incoming','archival_footage','overlay')
    NOT NULL DEFAULT 'transmission_incoming',
  `priority` ENUM('normal','high') NOT NULL DEFAULT 'normal',
  `title` VARCHAR(256) NOT NULL,
  `body` TEXT,
  `artUrl` VARCHAR(512),
  `linkUrl` VARCHAR(512),
  `videoUrl` VARCHAR(512),
  `videoPosterUrl` VARCHAR(512),
  `videoDurationSec` INT,
  `triggerOnTitle` BOOLEAN NOT NULL DEFAULT FALSE,
  `triggerProbability` INT NOT NULL DEFAULT 100,
  `audience` ENUM('all','unauth','authed','act_ge_3','light_aligned','dark_aligned')
    NOT NULL DEFAULT 'all',
  `publishedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_announcements_slug` (`slug`),
  INDEX `idx_announcements_published` (`publishedAt`),
  INDEX `idx_announcements_audience` (`audience`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `announcement_views` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `announcementId` INT NOT NULL,
  `firstSeenAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dismissedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_announcement_views_user_ann` (`userId`, `announcementId`),
  INDEX `idx_announcement_views_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
