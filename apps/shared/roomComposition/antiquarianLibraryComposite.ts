/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN LIBRARY — composite resolver (Phase J)

   15 base renders + 90 sprite overlays.

   Note on S3 dir: the producer uses the PLURAL form
   `antiquarians_library_*` for the base filenames (e.g.
   `antiquarians_library_base_initial.png`). The S3 zipDir
   matches — `art/rooms/antiquarians_library/{base,sprites}`.
   The public room id stays the canonical singular hyphenated
   `antiquarian-library` (see COMPOSITE_ROOM_S3_DIR in
   types.ts).

   pickSprites emits ~14 sprites in the default render (skylight,
   chandelier, lamp, vault door + sigil, locker, chair, bust, card
   catalogue, Hierophant stack, Velkraal folio) and adds beat-
   specific overlays (recursion gallery, shadow tongue, ambient
   season/epoch finishers) under specific narrative flags. The
   high-confidence feature hotspots are gated to these sprites via
   compositeScopes — see ROOM_DEFINITIONS in GameContext.tsx.

   The base picker covers the common axes (cycle, TV-infection,
   morality, season, epoch, act tier) plus room-specific narrative
   bases:

     - first_entry_act3            (first arrival)
     - act6_locker_reveal          (locker contents disclosed)
     - act7_dimmed_absent          (Antiquarian gone)
     - recursive_gallery_loop      (gallery 5 recursion event)
     - daniel_cross_disclosed      (Programmer name canonized)
     - locked_vault_open           (vault opened)
     - epoch_shadowtongue_inverted (Shadow Tongue active)
     - governance_lore_unlock      (CoNexus governance unlock)
     - epoch_grand_edit / post     (grand-edit beats)
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, moralityBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const ANTIQUARIAN_LIBRARY_BASE_IDS = [
  "antiquarians_library_base_act6_locker_reveal",
  "antiquarians_library_base_act7_dimmed_absent",
  "antiquarians_library_base_cycle_dawn",
  "antiquarians_library_base_cycle_long_night",
  "antiquarians_library_base_daniel_cross_disclosed",
  "antiquarians_library_base_epoch_grand_edit",
  "antiquarians_library_base_epoch_post_grand_edit",
  "antiquarians_library_base_epoch_shadowtongue_inverted",
  "antiquarians_library_base_first_entry_act3",
  "antiquarians_library_base_governance_lore_unlock",
  "antiquarians_library_base_initial",
  "antiquarians_library_base_locked_vault_open",
  "antiquarians_library_base_morality_dark",
  "antiquarians_library_base_recursive_gallery_loop",
  "antiquarians_library_base_season_interregnum",
] as const;

