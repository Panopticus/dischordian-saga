import { describe, expect, it } from "vitest";
import { ACT_7_OPPONENTS } from "./acts2to7Opponents";
import {
  ACT_7_OPPONENT_DIALOGS,
  buildAct7OpponentTauntHooks,
  getAct7OpponentDialog,
  getAct7OpponentWithDialog,
  type Act7OpponentDialog,
} from "./act7OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act7OpponentDialog> = [
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
const TAUNT_FIELDS: ReadonlyArray<keyof Act7OpponentDialog> = [
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

const VALID_FRAME_SPEAKERS = new Set(["elara", "human", "system", "dual"]);

describe("act7OpponentDialog", () => {
  it("registers a dialog table for every Act 7 opponent", () => {
    expect(ACT_7_OPPONENT_DIALOGS).toHaveLength(ACT_7_OPPONENTS.length);
    for (const opponent of ACT_7_OPPONENTS) {
      const dialog = getAct7OpponentDialog(opponent.id);
      expect(dialog, `missing dialog for ${opponent.id}`).toBeDefined();
    }
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_7_OPPONENT_DIALOGS) {
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

  it("tags every dialog with a valid frameSpeaker", () => {
    for (const dialog of ACT_7_OPPONENT_DIALOGS) {
      expect(
        VALID_FRAME_SPEAKERS.has(dialog.frameSpeaker),
        `${dialog.opponentId} has invalid frameSpeaker ${dialog.frameSpeaker}`
      ).toBe(true);
    }
  });

  it("keeps mid-match taunts within the 25-word fight-context cap", () => {
    for (const dialog of ACT_7_OPPONENT_DIALOGS) {
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
    for (const dialog of ACT_7_OPPONENT_DIALOGS) {
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

  it("routes the convergence finale through the dual-narration frame", () => {
    const seat = getAct7OpponentDialog("act7_the_convergence_seat")!;
    expect(seat.frameSpeaker).toBe("dual");
  });

  it("pairs opponent shell with dialog via getAct7OpponentWithDialog", () => {
    const pair = getAct7OpponentWithDialog("act7_the_visible_war");
    expect(pair).toBeDefined();
    expect(pair?.opponent.name).toBe("The Visible War");
    expect(pair?.dialog.opponentId).toBe("act7_the_visible_war");
    expect(getAct7OpponentWithDialog("does_not_exist")).toBeUndefined();
  });

  it("builds NarrativeHook-shaped taunt triggers from a dialog table", () => {
    const dialog = getAct7OpponentDialog("act7_the_convergence_seat");
    expect(dialog).toBeDefined();
    const hooks = buildAct7OpponentTauntHooks(dialog!);
    expect(hooks.early.id).toBe("act7_the_convergence_seat_taunt_early");
    expect(hooks.early.turn).toBe(2);
    expect(hooks.mid.hpBelowPercent).toBe(50);
    expect(hooks.late.hpBelowPercent).toBe(25);
  });
});
