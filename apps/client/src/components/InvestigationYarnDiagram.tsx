/* ═══════════════════════════════════════════════════════
   INVESTIGATION YARN DIAGRAM
   audit/16 PR 26 (Cluster A polish on PR #531).

   Force-directed yarn graph visualizing the player's open
   investigations. Renders puzzles + clues as paper-note
   nodes, prerequisiteChains + clue→puzzle links as red
   yarn lines.

   The audit'd visual intent is a detective board with
   pins + string. This component delivers that as pure
   SVG (no d3-force / react-flow dependency) — the layout
   math lives in apps/shared/forceLayout.ts and is fully
   tested. The rendering is vanilla SVG with hover-to-
   highlight + click-to-focus.

   Mounts inside the Investigation Board's Open Threads
   tab, above the existing list-style chain breakdown.
   The list stays as the keyboard-accessible alternative.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Lock, Unlock, Sparkles } from "lucide-react";
import {
  computeForceLayout,
  type ForceLayoutNode,
  type ForceLayoutEdge,
} from "@shared/forceLayout";
import { CLUES } from "./ClueJournal";
import { ROOM_PUZZLES, type Puzzle as RoomPuzzle } from "./PuzzleSystem";

/** What kind of node — drives visual styling (paper-note
 *  shape + colour). */
type DiagramNodeKind = "puzzle" | "clue";

interface DiagramNode {
  id: string;
  kind: DiagramNodeKind;
  label: string;
  /** True when the player has discovered/solved this. */
  resolved: boolean;
  /** Room id for tooltip context. */
  roomId?: string;
}

interface DiagramEdge extends ForceLayoutEdge {
  /** "yarn" — main investigation thread; "prereq" —
   *  sequencing-lock; "needs-clue" — clue feeds puzzle. */
  kind: "yarn" | "prereq" | "needs-clue";
}

export interface InvestigationYarnDiagramProps {
  /** Active narrative flags (from useGame). Used to tell
   *  which puzzles are solved and which prerequisites are
   *  satisfied. */
  narrativeFlags: Record<string, boolean>;
  /** Set of clue IDs the player has collected. */
  collectedClues: ReadonlySet<string>;
  /** Set of puzzle IDs the player has solved. */
  solvedPuzzles: ReadonlySet<string>;
  /** Optional canvas size override. Defaults to 720×480. */
  width?: number;
  height?: number;
}

/** Build the node + edge lists from the currently-active
 *  data sources. */
function buildGraph(
  collectedClues: ReadonlySet<string>,
  solvedPuzzles: ReadonlySet<string>,
): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const includedNodeIds = new Set<string>();

  // Add every puzzle that has at least one collected clue
  // OR has been solved. This keeps the graph focused on the
  // player's active investigation surface — not every puzzle
  // in the registry, just the ones in motion.
  const relevantPuzzles: RoomPuzzle[] = [];
  for (const puzzle of Object.values(ROOM_PUZZLES) as RoomPuzzle[]) {
    const cluesForPuzzle = CLUES.filter((c) => c.puzzleId === puzzle.id);
    const hasCollectedClue = cluesForPuzzle.some((c) => collectedClues.has(c.id));
    const isSolved = solvedPuzzles.has(puzzle.id);
    // Include if the puzzle has any clue activity, plus
    // include unsolved puzzles whose prerequisites are met
    // (so the player can see "what's available next").
    if (hasCollectedClue || isSolved) {
      relevantPuzzles.push(puzzle);
    }
  }

  for (const puzzle of relevantPuzzles) {
    nodes.push({
      id: `puzzle:${puzzle.id}`,
      kind: "puzzle",
      label: puzzle.title,
      resolved: solvedPuzzles.has(puzzle.id),
      roomId: puzzle.roomId,
    });
    includedNodeIds.add(`puzzle:${puzzle.id}`);
  }

  // Add the clues that connect to those puzzles.
  for (const clue of CLUES) {
    if (!clue.puzzleId) continue;
    const puzzleNodeId = `puzzle:${clue.puzzleId}`;
    if (!includedNodeIds.has(puzzleNodeId)) continue;
    const clueNodeId = `clue:${clue.id}`;
    if (!includedNodeIds.has(clueNodeId)) {
      nodes.push({
        id: clueNodeId,
        kind: "clue",
        label: clue.title,
        resolved: collectedClues.has(clue.id),
        roomId: clue.roomId,
      });
      includedNodeIds.add(clueNodeId);
    }
    edges.push({
      source: clueNodeId,
      target: puzzleNodeId,
      kind: "needs-clue",
    });
  }

  // Add puzzle-prerequisite edges (puzzle → puzzle). The
  // PuzzleSystem.Puzzle.prerequisites is a discriminated
  // union; filter to "puzzle_solved" kind for the graph.
  for (const puzzle of relevantPuzzles) {
    if (!puzzle.prerequisites) continue;
    const targetId = `puzzle:${puzzle.id}`;
    for (const pre of puzzle.prerequisites) {
      if (pre.kind !== "puzzle_solved") continue;
      const sourceId = `puzzle:${pre.puzzleId}`;
      if (includedNodeIds.has(sourceId)) {
        edges.push({ source: sourceId, target: targetId, kind: "prereq" });
      }
    }
  }

  // Add cross-room dependsOnClues edges.
  for (const clue of CLUES) {
    if (!clue.dependsOnClues) continue;
    const targetId = `clue:${clue.id}`;
    if (!includedNodeIds.has(targetId)) continue;
    for (const dep of clue.dependsOnClues) {
      const sourceId = `clue:${dep.clueId}`;
      if (includedNodeIds.has(sourceId)) {
        edges.push({ source: sourceId, target: targetId, kind: "yarn" });
      }
    }
  }

  return { nodes, edges };
}

