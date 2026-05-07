/**
 * Pins {@link getUnlockConditionDisplay} against the
 * `CardUnlockCondition` union — every declared kind must produce a
 * non-empty chip and description.
 *
 * Adding a new kind to the union without updating
 * `cardUnlockDisplay.ts` already fails typecheck via the exhaustive
 * switch, but this test fails loudly at runtime too. Belt +
 * suspenders for one of the gates that exists to prevent silent
 * scaffolding/runtime drift.
 */
import { describe, it, expect } from "vitest";
import {
  getUnlockConditionDisplay,
  ALL_UNLOCK_KINDS,
} from "./cardUnlockDisplay";
import type { CardUnlockCondition } from "@shared/tcg-core/types/Card";

const FIXTURES: Record<
  CardUnlockCondition["kind"],
  CardUnlockCondition
> = {
  act_completion: { kind: "act_completion", act: 3 },
  secret: { kind: "secret", act: 5 },
  battle_pass: { kind: "battle_pass", tier: 50 },
  founding_author: { kind: "founding_author" },
  authors_edition: { kind: "authors_edition", season: "s2" },
  dlc_chapter_completion: { kind: "dlc_chapter_completion", chapterId: "ch1" },
  bloodline_threshold: { kind: "bloodline_threshold", classification: "ADVOCATE", minGenerations: 3 },
};

describe("getUnlockConditionDisplay", () => {
  it("covers every kind in CardUnlockCondition", () => {
    for (const kind of ALL_UNLOCK_KINDS) {
      const display = getUnlockConditionDisplay(FIXTURES[kind]);
      expect(display.kind).toBe(kind);
      expect(display.chip.length, `${kind} chip`).toBeGreaterThan(0);
      expect(display.chip.length, `${kind} chip too long`).toBeLessThanOrEqual(
        20,
      );
      expect(
        display.description.length,
        `${kind} description`,
      ).toBeGreaterThan(8);
    }
  });

  it("interpolates Act number into act_completion chip", () => {
    const out = getUnlockConditionDisplay({
      kind: "act_completion",
      act: 4,
    });
    expect(out.chip).toContain("4");
  });

  it("interpolates tier into battle_pass chip", () => {
    const out = getUnlockConditionDisplay({
      kind: "battle_pass",
      tier: 50,
    });
    expect(out.chip).toContain("50");
  });
});
