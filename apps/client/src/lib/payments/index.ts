/**
 * Payment-platform abstraction.
 *
 * Two surfaces:
 *
 *   web (browser):   Stripe Checkout via redirect. Same path the
 *                    StorePage has shipped against; tRPC creates a
 *                    checkout session, the client opens the URL.
 *
 *   native (iOS/Android via Capacitor):  StoreKit + Google Play
 *                    Billing via @revenuecat/purchases-capacitor.
 *                    Apple App Store and Google Play forbid
 *                    redirecting out to a web checkout for digital
 *                    goods — the native IAP path is the only legal
 *                    way to ship in those stores.
 *
 * Consumers call the same `purchaseProduct(...)` regardless of
 * platform; the runtime branch picks the right backend. Receipt
 * validation lands server-side via the tRPC `iapReceipt.verify`
 * route (apps/server/routers/iapReceipt.ts) — clients never trust
 * their own receipts to grant entitlements.
 */
import type { ReactNode } from "react";

export type PaymentPlatform = "web" | "ios" | "android";

export interface ProductSku {
  /** Internal product key — matches the server-side products catalog. */
  productKey: string;
  /** Stripe price id for the web surface; null when web-only=false-and-not-yet-published. */
  stripePriceId: string | null;
  /** App Store / Play Store product id; null for web-only SKUs. */
  iosProductId: string | null;
  androidProductId: string | null;
  /** Display copy. */
  title: string;
  description: string;
  /** Cents (USD) for sort ordering / tier comparison. The actual
   *  charged price comes from the platform at purchase time. */
  priceCents: number;
}

export interface PurchaseResult {
  ok: boolean;
  /** Server-acknowledged purchase / order id, after receipt validation. */
  orderId?: string;
  /** Operator-actionable error code when ok=false. */
  code?: "user_cancelled" | "platform_unavailable" | "receipt_invalid" | "network" | "unknown";
  message?: string;
}

/**
 * Detect the active payment platform. Web (default) is the fallback
 * when Capacitor isn't present or running on a non-native platform.
 */
export function detectPlatform(): PaymentPlatform {
  // Lazy-import to keep web bundles free of the Capacitor runtime
  // when it's not needed. The dynamic check avoids a hard dependency
  // on the native runtime in browser builds.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cap = (globalThis as any).Capacitor as
    | { isNativePlatform?: () => boolean; getPlatform?: () => string }
    | undefined;
  if (!cap?.isNativePlatform?.()) return "web";
  const p = cap.getPlatform?.();
  if (p === "ios") return "ios";
  if (p === "android") return "android";
  return "web";
}

/**
 * Purchase a product. Branches on detectPlatform():
 *
 *   web    → calls back into the existing tRPC `store.createCheckout`
 *            mutation (the caller wires this in via `webOpenCheckout`),
 *            then opens the resulting Stripe URL.
 *
 *   native → calls into RevenueCat's purchase flow, then submits the
 *            receipt to `iapReceipt.verify` for server-side
 *            entitlement grant.
 *
 * The web branch is intentionally caller-driven (we don't want this
 * module to import the entire tRPC client); the native branch
 * contains the platform-specific logic since RevenueCat encapsulates
 * the StoreKit / Play Billing differences.
 */
export interface PurchaseDeps {
  webOpenCheckout: (productKey: string) => Promise<{ checkoutUrl: string }>;
  nativeVerifyReceipt: (input: {
    platform: "ios" | "android";
    productId: string;
    transactionId: string;
    receipt: string;
  }) => Promise<PurchaseResult>;
}

export async function purchaseProduct(
  sku: ProductSku,
  deps: PurchaseDeps,
): Promise<PurchaseResult> {
  const platform = detectPlatform();
  if (platform === "web") {
    if (!sku.stripePriceId) {
      return { ok: false, code: "platform_unavailable", message: "No web SKU for this product." };
    }
    try {
      const { checkoutUrl } = await deps.webOpenCheckout(sku.productKey);
      window.open(checkoutUrl, "_blank");
      return { ok: true, message: "Stripe checkout opened in new tab." };
    } catch (err) {
      return { ok: false, code: "network", message: (err as Error).message };
    }
  }

  // Native — load RevenueCat lazily so web builds don't pull it in.
  const productId = platform === "ios" ? sku.iosProductId : sku.androidProductId;
  if (!productId) {
    return {
      ok: false,
      code: "platform_unavailable",
      message: `No ${platform} SKU mapped for ${sku.productKey}.`,
    };
  }
  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = await (Purchases as any).getProducts({ productIdentifiers: [productId] });
    const product = products?.products?.[0];
    if (!product) {
      return {
        ok: false,
        code: "platform_unavailable",
        message: `Store catalog has no entry for ${productId}.`,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (Purchases as any).purchaseStoreProduct({ product });
    const transactionId =
      result?.transaction?.transactionIdentifier ??
      result?.purchaserInfo?.originalAppUserId ??
      "unknown";
    const receipt =
      result?.transaction?.receipt ?? result?.transaction?.purchaseToken ?? "";
    return await deps.nativeVerifyReceipt({
      platform,
      productId,
      transactionId,
      receipt,
    });
  } catch (err) {
    const e = err as { userCancelled?: boolean; message?: string };
    if (e.userCancelled) {
      return { ok: false, code: "user_cancelled", message: "Cancelled." };
    }
    return { ok: false, code: "unknown", message: e.message ?? String(err) };
  }
}

/** Re-exported for tests + storybook contexts. */
export type { ReactNode };
