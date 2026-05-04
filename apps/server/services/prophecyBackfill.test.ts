import { describe, expect, it } from "vitest";
import { eligibleForBackfill } from "./prophecyBackfill";
import { PROPHECY_VISIONS } from "../../shared/prophecyVisionMap";

describe("prophecyBackfill — pure helpers", () => {
  it("returns nothing when no flags are set", () => {
    expect(eligibleForBackfill({})).toEqual([]);
  });

  it("returns the bound vision when its flag is set", () => {
    const v = PROPHECY_VISIONS.find((x) => x.intensity === "marquee");
    if (!v) return;
    const eligible = eligibleForBackfill({ [v.flagId]: true });
    expect(eligible).toContain(v);
  });

  it("ignores flags set to false", () => {
    const v = PROPHECY_VISIONS[0];
    expect(eligibleForBackfill({ [v.flagId]: false })).toEqual([]);
  });

  it("returns all matching visions for a fully-flagged player", () => {
    // Flag the entire registry as set; backfill should surface every
    // vision in registry order.
    const flags: Record<string, boolean> = {};
    for (const v of PROPHECY_VISIONS) flags[v.flagId] = true;
    const eligible = eligibleForBackfill(flags);
    expect(eligible.length).toBe(PROPHECY_VISIONS.length);
    expect(eligible[0].id).toBe(PROPHECY_VISIONS[0].id);
  });
});
