/* ═══════════════════════════════════════════════════════
   CHESSGROUND BOARD — Lichess-quality board component
   Wraps @lichess-org/chessground with Dischordian Saga theming.
   Supports drag & drop, premoves, animations, and highlights.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import { Chess } from "chess.js";
import type { Api } from "@lichess-org/chessground/api";
import type { Config } from "@lichess-org/chessground/config";
import type { Key, Color } from "@lichess-org/chessground/types";

// Import chessground CSS
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";

export interface ChessBoardProps {
  fen: string;
  orientation?: Color;
  onMove?: (from: string, to: string, promotion?: string) => void;
  lastMove?: [Key, Key] | null;
  check?: boolean | Color;
  viewOnly?: boolean;
  movable?: boolean;
  premovable?: boolean;
  highlight?: boolean;
  animation?: boolean;
  coordinates?: boolean;
  boardTheme?: "dark" | "cyber" | "void" | "amber";
}

/** Convert chess.js legal moves to chessground dests map */
function toDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  const moves = chess.moves({ verbose: true });
  for (const move of moves) {
    const from = move.from as Key;
    const to = move.to as Key;
    if (!dests.has(from)) dests.set(from, []);
    dests.get(from)!.push(to);
  }
  return dests;
}

/** Get the turn color from chess.js */
function toColor(chess: Chess): Color {
  return chess.turn() === "w" ? "white" : "black";
}

export default function ChessBoard({
  fen,
  orientation = "white",
  onMove,
  lastMove,
  check,
  viewOnly = false,
  movable = true,
  premovable = true,
  highlight = true,
  animation = true,
  coordinates = true,
  boardTheme = "dark",
}: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const chessRef = useRef(new Chess(fen));
  const [promotionPending, setPromotionPending] = useState<{
    from: Key;
    to: Key;
  } | null>(null);

  // Initialize chessground
  useEffect(() => {
    if (!boardRef.current) return;

    const chess = chessRef.current;
    chess.load(fen);

    const config: Config = {
      fen,
      orientation,
      turnColor: toColor(chess),
      viewOnly,
      coordinates,
      highlight: {
        lastMove: highlight,
        check: highlight,
      },
      animation: {
        enabled: animation,
        duration: 200,
      },
      premovable: {
        enabled: premovable,
      },
      movable: {
        free: false,
        color: movable ? orientation : undefined,
        dests: movable ? toDests(chess) : new Map(),
        showDests: true,
      },
      draggable: {
        enabled: true,
        showGhost: true,
      },
      events: {
        move: (orig: Key, dest: Key) => {
          // Check for promotion
          const chess = chessRef.current;
          const piece = chess.get(orig as any);
          if (
            piece?.type === "p" &&
            ((piece.color === "w" && dest[1] === "8") ||
              (piece.color === "b" && dest[1] === "1"))
          ) {
            setPromotionPending({ from: orig, to: dest });
            return;
          }

          if (onMove) {
            onMove(orig, dest);
          }
        },
      },
    };

    if (lastMove) {
      config.lastMove = lastMove;
    }

    if (check) {
      config.check = typeof check === "boolean" ? toColor(chess) : check;
    }

    const api = Chessground(boardRef.current, config);
    apiRef.current = api;

    return () => {
      api.destroy();
    };
  }, []); // Only init once

  // Update board when FEN changes
  useEffect(() => {
    if (!apiRef.current) return;
    const chess = chessRef.current;
    chess.load(fen);

    apiRef.current.set({
      fen,
      turnColor: toColor(chess),
      movable: {
        color: movable ? orientation : undefined,
        dests: movable ? toDests(chess) : new Map(),
      },
      lastMove: lastMove || undefined,
      check: check
        ? typeof check === "boolean"
          ? toColor(chess)
          : check
        : undefined,
    });
  }, [fen, lastMove, check, movable, orientation]);

  const handlePromotion = useCallback(
    (piece: string) => {
      if (!promotionPending || !onMove) return;
      onMove(promotionPending.from, promotionPending.to, piece);
      setPromotionPending(null);
    },
    [promotionPending, onMove]
  );

  // Board theme classes
  const themeClasses: Record<string, string> = {
    dark: "cg-board-dark",
    cyber: "cg-board-cyber",
    void: "cg-board-void",
    amber: "cg-board-amber",
  };

  return (
    <div className="relative">
      <div
        ref={boardRef}
        className={`cg-wrap ${themeClasses[boardTheme] || ""}`}
        style={{
          width: "100%",
          aspectRatio: "1",
          maxWidth: "600px",
        }}
      />

      {/* Promotion dialog */}
      {promotionPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 rounded-lg">
          <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-3">
            <p className="font-mono text-xs text-primary text-center tracking-wider">
              PROMOTE PAWN
            </p>
            <div className="flex gap-2">
              {[
                { piece: "q", label: "Queen", symbol: "♛" },
                { piece: "r", label: "Rook", symbol: "♜" },
                { piece: "b", label: "Bishop", symbol: "♝" },
                { piece: "n", label: "Knight", symbol: "♞" },
              ].map(({ piece, label, symbol }) => (
                <button
                  key={piece}
                  onClick={() => handlePromotion(piece)}
                  className="w-14 h-14 flex items-center justify-center text-3xl bg-secondary hover:bg-primary/20 border border-border/50 hover:border-primary/50 rounded-md transition-all"
                  title={label}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
