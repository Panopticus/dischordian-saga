/**
 * Tests for the IAP verification dispatcher.
 *
 * Each backend (RevenueCat, Apple, Google) is exercised end-to-end
 * via a mocked global `fetch`. The dispatcher's priority order +
 * config-driven branching is asserted explicitly.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  verifyIapReceipt,
  type VerifierConfig,
  type VerifyInput,
} from "./iapVerifiers";

const baseInput: VerifyInput = {
  userId: 42,
  platform: "ios",
  productId: "com.dischordiansaga.dream_vault",
  transactionId: "tx-1000",
  receipt: "base64-receipt",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fetchSpy: any = null;

function mockFetchOnce(response: Partial<Response> & { jsonValue?: unknown; textValue?: string }) {
  const ok = response.ok ?? true;
  const status = response.status ?? (ok ? 200 : 500);
  const fake = {
    ok,
    status,
    json: async () => response.jsonValue,
    text: async () => response.textValue ?? JSON.stringify(response.jsonValue ?? {}),
  } as unknown as Response;
  fetchSpy.mockResolvedValueOnce(fake);
}

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy?.mockRestore();
  fetchSpy = null;
});

describe("verifyIapReceipt — dispatcher", () => {
  it("returns no_backend when no env is configured", async () => {
    const result = await verifyIapReceipt(baseInput, {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("no_backend");
      expect(result.message).toMatch(/No IAP verification backend/);
    }
  });

  it("returns config when google token is set without package name", async () => {
    const result = await verifyIapReceipt(
      { ...baseInput, platform: "android", receipt: "purchase-token" },
      { googleAccessToken: "tok" },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("config");
      expect(result.message).toMatch(/GOOGLE_PLAY_PACKAGE_NAME/);
    }
  });

  it("prefers RevenueCat when its key is set", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        subscriber: {
          non_subscriptions: {
            "com.dischordiansaga.dream_vault": [{ id: "x" }],
          },
        },
      },
    });
    const cfg: VerifierConfig = {
      revenueCatApiKey: "rk_test",
      appleSharedSecret: "should-not-be-used",
    };
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.verifiedBy).toBe("revenuecat");
    expect(fetchSpy?.mock.calls[0]?.[0]).toBe("https://api.revenuecat.com/v1/receipts");
  });
});

describe("RevenueCat backend", () => {
  it("rejects when product is absent from subscriber", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: { subscriber: { non_subscriptions: {} } },
    });
    const result = await verifyIapReceipt(baseInput, { revenueCatApiKey: "rk" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("rejected");
      expect(result.message).toMatch(/did not contain a purchase/);
    }
  });

  it("accepts subscription bag (recurring product)", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        subscriber: {
          subscriptions: {
            "com.dischordiansaga.dream_vault": { active: true },
          },
        },
      },
    });
    const result = await verifyIapReceipt(baseInput, { revenueCatApiKey: "rk" });
    expect(result.ok).toBe(true);
  });

  it("returns rejected when RevenueCat returns non-2xx", async () => {
    mockFetchOnce({ ok: false, status: 400, textValue: "bad receipt" });
    const result = await verifyIapReceipt(baseInput, { revenueCatApiKey: "rk" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("rejected");
  });

  it("returns network on fetch throw", async () => {
    fetchSpy?.mockRejectedValueOnce(new Error("ECONNRESET"));
    const result = await verifyIapReceipt(baseInput, { revenueCatApiKey: "rk" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("network");
      expect(result.message).toMatch(/ECONNRESET/);
    }
  });
});

describe("Apple backend", () => {
  const cfg: VerifierConfig = { appleSharedSecret: "shared-secret" };

  it("verifies a production receipt that lists the transaction", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        status: 0,
        receipt: {
          in_app: [
            {
              product_id: baseInput.productId,
              transaction_id: baseInput.transactionId,
            },
          ],
        },
      },
    });
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.verifiedBy).toBe("apple");
    expect(fetchSpy?.mock.calls[0]?.[0]).toBe("https://buy.itunes.apple.com/verifyReceipt");
  });

  it("falls back to sandbox on Apple status 21007", async () => {
    mockFetchOnce({ ok: true, jsonValue: { status: 21007 } });
    mockFetchOnce({
      ok: true,
      jsonValue: {
        status: 0,
        receipt: {
          in_app: [
            {
              product_id: baseInput.productId,
              transaction_id: baseInput.transactionId,
            },
          ],
        },
      },
    });
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(true);
    expect(fetchSpy?.mock.calls[1]?.[0]).toBe(
      "https://sandbox.itunes.apple.com/verifyReceipt",
    );
  });

  it("accepts an original_transaction_id match (restore flow)", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        status: 0,
        receipt: {
          in_app: [
            {
              product_id: baseInput.productId,
              transaction_id: "different-id",
              original_transaction_id: baseInput.transactionId,
            },
          ],
        },
      },
    });
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(true);
  });

  it("rejects when Apple status is non-zero (after sandbox fallback)", async () => {
    mockFetchOnce({ ok: true, jsonValue: { status: 21002 } });
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("rejected");
      expect(result.message).toMatch(/status=21002/);
    }
  });

  it("rejects when the receipt has no matching transaction", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        status: 0,
        receipt: {
          in_app: [{ product_id: "wrong.product", transaction_id: "wrong-tx" }],
        },
      },
    });
    const result = await verifyIapReceipt(baseInput, cfg);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/did not contain a transaction/);
    }
  });
});

describe("Google backend", () => {
  const androidInput: VerifyInput = {
    ...baseInput,
    platform: "android",
    productId: "dream_vault",
    receipt: "purchase-token-abc",
    transactionId: "GPA.1234-5678-9012-34567",
  };
  const cfg: VerifierConfig = {
    googleAccessToken: "ya29.access-token",
    googlePackageName: "ink.dgrslabs.dischordiansaga",
  };

  it("verifies a purchased product (purchaseState=0)", async () => {
    mockFetchOnce({
      ok: true,
      jsonValue: {
        purchaseState: 0,
        orderId: androidInput.transactionId,
      },
    });
    const result = await verifyIapReceipt(androidInput, cfg);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.verifiedBy).toBe("google");
    const calledUrl = String(fetchSpy?.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("/androidpublisher/v3/applications/");
    expect(calledUrl).toContain("/purchases/products/");
    expect(calledUrl).toContain("/tokens/purchase-token-abc");
  });

  it("rejects when purchaseState != 0 (canceled / pending)", async () => {
    mockFetchOnce({ ok: true, jsonValue: { purchaseState: 1 } });
    const result = await verifyIapReceipt(androidInput, cfg);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("rejected");
      expect(result.message).toMatch(/purchaseState=1/);
    }
  });

  it("rejects on Google HTTP error", async () => {
    mockFetchOnce({ ok: false, status: 401, textValue: "unauthorized" });
    const result = await verifyIapReceipt(androidInput, cfg);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("rejected");
      expect(result.message).toMatch(/Google HTTP 401/);
    }
  });
});
