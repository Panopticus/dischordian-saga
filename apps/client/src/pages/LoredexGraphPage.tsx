/**
 * LoredexGraphPage — focus-entity 1-hop neighbourhood viewer (C3
 * from /root/.claude/plans/continue-your-qr-assessment-mighty-
 * valley.md §"Cicada / wanon community fame").
 *
 * Renders the loredex relationship graph centred on a focus entity.
 * Discovered neighbours show full name + type-coloured ring;
 * undiscovered neighbours render fogged (id + "?" suffix only) per
 * plan canon: "locked entries show only ID + rarity behind a fog."
 *
 * Visualization is plain SVG with deterministic polar layout —
 * cytoscape isn't a direct dep and 1-hop views fit comfortably in a
 * 700px canvas. The page reads `?focus=entity_id` from the query
 * string; defaults to "entity_1" (The Programmer) if missing.
 *
 * Wanons can crawl the graph one entity at a time by clicking on a
 * discovered neighbour to refocus on it.
 */
import { useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { useLoredex } from "@/contexts/LoredexContext";
import {
  focusNeighbourhood,
  type LoredexEntryType,
  type LoredexGraphNode,
} from "@shared/loredexGraph";

const DEFAULT_FOCUS = "entity_1";

const TYPE_COLORS: Readonly<Record<LoredexEntryType, string>> = {
  character: "var(--energy-primary)",
  concept: "var(--energy-system)",
  event: "var(--energy-accent)",
  faction: "var(--energy-error)",
  location: "var(--energy-success)",
  song: "var(--energy-premium)",
  artifact: "var(--energy-secondary)",
};

const FOGGED_COLOR = "color-mix(in oklch, var(--energy-secondary) 30%, black)";

export default function LoredexGraphPage() {
  const { entries, relationships, discoveredIds } = useLoredex();
  const search = useSearch();
  const [, navigate] = useLocation();

  const focusId = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("focus") ?? DEFAULT_FOCUS;
  }, [search]);

  const view = useMemo(
    () =>
      // LoredexContext types `entry.type` as `string` (the JSON
      // schema is loose); the graph helper requires the narrower
      // LoredexEntryType union. Loredex-data is producer-controlled
      // and only ever contains the 7 canonical types — safe cast.
      focusNeighbourhood(
        focusId,
        entries as unknown as Parameters<typeof focusNeighbourhood>[1],
        relationships as unknown as Parameters<typeof focusNeighbourhood>[2],
        discoveredIds,
      ),
    [focusId, entries, relationships, discoveredIds],
  );

  if (!view) {
    return (
      <div className="min-h-screen w-full bg-black text-white/80 p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-serif text-white/90 mb-3">
            Loredex Graph
          </h1>
          <p className="text-white/50 mb-6">
            Unknown focus entity: <code className="font-mono">{focusId}</code>
          </p>
          <Link
            href="/loredex/graph"
            className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-energy void-text-energy"
          >
            ← back to default focus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white/85 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            loredex · relationship graph · 1-hop
          </p>
          <h1 className="font-serif text-2xl text-white/90 mt-1">
            {view.focus.name}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mt-2">
            {view.neighbours.filter((n) => n.discovered).length} of{" "}
            {view.neighbours.length} neighbours discovered
          </p>
        </header>

        <div className="relative w-full aspect-square max-w-[700px] mx-auto">
          <svg
            viewBox="-300 -300 600 600"
            className="w-full h-full"
            role="img"
            aria-label={`${view.focus.name} relationship graph`}
          >
            {/* Edges first so nodes paint over them. */}
            <g stroke="color-mix(in oklch, var(--text-primary) 15%, transparent)" strokeWidth={1}>
              {view.edges.map((edge, i) => {
                const target =
                  edge.source === view.focus.id
                    ? view.neighbours.find((n) => n.id === edge.target)
                    : view.neighbours.find((n) => n.id === edge.source);
                if (!target) return null;
                return (
                  <line
                    key={`${edge.source}-${edge.target}-${i}`}
                    x1={0}
                    y1={0}
                    x2={target.x}
                    y2={target.y}
                  />
                );
              })}
            </g>

            {/* Focus node — centre, type-coloured, always
                discovered. */}
            <FocusNode focus={view.focus} />

            {/* Neighbour nodes — clickable when discovered. */}
            <g>
              {view.neighbours.map((node) => (
                <NeighbourNode
                  key={node.id}
                  node={node}
                  onClick={
                    node.discovered
                      ? () => navigate(`/loredex/graph?focus=${node.id}`)
                      : undefined
                  }
                />
              ))}
            </g>
          </svg>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 text-center mt-4">
          click a discovered neighbour to refocus
        </p>
      </div>
    </div>
  );
}

function FocusNode({ focus }: { focus: LoredexGraphNode }) {
  const color = TYPE_COLORS[focus.type];
  return (
    <motion.g
      initial={{ scale: 0.85 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <circle r={36} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={2} />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="serif"
        fill="white"
      >
        {truncate(focus.name, 18)}
      </text>
      <text
        x={0}
        y={20}
        textAnchor="middle"
        fontSize={8}
        fontFamily="monospace"
        fill="color-mix(in oklch, var(--text-primary) 40%, transparent)"
      >
        {focus.type.toUpperCase()}
      </text>
    </motion.g>
  );
}

function NeighbourNode({
  node,
  onClick,
}: {
  node: LoredexGraphNode;
  onClick?: () => void;
}) {
  const color = node.discovered ? TYPE_COLORS[node.type] : FOGGED_COLOR;
  const fogClass = node.discovered ? "" : "opacity-50";
  const cursor = onClick ? "cursor-pointer" : "cursor-default";
  const display = node.discovered
    ? truncate(node.name, 16)
    : `${node.id.replace(/^entity_/, "")} ?`;

  return (
    <motion.g
      transform={`translate(${node.x}, ${node.y})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${fogClass} ${cursor}`}
      onClick={onClick}
    >
      <circle
        r={22}
        fill={color}
        fillOpacity={node.discovered ? 0.2 : 0.1}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={0}
        y={36}
        textAnchor="middle"
        fontSize={9}
        fontFamily={node.discovered ? "serif" : "monospace"}
        fill={node.discovered ? "white" : "color-mix(in oklch, var(--text-primary) 40%, transparent)"}
      >
        {display}
      </text>
    </motion.g>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}
