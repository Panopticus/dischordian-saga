-- ════════════════════════════════════════════════════════════════
-- 0061_pvp_overhaul.sql
-- PvP overhaul migration: titles, conspiracy, ratings, guild
-- expansion, Tier 5 PvP variants, apprentice trials.
--
-- Hand-written. The drizzle-kit snapshot lineage was repaired in
-- T9.12 (0040 reparented to 0037 instead of forking from 0035) so
-- future schema additions can use `drizzle-kit generate` again,
-- but this PvP-overhaul migration was authored by hand and stays
-- authoritative for the table set it defines. Idempotent via
-- IF NOT EXISTS.
-- ════════════════════════════════════════════════════════════════

-- ─── TIER 1: TITLE SYSTEM ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `title_definitions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `titleKey` varchar(96) NOT NULL UNIQUE,
  `rootKey` varchar(64) NOT NULL,
  `tier` int NOT NULL DEFAULT 1,
  `name` varchar(128) NOT NULL,
  `description` text,
  `flavorText` text,
  `rarity` enum('common','rare','epic','legendary','mythic') NOT NULL DEFAULT 'rare',
  `category` enum('pvp_rank','narrative','mystery','coop','faction_guild','cross_game','cosmetic_purchase','seasonal') NOT NULL,
  `loredexEntityId` varchar(64),
  `iconKey` varchar(32) NOT NULL DEFAULT 'Award',
  `condition` json NOT NULL,
  `hidden` int NOT NULL DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_title_definitions_root` (`rootKey`),
  INDEX `idx_title_definitions_category` (`category`)
);

CREATE TABLE IF NOT EXISTS `user_titles` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `titleKey` varchar(96) NOT NULL,
  `earnedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `seasonNumber` int,
  `discoveryRank` int,
  INDEX `idx_user_titles_user_id` (`userId`),
  UNIQUE INDEX `uniq_user_titles_user_title` (`userId`, `titleKey`)
);

CREATE TABLE IF NOT EXISTS `user_cosmetic_loadout` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL UNIQUE,
  `equippedTitleKey` varchar(96),
  `equippedBadgeKey` varchar(96),
  `equippedFrameKey` varchar(96),
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- ─── TIER 2A: COMPETITIVE RATINGS ───────────────────────────────
CREATE TABLE IF NOT EXISTS `competitive_ratings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `gameType` varchar(32) NOT NULL,
  `currentElo` int NOT NULL DEFAULT 1200,
  `peakElo` int NOT NULL DEFAULT 1200,
  `wins` int NOT NULL DEFAULT 0,
  `losses` int NOT NULL DEFAULT 0,
  `draws` int NOT NULL DEFAULT 0,
  `winStreak` int NOT NULL DEFAULT 0,
  `bestStreak` int NOT NULL DEFAULT 0,
  `rankTier` varchar(32) NOT NULL DEFAULT 'bronze',
  `placementMatchesPlayed` int NOT NULL DEFAULT 0,
  `lastMatchAt` timestamp,
  `lastDecayAt` timestamp,
  `seasonNumber` int NOT NULL DEFAULT 1,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_competitive_ratings_user_id` (`userId`),
  INDEX `idx_competitive_ratings_game_type` (`gameType`),
  UNIQUE INDEX `uniq_competitive_ratings_user_game_type` (`userId`, `gameType`)
);

-- ─── TIER 2B: WITNESSING DISCOVERY RACE ─────────────────────────
CREATE TABLE IF NOT EXISTS `discovery_events` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `eventKey` varchar(96) NOT NULL UNIQUE,
  `firstDiscovererUserId` int NOT NULL,
  `firstDiscovererGuildId` int,
  `discoveredAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `serverWideRevealedAt` timestamp,
  `factionAlignment` varchar(32),
  INDEX `idx_discovery_events_event_key` (`eventKey`),
  INDEX `idx_discovery_events_first_user` (`firstDiscovererUserId`)
);

CREATE TABLE IF NOT EXISTS `conspiracy_boards` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `boardKey` varchar(64) NOT NULL UNIQUE,
  `name` varchar(128) NOT NULL,
  `description` text,
  `cluesRequired` int NOT NULL,
  `acceptedClues` json NOT NULL,
  `factionAlignment` varchar(32),
  `active` int NOT NULL DEFAULT 1,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `user_clue_progress` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `boardKey` varchar(64) NOT NULL,
  `cluesGathered` json NOT NULL,
  `solvedAt` timestamp,
  `isFirstDiscoverer` int NOT NULL DEFAULT 0,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_user_clue_progress_user_id` (`userId`),
  UNIQUE INDEX `uniq_user_clue_progress_user_board` (`userId`, `boardKey`)
);

CREATE TABLE IF NOT EXISTS `guild_clue_progress` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL,
  `boardKey` varchar(64) NOT NULL,
  `cluesGathered` json NOT NULL,
  `contributors` json NOT NULL,
  `solvedAt` timestamp,
  `isFirstDiscoverer` int NOT NULL DEFAULT 0,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_clue_progress_guild_id` (`guildId`),
  -- T9.13: drives Oracle Pool peek scan (board-leading, then guild filter).
  INDEX `idx_guild_clue_progress_board_id` (`boardKey`, `guildId`),
  UNIQUE INDEX `uniq_guild_clue_progress_guild_board` (`guildId`, `boardKey`)
);

