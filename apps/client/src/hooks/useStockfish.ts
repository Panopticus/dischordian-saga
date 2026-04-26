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
  /** Walk a finished game move-by-move at the given depth and
   *  return per-ply eval samples. Used by the post-game review. */
  postGameAnalyze: (
    startFen: string,
    moves: readonly string[],
    opts?: { depth?: number; onProgress?: (ply: number) => void },
  ) => Promise<
    ReadonlyArray<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
    }>
  >;
  /** Walk a finished game with multipv=2 evaluation per ply. Slower
   *  than `postGameAnalyze` but supplies the data needed for the
   *  brilliancy detector. */
  postGameAnalyzeWithBrilliancies: (
    startFen: string,
    moves: readonly string[],
    opts?: { depth?: number; onProgress?: (ply: number) => void },
  ) => Promise<
    ReadonlyArray<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
      playedUci: string;
      bestUci: string | null;
      bestEvalCp: number | null;
      secondBestEvalCp: number | null;
    }>
  >;
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

  const postGameAnalyze = useCallback(
    async (
      startFen: string,
      moves: readonly string[],
      opts?: { depth?: number; onProgress?: (ply: number) => void },
    ) => {
      if (!engineRef.current) return [] as const;
      return engineRef.current.postGameAnalyze(startFen, moves, opts);
    },
    [],
  );

  const postGameAnalyzeWithBrilliancies = useCallback(
    async (
      startFen: string,
      moves: readonly string[],
      opts?: { depth?: number; onProgress?: (ply: number) => void },
    ) => {
      if (!engineRef.current) return [] as const;
      return engineRef.current.postGameAnalyzeWithBrilliancies(
        startFen,
        moves,
        opts,
      );
    },
    [],
  );

  return {
    isReady,
    isThinking,
    evaluation,
    getBestMove,
    configure,
    newGame,
    postGameAnalyze,
    postGameAnalyzeWithBrilliancies,
  };
}
