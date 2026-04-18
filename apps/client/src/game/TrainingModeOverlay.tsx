/**
 * TrainingModeOverlay — Real-time frame data, move list, and training controls
 * Rendered as an HTML overlay on top of the FightArena2D canvas.
 */
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, RotateCcw, ChevronDown, ChevronUp,
  Zap, Shield, Heart, Gauge, Crosshair, List, Settings2, X
} from "lucide-react";
import type { TrainingData, MoveListEntry } from "./FightEngine2D";

interface TrainingModeOverlayProps {
  getTrainingData: () => TrainingData;
  getMoveList: (player: 1 | 2) => MoveListEntry[];
  onToggleHitboxes: (show: boolean) => void;
  onToggleFrameData: (show: boolean) => void;
  onResetDummy: () => void;
  onResetPositions: () => void;
  onSetInfiniteHealth: (on: boolean) => void;
  onSetInfiniteMeter: (on: boolean) => void;
  onSetAutoRecover: (on: boolean) => void;
  p1Name: string;
  p2Name: string;
}

/** Frame data bar visualization */
const FrameBar = memo(({ startup, active, recovery, currentFrame }: {
  startup: number; active: number; recovery: number; currentFrame: number;
}) => {
  const total = startup + active + recovery;
  if (total === 0) return null;

  return (
    <div className="flex h-3 rounded-sm overflow-hidden border border-white/10" style={{ width: "100%" }}>
      {/* Startup frames - yellow */}
      <div
        className="relative"
        style={{
          width: `${(startup / total) * 100}%`,
          backgroundColor: currentFrame < startup ? "var(--energy-accent)" : "#78350f",
        }}
      >
        {currentFrame < startup && (
          <div
            className="absolute top-0 bottom-0 bg-white/40"
            style={{
              left: `${(currentFrame / startup) * 100}%`,
              width: "2px",
            }}
          />
        )}
      </div>
      {/* Active frames - red */}
      <div
        className="relative"
        style={{
          width: `${(active / total) * 100}%`,
          backgroundColor: currentFrame >= startup && currentFrame < startup + active ? "var(--energy-error)" : "#7f1d1d",
        }}
      >
        {currentFrame >= startup && currentFrame < startup + active && (
          <div
            className="absolute top-0 bottom-0 bg-white/40"
            style={{
              left: `${((currentFrame - startup) / active) * 100}%`,
              width: "2px",
            }}
          />
        )}
      </div>
      {/* Recovery frames - blue */}
      <div
        className="relative"
        style={{
          width: `${(recovery / total) * 100}%`,
          backgroundColor: currentFrame >= startup + active ? "#3b82f6" : "#1e3a5f",
        }}
      >
        {currentFrame >= startup + active && (
          <div
            className="absolute top-0 bottom-0 bg-white/40"
            style={{
              left: `${((currentFrame - startup - active) / recovery) * 100}%`,
              width: "2px",
            }}
          />
        )}
      </div>
    </div>
  );
});

