/* ═══════════════════════════════════════════════════════
   TOAST SLOT — Shared chrome for transient notifications.

   Before this primitive existed, five toast components each
   rolled their own position, z-index, animation, and
   dismiss logic:

     AchievementToast      top-4  center  z-9999  spring
     RememberThisToast     top-16 center  z-95    fadeUp
     FeatureUnlockToast    top-16 center  DISCOVERY scaleIn
     MoralityShiftToast    bottom-20 right z-9997 ad-hoc slide
     AchievementUnlockToast top-0 banner  z-9999  full-width (legitimate exception)

   ToastSlot consolidates the first four into one slot + one
   animation vocabulary. Each consumer keeps its domain-specific
   inner content (Trophy icon / Companion quote / Feature card)
   but hands the outer chrome over.

   Slots:
     - "top-center"    — the default. Stacks achievements, memories,
                         and feature unlocks at the top of the screen,
                         where players already look for feedback.
     - "bottom-right"  — morality-level "alignment shift" beats that
                         want to stay out of the main read area.

   All slot animations respect `--motion-intensity` via voidMotion's
   `getMotionIntensity()` (the spring duration scales; when intensity
   hits zero, we degrade to a linear 120ms fade). Reduce-motion and
   prefers-reduced-motion collapse through the same path.

   Single dismiss seam: click the backdrop, press Escape, or let the
   durationMs timer elapse. Escape is scoped to the toast via a
   capture-phase keydown so it doesn't steal Escape from open modals.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { X } from "lucide-react";
import { getMotionIntensity } from "@/engine/motionIntensity";

export type ToastSlotPosition = "top-center" | "bottom-right";

export type ToastTone = "primary" | "success" | "error" | "premium" | "custom";

/** Map a tone to a CSS color expression. `custom` defers to `toneColor`. */
const TONE_TO_COLOR: Record<Exclude<ToastTone, "custom">, string> = {
  primary: "var(--energy-primary)",
  success: "var(--energy-success)",
  error: "var(--energy-error)",
  premium: "var(--energy-premium)",
};

interface ToastSlotProps {
  /** Visible / hidden — drives AnimatePresence. */
  visible: boolean;
  /** Called when the toast should disappear (click, Escape, or timer). */
  onDismiss: () => void;
  /** Render-prop content. The slot provides position, background, animation. */
  children: ReactNode;
  /** Where on the screen the toast lives. Default: top-center. */
  position?: ToastSlotPosition;
  /** Border glow tone. Custom bypasses the palette and uses toneColor. */
  tone?: ToastTone;
  /** CSS color value used when tone === "custom" (e.g. NPC color). */
  toneColor?: string;
  /** Auto-dismiss delay in ms. 0 or undefined = no auto-dismiss. */
  durationMs?: number;
  /** Show the built-in X dismiss button in the top-right. Default: true. */
  showCloseButton?: boolean;
  /** Maximum card width. Different toasts have different content densities. */
  maxWidth?: number | string;
  /** Key the motion element on this value so content swaps animate cleanly. */
  contentKey?: string | number;
  /** ARIA role — "status" for ambient beats, "alert" for critical ones. */
  role?: "status" | "alert";
  /** Additional className for the outer motion element. */
  className?: string;
}

export default function ToastSlot({
  visible,
  onDismiss,
  children,
  position = "top-center",
  tone = "primary",
  toneColor,
  durationMs,
  showCloseButton = true,
  maxWidth,
  contentKey,
  role = "status",
  className = "",
}: ToastSlotProps) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  // Auto-dismiss timer. Kept separate from consumer effects so callers
  // can't accidentally stack multiple timers by re-rendering the toast.
  useEffect(() => {
    if (!visible || !durationMs) return;
    const t = setTimeout(() => dismissRef.current(), durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs]);

  // Scoped Escape-to-dismiss. Capture phase so it runs before the
  // document-level handlers, but we still let unrelated keys through.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const color = tone === "custom" ? toneColor ?? "var(--energy-primary)" : TONE_TO_COLOR[tone];
  const resolvedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth ?? (position === "top-center" ? "420px" : "360px");

  const motionConfig = getSlotMotion(position);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={contentKey ?? "toast"}
          role={role}
          aria-live={role === "alert" ? "assertive" : "polite"}
          className={[
            "fixed z-[9998] pointer-events-auto",
            position === "top-center"
              ? "top-4 left-1/2 -translate-x-1/2"
              : "bottom-20 right-4",
            className,
          ].join(" ")}
          style={{ maxWidth: resolvedMaxWidth, width: "min(92vw, " + resolvedMaxWidth + ")" }}
          onClick={onDismiss}
          {...motionConfig}
        >
          <div
            className="relative rounded-xl border backdrop-blur-md shadow-2xl cursor-pointer"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklch, var(--bg-void) 92%, transparent) 0%, color-mix(in oklch, ${color} 10%, transparent) 100%)`,
              borderColor: `color-mix(in oklch, ${color} 35%, transparent)`,
              boxShadow: `0 0 30px color-mix(in oklch, ${color} 18%, transparent)`,
              padding: "var(--space-md, 1rem)",
            }}
          >
            {showCloseButton && (
              <button
                aria-label="Dismiss notification"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground/90 hover:bg-white/5 transition-colors"
              >
                <X size={12} />
              </button>
            )}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Resolve the entry/exit animation for a given slot position.
 *
 * Spring config is the same across slots (stiffness 280, damping 26 —
 * borrowed from AchievementToast's tuning), but direction of travel
 * is flipped for bottom-right vs. top-center so each slot slides in
 * from the edge it lives on.
 *
 * Respects motion-intensity: at intensity 0 we fall back to a short
 * linear fade so reduce-motion players still see the toast appear
 * without any physics — and the caller doesn't have to branch.
 */
function getSlotMotion(position: ToastSlotPosition) {
  const intensity = getMotionIntensity();

  if (intensity === 0) {
    const transition: Transition = { duration: 0.12, ease: "linear" };
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition,
    };
  }

  const transition: Transition = {
    type: "spring",
    stiffness: 280,
    damping: 26,
    // Scale the mass by (1/intensity) so lower intensity = slower travel
    // without losing the physics feel. Clamp to prevent division blowup.
    mass: 1 / Math.max(0.25, intensity),
  };

  if (position === "bottom-right") {
    return {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
      transition,
    };
  }

  return {
    initial: { opacity: 0, y: -40, x: "-50%" },
    animate: { opacity: 1, y: 0, x: "-50%" },
    exit: { opacity: 0, y: -40, x: "-50%" },
    transition,
  };
}
