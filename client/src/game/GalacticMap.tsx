/* ═══════════════════════════════════════════════════════
   GALACTIC MAP — Interactive sector visualization
   Canvas-based galaxy map with faction territories,
   trade routes, threat indicators, and mission markers.
   ═══════════════════════════════════════════════════════ */
import { useRef, useEffect, useState, useCallback } from "react";
import { GALACTIC_MAP, GALACTIC_FACTIONS, type GalacticSector, type GalacticFactionId, type EmpireState } from "./tradeEmpire";

interface GalacticMapProps {
  empire: EmpireState;
  selectedSector: string | null;
  onSelectSector: (sectorId: string) => void;
  activeMissionSectors: Set<string>;
}

// Sector positions on the map (normalized 0-1 coordinates)
const SECTOR_POSITIONS: Record<string, { x: number; y: number }> = {
  ark_debris_field: { x: 0.3, y: 0.5 },
  trade_nexus: { x: 0.45, y: 0.35 },
  free_ports: { x: 0.35, y: 0.3 },
  new_babylon_core: { x: 0.6, y: 0.25 },
  empire_frontier: { x: 0.7, y: 0.35 },
  panopticon_ruins: { x: 0.75, y: 0.5 },
  terminus_approach: { x: 0.8, y: 0.65 },
  terminus_core: { x: 0.9, y: 0.75 },
  viral_wastes: { x: 0.5, y: 0.65 },
  insurgency_haven: { x: 0.25, y: 0.35 },
  frontier_worlds: { x: 0.2, y: 0.55 },
  forge_worlds: { x: 0.75, y: 0.25 },
  hell_gate: { x: 0.85, y: 0.2 },
  abyssal_sectors: { x: 0.92, y: 0.15 },
  dreamer_barrier: { x: 0.1, y: 0.6 },
  black_hole_gate: { x: 0.4, y: 0.15 },
};

