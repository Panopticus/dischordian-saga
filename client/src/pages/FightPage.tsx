/* ═══════════════════════════════════════════════════════
   THE COLLECTOR'S ARENA — Main Fight Page
   Rebranded with lore opening, story mode, character
   select with lore popups, and improved mobile layout.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Swords, Lock, Trophy, Star, Shield, Zap, Heart, Wind,
  ChevronLeft, ChevronRight, Gamepad2, AlertTriangle, Skull,
  Target, BookOpen, Play, X, Info, Crown, Eye, Gem,
} from "lucide-react";
import { calculateTraitBonuses } from "@shared/traitBonuses";
import { useGamification } from "@/contexts/GamificationContext";
import { useContentReward } from "@/components/ContentRewardToast";
import { toast } from "sonner";
import {
  STARTER_FIGHTERS, UNLOCKABLE_FIGHTERS, DEMON_FIGHTERS, ALL_FIGHTERS,
  ARENAS, DIFFICULTIES,
  type FighterData, type ArenaData, type DifficultyLevel,
} from "@/game/gameData";
import FightArena3D from "@/game/FightArena3D";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import {
  ARENA_LORE_OPENING, STORY_CHAPTERS, FIGHTER_LORE,
  THE_PRISONER, getPrisonerStats,
  loadStoryProgress, saveStoryProgress,
  type StoryChapter, type StoryProgress, type StoryDialogue,
} from "@/game/storyMode";

type Phase = "title" | "lore" | "story" | "story-dialogue" | "select" | "difficulty" | "arena" | "fighting" | "results" | "story-results";

/* ═══ INVASION EVENTS ═══ */
const INVASION_EVENTS = [
  { id: "neyon-raid", faction: "neyons", name: "Neyon Raid", minWins: 3, reward: 50, fighter: "enigma" },
  { id: "empire-assault", faction: "empire", name: "Empire Assault", minWins: 5, reward: 80, fighter: "warlord" },
  { id: "insurgent-ambush", faction: "insurgency", name: "Insurgent Ambush", minWins: 8, reward: 120, fighter: "human" },
  { id: "potential-surge", faction: "potentials", name: "Potential Surge", minWins: 12, reward: 200, fighter: "source" },
  { id: "demon-incursion", faction: "hierarchy", name: "Demon Incursion", minWins: 15, reward: 300, fighter: "abaddon" },
];

const FACTION_COLORS: Record<string, string> = {
  empire: "#ef4444",
  insurgency: "#22c55e",
  neyons: "#818cf8",
  potentials: "#f59e0b",
  neutral: "#94a3b8",
  hierarchy: "#dc2626",
};

