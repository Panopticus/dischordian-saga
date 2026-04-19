import { describe, expect, it } from "vitest";
import { ACT_6_OPPONENTS } from "./acts2to7Opponents";
import {
  ACT_6_OPPONENT_DIALOGS,
  buildAct6OpponentTauntHooks,
  getAct6OpponentDialog,
  getAct6OpponentWithDialog,
  type Act6OpponentDialog,
} from "./act6OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act6OpponentDialog> = [
  "frameIntro",
  "elaraPreMatch",
  "humanPreMatch",
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
  "elaraPostMatchWin",
  "humanPostMatchWin",
  "elaraPostMatchLoss",
  "humanPostMatchLoss",
  "frameCloseWin",
  "frameCloseLoss",
];

const TAUNT_WORD_CAP = 25;
const TAUNT_FIELDS: ReadonlyArray<keyof Act6OpponentDialog> = [
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
];

const STUB_PATTERNS: readonly RegExp[] = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /\bTBD\b/,
  /\blorem ipsum\b/i,
  /\[placeholder\]/i,
];

describe("act6OpponentDialog", () => {
  it("registers a dialog table for every Act 6 opponent", () => {
    expect(ACT_6_OPPONENT_DIALOGS).toHaveLength(ACT_6_OPPONENTS.length);
    for (const opponent of ACT_6_OPPONENTS) {
      const dialog = getAct6OpponentDialog(opponent.id);
      expect(dialog, `missing dialog for ${opponent.id}`).toBeDefined();
    }
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_6_OPPONENT_DIALOGS) {
      for (const field of REQUIRED_FIELDS) {
        const value = dialog[field];
        expect(
          value,
          `${dialog.opponentId}.${String(field)} must be authored`
        ).toBeTruthy();
        expect(typeof value).toBe("string");
        expect((value as string).trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps mid-match taunts within the 25-word fight-context cap", () => {
    for (const dialog of ACT_6_OPPONENT_DIALOGS) {
      for (const field of TAUNT_FIELDS) {
        const text = dialog[field] as string;
        const words = text.trim().split(/\s+/).length;
        expect(
          words,
          `${dialog.opponentId}.${String(field)} is ${words} words: "${text}"`
        ).toBeLessThanOrEqual(TAUNT_WORD_CAP);
      }
    }
  });

  it("rejects author-side stub markers in any line", () => {
    for (const dialog of ACT_6_OPPONENT_DIALOGS) {
      for (const field of REQUIRED_FIELDS) {
        const text = dialog[field] as string;
        for (const pattern of STUB_PATTERNS) {
          expect(
            pattern.test(text),
            `${dialog.opponentId}.${String(field)} contains stub marker ${pattern}`
          ).toBe(false);
        }
      }
    }
  });

  it("pairs opponent shell with dialog via getAct6OpponentWithDialog", () => {
    const pair = getAct6OpponentWithDialog("act6_the_woman_she_was");
    expect(pair).toBeDefined();
    expect(pair?.opponent.name).toBe("The Woman She Was");
    expect(pair?.dialog.opponentId).toBe("act6_the_woman_she_was");
    expect(getAct6OpponentWithDialog("does_not_exist")).toBeUndefined();
  });

  it("builds NarrativeHook-shaped taunt triggers from a dialog table", () => {
    const dialog = getAct6OpponentDialog("act6_the_detective_in_the_wall");
    expect(dialog).toBeDefined();
    const hooks = buildAct6OpponentTauntHooks(dialog!);
    expect(hooks.early.id).toBe("act6_the_detective_in_the_wall_taunt_early");
    expect(hooks.early.turn).toBe(2);
    expect(hooks.mid.hpBelowPercent).toBe(50);
    expect(hooks.late.hpBelowPercent).toBe(25);
  });
});
