import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GameCard from "@/components/GameCard";
import { Link } from "wouter";
import {
  ChevronLeft, Swords, Shield, Zap, Heart, Crown,
  RotateCcw, Play, Eye, X, ChevronRight, Flame,
  Sparkles, Trophy, Target, Crosshair, Layers,
  SkipForward, Volume2, VolumeX
} from "lucide-react";
import { getLoginUrl } from "@/const";
import {
  BattleState, BattleCard, Faction, Lane, AIDifficulty,
  createBattle, deployCard, drawCards, resolveCombat,
  endTurn, runAITurn, canDeploy, getMatchRewards,
  cardToBattleCard, CombatEvent
} from "@/game/CardBattleEngine";

// ── Faction Data ──
const FACTIONS = {
  architect: {
    name: "The Architect",
    subtitle: "ORDER",
    quote: "I built this reality. I will reshape it.",
    bonus: "+2 ATK to all units",
    passive: "Blueprint — First card each turn costs 1 less",
    winCon: "Destroy opponent's Influence",
    color: "cyan",
    bgClass: "from-cyan-950/40 via-background to-background",
    borderClass: "border-cyan-500/40",
    glowClass: "shadow-[0_0_40px_rgba(34,211,238,0.15)]",
    textClass: "text-cyan-400",
    icon: "⚙",
  },
  dreamer: {
    name: "The Dreamer",
    subtitle: "CHAOS",
    quote: "Reality is what I dream it to be.",
    bonus: "+2 HP to all units",
    passive: "Lucid Vision — Draw 2 cards per turn instead of 1",
    winCon: "Survive 15 turns OR destroy Influence",
    color: "amber",
    bgClass: "from-amber-950/40 via-background to-background",
    borderClass: "border-amber-500/40",
    glowClass: "shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    textClass: "text-amber-400",
    icon: "✦",
  },
};

const DIFFICULTIES: { id: AIDifficulty; name: string; desc: string; color: string }[] = [
  { id: "recruit", name: "Recruit", desc: "Random plays, no strategy", color: "text-green-400" },
  { id: "operative", name: "Operative", desc: "Basic lane awareness", color: "text-blue-400" },
  { id: "commander", name: "Commander", desc: "Element counters, combos", color: "text-purple-400" },
  { id: "archon", name: "Archon", desc: "Full strategic mastery", color: "text-red-400" },
];

const LANE_NAMES: Record<Lane, { name: string; icon: any; desc: string }> = {
  vanguard: { name: "VANGUARD", icon: Swords, desc: "Melee • +1 ATK" },
  core: { name: "CORE", icon: Target, desc: "Ranged • Flexible" },
  flank: { name: "FLANK", icon: Crosshair, desc: "Siege • +1 Influence DMG" },
};

type GameScreen = "menu" | "factionSelect" | "difficultySelect" | "playing" | "result";

