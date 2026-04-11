/* ═══════════════════════════════════════════════════════
   THE COLLECTOR'S GARDEN — Act 3 climax
   Spec §7.6. The player lands in a Thalorian field, picks
   up a xenomorph helmet, and fights the Collector in a
   full Dischordia card battle.

   Battle phase uses the real `initBossBattle` / `processBossAction`
   engine with the `boss-collector` encounter from bossEncounters.ts.
   Narrative phases (approach → helmet → narration → battle →
   victory/defeat) are custom-built for Act 3.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Skull, Flower2, Mic, Heart, Zap, Target } from "lucide-react";
import { generateStarterDeck } from "@/components/StarterDeckViewer";
import { type BattleCard } from "@/lib/cardBattle";
import { initBossBattle, processBossAction, type BossBattleState } from "@/lib/bossBattle";
import { BOSS_ENCOUNTERS } from "@/data/bossEncounters";
import { useGame } from "@/contexts/GameContext";

interface Props {
  /** The faction arc the player resolved most recently — determines what card is lost on defeat. */
  lastFactionArc: string | null;
  /** Called once the fight resolves. The caller handles rewards, flags, event log. */
  onComplete: (won: boolean) => void;
  onClose: () => void;
}

const COLLECTOR_LINES = [
  "'She was the prettiest thing I was ever sent to break.'",
  "'I kept her eye in a jar for a long time. The Shadow Tongue ate it. I wept. I am still weeping.'",
  "'Would you like to see my collection? It's mostly hair and coins.'",
  "'Every thing in here was loved by someone who forgot it.'",
  "'Your Eyes tried to outrun me. Nobody outruns a gardener. The forest always wins.'",
  "'Step closer. The flowers are watching.'",
];

const LAST_ARC_CARD_LOSS: Record<string, string> = {
  new_babylon: "Adjudicator's Decree",
  hierarchy: "Blood Weave Token",
  insurgency: "The Engineer Remembers",
  thought_virus: "Immunity",
  artificial_empire: "Archon Robe",
  antiquarian: "A Moment Outside Time",
};

type Phase = "approach" | "helmet" | "narration" | "battle" | "victory" | "defeat";

/* ─── Minimal inline card UI — shares the visual language of BossBattlePage
       without requiring the full landscape-enforcer surface. ─── */
