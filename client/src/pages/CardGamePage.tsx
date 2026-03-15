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
  SkipForward, Volume2, VolumeX, Globe, BookOpen, Map
} from "lucide-react";
import {
  BattleState, BattleCard, Faction, Lane, AIDifficulty,
  createBattle, deployCard, drawCards, resolveCombat,
  endTurn, runAITurn, canDeploy, getMatchRewards,
  cardToBattleCard, CombatEvent
} from "@/game/CardBattleEngine";
import {
  FACTION_LORE, generateUniverse, resolveUniverse,
  generateBriefing, generateFateResolution, getNarrative,
  recordBattleOutcome, getMultiverseRecord,
  type UniverseFate, type MultiverseRecord
} from "@/game/CardGameLore";

// ── Faction Data (now powered by lore framework) ──
const FACTIONS = FACTION_LORE;

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

type GameScreen = "menu" | "tutorial" | "factionSelect" | "difficultySelect" | "briefing" | "playing" | "result" | "multiverse";

const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_small_66ba7463.png";

interface TutorialStep {
  title: string;
  elaraText: string;
  highlight?: string;
  tip?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "WELCOME, OPERATIVE",
    elaraText: "Welcome to the CADES Faction Warfare Simulation. I'm Elara, your guide aboard this Inception Ark. Each match you play here simulates a dimensional conflict in a parallel universe — your choices determine whether that reality is saved or doomed. Let me walk you through the fundamentals.",
    tip: "This tutorial covers the basics. You can always ask me questions using the floating chat button.",
  },
  {
    title: "FACTIONS",
    elaraText: "There are two factions you can align with. The Architect represents ORDER — methodical control, enhanced attack power, and cost reduction. The Dreamer represents CHAOS — resilience, extra card draw, and an alternate win condition of surviving 15 turns. Choose wisely — your faction shapes your entire strategy.",
    highlight: "faction",
    tip: "The Architect is more aggressive. The Dreamer rewards patience and defense.",
  },
  {
    title: "THE BATTLEFIELD",
    elaraText: "The battlefield has three lanes: VANGUARD (melee, +1 ATK bonus), CORE (ranged, flexible), and FLANK (siege, +1 Influence damage). Each lane can hold up to 3 units. Deploy your cards strategically — lane positioning is crucial to victory.",
    highlight: "lanes",
    tip: "Flank lane deals extra damage to the enemy's Influence. Use it for your strongest attackers.",
  },
  {
    title: "DEPLOYING CARDS",
    elaraText: "Each turn you draw cards and gain energy. To deploy a card, select it from your hand, then choose a lane. Each card has an energy cost — you can't deploy cards you can't afford. Cards have ATK (attack power), HP (health), and may have special keywords like Shield, Drain, or Fury.",
    highlight: "deploy",
    tip: "Tap a card in your hand to select it, then tap a lane to deploy. The card's cost is shown in the top corner.",
  },
  {
    title: "COMBAT & INFLUENCE",
    elaraText: "When you end your turn, combat resolves automatically. Units in each lane attack opposing units. If a lane is empty on the opponent's side, your units deal damage directly to their Influence. Reduce the enemy's Influence to 0 to win. Both players start with 20 Influence.",
    highlight: "combat",
    tip: "End your turn by tapping the END TURN button. Combat happens, then the AI takes its turn.",
  },
  {
    title: "ELEMENTS & KEYWORDS",
    elaraText: "Cards belong to elements: Fire, Water, Earth, Air, Void, Light, Dark. Element matchups affect damage — Fire beats Earth, Water beats Fire, and so on. Keywords add special abilities: Shield (blocks first hit), Drain (heals on attack), Fury (attacks twice), and more.",
    highlight: "elements",
    tip: "Check the element icon on each card. Deploying against a weak element gives you an advantage.",
  },
  {
    title: "READY FOR BATTLE",
    elaraText: "You're ready, Operative. Remember: choose your faction, select a difficulty level, and enter the simulation. Start with Recruit difficulty to learn the ropes, then work your way up to Archon for the ultimate challenge. May the CoNexus guide your strategy.",
    tip: "Win battles to earn Dream points and unlock achievements. Good luck in the simulation!",
  },
];

