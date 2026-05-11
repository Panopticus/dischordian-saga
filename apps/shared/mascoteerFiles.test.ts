import { describe, expect, it } from "vitest";
import {
  CANONICAL_MASCOTEERS,
  MASCOTEER_FILES,
  getMascoteerFile,
  mascoteerFilesForRoom,
} from "./mascoteerFiles";

describe("MASCOTEER_FILES — schema invariants", () => {
  it("every case has a unique caseId", () => {
    const ids = MASCOTEER_FILES.map((f) => f.caseId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every case has a unique voId and loredex entry id", () => {
    const voIds = MASCOTEER_FILES.map((f) => f.voId);
    const loredexIds = MASCOTEER_FILES.map((f) => f.unlockLoredexEntry);
    expect(new Set(voIds).size).toBe(voIds.length);
    expect(new Set(loredexIds).size).toBe(loredexIds.length);
  });

  it("every case has 3-5 evidence beats", () => {
    for (const f of MASCOTEER_FILES) {
      expect(
        f.evidenceChain.length,
        `${f.caseId} evidence chain out of range`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        f.evidenceChain.length,
        `${f.caseId} evidence chain out of range`,
      ).toBeLessThanOrEqual(5);
      for (const beat of f.evidenceChain) {
        expect(beat, `${f.caseId} has empty evidence beat`).toBeTruthy();
      }
    }
  });

  it("every mascoteer in mascoteers[] is one of the four canonical ids", () => {
    const allowed = new Set(CANONICAL_MASCOTEERS);
    for (const f of MASCOTEER_FILES) {
      for (const m of f.mascoteers) {
        expect(allowed.has(m), `${f.caseId} names unknown mascoteer ${m}`).toBe(
          true,
        );
      }
    }
  });

  it("every case names at least one mascoteer", () => {
    for (const f of MASCOTEER_FILES) {
      expect(f.mascoteers.length, f.caseId).toBeGreaterThan(0);
    }
  });
});

describe("MASCOTEER_FILES — the fourth case is the open case", () => {
  it("case_fourth_mascoteer has closing: null", () => {
    const fourth = getMascoteerFile("case_fourth_mascoteer");
    expect(fourth).toBeDefined();
    expect(fourth!.closing).toBeNull();
  });

  it("every other case has all three bands filled", () => {
    for (const f of MASCOTEER_FILES) {
      if (f.caseId === "case_fourth_mascoteer") continue;
      expect(f.closing, `${f.caseId} closing missing`).not.toBeNull();
      expect(f.closing!.shadow, f.caseId).toBeTruthy();
      expect(f.closing!.balanced, f.caseId).toBeTruthy();
      expect(f.closing!.warm, f.caseId).toBeTruthy();
    }
  });
});

describe("MASCOTEER_FILES — canon protections", () => {
  // The fifth Mascoteer is canonically NOT Elara Voss — Elara is
  // the Senator the Human betrays in Era 2 (Mechronis), not a
  // childhood friend. The unsolved fourth case must NOT name her
  // anywhere; her appearance in this file would mean a writer has
  // collapsed two canonically-distinct narrative beats.
  it("no Mascoteer case field names Elara Voss", () => {
    const haystack = JSON.stringify(MASCOTEER_FILES).toLowerCase();
    expect(
      haystack,
      "Elara Voss belongs to Era 2 (Watcher's Eyes betrayal), not Era 1 (Mascoteers)",
    ).not.toContain("elara");
    expect(haystack).not.toContain("voss");
  });
});

describe("mascoteerFilesForRoom", () => {
  it("returns every case wired to the given room", () => {
    for (const f of MASCOTEER_FILES) {
      const found = mascoteerFilesForRoom(f.surfaceLocation.roomId);
      expect(found.some((g) => g.caseId === f.caseId)).toBe(true);
    }
  });

  it("returns empty for a room with no cases", () => {
    expect(mascoteerFilesForRoom("cryo_bay")).toEqual([]);
  });
});
