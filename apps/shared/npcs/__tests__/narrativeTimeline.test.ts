// apps/shared/npcs/__tests__/narrativeTimeline.test.ts
//
// Validates the canonical narrative timeline registry (Phase 5).

import { describe, it, expect } from "vitest";
import {
  NARRATIVE_TIMELINE,
  entryPointFor,
  entryPointsByPhase,
  canEncounterForFirstTime,
} from "../narrativeTimeline";

describe("NARRATIVE_TIMELINE", () => {
  it("ships entry points for all 13 timeline characters (11 priority + Elara + Human; Wraith has 2)", () => {
    // 11 priority-roster + Elara + Human = 13 unique characters.
    // Wraith Calder has TWO entry points (pre_arena Ch3b + post_arena Hierophant).
    // Total: 13 + 1 = 14 registry entries.
    expect(NARRATIVE_TIMELINE.length).toBe(14);
  });

  it("every entry has a non-empty firstMajorSceneLineId", () => {
    for (const entry of NARRATIVE_TIMELINE) {
      expect(entry.firstMajorSceneLineId.length, entry.npcKey).toBeGreaterThan(0);
    }
  });

  it("every entry has a canonical rationale", () => {
    for (const entry of NARRATIVE_TIMELINE) {
      expect(entry.canonicalRationale.length, entry.npcKey).toBeGreaterThan(0);
    }
  });

  it("pre_act_1 phase has exactly 3 characters (Elara + Human + Eidolon)", () => {
    const preAct1 = entryPointsByPhase("pre_act_1");
    expect(preAct1.length).toBe(3);
    const npcKeys = preAct1.map(e => e.npcKey);
    expect(npcKeys).toContain("elara");
    expect(npcKeys).toContain("the_human");
    expect(npcKeys).toContain("your_eidolon");
  });

  it("pre_act_1 phase entries are ordered: Elara → Human → Eidolon", () => {
    const preAct1 = entryPointsByPhase("pre_act_1");
    expect(preAct1[0]?.npcKey).toBe("elara");
    expect(preAct1[1]?.npcKey).toBe("the_human");
    expect(preAct1[2]?.npcKey).toBe("your_eidolon");
  });

  it("act_1 phase contains canonical chapter-cycle characters", () => {
    const act1 = entryPointsByPhase("act_1");
    const npcKeys = act1.map(e => e.npcKey);
    expect(npcKeys).toContain("wraith_calder");
    expect(npcKeys).toContain("vex_solene");
    expect(npcKeys).toContain("the_seer");
    expect(npcKeys).toContain("the_degen");
    expect(npcKeys).toContain("the_game_master");
    expect(npcKeys).toContain("the_meme");
  });

  it("post_act_1 phase contains Trade Empire-anchored characters", () => {
    const postAct1 = entryPointsByPhase("post_act_1");
    const npcKeys = postAct1.map(e => e.npcKey);
    expect(npcKeys).toContain("adjudicator_locke");
    expect(npcKeys).toContain("nilmorg");
    // Wraith returns as post-rite Hierophant
    expect(npcKeys).toContain("wraith_calder");
  });

  it("Companion entry is gated on severance_prize_paid ripple", () => {
    const companion = entryPointFor("dmc_clone_companion")[0];
    expect(companion).toBeDefined();
    expect(companion?.phase).toBe("post_dmc_season");
    expect(companion?.gate.requiredRippleEvent).toBe("severance_prize_paid");
  });

  it("Oracle entry is gated on Acts 4+ + Ch5 completion", () => {
    const oracle = entryPointFor("the_oracle")[0];
    expect(oracle).toBeDefined();
    expect(oracle?.phase).toBe("acts_4_plus");
    expect(oracle?.gate.minAct).toBe(5);
    expect(oracle?.gate.flags).toContain("ch5_complete");
  });

  it("Locke entry is gated on Authority Trial outcome", () => {
    const locke = entryPointFor("adjudicator_locke")[0];
    expect(locke).toBeDefined();
    expect(locke?.gate.requiredTrialOutcome).toBe("delay");
    // Execution forecloses Locke; canonical 'her job IS the Authority's contracts'
  });

  it("Wraith Calder has TWO entry points (pre_arena + post_arena)", () => {
    const wraith = entryPointFor("wraith_calder");
    expect(wraith.length).toBe(2);
    const phases = wraith.map(e => e.phase);
    expect(phases).toContain("act_1");
    expect(phases).toContain("post_act_1");
  });
});

describe("canEncounterForFirstTime — gating", () => {
  function emptyCtx() {
    return {
      publicFlags: new Set<string>(),
      flags: new Set<string>(),
      act: 1,
      completedChapters: new Set<string>(),
      rippleEventsFired: new Set<string>(),
    };
  }

  it("denies fresh player from encountering Locke (no Trade Empire unlock)", () => {
    const locke = entryPointFor("adjudicator_locke")[0]!;
    expect(canEncounterForFirstTime(locke, emptyCtx())).toBe(false);
  });

  it("permits Locke encounter when full conditions met", () => {
    const locke = entryPointFor("adjudicator_locke")[0]!;
    const ctx = {
      ...emptyCtx(),
      flags: new Set(["trade_empire_unlocked"]),
      trialOutcome: "delay" as const,
    };
    expect(canEncounterForFirstTime(locke, ctx)).toBe(true);
  });

  it("denies Companion encounter without severance_prize_paid ripple", () => {
    const companion = entryPointFor("dmc_clone_companion")[0]!;
    const ctx = {
      ...emptyCtx(),
      flags: new Set(["nilmorg_kept_his_agreement"]),
    };
    expect(canEncounterForFirstTime(companion, ctx)).toBe(false);
  });

  it("permits Companion encounter when ripple fired + flag set", () => {
    const companion = entryPointFor("dmc_clone_companion")[0]!;
    const ctx = {
      ...emptyCtx(),
      flags: new Set(["nilmorg_kept_his_agreement"]),
      rippleEventsFired: new Set(["severance_prize_paid"]),
    };
    expect(canEncounterForFirstTime(companion, ctx)).toBe(true);
  });

  it("denies Oracle encounter pre-Act 5", () => {
    const oracle = entryPointFor("the_oracle")[0]!;
    const ctx = {
      ...emptyCtx(),
      flags: new Set(["ch5_complete"]),
      act: 4,
    };
    expect(canEncounterForFirstTime(oracle, ctx)).toBe(false);
  });

  it("permits Oracle encounter at Act 5 + Ch5 complete", () => {
    const oracle = entryPointFor("the_oracle")[0]!;
    const ctx = {
      ...emptyCtx(),
      flags: new Set(["ch5_complete"]),
      act: 5,
    };
    expect(canEncounterForFirstTime(oracle, ctx)).toBe(true);
  });
});
