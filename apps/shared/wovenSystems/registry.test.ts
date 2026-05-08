/**
 * Woven Systems registry — well-formedness tests.
 *
 * The actual ripple-coverage parity check lives at
 * `apps/shared/_completeness/checks/wovenSystemRippleCoverage.ts`. This
 * suite is the *fast* integrity check: ids unique, paths resolvable,
 * emit / consume sets non-empty where appropriate.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, it, expect } from "vitest";
import { WOVEN_SYSTEMS, getWovenSystem } from "./registry";
import { ALL_HORSEMEN } from "./types";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

describe("WOVEN_SYSTEMS registry", () => {
  it("has 17 entries (12 named + 5 weave-in surfaces)", () => {
    expect(WOVEN_SYSTEMS.length).toBe(17);
  });

  it("ids are unique", () => {
    const ids = WOVEN_SYSTEMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has a name and description", () => {
    for (const s of WOVEN_SYSTEMS) {
      expect(s.name.length, `id=${s.id} missing name`).toBeGreaterThan(0);
      expect(
        s.description.length,
        `id=${s.id} missing description`,
      ).toBeGreaterThan(0);
    }
  });

  it("declared paths exist on disk", () => {
    for (const s of WOVEN_SYSTEMS) {
      for (const rel of [...s.routerPaths, ...s.sharedPaths, ...s.uiPaths]) {
        const abs = path.join(REPO_ROOT, rel);
        expect(
          fs.existsSync(abs),
          `${s.id} declares path that does not exist: ${rel}`,
        ).toBe(true);
      }
    }
  });

  it("every entry has at least one path declared somewhere", () => {
    for (const s of WOVEN_SYSTEMS) {
      const total =
        s.routerPaths.length + s.sharedPaths.length + s.uiPaths.length;
      expect(total, `id=${s.id} declares no paths`).toBeGreaterThan(0);
    }
  });

  it("primaryEmits values are unique within an entry", () => {
    for (const s of WOVEN_SYSTEMS) {
      expect(
        new Set(s.primaryEmits).size,
        `id=${s.id} has duplicate primaryEmits`,
      ).toBe(s.primaryEmits.length);
    }
  });

  it("moodContribution keys are valid horseman axes", () => {
    const valid = new Set<string>(ALL_HORSEMEN);
    for (const s of WOVEN_SYSTEMS) {
      for (const k of Object.keys(s.moodContribution)) {
        expect(
          valid.has(k),
          `${s.id} declares unknown horseman axis: ${k}`,
        ).toBe(true);
      }
    }
  });

  it("moodContribution values are within [-1, 1]", () => {
    for (const s of WOVEN_SYSTEMS) {
      for (const [axis, v] of Object.entries(s.moodContribution)) {
        expect(
          Math.abs(v as number) <= 1,
          `${s.id}.${axis} = ${v} is outside [-1, 1]`,
        ).toBe(true);
      }
    }
  });

  it("getWovenSystem returns the entry by id", () => {
    expect(getWovenSystem("breeding")?.name).toBe("Breeding");
    expect(getWovenSystem("dlc_mini")?.name).toBe("Mini DLC");
    expect(getWovenSystem("nonsense" as never)).toBeUndefined();
  });
});