export const ANTIQUARIAN_LIBRARY_SPRITE_IDS = [
  "sp01_skylight_beam_warm_gold_dust_motes",
  "sp02_skylight_beam_dawn_golden_pink",
  "sp03_skylight_beam_dim_grey_suppressed",
  "sp04_skylight_beam_cool_violet",
  "sp05_corner_skylight_beam_amber_45deg",
  "sp06_dust_motes_floating_warm_amber",
  "sp07_chandelier_lit_full_warm_amber",
  "sp08_chandelier_intensified_max_amber",
  "sp09_chandelier_flickering_one_arm_dark",
  "sp10_chandelier_extinguished_cold_brass",
  "sp11_reading_table_lamp_lit_warm_cream",
  "sp12_reading_table_lamp_doubled_flame_cyan_cream",
  "sp13_reading_table_lamp_ember_barely_glowing",
  "sp14_reading_table_lamp_extinguished",
  "sp15_reading_table_open_book_finger_rule",
  "sp16_brass_finger_rule_on_open_book",
  "sp17_open_book_marginalia_close_up",
  "sp18_brass_inkwell_quill",
  "sp19_oxblood_visitor_chair_empty",
  "sp20_antiquarian_chair_empty_candles_lit",
  "sp21_antiquarian_chair_empty_candles_unlit",
  "sp22_antiquarian_candle_array_both_lit",
  "sp23_antiquarian_candle_array_both_unlit",
  "sp24_antiquarian_locker_closed",
  "sp25_antiquarian_locker_open_personal_effects",
  "sp26_antiquarian_locker_journal_open",
  "sp27_antiquarians_journal_brass_clasp_closed",
  "sp28_locker_warm_gold_glow_rim",
  "sp29_locked_vault_door_closed_cyan_sigil",
  "sp30_locked_vault_door_ajar_gold_light_spill",
  "sp31_vault_door_fully_open_interior_glow",
  "sp32_warm_gold_light_spill_vault_floor",
  "sp33_vault_sigil_silent_no_glow",
  "sp34_vault_sigil_cyan_low_pulse",
  "sp35_vault_sigil_bright_cyan_alarm",
  "sp36_vault_sigil_indigo_pulse",
  "sp37_vault_sigil_warm_gold_victory",
  "sp38_snowglobe_stopped_dark",
  "sp39_snowglobe_pulsing_neutral",
  "sp40_snowglobe_warm_gold_victory_pulse",
  "sp41_card_catalogue_all_drawers_closed",
  "sp42_card_catalogue_drawer_open_index_cards",
  "sp43_card_catalogue_multiple_drawers_open",
  "sp44_chess_table_mid_game",
  "sp45_chess_pieces_rearranging_supernatural",
  "sp46_chess_pieces_collecting_into_brass_tray",
  "sp47_chess_brass_collection_tray",
  "sp48_north_wall_chess_relief_scholars",
  "sp49_brass_celestial_globe",
  "sp50_brass_terrestrial_globe",
  "sp51_brass_globe_terrestrial_glowing",
  "sp52_bust_first_antiquarian_warm_bronze",
  "sp53_bust_first_programmer_cracked_smoked_glass",
  "sp54_bust_cracked_glass_face_glimpse",
  "sp55_hierophant_marginalia_stack_top_closed",
  "sp56_hierophant_marginalia_stack_top_open",
  "sp57_velkraal_dossier_edges_visible",
  "sp58_velkraal_folio_open_on_lectern",
  "sp59_recipe_archive_cabinet_closed",
  "sp60_recipe_archive_drawer_open",
  "sp61_gallery_1_shelf_full_warm",
  "sp62_gallery_2_shelf_full_warm",
  "sp63_gallery_3_shelf_full_warm",
  "sp64_gallery_4_shelf_full_warm",
  "sp65_gallery_5_recursion_shelf_distorted",
  "sp66_gallery_strip_lights_warm_amber",
  "sp67_gallery_strip_lights_dim_cool",
  "sp68_book_spines_brass_edges_all_glowing",
  "sp69_phosphorescent_books_cyan_violet_glow",
  "sp70_phosphorescent_books_intensified_bright",
  "sp71_bronze_shelf_nameplates_glowing_gold",
  "sp72_brass_scroll_tubes_shelf_row",
  "sp73_books_falling_upward_non_euclidean",
  "sp74_recursion_boundary_books_floating",
  "sp75_recursion_shimmer_distortion_overlay",
  "sp76_herringbone_floor_brass_outer_band",
  "sp77_brass_compass_rose_floor_inlay",
  "sp78_floor_indigo_seam_corruption",
  "sp79_indigo_tendrils_floor_creeping",
  "sp80_shadow_tongue_void_overlay",
  "sp81_framed_portrait_deceased_woman_oxblood",
  "sp82_polished_brass_coin_single",
  "sp83_unfinished_letter_folded_cream_paper",
  "sp84_brass_tea_tray_with_dust",
  "sp85_tea_service_full_steaming",
  "sp86_south_archway_bronze_frame",
  "sp87_south_archway_cyan_transit_light_spill",
  "sp88_spiral_staircase_bronze_ascending",
  "sp89_warm_gold_ambient_full_room_overlay",
  "sp90_interregnum_cool_grey_ambient_overlay",
] as const;

