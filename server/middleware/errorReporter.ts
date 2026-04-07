/* ═══════════════════════════════════════════════════════
   ERROR REPORTER — Centralized error capture service.

   Pluggable: supports Sentry when DSN is configured,
   falls back to structured console logging otherwise.
   Initialize with initErrorReporter() at server startup.
   ═══════════════════════════════════════════════════════ */
import type { ErrorRequestHandler, RequestHandler } from "express";

// ─── Sentry-compatible interface (avoids hard dep on @sentry/node) ───

interface ErrorReporterConfig {
  dsn?: string;
  environment?: string;
  release?: string;
}

let _sentry: typeof import("@sentry/node") | null = null;
let _initialized = false;

/**
 * Initialize the error reporter. Call once at server startup.
 * If SENTRY_DSN env var is set, loads @sentry/node dynamically.
 * Otherwise uses structured console logging.
 */
export async function initErrorReporter(config?: ErrorReporterConfig) {
  const dsn = config?.dsn || process.env.SENTRY_DSN;
  if (!dsn) {
    console.log("[ErrorReporter] No SENTRY_DSN — using console logging");
    _initialized = true;
    return;
  }

  try {
    _sentry = await import("@sentry/node");
    _sentry.init({
      dsn,
      environment: config?.environment || process.env.NODE_ENV || "development",
      release: config?.release || process.env.npm_package_version,
      tracesSampleRate: 0.1, // 10% of transactions
      // Don't send PII unless explicitly opted in
      sendDefaultPii: false,
    });
    _initialized = true;
    console.log("[ErrorReporter] Sentry initialized");
  } catch (err) {
    console.warn("[ErrorReporter] Failed to load @sentry/node — using console logging:", err);
    _initialized = true;
  }
}

/** Capture an exception (sends to Sentry or logs to console) */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (_sentry) {
    _sentry.captureException(error, { extra: context });
  } else {
    console.error("[Error]", error, context ? JSON.stringify(context) : "");
  }
}

/** Capture a message (info/warning level) */
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (_sentry) {
    _sentry.captureMessage(message, level);
  } else {
    const logFn = level === "error" ? console.error : level === "warning" ? console.warn : console.info;
    logFn(`[${level.toUpperCase()}]`, message);
  }
}

/** Express request handler — adds Sentry request data if available */
export function requestContext(): RequestHandler {
  return (req, _res, next) => {
    if (_sentry) {
      _sentry.setContext("request", {
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
    }
    next();
  };
}

/** Express error handler — captures unhandled errors */
export function errorHandler(): ErrorRequestHandler {
  return (err, req, res, next) => {
    captureException(err, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
    });
    next(err);
  };
}

/** Check if error reporting is active (Sentry loaded) */
export function isReporterActive(): boolean {
  return _initialized && _sentry !== null;
}
