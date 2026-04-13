/* ═══════════════════════════════════════════════════════
   SENTRY ERROR MONITORING — Server-side integration.
   Captures unhandled exceptions and error-level logs
   for production observability.

   @sentry/node is an optional dependency — the module
   gracefully no-ops when the package is not installed
   or SENTRY_DSN is not set.
   ═══════════════════════════════════════════════════════ */

import type { Request, Response, NextFunction } from "express";

let Sentry: typeof import("@sentry/node") | undefined;
let initialized = false;

async function initSentry() {
  const DSN = process.env.SENTRY_DSN;
  if (!DSN) return;

  try {
    Sentry = await import("@sentry/node");
  } catch {
    // @sentry/node is not installed — skip silently
    return;
  }

  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.2,
    // Attach server name so issues can be traced to specific hosts
    serverName: process.env.HOSTNAME || undefined,
  });
  initialized = true;
}

// Fire-and-forget; callers check `initialized` before using Sentry.
const _ready = initSentry();

/**
 * Wait for Sentry initialization to complete (useful at startup).
 */
export function waitForSentry(): Promise<void> {
  return _ready;
}

/**
 * Capture an exception in Sentry. No-op when Sentry is not configured.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized || !Sentry) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

/**
 * Capture a plain message in Sentry. No-op when Sentry is not configured.
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
): void {
  if (!initialized || !Sentry) return;
  Sentry.captureMessage(message, level);
}

/**
 * Express error-handling middleware that reports errors to Sentry
 * and then forwards them to the next error handler.
 *
 * Mount this AFTER all routes:
 *   app.use(sentryErrorHandler);
 */
export function sentryErrorHandler(err: Error, _req: Request, _res: Response, next: NextFunction): void {
  captureException(err);
  next(err);
}

export { initialized as sentryInitialized };
