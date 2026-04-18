/**
 * WitnessingHubBloom — Hemisphere bloom with 12 radial spokes.
 *
 * States: activation (one-shot) → steady_state (continuous)
 * Beat I. Bible §16.6, §18.2.
 * Steady-state persists from Beat I onward.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

const SPOKE_COUNT = 12;

export function WitnessingHubBloom({ active, state = "activation", onComplete, className = "" }: PreludeVfxProps) {
  const [phase, setPhase] = useState<"activation" | "steady_state">("activation");

  useEffect(() => {
    if (state === "steady_state") {
      setPhase("steady_state");
    } else {
      setPhase("activation");
    }
  }, [state]);

  useEffect(() => {
    if (active && phase === "activation") {
      const timer = setTimeout(() => {
        setPhase("steady_state");
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, phase, onComplete]);

  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "200px",
        height: "100px",
        pointerEvents: "none",
      }}
    >
      {/* Hemisphere dome */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "90px",
          borderRadius: "90px 90px 0 0",
          background: "radial-gradient(ellipse at bottom, color-mix(in oklch, var(--energy-primary) 30%, transparent), transparent)",
          animation: phase === "activation"
            ? "pvfx-hemisphere-activate 3s ease-out forwards"
            : "pvfx-hemisphere-steady 4s ease-in-out infinite",
          boxShadow: "0 0 40px color-mix(in oklch, var(--energy-primary) 30%, transparent)",
        }}
      />
      {/* 12 radial spokes */}
      <AnimatePresence>
        {Array.from({ length: SPOKE_COUNT }, (_, i) => {
          const angle = (i / SPOKE_COUNT) * 180; // hemisphere = 180 degrees
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "steady_state" ? 0.6 : 0 }}
              transition={{
                delay: phase === "activation" ? (i / SPOKE_COUNT) * 3 : 0,
                duration: 0.25,
              }}
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                width: "2px",
                height: "80px",
                background: "linear-gradient(to top, var(--energy-primary), transparent)",
                transformOrigin: "bottom center",
                transform: `translateX(-1px) rotate(${angle - 90}deg)`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

registerPreludeVfx("vfx_witnessing_hub_hemisphere_bloom", {
  component: WitnessingHubBloom,
  label: "Witnessing Hub Hemisphere Bloom",
  mode: "stateful",
});
