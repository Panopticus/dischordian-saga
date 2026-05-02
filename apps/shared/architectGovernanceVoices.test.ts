import { describe, it, expect } from "vitest";
import {
  tallyBand,
  getArchitectCommentary,
  BAND_CROSSED_LINES,
  FIRST_VISIT_CEREMONY,
  FORBIDDEN_TOKENS,
  __collectAllArchitectStrings,
  type TallyBand,
} from "./architectGovernanceVoices";

describe("architectGovernanceVoices.tallyBand", () => {
  it("treats an empty tally as confirm_narrow", () => {
    expect(tallyBand({ confirm: 0, lookAway: 0 })).toBe("confirm_narrow");
  });

  it("classifies overwhelming confirm above 75%", () => {
    expect(tallyBand({ confirm: 80, lookAway: 20 })).toBe("confirm_overwhelming");
    expect(tallyBand({ confirm: 99, lookAway: 1 })).toBe("confirm_overwhelming");
  });

  it("classifies strong confirm in [60, 75]", () => {
    expect(tallyBand({ confirm: 60, lookAway: 40 })).toBe("confirm_strong");
    expect(tallyBand({ confirm: 70, lookAway: 30 })).toBe("confirm_strong");
    expect(tallyBand({ confirm: 75, lookAway: 25 })).toBe("confirm_strong");
  });

  it("classifies narrow confirm in [50, 60)", () => {
    expect(tallyBand({ confirm: 50, lookAway: 50 })).toBe("confirm_narrow");
    expect(tallyBand({ confirm: 55, lookAway: 45 })).toBe("confirm_narrow");
    expect(tallyBand({ confirm: 59, lookAway: 41 })).toBe("confirm_narrow");
  });

  it("classifies narrow look-away in [40, 50)", () => {
    expect(tallyBand({ confirm: 49, lookAway: 51 })).toBe("look_away_narrow");
    expect(tallyBand({ confirm: 40, lookAway: 60 })).toBe("look_away_narrow");
  });

  it("classifies strong look-away in [25, 40)", () => {
    expect(tallyBand({ confirm: 39, lookAway: 61 })).toBe("look_away_strong");
    expect(tallyBand({ confirm: 25, lookAway: 75 })).toBe("look_away_strong");
  });

  it("classifies overwhelming look-away below 25%", () => {
    expect(tallyBand({ confirm: 24, lookAway: 76 })).toBe("look_away_overwhelming");
    expect(tallyBand({ confirm: 0, lookAway: 100 })).toBe("look_away_overwhelming");
  });
});

describe("architectGovernanceVoices.getArchitectCommentary", () => {
  it("returns a non-empty line for every band", () => {
    const bands: TallyBand[] = [
      "confirm_overwhelming",
      "confirm_strong",
      "confirm_narrow",
      "look_away_narrow",
      "look_away_strong",
      "look_away_overwhelming",
    ];
    const tallies: TallyInput[] = [
      { confirm: 90, lookAway: 10 },
      { confirm: 65, lookAway: 35 },
      { confirm: 55, lookAway: 45 },
      { confirm: 45, lookAway: 55 },
      { confirm: 30, lookAway: 70 },
      { confirm: 10, lookAway: 90 },
    ];
    bands.forEach((expectedBand, i) => {
      const c = getArchitectCommentary({ tally: tallies[i], playerChoice: null });
      expect(c.band).toBe(expectedBand);
      expect(c.line.length).toBeGreaterThan(20);
      expect(c.philosopher).not.toBe("");
    });
  });

  it("emits with-the-many when the player aligns with the majority", () => {
    const c = getArchitectCommentary({
      tally: { confirm: 80, lookAway: 20 },
      playerChoice: "confirmed",
    });
    expect(c.alignment).toBeTruthy();
    expect(c.alignment).toMatch(/many/i);
  });

  it("emits with-the-few when the player diverges from the majority", () => {
    const c = getArchitectCommentary({
      tally: { confirm: 80, lookAway: 20 },
      playerChoice: "looked_away",
    });
    expect(c.alignment).toBeTruthy();
    expect(c.alignment).toMatch(/few/i);
  });

  it("suppresses alignment overlay when no player choice is recorded", () => {
    const c = getArchitectCommentary({
      tally: { confirm: 80, lookAway: 20 },
      playerChoice: null,
    });
    expect(c.alignment).toBeNull();
  });

  it("appends the warmth half-line only when emitWarmth is true", () => {
    const off = getArchitectCommentary({
      tally: { confirm: 50, lookAway: 50 },
      playerChoice: null,
    });
    const on = getArchitectCommentary({
      tally: { confirm: 50, lookAway: 50 },
      playerChoice: null,
      emitWarmth: true,
    });
    expect(off.warmth).toBeNull();
    expect(on.warmth).toBeTruthy();
    expect(on.fullText).toMatch(/hope/i);
  });

  it("fullText concatenates band line + alignment + warmth", () => {
    const c = getArchitectCommentary({
      tally: { confirm: 80, lookAway: 20 },
      playerChoice: "looked_away",
      emitWarmth: true,
    });
    expect(c.fullText).toContain(c.line);
    if (c.alignment) expect(c.fullText).toContain(c.alignment);
    if (c.warmth) expect(c.fullText).toContain(c.warmth);
  });
});

describe("architectGovernanceVoices — first-visit ceremony + band-crossed lines", () => {
  it("ships both Vote #0 callback branches plus an unknown-state fallback", () => {
    expect(FIRST_VISIT_CEREMONY.callbackConfirmed.length).toBeGreaterThan(0);
    expect(FIRST_VISIT_CEREMONY.callbackLookedAway.length).toBeGreaterThan(0);
    expect(FIRST_VISIT_CEREMONY.callbackUnknown.length).toBeGreaterThan(0);
    expect(FIRST_VISIT_CEREMONY.callbackConfirmed).not.toBe(
      FIRST_VISIT_CEREMONY.callbackLookedAway,
    );
  });

  it("ships order_rises and order_falters band-crossed lines", () => {
    expect(BAND_CROSSED_LINES.order_rises.length).toBeGreaterThan(0);
    expect(BAND_CROSSED_LINES.order_falters.length).toBeGreaterThan(0);
  });
});

describe("architectGovernanceVoices — dialog-bank red list", () => {
  it("none of the surfaced strings include any forbidden token", () => {
    const all = __collectAllArchitectStrings();
    for (const s of all) {
      for (const token of FORBIDDEN_TOKENS) {
        expect(s, `token "${token}" forbidden but found in: ${s.slice(0, 80)}…`).not.toContain(token);
      }
    }
  });

  it("collects at least 18 distinct surface strings", () => {
    // Sanity guard: 6 band lines + 2 alignment overlays + 1 warmth +
    // 2 band-crossed + 8 ceremony beats = 19 minimum.
    const all = __collectAllArchitectStrings();
    expect(all.length).toBeGreaterThanOrEqual(18);
  });
});

interface TallyInput {
  confirm: number;
  lookAway: number;
}
