import { describe, it, expect } from "vitest";

import { resolveVexRevealStage } from "../../shared/vexRevealStage";

// The advancer is itself I/O-bound (DB read/write). We verify
// the *resolver semantics* the advancer relies on here, since
// they're what determines newlyConfirmed=true vs false. The
// I/O path is a thin call-through to drizzle that doesn't
// merit a mock.

describe("Vex reveal advancement semantics (resolver inputs)", () => {
  it("does not confirm without engineer_zero_hint regardless of act", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["vex_played_for_one_listener"]),
      act: 7,
    });
    expect(stage).not.toBe("engineer_zero_confirmed");
  });

  it("does not confirm on engineer_zero_hint alone before Act 5", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["engineer_zero_hint"]),
      act: 4,
    });
    expect(stage).toBe("engineer_zero_hint");
  });

  it("does not confirm on engineer_zero_hint alone at Act 5+ without corroboration", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["engineer_zero_hint"]),
      act: 5,
    });
    expect(stage).toBe("engineer_zero_hint");
  });

  it("confirms via romance stage-2 path: hint + vex_played_for_one_listener at Act 5", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["engineer_zero_hint", "vex_played_for_one_listener"]),
      act: 5,
    });
    expect(stage).toBe("engineer_zero_confirmed");
  });

  it("confirms via Act 5 corroboration path", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["engineer_zero_hint", "act_5_engineer_corroboration_seen"]),
      act: 5,
    });
    expect(stage).toBe("engineer_zero_confirmed");
  });

  it("respects an explicit engineer_zero_confirmed flag (advancer would no-op)", () => {
    const stage = resolveVexRevealStage({
      flags: new Set(["engineer_zero_confirmed"]),
      act: 1,
    });
    expect(stage).toBe("engineer_zero_confirmed");
  });
});
