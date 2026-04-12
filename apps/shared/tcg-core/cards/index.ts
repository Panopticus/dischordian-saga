/**
 * Card registry barrel — 294 Season 1 cards + 6 token(s) = 300 definitions.
 */
import type { CardDefinition } from "../index";

/* ─── Antiquarian ─── */
import { cardDef as gen_antiquarian } from "./definitions/antiquarian/gen_antiquarian.ts";
import { cardDef as s1_char_018_the_antiquarian } from "./definitions/antiquarian/s1_char_018_the_antiquarian.ts";
import { cardDef as s1_char_043_the_programmer } from "./definitions/antiquarian/s1_char_043_the_programmer.ts";
import { cardDef as s1_char_058_epoch_walker } from "./definitions/antiquarian/s1_char_058_epoch_walker.ts";
import { cardDef as s1_char_059_chronosplicer } from "./definitions/antiquarian/s1_char_059_chronosplicer.ts";
import { cardDef as s1_char_060_relic_keeper } from "./definitions/antiquarian/s1_char_060_relic_keeper.ts";
import { cardDef as s1_char_061_temporal_archivist } from "./definitions/antiquarian/s1_char_061_temporal_archivist.ts";
import { cardDef as s1_char_062_hourglass_golem } from "./definitions/antiquarian/s1_char_062_hourglass_golem.ts";
import { cardDef as s1_char_063_paradox_acolyte } from "./definitions/antiquarian/s1_char_063_paradox_acolyte.ts";
import { cardDef as s1_char_064_memory_thief } from "./definitions/antiquarian/s1_char_064_memory_thief.ts";
import { cardDef as s1_char_065_age_ender } from "./definitions/antiquarian/s1_char_065_age_ender.ts";
import { cardDef as s1_char_121_epoch_watcher } from "./definitions/antiquarian/s1_char_121_epoch_watcher.ts";
import { cardDef as s1_char_122_timeline_splitter } from "./definitions/antiquarian/s1_char_122_timeline_splitter.ts";
import { cardDef as s1_char_123_relic_scholar } from "./definitions/antiquarian/s1_char_123_relic_scholar.ts";
import { cardDef as s1_char_124_age_walker } from "./definitions/antiquarian/s1_char_124_age_walker.ts";
import { cardDef as s1_char_201_chronoguard_sentinel } from "./definitions/antiquarian/s1_char_201_chronoguard_sentinel.ts";
import { cardDef as s1_reward_campaign_acceptance } from "./definitions/antiquarian/s1_reward_campaign_acceptance.ts";
import { cardDef as s1_reward_discovery_all } from "./definitions/antiquarian/s1_reward_discovery_all.ts";
import { cardDef as s1_reward_lore_archivist } from "./definitions/antiquarian/s1_reward_lore_archivist.ts";
import { cardDef as s1_reward_outbreak_cure } from "./definitions/antiquarian/s1_reward_outbreak_cure.ts";
import { cardDef as s1_reward_rpg_quest } from "./definitions/antiquarian/s1_reward_rpg_quest.ts";
import { cardDef as s1_reward_vote_t1_acceptance } from "./definitions/antiquarian/s1_reward_vote_t1_acceptance.ts";
import { cardDef as s1_spell_120_timeline_collapse } from "./definitions/antiquarian/s1_spell_120_timeline_collapse.ts";
import { cardDef as s1_spell_121_epoch_rewind } from "./definitions/antiquarian/s1_spell_121_epoch_rewind.ts";
import { cardDef as s1_spell_122_archaeological_dig } from "./definitions/antiquarian/s1_spell_122_archaeological_dig.ts";
import { cardDef as s1_spell_230_chrono_anchor } from "./definitions/antiquarian/s1_spell_230_chrono_anchor.ts";
import { cardDef as s1_spell_231_temporal_fracture } from "./definitions/antiquarian/s1_spell_231_temporal_fracture.ts";
import { cardDef as s1_spell_232_fossil_record } from "./definitions/antiquarian/s1_spell_232_fossil_record.ts";
import { cardDef as s1_spell_233_era_shift } from "./definitions/antiquarian/s1_spell_233_era_shift.ts";
import { cardDef as s1_spell_234_preservation_field } from "./definitions/antiquarian/s1_spell_234_preservation_field.ts";
import { cardDef as s1_spell_235_age_of_silence } from "./definitions/antiquarian/s1_spell_235_age_of_silence.ts";

