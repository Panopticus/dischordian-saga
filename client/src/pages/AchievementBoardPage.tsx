/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT BOARD — The Display Case of Every Decision

   A military officer's display case crossed with a trophy
   room crossed with a scrapbook of memories. Every pin,
   medal, and marker represents a moment the Ark witnessed.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Trophy, Star, Award, Shield, Swords,
  BookOpen, Users, Package, Eye, Skull, Lock, Sparkles,
  Crown, Heart, Compass, ScrollText, Gem, Flame,
  CircleDot, ChevronRight, X, MapPin, Medal
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import LivingBackground from "@/components/LivingBackground";
import {
  type Achievement,
  type AchievementSection,
  type PinType,
  type DisplayCaseTheme,
  ALL_ACHIEVEMENTS,
  PIN_DESIGNS,
  DISPLAY_CASE_THEMES,
  SECTION_META,
  getAchievementsBySection,
  getCompletedCount,
  getTotalCount,
} from "@/data/achievementBoard";

/* ─── SECTION ICONS ─── */
const SECTION_ICONS: Record<AchievementSection, typeof Trophy> = {
  first_steps: Compass,
  explorer: MapPin,
  scholar: BookOpen,
  warrior: Swords,
  diplomat: Users,
  keeper: Heart,
  merchant: Package,
  architects_shadow: Eye,
  corruption_chronicle: Skull,
  the_witness: ScrollText,
  the_collector: Gem,
  classified: Lock,
  session_memories: CircleDot,
};

/* ─── PIN GLOW COLORS ─── */
const PIN_GLOW: Record<PinType, string> = {
  bronze_pin: "shadow-[0_0_8px_rgba(205,127,50,0.4)]",
  silver_pin: "shadow-[0_0_10px_rgba(192,192,192,0.4)]",
  gold_pin: "shadow-[0_0_12px_rgba(255,215,0,0.5)]",
  crystallan_pin: "shadow-[0_0_15px_rgba(0,255,200,0.5)]",
  void_medal: "shadow-[0_0_20px_rgba(139,92,246,0.6)]",
  architects_seal: "shadow-[0_0_25px_rgba(255,50,50,0.6)]",
  decision_marker: "shadow-[0_0_10px_rgba(59,130,246,0.4)]",
  corruption_mark: "shadow-[0_0_12px_rgba(220,38,38,0.5)]",
  purity_star: "shadow-[0_0_12px_rgba(250,204,21,0.5)]",
  dischordian_token: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
};

const PIN_BORDER: Record<PinType, string> = {
  bronze_pin: "border-amber-700/60",
  silver_pin: "border-zinc-400/60",
  gold_pin: "border-yellow-400/60",
  crystallan_pin: "border-teal-400/60",
  void_medal: "border-violet-500/60",
  architects_seal: "border-red-500/60",
  decision_marker: "border-blue-500/60",
  corruption_mark: "border-red-600/60",
  purity_star: "border-yellow-300/60",
  dischordian_token: "border-purple-500/60",
};

const PIN_BG: Record<PinType, string> = {
  bronze_pin: "bg-amber-900/20",
  silver_pin: "bg-zinc-600/20",
  gold_pin: "bg-yellow-900/20",
  crystallan_pin: "bg-teal-900/20",
  void_medal: "bg-violet-900/30",
  architects_seal: "bg-red-900/30",
  decision_marker: "bg-blue-900/20",
  corruption_mark: "bg-red-900/30",
  purity_star: "bg-yellow-900/20",
  dischordian_token: "bg-purple-900/30",
};

const PIN_TEXT: Record<PinType, string> = {
  bronze_pin: "text-amber-600",
  silver_pin: "text-zinc-300",
  gold_pin: "text-yellow-400",
  crystallan_pin: "text-teal-300",
  void_medal: "text-violet-400",
  architects_seal: "text-red-400",
  decision_marker: "text-blue-400",
  corruption_mark: "text-red-500",
  purity_star: "text-yellow-300",
  dischordian_token: "text-purple-400",
};

/* ─── ACHIEVEMENT PIN COMPONENT ─── */
function AchievementPin({ achievement, earned, onClick }: {
  achievement: Achievement;
  earned: boolean;
  onClick: () => void;
}) {
  const pin = PIN_DESIGNS[achievement.pin];
  const IconComp = SECTION_ICONS[achievement.section] || Award;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center gap-1.5 p-3 rounded-lg border
        transition-all duration-300 cursor-pointer group min-w-[80px]
        ${earned
          ? `${PIN_BG[achievement.pin]} ${PIN_BORDER[achievement.pin]} ${PIN_GLOW[achievement.pin]}`
          : "bg-zinc-900/30 border-zinc-800/40 opacity-50"
        }
      `}
    >
      {/* Pin icon */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${earned
          ? `${PIN_BG[achievement.pin]} border ${PIN_BORDER[achievement.pin]}`
          : "bg-zinc-800/50 border border-zinc-700/30"
        }
      `}>
        {earned ? (
          <IconComp size={18} className={PIN_TEXT[achievement.pin]} />
        ) : (
          <Lock size={14} className="text-zinc-600" />
        )}
      </div>

      {/* Title */}
      <span className={`
        text-[9px] font-mono tracking-wider text-center leading-tight max-w-[80px]
        ${earned ? "text-foreground/80" : "text-zinc-600"}
      `}>
        {earned || !achievement.secret ? achievement.title : "???"}
      </span>

      {/* Rarity dot */}
      {earned && (
        <div className={`
          absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full
          ${PIN_BG[achievement.pin]} border ${PIN_BORDER[achievement.pin]}
        `} />
      )}
    </motion.button>
  );
}

