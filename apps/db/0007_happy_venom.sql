CREATE TABLE `content_participation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` varchar(64) NOT NULL,
	`contentId` varchar(256) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`progress` int NOT NULL DEFAULT 0,
	`rewardsClaimed` int NOT NULL DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_participation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentType` varchar(64) NOT NULL,
	`contentId` varchar(256) NOT NULL,
	`rewardType` varchar(64) NOT NULL,
	`rewardValue` varchar(256) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`description` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_rewards_id` PRIMARY KEY(`id`)
);
