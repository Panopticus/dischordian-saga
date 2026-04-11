import { describe, it, expect, beforeEach } from "vitest";
import {
  applyDischordiaEnergy,
  applySlideshowReward,
  useDischordiaCycleStore,
} from "./dischordiaCycleStore";

beforeEach(() => {
  useDischordiaCycleStore.getState().reset();
});

describe("dischordiaCycleStore", () => {
  describe("applyEnergy", () => {
    it("light-win card battle adds +20 light", () => {
      useDischordiaCycleStore.getState().applyEnergy("card_battle_light_win");
      expect(useDischordiaCycleStore.getState().state.lightEnergy).toBe(20);
      expect(useDischordiaCycleStore.getState().state.darkEnergy).toBe(0);
    });

    it("pet death (not memorial) adds +25 dark", () => {
      useDischordiaCycleStore.getState().applyEnergy("pet_death_non_memorial");
      expect(useDischordiaCycleStore.getState().state.darkEnergy).toBe(25);
    });

    it("two_witnesses_refuse increments the vortex clock", () => {
      useDischordiaCycleStore.getState().applyEnergy("two_witnesses_refuse");
      const state = useDischordiaCycleStore.getState().state;
      expect(state.vortexProximity).toBe(1);
      expect(state.darkEnergy).toBe(100);
    });

    it("accumulated gains cross the dimming threshold", () => {
      const store = useDischordiaCycleStore.getState();
      // 12 × 15 dark = 180, past the 100k threshold? No, 180 << 100000.
      // Use a raw delta to test phase transitions more cleanly.
      store.applyRawDelta({ dark: 150_000 });
      expect(useDischordiaCycleStore.getState().state.phase).toBe("dimming");
    });
  });

  describe("applyRawDelta", () => {
    it("accepts combined light/dark/vortex deltas", () => {
      useDischordiaCycleStore
        .getState()
        .applyRawDelta({ light: 50, dark: 25, vortex: 2 });
      const state = useDischordiaCycleStore.getState().state;
      expect(state.lightEnergy).toBe(50);
      expect(state.darkEnergy).toBe(25);
      expect(state.vortexProximity).toBe(2);
    });

    it("defaults unspecified fields to zero", () => {
      useDischordiaCycleStore.getState().applyRawDelta({ light: 10 });
      const state = useDischordiaCycleStore.getState().state;
      expect(state.lightEnergy).toBe(10);
      expect(state.darkEnergy).toBe(0);
      expect(state.vortexProximity).toBe(0);
    });

    it("clamps vortex proximity to 0..100", () => {
      useDischordiaCycleStore.getState().applyRawDelta({ vortex: 250 });
      expect(useDischordiaCycleStore.getState().state.vortexProximity).toBe(100);
      useDischordiaCycleStore.getState().applyRawDelta({ vortex: -500 });
      expect(useDischordiaCycleStore.getState().state.vortexProximity).toBe(0);
    });

    it("flips the phase to light_holds above 1M light", () => {
      useDischordiaCycleStore.getState().applyRawDelta({ light: 1_200_000 });
      expect(useDischordiaCycleStore.getState().state.phase).toBe("light_holds");
    });
  });

  describe("triggerVortexAdvance + triggerReclamation", () => {
    it("vortex_advance phase refuses to auto-exit even with 1M light", () => {
      const store = useDischordiaCycleStore.getState();
      store.triggerVortexAdvance();
      expect(useDischordiaCycleStore.getState().state.phase).toBe("vortex_advance");
      store.applyRawDelta({ light: 2_000_000 });
      expect(useDischordiaCycleStore.getState().state.phase).toBe("vortex_advance");
    });

    it("reclamation phase refuses to auto-exit even with 2M dark", () => {
      const store = useDischordiaCycleStore.getState();
      store.triggerReclamation();
      store.applyRawDelta({ dark: 2_000_000 });
      expect(useDischordiaCycleStore.getState().state.phase).toBe("reclamation");
    });
  });

  describe("checkVortexTrigger", () => {
    it("false at 50% lit", () => {
      expect(useDischordiaCycleStore.getState().checkVortexTrigger(0.5)).toBe(false);
    });

    it("true at 10% lit", () => {
      expect(useDischordiaCycleStore.getState().checkVortexTrigger(0.1)).toBe(true);
    });

    it("false once vortex_advance is already active", () => {
      useDischordiaCycleStore.getState().triggerVortexAdvance();
      expect(useDischordiaCycleStore.getState().checkVortexTrigger(0.05)).toBe(false);
    });
  });

  describe("setPhase", () => {
    it("forces a specific phase and stamps phaseStartedAt", () => {
      const before = new Date().toISOString();
      useDischordiaCycleStore.getState().setPhase("long_night");
      const state = useDischordiaCycleStore.getState().state;
      expect(state.phase).toBe("long_night");
      expect(state.phaseStartedAt >= before).toBe(true);
    });
  });

  describe("reset", () => {
    it("returns the store to defaults", () => {
      const store = useDischordiaCycleStore.getState();
      store.applyEnergy("two_witnesses_forgive");
      store.applyEnergy("two_witnesses_refuse");
      store.triggerVortexAdvance();
      store.reset();
      const state = useDischordiaCycleStore.getState().state;
      expect(state.lightEnergy).toBe(0);
      expect(state.darkEnergy).toBe(0);
      expect(state.vortexProximity).toBe(0);
      expect(state.phase).toBe("dawn");
      expect(state.history).toEqual([]);
    });
  });
});

describe("applySlideshowReward helper", () => {
  beforeEach(() => {
    useDischordiaCycleStore.getState().reset();
  });

  it("applies a positive reward and returns the delta", () => {
    const delta = applySlideshowReward(500);
    expect(delta).toBe(500);
    expect(useDischordiaCycleStore.getState().state.lightEnergy).toBe(500);
  });

  it("is a no-op for undefined reward", () => {
    expect(applySlideshowReward(undefined)).toBe(0);
    expect(useDischordiaCycleStore.getState().state.lightEnergy).toBe(0);
  });

  it("is a no-op for zero or negative rewards", () => {
    expect(applySlideshowReward(0)).toBe(0);
    expect(applySlideshowReward(-100)).toBe(0);
    expect(useDischordiaCycleStore.getState().state.lightEnergy).toBe(0);
  });
});

describe("applyDischordiaEnergy helper", () => {
  beforeEach(() => {
    useDischordiaCycleStore.getState().reset();
  });

  it("routes through the store", () => {
    applyDischordiaEnergy("fight_game_boss_defeat");
    expect(useDischordiaCycleStore.getState().state.lightEnergy).toBe(30);
  });
});
