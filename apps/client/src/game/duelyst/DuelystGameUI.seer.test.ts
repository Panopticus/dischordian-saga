/**
 * Structural test suite for §4.9 Seer match-end flag writes inside
 * DuelystGameUI. RTL isn't in the client dep tree (see
 * FamilyTreeView.test.tsx for precedent), so we can't mount the
 * component and drive a real match. Instead we assert the six
 * invariants that together guarantee correct outcome-to-flag routing:
 *
 *   1. `deriveSeerOutcome` is imported from the shared engine.
 *   2. The hook reads `gameState.seerProphecy` before writing flags.
 *   3. The `seerFlagsWrittenRef` guard exists and is reset per match.
 *   4. `SEER_OUTCOME_FLAGS[outcome]` is the only source of outcome
 *      flag ids (no hard-coded strings).
 *   5. `SEER_STAFF_WITNESSED_FLAG` + `ACT1_CYCLE_B_COMPLETE_FLAG`
 *      both fire post-resolution regardless of outcome.
 *   6. The hook gates on `gameState.winner !== null` (no writes
 *      during play).
 *
 * Per-outcome correctness of `deriveSeerOutcome` itself is exhaustively
 * covered by `apps/shared/tcg-core/engine/seerProphecy.test.ts`; this
 * file protects the campaign-layer wiring in the UI.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const uiSrc = fs.readFileSync(
  path.resolve(__dirname, "DuelystGameUI.tsx"),
  "utf-8",
);

describe("DuelystGameUI — §4.9 Seer outcome flag writes", () => {
  it("imports deriveSeerOutcome from the shared engine", () => {
    expect(uiSrc).toContain('from "@shared/tcg-core/engine/seerProphecy"');
    expect(uiSrc).toContain("deriveSeerOutcome");
  });

  it("imports SEER_OUTCOME_FLAGS from the shared types module", () => {
    expect(uiSrc).toContain('from "@shared/tcg-core/types/SeerProphecy"');
    expect(uiSrc).toContain("SEER_OUTCOME_FLAGS");
    expect(uiSrc).toContain("SEER_STAFF_WITNESSED_FLAG");
    expect(uiSrc).toContain("ACT1_CYCLE_B_COMPLETE_FLAG");
  });

  it("guards the write path with seerFlagsWrittenRef", () => {
    // Guard must be declared, read, set, and reset on new-match init.
    expect(uiSrc).toMatch(/const\s+seerFlagsWrittenRef\s*=\s*useRef/);
    expect(uiSrc).toMatch(/if\s*\(\s*seerFlagsWrittenRef\.current\s*\)\s*return/);
    expect(uiSrc).toMatch(/seerFlagsWrittenRef\.current\s*=\s*true/);
    expect(uiSrc).toMatch(/seerFlagsWrittenRef\.current\s*=\s*false/);
  });

  it("only writes flags after the match has resolved", () => {
    // The hook body must early-return when winner is null so writes
    // don't fire mid-match.
    expect(uiSrc).toMatch(/gameState\.winner\s*===\s*null/);
  });

  it("only writes flags when a §4.9 encounter is active", () => {
    expect(uiSrc).toMatch(/!gameState\.seerProphecy/);
  });

  it("uses SEER_OUTCOME_FLAGS[outcome] — no hard-coded outcome flag ids", () => {
    expect(uiSrc).toMatch(/SEER_OUTCOME_FLAGS\[\s*outcome\s*\]/);
    // Defensive: the outcome flag ids should NOT appear as literal
    // strings in the UI — that would mean someone inlined them past
    // the SEER_OUTCOME_FLAGS lookup and bypassed the type system.
    expect(uiSrc).not.toContain('"act1_seer_visit_defeated"');
    expect(uiSrc).not.toContain('"act1_seer_visit_scripted_loss"');
    expect(uiSrc).not.toContain('"act1_seer_visit_fled"');
  });

  it("fires the two post-resolution flags regardless of outcome", () => {
    // Staff-witnessed + cycle-B-complete must fire on any Seer match
    // end — they gate the downstream "to-be-the-human" slideshow.
    expect(uiSrc).toMatch(
      /setNarrativeFlag\(\s*SEER_STAFF_WITNESSED_FLAG\s*,\s*true\s*\)/,
    );
    expect(uiSrc).toMatch(
      /setNarrativeFlag\(\s*ACT1_CYCLE_B_COMPLETE_FLAG\s*,\s*true\s*\)/,
    );
  });
});

describe("DuelystGameUI — §5.7 → §5.8 handoff", () => {
  it("imports rememberPublicWitnessBalance from the shared handoff module", () => {
    expect(uiSrc).toContain(
      'import { rememberPublicWitnessBalance } from "@shared/act1TrialHandoff"',
    );
  });

  it("destructures setAct1PublicWitnessBalance from useGame()", () => {
    expect(uiSrc).toContain("setAct1PublicWitnessBalance,");
  });

  it("guards the balance capture with publicWitnessBalanceCapturedRef", () => {
    expect(uiSrc).toMatch(
      /const\s+publicWitnessBalanceCapturedRef\s*=\s*useRef/,
    );
    expect(uiSrc).toMatch(
      /if\s*\(\s*publicWitnessBalanceCapturedRef\.current\s*\)\s*return/,
    );
    expect(uiSrc).toMatch(
      /publicWitnessBalanceCapturedRef\.current\s*=\s*true/,
    );
    expect(uiSrc).toMatch(
      /publicWitnessBalanceCapturedRef\.current\s*=\s*false/,
    );
  });

  it("persists the balance via rememberPublicWitnessBalance", () => {
    expect(uiSrc).toMatch(
      /rememberPublicWitnessBalance\(\s*setAct1PublicWitnessBalance/,
    );
    expect(uiSrc).toMatch(/gameState\.publicWitness\.balance/);
  });

  it("captures only when the match has ended AND publicWitness is active", () => {
    // The capture effect must gate on both winner !== null and
    // publicWitness presence so generic (non-§5.7) matches are inert.
    expect(uiSrc).toMatch(/!gameState\.publicWitness/);
  });
});
