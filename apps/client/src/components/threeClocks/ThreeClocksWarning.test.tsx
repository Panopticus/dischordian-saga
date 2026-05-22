/**
 * ThreeClocksWarning — critical-signal logic + composition test.
 *
 * The warning is a pure function of state; we test that function
 * exhaustively, and a source-scan asserts the component is wired
 * correctly to the panel's tRPC reader.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { criticalSignals } from "./ThreeClocksWarning";
import type { ThreeClocksState } from "@shared/threeClocks/state";

/* Minimal baseline — no clock critical. */
const BASELINE: ThreeClocksState = {
  vortex: {
    proximity: 12,
    phase: "dawn",
    sectorsConsumed: 0,
    sectorsReclaimed: 0,
    narration: "A shadow in the gutter of the sky.",
  },
  necromancer: {
    phase: "dormant",
    cycleNumber: 1,
    resurrectionEnergy: "cold",
    narration: "A whisper in the void.",
  },
  politician: {
    topRank: 1,
    aspirantNemesisId: null,
    seatStatus: "sealed",
    apprenticesActive: 0,
  },
  nextTickAt: "2026-05-22T12:34:00Z",
};

describe("criticalSignals — predicate logic", () => {
  it("returns no signals on a baseline state", () => {
    expect(criticalSignals(BASELINE)).toEqual([]);
  });

  it("fires the vortex signal when phase = vortex_advance", () => {
    const signals = criticalSignals({
      ...BASELINE,
      vortex: { ...BASELINE.vortex, phase: "vortex_advance", proximity: 85 },
    });
    expect(signals.map((s) => s.id)).toEqual(["vortex"]);
    expect(signals[0].text).toBe("The drum is here.");
  });

  it("fires the necromancer signal at manifesting", () => {
    const signals = criticalSignals({
      ...BASELINE,
      necromancer: { ...BASELINE.necromancer, phase: "manifesting" },
    });
    expect(signals.map((s) => s.id)).toEqual(["necromancer"]);
    expect(signals[0].text).toBe("He is at the gate.");
  });

  it("fires the necromancer signal at returned", () => {
    const signals = criticalSignals({
      ...BASELINE,
      necromancer: { ...BASELINE.necromancer, phase: "returned" },
    });
    expect(signals.map((s) => s.id)).toEqual(["necromancer"]);
  });

  it("does NOT fire necromancer for awakening (sub-critical)", () => {
    const signals = criticalSignals({
      ...BASELINE,
      necromancer: { ...BASELINE.necromancer, phase: "awakening" },
    });
    expect(signals.map((s) => s.id)).not.toContain("necromancer");
  });

  it("fires the politician signal when seatStatus = open", () => {
    const signals = criticalSignals({
      ...BASELINE,
      politician: { ...BASELINE.politician, seatStatus: "open" },
    });
    expect(signals.map((s) => s.id)).toEqual(["politician"]);
    expect(signals[0].text).toBe("Her seat is open.");
  });

  it("contested seat is sub-critical — no signal", () => {
    const signals = criticalSignals({
      ...BASELINE,
      politician: { ...BASELINE.politician, seatStatus: "contested" },
    });
    expect(signals.map((s) => s.id)).not.toContain("politician");
  });

  it("emits all three signals in stable order during the Fracture convergence", () => {
    const signals = criticalSignals({
      ...BASELINE,
      vortex: { ...BASELINE.vortex, phase: "vortex_advance", proximity: 91 },
      necromancer: { ...BASELINE.necromancer, phase: "manifesting" },
      politician: { ...BASELINE.politician, seatStatus: "open" },
    });
    expect(signals.map((s) => s.id)).toEqual([
      "vortex",
      "necromancer",
      "politician",
    ]);
  });
});

describe("ThreeClocksWarning — composition wiring", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "ThreeClocksWarning.tsx"),
    "utf-8",
  );

  it("reads the same trpc.threeClocks.get reader as the panel", () => {
    expect(src).toContain("trpc.threeClocks.get.useQuery");
  });

  it("renders null when the query has no data (no flash on cold load)", () => {
    expect(src).toMatch(/if \(!query\.data\) return null/);
  });

  it("AnimatePresence guards the strip so empty signal sets render nothing", () => {
    // criticalSignals returning [] → the conditional inside AnimatePresence
    // is falsy → AnimatePresence has no children → nothing renders. Smooth
    // fade-out is handled by exit transitions on the inner motion.aside.
    expect(src).toContain("AnimatePresence");
    expect(src).toContain("{signals.length > 0 &&");
  });

  it("respects prefers-reduced-motion (no motion on reduced)", () => {
    expect(src).toContain("useReducedMotion");
    expect(src).toContain('transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}');
  });

  it("exposes role=status with aria-live=polite for screen readers", () => {
    expect(src).toContain('role="status"');
    expect(src).toContain('aria-live="polite"');
  });

  it("reflects signal count in data-signal-count", () => {
    expect(src).toContain("data-signal-count={signals.length}");
  });

  it("Void Energy compliant — uses void-* tokens only", () => {
    expect(src).toMatch(/void-(text|bg|border|radius)/);
    // No raw Tailwind ramps
    expect(src).not.toMatch(
      /\b(text|bg|border)-(red|green|blue|amber|yellow|emerald|rose)-\d{2,3}\b/,
    );
  });
});
