CREATE TABLE `admin_approval_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedBy` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`targetKey` varchar(128) NOT NULL,
	`newValue` json,
	`reason` text,
	`status` enum('pending','executed','rejected') NOT NULL DEFAULT 'pending',
	`approvals` json NOT NULL DEFAULT ('[]'),
	`rejectedBy` int,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`executedAt` timestamp,
	`rejectedAt` timestamp,
	CONSTRAINT `admin_approval_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crew_bloodlines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bloodlineKey` varchar(64) NOT NULL,
	`foundedAt` timestamp NOT NULL DEFAULT (now()),
	`generationCount` int NOT NULL DEFAULT 1,
	`geneticDrift` int NOT NULL DEFAULT 0,
	`diversityIndex` int NOT NULL DEFAULT 0,
	`activeTraits` json NOT NULL DEFAULT ('[]'),
	`recessiveTraits` json NOT NULL DEFAULT ('[]'),
	`metadata` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crew_bloodlines_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_crew_bloodline_user_key` UNIQUE(`userId`,`bloodlineKey`)
);
--> statement-breakpoint
CREATE TABLE `crew_incubator_pods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`podSlot` int NOT NULL,
	`status` varchar(24) NOT NULL DEFAULT 'empty',
	`templateId` varchar(64),
	`bloodlineKey` varchar(64),
	`generation` int NOT NULL DEFAULT 1,
	`parentIds` json,
	`timeRemainingSeconds` int NOT NULL DEFAULT 0,
	`totalTimeSeconds` int NOT NULL DEFAULT 0,
	`geneticIntegrity` int NOT NULL DEFAULT 100,
	`traits` json NOT NULL DEFAULT ('[]'),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crew_incubator_pods_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_crew_pod_user_slot` UNIQUE(`userId`,`podSlot`)
);
--> statement-breakpoint
CREATE TABLE `crew_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`memberKey` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`nickname` varchar(64),
	`species` varchar(32) NOT NULL,
	`gender` varchar(16) NOT NULL,
	`bloodlineKey` varchar(64) NOT NULL,
	`generation` int NOT NULL DEFAULT 1,
	`parentIds` json,
	`children` json NOT NULL DEFAULT ('[]'),
	`geneticTraits` json NOT NULL DEFAULT ('[]'),
	`role` varchar(32),
	`stats` json NOT NULL,
	`morale` int NOT NULL DEFAULT 70,
	`health` int NOT NULL DEFAULT 100,
	`loyalty` int NOT NULL DEFAULT 50,
	`status` varchar(24) NOT NULL DEFAULT 'active',
	`age` int NOT NULL DEFAULT 0,
	`maxAge` int NOT NULL DEFAULT 80,
	`birthCycle` int NOT NULL DEFAULT 0,
	`missionHistory` json NOT NULL DEFAULT ('[]'),
	`relationships` json NOT NULL DEFAULT ('{}'),
	`deathRecord` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crew_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_crew_member_user_key` UNIQUE(`userId`,`memberKey`)
);
--> statement-breakpoint
CREATE TABLE `crew_missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionKey` varchar(96) NOT NULL,
	`templateId` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`sectorId` varchar(64) NOT NULL,
	`difficulty` varchar(24) NOT NULL,
	`status` varchar(24) NOT NULL DEFAULT 'dispatched',
	`assignedCrewIds` json NOT NULL DEFAULT ('[]'),
	`successChance` int NOT NULL DEFAULT 50,
	`dispatchedAt` timestamp NOT NULL DEFAULT (now()),
	`completesAt` timestamp NOT NULL,
	`resolvedAt` timestamp,
	`resolution` json,
	CONSTRAINT `crew_missions_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_crew_mission_user_key` UNIQUE(`userId`,`missionKey`)
);
--> statement-breakpoint
ALTER TABLE `notifications` MODIFY COLUMN `type` enum('trade_offer','trade_accepted','trade_declined','pvp_challenge','pvp_result','pvp_season_reward','auction_outbid','auction_won','auction_ended','market_sold','market_buy_filled','faction_war','guild_invite','guild_message','guild_war_victory','daily_reset','daily_login','quest_complete','weekly_quest','epoch_quest','achievement','battle_pass_reward','syndicate_quest','boss_mastery','seasonal_event','recruitment','system','feature_hint','lore_event','combat_achievement','streak_milestone','progression','crafting_achievement','npc_reaction','archetype_emergence','prestige_dialog','prestige_deferred_dialog','prestige_conditional_dialog','companion_prestige_gesture','meme_broadcast','prestige_complete','universe_event','companion_death','companion_resurrected','eidolon_evolved','pet_evolved','apprentice_sacrificed','crew_cloned','morality_threshold','morality_market_notice','content_discovery','deep_trust','daily_brief_complete','outbreak_completed','outbreak_component','battle_pass_tier_up') NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','moderator','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `idx_admin_approval_status` ON `admin_approval_requests` (`status`);--> statement-breakpoint
CREATE INDEX `idx_admin_approval_requested_by` ON `admin_approval_requests` (`requestedBy`);--> statement-breakpoint
CREATE INDEX `idx_admin_approval_created_at` ON `admin_approval_requests` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_crew_bloodline_user` ON `crew_bloodlines` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_crew_pod_user` ON `crew_incubator_pods` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_crew_pod_status` ON `crew_incubator_pods` (`status`);--> statement-breakpoint
CREATE INDEX `idx_crew_member_user` ON `crew_members` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_crew_member_bloodline` ON `crew_members` (`bloodlineKey`);--> statement-breakpoint
CREATE INDEX `idx_crew_member_status` ON `crew_members` (`status`);--> statement-breakpoint
CREATE INDEX `idx_crew_mission_user_status` ON `crew_missions` (`userId`,`status`);