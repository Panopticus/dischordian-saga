/* ═══════════════════════════════════════════════════════
   ENGINEERING — composite resolver (Phase J)

   15 base renders + 87 sprite overlays. Diegetic home of
   the Mechronis crafting philosophy and the HB4 Academy
   gateway; reactor pulse drives the room's mood.
   ═══════════════════════════════════════════════════════ */

import {
  LIGHTING_FILTERS,
  deriveActTier,
  deriveCyclePhase,
  deriveTVInfection,
  factionHigh,
  moralityBand,
  trustBand,
} from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const ENGINEERING_BASE_IDS = [
  "engineering_base_act7_green_saved",
  "engineering_base_act7_red_cascade",
  "engineering_base_cycle_dawn",
  "engineering_base_cycle_long_night",
  "engineering_base_epoch_grand_edit",
  "engineering_base_hb4_transit",
  "engineering_base_morality_dark",
  "engineering_base_season_interregnum",
  "engineering_base_t0_dormant",
  "engineering_base_t2_activated",
  "engineering_base_t3_restored",
  "engineering_base_tv_corrupted",
  "engineering_base_tv_exposed",
  "engineering_base_tv_quarantined",
  "engineering_base_tv_spreading",
] as const;

export const ENGINEERING_SPRITE_IDS = [
  "sp01_ley_lines_intermittent_flicker",
  "sp02_ley_lines_solid_bright_circuit",
  "sp03_ley_lines_wrap_reactor_ring",
  "sp04_reactor_cold_grey_weak",
  "sp05_reactor_stable_warm_lavender",
  "sp06_reactor_full_lavender_green_ring",
  "sp07_reactor_red_alert_flickering",
  "sp08_reactor_green_stable_saved",
  "sp09_capacity_gauge_stalled_partial",
  "sp10_capacity_gauge_two_thirds",
  "sp11_capacity_gauge_maximum",
  "sp12_capacity_gauge_critical_red",
  "sp13_floor_radial_seams_green_glow",
  "sp14_floor_quarantine_band",
  "sp15_floor_investigation_yellow_tape",
  "sp16_floor_investigation_cyan_tape",
  "sp17_forge_door_warm_gold_unlocked",
  "sp18_armory_door_quarantine_band",
  "sp19_observation_door_warm_gold_spill",
  "sp20_warning_strobes_red_alert",
  "sp21_ceiling_one_high_bay_failed",
  "sp22_tool_rack_east_full_t3",
  "sp23_tool_rack_back_wall_new_panel",
  "sp24_tool_rack_one_missing_captain_key",
  "sp25_tool_rack_insurgency_caltrop_stamp",
  "sp26_blueprint_dark",
  "sp27_blueprint_single_card_schematic",
  "sp28_blueprint_three_rotating_schematics",
  "sp29_blueprint_mechronis_class_notation",
  "sp30_research_dim_standby",
  "sp31_research_active_warm_gold",
  "sp32_research_experiment_rig_lattice",
  "sp33_bench_unfinished_tools_fanned",
  "sp34_bench_signal_booster_finished",
  "sp35_bench_multi_part_active",
  "sp36_bench_combine_in_progress",
  "sp37_bench_act7_cleaned_honour",
  "sp38_combine_signal_booster_active_glow",
  "sp39_combine_schematic_restoration",
  "sp40_combine_viral_antidote",
  "sp41_combine_temporal_lens",
  "sp42_schematic_pad_indigo_overlay",
  "sp43_schematic_pad_rubbing_taken",
  "sp44_schematic_pad_restored_under_glass",
  "sp45_manual_closed_baseline",
  "sp46_manual_open_page_47",
  "sp47_manual_page_47_overstamped_indigo",
  "sp48_engineer_locker_closed",
  "sp49_engineer_locker_open_journal",
  "sp50_mezz1_reactor_console_amber",
  "sp51_mezz2_diagnostic_console_active",
  "sp52_mezz2_pod_zero_anomaly",
  "sp53_counting_tally_south_wall",
  "sp54_incomplete_engine_schematic",
  "sp55_substrate_integrity_alert",
  "sp56_wolf_host_residue_active",
  "sp57_wolf_anara_architecture_active",
  "sp58_egg_psi_null_formula",
  "sp59_egg_warlord_residue_bio_scanner",
  "sp60_kell_physical_residue_bench",
  "sp61_faction_insurgency_caltrop_reactor",
  "sp62_faction_hierarchy_seal_workbench",
  "sp63_faction_antiquarian_codex_bench",
  "sp64_faction_hierarchy_enemied_dimmed",
  "sp65_sparks_workbench_baseline",
  "sp66_sparks_forge_door_cascade",
  "sp67_dust_motes_warm_pendant",
  "sp68_steam_vent_floor_grating",
  "sp69_cogsworth_absent",
  "sp70_cogsworth_at_workstation",
  "sp71_hb4_workbench_partial_dissolution",
  "sp72_cogsworth_at_workbench",
  "sp73_cogsworth_at_mezzanine_diagnostic",
  "sp74_cogsworth_seated_finale",
  "sp75_wraith_smear_corner",
  "sp76_wraith_smear_extended_wall",
  "sp77_wraith_handprint_concretised",
  "sp78_tournament_bracket_chip_crafting_console",
  "sp79_tournament_banner_workshop_drape",
  "sp80_hellbox3_chalk_spiral_floor",
  "sp81_irl_spring_dried_flowers_chair",
  "sp82_irl_summer_brass_sun_workbench",
  "sp83_irl_autumn_oak_tool_rack",
  "sp84_irl_winter_evergreen_anvil",
  "sp85_witness_glyph_fragmented",
  "sp86_witness_glyph_lucid_filament_to_reactor",
  "sp87_witness_glyph_luminous_three_anchor",
] as const;

