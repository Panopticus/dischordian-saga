CREATE TABLE `pvp_decks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`faction` enum('architect','dreamer') NOT NULL,
	`cardIds` json NOT NULL,
	`isActive` int NOT NULL DEFAULT 0,
	`cardCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvp_decks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pvp_season_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`seasonId` int NOT NULL,
	`peakElo` int NOT NULL DEFAULT 1000,
	`finalElo` int NOT NULL DEFAULT 1000,
	`peakTier` enum('bronze','silver','gold','platinum','diamond','master','grandmaster') NOT NULL DEFAULT 'bronze',
	`seasonWins` int NOT NULL DEFAULT 0,
	`seasonLosses` int NOT NULL DEFAULT 0,
	`bestStreak` int NOT NULL DEFAULT 0,
	`rewardsClaimed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvp_season_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pvp_seasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonNumber` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`isActive` int NOT NULL DEFAULT 0,
	`rewards` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pvp_seasons_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvp_seasons_seasonNumber_unique` UNIQUE(`seasonNumber`)
);
