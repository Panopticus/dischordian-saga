/**
 * Wiring tests for the dreamer-visions router. Procedure-level
 * integration testing requires a DB; here we lock the public surface
 * (procedure names) and the no-DB-safe contract for getNextPendingVision
 * via the underlying service tests.
 */
import { describe, it, expect } from "vitest";
import { dreamerVisionsRouter } from "./dreamerVisions";

describe("dreamerVisionsRouter — wiring", () => {
  it("module imports cleanly", () => {
    expect(dreamerVisionsRouter).toBeDefined();
  });

  it("exposes the two documented procedures", () => {
    const keys = Object.keys(
      (dreamerVisionsRouter as unknown as { _def: { procedures: Record<string, unknown> } })
        ._def.procedures,
    );
    expect(keys).toEqual(
      expect.arrayContaining(["getNextPendingVision", "markVisionReceived"]),
    );
  });
});
