import { describe, it, expect } from "vitest";
import {
  MISTAKE_TYPES,
  pickReviewNarration,
  hashString,
} from "./chessReviewNarration";

describe("chessReviewNarration", () => {
  it("every MistakeType has at least 2 alternate lines", () => {
    for (const type of MISTAKE_TYPES) {
      // Pull all alternates by seeding across the whole range.
      const seen = new Set<string>();
      for (let seed = 0; seed < 100; seed++) {
        seen.add(pickReviewNarration(type, seed));
      }
      expect(seen.size).toBeGreaterThanOrEqual(2);
    }
  });

  it("is deterministic for a given (type, seed) pair", () => {
    const a = pickReviewNarration("hung_piece", 12345);
    const b = pickReviewNarration("hung_piece", 12345);
    expect(a).toBe(b);
  });

  it("substitutes {{variables}} when provided", () => {
    const line = pickReviewNarration("missed_tactic", 0, {
      moveNumber: 17,
    });
    if (line.includes("move")) {
      expect(line).not.toMatch(/\{\{moveNumber\}\}/);
    }
  });

  it("hashString is deterministic and varies by input", () => {
    expect(hashString("abc")).toBe(hashString("abc"));
    expect(hashString("abc")).not.toBe(hashString("abcd"));
  });
});
