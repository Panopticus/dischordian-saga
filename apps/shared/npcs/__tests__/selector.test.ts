// apps/shared/npcs/__tests__/selector.test.ts
//
// Tests for the unified NpcLine selector. Validates:
//   - hard gates (act, flags, trust band, reveal stage, axis, channel)
//   - anti-spam (cooldownKey, maxPlays)
//   - specificity scoring (most-specific wins)
//   - silent-fail contract (returns null if no match)
//   - findUngatedSurfaces helper for catch-all enforcement

import { describe, it, expect } from "vitest";
import { selectNpcLine, findUngatedSurfaces } from "../selector";
import type {
  AxisMagnitude,
  DialogSurface,
  NpcKey,
  NpcLine,
  NpcSelectorContext,
  PlayerAxis,
  PlayerProfileSnapshot,
  TrustState,
} from "../types";

// --- Fixtures -------------------------------------------------------------

function makeProfile(overrides: Partial<Record<PlayerAxis, AxisMagnitude>> = {}): PlayerProfileSnapshot {
  return {
    axes: {
      aggression: "neutral",
      mercy: "neutral",
      curiosity: "neutral",
      conformity: "neutral",
      vigilance: "neutral",
      vulnerability: "neutral",
      wit: "neutral",
      ...overrides,
    },
  };
}

function makeTrust(npcKey: NpcKey, trust: number, band: string, revealStage?: string): TrustState {
  return {
    npcKey,
    trust,
    band,
    flags: new Set(),
    revealStage,
  };
}

function makeContext(overrides: Partial<NpcSelectorContext> = {}): NpcSelectorContext {
  return {
    npcKey: "adjudicator_locke",
    surface: "trade_empire" as DialogSurface,
    targetId: "test-target",
    act: 3,
    flags: new Set(),
    publicFlags: new Set(),
    trustState: makeTrust("adjudicator_locke", 50, "Partner"),
    playerProfile: makeProfile(),
    lineHistory: new Map(),
    ...overrides,
  };
}

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

function makeLine(
  overrides: Partial<BankEntry> & { lineId: string },
): BankEntry {
  return {
    npcKey: "adjudicator_locke",
    text: "stub line",
    surfaces: ["trade_empire"],
    ...overrides,
  } as BankEntry;
}

// --- Tests ----------------------------------------------------------------

describe("selectNpcLine — basic selection", () => {
  it("returns null on empty bank", () => {
    expect(selectNpcLine([], makeContext())).toBeNull();
  });

  it("selects the single matching line", () => {
    const line = makeLine({ lineId: "test.1" });
    const result = selectNpcLine([line], makeContext());
    expect(result?.line.lineId).toBe("test.1");
  });

  it("filters by npcKey + surface", () => {
    const wrong = makeLine({
      lineId: "wrong.npc",
      npcKey: "vex_solene",
    });
    const right = makeLine({ lineId: "right.npc" });
    const result = selectNpcLine([wrong, right], makeContext());
    expect(result?.line.lineId).toBe("right.npc");
  });

  it("returns null if surface doesn't match", () => {
    const line = makeLine({
      lineId: "wrong.surface",
      surfaces: ["dmc"],
    });
    const result = selectNpcLine([line], makeContext({ surface: "trade_empire" }));
    expect(result).toBeNull();
  });
});

