/* ═══════════════════════════════════════════════════════
   SCROLL INDICATOR — Gradient edge fades for horizontal
   scroll containers. Wraps children in a relative container
   and shows left/right gradient overlays when content
   overflows in that direction.
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  children: ReactNode;
  className?: string;
  /** Width of gradient fade in px. Default 32 */
  fadeWidth?: number;
  /** Color of gradient (CSS color, should match background). Default uses bg via CSS var */
  fadeColor?: string;
}

export default function ScrollIndicator({
  children,
  className,
  fadeWidth = 32,
  fadeColor,
}: ScrollIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  // Build gradient color string — fallback to dark bg
  const color = fadeColor || "hsl(var(--background))";
  const gradientLeft = `linear-gradient(to right, ${color} 0%, transparent 100%)`;
  const gradientRight = `linear-gradient(to left, ${color} 0%, transparent 100%)`;

  return (
    <div className={cn("relative", className)}>
      {/* Left fade */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{ width: fadeWidth, background: gradientLeft }}
          aria-hidden
        />
      )}

      {/* Scrollable content — find the first overflow-x-auto child or use ref directly */}
      <div ref={containerRef} className="overflow-x-auto">
        {children}
      </div>

      {/* Right fade */}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{ width: fadeWidth, background: gradientRight }}
          aria-hidden
        />
      )}
    </div>
  );
}
