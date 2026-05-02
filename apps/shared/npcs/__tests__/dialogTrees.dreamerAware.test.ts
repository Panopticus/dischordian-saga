// apps/shared/npcs/__tests__/dialogTrees.dreamerAware.test.ts
//
// D3 (dual-faction recruitment plan) — verifies the Dreamer-aware
// alternate-entry surface on `NpcDialogTree`, plus the canonical
// content of the Degen + Vex Solène first-meeting variants.
//
// The Dreamer-aware variant fires when:
//   awareness ≥ 3   AND   visionsReceived.length ≥ 1
// The server-side `dreamerAwareness.getStatus` query computes the
// flag; the client passes it to `getEntryNode(tree, { dreamerAware:
// true })` to swap the entry node. Trees that don't author a variant
// render identically for all players.

import { describe, it, expect } from "vitest";
import {
  getEntryNode,
  resolveEntryNodeId,
  walkNodes,
  isDialogTreeConnected,
  isDialogTreeNpcConsistent,
  countPlayerPaths,
  type NpcDialogTree,
} from "../dialogTrees/types";
import { THE_DEGEN_FIRST_GAME } from "../dialogTrees/the_degen/first_meeting";
import { VEX_SOLENE_FIRST_MEETING } from "../dialogTrees/vex_solene/first_meeting";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("Dreamer-aware entry resolution (resolveEntryNodeId / getEntryNode)", () => {
  const treeWithVariant: NpcDialogTree = {
    id: "fixture-with-variant",
    npcKey: "adjudicator_locke",
    entryNodeId: "root",
    dreamerAwareEntryNodeId: "dreamer_aware_root",
    nodes: {
      root: {
        id: "root",
        npcKey: "adjudicator_locke",
        voLineId: "x",
        onscreenText: "default",
      },
      dreamer_aware_root: {
        id: "dreamer_aware_root",
        npcKey: "adjudicator_locke",
        voLineId: "y",
        onscreenText: "dreamer-aware",
      },
    },
  };

  const treeWithoutVariant: NpcDialogTree = {
    id: "fixture-without-variant",
    npcKey: "adjudicator_locke",
    entryNodeId: "root",
    nodes: {
      root: {
        id: "root",
        npcKey: "adjudicator_locke",
        voLineId: "x",
        onscreenText: "default",
      },
    },
  };

  it("resolveEntryNodeId returns the default entry when called without opts", () => {
    expect(resolveEntryNodeId(treeWithVariant)).toBe("root");
  });

  it("resolveEntryNodeId returns the default entry when dreamerAware:false", () => {
    expect(
      resolveEntryNodeId(treeWithVariant, { dreamerAware: false }),
    ).toBe("root");
  });

  it("resolveEntryNodeId returns the variant when dreamerAware:true and the tree authors one", () => {
    expect(
      resolveEntryNodeId(treeWithVariant, { dreamerAware: true }),
    ).toBe("dreamer_aware_root");
  });

  it("resolveEntryNodeId falls back to default when dreamerAware:true but no variant is authored", () => {
    expect(
      resolveEntryNodeId(treeWithoutVariant, { dreamerAware: true }),
    ).toBe("root");
  });

  it("getEntryNode mirrors resolveEntryNodeId for both branches", () => {
    expect(getEntryNode(treeWithVariant)?.id).toBe("root");
    expect(
      getEntryNode(treeWithVariant, { dreamerAware: true })?.id,
    ).toBe("dreamer_aware_root");
  });

  it("walkNodes includes the dreamer-aware entry exactly once even when it is the variant root", () => {
    const ids = walkNodes(treeWithVariant).map((n) => n.id);
    expect(ids).toContain("root");
    expect(ids).toContain("dreamer_aware_root");
    expect(ids.filter((id) => id === "dreamer_aware_root").length).toBe(1);
  });
});

