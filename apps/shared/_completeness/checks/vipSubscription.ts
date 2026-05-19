/**
 * VIP subscription end-to-end parity check.
 *
 * VIP is a time-bounded entitlement (vipUntil in the gameData JSON):
 * state is event-driven via Stripe webhooks, the perk is pull-based.
 * That pairing is the whole point — it removes any daily-grant cron
 * (hence no leader-election dependency). This gate binds every seam
 * so a refactor can't leave a half-wired subscription (the exact
 * hollow-scaffolding failure mode the ship gate exists to catch):
 *
 *   1. Catalog: StoreProduct has `subscription?` and a real
 *      category:"subscription" product exists.
 *   2. Checkout: store.ts opens Stripe in mode:"subscription" and
 *      stamps subscription_data.metadata (renewal attribution).
 *   3. Grant: the webhook sets VIP from the authoritative
 *      current_period_end on customer.subscription.created/updated.
 *   4. Lifecycle: the webhook clears VIP on
 *      customer.subscription.deleted.
 *   5. Perk: dailyQuests actually consumes isVipActive *
 *      VIP_DAILY_REWARD_MULTIPLIER (the perk is not hollow).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkVipSubscription(): RawParityCount {
  const products = read("apps/server/products.ts");
  const store = read("apps/server/routers/store.ts");
  const webhook = read("apps/server/_core/index.ts");
  const ent = read("apps/server/services/entitlementService.ts");
  const daily = read("apps/server/routers/dailyQuests.ts");
  const missing: string[] = [];

  if (
    !/subscription\?\s*:\s*\{\s*periodDays/.test(products) ||
    !/category:\s*"subscription"/.test(products)
  ) {
    missing.push(
      "products.ts: no subscription product / StoreProduct.subscription field",
    );
  }

  if (
    !/mode:\s*isSubscription\s*\?\s*"subscription"/.test(store) ||
    !/subscription_data:\s*\{/.test(store)
  ) {
    missing.push(
      "store.ts: createCheckout does not open mode:'subscription' with subscription_data metadata",
    );
  }

  if (
    !/customer\.subscription\.created/.test(webhook) ||
    !/customer\.subscription\.updated/.test(webhook) ||
    !/current_period_end/.test(webhook) ||
    !/setVipUntil\(tx, uid, until\)/.test(webhook)
  ) {
    missing.push(
      "_core/index.ts: customer.subscription.created/updated does not set VIP from current_period_end",
    );
  }
  if (
    !/event\.type === "customer\.subscription\.deleted"/.test(webhook) ||
    !/setVipUntil\(tx, uid, null\)/.test(webhook)
  ) {
    missing.push(
      "_core/index.ts: customer.subscription.deleted does not clear VIP",
    );
  }

  const entExports =
    /export async function setVipUntil/.test(ent) &&
    /export async function isVipActive/.test(ent) &&
    /export const VIP_DAILY_REWARD_MULTIPLIER/.test(ent);
  if (!entExports) {
    missing.push(
      "entitlementService.ts: missing setVipUntil/isVipActive/VIP_DAILY_REWARD_MULTIPLIER",
    );
  }

  if (
    !/isVipActive\(ctx\.user\.id\)/.test(daily) ||
    !/VIP_DAILY_REWARD_MULTIPLIER/.test(daily)
  ) {
    missing.push(
      "dailyQuests.ts: claimReward does not apply the VIP multiplier (perk is hollow)",
    );
  }

  const declared = 6;
  return { declared, implemented: declared - missing.length, missing };
}
