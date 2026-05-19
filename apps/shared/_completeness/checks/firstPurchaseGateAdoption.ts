/**
 * First-purchase SKU server-gate parity check.
 *
 * `first_purchase_starter` is a $0.99 conversion hook whose catalog
 * copy promises "available first 7 days only!" and which is balanced
 * as a once-per-account bundle (200 Dream + 3 rare packs + cosmetic).
 * Nothing enforced either constraint server-side — it was a
 * permanently-repeatable arbitrage. The fix is `store.ts`'s
 * `assertFirstPurchaseEligible` chokepoint, gated here so a refactor
 * can't silently drop the call and reopen the exploit.
 *
 * Invariants (hard parity):
 *   1. FIRST_PURCHASE_GATED_SKUS still lists `first_purchase_starter`.
 *   2. The Stripe `createCheckout` mutation — the only purchase path
 *      for a priceUsd-only SKU — invokes assertFirstPurchaseEligible
 *      before creating the session.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const STORE = "apps/server/routers/store.ts";

export function checkFirstPurchaseGateAdoption(): RawParityCount {
  const abs = path.join(REPO_ROOT, STORE);
  const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
  const missing: string[] = [];

  if (!/FIRST_PURCHASE_GATED_SKUS[\s\S]*?first_purchase_starter/.test(src)) {
    missing.push(
      `${STORE}: FIRST_PURCHASE_GATED_SKUS no longer lists first_purchase_starter — the once-per-account / 7-day gate is gone`,
    );
  }

  // Isolate the createCheckout procedure body (from its declaration to
  // the next top-level procedure) and require the gate call inside it.
  const ccStart = src.indexOf("createCheckout:");
  const ccSlice =
    ccStart >= 0
      ? src.slice(ccStart, src.indexOf("purchaseWithCredits:", ccStart))
      : "";
  if (!/assertFirstPurchaseEligible\s*\(/.test(ccSlice)) {
    missing.push(
      `${STORE}: createCheckout no longer calls assertFirstPurchaseEligible — Stripe checkout for first_purchase_starter is ungated`,
    );
  }

  const declared = 2;
  return { declared, implemented: declared - missing.length, missing };
}
