/* ═══════════════════════════════════════════════════════
   BRIDGE — composite resolver (Phase J)

   15 base renders + 58 sprite overlays.
   See docs/production/INCEPTION_ARK_FINAL_PRODUCTION.md §2.3
   for the canonical state-axis breakdown.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

/** Every base image that was produced for the bridge (asset id stems
 *  matching the uploaded filenames under
 *  art/rooms/bridge/base/<id>.png). */
export const BRIDGE_BASE_IDS = [
  "bridge_base_t0_dormant",
  "bridge_base_t2_act6_chair_tilted",
  "bridge_base_t2_act7_finale",
  "bridge_base_t2_activated",
  "bridge_base_t2_cycle_dawn",
  "bridge_base_t2_cycle_dimming",
  "bridge_base_t2_cycle_long_night",
  "bridge_base_t2_epoch_grand_edit",
  "bridge_base_t2_morality_dark",
  "bridge_base_t2_season_interregnum",
  "bridge_base_t2_tv_corrupted",
  "bridge_base_t2_tv_exposed",
  "bridge_base_t2_tv_quarantined",
  "bridge_base_t2_tv_spreading",
  "bridge_base_t3_restored",
] as const;

/** Every sprite delivered for the bridge. */
export const BRIDGE_SPRITE_IDS = [
  "sp01_banner_authority",
  "sp02_banner_insurgency",
  "sp03_banner_antiquarian",
  "sp04_banner_substrate_rebels",
  "sp05_viewport_substrate_purple_bleed",
  "sp06_viewport_act4_sector_etch",
  "sp07_viewport_insurgency_swarm_particle",
  "sp08_comms_locke_panel",
  "sp09_comms_locke_panel_double",
  "sp10_comms_declaration_glyphs",
  "sp11_comms_substrate_rebel_sigil",
  "sp12_comms_human_archon_iris",
  "sp13_comms_guild_crest",
  "sp14_board_act2_five_new_cards",
  "sp15_board_act3_color_bands",
  "sp16_board_act5_cyan_thread_exit",
  "sp17_board_governance_vote_open_glyph",
  "sp18_board_governance_vote_closed_glyph",
  "sp19_board_governance_modifier_edge",
  "sp20_board_guild_banner_drape",
  "sp21_board_insurgency_hot_orange_card",
  "sp22_board_shadow_tongue_44th_thread",
  "sp23_board_shadow_tongue_marginalia",
  "sp24_board_tournament_bracket_chip",
  "sp25_board_hellbox3_chalk_sigil",
  "sp26_floor_compass_authority_lattice",
  "sp27_chess_baseline_architects_gambit",
  "sp28_chess_act2_advanced",
  "sp29_chess_act5_king_on_side",
  "sp30_chess_act7_folded",
  "sp31_chess_mastered_endgame",
  "sp32_chess_climb_master_empty_with_plate",
  "sp33_chess_antiquarian_set",
  "sp34_chess_authority_pawn_on_rail",
  "sp35_pedestal_brass_plaque",
  "sp36_pedestal_panopticon_eye_glyph",
  "sp37_pedestal_trade_empire_coin",
  "sp38_pedestal_antiquarian_leaf",
  "sp39_chair_closure_plate",
  "sp40_investigation_yellow_tape",
  "sp41_investigation_cyan_tape",
  "sp42_investigation_brass_evidence_cart",
  "sp43_chair_hand_mark",
  "sp44_chandelier_irl_spring",
  "sp45_chandelier_irl_summer",
  "sp46_chandelier_irl_autumn",
  "sp47_chandelier_irl_winter",
  "sp48_cades_dischordia_card",
  "sp49_cades_chair_warm_impression",
  "sp50_cades_agent_zero_station_cleaned",
  "sp51_elara_default",
  "sp52_elara_trust_lucid",
  "sp53_elara_trust_luminous",
  "sp54_elara_morality_light",
  "sp55_elara_morality_dark",
  "sp56_elara_cades_flickering",
  "sp57_witness_glyph_lucid_filament",
  "sp58_witness_glyph_luminous_halo",
] as const;

/** Pick the single base render for the current game state. Higher-priority
 *  bases override lower-priority ones; see precedence rules in the Phase J
 *  production sheet for the bridge. */
