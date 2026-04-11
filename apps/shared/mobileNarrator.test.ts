import { describe, it, expect } from "vitest";
import {
  applyDismissal,
  BOND_TIER_EFFECTS,
  deriveNarratorDominance,
  FORCING_FLAGS,
  getActiveEngineerHook,
  getActivePreludeBeats,
  getBondLocks,
  isDismissalActive,
  makeNarratorSeed,
  mergeBeatFlags,
  PRELUDE_BEAT_BY_ROOM,
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

describe("mobileNarrator.getActivePreludeBeats", () => {
  it("fires beat 1 on first visit to cryo_bay", () => {
    const flags = getActivePreludeBeats("cryo_bay", 1);
    expect(flags).toBeDefined();
    expect(flags!.has("narrator_beat_1_interference")).toBe(true);
  });

  it("fires beat 2 on first visit to medical_bay", () => {
    const flags = getActivePreludeBeats("medical_bay", 1);
    expect(flags).toBeDefined();
    expect(flags!.has("narrator_beat_2_signal")).toBe(true);
  });

  it("fires beat 3 on first visit to comms_array", () => {
    const flags = getActivePreludeBeats("comms_array", 1);
    expect(flags).toBeDefined();
    expect(flags!.has("narrator_beat_3_introduction")).toBe(true);
  });

  it("fires beat 4 on first visit to observation_deck", () => {
    const flags = getActivePreludeBeats("observation_deck", 1);
    expect(flags).toBeDefined();
    expect(flags!.has("narrator_beat_4_swap")).toBe(true);
  });

  it("returns undefined on subsequent visits to a beat room", () => {
    expect(getActivePreludeBeats("cryo_bay", 2)).toBeUndefined();
    expect(getActivePreludeBeats("cryo_bay", 10)).toBeUndefined();
    expect(getActivePreludeBeats("medical_bay", 2)).toBeUndefined();
  });

  it("returns undefined on visitCount 0 (has not been entered yet)", () => {
    expect(getActivePreludeBeats("cryo_bay", 0)).toBeUndefined();
  });

  it("returns undefined for rooms without a Prelude beat", () => {
    expect(getActivePreludeBeats("bridge", 1)).toBeUndefined();
    expect(getActivePreludeBeats("archives", 1)).toBeUndefined();
    expect(getActivePreludeBeats("armory", 1)).toBeUndefined();
    expect(getActivePreludeBeats("engineering", 1)).toBeUndefined();
    expect(getActivePreludeBeats("trade_hub", 1)).toBeUndefined();
    expect(getActivePreludeBeats("captains_quarters", 1)).toBeUndefined();
  });

  it("every declared beat is also a FORCING_FLAGS key", () => {
    for (const beat of Object.values(PRELUDE_BEAT_BY_ROOM)) {
      if (beat === undefined) continue;
      expect(FORCING_FLAGS).toHaveProperty(beat);
    }
  });

  it("beat flags in seedNarratorSlot produce the right narrator", () => {
    // Beat 1 forces Elara regardless of a lopsided Human bond.
    const res1 = seedNarratorSlot({
      roomId: "cryo_bay",
      elaraBond: 0,
      humanBond: 100,
      flags: getActivePreludeBeats("cryo_bay", 1),
      seed: 0.9,
    });
    expect(res1.narratorId).toBe("elara");
    expect(res1.reason).toBe("forced_by_flag");

    // Beat 2 forces The Human on Medical Bay even though Elara
    // lives there by affinity.
    const res2 = seedNarratorSlot({
      roomId: "medical_bay",
      elaraBond: 100,
      humanBond: 0,
      flags: getActivePreludeBeats("medical_bay", 1),
      seed: 0.1,
    });
    expect(res2.narratorId).toBe("the_human");
    expect(res2.reason).toBe("forced_by_flag");
  });
});

describe("mobileNarrator.getActiveEngineerHook (§2.7)", () => {
  const fullCtx = { burntCardFound: true, openerPlayed: false };

  it("fires on first visit to Archives with the burnt card", () => {
    const flags = getActiveEngineerHook("archives", 1, fullCtx);
    expect(flags).toBeDefined();
    expect(flags!.has("engineer_hook_active_opener")).toBe(true);
  });

  it("does NOT fire without the burnt card", () => {
    expect(
      getActiveEngineerHook("archives", 1, { burntCardFound: false, openerPlayed: false }),
    ).toBeUndefined();
  });

  it("does NOT fire on subsequent Archives visits", () => {
    expect(getActiveEngineerHook("archives", 2, fullCtx)).toBeUndefined();
    expect(getActiveEngineerHook("archives", 10, fullCtx)).toBeUndefined();
  });

  it("does NOT fire once the opener has already played", () => {
    expect(
      getActiveEngineerHook("archives", 1, { burntCardFound: true, openerPlayed: true }),
    ).toBeUndefined();
  });

  it("does NOT fire in any other room", () => {
    expect(getActiveEngineerHook("bridge", 1, fullCtx)).toBeUndefined();
    expect(getActiveEngineerHook("cryo_bay", 1, fullCtx)).toBeUndefined();
    expect(getActiveEngineerHook("comms_array", 1, fullCtx)).toBeUndefined();
  });

  it("the flag it returns is a valid FORCING_FLAGS key", () => {
    const flags = getActiveEngineerHook("archives", 1, fullCtx);
    expect(flags).toBeDefined();
    const [flag] = flags!;
    expect(FORCING_FLAGS).toHaveProperty(flag);
    expect(FORCING_FLAGS[flag]).toBe("the_human");
  });

  it("feeds through seedNarratorSlot to force The Human", () => {
    // Archives affinity is +0.6 (Human-leaning) but we use a
    // lopsided Elara bond and a seed that would otherwise pick
    // her — the forcing flag must override everything.
    const res = seedNarratorSlot({
      roomId: "archives",
      elaraBond: 100,
      humanBond: 0,
      flags: getActiveEngineerHook("archives", 1, fullCtx),
      seed: 0.05,
    });
    expect(res.narratorId).toBe("the_human");
    expect(res.reason).toBe("forced_by_flag");
  });
});

describe("mobileNarrator.mergeBeatFlags", () => {
  it("returns undefined when both inputs are undefined", () => {
    expect(mergeBeatFlags(undefined, undefined)).toBeUndefined();
  });

  it("returns a when b is undefined (reference-stable)", () => {
    const a = new Set(["flag1"]);
    expect(mergeBeatFlags(a, undefined)).toBe(a);
  });

  it("returns b when a is undefined (reference-stable)", () => {
    const b = new Set(["flag2"]);
    expect(mergeBeatFlags(undefined, b)).toBe(b);
  });

  it("merges when both are present", () => {
    const a = new Set(["flag1"]);
    const b = new Set(["flag2"]);
    const merged = mergeBeatFlags(a, b);
    expect(merged).toBeDefined();
    expect(merged!.has("flag1")).toBe(true);
    expect(merged!.has("flag2")).toBe(true);
    expect(merged!.size).toBe(2);
  });

  it("deduplicates overlapping flags", () => {
    const a = new Set(["flag1", "flag2"]);
    const b = new Set(["flag2", "flag3"]);
    const merged = mergeBeatFlags(a, b);
    expect(merged).toBeDefined();
    expect(merged!.size).toBe(3);
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

describe("mobileNarrator.deriveNarratorDominance (§1.5)", () => {
  it("returns balanced with no flags", () => {
    expect(deriveNarratorDominance(undefined)).toBe("balanced");
    expect(deriveNarratorDominance({})).toBe("balanced");
  });

  it("returns elara when forgave_elara is set", () => {
    expect(deriveNarratorDominance({ forgiveness_forgave_elara: true })).toBe(
      "elara",
    );
  });

  it("returns the_human when forgave_human is set", () => {
    expect(deriveNarratorDominance({ forgiveness_forgave_human: true })).toBe(
      "the_human",
    );
  });

  it("returns balanced when forgave_both is set", () => {
    expect(deriveNarratorDominance({ forgiveness_forgave_both: true })).toBe(
      "balanced",
    );
  });

  it("lyra_vox_unlocked takes precedence over everything else", () => {
    expect(
      deriveNarratorDominance({
        lyra_vox_unlocked: true,
        forgiveness_forgave_elara: true,
      }),
    ).toBe("lyra_vox");
  });
});

describe("mobileNarrator.seedNarratorSlot — dominance bias", () => {
  it("Elara dominance carries her into a Human-leaning room", () => {
    // Archives has affinity +0.6 (Human-leaning). At seed 0.5 +
    // neutral bonds, Elara's base probability is 0.29. With
    // dominance=elara her weight is multiplied by 2.5, bringing
    // her share well above 0.5.
    const res = seedNarratorSlot({
      roomId: "archives",
      elaraBond: 50,
      humanBond: 50,
      seed: 0.5,
      dominance: "elara",
    });
    expect(res.narratorId).toBe("elara");
  });

  it("The Human dominance carries him into an Elara-leaning room", () => {
    // Medical Bay has affinity -0.6 (Elara-leaning).
    const res = seedNarratorSlot({
      roomId: "medical_bay",
      elaraBond: 50,
      humanBond: 50,
      seed: 0.5,
      dominance: "the_human",
    });
    expect(res.narratorId).toBe("the_human");
  });

  it("balanced dominance leaves room-affinity rolls alone", () => {
    const resNoDom = seedNarratorSlot({
      roomId: "archives",
      elaraBond: 50,
      humanBond: 50,
      seed: 0.5,
      dominance: "balanced",
    });
    const resUnset = seedNarratorSlot({
      roomId: "archives",
      elaraBond: 50,
      humanBond: 50,
      seed: 0.5,
    });
    expect(resNoDom.narratorId).toBe(resUnset.narratorId);
  });

  it("lyra_vox dominance replaces every slot with lyra_vox", () => {
    for (const roomId of [
      "cryo_bay",
      "medical_bay",
      "archives",
      "comms_array",
      "observation_deck",
    ] as const) {
      const res = seedNarratorSlot({
        roomId,
        elaraBond: 80,
        humanBond: 80,
        seed: 0.5,
        dominance: "lyra_vox",
      });
      expect(res.narratorId).toBe("lyra_vox");
    }
  });

  it("lyra_vox dominance overrides silence forcing flags", () => {
    const res = seedNarratorSlot({
      roomId: "memorial_corridor",
      elaraBond: 80,
      humanBond: 80,
      flags: new Set(["two_witnesses_silence_phase"]),
      seed: 0.5,
      dominance: "lyra_vox",
    });
    expect(res.narratorId).toBe("lyra_vox");
  });

  it("lyra_vox dominance overrides give_space silence", () => {
    const now = 1_700_000_000_000;
    const res = seedNarratorSlot({
      roomId: "bridge",
      elaraBond: 50,
      humanBond: 50,
      dismissal: {
        dismissedId: null,
        choice: "both_out",
        expiresAt: now + 60_000,
      },
      nowMs: now,
      seed: 0.5,
      dominance: "lyra_vox",
    });
    expect(res.narratorId).toBe("lyra_vox");
  });
});
