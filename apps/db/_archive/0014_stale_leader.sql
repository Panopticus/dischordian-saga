CREATE TABLE `card_game_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementKey` varchar(128) NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`target` int NOT NULL DEFAULT 1,
	`completed` int NOT NULL DEFAULT 0,
	`rewardClaimed` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `card_game_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `card_trades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`senderCards` json NOT NULL,
	`receiverCards` json NOT NULL,
	`senderDream` int NOT NULL DEFAULT 0,
	`receiverDream` int NOT NULL DEFAULT 0,
	`status` enum('pending','accepted','declined','cancelled','expired') NOT NULL DEFAULT 'pending',
	`message` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `card_trades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draft_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`userId` int NOT NULL,
	`pickedCards` json NOT NULL,
	`currentRound` int NOT NULL DEFAULT 0,
	`currentChoices` json,
	`tournamentWins` int NOT NULL DEFAULT 0,
	`tournamentLosses` int NOT NULL DEFAULT 0,
	`eliminated` int NOT NULL DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `draft_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draft_tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentCode` varchar(32) NOT NULL,
	`status` enum('drafting','battling','completed','cancelled') NOT NULL DEFAULT 'drafting',
	`maxPlayers` int NOT NULL DEFAULT 2,
	`draftRounds` int NOT NULL DEFAULT 15,
	`cardsPerPick` int NOT NULL DEFAULT 3,
	`entryCost` int NOT NULL DEFAULT 5,
	`prizeMultiplier` int NOT NULL DEFAULT 2,
	`creatorId` int NOT NULL,
	`winnerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `draft_tournaments_id` PRIMARY KEY(`id`),
	CONSTRAINT `draft_tournaments_tournamentCode_unique` UNIQUE(`tournamentCode`)
);
