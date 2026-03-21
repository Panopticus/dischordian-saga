import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useGameAreaBGM } from "@/contexts/GameAudioContext";
import { useGame } from "@/contexts/GameContext";
import FactionWarEventBanner from "@/components/FactionWarEventBanner";
import {
  Shield, Swords, Target, ChevronRight, Clock, Trophy,
  Zap, Users, MapPin, AlertTriangle, Crown, Crosshair
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ─── CONSTANTS ─── */
const MAP_SIZE = 1200;
const CENTER = MAP_SIZE / 2;
const GOLDEN_ANGLE = 137.508;

const FACTION_COLORS = {
  empire: { primary: "#ef4444", bg: "rgba(239,68,68,0.15)", glow: "rgba(239,68,68,0.4)", text: "text-red-400" },
  insurgency: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", glow: "rgba(59,130,246,0.4)", text: "text-blue-400" },
  contested: { primary: "#a855f7", bg: "rgba(168,85,247,0.15)", glow: "rgba(168,85,247,0.3)", text: "text-purple-400" },
};

function sectorPosition(sectorId: number) {
  const i = sectorId - 1;
  const angle = (i * GOLDEN_ANGLE * Math.PI) / 180;
  const r = 12 * Math.sqrt(i + 1);
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

function formatTimeRemaining(endDate: Date): string {
  const now = Date.now();
  const diff = new Date(endDate).getTime() - now;
  if (diff <= 0) return "Ending soon...";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}d ${hours}h remaining`;
}

export default function WarMapPage() {
  useGameAreaBGM("trade_combat");

  const { data: warData, isLoading, refetch } = trpc.warMap.getWarMap.useQuery();
  const contestMutation = trpc.warMap.contestSector.useMutation({
    onSuccess: () => refetch(),
  });
  const { data: seasonHistory } = trpc.warMap.getSeasonHistory.useQuery();

  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: MAP_SIZE, h: MAP_SIZE });
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Build territory lookup
  const territoryMap = useMemo(() => {
    if (!warData) return new Map();
    return new Map(warData.territories.map((t) => [t.sectorId, t]));
  }, [warData]);

  const selectedTerritory = selectedSector ? territoryMap.get(selectedSector) : null;

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStart.current.x) * (viewBox.w / MAP_SIZE);
    const dy = (e.clientY - dragStart.current.y) * (viewBox.h / MAP_SIZE);
    setViewBox((v) => ({ ...v, x: v.x - dx, y: v.y - dy }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, [viewBox.w, viewBox.h]);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox((v) => {
      const nw = Math.max(200, Math.min(MAP_SIZE * 2, v.w * factor));
      const nh = Math.max(200, Math.min(MAP_SIZE * 2, v.h * factor));
      return { x: v.x + (v.w - nw) / 2, y: v.y + (v.h - nh) / 2, w: nw, h: nh };
    });
  }, []);

  const handleContest = useCallback((action: "capture" | "reinforce" | "sabotage") => {
    if (!selectedSector) return;
    contestMutation.mutate({ sectorId: selectedSector, action });
  }, [selectedSector, contestMutation]);

  // Timer
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    if (!warData) return;
    const update = () => setTimeStr(formatTimeRemaining(warData.season.endsAt));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [warData]);

  if (isLoading || !warData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-mono text-sm text-muted-foreground">LOADING WAR MAP...</p>
        </div>
      </div>
    );
  }

  const { factionTotals, playerFaction, myContribution, season } = warData;
  const empirePercent = Math.round((factionTotals.empire / Math.max(1, factionTotals.total)) * 100);
  const insurgencyPercent = Math.round((factionTotals.insurgency / Math.max(1, factionTotals.total)) * 100);

  return (
    <div className="min-h-screen">
      {/* ═══ HEADER ═══ */}
      <div className="border-b border-border/30 bg-card/30">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/trade-empire" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                ← TRADE EMPIRE
              </Link>
              <div className="h-4 w-px bg-border/30" />
              <h1 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                <Swords size={18} className="text-destructive" />
                WAR MAP
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="font-mono text-xs px-3 py-1.5 rounded border border-border/30 bg-card/50 hover:bg-card/80 transition-colors flex items-center gap-1.5"
              >
                <Trophy size={12} />
                HISTORY
              </button>
              <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} />
                {timeStr}
              </div>
            </div>
          </div>

          {/* Season & Faction Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                SEASON {season.number}: {season.name.toUpperCase()}
              </span>
              <span className={`font-mono text-xs ${playerFaction === "empire" ? "text-red-400" : "text-blue-400"}`}>
                YOUR FACTION: {playerFaction === "empire" ? "THE ARCHITECT'S EMPIRE" : "THE DREAMER'S INSURGENCY"}
              </span>
            </div>

            {/* Territory control bar */}
            <div className="relative h-6 rounded-full overflow-hidden bg-secondary/50 border border-border/20">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000"
                style={{ width: `${empirePercent}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-600 to-blue-500 transition-all duration-1000"
                style={{ width: `${insurgencyPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="font-mono text-[10px] font-bold text-foreground drop-shadow-lg flex items-center gap-1">
                  <Shield size={10} /> EMPIRE {empirePercent}%
                </span>
                <span className="font-mono text-[10px] text-purple-300">
                  {factionTotals.contested} CONTESTED
                </span>
                <span className="font-mono text-[10px] font-bold text-foreground drop-shadow-lg flex items-center gap-1">
                  INSURGENCY {insurgencyPercent}% <Zap size={10} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FACTION WAR EVENT ═══ */}
      <FactionWarEventBanner />

      <div className="flex flex-col lg:flex-row" style={{ height: "calc(100vh - 140px)" }}>
        {/* ═══ MAP ═══ */}
        <div className="flex-1 relative overflow-hidden bg-background">
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Background grid */}
            <defs>
              <pattern id="warGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <filter id="warGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Territory glow filters */}
              <filter id="empireGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#ef4444" floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="insurgencyGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#3b82f6" floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x={viewBox.x - 100} y={viewBox.y - 100} width={viewBox.w + 200} height={viewBox.h + 200} fill="url(#warGrid)" />

            {/* Territory influence circles (large, translucent) */}
            {warData.territories.map((t) => {
              if (!t.faction) return null;
              const pos = sectorPosition(t.sectorId);
              const colors = FACTION_COLORS[t.faction as keyof typeof FACTION_COLORS];
              const radius = 8 + (t.controlPoints / 100) * 12;
              return (
                <circle
                  key={`influence-${t.sectorId}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={colors.bg}
                  stroke={colors.primary}
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                />
              );
            })}

            {/* Sector nodes */}
            {warData.territories.map((t) => {
              const pos = sectorPosition(t.sectorId);
              const isSelected = selectedSector === t.sectorId;
              const faction = t.faction;
              const colors = faction ? FACTION_COLORS[faction as keyof typeof FACTION_COLORS] : FACTION_COLORS.contested;
              const nodeSize = faction ? 3 + (t.controlPoints / 100) * 2 : 2;

              return (
                <g
                  key={`node-${t.sectorId}`}
                  onClick={() => setSelectedSector(t.sectorId)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r={nodeSize + 4} fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.8">
                      <animate attributeName="r" values={`${nodeSize + 3};${nodeSize + 6};${nodeSize + 3}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeSize}
                    fill={colors.primary}
                    stroke={isSelected ? "#00ffff" : colors.primary}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    filter={faction ? (faction === "empire" ? "url(#empireGlow)" : "url(#insurgencyGlow)") : undefined}
                    opacity={faction ? 0.9 : 0.4}
                  />
                  {/* Named sectors get labels */}
                  {t.sectorName && !t.sectorName.startsWith("Sector ") && (
                    <text
                      x={pos.x}
                      y={pos.y - nodeSize - 3}
                      textAnchor="middle"
                      fill={colors.primary}
                      fontSize="4"
                      fontFamily="monospace"
                      opacity="0.7"
                    >
                      {t.sectorName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map legend */}
          <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm border border-border/30 rounded-lg p-3 space-y-1.5">
            <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-2">TERRITORY LEGEND</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-mono text-[10px] text-red-400">Empire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-mono text-[10px] text-blue-400">Insurgency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 opacity-40" />
              <span className="font-mono text-[10px] text-purple-400">Contested</span>
            </div>
          </div>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/30 bg-card/20 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Your Stats */}
            <div className="border border-border/30 rounded-lg p-3 bg-card/30">
              <h3 className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">YOUR WAR EFFORT</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="font-display text-lg font-bold">{myContribution.totalPoints}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">POINTS</p>
                </div>
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="font-display text-lg font-bold">{myContribution.actions}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">ACTIONS</p>
                </div>
              </div>
            </div>

            {/* Selected Sector */}
            <AnimatePresence mode="wait">
              {selectedTerritory ? (
                <motion.div
                  key={selectedSector}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-border/30 rounded-lg p-3 bg-card/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-sm font-bold">{selectedTerritory.sectorName}</h3>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      selectedTerritory.faction === "empire"
                        ? "bg-red-500/20 text-red-400"
                        : selectedTerritory.faction === "insurgency"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {selectedTerritory.faction?.toUpperCase() || "CONTESTED"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">Type</span>
                      <span className="capitalize">{selectedTerritory.sectorType}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">Control</span>
                      <span>{selectedTerritory.controlPoints}%</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">Contested</span>
                      <span>{selectedTerritory.contestCount}x</span>
                    </div>
                    {/* Control bar */}
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          selectedTerritory.faction === "empire" ? "bg-red-500" :
                          selectedTerritory.faction === "insurgency" ? "bg-blue-500" :
                          "bg-purple-500"
                        }`}
                        style={{ width: `${selectedTerritory.controlPoints}%` }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-1.5">
                    {(!selectedTerritory.faction || selectedTerritory.faction !== playerFaction) && (
                      <button
                        onClick={() => handleContest("capture")}
                        disabled={contestMutation.isPending}
                        className="w-full font-mono text-xs px-3 py-2 rounded bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Crosshair size={12} />
                        {contestMutation.isPending ? "ATTACKING..." : "CAPTURE SECTOR"}
                      </button>
                    )}
                    {selectedTerritory.faction === playerFaction && (
                      <button
                        onClick={() => handleContest("reinforce")}
                        disabled={contestMutation.isPending}
                        className="w-full font-mono text-xs px-3 py-2 rounded bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Shield size={12} />
                        {contestMutation.isPending ? "REINFORCING..." : "REINFORCE (+10%)"}
                      </button>
                    )}
                    {selectedTerritory.faction && selectedTerritory.faction !== playerFaction && (
                      <button
                        onClick={() => handleContest("sabotage")}
                        disabled={contestMutation.isPending}
                        className="w-full font-mono text-xs px-3 py-2 rounded bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <AlertTriangle size={12} />
                        {contestMutation.isPending ? "SABOTAGING..." : "SABOTAGE (-8%)"}
                      </button>
                    )}
                  </div>

                  {/* Mutation result */}
                  {contestMutation.data && (
                    <div className={`mt-2 font-mono text-[10px] p-2 rounded ${
                      contestMutation.data.success ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {contestMutation.data.message}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-border/20 border-dashed rounded-lg p-4 text-center"
                >
                  <MapPin size={20} className="mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">Click a sector to view details and take action</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Faction Leaderboard */}
            <div className="border border-border/30 rounded-lg p-3 bg-card/30">
              <h3 className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                <Crown size={10} /> TOP CONTRIBUTORS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-[9px] text-red-400 mb-1">EMPIRE</p>
                  {warData.leaderboard.empire.length > 0 ? (
                    warData.leaderboard.empire.map((e, i) => (
                      <div key={i} className="flex items-center justify-between font-mono text-[10px] py-0.5">
                        <span className="text-muted-foreground">#{i + 1}</span>
                        <span className="text-red-400">{e.points} pts</span>
                      </div>
                    ))
                  ) : (
                    <p className="font-mono text-[9px] text-muted-foreground/50">No data yet</p>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[9px] text-blue-400 mb-1">INSURGENCY</p>
                  {warData.leaderboard.insurgency.length > 0 ? (
                    warData.leaderboard.insurgency.map((e, i) => (
                      <div key={i} className="flex items-center justify-between font-mono text-[10px] py-0.5">
                        <span className="text-muted-foreground">#{i + 1}</span>
                        <span className="text-blue-400">{e.points} pts</span>
                      </div>
                    ))
                  ) : (
                    <p className="font-mono text-[9px] text-muted-foreground/50">No data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Season History */}
            <AnimatePresence>
              {showHistory && seasonHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-border/30 rounded-lg p-3 bg-card/30 overflow-hidden"
                >
                  <h3 className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                    <Trophy size={10} /> PAST SEASONS
                  </h3>
                  {seasonHistory.length > 0 ? (
                    <div className="space-y-2">
                      {seasonHistory.map((s, i) => (
                        <div key={i} className="flex items-center justify-between font-mono text-[10px] py-1 border-b border-border/10 last:border-0">
                          <span className="text-muted-foreground">S{s.number}: {s.name}</span>
                          <span className={s.winner === "empire" ? "text-red-400" : "text-blue-400"}>
                            {s.winner === "empire" ? "EMPIRE" : "INSURGENCY"} WON
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono text-[9px] text-muted-foreground/50">No completed seasons yet</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
