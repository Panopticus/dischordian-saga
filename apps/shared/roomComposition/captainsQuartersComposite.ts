/* ═══════════════════════════════════════════════════════
   CAPTAIN'S QUARTERS — composite resolver (Phase J)

   15 base renders + 84 sprite overlays.

   Room-specific narrative beats covered by dedicated bases:
     - first_entry_master_key       (player's first arrival, master key cinematic)
     - antiquarian_archway_open     (bookshelf-portal traversal disclosed)
     - hb7_coin_lifted              (Degen alcove HB7 reveal)
     - act5_degen_alcove_active     (Degen corner activated mid-Act 5)
     - act7_legacy_wall_full        (all 10 legacy plates lit at finale)
     - epoch_grand_edit             (grand-edit corruption + clock blood-time)
     - tv_exposed / spreading /
       corrupted / quarantined      (TV-infection tiers)

   pickSprites emits the room's default stack (lighting, bed, viewport,
   chess opening position, mirror baseline, Kael portrait, mantle clock,
   morality mirror baseline, Mr. Whiskers, lockers, log terminal, doors,
   rug clean, decanter sealed) plus beat-specific overlays gated on
   narrative flags. High-confidence feature hotspots are scoped to these
   sprites via compositeScopes in ROOM_DEFINITIONS.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, moralityBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const CAPTAINS_QUARTERS_BASE_IDS = [
  "captains_quarters_base_act5_degen_alcove_active",
  "captains_quarters_base_act7_legacy_wall_full",
  "captains_quarters_base_antiquarian_archway_open",
  "captains_quarters_base_cycle_dawn",
  "captains_quarters_base_cycle_long_night",
  "captains_quarters_base_epoch_grand_edit",
  "captains_quarters_base_first_entry_master_key",
  "captains_quarters_base_hb7_coin_lifted",
  "captains_quarters_base_initial",
  "captains_quarters_base_morality_dark",
  "captains_quarters_base_season_interregnum",
  "captains_quarters_base_tv_corrupted",
  "captains_quarters_base_tv_exposed",
  "captains_quarters_base_tv_quarantined",
  "captains_quarters_base_tv_spreading",
] as const;

export const CAPTAINS_QUARTERS_SPRITE_IDS = [
  "sp01_perimeter_strip_lights_dim_violet",
  "sp02_antiquarian_library_warm_gold_spill_floor",
  "sp03_chandelier_unlit",
  "sp04_chandelier_half_lit_warm_crystal",
  "sp05_bedside_lamps_both_unlit",
  "sp06_bedside_lamps_both_lit_warm",
  "sp07_bedside_lamp_knocked_over",
  "sp08_desk_lamp_unlit",
  "sp09_desk_lamp_lit_warm_gold",
  "sp10_fireplace_unlit_cold",
  "sp11_fireplace_lit_warm_amber",
  "sp12_viewport_east_deep_space_cold",
  "sp13_viewport_east_dawn_amber",
  "sp14_bed_neatly_made_wear_trail",
  "sp15_bed_unmade_disturbed",
  "sp16_companion_cot_empty_oxblood",
  "sp17_bookshelf_volume_half_out_subtle",
  "sp18_bookshelf_volume_fully_pulled_visible",
  "sp19_bookshelf_archway_open_warm_gold",
  "sp20_bookshelf_portal_traversal_purple_warp",
  "sp21_mycelium_bookshelf_overgrowth_right",
  "sp22_chess_board_kael_opening",
  "sp23_chess_board_black_king_toppled",
  "sp24_chess_pieces_toppled_bleeding_black",
  "sp25_chess_board_pieces_rearranging_grand_edit",
  "sp26_cracked_mirror_baseline_spider_web",
  "sp27_cracked_mirror_kael_reflection_glimpsed",
  "sp28_cracked_mirror_source_static_overlay",
  "sp29_degen_corner_curtain_full_opacity",
  "sp30_degen_corner_curtain_ghosted_20pct",
  "sp31_degen_corner_alcove_fully_revealed",
  "sp32_degen_corner_coin_hovering_hb7",
  "sp33_cargo_door_closed",
  "sp34_cargo_door_open_corridor_beyond",
  "sp35_private_bath_door_closed",
  "sp36_private_bath_door_ajar_tile_glimpse",
  "sp37_escape_hatch_concealed_behind_bed",
  "sp38_escape_hatch_forced_open_tool_marks",
  "sp39_charcoal_couch_gathering_hub",
  "sp40_gathering_chairs_rotated_inward",
  "sp41_rug_wool_clean",
  "sp42_rug_wool_voidblack_stained",
  "sp43_poetry_book_closed_coffee_table",
  "sp44_kael_portrait_neutral",
  "sp45_kael_portrait_eyes_track_acts5",
  "sp46_kael_portrait_eyes_indigo_scrubbed",
  "sp47_kael_portrait_frame_black_bleeding_corners",
  "sp48_kael_portrait_thumbprint_burn_lore",
  "sp49_legacy_wall_1_plate_lit",
  "sp50_legacy_wall_3_plates_lit",
  "sp51_legacy_wall_5_plates_lit",
  "sp52_legacy_wall_7_plates_lit",
  "sp53_legacy_wall_10_plates_full",
  "sp54_legacy_wall_indigo_overlay_all_plates",
  "sp55_locker_kvoss_closed",
  "sp56_locker_kvoss_open_uniform_visible",
  "sp57_indigo_overstrike_nameplate_kvoss",
  "sp58_mantle_clock_ticking_frozen_3_47",
  "sp59_mantle_clock_stopped_act7",
  "sp60_mantle_clock_blood_time_grand_edit",
  "sp61_morality_mirror_cyan_pulse_baseline",
  "sp62_morality_mirror_indigo_bleed_tv_corrupted",
  "sp63_morality_mirror_lavender_dark",
  "sp64_morality_compass_cyan_pulse",
  "sp65_morality_compass_lavender_dark_alignment",
  "sp66_mr_whiskers_cat_photo_normal",
  "sp67_mr_whiskers_cat_photo_indigo_bars",
  "sp68_obsidian_ring_desk_cradle",
  "sp69_bound_chronicle_desk_brass_clasp",
  "sp70_whiskey_decanter_full_sealed",
  "sp71_whiskey_decanter_half_poured",
  "sp72_personal_log_terminal_desk_cursor_only",
  "sp73_personal_log_terminal_desk_indigo_scrub",
  "sp74_personal_log_terminal_accessible_screen",
  "sp75_personal_log_terminal_hidden_behind_bookshelf",
  "sp76_personal_log_terminal_lyras_warning_text",
  "sp77_tv_mycelium_thread_desk_early",
  "sp78_tv_mycelium_fan_legacy_wall",
  "sp79_tv_substrate_cloud_chest_height",
  "sp80_tv_voidblack_ichor_desk_base",
  "sp81_substrate_vapour_legacy_wall_wisps",
  "sp82_biohazard_tape_x_crosses_room",
  "sp83_biohazard_edge_tape_rug_perimeter",
  "sp84_biohazard_tape_cargo_door_band",
] as const;

type CaptainsQuartersBaseId = typeof CAPTAINS_QUARTERS_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): CaptainsQuartersBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "captains_quarters");

  // Highest-priority narrative beats.
  if (f.captains_quarters_first_entry && tier <= 1) return "captains_quarters_base_first_entry_master_key";
  if (f.captains_quarters_hb7_coin_lifted) return "captains_quarters_base_hb7_coin_lifted";
  if (f.captains_quarters_antiquarian_archway_open || f.antiquarian_archway_open) return "captains_quarters_base_antiquarian_archway_open";
  if (f.captains_quarters_act5_degen_alcove_active) return "captains_quarters_base_act5_degen_alcove_active";

  // Epoch / act tiers.
  if (f.grand_edit_active) return "captains_quarters_base_epoch_grand_edit";
  if (tier >= 7 && (f.captains_quarters_legacy_wall_full || f.act_7_complete)) {
    return "captains_quarters_base_act7_legacy_wall_full";
  }

  // TV-infection.
  if (tv === "quarantined") return "captains_quarters_base_tv_quarantined";
  if (tv === "corrupted") return "captains_quarters_base_tv_corrupted";
  if (tv === "spreading") return "captains_quarters_base_tv_spreading";
  if (tv === "exposed") return "captains_quarters_base_tv_exposed";

  // Atmospheric / cycle.
  if (f.season_phase_interregnum) return "captains_quarters_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "captains_quarters_base_morality_dark";
  if (cycle === "longNight") return "captains_quarters_base_cycle_long_night";
  if (cycle === "dawn") return "captains_quarters_base_cycle_dawn";

  return "captains_quarters_base_initial";
}

function pickSprites(g: CompositeGameSlice, base: CaptainsQuartersBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "captains_quarters");
  const tier = deriveActTier(g);
  const morality = moralityBand(g.moralityScore);

  // L1 — perimeter strip lights (always-on dim violet ambient)
  out.push("sp01_perimeter_strip_lights_dim_violet");

  // L2 — antiquarian-library spill (only when the archway is open)
  if (f.captains_quarters_antiquarian_archway_open || f.antiquarian_archway_open ||
      base === "captains_quarters_base_antiquarian_archway_open") {
    out.push("sp02_antiquarian_library_warm_gold_spill_floor");
  }

  // L3 — chandelier (mutex)
  if (f.captains_quarters_chandelier_lit) {
    out.push("sp04_chandelier_half_lit_warm_crystal");
  } else {
    out.push("sp03_chandelier_unlit");
  }

  // L4 — bedside lamps (mutex)
  if (f.captains_quarters_lamp_knocked_over) {
    out.push("sp07_bedside_lamp_knocked_over");
  } else if (f.captains_quarters_bedside_lamps_lit) {
    out.push("sp06_bedside_lamps_both_lit_warm");
  } else {
    out.push("sp05_bedside_lamps_both_unlit");
  }

  // L5 — desk lamp (mutex)
  if (f.captains_quarters_desk_lamp_lit) {
    out.push("sp09_desk_lamp_lit_warm_gold");
  } else {
    out.push("sp08_desk_lamp_unlit");
  }

  // L6 — fireplace (mutex)
  if (f.captains_quarters_fireplace_lit) {
    out.push("sp11_fireplace_lit_warm_amber");
  } else {
    out.push("sp10_fireplace_unlit_cold");
  }

  // L7 — viewport (mutex by cycle)
  if (cycle === "dawn") {
    out.push("sp13_viewport_east_dawn_amber");
  } else {
    out.push("sp12_viewport_east_deep_space_cold");
  }

  // L8 — bed (mutex; gates the bed hotspot)
  if (f.captains_quarters_bed_disturbed) {
    out.push("sp15_bed_unmade_disturbed");
  } else {
    out.push("sp14_bed_neatly_made_wear_trail");
  }
  if (f.captains_quarters_companion_cot_present) out.push("sp16_companion_cot_empty_oxblood");

  // L9 — bookshelf states (mutex; gates the bookshelf hotspot)
  if (f.captains_quarters_bookshelf_portal_traversal) {
    out.push("sp20_bookshelf_portal_traversal_purple_warp");
  } else if (f.captains_quarters_antiquarian_archway_open || f.antiquarian_archway_open ||
             base === "captains_quarters_base_antiquarian_archway_open") {
    out.push("sp19_bookshelf_archway_open_warm_gold");
  } else if (f.captains_quarters_bookshelf_volume_pulled) {
    out.push("sp18_bookshelf_volume_fully_pulled_visible");
  } else if (f.captains_quarters_bookshelf_volume_half) {
    out.push("sp17_bookshelf_volume_half_out_subtle");
  }
  if (tv === "corrupted") out.push("sp21_mycelium_bookshelf_overgrowth_right");

  // L10 — chess board (mutex; gates the chess-board hotspot)
  if (base === "captains_quarters_base_epoch_grand_edit") {
    out.push("sp25_chess_board_pieces_rearranging_grand_edit");
  } else if (f.captains_quarters_chess_kael_defeat || tier >= 7) {
    out.push("sp24_chess_pieces_toppled_bleeding_black");
  } else if (f.captains_quarters_chess_king_toppled) {
    out.push("sp23_chess_board_black_king_toppled");
  } else {
    out.push("sp22_chess_board_kael_opening");
  }

  // L11 — cracked mirror (mutex; gates the cracked-mirror hotspot)
  if (tv === "corrupted") {
    out.push("sp28_cracked_mirror_source_static_overlay");
  } else if (f.captains_quarters_mirror_kael_glimpsed) {
    out.push("sp27_cracked_mirror_kael_reflection_glimpsed");
  } else {
    out.push("sp26_cracked_mirror_baseline_spider_web");
  }

  // L12 — Degen corner (mutex; gates the degen-corner hotspot)
  if (f.captains_quarters_hb7_coin_lifted || base === "captains_quarters_base_hb7_coin_lifted") {
    out.push("sp32_degen_corner_coin_hovering_hb7");
  } else if (f.captains_quarters_act5_degen_alcove_active || base === "captains_quarters_base_act5_degen_alcove_active") {
    out.push("sp31_degen_corner_alcove_fully_revealed");
  } else if (f.captains_quarters_degen_curtain_ghosted) {
    out.push("sp30_degen_corner_curtain_ghosted_20pct");
  } else {
    out.push("sp29_degen_corner_curtain_full_opacity");
  }

  // L13 — cargo door (mutex)
  if (f.captains_quarters_cargo_door_open) {
    out.push("sp34_cargo_door_open_corridor_beyond");
  } else {
    out.push("sp33_cargo_door_closed");
  }

  // L14 — private bath door (mutex)
  if (f.captains_quarters_bath_door_ajar) {
    out.push("sp36_private_bath_door_ajar_tile_glimpse");
  } else {
    out.push("sp35_private_bath_door_closed");
  }

  // L15 — escape hatch (mutex)
  if (f.captains_quarters_escape_hatch_forced) {
    out.push("sp38_escape_hatch_forced_open_tool_marks");
  } else {
    out.push("sp37_escape_hatch_concealed_behind_bed");
  }

  // L16 — couch + chairs + rug (default-on, rug switches on stain flag)
  out.push("sp39_charcoal_couch_gathering_hub");
  if (f.captains_quarters_gathering_chairs_rotated) out.push("sp40_gathering_chairs_rotated_inward");
  out.push(f.captains_quarters_rug_stained ? "sp42_rug_wool_voidblack_stained" : "sp41_rug_wool_clean");
  if (f.captains_quarters_poetry_book_present) out.push("sp43_poetry_book_closed_coffee_table");

  // L17 — Kael portrait (mutex; gates the kael-portrait hotspot)
  if (f.captains_quarters_portrait_thumbprint_burn) {
    out.push("sp48_kael_portrait_thumbprint_burn_lore");
  } else if (tv === "corrupted" || f.captains_quarters_portrait_frame_bleeding) {
    out.push("sp47_kael_portrait_frame_black_bleeding_corners");
  } else if (f.captains_quarters_portrait_indigo_scrubbed) {
    out.push("sp46_kael_portrait_eyes_indigo_scrubbed");
  } else if (tier >= 5) {
    out.push("sp45_kael_portrait_eyes_track_acts5");
  } else {
    out.push("sp44_kael_portrait_neutral");
  }

  // L18 — legacy wall plates (mutex by progression; gates legacy-wall hotspot)
  const plates =
    base === "captains_quarters_base_act7_legacy_wall_full" || (f.captains_quarters_legacy_wall_full || tier >= 7) ? 10 :
    tier >= 6 ? 7 :
    tier >= 4 ? 5 :
    tier >= 2 ? 3 :
    tier >= 1 ? 1 : 0;
  if (plates === 10) out.push("sp53_legacy_wall_10_plates_full");
  else if (plates === 7) out.push("sp52_legacy_wall_7_plates_lit");
  else if (plates === 5) out.push("sp51_legacy_wall_5_plates_lit");
  else if (plates === 3) out.push("sp50_legacy_wall_3_plates_lit");
  else if (plates === 1) out.push("sp49_legacy_wall_1_plate_lit");
  if (tv === "corrupted" || base === "captains_quarters_base_epoch_grand_edit") {
    out.push("sp54_legacy_wall_indigo_overlay_all_plates");
  }

  // L19 — locker (mutex; gates the kvoss-locker hotspot)
  if (f.captains_quarters_locker_open) {
    out.push("sp56_locker_kvoss_open_uniform_visible");
  } else {
    out.push("sp55_locker_kvoss_closed");
  }
  if (f.captains_quarters_nameplate_indigo_overstrike) out.push("sp57_indigo_overstrike_nameplate_kvoss");

  // L20 — mantle clock (mutex; gates the mantle-clock hotspot)
  if (base === "captains_quarters_base_epoch_grand_edit") {
    out.push("sp60_mantle_clock_blood_time_grand_edit");
  } else if (tier >= 7) {
    out.push("sp59_mantle_clock_stopped_act7");
  } else {
    out.push("sp58_mantle_clock_ticking_frozen_3_47");
  }

  // L21 — morality mirror (mutex; gates the morality-mirror hotspot)
  if (tv === "corrupted") {
    out.push("sp62_morality_mirror_indigo_bleed_tv_corrupted");
  } else if (morality === "dark") {
    out.push("sp63_morality_mirror_lavender_dark");
  } else {
    out.push("sp61_morality_mirror_cyan_pulse_baseline");
  }

  // L22 — morality compass (mutex by alignment)
  if (morality === "dark") {
    out.push("sp65_morality_compass_lavender_dark_alignment");
  } else {
    out.push("sp64_morality_compass_cyan_pulse");
  }

  // L23 — Mr. Whiskers (mutex; gates the mr-whiskers hotspot)
  if (tv === "corrupted" || f.captains_quarters_whiskers_indigo) {
    out.push("sp67_mr_whiskers_cat_photo_indigo_bars");
  } else {
    out.push("sp66_mr_whiskers_cat_photo_normal");
  }

  // L24 — desk items (obsidian ring + bound chronicle + whiskey)
  if (f.captains_quarters_obsidian_ring_present) out.push("sp68_obsidian_ring_desk_cradle");
  if (f.captains_quarters_chronicle_present) out.push("sp69_bound_chronicle_desk_brass_clasp");
  out.push(f.captains_quarters_whiskey_poured ? "sp71_whiskey_decanter_half_poured" : "sp70_whiskey_decanter_full_sealed");

  // L25 — personal log terminal (mutex; gates the log-terminal hotspot)
  if (f.captains_quarters_log_lyras_warning) {
    out.push("sp76_personal_log_terminal_lyras_warning_text");
  } else if (f.captains_quarters_log_hidden_behind_bookshelf) {
    out.push("sp75_personal_log_terminal_hidden_behind_bookshelf");
  } else if (f.captains_quarters_log_accessible) {
    out.push("sp74_personal_log_terminal_accessible_screen");
  } else if (tv === "corrupted") {
    out.push("sp73_personal_log_terminal_desk_indigo_scrub");
  } else {
    out.push("sp72_personal_log_terminal_desk_cursor_only");
  }

  // L26 — TV corruption layers (additive)
  if (tv === "corrupted") {
    out.push("sp78_tv_mycelium_fan_legacy_wall",
             "sp79_tv_substrate_cloud_chest_height",
             "sp80_tv_voidblack_ichor_desk_base");
  } else if (tv === "spreading") {
    out.push("sp77_tv_mycelium_thread_desk_early");
  }

  // L27 — substrate vapour (post-grand-edit)
  if (base === "captains_quarters_base_epoch_grand_edit" || f.substrate_vapour_active) {
    out.push("sp81_substrate_vapour_legacy_wall_wisps");
  }

  // L28 — biohazard tape (quarantine state)
  if (tv === "quarantined") {
    out.push("sp82_biohazard_tape_x_crosses_room",
             "sp83_biohazard_edge_tape_rug_perimeter",
             "sp84_biohazard_tape_cargo_door_band");
  }

  return out;
}

function pickFilter(base: CaptainsQuartersBaseId): string | undefined {
  if (base === "captains_quarters_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "captains_quarters_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "captains_quarters_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "captains_quarters_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "captains_quarters_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "captains_quarters_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "captains_quarters_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  return undefined;
}

export function resolveCaptainsQuartersComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
