/* ═══════════════════════════════════════════════════════
   BOSS BATTLE PAGE — Loredex boss encounters with lore dialog
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Heart, Zap, RotateCcw, Skull, Trophy, Target, Crown, AlertTriangle, Star, Gem, FlaskConical, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";
import { useGamification } from "@/contexts/GamificationContext";
import { generateStarterDeck } from "@/components/StarterDeckViewer";
import { type BattleCard } from "@/lib/cardBattle";
import { initBossBattle, processBossAction, type BossBattleState } from "@/lib/bossBattle";
import { BOSS_ENCOUNTERS, type BossEncounter } from "@/data/bossEncounters";
import { useLocation } from "wouter";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";

function BossCardView({ card, onClick, selected, targetable, disabled, small }: {
  card: BattleCard; onClick?: () => void; selected?: boolean; targetable?: boolean; disabled?: boolean; small?: boolean;
}) {
  const rarityColor = { common: "border-white/20", uncommon: "border-green-400/40", rare: "border-blue-400/50", legendary: "border-amber-400/60" }[card.rarity];
  const TypeIcon = card.type === "unit" ? Swords : card.type === "spell" ? Zap : Shield;
  const hpPercent = card.defense > 0 ? (card.currentHP / card.defense) * 100 : 100;
  const isDamaged = card.currentHP < card.defense;

  return (
    <motion.button onClick={onClick} disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`relative rounded-lg overflow-hidden transition-all cursor-pointer
        ${small ? "w-16 h-24 sm:w-20 sm:h-28" : "w-20 h-28 sm:w-24 sm:h-36"} ${rarityColor}
        ${selected ? "ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : ""}
        ${targetable ? "ring-2 ring-red-400/60 animate-pulse" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/40"}
        ${card.currentHP <= 0 ? "opacity-20 grayscale" : ""}`}
      style={{ background: "linear-gradient(180deg, rgba(30,10,10,0.95) 0%, rgba(10,5,5,0.98) 100%)", border: "1px solid" }}>
      <div className={`relative ${small ? "h-10 sm:h-12" : "h-14 sm:h-18"} overflow-hidden`}>
        <div className="w-full h-full flex items-center justify-center" style={{
          background: `linear-gradient(135deg, ${card.type === "unit" ? "rgba(239,68,68,0.15)" : card.type === "spell" ? "rgba(168,85,247,0.15)" : "rgba(251,191,36,0.15)"} 0%, rgba(0,0,0,0.3) 100%)`}}>
          <TypeIcon size={small ? 14 : 18} className="text-muted-foreground/50" />
        </div>
        <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500/80 flex items-center justify-center">
          <span className="font-mono text-[8px] sm:text-[9px] font-bold text-white">{card.cost}</span>
        </div>
        {card.type === "unit" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/60">
            <div className={`h-full transition-all ${hpPercent > 50 ? "bg-green-400" : hpPercent > 25 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${Math.max(0, hpPercent)}%` }} />
          </div>
        )}
      </div>
      <div className={`${small ? "p-0.5" : "p-1"} text-center`}>
        <p className={`font-mono ${small ? "text-[8px]" : "text-[8px] sm:text-[9px]"} text-foreground/85 truncate font-semibold`}>{card.name}</p>
        {card.type === "unit" && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className={`font-mono ${small ? "text-[7px]" : "text-[8px] sm:text-[9px]"} text-red-400 font-bold`}>{card.attack + card.tempAttackMod}</span>
            <span className="text-muted-foreground/35">/</span>
            <span className={`font-mono ${small ? "text-[7px]" : "text-[8px] sm:text-[9px]"} font-bold ${isDamaged ? "text-yellow-400" : "text-green-400"}`}>{card.currentHP}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

function BossSelect({ onSelect }: { onSelect: (boss: BossEncounter) => void }) {
  const { state: gameState } = useGame();
  const { getUnlockedRooms } = useGame();
  const unlockedRooms = getUnlockedRooms().map(r => r.id);
  const diffColors: Record<string, string> = { easy: "text-green-400", normal: "text-yellow-400", hard: "text-red-400", legendary: "text-purple-400" };
  const diffBg: Record<string, string> = { easy: "bg-green-400/10", normal: "bg-yellow-400/10", hard: "bg-red-400/10", legendary: "bg-purple-400/10" };

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "linear-gradient(180deg, #0a0510 0%, #150a20 50%, #0a0510 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <Crown size={36} className="text-amber-400/60 mx-auto mb-3" />
          <h1 className="font-display text-xl sm:text-2xl tracking-[0.25em] text-white mb-2">BOSS ENCOUNTERS</h1>
          <p className="font-mono text-xs text-muted-foreground/60">Challenge the Archons of the Dischordian Saga</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOSS_ENCOUNTERS.map((boss, i) => {
            const isUnlocked = unlockedRooms.includes(boss.roomId);
            return (
              <motion.button key={boss.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => isUnlocked && onSelect(boss)} disabled={!isUnlocked}
                className={`text-left rounded-lg overflow-hidden transition-all group ${!isUnlocked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                style={{ background: "rgba(15,10,25,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-3 p-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={boss.image} alt={boss.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-sm tracking-wider text-white group-hover:text-amber-400 transition-colors truncate">{boss.name}</h3>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${diffBg[boss.difficulty]} ${diffColors[boss.difficulty]}`}>
                        {boss.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/50 line-clamp-2">{boss.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-mono text-[9px] text-red-400/50"><Heart size={8} className="inline mr-0.5" />{boss.hp} HP</span>
                    </div>
                    {!isUnlocked && <p className="font-mono text-[9px] text-red-400/60 mt-1"><AlertTriangle size={8} className="inline mr-0.5" />Unlock room first</p>}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BossBattlePage() {
  const { state: gameState, addMaterial } = useGame();
  const { playSFX, initAudio, audioReady } = useSound();
  const { discoverEntry } = useGamification();
  const [, navigate] = useLocation();
  const [rewardPhase, setRewardPhase] = useState<"card" | "rewards" | "complete" | null>(null);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);

  const [battleState, setBattleState] = useState<BossBattleState | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  const [currentBoss, setCurrentBoss] = useState<BossEncounter | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const playerDeck = useMemo(() => {
    const choices = gameState.characterChoices;
    return generateStarterDeck({ species: choices.species || undefined, characterClass: choices.characterClass || undefined,
      alignment: choices.alignment || undefined, element: choices.element || undefined, name: choices.name || undefined });
  }, [gameState.characterChoices]);

  const startBossBattle = useCallback((boss: BossEncounter) => {
    setCurrentBoss(boss);
    setBattleState(initBossBattle(playerDeck, boss));
    if (audioReady) playSFX("room_enter");
  }, [playerDeck, audioReady, playSFX]);

  const doAction = useCallback((action: Parameters<typeof processBossAction>[1]) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const next = processBossAction(prev, action);
      if (audioReady) {
        if (action.type === "PLAY_CARD") playSFX("item_pickup");
        if (action.type === "ATTACK") playSFX("door_locked");
        if (action.type === "END_TURN") playSFX("terminal_access");
      }
      if (next.winner === "player" && currentBoss) {
        discoverEntry(currentBoss.entityId);
      }
      return next;
    });
    setSelectedAttacker(null);
    setTargetMode(false);
  }, [audioReady, playSFX, currentBoss, discoverEntry]);

  const handleHandCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;
    if (card.cost <= battleState.player.energy) {
      if (card.type === "unit" && battleState.player.field.length >= 5) return;
      doAction({ type: "PLAY_CARD", cardInstanceId: card.instanceId });
    }
  }, [battleState, doAction]);

  const handleFieldCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;
    if (card.hasAttacked || card.justDeployed) return;
    if (selectedAttacker === card.instanceId) { setSelectedAttacker(null); setTargetMode(false); }
    else { setSelectedAttacker(card.instanceId); setTargetMode(true); }
  }, [battleState, selectedAttacker]);

  const handleTargetClick = useCallback((targetId: string | "face") => {
    if (!selectedAttacker || !battleState) return;
    doAction({ type: "ATTACK", attackerInstanceId: selectedAttacker, targetInstanceId: targetId });
  }, [selectedAttacker, battleState, doAction]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [battleState?.logs.length]);
  useEffect(() => {
    if (!audioReady) { const h = () => { initAudio(); window.removeEventListener("click", h); }; window.addEventListener("click", h); return () => window.removeEventListener("click", h); }
  }, [audioReady, initAudio]);

  if (!battleState || !currentBoss) return <BossSelect onSelect={startBossBattle} />;

  const { player, enemy, turn, turnNumber, logs, winner } = battleState;

  return (
    <LandscapeEnforcer forceRotate message="Boss encounters are best experienced in landscape mode.">
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${battleState.bossPhase === 3 ? "from-red-900/20" : battleState.bossPhase === 2 ? "from-purple-900/20" : "from-slate-900/20"} to-black`}>
      {/* ═══ DEFEAT SCREEN ═══ */}
      {winner && winner !== "player" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)" }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center max-w-sm">
            <img src={currentBoss.image} alt="" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-2 ring-red-400/50" />
            <h2 className="font-display text-2xl tracking-[0.2em] mb-2 text-red-400">DEFEATED</h2>
            <p className="font-mono text-xs text-muted-foreground/70 italic mb-3">"{currentBoss.victoryLine}"</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setBattleState(null); setCurrentBoss(null); setRewardPhase(null); setRewardsClaimed(false); }} className="px-5 py-2 rounded-md font-mono text-xs" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "rgb(251,191,36)" }}>
                <RotateCcw size={12} className="inline mr-1.5" />RETRY
              </button>
              <button onClick={() => navigate("/ark")} className="px-5 py-2 rounded-md font-mono text-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>EXIT</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══ BOSS DEFEATED — REWARD CELEBRATION ═══ */}
      {winner === "player" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.08) 0%, rgba(0,0,0,0.95) 60%)" }}
        >
          {/* Phase 1: Card Reveal */}
          {(!rewardPhase || rewardPhase === "card") && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="text-center max-w-md w-full"
            >
              {/* Boss defeated title */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star size={16} className="text-amber-400" />
                  <h2 className="font-display text-2xl sm:text-3xl tracking-[0.25em] text-amber-400">BOSS DEFEATED</h2>
                  <Star size={16} className="text-amber-400" />
                </div>
                <p className="font-mono text-xs text-muted-foreground/60 italic">"{currentBoss.defeatLine}"</p>
              </motion.div>

              {/* Card Reward — Big reveal */}
              <motion.div
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                className="relative mx-auto mb-6"
                style={{ maxWidth: "280px", perspective: "1000px" }}
              >
                <div className="rounded-xl overflow-hidden" style={{
                  border: "2px solid rgba(251,191,36,0.5)",
                  boxShadow: "0 0 40px rgba(251,191,36,0.2), 0 0 80px rgba(251,191,36,0.1), inset 0 0 20px rgba(251,191,36,0.05)",
                  background: "linear-gradient(180deg, rgba(20,10,0,0.95) 0%, rgba(10,5,0,0.98) 100%)"
                }}>
                  {/* Card Art */}
                  {currentBoss.rewards.cardReward.imageUrl && (
                    <div className="w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={currentBoss.rewards.cardReward.imageUrl}
                        alt={currentBoss.rewards.cardReward.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {/* Card Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} className="text-amber-400" />
                      <h3 className="font-display text-lg text-amber-400 tracking-wider">{currentBoss.rewards.cardReward.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">LEGENDARY</span>
                      <span className="font-mono text-[10px] text-muted-foreground/50 uppercase">{currentBoss.rewards.cardReward.type}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] text-red-400"><Swords size={10} className="inline mr-0.5" />{currentBoss.rewards.cardReward.attack} ATK</span>
                      <span className="font-mono text-[10px] text-blue-400"><Shield size={10} className="inline mr-0.5" />{currentBoss.rewards.cardReward.defense} DEF</span>
                      <span className="font-mono text-[10px] text-amber-400"><Heart size={10} className="inline mr-0.5" />{currentBoss.rewards.cardReward.cost} COST</span>
                    </div>
                    <div className="rounded-md p-2.5 mb-2" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)" }}>
                      <p className="font-mono text-[9px] text-amber-400/50 tracking-wider mb-1">ABILITY</p>
                      <p className="font-mono text-[11px] text-foreground/80">{currentBoss.rewards.cardReward.ability}</p>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/40 italic">"{currentBoss.rewards.cardReward.lore}"</p>
                  </div>
                </div>
                {/* Glow particles */}
                <div className="absolute -inset-4 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-amber-400"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                      }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      style={{ left: `${50 + (Math.random() - 0.5) * 80}%`, top: `${50 + (Math.random() - 0.5) * 80}%` }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="font-mono text-[10px] text-amber-400/40 tracking-wider mb-4"
              >
                CARD ADDED TO YOUR COLLECTION
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                onClick={() => setRewardPhase("rewards")}
                className="px-6 py-2.5 rounded-md font-mono text-xs tracking-wider"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "rgb(251,191,36)" }}
              >
                VIEW ALL REWARDS →
              </motion.button>
            </motion.div>
          )}

          {/* Phase 2: All Rewards Summary */}
          {rewardPhase === "rewards" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-sm w-full"
            >
              <h2 className="font-display text-xl tracking-[0.2em] text-amber-400 mb-1">BATTLE REWARDS</h2>
              <p className="font-mono text-[10px] text-muted-foreground/50 mb-6">{currentBoss.name} — DEFEATED</p>

              <div className="space-y-3 mb-6">
                {/* XP Reward */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)" }}>
                    <Trophy size={16} className="text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-mono text-[10px] text-muted-foreground/50">EXPERIENCE</p>
                    <p className="font-mono text-sm text-amber-400 font-bold">+{currentBoss.rewards.xp} XP</p>
                  </div>
                </motion.div>

                {/* Dream Tokens */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: "rgba(255,165,0,0.06)", border: "1px solid rgba(255,165,0,0.15)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,165,0,0.1)" }}>
                    <Gem size={16} className="text-orange-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-mono text-[10px] text-muted-foreground/50">DREAM TOKENS</p>
                    <p className="font-mono text-sm text-orange-400 font-bold">+{currentBoss.rewards.dreamTokens}</p>
                  </div>
                </motion.div>

                {/* Material Drops */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: "rgba(51,226,230,0.06)", border: "1px solid rgba(51,226,230,0.15)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(51,226,230,0.1)" }}>
                    <FlaskConical size={16} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-mono text-[10px] text-muted-foreground/50">CRAFTING MATERIALS</p>
                    <p className="font-mono text-sm text-cyan-400 font-bold">Boss Essence + Rare Catalysts</p>
                  </div>
                </motion.div>

                {/* Legendary Card */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)" }}>
                    <Crown size={16} className="text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-mono text-[10px] text-muted-foreground/50">LEGENDARY CARD</p>
                    <p className="font-mono text-sm text-purple-400 font-bold">{currentBoss.rewards.cardReward.name}</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 justify-center"
              >
                <button
                  onClick={() => {
                    if (!rewardsClaimed) {
                      // Grant material drops for boss kill
                      addMaterial("void_catalyst", 2);
                      addMaterial("dream_shard", 3);
                      addMaterial("neural_thread", 1);
                      setRewardsClaimed(true);
                    }
                    setBattleState(null);
                    setCurrentBoss(null);
                    setRewardPhase(null);
                    setRewardsClaimed(false);
                  }}
                  className="px-5 py-2 rounded-md font-mono text-xs tracking-wider"
                  style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "rgb(251,191,36)" }}
                >
                  <RotateCcw size={12} className="inline mr-1.5" />FIGHT AGAIN
                </button>
                <button
                  onClick={() => {
                    if (!rewardsClaimed) {
                      addMaterial("void_catalyst", 2);
                      addMaterial("dream_shard", 3);
                      addMaterial("neural_thread", 1);
                      setRewardsClaimed(true);
                    }
                    navigate("/forge");
                  }}
                  className="px-5 py-2 rounded-md font-mono text-xs tracking-wider"
                  style={{ background: "rgba(51,226,230,0.1)", border: "1px solid rgba(51,226,230,0.3)", color: "var(--neon-cyan)" }}
                >
                  <FlaskConical size={12} className="inline mr-1.5" />GO TO FORGE
                </button>
                <button
                  onClick={() => {
                    if (!rewardsClaimed) {
                      addMaterial("void_catalyst", 2);
                      addMaterial("dream_shard", 3);
                      addMaterial("neural_thread", 1);
                      setRewardsClaimed(true);
                    }
                    navigate("/ark");
                  }}
                  className="px-5 py-2 rounded-md font-mono text-xs tracking-wider"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                >
                  EXIT
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="px-3 sm:px-6 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <img src={currentBoss.image} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-red-400/30" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display text-xs tracking-wider text-white">{currentBoss.name}</span>
              <span className="font-mono text-[8px] text-purple-400/60 px-1.5 py-0.5 rounded-full bg-purple-400/10">PHASE {battleState.bossPhase}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={10} className="text-red-400" />
              <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <motion.div className="h-full rounded-full bg-red-500" animate={{ width: `${Math.max(0, (enemy.hp / enemy.maxHP) * 100)}%` }} />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/70">{enemy.hp}/{enemy.maxHP}</span>
              <Zap size={10} className="text-blue-400/50 ml-2" />
              <span className="font-mono text-[9px] text-blue-400/70">{enemy.energy}/{enemy.maxEnergy}</span>
            </div>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <AlertTriangle size={8} className="text-amber-400/50" />
          <span className="font-mono text-[8px] text-amber-400/40">{battleState.bossPassive.name}: {battleState.bossPassive.description}</span>
        </div>
      </div>

      <AnimatePresence>
        {battleState.bossDialog && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-3 sm:px-6">
            <div className="flex items-start gap-3 rounded-lg p-3 mb-2" style={{ background: "rgba(80,20,20,0.3)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <img src={currentBoss.image} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-red-400/30" />
              <div>
                <p className="font-display text-[10px] text-red-400/70 tracking-wider mb-0.5">{currentBoss.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground/80 italic">"{battleState.bossDialog}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[7rem] sm:min-h-[9rem]">
          {enemy.field.length === 0 ? <p className="font-mono text-[10px] text-muted-foreground/25 italic">No boss units</p> :
            enemy.field.map(c => <BossCardView key={c.instanceId} card={c} small targetable={targetMode} onClick={() => targetMode && handleTargetClick(c.instanceId)} />)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-2">
        {targetMode && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => handleTargetClick("face")}
          className="px-4 py-1.5 rounded-md font-mono text-[10px]" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.8)" }}>
          <Target size={10} className="inline mr-1" />ATTACK BOSS</motion.button>}
        <p className="font-mono text-[9px] text-muted-foreground/50">Turn {turnNumber} — {turn === "player" ? "YOUR TURN" : "BOSS TURN"}</p>
        {targetMode && <button onClick={() => { setSelectedAttacker(null); setTargetMode(false); }} className="px-3 py-1.5 rounded-md font-mono text-[10px] text-muted-foreground/50 border border-white/10">CANCEL</button>}
      </div>

      <div className="px-3 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[7rem] sm:min-h-[9rem]">
          {player.field.length === 0 ? <p className="font-mono text-[10px] text-muted-foreground/25 italic">Deploy units</p> :
            player.field.map(c => <BossCardView key={c.instanceId} card={c} small selected={selectedAttacker === c.instanceId}
              disabled={c.hasAttacked || c.justDeployed} onClick={() => handleFieldCardClick(c)} />)}
        </div>
      </div>

      <div className="mt-auto">
        <div className="px-3 sm:px-6 mb-2">
          <div ref={logRef} className="h-24 sm:h-28 overflow-y-auto rounded-lg p-2" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {logs.slice(-15).map((l, i) => <p key={i} className={`font-mono text-[9px] leading-relaxed ${l.actor === "system" ? "text-muted-foreground/50 italic" : l.actor === "player" ? "text-[var(--neon-cyan)]/70" : "text-red-400/70"}`}>{l.message}</p>)}
          </div>
        </div>
        <div className="px-3 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-2">
            <Heart size={12} className="text-[var(--neon-cyan)]" />
            <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "var(--neon-cyan)" }} animate={{ width: `${Math.max(0, (player.hp / player.maxHP) * 100)}%` }} />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/70">{player.hp}/{player.maxHP}</span>
          </div>
          <div className="ml-3 flex items-center gap-3">
            <span className="font-mono text-[10px] text-blue-400/70"><Zap size={10} className="inline mr-0.5" />{player.energy}/{player.maxEnergy}</span>
            <button onClick={() => doAction({ type: "END_TURN" })} disabled={turn !== "player" || !!winner}
              className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider disabled:opacity-30"
              style={{ background: turn === "player" ? "rgba(51,226,230,0.12)" : "transparent", border: `1px solid rgba(51,226,230,${turn === "player" ? 0.3 : 0.1})`, color: "var(--neon-cyan)" }}>END TURN</button>
          </div>
        </div>
        <div className="px-3 sm:px-6 py-3 overflow-x-auto" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)", borderTop: "1px solid rgba(251,191,36,0.08)" }}>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {player.hand.map(c => <BossCardView key={c.instanceId} card={c} disabled={c.cost > player.energy || turn !== "player" || !!winner} onClick={() => handleHandCardClick(c)} />)}
            {player.hand.length === 0 && <p className="font-mono text-[10px] text-muted-foreground/35 italic py-4">No cards</p>}
          </div>
        </div>
      </div>
    </div>
    </LandscapeEnforcer>
  );
}
