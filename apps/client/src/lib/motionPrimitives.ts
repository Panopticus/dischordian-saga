/* ═══════════════════════════════════════════════════════
   MOTION PRIMITIVES — Task 7.2

   Physics-aware framer-motion variant factories. Every
   primitive reads `document.documentElement.dataset.physics`
   (set by voidEngine.applyTheme) and returns Variants that
   match the active material:

     - glass   → smooth blur + spring, 250–300 ms
     - flat    → clean ease-out, no blur, ~200 ms
     - retro   → instant (0 ms), no blur, no spring

   Use the factories instead of ad-hoc framer animations so
   the entire app respects the active physics type. If the
   player flips atmosphere/physics mid-session the next mount
   picks up the new timing automatically — no re-registration.

   Usage:

     import { materialize, dematerialize } from "@/lib/motionPrimitives";

     <motion.div
       variants={materialize()}
       initial="initial"
       animate="animate"
       exit="exit"
     />

   Or with AnimatePresence for modal/toast flows:

     <AnimatePresence mode="wait">
       {open && (
         <motion.div
           variants={materialize()}
           initial="initial"
           animate="animate"
           exit="exit"
         >
           {children}
         </motion.div>
       )}
     </AnimatePresence>

   Design note: the factories are pure functions, not
   pre-baked constants, because the physics type can change
   at runtime. A cached variant would lock in whichever
   physics was active on first import.
   ═══════════════════════════════════════════════════════ */

import type { Variants, Transition } from "framer-motion";

export type PhysicsType = "glass" | "flat" | "retro";

/** Read the active physics type from the DOM. SSR-safe. */
export function getPhysics(): PhysicsType {
  if (typeof document === "undefined") return "glass";
  const value = document.documentElement.dataset.physics;
  if (value === "flat" || value === "retro" || value === "glass") {
    return value;
  }
  return "glass";
}

/** Duration helper. Retro physics is instant. */
function duration(physics: PhysicsType, glassMs: number, flatMs: number): number {
  if (physics === "retro") return 0;
  return physics === "glass" ? glassMs / 1000 : flatMs / 1000;
}

/** Easing helper. Retro uses linear since it's instant anyway. */
function ease(physics: PhysicsType): Transition["ease"] {
  if (physics === "retro") return "linear";
  // Glass uses a gentle spring-ish curve; flat uses a clean ease-out.
  return physics === "glass" ? [0.4, 0, 0.2, 1] : [0.25, 0.1, 0.25, 1];
}

/** Blur helper. Only glass uses blur. */
function blurFilter(physics: PhysicsType, amount: number): string {
  if (physics === "glass") return `blur(${amount}px)`;
  return "blur(0px)";
}

/* ─── 1. MATERIALIZE — appears from void ─── */

/**
 * Element fades in from slightly below with a light scale
 * and (glass only) a blur clear. The canonical "new modal /
 * toast / card" entrance.
 */
export function materialize(): Variants {
  const physics = getPhysics();
  return {
    initial: {
      opacity: 0,
      y: 15,
      scale: 0.96,
      filter: blurFilter(physics, 12),
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: duration(physics, 300, 200),
        ease: ease(physics),
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: blurFilter(physics, 12),
      transition: {
        duration: duration(physics, 250, 150),
        ease: ease(physics),
      },
    },
  };
}

/* ─── 2. DEMATERIALIZE — fades into void ─── */

/**
 * Companion to materialize — a standalone exit variant for
 * cases where a component only needs the leave animation
 * (e.g. persistent panels that auto-dismiss).
 */
export function dematerialize(): Variants {
  const physics = getPhysics();
  return {
    initial: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: {
      opacity: 0,
      y: -10,
      filter: blurFilter(physics, 12),
      transition: {
        duration: duration(physics, 250, 150),
        ease: ease(physics),
      },
    },
  };
}

/* ─── 3. EMERGE — accordion / disclosure ─── */

/**
 * Expands from zero height. Fades the content in slightly
 * after the height transition so text isn't visually clipped
 * mid-expansion.
 */
export function emerge(): Variants {
  const physics = getPhysics();
  const heightDur = duration(physics, 300, 200);
  const opacityDur = duration(physics, 200, 150);
  const opacityDelay = physics === "retro" ? 0 : 0.1;
  return {
    initial: { height: 0, opacity: 0, overflow: "hidden" as const },
    animate: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: heightDur, ease: ease(physics) },
        opacity: { duration: opacityDur, delay: opacityDelay, ease: ease(physics) },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden" as const,
      transition: {
        height: { duration: heightDur, ease: ease(physics) },
        opacity: { duration: opacityDur, ease: ease(physics) },
      },
    },
  };
}

/* ─── 4. DISSOLVE — subtle fade ─── */

/**
 * Plain opacity crossfade. Used where a movement or scale
 * would distract (e.g. background swaps, ambient label
 * changes).
 */
export function dissolve(): Variants {
  const physics = getPhysics();
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: duration(physics, 250, 200), ease: ease(physics) },
    },
    exit: {
      opacity: 0,
      transition: { duration: duration(physics, 200, 150), ease: ease(physics) },
    },
  };
}

/* ─── 5. IMPLODE — dismiss with inward scale ─── */

/**
 * Inward-collapse dismiss. Good for "completing" a prompt
 * or destroying a transient element (quest reward popup,
 * bonus toast).
 */
export function implode(): Variants {
  const physics = getPhysics();
  return {
    initial: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: blurFilter(physics, 8),
      transition: {
        duration: duration(physics, 300, 200),
        ease: ease(physics),
      },
    },
  };
}

/* ─── 6. LIVE — ambient loop ─── */

/**
 * Continuous gentle pulse — used on always-visible elements
 * that should feel "alive" (signal indicators, status lights,
 * active-event badges). Retro physics returns an empty variant
 * so the element is still but visible.
 */
export function live(): Variants {
  const physics = getPhysics();
  if (physics === "retro") {
    return {
      animate: { opacity: 1 },
    };
  }
  return {
    animate: {
      opacity: [0.85, 1, 0.85],
      scale: physics === "glass" ? [1, 1.02, 1] : [1, 1, 1],
      transition: {
        duration: physics === "glass" ? 2.4 : 1.8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };
}

/* ─── CONVENIENCE EXPORTS ─── */

/**
 * Named set of all primitives — useful for tests and
 * devtool surfaces that want to enumerate them.
 */
export const motionPrimitives = {
  materialize,
  dematerialize,
  emerge,
  dissolve,
  implode,
  live,
} as const;

export type MotionPrimitiveName = keyof typeof motionPrimitives;
