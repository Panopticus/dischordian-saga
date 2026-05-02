/* ═══════════════════════════════════════════════════════
   REALITY FRONT MAP — Helldivers-2-style cosmic chart.

   A self-contained SVG map of the Reality Front sectors. Each
   sector is positioned on a golden-angle spiral; the sector
   tint reflects its current Order ↔ Dream lean (driven by the
   active vote's binding + live tally), and active-vote sectors
   pulse with a thicker dashed ring.

   Slice 3 ships a client-side derivation: the score per sector
   comes from the current vote's option bindings + the live
   tally. A future slice promotes this to a real warTerritories
   binding so the map persists across votes and surfaces
   permanent stamped marks on close.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import {
  REALITY_FRONT_SECTOR_IDS,
  getFrontBinding,
  type RealityFrontSectorId,
} from "@shared/governanceFrontBindings";

interface SectorPos {
  id: RealityFrontSectorId;
  x: number;
  y: number;
}

const VIEW_W = 320;
const VIEW_H = 320;
const CENTER_X = VIEW_W / 2;
const CENTER_Y = VIEW_H / 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function spiralPositions(sectors: readonly RealityFrontSectorId[]): SectorPos[] {
  const positions: SectorPos[] = [];
  const radiusStep = 12;
  for (let i = 0; i < sectors.length; i++) {
    const r = radiusStep + Math.sqrt(i) * 28;
    const angle = i * GOLDEN;
    const x = CENTER_X + r * Math.cos(angle);
    const y = CENTER_Y + r * Math.sin(angle);
    positions.push({ id: sectors[i], x, y });
  }
  return positions;
}

interface RealityFrontMapProps {
  /** Current active vote id — drives which sectors highlight. */
  activeVoteId?: string | null;
  /** Live tally for the active vote, keyed by 1-based optionNumber.
   *  Ratios drive the per-sector tint magnitude. */
  activeVoteTally?: Readonly<Record<number, number>>;
  /** Vote #0 result, optional — if the player has cast it, the
   *  affected sectors carry a permanent baseline tint. */
  voteZeroResponse?: "confirmed" | "looked_away" | null;
}

export default function RealityFrontMap({
  activeVoteId,
  activeVoteTally,
  voteZeroResponse,
}: RealityFrontMapProps) {
  const positions = useMemo(() => spiralPositions(REALITY_FRONT_SECTOR_IDS), []);

  // Compute a tint score per sector (-1 = full Dream, +1 = full
  // Order). Combines:
  //   - Vote #0 baseline (small, persistent)
  //   - Active-vote leading-option binding (larger, transient)
  const sectorScores = useMemo(() => {
    const scores = new Map<RealityFrontSectorId, number>();
    for (const id of REALITY_FRONT_SECTOR_IDS) scores.set(id, 0);

    // Vote #0 baseline.
    if (voteZeroResponse) {
      const v0 = getFrontBinding("vote_zero_eye");
      if (v0) {
        const opt = voteZeroResponse === "confirmed" ? v0.options[1] : v0.options[2];
        if (opt) {
          const sign = opt.controlDelta >= 0 ? 1 : -1;
          for (const sector of opt.affectedSectors) {
            const cur = scores.get(sector) ?? 0;
            scores.set(sector, cur + sign * 0.25);
          }
        }
      }
    }

    // Active vote — accumulate per-option tilt weighted by share.
    if (activeVoteId && activeVoteTally) {
      const binding = getFrontBinding(activeVoteId);
      const totalCast = Object.values(activeVoteTally).reduce((a, b) => a + b, 0);
      if (binding && totalCast > 0) {
        for (const [optNumStr, count] of Object.entries(activeVoteTally)) {
          const optNum = Number(optNumStr);
          const opt = binding.options[optNum];
          if (!opt) continue;
          const share = count / totalCast;
          const sign = opt.controlDelta >= 0 ? 1 : -1;
          // Up to ±0.75 per sector at full share.
          const magnitude = sign * share * 0.75;
          for (const sector of opt.affectedSectors) {
            const cur = scores.get(sector) ?? 0;
            scores.set(sector, cur + magnitude);
          }
        }
      }
    }

    // Clamp to [-1, 1].
    for (const [k, v] of scores) {
      scores.set(k, Math.max(-1, Math.min(1, v)));
    }
    return scores;
  }, [activeVoteId, activeVoteTally, voteZeroResponse]);

  const highlightedSectors = useMemo(() => {
    if (!activeVoteId) return new Set<RealityFrontSectorId>();
    const binding = getFrontBinding(activeVoteId);
    if (!binding) return new Set<RealityFrontSectorId>();
    const all = new Set<RealityFrontSectorId>();
    for (const opt of Object.values(binding.options)) {
      for (const s of opt.affectedSectors) all.add(s);
    }
    return all;
  }, [activeVoteId]);

  return (
    <div className="void-elevated p-3 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/60">
          REALITY FRONT — SECTOR CHART
        </div>
        <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted-foreground/40">
          {REALITY_FRONT_SECTOR_IDS.length} SECTORS
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        style={{ aspectRatio: "1 / 1", maxHeight: "min(420px, 50vh)" }}
        role="img"
        aria-label="Reality Front sector chart"
      >
        {/* Soft radial nebula background. */}
        <defs>
          <radialGradient id="rfm-nebula" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(120,100,180,0.18)" />
            <stop offset="60%" stopColor="rgba(40,30,80,0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="rfm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="url(#rfm-nebula)" />

        {/* Faint connecting ribs along the spiral so the layout
            reads as a structure, not a scatter. */}
        {positions.map((p, i) => {
          if (i === 0) return null;
          const prev = positions[i - 1];
          return (
            <line
              key={`rib-${p.id}`}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.6}
            />
          );
        })}

        {/* Sectors. */}
        {positions.map((p) => {
          const score = sectorScores.get(p.id) ?? 0;
          // Map score -1..1 → tint (Dream violet ↔ Order blue).
          const orderHue = 200; // blue
          const dreamHue = 285; // violet
          const hue = score >= 0 ? orderHue : dreamHue;
          const sat = 60 + Math.abs(score) * 25;
          const lit = 50 + Math.abs(score) * 15;
          const fill = `hsl(${hue} ${sat}% ${lit}% / ${0.35 + Math.abs(score) * 0.45})`;
          const stroke = `hsl(${hue} ${sat}% ${Math.min(80, lit + 15)}% / 0.85)`;
          const radius = 6 + Math.abs(score) * 3;
          const isHighlighted = highlightedSectors.has(p.id);

          return (
            <g key={p.id} filter={isHighlighted ? "url(#rfm-glow)" : undefined}>
              {isHighlighted && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius + 6}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  opacity={0.55}
                >
                  <animate attributeName="r" values={`${radius + 4};${radius + 8};${radius + 4}`} dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={radius}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.2}
              >
                <title>{prettyName(p.id)} · {score >= 0 ? "Order" : "Dream"} {(Math.abs(score) * 100).toFixed(0)}%</title>
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted-foreground/40">
          DASHED RING · AFFECTED BY THE OPEN DIRECTIVE
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted-foreground/40">
          BLUE · ORDER &nbsp;·&nbsp; VIOLET · DREAM
        </span>
      </div>
    </div>
  );
}

function prettyName(id: RealityFrontSectorId): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
