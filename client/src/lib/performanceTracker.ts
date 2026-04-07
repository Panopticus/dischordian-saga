/* ═══════════════════════════════════════════════════════
   CLIENT PERFORMANCE TRACKER — Measures render times,
   route transitions, long tasks, FPS, and reports
   aggregated metrics for the debug panel.
   ═══════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────

interface RenderSample {
  componentName: string;
  durationMs: number;
  timestamp: number;
}

interface RouteTransition {
  from: string;
  to: string;
  durationMs: number;
  timestamp: number;
}

interface LongTask {
  durationMs: number;
  timestamp: number;
}

interface PageStats {
  avgLoadMs: number;
  maxLoadMs: number;
  visits: number;
}

interface FpsSample {
  fps: number;
  timestamp: number;
  page: string;
}

interface ClientPerformanceReport {
  pageRenderTime: number | null;
  renderSamples: Record<string, { avg: number; max: number; count: number }>;
  routeTransitions: RouteTransition[];
  slowestPages: Array<{ route: string } & PageStats>;
  averageLoadTime: number;
  longTasks: { count: number; totalDurationMs: number; worst: number };
  jankCount: number;
  fps: Record<string, { avg: number; min: number; samples: number }>;
}

// ── Storage ────────────────────────────────────────────

const MAX_SAMPLES = 500;

const renderSamples: RenderSample[] = [];
const routeTransitions: RouteTransition[] = [];
const longTasks: LongTask[] = [];
const fpsSamples: FpsSample[] = [];

let pageRenderTime: number | null = null;
let longTaskObserver: PerformanceObserver | null = null;

// ── Page Render Time (Performance API) ─────────────────

export function measurePageRenderTime(): void {
  if (typeof window === "undefined" || !window.performance) return;

  const measure = () => {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navEntry) {
      pageRenderTime = navEntry.loadEventEnd - navEntry.startTime;
    } else if (performance.timing) {
      // Fallback for older browsers
      const t = performance.timing;
      pageRenderTime = t.loadEventEnd - t.navigationStart;
    }
  };

  if (document.readyState === "complete") {
    measure();
  } else {
    window.addEventListener("load", () => {
      // Defer slightly so loadEventEnd is populated
      requestAnimationFrame(() => measure());
    });
  }
}

// ── Component Render Measurement ───────────────────────

export function measureRender(componentName: string): { start(): void; end(): void } {
  let startTime = 0;

  return {
    start() {
      startTime = performance.now();
    },
    end() {
      if (startTime === 0) return;
      const durationMs = performance.now() - startTime;
      renderSamples.push({
        componentName,
        durationMs,
        timestamp: Date.now(),
      });
      if (renderSamples.length > MAX_SAMPLES) {
        renderSamples.splice(0, renderSamples.length - MAX_SAMPLES);
      }
      startTime = 0;
    },
  };
}

// ── Route Transition Timing ────────────────────────────

let currentRoute = typeof window !== "undefined" ? window.location.pathname : "/";
let navigationStart = 0;

export function trackRouteChange(newRoute: string): void {
  if (typeof window === "undefined") return;

  const prevRoute = currentRoute;
  currentRoute = newRoute;
  navigationStart = performance.now();

  // Wait for first contentful paint after navigation
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "paint" && entry.name === "first-contentful-paint") {
          const durationMs = performance.now() - navigationStart;
          routeTransitions.push({
            from: prevRoute,
            to: newRoute,
            durationMs,
            timestamp: Date.now(),
          });
          if (routeTransitions.length > MAX_SAMPLES) {
            routeTransitions.splice(0, routeTransitions.length - MAX_SAMPLES);
          }
          observer.disconnect();
          return;
        }
      }
    });

    try {
      observer.observe({ type: "paint", buffered: false });
    } catch {
      // paint observer not supported, fall back to rAF timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const durationMs = performance.now() - navigationStart;
          routeTransitions.push({
            from: prevRoute,
            to: newRoute,
            durationMs,
            timestamp: Date.now(),
          });
          if (routeTransitions.length > MAX_SAMPLES) {
            routeTransitions.splice(0, routeTransitions.length - MAX_SAMPLES);
          }
        });
      });
    }
  } else {
    // No PerformanceObserver, use double rAF
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const durationMs = performance.now() - navigationStart;
        routeTransitions.push({
          from: prevRoute,
          to: newRoute,
          durationMs,
          timestamp: Date.now(),
        });
        if (routeTransitions.length > MAX_SAMPLES) {
          routeTransitions.splice(0, routeTransitions.length - MAX_SAMPLES);
        }
      });
    });
  }
}

// ── Long Task Detection (>50ms) ────────────────────────

export function startLongTaskDetection(): void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;
  if (longTaskObserver) return;

  try {
    longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push({
          durationMs: entry.duration,
          timestamp: Date.now(),
        });
        if (longTasks.length > MAX_SAMPLES) {
          longTasks.splice(0, longTasks.length - MAX_SAMPLES);
        }
      }
    });

    longTaskObserver.observe({ type: "longtask", buffered: true });
  } catch {
    // longtask observer not supported in this browser
    longTaskObserver = null;
  }
}

export function stopLongTaskDetection(): void {
  if (longTaskObserver) {
    longTaskObserver.disconnect();
    longTaskObserver = null;
  }
}

// ── FPS Monitor for Canvas-Heavy Pages ─────────────────

let fpsRafId: number | null = null;
let fpsFrameCount = 0;
let fpsLastTime = 0;
let fpsCurrentPage = "";

export function startFpsMonitor(page: string): void {
  if (typeof window === "undefined") return;

  stopFpsMonitor();
  fpsCurrentPage = page;
  fpsFrameCount = 0;
  fpsLastTime = performance.now();

  const tick = () => {
    fpsFrameCount++;
    const now = performance.now();
    const elapsed = now - fpsLastTime;

    // Sample every second
    if (elapsed >= 1000) {
      const fps = Math.round((fpsFrameCount / elapsed) * 1000);
      fpsSamples.push({ fps, timestamp: Date.now(), page: fpsCurrentPage });
      if (fpsSamples.length > MAX_SAMPLES) {
        fpsSamples.splice(0, fpsSamples.length - MAX_SAMPLES);
      }
      fpsFrameCount = 0;
      fpsLastTime = now;
    }

    fpsRafId = requestAnimationFrame(tick);
  };

  fpsRafId = requestAnimationFrame(tick);
}

export function stopFpsMonitor(): void {
  if (fpsRafId !== null) {
    cancelAnimationFrame(fpsRafId);
    fpsRafId = null;
  }
}

// ── Aggregated Client Report ───────────────────────────

export function getClientPerformanceReport(): ClientPerformanceReport {
  // Aggregate render samples by component
  const renderMap = new Map<string, number[]>();
  for (const s of renderSamples) {
    const arr = renderMap.get(s.componentName) || [];
    arr.push(s.durationMs);
    renderMap.set(s.componentName, arr);
  }
  const renderStats: Record<string, { avg: number; max: number; count: number }> = {};
  for (const [name, durations] of renderMap) {
    const sum = durations.reduce((a, b) => a + b, 0);
    renderStats[name] = {
      avg: Math.round((sum / durations.length) * 100) / 100,
      max: Math.round(Math.max(...durations) * 100) / 100,
      count: durations.length,
    };
  }

  // Aggregate route transitions into page stats
  const pageMap = new Map<string, number[]>();
  for (const t of routeTransitions) {
    const arr = pageMap.get(t.to) || [];
    arr.push(t.durationMs);
    pageMap.set(t.to, arr);
  }
  const slowestPages: Array<{ route: string } & PageStats> = [];
  for (const [route, durations] of pageMap) {
    const sum = durations.reduce((a, b) => a + b, 0);
    slowestPages.push({
      route,
      avgLoadMs: Math.round((sum / durations.length) * 100) / 100,
      maxLoadMs: Math.round(Math.max(...durations) * 100) / 100,
      visits: durations.length,
    });
  }
  slowestPages.sort((a, b) => b.avgLoadMs - a.avgLoadMs);

  // Average load time across all transitions
  const allLoadTimes = routeTransitions.map((t) => t.durationMs);
  const averageLoadTime =
    allLoadTimes.length > 0
      ? Math.round((allLoadTimes.reduce((a, b) => a + b, 0) / allLoadTimes.length) * 100) / 100
      : 0;

  // Long task summary
  const totalLongTaskDuration = longTasks.reduce((s, t) => s + t.durationMs, 0);
  const worstLongTask = longTasks.length > 0 ? Math.max(...longTasks.map((t) => t.durationMs)) : 0;

  // Jank count: long tasks that are likely to cause visible stutter (>100ms)
  const jankCount = longTasks.filter((t) => t.durationMs > 100).length;

  // FPS stats by page
  const fpsPageMap = new Map<string, number[]>();
  for (const s of fpsSamples) {
    const arr = fpsPageMap.get(s.page) || [];
    arr.push(s.fps);
    fpsPageMap.set(s.page, arr);
  }
  const fpsStats: Record<string, { avg: number; min: number; samples: number }> = {};
  for (const [page, values] of fpsPageMap) {
    const sum = values.reduce((a, b) => a + b, 0);
    fpsStats[page] = {
      avg: Math.round(sum / values.length),
      min: Math.min(...values),
      samples: values.length,
    };
  }

  return {
    pageRenderTime,
    renderSamples: renderStats,
    routeTransitions: routeTransitions.slice(-20), // Last 20 transitions
    slowestPages: slowestPages.slice(0, 10),
    averageLoadTime,
    longTasks: {
      count: longTasks.length,
      totalDurationMs: Math.round(totalLongTaskDuration),
      worst: Math.round(worstLongTask),
    },
    jankCount,
    fps: fpsStats,
  };
}

// ── Initialization Helper ──────────────────────────────

export function initPerformanceTracking(): void {
  measurePageRenderTime();
  startLongTaskDetection();
}
