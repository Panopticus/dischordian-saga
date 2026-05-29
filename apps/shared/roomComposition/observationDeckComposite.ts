/* ═══════════════════════════════════════════════════════
   OBSERVATION DECK — composite resolver (Phase J)

   15 base renders + 88 sprite overlays.

   pickSprites emits a layered default stack (viewport / starfield /
   dome / west painting / memorial / doors / floor / telescope /
   star table / music console / altar / cradle / atmospherics) plus
   beat-specific overlays gated on narrative flags. Sprites L9
   (clue glows sp44-48) and the eidolon-state mutex (sp71-75) are
   the principal scoping targets for the 13 hotspots in
   ROOM_DEFINITIONS["observation-deck"].
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveIrlSeason, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
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

function pickSprites(g: CompositeGameSlice, base: ObservationDeckBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "observation_deck");
  const trust = trustBand(g.elaraTrust);
  const season = deriveIrlSeason(g);

  // L1 — viewport (mutex by major beat; default = empty starfield from base)
  if (tv === "corrupted" || base === "observation_deck_base_tv_corrupted") {
    out.push("sp06_viewport_substrate_purple_bleed");
  } else if (base === "observation_deck_base_terminus_signal_first" || f.terminus_signal_first) {
    out.push("sp01_viewport_terminus_approach");
  } else if (f.cosmic_event_supernova) {
    out.push("sp02_viewport_cosmic_event_supernova");
  } else if (f.cosmic_event_planetfall) {
    out.push("sp03_viewport_cosmic_event_planetfall");
  }
  // Additive viewport details
  if (f.constellation_hud_active) out.push("sp04_viewport_constellation_hud");
  if (season === "winter") out.push("sp05_viewport_ice_crystal_etching");

  // L2 — starfield additives (deep-space details)
  if (tier >= 4) out.push("sp07_starfield_act4_sector_etch");
  if (f.first_human_contact || f.human_signal_threads_visible) out.push("sp08_starfield_human_signal_threads");
  if (f.shadow_tongue_active || tv === "corrupted") out.push("sp09_starfield_cosmic_phantoms");

  // L3 — dome (mutex; eidolon haze additive)
  if (f.observation_deck_panopticon_eye_visible) out.push("sp10_dome_panopticon_eye");
  if (f.eidolon_first_manifestation || base === "observation_deck_base_eidolon_first_manifestation" || f.eidolon_contained_active) {
    out.push("sp11_dome_eidolon_resonance_haze");
  }
  if (tier >= 6 || base === "observation_deck_base_act7_bonded_ending") {
    out.push("sp12_dome_starfield_intensified");
  }

  // L4 — west wall painting "Last Witness" (mutex by act-tier progression)
  if (tier >= 6) {
    out.push("sp15_west_painting_last_witness_evolved_late");
  } else if (tier >= 3) {
    out.push("sp14_west_painting_last_witness_evolved_early");
  } else {
    out.push("sp13_west_painting_last_witness_baseline");
  }

  // L5 — memorial wall (mutex)
  if (f.memorial_corridor_unlocked) {
    out.push("sp17_memorial_corridor_unlocked");
  } else {
    out.push("sp16_memorial_baseline_1047_names");
  }

  // L6 — doors
  if (base === "observation_deck_base_terminus_signal_first" || f.terminus_signal_first) {
    out.push("sp18_door_comms_terminus_arrival_pulse");
  }
  if (f.observation_deck_engineering_lift_open) out.push("sp19_door_engineering_lift_open");
  if (tv === "quarantined") out.push("sp86_door_engineering_quarantine_band");

  // L7 — architect + dreamer alcoves (flag-gated)
  if (f.architect_cryptic_panel_open) out.push("sp20_architect_cryptic_panel_ajar");
  if (f.dreamer_fragment_unlocked || factionHigh(g, "dreamers")) out.push("sp21_dreamer_fragment_alcove_glow");

  // L8 — floor inlays (mutex on compass / 7-pointed star)
  if (f.observation_deck_seven_pointed_star_active) {
    out.push("sp23_floor_7pointed_star_glow");
  } else {
    out.push("sp22_floor_compass_rose_active_glow");
  }
  // Investigation tape additive (mid-investigation)
  if (f.observation_deck_investigation_active) {
    out.push("sp24_floor_investigation_yellow_tape");
    if (f.observation_deck_evidence_cart) out.push("sp25_floor_investigation_cyan_tape");
    if (f.observation_deck_investigation_closed) out.push("sp26_floor_investigation_closure_brass_plate");
  }

  // L9 — telescope (mutex; mycelium on infection)
  if (tv === "corrupted" || tv === "spreading") {
    out.push("sp29_telescope_mycelium_overgrowth");
  } else if (f.observation_deck_telescope_aligned) {
    out.push("sp28_telescope_aligned_to_milestone");
  } else if (f.observation_deck_telescope_active) {
    out.push("sp27_telescope_active_eyepiece_glow");
  }

  // L10 — star table (mutex; bookmark + active-clue additive)
  if (tv === "corrupted" || f.shadow_tongue_active) {
    out.push("sp30_star_table_redacted_black_bars");
  } else if (f.observation_deck_star_table_clue_active) {
    out.push("sp32_star_table_mystery_clue_active");
  } else if (f.observation_deck_star_table_bookmark) {
    out.push("sp31_star_table_bookmark_set");
  }

  // L11 — music console (additive by act tier; eidolon filament when present)
  if (tier >= 2) out.push("sp33_music_console_cylinder_pulled_act2");
  if (tier >= 4 || f.music_multiple_cylinders) out.push("sp34_music_console_multiple_cylinders_pulled");
  if (tier >= 5 || f.earth_globe_recognised) out.push("sp35_music_console_earth_globe_brighter");
  if (f.eidolon_filament_visible) out.push("sp36_music_console_eidolon_filament");

  // L12 — altar (mutex with companion presence)
  if (f.observation_deck_companion_at_altar) {
    out.push("sp40_altar_companion_silhouette_kneeling");
  }
  if (f.observation_deck_altar_used) out.push("sp37_altar_kneeler_hand_mark");
  if (f.observation_deck_altar_resonance_active) out.push("sp38_altar_resonance_pulse_warm_gold");
  if (f.altar_chamber_phase_coherence) out.push("sp39_altar_chamber_phase_coherence_glow");

  // L13 — bond-resonance cradle (mutex on activation; dust on neglect)
  if (f.bond_resonance_cradle_active) {
    out.push("sp42_cradle_crystal_active_full_pulse");
  } else if (f.bond_resonance_cradle_seated) {
    out.push("sp41_cradle_crystal_seated_pulsing");
  } else if (tier >= 4) {
    out.push("sp43_cradle_dust_layer");
  }

  // L14 — clue glows (5 mystery rects — match existing user-paste compositeScopes)
  if (f.observation_deck_clue_charter_upper_band) out.push("sp44_clue_charter_upper_band_wafer");
  if (f.observation_deck_clue_resur_shield_diagnostic) out.push("sp45_clue_resur_shield_diagnostic_readout");
  if (f.observation_deck_clue_akai_cycle_fold) out.push("sp46_clue_akai_cycle_fold_telemetry");
  if (f.observation_deck_clue_storm_weather) out.push("sp47_clue_storm_weather_telemetry");
  if (f.observation_deck_clue_storm_full_calms) out.push("sp48_clue_storm_full_calms_register");

  // L15 — astronomer's log (mutex)
  if (tv === "corrupted" || f.astronomer_log_classified) {
    out.push("sp51_astronomer_log_classified_redacted");
  } else if (f.shadow_tongue_active || f.astronomer_log_overstamped) {
    out.push("sp50_astronomer_log_overstamped_indigo");
  } else if (f.astronomer_log_dark_spot_appears) {
    out.push("sp49_astronomer_log_dark_spot_appears");
  }

  // L16 — atmosphere (additive blend)
  if (cycle === "dawn" || cycle === "balanced") out.push("sp52_atmospheric_dust_motes_viewport_beam");
  out.push("sp53_atmospheric_cosmic_dust_upper_volume");
  if (f.eidolon_contained_active || f.eidolon_first_manifestation) out.push("sp54_atmospheric_eidolon_shimmer_anchor");
  if (f.observation_deck_east_candle_lit) out.push("sp55_atmospheric_candle_smoke_east_alcove");
  if (f.observation_deck_west_candle_lit) out.push("sp56_atmospheric_candle_smoke_west_alcove");

  // L17 — faction overlays (additive when championed)
  if (factionHigh(g, "dreamers")) out.push("sp57_faction_dreamer_iris_cyan_alcove");
  if (factionHigh(g, "hierarchy")) out.push("sp58_faction_hierarchy_seal_curator_plinth");
  if (factionHigh(g, "antiquarian")) out.push("sp59_faction_antiquarian_codex_bench");
  if (factionHigh(g, "insurgency")) out.push("sp60_faction_insurgency_orange_sigil_wall");

  // L18 — tournament + hellbox (event-gated)
  if (f.tournament_active) {
    out.push("sp61_tournament_bracket_chip_music_console");
    out.push("sp62_tournament_banner_dome_drape");
  }
  if (f.hellbox3_active) out.push("sp63_hellbox3_chalk_spiral_floor");

  // L19 — IRL season dressing (mutex)
  if (season === "spring") out.push("sp64_irl_spring_petals_bench");
  else if (season === "summer") out.push("sp65_irl_summer_brass_sun_candle_stand");
  else if (season === "autumn") out.push("sp66_irl_autumn_oak_west_candle");
  else if (season === "winter") out.push("sp67_irl_winter_evergreen_curator_plinth");

  // L20 — eidolon presence/state (mutex; gates the eidolon hotspots)
  if (f.eidolon_inseparable || trust === "luminous") {
    out.push("sp74_eidolon_inseparable_perched_bench");
  } else if (f.eidolon_resonant_facing_glyph || trust === "lucid") {
    out.push("sp73_eidolon_resonant_facing_glyph");
  } else if (f.eidolon_tuning_90_degrees) {
    out.push("sp72_eidolon_tuning_90_degrees");
  } else if (f.eidolon_first_manifestation && !f.eidolon_inseparable) {
    out.push("sp75_eidolon_first_manifestation_half_resolved");
  } else if (f.eidolon_visible) {
    out.push("sp71_eidolon_untuned_distant");
  }
  // Anchor envelope + breath layer (additive when eidolon is present at all)
  if (f.eidolon_visible || f.eidolon_first_manifestation || f.eidolon_inseparable) {
    out.push("sp68_eidolon_anchor_resonance_envelope");
    out.push("sp70_eidolon_breath_filament_air");
  }
  if (f.eidolon_first_manifestation || base === "observation_deck_base_eidolon_first_manifestation") {
    out.push("sp69_eidolon_first_manifestation_shimmer");
  }

  // L21 — Human signal thread bloom (post-first-contact)
  if (f.first_human_contact || f.human_signal_thread_bloom) out.push("sp76_human_signal_thread_bloom");

  // L22 — witness glyph (mutex by trust band)
  if (trust === "luminous") out.push("sp79_witness_glyph_luminous_three_anchors");
  else if (trust === "lucid") out.push("sp78_witness_glyph_lucid_filament_to_viewport");
  else if (trust === "fragmented") out.push("sp77_witness_glyph_fragmented");

  // L23 — lore eggs (flag-gated)
  if (f.obs_constellation_panopticon_face_unlocked) out.push("sp80_lore_egg_obs_constellation_panopticon_face");
  if (f.warlord_surveillance_node_residue_unlocked) out.push("sp81_lore_warlord_surveillance_node_residue");
  if (f.engineer_recording_holo_unlocked) out.push("sp82_lore_engineer_recording_holo_active");

  // L24 — almanac + eidolon log + anchor inlay (event-gated)
  if (f.celestial_almanac_active || tier >= 5) out.push("sp83_celestial_almanac_active_warm_gold");
  if (f.eidolon_log_entries_visible) out.push("sp84_eidolon_log_active_entries_visible");
  if (trust === "luminous" || f.observation_deck_anchor_layered) out.push("sp85_anchor_inlay_warm_gold_cyan_layered");

  // L25 — closure beats
  if (f.observation_deck_investigation_closed) out.push("sp87_mystery_closure_evidence_cart_consolidated");
  if (f.bond_resonance_pulse_recent) out.push("sp88_bond_pulse_afterimage_one_star");

  return out;
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