describe("selectNpcLine — hard gates", () => {
  it("respects minAct", () => {
    const early = makeLine({ lineId: "early", minAct: 5 });
    const result = selectNpcLine([early], makeContext({ act: 3 }));
    expect(result).toBeNull();
  });

  it("respects maxAct", () => {
    const late = makeLine({ lineId: "late", maxAct: 2 });
    const result = selectNpcLine([late], makeContext({ act: 3 }));
    expect(result).toBeNull();
  });

  it("respects unlockFlags (all required)", () => {
    const gated = makeLine({ lineId: "gated", unlockFlags: ["a", "b"] });
    expect(selectNpcLine([gated], makeContext({ flags: new Set(["a"]) }))).toBeNull();
    expect(selectNpcLine([gated], makeContext({ flags: new Set(["a", "b"]) }))?.line.lineId).toBe("gated");
  });

  it("respects excludeFlags (none allowed)", () => {
    const excl = makeLine({ lineId: "excl", excludeFlags: ["forbidden"] });
    expect(selectNpcLine([excl], makeContext({ flags: new Set(["forbidden"]) }))).toBeNull();
    expect(selectNpcLine([excl], makeContext())?.line.lineId).toBe("excl");
  });

  it("respects requiresTrustBand", () => {
    const insider = makeLine({ lineId: "insider", requiresTrustBand: "Insider" });
    expect(selectNpcLine([insider], makeContext({
      trustState: makeTrust("adjudicator_locke", 50, "Partner"),
    }))).toBeNull();
    expect(selectNpcLine([insider], makeContext({
      trustState: makeTrust("adjudicator_locke", 65, "Insider"),
    }))?.line.lineId).toBe("insider");
  });

  it("respects requiresRevealStage", () => {
    const post = makeLine({
      lineId: "post",
      npcKey: "vex_solene",
      requiresRevealStage: "engineer_zero_confirmed",
    });
    expect(selectNpcLine([post], makeContext({
      npcKey: "vex_solene",
      trustState: makeTrust("vex_solene", 40, "Watcher", "engineer_zero_hint"),
    }))).toBeNull();
    expect(selectNpcLine([post], makeContext({
      npcKey: "vex_solene",
      trustState: makeTrust("vex_solene", 60, "Confidant", "engineer_zero_confirmed"),
    }))?.line.lineId).toBe("post");
  });

  it("respects playerAxisGate", () => {
    const merciful = makeLine({
      lineId: "merciful",
      playerAxisGate: { axis: "mercy", magnitudes: ["strong_positive", "moderate_positive"] },
    });
    expect(selectNpcLine([merciful], makeContext({
      playerProfile: makeProfile({ mercy: "neutral" }),
    }))).toBeNull();
    expect(selectNpcLine([merciful], makeContext({
      playerProfile: makeProfile({ mercy: "strong_positive" }),
    }))?.line.lineId).toBe("merciful");
  });

  it("respects reactsToPublicFlag", () => {
    const reactive = makeLine({
      lineId: "reactive",
      reactsToPublicFlag: "betrayed_vex_in_act_3",
    });
    expect(selectNpcLine([reactive], makeContext())).toBeNull();
    expect(selectNpcLine([reactive], makeContext({
      publicFlags: new Set(["betrayed_vex_in_act_3"]),
    }))?.line.lineId).toBe("reactive");
  });
});

describe("selectNpcLine — specificity scoring", () => {
  it("prefers more-gated line over catch-all", () => {
    const catchall = makeLine({ lineId: "catchall" });
    const gated = makeLine({
      lineId: "gated",
      requiresTrustBand: "Partner",
    });
    const result = selectNpcLine([catchall, gated], makeContext());
    expect(result?.line.lineId).toBe("gated");
  });

  it("prefers trust-band gate over flag gate (3 vs 1)", () => {
    const flag = makeLine({ lineId: "flag", unlockFlags: ["x"] });
    const trust = makeLine({ lineId: "trust", requiresTrustBand: "Partner" });
    const result = selectNpcLine([flag, trust], makeContext({
      flags: new Set(["x"]),
    }));
    expect(result?.line.lineId).toBe("trust");
  });
});

describe("selectNpcLine — anti-spam", () => {
  it("respects maxPlays=1 (line fires once)", () => {
    const once = makeLine({ lineId: "once", maxPlays: 1 });
    const ctx = makeContext({
      lineHistory: new Map([["once", [Date.now() - 1000]]]),
    });
    expect(selectNpcLine([once], ctx)).toBeNull();
  });

  it("respects cooldownKey with no window (once per playthrough)", () => {
    const cd = makeLine({ lineId: "cd", cooldownKey: "weekly" });
    const ctx = makeContext({
      lineHistory: new Map([["cd", [Date.now() - 1000]]]),
    });
    expect(selectNpcLine([cd], ctx)).toBeNull();
  });

  it("respects cooldownWindowMs (line fires after window)", () => {
    const cd = makeLine({
      lineId: "cd",
      cooldownKey: "trade_completed",
      cooldownWindowMs: 60_000,
    });
    const expired = makeContext({
      lineHistory: new Map([["cd", [Date.now() - 70_000]]]),
    });
    const fresh = makeContext({
      lineHistory: new Map([["cd", [Date.now() - 30_000]]]),
    });
    expect(selectNpcLine([cd], expired)?.line.lineId).toBe("cd");
    expect(selectNpcLine([cd], fresh)).toBeNull();
  });
});

describe("findUngatedSurfaces — lint helper", () => {
  it("returns empty for bank with catch-all per surface", () => {
    const catchall = makeLine({ lineId: "catchall" });
    expect(findUngatedSurfaces([catchall])).toHaveLength(0);
  });

  it("flags surfaces with only-gated lines", () => {
    const gatedOnly = makeLine({
      lineId: "gated-only",
      requiresTrustBand: "Insider",
    });
    const result = findUngatedSurfaces([gatedOnly]);
    expect(result).toHaveLength(1);
    expect(result[0]?.npcKey).toBe("adjudicator_locke");
    expect(result[0]?.surface).toBe("trade_empire");
  });
});
