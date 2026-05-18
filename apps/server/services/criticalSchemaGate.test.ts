import { describe, it, expect } from "vitest";
import {
  CRITICAL_PROBES,
  ensureCriticalSchemaOrExit,
} from "./criticalSchemaGate";

describe("critical schema gate (Persistence F5/F6)", () => {
  it("covers the audit-named query-critical schema shapes", () => {
    const keys = CRITICAL_PROBES.map(
      (p) => `${p.table}${p.column ? "." + p.column : ""}`,
    );
    // The two the audit explicitly named as boot-window 500s:
    expect(keys).toContain("citizen_characters.foundation");
    expect(keys).toContain("processed_webhook_events");
    // Plus the ledger column this work introduced:
    expect(keys).toContain("battle_pass_progress.dailyXpLedger");
    // every probe carries a non-empty rationale
    for (const p of CRITICAL_PROBES) expect(p.why.trim().length).toBeGreaterThan(0);
  });

  it("is a safe no-op under NODE_ENV=test (never exits the test runner)", async () => {
    expect(process.env.NODE_ENV).toBe("test");
    // Must resolve without throwing and without calling process.exit
    // (a regression here would kill the whole vitest process).
    await expect(ensureCriticalSchemaOrExit()).resolves.toBeUndefined();
  });
});
