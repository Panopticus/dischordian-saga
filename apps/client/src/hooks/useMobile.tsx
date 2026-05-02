import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/**
 * M10 — true when the user's primary input is a coarse pointer (touch).
 *
 * Distinct from `useIsMobile()` which checks viewport width — a 13-inch
 * iPad in landscape is a touch device but not "mobile" by the 768px
 * breakpoint. Anywhere the UI needs to choose between hover-tooltips
 * and tap-on-press affordances, prefer this hook over `useIsMobile()`.
 *
 * Uses the `(pointer: coarse)` media query — implemented by every
 * shipping browser back to 2017. Subscribes to the matcher so a user
 * who plugs in / unplugs a Bluetooth mouse on iPadOS gets reactive
 * UI updates.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(pointer: coarse)");
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener("change", onChange);
    setIsTouch(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
