import { describe, it, expect } from "vitest";
import {
  DEFAULT_NARRATOR_STATE,
  HARD_DISMISS_ROOMS,
  SILENCE_MS,
  SOFT_DISMISS_MS,
  advanceRoomTransition,
  applyBondDelta,
  canAdvanceReveal,
  clampBond,
  detectLivingUniverseBeat,
  dismissNarrator,
  getTrustTier,
  resolveNarratorForRoom,
  resolveTwoWitnessesMeet,
  seedRoomPreferences,
  sharedRevealTier,
  type NarratorState,
} from "./yinYangNarrator";

const NOW = 1_700_000_000_000;

function baseState(overrides: Partial<NarratorState> = {}): NarratorState {
  return {
    ...DEFAULT_NARRATOR_STATE,
    softDismissalUntil: {},
    dismissalHistory: [],
    flags: {},
    roomPreferences: {},
    ...overrides,
  };
}

describe("yinYangNarrator — tier math", () => {
  it("derives trust tiers at the canonical thresholds", () => {
    expect(getTrustTier(0)).toBe(0);
    expect(getTrustTier(19)).toBe(0);
    expect(getTrustTier(20)).toBe(20);
    expect(getTrustTier(39)).toBe(20);
    expect(getTrustTier(40)).toBe(40);
    expect(getTrustTier(60)).toBe(60);
    expect(getTrustTier(80)).toBe(80);
    expect(getTrustTier(100)).toBe(80);
  });

  it("shared reveal tier is locked to the lower bond", () => {
    expect(sharedRevealTier(80, 40)).toBe(40);
    expect(sharedRevealTier(10, 90)).toBe(0);
    expect(sharedRevealTier(60, 60)).toBe(60);
  });

  it("clamps bond values", () => {
    expect(clampBond(-10)).toBe(0);
    expect(clampBond(150)).toBe(100);
    expect(clampBond(57.4)).toBe(57);
  });
});

describe("yinYangNarrator — bond deltas and trust gating", () => {
  it("applies positive bond delta and recomputes shared tier", () => {
    const start = baseState({ elaraBond: 35, humanBond: 35 });
    const next = applyBondDelta(start, { narrator: "elara", delta: 10, source: "test" });
    expect(next.elaraBond).toBe(45);
    expect(next.sharedRevealTier).toBe(20); // still locked to human's 35
  });

  it("canAdvanceReveal refuses to jump past the lower narrator", () => {
    const state = baseState({ elaraBond: 85, humanBond: 30, sharedRevealTier: 20 });
    expect(canAdvanceReveal(state, "elara", 80)).toBe(false);
    expect(canAdvanceReveal(state, "elara", 20)).toBe(true);
  });

  it("Lyra Vox is only reachable when unlocked", () => {
    const unlocked = baseState({ lyraVoxUnlocked: true });
    expect(canAdvanceReveal(unlocked, "lyra_vox", 40)).toBe(true);
    const locked = baseState({ lyraVoxUnlocked: false });
    expect(canAdvanceReveal(locked, "lyra_vox", 40)).toBe(false);
  });
});

describe("yinYangNarrator — dismissal wheel", () => {
  it("soft dismissal penalizes 2 bond and schedules a return", () => {
    const start = baseState({ elaraBond: 40 });
    const { state } = dismissNarrator(start, "elara", "give_me_space", NOW);
    expect(state.elaraBond).toBe(38);
    expect(state.softDismissalUntil.elara).toBe(NOW + SOFT_DISMISS_MS);
    expect(state.dismissalHistory).toHaveLength(1);
  });

  it("hard dismissal sets 3-room window and awards the other narrator +3", () => {
    const start = baseState({ elaraBond: 50, humanBond: 30 });
    const { state } = dismissNarrator(start, "elara", "prefer_other", NOW);
    expect(state.elaraBond).toBe(45); // -5 penalty
    expect(state.humanBond).toBe(33); // +3 summoned
    expect(state.hardDismissal?.dismissed).toBe("elara");
    expect(state.hardDismissal?.roomsRemaining).toBe(HARD_DISMISS_ROOMS);
    expect(state.flags.human_summoned_awareness).toBe(true);
  });

  it("silence dismisses BOTH narrators and flips the ever-used flag", () => {
    const start = baseState({ elaraBond: 50, humanBond: 60 });
    const { state } = dismissNarrator(start, "elara", "silence", NOW);
    expect(state.silenceEverUsed).toBe(true);
    expect(state.silenceUntil).toBe(NOW + SILENCE_MS);
    // Both lose 3 bond
    expect(state.elaraBond).toBe(47);
    expect(state.humanBond).toBe(57);
  });
});

describe("yinYangNarrator — room transition decrements dismissals", () => {
  it("decrements hardDismissal counter each room", () => {
    const start = baseState({
      hardDismissal: { dismissed: "elara", roomsRemaining: 2 },
    });
    const after1 = advanceRoomTransition(start, NOW);
    expect(after1.hardDismissal?.roomsRemaining).toBe(1);
    const after2 = advanceRoomTransition(after1, NOW);
    expect(after2.hardDismissal).toBeNull();
  });

  it("expires soft dismissals whose time has passed", () => {
    const start = baseState({
      softDismissalUntil: { elara: NOW - 1 },
    });
    const after = advanceRoomTransition(start, NOW);
    expect(after.softDismissalUntil.elara).toBeUndefined();
  });

  it("clears silenceUntil once the time is up", () => {
    const start = baseState({ silenceUntil: NOW - 1 });
    const after = advanceRoomTransition(start, NOW);
    expect(after.silenceUntil).toBeNull();
  });
});

