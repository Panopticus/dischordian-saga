/* ═══════════════════════════════════════════════════════
   CRYO BAY — composite resolver (Phase J)

   13 base renders + 83 sprite overlays.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const CRYO_BAY_BASE_IDS = [
  "cryo_bay_base_act7_finale",
  "cryo_bay_base_cycle_dawn",
  "cryo_bay_base_cycle_dimming",
  "cryo_bay_base_cycle_long_night",
  "cryo_bay_base_epoch_grand_edit",
  "cryo_bay_base_initial",
  "cryo_bay_base_long_sleep_ending",
  "cryo_bay_base_morality_dark",
  "cryo_bay_base_season_interregnum",
  "cryo_bay_base_tv_corrupted",
  "cryo_bay_base_tv_exposed",
  "cryo_bay_base_tv_quarantined",
  "cryo_bay_base_tv_spreading",
] as const;

export const CRYO_BAY_SPRITE_IDS = [
  "sp01_med_bay_door_amber",
  "sp02_med_bay_door_open",
  "sp03_bridge_door_open",
  "sp04_second_retrofitted_bulkhead",
  "sp05_phosphor_green_hatch",
  "sp06_pod9_vex_empty",
  "sp07_pod5_annika_empty",
  "sp08_pod5_amber_warning",
  "sp09_pod7_amber_warning",
  "sp10_dead_pod_brass_patched",
  "sp11_rear_row_blast_plate",
  "sp12_rear_row_pod_brass_token",
  "sp13_pod2_voss_polished",
  "sp14_all_pods_declaration_sigils",
  "sp15_dead_pod_glass_condensed_silhouette",
  "sp16_dead_pod_glass_wiped_oval",
  "sp17_dead_pod_cordoned_tape",
  "sp18_cracked_panel_phosphor_arc",
  "sp19_cracked_panel_brass_patch",
  "sp20_medical_chart_clipped",
  "sp21_torn_id_tag_floor",
  "sp22_silver_locket_floor",
  "sp23_data_slate_under_pod",
  "sp24_diagnostic_cart_consolidated",
  "sp25_brass_wrench_sigil_token",
  "sp26_chart_psi_watermark_indigo",
  "sp27_chart_name_lit_l_vox",
  "sp28_ichor_trail_faint",
  "sp29_ichor_trail_bright_luminous",
  "sp30_ichor_trail_dry_dark",
  "sp31_candle_lit_west_1",
  "sp32_candle_lit_west_2",
  "sp33_candle_lit_west_3",
  "sp34_candle_lit_east_1",
  "sp35_candle_lit_east_2",
  "sp36_candle_lit_east_3",
  "sp37_candle_smoke_west_1",
  "sp38_candle_smoke_west_2",
  "sp39_candle_smoke_west_3",
  "sp40_candle_smoke_east_1",
  "sp41_candle_smoke_east_2",
  "sp42_candle_smoke_east_3",
  "sp43_player_pod_act2_service_slot",
  "sp44_player_pod_act4_magnetized_token",
  "sp45_player_pod_act4_radial_frost",
  "sp46_player_pod_act6_rim_decal_sigil",
  "sp47_master_control_alert_ring",
  "sp48_master_control_ballot_open",
  "sp49_master_control_ballot_closed",
  "sp50_master_control_insurgent_override",
  "sp51_master_control_guild_crest",
  "sp52_tome_open_glowing",
  "sp53_tome_open_indigo",
  "sp54_tome_closed_sigil_lock",
  "sp55_tome_missing",
  "sp56_tome_bookmark_ribbon",
  "sp57_terminal_green_data_scroll",
  "sp58_terminal_red_lockout",
  "sp59_locker_open_empty",
  "sp60_locker_open_jumpsuit",
  "sp61_locker_scratched_sigil",
  "sp62_locker_photo_pinned",
  "sp63_wall_emblem_authority_crest",
  "sp64_wall_emblem_substrate_sigil",
  "sp65_wall_emblem_guild_banner",
  "sp66_floor_compass_authority_lattice",
  "sp67_floor_frost_mandala",
  "sp68_faction_atmo_authority_gold_haze",
  "sp69_faction_atmo_substrate_purple_static",
  "sp70_faction_atmo_guild_green_mist",
  "sp71_faction_atmo_insurgent_red_haze",
  "sp72_tournament_bracket_chip",
  "sp73_hellbox_chalk_sigil_floor",
  "sp74_hellbox_candle_ring",
  "sp75_irl_trinket_spring_flower",
  "sp76_irl_trinket_summer_shell",
  "sp77_irl_trinket_autumn_leaf",
  "sp78_irl_trinket_winter_snowflake",
  "sp79_cades_dischordia_card",
  "sp80_cades_warm_impression_pod",
  "sp81_cades_agent_zero_console_cleaned",
  "sp82_witness_glyph_lucid_filament",
  "sp83_witness_glyph_luminous_halo",
] as const;

type CryoBaseId = typeof CRYO_BAY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): CryoBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "cryo_bay");

  if (f.long_sleep_ending) return "cryo_bay_base_long_sleep_ending";
  if (f.grand_edit_active) return "cryo_bay_base_epoch_grand_edit";
  if (tv === "quarantined") return "cryo_bay_base_tv_quarantined";
  if (tv === "corrupted") return "cryo_bay_base_tv_corrupted";
  if (tv === "spreading") return "cryo_bay_base_tv_spreading";
  if (tv === "exposed") return "cryo_bay_base_tv_exposed";
  if (tier >= 7) return "cryo_bay_base_act7_finale";
  if (f.season_phase_interregnum) return "cryo_bay_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "cryo_bay_base_morality_dark";
  if (cycle === "longNight") return "cryo_bay_base_cycle_long_night";
  if (cycle === "dimming") return "cryo_bay_base_cycle_dimming";
  if (cycle === "dawn") return "cryo_bay_base_cycle_dawn";
  return "cryo_bay_base_initial";
}

function pickSprites(g: CompositeGameSlice, _base: CryoBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);

  // L1 — bulkhead/door states
  const investTier = f.cryo_case_marked_open
    ? "case-open-later"
    : f.cryo_mystery_victim_identified
    ? "victim-identified"
    : f.cryo_mystery_first_clue_found
    ? "investigating"
    : "initial";
  if (investTier === "victim-identified") out.push("sp01_med_bay_door_amber");
  if (investTier === "case-open-later" || tier >= 7) out.push("sp02_med_bay_door_open");
  if (tier >= 7) out.push("sp03_bridge_door_open");
  if (tier >= 5) out.push("sp04_second_retrofitted_bulkhead");
  if (tier >= 3 && tier < 7) out.push("sp05_phosphor_green_hatch");

  // L2 — pod geometry
  if (f.vex_woken) out.push("sp06_pod9_vex_empty");
  if (f.annika_woken) out.push("sp07_pod5_annika_empty");
  if (f.master_control_alert_active) {
    out.push("sp08_pod5_amber_warning");
    out.push("sp09_pod7_amber_warning");
  }
  if (tier >= 5 && investTier !== "initial") out.push("sp10_dead_pod_brass_patched");
  if (tier === 3) out.push("sp11_rear_row_blast_plate");
  if (tier >= 7) out.push("sp12_rear_row_pod_brass_token");
  if (f.cades_kael_present) out.push("sp13_pod2_voss_polished");

  // L3 — pod band indicators (season prologue)
  if (f.season_phase_prologue) out.push("sp14_all_pods_declaration_sigils");

  // L4 — dead-pod investigation (mutex)
  if (investTier === "investigating") out.push("sp15_dead_pod_glass_condensed_silhouette");
  else if (investTier === "victim-identified") out.push("sp16_dead_pod_glass_wiped_oval");
  else if (investTier === "case-open-later") out.push("sp17_dead_pod_cordoned_tape");

  // L5 — investigation evidence (additive)
  if (investTier === "investigating") {
    out.push("sp18_cracked_panel_phosphor_arc");
    out.push("sp20_medical_chart_clipped");
    out.push("sp21_torn_id_tag_floor");
    out.push("sp22_silver_locket_floor");
    out.push("sp23_data_slate_under_pod");
  } else if (investTier === "victim-identified") {
    out.push("sp20_medical_chart_clipped");
    out.push("sp24_diagnostic_cart_consolidated");
  } else if (investTier === "case-open-later") {
    out.push("sp19_cracked_panel_brass_patch");
    out.push("sp20_medical_chart_clipped");
    out.push("sp24_diagnostic_cart_consolidated");
  }
  if (f.discovered_cryo_victim_was_engineer) {
    out.push("sp25_brass_wrench_sigil_token");
    out.push("sp27_chart_name_lit_l_vox");
  }
  if ((f.shadow_tongue_power_40 ?? false) || f.shadow_tongue_evidence) {
    out.push("sp26_chart_psi_watermark_indigo");
  }

  // L6 — ichor trail (mutex)
  if (investTier === "investigating" || investTier === "victim-identified") {
    out.push("sp29_ichor_trail_bright_luminous");
  } else if (investTier === "case-open-later" || tier >= 1) {
    out.push("sp30_ichor_trail_dry_dark");
  } else {
    out.push("sp28_ichor_trail_faint");
  }

  // L7 — candles (per-slot lit/unlit/extinguished)
  const candles: ReadonlyArray<readonly ["west_1" | "west_2" | "west_3" | "east_1" | "east_2" | "east_3", string, string]> = [
    ["west_1", "sp31_candle_lit_west_1", "sp37_candle_smoke_west_1"],
    ["west_2", "sp32_candle_lit_west_2", "sp38_candle_smoke_west_2"],
    ["west_3", "sp33_candle_lit_west_3", "sp39_candle_smoke_west_3"],
    ["east_1", "sp34_candle_lit_east_1", "sp40_candle_smoke_east_1"],
    ["east_2", "sp35_candle_lit_east_2", "sp41_candle_smoke_east_2"],
    ["east_3", "sp36_candle_lit_east_3", "sp42_candle_smoke_east_3"],
  ];
  for (const [slot, lit, smoke] of candles) {
    if (f[`cryo_candle_${slot}_lit`]) out.push(lit);
    else if (f[`cryo_candle_${slot}_extinguished`]) out.push(smoke);
  }

  // L8 — player-pod additions (additive across acts)
  if (tier >= 2) out.push("sp43_player_pod_act2_service_slot");
  if (tier >= 4) {
    out.push("sp44_player_pod_act4_magnetized_token");
    out.push("sp45_player_pod_act4_radial_frost");
  }
  if (tier >= 6) out.push("sp46_player_pod_act6_rim_decal_sigil");

  // L9 — master control overlays
  if (f.master_control_alert_active) out.push("sp47_master_control_alert_ring");
  if (f.governance_vote_open) out.push("sp48_master_control_ballot_open");
  else if (f.governance_vote_closed) out.push("sp49_master_control_ballot_closed");
  if (factionHigh(g, "insurgency")) out.push("sp50_master_control_insurgent_override");
  if (f.guild_formed) out.push("sp51_master_control_guild_crest");

  // L10 — tome state (mutex)
  if ((f.shadow_tongue_power_40 ?? false) || f.shadow_tongue_evidence) {
    out.push("sp53_tome_open_indigo");
  } else if (f.tome_missing) {
    out.push("sp55_tome_missing");
  } else if (factionHigh(g, "antiquarian")) {
    out.push("sp52_tome_open_glowing");
  } else {
    out.push("sp54_tome_closed_sigil_lock");
  }
  if (f.tome_bookmarked) out.push("sp56_tome_bookmark_ribbon");

  // L11 — terminal state
  if (tier >= 3) out.push("sp57_terminal_green_data_scroll");
  if (f.tv_infection_quarantined) out.push("sp58_terminal_red_lockout");

  // L12 — lockers
  if (tier >= 1) out.push("sp59_locker_open_empty");
  if (tier >= 2) out.push("sp60_locker_open_jumpsuit");
  if (factionHigh(g, "insurgency")) out.push("sp61_locker_scratched_sigil");
  if (f.discovered_cryo_victim_was_engineer) out.push("sp62_locker_photo_pinned");

  // L13 — wall emblems
  if (factionHigh(g, "authority")) out.push("sp63_wall_emblem_authority_crest");
  if (factionHigh(g, "substrate_rebels")) out.push("sp64_wall_emblem_substrate_sigil");
  if (f.guild_formed) out.push("sp65_wall_emblem_guild_banner");

  // L14 — floor overlays
  if (factionHigh(g, "authority")) out.push("sp66_floor_compass_authority_lattice");
  if (tier >= 4) out.push("sp67_floor_frost_mandala");

  // L15 — faction atmospheric (one at most — highest-rep faction wins)
  if (factionHigh(g, "authority")) out.push("sp68_faction_atmo_authority_gold_haze");
  else if (factionHigh(g, "substrate_rebels")) out.push("sp69_faction_atmo_substrate_purple_static");
  else if (f.guild_formed) out.push("sp70_faction_atmo_guild_green_mist");
  else if (factionHigh(g, "insurgency")) out.push("sp71_faction_atmo_insurgent_red_haze");

  // L16 — tournament + hellbox
  if (f.tournament_finals_window) out.push("sp72_tournament_bracket_chip");
  if (f.hellbox3_palimpsest) {
    out.push("sp73_hellbox_chalk_sigil_floor");
    out.push("sp74_hellbox_candle_ring");
  }

  // L17 — IRL trinket
  if (g.irlSeason === "spring") out.push("sp75_irl_trinket_spring_flower");
  else if (g.irlSeason === "summer") out.push("sp76_irl_trinket_summer_shell");
  else if (g.irlSeason === "autumn") out.push("sp77_irl_trinket_autumn_leaf");
  else if (g.irlSeason === "winter") out.push("sp78_irl_trinket_winter_snowflake");

  // L18 — CADES presence
  if (f.cades_kael_present) {
    out.push("sp79_cades_dischordia_card");
    out.push("sp80_cades_warm_impression_pod");
    out.push("sp81_cades_agent_zero_console_cleaned");
  }

  // L19 — witness-glyph (mutex)
  const trust = trustBand(g.elaraTrust);
  if (trust === "lucid") out.push("sp82_witness_glyph_lucid_filament");
  else if (trust === "luminous") out.push("sp83_witness_glyph_luminous_halo");

  return out;
}

function pickFilter(base: CryoBaseId): string | undefined {
  if (base === "cryo_bay_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "cryo_bay_base_cycle_dimming") return LIGHTING_FILTERS.cycle_dimming;
  if (base === "cryo_bay_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "cryo_bay_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "cryo_bay_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "cryo_bay_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "cryo_bay_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  if (base === "cryo_bay_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "cryo_bay_base_long_sleep_ending") return LIGHTING_FILTERS.long_sleep_ending;
  return undefined;
}

export function resolveCryoBayComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
