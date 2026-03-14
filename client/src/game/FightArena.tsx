/* ═══════════════════════════════════════════════════════
   FIGHT ARENA — React wrapper for the canvas game engine
   Mobile-first with virtual D-pad and action buttons
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback, useState } from "react";
import { FightEngine } from "./FightEngine";
import { type FighterData, type ArenaData, type DifficultyLevel } from "./gameData";

interface FightArenaProps {
  player: FighterData;
  opponent: FighterData;
  arena: ArenaData;
  difficulty: DifficultyLevel;
  onMatchEnd: (winner: "p1" | "p2", perfect: boolean) => void;
  onBack: () => void;
}

export default function FightArena({ player, opponent, arena, difficulty, onMatchEnd, onBack }: FightArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FightEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const initEngine = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    // On mobile, reserve bottom 35% for touch controls
    const gameH = isMobile ? rect.height * 0.62 : rect.height;
    canvas.width = rect.width;
    canvas.height = gameH;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${gameH}px`;

    const engine = new FightEngine(canvas, player, opponent, arena, difficulty);
    engine.onMatchEnd = (winner, perfect) => {
      setTimeout(() => onMatchEnd(winner, perfect), 2000);
    };
    engineRef.current = engine;
    engine.start();

    return engine;
  }, [player, opponent, arena, difficulty, onMatchEnd, isMobile]);

  useEffect(() => {
    const engine = initEngine();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onBack(); return; }
      if (e.key === "Enter" && engine?.gameState.phase === "match_end") { onBack(); return; }
      engine?.handleKeyDown(e);
    };
    const handleKeyUp = (e: KeyboardEvent) => engine?.handleKeyUp(e);

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);

    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || !engine) return;
      const rect = container.getBoundingClientRect();
      const gameH = isMobile ? rect.height * 0.62 : rect.height;
      canvas.width = rect.width;
      canvas.height = gameH;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${gameH}px`;
      engine.resize(rect.width, gameH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      engine?.stop();
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [initEngine, onBack, isMobile]);

  // Touch helpers — directly manipulate the engine's keys set
  const press = useCallback((key: string) => {
    engineRef.current?.keys.add(key);
  }, []);
  const release = useCallback((key: string) => {
    engineRef.current?.keys.delete(key);
  }, []);

  const touchBtn = (key: string, label: string, color: string, borderColor: string, textColor: string, size = "w-14 h-14") => (
    <button
      className={`${size} rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono select-none active:scale-90 transition-transform`}
      style={{ background: color, borderColor, color: textColor }}
      onTouchStart={(e) => { e.preventDefault(); press(key); }}
      onTouchEnd={(e) => { e.preventDefault(); release(key); }}
      onTouchCancel={() => release(key)}
      onMouseDown={(e) => { e.preventDefault(); press(key); }}
      onMouseUp={(e) => { e.preventDefault(); release(key); }}
      onMouseLeave={() => release(key)}
    >
      {label}
    </button>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black flex flex-col select-none" style={{ touchAction: "none" }}>
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="block flex-shrink-0"
        style={{ imageRendering: "pixelated" }}
      />

      {/* ═══ MOBILE TOUCH CONTROLS ═══ */}
      {isMobile && (
        <div className="flex-1 flex items-center justify-between px-3 py-2" style={{ minHeight: "35%" }}>
          {/* D-Pad */}
          <div className="relative" style={{ width: 130, height: 130 }}>
            {/* Up */}
            <button
              className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 rounded-lg bg-white/10 border border-white/25 active:bg-white/30 flex items-center justify-center"
              onTouchStart={(e) => { e.preventDefault(); press("w"); }}
              onTouchEnd={(e) => { e.preventDefault(); release("w"); }}
              onTouchCancel={() => release("w")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 2L14 10H2z"/></svg>
            </button>
            {/* Down */}
            <button
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-10 rounded-lg bg-white/10 border border-white/25 active:bg-white/30 flex items-center justify-center"
              onTouchStart={(e) => { e.preventDefault(); press("s"); }}
              onTouchEnd={(e) => { e.preventDefault(); release("s"); }}
              onTouchCancel={() => release("s")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 14L2 6h12z"/></svg>
            </button>
            {/* Left */}
            <button
              className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-lg bg-white/10 border border-white/25 active:bg-white/30 flex items-center justify-center"
              onTouchStart={(e) => { e.preventDefault(); press("a"); }}
              onTouchEnd={(e) => { e.preventDefault(); release("a"); }}
              onTouchCancel={() => release("a")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M2 8L10 2v12z"/></svg>
            </button>
            {/* Right */}
            <button
              className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 rounded-lg bg-white/10 border border-white/25 active:bg-white/30 flex items-center justify-center"
              onTouchStart={(e) => { e.preventDefault(); press("d"); }}
              onTouchEnd={(e) => { e.preventDefault(); release("d"); }}
              onTouchCancel={() => release("d")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M14 8L6 14V2z"/></svg>
            </button>
            {/* Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/5 border border-white/10" />
          </div>

          {/* Action Buttons — MK-style diamond layout */}
          <div className="relative" style={{ width: 150, height: 130 }}>
            {/* Punch — top (red) */}
            {touchBtn("j", "HP", "rgba(239,68,68,0.25)", "rgba(239,68,68,0.5)", "#ef4444")}
            <div className="absolute left-1/2 -translate-x-1/2 top-0">
              {touchBtn("j", "HP", "rgba(239,68,68,0.25)", "rgba(239,68,68,0.5)", "#ef4444", "w-12 h-12")}
            </div>
            {/* Kick — right (blue) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {touchBtn("k", "HK", "rgba(59,130,246,0.25)", "rgba(59,130,246,0.5)", "#3b82f6", "w-12 h-12")}
            </div>
            {/* Block — bottom (green) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
              {touchBtn("l", "BLK", "rgba(34,197,94,0.25)", "rgba(34,197,94,0.5)", "#22c55e", "w-12 h-12")}
            </div>
            {/* Special — left (yellow/gold) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              {touchBtn(" ", "SP", "rgba(234,179,8,0.25)", "rgba(234,179,8,0.5)", "#eab308", "w-12 h-12")}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Controls Legend */}
      {!isMobile && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4 text-[10px] font-mono text-white/30 bg-black/40 px-3 py-1 rounded">
          <span>WASD: Move</span>
          <span>J: Punch</span>
          <span>K: Kick</span>
          <span>L: Block</span>
          <span>Space: Special</span>
          <span>ESC: Quit</span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/60 border border-white/20 text-white/50 text-[10px] font-mono hover:bg-black/80 hover:text-white transition-colors z-10"
      >
        ESC
      </button>
    </div>
  );
}
