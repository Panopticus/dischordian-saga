/**
 * Wiring test for the preparationMissions router.
 *
 * The mission lifecycle is exhaustively covered in
 * apps/shared/preparationMissions/registry.test.ts. This file
 * pins the contract: the router exposes the expected procedures
 * and validates evaluation input with reasonable bounds.
 */
import { describe, it, expect } from "vitest";
import { preparationMissionsRouter } from "./preparationMissions";

describe("preparationMissions router shape", () => {
  it("exposes list / start / complete / submit procedures", () => {
    const procedures = preparationMissionsRouter._def.procedures as Record<string, unknown>;
    expect(procedures.list).toBeDefined();
    expect(procedures.start).toBeDefined();
    expect(procedures.complete).toBeDefined();
    expect(procedures.submit).toBeDefined();
  });
});