type EngBaseId = typeof ENGINEERING_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): EngBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "engineering");

  // HB4 transit + epoch + corruption + finale states override tier/cycle.
  if (f.hellbox_4_transit_active) return "engineering_base_hb4_transit";
  if (f.grand_edit_active) return "engineering_base_epoch_grand_edit";
  if (tv === "quarantined") return "engineering_base_tv_quarantined";
  if (tv === "corrupted") return "engineering_base_tv_corrupted";
  if (tv === "spreading") return "engineering_base_tv_spreading";
  if (tv === "exposed") return "engineering_base_tv_exposed";

  // Two-state Act 7 finale: green if the player kept the reactor alive,
  // red cascade if neglected.
  if (tier >= 7 && f.reactor_maintained) return "engineering_base_act7_green_saved";
  if (tier >= 7 && f.reactor_neglected) return "engineering_base_act7_red_cascade";

  // Tier 3 restored only fires when the research bench has come online.
  if (f.engineering_research_bench_online) return "engineering_base_t3_restored";

  // Activated lighting variants only over t2 (signal booster built).
  const activated = !!f.engineering_signal_booster_built;
  if (activated) {
    if (f.season_phase_interregnum) return "engineering_base_season_interregnum";
    if (moralityBand(g.moralityScore) === "dark") return "engineering_base_morality_dark";
    if (cycle === "longNight") return "engineering_base_cycle_long_night";
    if (cycle === "dawn") return "engineering_base_cycle_dawn";
    return "engineering_base_t2_activated";
  }
  return "engineering_base_t0_dormant";
}

