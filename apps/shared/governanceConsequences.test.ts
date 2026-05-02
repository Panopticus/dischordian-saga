import { describe, it, expect } from "vitest";
import {
  CONSEQUENCES_VERSION,
  VOTE_ZERO_ID,
  VOTE_ZERO_OPTION_CONFIRM,
  VOTE_ZERO_OPTION_LOOK_AWAY,
  getOptionConsequence,
  getVoteConsequence,
  resolveProfileSource,
  listRegisteredVoteIds,
  __INTERNAL_CONSEQUENCES,
} from "./governanceConsequences";
import { getStandardDelta } from "./playerProfileSources";

describe("governanceConsequences", () => {
  it("exports a positive integer version", () => {
    expect(CONSEQUENCES_VERSION).toBeGreaterThanOrEqual(1);
    expect(Number.isInteger(CONSEQUENCES_VERSION)).toBe(true);
  });

  it("registers Vote #0 with both Confirm and Look-Away options", () => {
    const row = getVoteConsequence(VOTE_ZERO_ID);
    expect(row).not.toBeNull();
    const confirm = getOptionConsequence(VOTE_ZERO_ID, VOTE_ZERO_OPTION_CONFIRM);
    const lookAway = getOptionConsequence(VOTE_ZERO_ID, VOTE_ZERO_OPTION_LOOK_AWAY);
    expect(confirm?.eyeFraming).toBe("confirm");
    expect(lookAway?.eyeFraming).toBe("look_away");
  });

  it("Vote #0 options carry signed conformity deltas via their profile source", () => {
    const confirmSrc = resolveProfileSource(VOTE_ZERO_ID, VOTE_ZERO_OPTION_CONFIRM);
    const lookAwaySrc = resolveProfileSource(VOTE_ZERO_ID, VOTE_ZERO_OPTION_LOOK_AWAY);
    const confirmDelta = getStandardDelta(confirmSrc);
    const lookAwayDelta = getStandardDelta(lookAwaySrc);
    expect(confirmDelta?.conformity).toBeGreaterThan(0);
    expect(lookAwayDelta?.conformity).toBeLessThan(0);
  });

  it("Vote #0 options write distinct narrativeFlags so the chamber can branch on them", () => {
    const confirm = getOptionConsequence(VOTE_ZERO_ID, VOTE_ZERO_OPTION_CONFIRM);
    const lookAway = getOptionConsequence(VOTE_ZERO_ID, VOTE_ZERO_OPTION_LOOK_AWAY);
    expect(confirm?.narrativeFlags?.length ?? 0).toBeGreaterThan(0);
    expect(lookAway?.narrativeFlags?.length ?? 0).toBeGreaterThan(0);
    expect(confirm?.narrativeFlags).not.toEqual(lookAway?.narrativeFlags);
  });

  it("falls back to governance_vote:neutral for unknown vote+option combos", () => {
    expect(resolveProfileSource("nonexistent_vote", 1)).toBe(
      "governance_vote:neutral",
    );
    expect(getOptionConsequence("nonexistent_vote", 1)).toBeNull();
    expect(getVoteConsequence("nonexistent_vote")).toBeNull();
  });

  it("every registered profile source resolves to a known delta", () => {
    for (const voteId of listRegisteredVoteIds()) {
      const row = __INTERNAL_CONSEQUENCES[voteId];
      for (const [optNum, opt] of Object.entries(row.options)) {
        const src = resolveProfileSource(voteId, Number(optNum));
        expect(getStandardDelta(src), `delta for ${src} (vote=${voteId} opt=${optNum})`).not.toBeNull();
      }
    }
  });

  it("listRegisteredVoteIds includes Vote #0", () => {
    expect(listRegisteredVoteIds()).toContain(VOTE_ZERO_ID);
  });
});
