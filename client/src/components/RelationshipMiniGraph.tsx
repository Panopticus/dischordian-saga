/* ═══════════════════════════════════════════════════════
   RELATIONSHIP MINI-GRAPH
   A small force-directed graph showing an entity's
   direct connections. Canvas-based for performance.
   ═══════════════════════════════════════════════════════ */
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { useLocation } from "wouter";
import { Maximize2, Minimize2 } from "lucide-react";

interface GraphNode {
  id: string;
  name: string;
  type: string;
  image?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCenter: boolean;
  radius: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

const TYPE_COLORS: Record<string, string> = {
  character: "#33e2e6",
  location: "#ffb74d",
  faction: "#a855f7",
  song: "#ef4444",
  concept: "#22c55e",
};

export default function RelationshipMiniGraph({ entityName }: { entityName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const [, navigate] = useLocation();
  const { getEntry, getRelated, relationships } = useLoredex();
  const [expanded, setExpanded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ w: 400, h: 300 });

  const entry = getEntry(entityName);
  const related = useMemo(() => getRelated(entityName), [entityName, getRelated]);

  // Build graph data
  const { nodes, edges } = useMemo(() => {
    if (!entry) return { nodes: [], edges: [] };

    const centerNode: GraphNode = {
      id: entry.id,
      name: entry.name,
      type: entry.type,
      image: entry.image,
      x: dimensions.w / 2,
      y: dimensions.h / 2,
      vx: 0,
      vy: 0,
      isCenter: true,
      radius: 24,
    };

    const angleStep = (2 * Math.PI) / Math.max(related.length, 1);
    const orbitRadius = Math.min(dimensions.w, dimensions.h) * 0.32;

    const relNodes: GraphNode[] = related.slice(0, 16).map((rel, i) => ({
      id: rel.id,
      name: rel.name,
      type: rel.type,
      image: rel.image,
      x: dimensions.w / 2 + Math.cos(angleStep * i - Math.PI / 2) * orbitRadius + (Math.random() - 0.5) * 20,
      y: dimensions.h / 2 + Math.sin(angleStep * i - Math.PI / 2) * orbitRadius + (Math.random() - 0.5) * 20,
      vx: 0,
      vy: 0,
      isCenter: false,
      radius: 16,
    }));

    const graphEdges: GraphEdge[] = related.slice(0, 16).map(rel => {
      const r = relationships.find(
        r => (r.source.toLowerCase() === entityName.toLowerCase() && r.target.toLowerCase() === rel.name.toLowerCase()) ||
             (r.target.toLowerCase() === entityName.toLowerCase() && r.source.toLowerCase() === rel.name.toLowerCase())
      );
      return {
        source: entry.id,
        target: rel.id,
        label: r?.relationship_type || r?.type || "connected",
      };
    });

    return { nodes: [centerNode, ...relNodes], edges: graphEdges };
  }, [entry, related, relationships, entityName, dimensions]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      for (const e of entries) {
        setDimensions({ w: e.contentRect.width, h: expanded ? 400 : 300 });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [expanded]);

  // Force simulation + render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Copy nodes for simulation
    const simNodes = nodes.map(n => ({ ...n }));
    nodesRef.current = simNodes;
    edgesRef.current = edges;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const maxFrames = 200;

    function simulate() {
      const damping = 0.85;
      const centerX = dimensions.w / 2;
      const centerY = dimensions.h / 2;

      // Repulsion between all nodes
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const dx = simNodes[j].x - simNodes[i].x;
          const dy = simNodes[j].y - simNodes[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = 800 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (!simNodes[i].isCenter) { simNodes[i].vx -= fx; simNodes[i].vy -= fy; }
          if (!simNodes[j].isCenter) { simNodes[j].vx += fx; simNodes[j].vy += fy; }
        }
      }

      // Attraction along edges
      for (const edge of edges) {
        const s = simNodes.find(n => n.id === edge.source);
        const t = simNodes.find(n => n.id === edge.target);
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const idealDist = Math.min(dimensions.w, dimensions.h) * 0.28;
        const force = (dist - idealDist) * 0.01;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!s.isCenter) { s.vx += fx; s.vy += fy; }
        if (!t.isCenter) { t.vx -= fx; t.vy -= fy; }
      }

      // Center gravity
      for (const node of simNodes) {
        if (node.isCenter) {
          node.x = centerX;
          node.y = centerY;
          continue;
        }
        node.vx += (centerX - node.x) * 0.002;
        node.vy += (centerY - node.y) * 0.002;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
        // Boundary
        const pad = node.radius + 4;
        node.x = Math.max(pad, Math.min(dimensions.w - pad, node.x));
        node.y = Math.max(pad, Math.min(dimensions.h - pad, node.y));
      }
    }

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);

      // Draw edges
      for (const edge of edges) {
        const s = simNodes.find(n => n.id === edge.source);
        const t = simNodes.find(n => n.id === edge.target);
        if (!s || !t) continue;

        const isHovered = hoveredNode === s.id || hoveredNode === t.id;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = isHovered ? "rgba(51,226,230,0.5)" : "var(--glass-border)";
        ctx.lineWidth = isHovered ? 1.5 : 0.8;
        ctx.stroke();

        // Edge label at midpoint
        if (isHovered && edge.label) {
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          ctx.font = "9px monospace";
          ctx.fillStyle = "rgba(51,226,230,0.7)";
          ctx.textAlign = "center";
          ctx.fillText(edge.label, mx, my - 4);
        }
      }

      // Draw nodes
      for (const node of simNodes) {
        const color = TYPE_COLORS[node.type] || "#33e2e6";
        const isHovered = hoveredNode === node.id;

        // Glow
        if (node.isCenter || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = `${color}15`;
          ctx.fill();
          ctx.strokeStyle = `${color}40`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isCenter ? `${color}30` : `${color}15`;
        ctx.fill();
        ctx.strokeStyle = isHovered ? color : `${color}50`;
        ctx.lineWidth = node.isCenter ? 2 : 1;
        ctx.stroke();

        // Name label
        ctx.font = node.isCenter ? "bold 10px monospace" : "9px monospace";
        ctx.fillStyle = isHovered || node.isCenter ? color : "rgba(255,255,255,0.6)";
        ctx.textAlign = "center";
        const label = node.name.length > 14 ? node.name.slice(0, 12) + "..." : node.name;
        ctx.fillText(label, node.x, node.y + node.radius + 12);
      }
    }

    function tick() {
      if (frame < maxFrames) {
        simulate();
      }
      render();
      frame++;
      animRef.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [nodes, edges, dimensions, hoveredNode]);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: string | null = null;
    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 6) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
    canvas.style.cursor = found ? "pointer" : "default";
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 6 && !node.isCenter) {
        navigate(`/entity/${node.id}`);
        break;
      }
    }
  }, [navigate]);

  if (!entry || related.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-border/30 bg-card/30 overflow-hidden relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <circle cx="4" cy="6" r="2" />
            <circle cx="20" cy="6" r="2" />
            <circle cx="4" cy="18" r="2" />
            <circle cx="20" cy="18" r="2" />
            <line x1="9.5" y1="10" x2="5.5" y2="7.5" />
            <line x1="14.5" y1="10" x2="18.5" y2="7.5" />
            <line x1="9.5" y1="14" x2="5.5" y2="16.5" />
            <line x1="14.5" y1="14" x2="18.5" y2="16.5" />
          </svg>
          CONNECTION MAP
          <span className="text-[10px] text-muted-foreground font-normal ml-1">({related.length})</span>
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded text-muted-foreground/40 hover:text-primary transition-colors"
        >
          {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: expanded ? 400 : 300 }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredNode(null)}
      />

      {/* Legend */}
      <div className="flex items-center gap-3 px-4 pb-2 flex-wrap">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="font-mono text-[8px] text-muted-foreground/50 capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="px-4 pb-3">
        <p className="font-mono text-[8px] text-muted-foreground/30 tracking-wider">
          CLICK A NODE TO NAVIGATE • HOVER FOR DETAILS
        </p>
      </div>
    </div>
  );
}