-- ─── TIER 4: GUILD EXPANSION ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `guild_perks` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `perkKey` varchar(64) NOT NULL UNIQUE,
  `name` varchar(128) NOT NULL,
  `description` text,
  `bonusType` varchar(32) NOT NULL,
  `magnitude` int NOT NULL,
  `requiredHallTier` int NOT NULL DEFAULT 1,
  `requiredXp` int NOT NULL DEFAULT 0,
  `factionAlignment` varchar(32),
  `iconKey` varchar(32) NOT NULL DEFAULT 'Sparkles',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `guild_unlocked_perks` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL,
  `perkKey` varchar(64) NOT NULL,
  `unlockedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_unlocked_perks_guild_id` (`guildId`),
  UNIQUE INDEX `uniq_guild_unlocked_perks_guild_perk` (`guildId`, `perkKey`)
);

CREATE TABLE IF NOT EXISTS `guild_quest_definitions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `questKey` varchar(64) NOT NULL UNIQUE,
  `scope` enum('daily','weekly','seasonal') NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` text,
  `condition` json NOT NULL,
  `rewards` json NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `guild_quest_progress` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL,
  `questKey` varchar(64) NOT NULL,
  `progress` int NOT NULL DEFAULT 0,
  `target` int NOT NULL,
  `completedAt` timestamp,
  `rewardClaimed` int NOT NULL DEFAULT 0,
  `resetAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_quest_progress_guild_id` (`guildId`),
  UNIQUE INDEX `uniq_guild_quest_progress_guild_quest` (`guildId`, `questKey`)
);

CREATE TABLE IF NOT EXISTS `guild_cosmetics` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL UNIQUE,
  `bannerKey` varchar(64),
  `mottoText` varchar(80),
  `emblemKey` varchar(64),
  `unlockedBanners` json NOT NULL,
  `unlockedEmblems` json NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `guild_stash` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL,
  `slotKey` varchar(64) NOT NULL,
  `itemType` varchar(32) NOT NULL,
  `itemKey` varchar(96) NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `depositorUserId` int NOT NULL,
  `depositedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_stash_guild_id` (`guildId`),
  UNIQUE INDEX `uniq_guild_stash_guild_slot` (`guildId`, `slotKey`)
);

CREATE TABLE IF NOT EXISTS `guild_stash_log` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `guildId` int NOT NULL,
  `userId` int NOT NULL,
  `action` enum('deposit','withdraw') NOT NULL,
  `itemType` varchar(32) NOT NULL,
  `itemKey` varchar(96) NOT NULL,
  `quantity` int NOT NULL,
  `at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_stash_log_guild_id` (`guildId`)
);

-- ─── TIER 5: PVP VARIANTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `circuit_pvp_matches` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `matchId` varchar(64) NOT NULL UNIQUE,
  `player1Id` int NOT NULL,
  `player2Id` int NOT NULL,
  `trackSeed` varchar(64) NOT NULL,
  `player1Score` int,
  `player2Score` int,
  `winnerId` int,
  `format` varchar(32) NOT NULL DEFAULT 'single_race',
  `status` enum('queued','active','completed','abandoned') NOT NULL DEFAULT 'queued',
  `startedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `endedAt` timestamp
);

CREATE TABLE IF NOT EXISTS `trade_sector_control` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sectorId` varchar(64) NOT NULL,
  `lordUserId` int,
  `weekStart` timestamp NOT NULL,
  `contributionScores` json NOT NULL,
  `active` int NOT NULL DEFAULT 1,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_trade_sector_control_sector_id` (`sectorId`),
  UNIQUE INDEX `uniq_trade_sector_control_sector_week` (`sectorId`, `weekStart`)
);

CREATE TABLE IF NOT EXISTS `trade_oracle_duels` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `duelId` varchar(64) NOT NULL UNIQUE,
  `callerUserId` int NOT NULL,
  `putUserId` int NOT NULL,
  `sectorId` varchar(64) NOT NULL,
  `strikePrice` int NOT NULL,
  `settlementPrice` int,
  `winnerId` int,
  `status` enum('open','settled','abandoned') NOT NULL DEFAULT 'open',
  `openedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `settlesAt` timestamp NOT NULL,
  `settledAt` timestamp
);

