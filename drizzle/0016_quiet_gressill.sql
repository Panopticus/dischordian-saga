CREATE TABLE `war_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sectorId` int NOT NULL,
	`faction` enum('empire','insurgency') NOT NULL,
	`actionType` enum('capture','defend','reinforce','sabotage','trade','build') NOT NULL,
	`points` int NOT NULL DEFAULT 1,
	`seasonId` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `war_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `war_seasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonNumber` int NOT NULL DEFAULT 1,
	`name` varchar(256) NOT NULL DEFAULT 'The First Conflict',
	`winner` enum('empire','insurgency'),
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`rewards` json,
	CONSTRAINT `war_seasons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `war_territories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectorId` int NOT NULL,
	`faction` enum('empire','insurgency'),
	`controlPoints` int NOT NULL DEFAULT 50,
	`contestCount` int NOT NULL DEFAULT 0,
	`seasonId` int NOT NULL DEFAULT 1,
	`lastCaptured` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `war_territories_id` PRIMARY KEY(`id`)
);
