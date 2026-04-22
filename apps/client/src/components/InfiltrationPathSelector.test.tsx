/**
 * Structural tests for InfiltrationPathSelector (§7 path commit).
 *
 * Verifies that the component imports the canonical infiltration-path
 * data shell and that the `shouldShowInfiltrationSelector` guard
 * respects every gate condition. Source-scan style mirrors the Act 2
 * page-component tests.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { shouldShowInfiltrationSelector } from "./InfiltrationPathSelector";

const src = fs.readFileSync(
  path.resolve(__dirname, "InfiltrationPathSelector.tsx"),
  "utf-8",
);

describe("InfiltrationPathSelector — imports", () => {
  it("reads from canonical INFILTRATION_PATHS", () => {
    expect(src).toContain("INFILTRATION_PATHS");
    expect(src).toContain('from "@shared/act3EyesBiography"');
  });

  it("uses deriveInfiltrationProgress to detect committed paths", () => {
    expect(src).toContain("deriveInfiltrationProgress");
    expect(src).toContain('from "@shared/witnessingRuntime"');
  });

  it("writes commit via setNarrativeFlag(commitFlag)", () => {
    expect(src).toContain("setNarrativeFlag(path.commitFlag, true)");
  });
});

describe("shouldShowInfiltrationSelector", () => {
  it("returns false when flags are undefined", () => {
    expect(shouldShowInfiltrationSelector(undefined, 3)).toBe(false);
  });

  it("returns false when trade_empire_unlocked is not set", () => {
    expect(shouldShowInfiltrationSelector({}, 3)).toBe(false);
  });

  it("returns false when narrativeAct < 3", () => {
    expect(
      shouldShowInfiltrationSelector({ trade_empire_unlocked: true }, 2),
    ).toBe(false);
  });

  it("returns true when in Act 3 with trade empire unlocked and no path committed", () => {
    expect(
      shouldShowInfiltrationSelector({ trade_empire_unlocked: true }, 3),
    ).toBe(true);
  });

  it("returns false once insurgency path is committed", () => {
    expect(
      shouldShowInfiltrationSelector(
        {
          trade_empire_unlocked: true,
          act3_insurgency_committed: true,
        },
        3,
      ),
    ).toBe(false);
  });

  it("returns false once empire path is committed", () => {
    expect(
      shouldShowInfiltrationSelector(
        {
          trade_empire_unlocked: true,
          act3_empire_committed: true,
        },
        3,
      ),
    ).toBe(false);
  });

  it("returns false once hierarchy path is committed", () => {
    expect(
      shouldShowInfiltrationSelector(
        {
          trade_empire_unlocked: true,
          act3_hierarchy_committed: true,
        },
        3,
      ),
    ).toBe(false);
  });

  it("returns false once act_3_complete is set (post-completion visits)", () => {
    expect(
      shouldShowInfiltrationSelector(
        {
          trade_empire_unlocked: true,
          act_3_complete: true,
        },
        3,
      ),
    ).toBe(false);
  });

  it("returns true in Act 4+ if somehow still uncommitted (edge case — future acts)", () => {
    // Theoretically a player can land in Act 4 via a different path and
    // still not have committed. The guard should still let them catch up.
    expect(
      shouldShowInfiltrationSelector({ trade_empire_unlocked: true }, 4),
    ).toBe(true);
  });
});
