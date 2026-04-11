import { describe, it, expect, beforeEach, vi } from "vitest";
import { useWitnessingStore } from "./witnessingStore";
import { LAST_WORDS_SLIDESHOW } from "@shared/songSlideshows";

// Fixed session nonce that gives deterministic narrator picks for
// the rooms this test touches (observation_deck, comms_array,
// archives, medical_bay, bridge). See scripts history for how it
// was derived.
const TEST_NONCE = 5;

beforeEach(() => {
  useWitnessingStore.getState().reset({ sessionNonce: TEST_NONCE });
});

describe("witnessingStore.enterRoom", () => {
  it("seats Elara on the Observation Deck with neutral bonds", () => {
    const slot = useWitnessingStore.getState().enterRoom(
      "observation_deck",
      { elaraBond: 50, humanBond: 50 },
    );
    expect(slot.narratorId).toBe("elara");
    expect(useWitnessingStore.getState().currentRoomId).toBe("observation_deck");
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBe("elara");
  });

  it("seats The Human on the Comms Array with neutral bonds", () => {
    const slot = useWitnessingStore.getState().enterRoom(
      "comms_array",
      { elaraBond: 50, humanBond: 50 },
    );
    expect(slot.narratorId).toBe("the_human");
  });

  it("increments visit counts across repeated entries", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    expect(useWitnessingStore.getState().visitCounts.archives).toBe(3);
  });

  it("forcing flags override bond-weighted selection", () => {
    const slot = useWitnessingStore.getState().enterRoom(
      "observation_deck",
      { elaraBond: 100, humanBond: 0 },
      new Set(["narrator_beat_4_swap"]),
    );
    expect(slot.narratorId).toBe("the_human");
    expect(slot.reason).toBe("forced_by_flag");
  });

  it("two_witnesses_silence_phase flag returns a null narrator", () => {
    const slot = useWitnessingStore.getState().enterRoom(
      "memorial_corridor",
      { elaraBond: 80, humanBond: 80 },
      new Set(["two_witnesses_silence_phase"]),
    );
    expect(slot.narratorId).toBeNull();
    expect(slot.reason).toBe("forced_by_flag");
  });
});

describe("witnessingStore.dismiss", () => {
  it("give_space costs 2 bond on the present narrator", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 }); // Human seated
    const deltas = store.dismiss("give_space", { elaraBond: 50, humanBond: 50 });
    expect(deltas.humanBond).toBe(-2);
    expect(deltas.elaraBond).toBe(0);
    expect(deltas.unlockPotentialAlonePage).toBe(false);
  });

  it("rather_hear_other swaps the slot mid-room", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 }); // Human seated
    const deltas = store.dismiss("rather_hear_other", {
      elaraBond: 50,
      humanBond: 50,
    });
    // Human dismissed (-5), Elara summoned (+3).
    expect(deltas.humanBond).toBe(-5);
    expect(deltas.elaraBond).toBe(3);
    // And the in-store slot should now show Elara.
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBe("elara");
  });

  it("both_out silences the slot and unlocks the Potential Alone page", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("bridge", { elaraBond: 80, humanBond: 20 }); // Elara seated
    const deltas = store.dismiss("both_out", { elaraBond: 80, humanBond: 20 });
    expect(deltas).toEqual({
      elaraBond: -3,
      humanBond: -3,
      unlockPotentialAlonePage: true,
    });
    expect(useWitnessingStore.getState().potentialAloneUnlocked).toBe(true);
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBeNull();
  });

  it("hard dismissal swap window ends after three room changes", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 }); // Human
    store.dismiss("rather_hear_other", { elaraBond: 50, humanBond: 50 });

    // Three subsequent rooms should stay Elara because the hard swap
    // consumes rooms.
    store.enterRoom("comms_array", { elaraBond: 50, humanBond: 50 });
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBe("elara");

    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBe("elara");

    store.enterRoom("engineering", { elaraBond: 50, humanBond: 50 });
    // At this point swapRoomsRemaining has been ticked 3 times; the
    // next entry should roll normally again.

    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    expect(useWitnessingStore.getState().currentSlot?.narratorId).toBe("the_human");
  });
});

describe("witnessingStore.playSlideshow", () => {
  it("accepts a definition object directly", () => {
    const onComplete = vi.fn();
    const ok = useWitnessingStore
      .getState()
      .playSlideshow(LAST_WORDS_SLIDESHOW, { onComplete });
    expect(ok).toBe(true);
    expect(useWitnessingStore.getState().activeSlideshow?.def.id).toBe(
      "last-words",
    );
  });

  it("accepts a registry id string", () => {
    const ok = useWitnessingStore.getState().playSlideshow("last-words");
    expect(ok).toBe(true);
    expect(useWitnessingStore.getState().activeSlideshow?.def.id).toBe(
      "last-words",
    );
  });

  it("rejects unknown ids and leaves activeSlideshow null", () => {
    const ok = useWitnessingStore.getState().playSlideshow("does-not-exist");
    expect(ok).toBe(false);
    expect(useWitnessingStore.getState().activeSlideshow).toBeNull();
  });

  it("completeActiveSlideshow fires the onComplete callback exactly once", () => {
    const onComplete = vi.fn();
    useWitnessingStore
      .getState()
      .playSlideshow(LAST_WORDS_SLIDESHOW, { onComplete });
    useWitnessingStore.getState().completeActiveSlideshow();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(useWitnessingStore.getState().activeSlideshow).toBeNull();

    // Second call is a no-op because the slideshow is already cleared.
    useWitnessingStore.getState().completeActiveSlideshow();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("closeActiveSlideshow fires onClose instead of onComplete", () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();
    useWitnessingStore
      .getState()
      .playSlideshow(LAST_WORDS_SLIDESHOW, { onComplete, onClose });
    useWitnessingStore.getState().closeActiveSlideshow();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(useWitnessingStore.getState().activeSlideshow).toBeNull();
  });
});

describe("witnessingStore.reset", () => {
  it("clears every piece of transient state", () => {
    const store = useWitnessingStore.getState();
    store.enterRoom("archives", { elaraBond: 50, humanBond: 50 });
    store.dismiss("both_out", { elaraBond: 50, humanBond: 50 });
    store.playSlideshow("last-words");
    store.reset();
    const after = useWitnessingStore.getState();
    expect(after.currentRoomId).toBeNull();
    expect(after.currentSlot).toBeNull();
    expect(after.dismissal).toBeNull();
    expect(after.potentialAloneUnlocked).toBe(false);
    expect(after.activeSlideshow).toBeNull();
    expect(after.visitCounts).toEqual({});
  });
});
