/* ═══════════════════════════════════════════════════════
   LANDSCAPE ENFORCER — Immersive rotate-device prompt
   Shows a sci-fi themed overlay in portrait mode on mobile,
   or optionally CSS-rotates the content.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, type ReactNode } from "react";
import { RotateCcw, Smartphone, MonitorSmartphone } from "lucide-react";

interface LandscapeEnforcerProps {
  children: ReactNode;
  /** If true, force-rotates the content via CSS instead of showing overlay */
  forceRotate?: boolean;
  /** Custom message for the rotate overlay */
  message?: string;
}

export default function LandscapeEnforcer({ children, forceRotate = false, message }: LandscapeEnforcerProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
      // Auto-dismiss when user rotates to landscape
      if (!portrait) setDismissed(false);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", () => {
      // Small delay for orientation change to settle
      setTimeout(check, 100);
    });

    // Try to lock orientation via Screen Orientation API
    try {
      const orientation = (screen as any).orientation;
      if (orientation?.lock) {
        orientation.lock("landscape").catch(() => {});
      }
    } catch { /* Not supported */ }

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
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

  // Mobile + portrait + dismissed: let them through (with a small reminder)
  if (dismissed) {
    return (
      <>
        {children}
        {/* Small floating reminder */}
        <button
          onClick={() => setDismissed(false)}
          className="fixed bottom-4 right-4 z-[9998] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-background/90 backdrop-blur-sm text-primary/70 font-mono text-[10px] tracking-wider hover:bg-primary/10 transition-all"
          style={{ boxShadow: "0 0 12px rgba(51,226,230,0.1)" }}
        >
          <RotateCcw size={10} />
          ROTATE
        </button>
      </>
    );
  }

  // Mobile + portrait: show immersive overlay
  return (
    <>
      {children}
      <div
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-8"
        style={{
          background: "radial-gradient(ellipse at center, rgba(10,22,40,0.97) 0%, rgba(3,5,8,0.99) 100%)",
        }}
      >
        {/* Grid background effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(51,226,230,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(51,226,230,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Animated phone icon */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: 120,
                height: 120,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(51,226,230,0.15) 0%, transparent 70%)",
                animation: "landscape-pulse 2s ease-in-out infinite",
              }}
            />
            {/* Phone with rotation animation */}
            <div
              style={{
                animation: "phone-rotate 3s ease-in-out infinite",
              }}
            >
              <Smartphone
                size={56}
                strokeWidth={1.5}
                className="text-primary"
              />
            </div>
          </div>

          {/* Text content */}
          <div className="text-center space-y-3">
            <div className="flex items-center gap-2 justify-center">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="font-mono text-[9px] text-primary/60 tracking-[0.4em]">SYSTEM NOTICE</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-wider text-foreground">
              ROTATE YOUR <span className="text-primary" style={{ textShadow: "0 0 8px rgba(51,226,230,0.4)" }}>DEVICE</span>
            </h2>
            <p className="font-mono text-xs text-muted-foreground max-w-[280px] leading-relaxed">
              {message || "This experience is optimized for landscape orientation. Rotate your device for the best view."}
            </p>
          </div>

          {/* Landscape icon hint */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-md border border-primary/20 bg-primary/5">
            <MonitorSmartphone size={16} className="text-primary/70" />
            <span className="font-mono text-[10px] text-primary/70 tracking-[0.15em]">LANDSCAPE MODE REQUIRED</span>
          </div>

          {/* Continue anyway button */}
          <button
            onClick={() => setDismissed(true)}
            className="font-mono text-[10px] text-muted-foreground/40 tracking-wider hover:text-muted-foreground/70 transition-colors mt-4"
          >
            CONTINUE IN PORTRAIT →
          </button>
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes phone-rotate {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            50% { transform: rotate(-90deg); }
            75% { transform: rotate(-90deg); }
          }
          @keyframes landscape-pulse {
            0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.15); }
          }
        `}</style>
      </div>
    </>
  );
}
