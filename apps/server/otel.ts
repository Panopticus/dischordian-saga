/* ═══════════════════════════════════════════════════════
   OPENTELEMETRY TRACING — Server-side integration.

   Wraps tRPC handlers and DB queries in spans for distributed
   tracing. Like @sentry/node, the @opentelemetry/* packages
   are treated as OPTIONAL runtime dependencies — declared
   only as type shims in apps/server/typings (matching the
   pattern in apps/client/src/types/optional-modules.d.ts) and
   loaded via dynamic-specifier import so the build doesn't
   fail when they're absent.

   Activates when `OTEL_ENABLED=1` AND
   `OTEL_EXPORTER_OTLP_ENDPOINT` is set. Otherwise every
   exported function is a no-op — `withSpan(name, fn)` just
   awaits and returns `fn()` without overhead.

   Service name defaults to "dischordian-saga"; override via
   `OTEL_SERVICE_NAME`.
   ═══════════════════════════════════════════════════════ */

import { logger } from "./logger";

/** The shape of a tracer surface this module exposes. Mirrors the
 *  subset of the `@opentelemetry/api` API the rest of the codebase
 *  needs, without taking a runtime dep. */
interface ServerTracer {
  startSpan(
    name: string,
    fn: () => Promise<unknown> | unknown,
    attributes?: Record<string, string | number | boolean>,
  ): Promise<unknown>;
}

let tracerImpl: ServerTracer | null = null;
let initialized = false;

async function tryInitOTel(): Promise<void> {
  if (process.env.OTEL_ENABLED !== "1") return;
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    logger.info(
      "[OTel] OTEL_ENABLED=1 but OTEL_EXPORTER_OTLP_ENDPOINT is unset — tracing disabled",
    );
    return;
  }

  try {
    // Variable-specifier dynamic imports so Vite/Rollup don't try to
    // resolve at build time (mirrors apps/client/src/lib/sentry.tsx).
    // Each package is a separate SDK piece; we load them in parallel
    // and degrade silently if any one is missing.
    const sdkSpecifier = "@opentelemetry/sdk-node";
    const apiSpecifier = "@opentelemetry/api";
    const otlpSpecifier = "@opentelemetry/exporter-trace-otlp-http";
    const resourcesSpecifier = "@opentelemetry/resources";
    const semconvSpecifier = "@opentelemetry/semantic-conventions";

    const [sdk, api, otlp, resources, semconv] = await Promise.all([
      import(/* @vite-ignore */ sdkSpecifier),
      import(/* @vite-ignore */ apiSpecifier),
      import(/* @vite-ignore */ otlpSpecifier),
      import(/* @vite-ignore */ resourcesSpecifier),
      import(/* @vite-ignore */ semconvSpecifier),
    ]);

    const provider = new sdk.NodeSDK({
      resource: new resources.Resource({
        [semconv.SemanticResourceAttributes.SERVICE_NAME]:
          process.env.OTEL_SERVICE_NAME ?? "dischordian-saga",
        [semconv.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
          process.env.NODE_ENV ?? "development",
      }),
      traceExporter: new otlp.OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
    });

    provider.start();

    const tracer = api.trace.getTracer(
      process.env.OTEL_SERVICE_NAME ?? "dischordian-saga",
    );

    tracerImpl = {
      async startSpan(name, fn, attributes) {
        const span = tracer.startSpan(name, attributes ? { attributes } : undefined);
        try {
          const result = await fn();
          span.setStatus({ code: api.SpanStatusCode.OK });
          return result;
        } catch (err) {
          span.recordException(err as Error);
          span.setStatus({
            code: api.SpanStatusCode.ERROR,
            message: err instanceof Error ? err.message : String(err),
          });
          throw err;
        } finally {
          span.end();
        }
      },
    };
    initialized = true;
    logger.info(
      "[OTel] Tracing enabled — exporting to " +
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    );
  } catch (err) {
    // Any of: packages not installed, OTLP endpoint unreachable at
    // init, SDK version mismatch. Degrade silently — every consumer
    // becomes a no-op.
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      "[OTel] init failed — tracing disabled (no behavioral impact): " + msg,
    );
  }
}

const _ready = tryInitOTel();

/** Resolve when OTel init has settled (succeeded, failed, or been
 *  skipped because the env vars aren't set). */
export function waitForOTel(): Promise<void> {
  return _ready;
}

/** True when the SDK loaded and the tracer is live. Exposed so
 *  performanceRouter.adminHealth can answer "is tracing on?" without
 *  poking at env vars from a request handler. */
export function otelInitialized(): boolean {
  return initialized;
}

/**
 * Wrap an async function in a span. When OTel isn't loaded, this is
 * a tail-call to `fn()` — the function's return value is preserved
 * exactly and the no-op overhead is one boolean check.
 *
 * Example:
 *   await withSpan("trpc.player.getProfile", () => loadProfile(id), {
 *     "player.id": id,
 *   });
 */
export async function withSpan<T>(
  name: string,
  fn: () => Promise<T> | T,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  if (!tracerImpl) return Promise.resolve(fn());
  return tracerImpl.startSpan(name, fn, attributes) as Promise<T>;
}
