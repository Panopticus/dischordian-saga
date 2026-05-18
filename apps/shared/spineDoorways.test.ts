import { describe, it, expect } from "vitest";
import { NARRATIVE_SPINE } from "./narrativeSpine";
import {
  getInWorldHotspotRoutes,
  resolveSpineDoorways,
  getDoorlessWings,
} from "./spineDoorways";
import { checkSpineDoorwayCoverage } from "./_completeness/checks/spineDoorwayCoverage";

describe("spine doorways — room ↔ mode bridge", () => {
  it("scans real route-action hotspots out of ROOM_DEFINITIONS", () => {
    const routes = getInWorldHotspotRoutes();
    expect(routes.size).toBeGreaterThan(5);
    expect(routes.has("/chess")).toBe(true);
    expect(routes.has("/trade-empire")).toBe(true);
    expect(routes.has("/tower-defense")).toBe(true);
  });

  it("returns one entry per spine WING beat (no trunk), keyed by entryRoute", () => {
    const wings = NARRATIVE_SPINE.filter((b) => b.spineRole === "wing");
    const doors = resolveSpineDoorways();
    expect(doors.length).toBe(wings.length);
    const ids = doors.map((d) => d.premiseId);
    expect(ids).not.toContain("tcg_dischordia");
    expect(ids).not.toContain("cades_fps");
    for (const d of doors) {
      const beat = NARRATIVE_SPINE.find(
        (b) => b.revealsPremiseId === d.premiseId,
      );
      expect(d.entryRoute).toBe(beat?.entryRoute);
    }
  });

  it("the already-wired wings resolve as having a world door", () => {
    const byId = new Map(resolveSpineDoorways().map((d) => [d.premiseId, d]));
    expect(byId.get("chess")?.hasWorldDoor).toBe(true);
    expect(byId.get("trade_empire")?.hasWorldDoor).toBe(true);
    expect(byId.get("tower_defense")?.hasWorldDoor).toBe(true);
  });

  it("getDoorlessWings is the precise W0 target set (subset of wings)", () => {
    const doorless = getDoorlessWings();
    const all = resolveSpineDoorways();
    expect(doorless.every((d) => !d.hasWorldDoor)).toBe(true);
    expect(doorless.length).toBeLessThan(all.length); // some are wired
  });
});

describe("spine-doorway coverage gate", () => {
  it("declared = wings, implemented = wings with a door, sane gap", () => {
    const r = checkSpineDoorwayCoverage();
    const wings = NARRATIVE_SPINE.filter((b) => b.spineRole === "wing");
    expect(r.declared).toBe(wings.length);
    expect(r.implemented).toBeGreaterThan(0);
    expect(r.implemented).toBeLessThanOrEqual(r.declared);
    expect((r.missing ?? []).length).toBe(r.declared - r.implemented);
  });
});
