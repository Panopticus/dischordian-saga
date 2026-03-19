/* ═══════════════════════════════════════════════════════
   PVP ARENA — Real-time multiplayer card battles
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import GameCard from "@/components/GameCard";
import { AmbientParticles } from "@/components/BattleVFX";
import type { PvpBattleState, PvpCard, PvpAction, DeckCard } from "@shared/pvpBattle";
import {
  Swords, Shield, Zap, Crown, Trophy, Users, Clock,
  ChevronRight, Skull, Heart, Flame, Loader2, ArrowLeft,
  Star, TrendingUp, TrendingDown, Target, Volume2, VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ─── RANK COLORS ─── */
const RANK_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  bronze: { color: "text-amber-700", label: "Bronze", icon: "🥉" },
  silver: { color: "text-gray-400", label: "Silver", icon: "🥈" },
  gold: { color: "text-yellow-400", label: "Gold", icon: "🥇" },
  platinum: { color: "text-cyan-400", label: "Platinum", icon: "💎" },
  diamond: { color: "text-blue-400", label: "Diamond", icon: "💠" },
  master: { color: "text-purple-400", label: "Master", icon: "👑" },
  grandmaster: { color: "text-red-400", label: "Grandmaster", icon: "🔥" },
};

type Phase = "lobby" | "queue" | "battle" | "result";

