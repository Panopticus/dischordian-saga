/* ═══════════════════════════════════════════════════════
   CARD BATTLE PAGE — Turn-based card combat in the Armory
   Full battle UI with card rendering, targeting, animations
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Heart, Zap, Star, RotateCcw, X, ChevronRight, Skull, Trophy, Target } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";
import { useGamification } from "@/contexts/GamificationContext";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import {
  initBattle, processBattleAction, getAvailableEnemies, getEnemyName,
  type BattleState, type BattleCard, type BattlePlayer,
} from "@/lib/cardBattle";
import { useLocation } from "wouter";

/* ─── CARD COMPONENT ─── */
function BattleCardView({
  card,
  onClick,
  selected,
  targetable,
  disabled,
  small,
}: {
  card: BattleCard;
  onClick?: () => void;
  selected?: boolean;
  targetable?: boolean;
  disabled?: boolean;
  small?: boolean;
}) {
  const rarityColor = {
    common: "border-white/20",
    uncommon: "border-green-400/40",
    rare: "border-blue-400/50",
    legendary: "border-amber-400/60",
  }[card.rarity];

  const rarityGlow = {
    common: "",
    uncommon: "shadow-[0_0_8px_rgba(74,222,128,0.15)]",
    rare: "shadow-[0_0_12px_rgba(96,165,250,0.2)]",
    legendary: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
  }[card.rarity];

  const typeIcon = card.type === "unit" ? Swords : card.type === "spell" ? Zap : Shield;
  const TypeIcon = typeIcon;
  const hpPercent = card.defense > 0 ? (card.currentHP / card.defense) * 100 : 100;
  const isDamaged = card.currentHP < card.defense;
  const isDead = card.currentHP <= 0;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        relative rounded-lg overflow-hidden transition-all cursor-pointer
        ${small ? "w-16 h-24 sm:w-20 sm:h-28" : "w-20 h-28 sm:w-24 sm:h-36"}
        ${rarityColor} ${rarityGlow}
        ${selected ? "ring-2 ring-[var(--neon-cyan)] shadow-[0_0_20px_rgba(51,226,230,0.3)]" : ""}
        ${targetable ? "ring-2 ring-red-400/60 shadow-[0_0_15px_rgba(248,113,113,0.2)] animate-pulse" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/40"}
        ${isDead ? "opacity-20 grayscale" : ""}
      `}
      style={{
        background: "linear-gradient(180deg, rgba(15,15,40,0.95) 0%, rgba(5,5,20,0.98) 100%)",
        border: `1px solid`,
      }}
    >
      {/* Card art area */}
      <div className={`relative ${small ? "h-10 sm:h-12" : "h-14 sm:h-18"} overflow-hidden`}>
        {card.imageUrl ? (
          <img src={card.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{
            background: `linear-gradient(135deg, ${
              card.type === "unit" ? "rgba(239,68,68,0.15)" :
              card.type === "spell" ? "rgba(59,130,246,0.15)" :
              "rgba(168,85,247,0.15)"
            } 0%, rgba(0,0,0,0.3) 100%)`,
          }}>
            <TypeIcon size={small ? 14 : 18} className="text-white/30" />
          </div>
        )}
        {/* Cost badge */}
        <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/80 flex items-center justify-center">
          <span className="font-mono text-[8px] sm:text-[9px] font-bold text-white">{card.cost}</span>
        </div>
        {/* HP bar */}
        {card.type === "unit" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/50">
            <div
              className={`h-full transition-all ${hpPercent > 50 ? "bg-green-400" : hpPercent > 25 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>
        )}
      </div>

      {/* Card info */}
      <div className={`${small ? "p-0.5" : "p-1"} text-center`}>
        <p className={`font-mono ${small ? "text-[6px]" : "text-[7px] sm:text-[8px]"} text-white/80 truncate font-semibold`}>
          {card.name}
        </p>
        {card.type === "unit" && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className={`font-mono ${small ? "text-[7px]" : "text-[8px] sm:text-[9px]"} text-red-400 font-bold`}>
              {card.attack + card.tempAttackMod}
            </span>
            <span className="text-white/20">/</span>
            <span className={`font-mono ${small ? "text-[7px]" : "text-[8px] sm:text-[9px]"} font-bold ${isDamaged ? "text-yellow-400" : "text-green-400"}`}>
              {card.currentHP}
            </span>
          </div>
        )}
        {card.type !== "unit" && (
          <div className="flex items-center justify-center mt-0.5">
            <TypeIcon size={8} className="text-white/30" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ─── PLAYER HP BAR ─── */
function HPBar({ current, max, label, color }: { current: number; max: number; label: string; color: string }) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <Heart size={12} className={color} />
      <div className="flex-1">
        <div className="flex justify-between mb-0.5">
          <span className="font-mono text-[9px] text-white/50">{label}</span>
          <span className="font-mono text-[9px] text-white/70">{current}/{max}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color.includes("cyan") ? "var(--neon-cyan)" : "#ef4444" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── ENEMY SELECT SCREEN ─── */
function EnemySelect({ onSelect }: { onSelect: (enemyId: string, diff: "easy" | "normal" | "hard") => void }) {
  const enemies = getAvailableEnemies();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #050510 0%, #0a0a2e 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Swords size={32} className="text-red-400/60 mx-auto mb-3" />
          <h1 className="font-display text-xl sm:text-2xl tracking-[0.2em] text-white mb-2">COMBAT ARENA</h1>
          <p className="font-mono text-xs text-white/40">Choose your opponent, Operative.</p>
        </div>

        <div className="space-y-3">
          {enemies.map((enemy, i) => (
            <motion.button
              key={enemy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              onClick={() => onSelect(enemy.id, enemy.difficulty.toLowerCase() as any)}
              className="w-full text-left rounded-lg p-4 transition-all group"
              style={{
                background: "rgba(15,15,40,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm tracking-wider text-white group-hover:text-red-400 transition-colors">
                    {enemy.name}
                  </h3>
                  <p className="font-mono text-[10px] text-white/30 mt-0.5">{enemy.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    enemy.difficulty === "Easy" ? "bg-green-400/10 text-green-400/70" :
                    enemy.difficulty === "Normal" ? "bg-yellow-400/10 text-yellow-400/70" :
                    "bg-red-400/10 text-red-400/70"
                  }`}>
                    {enemy.difficulty}
                  </span>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-red-400/60 transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── BATTLE LOG ─── */
function BattleLog({ logs }: { logs: BattleState["logs"] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs.length]);

  return (
    <div
      ref={scrollRef}
      className="h-24 sm:h-32 overflow-y-auto rounded-lg p-2"
      style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {logs.slice(-15).map((log, i) => (
        <p
          key={i}
          className={`font-mono text-[9px] sm:text-[10px] leading-relaxed ${
            log.actor === "system" ? "text-white/30 italic" :
            log.actor === "player" ? "text-[var(--neon-cyan)]/70" :
            "text-red-400/70"
          }`}
        >
          {log.message}
        </p>
      ))}
    </div>
  );
}

/* ─── GAME OVER SCREEN ─── */
function GameOverScreen({
  winner,
  enemyName,
  turnCount,
  onPlayAgain,
  onExit,
}: {
  winner: "player" | "enemy";
  enemyName: string;
  turnCount: number;
  onPlayAgain: () => void;
  onExit: () => void;
}) {
  const isVictory = winner === "player";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="text-center max-w-sm"
      >
        {isVictory ? (
          <Trophy size={48} className="text-amber-400 mx-auto mb-4" />
        ) : (
          <Skull size={48} className="text-red-400/60 mx-auto mb-4" />
        )}

        <h2 className={`font-display text-2xl tracking-[0.2em] mb-2 ${isVictory ? "text-amber-400" : "text-red-400"}`}>
          {isVictory ? "VICTORY" : "DEFEATED"}
        </h2>
        <p className="font-mono text-xs text-white/40 mb-1">
          {isVictory ? `You defeated ${enemyName} in ${turnCount} turns!` : `${enemyName} has destroyed you.`}
        </p>
        {isVictory && (
          <p className="font-mono text-[10px] text-amber-400/50 mb-6">+50 XP earned</p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-5 py-2 rounded-md font-mono text-xs tracking-wider transition-all"
            style={{
              background: "rgba(51,226,230,0.1)",
              border: "1px solid rgba(51,226,230,0.3)",
              color: "var(--neon-cyan)",
            }}
          >
            <RotateCcw size={12} className="inline mr-1.5" />
            PLAY AGAIN
          </button>
          <button
            onClick={onExit}
            className="px-5 py-2 rounded-md font-mono text-xs tracking-wider transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            EXIT ARENA
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN BATTLE PAGE ─── */
export default function CardBattlePage() {
  const { state: gameState } = useGame();
  const { playSFX, initAudio, audioReady } = useSound();
  const { discoverEntry } = useGamification();
  const [, navigate] = useLocation();

  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<BattleCard | null>(null);
  const [enemyId, setEnemyId] = useState<string | null>(null);

  // Generate player deck from character choices
  const playerDeck = useMemo(() => {
    const choices = gameState.characterChoices;
    return generateStarterDeck({
      species: choices.species || undefined,
      characterClass: choices.characterClass || undefined,
      alignment: choices.alignment || undefined,
      element: choices.element || undefined,
      name: choices.name || undefined,
    });
  }, [gameState.characterChoices]);

  const startBattle = useCallback((eid: string, diff: "easy" | "normal" | "hard") => {
    setEnemyId(eid);
    const state = initBattle(playerDeck, eid, diff);
    setBattleState(state);
    if (audioReady) playSFX("room_enter");
  }, [playerDeck, audioReady, playSFX]);

  const dispatch = useCallback((action: Parameters<typeof processBattleAction>[1]) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const next = processBattleAction(prev, action);

      // Play SFX based on action
      if (audioReady) {
        if (action.type === "PLAY_CARD") playSFX("item_pickup");
        if (action.type === "ATTACK") playSFX("door_locked");
        if (action.type === "END_TURN") playSFX("terminal_access");
      }

      return next;
    });
    setSelectedCard(null);
    setSelectedAttacker(null);
    setTargetMode(false);
  }, [audioReady, playSFX]);

  // Handle card play from hand
  const handleHandCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;

    if (card.cost <= battleState.player.energy) {
      if (card.type === "unit" && battleState.player.field.length >= 5) return;
      dispatch({ type: "PLAY_CARD", cardInstanceId: card.instanceId });
    }
  }, [battleState, dispatch]);

  // Handle field card click (select attacker)
  const handleFieldCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;

    if (card.hasAttacked || card.justDeployed) return;

    if (selectedAttacker === card.instanceId) {
      setSelectedAttacker(null);
      setTargetMode(false);
    } else {
      setSelectedAttacker(card.instanceId);
      setTargetMode(true);
    }
  }, [battleState, selectedAttacker]);

  // Handle target selection
  const handleTargetClick = useCallback((targetId: string | "face") => {
    if (!selectedAttacker || !battleState) return;
    dispatch({ type: "ATTACK", attackerInstanceId: selectedAttacker, targetInstanceId: targetId });
  }, [selectedAttacker, battleState, dispatch]);

  // Init audio on first interaction
  useEffect(() => {
    if (!audioReady) {
      const handler = () => { initAudio(); window.removeEventListener("click", handler); };
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [audioReady, initAudio]);

  // Enemy select screen
  if (!battleState) {
    return <EnemySelect onSelect={startBattle} />;
  }

  const { player, enemy, turn, turnNumber, logs, winner } = battleState;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #050510 0%, #0a0a2e 50%, #050510 100%)" }}>
      {/* Game Over overlay */}
      {winner && (
        <GameOverScreen
          winner={winner}
          enemyName={getEnemyName(enemyId || "")}
          turnCount={turnNumber}
          onPlayAgain={() => {
            setBattleState(null);
            setEnemyId(null);
          }}
          onExit={() => navigate("/ark")}
        />
      )}

      {/* ─── TOP: Enemy info ─── */}
      <div className="px-3 sm:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <HPBar current={enemy.hp} max={enemy.maxHP} label={getEnemyName(enemyId || "")} color="text-red-400" />
          </div>
          <div className="ml-3 flex items-center gap-1.5">
            <Zap size={10} className="text-blue-400/50" />
            <span className="font-mono text-[10px] text-blue-400/70">{enemy.energy}/{enemy.maxEnergy}</span>
          </div>
        </div>
        {/* Enemy hand count */}
        <p className="font-mono text-[9px] text-white/20 mt-1">Hand: {enemy.hand.length} | Deck: {enemy.deck.length}</p>
      </div>

      {/* ─── ENEMY FIELD ─── */}
      <div className="px-3 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[7rem] sm:min-h-[9rem]">
          {enemy.field.length === 0 ? (
            <p className="font-mono text-[10px] text-white/15 italic">No enemy units deployed</p>
          ) : (
            enemy.field.map(card => (
              <BattleCardView
                key={card.instanceId}
                card={card}
                small
                targetable={targetMode}
                onClick={() => targetMode && handleTargetClick(card.instanceId)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── CENTER: Attack face button + turn info ─── */}
      <div className="flex items-center justify-center gap-4 py-2">
        {targetMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleTargetClick("face")}
            className="px-4 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "rgba(239,68,68,0.8)",
            }}
          >
            <Target size={10} className="inline mr-1" />
            ATTACK FACE
          </motion.button>
        )}
        <div className="text-center">
          <p className="font-mono text-[9px] text-white/30">
            Turn {turnNumber} — {turn === "player" ? "YOUR TURN" : "ENEMY TURN"}
          </p>
        </div>
        {targetMode && (
          <button
            onClick={() => { setSelectedAttacker(null); setTargetMode(false); }}
            className="px-3 py-1.5 rounded-md font-mono text-[10px] text-white/30 border border-white/10"
          >
            CANCEL
          </button>
        )}
      </div>

      {/* ─── PLAYER FIELD ─── */}
      <div className="px-3 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[7rem] sm:min-h-[9rem]">
          {player.field.length === 0 ? (
            <p className="font-mono text-[10px] text-white/15 italic">Deploy units from your hand</p>
          ) : (
            player.field.map(card => (
              <BattleCardView
                key={card.instanceId}
                card={card}
                small
                selected={selectedAttacker === card.instanceId}
                disabled={card.hasAttacked || card.justDeployed}
                onClick={() => handleFieldCardClick(card)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── BOTTOM: Player info + hand ─── */}
      <div className="mt-auto">
        {/* Battle log */}
        <div className="px-3 sm:px-6 mb-2">
          <BattleLog logs={logs} />
        </div>

        {/* Player info bar */}
        <div className="px-3 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex-1">
            <HPBar current={player.hp} max={player.maxHP} label={gameState.characterChoices.name || "You"} color="text-[var(--neon-cyan)]" />
          </div>
          <div className="ml-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-blue-400/50" />
              <span className="font-mono text-[10px] text-blue-400/70">{player.energy}/{player.maxEnergy}</span>
            </div>
            <button
              onClick={() => dispatch({ type: "END_TURN" })}
              disabled={turn !== "player" || !!winner}
              className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
              style={{
                background: turn === "player" ? "rgba(51,226,230,0.12)" : "transparent",
                border: `1px solid rgba(51,226,230,${turn === "player" ? 0.3 : 0.1})`,
                color: "var(--neon-cyan)",
              }}
            >
              END TURN
            </button>
          </div>
        </div>

        {/* Player hand */}
        <div
          className="px-3 sm:px-6 py-3 overflow-x-auto"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
            borderTop: "1px solid rgba(51,226,230,0.08)",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {player.hand.map(card => (
              <BattleCardView
                key={card.instanceId}
                card={card}
                disabled={card.cost > player.energy || turn !== "player" || !!winner}
                onClick={() => handleHandCardClick(card)}
              />
            ))}
            {player.hand.length === 0 && (
              <p className="font-mono text-[10px] text-white/20 italic py-4">No cards in hand</p>
            )}
          </div>
          <p className="font-mono text-[8px] text-white/15 text-center mt-1">
            Deck: {player.deck.length} | Graveyard: {player.graveyard.length}
          </p>
        </div>
      </div>

      {/* Card detail tooltip */}
      <AnimatePresence>
        {showCardDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowCardDetail(null)}
          >
            <div className="rounded-lg p-4 max-w-xs" style={{
              background: "rgba(10,10,40,0.98)",
              border: "1px solid rgba(51,226,230,0.2)",
            }}>
              <h3 className="font-display text-sm text-white tracking-wider">{showCardDetail.name}</h3>
              <p className="font-mono text-[10px] text-white/40 mt-1">{showCardDetail.ability}</p>
              <p className="font-mono text-[9px] text-white/20 mt-2 italic">{showCardDetail.lore}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
