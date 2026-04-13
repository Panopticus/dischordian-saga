/**
 * VoidTile — Interactive card/tile with physics-aware hover and press.
 *
 * Glass: hover lifts with glow shadow + blur, press compresses
 * Flat: hover shows border accent, press darkens
 * Retro: hover shows pixel outline, press is instant (no transition)
 */
import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface VoidTileProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  /** Is this tile currently selected/active? */
  active?: boolean;
  /** Disable hover/press animations */
  disabled?: boolean;
  className?: string;
}

function getPhysics(): "glass" | "flat" | "retro" {
  if (typeof document === "undefined") return "flat";
  return (document.documentElement.dataset.physics as any) || "flat";
}

const VoidTile = forwardRef<HTMLDivElement, VoidTileProps>(
  ({ children, active = false, disabled = false, className = "", ...rest }, ref) => {
    const physics = getPhysics();

    const hoverAnim = disabled ? {} : physics === "retro"
      ? {} // retro: no hover animation (instant state change via CSS)
      : physics === "glass"
      ? { scale: 1.02, y: -4 }
      : { scale: 1.01, y: -2 };

    const tapAnim = disabled ? {} : physics === "retro"
      ? { scale: 0.98 }
      : { scale: 0.97 };

    return (
      <motion.div
        ref={ref}
        className={`void-surface relative cursor-pointer select-none ${active ? "void-tile-active" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
        whileHover={hoverAnim}
        whileTap={tapAnim}
        transition={physics === "retro"
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 25 }
        }
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

VoidTile.displayName = "VoidTile";
export default VoidTile;
