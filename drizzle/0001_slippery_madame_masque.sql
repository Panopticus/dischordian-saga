CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`achievementId` varchar(128) NOT NULL,
	`franchiseId` varchar(64) NOT NULL DEFAULT 'dischordian-saga',
	`name` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(32) NOT NULL DEFAULT 'trophy',
	`category` varchar(64) NOT NULL,
	`tier` enum('bronze','silver','gold','platinum','legendary') NOT NULL DEFAULT 'bronze',
	`xpReward` int NOT NULL DEFAULT 50,
	`pointsReward` int NOT NULL DEFAULT 100,
	`condition` json,
	`hidden` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_achievementId_unique` UNIQUE(`achievementId`)
);
--> statement-breakpoint
CREATE TABLE `ark_themes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`themeId` varchar(64) NOT NULL DEFAULT 'default',
	`customization` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ark_themes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` varchar(128) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`franchiseId` varchar(64) NOT NULL DEFAULT 'dischordian-saga',
	`xp` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`points` int NOT NULL DEFAULT 0,
	`title` varchar(128) DEFAULT 'Recruit',
	`progressData` json,
	`gameData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
