import { describe, it, expect } from "vitest";
import {
  ENGINEER_RECORDINGS,
  TOTAL_RECORDINGS,
  getRecording,
  getRecordingByOrder,
  getDiscoveredRecordings,
  getNextPendingRecording,
} from "./engineerRecordings";

describe("engineerRecordings", () => {
  it("has exactly 7 recordings", () => {
    expect(ENGINEER_RECORDINGS).toHaveLength(7);
    expect(TOTAL_RECORDINGS).toBe(7);
  });

  it("recordings are in ascending order", () => {
    for (let i = 1; i < ENGINEER_RECORDINGS.length; i++) {
      expect(ENGINEER_RECORDINGS[i].order).toBeGreaterThan(
        ENGINEER_RECORDINGS[i - 1].order,
      );
    }
  });

  it("every recording has unique id, order, roomId, and discoveryFlag", () => {
    const ids = ENGINEER_RECORDINGS.map((r) => r.id);
    const orders = ENGINEER_RECORDINGS.map((r) => r.order);
    const rooms = ENGINEER_RECORDINGS.map((r) => r.roomId);
    const flags = ENGINEER_RECORDINGS.map((r) => r.discoveryFlag);

    expect(new Set(ids).size).toBe(7);
    expect(new Set(orders).size).toBe(7);
    expect(new Set(rooms).size).toBe(7);
    expect(new Set(flags).size).toBe(7);
  });

  it("every recording has both Elara and the Human reactions", () => {
    for (const r of ENGINEER_RECORDINGS) {
      expect(r.npcReactions.elara).toBeTruthy();
      expect(r.npcReactions.the_human).toBeTruthy();
    }
  });

  it("getRecording returns the correct recording", () => {
    const r = getRecording("holo_deck_remembers");
    expect(r.order).toBe(7);
    expect(r.roomId).toBe("captains_quarters");
  });

  it("getRecording throws for unknown id", () => {
    expect(() => getRecording("bogus" as any)).toThrow("Unknown holo recording");
  });

  it("getRecordingByOrder returns correct recording or undefined", () => {
    expect(getRecordingByOrder(1)?.id).toBe("holo_wake_the_bench");
    expect(getRecordingByOrder(99)).toBeUndefined();
  });

  it("getDiscoveredRecordings filters by flags", () => {
    const flags = {
      engineer_recording_1_discovered: true,
      engineer_recording_3_discovered: true,
    };
    const discovered = getDiscoveredRecordings(flags);
    expect(discovered).toHaveLength(2);
    expect(discovered[0].order).toBe(1);
    expect(discovered[1].order).toBe(3);
  });

  it("getDiscoveredRecordings returns empty array when no flags", () => {
    expect(getDiscoveredRecordings({})).toHaveLength(0);
  });

  describe("getNextPendingRecording", () => {
    it("returns recording 1 with 1 win and no flags", () => {
      const next = getNextPendingRecording({}, 1, 0, false);
      expect(next?.id).toBe("holo_wake_the_bench");
    });

    it("skips already-discovered recordings", () => {
      const flags = { engineer_recording_1_discovered: true };
      const next = getNextPendingRecording(flags, 3, 0, false);
      expect(next?.id).toBe("holo_princes_notebook");
    });

    it("returns undefined when wins are too low", () => {
      expect(getNextPendingRecording({}, 0, 0, false)).toBeUndefined();
    });

    it("recording 6 requires dischordiaStep >= 12", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
      };
      expect(getNextPendingRecording(flags, 10, 11, false)).toBeUndefined();
      expect(getNextPendingRecording(flags, 10, 12, false)?.id).toBe(
        "holo_agent_zero_dispatched",
      );
    });

    it("recording 7 requires allAct1Complete", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
        engineer_recording_6_discovered: true,
      };
      expect(getNextPendingRecording(flags, 12, 12, false)).toBeUndefined();
      expect(getNextPendingRecording(flags, 12, 12, true)?.id).toBe(
        "holo_deck_remembers",
      );
    });

    it("returns undefined when all recordings discovered", () => {
      const flags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
        engineer_recording_6_discovered: true,
        engineer_recording_7_discovered: true,
      };
      expect(getNextPendingRecording(flags, 12, 12, true)).toBeUndefined();
    });
  });

  it("trigger minCardWins are monotonically non-decreasing", () => {
    for (let i = 1; i < ENGINEER_RECORDINGS.length; i++) {
      expect(ENGINEER_RECORDINGS[i].trigger.minCardWins).toBeGreaterThanOrEqual(
        ENGINEER_RECORDINGS[i - 1].trigger.minCardWins,
      );
    }
  });
});
