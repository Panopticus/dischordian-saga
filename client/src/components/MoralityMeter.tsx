/* ═══════════════════════════════════════════════════════
   MORALITY METER — Machine vs Humanity zero-sum gauge
   Range: -100 (Machine) to +100 (Humanity)
   Inspired by KOTOR's Light/Dark side meter
   ═══════════════════════════════════════════════════════ */
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Heart, Zap, Shield, Cpu, Sparkles } from "lucide-react";
import { useState } from "react";

/* ─── MORALITY TIER DEFINITIONS ─── */
export interface MoralityTierDef {
  minScore: number;
  maxScore: number;
  label: string;
  side: "machine" | "balanced" | "humanity";
  level: number;
  color: string;
  glowColor: string;
  icon: typeof Bot;
  description: string;
  bonuses: string[];
}

export const MORALITY_TIERS: MoralityTierDef[] = [
  { minScore: -100, maxScore: -80, label: "Machine Ascendant", side: "machine", level: 5, color: "#ef4444", glowColor: "rgba(239,68,68,0.4)", icon: Cpu, description: "You have fully embraced the cold logic of the Machine. Emotion is weakness. Efficiency is truth.", bonuses: ["+25% card draw efficiency", "Machine Overlord ship theme", "Crimson Circuit character aura", "Access to Terminus Protocol items"] },
  { minScore: -79, maxScore: -60, label: "Machine Devoted", side: "machine", level: 4, color: "#f97316", glowColor: "rgba(249,115,22,0.4)", icon: Cpu, description: "The Machine's whisper is your guiding star. Organic concerns fade before pure calculation.", bonuses: ["+20% fight damage vs Humanity", "Neural Network ship theme", "Amber Circuitry character aura"] },
  { minScore: -59, maxScore: -40, label: "Machine Aligned", side: "machine", level: 3, color: "#eab308", glowColor: "rgba(234,179,8,0.4)", icon: Bot, description: "Logic guides your hand. The Machine's order appeals to your sense of purpose.", bonuses: ["+15% Dream Token earnings", "Steel Forge ship theme", "Chrome Veins character effect"] },
  { minScore: -39, maxScore: -20, label: "Machine Leaning", side: "machine", level: 2, color: "#a3a3a3", glowColor: "rgba(163,163,163,0.3)", icon: Bot, description: "You see the appeal of the Machine's order, though you haven't fully committed.", bonuses: ["+10% XP from research", "Industrial ship accent"] },
  { minScore: -19, maxScore: 19, label: "Balanced", side: "balanced", level: 1, color: "#a855f7", glowColor: "rgba(168,85,247,0.3)", icon: Shield, description: "You walk the line between Machine and Humanity, drawing from both without committing to either.", bonuses: ["+5% to all stats", "Twilight Equilibrium ship theme"] },
  { minScore: 20, maxScore: 39, label: "Humanity Leaning", side: "humanity", level: 2, color: "#a3a3a3", glowColor: "rgba(163,163,163,0.3)", icon: Heart, description: "Your heart pulls toward the warmth of Humanity, though doubt still lingers.", bonuses: ["+10% XP from exploration", "Verdant ship accent"] },
  { minScore: 40, maxScore: 59, label: "Humanity Aligned", side: "humanity", level: 3, color: "#22c55e", glowColor: "rgba(34,197,94,0.4)", icon: Heart, description: "Empathy and connection define your path. The organic spark matters more than cold efficiency.", bonuses: ["+15% Dream Token earnings", "Living Garden ship theme", "Emerald Pulse character effect"] },
  { minScore: 60, maxScore: 79, label: "Humanity Devoted", side: "humanity", level: 4, color: "#3b82f6", glowColor: "rgba(59,130,246,0.4)", icon: Sparkles, description: "You champion the cause of all organic life. The Machine's order is a cage to be broken.", bonuses: ["+20% fight damage vs Machine", "Celestial Dawn ship theme", "Azure Radiance character aura"] },
  { minScore: 80, maxScore: 100, label: "Humanity Ascendant", side: "humanity", level: 5, color: "#06b6d4", glowColor: "rgba(6,182,212,0.4)", icon: Sparkles, description: "You are the living embodiment of Humanity's hope. Your very presence inspires organic life.", bonuses: ["+25% card draw efficiency", "Humanity's Beacon ship theme", "Starlight Halo character aura", "Access to Genesis Protocol items"] },
];

export function getMoralityTierDef(score: number): MoralityTierDef {
  return MORALITY_TIERS.find(t => score >= t.minScore && score <= t.maxScore) || MORALITY_TIERS[4];
}

