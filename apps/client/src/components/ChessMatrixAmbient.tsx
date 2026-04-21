/**
 * ChessMatrixAmbient — wraps the tutorial board in the
 * Matrix-of-Dreams ambient layer. Intensity ramps with gate
 * number: 0.05 at G1, 0.85 at G7.
 *
 * Styles live in `apps/client/src/styles/chessMatrix.css`. Pure
 * CSS — no JS animation cost.
 */
import { type ReactNode } from "react";
import "@/styles/chessMatrix.css";

export interface ChessMatrixAmbientProps {
  /** Current gate number (1..7). Used to derive intensity. */
  gateNumber: number;
  /** Optional override for intensity 0..1. */
  intensity?: number;
  children: ReactNode;
}

/** Per-gate intensity schedule. Linear ramp by default. */
function intensityForGate(gate: number): number {
  if (gate <= 1) return 0.05;
  if (gate >= 7) return 0.85;
  return 0.05 + ((gate - 1) / 6) * 0.8;
}

export default function ChessMatrixAmbient({
  gateNumber,
  intensity,
  children,
}: ChessMatrixAmbientProps) {
  const effective = intensity ?? intensityForGate(gateNumber);
  return (
    <div
      className="chess-matrix-ambient"
      style={{ ["--chess-matrix-intensity" as const]: effective } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
