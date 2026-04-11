-- Task — Guild Hall persistence fix + Guild Events system.
--
-- The existing guild_hall router wrote to nonexistent columns via
-- `(guild as any).hallTier` / `.hallData` / `.treasury`, which crashed
-- at runtime. This migration:
--
--   1. Adds `hallTier` and `hallData` to the guilds table so the hall
--      router actually persists state. The router already uses the
--      existing `treasuryDream` column as the hall funding pool, so no
--      separate `treasury` column is needed.
--
--   2. Creates `guild_events` + `guild_event_attendance` to back the
--      new Guild Events system (scheduled raids, tournaments, roleplay
--      nights, etc.), with RSVPs and check-in tracking.

ALTER TABLE `guilds`
  ADD COLUMN `hallTier` INT NOT NULL DEFAULT 1,
  ADD COLUMN `hallData` JSON DEFAULT NULL;

CREATE TABLE `guild_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `guildId` INT NOT NULL,
  `createdBy` INT NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `eventType` ENUM(
    'raid', 'tournament', 'pvp_practice', 'roleplay', 'lore_night',
    'recruitment_drive', 'trade_fair', 'training', 'social', 'other'
  ) NOT NULL DEFAULT 'social',
  `startsAt` TIMESTAMP NOT NULL,
  `endsAt` TIMESTAMP NOT NULL,
  `maxAttendees` INT NOT NULL DEFAULT 0,
  `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  `locationRoomId` VARCHAR(64) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX `idx_guild_events_guild_id`  ON `guild_events` (`guildId`);
CREATE INDEX `idx_guild_events_starts_at` ON `guild_events` (`startsAt`);
CREATE INDEX `idx_guild_events_status`    ON `guild_events` (`status`);

CREATE TABLE `guild_event_attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `eventId` INT NOT NULL,
  `userId` INT NOT NULL,
  `rsvpStatus` ENUM('going', 'maybe', 'declined') NOT NULL DEFAULT 'going',
  `checkedInAt` TIMESTAMP NULL DEFAULT NULL,
  `rsvpAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX       `idx_guild_event_attendance_event_id`     ON `guild_event_attendance` (`eventId`);
CREATE INDEX       `idx_guild_event_attendance_user_id`      ON `guild_event_attendance` (`userId`);
CREATE UNIQUE INDEX `uniq_guild_event_attendance_event_user` ON `guild_event_attendance` (`eventId`, `userId`);
