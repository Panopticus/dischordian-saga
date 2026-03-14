/* ═══════════════════════════════════════════════════════
   FIGHT ARENA — React wrapper for the canvas game engine
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback } from "react";
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

  const initEngine = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const engine = new FightEngine(canvas, player, opponent, arena, difficulty);
    engine.onMatchEnd = (winner, perfect) => {
      setTimeout(() => onMatchEnd(winner, perfect), 2000);
    };
    engineRef.current = engine;
    engine.start();

    return engine;
  }, [player, opponent, arena, difficulty, onMatchEnd]);

  useEffect(() => {
    const engine = initEngine();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
        return;
      }
      if (e.key === "Enter" && engine?.gameState.phase === "match-end") {
        onBack();
        return;
      }
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
      canvas.width = rect.width;
      canvas.height = rect.height;
      engine.resize(rect.width, rect.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      engine?.stop();
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [initEngine, onBack]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Mobile touch controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none sm:hidden">
        <div className="flex gap-2 pointer-events-auto">
          <button
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-mono active:bg-white/30"
            onTouchStart={() => engineRef.current?.keys.add("a")}
            onTouchEnd={() => engineRef.current?.keys.delete("a")}
          >◀</button>
          <button
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-mono active:bg-white/30"
            onTouchStart={() => engineRef.current?.keys.add("d")}
            onTouchEnd={() => engineRef.current?.keys.delete("d")}
          >▶</button>
          <button
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-mono active:bg-white/30"
            onTouchStart={() => engineRef.current?.keys.add("w")}
            onTouchEnd={() => engineRef.current?.keys.delete("w")}
          >▲</button>
          <button
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-mono active:bg-white/30"
            onTouchStart={() => engineRef.current?.keys.add("s")}
            onTouchEnd={() => engineRef.current?.keys.delete("s")}
          >▼</button>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button
            className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xs font-mono font-bold active:bg-red-500/40"
            onTouchStart={() => engineRef.current?.keys.add("j")}
            onTouchEnd={() => engineRef.current?.keys.delete("j")}
          >ATK</button>
          <button
            className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 text-xs font-mono font-bold active:bg-orange-500/40"
            onTouchStart={() => engineRef.current?.keys.add("k")}
            onTouchEnd={() => engineRef.current?.keys.delete("k")}
          >HVY</button>
          <button
            className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold active:bg-cyan-500/40"
            onTouchStart={() => engineRef.current?.keys.add("l")}
            onTouchEnd={() => engineRef.current?.keys.delete("l")}
          >SPL</button>
        </div>
      </div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 px-3 py-1.5 rounded bg-black/60 border border-white/20 text-white/60 text-xs font-mono hover:bg-black/80 hover:text-white transition-colors"
      >
        ESC — BACK
      </button>
    </div>
  );
}
