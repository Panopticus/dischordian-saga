import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── CDN ASSETS ─── */
const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

/* ─── HOLOGRAPHIC ELARA ───
   Animated holographic avatar that appears during dialog.
   Uses CSS animations for hologram effects:
   - Scan lines sweeping vertically
   - Color channel split (chromatic aberration)
   - Flicker/glitch effect
   - Floating particle field
   - Glow pulse synchronized with speech
─── */

interface HolographicElaraProps {
  /** Whether Elara is currently "speaking" (triggers mouth/glow animation) */
  isSpeaking?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional video URL for Kling 3.0 generated hologram */
  videoUrl?: string;
  /** Show/hide the hologram */
  visible?: boolean;
  /** Optional className override */
  className?: string;
}

const SIZES = {
  sm: { container: 80, image: 72 },
  md: { container: 120, image: 108 },
  lg: { container: 180, image: 160 },
};

export default function HolographicElara({
  isSpeaking = false,
  size = "md",
  videoUrl,
  visible = true,
  className = "",
}: HolographicElaraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const dims = SIZES[size];

  // Particle field
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * dims.container,
      y: Math.random() * dims.container,
      size: 0.5 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [dims.container]);

  // Animate particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    const animate = () => {
      t += 0.02;
      ctx.clearRect(0, 0, dims.container, dims.container);

      for (const p of particles) {
        const y = (p.y - p.speed * t * 30) % dims.container;
        const adjustedY = y < 0 ? y + dims.container : y;
        const flicker = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);

        ctx.beginPath();
        ctx.arc(p.x, adjustedY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(51, 226, 230, ${p.opacity * flicker})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dims.container, particles]);

  // Glitch timing
  const [glitchActive, setGlitchActive] = useState(false);
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 2000 + Math.random() * 5000;
      const timer = setTimeout(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 80 + Math.random() * 120);
        scheduleGlitch();
      }, delay);
      return timer;
    };
    const timer = scheduleGlitch();
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative inline-flex items-center justify-center ${className}`}
          style={{ width: dims.container, height: dims.container }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(51,226,230,${isSpeaking ? 0.25 : 0.1}) 0%, transparent 70%)`,
              animation: isSpeaking ? "holoPulse 1s ease-in-out infinite" : "holoPulse 3s ease-in-out infinite",
            }}
          />

          {/* Holographic base ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: dims.image + 12,
              height: dims.image + 12,
              left: (dims.container - dims.image - 12) / 2,
              top: (dims.container - dims.image - 12) / 2,
              border: "1px solid rgba(51,226,230,0.3)",
              boxShadow: `0 0 15px rgba(51,226,230,${isSpeaking ? 0.4 : 0.15}), inset 0 0 15px rgba(51,226,230,${isSpeaking ? 0.2 : 0.05})`,
              animation: "holoRotate 8s linear infinite",
            }}
          />

          {/* Secondary ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: dims.image + 20,
              height: dims.image + 20,
              left: (dims.container - dims.image - 20) / 2,
              top: (dims.container - dims.image - 20) / 2,
              border: "1px dashed rgba(51,226,230,0.15)",
              animation: "holoRotateReverse 12s linear infinite",
            }}
          />

          {/* Main image container with holographic effects */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: dims.image,
              height: dims.image,
              filter: glitchActive
                ? "hue-rotate(90deg) saturate(2) brightness(1.5)"
                : "none",
              transition: glitchActive ? "none" : "filter 0.1s",
            }}
          >
            {/* Video or image */}
            {videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.1) contrast(1.1) saturate(0.8)",
                  mixBlendMode: "screen",
                }}
              />
            ) : (
              <img
                src={ELARA_PORTRAIT}
                alt="Elara"
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.1) contrast(1.1) saturate(0.8)",
                }}
              />
            )}

            {/* Holographic tint overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(51,226,230,0.1) 0%, rgba(51,226,230,0.05) 50%, rgba(51,226,230,0.15) 100%)",
                mixBlendMode: "overlay",
              }}
            />

            {/* Scan line sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,226,230,0.06) 2px, rgba(51,226,230,0.06) 4px)",
              }}
            />

            {/* Moving scan bar */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: 3,
                background: "linear-gradient(90deg, transparent, rgba(51,226,230,0.4), transparent)",
                animation: "holoScan 2.5s linear infinite",
              }}
            />

            {/* Chromatic aberration layers (on glitch) */}
            {glitchActive && (
              <>
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    transform: "translateX(2px)",
                    opacity: 0.5,
                    mixBlendMode: "screen",
                  }}
                >
                  <img
                    src={ELARA_PORTRAIT}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: "hue-rotate(120deg) saturate(3)" }}
                  />
                </div>
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    transform: "translateX(-2px)",
                    opacity: 0.5,
                    mixBlendMode: "screen",
                  }}
                >
                  <img
                    src={ELARA_PORTRAIT}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: "hue-rotate(240deg) saturate(3)" }}
                  />
                </div>
              </>
            )}

            {/* Speaking indicator - mouth glow */}
            {isSpeaking && (
              <div
                className="absolute bottom-[20%] left-[30%] right-[30%] rounded-full"
                style={{
                  height: 4,
                  background: "rgba(51,226,230,0.6)",
                  filter: "blur(3px)",
                  animation: "holoSpeak 0.15s ease-in-out infinite alternate",
                }}
              />
            )}
          </div>

          {/* Particle canvas overlay */}
          <canvas
            ref={canvasRef}
            width={dims.container}
            height={dims.container}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.6 }}
          />

          {/* Data readout ring */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={dims.container}
            height={dims.container}
            viewBox={`0 0 ${dims.container} ${dims.container}`}
          >
            <circle
              cx={dims.container / 2}
              cy={dims.container / 2}
              r={dims.image / 2 + 8}
              fill="none"
              stroke="rgba(51,226,230,0.2)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              style={{ animation: "holoRotate 15s linear infinite" }}
            />
            {/* Data ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const r = dims.image / 2 + 8;
              const cx = dims.container / 2;
              const cy = dims.container / 2;
              return (
                <line
                  key={i}
                  x1={cx + (r - 3) * Math.cos(angle)}
                  y1={cy + (r - 3) * Math.sin(angle)}
                  x2={cx + (r + 2) * Math.cos(angle)}
                  y2={cy + (r + 2) * Math.sin(angle)}
                  stroke="rgba(51,226,230,0.3)"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          {/* Status label */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-2 py-0.5 rounded-full bg-background/80 border border-[rgba(51,226,230,0.3)]">
              <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: "rgba(51,226,230,0.8)" }}>
                {isSpeaking ? "◉ TRANSMITTING" : "◎ STANDBY"}
              </span>
            </div>
          </div>

          {/* CSS Keyframes */}
          <style>{`
            @keyframes holoPulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
            @keyframes holoRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes holoRotateReverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes holoScan {
              0% { top: -5%; }
              100% { top: 105%; }
            }
            @keyframes holoSpeak {
              0% { height: 2px; opacity: 0.4; }
              100% { height: 6px; opacity: 0.8; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
