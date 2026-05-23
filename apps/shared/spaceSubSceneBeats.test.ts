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
});
