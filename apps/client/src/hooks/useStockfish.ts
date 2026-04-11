/* ═══════════════════════════════════════════════════════
   useStockfish — React hook for Stockfish WASM engine
   Manages engine lifecycle, configuration, and move requests.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback } from "react";
import {
  StockfishEngine,
  getStockfishEngine,
  destroyStockfishEngine,
  AI_PRESETS,
  type StockfishConfig,
} from "@/lib/stockfishWorker";

interface UseStockfishReturn {
  isReady: boolean;
  isThinking: boolean;
  evaluation: number | null;
  getBestMove: (fen: string) => Promise<string | null>;
  configure: (preset: string | StockfishConfig) => void;
  newGame: () => void;
}

export function useStockfish(initialPreset?: string): UseStockfishReturn {
  const engineRef = useRef<StockfishEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<number | null>(null);

  useEffect(() => {
    const engine = getStockfishEngine();
    engineRef.current = engine;

    engine.waitReady().then(() => {
      setIsReady(true);
      if (initialPreset) {
        const config = AI_PRESETS[initialPreset] || AI_PRESETS.medium;
        engine.configure(config);
      }
    });

    return () => {
      // Don't destroy on unmount — singleton is shared
    };
  }, []);

  const configure = useCallback((preset: string | StockfishConfig) => {
    if (!engineRef.current) return;
    const config = typeof preset === "string"
      ? (AI_PRESETS[preset] || AI_PRESETS.medium)
      : preset;
    engineRef.current.configure(config);
  }, []);

  const getBestMove = useCallback(async (fen: string): Promise<string | null> => {
    if (!engineRef.current) return null;
    setIsThinking(true);
    try {
      const result = await engineRef.current.getBestMove(fen);
      setEvaluation(result.evaluation ?? null);
      setIsThinking(false);
      return result.bestMove || null;
    } catch (e) {
      console.error("[useStockfish] Error getting best move:", e);
      setIsThinking(false);
      return null;
    }
  }, []);

  const newGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.newGame();
    }
  }, []);

  return { isReady, isThinking, evaluation, getBestMove, configure, newGame };
}