/** State display badge */
const StateBadge = ({ state, phase }: { state: string; phase?: string }) => {
  const phaseColor = phase === "startup" ? "void-bg-sunk void-text-premium" :
                     phase === "active" ? "void-bg-error void-text-error" :
                     phase === "recovery" ? "void-bg-sunk void-text-energy" :
                     "bg-white/10 text-white/60";
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${phaseColor}`}>
      {state.replace(/_/g, " ")}
    </span>
  );
};

export default function TrainingModeOverlay({
  getTrainingData,
  getMoveList,
  onToggleHitboxes,
  onToggleFrameData,
  onResetDummy,
  onResetPositions,
  onSetInfiniteHealth,
  onSetInfiniteMeter,
  onSetAutoRecover,
  p1Name,
  p2Name,
}: TrainingModeOverlayProps) {
  const [data, setData] = useState<TrainingData | null>(null);
  const [showMoveList, setShowMoveList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [infiniteHealth, setInfiniteHealth] = useState(true);
  const [infiniteMeter, setInfiniteMeter] = useState(false);
  const [autoRecover, setAutoRecover] = useState(true);
  const [showHitboxes, setShowHitboxes] = useState(true);
  const [showFrameDataPanel, setShowFrameDataPanel] = useState(true);
  const [moveList, setMoveList] = useState<MoveListEntry[]>([]);
  const rafRef = useRef<number>(0);

  // Poll training data at ~30fps for the overlay
  useEffect(() => {
    let running = true;
    const poll = () => {
      if (!running) return;
      try {
        const d = getTrainingData();
        setData(d);
      } catch { /* engine destroyed */ }
      rafRef.current = requestAnimationFrame(poll);
    };
    poll();
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [getTrainingData]);

  // Load move list once
  useEffect(() => {
    try {
      setMoveList(getMoveList(1));
    } catch { /* engine not ready */ }
  }, [getMoveList]);

  const toggleHitboxes = useCallback(() => {
    const next = !showHitboxes;
    setShowHitboxes(next);
    onToggleHitboxes(next);
  }, [showHitboxes, onToggleHitboxes]);

  const toggleFrameData = useCallback(() => {
    const next = !showFrameDataPanel;
    setShowFrameDataPanel(next);
    onToggleFrameData(next);
  }, [showFrameDataPanel, onToggleFrameData]);

  const toggleInfiniteHealth = useCallback(() => {
    const next = !infiniteHealth;
    setInfiniteHealth(next);
    onSetInfiniteHealth(next);
  }, [infiniteHealth, onSetInfiniteHealth]);

  const toggleInfiniteMeter = useCallback(() => {
    const next = !infiniteMeter;
    setInfiniteMeter(next);
    onSetInfiniteMeter(next);
  }, [infiniteMeter, onSetInfiniteMeter]);

  const toggleAutoRecover = useCallback(() => {
    const next = !autoRecover;
    setAutoRecover(next);
    onSetAutoRecover(next);
  }, [autoRecover, onSetAutoRecover]);

  if (!data) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* ═══ TOP: Training Mode Banner + Quick Stats ═══ */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-3 px-3 py-1 rounded-md bg-black/70 border border-accent/30 backdrop-blur-sm">
          <Crosshair size={12} className="text-accent" />
          <span className="font-mono text-[10px] text-accent tracking-[0.25em]">TRAINING MODE</span>
          <span className="font-mono text-[10px] text-white/40">|</span>
          <span className="font-mono text-[10px] text-white/50">
            F: {data.frameCount}
          </span>
          <span className="font-mono text-[10px] text-white/50">
            DIST: {data.distance}px
          </span>
        </div>
      </div>

      {/* ═══ LEFT: P1 Frame Data Panel ═══ */}
      <AnimatePresence>
        {showFrameDataPanel && (
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-2 w-48 pointer-events-auto"
          >
            <div className="bg-black/80 border void-border-success rounded-md p-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-2 border-b void-border-success pb-1.5">
                <div className="w-1.5 h-1.5 rounded-full void-bg-success" />
                <span className="font-mono text-[9px] void-text-energy tracking-wider">P1 — {p1Name.toUpperCase()}</span>
              </div>

              {/* State */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] text-white/40">STATE</span>
                <StateBadge state={data.p1.state} phase={data.p1.moveData?.currentPhase} />
              </div>

              {/* Frame counter */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] text-white/40">FRAME</span>
                <span className="font-mono text-[10px] text-white/80">{data.p1.stateFrame}</span>
              </div>

              {/* Active move frame data */}
              {data.p1.moveData && (
                <div className="mb-2 space-y-1">
                  <FrameBar
                    startup={data.p1.moveData.startup}
                    active={data.p1.moveData.active}
                    recovery={data.p1.moveData.recovery}
                    currentFrame={data.p1.stateFrame}
                  />
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                      <p className="font-mono text-[7px] void-text-premium">STARTUP</p>
                      <p className="font-mono text-[10px] void-text-premium font-bold">{data.p1.moveData.startup}f</p>
                    </div>
                    <div>
                      <p className="font-mono text-[7px] void-text-error">ACTIVE</p>
                      <p className="font-mono text-[10px] void-text-error font-bold">{data.p1.moveData.active}f</p>
                    </div>
                    <div>
                      <p className="font-mono text-[7px] void-text-energy">RECOVERY</p>
                      <p className="font-mono text-[10px] void-text-energy font-bold">{data.p1.moveData.recovery}f</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">DMG</span>
                    <span className="font-mono text-[10px] void-text-error">{data.p1.moveData.damage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">TYPE</span>
                    <span className="font-mono text-[10px] text-white/70 uppercase">{data.p1.moveData.type}</span>
                  </div>
                </div>
              )}

              {/* Combo info */}
              {data.p1.comboCount > 0 && (
                <div className="border-t void-border-success pt-1.5 mt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">COMBO</span>
                    <span className="font-mono text-xs void-text-energy font-bold">{data.p1.comboCount} HITS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">DMG</span>
                    <span className="font-mono text-[10px] void-text-error">{data.p1.comboDamage}</span>
                  </div>
                </div>
              )}

              {/* Position */}
              <div className="border-t void-border-success pt-1.5 mt-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-white/40">POS</span>
                  <span className="font-mono text-[9px] text-white/50">
                    ({data.p1.x}, {data.p1.y})
                  </span>
                </div>
                <div className="flex gap-1.5 mt-0.5">
                  {data.p1.airborne && <span className="font-mono text-[7px] void-text-system void-bg-system px-1 rounded">AIR</span>}
                  {data.p1.isCrouching && <span className="font-mono text-[7px] void-text-energy void-bg-success px-1 rounded">CROUCH</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ RIGHT: P2 Frame Data Panel ═══ */}
      <AnimatePresence>
        {showFrameDataPanel && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-2 w-48 pointer-events-auto"
          >
            <div className="bg-black/80 border void-border-error rounded-md p-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-2 border-b void-border-error pb-1.5">
                <div className="w-1.5 h-1.5 rounded-full void-bg-error" />
                <span className="font-mono text-[9px] void-text-error tracking-wider">P2 — {p2Name.toUpperCase()}</span>
              </div>

              {/* State */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] text-white/40">STATE</span>
                <StateBadge state={data.p2.state} phase={data.p2.moveData?.currentPhase} />
              </div>

              {/* Frame counter */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] text-white/40">FRAME</span>
                <span className="font-mono text-[10px] text-white/80">{data.p2.stateFrame}</span>
              </div>

              {/* Active move frame data */}
              {data.p2.moveData && (
                <div className="mb-2 space-y-1">
                  <FrameBar
                    startup={data.p2.moveData.startup}
                    active={data.p2.moveData.active}
                    recovery={data.p2.moveData.recovery}
                    currentFrame={data.p2.stateFrame}
                  />
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                      <p className="font-mono text-[7px] void-text-premium">STARTUP</p>
                      <p className="font-mono text-[10px] void-text-premium font-bold">{data.p2.moveData.startup}f</p>
                    </div>
                    <div>
                      <p className="font-mono text-[7px] void-text-error">ACTIVE</p>
                      <p className="font-mono text-[10px] void-text-error font-bold">{data.p2.moveData.active}f</p>
                    </div>
                    <div>
                      <p className="font-mono text-[7px] void-text-energy">RECOVERY</p>
                      <p className="font-mono text-[10px] void-text-energy font-bold">{data.p2.moveData.recovery}f</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">DMG</span>
                    <span className="font-mono text-[10px] void-text-error">{data.p2.moveData.damage}</span>
                  </div>
                </div>
              )}

              {/* Combo info */}
              {data.p2.comboCount > 0 && (
                <div className="border-t void-border-error pt-1.5 mt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">COMBO</span>
                    <span className="font-mono text-xs void-text-error font-bold">{data.p2.comboCount} HITS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/40">DMG</span>
                    <span className="font-mono text-[10px] void-text-error">{data.p2.comboDamage}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ BOTTOM: Training Stats Bar ═══ */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-4 px-4 py-1.5 rounded-md bg-black/70 border border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <p className="font-mono text-[7px] text-white/30 tracking-wider">MAX COMBO</p>
            <p className="font-mono text-sm void-text-energy font-bold">{data.stats.maxCombo}</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="font-mono text-[7px] text-white/30 tracking-wider">TOTAL DMG</p>
            <p className="font-mono text-sm void-text-error font-bold">{data.stats.totalDamage}</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="font-mono text-[7px] text-white/30 tracking-wider">HITS</p>
            <p className="font-mono text-sm void-text-accent font-bold">{data.stats.hitsLanded}</p>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT SIDE: Control Buttons ═══ */}
      <div className="absolute bottom-14 right-2 flex flex-col gap-1.5 pointer-events-auto">
        {/* Toggle Hitboxes */}
        <button
          onClick={toggleHitboxes}
          className={`p-1.5 rounded-md border transition-colors ${
            showHitboxes
              ? "void-bg-success void-border-success void-text-energy"
              : "bg-black/60 border-white/10 text-white/40"
          }`}
          title="Toggle Hitbox/Hurtbox Display"
        >
          {showHitboxes ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {/* Toggle Frame Data */}
        <button
          onClick={toggleFrameData}
          className={`p-1.5 rounded-md border transition-colors ${
            showFrameDataPanel
              ? "void-bg-sunk void-border void-text-accent"
              : "bg-black/60 border-white/10 text-white/40"
          }`}
          title="Toggle Frame Data Panel"
        >
          <Gauge size={14} />
        </button>

        {/* Move List */}
        <button
          onClick={() => setShowMoveList(!showMoveList)}
          className={`p-1.5 rounded-md border transition-colors ${
            showMoveList
              ? "void-bg-system void-border-system void-text-system"
              : "bg-black/60 border-white/10 text-white/40"
          }`}
          title="Move List"
        >
          <List size={14} />
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-md border transition-colors ${
            showSettings
              ? "void-bg-success void-border-success void-text-energy"
              : "bg-black/60 border-white/10 text-white/40"
          }`}
          title="Training Settings"
        >
          <Settings2 size={14} />
        </button>

        {/* Reset Dummy */}
        <button
          onClick={onResetDummy}
          className="p-1.5 rounded-md border bg-black/60 border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
          title="Reset Dummy"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* ═══ MOVE LIST PANEL ═══ */}
      <AnimatePresence>
        {showMoveList && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-2 right-14 max-h-[50%] overflow-y-auto pointer-events-auto"
          >
            <div className="bg-black/90 border void-border-system rounded-md p-2 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2 border-b void-border-system pb-1.5">
                <span className="font-mono text-[10px] void-text-system tracking-wider flex items-center gap-1.5">
                  <List size={12} />
                  MOVE LIST — {p1Name.toUpperCase()}
                </span>
                <button onClick={() => setShowMoveList(false)} className="text-white/40 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-8 gap-1 mb-1 text-center">
                <span className="font-mono text-[7px] text-white/30 col-span-2 text-left">MOVE</span>
                <span className="font-mono text-[7px] void-text-premium">START</span>
                <span className="font-mono text-[7px] void-text-error">ACTIVE</span>
                <span className="font-mono text-[7px] void-text-energy">RECOV</span>
                <span className="font-mono text-[7px] text-white/30">TOTAL</span>
                <span className="font-mono text-[7px] void-text-error">DMG</span>
                <span className="font-mono text-[7px] text-white/30">TYPE</span>
              </div>

              {/* Move rows */}
              {moveList.map((move, i) => (
                <div
                  key={move.input}
                  className={`grid grid-cols-8 gap-1 py-0.5 text-center ${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  } ${move.input.startsWith("special") ? "border-t void-border-system" : ""}`}
                >
                  <span className="font-mono text-[8px] text-white/70 col-span-2 text-left truncate" title={move.name}>
                    {move.name}
                  </span>
                  <span className="font-mono text-[9px] void-text-premium">{move.startup}f</span>
                  <span className="font-mono text-[9px] void-text-error">{move.active}f</span>
                  <span className="font-mono text-[9px] void-text-energy">{move.recovery}f</span>
                  <span className="font-mono text-[9px] text-white/50">{move.total}f</span>
                  <span className="font-mono text-[9px] void-text-error">{move.damage}</span>
                  <span className="font-mono text-[7px] text-white/40 uppercase">{move.type}</span>
                </div>
              ))}

              {/* Legend */}
              <div className="mt-2 pt-1.5 border-t void-border-system flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm void-bg-sunk" />
                  <span className="font-mono text-[7px] text-white/30">Startup</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm void-bg-error" />
                  <span className="font-mono text-[7px] text-white/30">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm void-bg-sunk" />
                  <span className="font-mono text-[7px] text-white/30">Recovery</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SETTINGS PANEL ═══ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-14 w-52 pointer-events-auto"
          >
            <div className="bg-black/90 border void-border-success rounded-md p-2 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2 border-b void-border-success pb-1.5">
                <span className="font-mono text-[10px] void-text-energy tracking-wider flex items-center gap-1.5">
                  <Settings2 size={12} />
                  TRAINING SETTINGS
                </span>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              <div className="space-y-2">
                {/* Infinite Health */}
                <button
                  onClick={toggleInfiniteHealth}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Heart size={12} className={infiniteHealth ? "void-text-energy" : "text-white/30"} />
                    <span className="font-mono text-[9px] text-white/70">Infinite Health (P2)</span>
                  </span>
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                    infiniteHealth ? "void-bg-success void-text-energy" : "bg-white/5 text-white/30"
                  }`}>
                    {infiniteHealth ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Infinite Meter */}
                <button
                  onClick={toggleInfiniteMeter}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap size={12} className={infiniteMeter ? "void-text-accent" : "text-white/30"} />
                    <span className="font-mono text-[9px] text-white/70">Infinite Meter (P1)</span>
                  </span>
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                    infiniteMeter ? "void-bg-sunk void-text-accent" : "bg-white/5 text-white/30"
                  }`}>
                    {infiniteMeter ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Auto Recover */}
                <button
                  onClick={toggleAutoRecover}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield size={12} className={autoRecover ? "void-text-energy" : "text-white/30"} />
                    <span className="font-mono text-[9px] text-white/70">Auto Recover (P2)</span>
                  </span>
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                    autoRecover ? "void-bg-sunk void-text-energy" : "bg-white/5 text-white/30"
                  }`}>
                    {autoRecover ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Divider */}
                <div className="border-t border-white/5 pt-2">
                  <button
                    onClick={() => { onResetDummy(); onResetPositions(); }}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded border void-border-error void-border-error void-text-error void-text-error transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span className="font-mono text-[9px]">RESET ALL</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
