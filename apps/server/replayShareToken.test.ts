/**
 * Replay share-token wiring guard (#6 / #46).
 *
 * Two layers of coverage:
 *
 *   1. Unit tests on `generateShareToken` / `isValidShareToken` —
 *      the pure functions in apps/server/services/replayTokens.ts.
 *      Token shape, charset, entropy, and rejector behavior are
 *      validated without any DB or HTTP surface.
 *
 *   2. Static-analysis on the schema, bootstrap, and router source
 *      so the wiring can't silently regress: schema declares the
 *      shareToken column, bootstrap is exported and wired into
 *      `_core/index.ts` startup, the router populates the column on
 *      saveReplay and exposes a `getReplayByToken` public query.
 *
 * Behavioral coverage of the migration / bootstrap idempotency lives
 * in apps/scripts/db-fresh-smoke.ts (CI fresh-DB smoke test).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  generateShareToken,
  isValidShareToken,
} from "./services/replayTokens";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("generateShareToken — shape + entropy", () => {
  it("produces 22 URL-safe base64 chars (16 bytes, no padding)", () => {
    const token = generateShareToken();
    expect(token).toHaveLength(22);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token).not.toContain("=");
  });

  it("never contains the URL-unsafe `+` or `/` from raw base64", () => {
    // 1000 samples → if either slipped through we'd see it.
    for (let i = 0; i < 1000; i++) {
      const token = generateShareToken();
      expect(token).not.toContain("+");
      expect(token).not.toContain("/");
    }
  });

  it("produces 1000 distinct tokens (proxy for entropy / no-collisions)", () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      tokens.add(generateShareToken());
    }
    expect(tokens.size).toBe(1000);
  });

  it("respects an injected getRandomValues for deterministic tests", () => {
    // 16 bytes of 0x00 → "AAAAAAAAAAAAAAAAAAAAAA" (22 'A's).
    const allZero = (buf: Uint8Array) => {
      buf.fill(0);
      return buf;
    };
    expect(generateShareToken(allZero)).toBe("AAAAAAAAAAAAAAAAAAAAAA");

    // 16 bytes of 0xFF → all '/' in raw base64, mapped to '_' in url-safe.
    const allOnes = (buf: Uint8Array) => {
      buf.fill(0xff);
      return buf;
    };
    const token = generateShareToken(allOnes);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token).toHaveLength(22);
  });
});

describe("isValidShareToken — rejector", () => {
  it("accepts well-formed tokens from generateShareToken", () => {
    for (let i = 0; i < 50; i++) {
      expect(isValidShareToken(generateShareToken())).toBe(true);
    }
  });

  it("rejects non-strings", () => {
    expect(isValidShareToken(undefined)).toBe(false);
    expect(isValidShareToken(null)).toBe(false);
    expect(isValidShareToken(123)).toBe(false);
    expect(isValidShareToken({})).toBe(false);
    expect(isValidShareToken([])).toBe(false);
  });

  it("rejects strings outside the URL-safe charset (SQL-injection / path tricks)", () => {
    expect(isValidShareToken("AAAAAAAAAAAAAAAAAAAAA'")).toBe(false);
    expect(isValidShareToken("' OR 1=1 --")).toBe(false);
    expect(isValidShareToken("../etc/passwd")).toBe(false);
    expect(isValidShareToken("AAAA AAAA AAAA AAAA AA")).toBe(false); // spaces
    expect(isValidShareToken("AAAA+AAAA/AAAAAAAAAAA=")).toBe(false); // raw base64
  });

  it("rejects out-of-range lengths", () => {
    expect(isValidShareToken("")).toBe(false);
    expect(isValidShareToken("A")).toBe(false);
    expect(isValidShareToken("A".repeat(19))).toBe(false);
    expect(isValidShareToken("A".repeat(25))).toBe(false);
    expect(isValidShareToken("A".repeat(64))).toBe(false);
  });

  it("accepts edge tokens within the ±2 length window for future migrations", () => {
    // The validator allows 20-24 chars so a future tweak (e.g. 18-byte
    // tokens producing 24 chars) doesn't require this regex change.
    expect(isValidShareToken("A".repeat(20))).toBe(true);
    expect(isValidShareToken("A".repeat(22))).toBe(true);
    expect(isValidShareToken("A".repeat(24))).toBe(true);
  });
});

describe("Replay share-token — schema + bootstrap + router wiring", () => {
  it("schema declares the shareToken column on gameReplays", () => {
    const src = read("apps/db/schema.ts");
    expect(src).toMatch(/shareToken:\s*varchar\(\s*"shareToken"\s*,\s*\{\s*length:\s*32\s*\}\s*\)/);
  });

  it("migration 0056 adds the column with a UNIQUE key", () => {
    const src = read("apps/db/0056_game_replays_share_token.sql");
    expect(src).toMatch(/ALTER TABLE\s+`game_replays`/i);
    expect(src).toMatch(/ADD COLUMN\s+`shareToken`\s+VARCHAR\(32\)/i);
    expect(src).toMatch(/UNIQUE KEY\s+`uq_game_replays_share_token`/i);
  });

  it("bootstrap exports bootstrapReplayShareToken and uses idempotent column probe", () => {
    const src = read("apps/server/services/replaysBootstrap.ts");
    expect(src).toMatch(/export function bootstrapReplayShareToken/);
    expect(src).toMatch(/information_schema\.columns/);
    expect(src).toMatch(/column_name\s*=\s*'shareToken'/);
    // Source uses template-literal escaped backticks (\`shareToken\`)
    // for MySQL identifier quoting — match without anchoring the
    // surrounding backtick chars.
    expect(src).toMatch(/ADD COLUMN\s+[^A-Za-z]*shareToken/i);
  });

  it("server _core/index.ts wires the bootstrap into startup", () => {
    const src = read("apps/server/_core/index.ts");
    expect(src).toMatch(/bootstrapReplayShareToken/);
    // Must run alongside the other startup bootstraps.
    expect(src).toMatch(/bootstrapWebhookEventsTable[\s\S]*bootstrapReplayShareToken/);
  });

  it("router saveReplay generates a token and returns it", () => {
    const src = read("apps/server/routers/replaySystem.ts");
    expect(src).toMatch(/import\s*\{\s*generateShareToken[^}]*\}\s*from\s*["']\.\.\/services\/replayTokens["']/);
    expect(src).toMatch(/const\s+shareToken\s*=\s*generateShareToken\s*\(\s*\)/);
    expect(src).toMatch(/return\s*\{\s*replayId:\s*result\.id,\s*shareToken\s*\}/);
  });

  it("router exposes a public getReplayByToken endpoint that pre-validates the token", () => {
    const src = read("apps/server/routers/replaySystem.ts");
    expect(src).toMatch(/getReplayByToken:\s*publicProcedure/);
    expect(src).toMatch(/isValidShareToken\s*\(\s*input\.shareToken\s*\)/);
    expect(src).toMatch(/eq\(\s*gameReplays\.shareToken\s*,\s*input\.shareToken\s*\)/);
  });
});
