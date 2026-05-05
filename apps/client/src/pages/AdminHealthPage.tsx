/**
 * /admin/health — telemetry dashboard (PR 148). // void-ignore
 *
 * Visualization layer on top of the metrics already captured by the
 * #88 telemetry track:
 *
 *   - Sentry — server error capture (apps/server/sentry.ts).
 *   - OpenTelemetry — tRPC handler tracing (apps/server/otel.ts).
 *   - performanceMonitor — per-route request counts + error rates,
 *     WS message totals, DB query counters.
 *   - matchLengthMonitor — p50/p95/p99 wall-clock per game type.
 *
 * All four are exposed via `performanceRouter.adminHealth` +
 * `performanceRouter.matchLength`. This page polls those endpoints
 * every 5 seconds and renders a compact at-a-glance dashboard so an
 * admin can spot drift (rising memory, climbing error rate, p99
 * spike, telemetry SDK not loaded in prod) without poking at logs.
 *
 * Auth: the `adminHealth` / `matchLength` queries are admin-gated
 * server-side (adminProcedure), and this page also enforces
 * client-side access for fast-fail UX. Both layers must reject so
 * the dashboard isn't visible to non-admins via either path.
 *
 * Auto-refresh: 5s default, pausable via the toggle in the header
 * so an admin investigating a metric snapshot can hold the view
 * still without the next poll racing them.
 */
import { useState } from "react";
import { Link } from "wouter";
import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import type { AppRouter } from "../../../server/routers";

type AdminHealthData =
  | inferRouterOutputs<AppRouter>["performance"]["adminHealth"]
  | undefined;
type MatchLengthData =
  | inferRouterOutputs<AppRouter>["performance"]["matchLength"]
  | undefined;

const REFRESH_INTERVAL_MS = 5_000;

export default function AdminHealthPage() {
  const { user, isAuthenticated } = useAuth();
  const [paused, setPaused] = useState(false);

  // Both queries are admin-gated server-side; we still enforce
  // client-side so a non-admin landing on /admin/health gets an
  // immediate fast-fail instead of two trpc errors.
  const isAdmin = isAuthenticated && user?.role === "admin";

  const adminHealth = trpc.performance.adminHealth.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: paused ? false : REFRESH_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  const matchLength = trpc.performance.matchLength.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: paused ? false : REFRESH_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-2xl p-6 text-center text-foreground">
        <h1 className="font-display text-xl tracking-wide">Access denied.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin clearance required.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Back to Bridge
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6 text-foreground">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide">
            Admin Telemetry — Health
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Live counters from Sentry, OpenTelemetry, performanceMonitor,
            and matchLengthMonitor. Polls every {REFRESH_INTERVAL_MS / 1000}s.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15"
          aria-pressed={paused}
        >
          {paused ? "▶ Resume polling" : "⏸ Pause polling"}
        </button>
      </header>

      {(adminHealth.error || matchLength.error) && (
        <p
          role="alert"
          className="mb-4 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          Telemetry endpoint error:{" "}
          {(adminHealth.error || matchLength.error)?.message}
        </p>
      )}

      <StatusSection data={adminHealth.data} />
      <ErrorRateSection data={adminHealth.data} />
      <MatchLengthSection data={matchLength.data} />
      <DbSection data={adminHealth.data} />
    </main>
  );
}

// AdminHealthData / MatchLengthData are imported from the server router
// at the top of this file. This block intentionally left empty so the
// downstream component sections find the types in module scope.

function StatusSection({ data }: { data: AdminHealthData }) {
  return (
    <section
      className="mb-4 rounded-lg border border-border/40 bg-card/30 p-4"
      aria-label="Server status"
    >
      <h2 className="mb-3 font-display text-sm tracking-widest text-muted-foreground">
        STATUS
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        <Stat label="Uptime" value={data ? formatUptime(data.uptimeSec) : "—"} />
        <Stat
          label="Memory (RSS)"
          value={data?.memoryRssMb != null ? `${data.memoryRssMb} MB` : "—"}
        />
        <Stat
          label="Connections"
          value={data?.activeConnections.toString() ?? "—"}
        />
        <Stat
          label="Routes observed"
          value={data?.observedRoutes.toString() ?? "—"}
        />
        <SdkStatus
          label="Sentry"
          on={data?.sentryInitialized}
          context="error capture"
        />
        <SdkStatus
          label="OpenTelemetry"
          on={data?.otelInitialized}
          context="trace export"
        />
      </div>
    </section>
  );
}

