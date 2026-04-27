/* ═══════════════════════════════════════════════════════
   SCROLL PARALLAX — per-element scroll-driven Y translate

   Wraps a single child in a framer-motion layer whose Y offset
   interpolates with the child's position inside the viewport.
   When the element is at the top of the viewport it sits at
   `amount * height` below its natural position; when it's at
   the bottom it sits the same amount above — so as the user
   scrolls past it, the child drifts in the opposite direction
   of the scroll at a fraction of the scroll speed.

   Gives long reading surfaces (Codex entries, lore journals,
   backstory pages) the "the text is on a different depth plane
   than the art" feel you expect from Mass Effect / Control
   codex pages — the single most-requested item from the
   exploration agent's "no scroll-driven animation detected"
   report.

   Honors:
     - motion-intensity: amplitude scales from full → 0.
     - reduce-motion: motion-intensity collapses to 0 via
       the --motion-intensity CSS var our settings pipeline
       already drives, so this component gets it for free.
   ═══════════════════════════════════════════════════════ */
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getMotionIntensity } from "@/engine/motionIntensity";

interface ScrollParallaxProps {
  /** Fraction of the container height to translate by. 0.2 is subtle, 0.5 is dramatic. */
  amount?: number;
  /** Flip direction: default drifts up-on-scroll-down, set to true for opposite. */
  reverse?: boolean;
  /** Pass-through className on the wrapper. */
  className?: string;
  children: ReactNode;
}

export default function ScrollParallax({
  amount = 0.2,
  reverse = false,
  className,
  children,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  // "start end" means the top of the element meets the bottom of
  // the viewport (i.e. just scrolled into view); "end start" means
  // the bottom of the element meets the top of the viewport
  // (i.e. scrolled past). Progress goes 0 → 1 across that window.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const intensity = getMotionIntensity();
  const extent = `${amount * 100 * intensity}%`;
  const from = reverse ? `-${extent}` : extent;
  const to = reverse ? extent : `-${extent}`;

  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}
