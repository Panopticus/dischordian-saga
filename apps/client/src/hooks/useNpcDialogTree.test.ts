/**
 * useNpcDialogTree — wiring contract.
 * Source-scan style (matches useLivingUniverseSync.test.ts).
 * Behavioral logic for the pure reducer is unit-tested in
 * apps/shared/npcs/dialogTrees/runner.test.ts.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "useNpcDialogTree.ts"),
  "utf-8",
);

describe("useNpcDialogTree — wiring", () => {
  it("imports the canonical pure reducer from the shared runner module", () => {
    expect(SRC).toContain('from "@shared/npcs/dialogTrees/runner"');
    expect(SRC).toContain("startTreeRun");
    expect(SRC).toContain("advanceTreeRun");
    expect(SRC).toContain("autoAdvanceTreeRun");
  });

  it("imports NpcDialogTree / NpcDialogNode / NpcDialogChoice from the shared types module", () => {
    expect(SRC).toContain('from "@shared/npcs/dialogTrees/types"');
    expect(SRC).toContain("NpcDialogTree");
    expect(SRC).toContain("NpcDialogChoice");
    expect(SRC).toContain("NpcDialogNode");
  });

  it("subscribes to the server-authoritative tRPC mutation", () => {
    // The new Phase 1 procedure landed in
    // apps/server/routers/npc.ts. The hook MUST use that exact
    // procedure name — `npc.reactToEvent` is the legacy line-graph
    // commit and does NOT understand BioWare outcomes.
    expect(SRC).toContain("trpc.npc.recordDialogChoiceOutcome.useMutation");
  });
});

describe("useNpcDialogTree — server-authoritative contract", () => {
  it("forwards ONLY the server-authoritative input shape (treeId + nodeId + choiceIndex)", () => {
    // A malicious client could not bypass server authority even if
    // the hook tried — but defense in depth: the hook must not
    // include outcome fields (factionRepDelta, unlockCard, etc.) in
    // the mutation payload. The server looks those up from the
    // tree.
    const mutateAsyncBlock = SRC.match(
      /commitMutation\.mutateAsync\(\{[\s\S]{0,400}?\}\)/,
    );
    expect(mutateAsyncBlock, "mutateAsync call not found").not.toBeNull();
    const block = mutateAsyncBlock![0];
    // Accept either explicit `key: value` or shorthand `key,` forms.
    expect(block).toMatch(/\bnpcKey\b/);
    expect(block).toMatch(/\btreeId\b/);
    expect(block).toMatch(/\bnodeId\b/);
    expect(block).toMatch(/\bchoiceIndex\b/);
    expect(block).not.toContain("factionRepDelta");
    expect(block).not.toContain("unlockCard");
    expect(block).not.toContain("mutateNextEncounterDeck");
    expect(block).not.toContain("stakesAxisDelta");
  });

  it("awaits the server commit BEFORE advancing local state (no optimistic advance)", () => {
    // The advance() callback must call advanceTreeRun *after*
    // awaiting mutateAsync — otherwise a server rejection would
    // visually advance, then snap back. Sequence: await mutate →
    // setLastResult → setState(advance) → fire callback.
    const advanceBlock = SRC.match(
      /const advance = useCallback\([\s\S]{0,2000}?\),\s*\[/,
    );
    expect(advanceBlock, "advance callback not found").not.toBeNull();
    const block = advanceBlock![0];
    const awaitIdx = block.indexOf("await commitMutation.mutateAsync");
    const setStateIdx = block.indexOf("setState((prev) => advanceTreeRun");
    expect(awaitIdx).toBeGreaterThan(0);
    expect(setStateIdx).toBeGreaterThan(awaitIdx);
  });

  it("clears prior error on a successful commit and fires the caller callback exactly once", () => {
    const advanceBlock = SRC.match(
      /const advance = useCallback\([\s\S]{0,2000}?\),\s*\[/,
    )![0];
    expect(advanceBlock).toContain("setError(null)");
    expect(advanceBlock).toContain("onChoiceCommitted?.(result)");
    // The callback fires exactly once: the regex below would match
    // multiple invocations if the hook ever fired it more than once.
    const matches = advanceBlock.match(/onChoiceCommitted\?\.\(/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("re-throws server errors so callers can render their own feedback", () => {
    const advanceBlock = SRC.match(
      /const advance = useCallback\([\s\S]{0,2000}?\),\s*\[/,
    )![0];
    expect(advanceBlock).toMatch(/throw err/);
    expect(advanceBlock).toMatch(/catch\s*\(e\)/);
  });

  it("validates choiceIndex range client-side before contacting the server", () => {
    // Out-of-range choices should fail fast with RangeError — not
    // round-trip to the server for a BAD_REQUEST response.
    const advanceBlock = SRC.match(
      /const advance = useCallback\([\s\S]{0,2000}?\),\s*\[/,
    )![0];
    expect(advanceBlock).toMatch(/RangeError/);
    expect(advanceBlock).toMatch(/out of range/);
  });
});

describe("useNpcDialogTree — autoNext semantics", () => {
  it("autoAdvance is pure client-side (no mutation call) — autoNext beats are presentation only", () => {
    const autoBlock = SRC.match(
      /const autoAdvance = useCallback\([\s\S]{0,500}?\),\s*\[/,
    );
    expect(autoBlock, "autoAdvance callback not found").not.toBeNull();
    expect(autoBlock![0]).not.toContain("commitMutation");
    expect(autoBlock![0]).not.toContain("mutateAsync");
  });

  it("autoAdvance guards on canAutoAdvance to avoid throwing on terminal nodes", () => {
    const autoBlock = SRC.match(
      /const autoAdvance = useCallback\([\s\S]{0,500}?\),\s*\[/,
    )![0];
    expect(autoBlock).toContain("canAutoAdvance");
  });
});

describe("useNpcDialogTree — return surface", () => {
  it("exposes the canonical view fields the BioWare UI needs", () => {
    // Tightly enumerated so a refactor that drops one of these
    // surfaces fails the gate.
    const returnBlock = SRC.match(/return \{[\s\S]+?\};/g)?.at(-1);
    expect(returnBlock).toBeDefined();
    const block = returnBlock!;
    for (const field of [
      "currentNode",
      "choices",
      "advance",
      "autoAdvance",
      "ended",
      "committing",
      "lastResult",
      "error",
      "state",
    ]) {
      expect(block, field).toContain(field);
    }
  });

  it("`committing` is wired to the tRPC mutation's isPending (not a parallel local flag)", () => {
    expect(SRC).toContain("committing: commitMutation.isPending");
  });
});
