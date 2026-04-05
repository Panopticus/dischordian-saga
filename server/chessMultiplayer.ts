/* ═══════════════════════════════════════════════════════
   CHESS MULTIPLAYER — WebSocket Real-Time PvP
   Socket.IO server for live chess matches between players.
   Handles matchmaking, move relay, timers, and spectating.
   ═══════════════════════════════════════════════════════ */
import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { Chess } from "chess.js";

interface Player {
  socketId: string;
  userId: number;
  username: string;
  elo: number;
}

interface LiveGame {
  id: string;
  white: Player;
  black: Player | null;
  chess: any; // Chess instance
  timeControl: { initial: number; increment: number }; // seconds
  whiteTime: number; // ms remaining
  blackTime: number; // ms remaining
  lastMoveTime: number;
  status: "waiting" | "active" | "completed";
  result?: "white" | "black" | "draw";
  resultReason?: string;
  moves: Array<{ from: string; to: string; san: string; time: number }>;
  spectators: Set<string>;
  createdAt: number;
}

interface MatchmakingEntry {
  player: Player;
  socketId: string;
  timeControl: { initial: number; increment: number };
  eloRange: [number, number];
  timestamp: number;
}

const TIME_CONTROLS = {
  bullet_1: { initial: 60, increment: 0, label: "1+0 Bullet" },
  bullet_2: { initial: 120, increment: 1, label: "2+1 Bullet" },
  blitz_3: { initial: 180, increment: 0, label: "3+0 Blitz" },
  blitz_5: { initial: 300, increment: 0, label: "5+0 Blitz" },
  rapid_10: { initial: 600, increment: 0, label: "10+0 Rapid" },
  rapid_15: { initial: 900, increment: 10, label: "15+10 Rapid" },
  classical_30: { initial: 1800, increment: 0, label: "30+0 Classical" },
};

export { TIME_CONTROLS };

// In-memory state
const liveGames = new Map<string, LiveGame>();
const matchmakingQueue: MatchmakingEntry[] = [];
const playerGameMap = new Map<string, string>(); // socketId -> gameId
const timerIntervals = new Map<string, NodeJS.Timeout>();

