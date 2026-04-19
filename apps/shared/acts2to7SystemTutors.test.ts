import { describe, expect, it } from "vitest";
import {
  ACTS_2_TO_7_SYSTEM_TUTORS,
  getActsSystemTutor,
  getActsUsageHint,
  shouldShowActsIntro,
  type Acts2To7SystemId,
} from "./acts2to7SystemTutors";

const REQUIRED_SYSTEMS: Acts2To7SystemId[] = [
  "dual_channel",
  "substrate_panel",
  "war_room",
  "star_map",
  "confession_journal",
  "convergence_bridge",
];

describe("acts2to7SystemTutors", () => {
  it("registers a tutor for every required system", () => {
    for (const system of REQUIRED_SYSTEMS) {
      expect(
        getActsSystemTutor(system),
        `missing tutor for ${system}`
      ).toBeDefined();
    }
  });

  it("routes each system to its canonical speaker", () => {
    expect(getActsSystemTutor("dual_channel")?.speaker).toBe("elara");
    expect(getActsSystemTutor("substrate_panel")?.speaker).toBe("human");
    expect(getActsSystemTutor("war_room")?.speaker).toBe("elara");
    expect(getActsSystemTutor("star_map")?.speaker).toBe("kael_log");
    expect(getActsSystemTutor("confession_journal")?.speaker).toBe("antiquarian");
    expect(getActsSystemTutor("convergence_bridge")?.speaker).toBe("dual");
  });

  it("unlocks each system from the expected act", () => {
    expect(getActsSystemTutor("dual_channel")?.unlockedFromAct).toBe(2);
    expect(getActsSystemTutor("substrate_panel")?.unlockedFromAct).toBe(3);
    expect(getActsSystemTutor("war_room")?.unlockedFromAct).toBe(4);
    expect(getActsSystemTutor("star_map")?.unlockedFromAct).toBe(5);
    expect(getActsSystemTutor("confession_journal")?.unlockedFromAct).toBe(6);
    expect(getActsSystemTutor("convergence_bridge")?.unlockedFromAct).toBe(7);
  });

  it("authors a non-empty introText, justification, and at least 2 usage hints", () => {
    for (const tutor of ACTS_2_TO_7_SYSTEM_TUTORS) {
      expect(tutor.introText.trim().length).toBeGreaterThan(0);
      expect(tutor.narrativeJustification.trim().length).toBeGreaterThan(0);
      expect(
        Object.keys(tutor.usageHints).length,
        `${tutor.systemId} has fewer than 2 usage hints`
      ).toBeGreaterThanOrEqual(2);
      for (const [action, hint] of Object.entries(tutor.usageHints)) {
        expect(action.length).toBeGreaterThan(0);
        expect(
          hint.trim().length,
          `${tutor.systemId} hint ${action} empty`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("trigger and completion flags are unique per tutor", () => {
    const triggers = ACTS_2_TO_7_SYSTEM_TUTORS.map((t) => t.triggerFlag);
    const completions = ACTS_2_TO_7_SYSTEM_TUTORS.map((t) => t.completionFlag);
    expect(new Set(triggers).size).toBe(triggers.length);
    expect(new Set(completions).size).toBe(completions.length);
    for (const c of completions) expect(triggers).not.toContain(c);
  });

  it("getActsUsageHint returns the matching cue or null", () => {
    expect(getActsUsageHint("war_room", "mission_pinned")).toContain("promise");
    expect(getActsUsageHint("star_map", "route_drawn")).toContain("Verify");
    expect(getActsUsageHint("dual_channel", "does_not_exist")).toBeNull();
  });

  it("shouldShowActsIntro respects trigger and completion flags", () => {
    const empty = new Set<string>();
    expect(shouldShowActsIntro("dual_channel", empty)).toBe(false);

    const triggered = new Set(["act2_dual_signal_activated"]);
    expect(shouldShowActsIntro("dual_channel", triggered)).toBe(true);

    const completed = new Set([
      "act2_dual_signal_activated",
      "act2_tutor_dual_channel_seen",
    ]);
    expect(shouldShowActsIntro("dual_channel", completed)).toBe(false);
  });

  it("covers every act from 2 through 7 with at least one tutor", () => {
    for (const act of [2, 3, 4, 5, 6, 7]) {
      const tutors = ACTS_2_TO_7_SYSTEM_TUTORS.filter(
        (t) => t.unlockedFromAct === act
      );
      expect(
        tutors.length,
        `Act ${act} has no system tutor`
      ).toBeGreaterThan(0);
    }
  });
});
