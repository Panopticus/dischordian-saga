/**
 * Application metrics — Prometheus exposition.
 *
 * Provides a `/metrics` Express handler and instrumentation helpers
 * that the tRPC trace middleware + WebSocket message handlers call
 * into. The point: when an incident hits at launch, we have
 * histograms/counters for the things that actually matter (procedure
 * latency, queue length, currency mutations) instead of `tail -f` on
 * stdout.
 *
 * Default registry plus four core metrics:
 *
 *   trpc_request_duration_seconds   histogram, labels: procedure, type, status
 *   trpc_requests_total             counter,   labels: procedure, type, status
 *   ws_messages_total               counter,   labels: surface, message_type
 *   currency_mutations_total        counter,   labels: currency, direction, source
 *
 * Plus default Node metrics (event-loop lag, GC durations, heap)
 * collected by `prom-client`'s `collectDefaultMetrics()`.
 *
 * Scrape protection: the `/metrics` handler checks the
 * `METRICS_SCRAPE_TOKEN` env var; if set, requests must include
 * `Authorization: Bearer <token>`. If unset, the endpoint is open
 * (development convenience). In production the env var is REQUIRED
 * via apps/server/_core/env.ts; mounting `/metrics` open in prod is
 * a leak risk we won't ship.
 */
import type { Request, Response } from "express";
import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

const registry = new Registry();
collectDefaultMetrics({ register: registry, prefix: "dischordian_" });

export const trpcRequestDuration = new Histogram({
  name: "dischordian_trpc_request_duration_seconds",
  help: "tRPC procedure latency in seconds.",
  labelNames: ["procedure", "type", "status"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

export const trpcRequestsTotal = new Counter({
  name: "dischordian_trpc_requests_total",
  help: "Count of tRPC procedure invocations by procedure, type, and status.",
  labelNames: ["procedure", "type", "status"] as const,
  registers: [registry],
});

export const wsMessagesTotal = new Counter({
  name: "dischordian_ws_messages_total",
  help: "Count of WebSocket messages handled, by surface (pvp/chess/terminus/duelyst) and message type.",
  labelNames: ["surface", "message_type"] as const,
  registers: [registry],
});

export const currencyMutationsTotal = new Counter({
  name: "dischordian_currency_mutations_total",
  help: "Count of player-currency credits/debits, by currency and direction (credit|debit).",
  labelNames: ["currency", "direction", "source"] as const,
  registers: [registry],
});

/**
 * Time a tRPC procedure invocation. Returns the millisecond duration
 * for log correlation; the histogram is updated as a side effect.
 */
export function recordTrpcRequest(
  procedure: string,
  type: "query" | "mutation" | "subscription",
  status: "ok" | "error",
  startMs: number,
): number {
  const durSec = (Date.now() - startMs) / 1000;
  const labels = { procedure, type, status } as const;
  trpcRequestDuration.observe(labels, durSec);
  trpcRequestsTotal.inc(labels);
  return durSec * 1000;
}

/**
 * Express handler for `/metrics`. Optional bearer-token gate via
 * `METRICS_SCRAPE_TOKEN`. Content-type set per Prometheus exposition
 * format spec.
 */
export async function metricsHandler(req: Request, res: Response): Promise<void> {
  const token = process.env.METRICS_SCRAPE_TOKEN;
  if (token) {
    const auth = req.header("authorization");
    if (auth !== `Bearer ${token}`) {
      res.status(401).send("unauthorized");
      return;
    }
  }
  try {
    const payload = await registry.metrics();
    res.setHeader("Content-Type", registry.contentType);
    res.send(payload);
  } catch (err) {
    res.status(500).send(`metrics error: ${(err as Error).message}`);
  }
}

/** Exposed for tests. */
export function _resetForTests(): void {
  registry.resetMetrics();
}

export { registry as metricsRegistry };