function pickBase(g: CompositeGameSlice): typeof BRIDGE_BASE_IDS[number] {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "bridge");

  // Epoch + corruption + finale states win over normal tier/cycle.
  if (f.grand_edit_active) return "bridge_base_t2_epoch_grand_edit";
  if (tv === "quarantined") return "bridge_base_t2_tv_quarantined";
  if (tv === "corrupted") return "bridge_base_t2_tv_corrupted";
  if (tv === "spreading") return "bridge_base_t2_tv_spreading";
  if (tv === "exposed") return "bridge_base_t2_tv_exposed";

  // Act 7 finale (Elara absent, board cleared) wins over Act 6 (chair tilted)
  // wins over t3 restored wins over t2 activated.
  if (tier >= 7) return "bridge_base_t2_act7_finale";
  if (tier >= 6 || f.discovered_elara_is_senator_voss) {
    return "bridge_base_t2_act6_chair_tilted";
  }
  if (f.bridge_war_table_online) return "bridge_base_t3_restored";

  // Lighting bases — only apply over the activated tier (the resolver
  // never overrides t0 dormant with a cycle palette).
  const activated = !!f.fast_travel_unlocked;
  if (activated) {
    if (f.season_phase_interregnum) return "bridge_base_t2_season_interregnum";
    if (moralityBand(g.moralityScore) === "dark") return "bridge_base_t2_morality_dark";
    if (cycle === "longNight") return "bridge_base_t2_cycle_long_night";
    if (cycle === "dimming") return "bridge_base_t2_cycle_dimming";
    if (cycle === "dawn") return "bridge_base_t2_cycle_dawn";
    return "bridge_base_t2_activated";
  }
  return "bridge_base_t0_dormant";
}

