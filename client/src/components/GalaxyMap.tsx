import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { X, ZoomIn, ZoomOut, Crosshair, Maximize2 } from "lucide-react";

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

interface MapSector {
  sectorId: number;
  name: string;
  sectorType: string;
  warps: number[];
  isCurrent: boolean;
}

interface GalaxyMapProps {
  sectors: MapSector[];
  playerSector: number;
  totalDiscovered: number;
  totalSectors: number;
  onWarp?: (sectorId: number) => void;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════════
// SECTOR VISUAL CONFIG
// ═══════════════════════════════════════════════════════

const SECTOR_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  stardock:  { fill: "#00ffff", stroke: "#00cccc", glow: "rgba(0,255,255,0.4)" },
  station:   { fill: "#60a5fa", stroke: "#3b82f6", glow: "rgba(96,165,250,0.3)" },
  port:      { fill: "#34d399", stroke: "#10b981", glow: "rgba(52,211,153,0.3)" },
  planet:    { fill: "#a78bfa", stroke: "#8b5cf6", glow: "rgba(167,139,250,0.3)" },
  nebula:    { fill: "#f472b6", stroke: "#ec4899", glow: "rgba(244,114,182,0.25)" },
  asteroid:  { fill: "#fbbf24", stroke: "#f59e0b", glow: "rgba(251,191,36,0.3)" },
  hazard:    { fill: "#f87171", stroke: "#ef4444", glow: "rgba(248,113,113,0.3)" },
  wormhole:  { fill: "#c084fc", stroke: "#a855f7", glow: "rgba(192,132,252,0.4)" },
  empty:     { fill: "#6b7280", stroke: "#4b5563", glow: "rgba(107,114,128,0.15)" },
};

const SECTOR_ICONS: Record<string, string> = {
  stardock: "⚓", station: "🏛", port: "🏪", planet: "🌍",
  nebula: "🌫", asteroid: "☄", hazard: "⚠", wormhole: "🌀", empty: "·",
};

const SECTOR_SIZES: Record<string, number> = {
  stardock: 14, station: 11, port: 9, planet: 10,
  nebula: 8, asteroid: 7, hazard: 8, wormhole: 9, empty: 5,
};

// ═══════════════════════════════════════════════════════
// LAYOUT: Position sectors in a spiral galaxy pattern
// ═══════════════════════════════════════════════════════

