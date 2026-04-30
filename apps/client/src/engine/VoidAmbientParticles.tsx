/* ═══════════════════════════════════════════════════════
   VOID AMBIENT PARTICLES — Canvas 2D ambient layer

   Mounts once at the AppShell root, behind content. Subscribes
   to the `data-particles` attribute on <html> (set by
   applyThemeToDOM in voidEngine.ts) and renders the matching
   ambient effect. Effects are painted on a single fullscreen
   canvas that sits below the UI and ignores pointer events.

   Effects (from VoidTheme.particleEffect):
     "fireflies" — slow drifting glowing dots, fade in/out
     "embers"    — upward-drifting hot specks (crimson_forge)
     "sparks"    — short fast streaks crossing the canvas
     "data"      — cyan glyph rain (matrix-style, twilight)
     "leaves"    — slow horizontal drift with bobbing (verdant)
     "static"    — sparse high-frequency CRT noise (singularity)

   Constraints:
     - Reduces particle count when prefers-reduced-motion is set
       (just keeps a static frame to preserve atmosphere).
     - Pauses RAF when document.hidden — never burns CPU off-screen.
     - Pulls --void-primary from computedStyle so colors track the
       current atmosphere automatically.
     - Caps at ~80 particles to stay GPU-cheap on phones.
   ═══════════════════════════════════════════════════════ */
import { memo, useEffect, useRef } from "react";
import { getMotionIntensity } from "./motionIntensity";

export type ParticleKind = "fireflies" | "embers" | "sparks" | "data" | "leaves" | "static";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;       // 0..1
  lifespan: number;   // seconds
  size: number;
  glyph?: string;     // for "data" effect
  bobPhase?: number;  // for "leaves"
}

export const KIND_FROM_STRING: Record<string, ParticleKind> = {
  fireflies: "fireflies",
  embers: "embers",
  sparks: "sparks",
  data: "data",
  leaves: "leaves",
  static: "static",
};

/** Map an arbitrary attribute string to a ParticleKind, or null when unrecognized. */
export function resolveParticleKind(raw: string | null | undefined): ParticleKind | null {
  if (!raw) return null;
  return KIND_FROM_STRING[raw.trim()] ?? null;
}

const DATA_GLYPHS = "01010110AB#$@".split("");

function readParticleKind(): ParticleKind | null {
  if (typeof document === "undefined") return null;
  return resolveParticleKind(document.documentElement.getAttribute("data-particles"));
}

function readPalette(): { primary: string; accent: string } {
  if (typeof document === "undefined") {
    return { primary: "rgb(51,226,230)", accent: "rgb(255,140,0)" };
  }
  const cs = getComputedStyle(document.documentElement);
  const primary = cs.getPropertyValue("--void-primary").trim() || "rgb(51,226,230)";
  const accent = cs.getPropertyValue("--void-accent").trim() || "rgb(255,140,0)";
  return { primary, accent };
}

function spawn(kind: ParticleKind, w: number, h: number): Particle {
  switch (kind) {
    case "fireflies":
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        life: Math.random(),
        lifespan: 6 + Math.random() * 6,
        size: 1.2 + Math.random() * 1.8,
      };
    case "embers":
      return {
        x: Math.random() * w,
        y: h + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(0.4 + Math.random() * 0.6),
        life: 0,
        lifespan: 4 + Math.random() * 3,
        size: 1 + Math.random() * 1.6,
      };
    case "sparks":
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 0,
        lifespan: 0.6 + Math.random() * 0.8,
        size: 1,
      };
    case "data":
      return {
        x: Math.floor(Math.random() * (w / 14)) * 14,
        y: -20,
        vx: 0,
        vy: 0.8 + Math.random() * 1.4,
        life: 0,
        lifespan: 5 + Math.random() * 4,
        size: 12,
        glyph: DATA_GLYPHS[Math.floor(Math.random() * DATA_GLYPHS.length)],
      };
    case "leaves":
      return {
        x: -20,
        y: Math.random() * h,
        vx: 0.3 + Math.random() * 0.4,
        vy: 0,
        life: 0,
        lifespan: 12 + Math.random() * 6,
        size: 2 + Math.random() * 2,
        bobPhase: Math.random() * Math.PI * 2,
      };
    case "static":
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        life: 0,
        lifespan: 0.08 + Math.random() * 0.12,
        size: 1,
      };
  }
}

