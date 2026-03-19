/* ═══════════════════════════════════════════════════════
   LANDSCAPE ENFORCER — Forces landscape for fight game
   Shows a "rotate your phone" overlay in portrait mode
   and uses CSS transform to rotate content on mobile.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, type ReactNode } from "react";
import { RotateCcw, Smartphone } from "lucide-react";

interface LandscapeEnforcerProps {
  children: ReactNode;
  /** If true, force-rotates the content via CSS instead of just showing an overlay */
  forceRotate?: boolean;
}

export default function LandscapeEnforcer({ children, forceRotate = true }: LandscapeEnforcerProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    // Also try to lock orientation via Screen Orientation API
    try {
      const orientation = (screen as any).orientation;
      if (orientation?.lock) {
        orientation.lock("landscape").catch(() => {
          // Silently fail — not all browsers support this
        });
      }
    } catch {
      // Not supported
    }

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      // Unlock orientation when leaving
      try {
        const orientation = (screen as any).orientation;
        if (orientation?.unlock) orientation.unlock();
      } catch { /* silent */ }
    };
  }, []);

  // Desktop or already landscape — render normally
  if (!isMobile || !isPortrait) {
    return <>{children}</>;
  }

  // Mobile + portrait + forceRotate: CSS-rotate the entire content
  if (forceRotate) {
    return (
      <div
        className="fixed inset-0 z-[9999]"
        style={{
          width: "100vh",
          height: "100vw",
          transform: "rotate(90deg) translateY(-100%)",
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  // Mobile + portrait + no forceRotate: show overlay
  return (
    <>
      {children}
      <div
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 p-8"
        style={{
          background: "radial-gradient(ellipse at center, #0a1628 0%, #030508 100%)",
        }}
      >
        <div className="relative">
          <Smartphone
            size={64}
            className="text-primary animate-pulse"
            style={{
              animation: "rotate-phone 2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="text-center">
          <h2 className="font-display text-lg font-bold tracking-wider text-foreground mb-2">
            ROTATE YOUR DEVICE
          </h2>
          <p className="font-mono text-xs text-muted-foreground max-w-xs leading-relaxed">
            The Collector's Arena requires landscape orientation for the best combat experience.
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary/50">
          <RotateCcw size={14} />
          <span className="font-mono text-[10px] tracking-wider">LANDSCAPE MODE REQUIRED</span>
        </div>
      </div>
    </>
  );
}
