import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  EMPTY_PRESTIGE_CYCLE_STATS,
  addPrestigeCycleStats,
  measurePrestigeCycleStats,
  type PrestigeCycleStats,
} from "../shared/prestige";
import { applyPrestigeCarryover } from "../shared/witnessingIntegrations";

/* ═══════════════════════════════════════════════════════
   WAVE 1 — prestige schema + carryover wiring

   Addresses Roadmap Implication §4: the old performPrestige
   stored the count as `(prev as any).prestige` and never
   applied the §15 P3 carryover multipliers. This adds:

     1. Typed prestigeLevel: number field
     2. Typed prestigeBaseline: PrestigeCycleStats | null
     3. performPrestige now calls applyPrestigeCarryover
     4. Getters: getPrestigeLevel + getPrestigeBaseline
     5. Server schema accepts both fields
   ═══════════════════════════════════════════════════════ */

const ctxSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
  "utf-8",
);
const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/gameState.ts"),
  "utf-8",
);

describe("Wave 1 — GameState schema carries prestige fields", () => {
  it("GameState declares prestigeLevel: number", () => {
    expect(ctxSrc).toMatch(/prestigeLevel:\s*number;/);
  });

  it("GameState declares prestigeBaseline typed union", () => {
    expect(ctxSrc).toMatch(
      /prestigeBaseline:\s*PrestigeCycleStats\s*\|\s*null;/,
    );
  });

  it("DEFAULT_GAME_STATE initializes prestigeLevel to 0", () => {
    expect(ctxSrc).toMatch(/prestigeLevel:\s*0,/);
  });

  it("DEFAULT_GAME_STATE initializes prestigeBaseline to null", () => {
    expect(ctxSrc).toMatch(/prestigeBaseline:\s*null,/);
  });
});

describe("Wave 1 — GameContext prestige API", () => {
  it("imports the shared prestige helpers", () => {
    expect(ctxSrc).toContain('from "@shared/prestige"');
    expect(ctxSrc).toContain("measurePrestigeCycleStats");
    expect(ctxSrc).toContain("addPrestigeCycleStats");
    expect(ctxSrc).toContain("EMPTY_PRESTIGE_CYCLE_STATS");
  });

  it("imports applyPrestigeCarryover", () => {
    expect(ctxSrc).toContain(
      'import { applyPrestigeCarryover } from "@shared/witnessingIntegrations"',
    );
  });

  it("performPrestige calls applyPrestigeCarryover on stacked stats", () => {
    expect(ctxSrc).toMatch(
      /const\s+nextBaseline\s*=\s*applyPrestigeCarryover\(stacked\);/,
    );
  });

  it("performPrestige writes the typed prestigeLevel (no more `(prev as any).prestige`)", () => {
    expect(ctxSrc).toMatch(
      /prestigeLevel:\s*prev\.prestigeLevel\s*\+\s*1,/,
    );
    // The old hack must be gone
    expect(ctxSrc).not.toContain("(prev as any).prestige");
  });

  it("performPrestige persists the computed baseline", () => {
    expect(ctxSrc).toMatch(/prestigeBaseline:\s*nextBaseline,/);
  });

  it("getPrestigeLevel reads state.prestigeLevel", () => {
    expect(ctxSrc).toMatch(
      /getPrestigeLevel\s*=\s*useCallback\([\s\S]{0,200}state\.prestigeLevel/,
    );
  });

  it("getPrestigeBaseline falls back to EMPTY on null baseline", () => {
    expect(ctxSrc).toMatch(
      /state\.prestigeBaseline\s*\?\?\s*EMPTY_PRESTIGE_CYCLE_STATS/,
    );
  });

  it("provider value surfaces both getters", () => {
    const valueBlockMatch = ctxSrc.match(/<GameContext\.Provider[\s\S]*?\}\}>/);
    expect(valueBlockMatch).not.toBeNull();
    expect(valueBlockMatch![0]).toContain("getPrestigeLevel");
    expect(valueBlockMatch![0]).toContain("getPrestigeBaseline");
  });
});

