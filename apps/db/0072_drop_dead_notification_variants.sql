-- ─────────────────────────────────────────────────────────────────
-- Drop dead variants from `notifications.type`.
--
-- The `notification_enum_producers` ship-check (apps/shared/_completeness/
-- checks/notificationEnumProducers.ts) flagged variants declared in the
-- enum with no `type: "<variant>"` writer in apps/server/. We
-- triaged each: the active ones got real producers wired in this
-- batch (battle_pass_reward, boss_mastery, daily_reset, deep_trust,
-- epoch_quest, faction_war, pet_acquired, pvp_challenge, pvp_result,
-- recruitment, system, trade_declined, weekly_quest). The dead
-- variant — `syndicate_quest` — was a quest tier from an older
-- design with no server producer and no live consumer beyond a
-- client icon mapping (also removed in this batch).
--
-- Strict-mode guardrail: repoint any in-flight rows to a generic
-- `system` notification BEFORE tightening the enum so MySQL doesn't
-- reject the ALTER on existing data.
-- ─────────────────────────────────────────────────────────────────

UPDATE `notifications` SET `type` = 'system' WHERE `type` = 'syndicate_quest';

ALTER TABLE `notifications` MODIFY COLUMN `type` ENUM(
  'trade_offer','trade_accepted','trade_declined',
  'pvp_challenge','pvp_result','pvp_season_reward',
  'auction_outbid','auction_won','auction_ended',
  'market_sold','market_buy_filled',
  'faction_war','guild_invite','guild_message','guild_war_victory',
  'daily_reset','daily_login','quest_complete','weekly_quest','epoch_quest',
  'achievement','battle_pass_reward',
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
