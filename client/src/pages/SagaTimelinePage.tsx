/* ═══════════════════════════════════════════════════════
   SAGA TIMELINE — Chronological map of the Dischordian Saga
   across 5 Ages with all 33 CoNexus games, completion
   tracking, and lore achievements.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Music, Tv, Gamepad2, Users, Eye, ExternalLink,
  ChevronRight, ChevronLeft, Zap, BookOpen, Star, Disc3,
  CheckCircle2, Trophy, Lock
} from "lucide-react";
import { CONEXUS_GAMES, AGE_CATEGORIES, type ConexusGame, type Age } from "@/data/conexusGames";
import { getAchievementByGameId } from "@/data/loreAchievements";

/* ─── TIMELINE ERAS ─── */
interface TimelineEra {
  age: Age;
  eraLabel: string;
  yearRange: string;
  color: string;
  bgGradient: string;
  glowColor: string;
  description: string;
  loreQuote: string;
}

const TIMELINE_ERAS: TimelineEra[] = [
  {
    age: "The Age of Privacy",
    eraLabel: "ERA I",
    yearRange: "2020–2030",
    color: "#3b82f6",
    bgGradient: "from-blue-500/20 to-blue-500/5",
    glowColor: "rgba(59,130,246,0.4)",
    description: "The world before the Fall. Surveillance capitalism, digital resistance, and the seeds of revolution.",
    loreQuote: "In the Age of Privacy, the greatest weapon was information — and the greatest crime was keeping it to yourself.",
  },
  {
    age: "Haven: Sundown Bazaar",
    eraLabel: "ERA II",
    yearRange: "2030–2035",
    color: "#f59e0b",
    bgGradient: "from-amber-500/20 to-amber-500/5",
    glowColor: "rgba(245,158,11,0.4)",
    description: "The underground market where deals are made in shadows. Haven exists outside the law, outside time.",
    loreQuote: "At Sundown, everything has a price. The question is whether you can afford what it costs to leave.",
  },
  {
    age: "Fall of Reality (Prequel)",
    eraLabel: "ERA III",
    yearRange: "2035–2045",
    color: "#ef4444",
    bgGradient: "from-red-500/20 to-red-500/5",
    glowColor: "rgba(239,68,68,0.4)",
    description: "The collapse of civilization as we knew it. The Panopticon rises, reality fractures, and heroes emerge from the ashes.",
    loreQuote: "Reality didn't fall — it was pushed. And the ones who pushed it are still watching.",
  },
  {
    age: "Age of Potentials",
    eraLabel: "ERA IV",
    yearRange: "2045–2060",
    color: "#34d399",
    bgGradient: "from-emerald-500/20 to-emerald-500/5",
    glowColor: "rgba(52,211,153,0.4)",
    description: "After the Fall, new powers awaken. The Potentials — humans with extraordinary abilities — reshape the world.",
    loreQuote: "Every Potential carries a universe inside them. The question is whether they'll create or destroy with it.",
  },
  {
    age: "Visions",
    eraLabel: "ERA V",
    yearRange: "Beyond Time",
    color: "#8b5cf6",
    bgGradient: "from-violet-500/20 to-violet-500/5",
    glowColor: "rgba(139,92,246,0.4)",
    description: "Glimpses beyond the veil. Prophetic visions, alternate realities, and the threads that bind all timelines.",
    loreQuote: "The Antiquarian sees all endings. But he also knows that endings are just beginnings wearing different masks.",
  },
];

/* ─── SUPPLEMENTARY TIMELINE NODES (Albums, Epochs) ─── */
interface SupplementaryNode {
  id: string;
  title: string;
  subtitle: string;
  type: "album" | "epoch";
  era: Age;
  description: string;
  link?: string;
  songs?: number;
  year?: string;
  characters?: string[];
}

