CREATE TABLE IF NOT EXISTS `chess_games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whitePlayerId` int,
	`blackPlayerId` int,
	`whiteCharacter` varchar(64),
	`blackCharacter` varchar(64),
	`mode` enum('casual','ranked','tournament','story','game_master') NOT NULL DEFAULT 'casual',
	`aiDifficulty` int,
	`fen` text,
	`pgn` text,
	`status` enum('waiting','active','checkmate','stalemate','draw','resigned','timeout','abandoned') NOT NULL DEFAULT 'waiting',
	`winnerId` int,
	`timeControl` int NOT NULL DEFAULT 600,
	`whiteTimeMs` int NOT NULL DEFAULT 600000,
	`blackTimeMs` int NOT NULL DEFAULT 600000,
	`moveCount` int NOT NULL DEFAULT 0,
	`whiteEloChange` int,
	`blackEloChange` int,
	`rewardsDream` int DEFAULT 0,
	`rewardsMaterials` json,
	`startedAt` timestamp,
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chess_games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `chess_rankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`elo` int NOT NULL DEFAULT 1200,
	`peakElo` int NOT NULL DEFAULT 1200,
	`tier` enum('bronze','silver','gold','platinum','diamond','master','grandmaster') NOT NULL DEFAULT 'bronze',
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`winStreak` int NOT NULL DEFAULT 0,
	`bestWinStreak` int NOT NULL DEFAULT 0,
	`defeatedGameMaster` boolean NOT NULL DEFAULT false,
	`storyProgress` int NOT NULL DEFAULT 0,
	`unlockedCharacters` json,
	`seasonNumber` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chess_rankings_id` PRIMARY KEY(`id`),
	CONSTRAINT `chess_rankings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `chess_tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`format` enum('swiss','elimination','round_robin') NOT NULL DEFAULT 'swiss',
	`maxPlayers` int NOT NULL DEFAULT 16,
	`currentPlayers` int NOT NULL DEFAULT 0,
	`entryFee` int NOT NULL DEFAULT 0,
	`prizePool` int NOT NULL DEFAULT 0,
	`timeControl` int NOT NULL DEFAULT 600,
	`currentRound` int NOT NULL DEFAULT 0,
	`totalRounds` int NOT NULL DEFAULT 4,
	`status` enum('registration','active','completed') NOT NULL DEFAULT 'registration',
	`startsAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chess_tournaments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `guild_war_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`warId` int NOT NULL,
	`guildId` int NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`source` enum('fight_win','pvp_win','trade_volume','quest_complete','card_battle_win','chess_win') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guild_war_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `guild_wars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`seasonNumber` int NOT NULL DEFAULT 1,
	`status` enum('upcoming','active','ended') NOT NULL DEFAULT 'upcoming',
	`factionA` enum('empire','insurgency','neutral') NOT NULL,
	`factionB` enum('empire','insurgency','neutral') NOT NULL,
	`scoreA` int NOT NULL DEFAULT 0,
	`scoreB` int NOT NULL DEFAULT 0,
	`territory` varchar(128) NOT NULL,
	`prizePoolDream` int NOT NULL DEFAULT 0,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guild_wars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `market_tax_pool` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poolDream` int NOT NULL DEFAULT 0,
	`poolCredits` int NOT NULL DEFAULT 0,
	`lastDistributedAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `market_tax_pool_id` PRIMARY KEY(`id`)
);