const NODE_RADIUS_PUZZLE = 22;
const NODE_RADIUS_CLUE = 14;

const EDGE_STROKE: Record<DiagramEdge["kind"], { color: string; opacity: number; dash?: string }> = {
  yarn: { color: "#dc2626", opacity: 0.7 }, // detective-board red string
  prereq: { color: "#dc2626", opacity: 0.45, dash: "4 3" },
  "needs-clue": { color: "#fcd34d", opacity: 0.55 },
};

export function InvestigationYarnDiagram({
  narrativeFlags: _narrativeFlags,
  collectedClues,
  solvedPuzzles,
  width = 720,
  height = 480,
}: InvestigationYarnDiagramProps) {
  const { nodes, edges } = useMemo(
    () => buildGraph(collectedClues, solvedPuzzles),
    [collectedClues, solvedPuzzles],
  );

  // Run the force layout once per data change.
  const positions = useMemo(() => {
    const layoutNodes: ForceLayoutNode[] = nodes.map((n) => ({
      id: n.id,
      // Puzzles weigh more — they're the "anchor" nodes that
      // shouldn't drift much.
      weight: n.kind === "puzzle" ? 2 : 1,
    }));
    return computeForceLayout(layoutNodes, edges, {
      width,
      height,
      iterations: 220,
      edgeLength: 110,
      seed: 7,
    });
  }, [nodes, edges, width, height]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (nodes.length === 0) {
    return (
      <div
        className="rounded-lg border void-border bg-black/40 p-8 text-center"
        data-testid="yarn-diagram-empty"
      >
        <Sparkles size={20} className="mx-auto text-white/30 mb-2" />
        <p className="font-mono text-xs text-white/50 leading-relaxed">
          No active investigations to thread together. Pick up a clue or solve a
          puzzle to start the board.
        </p>
      </div>
    );
  }

  // Build an adjacency lookup to highlight 1-hop neighbours
  // when a node is hovered.
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!map.has(e.source)) map.set(e.source, new Set());
      if (!map.has(e.target)) map.set(e.target, new Set());
      map.get(e.source)!.add(e.target);
      map.get(e.target)!.add(e.source);
    }
    return map;
  }, [edges]);

  const isHighlighted = (id: string): boolean => {
    if (!hoveredId) return false;
    return id === hoveredId || (adjacency.get(hoveredId)?.has(id) ?? false);
  };

  return (
    <div
      className="rounded-lg border void-border bg-gradient-to-b from-amber-950/10 to-black/40 p-3 overflow-hidden"
      data-testid="yarn-diagram"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          Investigation Yarn
        </p>
        <p className="font-mono text-[9px] text-white/30">
          {nodes.length} nodes · {edges.length} threads
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ background: "rgba(0,0,0,0.3)" }}
        role="img"
        aria-label="Investigation board with clues and puzzles connected by red yarn threads"
      >
        {/* Edges first so they sit behind nodes */}
        <g>
          {edges.map((edge, idx) => {
            const a = positions.get(edge.source);
            const b = positions.get(edge.target);
            if (!a || !b) return null;
            const stroke = EDGE_STROKE[edge.kind];
            const highlighted =
              hoveredId !== null &&
              (edge.source === hoveredId || edge.target === hoveredId);
            return (
              <line
                key={`${edge.source}-${edge.target}-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={stroke.color}
                strokeWidth={highlighted ? 2.5 : 1.4}
                strokeOpacity={
                  hoveredId === null
                    ? stroke.opacity
                    : highlighted
                      ? 1
                      : stroke.opacity * 0.3
                }
                strokeDasharray={stroke.dash}
                style={{ transition: "stroke-width 0.15s, stroke-opacity 0.15s" }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const r = node.kind === "puzzle" ? NODE_RADIUS_PUZZLE : NODE_RADIUS_CLUE;
            const isPuzzle = node.kind === "puzzle";
            const fill = isPuzzle
              ? node.resolved ? "#f59e0b" : "#1f2937"
              : node.resolved ? "#fcd34d" : "#374151";
            const dim = hoveredId !== null && !isHighlighted(node.id);
            return (
              <g
                key={node.id}
                transform={`translate(${pos.x} ${pos.y})`}
                opacity={dim ? 0.35 : 1}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                data-testid={`yarn-node-${node.id}`}
                data-resolved={node.resolved ? "true" : "false"}
                data-kind={node.kind}
              >
                {/* Paper-note background */}
                <rect
                  x={-r}
                  y={-r * 0.6}
                  width={r * 2}
                  height={r * 1.2}
                  rx={2}
                  fill={fill}
                  stroke={isHighlighted(node.id) ? "#fcd34d" : "rgba(255,255,255,0.2)"}
                  strokeWidth={isHighlighted(node.id) ? 2 : 0.8}
                />
                {/* Pin dot */}
                <circle r={2} fill="#dc2626" cy={-r * 0.6 + 1} />
                {/* Label below the note */}
                <text
                  y={r * 0.6 + 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(255,255,255,0.85)"
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label}
                </text>
                {/* Status icon (lock/unlock) */}
                <g transform={`translate(0 -${r * 0.05})`}>
                  {node.resolved ? (
                    <Unlock x={-5} y={-5} size={10} color="black" />
                  ) : (
                    <Lock x={-5} y={-5} size={10} color="rgba(255,255,255,0.7)" />
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="font-mono text-[9px] text-white/30 mt-2 text-center leading-relaxed">
        Hover a node to highlight its connections. Yellow string = clue feeds puzzle.
        Red string = clue depends on clue. Dashed red = puzzle prerequisite.
      </p>
    </div>
  );
}
