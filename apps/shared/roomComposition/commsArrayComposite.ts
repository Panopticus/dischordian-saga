/* ═══════════════════════════════════════════════════════
   COMMS ARRAY — composite resolver (Phase J)

   14 base renders + 90 sprite overlays.

   pickSprites emits a layered default stack (frequency wall +
   indicator + skylight + console + signal visualiser + operator
   chair + broadcast chairs + floor amplifier + doors + workspace
   + intercom + faction overlay) plus beat-specific overlays gated
   on narrative flags. 13 hotspots in ROOM_DEFINITIONS["comms-array"]
   are scoped via compositeScopes to specific sprite states (clue
   glows sp39-48, static screen sp49-52, Human-substrate sp74-77).
   ═══════════════════════════════════════════════════════ */

import { LIGHTING_FILTERS, deriveActTier, deriveCyclePhase, deriveIrlSeason, deriveTVInfection, factionHigh, moralityBand, trustBand } from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const COMMS_ARRAY_BASE_IDS = [
  "comms_array_base_act7_finale_silent",
  "comms_array_base_cycle_dawn",
  "comms_array_base_cycle_long_night",
  "comms_array_base_epoch_grand_edit",
  "comms_array_base_first_human_contact",
  "comms_array_base_initial",
  "comms_array_base_morality_dark",
  "comms_array_base_season_interregnum",
  "comms_array_base_shadow_tongue_voice_heard",
  "comms_array_base_signal_booster_installed",
  "comms_array_base_tv_corrupted",
  "comms_array_base_tv_exposed",
  "comms_array_base_tv_quarantined",
  "comms_array_base_tv_spreading",
] as const;

export const COMMS_ARRAY_SPRITE_IDS = [
  "sp01_frequency_wall_calm_baseline",
  "sp02_frequency_wall_amplified",
  "sp03_frequency_wall_active_transmission",
  "sp04_frequency_wall_lockout_red",
  "sp05_frequency_wall_silver_silent",
  "sp06_indicator_heartbeat_baseline",
  "sp07_indicator_amplified_wider",
  "sp08_indicator_sync_with_human",
  "sp09_indicator_indigo_halo",
  "sp10_indicator_dim_grey_silent",
  "sp11_skylight_dust_mote_storm",
  "sp12_em_aurora_active_truss",
  "sp13_skylight_dim_clouded",
  "sp14_console_data_flow_active",
  "sp15_console_archive_mode",
  "sp16_console_lockout_red",
  "sp17_console_glyph_corruption",
  "sp18_archive_terminal_browsing",
  "sp19_archive_drawer_open",
  "sp20_archive_terminal_red_lockout",
  "sp21_signal_visualiser_calm",
  "sp22_signal_visualiser_human_breathing",
  "sp23_signal_visualiser_indigo_spikes",
  "sp24_operator_chair_locke_silhouette",
  "sp25_operator_chair_headset_folded",
  "sp26_operator_chair_notebook_open",
  "sp27_broadcast_chairs_six_filled",
  "sp28_broadcast_chair_west1_hierarchy_robe",
  "sp29_broadcast_chair_east2_pirate",
  "sp30_broadcast_chair_west2_antiquarian_codex",
  "sp31_floor_amplifier_grate_glow",
  "sp32_floor_substrate_pulse",
  "sp33_floor_investigation_yellow_tape",
  "sp34_floor_cyan_tape_evidence_cart",
  "sp35_floor_quarantine_band",
  "sp36_door_bridge_corridor_open",
  "sp37_door_observation_hatch_open",
  "sp38_door_bridge_blackout_tape",
  "sp39_clue_charter_bell_log",
  "sp40_clue_severance_klessa",
  "sp41_clue_akai_voice_mid_hunt",
  "sp42_clue_vex_maestro_opening",
  "sp43_clue_watchers_first_trumpet",
  "sp44_clue_storm_voice_fragment",
  "sp45_clue_tarn_erasure_vote",
  "sp46_clue_akai_last_words",
  "sp47_clue_shadow_tongue_signal_trace",
  "sp48_clue_ocularum_relay_trace",
  "sp49_static_screen_baseline",
  "sp50_static_screen_indigo_flecks",
  "sp51_static_screen_voice_silhouette",
  "sp52_static_screen_voice_locked",
  "sp53_workspace_headset_on_console",
  "sp54_workspace_notebook_open",
  "sp55_workspace_coffee_mug_steam",
  "sp56_operator_pen_holder_pen_missing",
  "sp57_ear_sigil_warm_gold_glow",
  "sp58_ear_sigil_indigo_overstrike",
  "sp59_rf_warning_sign_flashing_amber",
  "sp60_broadcast_lockout_indicator_red",
  "sp61_intercom_panel_active_warm_amber",
  "sp62_atmo_ozone_haze_grate",
  "sp63_atmo_em_aurora_truss_cyan",
  "sp64_atmo_substrate_vapour_floor",
  "sp65_atmo_signal_threads_drift",
  "sp66_atmo_dust_motes_skylight",
  "sp67_faction_meme_prime_pirate_signal",
  "sp68_faction_authority_red_lattice",
  "sp69_faction_hierarchy_diamond",
  "sp70_faction_dreamer_iris_cyan",
  "sp71_faction_antiquarian_pressed_leaf",
  "sp72_locke_comms_feed_panel_active",
  "sp73_locke_comms_feed_double_authority",
  "sp74_human_silhouette_monitor",
  "sp75_human_silhouette_full_substrate",
  "sp76_human_voice_fragment",
  "sp77_human_signal_thread_to_indicator",
  "sp78_antenna_truss_signal_booster",
  "sp79_tournament_bracket_chip_console",
  "sp80_tournament_banner_truss",
  "sp81_hellbox3_chalk_spiral_floor",
  "sp82_irl_spring_pressed_violets",
  "sp83_irl_summer_brass_sun_mug",
  "sp84_irl_autumn_oak_bookmark",
  "sp85_irl_winter_frost_etching",
  "sp86_witness_glyph_fragmented",
  "sp87_witness_glyph_lucid_filament",
  "sp88_witness_glyph_luminous_three_anchors",
  "sp89_lore_egg_meme_prime_sos",
  "sp90_lore_shadow_tongue_signature_buffer",
] as const;

