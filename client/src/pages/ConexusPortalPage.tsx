/* ═══════════════════════════════════════════════════════
   CONEXUS PORTAL — The Antiquarian's Library Story Game Hub
   Access the CoNexus interactive story games from within the Ark
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronLeft, ExternalLink, Clock, Users, Shield,
  Sparkles, Globe, ChevronRight, Gamepad2,
  AlertTriangle, Zap, BookMarked
} from "lucide-react";
import { CONEXUS_GAMES, DIFFICULTY_COLORS, EPOCH_COLORS, type ConexusGame } from "@/data/conexusGames";
import { useLoredex } from "@/contexts/LoredexContext";

const LIBRARY_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/antiquarian_library_room-dhtjQjrMbU3s3WhnWePBPF.webp";

type FilterEpoch = "all" | string;

export default function ConexusPortalPage() {
  const [selectedGame, setSelectedGame] = useState<ConexusGame | null>(null);
  const [filterEpoch, setFilterEpoch] = useState<FilterEpoch>("all");
  const { getEntry } = useLoredex();

  const epochs = useMemo(() => {
    const set = new Set(CONEXUS_GAMES.map(g => g.epoch));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredGames = useMemo(() => {
    if (filterEpoch === "all") return CONEXUS_GAMES;
    return CONEXUS_GAMES.filter(g => g.epoch === filterEpoch);
  }, [filterEpoch]);

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
            <span className="font-mono text-[10px] text-purple-400/70 tracking-[0.4em]">
              POCKET DIMENSION // OUTSIDE TIME
            </span>
            <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-foreground mb-2 leading-tight">
            THE <span className="text-purple-400" style={{ textShadow: "0 0 20px rgba(168,85,247,0.5)" }}>ANTIQUARIAN'S</span> LIBRARY
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl mb-4 leading-relaxed">
            A hidden pocket dimension woven from secret magics and cunning technology. Here, suspended beyond
            the reach of time, the <span className="text-purple-400">Antiquarian</span> watches the universe
            through the <span className="text-amber-400">Orb of Worlds</span> — a miniature city floating
            within a glove on his desk. Each story is a window into another reality of the{" "}
            <span className="text-primary">Dischordian Saga</span>.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://conexus.ink/s/Dischordian%20Saga"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500/10 border border-purple-500/40 text-purple-300 text-xs font-mono hover:bg-purple-500/20 transition-all"
            >
              <Globe size={14} />
              ENTER CONEXUS
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
            </a>
            <a
              href="https://dgrslabs.ink"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/50 text-foreground text-xs font-mono hover:bg-secondary/80 transition-all"
            >
              <Sparkles size={14} />
              DGRS LABS
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 space-y-6 pb-8">
        {/* ═══ LORE INTRO ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-purple-500/10 mt-0.5">
              <BookMarked size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="font-mono text-xs text-purple-300 mb-1 tracking-wider">ANTIQUARIAN'S NOTE</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "I have watched every epoch unfold. Every betrayal, every sacrifice, every moment of hope
                crushed beneath the weight of inevitability. These stories are not fiction — they are windows
                into parallel timelines, each one as real as the one you inhabit. Touch the Orb. Choose a
                reality. And remember: in the Dischordian Saga, every choice echoes across every universe."
              </p>
              <p className="font-mono text-[10px] text-purple-400/50 mt-2">
                — The Antiquarian, formerly known as The Programmer (Dr. Daniel Cross)
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ EPOCH FILTERS ═══ */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {epochs.map(epoch => (
            <button
              key={epoch}
              onClick={() => setFilterEpoch(epoch)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider border transition-all ${
                filterEpoch === epoch
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                  : "bg-secondary/50 border-border/30 text-muted-foreground hover:border-purple-500/30"
              }`}
            >
              {epoch === "all" ? "ALL EPOCHS" : epoch.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ═══ GAME GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.05 * i }}
              >
                <button
                  onClick={() => setSelectedGame(game)}
                  className="w-full text-left group rounded-lg border border-border/30 bg-card/30 overflow-hidden hover:border-purple-500/40 hover-lift transition-all"
                >
                  {/* Poster */}
                  <div className="aspect-video overflow-hidden relative">
                    {game.posterImage ? (
                      <img
                        src={game.posterImage}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center">
                        <BookOpen size={32} className="text-purple-400/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Epoch badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border bg-black/60 backdrop-blur-sm ${
                        EPOCH_COLORS[game.epoch] || "text-purple-300"
                      } border-current/30`}>
                        {game.epoch.toUpperCase()}
                      </span>
                    </div>

                    {/* Difficulty badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                        {game.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="font-display text-sm font-bold text-white tracking-wide">{game.title}</p>
                      <p className="font-mono text-[10px] text-white/50">{game.season}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <p className="font-mono text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/60">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {game.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={10} /> {game.characters.length} characters
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {game.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-secondary/50 text-muted-foreground/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ═══ CONEXUS INFO ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-border/30 bg-card/30 p-4"
        >
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-purple-400" />
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
            These story games span the complete mythology — from the Age of Privacy through the Fall of Reality
            and into the Age of Potentials. Each game is infinitely generative: no two playthroughs are ever the same.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://conexus.ink"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono hover:bg-purple-500/20 transition-all"
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-purple-500/30 bg-card shadow-2xl"
            >
              {/* Poster header */}
              <div className="relative aspect-video">
                {selectedGame.posterImage ? (
                  <img
                    src={selectedGame.posterImage}
                    alt={selectedGame.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-indigo-900/60 flex items-center justify-center">
                    <BookOpen size={48} className="text-purple-400/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <button
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border ${
                      EPOCH_COLORS[selectedGame.epoch] || "text-purple-300"
                    } border-current/30 bg-black/40 backdrop-blur-sm`}>
                      {selectedGame.epoch.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider border ${DIFFICULTY_COLORS[selectedGame.difficulty]}`}>
                      {selectedGame.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-black tracking-wider text-white">
                    {selectedGame.title}
                  </h2>
                  <p className="font-mono text-[10px] text-white/50">{selectedGame.season}</p>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedGame.description}
                </p>

                {/* Lore context */}
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                  <p className="font-mono text-[10px] text-purple-400 tracking-wider mb-1">LORE CONTEXT</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedGame.loreContext}
                  </p>
                </div>

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
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-300/80">
                      This story contains mature content and is intended for players 18 years and older.
                    </p>
                  </div>
                )}

                {/* CTA */}
                <a
                  href={selectedGame.conexusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-mono tracking-wider transition-all group"
                >
                  <Gamepad2 size={16} />
                  ENTER THIS STORY ON CONEXUS
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
                </a>

                <p className="text-center text-[10px] font-mono text-muted-foreground/40">
                  Opens in a new tab on conexus.ink — powered by DGRS Labs
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
