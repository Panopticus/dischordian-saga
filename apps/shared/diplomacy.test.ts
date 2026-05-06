import { describe, it, expect } from "vitest";
import {
  EMBARGO_DURATION_MS,
  TREATY_DURATION_MS,
  applyAction,
  defaultRelationship,
  endWar,
  isEmbargoActive,
  isTreatyActive,
  reactionLine,
  relationFor,
  type RelationshipState,
} from "./diplomacy";

const fresh = (overrides: Partial<RelationshipState> = {}): RelationshipState => ({
  ...defaultRelationship("new_babylon"),
  ...overrides,
});

describe("relationFor", () => {
  it("war beats every standing", () => {
    expect(relationFor(fresh({ atWar: true, standing: 100 }))).toBe("war");
  });

  it("hostile at <= -50", () => {
    expect(relationFor(fresh({ standing: -75 }))).toBe("hostile");
  });

  it("wary in (-50, 0)", () => {
    expect(relationFor(fresh({ standing: -10 }))).toBe("wary");
  });

  it("neutral in [0, 25)", () => {
    expect(relationFor(fresh({ standing: 0 }))).toBe("neutral");
    expect(relationFor(fresh({ standing: 24 }))).toBe("neutral");
  });

  it("friendly in [25, 60)", () => {
    expect(relationFor(fresh({ standing: 25 }))).toBe("friendly");
    expect(relationFor(fresh({ standing: 59 }))).toBe("friendly");
  });

  it("allied at >= 60", () => {
    expect(relationFor(fresh({ standing: 60 }))).toBe("allied");
    expect(relationFor(fresh({ standing: 100 }))).toBe("allied");
  });
});

describe("applyAction — propose_treaty", () => {
  it("succeeds when no treaty / no war", () => {
    const r = applyAction(fresh(), "propose_treaty");
    expect(r.ok).toBe(true);
  });

  it("fails when at war", () => {
    const r = applyAction(fresh({ atWar: true }), "propose_treaty");
    expect(r.ok).toBe(false);
  });

  it("fails when treaty already active", () => {
    const r = applyAction(
      fresh({ treatyEndsAt: Date.now() + TREATY_DURATION_MS }),
      "propose_treaty",
    );
    expect(r.ok).toBe(false);
  });
});

describe("applyAction — accept_treaty", () => {
  it("sets treaty expiry now + TREATY_DURATION_MS and bumps standing", () => {
    const r = applyAction(fresh(), "accept_treaty", 1000);
    expect(r.ok).toBe(true);
    expect(r.state.treatyEndsAt).toBe(1000 + TREATY_DURATION_MS);
    expect(r.state.standing).toBe(0 + 15);
  });

  it("fails when at war", () => {
    expect(applyAction(fresh({ atWar: true }), "accept_treaty").ok).toBe(false);
  });
});

describe("applyAction — declare_war", () => {
  it("succeeds when no treaty + not already at war", () => {
    const r = applyAction(fresh(), "declare_war");
    expect(r.ok).toBe(true);
    expect(r.state.atWar).toBe(true);
    expect(r.state.standing).toBe(0 - 40);
  });

  it("fails when treaty active", () => {
    const r = applyAction(
      fresh({ treatyEndsAt: Date.now() + TREATY_DURATION_MS }),
      "declare_war",
    );
    expect(r.ok).toBe(false);
  });

  it("fails when already at war", () => {
    expect(applyAction(fresh({ atWar: true }), "declare_war").ok).toBe(false);
  });
});

describe("applyAction — embargo / lift_embargo", () => {
  it("embargo sets expiry + reduces standing", () => {
    const r = applyAction(fresh(), "embargo", 5000);
    expect(r.ok).toBe(true);
    expect(r.state.embargoEndsAt).toBe(5000 + EMBARGO_DURATION_MS);
    expect(r.state.standing).toBe(-10);
  });

  it("embargo fails when one is already active", () => {
    const r = applyAction(
      fresh({ embargoEndsAt: Date.now() + EMBARGO_DURATION_MS }),
      "embargo",
    );
    expect(r.ok).toBe(false);
  });

  it("lift_embargo clears the expiry", () => {
    const start = fresh({ embargoEndsAt: Date.now() + EMBARGO_DURATION_MS });
    const r = applyAction(start, "lift_embargo");
    expect(r.ok).toBe(true);
    expect(r.state.embargoEndsAt).toBeNull();
  });

  it("lift_embargo fails when no embargo is active", () => {
    expect(applyAction(fresh(), "lift_embargo").ok).toBe(false);
  });
});

describe("applyAction — break_treaty", () => {
  it("clears treaty + drops standing", () => {
    const start = fresh({ treatyEndsAt: Date.now() + TREATY_DURATION_MS, standing: 30 });
    const r = applyAction(start, "break_treaty");
    expect(r.ok).toBe(true);
    expect(r.state.treatyEndsAt).toBeNull();
    expect(r.state.standing).toBe(5); // 30 - 25
  });

  it("fails when no treaty exists", () => {
    expect(applyAction(fresh(), "break_treaty").ok).toBe(false);
  });
});

describe("isTreatyActive / isEmbargoActive", () => {
  it("expired timestamps read as inactive", () => {
    expect(isTreatyActive(fresh({ treatyEndsAt: 100 }), 5000)).toBe(false);
    expect(isEmbargoActive(fresh({ embargoEndsAt: 100 }), 5000)).toBe(false);
  });

  it("future timestamps read as active", () => {
    expect(isTreatyActive(fresh({ treatyEndsAt: 5000 }), 100)).toBe(true);
    expect(isEmbargoActive(fresh({ embargoEndsAt: 5000 }), 100)).toBe(true);
  });
});

describe("endWar", () => {
  it("clears the war flag and gives a small standing boost", () => {
    const out = endWar(fresh({ atWar: true, standing: -50 }), 10);
    expect(out.atWar).toBe(false);
    expect(out.standing).toBe(-40);
  });

  it("is a no-op when not at war", () => {
    const fresh2 = fresh({ atWar: false });
    expect(endWar(fresh2)).toBe(fresh2);
  });
});

describe("reactionLine", () => {
  it("returns the seeded line when available", () => {
    expect(reactionLine("new_babylon", "declare_war")).toContain("Locke");
  });

  it("returns null when none is seeded for that combination", () => {
    expect(reactionLine("antiquarian", "lift_embargo")).toBeNull();
  });
});
