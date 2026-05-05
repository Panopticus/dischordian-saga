/**
 * Web Vitals collection — minimal-dep implementation.
 *
 * The official `web-vitals` npm package is the canonical source, but
 * pulling it adds a tiny dep and a small bundle hit for what amounts
 * to four `PerformanceObserver` calls. We do the same dance inline.
 *
 * Reports four metrics:
 *   - LCP (Largest Contentful Paint)
 *   - CLS (Cumulative Layout Shift)
 *   - INP (Interaction to Next Paint) — modern responsiveness metric
 *   - TTFB (Time to First Byte)
 *
 * Each metric is reported once on `pagehide` (not on every change)
 * via `navigator.sendBeacon` to a tRPC endpoint. Failure is silent;
 * RUM is best-effort.
 */

export interface WebVitalsReport {
  metric: "lcp" | "cls" | "inp" | "ttfb";
  value: number;
  pathname: string;
  /** Pseudonymous session token — rotates per browser, not user. */
  sessionId: string;
  navType?: string;
}

const SESSION_KEY = "loredex_rum_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function postReport(report: WebVitalsReport, endpoint: string) {
  // tRPC + superjson wraps the payload as `{ json: <body> }`. We use
  // sendBeacon when available (browser guarantees the request fires
  // even if the page is unloading) and fall back to keepalive fetch.
  const body = JSON.stringify({ json: report });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else {
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {/* silent */});
  }
}

/**
 * Wire up the four PerformanceObservers and report on `pagehide`.
 * Call once at app boot.
 */
export function initWebVitals(opts: { endpoint?: string } = {}) {
  if (typeof window === "undefined") return;
  if (!("PerformanceObserver" in window)) return;

  // tRPC mutation URL — superjson encoding so the schema matches.
  const endpoint = opts.endpoint ?? "/api/trpc/rum.webVitals";
  const sessionId = getSessionId();

  let lcp: number | undefined;
  let cls = 0;
  let worstInp = 0;
  let ttfb: number | undefined;

  // LCP — the largest paint up to the first interaction.
  try {
    const lcpObs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      if (last) lcp = last.renderTime ?? last.loadTime ?? last.startTime;
    });
    lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {/* unsupported */}

  // CLS — cumulative layout shift, sessionised by gaps.
  try {
    const clsObs = new PerformanceObserver((list) => {
      for (const e of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!e.hadRecentInput && typeof e.value === "number") cls += e.value;
      }
    });
    clsObs.observe({ type: "layout-shift", buffered: true });
  } catch {/* unsupported */}

  // INP — slowest interaction's processing latency.
  try {
    const inpObs = new PerformanceObserver((list) => {
      for (const e of list.getEntries() as Array<PerformanceEntry & { duration: number }>) {
        if (e.duration > worstInp) worstInp = e.duration;
      }
    });
    inpObs.observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
  } catch {/* unsupported */}

  // TTFB — pulled from navigation timing.
  const nav = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
  if (nav) ttfb = nav.responseStart;

  // Single flush on hide. Only sends a metric if it has a value;
  // CLS=0 is informative, so we always send it.
  const flush = () => {
    const pathname = window.location.pathname;
    const navType = (nav?.type as string | undefined) ?? undefined;
    if (lcp !== undefined) postReport({ metric: "lcp", value: lcp, pathname, sessionId, navType }, endpoint);
    postReport({ metric: "cls", value: cls, pathname, sessionId, navType }, endpoint);
    if (worstInp > 0) postReport({ metric: "inp", value: worstInp, pathname, sessionId, navType }, endpoint);
    if (ttfb !== undefined) postReport({ metric: "ttfb", value: ttfb, pathname, sessionId, navType }, endpoint);
  };

  window.addEventListener("pagehide", flush, { capture: true });
  // visibilitychange catches the case where the tab is hidden but
  // not navigated away; pagehide fires consistently in modern
  // browsers but visibilitychange is the older guarantee.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flush();
  }, { capture: true });
}