/* ─── ACHIEVEMENT DETAIL MODAL ─── */
function AchievementDetailModal({ achievement, earned, onClose }: {
  achievement: Achievement;
  earned: boolean;
  onClose: () => void;
}) {
  const pin = PIN_DESIGNS[achievement.pin];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          relative max-w-md w-full rounded-xl border p-6 space-y-4
          ${earned
            ? `${PIN_BG[achievement.pin]} ${PIN_BORDER[achievement.pin]} ${PIN_GLOW[achievement.pin]}`
            : "bg-zinc-900/90 border-zinc-800/60"
          }
        `}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`
            w-14 h-14 rounded-xl flex items-center justify-center shrink-0
            ${earned
              ? `${PIN_BG[achievement.pin]} border-2 ${PIN_BORDER[achievement.pin]}`
              : "bg-zinc-800/60 border-2 border-zinc-700/30"
            }
          `}>
            {earned ? (
              <Medal size={24} className={PIN_TEXT[achievement.pin]} />
            ) : (
              <Lock size={20} className="text-zinc-600" />
            )}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {earned || !achievement.secret ? achievement.title : "CLASSIFIED"}
            </h2>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              {pin.name.toUpperCase()} // {achievement.xpReward} XP
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/70 leading-relaxed">
          {earned || !achievement.secret
            ? achievement.description
            : "This achievement has not yet been revealed. Continue exploring the Ark..."
          }
        </p>

        {/* Unlock text */}
        {earned && (
          <div className={`
            p-3 rounded-lg border text-xs italic leading-relaxed
            ${PIN_BG[achievement.pin]} ${PIN_BORDER[achievement.pin]}
          `}>
            <span className={`${PIN_TEXT[achievement.pin]} font-semibold`}>
              MEMORY RECORDED:
            </span>{" "}
            <span className="text-foreground/60">{achievement.unlockText}</span>
          </div>
        )}

        {/* Trigger hint */}
        {!earned && !achievement.secret && (
          <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30 text-xs text-muted-foreground">
            <span className="text-zinc-500 font-semibold">HOW TO UNLOCK:</span>{" "}
            {achievement.trigger}
          </div>
        )}

        {/* Reward */}
        {achievement.reward && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-amber-400" />
            <span>Reward: {achievement.reward}</span>
          </div>
        )}

        {/* Decision alternatives */}
        {achievement.alternatives && achievement.alternatives.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-zinc-500 tracking-wider">
              OTHER PATHS NOT TAKEN:
            </p>
            {achievement.alternatives.map((alt, i) => (
              <p key={i} className="text-xs text-zinc-600 italic pl-3 border-l border-zinc-800">
                {alt}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── SECTION DISPLAY CASE ─── */
function SectionDisplayCase({ section, achievements, earnedIds }: {
  section: AchievementSection;
  achievements: Achievement[];
  earnedIds: Set<string>;
}) {
  const [selected, setSelected] = useState<Achievement | null>(null);
  const Icon = SECTION_ICONS[section];
  const meta = SECTION_META[section];
  const earned = achievements.filter(a => earnedIds.has(a.id)).length;
  const total = achievements.length;
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-cyan-400" />
          <h3 className="font-display text-sm font-bold tracking-wider text-foreground">
            {meta.name.toUpperCase()}
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            {earned}/{total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Pins grid */}
      <div className="flex flex-wrap gap-2">
        {achievements.map((ach) => (
          <AchievementPin
            key={ach.id}
            achievement={ach}
            earned={earnedIds.has(ach.id)}
            onClick={() => setSelected(ach)}
          />
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <AchievementDetailModal
            achievement={selected}
            earned={earnedIds.has(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AchievementBoardPage() {
  const { state: gameState } = useGame();
  const [activeTheme, setActiveTheme] = useState<DisplayCaseTheme>("ark_hull");
  const [showThemes, setShowThemes] = useState(false);
  const [filterSection, setFilterSection] = useState<AchievementSection | "all">("all");

  // Earned achievements from game state
  const earnedIds = useMemo(() => {
    const set = new Set<string>();
    const earned = (gameState as any)?.earnedAchievements ?? [];
    for (const id of earned) set.add(id);
    return set;
  }, [gameState]);

  // Theme config
  const theme = DISPLAY_CASE_THEMES.find(t => t.id === activeTheme) ?? DISPLAY_CASE_THEMES[0];

  // Filtered sections
  const sections = useMemo(() => {
    const sectionOrder: AchievementSection[] = [
      "first_steps", "explorer", "scholar", "warrior", "diplomat",
      "keeper", "merchant", "architects_shadow", "corruption_chronicle",
      "the_witness", "the_collector", "classified", "session_memories",
    ];
    if (filterSection !== "all") return [filterSection];
    return sectionOrder;
  }, [filterSection]);

  const totalEarned = getCompletedCount(earnedIds);
  const totalAch = getTotalCount();
  const overallPct = totalAch > 0 ? Math.round((totalEarned / totalAch) * 100) : 0;

  return (
    <div className={`min-h-screen ${theme.background} transition-colors duration-700 relative overflow-hidden`}>
      <LivingBackground
        src="/art/rooms/room-trophy-room.png"
        accent="#8b5cf6"
        opacity={0.1}
        particleCount={8}
        scanlines={false}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/20 bg-muted/50 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft size={18} />
                </Link>
                <div>
                  <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                    <Award size={18} className="text-violet-400" />
                    ACHIEVEMENT BOARD
                  </h1>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                    {theme.name.toUpperCase()} // {totalEarned}/{totalAch} MEMORIES RECORDED ({overallPct}%)
                  </p>
                </div>
              </div>

              {/* Theme selector toggle */}
              <button
                onClick={() => setShowThemes(!showThemes)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/20
                  text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Gem size={12} />
                DISPLAY
              </button>
            </div>

            {/* Overall progress */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 bg-zinc-800/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{overallPct}%</span>
            </div>
          </div>
        </div>

        {/* Theme selector dropdown */}
        <AnimatePresence>
          {showThemes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/20 bg-muted/30 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2">
                {DISPLAY_CASE_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTheme(t.id); setShowThemes(false); }}
                    disabled={!t.unlocked}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-mono tracking-wider
                      border transition-all duration-200
                      ${activeTheme === t.id
                        ? `${t.accent} ${t.glow} text-foreground`
                        : t.unlocked
                          ? "border-zinc-700/30 text-muted-foreground hover:text-foreground hover:border-zinc-600/40"
                          : "border-zinc-800/20 text-zinc-700 cursor-not-allowed"
                      }
                    `}
                  >
                    {t.unlocked ? t.name : (
                      <span className="flex items-center gap-1">
                        <Lock size={10} /> {t.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section filter tabs */}
        <div className="border-b border-border/10 bg-muted/20 backdrop-blur-sm overflow-x-auto">
          <div className="px-4 sm:px-6 py-2 flex gap-1 min-w-max">
            <button
              onClick={() => setFilterSection("all")}
              className={`
                px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-colors
                ${filterSection === "all"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              ALL
            </button>
            {Object.entries(SECTION_META).map(([key, meta]) => {
              const Icon = SECTION_ICONS[key as AchievementSection];
              return (
                <button
                  key={key}
                  onClick={() => setFilterSection(key as AchievementSection)}
                  className={`
                    px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-colors
                    flex items-center gap-1
                    ${filterSection === key
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon size={10} />
                  {meta.shortName?.toUpperCase() ?? meta.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Case Content */}
        <div className="px-4 sm:px-6 py-6 space-y-8 max-w-5xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Pins", value: totalEarned, icon: Medal, color: "text-amber-400" },
              { label: "Decisions", value: getAchievementsBySection("session_memories").filter(a => earnedIds.has(a.id)).length, icon: CircleDot, color: "text-blue-400" },
              { label: "Secrets", value: getAchievementsBySection("classified").filter(a => earnedIds.has(a.id)).length, icon: Lock, color: "text-red-400" },
              { label: "Completion", value: `${overallPct}%`, icon: Trophy, color: "text-violet-400" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-muted/20 border border-border/10 flex items-center gap-3"
              >
                <stat.icon size={16} className={stat.color} />
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[9px] font-mono text-muted-foreground tracking-wider">{stat.label.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section display cases */}
          {sections.map((section) => {
            const achievements = getAchievementsBySection(section);
            if (achievements.length === 0) return null;
            return (
              <SectionDisplayCase
                key={section}
                section={section}
                achievements={achievements}
                earnedIds={earnedIds}
              />
            );
          })}

          {/* Empty state */}
          {totalEarned === 0 && (
            <div className="text-center py-16 space-y-3">
              <Award size={48} className="mx-auto text-zinc-700" />
              <p className="text-muted-foreground font-mono text-sm">
                Your display case is empty. The Ark is watching.
              </p>
              <p className="text-zinc-600 text-xs">
                Every decision you make will be remembered here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
