/* ═══════════════════════════════════════════════════════
   TALENT SELECTION MODAL
   Full-screen modal for choosing citizen talents at
   milestone levels. Shows impact preview for each talent
   on base building, tower defense, trading, etc.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  X, Star, Flame, Shield, Swords, Zap, ChevronRight,
  Lock, Check, AlertTriangle, Sparkles, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TIER_LABELS = ["Initiate", "Adept", "Master", "Grandmaster"];
const TIER_COLORS = [
  { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]" },
  { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", glow: "shadow-[0_0_20px_rgba(96,165,250,0.15)]" },
  { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-[0_0_20px_rgba(192,132,252,0.15)]" },
  { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]" },
];

/** Impact descriptions for talents on game systems */
const TALENT_IMPACTS: Record<string, { system: string; effect: string; icon: string }[]> = {
  // Tier 1 (Level 5)
  iron_will: [
    { system: "Tower Defense", effect: "+10% tower HP", icon: "🛡️" },
    { system: "Raiding", effect: "Units take 10% less damage", icon: "⚔️" },
  ],
  quick_study: [
    { system: "Civil Skills", effect: "+15% XP gain", icon: "📚" },
    { system: "Prestige Quests", effect: "Faster quest completion", icon: "👑" },
  ],
  silver_tongue: [
    { system: "Trading", effect: "+10% trade profits", icon: "💰" },
    { system: "Syndicate World", effect: "Cheaper diplomacy buildings", icon: "🏛️" },
  ],
  shadow_step: [
    { system: "Raiding", effect: "+15% raid stealth", icon: "🌑" },
    { system: "Space Station", effect: "Stealth module bonus", icon: "🛸" },
  ],
  elemental_attunement: [
    { system: "Tower Defense", effect: "+20% elemental tower damage", icon: "🔥" },
    { system: "Crafting", effect: "Better elemental transmutation", icon: "⚗️" },
  ],
  // Tier 2 (Level 10)
  fortification_expert: [
    { system: "Space Station", effect: "+20% station defense", icon: "🛸" },
    { system: "Tower Defense", effect: "+1 tower slot", icon: "🏗️" },
    { system: "Syndicate World", effect: "Defense buildings cost 15% less", icon: "🏰" },
  ],
  resource_magnate: [
    { system: "Space Station", effect: "+20% resource production", icon: "⛏️" },
    { system: "Syndicate World", effect: "+20% capital production", icon: "🏭" },
  ],
  tactical_genius: [
    { system: "Raiding", effect: "+2 extra raid units", icon: "⚔️" },
    { system: "Tower Defense", effect: "Towers fire 10% faster", icon: "🎯" },
  ],
  lore_keeper: [
    { system: "Prestige Quests", effect: "Skip lore-check steps", icon: "📜" },
    { system: "Discovery", effect: "+25% discovery XP", icon: "🔍" },
  ],
  // Tier 3 (Level 15)
  master_builder: [
    { system: "Space Station", effect: "+30% build speed", icon: "🔨" },
    { system: "Syndicate World", effect: "+30% build speed", icon: "🏗️" },
    { system: "Tower Defense", effect: "Towers upgrade 30% faster", icon: "⬆️" },
  ],
  war_commander: [
    { system: "Raiding", effect: "+25% unit damage", icon: "⚔️" },
    { system: "Guild Wars", effect: "+15% war contribution", icon: "🏴" },
  ],
  void_walker: [
    { system: "Space Station", effect: "Unlock void modules", icon: "🌀" },
    { system: "Tower Defense", effect: "Void tower available", icon: "🕳️" },
  ],
  // Tier 4 (Level 20)
  ascendant: [
    { system: "All Systems", effect: "+10% to all bonuses", icon: "✨" },
    { system: "Prestige", effect: "Faster prestige rank gain", icon: "👑" },
  ],
  architect_supreme: [
    { system: "Space Station", effect: "+3 module slots", icon: "🛸" },
    { system: "Syndicate World", effect: "+3 building slots", icon: "🏰" },
    { system: "Tower Defense", effect: "+3 tower slots", icon: "🏗️" },
  ],
  raid_lord: [
    { system: "Raiding", effect: "+40% loot multiplier", icon: "💎" },
    { system: "Tower Defense", effect: "+30% tower damage", icon: "🎯" },
  ],
};

interface TalentSelectionModalProps {
  open: boolean;
  onClose: () => void;
  milestoneLevel: number;
}

