/* ═══════════════════════════════════════════════════════
   TradeConvergencePanel — Phase D.5 doom-clock + sector
   saturation HUD, plus the 3 canonical climax resolutions.

   This is the Convergence tab of the unified Trade Empire
   hub. It surfaces the schema-first work that's been
   waiting for a UI:

     • Doom clock (convergenceClimaxState singleton, 0..100)
     • Phase indicator (dormant / open / resolved) and the
       72h close-window countdown when open.
     • Saturation HUD — per-anchor-sector oversupply score
       (0..200) with a price-crash multiplier read-out.
     • The 3 canonical resolution cards (rendered when the
       climax window is open). Selecting one is a follow-up
       wiring in tradeEmpire.ts.

   No new server queries are added — everything reads from
   existing procedures: getConvergenceClimaxState,
   getSectorSaturation. The resolutions data ships in
   apps/shared/tradeEmpire/convergenceClimax.ts.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  CANONICAL_CLIMAX_RESOLUTION_KEYS,
  CLIMAX_WINDOW_MS,
  getCanonicalClimaxResolutions,
  type ClimaxResolution,
} from "@shared/tradeEmpire/convergenceClimax";

interface TradeConvergencePanelProps {
  /** Anchor sectors whose saturation appears in the HUD. */
  anchorSectorIds?: ReadonlyArray<string>;
}

const DEFAULT_ANCHOR_SECTORS: ReadonlyArray<string> = [
  "trade_nexus",
  "the_trench",
  "antiquarian_archive",
  "degens_casino",
  "thaloria",
  "free_port_alpha",
  "ark_debris_field",
  "terminus_approach",
];

const SAT_MAX = 200;

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0h 0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function priceMultiplierFromSaturation(saturation: number): number {
  // Mirrors tradeRouteSaturationService.applySaturationToPrice's
  // 1 - saturation/400 formula. Saturation 0 → 1.0; 200 → 0.5.
  return Math.max(0.5, 1 - saturation / 400);
}

const RESOLUTIONS: ReadonlyArray<ClimaxResolution> =
  getCanonicalClimaxResolutions();

/**
 * Doom clock dial — pure SVG, no asset dependency. Fills clockwise
 * from 12 o'clock as convergence rises 0→100. Color shifts from
 * cool-cobalt at 0 through amber at 50 to oxblood at 100.
 */
function DoomClock({ convergence }: { convergence: number }) {
  const clamped = Math.max(0, Math.min(100, convergence));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const filled = (clamped / 100) * circumference;

  const hue = 200 - (clamped / 100) * 200; // 200=cobalt, 0=oxblood
  const fillColor = `hsl(${hue}, 65%, 45%)`;

  return (
    <div className="flex items-center justify-center">
      <svg width={160} height={160} viewBox="0 0 160 160">
        {/* Outer ring (background) */}
        <circle
          cx={80}
          cy={80}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
        />
        {/* Filled arc */}
        <motion.circle
          cx={80}
          cy={80}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 80 80)"
          initial={false}
          animate={{
            strokeDasharray: `${filled} ${circumference}`,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Centre numeral */}
        <text
          x={80}
          y={80}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.92)"
          fontSize="32"
          fontFamily="ui-monospace, monospace"
        >
          {Math.round(clamped)}
        </text>
        <text
          x={80}
          y={106}
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="10"
          letterSpacing={2}
        >
          CONVERGENCE
        </text>
      </svg>
    </div>
  );
}

/**
 * Saturation gauge for a single sector — 0..200 horizontal bar,
 * filled red as saturation rises (markets oversupplied → prices
 * crash). Renders the price multiplier next to the bar.
 */
function SaturationGauge({
  sectorId,
  saturation,
}: {
  sectorId: string;
  saturation: number;
}) {
  const filled = Math.max(0, Math.min(SAT_MAX, saturation));
  const pct = (filled / SAT_MAX) * 100;
  const multiplier = priceMultiplierFromSaturation(filled);

  // Hue shifts 140 (green, low sat) → 0 (red, max sat).
  const hue = 140 - (filled / SAT_MAX) * 140;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-32 text-white/70">{sectorId}</div>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `hsl(${hue}, 70%, 45%)` }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="w-20 text-right font-mono text-xs text-white/65">
        {filled}/{SAT_MAX}
      </div>
      <div className="w-16 text-right font-mono text-xs text-white/45">
        ×{multiplier.toFixed(2)}
      </div>
    </div>
  );
}

