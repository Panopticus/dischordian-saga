import { describe, expect, it } from "vitest";
import {
  IRON_LION_BROADCASTS,
  pendingIronLionBroadcast,
  ironLionBroadcastsHeard,
  getIronLionBroadcast,
} from "./ironLionBroadcasts";

describe("ironLionBroadcasts — queue + lookup", () => {
  it("declares exactly seven canonical transmissions", () => {
    expect(IRON_LION_BROADCASTS).toHaveLength(7);
    const seqs = IRON_LION_BROADCASTS.map((b) => b.sequenceIndex);
    expect(seqs).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("first broadcast unlocks on act_4_complete; the rest chain off cades_m{N-1}_complete", () => {
    expect(IRON_LION_BROADCASTS[0].unlockFlag).toBe("act_4_complete");
    for (let i = 1; i < IRON_LION_BROADCASTS.length; i++) {
      expect(IRON_LION_BROADCASTS[i].unlockFlag).toBe(`cades_m${i}_complete`);
    }
  });

  it("pendingIronLionBroadcast returns null when no unlock flags are set", () => {
    expect(pendingIronLionBroadcast(new Set())).toBeNull();
  });

  it("pendingIronLionBroadcast returns the first transmission when act_4_complete fires", () => {
    const pending = pendingIronLionBroadcast(new Set(["act_4_complete"]));
    expect(pending?.id).toBe(IRON_LION_BROADCASTS[0].id);
  });

  it("pendingIronLionBroadcast skips already-seen broadcasts and surfaces the next", () => {
    const flags = new Set([
      "act_4_complete",
      "cades_m1_complete",
      IRON_LION_BROADCASTS[0].seenFlag,
    ]);
    const pending = pendingIronLionBroadcast(flags);
    expect(pending?.id).toBe(IRON_LION_BROADCASTS[1].id);
  });

  it("pendingIronLionBroadcast returns null when all unlocked broadcasts have been seen", () => {
    const flags = new Set<string>([
      "act_4_complete",
      ...IRON_LION_BROADCASTS.flatMap((b) => [b.unlockFlag, b.seenFlag]),
    ]);
    expect(pendingIronLionBroadcast(flags)).toBeNull();
  });

  it("pendingIronLionBroadcast surfaces broadcast 7 only after cades_m6_complete fires", () => {
    const withoutM6 = new Set<string>([
      "act_4_complete",
      ...Array.from({ length: 5 }, (_, i) => `cades_m${i + 1}_complete`),
      ...IRON_LION_BROADCASTS.slice(0, 6).map((b) => b.seenFlag),
    ]);
    expect(pendingIronLionBroadcast(withoutM6)).toBeNull();
    const withM6 = new Set<string>([...withoutM6, "cades_m6_complete"]);
    expect(pendingIronLionBroadcast(withM6)?.id).toBe(IRON_LION_BROADCASTS[6].id);
  });

  it("ironLionBroadcastsHeard counts only seenFlags", () => {
    expect(ironLionBroadcastsHeard(new Set())).toBe(0);
    expect(
      ironLionBroadcastsHeard(
        new Set([IRON_LION_BROADCASTS[0].seenFlag, IRON_LION_BROADCASTS[3].seenFlag]),
      ),
    ).toBe(2);
  });

  it("getIronLionBroadcast resolves by id and returns undefined for unknown ids", () => {
    expect(getIronLionBroadcast(IRON_LION_BROADCASTS[2].id)?.sequenceIndex).toBe(3);
    expect(getIronLionBroadcast("nonexistent")).toBeUndefined();
  });
});
