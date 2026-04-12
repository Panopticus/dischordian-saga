CREATE TABLE `boss_mastery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bossKey` varchar(100) NOT NULL,
	`kills` int NOT NULL DEFAULT 0,
	`masteryLevel` int NOT NULL DEFAULT 0,
	`bestTime` int,
	`highestDifficulty` varchar(20),
	`cosmeticsUnlocked` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boss_mastery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coop_raids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bossKey` varchar(100) NOT NULL,
	`difficulty` varchar(20) NOT NULL DEFAULT 'normal',
	`guildId` int,
	`currentHp` int NOT NULL,
	`maxHp` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`startsAt` timestamp NOT NULL DEFAULT (now()),
	`endsAt` timestamp NOT NULL,
	`completedAt` timestamp,
	CONSTRAINT `coop_raids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cosmetic_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemKey` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`equipped` boolean NOT NULL DEFAULT false,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cosmetic_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `direct_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`content` text NOT NULL,
	`readAt` timestamp,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `direct_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donation_reputation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`guildId` int NOT NULL,
	`totalReputation` int NOT NULL DEFAULT 0,
	`weeklyDonations` json,
	`weekResetAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donation_reputation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`guildId` int NOT NULL,
	`donationType` varchar(20) NOT NULL,
	`itemKey` varchar(100),
	`amount` int NOT NULL DEFAULT 1,
	`reputationEarned` int NOT NULL DEFAULT 0,
	`donatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_participation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` int NOT NULL,
	`contribution` int NOT NULL DEFAULT 0,
	`tokensEarned` int NOT NULL DEFAULT 0,
	`tokensSpent` int NOT NULL DEFAULT 0,
	`milestonesReached` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_participation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_shop_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` int NOT NULL,
	`itemKey` varchar(100) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`tokensCost` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_shop_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `friendly_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengerId` int NOT NULL,
	`opponentId` int,
	`gameType` varchar(50) NOT NULL,
	`rules` json,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`winnerId` int,
	`isDaily` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `friendly_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `friends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`friendId` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `friends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_replays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameType` varchar(50) NOT NULL,
	`player1Id` int NOT NULL,
	`player1Name` varchar(100) NOT NULL,
	`player2Id` int,
	`player2Name` varchar(100),
	`winnerId` int,
	`moveData` text NOT NULL,
	`totalMoves` int NOT NULL DEFAULT 0,
	`duration` int NOT NULL DEFAULT 0,
	`featured` boolean NOT NULL DEFAULT false,
	`tags` json,
	`playedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_replays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild_recruitment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guildId` int NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`status` varchar(20) NOT NULL DEFAULT 'open',
	`minLevel` int NOT NULL DEFAULT 1,
	`preferredClasses` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guild_recruitment_id` PRIMARY KEY(`id`),
	CONSTRAINT `guild_recruitment_guildId_unique` UNIQUE(`guildId`)
);
--> statement-breakpoint
CREATE TABLE `lore_journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`wordCount` int NOT NULL DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`linkedEntityId` varchar(100),
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lore_journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_quarters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(200) NOT NULL DEFAULT 'My Quarters',
	`unlockedZones` json,
	`placedItems` json,
	`ownedItems` json,
	`visitCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_quarters_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_quarters_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `quarter_visits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`visitorId` int NOT NULL,
	`visitedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quarter_visits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raid_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`raidId` int NOT NULL,
	`userId` int NOT NULL,
	`damageDealt` int NOT NULL DEFAULT 0,
	`healingDone` int NOT NULL DEFAULT 0,
	`damageTaken` int NOT NULL DEFAULT 0,
	`mechanicsHandled` int NOT NULL DEFAULT 0,
	`contributionScore` int NOT NULL DEFAULT 0,
	`role` varchar(20) NOT NULL DEFAULT 'dps',
	`lootClaimed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `raid_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasonal_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventKey` varchar(100) NOT NULL,
	`name` varchar(200) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`globalProgress` int NOT NULL DEFAULT 0,
	`globalTarget` int NOT NULL DEFAULT 100000,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seasonal_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `writing_streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastWriteDate` varchar(10),
	`totalWordsWritten` int NOT NULL DEFAULT 0,
	`totalEntries` int NOT NULL DEFAULT 0,
	`streakProtectionUsed` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `writing_streaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `writing_streaks_userId_unique` UNIQUE(`userId`)
);
