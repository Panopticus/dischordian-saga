/* ═══════════════════════════════════════════════════════
   CARGO HOLD — composite resolver (Phase J)

   15 base renders + 65 sprite overlays.

   The base picker covers the common axes (cycle, TV-infection,
   morality, season, epoch, act tier) plus room-specific narrative
   bases:

     - crane_lift_active           (crane in motion)
     - elevator_active_motion      (freight elevator running)
     - oracle_clone_revealed       (oracle-crate 7 omega beat)
     - epoch_grand_edit / post     (grand-edit beats)
     - act7_rich_trader_ending     (Trade Empire route finale)
     - act7_spartan_ending         (Spartan route finale)

   pickSprites emits a small default stack (high-bay lighting +
   manifest terminal + idle crane + neutral crate stack + brass
   compass-rose floor + locker baseline + cosmetic mannequin
   default) plus beat-specific overlays. The high-confidence
   feature hotspots are gated to these sprites via compositeScopes
   in ROOM_DEFINITIONS (GameContext.tsx).
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, moralityBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const CARGO_HOLD_BASE_IDS = [
  "cargo_hold_base_act7_rich_trader_ending",
  "cargo_hold_base_act7_spartan_ending",
  "cargo_hold_base_crane_lift_active",
  "cargo_hold_base_cycle_dawn",
  "cargo_hold_base_cycle_long_night",
  "cargo_hold_base_elevator_active_motion",
  "cargo_hold_base_epoch_grand_edit",
  "cargo_hold_base_epoch_post_grand_edit",
  "cargo_hold_base_initial",
  "cargo_hold_base_morality_dark",
  "cargo_hold_base_oracle_clone_revealed",
  "cargo_hold_base_season_interregnum",
  "cargo_hold_base_tv_corrupted",
  "cargo_hold_base_tv_exposed",
  "cargo_hold_base_tv_spreading",
] as const;

export const CARGO_HOLD_SPRITE_IDS = [
  "sp01_high_bay_pendants_full_cool_white",
  "sp02_high_bay_pendants_flickering_violet",
  "sp03_ambient_dawn_warm_overlay",
  "sp04_ambient_long_night_cool_overlay",
  "sp05_substrate_vapour_overlay",
  "sp06_warning_strobe_dark_inactive",
  "sp07_warning_strobe_flashing_amber",
  "sp08_wall_amber_warning_stripe_band",
  "sp09_tv_mycelium_floor_threads",
  "sp10_tv_mycelium_heavy_fan",
  "sp11_tv_voidblack_ichor_floor",
  "sp12_compass_rose_floor_inlay_baseline",
  "sp13_compass_rose_gold_victory",
  "sp14_indigo_scar_floor_healed",
  "sp15_forklift_path_bronze_inlay_clean",
  "sp16_forklift_path_oil_stained",
  "sp17_crane_gantry_idle_no_load",
  "sp18_crane_gantry_active_crate_lifted",
  "sp19_crane_gantry_tv_corrupted",
  "sp20_crane_control_panel_idle",
  "sp21_crane_control_panel_active_cyan",
  "sp22_heavy_load_sign",
  "sp23_crate_stack_empty_grid",
  "sp24_crate_stack_partial_3_high",
  "sp25_crate_stack_full_5_high",
  "sp26_crate_stack_tv_corrupted",
  "sp27_crate_anchor_grid_full",
  "sp28_sealed_crate_intact_claw_marks",
  "sp29_sealed_crate_indigo_bleed",
  "sp30_sealed_crate_burst_open",
  "sp31_sealed_crate_welded_repair",
  "sp32_oracle_crate_7_omega_glow",
  "sp33_freight_elevator_closed_brass_doors",
  "sp34_freight_elevator_open_mid_transit",
  "sp35_elevator_status_display_idle",
  "sp36_forklift_parked_yellow_brass",
  "sp37_manifest_terminal_idle_globe_rotating",
  "sp38_manifest_terminal_warning_glyph",
  "sp39_manifest_terminal_tv_corrupted",
  "sp40_cargo_handler_npc_at_manifest",
  "sp41_armory_stairs_door_closed",
  "sp42_captains_quarters_door_restricted",
  "sp43_forge_workshop_door_closed",
  "sp44_forge_workshop_door_open",
  "sp45_maintenance_door_closed",
  "sp46_trade_corridor_door_closed",
  "sp47_trade_empire_dais_baseline",
  "sp48_trade_empire_dais_bare_platform",
  "sp49_trade_empire_dais_opulent",
  "sp50_personal_locker_wall_all_lit",
  "sp51_personal_locker_wall_one_lit",
  "sp52_requisitions_counter_closed_curtain",
  "sp53_requisitions_counter_open_curtain",
  "sp54_marketplace_board_active",
  "sp55_cosmetic_mannequin_default_uniform",
  "sp56_cosmetic_mannequin_ceremonial_gold",
  "sp57_mezzanine_walkway_steel_grating",
  "sp58_industrial_staircase_left",
  "sp59_brass_weighing_scales",
  "sp60_blue_orb_side_table",
  "sp61_creed_plaque_what_we_carry",
  "sp62_torn_manifest_page_compass_star",
  "sp63_rubber_chicken_hidden_pulley_concealed",
  "sp64_fleet_docking_bay_ships_moored",
  "sp65_fleet_docking_bay_all_dark",
] as const;

type CargoHoldBaseId = typeof CARGO_HOLD_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): CargoHoldBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "cargo_hold");

  // Highest-priority narrative beats.
  if (f.cargo_hold_oracle_clone_revealed) return "cargo_hold_base_oracle_clone_revealed";
  if (f.cargo_hold_crane_lift_active) return "cargo_hold_base_crane_lift_active";
  if (f.cargo_hold_elevator_active) return "cargo_hold_base_elevator_active_motion";

  // Epoch beats.
  if (f.epoch_post_grand_edit) return "cargo_hold_base_epoch_post_grand_edit";
  if (f.grand_edit_active) return "cargo_hold_base_epoch_grand_edit";

  // Act-7 endings (mutex by route).
  if (tier >= 7) {
    if (f.act7_rich_trader_ending) return "cargo_hold_base_act7_rich_trader_ending";
    if (f.act7_spartan_ending) return "cargo_hold_base_act7_spartan_ending";
  }

  // TV-infection (room has 3 stages but no clean/quarantined dedicated bases).
  if (tv === "corrupted") return "cargo_hold_base_tv_corrupted";
  if (tv === "spreading") return "cargo_hold_base_tv_spreading";
  if (tv === "exposed") return "cargo_hold_base_tv_exposed";

  // Atmospheric / cycle.
  if (f.season_phase_interregnum) return "cargo_hold_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "cargo_hold_base_morality_dark";
  if (cycle === "longNight") return "cargo_hold_base_cycle_long_night";
  if (cycle === "dawn") return "cargo_hold_base_cycle_dawn";

  return "cargo_hold_base_initial";
}

function pickSprites(g: CompositeGameSlice, base: CargoHoldBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "cargo_hold");

  // L1 — high-bay lighting (mutex)
  if (tv === "corrupted" || tv === "spreading") {
    out.push("sp02_high_bay_pendants_flickering_violet");
  } else {
    out.push("sp01_high_bay_pendants_full_cool_white");
  }

  // L2 — ambient cycle overlay (mutex; only at the extremes)
  if (cycle === "dawn") out.push("sp03_ambient_dawn_warm_overlay");
  else if (cycle === "longNight") out.push("sp04_ambient_long_night_cool_overlay");

  // L3 — TV mycelium (mutex; absent on clean/exposed)
  if (tv === "corrupted") {
    out.push("sp10_tv_mycelium_heavy_fan", "sp11_tv_voidblack_ichor_floor");
  } else if (tv === "spreading") {
    out.push("sp09_tv_mycelium_floor_threads");
  }

  // L4 — substrate vapour
  if (f.cargo_hold_substrate_vapour_active) out.push("sp05_substrate_vapour_overlay");

  // L5 — warning strobe (mutex)
  if (f.cargo_hold_warning_strobe_active) {
    out.push("sp07_warning_strobe_flashing_amber", "sp08_wall_amber_warning_stripe_band");
  } else {
    out.push("sp06_warning_strobe_dark_inactive");
  }

  // L6 — floor compass rose (mutex; gates the compass-rose hotspot)
  if (f.cargo_hold_compass_victory || tier7Victory(g)) {
    out.push("sp13_compass_rose_gold_victory");
  } else {
    out.push("sp12_compass_rose_floor_inlay_baseline");
  }

  // L7 — indigo scar healing
  if (f.cargo_hold_indigo_scar_healed) out.push("sp14_indigo_scar_floor_healed");

  // L8 — forklift path (mutex)
  if (f.cargo_hold_forklift_path_clean) {
    out.push("sp15_forklift_path_bronze_inlay_clean");
  } else {
    out.push("sp16_forklift_path_oil_stained");
  }

  // L9 — crane gantry (mutex; gates crane-gantry hotspot)
  if (tv === "corrupted") {
    out.push("sp19_crane_gantry_tv_corrupted");
  } else if (f.cargo_hold_crane_lift_active || base === "cargo_hold_base_crane_lift_active") {
    out.push("sp18_crane_gantry_active_crate_lifted");
  } else {
    out.push("sp17_crane_gantry_idle_no_load");
  }

  // L10 — crane control panel (mutex; gates crane-control-panel hotspot)
  if (f.cargo_hold_crane_lift_active) {
    out.push("sp21_crane_control_panel_active_cyan");
  } else {
    out.push("sp20_crane_control_panel_idle");
  }

  // L11 — heavy-load sign (always-on dressing on the crane area)
  out.push("sp22_heavy_load_sign");

  // L12 — crate stack (mutex; gates crate-stack hotspot)
  if (tv === "corrupted") {
    out.push("sp26_crate_stack_tv_corrupted");
  } else if (f.cargo_hold_crates_full) {
    out.push("sp25_crate_stack_full_5_high");
  } else if (f.cargo_hold_crates_partial) {
    out.push("sp24_crate_stack_partial_3_high");
  } else if (f.cargo_hold_crates_empty) {
    out.push("sp23_crate_stack_empty_grid");
  } else {
    out.push("sp24_crate_stack_partial_3_high");
  }
  if (f.cargo_hold_crate_anchor_grid) out.push("sp27_crate_anchor_grid_full");

  // L13 — sealed crate (mutex; gates sealed-crate hotspot)
  if (f.cargo_hold_sealed_crate_burst) out.push("sp30_sealed_crate_burst_open");
  else if (f.cargo_hold_sealed_crate_welded) out.push("sp31_sealed_crate_welded_repair");
  else if (f.cargo_hold_sealed_crate_indigo) out.push("sp29_sealed_crate_indigo_bleed");
  else out.push("sp28_sealed_crate_intact_claw_marks");

  // L14 — oracle crate 7 (only on reveal)
  if (f.cargo_hold_oracle_clone_revealed || base === "cargo_hold_base_oracle_clone_revealed") {
    out.push("sp32_oracle_crate_7_omega_glow");
  }

  // L15 — freight elevator (mutex; gates freight-elevator hotspot)
  if (f.cargo_hold_elevator_active || base === "cargo_hold_base_elevator_active_motion") {
    out.push("sp34_freight_elevator_open_mid_transit");
  } else {
    out.push("sp33_freight_elevator_closed_brass_doors");
  }
  out.push("sp35_elevator_status_display_idle");

  // L16 — forklift parked
  out.push("sp36_forklift_parked_yellow_brass");

  // L17 — manifest terminal (mutex; gates manifest-terminal hotspot)
  if (tv === "corrupted") {
    out.push("sp39_manifest_terminal_tv_corrupted");
  } else if (f.cargo_hold_manifest_warning) {
    out.push("sp38_manifest_terminal_warning_glyph");
  } else {
    out.push("sp37_manifest_terminal_idle_globe_rotating");
  }

  // L18 — cargo handler NPC (only when present)
  if (f.cargo_hold_handler_present) out.push("sp40_cargo_handler_npc_at_manifest");

  // L19 — doors (always present, mutex on forge open/closed)
  out.push("sp41_armory_stairs_door_closed");
  out.push("sp42_captains_quarters_door_restricted");
  out.push(f.cargo_hold_forge_workshop_open ? "sp44_forge_workshop_door_open" : "sp43_forge_workshop_door_closed");
  out.push("sp45_maintenance_door_closed");
  out.push("sp46_trade_corridor_door_closed");

  // L20 — trade-empire dais (mutex; gates trade-empire hotspot)
  if (f.act7_rich_trader_ending || base === "cargo_hold_base_act7_rich_trader_ending") {
    out.push("sp49_trade_empire_dais_opulent");
  } else if (f.act7_spartan_ending || base === "cargo_hold_base_act7_spartan_ending") {
    out.push("sp48_trade_empire_dais_bare_platform");
  } else {
    out.push("sp47_trade_empire_dais_baseline");
  }

  // L21 — personal lockers (mutex; gates personal-lockers hotspot)
  if (f.cargo_hold_lockers_all_lit) {
    out.push("sp50_personal_locker_wall_all_lit");
  } else {
    out.push("sp51_personal_locker_wall_one_lit");
  }

  // L22 — requisitions counter (mutex; gates requisitions-counter hotspot)
  if (f.cargo_hold_requisitions_open) {
    out.push("sp53_requisitions_counter_open_curtain");
  } else {
    out.push("sp52_requisitions_counter_closed_curtain");
  }

  // L23 — marketplace board (only when active)
  if (f.cargo_hold_marketplace_active) out.push("sp54_marketplace_board_active");

  // L24 — cosmetic mannequin (mutex; gates cosmetic-mannequin hotspot)
  if (f.cargo_hold_mannequin_ceremonial) {
    out.push("sp56_cosmetic_mannequin_ceremonial_gold");
  } else {
    out.push("sp55_cosmetic_mannequin_default_uniform");
  }

  // L25 — architecture
  out.push("sp57_mezzanine_walkway_steel_grating");
  out.push("sp58_industrial_staircase_left");

  // L26 — fixed decor
  out.push("sp59_brass_weighing_scales");
  out.push("sp60_blue_orb_side_table");
  out.push("sp61_creed_plaque_what_we_carry");

  // L27 — story artifacts (gated)
  if (f.cargo_hold_torn_manifest_found) out.push("sp62_torn_manifest_page_compass_star");
  if (f.cargo_hold_rubber_chicken_found) out.push("sp63_rubber_chicken_hidden_pulley_concealed");

  // L28 — fleet docking bay (mutex by act tier)
  if (deriveActTier(g) >= 6) {
    out.push("sp64_fleet_docking_bay_ships_moored");
  } else {
    out.push("sp65_fleet_docking_bay_all_dark");
  }

  return out;
}

function tier7Victory(g: CompositeGameSlice): boolean {
  const tier = deriveActTier(g);
  return tier >= 7 && !!(g.narrativeFlags.act7_rich_trader_ending || g.narrativeFlags.act7_spartan_ending);
}

function pickFilter(base: CargoHoldBaseId): string | undefined {
  if (base === "cargo_hold_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "cargo_hold_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "cargo_hold_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "cargo_hold_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "cargo_hold_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "cargo_hold_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  return undefined;
}

export function resolveCargoHoldComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
