import { describe, expect, it } from "vitest";
import {
  SILENT_UNLOCK_TUTORS,
  getSilentUnlockTutor,
  getSilentUsageHint,
  shouldShowSilentUnlockIntro,
  getPendingSilentUnlockTutors,
  type SilentUnlockSystemId,
  type SilentUnlockSpeaker,
} from "./silentUnlockTutors";
import { FEATURE_ROADMAP } from "./featureRoadmap";

const REQUIRED_SYSTEMS: SilentUnlockSystemId[] = [
  "character_sheet",
  "crew_activity_feed",
  "bestiary",
  "loredex",
  "combat_simulator",
  "daily_quests",
];

const CANONICAL_SPEAKERS: Record<SilentUnlockSystemId, SilentUnlockSpeaker> = {
  character_sheet: "elara",
  crew_activity_feed: "the_resurrectionist",
  bestiary: "the_antiquarian",
  loredex: "the_antiquarian",
  combat_simulator: "iron_lion",
  daily_quests: "adjudicator_locke",
};

describe("silentUnlockTutors", () => {
  it("registers a tutor for each of the 6 silent-unlock systems", () => {
    for (const system of REQUIRED_SYSTEMS) {
      expect(
        getSilentUnlockTutor(system),
        `missing tutor for ${system}`,
      ).toBeDefined();
    }
    expect(SILENT_UNLOCK_TUTORS).toHaveLength(REQUIRED_SYSTEMS.length);
  });

  it("assigns the canonical speaker to each system (NPC-voicing pass)", () => {
    for (const system of REQUIRED_SYSTEMS) {
      expect(getSilentUnlockTutor(system)?.speaker).toBe(
        CANONICAL_SPEAKERS[system],
      );
    }
  });

  it("authors a non-empty introText, justification, and at least 2 usage hints", () => {
    for (const tutor of SILENT_UNLOCK_TUTORS) {
      expect(tutor.introText.trim().length).toBeGreaterThan(40);
      expect(tutor.narrativeJustification.trim().length).toBeGreaterThan(40);
      expect(Object.keys(tutor.usageHints).length).toBeGreaterThanOrEqual(2);
      for (const [action, hint] of Object.entries(tutor.usageHints)) {
        expect(action.length).toBeGreaterThan(0);
        expect(
          hint.trim().length,
          `${tutor.systemId} hint ${action} empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every featureRoadmapId points to a real FeatureUnlock entry", () => {
    const ids = new Set(FEATURE_ROADMAP.map((f) => f.featureId));
    for (const tutor of SILENT_UNLOCK_TUTORS) {
      expect(
        ids.has(tutor.featureRoadmapId),
        `unknown featureRoadmapId ${tutor.featureRoadmapId} on ${tutor.systemId}`,
      ).toBe(true);
    }
  });

  it("getSilentUsageHint returns the matching cue or null", () => {
    expect(getSilentUsageHint("character_sheet", "dossier_opened")).toContain(
      "forty seconds",
    );
    expect(getSilentUsageHint("character_sheet", "does_not_exist")).toBeNull();
    expect(getSilentUsageHint("loredex", "entry_read")).toContain("fingerprint");
  });

  it("shouldShowSilentUnlockIntro respects trigger and completion flags", () => {
    const empty = new Set<string>();
    expect(shouldShowSilentUnlockIntro("character_sheet", empty)).toBe(false);

    const triggered = new Set(["prelude_cryo_bay_entered"]);
    expect(shouldShowSilentUnlockIntro("character_sheet", triggered)).toBe(true);

    const completed = new Set([
      "prelude_cryo_bay_entered",
      "silent_tutor_character_sheet_seen",
    ]);
    expect(shouldShowSilentUnlockIntro("character_sheet", completed)).toBe(false);
  });

  it("trigger and completion flags are unique across all 6 tutors", () => {
    const triggers = SILENT_UNLOCK_TUTORS.map((t) => t.triggerFlag);
    const completions = SILENT_UNLOCK_TUTORS.map((t) => t.completionFlag);
    expect(new Set(completions).size).toBe(completions.length);
    // Trigger flags MAY repeat (e.g. two systems both gate on
    // "prelude_archives_entered"); only completion flags must be unique.
    for (const c of completions) expect(triggers).not.toContain(c);
  });

  it("getPendingSilentUnlockTutors returns every triggered-but-unseen tutor", () => {
    const flags = new Set([
      "prelude_cryo_bay_entered", // character_sheet trigger fired
      "prelude_bridge_entered", // daily_quests trigger fired
      "silent_tutor_daily_quests_seen", // daily_quests already dismissed
    ]);
    const pending = getPendingSilentUnlockTutors(flags);
    expect(pending.map((t) => t.systemId)).toEqual(["character_sheet"]);
  });
});
