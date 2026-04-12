import { describe, it, expect } from "vitest";
import {
  ENGINEER_GOVERNANCE_VOTES,
  TOTAL_ENGINEER_VOTES,
  getEngineerVote,
  getVoteForRecording,
  getAvailableEngineerVotes,
} from "./engineerGovernanceVotes";

describe("engineerGovernanceVotes", () => {
  it("has exactly 7 votes", () => {
    expect(ENGINEER_GOVERNANCE_VOTES).toHaveLength(7);
    expect(TOTAL_ENGINEER_VOTES).toBe(7);
  });

  it("every vote has unique id", () => {
    const ids = ENGINEER_GOVERNANCE_VOTES.map((v) => v.id);
    expect(new Set(ids).size).toBe(7);
  });

  it("every vote has exactly 2 options", () => {
    for (const v of ENGINEER_GOVERNANCE_VOTES) {
      expect(v.options).toHaveLength(2);
    }
  });

  it("every vote has non-empty antiquarianIntro", () => {
    for (const v of ENGINEER_GOVERNANCE_VOTES) {
      expect(v.antiquarianIntro.length).toBeGreaterThan(0);
    }
  });

  it("every option has at least one consequence", () => {
    for (const v of ENGINEER_GOVERNANCE_VOTES) {
      for (const opt of v.options) {
        expect(opt.consequences.length).toBeGreaterThan(0);
      }
    }
  });

  it("each vote triggers from a unique recording", () => {
    const recordings = ENGINEER_GOVERNANCE_VOTES.map(
      (v) => v.triggeredByRecording,
    );
    expect(new Set(recordings).size).toBe(7);
  });

  it("quorum is always positive", () => {
    for (const v of ENGINEER_GOVERNANCE_VOTES) {
      expect(v.quorum).toBeGreaterThan(0);
    }
  });

  describe("getEngineerVote", () => {
    it("returns correct vote by id", () => {
      const v = getEngineerVote("engineer_vote_keep_playing");
      expect(v?.proposedBy).toBe("The Meme");
    });

    it("returns undefined for unknown id", () => {
      expect(getEngineerVote("nonexistent")).toBeUndefined();
    });
  });

  describe("getVoteForRecording", () => {
    it("maps each recording to its vote", () => {
      expect(
        getVoteForRecording("holo_wake_the_bench")?.id,
      ).toBe("engineer_vote_bench_power");
      expect(
        getVoteForRecording("holo_deck_remembers")?.id,
      ).toBe("engineer_vote_keep_playing");
    });
  });

  describe("getAvailableEngineerVotes", () => {
    it("returns empty when no flags", () => {
      expect(getAvailableEngineerVotes({})).toHaveLength(0);
    });

    it("returns votes whose flags are raised", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_4_discovered: true,
      };
      const available = getAvailableEngineerVotes(flags);
      expect(available).toHaveLength(2);
    });

    it("returns all 7 when all flags raised", () => {
      const flags: Record<string, unknown> = {};
      for (let i = 1; i <= 7; i++) {
        flags[`engineer_recording_${i}_discovered`] = true;
      }
      expect(getAvailableEngineerVotes(flags)).toHaveLength(7);
    });
  });
});
