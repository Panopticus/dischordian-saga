import { describe, expect, it } from "vitest";
import {
  MOURNING_REMARKS,
  findMourningRemarks,
  getMourningRemarks,
  mourningRemarkCoverage,
  pickMourningVariant,
} from "./npcMourningRemarks";

describe("npcMourningRemarks", () => {
  it("registers all 6 recruitable NPCs as deceased subjects", () => {
    expect(Object.keys(MOURNING_REMARKS)).toEqual([
      "vex_solene",
      "wraith_calder",
      "locke",
      "jericho_jones",
      "akai_shi",
      "lycos",
    ]);
  });

  it("each deceased NPC has at least 2 speakers", () => {
    for (const key of Object.keys(MOURNING_REMARKS)) {
      expect(MOURNING_REMARKS[key as keyof typeof MOURNING_REMARKS].length).toBeGreaterThanOrEqual(2);
    }
  });

  it("each remark has at least 2 line variants", () => {
    for (const remarks of Object.values(MOURNING_REMARKS)) {
      for (const r of remarks) {
        expect(r.variants.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("findMourningRemarks returns a single remark for a known edge", () => {
    const r = findMourningRemarks("vex_solene", "elara");
    expect(r).toBeDefined();
    expect(r?.speaker).toBe("elara");
  });

  it("findMourningRemarks returns undefined for an unknown edge", () => {
    expect(findMourningRemarks("vex_solene", "unknown_speaker")).toBeUndefined();
  });

  it("pickMourningVariant returns one of the variants", () => {
    const r = MOURNING_REMARKS.vex_solene[0];
    const line = pickMourningVariant(r, 1234);
    expect(r.variants).toContain(line);
  });

  it("getMourningRemarks returns empty list for unknown NPC", () => {
    expect(getMourningRemarks("unknown_npc")).toEqual([]);
  });

  it("coverage check passes 5/5", () => {
    const cov = mourningRemarkCoverage();
    expect(cov.declared).toBe(5);
    expect(cov.implemented).toBe(5);
    expect(cov.missing).toEqual([]);
  });
});
