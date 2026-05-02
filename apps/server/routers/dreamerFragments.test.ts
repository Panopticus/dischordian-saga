/**
 * Wiring test for the dreamerFragments router. Procedure-level
 * integration testing requires a real DB; here we lock the public
 * surface (procedure name) — the no-DB-safety contract for the
 * underlying pure helper lives in
 * apps/shared/dreamerFragments.test.ts.
 */
import { describe, it, expect } from "vitest";
import { dreamerFragmentsRouter } from "./dreamerFragments";

describe("dreamerFragmentsRouter — wiring", () => {
  it("module imports cleanly", () => {
    expect(dreamerFragmentsRouter).toBeDefined();
  });

  it("exposes the documented getMyFragments query", () => {
    const keys = Object.keys(
      (dreamerFragmentsRouter as unknown as {
        _def: { procedures: Record<string, unknown> };
      })._def.procedures,
    );
    expect(keys).toContain("getMyFragments");
  });
});