export default function GalacticMap({ empire, selectedSector, onSelectSector, activeMissionSectors }: GalacticMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });

  // Resize handling
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setCanvasSize({ w: Math.floor(rect.width), h: Math.floor(Math.min(rect.width * 0.6, 500)) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Mouse handling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / canvasSize.w;
    const my = (e.clientY - rect.top) / canvasSize.h;

    let found: string | null = null;
    for (const [id, pos] of Object.entries(SECTOR_POSITIONS)) {
      const dx = mx - pos.x;
      const dy = my - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 0.04) { found = id; break; }
    }
    setHoveredSector(found);
  }, [canvasSize]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredSector) onSelectSector(hoveredSector);
  }, [hoveredSector, onSelectSector]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;
    const W = canvasSize.w;
    const H = canvasSize.h;

    // Background — deep space
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, W, H);

    // Stars
    for (let i = 0; i < 200; i++) {
      const sx = Math.random() * W;
      const sy = Math.random() * H;
      const brightness = 0.1 + Math.random() * 0.4;
      ctx.fillStyle = `rgba(255,255,255,${brightness})`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Draw connections between adjacent sectors
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (const sector of GALACTIC_MAP) {
      const pos = SECTOR_POSITIONS[sector.id];
      if (!pos) continue;
      for (const adjId of sector.adjacentSectors) {
        const adjPos = SECTOR_POSITIONS[adjId];
        if (!adjPos) continue;
        ctx.beginPath();
        ctx.moveTo(pos.x * W, pos.y * H);
        ctx.lineTo(adjPos.x * W, adjPos.y * H);
        ctx.stroke();
      }
    }

    // Draw trade routes (between controlled/allied sectors)
    ctx.strokeStyle = "rgba(34,211,238,0.15)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    for (const sectorId of empire.controlledSectors) {
      const sector = GALACTIC_MAP.find(s => s.id === sectorId);
      const pos = SECTOR_POSITIONS[sectorId];
      if (!sector || !pos) continue;
      for (const adjId of sector.adjacentSectors) {
        if (empire.controlledSectors.includes(adjId)) {
          const adjPos = SECTOR_POSITIONS[adjId];
          if (!adjPos) continue;
          ctx.beginPath();
          ctx.moveTo(pos.x * W, pos.y * H);
          ctx.lineTo(adjPos.x * W, adjPos.y * H);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    // Draw sectors
    for (const sector of GALACTIC_MAP) {
      const pos = SECTOR_POSITIONS[sector.id];
      if (!pos) continue;
      const x = pos.x * W;
      const y = pos.y * H;
      const faction = GALACTIC_FACTIONS[sector.controlledBy];
      const isOwned = empire.controlledSectors.includes(sector.id);
      const isSelected = selectedSector === sector.id;
      const isHovered = hoveredSector === sector.id;
      const hasMission = activeMissionSectors.has(sector.id);

      // Territory glow
      const radius = 15 + (sector.population > 1000 ? 8 : sector.population > 100 ? 4 : 0);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, faction.color + "30");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Sector dot
      ctx.beginPath();
      ctx.arc(x, y, isHovered || isSelected ? radius + 3 : radius, 0, Math.PI * 2);
      ctx.fillStyle = isOwned ? "#22d3ee" + "60" : faction.color + "40";
      ctx.fill();
      ctx.strokeStyle = isSelected ? "#ffffff" : isOwned ? "#22d3ee" : faction.color;
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
      ctx.stroke();

      // Threat indicator (red ring for high threat)
      if (sector.threat > 60) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 6, 0, Math.PI * 2 * (sector.threat / 100));
        ctx.strokeStyle = `rgba(255,${Math.floor(255 * (1 - sector.threat / 100))},0,0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Mission marker
      if (hasMission) {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x + radius, y - radius, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Anomaly marker
      if (sector.hasAnomaly) {
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(x - radius, y - radius, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Label
      ctx.fillStyle = isHovered || isSelected ? "#ffffff" : "rgba(255,255,255,0.4)";
      ctx.font = `${isHovered || isSelected ? "bold " : ""}9px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(sector.name, x, y + radius + 12);
    }

    // Dreamer's Barrier special rendering
    const barrierPos = SECTOR_POSITIONS["dreamer_barrier"];
    if (barrierPos) {
      ctx.beginPath();
      ctx.arc(barrierPos.x * W, barrierPos.y * H, 40, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,234,0,0.3)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [canvasSize, empire, selectedSector, hoveredSector, activeMissionSectors]);

  // Sector info tooltip
  const tooltipSector = hoveredSector ? GALACTIC_MAP.find(s => s.id === hoveredSector) : null;
  const tooltipFaction = tooltipSector ? GALACTIC_FACTIONS[tooltipSector.controlledBy] : null;

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full rounded-xl border border-white/5 cursor-crosshair"
        style={{ imageRendering: "auto" }}
      />

      {/* Tooltip */}
      {tooltipSector && tooltipFaction && (
        <div className="absolute top-2 left-2 z-10 p-3 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tooltipFaction.color }} />
            <p className="font-mono text-xs font-bold text-white">{tooltipSector.name}</p>
          </div>
          <p className="font-mono text-[9px] text-white/40 mb-2" style={{ color: tooltipFaction.color }}>{tooltipFaction.name}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] font-mono text-white/50">
            <span>Credits: {tooltipSector.resources.credits}/cycle</span>
            <span>Materials: {tooltipSector.resources.materials}/cycle</span>
            <span>Threat: <span className={tooltipSector.threat > 60 ? "text-red-400" : tooltipSector.threat > 30 ? "text-amber-400" : "text-green-400"}>{tooltipSector.threat}%</span></span>
            <span>Stability: {tooltipSector.stability}%</span>
            {tooltipSector.hasRuins && <span className="text-purple-400">Pre-Fall ruins</span>}
            {tooltipSector.hasAnomaly && <span className="text-purple-400">Anomaly detected</span>}
          </div>
          {tooltipSector.lore && <p className="text-[8px] text-white/20 mt-2 italic leading-relaxed">{tooltipSector.lore}</p>}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex flex-wrap gap-2 text-[8px] font-mono text-white/30">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> You</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Mission</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Anomaly</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Threat</span>
      </div>
    </div>
  );
}
