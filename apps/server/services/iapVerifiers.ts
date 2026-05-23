/**
 * IAP receipt verification — pluggable backends.
 *
 * The router (`apps/server/routers/iapReceipt.ts:verify`) hands a
 * platform-specific receipt to the dispatcher, which picks the first
 * configured backend in this priority order:
 *
 *   1. RevenueCat  — preferred. Their server already verified the
 *      receipt with Apple/Google before exposing it to us. Enabled
 *      when `REVENUECAT_SECRET_API_KEY` is set.
 *   2. Apple legacy `/verifyReceipt` — used when `platform === "ios"`
 *      and `APPLE_IAP_SHARED_SECRET` is set. Tries production first,
 *      transparently falls back to sandbox on 21007 (the Apple
 *      convention for sandbox receipts).
 *   3. Google Play Developer API — used when `platform === "android"`
 *      and (`GOOGLE_PLAY_ACCESS_TOKEN` + `GOOGLE_PLAY_PACKAGE_NAME`)
 *      are set. The access token can be generated from a service-
 *      account JWT exchange externally (we don't take the
 *      googleapis dependency here — the simpler boundary is "pass
 *      us an access token").
 *
 * Every backend returns the same `VerificationResult` shape so the
 * router can fulfill identically regardless of source.
 *
 * C-03 (audit/README.md) — closes the "direct verifier not
 * implemented" finding without taking a hard dependency on
 * RevenueCat.
 */

import { logger } from "../logger";

export type IapPlatform = "ios" | "android";

export interface VerifyInput {
  userId: number;
  platform: IapPlatform;
  productId: string;
  transactionId: string;
  receipt: string;
}

export type VerificationResult =
  | { ok: true; verifiedBy: "revenuecat" | "apple" | "google"; productId: string }
  | { ok: false; code: "no_backend" | "rejected" | "network" | "config"; message: string };

/* ═══════════════════════════════════════════════════════
   1. REVENUECAT
   ═══════════════════════════════════════════════════════ */

async function verifyViaRevenueCat(
  input: VerifyInput,
  apiKey: string,
): Promise<VerificationResult> {
  let response: Response;
  try {
    response = await fetch("https://api.revenuecat.com/v1/receipts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Platform": input.platform,
      },
      body: JSON.stringify({
        app_user_id: String(input.userId),
        fetch_token: input.receipt,
        product_id: input.productId,
      }),
    });
  } catch (err) {
    return {
      ok: false,
      code: "network",
      message: `RevenueCat network error: ${(err as Error).message}`,
    };
  }
  if (!response.ok) {
    const body = await response.text();
    return {
      ok: false,
      code: "rejected",
      message: `RevenueCat ${response.status}: ${body.slice(0, 256)}`,
    };
  }
  let subscriber:
    | {
        subscriptions?: Record<string, unknown>;
        non_subscriptions?: Record<string, unknown>;
      }
    | undefined;
  try {
    const json = (await response.json()) as { subscriber?: typeof subscriber };
    subscriber = json.subscriber;
  } catch (err) {
    return {
      ok: false,
      code: "rejected",
      message: `RevenueCat returned unparseable body: ${(err as Error).message}`,
    };
  }
  const has = (bag: Record<string, unknown> | undefined): boolean =>
    bag != null && Object.prototype.hasOwnProperty.call(bag, input.productId);
  if (!subscriber || (!has(subscriber.non_subscriptions) && !has(subscriber.subscriptions))) {
    return {
      ok: false,
      code: "rejected",
      message: `Receipt did not contain a purchase of "${input.productId}".`,
    };
  }
  return { ok: true, verifiedBy: "revenuecat", productId: input.productId };
}

/* ═══════════════════════════════════════════════════════
   2. APPLE — legacy /verifyReceipt
   App Store Connect → "App Store Shared Secret" → APPLE_IAP_SHARED_SECRET
   Apple has marked /verifyReceipt deprecated in favor of the App Store
   Server API (JWT-signed), but it still ships and is the lowest-
   integration path. If we move to the Server API later, swap the
   implementation here and keep the verifier interface stable.
   ═══════════════════════════════════════════════════════ */

interface AppleResponse {
  status: number;
  receipt?: {
    bundle_id?: string;
    in_app?: ReadonlyArray<{
      product_id?: string;
      transaction_id?: string;
      original_transaction_id?: string;
    }>;
  };
  /** Latest receipt info (subscription renewals). */
  latest_receipt_info?: ReadonlyArray<{
    product_id?: string;
    transaction_id?: string;
  }>;
}

async function postApple(
  url: string,
  body: { "receipt-data": string; password: string; "exclude-old-transactions": boolean },
): Promise<AppleResponse | { ok: false; message: string }> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, message: `Apple network error: ${(err as Error).message}` };
  }
  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      message: `Apple HTTP ${response.status}: ${text.slice(0, 256)}`,
    };
  }
  try {
    return (await response.json()) as AppleResponse;
  } catch (err) {
    return { ok: false, message: `Apple JSON parse: ${(err as Error).message}` };
  }
}

