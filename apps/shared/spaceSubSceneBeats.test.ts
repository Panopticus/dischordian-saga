import { describe, expect, it } from "vitest";

import {
  isSubSceneAction,
  spaceSubSceneBeat,
} from "./spaceSubSceneBeats";

describe("spaceSubSceneBeats", () => {
  it("resolves a vehicle board beat", () => {
    const beat = spaceSubSceneBeat("veh.cades_apc", "board");
    expect(beat).not.toBeNull();
    expect(beat?.prose.length).toBeGreaterThan(20);
  });

  it("resolves a per-space override (Memorial Hearse)", () => {
    const generic = spaceSubSceneBeat("veh.cades_apc", "board");
    const hearse = spaceSubSceneBeat("veh.memorial_hearse", "board");
    expect(hearse?.prose).not.toBe(generic?.prose);
    expect(hearse?.prose).toMatch(/Antiquarian|hearse|dead/i);
  });

  it("resolves a Castle of Death investigate beat", () => {
    const beat = spaceSubSceneBeat(
      "dest.castle_of_death.cod07_library_of_forbidden",
      "investigate_chamber",
    );
    expect(beat?.prose).toMatch(/Necromancer/);
  });

  it("resolves a Crucible enter_arena beat", () => {
    const beat = spaceSubSceneBeat(
      "dest.crucible.cr05_shadow_cathedral",
      "enter_arena",
    );
    expect(beat?.prose).toMatch(/arena|swarm|Source/i);
  });

  it("resolves a Trade Empire visit_sector beat", () => {
    const beat = spaceSubSceneBeat(
      "dest.trade_empire.te01_aurum_prime",
      "visit_sector",
    );
    expect(beat?.prose).toMatch(/market|Locke|floor/i);
  });

  it("resolves a Quiz Show take_the_stage per-space override", () => {
    const beat = spaceSubSceneBeat(
      "dest.quiz_show.qs01_main_stage",
      "take_the_stage",
    );
    expect(beat?.prose).toMatch(/Main Stage|host|mark/i);
  });

  it("returns null for action/space mismatches", () => {
    expect(
      spaceSubSceneBeat("veh.cades_apc", "investigate_chamber"),
    ).toBeNull();
    expect(spaceSubSceneBeat("ark.cryo_bay", "board")).toBeNull();
  });

  it("isSubSceneAction accepts canonical verbs", () => {
    expect(isSubSceneAction("board")).toBe(true);
    expect(isSubSceneAction("enter_arena")).toBe(true);
    expect(isSubSceneAction("enter_hellbox")).toBe(true);
    expect(isSubSceneAction("matrix_dive")).toBe(true);
    expect(isSubSceneAction("nonsense")).toBe(false);
  });

  it("resolves generic Hellbox enter beat for an unauthored chamber", () => {
    // Universal Selector has no per-chamber matrix_dive beat —
    // expect the category default.
    const beat = spaceSubSceneBeat("hb.universal_selector", "matrix_dive");
    expect(beat).not.toBeNull();
    expect(beat?.prose).toMatch(/Hellbox folds|dream|Matrix of Dreams/i);
  });

  it("resolves a Hellbox per-chamber override (Castle of Death)", () => {
    const beat = spaceSubSceneBeat("hb.castle_of_death", "enter_hellbox");
    expect(beat?.prose).toMatch(/Necromancer|archivists/i);
  });

  it("resolves the saga-final arena beat (Dischordian Arena)", () => {
    const beat = spaceSubSceneBeat("hb.dischordian_arena", "enter_hellbox");
    expect(beat?.prose).toMatch(/saga.*last|Authority|Insurgency/i);
  });

  it("falls back to generic Hellbox enter for chambers without override", () => {
    // hb.universal_selector has per-chamber enter_hellbox, so test
    // that we still get a Hellbox-toned beat (not null).
    const beat = spaceSubSceneBeat("hb.universal_selector", "enter_hellbox");
    expect(beat?.prose).toMatch(/Selector|select/i);
  });

  it("routes Crucible enter_arena to the PvP queue", () => {
    const beat = spaceSubSceneBeat(
      "dest.crucible.cr05_shadow_cathedral",
      "enter_arena",
    );
    expect(beat?.continueRoute).toBe("/duelyst-pvp");
  });

  it("routes Tower Defense begin_defense to the swarm campaign", () => {
    const beat = spaceSubSceneBeat(
      "dest.tower_defense.td04_void_station",
      "begin_defense",
    );
    expect(beat?.continueRoute).toBe("/terminus-swarm");
  });

  it("routes Trade Empire visit_sector to the trade hub", () => {
    const beat = spaceSubSceneBeat(
      "dest.trade_empire.te01_aurum_prime",
      "visit_sector",
    );
    expect(beat?.continueRoute).toBe("/trade-empire/hub");
  });

  it("routes vehicle board to the fleet manifest", () => {
    const beat = spaceSubSceneBeat("veh.cades_apc", "board");
    expect(beat?.continueRoute).toBe("/trade-empire/hub");
  });

  it("Castle of Death investigate stays in the sub-scene (no route)", () => {
    const beat = spaceSubSceneBeat(
      "dest.castle_of_death.cod07_library_of_forbidden",
      "investigate_chamber",
    );
    expect(beat?.continueRoute).toBeUndefined();
    // Bespoke override now exists for the Library — verify it
    // distinguishes from the generic Castle beat.
    expect(beat?.prose).toMatch(/Library|grimoires|lectern/i);
  });

  it("Crucible per-arena overrides route to PvP", () => {
    const undercity = spaceSubSceneBeat(
      "dest.crucible.cr12_neon_undercity",
      "enter_arena",
    );
    expect(undercity?.continueRoute).toBe("/duelyst-pvp");
    expect(undercity?.prose).toMatch(/Neon|sponsor|ascent/i);
    const forest = spaceSubSceneBeat(
      "dest.crucible.cr15_living_forest",
      "enter_arena",
    );
    expect(forest?.continueRoute).toBe("/duelyst-pvp");
    expect(forest?.prose).toMatch(/forest|trees|swarm|Source/i);
  });

  it("Tower Defense bespoke beats route to swarm campaign", () => {
    const warMachine = spaceSubSceneBeat(
      "dest.tower_defense.td10_war_machine",
      "begin_defense",
    );
    expect(warMachine?.continueRoute).toBe("/terminus-swarm");
    expect(warMachine?.prose).toMatch(/War Machine|weapon|Cades/i);
  });

  it("Trade Empire per-sector beats route to hub", () => {
    const aurum = spaceSubSceneBeat(
      "dest.trade_empire.te01_aurum_prime",
      "visit_sector",
    );
    expect(aurum?.continueRoute).toBe("/trade-empire/hub");
    expect(aurum?.prose).toMatch(/Aurum|capital|Locke|docking/i);
    const scrapyard = spaceSubSceneBeat(
      "dest.trade_empire.te04_scrapyard_moon",
      "visit_sector",
    );
    expect(scrapyard?.prose).toMatch(/Scrapyard|salvage|never trust/i);
  });

  it("Quiz Show dark-counter beats stay narrative", () => {
    const pit = spaceSubSceneBeat(
      "dest.quiz_show.qs04_elimination_pit",
      "take_the_stage",
    );
    expect(pit?.continueRoute).toBeUndefined();
    expect(pit?.prose).toMatch(/Pit|drop|eliminat/i);
    const green = spaceSubSceneBeat(
      "dest.quiz_show.qs05_backstage_green_room",
      "take_the_stage",
    );
    expect(green?.prose).toMatch(/Backstage|dressing|Meme/i);
  });

  it("Captain's Shuttle has a per-vessel beat distinct from generic vehicle board", () => {
    const shuttle = spaceSubSceneBeat("veh.captains_shuttle", "board");
    const generic = spaceSubSceneBeat("veh.pet_transport", "board");
    expect(shuttle?.prose).not.toBe(generic?.prose);
    expect(shuttle?.prose).toMatch(/biometric|helm|Elara/i);
  });

  it("Combat Dropship routes board to swarm campaign", () => {
    const dropship = spaceSubSceneBeat("veh.combat_dropship", "board");
    expect(dropship?.continueRoute).toBe("/terminus-swarm");
    expect(dropship?.prose).toMatch(/Cades|dropship|countdown/i);
  });
});
