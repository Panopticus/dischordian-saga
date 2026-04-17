/**
 * PrimaryLightsCascade — Directional warm light wave across viewport.
 *
 * 4s forward cascade from Witnessing Hub toward panoramic viewport.
 * Reverse variant dims back.
 * Beat I. Bible §16.6, §18.2.
 * "Single most dramatic VFX in the Prelude."
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function PrimaryLightsCascade({ active, state = "forward", onComplete, className = "" }: PreludeVfxProps) {
  if (!active) return null;

  const isReverse = state === "reverse";
  const animation = isReverse
    ? "pvfx-cascade-reverse 4s ease-in-out forwards"
    : "pvfx-cascade-forward 4s ease-in-out forwards";

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 45,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(253, 230, 138, 0.15) 20%, rgba(253, 230, 138, 0.3) 50%, rgba(253, 230, 138, 0.15) 80%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation,
      }}
      onAnimationEnd={onComplete}
    />
  );
}

registerPreludeVfx("vfx_primary_lights_cascade", {
  component: PrimaryLightsCascade,
  label: "Primary Lights Cascade",
  mode: "one-shot",
});
