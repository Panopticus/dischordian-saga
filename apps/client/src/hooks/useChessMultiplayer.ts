/* ═══════════════════════════════════════════════════════
   useChessMultiplayer — WebSocket hook for live PvP chess
   Manages socket connection, matchmaking, and game state.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface PlayerInfo {
  userId: number;
  username: string;
  elo: number;
}

interface GameState {
  gameId: string;
  color: "white" | "black";
  white: PlayerInfo;
  black: PlayerInfo;
  fen: string;
  whiteTime: number;
  blackTime: number;
  moves: string[];
  status: "active" | "completed";
  result?: "white" | "black" | "draw";
  resultReason?: string;
}

interface LiveGameEntry {
  id: string;
  white: { username: string; elo: number };
  black: { username: string; elo: number } | null;
  moveCount: number;
  spectatorCount: number;
}

interface UseChessMultiplayerReturn {
  isConnected: boolean;
  isSeeking: boolean;
  game: GameState | null;
  liveGames: LiveGameEntry[];
  drawOffered: boolean;
  connect: (userId: number, username: string, elo: number) => void;
  disconnect: () => void;
  seekGame: (timeControl: string) => void;
  cancelSeek: () => void;
  makeMove: (from: string, to: string, promotion?: string) => void;
  resign: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  spectateGame: (gameId: string) => void;
  refreshGames: () => void;
}

export function useChessMultiplayer(): UseChessMultiplayerReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [game, setGame] = useState<GameState | null>(null);
  const [liveGames, setLiveGames] = useState<LiveGameEntry[]>([]);
  const [drawOffered, setDrawOffered] = useState(false);

  const connect = useCallback((userId: number, username: string, elo: number) => {
    if (socketRef.current?.connected) return;

    const socket = io({
      path: "/api/chess-ws",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("auth", { userId, username, elo });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("auth:ok", () => {
      console.log("[Chess MP] Authenticated");
    });

    socket.on("seek:waiting", () => {
      setIsSeeking(true);
    });

    socket.on("seek:cancelled", () => {
      setIsSeeking(false);
    });

    socket.on("game:start", (data: any) => {
      setIsSeeking(false);
      setGame({
        gameId: data.gameId,
        color: data.color,
        white: data.white,
        black: data.black,
        fen: data.fen,
        whiteTime: data.timeControl.initial * 1000,
        blackTime: data.timeControl.initial * 1000,
        moves: [],
        status: "active",
      });
    });

    socket.on("game:move", (data: any) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          fen: data.fen,
          whiteTime: data.whiteTime,
          blackTime: data.blackTime,
          moves: [...prev.moves, data.san],
          status: data.result ? "completed" : "active",
          result: data.result,
          resultReason: data.resultReason,
        };
      });
    });

    socket.on("game:clock", (data: any) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          whiteTime: data.whiteTime,
          blackTime: data.blackTime,
        };
      });
    });

    socket.on("game:end", (data: any) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "completed",
          result: data.result,
          resultReason: data.reason,
          whiteTime: data.whiteTime,
          blackTime: data.blackTime,
        };
      });
    });

    socket.on("draw:offered", () => {
      setDrawOffered(true);
    });

    socket.on("draw:declined", () => {
      setDrawOffered(false);
    });

    socket.on("games:list", (data: LiveGameEntry[]) => {
      setLiveGames(data);
    });

    socket.on("spectate:joined", (data: any) => {
      setGame({
        gameId: data.gameId,
        color: "white", // spectator sees from white's perspective
        white: data.white,
        black: data.black,
        fen: data.fen,
        whiteTime: data.whiteTime,
        blackTime: data.blackTime,
        moves: data.moves || [],
        status: data.status,
      });
    });

    socket.on("error", (data: any) => {
      console.error("[Chess MP] Error:", data.message);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setGame(null);
    setIsSeeking(false);
  }, []);

  const seekGame = useCallback((timeControl: string) => {
    socketRef.current?.emit("seek", { timeControl });
  }, []);

  const cancelSeek = useCallback(() => {
    socketRef.current?.emit("seek:cancel");
    setIsSeeking(false);
  }, []);

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    if (!game) return;
    socketRef.current?.emit("move", {
      gameId: game.gameId,
      from,
      to,
      promotion,
    });
  }, [game]);

  const resign = useCallback(() => {
    if (!game) return;
    socketRef.current?.emit("resign", { gameId: game.gameId });
  }, [game]);

  const offerDraw = useCallback(() => {
    if (!game) return;
    socketRef.current?.emit("draw:offer", { gameId: game.gameId });
  }, [game]);

  const acceptDraw = useCallback(() => {
    if (!game) return;
    socketRef.current?.emit("draw:accept", { gameId: game.gameId });
    setDrawOffered(false);
  }, [game]);

  const declineDraw = useCallback(() => {
    if (!game) return;
    socketRef.current?.emit("draw:decline", { gameId: game.gameId });
    setDrawOffered(false);
  }, [game]);

  const spectateGame = useCallback((gameId: string) => {
    socketRef.current?.emit("spectate", { gameId });
  }, []);

  const refreshGames = useCallback(() => {
    socketRef.current?.emit("games:list");
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    isConnected,
    isSeeking,
    game,
    liveGames,
    drawOffered,
    connect,
    disconnect,
    seekGame,
    cancelSeek,
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    spectateGame,
    refreshGames,
  };
}
