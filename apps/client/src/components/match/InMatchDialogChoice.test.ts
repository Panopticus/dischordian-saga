/**
 * InMatchDialogChoice — wiring contract.
 * Source-scan style (matches useNpcDialogTree.test.ts +
 * useLivingUniverseSync.test.ts).
 *
 * Behavioral logic for the underlying tree walk is unit-tested in
 * apps/shared/npcs/dialogTrees/runner.test.ts.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "InMatchDialogChoice.tsx"),
  "utf-8",
);

describe("InMatchDialogChoice — wiring", () => {
  it("imports the canonical pure reducer from the shared runner module", () => {
    expect(SRC).toContain('from "@shared/npcs/dialogTrees/runner"');
    expect(SRC).toContain("startTreeRun");
    expect(SRC).toContain("advanceTreeRun");
    expect(SRC).toContain("autoAdvanceTreeRun");
  });

  it("imports the canonical OutcomeBundle resolver from the campaign barrel", () => {
    expect(SRC).toContain("applyDialogChoiceOutcomes");
    expect(SRC).toContain('from "@shared/campaign"');
  });

  it("imports the canonical NpcDialogTree / NpcDialogChoice types", () => {
    expect(SRC).toContain('from "@shared/npcs/dialogTrees/types"');
  });

  it("does NOT import or call the server-commit hook (in-match path is engine-only)", () => {
    // `useNpcDialogTree` is the OUT-OF-MATCH server-commit hook;
    // mounting it from the in-match overlay would double-commit
    // every choice. Lock this out (probe the actual import + the
    // mutation symbol, not bare string match — the doc-comment
    // legitimately names the OTHER hook for orientation).
    expect(SRC).not.toMatch(/import[^"]*"@\/hooks\/useNpcDialogTree"/);
    expect(SRC).not.toMatch(/from\s+"@\/hooks\/useNpcDialogTree"/);
    expect(SRC).not.toContain("trpc.npc.recordDialogChoiceOutcome");
  });
});

describe("InMatchDialogChoice — choice-commit contract", () => {
  it("builds the OutcomeBundle via applyDialogChoiceOutcomes BEFORE firing onChoiceCommitted", () => {
    // The contract: host receives (choice, bundle) — never raw
    // choice without resolved bundle. The host's dispatch path
    // (outcomeBundleToEngineActions) depends on the bundle shape.
    const handlerBlock = SRC.match(
      /const handlePick = \([\s\S]{0,500}?\};/,
    );
    expect(handlerBlock, "handlePick handler not found").not.toBeNull();
    const block = handlerBlock![0];
    const applyIdx = block.indexOf("applyDialogChoiceOutcomes");
    const commitIdx = block.indexOf("onChoiceCommitted(");
    expect(applyIdx).toBeGreaterThan(0);
    expect(commitIdx).toBeGreaterThan(applyIdx);
  });

  it("composes the outcomeId from treeId.nodeId.choiceIndex (stable replay-safe id)", () => {
    expect(SRC).toMatch(/tree\.id.*currentNodeId.*choiceIndex/);
  });

  it("advances tree state AFTER committing the bundle (so the host's dispatch happens with the right currentNodeId)", () => {
    const handlerBlock = SRC.match(
      /const handlePick = \([\s\S]{0,500}?\};/,
    )![0];
    const commitIdx = handlerBlock.indexOf("onChoiceCommitted(");
    const advanceIdx = handlerBlock.indexOf("advanceTreeRun");
    expect(commitIdx).toBeGreaterThan(0);
    expect(advanceIdx).toBeGreaterThan(commitIdx);
  });
});

describe("InMatchDialogChoice — terminal-node rendering", () => {
  it("renders a Continue button when the tree state is ended (terminal)", () => {
    expect(SRC).toMatch(/isTerminal/);
    expect(SRC).toMatch(/Continue/);
  });

  it("Continue button fires onClose (caller unmounts)", () => {
    expect(SRC).toMatch(/onClick=\{onClose\}/);
  });
});

describe("InMatchDialogChoice — N-choice rendering", () => {
  it("renders one button per visible choice with the choice label", () => {
    expect(SRC).toMatch(/choices\.map\(/);
    expect(SRC).toMatch(/choice\.label/);
  });

  it("uses whitespace-pre-line so multi-speaker authored line breaks render as authored", () => {
    // The Game Master mid-Trial tree authors "Left: ...\n\nRight:
    // ..." in onscreenText. Without whitespace-pre-line the
    // dual-speaker scenes collapse to one line.
    expect(SRC).toContain("whitespace-pre-line");
  });
});
