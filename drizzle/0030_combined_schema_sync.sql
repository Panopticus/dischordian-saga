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
CREATE TABLE `daily_briefs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`briefDate` varchar(10) NOT NULL,
	`events` json NOT NULL,
	`completedEvents` json,
	`results` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_briefs_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_daily_brief_user_date` UNIQUE(`userId`,`briefDate`)
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
	`evolutionXp` int NOT NULL DEFAULT 0,
	`deathCause` varchar(64),
	`isSpectral` boolean NOT NULL DEFAULT false,
	`spectralBonusSystem` varchar(64),
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
CREATE TABLE `graduate_deployments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`graduateId` varchar(128) NOT NULL,
	`graduateName` varchar(128) NOT NULL,
	`archetype` varchar(64) NOT NULL,
	`rarity` varchar(32) NOT NULL,
	`role` varchar(64) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`bonuses` json,
	`payload` json,
	`deployedAt` timestamp NOT NULL DEFAULT (now()),
	`recalledAt` timestamp,
	CONSTRAINT `graduate_deployments_id` PRIMARY KEY(`id`)
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
	`evolutionXp` int NOT NULL DEFAULT 0,
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
CREATE TABLE `pressure_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pressureType` varchar(64) NOT NULL,
	`amount` int NOT NULL DEFAULT 1,
	`source` varchar(128) NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pressure_events_id` PRIMARY KEY(`id`)
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
CREATE TABLE `room_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roomId` varchar(64) NOT NULL,
	`visualTier` int NOT NULL DEFAULT 0,
	`damageLevel` int NOT NULL DEFAULT 0,
	`craftCount` int NOT NULL DEFAULT 0,
	`quarantineCount` int NOT NULL DEFAULT 0,
	`crewAssigned` json,
	`decorations` json,
	`roomData` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `room_states_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_room_state_user_room` UNIQUE(`userId`,`roomId`)
);
--> statement-breakpoint
CREATE TABLE `universe_event_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`isActive` int NOT NULL DEFAULT 0,
	`pressureScore` int NOT NULL DEFAULT 0,
	`activatedAt` timestamp,
	`resolvedAt` timestamp,
	`occurrenceCount` int NOT NULL DEFAULT 0,
	`cycleData` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `universe_event_state_id` PRIMARY KEY(`id`),
	CONSTRAINT `universe_event_state_eventId_unique` UNIQUE(`eventId`)
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
ALTER TABLE `character_sheets` ADD `prestigeTier` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `character_sheets` ADD `prestigeState` json;--> statement-breakpoint
CREATE INDEX `idx_analytics_user` ON `analytics_events` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_analytics_event` ON `analytics_events` (`event`);--> statement-breakpoint
CREATE INDEX `idx_analytics_created` ON `analytics_events` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_companion_messages_user` ON `companion_messages` (`userId`,`companionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_daily_brief_date` ON `daily_briefs` (`briefDate`);--> statement-breakpoint
CREATE INDEX `idx_eidolon_bonds_user_id` ON `eidolon_bonds` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_eidolon_memorial_user_id` ON `eidolon_memorial` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_graduate_deployments_user` ON `graduate_deployments` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_graduate_deployments_role` ON `graduate_deployments` (`role`);--> statement-breakpoint
CREATE INDEX `idx_pet_battle_history_user_id` ON `pet_battle_history` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_player_pets_user_id` ON `player_pets` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_player_votes_vote` ON `player_votes` (`voteId`);--> statement-breakpoint
CREATE INDEX `idx_pressure_type` ON `pressure_events` (`pressureType`);--> statement-breakpoint
CREATE INDEX `idx_pressure_created` ON `pressure_events` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_pressure_user` ON `pressure_events` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_room_state_user` ON `room_states` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_achievement_trait_progress_user_id` ON `achievement_trait_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_ark_themes_user_id` ON `ark_themes` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_auction_bids_auction_id` ON `auction_bids` (`auctionId`);--> statement-breakpoint
CREATE INDEX `idx_auction_bids_bidder_id` ON `auction_bids` (`bidderId`);--> statement-breakpoint
CREATE INDEX `idx_battle_pass_progress_user_id` ON `battle_pass_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_battle_pass_progress_season_id` ON `battle_pass_progress` (`seasonId`);--> statement-breakpoint
CREATE INDEX `idx_card_game_achievements_user_id` ON `card_game_achievements` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_card_trades_sender_id` ON `card_trades` (`senderId`);--> statement-breakpoint
CREATE INDEX `idx_card_trades_receiver_id` ON `card_trades` (`receiverId`);--> statement-breakpoint
CREATE INDEX `idx_character_sheets_user_id` ON `character_sheets` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_citizen_characters_user_id` ON `citizen_characters` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_citizen_talent_selections_user_id` ON `citizen_talent_selections` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_civil_skill_progress_user_id` ON `civil_skill_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_class_mastery_user_id` ON `class_mastery` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_content_participation_user_id` ON `content_participation` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_crafting_log_user_id` ON `crafting_log` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_currency_exchange_user_id` ON `currency_exchange` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_currency_exchange_status` ON `currency_exchange` (`status`);--> statement-breakpoint
CREATE INDEX `idx_daily_quests_user_id` ON `daily_quests` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_decks_user_id` ON `decks` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_disenchant_log_user_id` ON `disenchant_log` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_draft_participants_user_id` ON `draft_participants` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_draft_participants_tournament_id` ON `draft_participants` (`tournamentId`);--> statement-breakpoint
CREATE INDEX `idx_dream_balance_user_id` ON `dream_balance` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_event_participation_user_id` ON `event_participation` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_event_participation_event_id` ON `event_participation` (`eventId`);--> statement-breakpoint
CREATE INDEX `idx_event_shop_purchases_user_id` ON `event_shop_purchases` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_feature_unlocks_user_id` ON `feature_unlocks` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_fight_matches_user_id` ON `fight_matches` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_guild_chat_guild_id` ON `guild_chat` (`guildId`);--> statement-breakpoint
CREATE INDEX `idx_guild_invites_guild_id` ON `guild_invites` (`guildId`);--> statement-breakpoint
CREATE INDEX `idx_guild_invites_invited_user_id` ON `guild_invites` (`invitedUserId`);--> statement-breakpoint
CREATE INDEX `idx_guild_members_guild_id` ON `guild_members` (`guildId`);--> statement-breakpoint
CREATE INDEX `idx_guild_members_user_id` ON `guild_members` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_guild_war_contributions_war_id` ON `guild_war_contributions` (`warId`);--> statement-breakpoint
CREATE INDEX `idx_guild_war_contributions_guild_id` ON `guild_war_contributions` (`guildId`);--> statement-breakpoint
CREATE INDEX `idx_guild_war_contributions_user_id` ON `guild_war_contributions` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_login_calendar_user_id` ON `login_calendar` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_market_listings_created_at` ON `market_listings` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_market_listings_status` ON `market_listings` (`status`);--> statement-breakpoint
CREATE INDEX `idx_market_listings_seller_id` ON `market_listings` (`sellerId`);--> statement-breakpoint
CREATE INDEX `idx_mastery_branches_user_id` ON `mastery_branches` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_notifications_user_id` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_player_bases_user_id` ON `player_bases` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_prestige_progress_user_id` ON `prestige_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_prestige_quest_progress_user_id` ON `prestige_quest_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_pvp_decks_user_id` ON `pvp_decks` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_pvp_season_records_season_id` ON `pvp_season_records` (`seasonId`);--> statement-breakpoint
CREATE INDEX `idx_pvp_season_records_user_id` ON `pvp_season_records` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_ship_upgrades_user_id` ON `ship_upgrades` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_store_purchases_user_id` ON `store_purchases` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_trophy_displays_user_id` ON `trophy_displays` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_tw_colonies_user_id` ON `tw_colonies` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_tw_game_log_user_id` ON `tw_game_log` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_tw_player_state_user_id` ON `tw_player_state` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_user_achievements_user_id` ON `user_achievements` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_user_ark_progress_user_id` ON `user_ark_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_user_cards_user_id` ON `user_cards` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_user_progress_user_id` ON `user_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_users_created_at` ON `users` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_users_last_signed_in` ON `users` (`lastSignedIn`);--> statement-breakpoint
CREATE INDEX `idx_war_contributions_user_id` ON `war_contributions` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_war_contributions_season_id` ON `war_contributions` (`seasonId`);--> statement-breakpoint
CREATE INDEX `idx_war_territories_season_id` ON `war_territories` (`seasonId`);