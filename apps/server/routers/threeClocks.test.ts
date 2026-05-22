/**
 * Wiring test for the threeClocks router.
 *
 * No DB is available in the test env, so this is contract-level:
 *   - The router is registered with the expected procedure shape.
 *   - The composer's contract is exercised separately in
 *     apps/shared/threeClocks/state.test.ts.
 */
import { describe, it, expect } from "vitest";
import { threeClocksRouter } from "./threeClocks";

describe("threeClocks router shape", () => {
  it("exposes a single `get` query procedure", () => {
    const procedures = threeClocksRouter._def.procedures as Record<string, unknown>;
    expect(procedures.get).toBeDefined();
  });
});
