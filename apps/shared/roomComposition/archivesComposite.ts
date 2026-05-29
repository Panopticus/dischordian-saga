/* ═══════════════════════════════════════════════════════
   ARCHIVES — composite resolver (Phase J)

   14 base renders + 90 sprite overlays.

   pickSprites emits a 24-layer default stack: skylight + timeline +
   loredex + reading table + card vault + shelf + archway + chair +
   floor + door + clue glows (8 architect-channel) + shadow-tongue
   overlays + mantle clock + painting + relief + tea cart + coat
   stand + clipboard + atmospherics + faction overlays + unnameable
   hue cabinet + dossier cabinet + antiquarian NPC + shadow-tongue
   character overlays + human-thread bloom + eidolon + lore eggs +
   IRL season + bond pulse afterimage.

   17 hotspots in ROOM_DEFINITIONS["archives"] have compositeScopes
   that match this sprite catalog (clue glows sp39-46, antiquarian
   NPC sp74-77, unnameable hue cabinet sp68/69, shadow tongue
   sp78-80, etc.).
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveIrlSeason, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
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

function pickSprites(g: CompositeGameSlice, base: ArchivesBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "archives");
  const trust = trustBand(g.elaraTrust);
  const season = deriveIrlSeason(g);

  // L1 — skylight (mutex)
  if (f.shadow_tongue_active || base === "archives_base_shadow_tongue_witnessed") {
    out.push("sp03_skylight_shadow_tongue_indigo_taint");
  } else if (cycle === "longNight" || tv === "corrupted") {
    out.push("sp02_skylight_dim_clouded");
  } else {
    out.push("sp01_skylight_dust_mote_storm");
  }

  // L2 — timeline (mutex by act tier + corruption state)
  if (tier >= 7) {
    out.push("sp06_timeline_complete_act7_sealed");
  } else if (tv === "corrupted" || f.shadow_tongue_active) {
    out.push("sp05_timeline_indigo_edit");
  } else if (tier >= 5) {
    out.push("sp04_timeline_act5_fresh_ink");
  }
  if (f.archives_timeline_marginalia) out.push("sp07_timeline_marginalia_stubs");

  // L3 — loredex (mutex by act tier; sealed when fully consolidated)
  if (f.loredex_consolidated || tier >= 7) {
    out.push("sp11_loredex_sealed_book_inside");
  } else if (f.loredex_inner_glyphs_active || tier >= 5) {
    out.push("sp10_loredex_inner_glyphs_active");
  } else if (tier >= 3) {
    out.push("sp09_loredex_two_rings_act3");
  } else if (tier >= 2) {
    out.push("sp08_loredex_one_ring_act2");
  }

  // L4 — reading table (additive: book + candle + crystal)
  if (f.archives_book_open) out.push("sp12_reading_table_book_open");
  if (tv === "corrupted" || f.shadow_tongue_active) {
    out.push("sp14_reading_table_candle_steel_blue");
  } else {
    out.push("sp13_reading_table_candle_warm");
  }
  if (f.archives_crystal_pulsing) out.push("sp15_reading_table_crystal_pulsing");

  // L5 — pendant lamp (always-on)
  out.push("sp16_pendant_lamp_lit");

  // L6 — card vault (mutex)
  if (f.archives_card_vault_wraith_smear) {
    out.push("sp21_card_vault_wraith_smear");
  } else if (f.archives_card_vault_glass_missing) {
    out.push("sp20_card_vault_glass_missing");
  } else if (tv === "corrupted" || tv === "quarantined") {
    out.push("sp19_card_vault_red_lattice_audit");
  } else if (f.archives_card_vault_pulsing) {
    out.push("sp18_card_vault_slot_pulsing");
  } else {
    out.push("sp17_card_vault_slot_warm_gold_blink");
  }

  // L7 — shelf (ladder + tome-out + corner mark + gold thread)
  if (f.archives_shelf_ladder_active) out.push("sp22_shelf_ladder_chest_height");
  if (f.archives_tome_pulled) out.push("sp23_shelf_tome_spine_out");
  if (f.archives_corner_mark_visible) out.push("sp24_shelf_corner_mark_glowing");
  if (f.archives_gold_thread_active) out.push("sp25_shelf_gold_thread_to_table");

  // L8 — archway (mutex: seam / open / portal)
  if (f.archives_archway_portal_active) {
    out.push("sp28_archway_portal_warp");
  } else if (f.archives_archway_open || base === "archives_base_archway_open_to_library") {
    out.push("sp27_archway_open_warm_gold");
  } else {
    out.push("sp26_archway_seam_visible");
  }

  // L9 — chair (additive: coat / pulled-out / pazaak card)
  if (f.archives_antiquarian_coat_visible || f.archives_antiquarian_at_ladder || f.archives_antiquarian_at_shelf) {
    out.push("sp29_chair_antiquarian_coat");
  }
  if (f.archives_chair_pulled_out) out.push("sp30_chair_pulled_out");
  if (f.archives_pazaak_card) out.push("sp31_chair_pazaak_card");

  // L10 — floor (compass always-on; investigation tape additive)
  out.push("sp32_floor_compass_rose_glow");
  if (f.archives_investigation_active) {
    out.push("sp33_floor_yellow_tape");
    if (f.archives_evidence_cart) out.push("sp34_floor_cyan_tape_evidence_cart");
    if (f.archives_closure_codex) out.push("sp35_floor_closure_codex");
  }
  if (tv === "quarantined") out.push("sp36_floor_quarantine_band");

  // L11 — door (mutex: open / audit-tape)
  if (tv === "quarantined" || f.archives_door_audit_tape) {
    out.push("sp38_door_audit_tape");
  } else {
    out.push("sp37_door_bridge_open");
  }

  // L12 — clue glows (8 architect-channel mystery rects — match existing hotspots)
  if (f.archives_clue_charter_silt_visible) out.push("sp39_clue_glow_charter_silt");
  if (f.archives_clue_preservation_visible) out.push("sp40_clue_glow_preservation");
  if (f.archives_clue_severance_visible) out.push("sp41_clue_glow_severance");
  if (f.archives_clue_storm_calm_visible) out.push("sp42_clue_glow_storm_calm");
  if (f.archives_clue_chained_failure_visible) out.push("sp43_clue_glow_chained_failure");
  if (f.archives_clue_resurrectionist_visible) out.push("sp44_clue_glow_resurrectionist");
  if (f.archives_clue_tarn_binder_visible) out.push("sp45_clue_glow_tarn_binder");
  if (f.archives_clue_akai_necromancer_visible) out.push("sp46_clue_glow_akai_necromancer");

  // L13 — shadow tongue overlays (4 layers — additive when active)
  if (f.shadow_tongue_active || base === "archives_base_shadow_tongue_witnessed") {
    out.push("sp47_st_indigo_overlay_lectern");
    out.push("sp48_st_floating_text_fragments");
    out.push("sp49_st_records_rewriting");
    out.push("sp50_st_indigo_marginalia_spines");
    out.push("sp51_st_reflection_mismatch");
  }

  // L14 — mantle clock (mutex)
  if (base === "archives_base_epoch_grand_edit" || f.grand_edit_active) {
    out.push("sp54_mantle_clock_blood_time");
  } else if (tier >= 7) {
    out.push("sp53_mantle_clock_stopped");
  } else {
    out.push("sp52_mantle_clock_ticking");
  }

  // L15 — painting (mutex by progression)
  if (tier >= 5 || f.archives_painting_evolved) {
    out.push("sp56_painting_discovery_evolved");
  } else {
    out.push("sp55_painting_scholars_vigil");
  }
  // Relief carving (always-on)
  out.push("sp57_relief_scholar_motto");

  // L16 — tea cart + coat stand + clipboard (additive room-dressings)
  if (cycle === "balanced" || cycle === "dawn") out.push("sp58_tea_cart_steaming");
  out.push("sp59_coat_stand");
  if (f.archives_clipboard_indexed) out.push("sp60_clipboard_indexed");

  // L17 — atmosphere (additive blend)
  if (cycle === "balanced" || cycle === "dawn") out.push("sp61_atmospheric_dust_motes_beam");
  out.push("sp62_atmospheric_candle_smoke");
  if (f.eidolon_visible || f.eidolon_first_manifestation) out.push("sp63_atmospheric_eidolon_shimmer");

  // L18 — faction overlays (additive when championed)
  if (factionHigh(g, "dreamers")) out.push("sp64_faction_dreamer_iris");
  if (factionHigh(g, "hierarchy")) out.push("sp65_faction_hierarchy_seal");
  if (factionHigh(g, "antiquarian")) out.push("sp66_faction_antiquarian_codex");
  if (factionHigh(g, "insurgency")) out.push("sp67_faction_insurgency_sigil");

  // L19 — unnameable hue cabinet (mutex; matches user compositeScopes)
  if (f.archives_unnameable_cabinet_open) {
    out.push("sp69_unnameable_hue_cabinet_open");
  } else {
    out.push("sp68_unnameable_hue_cabinet_closed");
  }

  // L20 — dossier cabinet (additive; pulled + drawer partially open)
  if (f.archives_dossier_pulled) out.push("sp70_dossier_cabinet_pulled");
  if (f.archives_dossier_drawer_open) out.push("sp71_dossier_drawer_partially_open");
  if (f.archives_dreamer_dossier_seam) out.push("sp72_dreamer_dossier_alcove_seam");

  // L21 — Antiquarian NPC presence (mutex; gates npc-antiquarian + 3
  // position variants from PR #807)
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

  // L22 — Shadow Tongue character overlays (mutex by intensity)
  if (f.shadow_tongue_active || base === "archives_base_shadow_tongue_witnessed") {
    out.push("sp79_shadow_tongue_halo_active");
    out.push("sp80_shadow_tongue_reflection");
  } else if (f.shadow_tongue_evidence) {
    out.push("sp78_shadow_tongue_halo_subtle");
  }

  // L23 — Human signal + eidolon (event-gated)
  if (f.first_human_contact || f.human_signal_thread_bloom) out.push("sp81_human_signal_thread_bloom");
  if (f.eidolon_anchor_resonance || trust === "luminous") out.push("sp82_eidolon_anchor_resonance");
  if (f.eidolon_first_manifestation) out.push("sp83_eidolon_first_manifestation");

  // L24 — lore eggs + IRL season + bond afterimage
  if (f.archives_egg_panopticon_face_unlocked) out.push("sp84_lore_egg_panopticon_face");
  if (f.archives_egg_warlord_node_unlocked) out.push("sp85_lore_egg_warlord_node");
  if (f.archives_egg_engineer_holo_unlocked) out.push("sp86_lore_egg_engineer_holo");
  if (season === "spring") out.push("sp87_irl_spring_petals");
  else if (season === "summer") out.push("sp88_irl_summer_brass_sun");
  else if (season === "autumn") out.push("sp89_irl_autumn_oak_leaf");
  if (f.archives_bond_pulse_recent) out.push("sp90_bond_pulse_afterimage");

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
