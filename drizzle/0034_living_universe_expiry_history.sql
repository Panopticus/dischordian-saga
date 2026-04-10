-- Living Universe Task 1.2: event expiry, player participation, history archive
--
-- Adds three columns to universe_event_state so events can expire on a
-- schedule and we can track how many players pitched in, plus a new
-- universe_event_history table that is an append-only log of every
-- resolved Living Universe event.

ALTER TABLE `universe_event_state`
  ADD COLUMN `expiresAt` timestamp NULL AFTER `activatedAt`;

ALTER TABLE `universe_event_state`
  ADD COLUMN `playerParticipation` int NOT NULL DEFAULT 0 AFTER `resolvedAt`;

CREATE TABLE `universe_event_history` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventId` varchar(64) NOT NULL,
  `activatedAt` timestamp NOT NULL,
  `resolvedAt` timestamp NOT NULL DEFAULT (now()),
  `resolution` varchar(32) NOT NULL,
  `finalPressureScore` int NOT NULL DEFAULT 0,
  `totalParticipants` int NOT NULL DEFAULT 0,
  `effectsSummary` json,
  CONSTRAINT `universe_event_history_id` PRIMARY KEY(`id`)
);

CREATE INDEX `idx_universe_history_event` ON `universe_event_history` (`eventId`);
CREATE INDEX `idx_universe_history_resolved` ON `universe_event_history` (`resolvedAt`);