function computeSectorPositions(sectors: MapSector[]): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();
  const centerX = 2000;
  const centerY = 2000;

  // Sort sectors by ID for deterministic layout
  const sorted = [...sectors].sort((a, b) => a.sectorId - b.sectorId);

  // Use a golden-angle spiral for organic galaxy feel
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

  sorted.forEach((sector, i) => {
    // Named sectors (1-30) get inner positions, procedural (31-200) spiral outward
    const isNamed = sector.sectorId <= 30;
    const baseRadius = isNamed ? 200 + i * 35 : 600 + (i - 30) * 12;
    const angle = i * goldenAngle;

    // Add some randomness seeded by sectorId for consistency
    const seed = sector.sectorId * 137.5;
    const jitterX = Math.sin(seed) * (isNamed ? 40 : 60);
    const jitterY = Math.cos(seed * 1.3) * (isNamed ? 40 : 60);

    // Spiral arms effect
    const armOffset = (sector.sectorId % 4) * (Math.PI / 2);
    const spiralAngle = angle + armOffset * 0.3;

    const x = centerX + Math.cos(spiralAngle) * baseRadius + jitterX;
    const y = centerY + Math.sin(spiralAngle) * baseRadius + jitterY;

    positions.set(sector.sectorId, { x, y });
  });

  // Force stardock (sector 1) to center
  if (positions.has(1)) {
    positions.set(1, { x: centerX, y: centerY });
  }

  return positions;
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function GalaxyMap({ sectors, playerSector, totalDiscovered, totalSectors, onWarp, onClose }: GalaxyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & zoom state
  const [viewBox, setViewBox] = useState({ x: 1500, y: 1500, w: 1000, h: 1000 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedSector, setSelectedSector] = useState<MapSector | null>(null);
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);

  // Compute positions
  const positions = useMemo(() => computeSectorPositions(sectors), [sectors]);
  const sectorMap = useMemo(() => {
    const m = new Map<number, MapSector>();
    sectors.forEach(s => m.set(s.sectorId, s));
    return m;
  }, [sectors]);

  // Center on player sector on mount
  useEffect(() => {
    const pos = positions.get(playerSector);
    if (pos) {
      setViewBox(prev => ({
        ...prev,
        x: pos.x - prev.w / 2,
        y: pos.y - prev.h / 2,
      }));
    }
  }, [playerSector, positions]);

  // ── Pan handlers ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;
    const dx = (e.clientX - panStart.x) * scaleX;
    const dy = (e.clientY - panStart.y) * scaleY;
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  }, [isPanning, panStart, viewBox]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // ── Zoom handlers ──
  const zoom = useCallback((factor: number) => {
    setViewBox(prev => {
      const newW = Math.max(200, Math.min(4000, prev.w * factor));
      const newH = Math.max(200, Math.min(4000, prev.h * factor));
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      return { x: cx - newW / 2, y: cy - newH / 2, w: newW, h: newH };
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    zoom(factor);
  }, [zoom]);

  // Center on player
  const centerOnPlayer = useCallback(() => {
    const pos = positions.get(playerSector);
    if (pos) {
      setViewBox(prev => ({
        ...prev,
        x: pos.x - prev.w / 2,
        y: pos.y - prev.h / 2,
      }));
    }
  }, [playerSector, positions]);

  // Fit all
  const fitAll = useCallback(() => {
    if (positions.size === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    positions.forEach(({ x, y }) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    const padding = 100;
    setViewBox({
      x: minX - padding,
      y: minY - padding,
      w: maxX - minX + padding * 2,
      h: maxY - minY + padding * 2,
    });
  }, [positions]);

  // ── Warp connections (edges) ──
  const edges = useMemo(() => {
    const edgeSet = new Set<string>();
    const result: { from: { x: number; y: number }; to: { x: number; y: number }; fromId: number; toId: number }[] = [];

    sectors.forEach(sector => {
      const fromPos = positions.get(sector.sectorId);
      if (!fromPos) return;

      (sector.warps || []).forEach(targetId => {
        const toPos = positions.get(targetId);
        if (!toPos) return;

        const edgeKey = [Math.min(sector.sectorId, targetId), Math.max(sector.sectorId, targetId)].join("-");
        if (edgeSet.has(edgeKey)) return;
        edgeSet.add(edgeKey);

        result.push({ from: fromPos, to: toPos, fromId: sector.sectorId, toId: targetId });
      });
    });

    return result;
  }, [sectors, positions]);

  // ── Get adjacent sectors for warp highlighting ──
  const adjacentToPlayer = useMemo(() => {
    const current = sectorMap.get(playerSector);
    return new Set(current?.warps || []);
  }, [playerSector, sectorMap]);

  // ── Sector click handler ──
  const handleSectorClick = useCallback((sector: MapSector) => {
    if (sector.sectorId === playerSector) {
      setSelectedSector(sector);
    } else if (adjacentToPlayer.has(sector.sectorId)) {
      setSelectedSector(sector);
    } else {
      setSelectedSector(sector);
    }
  }, [playerSector, adjacentToPlayer]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-900/80 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs sm:text-sm text-cyan-400 tracking-wider">GALAXY MAP</span>
          <span className="font-mono text-[10px] text-gray-500">
            {totalDiscovered}/{totalSectors} SECTORS DISCOVERED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => zoom(0.75)} className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => zoom(1.35)} className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button onClick={centerOnPlayer} className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Center on Ship">
            <Crosshair size={16} />
          </button>
          <button onClick={fitAll} className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors" title="Fit All">
            <Maximize2 size={16} />
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors ml-2" title="Close Map">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── SVG Galaxy ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Background stars */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 40% 50%, rgba(0,40,60,0.4) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 30%, rgba(40,0,60,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 30% 70%, rgba(0,30,50,0.3) 0%, transparent 50%),
              #000
            `,
          }}
        />

        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="w-full h-full"
          style={{ touchAction: "none" }}
        >
          <defs>
            {/* Glow filters for each sector type */}
            {Object.entries(SECTOR_COLORS).map(([type, colors]) => (
              <filter key={type} id={`glow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor={colors.glow} result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            {/* Player pulse animation */}
            <filter id="player-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor="rgba(0,255,255,0.6)" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Warp lane gradient */}
            <linearGradient id="warp-lane" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,255,0.15)" />
              <stop offset="50%" stopColor="rgba(0,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,255,255,0.15)" />
            </linearGradient>
            <linearGradient id="warp-lane-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,255,0.5)" />
              <stop offset="50%" stopColor="rgba(0,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,255,255,0.5)" />
            </linearGradient>
          </defs>

          {/* ── Warp Lanes ── */}
          {edges.map((edge, i) => {
            const isPlayerEdge = edge.fromId === playerSector || edge.toId === playerSector;
            const isHoveredEdge = edge.fromId === hoveredSector || edge.toId === hoveredSector;
            return (
              <line
                key={`edge-${i}`}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke={isPlayerEdge ? "rgba(0,255,255,0.35)" : isHoveredEdge ? "rgba(100,200,255,0.25)" : "rgba(100,150,200,0.08)"}
                strokeWidth={isPlayerEdge ? 1.5 : 0.7}
                strokeDasharray={isPlayerEdge ? "none" : "4 6"}
              />
            );
          })}

          {/* ── Sector Nodes ── */}
          {sectors.map(sector => {
            const pos = positions.get(sector.sectorId);
            if (!pos) return null;

            const colors = SECTOR_COLORS[sector.sectorType] || SECTOR_COLORS.empty;
            const size = SECTOR_SIZES[sector.sectorType] || 5;
            const isCurrent = sector.sectorId === playerSector;
            const isAdjacent = adjacentToPlayer.has(sector.sectorId);
            const isHovered = hoveredSector === sector.sectorId;
            const isSelected = selectedSector?.sectorId === sector.sectorId;

            return (
              <g
                key={sector.sectorId}
                onClick={(e) => { e.stopPropagation(); handleSectorClick(sector); }}
                onPointerEnter={() => setHoveredSector(sector.sectorId)}
                onPointerLeave={() => setHoveredSector(null)}
                className="cursor-pointer"
                style={{ pointerEvents: "all" }}
              >
                {/* Outer ring for current position */}
                {isCurrent && (
                  <>
                    <circle cx={pos.x} cy={pos.y} r={size + 12} fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3">
                      <animateTransform attributeName="transform" type="rotate" from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`} dur="20s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={pos.x} cy={pos.y} r={size + 6} fill="none" stroke="rgba(0,255,255,0.5)" strokeWidth="1.5">
                      <animate attributeName="r" values={`${size + 4};${size + 10};${size + 4}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Adjacent warpable indicator */}
                {isAdjacent && !isCurrent && (
                  <circle cx={pos.x} cy={pos.y} r={size + 4} fill="none" stroke="rgba(0,255,255,0.25)" strokeWidth="0.8" strokeDasharray="2 3" />
                )}

                {/* Main sector node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered || isSelected ? size + 2 : size}
                  fill={colors.fill}
                  stroke={isSelected ? "#ffffff" : colors.stroke}
                  strokeWidth={isCurrent ? 2.5 : isHovered ? 2 : 1}
                  opacity={isCurrent ? 1 : isAdjacent ? 0.9 : 0.65}
                  filter={isCurrent ? "url(#player-glow)" : `url(#glow-${sector.sectorType})`}
                />

                {/* Sector ID label */}
                <text
                  x={pos.x}
                  y={pos.y + size + 14}
                  textAnchor="middle"
                  fill={isCurrent ? "#00ffff" : isAdjacent ? "#94a3b8" : "#475569"}
                  fontSize={isCurrent ? "10" : "8"}
                  fontFamily="monospace"
                  fontWeight={isCurrent ? "bold" : "normal"}
                >
                  {sector.sectorId}
                </text>

                {/* Name label (only for named sectors or hovered) */}
                {(sector.sectorId <= 30 || isHovered || isSelected || isCurrent) && (
                  <text
                    x={pos.x}
                    y={pos.y - size - 6}
                    textAnchor="middle"
                    fill={isCurrent ? "#00ffff" : isHovered ? "#e2e8f0" : "#64748b"}
                    fontSize={isCurrent ? "9" : "7"}
                    fontFamily="monospace"
                    opacity={isHovered || isCurrent || isSelected ? 1 : 0.7}
                  >
                    {sector.name.length > 28 ? sector.name.substring(0, 25) + "..." : sector.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Sector Info Panel ── */}
      {selectedSector && (
        <div className="absolute bottom-14 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-80 bg-gray-900/95 border border-cyan-500/30 rounded-lg p-3 font-mono backdrop-blur-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{SECTOR_ICONS[selectedSector.sectorType] || "·"}</span>
                <span className="text-cyan-400 text-sm font-bold">SECTOR {selectedSector.sectorId}</span>
              </div>
              <p className="text-white text-xs mt-0.5">{selectedSector.name}</p>
            </div>
            <button onClick={() => setSelectedSector(null)} className="text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">TYPE:</span>
              <span
                className="font-bold uppercase"
                style={{ color: SECTOR_COLORS[selectedSector.sectorType]?.fill || "#6b7280" }}
              >
                {selectedSector.sectorType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">WARPS:</span>
              <span className="text-gray-300">
                {(selectedSector.warps || []).slice(0, 8).join(", ")}
                {(selectedSector.warps || []).length > 8 ? ` +${selectedSector.warps.length - 8} more` : ""}
              </span>
            </div>
            {selectedSector.sectorId === playerSector && (
              <div className="text-cyan-400 font-bold mt-1">▶ YOU ARE HERE</div>
            )}
          </div>

          {/* Warp button */}
          {adjacentToPlayer.has(selectedSector.sectorId) && selectedSector.sectorId !== playerSector && onWarp && (
            <button
              onClick={() => {
                onWarp(selectedSector.sectorId);
                setSelectedSector(null);
              }}
              className="w-full mt-3 px-3 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono rounded hover:bg-cyan-500/30 transition-colors"
            >
              ⚡ WARP TO SECTOR {selectedSector.sectorId}
            </button>
          )}
          {!adjacentToPlayer.has(selectedSector.sectorId) && selectedSector.sectorId !== playerSector && (
            <div className="mt-2 text-[10px] text-gray-500 italic">
              No direct warp lane. Navigate through connected sectors.
            </div>
          )}
        </div>
      )}

      {/* ── Legend ── */}
      <div className="px-3 py-2 bg-gray-900/80 border-t border-cyan-500/20 flex flex-wrap items-center gap-x-4 gap-y-1">
        {Object.entries(SECTOR_COLORS).filter(([type]) => type !== "empty").map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.fill }} />
            <span className="font-mono text-[9px] text-gray-400 uppercase">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[9px] text-cyan-400">YOUR SHIP</span>
        </div>
      </div>
    </div>
  );
}
