/**
 * D — Observability wiring parity check.
 *
 * Hard parity that the production observability surface is wired:
 *
 *   1. SENTRY_DSN listed in apps/server/_core/env.ts as required(...)
 *   2. OTEL_EXPORTER_OTLP_ENDPOINT listed as required(...)
 *   3. apps/server/metrics.ts exists and exports a metricsHandler
 *   4. The tRPC trace middleware imports `recordTrpcRequest` so every
 *      procedure is instrumented automatically
 *   5. /metrics handler mounted in apps/server/_core/index.ts
 *   6. Per-IP rate limit middleware mounted on /api in
 *      apps/server/_core/index.ts
 *
 * Each of these is a single-line grep against committed source —
 * scaffolding without mounting is the exact failure mode this gate
 * catches. NODE_ENV=production fail-fast on missing env is enforced
 * by the existing required() helper; the parity check here proves
 * the env entries are present so the helper has something to fail on.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface Probe {
  name: string;
  file: string;
  pattern: RegExp;
  hint: string;
}

const PROBES: ReadonlyArray<Probe> = [
  {
    name: "env.SENTRY_DSN required",
    file: "apps/server/_core/env.ts",
    pattern: /required\(\s*["']SENTRY_DSN["']/,
    hint: 'add `sentryDsn: required("SENTRY_DSN", process.env.SENTRY_DSN)` to ENV',
  },
  {
    name: "env.OTEL_EXPORTER_OTLP_ENDPOINT required",
    file: "apps/server/_core/env.ts",
    pattern: /required\(\s*["']OTEL_EXPORTER_OTLP_ENDPOINT["']/,
    hint: 'add `otelEndpoint: required("OTEL_EXPORTER_OTLP_ENDPOINT", ...)` to ENV',
  },
  {
    name: "metrics module exists",
    file: "apps/server/metrics.ts",
    pattern: /export\s+(?:async\s+)?function\s+metricsHandler\b/,
    hint: "create apps/server/metrics.ts exporting metricsHandler",
  },
  {
    name: "tRPC procedures emit metrics",
    file: "apps/server/_core/trpc.ts",
    pattern: /recordTrpcRequest\b/,
    hint: "import + call recordTrpcRequest from the trace middleware",
  },
  {
    name: "/metrics endpoint mounted",
    file: "apps/server/_core/index.ts",
    pattern: /app\.get\(\s*["']\/metrics["']/,
    hint: 'mount `app.get("/metrics", metricsHandler)` in startServer()',
  },
  {
    name: "publicIpRateLimit mounted on /api",
    file: "apps/server/_core/index.ts",
    pattern: /publicIpRateLimit/,
    hint: 'import + use publicIpRateLimit on the /api scope before route registration',
  },
];

export function checkObservabilityWiring(): RawParityCount {
  const missing: string[] = [];
  for (const probe of PROBES) {
    const abs = path.join(REPO_ROOT, probe.file);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!probe.pattern.test(src)) {
      missing.push(`${probe.name} — ${probe.hint} (${probe.file})`);
    }
  }
  return {
    declared: PROBES.length,
    implemented: PROBES.length - missing.length,
    missing,
  };
}