describe("yinYangNarrator — room placement algorithm", () => {
  it("Silence Mode returns 'none' even in a primary Elara room", () => {
    const state = baseState({ silenceUntil: NOW + 1000 });
    const result = resolveNarratorForRoom({
      roomId: "cryo_bay",
      state,
      rng: 0,
      now: NOW,
    });
    expect(result).toBe("none");
  });

  it("Hard dismissal flips to the other narrator", () => {
    const state = baseState({
      hardDismissal: { dismissed: "elara", roomsRemaining: 2 },
    });
    const result = resolveNarratorForRoom({
      roomId: "bridge",
      state,
      rng: 0.2,
      now: NOW,
    });
    expect(result).toBe("human");
  });

  it("Archives forces BOTH narrators", () => {
    const state = baseState();
    const result = resolveNarratorForRoom({
      roomId: "archives",
      state,
      rng: 0.5,
      now: NOW,
    });
    expect(result).toBe("both");
  });

  it("Engineering with Lyra Vox unlocked returns lyra_vox", () => {
    const state = baseState({ lyraVoxUnlocked: true });
    const result = resolveNarratorForRoom({
      roomId: "engineering",
      state,
      rng: 0.5,
      now: NOW,
    });
    expect(result).toBe("lyra_vox");
  });

  it("Contested bridge biases toward higher-bond narrator", () => {
    const elaraFavored = baseState({ elaraBond: 80, humanBond: 10 });
    const result = resolveNarratorForRoom({
      roomId: "bridge",
      state: elaraFavored,
      rng: 0.5,
      now: NOW,
    });
    expect(result).toBe("elara");
  });
});

describe("yinYangNarrator — Two Witnesses Meet resolution", () => {
  it("forgive_both unlocks both Legendary summons and gives +200 light", () => {
    const start = baseState({ elaraBond: 82, humanBond: 81 });
    const result = resolveTwoWitnessesMeet(start, "forgive_both");
    expect(result.state.twoWitnessesResolved).toBe(true);
    expect(result.state.forgivenessOutcome).toBe("forgive_both");
    expect(result.unlocks).toContain("elara_legendary_summon");
    expect(result.unlocks).toContain("human_legendary_summon");
    expect(result.lightEnergyDelta).toBe(200);
  });

  it("forgive_neither unlocks Lyra Vox and costs Light Energy", () => {
    const start = baseState({ elaraBond: 90, humanBond: 90 });
    const result = resolveTwoWitnessesMeet(start, "forgive_neither");
    expect(result.state.lyraVoxUnlocked).toBe(true);
    expect(result.unlocks).toContain("lyra_vox_narrator");
    expect(result.lightEnergyDelta).toBe(-100);
    expect(result.darkEnergyDelta).toBe(100);
    // Both bonds reset to 40.
    expect(result.state.elaraBond).toBe(40);
    expect(result.state.humanBond).toBe(40);
  });

  it("asymmetric forgiveness caps the unforgiven narrator at 65", () => {
    const start = baseState({ elaraBond: 95, humanBond: 95 });
    const result = resolveTwoWitnessesMeet(start, "forgive_elara_only");
    expect(result.state.humanBond).toBe(65);
    expect(result.state.flags.human_hardened).toBe(true);
    expect(result.state.elaraBond).toBe(95);
  });
});

describe("yinYangNarrator — Living Universe beat detection", () => {
  it("detects the trust-40 'Two Witnesses Remember' beat", () => {
    const prev = baseState({ sharedRevealTier: 20 });
    const next = baseState({ sharedRevealTier: 40 });
    expect(detectLivingUniverseBeat(prev, next)).toBe("two_witnesses_remember");
  });

  it("detects the trust-60 silence beat", () => {
    const prev = baseState({ sharedRevealTier: 40 });
    const next = baseState({ sharedRevealTier: 60 });
    expect(detectLivingUniverseBeat(prev, next)).toBe("silence_of_two_witnesses");
  });

  it("detects the trust-80 Two Witnesses Meet beat", () => {
    const prev = baseState({ sharedRevealTier: 60 });
    const next = baseState({ sharedRevealTier: 80 });
    expect(detectLivingUniverseBeat(prev, next)).toBe("two_witnesses_meet");
  });

  it("returns null when tier did not advance", () => {
    const state = baseState({ sharedRevealTier: 40 });
    expect(detectLivingUniverseBeat(state, state)).toBeNull();
  });
});

describe("yinYangNarrator — seeding helpers", () => {
  it("seeds contested rooms with 'contested' and solo rooms with their primary", () => {
    const prefs = seedRoomPreferences();
    expect(prefs.bridge).toBe("contested");
    expect(prefs.cryo_bay).toBe("elara");
    expect(prefs.comms_array).toBe("human");
  });
});
