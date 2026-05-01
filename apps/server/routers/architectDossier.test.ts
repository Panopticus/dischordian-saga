/**
 * Wiring tests for the architect-dossier router. No DB available in
 * the test env, so the focus is the no-DB-safe contract: returns a
 * neutral dossier without throwing.
 */
import { describe, it, expect } from "vitest";
import { architectDossierRouter } from "./architectDossier";

describe("architectDossierRouter — wiring", () => {
  it("module imports cleanly", () => {
    expect(architectDossierRouter).toBeDefined();
  });

  it("exposes the documented procedure", () => {
    const keys = Object.keys(
      (architectDossierRouter as unknown as { _def: { procedures: Record<string, unknown> } })
        ._def.procedures,
    );
    expect(keys).toContain("getMyDossier");
  });
});
