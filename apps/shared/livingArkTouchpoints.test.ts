import { describe, it, expect } from "vitest";
import {
  getNarratorReaction,
  getRoomTouchpoints,
  pickRoomFilter,
  ROOM_WITNESSING_TOUCHPOINTS,
} from "./livingArkTouchpoints";
import { ROOM_AFFINITY, type NarratorRoomId } from "./mobileNarrator";

describe("livingArkTouchpoints — registry structure", () => {
  it("has an entry for every NarratorRoomId with an affinity", () => {
    for (const roomId of Object.keys(ROOM_AFFINITY) as NarratorRoomId[]) {
      expect(
        ROOM_WITNESSING_TOUCHPOINTS[roomId],
        `Missing touchpoints for ${roomId}`,
      ).toBeDefined();
    }
  });

  it("every entry's roomId field matches its registry key", () => {
    for (const [key, entry] of Object.entries(ROOM_WITNESSING_TOUCHPOINTS)) {
      expect(entry.roomId).toBe(key);
    }
  });

  it("every narratorSlotPreference is elara, the_human, or contested", () => {
    for (const entry of Object.values(ROOM_WITNESSING_TOUCHPOINTS)) {
      expect(["elara", "the_human", "contested"]).toContain(
        entry.narratorSlotPreference,
      );
    }
  });

  it("every narratorReactionTable has at least one action", () => {
    for (const entry of Object.values(ROOM_WITNESSING_TOUCHPOINTS)) {
      expect(Object.keys(entry.narratorReactionTable).length).toBeGreaterThan(0);
    }
  });

  it("every reaction line pair has at least one narrator speaking", () => {
    for (const entry of Object.values(ROOM_WITNESSING_TOUCHPOINTS)) {
      for (const pair of Object.values(entry.narratorReactionTable)) {
        expect(
          pair.elara || pair.the_human,
          `${entry.roomId}: both narrators silent for action`,
        ).toBeTruthy();
      }
    }
  });
});

describe("livingArkTouchpoints — canonical §14.2 choices", () => {
  it("Archives prefers The Human per §14.2", () => {
    const archives = getRoomTouchpoints("archives");
    expect(archives?.narratorSlotPreference).toBe("the_human");
  });

  it("Medical Bay prefers Elara", () => {
    expect(getRoomTouchpoints("medical_bay")?.narratorSlotPreference).toBe(
      "elara",
    );
  });

  it("Observation Deck prefers Elara", () => {
    expect(
      getRoomTouchpoints("observation_deck")?.narratorSlotPreference,
    ).toBe("elara");
  });

  it("Comms Array prefers The Human", () => {
    expect(getRoomTouchpoints("comms_array")?.narratorSlotPreference).toBe(
      "the_human",
    );
  });

  it("Engineering prefers The Human", () => {
    expect(getRoomTouchpoints("engineering")?.narratorSlotPreference).toBe(
      "the_human",
    );
  });

  it("narratorSlotPreference is consistent with ROOM_AFFINITY direction", () => {
    // Negative affinity → elara; positive → the_human.
    // Contested rooms (affinity ~0) allow either.
    for (const [roomId, entry] of Object.entries(ROOM_WITNESSING_TOUCHPOINTS)) {
      const affinity = ROOM_AFFINITY[roomId as NarratorRoomId];
      if (affinity < -0.25 && entry.narratorSlotPreference !== "contested") {
        expect(entry.narratorSlotPreference).toBe("elara");
      }
      if (affinity > 0.25 && entry.narratorSlotPreference !== "contested") {
        expect(entry.narratorSlotPreference).toBe("the_human");
      }
    }
  });
});

describe("livingArkTouchpoints.getNarratorReaction", () => {
  it("returns a known reaction for archives → read_rewriting_document", () => {
    const reaction = getNarratorReaction(
      "archives",
      "read_rewriting_document",
    );
    expect(reaction).toBeDefined();
    expect(reaction?.elara).toContain("shifted");
    expect(reaction?.the_human).toContain("Shadow Tongue");
  });

  it("returns a known reaction for medical_bay → examine_blood_wall", () => {
    const reaction = getNarratorReaction("medical_bay", "examine_blood_wall");
    expect(reaction?.the_human).toContain("marker");
  });

  it("returns undefined for an unknown action", () => {
    expect(
      getNarratorReaction("archives", "not_a_real_action"),
    ).toBeUndefined();
  });

  it("returns undefined for an unknown room", () => {
    expect(
      getNarratorReaction(
        "not_a_room" as NarratorRoomId,
        "read_rewriting_document",
      ),
    ).toBeUndefined();
  });
});

describe("livingArkTouchpoints.pickRoomFilter", () => {
  it("returns neutral at bond 0/0", () => {
    expect(pickRoomFilter("observation_deck", 0, 0)).toBe("neutral");
  });

  it("returns warm_elara at bond 80 Elara alone in her canonical room", () => {
    expect(pickRoomFilter("observation_deck", 80, 0)).toBe("warm_elara");
  });

  it("returns noir_human at bond 80 Human alone in his canonical room", () => {
    expect(pickRoomFilter("archives", 0, 80)).toBe("noir_human");
  });

  it("returns yin_yang_flicker at bond 80/80 in a contested room", () => {
    expect(pickRoomFilter("bridge", 80, 80)).toBe("yin_yang_flicker");
  });

  it("defers to the both80 preset when both bonds are at 80", () => {
    // Medical Bay's both80 is warm_elara (Elara carries the room
    // even when the Human is also at 80).
    expect(pickRoomFilter("medical_bay", 80, 80)).toBe("warm_elara");
  });

  it("returns neutral for unknown rooms", () => {
    expect(pickRoomFilter("not_a_room" as NarratorRoomId, 80, 80)).toBe(
      "neutral",
    );
  });

  it("does not flicker at one bond exactly 79", () => {
    // Just below threshold.
    expect(pickRoomFilter("bridge", 79, 80)).toBe("neutral");
  });
});
