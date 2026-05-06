import { describe, it, expect } from "vitest";
import {
  ROMANCE_ACT_SCENES,
  isSceneEligible,
  listScenesForAct,
  listScenesForCandidate,
  pickActScene,
} from "./romanceActScenes";

describe("ROMANCE_ACT_SCENES — invariants", () => {
  it("ships at least 6 seed scenes (≥ 2 per anchor candidate)", () => {
    expect(ROMANCE_ACT_SCENES.length).toBeGreaterThanOrEqual(6);
  });

  it("every scene has at least 2 lines", () => {
    for (const s of ROMANCE_ACT_SCENES) {
      expect(s.lines.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("requiresFlag is either a romance:committed:* gate OR an act-started gate paired with excludeFlags", () => {
    for (const s of ROMANCE_ACT_SCENES) {
      const isCommitGate = /^romance:committed:/.test(s.requiresFlag);
      const isAnchorGate =
        /^(act_\d_started|act_\d_complete|narrative_spine_complete)$/.test(s.requiresFlag) &&
        (s.excludeFlags?.length ?? 0) > 0;
      expect(
        isCommitGate || isAnchorGate,
        `${s.id}: requiresFlag '${s.requiresFlag}' doesn't follow either pattern`,
      ).toBe(true);
    }
  });
});

describe("listScenesForAct + listScenesForCandidate", () => {
  it("filters by act", () => {
    const out = listScenesForAct("act_6");
    expect(out.length).toBeGreaterThan(0);
    for (const s of out) expect(s.actId).toBe("act_6");
  });

  it("filters by candidate", () => {
    const out = listScenesForCandidate("locke");
    expect(out.length).toBeGreaterThan(0);
    for (const s of out) expect(s.candidateId).toBe("locke");
  });
});

describe("isSceneEligible", () => {
  const locke6 = ROMANCE_ACT_SCENES.find((s) => s.id === "rom_locke_act6_intro")!;

  it("returns false when commit flag is missing", () => {
    expect(isSceneEligible(locke6, { flags: {} })).toBe(false);
  });

  it("returns true when commit flag is set and no exclude flags trip", () => {
    expect(
      isSceneEligible(locke6, { flags: { "romance:committed:locke": true } }),
    ).toBe(true);
  });

  it("respects excludeFlags when present", () => {
    const fake = { ...locke6, excludeFlags: ["breakup_locke"] };
    expect(
      isSceneEligible(fake, {
        flags: { "romance:committed:locke": true, breakup_locke: true },
      }),
    ).toBe(false);
  });
});

describe("pickActScene", () => {
  it("returns the matching close-beat scene for the romanced candidate", () => {
    const out = pickActScene("act_3", "act_close", {
      flags: { "romance:committed:locke": true },
    });
    expect(out?.id).toBe("rom_locke_act3_close");
  });

  it("returns null when no romance commit is active", () => {
    expect(pickActScene("act_3", "act_close", { flags: {} })).toBeNull();
  });

  it("returns null when no scene authored for that act/beat combo", () => {
    expect(
      pickActScene("act_2", "act_intro", {
        flags: { "romance:committed:elara": true },
      }),
    ).toBeNull();
  });
});
