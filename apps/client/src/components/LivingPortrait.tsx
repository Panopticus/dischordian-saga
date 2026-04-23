/* ═══════════════════════════════════════════════════════
   LIVING PORTRAIT — Companion portrait chamber

   Wraps AnimatedPortrait with three ambient layers so the
   Companion Hub reads as a BioWare-tier "room with a soul
   in it" rather than a 2D bust in a box:

     Layer 0 (back)   Radial glow backdrop, gently breathing
                      on --audio-bass. Companion-themed color.
     Layer 1 (mid)    AnimatedPortrait — the existing 2D bust
                      with the trustLevel filter + blink.
                      Picks up a subtle mouse-driven tilt so
                      the figure feels like it's standing in
                      3D space.
     Layer 2 (front)  12 themed particles drifting upward
                      (cyan data-motes for Elara, warm
                      "dust in shaft-of-light" for The Human).
                      Also nudged by mouse position.

   All three layers honor:
     html.reduce-motion      → static portrait, no particles.
     --motion-intensity (0-1) → scales drift + tilt magnitude.
     --audio-bass (0-1)      → pulses backdrop glow brightness.

   Why a bespoke component and not reuse ParallaxRoom? This
   surface has ONE image (the portrait) plus generative layers,
   not a stack of authored art files. ParallaxRoom's multi-
   layer image model doesn't fit; a custom container is 80
   lines and avoids forcing the portrait URL through the
   layer-array shape.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef } from "react";
import { AnimatedPortrait } from "@/components/AnimatedPortrait";
import { getMotionIntensity } from "@/engine/motionIntensity";

interface LivingPortraitProps {
  /** NPC id passed through to AnimatedPortrait. */
  npcId: string;
  /** 0–100 affinity; drives tint + portrait filter. */
  trustLevel: number;
  /** Pulses portrait brightness when true (AnimatedPortrait behavior). */
  isSpeaking?: boolean;
  /** Companion theme color. Defaults read from props. */
  accentColor: string;
  /** Tuning knob for downstream screens that want a quieter chamber. */
  className?: string;
}

/**
 * Particle palette for the two active companions. Elara is the ship's
 * holographic sys-admin — cyan data motes read as "conscious lattice."
 * The Human is on the other extreme: grounded, mortal, dust motes in
 * a shaft of light. If future companions ship we'll add entries here.
 */
function particlePaletteFor(npcId: string, fallback: string): string[] {
  const id = npcId.toLowerCase().replace(/[- ]/g, "_");
  if (id === "elara") return ["#33E2E6", "#64F0F4", "#A7F6F8"];
  if (id === "the_human") return ["#F5BF24", "#FFD96A", "#E8A862"];
  return [fallback, fallback, fallback];
}

const PARTICLE_COUNT = 12;

export default function LivingPortrait({
  npcId,
  trustLevel,
  isSpeaking = false,
  accentColor,
  className = "",
}: LivingPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const palette = useMemo(
    () => particlePaletteFor(npcId, accentColor),
    [npcId, accentColor],
  );

  // Deterministic particle placements so the same companion looks
  // consistent across renders — a random re-shuffle on every mount
  // would read as a page glitch, not an ambient room.
  const particles = useMemo(() => {
    const seed = hashString(npcId);
    const rand = mulberry32(seed);
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * 14,
      duration: 12 + rand() * 10,
      size: 2 + rand() * 3,
      color: palette[i % palette.length],
    }));
  }, [npcId, palette]);

  // Mouse tilt loop. Target updated on mousemove / gyro; current
  // lerps toward target for buttery motion. Zero-allocation per
  // frame — crucial for the iPhone 60fps budget.
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRef.current = { x: nx, y: ny };
    };
    const onMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      const intensity = getMotionIntensity();
      // Ease toward target. Tighter lerp = snappier but twitchier;
      // 0.08 matches ParallaxRoom's tuning, which players are
      // already conditioned to.
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;

      if (intensity === 0) {
        inner.style.transform = "none";
      } else {
        // Tilt amplitude intentionally tiny — 4° max — so the figure
        // reads as "standing" not "levitating in a centrifuge."
        const rx = -currentRef.current.y * 4 * intensity;
        const ry = currentRef.current.x * 4 * intensity;
        const tx = currentRef.current.x * 6 * intensity;
        inner.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        // The chamber has its own border so it reads as a contained
        // space even when the surrounding tab isn't using a card.
        border: `1px solid color-mix(in oklch, ${accentColor} 22%, transparent)`,
        background: `radial-gradient(ellipse at 50% 60%, color-mix(in oklch, ${accentColor} 12%, transparent) 0%, transparent 70%)`,
      }}
    >
      {/* Layer 0 — breathing backdrop glow */}
      <div
        aria-hidden
        className="living-portrait__glow absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, color-mix(in oklch, ${accentColor} 28%, transparent) 0%, transparent 65%)`,
        }}
      />

      {/* Layer 1 — tilted portrait */}
      <div
        ref={innerRef}
        className="relative z-10"
        style={{ transformStyle: "preserve-3d", transition: "transform 40ms linear" }}
      >
        <AnimatedPortrait
          npcId={npcId}
          trustLevel={trustLevel}
          isSpeaking={isSpeaking}
          expression="neutral"
          size="bust"
          className="mx-auto"
        />
      </div>

      {/* Layer 2 — themed particles (keyframe-driven; no JS per frame) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {particles.map((p) => (
          <span
            key={p.id}
            className="living-portrait__particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${-p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Deterministic PRNG helpers (mirror KineticText's pattern) ─── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}
