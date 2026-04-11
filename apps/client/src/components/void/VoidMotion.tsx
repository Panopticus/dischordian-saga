/**
 * VoidMotion — Drop-in replacement for motion.div with physics-aware transitions.
 *
 * Instead of:
 *   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 *
 * Use:
 *   <VoidMotion type="emerge">
 *
 * The transition type determines the animation, and the active physics
 * determines HOW it animates (glass=blur+slide, flat=sharp, retro=instant).
 */
import { forwardRef, type ReactNode } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { usePhysicsTransition, type TransitionType } from "@/hooks/usePhysicsTransition";

interface VoidMotionProps extends Omit<HTMLMotionProps<"div">, "ref" | "initial" | "animate" | "exit" | "transition" | "variants"> {
  children: ReactNode;
  /** Transition type. Default "emerge" */
  type?: TransitionType;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Unique key for AnimatePresence (if used within one) */
  motionKey?: string;
  className?: string;
}

const VoidMotion = forwardRef<HTMLDivElement, VoidMotionProps>(
  ({ children, type = "emerge", delay = 0, motionKey, className = "", ...rest }, ref) => {
    const variants = usePhysicsTransition(type);

    return (
      <motion.div
        ref={ref}
        key={motionKey}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          ...variants.transition,
          delay,
        }}
        className={className}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

VoidMotion.displayName = "VoidMotion";
export default VoidMotion;
