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
 * client posts the receipt here for server-side validation.
 *
 * Verification dispatch lives in
 * `apps/server/services/iapVerifiers.ts`. Backends try in this order:
 *   1. RevenueCat REST — when REVENUECAT_SECRET_API_KEY is set.
 *   2. Apple `/verifyReceipt` — when platform=ios and
 *      APPLE_IAP_SHARED_SECRET is set. Production endpoint with
 *      transparent sandbox fallback on Apple status 21007.
 *   3. Google Play Developer API — when platform=android and
 *      GOOGLE_PLAY_ACCESS_TOKEN + GOOGLE_PLAY_PACKAGE_NAME are set.
 *
 * The route is `protectedProcedure` — only an authenticated user can
 * claim entitlements. The server treats the receipt as untrusted
 * input; the client never grants its own entitlements.
 *
 * Idempotent on (platform, transactionId) via the existing
 * `purchase_grants.fulfillmentId` unique index, so retries during
 * flaky-network purchase flows don't double-credit.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { fulfillPurchase } from "./store";
import { resolveInternalKeyFromSku } from "../storeSkuCatalog";
import { logger } from "../logger";
import { verifyIapReceipt } from "../services/iapVerifiers";

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
   * receipt token; the dispatcher in iapVerifiers.ts verifies
   * upstream and writes a row to purchase_grants keyed on
   * `iap:<platform>:<transactionId>` for idempotency.
   *
   * Returns:
   *   { ok: true, orderId, verifiedBy } on success.
   *   throws TRPCError otherwise (PRECONDITION_FAILED for missing
   *   backend config, BAD_REQUEST for SKU / receipt rejection,
   *   INTERNAL_SERVER_ERROR for network or fulfillment failure).
   */
  verify: protectedProcedure
    .input(ReceiptInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // Balance F7 — resolve the client-supplied store SKU through the
      // cross-platform catalog before doing anything else. Web/iOS/Android
      // SKUs are provably consistent because fulfillment is keyed on the
      // internal product, not on whatever string the client sent.
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

      const result = await verifyIapReceipt({
        userId,
        platform: input.platform,
        productId: input.productId,
        transactionId: input.transactionId,
        receipt: input.receipt,
      });

      if (!result.ok) {
        const code =
          result.code === "no_backend" || result.code === "config"
            ? "PRECONDITION_FAILED"
            : result.code === "network"
              ? "INTERNAL_SERVER_ERROR"
              : "BAD_REQUEST";
        logger.warn("[iapReceipt] verify failed", {
          userId,
          platform: input.platform,
          productId: input.productId,
          code: result.code,
          message: result.message,
        });
        throw new TRPCError({ code, message: result.message });
      }

      // Receipt verified. Grant the entitlement; fulfillment is keyed
      // on (platform, transactionId) which is the natural idempotency
      // boundary for native receipts — Apple/Google retry the same
      // transactionId. The unique index on `purchase_grants.fulfillmentId`
      // prevents double-credit on retry.
      const fulfillmentId = `iap:${input.platform}:${input.transactionId}`;
      try {
        const fulfillment = await fulfillPurchase(
          userId,
          internalProductKey,
          1,
          fulfillmentId,
        );
        return {
          ok: true as const,
          orderId: fulfillmentId,
          verifiedBy: result.verifiedBy,
          alreadyFulfilled: fulfillment.alreadyFulfilled,
          message: fulfillment.alreadyFulfilled
            ? "Receipt already fulfilled (idempotent)."
            : "Receipt verified and entitlement granted.",
        };
      } catch (err) {
        logger.error("[iapReceipt] fulfillment failed", {
          userId,
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
