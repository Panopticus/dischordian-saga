/* ═══════════════════════════════════════════════════════
   CIVIL SKILLS PANEL
   Non-combat skill proficiencies leveled by use
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, TrendingUp, Zap } from "lucide-react";

const SKILL_ICONS: Record<string, string> = {
  bartering: "💰",
  lore_mastery: "📚",
  diplomacy: "🤝",
  engineering: "⚙️",
  espionage: "🕵️",
  alchemy: "🧪",
};

export function CivilSkillsPanel() {
  const { data, isLoading } = trpc.rpg.getCivilSkills.useQuery();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen size={16} />
          <span className="font-mono text-xs tracking-wider">CIVIL SKILLS // UNAVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} className="text-teal-400" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">CIVIL SKILLS</span>
        <span className="font-mono text-[10px] text-muted-foreground ml-2">
          Non-combat proficiencies
        </span>
      </div>

      <div className="space-y-2">
        {data.map((skill, i) => {
          const icon = SKILL_ICONS[skill.key] || "📋";
          const isExpanded = expandedSkill === skill.key;

          return (
            <motion.div
              key={skill.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border/20 bg-card/20 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedSkill(isExpanded ? null : skill.key)}
                className="w-full p-3 flex items-center gap-3 hover:bg-card/40 transition-colors"
              >
                <span className="text-lg">{icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold">{skill.name}</span>
                    <span className="font-mono text-[9px] text-teal-400">Lv.{skill.level}</span>
                    {skill.maxLevel && (
                      <span className="font-mono text-[8px] text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded">MAX</span>
                    )}
                  </div>
                  {/* XP Progress bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500/60 rounded-full transition-all duration-500"
                        style={{ width: `${skill.xpProgress * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[8px] text-muted-foreground">
                      {skill.xp}/{skill.xpNext} XP
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-3 border-t border-border/10"
                >
                  <p className="font-mono text-[10px] text-muted-foreground mt-2 mb-2">{skill.description}</p>

                  {/* Active bonuses */}
                  {skill.activeBonuses.length > 0 && (
                    <div className="mb-2">
                      <span className="font-mono text-[9px] text-teal-400 mb-1 block">Active Bonuses:</span>
                      <div className="space-y-1">
                        {skill.activeBonuses.map((bonus, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <Zap size={8} className="text-teal-400" />
                            <span className="font-mono text-[9px] text-foreground/80">{bonus.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next bonus */}
                  {skill.nextBonus && (
                    <div className="border-t border-border/10 pt-2">
                      <span className="font-mono text-[9px] text-muted-foreground mb-1 block">
                        <TrendingUp size={8} className="inline mr-1" />
                        Next at Lv.{skill.nextBonus.level}:
                      </span>
                      <span className="font-mono text-[9px] text-foreground/60">{skill.nextBonus.label}</span>
                    </div>
                  )}

                  {/* Leveled by */}
                  <div className="border-t border-border/10 pt-2 mt-2">
                    <span className="font-mono text-[9px] text-muted-foreground mb-1 block">Leveled by:</span>
                    <div className="flex flex-wrap gap-1">
                      {skill.leveledBy.map(action => (
                        <span key={action.action} className="font-mono text-[8px] bg-zinc-800/50 px-1.5 py-0.5 rounded text-muted-foreground">
                          {action.label} (+{action.xpPerAction} XP)
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
