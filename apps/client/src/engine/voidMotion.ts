/* ═══════════════════════════════════════════════════════
   VOID MOTION — Physics-aware animation primitives for React

   Ports the Svelte VoidEngine's transition system to
   framer-motion variants. Each primitive adapts to the
   current physics type:

   - Glass: blur + spring curves + 300ms
   - Flat:  no blur + ease-out + 200ms
   - Retro: stepped or instant (0ms)

   Lifecycle mapping (matches upstream naming):
   - materialize: element enters the viewport
   - dematerialize: floating element exits (toast, tooltip)
   - emerge: layout-aware entry (animates height + visual)
   - dissolve: layout-aware exit (collapses height + fades)

   Usage with framer-motion:
     <motion.div {...materialize(physics)} />
     <motion.div {...materialize()} />  // auto-reads from DOM

   "We do not paint pixels; we define materials."
   ═══════════════════════════════════════════════════════ */

import { cubicBezier, type Easing } from "framer-motion";
import type { PhysicsType } from "./voidEngine";
import { getMotionIntensity } from "./motionIntensity";

/* ─── PHYSICS DETECTION ─── */

/**
 * Read the current physics type from the DOM.
 * Falls back to 'flat' if not set.
 */
export function getCurrentPhysics(): PhysicsType {
  if (typeof document === "undefined") return "flat";
  const attr = document.documentElement.getAttribute("data-physics");
  if (attr === "glass" || attr === "flat" || attr === "retro") return attr;
  return "flat";
}

/* ─── TIMING CONSTANTS ─── */

const CUBIC_IN: Easing = cubicBezier(0.33, 0, 0.67, 1);

type PhysicsTiming = { base: number; fast: number; ease: Easing };

const RAW_PHYSICS_TIMING: Record<PhysicsType, PhysicsTiming> = {
  glass: { base: 0.3, fast: 0.15, ease: cubicBezier(0.4, 0, 0.2, 1) },
  flat:  { base: 0.2, fast: 0.1,  ease: cubicBezier(0.25, 0.1, 0.25, 1) },
  retro: { base: 0,   fast: 0,    ease: cubicBezier(0, 0, 1, 1) },
};

/**
 * Resolve physics timing scaled by the user's motion-intensity slider.
 *
 * Why scale entry durations and not just ambient motion? Because the
 * "every page breathes" feel comes from consistent transition rhythms.
 * At intensity 0.5 every fade-in is 50% shorter, which reads as snappier
 * without feeling abrupt — matches what most AAA titles expose as a
 * "UI animations" reduce toggle.
 */
function PHYSICS_TIMING(p: PhysicsType): PhysicsTiming {
  const raw = RAW_PHYSICS_TIMING[p];
  const scale = getMotionIntensity();
  return {
    base: raw.base * scale,
    fast: raw.fast * scale,
    ease: raw.ease,
  };
}

/* ─── REDUCED MOTION ─── */

const prefersReducedMotion =
  typeof matchMedia !== "undefined"
    ? matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

/* ─── MATERIALIZE ───
   Entry transition for elements appearing in the viewport.
   Glass: blur fade-in with Y-axis translation
   Flat:  sharp fade-in with scale (no blur)
   Retro: instant opacity change */

export function materialize(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();
  const t = PHYSICS_TIMING(p);

  if (prefersReducedMotion || p === "retro") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: p === "retro" ? 0 : t.base },
    };
  }

  return {
    initial: {
      opacity: 0,
      y: 15,
      scale: 0.96,
      filter: p === "glass" ? "blur(12px)" : "blur(0px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    transition: {
      duration: t.base,
      ease: t.ease,
    },
  };
}

/* ─── DEMATERIALIZE ───
   Exit transition for floating UI (toasts, tooltips).
   Glass: blur + upward float fade-out
   Flat:  sharp upward float fade-out (no blur)
   Retro: stepped dissolve with grayscale */

