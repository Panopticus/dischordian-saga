-- Pet system extension — skill nodes, quest flags, death/spectral, active party
--
-- Extends player_pets to persist the data that the client was previously
-- stashing in localStorage: skill tree unlocks, quest step completion
-- flags, death count + spectral form state, and active-party membership.
--
-- Mirrors the eidolon_bonds death model (deathCount/isSpectral/
-- spectralBonusSystem/deathCause) but scoped to the arena pet table so
-- the two systems evolve independently.
--
-- Also widens the notifications.type enum to include pet_death and
-- pet_acquired, which the new petDeath service + acquisition hooks
-- emit.

ALTER TABLE `player_pets`
  ADD COLUMN `unlockedSkillNodes` JSON DEFAULT ('[]'),
  ADD COLUMN `completedQuestSteps` JSON DEFAULT ('[]'),
  ADD COLUMN `deathCount` INT NOT NULL DEFAULT 0,
  ADD COLUMN `isSpectral` BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN `spectralBonusSystem` VARCHAR(64) DEFAULT NULL,
  ADD COLUMN `deathCause` VARCHAR(64) DEFAULT NULL,
  ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT TRUE;

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
