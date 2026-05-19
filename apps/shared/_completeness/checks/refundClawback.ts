/**
 * Refund / chargeback clawback parity check.
 *
 * The Stripe webhook handled only checkout.session.completed — there
 * was no reverse path, so a player could buy a bundle, refund or
 * chargeback, and keep the granted currency/entitlements. The fix is
 * store.ts `clawbackByPaymentIntent` (currency clawed back clamped at
 * zero, entitlements revoked, consumed grants flagged for ops) wired
 * to the charge.refunded and charge.dispute.created webhook events.
 *
 * Invariants (hard parity):
 *   1. store.ts exports clawbackByPaymentIntent and clamps the
 *      currency reversal at zero (GREATEST(0, ...)) so a refunder who
 *      spent the currency lands at 0, never negative.
 *   2. The webhook handles charge.refunded and invokes the clawback.
 *   3. The webhook handles charge.dispute.created and invokes it.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const STORE = "apps/server/routers/store.ts";
const WEBHOOK = "apps/server/_core/index.ts";

function read(rel: string): string {
  const abs = path.join(REPO_ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
}

export function checkRefundClawback(): RawParityCount {
  const store = read(STORE);
  const webhook = read(WEBHOOK);
  const missing: string[] = [];

  const exportsClawback =
    /export\s+async\s+function\s+clawbackByPaymentIntent/.test(store);
  const clampsAtZero = /GREATEST\(0,\s*\$\{dreamBalance/.test(store);
  if (!exportsClawback || !clampsAtZero) {
    missing.push(
      `${STORE}: clawbackByPaymentIntent missing or no longer clamps the currency reversal at zero (GREATEST(0, ...))`,
    );
  }

  if (
    !/charge\.refunded/.test(webhook) ||
    !/clawbackByPaymentIntent\(\s*pi\s*,\s*["']refund["']/.test(webhook)
  ) {
    missing.push(
      `${WEBHOOK}: charge.refunded no longer triggers clawbackByPaymentIntent`,
    );
  }
  if (
    !/charge\.dispute\.created/.test(webhook) ||
    !/clawbackByPaymentIntent\(\s*pi\s*,\s*["']dispute["']/.test(webhook)
  ) {
    missing.push(
      `${WEBHOOK}: charge.dispute.created no longer triggers clawbackByPaymentIntent`,
    );
  }

  const declared = 3;
  return { declared, implemented: declared - missing.length, missing };
}
