/**
 * VoidSurface — The foundational material container.
 *
 * Responds to active physics via [data-physics] CSS selectors:
 * - Glass: backdrop-blur, translucent, layered shadows, glow hover
 * - Flat: solid, minimal shadow, sharp borders
 * - Retro: 0 radius, double borders, scanline overlay, instant transitions
 *
 * "We do not paint pixels; we define materials."
 */
import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePhysicsTransition } from "@/hooks/usePhysicsTransition";

interface VoidSurfaceProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  /** Use void-elevated styling (popups, modals, drawers) */
  elevated?: boolean;
  /** Animate entry with physics-aware transition */
  animateEntry?: boolean;
  /** Narrative effect to apply */
  narrative?: string;
  /** Additional className */
  className?: string;
}

const VoidSurface = forwardRef<HTMLDivElement, VoidSurfaceProps>(
  ({ children, elevated = false, animateEntry = false, narrative, className = "", ...rest }, ref) => {
    const materialClass = elevated ? "void-elevated" : "void-surface";
    const variants = usePhysicsTransition("materialize");

    return (
      <motion.div
        ref={ref}
        className={`${materialClass} relative ${className}`}
        data-narrative={narrative}
        {...(animateEntry ? {
          variants,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
        } : {})}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

VoidSurface.displayName = "VoidSurface";
export default VoidSurface;
