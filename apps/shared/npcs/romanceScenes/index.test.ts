import { describe, it, expect } from "vitest";

import {
  ROMANCE_COMMITTED_FLAGS,
  ROMANCE_NPC_IDS,
  ROMANCE_SCENE_BANKS,
} from "./index";

describe("romance scene banks coverage", () => {
  it("ships a scene bank for every romance candidate", () => {
    for (const id of ROMANCE_NPC_IDS) {
      const bank = ROMANCE_SCENE_BANKS[id];
      expect(bank, `romance bank for ${id}`).toBeDefined();
      expect(bank.length).toBeGreaterThan(0);
    }
  });

  it("every bank has at least two scenes per ladder stage (open + close)", () => {
    for (const id of ROMANCE_NPC_IDS) {
      const bank = ROMANCE_SCENE_BANKS[id];
      for (const stage of [1, 2, 3, 4, 5] as const) {
        const hits = bank.filter((line) =>
          line.lineId.includes(`.s${stage}.`)
        );
        expect(
          hits.length,
          `${id} stage ${stage} has ${hits.length} scenes (need >= 2)`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("every committed-romance flag is set somewhere in its bank", () => {
    for (const id of ROMANCE_NPC_IDS) {
      const bank = ROMANCE_SCENE_BANKS[id];
      const committedFlag = ROMANCE_COMMITTED_FLAGS[id];
      const flagSetters = bank.filter((line) =>
        (line.setsFlags ?? []).includes(committedFlag),
      );
      expect(
        flagSetters.length,
        `${id} bank should set ${committedFlag}`,
      ).toBeGreaterThan(0);
    }
  });

  it("Vex stage-3 commitment honours the Engineer reveal gate", () => {
    const vex = ROMANCE_SCENE_BANKS.vex;
    const stage3Commit = vex.find(
      (line) =>
        line.lineId === "vex.romance.s3.commit" ||
        (line.setsFlags ?? []).includes("romance:committed:vex"),
    );
    expect(stage3Commit?.requiresRevealStage).toBe("engineer_zero_hint");
  });

  it("DMC Companion stage-3 includes both partner-name and kin-name branches", () => {
    const dmc = ROMANCE_SCENE_BANKS.dmc_companion;
    const partnerBranch = dmc.find((l) =>
      (l.setsFlags ?? []).includes("dmc_naming_partner_branch"),
    );
    const kinBranch = dmc.find((l) =>
      (l.setsFlags ?? []).includes("dmc_naming_kin_branch"),
    );
    expect(partnerBranch).toBeDefined();
    expect(kinBranch).toBeDefined();
  });

  it("Locke stage-3 includes path-aware variants for Disclosure and Betrayal", () => {
    const locke = ROMANCE_SCENE_BANKS.locke;
    const disclosure = locke.find(
      (l) => l.reactsToPublicFlag === "act1_path_a",
    );
    const betrayal = locke.find(
      (l) => l.reactsToPublicFlag === "act3_full_secret",
    );
    expect(disclosure).toBeDefined();
    expect(betrayal).toBeDefined();
  });

  it("every stage-5 scene fires at minAct >= 6 (post-arc devotion)", () => {
    for (const id of ROMANCE_NPC_IDS) {
      const bank = ROMANCE_SCENE_BANKS[id];
      const stage5 = bank.filter((l) => l.lineId.includes(".s5."));
      for (const scene of stage5) {
        expect(
          scene.minAct ?? 0,
          `${scene.lineId} should be act 6+`,
        ).toBeGreaterThanOrEqual(6);
      }
    }
  });
});
