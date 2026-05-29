/* ═══════════════════════════════════════════════════════
   ARMORY — composite resolver (Phase J)

   15 base renders + 90 sprite overlays.

   Authored against the producer manifest "ARMORY — Manus + Nano
   Banana Production Sheet" (2026-05-26). Base picker priority +
   sprite trigger table both follow that spec verbatim, with
   minor adaptation for runtime flag semantics:

   - Spec uses colon-namespaced flags ("armory:authorized") —
     we use underscore-flat form ("armory_authorized") matching
     the rest of the codebase.
   - Spec's pickBase switch uses cycle "day"; the actual
     deriveCyclePhase returns "balanced" — mapped to AR-B04.
   - Spec's faction IDs ("junta", "council", etc.) aren't yet
     in FACTION_ALIASES; factionHigh() returns false for them
     until they get registered, so the picker falls through to
     AR-B02 by default. That matches the spec's intent.

   pickSprites emits the full §3 trigger table — ~25-40 sprites
   in a typical loadout depending on faction + act tier + cycle.
   AR-B01 (locked / unauthorized) emits NO sprites per §3 — only
   the antechamber view; the rest of the room isn't visible.
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveTVInfection, factionHigh, moralityBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const ARMORY_BASE_IDS = [
  "AR-B01",
  "AR-B02",
  "AR-B03",
  "AR-B04",
  "AR-B05",
  "AR-B06",
  "AR-B07",
  "AR-B08",
  "AR-B09",
  "AR-B10",
  "AR-B11",
  "AR-B12",
  "AR-B13",
  "AR-B14",
  "AR-B15",
] as const;

export const ARMORY_SPRITE_IDS = [
  "SP01_rifle_rack_standard",
  "SP02_carbine_rack",
  "SP03_marksman_rack_locked",
  "SP04_junta_assault_rifles",
  "SP05_council_ceremonial_muskets",
  "SP06_chaos_improvised_long_arms",
  "SP07_synthesis_paired_arms",
  "SP08_hellbox_cursed_rifle",
  "SP09_council_marksman_rifle",
  "SP10_chaos_sawn_off_bullpup",
  "SP11_pistol_rack_standard",
  "SP12_captains_sidearm_display",
  "SP13_junta_sidearms",
  "SP14_council_inspection_sidearms",
  "SP15_hellbox_cursed_pistol",
  "SP16_eidolon_haunted_sidearm",
  "SP17_bayonet_rack",
  "SP18_combat_blade_rack",
  "SP19_captains_ceremonial_blade",
  "SP20_junta_riot_batons",
  "SP21_chaos_improvised_melee",
  "SP22_synthesis_arbitration_staves",
  "SP23_master_smith_commission_blade",
  "SP24_hellbox_cursed_blade",
  "SP25_ammo_lockers_rifle",
  "SP26_ammo_lockers_sidearm",
  "SP27_grenade_locker",
  "SP28_plasma_cell_rack",
  "SP29_eidolon_containment_rounds",
  "SP30_junta_riot_canisters",
  "SP31_smoke_grenade_rack",
  "SP32_synthesis_non_lethal_rounds",
  "SP33_riot_armor_mannequin",
  "SP34_standard_combat_armor",
  "SP35_captains_command_armor",
  "SP36_eva_boarding_armor",
  "SP37_junta_crowd_control_kit",
  "SP38_council_ceremonial_plate",
  "SP39_synthesis_arbitration_vest",
  "SP40_hellbox_touched_cursed_armor",
  "SP41_vault_door_closed",
  "SP42_vault_door_open_interior",
  "SP43_restricted_weapons_vault",
  "SP44_eidolon_munitions_vault",
  "SP45_hellbox_weapons_cache",
  "SP46_master_inventory_locker",
  "SP47_quartermasters_desk_manned",
  "SP48_issue_log_book_open",
  "SP49_chain_of_custody_board",
  "SP50_returned_gear_bin",
  "SP51_maintenance_bench_rifle",
  "SP52_boresighting_rig",
  "SP53_training_dummy_intact",
  "SP54_training_dummy_worn",
  "SP55_boresight_target_wall",
  "SP56_cleaning_station",
  "SP57_weapon_parts_bin",
  "SP58_manufacturer_marker_board",
  "SP59_authorization_roster_placard",
  "SP60_issue_priority_chart",
  "SP61_junta_requisition_order",
  "SP62_council_audit_notice",
  "SP63_synthesis_disarmament_protocol",
  "SP64_forge_supply_manifest",
  "SP65_quartermaster_on_duty",
  "SP66_junta_requisition_officer",
  "SP67_council_inspector",
  "SP68_captain_drawing_sidearm",
  "SP69_apprentice_runner",
  "SP70_marines_drawing_kit",
  "SP71_sodium_emergency_strip",
  "SP72_gun_oil_mist_haze",
  "SP73_dust_particulate_light",
  "SP74_tv_static_infection_bleed",
  "SP75_shadow_tongue_code_rain",
  "SP76_dawn_beam_caged_window",
  "SP77_long_night_moonlight",
  "SP78_plasma_cell_glow_halo",
  "SP79_mr_whiskers_missing_poster",
  "SP80_captains_father_medal",
  "SP81_lost_dog_tag",
  "SP82_hidden_marginalia_issue_log",
  "SP83_antiquarians_research_note",
  "SP84_forge_first_apprentice_piece",
  "SP85_hellbox_cipher_rubbing",
  "SP86_eidolon_whisper_recorder",
  "SP87_comms_array_key_fragment",
  "SP88_lost_engagement_ring",
  "SP89_jack_of_swords_card",
  "SP90_cryo_frozen_contraband",
] as const;

type ArmoryBaseId = typeof ARMORY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): ArmoryBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "armory");
  const morality = moralityBand(g.moralityScore);

  // Gate: locked / unauthorized antechamber view (no room interior visible)
  if (!f.armory_authorized) return "AR-B01";

  // Post-peace disarmament
  if (f.treaty_signed && f.disarmament_phase) return "AR-B15";

  // TV corrupted
  if (tv === "corrupted") return "AR-B14";

  // Act tier-driven endgame states
  if (tier >= 6) return "AR-B13";
  if (tier >= 4) return "AR-B12";

  // Faction-championed states (mutex by faction)
  if (factionHigh(g, "synthesis_concord")) return "AR-B11";
  if (factionHigh(g, "chaos_remnant")) return "AR-B10";
  if (factionHigh(g, "order_protectorate")) return "AR-B09";

  // Morality / faction transparency
  if (morality === "light" || factionHigh(g, "council")) return "AR-B08";
  if (morality === "dark" || factionHigh(g, "junta")) return "AR-B07";

  // Cycle phase. The spec uses "day"; deriveCyclePhase returns "balanced"
  // for that slot — both map to AR-B04 (Day Standard Ops).
  if (cycle === "longNight") return "AR-B06";
  if (cycle === "dimming") return "AR-B05";
  if (cycle === "balanced") return "AR-B04";
  if (cycle === "dawn") return "AR-B03";

  return "AR-B02";
}

function pickSprites(g: CompositeGameSlice, base: ArmoryBaseId): string[] {
  // AR-B01 is the locked antechamber view — no room interior visible.
  if (base === "AR-B01") return [];

  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "armory");
  const morality = moralityBand(g.moralityScore);

  // ──────────────────────────────────────────────────────
  // A · Long Arms (SP01-10)
  // ──────────────────────────────────────────────────────
  out.push("SP01_rifle_rack_standard");
  out.push("SP02_carbine_rack");
  if (tier >= 3) out.push("SP03_marksman_rack_locked");
  if (factionHigh(g, "junta") || morality === "dark") out.push("SP04_junta_assault_rifles");
  if (factionHigh(g, "council")) {
    out.push("SP05_council_ceremonial_muskets");
    out.push("SP09_council_marksman_rifle");
  }
  if (factionHigh(g, "chaos_remnant")) {
    out.push("SP06_chaos_improvised_long_arms");
    out.push("SP10_chaos_sawn_off_bullpup");
  }
  if (factionHigh(g, "synthesis_concord")) out.push("SP07_synthesis_paired_arms");
  if (f.hellbox_rifle_recovered) out.push("SP08_hellbox_cursed_rifle");

  // ──────────────────────────────────────────────────────
  // B · Sidearms (SP11-16)
  // ──────────────────────────────────────────────────────
  out.push("SP11_pistol_rack_standard");
  if (f.captain_armed) out.push("SP12_captains_sidearm_display");
  if (factionHigh(g, "junta")) out.push("SP13_junta_sidearms");
  if (factionHigh(g, "council")) out.push("SP14_council_inspection_sidearms");
  if (f.hellbox_pistol_recovered) out.push("SP15_hellbox_cursed_pistol");
  if (f.eidolon_haunted_sidearm_secured) out.push("SP16_eidolon_haunted_sidearm");

  // ──────────────────────────────────────────────────────
  // C · Blades & Melee (SP17-24)
  // ──────────────────────────────────────────────────────
  out.push("SP17_bayonet_rack");
  out.push("SP18_combat_blade_rack");
  if (f.captains_blade_finished) out.push("SP19_captains_ceremonial_blade");
  if (factionHigh(g, "junta")) out.push("SP20_junta_riot_batons");
  if (factionHigh(g, "chaos_remnant")) out.push("SP21_chaos_improvised_melee");
  if (factionHigh(g, "synthesis_concord")) out.push("SP22_synthesis_arbitration_staves");
  if (f.commission_blade_completed) out.push("SP23_master_smith_commission_blade");
  if (f.hellbox_blade_recovered) out.push("SP24_hellbox_cursed_blade");

  // ──────────────────────────────────────────────────────
  // D · Ammunition & Munitions (SP25-32)
  // ──────────────────────────────────────────────────────
  out.push("SP25_ammo_lockers_rifle");
  out.push("SP26_ammo_lockers_sidearm");
  if (tier >= 3) {
    out.push("SP27_grenade_locker");
    out.push("SP31_smoke_grenade_rack");
  }
  if (tier >= 4) out.push("SP28_plasma_cell_rack");
  if (f.eidolon_containment_rounds_issued) out.push("SP29_eidolon_containment_rounds");
  if (factionHigh(g, "junta") || morality === "dark") out.push("SP30_junta_riot_canisters");
  if (factionHigh(g, "synthesis_concord")) out.push("SP32_synthesis_non_lethal_rounds");

  // ──────────────────────────────────────────────────────
  // E · Armor & Gear (SP33-40) — armor stand mutex
  // ──────────────────────────────────────────────────────
  if (factionHigh(g, "junta") || morality === "dark") {
    out.push("SP33_riot_armor_mannequin");
    out.push("SP37_junta_crowd_control_kit");
  } else if (factionHigh(g, "council")) {
    out.push("SP38_council_ceremonial_plate");
  } else if (factionHigh(g, "synthesis_concord")) {
    out.push("SP39_synthesis_arbitration_vest");
  } else {
    out.push("SP34_standard_combat_armor");
  }
  if (f.captain_armed) out.push("SP35_captains_command_armor");
  if (tier >= 4) out.push("SP36_eva_boarding_armor");
  if (f.hellbox_armor_recovered) out.push("SP40_hellbox_touched_cursed_armor");

  // ──────────────────────────────────────────────────────
  // F · Storage & Vault (SP41-46) — vault state mutex
  // ──────────────────────────────────────────────────────
  out.push("SP46_master_inventory_locker");
  if (f.armory_vault_open) {
    // Mutex by what's inside the vault
    if (f.hellbox_cache_inside) out.push("SP45_hellbox_weapons_cache");
    else if (f.eidolon_contained_active) out.push("SP44_eidolon_munitions_vault");
    else if (morality === "dark") out.push("SP43_restricted_weapons_vault");
    else out.push("SP42_vault_door_open_interior");
  } else {
    out.push("SP41_vault_door_closed");
  }

  // ──────────────────────────────────────────────────────
  // G · Quartermaster's Station (SP47-52) — manned mostly in day cycle
  // ──────────────────────────────────────────────────────
  out.push("SP49_chain_of_custody_board"); // always-on
  const qmCycleActive = cycle === "balanced" || cycle === "dawn" || cycle === "dimming";
  if (qmCycleActive) out.push("SP47_quartermasters_desk_manned");
  if (cycle === "balanced") {
    out.push("SP48_issue_log_book_open");
    out.push("SP51_maintenance_bench_rifle");
    out.push("SP52_boresighting_rig");
  }
  if (cycle === "dimming" || tier >= 4) out.push("SP50_returned_gear_bin");

  // ──────────────────────────────────────────────────────
  // H · Training & Maintenance (SP53-58)
  // ──────────────────────────────────────────────────────
  out.push("SP55_boresight_target_wall");
  out.push("SP57_weapon_parts_bin");
  out.push("SP58_manufacturer_marker_board");
  if (tier >= 4 || morality === "dark") {
    out.push("SP54_training_dummy_worn");
  } else {
    out.push("SP53_training_dummy_intact");
  }
  if (cycle === "balanced" || cycle === "dimming") out.push("SP56_cleaning_station");

  // ──────────────────────────────────────────────────────
  // I · Signage & Charts (SP59-64)
  // ──────────────────────────────────────────────────────
  out.push("SP59_authorization_roster_placard"); // always when authorized
  if (cycle === "balanced") out.push("SP60_issue_priority_chart");
  if (factionHigh(g, "junta")) out.push("SP61_junta_requisition_order");
  if (factionHigh(g, "council")) out.push("SP62_council_audit_notice");
  if (factionHigh(g, "synthesis_concord")) out.push("SP63_synthesis_disarmament_protocol");
  if (f.armory_supply_link_active) out.push("SP64_forge_supply_manifest");

  // ──────────────────────────────────────────────────────
  // J · Characters (SP65-70)
  // ──────────────────────────────────────────────────────
  if (cycle === "balanced") {
    out.push("SP65_quartermaster_on_duty");
    if (factionHigh(g, "junta")) out.push("SP66_junta_requisition_officer");
    if (factionHigh(g, "council")) out.push("SP67_council_inspector");
    if (tier >= 3) out.push("SP70_marines_drawing_kit");
  }
  if (f.captain_drawing_now) out.push("SP68_captain_drawing_sidearm");
  if (f.forge_delivery_in_transit) out.push("SP69_apprentice_runner");

  // ──────────────────────────────────────────────────────
  // K · Atmospherics (SP71-78)
  // ──────────────────────────────────────────────────────
  if (cycle === "longNight" || tier >= 6) out.push("SP71_sodium_emergency_strip");
  if (cycle === "balanced" || cycle === "dimming") out.push("SP72_gun_oil_mist_haze");
  if (cycle === "dawn" || cycle === "longNight") out.push("SP73_dust_particulate_light");
  if (tv === "corrupted") out.push("SP74_tv_static_infection_bleed");
  if (f.shadow_tongue_active) out.push("SP75_shadow_tongue_code_rain");
  if (cycle === "dawn") out.push("SP76_dawn_beam_caged_window");
  if (cycle === "longNight") out.push("SP77_long_night_moonlight");
  if (tier >= 4) out.push("SP78_plasma_cell_glow_halo");

  // ──────────────────────────────────────────────────────
  // L · Easter Eggs & Secrets (SP79-90) — all flag-gated
  // ──────────────────────────────────────────────────────
  if (f.whiskers_armory_poster) out.push("SP79_mr_whiskers_missing_poster");
  if (f.father_medal_in_vault && f.armory_vault_open) out.push("SP80_captains_father_medal");
  if (f.dog_tag_found) out.push("SP81_lost_dog_tag");
  if (f.antiquarian_armory_visit && cycle === "balanced") out.push("SP82_hidden_marginalia_issue_log");
  if (f.antiquarian_marginalia) out.push("SP83_antiquarians_research_note");
  if (f.first_apprentice_piece_displayed) out.push("SP84_forge_first_apprentice_piece");
  if (f.hellbox_rubbing_taken) out.push("SP85_hellbox_cipher_rubbing");
  if (f.eidolon_recorder_found && cycle === "longNight") out.push("SP86_eidolon_whisper_recorder");
  if (f.comms_key_fragment_filed) out.push("SP87_comms_array_key_fragment");
  if (f.lost_ring_armory && cycle === "dimming") out.push("SP88_lost_engagement_ring");
  if (f.degenerate_corner_visited) out.push("SP89_jack_of_swords_card");
  if (f.frozen_contraband_secured) out.push("SP90_cryo_frozen_contraband");

  return out;
}

function pickFilter(base: ArmoryBaseId): string | undefined {
  if (base === "AR-B03") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "AR-B05") return LIGHTING_FILTERS.cycle_dimming;
  if (base === "AR-B06") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "AR-B07") return LIGHTING_FILTERS.morality_dark;
  if (base === "AR-B13") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "AR-B14") return LIGHTING_FILTERS.tv_corrupted;
  return undefined;
}

export function resolveArmoryComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
