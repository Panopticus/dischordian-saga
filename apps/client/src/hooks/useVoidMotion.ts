/* ═══════════════════════════════════════════════════════
   USE VOID MOTION — React hook for physics-aware animations

   Wraps voidMotion.ts primitives into a reactive hook that
   re-reads physics type when the atmosphere changes.

   Usage:
     function MyComponent() {
       const { enter, exit, lifecycle, stagger, listItem } = useVoidMotion();
       return (
         <AnimatePresence>
           <motion.div {...lifecycle}>Content</motion.div>
         </AnimatePresence>
       );
     }

   For stagger lists:
     const { stagger, listItem } = useVoidMotion();
     <motion.ul {...stagger}>
       {items.map(item => (
         <motion.li key={item.id} {...listItem.variants}>
           {item.name}
         </motion.li>
       ))}
     </motion.ul>
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import {
  materialize,
  dematerialize,
  emerge,
  dissolve,
  voidLifecycle,
  voidStagger,
  voidListItem,
  getCurrentPhysics,
} from "@/engine/voidMotion";
import type { PhysicsType } from "@/engine/voidEngine";

/**
 * Hook that returns physics-aware framer-motion props.
 *
 * @param physicsOverride - Force a specific physics type instead of reading from DOM.
 *   Useful inside AtmosphereScope or when you know the context.
 */
export function useVoidMotion(physicsOverride?: PhysicsType) {
  // Read physics once per render. This is intentionally NOT reactive to
  // DOM attribute changes (would cause cascading re-renders). Components
  // that mount during an atmosphere already get the right physics.
  // Theme changes re-mount components via React key patterns.
  const physics = physicsOverride ?? getCurrentPhysics();

  return useMemo(() => ({
    /** Entry animation (fade + blur + Y-translate for glass, sharp for flat, instant for retro) */
    enter: materialize(physics),
    /** Exit animation for floating UI (toast, tooltip) */
    exit: dematerialize(physics),
    /** Layout-aware entry (animates height + visual) */
    emerge: emerge(physics),
    /** Layout-aware exit (collapses height + fades) */
    dissolve: dissolve(physics),
    /** Combined initial/animate/exit for AnimatePresence */
    lifecycle: voidLifecycle(physics),
    /** Parent container props for staggered list animation */
    stagger: voidStagger(physics),
    /** Child item props for staggered list items */
    listItem: voidListItem(physics),
    /** Current physics type (for conditional rendering) */
    physics,
  }), [physics]);
}
