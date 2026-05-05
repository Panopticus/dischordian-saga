-- Pet system extension — skill nodes, quest flags, death/spectral, active party
--
-- Originally authored as 0037_pet_system_extension.sql. Renamed to 0048
-- to avoid colliding with three other branches that all chose 0037
-- (0037_dischordia_cycle, 0037_dead_mans_circuit_lifecycle,
-- 0037_pet_system_extension). The journal currently contains
-- 0037_dischordia_cycle as its canonical entry for idx 37;
--> statement-breakpoint the other
-- two — and this one — are orphaned until a broader journal
-- reconciliation lands. See apps/db/README.md §"Hand-written migrations".
--
-- This migration is written to be idempotent: each ADD COLUMN is
-- guarded by an INFORMATION_SCHEMA check so re-running it (e.g. after
-- a deploy that partially applied it, or after a drizzle-kit generate
-- round that already picked up the drift) is a no-op rather than a
-- "column already exists" failure.
--
-- Extends player_pets to persist the data the client was previously
-- stashing in localStorage: skill tree unlocks, quest step completion
-- flags, death count + spectral form state, and active-party membership.
-- Mirrors the eidolon_bonds death model (deathCount/isSpectral/
-- spectralBonusSystem/deathCause) but scoped to the arena pet table so
-- the two systems evolve independently.
--
-- Also widens the notifications.type enum to include pet_death and
-- pet_acquired, which the new petDeath service + acquisition hooks emit.
-- MySQL's `MODIFY COLUMN` rewrites the enum on every run — it is
-- naturally idempotent as long as the enum list is the full target set.

-- ─── Helper procedure: add a column only if it does not already exist ──
DROP PROCEDURE IF EXISTS addColumnIfMissing;
--> statement-breakpoint
DELIMITER //
CREATE PROCEDURE addColumnIfMissing(
  IN tableName VARCHAR(128),
  IN columnName VARCHAR(128),
  IN columnDef  VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = tableName
      AND column_name = columnName
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', columnDef);
--> statement-breakpoint
    PREPARE stmt FROM @sql;
--> statement-breakpoint
    EXECUTE stmt;
--> statement-breakpoint
    DEALLOCATE PREPARE stmt;
--> statement-breakpoint
  END IF;
--> statement-breakpoint
END //
DELIMITER ;
--> statement-breakpoint

CALL addColumnIfMissing('player_pets', 'unlockedSkillNodes',  'JSON DEFAULT (''[]'')');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'completedQuestSteps', 'JSON DEFAULT (''[]'')');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'deathCount',          'INT NOT NULL DEFAULT 0');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'isSpectral',          'BOOLEAN NOT NULL DEFAULT FALSE');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'spectralBonusSystem', 'VARCHAR(64) DEFAULT NULL');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'deathCause',          'VARCHAR(64) DEFAULT NULL');
--> statement-breakpoint
CALL addColumnIfMissing('player_pets', 'isActive',            'BOOLEAN NOT NULL DEFAULT TRUE');
--> statement-breakpoint

DROP PROCEDURE IF EXISTS addColumnIfMissing;
--> statement-breakpoint

-- ─── Widen notifications.type enum ──────────────────────────────────
-- Idempotent: MODIFY COLUMN always rewrites to the supplied list.
ALTER TABLE `notifications` MODIFY COLUMN `type` ENUM(
  'trade_offer','trade_accepted','trade_declined',
  'pvp_challenge','pvp_result','pvp_season_reward',
  'auction_outbid','auction_won','auction_ended',
  'market_sold','market_buy_filled',
  'faction_war','guild_invite','guild_message','guild_war_victory',
  'daily_reset','daily_login','quest_complete','weekly_quest','epoch_quest',
  'achievement','battle_pass_reward','syndicate_quest',
  'boss_mastery','seasonal_event','recruitment',
  'system',
  'feature_hint','lore_event','combat_achievement','streak_milestone',
  'progression','crafting_achievement','npc_reaction','archetype_emergence',
  'prestige_dialog','prestige_deferred_dialog','prestige_conditional_dialog',
  'companion_prestige_gesture','meme_broadcast','prestige_complete',
  'universe_event',
  'companion_death','companion_resurrected','eidolon_evolved','pet_evolved',
  'pet_death','pet_acquired',
  'apprentice_sacrificed','crew_cloned',
  'morality_threshold','morality_market_notice','content_discovery',
  'deep_trust','daily_brief_complete','outbreak_completed',
  'outbreak_component','battle_pass_tier_up'
) NOT NULL;