describe("Wave 1 — gameStateRouter schema accepts prestige fields", () => {
  it("declares prestigeLevel as optional number", () => {
    expect(routerSrc).toMatch(/prestigeLevel:\s*z\.number\(\)\.optional\(\)/);
  });

  it("declares prestigeBaseline as nullable optional PrestigeCycleStats shape", () => {
    expect(routerSrc).toMatch(
      /prestigeBaseline:\s*z\.object\(\{[\s\S]{0,400}loredexEntries:\s*z\.number\(\)/,
    );
    expect(routerSrc).toMatch(/\}\)\.nullable\(\)\.optional\(\)/);
  });
});

describe("Wave 1 — prestige round-trip through save/load shape", () => {
  type Snapshot = {
    prestigeLevel?: number;
    prestigeBaseline?: PrestigeCycleStats | null;
    loredexDiscovered?: string[];
    collectedCards?: string[];
    narrativeFlags?: Record<string, boolean>;
  };

  function roundTrip(snapshot: Snapshot): Snapshot {
    return JSON.parse(JSON.stringify(snapshot)) as Snapshot;
  }

  it("preserves prestigeLevel + prestigeBaseline across JSON serialization", () => {
    const baseline: PrestigeCycleStats = {
      loredexEntries: 40,
      bondPeakMemories: 1,
      narratorDominanceEnergy: 0,
      dischordiaCards: 5,
      witnessingMilestones: 3,
      memorableMoments: 1,
    };
    const saved: Snapshot = { prestigeLevel: 2, prestigeBaseline: baseline };
    const loaded = roundTrip(saved);
    expect(loaded.prestigeLevel).toBe(2);
    expect(loaded.prestigeBaseline).toEqual(baseline);
  });

  it("pre-field save yields a measurable cycle state and no baseline", () => {
    const saved: Snapshot = {
      loredexDiscovered: ["a", "b", "c"],
      collectedCards: ["card1", "card2"],
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_bulb_dims: true,
      },
    };
    const loaded = roundTrip(saved);
    expect(loaded.prestigeLevel).toBeUndefined();
    expect(loaded.prestigeBaseline).toBeUndefined();
    const measured = measurePrestigeCycleStats(loaded);
    expect(measured.loredexEntries).toBe(3);
    expect(measured.dischordiaCards).toBe(2);
    expect(measured.bondPeakMemories).toBe(1);
    expect(measured.witnessingMilestones).toBe(2);
  });

  it("prestige-cycle simulation: measure → stack → carryover → save → load", () => {
    // Simulate performPrestige's inner computation.
    const prevBaseline: PrestigeCycleStats = {
      loredexEntries: 40,
      bondPeakMemories: 1,
      narratorDominanceEnergy: 0,
      dischordiaCards: 4,
      witnessingMilestones: 3,
      memorableMoments: 2,
    };
    const thisCycle = measurePrestigeCycleStats({
      loredexDiscovered: new Array(20)
        .fill(0)
        .map((_, i) => `loredex-${i}`),
      collectedCards: new Array(8).fill(0).map((_, i) => `card-${i}`),
      narrativeFlags: {
        event_two_witnesses_remember: true,
        event_bulb_dims: true,
      },
    });
    const stacked = addPrestigeCycleStats(prevBaseline, thisCycle);
    const nextBaseline = applyPrestigeCarryover(stacked);

    const saved: Snapshot = {
      prestigeLevel: 2,
      prestigeBaseline: nextBaseline,
    };
    const loaded = roundTrip(saved);
    expect(loaded.prestigeLevel).toBe(2);
    // Loredex: 100% carries → 40 + 20 = 60
    expect(loaded.prestigeBaseline?.loredexEntries).toBe(60);
    // Cards: 25% carries → floor((4 + 8) * 0.25) = 3
    expect(loaded.prestigeBaseline?.dischordiaCards).toBe(3);
    // Narrator dominance: always 0
    expect(loaded.prestigeBaseline?.narratorDominanceEnergy).toBe(0);
  });

  it("EMPTY baseline round-trips cleanly", () => {
    const saved: Snapshot = {
      prestigeLevel: 0,
      prestigeBaseline: EMPTY_PRESTIGE_CYCLE_STATS,
    };
    const loaded = roundTrip(saved);
    expect(loaded.prestigeBaseline).toEqual(EMPTY_PRESTIGE_CYCLE_STATS);
  });
});
