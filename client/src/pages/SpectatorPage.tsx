import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Eye, Swords, Crown, Users, Clock, ChevronRight, Loader2,
  Zap, Shield, Star, Radio, Gamepad2, RefreshCw, ArrowLeft,
  ChevronDown, ChevronUp
} from "lucide-react";
import { getLoginUrl } from "@/const";

/* ═══ TYPES ═══ */
interface PvpActiveMatch {
  matchId: string;
  player1Name: string;
  player2Name: string;
  player1Elo: number;
  player2Elo: number;
  turnNumber: number;
  spectatorCount: number;
}

/* ═══ CHESS PIECE UNICODE MAP ═══ */
const PIECE_MAP: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

function MiniChessBoard({ fen }: { fen: string }) {
  const rows = fen.split(" ")[0].split("/");
  return (
    <div className="grid grid-cols-8 w-full aspect-square rounded overflow-hidden border border-border/20">
      {rows.map((row, r) => {
        const cells: React.ReactElement[] = [];
        let col = 0;
        for (const ch of row) {
          if (/\d/.test(ch)) {
            for (let i = 0; i < parseInt(ch); i++) {
              const isLight = (r + col) % 2 === 0;
              cells.push(
                <div key={`${r}-${col}`} className={`aspect-square flex items-center justify-center text-[6px] sm:text-[8px] ${isLight ? "bg-slate-600/40" : "bg-slate-800/60"}`} />
              );
              col++;
            }
          } else {
            const isLight = (r + col) % 2 === 0;
            cells.push(
              <div key={`${r}-${col}`} className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs ${isLight ? "bg-slate-600/40" : "bg-slate-800/60"}`}>
                {PIECE_MAP[ch] || ""}
              </div>
            );
            col++;
          }
        }
        return cells;
      })}
    </div>
  );
}

/* ═══ PVP SPECTATOR (WebSocket) ═══ */
function PvpSpectatorView({ matchId, onBack }: { matchId: string; onBack: () => void }) {
  const [state, setState] = useState<any>(null);
  const [matchInfo, setMatchInfo] = useState<{ player1Name: string; player2Name: string; player1Elo: number; player2Elo: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/pvp`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "SPECTATE", matchId }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case "SPECTATE_JOINED":
          setMatchInfo({ player1Name: msg.player1Name, player2Name: msg.player2Name, player1Elo: msg.player1Elo, player2Elo: msg.player2Elo });
          break;
        case "SPECTATE_STATE":
          setState(msg.state);
          break;
        case "SPECTATE_ENDED":
          setError(`Match ended: ${msg.reason}`);
          break;
        case "ERROR":
          setError(msg.message);
          break;
      }
    };

    ws.onerror = () => setError("Connection error");
    ws.onclose = () => {};

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "STOP_SPECTATING" }));
      }
      ws.close();
    };
  }, [matchId]);

  if (error) {
    return (
      <div className="text-center py-12">
        <Zap size={32} className="text-destructive mx-auto mb-3 opacity-50" />
        <p className="font-mono text-sm text-destructive mb-4">{error}</p>
        <button onClick={onBack} className="font-mono text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
          <ArrowLeft size={12} /> BACK TO LOBBY
        </button>
      </div>
    );
  }

  if (!matchInfo || !state) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="font-mono text-xs text-muted-foreground ml-2">Connecting to match...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> LOBBY
        </button>
        <div className="flex items-center gap-2">
          <Radio size={12} className="text-red-400 animate-pulse" />
          <span className="font-mono text-[10px] text-red-400 tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Match info */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="font-display text-sm font-bold">{matchInfo.player1Name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{matchInfo.player1Elo} ELO</p>
          </div>
          <div className="px-4">
            <Swords size={20} className="text-primary" />
          </div>
          <div className="text-center flex-1">
            <p className="font-display text-sm font-bold">{matchInfo.player2Name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{matchInfo.player2Elo} ELO</p>
          </div>
        </div>

        {/* Battle state summary */}
        {state && (
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-md bg-primary/5 border border-primary/20 p-2">
              <p className="text-[9px] text-muted-foreground mb-1">PLAYER 1</p>
              <p className="text-primary">HP: {state.player1?.hp ?? "?"}/{state.player1?.maxHp ?? "?"}</p>
              <p className="text-muted-foreground">Energy: {state.player1?.energy ?? "?"}</p>
              <p className="text-muted-foreground">Field: {state.player1?.field?.length ?? 0} units</p>
            </div>
            <div className="rounded-md bg-destructive/5 border border-destructive/20 p-2">
              <p className="text-[9px] text-muted-foreground mb-1">PLAYER 2</p>
              <p className="text-destructive">HP: {state.player2?.hp ?? "?"}/{state.player2?.maxHp ?? "?"}</p>
              <p className="text-muted-foreground">Energy: {state.player2?.energy ?? "?"}</p>
              <p className="text-muted-foreground">Field: {state.player2?.field?.length ?? 0} units</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-muted-foreground">
          <Clock size={10} />
          <span>Turn {state?.turnNumber ?? "?"}</span>
          <span>•</span>
          <span>{state?.currentTurn === state?.player1?.id ? matchInfo.player1Name : matchInfo.player2Name}'s turn</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ CHESS SPECTATOR VIEW ═══ */
function ChessSpectatorView({ gameId, onBack }: { gameId: number; onBack: () => void }) {
  const { data, isLoading, refetch } = trpc.chess.spectateGame.useQuery(
    { gameId },
    { refetchInterval: 3000 } // Poll every 3 seconds for updates
  );
  const [showMoves, setShowMoves] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="font-mono text-xs text-muted-foreground ml-2">Loading game...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-sm text-muted-foreground mb-4">Game not found</p>
        <button onClick={onBack} className="font-mono text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
          <ArrowLeft size={12} /> BACK TO LOBBY
        </button>
      </div>
    );
  }

  const isLive = data.status === "active";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> LOBBY
        </button>
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <Radio size={12} className="text-red-400 animate-pulse" />
              <span className="font-mono text-[10px] text-red-400 tracking-wider">LIVE</span>
            </>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{data.status.toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Player info */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono ${data.turn === "white" && isLive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
              <div className="w-2.5 h-2.5 rounded-sm bg-white border border-border/30" />
              {data.whiteCharacter?.name || "White"}
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{data.whiteCharacter?.elo} ELO</p>
          </div>
          <div className="px-3 font-mono text-xs text-muted-foreground">VS</div>
          <div className="text-center flex-1">
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono ${data.turn === "black" && isLive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-border/30" />
              {data.blackCharacter?.name || (data.isVsAI ? `AI (Lvl ${data.aiDifficulty})` : "Black")}
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{data.blackCharacter?.elo} ELO</p>
          </div>
        </div>

        {/* Mini chess board */}
        <div className="max-w-[280px] mx-auto mb-3">
          <MiniChessBoard fen={data.fen} />
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-center gap-3 font-mono text-[10px]">
          <span className="text-muted-foreground">{data.moveCount} moves</span>
          {data.isCheck && <span className="text-amber-400 font-bold">CHECK!</span>}
          {data.isCheckmate && <span className="text-red-400 font-bold">CHECKMATE</span>}
          {data.isStalemate && <span className="text-muted-foreground font-bold">STALEMATE</span>}
          {data.isDraw && <span className="text-muted-foreground font-bold">DRAW</span>}
          <span className="text-muted-foreground">{data.mode.toUpperCase()}</span>
        </div>

        {/* Recent moves */}
        {data.recentMoves && data.recentMoves.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowMoves(!showMoves)}
              className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors w-full justify-center"
            >
              RECENT MOVES {showMoves ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
            <AnimatePresence>
              {showMoves && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {data.recentMoves.map((move: string, i: number) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          i === data.recentMoves.length - 1
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ MAIN SPECTATOR PAGE ═══ */
export default function SpectatorPage() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<"chess" | "pvp">("chess");
  const [watchingChess, setWatchingChess] = useState<number | null>(null);
  const [watchingPvp, setWatchingPvp] = useState<string | null>(null);
  const [pvpMatches, setPvpMatches] = useState<PvpActiveMatch[]>([]);
  const [pvpLoading, setPvpLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Chess data
  const { data: activeChessGames, isLoading: chessLoading, refetch: refetchChess } = trpc.chess.getActiveGames.useQuery(undefined, {
    enabled: isAuthenticated && tab === "chess" && watchingChess === null,
    refetchInterval: 10000,
  });
  const { data: featuredGames } = trpc.chess.getFeaturedGames.useQuery(undefined, {
    enabled: isAuthenticated && tab === "chess" && watchingChess === null,
  });

  // PvP WebSocket for match list
  const fetchPvpMatches = useCallback(() => {
    if (tab !== "pvp" || watchingPvp !== null) return;
    setPvpLoading(true);
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/pvp`);
    wsRef.current = ws;

    ws.onopen = () => {
      // Request active matches list by sending a spectate request for a non-existent match
      ws.send(JSON.stringify({ type: "SPECTATE", matchId: "__list__" }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "ACTIVE_MATCHES") {
        setPvpMatches(msg.matches);
        setPvpLoading(false);
        ws.close();
      } else if (msg.type === "ERROR") {
        // The error response is followed by ACTIVE_MATCHES
      }
    };

    ws.onerror = () => {
      setPvpLoading(false);
    };

    ws.onclose = () => {};
  }, [tab, watchingPvp]);

  useEffect(() => {
    if (tab === "pvp" && watchingPvp === null) {
      fetchPvpMatches();
      const interval = setInterval(fetchPvpMatches, 10000);
      return () => clearInterval(interval);
    }
  }, [tab, watchingPvp, fetchPvpMatches]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center">
          <Eye size={48} className="text-primary mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-xl font-bold mb-2">SPECTATOR ACCESS</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to watch live matches.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all">
            AUTHENTICATE <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  // Watching a specific match
  if (watchingChess !== null) {
    return (
      <div className="min-h-screen grid-bg px-4 sm:px-6 py-6">
        <ChessSpectatorView gameId={watchingChess} onBack={() => setWatchingChess(null)} />
      </div>
    );
  }

  if (watchingPvp !== null) {
    return (
      <div className="min-h-screen grid-bg px-4 sm:px-6 py-6">
        <PvpSpectatorView matchId={watchingPvp} onBack={() => setWatchingPvp(null)} />
      </div>
    );
  }

  const tabs = [
    { id: "chess" as const, label: "CHESS", icon: Crown },
    { id: "pvp" as const, label: "PVP ARENA", icon: Swords },
  ];

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/30">
            <Eye size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider">SPECTATOR LOBBY</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">WATCH LIVE MATCHES // LEARN FROM THE BEST</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 flex gap-1 border-b border-border/20">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-mono text-xs tracking-wider transition-all border-b-2 ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {tab === "chess" && (
            <motion.div key="chess" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Active Games */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-sm font-bold tracking-[0.2em] flex items-center gap-2">
                    <Radio size={13} className="text-red-400 animate-pulse" />
                    LIVE GAMES
                  </h2>
                  <button onClick={() => refetchChess()} className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <RefreshCw size={10} /> REFRESH
                  </button>
                </div>

                {chessLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                ) : activeChessGames && activeChessGames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeChessGames.map((game: any) => (
                      <button
                        key={game.id}
                        onClick={() => setWatchingChess(game.id)}
                        className="group rounded-lg border border-border/30 bg-card/30 p-3 text-left hover:border-primary/30 hover:bg-card/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {game.featured && <Star size={12} className="text-amber-400 fill-amber-400" />}
                            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{game.mode.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Radio size={8} className="text-red-400 animate-pulse" />
                            <span className="font-mono text-[8px] text-red-400">LIVE</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-sm bg-white border border-border/30" />
                          <span className="font-mono text-xs font-medium">{game.whiteCharacterName}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">vs</span>
                          <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-border/30" />
                          <span className="font-mono text-xs font-medium">{game.blackCharacterName}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                          <span>{game.moveCount} moves</span>
                          {game.isCheck && <span className="text-amber-400">CHECK</span>}
                          <span>{game.isVsAI ? "vs AI" : "PvP"}</span>
                          <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-lg border border-border/20 bg-card/20">
                    <Gamepad2 size={24} className="text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-mono text-xs text-muted-foreground/50">No active chess games right now</p>
                    <p className="font-mono text-[10px] text-muted-foreground/30 mt-1">Check back later or start a game yourself!</p>
                  </div>
                )}
              </div>

              {/* Featured/Recent Games */}
              {featuredGames && featuredGames.length > 0 && (
                <div>
                  <h2 className="font-display text-sm font-bold tracking-[0.2em] flex items-center gap-2 mb-3">
                    <Star size={13} className="text-amber-400" />
                    RECENT MATCHES
                  </h2>
                  <div className="space-y-2">
                    {featuredGames.map((game: any) => (
                      <button
                        key={game.id}
                        onClick={() => setWatchingChess(game.id)}
                        className="w-full group rounded-lg border border-border/20 bg-card/20 p-2.5 text-left hover:border-primary/20 transition-all flex items-center gap-3"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {game.featured && <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />}
                          <span className="font-mono text-xs">{game.whiteCharacterName}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">vs</span>
                          <span className="font-mono text-xs">{game.blackCharacterName}</span>
                        </div>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                          game.status === "checkmate" ? "bg-red-400/10 text-red-400"
                          : game.status === "active" ? "bg-green-400/10 text-green-400"
                          : "bg-white/5 text-muted-foreground"
                        }`}>
                          {game.status.toUpperCase()}
                        </span>
                        <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "pvp" && (
            <motion.div key="pvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-sm font-bold tracking-[0.2em] flex items-center gap-2">
                    <Radio size={13} className="text-red-400 animate-pulse" />
                    LIVE PVP MATCHES
                  </h2>
                  <button onClick={fetchPvpMatches} className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <RefreshCw size={10} /> REFRESH
                  </button>
                </div>

                {pvpLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                ) : pvpMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pvpMatches.map((match) => (
                      <button
                        key={match.matchId}
                        onClick={() => setWatchingPvp(match.matchId)}
                        className="group rounded-lg border border-border/30 bg-card/30 p-3 text-left hover:border-primary/30 hover:bg-card/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Radio size={8} className="text-red-400 animate-pulse" />
                            <span className="font-mono text-[8px] text-red-400">LIVE</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={10} className="text-muted-foreground" />
                            <span className="font-mono text-[9px] text-muted-foreground">{match.spectatorCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-medium">{match.player1Name}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">({match.player1Elo})</span>
                          <Swords size={12} className="text-primary mx-1" />
                          <span className="font-mono text-xs font-medium">{match.player2Name}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">({match.player2Elo})</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                          <span>Turn {match.turnNumber}</span>
                          <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-lg border border-border/20 bg-card/20">
                    <Swords size={24} className="text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-mono text-xs text-muted-foreground/50">No active PvP matches right now</p>
                    <p className="font-mono text-[10px] text-muted-foreground/30 mt-1">Queue up in the PvP Arena to start a match!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
