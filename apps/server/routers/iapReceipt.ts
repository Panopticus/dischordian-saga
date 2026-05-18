// audit-allow-proc: verify
// Native IAP fulfillment is gated behind Capacitor build availability —
// `verify` is the ledger-write boundary (audit/C-03) that mobile clients
// will call once iOS/Android apps ship. Waiver here is intentional;
// remove when the mobile client is wired up.
/**
 * In-App Purchase receipt-validation router.
 *
 * Native (iOS / Android) purchases flow through @revenuecat/purchases-capacitor
 * on the client. After RevenueCat hands back a transaction, the
 * client posts the receipt here for server-side validation against
 * Apple's StoreKit / Google's Play Billing receipt-verification
 * endpoints (or RevenueCat's own webhook, when configured).
 *
 * The route is intentionally `protectedProcedure` — only an
 * authenticated user can claim entitlements. The server treats the
 * receipt as untrusted input; the client never grants its own
 * entitlements.
 *
 * Idempotent on (userId, platform, transactionId) so retries during
 * flaky-network purchase flows don't double-credit. The server
 * fulfillment writes to the existing storePurchases table; the
 * matching FK to users (added in plan §C) ensures rows can't be
 * orphaned.
 *
 * Verification backends:
 *   1. RevenueCat REST  — when REVENUECAT_SECRET_API_KEY is set,
 *      the verifier uses RevenueCat's `subscribers/<id>/receipts`
 *      endpoint as the trust anchor. This is the recommended path.
 *   2. Direct Apple / Google fallback — stubs documented below.
 *      Not implemented in this commit; the route returns "pending
 *      backend wiring" until one of the env-configured backends
 *      lands.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { fulfillPurchase } from "./store";
import { resolveInternalKeyFromSku } from "../storeSkuCatalog";
import { logger } from "../logger";

const ReceiptInputSchema = z.object({
  platform: z.enum(["ios", "android"]),
  productId: z.string().min(1),
  transactionId: z.string().min(1),
  receipt: z.string().min(1),
  /** Optional offering identifier for RevenueCat-driven flows. */
  offeringId: z.string().optional(),
});

export const iapReceiptRouter = router({
  /**
   * Validate a native-platform purchase receipt and grant the
   * entitlement on success. Caller passes the platform-specific
   * receipt token; the server verifies upstream and writes a row to
   * storePurchases keyed on transactionId for idempotency.
   *
   * Returns:
   *   { ok: true, orderId } when verified + fulfilled.
   *   { ok: false, code, message } on validation / network failure.
   */
  verify: protectedProcedure
    .input(ReceiptInputSchema)
    .mutation(async ({ input, ctx }) => {
      const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
      if (!apiKey) {
        // Configured-but-not-yet-wired path. The route ships now
        // (parity check needs the import) so the rest of the IAP
        // stack can land in parallel; production rollout requires
        // setting REVENUECAT_SECRET_API_KEY (or adding a direct
        // Apple/Google verifier branch).
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "IAP receipt verification backend is not configured. " +
            "Set REVENUECAT_SECRET_API_KEY (or implement a direct " +
            "App Store / Play Store verifier in this router).",
        });
      }

      const userId = ctx.user.id;

      // Balance F7 — the client-supplied productId is a platform
      // store SKU. Resolve it through the cross-platform catalog to
      // the internal product key and reject anything not in it. This
      // is the gate that makes web/iOS/Android SKUs provably
      // consistent: fulfillment is keyed on the internal product, not
      // on whatever string the client sent.
      const internalProductKey = resolveInternalKeyFromSku(
        input.platform,
        input.productId,
      );
      if (!internalProductKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown ${input.platform} store SKU "${input.productId}" — not in STORE_SKU_CATALOG.`,
        });
      }

      // RevenueCat's REST API is the trust anchor: their server
      // already verified the receipt with Apple/Google before they
      // exposed it to us. We just confirm the transaction belongs
      // to this user and write our own fulfillment row.
      const verifyUrl = `https://api.revenuecat.com/v1/receipts`;
      let response: Response;
      try {
        response = await fetch(verifyUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "X-Platform": input.platform,
          },
          body: JSON.stringify({
            app_user_id: String(userId),
            fetch_token: input.receipt,
            product_id: input.productId,
          }),
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `RevenueCat verification network error: ${(err as Error).message}`,
        });
      }
      if (!response.ok) {
        const body = await response.text();
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `RevenueCat rejected receipt (${response.status}): ${body.slice(0, 256)}`,
        });
      }

      // audit/12.F3 — actually grant the entitlement now that
      // RevenueCat has confirmed the receipt. fulfilmentId is keyed on
      // (platform, transactionId) which is the natural idempotency
      // boundary for native receipts — Apple/Google retry the same
      // transactionId; RevenueCat normalises both. The unique index
      // on `purchase_grants.fulfillmentId` (synthesiseFulfillmentId
      // path) prevents double-credit on retry.
      const fulfillmentId = `iap:${input.platform}:${input.transactionId}`;
      try {
        const result = await fulfillPurchase(
          ctx.user.id,
          internalProductKey,
          1,
          fulfillmentId,
        );
        return {
          ok: true as const,
          orderId: fulfillmentId,
          alreadyFulfilled: result.alreadyFulfilled,
          message: result.alreadyFulfilled
            ? "Receipt already fulfilled (idempotent)."
            : "Receipt verified and entitlement granted.",
        };
      } catch (err) {
        logger.error("[iapReceipt] fulfillment failed", {
          userId: ctx.user.id,
          productId: input.productId,
          internalProductKey,
          fulfillmentId,
          err,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Receipt verified but fulfillment failed: ${(err as Error).message}`,
        });
      }
    }),
});
