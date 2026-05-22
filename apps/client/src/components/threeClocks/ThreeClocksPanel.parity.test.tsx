/**
 * Three Clocks panel — 16-state parity test.
 *
 * docs/design/NEXUS_TRIAL_PLAN.md declares the panel must render
 * every state of every clock with no silent fallback:
 *
 *   6 vortex phases + 7 necromancer phases + 3 politician seat
 *   statuses = 16 declared states.
 *
 * This source-scan parity test verifies each subcomponent's
 * PHASE_LABEL / SEAT_LABEL map contains an entry for every
 * declared state. TypeScript's Record<X, string> typing
 * provides exhaustiveness at compile time; this test pins it at
 * runtime too so regressions surface in CI.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC_DIR = __dirname;

function read(file: string): string {
  return fs.readFileSync(path.resolve(SRC_DIR, file), "utf-8");
}

/* ─── Declared states (single source of truth — mirrors the
 *     unions in apps/shared/threeClocks/state.ts) ─── */

const VORTEX_PHASES = [
  "dawn",
  "dimming",
  "long_night",
  "vortex_advance",
  "reclamation",
  "light_holds",
] as const;

const NECROMANCER_PHASES = [
  "dormant",
  "stirring",
  "awakening",
  "manifesting",
  "returned",
  "banishment_active",
  "banished",
] as const;

const POLITICIAN_SEAT_STATUSES = ["sealed", "contested", "open"] as const;

describe("Three Clocks panel — 16-state parity", () => {
  const vortexSrc = read("VortexClock.tsx");
  const necromancerSrc = read("NecromancerClock.tsx");
  const politicianSrc = read("PoliticianClock.tsx");
  const panelSrc = read("ThreeClocksPanel.tsx");

  it("declares all 6 vortex phases in VortexClock's PHASE_LABEL", () => {
    for (const phase of VORTEX_PHASES) {
      expect(vortexSrc).toContain(`${phase}:`);
    }
  });

  it("declares all 7 necromancer phases in NecromancerClock's PHASE_LABEL", () => {
    for (const phase of NECROMANCER_PHASES) {
      expect(necromancerSrc).toContain(`${phase}:`);
    }
  });

  it("declares all 3 politician seat statuses in PoliticianClock's SEAT_LABEL", () => {
    for (const status of POLITICIAN_SEAT_STATUSES) {
      expect(politicianSrc).toContain(`${status}:`);
    }
  });

  it("the necromancer phase ladder is exhaustive", () => {
    // The pip ladder renders one li per phase. If a phase is omitted
    // the ladder silently shrinks — catch the regression here.
    for (const phase of NECROMANCER_PHASES) {
      expect(necromancerSrc).toContain(`"${phase}"`);
    }
  });

  it("sum of declared states is 16", () => {
    expect(
      VORTEX_PHASES.length +
        NECROMANCER_PHASES.length +
        POLITICIAN_SEAT_STATUSES.length,
    ).toBe(16);
  });
});

describe("Three Clocks panel — component composition", () => {
  const panelSrc = read("ThreeClocksPanel.tsx");

  it("imports the composer's typed state from @shared", () => {
    expect(panelSrc).toContain('from "@shared/threeClocks/state"');
  });

  it("reads from trpc.threeClocks.get with a polling interval", () => {
    expect(panelSrc).toContain("trpc.threeClocks.get.useQuery");
    expect(panelSrc).toMatch(/refetchInterval:\s*REFETCH_INTERVAL_MS/);
  });

  it("renders all three subcomponents", () => {
    expect(panelSrc).toContain("<VortexClock");
    expect(panelSrc).toContain("<NecromancerClock");
    expect(panelSrc).toContain("<PoliticianClock");
  });

  it("exposes a pure ThreeClocksPanelView for testing", () => {
    expect(panelSrc).toContain("export function ThreeClocksPanelView");
  });

  it("renders a loading state when the query has no data", () => {
    expect(panelSrc).toContain('data-state="loading"');
    expect(panelSrc).toContain('aria-busy="true"');
  });
});

describe("Three Clocks panel — accessibility wiring", () => {
  const vortexSrc = read("VortexClock.tsx");
  const necromancerSrc = read("NecromancerClock.tsx");
  const politicianSrc = read("PoliticianClock.tsx");

  it("each subcomponent exposes a role='meter' element with the proper aria values", () => {
    for (const src of [vortexSrc, necromancerSrc, politicianSrc]) {
      expect(src).toContain('role="meter"');
      expect(src).toContain("aria-valuemin=");
      expect(src).toContain("aria-valuemax=");
      expect(src).toContain("aria-valuenow=");
      expect(src).toMatch(/aria-label=/);
    }
  });

  it("each subcomponent reflects state in data-* attributes (not utility classes)", () => {
    expect(vortexSrc).toContain('data-phase={state.phase}');
    expect(necromancerSrc).toContain('data-phase={state.phase}');
    expect(politicianSrc).toContain('data-seat-status={state.seatStatus}');
  });
});
