-- Apply-missing-prod-tables — created from 0071_baseline_v1.sql
-- 27 tables that the bootstraps were supposed to create at
-- server cold-boot but never landed in prod.

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `colony_founder_progress` (
  `userId` int NOT NULL,
  `totalColoniesFounded` int NOT NULL DEFAULT '0',
  `founderTier` int NOT NULL DEFAULT '0',
  `lastTierAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  CONSTRAINT `colony_founder_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `colony_lanes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `laneId` varchar(192) NOT NULL,
  `sectorId` varchar(128) NOT NULL,
  `vesselClass` varchar(64) NOT NULL,
  `bloodlineKey` varchar(64) NOT NULL,
  `signedAt` bigint NOT NULL,
  `durationMs` bigint NOT NULL,
  `tariffPaid` int NOT NULL DEFAULT '0',
  `status` varchar(24) NOT NULL DEFAULT 'in_voyage',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_colony_lanes_user_lane` (`userId`,`laneId`),
  KEY `idx_colony_lanes_user_id` (`userId`),
  KEY `idx_colony_lanes_user_status` (`userId`,`status`),
  CONSTRAINT `colony_lanes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `colony_worlds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `colonyId` varchar(192) NOT NULL,
  `sectorId` varchar(128) NOT NULL,
  `bloodlineKey` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `foundedAt` timestamp NOT NULL DEFAULT (now()),
  `currentGeneration` int NOT NULL DEFAULT '1',
  `lastExportAt` bigint DEFAULT NULL,
  `totalExportValue` int NOT NULL DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_colony_worlds_user_colony` (`userId`,`colonyId`),
  KEY `idx_colony_worlds_user_id` (`userId`),
  KEY `idx_colony_worlds_user_sector` (`userId`,`sectorId`),
  CONSTRAINT `colony_worlds_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `companion_sacrifice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companion` enum('elara','human') NOT NULL,
  `trialId` int NOT NULL,
  `sacrificedAt` timestamp NOT NULL DEFAULT (now()),
  `cinematicId` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companion_sacrifice_companion_unique` (`companion`),
  KEY `companion_sacrifice_trialId_trials_id_fk` (`trialId`),
  CONSTRAINT `companion_sacrifice_trialId_trials_id_fk` FOREIGN KEY (`trialId`) REFERENCES `trials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `confession_votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `confessionId` int NOT NULL,
  `voterUserId` int NOT NULL,
  `verdict` enum('acquit','condemn','abstain') NOT NULL,
  `reasoning` varchar(140) DEFAULT NULL,
  `votedAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_confession_vote` (`confessionId`,`voterUserId`),
  KEY `confession_votes_voterUserId_users_id_fk` (`voterUserId`),
  KEY `idx_confession_votes_confession` (`confessionId`),
  CONSTRAINT `confession_votes_confessionId_confessions_id_fk` FOREIGN KEY (`confessionId`) REFERENCES `confessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `confession_votes_voterUserId_users_id_fk` FOREIGN KEY (`voterUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `confessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `weekKey` varchar(8) NOT NULL,
  `text` varchar(500) NOT NULL,
  `trialCategory` enum('confession','defensive','evidence','narrative','offensive','reactive') NOT NULL,
  `acquittals` int NOT NULL DEFAULT '0',
  `condemnations` int NOT NULL DEFAULT '0',
  `abstentions` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_confession_user_week` (`userId`,`weekKey`),
  KEY `idx_confession_week` (`weekKey`),
  CONSTRAINT `confessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `deck_oaths` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deckId` int NOT NULL,
  `userId` int NOT NULL,
  `oath` varchar(140) DEFAULT NULL,
  `lore` text,
  `signatureCardId` varchar(96) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deck_oaths_deckId_unique` (`deckId`),
  KEY `idx_deck_oaths_user` (`userId`),
  CONSTRAINT `deck_oaths_deckId_decks_id_fk` FOREIGN KEY (`deckId`) REFERENCES `decks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `deck_oaths_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `faction_channel_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faction` enum('empire','insurgency','witness','neutral') NOT NULL,
  `authorUserId` int NOT NULL,
  `authorGuildId` int DEFAULT NULL,
  `authorChosenName` varchar(64) DEFAULT NULL,
  `message` varchar(500) NOT NULL,
  `tone` enum('intel','edict','vision','notice','rumor') NOT NULL DEFAULT 'notice',
  `pinned` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `faction_channel_posts_authorUserId_users_id_fk` (`authorUserId`),
  KEY `faction_channel_posts_authorGuildId_guilds_id_fk` (`authorGuildId`),
  KEY `idx_faction_channel_faction_created` (`faction`,`createdAt`),
  CONSTRAINT `faction_channel_posts_authorGuildId_guilds_id_fk` FOREIGN KEY (`authorGuildId`) REFERENCES `guilds` (`id`) ON DELETE SET NULL,
  CONSTRAINT `faction_channel_posts_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `global_alignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lightTotal` int NOT NULL DEFAULT '0',
  `darkTotal` int NOT NULL DEFAULT '0',
  `playerCount` int NOT NULL DEFAULT '0',
  `computedAt` timestamp NOT NULL DEFAULT (now()),
  `phase` enum('light_dominant','balanced','dark_dominant') NOT NULL DEFAULT 'balanced',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guild_cell_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cellId` int NOT NULL,
  `userId` int NOT NULL,
  `joinedAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_cell_members_userId_unique` (`userId`),
  KEY `idx_guild_cell_members_cell` (`cellId`),
  CONSTRAINT `guild_cell_members_cellId_guild_cells_id_fk` FOREIGN KEY (`cellId`) REFERENCES `guild_cells` (`id`) ON DELETE CASCADE,
  CONSTRAINT `guild_cell_members_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guild_cells` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guildId` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `paletteToken` varchar(32) DEFAULT NULL,
  `ethos` varchar(280) DEFAULT NULL,
  `leaderUserId` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_guild_cell_name` (`guildId`,`name`),
  KEY `guild_cells_leaderUserId_users_id_fk` (`leaderUserId`),
  KEY `idx_guild_cells_guild` (`guildId`),
  CONSTRAINT `guild_cells_guildId_guilds_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE CASCADE,
  CONSTRAINT `guild_cells_leaderUserId_users_id_fk` FOREIGN KEY (`leaderUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guild_charters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guildId` int NOT NULL,
  `oath` varchar(280) DEFAULT NULL,
  `vocabularyTier` enum('rite','edict','weave','compact') NOT NULL DEFAULT 'compact',
  `presidingCompanion` varchar(48) DEFAULT NULL,
  `signedByUserId` int NOT NULL,
  `signedAt` timestamp NOT NULL DEFAULT (now()),
  `factionLockedUntil` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_charters_guildId_unique` (`guildId`),
  KEY `guild_charters_signedByUserId_users_id_fk` (`signedByUserId`),
  CONSTRAINT `guild_charters_guildId_guilds_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE CASCADE,
  CONSTRAINT `guild_charters_signedByUserId_users_id_fk` FOREIGN KEY (`signedByUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guild_rites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guildId` int NOT NULL,
  `riteType` enum('naming','witnessing','tribunal','investiture','rite_of_passage','other') NOT NULL,
  `title` varchar(140) NOT NULL,
  `description` text,
  `scheduledAt` timestamp NOT NULL,
  `hostUserId` int NOT NULL,
  `cellId` int DEFAULT NULL,
  `status` enum('scheduled','live','concluded','cancelled') NOT NULL DEFAULT 'scheduled',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `guild_rites_hostUserId_users_id_fk` (`hostUserId`),
  KEY `guild_rites_cellId_guild_cells_id_fk` (`cellId`),
  KEY `idx_guild_rites_guild_scheduled` (`guildId`,`scheduledAt`),
  CONSTRAINT `guild_rites_cellId_guild_cells_id_fk` FOREIGN KEY (`cellId`) REFERENCES `guild_cells` (`id`) ON DELETE SET NULL,
  CONSTRAINT `guild_rites_guildId_guilds_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE CASCADE,
  CONSTRAINT `guild_rites_hostUserId_users_id_fk` FOREIGN KEY (`hostUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pet_breeding_pairs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `parentAId` int NOT NULL,
  `parentBId` int NOT NULL,
  `status` enum('queued','incubating','ready','claimed','cancelled') NOT NULL DEFAULT 'queued',
  `queuedAt` timestamp NOT NULL DEFAULT (now()),
  `startedAt` timestamp NULL DEFAULT NULL,
  `readyAt` timestamp NULL DEFAULT NULL,
  `offspringPayload` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pet_breeding_pairs_parentAId_player_pets_id_fk` (`parentAId`),
  KEY `pet_breeding_pairs_parentBId_player_pets_id_fk` (`parentBId`),
  KEY `byUserStatus` (`userId`,`status`),
  CONSTRAINT `pet_breeding_pairs_parentAId_player_pets_id_fk` FOREIGN KEY (`parentAId`) REFERENCES `player_pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pet_breeding_pairs_parentBId_player_pets_id_fk` FOREIGN KEY (`parentBId`) REFERENCES `player_pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pet_breeding_pairs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `player_preparation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `witnessHandSize` int NOT NULL DEFAULT '5',
  `filedBuff` tinyint(1) NOT NULL DEFAULT '0',
  `elaraConfessionVisibility` tinyint(1) NOT NULL DEFAULT '0',
  `humanConfessionWeight` int NOT NULL DEFAULT '100',
  `factionMultipliers` json NOT NULL DEFAULT (_utf8mb4'{}'),
  `recoveredBurntCardIds` json NOT NULL DEFAULT (_utf8mb4'[]'),
  `pledgedCardIds` json NOT NULL DEFAULT (_utf8mb4'[]'),
  `missionStatus` json NOT NULL DEFAULT (_utf8mb4'{"salvage":"available","reverse_trial":"locked","tribunal_elara":"locked","the_question":"locked","bidding_war":"locked"}'),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_preparation_userId_unique` (`userId`),
  CONSTRAINT `player_preparation_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roleplay_dossier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `chosenName` varchar(64) DEFAULT NULL,
  `trueName` varchar(64) DEFAULT NULL,
  `pronouns` varchar(48) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `innerVoice` enum('aggression','mercy','curiosity','conformity','vigilance','vulnerability','wit') DEFAULT NULL,
  `factionAllegiance` enum('empire','insurgency','neutral','witness','unaligned') NOT NULL DEFAULT 'unaligned',
  `motto` varchar(140) DEFAULT NULL,
  `sigilArt` varchar(128) DEFAULT NULL,
  `recognitionMode` enum('private','open','sealed') NOT NULL DEFAULT 'private',
  `calling` varchar(48) DEFAULT NULL,
  `sigilThemeId` varchar(64) DEFAULT 'default',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roleplay_dossier_userId_unique` (`userId`),
  CONSTRAINT `roleplay_dossier_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roleplay_recognitions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `granterUserId` int NOT NULL,
  `granteeUserId` int NOT NULL,
  `ceremonyNote` varchar(280) DEFAULT NULL,
  `grantedAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_roleplay_recognition` (`granterUserId`,`granteeUserId`),
  KEY `idx_roleplay_recognition_grantee` (`granteeUserId`),
  CONSTRAINT `roleplay_recognitions_granteeUserId_users_id_fk` FOREIGN KEY (`granteeUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roleplay_recognitions_granterUserId_users_id_fk` FOREIGN KEY (`granterUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `soul_stones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `violetCount` int NOT NULL DEFAULT '0',
  `redCount` int NOT NULL DEFAULT '0',
  `goldCount` int NOT NULL DEFAULT '0',
  `lifetimeCollected` int NOT NULL DEFAULT '0',
  `weeklyCollected` int NOT NULL DEFAULT '0',
  `weekResetAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soul_stones_userId_unique` (`userId`),
  CONSTRAINT `soul_stones_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `testimony` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trialId` int NOT NULL,
  `phase` enum('charge','opening','evidence','cross_examination','confession','verdict') NOT NULL,
  `idempotencyKey` varchar(192) NOT NULL,
  `playerId` int NOT NULL,
  `cardDefId` varchar(128) NOT NULL,
  `trialCategories` json NOT NULL,
  `buckets` json NOT NULL,
  `witnessingWeightX100` int NOT NULL DEFAULT '100',
  `submittedAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `testimony_idempotencyKey_unique` (`idempotencyKey`),
  KEY `byTrialPhase` (`trialId`,`phase`),
  KEY `byPlayer` (`playerId`,`submittedAt`),
  CONSTRAINT `testimony_playerId_users_id_fk` FOREIGN KEY (`playerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `testimony_trialId_trials_id_fk` FOREIGN KEY (`trialId`) REFERENCES `trials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trade_agency_standing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `agencyId` varchar(64) NOT NULL,
  `standing` int NOT NULL DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `byUserAgency` (`userId`,`agencyId`),
  CONSTRAINT `trade_agency_standing_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trade_missions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `missionDefId` varchar(64) NOT NULL,
  `status` enum('available','active','completed','failed','expired') NOT NULL DEFAULT 'available',
  `agencyId` varchar(64) DEFAULT NULL,
  `offeredAt` timestamp NOT NULL DEFAULT (now()),
  `acceptedAt` timestamp NULL DEFAULT NULL,
  `completedAt` timestamp NULL DEFAULT NULL,
  `rewardPayload` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `byUser` (`userId`,`status`),
  CONSTRAINT `trade_missions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trial_phases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trialId` int NOT NULL,
  `phase` enum('charge','opening','evidence','cross_examination','confession','verdict') NOT NULL,
  `startedAt` timestamp NOT NULL DEFAULT (now()),
  `closedAt` timestamp NULL DEFAULT NULL,
  `finalTallySnapshot` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `byTrialPhase` (`trialId`,`phase`),
  CONSTRAINT `trial_phases_trialId_trials_id_fk` FOREIGN KEY (`trialId`) REFERENCES `trials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trial_tallies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trialId` int NOT NULL,
  `phase` enum('charge','opening','evidence','cross_examination','confession','verdict') NOT NULL,
  `bucket` varchar(128) NOT NULL,
  `weight` int NOT NULL DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `byTrialPhaseBucket` (`trialId`,`phase`,`bucket`),
  KEY `byTrialBucket` (`trialId`,`bucket`),
  CONSTRAINT `trial_tallies_trialId_trials_id_fk` FOREIGN KEY (`trialId`) REFERENCES `trials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trialKey` varchar(64) NOT NULL,
  `currentPhase` enum('charge','opening','evidence','cross_examination','confession','verdict') NOT NULL DEFAULT 'charge',
  `startedAt` timestamp NOT NULL DEFAULT (now()),
  `phaseStartedAt` timestamp NOT NULL DEFAULT (now()),
  `phaseEndsAt` timestamp NOT NULL,
  `phaseDurationMs` bigint NOT NULL,
  `rulesVersionAtStart` varchar(32) NOT NULL,
  `status` enum('pre_trial','live','verdict_resolving','closed','aborted') NOT NULL DEFAULT 'pre_trial',
  `abortReason` text,
  `abortedAt` timestamp NULL DEFAULT NULL,
  `abortedByUserId` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trials_trialKey_unique` (`trialKey`),
  KEY `trials_abortedByUserId_users_id_fk` (`abortedByUserId`),
  CONSTRAINT `trials_abortedByUserId_users_id_fk` FOREIGN KEY (`abortedByUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_tome_endorsements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tomeId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_tome_endorsement` (`tomeId`,`userId`),
  KEY `user_tome_endorsements_userId_users_id_fk` (`userId`),
  CONSTRAINT `user_tome_endorsements_tomeId_user_tomes_id_fk` FOREIGN KEY (`tomeId`) REFERENCES `user_tomes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_tome_endorsements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_tomes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `authorUserId` int NOT NULL,
  `title` varchar(120) NOT NULL,
  `teaser` varchar(240) DEFAULT NULL,
  `body` text NOT NULL,
  `cycleIndex` varchar(32) DEFAULT NULL,
  `status` enum('draft','submitted','published','rejected','retired') NOT NULL DEFAULT 'draft',
  `moderatorNote` varchar(500) DEFAULT NULL,
  `moderatedByUserId` int DEFAULT NULL,
  `moderatedAt` timestamp NULL DEFAULT NULL,
  `endorsements` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_tomes_moderatedByUserId_users_id_fk` (`moderatedByUserId`),
  KEY `idx_user_tomes_author` (`authorUserId`),
  KEY `idx_user_tomes_status` (`status`),
  CONSTRAINT `user_tomes_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_tomes_moderatedByUserId_users_id_fk` FOREIGN KEY (`moderatedByUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `witnessed_ledger_pins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subjectUserId` int DEFAULT NULL,
  `headline` varchar(200) NOT NULL,
  `body` text,
  `category` varchar(32) NOT NULL DEFAULT 'chronicle',
  `rippleEventId` bigint DEFAULT NULL,
  `pinnedAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_witnessed_ledger_pinned_at` (`pinnedAt`),
  KEY `idx_witnessed_ledger_subject` (`subjectUserId`),
  CONSTRAINT `witnessed_ledger_pins_subjectUserId_users_id_fk` FOREIGN KEY (`subjectUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