export default function PvpArenaPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();
  const { playSFX, initAudio, audioReady } = useSound();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [battleState, setBattleState] = useState<PvpBattleState | null>(null);
  const [mySide, setMySide] = useState<"player1" | "player2">("player1");
  const [opponentName, setOpponentName] = useState("");
  const [opponentElo, setOpponentElo] = useState(0);
  const [queuePosition, setQueuePosition] = useState(0);
  const [playersInQueue, setPlayersInQueue] = useState(0);
  const [queueTime, setQueueTime] = useState(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [attackMode, setAttackMode] = useState(false);
  const [attackerCard, setAttackerCard] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{ won: boolean; eloChange: number; newElo: number } | null>(null);
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const [turnBannerText, setTurnBannerText] = useState("");
  const [screenShake, setScreenShake] = useState(false);
  const [vfxEvents, setVfxEvents] = useState<Array<{ type: string; x: number; y: number; value?: number }>>([]);

  const boardRef = useRef<HTMLDivElement>(null);
  const queueTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate player deck
  const playerDeck = useMemo((): DeckCard[] => {
    const choices = gameState.characterChoices;
    const cards = generateStarterDeck({
      species: choices.species || undefined,
      characterClass: choices.characterClass || undefined,
      alignment: choices.alignment || undefined,
      element: choices.element || undefined,
      name: choices.name || undefined,
    });
    return cards.map(c => ({
      cardId: c.id,
      name: c.name,
      type: c.type,
      rarity: c.rarity,
      attack: c.attack,
      defense: c.defense,
      cost: c.cost,
      ability: c.ability,
      imageUrl: c.imageUrl,
    }));
  }, [gameState.characterChoices]);

  // Leaderboard & stats
  const myStats = trpc.pvp.getMyStats.useQuery(undefined, { enabled: isAuthenticated });
  const leaderboard = trpc.pvp.getLeaderboard.useQuery();
  const matchHistory = trpc.pvp.getMatchHistory.useQuery(undefined, { enabled: isAuthenticated });

  // Get my player data from battle state
  const myPlayer = useMemo(() => {
    if (!battleState) return null;
    return mySide === "player1" ? battleState.player1 : battleState.player2;
  }, [battleState, mySide]);

  const enemyPlayer = useMemo(() => {
    if (!battleState) return null;
    return mySide === "player1" ? battleState.player2 : battleState.player1;
  }, [battleState, mySide]);

  const isMyTurn = useMemo(() => {
    if (!battleState || !user) return false;
    return battleState.currentTurn === user.id;
  }, [battleState, user]);

  // WebSocket connection
  const connectWs = useCallback(() => {
    if (!user) return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/pvp`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[PvP] WebSocket connected");
      // Join queue
      socket.send(JSON.stringify({
        type: "JOIN_QUEUE",
        userId: user.id,
        userName: user.name,
        deck: playerDeck,
      }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case "QUEUE_JOINED":
          setPhase("queue");
          setQueuePosition(msg.position);
          break;
        case "QUEUE_UPDATE":
          setQueuePosition(msg.position);
          setPlayersInQueue(msg.playersInQueue);
          break;
        case "MATCH_FOUND":
          setPhase("battle");
          setMySide(msg.yourSide);
          setOpponentName(msg.opponentName);
          setOpponentElo(msg.opponentElo);
          if (audioReady) playSFX("turn_start");
          setTurnBannerText("MATCH FOUND!");
          setShowTurnBanner(true);
          setTimeout(() => setShowTurnBanner(false), 2000);
          break;
        case "GAME_STATE":
          setBattleState(prev => {
            const newState = msg.state as PvpBattleState;
            // Detect turn change
            if (prev && prev.currentTurn !== newState.currentTurn) {
              const isNowMyTurn = newState.currentTurn === user?.id;
              setTurnBannerText(isNowMyTurn ? "YOUR TURN" : "OPPONENT'S TURN");
              setShowTurnBanner(true);
              setTimeout(() => setShowTurnBanner(false), 1200);
              if (audioReady) playSFX(isNowMyTurn ? "turn_start" : "turn_end");
            }
            // Detect attacks (screen shake)
            if (prev) {
              const myP = mySide === "player1" ? newState.player1 : newState.player2;
              const prevMyP = mySide === "player1" ? prev.player1 : prev.player2;
              if (myP.hp < prevMyP.hp) {
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 400);
                if (audioReady) playSFX("card_attack");
              }
            }
            return newState;
          });
          break;
        case "ACTION_RESULT":
          if (!msg.success && msg.error) {
            console.warn("[PvP] Action failed:", msg.error);
          }
          break;
        case "GAME_OVER": {
          const won = msg.winnerId === user?.id;
          setResultData({
            won,
            eloChange: msg.eloChange,
            newElo: msg.newElo,
          });
          setPhase("result");
          if (audioReady) playSFX(won ? "battle_victory" : "battle_defeat");
          break;
        }
        case "OPPONENT_DISCONNECTED":
          setTurnBannerText("OPPONENT DISCONNECTED");
          setShowTurnBanner(true);
          break;
        case "ERROR":
          console.error("[PvP] Error:", msg.message);
          break;
        case "PONG":
          break;
      }
    };

    socket.onclose = () => {
      console.log("[PvP] WebSocket disconnected");
      if (phase === "queue") {
        setPhase("lobby");
      }
    };

    setWs(socket);
    return socket;
  }, [user, playerDeck, audioReady, playSFX, mySide, phase]);

  // Queue timer
  useEffect(() => {
    if (phase === "queue") {
      setQueueTime(0);
      queueTimerRef.current = setInterval(() => {
        setQueueTime(t => t + 1);
      }, 1000);
    } else {
      if (queueTimerRef.current) {
        clearInterval(queueTimerRef.current);
        queueTimerRef.current = null;
      }
    }
    return () => {
      if (queueTimerRef.current) clearInterval(queueTimerRef.current);
    };
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

  // Send action
  const sendAction = useCallback((action: PvpAction) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "GAME_ACTION", action }));
  }, [ws]);

  const handlePlayCard = useCallback((instanceId: string) => {
    if (!isMyTurn) return;
    sendAction({ type: "PLAY_CARD", cardInstanceId: instanceId });
    if (audioReady) playSFX("card_deploy");
  }, [isMyTurn, sendAction, audioReady, playSFX]);

  const handleAttack = useCallback((attackerId: string, targetId: string | "face") => {
    if (!isMyTurn) return;
    sendAction({ type: "ATTACK", attackerInstanceId: attackerId, targetInstanceId: targetId });
    setAttackMode(false);
    setAttackerCard(null);
    if (audioReady) playSFX("card_attack");
  }, [isMyTurn, sendAction, audioReady, playSFX]);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn) return;
    sendAction({ type: "END_TURN" });
    if (audioReady) playSFX("turn_end");
  }, [isMyTurn, sendAction, audioReady, playSFX]);

  const handleSurrender = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "SURRENDER" }));
  }, [ws]);

  const handleLeaveQueue = useCallback(() => {
    if (ws) {
      ws.send(JSON.stringify({ type: "LEAVE_QUEUE" }));
      ws.close();
    }
    setPhase("lobby");
  }, [ws]);

  const handleFindMatch = useCallback(() => {
    if (!audioReady) initAudio();
    connectWs();
  }, [audioReady, initAudio, connectWs]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center space-y-4">
          <Swords size={48} className="text-primary mx-auto" />
          <h1 className="font-display text-2xl font-bold tracking-wider">PVP ARENA</h1>
          <p className="font-mono text-sm text-muted-foreground">Login required to access multiplayer battles</p>
          <a href={getLoginUrl()} className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded font-mono text-sm">
            LOGIN
          </a>
        </div>
      </div>
    );
  }

  /* ═══ LOBBY ═══ */
  if (phase === "lobby") {
    return (
      <div className="min-h-screen grid-bg">
        <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/games" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-2">
                <ArrowLeft size={12} /> BACK TO GAMES
              </Link>
              <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3">
                <Swords className="text-primary" size={28} />
                PVP <span className="text-primary glow-cyan">ARENA</span>
              </h1>
              <p className="font-mono text-sm text-muted-foreground mt-1">Real-time multiplayer card battles</p>
            </div>
            <div className="text-right">
              {myStats.data && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-mono text-xs text-muted-foreground">RANK</span>
                    <span className={`font-display text-lg font-bold ${RANK_CONFIG[myStats.data.rankTier]?.color || "text-foreground"}`}>
                      {RANK_CONFIG[myStats.data.rankTier]?.icon} {RANK_CONFIG[myStats.data.rankTier]?.label || myStats.data.rankTier}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    ELO: <span className="text-primary font-bold">{myStats.data.elo}</span> | 
                    W: <span className="text-green-400">{myStats.data.wins}</span> / 
                    L: <span className="text-red-400">{myStats.data.losses}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Find Match Button */}
          <div className="border border-primary/30 rounded-lg bg-card/60 p-8 text-center box-glow-cyan">
            <Swords size={48} className="text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold tracking-wider mb-2">ENTER THE ARENA</h2>
            <p className="font-mono text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Battle other operatives in real-time card combat. Your deck is generated from your citizen build.
              Win to climb the ranks and earn glory.
            </p>
            <button
              onClick={handleFindMatch}
              className="px-8 py-3 bg-primary/20 border-2 border-primary text-primary font-display text-lg tracking-wider rounded-lg hover:bg-primary/30 hover:box-glow-cyan transition-all"
            >
              ⚔️ FIND MATCH
            </button>
            <p className="font-mono text-[10px] text-muted-foreground/50 mt-3">
              Deck: {playerDeck.length} cards | Based on your citizen class & alignment
            </p>
          </div>

          {/* Stats & Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match History */}
            <div className="border border-border/30 rounded-lg bg-card/40 p-5">
              <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                <Clock size={14} className="text-accent" />
                RECENT MATCHES
              </h3>
              {matchHistory.data && matchHistory.data.length > 0 ? (
                <div className="space-y-2">
                  {matchHistory.data.slice(0, 8).map((match, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded bg-secondary/30 border border-border/20">
                      <div className="flex items-center gap-3">
                        <span className={`font-display text-sm font-bold ${match.won ? "text-green-400" : "text-red-400"}`}>
                          {match.won ? "W" : "L"}
                        </span>
                        <span className="font-mono text-xs">{match.opponentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${match.eloChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {match.eloChange >= 0 ? "+" : ""}{match.eloChange}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          T{match.totalTurns}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted-foreground text-center py-8">No matches yet. Enter the arena!</p>
              )}
            </div>

            {/* Leaderboard */}
            <div className="border border-border/30 rounded-lg bg-card/40 p-5">
              <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                <Trophy size={14} className="text-yellow-400" />
                LEADERBOARD
              </h3>
              {leaderboard.data && leaderboard.data.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.data.slice(0, 10).map((entry, i) => (
                    <div key={entry.id} className={`flex items-center justify-between py-2 px-3 rounded border border-border/20 ${
                      entry.userId === user?.id ? "bg-primary/10 border-primary/30" : "bg-secondary/30"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-display text-sm font-bold w-6 text-center ${
                          i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                        }`}>
                          #{i + 1}
                        </span>
                        <span className="font-mono text-xs">{entry.userName || "Unknown"}</span>
                        <span className={`text-xs ${RANK_CONFIG[entry.rankTier]?.color || ""}`}>
                          {RANK_CONFIG[entry.rankTier]?.icon}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-primary font-bold">{entry.elo}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {entry.wins}W/{entry.losses}L
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted-foreground text-center py-8">No ranked players yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ QUEUE ═══ */
  if (phase === "queue") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full border border-primary/30 rounded-lg bg-card/80 p-8 text-center box-glow-cyan"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-2 border-2 border-accent/30 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
            <div className="absolute inset-4 flex items-center justify-center">
              <Swords size={28} className="text-primary" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold tracking-wider mb-2">SEARCHING FOR OPPONENT</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">
            Queue Position: <span className="text-primary">{queuePosition}</span> | 
            Players: <span className="text-accent">{playersInQueue}</span>
          </p>
          <div className="font-mono text-2xl text-primary font-bold mb-6">
            {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, "0")}
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          <button
            onClick={handleLeaveQueue}
            className="px-6 py-2 border border-border/50 text-muted-foreground font-mono text-sm rounded hover:border-destructive/50 hover:text-destructive transition-colors"
          >
            CANCEL
          </button>
        </motion.div>
      </div>
    );
  }

  /* ═══ RESULT ═══ */
  if (phase === "result" && resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="max-w-md w-full border border-primary/30 rounded-lg bg-card/80 p-8 text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {resultData.won ? (
              <>
                <Crown size={64} className="text-yellow-400 mx-auto mb-4" />
                <h2 className="font-display text-3xl font-black tracking-wider text-yellow-400 mb-2">VICTORY!</h2>
              </>
            ) : (
              <>
                <Skull size={64} className="text-red-400 mx-auto mb-4" />
                <h2 className="font-display text-3xl font-black tracking-wider text-red-400 mb-2">DEFEAT</h2>
              </>
            )}
          </motion.div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="font-mono text-[10px] text-muted-foreground">OPPONENT</p>
                <p className="font-mono text-sm">{opponentName}</p>
              </div>
            </div>

            <div className="border border-border/30 rounded-lg bg-secondary/30 p-4">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="font-mono text-[10px] text-muted-foreground">ELO CHANGE</p>
                  <p className={`font-display text-2xl font-bold ${resultData.eloChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {resultData.eloChange >= 0 ? "+" : ""}{resultData.eloChange}
                  </p>
                </div>
                <div className="w-px h-10 bg-border/30" />
                <div className="text-center">
                  <p className="font-mono text-[10px] text-muted-foreground">NEW RATING</p>
                  <p className="font-display text-2xl font-bold text-primary">{resultData.newElo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setPhase("lobby");
                setResultData(null);
                setBattleState(null);
                myStats.refetch();
                matchHistory.refetch();
                leaderboard.refetch();
              }}
              className="flex-1 px-4 py-2 border border-border/50 text-foreground font-mono text-sm rounded hover:border-primary/50 transition-colors"
            >
              BACK TO LOBBY
            </button>
            <button
              onClick={() => {
                setResultData(null);
                setBattleState(null);
                handleFindMatch();
              }}
              className="flex-1 px-4 py-2 bg-primary/20 border border-primary text-primary font-mono text-sm rounded hover:bg-primary/30 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══ BATTLE ═══ */
  if (!battleState || !myPlayer || !enemyPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen grid-bg relative overflow-hidden ${screenShake ? "animate-screen-shake" : ""}`} ref={boardRef}>
      {/* VFX Layer */}
      <AmbientParticles count={15} color="rgba(51,226,230,0.2)" />

      {/* Turn Banner */}
      <AnimatePresence>
        {showTurnBanner && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className={`px-12 py-4 ${
              turnBannerText.includes("YOUR") ? "bg-primary/90 box-glow-cyan" : "bg-destructive/90"
            } backdrop-blur-sm`}>
              <span className="font-display text-2xl sm:text-4xl font-black tracking-[0.3em] text-white">
                {turnBannerText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOP BAR: Enemy Info ─── */}
      <div className="px-4 py-3 border-b border-border/20 bg-card/30 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center">
            <Skull size={14} className="text-destructive" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold">{enemyPlayer.name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">ELO: {opponentElo}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Enemy HP */}
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-destructive" />
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive transition-all duration-500"
                style={{ width: `${(enemyPlayer.hp / enemyPlayer.maxHP) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-destructive">{enemyPlayer.hp}/{enemyPlayer.maxHP}</span>
          </div>
          {/* Enemy cards/energy */}
          <span className="font-mono text-[10px] text-muted-foreground">
            Hand: {enemyPlayer.hand.length} | Deck: {enemyPlayer.deck.length}
          </span>
        </div>
      </div>

      {/* ─── ENEMY FIELD ─── */}
      <div className="px-4 py-3 min-h-[140px]">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {enemyPlayer.field.map((card) => (
            <motion.div
              key={card.instanceId}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative cursor-pointer ${
                attackMode ? "ring-2 ring-destructive/50 hover:ring-destructive" : ""
              }`}
              onClick={() => {
                if (attackMode && attackerCard) {
                  handleAttack(attackerCard, card.instanceId);
                }
              }}
            >
              <div className="w-20 sm:w-24 rounded border border-border/30 bg-card/60 p-1.5 hover-lift">
                <div className="aspect-[3/4] rounded overflow-hidden mb-1 relative">
                  {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Shield size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="font-mono text-[8px] truncate text-center">{card.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-[9px] text-red-400">⚔{card.attack + card.tempAttackMod}</span>
                  <span className="font-mono text-[9px] text-blue-400">🛡{card.currentHP}</span>
                </div>
                {card.justDeployed && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
          {enemyPlayer.field.length === 0 && (
            <p className="font-mono text-[10px] text-muted-foreground/30 py-8">Enemy field empty</p>
          )}
        </div>
      </div>

      {/* ─── BATTLEFIELD DIVIDER ─── */}
      <div className="relative h-10 flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative px-4 py-1 bg-card/80 border border-primary/30 rounded-full">
          <span className="font-mono text-[10px] text-primary">
            TURN {battleState.turnNumber} — {isMyTurn ? "YOUR MOVE" : "WAITING..."}
          </span>
        </div>
        {/* Attack face buttons */}
        {attackMode && (
          <button
            onClick={() => attackerCard && handleAttack(attackerCard, "face")}
            className="absolute right-4 px-3 py-1 bg-destructive/20 border border-destructive/50 text-destructive font-mono text-[10px] rounded hover:bg-destructive/30 transition-colors animate-pulse"
          >
            ⚔ ATTACK FACE
          </button>
        )}
      </div>

      {/* ─── MY FIELD ─── */}
      <div className="px-4 py-3 min-h-[140px]">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {myPlayer.field.map((card) => (
            <motion.div
              key={card.instanceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative cursor-pointer ${
                !card.hasAttacked && !card.justDeployed && isMyTurn ? "ring-1 ring-green-400/30" : ""
              } ${attackerCard === card.instanceId ? "ring-2 ring-primary" : ""}`}
              onClick={() => {
                if (isMyTurn && !card.hasAttacked && !card.justDeployed) {
                  setAttackMode(true);
                  setAttackerCard(card.instanceId);
                }
              }}
            >
              <div className="w-20 sm:w-24 rounded border border-border/30 bg-card/60 p-1.5 hover-lift">
                <div className="aspect-[3/4] rounded overflow-hidden mb-1 relative">
                  {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Shield size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="font-mono text-[8px] truncate text-center">{card.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-[9px] text-red-400">⚔{card.attack + card.tempAttackMod}</span>
                  <span className="font-mono text-[9px] text-blue-400">🛡{card.currentHP}</span>
                </div>
                {card.justDeployed && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" title="Summoning sickness" />
                )}
                {card.hasAttacked && (
                  <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center">
                    <span className="font-mono text-[8px] text-muted-foreground">EXHAUSTED</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {myPlayer.field.length === 0 && (
            <p className="font-mono text-[10px] text-muted-foreground/30 py-8">Deploy units from your hand</p>
          )}
        </div>
      </div>

      {/* ─── BOTTOM BAR: My Info + Hand ─── */}
      <div className="border-t border-border/20 bg-card/40 backdrop-blur-sm">
        {/* My stats bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Shield size={14} className="text-primary" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold">{myPlayer.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* My HP */}
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-green-400" />
              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${(myPlayer.hp / myPlayer.maxHP) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-green-400">{myPlayer.hp}/{myPlayer.maxHP}</span>
            </div>
            {/* Energy */}
            <div className="flex items-center gap-1">
              {Array.from({ length: myPlayer.maxEnergy }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < myPlayer.energy
                      ? "bg-blue-400 border-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.5)]"
                      : "bg-secondary border-border/30"
                  }`}
                />
              ))}
              <span className="font-mono text-[10px] text-blue-400 ml-1">{myPlayer.energy}/{myPlayer.maxEnergy}</span>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2">
              {attackMode && (
                <button
                  onClick={() => { setAttackMode(false); setAttackerCard(null); }}
                  className="px-3 py-1 border border-border/50 text-muted-foreground font-mono text-[10px] rounded hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
              )}
              <button
                onClick={handleEndTurn}
                disabled={!isMyTurn}
                className={`px-4 py-1.5 rounded font-mono text-xs font-bold transition-all ${
                  isMyTurn
                    ? "bg-accent/20 border border-accent text-accent hover:bg-accent/30"
                    : "bg-secondary border border-border/30 text-muted-foreground cursor-not-allowed"
                }`}
              >
                END TURN
              </button>
              <button
                onClick={handleSurrender}
                className="px-3 py-1.5 border border-destructive/30 text-destructive/60 font-mono text-[10px] rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                SURRENDER
              </button>
            </div>
          </div>
        </div>

        {/* Hand */}
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 justify-center">
            {myPlayer.hand.map((card) => {
              const canPlay = isMyTurn && card.cost <= myPlayer.energy && card.cardId !== "hidden";
              return (
                <motion.div
                  key={card.instanceId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={canPlay ? { y: -10, scale: 1.05 } : {}}
                  className={`relative cursor-pointer ${
                    canPlay ? "hover:z-10" : "opacity-60"
                  } ${selectedCard === card.instanceId ? "ring-2 ring-primary -translate-y-2" : ""}`}
                  onClick={() => {
                    if (canPlay) {
                      if (selectedCard === card.instanceId) {
                        handlePlayCard(card.instanceId);
                        setSelectedCard(null);
                      } else {
                        setSelectedCard(card.instanceId);
                      }
                    }
                  }}
                >
                  <div className="w-16 sm:w-20 rounded border border-border/30 bg-card/80 p-1 hover-lift">
                    <div className="aspect-[3/4] rounded overflow-hidden mb-1">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="font-mono text-lg text-muted-foreground">?</span>
                        </div>
                      )}
                    </div>
                    <p className="font-mono text-[7px] truncate text-center">{card.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono text-[8px] text-red-400">⚔{card.attack}</span>
                      <span className="font-mono text-[8px] text-blue-400 bg-blue-400/10 rounded px-1">{card.cost}⚡</span>
                      <span className="font-mono text-[8px] text-green-400">🛡{card.defense}</span>
                    </div>
                  </div>
                  {selectedCard === card.instanceId && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground font-mono text-[8px] rounded whitespace-nowrap">
                      TAP TO DEPLOY
                    </div>
                  )}
                </motion.div>
              );
            })}
            {myPlayer.hand.length === 0 && (
              <p className="font-mono text-[10px] text-muted-foreground/30 py-4">Hand empty</p>
            )}
          </div>
        </div>
      </div>

      {/* Battle Log (collapsible) */}
      <details className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border/30 max-h-[200px]">
        <summary className="px-4 py-1 font-mono text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
          BATTLE LOG ({battleState.logs.length} entries)
        </summary>
        <div className="px-4 py-2 overflow-y-auto max-h-[160px] space-y-0.5">
          {battleState.logs.slice(-20).map((log, i) => (
            <p key={i} className="font-mono text-[10px] text-muted-foreground">
              <span className="text-primary/50">[T{log.turn}]</span> {log.message}
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}