/* ─── Architect ─── */
import { cardDef as gen_architect } from "./definitions/architect/gen_architect.ts";
import { cardDef as s1_char_006_dr_lyra_vox } from "./definitions/architect/s1_char_006_dr_lyra_vox.ts";
import { cardDef as s1_char_007_general_alarik } from "./definitions/architect/s1_char_007_general_alarik.ts";
import { cardDef as s1_char_008_general_binath } from "./definitions/architect/s1_char_008_general_binath.ts";
import { cardDef as s1_char_009_general_prometheus } from "./definitions/architect/s1_char_009_general_prometheus.ts";
import { cardDef as s1_char_013_master_of_rlyeh } from "./definitions/architect/s1_char_013_master_of_rlyeh.ts";
import { cardDef as s1_char_015_panoptic_elara } from "./definitions/architect/s1_char_015_panoptic_elara.ts";
import { cardDef as s1_char_016_senator_elara_voss } from "./definitions/architect/s1_char_016_senator_elara_voss.ts";
import { cardDef as s1_char_019_the_architect } from "./definitions/architect/s1_char_019_the_architect.ts";
import { cardDef as s1_char_021_the_conexus } from "./definitions/architect/s1_char_021_the_conexus.ts";
import { cardDef as s1_char_022_the_collector } from "./definitions/architect/s1_char_022_the_collector.ts";
import { cardDef as s1_char_024_the_detective } from "./definitions/architect/s1_char_024_the_detective.ts";
import { cardDef as s1_char_030_the_game_master } from "./definitions/architect/s1_char_030_the_game_master.ts";
import { cardDef as s1_char_035_the_jailer } from "./definitions/architect/s1_char_035_the_jailer.ts";
import { cardDef as s1_char_038_the_meme } from "./definitions/architect/s1_char_038_the_meme.ts";
import { cardDef as s1_char_039_the_necromancer } from "./definitions/architect/s1_char_039_the_necromancer.ts";
import { cardDef as s1_char_042_the_politician } from "./definitions/architect/s1_char_042_the_politician.ts";
import { cardDef as s1_char_100_the_collector } from "./definitions/architect/s1_char_100_the_collector.ts";
import { cardDef as s1_char_101_panoptic_warden_foucault } from "./definitions/architect/s1_char_101_panoptic_warden_foucault.ts";
import { cardDef as s1_char_102_arena_enforcer } from "./definitions/architect/s1_char_102_arena_enforcer.ts";
import { cardDef as s1_char_103_inception_ark_sentry } from "./definitions/architect/s1_char_103_inception_ark_sentry.ts";
import { cardDef as s1_char_104_white_oracle } from "./definitions/architect/s1_char_104_white_oracle.ts";
import { cardDef as s1_reward_boss_architect } from "./definitions/architect/s1_reward_boss_architect.ts";
import { cardDef as s1_reward_boss_collector } from "./definitions/architect/s1_reward_boss_collector.ts";
import { cardDef as s1_reward_casino_pazaak } from "./definitions/architect/s1_reward_casino_pazaak.ts";
import { cardDef as s1_reward_chess_tourney } from "./definitions/architect/s1_reward_chess_tourney.ts";
import { cardDef as s1_reward_chess_win } from "./definitions/architect/s1_reward_chess_win.ts";
import { cardDef as s1_reward_class_engineer } from "./definitions/architect/s1_reward_class_engineer.ts";
import { cardDef as s1_reward_companion_human } from "./definitions/architect/s1_reward_companion_human.ts";
import { cardDef as s1_reward_crew_clone } from "./definitions/architect/s1_reward_crew_clone.ts";
import { cardDef as s1_reward_eidolon_cipher } from "./definitions/architect/s1_reward_eidolon_cipher.ts";
import { cardDef as s1_reward_station_complete } from "./definitions/architect/s1_reward_station_complete.ts";
import { cardDef as s1_reward_station_module } from "./definitions/architect/s1_reward_station_module.ts";
import { cardDef as s1_reward_tower_wave50 } from "./definitions/architect/s1_reward_tower_wave50.ts";
import { cardDef as s1_spell_100_schematic_override } from "./definitions/architect/s1_spell_100_schematic_override.ts";
import { cardDef as s1_spell_101_predetermined_outcome } from "./definitions/architect/s1_spell_101_predetermined_outcome.ts";
import { cardDef as s1_spell_102_arena_protocol } from "./definitions/architect/s1_spell_102_arena_protocol.ts";
import { cardDef as s1_spell_103_recursive_calibration } from "./definitions/architect/s1_spell_103_recursive_calibration.ts";
import { cardDef as s1_spell_200_surveillance_grid } from "./definitions/architect/s1_spell_200_surveillance_grid.ts";
import { cardDef as s1_spell_201_protocol_override } from "./definitions/architect/s1_spell_201_protocol_override.ts";
import { cardDef as s1_spell_202_system_purge } from "./definitions/architect/s1_spell_202_system_purge.ts";
import { cardDef as s1_spell_203_calculated_retreat } from "./definitions/architect/s1_spell_203_calculated_retreat.ts";
import { cardDef as s1_spell_204_architects_mandate } from "./definitions/architect/s1_spell_204_architects_mandate.ts";
import { cardDef as s1_spell_205_panoptic_lockdown } from "./definitions/architect/s1_spell_205_panoptic_lockdown.ts";

/* ─── Dreamer ─── */
import { cardDef as gen_dreamer } from "./definitions/dreamer/gen_dreamer.ts";
import { cardDef as s1_char_005_destiny } from "./definitions/dreamer/s1_char_005_destiny.ts";
import { cardDef as s1_char_014_nythera } from "./definitions/dreamer/s1_char_014_nythera.ts";
import { cardDef as s1_char_017_the_advocate } from "./definitions/dreamer/s1_char_017_the_advocate.ts";
import { cardDef as s1_char_023_the_degen } from "./definitions/dreamer/s1_char_023_the_degen.ts";
import { cardDef as s1_char_025_the_dreamer } from "./definitions/dreamer/s1_char_025_the_dreamer.ts";
import { cardDef as s1_char_027_the_enigma } from "./definitions/dreamer/s1_char_027_the_enigma.ts";
import { cardDef as s1_char_029_the_forgotten } from "./definitions/dreamer/s1_char_029_the_forgotten.ts";
import { cardDef as s1_char_034_the_inventor } from "./definitions/dreamer/s1_char_034_the_inventor.ts";
import { cardDef as s1_char_036_the_judge } from "./definitions/dreamer/s1_char_036_the_judge.ts";
import { cardDef as s1_char_037_the_knowledge } from "./definitions/dreamer/s1_char_037_the_knowledge.ts";
import { cardDef as s1_char_045_the_resurrectionist } from "./definitions/dreamer/s1_char_045_the_resurrectionist.ts";
import { cardDef as s1_char_046_the_seer } from "./definitions/dreamer/s1_char_046_the_seer.ts";
import { cardDef as s1_char_109_the_enigma } from "./definitions/dreamer/s1_char_109_the_enigma.ts";
import { cardDef as s1_char_110_prophecy_keeper } from "./definitions/dreamer/s1_char_110_prophecy_keeper.ts";
import { cardDef as s1_char_111_vision_walker } from "./definitions/dreamer/s1_char_111_vision_walker.ts";
import { cardDef as s1_char_112_reality_anchor } from "./definitions/dreamer/s1_char_112_reality_anchor.ts";
import { cardDef as s1_char_203_astral_warden } from "./definitions/dreamer/s1_char_203_astral_warden.ts";
import { cardDef as s1_reward_campaign_finale } from "./definitions/dreamer/s1_reward_campaign_finale.ts";
import { cardDef as s1_reward_campaign_truth } from "./definitions/dreamer/s1_reward_campaign_truth.ts";
import { cardDef as s1_reward_casino_dice } from "./definitions/dreamer/s1_reward_casino_dice.ts";
import { cardDef as s1_reward_class_neyon } from "./definitions/dreamer/s1_reward_class_neyon.ts";
import { cardDef as s1_reward_class_oracle } from "./definitions/dreamer/s1_reward_class_oracle.ts";
import { cardDef as s1_reward_cycle_light } from "./definitions/dreamer/s1_reward_cycle_light.ts";
import { cardDef as s1_reward_eidolon_lux } from "./definitions/dreamer/s1_reward_eidolon_lux.ts";
import { cardDef as s1_reward_palimpsest_signal } from "./definitions/dreamer/s1_reward_palimpsest_signal.ts";
import { cardDef as s1_reward_vortex_close } from "./definitions/dreamer/s1_reward_vortex_close.ts";
import { cardDef as s1_reward_vortex_master } from "./definitions/dreamer/s1_reward_vortex_master.ts";
import { cardDef as s1_reward_vote_t1_truth } from "./definitions/dreamer/s1_reward_vote_t1_truth.ts";
import { cardDef as s1_song_082_top_floor_door } from "./definitions/dreamer/s1_song_082_top_floor_door.ts";
import { cardDef as s1_spell_108_prophetic_collapse } from "./definitions/dreamer/s1_spell_108_prophetic_collapse.ts";
import { cardDef as s1_spell_109_vision_cascade } from "./definitions/dreamer/s1_spell_109_vision_cascade.ts";
import { cardDef as s1_spell_110_dream_walk } from "./definitions/dreamer/s1_spell_110_dream_walk.ts";
import { cardDef as s1_spell_111_probability_storm } from "./definitions/dreamer/s1_spell_111_probability_storm.ts";
import { cardDef as s1_spell_212_lucid_clarity } from "./definitions/dreamer/s1_spell_212_lucid_clarity.ts";
import { cardDef as s1_spell_213_precognition } from "./definitions/dreamer/s1_spell_213_precognition.ts";
import { cardDef as s1_spell_214_minds_eye } from "./definitions/dreamer/s1_spell_214_minds_eye.ts";
import { cardDef as s1_spell_215_reality_fracture } from "./definitions/dreamer/s1_spell_215_reality_fracture.ts";
import { cardDef as s1_spell_216_oracles_blessing } from "./definitions/dreamer/s1_spell_216_oracles_blessing.ts";
import { cardDef as s1_spell_217_dream_weave } from "./definitions/dreamer/s1_spell_217_dream_weave.ts";

