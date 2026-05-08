import { describe, expect, it } from "vitest";
import {
  applyAlignmentDelta,
  bandFor,
  bandToFlag,
  BLOOD_WEAVE_REVEAL_POOL,
  createBloodWeaveState,
  newlyUnlockedEntries,
  nextReveal,
} from "./bloodWeave";

describe("bloodWeave alignment", () => {
  it("starts at 0 with no reveals", () => {
    const s = createBloodWeaveState();
    expect(s.alignmentValue).toBe(0);
    expect(s.revealedEntryIds.length).toBe(0);
    expect(newlyUnlockedEntries(s)).toEqual([]);
  });

  it("hellbox restoration adds +1", () => {
    const s = createBloodWeaveState();
    const next = applyAlignmentDelta(s, "hellbox_restoration", 1000);
    expect(next.alignmentValue).toBe(1);
    expect(next.lastIncreaseAt).toBe(1000);
  });

  it("resurrection-protocol completion adds +3", () => {
    const next = applyAlignmentDelta(
      createBloodWeaveState(),
      "resurrection_protocol_completed",
      0,
    );
    expect(next.alignmentValue).toBe(3);
  });

  it("demon purification removes 1, floored at 0", () => {
    const start = applyAlignmentDelta(
      createBloodWeaveState(),
      "demon_bound",
      0,
    );
    const purified = applyAlignmentDelta(start, "demon_purified", 0);
    expect(purified.alignmentValue).toBe(0);
    const floored = applyAlignmentDelta(purified, "demon_purified", 0);
    expect(floored.alignmentValue).toBe(0);
  });

  it("crossing thresholds reveals entries in order", () => {
    let s = createBloodWeaveState();
    s = applyAlignmentDelta(s, "hellbox_restoration", 0); // 1
    expect(newlyUnlockedEntries(s)).toEqual(["blood_weave_first_pulse"]);

    s = { ...s, revealedEntryIds: ["blood_weave_first_pulse"] };
    s = applyAlignmentDelta(s, "hellbox_restoration", 0); // 2
    expect(newlyUnlockedEntries(s)).toEqual(["blood_weave_thread_visible"]);

    s = applyAlignmentDelta(
      { ...s, revealedEntryIds: [...s.revealedEntryIds, "blood_weave_thread_visible"] },
      "resurrection_protocol_completed",
      0,
    ); // 5
    const newly = newlyUnlockedEntries(s);
    expect(newly).toContain("hierarchy_servants_described");
    expect(newly).toContain("blood_weave_ne_yon_absence");
  });

  it("nextReveal returns the soonest pending entry", () => {
    const s = createBloodWeaveState();
    const r = nextReveal(s);
    expect(r?.threshold).toBe(1);
    expect(r?.loredexEntryId).toBe("blood_weave_first_pulse");
  });

  it("nextReveal returns null when everything has been revealed", () => {
    const all = BLOOD_WEAVE_REVEAL_POOL.map((p) => p.loredexEntryId);
    const s = { alignmentValue: 100, revealedEntryIds: all };
    expect(nextReveal(s)).toBeNull();
  });

  it("bandFor crosses the expected thresholds", () => {
    expect(bandFor(0)).toBe("dormant");
    expect(bandFor(1)).toBe("braiding");
    expect(bandFor(5)).toBe("woven");
    expect(bandFor(15)).toBe("bound");
    expect(bandFor(30)).toBe("claimed");
    expect(bandToFlag("claimed")).toBe("blood_weave:claimed");
  });
});
