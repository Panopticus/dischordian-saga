/**
 * Admin telemetry dashboard wiring guard (#148).
 *
 * Static-analysis covering the page's wiring contract + behavioural
 * tests for the pure formatters. The Sentry/OTel/perf endpoints are
 * already covered by their respective wiring tests
 * (apps/server/sentryWiring.test.ts, otelWiring.test.ts,
 * stripeWebhookIdempotency.test.ts); this file ensures the
 * dashboard *consumes* them faithfully.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { formatDurationSec, formatUptime } from "./AdminHealthPage";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("formatDurationSec — match-length cell formatter", () => {
  it("returns 0s for zero or negative seconds", () => {
    expect(formatDurationSec(0)).toBe("0s");
    expect(formatDurationSec(-5)).toBe("0s");
  });

  it("formats sub-minute durations as Ns", () => {
    expect(formatDurationSec(7)).toBe("7s");
    expect(formatDurationSec(59)).toBe("59s");
  });

  it("formats sub-hour durations as MmSSs (zero-padded)", () => {
    expect(formatDurationSec(60)).toBe("1m 00s");
    expect(formatDurationSec(125)).toBe("2m 05s");
    expect(formatDurationSec(3599)).toBe("59m 59s");
  });

  it("formats multi-hour durations as Hh Mm Ss", () => {
    expect(formatDurationSec(3600)).toBe("1h 0m 0s");
    expect(formatDurationSec(3661)).toBe("1h 1m 1s");
    expect(formatDurationSec(7325)).toBe("2h 2m 5s");
  });

  it("floors fractional seconds (no decimals in the UI)", () => {
    expect(formatDurationSec(125.7)).toBe("2m 05s");
  });
});

describe("formatUptime — server-uptime cell formatter", () => {
  it("uses raw seconds for sub-minute uptimes (server just started)", () => {
    expect(formatUptime(0)).toBe("0s");
    expect(formatUptime(45)).toBe("45s");
  });

  it("delegates to formatDurationSec at minute scale and above", () => {
    expect(formatUptime(60)).toBe(formatDurationSec(60));
    expect(formatUptime(7325)).toBe(formatDurationSec(7325));
  });
});

describe("AdminHealthPage — endpoint wiring", () => {
  const SRC = read("apps/client/src/pages/AdminHealthPage.tsx");

  it("polls performance.adminHealth + performance.matchLength", () => {
    expect(SRC).toMatch(/trpc\.performance\.adminHealth\.useQuery/);
    expect(SRC).toMatch(/trpc\.performance\.matchLength\.useQuery/);
  });

  it("auto-refresh interval is 5 seconds", () => {
    expect(SRC).toMatch(/REFRESH_INTERVAL_MS\s*=\s*5_000/);
    expect(SRC).toMatch(/refetchInterval:\s*paused\s*\?\s*false\s*:\s*REFRESH_INTERVAL_MS/);
  });

  it("polling can be paused via a header toggle", () => {
    expect(SRC).toMatch(/setPaused\(\(p\)\s*=>\s*!p\)/);
    expect(SRC).toMatch(/aria-pressed=\{paused\}/);
  });

  it("queries are gated on isAdmin (fast-fail before the request fires)", () => {
    expect(SRC).toMatch(/enabled:\s*isAdmin/);
    expect(SRC).toMatch(/user\?\.role\s*===\s*["']admin["']/);
  });

  it("renders an access-denied shell for non-admins (defense-in-depth)", () => {
    // The tRPC procedures are admin-gated server-side, but a
    // non-admin landing on /admin/health still needs an immediate
    // fast-fail so we don't surface two trpc errors.
    expect(SRC).toMatch(/Access denied/);
    expect(SRC).toMatch(/Admin clearance required/);
  });

  it("renders the four canonical metric sections", () => {
    expect(SRC).toMatch(/aria-label=["']Server status["']/);
    expect(SRC).toMatch(/aria-label=["']Error rate["']/);
    expect(SRC).toMatch(/aria-label=["']Match length percentiles["']/);
    expect(SRC).toMatch(/aria-label=["']Database counters["']/);
  });

  it("error-rate section flips to destructive styling above 1%", () => {
    expect(SRC).toMatch(/danger\s*=\s*pctNum\s*!=\s*null\s*&&\s*pctNum\s*>\s*1/);
    expect(SRC).toMatch(/border-destructive\/40/);
  });

  it("Sentry + OTel SDK statuses surface a clear inactive cue", () => {
    // When SENTRY_DSN / OTEL_ENABLED are unset in prod the SDKs
    // don't load — the dashboard should make that obvious so an
    // admin doesn't think telemetry is broken.
    expect(SRC).toMatch(/✓ live/);
    expect(SRC).toMatch(/○ inactive/);
    expect(SRC).toMatch(/disabled — env-var unset/);
  });

  it("match-length table renders all four breakdowns (all/pvp/duelyst/chess)", () => {
    expect(SRC).toMatch(/\["all", "pvp", "duelyst", "chess"\]/);
  });

  it("uses the canonical typed router-output for adminHealth + matchLength", () => {
    // Imports the server's AppRouter type so the data shape stays
    // in lockstep with the router. A future refactor that drops the
    // import would silently degrade to `any` and lose the type
    // safety this file relies on.
    expect(SRC).toMatch(
      /import type \{\s*AppRouter\s*\}\s*from\s*["']\.\.\/\.\.\/\.\.\/server\/routers["']/,
    );
    expect(SRC).toMatch(/inferRouterOutputs<AppRouter>\["performance"\]\["adminHealth"\]/);
    expect(SRC).toMatch(/inferRouterOutputs<AppRouter>\["performance"\]\["matchLength"\]/);
  });
});

describe("AdminHealthPage — App.tsx route registration", () => {
  const APP = read("apps/client/src/App.tsx");

  it("imports AdminHealthPage as a lazy chunk", () => {
    expect(APP).toMatch(
      /const\s+AdminHealthPage\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*["']\.\/pages\/AdminHealthPage["']\s*\)\s*\)/,
    );
  });

  it("registers the /admin/health route", () => {
    expect(APP).toMatch(
      /<Route\s+path=["']\/admin\/health["']\s+component=\{AdminHealthPage\}/,
    );
  });

  it("the /admin/health route sits next to /admin (route grouping)", () => {
    const adminIdx = APP.indexOf('path="/admin"');
    const healthIdx = APP.indexOf('path="/admin/health"');
    expect(adminIdx).toBeGreaterThan(0);
    expect(healthIdx).toBeGreaterThan(adminIdx);
    // Nothing intervenes — they should be consecutive lines.
    const between = APP.slice(adminIdx, healthIdx);
    expect(between.split("\n").length).toBeLessThan(5);
  });
});
