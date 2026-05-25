/* ═══════════════════════════════════════════════════════
   OBSERVATION DECK — composite resolver (Phase J)

   15 base renders + 88 sprite overlays.

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

export const OBSERVATION_DECK_BASE_IDS = [
  "observation_deck_base_act7_bonded_ending",
  "observation_deck_base_act7_distant_ending",
  "observation_deck_base_cycle_dawn",
  "observation_deck_base_cycle_long_night",
  "observation_deck_base_eidolon_first_manifestation",
  "observation_deck_base_epoch_grand_edit",
  "observation_deck_base_initial",
  "observation_deck_base_morality_dark",
  "observation_deck_base_purification_active",
  "observation_deck_base_season_interregnum",
  "observation_deck_base_terminus_signal_first",
  "observation_deck_base_tv_corrupted",
  "observation_deck_base_tv_exposed",
  "observation_deck_base_tv_quarantined",
  "observation_deck_base_tv_spreading",
] as const;

export const OBSERVATION_DECK_SPRITE_IDS = [
  "sp01_viewport_terminus_approach",
  "sp02_viewport_cosmic_event_supernova",
  "sp03_viewport_cosmic_event_planetfall",
  "sp04_viewport_constellation_hud",
  "sp05_viewport_ice_crystal_etching",
  "sp06_viewport_substrate_purple_bleed",
  "sp07_starfield_act4_sector_etch",
  "sp08_starfield_human_signal_threads",
  "sp09_starfield_cosmic_phantoms",
  "sp10_dome_panopticon_eye",
  "sp11_dome_eidolon_resonance_haze",
  "sp12_dome_starfield_intensified",
  "sp13_west_painting_last_witness_baseline",
  "sp14_west_painting_last_witness_evolved_early",
  "sp15_west_painting_last_witness_evolved_late",
  "sp16_memorial_baseline_1047_names",
  "sp17_memorial_corridor_unlocked",
  "sp18_door_comms_terminus_arrival_pulse",
  "sp19_door_engineering_lift_open",
  "sp20_architect_cryptic_panel_ajar",
  "sp21_dreamer_fragment_alcove_glow",
  "sp22_floor_compass_rose_active_glow",
  "sp23_floor_7pointed_star_glow",
  "sp24_floor_investigation_yellow_tape",
  "sp25_floor_investigation_cyan_tape",
  "sp26_floor_investigation_closure_brass_plate",
  "sp27_telescope_active_eyepiece_glow",
  "sp28_telescope_aligned_to_milestone",
  "sp29_telescope_mycelium_overgrowth",
  "sp30_star_table_redacted_black_bars",
  "sp31_star_table_bookmark_set",
  "sp32_star_table_mystery_clue_active",
  "sp33_music_console_cylinder_pulled_act2",
  "sp34_music_console_multiple_cylinders_pulled",
  "sp35_music_console_earth_globe_brighter",
  "sp36_music_console_eidolon_filament",
  "sp37_altar_kneeler_hand_mark",
  "sp38_altar_resonance_pulse_warm_gold",
  "sp39_altar_chamber_phase_coherence_glow",
  "sp40_altar_companion_silhouette_kneeling",
  "sp41_cradle_crystal_seated_pulsing",
  "sp42_cradle_crystal_active_full_pulse",
  "sp43_cradle_dust_layer",
  "sp44_clue_charter_upper_band_wafer",
  "sp45_clue_resur_shield_diagnostic_readout",
  "sp46_clue_akai_cycle_fold_telemetry",
  "sp47_clue_storm_weather_telemetry",
  "sp48_clue_storm_full_calms_register",
  "sp49_astronomer_log_dark_spot_appears",
  "sp50_astronomer_log_overstamped_indigo",
  "sp51_astronomer_log_classified_redacted",
  "sp52_atmospheric_dust_motes_viewport_beam",
  "sp53_atmospheric_cosmic_dust_upper_volume",
  "sp54_atmospheric_eidolon_shimmer_anchor",
  "sp55_atmospheric_candle_smoke_east_alcove",
  "sp56_atmospheric_candle_smoke_west_alcove",
  "sp57_faction_dreamer_iris_cyan_alcove",
  "sp58_faction_hierarchy_seal_curator_plinth",
  "sp59_faction_antiquarian_codex_bench",
  "sp60_faction_insurgency_orange_sigil_wall",
  "sp61_tournament_bracket_chip_music_console",
  "sp62_tournament_banner_dome_drape",
  "sp63_hellbox3_chalk_spiral_floor",
  "sp64_irl_spring_petals_bench",
  "sp65_irl_summer_brass_sun_candle_stand",
  "sp66_irl_autumn_oak_west_candle",
  "sp67_irl_winter_evergreen_curator_plinth",
  "sp68_eidolon_anchor_resonance_envelope",
  "sp69_eidolon_first_manifestation_shimmer",
  "sp70_eidolon_breath_filament_air",
  "sp71_eidolon_untuned_distant",
  "sp72_eidolon_tuning_90_degrees",
  "sp73_eidolon_resonant_facing_glyph",
  "sp74_eidolon_inseparable_perched_bench",
  "sp75_eidolon_first_manifestation_half_resolved",
  "sp76_human_signal_thread_bloom",
  "sp77_witness_glyph_fragmented",
  "sp78_witness_glyph_lucid_filament_to_viewport",
  "sp79_witness_glyph_luminous_three_anchors",
  "sp80_lore_egg_obs_constellation_panopticon_face",
  "sp81_lore_warlord_surveillance_node_residue",
  "sp82_lore_engineer_recording_holo_active",
  "sp83_celestial_almanac_active_warm_gold",
  "sp84_eidolon_log_active_entries_visible",
  "sp85_anchor_inlay_warm_gold_cyan_layered",
  "sp86_door_engineering_quarantine_band",
  "sp87_mystery_closure_evidence_cart_consolidated",
  "sp88_bond_pulse_afterimage_one_star",
] as const;

type ObservationDeckBaseId = typeof OBSERVATION_DECK_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): ObservationDeckBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "observation_deck");

if (f.act7_bonded_ending) return "observation_deck_base_act7_bonded_ending";
  if (f.act7_distant_ending) return "observation_deck_base_act7_distant_ending";
  if (f.eidolon_first_manifestation) return "observation_deck_base_eidolon_first_manifestation";
  if (f.purification_active) return "observation_deck_base_purification_active";
  if (f.terminus_signal_first) return "observation_deck_base_terminus_signal_first";
  if (f.grand_edit_active) return "observation_deck_base_epoch_grand_edit";
  if (tv === "quarantined") return "observation_deck_base_tv_quarantined";
  if (tv === "corrupted") return "observation_deck_base_tv_corrupted";
  if (tv === "spreading") return "observation_deck_base_tv_spreading";
  if (tv === "exposed") return "observation_deck_base_tv_exposed";
  if (f.season_phase_interregnum) return "observation_deck_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "observation_deck_base_morality_dark";
  if (cycle === "longNight") return "observation_deck_base_cycle_long_night";
  if (cycle === "dawn") return "observation_deck_base_cycle_dawn";
  return "observation_deck_base_initial";
}

function pickSprites(_g: CompositeGameSlice, _base: ObservationDeckBaseId): string[] {
  // Per-beat sprite picking deferred — see file header.
  return [];
}

function pickFilter(base: ObservationDeckBaseId): string | undefined {
  if (base === "observation_deck_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "observation_deck_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "observation_deck_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "observation_deck_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "observation_deck_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "observation_deck_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "observation_deck_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  return undefined;
}

export function resolveObservationDeckComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
