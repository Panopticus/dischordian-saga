/**
 * Wiring tests for the dreamerAwareness router. Procedure-level
 * integration testing requires a real DB; here we lock the public
 * surface (procedure names) — the no-DB-safety contract for
 * tagBurntCardWitnessed lives in dreamerAwarenessTriggers.test.ts.
 */
import { describe, it, expect } from "vitest";
import { dreamerAwarenessRouter } from "./dreamerAwareness";

describe("dreamerAwarenessRouter — wiring", () => {
  it("module imports cleanly", () => {
    expect(dreamerAwarenessRouter).toBeDefined();
  });

  it("exposes the documented client-reportable procedure", () => {
    const keys = Object.keys(
      (dreamerAwarenessRouter as unknown as { _def: { procedures: Record<string, unknown> } })
        ._def.procedures,
    );
    expect(keys).toContain("reportBurntCardWitnessed");
  });
});
