import { describe, it, expect } from "vitest";

import { parseVoteRewardPayload } from "./voteConsequences";
import {
  getDeclaredConsequences,
  listAllDeclaredConsequences,
} from "./governanceConsequenceMap";
import { ENGINEER_GOVERNANCE_VOTES } from "./engineerGovernanceVotes";
import { ANNUAL_HEADLINE_VOTES } from "./governance";

describe("parseVoteRewardPayload", () => {
  it("returns null for non-objects", () => {
    expect(parseVoteRewardPayload(null)).toBeNull();
    expect(parseVoteRewardPayload(undefined)).toBeNull();
    expect(parseVoteRewardPayload("string")).toBeNull();
    expect(parseVoteRewardPayload(42)).toBeNull();
  });

  it("returns null when consequences array is missing or empty after filtering", () => {
    expect(parseVoteRewardPayload({})).toBeNull();
    expect(parseVoteRewardPayload({ consequences: [] })).toBeNull();
    expect(
      parseVoteRewardPayload({ consequences: [{ kind: "unknown_kind" }] }),
    ).toBeNull();
  });

  it("parses a set_flag consequence", () => {
    const payload = parseVoteRewardPayload({
      consequences: [{ kind: "set_flag", flag: "test:flag" }],
    });
    expect(payload).not.toBeNull();
    expect(payload!.consequences).toEqual([
      { kind: "set_flag", flag: "test:flag" },
    ]);
  });

  it("parses an energy_delta consequence with partial fields", () => {
    const payload = parseVoteRewardPayload({
      consequences: [{ kind: "energy_delta", light: 5 }],
    });
    expect(payload!.consequences[0]).toEqual({
      kind: "energy_delta",
      light: 5,
      dark: undefined,
      vortex: undefined,
    });
  });

  it("parses tome_entry, world_modifier, unlock", () => {
    const payload = parseVoteRewardPayload({
      consequences: [
        { kind: "tome_entry", body: "x", annotation: "y" },
        {
          kind: "world_modifier",
          modifierKey: "k",
          modifierType: "t",
          modifierValue: 10,
          durationDays: 30,
        },
        { kind: "unlock", unlockId: "u" },
      ],
    });
    expect(payload!.consequences).toHaveLength(3);
    expect(payload!.consequences[0].kind).toBe("tome_entry");
    expect(payload!.consequences[1].kind).toBe("world_modifier");
    expect(payload!.consequences[2].kind).toBe("unlock");
  });

  it("rejects malformed consequences silently", () => {
    const payload = parseVoteRewardPayload({
      consequences: [
        { kind: "set_flag" }, // missing flag
        { kind: "tome_entry" }, // missing body
        { kind: "world_modifier", modifierKey: "k" }, // missing rest
        { kind: "set_flag", flag: "good" }, // valid
      ],
    });
    expect(payload!.consequences).toEqual([
      { kind: "set_flag", flag: "good" },
    ]);
  });
});

describe("governanceConsequenceMap registry", () => {
  it("contains entries for every Engineer-arc option", () => {
    for (const vote of ENGINEER_GOVERNANCE_VOTES) {
      for (const opt of vote.options) {
        const declared = getDeclaredConsequences(vote.id, opt.id);
        expect(
          declared,
          `Missing structured consequences for ${vote.id}::${opt.id}`,
        ).not.toBeNull();
        // Every Engineer vote should at minimum write a flag and a tome entry.
        const kinds = new Set(declared!.consequences.map((c) => c.kind));
        expect(kinds.has("set_flag")).toBe(true);
        expect(kinds.has("tome_entry")).toBe(true);
      }
    }
  });

  it("contains entries for every Annual headline option", () => {
    for (const vote of ANNUAL_HEADLINE_VOTES) {
      for (const opt of vote.options) {
        const declared = getDeclaredConsequences(vote.id, opt.id);
        expect(
          declared,
          `Missing structured consequences for ${vote.id}::${opt.id}`,
        ).not.toBeNull();
      }
    }
  });

  it("every registry entry includes a tome inscription so the Antiquarian always speaks", () => {
    for (const { voteId, optionId, payload } of listAllDeclaredConsequences()) {
      const tomeEntries = payload.consequences.filter(
        (c) => c.kind === "tome_entry",
      );
      expect(
        tomeEntries.length,
        `${voteId}::${optionId} has no tome_entry`,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns null for unknown vote/option combinations", () => {
    expect(getDeclaredConsequences("nonexistent", "x")).toBeNull();
  });
});
