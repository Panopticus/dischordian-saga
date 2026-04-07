/* ═══════════════════════════════════════════════════════
   PERFORMANCE MONITOR — Server-side request, query,
   WebSocket, and memory tracking with aggregated reports.
   ═══════════════════════════════════════════════════════ */
import type { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

// ── Types ──────────────────────────────────────────────

interface LatencySample {
  timestamp: number;
  durationMs: number;
  statusCode?: number;
  responseSize?: number;
}

interface RouteStats {
  samples: LatencySample[];
  totalRequests: number;
  errorCount: number;
}

interface WsLatencySample {
  timestamp: number;
  durationMs: number;
  event: string;
}

interface DbQuerySample {
  timestamp: number;
  durationMs: number;
  name: string;
}

interface MemorySnapshot {
  timestamp: number;
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

interface PercentileStats {
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  count: number;
}

interface PerformanceReport {
  uptime: number;
  routes: Record<string, PercentileStats & { errorRate: number }>;
  ws: {
    totalMessages: number;
    latency: PercentileStats | null;
    byEvent: Record<string, PercentileStats>;
  };
  db: {
    totalQueries: number;
    slowQueries: number;
    latency: PercentileStats | null;
  };
  memory: MemorySnapshot | null;
  memoryHistory: MemorySnapshot[];
}

// ── Storage ────────────────────────────────────────────

const MAX_SAMPLES = 2000;
const SLOW_REQUEST_MS = 500;
const SLOW_QUERY_MS = 100;
const MEMORY_WARNING_MB = 512;

const routeMetrics = new Map<string, RouteStats>();
const wsLatencySamples: WsLatencySample[] = [];
const dbQuerySamples: DbQuerySample[] = [];
const memoryHistory: MemorySnapshot[] = [];

const startTime = Date.now();

// ── Helpers ────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function computePercentiles(durations: number[]): PercentileStats {
  if (durations.length === 0) {
    return { p50: 0, p95: 0, p99: 0, avg: 0, count: 0 };
  }
  const sorted = [...durations].sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  return {
    p50: Math.round(percentile(sorted, 50) * 100) / 100,
    p95: Math.round(percentile(sorted, 95) * 100) / 100,
    p99: Math.round(percentile(sorted, 99) * 100) / 100,
    avg: Math.round((sum / sorted.length) * 100) / 100,
    count: sorted.length,
  };
}

function trimArray<T>(arr: T[], max: number): void {
  if (arr.length > max) {
    arr.splice(0, arr.length - max);
  }
}

function routeKey(method: string, path: string): string {
  // Normalize dynamic segments: /api/users/123 -> /api/users/:id
  const normalized = path
    .replace(/\/\d+/g, "/:id")
    .replace(/\/[0-9a-f]{24}/gi, "/:id")
    .replace(/\?.*$/, "");
  return `${method.toUpperCase()} ${normalized}`;
}

// ── Express Middleware ─────────────────────────────────

export function performanceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now();

  const originalEnd = res.end;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.end = function (this: Response, ...args: any[]) {
    const durationMs = performance.now() - start;
    const key = routeKey(req.method, req.path);

    let stats = routeMetrics.get(key);
    if (!stats) {
      stats = { samples: [], totalRequests: 0, errorCount: 0 };
      routeMetrics.set(key, stats);
    }

    const contentLength = res.getHeader("content-length");
    const responseSize = contentLength ? Number(contentLength) : undefined;

    stats.samples.push({
      timestamp: Date.now(),
      durationMs,
      statusCode: res.statusCode,
      responseSize,
    });
    stats.totalRequests++;
    if (res.statusCode >= 400) {
      stats.errorCount++;
    }
    trimArray(stats.samples, MAX_SAMPLES);

    if (durationMs > SLOW_REQUEST_MS) {
      logger.warn(
        `[Perf] Slow request: ${key} took ${Math.round(durationMs)}ms (status ${res.statusCode})`
      );
    }

    return originalEnd.apply(this, args as any);
  } as typeof res.end;

  next();
}

// ── WebSocket Latency Tracking ─────────────────────────