export function TalentSelectionModal({ open, onClose, milestoneLevel }: TalentSelectionModalProps) {
  const { data, refetch } = trpc.rpg.getTalentStatus.useQuery();
  const selectTalent = trpc.rpg.selectTalent.useMutation({
    onSuccess: (result) => {
      refetch();
      toast.success(`Talent Acquired — ${result.talentName} is now active!`);
      setConfirming(null);
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });
  const [selectedTalent, setSelectedTalent] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  if (!open || !data) return null;

  const milestone = data.milestones.find(m => m.level === milestoneLevel);
  if (!milestone || milestone.chosen) return null;

  const tierIndex = [5, 10, 15, 20].indexOf(milestoneLevel);
  const tier = TIER_COLORS[tierIndex] || TIER_COLORS[0];
  const tierLabel = TIER_LABELS[tierIndex] || "Unknown";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto border ${tier.border} rounded-xl bg-zinc-950/95 ${tier.glow}`}
        >
          {/* Header */}
          <div className={`p-5 border-b ${tier.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${tier.bg} border ${tier.border} flex items-center justify-center`}>
                  <Crown size={20} className={tier.text} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold tracking-wide">
                    SELECT <span className={tier.text}>{tierLabel.toUpperCase()}</span> TALENT
                  </h2>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Level {milestoneLevel} Milestone — Choose wisely, this is permanent
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Talent Options */}
          <div className="p-5 space-y-3">
            {milestone.availableTalents.map((talent, i) => {
              const isSelected = selectedTalent === talent.key;
              const isConfirming = confirming === talent.key;
              const impacts = TALENT_IMPACTS[talent.key] || [];

              return (
                <motion.div
                  key={talent.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                    isSelected
                      ? `${tier.border} ${tier.bg} ring-1 ring-primary/20`
                      : "border-border/30 bg-card/20 hover:border-border/50 hover:bg-card/30"
                  }`}
                  onClick={() => setSelectedTalent(isSelected ? null : talent.key)}
                >
                  {/* Talent Header */}
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{talent.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-display text-sm font-bold ${isSelected ? tier.text : ""}`}>
                            {talent.name}
                          </h3>
                          {talent.classRestriction && (
                            <span className="font-mono text-[8px] bg-amber-950/30 text-amber-400 px-1.5 py-0.5 rounded">
                              {talent.classRestriction} only
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          {talent.description}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Impact Preview */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 pb-4 border-t ${tier.border}`}>
                          {/* Impact on game systems */}
                          {impacts.length > 0 && (
                            <div className="mt-3">
                              <span className="font-mono text-[9px] text-muted-foreground block mb-2">
                                <Zap size={10} className="inline mr-1" />
                                MECHANICAL IMPACT:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {impacts.map((impact, j) => (
                                  <div
                                    key={j}
                                    className={`flex items-center gap-2 ${tier.bg} rounded-md px-2.5 py-1.5`}
                                  >
                                    <span className="text-sm">{impact.icon}</span>
                                    <div>
                                      <span className={`font-mono text-[8px] ${tier.text} block`}>
                                        {impact.system}
                                      </span>
                                      <span className="font-mono text-[9px] text-foreground/70">
                                        {impact.effect}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Confirm button */}
                          <div className="mt-4">
                            {isConfirming ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-amber-400">
                                  <AlertTriangle size={12} />
                                  <span className="font-mono text-[10px]">
                                    This choice is permanent and cannot be undone!
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm" variant="outline"
                                    className="text-[10px] h-7 px-3"
                                    onClick={(e) => { e.stopPropagation(); setConfirming(null); }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`text-[10px] h-7 px-4 ${tier.bg} border ${tier.border} ${tier.text} hover:opacity-80`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectTalent.mutate({ milestoneLevel, talentKey: talent.key });
                                    }}
                                    disabled={selectTalent.isPending}
                                  >
                                    {selectTalent.isPending ? (
                                      <span className="animate-pulse">Acquiring...</span>
                                    ) : (
                                      <>
                                        <Sparkles size={10} className="mr-1" />
                                        CONFIRM — Acquire {talent.name}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm" variant="outline"
                                className={`text-[10px] h-7 px-4 w-full ${tier.border} ${tier.text} hover:${tier.bg}`}
                                onClick={(e) => { e.stopPropagation(); setConfirming(talent.key); }}
                              >
                                Select This Talent <ChevronRight size={10} className="ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${tier.border} flex items-center justify-between`}>
            <span className="font-mono text-[9px] text-muted-foreground">
              <Star size={10} className="inline mr-1" />
              Talents permanently affect all game systems
            </span>
            <Button
              size="sm" variant="ghost"
              className="text-[10px] h-6 text-muted-foreground"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
