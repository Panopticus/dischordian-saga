CREATE TABLE `fight_leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(256),
	`elo` int NOT NULL DEFAULT 1000,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`winStreak` int NOT NULL DEFAULT 0,
	`bestStreak` int NOT NULL DEFAULT 0,
	`totalKOs` int NOT NULL DEFAULT 0,
	`perfectWins` int NOT NULL DEFAULT 0,
	`bestCombo` int NOT NULL DEFAULT 0,
	`mainFighter` varchar(128),
	`rankTier` enum('bronze','silver','gold','platinum','diamond','master','grandmaster') NOT NULL DEFAULT 'bronze',
	`lastFightAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fight_leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `fight_leaderboard_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `fight_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`playerFighter` varchar(128) NOT NULL,
	`opponentFighter` varchar(128) NOT NULL,
	`difficulty` varchar(64) NOT NULL,
	`arena` varchar(128) NOT NULL,
	`won` int NOT NULL DEFAULT 0,
	`perfect` int NOT NULL DEFAULT 0,
	`bestCombo` int NOT NULL DEFAULT 0,
	`eloChange` int NOT NULL DEFAULT 0,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`playedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fight_matches_id` PRIMARY KEY(`id`)
);
