/**
 * Unlock-gate semantics for Epoch Witness votes.
 *
 * Pins the contract that the CoNexus Tome → Epoch Witness feedback
 * loop relies on (#300 set <gameId>_conexus_complete; this test
 * locks down the consumer side):
 *
 *   • `lockedUntil` votes stay locked until the flag flips true.
 *   • Votes without `lockedUntil` are always unlocked.
 *   • `unlockedVotes` filter is a pure projection.
 */
import { describe, it, expect } from "vitest";
import { isVoteUnlocked, unlockedVotes, type NexusPointVote } from "./epochWitnessVotes";

const baseVote: NexusPointVote = {
  id: "test_v1",
  epoch: "age_of_privacy",
  title: "TEST",
  nexusDescription: "...",
  connectedSong: "...",
  connectedLoredexEntries: [],
  officialHistory: "...",
  options: [{ id: "a", text: "A", consequence: "" }],
  duration: "7d",
};

describe("isVoteUnlocked", () => {
  it("a vote with no lockedUntil is always unlocked", () => {
    expect(isVoteUnlocked(baseVote, undefined)).toBe(true);
    expect(isVoteUnlocked(baseVote, {})).toBe(true);
    expect(isVoteUnlocked(baseVote, { foo: true })).toBe(true);
  });

  it("a locked vote is locked when the flag is missing or false", () => {
    const v: NexusPointVote = { ...baseVote, lockedUntil: "welcome_to_celebration_conexus_complete" };
    expect(isVoteUnlocked(v, undefined)).toBe(false);
    expect(isVoteUnlocked(v, {})).toBe(false);
    expect(isVoteUnlocked(v, { welcome_to_celebration_conexus_complete: false })).toBe(false);
    expect(isVoteUnlocked(v, { unrelated_flag: true })).toBe(false);
  });

  it("a locked vote unlocks when the flag is true", () => {
    const v: NexusPointVote = { ...baseVote, lockedUntil: "iron_lion_loredex_complete" };
    expect(isVoteUnlocked(v, { iron_lion_loredex_complete: true })).toBe(true);
  });
});

describe("unlockedVotes", () => {
  it("filters out locked votes", () => {
    const a: NexusPointVote = { ...baseVote, id: "a" };
    const b: NexusPointVote = { ...baseVote, id: "b", lockedUntil: "flag_b" };
    const c: NexusPointVote = { ...baseVote, id: "c", lockedUntil: "flag_c" };
    expect(unlockedVotes([a, b, c], { flag_b: true }).map(v => v.id)).toEqual(["a", "b"]);
    expect(unlockedVotes([a, b, c], { flag_b: true, flag_c: true }).map(v => v.id)).toEqual(["a", "b", "c"]);
    expect(unlockedVotes([a, b, c], undefined).map(v => v.id)).toEqual(["a"]);
  });
});
