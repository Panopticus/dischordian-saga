/* ═══════════════════════════════════════════════════════
   CONEXUS PORTAL — The Antiquarian's Library Story Game Hub
   All 33 CoNexus interactive story games, categorized by Age
   With game completion tracking, lore achievements, and XP
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useContentReward } from "@/components/ContentRewardToast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronLeft, ExternalLink, Clock, Users, Shield,
  Sparkles, Globe, ChevronRight, Gamepad2, Trophy, Star,
  AlertTriangle, Zap, BookMarked, CheckCircle2, Lock, Scroll
} from "lucide-react";
import {
  CONEXUS_GAMES, AGE_CATEGORIES, DIFFICULTY_COLORS,
  type ConexusGame, type Age
} from "@/data/conexusGames";
import { LORE_ACHIEVEMENTS, getAchievementByGameId, type LoreAchievement } from "@/data/loreAchievements";
import {
  ANTIQUARIAN_ASSIGNMENTS,
  assignmentCompletionFlag,
  getActiveAssignments,
  getAntiquarianTrust,
} from "@/data/antiquarianAssignments";
import { TOME_PLACEMENTS } from "@/game/livingArk";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";
import GamePreviewTooltip from "@/components/GamePreviewTooltip";
import TomeViewer from "@/components/TomeViewer";

const LIBRARY_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/antiquarian_library_room-dhtjQjrMbU3s3WhnWePBPF.webp";

type FilterAge = "all" | Age;
type ViewMode = "library" | "achievements";

export default function ConexusPortalPage() {
  const [selectedGame, setSelectedGame] = useState<ConexusGame | null>(null);
  const [filterAge, setFilterAge] = useState<FilterAge>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("library");
  const [showAchievementModal, setShowAchievementModal] = useState<LoreAchievement | null>(null);
  const [tomeGame, setTomeGame] = useState<ConexusGame | null>(null);
  const { getEntry } = useLoredex();
  const { state, completeGame, earnLoreAchievement, isGameCompleted, setNarrativeFlag, adjustNpcTrust } = useGame();
  const { recordAndReward } = useContentReward();

  // Antiquarian's prescriptions for the current act + trust tier.
  const activeAssignments = useMemo(
    () => getActiveAssignments({
      narrativeAct: state.narrativeAct ?? 0,
      antiquarianTrust: getAntiquarianTrust(state.npcTrust),
      narrativeFlags: state.narrativeFlags ?? {},
      completedGames: state.completedGames,
    }),
    [state.narrativeAct, state.npcTrust, state.narrativeFlags, state.completedGames],
  );

  // Check which tomes the player has discovered (from Living Ark room events).
  // Trust thresholds read state.npcTrust[npcId] for non-elara NPCs (elara has
  // her own top-level field). Exploration uses room visitCount; quest / game /
  // npc_gift use a single narrativeFlag (npc_gift also requires trust).
  const discoveredTomes = useMemo(() => {
    const discovered = new Set<string>();
    const readTrust = (npc: string): number => {
      if (npc === "elara") return (state as any).elaraTrust ?? 10;
      if (npc === "the_human") return (state as any).humanTrust ?? 0;
      return state.npcTrust?.[npc] ?? 0;
    };
    for (const placement of TOME_PLACEMENTS) {
      if (placement.method === "exploration") {
        const roomKey = placement.roomId.replace(/_/g, "-");
        if (state.rooms?.[roomKey]?.visitCount > 0) discovered.add(placement.tomeId);
        continue;
      }
      if (placement.method === "trust" && placement.trustReq) {
        if (readTrust(placement.trustReq.npc) >= placement.trustReq.min) discovered.add(placement.tomeId);
        continue;
      }
      if (placement.method === "npc_gift" && placement.trustReq) {
        if (readTrust(placement.trustReq.npc) >= placement.trustReq.min) discovered.add(placement.tomeId);
        continue;
      }
      if ((placement.method === "quest" || placement.method === "game") && placement.flagReq) {
        if (state.narrativeFlags?.[placement.flagReq]) discovered.add(placement.tomeId);
      }
    }
    return discovered;
  }, [state.rooms, (state as any).elaraTrust, state.npcTrust, state.narrativeFlags]);

  // Check if a game is discoverable (has a tome placement and is discovered)
  const isGameDiscovered = (gameId: string): boolean => {
    const placement = TOME_PLACEMENTS.find(p => p.tomeId === gameId);
    if (!placement) return true; // Games without placements are always available
    return discoveredTomes.has(gameId);
  };

  const filteredCategories = useMemo(() => {
    if (filterAge === "all") return AGE_CATEGORIES;
    return AGE_CATEGORIES.filter(c => c.age === filterAge);
  }, [filterAge]);

  const totalGames = CONEXUS_GAMES.length;
  const completedCount = state.completedGames.length;
  const achievementCount = state.loreAchievements.length;
  const totalAchievements = LORE_ACHIEVEMENTS.length;
  const completionPercent = totalGames > 0 ? Math.round((completedCount / totalGames) * 100) : 0;

  const handleMarkComplete = (game: ConexusGame) => {
    if (isGameCompleted(game.id)) return;
    completeGame(game.id);
    // Record content participation for card rewards
    recordAndReward("conexus_game", game.id, true, { title: game.title, age: game.age });

    // CoNexus → main saga feedback loop. The flag pattern matches the
    // existing `lockedUntil: "<gameId>_conexus_complete"` gates declared
    // in apps/shared/epochWitnessVotes.ts and the `conexusLoreViewed`
    // relevance boost in apps/shared/epochZeroTriggers.ts. Setting them
    // here is what makes a closed Tome echo into the Witness votes,
    // Epoch Zero discovery weights, and Antiquarian dialogue callbacks.
    setNarrativeFlag(`${game.id}_conexus_complete`, true);
    setNarrativeFlag("conexusLoreViewed", true);
    // Antiquarian dialogue keys off this verb (see ANTIQUARIAN_CALLBACKS
    // "read_tome" in apps/client/src/game/antiquarianRelationship.ts).
    setNarrativeFlag("completed_conexus_story", true);
    // Witnessing other endings is exactly what builds Antiquarian trust.
    adjustNpcTrust("antiquarian", 3);

    // If this game was an active Antiquarian Prescription, close it out
    // and hand the player his postscript so the assignment feels diegetic.
    const assignment = ANTIQUARIAN_ASSIGNMENTS.find((a) => a.gameId === game.id);
    if (assignment && !state.narrativeFlags?.[assignmentCompletionFlag(assignment.id)]) {
      setNarrativeFlag(assignmentCompletionFlag(assignment.id), true);
      adjustNpcTrust("antiquarian", 2);
      toast(assignment.postscript, {
        duration: 9000,
        description: "— The Antiquarian",
      });
    }

    // Also earn the lore achievement
    const ach = getAchievementByGameId(game.id);
    if (ach && !state.loreAchievements.includes(ach.id)) {
      earnLoreAchievement(ach.id);
      toast.success(`Achievement Unlocked: ${ach.title}`, {
        description: `+${ach.xpReward} XP — ${ach.loreFragment.substring(0, 80)}...`,
        duration: 5000,
      });
    } else {
      toast.success(`Story Complete: ${game.title}`, {
        description: "Your progress has been recorded in the Antiquarian's ledger.",
      });
    }
  };

  const handlePlayGame = (game: ConexusGame) => {
    setTomeGame(game);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={LIBRARY_BG} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>
        <div className="relative px-4 sm:px-6 pt-6 pb-8 sm:pt-10 sm:pb-12">
          <Link
            href="/ark"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft size={14} />
            RETURN TO ARK
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-purple-500/50" />
            <span className="font-mono text-[10px] void-text-system tracking-[0.4em]">
              POCKET DIMENSION // OUTSIDE TIME
            </span>
            <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-foreground mb-2 leading-tight">
            THE <span className="void-text-system" style={{ textShadow: "0 0 20px color-mix(in oklch, var(--energy-system) 50%, transparent)" }}>ANTIQUARIAN'S</span> LIBRARY
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl mb-4 leading-relaxed">
            A hidden pocket dimension woven from secret magics and cunning technology. Here, suspended beyond
            the reach of time, the <span className="void-text-system">Antiquarian</span> watches the universe
            through the <span className="void-text-accent">Orb of Worlds</span> — a miniature city floating
            within a glove on his desk. Each story is a window into another reality of the{" "}
            <span className="text-primary">Dischordian Saga</span>.
          </p>

          {/* Progress bar */}
          <div className="max-w-md mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] void-text-system tracking-wider">SAGA PROGRESS</span>
              <span className="font-mono text-[10px] void-text-system">{completedCount}/{totalGames} STORIES</span>
            </div>
            <div className="h-2 rounded-full void-bg-system border void-border-system overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[10px] text-muted-foreground/50">{completionPercent}% COMPLETE</span>
              <span className="font-mono text-[10px] void-text-accent">{state.conexusXp} XP EARNED</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-md void-bg-system border void-border-system void-text-system text-xs font-mono">
              {totalGames} STORIES ACROSS {AGE_CATEGORIES.length} AGES
            </span>
            <a
              href="https://conexus.ink/s/Dischordian%20Saga"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-md void-bg-system border void-border-system void-text-system text-xs font-mono void-bg-system transition-all"
            >
              <Globe size={14} />
              ENTER CONEXUS
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
            </a>
            <Link
              href="/saga-timeline"
              className="group flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/50 text-foreground text-xs font-mono hover:bg-secondary/80 transition-all"
            >
              <Clock size={14} />
              SAGA TIMELINE
              <ChevronRight size={12} className="opacity-60 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 space-y-6 pb-8">
        {/* ═══ VIEW TOGGLE ═══ */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("library")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider border transition-all ${
              viewMode === "library"
                ? "void-bg-system void-border-system void-text-system"
                : "bg-secondary/50 border-border/30 text-muted-foreground void-border-system"
            }`}
          >
            <BookOpen size={14} />
            STORY LIBRARY
          </button>
          <button
            onClick={() => setViewMode("achievements")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider border transition-all ${
              viewMode === "achievements"
                ? "void-bg-sunk void-border void-text-accent"
                : "bg-secondary/50 border-border/30 text-muted-foreground void-border"
            }`}
          >
            <Trophy size={14} />
            LORE ACHIEVEMENTS ({achievementCount}/{totalAchievements})
          </button>
        </div>

        {viewMode === "achievements" ? (
          /* ═══ ACHIEVEMENTS VIEW ═══ */
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="void-surface void-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md void-bg-sunk mt-0.5">
                  <Scroll size={16} className="void-text-accent" />
                </div>
                <div>
                  <p className="font-mono text-xs void-text-accent mb-1 tracking-wider">LORE FRAGMENTS</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each CoNexus story holds a hidden lore fragment — a piece of the greater truth behind the
                    Dischordian Saga. Complete a story to unlock its fragment and earn XP. Collect all{" "}
                    <span className="void-text-accent">{totalAchievements}</span> fragments to reveal the
                    Antiquarian's deepest secret.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LORE_ACHIEVEMENTS.map((ach, i) => {
                const earned = state.loreAchievements.includes(ach.id);
                const game = CONEXUS_GAMES.find(g => g.id === ach.gameId);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.02 * i }}
                  >
                    <button
                      onClick={() => earned ? setShowAchievementModal(ach) : (game && setSelectedGame(game))}
                      className={`w-full text-left rounded-lg border p-3 transition-all ${
                        earned
                          ? "void-border void-bg-sunk void-border"
                          : "border-border/20 bg-card/20 opacity-60 hover:opacity-80 hover:border-border/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md shrink-0 ${earned ? "void-bg-sunk" : "bg-secondary/50"}`}>
                          {earned ? (
                            <Star size={16} className="void-text-accent" />
                          ) : (
                            <Lock size={16} className="text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-mono text-xs font-semibold truncate ${earned ? "void-text-accent" : "text-muted-foreground/60"}`}>
                            {earned ? ach.title : "???"}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground/50 truncate">
                            {game?.title ?? "Unknown Story"}
                          </p>
                          {earned && (
                            <p className="font-mono text-[10px] void-text-accent mt-1 line-clamp-2">
                              {ach.loreFragment.substring(0, 100)}...
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`font-mono text-[9px] ${earned ? "void-text-accent" : "text-muted-foreground/30"}`}>
                              +{ach.xpReward} XP
                            </span>
                            {ach.cardReward && (
                              <span className={`font-mono text-[9px] ${earned ? "void-text-system" : "text-muted-foreground/30"}`}>
                                + CARD
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ═══ LIBRARY VIEW ═══ */
          <>
            {/* Antiquarian's Prescriptions — act/trust-aware tome assignments */}
            {activeAssignments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="void-surface void-border p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Scroll size={14} className="void-text-accent" />
                  <span className="font-mono text-[10px] void-text-accent tracking-[0.3em]">
                    THE ANTIQUARIAN HAS LAID OUT {activeAssignments.length} TOME{activeAssignments.length === 1 ? "" : "S"} FOR YOU
                  </span>
                </div>
                {activeAssignments.map((assignment) => {
                  const game = CONEXUS_GAMES.find(g => g.id === assignment.gameId);
                  if (!game) return null;
                  return (
                    <div key={assignment.id} className="rounded-lg border void-border void-bg-sunk p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed italic mb-2">
                        "{assignment.prescription}"
                      </p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                          <BookOpen size={11} className="void-text-accent" />
                          <span className="void-text-accent">{game.title}</span>
                          <span>·</span>
                          <span>{game.estimatedTime}</span>
                        </div>
                        <button
                          onClick={() => setTomeGame(game)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md void-bg-system border void-border-system void-text-system text-[10px] font-mono tracking-wider transition-all"
                        >
                          ACCEPT TOME
                          <ChevronRight size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Lore Intro */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="void-surface void-border-system p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md void-bg-system mt-0.5">
                  <BookMarked size={16} className="void-text-system" />
                </div>
                <div>
                  <p className="font-mono text-xs void-text-system mb-1 tracking-wider">ANTIQUARIAN'S NOTE</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "I have watched every epoch unfold. Every betrayal, every sacrifice, every moment of hope
                    crushed beneath the weight of inevitability. These stories are not fiction — they are windows
                    into parallel timelines, each one as real as the one you inhabit. Touch the Orb. Choose a
                    reality. And remember: in the Dischordian Saga, every choice echoes across every universe."
                  </p>
                  <p className="font-mono text-[10px] void-text-system mt-2">
                    — The Antiquarian, formerly known as The Programmer (Dr. Daniel Cross)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Age Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setFilterAge("all")}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider border transition-all ${
                  filterAge === "all"
                    ? "void-bg-system void-border-system void-text-system"
                    : "bg-secondary/50 border-border/30 text-muted-foreground void-border-system"
                }`}
              >
                ALL AGES ({totalGames})
              </button>
              {AGE_CATEGORIES.map(cat => {
                const catCompleted = cat.games.filter(g => isGameCompleted(g.id)).length;
                return (
                  <button
                    key={cat.age}
                    onClick={() => setFilterAge(cat.age)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider border transition-all ${
                      filterAge === cat.age
                        ? `${cat.bgColor} ${cat.borderColor} ${cat.color}`
                        : "bg-secondary/50 border-border/30 text-muted-foreground void-border-system"
                    }`}
                  >
                    {cat.age.toUpperCase()} ({catCompleted}/{cat.games.length})
                  </button>
                );
              })}
            </div>

            {/* Age Sections */}
            {filteredCategories.map((category, catIdx) => {
              const catCompleted = category.games.filter(g => isGameCompleted(g.id)).length;
              return (
                <motion.section
                  key={category.age}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * catIdx }}
                >
                  {/* Age Header with Cover Art */}
                  <div className={`rounded-lg border ${category.borderColor} overflow-hidden mb-4`}>
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <img
                        src={category.coverImage}
                        alt={category.age}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.iconGlyph}</span>
                            <div>
                              <h2 className={`font-display text-sm font-bold tracking-[0.15em] ${category.color}`}>
                                {category.age.toUpperCase()}
                              </h2>
                              <p className="font-mono text-[10px] text-muted-foreground/70">
                                {category.games.length} STORIES
                              </p>
                            </div>
                          </div>
                          {catCompleted > 0 && (
                            <span className="px-2 py-1 rounded-md void-bg-success border void-border-success void-text-energy text-[10px] font-mono">
                              {catCompleted}/{category.games.length} COMPLETE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed mt-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Game Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {category.games.map((game, i) => {
                      const completed = isGameCompleted(game.id);
                      const achievement = getAchievementByGameId(game.id);
                      const achievementEarned = achievement && state.loreAchievements.includes(achievement.id);
                      return (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.03 * i }}
                        >
                          <GamePreviewTooltip game={game}>
                          <button
                            onClick={() => setSelectedGame(game)}
                            className={`w-full text-left group rounded-lg border overflow-hidden hover-lift transition-all ${
                              completed
                                ? "void-border-success bg-card/40"
                                : "border-border/30 bg-card/30 void-border-system"
                            }`}
                          >
                            {/* Cover art poster */}
                            <div className="aspect-[16/10] overflow-hidden relative bg-gradient-to-br from-purple-900/40 to-indigo-900/40">
                              {game.coverImage ? (
                                <img
                                  src={game.coverImage}
                                  alt={game.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <BookOpen size={28} className="void-text-system" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {/* Completion badge */}
                              {completed && (
                                <div className="absolute top-2 left-2">
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider void-bg-success border void-border-success void-text-energy">
                                    <CheckCircle2 size={9} /> COMPLETE
                                  </span>
                                </div>
                              )}

                              {/* Achievement badge */}
                              {achievementEarned && (
                                <div className="absolute top-2 right-2">
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-mono void-bg-sunk border void-border void-text-accent">
                                    <Star size={8} />
                                  </span>
                                </div>
                              )}

                              {/* Difficulty badge */}
                              {!completed && (
                                <div className="absolute top-2 right-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                                    {game.difficulty.toUpperCase()}
                                  </span>
                                </div>
                              )}

                              {/* Title overlay */}
                              <div className="absolute bottom-2 left-2.5 right-2.5">
                                <p className="font-display text-xs font-bold text-foreground tracking-wide leading-tight">
                                  {game.title}
                                </p>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-2.5 space-y-1.5">
                              <p className="font-mono text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {game.description}
                              </p>
                              <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/50">
                                <span className="flex items-center gap-0.5">
                                  <Clock size={9} /> {game.estimatedTime}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Users size={9} /> {game.characters.length}
                                </span>
                                {achievement && (
                                  <span className="flex items-center gap-0.5 void-text-accent">
                                    <Star size={9} /> +{achievement.xpReward} XP
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                          </GamePreviewTooltip>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}

            {/* CoNexus Info */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="void-surface p-4"
            >
              <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2 mb-3">
                <Gamepad2 size={14} className="void-text-system" />
                ABOUT CONEXUS
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                CoNexus is the flagship app from <span className="text-foreground">DGRS Labs</span> — a GenAI
                ecosystem for storytelling. Using a text-to-story engine, CoNexus transforms how interactive
                narratives are created and experienced. Every playthrough is unique, shaped by your choices and
                powered by AI that adapts to your decisions in real-time.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                The Dischordian Saga is the foundational narrative that led to the creation of CoNexus itself.
                These {totalGames} story games span the complete mythology — from the Age of Privacy through the Fall of Reality
                and into the Age of Potentials. Each game is infinitely generative: no two playthroughs are ever the same.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://conexus.ink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md void-bg-system border void-border-system void-text-system text-[10px] font-mono void-bg-system transition-all"
                >
                  <Globe size={10} /> CONEXUS.INK <ExternalLink size={9} />
                </a>
                <a
                  href="https://dgrslabs.ink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border/30 text-muted-foreground text-[10px] font-mono hover:bg-secondary/80 transition-all"
                >
                  <Zap size={10} /> DGRS LABS <ExternalLink size={9} />
                </a>
              </div>
            </motion.section>
          </>
        )}
      </div>

      {/* ═══ GAME DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGame(null)}
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto void-surface void-border-system shadow-2xl"
            >
              {/* Header */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/60 to-indigo-900/60 flex items-center justify-center overflow-hidden">
                {selectedGame.coverImage ? (
                  <img
                    src={selectedGame.coverImage}
                    alt={selectedGame.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <BookOpen size={48} className="void-text-system" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <button
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-border flex items-center justify-center text-foreground/85 hover:text-foreground transition-colors"
                >
                  ×
                </button>
                {isGameCompleted(selectedGame.id) && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono void-bg-success border void-border-success void-text-energy backdrop-blur-sm">
                      <CheckCircle2 size={12} /> COMPLETED
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    {AGE_CATEGORIES.map(cat => cat.age === selectedGame.age ? (
                      <span key={cat.age} className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border ${cat.color} ${cat.borderColor} bg-muted/60 backdrop-blur-sm`}>
                        {cat.age.toUpperCase()}
                      </span>
                    ) : null)}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border ${DIFFICULTY_COLORS[selectedGame.difficulty]}`}>
                      {selectedGame.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-black tracking-wider text-foreground">
                    {selectedGame.title}
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedGame.description}
                </p>

                {/* Lore Achievement */}
                {(() => {
                  const ach = getAchievementByGameId(selectedGame.id);
                  if (!ach) return null;
                  const earned = state.loreAchievements.includes(ach.id);
                  return (
                    <div className={`rounded-lg border p-3 ${
                      earned
                        ? "void-border void-bg-sunk"
                        : "border-border/20 bg-secondary/20"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {earned ? (
                          <Star size={14} className="void-text-accent" />
                        ) : (
                          <Lock size={14} className="text-muted-foreground/40" />
                        )}
                        <span className={`font-mono text-[10px] tracking-wider ${earned ? "void-text-accent" : "text-muted-foreground/50"}`}>
                          LORE ACHIEVEMENT
                        </span>
                        <span className={`font-mono text-[10px] ml-auto ${earned ? "void-text-accent" : "text-muted-foreground/30"}`}>
                          +{ach.xpReward} XP
                        </span>
                      </div>
                      <p className={`font-mono text-xs font-semibold ${earned ? "void-text-accent" : "text-muted-foreground/40"}`}>
                        {earned ? ach.title : "???"}
                      </p>
                      {earned && (
                        <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed italic">
                          "{ach.loreFragment}"
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Characters */}
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">FEATURED CHARACTERS</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame.characters.map(char => {
                      const entry = getEntry(char);
                      return (
                        <Link
                          key={char}
                          href={entry ? `/entity/${entry.id}` : "#"}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-secondary/50 border border-border/30 hover:border-primary/30 transition-all group"
                        >
                          {entry?.image ? (
                            <img src={entry.image} alt={char} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <Users size={12} className="text-muted-foreground" />
                          )}
                          <span className="font-mono text-[10px] text-foreground group-hover:text-primary transition-colors">
                            {char}
                          </span>
                          {entry && (
                            <ChevronRight size={10} className="text-muted-foreground/40 group-hover:text-primary/60" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/60">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {selectedGame.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield size={12} /> {selectedGame.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedGame.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-secondary/50 text-muted-foreground/60 border border-border/20">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 18+ warning */}
                {selectedGame.tags.includes("18+") && (
                  <div className="void-surface void-border p-3 flex items-start gap-2">
                    <AlertTriangle size={14} className="void-text-accent mt-0.5 shrink-0" />
                    <p className="text-xs void-text-accent">
                      This story contains mature content and is intended for players 18 years and older.
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handlePlayGame(selectedGame)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg void-bg-system void-bg-system text-foreground text-sm font-mono tracking-wider transition-all group"
                  >
                    <Gamepad2 size={16} />
                    PLAY ON CONEXUS
                    <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
                  </button>

                  {!isGameCompleted(selectedGame.id) ? (
                    <button
                      onClick={() => {
                        handleMarkComplete(selectedGame);
                        setSelectedGame(null);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg void-bg-success border void-border-success void-text-energy text-xs font-mono tracking-wider void-bg-success transition-all"
                    >
                      <CheckCircle2 size={14} />
                      MARK AS COMPLETED
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg void-bg-success border void-border-success void-text-energy text-xs font-mono tracking-wider">
                      <CheckCircle2 size={14} />
                      STORY COMPLETED
                    </div>
                  )}
                </div>

                <p className="text-center text-[10px] font-mono text-muted-foreground/40">
                  Opens in a new tab on conexus.ink — powered by DGRS Labs
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ACHIEVEMENT DETAIL MODAL ═══ */}
      <AnimatePresence>
        {showAchievementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAchievementModal(null)}
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md void-surface void-border shadow-2xl p-6"
            >
              <button
                onClick={() => setShowAchievementModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg void-bg-sunk border void-border">
                  <Star size={24} className="void-text-accent" />
                </div>
                <div>
                  <p className="font-mono text-[10px] void-text-accent tracking-wider">LORE ACHIEVEMENT</p>
                  <h3 className="font-display text-lg font-bold void-text-accent">{showAchievementModal.title}</h3>
                </div>
              </div>

              <div className="void-surface void-border p-4 mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{showAchievementModal.loreFragment}"
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/60">
                <span className="void-text-accent">+{showAchievementModal.xpReward} XP</span>
                {showAchievementModal.cardReward && (
                  <span className="void-text-system">+ {showAchievementModal.cardReward.name} Card</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TOME VIEWER ═══ */}
      <AnimatePresence>
        {tomeGame && (
          <TomeViewer
            game={tomeGame}
            isCompleted={isGameCompleted(tomeGame.id)}
            onComplete={() => {
              handleMarkComplete(tomeGame);
              setTomeGame(null);
            }}
            onClose={() => setTomeGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
