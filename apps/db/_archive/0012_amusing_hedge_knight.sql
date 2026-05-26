CREATE TABLE `pvp_leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(256),
	`elo` int NOT NULL DEFAULT 1000,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`winStreak` int NOT NULL DEFAULT 0,
	`bestStreak` int NOT NULL DEFAULT 0,
	`rankTier` enum('bronze','silver','gold','platinum','diamond','master','grandmaster') NOT NULL DEFAULT 'bronze',
	`lastMatchAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvp_leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvp_leaderboard_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `pvp_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` varchar(64) NOT NULL,
	`player1Id` int NOT NULL,
	`player2Id` int,
	`status` enum('waiting','active','completed','abandoned') NOT NULL DEFAULT 'waiting',
	`winnerId` int,
	`player1Deck` json,
	`player2Deck` json,
	`finalState` json,
	`totalTurns` int NOT NULL DEFAULT 0,
	`player1EloChange` int NOT NULL DEFAULT 0,
	`player2EloChange` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	CONSTRAINT `pvp_matches_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvp_matches_matchId_unique` UNIQUE(`matchId`)
);
