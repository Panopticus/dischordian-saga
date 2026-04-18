/**
 * MemoryCrystalPulse — 12 memory crystals in a circle with state enum.
 *
 * States per crystal: dormant | bright_steady | flaring
 * Beat J. Bible §17.6, §18.5.
 * Component-ized for reuse in future Act content.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type CrystalState = "dormant" | "bright_steady" | "flaring";

const CRYSTAL_ANIMATIONS: Record<CrystalState, string> = {
  dormant: "pvfx-crystal-dormant 2.2s ease-in-out infinite",
  bright_steady: "pvfx-crystal-bright 1.5s ease-in-out infinite",
  flaring: "pvfx-crystal-flare 0.8s ease-in-out infinite",
};

const CRYSTAL_COUNT = 12;
const CIRCLE_RADIUS = 120; // px

interface MemoryCrystalProps extends PreludeVfxProps {
  /** Override individual crystal states. Index 4 = Log 5 crystal. */
  crystalStates?: Partial<Record<number, CrystalState>>;
}

export function MemoryCrystalPulse({ active, state, crystalStates, onComplete: _onComplete, className = "" }: MemoryCrystalProps) {
  if (!active) return null;

  // Default: all dormant except Log 5 crystal (index 4) which uses the state prop
  const getState = (index: number): CrystalState => {
    if (crystalStates?.[index]) return crystalStates[index]!;
    if (index === 4 && state) return state as CrystalState;
    return "dormant";
  };

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: CIRCLE_RADIUS * 2 + 40,
        height: CIRCLE_RADIUS * 2 + 40,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: CRYSTAL_COUNT }, (_, i) => {
        const angle = (i / CRYSTAL_COUNT) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * CIRCLE_RADIUS + CIRCLE_RADIUS;
        const y = Math.sin(angle) * CIRCLE_RADIUS + CIRCLE_RADIUS;
        const crystalState = getState(i);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: "16px",
              height: "24px",
              borderRadius: "4px 4px 2px 2px",
              backgroundColor: "var(--energy-primary)",
              animation: CRYSTAL_ANIMATIONS[crystalState],
              animationDelay: `${i * 0.1}s`,
              transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

registerPreludeVfx("vfx_memory_crystal_pulse", {
  component: MemoryCrystalPulse as React.ComponentType<PreludeVfxProps>,
  label: "Memory Crystal Pulse",
  mode: "stateful",
});
