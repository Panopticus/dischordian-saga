CREATE TABLE `tw_colonies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sectorId` int NOT NULL,
	`planetName` varchar(256) NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`colonyType` enum('mining','agriculture','technology','military','trading') DEFAULT 'mining',
	`population` int NOT NULL DEFAULT 100,
	`defense` int NOT NULL DEFAULT 0,
	`pendingCredits` int NOT NULL DEFAULT 0,
	`pendingFuelOre` int NOT NULL DEFAULT 0,
	`pendingOrganics` int NOT NULL DEFAULT 0,
	`pendingEquipment` int NOT NULL DEFAULT 0,
	`lastCollected` timestamp NOT NULL DEFAULT (now()),
	`cardBonuses` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tw_colonies_id` PRIMARY KEY(`id`)
);
