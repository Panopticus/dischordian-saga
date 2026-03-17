import { useMemo } from "react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
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
            className="text-zinc-800" strokeWidth={4}
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
      <span className="font-mono text-[9px] text-muted-foreground tracking-wider uppercase">{label}</span>
    </div>
  );
}

/* ═══ ACHIEVEMENT BADGE ═══ */
function AchievementBadge({ name, earned }: { name: string; earned: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
      earned
        ? "border-amber-500/30 bg-amber-950/20"
        : "border-zinc-700/20 bg-zinc-900/30 opacity-40"
    }`}>
      <Trophy size={14} className={earned ? "text-amber-400" : "text-zinc-600"} />
      <span className={`font-mono text-[10px] ${earned ? "text-amber-300" : "text-zinc-600"}`}>
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
        : "border-zinc-700/20 bg-zinc-900/30 opacity-50"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        unlocked ? "bg-primary/20" : "bg-zinc-800"
      }`}>
        {unlocked ? <Unlock size={14} className="text-primary" /> : <Lock size={14} className="text-zinc-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-mono text-xs font-semibold truncate ${unlocked ? "text-foreground" : "text-zinc-600"}`}>
          {room.name}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          {visited && (
            <span className="font-mono text-[9px] text-muted-foreground">
              {visits} visit{visits !== 1 ? "s" : ""}
            </span>
          )}
          {items > 0 && (
            <span className="font-mono text-[9px] text-accent">
              {items}/{totalHotspots} items
            </span>
          )}
          {hasPuzzle && (
            <span className={`font-mono text-[9px] ${puzzleSolved ? "text-emerald-400" : "text-zinc-500"}`}>
              {puzzleSolved ? "PUZZLE ✓" : "PUZZLE"}
            </span>
          )}
          {eggFound && (
            <span className="font-mono text-[9px] text-purple-400">EGG ✓</span>
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
                  <Sword size={12} className="text-red-400" />
                  <span className="font-mono text-xs text-red-300">{charInfo.attrAttack} ATK</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-blue-400" />
                  <span className="font-mono text-xs text-blue-300">{charInfo.attrDefense} DEF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-emerald-400" />
                  <span className="font-mono text-xs text-emerald-300">{charInfo.attrVitality} VIT</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overall Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/30 bg-card/30 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-primary" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">MISSION COMPLETION</h3>
            <span className="ml-auto font-display text-2xl font-bold text-primary">{stats.completionPct}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-4">
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
            <StatRing value={stats.eggsFound} max={stats.totalEggs} label="Eggs" icon={Eye} color="text-purple-400" />
            <StatRing value={stats.totalOwnedCards} max={stats.totalPossibleCards} label="Cards" icon={Crown} color="text-amber-400" />
            <StatRing value={stats.battlesWon} max={Math.max(stats.battlesPlayed, 1)} label="Battles" icon={Sword} color="text-red-400" />
            <StatRing value={stats.totalItems} max={30} label="Items" icon={Gem} color="text-emerald-400" />
          </div>
        </motion.div>

        {/* Battle Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/30 bg-card/30 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-red-400" />
            <h3 className="font-display text-xs font-bold tracking-[0.2em]">COMBAT RECORD</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-700/20">
              <p className="font-display text-2xl font-bold text-foreground">{stats.battlesPlayed}</p>
              <p className="font-mono text-[9px] text-muted-foreground tracking-wider">BATTLES</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-950/20 border border-emerald-700/20">
              <p className="font-display text-2xl font-bold text-emerald-400">{stats.battlesWon}</p>
              <p className="font-mono text-[9px] text-emerald-500/70 tracking-wider">VICTORIES</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-950/20 border border-red-700/20">
              <p className="font-display text-2xl font-bold text-red-400">{stats.battlesPlayed - stats.battlesWon}</p>
              <p className="font-mono text-[9px] text-red-500/70 tracking-wider">DEFEATS</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-950/20 border border-amber-700/20">
              <p className="font-display text-2xl font-bold text-amber-400">
                {stats.battlesPlayed > 0 ? Math.round((stats.battlesWon / stats.battlesPlayed) * 100) : 0}%
              </p>
              <p className="font-mono text-[9px] text-amber-500/70 tracking-wider">WIN RATE</p>
            </div>
          </div>
        </motion.div>

        {/* Room Exploration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border/30 bg-card/30 p-5"
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
          className="rounded-xl border border-border/30 bg-card/30 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-amber-400" />
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

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { href: "/card-gallery", label: "Card Gallery", icon: Crown, color: "text-amber-400" },
            { href: "/ark", label: "Explore Ark", icon: Compass, color: "text-primary" },
            { href: "/battle", label: "Card Battle", icon: Sword, color: "text-red-400" },
            { href: "/codex", label: "Lore Codex", icon: BookOpen, color: "text-accent" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-3 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 hover:border-primary/30 transition-all group"
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
