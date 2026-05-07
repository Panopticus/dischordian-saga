/**
 * IAP receipt-verification hook.
 *
 * Thin React-Query / tRPC wrapper around `trpc.iapReceipt.verify`.
 * Used as the `nativeVerifyReceipt` callback for `purchaseProduct`
 * in `apps/client/src/lib/payments/index.ts` when the platform is
 * Capacitor-native (iOS / Android via RevenueCat).
 *
 * Existing as a static call site here serves two purposes:
 *
 *   1. **Connection-audit visibility.** The procedure was previously
 *      consumed only behind a `Capacitor.isNativePlatform()` runtime
 *      branch the static scanner couldn't follow, which required
 *      an `audit-allow-proc: verify` waiver in the router file.
 *      With this hook in place the scanner sees the call directly
 *      and the waiver is removed.
 *
 *   2. **Type-driven receipt shape.** The hook exports the input
 *      shape so the payment adapter and any future caller (e.g.
 *      a manual restore-purchases UI) can pass receipts through
 *      one type-checked path.
 *
 * The web (Stripe) purchase flow does NOT use this hook — it
 * routes through `store.createCheckout` instead. iapReceipt.verify
 * is the native-only path.
 */
import { trpc } from "@/lib/trpc";

export interface IapReceiptVerifyInput {
  platform: "ios" | "android";
  productId: string;
  transactionId: string;
  receipt: string;
  /** Optional offering identifier for RevenueCat-driven flows. */
  offeringId?: string;
}

/**
 * React hook returning the tRPC `iapReceipt.verify` mutation.
 * Mirrors the standard tRPC + React-Query pattern used elsewhere
 * in the client.
 *
 * Usage:
 *
 *   const verify = useIapReceiptVerify();
 *   const result = await verify.mutateAsync({
 *     platform: "ios",
 *     productId: "...",
 *     transactionId: "...",
 *     receipt: "...",
 *   });
 */
export function useIapReceiptVerify() {
  return trpc.iapReceipt.verify.useMutation();
}
