CREATE TABLE `citizen_characters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`species` enum('demagi','quarchon','neyon') NOT NULL,
	`characterClass` enum('engineer','oracle','assassin','soldier','spy') NOT NULL,
	`alignment` enum('order','chaos') NOT NULL,
	`element` enum('earth','fire','water','air','space','time','probability','reality') NOT NULL,
	`attrAttack` int NOT NULL DEFAULT 2,
	`attrDefense` int NOT NULL DEFAULT 2,
	`attrVitality` int NOT NULL DEFAULT 2,
	`level` int NOT NULL DEFAULT 1,
	`xp` int NOT NULL DEFAULT 0,
	`classLevel` int NOT NULL DEFAULT 1,
	`maxHp` int NOT NULL DEFAULT 100,
	`armor` int NOT NULL DEFAULT 0,
	`gear` json,
	`abilities` json,
	`isPrimary` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `citizen_characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dream_balance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dreamTokens` int NOT NULL DEFAULT 0,
	`soulBoundDream` int NOT NULL DEFAULT 0,
	`dnaCode` int NOT NULL DEFAULT 0,
	`totalDreamEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dream_balance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `store_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`category` enum('troop_upgrade','skill_pack','cosmetic','booster','elite_pass','story_extension','ship_upgrade','room_upgrade','dream_pack') NOT NULL,
	`priceUsd` int NOT NULL DEFAULT 0,
	`priceDream` int NOT NULL DEFAULT 0,
	`priceCredits` int NOT NULL DEFAULT 0,
	`itemData` json,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `store_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `store_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` int NOT NULL,
	`paymentMethod` enum('credits','dream','stripe') NOT NULL,
	`stripePaymentId` varchar(256),
	`amount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `store_purchases_id` PRIMARY KEY(`id`)
);