export function targetCount(kind: ParticleKind, motionIntensity: number): number {
  const base =
    kind === "static" ? 80 :
    kind === "data" ? 28 :
    kind === "leaves" ? 18 :
    kind === "embers" ? 36 :
    kind === "sparks" ? 24 :
    /* fireflies */ 32;
  // Scale down with reduced motion. Floor at 6 so atmosphere isn't empty.
  return Math.max(6, Math.round(base * (0.4 + 0.6 * motionIntensity)));
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  kind: ParticleKind,
  primary: string,
  accent: string,
) {
  const fade = kind === "fireflies"
    ? Math.sin(p.life * Math.PI)            // fade in then out
    : kind === "embers"
    ? 1 - p.life                             // hot at bottom, dim as it rises
    : kind === "sparks"
    ? 1 - p.life
    : kind === "data"
    ? Math.min(1, p.life * 4) * (1 - p.life * 0.7)
    : kind === "leaves"
    ? Math.sin(p.life * Math.PI)
    : /* static */ Math.random() * 0.5 + 0.2;

  ctx.globalAlpha = Math.max(0, Math.min(1, fade));

  if (kind === "data" && p.glyph) {
    ctx.font = `${p.size}px 'Courier Prime', 'Courier New', monospace`;
    ctx.fillStyle = primary;
    ctx.shadowColor = primary;
    ctx.shadowBlur = 6;
    ctx.fillText(p.glyph, p.x, p.y);
    ctx.shadowBlur = 0;
    return;
  }

  if (kind === "sparks") {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
    ctx.stroke();
    return;
  }

  const color = kind === "embers" || kind === "leaves" ? accent : primary;
  ctx.fillStyle = color;
  if (kind !== "static") {
    ctx.shadowColor = color;
    ctx.shadowBlur = kind === "fireflies" ? 8 : 4;
  }
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function VoidAmbientParticlesInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let kind: ParticleKind | null = readParticleKind();
    let palette = readPalette();
    let raf = 0;
    let last = performance.now();
    let running = true;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    function resize() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rebuild() {
      kind = readParticleKind();
      palette = readPalette();
      particles = [];
      if (!kind) return;
      const motion = getMotionIntensity();
      const count = targetCount(kind, motion);
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) particles.push(spawn(kind, w, h));
    }

    function step(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp at 50ms to avoid jumps after tab-resume
      last = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      if (kind && particles.length > 0) {
        const motion = getMotionIntensity();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (kind === "leaves") {
            p.x += p.vx * 60 * dt * motion;
            p.y += Math.sin((now / 1000) * 0.6 + (p.bobPhase ?? 0)) * 0.3;
          } else {
            p.x += p.vx * 60 * dt * motion;
            p.y += p.vy * 60 * dt * motion;
          }

          p.life += dt / p.lifespan;

          // Recycle: lifecycle expired or off-screen.
          const offscreen =
            p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40;
          if (p.life >= 1 || offscreen) {
            particles[i] = spawn(kind, w, h);
            continue;
          }

          drawParticle(ctx!, p, kind, palette.primary, palette.accent);
        }
        ctx!.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    }

    function onAttrMutation(records: MutationRecord[]) {
      for (const r of records) {
        if (r.type === "attributes" && (r.attributeName === "data-particles" || r.attributeName === "data-atmosphere")) {
          rebuild();
          return;
        }
      }
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    }

    resize();
    rebuild();
    raf = requestAnimationFrame(step);

    const observer = new MutationObserver(onAttrMutation);
    observer.observe(document.documentElement, { attributes: true });

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

export const VoidAmbientParticles = memo(VoidAmbientParticlesInner);
