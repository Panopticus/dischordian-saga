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
  it("has exactly 8 recordings (Recording 0 + the original 7)", () => {
    expect(ENGINEER_RECORDINGS).toHaveLength(8);
    expect(TOTAL_RECORDINGS).toBe(8);
  });

  it("recordings are in ascending order", () => {
    for (let i = 1; i < ENGINEER_RECORDINGS.length; i++) {
      expect(ENGINEER_RECORDINGS[i].order).toBeGreaterThan(
        ENGINEER_RECORDINGS[i - 1].order,
      );
    }
  });

  it("every recording has unique id, order, and discoveryFlag", () => {
    const ids = ENGINEER_RECORDINGS.map((r) => r.id);
    const orders = ENGINEER_RECORDINGS.map((r) => r.order);
    const flags = ENGINEER_RECORDINGS.map((r) => r.discoveryFlag);

    expect(new Set(ids).size).toBe(8);
    expect(new Set(orders).size).toBe(8);
    expect(new Set(flags).size).toBe(8);
  });

  it("Recording 0 has the prelude-complete trigger and lives in engineering", () => {
    const r0 = ENGINEER_RECORDINGS[0];
    expect(r0.id).toBe("holo_trap_is_you");
    expect(r0.order).toBe(0);
    expect(r0.trigger.preludeComplete).toBe(true);
    expect(r0.roomId).toBe("engineering");
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
    it("returns Recording 0 first when prelude is complete and nothing is discovered", () => {
      const next = getNextPendingRecording({}, 0, 0, false, true);
      expect(next?.id).toBe("holo_trap_is_you");
    });

    it("does not surface Recording 0 before prelude completes", () => {
      const next = getNextPendingRecording({}, 0, 0, false, false);
      expect(next?.id).not.toBe("holo_trap_is_you");
    });

    it("returns recording 1 with 1 win and Recording 0 already heard", () => {
      const flags = { engineer_recording_0_discovered: true };
      const next = getNextPendingRecording(flags, 1, 0, false, true);
      expect(next?.id).toBe("holo_wake_the_bench");
    });

    it("skips already-discovered recordings", () => {
      const flags = {
        engineer_recording_0_discovered: true,
        engineer_recording_1_discovered: true,
      };
      const next = getNextPendingRecording(flags, 3, 0, false, true);
      expect(next?.id).toBe("holo_princes_notebook");
    });

    it("returns undefined when wins are too low and prelude not complete", () => {
      expect(getNextPendingRecording({}, 0, 0, false, false)).toBeUndefined();
    });

    it("recording 6 requires dischordiaStep >= 12", () => {
      const flags = {
        engineer_recording_0_discovered: true,
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
      };
      expect(getNextPendingRecording(flags, 10, 11, false, true)).toBeUndefined();
      expect(getNextPendingRecording(flags, 10, 12, false, true)?.id).toBe(
        "holo_agent_zero_dispatched",
      );
    });

    it("recording 7 requires allAct1Complete", () => {
      const flags = {
        engineer_recording_0_discovered: true,
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
        engineer_recording_6_discovered: true,
      };
      expect(getNextPendingRecording(flags, 12, 12, false, true)).toBeUndefined();
      expect(getNextPendingRecording(flags, 12, 12, true, true)?.id).toBe(
        "holo_deck_remembers",
      );
    });

    it("returns undefined when all recordings discovered", () => {
      const flags = {
        engineer_recording_0_discovered: true,
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
        engineer_recording_6_discovered: true,
        engineer_recording_7_discovered: true,
      };
      expect(getNextPendingRecording(flags, 12, 12, true, true)).toBeUndefined();
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
