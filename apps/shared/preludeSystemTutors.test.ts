import { describe, expect, it } from "vitest";
import {
  PRELUDE_SYSTEM_TUTORS,
  getPreludeSystemTutor,
  getUsageHint,
  shouldShowIntro,
  type PreludeSystemId,
} from "./preludeSystemTutors";

const REQUIRED_SYSTEMS: PreludeSystemId[] = [
  "mission_board",
  "inbox",
  "witnessing",
];

describe("preludeSystemTutors", () => {
  it("registers a tutor for every required system", () => {
    for (const system of REQUIRED_SYSTEMS) {
      expect(getPreludeSystemTutor(system), `missing tutor for ${system}`).toBeDefined();
    }
  });

  it("assigns a canonical speaker to each system", () => {
    expect(getPreludeSystemTutor("mission_board")?.speaker).toBe("locke");
    expect(getPreludeSystemTutor("inbox")?.speaker).toBe("human");
    expect(getPreludeSystemTutor("witnessing")?.speaker).toBe("seer");
  });

  it("authors a non-empty introText, justification, and at least 2 usage hints", () => {
    for (const tutor of PRELUDE_SYSTEM_TUTORS) {
      expect(tutor.introText.trim().length).toBeGreaterThan(0);
      expect(tutor.narrativeJustification.trim().length).toBeGreaterThan(0);
      expect(Object.keys(tutor.usageHints).length).toBeGreaterThanOrEqual(2);
      for (const [action, hint] of Object.entries(tutor.usageHints)) {
        expect(action.length).toBeGreaterThan(0);
        expect(hint.trim().length, `${tutor.systemId} hint ${action} empty`).toBeGreaterThan(0);
      }
    }
  });

  it("getUsageHint returns the matching cue or null", () => {
    expect(getUsageHint("mission_board", "posting_opened")).toContain("body");
    expect(getUsageHint("mission_board", "does_not_exist")).toBeNull();
    expect(getUsageHint("inbox", "message_replied")).toContain("commitment");
  });

  it("shouldShowIntro respects trigger and completion flags", () => {
    const empty = new Set<string>();
    expect(shouldShowIntro("mission_board", empty)).toBe(false);

    const triggered = new Set(["prelude_beat_d_first_slate_read"]);
    expect(shouldShowIntro("mission_board", triggered)).toBe(true);

    const completed = new Set([
      "prelude_beat_d_first_slate_read",
      "prelude_tutor_mission_board_seen",
    ]);
    expect(shouldShowIntro("mission_board", completed)).toBe(false);
  });

  it("trigger and completion flags are unique per tutor", () => {
    const triggers = PRELUDE_SYSTEM_TUTORS.map((t) => t.triggerFlag);
    const completions = PRELUDE_SYSTEM_TUTORS.map((t) => t.completionFlag);
    expect(new Set(triggers).size).toBe(triggers.length);
    expect(new Set(completions).size).toBe(completions.length);
    for (const c of completions) expect(triggers).not.toContain(c);
  });
});