export default function CardGamePage() {
  const { user, isAuthenticated } = useAuth();
  const [screen, setScreen] = useState<GameScreen>("menu");
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>("operative");
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [targetLane, setTargetLane] = useState<Lane | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showCardZoom, setShowCardZoom] = useState<BattleCard | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [recentEvents, setRecentEvents] = useState<CombatEvent[]>([]);
  const [combatAnimating, setCombatAnimating] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const prevEventCount = useRef(0);

  // Fetch cards for deck building
  const { data: allCards } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 200,
    cardType: "character",
    sortBy: "power",
    sortDir: "desc",
  });

  // Track new events for animation
  useEffect(() => {
    if (battle && battle.events.length > prevEventCount.current) {
      const newEvents = battle.events.slice(prevEventCount.current);
      setRecentEvents(newEvents);
      prevEventCount.current = battle.events.length;
      // Clear after animation
      const timer = setTimeout(() => setRecentEvents([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [battle?.events.length]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battle?.events.length]);

  // Start game
  const startGame = useCallback(() => {
    if (!allCards?.cards || !selectedFaction) return;

    const available = allCards.cards.filter(c => c.power > 0 && c.health > 0);
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    const playerCards = shuffled.slice(0, 25).map(c => cardToBattleCard(c));
    const opponentCards = shuffled.slice(25, 50).map(c => cardToBattleCard(c));

    const state = createBattle(playerCards, opponentCards, selectedFaction, selectedDifficulty);
    // Draw initial hand
    const withDraw = drawCards(state, "player", selectedFaction === "dreamer" ? 2 : 1);
    setBattle(withDraw);
    prevEventCount.current = withDraw.events.length;
    setScreen("playing");
  }, [allCards, selectedFaction, selectedDifficulty]);

  // Deploy card to lane
  const handleDeploy = useCallback((lane: Lane) => {
    if (!battle || !selectedCard || battle.activePlayer !== "player") return;
    if (!canDeploy(battle, selectedCard, lane)) return;

    const newState = deployCard(battle, selectedCard, lane, "player");
    setBattle(newState);
    setSelectedCard(null);
  }, [battle, selectedCard]);

  // End player turn → combat → AI turn
  const handleEndTurn = useCallback(() => {
    if (!battle || battle.activePlayer !== "player" || isAIThinking) return;

    setCombatAnimating(true);

    // Combat phase
    setTimeout(() => {
      let s = resolveCombat(battle);
      setBattle(s);

      // Check if game ended
      if (s.winner) {
        setCombatAnimating(false);
        setTimeout(() => setScreen("result"), 1500);
        return;
      }

      // End turn → switch to opponent
      setTimeout(() => {
        s = endTurn(s);
        setBattle(s);
        setCombatAnimating(false);

        if (s.winner) {
          setTimeout(() => setScreen("result"), 1500);
          return;
        }

        // AI turn
        setIsAIThinking(true);
        setTimeout(() => {
          const aiState = runAITurn(s);
          setBattle(aiState);
          setIsAIThinking(false);

          if (aiState.winner) {
            setTimeout(() => setScreen("result"), 1500);
          }
        }, 1200);
      }, 800);
    }, 600);
  }, [battle, isAIThinking]);

  // ═══ MENU SCREEN ═══
  if (screen === "menu") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <Swords size={16} className="text-primary" />
                <span className="font-display text-xs tracking-[0.3em] text-primary">AAA CARD BATTLE</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-3xl sm:text-4xl font-black tracking-wider text-foreground mb-3"
            >
              THE <span className="text-primary glow-cyan">DISCHORDIAN</span> STRUGGLE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs text-muted-foreground max-w-md mx-auto"
            >
              Choose your faction. Command your forces across three lanes of battle.
              Destroy your enemy's Influence — or outlast them as the Dreamer.
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {isAuthenticated ? (
              <button
                onClick={() => setScreen("factionSelect")}
                className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Swords size={18} />
                  <div className="text-left">
                    <p className="font-display text-sm tracking-wider">ENTER THE STRUGGLE</p>
                    <p className="text-[10px] text-primary/60">Choose faction → Difficulty → Battle</p>
                  </div>
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <a
                href={getLoginUrl()}
                className="w-full flex items-center justify-center px-5 py-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
              >
                LOGIN TO PLAY
              </a>
            )}

            <Link
              href="/deck-builder"
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-mono text-sm hover:bg-secondary/80 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-accent" />
                <div className="text-left">
                  <p className="font-display text-sm tracking-wider">DECK BUILDER</p>
                  <p className="text-[10px] text-muted-foreground">Manage your card decks</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/cards"
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-mono text-sm hover:bg-secondary/80 hover:border-accent/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-purple-400" />
                <div className="text-left">
                  <p className="font-display text-sm tracking-wider">CARD DATABASE</p>
                  <p className="text-[10px] text-muted-foreground">Browse all 3000 cards</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <ChevronLeft size={14} className="mr-1" />
              BACK TO LOREDEX
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ═══ FACTION SELECT ═══
  if (screen === "factionSelect") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl w-full"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-xl font-black tracking-[0.2em] text-foreground mb-2">
              CHOOSE YOUR FACTION
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Two philosophies. Two strategies. One battlefield.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {(["architect", "dreamer"] as Faction[]).map((faction, i) => {
              const f = FACTIONS[faction];
              const isSelected = selectedFaction === faction;
              return (
                <motion.button
                  key={faction}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  onClick={() => setSelectedFaction(faction)}
                  className={`relative text-left p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? `${f.borderClass} ${f.glowClass} bg-gradient-to-br ${f.bgClass}`
                      : "border-border/30 bg-card/30 hover:border-border/60"
                  }`}
                >
                  {/* Background icon */}
                  <div className="absolute top-3 right-3 text-4xl opacity-10">{f.icon}</div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`font-display text-2xl ${isSelected ? f.textClass : "text-muted-foreground"}`}>
                        {f.icon}
                      </span>
                      <div>
                        <p className={`font-display text-lg font-black tracking-wider ${isSelected ? f.textClass : "text-foreground"}`}>
                          {f.name}
                        </p>
                        <p className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">{f.subtitle}</p>
                      </div>
                    </div>

                    <p className="font-mono text-xs text-foreground/70 italic mb-3">"{f.quote}"</p>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Swords size={12} className={isSelected ? f.textClass : "text-muted-foreground"} />
                        <span className="font-mono text-[10px] text-foreground/80">{f.bonus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={12} className={isSelected ? f.textClass : "text-muted-foreground"} />
                        <span className="font-mono text-[10px] text-foreground/80">{f.passive}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy size={12} className={isSelected ? f.textClass : "text-muted-foreground"} />
                        <span className="font-mono text-[10px] text-foreground/80">{f.winCon}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="faction-check"
                      className={`absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center ${
                        faction === "architect" ? "bg-cyan-500/20 border border-cyan-500/60" : "bg-amber-500/20 border border-amber-500/60"
                      }`}
                    >
                      <span className="text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setScreen("menu")}
              className="px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <ChevronLeft size={14} className="inline mr-1" />
              BACK
            </button>
            <button
              onClick={() => selectedFaction && setScreen("difficultySelect")}
              disabled={!selectedFaction}
              className={`flex-1 px-5 py-3 rounded-lg font-mono text-sm transition-all ${
                selectedFaction
                  ? "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20"
                  : "bg-secondary/20 border border-border/10 text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              SELECT DIFFICULTY →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ DIFFICULTY SELECT ═══
  if (screen === "difficultySelect") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-xl font-black tracking-[0.2em] text-foreground mb-2">
              SELECT DIFFICULTY
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Playing as {FACTIONS[selectedFaction!].name}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {DIFFICULTIES.map((diff, i) => (
              <motion.button
                key={diff.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                  selectedDifficulty === diff.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/20 bg-card/20 hover:border-border/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    selectedDifficulty === diff.id ? "border-primary/40 bg-primary/10" : "border-border/30 bg-secondary/30"
                  }`}>
                    <span className={`font-display text-xs font-bold ${diff.color}`}>
                      {diff.id === "recruit" ? "I" : diff.id === "operative" ? "II" : diff.id === "commander" ? "III" : "IV"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={`font-display text-sm tracking-wider ${selectedDifficulty === diff.id ? "text-foreground" : "text-foreground/80"}`}>
                      {diff.name.toUpperCase()}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground">{diff.desc}</p>
                  </div>
                </div>
                {selectedDifficulty === diff.id && (
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setScreen("factionSelect")}
              className="px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <ChevronLeft size={14} className="inline mr-1" />
              BACK
            </button>
            <button
              onClick={startGame}
              className="flex-1 px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all"
            >
              <Play size={14} className="inline mr-2" />
              BEGIN BATTLE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ RESULT SCREEN ═══
  if (screen === "result" && battle) {
    const isWin = battle.winner === "player";
    const rewards = getMatchRewards(battle);
    const f = FACTIONS[battle.player.faction];

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {isWin ? (
              <Trophy size={56} className="mx-auto text-amber-400 mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
            ) : (
              <Flame size={56} className="mx-auto text-destructive mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
            )}
            <h2 className={`font-display text-3xl font-black tracking-wider mb-1 ${
              isWin ? "text-amber-400" : "text-destructive"
            }`}>
              {isWin ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="font-mono text-xs text-muted-foreground mb-1">
              {battle.winReason}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/60 mb-6">
              Playing as {f.name} vs {FACTIONS[battle.opponent.faction].name}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="rounded-lg bg-card/50 border border-border/20 p-2">
              <p className="font-display text-lg font-bold text-primary">{battle.turn}</p>
              <p className="font-mono text-[8px] text-muted-foreground">TURNS</p>
            </div>
            <div className="rounded-lg bg-card/50 border border-border/20 p-2">
              <p className="font-display text-lg font-bold text-green-400">{battle.player.influence}</p>
              <p className="font-mono text-[8px] text-muted-foreground">INFLUENCE</p>
            </div>
            <div className="rounded-lg bg-card/50 border border-border/20 p-2">
              <p className="font-display text-lg font-bold text-destructive">{battle.opponent.graveyard.length}</p>
              <p className="font-mono text-[8px] text-muted-foreground">DESTROYED</p>
            </div>
            <div className="rounded-lg bg-card/50 border border-border/20 p-2">
              <p className="font-display text-lg font-bold text-accent">{battle.player.graveyard.length}</p>
              <p className="font-mono text-[8px] text-muted-foreground">LOST</p>
            </div>
          </div>

          {/* Rewards */}
          <div className="rounded-lg bg-card/30 border border-border/20 p-4 mb-6">
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-3">REWARDS</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                <span className="font-mono text-sm text-foreground">{rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                <span className="font-mono text-sm text-foreground">{rewards.credits} Credits</span>
              </div>
              {rewards.boosters > 0 && (
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  <span className="font-mono text-sm text-foreground">{rewards.boosters} Booster{rewards.boosters > 1 ? "s" : ""}</span>
                </div>
              )}
              {rewards.dreamDrops > 0 && (
                <div className="flex items-center gap-2">
                  <Crown size={14} className="text-pink-400" />
                  <span className="font-mono text-sm text-foreground">{rewards.dreamDrops} Dream</span>
                </div>
              )}
            </div>
            {rewards.achievement && (
              <div className="mt-3 pt-3 border-t border-border/20">
                <p className="font-display text-xs text-amber-400 tracking-wider">
                  🏆 {rewards.achievement}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => { setScreen("factionSelect"); setBattle(null); }}
              className="w-full px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
            >
              <RotateCcw size={14} className="inline mr-2" />
              PLAY AGAIN
            </button>
            <Link
              href="/"
              className="block w-full px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all text-center"
            >
              RETURN TO LOREDEX
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ GAME BOARD ═══
  if (!battle) return null;

  const pFaction = FACTIONS[battle.player.faction];
  const oFaction = FACTIONS[battle.opponent.faction];
  const isPlayerTurn = battle.activePlayer === "player" && !isAIThinking && !combatAnimating;
  const handCard = selectedCard ? battle.player.hand.find(c => c.uid === selectedCard) : null;

  const renderLane = (lane: Lane, who: "player" | "opponent") => {
    const cards = battle[who].lanes[lane];
    const laneInfo = LANE_NAMES[lane];
    const LaneIcon = laneInfo.icon;
    const isDropTarget = who === "player" && selectedCard && handCard;

    return (
      <div
        className={`relative flex-1 rounded-lg border transition-all min-h-[90px] ${
          isDropTarget && canDeploy(battle, selectedCard!, lane)
            ? "border-primary/50 bg-primary/5 cursor-pointer"
            : "border-border/15 bg-card/10"
        }`}
        onClick={() => isDropTarget && handleDeploy(lane)}
      >
        {/* Lane label */}
        <div className="absolute top-1 left-2 flex items-center gap-1 opacity-40">
          <LaneIcon size={9} />
          <span className="font-mono text-[7px] tracking-wider">{laneInfo.name}</span>
        </div>

        {/* Cards in lane */}
        <div className="flex gap-1.5 p-1.5 pt-4 justify-center items-end flex-wrap">
          {cards.length === 0 ? (
            <div className="flex items-center justify-center py-2 w-full">
              <span className="font-mono text-[8px] text-muted-foreground/20">
                {isDropTarget ? "DROP HERE" : "Empty"}
              </span>
            </div>
          ) : (
            cards.map((card) => (
              <motion.div
                key={card.uid}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative"
                onClick={(e) => { e.stopPropagation(); setShowCardZoom(card); }}
              >
                {/* Mini card representation */}
                <div className={`
                  w-16 h-22 rounded-md border overflow-hidden cursor-pointer transition-all
                  ${card.isExhausted ? "opacity-50 grayscale-[40%]" : "hover:scale-105"}
                  ${card.keywords.includes("stealth") && card.stealthTurns > 0 ? "opacity-40" : ""}
                  ${card.shieldActive ? "ring-1 ring-blue-400/50" : ""}
                  ${card.rarity === "legendary" || card.rarity === "mythic" ? "border-amber-500/40" : "border-border/30"}
                `}>
                  {/* Card image or placeholder */}
                  <div className="h-10 bg-secondary/30 overflow-hidden">
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Swords size={10} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  {/* Name */}
                  <div className="px-1 py-0.5">
                    <p className="font-mono text-[6px] truncate text-foreground/80">{card.name}</p>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center justify-between px-1 pb-0.5">
                    <div className="flex items-center gap-0.5">
                      <Swords size={7} className="text-destructive" />
                      <span className="font-display text-[8px] font-bold text-destructive">{card.currentPower}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Heart size={7} className="text-green-400" />
                      <span className="font-display text-[8px] font-bold text-green-400">{card.currentHealth}</span>
                    </div>
                  </div>
                  {/* Health bar */}
                  <div className="h-0.5 bg-secondary/50">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${(card.currentHealth / card.baseHealth) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Keywords indicator */}
                {card.keywords.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex gap-0.5">
                    {card.keywords.includes("taunt") && <span className="text-[8px]" title="Taunt">🛡</span>}
                    {card.keywords.includes("stealth") && card.stealthTurns > 0 && <span className="text-[8px]" title="Stealth">👁</span>}
                    {card.keywords.includes("drain") && <span className="text-[8px]" title="Drain">🩸</span>}
                    {card.keywords.includes("shield") && card.shieldActive && <span className="text-[8px]" title="Shield">💠</span>}
                    {card.keywords.includes("evolve") && !card.evolved && <span className="text-[8px]" title={`Evolve in ${card.evolveTurns}`}>⬆</span>}
                    {card.evolved && <span className="text-[8px]" title="Evolved">⭐</span>}
                  </div>
                )}

                {card.isExhausted && (
                  <div className="absolute bottom-0 left-0 right-0 bg-muted/60 text-center">
                    <span className="font-mono text-[6px] text-muted-foreground">TAPPED</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Top Bar: Opponent Info ── */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${oFaction.borderClass} bg-card/30`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${oFaction.borderClass} bg-card/50`}>
            <span className="text-sm">{oFaction.icon}</span>
          </div>
          <div>
            <p className={`font-mono text-[10px] font-bold ${oFaction.textClass}`}>
              {oFaction.name.toUpperCase()} {isAIThinking && <span className="animate-pulse">// THINKING...</span>}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground">
              Hand: {battle.opponent.hand.length} | Deck: {battle.opponent.deck.length} | Grave: {battle.opponent.graveyard.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Opponent Influence */}
          <div className="flex items-center gap-1.5">
            <Shield size={12} className={oFaction.textClass} />
            <div className="w-20 h-2 rounded-full bg-secondary/30 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  battle.opponent.faction === "architect" ? "bg-cyan-500" : "bg-amber-500"
                }`}
                style={{ width: `${(battle.opponent.influence / battle.opponent.maxInfluence) * 100}%` }}
              />
            </div>
            <span className={`font-display text-xs font-bold ${oFaction.textClass}`}>
              {battle.opponent.influence}
            </span>
          </div>
          {/* Energy */}
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-amber-400" />
            <span className="font-display text-xs font-bold text-amber-400">{battle.opponent.energy}</span>
          </div>
          {/* Turn counter */}
          <div className="px-2 py-1 rounded bg-secondary/50 border border-border/20">
            <span className="font-mono text-[9px] text-muted-foreground">T{battle.turn}/{battle.maxTurns}</span>
          </div>
          <button
            onClick={() => setShowLog(!showLog)}
            className="p-1.5 rounded bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary transition-colors"
          >
            <Eye size={12} />
          </button>
        </div>
      </div>

      {/* ── Battlefield ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponent lanes */}
        <div className="flex-1 flex gap-2 px-3 py-2">
          {(["vanguard", "core", "flank"] as Lane[]).map(lane => (
            <div key={`opp-${lane}`} className="flex-1">
              {renderLane(lane, "opponent")}
            </div>
          ))}
        </div>

        {/* Center divider */}
        <div className="flex items-center justify-center gap-3 py-1.5 bg-card/20 border-y border-border/10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/30" />
          <div className="flex items-center gap-2">
            {combatAnimating && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/15 border border-destructive/30"
              >
                <Swords size={10} className="text-destructive animate-pulse" />
                <span className="font-mono text-[9px] text-destructive font-bold">COMBAT</span>
              </motion.div>
            )}
            <span className={`px-2 py-1 rounded font-mono text-[9px] font-bold ${
              isPlayerTurn
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-muted/30 text-muted-foreground border border-border/20"
            }`}>
              {isAIThinking ? "OPPONENT'S TURN" : combatAnimating ? "RESOLVING" : isPlayerTurn ? "YOUR TURN" : "WAITING"}
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/30" />
        </div>

        {/* Player lanes */}
        <div className="flex-1 flex gap-2 px-3 py-2">
          {(["vanguard", "core", "flank"] as Lane[]).map(lane => (
            <div key={`plr-${lane}`} className="flex-1">
              {renderLane(lane, "player")}
            </div>
          ))}
        </div>
      </div>

      {/* ── Player Hand & Controls ── */}
      <div className={`border-t ${pFaction.borderClass} bg-card/40`}>
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${pFaction.borderClass} bg-card/50`}>
              <span className="text-sm">{pFaction.icon}</span>
            </div>
            <div>
              <p className={`font-mono text-[10px] font-bold ${pFaction.textClass}`}>
                {user?.name || "YOU"} — {pFaction.name.toUpperCase()}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                Deck: {battle.player.deck.length} | Grave: {battle.player.graveyard.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Player Influence */}
            <div className="flex items-center gap-1.5">
              <Shield size={12} className={pFaction.textClass} />
              <div className="w-20 h-2 rounded-full bg-secondary/30 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    battle.player.faction === "architect" ? "bg-cyan-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${(battle.player.influence / battle.player.maxInfluence) * 100}%` }}
                />
              </div>
              <span className={`font-display text-xs font-bold ${pFaction.textClass}`}>
                {battle.player.influence}
              </span>
            </div>
            {/* Energy */}
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span className="font-display text-sm font-bold text-amber-400">{battle.player.energy}</span>
            </div>
            {/* End Turn */}
            {isPlayerTurn && (
              <button
                onClick={handleEndTurn}
                className="px-3 py-1.5 rounded-md bg-accent/10 border border-accent/40 font-mono text-[10px] text-accent hover:bg-accent/20 transition-all"
              >
                END TURN →
              </button>
            )}
          </div>
        </div>

        {/* Hand cards */}
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto">
          <AnimatePresence>
            {battle.player.hand.map((card, i) => {
              const isSelected_ = selectedCard === card.uid;
              const canPlay = isPlayerTurn && card.cardType === "character" && card.cost <= battle.player.energy;
              return (
                <motion.div
                  key={card.uid}
                  initial={{ opacity: 0, y: 30, rotate: -3 }}
                  animate={{
                    opacity: 1,
                    y: isSelected_ ? -10 : 0,
                    rotate: 0,
                    scale: isSelected_ ? 1.05 : 1,
                  }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: i * 0.03 }}
                  className="shrink-0"
                >
                  <GameCard
                    card={{
                      ...card,
                      power: card.currentPower,
                      health: card.currentHealth,
                    }}
                    size="sm"
                    onClick={() => {
                      if (!isPlayerTurn) return;
                      if (isSelected_) {
                        setSelectedCard(null);
                      } else if (canPlay) {
                        setSelectedCard(card.uid);
                      }
                    }}
                    isSelected={isSelected_}
                    className={canPlay ? "ring-1 ring-primary/30" : "opacity-50"}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Combat Event Toast ── */}
      <AnimatePresence>
        {recentEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-sm"
          >
            <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-lg px-4 py-2 shadow-lg">
              {recentEvents.slice(-3).map((ev, i) => (
                <p
                  key={i}
                  className={`font-mono text-[10px] leading-relaxed ${
                    ev.type === "destroy" ? "text-destructive" :
                    ev.type === "win" ? "text-amber-400 font-bold" :
                    ev.type === "influence_damage" ? "text-orange-400" :
                    ev.type === "heal" ? "text-green-400" :
                    ev.type === "keyword" || ev.type === "element_bonus" ? "text-purple-400" :
                    "text-foreground/80"
                  }`}
                >
                  {ev.message}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card Zoom Modal ── */}
      <AnimatePresence>
        {showCardZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCardZoom(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xs"
            >
              <GameCard
                card={{
                  ...showCardZoom,
                  power: showCardZoom.currentPower,
                  health: showCardZoom.currentHealth,
                }}
                size="lg"
                showDetails
              />
              <div className="mt-3 bg-card/90 rounded-lg border border-border/30 p-3">
                {showCardZoom.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {showCardZoom.keywords.map(kw => (
                      <span key={kw} className="px-1.5 py-0.5 rounded bg-purple-900/30 border border-purple-500/30 font-mono text-[8px] text-purple-300 uppercase">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
                  <span>ATK: {showCardZoom.currentPower} (base {showCardZoom.basePower})</span>
                  <span>HP: {showCardZoom.currentHealth}/{showCardZoom.baseHealth}</span>
                  {showCardZoom.element && <span>Element: {showCardZoom.element}</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Battle Log Panel ── */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-sm border-l border-border/30 z-40 flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">BATTLE LOG</span>
              <button onClick={() => setShowLog(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1">
              {battle.events.map((ev, i) => (
                <p
                  key={i}
                  className={`font-mono text-[10px] leading-relaxed ${
                    ev.type === "phase" ? "text-primary/60 border-t border-border/10 pt-1 mt-1 font-bold" :
                    ev.type === "turn_start" ? "text-accent font-bold border-t border-accent/20 pt-1 mt-2" :
                    ev.type === "destroy" ? "text-destructive" :
                    ev.type === "win" ? "text-amber-400 font-bold text-sm" :
                    ev.type === "influence_damage" ? "text-orange-400" :
                    ev.type === "heal" ? "text-green-400" :
                    ev.type === "keyword" || ev.type === "element_bonus" ? "text-purple-400" :
                    ev.type === "evolve" || ev.type === "resurrect" ? "text-amber-400" :
                    "text-muted-foreground"
                  }`}
                >
                  {ev.message}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
