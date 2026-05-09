import { describe, expect, it } from "vitest";
import {
  bandedNarration,
  bandedHumanNarration,
  tieredResponses,
  resolveBandedNarration,
  resolveHumanBandedNarration,
  type VerbResponse,
} from "./_template";

describe("bandedNarration (audit/16 PR 30 Co6)", () => {
  it("returns a triplet with the three Elara bands", () => {
    const result = bandedNarration("lucid text", "fragmented text", "luminous text");
    expect(result).toEqual({
      lucid: "lucid text",
      fragmented: "fragmented text",
      luminous: "luminous text",
    });
  });

  it("output is interchangeable with hand-authored ElaraBandedText", () => {
    // Round-trip through resolveBandedNarration to prove the
    // helper produces the same shape the runtime consumes.
    const built = bandedNarration("L", "F", "U");
    expect(resolveBandedNarration(built, "lucid")).toBe("L");
    expect(resolveBandedNarration(built, "fragmented")).toBe("F");
    expect(resolveBandedNarration(built, "luminous")).toBe("U");
  });

  it("preserves multi-paragraph text verbatim (no whitespace mangling)", () => {
    const lucid = "Para one.\n\nPara two.";
    const built = bandedNarration(lucid, "F", "U");
    expect(built.lucid).toBe(lucid);
  });
});

describe("bandedHumanNarration", () => {
  it("returns a triplet with the three Human bands", () => {
    const result = bandedHumanNarration("shadow text", "balanced text", "warm text");
    expect(result).toEqual({
      shadow: "shadow text",
      balanced: "balanced text",
      warm: "warm text",
    });
  });

  it("output is interchangeable with hand-authored HumanBandedText", () => {
    const built = bandedHumanNarration("S", "B", "W");
    expect(resolveHumanBandedNarration(built, "shadow")).toBe("S");
    expect(resolveHumanBandedNarration(built, "balanced")).toBe("B");
    expect(resolveHumanBandedNarration(built, "warm")).toBe("W");
  });
});

describe("tieredResponses", () => {
  it("returns the array unchanged (passthrough by design)", () => {
    const tiers: VerbResponse[] = [
      { narration: "tier 1" },
      { narration: "tier 2" },
      { narration: "tier 3" },
    ];
    const result = tieredResponses(tiers);
    expect(result).toEqual(tiers);
  });

  it("is empty-array-safe", () => {
    expect(tieredResponses([])).toEqual([]);
  });

  it("each tier's banded narration resolves correctly", () => {
    const tiers = tieredResponses([
      { narration: bandedNarration("L1", "F1", "U1") },
      { narration: bandedNarration("L2", "F2", "U2") },
    ]);
    expect(resolveBandedNarration(tiers[0]!.narration, "lucid")).toBe("L1");
    expect(resolveBandedNarration(tiers[1]!.narration, "fragmented")).toBe("F2");
  });

  it("preserves all VerbResponse fields (clues, flags, etc.)", () => {
    const tiers = tieredResponses([
      {
        narration: "first",
        logsClue: { id: "c1", title: "T", body: "B", source: "test", order: 0 },
        setsFlag: "flag_first",
      },
      {
        narration: "second",
        grantsInventory: "item_x",
      },
    ]);
    expect(tiers[0]!.logsClue?.id).toBe("c1");
    expect(tiers[0]!.setsFlag).toBe("flag_first");
    expect(tiers[1]!.grantsInventory).toBe("item_x");
  });
});

describe("ergonomic-helper line-count win (audit invariant)", () => {
  // The audit's stated payoff for the helpers is that
  // adopting them reduces line count vs hand-authored
  // triplets. A simple smoke check: a tier with banded
  // narration via the helper reads as ONE line of authoring
  // intent (the `bandedNarration(...)` call) vs THREE lines
  // (the `{ lucid, fragmented, luminous }` literal).
  it("a banded triplet reads as a single function call", () => {
    const built = bandedNarration("a", "b", "c");
    // The shape is preserved; the AUTHOR side is the win.
    expect(Object.keys(built).sort()).toEqual(["fragmented", "lucid", "luminous"]);
  });
});
