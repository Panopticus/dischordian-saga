/* ═══════════════════════════════════════════════════════
   PERFORMANCE ROUTER — tRPC endpoints for server
   performance monitoring and health checks.
   ═══════════════════════════════════════════════════════ */
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getPerformanceReport,
  getActiveConnections,
} from "../performanceMonitor";
import { sentryInitialized } from "../sentry";
import { getMatchLengthReport } from "../matchLengthMonitor";

/** Weighted error-rate rollup. Per-route stats already carry an
 *  errorRate (% of that route's requests). This helper rolls them
 *  into a single number weighted by route traffic so the admin badge
 *  reflects "what fraction of all requests across all routes failed,"
 *  not the unweighted average across routes (which would let a single
 *  low-traffic 100%-error endpoint dominate the badge). */
function weightedErrorRate(
  routes: Record<string, { count: number; errorRate: number }>,
): number {
  let totalRequests = 0;
  let totalErrors = 0;
  for (const stats of Object.values(routes)) {
    totalRequests += stats.count;
    totalErrors += (stats.count * stats.errorRate) / 100;
  }
  if (totalRequests === 0) return 0;
  return Math.round((totalErrors / totalRequests) * 10000) / 100;
}

export const performanceRouter = router({
  // ═══ ADMIN: Match-length p50/p95/p99 per game type ═══
  // Aggregated wall-clock duration of completed matches, broken
  // out by game type (pvp / duelyst / chess) plus a combined "all"
  // rollup. Recorded by recordMatchStart/recordMatchEnd in
  // apps/server/{pvpWs,duelystWs,chessWs}.ts.
  // Samples reset on server restart (in-process buffer, MAX 1000 per
  // type). Long-term retention will need a separate metrics store.
  matchLength: adminProcedure.query(() => {
    return getMatchLengthReport();
  }),

  // ═══ ADMIN: Full server performance report ═══
  serverReport: adminProcedure.query(() => {
    return getPerformanceReport();
  }),

  // ═══ ADMIN: Active WebSocket/SSE connection count ═══
  activeConnections: adminProcedure.query(() => {
    return { connections: getActiveConnections() };
  }),

  // ═══ ADMIN: Flat rollup for an admin nav badge ═══
  // Built on top of getPerformanceReport() but emits a denser
  // shape designed for tight polling (5-10s) without re-deriving
  // weightedErrorRatePct or sentryInitialized on every render. The
  // Sentry init flag is admin-gated rather than public so an alarm
  // can ask "did the SDK actually load in prod?" without exposing
  // SDK presence to anonymous /healthCheck callers.
  adminHealth: adminProcedure.query(() => {
    const report = getPerformanceReport();
    const memMb = report.memory
      ? Math.round(report.memory.rss / (1024 * 1024))
      : null;
    return {
      uptimeSec: report.uptime,
      memoryRssMb: memMb,
      activeConnections: getActiveConnections(),
      observedRoutes: Object.keys(report.routes).length,
      weightedErrorRatePct: weightedErrorRate(report.routes),
      wsMessagesTotal: report.ws.totalMessages,
      dbQueriesTotal: report.db.totalQueries,
      dbSlowQueriesTotal: report.db.slowQueries,
      sentryInitialized: sentryInitialized,
    };
  }),

  // ═══ PUBLIC: Health check with basic latency info ═══
  healthCheck: publicProcedure.query(() => {
    const start = performance.now();
    const report = getPerformanceReport();
    const checkDurationMs = Math.round((performance.now() - start) * 100) / 100;

    return {
      status: "ok" as const,
      uptime: report.uptime,
      checkDurationMs,
      memory: report.memory
        ? {
            rssMb: Math.round(report.memory.rss / (1024 * 1024)),
            heapUsedMb: Math.round(report.memory.heapUsed / (1024 * 1024)),
          }
        : null,
      totalRoutes: Object.keys(report.routes).length,
      totalDbQueries: report.db.totalQueries,
      slowDbQueries: report.db.slowQueries,
    };
  }),
});
