/* ═══════════════════════════════════════════════════════
   CIVIL SKILLS DASHBOARD WIDGET
   Compact view for Ark dashboard showing skill levels
   and their mechanical impact on base building, defense,
   trading, and other game systems.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, ChevronRight, Zap, Shield, Hammer, Coins, Eye, FlaskConical } from "lucide-react";
import { Link } from "wouter";

const SKILL_ICONS: Record<string, React.ComponentType<any>> = {
  bartering: Coins,
  lore_mastery: BookOpen,
  diplomacy: Shield,
  engineering: Hammer,
  espionage: Eye,
  alchemy: FlaskConical,
};

const SKILL_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  bartering: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  lore_mastery: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  diplomacy: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  engineering: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  espionage: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  alchemy: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
};

/** Impact descriptions for each skill on various game systems */
const SKILL_IMPACTS: Record<string, { system: string; effect: string }[]> = {
  bartering: [
    { system: "Trading", effect: "Better trade ratios" },
    { system: "Space Station", effect: "Reduced module costs" },
    { system: "Syndicate World", effect: "Cheaper building upgrades" },
  ],
  lore_mastery: [
    { system: "Prestige Quests", effect: "Skip lore-check steps" },
    { system: "Tower Defense", effect: "Unlock elemental towers" },
    { system: "Discovery", effect: "Bonus XP from entries" },
  ],
  diplomacy: [
    { system: "Guild Wars", effect: "Longer truces" },
    { system: "Syndicate World", effect: "Alliance building speed" },
    { system: "Raiding", effect: "Better surrender terms" },
  ],
  engineering: [
    { system: "Space Station", effect: "Faster module builds" },
    { system: "Tower Defense", effect: "Tower HP bonus" },
    { system: "Syndicate World", effect: "Build speed multiplier" },
  ],
  espionage: [
    { system: "Raiding", effect: "Scout enemy defenses" },
    { system: "Tower Defense", effect: "Stealth tower unlock" },
    { system: "Guild Wars", effect: "Intel gathering bonus" },
  ],
  alchemy: [
    { system: "Crafting", effect: "Better transmutation rates" },
    { system: "Tower Defense", effect: "Elemental tower damage" },
    { system: "Space Station", effect: "Research speed bonus" },
  ],
};

export function CivilSkillsDashboardWidget() {
  const { data, isLoading } = trpc.rpg.getCivilSkills.useQuery();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded bg-muted animate-pulse" />
          <div className="w-24 h-3 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-14 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen size={14} />
          <span className="font-mono text-[10px] tracking-wider">CIVIL SKILLS // CREATE CHARACTER FIRST</span>
        </div>
      </div>
    );
  }

  const totalLevel = data.reduce((sum, s) => sum + s.level, 0);
  const maxPossible = data.length * 10;

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-teal-400" />
          <span className="font-display text-[10px] font-bold tracking-[0.2em]">CIVIL SKILLS</span>
          <span className="font-mono text-[8px] text-muted-foreground">
            {totalLevel}/{maxPossible}
          </span>
        </div>
        <Link
          href="/character-sheet"
          className="font-mono text-[8px] text-primary/60 hover:text-primary flex items-center gap-0.5 transition-colors"
        >
          DETAILS <ChevronRight size={8} />
        </Link>
      </div>

      {/* Skill Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {data.map((skill, i) => {
          const Icon = SKILL_ICONS[skill.key] || BookOpen;
          const colors = SKILL_COLORS[skill.key] || { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" };
          const impacts = SKILL_IMPACTS[skill.key] || [];
          const isHovered = hoveredSkill === skill.key;

          return (
            <motion.div
              key={skill.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => setHoveredSkill(skill.key)}
              onMouseLeave={() => setHoveredSkill(null)}
              className={`relative border ${colors.border} ${colors.bg} rounded-md p-2 cursor-default transition-all ${
                isHovered ? "ring-1 ring-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} className={colors.text} />
                <span className="font-mono text-[8px] font-bold truncate">{skill.name}</span>
              </div>

              {/* Level indicator */}
              <div className="flex items-center gap-1">
                <span className={`font-display text-sm font-black ${colors.text}`}>
                  {skill.level}
                </span>
                <div className="flex-1">
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors.bg.replace("/10", "/60")}`}
                      style={{ width: `${skill.xpProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Active bonus count */}
              {skill.activeBonuses.length > 0 && (
                <div className="flex items-center gap-0.5 mt-1">
                  <Zap size={7} className={colors.text} />
                  <span className="font-mono text-[7px] text-muted-foreground">
                    {skill.activeBonuses.length} active
                  </span>
                </div>
              )}

              {/* Hover tooltip showing impact */}
              {isHovered && impacts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 left-0 right-0 -bottom-1 translate-y-full bg-zinc-900/95 border border-border/40 rounded-md p-2 shadow-lg"
                >
                  <span className="font-mono text-[8px] text-muted-foreground block mb-1">
                    Impact at Lv.{skill.level}:
                  </span>
                  {impacts.map((impact, j) => (
                    <div key={j} className="flex items-center gap-1 mb-0.5">
                      <span className={`font-mono text-[7px] ${colors.text}`}>▸</span>
                      <span className="font-mono text-[7px] text-foreground/70">
                        <strong>{impact.system}:</strong> {impact.effect}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
