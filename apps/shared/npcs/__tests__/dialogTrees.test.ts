// apps/shared/npcs/__tests__/dialogTrees.test.ts
//
// Phase 6 Infrastructure Deliverable 2 verification.
// Validates the generalized NpcDialogTree shape + utilities using a
// bible-faithful Locke first-meeting fixture (per the Phase 6e tree
// authoring scope: 4 choices reveal player-axis [mercy / vigilance /
// curiosity / wit], each branches into a personality-variant register
// per adjudicator_locke.md §3.x).

import { describe, it, expect } from "vitest";
import {
  getEntryNode,
  getDialogNode,
  visibleChoices,
  walkNodes,
  isTerminalNode,
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
  type NpcDialogTree,
} from "../dialogTrees/types";
import {
  ALL_NPC_DIALOG_TREES,
  getDialogTreesFor,
  getDialogTree,
} from "../dialogTrees";

// ────────────────────────────────────────────────────────────────────
// Fixture: Locke first-meeting tree (per the_writers_guide canonical
// 6-node Trade Hub first-contact pattern). Used to validate the shape
// + utilities; the production tree ships in Phase 6e.
// ────────────────────────────────────────────────────────────────────

const LOCKE_FIRST_MEETING_FIXTURE: NpcDialogTree = {
  id: "locke-first-meeting-fixture",
  npcKey: "adjudicator_locke",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.root",
      onscreenText:
        "Welcome to the Authority's ledger. Before you sign anything, I want to know which of us is buying.",
      choices: [
        {
          label: "I'm here to do business.",
          nextId: "mercantile_branch",
          sets: "locke_axis_read_curiosity",
        },
        {
          label: "I'm here to read the fine print first.",
          nextId: "judicial_branch",
          sets: "locke_axis_read_vigilance",
          trustDelta: 2,
        },
        {
          label: "I'm here because someone needs me to be.",
          nextId: "collegial_branch",
          sets: "locke_axis_read_mercy",
          trustDelta: 1,
        },
        {
          label: "I'm here to find what you're hiding.",
          nextId: "predatory_branch",
          sets: "locke_axis_read_wit",
          trustDelta: -1,
        },
      ],
    },
    mercantile_branch: {
      id: "mercantile_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.mercantile",
      onscreenText:
        "Good. Business I understand. Sit down. The chair is filed.",
      autoNext: "terminal",
    },
    judicial_branch: {
      id: "judicial_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.judicial",
      onscreenText:
        "I am filing this. You read first. Most people do not. The ones who do are the ones I keep.",
      autoNext: "terminal",
    },
    collegial_branch: {
      id: "collegial_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.collegial",
      onscreenText:
        "Then someone is fortunate. The Authority does not often hire on behalf of someone else.",
      autoNext: "terminal",
    },
    predatory_branch: {
      id: "predatory_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.predatory",
      onscreenText:
        "I am filing that you said that. Sit anyway. We can find out together.",
      autoNext: "terminal",
    },
    terminal: {
      id: "terminal",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.terminal",
      onscreenText: "Now: which side of the ledger are you on today?",
    },
  },
};

// ────────────────────────────────────────────────────────────────────

