/* ═══════════════════════════════════════════════════════
   MORALITY UNLOCKABLES PANEL — Shows tier-gated rewards
   Displays what's unlocked, what's locked, and progress
   toward the next unlock on the player's current path.
   Zero-sum: gaining Machine loses Humanity and vice versa.
   ═══════════════════════════════════════════════════════ */
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Heart, Shield, Sparkles, Zap, Cpu, Flame, Eye,
  Crown, Skull, Star, Gem, Lock, Unlock, ChevronDown,
  ChevronUp, ArrowRight, AlertTriangle
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  MORALITY_UNLOCKABLES,
  getUnlockedItems,
  getNextUnlockable,
  isUnlocked,
  CATEGORY_LABELS,
  type MoralityUnlockable,
  type UnlockableCategory,
} from "@/data/moralityUnlockables";
import { getMoralityTierDef, MORALITY_TIERS } from "@/components/MoralityMeter";

const ICON_MAP: Record<string, typeof Bot> = {
  cpu: Cpu, heart: Heart, shield: Shield, sparkles: Sparkles,
  bot: Bot, zap: Zap, flame: Flame, eye: Eye,
  crown: Crown, skull: Skull, star: Star, gem: Gem,
};

const CATEGORY_ICONS: Record<UnlockableCategory, typeof Bot> = {
  ship_theme: Sparkles,
  character_aura: Star,
  card_effect: Gem,
  title: Crown,
  item: Shield,
  ability_mod: Zap,
};

