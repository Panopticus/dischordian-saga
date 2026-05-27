/* ═══════════════════════════════════════════════════════
   ARCHIVES — composite resolver (Phase J)

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

export const ARCHIVES_BASE_IDS = [
  "archives_base_act7_finale_filed",
  "archives_base_archway_open_to_library",
  "archives_base_cycle_dawn",
  "archives_base_cycle_long_night",
  "archives_base_dawn_after_first_uncorruption",
  "archives_base_epoch_grand_edit",
  "archives_base_initial",
  "archives_base_morality_dark",
  "archives_base_season_interregnum",
  "archives_base_shadow_tongue_witnessed",
  "archives_base_tv_corrupted",
  "archives_base_tv_exposed",
  "archives_base_tv_quarantined",
  "archives_base_tv_spreading",
] as const;

export const ARCHIVES_SPRITE_IDS = [
  "sp01_skylight_dust_mote_storm",
  "sp02_skylight_dim_clouded",
  "sp03_skylight_shadow_tongue_indigo_taint",
  "sp04_timeline_act5_fresh_ink",
  "sp05_timeline_indigo_edit",
  "sp06_timeline_complete_act7_sealed",
  "sp07_timeline_marginalia_stubs",
  "sp08_loredex_one_ring_act2",
  "sp09_loredex_two_rings_act3",
  "sp10_loredex_inner_glyphs_active",
  "sp11_loredex_sealed_book_inside",
  "sp12_reading_table_book_open",
  "sp13_reading_table_candle_warm",
  "sp14_reading_table_candle_steel_blue",
  "sp15_reading_table_crystal_pulsing",
  "sp16_pendant_lamp_lit",
  "sp17_card_vault_slot_warm_gold_blink",
  "sp18_card_vault_slot_pulsing",
  "sp19_card_vault_red_lattice_audit",
  "sp20_card_vault_glass_missing",
  "sp21_card_vault_wraith_smear",
  "sp22_shelf_ladder_chest_height",
  "sp23_shelf_tome_spine_out",
  "sp24_shelf_corner_mark_glowing",
  "sp25_shelf_gold_thread_to_table",
  "sp26_archway_seam_visible",
  "sp27_archway_open_warm_gold",
  "sp28_archway_portal_warp",
  "sp29_chair_antiquarian_coat",
  "sp30_chair_pulled_out",
  "sp31_chair_pazaak_card",
  "sp32_floor_compass_rose_glow",
  "sp33_floor_yellow_tape",
  "sp34_floor_cyan_tape_evidence_cart",
  "sp35_floor_closure_codex",
  "sp36_floor_quarantine_band",
  "sp37_door_bridge_open",
  "sp38_door_audit_tape",
  "sp39_clue_glow_charter_silt",
  "sp40_clue_glow_preservation",
  "sp41_clue_glow_severance",
  "sp42_clue_glow_storm_calm",
  "sp43_clue_glow_chained_failure",
  "sp44_clue_glow_resurrectionist",
  "sp45_clue_glow_tarn_binder",
  "sp46_clue_glow_akai_necromancer",
  "sp47_st_indigo_overlay_lectern",
  "sp48_st_floating_text_fragments",
  "sp49_st_records_rewriting",
  "sp50_st_indigo_marginalia_spines",
  "sp51_st_reflection_mismatch",
  "sp52_mantle_clock_ticking",
  "sp53_mantle_clock_stopped",
  "sp54_mantle_clock_blood_time",
  "sp55_painting_scholars_vigil",
  "sp56_painting_discovery_evolved",
  "sp57_relief_scholar_motto",
  "sp58_tea_cart_steaming",
  "sp59_coat_stand",
  "sp60_clipboard_indexed",
  "sp61_atmospheric_dust_motes_beam",
  "sp62_atmospheric_candle_smoke",
  "sp63_atmospheric_eidolon_shimmer",
  "sp64_faction_dreamer_iris",
  "sp65_faction_hierarchy_seal",
  "sp66_faction_antiquarian_codex",
  "sp67_faction_insurgency_sigil",
  "sp68_unnameable_hue_cabinet_closed",
  "sp69_unnameable_hue_cabinet_open",
  "sp70_dossier_cabinet_pulled",
  "sp71_dossier_drawer_partially_open",
  "sp72_dreamer_dossier_alcove_seam",
  "sp73_antiquarian_absent",
  "sp74_antiquarian_neutral_present",
  "sp75_antiquarian_fresh_page",
  "sp76_antiquarian_at_ladder",
  "sp77_antiquarian_shelf_mate",
  "sp78_shadow_tongue_halo_subtle",
  "sp79_shadow_tongue_halo_active",
  "sp80_shadow_tongue_reflection",
  "sp81_human_signal_thread_bloom",
  "sp82_eidolon_anchor_resonance",
  "sp83_eidolon_first_manifestation",
  "sp84_lore_egg_panopticon_face",
  "sp85_lore_egg_warlord_node",
  "sp86_lore_egg_engineer_holo",
  "sp87_irl_spring_petals",
  "sp88_irl_summer_brass_sun",
  "sp89_irl_autumn_oak_leaf",
  "sp90_bond_pulse_afterimage",
] as const;

type ArchivesBaseId = typeof ARCHIVES_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): ArchivesBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "archives");

if (f.archives_archway_open) return "archives_base_archway_open_to_library";
  if (f.archives_first_uncorruption) return "archives_base_dawn_after_first_uncorruption";
  if (f.shadow_tongue_evidence) return "archives_base_shadow_tongue_witnessed";
  if (f.grand_edit_active) return "archives_base_epoch_grand_edit";
  if (tv === "quarantined") return "archives_base_tv_quarantined";
  if (tv === "corrupted") return "archives_base_tv_corrupted";
  if (tv === "spreading") return "archives_base_tv_spreading";
  if (tv === "exposed") return "archives_base_tv_exposed";
  if (tier >= 7) return "archives_base_act7_finale_filed";
  if (f.season_phase_interregnum) return "archives_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "archives_base_morality_dark";
  if (cycle === "longNight") return "archives_base_cycle_long_night";
  if (cycle === "dawn") return "archives_base_cycle_dawn";
  return "archives_base_initial";
}

function pickSprites(g: CompositeGameSlice, _base: ArchivesBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;

  // Antiquarian presence (mutex). Each position has a matching hotspot
  // in ROOM_DEFINITIONS["archives"] gated via compositeScopes — so the
  // sprite the resolver picks determines which NPC click target is
  // reachable. Default = sp74 (neutral_present) so npc-antiquarian
  // catches the no-flag case; sp75/76/77 fire on specific position
  // flags.
  if (f.archives_antiquarian_absent) {
    out.push("sp73_antiquarian_absent");
  } else if (f.archives_antiquarian_at_reading) {
    out.push("sp75_antiquarian_fresh_page");
  } else if (f.archives_antiquarian_at_ladder) {
    out.push("sp76_antiquarian_at_ladder");
  } else if (f.archives_antiquarian_at_shelf) {
    out.push("sp77_antiquarian_shelf_mate");
  } else {
    out.push("sp74_antiquarian_neutral_present");
  }

  return out;
}

function pickFilter(base: ArchivesBaseId): string | undefined {
  if (base === "archives_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "archives_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "archives_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "archives_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "archives_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "archives_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "archives_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  return undefined;
}

export function resolveArchivesComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
