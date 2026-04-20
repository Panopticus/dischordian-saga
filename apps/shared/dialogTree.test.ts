import { describe, expect, it } from "vitest";

import {
  getDialogNode,
  getEntryNode,
  isDialogTreeConnected,
  isTerminalNode,
  visibleChoices,
  walkNodes,
  type DialogTree,
} from "./dialogTree";
import { elaraAct1 } from "./dialogTrees/elaraAct1";
import { humanAct1 } from "./dialogTrees/humanAct1";

const ALL_TREES: readonly DialogTree[] = [elaraAct1, humanAct1];

describe("dialogTree schema", () => {
  it("every tree resolves its entry node", () => {
    for (const tree of ALL_TREES) {
      const entry = getEntryNode(tree);
      expect(entry).not.toBeNull();
    }
  });

  it("getDialogNode throws for unknown ids", () => {
    expect(() => getDialogNode(elaraAct1, "does-not-exist")).toThrow();
  });

  it("every tree is fully connected — no dangling nextId / autoNext", () => {
    for (const tree of ALL_TREES) {
      expect(isDialogTreeConnected(tree)).toBe(true);
    }
  });

  it("walkNodes visits every node exactly once", () => {
    for (const tree of ALL_TREES) {
      const walked = walkNodes(tree);
      const ids = walked.map((n) => n.id);
      expect(ids.length).toBe(Object.keys(tree.nodes).length);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("visibleChoices respects `requires` flag gates", () => {
    const node = {
      id: "gated",
      speaker: "elara" as const,
      voLineId: "vo.gated",
      onscreenText: "gated",
      choices: [
        { label: "visible", nextId: "x" },
        { label: "locked", nextId: "y", requires: "secret" },
      ],
    };
    expect(visibleChoices(node, {})).toHaveLength(1);
    expect(visibleChoices(node, { secret: true })).toHaveLength(2);
  });

  it("every tree has at least one terminal node (no infinite loops)", () => {
    for (const tree of ALL_TREES) {
      const terminals = Object.values(tree.nodes).filter(isTerminalNode);
      expect(terminals.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("scripted Act 1 trees", () => {
  it("elara-act1 speaker is always elara", () => {
    for (const node of Object.values(elaraAct1.nodes)) {
      expect(node.speaker).toBe("elara");
    }
  });

  it("human-act1 speaker is always human", () => {
    for (const node of Object.values(humanAct1.nodes)) {
      expect(node.speaker).toBe("human");
    }
  });

  it("voLineIds follow the `<speaker>.<act>.<...>` convention", () => {
    for (const node of Object.values(elaraAct1.nodes)) {
      expect(node.voLineId.startsWith("elara.act1.")).toBe(true);
    }
    for (const node of Object.values(humanAct1.nodes)) {
      expect(node.voLineId.startsWith("human.act1.")).toBe(true);
    }
  });

  it("voLineIds are unique within each tree", () => {
    for (const tree of ALL_TREES) {
      const ids = Object.values(tree.nodes).map((n) => n.voLineId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("onscreenText and voLineId are both non-empty for every node", () => {
    for (const tree of ALL_TREES) {
      for (const node of Object.values(tree.nodes)) {
        expect(node.onscreenText.length).toBeGreaterThan(0);
        expect(node.voLineId.length).toBeGreaterThan(0);
      }
    }
  });

  it("flag-setting choices use stable `<speaker>_act1_<token>` names", () => {
    const flagPattern = /^(elara|human)_act1_[a-z_]+$/;
    for (const tree of ALL_TREES) {
      for (const node of Object.values(tree.nodes)) {
        for (const choice of node.choices ?? []) {
          if (choice.sets) {
            expect(choice.sets).toMatch(flagPattern);
          }
        }
      }
    }
  });
});
