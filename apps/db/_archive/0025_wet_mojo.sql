CREATE TABLE `daily_streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`chronoShards` int NOT NULL DEFAULT 0,
	`lastCheckIn` varchar(10),
	`repairItems` int NOT NULL DEFAULT 0,
	`totalCheckIns` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_streaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_streaks_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `defense_waves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerType` enum('station','world') NOT NULL,
	`ownerId` int NOT NULL,
	`waveNumber` int NOT NULL DEFAULT 1,
	`enemies` json,
	`difficultyMultiplier` int NOT NULL DEFAULT 100,
	`rewards` json,
	`status` enum('pending','active','completed','failed') NOT NULL DEFAULT 'pending',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `defense_waves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestige_quest_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questChainKey` varchar(128) NOT NULL,
	`currentStep` int NOT NULL DEFAULT 0,
	`completedSteps` json,
	`skippedSteps` json,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`stepProgress` json,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prestige_quest_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raid_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attackerId` int NOT NULL,
	`defenderType` enum('station','world') NOT NULL,
	`defenderId` int NOT NULL,
	`defenderOwnerId` int NOT NULL,
	`result` enum('victory','defeat','draw') NOT NULL,
	`stars` int NOT NULL DEFAULT 0,
	`destructionPercent` int NOT NULL DEFAULT 0,
	`lootStolen` json,
	`unitsDeployed` json,
	`unitsLost` int NOT NULL DEFAULT 0,
	`towersDestroyed` int NOT NULL DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`trophiesChanged` int NOT NULL DEFAULT 0,
	`rpgBonuses` json,
	`duration` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `raid_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raid_trophies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trophies` int NOT NULL DEFAULT 0,
	`league` enum('bronze_1','bronze_2','bronze_3','silver_1','silver_2','silver_3','gold_1','gold_2','gold_3','platinum_1','platinum_2','platinum_3','diamond_1','diamond_2','diamond_3','champion','legend') NOT NULL DEFAULT 'bronze_1',
	`seasonHigh` int NOT NULL DEFAULT 0,
	`allTimeHigh` int NOT NULL DEFAULT 0,
	`totalRaids` int NOT NULL DEFAULT 0,
	`totalDefenses` int NOT NULL DEFAULT 0,
	`winRate` int NOT NULL DEFAULT 0,
	`winStreak` int NOT NULL DEFAULT 0,
	`bestWinStreak` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raid_trophies_id` PRIMARY KEY(`id`),
	CONSTRAINT `raid_trophies_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `space_stations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stationName` varchar(128) NOT NULL DEFAULT 'Outpost Alpha',
	`tier` int NOT NULL DEFAULT 1,
	`gridSize` int NOT NULL DEFAULT 6,
	`totalDefense` int NOT NULL DEFAULT 0,
	`stealthRating` int NOT NULL DEFAULT 0,
	`storedResources` json,
	`productionRates` json,
	`lastCollection` timestamp NOT NULL DEFAULT (now()),
	`stationedCompanions` json,
	`activeSynergies` json,
	`shieldUntil` timestamp,
	`visitCount` int NOT NULL DEFAULT 0,
	`reputation` int NOT NULL DEFAULT 0,
	`timesRaided` int NOT NULL DEFAULT 0,
	`successfulDefenses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `space_stations_id` PRIMARY KEY(`id`),
	CONSTRAINT `space_stations_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `station_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stationId` int NOT NULL,
	`moduleKey` varchar(64) NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`gridX` int NOT NULL,
	`gridY` int NOT NULL,
	`status` enum('active','building','upgrading','damaged','destroyed') NOT NULL DEFAULT 'active',
	`completesAt` timestamp,
	`currentHp` int NOT NULL DEFAULT 100,
	`maxHp` int NOT NULL DEFAULT 100,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `station_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `syndicate_buildings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`worldId` int NOT NULL,
	`buildingKey` varchar(64) NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`gridX` int NOT NULL,
	`gridY` int NOT NULL,
	`status` enum('active','building','upgrading','damaged','destroyed') NOT NULL DEFAULT 'active',
	`completesAt` timestamp,
	`currentHp` int NOT NULL DEFAULT 100,
	`maxHp` int NOT NULL DEFAULT 100,
	`builtBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `syndicate_buildings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `syndicate_worlds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guildId` int NOT NULL,
	`biome` varchar(32) NOT NULL DEFAULT 'forge_world',
	`worldName` varchar(128) NOT NULL DEFAULT 'Unnamed World',
	`level` int NOT NULL DEFAULT 1,
	`gridSize` int NOT NULL DEFAULT 8,
	`totalDefense` int NOT NULL DEFAULT 0,
	`productionRates` json,
	`storedResources` json,
	`lastCollection` timestamp NOT NULL DEFAULT (now()),
	`activeSynergies` json,
	`shieldUntil` timestamp,
	`timesRaided` int NOT NULL DEFAULT 0,
	`successfulDefenses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `syndicate_worlds_id` PRIMARY KEY(`id`),
	CONSTRAINT `syndicate_worlds_guildId_unique` UNIQUE(`guildId`)
);
--> statement-breakpoint
CREATE TABLE `tower_placements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerType` enum('station','world') NOT NULL,
	`ownerId` int NOT NULL,
	`towerKey` varchar(64) NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`gridX` int NOT NULL,
	`gridY` int NOT NULL,
	`currentHp` int NOT NULL DEFAULT 200,
	`maxHp` int NOT NULL DEFAULT 200,
	`status` enum('active','building','upgrading','destroyed') NOT NULL DEFAULT 'active',
	`completesAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tower_placements_id` PRIMARY KEY(`id`)
);
