import { useGameAreaBGM } from "@/contexts/GameAudioContext";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ZoomIn, ZoomOut, Maximize2, ChevronRight,
  Network, Eye, Shield, MapPin, Zap, Crosshair, Scan,
  EyeOff, Lock
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

// Void Energy color palette for node types
const TYPE_COLORS: Record<string, { primary: string; glow: string; rgb: string }> = {
  character: { primary: "#33E2E6", glow: "rgba(51,226,230,", rgb: "51,226,230" },
  location:  { primary: "#FF8C00", glow: "rgba(255,140,0,", rgb: "255,140,0" },
  faction:   { primary: "#A078FF", glow: "rgba(160,120,255,", rgb: "160,120,255" },
  concept:   { primary: "#3875FA", glow: "rgba(56,117,250,", rgb: "56,117,250" },
  song:      { primary: "#FF2D55", glow: "rgba(255,45,85,", rgb: "255,45,85" },
};

const TYPE_ICONS: Record<string, typeof Eye> = {
  character: Eye,
  location: MapPin,
  faction: Shield,
  concept: Zap,
};

// Particle system for ambient atmosphere
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function BoardPage() {
  const { entries, relationships, discoverEntry, discoveredIds, discoveryProgress } = useLoredex();
  const gamification = useGamification();
  const boardTrackedRef = useRef(false);
  useGameAreaBGM("conspiracy");
  const [discoveryMode, setDiscoveryMode] = useState<"discovered" | "all">("discovered");

  useEffect(() => {
    if (!boardTrackedRef.current) {
      boardTrackedRef.current = true;
      gamification.markBoardExplored();
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<string>("");
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const tickRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const graphData = useMemo(() => {
    const filteredEntries = entries.filter((e) => e.type !== "song");
    const baseEntries = filteredEntries.filter((e) => !filter || e.type === filter);
    
    // In discovery mode, only show discovered entries + mystery placeholders for connected undiscovered ones
    const isDiscovered = (id: string) => discoveredIds.has(id);
    
    let visibleEntries = baseEntries;
    if (discoveryMode === "discovered") {
      // Show discovered entries + adjacent undiscovered as mystery nodes
      const discoveredNames = new Set(
        baseEntries.filter(e => isDiscovered(e.id)).map(e => e.name.toLowerCase())
      );
      // Find undiscovered entries that are connected to discovered ones
      const adjacentUndiscovered = new Set<string>();
      relationships.forEach(r => {
        const srcLower = r.source.toLowerCase();
        const tgtLower = r.target.toLowerCase();
        if (discoveredNames.has(srcLower) && !discoveredNames.has(tgtLower)) {
          adjacentUndiscovered.add(tgtLower);
        }
        if (discoveredNames.has(tgtLower) && !discoveredNames.has(srcLower)) {
          adjacentUndiscovered.add(srcLower);
        }
      });
      visibleEntries = baseEntries.filter(e => 
        isDiscovered(e.id) || adjacentUndiscovered.has(e.name.toLowerCase())
      );
    }
    
    const nodes: Node[] = visibleEntries.map((e, i) => {
        const angle = (i / Math.max(visibleEntries.length, 1)) * Math.PI * 2;
        const radius = 350 + Math.random() * 250;
        const connCount = relationships.filter(
          (r) => r.source.toLowerCase() === e.name.toLowerCase() || r.target.toLowerCase() === e.name.toLowerCase()
        ).length;
        const discovered = isDiscovered(e.id);
        return {
          id: e.id,
          name: discovered ? e.name : "???",
          type: e.type,
          image: discovered ? e.image : undefined,
          x: Math.cos(angle) * radius + 500,
          y: Math.sin(angle) * radius + 400,
          vx: 0,
          vy: 0,
          radius: discovered ? Math.max(14, Math.min(32, 12 + connCount * 1.8)) : 10,
          connCount,
        };
      });

    const nodeNames = new Set(visibleEntries.map((n) => n.name.toLowerCase()));
    const edges: Edge[] = relationships
      .filter((r) => nodeNames.has(r.source.toLowerCase()) && nodeNames.has(r.target.toLowerCase()))
      .map((r) => ({ source: r.source, target: r.target, type: r.relationship_type || r.type || 'connected_to' }));

    return { nodes, edges };
  }, [entries, relationships, filter, discoveryMode, discoveredIds]);

  // Preload node images
  useEffect(() => {
    graphData.nodes.forEach((n) => {
      if (n.image && !imageCache.current.has(n.id)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = n.image;
        img.onload = () => imageCache.current.set(n.id, img);
      }
    });
  }, [graphData.nodes]);

  useEffect(() => {
    nodesRef.current = graphData.nodes.map((n) => ({ ...n }));
    edgesRef.current = graphData.edges;
    tickRef.current = 0;
  }, [graphData]);

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 200,
        maxLife: 150 + Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        color: ["51,226,230", "56,117,250", "160,120,255"][Math.floor(Math.random() * 3)],
      });
    }
    particlesRef.current = particles;
  }, []);

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

    // Update particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life > p.maxLife) {
        p.x = Math.random() * 1000;
        p.y = Math.random() * 800;
        p.life = 0;
      }
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
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ═══ VOID BACKGROUND ═══
    ctx.save();
    // Deep void gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bgGrad.addColorStop(0, "#020030");
    bgGrad.addColorStop(0.5, "#010020");
    bgGrad.addColorStop(1, "#000010");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Transform for pan/zoom
    ctx.translate(pan.x + w / 2, pan.y + h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-500, -400);

    // ═══ DIMENSIONAL GRID ═══
    const gridSize = 60;
    // Hex-style grid with subtle glow
    ctx.lineWidth = 0.3;
    for (let x = -500; x < 1500; x += gridSize) {
      const distFromCenter = Math.abs(x - 500) / 1000;
      const alpha = 0.04 * (1 - distFromCenter * 0.5);
      ctx.strokeStyle = `rgba(56,117,250,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x, -500);
      ctx.lineTo(x, 1300);
      ctx.stroke();
    }
    for (let y = -500; y < 1300; y += gridSize) {
      const distFromCenter = Math.abs(y - 400) / 900;
      const alpha = 0.04 * (1 - distFromCenter * 0.5);
      ctx.strokeStyle = `rgba(56,117,250,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(-500, y);
      ctx.lineTo(1500, y);
      ctx.stroke();
    }

    // ═══ AMBIENT PARTICLES ═══
    particlesRef.current.forEach((p) => {
      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${alpha * 0.3})`;
      ctx.fill();
    });

    // ═══ EDGE RENDERING — Animated data streams ═══
    edges.forEach((e, i) => {
      const s = nodeMap.get(e.source.toLowerCase());
      const t = nodeMap.get(e.target.toLowerCase());
      if (!s || !t) return;

      const isConnectedToSelected = selectedNode && (
        s.id === selectedNode.id || t.id === selectedNode.id
      );
      const isConnectedToHovered = hoveredNode && (
        s.id === hoveredNode.id || t.id === hoveredNode.id
      );

      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isConnectedToSelected || isConnectedToHovered) {
        // Bright animated connection
        const sourceColor = TYPE_COLORS[s.type] || TYPE_COLORS.character;
        const targetColor = TYPE_COLORS[t.type] || TYPE_COLORS.character;

        // Main line with gradient
        const grad = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
        grad.addColorStop(0, `${sourceColor.glow}0.5)`);
        grad.addColorStop(0.5, `${sourceColor.glow}0.7)`);
        grad.addColorStop(1, `${targetColor.glow}0.5)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isConnectedToSelected ? 2 : 1.5;
        ctx.stroke();

        // Animated pulse dot traveling along the edge
        const pulsePos = ((time * 0.5 + i * 0.3) % 1);
        const px = s.x + dx * pulsePos;
        const py = s.y + dy * pulsePos;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${sourceColor.glow}0.9)`;
        ctx.fill();

        // Glow around pulse
        const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 8);
        pulseGlow.addColorStop(0, `${sourceColor.glow}0.4)`);
        pulseGlow.addColorStop(1, `${sourceColor.glow}0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = pulseGlow;
        ctx.fill();
      } else {
        // Subtle dashed connection
        const alpha = 0.06 + Math.sin(time + i * 0.5) * 0.02;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = `rgba(56,117,250,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // ═══ NODE RENDERING — Void Energy style ═══
    nodes.forEach((n) => {
      const typeColor = TYPE_COLORS[n.type] || TYPE_COLORS.character;
      const isSelected = selectedNode?.id === n.id;
      const isHovered = hoveredNode?.id === n.id;
      const isConnected = (selectedNode || hoveredNode) && edges.some(
        (e) => {
          const ref = selectedNode || hoveredNode;
          if (!ref) return false;
          return (
            (e.source.toLowerCase() === ref.name.toLowerCase() && e.target.toLowerCase() === n.name.toLowerCase()) ||
            (e.target.toLowerCase() === ref.name.toLowerCase() && e.source.toLowerCase() === n.name.toLowerCase())
          );
        }
      );
      const dimmed = (selectedNode || hoveredNode) && !isSelected && !isHovered && !isConnected;

      // ── Outer glow ring for selected/hovered ──
      if (isSelected || isHovered) {
        const glowRadius = n.radius + 16 + Math.sin(time * 3) * 4;
        const outerGlow = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, glowRadius);
        outerGlow.addColorStop(0, `${typeColor.glow}0.25)`);
        outerGlow.addColorStop(0.5, `${typeColor.glow}0.08)`);
        outerGlow.addColorStop(1, `${typeColor.glow}0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Scanning ring animation
        const scanAngle = time * 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 6, scanAngle, scanAngle + Math.PI * 0.5);
        ctx.strokeStyle = `${typeColor.glow}0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (isConnected) {
        // Subtle glow for connected nodes
        const connGlow = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius + 8);
        connGlow.addColorStop(0, `${typeColor.glow}0.12)`);
        connGlow.addColorStop(1, `${typeColor.glow}0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = connGlow;
        ctx.fill();
      }

      const isMystery = n.name === "???";

      // ── Node body — glass surface ──
      const bodyGrad = ctx.createRadialGradient(
        n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0,
        n.x, n.y, n.radius
      );
      if (isMystery) {
        bodyGrad.addColorStop(0, "rgba(30,20,50,0.4)");
        bodyGrad.addColorStop(1, "rgba(10,5,25,0.3)");
      } else if (dimmed) {
        bodyGrad.addColorStop(0, "rgba(10,10,30,0.3)");
        bodyGrad.addColorStop(1, "rgba(5,5,20,0.2)");
      } else {
        bodyGrad.addColorStop(0, `${typeColor.glow}0.12)`);
        bodyGrad.addColorStop(1, "rgba(5,5,30,0.6)");
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // ── Node image (circular clip) ──
      const img = imageCache.current.get(n.id);
      if (img && img.complete && !dimmed && !isMystery) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius - 2, 0, Math.PI * 2);
        ctx.clip();
        const imgAlpha = isSelected || isHovered ? 0.85 : isConnected ? 0.6 : 0.4;
        ctx.globalAlpha = imgAlpha;
        ctx.drawImage(img, n.x - n.radius + 2, n.y - n.radius + 2, (n.radius - 2) * 2, (n.radius - 2) * 2);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // ── Border ring ──
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      if (isMystery) {
        ctx.strokeStyle = "rgba(160,120,255,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        const borderAlpha = dimmed ? 0.1 : isSelected ? 0.9 : isHovered ? 0.7 : isConnected ? 0.5 : 0.25;
        ctx.strokeStyle = `${typeColor.glow}${borderAlpha})`;
        ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1;
        ctx.stroke();
      }

      // ── Mystery question mark for undiscovered ──
      if (isMystery) {
        ctx.font = `bold ${n.radius}px 'Source Code Pro', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(160,120,255,${0.3 + Math.sin(time * 2 + n.x) * 0.1})`;
        ctx.fillText("?", n.x, n.y);
        ctx.textBaseline = "alphabetic";
      }

      // ── Inner core dot ──
      if (!isMystery && (!img || !img.complete || dimmed)) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = dimmed ? `${typeColor.glow}0.15)` : `${typeColor.glow}0.7)`;
        ctx.fill();
      }

      // ── Label ──
      const labelAlpha = dimmed ? 0.2 : isSelected || isHovered ? 1 : isConnected ? 0.8 : 0.6;
      ctx.font = `${isSelected || isHovered ? "bold 11px" : "10px"} 'Source Code Pro', monospace`;
      ctx.textAlign = "center";

      // Text shadow/glow for readability
      if (!dimmed) {
        ctx.fillStyle = `${typeColor.glow}${labelAlpha * 0.3})`;
        ctx.fillText(n.name.length > 18 ? n.name.slice(0, 16) + "..." : n.name, n.x + 0.5, n.y + n.radius + 15.5);
      }
      ctx.fillStyle = `rgba(255,255,255,${labelAlpha})`;
      ctx.fillText(n.name.length > 18 ? n.name.slice(0, 16) + "..." : n.name, n.x, n.y + n.radius + 15);

      // Connection count badge for important nodes
      if (n.connCount >= 5 && !dimmed) {
        const badgeX = n.x + n.radius * 0.7;
        const badgeY = n.y - n.radius * 0.7;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 7, 0, Math.PI * 2);
        ctx.fillStyle = `${typeColor.glow}0.8)`;
        ctx.fill();
        ctx.font = "bold 8px 'Source Code Pro', monospace";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(n.connCount), badgeX, badgeY);
        ctx.textBaseline = "alphabetic";
      }
    });

    ctx.restore();
    simulate();
    animFrameRef.current = requestAnimationFrame(render);
  }, [zoom, pan, selectedNode, hoveredNode, simulate]);

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
      if (clicked.name === "???") {
        // Mystery node - don't select, just show hint
        setSelectedNode(null);
        return;
      }
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
    } else {
      const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
      const hovered = findNodeAt(mx, my);
      setHoveredNode(hovered || null);
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
        if (clicked.name === "???") {
          setSelectedNode(null);
          return;
        }
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

  // Get connected nodes for the selected node panel
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    return edgesRef.current
      .filter((e) =>
        e.source.toLowerCase() === selectedNode.name.toLowerCase() ||
        e.target.toLowerCase() === selectedNode.name.toLowerCase()
      )
      .map((e) => {
        const otherName = e.source.toLowerCase() === selectedNode.name.toLowerCase() ? e.target : e.source;
        const otherNode = nodesRef.current.find((n) => n.name.toLowerCase() === otherName.toLowerCase());
        return otherNode ? { name: otherNode.name, type: otherNode.type, id: otherNode.id, relType: e.type } : null;
      })
      .filter(Boolean)
      .slice(0, 8);
  }, [selectedNode]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ═══ TOOLBAR ═══ */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-[var(--glass-border)]"
           style={{ background: "linear-gradient(180deg, var(--glass-base) 0%, var(--bg-overlay) 100%)" }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-muted-foreground/60 hover:text-[var(--neon-cyan)] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <Network size={14} className="text-[var(--neon-cyan)]" />
            <h1 className="font-display text-[10px] sm:text-xs font-bold tracking-[0.2em] text-foreground">
              CONSPIRACY BOARD
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-[var(--glass-base)] border border-[var(--glass-border)]">
            <Scan size={10} className="text-[var(--neon-cyan)]/60" />
            <span className="font-mono text-[9px] text-muted-foreground/70">
              {graphData.nodes.length} NODES // {graphData.edges.length} LINKS
              {discoveryMode === "discovered" && (
                <> // {Math.round(discoveryProgress)}% DISCOVERED</>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Type filters */}
          {[
            { type: "", label: "ALL", icon: Crosshair },
            { type: "character", label: "CHAR", icon: Eye },
            { type: "location", label: "LOC", icon: MapPin },
            { type: "faction", label: "FACT", icon: Shield },
          ].map(({ type, label, icon: Icon }) => {
            const color = type ? TYPE_COLORS[type]?.primary : "#33E2E6";
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-mono transition-all border ${
                  filter === type
                    ? "border-current bg-current/10"
                    : "border-transparent hover:border-border/60 hover:bg-muted/50"
                }`}
                style={{ color: filter === type ? color : "rgba(255,255,255,0.4)" }}
              >
                <Icon size={11} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-muted/50 mx-0.5" />

          {/* Discovery mode toggle */}
          <button
            onClick={() => setDiscoveryMode(m => m === "discovered" ? "all" : "discovered")}
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-mono transition-all border ${
              discoveryMode === "discovered"
                ? "border-[var(--orb-orange)] bg-[rgba(255,183,77,0.1)] text-[var(--orb-orange)]"
                : "border-[var(--neon-cyan)]/30 bg-[rgba(51,226,230,0.05)] text-[var(--neon-cyan)]/70"
            }`}
            title={discoveryMode === "discovered" ? "Showing discovered entries only" : "Showing all entries"}
          >
            {discoveryMode === "discovered" ? <EyeOff size={11} /> : <Eye size={11} />}
            <span className="hidden sm:inline">{discoveryMode === "discovered" ? "DISCOVERED" : "ALL"}</span>
          </button>

          <div className="h-4 w-px bg-muted/50 mx-0.5 hidden sm:block" />

          {/* Zoom controls */}
          <button onClick={() => setZoom((z) => Math.min(4, z + 0.2))} className="p-1.5 text-muted-foreground/50 hover:text-muted-foreground/90 transition-colors hidden sm:block">
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))} className="p-1.5 text-muted-foreground/50 hover:text-muted-foreground/90 transition-colors hidden sm:block">
            <ZoomOut size={14} />
          </button>
          <button onClick={() => { setZoom(0.8); setPan({ x: 0, y: 0 }); }} className="p-1.5 text-muted-foreground/50 hover:text-muted-foreground/90 transition-colors">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* ═══ CANVAS ═══ */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { handleMouseUp(); setHoveredNode(null); }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* ═══ SELECTED NODE PANEL ═══ */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              transition={{ duration: 0.3 }}
              className="absolute top-3 right-3 w-72 sm:w-80 rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--glass-base) 85%, transparent) 0%, var(--bg-void) 100%)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.3)`,
                boxShadow: `0 0 30px ${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.15), 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Header with image */}
              <div className="relative h-24 overflow-hidden">
                {selectedNode.image ? (
                  <>
                    <img src={selectedNode.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-void)]" />
                  </>
                ) : (
                  <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.1), transparent)` }} />
                )}
                {/* Type badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider"
                     style={{
                       background: `${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.15)`,
                       border: `1px solid ${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.3)`,
                       color: TYPE_COLORS[selectedNode.type]?.primary || "#33E2E6",
                     }}>
                  {selectedNode.type.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-4 -mt-4 relative">
                <h3 className="font-display text-base font-bold text-foreground tracking-wide mb-1">
                  {selectedNode.name}
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground/60 mb-3">
                  {selectedNode.connCount} dimensional connections detected
                </p>

                {/* Connected entities */}
                {connectedNodes.length > 0 && (
                  <div className="mb-3">
                    <p className="font-mono text-[9px] text-muted-foreground/50 tracking-wider mb-1.5">CONNECTIONS</p>
                    <div className="flex flex-wrap gap-1">
                      {connectedNodes.map((cn, i) => cn && (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                          style={{
                            background: `${TYPE_COLORS[cn.type]?.glow || "rgba(51,226,230,"}0.08)`,
                            border: `1px solid ${TYPE_COLORS[cn.type]?.glow || "rgba(51,226,230,"}0.15)`,
                            color: `${TYPE_COLORS[cn.type]?.primary || "#33E2E6"}`,
                          }}
                        >
                          {cn.name.length > 16 ? cn.name.slice(0, 14) + "..." : cn.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href={`/entity/${selectedNode.id}`}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all"
                  style={{
                    background: `${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.1)`,
                    border: `1px solid ${TYPE_COLORS[selectedNode.type]?.glow || "rgba(51,226,230,"}0.3)`,
                    color: TYPE_COLORS[selectedNode.type]?.primary || "#33E2E6",
                  }}
                >
                  OPEN DOSSIER <ChevronRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ LEGEND ═══ */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 sm:gap-3 font-mono text-[9px] sm:text-[10px] rounded-lg px-3 py-2 border border-[var(--glass-border)]"
             style={{ background: "var(--bg-overlay)", backdropFilter: "blur(10px)" }}>
          {Object.entries(TYPE_COLORS).filter(([k]) => k !== "song").map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.primary, boxShadow: `0 0 6px ${color.glow}0.5)` }} />
              <span style={{ color: color.primary }}>{type.toUpperCase()}</span>
            </span>
          ))}
        </div>

        {/* ═══ ZOOM INDICATOR ═══ */}
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-muted-foreground/50 px-2 py-1 rounded border border-[var(--glass-border)]"
             style={{ background: "color-mix(in srgb, var(--bg-void) 60%, transparent)" }}>
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}
