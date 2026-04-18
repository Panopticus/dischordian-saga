/* ═══════════════════════════════════════════════════════
   CADESConspiracyBoard — SVG-based node+edge visualization
   of the CADES-related conspiracy threads. Nodes appear
   as they're discovered (via narrativeAct + CADES flags).
   Edges only render between two discovered nodes.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import {
  CADES_CONSPIRACY_NODES,
  CADES_CONSPIRACY_EDGES,
} from "@/data/cadesNarrativeIntegration";

const NODE_COLORS: Record<string, string> = {
  concept:  "var(--energy-accent)",
  faction:  "var(--energy-error)",
  default:  "#8b5cf6",
};

/** Fixed layout — each node pinned to a coordinate for a stable graph. */
const LAYOUT: Record<string, { x: number; y: number }> = {
  cades_unit:              { x: 400, y: 200 },
  matrix_of_dreams:        { x: 580, y: 120 },
  game_masters_cult:       { x: 600, y: 280 },
  game_master:             { x: 780, y: 280 },
  goggles_artifact:        { x: 780, y: 440 },
  hierarchy_of_damned:     { x: 580, y: 440 },
  xethraal:                { x: 400, y: 440 },
  iron_lion:               { x: 220, y: 120 },
  iron_lion_signal:        { x: 220, y: 280 },
  inception_arks:          { x: 220, y: 440 },
};

export function CADESConspiracyBoard() {
  const { isAuthenticated } = useAuth();
  const { state } = useGame();
  const cadesData = trpc.gameState.getCadesData.useQuery(undefined, { enabled: isAuthenticated });

  const discoveredNodeIds = useMemo(() => {
    const ids = new Set<string>();
    // Pre-seed the nodes the player knows from the core saga regardless of
    // CADES progress: matrix of dreams, game master archon, hierarchy,
    // xeth'raal, iron lion, inception arks.
    ids.add("matrix_of_dreams");
    ids.add("game_master");
    ids.add("hierarchy_of_damned");
    ids.add("xethraal");
    ids.add("iron_lion");
    ids.add("inception_arks");
    // CADES-specific nodes unlock as progress happens:
    if ((state.narrativeAct ?? 0) >= 5) ids.add("cades_unit");
    if ((cadesData.data?.gmContactLevel ?? 0) >= 1) ids.add("game_masters_cult");
    if ((cadesData.data?.gmContactLevel ?? 0) >= 3) ids.add("goggles_artifact");
    if ((cadesData.data?.loopCount ?? 0) >= 3 || cadesData.data?.ironLionContacted) ids.add("iron_lion_signal");
    return ids;
  }, [state.narrativeAct, cadesData.data]);

  // Fallback layout for unlisted node ids so the graph is always non-empty.
  const getPos = (id: string) => LAYOUT[id] ?? { x: 400 + (id.length * 13) % 200 - 100, y: 280 };

  const visibleEdges = CADES_CONSPIRACY_EDGES.filter(
    (e) => discoveredNodeIds.has(e.from) && discoveredNodeIds.has(e.to)
  );

  const nodesToRender = CADES_CONSPIRACY_NODES.filter((n) => discoveredNodeIds.has(n.id));

  return (
    <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur p-4 overflow-hidden">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "#8b5cf6" }}>
        CONSPIRACY BOARD — CADES THREAD
      </p>
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        <svg viewBox="0 0 1000 560" className="absolute inset-0 w-full h-full">
          {/* Edges */}
          {visibleEdges.map((edge, i) => {
            const a = getPos(edge.from);
            const b = getPos(edge.to);
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={`e_${i}`}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="rgba(139, 92, 246, 0.5)"
                  strokeWidth={1.2}
                  strokeDasharray="4 3"
                />
                <text
                  x={mx} y={my - 4}
                  fill="rgba(226, 232, 240, 0.55)"
                  fontSize={10}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
          {/* Nodes */}
          {nodesToRender.map((node) => {
            const pos = getPos(node.id);
            const color = NODE_COLORS[node.type] ?? NODE_COLORS.default;
            return (
              <g key={node.id} transform={`translate(${pos.x} ${pos.y})`}>
                <circle r={28} fill="color-mix(in oklch, var(--bg-void) 80%, transparent)" stroke={color} strokeWidth={1.5} />
                <circle r={4} fill={color} />
                <text
                  y={46}
                  fill="#e2e8f0"
                  fontSize={11}
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                <text
                  y={60}
                  fill={color}
                  fontSize={8}
                  fontFamily="monospace"
                  textAnchor="middle"
                  letterSpacing="1"
                >
                  {(node.type ?? "CONCEPT").toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="font-mono text-[9px] mt-2" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        {nodesToRender.length} of {CADES_CONSPIRACY_NODES.length} CADES-side nodes discovered · {visibleEdges.length} verified connection{visibleEdges.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
