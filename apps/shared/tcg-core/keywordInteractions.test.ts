import { describe, expect, it } from "vitest";
import {
  KEYWORD_INTERACTIONS,
  getKeywordInteraction,
  getActiveInteractions,
} from "./keywordInteractions";

describe("KEYWORD_INTERACTIONS coverage invariant", () => {
  // The audit'd authoring rule: every keyword in the Card.ts
  // Keyword union must have an entry. Enumerate the keys and
  // assert each maps to itself (catches typo'd keys).
  it("entry.keyword === key for every entry", () => {
    for (const [key, entry] of Object.entries(KEYWORD_INTERACTIONS)) {
      expect(entry.keyword, `${key} mismatched`).toBe(key);
    }
  });

  it("every entry has a non-empty label + summary", () => {
    for (const entry of Object.values(KEYWORD_INTERACTIONS)) {
      expect(entry.label.trim().length).toBeGreaterThan(0);
      expect(entry.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("summaries are <= 200 chars (tooltip hygiene)", () => {
    for (const entry of Object.values(KEYWORD_INTERACTIONS)) {
      expect(entry.summary.length, `${entry.keyword} too long`).toBeLessThanOrEqual(200);
    }
  });

  it("rejects stub markers", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i];
    for (const entry of Object.values(KEYWORD_INTERACTIONS)) {
      for (const pattern of stubs) {
        expect(pattern.test(entry.summary), `${entry.keyword} stub`).toBe(false);
      }
    }
  });
});

describe("getKeywordInteraction", () => {
  it("returns the entry for a known keyword", () => {
    expect(getKeywordInteraction("rush")?.label).toBe("Rush");
  });

  it("returns null for an unknown keyword", () => {
    expect(getKeywordInteraction("not_a_keyword")).toBeNull();
  });
});

describe("getActiveInteractions", () => {
  it("returns empty when the keyword has no notable interactions", () => {
    // 'flying' has no notableInteractions in the registry.
    expect(getActiveInteractions("flying", ["rush"])).toEqual([]);
  });

  it("returns only interactions whose `with` is also on the card", () => {
    // ranged + provoke is documented; with the card carrying both,
    // the interaction surfaces.
    const result = getActiveInteractions("ranged", ["ranged", "provoke"]);
    expect(result.some((i) => i.with === "provoke")).toBe(true);
  });

  it("filters out interactions whose `with` is missing from the card", () => {
    // ranged has notableInteractions with provoke + untargetable.
    // Card with only ranged + flying should get NEITHER.
    const result = getActiveInteractions("ranged", ["ranged", "flying"]);
    for (const i of result) {
      expect(i.with).not.toBe("provoke");
      expect(i.with).not.toBe("untargetable");
    }
  });

  it("excludes self from the otherKeywords filter", () => {
    // Defensive — interactions are with OTHER keywords; the
    // current keyword shouldn't match itself.
    const result = getActiveInteractions("rush", ["rush"]);
    for (const i of result) {
      expect(i.with).not.toBe("rush");
    }
  });
});

describe("notable interaction examples (audit-cited)", () => {
  it("ranged documents ignoring provoke", () => {
    const entry = KEYWORD_INTERACTIONS.ranged;
    expect(entry.notableInteractions?.some((i) => i.with === "provoke")).toBe(true);
  });

  it("rush documents combining with celerity (deploy-turn double-attack)", () => {
    const entry = KEYWORD_INTERACTIONS.rush;
    expect(entry.notableInteractions?.some((i) => i.with === "celerity")).toBe(true);
  });

  it("structure documents overriding rush", () => {
    const entry = KEYWORD_INTERACTIONS.structure;
    expect(entry.notableInteractions?.some((i) => i.with === "rush")).toBe(true);
  });
});
