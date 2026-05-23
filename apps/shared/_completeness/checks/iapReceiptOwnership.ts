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
 * Scanned across both the router and the verifier service — the
 * router calls the dispatcher in `apps/server/services/iapVerifiers.ts`
 * (C-03 fallbacks for Apple + Google live there too) and either file
 * may carry the ownership invariants.
 *
 * Hard parity: the verify mutation must parse the subscriber payload
 * and gate fulfilment on the claimed product being present — a
 * refactor can't silently revert to trusting the status code.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const FILES = [
  "apps/server/routers/iapReceipt.ts",
  "apps/server/services/iapVerifiers.ts",
];

export function checkIapReceiptOwnership(): RawParityCount {
  const sources = FILES.map((f) => {
    const abs = path.join(REPO_ROOT, f);
    return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
  });
  const corpus = sources.join("\n");
  const missing: string[] = [];

  const parsesSubscriber =
    /response\.json\(\)/.test(corpus) && /subscriber/.test(corpus);
  const checksProductPresence =
    /non_subscriptions/.test(corpus) &&
    /subscriptions/.test(corpus) &&
    /input\.productId|productId/.test(corpus);
  const rejectsAbsent = /did not contain a purchase of/.test(corpus);

  if (!parsesSubscriber) {
    missing.push(
      `${FILES.join(" + ")}: verify no longer parses the RevenueCat subscriber payload`,
    );
  }
  if (!checksProductPresence) {
    missing.push(
      `${FILES.join(" + ")}: verify no longer checks the claimed productId against non_subscriptions/subscriptions`,
    );
  }
  if (!rejectsAbsent) {
    missing.push(
      `${FILES.join(" + ")}: verify no longer rejects a 200 whose subscriber lacks the claimed product`,
    );
  }

  const declared = 3;
  return { declared, implemented: declared - missing.length, missing };
}