function MiniBattleCard({ card, onClick, selected, targetable, disabled }: {
  card: BattleCard;
  onClick?: () => void;
  selected?: boolean;
  targetable?: boolean;
  disabled?: boolean;
}) {
  const rarityBorder = {
    common: "border-white/15",
    uncommon: "border-emerald-400/35",
    rare: "border-blue-400/45",
    legendary: "border-amber-400/55",
  }[card.rarity];
  const hpPct = card.defense > 0 ? (card.currentHP / card.defense) * 100 : 100;
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -3 } : {}}
      className={`relative w-16 h-24 rounded-md border-2 text-left overflow-hidden transition-all
        ${rarityBorder}
        ${selected ? "ring-2 ring-amber-400" : ""}
        ${targetable ? "ring-2 ring-red-400/60 animate-pulse" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/40"}
        ${card.currentHP <= 0 ? "opacity-20 grayscale" : ""}
      `}
      style={{ background: "linear-gradient(180deg, rgba(30,10,20,0.95), rgba(10,5,10,0.98))" }}
    >
      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-purple-500/80 flex items-center justify-center">
        <span className="font-mono text-[8px] font-bold text-white">{card.cost}</span>
      </div>
      <div className="pt-6 px-1 text-center">
        <p className="font-mono text-[8px] font-semibold text-white truncate leading-tight">{card.name}</p>
      </div>
      {card.type === "unit" && (
        <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center gap-1">
          <span className="font-mono text-[8px] text-red-400 font-bold">{card.attack + card.tempAttackMod}</span>
          <span className="text-white/20 text-[7px]">/</span>
          <span
            className={`font-mono text-[8px] font-bold ${
              card.currentHP < card.defense ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {card.currentHP}
          </span>
        </div>
      )}
      {card.type === "unit" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/60">
          <div
            className={`h-full ${hpPct > 50 ? "bg-emerald-400" : hpPct > 25 ? "bg-amber-400" : "bg-red-400"}`}
            style={{ width: `${Math.max(0, hpPct)}%` }}
          />
        </div>
      )}
    </motion.button>
  );
}

export default function CollectorGarden({ lastFactionArc, onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("approach");
  const [lineIdx, setLineIdx] = useState(0);
  const { state: gameState } = useGame();

  const [battleState, setBattleState] = useState<BossBattleState | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);

  // Build the player's deck from their character choices (same pattern as BossBattlePage).
  const playerDeck = useMemo(() => {
    const c = gameState.characterChoices ?? {};
    return generateStarterDeck({
      species: c.species || undefined,
      characterClass: c.characterClass || undefined,
      alignment: c.alignment || undefined,
      element: c.element || undefined,
      name: c.name || undefined,
    });
  }, [gameState.characterChoices]);

  // Lookup the pre-built Collector encounter.
  const collectorEncounter = useMemo(
    () => BOSS_ENCOUNTERS.find(b => b.id === "boss-collector") ?? null,
    [],
  );

  const advance = () => {
    if (phase === "approach") setPhase("helmet");
    else if (phase === "helmet") setPhase("narration");
    else if (phase === "narration") {
      if (lineIdx < COLLECTOR_LINES.length - 1) {
        setLineIdx(i => i + 1);
      } else {
        // Kick off the actual battle.
        if (!collectorEncounter) {
          // Safety net: if the encounter data is missing, short-circuit to defeat.
          setPhase("defeat");
          return;
        }
        const initial = initBossBattle(playerDeck, collectorEncounter);
        setBattleState(initial);
        setPhase("battle");
      }
    }
  };

  const doAction = useCallback((action: Parameters<typeof processBossAction>[1]) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const next = processBossAction(prev, action);
      return next;
    });
    setSelectedAttacker(null);
    setTargetMode(false);
  }, []);

  const handleHandClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;
    if (card.cost > battleState.player.energy) return;
    if (card.type === "unit" && battleState.player.field.length >= 5) return;
    doAction({ type: "PLAY_CARD", cardInstanceId: card.instanceId });
  }, [battleState, doAction]);

  const handleFieldClick = useCallback((card: BattleCard) => {
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

  const handleTargetClick = useCallback((targetId: string | "face") => {
    if (!selectedAttacker || !battleState) return;
    doAction({ type: "ATTACK", attackerInstanceId: selectedAttacker, targetInstanceId: targetId });
  }, [selectedAttacker, battleState, doAction]);

  // Transition into victory/defeat once the engine resolves.
  useEffect(() => {
    if (phase !== "battle") return;
    if (!battleState?.winner) return;
    setPhase(battleState.winner === "player" ? "victory" : "defeat");
  }, [phase, battleState?.winner]);

  const finish = (won: boolean) => {
    onComplete(won);
    onClose();
  };

  const lostCard = lastFactionArc
    ? LAST_ARC_CARD_LOSS[lastFactionArc] ?? "A card from your deck"
    : "A card from your deck";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-4 overflow-y-auto"
    >
      {/* Atmospheric backdrop — Thalorian field */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-black to-red-950/30" />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 70%, rgba(34,197,94,0.12) 0%, transparent 60%)" }}
        />
      </div>

      <div className={`relative z-10 w-full ${phase === "battle" ? "max-w-3xl" : "max-w-2xl"}`}>
        {/* Header */}
        <div className="text-center mb-6">
          <Flower2 size={28} className="text-emerald-400 mx-auto mb-2" />
          <p className="font-display text-xs tracking-[0.4em] text-emerald-300">THE COLLECTOR'S GARDEN</p>
          <p className="font-mono text-[9px] text-white/30 mt-1">Thalorian field · proximity to the Shadow Tongue's birthplace</p>
        </div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Landing */}
          {phase === "approach" && (
            <motion.div
              key="approach"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-black/60 border border-white/10"
            >
              <p className="font-mono text-xs text-white/70 leading-relaxed italic">
                The coordinates were not on any map. You fly to them anyway. The Ark lands in a Thalorian field.
                The grass is tall. The grass is still warm.
              </p>
              <button onClick={advance} className="mt-4 w-full py-2.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] hover:bg-white/10">
                STEP OUT OF THE ARK
              </button>
            </motion.div>
          )}

          {/* Phase 2: Helmet */}
          {phase === "helmet" && (
            <motion.div
              key="helmet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-black/60 border border-white/10"
            >
              <p className="font-mono text-xs text-white/70 leading-relaxed italic">
                A single xenomorph-shaped helmet is half-buried in the grass. You do not know why you recognize it
                but you recognize it the way you recognize your own handwriting.
              </p>
              <p className="font-mono text-xs text-white/70 leading-relaxed italic mt-2">You pick it up.</p>
              <button onClick={advance} className="mt-4 w-full py-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] hover:bg-rose-500/20">
                PICK UP THE HELMET
              </button>
            </motion.div>
          )}

          {/* Phase 3: Collector narration */}
          {phase === "narration" && (
            <motion.div
              key={`narration-${lineIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-xl bg-gradient-to-b from-rose-950/40 to-black border border-rose-500/30"
            >
              <div className="flex items-start gap-3">
                <Mic size={14} className="text-rose-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-[9px] text-rose-400/60 tracking-wider mb-2">THE COLLECTOR</p>
                  <p className="font-mono text-sm text-rose-200 italic leading-relaxed">{COLLECTOR_LINES[lineIdx]}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono text-[8px] text-white/20">{lineIdx + 1} / {COLLECTOR_LINES.length}</span>
                <button onClick={advance} className="px-4 py-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold hover:bg-rose-500/20">
                  {lineIdx < COLLECTOR_LINES.length - 1 ? "CONTINUE" : "DRAW YOUR DECK"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Real battle UI */}
          {phase === "battle" && battleState && collectorEncounter && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-black/70 border border-rose-500/40 overflow-hidden"
            >
              {/* Boss HP strip */}
              <div className="p-3 border-b border-rose-500/20 bg-gradient-to-r from-rose-950/40 to-black">
                <div className="flex items-center gap-3">
                  <img src={collectorEncounter.image} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-rose-400/30" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-display text-xs tracking-wider text-rose-200">{collectorEncounter.name}</span>
                      <span className="font-mono text-[8px] text-purple-400/60 px-1.5 py-0.5 rounded-full bg-purple-400/10">
                        PHASE {battleState.bossPhase}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={10} className="text-red-400" />
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-red-500"
                          animate={{ width: `${Math.max(0, (battleState.enemy.hp / battleState.enemy.maxHP) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-white/60">
                        {battleState.enemy.hp}/{battleState.enemy.maxHP}
                      </span>
                    </div>
                  </div>
                </div>
                {battleState.bossDialog && (
                  <p className="font-mono text-[10px] text-rose-300/80 italic mt-2">&ldquo;{battleState.bossDialog}&rdquo;</p>
                )}
              </div>

              {/* Boss field */}
              <div className="px-3 py-2 min-h-[7rem] flex items-center justify-center gap-1.5 flex-wrap">
                {battleState.enemy.field.length === 0 ? (
                  <p className="font-mono text-[10px] text-white/20 italic">No boss units on the field</p>
                ) : (
                  battleState.enemy.field.map(c => (
                    <MiniBattleCard
                      key={c.instanceId}
                      card={c}
                      targetable={targetMode}
                      onClick={() => targetMode && handleTargetClick(c.instanceId)}
                    />
                  ))
                )}
              </div>

              {/* Attack boss face button */}
              <div className="flex items-center justify-center gap-3 py-2 border-y border-white/5">
                {targetMode && (
                  <button
                    onClick={() => handleTargetClick("face")}
                    className="px-3 py-1 rounded-md font-mono text-[10px] bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/25"
                  >
                    <Target size={9} className="inline mr-1" /> ATTACK BOSS
                  </button>
                )}
                <p className="font-mono text-[9px] text-white/40">
                  Turn {battleState.turnNumber} — {battleState.turn === "player" ? "YOUR TURN" : "BOSS TURN"}
                </p>
                {targetMode && (
                  <button
                    onClick={() => {
                      setSelectedAttacker(null);
                      setTargetMode(false);
                    }}
                    className="px-2 py-0.5 rounded font-mono text-[9px] text-white/40 border border-white/10"
                  >
                    CANCEL
                  </button>
                )}
              </div>

              {/* Player field */}
              <div className="px-3 py-2 min-h-[7rem] flex items-center justify-center gap-1.5 flex-wrap">
                {battleState.player.field.length === 0 ? (
                  <p className="font-mono text-[10px] text-white/20 italic">Deploy units from your hand</p>
                ) : (
                  battleState.player.field.map(c => (
                    <MiniBattleCard
                      key={c.instanceId}
                      card={c}
                      selected={selectedAttacker === c.instanceId}
                      disabled={c.hasAttacked || c.justDeployed}
                      onClick={() => handleFieldClick(c)}
                    />
                  ))
                )}
              </div>

              {/* Player HP + End turn */}
              <div className="flex items-center gap-3 px-3 py-2 border-t border-white/5 bg-black/40">
                <Heart size={12} className="text-cyan-400" />
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    animate={{ width: `${Math.max(0, (battleState.player.hp / battleState.player.maxHP) * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-white/60">
                  {battleState.player.hp}/{battleState.player.maxHP}
                </span>
                <Zap size={10} className="text-blue-400/70 ml-2" />
                <span className="font-mono text-[10px] text-blue-300">
                  {battleState.player.energy}/{battleState.player.maxEnergy}
                </span>
                <button
                  onClick={() => doAction({ type: "END_TURN" })}
                  disabled={battleState.turn !== "player" || !!battleState.winner}
                  className="ml-2 px-3 py-1 rounded-md font-mono text-[10px] bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 disabled:opacity-30"
                >
                  END TURN
                </button>
              </div>

              {/* Player hand */}
              <div className="px-3 py-3 border-t border-white/5 overflow-x-auto">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {battleState.player.hand.map(c => (
                    <MiniBattleCard
                      key={c.instanceId}
                      card={c}
                      disabled={c.cost > battleState.player.energy || battleState.turn !== "player" || !!battleState.winner}
                      onClick={() => handleHandClick(c)}
                    />
                  ))}
                  {battleState.player.hand.length === 0 && (
                    <p className="font-mono text-[10px] text-white/20 italic py-4">No cards in hand</p>
                  )}
                </div>
              </div>

              {/* Surrender — narrative fail */}
              <div className="px-3 py-2 border-t border-white/5 text-center">
                <button
                  onClick={() => setPhase("defeat")}
                  className="font-mono text-[9px] text-white/25 hover:text-white/50"
                >
                  Surrender to the Collector
                </button>
              </div>

              {/* Boss passive reminder */}
              <div className="px-3 py-1.5 border-t border-white/5 bg-rose-950/20">
                <p className="font-mono text-[8px] text-rose-400/60">
                  <Shield size={8} className="inline mr-1" />
                  {battleState.bossPassive.name}: {battleState.bossPassive.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase 5: Victory */}
          {phase === "victory" && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <Swords size={24} className="text-emerald-400 mb-3" />
              <p className="font-mono text-xs font-bold text-emerald-400 mb-2">THE COLLECTOR RETREATS</p>
              <p className="font-mono text-[11px] text-white/70 italic leading-relaxed">
                He does not run. He walks, slowly, the way gardeners walk. He will be back. You know he will be back
                and you know he is weeping as he goes. The helmet grows warm in your hands.
              </p>
              <p className="font-mono text-[10px] text-emerald-400/80 mt-3">
                Recovered: The Eyes' final transmission (full version)<br />
                +500 Light Energy · Collector flagged for Act 4
              </p>
              <button onClick={() => finish(true)} className="mt-4 w-full py-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold hover:bg-emerald-500/30">
                CLOSE HER EYES
              </button>
            </motion.div>
          )}

          {/* Phase 6: Defeat */}
          {phase === "defeat" && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <Skull size={28} className="text-red-400 mb-3" />
              <p className="font-mono text-xs font-bold text-red-400 mb-2">THE COLLECTOR TAKES SOMETHING</p>
              <p className="font-mono text-[11px] text-white/70 italic leading-relaxed">
                He plucks the helmet from your fingers gently, the way you would take a knife from a sleeping child.
                He smiles. He reaches into your deck and takes &ldquo;{lostCard}&rdquo; without needing your permission. It is gone.
              </p>
              <p className="font-mono text-[10px] text-red-400/80 mt-3">
                Lost: {lostCard} — permanently removed from your deck<br />
                The Collector will remember your face.
              </p>
              <button onClick={() => finish(false)} className="mt-4 w-full py-2.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold hover:bg-red-500/30">
                LEAVE THE GARDEN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Abort */}
      {phase === "approach" && (
        <button onClick={onClose} className="absolute top-4 right-4 px-3 py-1 rounded bg-white/5 text-white/30 font-mono text-[9px] hover:text-white/60">
          NOT YET
        </button>
      )}
    </motion.div>
  );
}
