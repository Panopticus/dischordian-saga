/* ═══════════════════════════════════════════════════════
   ROOM AMBIENT LIFE — per-room CSS-only atmosphere overlays

   The Ark Explorer is the game's most-visited surface, and
   until now every room rendered as a static parallax image
   plus hotspots. This overlay adds a thin "the ship is
   breathing" layer — cryo condensation, bridge star drift,
   engineering heat haze, medical diagnostic pulse, library
   dust motes — so each room reads as a different _space_
   rather than a different backdrop.

   Why not per-room RAF loops? Every effect here is
   keyframe-driven CSS animation over a small pool of
   composited spans. Zero JS per frame. Respects
   --motion-intensity for durations and reduce-motion
   for "animation: none." Safe on iPhone 60fps.

   Adding a new room:
     1. Pick a visual vocabulary (rising particles, scanline
        sweep, horizontal drift, etc.).
     2. Add a `case` below that returns the JSX + a CSS
        block in index.css under the `ark-ambient-*` family.

   Rooms intentionally NOT overlaid:
     - hallways and connector rooms — they read as transit,
       not destinations. Adding atmosphere there would visually
       spam the player.
   ═══════════════════════════════════════════════════════ */
import { memo, useMemo, type CSSProperties } from "react";
import type { RoomTier } from "@shared/roomTier";

interface RoomAmbientLifeProps {
  /** Room id from RoomDef (e.g. "cryo-bay", "bridge"). Unknown ids render nothing. */
  roomId: string;
  /** LucasArts spine tier (apps/shared/roomTier.ts). Drives particle
   *  count + glow intensity so a Dormant room reads as sparse / failing
   *  and a Restored room reads as fully alive. Defaults to 0 so callers
   *  that don't yet pass tier still get the legacy density. */
  tier?: RoomTier;
}

/** Particle-count multiplier per tier. The base counts in
 *  overlayForRoom() are tuned for Tier 2 (Activated, the default
 *  full-population read), so Tier 0/1 thin out and Tier 3 swells. */
const TIER_PARTICLE_MULT: Readonly<Record<RoomTier, number>> = {
  0: 0.4,
  1: 0.7,
  2: 1.0,
  3: 1.25,
};

/** Glow / opacity multiplier per tier. Applied as a CSS custom
 *  property the room-ambient keyframes read via `var(--ambient-glow-mult)`.
 *  Same shape as the particle multiplier so authors only have to
 *  reason about one curve. */
const TIER_GLOW_MULT: Readonly<Record<RoomTier, number>> = {
  0: 0.4,
  1: 0.7,
  2: 1.0,
  3: 1.25,
};

function RoomAmbientLifeInner({ roomId, tier = 0 }: RoomAmbientLifeProps) {
  // Hand-maintained map of { roomId → overlay renderer }. Keeping this
  // in one place so designers can grep for the room and see exactly
  // what ambient vocabulary it uses. Tier scales the particle count
  // so Dormant rooms feel sparse and Restored rooms feel inhabited.
  const renderer = useMemo(
    () => overlayForRoom(roomId, TIER_PARTICLE_MULT[tier]),
    [roomId, tier],
  );
  if (!renderer) return null;
  // Style passes the glow multiplier as a CSS custom property so the
  // ark-ambient-* keyframes in index.css can use it without each
  // overlay branch having to thread it through inline styles.
  const wrapperStyle: CSSProperties = {
    // @ts-expect-error — CSS custom property
    "--ambient-glow-mult": TIER_GLOW_MULT[tier],
  };
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
      style={wrapperStyle}
    >
      {renderer}
    </div>
  );
}

export default memo(RoomAmbientLifeInner);

/* ─── Particle generators ───
   Each helper returns a set of span elements positioned by CSS
   custom properties so the keyframes in index.css can drive them
   independently. Deterministic placement — same room renders the
   same particle field every mount, avoiding "page glitch" visual. */
function particles(count: number, className: string, seed: number) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rand() * 100,
    delay: rand() * 12,
    duration: 8 + rand() * 8,
    size: 2 + rand() * 3,
    className,
  }));
}

/** Round particle count by the tier multiplier. Floors at 1 so an
 *  authored overlay never disappears entirely at Tier 0. */
function scaleCount(base: number, mult: number): number {
  return Math.max(1, Math.round(base * mult));
}

function overlayForRoom(roomId: string, particleMult: number) {
  switch (roomId) {
    case "cryo-bay":
    case "cryo_bay": {
      // Rising cold-blue vapor. Slow, sparse. Pod-glass breathing
      // glow handled separately by LivingBackground.
      const spans = particles(scaleCount(14, particleMult), "ark-ambient-cryo-vapor", 0xc1e041);
      return (
        <>
          {spans.map((p) => (
            <span
              key={p.id}
              className={p.className}
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size * 1.4}px`,
                animationDelay: `${-p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
          {/* Pod glass breathing-glow at center-bottom of viewport */}
          <div className="ark-ambient-cryo-glow" />
        </>
      );
    }

    case "bridge":
    case "bridge-initial": {
      // Fast horizontal star drift + an 8s HUD line-scan sweep.
      // Matches the "looking out the viewport" feel.
      const stars = particles(scaleCount(18, particleMult), "ark-ambient-bridge-star", 0xb2ce22);
      return (
        <>
          {stars.map((p) => (
            <span
              key={p.id}
              className={p.className}
              style={{
                top: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${-p.delay}s`,
                animationDuration: `${p.duration * 0.6}s`,
              }}
            />
          ))}
          <div className="ark-ambient-bridge-scan" />
        </>
      );
    }

    case "engineering": {
      // Heat haze shimmer + rare orange sparks.
      const sparks = particles(scaleCount(6, particleMult), "ark-ambient-engineering-spark", 0x9e7203);
      return (
        <>
          <div className="ark-ambient-engineering-haze" />
          {sparks.map((p) => (
            <span
              key={p.id}
              className={p.className}
              style={{
                left: `${p.left}%`,
                animationDelay: `${-p.delay}s`,
                animationDuration: `${6 + p.duration * 0.4}s`,
              }}
            />
          ))}
        </>
      );
    }

    case "medical-bay":
    case "medical_bay": {
      // Diagnostic line sweep + a slow IV-drip blink marker.
      return (
        <>
          <div className="ark-ambient-medical-scan" />
          <div className="ark-ambient-medical-drip" />
        </>
      );
    }

    case "antiquarian-library":
    case "antiquarian_library":
    case "library": {
      // Dust motes drifting in a simulated light-shaft angle.
      const dust = particles(scaleCount(22, particleMult), "ark-ambient-library-dust", 0x7742a5);
      return (
        <>
          <div className="ark-ambient-library-shaft" />
          {dust.map((p) => (
            <span
              key={p.id}
              className={p.className}
              style={{
                left: `${p.left}%`,
                top: `${p.delay * 8}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${-p.delay}s`,
                animationDuration: `${10 + p.duration}s`,
              }}
            />
          ))}
        </>
      );
    }

    default:
      return null;
  }
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