function generateGameId(): string {
  return "lg_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function registerChessMultiplayer(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    path: "/api/chess-ws",
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  console.log("[Chess PvP] WebSocket server initialized on /api/chess-ws");

  io.on("connection", (socket) => {
    let currentPlayer: Player | null = null;

    /* ─── AUTHENTICATE ─── */
    socket.on("auth", (data: { userId: number; username: string; elo: number }) => {
      currentPlayer = {
        socketId: socket.id,
        userId: data.userId,
        username: data.username,
        elo: data.elo || 1200,
      };
      socket.emit("auth:ok", { playerId: socket.id });
    });

    /* ─── SEEK GAME (Matchmaking) ─── */
    socket.on("seek", (data: { timeControl: keyof typeof TIME_CONTROLS }) => {
      if (!currentPlayer) return socket.emit("error", { message: "Not authenticated" });

      const tc = TIME_CONTROLS[data.timeControl];
      if (!tc) return socket.emit("error", { message: "Invalid time control" });

      // Remove existing seeks
      const existingIdx = matchmakingQueue.findIndex((e) => e.socketId === socket.id);
      if (existingIdx >= 0) matchmakingQueue.splice(existingIdx, 1);

      // Try to find a match
      const eloRange: [number, number] = [currentPlayer.elo - 200, currentPlayer.elo + 200];
      const match = matchmakingQueue.findIndex(
        (e) =>
          e.timeControl.initial === tc.initial &&
          e.timeControl.increment === tc.increment &&
          e.player.userId !== currentPlayer!.userId &&
          e.player.elo >= eloRange[0] &&
          e.player.elo <= eloRange[1]
      );

      if (match >= 0) {
        // Found a match — create game
        const opponent = matchmakingQueue.splice(match, 1)[0];
        const gameId = generateGameId();

        // Randomly assign colors
        const isWhite = Math.random() > 0.5;
        const white = isWhite ? currentPlayer : opponent.player;
        const black = isWhite ? opponent.player : currentPlayer;

        const game: LiveGame = {
          id: gameId,
          white: { ...white, socketId: isWhite ? socket.id : opponent.socketId },
          black: { ...black, socketId: isWhite ? opponent.socketId : socket.id },
          chess: new Chess(),
          timeControl: tc,
          whiteTime: tc.initial * 1000,
          blackTime: tc.initial * 1000,
          lastMoveTime: Date.now(),
          status: "active",
          moves: [],
          spectators: new Set(),
          createdAt: Date.now(),
        };

        liveGames.set(gameId, game);
        playerGameMap.set(socket.id, gameId);
        playerGameMap.set(opponent.socketId, gameId);

        // Join room
        socket.join(gameId);
        io.sockets.sockets.get(opponent.socketId)?.join(gameId);

        // Notify both players
        const gameInfo = {
          gameId,
          white: { userId: white.userId, username: white.username, elo: white.elo },
          black: { userId: black.userId, username: black.username, elo: black.elo },
          timeControl: tc,
          fen: game.chess.fen(),
        };

        socket.emit("game:start", { ...gameInfo, color: isWhite ? "white" : "black" });
        io.to(opponent.socketId).emit("game:start", {
          ...gameInfo,
          color: isWhite ? "black" : "white",
        });

        // Start clock
        startClock(io, gameId);
      } else {
        // Add to queue
        matchmakingQueue.push({
          player: currentPlayer,
          socketId: socket.id,
          timeControl: tc,
          eloRange,
          timestamp: Date.now(),
        });
        socket.emit("seek:waiting", { timeControl: data.timeControl });
      }
    });

    /* ─── CANCEL SEEK ─── */
    socket.on("seek:cancel", () => {
      const idx = matchmakingQueue.findIndex((e) => e.socketId === socket.id);
      if (idx >= 0) matchmakingQueue.splice(idx, 1);
      socket.emit("seek:cancelled");
    });

    /* ─── MAKE MOVE ─── */
    socket.on("move", (data: { gameId: string; from: string; to: string; promotion?: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game || game.status !== "active") return;

      // Verify it's this player's turn
      const isWhite = game.white.socketId === socket.id;
      const isBlack = game.black?.socketId === socket.id;
      if (!isWhite && !isBlack) return;

      const turn = game.chess.turn();
      if ((turn === "w" && !isWhite) || (turn === "b" && !isBlack)) {
        return socket.emit("move:illegal", { reason: "Not your turn" });
      }

      // Try the move
      try {
        const move = game.chess.move({
          from: data.from,
          to: data.to,
          promotion: data.promotion,
        });

        if (!move) {
          return socket.emit("move:illegal", { reason: "Illegal move" });
        }

        // Update clock
        const now = Date.now();
        const elapsed = now - game.lastMoveTime;
        if (turn === "w") {
          game.whiteTime -= elapsed;
          game.whiteTime += game.timeControl.increment * 1000;
        } else {
          game.blackTime -= elapsed;
          game.blackTime += game.timeControl.increment * 1000;
        }
        game.lastMoveTime = now;

        // Record move
        game.moves.push({
          from: data.from,
          to: data.to,
          san: move.san,
          time: elapsed,
        });

        // Check game end
        let result: LiveGame["result"] = undefined;
        let resultReason: string | undefined;

        if (game.chess.isCheckmate()) {
          result = turn === "w" ? "white" : "black";
          resultReason = "checkmate";
        } else if (game.chess.isStalemate()) {
          result = "draw";
          resultReason = "stalemate";
        } else if (game.chess.isDraw()) {
          result = "draw";
          resultReason = "draw";
        } else if (game.chess.isThreefoldRepetition()) {
          result = "draw";
          resultReason = "repetition";
        } else if (game.chess.isInsufficientMaterial()) {
          result = "draw";
          resultReason = "insufficient_material";
        }

        if (result) {
          game.status = "completed";
          game.result = result;
          game.resultReason = resultReason;
          stopClock(data.gameId);
        }

        // Broadcast to all in room
        io.to(data.gameId).emit("game:move", {
          from: data.from,
          to: data.to,
          san: move.san,
          fen: game.chess.fen(),
          whiteTime: game.whiteTime,
          blackTime: game.blackTime,
          isCheck: game.chess.isCheck(),
          result,
          resultReason,
          moveNumber: game.moves.length,
        });

        if (result) {
          io.to(data.gameId).emit("game:end", {
            result,
            reason: resultReason,
            pgn: game.chess.pgn(),
            whiteTime: game.whiteTime,
            blackTime: game.blackTime,
          });
          cleanupGame(data.gameId);
        }
      } catch (e) {
        socket.emit("move:illegal", { reason: "Invalid move" });
      }
    });

    /* ─── RESIGN ─── */
    socket.on("resign", (data: { gameId: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game || game.status !== "active") return;

      const isWhite = game.white.socketId === socket.id;
      const isBlack = game.black?.socketId === socket.id;
      if (!isWhite && !isBlack) return;

      game.status = "completed";
      game.result = isWhite ? "black" : "white";
      game.resultReason = "resignation";
      stopClock(data.gameId);

      io.to(data.gameId).emit("game:end", {
        result: game.result,
        reason: "resignation",
        pgn: game.chess.pgn(),
        whiteTime: game.whiteTime,
        blackTime: game.blackTime,
      });
      cleanupGame(data.gameId);
    });

    /* ─── OFFER DRAW ─── */
    socket.on("draw:offer", (data: { gameId: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game || game.status !== "active") return;

      const isWhite = game.white.socketId === socket.id;
      const opponentId = isWhite ? game.black?.socketId : game.white.socketId;
      if (opponentId) {
        io.to(opponentId).emit("draw:offered");
      }
    });

    socket.on("draw:accept", (data: { gameId: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game || game.status !== "active") return;

      game.status = "completed";
      game.result = "draw";
      game.resultReason = "agreement";
      stopClock(data.gameId);

      io.to(data.gameId).emit("game:end", {
        result: "draw",
        reason: "agreement",
        pgn: game.chess.pgn(),
        whiteTime: game.whiteTime,
        blackTime: game.blackTime,
      });
      cleanupGame(data.gameId);
    });

    socket.on("draw:decline", (data: { gameId: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game) return;
      const isWhite = game.white.socketId === socket.id;
      const opponentId = isWhite ? game.black?.socketId : game.white.socketId;
      if (opponentId) {
        io.to(opponentId).emit("draw:declined");
      }
    });

    /* ─── SPECTATE ─── */
    socket.on("spectate", (data: { gameId: string }) => {
      const game = liveGames.get(data.gameId);
      if (!game) return socket.emit("error", { message: "Game not found" });

      game.spectators.add(socket.id);
      socket.join(data.gameId);

      socket.emit("spectate:joined", {
        gameId: data.gameId,
        fen: game.chess.fen(),
        white: { username: game.white.username, elo: game.white.elo },
        black: game.black ? { username: game.black.username, elo: game.black.elo } : null,
        whiteTime: game.whiteTime,
        blackTime: game.blackTime,
        moves: game.moves.map((m) => m.san),
        status: game.status,
      });
    });

    /* ─── GET LIVE GAMES LIST ─── */
    socket.on("games:list", () => {
      const games = Array.from(liveGames.values())
        .filter((g) => g.status === "active")
        .map((g) => ({
          id: g.id,
          white: { username: g.white.username, elo: g.white.elo },
          black: g.black ? { username: g.black.username, elo: g.black.elo } : null,
          moveCount: g.moves.length,
          spectatorCount: g.spectators.size,
          timeControl: g.timeControl,
        }));
      socket.emit("games:list", games);
    });

    /* ─── DISCONNECT ─── */
    socket.on("disconnect", () => {
      // Remove from matchmaking
      const queueIdx = matchmakingQueue.findIndex((e) => e.socketId === socket.id);
      if (queueIdx >= 0) matchmakingQueue.splice(queueIdx, 1);

      // Handle active game abandonment
      const gameId = playerGameMap.get(socket.id);
      if (gameId) {
        const game = liveGames.get(gameId);
        if (game && game.status === "active") {
          // Give 30 seconds to reconnect before forfeit
          setTimeout(() => {
            const g = liveGames.get(gameId);
            if (g && g.status === "active") {
              const isWhite = g.white.socketId === socket.id;
              g.status = "completed";
              g.result = isWhite ? "black" : "white";
              g.resultReason = "abandonment";
              stopClock(gameId);

              io.to(gameId).emit("game:end", {
                result: g.result,
                reason: "abandonment",
                pgn: g.chess.pgn(),
                whiteTime: g.whiteTime,
                blackTime: g.blackTime,
              });
              cleanupGame(gameId);
            }
          }, 30000);
        }

        // Remove from spectators
        if (game) game.spectators.delete(socket.id);
        playerGameMap.delete(socket.id);
      }
    });
  });

  return io;
}

