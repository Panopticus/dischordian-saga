CREATE TABLE `class_mastery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`characterClass` enum('spy','oracle','assassin','engineer','soldier') NOT NULL,
	`classXp` int NOT NULL DEFAULT 0,
	`masteryRank` int NOT NULL DEFAULT 0,
	`unlockedPerks` json,
	`actionsPerformed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `class_mastery_id` PRIMARY KEY(`id`)
);
