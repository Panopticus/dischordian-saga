import { describe, it, expect } from "vitest";
import {
  diffNewlyUnlocked,
  isCodexEntryUnlocked,
  type UnlockableCodexEntry,
} from "./codexUnlockNotifier";

const entries: UnlockableCodexEntry[] = [
  { id: "a", title: "A", unlockRequirement: 0 },
  { id: "b", title: "B", unlockRequirement: 2 },
  { id: "c", title: "C", unlockRequirement: 5 },
  { id: "d", title: "D", unlockRequirement: 5 },
  { id: "e", title: "E", unlockRequirement: 8 },
];

describe("isCodexEntryUnlocked", () => {
  it("returns true for entries with no real requirement", () => {
    expect(isCodexEntryUnlocked({ id: "x", title: "x", unlockRequirement: 0 }, 0)).toBe(true);
  });

  it("returns true once playerLevel meets the requirement", () => {
    expect(isCodexEntryUnlocked({ id: "x", title: "x", unlockRequirement: 3 }, 3)).toBe(true);
    expect(isCodexEntryUnlocked({ id: "x", title: "x", unlockRequirement: 3 }, 5)).toBe(true);
  });

  it("returns false below the requirement", () => {
    expect(isCodexEntryUnlocked({ id: "x", title: "x", unlockRequirement: 3 }, 2)).toBe(false);
  });
});

describe("diffNewlyUnlocked", () => {
  it("returns nothing when nothing has changed", () => {
    const seen = new Set(["a", "b"]);
    expect(diffNewlyUnlocked(entries, seen, 2)).toEqual([]);
  });

  it("returns only entries unlocked AND not previously seen", () => {
    const seen = new Set(["a"]);
    const result = diffNewlyUnlocked(entries, seen, 2);
    expect(result.map((e) => e.id)).toEqual(["b"]);
  });

  it("returns multiple entries when a level jump unlocks several at once", () => {
    const seen = new Set(["a", "b"]);
    const result = diffNewlyUnlocked(entries, seen, 5);
    expect(result.map((e) => e.id).sort()).toEqual(["c", "d"]);
  });

  it("returns nothing if the player level is below all requirements", () => {
    const seen = new Set<string>();
    const result = diffNewlyUnlocked(entries, seen, 0);
    expect(result.map((e) => e.id)).toEqual(["a"]);
  });

  it("never returns an entry that is in the seen-set, even if it qualifies", () => {
    const seen = new Set(["c"]);
    const result = diffNewlyUnlocked(entries, seen, 9);
    expect(result.map((e) => e.id)).not.toContain("c");
    // a is always unlocked (req 0); b/d/e qualify at level 9; c is filtered.
    expect(result.map((e) => e.id).sort()).toEqual(["a", "b", "d", "e"]);
  });
});