/* ─── Insurgency ─── */
import { cardDef as gen_insurgency } from "./definitions/insurgency/gen_insurgency.ts";
import { cardDef as s1_char_002_agent_zero } from "./definitions/insurgency/s1_char_002_agent_zero.ts";
import { cardDef as s1_char_010_iron_lion } from "./definitions/insurgency/s1_char_010_iron_lion.ts";
import { cardDef as s1_char_011_jericho_jones } from "./definitions/insurgency/s1_char_011_jericho_jones.ts";
import { cardDef as s1_char_012_kael } from "./definitions/insurgency/s1_char_012_kael.ts";
import { cardDef as s1_char_026_the_engineer } from "./definitions/insurgency/s1_char_026_the_engineer.ts";
import { cardDef as s1_char_028_the_eyes } from "./definitions/insurgency/s1_char_028_the_eyes.ts";
import { cardDef as s1_char_031_the_hierophant } from "./definitions/insurgency/s1_char_031_the_hierophant.ts";
import { cardDef as s1_char_040_the_nomad } from "./definitions/insurgency/s1_char_040_the_nomad.ts";
import { cardDef as s1_char_041_the_oracle } from "./definitions/insurgency/s1_char_041_the_oracle.ts";
import { cardDef as s1_char_044_the_recruiter } from "./definitions/insurgency/s1_char_044_the_recruiter.ts";
import { cardDef as s1_char_047_the_shadow_tongue } from "./definitions/insurgency/s1_char_047_the_shadow_tongue.ts";
import { cardDef as s1_char_105_iron_lion } from "./definitions/insurgency/s1_char_105_iron_lion.ts";
import { cardDef as s1_char_106_wraith_calder } from "./definitions/insurgency/s1_char_106_wraith_calder.ts";
import { cardDef as s1_char_107_signal_operative } from "./definitions/insurgency/s1_char_107_signal_operative.ts";
import { cardDef as s1_char_108_guerrilla_cell } from "./definitions/insurgency/s1_char_108_guerrilla_cell.ts";
import { cardDef as s1_char_202_saboteur } from "./definitions/insurgency/s1_char_202_saboteur.ts";
import { cardDef as s1_reward_campaign_defiance } from "./definitions/insurgency/s1_reward_campaign_defiance.ts";
import { cardDef as s1_reward_class_spy } from "./definitions/insurgency/s1_reward_class_spy.ts";
import { cardDef as s1_reward_companion_zero } from "./definitions/insurgency/s1_reward_companion_zero.ts";
import { cardDef as s1_reward_crew_mission } from "./definitions/insurgency/s1_reward_crew_mission.ts";
import { cardDef as s1_reward_eidolon_echo } from "./definitions/insurgency/s1_reward_eidolon_echo.ts";
import { cardDef as s1_reward_guild_recruit } from "./definitions/insurgency/s1_reward_guild_recruit.ts";
import { cardDef as s1_reward_trade_insurgency } from "./definitions/insurgency/s1_reward_trade_insurgency.ts";
import { cardDef as s1_reward_vote_t1_defiance } from "./definitions/insurgency/s1_reward_vote_t1_defiance.ts";
import { cardDef as s1_song_091_i_love_war } from "./definitions/insurgency/s1_song_091_i_love_war.ts";
import { cardDef as s1_spell_104_signal_intercept } from "./definitions/insurgency/s1_spell_104_signal_intercept.ts";
import { cardDef as s1_spell_105_guerrilla_strike } from "./definitions/insurgency/s1_spell_105_guerrilla_strike.ts";
import { cardDef as s1_spell_106_encrypted_broadcast } from "./definitions/insurgency/s1_spell_106_encrypted_broadcast.ts";
import { cardDef as s1_spell_107_dead_frequency_jam } from "./definitions/insurgency/s1_spell_107_dead_frequency_jam.ts";
import { cardDef as s1_spell_206_supply_drop } from "./definitions/insurgency/s1_spell_206_supply_drop.ts";
import { cardDef as s1_spell_207_ambush_protocol } from "./definitions/insurgency/s1_spell_207_ambush_protocol.ts";
import { cardDef as s1_spell_208_rebel_yell } from "./definitions/insurgency/s1_spell_208_rebel_yell.ts";
import { cardDef as s1_spell_209_safe_house } from "./definitions/insurgency/s1_spell_209_safe_house.ts";
import { cardDef as s1_spell_210_intel_leak } from "./definitions/insurgency/s1_spell_210_intel_leak.ts";
import { cardDef as s1_spell_211_scorched_earth } from "./definitions/insurgency/s1_spell_211_scorched_earth.ts";

