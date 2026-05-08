/**
 * LivingBackground — Reusable immersive art background with ambient effects.
 *
 * Drop this behind any page content for:
 * - Art image with configurable opacity
 * - Ken Burns slow drift animation
 * - Ambient color glow pulse
 * - CRT scanline overlay
 * - Floating particles in accent color
 * - Vignette for text readability
 * - Void Energy atmosphere push/pop
 */
import { useEffect } from "react";
import { getAtmosphereForRoom, applyThemeToDOM } from "@/engine/voidEngine";

interface LivingBackgroundProps {
  /** Path to the art image */
  src: string;
  /** Accent color for particles + glow (hex) */
  accent?: string;
  /** Image opacity (0-1, default 0.2) */
  opacity?: number;
  /** Drift animation duration in seconds (default 25) */
  driftSpeed?: number;
  /** Number of floating particles (default 12, 0 to disable) */
  particleCount?: number;
  /** Pulse animation duration in seconds (default 4) */
  pulseSpeed?: number;
  /** Show CRT scanlines (default true) */
  scanlines?: boolean;
  /** Void Energy room key to push (optional) */
  voidRoomKey?: string;
  /** Image filter override */
  filter?: string;
  /** Extra className on container */
  className?: string;
}

export default function LivingBackground({
  src,
  accent = "var(--energy-primary)",
  opacity = 0.2,
  driftSpeed = 25,
  particleCount = 12,
  pulseSpeed = 4,
  scanlines = true,
  voidRoomKey,
  filter,
  className = "",
}: LivingBackgroundProps) {
  // Void Energy atmosphere push/pop
  useEffect(() => {
    if (!voidRoomKey) return;
    const atmosphere = getAtmosphereForRoom(voidRoomKey);
    const prev = document.documentElement.dataset.atmosphere;
    if (atmosphere) applyThemeToDOM(atmosphere);
    return () => { if (prev) applyThemeToDOM(prev); };
  }, [voidRoomKey]);

  const uid = src.replace(/[^a-z0-9]/gi, "").slice(0, 8);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Art image with drift */}
      <img
        src={src}
        alt=""
        className={`lb-drift-${uid}`}
        style={{
          position: "absolute",
          width: "115%",
          height: "115%",
          top: "-7.5%",
          left: "-7.5%",
          objectFit: "cover",
          opacity,
          filter: filter || "brightness(0.5) saturate(0.8)",
        }}
      />

      {/* Ambient glow pulse */}
      <div
        className={`absolute inset-0 lb-pulse-${uid}`}
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${accent}10 0%, transparent 60%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, color-mix(in oklch, var(--bg-void) 70%, transparent) 100%)",
        }}
      />

      {/* Gradient fade bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, color-mix(in oklch, var(--bg-void) 20%, transparent) 0%, color-mix(in oklch, var(--bg-void) 60%, transparent) 100%)",
        }}
      />

      {/* Scanlines */}
      {scanlines && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 4px)",
          }}
        />
      )}

      {/* Floating particles */}
      {particleCount > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full lb-particle-${uid}`}
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                background: accent,
                opacity: 0.1 + Math.random() * 0.2,
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
                animationDuration: `${4 + i * 0.5}s`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes lb-drift-${uid} {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-1.5%, -1%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes lb-pulse-${uid} {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes lb-particle-${uid} {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          50% { transform: translateY(-25px) translateX(8px); opacity: 0.35; } /* void-ignore */
        }
        .lb-drift-${uid} { animation: lb-drift-${uid} ${driftSpeed}s ease-in-out infinite; }
        .lb-pulse-${uid} { animation: lb-pulse-${uid} ${pulseSpeed}s ease-in-out infinite; }
        .lb-particle-${uid} { animation: lb-particle-${uid} 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