async function verifyViaApple(
  input: VerifyInput,
  sharedSecret: string,
): Promise<VerificationResult> {
  const body = {
    "receipt-data": input.receipt,
    password: sharedSecret,
    "exclude-old-transactions": true,
  } as const;

  // Production endpoint first; on 21007 (sandbox-receipt-in-prod) retry sandbox.
  let resp = await postApple("https://buy.itunes.apple.com/verifyReceipt", body);
  if ("ok" in resp && resp.ok === false) {
    return { ok: false, code: "network", message: resp.message };
  }
  let payload = resp as AppleResponse;
  if (payload.status === 21007) {
    resp = await postApple("https://sandbox.itunes.apple.com/verifyReceipt", body);
    if ("ok" in resp && resp.ok === false) {
      return { ok: false, code: "network", message: resp.message };
    }
    payload = resp as AppleResponse;
  }
  if (payload.status !== 0) {
    return {
      ok: false,
      code: "rejected",
      message: `Apple verifyReceipt status=${payload.status}.`,
    };
  }

  const lines: ReadonlyArray<{ product_id?: string; transaction_id?: string }> = [
    ...(payload.receipt?.in_app ?? []),
    ...(payload.latest_receipt_info ?? []),
  ];
  const match = lines.some(
    (l) =>
      l.product_id === input.productId &&
      (l.transaction_id === input.transactionId ||
        // Apple sometimes returns only the original transaction id on
        // restore flows; accept either side.
        (l as { original_transaction_id?: string }).original_transaction_id ===
          input.transactionId),
  );
  if (!match) {
    return {
      ok: false,
      code: "rejected",
      message: `Apple receipt did not contain a transaction for product=${input.productId}.`,
    };
  }
  return { ok: true, verifiedBy: "apple", productId: input.productId };
}

/* ═══════════════════════════════════════════════════════
   3. GOOGLE PLAY — Developer API (products.purchases.get)
   GOOGLE_PLAY_ACCESS_TOKEN: OAuth2 access token, scope
     https://www.googleapis.com/auth/androidpublisher. Generate
     externally from a service-account JWT exchange.
   GOOGLE_PLAY_PACKAGE_NAME: e.g. ink.dgrslabs.dischordiansaga
   The receipt the client passes is the purchaseToken from the
   Play Billing Library.
   ═══════════════════════════════════════════════════════ */

interface GoogleResponse {
  kind?: string;
  purchaseTimeMillis?: string;
  purchaseState?: number; // 0 = purchased, 1 = canceled, 2 = pending
  consumptionState?: number;
  orderId?: string;
  productId?: string;
}

async function verifyViaGoogle(
  input: VerifyInput,
  accessToken: string,
  packageName: string,
): Promise<VerificationResult> {
  const url = new URL(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(input.productId)}/tokens/${encodeURIComponent(input.receipt)}`,
  );
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    return {
      ok: false,
      code: "network",
      message: `Google network error: ${(err as Error).message}`,
    };
  }
  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      code: "rejected",
      message: `Google HTTP ${response.status}: ${text.slice(0, 256)}`,
    };
  }
  let payload: GoogleResponse;
  try {
    payload = (await response.json()) as GoogleResponse;
  } catch (err) {
    return {
      ok: false,
      code: "rejected",
      message: `Google JSON parse: ${(err as Error).message}`,
    };
  }
  if (payload.purchaseState !== 0) {
    return {
      ok: false,
      code: "rejected",
      message: `Google purchaseState=${payload.purchaseState} (0 = purchased).`,
    };
  }
  // Cross-check orderId when present (Google returns it for non-subscription products).
  if (payload.orderId && payload.orderId !== input.transactionId) {
    logger.warn("[iapVerifiers] Google orderId mismatch", {
      expected: input.transactionId,
      got: payload.orderId,
    });
  }
  return { ok: true, verifiedBy: "google", productId: input.productId };
}

/* ═══════════════════════════════════════════════════════
   DISPATCHER
   ═══════════════════════════════════════════════════════ */

export interface VerifierConfig {
  revenueCatApiKey?: string;
  appleSharedSecret?: string;
  googleAccessToken?: string;
  googlePackageName?: string;
}

/** Read config from env. Exported for tests that inject. */
export function readVerifierConfig(): VerifierConfig {
  return {
    revenueCatApiKey: process.env.REVENUECAT_SECRET_API_KEY,
    appleSharedSecret: process.env.APPLE_IAP_SHARED_SECRET,
    googleAccessToken: process.env.GOOGLE_PLAY_ACCESS_TOKEN,
    googlePackageName: process.env.GOOGLE_PLAY_PACKAGE_NAME,
  };
}

/**
 * Dispatch verification to the first configured backend that applies
 * to the platform. Returns `{ok:false, code:"no_backend"}` when no
 * backend is configured — the router maps that to a clear error.
 */
export async function verifyIapReceipt(
  input: VerifyInput,
  config: VerifierConfig = readVerifierConfig(),
): Promise<VerificationResult> {
  if (config.revenueCatApiKey) {
    return verifyViaRevenueCat(input, config.revenueCatApiKey);
  }
  if (input.platform === "ios" && config.appleSharedSecret) {
    return verifyViaApple(input, config.appleSharedSecret);
  }
  if (
    input.platform === "android" &&
    config.googleAccessToken &&
    config.googlePackageName
  ) {
    return verifyViaGoogle(input, config.googleAccessToken, config.googlePackageName);
  }
  if (input.platform === "android" && config.googleAccessToken && !config.googlePackageName) {
    return {
      ok: false,
      code: "config",
      message:
        "GOOGLE_PLAY_PACKAGE_NAME is required alongside GOOGLE_PLAY_ACCESS_TOKEN.",
    };
  }
  return {
    ok: false,
    code: "no_backend",
    message:
      "No IAP verification backend configured. Set REVENUECAT_SECRET_API_KEY, " +
      "or APPLE_IAP_SHARED_SECRET (ios), or GOOGLE_PLAY_ACCESS_TOKEN + " +
      "GOOGLE_PLAY_PACKAGE_NAME (android).",
  };
}
