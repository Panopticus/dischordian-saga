/* ═══════════════════════════════════════════════════════
   useOrientation — Task 3.3

   React hook that tracks the current viewport orientation
   and exposes a helper for game pages that require a
   specific orientation (fight, card game, card drafting).

   Usage:
     const { isPortrait, isLandscape } = useOrientation();

     if (isPortrait) return <RotateDevicePrompt />;

   Or, declaratively, with the companion component:
     <RequireLandscape>
       <FightArena />
     </RequireLandscape>

   Listens to both `resize` and the `orientationchange`
   event for iOS / older Android. Skips window access on
   the server so it's SSR-safe.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState, type ReactNode } from "react";

export type Orientation = "portrait" | "landscape";

export interface OrientationState {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
  /** Window inner width at the time of the most recent measurement. */
  width: number;
  /** Window inner height at the time of the most recent measurement. */
  height: number;
}

function readOrientation(): OrientationState {
  if (typeof window === "undefined") {
    return { orientation: "portrait", isPortrait: true, isLandscape: false, width: 0, height: 0 };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height >= width;
  return {
    orientation: isPortrait ? "portrait" : "landscape",
    isPortrait,
    isLandscape: !isPortrait,
    width,
    height,
  };
}

export function useOrientation(): OrientationState {
  const [snapshot, setSnapshot] = useState<OrientationState>(readOrientation);

  const update = useCallback(() => {
    setSnapshot(readOrientation());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    // Force one re-read on mount in case the initial SSR value was stale
    update();
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [update]);

  return snapshot;
}

/* ─── REQUIRE-LANDSCAPE WRAPPER ─── */

export interface RequireLandscapeProps {
  children: ReactNode;
  /** Custom prompt shown when the device is in portrait. */
  fallback?: ReactNode;
  /**
   * Minimum viewport width below which the landscape check is
   * enforced. Above this breakpoint (tablet+) we assume the UI
   * can handle either orientation. Defaults to 900 px.
   */
  minWidthBypass?: number;
}

/**
 * Game-page wrapper that renders a "rotate your device" prompt
 * on portrait phones. Use on pages like FightArena, CardBattle,
 * and DuelystGame that require landscape for playability.
 */
export function RequireLandscape({
  children,
  fallback,
  minWidthBypass = 900,
}: RequireLandscapeProps) {
  const { isPortrait, width } = useOrientation();

  // Tablet / desktop always renders children
  if (width >= minWidthBypass) return <>{children}</>;
  if (!isPortrait) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6">
      <div className="max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-20 w-12 rounded-md border-2 border-amber-400 relative">
            <div className="absolute -top-1 left-1/2 h-1 w-6 -translate-x-1/2 bg-amber-400 rounded" />
            <div className="absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-amber-400" />
          </div>
        </div>
        <p className="font-display text-lg font-bold tracking-wider text-amber-400 mb-2">
          ROTATE DEVICE
        </p>
        <p className="font-mono text-xs text-amber-400/60 leading-relaxed">
          This page is built for landscape orientation. Turn your phone sideways to continue.
        </p>
      </div>
    </div>
  );
}

export default useOrientation;
