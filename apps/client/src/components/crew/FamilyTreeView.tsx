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

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Crown, Skull, ZoomIn, ZoomOut, Move } from "lucide-react";
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
  // Default filter: "all" for small rosters (≤8 members across living+deceased),
  // largest bloodline for bigger ones so the tree stays readable.
  const [filter, setFilter] = useState<BloodlineId | "all">(() => {
    const total = state.roster.members.length + state.roster.deceased.length;
    if (total <= 8) return "all";
    const byBloodline = new Map<string, number>();
    for (const m of [...state.roster.members, ...state.roster.deceased]) {
      byBloodline.set(m.bloodlineId, (byBloodline.get(m.bloodlineId) ?? 0) + 1);
    }
    let largest: string | null = null;
    let largestCount = 0;
    for (const [id, count] of byBloodline) {
      if (count > largestCount) {
        largest = id;
        largestCount = count;
      }
    }
    return (largest as BloodlineId) ?? "all";
  });
  const ref = useRef<HTMLDivElement>(null);
  const [lineCoords, setLineCoords] = useState<Array<{
    x1: number; y1: number; x2: number; y2: number;
  }>>([]);
  // Pan/zoom state — CSS transforms on the inner stage.
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: pan.x,
        originY: pan.y,
      };
    },
    [pan],
  );
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy });
  }, []);
  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
  }, []);
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Only zoom when holding ctrl / cmd — otherwise let the page scroll.
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.002)));
  }, []);
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

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
  }, [nodes, filter, zoom, pan]);

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

      {/* Pan/zoom controls */}
      <div className="flex items-center gap-1 mb-2">
        <button
          onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
          className="p-1 border border-border/30 rounded hover:border-border"
          title="zoom in"
        >
          <ZoomIn size={12} />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
          className="p-1 border border-border/30 rounded hover:border-border"
          title="zoom out"
        >
          <ZoomOut size={12} />
        </button>
        <button
          onClick={resetView}
          className="px-2 py-1 text-[9px] font-mono border border-border/30 rounded hover:border-border"
          title="reset view"
        >
          reset
        </button>
        <span className="text-[9px] font-mono text-muted-foreground ml-1 flex items-center gap-1">
          <Move size={10} />
          drag to pan · ctrl+scroll to zoom · {Math.round(zoom * 100)}%
        </span>
      </div>

      <div
        ref={ref}
        className="relative bg-card/20 border border-border/30 rounded p-4 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: `${Math.max(300, (maxGen + 1) * 110 * zoom)}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Lines — rendered after the transformed node stage so
            getBoundingClientRect() reflects the current zoom/pan.
            Because they're positioned in the same container, the
            getBoundingClientRect() call in the useEffect already
            accounts for transforms. */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            width: "100%",
            height: "100%",
          }}
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

        {/* Nodes — transformed stage */}
        <div
          className="relative"
          style={{
            zIndex: 1,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top left",
            transition: dragRef.current ? "none" : "transform 0.1s ease",
          }}
        >
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
                              <Crown size={9} className="void-text-premium shrink-0" />
                            )}
                            {n.dead && <Skull size={9} className="void-text-error shrink-0" />}
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
