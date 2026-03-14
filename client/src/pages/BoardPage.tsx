import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ZoomIn, ZoomOut, Maximize2, ChevronRight
} from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: string;
  image?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connCount: number;
}

interface Edge {
  source: string;
  target: string;
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  character: "#00f0ff",
  location: "#ffd700",
  faction: "#c084fc",
  concept: "#4ade80",
  song: "#ff2d55",
};

export default function BoardPage() {
  const { entries, relationships, discoverEntry } = useLoredex();
  const gamification = useGamification();
  const boardTrackedRef = useRef(false);

  useEffect(() => {
    if (!boardTrackedRef.current) {
      boardTrackedRef.current = true;
      gamification.markBoardExplored();
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<string>("");
  const [tick, setTick] = useState(0);
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const tickRef = useRef(0);

  const graphData = useMemo(() => {
    const filteredEntries = entries.filter((e) => e.type !== "song");
    const nodes: Node[] = filteredEntries
      .filter((e) => !filter || e.type === filter)
      .map((e, i) => {
        const angle = (i / filteredEntries.length) * Math.PI * 2;
        const radius = 350 + Math.random() * 250;
        const connCount = relationships.filter(
          (r) => r.source.toLowerCase() === e.name.toLowerCase() || r.target.toLowerCase() === e.name.toLowerCase()
        ).length;
        return {
          id: e.id,
          name: e.name,
          type: e.type,
          image: e.image,
          x: Math.cos(angle) * radius + 500,
          y: Math.sin(angle) * radius + 400,
          vx: 0,
          vy: 0,
          radius: Math.max(12, Math.min(28, 10 + connCount * 1.5)),
          connCount,
        };
      });

    const nodeNames = new Set(nodes.map((n) => n.name.toLowerCase()));
    const edges: Edge[] = relationships
      .filter((r) => nodeNames.has(r.source.toLowerCase()) && nodeNames.has(r.target.toLowerCase()))
      .map((r) => ({ source: r.source, target: r.target, type: r.type }));

    return { nodes, edges };
  }, [entries, relationships, filter]);

  useEffect(() => {
    nodesRef.current = graphData.nodes.map((n) => ({ ...n }));
    edgesRef.current = graphData.edges;
    tickRef.current = 0;
  }, [graphData]);

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    if (nodes.length === 0) return;

    const damping = tickRef.current < 100 ? 0.88 : 0.92;
    tickRef.current++;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 1200 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    const nodeMap = new Map(nodes.map((n) => [n.name.toLowerCase(), n]));
    edges.forEach((e) => {
      const s = nodeMap.get(e.source.toLowerCase());
      const t = nodeMap.get(e.target.toLowerCase());
      if (!s || !t) return;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 150) * 0.004;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    });

    const cx = 500, cy = 400;
    nodes.forEach((n) => {
      n.vx += (cx - n.x) * 0.0008;
      n.vy += (cy - n.y) * 0.0008;
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;
    });
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const nodeMap = new Map(nodes.map((n) => [n.name.toLowerCase(), n]));
    const time = Date.now() * 0.001;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark grid background
    ctx.save();
    ctx.fillStyle = "oklch(0.06 0.015 280)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.translate(pan.x + canvas.width / 2, pan.y + canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-500, -400);

    const gridSize = 60;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let x = -500; x < 1500; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -500);
      ctx.lineTo(x, 1300);
      ctx.stroke();
    }
    for (let y = -500; y < 1300; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-500, y);
      ctx.lineTo(1500, y);
      ctx.stroke();
    }

    // Draw edges with animated pulse
    edges.forEach((e, i) => {
      const s = nodeMap.get(e.source.toLowerCase());
      const t = nodeMap.get(e.target.toLowerCase());
      if (!s || !t) return;

      const isConnectedToSelected = selectedNode && (
        s.id === selectedNode.id || t.id === selectedNode.id
      );

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);

      if (isConnectedToSelected) {
        const alpha = 0.3 + Math.sin(time * 2 + i) * 0.15;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 6]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw nodes
    nodes.forEach((n) => {
      const color = TYPE_COLORS[n.type] || "#00f0ff";
      const isSelected = selectedNode?.id === n.id;
      const isConnected = selectedNode && edges.some(
        (e) =>
          (e.source.toLowerCase() === selectedNode.name.toLowerCase() && e.target.toLowerCase() === n.name.toLowerCase()) ||
          (e.target.toLowerCase() === selectedNode.name.toLowerCase() && e.source.toLowerCase() === n.name.toLowerCase())
      );
      const dimmed = selectedNode && !isSelected && !isConnected;

      // Outer glow for selected/connected
      if (isSelected) {
        const glowSize = n.radius + 12 + Math.sin(time * 3) * 3;
        const gradient = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, glowSize);
        gradient.addColorStop(0, color + "40");
        gradient.addColorStop(1, color + "00");
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      } else if (isConnected) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = color + "15";
        ctx.fill();
      }

      // Node body
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? "rgba(10, 10, 26, 0.5)" : isSelected ? color + "25" : "oklch(0.08 0.01 280)";
      ctx.fill();
      ctx.strokeStyle = dimmed ? color + "15" : isSelected ? color + "dd" : color + "50";
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? color + "20" : color + "80";
      ctx.fill();

      // Label
      const alpha = dimmed ? "40" : isSelected ? "ff" : "aa";
      ctx.fillStyle = color.slice(0, 7) + alpha;
      ctx.font = `${isSelected ? "bold 10px" : "9px"} 'Source Code Pro', monospace`;
      ctx.textAlign = "center";
      const label = n.name.length > 18 ? n.name.slice(0, 16) + "..." : n.name;
      ctx.fillText(label, n.x, n.y + n.radius + 14);
    });

    ctx.restore();
    simulate();
    animFrameRef.current = requestAnimationFrame(render);
  }, [zoom, pan, selectedNode, simulate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      canvas.style.width = container.clientWidth + "px";
      canvas.style.height = container.clientHeight + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    const mx = (clientX - rect.left - pan.x - rect.width / 2) / zoom + 500;
    const my = (clientY - rect.top - pan.y - rect.height / 2) / zoom + 400;
    return { mx, my };
  };

  const findNodeAt = (mx: number, my: number) => {
    return nodesRef.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 8;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
    const clicked = findNodeAt(mx, my);
    if (clicked) {
      setSelectedNode(clicked);
      discoverEntry(clicked.id);
    } else {
      setSelectedNode(null);
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.2, Math.min(4, z - e.deltaY * 0.001)));
  };

  // Touch support
  const touchRef = useRef<{ x: number; y: number; dist: number }>({ x: 0, y: 0, dist: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const { mx, my } = getCanvasCoords(t.clientX, t.clientY);
      const clicked = findNodeAt(mx, my);
      if (clicked) {
        setSelectedNode(clicked);
        discoverEntry(clicked.id);
      } else {
        setSelectedNode(null);
        touchRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y, dist: 0 };
        setIsDragging(true);
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current.dist = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const t = e.touches[0];
      setPan({ x: t.clientX - touchRef.current.x, y: t.clientY - touchRef.current.y });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const scale = newDist / (touchRef.current.dist || 1);
      setZoom((z) => Math.max(0.2, Math.min(4, z * scale)));
      touchRef.current.dist = newDist;
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-display text-[10px] sm:text-xs font-bold tracking-wider text-primary">CONSPIRACY BOARD</h1>
          <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground hidden sm:inline">
            {graphData.nodes.length} nodes // {graphData.edges.length} links
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {["", "character", "location", "faction"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono transition-all ${
                filter === type ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type ? type.slice(0, 4).toUpperCase() : "ALL"}
            </button>
          ))}
          <div className="h-4 w-px bg-border/30 mx-0.5 hidden sm:block" />
          <button onClick={() => setZoom((z) => Math.min(4, z + 0.2))} className="p-1 text-muted-foreground hover:text-foreground hidden sm:block">
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))} className="p-1 text-muted-foreground hover:text-foreground hidden sm:block">
            <ZoomOut size={14} />
          </button>
          <button onClick={() => { setZoom(0.8); setPan({ x: 0, y: 0 }); }} className="p-1 text-muted-foreground hover:text-foreground">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Selected Node Panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 right-3 w-64 sm:w-72 rounded-lg border border-primary/30 bg-card/95 backdrop-blur-md p-4 box-glow-cyan"
          >
            <div className="flex items-start gap-3 mb-3">
              {selectedNode.image && (
                <img src={selectedNode.image} alt={selectedNode.name} className="w-14 h-14 rounded-md object-cover ring-1 ring-primary/30" />
              )}
              <div className="min-w-0">
                <p className="font-display text-sm font-bold truncate">{selectedNode.name}</p>
                <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: TYPE_COLORS[selectedNode.type] }}>
                  {selectedNode.type}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/50">{selectedNode.connCount} connections</p>
              </div>
            </div>
            <Link
              href={`/entity/${selectedNode.id}`}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
            >
              OPEN DOSSIER <ChevronRight size={11} />
            </Link>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 sm:gap-3 font-mono text-[9px] sm:text-[10px] bg-card/60 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-border/20">
          {Object.entries(TYPE_COLORS).filter(([k]) => k !== "song").map(([type, color]) => (
            <span key={type} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
