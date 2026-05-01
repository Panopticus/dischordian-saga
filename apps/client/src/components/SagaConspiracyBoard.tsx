/* ═══════════════════════════════════════════════════════
   SAGA CONSPIRACY BOARD — multi-arc tabbed wrapper

   Thin extension of the canonical `CADESConspiracyBoard.tsx`
   pattern (per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §14b.6). The CADES board IS the case-level board — this
   component does NOT replace it; it composes per-arc boards
   into one tabbed surface.

   Today: 2 tabs (CADES + Wraith Calder). As more per-arc
   integration manifests ship, each registers a tab here.

   The Wraith tab renders the suspect graph from the authored
   `MysteryDefinition` (episodeMysteries.ts), with manual
   layout coordinates and discovery-gating driven by the
   player's `mystery_evidence` rows surfaced via the
   `mysteries.getEvidenceBoard` query.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { CADESConspiracyBoard } from "./CADESConspiracyBoard";

/* ─── ARC TAB DEFINITIONS ─── */

interface ArcTab {
  /** Stable id used for the React key + aria-controls. */
  id: string;
  /** Tab label. */
  label: string;
  /** When false, the tab is rendered dim and is not clickable —
   *  used for arcs the player has not yet unlocked. */
  enabled: boolean;
}

const SAGA_TABS: ReadonlyArray<ArcTab> = [
  { id: "cades",   label: "CADES",          enabled: true },
  { id: "wraith",  label: "Wraith Calder",  enabled: true },
];

/* ─── WRAITH BOARD — manual layout for arc.wraith_calder ─── */

const WRAITH_NODE_LAYOUT: Record<string, { x: number; y: number }> = {
  "suspect.wraith_calder":     { x: 240, y: 280 },
  "suspect.the_host":          { x: 480, y: 140 },
  "suspect.crystalline_city":  { x: 720, y: 280 },
  "suspect.hierophant":        { x: 480, y: 420 },
};

function nodePos(id: string): { x: number; y: number } {
  return WRAITH_NODE_LAYOUT[id] ?? { x: 480, y: 280 };
}

function WraithConspiracyBoard() {
  const { isAuthenticated } = useAuth();
  const board = trpc.mysteries.getEvidenceBoard.useQuery(
    { mysteryId: "mystery.wraith_calder" },
    { enabled: isAuthenticated },
  );

  const discoveredClueIds = useMemo(() => {
    const set = new Set<string>();
    for (const ev of board.data?.evidence ?? []) {
      set.add(ev.clueId);
    }
    return set;
  }, [board.data]);

  // Suspects appear once the player has any evidence on the case.
  // Pre-seed Wraith Calder as the always-visible anchor — the
  // case file's home identity. Other suspects unlock as evidence
  // accrues; conservative default for the proof-of-life slice.
  const visibleSuspectIds = useMemo(() => {
    const ids = new Set<string>(["suspect.wraith_calder"]);
    if (discoveredClueIds.has("wraith.e1.witness_journal")) {
      ids.add("suspect.the_host");
      ids.add("suspect.crystalline_city");
    }
    if (discoveredClueIds.has("wraith.e1.hierophant_ceremony")) {
      ids.add("suspect.hierophant");
    }
    return ids;
  }, [discoveredClueIds]);

  const suspects = board.data?.suspects ?? [];
  const visibleSuspects = suspects.filter((s) => visibleSuspectIds.has(s.id));
  const visibleEdges = suspects.flatMap((s) =>
    visibleSuspectIds.has(s.id)
      ? s.relations
          .filter((r) => visibleSuspectIds.has(r.to))
          .map((r) => ({ from: s.id, to: r.to, relation: r.relation }))
      : [],
  );

  if (board.isLoading) {
    return (
      <p className="font-mono text-[10px] text-center py-8" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        Loading case file…
      </p>
    );
  }

  if (!board.data?.mystery) {
    return (
      <p className="font-mono text-[10px] text-center py-8" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        Case file not yet opened. Investigate the antiquarian library to begin.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur p-4 overflow-hidden">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
        CONSPIRACY BOARD — WRAITH CALDER
      </p>
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        <svg viewBox="0 0 960 560" className="absolute inset-0 w-full h-full">
          {visibleEdges.map((edge, i) => {
            const a = nodePos(edge.from);
            const b = nodePos(edge.to);
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={`e_${i}`}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="rgba(245, 158, 11, 0.5)"
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
                  {edge.relation}
                </text>
              </g>
            );
          })}
          {visibleSuspects.map((node) => {
            const pos = nodePos(node.id);
            return (
              <g key={node.id} transform={`translate(${pos.x} ${pos.y})`}>
                <circle r={28} fill="color-mix(in oklch, var(--bg-void) 80%, transparent)" stroke="var(--energy-accent)" strokeWidth={1.5} />
                <circle r={4} fill="var(--energy-accent)" />
                <text y={46} fill="#e2e8f0" fontSize={11} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  {node.name}
                </text>
                <text y={60} fill="var(--energy-accent)" fontSize={8} fontFamily="monospace" textAnchor="middle" letterSpacing="1">
                  {node.type.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="font-mono text-[9px] mt-2" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        {visibleSuspects.length} of {suspects.length} suspects discovered · {visibleEdges.length} verified connection{visibleEdges.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}

/* ─── TABBED WRAPPER ─── */

export function SagaConspiracyBoard() {
  const [activeTab, setActiveTab] = useState<string>(SAGA_TABS[0].id);

  return (
    <div>
      <div role="tablist" className="flex gap-2 mb-3">
        {SAGA_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`saga-board-panel-${tab.id}`}
              disabled={!tab.enabled}
              onClick={() => tab.enabled && setActiveTab(tab.id)}
              className="font-mono text-[10px] tracking-[0.25em] px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: isActive
                  ? "color-mix(in oklch, var(--energy-primary) 20%, transparent)"
                  : "transparent",
                border: isActive
                  ? "1px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)"
                  : "1px solid var(--glass-border)",
                color: tab.enabled
                  ? (isActive ? "var(--energy-primary)" : "#e2e8f0")
                  : "color-mix(in oklch, #e2e8f0 30%, transparent)",
                cursor: tab.enabled ? "pointer" : "not-allowed",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`saga-board-panel-${activeTab}`}>
        {activeTab === "cades" && <CADESConspiracyBoard />}
        {activeTab === "wraith" && <WraithConspiracyBoard />}
      </div>
    </div>
  );
}
