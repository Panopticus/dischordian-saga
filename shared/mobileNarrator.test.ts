import { describe, it, expect } from "vitest";
import {
  applyDismissal,
  BOND_TIER_EFFECTS,
  FORCING_FLAGS,
  getBondLocks,
  isDismissalActive,
  makeNarratorSeed,
  ROOM_AFFINITY,
  seedNarratorSlot,
  tickSwapRoom,
  toNarratorRoomId,
  type DismissalState,
  type NarratorSlotSeedInput,
} from "./mobileNarrator";

/** Build a seed input with sensible defaults. */
function input(overrides: Partial<NarratorSlotSeedInput> = {}): NarratorSlotSeedInput {
  return {
    roomId: "cryo_bay",
    elaraBond: 50,
    humanBond: 50,
    seed: 0.5,
    ...overrides,
  };
}

describe("mobileNarrator.seedNarratorSlot", () => {
  describe("forcing flags", () => {
    it("forces Elara for the Beat 1 interference moment", () => {
      const res = seedNarratorSlot(
        input({
          flags: new Set(["narrator_beat_1_interference"]),
          elaraBond: 0,
          humanBond: 100,
        }),
      );
      expect(res.narratorId).toBe("elara");
      expect(res.reason).toBe("forced_by_flag");
    });
    it("forces The Human for the Beat 3 introduction", () => {
      const res = seedNarratorSlot(
        input({
          flags: new Set(["narrator_beat_3_introduction"]),
          elaraBond: 100,
          humanBond: 0,
        }),
      );
      expect(res.narratorId).toBe("the_human");
    });
    it("forces silence during the Two Witnesses silence window", () => {
      const res = seedNarratorSlot(
        input({
          flags: new Set(["two_witnesses_silence_phase"]),
        }),
      );
      expect(res.narratorId).toBeNull();
      expect(res.reason).toBe("forced_by_flag");
    });
    it("every forcing flag value is elara, the_human, or silence", () => {
      for (const value of Object.values(FORCING_FLAGS)) {
        expect(["elara", "the_human", "silence"]).toContain(value);
      }
    });
  });

  describe("room affinity weighting", () => {
    it("Archives reliably seats The Human on a neutral bond & median roll", () => {
      const res = seedNarratorSlot(input({ roomId: "archives", seed: 0.5 }));
      expect(res.narratorId).toBe("the_human");
    });
    it("Observation Deck reliably seats Elara on a neutral bond & median roll", () => {
      const res = seedNarratorSlot(input({ roomId: "observation_deck", seed: 0.5 }));
      expect(res.narratorId).toBe("elara");
    });
    it("Medical Bay seats Elara", () => {
      const res = seedNarratorSlot(input({ roomId: "medical_bay", seed: 0.5 }));
      expect(res.narratorId).toBe("elara");
    });
    it("Comms Array seats The Human", () => {
      const res = seedNarratorSlot(input({ roomId: "comms_array", seed: 0.5 }));
      expect(res.narratorId).toBe("the_human");
    });
    it("contested trophy_room can flip either way on seed roll", () => {
      // trophy_room affinity is 0 and bonds equal, so seed < 0.5 → Elara,
      // seed ≥ 0.5 → The Human.
      const low = seedNarratorSlot(input({ roomId: "trophy_room", seed: 0.2 }));
      const high = seedNarratorSlot(input({ roomId: "trophy_room", seed: 0.9 }));
      expect(low.narratorId).toBe("elara");
      expect(high.narratorId).toBe("the_human");
    });
    it("every declared RoomAffinity id has a numeric value", () => {
      for (const v of Object.values(ROOM_AFFINITY)) {
        expect(typeof v).toBe("number");
        expect(v).toBeGreaterThanOrEqual(-1);
        expect(v).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("bond weighting", () => {
    it("a lopsided bond in favor of The Human beats Elara-leaning rooms at neutral seed", () => {
      const res = seedNarratorSlot(
        input({
          roomId: "medical_bay",
          elaraBond: 0,
          humanBond: 100,
          seed: 0.5,
        }),
      );
      expect(res.narratorId).toBe("the_human");
    });
    it("a lopsided bond in favor of Elara beats Human-leaning rooms at neutral seed", () => {
      const res = seedNarratorSlot(
        input({
          roomId: "archives",
          elaraBond: 100,
          humanBond: 0,
          seed: 0.5,
        }),
      );
      expect(res.narratorId).toBe("elara");
    });
  });

  describe("dismissal interactions", () => {
    const now = 1_700_000_000_000;
    it("silence dismissal returns null narrator", () => {
      const dismissal: DismissalState = {
        dismissedId: null,
        choice: "both_out",
        expiresAt: now + 60_000,
      };
      const res = seedNarratorSlot(input({ dismissal, seed: 0.5, nowMs: now }));
      expect(res.narratorId).toBeNull();
      expect(res.reason).toBe("silence_active");
    });
    it("hard dismissal of Elara forces The Human into the next room", () => {
      const dismissal: DismissalState = {
        dismissedId: "elara",
        choice: "rather_hear_other",
        expiresAt: now + 60_000,
        swapRoomsRemaining: 3,
      };
      const res = seedNarratorSlot(
        input({ dismissal, roomId: "observation_deck", seed: 0.5, nowMs: now }),
      );
      expect(res.narratorId).toBe("the_human");
      expect(res.reason).toBe("dismissed_elara");
    });
    it("soft dismissal suppresses the dismissed narrator in the weighted roll", () => {
      const dismissal: DismissalState = {
        dismissedId: "elara",
        choice: "give_space",
        expiresAt: now + 60_000,
      };
      const res = seedNarratorSlot(
        input({ dismissal, roomId: "medical_bay", seed: 0.5, nowMs: now }),
      );
      expect(res.narratorId).toBe("the_human");
    });
    it("expired dismissal stops affecting the roll", () => {
      const dismissal: DismissalState = {
        dismissedId: "elara",
        choice: "rather_hear_other",
        expiresAt: now - 60_000,
        swapRoomsRemaining: 3,
      };
      expect(isDismissalActive(dismissal, now)).toBe(false);
      const res = seedNarratorSlot(
        input({ dismissal, roomId: "medical_bay", seed: 0.5, nowMs: now }),
      );
      expect(res.narratorId).toBe("elara"); // affinity wins again
    });
    it("hard dismissal ends when swapRoomsRemaining hits zero", () => {
      let dismissal: DismissalState = {
        dismissedId: "elara",
        choice: "rather_hear_other",
        expiresAt: now + 60_000,
        swapRoomsRemaining: 2,
      };
      dismissal = tickSwapRoom(dismissal);
      dismissal = tickSwapRoom(dismissal);
      expect(dismissal.swapRoomsRemaining).toBe(0);
      expect(isDismissalActive(dismissal, now)).toBe(false);
    });
  });

  describe("determinism", () => {
    it("identical inputs produce identical outputs", () => {
      const a = seedNarratorSlot(input({ roomId: "archives", seed: 0.42 }));
      const b = seedNarratorSlot(input({ roomId: "archives", seed: 0.42 }));
      expect(a).toEqual(b);
    });
    it("makeNarratorSeed is stable for the same key", () => {
      const a = makeNarratorSeed("archives", 12345, 3);
      const b = makeNarratorSeed("archives", 12345, 3);
      expect(a).toBe(b);
    });
    it("makeNarratorSeed differs when the visit count changes", () => {
      const a = makeNarratorSeed("archives", 12345, 1);
      const b = makeNarratorSeed("archives", 12345, 2);
      expect(a).not.toBe(b);
    });
    it("makeNarratorSeed returns a value in [0, 1)", () => {
      for (const visit of [0, 1, 2, 5, 10, 42, 9999]) {
        const v = makeNarratorSeed("comms_array", 7, visit);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });
  });
});

describe("mobileNarrator.applyDismissal", () => {
  const now = 1_700_000_000_000;

  it("give_space costs 2 bond on the dismissed narrator and nothing else", () => {
    const out = applyDismissal("give_space", "elara", now);
    expect(out.deltas).toEqual({
      elaraBond: -2,
      humanBond: 0,
      unlockPotentialAlonePage: false,
    });
    expect(out.state.dismissedId).toBe("elara");
    expect(out.state.expiresAt).toBe(now + 10 * 60 * 1000);
  });

  it("rather_hear_other costs -5 on dismissed, +3 on summoned", () => {
    const out = applyDismissal("rather_hear_other", "the_human", now);
    expect(out.deltas).toEqual({
      elaraBond: 3,
      humanBond: -5,
      unlockPotentialAlonePage: false,
    });
    expect(out.state.swapRoomsRemaining).toBe(3);
  });

  it("both_out costs -3 on both and unlocks the Potential Alone page", () => {
    const out = applyDismissal("both_out", "elara", now);
    expect(out.deltas).toEqual({
      elaraBond: -3,
      humanBond: -3,
      unlockPotentialAlonePage: true,
    });
    expect(out.state.dismissedId).toBeNull();
    expect(out.state.expiresAt).toBe(now + 20 * 60 * 1000);
  });
});

describe("mobileNarrator.getBondLocks", () => {
  it("Elara bond ≤ 20 locks callbacks and volunteer lore", () => {
    const locks = getBondLocks("elara", 15);
    expect(locks).toContain("elara_callbacks");
    expect(locks).toContain("elara_volunteer_lore");
  });
  it("Human bond ≤ 20 locks the chess bonus", () => {
    const locks = getBondLocks("the_human", 10);
    expect(locks).toContain("human_chess_bonus");
  });
  it("Bond above 20 has no locks", () => {
    expect(getBondLocks("elara", 25)).toEqual([]);
    expect(getBondLocks("the_human", 25)).toEqual([]);
  });
  it("each BOND_TIER_EFFECT row declares at least one lock", () => {
    for (const effect of BOND_TIER_EFFECTS) {
      expect(effect.locks.length).toBeGreaterThan(0);
    }
  });
});

describe("mobileNarrator.toNarratorRoomId", () => {
  it("maps the ten GameContext ship rooms to their canonical ids", () => {
    expect(toNarratorRoomId("cryo-bay")).toBe("cryo_bay");
    expect(toNarratorRoomId("medical-bay")).toBe("medical_bay");
    expect(toNarratorRoomId("bridge")).toBe("bridge");
    expect(toNarratorRoomId("archives")).toBe("archives");
    expect(toNarratorRoomId("comms-array")).toBe("comms_array");
    expect(toNarratorRoomId("observation-deck")).toBe("observation_deck");
    expect(toNarratorRoomId("engineering")).toBe("engineering");
    expect(toNarratorRoomId("armory")).toBe("armory");
    expect(toNarratorRoomId("captains-quarters")).toBe("captains_quarters");
  });

  it("bridges the legacy cargo-hold id to cargo_bay", () => {
    expect(toNarratorRoomId("cargo-hold")).toBe("cargo_bay");
  });

  it("returns null for GameContext specialized rooms", () => {
    // These rooms are mini-game venues, not ship rooms. The §1.2
    // slot is intentionally suppressed.
    expect(toNarratorRoomId("forge-workshop")).toBeNull();
    expect(toNarratorRoomId("antiquarian-library")).toBeNull();
    expect(toNarratorRoomId("engineering-core")).toBeNull();
    expect(toNarratorRoomId("oracle-sanctum")).toBeNull();
    expect(toNarratorRoomId("shadow-vault")).toBeNull();
    expect(toNarratorRoomId("war-room")).toBeNull();
    expect(toNarratorRoomId("cipher-den")).toBeNull();
    expect(toNarratorRoomId("order-tribunal")).toBeNull();
    expect(toNarratorRoomId("chaos-forge")).toBeNull();
    expect(toNarratorRoomId("elemental-nexus")).toBeNull();
  });

  it("returns null for null, undefined, and empty string", () => {
    expect(toNarratorRoomId(null)).toBeNull();
    expect(toNarratorRoomId(undefined)).toBeNull();
    expect(toNarratorRoomId("")).toBeNull();
  });

  it("every mapped NarratorRoomId has a ROOM_AFFINITY entry", () => {
    const mapped = [
      "cryo-bay",
      "medical-bay",
      "bridge",
      "archives",
      "comms-array",
      "observation-deck",
      "engineering",
      "armory",
      "cargo-hold",
      "captains-quarters",
    ];
    for (const gameId of mapped) {
      const narratorId = toNarratorRoomId(gameId);
      expect(narratorId).not.toBeNull();
      if (narratorId) {
        expect(ROOM_AFFINITY).toHaveProperty(narratorId);
      }
    }
  });
});