type CommsArrayBaseId = typeof COMMS_ARRAY_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): CommsArrayBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "comms_array");

if (f.first_human_contact) return "comms_array_base_first_human_contact";
  if (f.signal_booster_installed) return "comms_array_base_signal_booster_installed";
  if (f.shadow_tongue_voice_heard) return "comms_array_base_shadow_tongue_voice_heard";
  if (f.grand_edit_active) return "comms_array_base_epoch_grand_edit";
  if (tv === "quarantined") return "comms_array_base_tv_quarantined";
  if (tv === "corrupted") return "comms_array_base_tv_corrupted";
  if (tv === "spreading") return "comms_array_base_tv_spreading";
  if (tv === "exposed") return "comms_array_base_tv_exposed";
  if (tier >= 7) return "comms_array_base_act7_finale_silent";
  if (f.season_phase_interregnum) return "comms_array_base_season_interregnum";
  if (moralityBand(g.moralityScore) === "dark") return "comms_array_base_morality_dark";
  if (cycle === "longNight") return "comms_array_base_cycle_long_night";
  if (cycle === "dawn") return "comms_array_base_cycle_dawn";
  return "comms_array_base_initial";
}

function pickSprites(g: CompositeGameSlice, base: CommsArrayBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "comms_array");
  const tier = deriveActTier(g);
  const trust = trustBand(g.elaraTrust);
  const season = deriveIrlSeason(g);

  // L1 — frequency wall (mutex; gates frequency-wall hotspots)
  if (tv === "quarantined" || f.comms_array_broadcast_lockout) {
    out.push("sp04_frequency_wall_lockout_red");
  } else if (base === "comms_array_base_act7_finale_silent" || f.comms_array_silence_break) {
    out.push("sp05_frequency_wall_silver_silent");
  } else if (f.first_human_contact || f.comms_array_active_transmission) {
    out.push("sp03_frequency_wall_active_transmission");
  } else if (f.signal_booster_installed || base === "comms_array_base_signal_booster_installed") {
    out.push("sp02_frequency_wall_amplified");
  } else {
    out.push("sp01_frequency_wall_calm_baseline");
  }

  // L2 — heartbeat indicator (mutex; gates indicator hotspots)
  if (base === "comms_array_base_act7_finale_silent") {
    out.push("sp10_indicator_dim_grey_silent");
  } else if (f.shadow_tongue_active || base === "comms_array_base_shadow_tongue_voice_heard") {
    out.push("sp09_indicator_indigo_halo");
  } else if (f.first_human_contact) {
    out.push("sp08_indicator_sync_with_human");
  } else if (f.signal_booster_installed) {
    out.push("sp07_indicator_amplified_wider");
  } else {
    out.push("sp06_indicator_heartbeat_baseline");
  }

  // L3 — skylight (mutex by cycle / TV)
  if (cycle === "longNight" || tv === "corrupted") {
    out.push("sp13_skylight_dim_clouded");
  } else {
    out.push("sp11_skylight_dust_mote_storm");
  }
  // EM aurora on truss when the booster is online
  if (f.signal_booster_installed || base === "comms_array_base_signal_booster_installed") {
    out.push("sp12_em_aurora_active_truss");
  }

  // L4 — main console (mutex; gates training-console hotspot)
  if (tv === "corrupted") {
    out.push("sp17_console_glyph_corruption");
  } else if (f.comms_array_broadcast_lockout || tv === "quarantined") {
    out.push("sp16_console_lockout_red");
  } else if (f.comms_array_archive_browsing) {
    out.push("sp15_console_archive_mode");
  } else {
    out.push("sp14_console_data_flow_active");
  }

  // L5 — archive terminal (mutex)
  if (f.comms_array_broadcast_lockout || tv === "quarantined") {
    out.push("sp20_archive_terminal_red_lockout");
  } else if (f.comms_array_archive_drawer_open) {
    out.push("sp19_archive_drawer_open");
  } else {
    out.push("sp18_archive_terminal_browsing");
  }

  // L6 — signal visualiser (mutex)
  if (f.shadow_tongue_active || base === "comms_array_base_shadow_tongue_voice_heard") {
    out.push("sp23_signal_visualiser_indigo_spikes");
  } else if (f.first_human_contact) {
    out.push("sp22_signal_visualiser_human_breathing");
  } else {
    out.push("sp21_signal_visualiser_calm");
  }

  // L7 — operator chair (mutex)
  if (f.comms_array_locke_at_chair || f.npc_locke_present) {
    out.push("sp24_operator_chair_locke_silhouette");
  } else if (f.comms_array_notebook_open) {
    out.push("sp26_operator_chair_notebook_open");
  } else {
    out.push("sp25_operator_chair_headset_folded");
  }

  // L8 — broadcast chairs (additive — six fill by default, faction
  // specific occupants overlay)
  out.push("sp27_broadcast_chairs_six_filled");
  if (factionHigh(g, "hierarchy")) out.push("sp28_broadcast_chair_west1_hierarchy_robe");
  if (f.late_night_tv_unlocked || f.faction_championed_meme_prime) out.push("sp29_broadcast_chair_east2_pirate");
  if (factionHigh(g, "antiquarian")) out.push("sp30_broadcast_chair_west2_antiquarian_codex");

  // L9 — floor (amplifier grate always-on; substrate pulse on infection;
  // investigation tape additive)
  out.push("sp31_floor_amplifier_grate_glow");
  if (tv === "corrupted" || tv === "spreading" || f.shadow_tongue_active) {
    out.push("sp32_floor_substrate_pulse");
  }
  if (f.comms_array_investigation_active) {
    out.push("sp33_floor_investigation_yellow_tape");
    if (f.comms_array_evidence_cart) out.push("sp34_floor_cyan_tape_evidence_cart");
  }
  if (tv === "quarantined") out.push("sp35_floor_quarantine_band");

  // L10 — doors (mutex on bridge corridor open/closed; observation hatch
  // additive)
  if (tv === "quarantined" || f.comms_array_bridge_blackout) {
    out.push("sp38_door_bridge_blackout_tape");
  } else if (f.comms_array_bridge_corridor_open || base === "comms_array_base_initial") {
    out.push("sp36_door_bridge_corridor_open");
  }
  if (f.comms_array_observation_hatch_open) out.push("sp37_door_observation_hatch_open");

  // L11 — clue glows (12 mystery rects — each gated on its narrative
  // beat being active. The corresponding hotspots in ROOM_DEFINITIONS
  // have compositeScopes that match.)
  if (f.charter_bell_log_visible || f.comms_array_clue_charter_bell_log) out.push("sp39_clue_charter_bell_log");
  if (f.severance_klessa_visible || f.comms_array_clue_severance_klessa) out.push("sp40_clue_severance_klessa");
  if (f.akai_voice_mid_hunt_visible || f.comms_array_clue_akai_voice_mid_hunt) out.push("sp41_clue_akai_voice_mid_hunt");
  if (f.vex_maestro_opening_visible || f.comms_array_clue_vex_maestro_opening) out.push("sp42_clue_vex_maestro_opening");
  if (f.watchers_first_trumpet_visible || f.comms_array_clue_watchers_first_trumpet) out.push("sp43_clue_watchers_first_trumpet");
  if (f.storm_voice_fragment_visible || f.comms_array_clue_storm_voice_fragment) out.push("sp44_clue_storm_voice_fragment");
  if (f.tarn_erasure_vote_visible || f.comms_array_clue_tarn_erasure_vote) out.push("sp45_clue_tarn_erasure_vote");
  if (f.akai_last_words_visible || f.comms_array_clue_akai_last_words) out.push("sp46_clue_akai_last_words");
  if (f.shadow_tongue_signal_trace_visible || f.comms_array_clue_shadow_tongue_signal_trace) out.push("sp47_clue_shadow_tongue_signal_trace");
  if (f.ocularum_relay_trace_visible || f.comms_array_clue_ocularum_relay_trace) out.push("sp48_clue_ocularum_relay_trace");

  // L12 — static screen (mutex; the static-screen + voice-in-the-static
  // hotspots scope to sp49-52)
  if (f.comms_array_voice_locked) {
    out.push("sp52_static_screen_voice_locked");
  } else if (f.comms_array_voice_silhouette) {
    out.push("sp51_static_screen_voice_silhouette");
  } else if (f.shadow_tongue_active || base === "comms_array_base_shadow_tongue_voice_heard") {
    out.push("sp50_static_screen_indigo_flecks");
  } else {
    out.push("sp49_static_screen_baseline");
  }

  // L13 — workspace surface dressings (additive)
  if (f.comms_array_workspace_active) {
    out.push("sp53_workspace_headset_on_console");
    out.push("sp54_workspace_notebook_open");
  }
  if (f.comms_array_mug_steam) out.push("sp55_workspace_coffee_mug_steam");
  if (f.comms_array_pen_missing) out.push("sp56_operator_pen_holder_pen_missing");

  // L14 — ear sigil (mutex)
  if (tv === "corrupted" || f.shadow_tongue_active) {
    out.push("sp58_ear_sigil_indigo_overstrike");
  } else if (trust === "luminous" || tier >= 5) {
    out.push("sp57_ear_sigil_warm_gold_glow");
  }

  // L15 — warning + lockout indicators
  if (f.comms_array_rf_warning_active) out.push("sp59_rf_warning_sign_flashing_amber");
  if (f.comms_array_broadcast_lockout || tv === "quarantined") out.push("sp60_broadcast_lockout_indicator_red");
  if (f.comms_array_intercom_active) out.push("sp61_intercom_panel_active_warm_amber");

  // L16 — atmosphere (additive blend)
  if (cycle === "balanced" || tv === "spreading") out.push("sp62_atmo_ozone_haze_grate");
  if (f.signal_booster_installed) out.push("sp63_atmo_em_aurora_truss_cyan");
  if (tv === "corrupted" || tv === "spreading") out.push("sp64_atmo_substrate_vapour_floor");
  if (f.signal_booster_installed || f.first_human_contact) out.push("sp65_atmo_signal_threads_drift");
  if (cycle === "dawn") out.push("sp66_atmo_dust_motes_skylight");

  // L17 — faction overlays (additive — flags additive, each adds its own
  // signature when championed)
  if (f.faction_championed_meme_prime || f.late_night_tv_unlocked) out.push("sp67_faction_meme_prime_pirate_signal");
  if (factionHigh(g, "authority")) out.push("sp68_faction_authority_red_lattice");
  if (factionHigh(g, "hierarchy")) out.push("sp69_faction_hierarchy_diamond");
  if (factionHigh(g, "dreamers")) out.push("sp70_faction_dreamer_iris_cyan");
  if (factionHigh(g, "antiquarian")) out.push("sp71_faction_antiquarian_pressed_leaf");

  // L18 — Locke feed panel (additive; faction:authority championed
  // doubles the feed)
  if (f.comms_array_locke_feed_active || f.npc_locke_present) {
    if (factionHigh(g, "authority") || f.locke_double_feed) {
      out.push("sp73_locke_comms_feed_double_authority");
    } else {
      out.push("sp72_locke_comms_feed_panel_active");
    }
  }

  // L19 — Human (substrate) layers — the npc-the-human hotspot scopes
  // to sp74-77; the Human appears when the substrate decides to be heard
  if (f.npc_the_human_present || f.first_human_contact) {
    out.push("sp74_human_silhouette_monitor");
    if (f.human_full_manifestation) out.push("sp75_human_silhouette_full_substrate");
    if (f.human_voice_fragment_audible) out.push("sp76_human_voice_fragment");
    if (f.human_signal_thread_visible) out.push("sp77_human_signal_thread_to_indicator");
  }

  // L20 — antenna truss booster (only when installed)
  if (f.signal_booster_installed || base === "comms_array_base_signal_booster_installed") {
    out.push("sp78_antenna_truss_signal_booster");
  }

  // L21 — tournament artefacts (event-gated additive)
  if (f.tournament_active) {
    out.push("sp79_tournament_bracket_chip_console");
    out.push("sp80_tournament_banner_truss");
  }
  if (f.hellbox3_active) out.push("sp81_hellbox3_chalk_spiral_floor");

  // L22 — IRL season dressing (mutex)
  if (season === "spring") out.push("sp82_irl_spring_pressed_violets");
  else if (season === "summer") out.push("sp83_irl_summer_brass_sun_mug");
  else if (season === "autumn") out.push("sp84_irl_autumn_oak_bookmark");
  else if (season === "winter") out.push("sp85_irl_winter_frost_etching");

  // L23 — witness glyph (mutex by trust band)
  if (trust === "luminous") out.push("sp88_witness_glyph_luminous_three_anchors");
  else if (trust === "lucid") out.push("sp87_witness_glyph_lucid_filament");
  else if (trust === "fragmented") out.push("sp86_witness_glyph_fragmented");

  // L24 — easter eggs (flag-gated)
  if (f.meme_prime_sos_unlocked) out.push("sp89_lore_egg_meme_prime_sos");
  if (f.shadow_tongue_signature_buffer_unlocked) out.push("sp90_lore_shadow_tongue_signature_buffer");

  return out;
}

function pickFilter(base: CommsArrayBaseId): string | undefined {
  if (base === "comms_array_base_cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "comms_array_base_cycle_long_night") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "comms_array_base_epoch_grand_edit") return LIGHTING_FILTERS.epoch_grand_edit;
  if (base === "comms_array_base_morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "comms_array_base_season_interregnum") return LIGHTING_FILTERS.season_interregnum;
  if (base === "comms_array_base_tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "comms_array_base_tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  return undefined;
}

export function resolveCommsArrayComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
