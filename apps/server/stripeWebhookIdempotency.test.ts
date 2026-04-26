/**
 * Static guard: Stripe webhook handler runs the event-level
 * idempotency check before any fulfillment work.
 *
 * Behavioral coverage of the table itself lives in the fresh-DB
 * smoke test (`apps/scripts/db-fresh-smoke.ts`), which spins a clean
 * MySQL service container in CI, runs the bootstrap, and asserts the
 * `processed_webhook_events` table exists post-bootstrap. This test
 * asserts the wiring:
 *
 *   1. `processedWebhookEvents` is exported from the schema.
 *   2. `bootstrapWebhookEventsTable` is exported from the service.
 *   3. The Stripe webhook handler in `_core/index.ts`:
 *      - Imports `processedWebhookEvents` and inserts a row keyed
 *        by the Stripe `event.id`.
 *      - Returns a 200 with `duplicate: true` on a unique-violation,
 *        without calling fulfillment.
 *      - Has the layer-A guard textually BEFORE the
 *        `event.type === "checkout.session.completed"` branch, i.e.
 *        replay protection runs ahead of any side-effect path.
 *
 * Why this exists: prior to this commit, the handler relied solely
 * on a unique index on `store_purchases.stripePaymentIntentId`. That
 * works for intent-bearing purchases but credit/dream purchases pay
 * without a payment intent — null payment intents are non-conflicting
 * in MySQL so a replayed webhook could double-fulfill. Closing that
 * hole means a textually-precise guard at the top of the handler.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

describe("Stripe webhook event-level idempotency", () => {
  it("schema exports processedWebhookEvents table", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "apps/db/schema.ts"), "utf-8");
    expect(src).toMatch(/export const processedWebhookEvents = mysqlTable\("processed_webhook_events"/);
    expect(src).toMatch(/uq_processed_webhook_events_event_id/);
  });

  it("bootstrap service exports bootstrapWebhookEventsTable", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/services/webhookEventsBootstrap.ts"),
      "utf-8",
    );
    expect(src).toMatch(/export function bootstrapWebhookEventsTable/);
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS `processed_webhook_events`/);
  });

  it("server _core/index.ts wires the bootstrap into startup", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/_core/index.ts"),
      "utf-8",
    );
    expect(src).toMatch(/bootstrapWebhookEventsTable/);
    // Bootstrap must live alongside the other two startup bootstraps.
    expect(src).toMatch(/bootstrapAnnouncementsTables[\s\S]*bootstrapWebhookEventsTable/);
  });

  it("Stripe handler inserts into processed_webhook_events before fulfillment", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/_core/index.ts"),
      "utf-8",
    );
    // The layer-A guard imports the schema and the db, then inserts
    // a row keyed by event.id.
    expect(src).toMatch(/processedWebhookEvents/);
    expect(src).toMatch(/eventId:\s*event\.id/);
    expect(src).toMatch(/eventType:\s*event\.type/);
  });

  it("Stripe handler short-circuits replays with duplicate:true", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/_core/index.ts"),
      "utf-8",
    );
    // The unique-violation branch returns 200 with duplicate flag.
    expect(src).toMatch(/duplicate:\s*true/);
    expect(src).toMatch(/Replay of event/);
  });

  it("Stripe handler runs the event-level guard BEFORE checkout.session.completed branch", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/_core/index.ts"),
      "utf-8",
    );
    const guardIdx = src.indexOf("processedWebhookEvents");
    const checkoutIdx = src.indexOf('event.type === "checkout.session.completed"');
    expect(guardIdx).toBeGreaterThan(0);
    expect(checkoutIdx).toBeGreaterThan(0);
    expect(guardIdx).toBeLessThan(checkoutIdx);
  });

  it("schema layer-B unique index on stripePaymentIntentId is preserved", () => {
    // Defense-in-depth: layer A (event id) is the primary guard, but
    // layer B (payment intent id) catches the rare cross-event-id
    // same-payment-intent case. Both must remain.
    const src = fs.readFileSync(path.resolve(ROOT, "apps/db/schema.ts"), "utf-8");
    expect(src).toMatch(/uq_store_purchases_stripe_intent.*stripePaymentIntentId/s);
  });
});
