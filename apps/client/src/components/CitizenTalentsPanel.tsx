/* ═══════════════════════════════════════════════════════
   CITIZEN TALENTS PANEL
   Powerful passives chosen at milestone levels (5, 10, 15, 20)
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Star, Lock, Check, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TIER_COLORS = ["void-text-energy", "void-text-energy", "void-text-system", "void-text-accent"];
const TIER_BG = ["void-bg-success", "void-bg-sunk", "void-bg-system", "void-bg-sunk"];
const TIER_BORDER = ["void-border-success", "void-border", "void-border-system", "void-border"];

export function CitizenTalentsPanel() {
  const { data, isLoading, refetch } = trpc.rpg.getTalentStatus.useQuery();
  const selectTalent = trpc.rpg.selectTalent.useMutation({
    onSuccess: (result) => {
      refetch();
      toast.success(`Talent Acquired — ${result.talentName} is now active.`);
      setSelectingMilestone(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const [selectingMilestone, setSelectingMilestone] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Star size={16} />
          <span className="font-mono text-xs tracking-wider">CITIZEN TALENTS // LOCKED</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Create a citizen character to access talent selection.
        </p>
      </div>
    );
  }

  const { citizenLevel, milestones, nextMilestone, selectedTalents } = data;
  const allMilestoneLevels = [5, 10, 15, 20];

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={16} className="void-text-accent" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">CITIZEN TALENTS</span>
          <span className="font-mono text-[10px] text-muted-foreground ml-2">
            {selectedTalents.length}/{allMilestoneLevels.filter(l => citizenLevel >= l).length} selected
          </span>
        </div>
        {nextMilestone && (
          <span className="font-mono text-[9px] text-muted-foreground">
            Next: Lv.{nextMilestone}
          </span>
        )}
      </div>

      {/* Milestone timeline */}
      <div className="flex items-center gap-1 mb-4">
        {allMilestoneLevels.map((level, i) => {
          const milestone = milestones.find(m => m.level === level);
          const unlocked = citizenLevel >= level;
          const chosen = milestone?.chosen;
          return (
            <div key={level} className="flex items-center gap-1 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  chosen
                    ? `${TIER_BORDER[i]} ${TIER_BG[i]} ${TIER_COLORS[i]}`
                    : unlocked
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "void-border void-bg-canvas void-text"
                }`}
              >
                {chosen ? <Check size={14} /> : unlocked ? level : <Lock size={10} />}
              </div>
              {i < allMilestoneLevels.length - 1 && (
                <div className={`flex-1 h-0.5 ${unlocked ? "bg-primary/30" : "void-bg-canvas"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected talents */}
      {selectedTalents.length > 0 && (
        <div className="space-y-2 mb-3">
          {selectedTalents.map((sel, i) => {
            const talent = sel.talent;
            if (!talent) return null;
            const tierIdx = allMilestoneLevels.indexOf(sel.milestoneLevel);
            return (
              <motion.div
                key={sel.talentKey}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border ${TIER_BORDER[tierIdx]} ${TIER_BG[tierIdx]} rounded-lg p-3`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{talent.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-sm font-bold ${TIER_COLORS[tierIdx]}`}>
                        {talent.name}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">Lv.{sel.milestoneLevel}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">{talent.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Available milestone selections */}
      {milestones.filter(m => m.unlocked && !m.chosen).map((milestone, mIdx) => (
        <div key={milestone.level} className="mt-3">
          <button
            onClick={() => setSelectingMilestone(
              selectingMilestone === milestone.level ? null : milestone.level
            )}
            className="flex items-center gap-2 w-full font-mono text-[10px] text-primary hover:text-primary/80 transition-colors"
          >
            {selectingMilestone === milestone.level ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Select Level {milestone.level} Talent
          </button>
          <AnimatePresence>
            {selectingMilestone === milestone.level && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {milestone.availableTalents.map(talent => (
                    <button
                      key={talent.key}
                      onClick={() => selectTalent.mutate({
                        milestoneLevel: milestone.level,
                        talentKey: talent.key,
                      })}
                      disabled={selectTalent.isPending}
                      className="border border-border/30 bg-card/30 rounded-lg p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{talent.icon}</span>
                        <span className="font-display text-xs font-bold">{talent.name}</span>
                      </div>
                      <p className="font-mono text-[9px] text-muted-foreground">{talent.description}</p>
                      {talent.classRestriction && (
                        <span className="font-mono text-[8px] void-text-accent mt-1 block">
                          {talent.classRestriction} only
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
