/* ═══════════════════════════════════════════════════════
   CHARACTER BONUSES PANEL
   Shows how species/class/element/attributes affect
   every game system. Makes character build feel meaningful.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Swords, Crown, Gamepad2, Pickaxe, Compass, ChevronDown, ChevronUp,
  ShoppingCart, ScrollText, Sparkles, TrendingUp, Map
} from "lucide-react";

interface BonusCategory {
  id: string;
  label: string;
  icon: typeof Swords;
  color: string;
  bgColor: string;
  borderColor: string;
  bonuses: Array<{ label: string; value: string; isPositive: boolean }>;
  breakdown: Array<{ source: string; effect: string }>;
}

export default function CharacterBonusesPanel() {
  const { isAuthenticated } = useAuth();
  const { data: traitData, isLoading } = trpc.nft.getAllTraitBonuses.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isAuthenticated || isLoading) return null;
  if (!traitData?.citizen) return null;

  const b = traitData;

  // Build categories from the trait data — using EXACT property names from interfaces
  const categories: BonusCategory[] = [
    {
      id: "cardGame",
      label: "CARD BATTLES",
      icon: Crown,
      color: "text-amber-400",
      bgColor: "bg-amber-950/20",
      borderColor: "border-amber-500/20",
      bonuses: [
        { label: "HP Bonus", value: `+${b.cardGame.hpBonus}`, isPositive: b.cardGame.hpBonus > 0 },
        { label: "Influence", value: `+${b.cardGame.influenceBonus}`, isPositive: b.cardGame.influenceBonus > 0 },
        { label: "Energy", value: `+${b.cardGame.energyBonus}`, isPositive: b.cardGame.energyBonus > 0 },
        { label: "ATK Bonus", value: `+${b.cardGame.globalAttackBonus}`, isPositive: b.cardGame.globalAttackBonus > 0 },
        { label: "HP Bonus (units)", value: `+${b.cardGame.globalHealthBonus}`, isPositive: b.cardGame.globalHealthBonus > 0 },
        { label: "Element Affinity", value: b.cardGame.elementAffinity || "None", isPositive: !!b.cardGame.elementAffinity },
        { label: "Cost Reduction", value: `${Math.round(b.cardGame.costReductionChance * 100)}%`, isPositive: b.cardGame.costReductionChance > 0 },
      ],
      breakdown: b.cardGame.breakdown,
    },
    {
      id: "fightGame",
      label: "FIGHTING",
      icon: Swords,
      color: "text-red-400",
      bgColor: "bg-red-950/20",
      borderColor: "border-red-500/20",
      bonuses: [
        { label: "Attack", value: `+${b.fightGame.attackBonus}`, isPositive: b.fightGame.attackBonus > 0 },
        { label: "Defense", value: `+${b.fightGame.defenseBonus}`, isPositive: b.fightGame.defenseBonus > 0 },
        { label: "HP", value: `+${b.fightGame.hpBonus}`, isPositive: b.fightGame.hpBonus > 0 },
        { label: "Speed", value: `+${b.fightGame.speedBonus}`, isPositive: b.fightGame.speedBonus > 0 },
        { label: "Crit Chance", value: `+${Math.round(b.fightGame.critChanceBonus * 100)}%`, isPositive: b.fightGame.critChanceBonus > 0 },
        { label: "Counter", value: `+${b.fightGame.counterBonus}%`, isPositive: b.fightGame.counterBonus > 0 },
        { label: "XP Bonus", value: `+${Math.round((b.fightGame.xpMultiplier - 1) * 100)}%`, isPositive: b.fightGame.xpMultiplier > 1 },
        { label: "Dream Bonus", value: `+${Math.round((b.fightGame.dreamMultiplier - 1) * 100)}%`, isPositive: b.fightGame.dreamMultiplier > 1 },
      ],
      breakdown: b.fightGame.breakdown,
    },
    {
      id: "chess",
      label: "CHESS",
      icon: Gamepad2,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/20",
      borderColor: "border-cyan-500/20",
      bonuses: [
        { label: "Time Bonus", value: `+${b.chess.timeBonus}s`, isPositive: b.chess.timeBonus > 0 },
        { label: "Reward Bonus", value: `+${Math.round((b.chess.rewardMultiplier - 1) * 100)}%`, isPositive: b.chess.rewardMultiplier > 1 },
        { label: "Opening Style", value: b.chess.openingAffinity, isPositive: true },
        { label: "XP Bonus", value: `+${Math.round((b.chess.xpMultiplier - 1) * 100)}%`, isPositive: b.chess.xpMultiplier > 1 },
        { label: "Dream Bonus", value: `+${Math.round((b.chess.dreamMultiplier - 1) * 100)}%`, isPositive: b.chess.dreamMultiplier > 1 },
      ],
      breakdown: b.chess.breakdown,
    },
    {
      id: "tradeEmpire",
      label: "TRADE EMPIRE",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/20",
      borderColor: "border-emerald-500/20",
      bonuses: [
        { label: "Combat Power", value: `+${b.tradeEmpire.combatPowerBonus}`, isPositive: b.tradeEmpire.combatPowerBonus > 0 },
        { label: "Shield", value: `${Math.round(b.tradeEmpire.shieldDamageReduction * 100)}% DR`, isPositive: b.tradeEmpire.shieldDamageReduction > 0 },
        { label: "Trade Discount", value: `${Math.round(b.tradeEmpire.tradePriceDiscount * 100)}%`, isPositive: b.tradeEmpire.tradePriceDiscount > 0 },
        { label: "Trade Credits", value: `+${b.tradeEmpire.tradeCreditsBonus}`, isPositive: b.tradeEmpire.tradeCreditsBonus > 0 },
        { label: "Hazard Resist", value: `${Math.round(b.tradeEmpire.hazardResistance * 100)}%`, isPositive: b.tradeEmpire.hazardResistance > 0 },
        { label: "Bonus Turns", value: `+${b.tradeEmpire.bonusTurns}`, isPositive: b.tradeEmpire.bonusTurns > 0 },
        { label: "Scan Range", value: `+${b.tradeEmpire.scanRangeBonus}`, isPositive: b.tradeEmpire.scanRangeBonus > 0 },
        { label: "Colony Income", value: `+${Math.round((b.tradeEmpire.colonyIncomeMultiplier - 1) * 100)}%`, isPositive: b.tradeEmpire.colonyIncomeMultiplier > 1 },
      ],
      breakdown: b.tradeEmpire.breakdown,
    },
    {
      id: "crafting",
      label: "CRAFTING",
      icon: Pickaxe,
      color: "text-orange-400",
      bgColor: "bg-orange-950/20",
      borderColor: "border-orange-500/20",
      bonuses: [
        { label: "Success Rate", value: `+${Math.round(b.crafting.successRateBonus * 100)}%`, isPositive: b.crafting.successRateBonus > 0 },
        { label: "Dream Cost", value: `-${Math.round(b.crafting.dreamCostReduction * 100)}%`, isPositive: b.crafting.dreamCostReduction > 0 },
        { label: "Material Save", value: `${Math.round(b.crafting.materialPreserveChance * 100)}%`, isPositive: b.crafting.materialPreserveChance > 0 },
        { label: "Bonus Output", value: `${Math.round(b.crafting.bonusOutputChance * 100)}%`, isPositive: b.crafting.bonusOutputChance > 0 },
      ],
      breakdown: b.crafting.breakdown,
    },
    {
      id: "exploration",
      label: "EXPLORATION",
      icon: Compass,
      color: "text-purple-400",
      bgColor: "bg-purple-950/20",
      borderColor: "border-purple-500/20",
      bonuses: [
        { label: "Discovery XP", value: `+${b.exploration.discoveryXpBonus}`, isPositive: b.exploration.discoveryXpBonus > 0 },
        { label: "Hidden Items", value: `${Math.round(b.exploration.hiddenItemChance * 100)}%`, isPositive: b.exploration.hiddenItemChance > 0 },
        { label: "Puzzle Hints", value: `+${b.exploration.extraPuzzleHints}`, isPositive: b.exploration.extraPuzzleHints > 0 },
        { label: "Egg Detection", value: `+${b.exploration.easterEggBonus}`, isPositive: b.exploration.easterEggBonus > 0 },
        { label: "Dream Bonus", value: `+${Math.round((b.exploration.dreamBonus - 1) * 100)}%`, isPositive: b.exploration.dreamBonus > 1 },
        { label: "Rarity Upgrade", value: `${Math.round(b.exploration.rarityUpgradeChance * 100)}%`, isPositive: b.exploration.rarityUpgradeChance > 0 },
      ],
      breakdown: b.exploration.breakdown,
    },
    {
      id: "guildWar",
      label: "GUILD WARS",
      icon: Map,
      color: "text-rose-400",
      bgColor: "bg-rose-950/20",
      borderColor: "border-rose-500/20",
      bonuses: [
        { label: "War Points", value: `+${Math.round((b.guildWar.warPointMultiplier - 1) * 100)}%`, isPositive: b.guildWar.warPointMultiplier > 1 },
        { label: "Capture Speed", value: `+${Math.round((b.guildWar.captureSpeedMultiplier - 1) * 100)}%`, isPositive: b.guildWar.captureSpeedMultiplier > 1 },
        { label: "Sabotage", value: `+${Math.round((b.guildWar.sabotageMultiplier - 1) * 100)}%`, isPositive: b.guildWar.sabotageMultiplier > 1 },
        { label: "Reinforce", value: `+${Math.round((b.guildWar.reinforceMultiplier - 1) * 100)}%`, isPositive: b.guildWar.reinforceMultiplier > 1 },
        ...(b.guildWar.boostedTerritories.length > 0 ? [{
          label: "Element Bonus",
          value: `+${Math.round(b.guildWar.elementTerritoryBonus * 100)}% in ${b.guildWar.boostedTerritories.length} territories`,
          isPositive: true,
        }] : []),
      ],
      breakdown: b.guildWar.breakdown,
    },
    {
      id: "quest",
      label: "QUESTS & BATTLE PASS",
      icon: ScrollText,
      color: "text-teal-400",
      bgColor: "bg-teal-950/20",
      borderColor: "border-teal-500/20",
      bonuses: [
        { label: "Quest Rewards", value: `+${Math.round((b.quest.rewardMultiplier - 1) * 100)}%`, isPositive: b.quest.rewardMultiplier > 1 },
        { label: "Battle Pass XP", value: `+${Math.round((b.quest.battlePassXpMultiplier - 1) * 100)}%`, isPositive: b.quest.battlePassXpMultiplier > 1 },
        { label: "Completion XP", value: `+${b.quest.completionXpBonus}`, isPositive: b.quest.completionXpBonus > 0 },
        { label: "Bonus Chance", value: `${Math.round(b.quest.bonusRewardChance * 100)}%`, isPositive: b.quest.bonusRewardChance > 0 },
        ...(b.quest.dailyQuestSlots > 0 ? [{
          label: "Extra Quest Slots",
          value: `+${b.quest.dailyQuestSlots}`,
          isPositive: true,
        }] : []),
      ],
      breakdown: b.quest.breakdown,
    },
    {
      id: "market",
      label: "MARKETPLACE",
      icon: ShoppingCart,
      color: "text-indigo-400",
      bgColor: "bg-indigo-950/20",
      borderColor: "border-indigo-500/20",
      bonuses: [
        { label: "Tax Reduction", value: `${Math.round((1 - b.market.taxReduction) * 100)}% off`, isPositive: b.market.taxReduction < 1 },
        { label: "Listing Slots", value: `+${b.market.listingSlots}`, isPositive: b.market.listingSlots > 0 },
        { label: "Market Intel", value: b.market.marketIntel ? "Active" : "None", isPositive: b.market.marketIntel },
        { label: "Buy Discount", value: `${Math.round(b.market.buyDiscount * 100)}%`, isPositive: b.market.buyDiscount > 0 },
        { label: "Sell Bonus", value: `+${Math.round((b.market.sellBonus - 1) * 100)}%`, isPositive: b.market.sellBonus > 1 },
      ],
      breakdown: b.market.breakdown,
    },
  ];

  // Filter to only show categories with at least one positive bonus
  const activeCategories = categories.filter(cat =>
    cat.bonuses.some(b => b.isPositive)
  );

  if (activeCategories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/30 to-transparent p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-primary" />
        <h3 className="font-display text-xs font-bold tracking-[0.2em]">CHARACTER BONUSES</h3>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground tracking-wider">
          {activeCategories.length} SYSTEMS ENHANCED
        </span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground mb-4 leading-relaxed">
        Your species, class, element, and attributes provide unique bonuses across all game systems.
        {b.nftMultiplier > 1 && (
          <span className="text-accent"> NFT Potential amplifies all bonuses by {Math.round((b.nftMultiplier - 1) * 100)}%.</span>
        )}
      </p>

      <div className="space-y-2">
        {activeCategories.map((cat) => {
          const isExpanded = expandedCategory === cat.id;
          const Icon = cat.icon;
          const positiveBonuses = cat.bonuses.filter(b => b.isPositive);

          return (
            <div key={cat.id} className={`rounded-lg border ${cat.borderColor} ${cat.bgColor} overflow-hidden`}>
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
              >
                <Icon size={14} className={cat.color} />
                <span className="font-display text-[10px] font-bold tracking-[0.15em] text-foreground">
                  {cat.label}
                </span>
                <div className="flex-1 flex items-center gap-1.5 justify-end mr-2 overflow-hidden">
                  {positiveBonuses.slice(0, 3).map((b, i) => (
                    <span key={i} className={`font-mono text-[9px] ${cat.color} whitespace-nowrap`}>
                      {b.value}
                    </span>
                  ))}
                  {positiveBonuses.length > 3 && (
                    <span className="font-mono text-[9px] text-muted-foreground">
                      +{positiveBonuses.length - 3}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp size={12} className="text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown size={12} className="text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 border-t border-white/5">
                      {/* Bonus Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {cat.bonuses.map((bonus, i) => (
                          <div
                            key={i}
                            className={`px-2 py-1.5 rounded-md ${
                              bonus.isPositive ? "bg-white/5" : "bg-zinc-900/30"
                            }`}
                          >
                            <p className="font-mono text-[8px] text-muted-foreground tracking-wider">
                              {bonus.label}
                            </p>
                            <p className={`font-display text-sm font-bold ${
                              bonus.isPositive ? cat.color : "text-muted-foreground/50"
                            }`}>
                              {bonus.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Source Breakdown */}
                      {cat.breakdown.length > 0 && (
                        <div className="space-y-1">
                          <p className="font-mono text-[8px] text-muted-foreground/60 tracking-wider mb-1">
                            BONUS SOURCES
                          </p>
                          {cat.breakdown.map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-[9px]">
                              <span className="font-mono text-muted-foreground/70 whitespace-nowrap min-w-[100px]">
                                {item.source}
                              </span>
                              <span className={`font-mono ${cat.color}`}>
                                {item.effect}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
