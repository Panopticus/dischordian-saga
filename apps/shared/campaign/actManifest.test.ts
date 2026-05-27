import { describe, it, expect } from "vitest";
import {
  ACT_IDS,
  listManifestOpponents,
  manifestHasBattles,
  type ActManifest,
} from "./actManifest";

describe("ACT_IDS canonical list", () => {
  it("includes Acts 1–7 plus optional Act 4.5", () => {
    expect(ACT_IDS).toEqual([1, 2, 3, "4", "4.5", 5, 6, 7]);
  });
});

const ladderManifest: ActManifest = {
  actId: 1,
  title: "Act 1: First Light",
  subtitle: "The witness arrives.",
  unlockFlag: null,
  completionFlag: "act_1_complete",
  startFlag: "act_1_started",
  defaultDialogBankId: "act1OpponentDialog",
  surface: {
    mode: "ladder",
    opponents: [
      {
        encounterId: "ch1_warlord_zero",
        name: "Warlord Zero",
        faction: "insurgency",
      },
      {
        encounterId: "ch2_corey_collector",
        name: "Corey Collector",
        faction: "neutral",
      },
    ],
    finale: {
      encounterId: "chAuthorityTrial",
      name: "The Authority Trial",
      faction: "new_babylon",
    },
  },
};

const singleManifest: ActManifest = {
  actId: "4",
  title: "Act 4: Path Not Yet Resolved",
  subtitle: "",
  unlockFlag: "act_4_started",
  completionFlag: "act_4_complete",
  defaultDialogBankId: "act4OpponentDialog",
  surface: {
    mode: "single",
    encounter: {
      encounterId: "act4_boss",
      name: "The Resolver",
      faction: "architect",
    },
  },
};

const branchingManifest: ActManifest = {
  actId: 2,
  title: "Act 2: Trade Empire",
  subtitle: "",
  unlockFlag: "act_2_started",
  completionFlag: "act_2_complete",
  defaultDialogBankId: "act2OpponentDialog",
  surface: {
    mode: "branching",
    branches: [
      {
        requires: "act1_closing_choice_made",
        encounter: {
          encounterId: "act2_aware",
          name: "Aware Path",
          faction: "antiquarian",
        },
      },
    ],
    defaultBranch: {
      encounterId: "act2_default",
      name: "Default Path",
      faction: "neutral",
    },
  },
};

const interludeManifest: ActManifest = {
  actId: "4.5",
  title: "Act 4.5: Dead Man's Circuit",
  subtitle: "",
  unlockFlag: "act_4_5_started",
  completionFlag: "act_4_5_complete",
  defaultDialogBankId: "act4_5OpponentDialog",
  surface: { mode: "interlude", dialogTreeId: "dead_mans_circuit_intro" },
};

describe("listManifestOpponents", () => {
  it("flattens a ladder manifest including the finale", () => {
    const opps = listManifestOpponents(ladderManifest);
    expect(opps.map((o) => o.encounterId)).toEqual([
      "ch1_warlord_zero",
      "ch2_corey_collector",
      "chAuthorityTrial",
    ]);
  });

  it("returns the single encounter for single-mode acts", () => {
    expect(listManifestOpponents(singleManifest)).toHaveLength(1);
    expect(listManifestOpponents(singleManifest)[0].encounterId).toBe("act4_boss");
  });

  it("returns default + branch encounters for branching acts", () => {
    const opps = listManifestOpponents(branchingManifest);
    expect(opps.map((o) => o.encounterId).sort()).toEqual(
      ["act2_aware", "act2_default"].sort(),
    );
  });

  it("returns only branch encounters when defaultBranch is omitted (Act 4 shape)", () => {
    const noDefault: ActManifest = {
      ...branchingManifest,
      surface: {
        mode: "branching",
        branches: [
          {
            requires: "some_flag",
            encounter: {
              encounterId: "branch_only",
              name: "Branch Only",
              faction: "neutral",
            },
          },
        ],
        // defaultBranch intentionally omitted — verifies the optional
        // shape that ACT_4_MANIFEST relies on.
      },
    };
    const opps = listManifestOpponents(noDefault);
    expect(opps.map((o) => o.encounterId)).toEqual(["branch_only"]);
  });

  it("returns empty for interlude-only acts", () => {
    expect(listManifestOpponents(interludeManifest)).toHaveLength(0);
  });
});

describe("manifestHasBattles", () => {
  it("is true for ladder / single / branching modes", () => {
    expect(manifestHasBattles(ladderManifest)).toBe(true);
    expect(manifestHasBattles(singleManifest)).toBe(true);
    expect(manifestHasBattles(branchingManifest)).toBe(true);
  });
  it("is false for interlude-only acts", () => {
    expect(manifestHasBattles(interludeManifest)).toBe(false);
  });
});
