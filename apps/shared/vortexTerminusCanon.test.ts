/* ═══════════════════════════════════════════════════════
   VORTEX / TERMINUS RECONCILIATION — integrity tests (PR-22)

   Proves the Terminus Swarm is reconciled to the Thought
   Virus (dreamer 2026-05-17) with its alternate readings
   (Risen / First-Coming, Vortex-manifestation) preserved,
   and the Vortex is hard-locked as the doomsday-clock
   terminal state feeding the Final Coming. Both threads are
   reconciled; the gate is a hard PASS.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  VORTEX_TERMINUS_THREADS,
  getReconciledThread,
  getVortexTerminusCoverage,
} from "./vortexTerminusCanon";
import { checkVortexTerminusCoverage } from "./_completeness/checks/vortexTerminusCoverage";

describe("vortex / terminus reconciliation", () => {
  it("has two threads, both reconciled (Vortex bound 2026-05-16)", () => {
    const cov = getVortexTerminusCoverage();
    expect(cov.declared).toBe(2);
    expect(cov.reconciled).toBe(2);
    expect(cov.canonPending).toBe(0);
  });

  it("the Terminus Swarm is canonically the Thought Virus (independent threat)", () => {
    const t = getReconciledThread("terminus_swarm");
    expect(t?.status).toBe("reconciled");
    expect(t?.canonicalReading ?? "").toMatch(/Thought Virus/i);
    expect(t?.canonicalReading ?? "").toMatch(/independent/i);
    expect(t?.canonicalReading ?? "").toMatch(/Kael|Source/);
    // The Risen / First-Coming reading is demoted to a recorded alternate.
    expect(t?.canonicalReading ?? "").not.toMatch(/IS the First Coming/i);
  });

  it("preserves the two non-canon readings as recorded alternates", () => {
    const t = getReconciledThread("terminus_swarm");
    const ids = (t?.alternates ?? []).map((a) => a.id).sort();
    expect(ids).toEqual([
      "terminus_risen_first_coming",
      "terminus_vortex_manifestation",
    ]);
  });

  it("the Vortex is reconciled: Archon #9 starship, Engineer destroys it before execution by the Politician", () => {
    const v = getReconciledThread("the_vortex");
    expect(v?.status).toBe("reconciled");
    expect(v?.canonicalReading ?? "").toMatch(/Archon #9/i);
    expect(v?.canonicalReading ?? "").toMatch(/starship/i);
    expect(v?.canonicalReading ?? "").toMatch(/consumes entire stars/i);
    expect(v?.canonicalReading ?? "").toMatch(/Engineer|vex_solene/i);
    expect(v?.canonicalReading ?? "").toMatch(/Politician/i);
    expect(v?.canonicalReading ?? "").toMatch(/Zenon/i);
    expect(v?.canonicalReading ?? "").toMatch(/doomsday|terminal state/i);
    expect(v?.canonicalReading ?? "").toMatch(/Final Coming/i);
    expect((v?.alternates ?? []).length).toBeGreaterThan(0);
    expect(v?.canonNote ?? "").toMatch(/Final Coming|endgame/i);
    expect(v?.canonNote ?? "").toMatch(/HARD-LOCK/i);
  });

  it("the parity gate is fully reconciled (gap closed to 0)", () => {
    const r = checkVortexTerminusCoverage();
    expect(r.declared).toBe(2);
    expect(r.implemented).toBe(2);
    expect(r.missing ?? []).toEqual([]);
  });
});
