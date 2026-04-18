/**
 * ViewportPolarization — Viewport opacity 85%→65% one-shot.
 *
 * Beat I. Reveals more of the debris graveyard through viewport.
 * Bible §16.6, §18.2.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function ViewportPolarization({ active, onComplete, className = "" }: PreludeVfxProps) {
  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "color-mix(in oklch, var(--bg-void) 85%, transparent)",
        animation: "pvfx-polarization-lift 3s ease-out forwards",
        pointerEvents: "none",
      }}
      onAnimationEnd={onComplete}
    />
  );
}

registerPreludeVfx("vfx_viewport_polarization_lift", {
  component: ViewportPolarization,
  label: "Viewport Polarization Lift",
  mode: "one-shot",
});
