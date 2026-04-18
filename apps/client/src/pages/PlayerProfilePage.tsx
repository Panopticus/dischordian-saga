import { useMemo, useEffect } from "react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { generateStarterDeck } from "@/components/StarterDeckViewer";
import { ROOM_EASTER_EGGS, getBonusCards } from "@/components/EasterEggs";
import { ROOM_PUZZLES } from "@/components/PuzzleSystem";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft, User, MapPin, Puzzle, Eye, Sword, Crown,
  Trophy, Star, Lock, Unlock, Shield, Zap, Target,
  Compass, BookOpen, Gem, BarChart3
} from "lucide-react";
import CharacterBonusesPanel from "@/components/CharacterBonusesPanel";
import { ClassMasteryPanel } from "@/components/ClassMasteryPanel";
import { SynergyBonusesPanel } from "@/components/SynergyBonusesPanel";
import { BranchingMasteryPanel } from "@/components/BranchingMasteryPanel";
import { CitizenTalentsPanel } from "@/components/CitizenTalentsPanel";
import { CivilSkillsPanel } from "@/components/CivilSkillsPanel";
import { ElementalCombosPanel } from "@/components/ElementalCombosPanel";
import { CompanionSynergyPanel } from "@/components/CompanionSynergyPanel";
import { PrestigeClassPanel } from "@/components/PrestigeClassPanel";
import { AchievementTraitsPanel } from "@/components/AchievementTraitsPanel";

/* ═══ STAT RING ═══ */
function StatRing({ value, max, label, icon: Icon, color, size = 80 }: {
  value: number; max: number; label: string;
  icon: typeof Star; color: string; size?: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor"
            className="void-text" strokeWidth={4}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor"
            className={color} strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={16} className={color} />
          <span className="font-display text-sm font-bold mt-0.5">{value}/{max}</span>
        </div>
      </div>
      <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">{label}</span>
    </div>
  );
}

