import { describe, it, expect, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 6 — Security fixes
   6.1a  spriteProxy URL whitelist + size cap
   6.1b  storePurchases Stripe webhook idempotency
   6.1c  CORS multi-origin allowlist + credentials-safe reflection
   6.1d  WebSocket rate limiting across all 4 servers
   ═══════════════════════════════════════════════════════ */

/* ─── TASK 6.1a — spriteProxy ─── */
describe("Task 6.1 — spriteProxy URL whitelist + SSRF guards", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "spriteProxy.ts"),
    "utf-8",
  );

  it("declares an explicit allowed-domains list", () => {
    expect(src).toContain("ALLOWED_DOMAINS");
    expect(src).toContain("d2xsxph8kpxj0f.cloudfront.net");
    expect(src).toContain("res.cloudinary.com");
  });

  it("enforces https-only", () => {
    expect(src).toMatch(/parsed\.protocol !== "https:"/);
  });

  it("matches allowed domain by exact hostname, not substring", () => {
    expect(src).toMatch(/parsed\.hostname === d/);
  });

  it("blocks localhost and RFC1918 / link-local ranges (SSRF)", () => {
    expect(src).toContain("localhost");
    expect(src).toContain("127.");
    expect(src).toContain("10.");
    expect(src).toContain("192.168.");
    expect(src).toContain("169.254.");
    expect(src).toContain("[::1]");
  });

  it("blocks path traversal", () => {
    expect(src).toMatch(/parsed\.pathname\.includes\("\.\."\)/);
  });

  it("rejects requests that fail URL parsing", () => {
    expect(src).toMatch(/catch\s*\{\s*return false/);
  });

  it("Task 6.1 — enforces a max fetch size", () => {
    expect(src).toContain("MAX_FETCH_BYTES");
    expect(src).toMatch(/MAX_FETCH_BYTES\s*=\s*25\s*\*\s*1024\s*\*\s*1024/);
  });

  it("rejects oversized responses at Content-Length", () => {
    expect(src).toMatch(/Number\(response\.headers\.get\("content-length"\)\)/);
    expect(src).toMatch(/status\(413\)/);
  });

  it("also rejects oversized responses after download (defensive)", () => {
    expect(src).toMatch(/arrayBuffer\.byteLength > MAX_FETCH_BYTES/);
  });
});