/* ─── CLOCK MANAGEMENT ─── */
function startClock(io: SocketServer, gameId: string) {
  const interval = setInterval(() => {
    const game = liveGames.get(gameId);
    if (!game || game.status !== "active") {
      clearInterval(interval);
      return;
    }

    const elapsed = Date.now() - game.lastMoveTime;
    const turn = game.chess.turn();

    if (turn === "w") {
      const remaining = game.whiteTime - elapsed;
      if (remaining <= 0) {
        game.status = "completed";
        game.result = "black";
        game.resultReason = "timeout";
        game.whiteTime = 0;
        clearInterval(interval);

        io.to(gameId).emit("game:end", {
          result: "black",
          reason: "timeout",
          pgn: game.chess.pgn(),
          whiteTime: 0,
          blackTime: game.blackTime,
        });
        cleanupGame(gameId);
      }
    } else {
      const remaining = game.blackTime - elapsed;
      if (remaining <= 0) {
        game.status = "completed";
        game.result = "white";
        game.resultReason = "timeout";
        game.blackTime = 0;
        clearInterval(interval);

        io.to(gameId).emit("game:end", {
          result: "white",
          reason: "timeout",
          pgn: game.chess.pgn(),
          whiteTime: game.whiteTime,
          blackTime: 0,
        });
        cleanupGame(gameId);
      }
    }

    // Broadcast time update every second
    io.to(gameId).emit("game:clock", {
      whiteTime: turn === "w" ? game.whiteTime - elapsed : game.whiteTime,
      blackTime: turn === "b" ? game.blackTime - elapsed : game.blackTime,
    });
  }, 1000);

  timerIntervals.set(gameId, interval);
}

function stopClock(gameId: string) {
  const interval = timerIntervals.get(gameId);
  if (interval) {
    clearInterval(interval);
    timerIntervals.delete(gameId);
  }
}

function cleanupGame(gameId: string) {
  // Keep game data for 5 minutes for spectators, then remove
  setTimeout(() => {
    liveGames.delete(gameId);
  }, 300000);
}