export default function CardGamePage() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<GameScreen>("menu");
  const [tutorialStep, setTutorialStep] = useState(0);
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
  const [currentUniverse, setCurrentUniverse] = useState<UniverseFate | null>(null);
  const [briefingLines, setBriefingLines] = useState<string[]>([]);
  const [briefingComplete, setBriefingComplete] = useState(false);
  const [multiverseRecord, setMultiverseRecord] = useState<MultiverseRecord>(getMultiverseRecord());
  const [narrativeToast, setNarrativeToast] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const prevEventCount = useRef(0);

  // Fetch cards for deck building
  const { data: allCards } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 100,
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

  // Generate universe and show briefing
  const initBattle = useCallback(() => {
    if (!allCards?.cards || !selectedFaction) return;

    const universe = generateUniverse();
    setCurrentUniverse(universe);
    setBriefingLines([]);
    setBriefingComplete(false);
    setScreen("briefing");

    // Animate briefing lines
    const briefing = generateBriefing(universe, selectedFaction);
    const allLines = [briefing.title, briefing.subtitle, ...briefing.lines];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < allLines.length) {
        setBriefingLines(prev => [...prev, allLines[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBriefingComplete(true), 500);
      }
    }, 200);
  }, [allCards, selectedFaction]);

  // Start game after briefing
  const startGame = useCallback(() => {
    if (!allCards?.cards || !selectedFaction) return;

    const available = allCards.cards.filter(c => c.power > 0 && c.health > 0);
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    const playerCards = shuffled.slice(0, 25).map(c => cardToBattleCard(c));
    const opponentCards = shuffled.slice(25, 50).map(c => cardToBattleCard(c));

    const state = createBattle(playerCards, opponentCards, selectedFaction, selectedDifficulty);
    const withDraw = drawCards(state, "player", selectedFaction === "dreamer" ? 2 : 1);
    setBattle(withDraw);
    prevEventCount.current = withDraw.events.length;

    // Show narrative toast on battle start
    const narrative = getNarrative("battle_start", selectedFaction);
    if (narrative) {
      setNarrativeToast(narrative);
      setTimeout(() => setNarrativeToast(null), 4000);
    }

    setScreen("playing");
  }, [allCards, selectedFaction, selectedDifficulty]);

  // Narrative triggers during battle
  useEffect(() => {
    if (!battle || !battle.player.faction) return;
    const faction = battle.player.faction;

    // Turn 10 narrative
    if (battle.turn === 10 && battle.activePlayer === "player") {
      const msg = getNarrative("turn_10", faction);
      if (msg) { setNarrativeToast(msg); setTimeout(() => setNarrativeToast(null), 4000); }
    }

    // Low influence warning
    if (battle.player.influence <= 5 && battle.player.influence > 0) {
      const msg = getNarrative("low_influence", faction);
      if (msg) { setNarrativeToast(msg); setTimeout(() => setNarrativeToast(null), 4000); }
    }
  }, [battle?.turn, battle?.player.influence]);

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

            <button
              onClick={() => { setTutorialStep(0); setScreen("tutorial"); }}
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-mono text-sm hover:bg-secondary/80 hover:border-[var(--deep-purple)]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <img src={ELARA_AVATAR} alt="Elara" className="w-7 h-7 rounded-full border border-[var(--neon-cyan)]/30" />
                <div className="text-left">
                  <p className="font-display text-sm tracking-wider">TUTORIAL</p>
                  <p className="text-[10px] text-muted-foreground">Elara teaches you the basics</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <Link
              href="/games"
              className="w-full flex items-center justify-center px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <ChevronLeft size={14} className="mr-1" />
              BACK TO CADES
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ═══ TUTORIAL SCREEN ═══
  if (screen === "tutorial") {
    const step = TUTORIAL_STEPS[tutorialStep];
    const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;
    const isFirst = tutorialStep === 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          key={tutorialStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg w-full"
        >
          {/* Progress bar */}
          <div className="flex items-center gap-1.5 mb-6">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: i <= tutorialStep
                    ? "var(--brand-gradient)"
                    : "rgba(56,117,250,0.15)",
                }}
              />
            ))}
          </div>

          {/* Elara card */}
          <div className="rounded-xl overflow-hidden glass-float">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(56,117,250,0.15)" }}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--neon-cyan)]/40 shadow-[0_0_12px_rgba(51,226,230,0.2)]">
                <img src={ELARA_AVATAR} alt="Elara" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-[0.2em] text-white">ELARA</h3>
                <p className="font-mono text-[9px] tracking-wider" style={{ color: "var(--neon-cyan)" }}>CADES TRAINING PROTOCOL</p>
              </div>
              <div className="flex-1" />
              <span className="font-mono text-[9px]" style={{ color: "var(--text-muted-ve)" }}>
                {tutorialStep + 1}/{TUTORIAL_STEPS.length}
              </span>
            </div>

            {/* Content */}
            <div className="px-5 py-5">
              <h2 className="font-display text-lg font-bold tracking-wider mb-3" style={{ color: "var(--neon-cyan)" }}>
                {step.title}
              </h2>
              <p className="font-mono text-[12px] leading-relaxed mb-4" style={{ color: "var(--text-dim)" }}>
                {step.elaraText}
              </p>

              {step.tip && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg glass-sunk mb-4">
                  <Sparkles size={12} className="mt-0.5 flex-shrink-0" style={{ color: "var(--orb-orange)" }} />
                  <p className="font-mono text-[10px] leading-relaxed" style={{ color: "var(--orb-orange)" }}>
                    {step.tip}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 px-5 py-4 border-t" style={{ borderColor: "rgba(56,117,250,0.15)" }}>
              {!isFirst && (
                <button
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs transition-all hover:bg-white/5"
                  style={{ color: "var(--text-muted-ve)" }}
                >
                  <ChevronLeft size={14} />
                  BACK
                </button>
              )}
              {isFirst && (
                <button
                  onClick={() => setScreen("menu")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs transition-all hover:bg-white/5"
                  style={{ color: "var(--text-muted-ve)" }}
                >
                  <ChevronLeft size={14} />
                  MENU
                </button>
              )}
              <div className="flex-1" />
              {isLast ? (
                <button
                  onClick={() => setScreen("menu")}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm font-bold transition-all hover:brightness-110"
                  style={{
                    background: "color-mix(in oklch, var(--neon-cyan) 15%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--neon-cyan) 30%, transparent)",
                    color: "var(--neon-cyan)",
                  }}
                >
                  <Swords size={14} />
                  READY TO FIGHT
                </button>
              ) : (
                <button
                  onClick={() => setTutorialStep(tutorialStep + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-bold transition-all hover:brightness-110"
                  style={{
                    background: "color-mix(in oklch, var(--neon-cyan) 12%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--neon-cyan) 25%, transparent)",
                    color: "var(--neon-cyan)",
                  }}
                >
                  NEXT
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
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
              THE ETERNAL STRUGGLE
            </h2>
            <p className="font-mono text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Machine intelligence vs. humanity. Order vs. consciousness.
              Each battle in the CADES system determines the fate of a parallel universe.
              Choose your side.
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

                    <p className="font-mono text-xs text-foreground/70 italic mb-2">"{f.quote}"</p>

                    <p className="font-mono text-[10px] text-foreground/50 mb-3 leading-relaxed line-clamp-3">
                      {f.philosophy}
                    </p>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Swords size={12} className={isSelected ? f.textClass : "text-muted-foreground"} />
                        <span className="font-mono text-[10px] text-foreground/80">{f.bonus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={12} className={isSelected ? f.textClass : "text-muted-foreground"} />
                        <span className="font-mono text-[10px] text-foreground/80">{f.passiveName}: {f.passive.split(' — ')[1] || f.passive}</span>
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
              onClick={initBattle}
              className="flex-1 px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all"
            >
              <Play size={14} className="inline mr-2" />
              ENTER THE STRUGGLE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ BRIEFING SCREEN ═══
  if (screen === "briefing" && selectedFaction) {
    const f = FACTIONS[selectedFaction];
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg w-full"
        >
          <div className={`border rounded-xl overflow-hidden ${f.borderClass} ${f.glowClass}`}>
            {/* Header */}
            <div className={`px-5 py-3 border-b ${f.borderClass} bg-gradient-to-r ${f.bgClass}`}>
              <div className="flex items-center gap-2">
                <Globe size={16} className={f.textClass} />
                <span className={`font-display text-xs tracking-[0.3em] ${f.textClass}`}>
                  CADES DIMENSIONAL LOCK
                </span>
              </div>
            </div>

            {/* Briefing content */}
            <div className="px-5 py-5 bg-card/30">
              <div className="space-y-2 font-mono text-sm min-h-[200px]">
                {briefingLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      i === 0
                        ? `font-display text-lg font-bold tracking-wider ${f.textClass}`
                        : i === 1
                        ? "text-accent font-bold text-xs tracking-wider"
                        : "text-muted-foreground text-xs"
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
                {!briefingComplete && (
                  <span className={`inline-block w-2.5 h-5 ${selectedFaction === 'architect' ? 'bg-cyan-400' : 'bg-amber-400'} animate-pulse ml-1`} />
                )}
              </div>

              {currentUniverse && briefingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-border/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${f.borderClass} bg-card/50`}>
                      <span className="text-lg">{f.sigil}</span>
                    </div>
                    <div>
                      <p className={`font-display text-sm font-bold ${f.textClass}`}>
                        {currentUniverse.name}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {currentUniverse.designation} // {currentUniverse.epoch}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-foreground/60 italic mb-4">
                    "{currentUniverse.stakes}"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            {briefingComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`px-5 py-4 border-t ${f.borderClass} flex gap-3`}
              >
                <button
                  onClick={() => setScreen("difficultySelect")}
                  className="px-4 py-2 rounded-md font-mono text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  <ChevronLeft size={14} className="inline mr-1" />
                  ABORT
                </button>
                <button
                  onClick={startGame}
                  className={`flex-1 px-4 py-2.5 rounded-md font-mono text-sm font-bold transition-all hover:brightness-110 ${
                    selectedFaction === 'architect'
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      : 'bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  }`}
                >
                  <Swords size={14} className="inline mr-2" />
                  {selectedFaction === 'architect' ? 'INITIATE OVERRIDE' : 'DEFEND THE DREAM'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ MULTIVERSE MAP SCREEN ═══
  if (screen === "multiverse") {
    const record = getMultiverseRecord();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-6">
            <Globe size={32} className="mx-auto text-primary mb-3" />
            <h2 className="font-display text-xl font-black tracking-[0.2em] text-foreground mb-2">
              MULTIVERSE MAP
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Every battle determines the fate of a parallel universe.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg bg-card/50 border border-border/20 p-3 text-center">
              <p className="font-display text-2xl font-bold text-primary">{record.totalBattles}</p>
              <p className="font-mono text-[8px] text-muted-foreground tracking-wider">BATTLES</p>
            </div>
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-center">
              <p className="font-display text-2xl font-bold text-amber-400">{record.universesSaved}</p>
              <p className="font-mono text-[8px] text-muted-foreground tracking-wider">SAVED</p>
            </div>
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-center">
              <p className="font-display text-2xl font-bold text-destructive">{record.universesDoomed}</p>
              <p className="font-mono text-[8px] text-muted-foreground tracking-wider">DOOMED</p>
            </div>
            <div className="rounded-lg bg-card/50 border border-border/20 p-3 text-center">
              <p className="font-display text-2xl font-bold text-green-400">{record.longestStreak}</p>
              <p className="font-mono text-[8px] text-muted-foreground tracking-wider">BEST STREAK</p>
            </div>
          </div>

          {/* Universe History */}
          {record.history.length > 0 ? (
            <div className="rounded-xl border border-border/20 bg-card/20 overflow-hidden mb-6">
              <div className="px-4 py-2 border-b border-border/10">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">DIMENSIONAL RECORDS</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {record.history.slice(0, 20).map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/5 ${
                    entry.status === 'saved' ? 'bg-amber-500/3' : 'bg-destructive/3'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      entry.status === 'saved' ? 'border-amber-500/30 bg-amber-500/10' : 'border-destructive/30 bg-destructive/10'
                    }`}>
                      <span className="text-sm">{entry.status === 'saved' ? '✦' : '◈'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-xs text-foreground">{entry.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {entry.designation} • {entry.faction === 'architect' ? 'Architect' : 'Dreamer'}
                      </p>
                    </div>
                    <span className={`font-display text-[10px] font-bold tracking-wider ${
                      entry.status === 'saved' ? 'text-amber-400' : 'text-destructive'
                    }`}>
                      {entry.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border/20 bg-card/20 p-8 text-center mb-6">
              <Globe size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-mono text-xs text-muted-foreground">No battles fought yet.</p>
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Enter the Struggle to determine the fate of universes.</p>
            </div>
          )}

          <button
            onClick={() => setScreen("menu")}
            className="w-full px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
          >
            <ChevronLeft size={14} className="inline mr-1" />
            BACK TO MENU
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══ RESULT SCREEN (with Fate Resolution) ═══
  if (screen === "result" && battle) {
    const isWin = battle.winner === "player";
    const rewards = getMatchRewards(battle);
    const f = FACTIONS[battle.player.faction];

    // Generate fate resolution
    const fate = currentUniverse && battle.winner
      ? generateFateResolution(currentUniverse, battle.winner, battle.player.faction, battle.winReason)
      : null;

    // Record the outcome (only once)
    const handleRecordAndContinue = () => {
      if (currentUniverse && battle.winner) {
        const updated = recordBattleOutcome(currentUniverse, battle.winner, battle.player.faction);
        setMultiverseRecord(updated);
      }
      setScreen("factionSelect");
      setBattle(null);
      setCurrentUniverse(null);
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          {/* Fate Resolution */}
          {fate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className={`text-4xl mb-3 ${
                fate.title === 'UNIVERSE SAVED' ? 'drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              }`}>
                {fate.icon}
              </div>
              <h2 className={`font-display text-2xl font-black tracking-wider mb-1 ${
                fate.title === 'UNIVERSE SAVED' ? 'text-amber-400' : 'text-destructive'
              }`}>
                {fate.title}
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground mb-3">
                {fate.subtitle}
              </p>
              <p className="font-mono text-[11px] text-foreground/60 leading-relaxed mb-2 max-w-sm mx-auto">
                {fate.description}
              </p>
              <p className="font-mono text-[10px] text-foreground/40 italic leading-relaxed max-w-sm mx-auto">
                {fate.consequence}
              </p>
            </motion.div>
          )}

          {/* Battle outcome */}
          {!fate && (
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
            </motion.div>
          )}

          {/* Faction quote */}
          <p className={`font-mono text-[10px] italic mb-4 ${f.textClass}`}>
            "{isWin ? f.victoryLine : f.defeatLine}"
          </p>

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
                  {rewards.achievement}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleRecordAndContinue}
              className="w-full px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
            >
              <RotateCcw size={14} className="inline mr-2" />
              FIGHT FOR ANOTHER UNIVERSE
            </button>
            <button
              onClick={() => { handleRecordAndContinue(); setScreen("multiverse"); }}
              className="w-full px-5 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-mono text-xs hover:bg-secondary/70 transition-all"
            >
              <Globe size={14} className="inline mr-2" />
              VIEW MULTIVERSE MAP
            </button>
            <Link
              href="/"
              className="block w-full px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all text-center"
            >
              RETURN TO LOREDEX
            </Link>
          </div>

          {/* Multiverse Map link */}
          <button
            onClick={() => setScreen("multiverse")}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card/20 border border-border/10 text-muted-foreground font-mono text-[10px] hover:text-primary hover:border-primary/30 transition-all"
          >
            <Globe size={12} />
            VIEW MULTIVERSE MAP
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══ TUTORIALRD ═══
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
        className={`relative flex-1 rounded-lg border transition-all min-h-[70px] sm:min-h-[90px] ${
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
                  w-12 sm:w-16 h-[66px] sm:h-22 rounded-md border overflow-hidden cursor-pointer transition-all
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
      <div className={`flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b ${oFaction.borderClass} bg-card/30`}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border ${oFaction.borderClass} bg-card/50`}>
            <span className="text-xs sm:text-sm">{oFaction.icon}</span>
          </div>
          <div>
            <p className={`font-mono text-[9px] sm:text-[10px] font-bold ${oFaction.textClass}`}>
              {oFaction.name.toUpperCase()} {isAIThinking && <span className="animate-pulse">...</span>}
            </p>
            <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground">
              H:{battle.opponent.hand.length} D:{battle.opponent.deck.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Opponent Influence */}
          <div className="flex items-center gap-1">
            <Shield size={10} className={oFaction.textClass} />
            <div className="w-12 sm:w-20 h-1.5 sm:h-2 rounded-full bg-secondary/30 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  battle.opponent.faction === "architect" ? "bg-cyan-500" : "bg-amber-500"
                }`}
                style={{ width: `${(battle.opponent.influence / battle.opponent.maxInfluence) * 100}%` }}
              />
            </div>
            <span className={`font-display text-[10px] sm:text-xs font-bold ${oFaction.textClass}`}>
              {battle.opponent.influence}
            </span>
          </div>
          {/* Energy */}
          <div className="flex items-center gap-0.5">
            <Zap size={9} className="text-amber-400" />
            <span className="font-display text-[10px] sm:text-xs font-bold text-amber-400">{battle.opponent.energy}</span>
          </div>
          {/* Turn counter */}
          <div className="px-1.5 py-0.5 rounded bg-secondary/50 border border-border/20">
            <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground">T{battle.turn}/{battle.maxTurns}</span>
          </div>
          <button
            onClick={() => setShowLog(!showLog)}
            className="p-1 sm:p-1.5 rounded bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary transition-colors"
          >
            <Eye size={10} />
          </button>
        </div>
      </div>

      {/* ── Battlefield ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponent lanes */}
        <div className="flex-1 flex gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-2">
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
        <div className="flex-1 flex gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-2">
          {(["vanguard", "core", "flank"] as Lane[]).map(lane => (
            <div key={`plr-${lane}`} className="flex-1">
              {renderLane(lane, "player")}
            </div>
          ))}
        </div>
      </div>

      {/* ── Player Hand & Controls ── */}
      <div className={`border-t ${pFaction.borderClass} bg-card/40`}>
        <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border ${pFaction.borderClass} bg-card/50`}>
              <span className="text-xs sm:text-sm">{pFaction.icon}</span>
            </div>
            <div>
              <p className={`font-mono text-[9px] sm:text-[10px] font-bold ${pFaction.textClass}`}>
                {(user?.name || "YOU").slice(0, 8)} — {pFaction.subtitle}
              </p>
              <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground">
                D:{battle.player.deck.length} G:{battle.player.graveyard.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Player Influence */}
            <div className="flex items-center gap-1">
              <Shield size={10} className={pFaction.textClass} />
              <div className="w-12 sm:w-20 h-1.5 sm:h-2 rounded-full bg-secondary/30 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    battle.player.faction === "architect" ? "bg-cyan-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${(battle.player.influence / battle.player.maxInfluence) * 100}%` }}
                />
              </div>
              <span className={`font-display text-[10px] sm:text-xs font-bold ${pFaction.textClass}`}>
                {battle.player.influence}
              </span>
            </div>
            {/* Energy */}
            <div className="flex items-center gap-0.5">
              <Zap size={10} className="text-amber-400" />
              <span className="font-display text-xs sm:text-sm font-bold text-amber-400">{battle.player.energy}</span>
            </div>
            {/* End Turn */}
            {isPlayerTurn && (
              <button
                onClick={handleEndTurn}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-accent/10 border border-accent/40 font-mono text-[9px] sm:text-[10px] text-accent hover:bg-accent/20 transition-all"
              >
                END →
              </button>
            )}
          </div>
        </div>

        {/* Hand cards */}
        <div className="flex gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2 sm:pb-3 overflow-x-auto no-scrollbar">
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

      {/* ── Narrative Toast ── */}
      <AnimatePresence>
        {narrativeToast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-md"
          >
            <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-lg px-5 py-3 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={12} className="text-primary" />
                <span className="font-mono text-[9px] text-primary tracking-wider">CADES NARRATIVE</span>
              </div>
              <p className="font-mono text-xs text-foreground/80 italic leading-relaxed">{narrativeToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="fixed right-0 top-0 bottom-0 w-64 sm:w-72 bg-card/95 backdrop-blur-sm border-l border-border/30 z-40 flex flex-col"
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
