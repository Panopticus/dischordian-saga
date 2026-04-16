/**
 * AmberGlow — Shared component for warm-amber VFX effects.
 *
 * Used by:
 * - vfx_galley_pilot_warm (brightness ramp, Beat D.5)
 * - vfx_transfer_array_amber_standby (steady glow, Beat G/J)
 *
 * Bible §18.4 for ambient specs, §18.2 for transfer-array.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type AmberVariant = "pilot" | "standby";

const VARIANT_STYLES: Record<AmberVariant, React.CSSProperties> = {
  pilot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#fbbf24",
    animation: "pvfx-pilot-warm 4s ease-in forwards",
    boxShadow: "0 0 8px #fbbf24",
  },
  standby: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#fbbf24",
    animation: "pvfx-amber-standby 3s ease-in-out infinite",
    opacity: 0.9,
  },
};

interface AmberGlowProps extends PreludeVfxProps {
  variant: AmberVariant;
}

export function AmberGlow({ active, variant, onComplete, className = "" }: AmberGlowProps) {
  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        pointerEvents: "none",
        ...VARIANT_STYLES[variant],
      }}
      onAnimationEnd={onComplete}
    />
  );
}

function GalleyPilotWarm(props: PreludeVfxProps) {
  return <AmberGlow {...props} variant="pilot" />;
}
function TransferArrayAmberStandby(props: PreludeVfxProps) {
  return <AmberGlow {...props} variant="standby" />;
}

registerPreludeVfx("vfx_galley_pilot_warm", {
  component: GalleyPilotWarm,
  label: "Galley Pilot Warm",
  mode: "one-shot",
});
registerPreludeVfx("vfx_transfer_array_amber_standby", {
  component: TransferArrayAmberStandby,
  label: "Transfer Array Amber Standby",
  mode: "continuous",
});
