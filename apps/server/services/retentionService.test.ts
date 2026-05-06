import { describe, it, expect } from "vitest";
import {
  ACCOUNT_GRACE_DAYS,
  CHAT_RETENTION_DAYS,
  ANALYTICS_RETENTION_MONTHS,
  runAccountCleanupTick,
  runChatMessagePurgeTick,
  runAnalyticsPurgeTick,
  runRetentionTick,
} from "./retentionService";

/* ═══════════════════════════════════════════════════════
   retentionService.test.ts

   Smoke tests for the retention-policy cron sweeps. The
   DB-touching paths get integration coverage in a later
   pass; here we verify the public surface and the
   no-DB graceful fallback (DATABASE_URL unset → each tick
   returns 0 without throwing).
   ═══════════════════════════════════════════════════════ */

describe("retentionService — retention windows", () => {
  it("matches the policy doc (30d / 90d / 24mo)", () => {
    expect(ACCOUNT_GRACE_DAYS).toBe(30);
    expect(CHAT_RETENTION_DAYS).toBe(90);
    expect(ANALYTICS_RETENTION_MONTHS).toBe(24);
  });
});

describe("retentionService — no-DB fallback", () => {
  // The test environment runs without DATABASE_URL, so getDb()
  // resolves to null. Each sweep must return 0 without throwing.

  it("runAccountCleanupTick returns hardDeleted: 0 when DB is unavailable", async () => {
    const result = await runAccountCleanupTick();
    expect(result).toEqual({ hardDeleted: 0 });
  });

  it("runChatMessagePurgeTick returns pruned: 0 when DB is unavailable", async () => {
    const result = await runChatMessagePurgeTick();
    expect(result).toEqual({ pruned: 0 });
  });

  it("runAnalyticsPurgeTick returns pruned: 0 when DB is unavailable", async () => {
    const result = await runAnalyticsPurgeTick();
    expect(result).toEqual({ pruned: 0 });
  });

  it("runRetentionTick chains all three without throwing", async () => {
    await expect(runRetentionTick()).resolves.toBeUndefined();
  });
});
