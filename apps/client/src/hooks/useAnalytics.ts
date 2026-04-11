/* ═══════════════════════════════════════════════════════
   useAnalytics — React hook for player analytics
   Auto-tracks page views and session lifecycle.
   Respects the browser "Do Not Track" setting.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  trackEvent,
  trackPageView,
  trackTiming,
  startSession,
  endSession,
  GameEvents,
} from "../lib/analytics";

/** Check if the user has opted out via Do Not Track */
function isDoNotTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";
}

/**
 * Hook that wires analytics into the React lifecycle.
 *
 * - Starts a session on mount, ends on unmount
 * - Tracks page views on route changes (wouter)
 * - Provides a `track()` function for component-level events
 * - No-ops entirely when Do Not Track is enabled
 */
export function useAnalytics() {
  const [location] = useLocation();
  const dntRef = useRef(isDoNotTrack());
  const sessionActiveRef = useRef(false);

  // Start session on mount
  useEffect(() => {
    if (dntRef.current) return;

    startSession();
    sessionActiveRef.current = true;

    return () => {
      if (sessionActiveRef.current) {
        endSession();
        sessionActiveRef.current = false;
      }
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (dntRef.current) return;
    trackPageView(location);
  }, [location]);

  // Memoized tracking function for components
  const track = useCallback(
    (event: string, properties?: Record<string, string | number | boolean>) => {
      if (dntRef.current) return;
      trackEvent(event, properties);
    },
    [],
  );

  // Memoized timing helper
  const time = useCallback((category: string, durationMs: number) => {
    if (dntRef.current) return;
    trackTiming(category, durationMs);
  }, []);

  return {
    track,
    time,
    GameEvents,
    /** True when tracking is disabled (DNT is on) */
    disabled: dntRef.current,
  };
}
