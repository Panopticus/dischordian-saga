/* ═══════════════════════════════════════════════════════
   NPC ROUTER — recordDialogChoiceOutcome contract tests

   Source-grep verification (matches the existing
   `npc.reactToEvent.test.ts` pattern) that the new
   BioWare-style procedure is registered, validates input
   shape, performs server-authoritative tree lookup, and
   forwards the authored choice through the campaign
   outcome pipeline.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { appRouter } from "../routers";

const src = fs.readFileSync(
  path.resolve(__dirname, "npc.ts"),
  "utf-8",
);

describe("npcRouter — recordDialogChoiceOutcome registration", () => {
  it("registers npc.recordDialogChoiceOutcome procedure", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["npc.recordDialogChoiceOutcome"]).toBeDefined();
  });
});

describe("npcRouter.recordDialogChoiceOutcome — wiring", () => {
  it("imports the server-authoritative tree lookup from the dialog-tree aggregator", () => {
    expect(src).toContain("getDialogTree");
    expect(src).toContain('from "../../shared/npcs/dialogTrees"');
  });

  it("imports applyDialogChoiceOutcomes and dispatchOutcomeBundle from the campaign barrel", () => {
    expect(src).toContain("applyDialogChoiceOutcomes");
    expect(src).toContain("dispatchOutcomeBundle");
    expect(src).toContain('from "../../shared/campaign"');
  });

  it("imports the server-side context builder", () => {
    expect(src).toContain("buildOutcomeDispatchContext");
    expect(src).toContain('from "../services/buildOutcomeDispatchContext"');
  });

  it("declares the procedure with the BioWare-authoritative input shape (treeId + nodeId + choiceIndex, NOT raw outcomes)", () => {
    // Server-authoritative: client points at an authored choice; the
    // server cannot accept raw factionRepDelta / unlockCard from input,
    // otherwise a malicious client could mint cards or shift rep.
    const proc = src.match(
      /recordDialogChoiceOutcome[\s\S]{0,1500}?\.mutation/,
    );
    expect(proc, "procedure block not found").not.toBeNull();
    const block = proc![0];
    expect(block).toMatch(/treeId:/);
    expect(block).toMatch(/nodeId:/);
    expect(block).toMatch(/choiceIndex:/);
    expect(block).not.toMatch(/factionRepDelta:/);
    expect(block).not.toMatch(/unlockCard:/);
    expect(block).not.toMatch(/mutateNextEncounterDeck:/);
  });

  it("looks up the authored choice from the tree, not the input payload", () => {
    const body = src.match(
      /recordDialogChoiceOutcome[\s\S]{0,3000}?\}\),\s*\n\s*\/\*\*/,
    );
    expect(body, "procedure body not found").not.toBeNull();
    const block = body![0];
    expect(block).toMatch(/getDialogTree\(/);
    expect(block).toMatch(/tree\.nodes\[/);
    expect(block).toMatch(/node\.choices\?\.\[input\.choiceIndex\]/);
    // The authored `choice` from the tree is what feeds the resolver —
    // NOT a synthetic object built from input.
    expect(block).toMatch(/applyDialogChoiceOutcomes\(choice/);
  });

  it("throws structured TRPC errors when the tree / node / choice is missing", () => {
    const body = src.match(
      /recordDialogChoiceOutcome[\s\S]{0,3000}?\}\),\s*\n\s*\/\*\*/,
    )!;
    const block = body[0];
    expect(block).toMatch(/TRPCError/);
    expect(block).toMatch(/NOT_FOUND/);
    expect(block).toMatch(/BAD_REQUEST/);
  });
});