/* ─── Neutral ─── */
import { cardDef as gen_neutral } from "./definitions/neutral/gen_neutral.ts";
import { cardDef as s1_char_004_ambassador_veron } from "./definitions/neutral/s1_char_004_ambassador_veron.ts";
import { cardDef as s1_char_086_wandering_merchant } from "./definitions/neutral/s1_char_086_wandering_merchant.ts";
import { cardDef as s1_char_087_scrapyard_golem } from "./definitions/neutral/s1_char_087_scrapyard_golem.ts";
import { cardDef as s1_char_088_field_medic } from "./definitions/neutral/s1_char_088_field_medic.ts";
import { cardDef as s1_char_089_courier_sprite } from "./definitions/neutral/s1_char_089_courier_sprite.ts";
import { cardDef as s1_char_090_hired_blade } from "./definitions/neutral/s1_char_090_hired_blade.ts";
import { cardDef as s1_char_091_border_scout } from "./definitions/neutral/s1_char_091_border_scout.ts";
import { cardDef as s1_char_092_ruin_stalker } from "./definitions/neutral/s1_char_092_ruin_stalker.ts";
import { cardDef as s1_char_093_ironclad_veteran } from "./definitions/neutral/s1_char_093_ironclad_veteran.ts";
import { cardDef as s1_reward_bonus_complete } from "./definitions/neutral/s1_reward_bonus_complete.ts";
import { cardDef as s1_reward_campaign_balanced } from "./definitions/neutral/s1_reward_campaign_balanced.ts";
import { cardDef as s1_reward_campaign_empathy } from "./definitions/neutral/s1_reward_campaign_empathy.ts";
import { cardDef as s1_reward_casino_jackpot } from "./definitions/neutral/s1_reward_casino_jackpot.ts";
import { cardDef as s1_reward_casino_slots } from "./definitions/neutral/s1_reward_casino_slots.ts";
import { cardDef as s1_reward_challenge_streak } from "./definitions/neutral/s1_reward_challenge_streak.ts";
import { cardDef as s1_reward_companion_all } from "./definitions/neutral/s1_reward_companion_all.ts";
import { cardDef as s1_reward_companion_elara } from "./definitions/neutral/s1_reward_companion_elara.ts";
import { cardDef as s1_reward_companion_max } from "./definitions/neutral/s1_reward_companion_max.ts";
import { cardDef as s1_reward_crew_bloodline } from "./definitions/neutral/s1_reward_crew_bloodline.ts";
import { cardDef as s1_reward_crew_incubator } from "./definitions/neutral/s1_reward_crew_incubator.ts";
import { cardDef as s1_reward_daily_streak } from "./definitions/neutral/s1_reward_daily_streak.ts";
import { cardDef as s1_reward_draft_perfect } from "./definitions/neutral/s1_reward_draft_perfect.ts";
import { cardDef as s1_reward_draft_winner } from "./definitions/neutral/s1_reward_draft_winner.ts";
import { cardDef as s1_reward_graduate_deploy } from "./definitions/neutral/s1_reward_graduate_deploy.ts";
import { cardDef as s1_reward_graduate_master } from "./definitions/neutral/s1_reward_graduate_master.ts";
import { cardDef as s1_reward_guild_founder } from "./definitions/neutral/s1_reward_guild_founder.ts";
import { cardDef as s1_reward_guild_hall } from "./definitions/neutral/s1_reward_guild_hall.ts";
import { cardDef as s1_reward_guild_officer } from "./definitions/neutral/s1_reward_guild_officer.ts";
import { cardDef as s1_reward_pet_evolve } from "./definitions/neutral/s1_reward_pet_evolve.ts";
import { cardDef as s1_reward_pet_streak } from "./definitions/neutral/s1_reward_pet_streak.ts";
import { cardDef as s1_reward_prestige_t1 } from "./definitions/neutral/s1_reward_prestige_t1.ts";
import { cardDef as s1_reward_prestige_t3 } from "./definitions/neutral/s1_reward_prestige_t3.ts";
import { cardDef as s1_reward_prestige_t5 } from "./definitions/neutral/s1_reward_prestige_t5.ts";
import { cardDef as s1_reward_prestige_t7 } from "./definitions/neutral/s1_reward_prestige_t7.ts";
import { cardDef as s1_reward_pvp_bronze } from "./definitions/neutral/s1_reward_pvp_bronze.ts";
import { cardDef as s1_reward_pvp_diamond } from "./definitions/neutral/s1_reward_pvp_diamond.ts";
import { cardDef as s1_reward_pvp_gold } from "./definitions/neutral/s1_reward_pvp_gold.ts";
import { cardDef as s1_reward_pvp_legend } from "./definitions/neutral/s1_reward_pvp_legend.ts";
import { cardDef as s1_reward_raid_boss } from "./definitions/neutral/s1_reward_raid_boss.ts";
import { cardDef as s1_reward_raid_contrib } from "./definitions/neutral/s1_reward_raid_contrib.ts";
import { cardDef as s1_reward_raid_perfect } from "./definitions/neutral/s1_reward_raid_perfect.ts";
import { cardDef as s1_reward_seasonal_s1 } from "./definitions/neutral/s1_reward_seasonal_s1.ts";
import { cardDef as s1_reward_vote_t1_balanced } from "./definitions/neutral/s1_reward_vote_t1_balanced.ts";
import { cardDef as s1_reward_vote_t1_empathy } from "./definitions/neutral/s1_reward_vote_t1_empathy.ts";
import { cardDef as s1_reward_xmas_charity } from "./definitions/neutral/s1_reward_xmas_charity.ts";
import { cardDef as s1_reward_xmas_gift } from "./definitions/neutral/s1_reward_xmas_gift.ts";
import { cardDef as s1_song_059_lip_service } from "./definitions/neutral/s1_song_059_lip_service.ts";
import { cardDef as s1_song_060_nonos } from "./definitions/neutral/s1_song_060_nonos.ts";
import { cardDef as s1_song_061_the_enigmas_lament } from "./definitions/neutral/s1_song_061_the_enigmas_lament.ts";
import { cardDef as s1_song_062_the_two_witnesses } from "./definitions/neutral/s1_song_062_the_two_witnesses.ts";
import { cardDef as s1_song_063_building_the_architect } from "./definitions/neutral/s1_song_063_building_the_architect.ts";
import { cardDef as s1_song_064_dischordian_logic } from "./definitions/neutral/s1_song_064_dischordian_logic.ts";
import { cardDef as s1_song_065_sixth_sense } from "./definitions/neutral/s1_song_065_sixth_sense.ts";
import { cardDef as s1_song_066_the_book_of_daniel } from "./definitions/neutral/s1_song_066_the_book_of_daniel.ts";
import { cardDef as s1_song_070_traces_of_something_spiritual } from "./definitions/neutral/s1_song_070_traces_of_something_spiritual.ts";
import { cardDef as s1_song_079_shades_of_grey } from "./definitions/neutral/s1_song_079_shades_of_grey.ts";
import { cardDef as s1_song_084_judgment_day } from "./definitions/neutral/s1_song_084_judgment_day.ts";
import { cardDef as s1_spell_123_dischordian_logic } from "./definitions/neutral/s1_spell_123_dischordian_logic.ts";
import { cardDef as s1_spell_124_ark_emergency_protocol } from "./definitions/neutral/s1_spell_124_ark_emergency_protocol.ts";