const SUPPLEMENTARY_NODES: SupplementaryNode[] = [
  {
    id: "album-dischordian",
    title: "Dischordian Logic",
    subtitle: "Album // 29 Tracks",
    type: "album",
    era: "Fall of Reality (Prequel)",
    description: "The foundational album spanning the entire saga. From the Seeds of Inception to the final confrontation.",
    link: "/album/dischordian-logic",
    songs: 29,
    year: "2025",
  },
  {
    id: "album-age-of-privacy",
    title: "The Age of Privacy",
    subtitle: "Album // 20 Tracks",
    type: "album",
    era: "The Age of Privacy",
    description: "Set in the era of surveillance and control. The fight for individual freedom defines this chapter.",
    link: "/album/age-of-privacy",
    songs: 20,
    year: "2025",
  },
  {
    id: "album-book-of-daniel",
    title: "The Book of Daniel 2:47",
    subtitle: "Album // 22 Tracks",
    type: "album",
    era: "Age of Potentials",
    description: "The Programmer's story. Dr. Daniel Cross travels through time, becoming the Antiquarian.",
    link: "/album/book-of-daniel",
    songs: 22,
    year: "2025",
  },
  {
    id: "album-silence",
    title: "Silence in Heaven",
    subtitle: "Album // 18 Tracks",
    type: "album",
    era: "Visions",
    description: "The final album before the great silence. When the seventh seal is broken, there is silence in heaven.",
    link: "/album/silence-in-heaven",
    songs: 18,
    year: "2026",
  },
  {
    id: "epoch-zero",
    title: "Epoch Zero: The Fall of Reality",
    subtitle: "The Prequel Series",
    type: "epoch",
    era: "Fall of Reality (Prequel)",
    description: "The end of human civilization as it was known. The Architect, the Enigma, and the first Potentials emerge.",
    link: "/watch",
    characters: ["The Architect", "The Enigma", "The Human", "The Warlord"],
  },
  {
    id: "epoch-1",
    title: "First Epoch: The Awakening",
    subtitle: "Season 1",
    type: "epoch",
    era: "Age of Potentials",
    description: "The Potentials awaken in a strange new world. Alliances form, enemies emerge.",
    link: "/watch",
    characters: ["The Human", "Iron Lion", "The Collector", "The Oracle"],
  },
];

