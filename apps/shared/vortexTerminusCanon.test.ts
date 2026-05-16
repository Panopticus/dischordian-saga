/* ═══════════════════════════════════════════════════════
   VORTEX / TERMINUS RECONCILIATION — integrity tests (PR-22)

   Proves the Terminus Swarm is reconciled to the spine (the
   Risen / First Coming) with its alternate readings preserved,
   and the Vortex remains the tracked canon_pending gap.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  VORTEX_TERMINUS_THREADS,
  getReconciledThread,
  getVortexTerminusCoverage,
} from "./vortexTerminusCanon";
import { checkVortexTerminusCoverage } from "./_completeness/checks/vortexTerminusCoverage";

describe("vortex / terminus reconciliation", () => {
  it("has two threads: terminus (reconciled) + vortex (canon_pending)", () => {
    const cov = getVortexTerminusCoverage();
    expect(cov.declared).toBe(2);
    expect(cov.reconciled).toBe(1);
    expect(cov.canonPending).toBe(1);
  });

  it("the Terminus Swarm is canonically the Risen / First Coming", () => {
    const t = getReconciledThread("terminus_swarm");
    expect(t?.status).toBe("reconciled");
    expect(t?.canonicalReading ?? "").toMatch(/Risen/i);
    expect(t?.canonicalReading ?? "").toMatch(/First[- ]Coming/i);
  });

  it("preserves the two non-canon readings as recorded alternates", () => {
    const t = getReconciledThread("terminus_swarm");
    const ids = (t?.alternates ?? []).map((a) => a.id).sort();
    expect(ids).toEqual([
      "terminus_thought_virus",
      "terminus_vortex_manifestation",
    ]);
  });

  it("the Vortex stays canon_pending with a loreSource + canonNote", () => {
    const v = getReconciledThread("the_vortex");
    expect(v?.status).toBe("canon_pending");
    expect(v?.loreSource.length).toBeGreaterThan(0);
    expect((v?.canonNote ?? "").length).toBeGreaterThan(0);
    expect(v?.canonicalReading).toBeUndefined();
  });

  it("the parity gate ratchets on the Vortex gap (not a FAIL)", () => {
    const r = checkVortexTerminusCoverage();
    // Vortex is the tracked gap → at least one missing line,
    // but the reconciled Terminus is implemented.
    expect(r.declared).toBe(2);
    expect(r.implemented).toBe(1);
    expect((r.missing ?? []).join(" ")).toMatch(/the_vortex/);
  });
});
