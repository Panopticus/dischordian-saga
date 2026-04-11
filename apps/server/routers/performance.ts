/* ═══════════════════════════════════════════════════════
   PERFORMANCE ROUTER — tRPC endpoints for server
   performance monitoring and health checks.
   ═══════════════════════════════════════════════════════ */
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getPerformanceReport,
  getActiveConnections,
} from "../performanceMonitor";

export const performanceRouter = router({
  // ═══ ADMIN: Full server performance report ═══
  serverReport: adminProcedure.query(() => {
    return getPerformanceReport();
  }),

  // ═══ ADMIN: Active WebSocket/SSE connection count ═══
  activeConnections: adminProcedure.query(() => {
    return { connections: getActiveConnections() };
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
