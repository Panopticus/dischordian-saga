import { describe, expect, it } from "vitest";
import { ACT_3_OPPONENTS } from "./acts2to7Opponents";
import {
  ACT_3_OPPONENT_DIALOGS,
  buildAct3OpponentTauntHooks,
  getAct3OpponentDialog,
  getAct3OpponentWithDialog,
  type Act3OpponentDialog,
} from "./act3OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act3OpponentDialog> = [
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
const TAUNT_FIELDS: ReadonlyArray<keyof Act3OpponentDialog> = [
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

describe("act3OpponentDialog", () => {
  it("registers a dialog table for every Act 3 opponent", () => {
    expect(ACT_3_OPPONENT_DIALOGS).toHaveLength(ACT_3_OPPONENTS.length);
    for (const opponent of ACT_3_OPPONENTS) {
      const dialog = getAct3OpponentDialog(opponent.id);
      expect(dialog, `missing dialog for ${opponent.id}`).toBeDefined();
    }
  });

  it("preserves the canonical opponent order", () => {
    const dialogIds = ACT_3_OPPONENT_DIALOGS.map((d) => d.opponentId);
    const opponentIds = ACT_3_OPPONENTS.map((o) => o.id);
    expect(dialogIds).toEqual(opponentIds);
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_3_OPPONENT_DIALOGS) {
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
    for (const dialog of ACT_3_OPPONENT_DIALOGS) {
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
    for (const dialog of ACT_3_OPPONENT_DIALOGS) {
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

  it("pairs opponent shell with dialog via getAct3OpponentWithDialog", () => {
    const pair = getAct3OpponentWithDialog("act3_substrate_echo");
    expect(pair).toBeDefined();
    expect(pair?.opponent.name).toBe("The Substrate Echo");
    expect(pair?.dialog.opponentId).toBe("act3_substrate_echo");
    expect(getAct3OpponentWithDialog("does_not_exist")).toBeUndefined();
  });

  it("builds NarrativeHook-shaped taunt triggers from a dialog table", () => {
    const dialog = getAct3OpponentDialog("act3_kael_archivist");
    expect(dialog).toBeDefined();
    const hooks = buildAct3OpponentTauntHooks(dialog!);
    expect(hooks.early.id).toBe("act3_kael_archivist_taunt_early");
    expect(hooks.early.turn).toBe(2);
    expect(hooks.mid.hpBelowPercent).toBe(50);
    expect(hooks.late.hpBelowPercent).toBe(25);
    expect(hooks.early.id).not.toEqual(hooks.mid.id);
    expect(hooks.mid.id).not.toEqual(hooks.late.id);
  });
});
