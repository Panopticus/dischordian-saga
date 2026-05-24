/* ═══════════════════════════════════════════════════════
   ROOM COMPOSITION — resolver unit tests (Phase J)

   Pin every load-bearing axis on every room. Failures here
   mean a flag rename / state shift broke a render path.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  COMPOSITE_ASSET_CATALOG,
  COMPOSITE_ROOM_S3_DIR,
  hasRoomComposite,
  resolveBridgeComposite,
  resolveCryoBayComposite,
  resolveEngineeringComposite,
  resolveMedicalBayComposite,
  resolveRoomComposite,
  resolveRoomCompositeUrls,
  type CompositeGameSlice,
} from "../roomComposition";
import { deriveActTier, deriveCyclePhase, deriveIrlSeason, deriveTVInfection, factionHigh } from "../roomComposition/types";
import { PUBLIC_ASSET_BASE } from "../lib/assetUrl";

const emptyGame: CompositeGameSlice = { narrativeFlags: {} };

const game = (overrides: Partial<CompositeGameSlice>): CompositeGameSlice => ({
  narrativeFlags: {},
  ...overrides,
});

describe("roomComposition / facade", () => {
  it("identifies the four composite rooms", () => {
    expect(hasRoomComposite("bridge")).toBe(true);
    expect(hasRoomComposite("cryo-bay")).toBe(true);
    expect(hasRoomComposite("medical-bay")).toBe(true);
    expect(hasRoomComposite("engineering")).toBe(true);
    expect(hasRoomComposite("observation-deck")).toBe(false);
  });

  it("returns null for unsupported rooms", () => {
    expect(resolveRoomComposite("archives", emptyGame)).toBeNull();
    expect(resolveRoomComposite("observation-deck", emptyGame)).toBeNull();
  });

  it("emits CDN absolute URLs for base + every sprite", () => {
    const urls = resolveRoomCompositeUrls("bridge", emptyGame);
    expect(urls).not.toBeNull();
    expect(urls!.base.startsWith(PUBLIC_ASSET_BASE)).toBe(true);
    for (const u of urls!.sprites) {
      expect(u.startsWith(PUBLIC_ASSET_BASE)).toBe(true);
      expect(u.endsWith(".png")).toBe(true);
    }
  });

  it("never emits sprite ids that aren't in the per-room catalog", () => {
    for (const roomId of ["bridge", "cryo-bay", "medical-bay", "engineering"] as const) {
      const catalog = COMPOSITE_ASSET_CATALOG[roomId];
      const baseSet = new Set<string>(catalog.bases);
      const spriteSet = new Set<string>(catalog.sprites);
      // Run a battery of canned game states; every emitted asset id must
      // live in the catalog so the runtime never points at a 404.
      const probes: CompositeGameSlice[] = [
        emptyGame,
        game({ moralityScore: -50 }),
        game({ moralityScore: 50 }),
        game({ elaraTrust: 5 }),
        game({ elaraTrust: 90 }),
        game({ narrativeFlags: { grand_edit_active: true } }),
        game({ narrativeFlags: { tv_infection_quarantined: true } }),
        game({ narrativeFlags: { tv_infection_corrupted: true } }),
        game({ narrativeFlags: { cycle_phase_long_night: true } }),
        game({ narrativeFlags: { cycle_phase_dawn: true } }),
        game({ narrativeFlags: { cycle_phase_dimming: true } }),
        game({ narrativeFlags: { season_phase_interregnum: true } }),
        game({ narrativeFlags: { season_phase_prologue: true } }),
        game({ narrativeFlags: { act_tier_5_reached: true } }),
        game({ narrativeFlags: { act_tier_7_reached: true } }),
        game({ narrativeFlags: { cades_kael_present: true } }),
        game({ narrativeFlags: { hellbox3_palimpsest: true } }),
        game({ narrativeFlags: { tournament_finals_window: true } }),
        game({ irlSeason: "spring" }),
        game({ irlSeason: "winter" }),
        game({ factionReputation: { authority: 90 } }),
        game({ factionReputation: { insurgency: 90 } }),
        game({ factionReputation: { antiquarian: 90 } }),
        game({ factionReputation: { substrate_rebels: 90 } }),
      ];
      for (const probe of probes) {
        const c = resolveRoomComposite(roomId, probe);
        expect(c).not.toBeNull();
        expect(baseSet.has(c!.base)).toBe(true);
        for (const s of c!.sprites) {
          expect(spriteSet.has(s)).toBe(true);
        }
      }
    }
  });
});

describe("roomComposition / bridge", () => {
  it("defaults to t0 dormant with no flags", () => {
    const c = resolveBridgeComposite(emptyGame);
    expect(c.base).toBe("bridge_base_t0_dormant");
    // Dormant: no Elara composited.
    expect(c.sprites.some((s) => s.includes("elara"))).toBe(false);
  });

  it("flips to activated when fast_travel_unlocked is set", () => {
    const c = resolveBridgeComposite(game({ narrativeFlags: { fast_travel_unlocked: true } }));
    expect(c.base).toBe("bridge_base_t2_activated");
    // Activated: Elara default pose appears.
    expect(c.sprites).toContain("sp51_elara_default");
  });

  it("flips to t3 restored when bridge_war_table_online", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true, bridge_war_table_online: true },
    }));
    expect(c.base).toBe("bridge_base_t3_restored");
  });

  it("Act 6 chair tilt overrides activated when senator-voss flag set", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: {
        fast_travel_unlocked: true,
        discovered_elara_is_senator_voss: true,
      },
    }));
    expect(c.base).toBe("bridge_base_t2_act6_chair_tilted");
    // Lore-discovery glyph composites on the pedestal.
    expect(c.sprites).toContain("sp36_pedestal_panopticon_eye_glyph");
  });

  it("Act 7 finale removes Elara and shows folded chess", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true, act_tier_7_reached: true },
    }));
    expect(c.base).toBe("bridge_base_t2_act7_finale");
    expect(c.sprites.some((s) => s.includes("elara"))).toBe(false);
    expect(c.sprites).toContain("sp30_chess_act7_folded");
  });

  it("CADES presence swaps Elara to flickering and adds CADES sprites", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true, cades_kael_present: true },
    }));
    expect(c.sprites).toContain("sp56_elara_cades_flickering");
    expect(c.sprites).toContain("sp48_cades_dischordia_card");
    expect(c.sprites).toContain("sp49_cades_chair_warm_impression");
    expect(c.sprites).toContain("sp50_cades_agent_zero_station_cleaned");
  });

  it("authority high adds banner, comms double-panel, compass lattice, pawn", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true },
      factionReputation: { authority: 90 },
    }));
    expect(c.sprites).toContain("sp01_banner_authority");
    expect(c.sprites).toContain("sp09_comms_locke_panel_double");
    expect(c.sprites).toContain("sp26_floor_compass_authority_lattice");
    expect(c.sprites).toContain("sp34_chess_authority_pawn_on_rail");
  });

  it("IRL season swaps the chandelier dressing", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true },
      irlSeason: "winter",
    }));
    expect(c.sprites).toContain("sp47_chandelier_irl_winter");
    expect(c.sprites).not.toContain("sp44_chandelier_irl_spring");
  });

  it("grand edit base wins over TV state and act tier", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: {
        fast_travel_unlocked: true,
        grand_edit_active: true,
        tv_infection_corrupted: true,
        act_tier_7_reached: true,
      },
    }));
    expect(c.base).toBe("bridge_base_t2_epoch_grand_edit");
  });

  it("cycle long_night applies lighting filter", () => {
    const c = resolveBridgeComposite(game({
      narrativeFlags: { fast_travel_unlocked: true, cycle_phase_long_night: true },
    }));
    expect(c.base).toBe("bridge_base_t2_cycle_long_night");
    expect(c.baseLightingFilter).toBeDefined();
  });
});

describe("roomComposition / cryoBay", () => {
  it("defaults to initial state with no flags", () => {
    const c = resolveCryoBayComposite(emptyGame);
    expect(c.base).toBe("cryo_bay_base_initial");
  });

  it("long_sleep_ending wins over every other base", () => {
    const c = resolveCryoBayComposite(game({
      narrativeFlags: {
        long_sleep_ending: true,
        tv_infection_corrupted: true,
        cycle_phase_long_night: true,
        act_tier_7_reached: true,
      },
    }));
    expect(c.base).toBe("cryo_bay_base_long_sleep_ending");
  });

  it("investigation tier resolves cryo-mystery flags", () => {
    const c = resolveCryoBayComposite(game({
      narrativeFlags: { cryo_mystery_first_clue_found: true },
    }));
    expect(c.sprites).toContain("sp15_dead_pod_glass_condensed_silhouette");
    expect(c.sprites).toContain("sp21_torn_id_tag_floor");
    expect(c.sprites).toContain("sp23_data_slate_under_pod");
  });

  it("victim identified opens the Med Bay door", () => {
    const c = resolveCryoBayComposite(game({
      narrativeFlags: {
        cryo_mystery_first_clue_found: true,
        cryo_mystery_victim_identified: true,
      },
    }));
    expect(c.sprites).toContain("sp01_med_bay_door_amber");
    expect(c.sprites).toContain("sp16_dead_pod_glass_wiped_oval");
    expect(c.sprites).toContain("sp24_diagnostic_cart_consolidated");
  });

  it("per-candle lit/extinguished flags add the matching sprite", () => {
    const c = resolveCryoBayComposite(game({
      narrativeFlags: {
        cryo_candle_west_1_lit: true,
        cryo_candle_east_3_extinguished: true,
      },
    }));
    expect(c.sprites).toContain("sp31_candle_lit_west_1");
    expect(c.sprites).toContain("sp42_candle_smoke_east_3");
  });

  it("Vex woken composites her empty pod", () => {
    const c = resolveCryoBayComposite(game({
      narrativeFlags: { vex_woken: true },
    }));
    expect(c.sprites).toContain("sp06_pod9_vex_empty");
  });
});

describe("roomComposition / medicalBay", () => {
  it("defaults to initial state with the panel ajar", () => {
    const c = resolveMedicalBayComposite(emptyGame);
    expect(c.base).toBe("medical_bay_base_initial");
    expect(c.sprites).toContain("sp01_panel_ajar_30_device_sliver");
    expect(c.sprites).toContain("sp05_readout_idle_cyan_pulse");
  });

  it("device awakened flips panel + readout sprites", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { medbay_device_awakened: true },
    }));
    expect(c.sprites).toContain("sp02_panel_open_device_awakened");
    expect(c.sprites).toContain("sp06_readout_ready_warm_gold_glyph");
  });

  it("donated swaps to donated panel + receipt plate", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { medbay_device_awakened: true, donated_dna_sample: true },
    }));
    expect(c.sprites).toContain("sp03_panel_open_device_donated");
    expect(c.sprites).toContain("sp19_autoclave_dna_receipt_plate");
  });

  it("refused swaps to closed panel", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { medbay_device_awakened: true, refused_dna_sample: true },
    }));
    expect(c.sprites).toContain("sp04_panel_closed_hairline_seam");
  });

  it("morality dark reverses helix to lavender + picks dark base", () => {
    const c = resolveMedicalBayComposite(game({ moralityScore: -75 }));
    expect(c.base).toBe("medical_bay_base_morality_dark");
    expect(c.sprites).toContain("sp13_helix_reversed_lavender");
  });

  it("HB1 transit wins as base + composites the petal burst overlay", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { hellbox1_transit_active: true },
    }));
    expect(c.base).toBe("medical_bay_base_hellbox1_transit");
    expect(c.sprites).toContain("sp30_apsidal_glass_hb1_petal_burst");
    expect(c.sprites).toContain("sp08_readout_red_glyph_alarm");
  });

  it("Vex hits inner-circle pose at high trust", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { vex_woken: true },
      elaraTrust: 90,
    }));
    expect(c.sprites).toContain("sp48_vex_inner_circle_unmasked");
  });

  it("source-is-kael lore swaps voice anchor + adds static", () => {
    const c = resolveMedicalBayComposite(game({
      narrativeFlags: { discovered_the_source_is_kael: true },
    }));
    expect(c.sprites).toContain("sp54_source_anchor_apsidal");
    expect(c.sprites).toContain("sp78_lore_source_is_kael_voidblack_static");
  });
});

describe("roomComposition / engineering", () => {
  it("defaults to t0 dormant with no flags", () => {
    const c = resolveEngineeringComposite(emptyGame);
    expect(c.base).toBe("engineering_base_t0_dormant");
    // Dormant: ley-lines flicker, reactor cold-grey, gauge stalled,
    // workbench unfinished, blueprint dark, research dim.
    expect(c.sprites).toContain("sp01_ley_lines_intermittent_flicker");
    expect(c.sprites).toContain("sp04_reactor_cold_grey_weak");
    expect(c.sprites).toContain("sp09_capacity_gauge_stalled_partial");
    expect(c.sprites).toContain("sp33_bench_unfinished_tools_fanned");
    expect(c.sprites).toContain("sp26_blueprint_dark");
    expect(c.sprites).toContain("sp30_research_dim_standby");
    expect(c.sprites).toContain("sp69_cogsworth_absent");
  });

  it("flips to t2 activated when signal booster is built", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: { engineering_signal_booster_built: true },
    }));
    expect(c.base).toBe("engineering_base_t2_activated");
    expect(c.sprites).toContain("sp02_ley_lines_solid_bright_circuit");
    expect(c.sprites).toContain("sp05_reactor_stable_warm_lavender");
    expect(c.sprites).toContain("sp34_bench_signal_booster_finished");
    expect(c.sprites).toContain("sp27_blueprint_single_card_schematic");
    expect(c.sprites).toContain("sp31_research_active_warm_gold");
  });

  it("flips to t3 restored when research bench is online", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        engineering_research_bench_online: true,
      },
    }));
    expect(c.base).toBe("engineering_base_t3_restored");
    expect(c.sprites).toContain("sp03_ley_lines_wrap_reactor_ring");
    expect(c.sprites).toContain("sp06_reactor_full_lavender_green_ring");
    expect(c.sprites).toContain("sp11_capacity_gauge_maximum");
    expect(c.sprites).toContain("sp32_research_experiment_rig_lattice");
    expect(c.sprites).toContain("sp22_tool_rack_east_full_t3");
  });

  it("HB4 transit base wins and composites the partial dissolution overlay", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        hellbox_4_transit_active: true,
      },
    }));
    expect(c.base).toBe("engineering_base_hb4_transit");
    expect(c.sprites).toContain("sp71_hb4_workbench_partial_dissolution");
  });

  it("reactor critical alert paints red strobes + critical gauge", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        reactor_critical_alert: true,
      },
    }));
    expect(c.sprites).toContain("sp07_reactor_red_alert_flickering");
    expect(c.sprites).toContain("sp12_capacity_gauge_critical_red");
    expect(c.sprites).toContain("sp20_warning_strobes_red_alert");
    expect(c.sprites).toContain("sp50_mezz1_reactor_console_amber");
  });

  it("Act 7 green-saved swaps the reactor to stable green + finale Cogsworth", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: { act_tier_7_reached: true, reactor_maintained: true },
    }));
    expect(c.base).toBe("engineering_base_act7_green_saved");
    expect(c.sprites).toContain("sp08_reactor_green_stable_saved");
    expect(c.sprites).toContain("sp37_bench_act7_cleaned_honour");
    expect(c.sprites).toContain("sp74_cogsworth_seated_finale");
  });

  it("Act 7 red-cascade removes Cogsworth + adds spark cascade", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: { act_tier_7_reached: true, reactor_neglected: true },
    }));
    expect(c.base).toBe("engineering_base_act7_red_cascade");
    expect(c.sprites).toContain("sp66_sparks_forge_door_cascade");
    expect(c.sprites).toContain("sp69_cogsworth_absent");
  });

  it("shadow tongue power composites the schematic indigo edit + wraith smear", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        shadow_tongue_power_40: true,
      },
    }));
    expect(c.sprites).toContain("sp42_schematic_pad_indigo_overlay");
    expect(c.sprites).toContain("sp75_wraith_smear_corner");
  });

  it("grand edit overstamps the manual page", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: { grand_edit_active: true },
    }));
    expect(c.base).toBe("engineering_base_epoch_grand_edit");
    expect(c.sprites).toContain("sp47_manual_page_47_overstamped_indigo");
  });

  it("Mechronis Academy mastery flips the blueprint projector", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        unlock_mechronis_academy_mastery: true,
      },
    }));
    expect(c.sprites).toContain("sp29_blueprint_mechronis_class_notation");
  });

  it("Cogsworth diagnostic pose fires under pod-zero anomaly", () => {
    const c = resolveEngineeringComposite(game({
      narrativeFlags: {
        engineering_signal_booster_built: true,
        act_tier_5_reached: true,
        pod_zero_anomaly_visible: true,
      },
    }));
    expect(c.sprites).toContain("sp52_mezz2_pod_zero_anomaly");
    expect(c.sprites).toContain("sp73_cogsworth_at_mezzanine_diagnostic");
  });
});

describe("roomComposition / derive bridges", () => {
  it("deriveActTier bridges the existing act_N_complete flag family", () => {
    // act_1_complete → reached tier 2 (you finished Act 1, now in Act 2).
    expect(deriveActTier(game({ narrativeFlags: { act_1_complete: true } }))).toBe(2);
    expect(deriveActTier(game({ narrativeFlags: { act_5_complete: true } }))).toBe(6);
    // Act 6 complete reads as tier 7 (final state); Act 7 complete also caps at 7.
    expect(deriveActTier(game({ narrativeFlags: { act_6_complete: true } }))).toBe(7);
    expect(deriveActTier(game({ narrativeFlags: { act_7_complete: true } }))).toBe(7);
  });

  it("deriveActTier prefers explicit act_tier_N_reached override", () => {
    expect(
      deriveActTier(
        game({
          narrativeFlags: { act_1_complete: true, act_tier_5_reached: true },
        }),
      ),
    ).toBe(5);
  });

  it("deriveCyclePhase falls back to the wall-clock when no flag override", () => {
    // Midday on the wall clock — no flag override — should read as the
    // balanced default phase.
    const midday = new Date("2026-05-24T12:00:00");
    expect(deriveCyclePhase(emptyGame, midday)).toBe("balanced");
    // 03:00 → nightwatch → "longNight".
    const night = new Date("2026-05-24T03:00:00");
    expect(deriveCyclePhase(emptyGame, night)).toBe("longNight");
    // Dawn flag still wins.
    expect(
      deriveCyclePhase(
        game({ narrativeFlags: { cycle_phase_dawn: true } }),
        night,
      ),
    ).toBe("dawn");
  });

  it("deriveTVInfection bridges the Phase H axis 9 resolver via zipDir", () => {
    // No flag, no zipDir → clean.
    expect(deriveTVInfection(emptyGame)).toBe("clean");
    // Global tv_phase_2 → spreading via Phase H resolver.
    expect(
      deriveTVInfection(
        game({ narrativeFlags: { tv_phase_2: true } }),
        "cryo_bay",
      ),
    ).toBe("spreading");
    // Per-room override wins.
    expect(
      deriveTVInfection(
        game({ narrativeFlags: { room_cryo_bay_tv_quarantined: true } }),
        "cryo_bay",
      ),
    ).toBe("quarantined");
    // Direct tv_infection_* flag still wins highest priority.
    expect(
      deriveTVInfection(
        game({
          narrativeFlags: {
            tv_infection_corrupted: true,
            tv_phase_1: true,
          },
        }),
        "cryo_bay",
      ),
    ).toBe("corrupted");
  });

  it("act_N_complete from existing game logic drives the act-7 finale base", () => {
    // Bridge: act_6_complete → tier 7 → t2_act7_finale base picks.
    const c = resolveBridgeComposite(
      game({
        narrativeFlags: {
          fast_travel_unlocked: true,
          act_6_complete: true,
        },
      }),
    );
    expect(c.base).toBe("bridge_base_t2_act7_finale");
  });

  it("deriveIrlSeason maps wall-clock month → season", () => {
    expect(deriveIrlSeason(emptyGame, new Date("2026-04-15"))).toBe("spring");
    expect(deriveIrlSeason(emptyGame, new Date("2026-07-15"))).toBe("summer");
    expect(deriveIrlSeason(emptyGame, new Date("2026-10-15"))).toBe("autumn");
    expect(deriveIrlSeason(emptyGame, new Date("2026-01-15"))).toBe("winter");
    // Explicit override wins.
    expect(deriveIrlSeason(game({ irlSeason: "winter" }), new Date("2026-07-15"))).toBe("winter");
    // No clock + no flag → undefined (no IRL trinket composited).
    expect(deriveIrlSeason(emptyGame)).toBeUndefined();
  });

  it("factionHigh bridges to canonical faction.ts ids", () => {
    // GameContext default factionReputation keys: empire / insurgency / independent / pirate.
    expect(factionHigh(game({ factionReputation: { empire: 90 } }), "authority")).toBe(true);
    // Canonical id from apps/shared/factions.ts.
    expect(factionHigh(game({ factionReputation: { new_babylon: 80 } }), "authority")).toBe(true);
    // Canonical Architect Remnants → "antiquarian" lore alias.
    expect(
      factionHigh(game({ factionReputation: { architect_remnants: 88 } }), "antiquarian"),
    ).toBe(true);
    // Dreamers Children → "dreamers" alias.
    expect(
      factionHigh(game({ factionReputation: { dreamers_children: 90 } }), "dreamers"),
    ).toBe(true);
    // Below threshold → false.
    expect(factionHigh(game({ factionReputation: { empire: 60 } }), "authority")).toBe(false);
  });

  it("factionHigh bridges to the faction:championed:<id> public flag", () => {
    // The factionStandingService writes `faction:championed:<id>` when
    // a player crosses +75 — the resolver should respect that even when
    // numeric reputation isn't tracked client-side.
    expect(
      factionHigh(
        game({ narrativeFlags: { "faction:championed:new_babylon": true } }),
        "authority",
      ),
    ).toBe(true);
    expect(
      factionHigh(
        game({ narrativeFlags: { "faction:championed:architect_remnants": true } }),
        "antiquarian",
      ),
    ).toBe(true);
    expect(
      factionHigh(
        game({ narrativeFlags: { "faction:championed:dreamers_children": true } }),
        "dreamers",
      ),
    ).toBe(true);
  });

  it("Phase H tv_phase global flag bleeds through to the bridge resolver", () => {
    const c = resolveBridgeComposite(
      game({ narrativeFlags: { fast_travel_unlocked: true, tv_phase_3: true } }),
    );
    expect(c.base).toBe("bridge_base_t2_tv_corrupted");
  });
});

describe("roomComposition / asset path convention", () => {
  it("encodes the room id with the canonical S3 directory mapping", () => {
    expect(COMPOSITE_ROOM_S3_DIR["bridge"]).toBe("bridge");
    expect(COMPOSITE_ROOM_S3_DIR["cryo-bay"]).toBe("cryo_bay");
    expect(COMPOSITE_ROOM_S3_DIR["medical-bay"]).toBe("medical_bay");
    expect(COMPOSITE_ROOM_S3_DIR["engineering"]).toBe("engineering");
  });

  it("emits base URLs under base/ and sprite URLs under sprites/", () => {
    const urls = resolveRoomCompositeUrls("cryo-bay", emptyGame);
    expect(urls!.base).toContain("/art/rooms/cryo_bay/base/");
    expect(urls!.base).toContain("cryo_bay_base_initial.png");
    for (const s of urls!.sprites) {
      expect(s).toContain("/art/rooms/cryo_bay/sprites/");
    }
  });
});
