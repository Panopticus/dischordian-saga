import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  takeRateLimitToken,
  __resetRateLimitBuckets,
} from "./mutationRateLimit";

/* ═══════════════════════════════════════════════════════
   Trust & Safety scaffolding tests
   ───────────────────────────────────────────────────────
   Verifies that the minimum moderation surface is wired
   end-to-end:
     • migration + schema declare user_blocks, user_reports,
       moderator_audit_log
     • socialFeatures.sendMessage is rate-limited and
       friendship-gated, and honors user_blocks
     • moderation router is registered in the app router
     • the in-process token-bucket limiter actually limits
   ═══════════════════════════════════════════════════════ */

const schemaSrc = fs.readFileSync(
  path.resolve(__dirname, "../drizzle/schema.ts"),
  "utf-8",
);
const migrationSrc = fs.readFileSync(
  path.resolve(__dirname, "../drizzle/0037_trust_and_safety.sql"),
  "utf-8",
);
const socialSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/socialFeatures.ts"),
  "utf-8",
);
const moderationSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/moderation.ts"),
  "utf-8",
);
const appRouterSrc = fs.readFileSync(
  path.resolve(__dirname, "routers.ts"),
  "utf-8",
);
const trpcSrc = fs.readFileSync(
  path.resolve(__dirname, "_core/trpc.ts"),
  "utf-8",
);

describe("T&S migration + schema", () => {
  it("migration creates user_blocks, user_reports, moderator_audit_log", () => {
    expect(migrationSrc).toMatch(/CREATE TABLE `user_blocks`/);
    expect(migrationSrc).toMatch(/CREATE TABLE `user_reports`/);
    expect(migrationSrc).toMatch(/CREATE TABLE `moderator_audit_log`/);
  });

  it("user_blocks has a unique (userId, blockedUserId) constraint", () => {
    expect(migrationSrc).toMatch(
      /UNIQUE KEY `uq_user_blocks_user_blocked` \(`userId`, `blockedUserId`\)/,
    );
  });

  it("schema declares the three tables", () => {
    expect(schemaSrc).toContain('mysqlTable("user_blocks"');
    expect(schemaSrc).toContain('mysqlTable("user_reports"');
    expect(schemaSrc).toContain('mysqlTable("moderator_audit_log"');
  });

  it("schema declares the user_blocks unique index", () => {
    expect(schemaSrc).toContain("uq_user_blocks_user_blocked");
  });
});

describe("socialFeatures router — T&S posture", () => {
  it("imports rateLimit + userBlocks", () => {
    expect(socialSrc).toContain("rateLimit");
    expect(socialSrc).toContain("userBlocks");
  });

  it("replaces `throw new Error` with TRPCError", () => {
    // No raw Error throws in the router body (regex across lines).
    expect(socialSrc).not.toMatch(/throw new Error\(/);
    expect(socialSrc).toContain("TRPCError");
  });

  it("rate-limits sendMessage + sendFriendRequest", () => {
    expect(socialSrc).toMatch(/sendMessage[\s\S]*?rateLimit\(\{[\s\S]*?key:\s*"dm\.send"/);
    expect(socialSrc).toMatch(
      /sendFriendRequest[\s\S]*?rateLimit\(\{[\s\S]*?key:\s*"social\.friendRequest"/,
    );
  });

  it("gates sendMessage behind an accepted friendship", () => {
    expect(socialSrc).toMatch(/sendMessage[\s\S]*?friends\.status[\s\S]*?accepted/);
    expect(socialSrc).toContain("You can only message friends");
  });

  it("silently swallows DMs when recipient has blocked sender", () => {
    expect(socialSrc).toMatch(/userBlocks[\s\S]*?delivered:\s*false/);
  });

  it("sendFriendRequest rejects when a block exists in either direction", () => {
    expect(socialSrc).toMatch(
      /sendFriendRequest[\s\S]*?userBlocks[\s\S]*?Unable to send friend request/,
    );
  });
});

describe("moderation router", () => {
  it("exposes block add/remove/list", () => {
    expect(moderationSrc).toContain("blockAdd");
    expect(moderationSrc).toContain("blockRemove");
    expect(moderationSrc).toContain("blockList");
  });

  it("exposes report create/listPending/resolve", () => {
    expect(moderationSrc).toContain("reportCreate");
    expect(moderationSrc).toContain("reportListPending");
    expect(moderationSrc).toContain("reportResolve");
  });

  it("writes to moderator_audit_log on resolve + DM purge", () => {
    expect(moderationSrc).toMatch(/reportResolve[\s\S]*?moderatorAuditLog/);
    expect(moderationSrc).toMatch(
      /purgeDirectMessagesBetween[\s\S]*?moderatorAuditLog/,
    );
  });

  it("rate-limits reportCreate with a per-minute bucket", () => {
    expect(moderationSrc).toMatch(/reportCreate[\s\S]*?refillIntervalMs:\s*60_000/);
  });

  it("self-block + self-report are rejected", () => {
    expect(moderationSrc).toContain("Cannot block yourself");
    expect(moderationSrc).toContain("Cannot report yourself");
  });

  it("block-add treats duplicate as a no-op via isDuplicateKeyError", () => {
    expect(moderationSrc).toContain("isDuplicateKeyError");
    expect(moderationSrc).toMatch(/alreadyBlocked:\s*true/);
  });
});

describe("app router registration", () => {
  it("moderation router is mounted in the appRouter", () => {
    expect(appRouterSrc).toContain('moderation: moderationRouter');
  });
});

describe("rateLimit middleware factory", () => {
  it("is exported from _core/trpc.ts", () => {
    expect(trpcSrc).toContain("export function rateLimit");
    expect(trpcSrc).toContain("TOO_MANY_REQUESTS");
  });
});

describe("takeRateLimitToken bucket semantics", () => {
  it("allows up to maxTokens in a burst then blocks", () => {
    __resetRateLimitBuckets();
    const cfg = { key: "test.burst", maxTokens: 3, refillRate: 1 };
    expect(takeRateLimitToken(cfg, 42)).toBe(true);
    expect(takeRateLimitToken(cfg, 42)).toBe(true);
    expect(takeRateLimitToken(cfg, 42)).toBe(true);
    expect(takeRateLimitToken(cfg, 42)).toBe(false);
  });

  it("isolates buckets per user", () => {
    __resetRateLimitBuckets();
    const cfg = { key: "test.isolation", maxTokens: 1, refillRate: 1 };
    expect(takeRateLimitToken(cfg, 1)).toBe(true);
    expect(takeRateLimitToken(cfg, 2)).toBe(true);
    expect(takeRateLimitToken(cfg, 1)).toBe(false);
    expect(takeRateLimitToken(cfg, 2)).toBe(false);
  });

  it("isolates buckets per config key", () => {
    __resetRateLimitBuckets();
    const a = { key: "test.key.a", maxTokens: 1, refillRate: 1 };
    const b = { key: "test.key.b", maxTokens: 1, refillRate: 1 };
    expect(takeRateLimitToken(a, 1)).toBe(true);
    expect(takeRateLimitToken(b, 1)).toBe(true);
    expect(takeRateLimitToken(a, 1)).toBe(false);
    expect(takeRateLimitToken(b, 1)).toBe(false);
  });
});
