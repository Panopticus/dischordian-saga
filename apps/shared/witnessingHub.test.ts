import { describe, it, expect } from "vitest";
import { deriveWitnessingHubState } from "./witnessingHub";
import { KAEL_FRAGMENTS } from "./appendixBKaelQuestline";

describe("witnessingHub — deriveWitnessingHubState", () => {
  const baseInputs = {
    flags: {},
    yearOneMonth: 1,
    act1CardWins: 0,
    zephyrDepth: 0,
    moralityScore: 0,
  };

  it("returns a prelude act for a fresh save", () => {
    const state = deriveWitnessingHubState(baseInputs);
    expect(state.currentAct).toBe("prelude");
    expect(state.currentActTitle).toContain("Prelude");
  });

  it("advances to act 1 when the player has card wins", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      act1CardWins: 3,
    });
    expect(state.currentAct).toBe("act_1");
  });

  it("detects Act 2 on crafting_mastered", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: { crafting_mastered: true },
    });
    expect(state.currentAct).toBe("act_2");
  });

  it("detects Act 3 when an infiltration path is committed", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: { act3_insurgency_committed: true },
    });
    expect(state.currentAct).toBe("act_3");
  });

  it("Act 5 trumps every other detection", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: {
        act_5_started: true,
        act3_empire_committed: true,
        crafting_mastered: true,
      },
      act1CardWins: 9,
    });
    expect(state.currentAct).toBe("act_5");
  });

  it("reports zero Kael Fragments unlocked on fresh save", () => {
    const state = deriveWitnessingHubState(baseInputs);
    expect(state.kaelFragments.unlockedCount).toBe(0);
    expect(state.kaelFragments.totalCount).toBe(KAEL_FRAGMENTS.length);
    expect(state.kaelFragments.questlineComplete).toBe(false);
  });

  it("reports questline complete when all six flags are set", () => {
    const allSix: Record<string, boolean> = {};
    for (const f of KAEL_FRAGMENTS) allSix[f.flag] = true;
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: allSix,
    });
    expect(state.kaelFragments.unlockedCount).toBe(KAEL_FRAGMENTS.length);
    expect(state.kaelFragments.questlineComplete).toBe(true);
  });

  it("marks a Kael Fragment as pending when conditions are met", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: { terminus_swarm_wave_10_first_complete: true },
    });
    const f1 = state.kaelFragments.entries.find(
      (e) => e.fragment.id === "f1",
    );
    expect(f1?.pending).toBe(true);
    expect(f1?.unlocked).toBe(false);
  });

  it("prelude panel reports available missions once crew joins", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: { prelude_patch_joined: true },
    });
    expect(state.prelude.crewOnboard).toContain("patch");
    expect(state.prelude.availableMissions.length).toBeGreaterThan(0);
  });

  it("calendar panel returns the correct current month", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      yearOneMonth: 7,
    });
    expect(state.calendar.current.month).toBe(7);
    expect(state.calendar.upcoming.every((r) => r.month > 7)).toBe(true);
    expect(state.calendar.past.every((r) => r.month < 7)).toBe(true);
  });

  it("calendar panel clamps out-of-range months", () => {
    const low = deriveWitnessingHubState({ ...baseInputs, yearOneMonth: 0 });
    expect(low.calendar.current.month).toBe(1);
    const high = deriveWitnessingHubState({
      ...baseInputs,
      yearOneMonth: 99,
    });
    expect(high.calendar.current.month).toBe(12);
  });

  it("chronicle feed surfaces fired milestones in order", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: {
        event_two_witnesses_remember: true,
        event_lions_last_broadcast: true,
      },
    });
    expect(state.chronicleFeed.length).toBe(2);
    // Check they are in canonical order
    for (let i = 1; i < state.chronicleFeed.length; i++) {
      expect(state.chronicleFeed[i].order).toBeGreaterThan(
        state.chronicleFeed[i - 1].order,
      );
    }
  });

  it("infiltration panel returns the active path", () => {
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: { act3_empire_committed: true },
    });
    expect(state.infiltrationPath?.id).toBe("empire");
  });

  it("appendix summaries include A, B, and C", () => {
    const state = deriveWitnessingHubState(baseInputs);
    const ids = state.appendixSummaries.map((s) => s.appendix).sort();
    expect(ids).toEqual(["A", "B", "C"]);
  });

  it("appendix C is always 100% (quiz-show track shipped)", () => {
    const state = deriveWitnessingHubState(baseInputs);
    const c = state.appendixSummaries.find((s) => s.appendix === "C");
    expect(c?.progressPct).toBe(100);
  });

  it("appendix B progress climbs with unlocked Kael Fragments", () => {
    const threeFlags: Record<string, boolean> = {};
    threeFlags[KAEL_FRAGMENTS[0].flag] = true;
    threeFlags[KAEL_FRAGMENTS[1].flag] = true;
    threeFlags[KAEL_FRAGMENTS[2].flag] = true;
    const state = deriveWitnessingHubState({
      ...baseInputs,
      flags: threeFlags,
    });
    const b = state.appendixSummaries.find((s) => s.appendix === "B");
    expect(b?.shipped).toBe(3);
    expect(b?.progressPct).toBe(50);
  });
});
