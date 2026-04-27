/**
 * PVP ranking wiring guard (#7).
 *
 * Behavioural tests on the pure ELO math live in
 * apps/shared/pvpElo.test.ts. This file covers the wiring around
 * the DB-bound service:
 *
 *   - Schema declares the pvp_ratings table with the canonical
 *     unique key + leaderboard index.
 *   - Migration 0058 + bootstrap create the same shape.
 *   - Bootstrap is wired into _core/index.ts startup.
 *   - db-fresh-smoke covers the table.
 *   - tRPC router exposes myRank (auth) + leaderboard (public)
 *     and DOES NOT expose write paths (forgeable from the
 *     client; the producer wiring lands in a follow-up).
 *   - Service no-DB safety: getRating / getLeaderboard /
 *     applyMatchResult all return null/[] without throwing in
 *     the no-database test environment.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  getRating,
  getLeaderboard,
  applyMatchResult,
} from "./services/pvpRatingsService";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("pvpRatingsService — no-DB safety", () => {
  it("getRating returns null without throwing when DB is unavailable", async () => {
    const result = await getRating(42, "duelyst");
    expect(result).toBeNull();
  });

  it("getLeaderboard returns [] without throwing when DB is unavailable", async () => {
    const result = await getLeaderboard("duelyst", 10);
    expect(result).toEqual([]);
  });

  it("applyMatchResult returns null without throwing when DB is unavailable", async () => {
    const result = await applyMatchResult({
      winnerId: 1,
      loserId: 2,
      gameType: "duelyst",
    });
    expect(result).toBeNull();
  });

  it("applyMatchResult guards against winnerId === loserId (degenerate input)", async () => {
    const result = await applyMatchResult({
      winnerId: 7,
      loserId: 7,
      gameType: "duelyst",
    });
    expect(result).toBeNull();
  });
});

describe("pvp_ratings — schema + migration + bootstrap wiring", () => {
  it("schema declares the pvp_ratings table with the unique (userId, gameType)", () => {
    const src = read("apps/db/schema.ts");
    expect(src).toMatch(
      /export const pvpRatings = mysqlTable\(\s*"pvp_ratings"/,
    );
    expect(src).toMatch(
      /uniqueIndex\(\s*"uq_pvp_ratings_user_game"\s*\)\.on\(\s*table\.userId,\s*table\.gameType/,
    );
  });

  it("schema includes the leaderboard index (gameType, mmr DESC)", () => {
    const src = read("apps/db/schema.ts");
    expect(src).toMatch(
      /index\(\s*"idx_pvp_ratings_leaderboard"\s*\)\.on\(\s*table\.gameType,\s*table\.mmr/,
    );
  });

  it("migration 0058 creates the table with the canonical defaults", () => {
    const src = read("apps/db/0058_pvp_ratings.sql");
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS\s+`pvp_ratings`/i);
    expect(src).toMatch(/`mmr`\s+INT NOT NULL DEFAULT 1200/i);
    expect(src).toMatch(/`peakMmr`\s+INT NOT NULL DEFAULT 1200/i);
    expect(src).toMatch(/UNIQUE KEY\s+`uq_pvp_ratings_user_game`/i);
  });

  it("bootstrap exports bootstrapPvpRatingsTable + uses idempotent CREATE IF NOT EXISTS", () => {
    const src = read("apps/server/services/pvpRatingsBootstrap.ts");
    expect(src).toMatch(/export function bootstrapPvpRatingsTable/);
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS .*pvp_ratings/);
  });

  it("server _core/index.ts wires the bootstrap into startup", () => {
    const src = read("apps/server/_core/index.ts");
    expect(src).toMatch(/bootstrapPvpRatingsTable/);
    // Must run alongside the other startup bootstraps.
    expect(src).toMatch(
      /bootstrapWebhookEventsTable[\s\S]*bootstrapPvpRatingsTable/,
    );
  });

  it("db-fresh-smoke runs the bootstrap + verifies the table lands", () => {
    const src = read("apps/scripts/db-fresh-smoke.ts");
    expect(src).toMatch(/bootstrapPvpRatingsTable/);
    expect(src).toMatch(/"pvp_ratings"/);
  });
});

describe("pvpRanking router — endpoint surface", () => {
  const SRC = read("apps/server/routers/pvpRanking.ts");

  it("exposes myRank as a protected procedure", () => {
    expect(SRC).toMatch(/myRank:\s*protectedProcedure/);
  });

  it("exposes leaderboard as a public procedure", () => {
    expect(SRC).toMatch(/leaderboard:\s*publicProcedure/);
  });

  it("validates gameType against the canonical enum (duelyst | chess | pvp)", () => {
    expect(SRC).toMatch(
      /z\.enum\(\["duelyst",\s*"chess",\s*"pvp"\]\)/,
    );
  });

  it("does NOT expose any write/mutation procedure (writes are server-internal)", () => {
    // Client-side rating writes are inherently forgeable. The
    // producer (duelystWs.endMatch in a follow-up PR) calls
    // applyMatchResult directly. Guard the boundary.
    expect(SRC).not.toMatch(/\.mutation\(/);
  });

  it("is mounted on the appRouter as `pvpRanking`", () => {
    const src = read("apps/server/routers.ts");
    expect(src).toMatch(/import\s*\{\s*pvpRankingRouter\s*\}/);
    expect(src).toMatch(/pvpRanking:\s*pvpRankingRouter/);
  });
});
