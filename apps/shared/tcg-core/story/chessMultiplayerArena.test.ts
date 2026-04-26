import { describe, it, expect } from "vitest";
import {
  pickMultiplayerPreMatchLine,
  pickMultiplayerEndLine,
  hashMultiplayerSeed,
} from "./chessMultiplayerArena";

describe("chessMultiplayerArena", () => {
  it("pre-match rated vs casual return distinct lines", () => {
    const rated = pickMultiplayerPreMatchLine(true, 0);
    const casual = pickMultiplayerPreMatchLine(false, 0);
    expect(rated).not.toBe(casual);
  });

  it("pre-match is deterministic for same (rated, seed) pair", () => {
    expect(pickMultiplayerPreMatchLine(true, 42)).toBe(
      pickMultiplayerPreMatchLine(true, 42),
    );
  });

  it("end-match returns a non-empty string for every recognized reason", () => {
    const reasons = [
      "checkmate",
      "resignation",
      "agreement",
      "repetition",
      "insufficient_material",
      "timeout",
      "stalemate",
    ] as const;
    for (const reason of reasons) {
      const line = pickMultiplayerEndLine(reason, 1);
      expect(line, reason).toBeTruthy();
      expect(line.length).toBeGreaterThan(20);
    }
  });

  it("end-match falls back to generic line for unknown reasons", () => {
    const line = pickMultiplayerEndLine("nuclear_explosion", 0);
    expect(line).toContain("position has settled");
  });

  it("end-match deterministic for same (reason, seed) pair", () => {
    expect(pickMultiplayerEndLine("checkmate", 99)).toBe(
      pickMultiplayerEndLine("checkmate", 99),
    );
  });

  it("hashMultiplayerSeed is deterministic and varies by input", () => {
    expect(hashMultiplayerSeed("abc")).toBe(hashMultiplayerSeed("abc"));
    expect(hashMultiplayerSeed("abc")).not.toBe(hashMultiplayerSeed("abd"));
  });
});
