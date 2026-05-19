/**
 * IAP receipt ownership-verification parity check.
 *
 * The RevenueCat verifier was already wired, but it granted
 * fulfilment on a bare HTTP 200 — RevenueCat returns 200 with the
 * subscriber object even when it carries no purchase of the claimed
 * product, so "verified" only meant "got 200". The fix parses the
 * subscriber payload and asserts the claimed productId is present
 * (non_subscriptions or subscriptions) before granting.
 *
 * Hard parity: the verify mutation must parse the subscriber payload
 * and gate fulfilment on the claimed product being present — a
 * refactor can't silently revert to trusting the status code.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const FILE = "apps/server/routers/iapReceipt.ts";

export function checkIapReceiptOwnership(): RawParityCount {
  const abs = path.join(REPO_ROOT, FILE);
  const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
  const missing: string[] = [];

  const parsesSubscriber =
    /response\.json\(\)/.test(src) && /subscriber/.test(src);
  const checksProductPresence =
    /non_subscriptions/.test(src) &&
    /subscriptions/.test(src) &&
    /input\.productId/.test(src);
  const rejectsAbsent =
    /Receipt did not contain a purchase of/.test(src);

  if (!parsesSubscriber) {
    missing.push(
      `${FILE}: verify no longer parses the RevenueCat subscriber payload`,
    );
  }
  if (!checksProductPresence) {
    missing.push(
      `${FILE}: verify no longer checks the claimed productId against non_subscriptions/subscriptions`,
    );
  }
  if (!rejectsAbsent) {
    missing.push(
      `${FILE}: verify no longer rejects a 200 whose subscriber lacks the claimed product`,
    );
  }

  const declared = 3;
  return { declared, implemented: declared - missing.length, missing };
}
