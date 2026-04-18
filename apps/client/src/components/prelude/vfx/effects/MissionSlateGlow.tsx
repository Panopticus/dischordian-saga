/**
 * MissionSlateGlow — Cyan slate pulse with highlight transition.
 *
 * States: idle (1Hz pulse) → highlight (saturate + brighten)
 * Beat D. Bible §8.6, §18.4.
 * Reused for Trade Empire mission boards in Acts 1+.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function MissionSlateGlow({ active, state = "idle", onComplete, className = "" }: PreludeVfxProps) {
  if (!active) return null;

  const isHighlighted = state === "highlight" || state === "transition";
  const animation = isHighlighted
    ? "pvfx-slate-highlight 0.4s ease-out forwards"
    : "pvfx-slate-pulse 1s ease-in-out infinite";

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "100px",
        height: "140px",
        borderRadius: "4px",
        backgroundColor: "color-mix(in oklch, var(--energy-primary) 6%, transparent)",
        border: "1px solid color-mix(in oklch, var(--energy-primary) 25%, transparent)",
        animation,
        boxShadow: isHighlighted
          ? "0 0 20px color-mix(in oklch, var(--energy-primary) 50%, transparent)"
          : "0 0 8px color-mix(in oklch, var(--energy-primary) 20%, transparent)",
        pointerEvents: "none",
      }}
      onAnimationEnd={onComplete}
    />
  );
}

registerPreludeVfx("vfx_mission_slate_glow", {
  component: MissionSlateGlow,
  label: "Mission Slate Glow",
  mode: "stateful",
});