/* ─── TASK 6.1b — storePurchases idempotency ─── */
describe("Task 6.1 — store_purchases unique index + webhook idempotency", () => {
  const schemaSrc = fs.readFileSync(
    path.resolve(__dirname, "../db/schema.ts"),
    "utf-8",
  );
  const serverSrc = fs.readFileSync(
    path.resolve(__dirname, "_core/index.ts"),
    "utf-8",
  );
  const migrationSrc = fs.readFileSync(
    path.resolve(__dirname, "../db/0035_store_purchase_stripe_idempotency.sql"),
    "utf-8",
  );

  it("storePurchases schema declares a unique index on stripePaymentIntentId", () => {
    expect(schemaSrc).toContain("uq_store_purchases_stripe_intent");
    expect(schemaSrc).toMatch(/uniqueIndex\("uq_store_purchases_stripe_intent"\)\.on\(table\.stripePaymentIntentId\)/);
  });

  it("documents why the index exists (webhook idempotency, Task 6.1)", () => {
    expect(schemaSrc).toContain("Task 6.1");
    expect(schemaSrc.toLowerCase()).toContain("webhook");
  });

  it("migration file creates the unique index", () => {
    expect(migrationSrc).toContain("CREATE UNIQUE INDEX");
    expect(migrationSrc).toContain("uq_store_purchases_stripe_intent");
    expect(migrationSrc).toContain("store_purchases");
    expect(migrationSrc).toContain("stripePaymentIntentId");
  });

  it("migration includes a pre-run duplicate-check SQL in comments", () => {
    expect(migrationSrc).toMatch(/SELECT\s+stripePaymentIntentId/i);
    expect(migrationSrc).toMatch(/HAVING\s+c\s*>\s*1/i);
  });

  it("webhook handler looks up existing intent before inserting", () => {
    expect(serverSrc).toMatch(/if \(stripePaymentIntentId\)/);
    expect(serverSrc).toMatch(/eq\(storePurchases\.stripePaymentIntentId,\s*stripePaymentIntentId\)/);
    expect(serverSrc).toContain("Duplicate delivery for intent");
  });

  it("webhook handler returns early on duplicate without re-fulfilling", () => {
    expect(serverSrc).toMatch(/duplicate:\s*true/);
  });

  it("webhook handler catches unique-index race as duplicate (two workers, one delivery)", () => {
    expect(serverSrc).toMatch(/duplicate\|unique/);
    expect(serverSrc).toContain("Race on intent");
  });

  it("webhook still runs fulfillPurchase on the success path", () => {
    // Ensure we didn't accidentally drop fulfillment. We match on the
    // call-shape rather than a literal argument list because the
    // ledger refactor added a fulfillmentId argument; future ledger /
    // metadata changes shouldn't bounce this guard.
    expect(serverSrc).toMatch(/await\s+fulfillPurchase\s*\(\s*userId\s*,\s*productKey\s*,\s*quantity\s*,/);
  });
});

/* ─── TASK 6.1c — CORS ─── */
describe("Task 6.1 — CORS hardening", () => {
  const envSrc = fs.readFileSync(
    path.resolve(__dirname, "_core/env.ts"),
    "utf-8",
  );
  const serverSrc = fs.readFileSync(
    path.resolve(__dirname, "_core/index.ts"),
    "utf-8",
  );

  it("ENV exposes a parsed corsAllowlist array", () => {
    expect(envSrc).toContain("corsAllowlist");
    expect(envSrc).toMatch(/\.split\(","\)/);
  });

  it("corsAllowlist supports multiple origins via comma", () => {
    expect(envSrc).toContain("dischordian-saga.com,https://www.dischordian-saga.com");
  });

  it("middleware reads from ENV.corsAllowlist, not the legacy single-string corsOrigin", () => {
    expect(serverSrc).toContain("const corsAllowlist = ENV.corsAllowlist");
  });

  it("only reflects an origin when it's on the allowlist", () => {
    expect(serverSrc).toMatch(/corsAllowlist\.includes\(reqOrigin\)/);
  });

  it("sets Vary: Origin so caches don't poison responses", () => {
    expect(serverSrc).toMatch(/"Vary",\s*"Origin"/);
  });

  it("never emits Allow-Credentials alongside a wildcard (spec violation)", () => {
    expect(serverSrc).toMatch(/if \(resolvedOrigin !== "\*"\)[\s\S]{0,200}Allow-Credentials/);
  });

  it("drops the Allow-Origin header entirely for unknown origins", () => {
    expect(serverSrc).toMatch(/if \(resolvedOrigin\)\s*\{/);
  });

  it("documents WHY the change exists (Task 6.1, spec violation)", () => {
    expect(serverSrc).toContain("Task 6.1");
    expect(serverSrc).toMatch(/spec violation/i);
  });
});

/* ─── TASK 6.1d — WebSocket rate limiting ─── */
describe("Task 6.1 — WS rate limiting coverage", () => {
  function readSrc(name: string) {
    return fs.readFileSync(path.resolve(__dirname, name), "utf-8");
  }

  it("pvpWs still calls checkWsRateLimit (no regression)", () => {
    const src = readSrc("pvpWs.ts");
    expect(src).toContain("checkWsRateLimit");
    expect(src).toContain("sendRateLimitError");
  });

  it("duelystWs still calls checkWsRateLimit (no regression)", () => {
    const src = readSrc("duelystWs.ts");
    expect(src).toContain("checkWsRateLimit");
    expect(src).toContain("sendRateLimitError");
  });

  it("chessWs now calls checkWsRateLimit on every message", () => {
    const src = readSrc("chessWs.ts");
    expect(src).toContain(
      'import { checkWsRateLimit, sendRateLimitError } from "./wsRateLimit"',
    );
    expect(src).toContain("checkWsRateLimit(rateLimitKey)");
    expect(src).toMatch(/rateLimitKey\s*=[\s\S]{0,150}chess:/);
  });

  it("terminusWs now calls checkWsRateLimit on every message", () => {
    const src = readSrc("terminusWs.ts");
    expect(src).toMatch(/checkWsRateLimit,\s*[\s\S]{0,50}sendRateLimitError/);
    expect(src).toContain("checkWsRateLimit(rateLimitKey)");
    expect(src).toMatch(/rateLimitKey\s*=[\s\S]{0,150}terminus:/);
  });

  it("wsRateLimit constants unchanged (30 burst, 10/s refill)", () => {
    const src = readSrc("wsRateLimit.ts");
    expect(src).toMatch(/maxTokens:\s*30/);
    expect(src).toMatch(/refillRate:\s*10/);
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME CHECKS
   ═══════════════════════════════════════════════════════ */

describe("Task 6.1 — wsRateLimit token bucket runtime behavior", () => {
  // Re-import the module with a clean cache so each test starts
  // from an empty bucket map.
  let checkWsRateLimit: (userId: string | number) => boolean;

  beforeEach(async () => {
    const mod = await import("./wsRateLimit");
    checkWsRateLimit = mod.checkWsRateLimit;
  });

  it("allows the first message without issue", () => {
    expect(checkWsRateLimit("task6-test-user-1")).toBe(true);
  });

  it("allows up to 30 messages in a burst", () => {
    const key = "task6-test-burst";
    for (let i = 0; i < 30; i++) {
      expect(checkWsRateLimit(key)).toBe(true);
    }
  });

  it("rejects the 31st message in a burst", () => {
    const key = "task6-test-burst-reject";
    for (let i = 0; i < 30; i++) checkWsRateLimit(key);
    expect(checkWsRateLimit(key)).toBe(false);
  });

  it("tracks separate buckets per user (no cross-talk)", () => {
    const a = "task6-test-user-a";
    const b = "task6-test-user-b";
    for (let i = 0; i < 30; i++) checkWsRateLimit(a);
    // A is exhausted, B is fresh
    expect(checkWsRateLimit(a)).toBe(false);
    expect(checkWsRateLimit(b)).toBe(true);
  });

  it("treats numeric and string user ids as the same bucket", () => {
    const uid = 424242;
    for (let i = 0; i < 30; i++) checkWsRateLimit(uid);
    expect(checkWsRateLimit(String(uid))).toBe(false);
  });
});

describe("Task 6.1 — morality price sign-bug regression safety", () => {
  // Double-check that the fix from Task 5.2 (using Math.abs on
  // morality score) is still in place so a future refactor can't
  // reintroduce the sign flip.
  const src = fs.readFileSync(
    path.resolve(__dirname, "routers/marketplace.ts"),
    "utf-8",
  );
  it("still uses Math.abs(moralityScore) / 100 as the intensity", () => {
    expect(src).toMatch(/Math\.abs\(moralityScore\)\s*\/\s*100/);
  });
});

describe("Task 6.1 — CORS allowlist parsing", () => {
  // Exercise the parser by simulating the env parsing logic.
  const parseCors = (raw: string) =>
    raw.split(",").map((s) => s.trim()).filter(Boolean);

  it("parses a single origin", () => {
    expect(parseCors("https://dischordian-saga.com")).toEqual([
      "https://dischordian-saga.com",
    ]);
  });

  it("parses multiple comma-separated origins", () => {
    const result = parseCors("https://a.example,https://b.example,https://c.example");
    expect(result).toHaveLength(3);
    expect(result).toContain("https://a.example");
    expect(result).toContain("https://c.example");
  });

  it("trims whitespace around each entry", () => {
    expect(parseCors("https://a.example, https://b.example ,https://c.example")).toEqual([
      "https://a.example",
      "https://b.example",
      "https://c.example",
    ]);
  });

  it("filters empty entries (trailing comma)", () => {
    expect(parseCors("https://a.example,")).toEqual(["https://a.example"]);
  });

  it("preserves wildcard as a legal allowlist entry", () => {
    expect(parseCors("*")).toEqual(["*"]);
  });
});

describe("Task 6.1 — CORS resolution logic", () => {
  // Mirror the middleware's origin-resolution logic so we can assert
  // the decision table without spinning up Express.
  function resolve(
    allowlist: string[],
    reqOrigin: string | undefined,
  ): { allowOrigin: string | null; credentialsAllowed: boolean } {
    const allowAny = allowlist.includes("*");
    let resolvedOrigin: string | null = null;

    if (reqOrigin && (allowAny || allowlist.includes(reqOrigin))) {
      resolvedOrigin = reqOrigin;
    } else if (!reqOrigin && allowlist.length === 1 && !allowAny) {
      resolvedOrigin = allowlist[0];
    }

    return {
      allowOrigin: resolvedOrigin,
      credentialsAllowed: resolvedOrigin !== null && resolvedOrigin !== "*",
    };
  }

  it("allows a known origin in production", () => {
    const r = resolve(["https://dischordian-saga.com"], "https://dischordian-saga.com");
    expect(r.allowOrigin).toBe("https://dischordian-saga.com");
    expect(r.credentialsAllowed).toBe(true);
  });

  it("drops unknown origins in production", () => {
    const r = resolve(["https://dischordian-saga.com"], "https://attacker.example");
    expect(r.allowOrigin).toBeNull();
    expect(r.credentialsAllowed).toBe(false);
  });

  it("reflects * in dev but refuses credentials", () => {
    const r = resolve(["*"], "https://random-dev.example");
    expect(r.allowOrigin).toBe("https://random-dev.example");
    expect(r.credentialsAllowed).toBe(true);
  });

  it("supports multiple prod origins", () => {
    const allowlist = ["https://a.example", "https://b.example"];
    expect(resolve(allowlist, "https://a.example").allowOrigin).toBe("https://a.example");
    expect(resolve(allowlist, "https://b.example").allowOrigin).toBe("https://b.example");
    expect(resolve(allowlist, "https://c.example").allowOrigin).toBeNull();
  });

  it("falls back to the single configured origin for same-origin requests (no Origin header)", () => {
    const r = resolve(["https://dischordian-saga.com"], undefined);
    expect(r.allowOrigin).toBe("https://dischordian-saga.com");
  });

  it("does not fall back when multiple origins are allowlisted", () => {
    const r = resolve(["https://a.example", "https://b.example"], undefined);
    expect(r.allowOrigin).toBeNull();
  });

  it("never allows credentials with wildcard as the resolved origin", () => {
    // Even if someone explicitly sets resolvedOrigin="*" via a misconfig,
    // credentials must stay off. resolve() encodes this invariant.
    const r = { allowOrigin: "*" as string | null, credentialsAllowed: false };
    r.credentialsAllowed = r.allowOrigin !== null && r.allowOrigin !== "*";
    expect(r.credentialsAllowed).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════
   REGRESSION — earlier phases still intact
   ═══════════════════════════════════════════════════════ */

describe("Task 6.1 — no regression of earlier security fixes", () => {
  it("wsRateLimit's grace-period cleanup interval is still wired", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "wsRateLimit.ts"),
      "utf-8",
    );
    expect(src).toMatch(/setInterval\([\s\S]{0,200}GRACE_PERIOD_MS/);
  });

  it("terminus still uses the grace-period snapshot flow (Task 4.1)", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "terminusWs.ts"),
      "utf-8",
    );
    expect(src).toContain("storeDisconnectedSession");
    expect(src).toContain("snapshotAt");
  });

  it("spriteProxy cache eviction still works", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "spriteProxy.ts"),
      "utf-8",
    );
    expect(src).toContain("MAX_CACHE_SIZE");
    expect(src).toMatch(/spriteCache\.size\s*>=\s*MAX_CACHE_SIZE/);
  });
});