function pickSprites(g: CompositeGameSlice, base: EngBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const activated = !!f.engineering_signal_booster_built;
  const restored = !!f.engineering_research_bench_online;

  // L1 — ley-line hull-rib lighting (mutex by tier)
  if (restored || base === "engineering_base_act7_green_saved") {
    out.push("sp03_ley_lines_wrap_reactor_ring");
  } else if (activated) {
    out.push("sp02_ley_lines_solid_bright_circuit");
  } else {
    out.push("sp01_ley_lines_intermittent_flicker");
  }

  // L2 — reactor viewport (mutex)
  const reactorStress = !!f.reactor_critical_alert;
  if (reactorStress || base === "engineering_base_act7_red_cascade") {
    out.push("sp07_reactor_red_alert_flickering");
  } else if (base === "engineering_base_act7_green_saved") {
    out.push("sp08_reactor_green_stable_saved");
  } else if (restored) {
    out.push("sp06_reactor_full_lavender_green_ring");
  } else if (activated) {
    out.push("sp05_reactor_stable_warm_lavender");
  } else {
    out.push("sp04_reactor_cold_grey_weak");
  }

  // L3 — capacity gauge (mutex)
  if (reactorStress) out.push("sp12_capacity_gauge_critical_red");
  else if (restored) out.push("sp11_capacity_gauge_maximum");
  else if (activated) out.push("sp10_capacity_gauge_two_thirds");
  else out.push("sp09_capacity_gauge_stalled_partial");

  // L4 — floor overlays (additive)
  if (restored) out.push("sp13_floor_radial_seams_green_glow");
  if (
    f.governance_quarantine_protocol ||
    base === "engineering_base_tv_quarantined"
  ) {
    out.push("sp14_floor_quarantine_band");
  }
  const investTier = f.engineering_case_closed
    ? "case-closed"
    : f.engineering_investigation_partial
      ? "partial"
      : f.engineering_investigation_investigating
        ? "investigating"
        : "initial";
  if (investTier === "investigating") out.push("sp15_floor_investigation_yellow_tape");
  if (investTier === "partial") out.push("sp16_floor_investigation_cyan_tape");

  // L5 — doors
  if (f.unlock_forge) out.push("sp17_forge_door_warm_gold_unlocked");
  if (f.governance_quarantine_protocol) out.push("sp18_armory_door_quarantine_band");
  if (f.observation_deck_visited) out.push("sp19_observation_door_warm_gold_spill");

  // L6 — warning strobes / ceiling
  if (reactorStress || base === "engineering_base_act7_red_cascade") {
    out.push("sp20_warning_strobes_red_alert");
  }
  if (tier >= 5) out.push("sp21_ceiling_one_high_bay_failed");

  // L7 — tool racks
  if (restored) {
    out.push("sp22_tool_rack_east_full_t3");
    out.push("sp23_tool_rack_back_wall_new_panel");
  }
  if (f.captains_master_key_missing) out.push("sp24_tool_rack_one_missing_captain_key");
  if (factionHigh(g, "insurgency")) out.push("sp25_tool_rack_insurgency_caltrop_stamp");

  // L8 — blueprint projector (mutex)
  if (f.unlock_mechronis_academy_mastery) {
    out.push("sp29_blueprint_mechronis_class_notation");
  } else if (restored) {
    out.push("sp28_blueprint_three_rotating_schematics");
  } else if (activated) {
    out.push("sp27_blueprint_single_card_schematic");
  } else {
    out.push("sp26_blueprint_dark");
  }

  // L9 — research station (mutex)
  if (restored) out.push("sp32_research_experiment_rig_lattice");
  else if (activated) out.push("sp31_research_active_warm_gold");
  else out.push("sp30_research_dim_standby");

  // L10 — crafting workbench contents (mutex)
  if (base === "engineering_base_act7_green_saved") {
    out.push("sp37_bench_act7_cleaned_honour");
  } else if (f.engineering_active_combine_in_progress) {
    out.push("sp36_bench_combine_in_progress");
  } else if (restored) {
    out.push("sp35_bench_multi_part_active");
  } else if (activated) {
    out.push("sp34_bench_signal_booster_finished");
  } else {
    out.push("sp33_bench_unfinished_tools_fanned");
  }

  // L11 — active combine glow (additive per slot)
  if (f.engineering_combine_signal_booster_active) out.push("sp38_combine_signal_booster_active_glow");
  if (f.engineering_combine_schematic_restoration_active) out.push("sp39_combine_schematic_restoration");
  if (f.engineering_combine_viral_antidote_active) out.push("sp40_combine_viral_antidote");
  if (f.engineering_combine_temporal_lens_active) out.push("sp41_combine_temporal_lens");

  // L12 — schematic pad (mutex)
  if (investTier === "case-closed") {
    out.push("sp44_schematic_pad_restored_under_glass");
  } else if (f.engineering_schematic_rubbing_collected) {
    out.push("sp43_schematic_pad_rubbing_taken");
  } else if ((f.shadow_tongue_power_40 ?? false) || f.shadow_tongue_evidence) {
    out.push("sp42_schematic_pad_indigo_overlay");
  }

  // L13 — instruction manual (mutex)
  if (f.grand_edit_active) out.push("sp47_manual_page_47_overstamped_indigo");
  else if (f.engineering_manual_page_47_read) out.push("sp46_manual_open_page_47");
  else out.push("sp45_manual_closed_baseline");

  // L14 — engineer locker
  if (f.cogsworth_locker_opened || tier >= 5) {
    out.push("sp49_engineer_locker_open_journal");
  } else {
    out.push("sp48_engineer_locker_closed");
  }

  // L15 — mezzanine consoles
  if (reactorStress) out.push("sp50_mezz1_reactor_console_amber");
  if (f.engineering_diagnostic_engaged) out.push("sp51_mezz2_diagnostic_console_active");
  if (f.pod_zero_anomaly_visible) out.push("sp52_mezz2_pod_zero_anomaly");

  // L16 — storyteller hooks
  if (tier >= 4) out.push("sp53_counting_tally_south_wall");
  if (f.engineering_incomplete_schematic_seen) out.push("sp54_incomplete_engine_schematic");
  if (f.substrate_integrity_alert_active) out.push("sp55_substrate_integrity_alert");

  // L17 — wolf-arc consoles
  if (f.wolf_host_residue_investigated) out.push("sp56_wolf_host_residue_active");
  if (f.wolf_anara_architecture_investigated) out.push("sp57_wolf_anara_architecture_active");

  // L18 — mystery residue / eggs
  if (f.engineering_psi_null_formula_examined) out.push("sp58_egg_psi_null_formula");
  if (f.warlord_residue_scanned) out.push("sp59_egg_warlord_residue_bio_scanner");
  if (tier >= 5) out.push("sp60_kell_physical_residue_bench");

  // L19 — faction marks
  if (factionHigh(g, "insurgency")) out.push("sp61_faction_insurgency_caltrop_reactor");
  if (factionHigh(g, "hierarchy")) out.push("sp62_faction_hierarchy_seal_workbench");
  if (factionHigh(g, "antiquarian")) out.push("sp63_faction_antiquarian_codex_bench");
  if (
    g.factionReputation &&
    Object.values(g.factionReputation).some((v) => v <= -50)
  ) {
    out.push("sp64_faction_hierarchy_enemied_dimmed");
  }

  // L20 — atmospheric particles (additive over activated states)
  if (activated && !reactorStress) out.push("sp65_sparks_workbench_baseline");
  if (base === "engineering_base_act7_red_cascade") out.push("sp66_sparks_forge_door_cascade");
  if (activated) out.push("sp67_dust_motes_warm_pendant");
  if (activated) out.push("sp68_steam_vent_floor_grating");

  // L21 — HB4 pre-transit / transit
  if (base === "engineering_base_hb4_transit") {
    out.push("sp71_hb4_workbench_partial_dissolution");
  }

  // L22 — Cogsworth NPC (mutex)
  if (tier < 3 || base === "engineering_base_act7_red_cascade") {
    out.push("sp69_cogsworth_absent");
  } else if (base === "engineering_base_act7_green_saved") {
    out.push("sp74_cogsworth_seated_finale");
  } else if (reactorStress || f.pod_zero_anomaly_visible) {
    out.push("sp73_cogsworth_at_mezzanine_diagnostic");
  } else if (f.cogsworth_at_workstation) {
    out.push("sp70_cogsworth_at_workstation");
  } else {
    out.push("sp72_cogsworth_at_workbench");
  }

  // L23 — Shadow Tongue wraith (mutex by escalation)
  if (f.shadow_tongue_handprint_concretised) {
    out.push("sp77_wraith_handprint_concretised");
  } else if (f.first_forge_cutscene_seen) {
    out.push("sp76_wraith_smear_extended_wall");
  } else if ((f.shadow_tongue_power_40 ?? false) || f.shadow_tongue_evidence) {
    out.push("sp75_wraith_smear_corner");
  }

  // L24 — tournament + hellbox 3
  if (f.tournament_finals_window) {
    out.push("sp78_tournament_bracket_chip_crafting_console");
    out.push("sp79_tournament_banner_workshop_drape");
  }
  if (f.hellbox3_palimpsest) out.push("sp80_hellbox3_chalk_spiral_floor");

  // L25 — IRL season trinket (mutex)
  if (g.irlSeason === "spring") out.push("sp81_irl_spring_dried_flowers_chair");
  else if (g.irlSeason === "summer") out.push("sp82_irl_summer_brass_sun_workbench");
  else if (g.irlSeason === "autumn") out.push("sp83_irl_autumn_oak_tool_rack");
  else if (g.irlSeason === "winter") out.push("sp84_irl_winter_evergreen_anvil");

  // L26 — Elara witness-glyph (mutex)
  const trust = trustBand(g.elaraTrust);
  if (trust === "fragmented") out.push("sp85_witness_glyph_fragmented");
  else if (trust === "lucid") out.push("sp86_witness_glyph_lucid_filament_to_reactor");
  else if (trust === "luminous") out.push("sp87_witness_glyph_luminous_three_anchor");

  return out;
}

function pickFilter(base: EngBaseId): string | undefined {
  if (base === "engineering_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "engineering_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "engineering_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "engineering_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "engineering_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "engineering_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  if (base === "engineering_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "engineering_base_hb4_transit") return "brightness(1.10) saturate(1.15)";
  if (base === "engineering_base_act7_red_cascade") {
    return "brightness(0.75) saturate(1.30) hue-rotate(-20deg)";
  }
  if (base === "engineering_base_act7_green_saved") {
    return "brightness(1.05) hue-rotate(50deg)";
  }
  return undefined;
}

export function resolveEngineeringComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