function pickSprites(
  g: CompositeGameSlice,
  base: typeof BRIDGE_BASE_IDS[number],
): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);

  // L1 — faction banners
  if (factionHigh(g, "authority")) out.push("sp01_banner_authority");
  if (factionHigh(g, "insurgency")) out.push("sp02_banner_insurgency");
  if (factionHigh(g, "antiquarian")) out.push("sp03_banner_antiquarian");
  if (factionHigh(g, "substrate_rebels")) out.push("sp04_banner_substrate_rebels");

  // L2 — viewport
  if (factionHigh(g, "substrate_rebels")) out.push("sp05_viewport_substrate_purple_bleed");
  if (tier >= 4) out.push("sp06_viewport_act4_sector_etch");
  if (factionHigh(g, "insurgency")) out.push("sp07_viewport_insurgency_swarm_particle");

  // L3 — comms bank
  if (f.trade_empire_unlocked && !factionHigh(g, "authority")) {
    out.push("sp08_comms_locke_panel");
  }
  if (factionHigh(g, "authority")) out.push("sp09_comms_locke_panel_double");
  if (f.season_phase_prologue) out.push("sp10_comms_declaration_glyphs");
  if (factionHigh(g, "substrate_rebels")) out.push("sp11_comms_substrate_rebel_sigil");
  if (f.discovered_the_human_is_archon) out.push("sp12_comms_human_archon_iris");
  if (f.guild_formed) out.push("sp13_comms_guild_crest");

  // L4 — conspiracy board (only when board exists — t2+ states)
  if (base !== "bridge_base_t0_dormant" && base !== "bridge_base_t2_act7_finale") {
    if (tier >= 2) out.push("sp14_board_act2_five_new_cards");
    if (tier >= 3) out.push("sp15_board_act3_color_bands");
    if (tier >= 5) out.push("sp16_board_act5_cyan_thread_exit");
    if (f.governance_vote_open) out.push("sp17_board_governance_vote_open_glyph");
    else if (f.governance_vote_closed) out.push("sp18_board_governance_vote_closed_glyph");
    if (f.governance_world_modifier_active) out.push("sp19_board_governance_modifier_edge");
    if (f.guild_formed) out.push("sp20_board_guild_banner_drape");
    if (factionHigh(g, "insurgency")) out.push("sp21_board_insurgency_hot_orange_card");
    if ((f.shadow_tongue_power_40 ?? false) || f.shadow_tongue_evidence) {
      out.push("sp22_board_shadow_tongue_44th_thread");
      out.push("sp23_board_shadow_tongue_marginalia");
    }
    if (f.tournament_finals_window) out.push("sp24_board_tournament_bracket_chip");
    if (f.hellbox3_palimpsest) out.push("sp25_board_hellbox3_chalk_sigil");
  }

  // L5 — floor
  if (factionHigh(g, "authority")) out.push("sp26_floor_compass_authority_lattice");

  // L6 — chess table (mutually exclusive)
  if (tier >= 7) {
    out.push("sp30_chess_act7_folded");
  } else if (f.chess_climb_master) {
    out.push("sp32_chess_climb_master_empty_with_plate");
  } else if (f.chess_mastered) {
    out.push("sp31_chess_mastered_endgame");
  } else if (tier >= 5) {
    out.push("sp29_chess_act5_king_on_side");
  } else if (factionHigh(g, "antiquarian")) {
    out.push("sp33_chess_antiquarian_set");
  } else if (tier >= 2) {
    out.push("sp28_chess_act2_advanced");
  } else {
    out.push("sp27_chess_baseline_architects_gambit");
  }
  if (factionHigh(g, "authority")) out.push("sp34_chess_authority_pawn_on_rail");

  // L7 — pedestal objects (additive)
  if (tier >= 4) out.push("sp35_pedestal_brass_plaque");
  if (f.discovered_elara_is_senator_voss) out.push("sp36_pedestal_panopticon_eye_glyph");
  if (f.trade_empire_unlocked) out.push("sp37_pedestal_trade_empire_coin");
  if (factionHigh(g, "antiquarian")) out.push("sp38_pedestal_antiquarian_leaf");

  // L8 — investigation
  const investTier = f.bridge_case_closed
    ? "closed"
    : f.bridge_investigation_partial
    ? "partial"
    : f.bridge_investigation_investigating
    ? "investigating"
    : "initial";
  if (investTier === "investigating") out.push("sp40_investigation_yellow_tape");
  if (investTier === "partial") out.push("sp41_investigation_cyan_tape");
  if (investTier === "partial" || investTier === "closed") {
    out.push("sp42_investigation_brass_evidence_cart");
  }
  if (investTier === "closed") out.push("sp39_chair_closure_plate");

  // L9 — chair detail (trust luminous)
  if (trustBand(g.elaraTrust) === "luminous") out.push("sp43_chair_hand_mark");

  // L10 — chandelier IRL trinket
  if (g.irlSeason === "spring") out.push("sp44_chandelier_irl_spring");
  else if (g.irlSeason === "summer") out.push("sp45_chandelier_irl_summer");
  else if (g.irlSeason === "autumn") out.push("sp46_chandelier_irl_autumn");
  else if (g.irlSeason === "winter") out.push("sp47_chandelier_irl_winter");

  // L11 — CADES presence
  const cadesPresent = !!f.cades_kael_present;
  if (cadesPresent) {
    out.push("sp48_cades_dischordia_card");
    out.push("sp49_cades_chair_warm_impression");
    out.push("sp50_cades_agent_zero_station_cleaned");
  }

  // L12 — Elara figure (mutex). Absent in: t0 dormant, t2 act7 finale,
  // and (replaced) when CADES is present.
  const elaraInScene =
    base !== "bridge_base_t0_dormant" &&
    base !== "bridge_base_t2_act7_finale";
  if (elaraInScene) {
    if (cadesPresent) {
      out.push("sp56_elara_cades_flickering");
    } else {
      const trust = trustBand(g.elaraTrust);
      const morality = moralityBand(g.moralityScore);
      if (trust === "luminous") out.push("sp53_elara_trust_luminous");
      else if (trust === "lucid") out.push("sp52_elara_trust_lucid");
      else if (morality === "dark") out.push("sp55_elara_morality_dark");
      else if (morality === "light") out.push("sp54_elara_morality_light");
      else out.push("sp51_elara_default");
    }
  }

  // L13 — witness-glyph (mutex with trust)
  if (trustBand(g.elaraTrust) === "lucid") out.push("sp57_witness_glyph_lucid_filament");
  else if (trustBand(g.elaraTrust) === "luminous") out.push("sp58_witness_glyph_luminous_halo");

  return out;
}

function pickFilter(base: typeof BRIDGE_BASE_IDS[number]): string | undefined {
  if (base === "bridge_base_t2_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "bridge_base_t2_cycle_dimming") return LIGHTING_FILTERS.cycle_dimming;
  if (base === "bridge_base_t2_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "bridge_base_t2_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "bridge_base_t2_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "bridge_base_t2_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "bridge_base_t2_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  if (base === "bridge_base_t2_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  return undefined;
}

export function resolveBridgeComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
