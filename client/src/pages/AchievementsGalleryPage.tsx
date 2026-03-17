/* ═══════════════════════════════════════════════════════
   ACHIEVEMENTS GALLERY — All 33 lore achievements with
   locked/unlocked states, progress bars per Age, and
   collected lore fragments forming a meta-narrative.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Lock, ChevronLeft, BookOpen, Scroll,
  Sparkles, Shield, Zap, CheckCircle2, ChevronRight,
  Eye, X, Gift, Award
} from "lucide-react";
import {
  LORE_ACHIEVEMENTS,
  getAchievementsByAge,
  getTotalXpFromAchievements,
  getCompletionPercentage,
  type LoreAchievement,
} from "@/data/loreAchievements";
import { AGE_CATEGORIES, CONEXUS_GAMES, type Age } from "@/data/conexusGames";
import { useGame } from "@/contexts/GameContext";

/* ─── TYPES ─── */
type FilterAge = "all" | Age;

/* ─── RARITY COLORS ─── */
const RARITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  common: { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30" },
  uncommon: { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  rare: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  epic: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  legendary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
};

/* ─── ACHIEVEMENT DETAIL MODAL ─── */
function AchievementModal({ achievement, earned, onClose }: {
  achievement: LoreAchievement;
  earned: boolean;
  onClose: () => void;
}) {
  const ageCat = AGE_CATEGORIES.find(c => c.age === achievement.age);
  const game = CONEXUS_GAMES.find(g => g.id === achievement.gameId);
  const cardRarity = achievement.cardReward
    ? RARITY_COLORS[achievement.cardReward.rarity] || RARITY_COLORS.common
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-xl border bg-card shadow-2xl overflow-hidden ${
          earned ? "border-amber-500/40" : "border-border/30"
        }`}
      >
        {/* Header */}
        <div className={`relative p-6 pb-4 ${earned ? "bg-gradient-to-br from-amber-500/10 to-amber-900/10" : "bg-gradient-to-br from-secondary/50 to-secondary/20"}`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${earned ? "bg-amber-500/20 border border-amber-500/30" : "bg-secondary/50 border border-border/30"}`}>
              {earned ? (
                <span className="text-3xl">{achievement.icon}</span>
              ) : (
                <Lock size={28} className="text-muted-foreground/30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {ageCat && (
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider border ${ageCat.color} ${ageCat.borderColor} ${ageCat.bgColor}`}>
                    {ageCat.age.toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className={`font-display text-lg font-bold tracking-wide ${earned ? "text-amber-200" : "text-muted-foreground/40"}`}>
                {earned ? achievement.title : "???"}
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
                {game?.title ?? "Unknown Story"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <p className={`text-sm leading-relaxed ${earned ? "text-foreground/80" : "text-muted-foreground/40"}`}>
            {earned ? achievement.description : "Complete the associated CoNexus story to unlock this achievement."}
          </p>

          {/* Lore Fragment */}
          {earned && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Scroll size={12} className="text-amber-400" />
                <span className="font-mono text-[10px] text-amber-400/70 tracking-wider">LORE FRAGMENT</span>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                "{achievement.loreFragment}"
              </p>
            </motion.div>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${earned ? "bg-amber-500/10 border border-amber-500/20" : "bg-secondary/30 border border-border/20"}`}>
              <Zap size={12} className={earned ? "text-amber-400" : "text-muted-foreground/30"} />
              <span className={`font-mono text-xs font-bold ${earned ? "text-amber-300" : "text-muted-foreground/30"}`}>
                +{achievement.xpReward} XP
              </span>
            </div>
            {achievement.cardReward && cardRarity && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${earned ? `${cardRarity.bg} ${cardRarity.border}` : "bg-secondary/30 border border-border/20"}`}>
                <Gift size={12} className={earned ? cardRarity.text.replace("text-", "text-") : "text-muted-foreground/30"} />
                <span className={`font-mono text-xs font-bold ${earned ? cardRarity.text : "text-muted-foreground/30"}`}>
                  {earned ? achievement.cardReward.name : "???"}
                </span>
                <span className={`font-mono text-[9px] ${earned ? cardRarity.text : "text-muted-foreground/20"}`}>
                  ({achievement.cardReward.rarity.toUpperCase()})
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          {!earned && game && (
            <Link
              href="/conexus-portal"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-wider hover:bg-purple-600/30 transition-all"
            >
              <BookOpen size={14} />
              GO TO STORY LIBRARY
              <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AchievementsGalleryPage() {
  const { state } = useGame();
  const [filterAge, setFilterAge] = useState<FilterAge>("all");
  const [selectedAchievement, setSelectedAchievement] = useState<LoreAchievement | null>(null);
  const [showLoreNarrative, setShowLoreNarrative] = useState(false);

  const earnedIds = state.loreAchievements;
  const totalXp = getTotalXpFromAchievements(earnedIds);
  const overallPercent = getCompletionPercentage(earnedIds);

  // Per-age stats
  const ageStats = useMemo(() => {
    return AGE_CATEGORIES.map(cat => {
      const ageAchievements = getAchievementsByAge(cat.age);
      const earned = ageAchievements.filter(a => earnedIds.includes(a.id)).length;
      return {
        age: cat.age,
        total: ageAchievements.length,
        earned,
        percent: ageAchievements.length > 0 ? Math.round((earned / ageAchievements.length) * 100) : 0,
        color: cat.color,
        borderColor: cat.borderColor,
        bgColor: cat.bgColor,
        iconGlyph: cat.iconGlyph,
        coverImage: cat.coverImage,
      };
    });
  }, [earnedIds]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    if (filterAge === "all") return LORE_ACHIEVEMENTS;
    return getAchievementsByAge(filterAge);
  }, [filterAge]);

  // Earned lore fragments in order (for meta-narrative)
  const earnedFragments = useMemo(() => {
    return LORE_ACHIEVEMENTS
      .filter(a => earnedIds.includes(a.id))
      .map(a => ({ title: a.title, icon: a.icon, fragment: a.loreFragment, age: a.age }));
  }, [earnedIds]);

  return (
    <div className="min-h-screen animate-fade-in pb-20">
      {/* ═══ HEADER ═══ */}
      <div className="border-b border-border/30 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/games" className="p-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-lg font-bold tracking-wider flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                LORE ACHIEVEMENTS
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                {earnedIds.length}/{LORE_ACHIEVEMENTS.length} UNLOCKED • {totalXp} XP EARNED
              </p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-amber-400/70 tracking-wider">SAGA COMPLETION</span>
              <span className="font-mono text-sm font-bold text-amber-300">{overallPercent}%</span>
            </div>
            <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-[9px] text-muted-foreground/50">
                {earnedIds.length} of {LORE_ACHIEVEMENTS.length} lore fragments collected
              </span>
              {earnedFragments.length > 0 && (
                <button
                  onClick={() => setShowLoreNarrative(true)}
                  className="flex items-center gap-1 font-mono text-[9px] text-amber-400/70 hover:text-amber-300 transition-colors"
                >
                  <Eye size={10} /> READ COLLECTED LORE
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ═══ AGE PROGRESS CARDS ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ageStats.map((ageStat, i) => (
            <motion.button
              key={ageStat.age}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => setFilterAge(filterAge === ageStat.age ? "all" : ageStat.age)}
              className={`text-left rounded-lg border p-3 transition-all ${
                filterAge === ageStat.age
                  ? `${ageStat.borderColor} ${ageStat.bgColor} ring-1 ${ageStat.borderColor}`
                  : "border-border/20 bg-card/30 hover:border-border/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{ageStat.iconGlyph}</span>
                <span className={`font-mono text-[9px] tracking-wider ${ageStat.color}`}>
                  {ageStat.age.toUpperCase().substring(0, 12)}
                </span>
              </div>
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden mb-1.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ageStat.color.includes("blue") ? "#3b82f6" :
                    ageStat.color.includes("amber") ? "#f59e0b" :
                    ageStat.color.includes("red") ? "#ef4444" :
                    ageStat.color.includes("green") ? "#22c55e" : "#a855f7" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${ageStat.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-muted-foreground/50">
                  {ageStat.earned}/{ageStat.total}
                </span>
                <span className="font-mono text-[9px] font-bold text-muted-foreground">
                  {ageStat.percent}%
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ═══ FILTER LABEL ═══ */}
        {filterAge !== "all" && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Showing:</span>
            <span className="font-mono text-xs text-foreground font-bold">{filterAge}</span>
            <button
              onClick={() => setFilterAge("all")}
              className="ml-1 p-0.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* ═══ ACHIEVEMENTS GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((ach, i) => {
              const earned = earnedIds.includes(ach.id);
              const game = CONEXUS_GAMES.find(g => g.id === ach.gameId);
              const ageCat = AGE_CATEGORIES.find(c => c.age === ach.age);
              const cardRarity = ach.cardReward
                ? RARITY_COLORS[ach.cardReward.rarity] || RARITY_COLORS.common
                : null;

              return (
                <motion.div
                  key={ach.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.02 * i }}
                >
                  <button
                    onClick={() => setSelectedAchievement(ach)}
                    className={`w-full text-left group rounded-lg border overflow-hidden transition-all hover-lift ${
                      earned
                        ? "border-amber-500/30 bg-card/50 hover:border-amber-500/50"
                        : "border-border/20 bg-card/20 hover:border-border/40"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          earned ? "bg-amber-500/20 border border-amber-500/30" : "bg-secondary/50 border border-border/20"
                        }`}>
                          {earned ? (
                            <span className="text-xl">{ach.icon}</span>
                          ) : (
                            <Lock size={20} className="text-muted-foreground/30" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Age badge */}
                          {ageCat && (
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-mono tracking-wider mb-1 ${ageCat.color} ${ageCat.bgColor} border ${ageCat.borderColor}`}>
                              {ageCat.age.toUpperCase()}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className={`font-display text-sm font-bold tracking-wide ${
                            earned ? "text-amber-200" : "text-muted-foreground/40"
                          }`}>
                            {earned ? ach.title : "???"}
                          </h3>

                          {/* Game name */}
                          <p className="font-mono text-[10px] text-muted-foreground/50 truncate">
                            {game?.title ?? "Unknown Story"}
                          </p>

                          {/* Lore preview */}
                          {earned && (
                            <p className="font-mono text-[10px] text-amber-400/50 mt-1.5 line-clamp-2 leading-relaxed italic">
                              "{ach.loreFragment.substring(0, 120)}..."
                            </p>
                          )}

                          {/* Rewards */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`font-mono text-[9px] flex items-center gap-0.5 ${
                              earned ? "text-amber-400/70" : "text-muted-foreground/30"
                            }`}>
                              <Zap size={9} /> +{ach.xpReward} XP
                            </span>
                            {ach.cardReward && cardRarity && (
                              <span className={`font-mono text-[9px] flex items-center gap-0.5 ${
                                earned ? cardRarity.text : "text-muted-foreground/30"
                              }`}>
                                <Gift size={9} /> {earned ? ach.cardReward.name : "???"}
                              </span>
                            )}
                            {earned && (
                              <CheckCircle2 size={12} className="text-green-400/60 ml-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ═══ EMPTY STATE ═══ */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-16 border border-border/20 rounded-lg bg-card/20">
            <Trophy size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-mono text-sm text-muted-foreground">No achievements found for this filter</p>
          </div>
        )}

        {/* ═══ BOTTOM CTA ═══ */}
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 flex items-center gap-4">
          <div className="p-2 rounded-md bg-purple-500/10">
            <BookOpen size={20} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-xs text-purple-300 mb-0.5">Play CoNexus stories to unlock achievements</p>
            <p className="font-mono text-[10px] text-muted-foreground/50">
              Each story has a unique lore fragment and card reward waiting to be discovered.
            </p>
          </div>
          <Link
            href="/conexus-portal"
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] hover:bg-purple-500/30 transition-colors"
          >
            STORY LIBRARY <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* ═══ ACHIEVEMENT DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal
            achievement={selectedAchievement}
            earned={earnedIds.includes(selectedAchievement.id)}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* ═══ LORE NARRATIVE MODAL ═══ */}
      <AnimatePresence>
        {showLoreNarrative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoreNarrative(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-amber-500/30 bg-card shadow-2xl"
            >
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-amber-500/20 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Scroll size={16} className="text-amber-400" />
                  <h3 className="font-display text-sm font-bold tracking-wider text-amber-200">
                    COLLECTED LORE FRAGMENTS
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground">({earnedFragments.length})</span>
                </div>
                <button
                  onClick={() => setShowLoreNarrative(false)}
                  className="p-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {earnedFragments.length === 0 ? (
                  <p className="text-center text-muted-foreground font-mono text-sm py-8">
                    No lore fragments collected yet. Play CoNexus stories to unlock them.
                  </p>
                ) : (
                  earnedFragments.map((frag, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="relative pl-6 border-l-2 border-amber-500/20"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-[8px]">{frag.icon}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-display text-xs font-bold text-amber-300">{frag.title}</span>
                        <span className="font-mono text-[8px] text-muted-foreground/40">
                          {frag.age}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                        "{frag.fragment}"
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