/* ─── COMPACT MORALITY BAR (for headers/sidebars) ─── */
export function MoralityBar({ className = "" }: { className?: string }) {
  const { state } = useGame();
  const tier = getMoralityTierDef(state.moralityScore);
  const pct = ((state.moralityScore + 100) / 200) * 100; // 0% = full Machine, 100% = full Humanity

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Bot size={12} className="text-destructive shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden relative">
        <div className="absolute inset-0 flex">
          <div className="h-full bg-gradient-to-r from-destructive/60 to-destructive/20" style={{ width: `${50}%` }} />
          <div className="h-full bg-gradient-to-r from-primary/20 to-primary/60" style={{ width: `${50}%` }} />
        </div>
        <motion.div
          className="absolute top-0 h-full w-1 rounded-full"
          style={{ backgroundColor: tier.color, boxShadow: `0 0 6px ${tier.glowColor}` }}
          animate={{ left: `calc(${pct}% - 2px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      </div>
      <Heart size={12} className="text-primary shrink-0" />
    </div>
  );
}

/* ─── FULL MORALITY METER (for character sheet/dedicated view) ─── */
export function MoralityMeter({ showDetails = true }: { showDetails?: boolean }) {
  const { state, getMoralityLabel } = useGame();
  const [expanded, setExpanded] = useState(false);
  const tier = getMoralityTierDef(state.moralityScore);
  const TierIcon = tier.icon;
  const pct = ((state.moralityScore + 100) / 200) * 100;
  const label = getMoralityLabel();

  return (
    <div className="rounded-lg border border-border/30 bg-card/40 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors"
      >
        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${tier.color}20` }}>
          <TierIcon size={16} style={{ color: tier.color }} />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-bold tracking-wider" style={{ color: tier.color }}>
              {label}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              [{state.moralityScore > 0 ? "+" : ""}{state.moralityScore}]
            </span>
          </div>
          {/* Gauge bar */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="font-mono text-[9px] text-destructive/70 w-6">MCH</span>
            <div className="flex-1 h-2.5 rounded-full bg-secondary/40 overflow-hidden relative">
              {/* Background gradient */}
              <div className="absolute inset-0 flex">
                <div className="h-full bg-gradient-to-r from-red-900/40 via-red-800/20 to-transparent" style={{ width: "50%" }} />
                <div className="h-full bg-gradient-to-l from-cyan-900/40 via-cyan-800/20 to-transparent" style={{ width: "50%" }} />
              </div>
              {/* Center line */}
              <div className="absolute left-1/2 top-0 w-px h-full bg-muted-foreground/30" />
              {/* Score indicator */}
              <motion.div
                className="absolute top-0 w-2.5 h-full rounded-full"
                style={{
                  backgroundColor: tier.color,
                  boxShadow: `0 0 8px ${tier.glowColor}, 0 0 16px ${tier.glowColor}`,
                }}
                animate={{ left: `calc(${pct}% - 5px)` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </div>
            <span className="font-mono text-[9px] text-primary/70 w-6 text-right">HUM</span>
          </div>
        </div>
        <Zap size={12} className="text-muted-foreground" />
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-3 border-t border-border/20 pt-3">
              {/* Description */}
              <p className="font-mono text-xs text-muted-foreground leading-relaxed italic">
                "{tier.description}"
              </p>

              {/* Current bonuses */}
              <div>
                <h4 className="font-mono text-[10px] text-muted-foreground/70 tracking-wider mb-1.5">ACTIVE BONUSES</h4>
                <div className="space-y-1">
                  {tier.bonuses.map((bonus, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="font-mono text-[11px]" style={{ color: tier.color }}>{bonus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Choice history */}
              {state.moralityChoices.length > 0 && (
                <div>
                  <h4 className="font-mono text-[10px] text-muted-foreground/70 tracking-wider mb-1.5">
                    RECENT CHOICES ({state.moralityChoices.length})
                  </h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {state.moralityChoices.slice(-5).reverse().map((choice, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={choice.shift < 0 ? "text-destructive" : "text-primary"}>
                          {choice.shift > 0 ? "+" : ""}{choice.shift}
                        </span>
                        <span className="text-muted-foreground truncate">{choice.choiceId.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier progression */}
              <div>
                <h4 className="font-mono text-[10px] text-muted-foreground/70 tracking-wider mb-1.5">ALIGNMENT TIERS</h4>
                <div className="grid grid-cols-9 gap-0.5">
                  {MORALITY_TIERS.map((t, i) => {
                    const isActive = state.moralityScore >= t.minScore && state.moralityScore <= t.maxScore;
                    return (
                      <div
                        key={i}
                        className="h-1.5 rounded-sm transition-all"
                        style={{
                          backgroundColor: isActive ? t.color : `${t.color}30`,
                          boxShadow: isActive ? `0 0 4px ${t.glowColor}` : "none",
                        }}
                        title={t.label}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MoralityMeter;
