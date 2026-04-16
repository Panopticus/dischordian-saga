/**
 * StatusPipShift — Beat B status pip color shift.
 *
 * Cyan→amber color transition with optional loop variant.
 * Bible §5.6, §18.2.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function StatusPipShift({ active, onComplete, className = "" }: PreludeVfxProps) {
  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        animation: "pvfx-pip-shift 3s ease-in-out infinite",
        pointerEvents: "none",
      }}
      onAnimationEnd={onComplete}
    />
  );
}

registerPreludeVfx("vfx_status_pip_color_shift", {
  component: StatusPipShift,
  label: "Status Pip Color Shift",
  mode: "continuous",
});