/* ─── New Babylon ─── */
import { cardDef as gen_new_babylon } from "./definitions/new_babylon/gen_new_babylon.ts";
import { cardDef as s1_char_001_adjudicar_locke } from "./definitions/new_babylon/s1_char_001_adjudicar_locke.ts";
import { cardDef as s1_char_003_akai_shi } from "./definitions/new_babylon/s1_char_003_akai_shi.ts";
import { cardDef as s1_char_020_the_authority } from "./definitions/new_babylon/s1_char_020_the_authority.ts";
import { cardDef as s1_char_033_the_human } from "./definitions/new_babylon/s1_char_033_the_human.ts";
import { cardDef as s1_char_061_vexahlia_the_taskmaster } from "./definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster.ts";
import { cardDef as s1_char_066_fenra_the_moon_tyrant } from "./definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant.ts";
import { cardDef as s1_char_078_governor_thane } from "./definitions/new_babylon/s1_char_078_governor_thane.ts";
import { cardDef as s1_char_079_citadel_guardian } from "./definitions/new_babylon/s1_char_079_citadel_guardian.ts";
import { cardDef as s1_char_080_district_enforcer } from "./definitions/new_babylon/s1_char_080_district_enforcer.ts";
import { cardDef as s1_char_081_tribunal_magistrate } from "./definitions/new_babylon/s1_char_081_tribunal_magistrate.ts";
import { cardDef as s1_char_082_spire_assassin } from "./definitions/new_babylon/s1_char_082_spire_assassin.ts";
import { cardDef as s1_char_083_propaganda_herald } from "./definitions/new_babylon/s1_char_083_propaganda_herald.ts";
import { cardDef as s1_char_084_iron_decree } from "./definitions/new_babylon/s1_char_084_iron_decree.ts";
import { cardDef as s1_char_085_sector_warden } from "./definitions/new_babylon/s1_char_085_sector_warden.ts";
import { cardDef as s1_char_117_senator_voss } from "./definitions/new_babylon/s1_char_117_senator_voss.ts";
import { cardDef as s1_char_118_trade_enforcer } from "./definitions/new_babylon/s1_char_118_trade_enforcer.ts";
import { cardDef as s1_char_119_syndicate_broker } from "./definitions/new_babylon/s1_char_119_syndicate_broker.ts";
import { cardDef as s1_char_120_crystal_archive_guard } from "./definitions/new_babylon/s1_char_120_crystal_archive_guard.ts";
import { cardDef as s1_reward_casino_high_roller } from "./definitions/new_babylon/s1_reward_casino_high_roller.ts";
import { cardDef as s1_reward_casino_poker } from "./definitions/new_babylon/s1_reward_casino_poker.ts";
import { cardDef as s1_reward_casino_vip } from "./definitions/new_babylon/s1_reward_casino_vip.ts";
import { cardDef as s1_reward_class_soldier } from "./definitions/new_babylon/s1_reward_class_soldier.ts";
import { cardDef as s1_reward_eidolon_auros } from "./definitions/new_babylon/s1_reward_eidolon_auros.ts";
import { cardDef as s1_reward_companion_locke } from "./definitions/new_babylon/s1_reward_companion_locke.ts";
import { cardDef as s1_reward_guild_territory } from "./definitions/new_babylon/s1_reward_guild_territory.ts";
import { cardDef as s1_reward_guild_victory } from "./definitions/new_babylon/s1_reward_guild_victory.ts";
import { cardDef as s1_reward_syndicate_build } from "./definitions/new_babylon/s1_reward_syndicate_build.ts";
import { cardDef as s1_reward_syndicate_empire } from "./definitions/new_babylon/s1_reward_syndicate_empire.ts";
import { cardDef as s1_reward_trade_act1 } from "./definitions/new_babylon/s1_reward_trade_act1.ts";
import { cardDef as s1_reward_trade_act2 } from "./definitions/new_babylon/s1_reward_trade_act2.ts";
import { cardDef as s1_reward_trade_empire } from "./definitions/new_babylon/s1_reward_trade_empire.ts";
import { cardDef as s1_reward_trade_tycoon } from "./definitions/new_babylon/s1_reward_trade_tycoon.ts";
import { cardDef as s1_spell_116_blood_tax } from "./definitions/new_babylon/s1_spell_116_blood_tax.ts";
import { cardDef as s1_spell_117_market_manipulation } from "./definitions/new_babylon/s1_spell_117_market_manipulation.ts";
import { cardDef as s1_spell_118_syndicate_contract } from "./definitions/new_babylon/s1_spell_118_syndicate_contract.ts";
import { cardDef as s1_spell_119_hostile_acquisition } from "./definitions/new_babylon/s1_spell_119_hostile_acquisition.ts";
import { cardDef as s1_spell_224_tax_collector } from "./definitions/new_babylon/s1_spell_224_tax_collector.ts";
import { cardDef as s1_spell_225_bounty_notice } from "./definitions/new_babylon/s1_spell_225_bounty_notice.ts";
import { cardDef as s1_spell_226_crystal_vault } from "./definitions/new_babylon/s1_spell_226_crystal_vault.ts";
import { cardDef as s1_spell_227_leveraged_buyout } from "./definitions/new_babylon/s1_spell_227_leveraged_buyout.ts";
import { cardDef as s1_spell_228_economic_sanctions } from "./definitions/new_babylon/s1_spell_228_economic_sanctions.ts";
import { cardDef as s1_spell_229_liquidation_sale } from "./definitions/new_babylon/s1_spell_229_liquidation_sale.ts";

