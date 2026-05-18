import { describe, it, expect } from "vitest";
import { NARRATIVE_SPINE } from "./narrativeSpine";
import {
  getInWorldHotspotRoutes,
  resolveSpineDoorways,
  getDoorlessWings,
} from "./spineDoorways";

describe("spine doorways — room ↔ mode bridge", () => {
  it("scans real route-action hotspots out of ROOM_DEFINITIONS", () => {
    const routes = getInWorldHotspotRoutes();
    expect(routes.size).toBeGreaterThan(5);
    // Known wired in-world doors (Strategy Table / Trade Terminal /
    // Warden's Vigil / Combat Arena).
    expect(routes.has("/chess")).toBe(true);
    expect(routes.has("/trade-empire")).toBe(true);
    expect(routes.has("/tower-defense")).toBe(true);
  });

  it("returns exactly one entry per spine WING beat (no trunk)", () => {
    const wings = NARRATIVE_SPINE.filter((b) => b.spineRole === "wing");
    const doors = resolveSpineDoorways();
    expect(doors.length).toBe(wings.length);
    const ids = doors.map((d) => d.premiseId);
    expect(ids).not.toContain("tcg_dischordia"); // trunk
    expect(ids).not.toContain("cades_fps"); // trunk
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("at least one wing already has a diegetic in-world door", () => {
    const withDoor = resolveSpineDoorways().filter((d) => d.hasWorldDoor);
    expect(withDoor.length).toBeGreaterThan(0);
    for (const d of withDoor) {
      expect(d.surfaceRoutes).toContain(d.doorRoute);
    }
  });

  it("getDoorlessWings is the precise W0 target set (subset of wings)", () => {
    const doorless = getDoorlessWings();
    const all = resolveSpineDoorways();
    expect(doorless.every((d) => !d.hasWorldDoor)).toBe(true);
    expect(doorless.length).toBeLessThanOrEqual(all.length);
  });
});