CREATE TABLE IF NOT EXISTS `cades_pvp_matches` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `matchId` varchar(64) NOT NULL UNIQUE,
  `player1Id` int NOT NULL,
  `player2Id` int,
  `scenarioSeed` varchar(64) NOT NULL,
  `scenarioMode` varchar(32) NOT NULL DEFAULT 'last_stand',
  `player1Score` int,
  `player2Score` int,
  `winnerId` int,
  `status` enum('pending','p1_done','p2_done','completed','abandoned') NOT NULL DEFAULT 'pending',
  `startedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `endedAt` timestamp
);

CREATE TABLE IF NOT EXISTS `td_live_sieges` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `siegeId` varchar(64) NOT NULL UNIQUE,
  `attackerUserId` int NOT NULL,
  `defenderUserId` int NOT NULL,
  `waveCount` int NOT NULL DEFAULT 0,
  `starsAwarded` int NOT NULL DEFAULT 0,
  `defenseHeld` int NOT NULL DEFAULT 0,
  `trophyDelta` int NOT NULL DEFAULT 0,
  `status` enum('active','completed','abandoned') NOT NULL DEFAULT 'active',
  `startedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `endedAt` timestamp
);

CREATE TABLE IF NOT EXISTS `guild_war_skirmishes` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `skirmishId` varchar(64) NOT NULL UNIQUE,
  `guildAId` int NOT NULL,
  `guildBId` int NOT NULL,
  `modeMatchIds` json NOT NULL,
  `modeOutcomes` json NOT NULL,
  `winnerGuildId` int,
  `status` enum('proposed','accepted','active','completed','abandoned') NOT NULL DEFAULT 'proposed',
  `declaredAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `acceptedAt` timestamp,
  `completedAt` timestamp,
  INDEX `idx_guild_war_skirmishes_guilds` (`guildAId`, `guildBId`)
);

CREATE TABLE IF NOT EXISTS `guild_war_skirmish_matches` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `skirmishId` varchar(64) NOT NULL,
  `mode` varchar(32) NOT NULL,
  `guildAPlayerId` int NOT NULL,
  `guildBPlayerId` int NOT NULL,
  `underlyingMatchId` varchar(64),
  `outcome` varchar(16) NOT NULL DEFAULT 'pending',
  `recordedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_guild_war_skirmish_matches_skirmish` (`skirmishId`)
);

-- ─── APPRENTICE TRIAL + BACKFILL MARKER ─────────────────────────
CREATE TABLE IF NOT EXISTS `apprentice_trial_completions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `cohortNumber` int NOT NULL,
  `apprenticeName` varchar(96) NOT NULL,
  `archetype` varchar(32) NOT NULL,
  `graduated` int NOT NULL DEFAULT 0,
  `daySurvived` int NOT NULL,
  `cohortSize` int NOT NULL,
  `recordedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_apprentice_trial_user_id` (`userId`),
  UNIQUE INDEX `uniq_apprentice_trial_user_cohort` (`userId`, `cohortNumber`)
);

CREATE TABLE IF NOT EXISTS `competitive_ratings_backfill` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `version` varchar(32) NOT NULL UNIQUE,
  `cardMirrored` int NOT NULL DEFAULT 0,
  `chessMirrored` int NOT NULL DEFAULT 0,
  `ranAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tier 8: moderation reports table
CREATE TABLE IF NOT EXISTS `pvp_moderation_reports` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `reporterId` int NOT NULL,
  `targetKind` varchar(32) NOT NULL,
  `targetId` int NOT NULL,
  `contentSnapshot` text,
  `reason` varchar(64) NOT NULL,
  `details` text,
  `status` enum('open','resolved_action','resolved_no_action','duplicate') NOT NULL DEFAULT 'open',
  `resolvedByUserId` int,
  `resolvedAt` timestamp,
  `resolutionNotes` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_pvp_moderation_reports_status` (`status`),
  INDEX `idx_pvp_moderation_reports_target` (`targetKind`, `targetId`)
);

-- T9.13: Oracle Pool peek index — adds the board-leading index when
-- upgrading an existing deployment. Fresh DBs already get it via the
-- CREATE TABLE above. MySQL <8.0.29 lacks `CREATE INDEX IF NOT EXISTS`,
-- so we check INFORMATION_SCHEMA before issuing the DDL.
SET @idx_exists := (
  SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'guild_clue_progress'
     AND INDEX_NAME = 'idx_guild_clue_progress_board_id'
);
SET @sql := IF(
  @idx_exists = 0,
  'CREATE INDEX `idx_guild_clue_progress_board_id` ON `guild_clue_progress` (`boardKey`, `guildId`)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

