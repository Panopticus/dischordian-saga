/**
 * Page-visibility utilities.
 *
 * Browsers throttle background tabs aggressively (timers run at most
 * once per second on most engines). RAF loops in hidden tabs
 * accumulate work that drains battery without rendering. These
 * helpers let the rest of the codebase pause cleanly.
 *
 *   useIsTabVisible() — React hook for visibility state.
 *   onVisible(cb) / onHidden(cb) — vanilla subscribers.
 *
 * Pair with the wsClient (G13) which already triggers an immediate
 * reconnect on visibilitychange.
 */
import { useEffect, useState } from "react";

export function isTabVisible(): boolean {
  if (typeof document === "undefined") return true;
  return !document.hidden;
}

export function useIsTabVisible(): boolean {
  const [visible, setVisible] = useState<boolean>(() => isTabVisible());
  useEffect(() => {
    const handler = () => setVisible(isTabVisible());
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
  return visible;
}

/** Subscribe to "tab is hidden" transitions. Returns an unsubscribe. */
export function onHidden(cb: () => void): () => void {
  const handler = () => {
    if (document.hidden) cb();
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}

/** Subscribe to "tab is visible" transitions. Returns an unsubscribe. */
export function onVisible(cb: () => void): () => void {
  const handler = () => {
    if (!document.hidden) cb();
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}

/**
 * Wrap a requestAnimationFrame loop so it pauses while the tab is
 * hidden. The callback receives the delta-ms since the last
 * **visible** frame so animations don't jump.
 *
 * Usage:
 *   const stop = visibilityAwareRaf((dt) => {
 *     world.step(dt);
 *     renderer.render();
 *   });
 *   // ...
 *   stop();
 */
export function visibilityAwareRaf(cb: (dtMs: number) => void): () => void {
  let raf = 0;
  let lastVisibleAt = performance.now();
  let stopped = false;

  const tick = (now: number) => {
    if (stopped) return;
    raf = requestAnimationFrame(tick);
    if (typeof document !== "undefined" && document.hidden) {
      lastVisibleAt = now;
      return;
    }
    const dt = Math.max(0, now - lastVisibleAt);
    lastVisibleAt = now;
    try {
      cb(dt);
    } catch (err) {
      // Don't kill the RAF loop on a single bad frame; surface the
      // error to console but keep going.
      console.error("[visibilityAwareRaf] tick threw:", err);
    }
  };
  raf = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
  };
}
