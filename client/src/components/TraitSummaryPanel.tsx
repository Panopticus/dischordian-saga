import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Layers, Globe, Swords, Wrench, Telescope, Star,
  ChevronDown, ChevronUp, Activity, Zap, Shield,
  Heart, Target, Crosshair, Eye, Skull, Gem,
  TrendingUp, Percent, Clock, Sparkles
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   TRAIT SUMMARY PANEL — Live numbers from backend
   Shows exactly how the player's build affects every
   game system with real calculated values.
   ═══════════════════════════════════════════════════ */

const SYSTEM_CONFIGS = [
  {
    key: "cardGame",
    label: "CARD GAME",
    icon: Layers,
    color: "text-cyan-400",
    borderColor: "border-cyan-400/20",
    bgColor: "bg-cyan-500/5",
    glowColor: "shadow-[0_0_8px_rgba(51,226,230,0.1)]",
  },
  {
    key: "fightGame",
    label: "FIGHT ARENA",
    icon: Swords,
    color: "text-red-400",
    borderColor: "border-red-400/20",
    bgColor: "bg-red-500/5",
    glowColor: "shadow-[0_0_8px_rgba(248,113,113,0.1)]",
  },
  {
    key: "tradeEmpire",
    label: "TRADE EMPIRE",
    icon: Globe,
    color: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-500/5",
    glowColor: "shadow-[0_0_8px_rgba(251,191,36,0.1)]",
  },
  {
    key: "crafting",
    label: "CRAFTING",
    icon: Wrench,
    color: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-500/5",
    glowColor: "shadow-[0_0_8px_rgba(52,211,153,0.1)]",
  },
  {
    key: "exploration",
    label: "EXPLORATION",
    icon: Telescope,
    color: "text-indigo-400",
    borderColor: "border-indigo-400/20",
    bgColor: "bg-indigo-500/5",
    glowColor: "shadow-[0_0_8px_rgba(129,140,248,0.1)]",
  },
] as const;

interface StatRowProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  color?: string;
  isPercentage?: boolean;
  isMultiplier?: boolean;
}

function StatRow({ icon: Icon, label, value, color = "text-foreground", isPercentage, isMultiplier }: StatRowProps) {
  const displayValue = isPercentage
    ? `${typeof value === "number" ? (value * 100).toFixed(0) : value}%`
    : isMultiplier
    ? `${typeof value === "number" ? value.toFixed(2) : value}x`
    : typeof value === "number" && value > 0
    ? `+${value}`
    : String(value);

  const isPositive = typeof value === "number" && value > 0;
  const valueColor = isPositive ? "text-emerald-400" : typeof value === "number" && value === 0 ? "text-muted-foreground/40" : color;

  return (
    <div className="flex items-center justify-between py-1 group">
      <div className="flex items-center gap-1.5">
        <Icon size={9} className="text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
        <span className="font-mono text-[9px] text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors">{label}</span>
      </div>
      <span className={`font-mono text-[10px] font-bold ${valueColor} tabular-nums`}>{displayValue}</span>
    </div>
  );
}

function BreakdownRow({ source, effect }: { source: string; effect: string }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="font-mono text-[8px] text-primary/60 whitespace-nowrap mt-0.5">▸</span>
      <div className="min-w-0">
        <span className="font-mono text-[8px] text-muted-foreground/50">{source}</span>
        <span className="font-mono text-[8px] text-muted-foreground/30 mx-1">→</span>
        <span className="font-mono text-[8px] text-foreground/70">{effect}</span>
      </div>
    </div>
  );
}

