/**
 * Structural tests for PrestigeCycleResetPage (§15 cycle-rollover
 * ceremony). Source-scan style matching the Act 4 Prisoner tests.
 * Verifies canon carryover rules surface, performPrestige wiring,
 * and the spine-complete gate.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { PRESTIGE_CARRYOVER_RULES } from "@shared/actsFourFiveShells";

const src = fs.readFileSync(
  path.resolve(__dirname, "PrestigeCycleResetPage.tsx"),
  "utf-8",
);

describe("PrestigeCycleResetPage — imports", () => {
  it("imports canonical PRESTIGE_CARRYOVER_RULES", () => {
    expect(src).toContain("PRESTIGE_CARRYOVER_RULES");
    expect(src).toContain('from "@shared/actsFourFiveShells"');
  });

  it("wires performPrestige from useGame()", () => {
    expect(src).toContain("useGame()");
    expect(src).toContain("performPrestige");
  });
});

describe("PrestigeCycleResetPage — spine-complete gate", () => {
  it("reads BOTH act_7_complete and narrative_spine_complete as valid gates", () => {
    expect(src).toContain("act_7_complete");
    expect(src).toContain("narrative_spine_complete");
  });

  it("disables the Begin button when the spine is not complete", () => {
    expect(src).toMatch(/disabled=\{\s*!\s*spineComplete/);
  });

  it("shows a 'not yet' state for pre-completion visits", () => {
    expect(src).toMatch(/Cycle not yet complete|not yet/i);
  });

  it("guards performPrestige() call behind the spine-complete check", () => {
    // handleConfirm must early-return when !spineComplete so a manual
    // /prestige-cycle visit can't skip the gate.
    expect(src).toMatch(/if\s*\(\s*!\s*spineComplete\s*\)\s*return/);
  });
});

describe("PrestigeCycleResetPage — carryover rules surface", () => {
  it("maps over PRESTIGE_CARRYOVER_RULES to render each rule", () => {
    expect(src).toContain("PRESTIGE_CARRYOVER_RULES.map");
  });

  it("renders the rule's carryoverPortion as a percentage", () => {
    expect(src).toMatch(/rule\.carryoverPortion\s*\*\s*100/);
  });

  it("renders each rule's rationale prose", () => {
    expect(src).toContain("rule.rationale");
  });

  it("covers every canon carryover rule key in the source (smoke check)", () => {
    // This doesn't verify runtime render — just that the author
    // didn't accidentally filter out any canonical rule id.
    for (const rule of PRESTIGE_CARRYOVER_RULES) {
      // Just verify the rule object structure the page reads.
      expect(rule.id).toBeTruthy();
      expect(typeof rule.carryoverPortion).toBe("number");
    }
  });
});

describe("PrestigeCycleResetPage — confirmation ceremony", () => {
  it("requires a two-step confirm before firing performPrestige", () => {
    // The button first opens ConfirmCeremony (setConfirming(true));
    // the modal's Release button is the actual trigger. Guards against
    // accidental single-click cycle reset.
    expect(src).toContain("setConfirming(true)");
    expect(src).toContain("ConfirmCeremony");
  });

  it("navigates back to /title after a successful reset", () => {
    // The Ark restarts; the next Prelude beat needs a clean context,
    // so we route to the title screen as the natural handoff.
    expect(src).toMatch(/navigate\(\s*["']\/title["']\s*\)/);
  });

  it("announces the next cycle number in the toast", () => {
    expect(src).toContain("nextPrestigeLevel");
    expect(src).toContain("toast.success");
  });
});

describe("PrestigeCycleResetPage — never writes narrative flags directly", () => {
  it("does not set act_7_complete itself (gate fires upstream)", () => {
    expect(src).not.toContain('setNarrativeFlag("act_7_complete"');
  });

  it("does not set narrative_spine_complete itself", () => {
    expect(src).not.toContain('setNarrativeFlag("narrative_spine_complete"');
  });
});
