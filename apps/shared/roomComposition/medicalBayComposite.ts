/* ═══════════════════════════════════════════════════════
   MEDICAL BAY — composite resolver (Phase J)

   12 base renders + 88 sprite overlays.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const MEDICAL_BAY_BASE_IDS = [
  "medical_bay_base_act7_finale",
  "medical_bay_base_cycle_dawn",
  "medical_bay_base_cycle_long_night",
  "medical_bay_base_epoch_grand_edit",
  "medical_bay_base_hellbox1_transit",
  "medical_bay_base_initial",
  "medical_bay_base_morality_dark",
  "medical_bay_base_season_interregnum",
  "medical_bay_base_tv_corrupted",
  "medical_bay_base_tv_exposed",
  "medical_bay_base_tv_quarantined",
  "medical_bay_base_tv_spreading",
] as const;

export const MEDICAL_BAY_SPRITE_IDS = [
  "sp01_panel_ajar_30_device_sliver",
  "sp02_panel_open_device_awakened",
  "sp03_panel_open_device_donated",
  "sp04_panel_closed_hairline_seam",
  "sp05_readout_idle_cyan_pulse",
  "sp06_readout_ready_warm_gold_glyph",
  "sp07_readout_cooled_steel_blue",
  "sp08_readout_red_glyph_alarm",
  "sp09_readout_research_sub_panel",
  "sp10_surgical_array_active",
  "sp11_helix_baseline_green_rotating",
  "sp12_helix_locked_paused",
  "sp13_helix_reversed_lavender",
  "sp14_helix_third_strand_violet",
  "sp15_helix_iris_cyan_filaments",
  "sp16_autoclave_coda_silk_ribbon",
  "sp17_autoclave_brass_steam_wisp",
  "sp18_autoclave_petals_emerging",
  "sp19_autoclave_dna_receipt_plate",
  "sp20_synthesis_door_amber_baseline",
  "sp21_synthesis_door_open",
  "sp22_synthesis_door_quarantine_band",
  "sp23_cryo_door_warm_gold_spill",
  "sp24_floor_seal_calibration_active",
  "sp25_floor_quarantine_band",
  "sp26_floor_boot_glass_footprints",
  "sp27_floor_blood_weave_lattice_edges",
  "sp28_apsidal_glass_dawn_intensified",
  "sp29_apsidal_glass_grand_edit_indigo",
  "sp30_apsidal_glass_hb1_petal_burst",
  "sp31_medicine_cabinet_cracked_open",
  "sp32_medicine_cabinet_empty",
  "sp33_body_catalog_drawer_marked",
  "sp34_safe_open_keycard_visible",
  "sp35_safe_open_empty",
  "sp36_bio_bed_dais_biocontainment_hood",
  "sp37_bio_bed_dais_column_etched_ring",
  "sp38_fabricators_act2_glyph_etched",
  "sp39_fabricators_civic_engineers_stickers",
  "sp40_fabricator_pulled_to_service_trolley",
  "sp41_autopsy_console_active",
  "sp42_console_advocate_empire_zero_casualty",
  "sp43_console_akai_virus_telemetry",
  "sp44_console_broker_quantum_imaging",
  "sp45_vex_stranger_at_bench",
  "sp46_vex_watcher_face_down_card",
  "sp47_vex_confidant_relaxed",
  "sp48_vex_inner_circle_unmasked",
  "sp49_vex_eyes_of_reality_rigid",
  "sp50_vex_absent",
  "sp51_source_anchor_bio_bed",
  "sp52_source_anchor_helix",
  "sp53_source_anchor_autoclave",
  "sp54_source_anchor_apsidal",
  "sp55_hellbox_chalk_sigil_floor",
  "sp56_hellbox_candle_ring",
  "sp57_tournament_bracket_chip",
  "sp58_faction_atmo_authority_gold_haze",
  "sp59_faction_atmo_substrate_purple_static",
  "sp60_faction_atmo_guild_green_mist",
  "sp61_faction_atmo_insurgent_red_haze",
  "sp62_irl_trinket_spring_flower",
  "sp63_irl_trinket_summer_shell",
  "sp64_irl_trinket_autumn_leaf",
  "sp65_irl_trinket_winter_snowflake",
  "sp66_cades_dischordia_card",
  "sp67_tournament_bracket_panels_restricted",
  "sp68_tournament_bracket_chip_console",
  "sp69_hellbox3_chalk_spiral_floor",
  "sp70_irl_spring_petals_vex_desk",
  "sp71_irl_summer_brass_sun_charm",
  "sp72_irl_autumn_oak_sprig_autoclave_shelf",
  "sp73_irl_winter_frost_evergreen_apsidal",
  "sp74_witness_glyph_fragmented",
  "sp75_witness_glyph_lucid_filament",
  "sp76_witness_glyph_luminous_halo",
  "sp77_lore_research_vessel_helix_third_strand",
  "sp78_lore_source_is_kael_voidblack_static",
  "sp79_lore_cryo_victim_engineer_panel_brass_steam",
  "sp80_vex_journal_closed_baseline",
  "sp81_vex_journal_open_pages",
  "sp82_vex_sample_tray_phosphor_green",
  "sp83_vex_diagnostic_card_tray_act_2",
  "sp84_vex_workstation_cleared_act_7",
  "sp85_egg_void_essence_vial",
  "sp86_egg_medical_log_data_pad",
  "sp87_egg_floor_seal_hairline_crack",
  "sp88_egg_autoclave_brass_patina_mark",
] as const;

type MedBaseId = typeof MEDICAL_BAY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): MedBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g);

  if (f.hellbox1_transit_active) return "medical_bay_base_hellbox1_transit";
  if (f.grand_edit_active) return "medical_bay_base_epoch_grand_edit";
  if (tv === "quarantined") return "medical_bay_base_tv_quarantined";
  if (tv === "corrupted") return "medical_bay_base_tv_corrupted";
  if (tv === "spreading") return "medical_bay_base_tv_spreading";
  if (tv === "exposed") return "medical_bay_base_tv_exposed";
  if (tier >= 7) return "medical_bay_base_act7_finale";
  if (f.season_phase_interregnum) return "medical_bay_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "medical_bay_base_morality_dark";
  if (cycle === "longNight") return "medical_bay_base_cycle_long_night";
  if (cycle === "dawn") return "medical_bay_base_cycle_dawn";
  return "medical_bay_base_initial";
}

function pickSprites(g: CompositeGameSlice, base: MedBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);

  // L1 — panel / neural-bridge device (mutex)
  const deviceState = f.refused_dna_sample
    ? "refused"
    : f.donated_dna_sample
    ? "donated"
    : f.medbay_device_awakened
    ? "device-awakened"
    : "initial";
  if (deviceState === "device-awakened") out.push("sp02_panel_open_device_awakened");
  else if (deviceState === "donated") out.push("sp03_panel_open_device_donated");
  else if (deviceState === "refused") out.push("sp04_panel_closed_hairline_seam");
  else out.push("sp01_panel_ajar_30_device_sliver");

  // L2 — bio-bed readout (mutex)
  if (f.medbay_surgical_active || f.hellbox1_transit_active) {
    out.push("sp08_readout_red_glyph_alarm");
  } else if (deviceState === "device-awakened") {
    out.push("sp06_readout_ready_warm_gold_glyph");
  } else if (tier >= 6) {
    out.push("sp07_readout_cooled_steel_blue");
  } else {
    out.push("sp05_readout_idle_cyan_pulse");
  }
  if (f.unlock_research_minigame) out.push("sp09_readout_research_sub_panel");

  // L3 — surgical array
  if (f.medbay_surgical_active) out.push("sp10_surgical_array_active");

  // L4 — DNA helix (mutex)
  if (moralityBand(g.moralityScore) === "dark") out.push("sp13_helix_reversed_lavender");
  else if (f.discovered_ark_1047_is_research_vessel) out.push("sp14_helix_third_strand_violet");
  else if (factionHigh(g, "dreamers")) out.push("sp15_helix_iris_cyan_filaments");
  else if (f.hellbox1_transit_active) out.push("sp12_helix_locked_paused");
  else out.push("sp11_helix_baseline_green_rotating");

  // L5 — autoclave dressing (additive)
  if (factionHigh(g, "coda")) out.push("sp16_autoclave_coda_silk_ribbon");
  if (f.hellbox1_gateway_opening) out.push("sp18_autoclave_petals_emerging");
  if (deviceState === "donated") out.push("sp19_autoclave_dna_receipt_plate");
  if (f.vex_reveal_engineer_zero_hint || f.vex_reveal_engineer_zero_confirmed) {
    out.push("sp17_autoclave_brass_steam_wisp");
  }

  // L6 — doors
  if (f.governance_quarantine_protocol) out.push("sp22_synthesis_door_quarantine_band");
  else if (f.unlock_synthesis_chamber) out.push("sp21_synthesis_door_open");
  else out.push("sp20_synthesis_door_amber_baseline");
  if (f.cryo_case_marked_open || tier >= 1) out.push("sp23_cryo_door_warm_gold_spill");

  // L7 — floor (additive)
  if (f.medbay_bio_bed_in_use) out.push("sp24_floor_seal_calibration_active");
  if (f.governance_universal_quarantine) out.push("sp25_floor_quarantine_band");
  out.push("sp26_floor_boot_glass_footprints"); // canonical detail
  if (tier >= 4 && factionHigh(g, "hierarchy")) out.push("sp27_floor_blood_weave_lattice_edges");

  // L8 — apsidal vault overlays
  if (base === "medical_bay_base_hellbox1_transit") {
    out.push("sp30_apsidal_glass_hb1_petal_burst");
  } else if (base === "medical_bay_base_cycle_dawn") {
    out.push("sp28_apsidal_glass_dawn_intensified");
  }
  if (f.grand_edit_active) out.push("sp29_apsidal_glass_grand_edit_indigo");

  // L9 — cabinets
  if (tier >= 7) out.push("sp32_medicine_cabinet_empty");
  else if (f.unlock_hellbox) out.push("sp31_medicine_cabinet_cracked_open");
  if (f.advocate_empire_visited) out.push("sp33_body_catalog_drawer_marked");

  // L10 — safe
  if (f.observation_keycard_collected) out.push("sp35_safe_open_empty");
  else if (f.safe_opened) out.push("sp34_safe_open_keycard_visible");

  // L11 — bio-bed dais additions
  if (tier >= 3) out.push("sp36_bio_bed_dais_biocontainment_hood");
  if (tier >= 6) out.push("sp37_bio_bed_dais_column_etched_ring");

  // L12 — fabricators
  if (tier >= 2) out.push("sp38_fabricators_act2_glyph_etched");
  if (factionHigh(g, "guild")) out.push("sp39_fabricators_civic_engineers_stickers");
  if (tier >= 4) out.push("sp40_fabricator_pulled_to_service_trolley");

  // L13 — specialty consoles
  if (f.medbay_autopsy_active) out.push("sp41_autopsy_console_active");
  if (f.medbay_console_advocate_active) out.push("sp42_console_advocate_empire_zero_casualty");
  if (f.medbay_console_akai_active) out.push("sp43_console_akai_virus_telemetry");
  if (f.medbay_console_broker_active) out.push("sp44_console_broker_quantum_imaging");

  // L14 — Vex pose (mutex)
  const vexInScene = f.vex_woken && tier < 7 && !f.vex_left_med_bay;
  if (!vexInScene) {
    out.push("sp50_vex_absent");
  } else if (f.vex_reveal_eyes_of_reality) {
    out.push("sp49_vex_eyes_of_reality_rigid");
  } else {
    const trust = trustBand(g.elaraTrust); // shared trust scalar for Vex's confidence track
    if (trust === "luminous") out.push("sp48_vex_inner_circle_unmasked");
    else if (trust === "lucid") out.push("sp47_vex_confidant_relaxed");
    else if (f.vex_watcher_revealed) out.push("sp46_vex_watcher_face_down_card");
    else out.push("sp45_vex_stranger_at_bench");
  }

  // L15 — Source voice-anchor (mutex)
  if (f.discovered_the_source_is_kael) out.push("sp54_source_anchor_apsidal");
  else if (moralityBand(g.moralityScore) === "dark") out.push("sp52_source_anchor_helix");
  else if (f.hellbox1_transit_active) out.push("sp53_source_anchor_autoclave");
  else out.push("sp51_source_anchor_bio_bed");

  // L16 — tournament & hellbox 3
  if (f.tournament_finals_window) {
    out.push("sp57_tournament_bracket_chip");
    out.push("sp68_tournament_bracket_chip_console");
    if (f.unlock_synthesis_chamber) out.push("sp67_tournament_bracket_panels_restricted");
  }
  if (f.hellbox3_palimpsest) {
    out.push("sp55_hellbox_chalk_sigil_floor");
    out.push("sp69_hellbox3_chalk_spiral_floor");
  }
  if (f.hellbox1_transit_active) out.push("sp56_hellbox_candle_ring");

  // L17 — faction atmospherics
  if (factionHigh(g, "authority")) out.push("sp58_faction_atmo_authority_gold_haze");
  else if (factionHigh(g, "substrate_rebels")) out.push("sp59_faction_atmo_substrate_purple_static");
  else if (factionHigh(g, "guild")) out.push("sp60_faction_atmo_guild_green_mist");
  else if (factionHigh(g, "insurgency")) out.push("sp61_faction_atmo_insurgent_red_haze");

  // L18 — IRL season trinket (and player-pod-equivalent on Vex's desk)
  if (g.irlSeason === "spring") {
    out.push("sp62_irl_trinket_spring_flower");
    out.push("sp70_irl_spring_petals_vex_desk");
  } else if (g.irlSeason === "summer") {
    out.push("sp63_irl_trinket_summer_shell");
    out.push("sp71_irl_summer_brass_sun_charm");
  } else if (g.irlSeason === "autumn") {
    out.push("sp64_irl_trinket_autumn_leaf");
    out.push("sp72_irl_autumn_oak_sprig_autoclave_shelf");
  } else if (g.irlSeason === "winter") {
    out.push("sp65_irl_trinket_winter_snowflake");
    out.push("sp73_irl_winter_frost_evergreen_apsidal");
  }

  // L19 — CADES
  if (f.cades_kael_present) out.push("sp66_cades_dischordia_card");

  // L20 — witness-glyph (mutex)
  const trust = trustBand(g.elaraTrust);
  if (trust === "fragmented") out.push("sp74_witness_glyph_fragmented");
  else if (trust === "lucid") out.push("sp75_witness_glyph_lucid_filament");
  else if (trust === "luminous") out.push("sp76_witness_glyph_luminous_halo");

  // L21 — lore-discovery atmospherics
  if (f.discovered_ark_1047_is_research_vessel) {
    out.push("sp77_lore_research_vessel_helix_third_strand");
  }
  if (f.discovered_the_source_is_kael) {
    out.push("sp78_lore_source_is_kael_voidblack_static");
  }
  if (f.discovered_cryo_victim_was_engineer) {
    out.push("sp79_lore_cryo_victim_engineer_panel_brass_steam");
  }

  // L22 — Vex workstation details
  if (tier >= 5 && f.vex_journal_read) out.push("sp81_vex_journal_open_pages");
  else if (vexInScene) out.push("sp80_vex_journal_closed_baseline");
  if (vexInScene) out.push("sp82_vex_sample_tray_phosphor_green");
  if (tier >= 2 && tier < 7) out.push("sp83_vex_diagnostic_card_tray_act_2");
  if (tier >= 7) out.push("sp84_vex_workstation_cleared_act_7");

  // L23 — eggs
  if (!f.collected_void_essence_vial) out.push("sp85_egg_void_essence_vial");
  out.push("sp86_egg_medical_log_data_pad");
  if (tier >= 1) out.push("sp87_egg_floor_seal_hairline_crack");
  if (f.discovered_autoclave_patina) out.push("sp88_egg_autoclave_brass_patina_mark");

  return out;
}

function pickFilter(base: MedBaseId): string | undefined {
  if (base === "medical_bay_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "medical_bay_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "medical_bay_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "medical_bay_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "medical_bay_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "medical_bay_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  if (base === "medical_bay_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "medical_bay_base_hellbox1_transit") return LIGHTING_FILTERS.hellbox1_transit;
  return undefined;
}

export function resolveMedicalBayComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
