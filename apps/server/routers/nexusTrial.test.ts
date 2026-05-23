/**
 * Wiring test for the nexusTrial router.
 *
 * The transactional ingestion + aggregation paths are integration-
 * tested in staging. This file pins:
 *   - The router exposes status / submitTestimony / leaderboard.
 *   - makeIdempotencyKey composes the documented tuple format.
 */
import { describe, it, expect } from "vitest";
import { nexusTrialRouter, makeIdempotencyKey } from "./nexusTrial";

describe("nexusTrial router shape", () => {
  it("exposes status / submitTestimony / leaderboard / permadeath / romanceTagEligibility procedures", () => {
    const procedures = nexusTrialRouter._def.procedures as Record<string, unknown>;
    expect(procedures.status).toBeDefined();
    expect(procedures.submitTestimony).toBeDefined();
    expect(procedures.leaderboard).toBeDefined();
    expect(procedures.permadeath).toBeDefined();
    expect(procedures.romanceTagEligibility).toBeDefined();
  });
});

describe("makeIdempotencyKey", () => {
  it("composes ${matchId}:${turnIndex}:${cardIndex}", () => {
    expect(makeIdempotencyKey("match_42", 3, 7)).toBe("match_42:3:7");
  });

  it("is collision-free across different tuples", () => {
    const a = makeIdempotencyKey("m1", 2, 4);
    const b = makeIdempotencyKey("m1", 2, 5);
    const c = makeIdempotencyKey("m1", 3, 4);
    const d = makeIdempotencyKey("m2", 2, 4);
    expect(new Set([a, b, c, d]).size).toBe(4);
  });

  it("is stable: same inputs → same key (idempotency dedup works)", () => {
    expect(makeIdempotencyKey("m1", 2, 4)).toBe(makeIdempotencyKey("m1", 2, 4));
  });
});
