/* ═══════════════════════════════════════════════════════
   ALLIANCE WAR MAP — 19-node honeycomb hex grid visualiser
   Renders the war grid, connection lines, defender status
   and attack targets for a guild-vs-guild war.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Swords, Crown, Trophy, X, Zap } from "lucide-react";
import type { WarMap, WarNode, WarNodeType } from "@shared/allianceWar";

/* ─── LAYOUT CONSTANTS ─── */
const HEX_WIDTH = 80;
const HEX_HALF = HEX_WIDTH / 2;
const HORIZONTAL_OFFSET = 70;
const VERTICAL_OFFSET = 60;
const ODD_ROW_SHIFT = 35;
const SVG_PADDING_X = 40;
const SVG_PADDING_Y = 40;

const ROW_COUNTS = [5, 4, 5, 4, 1];

/* ─── TYPE STYLES ─── */
const NODE_STYLES: Record<WarNodeType, {
  fill: string;
  stroke: string;
  glow: string;
  label: string;
}> = {
  path: { fill: "#4b5563", stroke: "#d1d5db", glow: "#9ca3af", label: "Path" },
  gate: { fill: "#6b21a8", stroke: "#c084fc", glow: "#a855f7", label: "Gate +20%" },
  buff: { fill: "#166534", stroke: "#4ade80", glow: "#22c55e", label: "Buff" },
  trap: { fill: "#7f1d1d", stroke: "#f87171", glow: "#ef4444", label: "Trap" },
  boss: { fill: "#78350f", stroke: "#fbbf24", glow: "#f59e0b", label: "Boss" },
};

interface AllianceWarMapProps {
  warMap: WarMap;
  isDefensePhase: boolean;
  myGuildId: string;
  onNodeClick: (nodeId: string) => void;
  clearedNodes: Set<string>;
  contestedNodeIds?: Set<string>;
  guildAName?: string;
  guildBName?: string;
  guildAScore?: number;
  guildBScore?: number;
  currentTurnGuildId?: string;
  attacksUsed?: number;
  maxAttacks?: number;
  phaseLabel?: string;
}