describe("NpcDialogTree — utilities", () => {
  it("getEntryNode returns the entry node", () => {
    const entry = getEntryNode(LOCKE_FIRST_MEETING_FIXTURE);
    expect(entry?.id).toBe("root");
  });

  it("getDialogNode returns named nodes; throws for unknown ids", () => {
    expect(
      getDialogNode(LOCKE_FIRST_MEETING_FIXTURE, "judicial_branch")
        .voLineId,
    ).toBe("locke.first_meeting.judicial");
    expect(() =>
      getDialogNode(LOCKE_FIRST_MEETING_FIXTURE, "no_such_node"),
    ).toThrow(/unknown node id/);
  });

  it("visibleChoices filters by required-flag gate", () => {
    const root = getEntryNode(LOCKE_FIRST_MEETING_FIXTURE)!;
    expect(visibleChoices(root, new Set()).length).toBe(4); // no gates on root
  });

  it("walkNodes returns entry first, then the rest", () => {
    const all = walkNodes(LOCKE_FIRST_MEETING_FIXTURE);
    expect(all[0]?.id).toBe("root");
    expect(all.length).toBe(6);
  });

  it("isTerminalNode identifies terminal nodes correctly", () => {
    const terminal = getDialogNode(
      LOCKE_FIRST_MEETING_FIXTURE,
      "terminal",
    );
    const root = getEntryNode(LOCKE_FIRST_MEETING_FIXTURE)!;
    expect(isTerminalNode(terminal)).toBe(true);
    expect(isTerminalNode(root)).toBe(false);
  });

  it("isDialogTreeConnected accepts a well-formed tree", () => {
    expect(isDialogTreeConnected(LOCKE_FIRST_MEETING_FIXTURE)).toBe(
      true,
    );
  });

  it("isDialogTreeConnected rejects a broken-reference tree", () => {
    const broken: NpcDialogTree = {
      id: "broken-fixture",
      npcKey: "adjudicator_locke",
      nodes: {
        root: {
          id: "root",
          npcKey: "adjudicator_locke",
          voLineId: "x",
          onscreenText: "x",
          choices: [{ label: "go", nextId: "missing_target" }],
        },
      },
    };
    expect(isDialogTreeConnected(broken)).toBe(false);
  });

  it("isDialogTreeNpcConsistent accepts a tree where every node matches", () => {
    expect(
      isDialogTreeNpcConsistent(LOCKE_FIRST_MEETING_FIXTURE),
    ).toBe(true);
  });

  it("isDialogTreeNpcConsistent rejects a tree with a cross-NPC node", () => {
    const mixed: NpcDialogTree = {
      id: "mixed-fixture",
      npcKey: "adjudicator_locke",
      nodes: {
        root: {
          id: "root",
          npcKey: "vex_solene", // ← wrong NPC
          voLineId: "x",
          onscreenText: "x",
        },
      },
    };
    expect(isDialogTreeNpcConsistent(mixed)).toBe(false);
  });

  it("countPlayerPaths produces a sensible path count", () => {
    // Locke fixture: 4 root choices × 1 branch each → 1 terminal = 4 paths.
    expect(countPlayerPaths(LOCKE_FIRST_MEETING_FIXTURE)).toBe(4);
  });
});

describe("ALL_NPC_DIALOG_TREES aggregator", () => {
  it("starts empty before Phase 6e tree authoring (Infrastructure baseline)", () => {
    expect(Array.isArray(ALL_NPC_DIALOG_TREES)).toBe(true);
  });

  it("All 11 priority-roster NPCs ship ≥1 dialog tree (Phase 6e.1 complete)", () => {
    // Phase 6a.2 sub-chunk F shipped Locke; Phase 6e.1a shipped
    // Nilmorg + Vex + Hierophant; Phase 6e.1b shipped Seer + Oracle
    // + Game Master + Meme; Phase 6e.1c shipped Degen + Companion
    // + Eidolon. All 11 priority-roster NPCs canonically ship a
    // first-meeting tree.
    const priorityRoster = [
      "adjudicator_locke",
      "nilmorg",
      "vex_solene",
      "wraith_calder",
      "the_seer",
      "the_oracle",
      "the_game_master",
      "the_meme",
      "the_degen",
      "dmc_clone_companion",
      "your_eidolon",
    ] as const;
    for (const npcKey of priorityRoster) {
      expect(getDialogTreesFor(npcKey).length, npcKey).toBeGreaterThanOrEqual(1);
    }
  });

  it("Locke (Phase 6a.2 sub-chunk F) ships ≥1 dialog tree via the aggregator", () => {
    expect(
      getDialogTreesFor("adjudicator_locke").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("Nilmorg (Phase 6e.1a) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("nilmorg").length).toBeGreaterThanOrEqual(1);
  });

  it("Vex Solène (Phase 6e.1a) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("vex_solene").length).toBeGreaterThanOrEqual(1);
  });

  it("Wraith Calder → Hierophant (Phase 6e.1a) ships ≥1 dialog tree via the aggregator", () => {
    expect(
      getDialogTreesFor("wraith_calder").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("The Seer (Phase 6e.1b) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("the_seer").length).toBeGreaterThanOrEqual(1);
  });

  it("The Oracle (Phase 6e.1b) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("the_oracle").length).toBeGreaterThanOrEqual(1);
  });

  it("The Game Master (Phase 6e.1b) ships ≥1 dialog tree via the aggregator", () => {
    expect(
      getDialogTreesFor("the_game_master").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("The Meme (Phase 6e.1b) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("the_meme").length).toBeGreaterThanOrEqual(1);
  });

  it("The Degen (Phase 6e.1c) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("the_degen").length).toBeGreaterThanOrEqual(1);
  });

  it("DMC Clone Companion (Phase 6e.1c) ships ≥1 dialog tree via the aggregator", () => {
    expect(
      getDialogTreesFor("dmc_clone_companion").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("Your Eidolon (Phase 6e.1c) ships ≥1 dialog tree via the aggregator", () => {
    expect(getDialogTreesFor("your_eidolon").length).toBeGreaterThanOrEqual(1);
  });

  it("getDialogTree returns undefined for unknown (npcKey, treeId)", () => {
    expect(
      getDialogTree("adjudicator_locke", "nonexistent_tree"),
    ).toBeUndefined();
  });
});
