import { describe, expect, it } from "vitest";
import {
  RIDDLE_COMMENTARY,
  getCommentaryForPuzzle,
  getMetariddles,
} from "./riddleCommentary";

describe("riddleCommentary registry invariants", () => {
  it("puzzleIds are unique", () => {
    const ids = RIDDLE_COMMENTARY.map((e) => e.puzzleId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("commentary is non-empty for every entry", () => {
    for (const e of RIDDLE_COMMENTARY) {
      expect(e.commentary.trim().length, `${e.puzzleId} has empty commentary`).toBeGreaterThan(0);
    }
  });

  it("rejects stub markers", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i];
    for (const e of RIDDLE_COMMENTARY) {
      for (const pattern of stubs) {
        expect(pattern.test(e.commentary), `${e.puzzleId} contains stub`).toBe(false);
      }
    }
  });

  it("attributedTo is one of the declared metariddle voices", () => {
    const allowed = new Set(["editor", "author", "elara", "human", "the_degen"]);
    for (const e of RIDDLE_COMMENTARY) {
      expect(allowed.has(e.attributedTo), `${e.puzzleId} bad attributor`).toBe(true);
    }
  });
});

describe("getCommentaryForPuzzle", () => {
  it("returns the matching entry by puzzleId", () => {
    const e = getCommentaryForPuzzle("bridge");
    expect(e?.puzzleId).toBe("bridge");
    expect(e?.attributedTo).toBe("editor");
  });

  it("returns null for unknown puzzle ids", () => {
    expect(getCommentaryForPuzzle("not_a_puzzle")).toBeNull();
  });
});

describe("getMetariddles", () => {
  it("returns only entries with isMetariddle=true", () => {
    const m = getMetariddles();
    for (const e of m) {
      expect(e.isMetariddle).toBe(true);
    }
  });
});