/* ═══ ACHIEVEMENT BADGE ═══ */
function AchievementBadge({ name, earned }: { name: string; earned: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
      earned
        ? "void-border void-bg-sunk"
        : "void-border void-bg-canvas opacity-40"
    }`}>
      <Trophy size={14} className={earned ? "void-text-accent" : "void-text"} />
      <span className={`font-mono text-xs ${earned ? "void-text-accent" : "void-text"}`}>
        {earned ? name : "???"}
      </span>
    </div>
  );
}

/* ═══ ROOM STATUS ROW ═══ */
function RoomStatusRow({ room, state }: {
  room: typeof ROOM_DEFINITIONS[0];
  state: { unlocked: boolean; visited: boolean; visitCount: number; itemsFound: string[]; elaraDialogSeen: boolean } | undefined;
}) {
  const unlocked = state?.unlocked ?? false;
  const visited = state?.visited ?? false;
  const visits = state?.visitCount ?? 0;
  const items = state?.itemsFound?.length ?? 0;
  const totalHotspots = room.hotspots.length;
  const eggFound = room.hotspots.some(h =>
    h.id.startsWith("egg-") && state?.itemsFound?.includes(h.id)
  );
  const hasPuzzle = !!ROOM_PUZZLES[room.id];
  const puzzleSolved = (() => {
    try {
      const solved = JSON.parse(localStorage.getItem("loredex_puzzles_solved") || "[]");
      return solved.includes(room.id);
    } catch { return false; }
  })();

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
      unlocked
        ? "border-primary/20 bg-primary/5 hover:bg-primary/10"
        : "void-border void-bg-canvas opacity-50"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        unlocked ? "bg-primary/20" : "void-bg-canvas"
      }`}>
        {unlocked ? <Unlock size={14} className="text-primary" /> : <Lock size={14} className="void-text" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-mono text-xs font-semibold truncate ${unlocked ? "text-foreground" : "void-text"}`}>
          {room.name}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          {visited && (
            <span className="font-mono text-xs text-muted-foreground">
              {visits} visit{visits !== 1 ? "s" : ""}
            </span>
          )}
          {items > 0 && (
            <span className="font-mono text-xs text-accent">
              {items}/{totalHotspots} items
            </span>
          )}
          {hasPuzzle && (
            <span className={`font-mono text-xs ${puzzleSolved ? "void-text-energy" : "void-text"}`}>
              {puzzleSolved ? "PUZZLE ✓" : "PUZZLE"}
            </span>
          )}
          {eggFound && (
            <span className="font-mono text-xs void-text-system">EGG ✓</span>
          )}
        </div>
      </div>
      {unlocked && (
        <Link href="/ark" className="text-primary/50 hover:text-primary transition-colors">
          <Compass size={14} />
        </Link>
      )}
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function PlayerProfilePage() {
  const { state } = useGame();
  const { isAuthenticated } = useAuth();
  const saveProgress = trpc.gameState.save.useMutation();
  const { data: serverData } = trpc.gameState.load.useQuery(undefined, { enabled: isAuthenticated });
  const { data: contentStats } = trpc.contentReward.stats.useQuery(undefined, { enabled: isAuthenticated });

  // Compute all stats
  const stats = useMemo(() => {
    const totalRooms = ROOM_DEFINITIONS.length;
    const unlockedRooms = Object.values(state.rooms).filter(r => r.unlocked).length;
    const visitedRooms = Object.values(state.rooms).filter(r => r.visited).length;

    const totalPuzzles = Object.keys(ROOM_PUZZLES).length;
    let puzzlesSolved = 0;
    try {
      const solved = JSON.parse(localStorage.getItem("loredex_puzzles_solved") || "[]");
      puzzlesSolved = solved.length;
    } catch { /* ignore */ }

    const totalEggs = Object.keys(ROOM_EASTER_EGGS).length;
    const eggsFound = state.itemsCollected.filter(id => id.startsWith("egg-")).length;

    const bonusCards = getBonusCards();
    const starterCards = state.characterCreated ? generateStarterDeck({
      species: state.characterChoices.species || undefined,
      characterClass: state.characterChoices.characterClass || undefined,
      alignment: state.characterChoices.alignment || undefined,
      element: state.characterChoices.element || undefined,
      name: state.characterChoices.name,
    }).length : 0;
    const totalOwnedCards = starterCards + bonusCards.length;
    const totalPossibleCards = starterCards + 10 + 5 + 5; // starter + eggs + battle + discovery

    let battlesWon = 0;
    let battlesPlayed = 0;
    try {
      const bs = JSON.parse(localStorage.getItem("loredex_battle_stats") || "{}");
      battlesWon = bs.totalWins || 0;
      battlesPlayed = bs.totalGames || 0;
    } catch { /* ignore */ }

    const totalItems = state.itemsCollected.length;
    const achievementsEarned = state.achievementsEarned.length;

    // Overall completion percentage
    const weights = {
      rooms: { current: unlockedRooms, max: totalRooms, weight: 25 },
      puzzles: { current: puzzlesSolved, max: totalPuzzles, weight: 20 },
      eggs: { current: eggsFound, max: totalEggs, weight: 15 },
      cards: { current: totalOwnedCards, max: totalPossibleCards, weight: 20 },
      battles: { current: Math.min(battlesWon, 5), max: 5, weight: 10 },
      items: { current: Math.min(totalItems, 30), max: 30, weight: 10 },
    };
    let totalPct = 0;
    Object.values(weights).forEach(w => {
      totalPct += (w.current / Math.max(w.max, 1)) * w.weight;
    });

    return {
      totalRooms, unlockedRooms, visitedRooms,
      totalPuzzles, puzzlesSolved,
      totalEggs, eggsFound,
      totalOwnedCards, totalPossibleCards,
      battlesWon, battlesPlayed,
      totalItems, achievementsEarned,
      completionPct: Math.round(totalPct),
    };
  }, [state]);

  // Auto-save to server when stats change (debounced)
  useEffect(() => {
    if (!isAuthenticated || !state.characterCreated) return;
    const timer = setTimeout(() => {
      saveProgress.mutate({
        gameState: state as any,
        stats: {
          roomsUnlocked: stats.unlockedRooms,
          totalRooms: stats.totalRooms,
          puzzlesSolved: stats.puzzlesSolved,
          totalPuzzles: stats.totalPuzzles,
          easterEggsFound: stats.eggsFound,
          totalEasterEggs: stats.totalEggs,
          battlesWon: stats.battlesWon,
          battlesPlayed: stats.battlesPlayed,
          cardsCollected: stats.totalOwnedCards,
          totalCards: stats.totalPossibleCards,
          completionPercent: stats.completionPct,
          rank: stats.completionPct >= 90 ? "Ascended" : stats.completionPct >= 70 ? "Veteran" : stats.completionPct >= 40 ? "Operative" : "Recruit",
        },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, stats.completionPct]);

  // Character info
  const charInfo = state.characterChoices;
  const speciesLabel = charInfo.species ? charInfo.species.charAt(0).toUpperCase() + charInfo.species.slice(1) : "Unknown";
  const classLabel = charInfo.characterClass ? charInfo.characterClass.charAt(0).toUpperCase() + charInfo.characterClass.slice(1) : "Unknown";

  // Known achievements
  const knownAchievements = [
    "First Steps", "Explorer", "Puzzle Master", "Card Collector",
    "Battle Initiate", "Egg Hunter", "Lore Scholar", "Ship Navigator",
    "Void Walker", "Full Access", "Completionist", "Secret Keeper",
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <User size={18} className="text-primary" />
            <h1 className="font-display text-sm font-bold tracking-[0.2em]">OPERATIVE DOSSIER</h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Character Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5 p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Shield size={28} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                {charInfo.name || "UNNAMED POTENTIAL"}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="font-mono text-xs text-primary">{speciesLabel}</span>
                <span className="font-mono text-xs text-accent">{classLabel}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {charInfo.alignment === "order" ? "Order" : charInfo.alignment === "chaos" ? "Chaos" : "Unaligned"}
                </span>
                {charInfo.element && (
                  <span className="font-mono text-xs text-chart-4">{charInfo.element}</span>
                )}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Sword size={12} className="void-text-error" />
                  <span className="font-mono text-xs void-text-error">{charInfo.attrAttack} ATK</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="void-text-energy" />
                  <span className="font-mono text-xs void-text-energy">{charInfo.attrDefense} DEF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="void-text-energy" />
                  <span className="font-mono text-xs void-text-energy">{charInfo.attrVitality} VIT</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Character Bonuses — how build affects all game systems */}
        <CharacterBonusesPanel />

        {/* Class Mastery — progression through class-aligned actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <ClassMasteryPanel />
        </motion.div>

        {/* Synergy Bonuses — hidden build combos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <SynergyBonusesPanel />
        </motion.div>

        {/* Branching Mastery — specialization choice at rank 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <BranchingMasteryPanel />
        </motion.div>

        {/* Citizen Talents — powerful passives at milestone levels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <CitizenTalentsPanel />
        </motion.div>

        {/* Civil Skills — non-combat proficiencies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <CivilSkillsPanel />
        </motion.div>

        {/* Elemental Combos — element interaction effects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <ElementalCombosPanel />
        </motion.div>

        {/* Companion Synergies — companion build compatibility */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <CompanionSynergyPanel />
        </motion.div>

        {/* Prestige Classes — endgame cross-class specializations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <PrestigeClassPanel />
        </motion.div>

        {/* Achievement Traits — traits unlocked by achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <AchievementTraitsPanel />
        </motion.div>

        {/* Overall Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="void-surface p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-primary" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">MISSION COMPLETION</h3>
            <span className="ml-auto font-display text-2xl font-bold text-primary">{stats.completionPct}%</span>
          </div>
          <div className="w-full h-3 void-bg-canvas rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionPct}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-accent to-chart-4 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            <StatRing value={stats.unlockedRooms} max={stats.totalRooms} label="Rooms" icon={MapPin} color="text-primary" />
            <StatRing value={stats.puzzlesSolved} max={stats.totalPuzzles} label="Puzzles" icon={Puzzle} color="text-accent" />
            <StatRing value={stats.eggsFound} max={stats.totalEggs} label="Eggs" icon={Eye} color="void-text-system" />
            <StatRing value={stats.totalOwnedCards} max={stats.totalPossibleCards} label="Cards" icon={Crown} color="void-text-accent" />
            <StatRing value={stats.battlesWon} max={Math.max(stats.battlesPlayed, 1)} label="Battles" icon={Sword} color="void-text-error" />
            <StatRing value={stats.totalItems} max={30} label="Items" icon={Gem} color="void-text-energy" />
          </div>
        </motion.div>

        {/* Battle Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="void-surface p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="void-text-error" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">COMBAT RECORD</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg void-bg-canvas border void-border">
              <p className="font-display text-2xl font-bold text-foreground">{stats.battlesPlayed}</p>
              <p className="font-mono text-xs text-muted-foreground tracking-wider">BATTLES</p>
            </div>
            <div className="text-center p-3 rounded-lg void-bg-success border void-border-success">
              <p className="font-display text-2xl font-bold void-text-energy">{stats.battlesWon}</p>
              <p className="font-mono text-xs void-text-energy tracking-wider">VICTORIES</p>
            </div>
            <div className="text-center p-3 rounded-lg void-bg-error border void-border-error">
              <p className="font-display text-2xl font-bold void-text-error">{stats.battlesPlayed - stats.battlesWon}</p>
              <p className="font-mono text-xs void-text-error tracking-wider">DEFEATS</p>
            </div>
            <div className="text-center p-3 rounded-lg void-bg-sunk border void-border">
              <p className="font-display text-2xl font-bold void-text-accent">
                {stats.battlesPlayed > 0 ? Math.round((stats.battlesWon / stats.battlesPlayed) * 100) : 0}%
              </p>
              <p className="font-mono text-xs void-text-accent tracking-wider">WIN RATE</p>
            </div>
          </div>
        </motion.div>

        {/* Room Exploration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="void-surface p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Compass size={16} className="text-primary" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">ARK EXPLORATION</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {stats.unlockedRooms}/{stats.totalRooms} unlocked
            </span>
          </div>
          <div className="space-y-2">
            {ROOM_DEFINITIONS.map(room => (
              <RoomStatusRow
                key={room.id}
                room={room}
                state={state.rooms[room.id]}
              />
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="void-surface p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="void-text-accent" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">ACHIEVEMENTS</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {stats.achievementsEarned}/{knownAchievements.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {knownAchievements.map(name => (
              <AchievementBadge
                key={name}
                name={name}
                earned={state.achievementsEarned.includes(name)}
              />
            ))}
          </div>
        </motion.div>

        {/* Content Participation Stats */}
        {isAuthenticated && contentStats && contentStats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="void-surface border-chart-5/20 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-chart-5" />
              <h3 className="font-display text-xs font-bold tracking-[0.2em]">CONTENT PARTICIPATION</h3>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {contentStats.completed}/{contentStats.total} completed
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(contentStats.byType).map(([type, data]) => (
                <div key={type} className="p-3 rounded-lg void-bg-canvas border void-border">
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">
                    {type.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <p className="font-display text-lg font-bold">
                    {(data as any).completed}/{(data as any).total}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Server Sync Status */}
        {isAuthenticated && serverData && (
          <div className="text-center">
            <span className="font-mono text-xs text-muted-foreground/40">
              Last synced: {serverData.savedAt ? new Date(serverData.savedAt).toLocaleString() : "Never"}
            </span>
          </div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { href: "/card-gallery", label: "Card Gallery", icon: Crown, color: "void-text-accent" },
            { href: "/ark", label: "Explore Ark", icon: Compass, color: "text-primary" },
            { href: "/battle", label: "Card Battle", icon: Sword, color: "void-text-error" },
            { href: "/codex", label: "Lore Codex", icon: BookOpen, color: "text-accent" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-3 void-surface hover:border-primary/30 transition-all group"
            >
              <link.icon size={16} className={`${link.color} group-hover:scale-110 transition-transform`} />
              <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground transition-colors tracking-wider">
                {link.label}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
