import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { BEAT_D_MISSION_POSTINGS, formatYearsOpen } from "./beatDMissionPostings";

/* Coverage for the three Prelude beat UIs that previously had no
   dedicated tests (BeatD / BeatE / BeatH). Each test reads the
   source or the associated data tables so the canonical flag
   writes + structural contracts are guarded. */

describe("BeatDMissionBoard — source contract", () => {
  const SRC = fs.readFileSync(
    path.resolve(__dirname, "BeatDMissionBoard.tsx"),
    "utf-8",
  );

  it("auto-completes once every posting has been read", () => {
    expect(SRC).toContain("read.size >= BEAT_D_MISSION_POSTINGS.length");
  });

  it("closes the reader panel on Escape", () => {
    expect(SRC).toContain('e.key === "Escape"');
  });

  it("fires companion comments on first-slate and all-slates milestones", () => {
    expect(SRC).toContain("prelude_beat_d_first_slate_read");
    expect(SRC).toContain("prelude_beat_d_all_slates_read");
  });
});

describe("Beat D mission postings data", () => {
  it("contains exactly three canonical postings", () => {
    expect(BEAT_D_MISSION_POSTINGS.length).toBe(3);
  });

  it("has unique ids and unique completion flags", () => {
    const ids = new Set(BEAT_D_MISSION_POSTINGS.map((p) => p.id));
    const flags = new Set(BEAT_D_MISSION_POSTINGS.map((p) => p.completionFlag));
    expect(ids.size).toBe(BEAT_D_MISSION_POSTINGS.length);
    expect(flags.size).toBe(BEAT_D_MISSION_POSTINGS.length);
  });

  it("the Kelvara posting is the highlighted 17,000-year one", () => {
    const highlighted = BEAT_D_MISSION_POSTINGS.filter((p) => p.highlighted);
    expect(highlighted.length).toBe(1);
    expect(highlighted[0].id).toBe("kelvara_salvage");
    expect(highlighted[0].yearsOpen).toBeGreaterThanOrEqual(17_000);
  });

  it("positions every posting within the visible frame", () => {
    for (const p of BEAT_D_MISSION_POSTINGS) {
      expect(p.position.leftPct).toBeGreaterThan(0);
      expect(p.position.leftPct).toBeLessThan(100);
      expect(p.position.topPct).toBeGreaterThan(0);
      expect(p.position.topPct).toBeLessThan(100);
    }
  });

  it("formatYearsOpen renders commas on the thousands separator", () => {
    expect(formatYearsOpen(17_003)).toBe("17,003 years");
    expect(formatYearsOpen(800)).toBe("800 years");
  });
});

describe("BeatEFlashback — source contract", () => {
  const SRC = fs.readFileSync(
    path.resolve(__dirname, "BeatEFlashback.tsx"),
    "utf-8",
  );

  it("exposes hotspot elements the player clicks to trigger Prince VO", () => {
    // Every hotspot renders as a button with a hotspot id.
    expect(SRC).toMatch(/hotspot/i);
    expect(SRC).toMatch(/<button/);
  });

  it("calls onComplete when the beat resolves", () => {
    expect(SRC).toContain("onComplete");
  });
});

describe("BeatHInbox — source contract", () => {
  const SRC = fs.readFileSync(
    path.resolve(__dirname, "BeatHInbox.tsx"),
    "utf-8",
  );

  it("surfaces Locke's first transmission (message body + dismiss)", () => {
    expect(SRC).toMatch(/inbox|message|envelope/i);
    expect(SRC).toContain("onComplete");
  });

  it("forwards volume to the audio playback (if present)", () => {
    expect(SRC).toContain("volume");
  });
});
