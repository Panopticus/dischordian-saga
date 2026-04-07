CREATE TABLE `admin_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventKey` varchar(128) NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`eventType` enum('notification','living_universe','seasonal_bonus','instance_spawn','narrative_trigger','multiplier') NOT NULL,
	`message` text,
	`targetAudience` enum('all','by_level','by_guild','specific') NOT NULL DEFAULT 'all',
	`targetPayload` json,
	`gameStateChanges` json,
	`isActive` boolean NOT NULL DEFAULT false,
	`scheduledFor` timestamp,
	`activatedAt` timestamp,
	`expiresAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_events_eventKey_unique` UNIQUE(`eventKey`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`event` varchar(128) NOT NULL,
	`properties` json,
	`sessionId` varchar(64) NOT NULL,
	`clientTimestamp` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voteId` varchar(128) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('lore','event','content','quest','sacrifice') NOT NULL,
	`status` enum('active','closed','announced') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endsAt` timestamp NOT NULL,
	`impactType` varchar(128),
	`impactPayload` json,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `community_votes_voteId_unique` UNIQUE(`voteId`)
);
--> statement-breakpoint
CREATE TABLE `companion_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companionId` varchar(64) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`relationshipLevel` int NOT NULL DEFAULT 0,
	`category` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companion_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companion_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companionId` varchar(64) NOT NULL,
	`relationshipLevel` int NOT NULL DEFAULT 0,
	`totalMessages` int NOT NULL DEFAULT 0,
	`backstoryUnlocked` json,
	`questsCompleted` json,
	`romanceActive` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companion_relationships_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_companion_rel_user` UNIQUE(`userId`,`companionId`)
);
--> statement-breakpoint
CREATE TABLE `eidolon_bonds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eidolonId` varchar(64) NOT NULL,
	`bond` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`xp` int NOT NULL DEFAULT 0,
	`stage` enum('fragment','companion','ascended','spectral') NOT NULL DEFAULT 'fragment',
	`rarity` enum('common','uncommon','rare','epic','legendary','mythic') NOT NULL DEFAULT 'common',
	`health` enum('healthy','hurt','critical','downed','dead') NOT NULL DEFAULT 'healthy',
	`injury` int NOT NULL DEFAULT 0,
	`deathCount` int NOT NULL DEFAULT 0,
	`isResonant` boolean NOT NULL DEFAULT false,
	`isSoulBound` boolean NOT NULL DEFAULT true,
	`nickname` varchar(64),
	`memories` json DEFAULT ('[]'),
	`unlockedSkills` json DEFAULT ('[]'),
	`skillPoints` int NOT NULL DEFAULT 0,
	`missionsShared` int NOT NULL DEFAULT 0,
	`questsCompleted` json DEFAULT ('[]'),
	`moralityDissonance` int NOT NULL DEFAULT 0,
	`redStonesAbsorbed` int NOT NULL DEFAULT 0,
	`goldFragmentsAbsorbed` int NOT NULL DEFAULT 0,
	`transformState` enum('normal','hierarchy_evolved','dreamer_evolved') NOT NULL DEFAULT 'normal',
	`lastFed` timestamp,
	`lastInteraction` timestamp,
	`boundAt` timestamp NOT NULL DEFAULT (now()),
	`diedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eidolon_bonds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eidolon_memorial` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eidolonId` varchar(64) NOT NULL,
	`eidolonName` varchar(128) NOT NULL,
	`bondAtDeath` int NOT NULL,
	`causeOfDeath` varchar(255) NOT NULL,
	`daysActive` int NOT NULL,
	`flowers` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eidolon_memorial_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pet_battle_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` varchar(64) NOT NULL,
	`opponentSpecies` varchar(64) NOT NULL,
	`arenaTier` varchar(64) NOT NULL,
	`won` boolean NOT NULL,
	`rounds` int NOT NULL,
	`perfectVictory` boolean NOT NULL DEFAULT false,
	`bondGain` int NOT NULL DEFAULT 0,
	`dreamEarned` int NOT NULL DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`injuryDealt` int NOT NULL DEFAULT 0,
	`battleLog` json,
	`foughtAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pet_battle_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` varchar(64) NOT NULL,
	`species` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`evolutionStage` int NOT NULL DEFAULT 1,
	`bond` int NOT NULL DEFAULT 0,
	`skillPoints` int NOT NULL DEFAULT 0,
	`currentHp` int NOT NULL DEFAULT 100,
	`maxHp` int NOT NULL DEFAULT 100,
	`unlockedMoves` json,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`kills` int NOT NULL DEFAULT 0,
	`injuredUntil` timestamp,
	`acquiredAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voteId` varchar(128) NOT NULL,
	`userId` int NOT NULL,
	`optionNumber` int NOT NULL,
	`votedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `player_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_player_votes_user_vote` UNIQUE(`voteId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `promo_code_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promoCodeId` int NOT NULL,
	`userId` int NOT NULL,
	`redeemedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promo_code_redemptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`description` text,
	`rewardType` enum('cards','dream_currency','credits','cosmetics','mixed') NOT NULL,
	`rewardValue` json NOT NULL,
	`maxRedemptions` int DEFAULT -1,
	`currentRedemptions` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promo_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `promo_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `vote_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voteId` varchar(128) NOT NULL,
	`optionNumber` int NOT NULL,
	`optionText` varchar(255) NOT NULL,
	`description` text,
	`rewardOnWin` json,
	`voteCount` int NOT NULL DEFAULT 0,
	`isWinner` boolean NOT NULL DEFAULT false,
	CONSTRAINT `vote_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `linked_wallets`;--> statement-breakpoint
DROP TABLE `nft_claims`;--> statement-breakpoint
DROP TABLE `nft_metadata_cache`;--> statement-breakpoint
ALTER TABLE `guild_war_contributions` MODIFY COLUMN `source` enum('fight_win','pvp_win','trade_volume','quest_complete','card_battle_win','chess_win','terminus_wave','terminus_boss_kill','terminus_pvp_star','terminus_defense') NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_analytics_user` ON `analytics_events` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_analytics_event` ON `analytics_events` (`event`);--> statement-breakpoint
CREATE INDEX `idx_analytics_created` ON `analytics_events` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_companion_messages_user` ON `companion_messages` (`userId`,`companionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_player_votes_vote` ON `player_votes` (`voteId`);