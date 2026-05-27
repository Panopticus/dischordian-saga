/**
 * DuelystGameUI — in-match dialog wiring contract.
 * Source-scan style. Phase A3 of the narrative-spine adoption plan.
 *
 * Behavioral logic for the overlay is unit-tested in
 * InMatchDialogChoice.test.ts; the underlying tree walk in
 * apps/shared/npcs/dialogTrees/runner.test.ts.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "DuelystGameUI.tsx"),
  "utf-8",
);

const TRANSLATOR_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "..", "..", "..", "shared", "tcg-core", "compat", "legacyClient.ts"),
  "utf-8",
);

describe("DuelystGameUI — narrative-hook evaluator", () => {
  it("imports checkNarrativeHooks from the canonical encounter module", () => {
    expect(SRC).toContain("checkNarrativeHooks");
    expect(SRC).toContain('from "@shared/tcg-core/story/encounter"');
  });

  it("evaluates hooks after each gameState transition via useEffect", () => {
    // The evaluator MUST run after every dispatch so once:true
    // hooks get a chance to fire on the new state. useEffect on
    // gameState is the canonical seam — pinning it so a refactor
    // that moves to a per-dispatch pattern surfaces here.
    expect(SRC).toMatch(/useEffect\(\(\)\s*=>\s*\{[\s\S]{0,200}checkNarrativeHooks/);
  });

  it("maintains a firedHooks set across the match (once:true hook tracking)", () => {
    expect(SRC).toMatch(/firedHooksRef.*useRef<Set<string>>/);
  });

  it("mounts at most ONE overlay per evaluator pass (breaks on first branching_dialog)", () => {
    // Multiple branching_dialog hooks firing simultaneously would
    // stack overlays; the evaluator must break after the first.
    const block = SRC.match(
      /for \(const action of actions\)[\s\S]{0,800}?\}\s*\}/,
    );
    expect(block, "evaluator loop not found").not.toBeNull();
    expect(block![0]).toContain("break");
  });

  it("warns + skips on authoring drift (hook references unknown treeId)", () => {
    expect(SRC).toMatch(/unknown treeId/);
  });
});

describe("DuelystGameUI — InMatchDialogChoice mount", () => {
  it("imports the overlay component", () => {
    expect(SRC).toMatch(/from\s+"\.\.\/\.\.\/components\/match\/InMatchDialogChoice"/);
  });

  it("renders the overlay when inMatchDialog state is set", () => {
    expect(SRC).toContain("<InMatchDialogChoice");
    expect(SRC).toContain("tree={inMatchDialog.tree}");
    expect(SRC).toContain("entryNodeId={inMatchDialog.entryNodeId}");
  });

  it("wires the canonical onChoiceCommitted + onClose callbacks", () => {
    expect(SRC).toContain("handleInMatchDialogChoiceCommitted");
    expect(SRC).toContain("handleInMatchDialogClose");
  });
});

describe("DuelystGameUI — choice commit dispatches through tcgClient", () => {
  it("uses the bundle-to-engine-actions bridge from the campaign module", () => {
    expect(SRC).toContain("outcomeBundleToEngineActions");
    expect(SRC).toContain('from "@shared/campaign/outcomeBundleToActions"');
  });

  it("dispatches apply_dialog_stakes through tcgClient (not the server commit)", () => {
    // The in-match path is engine-only — the server-authoritative
    // procedure `npc.recordDialogChoiceOutcome` is NOT called here.
    const handler = SRC.match(
      /const handleInMatchDialogChoiceCommitted[\s\S]{0,2500}?\},\s*\[\s*\]/,
    );
    expect(handler, "handler not found").not.toBeNull();
    const block = handler![0];
    expect(block).toContain('type: "apply_dialog_stakes"');
    expect(block).toContain("client.dispatch(");
    expect(block).not.toContain("recordDialogChoiceOutcome");
  });

  it("passes localSide = 0 (in-match player) to the bridge", () => {
    const handler = SRC.match(
      /const handleInMatchDialogChoiceCommitted[\s\S]{0,2500}?\},\s*\[\s*\]/,
    )![0];
    expect(handler).toMatch(/outcomeBundleToEngineActions\(\s*bundle\s*,\s*0\s*,/);
  });
});

describe("legacyClient.ts — apply_dialog_stakes translator case", () => {
  it("translates the legacy { type: 'apply_dialog_stakes', ... } action shape", () => {
    expect(TRANSLATOR_SRC).toContain('case "apply_dialog_stakes":');
  });

  it("rejects malformed payloads (missing outcomeId or non-array deltas)", () => {
    expect(TRANSLATOR_SRC).toContain("outcomeId required");
    expect(TRANSLATOR_SRC).toContain("deltas must be an array");
  });

  it("produces a tcg-core Action with kind: apply_dialog_stakes + auto-minted seq", () => {
    expect(TRANSLATOR_SRC).toMatch(
      /kind: "apply_dialog_stakes"[\s\S]{0,200}seq[,\s]/,
    );
  });
});
