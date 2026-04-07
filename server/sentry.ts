/* ═══════════════════════════════════════════════════════
   SENTRY ERROR MONITORING — Server-side integration.
   Captures unhandled exceptions and error-level logs
   for production observability.
   ═══════════════════════════════════════════════════════ */

import * as Sentry from "@sentry/node";
import type { Request, Response, NextFunction } from "express";

const DSN = process.env.SENTRY_DSN;

let initialized = false;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.2,
    // Attach server name so issues can be traced to specific hosts
    serverName: process.env.HOSTNAME || undefined,
  });
  initialized = true;
}

/**
 * Capture an exception in Sentry. No-op when Sentry is not configured.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

/**
 * Capture a plain message in Sentry. No-op when Sentry is not configured.
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
): void {
  if (!initialized) return;
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
