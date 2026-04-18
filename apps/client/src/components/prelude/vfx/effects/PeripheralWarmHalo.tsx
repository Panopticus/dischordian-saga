/**
 * PeripheralWarmHalo — Warm-amber halo on outer 15% of frame.
 *
 * Phases: 30s build → hold → fade
 * Beat J. Bible §17.6, §18.5.
 * VFX signature for "the song entering the room."
 * Does NOT touch frame-center (choice UI area).
 */
import { useEffect, useState } from "react";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type HaloPhase = "build" | "hold" | "fade";

export function PeripheralWarmHalo({ active, state, onComplete, className = "" }: PreludeVfxProps) {
  const [phase, setPhase] = useState<HaloPhase>("build");

  useEffect(() => {
    if (state === "build" || state === "hold" || state === "fade") {
      setPhase(state as HaloPhase);
    }
  }, [state]);

  if (!active) return null;

  const phaseAnimations: Record<HaloPhase, string> = {
    build: "pvfx-halo-build 30s ease-in forwards",
    hold: "pvfx-halo-hold 10s ease-in-out infinite",
    fade: "pvfx-halo-fade 5s ease-out forwards",
  };

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        background:
          "radial-gradient(ellipse at center, transparent 70%, rgba(253, 230, 138, 0.25) 85%, color-mix(in oklch, var(--energy-premium) 35%, transparent) 100%)",
        animation: phaseAnimations[phase],
      }}
      onAnimationEnd={() => {
        if (phase === "build") setPhase("hold");
        if (phase === "fade") onComplete?.();
      }}
    />
  );
}

registerPreludeVfx("vfx_peripheral_warm_halo", {
  component: PeripheralWarmHalo,
  label: "Peripheral Warm Halo",
  mode: "stateful",
});
