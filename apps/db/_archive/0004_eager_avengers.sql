CREATE TABLE `crafting_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recipeType` varchar(64) NOT NULL,
	`inputCards` json,
	`outputCardId` varchar(128) NOT NULL,
	`success` int NOT NULL DEFAULT 1,
	`creditsCost` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crafting_log_id` PRIMARY KEY(`id`)
);
