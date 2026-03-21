/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S GAMBIT — Strategic Chess Game
   Play as Dischordian characters with unique styles.
   Ranked ladder, story mode, and Game Master boss fight.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  Crown, Swords, Shield, Zap, Brain, Target, Trophy, Star,
  ChevronRight, ArrowLeft, Loader2, Clock, TrendingUp,
  BookOpen, Gamepad2, Users, Skull, Eye, Award, Lock,
  RotateCcw, Flag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

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

type GameView = "menu" | "character_select" | "playing" | "ladder" | "history" | "story_select";

export default function ChessPage() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<GameView>("menu");
  const [selectedMode, setSelectedMode] = useState<"casual" | "ranked" | "story" | "game_master">("casual");
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
      setView("playing");
    }
  }, [activeGame.data]);

  const handleStartGame = async () => {
    if (!selectedCharacter) return;
    try {
      const result = await startGame.mutateAsync({
        mode: selectedMode,
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
      setView("playing");
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleDrop = useCallback(async (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!activeGameId || gameStatus !== "active" || isThinking) return false;

    // Check if it's a promotion
    const isPromotion = piece[1] === "P" && (targetSquare[1] === "8" || targetSquare[1] === "1");

    setIsThinking(true);
    try {
      const result = await makeMove.mutateAsync({
        gameId: activeGameId,
        from: sourceSquare,
        to: targetSquare,
        promotion: isPromotion ? "q" : undefined,
      });

      setGameFen(result.fen);
      setMoveHistory(prev => {
        const newHistory = [...prev, result.playerMove.san];
        if (result.aiMove) newHistory.push(result.aiMove.san);
        return newHistory;
      });

      if (result.aiMove) {
        setLastAiMove({ from: result.aiMove.from, to: result.aiMove.to });
      }

      if (result.status !== "active") {
        setGameStatus(result.status);
        if (result.rewards) setRewards(result.rewards);
        if (result.eloChange) setEloChange(result.eloChange);
        utils.chess.getMyRanking.invalidate();
        utils.chess.getHistory.invalidate();
        utils.chess.getActiveGame.invalidate();
      }

      setIsThinking(false);
      return true;
    } catch (e: any) {
      setIsThinking(false);
      return false;
    }
  }, [activeGameId, gameStatus, isThinking, makeMove, utils]);

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
    <div className="min-h-screen grid-bg">
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
                <p className="font-mono text-xs text-muted-foreground">Strategic Chess // Lore-Driven Opponents</p>
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

            {/* Game Modes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { mode: "casual" as const, title: "CASUAL MATCH", desc: "Practice against AI. No ELO change.", icon: Gamepad2, color: "text-emerald-400", border: "border-emerald-400/20" },
                { mode: "ranked" as const, title: "RANKED MATCH", desc: "Climb the ladder. ELO at stake.", icon: TrendingUp, color: "text-primary", border: "border-primary/20" },
                { mode: "story" as const, title: "STORY MODE", desc: "Face each character in order. Unlock new opponents.", icon: BookOpen, color: "text-accent", border: "border-accent/20" },
                { mode: "game_master" as const, title: "THE GAME MASTER", desc: "Grandmaster-level boss. Only the worthy may challenge.", icon: Crown, color: "text-amber-400", border: "border-amber-400/20", locked: tier !== "grandmaster" },
              ].map(({ mode, title, desc, icon: Icon, color, border, locked }) => (
                <button
                  key={mode}
                  onClick={() => { setSelectedMode(mode); setView("character_select"); }}
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
                    <div className="mt-2 flex items-center gap-1">
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                        char.style === "aggressive" ? "bg-red-500/10 text-red-400" :
                        char.style === "defensive" ? "bg-blue-500/10 text-blue-400" :
                        char.style === "tactical" ? "bg-yellow-500/10 text-yellow-400" :
                        char.style === "positional" ? "bg-purple-500/10 text-purple-400" :
                        char.style === "endgame" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>{char.style.toUpperCase()}</span>
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
                  {characters.data?.filter(c => c.id !== selectedCharacter && c.isUnlocked && c.id !== "game_master").map(char => (
                    <button
                      key={char.id}
                      onClick={() => setSelectedOpponent(char.id)}
                      className={`text-center p-2 rounded-lg border transition-all ${
                        selectedOpponent === char.id ? "border-accent bg-accent/10" : "border-border/20 bg-card/20 hover:border-accent/30"
                      }`}
                    >
                      <span className="font-mono text-[10px] truncate block">{char.name}</span>
                    </button>
                  ))}
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
          </motion.div>
        )}

        {/* ═══ PLAYING ═══ */}
        {view === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToMenu} className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"><ArrowLeft size={16} /></button>
                <div>
                  <h2 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
                    <Crown size={14} className="text-primary" />
                    {opponentInfo?.name || "Opponent"}
                  </h2>
                  <p className="font-mono text-[10px] text-muted-foreground">{opponentInfo?.loreTitle || ""} // {opponentInfo?.style || ""}</p>
                </div>
              </div>
              {gameStatus === "active" && (
                <div className="flex items-center gap-2">
                  {isThinking && <Loader2 size={14} className="animate-spin text-accent" />}
                  <button onClick={handleResign} className="px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono hover:bg-destructive/20">
                    <Flag size={12} className="inline mr-1" /> RESIGN
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              {/* Board */}
              <div className="flex justify-center">
                <div className="w-full max-w-[560px]">
                  <Chessboard
                    options={{
                      position: gameFen,
                      onPieceDrop: ({ piece, sourceSquare, targetSquare }) => {
                        if (!targetSquare) return false;
                        handleDrop(sourceSquare, targetSquare, piece.pieceType);
                        return true;
                      },
                      canDragPiece: ({ piece }) => piece.pieceType[0] === "w" && gameStatus === "active" && !isThinking,
                      boardStyle: {
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(0,255,255,0.1)",
                      },
                      darkSquareStyle: { backgroundColor: "#1a1a2e" },
                      lightSquareStyle: { backgroundColor: "#16213e" },
                      dropSquareStyle: { boxShadow: "inset 0 0 1px 6px rgba(0,255,255,0.3)" },
                      animationDurationInMs: 200,
                    }}
                  />
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-3">
                {/* Game Status */}
                {gameStatus !== "active" && (
                  <div className={`rounded-lg border p-4 text-center ${
                    gameStatus === "checkmate" && rewards ? "border-primary/40 bg-primary/10" :
                    gameStatus === "stalemate" || gameStatus === "draw" ? "border-accent/40 bg-accent/10" :
                    "border-destructive/40 bg-destructive/10"
                  }`}>
                    <p className="font-display text-lg font-bold tracking-wider mb-1">
                      {gameStatus === "checkmate" && rewards ? "VICTORY!" :
                       gameStatus === "checkmate" ? "DEFEATED" :
                       gameStatus === "stalemate" ? "STALEMATE" :
                       gameStatus === "draw" ? "DRAW" :
                       "RESIGNED"}
                    </p>
                    {eloChange !== 0 && (
                      <p className={`font-mono text-sm ${eloChange > 0 ? "text-emerald-400" : "text-destructive"}`}>
                        ELO: {eloChange > 0 ? "+" : ""}{eloChange}
                      </p>
                    )}
                    {rewards && rewards.dream > 0 && (
                      <p className="font-mono text-xs text-accent mt-1">+{rewards.dream} Dream Tokens</p>
                    )}
                    {rewards && Object.keys(rewards.materials || {}).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 justify-center">
                        {Object.entries(rewards.materials).map(([mat, qty]) => (
                          <span key={mat} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-chart-4/10 text-chart-4">
                            {String(qty)}x {mat.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    <button onClick={handleBackToMenu} className="mt-3 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20">
                      BACK TO MENU
                    </button>
                  </div>
                )}

                {/* Move History */}
                <div className="rounded-lg border border-border/20 bg-card/20 p-3">
                  <h3 className="font-display text-xs font-bold tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-primary" /> MOVE LOG
                  </h3>
                  <div className="max-h-[300px] overflow-y-auto space-y-0.5 font-mono text-[10px]">
                    {moveHistory.length === 0 ? (
                      <p className="text-muted-foreground/50">No moves yet...</p>
                    ) : (
                      Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-muted-foreground/40 w-5">{i + 1}.</span>
                          <span className="text-foreground w-12">{moveHistory[i * 2]}</span>
                          <span className="text-muted-foreground">{moveHistory[i * 2 + 1] || ""}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Opponent Lore */}
                {opponentInfo && (
                  <div className="rounded-lg border border-border/20 bg-card/20 p-3">
                    <h3 className="font-display text-xs font-bold tracking-wider mb-1">{opponentInfo.name}</h3>
                    <p className="font-mono text-[9px] text-accent/70 mb-1">{opponentInfo.loreTitle}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{opponentInfo.description}</p>
                  </div>
                )}
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
              {["The Human", "The Collector", "Iron Lion", "The Enigma", "The Warlord", "The Oracle", "The Necromancer", "The Programmer", "Agent Zero", "The Source", "The Game Master"].map((name, i) => {
                const progress = ranking.data?.storyProgress || 0;
                const defeated = i < progress;
                const current = i === progress;
                const locked = i > progress;
                return (
                  <div key={name} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    defeated ? "border-emerald-400/20 bg-emerald-400/5" :
                    current ? "border-primary/30 bg-primary/5" :
                    "border-border/10 bg-card/10 opacity-40"
                  }`}>
                    <span className="font-display text-lg font-bold w-8 text-center text-muted-foreground">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold">{name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {defeated ? "DEFEATED" : current ? "CURRENT OPPONENT" : "LOCKED"}
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
  );
}
