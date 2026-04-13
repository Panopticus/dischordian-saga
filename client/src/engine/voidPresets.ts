/* ═══════════════════════════════════════════════════════
   VOID PRESETS — Drop-in framer-motion animation presets
   that read the current physics type and adapt automatically.

   These replace hardcoded animation values across 90+ components.
   Instead of:
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}

   Use:
     {...VOID.fadeUp}
   or:
     {...VOID.toast}

   All presets adapt to glass/flat/retro physics automatically
   when read. Physics is resolved at call time.
   ═══════════════════════════════════════════════════════ */

import { getCurrentPhysics } from "./voidMotion";
import type { PhysicsType } from "./voidEngine";

/* ─── TIMING TABLES ─── */

function timing(p?: PhysicsType) {
  const physics = p ?? getCurrentPhysics();
  return {
    glass: { fast: 0.15, base: 0.3, slow: 0.5, ease: [0.4, 0, 0.2, 1] as number[] },
    flat:  { fast: 0.1,  base: 0.2, slow: 0.35, ease: [0.25, 0.1, 0.25, 1] as number[] },
    retro: { fast: 0,    base: 0,   slow: 0.05, ease: [0, 0, 1, 1] as number[] },
  }[physics];
}

function blur(p?: PhysicsType) {
  const physics = p ?? getCurrentPhysics();
  return physics === "glass" ? "blur(12px)" : "blur(0px)";
}

/* ─── PRESET FACTORIES ─── */

/** Fade in from below (most common pattern in codebase) */
export function fadeUp(y = 20) {
  const t = timing();
  return {
    initial: { opacity: 0, y, filter: blur() },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, filter: blur() },
    transition: { duration: t.base, ease: t.ease },
  };
}

/** Fade in from above (toasts sliding down) */
export function fadeDown(y = -30) {
  const t = timing();
  return {
    initial: { opacity: 0, y, filter: blur() },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y, filter: blur() },
    transition: { duration: t.base, ease: t.ease },
  };
}

/** Scale + fade (modals, cards, discovery gates) */
export function scaleIn(scale = 0.95) {
  const t = timing();
  return {
    initial: { opacity: 0, scale, filter: blur() },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale, filter: blur() },
    transition: { duration: t.base, ease: t.ease },
  };
}

/** Spring entrance (dialogs, panels) */
export function springUp(y = 40) {
  const p = getCurrentPhysics();
  if (p === "retro") {
    return {
      initial: { opacity: 0, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 0 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y, scale: 0.98 },
    transition: {
      type: "spring" as const,
      damping: p === "glass" ? 25 : 30,
      stiffness: p === "glass" ? 300 : 400,
    },
  };
}

/** Slide from left (navigation, sidebars) */
export function slideLeft(x = -20) {
  const t = timing();
  return {
    initial: { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x },
    transition: { duration: t.fast, ease: t.ease },
  };
}

/** Slide from right */
export function slideRight(x = 20) {
  const t = timing();
  return {
    initial: { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x },
    transition: { duration: t.fast, ease: t.ease },
  };
}

/** Toast notification (slide from top with spring) */
export function toast() {
  return fadeDown(-30);
}

/** Toast notification from bottom */
export function toastBottom() {
  return fadeUp(20);
}

/** Card reveal (scale + Y offset) */
export function cardReveal(delay = 0) {
  const t = timing();
  return {
    initial: { opacity: 0, y: 6, scale: 0.97, filter: blur() },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: { duration: t.base, ease: t.ease, delay },
  };
}

/** Stagger container for lists */
export function staggerContainer(staggerMs?: number) {
  const p = getCurrentPhysics();
  const stagger = staggerMs ?? (p === "retro" ? 0 : p === "glass" ? 0.05 : 0.03);
  return {
    animate: {
      transition: { staggerChildren: stagger },
    },
  };
}

/** Stagger child item */
export function staggerItem() {
  const t = timing();
  return {
    variants: {
      initial: { opacity: 0, y: 10, filter: blur() },
      animate: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: t.base, ease: t.ease },
      },
    },
  };
}

/** Simple opacity fade */
export function fade() {
  const t = timing();
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: t.base },
  };
}

/** Backdrop overlay */
export function backdrop() {
  const t = timing();
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: t.fast },
  };
}

/* ─── CONVENIENCE NAMESPACE ─── */

/**
 * All presets as a single object for easy destructuring:
 *   import { VOID } from "@/engine/voidPresets";
 *   <motion.div {...VOID.fadeUp()} />
 */
export const VOID = {
  fadeUp,
  fadeDown,
  scaleIn,
  springUp,
  slideLeft,
  slideRight,
  toast,
  toastBottom,
  cardReveal,
  staggerContainer,
  staggerItem,
  fade,
  backdrop,
} as const;
