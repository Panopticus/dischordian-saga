CREATE TABLE `achievement_trait_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`counters` json,
	`unlockedTraits` json,
	`equippedTraits` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `achievement_trait_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `citizen_talent_selections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`talentKey` varchar(64) NOT NULL,
	`milestoneLevel` int NOT NULL,
	`selectedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `citizen_talent_selections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `civil_skill_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skillKey` varchar(64) NOT NULL,
	`xp` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`actionsPerformed` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `civil_skill_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mastery_branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`characterClass` enum('spy','oracle','assassin','engineer','soldier') NOT NULL,
	`branchKey` varchar(64) NOT NULL,
	`chosenAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mastery_branches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestige_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prestigeClassKey` varchar(64) NOT NULL,
	`prestigeXp` int NOT NULL DEFAULT 0,
	`prestigeRank` int NOT NULL DEFAULT 0,
	`unlockedPerks` json,
	`selectedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prestige_progress_id` PRIMARY KEY(`id`)
);