/* ─── Panopticon ─── */
import { cardDef as s1_char_050_warden_prime } from "./definitions/panopticon/s1_char_050_warden_prime.ts";
import { cardDef as s1_char_051_oculus_sentinel } from "./definitions/panopticon/s1_char_051_oculus_sentinel.ts";
import { cardDef as s1_char_052_compliance_officer } from "./definitions/panopticon/s1_char_052_compliance_officer.ts";
import { cardDef as s1_char_053_data_harvester } from "./definitions/panopticon/s1_char_053_data_harvester.ts";
import { cardDef as s1_char_054_panoptic_drone } from "./definitions/panopticon/s1_char_054_panoptic_drone.ts";
import { cardDef as s1_char_055_thought_censor } from "./definitions/panopticon/s1_char_055_thought_censor.ts";
import { cardDef as s1_char_056_registry_clerk } from "./definitions/panopticon/s1_char_056_registry_clerk.ts";
import { cardDef as s1_char_057_blacksite_interrogator } from "./definitions/panopticon/s1_char_057_blacksite_interrogator.ts";

/* ─── Thought Virus ─── */
import { cardDef as gen_thought_virus } from "./definitions/thought_virus/gen_thought_virus.ts";
import { cardDef as s1_char_032_the_host } from "./definitions/thought_virus/s1_char_032_the_host.ts";
import { cardDef as s1_char_049_the_source } from "./definitions/thought_virus/s1_char_049_the_source.ts";
import { cardDef as s1_char_070_patient_zero } from "./definitions/thought_virus/s1_char_070_patient_zero.ts";
import { cardDef as s1_char_071_neural_parasite } from "./definitions/thought_virus/s1_char_071_neural_parasite.ts";
import { cardDef as s1_char_072_memetic_carrier } from "./definitions/thought_virus/s1_char_072_memetic_carrier.ts";
import { cardDef as s1_char_073_cognitive_blight } from "./definitions/thought_virus/s1_char_073_cognitive_blight.ts";
import { cardDef as s1_char_074_vector_swarm } from "./definitions/thought_virus/s1_char_074_vector_swarm.ts";
import { cardDef as s1_char_075_plague_herald } from "./definitions/thought_virus/s1_char_075_plague_herald.ts";
import { cardDef as s1_char_076_synaptic_horror } from "./definitions/thought_virus/s1_char_076_synaptic_horror.ts";
import { cardDef as s1_char_077_mind_rot_drone } from "./definitions/thought_virus/s1_char_077_mind_rot_drone.ts";
import { cardDef as s1_char_113_terminus_sovereign } from "./definitions/thought_virus/s1_char_113_terminus_sovereign.ts";
import { cardDef as s1_char_114_viral_vector } from "./definitions/thought_virus/s1_char_114_viral_vector.ts";
import { cardDef as s1_char_115_consumed_host } from "./definitions/thought_virus/s1_char_115_consumed_host.ts";
import { cardDef as s1_char_116_neural_plague_carrier } from "./definitions/thought_virus/s1_char_116_neural_plague_carrier.ts";
import { cardDef as s1_char_200_cortex_ravager } from "./definitions/thought_virus/s1_char_200_cortex_ravager.ts";
import { cardDef as s1_reward_boss_source } from "./definitions/thought_virus/s1_reward_boss_source.ts";
import { cardDef as s1_reward_circuit_1st } from "./definitions/thought_virus/s1_reward_circuit_1st.ts";
import { cardDef as s1_reward_circuit_survive } from "./definitions/thought_virus/s1_reward_circuit_survive.ts";
import { cardDef as s1_reward_class_assassin } from "./definitions/thought_virus/s1_reward_class_assassin.ts";
import { cardDef as s1_reward_companion_kael } from "./definitions/thought_virus/s1_reward_companion_kael.ts";
import { cardDef as s1_reward_crew_sacrifice } from "./definitions/thought_virus/s1_reward_crew_sacrifice.ts";
import { cardDef as s1_reward_cycle_dark } from "./definitions/thought_virus/s1_reward_cycle_dark.ts";
import { cardDef as s1_reward_eidolon_strain } from "./definitions/thought_virus/s1_reward_eidolon_strain.ts";
import { cardDef as s1_reward_outbreak_contain } from "./definitions/thought_virus/s1_reward_outbreak_contain.ts";
import { cardDef as s1_reward_palimpsest_noise } from "./definitions/thought_virus/s1_reward_palimpsest_noise.ts";
import { cardDef as s1_reward_swarm_champion } from "./definitions/thought_virus/s1_reward_swarm_champion.ts";
import { cardDef as s1_reward_swarm_survive } from "./definitions/thought_virus/s1_reward_swarm_survive.ts";
import { cardDef as s1_spell_112_viral_cascade } from "./definitions/thought_virus/s1_spell_112_viral_cascade.ts";
import { cardDef as s1_spell_113_memory_consumption } from "./definitions/thought_virus/s1_spell_113_memory_consumption.ts";
import { cardDef as s1_spell_114_neural_overwrite } from "./definitions/thought_virus/s1_spell_114_neural_overwrite.ts";
import { cardDef as s1_spell_115_nihilistic_mercy } from "./definitions/thought_virus/s1_spell_115_nihilistic_mercy.ts";
import { cardDef as s1_spell_218_infection_vector } from "./definitions/thought_virus/s1_spell_218_infection_vector.ts";
import { cardDef as s1_spell_219_plague_wind } from "./definitions/thought_virus/s1_spell_219_plague_wind.ts";
import { cardDef as s1_spell_220_assimilate } from "./definitions/thought_virus/s1_spell_220_assimilate.ts";
import { cardDef as s1_spell_221_cognitive_decay } from "./definitions/thought_virus/s1_spell_221_cognitive_decay.ts";
import { cardDef as s1_spell_222_terminal_stage } from "./definitions/thought_virus/s1_spell_222_terminal_stage.ts";
import { cardDef as s1_spell_223_spore_burst } from "./definitions/thought_virus/s1_spell_223_spore_burst.ts";

