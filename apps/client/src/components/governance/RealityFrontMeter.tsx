/* ═══════════════════════════════════════════════════════
   REALITY FRONT METER — horizontal aperture iris.

   Renders the Order ↔ Dream balance as a thin horizontal bar
   with six tick marks aligned to the apertureBand thresholds.
   The Architect's current commentary line (or a derived caption)
   sits directly under the meter.

   Pure render — `score` is computed by the caller via
   computeAperture(). The meter does not query state.
   ═══════════════════════════════════════════════════════ */
import { motion } from "framer-motion";
import { apertureBand, type ApertureBand } from "@shared/aperture";

interface RealityFrontMeterProps {
  /** -100 (open / Dream) ↔ +100 (closed / Order). */
  score: number;
  /** Caption rendered under the meter — typically the Architect's
   *  band line. Optional. */
  caption?: string;
}

const BAND_LABELS: Record<ApertureBand, string> = {
  open_overwhelming: "DRIFT",
  open_strong: "OPEN",
  open_narrow: "AJAR",
  closed_narrow: "HOLD",
  closed_strong: "SET",
  closed_overwhelming: "STILL",
};

export default function RealityFrontMeter({ score, caption }: RealityFrontMeterProps) {
  // Map -100..+100 → 0..100 percent for the indicator dot.
  const pct = Math.max(0, Math.min(100, ((score + 100) / 200) * 100));
  const band = apertureBand(score);

  // Six tick positions: -75, -45, -15, +15, +45, +75 → percent.
  const tickPositions = [-75, -45, -15, 15, 45, 75].map(v => ((v + 100) / 200) * 100);
  const tickLabels: ApertureBand[] = [
    "open_overwhelming",
    "open_strong",
    "open_narrow",
    "closed_narrow",
    "closed_strong",
    "closed_overwhelming",
  ];

  return (
    <div className="void-elevated p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/60">
          REALITY FRONT
        </div>
        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">
          {BAND_LABELS[band]}
        </div>
      </div>

      {/* The meter — track + ticks + indicator. */}
      <div className="relative" style={{ paddingTop: "8px", paddingBottom: "20px" }}>
        {/* Track */}
        <div
          className="relative h-2 rounded-full overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in oklch, var(--energy-error) 18%, transparent) 0%, rgba(255,255,255,0.06) 50%, color-mix(in oklch, var(--energy-primary) 22%, transparent) 100%)",
          }}
          aria-hidden
        />

        {/* Tick marks */}
        {tickPositions.map((p, i) => (
          <div
            key={tickLabels[i]}
            className="absolute"
            style={{
              left: `${p}%`,
              top: "8px",
              width: "1px",
              height: "8px",
              background: "rgba(255,255,255,0.18)",
              transform: "translateX(-0.5px)",
            }}
            aria-hidden
          />
        ))}

        {/* Indicator dot — pulses softly. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute"
          style={{
            top: "4px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "var(--energy-primary)",
            boxShadow: "0 0 14px color-mix(in oklch, var(--energy-primary) 65%, transparent)",
            transform: "translateX(-5px)",
          }}
        />

        {/* End-cap labels */}
        <div className="absolute" style={{ top: "20px", left: 0 }}>
          <span className="font-mono text-[7px] tracking-[0.18em] uppercase text-muted-foreground/40">DREAM</span>
        </div>
        <div className="absolute" style={{ top: "20px", right: 0 }}>
          <span className="font-mono text-[7px] tracking-[0.18em] uppercase text-muted-foreground/40">ORDER</span>
        </div>
      </div>

      {caption && (
        <p className="font-serif text-[11px] italic text-foreground/75 leading-relaxed mt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
