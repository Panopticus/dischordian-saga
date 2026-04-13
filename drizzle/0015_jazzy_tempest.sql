CREATE TABLE `feature_unlocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`featureKey` varchar(128) NOT NULL,
	`unlockedVia` enum('ark_room','achievement','level','purchase','admin','default') NOT NULL DEFAULT 'default',
	`sourceId` varchar(128),
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feature_unlocks_id` PRIMARY KEY(`id`)
);