export default function FightPage() {
  const gam = useGamification();
  const { recordAndReward } = useContentReward();
  const [phase, setPhase] = useState<Phase>("title");
  const [selectedPlayer, setSelectedPlayer] = useState<FighterData | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<FighterData | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DIFFICULTIES[1]);
  const [selectedArena, setSelectedArena] = useState<ArenaData>(ARENAS[0]);
  const [selectingFor, setSelectingFor] = useState<"player" | "opponent">("player");
  const [matchResult, setMatchResult] = useState<{ winner: "p1" | "p2"; perfect: boolean } | null>(null);
  const [hoveredFighter, setHoveredFighter] = useState<FighterData | null>(null);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [showLorePopup, setShowLorePopup] = useState<FighterData | null>(null);
  const [invasionDefeated, setInvasionDefeated] = useState(false);

  // Story mode state
  const [storyProgress, setStoryProgress] = useState<StoryProgress>(loadStoryProgress);
  const [currentStoryChapter, setCurrentStoryChapter] = useState<StoryChapter | null>(null);
  const [storyDialogueIndex, setStoryDialogueIndex] = useState(0);
  const [storyDialogueType, setStoryDialogueType] = useState<"pre" | "post-win" | "post-lose">("pre");
  const [loreIndex, setLoreIndex] = useState(0);
  const [hasSeenLore, setHasSeenLore] = useState(() => {
    try { return localStorage.getItem("collectors_arena_lore_seen") === "true"; } catch { return false; }
  });

  // NFT holder perks
  const arenaPerks = trpc.nft.getArenaPerks.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const holderPerks = arenaPerks.data;

  // Trait bonuses from NFT Potentials
  const traitBonuses = trpc.nft.getTraitBonuses.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const activeBonuses = useMemo(() => {
    if (!traitBonuses.data?.bonuses) return null;
    return calculateTraitBonuses(traitBonuses.data.bonuses);
  }, [traitBonuses.data]);

  // Citizen character sheet bonuses (stacks with NFT bonuses)
  const allTraitBonuses = trpc.nft.getAllTraitBonuses.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const citizenFightBonuses = allTraitBonuses.data?.fightGame;

  const unlockedIds = useMemo(() => {
    const base = new Set(gam.gameSave.unlockedFighters);
    // Also include story-unlocked fighters
    storyProgress.unlockedFighters.forEach(id => base.add(id));
    return Array.from(base);
  }, [gam.gameSave.unlockedFighters, storyProgress.unlockedFighters]);

  const isFighterAvailable = useCallback((f: FighterData) => {
    return !f.locked || unlockedIds.includes(f.id);
  }, [unlockedIds]);

  const handleUnlock = useCallback((f: FighterData) => {
    if (gam.gameSave.fightPoints >= f.unlockCost) {
      gam.spendPoints(f.unlockCost);
      gam.unlockFighter(f.id);
    }
  }, [gam]);

  const handleFighterSelect = useCallback((f: FighterData) => {
    if (!isFighterAvailable(f)) return;
    if (selectingFor === "player") {
      setSelectedPlayer(f);
      setSelectingFor("opponent");
    } else {
      setSelectedOpponent(f);
    }
  }, [selectingFor, isFighterAvailable]);

  const startFight = useCallback(() => {
    if (!selectedPlayer || !selectedOpponent) return;
    setPhase("fighting");
  }, [selectedPlayer, selectedOpponent]);

  const startTraining = useCallback(() => {
    setIsTrainingMode(true);
    setPhase("select");
    setSelectingFor("player");
  }, []);

  const recordMatch = trpc.fightLeaderboard.recordMatch.useMutation();

  const handleMatchEnd = useCallback((winner: "p1" | "p2", perfect: boolean) => {
    setMatchResult({ winner, perfect });
    if (selectedPlayer && selectedOpponent && selectedArena) {
      recordMatch.mutate({
        won: winner === "p1",
        playerFighter: selectedPlayer.id,
        opponentFighter: selectedOpponent.id,
        arena: selectedArena.id,
        difficulty: selectedDifficulty.id,
        perfect,
        bestCombo: 0,
        pointsEarned: winner === "p1" ? selectedDifficulty.pointsMultiplier * 100 : 0,
      });
    }
    if (winner === "p1") {
      gam.recordFightWin(selectedDifficulty.id, perfect);
      recordAndReward("fight_win", `fight-${Date.now()}`, true, {
        difficulty: selectedDifficulty.id,
        perfect,
        opponent: selectedOpponent?.name,
      });
    } else {
      gam.recordFightLoss();
    }
    setPhase("results");
  }, [gam, selectedDifficulty, recordAndReward, selectedOpponent, selectedPlayer, selectedArena, recordMatch]);

  // Story mode match end
  const handleStoryMatchEnd = useCallback((winner: "p1" | "p2", perfect: boolean) => {
    setMatchResult({ winner, perfect });
    if (winner === "p1") {
      gam.recordFightWin("story", perfect);
    } else {
      gam.recordFightLoss();
    }
    setStoryDialogueType(winner === "p1" ? "post-win" : "post-lose");
    setStoryDialogueIndex(0);
    setPhase("story-dialogue");
  }, [gam]);

  // Start story mode
  const startStoryMode = useCallback(() => {
    if (!hasSeenLore) {
      setLoreIndex(0);
      setPhase("lore");
    } else {
      setPhase("story");
    }
  }, [hasSeenLore]);

  // Start a story chapter fight
  const startStoryChapter = useCallback((chapter: StoryChapter) => {
    setCurrentStoryChapter(chapter);
    setStoryDialogueType("pre");
    setStoryDialogueIndex(0);
    setPhase("story-dialogue");
  }, []);

  // Advance story dialogue
  const advanceStoryDialogue = useCallback(() => {
    if (!currentStoryChapter) return;
    const dialogues = storyDialogueType === "pre"
      ? currentStoryChapter.preDialogue
      : storyDialogueType === "post-win"
      ? currentStoryChapter.postVictoryDialogue
      : currentStoryChapter.postDefeatDialogue;

    if (storyDialogueIndex < dialogues.length - 1) {
      setStoryDialogueIndex(prev => prev + 1);
    } else {
      // End of dialogue
      if (storyDialogueType === "pre") {
        // Start the fight
        const opponent = ALL_FIGHTERS.find(f => f.id === currentStoryChapter.opponentId);
        const arena = ARENAS.find(a => a.id === currentStoryChapter.arenaId) || ARENAS[0];
        const diffMap: Record<string, DifficultyLevel> = {};
        DIFFICULTIES.forEach(d => { diffMap[d.id] = d; });
        const diff = diffMap[currentStoryChapter.difficulty] || DIFFICULTIES[0];

        if (opponent) {
          // Build prisoner fighter data with scaled stats
          const stats = getPrisonerStats(storyProgress.completedChapters.length);
          const prisonerFighter: FighterData = {
            id: "prisoner",
            name: "The Prisoner",
            title: THE_PRISONER.title,
            image: ALL_FIGHTERS.find(f => f.id === "oracle")?.image || "",
            faction: "neutral",
            locked: false,
            unlockCost: 0,
            hp: stats.hp,
            attack: stats.attack,
            defense: stats.defense,
            speed: stats.speed,
            special: stats.special,
            combos: ["Instinct Strike", "Memory Flash", "Survival Will"],
            color: THE_PRISONER.color,
          };
          setSelectedPlayer(prisonerFighter);
          setSelectedOpponent(opponent);
          setSelectedArena(arena);
          setSelectedDifficulty(diff);
          setPhase("fighting");
        }
      } else if (storyDialogueType === "post-win") {
        // Update story progress
        const newProgress: StoryProgress = {
          ...storyProgress,
          completedChapters: Array.from(new Set([...storyProgress.completedChapters, currentStoryChapter.id])),
          unlockedFighters: Array.from(new Set([...storyProgress.unlockedFighters, currentStoryChapter.unlocksFighter])),
          memoriesRecovered: currentStoryChapter.memoryFragment
            ? Array.from(new Set([...storyProgress.memoriesRecovered, currentStoryChapter.memoryFragment]))
            : storyProgress.memoriesRecovered,
          currentChapter: Math.max(storyProgress.currentChapter, currentStoryChapter.chapter),
          isComplete: currentStoryChapter.chapter === STORY_CHAPTERS.length,
        };
        setStoryProgress(newProgress);
        saveStoryProgress(newProgress);
        // Also unlock in gamification
        gam.unlockFighter(currentStoryChapter.unlocksFighter);
        toast.success(`${ALL_FIGHTERS.find(f => f.id === currentStoryChapter.unlocksFighter)?.name || "Fighter"} Unlocked!`, {
          description: currentStoryChapter.powerGained || "A new challenger joins your roster.",
          duration: 4000,
        });
        setPhase("story");
      } else {
        // Post-defeat — back to story select
        setPhase("story");
      }
    }
  }, [currentStoryChapter, storyDialogueType, storyDialogueIndex, storyProgress, gam]);

  // Apply trait bonuses to player fighter data (must be top-level, not inside conditional)
  const boostedPlayer = useMemo(() => {
    if (!selectedPlayer) return selectedPlayer;
    let hp = selectedPlayer.hp;
    let attack = selectedPlayer.attack;
    let defense = selectedPlayer.defense;
    let speed = selectedPlayer.speed;
    if (activeBonuses) {
      const b = activeBonuses.total;
      hp += b.hp;
      attack += b.attack;
      defense += b.defense;
      speed += b.speed;
    }
    if (citizenFightBonuses) {
      hp += citizenFightBonuses.hpBonus;
      attack += citizenFightBonuses.attackBonus;
      defense += citizenFightBonuses.defenseBonus;
      speed += citizenFightBonuses.speedBonus;
    }
    return { ...selectedPlayer, hp, attack, defense, speed };
  }, [selectedPlayer, activeBonuses, citizenFightBonuses]);

  const resetToSelect = useCallback(() => {
    setPhase("select");
    setSelectedPlayer(null);
    setSelectedOpponent(null);
    setSelectingFor("player");
    setMatchResult(null);
  }, []);

  /* ═══════════════════════════════════════════════════════
     TITLE SCREEN — THE COLLECTOR'S ARENA
     ═══════════════════════════════════════════════════════ */
  if (phase === "title") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 30%, #0d1a2e 0%, #070b14 50%, #030508 100%)" }}>
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: i % 4 === 0 ? 3 : 1.5,
                height: i % 4 === 0 ? 3 : 1.5,
                background: i % 5 === 0 ? "#22d3ee" : i % 5 === 1 ? "#a78bfa" : i % 5 === 2 ? "#f59e0b" : i % 5 === 3 ? "#ef4444" : "#818cf8",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.8, 1], y: [0, -30, 0] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        {/* Collector's glow ring */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)",
            boxShadow: "0 0 120px rgba(34,211,238,0.1), 0 0 240px rgba(167,139,250,0.05)",
          }}
        />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center relative z-10 max-w-lg">
          {/* Subtitle */}
          <div className="font-mono text-[10px] sm:text-xs text-cyan-500/50 tracking-[0.5em] mb-3">THE DISCHORDIAN SAGA</div>

          {/* Main title */}
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-wider mb-1 leading-tight">
            <span className="text-cyan-400" style={{ textShadow: "0 0 40px rgba(34,211,238,0.4)" }}>THE COLLECTOR'S</span>
          </h1>
          <h1 className="font-display text-5xl sm:text-7xl font-black tracking-wider mb-2 leading-tight">
            <span className="text-white/90" style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}>ARENA</span>
          </h1>

          {/* Tagline */}
          <p className="font-mono text-[10px] sm:text-xs text-amber-500/50 tracking-[0.15em] mb-8 max-w-sm mx-auto">
            WHERE THE GREATEST POWERS IN THE UNIVERSE FIGHT FOR THE RIGHT TO EXIST
          </p>

          {/* Main buttons */}
          <div className="flex flex-col gap-3 items-center">
            {/* Story Mode — primary CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startStoryMode}
              className="w-full max-w-xs px-6 py-3.5 rounded-lg border-2 font-display text-base sm:text-lg tracking-wider transition-all flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(34,211,238,0.1) 100%)",
                borderColor: storyProgress.isComplete ? "rgba(251,191,36,0.6)" : "rgba(167,139,250,0.5)",
                color: storyProgress.isComplete ? "#fbbf24" : "#a78bfa",
                textShadow: `0 0 15px ${storyProgress.isComplete ? "rgba(251,191,36,0.4)" : "rgba(167,139,250,0.4)"}`,
              }}
            >
              <BookOpen size={18} />
              {storyProgress.isComplete ? "STORY COMPLETE" : storyProgress.currentChapter > 0 ? "CONTINUE STORY" : "STORY MODE"}
              {storyProgress.currentChapter > 0 && !storyProgress.isComplete && (
                <span className="font-mono text-[10px] opacity-60 ml-1">CH.{storyProgress.currentChapter + 1}/{STORY_CHAPTERS.length}</span>
              )}
            </motion.button>

            {/* Quick Fight + Training row */}
            <div className="flex gap-3 w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setIsTrainingMode(false); setPhase("select"); setSelectingFor("player"); }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 font-display text-sm tracking-wider hover:bg-red-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Swords size={15} /> FIGHT
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startTraining}
                className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-display text-sm tracking-wider hover:bg-cyan-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Target size={15} /> TRAIN
              </motion.button>
            </div>

            {/* Leaderboard */}
            <Link
              href="/fight-leaderboard"
              className="w-full max-w-xs px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 font-display text-sm tracking-wider hover:bg-white/10 hover:text-white/70 transition-all inline-flex items-center justify-center gap-1.5"
            >
              <Trophy size={14} /> LEADERBOARD
            </Link>
          </div>

          {/* NFT Holder Perks Badge */}
          {holderPerks?.isHolder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 max-w-xs mx-auto w-full"
            >
              <Link href="/potentials">
                <div className="rounded-lg border overflow-hidden cursor-pointer hover:brightness-110 transition-all"
                  style={{
                    borderColor: "rgba(147,51,234,0.4)",
                    background: "linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(34,211,238,0.06) 100%)",
                  }}
                >
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="p-1.5 rounded bg-purple-500/20">
                      <Gem size={14} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[10px] tracking-wider text-purple-300">
                        {holderPerks.perks.title}
                      </div>
                      <div className="font-mono text-[8px] text-purple-400/50">
                        {holderPerks.claimedCount} Potential{holderPerks.claimedCount !== 1 ? "s" : ""} claimed • {Math.round((holderPerks.perks.fightPointsMultiplier - 1) * 100)}% bonus points
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-purple-400/40">→</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-2 mt-6 max-w-xs mx-auto">
            {[
              { label: "WINS", value: gam.progress.fightWins, color: "#22c55e" },
              { label: "STREAK", value: gam.gameSave.winStreak, color: "#f59e0b" },
              { label: "POINTS", value: gam.gameSave.fightPoints, color: "#22d3ee" },
              { label: "STORY", value: `${storyProgress.completedChapters.length}/${STORY_CHAPTERS.length}`, color: "#a78bfa" },
            ].map(s => (
              <div key={s.label} className="text-center py-1.5 rounded bg-white/5 border border-white/5">
                <div className="font-mono text-[8px] text-white/30 tracking-wider">{s.label}</div>
                <div className="font-display text-sm" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     LORE OPENING — First-time cinematic text
     ═══════════════════════════════════════════════════════ */
  if (phase === "lore") {
    const currentLine = ARENA_LORE_OPENING[loreIndex];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #030508 100%)" }}
        onClick={() => {
          if (loreIndex < ARENA_LORE_OPENING.length - 1) {
            setLoreIndex(prev => prev + 1);
          } else {
            setHasSeenLore(true);
            localStorage.setItem("collectors_arena_lore_seen", "true");
            setPhase("story");
          }
        }}
      >
        {/* Skip button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHasSeenLore(true);
            localStorage.setItem("collectors_arena_lore_seen", "true");
            setPhase("story");
          }}
          className="absolute top-4 right-4 font-mono text-xs text-white/30 hover:text-white/60 transition-colors z-10"
        >
          SKIP &gt;&gt;
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={loreIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-center"
          >
            {currentLine.speaker !== "narrator" && (
              <div className="font-display text-sm tracking-[0.2em] mb-3"
                style={{ color: currentLine.speakerColor || "#94a3b8" }}>
                {currentLine.speaker.toUpperCase()}
              </div>
            )}
            <p className={`text-base sm:text-lg leading-relaxed ${
              currentLine.speaker === "narrator"
                ? "font-mono text-white/60 italic"
                : "font-mono text-white/80"
            }`}
              style={currentLine.speaker !== "narrator" ? { color: currentLine.speakerColor || "#e2e8f0" } : undefined}
            >
              "{currentLine.text}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute bottom-8 flex gap-1.5">
          {ARENA_LORE_OPENING.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= loreIndex ? "bg-cyan-400/60" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="absolute bottom-4 font-mono text-[10px] text-white/20">TAP TO CONTINUE</div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     STORY MODE — Chapter Select
     ═══════════════════════════════════════════════════════ */
  if (phase === "story") {
    const prisonerStats = getPrisonerStats(storyProgress.completedChapters.length);
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 20%, #0d1a2e 0%, #070b14 60%, #030508 100%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button onClick={() => setPhase("title")} className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-1">
            <ChevronLeft size={16} /> BACK
          </button>
          <h2 className="font-display text-xs sm:text-sm tracking-[0.3em] text-cyan-400/80">STORY MODE</h2>
          <div className="font-mono text-[10px] text-amber-400">CH {storyProgress.currentChapter + 1}</div>
        </div>

        {/* Prisoner status */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/40">
            <img src={ALL_FIGHTERS.find(f => f.id === "oracle")?.image || ""} alt="The Prisoner" className="w-full h-full object-cover" style={{ filter: storyProgress.completedChapters.length < 6 ? "brightness(0.5) saturate(0.3)" : "none" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm text-white/80">
              {storyProgress.completedChapters.length >= 10 ? "The Oracle" : storyProgress.completedChapters.length >= 6 ? "The Awakening" : "The Prisoner"}
            </div>
            <div className="font-mono text-[9px] text-purple-400/60">{prisonerStats.special.name}</div>
          </div>
          <div className="flex gap-2 text-center">
            <div><div className="font-mono text-[8px] text-white/30">HP</div><div className="font-mono text-xs text-red-400">{prisonerStats.hp}</div></div>
            <div><div className="font-mono text-[8px] text-white/30">ATK</div><div className="font-mono text-xs text-amber-400">{prisonerStats.attack}</div></div>
            <div><div className="font-mono text-[8px] text-white/30">DEF</div><div className="font-mono text-xs text-green-400">{prisonerStats.defense}</div></div>
            <div><div className="font-mono text-[8px] text-white/30">SPD</div><div className="font-mono text-xs text-cyan-400">{prisonerStats.speed}</div></div>
          </div>
        </div>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {STORY_CHAPTERS.map((ch, i) => {
            const isCompleted = storyProgress.completedChapters.includes(ch.id);
            const isAvailable = i === 0 || storyProgress.completedChapters.includes(STORY_CHAPTERS[i - 1].id);
            const isNext = isAvailable && !isCompleted;
            const opponent = ALL_FIGHTERS.find(f => f.id === ch.opponentId);

            return (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => isAvailable ? startStoryChapter(ch) : null}
                disabled={!isAvailable}
                className={`w-full text-left rounded-lg border p-3 transition-all ${
                  isCompleted
                    ? "border-green-500/30 bg-green-500/5"
                    : isNext
                    ? "border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10"
                    : "border-white/5 bg-white/[0.02] opacity-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Chapter number */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-display font-bold shrink-0 ${
                    isCompleted ? "bg-green-500/20 text-green-400" : isNext ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/20"
                  }`}>
                    {isCompleted ? <Star size={14} /> : ch.chapter}
                  </div>

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs sm:text-sm text-white/80 truncate">{ch.title}</span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                        ch.difficulty === "nightmare" ? "bg-red-500/20 text-red-400"
                        : ch.difficulty === "hard" ? "bg-amber-500/20 text-amber-400"
                        : ch.difficulty === "normal" ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-green-500/20 text-green-400"
                      }`}>{ch.difficulty.toUpperCase()}</span>
                    </div>
                    <div className="font-mono text-[9px] text-white/30 truncate">{ch.subtitle}</div>
                  </div>

                  {/* Opponent portrait */}
                  {opponent && (
                    <div className="w-8 h-8 rounded overflow-hidden border border-white/10 shrink-0">
                      <img src={opponent.image} alt={opponent.name} className="w-full h-full object-cover"
                        style={{ filter: !isAvailable ? "brightness(0.2) grayscale(1)" : undefined }} />
                    </div>
                  )}
                </div>

                {/* Memory fragment for completed chapters */}
                {isCompleted && ch.memoryFragment && (
                  <div className="mt-2 pl-11 font-mono text-[9px] text-purple-400/50 italic truncate">
                    \u2728 {ch.memoryFragment.substring(0, 80)}...
                  </div>
                )}
              </motion.button>
            );
          })}

          {/* Grand Champion banner */}
          {storyProgress.isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 rounded-lg border border-amber-500/30 bg-amber-500/5"
            >
              <Crown size={32} className="mx-auto text-amber-400 mb-2" />
              <div className="font-display text-xl text-amber-400" style={{ textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>
                GRAND CHAMPION
              </div>
              <div className="font-mono text-xs text-white/40 mt-1">All fighters unlocked. The Arena is yours.</div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     STORY DIALOGUE — Pre/Post fight narrative
     ═══════════════════════════════════════════════════════ */
  if (phase === "story-dialogue" && currentStoryChapter) {
    const dialogues = storyDialogueType === "pre"
      ? currentStoryChapter.preDialogue
      : storyDialogueType === "post-win"
      ? currentStoryChapter.postVictoryDialogue
      : currentStoryChapter.postDefeatDialogue;
    const currentLine = dialogues[storyDialogueIndex];

    if (!currentLine) {
      // Safety: advance
      advanceStoryDialogue();
      return null;
    }

    const speakerColor = currentLine.speakerColor
      || (currentLine.speaker === "prisoner" ? "#a78bfa"
        : currentLine.speaker === "narrator" ? "#94a3b8"
        : "#e2e8f0");

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #030508 100%)" }}
        onClick={advanceStoryDialogue}
      >
        {/* Chapter title */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <div className="font-mono text-[10px] text-white/20 tracking-[0.3em]">
            CHAPTER {currentStoryChapter.chapter} — {currentStoryChapter.title}
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (storyDialogueType === "pre") {
              // Skip to fight
              setStoryDialogueIndex(dialogues.length - 1);
              advanceStoryDialogue();
            } else {
              // Skip to story select
              if (storyDialogueType === "post-win") {
                // Still need to process the win
                const newProgress: StoryProgress = {
                  ...storyProgress,
                  completedChapters: Array.from(new Set([...storyProgress.completedChapters, currentStoryChapter.id])),
                  unlockedFighters: Array.from(new Set([...storyProgress.unlockedFighters, currentStoryChapter.unlocksFighter])),
                  memoriesRecovered: currentStoryChapter.memoryFragment
                    ? Array.from(new Set([...storyProgress.memoriesRecovered, currentStoryChapter.memoryFragment]))
                    : storyProgress.memoriesRecovered,
                  currentChapter: Math.max(storyProgress.currentChapter, currentStoryChapter.chapter),
                  isComplete: currentStoryChapter.chapter === STORY_CHAPTERS.length,
                };
                setStoryProgress(newProgress);
                saveStoryProgress(newProgress);
                gam.unlockFighter(currentStoryChapter.unlocksFighter);
              }
              setPhase("story");
            }
          }}
          className="absolute top-4 right-4 font-mono text-xs text-white/30 hover:text-white/60 transition-colors z-10"
        >
          SKIP &gt;&gt;
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${storyDialogueType}-${storyDialogueIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg text-center"
          >
            {/* Speaker name */}
            {currentLine.speaker !== "narrator" && (
              <div className="font-display text-sm tracking-[0.2em] mb-3" style={{ color: speakerColor }}>
                {currentLine.speaker === "prisoner"
                  ? (storyProgress.completedChapters.length >= 6 ? "THE ORACLE" : "THE PRISONER")
                  : currentLine.speaker.toUpperCase()}
              </div>
            )}

            {/* Dialogue text */}
            <p className={`text-sm sm:text-base leading-relaxed ${
              currentLine.speaker === "narrator" ? "font-mono text-white/50 italic" : "font-mono text-white/80"
            }`}>
              {currentLine.speaker === "prisoner" && currentLine.text.startsWith("(")
                ? <span className="italic text-purple-300/70">{currentLine.text}</span>
                : currentLine.text
              }
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Memory fragment display on post-win */}
        {storyDialogueType === "post-win" && storyDialogueIndex === dialogues.length - 1 && currentStoryChapter.memoryFragment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-16 left-6 right-6 text-center"
          >
            <div className="font-mono text-[10px] text-purple-400/40 tracking-wider mb-1">\u2728 MEMORY RECOVERED</div>
            <div className="font-mono text-[10px] text-purple-300/50 italic">{currentStoryChapter.memoryFragment}</div>
          </motion.div>
        )}

        {/* Progress */}
        <div className="absolute bottom-4 flex gap-1">
          {dialogues.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= storyDialogueIndex ? "bg-cyan-400/50" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     CHARACTER SELECT — With Lore Popups
     ═══════════════════════════════════════════════════════ */
  if (phase === "select") {
    const displayFighter = hoveredFighter || (selectingFor === "player" ? selectedPlayer : selectedOpponent);
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 20%, #0d1a2e 0%, #070b14 60%, #030508 100%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button onClick={() => setPhase("title")} className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-1">
            <ChevronLeft size={16} /> BACK
          </button>
          <h2 className="font-display text-xs sm:text-sm tracking-[0.3em] text-white/80">
            {isTrainingMode && <span className="text-cyan-400 mr-2">[TRAINING]</span>}
            SELECT {selectingFor === "player" ? "YOUR FIGHTER" : "OPPONENT"}
          </h2>
          <div className="font-mono text-xs text-amber-400">{gam.gameSave.fightPoints} PTS</div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Fighter grid */}
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-2 px-1">ARCHONS & ALLIES</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-4">
              {STARTER_FIGHTERS.map(f => (
                <FighterCard key={f.id} fighter={f} available={true}
                  selected={selectedPlayer?.id === f.id || selectedOpponent?.id === f.id}
                  onSelect={() => handleFighterSelect(f)}
                  onHover={() => setHoveredFighter(f)}
                  onLeave={() => setHoveredFighter(null)}
                  onInfo={() => setShowLorePopup(f)} />
              ))}
            </div>

            <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-2 px-1">HIDDEN ROSTER</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-4">
              {UNLOCKABLE_FIGHTERS.map(f => {
                const available = isFighterAvailable(f);
                return (
                  <FighterCard key={f.id} fighter={f} available={available}
                    selected={selectedPlayer?.id === f.id || selectedOpponent?.id === f.id}
                    onSelect={() => available ? handleFighterSelect(f) : handleUnlock(f)}
                    onHover={() => setHoveredFighter(f)}
                    onLeave={() => setHoveredFighter(null)}
                    onInfo={() => setShowLorePopup(f)}
                    canAfford={gam.gameSave.fightPoints >= f.unlockCost} />
                );
              })}
            </div>

            <div className="font-mono text-[10px] text-red-500/60 tracking-[0.3em] mb-2 px-1 flex items-center gap-2">
              <span className="h-px flex-1 bg-red-500/20" />
              HIERARCHY OF THE DAMNED
              <span className="h-px flex-1 bg-red-500/20" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {DEMON_FIGHTERS.map(f => {
                const available = isFighterAvailable(f);
                return (
                  <FighterCard key={f.id} fighter={f} available={available}
                    selected={selectedPlayer?.id === f.id || selectedOpponent?.id === f.id}
                    onSelect={() => available ? handleFighterSelect(f) : handleUnlock(f)}
                    onHover={() => setHoveredFighter(f)}
                    onLeave={() => setHoveredFighter(null)}
                    onInfo={() => setShowLorePopup(f)}
                    canAfford={gam.gameSave.fightPoints >= f.unlockCost} />
                );
              })}
            </div>
          </div>

          {/* Fighter detail panel — desktop */}
          <div className="hidden lg:flex w-72 border-l border-white/10 p-4 flex-col">
            <FighterDetailPanel fighter={displayFighter} traitBonuses={activeBonuses} activePotential={traitBonuses.data?.activePotential} />
            <MatchupBar
              selectedPlayer={selectedPlayer}
              selectedOpponent={selectedOpponent}
              onContinue={() => setPhase("difficulty")}
            />
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="lg:hidden border-t border-white/10 p-3">
          <MatchupBar
            selectedPlayer={selectedPlayer}
            selectedOpponent={selectedOpponent}
            onContinue={() => setPhase("difficulty")}
          />
        </div>

        {/* Lore Popup Modal */}
        <AnimatePresence>
          {showLorePopup && (
            <LorePopup fighter={showLorePopup} onClose={() => setShowLorePopup(null)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ═══ DIFFICULTY SELECT ═══ */
  if (phase === "difficulty") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #070b14 60%, #030508 100%)" }}>
        <button onClick={() => setPhase("select")} className="absolute top-4 left-4 text-white/50 hover:text-white font-mono text-sm flex items-center gap-1">
          <ChevronLeft size={16} /> BACK
        </button>
        <h2 className="font-display text-xl tracking-[0.3em] text-white/80 mb-8">SELECT DIFFICULTY</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          {DIFFICULTIES.map((d) => (
            <motion.button
              key={d.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedDifficulty(d); setPhase("arena"); }}
              className={`p-5 rounded-lg border-2 text-left transition-all ${
                selectedDifficulty.id === d.id
                  ? "border-cyan-500/60 bg-cyan-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="font-display text-lg tracking-wider text-white mb-1">{d.name}</div>
              <div className="font-mono text-xs text-white/40 mb-2">{d.description}</div>
              <div className="flex gap-3 font-mono text-[10px]">
                <span className="text-red-400">DMG x{d.damageMultiplier}</span>
                <span className="text-amber-400">PTS x{d.pointsMultiplier}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  /* ═══ ARENA SELECT ═══ */
  if (phase === "arena") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #070b14 60%, #030508 100%)" }}>
        <button onClick={() => setPhase("difficulty")} className="absolute top-4 left-4 text-white/50 hover:text-white font-mono text-sm flex items-center gap-1">
          <ChevronLeft size={16} /> BACK
        </button>
        <h2 className="font-display text-xl tracking-[0.3em] text-white/80 mb-8">SELECT ARENA</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
          {ARENAS.map((a) => (
            <motion.button
              key={a.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedArena(a)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedArena.id === a.id ? "ring-1 ring-white/20" : "border-white/10 hover:border-white/30"
              }`}
              style={{
                background: a.bgGradient,
                borderColor: selectedArena.id === a.id ? a.ambientColor : undefined,
              }}
            >
              <div className="font-display text-sm tracking-wider text-white">{a.name}</div>
              <div className="w-full h-2 rounded mt-2" style={{ background: a.floorColor, boxShadow: `0 0 8px ${a.ambientColor}40` }} />
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startFight}
          className="px-10 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500/60 text-cyan-400 font-display text-xl tracking-wider hover:bg-cyan-500/30 transition-all"
          style={{ textShadow: "0 0 10px rgba(34,211,238,0.5)" }}
        >
          <Swords className="inline mr-2" size={20} /> BEGIN COMBAT
        </motion.button>
      </div>
    );
  }

  /* ═══ FIGHTING ═══ */
  if (phase === "fighting" && selectedPlayer && selectedOpponent) {
    const isStoryFight = !!currentStoryChapter && !isTrainingMode;
    return (
      <LandscapeEnforcer forceRotate>
        <div className="fixed inset-0 z-50 bg-black" style={{ width: "100%", height: "100%" }}>
          <FightArena3D
            player={boostedPlayer!}
            opponent={selectedOpponent}
            arena={selectedArena}
            difficulty={selectedDifficulty}
            onMatchEnd={isTrainingMode ? () => { setIsTrainingMode(false); resetToSelect(); } : isStoryFight ? handleStoryMatchEnd : handleMatchEnd}
            onBack={() => {
              setIsTrainingMode(false);
              if (isStoryFight) {
                setPhase("story");
              } else {
                resetToSelect();
              }
            }}
            trainingMode={isTrainingMode}
          />
        </div>
      </LandscapeEnforcer>
    );
  }

  /* ═══ RESULTS ═══ */
  if (phase === "results" && matchResult) {
    const isVictory = matchResult.winner === "p1";
    const winner = isVictory ? selectedPlayer! : selectedOpponent!;
    const basePt = isVictory ? Math.round(
      (selectedDifficulty.id === "nightmare" ? 100 : selectedDifficulty.id === "hard" ? 60 : selectedDifficulty.id === "normal" ? 40 : 20)
      * selectedDifficulty.pointsMultiplier
    ) : 0;
    const nftMultiplier = holderPerks?.perks.fightPointsMultiplier || 1.0;
    const ptGain = Math.round(basePt * nftMultiplier);
    const bonusPt = ptGain - basePt;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: isVictory
          ? "radial-gradient(ellipse at 50% 50%, #0a1a0a 0%, #001a00 50%, #030508 100%)"
          : "radial-gradient(ellipse at 50% 50%, #1a0a0a 0%, #1a0000 50%, #030508 100%)"
        }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="font-mono text-xs tracking-[0.4em] mb-2" style={{ color: isVictory ? "#22c55e" : "#ef4444" }}>
            {isVictory ? "VICTORY" : "DEFEAT"}
          </div>
          <div className="w-28 h-28 mx-auto rounded-lg overflow-hidden border-2 mb-4" style={{ borderColor: winner.color }}>
            <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-1" style={{ color: winner.color }}>{winner.name}</h2>
          <div className="font-mono text-sm text-white/40 mb-6">{isVictory ? "WINS THE MATCH" : "DEFEATS YOU"}</div>

          {matchResult.perfect && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-display text-2xl text-amber-400 mb-4" style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}>
              PERFECT VICTORY!
            </motion.div>
          )}

          {isVictory && (
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-[10px] text-white/40">POINTS</div>
                <div className="font-display text-lg text-amber-400">+{ptGain}</div>
                {bonusPt > 0 && (
                  <div className="font-mono text-[8px] text-purple-400">
                    +{bonusPt} NFT BONUS
                  </div>
                )}
              </div>
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-[10px] text-white/40">STREAK</div>
                <div className="font-display text-lg text-green-400">{gam.gameSave.winStreak}</div>
              </div>
              {holderPerks?.isHolder && (
                <div className="px-4 py-2 rounded border" style={{ background: "rgba(147,51,234,0.1)", borderColor: "rgba(147,51,234,0.3)" }}>
                  <div className="font-mono text-[10px] text-purple-400/60">TITLE</div>
                  <div className="font-display text-xs text-purple-300">{holderPerks.perks.title}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={resetToSelect}
              className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-all">
              NEW FIGHT
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPhase("title")}
              className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 font-mono text-sm hover:bg-white/10 transition-all">
              MAIN MENU
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════
   FIGHTER CARD — Grid item with info button
   ═══════════════════════════════════════════════════════ */
function FighterCard({ fighter, available, selected, onSelect, onHover, onLeave, onInfo, canAfford }: {
  fighter: FighterData;
  available: boolean;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onInfo: () => void;
  canAfford?: boolean;
}) {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: available ? 1.08 : 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSelect}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square w-full ${
          selected
            ? "border-cyan-400 ring-2 ring-cyan-400/30"
            : available
            ? "border-white/20 hover:border-white/40"
            : "border-white/10 opacity-60"
        }`}
      >
        <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-1.5">
          <div className="font-mono text-[9px] sm:text-[10px] text-white truncate font-bold">{fighter.name}</div>
          <div className="w-full h-0.5 rounded mt-0.5" style={{ background: FACTION_COLORS[fighter.faction] }} />
        </div>

        {!available && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Lock size={14} className="text-white/40 mb-1" />
            <div className="font-mono text-[9px]" style={{ color: canAfford ? "#22c55e" : "#ef4444" }}>
              {fighter.unlockCost} PTS
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-cyan-500 flex items-center justify-center">
            <Star size={8} className="text-white" />
          </div>
        )}
      </motion.button>

      {/* Info button */}
      <button
        onClick={(e) => { e.stopPropagation(); onInfo(); }}
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
      >
        <Info size={10} className="text-white/50" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FIGHTER DETAIL PANEL — Stats sidebar
   ═══════════════════════════════════════════════════════ */
function FighterDetailPanel({ fighter, traitBonuses: bonuses, activePotential }: {
  fighter: FighterData | null;
  traitBonuses?: { total: { attack: number; defense: number; hp: number; speed: number }; breakdown: Array<{ source: string; bonus: { attack: number; defense: number; hp: number; speed: number; label: string; color: string } }> } | null;
  activePotential?: { tokenId: number; name: string; level: number; nftClass: string | null; weapon: string | null; specie: string | null } | null;
}) {
  if (!fighter) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-mono text-sm text-white/20">Select a fighter</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="relative mb-3 rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
        <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <div className="font-display text-lg font-bold text-white">{fighter.name}</div>
          <div className="font-mono text-[10px]" style={{ color: FACTION_COLORS[fighter.faction] }}>{fighter.title}</div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <StatBar label="HP" value={fighter.hp} max={140} icon={<Heart size={10} />} color="#ef4444" bonus={bonuses?.total.hp} />
        <StatBar label="ATK" value={fighter.attack} max={12} icon={<Swords size={10} />} color="#f59e0b" bonus={bonuses?.total.attack} />
        <StatBar label="DEF" value={fighter.defense} max={12} icon={<Shield size={10} />} color="#22c55e" bonus={bonuses?.total.defense} />
        <StatBar label="SPD" value={fighter.speed} max={12} icon={<Wind size={10} />} color="#22d3ee" bonus={bonuses?.total.speed} />
      </div>

      {/* Trait Bonuses from NFT Potentials */}
      {bonuses && bonuses.breakdown.length > 0 && (
        <div className="rounded-md border border-purple-500/20 bg-purple-500/5 p-2 mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Gem size={10} className="text-purple-400" />
            <span className="font-mono text-[9px] font-bold text-purple-300 tracking-wider">NFT TRAIT BONUSES</span>
          </div>
          {activePotential && (
            <div className="font-mono text-[8px] text-purple-400/60 mb-1.5">
              via {activePotential.name} (Lv.{activePotential.level})
            </div>
          )}
          <div className="space-y-0.5">
            {bonuses.breakdown.map((b, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-mono text-[8px]" style={{ color: b.bonus.color }}>{b.bonus.label}</span>
                <span className="font-mono text-[8px] text-white/40">
                  {b.bonus.attack > 0 && `+${b.bonus.attack} ATK `}
                  {b.bonus.defense > 0 && `+${b.bonus.defense} DEF `}
                  {b.bonus.hp > 0 && `+${b.bonus.hp} HP `}
                  {b.bonus.speed > 0 && `+${b.bonus.speed} SPD`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md border p-2" style={{ borderColor: fighter.special.color + "40", background: fighter.special.color + "10" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Zap size={12} style={{ color: fighter.special.color }} />
          <span className="font-mono text-[10px] font-bold" style={{ color: fighter.special.color }}>{fighter.special.name}</span>
        </div>
        <p className="font-mono text-[9px] text-white/50">{fighter.special.description}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MATCHUP BAR — Selected fighters + continue
   ═══════════════════════════════════════════════════════ */
function MatchupBar({ selectedPlayer, selectedOpponent, onContinue }: {
  selectedPlayer: FighterData | null;
  selectedOpponent: FighterData | null;
  onContinue: () => void;
}) {
  return (
    <div className="border-t lg:border-t-0 border-white/10 pt-3 lg:mt-3">
      <div className="flex gap-3 items-center mb-3">
        <div className="flex-1 text-center">
          <div className="font-mono text-[9px] text-white/30 mb-1">PLAYER</div>
          {selectedPlayer ? (
            <div className="w-10 h-10 mx-auto rounded-md overflow-hidden border-2" style={{ borderColor: selectedPlayer.color }}>
              <img src={selectedPlayer.image} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-md border-2 border-dashed border-white/20 flex items-center justify-center">
              <span className="text-white/20 text-lg">?</span>
            </div>
          )}
        </div>
        <Swords size={18} className="text-cyan-500/50" />
        <div className="flex-1 text-center">
          <div className="font-mono text-[9px] text-white/30 mb-1">OPPONENT</div>
          {selectedOpponent ? (
            <div className="w-10 h-10 mx-auto rounded-md overflow-hidden border-2" style={{ borderColor: selectedOpponent.color }}>
              <img src={selectedOpponent.image} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-md border-2 border-dashed border-white/20 flex items-center justify-center">
              <span className="text-white/20 text-lg">?</span>
            </div>
          )}
        </div>
      </div>

      {selectedPlayer && selectedOpponent && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-display text-sm tracking-wider hover:bg-cyan-500/30 transition-all"
        >
          CONTINUE
        </motion.button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LORE POPUP — Full character details modal
   ═══════════════════════════════════════════════════════ */
function LorePopup({ fighter, onClose }: { fighter: FighterData; onClose: () => void }) {
  const lore = FIGHTER_LORE[fighter.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border border-white/10"
        style={{ background: "linear-gradient(180deg, #0d1a2e 0%, #070b14 100%)" }}
      >
        {/* Header with image */}
        <div className="relative h-48 overflow-hidden">
          <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
            <X size={16} className="text-white/60" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="font-display text-2xl font-bold text-white">{fighter.name}</div>
            <div className="font-mono text-xs" style={{ color: FACTION_COLORS[fighter.faction] }}>{fighter.title}</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "HP", value: fighter.hp, color: "#ef4444" },
              { label: "ATK", value: fighter.attack, color: "#f59e0b" },
              { label: "DEF", value: fighter.defense, color: "#22c55e" },
              { label: "SPD", value: fighter.speed, color: "#22d3ee" },
            ].map(s => (
              <div key={s.label} className="text-center py-2 rounded-lg bg-white/5 border border-white/5">
                <div className="font-mono text-[8px] text-white/30">{s.label}</div>
                <div className="font-display text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Backstory */}
          {lore && (
            <>
              <div>
                <div className="font-display text-xs tracking-[0.2em] text-cyan-400/60 mb-2">BACKSTORY</div>
                <p className="font-mono text-xs text-white/60 leading-relaxed">{lore.backstory}</p>
              </div>

              {/* Quote */}
              <div className="border-l-2 pl-3" style={{ borderColor: fighter.color + "60" }}>
                <p className="font-mono text-xs italic" style={{ color: fighter.color + "80" }}>
                  "{lore.quote}"
                </p>
              </div>

              {/* Powers */}
              <div>
                <div className="font-display text-xs tracking-[0.2em] text-amber-400/60 mb-2">POWERS</div>
                <div className="flex flex-wrap gap-1.5">
                  {lore.powers.map(p => (
                    <span key={p} className="font-mono text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arena Role */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Gamepad2 size={14} className="text-white/30" />
                <span className="font-mono text-xs text-white/40">{lore.arenaRole}</span>
              </div>
            </>
          )}

          {/* Special Move */}
          <div className="rounded-lg border p-3" style={{ borderColor: fighter.special.color + "30", background: fighter.special.color + "08" }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} style={{ color: fighter.special.color }} />
              <span className="font-display text-sm font-bold" style={{ color: fighter.special.color }}>{fighter.special.name}</span>
            </div>
            <p className="font-mono text-xs text-white/50">{fighter.special.description}</p>
            <div className="flex gap-3 mt-2 font-mono text-[10px] text-white/30">
              <span>DMG: {fighter.special.damage}</span>
              <span>CD: {(fighter.special.cooldown / 60).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══ STAT BAR ═══ */
function StatBar({ label, value, max, icon, color, bonus }: { label: string; value: number; max: number; icon: React.ReactNode; color: string; bonus?: number }) {
  const pct = (value / max) * 100;
  const bonusPct = bonus ? ((value + bonus) / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 flex justify-center" style={{ color }}>{icon}</div>
      <div className="font-mono text-[9px] text-white/40 w-6">{label}</div>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
        {bonus && bonus > 0 && (
          <div className="absolute h-full rounded-full" style={{ width: `${Math.min(bonusPct, 100)}%`, background: "rgba(168,85,247,0.4)" }} />
        )}
        <div className="h-full rounded-full transition-all relative" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="font-mono text-[9px] text-white/60 w-5 text-right">
        {value}
        {bonus && bonus > 0 && <span className="text-purple-400">+{bonus}</span>}
      </div>
    </div>
  );
}
