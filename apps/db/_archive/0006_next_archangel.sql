CREATE TABLE `player_bases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`baseName` varchar(128) NOT NULL DEFAULT 'Outpost Alpha',
	`sectorId` int NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`storageCapacity` int NOT NULL DEFAULT 100,
	`storedOre` int NOT NULL DEFAULT 0,
	`storedOrganics` int NOT NULL DEFAULT 0,
	`storedEquipment` int NOT NULL DEFAULT 0,
	`storedDream` int NOT NULL DEFAULT 0,
	`defenseRating` int NOT NULL DEFAULT 10,
	`productionBonus` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_bases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ship_upgrades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`upgradeType` varchar(64) NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`obtainedVia` varchar(64) DEFAULT 'purchase',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ship_upgrades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `store_purchases` MODIFY COLUMN `itemId` int;--> statement-breakpoint
ALTER TABLE `store_purchases` ADD `stripeSessionId` varchar(256);--> statement-breakpoint
ALTER TABLE `store_purchases` ADD `stripePaymentIntentId` varchar(256);--> statement-breakpoint
ALTER TABLE `store_purchases` ADD `productKey` varchar(128);--> statement-breakpoint
ALTER TABLE `store_purchases` ADD `quantity` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `store_purchases` ADD `fulfilled` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `store_purchases` DROP COLUMN `stripePaymentId`;