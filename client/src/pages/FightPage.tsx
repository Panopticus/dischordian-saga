/* ═══════════════════════════════════════════════════════
   FALL OF REALITY — Fighting Game Page
   MK-style character select, difficulty, arena, combat
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Lock, Trophy, Star, Shield, Zap, Heart, Wind, ChevronLeft, ChevronRight, Gamepad2, AlertTriangle, Skull } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { useContentReward } from "@/components/ContentRewardToast";
import { toast } from "sonner";
import {
  STARTER_FIGHTERS, UNLOCKABLE_FIGHTERS, ALL_FIGHTERS,
  ARENAS, DIFFICULTIES,
  type FighterData, type ArenaData, type DifficultyLevel,
} from "@/game/gameData";
import FightArena3D from "@/game/FightArena3D";

type Phase = "title" | "select" | "difficulty" | "arena" | "fighting" | "results";

const FACTION_COLORS: Record<string, string> = {
  empire: "#ef4444",
  insurgency: "#22c55e",
  neyons: "#818cf8",
  potentials: "#f59e0b",
  neutral: "#94a3b8",
};

// Invasion events — random faction attacks that trigger special fights
const INVASION_EVENTS = [
  { id: "empire-raid", faction: "empire", title: "EMPIRE RAID", description: "Imperial forces are attacking! Defend your territory.", minWins: 3, reward: 50 },
  { id: "neyon-incursion", faction: "neyons", title: "NEYON INCURSION", description: "Neyon digital entities are breaching the firewall.", minWins: 5, reward: 75 },
  { id: "warlord-assault", faction: "insurgency", title: "WARLORD'S ASSAULT", description: "The Warlord's forces launch a surprise attack!", minWins: 8, reward: 100 },
  { id: "void-breach", faction: "neutral", title: "VOID BREACH", description: "Unknown entities emerge from the void between realities.", minWins: 12, reward: 150 },
];

export default function FightPage() {
  const gam = useGamification();
  const { recordAndReward } = useContentReward();
  const [phase, setPhase] = useState<Phase>("title");
  const [activeInvasion, setActiveInvasion] = useState<typeof INVASION_EVENTS[0] | null>(null);
  const [invasionDefeated, setInvasionDefeated] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<FighterData | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<FighterData | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DIFFICULTIES[1]);
  const [selectedArena, setSelectedArena] = useState<ArenaData>(ARENAS[0]);
  const [selectingFor, setSelectingFor] = useState<"player" | "opponent">("player");
  const [matchResult, setMatchResult] = useState<{ winner: "p1" | "p2"; perfect: boolean } | null>(null);
  const [hoveredFighter, setHoveredFighter] = useState<FighterData | null>(null);

  const unlockedIds = useMemo(() => new Set(gam.gameSave.unlockedFighters), [gam.gameSave.unlockedFighters]);

  const isFighterAvailable = useCallback((f: FighterData) => {
    return !f.locked || unlockedIds.has(f.id);
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

  const handleMatchEnd = useCallback((winner: "p1" | "p2", perfect: boolean) => {
    setMatchResult({ winner, perfect });
    if (winner === "p1") {
      gam.recordFightWin(selectedDifficulty.id, perfect);
      // Record content participation for fight wins
      recordAndReward("fight_win", `fight-${Date.now()}`, true, {
        difficulty: selectedDifficulty.id,
        perfect,
        opponent: selectedOpponent?.name,
      });
      // Check if invasion was defeated
      if (activeInvasion) {
        setInvasionDefeated(true);
        // Award bonus fight points for invasion
        gam.recordFightWin(selectedDifficulty.id, false); // extra win credit
        toast.success(`Invasion Repelled: ${activeInvasion.title}`, {
          description: `+${activeInvasion.reward} bonus points! The threat has been neutralized.`,
          duration: 5000,
        });
        setActiveInvasion(null);
      }
    } else {
      gam.recordFightLoss();
      if (activeInvasion) {
        toast.error(`Invasion Failed: ${activeInvasion.title}`, {
          description: "The enemy advances. Regroup and try again.",
        });
      }
    }
    setPhase("results");
  }, [gam, selectedDifficulty, activeInvasion, recordAndReward, selectedOpponent]);

  // Check for random invasion events
  useEffect(() => {
    const totalWins = gam.gameSave.totalFights || 0;
    const eligible = INVASION_EVENTS.filter(e => totalWins >= e.minWins);
    if (eligible.length > 0 && !activeInvasion && phase === "title") {
      // 30% chance of invasion on title screen
      if (Math.random() < 0.3) {
        const invasion = eligible[Math.floor(Math.random() * eligible.length)];
        setActiveInvasion(invasion);
      }
    }
  }, [phase]);

  const resetToSelect = useCallback(() => {
    setPhase("select");
    setSelectedPlayer(null);
    setSelectedOpponent(null);
    setSelectingFor("player");
    setMatchResult(null);
  }, []);

  /* ─── TITLE SCREEN ─── */
  if (phase === "title") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a0020 50%, #0a0a1a 100%)" }}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#22d3ee" : "#f59e0b", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1], y: [0, -20, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center relative z-10">
          <div className="font-mono text-xs text-red-500/60 tracking-[0.4em] mb-2">THE DISCHORDIAN SAGA PRESENTS</div>
          <h1 className="font-display text-5xl sm:text-7xl font-black tracking-wider mb-2">
            <span className="text-red-500" style={{ textShadow: "0 0 30px rgba(239,68,68,0.5)" }}>FALL</span>
            <span className="text-white/80"> OF </span>
            <span className="text-cyan-400" style={{ textShadow: "0 0 30px rgba(34,211,238,0.5)" }}>REALITY</span>
          </h1>
          <div className="font-mono text-sm text-amber-500/60 tracking-[0.2em] mb-8">COMBAT SIMULATOR</div>

          <div className="flex flex-col gap-3 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setPhase("select"); setSelectingFor("player"); }}
              className="px-8 py-3 rounded-lg bg-red-500/20 border-2 border-red-500/60 text-red-400 font-display text-lg tracking-wider hover:bg-red-500/30 hover:border-red-500 transition-all"
              style={{ textShadow: "0 0 10px rgba(239,68,68,0.5)" }}
            >
              <Swords className="inline mr-2" size={20} /> FIGHT
            </motion.button>

            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 mt-4 text-center">
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-xs text-white/40">WINS</div>
                <div className="font-display text-lg text-green-400">{gam.progress.fightWins}</div>
              </div>
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-xs text-white/40">STREAK</div>
                <div className="font-display text-lg text-amber-400">{gam.gameSave.winStreak}</div>
              </div>
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-xs text-white/40">POINTS</div>
                <div className="font-display text-lg text-cyan-400">{gam.gameSave.fightPoints}</div>
              </div>
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-xs text-white/40">UNLOCKED</div>
                <div className="font-display text-lg text-purple-400">{gam.gameSave.unlockedFighters.length}/{UNLOCKABLE_FIGHTERS.length}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── CHARACTER SELECT ─── */
  if (phase === "select") {
    const displayFighter = hoveredFighter || (selectingFor === "player" ? selectedPlayer : selectedOpponent);
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #0f0f2e 100%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button onClick={() => setPhase("title")} className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-1">
            <ChevronLeft size={16} /> BACK
          </button>
          <h2 className="font-display text-sm tracking-[0.3em] text-white/80">
            SELECT {selectingFor === "player" ? "YOUR FIGHTER" : "OPPONENT"}
          </h2>
          <div className="font-mono text-xs text-amber-400">{gam.gameSave.fightPoints} PTS</div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Fighter grid */}
          <div className="flex-1 p-3 overflow-y-auto">
            {/* Starters */}
            <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-2 px-1">ARCHONS & ALLIES</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-4">
              {STARTER_FIGHTERS.map(f => (
                <FighterCard key={f.id} fighter={f} available={true}
                  selected={selectedPlayer?.id === f.id || selectedOpponent?.id === f.id}
                  onSelect={() => handleFighterSelect(f)}
                  onHover={() => setHoveredFighter(f)}
                  onLeave={() => setHoveredFighter(null)} />
              ))}
            </div>

            {/* Unlockables */}
            <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-2 px-1">HIDDEN ROSTER</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {UNLOCKABLE_FIGHTERS.map(f => {
                const available = isFighterAvailable(f);
                return (
                  <FighterCard key={f.id} fighter={f} available={available}
                    selected={selectedPlayer?.id === f.id || selectedOpponent?.id === f.id}
                    onSelect={() => available ? handleFighterSelect(f) : handleUnlock(f)}
                    onHover={() => setHoveredFighter(f)}
                    onLeave={() => setHoveredFighter(null)}
                    canAfford={gam.gameSave.fightPoints >= f.unlockCost} />
                );
              })}
            </div>
          </div>

          {/* Fighter detail panel */}
          <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-white/10 p-4 flex flex-col">
            <AnimatePresence mode="wait">
              {displayFighter ? (
                <motion.div key={displayFighter.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex-1">
                  <div className="relative mb-3 rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
                    <img src={displayFighter.image} alt={displayFighter.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="font-display text-lg font-bold text-white">{displayFighter.name}</div>
                      <div className="font-mono text-[10px]" style={{ color: FACTION_COLORS[displayFighter.faction] }}>{displayFighter.title}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-1.5 mb-3">
                    <StatBar label="HP" value={displayFighter.hp} max={130} icon={<Heart size={10} />} color="#ef4444" />
                    <StatBar label="ATK" value={displayFighter.attack} max={12} icon={<Swords size={10} />} color="#f59e0b" />
                    <StatBar label="DEF" value={displayFighter.defense} max={12} icon={<Shield size={10} />} color="#22c55e" />
                    <StatBar label="SPD" value={displayFighter.speed} max={12} icon={<Wind size={10} />} color="#22d3ee" />
                  </div>

                  {/* Special */}
                  <div className="rounded-md border p-2 mb-3" style={{ borderColor: displayFighter.special.color + "40", background: displayFighter.special.color + "10" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap size={12} style={{ color: displayFighter.special.color }} />
                      <span className="font-mono text-[10px] font-bold" style={{ color: displayFighter.special.color }}>{displayFighter.special.name}</span>
                    </div>
                    <p className="font-mono text-[9px] text-white/50">{displayFighter.special.description}</p>
                    <div className="font-mono text-[9px] text-white/30 mt-1">DMG: {displayFighter.special.damage} | CD: {(displayFighter.special.cooldown / 60).toFixed(1)}s</div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-mono text-sm text-white/20">Hover a fighter</p>
                </div>
              )}
            </AnimatePresence>

            {/* Selected display */}
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex gap-3 items-center mb-3">
                <div className="flex-1 text-center">
                  <div className="font-mono text-[9px] text-white/30 mb-1">PLAYER</div>
                  {selectedPlayer ? (
                    <div className="w-12 h-12 mx-auto rounded-md overflow-hidden border-2" style={{ borderColor: selectedPlayer.color }}>
                      <img src={selectedPlayer.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mx-auto rounded-md border-2 border-dashed border-white/20 flex items-center justify-center">
                      <span className="text-white/20 text-lg">?</span>
                    </div>
                  )}
                </div>
                <Swords size={20} className="text-red-500/50" />
                <div className="flex-1 text-center">
                  <div className="font-mono text-[9px] text-white/30 mb-1">OPPONENT</div>
                  {selectedOpponent ? (
                    <div className="w-12 h-12 mx-auto rounded-md overflow-hidden border-2" style={{ borderColor: selectedOpponent.color }}>
                      <img src={selectedOpponent.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mx-auto rounded-md border-2 border-dashed border-white/20 flex items-center justify-center">
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
                  onClick={() => setPhase("difficulty")}
                  className="w-full py-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-display text-sm tracking-wider hover:bg-red-500/30 transition-all"
                >
                  CONTINUE
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── DIFFICULTY SELECT ─── */
  if (phase === "difficulty") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #0f0f2e 100%)" }}>
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
                  ? "border-red-500/60 bg-red-500/10"
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

  /* ─── ARENA SELECT ─── */
  if (phase === "arena") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #0f0f2e 100%)" }}>
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
                selectedArena.id === a.id
                  ? `border-[${a.ambientColor}]/60`
                  : "border-white/10 hover:border-white/30"
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
          className="px-10 py-3 rounded-lg bg-red-500/20 border-2 border-red-500/60 text-red-400 font-display text-xl tracking-wider hover:bg-red-500/30 transition-all"
          style={{ textShadow: "0 0 10px rgba(239,68,68,0.5)" }}
        >
          <Swords className="inline mr-2" size={20} /> BEGIN COMBAT
        </motion.button>
      </div>
    );
  }

  /* ─── FIGHTING ─── */
  if (phase === "fighting" && selectedPlayer && selectedOpponent) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <FightArena3D
          player={selectedPlayer}
          opponent={selectedOpponent}
          arena={selectedArena}
          difficulty={selectedDifficulty}
          onMatchEnd={handleMatchEnd}
          onBack={resetToSelect}
        />
      </div>
    );
  }

  /* ─── RESULTS ─── */
  if (phase === "results" && matchResult) {
    const isVictory = matchResult.winner === "p1";
    const winner = isVictory ? selectedPlayer! : selectedOpponent!;
    const ptGain = isVictory ? Math.round(
      (selectedDifficulty.id === "nightmare" ? 100 : selectedDifficulty.id === "hard" ? 60 : selectedDifficulty.id === "normal" ? 40 : 20)
      * selectedDifficulty.pointsMultiplier
    ) : 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: isVictory
          ? "linear-gradient(180deg, #0a1a0a 0%, #001a00 50%, #0a1a0a 100%)"
          : "linear-gradient(180deg, #1a0a0a 0%, #1a0000 50%, #1a0a0a 100%)"
        }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="font-mono text-xs tracking-[0.4em] mb-2" style={{ color: isVictory ? "#22c55e" : "#ef4444" }}>
            {isVictory ? "VICTORY" : "DEFEAT"}
          </div>
          <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 mb-4" style={{ borderColor: winner.color }}>
            <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-1" style={{ color: winner.color }}>{winner.name}</h2>
          <div className="font-mono text-sm text-white/40 mb-6">{isVictory ? "WINS THE MATCH" : "DEFEATS YOU"}</div>

          {matchResult.perfect && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-display text-2xl text-amber-400 mb-4" style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}>
              PERFECT VICTORY!
            </motion.div>
          )}

          {isVictory && (
            <div className="flex gap-4 justify-center mb-6">
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-[10px] text-white/40">POINTS EARNED</div>
                <div className="font-display text-lg text-amber-400">+{ptGain}</div>
              </div>
              <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                <div className="font-mono text-[10px] text-white/40">WIN STREAK</div>
                <div className="font-display text-lg text-green-400">{gam.gameSave.winStreak}</div>
              </div>
            </div>
          )}

          {/* Invasion bonus */}
          {invasionDefeated && isVictory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mb-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="font-mono text-xs text-amber-400 flex items-center gap-2">
                <Skull size={14} /> INVASION REPELLED — BONUS REWARDS EARNED
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={resetToSelect}
              className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-all">
              NEW FIGHT
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setPhase("title"); setInvasionDefeated(false); }}
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

/* ─── FIGHTER CARD COMPONENT ─── */
function FighterCard({ fighter, available, selected, onSelect, onHover, onLeave, canAfford }: {
  fighter: FighterData;
  available: boolean;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  canAfford?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: available ? 1.08 : 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square ${
        selected
          ? "border-red-500 ring-2 ring-red-500/30"
          : available
          ? "border-white/20 hover:border-white/40"
          : "border-white/10 opacity-60"
      }`}
    >
      <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-1.5">
        <div className="font-mono text-[8px] sm:text-[9px] text-white truncate font-bold">{fighter.name}</div>
        <div className="w-full h-0.5 rounded mt-0.5" style={{ background: FACTION_COLORS[fighter.faction] }} />
      </div>

      {/* Lock overlay */}
      {!available && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <Lock size={16} className="text-white/40 mb-1" />
          <div className="font-mono text-[8px]" style={{ color: canAfford ? "#22c55e" : "#ef4444" }}>
            {fighter.unlockCost} PTS
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
          <Star size={10} className="text-white" />
        </div>
      )}
    </motion.button>
  );
}

/* ─── STAT BAR COMPONENT ─── */
function StatBar({ label, value, max, icon, color }: { label: string; value: number; max: number; icon: React.ReactNode; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 flex justify-center" style={{ color }}>{icon}</div>
      <div className="font-mono text-[9px] text-white/40 w-6">{label}</div>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="font-mono text-[9px] text-white/60 w-5 text-right">{value}</div>
    </div>
  );
}
