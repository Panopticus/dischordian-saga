import { describe, it, expect } from "vitest";
import {
  VEX_RECOGNITION_DIALOG,
  selectVexRecognitionDialog,
  shouldFireVexRecognition,
} from "./vexCardRecognition";

describe("vexCardRecognition — dialog catalog", () => {
  it("exports five canonical variants", () => {
    expect(VEX_RECOGNITION_DIALOG.length).toBe(5);
    expect(VEX_RECOGNITION_DIALOG.map((d) => d.id)).toEqual([
      "n_0",
      "n_1_3",
      "n_4_7",
      "n_8_11",
      "n_12",
    ]);
  });

  it("every variant fires the vex_recognized_friend_i_saved flag", () => {
    for (const d of VEX_RECOGNITION_DIALOG) {
      expect(d.firesFlag).toBe("vex_recognized_friend_i_saved");
    }
  });

  it("N-ranges exactly partition [0, 12]", () => {
    // Confirm no gaps and no overlaps.
    for (let n = 0; n <= 12; n++) {
      const matches = VEX_RECOGNITION_DIALOG.filter(
        (d) => n >= d.nRange.min && n <= d.nRange.max,
      );
      expect(matches.length).toBe(1);
    }
  });

  it("canonical variant-to-N mapping matches §15.3 / §2.12", () => {
    expect(selectVexRecognitionDialog(0).id).toBe("n_0");
    expect(selectVexRecognitionDialog(1).id).toBe("n_1_3");
    expect(selectVexRecognitionDialog(3).id).toBe("n_1_3");
    expect(selectVexRecognitionDialog(4).id).toBe("n_4_7");
    expect(selectVexRecognitionDialog(7).id).toBe("n_4_7");
    expect(selectVexRecognitionDialog(8).id).toBe("n_8_11");
    expect(selectVexRecognitionDialog(11).id).toBe("n_8_11");
    expect(selectVexRecognitionDialog(12).id).toBe("n_12");
  });

  it("throws on out-of-range N-scores", () => {
    expect(() => selectVexRecognitionDialog(-1)).toThrow();
    expect(() => selectVexRecognitionDialog(13)).toThrow();
  });

  it("N=12 variant is the only one that addresses the Engineer directly", () => {
    const n12 = VEX_RECOGNITION_DIALOG.find((d) => d.id === "n_12");
    expect(n12?.vexLine).toContain("He saved me");
    expect(n12?.vexLine).toContain("Thank you");
  });
});

describe("vexCardRecognition — firing guard", () => {
  it("fires when all canonical conditions are met", () => {
    expect(
      shouldFireVexRecognition({
        narrativeAct: 3,
        cardBeingPlayed: "friend_i_saved",
        flags: {},
      }),
    ).toBe(true);
  });

  it("does NOT fire in Act 1 or Act 2", () => {
    expect(
      shouldFireVexRecognition({
        narrativeAct: 1,
        cardBeingPlayed: "friend_i_saved",
        flags: {},
      }),
    ).toBe(false);
    expect(
      shouldFireVexRecognition({
        narrativeAct: 2,
        cardBeingPlayed: "friend_i_saved",
        flags: {},
      }),
    ).toBe(false);
  });

  it("fires in Act 4+ if the flag has not yet been set", () => {
    expect(
      shouldFireVexRecognition({
        narrativeAct: 5,
        cardBeingPlayed: "friend_i_saved",
        flags: {},
      }),
    ).toBe(true);
  });

  it("does NOT fire when the flag is already set", () => {
    expect(
      shouldFireVexRecognition({
        narrativeAct: 3,
        cardBeingPlayed: "friend_i_saved",
        flags: { vex_recognized_friend_i_saved: true },
      }),
    ).toBe(false);
  });

  it("does NOT fire for other cards", () => {
    expect(
      shouldFireVexRecognition({
        narrativeAct: 3,
        cardBeingPlayed: "standstill",
        flags: {},
      }),
    ).toBe(false);
    expect(
      shouldFireVexRecognition({
        narrativeAct: 3,
        cardBeingPlayed: "last_word",
        flags: {},
      }),
    ).toBe(false);
  });
});