export default function SagaTimelinePage() {
  const { getEntry } = useLoredex();
  const { state, isGameCompleted } = useGame();
  const [activeAge, setActiveAge] = useState<Age | null>(null);
  const [selectedGame, setSelectedGame] = useState<ConexusGame | null>(null);
  const [viewMode, setViewMode] = useState<"vertical" | "horizontal">("vertical");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalGames = CONEXUS_GAMES.length;
  const completedCount = state.completedGames.length;
  const achievementCount = state.loreAchievements.length;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [viewMode]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* ═══ HEADER ═══ */}
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">
            TEMPORAL CARTOGRAPHY // CLASSIFIED
          </span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          THE <span className="text-primary glow-cyan">SAGA</span> TIMELINE
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-2xl mb-4">
          A chronological map of the <span className="text-primary">Dischordian Saga</span> across{" "}
          <span className="text-foreground">{TIMELINE_ERAS.length} eras</span> and{" "}
          <span className="text-foreground">{totalGames} interactive stories</span>. Each era represents
          a distinct epoch in the mythology.
        </p>

        {/* Stats bar */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
            <CheckCircle2 size={11} className="inline mr-1" />
            {completedCount}/{totalGames} STORIES
          </span>
          <span className="px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Trophy size={11} className="inline mr-1" />
            {achievementCount} ACHIEVEMENTS
          </span>
          <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Zap size={11} className="inline mr-1" />
            {state.conexusXp} XP
          </span>
        </div>

        {/* View mode + era filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("vertical")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                viewMode === "vertical"
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary/30 border-border/30 text-muted-foreground"
              }`}
            >
              VERTICAL
            </button>
            <button
              onClick={() => setViewMode("horizontal")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                viewMode === "horizontal"
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary/30 border-border/30 text-muted-foreground"
              }`}
            >
              HORIZONTAL
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveAge(null)}
              className={`shrink-0 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                activeAge === null
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary/30 border-border/30 text-muted-foreground"
              }`}
            >
              ALL ERAS
            </button>
            {TIMELINE_ERAS.map(era => (
              <button
                key={era.age}
                onClick={() => setActiveAge(activeAge === era.age ? null : era.age)}
                className={`shrink-0 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all`}
                style={{
                  backgroundColor: activeAge === era.age ? `${era.color}15` : undefined,
                  borderColor: activeAge === era.age ? `${era.color}60` : undefined,
                  color: activeAge === era.age ? era.color : undefined,
                }}
              >
                {era.eraLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HORIZONTAL TIMELINE ═══ */}
      {viewMode === "horizontal" && (
        <div className="relative mb-8">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm"
            >
              <ChevronRight size={16} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex items-start gap-0 min-w-max py-4">
              {TIMELINE_ERAS.filter(era => activeAge === null || activeAge === era.age).map((era, eraIdx) => {
                const cat = AGE_CATEGORIES.find(c => c.age === era.age);
                const games = cat?.games ?? [];
                const completed = games.filter(g => isGameCompleted(g.id)).length;

                return (
                  <div key={era.age} className="flex items-start">
                    {/* Era header node */}
                    <div className="flex flex-col items-center w-44 sm:w-52">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: era.color, boxShadow: `0 0 12px ${era.glowColor}` }}
                      >
                        <Star size={10} style={{ color: era.color }} />
                      </div>
                      <div className="w-0.5 h-3" style={{ backgroundColor: `${era.color}30` }} />
                      <div
                        className="w-full rounded-lg border p-3 text-left"
                        style={{ borderColor: `${era.color}40`, backgroundColor: `${era.color}08` }}
                      >
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border mb-1.5"
                          style={{ borderColor: `${era.color}40`, color: era.color }}
                        >
                          {era.eraLabel}
                        </span>
                        <p className="font-display text-xs font-bold tracking-wide text-foreground leading-tight mb-0.5">
                          {era.age}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground/60">
                          {era.yearRange} // {games.length} stories
                        </p>
                        <div className="mt-2 h-1 rounded-full bg-secondary/30 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${games.length > 0 ? (completed / games.length) * 100 : 0}%`,
                              backgroundColor: era.color,
                            }}
                          />
                        </div>
                        <p className="font-mono text-[8px] text-muted-foreground/40 mt-1">
                          {completed}/{games.length} complete
                        </p>
                      </div>
                    </div>

                    {/* Games in this era */}
                    {games.map((game, i) => (
                      <div key={game.id} className="flex items-start">
                        <div className="flex items-center pt-3 px-0">
                          <div className="w-4 h-0.5" style={{ backgroundColor: `${era.color}20` }} />
                        </div>
                        <button
                          onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                          className="flex flex-col items-center w-36 sm:w-40 group cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110`}
                            style={{
                              borderColor: isGameCompleted(game.id) ? "#22c55e" : `${era.color}60`,
                              backgroundColor: isGameCompleted(game.id) ? "#22c55e20" : "transparent",
                            }}
                          >
                            {isGameCompleted(game.id) ? (
                              <CheckCircle2 size={8} className="text-green-400" />
                            ) : (
                              <Gamepad2 size={7} style={{ color: `${era.color}80` }} />
                            )}
                          </div>
                          <div className="w-0.5 h-3" style={{ backgroundColor: `${era.color}15` }} />
                          <div
                            className={`w-full rounded-lg border p-2.5 text-left transition-all ${
                              selectedGame?.id === game.id ? "bg-card/80 shadow-lg" : "bg-card/20 group-hover:bg-card/40"
                            }`}
                            style={{
                              borderColor: selectedGame?.id === game.id
                                ? `${era.color}60`
                                : isGameCompleted(game.id) ? "#22c55e30" : "var(--border)",
                            }}
                          >
                            <p className="font-display text-[10px] font-bold tracking-wide text-foreground leading-tight truncate">
                              {game.title}
                            </p>
                            <p className="font-mono text-[8px] text-muted-foreground/50 truncate mt-0.5">
                              {game.estimatedTime}
                            </p>
                          </div>
                        </button>
                      </div>
                    ))}

                    {/* Connector between eras */}
                    {eraIdx < TIMELINE_ERAS.filter(e => activeAge === null || activeAge === e.age).length - 1 && (
                      <div className="flex items-center pt-3 px-1">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-border/40 to-border/20" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ VERTICAL TIMELINE ═══ */}
      {viewMode === "vertical" && (
        <div className="px-4 sm:px-6">
          <div className="relative">
            {/* Central timeline line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-red-500/50 to-violet-500/50" />

            {TIMELINE_ERAS.filter(era => activeAge === null || activeAge === era.age).map((era, eraIdx) => {
              const cat = AGE_CATEGORIES.find(c => c.age === era.age);
              const games = cat?.games ?? [];
              const completed = games.filter(g => isGameCompleted(g.id)).length;
              const supplementary = SUPPLEMENTARY_NODES.filter(n => n.era === era.age);

              return (
                <motion.div
                  key={era.age}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * eraIdx }}
                  className="relative mb-8 last:mb-0"
                >
                  {/* Era node on timeline with cover art */}
                  <div className="flex items-start gap-4 sm:gap-6 mb-4">
                    <div
                      className="relative z-10 w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: era.color,
                        backgroundColor: `${era.color}10`,
                        boxShadow: `0 0 20px ${era.glowColor}`,
                      }}
                    >
                      <span className="font-display text-[9px] sm:text-xs font-black" style={{ color: era.color }}>
                        {era.eraLabel.replace("ERA ", "")}
                      </span>
                    </div>

                    <div className="pt-0 sm:pt-1 flex-1">
                      {/* Cover art banner */}
                      {cat?.coverImage && (
                        <div className="relative h-24 sm:h-32 rounded-lg overflow-hidden mb-3 border" style={{ borderColor: `${era.color}30` }}>
                          <img
                            src={cat.coverImage}
                            alt={era.age}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                            <div>
                              <h2 className="font-display text-sm sm:text-lg font-bold tracking-wider drop-shadow-lg" style={{ color: era.color }}>
                                {era.age.toUpperCase()}
                              </h2>
                              <span className="font-mono text-[10px] text-white/50">{era.yearRange}</span>
                            </div>
                            {completed > 0 && (
                              <span className="flex items-center gap-1 font-mono text-[10px] text-green-400/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                                <CheckCircle2 size={10} /> {completed}/{games.length}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {!cat?.coverImage && (
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-display text-sm sm:text-lg font-bold tracking-wider" style={{ color: era.color }}>
                            {era.age.toUpperCase()}
                          </h2>
                          <span className="font-mono text-[10px] text-muted-foreground/50">{era.yearRange}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mb-1">
                        {era.description}
                      </p>
                      <p className="text-[10px] italic text-muted-foreground/40 mb-2 max-w-lg">
                        "{era.loreQuote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {games.length} stories
                        </span>
                        <div className="flex-1 max-w-32 h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${games.length > 0 ? (completed / games.length) * 100 : 0}%`,
                              backgroundColor: era.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supplementary nodes (albums, epochs) */}
                  {supplementary.length > 0 && (
                    <div className="ml-12 sm:ml-20 space-y-2 mb-3">
                      {supplementary.map(node => (
                        <div key={node.id} className="relative">
                          <div
                            className="absolute -left-8 sm:-left-12 top-1/2 w-6 sm:w-10 h-px"
                            style={{ backgroundColor: `${era.color}20` }}
                          />
                          <div
                            className="absolute -left-9 sm:-left-13 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                            style={{ backgroundColor: `${era.color}40` }}
                          />
                          {node.link ? (
                            <Link
                              href={node.link}
                              className="group flex items-center gap-3 p-2.5 rounded-lg border border-border/15 bg-card/15 hover:bg-card/30 hover:border-primary/20 transition-all"
                            >
                              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${era.color}10` }}>
                                {node.type === "album" ? (
                                  <Disc3 size={14} style={{ color: era.color }} />
                                ) : (
                                  <Tv size={14} style={{ color: era.color }} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded text-[7px] font-mono tracking-wider border" style={{ borderColor: `${era.color}30`, color: `${era.color}99` }}>
                                    {node.type === "album" ? "ALBUM" : "SHOW"}
                                  </span>
                                  {node.year && <span className="font-mono text-[8px] text-muted-foreground/40">{node.year}</span>}
                                </div>
                                <p className="font-display text-[11px] font-bold tracking-wide text-foreground/80 group-hover:text-primary transition-colors truncate">
                                  {node.title}
                                </p>
                              </div>
                              <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-primary/60 shrink-0 ml-auto" />
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border/15 bg-card/15">
                              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${era.color}10` }}>
                                <Star size={14} style={{ color: era.color }} />
                              </div>
                              <div>
                                <p className="font-display text-[11px] font-bold tracking-wide text-foreground/80">{node.title}</p>
                                <p className="font-mono text-[9px] text-muted-foreground/40">{node.subtitle}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Games in this era */}
                  <div className="ml-12 sm:ml-20 space-y-1.5">
                    {games.map((game, i) => {
                      const gameCompleted = isGameCompleted(game.id);
                      const ach = getAchievementByGameId(game.id);
                      const achEarned = ach && state.loreAchievements.includes(ach.id);

                      return (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * i + 0.1 * eraIdx }}
                          className="relative"
                        >
                          {/* Connector */}
                          <div
                            className="absolute -left-8 sm:-left-12 top-1/2 w-6 sm:w-10 h-px"
                            style={{ backgroundColor: `${era.color}15` }}
                          />
                          <div
                            className={`absolute -left-9 sm:-left-13 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                              gameCompleted ? "bg-green-400" : ""
                            }`}
                            style={!gameCompleted ? { backgroundColor: `${era.color}30` } : undefined}
                          />

                          <a
                            href={game.conexusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center gap-3 p-2.5 rounded-lg border transition-all hover-lift ${
                              gameCompleted
                                ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                                : "border-border/10 bg-card/10 hover:bg-card/25"
                            }`}
                            style={!gameCompleted ? { ["--hover-border" as string]: `${era.color}30` } : undefined}
                          >
                            {/* Game icon */}
                            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${
                              gameCompleted ? "bg-green-500/10" : ""
                            }`} style={!gameCompleted ? { backgroundColor: `${era.color}08` } : undefined}>
                              {gameCompleted ? (
                                <CheckCircle2 size={16} className="text-green-400" />
                              ) : (
                                <Gamepad2 size={16} style={{ color: `${era.color}80` }} />
                              )}
                            </div>

                            {/* Game info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-mono text-[11px] font-semibold truncate ${
                                  gameCompleted ? "text-green-300/80" : "text-foreground/80"
                                }`}>
                                  {game.title}
                                </p>
                                {achEarned && <Star size={9} className="text-amber-400 shrink-0" />}
                              </div>
                              <p className="font-mono text-[9px] text-muted-foreground/40 truncate">
                                {game.description.substring(0, 70)}...
                              </p>
                            </div>

                            {/* Meta */}
                            <div className="hidden sm:flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[8px] text-muted-foreground/30 flex items-center gap-1">
                                <Clock size={8} /> {game.estimatedTime}
                              </span>
                              {ach && (
                                <span className={`font-mono text-[8px] ${achEarned ? "text-amber-400/60" : "text-muted-foreground/25"}`}>
                                  +{ach.xpReward}XP
                                </span>
                              )}
                              <ExternalLink size={10} className="text-muted-foreground/20 group-hover:text-primary/50" />
                            </div>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ SELECTED GAME DETAIL (Horizontal mode) ═══ */}
      <AnimatePresence>
        {selectedGame && viewMode === "horizontal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-4 sm:mx-6 mt-2"
          >
            <div className="rounded-lg border border-primary/20 bg-card/30 p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {isGameCompleted(selectedGame.id) ? (
                    <CheckCircle2 size={24} className="text-green-400" />
                  ) : (
                    <Gamepad2 size={24} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold tracking-wide text-foreground mb-1">
                    {selectedGame.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {selectedGame.description}
                  </p>
                  {(() => {
                    const ach = getAchievementByGameId(selectedGame.id);
                    if (!ach) return null;
                    const earned = state.loreAchievements.includes(ach.id);
                    return (
                      <div className={`rounded-md border p-2.5 mb-3 ${earned ? "border-amber-500/30 bg-amber-500/5" : "border-border/20 bg-secondary/10"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {earned ? <Trophy size={12} className="text-amber-400" /> : <Lock size={12} className="text-muted-foreground/40" />}
                          <span className={`font-mono text-[10px] font-bold ${earned ? "text-amber-300" : "text-muted-foreground/50"}`}>
                            {ach.title}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground/30">+{ach.xpReward} XP</span>
                        </div>
                        <p className={`font-mono text-[9px] ${earned ? "text-amber-200/60" : "text-muted-foreground/30"}`}>
                          {earned ? ach.loreFragment : "Complete the story to unlock this lore fragment."}
                        </p>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-3">
                    <a
                      href={selectedGame.conexusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
                    >
                      <Gamepad2 size={12} />
                      PLAY ON CONEXUS
                      <ExternalLink size={10} />
                    </a>
                    {selectedGame.characters.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[9px] text-muted-foreground/40 mr-1">CHARACTERS:</span>
                        {selectedGame.characters.slice(0, 3).map(name => {
                          const entry = getEntry(name);
                          return entry?.image ? (
                            <Link key={name} href={`/entity/${entry.id}`}>
                              <img src={entry.image} alt={name} className="w-6 h-6 rounded-full object-cover ring-1 ring-border/20 hover:ring-primary/40 transition-all" />
                            </Link>
                          ) : (
                            <span key={name} className="font-mono text-[9px] text-muted-foreground/40">{name}</span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SAGA SUMMARY ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-4 sm:mx-6 mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5"
      >
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary flex items-center gap-2 mb-3">
          <Eye size={14} />
          THE THREAD OF FATE
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          The Dischordian Saga spans from the mundane surveillance of the Age of Privacy through the
          catastrophic Fall of Reality, into the superhuman Age of Potentials, and beyond into the
          prophetic Visions that transcend time itself. Each story is a thread in a vast tapestry — and
          every thread you pull reveals another layer of truth about the Panopticon, the Potentials, and
          the war for the soul of reality.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/conexus-portal"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono hover:bg-purple-500/20 transition-all"
          >
            <BookOpen size={14} />
            ANTIQUARIAN'S LIBRARY
          </Link>
          <a
            href="https://conexus.ink/s/Dischordian%20Saga"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/50 text-foreground text-xs font-mono hover:bg-secondary/80 transition-all"
          >
            <Zap size={14} />
            ALL ON CONEXUS
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
