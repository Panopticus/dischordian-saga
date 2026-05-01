/**
 * Wiring tests for serverAnalytics + the metadata pass-through on
 * pvpRatingsService.applyMatchResult.
 *
 * No DB is available in the test environment — recordServerEvent is
 * expected to no-op gracefully and applyMatchResult is expected to
 * return null rather than throw. The point of these tests is to lock
 * the contract: telemetry can never crash the rating write path.
 */
import { describe, it, expect } from "vitest";
import { recordServerEvent } from "./serverAnalytics";
import { applyMatchResult } from "./pvpRatingsService";

describe("serverAnalytics — recordServerEvent", () => {
  it("returns void without throwing when DB is unavailable", async () => {
    await expect(
      recordServerEvent(42, "match_completed", { gameType: "duelyst", result: "win" }),
    ).resolves.toBeUndefined();
  });

  it("accepts an empty properties object", async () => {
    await expect(
      recordServerEvent(99, "test_event"),
    ).resolves.toBeUndefined();
  });

  it("accepts mixed primitive property values", async () => {
    await expect(
      recordServerEvent(1, "match_completed", {
        gameType: "duelyst",
        result: "win",
        mmrDelta: 25,
        ranked: true,
      }),
    ).resolves.toBeUndefined();
  });
});

describe("pvpRatingsService — applyMatchResult metadata wiring", () => {
  it("accepts metadata without throwing in the no-DB path", async () => {
    const result = await applyMatchResult({
      winnerId: 100,
      loserId: 200,
      gameType: "duelyst",
      metadata: {
        winnerGeneralId: "gen_architect",
        loserGeneralId: "gen_dreamer",
        durationMs: 425000,
        turnCount: 14,
        mode: "ranked",
      },
    });
    expect(result).toBeNull();
  });

  it("accepts an empty metadata object", async () => {
    const result = await applyMatchResult({
      winnerId: 1,
      loserId: 2,
      gameType: "duelyst",
      metadata: {},
    });
    expect(result).toBeNull();
  });

  it("still degrades correctly when metadata is omitted (back-compat)", async () => {
    const result = await applyMatchResult({
      winnerId: 5,
      loserId: 6,
      gameType: "duelyst",
    });
    expect(result).toBeNull();
  });
});