function SystemCard({ config, data, isExpanded, onToggle }: {
  config: typeof SYSTEM_CONFIGS[number];
  data: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = config.icon;
  const breakdown = data?.breakdown || [];

  return (
    <motion.div
      layout
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} ${config.glowColor} overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}>
            <Icon size={12} className={config.color} />
          </div>
          <span className={`font-display text-[10px] font-bold tracking-[0.2em] ${config.color}`}>{config.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {breakdown.length > 0 && (
            <span className="font-mono text-[7px] text-muted-foreground/30 tracking-wider">
              {breakdown.length} SOURCES
            </span>
          )}
          {isExpanded ? <ChevronUp size={10} className="text-muted-foreground/30" /> : <ChevronDown size={10} className="text-muted-foreground/30" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-white/5 pt-2">
              {/* Live stat values */}
              {config.key === "cardGame" && data && (
                <div className="space-y-0.5 mb-3">
                  <StatRow icon={Heart} label="Player HP Bonus" value={data.hpBonus} />
                  <StatRow icon={Crosshair} label="Unit ATK Bonus" value={data.globalAttackBonus} />
                  <StatRow icon={Shield} label="Unit HP Bonus" value={data.globalHealthBonus} />
                  <StatRow icon={Zap} label="Starting Energy" value={data.energyBonus} />
                  <StatRow icon={Star} label="Starting Influence" value={data.influenceBonus} />
                  {data.extraDrawEveryNTurns > 0 && (
                    <StatRow icon={Layers} label={`Extra Draw Every ${data.extraDrawEveryNTurns} Turns`} value={1} />
                  )}
                  <StatRow icon={Percent} label="Cost Reduction Chance" value={data.costReductionChance} isPercentage />
                  {data.elementAffinity && (
                    <StatRow icon={Sparkles} label={`${data.elementAffinity} Cards ATK Bonus`} value={2} />
                  )}
                </div>
              )}

              {config.key === "fightGame" && data && (
                <div className="space-y-0.5 mb-3">
                  <StatRow icon={Crosshair} label="Attack Bonus" value={data.attackBonus} />
                  <StatRow icon={Shield} label="Defense Bonus" value={data.defenseBonus} />
                  <StatRow icon={Heart} label="HP Bonus" value={data.hpBonus} />
                  <StatRow icon={Zap} label="Speed Bonus" value={data.speedBonus} />
                  <StatRow icon={Target} label="Crit Chance Bonus" value={data.critChanceBonus} isPercentage />
                  <StatRow icon={Swords} label="Counter Bonus" value={data.counterBonus} isPercentage />
                  <StatRow icon={TrendingUp} label="XP Multiplier" value={data.xpMultiplier} isMultiplier />
                  <StatRow icon={Gem} label="Dream Multiplier" value={data.dreamMultiplier} isMultiplier />
                  {data.elementResistance && (
                    <StatRow icon={Sparkles} label={`${data.elementResistance} Resistance`} value="Active" color="text-emerald-400" />
                  )}
                </div>
              )}

              {config.key === "tradeEmpire" && data && (
                <div className="space-y-0.5 mb-3">
                  <StatRow icon={Swords} label="Combat Power" value={data.combatPowerBonus} />
                  <StatRow icon={Shield} label="Shield Reduction" value={data.shieldDamageReduction} isPercentage />
                  <StatRow icon={Percent} label="Trade Discount" value={data.tradePriceDiscount} isPercentage />
                  <StatRow icon={Gem} label="Trade Credits Bonus" value={data.tradeCreditsBonus} />
                  <StatRow icon={Target} label="Hazard Resistance" value={data.hazardResistance} isPercentage />
                  <StatRow icon={TrendingUp} label="XP Bonus" value={data.xpBonus} />
                  <StatRow icon={Clock} label="Bonus Turns" value={data.bonusTurns} />
                  <StatRow icon={Layers} label="Card Drop Rate" value={data.cardDropRateBonus} isPercentage />
                  <StatRow icon={Eye} label="Scan Range" value={data.scanRangeBonus} />
                  <StatRow icon={Star} label="Colony Income" value={data.colonyIncomeMultiplier} isMultiplier />
                </div>
              )}

              {config.key === "crafting" && data && (
                <div className="space-y-0.5 mb-3">
                  <StatRow icon={Target} label="Success Rate Bonus" value={data.successRateBonus} isPercentage />
                  <StatRow icon={Gem} label="Dream Cost Reduction" value={data.dreamCostReduction} isPercentage />
                  <StatRow icon={Layers} label="Material Preserve" value={data.materialPreserveChance} isPercentage />
                  <StatRow icon={Star} label="Bonus Output Chance" value={data.bonusOutputChance} isPercentage />
                </div>
              )}

              {config.key === "exploration" && data && (
                <div className="space-y-0.5 mb-3">
                  <StatRow icon={TrendingUp} label="Discovery XP Bonus" value={data.discoveryXpBonus} />
                  <StatRow icon={Eye} label="Hidden Item Chance" value={data.hiddenItemChance} isPercentage />
                  <StatRow icon={Sparkles} label="Extra Puzzle Hints" value={data.extraPuzzleHints} />
                  <StatRow icon={Skull} label="Easter Egg Detection" value={data.easterEggBonus} />
                  <StatRow icon={Gem} label="Dream Bonus" value={data.dreamBonus} isPercentage />
                  <StatRow icon={Star} label="Rarity Upgrade Chance" value={data.rarityUpgradeChance} isPercentage />
                </div>
              )}

              {/* Breakdown sources */}
              {breakdown.length > 0 && (
                <div className="border-t border-white/5 pt-2 mt-1">
                  <span className="font-mono text-[7px] text-muted-foreground/30 tracking-[0.2em] block mb-1">BONUS SOURCES</span>
                  {breakdown.map((b: { source: string; effect: string }, i: number) => (
                    <BreakdownRow key={i} source={b.source} effect={b.effect} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TraitSummaryPanel({ isAuthenticated }: { isAuthenticated: boolean }) {
  const traitBonuses = trpc.nft.getAllTraitBonuses.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set());
  const [showPanel, setShowPanel] = useState(false);

  const toggleSystem = (key: string) => {
    setExpandedSystems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    if (expandedSystems.size === SYSTEM_CONFIGS.length) {
      setExpandedSystems(new Set());
    } else {
      setExpandedSystems(new Set(SYSTEM_CONFIGS.map(c => c.key)));
    }
  };

  const data = traitBonuses.data;
  const nftMultiplier = data?.nftMultiplier ?? 1.0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-float rounded-lg overflow-hidden mb-6"
    >
      {/* Header */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Activity size={14} className="text-primary" />
          </div>
          <div className="text-left">
            <span className="font-display text-[11px] font-bold tracking-[0.2em] text-foreground/90 block">
              TRAIT IMPACT ANALYSIS
            </span>
            <span className="font-mono text-[8px] text-muted-foreground/40">
              Live bonuses across all game systems
              {nftMultiplier > 1.0 && (
                <span className="text-amber-400 ml-2">✦ {((nftMultiplier - 1) * 100).toFixed(0)}% NFT BOOST</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {traitBonuses.isLoading && (
            <div className="w-3 h-3 rounded-full border border-primary/30 border-t-primary animate-spin" />
          )}
          <span className="font-mono text-[8px] text-muted-foreground/40">
            {showPanel ? "COLLAPSE" : "EXPAND"}
          </span>
          {showPanel ? <ChevronUp size={12} className="text-muted-foreground/40" /> : <ChevronDown size={12} className="text-muted-foreground/40" />}
        </div>
      </button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/5 pt-4">
              {traitBonuses.isLoading ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full border border-dashed border-primary/20 mx-auto mb-3 animate-[spin_4s_linear_infinite] flex items-center justify-center">
                    <Activity size={16} className="text-primary animate-pulse" />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.2em]">CALCULATING TRAIT IMPACT...</p>
                </div>
              ) : traitBonuses.error ? (
                <div className="text-center py-6">
                  <p className="font-mono text-[10px] text-destructive">Failed to load trait data</p>
                  <button
                    onClick={() => traitBonuses.refetch()}
                    className="font-mono text-[9px] text-primary mt-2 hover:underline"
                  >
                    RETRY
                  </button>
                </div>
              ) : !data?.citizen ? (
                <div className="text-center py-6">
                  <p className="font-mono text-[10px] text-muted-foreground/40">No citizen data available</p>
                </div>
              ) : (
                <>
                  {/* NFT Multiplier Banner */}
                  {nftMultiplier > 1.0 && (
                    <div className="mb-4 p-2.5 rounded-lg bg-amber-500/5 border border-amber-400/15 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                        <Gem size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <span className="font-display text-[10px] font-bold text-amber-400 tracking-wider block">
                          POTENTIAL NFT ACTIVE — {((nftMultiplier - 1) * 100).toFixed(0)}% UNIVERSAL BOOST
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground/50">
                          Level {data.nft?.level ?? "?"} multiplier applied to all systems
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse All */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={expandAll}
                      className="font-mono text-[8px] text-muted-foreground/40 hover:text-primary transition-colors tracking-wider"
                    >
                      {expandedSystems.size === SYSTEM_CONFIGS.length ? "COLLAPSE ALL" : "EXPAND ALL"}
                    </button>
                  </div>

                  {/* System Cards Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SYSTEM_CONFIGS.map(config => (
                      <SystemCard
                        key={config.key}
                        config={config}
                        data={data[config.key as keyof typeof data]}
                        isExpanded={expandedSystems.has(config.key)}
                        onToggle={() => toggleSystem(config.key)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
