import { describe, expect, it } from "vitest";
import { ACT_4_OPPONENTS } from "./acts2to7Opponents";
import {
  ACT_4_OPPONENT_DIALOGS,
  buildAct4OpponentTauntHooks,
  getAct4OpponentDialog,
  getAct4OpponentWithDialog,
  resolveAct4Dialog,
  type Act4OpponentDialog,
} from "./act4OpponentDialog";

const REQUIRED_FIELDS: ReadonlyArray<keyof Act4OpponentDialog> = [
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
const TAUNT_FIELDS: ReadonlyArray<keyof Act4OpponentDialog> = [
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

describe("act4OpponentDialog", () => {
  it("registers a dialog table for every Act 4 opponent", () => {
    expect(ACT_4_OPPONENT_DIALOGS).toHaveLength(ACT_4_OPPONENTS.length);
    for (const opponent of ACT_4_OPPONENTS) {
      const dialog = getAct4OpponentDialog(opponent.id);
      expect(dialog, `missing dialog for ${opponent.id}`).toBeDefined();
    }
  });

  it("authors every required field with non-empty text", () => {
    for (const dialog of ACT_4_OPPONENT_DIALOGS) {
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
    for (const dialog of ACT_4_OPPONENT_DIALOGS) {
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
    for (const dialog of ACT_4_OPPONENT_DIALOGS) {
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

  it("pairs opponent shell with dialog via getAct4OpponentWithDialog", () => {
    const pair = getAct4OpponentWithDialog("act4_the_bridge");
    expect(pair).toBeDefined();
    expect(pair?.opponent.name).toBe("The Bridge (Path A — Willing Disclosure)");
    expect(pair?.dialog.opponentId).toBe("act4_the_bridge");
    expect(getAct4OpponentWithDialog("does_not_exist")).toBeUndefined();
  });

  it("builds NarrativeHook-shaped taunt triggers from a dialog table", () => {
    const dialog = getAct4OpponentDialog("act4_the_betrayal");
    expect(dialog).toBeDefined();
    const hooks = buildAct4OpponentTauntHooks(dialog!);
    expect(hooks.early.id).toBe("act4_the_betrayal_taunt_early");
    expect(hooks.early.turn).toBe(2);
    expect(hooks.mid.hpBelowPercent).toBe(50);
    expect(hooks.late.hpBelowPercent).toBe(25);
  });

  describe("resolveAct4Dialog", () => {
    it("returns null when no path flag is set", () => {
      expect(resolveAct4Dialog(new Set())).toBeNull();
    });

    it("returns The Bridge for Path A (act1_path_A)", () => {
      const dialog = resolveAct4Dialog(new Set(["act1_path_A"]));
      expect(dialog?.opponentId).toBe("act4_the_bridge");
    });

    it("prefers Path A even if later path flags are also set", () => {
      const flags = new Set(["act1_path_A", "act3_partial_share", "act3_full_secret"]);
      expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_bridge");
    });

    it("returns Elara Betrayed for Path C (act3_full_secret without path A)", () => {
      const dialog = resolveAct4Dialog(new Set(["act3_full_secret"]));
      expect(dialog?.opponentId).toBe("act4_the_betrayal");
    });

    it("returns Elara Learning for Path B (act3_partial_share without path A)", () => {
      const dialog = resolveAct4Dialog(new Set(["act3_partial_share"]));
      expect(dialog?.opponentId).toBe("act4_the_discovery");
    });

    it("prefers Path C over Path B when both flags are set", () => {
      const flags = new Set(["act3_partial_share", "act3_full_secret"]);
      expect(resolveAct4Dialog(flags)?.opponentId).toBe("act4_the_betrayal");
    });
  });
});
