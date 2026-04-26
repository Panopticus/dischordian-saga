/* ═══════════════════════════════════════════════════════
   TELEMETRY ROUTER — Operations / observability surface

   Exposes the in-process metrics collected by
   `apps/server/performanceMonitor.ts` (route latency,
   WS latency, DB queries, memory) to admin clients via
   tRPC. The performance monitor has been collecting data
   for some time but had no read API — this router is the
   surface a future ops dashboard reads.

   All procedures are admin-gated: the snapshot includes
   per-route stats that could leak internal route paths
   to non-admin viewers. The same `protectedProcedure.use`
   pattern from apps/server/routers/admin.ts is reused.

   Mounted at `appRouter.telemetry` (see routers.ts).
   ═══════════════════════════════════════════════════════ */
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getPerformanceReport,
  getActiveConnections,
} from "../performanceMonitor";
import { sentryInitialized } from "../sentry";

// Same admin guard shape as admin.ts. Inline rather than imported
// because admin.ts doesn't export it (and sharing would create a
// circular dep when admin.ts grows telemetry-aware queries).
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const telemetryRouter = router({
  /** Full performance snapshot. Includes per-route p50/p95/p99/avg
   *  latency, error rates, WS message latency (overall + per event),
   *  DB query latency + slow-query count, current memory snapshot,
   *  and a 60-min memory history.
   *
   *  This is a heavy payload — admin dashboards should poll at most
   *  once every 30s, not every render. */
  performance: adminProcedure.query(async () => {
    return getPerformanceReport();
  }),

  /** Lightweight liveness probe for the admin nav badge. Returns a
   *  small flat shape that's safe to poll on a tighter interval
   *  (every 5–10s) without churning serialization. */
  health: adminProcedure.query(async () => {
    const report = getPerformanceReport();
    const memMb = report.memory
      ? Math.round(report.memory.rss / (1024 * 1024))
      : null;
    return {
      uptimeSec: report.uptime,
      memoryRssMb: memMb,
      activeConnections: getActiveConnections(),
      // Per-route counts roll up to a single observed-routes total.
      observedRoutes: Object.keys(report.routes).length,
      // Error rate across all routes weighted by request count.
      // Computed inline so the admin badge can render a single number
      // without re-deriving from the full report.
      weightedErrorRatePct: weightedErrorRate(report.routes),
      // Total WS messages observed since boot — proxy for live
      // multiplayer activity.
      wsMessagesTotal: report.ws.totalMessages,
      // DB query count + slow-query count.
      dbQueriesTotal: report.db.totalQueries,
      dbSlowQueriesTotal: report.db.slowQueries,
      // Sentry init status (not gated on DSN — answers "did the
      // SDK actually load?", which is what an alarm should ask).
      sentryInitialized: sentryInitialized,
    };
  }),
});

/** Weighted error-rate helper. Per-route stats already carry an
 *  errorRate (% of that route's requests). Roll those up into a
 *  single number weighted by route traffic so the admin badge
 *  reflects "what fraction of all requests across all routes
 *  failed," not the unweighted average over routes. */
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
