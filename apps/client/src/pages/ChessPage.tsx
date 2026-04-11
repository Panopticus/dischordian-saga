/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S GAMBIT — Full Lichess-Quality Chess
   Client-side Stockfish WASM AI with distinct personalities.
   WebSocket multiplayer PvP. Ranked ladder & story mode.
   AI Tiers: Neyons (beginner) → Archons (advanced) → The Architect (GM)
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  Crown, Swords, Shield, Zap, Brain, Target, Trophy, Star,
  ChevronRight, ArrowLeft, Loader2, Clock, TrendingUp,
  BookOpen, Gamepad2, Users, Skull, Eye, Award, Lock,
  RotateCcw, Flag, Wifi, WifiOff, Timer, Play, Square,
  HandshakeIcon, X, Volume2, VolumeX, Settings, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { showBonusToast } from "@/components/BonusToast";
import { customPieces } from "@/components/ChessPieces";
import { getArenaForOpponent, ARENA_THEMES, type ArenaTheme } from "@/lib/chessAssets";
import { useStockfish } from "@/hooks/useStockfish";
import { AI_PRESETS } from "@/lib/stockfishWorker";
import ChessCinematic from "@/components/ChessCinematic";
import LivingBackground from "@/components/LivingBackground";

/* ─── TIER CONFIG ─── */
const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; icon: string; glow?: string }> = {
  bronze:      { color: "text-amber-700",  bg: "bg-amber-700/10",  border: "border-amber-700/30",  label: "Bronze",      icon: "🥉" },
  silver:      { color: "text-gray-400",   bg: "bg-gray-400/10",   border: "border-gray-400/30",   label: "Silver",      icon: "🥈" },
  gold:        { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", label: "Gold",        icon: "🥇", glow: "shadow-[0_0_12px_rgba(250,204,21,0.3)]" },
  platinum:    { color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/30",   label: "Platinum",    icon: "💎", glow: "shadow-[0_0_12px_rgba(34,211,238,0.3)]" },
  diamond:     { color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30", label: "Diamond",     icon: "💠", glow: "shadow-[0_0_16px_rgba(167,139,250,0.4)]" },
  master:      { color: "text-rose-400",   bg: "bg-rose-400/10",   border: "border-rose-400/30",   label: "Master",      icon: "🏆", glow: "shadow-[0_0_16px_rgba(251,113,133,0.4)]" },
  grandmaster: { color: "text-amber-300",  bg: "bg-amber-300/10",  border: "border-amber-300/30",  label: "Grandmaster", icon: "👑", glow: "shadow-[0_0_20px_rgba(252,211,77,0.5)]" },
};

const STYLE_ICONS: Record<string, typeof Crown> = {
  aggressive: Swords,
  defensive: Shield,
  tactical: Zap,
  positional: Brain,
  endgame: Target,
  universal: Crown,
};

/* ─── AI TIER MAPPING — Maps character difficulty to Stockfish presets ─── */
const CHARACTER_AI_TIER: Record<string, string> = {
  the_human:       "neyon_spark",
  the_collector:   "neyon_echo",
  iron_lion:       "neyon_flux",
  the_enigma:      "archon_sentinel",
  the_warlord:     "archon_sentinel",
  the_oracle:      "archon_warden",
  the_necromancer: "archon_warden",
  the_programmer:  "archon_sovereign",
  agent_zero:      "archon_sovereign",
  the_source:      "the_architect",
  game_master:     "the_architect",
  the_architect:   "the_architect",
};

/* ─── AI TIER LABELS ─── */
const AI_TIER_INFO: Record<string, { label: string; color: string; description: string }> = {
  neyon_spark:      { label: "NEYON I",    color: "text-emerald-400", description: "Beginner — Learning the basics" },
  neyon_echo:       { label: "NEYON II",   color: "text-emerald-400", description: "Intermediate — Developing strategy" },
  neyon_flux:       { label: "NEYON III",  color: "text-emerald-400", description: "Advanced beginner — Tactical awareness" },
  archon_sentinel:  { label: "ARCHON I",   color: "text-blue-400",    description: "Strong club player — Positional understanding" },
  archon_warden:    { label: "ARCHON II",  color: "text-blue-400",    description: "Expert — Deep calculation" },
  archon_sovereign: { label: "ARCHON III", color: "text-violet-400",  description: "Master level — Near-perfect play" },
  the_architect:    { label: "ARCHITECT",  color: "text-amber-400",   description: "Grandmaster — The ultimate challenge" },
};

type GameView = "menu" | "character_select" | "cinematic" | "playing" | "multiplayer_lobby" | "multiplayer_playing" | "ladder" | "history" | "story_select";

export default function ChessPage() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<GameView>("menu");
  const [selectedMode, setSelectedMode] = useState<"casual" | "ranked" | "story" | "game_master" | "multiplayer">("casual");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [gameFen, setGameFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [gameStatus, setGameStatus] = useState<string>("active");
  const [lastAiMove, setLastAiMove] = useState<{from: string; to: string} | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [rewards, setRewards] = useState<any>(null);
  const [eloChange, setEloChange] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  const [opponentInfo, setOpponentInfo] = useState<any>(null);
  const [useClientAi, setUseClientAi] = useState(true);
  const [showEvalBar, setShowEvalBar] = useState(true);

  // ── Multiplayer PvP state (lifted out of lobby IIFE) ──
  const [mpState, setMpState] = useState<"idle" | "searching" | "matched" | "playing">("idle");
  const [mpQueuePos, setMpQueuePos] = useState<number>(0);
  const [mpPlayersInQueue, setMpPlayersInQueue] = useState<number>(0);
  const [mpOpponent, setMpOpponent] = useState<{
    matchId: string; color: "white" | "black"; opponentName: string; opponentElo: number; opponentCharacter: string; timeControl: number;
  } | null>(null);
  const [mpSearchElapsed, setMpSearchElapsed] = useState(0);
  const [mpFen, setMpFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [mpTurn, setMpTurn] = useState<"w" | "b">("w");
  const [mpWhiteTime, setMpWhiteTime] = useState(600000);
  const [mpBlackTime, setMpBlackTime] = useState(600000);
  const [mpMoveHistory, setMpMoveHistory] = useState<string[]>([]);
  const [mpLastMove, setMpLastMove] = useState<{ from: string; to: string } | null>(null);
  const [mpGameOver, setMpGameOver] = useState<{ winner: "white" | "black" | "draw"; reason: string; eloChange: number; newElo: number } | null>(null);
  const [mpDrawOffered, setMpDrawOffered] = useState(false);
  const mpWsRef = useRef<WebSocket | null>(null);
  const mpSearchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mpChessRef = useRef(new Chess());

  // Clean up multiplayer WS on unmount
  useEffect(() => {
    return () => {
      if (mpWsRef.current && mpWsRef.current.readyState === WebSocket.OPEN) {
        mpWsRef.current.send(JSON.stringify({ type: "LEAVE_QUEUE" }));
        mpWsRef.current.close();
      }
      if (mpSearchTimerRef.current) clearInterval(mpSearchTimerRef.current);
    };
  }, []);

  const mpFormatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, "0")}`;
  };

  const mpFormatSearchTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleFindMatch = useCallback(() => {
    if (!user || !isAuthenticated) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/chess-pvp`);
    mpWsRef.current = ws;
    setMpState("searching");
    setMpSearchElapsed(0);
    setMpGameOver(null);

    mpSearchTimerRef.current = setInterval(() => {
      setMpSearchElapsed(prev => prev + 1);
    }, 1000);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "JOIN_QUEUE",
        userId: user.id,
        userName: user.name || `Player ${user.id}`,
        characterId: selectedCharacter || "default",
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case "QUEUE_JOINED":
            setMpQueuePos(msg.position);
            break;
          case "QUEUE_UPDATE":
            setMpQueuePos(msg.position);
            setMpPlayersInQueue(msg.playersInQueue);
            break;
          case "MATCH_FOUND":
            setMpState("matched");
            setMpOpponent(msg);
            if (mpSearchTimerRef.current) { clearInterval(mpSearchTimerRef.current); mpSearchTimerRef.current = null; }
            // Auto-transition to playing after showing match info
            setTimeout(() => {
              setMpState("playing");
              setView("multiplayer_playing");
            }, 2000);
            break;
          case "GAME_STATE":
            setMpFen(msg.fen);
            setMpTurn(msg.turn);
            setMpWhiteTime(msg.whiteTimeMs);
            setMpBlackTime(msg.blackTimeMs);
            mpChessRef.current.load(msg.fen);
            if (msg.lastMove) {
              setMpLastMove({ from: msg.lastMove.from, to: msg.lastMove.to });
              setMpMoveHistory(prev => [...prev, msg.lastMove.san]);
            }
            break;
          case "GAME_OVER":
            setMpGameOver(msg);
            break;
          case "DRAW_OFFERED":
            setMpDrawOffered(true);
            break;
          case "DRAW_DECLINED":
            setMpDrawOffered(false);
            break;
          case "MOVE_ERROR":
            import("sonner").then(({ toast }) => toast.error(msg.message));
            break;
          case "OPPONENT_DISCONNECTED":
            import("sonner").then(({ toast }) => toast.warning("Opponent disconnected. Waiting for reconnection..."));
            break;
          case "ERROR":
            import("sonner").then(({ toast }) => toast.error(msg.message));
            break;
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onerror = () => {
      import("sonner").then(({ toast }) => toast.error("Connection error. Please try again."));
      handleCancelSearch();
    };

    ws.onclose = () => {
      if (mpSearchTimerRef.current) { clearInterval(mpSearchTimerRef.current); mpSearchTimerRef.current = null; }
    };
  }, [user, isAuthenticated, selectedCharacter]);

  const handleCancelSearch = useCallback(() => {
    if (mpWsRef.current && mpWsRef.current.readyState === WebSocket.OPEN) {
      mpWsRef.current.send(JSON.stringify({ type: "LEAVE_QUEUE" }));
      mpWsRef.current.close();
    }
    mpWsRef.current = null;
    if (mpSearchTimerRef.current) { clearInterval(mpSearchTimerRef.current); mpSearchTimerRef.current = null; }
    setMpState("idle");
    setMpOpponent(null);
    setMpSearchElapsed(0);
  }, []);

  const handleMpMove = useCallback((from: string, to: string) => {
    if (!mpWsRef.current || mpWsRef.current.readyState !== WebSocket.OPEN) return false;
    if (!mpOpponent) return false;

    // Check if it's our turn
    const isWhite = mpOpponent.color === "white";
    if ((mpTurn === "w" && !isWhite) || (mpTurn === "b" && isWhite)) return false;

    // Validate locally first
    const tempChess = new Chess(mpFen);
    const piece = tempChess.get(from as any);
    const needsPromotion = piece?.type === "p" && ((piece.color === "w" && to[1] === "8") || (piece.color === "b" && to[1] === "1"));
    const promotion = needsPromotion ? "q" : undefined;

    const moveResult = tempChess.move({ from, to, promotion });
    if (!moveResult) return false;

    mpWsRef.current.send(JSON.stringify({ type: "MOVE", from, to, promotion }));
    return true;
  }, [mpOpponent, mpTurn, mpFen]);

  const handleMpResign = useCallback(() => {
    if (!mpWsRef.current || mpWsRef.current.readyState !== WebSocket.OPEN) return;
    mpWsRef.current.send(JSON.stringify({ type: "RESIGN" }));
  }, []);

  const handleMpOfferDraw = useCallback(() => {
    if (!mpWsRef.current || mpWsRef.current.readyState !== WebSocket.OPEN) return;
    mpWsRef.current.send(JSON.stringify({ type: "OFFER_DRAW" }));
  }, []);

  const handleMpAcceptDraw = useCallback(() => {
    if (!mpWsRef.current || mpWsRef.current.readyState !== WebSocket.OPEN) return;
    mpWsRef.current.send(JSON.stringify({ type: "ACCEPT_DRAW" }));
    setMpDrawOffered(false);
  }, []);

  const handleMpDeclineDraw = useCallback(() => {
    if (!mpWsRef.current || mpWsRef.current.readyState !== WebSocket.OPEN) return;
    mpWsRef.current.send(JSON.stringify({ type: "DECLINE_DRAW" }));
    setMpDrawOffered(false);
  }, []);

  const handleMpBackToMenu = useCallback(() => {
    if (mpWsRef.current && mpWsRef.current.readyState === WebSocket.OPEN) {
      mpWsRef.current.close();
    }
    mpWsRef.current = null;
    setMpState("idle");
    setMpOpponent(null);
    setMpFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setMpMoveHistory([]);
    setMpLastMove(null);
    setMpGameOver(null);
    setMpDrawOffered(false);
    mpChessRef.current.reset();
    setView("menu");
  }, []);

  // Chess.js instance for client-side validation
  const chessRef = useRef(new Chess());

  // Stockfish engine hook
  const stockfish = useStockfish();

  const characters = trpc.chess.getCharacters.useQuery(undefined, { enabled: isAuthenticated });
  const ranking = trpc.chess.getMyRanking.useQuery(undefined, { enabled: isAuthenticated });
  const leaderboard = trpc.chess.getLeaderboard.useQuery(undefined, { enabled: view === "ladder" });
  const history = trpc.chess.getHistory.useQuery({ limit: 20 }, { enabled: view === "history" });
  const activeGame = trpc.chess.getActiveGame.useQuery(undefined, { enabled: isAuthenticated });

  const startGame = trpc.chess.startGame.useMutation();
  const makeMove = trpc.chess.makeMove.useMutation();
  const resignGame = trpc.chess.resign.useMutation();
  const utils = trpc.useUtils();

  // Resume active game
  useEffect(() => {
    if (activeGame.data && view === "menu") {
      setActiveGameId(activeGame.data.id);
      setGameFen(activeGame.data.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      setOpponentInfo(activeGame.data.opponent);
      chessRef.current.load(activeGame.data.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      setView("playing");
    }
  }, [activeGame.data]);

  // Configure Stockfish when opponent changes
  useEffect(() => {
    if (opponentInfo?.id && stockfish.isReady) {
      const preset = CHARACTER_AI_TIER[opponentInfo.id] || "medium";
      stockfish.configure(preset);
      stockfish.newGame();
    }
  }, [opponentInfo?.id, stockfish.isReady]);

  const [startError, setStartError] = useState<string | null>(null);

  const handleStartGame = async () => {
    if (!selectedCharacter) return;
    setStartError(null);
    try {
      const result = await startGame.mutateAsync({
        mode: selectedMode === "multiplayer" ? "casual" : selectedMode,
        characterId: selectedCharacter,
        opponentCharacterId: selectedOpponent || undefined,
      });
      setActiveGameId(Number(result.gameId));
      setGameFen(result.fen);
      setOpponentInfo(result.opponent);
      setGameStatus("active");
      setMoveHistory([]);
      setRewards(null);
      setEloChange(0);
      chessRef.current.reset();

      // Configure Stockfish for this opponent
      if (result.opponent?.id) {
        const preset = CHARACTER_AI_TIER[result.opponent.id] || "medium";
        stockfish.configure(preset);
        stockfish.newGame();
      }

      const seenKey = "loredex_chess_cinematic_seen";
      const seen = sessionStorage.getItem(seenKey);
      if (!seen) {
        setView("cinematic");
      } else {
        setView("playing");
      }
    } catch (e: any) {
      console.error("Chess startGame error:", e);
      setStartError(e?.message || "Failed to start game. Please try again.");
    }
  };

  /* ─── CLIENT-SIDE AI MOVE ─── */
  const requestAiMove = useCallback(async (fen: string) => {
    if (!stockfish.isReady) return null;
    const bestMove = await stockfish.getBestMove(fen);
    return bestMove;
  }, [stockfish.isReady]);

  const handleDrop = useCallback(async (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!activeGameId || gameStatus !== "active" || isThinking) return false;

    const isPromotion = piece[1] === "P" && (targetSquare[1] === "8" || targetSquare[1] === "1");

    // Validate move locally first
    const chess = chessRef.current;
    const moveResult = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: isPromotion ? "q" : undefined,
    });
    if (!moveResult) return false;

    const newFen = chess.fen();
    setGameFen(newFen);
    setMoveHistory(prev => [...prev, moveResult.san]);

    // Check if game ended after player move
    if (chess.isCheckmate() || chess.isStalemate() || chess.isDraw()) {
      // Report to server
      setIsThinking(true);
      try {
        const result = await makeMove.mutateAsync({
          gameId: activeGameId,
          from: sourceSquare,
          to: targetSquare,
          promotion: isPromotion ? "q" : undefined,
        });
        setGameStatus(result.status);
        if (result.rewards) {
          setRewards(result.rewards);
          const r = result.rewards as any;
          if (r.traitMultiplier && r.traitMultiplier > 1) {
            showBonusToast({
              system: "Chess",
              baseAmount: Math.round(r.dream / r.traitMultiplier),
              finalAmount: r.dream,
              multiplier: r.traitMultiplier,
              currency: "Dream",
              sources: r.traitSources || ["Character Bonus"],
            });
          }
        }
        if (result.eloChange) setEloChange(result.eloChange);
        utils.chess.getMyRanking.invalidate();
        utils.chess.getHistory.invalidate();
        utils.chess.getActiveGame.invalidate();
      } catch (e) {
        console.error("Error reporting game end:", e);
      }
      setIsThinking(false);
      return true;
    }

    // Get AI response using client-side Stockfish
    if (useClientAi && stockfish.isReady) {
      setIsThinking(true);
      try {
        const aiMoveStr = await requestAiMove(newFen);
        if (aiMoveStr && aiMoveStr.length >= 4) {
          const from = aiMoveStr.substring(0, 2);
          const to = aiMoveStr.substring(2, 4);
          const promotion = aiMoveStr.length > 4 ? aiMoveStr[4] : undefined;

          const aiResult = chess.move({ from, to, promotion });
          if (aiResult) {
            setGameFen(chess.fen());
            setMoveHistory(prev => [...prev, aiResult.san]);
            setLastAiMove({ from, to });

            // Check if AI won
            if (chess.isCheckmate() || chess.isStalemate() || chess.isDraw()) {
              // Report to server with both moves
              const result = await makeMove.mutateAsync({
                gameId: activeGameId,
                from: sourceSquare,
                to: targetSquare,
                promotion: isPromotion ? "q" : undefined,
              });
              setGameStatus(result.status);
              if (result.rewards) setRewards(result.rewards);
              if (result.eloChange) setEloChange(result.eloChange);
              utils.chess.getMyRanking.invalidate();
              utils.chess.getHistory.invalidate();
              utils.chess.getActiveGame.invalidate();
            } else {
              // Sync move to server in background (don't block UI)
              makeMove.mutateAsync({
                gameId: activeGameId,
                from: sourceSquare,
                to: targetSquare,
                promotion: isPromotion ? "q" : undefined,
              }).catch(e => console.warn("Background sync error:", e));
            }
          }
        }
      } catch (e) {
        console.error("Stockfish error, falling back to server AI:", e);
        // Fallback to server-side AI
        const result = await makeMove.mutateAsync({
          gameId: activeGameId,
          from: sourceSquare,
          to: targetSquare,
          promotion: isPromotion ? "q" : undefined,
        });
        setGameFen(result.fen);
        chess.load(result.fen);
        if (result.aiMove) {
          setMoveHistory(prev => [...prev, result.aiMove!.san]);
          setLastAiMove({ from: result.aiMove!.from, to: result.aiMove!.to });
        }
        if (result.status !== "active") {
          setGameStatus(result.status);
          if (result.rewards) setRewards(result.rewards);
          if (result.eloChange) setEloChange(result.eloChange);
          utils.chess.getMyRanking.invalidate();
          utils.chess.getHistory.invalidate();
          utils.chess.getActiveGame.invalidate();
        }
      }
      setIsThinking(false);
    } else {
      // Server-side AI fallback
      setIsThinking(true);
      try {
        const result = await makeMove.mutateAsync({
          gameId: activeGameId,
          from: sourceSquare,
          to: targetSquare,
          promotion: isPromotion ? "q" : undefined,
        });
        setGameFen(result.fen);
        chess.load(result.fen);
        setMoveHistory(prev => {
          const newHistory = [...prev];
          if (result.aiMove) newHistory.push(result.aiMove.san);
          return newHistory;
        });
        if (result.aiMove) setLastAiMove({ from: result.aiMove.from, to: result.aiMove.to });
        if (result.status !== "active") {
          setGameStatus(result.status);
          if (result.rewards) {
            setRewards(result.rewards);
            const r = result.rewards as any;
            if (r.traitMultiplier && r.traitMultiplier > 1) {
              showBonusToast({
                system: "Chess",
                baseAmount: Math.round(r.dream / r.traitMultiplier),
                finalAmount: r.dream,
                multiplier: r.traitMultiplier,
                currency: "Dream",
                sources: r.traitSources || ["Character Bonus"],
              });
            }
          }
          if (result.eloChange) setEloChange(result.eloChange);
          utils.chess.getMyRanking.invalidate();
          utils.chess.getHistory.invalidate();
          utils.chess.getActiveGame.invalidate();
        }
      } catch (e: any) {
        console.error("Server move error:", e);
      }
      setIsThinking(false);
    }

    return true;
  }, [activeGameId, gameStatus, isThinking, makeMove, utils, useClientAi, stockfish.isReady, requestAiMove]);

  const handleResign = async () => {
    if (!activeGameId) return;
    try {
      const result = await resignGame.mutateAsync({ gameId: activeGameId });
      setGameStatus("resigned");
      setEloChange(result.eloChange);
      utils.chess.getMyRanking.invalidate();
      utils.chess.getActiveGame.invalidate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBackToMenu = () => {
    setView("menu");
    setActiveGameId(null);
    setGameStatus("active");
    setRewards(null);
    setEloChange(0);
    setMoveHistory([]);
    setLastAiMove(null);
    setSelectedCharacter(null);
    setSelectedOpponent(null);
  };

  const handleNewGame = () => {
    setActiveGameId(null);
    setGameStatus("active");
    setRewards(null);
    setEloChange(0);
    setMoveHistory([]);
    setLastAiMove(null);
    setGameFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setOpponentInfo(null);
    chessRef.current.reset();
    utils.chess.getActiveGame.invalidate();
    setView("character_select");
  };

  /* ─── Evaluation bar calculation ───
     Must run before any conditional early-return so hook order
     is stable across renders. */
  const evalPercent = useMemo(() => {
    if (stockfish.evaluation === null) return 50;
    if (stockfish.evaluation >= 999) return 95;
    if (stockfish.evaluation <= -999) return 5;
    // Map eval (-5 to +5) to (10% to 90%)
    return Math.max(5, Math.min(95, 50 + stockfish.evaluation * 8));
  }, [stockfish.evaluation]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center space-y-4">
          <Crown size={48} className="text-primary mx-auto" />
          <h1 className="font-display text-2xl font-bold tracking-wider">THE ARCHITECT'S GAMBIT</h1>
          <p className="font-mono text-sm text-muted-foreground">Login required to play</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-sm font-mono hover:bg-primary/20">
            LOGIN TO PLAY
          </a>
        </div>
      </div>
    );
  }

  const tier = ranking.data?.tier || "bronze";
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.bronze;

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      <LivingBackground src="/art/chess/chess-holographic-board.png" accent="#f59e0b" opacity={0.15} voidRoomKey="gamemasters_arena" particleCount={8} />
      <div className="relative z-10">
      <AnimatePresence mode="wait">
        {/* ═══ MAIN MENU ═══ */}
        {view === "menu" && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link href="/games" className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></Link>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-2">
                  <Crown size={20} className="text-primary" />
                  THE ARCHITECT'S GAMBIT
                </h1>
                <p className="font-mono text-xs text-muted-foreground">
                  Stockfish-Powered Chess // {stockfish.isReady ? (
                    <span className="text-emerald-400">Engine Ready</span>
                  ) : (
                    <span className="text-amber-400">Loading Engine...</span>
                  )}
                </p>
              </div>
            </div>

            {/* Player Stats */}
            {ranking.data && (
              <div className={`rounded-lg border ${tierConfig.border} ${tierConfig.bg} p-4 ${tierConfig.glow || ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tierConfig.icon}</span>
                    <div>
                      <p className={`font-display text-lg font-bold ${tierConfig.color}`}>{tierConfig.label}</p>
                      <p className="font-mono text-xs text-muted-foreground">ELO: {ranking.data.elo} // Peak: {ranking.data.peakElo}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-muted-foreground space-y-0.5">
                    <p>W: {ranking.data.wins} / L: {ranking.data.losses} / D: {ranking.data.draws}</p>
                    <p>Streak: {ranking.data.winStreak} // Best: {ranking.data.bestWinStreak}</p>
                    {ranking.data.defeatedGameMaster && <p className="text-amber-400 font-bold">GAME MASTER DEFEATED</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Game Modes — 5 modes now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { mode: "casual" as const, title: "CASUAL MATCH", desc: "Practice against AI. No ELO change.", icon: Gamepad2, color: "text-emerald-400", border: "border-emerald-400/20" },
                { mode: "ranked" as const, title: "RANKED MATCH", desc: "Climb the ladder. ELO at stake.", icon: TrendingUp, color: "text-primary", border: "border-primary/20" },
                { mode: "story" as const, title: "STORY MODE", desc: "Face each character in order.", icon: BookOpen, color: "text-accent", border: "border-accent/20" },
                { mode: "multiplayer" as const, title: "MULTIPLAYER", desc: "Challenge other players online.", icon: Users, color: "text-rose-400", border: "border-rose-400/20" },
                { mode: "game_master" as const, title: "THE GAME MASTER", desc: "Grandmaster-level boss. Only the worthy.", icon: Crown, color: "text-amber-400", border: "border-amber-400/20", locked: tier !== "grandmaster" },
              ].map(({ mode, title, desc, icon: Icon, color, border, locked }) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (mode === "multiplayer") {
                      setView("multiplayer_lobby");
                    } else {
                      setSelectedMode(mode);
                      setView("character_select");
                    }
                  }}
                  disabled={locked}
                  className={`group text-left p-4 rounded-lg border ${border} bg-card/30 hover:bg-card/60 transition-all ${locked ? "opacity-40 cursor-not-allowed" : "hover-lift"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {locked ? <Lock size={18} className="text-muted-foreground" /> : <Icon size={18} className={color} />}
                    <span className="font-display text-sm font-bold tracking-wider">{title}</span>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">{locked ? "Reach Grandmaster to unlock" : desc}</p>
                </button>
              ))}
            </div>

            {/* AI Tier Legend */}
            <div className="rounded-lg border border-border/20 bg-card/20 p-4">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] mb-3 flex items-center gap-2">
                <BarChart3 size={14} className="text-primary" /> AI DIFFICULTY TIERS
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-emerald-400 font-bold">NEYONS</p>
                  <p className="font-mono text-[9px] text-muted-foreground">Beginner to Intermediate</p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">Depth 3-7 // Skill 2-8</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-blue-400 font-bold">ARCHONS</p>
                  <p className="font-mono text-[9px] text-muted-foreground">Advanced to Expert</p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">Depth 10-14 // Skill 12-16</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-amber-400 font-bold">THE ARCHITECT</p>
                  <p className="font-mono text-[9px] text-muted-foreground">Grandmaster Level</p>
                  <p className="font-mono text-[9px] text-muted-foreground/60">Depth 20 // Skill 20</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setView("ladder")} className="p-3 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 text-center hover-lift">
                <Trophy size={18} className="text-primary mx-auto mb-1" />
                <span className="font-mono text-[10px] text-muted-foreground">LADDER</span>
              </button>
              <button onClick={() => setView("history")} className="p-3 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 text-center hover-lift">
                <Clock size={18} className="text-accent mx-auto mb-1" />
                <span className="font-mono text-[10px] text-muted-foreground">HISTORY</span>
              </button>
              <button onClick={() => setView("story_select")} className="p-3 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 text-center hover-lift">
                <BookOpen size={18} className="text-chart-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] text-muted-foreground">STORY</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ CHARACTER SELECT ═══ */}
        {view === "character_select" && (
          <motion.div key="charselect" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("menu")} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
              <div>
                <h2 className="font-display text-lg font-bold tracking-wider">SELECT YOUR CHAMPION</h2>
                <p className="font-mono text-xs text-muted-foreground">{selectedMode.toUpperCase()} MODE // Choose wisely</p>
              </div>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {characters.data?.map((char) => {
                const StyleIcon = STYLE_ICONS[char.style] || Crown;
                const isSelected = selectedCharacter === char.id;
                const aiTier = CHARACTER_AI_TIER[char.id];
                const tierInfo = AI_TIER_INFO[aiTier];
                return (
                  <button
                    key={char.id}
                    onClick={() => char.isUnlocked && setSelectedCharacter(char.id)}
                    disabled={!char.isUnlocked}
                    className={`relative text-left p-3 rounded-lg border transition-all ${
                      isSelected ? "border-primary bg-primary/10 ring-1 ring-primary/50" :
                      char.isUnlocked ? "border-border/30 bg-card/30 hover:border-primary/30 hover:bg-card/50" :
                      "border-border/10 bg-card/10 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {!char.isUnlocked && (
                      <div className="absolute top-2 right-2"><Lock size={12} className="text-muted-foreground" /></div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <StyleIcon size={16} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                      <span className="font-display text-xs font-bold tracking-wider truncate">{char.name}</span>
                    </div>
                    <p className="font-mono text-[9px] text-accent/70 mb-1">{char.loreTitle}</p>
                    <p className="font-mono text-[9px] text-muted-foreground line-clamp-2">{char.description}</p>
                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                        char.style === "aggressive" ? "bg-red-500/10 text-red-400" :
                        char.style === "defensive" ? "bg-blue-500/10 text-blue-400" :
                        char.style === "tactical" ? "bg-yellow-500/10 text-yellow-400" :
                        char.style === "positional" ? "bg-purple-500/10 text-purple-400" :
                        char.style === "endgame" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>{char.style.toUpperCase()}</span>
                      {tierInfo && (
                        <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 ${tierInfo.color}`}>
                          {tierInfo.label}
                        </span>
                      )}
                    </div>
                    {!char.isUnlocked && (
                      <p className="font-mono text-[8px] text-muted-foreground/50 mt-1">{char.unlockRequirement}</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Opponent Selection (casual mode only) */}
            {selectedMode === "casual" && selectedCharacter && (
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-3">SELECT OPPONENT</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {characters.data?.filter(c => c.id !== selectedCharacter && c.isUnlocked && c.id !== "game_master").map(char => {
                    const aiTier = CHARACTER_AI_TIER[char.id];
                    const tierInfo = AI_TIER_INFO[aiTier];
                    return (
                      <button
                        key={char.id}
                        onClick={() => setSelectedOpponent(char.id)}
                        className={`text-center p-2 rounded-lg border transition-all ${
                          selectedOpponent === char.id ? "border-accent bg-accent/10" : "border-border/20 bg-card/20 hover:border-accent/30"
                        }`}
                      >
                        <span className="font-mono text-[10px] truncate block">{char.name}</span>
                        {tierInfo && (
                          <span className={`font-mono text-[8px] ${tierInfo.color}`}>{tierInfo.label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              disabled={!selectedCharacter || startGame.isPending}
              className="w-full py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-display text-sm font-bold tracking-wider hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {startGame.isPending ? (
                <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> INITIALIZING...</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Swords size={16} /> BEGIN MATCH</span>
              )}
            </button>
            {startError && (
              <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs">
                <span className="font-bold">ERROR:</span> {startError}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ CINEMATIC ═══ */}
        {view === "cinematic" && (
          <ChessCinematic
            opponentName={opponentInfo?.name}
            onComplete={() => {
              sessionStorage.setItem("loredex_chess_cinematic_seen", "1");
              setView("playing");
            }}
          />
        )}

        {/* ═══ PLAYING — IMMERSIVE ARENA ═══ */}
        {view === "playing" && (() => {
          const arena = getArenaForOpponent(opponentInfo?.id || selectedOpponent);
          const aiTier = CHARACTER_AI_TIER[opponentInfo?.id || "the_human"];
          const tierInfo = AI_TIER_INFO[aiTier];
          return (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            {/* Arena Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={arena.background}
                alt={arena.name}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.35) saturate(1.2)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-4 sm:p-6">
              {/* Arena Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToMenu}
                    className="p-2 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60"
                  >
                    <ArrowLeft size={16} className="text-white/80" />
                  </button>
                  <div>
                    <h2
                      className="font-display text-sm font-bold tracking-wider text-white flex items-center gap-2"
                      style={{ textShadow: arena.textGlow }}
                    >
                      <Crown size={14} style={{ color: arena.accentColor }} />
                      {arena.name}
                    </h2>
                    <p className="font-mono text-[10px] text-white/50 italic">
                      {arena.subtitle} // vs {opponentInfo?.name || "Opponent"}
                      {tierInfo && <span className={` ml-2 ${tierInfo.color}`}>[{tierInfo.label}]</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {gameStatus === "active" && isThinking && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
                      <Loader2 size={12} className="animate-spin" style={{ color: arena.accentColor }} />
                      <span className="font-mono text-[9px] text-white/60">
                        {stockfish.isReady ? "STOCKFISH THINKING..." : "THINKING..."}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowEvalBar(!showEvalBar)}
                    className="p-1.5 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50"
                    title="Toggle evaluation bar"
                  >
                    <BarChart3 size={12} className={showEvalBar ? "text-primary" : "text-white/40"} />
                  </button>
                  <button
                    onClick={handleNewGame}
                    className="px-3 py-1.5 rounded-md backdrop-blur-sm border text-xs font-mono"
                    style={{
                      backgroundColor: `${arena.accentColor}15`,
                      borderColor: `${arena.accentColor}40`,
                      color: arena.accentColor,
                    }}
                  >
                    NEW GAME
                  </button>
                  {gameStatus === "active" && (
                    <button
                      onClick={handleResign}
                      className="px-3 py-1.5 rounded-md bg-red-900/40 backdrop-blur-sm border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-900/60"
                    >
                      <Flag size={12} className="inline mr-1" /> RESIGN
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
                {/* Board + Eval Bar */}
                <div className="flex justify-center gap-2">
                  {/* Evaluation Bar */}
                  {showEvalBar && stockfish.isReady && (
                    <div className="hidden sm:flex flex-col items-center">
                      <div
                        className="w-6 rounded-sm overflow-hidden border border-white/10"
                        style={{ height: "calc(min(560px, 80vw))" }}
                      >
                        <div
                          className="w-full bg-white transition-all duration-500 ease-out"
                          style={{ height: `${evalPercent}%` }}
                        />
                        <div
                          className="w-full bg-gray-900"
                          style={{ height: `${100 - evalPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-white/50 mt-1">
                        {stockfish.evaluation !== null
                          ? stockfish.evaluation >= 999 ? "M+"
                          : stockfish.evaluation <= -999 ? "M-"
                          : (stockfish.evaluation > 0 ? "+" : "") + stockfish.evaluation.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  )}

                  <div className="w-full max-w-[560px]">
                    <Chessboard
                      options={{
                        position: gameFen,
                        pieces: customPieces,
                        onPieceDrop: ({ piece, sourceSquare, targetSquare }: any) => {
                          if (!targetSquare) return false;
                          handleDrop(sourceSquare, targetSquare, piece?.pieceType || "");
                          return true;
                        },
                        canDragPiece: ({ piece }: any) => {
                          const pt = piece?.pieceType || "";
                          return pt.startsWith("w") && gameStatus === "active" && !isThinking;
                        },
                        boardStyle: {
                          borderRadius: "4px",
                          boxShadow: arena.boardGlow,
                          border: `1px solid ${arena.accentColor}33`,
                        },
                        darkSquareStyle: { backgroundColor: arena.darkSquare },
                        lightSquareStyle: { backgroundColor: arena.lightSquare },
                        dropSquareStyle: {
                          boxShadow: `inset 0 0 1px 6px ${arena.dropHighlight}`,
                        },
                        animationDurationInMs: 250,
                        showAnimations: true,
                      }}
                    />
                  </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-3">
                  {/* Game Status */}
                  {gameStatus !== "active" && (
                    <div
                      className="rounded-lg p-4 text-center backdrop-blur-md border"
                      style={{
                        backgroundColor:
                          gameStatus === "checkmate" && rewards
                            ? "rgba(0,255,100,0.1)"
                            : gameStatus === "stalemate" || gameStatus === "draw"
                            ? "rgba(255,200,0,0.1)"
                            : "rgba(255,50,50,0.1)",
                        borderColor:
                          gameStatus === "checkmate" && rewards
                            ? "rgba(0,255,100,0.3)"
                            : gameStatus === "stalemate" || gameStatus === "draw"
                            ? "rgba(255,200,0,0.3)"
                            : "rgba(255,50,50,0.3)",
                      }}
                    >
                      <p
                        className="font-display text-lg font-bold tracking-wider mb-1 text-white"
                        style={{ textShadow: arena.textGlow }}
                      >
                        {gameStatus === "checkmate" && rewards
                          ? "VICTORY!"
                          : gameStatus === "checkmate"
                          ? "DEFEATED"
                          : gameStatus === "stalemate"
                          ? "STALEMATE"
                          : gameStatus === "draw"
                          ? "DRAW"
                          : "RESIGNED"}
                      </p>
                      {eloChange !== 0 && (
                        <p className={`font-mono text-sm ${eloChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          ELO: {eloChange > 0 ? "+" : ""}{eloChange}
                        </p>
                      )}
                      {rewards && rewards.dream > 0 && (
                        <p className="font-mono text-xs mt-1" style={{ color: arena.accentColor }}>
                          +{rewards.dream} Dream Tokens
                        </p>
                      )}
                      {rewards && Object.keys(rewards.materials || {}).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 justify-center">
                          {Object.entries(rewards.materials).map(([mat, qty]) => (
                            <span
                              key={mat}
                              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: `${arena.accentColor}15`,
                                color: arena.accentColor,
                              }}
                            >
                              {String(qty)}x {mat.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2 justify-center">
                        <button
                          onClick={handleNewGame}
                          className="px-5 py-2.5 rounded-md text-sm font-display tracking-wider border-2"
                          style={{
                            backgroundColor: `${arena.accentColor}20`,
                            borderColor: `${arena.accentColor}60`,
                            color: arena.accentColor,
                          }}
                        >
                          NEW GAME
                        </button>
                        <button
                          onClick={handleBackToMenu}
                          className="px-4 py-2.5 rounded-md text-xs font-mono border"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderColor: "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          MENU
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Move History */}
                  <div
                    className="rounded-lg p-3 backdrop-blur-md border"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderColor: `${arena.accentColor}20`,
                    }}
                  >
                    <h3
                      className="font-display text-xs font-bold tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: arena.accentColor }}
                    >
                      <BookOpen size={12} /> MOVE LOG
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto space-y-0.5 font-mono text-[10px]">
                      {moveHistory.length === 0 ? (
                        <p className="text-white/30">No moves yet...</p>
                      ) : (
                        Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
                          (_, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-white/20 w-5">{i + 1}.</span>
                              <span className="text-white/80 w-12">{moveHistory[i * 2]}</span>
                              <span className="text-white/50">{moveHistory[i * 2 + 1] || ""}</span>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>

                  {/* Opponent Lore */}
                  {opponentInfo && (
                    <div
                      className="rounded-lg p-3 backdrop-blur-md border"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderColor: `${arena.accentColor}20`,
                      }}
                    >
                      <h3
                        className="font-display text-xs font-bold tracking-wider mb-1 text-white"
                        style={{ textShadow: arena.textGlow }}
                      >
                        {opponentInfo.name}
                      </h3>
                      <p className="font-mono text-[9px] mb-1" style={{ color: `${arena.accentColor}aa` }}>
                        {opponentInfo.loreTitle}
                        {tierInfo && <span className={` ml-2 ${tierInfo.color}`}>[{tierInfo.label}]</span>}
                      </p>
                      <p className="font-mono text-[9px] text-white/50">{opponentInfo.description}</p>
                    </div>
                  )}

                  {/* Engine Info */}
                  <div
                    className="rounded-lg p-2 text-center backdrop-blur-sm border"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.3)",
                      borderColor: `${arena.accentColor}15`,
                    }}
                  >
                    <p className="font-mono text-[8px] tracking-[0.3em]" style={{ color: `${arena.accentColor}80` }}>
                      {stockfish.isReady ? "STOCKFISH 18 WASM" : "LOADING ENGINE..."} // {tierInfo?.label || "AI"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          );
        })()}

        {/* ═══ MULTIPLAYER LOBBY ═══ */}
        {view === "multiplayer_lobby" && (
          <motion.div key="mp-lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => { handleCancelSearch(); setView("menu"); }} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
              <div>
                <h2 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                  <Users size={18} className="text-rose-400" /> MULTIPLAYER ARENA
                </h2>
                <p className="font-mono text-xs text-muted-foreground">Challenge other operatives in real-time</p>
              </div>
            </div>

            {/* Beta Notice */}
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-2 flex items-center gap-2">
              <Wifi size={14} className="text-amber-400 shrink-0" />
              <p className="font-mono text-xs text-amber-300/80">Multiplayer is in <span className="font-bold text-amber-400">BETA PREVIEW</span> — matchmaking is live. Expect occasional issues.</p>
            </div>

            {/* ── IDLE: Find Match ── */}
            {mpState === "idle" && (
              <>
                {/* Player Info */}
                {ranking.data && (
                  <div className="rounded-lg border border-rose-400/20 bg-card/30 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center">
                      <Swords size={18} className="text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold">{user?.name || "Operative"}</p>
                      <p className="font-mono text-xs text-muted-foreground">ELO: {ranking.data.elo} // {ranking.data.wins}W - {ranking.data.losses}L - {ranking.data.draws}D</p>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4">
                  <button
                    onClick={handleFindMatch}
                    disabled={!isAuthenticated}
                    className="w-full sm:w-auto px-8 py-4 rounded-lg bg-rose-500/20 border-2 border-rose-400/50 text-rose-300 font-display text-lg font-bold tracking-wider hover:bg-rose-500/30 hover:border-rose-400/70 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Swords size={22} />
                      FIND MATCH
                    </div>
                  </button>
                  {!isAuthenticated && (
                    <p className="font-mono text-xs text-muted-foreground">You must be logged in to play multiplayer.</p>
                  )}
                  <p className="font-mono text-xs text-muted-foreground">ELO-based matchmaking // 10 min per side</p>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => { setSelectedMode("casual"); setView("character_select"); }}
                    className="px-5 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-sm font-mono hover:bg-primary/20"
                  >
                    PLAY VS AI INSTEAD
                  </button>
                </div>
              </>
            )}

            {/* ── SEARCHING: Queue animation ── */}
            {mpState === "searching" && (
              <div className="text-center space-y-5 py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-16 h-16 rounded-full border-2 border-rose-400/30 border-t-rose-400 flex items-center justify-center"
                >
                  <Swords size={24} className="text-rose-400" />
                </motion.div>

                <div>
                  <p className="font-display text-lg font-bold tracking-wider text-rose-300">SEARCHING FOR OPPONENT</p>
                  <p className="font-mono text-sm text-muted-foreground mt-1">Time elapsed: {mpFormatSearchTime(mpSearchElapsed)}</p>
                </div>

                {mpPlayersInQueue > 0 && (
                  <div className="rounded-lg border border-border/30 bg-card/30 p-3 inline-block">
                    <p className="font-mono text-xs text-muted-foreground">Queue position: <span className="text-rose-400 font-bold">{mpQueuePos}</span> // Players searching: <span className="text-rose-400 font-bold">{mpPlayersInQueue}</span></p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 mt-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-rose-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleCancelSearch}
                  className="px-6 py-2.5 rounded-lg border border-border/50 bg-secondary/30 text-muted-foreground font-display text-sm font-bold tracking-wider hover:bg-destructive/20 hover:border-destructive/40 hover:text-destructive transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X size={16} />
                    CANCEL
                  </div>
                </button>
              </div>
            )}

            {/* ── MATCHED: Opponent found (brief transition screen) ── */}
            {mpState === "matched" && mpOpponent && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-5 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-400/20 border-2 border-emerald-400/50 flex items-center justify-center">
                    <Swords size={24} className="text-emerald-400" />
                  </div>
                </motion.div>

                <div>
                  <p className="font-display text-lg font-bold tracking-wider text-emerald-300">MATCH FOUND</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Prepare for battle</p>
                </div>

                <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-4 max-w-xs mx-auto space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">Opponent</span>
                    <span className="font-display text-sm font-bold text-emerald-300">{mpOpponent.opponentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">ELO</span>
                    <span className="font-mono text-sm font-bold">{mpOpponent.opponentElo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">You play</span>
                    <span className="font-display text-sm font-bold">{mpOpponent.color === "white" ? "WHITE" : "BLACK"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">Time</span>
                    <span className="font-mono text-sm">{Math.floor(mpOpponent.timeControl / 60)} min</span>
                  </div>
                </div>

                <p className="font-mono text-xs text-emerald-400 animate-pulse">Loading game board...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══ MULTIPLAYER PLAYING ═══ */}
        {view === "multiplayer_playing" && mpOpponent && (
          <motion.div
            key="mp-playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            {/* Dark background for multiplayer */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black" />

            {/* Content Overlay */}
            <div className="relative z-10 p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMpBackToMenu}
                    className="p-2 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60"
                  >
                    <ArrowLeft size={16} className="text-white/80" />
                  </button>
                  <div>
                    <h2 className="font-display text-sm font-bold tracking-wider text-white flex items-center gap-2">
                      <Swords size={14} className="text-rose-400" />
                      MULTIPLAYER ARENA
                    </h2>
                    <p className="font-mono text-[10px] text-white/50">
                      vs {mpOpponent.opponentName} ({mpOpponent.opponentElo} ELO) // You are {mpOpponent.color}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-rose-400/10 border border-rose-400/20">
                    <span className="font-mono text-[10px] text-rose-300">BETA</span>
                  </div>
                </div>
              </div>

              {/* Draw offer banner */}
              {mpDrawOffered && !mpGameOver && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <HandshakeIcon size={16} className="text-amber-400" />
                    <span className="font-mono text-sm text-amber-300">Opponent offers a draw</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMpAcceptDraw}
                      className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs hover:bg-emerald-500/30"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleMpDeclineDraw}
                      className="px-3 py-1 rounded bg-destructive/20 border border-destructive/40 text-destructive font-mono text-xs hover:bg-destructive/30"
                    >
                      Decline
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Game Over Overlay */}
              {mpGameOver && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 rounded-lg border p-4 text-center space-y-3"
                  style={{
                    borderColor: mpGameOver.winner === "draw" ? "rgba(234, 179, 8, 0.3)" :
                      (mpGameOver.winner === mpOpponent.color ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"),
                    backgroundColor: mpGameOver.winner === "draw" ? "rgba(234, 179, 8, 0.05)" :
                      (mpGameOver.winner === mpOpponent.color ? "rgba(239, 68, 68, 0.05)" : "rgba(34, 197, 94, 0.05)"),
                  }}
                >
                  <p className="font-display text-lg font-bold tracking-wider" style={{
                    color: mpGameOver.winner === "draw" ? "#eab308" :
                      (mpGameOver.winner === mpOpponent.color ? "#22c55e" : "#ef4444"),
                  }}>
                    {mpGameOver.winner === "draw" ? "DRAW" :
                      mpGameOver.winner === mpOpponent.color ? "DEFEAT" : "VICTORY"}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground capitalize">{mpGameOver.reason}</p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="font-mono text-muted-foreground">
                      ELO: <span className={mpGameOver.eloChange >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {mpGameOver.eloChange >= 0 ? "+" : ""}{mpGameOver.eloChange}
                      </span>
                    </span>
                    <span className="font-mono text-muted-foreground">New: <span className="text-white font-bold">{mpGameOver.newElo}</span></span>
                  </div>
                  <button
                    onClick={handleMpBackToMenu}
                    className="mt-2 px-6 py-2 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 font-display text-sm font-bold tracking-wider hover:bg-rose-500/30"
                  >
                    BACK TO LOBBY
                  </button>
                </motion.div>
              )}

              {/* Main game layout */}
              <div className="flex flex-col lg:flex-row gap-4 items-start justify-center">
                {/* Board + clocks */}
                <div className="w-full max-w-[560px] mx-auto lg:mx-0">
                  {/* Opponent clock (top) */}
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-rose-400/20 flex items-center justify-center">
                        <Users size={12} className="text-rose-400" />
                      </div>
                      <span className="font-display text-sm font-bold text-white/80">{mpOpponent.opponentName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">({mpOpponent.opponentElo})</span>
                    </div>
                    <div className={`px-3 py-1 rounded font-mono text-sm font-bold ${
                      (mpOpponent.color === "white" ? mpTurn === "b" : mpTurn === "w")
                        ? "bg-rose-400/20 text-rose-300 border border-rose-400/30"
                        : "bg-black/40 text-white/50 border border-white/10"
                    }`}>
                      <Clock size={12} className="inline mr-1.5" />
                      {mpFormatTime(mpOpponent.color === "white" ? mpBlackTime : mpWhiteTime)}
                    </div>
                  </div>

                  {/* Chessboard */}
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <Chessboard
                      options={{
                        position: mpFen,
                        pieces: customPieces,
                        boardOrientation: mpOpponent.color === "white" ? "black" : "white",
                        onPieceDrop: ({ sourceSquare, targetSquare }: any) => {
                          if (!targetSquare) return false;
                          return handleMpMove(sourceSquare, targetSquare);
                        },
                        canDragPiece: ({ piece }: any) => {
                          if (mpGameOver) return false;
                          const pt = piece?.pieceType || "";
                          const isOurTurn = mpOpponent.color === "white"
                            ? mpTurn === "w" : mpTurn === "b";
                          const isOurPiece = mpOpponent.color === "white"
                            ? pt.startsWith("w") : pt.startsWith("b");
                          return isOurTurn && isOurPiece;
                        },
                        boardStyle: {
                          borderRadius: "0",
                        },
                        darkSquareStyle: { backgroundColor: "#779952" },
                        lightSquareStyle: { backgroundColor: "#edeed1" },
                        dropSquareStyle: {
                          boxShadow: "inset 0 0 1px 6px rgba(255, 255, 0, 0.4)",
                        },
                        animationDurationInMs: 200,
                        showAnimations: true,
                      }}
                    />
                  </div>

                  {/* Player clock (bottom) */}
                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield size={12} className="text-primary" />
                      </div>
                      <span className="font-display text-sm font-bold text-white">{user?.name || "You"}</span>
                    </div>
                    <div className={`px-3 py-1 rounded font-mono text-sm font-bold ${
                      (mpOpponent.color === "white" ? mpTurn === "w" : mpTurn === "b")
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-black/40 text-white/50 border border-white/10"
                    }`}>
                      <Clock size={12} className="inline mr-1.5" />
                      {mpFormatTime(mpOpponent.color === "white" ? mpWhiteTime : mpBlackTime)}
                    </div>
                  </div>
                </div>

                {/* Side panel: move history + actions */}
                <div className="w-full lg:w-64 space-y-3">
                  {/* Move history */}
                  <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-3">
                    <h3 className="font-display text-xs font-bold tracking-wider text-white/60 mb-2 flex items-center gap-1.5">
                      <Eye size={12} /> MOVE HISTORY
                    </h3>
                    <div className="max-h-48 overflow-y-auto font-mono text-xs space-y-0.5">
                      {mpMoveHistory.length === 0 && (
                        <p className="text-muted-foreground italic">Waiting for first move...</p>
                      )}
                      {mpMoveHistory.reduce<Array<[string, string | undefined]>>((pairs, move, i) => {
                        if (i % 2 === 0) pairs.push([move, undefined]);
                        else pairs[pairs.length - 1][1] = move;
                        return pairs;
                      }, []).map((pair, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-muted-foreground w-5 text-right">{i + 1}.</span>
                          <span className="text-white/80 w-12">{pair[0]}</span>
                          {pair[1] && <span className="text-white/60 w-12">{pair[1]}</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Game actions */}
                  {!mpGameOver && (
                    <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-3 space-y-2">
                      <h3 className="font-display text-xs font-bold tracking-wider text-white/60 mb-2">ACTIONS</h3>
                      <button
                        onClick={handleMpOfferDraw}
                        className="w-full px-3 py-2 rounded bg-amber-500/10 border border-amber-400/20 text-amber-300 font-mono text-xs hover:bg-amber-500/20 flex items-center justify-center gap-2"
                      >
                        <HandshakeIcon size={14} /> Offer Draw
                      </button>
                      <button
                        onClick={handleMpResign}
                        className="w-full px-3 py-2 rounded bg-destructive/10 border border-destructive/20 text-destructive font-mono text-xs hover:bg-destructive/20 flex items-center justify-center gap-2"
                      >
                        <Flag size={14} /> Resign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ RANKED LADDER ═══ */}
        {view === "ladder" && (
          <motion.div key="ladder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("menu")} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
              <h2 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                <Trophy size={18} className="text-primary" /> RANKED LADDER
              </h2>
            </div>
            <div className="space-y-2">
              {leaderboard.data?.map((entry, i) => {
                const t = TIER_CONFIG[entry.tier] || TIER_CONFIG.bronze;
                return (
                  <div key={entry.userId} className={`flex items-center gap-3 p-3 rounded-lg border ${t.border} ${t.bg}`}>
                    <span className="font-display text-lg font-bold w-8 text-center">{i + 1}</span>
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold">Player #{entry.userId}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        W: {entry.wins} / L: {entry.losses} / D: {entry.draws}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-display text-lg font-bold ${t.color}`}>{entry.elo}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{t.label}</p>
                    </div>
                  </div>
                );
              })}
              {(!leaderboard.data || leaderboard.data.length === 0) && (
                <p className="text-center font-mono text-sm text-muted-foreground py-8">No ranked players yet. Be the first!</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ GAME HISTORY ═══ */}
        {view === "history" && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("menu")} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
              <h2 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                <Clock size={18} className="text-accent" /> MATCH HISTORY
              </h2>
            </div>
            <div className="space-y-2">
              {history.data?.map((game) => {
                const won = game.winnerId === user?.id;
                const isDraw = game.status === "stalemate" || game.status === "draw";
                return (
                  <div key={game.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    won ? "border-emerald-400/20 bg-emerald-400/5" :
                    isDraw ? "border-accent/20 bg-accent/5" :
                    "border-destructive/20 bg-destructive/5"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${won ? "bg-emerald-400" : isDraw ? "bg-accent" : "bg-destructive"}`} />
                    <div className="flex-1">
                      <p className="font-mono text-xs">
                        <span className="text-foreground">{game.whiteCharacterName}</span>
                        <span className="text-muted-foreground"> vs </span>
                        <span className="text-foreground">{game.blackCharacterName}</span>
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {game.mode?.toUpperCase()} // {game.moveCount} moves
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-xs font-bold ${won ? "text-emerald-400" : isDraw ? "text-accent" : "text-destructive"}`}>
                        {won ? "WIN" : isDraw ? "DRAW" : "LOSS"}
                      </p>
                      {game.whiteEloChange !== null && game.whiteEloChange !== 0 && (
                        <p className={`font-mono text-[9px] ${(game.whiteEloChange || 0) > 0 ? "text-emerald-400" : "text-destructive"}`}>
                          {(game.whiteEloChange || 0) > 0 ? "+" : ""}{game.whiteEloChange}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {(!history.data || history.data.length === 0) && (
                <p className="text-center font-mono text-sm text-muted-foreground py-8">No games played yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ STORY PROGRESS ═══ */}
        {view === "story_select" && (
          <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("menu")} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
              <div>
                <h2 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                  <BookOpen size={18} className="text-chart-4" /> STORY MODE
                </h2>
                <p className="font-mono text-xs text-muted-foreground">Progress: {ranking.data?.storyProgress || 0} / 11 opponents defeated</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { name: "The Human", tier: "NEYON I" },
                { name: "The Collector", tier: "NEYON II" },
                { name: "Iron Lion", tier: "NEYON III" },
                { name: "The Enigma", tier: "ARCHON I" },
                { name: "The Warlord", tier: "ARCHON I" },
                { name: "The Oracle", tier: "ARCHON II" },
                { name: "The Necromancer", tier: "ARCHON II" },
                { name: "The Programmer", tier: "ARCHON III" },
                { name: "Agent Zero", tier: "ARCHON III" },
                { name: "The Source", tier: "ARCHITECT" },
                { name: "The Game Master", tier: "ARCHITECT" },
              ].map((entry, i) => {
                const progress = ranking.data?.storyProgress || 0;
                const defeated = i < progress;
                const current = i === progress;
                const locked = i > progress;
                const tierColor = entry.tier.startsWith("NEYON") ? "text-emerald-400"
                  : entry.tier.startsWith("ARCHON") ? "text-blue-400"
                  : "text-amber-400";
                return (
                  <div key={entry.name} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    defeated ? "border-emerald-400/20 bg-emerald-400/5" :
                    current ? "border-primary/30 bg-primary/5" :
                    "border-border/10 bg-card/10 opacity-40"
                  }`}>
                    <span className="font-display text-lg font-bold w-8 text-center text-muted-foreground">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold">{entry.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {defeated ? "DEFEATED" : current ? "CURRENT OPPONENT" : "LOCKED"}
                        <span className={` ml-2 ${tierColor}`}>[{entry.tier}]</span>
                      </p>
                    </div>
                    {defeated && <Trophy size={16} className="text-emerald-400" />}
                    {current && (
                      <button
                        onClick={() => { setSelectedMode("story"); setView("character_select"); }}
                        className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20"
                      >
                        CHALLENGE
                      </button>
                    )}
                    {locked && <Lock size={14} className="text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
