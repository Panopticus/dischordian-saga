/* ═══════════════════════════════════════════════════════
   PVP ARENA — Real-time multiplayer card battles
   with Deck Selection, Ranked Seasons, and Spectator Mode
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
  Star, TrendingUp, TrendingDown, Target, Volume2, VolumeX,
  Eye, Layers, Award, CalendarDays, Gift, ChevronDown,
  ChevronUp, Play, Radio, Tv, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ─── RANK CONFIG ─── */
const RANK_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; icon: string; glow?: string }> = {
  bronze:      { color: "text-amber-700",  bg: "bg-amber-700/10",  border: "border-amber-700/30",  label: "Bronze",      icon: "🥉" },
  silver:      { color: "text-gray-400",   bg: "bg-gray-400/10",   border: "border-gray-400/30",   label: "Silver",      icon: "🥈" },
  gold:        { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", label: "Gold",        icon: "🥇", glow: "shadow-[0_0_12px_rgba(250,204,21,0.3)]" },
  platinum:    { color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/30",   label: "Platinum",    icon: "💎", glow: "shadow-[0_0_12px_rgba(34,211,238,0.3)]" },
  diamond:     { color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30",   label: "Diamond",     icon: "💠", glow: "shadow-[0_0_12px_rgba(96,165,250,0.3)]" },
  master:      { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30", label: "Master",      icon: "👑", glow: "shadow-[0_0_16px_rgba(192,132,252,0.4)]" },
  grandmaster: { color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30",    label: "Grandmaster", icon: "🔥", glow: "shadow-[0_0_20px_rgba(248,113,113,0.4)]" },
};

const ELO_THRESHOLDS = [
  { tier: "bronze", min: 0, max: 1199 },
  { tier: "silver", min: 1200, max: 1399 },
  { tier: "gold", min: 1400, max: 1599 },
  { tier: "platinum", min: 1600, max: 1799 },
  { tier: "diamond", min: 1800, max: 1999 },
  { tier: "master", min: 2000, max: 2199 },
  { tier: "grandmaster", min: 2200, max: 9999 },
];

function getEloProgress(elo: number): { tier: string; progress: number; nextTier: string | null } {
  for (let i = 0; i < ELO_THRESHOLDS.length; i++) {
    const t = ELO_THRESHOLDS[i];
    if (elo >= t.min && elo <= t.max) {
      const range = t.max - t.min + 1;
      const progress = ((elo - t.min) / range) * 100;
      const nextTier = i < ELO_THRESHOLDS.length - 1 ? ELO_THRESHOLDS[i + 1].tier : null;
      return { tier: t.tier, progress, nextTier };
    }
  }
  return { tier: "grandmaster", progress: 100, nextTier: null };
}

type Phase = "lobby" | "deck_select" | "queue" | "battle" | "result" | "spectate";
type LobbyTab = "overview" | "season" | "spectate" | "history";

export default function PvpArenaPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();
  const { playSFX, initAudio, audioReady } = useSound();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [lobbyTab, setLobbyTab] = useState<LobbyTab>("overview");
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
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [spectatingMatchId, setSpectatingMatchId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const queueTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate fallback deck from citizen build
  const fallbackDeck = useMemo((): DeckCard[] => {
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

  // Queries
  const myStats = trpc.pvp.getMyStats.useQuery(undefined, { enabled: isAuthenticated });
  const leaderboard = trpc.pvp.getLeaderboard.useQuery();
  const matchHistory = trpc.pvp.getMatchHistory.useQuery(undefined, { enabled: isAuthenticated });
  const myDecks = trpc.pvp.getMyDecks.useQuery(undefined, { enabled: isAuthenticated });
  const activeDeck = trpc.pvp.getActiveDeck.useQuery(undefined, { enabled: isAuthenticated });
  const currentSeason = trpc.pvp.getCurrentSeason.useQuery();
  const mySeasonRecord = trpc.pvp.getMySeasonRecord.useQuery(undefined, { enabled: isAuthenticated });
  const seasonLeaderboard = trpc.pvp.getSeasonLeaderboard.useQuery();
  const activeMatches = trpc.pvp.getActiveMatches.useQuery(undefined, { refetchInterval: phase === "lobby" && lobbyTab === "spectate" ? 5000 : false });
  const allTraitBonuses = trpc.nft.getAllTraitBonuses.useQuery(undefined, { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false });
  const pvpBonuses = allTraitBonuses.data?.pvp;

  const claimRewards = trpc.pvp.claimSeasonRewards.useMutation({
    onSuccess: () => { mySeasonRecord.refetch(); },
  });

  // Resolve which deck to use
  const resolvedDeck = useMemo((): DeckCard[] => {
    if (selectedDeckId && myDecks.data) {
      const deck = myDecks.data.find(d => d.id === selectedDeckId);
      if (deck) {
        // Load card data from season1-cards for the saved deck
        // For now, use the cardIds to build a deck
        return deck.cardIds.map((id: string, i: number) => ({
          cardId: id,
          name: id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          type: "unit" as const,
          rarity: "common" as const,
          attack: 2,
          defense: 2,
          cost: 2,
          ability: "",
          imageUrl: "",
        }));
      }
    }
    return fallbackDeck;
  }, [selectedDeckId, myDecks.data, fallbackDeck]);

  // Battle state helpers
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

  const isSpectating = phase === "spectate";

  // WebSocket connection
  const connectWs = useCallback((mode: "play" | "spectate" = "play", matchId?: string) => {
    if (!user && mode === "play") return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/pvp`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[PvP] WebSocket connected");
      if (mode === "spectate" && matchId) {
        socket.send(JSON.stringify({
          type: "SPECTATE",
          matchId,
          userId: user?.id || 0,
          userName: user?.name || "Spectator",
        }));
      } else {
        socket.send(JSON.stringify({
          type: "JOIN_QUEUE",
          userId: user!.id,
          userName: user!.name,
          deck: resolvedDeck,
          deckId: selectedDeckId,
        }));
      }
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
        case "SPECTATE_JOINED":
          setPhase("spectate");
          setBattleState(msg.state);
          setMySide("player1"); // spectators view from player1 perspective
          setOpponentName(msg.player2Name || "Player 2");
          setOpponentElo(0);
          setTurnBannerText("SPECTATING");
          setShowTurnBanner(true);
          setTimeout(() => setShowTurnBanner(false), 1500);
          break;
        case "GAME_STATE":
          setBattleState(prev => {
            const newState = msg.state as PvpBattleState;
            if (prev && prev.currentTurn !== newState.currentTurn && !isSpectating) {
              const isNowMyTurn = newState.currentTurn === user?.id;
              setTurnBannerText(isNowMyTurn ? "YOUR TURN" : "OPPONENT'S TURN");
              setShowTurnBanner(true);
              setTimeout(() => setShowTurnBanner(false), 1200);
              if (audioReady) playSFX(isNowMyTurn ? "turn_start" : "turn_end");
            }
            if (prev && !isSpectating) {
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
          if (isSpectating) {
            setTurnBannerText("MATCH ENDED");
            setShowTurnBanner(true);
            setTimeout(() => {
              setShowTurnBanner(false);
              setPhase("lobby");
              setLobbyTab("spectate");
              setBattleState(null);
              setSpectatingMatchId(null);
            }, 3000);
          } else {
            const won = msg.winnerId === user?.id;
            setResultData({
              won,
              eloChange: msg.eloChange,
              newElo: msg.newElo,
            });
            setPhase("result");
            if (audioReady) playSFX(won ? "battle_victory" : "battle_defeat");
          }
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
  }, [user, resolvedDeck, selectedDeckId, audioReady, playSFX, mySide, phase, isSpectating]);

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

  // Actions
  const sendAction = useCallback((action: PvpAction) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "GAME_ACTION", action }));
  }, [ws]);

  const handlePlayCard = useCallback((instanceId: string) => {
    if (!isMyTurn || isSpectating) return;
    sendAction({ type: "PLAY_CARD", cardInstanceId: instanceId });
    if (audioReady) playSFX("card_deploy");
  }, [isMyTurn, isSpectating, sendAction, audioReady, playSFX]);

  const handleAttack = useCallback((attackerId: string, targetId: string | "face") => {
    if (!isMyTurn || isSpectating) return;
    sendAction({ type: "ATTACK", attackerInstanceId: attackerId, targetInstanceId: targetId });
    setAttackMode(false);
    setAttackerCard(null);
    if (audioReady) playSFX("card_attack");
  }, [isMyTurn, isSpectating, sendAction, audioReady, playSFX]);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn || isSpectating) return;
    sendAction({ type: "END_TURN" });
    if (audioReady) playSFX("turn_end");
  }, [isMyTurn, isSpectating, sendAction, audioReady, playSFX]);

  const handleSurrender = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN || isSpectating) return;
    ws.send(JSON.stringify({ type: "SURRENDER" }));
  }, [ws, isSpectating]);

  const handleLeaveQueue = useCallback(() => {
    if (ws) {
      ws.send(JSON.stringify({ type: "LEAVE_QUEUE" }));
      ws.close();
    }
    setPhase("lobby");
  }, [ws]);

  const handleFindMatch = useCallback(() => {
    if (!audioReady) initAudio();
    connectWs("play");
  }, [audioReady, initAudio, connectWs]);

  const handleSpectate = useCallback((matchId: string) => {
    if (!audioReady) initAudio();
    setSpectatingMatchId(matchId);
    connectWs("spectate", matchId);
  }, [audioReady, initAudio, connectWs]);

  const handleLeaveSpectate = useCallback(() => {
    if (ws) ws.close();
    setPhase("lobby");
    setLobbyTab("spectate");
    setBattleState(null);
    setSpectatingMatchId(null);
  }, [ws]);

  // ─── NOT AUTHENTICATED ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center space-y-4 border border-primary/30 rounded-lg bg-card/60 p-8 box-glow-cyan">
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

  /* ═══════════════════════════════════════════════════════
     DECK SELECT PHASE
     ═══════════════════════════════════════════════════════ */
  if (phase === "deck_select") {
    const decks = myDecks.data || [];
    const activeId = activeDeck.data?.id;
    return (
      <div className="min-h-screen grid-bg">
        <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto space-y-6">
          <div>
            <button onClick={() => setPhase("lobby")} className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-2">
              <ArrowLeft size={12} /> BACK TO LOBBY
            </button>
            <h1 className="font-display text-2xl font-black tracking-wider flex items-center gap-3">
              <Layers className="text-primary" size={24} />
              SELECT YOUR <span className="text-primary glow-cyan">DECK</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">Choose a deck before entering the queue</p>
          </div>

          {/* Citizen Build Deck (always available) */}
          <div
            onClick={() => { setSelectedDeckId(null); handleFindMatch(); }}
            className={`border rounded-lg p-5 cursor-pointer transition-all hover-lift ${
              !selectedDeckId ? "border-primary/50 bg-primary/5 box-glow-cyan" : "border-border/30 bg-card/40 hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Zap size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider">CITIZEN BUILD DECK</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">Auto-generated from your class, alignment & element</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">{fallbackDeck.length} cards</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Saved Decks */}
          {decks.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <BookOpen size={12} /> SAVED DECKS
              </h2>
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => { setSelectedDeckId(deck.id); handleFindMatch(); }}
                  className={`border rounded-lg p-5 cursor-pointer transition-all hover-lift ${
                    selectedDeckId === deck.id ? "border-accent/50 bg-accent/5" : "border-border/30 bg-card/40 hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
                        deck.faction === "architect" ? "bg-cyan-400/10 border-cyan-400/30" : "bg-amber-400/10 border-amber-400/30"
                      }`}>
                        <Swords size={20} className={deck.faction === "architect" ? "text-cyan-400" : "text-amber-400"} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
                          {deck.name}
                          {deck.id === activeId && (
                            <span className="px-1.5 py-0.5 bg-green-400/10 border border-green-400/30 text-green-400 font-mono text-[8px] rounded">ACTIVE</span>
                          )}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground capitalize">{deck.faction} faction • {deck.cardCount} cards</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Build New Deck CTA */}
          <Link
            href="/deck-builder"
            className="block border border-dashed border-border/40 rounded-lg p-5 text-center hover:border-primary/40 transition-colors group"
          >
            <Layers size={24} className="text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
            <p className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">BUILD A NEW DECK</p>
          </Link>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     LOBBY PHASE
     ═══════════════════════════════════════════════════════ */
  if (phase === "lobby") {
    const myElo = myStats.data?.elo || 1000;
    const eloInfo = getEloProgress(myElo);
    const rankCfg = RANK_CONFIG[eloInfo.tier] || RANK_CONFIG.bronze;
    const season = currentSeason.data;
    const seasonRecord = mySeasonRecord.data;
    const matches = activeMatches.data || [];

    return (
      <div className="min-h-screen grid-bg">
        <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-6">
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
            {/* Rank Badge */}
            {myStats.data && (
              <div className={`border rounded-lg p-4 ${rankCfg.border} ${rankCfg.bg} ${rankCfg.glow || ""}`}>
                <div className="text-center">
                  <span className="text-2xl">{rankCfg.icon}</span>
                  <p className={`font-display text-sm font-bold tracking-wider ${rankCfg.color}`}>{rankCfg.label}</p>
                  <p className="font-mono text-lg font-bold text-foreground">{myElo}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {myStats.data.wins}W / {myStats.data.losses}L
                  </p>
                  {/* ELO Progress Bar */}
                  <div className="mt-2 w-24 mx-auto">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        eloInfo.tier === "bronze" ? "bg-amber-700" :
                        eloInfo.tier === "silver" ? "bg-gray-400" :
                        eloInfo.tier === "gold" ? "bg-yellow-400" :
                        eloInfo.tier === "platinum" ? "bg-cyan-400" :
                        eloInfo.tier === "diamond" ? "bg-blue-400" :
                        eloInfo.tier === "master" ? "bg-purple-400" : "bg-red-400"
                      }`} style={{ width: `${eloInfo.progress}%` }} />
                    </div>
                    {eloInfo.nextTier && (
                      <p className="font-mono text-[8px] text-muted-foreground/50 mt-0.5 text-center">
                        → {RANK_CONFIG[eloInfo.nextTier]?.label}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FIND MATCH CTA */}
          <div className="border border-primary/30 rounded-lg bg-card/60 p-6 text-center box-glow-cyan">
            <Swords size={40} className="text-primary mx-auto mb-3" />
            <h2 className="font-display text-xl font-bold tracking-wider mb-1">ENTER THE ARENA</h2>
            <p className="font-mono text-xs text-muted-foreground mb-4 max-w-md mx-auto">
              Choose your deck and battle other operatives in real-time card combat.
            </p>
            <button
              onClick={() => setPhase("deck_select")}
              className="px-8 py-3 bg-primary/20 border-2 border-primary text-primary font-display text-lg tracking-wider rounded-lg hover:bg-primary/30 hover:box-glow-cyan transition-all"
            >
              ⚔️ FIND MATCH
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-b border-border/20 pb-0">
            {([
              { key: "overview" as LobbyTab, label: "OVERVIEW", icon: Trophy },
              { key: "season" as LobbyTab, label: "SEASON", icon: CalendarDays },
              { key: "spectate" as LobbyTab, label: "SPECTATE", icon: Eye },
              { key: "history" as LobbyTab, label: "HISTORY", icon: Clock },
            ]).map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setLobbyTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 font-mono text-xs tracking-wider transition-colors border-b-2 -mb-px ${
                    lobbyTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ─── OVERVIEW TAB ─── */}
          {lobbyTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leaderboard */}
              <div className="border border-border/30 rounded-lg bg-card/40 p-5">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400" />
                  GLOBAL LEADERBOARD
                </h3>
                {leaderboard.data && leaderboard.data.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.data.slice(0, 10).map((entry, i) => {
                      const rc = RANK_CONFIG[entry.rankTier] || RANK_CONFIG.bronze;
                      return (
                        <div key={entry.id} className={`flex items-center justify-between py-2 px-3 rounded border ${
                          entry.userId === user?.id ? `${rc.border} ${rc.bg}` : "border-border/20 bg-secondary/30"
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`font-display text-sm font-bold w-6 text-center ${
                              i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                            }`}>
                              #{i + 1}
                            </span>
                            <span className="font-mono text-xs">{entry.userName || "Unknown"}</span>
                            <span className={`text-xs ${rc.color}`}>{rc.icon}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-bold ${rc.color}`}>{entry.elo}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {entry.wins}W/{entry.losses}L
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-muted-foreground text-center py-8">No ranked players yet. Be the first!</p>
                )}
              </div>

              {/* My Decks Quick View */}
              <div className="border border-border/30 rounded-lg bg-card/40 p-5">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Layers size={14} className="text-primary" />
                  MY DECKS
                </h3>
                <div className="space-y-2">
                  {/* Citizen deck */}
                  <div className="flex items-center justify-between py-2 px-3 rounded border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-primary" />
                      <span className="font-mono text-xs">Citizen Build</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{fallbackDeck.length} cards</span>
                  </div>
                  {(myDecks.data || []).slice(0, 5).map(deck => (
                    <div key={deck.id} className="flex items-center justify-between py-2 px-3 rounded border border-border/20 bg-secondary/30">
                      <div className="flex items-center gap-2">
                        <Swords size={14} className={deck.faction === "architect" ? "text-cyan-400" : "text-amber-400"} />
                        <span className="font-mono text-xs">{deck.name}</span>
                        {deck.id === activeDeck.data?.id && (
                          <span className="px-1 py-0.5 bg-green-400/10 text-green-400 font-mono text-[7px] rounded">ACTIVE</span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">{deck.cardCount} cards</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/deck-builder"
                  className="block mt-3 text-center font-mono text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  MANAGE DECKS →
                </Link>
              </div>
              {/* RPG Combat Bonuses */}
              {pvpBonuses && pvpBonuses.breakdown.length > 0 && (
                <div className="lg:col-span-2 border border-primary/20 rounded-lg bg-primary/5 p-5">
                  <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-primary" />
                    RPG COMBAT BONUSES
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {pvpBonuses.eloGainMultiplier > 1 && (
                      <div className="border border-green-500/20 bg-green-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-green-400">+{Math.round((pvpBonuses.eloGainMultiplier - 1) * 100)}%</p>
                        <p className="font-mono text-[9px] text-muted-foreground">ELO GAIN</p>
                      </div>
                    )}
                    {pvpBonuses.eloLossReduction > 0 && (
                      <div className="border border-blue-500/20 bg-blue-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-blue-400">-{Math.round(pvpBonuses.eloLossReduction * 100)}%</p>
                        <p className="font-mono text-[9px] text-muted-foreground">ELO LOSS</p>
                      </div>
                    )}
                    {pvpBonuses.startingHandBonus > 0 && (
                      <div className="border border-purple-500/20 bg-purple-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-purple-400">+{pvpBonuses.startingHandBonus}</p>
                        <p className="font-mono text-[9px] text-muted-foreground">STARTING CARDS</p>
                      </div>
                    )}
                    {pvpBonuses.streakMultiplier > 1 && (
                      <div className="border border-amber-500/20 bg-amber-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-amber-400">+{Math.round((pvpBonuses.streakMultiplier - 1) * 100)}%</p>
                        <p className="font-mono text-[9px] text-muted-foreground">STREAK BONUS</p>
                      </div>
                    )}
                    {pvpBonuses.dreamMultiplier > 1 && (
                      <div className="border border-cyan-500/20 bg-cyan-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-cyan-400">+{Math.round((pvpBonuses.dreamMultiplier - 1) * 100)}%</p>
                        <p className="font-mono text-[9px] text-muted-foreground">DREAM TOKENS</p>
                      </div>
                    )}
                    {pvpBonuses.xpMultiplier > 1 && (
                      <div className="border border-yellow-500/20 bg-yellow-500/5 rounded p-2 text-center">
                        <p className="font-display text-lg font-bold text-yellow-400">+{Math.round((pvpBonuses.xpMultiplier - 1) * 100)}%</p>
                        <p className="font-mono text-[9px] text-muted-foreground">XP BONUS</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {pvpBonuses.breakdown.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-primary">▸</span>
                        <span className="text-muted-foreground">{b.source}:</span>
                        <span className="text-foreground">{b.effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── SEASON TAB ─── */}
          {lobbyTab === "season" && (
            <div className="space-y-6">
              {/* Season Banner */}
              {season && (
                <div className="border border-accent/30 rounded-lg bg-gradient-to-r from-accent/5 via-card/40 to-primary/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarDays size={16} className="text-accent" />
                        <span className="font-mono text-[10px] text-accent tracking-wider">RANKED SEASON</span>
                      </div>
                      <h2 className="font-display text-xl font-bold tracking-wider">{season.name}</h2>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        {new Date(season.startsAt).toLocaleDateString()} — {new Date(season.endsAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {season.isActive ? (
                        <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 font-mono text-xs rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-muted/10 border border-border/30 text-muted-foreground font-mono text-xs rounded-full">
                          ENDED
                        </span>
                      )}
                      {season.endsAt && (
                        <p className="font-mono text-[10px] text-muted-foreground mt-1">
                          {Math.max(0, Math.ceil((new Date(season.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* My Season Record */}
              {seasonRecord && (
                <div className="border border-border/30 rounded-lg bg-card/40 p-5">
                  <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Award size={14} className="text-primary" />
                    MY SEASON RECORD
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="font-mono text-[10px] text-muted-foreground">PEAK ELO</p>
                      <p className="font-display text-2xl font-bold text-primary">{seasonRecord.peakElo}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[10px] text-muted-foreground">CURRENT ELO</p>
                      <p className="font-display text-2xl font-bold text-foreground">{seasonRecord.finalElo}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[10px] text-muted-foreground">RECORD</p>
                      <p className="font-display text-lg font-bold">
                        <span className="text-green-400">{seasonRecord.seasonWins}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-red-400">{seasonRecord.seasonLosses}</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[10px] text-muted-foreground">TIER</p>
                      <p className={`font-display text-lg font-bold ${RANK_CONFIG[seasonRecord.peakTier]?.color || ""}`}>
                        {RANK_CONFIG[seasonRecord.peakTier]?.icon} {RANK_CONFIG[seasonRecord.peakTier]?.label || seasonRecord.peakTier}
                      </p>
                    </div>
                  </div>

                  {/* Season Rewards */}
                  {season?.rewards && (
                    <div className="mt-6">
                      <h4 className="font-mono text-[10px] text-muted-foreground tracking-wider mb-3">TIER REWARDS</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {Object.entries(season.rewards as Record<string, { cardPacks: number; title: string; badge: string }>).map(([tier, reward]) => {
                          const rc = RANK_CONFIG[tier] || RANK_CONFIG.bronze;
                          const isMyTierOrBelow = ELO_THRESHOLDS.findIndex(t => t.tier === tier) <= ELO_THRESHOLDS.findIndex(t => t.tier === seasonRecord.peakTier);
                          return (
                            <div key={tier} className={`border rounded-lg p-2 text-center ${
                              isMyTierOrBelow ? `${rc.border} ${rc.bg}` : "border-border/20 bg-secondary/20 opacity-50"
                            }`}>
                              <span className="text-lg">{rc.icon}</span>
                              <p className={`font-mono text-[8px] font-bold ${rc.color}`}>{rc.label}</p>
                              <p className="font-mono text-[8px] text-muted-foreground">{reward.cardPacks} packs</p>
                              <p className="font-mono text-[7px] text-muted-foreground/60 truncate">{reward.title}</p>
                            </div>
                          );
                        })}
                      </div>
                      {!seasonRecord.rewardsClaimed && !season.isActive && (
                        <button
                          onClick={() => claimRewards.mutate({ seasonId: season!.id })}
                          disabled={claimRewards.isPending}
                          className="mt-3 px-6 py-2 bg-accent/20 border border-accent text-accent font-mono text-xs rounded hover:bg-accent/30 transition-colors"
                        >
                          <Gift size={12} className="inline mr-1" />
                          {claimRewards.isPending ? "CLAIMING..." : "CLAIM REWARDS"}
                        </button>
                      )}
                      {seasonRecord.rewardsClaimed && (
                        <p className="mt-3 font-mono text-[10px] text-green-400">✓ Rewards claimed</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Faction War Standings */}
              <div className="border border-purple-500/30 rounded-lg bg-purple-500/5 p-5">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Swords size={14} className="text-purple-400" />
                  FACTION WAR STANDINGS
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground mb-4">
                  PvP victories contribute to your faction's war effort. Higher-ranked players earn bonus faction points.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(gameState.factionReputation).map(([faction, rep]) => {
                    const factionColors: Record<string, { text: string; bg: string; border: string }> = {
                      empire: { text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
                      insurgency: { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
                      independent: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
                      pirate: { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
                    };
                    const fc = factionColors[faction] || factionColors.empire;
                    return (
                      <div key={faction} className={`border ${fc.border} ${fc.bg} rounded-lg p-3 text-center`}>
                        <p className={`font-mono text-[9px] ${fc.text} tracking-wider mb-1`}>{faction.toUpperCase()}</p>
                        <p className={`font-display text-xl font-bold ${fc.text}`}>{rep}</p>
                        <p className="font-mono text-[8px] text-muted-foreground">reputation</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-muted-foreground/60">
                  <Zap size={10} className="text-amber-400" />
                  <span>Ranked wins grant +{myStats.data?.elo && myStats.data.elo >= 1600 ? 3 : myStats.data?.elo && myStats.data.elo >= 1200 ? 2 : 1} faction rep per victory based on your rank tier</span>
                </div>
              </div>

              {/* Season Leaderboard */}
              <div className="border border-border/30 rounded-lg bg-card/40 p-5">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400" />
                  SEASON LEADERBOARD
                </h3>
                {seasonLeaderboard.data && seasonLeaderboard.data.length > 0 ? (
                  <div className="space-y-2">
                    {seasonLeaderboard.data.slice(0, 15).map((entry, i) => {
                      const rc = RANK_CONFIG[entry.peakTier] || RANK_CONFIG.bronze;
                      return (
                        <div key={entry.id} className={`flex items-center justify-between py-2 px-3 rounded border ${
                          entry.userId === user?.id ? `${rc.border} ${rc.bg}` : "border-border/20 bg-secondary/30"
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`font-display text-sm font-bold w-6 text-center ${
                              i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                            }`}>
                              #{i + 1}
                            </span>
                            <span className="font-mono text-xs">Player #{entry.userId}</span>
                            <span className={`text-xs ${rc.color}`}>{rc.icon}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-bold ${rc.color}`}>{entry.peakElo}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {entry.seasonWins}W/{entry.seasonLosses}L
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-muted-foreground text-center py-8">No season data yet. Play ranked matches!</p>
                )}
              </div>
            </div>
          )}

          {/* ─── SPECTATE TAB ─── */}
          {lobbyTab === "spectate" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] flex items-center gap-2">
                  <Eye size={14} className="text-primary" />
                  LIVE MATCHES
                </h3>
                <button
                  onClick={() => activeMatches.refetch()}
                  className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                >
                  REFRESH
                </button>
              </div>
              {matches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matches.map((match) => (
                    <div key={match.matchId} className="border border-border/30 rounded-lg bg-card/40 p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Radio size={10} className="text-red-400 animate-pulse" />
                          <span className="font-mono text-[10px] text-red-400">LIVE</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">Turn {match.totalTurns}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center flex-1">
                          <p className="font-mono text-xs font-bold">{match.player1Name}</p>
                          <p className="font-mono text-[10px] text-primary">{match.player1Elo} ELO</p>
                        </div>
                        <div className="px-3">
                          <Swords size={16} className="text-muted-foreground" />
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-mono text-xs font-bold">{match.player2Name}</p>
                          <p className="font-mono text-[10px] text-primary">{match.player2Elo} ELO</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSpectate(match.matchId)}
                        className="w-full px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-mono text-xs rounded hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={12} /> WATCH LIVE
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border/30 rounded-lg bg-card/40 p-12 text-center">
                  <Tv size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-mono text-sm text-muted-foreground">No live matches right now</p>
                  <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">Matches appear here when two players are battling</p>
                </div>
              )}
            </div>
          )}

          {/* ─── HISTORY TAB ─── */}
          {lobbyTab === "history" && (
            <div className="border border-border/30 rounded-lg bg-card/40 p-5">
              <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                <Clock size={14} className="text-accent" />
                MATCH HISTORY
              </h3>
              {matchHistory.data && matchHistory.data.length > 0 ? (
                <div className="space-y-2">
                  {matchHistory.data.map((match, i) => (
                    <div key={i} className={`flex items-center justify-between py-3 px-4 rounded border ${
                      match.won ? "border-green-400/20 bg-green-400/5" : "border-red-400/20 bg-red-400/5"
                    }`}>
                      <div className="flex items-center gap-4">
                        <span className={`font-display text-lg font-bold ${match.won ? "text-green-400" : "text-red-400"}`}>
                          {match.won ? "W" : "L"}
                        </span>
                        <div>
                          <p className="font-mono text-xs font-bold">vs {match.opponentName}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {match.totalTurns} turns • {match.endedAt ? new Date(match.endedAt).toLocaleDateString() : "In progress"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-sm font-bold ${match.eloChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {match.eloChange >= 0 ? "+" : ""}{match.eloChange}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">ELO</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted-foreground text-center py-8">No matches yet. Enter the arena!</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     QUEUE PHASE
     ═══════════════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════════════
     RESULT PHASE
     ═══════════════════════════════════════════════════════ */
  if (phase === "result" && resultData) {
    const newEloInfo = getEloProgress(resultData.newElo);
    const newRankCfg = RANK_CONFIG[newEloInfo.tier] || RANK_CONFIG.bronze;
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="max-w-md w-full border border-primary/30 rounded-lg bg-card/80 p-8 text-center"
        >
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
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
                  <p className={`font-display text-2xl font-bold ${newRankCfg.color}`}>
                    {newRankCfg.icon} {resultData.newElo}
                  </p>
                </div>
              </div>
              {/* Rank progress */}
              <div className="mt-3">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      newEloInfo.tier === "bronze" ? "bg-amber-700" :
                      newEloInfo.tier === "silver" ? "bg-gray-400" :
                      newEloInfo.tier === "gold" ? "bg-yellow-400" :
                      newEloInfo.tier === "platinum" ? "bg-cyan-400" :
                      newEloInfo.tier === "diamond" ? "bg-blue-400" :
                      newEloInfo.tier === "master" ? "bg-purple-400" : "bg-red-400"
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${newEloInfo.progress}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
                <p className={`font-mono text-[10px] mt-1 ${newRankCfg.color}`}>
                  {newRankCfg.label}
                  {newEloInfo.nextTier && ` → ${RANK_CONFIG[newEloInfo.nextTier]?.label}`}
                </p>
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
                mySeasonRecord.refetch();
                seasonLeaderboard.refetch();
              }}
              className="flex-1 px-4 py-2 border border-border/50 text-foreground font-mono text-sm rounded hover:border-primary/50 transition-colors"
            >
              BACK TO LOBBY
            </button>
            <button
              onClick={() => {
                setResultData(null);
                setBattleState(null);
                setPhase("deck_select");
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

  /* ═══════════════════════════════════════════════════════
     BATTLE / SPECTATE PHASE
     ═══════════════════════════════════════════════════════ */
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

      {/* Spectator Banner */}
      {isSpectating && (
        <div className="fixed top-0 inset-x-0 z-50 bg-primary/90 backdrop-blur-sm px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-primary-foreground" />
            <span className="font-mono text-xs text-primary-foreground tracking-wider">SPECTATING</span>
          </div>
          <button
            onClick={handleLeaveSpectate}
            className="px-3 py-1 bg-primary-foreground/20 text-primary-foreground font-mono text-[10px] rounded hover:bg-primary-foreground/30 transition-colors"
          >
            LEAVE
          </button>
        </div>
      )}

      {/* Turn Banner */}
      <AnimatePresence>
        {showTurnBanner && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className={`fixed inset-x-0 ${isSpectating ? "top-[calc(50%+16px)]" : "top-1/2"} -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none`}
          >
            <div className={`px-12 py-4 ${
              turnBannerText.includes("YOUR") ? "bg-primary/90 box-glow-cyan" :
              turnBannerText === "SPECTATING" ? "bg-primary/90" :
              turnBannerText === "MATCH ENDED" ? "bg-accent/90" :
              "bg-destructive/90"
            } backdrop-blur-sm`}>
              <span className="font-display text-2xl sm:text-4xl font-black tracking-[0.3em] text-white">
                {turnBannerText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOP BAR: Enemy Info ─── */}
      <div className={`px-4 py-3 border-b border-border/20 bg-card/30 backdrop-blur-sm flex items-center justify-between ${isSpectating ? "mt-8" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center">
            <Skull size={14} className="text-destructive" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold">{isSpectating ? "Player 2" : enemyPlayer.name}</p>
            {!isSpectating && <p className="font-mono text-[10px] text-muted-foreground">ELO: {opponentElo}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
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
              className={`relative ${!isSpectating && attackMode ? "cursor-pointer ring-2 ring-destructive/50 hover:ring-destructive" : ""}`}
              onClick={() => {
                if (!isSpectating && attackMode && attackerCard) {
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
            <p className="font-mono text-[10px] text-muted-foreground/30 py-8">
              {isSpectating ? "Player 2 field empty" : "Enemy field empty"}
            </p>
          )}
        </div>
      </div>

      {/* ─── BATTLEFIELD DIVIDER ─── */}
      <div className="relative h-10 flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative px-4 py-1 bg-card/80 border border-primary/30 rounded-full">
          <span className="font-mono text-[10px] text-primary">
            TURN {battleState.turnNumber} — {isSpectating ? "SPECTATING" : isMyTurn ? "YOUR MOVE" : "WAITING..."}
          </span>
        </div>
        {!isSpectating && attackMode && (
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
              className={`relative ${!isSpectating ? "cursor-pointer" : ""} ${
                !isSpectating && !card.hasAttacked && !card.justDeployed && isMyTurn ? "ring-1 ring-green-400/30" : ""
              } ${attackerCard === card.instanceId ? "ring-2 ring-primary" : ""}`}
              onClick={() => {
                if (!isSpectating && isMyTurn && !card.hasAttacked && !card.justDeployed) {
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
                  <div className="absolute inset-0 bg-muted/50 rounded flex items-center justify-center">
                    <span className="font-mono text-[8px] text-muted-foreground">EXHAUSTED</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {myPlayer.field.length === 0 && (
            <p className="font-mono text-[10px] text-muted-foreground/30 py-8">
              {isSpectating ? "Player 1 field empty" : "Deploy units from your hand"}
            </p>
          )}
        </div>
      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="border-t border-border/20 bg-card/40 backdrop-blur-sm">
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Shield size={14} className="text-primary" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold">{isSpectating ? "Player 1" : myPlayer.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
            {!isSpectating && (
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
            )}
            {isSpectating && (
              <button
                onClick={handleLeaveSpectate}
                className="px-4 py-1.5 border border-border/50 text-muted-foreground font-mono text-xs rounded hover:border-primary/50 hover:text-foreground transition-colors"
              >
                LEAVE
              </button>
            )}
          </div>
        </div>

        {/* Hand */}
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 justify-center">
            {myPlayer.hand.map((card) => {
              const canPlay = !isSpectating && isMyTurn && card.cost <= myPlayer.energy && card.cardId !== "hidden";
              return (
                <motion.div
                  key={card.instanceId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={canPlay ? { y: -10, scale: 1.05 } : {}}
                  className={`relative ${canPlay ? "cursor-pointer hover:z-10" : "opacity-60"} ${
                    selectedCard === card.instanceId ? "ring-2 ring-primary -translate-y-2" : ""
                  }`}
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

      {/* Battle Log */}
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
