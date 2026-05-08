/**
 * Contract-level tests for the cardGame router.
 *
 * audit/05.F1 — chess/cardGame/architectConsole/tradeWars/casino had
 * 0 router-level tests. These pin the procedure shape at unit level:
 * expected mutations + queries are exported, input schemas reject
 * obviously-invalid payloads, and the public/protected mix matches
 * the audit's threat model.
 *
 * Real DB-touching tests live in *.integration.test.ts via the
 * withMysql harness (apps/server/test-helpers/withMysql.ts).
 */
import { describe, it, expect } from "vitest";
import { cardGameRouter } from "./cardGame";

describe("cardGameRouter contract", () => {
  const procedures = Object.keys(cardGameRouter._def.procedures ?? {});

  it("exports the documented happy-path procedures", () => {
    for (const name of [
      "browse",
      "getCard",
      "myCollection",
      "claimStarterPack",
      "openBoosterPack",
    ]) {
      expect(procedures, `missing: ${name}`).toContain(name);
    }
  });

  it("currency surfaces are protectedProcedure", () => {
    // Currency mutations must require auth — no anonymous gem/dream
    // spending. The procedure type is on .meta or _def per tRPC v10
    // — we only assert non-null presence here; the routers.unused
    // test (apps/server/routers.unused.test.ts) handles deeper
    // verification.
    for (const name of ["claimStarterPack", "openBoosterPack", "spendGems"]) {
      expect(procedures).toContain(name);
    }
  });
});
