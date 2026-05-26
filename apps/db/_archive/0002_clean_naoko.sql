CREATE TABLE `ark_rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`roomType` enum('bridge','quarters','armory','lab','hangar','medbay','cargo','engine','observation','trophy','training','market','comms','brig','secret','tradewars') NOT NULL,
	`gridX` int NOT NULL DEFAULT 0,
	`gridY` int NOT NULL DEFAULT 0,
	`deckLevel` int NOT NULL DEFAULT 1,
	`isLocked` int NOT NULL DEFAULT 1,
	`unlockRequirement` json,
	`connections` json,
	`imageUrl` text,
	`features` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ark_rooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `ark_rooms_roomId_unique` UNIQUE(`roomId`)
);
--> statement-breakpoint
CREATE TABLE `card_game_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`player1Id` int NOT NULL,
	`player2Id` int NOT NULL DEFAULT 0,
	`winnerId` int,
	`status` enum('waiting','active','completed','abandoned') DEFAULT 'waiting',
	`gameState` json,
	`result` json,
	`vpEarned` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	CONSTRAINT `card_game_matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardId` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`cardType` enum('character','event','item','location','action','reaction','combat','political','master','song') NOT NULL,
	`rarity` enum('common','uncommon','rare','epic','legendary','mythic','neyon') NOT NULL DEFAULT 'common',
	`alignment` enum('order','chaos') DEFAULT 'order',
	`element` enum('earth','fire','water','air') DEFAULT 'earth',
	`dimension` enum('space','time','probability','reality') DEFAULT 'space',
	`characterClass` enum('spy','oracle','assassin','engineer','soldier','neyon','none') DEFAULT 'none',
	`species` enum('demagi','quarchon','neyon','human','synthetic','unknown') DEFAULT 'unknown',
	`faction` varchar(128),
	`cost` int NOT NULL DEFAULT 0,
	`power` int NOT NULL DEFAULT 0,
	`health` int NOT NULL DEFAULT 0,
	`abilityText` text,
	`flavorText` text,
	`imageUrl` text,
	`loredexEntryId` varchar(128),
	`album` varchar(256),
	`era` varchar(128),
	`season` varchar(64),
	`nftTokenId` varchar(128),
	`nftPerks` json,
	`disciplines` json,
	`keywords` json,
	`unlockMethod` enum('starter','story','achievement','trade','fight','exploration','purchase','event','nft','admin') DEFAULT 'starter',
	`unlockCondition` json,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `cards_cardId_unique` UNIQUE(`cardId`)
);
--> statement-breakpoint
CREATE TABLE `character_sheets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`characterName` varchar(256) NOT NULL,
	`species` enum('demagi','quarchon','neyon','human','synthetic') DEFAULT 'human',
	`characterClass` enum('spy','oracle','assassin','engineer','soldier') NOT NULL DEFAULT 'soldier',
	`alignment` enum('order','chaos') DEFAULT 'order',
	`element` enum('earth','fire','water','air') DEFAULT 'earth',
	`dimension` enum('space','time','probability','reality') DEFAULT 'space',
	`strength` int NOT NULL DEFAULT 5,
	`intelligence` int NOT NULL DEFAULT 5,
	`agility` int NOT NULL DEFAULT 5,
	`charisma` int NOT NULL DEFAULT 5,
	`perception` int NOT NULL DEFAULT 5,
	`willpower` int NOT NULL DEFAULT 5,
	`influence` int NOT NULL DEFAULT 30,
	`energy` int NOT NULL DEFAULT 10,
	`credits` int NOT NULL DEFAULT 1000,
	`avatarUrl` text,
	`equipment` json,
	`abilities` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `character_sheets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`deckType` enum('crypt','library','combined') DEFAULT 'combined',
	`cardList` json,
	`isActive` int NOT NULL DEFAULT 1,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `decks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trophy_displays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(256) NOT NULL,
	`theme` enum('panopticon','insurgency','babylon','ark','void','crystal','neon','ancient','digital','custom') DEFAULT 'ark',
	`displayedCards` json,
	`layout` json,
	`isPublic` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trophy_displays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tw_game_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`details` json,
	`sectorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tw_game_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tw_player_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentSector` int NOT NULL DEFAULT 1,
	`shipType` varchar(128) NOT NULL DEFAULT 'scout',
	`credits` int NOT NULL DEFAULT 5000,
	`fuelOre` int NOT NULL DEFAULT 0,
	`organics` int NOT NULL DEFAULT 0,
	`equipment` int NOT NULL DEFAULT 0,
	`holds` int NOT NULL DEFAULT 20,
	`fighters` int NOT NULL DEFAULT 0,
	`shields` int NOT NULL DEFAULT 100,
	`turnsRemaining` int NOT NULL DEFAULT 100,
	`experience` int NOT NULL DEFAULT 0,
	`alignment` int NOT NULL DEFAULT 0,
	`discoveredSectors` json,
	`ownedPlanets` json,
	`deployedFighters` json,
	`cardRewards` json,
	`lastTurnReset` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tw_player_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tw_sectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectorId` int NOT NULL,
	`name` varchar(256),
	`sectorType` enum('empty','port','planet','nebula','asteroid','station','wormhole','hazard','stardock') DEFAULT 'empty',
	`warps` json,
	`isDiscovered` int NOT NULL DEFAULT 0,
	`sectorData` json,
	`loreLocationId` varchar(128),
	CONSTRAINT `tw_sectors_id` PRIMARY KEY(`id`),
	CONSTRAINT `tw_sectors_sectorId_unique` UNIQUE(`sectorId`)
);
--> statement-breakpoint
CREATE TABLE `user_ark_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roomId` varchar(128) NOT NULL,
	`isUnlocked` int NOT NULL DEFAULT 0,
	`visitCount` int NOT NULL DEFAULT 0,
	`roomState` json,
	`firstVisitedAt` timestamp,
	`lastVisitedAt` timestamp,
	CONSTRAINT `user_ark_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cardId` varchar(128) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`isFoil` int NOT NULL DEFAULT 0,
	`cardLevel` int NOT NULL DEFAULT 1,
	`obtainedVia` varchar(64) DEFAULT 'starter',
	`obtainedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_cards_id` PRIMARY KEY(`id`)
);
