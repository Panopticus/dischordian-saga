/* ═══════════════════════════════════════════════════════
   USE SWIPE TABS — Swipe gesture navigation between tabs
   Provides touch event handlers and swipe detection for
   tab-based pages on mobile devices.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useRef, useState } from "react";

interface UseSwipeTabsOptions {
  /** Total number of tabs */
  tabCount: number;
  /** Current active tab index (0-based) */
  activeIndex: number;
  /** Callback when tab changes */
  onTabChange: (index: number) => void;
  /** Minimum swipe distance in px to trigger tab change (default: 50) */
  threshold?: number;
  /** Whether swipe is enabled (default: true) */
  enabled?: boolean;
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeTabsReturn {
  /** Touch event handlers to spread on the container */
  handlers: SwipeHandlers;
  /** Current swipe offset in px (for visual feedback) */
  swipeOffset: number;
  /** Whether a swipe is currently in progress */
  isSwiping: boolean;
  /** CSS style for the swipe transition container */
  swipeStyle: React.CSSProperties;
}

export function useSwipeTabs({
  tabCount,
  activeIndex,
  onTabChange,
  threshold = 50,
  enabled = true,
}: UseSwipeTabsOptions): UseSwipeTabsReturn {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isHorizontalSwipe.current = null;
    setIsSwiping(false);
    setSwipeOffset(0);
  }, [enabled]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }

    // Only track horizontal swipes
    if (!isHorizontalSwipe.current) return;

    // Prevent vertical scroll during horizontal swipe
    e.preventDefault();

    setIsSwiping(true);

    // Apply resistance at edges
    let offset = dx;
    if ((activeIndex === 0 && dx > 0) || (activeIndex === tabCount - 1 && dx < 0)) {
      offset = dx * 0.3; // Rubber band effect at edges
    }

    setSwipeOffset(offset);
  }, [enabled, activeIndex, tabCount]);

  const onTouchEnd = useCallback(() => {
    if (!enabled || !isSwiping) {
      setSwipeOffset(0);
      setIsSwiping(false);
      return;
    }

    const elapsed = Date.now() - touchStart.current.time;
    const velocity = Math.abs(swipeOffset) / elapsed;

    // Trigger tab change if threshold met or fast swipe
    if (Math.abs(swipeOffset) > threshold || velocity > 0.5) {
      if (swipeOffset > 0 && activeIndex > 0) {
        onTabChange(activeIndex - 1);
      } else if (swipeOffset < 0 && activeIndex < tabCount - 1) {
        onTabChange(activeIndex + 1);
      }
    }

    setSwipeOffset(0);
    setIsSwiping(false);
    isHorizontalSwipe.current = null;
  }, [enabled, isSwiping, swipeOffset, threshold, activeIndex, tabCount, onTabChange]);

  const swipeStyle: React.CSSProperties = {
    transform: isSwiping ? `translateX(${swipeOffset}px)` : "translateX(0)",
    transition: isSwiping ? "none" : "transform 0.3s ease-out",
  };

  return {
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    swipeOffset,
    isSwiping,
    swipeStyle,
  };
}
