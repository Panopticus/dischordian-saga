import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* The overlay used to run on timers. The refactor moves timing to
   the caller (Act1CardLadderPage consumes DuelystGameUI's
   onTurnChange / onBossHpChange hooks), so the overlay is now a
   pure phase-driven renderer. These tests guard that contract. */

const SRC = fs.readFileSync(
  path.resolve(__dirname, "Act1OpponentTauntOverlay.tsx"),
  "utf-8",
);

describe("Act1OpponentTauntOverlay — phase-driven contract", () => {
  it("accepts a `phase` prop (early/mid/late or null)", () => {
    expect(SRC).toContain("phase?: Act1TauntPhase | null");
  });

  it("no longer instantiates its own early/mid/late timers", () => {
    // The old implementation had DEFAULT_EARLY_MS / _MID_MS / _LATE_MS
    // constants. After the refactor these are gone; only DEFAULT_HOLD_MS
    // remains (for auto-clearing the taunt after its window).
    expect(SRC).not.toMatch(/DEFAULT_EARLY_MS/);
    expect(SRC).not.toMatch(/DEFAULT_MID_MS/);
    expect(SRC).not.toMatch(/DEFAULT_LATE_MS/);
    expect(SRC).toMatch(/DEFAULT_HOLD_MS/);
  });

  it("mentions the DuelystGameUI hook contract in the header comment", () => {
    expect(SRC).toContain("onTurnChange");
    expect(SRC).toContain("onBossHpChange");
  });

  it("exports the Act1TauntPhase type for consumers", () => {
    expect(SRC).toContain("export type Act1TauntPhase");
  });
});

describe("Act1CardLadderPage — turn-hook wiring", () => {
  const PAGE_SRC = fs.readFileSync(
    path.resolve(__dirname, "../../pages/Act1CardLadderPage.tsx"),
    "utf-8",
  );

  it("passes onTurnChange / onBossHpChange to DuelystGameUI", () => {
    expect(PAGE_SRC).toMatch(/onTurnChange=\{handleTurnChange\}/);
    expect(PAGE_SRC).toMatch(/onBossHpChange=\{handleBossHpChange\}/);
  });

  it("maps opponent turns 1 / 3 / 5 to early / mid / late", () => {
    expect(PAGE_SRC).toContain('setTauntPhase("early")');
    expect(PAGE_SRC).toContain('setTauntPhase("mid")');
    expect(PAGE_SRC).toContain('setTauntPhase("late")');
  });

  it("escalates phase on HP thresholds (<=60% mid, <=30% late)", () => {
    expect(PAGE_SRC).toMatch(/pct\s*<=\s*0\.3/);
    expect(PAGE_SRC).toMatch(/pct\s*<=\s*0\.6/);
  });

  it("routes the post-Authority win into the Cycle C Witnessing view", () => {
    expect(PAGE_SRC).toContain('"cycle_c_witnessing"');
    expect(PAGE_SRC).toContain("act1Step === 12");
  });
});