export function dematerialize(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();
  const t = PHYSICS_TIMING(p);

  if (prefersReducedMotion) {
    return {
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  if (p === "retro") {
    return {
      exit: {
        opacity: 0,
        scale: 0.9,
        filter: "grayscale(100%) contrast(200%)",
      },
      transition: { duration: 0.15, ease: "linear" },
    };
  }

  return {
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      filter: p === "glass" ? "blur(12px)" : "blur(0px)",
    },
    transition: {
      duration: t.base,
      ease: CUBIC_IN, // cubicIn equivalent
    },
  };
}

/* ─── EMERGE ───
   Layout-aware entry. Animates height + padding + visual.
   Best for elements in document flow (not positioned/overlaid).
   Glass: blur fade-in with Y translation + height growth
   Flat:  sharp fade-in with scale + height growth
   Retro: instant */

export function emerge(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();
  const t = PHYSICS_TIMING(p);

  if (prefersReducedMotion || p === "retro") {
    return {
      initial: { opacity: 0, height: 0, overflow: "hidden" as const },
      animate: { opacity: 1, height: "auto", overflow: "visible" as const },
      transition: { duration: p === "retro" ? 0 : t.base },
    };
  }

  return {
    initial: {
      opacity: 0,
      height: 0,
      y: 15,
      scale: 0.96,
      overflow: "hidden" as const,
      filter: p === "glass" ? "blur(12px)" : "blur(0px)",
    },
    animate: {
      opacity: 1,
      height: "auto",
      y: 0,
      scale: 1,
      overflow: "visible" as const,
      filter: "blur(0px)",
    },
    transition: {
      duration: t.base,
      ease: t.ease,
    },
  };
}

/* ─── DISSOLVE ───
   Layout-aware exit. Collapses height while fading.
   Glass: blur + upward float + height collapse
   Flat:  sharp fade + height collapse
   Retro: stepped dissolve + height collapse */

export function dissolve(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();
  const t = PHYSICS_TIMING(p);

  if (prefersReducedMotion) {
    return {
      exit: { opacity: 0, height: 0, overflow: "hidden" as const },
      transition: { duration: 0 },
    };
  }

  if (p === "retro") {
    return {
      exit: {
        opacity: 0,
        height: 0,
        scale: 0.9,
        overflow: "hidden" as const,
        filter: "grayscale(100%) contrast(200%)",
      },
      transition: { duration: 0.15, ease: "linear" },
    };
  }

  return {
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      scale: 0.95,
      overflow: "hidden" as const,
      filter: p === "glass" ? "blur(12px)" : "blur(0px)",
    },
    transition: {
      duration: t.base,
      ease: CUBIC_IN,
    },
  };
}

/* ─── COMBINED LIFECYCLE ───
   Convenience: returns materialize + dematerialize as a single
   framer-motion variants object for AnimatePresence usage. */

export function voidLifecycle(physics?: PhysicsType) {
  const m = materialize(physics);
  const d = dematerialize(physics);
  return {
    initial: m.initial,
    animate: m.animate,
    exit: d.exit,
    transition: m.transition,
  };
}

/* ─── STAGGER CHILDREN ───
   Physics-aware stagger for list animations.
   Glass: 50ms stagger with blur
   Flat:  30ms stagger, sharp
   Retro: 0ms (all appear at once) */

export function voidStagger(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();

  return {
    animate: {
      transition: {
        staggerChildren: p === "retro" ? 0 : p === "glass" ? 0.05 : 0.03,
        delayChildren: 0,
      },
    },
  };
}

/* ─── LIST ITEM ───
   For use inside a stagger container.
   Each item materializes with physics-aware behavior. */

export function voidListItem(physics?: PhysicsType) {
  const p = physics ?? getCurrentPhysics();
  const t = PHYSICS_TIMING(p);

  if (prefersReducedMotion || p === "retro") {
    return {
      variants: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: p === "retro" ? 0 : t.base } },
        exit: { opacity: 0, transition: { duration: 0 } },
      },
    };
  }

  return {
    variants: {
      initial: {
        opacity: 0,
        y: 10,
        scale: 0.97,
        filter: p === "glass" ? "blur(8px)" : "blur(0px)",
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: t.base, ease: t.ease },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        filter: p === "glass" ? "blur(8px)" : "blur(0px)",
        transition: { duration: t.fast, ease: CUBIC_IN },
      },
    },
  };
}
