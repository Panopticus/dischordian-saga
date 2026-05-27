// apps/shared/npcs/dialogTrees/runner.test.ts
//
// Unit tests for the pure tree-walk reducer that underlies
// `useNpcDialogTree`.

import { describe, expect, it } from "vitest";
import {
  startTreeRun,
  advanceTreeRun,
  autoAdvanceTreeRun,
  canAutoAdvance,
  currentNode,
} from "./runner";
import type { NpcDialogTree } from "./types";

const FIXTURE: NpcDialogTree = {
  id: "fixture-tree",
  npcKey: "the_game_master",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_game_master",
      onscreenText: "Choose.",
      choices: [
        { label: "A", nextId: "branch_a" },
        { label: "B", nextId: "branch_b" },
      ],
    },
    branch_a: {
      id: "branch_a",
      npcKey: "the_game_master",
      onscreenText: "A taken.",
      autoNext: "terminal",
    },
    branch_b: {
      id: "branch_b",
      npcKey: "the_game_master",
      onscreenText: "B taken.",
      autoNext: "terminal",
    },
    terminal: {
      id: "terminal",
      npcKey: "the_game_master",
      onscreenText: "Done.",
    },
  },
};

describe("startTreeRun", () => {
  it("seeds at the tree's declared entry node", () => {
    const s = startTreeRun(FIXTURE);
    expect(s.currentNodeId).toBe("root");
    expect(s.ended).toBe(false);
    expect(s.history).toEqual([]);
  });

  it("accepts an entryNodeId override", () => {
    const s = startTreeRun(FIXTURE, { entryNodeId: "branch_a" });
    expect(s.currentNodeId).toBe("branch_a");
  });

  it("marks ended when the entry is itself terminal", () => {
    const s = startTreeRun(FIXTURE, { entryNodeId: "terminal" });
    expect(s.ended).toBe(true);
  });

  it("throws when the resolved entry node is missing", () => {
    expect(() =>
      startTreeRun(FIXTURE, { entryNodeId: "does_not_exist" }),
    ).toThrow(/entry node/);
  });
});

describe("advanceTreeRun", () => {
  it("walks to choice.nextId and records the transition in history", () => {
    const s0 = startTreeRun(FIXTURE);
    const s1 = advanceTreeRun(s0, FIXTURE, 1);
    expect(s1.currentNodeId).toBe("branch_b");
    expect(s1.history).toEqual([{ nodeId: "root", choiceIndex: 1 }]);
  });

  it("throws RangeError for an out-of-range choice index", () => {
    const s = startTreeRun(FIXTURE);
    expect(() => advanceTreeRun(s, FIXTURE, 99)).toThrow(RangeError);
  });

  it("does not mutate when the state is already ended", () => {
    const ended = { ...startTreeRun(FIXTURE), ended: true };
    expect(advanceTreeRun(ended, FIXTURE, 0)).toBe(ended);
  });

  it("does not flip ended when the next node still has an autoNext", () => {
    const s = advanceTreeRun(startTreeRun(FIXTURE), FIXTURE, 0);
    expect(s.currentNodeId).toBe("branch_a");
    expect(s.ended).toBe(false);
  });
});

describe("autoAdvanceTreeRun", () => {
  it("walks node.autoNext and marks ended when the destination is terminal", () => {
    const s0 = advanceTreeRun(startTreeRun(FIXTURE), FIXTURE, 0);
    const s1 = autoAdvanceTreeRun(s0, FIXTURE);
    expect(s1.currentNodeId).toBe("terminal");
    expect(s1.ended).toBe(true);
  });

  it("records a choiceless transition in history", () => {
    const s0 = advanceTreeRun(startTreeRun(FIXTURE), FIXTURE, 0);
    const s1 = autoAdvanceTreeRun(s0, FIXTURE);
    expect(s1.history.at(-1)).toEqual({ nodeId: "branch_a" });
  });

  it("throws when the current node has no autoNext", () => {
    const s = startTreeRun(FIXTURE);
    expect(() => autoAdvanceTreeRun(s, FIXTURE)).toThrow(/no autoNext/);
  });

  it("is a no-op once the state is already ended", () => {
    const ended = { ...startTreeRun(FIXTURE), ended: true };
    expect(autoAdvanceTreeRun(ended, FIXTURE)).toBe(ended);
  });
});

describe("canAutoAdvance + currentNode", () => {
  it("canAutoAdvance is true for an autoNext-only node, false for a choice node", () => {
    const s0 = startTreeRun(FIXTURE);
    expect(canAutoAdvance(s0, FIXTURE)).toBe(false);
    const s1 = advanceTreeRun(s0, FIXTURE, 0);
    expect(canAutoAdvance(s1, FIXTURE)).toBe(true);
  });

  it("currentNode resolves the current node id back to the node object", () => {
    const s = startTreeRun(FIXTURE);
    expect(currentNode(s, FIXTURE)?.id).toBe("root");
  });
});
