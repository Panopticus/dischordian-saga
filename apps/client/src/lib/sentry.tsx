/* ═══════════════════════════════════════════════════════
   SENTRY ERROR MONITORING — Client-side integration.
   Captures uncaught errors and performance traces for
   production observability.

   `@sentry/react` is treated as an OPTIONAL runtime
   dependency. The module is loaded via dynamic import so
   the production bundle gracefully no-ops when the package
   is absent and when `VITE_SENTRY_DSN` is unset. This
   matches the pattern used by `apps/server/sentry.ts`.

   Imported for side-effect from `apps/client/src/main.tsx`
   so the lazy init kicks off on app boot.
   ═══════════════════════════════════════════════════════ */

import { useEffect, type ComponentType, type ReactNode } from "react";

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

// Loaded lazily on demand — the static import that lived here before
// pulled @sentry/react into the production bundle even when the
// package wasn't installed, which broke `pnpm run build` the moment
// any consumer imported this module for side-effect.
type SentryModule = typeof import("@sentry/react");
let SentryRef: SentryModule | undefined;
let initialized = false;

async function initSentry(): Promise<void> {
  if (!DSN) return;
  try {
    // `@sentry/react` is declared as an optional runtime dep in
    // apps/client/src/types/optional-modules.d.ts — not present in
    // package.json by default, only installed in production builds
    // that opt into telemetry.
    //
    // We construct the module specifier in a way Rollup can't
    // statically resolve (variable path + /* @vite-ignore */) so the
    // build succeeds whether or not the package is actually present.
    // Runtime fails cleanly into the catch block below when it isn't,
    // and the rest of the app keeps working.
    const sentrySpecifier = "@sentry/react";
    SentryRef = (await import(/* @vite-ignore */ sentrySpecifier)) as SentryModule;
  } catch {
    // @sentry/react not installed — fail silently. The export below
    // returns a pass-through ErrorBoundary so consumers don't need
    // to special-case the missing-SDK path.
    return;
  }

  SentryRef.init({
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
      SentryRef.browserTracingIntegration(),
      SentryRef.replayIntegration(),
    ],
  });
  initialized = true;
}

// Fire-and-forget. Consumers that need to know whether init has
// completed call `waitForSentry()` and read `sentryInitialized()`.
const _ready = initSentry();

/** Resolve when the lazy Sentry init has settled (succeeded, failed,
 *  or no-op'd because DSN is unset). */
export function waitForSentry(): Promise<void> {
  return _ready;
}

/** Returns `true` once Sentry has been initialized successfully. */
export function sentryInitialized(): boolean {
  return initialized;
}

/* ─────────────────────────────────────────────────────────
   Pass-through ErrorBoundary that wraps Sentry's when it
   loads, falling back to a vanilla render-children boundary
   when the SDK is absent. Kept for backward-compat with the
   shape this module exported before the dynamic-import
   refactor; no consumers use it today.
   ───────────────────────────────────────────────────────── */
export interface SentryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SentryErrorBoundary({
  children,
  fallback,
}: SentryErrorBoundaryProps): ReactNode {
  // Ensure init has been kicked off (no-op if it already has).
  useEffect(() => {
    void _ready;
  }, []);

  // When Sentry loaded, defer to its boundary; otherwise render the
  // children directly (or the fallback if a child throws — handled
  // by a parent ErrorBoundary in App.tsx already).
  const RealBoundary: ComponentType<{
    children: ReactNode;
    fallback?: ReactNode;
  }> | undefined = SentryRef?.ErrorBoundary as
    | ComponentType<{ children: ReactNode; fallback?: ReactNode }>
    | undefined;

  if (RealBoundary) {
    return <RealBoundary fallback={fallback}>{children}</RealBoundary>;
  }
  return <>{children}</>;
}
