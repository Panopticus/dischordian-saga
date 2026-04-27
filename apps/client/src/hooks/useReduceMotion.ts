/**
 * useReduceMotion — derives the effective reduce-motion state from
 * two sources:
 *
 *   1. The user-facing `reduceMotion` setting (mirrored as the
 *      `html.reduce-motion` class via apps/client/src/lib/settingsSync.ts).
 *   2. The OS-level `prefers-reduced-motion: reduce` media query.
 *
 * If either is on, the hook returns true. Components and the
 * top-level `MotionConfig` wrapper use this to gate JS-driven
 * animations (Framer Motion, Pixi/Three loops). CSS-driven
 * animations are handled separately by the `html.reduce-motion *`
 * rules in `apps/client/src/index.css`.
 *
 * The hook subscribes to:
 *   - `MutationObserver` on `<html>`'s class list (for in-app
 *     toggles via Settings → applySettingsToDOM)
 *   - `matchMedia.change` (for OS-level preference changes)
 *
 * Both subscriptions are cleaned up on unmount. The hook is safe
 * to call during SSR (returns `false` until hydration).
 */
import { useEffect, useState } from "react";

const PREFERS_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REDUCE_MOTION_CLASS = "reduce-motion";

function readInitial(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const classOn = document.documentElement.classList.contains(REDUCE_MOTION_CLASS);
  if (classOn) return true;
  const mq = window.matchMedia?.(PREFERS_REDUCED_MOTION_QUERY);
  return mq?.matches ?? false;
}

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(readInitial);

  useEffect(() => {
    const html = document.documentElement;

    function recompute(): void {
      const classOn = html.classList.contains(REDUCE_MOTION_CLASS);
      const mqMatches = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches;
      setReduce(classOn || mqMatches);
    }

    // Class observer — fires when settingsSync toggles the class.
    const observer = new MutationObserver(recompute);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    // Media-query observer — fires on OS-level preference changes.
    const mq = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY);
    mq.addEventListener("change", recompute);

    // Run once after mount in case the initial read missed an
    // event between SSR and hydration.
    recompute();

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", recompute);
    };
  }, []);

  return reduce;
}