describe("The Degen — D3 dreamer-aware variant tree", () => {
  const t = THE_DEGEN_FIRST_GAME;

  it("authors a dreamer-aware entry", () => {
    expect(t.dreamerAwareEntryNodeId).toBe("dreamer_aware_root");
  });

  it("dreamer-aware entry resolves correctly", () => {
    const node = getEntryNode(t, { dreamerAware: true });
    expect(node?.id).toBe("dreamer_aware_root");
  });

  it("dreamer-aware variant is canonically connected to the shared terminal", () => {
    expect(isDialogTreeConnected(t)).toBe(true);
    expect(isDialogTreeNpcConsistent(t)).toBe(true);
  });

  it("dreamer-aware root carries the nihilist-gnomic decoder voice", () => {
    const node = t.nodes["dreamer_aware_root"];
    // Casino-as-arithmetic register survives.
    expect(node?.onscreenText).toMatch(/arithmetic/i);
    // Recognition without naming the watcher.
    expect(node?.onscreenText).not.toMatch(/Dreamer/i);
    expect(node?.onscreenText).not.toMatch(/vision/i);
  });

  it("dreamer-aware variant exposes a 'who watches' decoder beat that files the Dreamer-aware flag", () => {
    const root = t.nodes["dreamer_aware_root"];
    const choice = root?.choices?.find(
      (c) => c.nextId === "dreamer_aware_who_watches",
    );
    expect(choice?.publicFlag).toBe(
      "degen_filed_player_as_dreamer_aware_first_contact",
    );
    expect(choice?.trustDelta).toBeGreaterThanOrEqual(1);
  });

  it("dreamer-aware variant offers a soft denial branch (plausible deniability)", () => {
    const root = t.nodes["dreamer_aware_root"];
    const denial = root?.choices?.find(
      (c) => c.nextId === "dreamer_aware_denial",
    );
    expect(denial).toBeDefined();
  });

  it("§1.4 voice protections still hold across the dreamer-aware sub-tree", () => {
    const dreamerNodes = [
      t.nodes["dreamer_aware_root"],
      t.nodes["dreamer_aware_who_watches"],
      t.nodes["dreamer_aware_denial"],
    ];
    const allText = dreamerNodes.map((n) => n!.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bfair\b/i);
    expect(allText).not.toMatch(/\b(I'm sorry|I am sorry)\b/i);
    expect(allText).not.toMatch(/\bforever\b/i);
    expect(allText).not.toMatch(/\b(soul|salvation|sin)\b/i);
    expect(allText).not.toMatch(/Mostly takes/);
  });

  it("dreamer-aware variant adds nodes (3) on top of the canonical 6", () => {
    // countPlayerPaths walks from the DEFAULT entry only (4 root
    // choices × 1 branch each → 4 paths) — adding the variant entry
    // does not change that count, but it does add 3 nodes the lint
    // utilities reach via Object.values(tree.nodes).
    expect(walkNodes(t).length).toBe(9);
  });

  it("degen_filed_player_as_dreamer_aware_first_contact is registered in cross-character reactions", () => {
    expect(allRegisteredFlags()).toContain(
      "degen_filed_player_as_dreamer_aware_first_contact",
    );
  });
});

describe("Vex Solène — D3 dreamer-aware variant tree", () => {
  const t = VEX_SOLENE_FIRST_MEETING;

  it("authors a dreamer-aware entry", () => {
    expect(t.dreamerAwareEntryNodeId).toBe("dreamer_aware_root");
  });

  it("dreamer-aware entry resolves correctly", () => {
    const node = getEntryNode(t, { dreamerAware: true });
    expect(node?.id).toBe("dreamer_aware_root");
  });

  it("every dreamer-aware node still gates the eyes_of_reality reveal stage", () => {
    const dreamerNodes = [
      t.nodes["dreamer_aware_root"],
      t.nodes["dreamer_aware_mintwork"],
      t.nodes["dreamer_aware_ledger_entry"],
    ];
    for (const node of dreamerNodes) {
      expect(node?.requiresRevealStage).toBe("eyes_of_reality");
    }
  });

  it("dreamer-aware root invokes the canonical 'coin without a face' Vision 2 callback", () => {
    const node = t.nodes["dreamer_aware_root"];
    expect(node?.onscreenText).toMatch(/coin without a face/i);
  });

  it("ledger-entry decoder beat reads back partial Vision 2 imagery (noon wrong / cup wrong / listener correct)", () => {
    const node = t.nodes["dreamer_aware_ledger_entry"];
    expect(node?.onscreenText).toMatch(/noon was canonical-wrong/i);
    expect(node?.onscreenText).toMatch(/cup was canonical-wrong/i);
    expect(node?.onscreenText).toMatch(/listener was canonical-correct/i);
  });

  it("ledger-entry beat acknowledges the Maestro alone cannot give a full reading (Casino / Insurgency cross-reference)", () => {
    const node = t.nodes["dreamer_aware_ledger_entry"];
    expect(node?.onscreenText).toMatch(/Casino/i);
    expect(node?.onscreenText).toMatch(/Insurgency/i);
  });

  it("dreamer-aware variant files the Dreamer-aware public flag on the mintwork branch", () => {
    const root = t.nodes["dreamer_aware_root"];
    const choice = root?.choices?.find(
      (c) => c.nextId === "dreamer_aware_mintwork",
    );
    expect(choice?.publicFlag).toBe(
      "vex_filed_player_as_dreamer_aware_first_contact",
    );
    expect(choice?.trustDelta).toBeGreaterThanOrEqual(1);
  });

  it("§1.6 silence-shape: NEVER 'Engineer' / 'Engineer Zero' / 'Agent Zero' anywhere in the dreamer-aware sub-tree", () => {
    const dreamerNodes = [
      t.nodes["dreamer_aware_root"],
      t.nodes["dreamer_aware_mintwork"],
      t.nodes["dreamer_aware_ledger_entry"],
    ];
    const allText = dreamerNodes.map((n) => n!.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
    expect(allText).not.toMatch(/\bAgent Zero\b/);
  });

  it("dreamer-aware variant also does NOT name 'Dreamer' (Vex never speaks the relay)", () => {
    const dreamerNodes = [
      t.nodes["dreamer_aware_root"],
      t.nodes["dreamer_aware_mintwork"],
      t.nodes["dreamer_aware_ledger_entry"],
    ];
    const allText = dreamerNodes.map((n) => n!.onscreenText).join(" ");
    expect(allText).not.toMatch(/\bDreamer\b/);
  });

  it("vex_filed_player_as_dreamer_aware_first_contact is registered in cross-character reactions", () => {
    expect(allRegisteredFlags()).toContain(
      "vex_filed_player_as_dreamer_aware_first_contact",
    );
  });
});
