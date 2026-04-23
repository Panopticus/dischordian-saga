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
import { memo, useMemo } from "react";

interface RoomAmbientLifeProps {
  /** Room id from RoomDef (e.g. "cryo-bay", "bridge"). Unknown ids render nothing. */
  roomId: string;
}

function RoomAmbientLifeInner({ roomId }: RoomAmbientLifeProps) {
  // Hand-maintained map of { roomId → overlay renderer }. Keeping this
  // in one place so designers can grep for the room and see exactly
  // what ambient vocabulary it uses.
  const renderer = useMemo(() => overlayForRoom(roomId), [roomId]);
  if (!renderer) return null;
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
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

function overlayForRoom(roomId: string) {
  switch (roomId) {
    case "cryo-bay":
    case "cryo_bay": {
      // Rising cold-blue vapor. Slow, sparse. Pod-glass breathing
      // glow handled separately by LivingBackground.
      const spans = particles(14, "ark-ambient-cryo-vapor", 0xc1e041);
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
      const stars = particles(18, "ark-ambient-bridge-star", 0xb2ce22);
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
      const sparks = particles(6, "ark-ambient-engineering-spark", 0x9e7203);
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
      const dust = particles(22, "ark-ambient-library-dust", 0x7742a5);
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
