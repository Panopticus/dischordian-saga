// apps/shared/tradeEmpire/__tests__/edicts.test.ts

import { describe, it, expect } from "vitest";
import {
  allEdictKeys,
  EDICT_REGISTRY,
  getEdict,
  validateEdictRegistry,
} from "../edicts";

describe("Edict registry — Phase D", () => {
  it("registry passes validation", () => {
    expect(validateEdictRegistry()).toEqual([]);
  });

  it("every edict has at least one negative cost delta", () => {
    for (const def of Object.values(EDICT_REGISTRY)) {
      expect(def.costDeltas.length).toBeGreaterThan(0);
      for (const c of def.costDeltas) {
        expect(c.delta).toBeLessThan(0);
      }
    }
  });

  it("getEdict resolves canonical keys", () => {
    expect(getEdict("edict.industrial_levy")).toBeDefined();
    expect(getEdict("edict.recognition_of_revival")).toBeDefined();
    expect(getEdict("does_not_exist")).toBeUndefined();
  });

  it("allEdictKeys is unique", () => {
    const keys = allEdictKeys();
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("every edict key starts with edict.", () => {
    for (const k of allEdictKeys()) {
      expect(k.startsWith("edict.")).toBe(true);
    }
  });
});
