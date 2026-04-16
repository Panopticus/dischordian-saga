/**
 * ElaraFadeOut — Hologram opacity fade over 2s.
 *
 * Beat H.5. One-shot. Bible §15.6, §18.4.
 * Reusable for any beat where Elara's hologram ends.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function ElaraFadeOut({ active, onComplete, className = "" }: PreludeVfxProps) {
  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        animation: "pvfx-elara-fade 2s ease-out forwards",
        pointerEvents: "none",
      }}
      onAnimationEnd={onComplete}
    />
  );
}

registerPreludeVfx("vfx_elara_fade_out", {
  component: ElaraFadeOut,
  label: "Elara Fade Out",
  mode: "one-shot",
});
