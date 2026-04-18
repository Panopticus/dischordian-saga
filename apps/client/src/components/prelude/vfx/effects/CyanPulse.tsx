/**
 * CyanPulse — Shared component for cyan-pulsing VFX effects.
 *
 * Used by:
 * - vfx_incubator_pod_dormant_glow (sub-1 Hz shimmer, Beat C)
 * - vfx_med_pod_faint_pulse (sub-0.5 Hz pulse, Beat G)
 * - vfx_signal_intake_lit_panel (sub-0.25 Hz, 6 instances, Beat H)
 * - vfx_neural_rig_idle_hum_visual (micro-shimmer, Beat G)
 *
 * Bible §18.4 for ambient/environmental specs.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type CyanVariant = "shimmer" | "faint" | "signal" | "micro";

const VARIANT_CONFIG: Record<CyanVariant, { animation: string; color: string; size: string }> = {
  shimmer: {
    animation: "pvfx-cyan-shimmer 1.2s ease-in-out infinite",
    color: "var(--energy-primary)",
    size: "48px",
  },
  faint: {
    animation: "pvfx-faint-pulse 2.2s ease-in-out infinite",
    color: "var(--energy-primary)",
    size: "32px",
  },
  signal: {
    animation: "pvfx-signal-pulse 4s ease-in-out infinite",
    color: "var(--energy-primary)",
    size: "24px",
  },
  micro: {
    animation: "pvfx-micro-shimmer 1.5s ease-in-out infinite",
    color: "var(--energy-primary)",
    size: "16px",
  },
};

interface CyanPulseProps extends PreludeVfxProps {
  variant: CyanVariant;
  /** Number of instances to render (signal-intake has 6). */
  instances?: number;
}

export function CyanPulse({ active, variant, instances = 1, onComplete, className = "" }: CyanPulseProps) {
  if (!active) return null;
  const config = VARIANT_CONFIG[variant];

  return (
    <>
      {Array.from({ length: instances }, (_, i) => (
        <div
          key={i}
          className={className}
          style={{
            position: "absolute",
            width: config.size,
            height: config.size,
            borderRadius: "50%",
            backgroundColor: config.color,
            animation: config.animation,
            animationDelay: `${i * 0.4}s`,
            boxShadow: `0 0 12px ${config.color}`,
            pointerEvents: "none",
          }}
          onAnimationEnd={onComplete}
        />
      ))}
    </>
  );
}

/* ─── Wrapper components for registry ─── */

function IncubatorPodDormantGlow(props: PreludeVfxProps) {
  return <CyanPulse {...props} variant="shimmer" />;
}
function MedPodFaintPulse(props: PreludeVfxProps) {
  return <CyanPulse {...props} variant="faint" />;
}
function SignalIntakeLitPanel(props: PreludeVfxProps) {
  return <CyanPulse {...props} variant="signal" instances={6} />;
}
function NeuralRigIdleHum(props: PreludeVfxProps) {
  return <CyanPulse {...props} variant="micro" />;
}

/* ─── Registration ─── */

registerPreludeVfx("vfx_incubator_pod_dormant_glow", {
  component: IncubatorPodDormantGlow,
  label: "Incubator Pod Dormant Glow",
  mode: "continuous",
});
registerPreludeVfx("vfx_med_pod_faint_pulse", {
  component: MedPodFaintPulse,
  label: "Med Pod Faint Pulse",
  mode: "continuous",
});
registerPreludeVfx("vfx_signal_intake_lit_panel", {
  component: SignalIntakeLitPanel,
  label: "Signal Intake Lit Panel",
  mode: "continuous",
});
registerPreludeVfx("vfx_neural_rig_idle_hum_visual", {
  component: NeuralRigIdleHum,
  label: "Neural Rig Idle Hum Visual",
  mode: "continuous",
});