function ErrorRateSection({ data }: { data: AdminHealthData }) {
  const pct = data?.weightedErrorRatePct;
  const pctNum = typeof pct === "number" ? pct : null;
  const danger = pctNum != null && pctNum > 1;
  return (
    <section
      className={`mb-4 rounded-lg border p-4 ${
        danger
          ? "border-destructive/40 bg-destructive/10"
          : "border-border/40 bg-card/30"
      }`}
      aria-label="Error rate"
    >
      <h2 className="mb-2 font-display text-sm tracking-widest text-muted-foreground">
        ERROR RATE (weighted by route traffic)
      </h2>
      <p className="font-mono text-2xl">
        {pctNum != null ? `${pctNum.toFixed(2)}%` : "—"}
      </p>
      {danger && (
        <p className="mt-1 text-xs text-destructive">
          Above 1% — investigate per-route stats in serverReport.
        </p>
      )}
    </section>
  );
}

function MatchLengthSection({ data }: { data: MatchLengthData }) {
  return (
    <section
      className="mb-4 rounded-lg border border-border/40 bg-card/30 p-4"
      aria-label="Match length percentiles"
    >
      <h2 className="mb-3 font-display text-sm tracking-widest text-muted-foreground">
        MATCH LENGTH ·{" "}
        <span className="text-muted-foreground/60">
          in progress: {data?.inProgress ?? "—"}
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground/70">
              <th className="pb-2 pr-4">type</th>
              <th className="pb-2 pr-4">p50</th>
              <th className="pb-2 pr-4">p95</th>
              <th className="pb-2 pr-4">p99</th>
              <th className="pb-2 pr-4">avg</th>
              <th className="pb-2">count</th>
            </tr>
          </thead>
          <tbody>
            {(["all", "pvp", "duelyst", "chess"] as const).map((key) => (
              <tr key={key} className="border-t border-border/20">
                <td className="py-1 pr-4 text-foreground/80">{key}</td>
                <td className="py-1 pr-4">
                  {data ? formatDurationSec(data[key].p50Sec) : "—"}
                </td>
                <td className="py-1 pr-4">
                  {data ? formatDurationSec(data[key].p95Sec) : "—"}
                </td>
                <td className="py-1 pr-4">
                  {data ? formatDurationSec(data[key].p99Sec) : "—"}
                </td>
                <td className="py-1 pr-4">
                  {data ? formatDurationSec(data[key].avgSec) : "—"}
                </td>
                <td className="py-1">{data?.[key].count ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DbSection({ data }: { data: AdminHealthData }) {
  const slow = data?.dbSlowQueriesTotal ?? 0;
  const total = data?.dbQueriesTotal ?? 0;
  const slowPct = total > 0 ? (slow / total) * 100 : 0;
  return (
    <section
      className="rounded-lg border border-border/40 bg-card/30 p-4"
      aria-label="Database counters"
    >
      <h2 className="mb-3 font-display text-sm tracking-widest text-muted-foreground">
        DATABASE
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        <Stat label="Total queries" value={data?.dbQueriesTotal.toLocaleString() ?? "—"} />
        <Stat label="Slow queries" value={data?.dbSlowQueriesTotal.toLocaleString() ?? "—"} />
        <Stat label="Slow %" value={total > 0 ? `${slowPct.toFixed(2)}%` : "—"} />
        <Stat label="WS messages" value={data?.wsMessagesTotal.toLocaleString() ?? "—"} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
        {label}
      </div>
      <div className="font-mono text-base">{value}</div>
    </div>
  );
}

function SdkStatus({
  label,
  on,
  context,
}: {
  label: string;
  on: boolean | undefined;
  context: string;
}) {
  if (on === undefined) {
    return <Stat label={label} value="—" />;
  }
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
        {label}
      </div>
      <div className={`font-mono text-base ${on ? "" : "text-muted-foreground"}`}>
        {on ? "✓ live" : "○ inactive"}
      </div>
      {!on && (
        <div className="text-[10px] text-muted-foreground/70">
          {context} disabled — env-var unset?
        </div>
      )}
    </div>
  );
}

/** Format a duration in seconds as `Hh Mm Ss` (or `Mm Ss`). Exported
 *  for unit-test-style checks; the value 0 returns `0s`. */
export function formatDurationSec(totalSec: number): string {
  if (totalSec <= 0) return "0s";
  const sec = Math.floor(totalSec % 60);
  const min = Math.floor((totalSec / 60) % 60);
  const hr = Math.floor(totalSec / 3600);
  if (hr > 0) return `${hr}h ${min}m ${sec}s`;
  if (min > 0) return `${min}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

/** Server uptime is reported in seconds; render it more compactly
 *  than match-length (admins want hours/minutes, not "473s"). */
export function formatUptime(totalSec: number): string {
  if (totalSec < 60) return `${Math.floor(totalSec)}s`;
  return formatDurationSec(totalSec);
}
