/**
 * usePhysicsTransition — Framer Motion variants that branch on active physics.
 *
 * Port of void-energy-ui's transition system (materialize/implode/emerge/
 * dissolve/dematerialize/live) adapted for Framer Motion.
 *
 * - Glass: blur fade-in + Y-translation + scale
 * - Flat: sharp Y-slide, no blur
 * - Retro: instant (0ms duration) or stepped
 *
 * Usage:
 *   const variants = usePhysicsTransition("materialize");
 *   <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" />
 */
import { useMemo } from "react";
import type { Variants, Transition } from "framer-motion";

export type TransitionType =
  | "materialize"   // appear from nothing
  | "implode"       // disappear into nothing
  | "emerge"        // rise from below
  | "dissolve"      // fade away
  | "dematerialize" // glitch-disappear
  | "live";         // subtle presence pulse

function getPhysics(): "glass" | "flat" | "retro" {
  if (typeof document === "undefined") return "flat";
  return (document.documentElement.dataset.physics as any) || "flat";
}

interface PhysicsTransitionConfig {
  hidden: Record<string, any>;
  visible: Record<string, any>;
  exit: Record<string, any>;
  transition: Transition;
}

function getConfig(type: TransitionType, physics: string): PhysicsTransitionConfig {
  switch (type) {
    case "materialize":
      if (physics === "retro") return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 }, // instant
      };
      if (physics === "glass") return {
        hidden: { opacity: 0, y: 12, scale: 0.97, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, scale: 0.98, filter: "blur(4px)" },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      };
      // flat
      return {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
      };

    case "emerge":
      if (physics === "retro") return {
        hidden: { opacity: 0, y: 4 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0 },
      };
      if (physics === "glass") return {
        hidden: { opacity: 0, y: 24, scale: 0.95, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, y: 24, scale: 0.95, filter: "blur(6px)" },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      };
      return {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 16 },
        transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
      };

    case "dissolve":
      if (physics === "retro") return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      };
      if (physics === "glass") return {
        hidden: { opacity: 0, filter: "blur(12px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(12px)" },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: "easeInOut" },
      };

    case "implode":
      if (physics === "retro") return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0 },
      };
      if (physics === "glass") return {
        hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.7, filter: "blur(16px)" },
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      };
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.85 },
        transition: { duration: 0.2 },
      };

    case "dematerialize":
      if (physics === "retro") return {
        hidden: { opacity: 0, x: -4 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 4 },
        transition: { duration: 0 },
      };
      if (physics === "glass") return {
        hidden: { opacity: 0, x: -12, filter: "blur(8px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: 12, filter: "blur(8px)", scale: 0.95 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      };
      return {
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 8 },
        transition: { duration: 0.2 },
      };

    case "live":
      // Subtle looping presence — used for ambient elements
      return {
        hidden: { opacity: 0.8 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
        transition: {
          duration: physics === "retro" ? 0 : 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror" as const,
        },
      };
  }
}

export function usePhysicsTransition(type: TransitionType): Variants & { transition: Transition } {
  const physics = getPhysics();

  return useMemo(() => {
    const config = getConfig(type, physics);
    return {
      hidden: config.hidden,
      visible: config.visible,
      exit: config.exit,
      transition: config.transition,
    };
  }, [type, physics]);
}

/**
 * getPhysicsTransition — non-hook version for use in callbacks/loops.
 * Returns Framer Motion animate props.
 */
export function getPhysicsTransition(type: TransitionType) {
  const physics = getPhysics();
  return getConfig(type, physics);
}
