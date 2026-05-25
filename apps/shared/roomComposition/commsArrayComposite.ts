/* ═══════════════════════════════════════════════════════
   COMMS ARRAY — composite resolver (Phase J)

   14 base renders + 90 sprite overlays.

   pickSprites returns [] for now — sprite-by-sprite narrative wiring
   lands per-beat as the relevant quests ship. The base picker covers
   the common axes (cycle, TV-infection, morality, season, epoch, act
   tier) plus the room-specific narrative bases listed at the top of
   pickBase. The standalone hotspot author tool reads BASE_IDS +
   SPRITE_IDS via _extract-room-composites.ts and can preview every
   asset directly.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, moralityBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const COMMS_ARRAY_BASE_IDS = [
  "comms_array_base_act7_finale_silent",
  "comms_array_base_cycle_dawn",
  "comms_array_base_cycle_long_night",
  "comms_array_base_epoch_grand_edit",
  "comms_array_base_first_human_contact",
  "comms_array_base_initial",
  "comms_array_base_morality_dark",
  "comms_array_base_season_interregnum",
  "comms_array_base_shadow_tongue_voice_heard",
  "comms_array_base_signal_booster_installed",
  "comms_array_base_tv_corrupted",
  "comms_array_base_tv_exposed",
  "comms_array_base_tv_quarantined",
  "comms_array_base_tv_spreading",
] as const;

export const COMMS_ARRAY_SPRITE_IDS = [
  "sp01_frequency_wall_calm_baseline",
  "sp02_frequency_wall_amplified",
  "sp03_frequency_wall_active_transmission",
  "sp04_frequency_wall_lockout_red",
  "sp05_frequency_wall_silver_silent",
  "sp06_indicator_heartbeat_baseline",
  "sp07_indicator_amplified_wider",
  "sp08_indicator_sync_with_human",
  "sp09_indicator_indigo_halo",
  "sp10_indicator_dim_grey_silent",
  "sp11_skylight_dust_mote_storm",
  "sp12_em_aurora_active_truss",
  "sp13_skylight_dim_clouded",
  "sp14_console_data_flow_active",
  "sp15_console_archive_mode",
  "sp16_console_lockout_red",
  "sp17_console_glyph_corruption",
  "sp18_archive_terminal_browsing",
  "sp19_archive_drawer_open",
  "sp20_archive_terminal_red_lockout",
  "sp21_signal_visualiser_calm",
  "sp22_signal_visualiser_human_breathing",
  "sp23_signal_visualiser_indigo_spikes",
  "sp24_operator_chair_locke_silhouette",
  "sp25_operator_chair_headset_folded",
  "sp26_operator_chair_notebook_open",
  "sp27_broadcast_chairs_six_filled",
  "sp28_broadcast_chair_west1_hierarchy_robe",
  "sp29_broadcast_chair_east2_pirate",
  "sp30_broadcast_chair_west2_antiquarian_codex",
  "sp31_floor_amplifier_grate_glow",
  "sp32_floor_substrate_pulse",
  "sp33_floor_investigation_yellow_tape",
  "sp34_floor_cyan_tape_evidence_cart",
  "sp35_floor_quarantine_band",
  "sp36_door_bridge_corridor_open",
  "sp37_door_observation_hatch_open",
  "sp38_door_bridge_blackout_tape",
  "sp39_clue_charter_bell_log",
  "sp40_clue_severance_klessa",
  "sp41_clue_akai_voice_mid_hunt",
  "sp42_clue_vex_maestro_opening",
  "sp43_clue_watchers_first_trumpet",
  "sp44_clue_storm_voice_fragment",
  "sp45_clue_tarn_erasure_vote",
  "sp46_clue_akai_last_words",
  "sp47_clue_shadow_tongue_signal_trace",
  "sp48_clue_ocularum_relay_trace",
  "sp49_static_screen_baseline",
  "sp50_static_screen_indigo_flecks",
  "sp51_static_screen_voice_silhouette",
  "sp52_static_screen_voice_locked",
  "sp53_workspace_headset_on_console",
  "sp54_workspace_notebook_open",
  "sp55_workspace_coffee_mug_steam",
  "sp56_operator_pen_holder_pen_missing",
  "sp57_ear_sigil_warm_gold_glow",
  "sp58_ear_sigil_indigo_overstrike",
  "sp59_rf_warning_sign_flashing_amber",
  "sp60_broadcast_lockout_indicator_red",
  "sp61_intercom_panel_active_warm_amber",
  "sp62_atmo_ozone_haze_grate",
  "sp63_atmo_em_aurora_truss_cyan",
  "sp64_atmo_substrate_vapour_floor",
  "sp65_atmo_signal_threads_drift",
  "sp66_atmo_dust_motes_skylight",
  "sp67_faction_meme_prime_pirate_signal",
  "sp68_faction_authority_red_lattice",
  "sp69_faction_hierarchy_diamond",
  "sp70_faction_dreamer_iris_cyan",
  "sp71_faction_antiquarian_pressed_leaf",
  "sp72_locke_comms_feed_panel_active",
  "sp73_locke_comms_feed_double_authority",
  "sp74_human_silhouette_monitor",
  "sp75_human_silhouette_full_substrate",
  "sp76_human_voice_fragment",
  "sp77_human_signal_thread_to_indicator",
  "sp78_antenna_truss_signal_booster",
  "sp79_tournament_bracket_chip_console",
  "sp80_tournament_banner_truss",
  "sp81_hellbox3_chalk_spiral_floor",
  "sp82_irl_spring_pressed_violets",
  "sp83_irl_summer_brass_sun_mug",
  "sp84_irl_autumn_oak_bookmark",
  "sp85_irl_winter_frost_etching",
  "sp86_witness_glyph_fragmented",
  "sp87_witness_glyph_lucid_filament",
  "sp88_witness_glyph_luminous_three_anchors",
  "sp89_lore_egg_meme_prime_sos",
  "sp90_lore_shadow_tongue_signature_buffer",
] as const;

type CommsArrayBaseId = typeof COMMS_ARRAY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): CommsArrayBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "comms_array");

if (f.first_human_contact) return "comms_array_base_first_human_contact";
  if (f.signal_booster_installed) return "comms_array_base_signal_booster_installed";
  if (f.shadow_tongue_voice_heard) return "comms_array_base_shadow_tongue_voice_heard";
  if (f.grand_edit_active) return "comms_array_base_epoch_grand_edit";
  if (tv === "quarantined") return "comms_array_base_tv_quarantined";
  if (tv === "corrupted") return "comms_array_base_tv_corrupted";
  if (tv === "spreading") return "comms_array_base_tv_spreading";
  if (tv === "exposed") return "comms_array_base_tv_exposed";
  if (tier >= 7) return "comms_array_base_act7_finale_silent";
  if (f.season_phase_interregnum) return "comms_array_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "comms_array_base_morality_dark";
  if (cycle === "longNight") return "comms_array_base_cycle_long_night";
  if (cycle === "dawn") return "comms_array_base_cycle_dawn";
  return "comms_array_base_initial";
}

function pickSprites(_g: CompositeGameSlice, _base: CommsArrayBaseId): string[] {
  // Per-beat sprite picking deferred — see file header.
  return [];
}

function pickFilter(base: CommsArrayBaseId): string | undefined {
  if (base === "comms_array_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "comms_array_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "comms_array_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "comms_array_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "comms_array_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "comms_array_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "comms_array_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  return undefined;
}

export function resolveCommsArrayComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
