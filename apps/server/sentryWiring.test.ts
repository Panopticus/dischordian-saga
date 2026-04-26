/**
 * Static guard: Sentry is wired into both client and server runtimes.
 *
 * Both `apps/server/sentry.ts` and `apps/client/src/lib/sentry.ts`
 * have existed for some time but were never imported anywhere — the
 * client SDK's side-effect `Sentry.init` call lives at the module top
 * level and the server's `sentryErrorHandler` was exported but never
 * mounted. As a result, when `SENTRY_DSN` was set in production
 * neither runtime actually captured errors.
 *
 * This test locks in the wiring added in the #88 telemetry pass:
 *
 *   1. apps/client/src/main.tsx imports `./lib/sentry` for its
 *      side-effect (init fires before App renders).
 *   2. apps/server/_core/index.ts imports `sentryErrorHandler` and
 *      mounts it as Express middleware AFTER all routes.
 *   3. apps/server/_core/index.ts awaits `waitForSentry()` before
 *      binding the listener so bootstrap-time errors are also captured.
 *
 * If a future refactor accidentally drops any of these the test fails
 * with a pointed message — much cheaper than diagnosing silently
 * lost error reports months later.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

function readFile(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("Sentry runtime wiring", () => {
  it("client main.tsx imports ./lib/sentry for side-effect init", () => {
    const src = readFile("apps/client/src/main.tsx");
    expect(src, "main.tsx must import ./lib/sentry so Sentry.init fires").toMatch(
      /import\s+["']\.\/lib\/sentry["']/,
    );
  });

  it("server _core/index.ts imports the sentry helpers", () => {
    const src = readFile("apps/server/_core/index.ts");
    expect(src).toMatch(/import\s*\{[^}]*sentryErrorHandler[^}]*\}\s*from\s*["']\.\.\/sentry["']/);
    expect(src).toMatch(/import\s*\{[^}]*waitForSentry[^}]*\}\s*from\s*["']\.\.\/sentry["']/);
  });

  it("server mounts sentryErrorHandler as Express middleware", () => {
    const src = readFile("apps/server/_core/index.ts");
    expect(src).toMatch(/app\.use\s*\(\s*sentryErrorHandler\s*\)/);
  });

  it("server awaits waitForSentry() during bootstrap", () => {
    const src = readFile("apps/server/_core/index.ts");
    expect(src).toMatch(/await\s+waitForSentry\s*\(\s*\)/);
  });

  it("sentryErrorHandler runs AFTER the Vite/static asset handler", () => {
    // Express error-handling middleware must come last in the chain;
    // mounting before serveStatic / setupVite would mean errors thrown
    // by static / Vite never reach Sentry. Verify textual order.
    const src = readFile("apps/server/_core/index.ts");
    const staticIdx = Math.max(
      src.indexOf("serveStatic(app)"),
      src.indexOf("setupVite(app"),
    );
    const sentryIdx = src.indexOf("app.use(sentryErrorHandler)");
    expect(staticIdx).toBeGreaterThan(0);
    expect(sentryIdx).toBeGreaterThan(0);
    expect(sentryIdx).toBeGreaterThan(staticIdx);
  });
});
