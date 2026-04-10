import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   Promo Code Redemption — Concurrency + Idempotency
   ───────────────────────────────────────────────────────
   The previous redeemCode flow read promo_code_redemptions,
   checked there was no existing row, and then inserted —
   three statements across zero transactions. Two parallel
   requests from the same user could both pass the existence
   check before either insert landed, so the same code got
   redeemed twice and the maxRedemptions cap could overflow.

   Fix:
     • uq_promo_code_redemptions_code_user unique index
       (drizzle/0036_promo_code_redemption_unique.sql + schema)
     • db.transaction + SELECT ... FOR UPDATE on promo_codes
     • duplicate-key error surfaces a clean BAD_REQUEST

   These tests are static-source assertions so they can run
   in CI without a live database, matching the task6-security
   pattern already used for the Stripe webhook idempotency fix.
   ═══════════════════════════════════════════════════════ */

const schemaSrc = fs.readFileSync(
  path.resolve(__dirname, "../drizzle/schema.ts"),
  "utf-8",
);
const migrationSrc = fs.readFileSync(
  path.resolve(__dirname, "../drizzle/0036_promo_code_redemption_unique.sql"),
  "utf-8",
);
const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/promoCodes.ts"),
  "utf-8",
);
const dbSrc = fs.readFileSync(
  path.resolve(__dirname, "db.ts"),
  "utf-8",
);

describe("promo_code_redemptions — unique index", () => {
  it("schema declares a composite unique index on (promoCodeId, userId)", () => {
    expect(schemaSrc).toContain("uq_promo_code_redemptions_code_user");
    expect(schemaSrc).toMatch(
      /uniqueIndex\("uq_promo_code_redemptions_code_user"\)\.on\(\s*table\.promoCodeId,\s*table\.userId,?\s*\)/s,
    );
  });

  it("migration creates the unique index", () => {
    expect(migrationSrc).toContain("CREATE UNIQUE INDEX");
    expect(migrationSrc).toContain("uq_promo_code_redemptions_code_user");
    expect(migrationSrc).toContain("promo_code_redemptions");
    expect(migrationSrc).toContain("promoCodeId");
    expect(migrationSrc).toContain("userId");
  });

  it("migration includes a pre-run duplicate-check SQL in comments", () => {
    expect(migrationSrc).toMatch(/SELECT\s+promoCodeId/i);
    expect(migrationSrc).toMatch(/HAVING\s+c\s*>\s*1/i);
  });
});

describe("promoCodes.redeemCode — transaction + row lock", () => {
  it("runs the redemption inside db.transaction", () => {
    expect(routerSrc).toMatch(/redeemCode:\s*protectedProcedure[\s\S]*?db\.transaction\(/);
  });

  it("locks the promo row with SELECT ... FOR UPDATE", () => {
    expect(routerSrc).toMatch(/FOR UPDATE/);
    expect(routerSrc).toMatch(/tx\.execute\(/);
  });

  it("handles duplicate-key errors via isDuplicateKeyError", () => {
    expect(routerSrc).toContain("isDuplicateKeyError");
    expect(routerSrc).toMatch(
      /if \(isDuplicateKeyError\(err\)\)[\s\S]*?You have already redeemed this code/,
    );
  });

  it("still validates active / expiry / cap before inserting", () => {
    expect(routerSrc).toMatch(/isActive/);
    expect(routerSrc).toMatch(/expiresAt/);
    expect(routerSrc).toMatch(/maxRedemptions/);
  });
});

describe("isDuplicateKeyError helper", () => {
  it("is exported from server/db.ts", () => {
    expect(dbSrc).toContain("export function isDuplicateKeyError");
  });

  it("detects the mysql2 ER_DUP_ENTRY code", () => {
    expect(dbSrc).toContain("ER_DUP_ENTRY");
    expect(dbSrc).toContain("1062");
  });

  it("unwraps nested causes so drizzle-wrapped errors still match", () => {
    expect(dbSrc).toMatch(/cause[\s\S]*isDuplicateKeyError\(e\.cause\)/);
  });
});
