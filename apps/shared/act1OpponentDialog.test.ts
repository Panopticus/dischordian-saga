import { describe, expect, it } from "vitest";
import { ACT_1_OPPONENTS } from "./act1Opponents";
import {
  ACT_1_OPPONENT_DIALOGS,
  buildOpponentTauntHooks,
  getAct1OpponentDialog,
  getAct1OpponentWithDialog,
  type Act1OpponentDialog,
} from "./act1OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act1OpponentDialog> = [
  "engineerMemoirIntro",
  "elaraPreMatch",
  "humanPreMatch",
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
  "elaraPostMatchWin",
  "humanPostMatchWin",
  "elaraPostMatchLoss",
  "humanPostMatchLoss",
  "engineerMemoirCloseWin",
  "engineerMemoirCloseLoss",
];

const TAUNT_WORD_CAP = 25;
const TAUNT_FIELDS: ReadonlyArray<keyof Act1OpponentDialog> = [
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
];

describe("act1OpponentDialog", () => {
  it("registers a dialog table for every Act 1 opponent", () => {
    expect(ACT_1_OPPONENT_DIALOGS).toHaveLength(ACT_1_OPPONENTS.length);
    for (const opponent of ACT_1_OPPONENTS) {
      const dialog = getAct1OpponentDialog(opponent.id);
      expect(dialog, `missing dialog for ${opponent.id}`).toBeDefined();
    }
  });

  it("preserves the canonical opponent order", () => {
    const dialogIds = ACT_1_OPPONENT_DIALOGS.map((d) => d.opponentId);
    const opponentIds = ACT_1_OPPONENTS.map((o) => o.id);
    expect(dialogIds).toEqual(opponentIds);
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_1_OPPONENT_DIALOGS) {
      for (const field of REQUIRED_FIELDS) {
        const value = dialog[field];
        expect(value, `${dialog.opponentId}.${String(field)} must be authored`).toBeTruthy();
        expect(typeof value).toBe("string");
        expect((value as string).trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps mid-match taunts within the 25-word fight-context cap", () => {
    for (const dialog of ACT_1_OPPONENT_DIALOGS) {
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
    const stubPatterns = [
      /\bTODO\b/,
      /\bFIXME\b/,
      /\bXXX\b/,
      /\bTBD\b/,
      /\blorem ipsum\b/i,
      /\[placeholder\]/i,
    ];
    for (const dialog of ACT_1_OPPONENT_DIALOGS) {
      for (const field of REQUIRED_FIELDS) {
        const text = dialog[field] as string;
        for (const pattern of stubPatterns) {
          expect(
            pattern.test(text),
            `${dialog.opponentId}.${String(field)} contains stub marker ${pattern}`
          ).toBe(false);
        }
      }
    }
  });

  it("pairs opponent shell with dialog via getAct1OpponentWithDialog", () => {
    const pair = getAct1OpponentWithDialog("little_meme");
    expect(pair).toBeDefined();
    expect(pair?.opponent.name).toBe("Little Meme");
    expect(pair?.dialog.opponentId).toBe("little_meme");
    expect(getAct1OpponentWithDialog("does_not_exist")).toBeUndefined();
  });

  it("builds NarrativeHook-shaped taunt triggers from a dialog table", () => {
    const dialog = getAct1OpponentDialog("the_warlord_zero_first");
    expect(dialog).toBeDefined();
    const hooks = buildOpponentTauntHooks(dialog!);
    expect(hooks.early.id).toBe("the_warlord_zero_first_taunt_early");
    expect(hooks.early.turn).toBe(2);
    expect(hooks.early.text).toContain("arithmetic");
    expect(hooks.mid.hpBelowPercent).toBe(50);
    expect(hooks.late.hpBelowPercent).toBe(25);
    expect(hooks.early.id).not.toEqual(hooks.mid.id);
    expect(hooks.mid.id).not.toEqual(hooks.late.id);
  });
});