/* ─── HEX GEOMETRY ─── */
function hexPoints(cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function nodeCenter(row: number, col: number): { cx: number; cy: number } {
  const rowWidth = ROW_COUNTS[row];
  const maxWidth = Math.max(...ROW_COUNTS);
  const rowOffset = ((maxWidth - rowWidth) * HORIZONTAL_OFFSET) / 2;
  const shift = row % 2 === 1 ? ODD_ROW_SHIFT : 0;
  const cx = SVG_PADDING_X + HEX_HALF + rowOffset + shift + col * HORIZONTAL_OFFSET;
  const cy = SVG_PADDING_Y + HEX_HALF + row * VERTICAL_OFFSET;
  return { cx, cy };
}

/* ─── ICON HELPERS ─── */
function NodeIcon({ type, size = 20 }: { type: WarNodeType; size?: number }) {
  const props = { width: size, height: size, className: "pointer-events-none" };
  switch (type) {
    case "boss": return <Crown {...props} />;
    case "gate": return <Shield {...props} />;
    case "buff": return <Zap {...props} />;
    case "trap": return <X {...props} />;
    default: return null;
  }
}

/* ─── MAIN COMPONENT ─── */
export default function AllianceWarMap({
  warMap,
  isDefensePhase,
  myGuildId,
  onNodeClick,
  clearedNodes,
}: AllianceWarMapProps) {
  void myGuildId;

  const { width, height, positions } = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number }>();
    let maxX = 0;
    let maxY = 0;
    for (const node of warMap.nodes) {
      const { cx, cy } = nodeCenter(node.position.row, node.position.col);
      map.set(node.id, { cx, cy });
      if (cx > maxX) maxX = cx;
      if (cy > maxY) maxY = cy;
    }
    return {
      width: maxX + HEX_HALF + SVG_PADDING_X,
      height: maxY + HEX_HALF + SVG_PADDING_Y,
      positions: map,
    };
  }, [warMap]);

  // Deduplicate connections (a<->b only drawn once)
  const connectionLines = useMemo(() => {
    const seen = new Set<string>();
    const lines: { from: string; to: string; x1: number; y1: number; x2: number; y2: number; active: boolean }[] = [];
    for (const node of warMap.nodes) {
      for (const connId of node.connections) {
        const key = [node.id, connId].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        const a = positions.get(node.id);
        const b = positions.get(connId);
        if (!a || !b) continue;
        const active = clearedNodes.has(node.id) || clearedNodes.has(connId);
        lines.push({ from: node.id, to: connId, x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy, active });
      }
    }
    return lines;
  }, [warMap, positions, clearedNodes]);

  return (
    <div className="relative w-full overflow-x-auto rounded-lg border border-purple-900/40 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 shadow-[0_0_60px_rgba(139,92,246,0.15)_inset]">
      {/* Phase banner */}
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest">
        <span className={`flex items-center gap-2 rounded px-3 py-1 font-bold ${
          isDefensePhase
            ? "bg-purple-900/40 text-purple-300 ring-1 ring-purple-500/50"
            : "bg-red-900/40 text-red-300 ring-1 ring-red-500/50"
        }`}>
          {isDefensePhase ? <Shield size={14} /> : <Swords size={14} />}
          {isDefensePhase ? "Defense Placement" : "Attack Phase"}
        </span>
        <span className="text-slate-500">19 Nodes · 5-4-5-4-1</span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block"
        style={{ maxWidth: "100%" }}
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x={0} y={0} width={width} height={height} fill="url(#bgGlow)" />

        {/* Connection lines */}
        <g strokeLinecap="round">
          {connectionLines.map((line) => (
            <line
              key={`${line.from}-${line.to}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.active ? "#a855f7" : "#334155"}
              strokeWidth={line.active ? 2.5 : 1.5}
              strokeOpacity={line.active ? 0.8 : 0.5}
              strokeDasharray={line.active ? "0" : "4 3"}
            />
          ))}
        </g>

        {/* Nodes */}
        {warMap.nodes.map((node, idx) => (
          <HexNodeSvg
            key={node.id}
            node={node}
            center={positions.get(node.id)!}
            cleared={clearedNodes.has(node.id)}
            contested={!!node.defenderId && !clearedNodes.has(node.id)}
            isDefensePhase={isDefensePhase}
            index={idx}
            onClick={() => onNodeClick(node.id)}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── HEX NODE SVG ─── */
interface HexNodeSvgProps {
  node: WarNode;
  center: { cx: number; cy: number };
  cleared: boolean;
  contested: boolean;
  isDefensePhase: boolean;
  index: number;
  onClick: () => void;
}

function HexNodeSvg({
  node, center, cleared, contested, isDefensePhase, index, onClick,
}: HexNodeSvgProps) {
  const style = NODE_STYLES[node.type];
  const { cx, cy } = center;
  const hasDefender = !!node.defenderId;
  const points = hexPoints(cx, cy, HEX_HALF);

  // Boss nodes are bigger
  const isBoss = node.type === "boss";
  const scale = isBoss ? 1.15 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: cleared ? 0.45 : 1, scale }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      style={{ cursor: "pointer", transformOrigin: `${cx}px ${cy}px` }}
      data-testid={`war-node-${node.id}`}
    >
      {/* Outer pulse ring for contested nodes */}
      {contested && !cleared && (
        <motion.polygon
          points={hexPoints(cx, cy, HEX_HALF + 6)}
          fill="none"
          stroke={style.glow}
          strokeWidth={2}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}

      {/* Hex base */}
      <polygon
        points={points}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={2}
        filter="url(#nodeGlow)"
        opacity={cleared ? 0.5 : 1}
      />

      {/* Inner decoration polygon */}
      <polygon
        points={hexPoints(cx, cy, HEX_HALF * 0.72)}
        fill="none"
        stroke={style.glow}
        strokeWidth={1}
        strokeOpacity={0.45}
      />

      {/* Icon (HTML via foreignObject for lucide) */}
      <foreignObject
        x={cx - 12}
        y={cy - 22}
        width={24}
        height={24}
        className="pointer-events-none"
      >
        <div
          style={{ color: style.stroke, display: "flex", justifyContent: "center" }}
          className="drop-shadow"
        >
          <NodeIcon type={node.type} size={isBoss ? 26 : 20} />
        </div>
      </foreignObject>

      {/* Defender marker dot */}
      {hasDefender && (
        <circle
          cx={cx}
          cy={cy + 8}
          r={5}
          fill="#22c55e"
          stroke="#052e16"
          strokeWidth={1.5}
        />
      )}

      {/* Empty defender slot indicator (defense phase) */}
      {!hasDefender && isDefensePhase && !isBoss && (
        <circle
          cx={cx}
          cy={cy + 8}
          r={4}
          fill="none"
          stroke="#64748b"
          strokeWidth={1.2}
          strokeDasharray="2 2"
        />
      )}

      {/* Cleared checkmark overlay */}
      {cleared && (
        <g>
          <circle cx={cx} cy={cy} r={HEX_HALF * 0.55} fill="rgba(0,0,0,0.55)" />
          <path
            d={`M ${cx - 10} ${cy} L ${cx - 2} ${cy + 8} L ${cx + 12} ${cy - 8}`}
            stroke="#4ade80"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )}

      {/* Boss hits remaining pips */}
      {isBoss && !cleared && node.bossHitsRemaining > 0 && (
        <g>
          {Array.from({ length: node.bossHitsRemaining }).map((_, i) => (
            <circle
              key={i}
              cx={cx - 8 + i * 8}
              cy={cy + HEX_HALF - 6}
              r={2.5}
              fill="#fbbf24"
            />
          ))}
        </g>
      )}

      {/* Node id label (debug-ish small caption) */}
      <text
        x={cx}
        y={cy + HEX_HALF + 14}
        textAnchor="middle"
        fontSize={9}
        fill="#64748b"
        className="pointer-events-none select-none uppercase tracking-wider"
      >
        {style.label}
      </text>
    </motion.g>
  );
}

/* ─── LEGEND (exported helper) ─── */
export function WarMapLegend() {
  const entries: { type: WarNodeType; desc: string }[] = [
    { type: "path", desc: "Standard path node" },
    { type: "gate", desc: "+20% defender stats" },
    { type: "buff", desc: "+10% attack when cleared" },
    { type: "trap", desc: "Penalises attackers" },
    { type: "boss", desc: "Final node · 3 hits" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
      {entries.map(({ type, desc }) => {
        const s = NODE_STYLES[type];
        return (
          <div
            key={type}
            className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900/50 px-2 py-1.5"
          >
            <span
              className="inline-block h-4 w-4 rotate-45 rounded-sm"
              style={{ background: s.fill, outline: `1.5px solid ${s.stroke}` }}
            />
            <div className="leading-tight">
              <div className="font-semibold text-slate-200">{s.label}</div>
              <div className="text-[10px] text-slate-500">{desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── WAR HEADER (score display + turn indicator) ─── */
interface WarHeaderProps {
  guildAName: string;
  guildBName: string;
  guildAScore: number;
  guildBScore: number;
  isDefensePhase: boolean;
  phaseEnded: boolean;
  attacksUsed: number;
  maxAttacks: number;
}

export function WarHeader({
  guildAName, guildBName, guildAScore, guildBScore,
  isDefensePhase, phaseEnded, attacksUsed, maxAttacks,
}: WarHeaderProps) {
  const phaseLabel = phaseEnded
    ? "War Ended"
    : isDefensePhase
    ? "Defense Placement"
    : "Attack Phase";
  const phaseColour = phaseEnded
    ? "text-amber-400"
    : isDefensePhase
    ? "text-purple-300"
    : "text-red-400";

  return (
    <div className="flex flex-col gap-3 void-surface p-4 md:flex-row md:items-center md:justify-between">
      {/* Guild A */}
      <div className="flex flex-1 items-center gap-3">
        <Shield className="text-blue-400" size={28} />
        <div>
          <div className="text-xs uppercase text-slate-500">Allied</div>
          <div className="text-lg font-bold text-slate-100">{guildAName}</div>
        </div>
        <div className="ml-auto font-mono text-2xl font-bold text-blue-300">
          {guildAScore}
        </div>
      </div>

      {/* Center state */}
      <div className="flex flex-col items-center gap-1 px-4">
        <div className={`text-xs font-bold uppercase tracking-widest ${phaseColour}`}>
          {phaseLabel}
        </div>
        <div className="flex items-center gap-2 rounded bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
          <Swords size={12} />
          <span className="font-mono">{attacksUsed}/{maxAttacks}</span>
          <span className="text-slate-500">attacks</span>
        </div>
      </div>

      {/* Guild B */}
      <div className="flex flex-1 items-center gap-3 md:flex-row-reverse">
        <Trophy className="text-red-400" size={28} />
        <div className="md:text-right">
          <div className="text-xs uppercase text-slate-500">Enemy</div>
          <div className="text-lg font-bold text-slate-100">{guildBName}</div>
        </div>
        <div className="mr-auto font-mono text-2xl font-bold text-red-300 md:mr-0 md:ml-auto">
          {guildBScore}
        </div>
      </div>
    </div>
  );
}
