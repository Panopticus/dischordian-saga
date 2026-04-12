-- Daily Brief System: daily_briefs, pressure_events, universe_event_state, room_states

CREATE TABLE `daily_briefs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `briefDate` varchar(10) NOT NULL,
  `events` json NOT NULL,
  `completedEvents` json,
  `results` json,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `daily_briefs_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_daily_brief_user_date` UNIQUE(`userId`, `briefDate`)
);

CREATE INDEX `idx_daily_brief_date` ON `daily_briefs` (`briefDate`);

CREATE TABLE `pressure_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `pressureType` varchar(64) NOT NULL,
  `amount` int NOT NULL DEFAULT 1,
  `source` varchar(128) NOT NULL,
  `metadata` json,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `pressure_events_id` PRIMARY KEY(`id`)
);

CREATE INDEX `idx_pressure_type` ON `pressure_events` (`pressureType`);
CREATE INDEX `idx_pressure_created` ON `pressure_events` (`createdAt`);
CREATE INDEX `idx_pressure_user` ON `pressure_events` (`userId`);

CREATE TABLE `universe_event_state` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventId` varchar(64) NOT NULL,
  `isActive` int NOT NULL DEFAULT 0,
  `pressureScore` int NOT NULL DEFAULT 0,
  `activatedAt` timestamp,
  `resolvedAt` timestamp,
  `occurrenceCount` int NOT NULL DEFAULT 0,
  `cycleData` json,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `universe_event_state_id` PRIMARY KEY(`id`),
  CONSTRAINT `universe_event_state_eventId_unique` UNIQUE(`eventId`)
);

CREATE TABLE `room_states` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `roomId` varchar(64) NOT NULL,
  `visualTier` int NOT NULL DEFAULT 0,
  `damageLevel` int NOT NULL DEFAULT 0,
  `craftCount` int NOT NULL DEFAULT 0,
  `quarantineCount` int NOT NULL DEFAULT 0,
  `crewAssigned` json,
  `decorations` json,
  `roomData` json,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `room_states_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_room_state_user_room` UNIQUE(`userId`, `roomId`)
);

CREATE INDEX `idx_room_state_user` ON `room_states` (`userId`);