/* ─── Tokens ─── */
import { cardDef as tok_calculation } from "./tokens/tok_calculation";
import { cardDef as tok_dream_wisp_1_1 } from "./tokens/tok_dream_wisp_1_1";
import { cardDef as tok_infected_2_2 } from "./tokens/tok_infected_2_2";
import { cardDef as tok_spore_1_1 } from "./tokens/tok_spore_1_1";
import { cardDef as token_crystal_senator_5_5 } from "./tokens/token_crystal_senator_5_5";
import { cardDef as token_wolf_2_2 } from "./tokens/token_wolf_2_2";

export const ALL_CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze([
  gen_antiquarian,
  s1_char_018_the_antiquarian,
  s1_char_043_the_programmer,
  s1_char_058_epoch_walker,
  s1_char_059_chronosplicer,
  s1_char_060_relic_keeper,
  s1_char_061_temporal_archivist,
  s1_char_062_hourglass_golem,
  s1_char_063_paradox_acolyte,
  s1_char_064_memory_thief,
  s1_char_065_age_ender,
  s1_char_121_epoch_watcher,
  s1_char_122_timeline_splitter,
  s1_char_123_relic_scholar,
  s1_char_124_age_walker,
  s1_char_201_chronoguard_sentinel,
  s1_reward_campaign_acceptance,
  s1_reward_discovery_all,
  s1_reward_lore_archivist,
  s1_reward_outbreak_cure,
  s1_reward_rpg_quest,
  s1_reward_vote_t1_acceptance,
  s1_spell_120_timeline_collapse,
  s1_spell_121_epoch_rewind,
  s1_spell_122_archaeological_dig,
  s1_spell_230_chrono_anchor,
  s1_spell_231_temporal_fracture,
  s1_spell_232_fossil_record,
  s1_spell_233_era_shift,
  s1_spell_234_preservation_field,
  s1_spell_235_age_of_silence,
  gen_architect,
  s1_char_006_dr_lyra_vox,
  s1_char_007_general_alarik,
  s1_char_008_general_binath,
  s1_char_009_general_prometheus,
  s1_char_013_master_of_rlyeh,
  s1_char_015_panoptic_elara,
  s1_char_016_senator_elara_voss,
  s1_char_019_the_architect,
  s1_char_021_the_conexus,
  s1_char_022_the_collector,
  s1_char_024_the_detective,
  s1_char_030_the_game_master,
  s1_char_035_the_jailer,
  s1_char_038_the_meme,
  s1_char_039_the_necromancer,
  s1_char_042_the_politician,
  s1_char_100_the_collector,
  s1_char_101_panoptic_warden_foucault,
  s1_char_102_arena_enforcer,
  s1_char_103_inception_ark_sentry,
  s1_char_104_white_oracle,
  s1_reward_boss_architect,
  s1_reward_boss_collector,
  s1_reward_casino_pazaak,
  s1_reward_chess_tourney,
  s1_reward_chess_win,
  s1_reward_class_engineer,
  s1_reward_companion_human,
  s1_reward_crew_clone,
  s1_reward_eidolon_cipher,
  s1_reward_station_complete,
  s1_reward_station_module,
  s1_reward_tower_wave50,
  s1_spell_100_schematic_override,
  s1_spell_101_predetermined_outcome,
  s1_spell_102_arena_protocol,
  s1_spell_103_recursive_calibration,
  s1_spell_200_surveillance_grid,
  s1_spell_201_protocol_override,
  s1_spell_202_system_purge,
  s1_spell_203_calculated_retreat,
  s1_spell_204_architects_mandate,
  s1_spell_205_panoptic_lockdown,
  gen_dreamer,
  s1_char_005_destiny,
  s1_char_014_nythera,
  s1_char_017_the_advocate,
  s1_char_023_the_degen,
  s1_char_025_the_dreamer,
  s1_char_027_the_enigma,
  s1_char_029_the_forgotten,
  s1_char_034_the_inventor,
  s1_char_036_the_judge,
  s1_char_037_the_knowledge,
  s1_char_045_the_resurrectionist,
  s1_char_046_the_seer,
  s1_char_109_the_enigma,
  s1_char_110_prophecy_keeper,
  s1_char_111_vision_walker,
  s1_char_112_reality_anchor,
  s1_char_203_astral_warden,
  s1_reward_campaign_finale,
  s1_reward_campaign_truth,
  s1_reward_casino_dice,
  s1_reward_class_neyon,
  s1_reward_class_oracle,
  s1_reward_cycle_light,
  s1_reward_eidolon_lux,
  s1_reward_palimpsest_signal,
  s1_reward_vortex_close,
  s1_reward_vortex_master,
  s1_reward_vote_t1_truth,
  s1_song_082_top_floor_door,
  s1_spell_108_prophetic_collapse,
  s1_spell_109_vision_cascade,
  s1_spell_110_dream_walk,
  s1_spell_111_probability_storm,
  s1_spell_212_lucid_clarity,
  s1_spell_213_precognition,
  s1_spell_214_minds_eye,
  s1_spell_215_reality_fracture,
  s1_spell_216_oracles_blessing,
  s1_spell_217_dream_weave,
  gen_insurgency,
  s1_char_002_agent_zero,
  s1_char_010_iron_lion,
  s1_char_011_jericho_jones,
  s1_char_012_kael,
  s1_char_026_the_engineer,
  s1_char_028_the_eyes,
  s1_char_031_the_hierophant,
  s1_char_040_the_nomad,
  s1_char_041_the_oracle,
  s1_char_044_the_recruiter,
  s1_char_047_the_shadow_tongue,
  s1_char_105_iron_lion,
  s1_char_106_wraith_calder,
  s1_char_107_signal_operative,
  s1_char_108_guerrilla_cell,
  s1_char_202_saboteur,
  s1_reward_campaign_defiance,
  s1_reward_class_spy,
  s1_reward_companion_zero,
  s1_reward_crew_mission,
  s1_reward_eidolon_echo,
  s1_reward_guild_recruit,
  s1_reward_trade_insurgency,
  s1_reward_vote_t1_defiance,
  s1_song_091_i_love_war,
  s1_spell_104_signal_intercept,
  s1_spell_105_guerrilla_strike,
  s1_spell_106_encrypted_broadcast,
  s1_spell_107_dead_frequency_jam,
  s1_spell_206_supply_drop,
  s1_spell_207_ambush_protocol,
  s1_spell_208_rebel_yell,
  s1_spell_209_safe_house,
  s1_spell_210_intel_leak,
  s1_spell_211_scorched_earth,
  gen_neutral,
  s1_char_004_ambassador_veron,
  s1_char_086_wandering_merchant,
  s1_char_087_scrapyard_golem,
  s1_char_088_field_medic,
  s1_char_089_courier_sprite,
  s1_char_090_hired_blade,
  s1_char_091_border_scout,
  s1_char_092_ruin_stalker,
  s1_char_093_ironclad_veteran,
  s1_reward_bonus_complete,
  s1_reward_campaign_balanced,
  s1_reward_campaign_empathy,
  s1_reward_casino_jackpot,
  s1_reward_casino_slots,
  s1_reward_challenge_streak,
  s1_reward_companion_all,
  s1_reward_companion_elara,
  s1_reward_companion_max,
  s1_reward_crew_bloodline,
  s1_reward_crew_incubator,
  s1_reward_daily_streak,
  s1_reward_draft_perfect,
  s1_reward_draft_winner,
  s1_reward_graduate_deploy,
  s1_reward_graduate_master,
  s1_reward_guild_founder,
  s1_reward_guild_hall,
  s1_reward_guild_officer,
  s1_reward_pet_evolve,
  s1_reward_pet_streak,
  s1_reward_prestige_t1,
  s1_reward_prestige_t3,
  s1_reward_prestige_t5,
  s1_reward_prestige_t7,
  s1_reward_pvp_bronze,
  s1_reward_pvp_diamond,
  s1_reward_pvp_gold,
  s1_reward_pvp_legend,
  s1_reward_raid_boss,
  s1_reward_raid_contrib,
  s1_reward_raid_perfect,
  s1_reward_seasonal_s1,
  s1_reward_vote_t1_balanced,
  s1_reward_vote_t1_empathy,
  s1_reward_xmas_charity,
  s1_reward_xmas_gift,
  s1_song_059_lip_service,
  s1_song_060_nonos,
  s1_song_061_the_enigmas_lament,
  s1_song_062_the_two_witnesses,
  s1_song_063_building_the_architect,
  s1_song_064_dischordian_logic,
  s1_song_065_sixth_sense,
  s1_song_066_the_book_of_daniel,
  s1_song_070_traces_of_something_spiritual,
  s1_song_079_shades_of_grey,
  s1_song_084_judgment_day,
  s1_spell_123_dischordian_logic,
  s1_spell_124_ark_emergency_protocol,
  gen_new_babylon,
  s1_char_001_adjudicar_locke,
  s1_char_003_akai_shi,
  s1_char_020_the_authority,
  s1_char_033_the_human,
  s1_char_061_vexahlia_the_taskmaster,
  s1_char_066_fenra_the_moon_tyrant,
  s1_char_078_governor_thane,
  s1_char_079_citadel_guardian,
  s1_char_080_district_enforcer,
  s1_char_081_tribunal_magistrate,
  s1_char_082_spire_assassin,
  s1_char_083_propaganda_herald,
  s1_char_084_iron_decree,
  s1_char_085_sector_warden,
  s1_char_117_senator_voss,
  s1_char_118_trade_enforcer,
  s1_char_119_syndicate_broker,
  s1_char_120_crystal_archive_guard,
  s1_reward_casino_high_roller,
  s1_reward_casino_poker,
  s1_reward_casino_vip,
  s1_reward_class_soldier,
  s1_reward_companion_locke,
  s1_reward_eidolon_auros,
  s1_reward_guild_territory,
  s1_reward_guild_victory,
  s1_reward_syndicate_build,
  s1_reward_syndicate_empire,
  s1_reward_trade_act1,
  s1_reward_trade_act2,
  s1_reward_trade_empire,
  s1_reward_trade_tycoon,
  s1_spell_116_blood_tax,
  s1_spell_117_market_manipulation,
  s1_spell_118_syndicate_contract,
  s1_spell_119_hostile_acquisition,
  s1_spell_224_tax_collector,
  s1_spell_225_bounty_notice,
  s1_spell_226_crystal_vault,
  s1_spell_227_leveraged_buyout,
  s1_spell_228_economic_sanctions,
  s1_spell_229_liquidation_sale,
  s1_char_050_warden_prime,
  s1_char_051_oculus_sentinel,
  s1_char_052_compliance_officer,
  s1_char_053_data_harvester,
  s1_char_054_panoptic_drone,
  s1_char_055_thought_censor,
  s1_char_056_registry_clerk,
  s1_char_057_blacksite_interrogator,
  gen_thought_virus,
  s1_char_032_the_host,
  s1_char_049_the_source,
  s1_char_070_patient_zero,
  s1_char_071_neural_parasite,
  s1_char_072_memetic_carrier,
  s1_char_073_cognitive_blight,
  s1_char_074_vector_swarm,
  s1_char_075_plague_herald,
  s1_char_076_synaptic_horror,
  s1_char_077_mind_rot_drone,
  s1_char_113_terminus_sovereign,
  s1_char_114_viral_vector,
  s1_char_115_consumed_host,
  s1_char_116_neural_plague_carrier,
  s1_char_200_cortex_ravager,
  s1_reward_boss_source,
  s1_reward_circuit_1st,
  s1_reward_circuit_survive,
  s1_reward_class_assassin,
  s1_reward_companion_kael,
  s1_reward_crew_sacrifice,
  s1_reward_cycle_dark,
  s1_reward_eidolon_strain,
  s1_reward_outbreak_contain,
  s1_reward_palimpsest_noise,
  s1_reward_swarm_champion,
  s1_reward_swarm_survive,
  s1_spell_112_viral_cascade,
  s1_spell_113_memory_consumption,
  s1_spell_114_neural_overwrite,
  s1_spell_115_nihilistic_mercy,
  s1_spell_218_infection_vector,
  s1_spell_219_plague_wind,
  s1_spell_220_assimilate,
  s1_spell_221_cognitive_decay,
  s1_spell_222_terminal_stage,
  s1_spell_223_spore_burst,
  tok_calculation,
  tok_dream_wisp_1_1,
  tok_infected_2_2,
  tok_spore_1_1,
  token_crystal_senator_5_5,
  token_wolf_2_2,
]);
