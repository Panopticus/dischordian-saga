/* ═══════════════════════════════════════════════════════
   SENTRY ERROR MONITORING — Client-side integration.
   Captures uncaught errors and performance traces for
   production observability.
   ═══════════════════════════════════════════════════════ */

import * as Sentry from "@sentry/react";

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

let initialized = false;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE || "development",

    // Capture 100% of error events
    sampleRate: 1.0,

    // Capture 20% of transactions for performance monitoring
    tracesSampleRate: 0.2,

    // Record 10% of sessions for Session Replay
    replaysSessionSampleRate: 0.1,

    // Always record a replay when an error occurs
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });
  initialized = true;
}

/**
 * React ErrorBoundary powered by Sentry.
 * When Sentry is not configured this still acts as a standard error boundary.
 *
 * Usage:
 *   <SentryErrorBoundary fallback={<p>Something went wrong</p>}>
 *     <App />
 *   </SentryErrorBoundary>
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export { initialized as sentryInitialized };
