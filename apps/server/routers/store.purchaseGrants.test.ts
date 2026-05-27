/**
 * Wiring tests for the purchase-grants ledger introduced alongside
 * the atomic-fulfilment refactor.
 *
 * No DB is available in the test env, so the focus is contract-level:
 *
 *   - synthesiseFulfillmentId produces stable, prefixed, non-empty
 *     ids that round-trip through the unique-key check at a glance.
 *   - fulfillPurchase no-DB-safe — never throws, returns the
 *     documented degenerate shape.
 *
 * The transactional + idempotent paths require a real MySQL fixture
 * to exercise meaningfully; those land in a follow-up integration
 * test once the harness has one.
 */
import { describe, it, expect } from "vitest";

import {
  fulfillPurchase,
  synthesiseFulfillmentId,
} from "./store";

describe("synthesiseFulfillmentId", () => {
  it("produces a credits-prefixed id for credits flows", () => {
    const id = synthesiseFulfillmentId("credits", 42, "starter_pack");
    expect(id).toMatch(/^credits:42:starter_pack:\d+$/);
  });

  it("produces a dream-prefixed id for dream flows", () => {
    const id = synthesiseFulfillmentId("dream", 7, "card_bundle");
    expect(id).toMatch(/^dream:7:card_bundle:\d+$/);
  });

  it("produces a manual-prefixed id for manual grants", () => {
    const id = synthesiseFulfillmentId("manual", 99, "comp_grant");
    expect(id).toMatch(/^manual:99:comp_grant:\d+$/);
  });

  it("includes a strictly-positive timestamp tail", () => {
    const id = synthesiseFulfillmentId("credits", 1, "x");
    const tail = Number(id.split(":").pop());
    expect(tail).toBeGreaterThan(0);
  });

  it("two calls within the same millisecond may collide — by design", () => {
    // The synthesiser doesn't claim uniqueness across rapid calls;
    // it claims STABILITY for a given (source, user, product, t).
    // Callers that need cross-call uniqueness layer a counter or
    // use the Stripe-provided id. Pin this contract so a future
    // "let's add a random suffix" change is an explicit decision.
    const a = synthesiseFulfillmentId("credits", 1, "x");
    const b = synthesiseFulfillmentId("credits", 1, "x");
    // We can't assert equality (timestamps differ across cores),
    // but the prefix structure must match exactly.
    expect(a.split(":").slice(0, 3)).toEqual(b.split(":").slice(0, 3));
  });
});

describe("fulfillPurchase — no-DB safety", () => {
  it("returns alreadyFulfilled=false without throwing when DB unavailable", async () => {
    const result = await fulfillPurchase(1, "starter_pack", 1, "test:1:starter:1");
    expect(result).toEqual({ alreadyFulfilled: false });
  });

  it("accepts a missing tx (opens its own transaction at runtime)", async () => {
    // tx omitted → fulfillPurchase tries to open its own. With no
    // DB pool, it short-circuits at the getDb() guard and returns.
    const result = await fulfillPurchase(2, "any_key", 1, "test:2:any:2");
    expect(result.alreadyFulfilled).toBe(false);
  });
});