export function trackWsMessage(event: string): { end(): void } {
  const start = performance.now();
  return {
    end() {
      const durationMs = performance.now() - start;
      wsLatencySamples.push({ timestamp: Date.now(), durationMs, event });
      trimArray(wsLatencySamples, MAX_SAMPLES);
    },
  };
}

// ── Database Query Wrapper ─────────────────────────────

export async function trackDbQuery<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    return result;
  } finally {
    const durationMs = performance.now() - start;
    dbQuerySamples.push({ timestamp: Date.now(), durationMs, name });
    trimArray(dbQuerySamples, MAX_SAMPLES);

    if (durationMs > SLOW_QUERY_MS) {
      logger.warn(`[Perf] Slow DB query: "${name}" took ${Math.round(durationMs)}ms`);
    }
  }
}

// ── Memory Usage Reporter ──────────────────────────────

function sampleMemory(): MemorySnapshot {
  const mem = process.memoryUsage();
  const snapshot: MemorySnapshot = {
    timestamp: Date.now(),
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    external: mem.external,
  };
  memoryHistory.push(snapshot);
  trimArray(memoryHistory, 60); // Keep ~60 minutes of history

  const rssMb = mem.rss / (1024 * 1024);
  if (rssMb > MEMORY_WARNING_MB) {
    logger.warn(
      `[Perf] High memory usage: RSS ${Math.round(rssMb)}MB exceeds ${MEMORY_WARNING_MB}MB threshold`
    );
  }

  return snapshot;
}

let memoryInterval: ReturnType<typeof setInterval> | null = null;

export function startMemoryReporter(): void {
  if (memoryInterval) return;
  sampleMemory(); // Initial sample
  memoryInterval = setInterval(sampleMemory, 60_000);
  // Allow process to exit cleanly
  if (memoryInterval.unref) {
    memoryInterval.unref();
  }
}

export function stopMemoryReporter(): void {
  if (memoryInterval) {
    clearInterval(memoryInterval);
    memoryInterval = null;
  }
}

// ── Aggregated Report ──────────────────────────────────

export function getPerformanceReport(): PerformanceReport {
  // Route stats
  const routes: PerformanceReport["routes"] = {};
  for (const [key, stats] of routeMetrics) {
    const durations = stats.samples.map((s) => s.durationMs);
    const percentiles = computePercentiles(durations);
    routes[key] = {
      ...percentiles,
      count: stats.totalRequests,
      errorRate:
        stats.totalRequests > 0
          ? Math.round((stats.errorCount / stats.totalRequests) * 10000) / 100
          : 0,
    };
  }

  // WebSocket stats
  const wsDurations = wsLatencySamples.map((s) => s.durationMs);
  const wsEventMap = new Map<string, number[]>();
  for (const s of wsLatencySamples) {
    const arr = wsEventMap.get(s.event) || [];
    arr.push(s.durationMs);
    wsEventMap.set(s.event, arr);
  }
  const byEvent: Record<string, PercentileStats> = {};
  for (const [event, durations] of wsEventMap) {
    byEvent[event] = computePercentiles(durations);
  }

  // DB stats
  const dbDurations = dbQuerySamples.map((s) => s.durationMs);
  const slowQueries = dbQuerySamples.filter((s) => s.durationMs > SLOW_QUERY_MS).length;

  // Latest memory snapshot
  const latestMemory = memoryHistory.length > 0 ? memoryHistory[memoryHistory.length - 1] : null;

  return {
    uptime: Math.round((Date.now() - startTime) / 1000),
    routes,
    ws: {
      totalMessages: wsLatencySamples.length,
      latency: wsDurations.length > 0 ? computePercentiles(wsDurations) : null,
      byEvent,
    },
    db: {
      totalQueries: dbQuerySamples.length,
      slowQueries,
      latency: dbDurations.length > 0 ? computePercentiles(dbDurations) : null,
    },
    memory: latestMemory,
    memoryHistory: [...memoryHistory],
  };
}

// ── Active Connections Counter (set externally) ────────

let activeConnections = 0;

export function setActiveConnections(count: number): void {
  activeConnections = count;
}

export function getActiveConnections(): number {
  return activeConnections;
}