function ResolutionCard({ r }: { r: ClimaxResolution }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-base font-semibold text-white/90">{r.label}</h4>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {r.resolutionKey}
        </span>
      </div>
      <p className="mb-3 text-sm text-white/70">{r.loreContext}</p>
      <details className="text-xs text-white/55">
        <summary className="cursor-pointer text-white/65">
          Read narrative
        </summary>
        <p className="mt-2 whitespace-pre-line">{r.narrative}</p>
      </details>
      <div className="mt-3 grid grid-cols-1 gap-1 text-[11px] text-white/50">
        <div className="font-semibold uppercase tracking-wider text-white/60">
          Cascade
        </div>
        {r.cascade.map((line, i) => (
          <div key={i}>· {line}</div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-white/40">
        Affects {r.subHouseDeltas.length} sub-houses · resets the doom clock.
      </div>
    </div>
  );
}

function SectorSaturationRow({ sectorId }: { sectorId: string }) {
  const q = trpc.tradeEmpire.getSectorSaturation.useQuery({ sectorId });
  const saturation = q.data?.saturation ?? 0;
  return <SaturationGauge sectorId={sectorId} saturation={saturation} />;
}

export default function TradeConvergencePanel({
  anchorSectorIds = DEFAULT_ANCHOR_SECTORS,
}: TradeConvergencePanelProps) {
  const climax = trpc.tradeEmpire.getConvergenceClimaxState.useQuery();
  const climaxRow = climax.data;

  const phase = climaxRow?.phase ?? "dormant";
  const convergence = climaxRow?.convergence ?? 0;
  const closesAtMs = climaxRow?.closesAtMs ?? null;

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (phase !== "open" || closesAtMs === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => window.clearInterval(id);
  }, [phase, closesAtMs]);

  const remainingMs =
    phase === "open" && closesAtMs !== null
      ? Math.max(0, closesAtMs - now)
      : null;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-white/90">
          Convergence
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
          phase: {phase}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        <div>
          <DoomClock convergence={convergence} />
          {phase === "open" && remainingMs !== null && (
            <div className="mt-2 text-center font-mono text-sm text-amber-200/85">
              window closes in {formatCountdown(remainingMs)}
            </div>
          )}
          {phase === "dormant" && (
            <div className="mt-2 text-center text-xs text-white/45">
              fires when convergence reaches 100
            </div>
          )}
          {phase === "resolved" && climaxRow?.resolutionKey && (
            <div className="mt-2 text-center text-xs text-white/55">
              resolved: <span className="font-mono">{climaxRow.resolutionKey}</span>
            </div>
          )}
          <div className="mt-1 text-center text-[10px] text-white/35">
            window: {Math.round(CLIMAX_WINDOW_MS / 3600000)}h
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
            Sector saturation
          </h3>
          <div className="space-y-2">
            {anchorSectorIds.map(s => (
              <SectorSaturationRow key={s} sectorId={s} />
            ))}
          </div>
          <p className="mt-3 text-[11px] text-white/40">
            Saturation 0..200. Price multiplier = 1 − saturation/400.
            Decays 1pt/hr; bumped on every mission completion.
          </p>
        </div>
      </div>

      {phase === "open" && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
            Resolutions ({CANONICAL_CLIMAX_RESOLUTION_KEYS.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {RESOLUTIONS.map(r => (
              <ResolutionCard key={r.resolutionKey} r={r} />
            ))}
          </div>
          <p className="mt-3 text-[11px] text-white/40">
            Auto-resolves to "no choice" if the window closes
            without a selection. The doom clock resets either way.
          </p>
        </section>
      )}

      {phase !== "open" && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
            Resolutions (preview)
          </h3>
          <p className="mb-3 text-xs text-white/45">
            Visible only when the climax window is open. Surfaced
            here at low opacity so you can read what's coming.
          </p>
          <div className="grid grid-cols-1 gap-3 opacity-60 lg:grid-cols-3">
            {RESOLUTIONS.map(r => (
              <ResolutionCard key={r.resolutionKey} r={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
