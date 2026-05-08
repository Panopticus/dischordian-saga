import { describe, it, expect } from "vitest";
import { SEAL_EPIGRAPHS, getSealEpigraph } from "./sevenSealsEpigraphs";
import { SEVEN_SEALS } from "./sevenSeals";

describe("SEAL_EPIGRAPHS", () => {
  it("has an entry for every seal", () => {
    for (const seal of SEVEN_SEALS) {
      expect(SEAL_EPIGRAPHS[seal.num]).toBeDefined();
    }
  });

  it("openingLine is non-empty and ≤ 80 chars", () => {
    for (const e of Object.values(SEAL_EPIGRAPHS)) {
      expect(e.openingLine.length).toBeGreaterThan(0);
      expect(e.openingLine.length).toBeLessThanOrEqual(80);
    }
  });

  it("body is 200–600 chars (3–5 sentences worth)", () => {
    for (const e of Object.values(SEAL_EPIGRAPHS)) {
      expect(e.body.length).toBeGreaterThanOrEqual(200);
      expect(e.body.length).toBeLessThanOrEqual(600);
    }
  });

  it("attribution + citation are non-empty", () => {
    for (const e of Object.values(SEAL_EPIGRAPHS)) {
      expect(e.attribution.length).toBeGreaterThan(0);
      expect(e.citation.length).toBeGreaterThan(0);
    }
  });

  it("each epigraph names at least one saga-canonical entity", () => {
    // The epigraphs are the Daniel Cross voice; each one should
    // ground itself in the saga's own world via at least one
    // canonical noun (not just generic prose).
    const canonNouns = [
      "Architect",
      "Console",
      "Watchers",
      "Watcher",
      "Hierarchy",
      "Ark",
      "Severance",
      "Memorial Plaza",
      "New Babylon",
      "upper bands",
      "transmissions",
      "imprints",
      "Trade Empire",
      "Advocate",
      "bloodlines",
      "soul-bound",
    ];
    for (const e of Object.values(SEAL_EPIGRAPHS)) {
      const haystack = `${e.openingLine}\n${e.body}`;
      const hits = canonNouns.filter((n) => haystack.includes(n));
      expect(
        hits.length,
        `seal ${e.num} epigraph names no saga-canonical noun (allowlist: ${canonNouns.join(", ")})`,
      ).toBeGreaterThan(0);
    }
  });

  it("attribution credits Daniel Cross", () => {
    for (const e of Object.values(SEAL_EPIGRAPHS)) {
      expect(e.attribution.toLowerCase()).toContain("daniel cross");
    }
  });

  it("getSealEpigraph returns the entry by number", () => {
    expect(getSealEpigraph(1).num).toBe(1);
    expect(getSealEpigraph(7).num).toBe(7);
    expect(getSealEpigraph(4).openingLine).toContain("fourth rider");
  });
});
