/* ═══════════════════════════════════════════════════════
   FAMILY TREE VIEW — Gen-by-gen genealogy

   A simple generation-grouped layout (CSS grid by column)
   that walks the parentIds chain of every member and
   arranges them by their generation number. Lines between
   children and parents are drawn with absolute-positioned
   SVG strokes layered over the grid.

   Deliberately lightweight — no react-flow, no d3-hierarchy.
   Trades exact visual precision for a zero-dependency
   footprint that works with the existing theme.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useRef, useState, useEffect } from "react";
import { Crown, Skull } from "lucide-react";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";
import type { CrewState, SerializedCrewMember } from "@shared/crewPersistence";
import CrewPortrait from "./CrewPortrait";

interface Props {
  state: CrewState;
}

interface NodeLayout {
  id: string;
  member: SerializedCrewMember;
  gen: number;
  col: number;
  dead: boolean;
}

export default function FamilyTreeView({ state }: Props) {
  const [filter, setFilter] = useState<BloodlineId | "all">("all");
  const ref = useRef<HTMLDivElement>(null);
  const [lineCoords, setLineCoords] = useState<Array<{
    x1: number; y1: number; x2: number; y2: number;
  }>>([]);

  const all = useMemo(
    () => [...state.roster.members, ...state.roster.deceased],
    [state.roster.members, state.roster.deceased],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return all;
    return all.filter(m => m.bloodlineId === filter);
  }, [all, filter]);

  // Group by generation → deterministic column ordering (by name)
  const nodes: NodeLayout[] = useMemo(() => {
    const byGen = new Map<number, SerializedCrewMember[]>();
    for (const m of filtered) {
      const g = m.generation;
      if (!byGen.has(g)) byGen.set(g, []);
      byGen.get(g)!.push(m);
    }
    const out: NodeLayout[] = [];
    const gens = Array.from(byGen.keys()).sort((a, b) => a - b);
    for (const g of gens) {
      const members = byGen.get(g)!.sort((a, b) => a.name.localeCompare(b.name));
      members.forEach((m, col) => {
        out.push({
          id: m.id,
          member: m,
          gen: g,
          col,
          dead: m.status === "dead" || state.roster.deceased.some(d => d.id === m.id),
        });
      });
    }
    return out;
  }, [filtered, state.roster.deceased]);

  const maxGen = nodes.length > 0 ? Math.max(...nodes.map(n => n.gen)) : 1;
  const maxCol = nodes.length > 0 ? Math.max(...nodes.map(n => n.col)) : 1;

  // After render, measure every node and compute parent↔child line coords
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current.getBoundingClientRect();
    const coords: typeof lineCoords = [];
    for (const node of nodes) {
      if (!node.member.parentIds) continue;
      const childEl = ref.current.querySelector(`[data-tree-id="${node.id}"]`);
      if (!childEl) continue;
      const c = childEl.getBoundingClientRect();
      const childX = c.left + c.width / 2 - container.left;
      const childY = c.top - container.top;
      for (const pid of node.member.parentIds) {
        const parentEl = ref.current.querySelector(`[data-tree-id="${pid}"]`);
        if (!parentEl) continue;
        const p = parentEl.getBoundingClientRect();
        const parentX = p.left + p.width / 2 - container.left;
        const parentY = p.top + p.height - container.top;
        coords.push({ x1: parentX, y1: parentY, x2: childX, y2: childY });
      }
    }
    setLineCoords(coords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, filter]);

  if (all.length === 0) {
    return (
      <div className="py-16 text-center text-[11px] font-mono text-muted-foreground">
        No genealogy yet. Clone your first crew member.
      </div>
    );
  }

  const foundedKeys = Object.keys(state.bloodlines) as BloodlineId[];

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => setFilter("all")}
          className={`text-[9px] font-mono px-2 py-0.5 border rounded ${
            filter === "all" ? "border-primary bg-primary/10" : "border-border/30"
          }`}
        >
          all
        </button>
        {foundedKeys.map(id => {
          const bl = FOUNDING_BLOODLINES[id];
          if (!bl) return null;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`text-[9px] font-mono px-2 py-0.5 border rounded ${
                filter === id ? "border-primary bg-primary/10" : "border-border/30"
              }`}
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: bl.color,
              }}
            >
              {bl.name}
            </button>
          );
        })}
      </div>

      <div
        ref={ref}
        className="relative bg-card/20 border border-border/30 rounded p-4 overflow-x-auto"
        style={{ minHeight: `${(maxGen + 1) * 110}px` }}
      >
        {/* Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {lineCoords.map((c, i) => (
            <line
              key={i}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="rgba(100, 180, 220, 0.35)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          ))}
        </svg>

        {/* Nodes */}
        <div className="relative" style={{ zIndex: 1 }}>
          {Array.from({ length: maxGen }, (_, i) => i + 1).map(gen => {
            const genNodes = nodes.filter(n => n.gen === gen);
            if (genNodes.length === 0) return null;
            return (
              <div
                key={gen}
                className="flex items-start gap-3 mb-4"
                style={{ minWidth: `${(maxCol + 1) * 150}px` }}
              >
                <div className="w-10 shrink-0 text-[9px] font-mono text-muted-foreground pt-2 text-right">
                  gen {gen}
                </div>
                <div className="flex flex-wrap gap-3">
                  {genNodes.map(n => {
                    const bl = FOUNDING_BLOODLINES[n.member.bloodlineId as BloodlineId];
                    return (
                      <div
                        key={n.id}
                        data-tree-id={n.id}
                        className={`w-36 p-2 border rounded bg-card/60 flex gap-2 ${
                          n.dead ? "opacity-50" : ""
                        }`}
                        style={{
                          borderLeftWidth: "3px",
                          borderLeftColor: bl?.color ?? "#666",
                        }}
                      >
                        <CrewPortrait member={n.member} size={32} className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            {n.member.isFounder && (
                              <Crown size={9} className="text-yellow-400 shrink-0" />
                            )}
                            {n.dead && <Skull size={9} className="text-red-400 shrink-0" />}
                            <span className="font-display text-[10px] font-semibold truncate">
                              {n.member.name}
                            </span>
                          </div>
                          <div className="text-[8px] font-mono text-muted-foreground truncate">
                            {n.member.species}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 text-[9px] font-mono text-muted-foreground">
        {nodes.length} members shown · {filtered.filter(m => m.isFounder).length} founders · lines
        trace parentIds
      </div>
    </div>
  );
}
