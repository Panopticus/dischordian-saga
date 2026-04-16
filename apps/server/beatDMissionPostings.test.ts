import { describe, it, expect } from "vitest";
import {
  BEAT_D_MISSION_POSTINGS,
  formatYearsOpen,
  getHighlightedPosting,
  getMissionPosting,
} from "../client/src/components/prelude/beatDMissionPostings";

/* ═══════════════════════════════════════════════════════
   Beat D mission postings — structural + canon tests.

   Locks the one canonically fully-specified posting (Kelvara
   salvage, 17,000 years, highlighted) and sanity-checks the
   other two placeholders so a canon rewrite can't accidentally
   drop a required field.
   ═══════════════════════════════════════════════════════ */

describe("Beat D mission postings — structural invariants", () => {
  it("declares exactly 3 legacy postings (Bible §8.1)", () => {
    expect(BEAT_D_MISSION_POSTINGS).toHaveLength(3);
  });

  it("posting ids are unique", () => {
    const ids = BEAT_D_MISSION_POSTINGS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every posting has non-empty title / postedBy / description", () => {
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.postedBy.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(20);
    }
  });

  it("every posting has a completionFlag with a stable shape", () => {
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(p.completionFlag).toMatch(/^mission_board_read_[a-z_]+$/u);
    }
  });

  it("every posting's yearsOpen is a positive integer", () => {
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(Number.isInteger(p.yearsOpen)).toBe(true);
      expect(p.yearsOpen).toBeGreaterThan(0);
    }
  });

  it("every posting's position is inside the frame (0-100 pct)", () => {
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(p.position.leftPct).toBeGreaterThanOrEqual(0);
      expect(p.position.leftPct).toBeLessThanOrEqual(100);
      expect(p.position.topPct).toBeGreaterThanOrEqual(0);
      expect(p.position.topPct).toBeLessThanOrEqual(100);
    }
  });
});

describe("Beat D mission postings — pre-collapse era invariant", () => {
  it("all three postings date to the ~17,000-year pre-collapse window", () => {
    // Bible §14.1 planted echo: Locke's Beat H "three jobs that need
    // a hand" refers canonically to the three 17,000-year-old
    // postings on this board. All three must sit within a small
    // spread of that figure (late-Insurgency → Empire-collapse era).
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(p.yearsOpen).toBeGreaterThanOrEqual(16000);
      expect(p.yearsOpen).toBeLessThan(18000);
    }
  });

  it("all three postings' sender organizations are defunct", () => {
    // Per Bible §8.1 the board's postings "auto-renewed" through the
    // long silence. Each posting's description or postedBy must make
    // clear the sender is no longer active / in its original state.
    for (const p of BEAT_D_MISSION_POSTINGS) {
      const combined = `${p.postedBy} ${p.description}`.toLowerCase();
      const signalsDefunct =
        combined.includes("dissolved") ||
        combined.includes("closed") ||
        combined.includes("somewhere else") ||
        combined.includes("auto-renew") ||
        combined.includes("long since") ||
        combined.includes("estate");
      expect(signalsDefunct).toBe(true);
    }
  });
});

describe("Beat D mission postings — Kelvara (canonical) invariants", () => {
  const kelvara = BEAT_D_MISSION_POSTINGS.find(
    (p) => p.id === "kelvara_salvage",
  );

  it("the Kelvara salvage posting exists with the canon id", () => {
    expect(kelvara).toBeDefined();
  });

  it("the Kelvara posting is the one highlighted in the cutscene", () => {
    expect(kelvara?.highlighted).toBe(true);
  });

  it("only ONE posting is highlighted (Bible §8.5 — Elara points to one)", () => {
    const highlighted = BEAT_D_MISSION_POSTINGS.filter((p) => p.highlighted);
    expect(highlighted).toHaveLength(1);
  });

  it("the Kelvara posting is listed as ~17,000 years open (canon: Elara VO)", () => {
    expect(kelvara?.yearsOpen).toBeGreaterThanOrEqual(17000);
    expect(kelvara?.yearsOpen).toBeLessThan(18000);
  });

  it("the Kelvara posting mentions salvage + Kelvara (Locke forward-ref)", () => {
    // Locke's Beat H first message: "salvage retrieval from a wreck
    // near the old Kelvara lane" — must textually match the posting.
    expect(kelvara?.description.toLowerCase()).toContain("salvage");
    expect(kelvara?.description.toLowerCase()).toContain("kelvara");
  });
});

describe("Beat D mission postings — lookup helpers", () => {
  it("getMissionPosting returns a posting by id", () => {
    const p = getMissionPosting("kelvara_salvage");
    expect(p?.title).toBe("The Kelvara Wreck");
  });

  it("getMissionPosting returns undefined for unknown ids", () => {
    expect(getMissionPosting("bogus_mission")).toBeUndefined();
  });

  it("getHighlightedPosting returns the Kelvara posting", () => {
    const p = getHighlightedPosting();
    expect(p?.id).toBe("kelvara_salvage");
  });
});

describe("Beat D mission postings — formatYearsOpen", () => {
  it("formats thousands with a comma separator", () => {
    expect(formatYearsOpen(17003)).toBe("17,003 years");
    expect(formatYearsOpen(1000)).toBe("1,000 years");
  });

  it("does not add a separator for small numbers", () => {
    expect(formatYearsOpen(42)).toBe("42 years");
  });
});
