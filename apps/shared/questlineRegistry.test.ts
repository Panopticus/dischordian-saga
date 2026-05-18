import { describe, it, expect } from "vitest";
import {
  QUESTLINE_REGISTRY,
  getQuestlineRegistryCoverage,
} from "./questlineRegistry";
import { checkQuestlineRegistryCoverage } from "./_completeness/checks/questlineRegistryCoverage";

describe("questline registry", () => {
  it("has unique module entries", () => {
    const mods = QUESTLINE_REGISTRY.map((q) => q.module);
    expect(new Set(mods).size).toBe(mods.length);
  });

  it("every entry has a title and a valid status", () => {
    for (const q of QUESTLINE_REGISTRY) {
      expect(q.title.trim().length).toBeGreaterThan(0);
      expect(["shipped", "authored", "support"]).toContain(q.status);
    }
  });

  it("coverage counts sum to declared", () => {
    const c = getQuestlineRegistryCoverage();
    expect(c.shipped + c.authored + c.support).toBe(c.declared);
  });
});

describe("questline registry coverage gate", () => {
  it("is hard-parity PASS — every questline module registered", () => {
    const r = checkQuestlineRegistryCoverage();
    expect(r.missing ?? []).toEqual([]);
    expect(r.implemented).toBe(r.declared);
    expect(r.declared).toBeGreaterThanOrEqual(23);
  });
});
