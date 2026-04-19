import { describe, expect, it } from "vitest";
import {
  ACT_7_OPPONENT_DIALOG,
  getAct7OpponentDialog,
  type Act7OpponentDialog,
} from "./act7OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act7OpponentDialog> = [
  "presenceIntro",
  "elaraPreMatch",
  "humanPreMatch",
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
  "elaraPostMatchWin",
  "humanPostMatchWin",
  "elaraPostMatchLoss",
  "humanPostMatchLoss",
  "presenceCloseWin",
  "presenceCloseLoss",
];

const TAUNT_FIELDS: ReadonlyArray<keyof Act7OpponentDialog> = [
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
];

const EXPECTED_OPPONENT_IDS = [
  "architect_echo",
  "dreamer_echo",
  "the_watcher",
] as const;

describe("act7OpponentDialog", () => {
  it("registers all three convergence-floor opponents", () => {
    expect(ACT_7_OPPONENT_DIALOG).toHaveLength(EXPECTED_OPPONENT_IDS.length);
    for (const id of EXPECTED_OPPONENT_IDS) {
      const dialog = getAct7OpponentDialog(id);
      expect(dialog, `missing dialog for ${id}`).toBeDefined();
    }
  });

  it("preserves the canonical convergence order: architect → dreamer → watcher", () => {
    const ids = ACT_7_OPPONENT_DIALOG.map((d) => d.opponentId);
    expect(ids).toEqual([...EXPECTED_OPPONENT_IDS]);
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_7_OPPONENT_DIALOG) {
      for (const field of REQUIRED_FIELDS) {
        const value = dialog[field];
        expect(
          value && value.trim().length,
          `${dialog.opponentId}.${field} is empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("keeps mid-match taunt lines under the fight-context word cap (≤ 25 words)", () => {
    for (const dialog of ACT_7_OPPONENT_DIALOG) {
      for (const field of TAUNT_FIELDS) {
        const wordCount = dialog[field].trim().split(/\s+/).length;
        expect(
          wordCount,
          `${dialog.opponentId}.${field} is ${wordCount} words (>25)`,
        ).toBeLessThanOrEqual(25);
      }
    }
  });

  it("returns undefined for unknown opponent ids", () => {
    expect(getAct7OpponentDialog("does_not_exist")).toBeUndefined();
  });

  it("uses the watcher chorus voice (lowercase 'we' second-person plural)", () => {
    const watcher = getAct7OpponentDialog("the_watcher")!;
    const taunts = TAUNT_FIELDS.map((f) => watcher[f]);
    for (const taunt of taunts) {
      expect(
        taunt.toLowerCase().includes("we") ||
          taunt.toLowerCase().includes("us") ||
          taunt.toLowerCase().includes("our"),
        `watcher taunt missing chorus voice: "${taunt}"`,
      ).toBe(true);
    }
  });
});