type AntiquarianLibraryBaseId = typeof ANTIQUARIAN_LIBRARY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): AntiquarianLibraryBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "antiquarians_library");

  // Highest-priority narrative beats (room-specific).
  if (f.antiquarian_library_recursive_gallery_loop) return "antiquarians_library_base_recursive_gallery_loop";
  if (f.antiquarian_library_locked_vault_open) return "antiquarians_library_base_locked_vault_open";
  if (f.daniel_cross_disclosed) return "antiquarians_library_base_daniel_cross_disclosed";
  if (f.antiquarian_library_locker_revealed) return "antiquarians_library_base_act6_locker_reveal";

  // Epoch beats.
  if (f.epoch_post_grand_edit) return "antiquarians_library_base_epoch_post_grand_edit";
  if (f.grand_edit_active) return "antiquarians_library_base_epoch_grand_edit";
  if (f.shadow_tongue_active || f.epoch_shadowtongue_inverted) return "antiquarians_library_base_epoch_shadowtongue_inverted";
  if (f.governance_lore_unlocked) return "antiquarians_library_base_governance_lore_unlock";

  // Act tiers.
  if (tier >= 7 && !f.antiquarian_present) return "antiquarians_library_base_act7_dimmed_absent";
  if (tier <= 3 && !f.antiquarian_library_visited) return "antiquarians_library_base_first_entry_act3";

  // TV-infection rides as a season/atmosphere modifier — fall through to
  // base when nothing else fires (room has no dedicated TV bases).

  // Atmospheric / cycle.
  if (f.season_phase_interregnum) return "antiquarians_library_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "antiquarians_library_base_morality_dark";
  if (cycle === "longNight") return "antiquarians_library_base_cycle_long_night";
  if (cycle === "dawn") return "antiquarians_library_base_cycle_dawn";

  // No-op consume to keep tv referenced when no TV variants exist for
  // this room — easier than adding axis-9 bases just to silence lint.
  void tv;

  return "antiquarians_library_base_initial";
}

