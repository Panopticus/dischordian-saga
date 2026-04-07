/* ═══════════════════════════════════════════════════════
   useScrollRestoration — Remembers scroll position per route.
   Restores position when navigating back to a page.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    // Save scroll position for the page we're leaving
    if (prevLocation.current !== location) {
      scrollPositions.set(prevLocation.current, window.scrollY);
      prevLocation.current = location;
    }

    // Restore scroll position for the new page (if we've been here before)
    const saved = scrollPositions.get(location);
    if (saved !== undefined) {
      // Defer to allow layout to settle
      requestAnimationFrame(() => {
        window.scrollTo(0, saved);
      });
    } else {
      // New page — scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);
}
