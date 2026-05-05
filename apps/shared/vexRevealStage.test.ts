import { describe, it, expect } from "vitest";

import {
  nextStageRequirements,
  resolveVexRevealStage,
} from "./vexRevealStage";

describe("resolveVexRevealStage", () => {
  it("defaults to eyes_of_reality before any flags or act 2", () => {
    expect(resolveVexRevealStage({ flags: new Set(), act: 1 })).toBe(
      "eyes_of_reality",
    );
  });

  it("advances to vex_public on act 2 even without explicit flag", () => {
    expect(resolveVexRevealStage({ flags: new Set(), act: 2 })).toBe(
      "vex_public",
    );
  });

  it("advances to vex_public when the first-contact flag fires regardless of act", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["vex_public_first_contact"]),
        act: 1,
      }),
    ).toBe("vex_public");
  });

  it("advances to engineer_zero_hint when the governance flag is set", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["engineer_zero_hint"]),
        act: 4,
      }),
    ).toBe("engineer_zero_hint");
  });

  it("does NOT advance to confirmed before act 5", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["engineer_zero_hint", "act_5_engineer_corroboration_seen"]),
        act: 4,
      }),
    ).toBe("engineer_zero_hint");
  });

  it("advances to confirmed at act 5 with hint + corroboration", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["engineer_zero_hint", "act_5_engineer_corroboration_seen"]),
        act: 5,
      }),
    ).toBe("engineer_zero_confirmed");
  });

  it("advances to confirmed via the romance stage-2 'played for one listener' beat", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["engineer_zero_hint", "vex_played_for_one_listener"]),
        act: 5,
      }),
    ).toBe("engineer_zero_confirmed");
  });

  it("respects an explicit engineer_zero_confirmed flag (manual override / NG+)", () => {
    expect(
      resolveVexRevealStage({
        flags: new Set(["engineer_zero_confirmed"]),
        act: 1,
      }),
    ).toBe("engineer_zero_confirmed");
  });
});

describe("nextStageRequirements", () => {
  it("returns the canonical advancement chain", () => {
    expect(nextStageRequirements("eyes_of_reality")?.nextStage).toBe(
      "vex_public",
    );
    expect(nextStageRequirements("vex_public")?.nextStage).toBe(
      "engineer_zero_hint",
    );
    expect(nextStageRequirements("engineer_zero_hint")?.nextStage).toBe(
      "engineer_zero_confirmed",
    );
    expect(nextStageRequirements("engineer_zero_confirmed")).toBeNull();
  });
});