export default function MoralityUnlockablesPanel() {
  const { state, unlockMoralityReward } = useGame();
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "machine" | "humanity">("all");

  const score = state.moralityScore;
  const tier = getMoralityTierDef(score);
  const unlocked = useMemo(() => getUnlockedItems(score), [score]);
  const nextUnlock = useMemo(() => getNextUnlockable(score), [score]);
  const unlockedIds = new Set(unlocked.map(u => u.id));

  // Auto-claim newly unlocked rewards (wrapped in useEffect to avoid setState during render)
  const unclaimedUnlocks = useMemo(
    () => unlocked.filter(u => !state.moralityUnlocks.includes(u.id)),
    [unlocked, state.moralityUnlocks]
  );
  useEffect(() => {
    if (unclaimedUnlocks.length > 0) {
      unclaimedUnlocks.forEach(u => unlockMoralityReward(u.id));
    }
  }, [unclaimedUnlocks, unlockMoralityReward]);

  // Group by side for display
  const machineItems = MORALITY_UNLOCKABLES.filter(u => u.side === "machine").sort((a, b) => a.requiredLevel - b.requiredLevel);
  const humanityItems = MORALITY_UNLOCKABLES.filter(u => u.side === "humanity").sort((a, b) => a.requiredLevel - b.requiredLevel);
  const balancedItems = MORALITY_UNLOCKABLES.filter(u => u.side === "balanced");

  const displayItems = viewMode === "machine" ? machineItems
    : viewMode === "humanity" ? humanityItems
    : MORALITY_UNLOCKABLES;

  // Calculate progress to next unlock
  const progressToNext = useMemo(() => {
    if (!nextUnlock) return null;
    const threshold = nextUnlock.scoreThreshold;
    const distance = Math.abs(score - threshold);
    // Find the previous threshold
    const prevThreshold = nextUnlock.side === "machine"
      ? Math.max(score, threshold + 20)
      : Math.min(score, threshold - 20);
    const totalDistance = Math.abs(prevThreshold - threshold);
    const progress = totalDistance > 0 ? Math.max(0, Math.min(100, ((totalDistance - distance) / totalDistance) * 100)) : 0;
    return { distance, progress, pointsNeeded: distance };
  }, [score, nextUnlock]);

  return (
    <div className="rounded-lg border border-border/30 bg-card/40 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors"
      >
        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${tier.color}20` }}>
          <Shield size={16} style={{ color: tier.color }} />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-bold tracking-wider" style={{ color: tier.color }}>
              MORALITY UNLOCKABLES
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {unlocked.length}/{MORALITY_UNLOCKABLES.length} unlocked
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Bot size={10} className="text-destructive/60" />
            <div className="flex-1 h-1.5 rounded-full bg-secondary/30 overflow-hidden relative">
              {/* Tier segments */}
              <div className="absolute inset-0 flex">
                {MORALITY_TIERS.map((t, i) => (
                  <div
                    key={i}
                    className="h-full"
                    style={{
                      width: `${100 / MORALITY_TIERS.length}%`,
                      backgroundColor: `${t.color}${score >= t.minScore && score <= t.maxScore ? "60" : "15"}`,
                    }}
                  />
                ))}
              </div>
              {/* Score indicator */}
              <motion.div
                className="absolute top-0 w-1.5 h-full rounded-full"
                style={{ backgroundColor: tier.color, boxShadow: `0 0 4px ${tier.glowColor}` }}
                animate={{ left: `calc(${((score + 100) / 200) * 100}% - 3px)` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </div>
            <Heart size={10} className="text-primary/60" />
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/20 pt-3">
              {/* Zero-sum warning */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/15">
                <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] text-amber-400/80 leading-relaxed">
                  The Morality Melter is <span className="font-bold text-amber-300">zero-sum</span>. Gaining Machine alignment costs Humanity alignment, and vice versa. Choose wisely — every choice has a price.
                </p>
              </div>

              {/* Next unlock progress */}
              {nextUnlock && progressToNext && (
                <div className="rounded-md border border-border/20 bg-secondary/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight size={12} style={{ color: nextUnlock.color }} />
                    <span className="font-mono text-[10px] tracking-wider" style={{ color: nextUnlock.color }}>
                      NEXT UNLOCK
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md" style={{ backgroundColor: `${nextUnlock.color}15` }}>
                      {(() => { const Icon = ICON_MAP[nextUnlock.icon] || Shield; return <Icon size={14} style={{ color: nextUnlock.color }} />; })()}
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-xs font-semibold">{nextUnlock.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/60">
                        {progressToNext.pointsNeeded} points to {nextUnlock.side === "machine" ? "Machine" : "Humanity"} needed
                      </p>
                      <div className="h-1 rounded-full bg-secondary/30 mt-1 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: nextUnlock.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressToNext.progress}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View mode tabs */}
              <div className="flex items-center gap-1">
                {(["all", "machine", "humanity"] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md font-mono text-[10px] tracking-wider transition-all ${
                      viewMode === mode
                        ? mode === "machine" ? "bg-destructive/15 text-destructive border border-destructive/30"
                        : mode === "humanity" ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-secondary text-foreground border border-border/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30 border border-transparent"
                    }`}
                  >
                    {mode === "all" ? "ALL" : mode === "machine" ? "MACHINE" : "HUMANITY"}
                  </button>
                ))}
                <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">
                  Score: {score > 0 ? "+" : ""}{score}
                </span>
              </div>

              {/* Unlockables grid */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {/* Balanced items (always show first if viewing all) */}
                {viewMode === "all" && balancedItems.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={10} className="text-purple-400" />
                      <span className="font-mono text-[9px] text-purple-400 tracking-[0.2em]">BALANCED</span>
                    </div>
                    {balancedItems.map(item => (
                      <UnlockableRow key={item.id} item={item} isUnlocked={true} score={score} />
                    ))}
                  </div>
                )}

                {/* Machine items */}
                {(viewMode === "all" || viewMode === "machine") && (
                  <div className="mb-3">
                    {viewMode === "all" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={10} className="text-destructive" />
                        <span className="font-mono text-[9px] text-destructive tracking-[0.2em]">MACHINE PATH</span>
                        <span className="font-mono text-[8px] text-muted-foreground/40">
                          ({machineItems.filter(i => unlockedIds.has(i.id)).length}/{machineItems.length})
                        </span>
                      </div>
                    )}
                    {machineItems.map(item => (
                      <UnlockableRow key={item.id} item={item} isUnlocked={unlockedIds.has(item.id)} score={score} />
                    ))}
                  </div>
                )}

                {/* Humanity items */}
                {(viewMode === "all" || viewMode === "humanity") && (
                  <div>
                    {viewMode === "all" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Heart size={10} className="text-primary" />
                        <span className="font-mono text-[9px] text-primary tracking-[0.2em]">HUMANITY PATH</span>
                        <span className="font-mono text-[8px] text-muted-foreground/40">
                          ({humanityItems.filter(i => unlockedIds.has(i.id)).length}/{humanityItems.length})
                        </span>
                      </div>
                    )}
                    {humanityItems.map(item => (
                      <UnlockableRow key={item.id} item={item} isUnlocked={unlockedIds.has(item.id)} score={score} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── INDIVIDUAL UNLOCKABLE ROW ─── */
function UnlockableRow({ item, isUnlocked: unlocked, score }: {
  item: MoralityUnlockable;
  isUnlocked: boolean;
  score: number;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const Icon = ICON_MAP[item.icon] || Shield;
  const CatIcon = CATEGORY_ICONS[item.category] || Shield;

  const pointsAway = !unlocked
    ? item.side === "machine"
      ? Math.abs(score - item.scoreThreshold)
      : Math.abs(item.scoreThreshold - score)
    : 0;

  return (
    <div className="mb-1.5">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
          unlocked
            ? "bg-secondary/20 border border-border/20 hover:bg-secondary/30"
            : "bg-secondary/5 border border-border/10 opacity-60 hover:opacity-80"
        }`}
      >
        {/* Lock/Unlock indicator */}
        <div className="p-1 rounded" style={{ backgroundColor: unlocked ? `${item.color}15` : "transparent" }}>
          {unlocked
            ? <Icon size={14} style={{ color: item.color }} />
            : <Lock size={14} className="text-muted-foreground/40" />
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-[11px] font-semibold truncate ${unlocked ? "" : "text-muted-foreground/60"}`}
              style={unlocked ? { color: item.color } : undefined}
            >
              {item.name}
            </span>
            <span className="font-mono text-[8px] text-muted-foreground/40 shrink-0">
              L{item.requiredLevel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CatIcon size={8} className="text-muted-foreground/40" />
            <span className="font-mono text-[8px] text-muted-foreground/40">
              {CATEGORY_LABELS[item.category]}
            </span>
            {!unlocked && (
              <span className="font-mono text-[8px] text-amber-400/60">
                {pointsAway} pts away
              </span>
            )}
          </div>
        </div>

        {/* Status badge */}
        {unlocked ? (
          <Unlock size={10} style={{ color: item.color }} />
        ) : (
          <Lock size={10} className="text-muted-foreground/30" />
        )}
      </button>

      {/* Detail expansion */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mr-2 mt-1 mb-2 px-3 py-2 rounded-md bg-secondary/10 border border-border/10">
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mb-1.5">
                {item.description}
              </p>
              <div className="flex items-center gap-1.5">
                <Zap size={9} style={{ color: item.color }} />
                <span className="font-mono text-[9px]" style={{ color: item.color }}>
                  {item.effect}
                </span>
              </div>
              {!unlocked && (
                <p className="font-mono text-[9px] text-amber-400/50 mt-1">
                  Requires {item.side === "machine" ? "Machine" : "Humanity"} Level {item.requiredLevel} (score {item.side === "machine" ? "≤" : "≥"} {item.scoreThreshold})
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
