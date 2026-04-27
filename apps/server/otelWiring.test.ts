/**
 * Static guard: OpenTelemetry is wired into the tRPC + bootstrap path.
 *
 * The OTel SDK is an optional runtime dep loaded via variable-specifier
 * dynamic imports (matches the @sentry/node and @sentry/react pattern).
 * It activates only when OTEL_ENABLED=1 AND OTEL_EXPORTER_OTLP_ENDPOINT
 * is set. When inactive, every consumer is a no-op tail call to the
 * wrapped function.
 *
 * This test locks in the #88 wiring:
 *
 *   1. apps/server/_core/trpc.ts wraps every procedure in `withSpan`
 *      via a `traceMiddleware`, applied to publicProcedure,
 *      protectedProcedure, adminProcedure, and moderatorProcedure.
 *   2. apps/server/_core/index.ts awaits `waitForOTel()` before
 *      binding the listener so bootstrap-time spans are exported.
 *   3. apps/server/routers/performance.ts exposes `otelInitialized`
 *      on the `adminHealth` query so the admin dashboard can answer
 *      "is tracing on?" without poking at env vars.
 *
 * Silent regressions in any of these would mean tracing is disabled
 * under SDK presence — a mode that's expensive to debug after the fact.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

function readFile(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("OpenTelemetry runtime wiring", () => {
  it("server _core/trpc.ts imports `withSpan` from ../otel", () => {
    const src = readFile("apps/server/_core/trpc.ts");
    expect(src).toMatch(/import\s*\{[^}]*withSpan[^}]*\}\s*from\s*["']\.\.\/otel["']/);
  });

  it("server _core/trpc.ts defines a traceMiddleware that calls withSpan", () => {
    const src = readFile("apps/server/_core/trpc.ts");
    expect(src).toMatch(/const\s+traceMiddleware\s*=/);
    expect(src).toMatch(/withSpan\s*\(\s*`trpc\.\$\{path\}`/);
  });

  it("traceMiddleware is applied to all four procedure types", () => {
    const src = readFile("apps/server/_core/trpc.ts");
    expect(src, "publicProcedure must use traceMiddleware").toMatch(
      /publicProcedure\s*=\s*t\.procedure\.use\s*\(\s*traceMiddleware\s*\)/,
    );
    expect(src, "protectedProcedure must use traceMiddleware").toMatch(
      /protectedProcedure\s*=\s*t\.procedure\.use\s*\(\s*traceMiddleware\s*\)/,
    );
    expect(src, "adminProcedure must use traceMiddleware").toMatch(
      /adminProcedure\s*=\s*t\.procedure\.use\s*\(\s*traceMiddleware\s*\)/,
    );
    expect(src, "moderatorProcedure must use traceMiddleware").toMatch(
      /moderatorProcedure\s*=\s*t\.procedure\.use\s*\(\s*traceMiddleware\s*\)/,
    );
  });

  it("server _core/index.ts imports waitForOTel from ../otel", () => {
    const src = readFile("apps/server/_core/index.ts");
    expect(src).toMatch(/import\s*\{[^}]*waitForOTel[^}]*\}\s*from\s*["']\.\.\/otel["']/);
  });

  it("server awaits waitForOTel() during bootstrap", () => {
    const src = readFile("apps/server/_core/index.ts");
    expect(src).toMatch(/await\s+waitForOTel\s*\(\s*\)/);
  });

  it("performanceRouter.adminHealth exposes otelInitialized()", () => {
    const src = readFile("apps/server/routers/performance.ts");
    expect(src).toMatch(/import\s*\{[^}]*otelInitialized[^}]*\}\s*from\s*["']\.\.\/otel["']/);
    expect(src).toMatch(/otelInitialized\s*:\s*otelInitialized\s*\(\s*\)/);
  });

  it("otel.ts uses variable-specifier dynamic imports so Vite/Rollup don't resolve at build time", () => {
    // The same workaround that fixed the @sentry/react build break
    // (commit 2397cc0) — variable-specifier import + /* @vite-ignore */
    // keeps the SDK packages out of the dependency graph until runtime.
    const src = readFile("apps/server/otel.ts");
    expect(src, "must hold the SDK module ID in a variable").toMatch(
      /const\s+sdkSpecifier\s*=\s*["']@opentelemetry\/sdk-node["']/,
    );
    expect(src, "must use /* @vite-ignore */ so Rollup skips resolution").toMatch(
      /import\s*\(\s*\/\*\s*@vite-ignore\s*\*\/\s*\w+Specifier\s*\)/,
    );
  });

  it("otel.ts exports the documented surface", () => {
    const src = readFile("apps/server/otel.ts");
    expect(src).toMatch(/export\s+function\s+waitForOTel\s*\(/);
    expect(src).toMatch(/export\s+function\s+otelInitialized\s*\(/);
    expect(src).toMatch(/export\s+async\s+function\s+withSpan\s*</);
  });

  it("otel.ts gates init on OTEL_ENABLED and OTEL_EXPORTER_OTLP_ENDPOINT", () => {
    const src = readFile("apps/server/otel.ts");
    expect(src).toMatch(/process\.env\.OTEL_ENABLED/);
    expect(src).toMatch(/process\.env\.OTEL_EXPORTER_OTLP_ENDPOINT/);
  });

  it("withSpan is a tail-call when the SDK isn't loaded", () => {
    // The no-op fast path is the entire reason this can be applied
    // unconditionally to every tRPC procedure. Lock it in.
    const src = readFile("apps/server/otel.ts");
    expect(src).toMatch(/if\s*\(\s*!\s*tracerImpl\s*\)\s*return\s+Promise\.resolve\s*\(\s*fn\s*\(\s*\)\s*\)/);
  });
});
