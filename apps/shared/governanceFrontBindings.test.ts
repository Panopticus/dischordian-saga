import { describe, it, expect } from "vitest";
import {
  FRONT_BINDINGS_VERSION,
  REALITY_FRONT_SECTOR_IDS,
  getFrontBinding,
  getOptionBinding,
  listBoundVoteIds,
  __INTERNAL_BINDINGS,
} from "./governanceFrontBindings";
import { VOTE_ZERO_ID } from "./governanceConsequences";

describe("governanceFrontBindings", () => {
  it("exports a positive integer version", () => {
    expect(FRONT_BINDINGS_VERSION).toBeGreaterThanOrEqual(1);
    expect(Number.isInteger(FRONT_BINDINGS_VERSION)).toBe(true);
  });

  it("registers Vote #0 with both option bindings", () => {
    const binding = getFrontBinding(VOTE_ZERO_ID);
    expect(binding).not.toBeNull();
    expect(getOptionBinding(VOTE_ZERO_ID, 1)).not.toBeNull();
    expect(getOptionBinding(VOTE_ZERO_ID, 2)).not.toBeNull();
  });

  it("Vote #0 Confirm leans Order, Look-Away leans Dream", () => {
    const confirm = getOptionBinding(VOTE_ZERO_ID, 1);
    const lookAway = getOptionBinding(VOTE_ZERO_ID, 2);
    expect(confirm?.controlDelta ?? 0).toBeGreaterThan(0);
    expect(lookAway?.controlDelta ?? 0).toBeLessThan(0);
  });

  it("every referenced sector id is a known sector", () => {
    const known = new Set<string>(REALITY_FRONT_SECTOR_IDS);
    for (const voteId of listBoundVoteIds()) {
      const row = __INTERNAL_BINDINGS[voteId];
      for (const opt of Object.values(row.options)) {
        for (const sector of opt.affectedSectors) {
          expect(known, `unknown sector ${sector}`).toContain(sector);
        }
      }
    }
  });

  it("returns null for unknown vote ids", () => {
    expect(getFrontBinding("nonexistent_vote")).toBeNull();
    expect(getOptionBinding("nonexistent_vote", 1)).toBeNull();
  });
});
