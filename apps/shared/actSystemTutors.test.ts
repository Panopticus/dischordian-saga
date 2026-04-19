import { describe, expect, it } from "vitest";
import {
  ACT_SYSTEM_TUTORS,
  getActSystemTutor,
  getActUsageHint,
  shouldShowActIntro,
  type ActSystemId,
} from "./actSystemTutors";

const REQUIRED_SYSTEMS: ActSystemId[] = [
  "army_recruit",
  "star_map",
  "confession_journal",
];

describe("actSystemTutors", () => {
  it("registers a tutor for every required Act 2+ system", () => {
    for (const system of REQUIRED_SYSTEMS) {
      expect(
        getActSystemTutor(system),
        `missing tutor for ${system}`,
      ).toBeDefined();
    }
  });

  it("assigns a canonical speaker to each system", () => {
    expect(getActSystemTutor("army_recruit")?.speaker).toBe("locke");
    expect(getActSystemTutor("star_map")?.speaker).toBe("human");
    expect(getActSystemTutor("confession_journal")?.speaker).toBe("elara");
  });

  it("gates each tutor to the right narrative window", () => {
    expect(getActSystemTutor("army_recruit")?.actWindow).toBe(5);
    expect(getActSystemTutor("star_map")?.actWindow).toBe(5);
    expect(getActSystemTutor("confession_journal")?.actWindow).toBe(6);
  });

  it("authors a non-empty introText, justification, and ≥ 3 usage hints", () => {
    for (const tutor of ACT_SYSTEM_TUTORS) {
      expect(tutor.introText.trim().length).toBeGreaterThan(0);
      expect(tutor.narrativeJustification.trim().length).toBeGreaterThan(0);
      expect(
        Object.keys(tutor.usageHints).length,
        `${tutor.systemId} has < 3 usage hints`,
      ).toBeGreaterThanOrEqual(3);
      for (const [action, hint] of Object.entries(tutor.usageHints)) {
        expect(action.length).toBeGreaterThan(0);
        expect(
          hint.trim().length,
          `${tutor.systemId} hint ${action} empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("uses a <system>_first_open / <system>_tutor_seen flag convention", () => {
    for (const tutor of ACT_SYSTEM_TUTORS) {
      expect(tutor.triggerFlag).toBe(`${tutor.systemId}_first_open`);
      expect(tutor.completionFlag).toBe(`${tutor.systemId}_tutor_seen`);
    }
  });

  it("getActUsageHint returns the matching cue or null", () => {
    expect(getActUsageHint("army_recruit", "dossier_opened")).toContain("long paragraph");
    expect(getActUsageHint("army_recruit", "does_not_exist")).toBeNull();
    expect(getActUsageHint("star_map", "pin_inspected")).toContain("name");
    expect(getActUsageHint("confession_journal", "entry_added")).toContain("logged");
  });

  it("shouldShowActIntro respects trigger and completion flags", () => {
    const empty = new Set<string>();
    expect(shouldShowActIntro("army_recruit", empty)).toBe(false);

    const triggered = new Set<string>(["army_recruit_first_open"]);
    expect(shouldShowActIntro("army_recruit", triggered)).toBe(true);

    const dismissed = new Set<string>([
      "army_recruit_first_open",
      "army_recruit_tutor_seen",
    ]);
    expect(shouldShowActIntro("army_recruit", dismissed)).toBe(false);
  });

  it("keeps every tutor id globally unique", () => {
    const ids = ACT_SYSTEM_TUTORS.map((t) => t.systemId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