function pickSprites(g: CompositeGameSlice, base: AntiquarianLibraryBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const cycle = deriveCyclePhase(g);

  // L1 — skylight beam (mutex by cycle / shadow tongue)
  if (f.shadow_tongue_active || base === "antiquarians_library_base_epoch_shadowtongue_inverted") {
    out.push("sp04_skylight_beam_cool_violet");
  } else if (cycle === "dawn") {
    out.push("sp02_skylight_beam_dawn_golden_pink");
  } else if (cycle === "longNight") {
    out.push("sp03_skylight_beam_dim_grey_suppressed");
  } else {
    out.push("sp01_skylight_beam_warm_gold_dust_motes");
  }

  // L2 — chandelier state (mutex)
  if (base === "antiquarians_library_base_act7_dimmed_absent") {
    out.push("sp10_chandelier_extinguished_cold_brass");
  } else if (base === "antiquarians_library_base_epoch_grand_edit") {
    out.push("sp08_chandelier_intensified_max_amber");
  } else if (f.shadow_tongue_active) {
    out.push("sp09_chandelier_flickering_one_arm_dark");
  } else {
    out.push("sp07_chandelier_lit_full_warm_amber");
  }

  // L3 — reading-table lamp / Orb of Worlds (mutex)
  if (f.daniel_cross_disclosed || base === "antiquarians_library_base_daniel_cross_disclosed") {
    out.push("sp12_reading_table_lamp_doubled_flame_cyan_cream");
  } else if (cycle === "longNight" || base === "antiquarians_library_base_act7_dimmed_absent") {
    out.push("sp13_reading_table_lamp_ember_barely_glowing");
  } else {
    out.push("sp11_reading_table_lamp_lit_warm_cream");
  }

  // L4 — vault door (mutex; gates the locked-vault hotspot)
  if (f.antiquarian_library_vault_opened || base === "antiquarians_library_base_locked_vault_open") {
    out.push("sp31_vault_door_fully_open_interior_glow", "sp32_warm_gold_light_spill_vault_floor");
  } else if (f.antiquarian_library_vault_ajar) {
    out.push("sp30_locked_vault_door_ajar_gold_light_spill");
  } else {
    out.push("sp29_locked_vault_door_closed_cyan_sigil");
  }

  // L5 — vault sigil (mutex; pairs with door)
  if (f.antiquarian_library_vault_opened || base === "antiquarians_library_base_locked_vault_open") {
    out.push("sp37_vault_sigil_warm_gold_victory");
  } else if (f.antiquarian_library_vault_ajar) {
    out.push("sp35_vault_sigil_bright_cyan_alarm");
  } else if (f.shadow_tongue_active) {
    out.push("sp36_vault_sigil_indigo_pulse");
  } else if (f.antiquarian_library_vault_pulse) {
    out.push("sp34_vault_sigil_cyan_low_pulse");
  } else {
    out.push("sp33_vault_sigil_silent_no_glow");
  }

  // L6 — locker state (mutex; gates the antiquarian-desk hotspot)
  if (f.antiquarian_library_locker_journal_open) {
    out.push("sp26_antiquarian_locker_journal_open", "sp28_locker_warm_gold_glow_rim");
  } else if (f.antiquarian_library_locker_revealed || base === "antiquarians_library_base_act6_locker_reveal") {
    out.push("sp25_antiquarian_locker_open_personal_effects", "sp28_locker_warm_gold_glow_rim");
  } else {
    out.push("sp24_antiquarian_locker_closed");
  }

  // L7 — antiquarian chair (mutex)
  if (base === "antiquarians_library_base_act7_dimmed_absent" || f.antiquarian_absent) {
    out.push("sp21_antiquarian_chair_empty_candles_unlit");
  } else {
    out.push("sp20_antiquarian_chair_empty_candles_lit");
  }

  // L8 — bust (mutex; gates the programmer-infiltration-dossier reveal)
  if (f.daniel_cross_disclosed || base === "antiquarians_library_base_daniel_cross_disclosed") {
    out.push("sp53_bust_first_programmer_cracked_smoked_glass");
  } else if (f.antiquarian_bust_glimpsed) {
    out.push("sp54_bust_cracked_glass_face_glimpse");
  } else {
    out.push("sp52_bust_first_antiquarian_warm_bronze");
  }

  // L9 — card catalogue (mutex)
  if (f.antiquarian_library_card_catalogue_searched) {
    out.push("sp43_card_catalogue_multiple_drawers_open");
  } else if (f.antiquarian_library_card_drawer_open) {
    out.push("sp42_card_catalogue_drawer_open_index_cards");
  } else {
    out.push("sp41_card_catalogue_all_drawers_closed");
  }

  // L10 — Hierophant marginalia stack (mutex)
  if (f.hierophant_marginalia_consulted) {
    out.push("sp56_hierophant_marginalia_stack_top_open");
  } else {
    out.push("sp55_hierophant_marginalia_stack_top_closed");
  }

  // L11 — Velkraal folio (mutex)
  if (f.velkraal_folio_opened) {
    out.push("sp58_velkraal_folio_open_on_lectern");
  } else {
    out.push("sp57_velkraal_dossier_edges_visible");
  }

  // L12 — recursion gallery (only on the recursive base or explicit flag)
  if (base === "antiquarians_library_base_recursive_gallery_loop" || f.gallery_recursion_active) {
    out.push(
      "sp65_gallery_5_recursion_shelf_distorted",
      "sp73_books_falling_upward_non_euclidean",
      "sp74_recursion_boundary_books_floating",
      "sp75_recursion_shimmer_distortion_overlay",
    );
  }

  // L13 — shadow tongue overlays
  if (f.shadow_tongue_active || base === "antiquarians_library_base_epoch_shadowtongue_inverted") {
    out.push(
      "sp80_shadow_tongue_void_overlay",
      "sp78_floor_indigo_seam_corruption",
      "sp79_indigo_tendrils_floor_creeping",
    );
  }

  // L14 — ambient overlays (mutex)
  if (base === "antiquarians_library_base_season_interregnum") {
    out.push("sp90_interregnum_cool_grey_ambient_overlay");
  } else if (base === "antiquarians_library_base_epoch_post_grand_edit") {
    out.push("sp89_warm_gold_ambient_full_room_overlay");
  }

  return out;
}

function pickFilter(base: AntiquarianLibraryBaseId): string | undefined {
  if (base === "antiquarians_library_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "antiquarians_library_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "antiquarians_library_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "antiquarians_library_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "antiquarians_library_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  return undefined;
}

export function resolveAntiquarianLibraryComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
